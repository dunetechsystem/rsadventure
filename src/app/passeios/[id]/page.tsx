import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Backpack, BadgeCheck, CarFront, Check, Clock, Flame, Footprints, ShieldAlert, Sunrise, Users } from "lucide-react";
import { findBySlug, getAgency, getTour, getTourReviews, getTours } from "@/lib/dunastour/server";
import { tourBase } from "@/lib/booking-base";
import { agencyInfo } from "@/lib/agency-info";
import { site } from "@/config/site";
import { displayTitle, duration, tourUnitPrice, unitLabel } from "@/lib/format";
import { PageHero } from "@/components/layout/PageHero";
import { MediaMosaic } from "@/components/tour/MediaMosaic";
import { BookingPanel } from "@/components/tour/BookingPanel";
import { LineList, RichText } from "@/components/tour/RichText";
import { TourCard } from "@/components/tour/TourCard";
import { Reveal } from "@/components/ui/Reveal";
import { TourReviewsSummary } from "@/components/tour/TourReviews";
import { ReviewsSnippet } from "@/components/tour/ReviewsSnippet";
import { isTransfer, splitTransfers, transferRoute } from "@/lib/transfers";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getTours()).map((t) => ({ id: t.slug ?? t.id }));
}

/** O parâmetro da URL é o slug ("lagoa-azul"); o id antigo ainda funciona e redireciona. */
async function resolveTour(param: string) {
  const tours = await getTours();
  const card = findBySlug(tours, param);
  return { tours, card, tour: await getTour(card?.id ?? param) };
}

export async function generateMetadata({ params }: PageProps<"/passeios/[id]">): Promise<Metadata> {
  const { tour, card } = await resolveTour((await params).id);
  if (!tour) return { title: "Passeio não encontrado" };
  const title = displayTitle(tour.title);
  return {
    title,
    description: tour.description.replace(/\s+/g, " ").slice(0, 160),
    alternates: card?.slug ? { canonical: `/passeios/${card.slug}` } : undefined,
    openGraph: { type: "website", locale: "pt_BR", siteName: site.name, title },
  };
}

