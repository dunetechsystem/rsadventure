import { site } from "@/config/site";
import type { Metadata } from "next";
import { getAgency, getPackages, getTours } from "@/lib/dunastour/server";
import { agencyInfo } from "@/lib/agency-info";
import { PageHero } from "@/components/layout/PageHero";
import { PackageCardView, TourCard } from "@/components/tour/TourCard";
import { EmptyTours } from "@/components/tour/EmptyTours";
import { Reveal } from "@/components/ui/Reveal";
import { splitTransfers } from "@/lib/transfers";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Passeios",
  alternates: { canonical: "/passeios" },
  description: "Quadriciclo, motocross, UTV, sobrevoo, Lagoa Azul, Lagoa Bonita, Atins e Santo Amaro nos Lençóis Maranhenses, com busca no hotel em Barreirinhas.",
};

export default async function ToursPage() {
  const [allTours, packages, agency] = await Promise.all([getTours(), getPackages(), getAgency()]);
  const { tours, transfers } = splitTransfers(allTours);
  return (
    <>
      <PageHero
        image={tours[0]?.coverImageUrl}
        eyebrow={site.onlineBooking ? "Reserve online" : "Passeios RS Adventure"}
        title={
          <>
            Todos os <em>passeios</em>
          </>
        }
        crumbs={[{ href: "/", label: "Início" }]}
      >
        <p className="mt-4 max-w-xl text-lg text-white/75">{site.onlineBooking ? "Escolha um ou vários — cada um com a sua data. Você só paga depois que a agência confirmar." : "Escolha o passeio e chame a gente no WhatsApp pra verificar a disponibilidade da sua data."}</p>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {packages.length > 0 && (
          <div className="mb-12 grid gap-5 md:grid-cols-2">
            {packages.map((p) => (
              <PackageCardView key={p.id} pkg={p} />
            ))}
          </div>
        )}
        {tours.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour, i) => (
              <Reveal key={tour.id} delay={(i % 3) * 0.08}>
                <TourCard tour={tour} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          packages.length === 0 && transfers.length === 0 && <EmptyTours phone={agencyInfo(agency).phone} />
        )}
        {transfers.length > 0 && (
          <section id="transfers" className="mt-20 scroll-mt-24">
            <h2 className="mb-8 font-display text-4xl text-white">
              <em>Transfers</em>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {transfers.map((tour, i) => (
                <Reveal key={tour.id} delay={(i % 3) * 0.08}>
                  <TourCard tour={tour} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
