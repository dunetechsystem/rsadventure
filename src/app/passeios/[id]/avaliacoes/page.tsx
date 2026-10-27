import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { findBySlug, getTour, getTourReviews, getTours } from "@/lib/dunastour/server";
import { displayTitle } from "@/lib/format";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Faces, ReviewList, Stars, reviewStats, reviewsLabel } from "@/components/tour/TourReviews";

export const revalidate = 300;

async function resolve(param: string) {
  const card = findBySlug(await getTours(), param);
  return { tour: await getTour(card?.id ?? param), slug: card?.slug ?? param };
}

export async function generateMetadata({ params }: PageProps<"/passeios/[id]/avaliacoes">): Promise<Metadata> {
  const { tour, slug } = await resolve((await params).id);
  if (!tour) return { title: "Passeio não encontrado" };
  return { title: `Avaliações e fotos — ${displayTitle(tour.title)}`, alternates: { canonical: `/passeios/${slug}/avaliacoes` } };
}

/** Avaliações, comentários e fotos de quem fez o passeio (vêm do DunasTour — e-mail "Como foi o passeio?"). */
export default async function TourReviewsPage({ params }: PageProps<"/passeios/[id]/avaliacoes">) {
  const { tour, slug: id } = await resolve((await params).id);
  if (!tour) notFound();
  const reviews = await getTourReviews(tour.id);
  const title = displayTitle(tour.title);
  const { average, photos } = reviewStats(reviews);
  const photoItems = reviews.flatMap((r) => (r.photoUrls ?? []).map((url) => ({ url, place: `Foto de ${r.touristName}`, video: false })));

  return (
    <>
      <PageHero
        image={tour.mediaUrls[0]}
        eyebrow="Avaliações e fotos de quem foi"
        title={title}
        crumbs={[
          { href: "/passeios", label: "Passeios" },
          { href: `/passeios/${id}`, label: title },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Link href={`/passeios/${id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 hover:text-white">
          <ChevronLeft size={16} /> Voltar pro passeio
        </Link>

        {reviews.length === 0 ? (
          <p className="mt-8 text-white/60">Esse passeio ainda não tem avaliações.</p>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Faces reviews={reviews} max={8} />
              <Stars rating={average} size={18} />
              <p className="text-sm text-white/60">
                <strong className="text-lg text-white">{average.toFixed(1).replace(".", ",")}</strong> · {reviewsLabel(reviews.length, photos)}
              </p>
            </div>

            {photoItems.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-5 font-display text-3xl text-white">Fotos de quem foi</h2>
                <GalleryGrid items={photoItems} filters={false} />
              </section>
            )}

            <section className="mt-12">
              <h2 className="mb-5 font-display text-3xl text-white">O que disseram</h2>
              <ReviewList reviews={reviews} />
            </section>
          </>
        )}
      </div>
    </>
  );
}