export default async function TourPage({ params }: PageProps<"/passeios/[id]">) {
  const { id } = await params;
  const [{ tour, tours, card }, agency] = await Promise.all([resolveTour(id), getAgency()]);
  if (!tour) notFound();
  if (card?.slug && card.slug !== decodeURIComponent(id)) permanentRedirect(`/passeios/${card.slug}`);
  const tourReviews = await getTourReviews(tour.id);
  const title = displayTitle(tour.title);
  const cover = tour.mediaUrls[0] ?? card?.coverImageUrl ?? null;
  // Passeio: "Combine com" só outros passeios e, embaixo, os transfers. Transfer: sugere os passeios.
  const transfer = isTransfer(tour);
  const route = transfer ? transferRoute(tour) : null;
  const split = splitTransfers(tours.filter((t) => t.id !== tour.id));
  const others = split.tours.slice(0, 3);
  const transfers = transfer ? [] : split.transfers;
  const vehicle = tour.saleUnit && tour.saleUnit !== "PESSOA";

  const facts = [
    tour.durationMinutes > 0 && { icon: Clock, label: "Duração", value: duration(tour.durationMinutes) },
    tour.defaultPickupTime && { icon: Sunrise, label: "Saída", value: tour.defaultPickupTime.slice(0, 5).replace(":", "h") },
    { icon: CarFront, label: "Embarque", value: "No seu hotel" },
    vehicle
      ? { icon: Users, label: "Vendido por", value: `${unitLabel(tour.saleUnit, 1)}${tour.vehicleMaxOccupancy ? ` · até ${tour.vehicleMaxOccupancy}` : ""}` }
      : { icon: Users, label: "Preço", value: "Por pessoa" },
    tour.instantConfirmation && { icon: BadgeCheck, label: "Confirmação", value: "Imediata" },
    tour.trek && { icon: Footprints, label: "Trekking", value: `${tour.trek.distanceKm} km · ${tour.trek.days} dia(s)` },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: title,
    description: tour.description.slice(0, 500),
    image: tour.mediaUrls.slice(0, 3),
    provider: { "@type": "TravelAgency", name: agency?.tradeName ?? "RS Adventure" },
    offers: { "@type": "Offer", price: tourUnitPrice(tour), priceCurrency: "BRL", availability: "https://schema.org/InStock" },
    // Estrelas no Google: a nota deste passeio no DunasTour (só quando já tem avaliação).
    ...(tour.ratingCount > 0 && {
      aggregateRating: { "@type": "AggregateRating", ratingValue: tour.ratingAvg.toFixed(1), reviewCount: tour.ratingCount, bestRating: 5 },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        image={cover}
        tall
        eyebrow={route ?? (tour.tags.length ? tour.tags.join(" · ") : "Lençóis Maranhenses")}
        title={title}
        crumbs={[
          { href: "/", label: "Início" },
          transfer ? { href: "/passeios#transfers", label: "Transfers" } : { href: "/passeios", label: "Passeios" },
        ]}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          {tour.durationMinutes > 0 && (
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <Clock size={15} /> {duration(tour.durationMinutes)}
            </span>
          )}
          {tour.riskType && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
              <ShieldAlert size={15} /> Atividade de aventura
            </span>
          )}
          {(tour.recentBookings ?? 0) >= 3 && (
            <span className="flex items-center gap-1.5 rounded-full bg-flame-500 px-4 py-2 text-sm font-semibold text-white">
              <Flame size={15} /> {tour.recentBookings} reservas no último mês
            </span>
          )}
        </div>
      </PageHero>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div className="min-w-0">
          <MediaMosaic urls={tour.mediaUrls} title={title} />

          <Reveal className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-3xl bg-night-800 p-4 ring-1 ring-white/5">
                <Icon size={20} className="text-amber-500" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/40">{label}</p>
                <p className="font-bold capitalize text-white">{value}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-12">
            <h2 className="mb-5 font-display text-3xl text-white">Sobre o passeio</h2>
            <RichText text={tour.description} />
          </Reveal>

          {(tour.included || tour.whatToBring) && (
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {tour.included && (
                <Reveal className="rounded-[2rem] bg-night-800 p-6">
                  <h3 className="mb-4 font-display text-2xl text-white">O que está incluído</h3>
                  <LineList text={tour.included} icon={<Check size={18} className="text-flame-400" />} />
                </Reveal>
              )}
              {tour.whatToBring && (
                <Reveal className="rounded-[2rem] bg-night-800 p-6">
                  <h3 className="mb-4 font-display text-2xl text-white">O que levar</h3>
                  <LineList text={tour.whatToBring} icon={<Backpack size={18} className="text-amber-500" />} />
                </Reveal>
              )}
            </div>
          )}

          {/* Avaliações do DunasTour com fotos: avatares + estrelas e o botão pra página com comentários e fotos. */}
          <TourReviewsSummary reviews={tourReviews} href={`/passeios/${card?.slug ?? id}/avaliacoes`} />
          <ReviewsSnippet reviews={tourReviews} page={agency?.checkoutPage} />

          {tour.riskType && (
            <div className="mt-8 flex gap-3 rounded-3xl border border-amber-400/40 bg-amber-400/10 p-5 text-sm text-white/80">
              <ShieldAlert className="shrink-0 text-amber-600" />
              <p>
                Por ser uma atividade de aventura, {site.onlineBooking ? "na reserva" : "antes do passeio"} você vai ler e assinar o{" "}
                <strong>Termo de Responsabilidade e Ciência de Riscos</strong>. O CPF de quem assina é obrigatório e esse passeio não leva crianças de
                colo.
              </p>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingPanel base={tourBase(tour, cover)} phone={agencyInfo(agency).phone} />
        </aside>
      </div>

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <h2 className="mb-8 font-display text-4xl text-white">
            {transfer ? (
              <>
                Aproveite e conheça <em>nossos passeios</em>
              </>
            ) : (
              <>
                Combine com <em>outros passeios</em>
              </>
            )}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </section>
      )}

      {transfers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6">
          <h2 className="mb-2 font-display text-4xl text-white">
            Precisa de <em>transfer</em>?
          </h2>
          <p className="mb-8 text-white/60">A gente leva você até a região e traz de volta.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {transfers.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
