import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CarFront, Wallet } from "lucide-react";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { DuneScene } from "@/components/ui/DuneScene";
import { Reveal } from "@/components/ui/Reveal";

const PERKS = [
  { icon: Wallet, text: "Sem pagamento agora" },
  { icon: CalendarCheck, text: "Confirmação pelo WhatsApp" },
  { icon: CarFront, text: "Busca na pousada" },
];

// Colagem à direita: fotos inclinadas, a do meio por cima.
const TILES = [
  "left-0 top-10 w-[46%] -rotate-6",
  "right-0 top-0 w-[46%] rotate-6",
  "left-1/2 top-1/3 z-10 w-[52%] -translate-x-1/2 rotate-1",
];

export function FinalCta({ images, phone }: { images: string[]; phone: string }) {
  const tiles = images.slice(0, 3);
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-night-900 text-white ring-1 ring-white/10">
        <DuneScene id="cta" sun={false} />
        <div className="absolute inset-0 bg-gradient-to-r from-night-950/85 via-night-950/55 to-flame-600/20" />

        <div className={`relative grid items-center gap-12 px-6 py-16 sm:px-14 sm:py-20 ${tiles.length === 3 ? "lg:grid-cols-[1.1fr_1fr]" : "text-center"}`}>
          <div className={tiles.length === 3 ? "" : "mx-auto max-w-2xl"}>
            <p className="font-label text-lg font-semibold text-flame-400">Bora viver a aventura?</p>
            <h2 className="mt-3 text-balance font-label text-5xl font-bold leading-[0.95] sm:text-7xl">
              Sua próxima memória favorita está a <span className="text-flame-500">uma conversa</span> de distância
            </h2>
            <div className={`mt-10 flex flex-col gap-3 sm:flex-row ${tiles.length === 3 ? "" : "justify-center"}`}>
              <a
                href={whatsappUrl(phone, "Olá, RS Adventure! Quero reservar meu passeio nos Lençóis 😊")}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-center gap-3 rounded-xl bg-flame-500 px-7 py-4 font-label text-lg font-bold text-white shadow-2xl shadow-flame-500/30 transition hover:bg-flame-400"
              >
                <WhatsAppIcon size={22} /> <span className="underline decoration-2 underline-offset-4">Reservar pelo WhatsApp</span>
              </a>
              <Link
                href="/passeios"
                className="group flex items-center justify-center gap-2 rounded-xl bg-white/10 px-7 py-4 font-label text-lg font-bold ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
              >
                Escolher meus passeios <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
            </div>
            <ul className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85 ${tiles.length === 3 ? "" : "justify-center"}`}>
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2">
                  <Icon size={16} className="text-flame-500" /> {text}
                </li>
              ))}
            </ul>
          </div>

          {tiles.length === 3 && (
            <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
              {tiles.map((src, i) => (
                <div
                  key={src}
                  className={`absolute aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl shadow-night-950/50 ring-4 ring-white/90 transition duration-500 hover:z-20 hover:rotate-0 hover:scale-105 ${TILES[i]}`}
                >
                  <Image src={src} alt="" fill sizes="240px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
