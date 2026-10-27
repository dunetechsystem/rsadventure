import { Star } from "lucide-react";
import type { TourReview } from "@/lib/dunastour/types";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Prova social na página do passeio, perto da reserva: média, total e até 3 depoimentos — só deste passeio
 * (GET /api/tours/{id}/reviews; as da agência e do Google não entram). Sem avaliação com comentário, não aparece.
 */
export function ReviewsSnippet({ reviews }: { reviews: TourReview[] }) {
  const items = reviews.filter((r) => r.comment?.trim());
  if (!items.length) return null;
  const average = items.reduce((s, r) => s + r.rating, 0) / items.length;
  const picked = items.slice(0, 3);
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
        {picked.map((r) => (
          <figure key={r.id} className="flex flex-col rounded-3xl bg-night-800 p-5 ring-1 ring-white/5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }, (_, s) => (
                <Star key={s} size={14} className={s < Math.round(r.rating) ? "fill-amber-400 text-amber-400" : "text-white/15"} />
              ))}
            </div>
            <blockquote className="mt-3 line-clamp-6 flex-1 text-sm leading-relaxed text-white/75">{r.comment}</blockquote>
            <figcaption className="mt-4 text-sm">
              <strong className="text-white">{r.touristName}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </Reveal>
  );
}
