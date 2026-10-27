import { findBySlug, getPackage, getPackages } from "@/lib/dunastour/server";
import { displayTitle, money } from "@/lib/format";
import { ogCard, ogContentType, ogSize } from "@/lib/og-card";

export const revalidate = 3600;
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Pacote de passeios da RS Adventure nos Lençóis Maranhenses";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = findBySlug(await getPackages(), id);
  const pkg = await getPackage(card?.id ?? id);
  return ogCard({
    title: pkg ? displayTitle(pkg.title) : "Pacotes nos Lençóis",
    kicker: pkg ? `Combo com ${pkg.tours.length} passeios · RS Adventure` : "Lençóis Maranhenses · RS Adventure",
    price: pkg && pkg.finalPrice > 0 ? `${money(pkg.finalPrice)} por pessoa` : null,
    photoUrl: pkg?.mediaUrls[0] ?? card?.coverImageUrl ?? pkg?.tours.find((t) => t.coverImageUrl)?.coverImageUrl,
  });
}
