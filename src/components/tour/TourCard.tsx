import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bus, Clock, Footprints, ShieldAlert, Star } from "lucide-react";
import { site } from "@/config/site";
import type { PackageCard, TourCard as TourCardType } from "@/lib/dunastour/types";
import { DuneScene } from "@/components/ui/DuneScene";
import { displayTitle, duration, money, perUnit, tourUnitPrice } from "@/lib/format";
import { isTransfer, transferRoute } from "@/lib/transfers";

export function TourCard({ tour, priority = false }: { tour: TourCardType; priority?: boolean }) {
  const price = tourUnitPrice(tour);
  const discounted = price < tour.basePrice;
  const transfer = isTransfer(tour);
  const route = transfer ? transferRoute(tour) : null;
  const tags = tour.tags.filter((t) => t.trim().toLowerCase() !== "transfer");
  return (
    <Link
      href={`/passeios/${tour.slug ?? tour.id}`}
      className="group relative flex aspect-[4/4.2] flex-col justify-end sm:aspect-[3/4.1] overflow-hidden rounded-[1.75rem] bg-night-800 ring-1 ring-white/10 transition duration-500 hover:-translate-y-1.5 hover:ring-flame-500/60"
    >
      {tour.coverImageUrl ? (
        <Image
          src={tour.coverImageUrl}
          alt={displayTitle(tour.title)}
          fill
          priority={priority}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
      ) : (
        <DuneScene id={tour.id.slice(0, 6)} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-night-600 via-night-700/70 via-35% to-transparent to-65%" />
      <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
        {tour.durationMinutes > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-night-950/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <Clock size={11} /> {duration(tour.durationMinutes)}
          </span>
        )}
        {discounted && <span className="rounded-full bg-flame-500 px-2.5 py-1 text-[11px] font-extrabold text-white">-{tour.discountPercent}%</span>}
        {tour.riskType && (
          <span className="flex items-center gap-1 rounded-full bg-flame-500 px-2.5 py-1 text-[11px] font-bold text-white">
            <ShieldAlert size={11} /> Aventura
          </span>
        )}
        {transfer && (
          <span className="flex items-center gap-1 rounded-full bg-night-950/70 px-2.5 py-1 text-[11px] font-bold text-flame-400 backdrop-blur">
            <Bus size={11} /> Transfer
          </span>
        )}
        {tour.trekLevel && (
          <span className="flex items-center gap-1 rounded-full bg-lagoon-500 px-2.5 py-1 text-[11px] font-bold text-white">
            <Footprints size={11} /> Trekking
          </span>
        )}
      </div>
      <span className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-flame-500 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight size={18} />
      </span>
      <div className="relative p-5">
        {tags.length > 0 && <p className="mb-1 line-clamp-1 font-label text-sm font-semibold text-flame-400">{tags.slice(0, 3).join(" · ")}</p>}
        <h3 className="font-label text-[1.7rem] font-bold leading-[0.95] text-white">{displayTitle(tour.title)}</h3>
        {route && <p className="mt-1 text-sm font-semibold text-white/85">{route}</p>}
        {tour.ratingCount > 0 && (
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-white/80">
            <Star size={12} className="fill-amber-400 text-amber-400" /> {tour.ratingAvg.toFixed(1)} ({tour.ratingCount})
          </p>
        )}
        <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/15 pt-3">
          <p className="min-w-0 leading-none">
            {discounted && <span className="mb-1 block text-xs text-white/50 line-through">{money(tour.basePrice)}</span>}
            <span className="block text-xl font-extrabold text-white">{money(price)}</span>
            <span className="mt-1 block truncate text-xs font-medium text-white/60">{perUnit(tour.saleUnit)}</span>
          </p>
          <span className="shrink-0 whitespace-nowrap font-label text-sm font-bold text-flame-400 underline decoration-2 underline-offset-4 transition group-hover:text-flame-300">
            {site.onlineBooking ? "Reservar" : transfer ? "Ver transfer" : "Ver passeio"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PackageCardView({ pkg }: { pkg: PackageCard }) {
  return (
    <Link
      href={`/pacotes/${pkg.slug ?? pkg.id}`}
      className="group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-[2rem] bg-night-700 p-6 text-white ring-1 ring-white/10"
    >
      {pkg.coverImageUrl && (
        <Image src={pkg.coverImageUrl} alt="" fill sizes="(max-width: 768px) 90vw, 600px" className="object-cover opacity-70 transition duration-700 group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/40 to-transparent" />
      <span className="absolute left-5 top-5 rounded-full bg-amber-500 px-3 py-1 text-xs font-extrabold">Combo -{pkg.discountPercent}%</span>
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.2em] font-label text-flame-400">{pkg.toursCount} passeios</p>
        <h3 className="mt-1 font-display text-3xl">{displayTitle(pkg.title)}</h3>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="text-sm text-white/50 line-through">{money(pkg.originalPrice)}</span>
          <span className="text-2xl font-extrabold">{money(pkg.finalPrice)}</span>
          <span className="text-xs text-white/60">por pessoa</span>
        </p>
      </div>
    </Link>
  );
}
