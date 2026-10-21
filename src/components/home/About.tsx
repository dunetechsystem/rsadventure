import Image from "next/image";
import { site } from "@/config/site";
import { InstagramIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";

/** "Sobre a RS Adventure": o Ruan no círculo do pôr do sol + o manifesto (ou a descrição cadastrada no DunasTour). */
export function About({ description, instagram }: { description: string | null; instagram: string }) {
  const lines = (description ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const { founder } = site;
  return (
    <section id="sobre" className="relative scroll-mt-20 overflow-hidden border-y border-white/10 bg-night-800">
      <div className="sun-stripes pointer-events-none absolute -left-40 top-1/2 aspect-square w-[44rem] -translate-y-1/2 rounded-full bg-flame-500/10 [mask:linear-gradient(to_right,black,transparent_75%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.15fr]">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-white/10">
            <Image src={founder.photo} alt={`${founder.name}, ${founder.role}`} width={900} height={900} sizes="(max-width: 1024px) 90vw, 440px" className="h-auto w-full" />
          </div>
          <a
            href={`https://instagram.com/${instagram}`}
            target="_blank"
            rel="noreferrer"
            className="absolute -left-2 top-8 flex items-center gap-2 rounded-xl bg-flame-500 px-4 py-2 font-label text-base font-bold text-white shadow-lg transition hover:bg-flame-400 sm:-left-6"
          >
            <InstagramIcon size={16} /> @{instagram}
          </a>
          <div className="absolute -right-2 top-10 animate-float rounded-2xl bg-night-950 px-5 py-3.5 ring-1 ring-white/15 sm:-right-6">
            <p className="font-label text-3xl font-bold leading-none text-flame-500">{founder.yearsInTourism} anos</p>
            <p className="text-xs text-white/65">vivendo o turismo dos Lençóis</p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="flex items-center gap-3 font-label text-lg font-semibold text-flame-500">
              <span className="h-0.5 w-8 -skew-x-[30deg] bg-flame-500" />
              Sobre a RS Adventure
            </p>
            <h2 className="mt-3 text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
              Turismo com <em>experiência</em>, cuidado e aventura!
            </h2>
            <span className="brush mt-3 block h-3 w-44" />
          </Reveal>
          <Reveal delay={0.1}>
            {lines.length > 0 ? (
              <ul className="mt-8 space-y-2.5 text-lg text-white/75">
                {lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : null}
            <p className="mt-6 text-lg leading-relaxed text-white/75">{site.manifesto}</p>
            <p className="mt-6 font-label text-2xl font-semibold text-white">
              {founder.name} <span className="text-flame-500">· {founder.role}</span>
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 grid grid-cols-3 gap-3">
            {site.stats.map(({ value, label }) => (
              <div key={label} className="rounded-2xl bg-night-900 p-4 text-center ring-1 ring-white/10">
                <p className="font-label text-4xl font-bold text-flame-500">{value}</p>
                <p className="text-xs text-white/60">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
