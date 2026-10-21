import type { NextRequest } from "next/server";
import { API_URL, getAgencyId } from "@/lib/dunastour/server";

/**
 * Proxy do navegador → API do DunasTour. Só as rotas públicas que o checkout precisa passam, e as da
 * agência sempre com o id DESTA agência (resolvido no servidor pelo slug) — o cliente não escolhe.
 * O IP e o navegador do cliente seguem no X-Forwarded-For/User-Agent: a API grava os dois no aceite
 * dos termos e do termo de risco.
 */
const UUID = "[0-9a-fA-F-]{36}";
const GET_ROUTES: { pattern: RegExp; target: (m: RegExpMatchArray, agencyId: string) => string }[] = [
  { pattern: new RegExp(`^tours/(${UUID})/availability$`), target: (m) => `/api/tours/${m[1]}/availability` },
  { pattern: new RegExp(`^tours/(${UUID})/departures$`), target: (m) => `/api/tours/${m[1]}/departures` },
  { pattern: /^closed-days$/, target: (_m, a) => `/api/agencies/${a}/closed-days` },
  { pattern: /^risk-term$/, target: (_m, a) => `/api/agencies/${a}/risk-term` },
];
const POST_ROUTES: Record<string, (agencyId: string) => string> = {
  checkout: (a) => `/api/agencies/${a}/checkout-submissions`,
  "returning-customer": (a) => `/api/agencies/${a}/returning-customer`,
};

function forwardHeaders(req: NextRequest) {
  const headers = new Headers({ Accept: "application/json" });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip");
  if (ip) headers.set("X-Forwarded-For", ip);
  const ua = req.headers.get("user-agent");
  if (ua) headers.set("User-Agent", ua);
  return headers;
}

async function relay(res: Response) {
  const body = res.status === 204 ? null : await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" },
  });
}

const notFound = () => Response.json({ message: "Rota não encontrada" }, { status: 404 });
const unavailable = () => Response.json({ message: "Não foi possível falar com o sistema de reservas. Tente de novo em instantes." }, { status: 502 });

export async function GET(req: NextRequest, ctx: RouteContext<"/api/dunas/[...path]">) {
  const path = (await ctx.params).path.join("/");
  const route = GET_ROUTES.map((r) => ({ r, m: path.match(r.pattern) })).find((x) => x.m);
  if (!route) return notFound();
  const agencyId = await getAgencyId();
  if (!agencyId) return unavailable();
  const search = req.nextUrl.search;
  try {
    const res = await fetch(`${API_URL}${route.r.target(route.m!, agencyId)}${search}`, {
      headers: forwardHeaders(req),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    return relay(res);
  } catch {
    return unavailable();
  }
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/dunas/[...path]">) {
  const path = (await ctx.params).path.join("/");
  const target = POST_ROUTES[path];
  if (!target) return notFound();
  const agencyId = await getAgencyId();
  if (!agencyId) return unavailable();
  const headers = forwardHeaders(req);
  headers.set("Content-Type", "application/json");
  try {
    const res = await fetch(`${API_URL}${target(agencyId)}`, {
      method: "POST",
      headers,
      body: await req.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    return relay(res);
  } catch {
    return unavailable();
  }
}
