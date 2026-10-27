import { Star } from "lucide-react";
import type { AgencyPublicReviews, CheckoutPageContent } from "@/lib/dunastour/types";
import { displayTitle } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Prova social na página do passeio, perto da reserva: média, total e até 3 depoimentos (DunasTour + Google) — os
 * deste passeio primeiro. Sem avaliação, não aparece.
 */
export function ReviewsSnippet({
  reviews,
  page,
  tourTitle,
}: {
  reviews: AgencyPublicReviews | null;
  page: CheckoutPageContent | null | undefined;
  tourTitle: string;
}) {
  const items = [
    ...(reviews?.items ?? []).map((r) => ({ author: r.touristName, rating: r.rating, text: r.comment, source: displayTitle(r.tourTitle) })),
    ...(page?.googleReviews ?? []).map((r) => ({ author: r.author, rating: r.rating, text: r.text, source: "Google" })),
  ].filter((r) => r.text?.trim());
  if (!items.length) return null;
  const average = items.reduce((s, r) => s + r.rating, 0) / items.length;
  const picked = [...items.filter((r) => r.source === tourTitle), ...items.filter((r) => r.source !== tourTitle)].slice(0, 3);
  return (
    <Reveal className="mt-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-3xl text-white">Quem foi, recomenda</h2>
        <p className="flex items-center gap-2 text-sm text-white/60">
          <Star size={16} className="fill-amber-400 text-amber-400" />
          <strong className="text-white">{average.toFixed(1).replace(".", ",")}</strong> · {items.length} avaliações
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {picked.map((r, i) => (
          <figure key={i} className="flex flex-col rounded-3xl bg-night-800 p-5 ring-1 ring-white/5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, s) => (
                <Star key={s} size={14} className={s < Math.round(r.rating) ? "fill-amber-400 text-amber-400" : "text-white/15"} />
              ))}
            </div>
            <blockquote className="mt-3 line-clamp-6 flex-1 text-sm leading-relaxed text-white/75">{r.text}</blockquote>
            <figcaption className="mt-4 text-sm">
              <strong className="text-white">{r.author}</strong> <span className="text-white/40">· {r.source}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Reveal>
  );
}
