import type { TourCard } from "@/lib/dunastour/types";

// Nomes das cidades do transfer (ids de dunas-tour-web/src/lib/rota-das-emocoes.ts — Tour.transferFrom/transferTo).
const CITIES: Record<string, string> = {
  "sao-luis": "São Luís",
  "santo-amaro": "Santo Amaro",
  lencois: "Lençóis Maranhenses",
  barreirinhas: "Barreirinhas",
  atins: "Atins",
  cabure: "Caburé",
  "paulino-neves": "Paulino Neves",
  tutoia: "Tutóia",
  delta: "Delta do Parnaíba",
  parnaiba: "Parnaíba",
  "barra-grande": "Barra Grande",
  camocim: "Camocim",
  jericoacoara: "Jericoacoara",
};

/** Mesmo critério do DunasTour (lib/transfers.ts): cidade de saída e chegada, ou a tag antiga "Transfer". */
export function isTransfer(tour: Pick<TourCard, "transferFrom" | "transferTo" | "tags">) {
  return (!!tour.transferFrom && !!tour.transferTo) || tour.tags.some((t) => t.trim().toLowerCase() === "transfer");
}

/** "São Luís → Barreirinhas" (null sem as duas cidades). */
export function transferRoute(tour: Pick<TourCard, "transferFrom" | "transferTo">) {
  const from = tour.transferFrom && CITIES[tour.transferFrom];
  const to = tour.transferTo && CITIES[tour.transferTo];
  return from && to ? `${from} → ${to}` : null;
}

/** Separa os transfers dos passeios (o resto, inclusive trekking). */
export function splitTransfers(tours: TourCard[]) {
  return { tours: tours.filter((t) => !isTransfer(t)), transfers: tours.filter(isTransfer) };
}
