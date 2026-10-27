import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { site } from "@/config/site";
import type { TourCard } from "@/lib/dunastour/types";
import { whatsappUrl } from "@/lib/format";
import { DuneScene } from "@/components/ui/DuneScene";
import { RsMark } from "@/components/ui/Logo";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

/** "Experiências Destaque": dois cards grandes — Motocross (exclusivo) e Quadriciclos (a mais procurada). */
export function Featured({ tours, phone }: { tours: TourCard[]; phone: string }) {
  return (
    <section id="destaques" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-24 sm:px-6 sm:pt-28">
      <SectionTitle center eyebrow="Para quem quer mais" title={<>Experiências <em>destaque</em></>} />
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {site.featured.map((f, i) => {
          const matches = tours.filter((t) => f.match.test(t.title));
          const tour = matches.find((t) => t.coverImageUrl) ?? matches[0];
          const href = tour ? `/passeios/${tour.slug ?? tour.id}` : whatsappUrl(phone, f.message);
          const external = !tour;
          const flip = i === 1;
          return (
            <Reveal key={f.title} delay={i * 0.1}>
              <Link
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group relative flex min-h-[26rem] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 transition duration-500 hover:ring-flame-500/60"
              >
                {tour?.coverImageUrl ? (
                  <Image src={tour.coverImageUrl} alt="" fill sizes="(max-width: 768px) 95vw, 600px" className="object-cover transition duration-700 group-hover:scale-105" />
                ) : (
                  <>
                    <DuneScene id={`f${i}`} sun={false} className="transition duration-700 group-hover:scale-105" />
                    <RsMark className={`absolute bottom-8 w-44 opacity-30 ${flip ? "left-8" : "right-8"}`} />
                  </>
                )}
                <div className={`absolute inset-0 ${flip ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-night-950/90 via-night-950/45 to-transparent`} />
                <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 flex items-center gap-2 rounded-xl bg-flame-500/90 px-4 py-2 font-label text-lg font-bold text-white backdrop-blur">
                  <Star size={16} className="fill-amber-300 text-amber-300" /> {f.badge}
                </span>
                <div className={`relative z-10 flex w-full flex-col justify-end p-6 sm:p-8 ${flip ? "items-end text-right" : ""}`}>
                  <h3 className="max-w-xs text-balance font-label text-5xl font-bold leading-[0.9] text-white sm:text-6xl">{f.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80 sm:text-base">{f.text}</p>
                  <p className="mt-4 font-label text-base font-semibold text-flame-400">{f.note}</p>
                  {f.sub && <p className="font-label text-base font-semibold text-white">{f.sub}</p>}
                  <span className="mt-5 inline-flex items-center gap-2 font-label text-lg font-bold text-white underline decoration-flame-500 decoration-2 underline-offset-4">
                    {tour ? "Ver passeio" : "Falar no WhatsApp"} <ArrowUpRight size={18} className="text-flame-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
