import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isPrivateTour } from "@/lib/format";
import type { PackageCard, TourCard as TourCardType } from "@/lib/dunastour/types";
import { PackageCardView, TourCard } from "@/components/tour/TourCard";
import { EmptyTours } from "@/components/tour/EmptyTours";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

function Grid({ tours }: { tours: TourCardType[] }) {
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {tours.map((tour, i) => (
        <Reveal key={tour.id} delay={(i % 4) * 0.08}>
          <TourCard tour={tour} priority={i < 4} />
        </Reveal>
      ))}
    </div>
  );
}

/** Passeios do DunasTour separados em coletivos (por pessoa) e privativos (por veículo / exclusivos). */
export function TourSections({ tours, packages, phone }: { tours: TourCardType[]; packages: PackageCard[]; phone: string }) {
  const priv = tours.filter(isPrivateTour);
  const group = tours.filter((t) => !isPrivateTour(t));
  return (
    <>
      <section id="passeios" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-28">
        {packages.length > 0 && (
          <div className="mb-16 grid gap-5 md:grid-cols-2">
            {packages.map((p) => (
              <Reveal key={p.id}>
                <PackageCardView pkg={p} />
              </Reveal>
            ))}
          </div>
        )}
        {tours.length === 0 && packages.length === 0 && (
          <>
            <SectionTitle center eyebrow="Passeios" title={<>Passeios <em>RS Adventure</em></>} />
            <EmptyTours phone={phone} />
          </>
        )}
        {group.length > 0 && (
          <>
            <SectionTitle center eyebrow="Divida a aventura" title={<>Passeios <em>coletivos</em></>} text="Preço por pessoa, saída com o grupo e guia o tempo todo." />
            <Grid tours={group} />
          </>
        )}
        {priv.length > 0 && (
          <div className={group.length > 0 ? "mt-24" : ""}>
            <SectionTitle center eyebrow="Só o seu grupo" title={<>Passeios <em>privativos</em></>} text="Roteiro, horário e ritmo do seu jeito — por veículo ou exclusivo." />
            <Grid tours={priv} />
          </div>
        )}
        {tours.length > 0 && (
          <Reveal className="mt-12 text-center">
            <Link href="/passeios" className="group inline-flex items-center gap-2 font-label text-lg font-bold text-white underline decoration-flame-500 decoration-2 underline-offset-4">
              Ver todos os passeios <ArrowRight size={18} className="text-flame-500 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
        )}
      </section>
    </>
  );
}
