"use client";

import type {
  CheckoutSubmissionResponse,
  CreateCheckoutSubmissionRequest,
  PublicAvailability,
  ReturningCustomer,
  RiskTerm,
  TrekDeparture,
} from "./types";

/** Chamadas do navegador — sempre pelo proxy /api/dunas (ver app/api/dunas/[...path]/route.ts). */
async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  const res = await fetch(`/api/dunas/${path}`, init);
  if (res.status === 204) return null;
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(errorMessage(data) ?? "Algo deu errado. Tente de novo.");
  return data as T;
}

function errorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as { message?: string; error?: string; errors?: Record<string, string> | string[]; fieldErrors?: Record<string, string> };
  if (d.fieldErrors && Object.keys(d.fieldErrors).length) return `${d.message ?? "Dados inválidos"}: ${Object.values(d.fieldErrors).join("; ")}`;
  if (d.message) return d.message;
  if (d.errors) return Object.values(d.errors).join(" ");
  return d.error ?? null;
}

const post = <T>(path: string, body: unknown) =>
  call<T>(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

/** Dias e vagas. Trekking usa as saídas cadastradas (só sai nesses dias). */
export async function fetchAvailability(tourId: string, trek: boolean): Promise<PublicAvailability> {
  if (trek) {
    const deps = (await call<TrekDeparture[]>(`tours/${tourId}/departures`)) ?? [];
    return {
      mode: "DATES",
      days: deps.map((d) => ({ date: d.date, seats: d.seats, booked: d.booked ?? 0, left: d.left ?? d.seats, open: true })),
    };
  }
  return (await call<PublicAvailability>(`tours/${tourId}/availability`)) ?? { mode: null, days: [] };
}

export const fetchClosedDays = async () => (await call<string[]>("closed-days")) ?? [];

export function fetchRiskTerm(tourIds: string[], packageIds: string[]) {
  const params = new URLSearchParams();
  if (tourIds.length) params.set("tourIds", tourIds.join(","));
  if (packageIds.length) params.set("packageIds", packageIds.join(","));
  return call<RiskTerm>(`risk-term?${params}`);
}

export const lookupReturningCustomer = (phone: string, cpf: string) => post<ReturningCustomer>("returning-customer", { phone, cpf });

export const submitCheckout = (body: CreateCheckoutSubmissionRequest) => post<CheckoutSubmissionResponse[]>("checkout", body);
