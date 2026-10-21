import { ArrowUpRight, BadgeCheck, Building2, ShieldCheck, Star } from "lucide-react";
import { site } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Agência regularizada": aparece quando a agência preenche o link do Cadastur no DunasTour.
 * O Cadastur é o cadastro oficial do Ministério do Turismo — o turista confere o registro lá.
 */
export function Credentials({
  cadasturUrl,
  cnpj,
  legalName,
  rating,
}: {
  cadasturUrl: string | null;
  cnpj: string | null;
  legalName: string | null;
  rating: { average: number; count: number } | null;
}) {
  if (!cadasturUrl) return null;
  const items = [
    cnpj && { icon: Building2, title: "Empresa com CNPJ", text: legalName ? `${legalName} · ${cnpj}` : `CNPJ ${cnpj}` },
    site.onlineBooking && { icon: ShieldCheck, title: "Reserva segura", text: "Registrada pela plataforma DunasTour, com termos e confirmação por escrito." },
    rating && { icon: Star, title: `Nota ${rating.average.toFixed(1).replace(".", ",")}`, text: `Em ${rating.count} avaliações de quem já foi com a gente.` },
  ].filter((i): i is { icon: typeof Star; title: string; text: string } => !!i);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-night-800 p-8 ring-1 ring-white/10 text-white sm:p-12">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-flame-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="flex items-center gap-2 font-label text-lg font-semibold text-flame-500">
                <BadgeCheck size={16} /> Agência regularizada
              </p>
              <h2 className="mt-4 text-balance font-display text-3xl leading-tight sm:text-4xl">
                Cadastrada no <em className="text-amber-gradient pr-1">Cadastur</em>, o registro oficial do Ministério do Turismo
              </h2>
              <p className="mt-4 max-w-lg leading-relaxed text-white/70">
                Só empresas de turismo regularizadas entram no Cadastur. Você pode conferir nosso registro direto no site do governo
                antes de reservar.
              </p>
              <a
                href={cadasturUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-flame-500 px-6 py-3.5 font-label text-lg font-bold text-white transition hover:bg-flame-400"
              >
                Consultar registro no Cadastur <ArrowUpRight size={18} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
            <ul className="grid gap-3">
              {items.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
                    <Icon size={22} />
                  </span>
                  <span>
                    <strong className="block">{title}</strong>
                    <span className="text-sm text-white/60">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
