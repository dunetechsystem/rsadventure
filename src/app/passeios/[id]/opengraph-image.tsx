import { findBySlug, getTour, getTours } from "@/lib/dunastour/server";
import { displayTitle, money, perUnit, tourUnitPrice } from "@/lib/format";
import { ogCard, ogContentType, ogSize } from "@/lib/og-card";

export const revalidate = 3600;
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Passeio da RS Adventure nos Lençóis Maranhenses";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = findBySlug(await getTours(), id);
  const tour = await getTour(card?.id ?? id);
  const price = tour ? tourUnitPrice(tour) : 0;
  return ogCard({
    title: tour ? displayTitle(tour.title) : "Passeios nos Lençóis",
    kicker: "Lençóis Maranhenses · RS Adventure",
    price: price > 0 ? `${money(price)} ${perUnit(tour?.saleUnit)}` : null,
    photoUrl: tour?.mediaUrls[0] ?? card?.coverImageUrl,
  });
}
