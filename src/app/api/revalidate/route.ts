import { after, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getPackages, getTours } from "@/lib/dunastour/server";

/**
 * Webhook do DunasTour: quando a agência salva um passeio/pacote, a API chama esta rota (SiteRevalidateService) e o
 * cache das leituras (tag "dunastour") expira na hora. Depois da resposta, as páginas principais já são renderizadas de
 * novo em segundo plano — o próximo visitante pega a versão nova pronta, sem esperar a API.
 * Protegida por REVALIDATE_SECRET, no header `x-revalidate-secret` ou em `?secret=`.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = req.headers.get("x-revalidate-secret") ?? req.nextUrl.searchParams.get("secret");
  if (!secret || given !== secret) return Response.json({ message: "Não autorizado" }, { status: 401 });
  revalidateTag("dunastour", { expire: 0 });
  // O sitemap gerado no build (sem acesso à API) não fica marcado com a tag; expira pelo caminho.
  revalidatePath("/sitemap.xml");

  const origin = req.nextUrl.origin;
  after(async () => {
    const [tours, packages] = await Promise.all([getTours(), getPackages()]);
    // Slug quando o servidor já gera (links novos), senão o id (links antigos).
    const param = (item: { id: string }) => (item as { slug?: string }).slug ?? item.id;
    const paths = ["/", "/passeios", "/galeria", "/reservar", "/sitemap.xml", ...tours.map((t) => `/passeios/${param(t)}`), ...packages.map((p) => `/pacotes/${param(p)}`)];
    await Promise.allSettled(paths.map((p) => fetch(`${origin}${p}`, { cache: "no-store", signal: AbortSignal.timeout(20_000) })));
  });

  return Response.json({ revalidated: true, now: Date.now() });
}

export const GET = POST;
