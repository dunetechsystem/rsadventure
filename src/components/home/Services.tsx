import { Bike, Camera, Heart, Map, ShieldCheck, Sparkles, Users, type LucideIcon } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { toneOf } from "@/lib/tones";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

const ICONS: Record<string, LucideIcon> = { bike: Bike, shield: ShieldCheck, users: Users, camera: Camera, map: Map, heart: Heart };

/** "Por que a RS": seis blocos coloridos com o selo listrado da marca ao fundo. */
export function Services() {
  return (
    <section id="experiencias" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-24 sm:px-6 sm:pb-28">
      <SectionTitle center eyebrow="Por que a RS" title={<>Não vendemos passeio, vendemos <em>experiência</em></>} text="Da busca na pousada ao último raio de sol nas dunas, cuidamos de cada detalhe pra você só viver o momento." />
      <div className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {site.services.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          const tone = toneOf(s.tone);
          return (
            <Reveal key={s.title} delay={(i % 3) * 0.08} className="h-full">
              <div className={cn("group relative isolate flex h-full min-h-56 flex-col overflow-hidden rounded-3xl p-5 ring-1 ring-white/10 transition duration-500 hover:-translate-y-1 sm:min-h-64 sm:p-7", tone.card)}>
                <div className="sun-stripes pointer-events-none absolute -bottom-1/3 -right-1/4 -z-10 aspect-square w-3/4 rounded-full bg-white/10 [mask:linear-gradient(to_top_left,black,transparent_70%)]" />
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black/20 text-white sm:h-12 sm:w-12">
                  <Icon size={22} />
                </span>
                <div className="mt-auto pt-8">
                  <h3 className="text-balance font-label text-3xl font-bold leading-[0.95] text-white sm:text-4xl">{s.title}</h3>
                  <p className={cn("mt-2 hidden text-sm leading-relaxed sm:block", tone.text)}>{s.text}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
