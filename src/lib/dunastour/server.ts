import "server-only";
import type {
  AgencyPublicProfile,
  AgencyPublicReviews,
  LagoonStatus,
  PackageCard,
  PackageDetail,
  TourCard,
  TourDetail,
} from "./types";
import { fixMediaUrl } from "../media";

/**
 * Acesso à API do DunasTour pelo servidor do Next — o navegador nunca fala direto com a API (o IP
 * liberado no backend é o deste servidor). Leituras ficam em cache por REVALIDATE segundos; se a API
 * falhar, a função devolve null/[] e a página mostra o estado vazio até a próxima revalidação.
 */
export const API_URL = (process.env.DUNASTOUR_API_URL ?? "https://api.dunastour.com.br").replace(/\/$/, "");
export const AGENCY_SLUG = process.env.DUNASTOUR_AGENCY_SLUG ?? "rs-adventure";
const REVALIDATE = 300;

async function get<T>(path: string, revalidate = REVALIDATE): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate, tags: ["dunastour"] },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok || res.status === 204) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[dunastour] GET ${path} falhou:`, err);
    return null;
  }
}

export async function getAgency(): Promise<AgencyPublicProfile | null> {
  const agency = await get<AgencyPublicProfile>(`/api/agencies/lookup?slug=${encodeURIComponent(AGENCY_SLUG)}`);
  if (!agency) return null;
  return {
    ...agency,
    logoUrl: fixMediaUrl(agency.logoUrl),
    coverImageUrl: fixMediaUrl(agency.coverImageUrl),
  };
}

export async function getAgencyId(): Promise<string | null> {
  return (await getAgency())?.id ?? null;
}

export async function getTours(): Promise<TourCard[]> {
  const id = await getAgencyId();
  if (!id) return [];
  const tours = (await get<TourCard[]>(`/api/agencies/${id}/tours`)) ?? [];
  return tours.map((t) => ({ ...t, coverImageUrl: fixMediaUrl(t.coverImageUrl) }));
}

export async function getTour(tourId: string): Promise<TourDetail | null> {
  const tour = await get<TourDetail>(`/api/tours/${encodeURIComponent(tourId)}`);
  const agencyId = await getAgencyId();
  // Só passeios desta agência — o site não vende passeio de outra.
  if (!tour || (tour.agencyId && agencyId && tour.agencyId !== agencyId)) return null;
  return { ...tour, mediaUrls: tour.mediaUrls.map((u) => fixMediaUrl(u)!).filter(Boolean) };
}

export async function getPackages(): Promise<PackageCard[]> {
  const id = await getAgencyId();
  if (!id) return [];
  const packages = (await get<PackageCard[]>(`/api/agencies/${id}/packages`)) ?? [];
  return packages.map((p) => ({ ...p, coverImageUrl: fixMediaUrl(p.coverImageUrl) }));
}

export async function getPackage(packageId: string): Promise<PackageDetail | null> {
  const [pkg, own] = await Promise.all([get<PackageDetail>(`/api/packages/${encodeURIComponent(packageId)}`), getPackages()]);
  if (!pkg || !own.some((p) => p.id === pkg.id)) return null;
  return {
    ...pkg,
    mediaUrls: pkg.mediaUrls.map((u) => fixMediaUrl(u)!).filter(Boolean),
    tours: pkg.tours.map((t) => ({ ...t, coverImageUrl: fixMediaUrl(t.coverImageUrl) })),
  };
}

export async function getClosedDays(): Promise<string[]> {
  const id = await getAgencyId();
  if (!id) return [];
  return (await get<string[]>(`/api/agencies/${id}/closed-days`, 60)) ?? [];
}

export async function getReviews(): Promise<AgencyPublicReviews | null> {
  const id = await getAgencyId();
  if (!id) return null;
  return get<AgencyPublicReviews>(`/api/agencies/${id}/reviews`);
}

/** Fotos/vídeos que a agência cadastrou por lugar (id do ponto turístico → URLs). */
export async function getRouteMedia(): Promise<Record<string, string[]>> {
  const id = await getAgencyId();
  if (!id) return {};
  const media = (await get<Record<string, string[]>>(`/api/agencies/${id}/route-media`)) ?? {};
  return Object.fromEntries(
    Object.entries(media).map(([spot, urls]) => [spot, urls.map((u) => fixMediaUrl(u)!).filter(Boolean)])
  );
}

export async function getLagoons(): Promise<LagoonStatus | null> {
  return get<LagoonStatus>("/api/public/lagoons", 1800);
}
