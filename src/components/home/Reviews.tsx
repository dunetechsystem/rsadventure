import { Quote, Star } from "lucide-react";
import type { AgencyPublicReviews, CheckoutPageContent } from "@/lib/dunastour/types";
import { displayTitle } from "@/lib/format";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

/** Avaliações reais: as dos turistas no DunasTour e as do Google que a agência cadastrou. Sem nenhuma, não aparece. */
export function Reviews({ reviews, page }: { reviews: AgencyPublicReviews | null; page: CheckoutPageContent | null | undefined }) {
  const items = [
    ...(reviews?.items ?? []).map((r) => ({ author: r.touristName, rating: r.rating, text: r.comment, source: displayTitle(r.tourTitle) })),
    ...(page?.googleReviews ?? []).map((r) => ({ author: r.author, rating: r.rating, text: r.text, source: "Google" })),
  ];
  if (items.length === 0) return null;
  return (
    <section id="avaliacoes" className="scroll-mt-20 bg-night-800 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          center
          eyebrow="Quem foi, recomenda"
          title="O que dizem nossos viajantes"
          text={
            reviews && reviews.count > 0 ? (
              <span className="inline-flex items-center gap-2">
                <Star size={18} className="fill-amber-400 text-amber-400" /> {reviews.average.toFixed(1)} de média em {reviews.count} avaliações
              </span>
            ) : undefined
          }
        />
        <div className="mt-14 columns-1 gap-5 md:columns-2 lg:columns-3">
          {items.map((r, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
              <figure className="rounded-[2rem] bg-night-800 p-7 shadow-sm ring-1 ring-white/5">
                <Quote className="text-flame-300" size={28} />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} size={15} className={s < Math.round(r.rating) ? "fill-amber-400 text-amber-400" : "text-white/15"} />
                  ))}
                </div>
                <blockquote className="mt-3 leading-relaxed text-white/75">{r.text}</blockquote>
                <figcaption className="mt-5 text-sm">
                  <strong className="text-white">{r.author}</strong> <span className="text-white/40">· {r.source}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
