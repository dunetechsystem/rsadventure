import { site } from "@/config/site";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { DuneScene } from "@/components/ui/DuneScene";
import { RsMark } from "@/components/ui/Logo";

/** API fora do ar ou agência sem passeios: mostra os destinos e leva pro WhatsApp. */
export function EmptyTours({ phone }: { phone: string }) {
  return (
    <div className="relative isolate mt-12 overflow-hidden rounded-[2rem] px-6 py-16 text-center ring-1 ring-white/10 sm:px-12">
      <DuneScene id="empty" />
      <div className="absolute inset-0 -z-10 bg-night-950/55" />
      <RsMark className="mx-auto w-20" />
      <p className="mt-5 font-label text-5xl font-bold text-white">
        Nossos passeios estão <span className="text-flame-500">chegando</span>
      </p>
      <p className="mx-auto mt-3 max-w-lg text-white/75">Enquanto montamos tudo por aqui, chama a gente no WhatsApp: a gente monta seu roteiro na hora, do jeito que você sonhou.</p>
      <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
        {site.destinations.map((d) => (
          <li key={d} className="rounded-lg bg-night-950/70 px-4 py-1.5 font-label text-base text-white ring-1 ring-white/15">
            {d}
          </li>
        ))}
      </ul>
      <a
        href={whatsappUrl(phone, "Olá, RS Adventure! Quero saber dos passeios e montar meu roteiro 😊")}
        target="_blank"
        rel="noreferrer"
        className="mt-9 inline-flex items-center gap-2 rounded-xl bg-flame-500 px-7 py-3.5 font-label text-lg font-bold text-white transition hover:bg-flame-400"
      >
        <WhatsAppIcon size={18} /> Montar meu roteiro
      </a>
    </div>
  );
}
