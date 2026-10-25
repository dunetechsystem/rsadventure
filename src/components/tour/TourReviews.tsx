import Link from "next/link";
import { ChevronRight, MessageCircleHeart } from "lucide-react";
import type { TourReview } from "@/lib/dunastour/types";
import { Star } from "lucide-react";

/**
 * Avaliações do passeio vindas do DunasTour (as que os clientes mandam pelo e-mail "Como foi o passeio?", com fotos):
 * na página do passeio só os avatares + estrelas e o botão; a página /passeios/<passeio>/avaliacoes tem os comentários
 * e as fotos. Mesmo visual do link de reservas do DunasTour.
 */

export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, s) => (
        <Star key={s} size={size} className={s < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-white/15"} />
      ))}
    </span>
  );
}

export const reviewStats = (reviews: TourReview[]) => ({
  average: reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
  photos: reviews.reduce((sum, r) => sum + (r.photoUrls?.length ?? 0), 0),
});

export const reviewsLabel = (count: number, photos: number) =>
  `${count} ${count === 1 ? "avaliação" : "avaliações"}${photos ? ` · ${photos} ${photos === 1 ? "foto" : "fotos"}` : ""}`;

export function Avatar({ name, url, size = 36, className = "" }: { name: string; url?: string | null; size?: number; className?: string }) {
  const initials = name.trim().slice(0, 2).toUpperCase();
  return url ? (
    // Foto de perfil do DunasTour (Google ou upload) — host variável, sem passar pelo otimizador do Next.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={name} width={size} height={size} className={`shrink-0 rounded-full object-cover ${className}`} style={{ width: size, height: size }} />
  ) : (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-night-700 font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}

/** Avatares sobrepostos de quem avaliou (um por pessoa, quem tem foto primeiro). */
export function Faces({ reviews, max = 6 }: { reviews: TourReview[]; max?: number }) {
  const people = new Map<string, string | null>();
  for (const r of reviews) if (!people.get(r.touristName)) people.set(r.touristName, r.touristAvatarUrl ?? null);
  const faces = [...people.entries()].sort((a, b) => Number(!!b[1]) - Number(!!a[1]));
  return (
    <span className="flex -space-x-2.5">
      {faces.slice(0, max).map(([name, url]) => (
        <Avatar key={name} name={name} url={url} size={34} className="ring-2 ring-night-800" />
      ))}
      {faces.length > max && (
        <span className="grid size-[34px] place-items-center rounded-full bg-night-700 text-xs font-bold text-white ring-2 ring-night-800">+{faces.length - max}</span>
      )}
    </span>
  );
}

/** Bloco compacto da página do passeio. */
export function TourReviewsSummary({ reviews, href }: { reviews: TourReview[]; href: string }) {
  if (!reviews.length) return null;
  const { average, photos } = reviewStats(reviews);
  return (
    <section className="mt-12 rounded-[2rem] bg-night-800 p-6 ring-1 ring-white/5">
      <h2 className="flex items-center gap-2 font-display text-2xl text-white">
        <MessageCircleHeart className="text-amber-500" /> Avaliações e fotos de quem foi
      </h2>
      <p className="mt-3 text-sm text-white/60">{reviewsLabel(reviews.length, photos)}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Faces reviews={reviews} />
        <Stars rating={average} />
        <strong className="text-sm text-white">{average.toFixed(1).replace(".", ",")}</strong>
      </div>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-flame-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-flame-600"
      >
        Ver avaliações e fotos <ChevronRight size={16} />
      </Link>
    </section>
  );
}

/** Lista completa: nome, foto de perfil, estrelas, comentário, fotos e a resposta da agência. */
export function ReviewList({ reviews }: { reviews: TourReview[] }) {
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((r) => (
        <article key={r.id} className="rounded-3xl bg-night-800 p-5 ring-1 ring-white/5">
          <div className="flex items-center gap-3">
            <Avatar name={r.touristName} url={r.touristAvatarUrl} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-white">{r.touristName}</p>
              <p className="text-xs text-white/40">{new Date(r.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
            </div>
            <Stars rating={r.rating} size={14} />
          </div>
          {r.comment && <p className="mt-3 text-sm leading-relaxed text-white/80">“{r.comment}”</p>}
          {r.photoUrls && r.photoUrls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {r.photoUrls.map((url) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="block size-20 overflow-hidden rounded-xl bg-night-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Foto de ${r.touristName}`} loading="lazy" className="size-full object-cover" />
                </a>
              ))}
            </div>
          )}
          {r.agencyReply && (
            <div className="mt-3 rounded-2xl bg-night-700 px-4 py-3 text-sm">
              <p className="text-xs font-bold text-white/60">Resposta da RS Adventure</p>
              <p className="text-white/80">{r.agencyReply}</p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
