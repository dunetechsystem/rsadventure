import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Droplets, Moon, Sun, Sunset, Wind } from "lucide-react";
import type { LagoonStatus } from "@/lib/dunastour/types";
import { parseISODate } from "@/lib/format";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** Código de tempo WMO (Open-Meteo, o mesmo que a API do DunasTour repassa). */
function WeatherIcon({ code, day = true, className, size }: { code: number; day?: boolean; className?: string; size?: number }) {
  const props = { className, size };
  if (code === 0) return day ? <Sun {...props} /> : <Moon {...props} />;
  if (code <= 3) return <CloudSun {...props} />;
  if (code === 45 || code === 48) return <CloudFog {...props} />;
  if (code >= 95) return <CloudLightning {...props} />;
  if (code >= 51) return <CloudRain {...props} />;
  return <Cloud {...props} />;
}


function levelText(level: number) {
  if (level >= 80) return "Cheias — época perfeita";
  if (level >= 55) return "Boas pra banho";
  if (level >= 35) return "Várias lagoas com água";
  return "Mais baixas nesta época";
}

/** "Como estão as lagoas": nível estimado hoje, previsão de 7 dias e a curva do ano. Dados do DunasTour. */
export function Lagoons({ data }: { data: LagoonStatus }) {
  const month = new Date().getMonth();
  const ring = 2 * Math.PI * 54;
  return (
    <section id="lagoas" className="scroll-mt-20 bg-gradient-to-b from-night-900 via-night-800 to-night-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Ao vivo"
          title={
            <>
              Como estão as <em>lagoas</em> hoje
            </>
          }
          text="O nível das lagoas muda com as chuvas do ano. Acompanhe aqui antes de escolher a data da sua viagem."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-[360px_1fr]">
          <Reveal className="flex flex-col items-center justify-center rounded-[2rem] bg-night-800 p-8 text-center shadow-xl shadow-teal-900/5 ring-1 ring-white/5">
            <div className="relative h-40 w-40">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-night-800)" strokeWidth="12" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#lagoonGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={ring}
                  strokeDashoffset={ring * (1 - data.level / 100)}
                />
                <defs>
                  <linearGradient id="lagoonGrad" x1="0" x2="1">
                    <stop offset="0" stopColor="var(--color-flame-300)" />
                    <stop offset="1" stopColor="var(--color-night-700)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="text-flame-500" size={22} />
                <span className="font-display text-4xl text-white">{data.level}%</span>
              </div>
            </div>
            <p className="mt-4 text-lg font-extrabold text-white">{levelText(data.level)}</p>
            <p className="text-sm text-white/50">Nível estimado das lagoas</p>
            {data.current && (
              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-night-800 px-5 py-3 text-white">
                <WeatherIcon code={data.current.weatherCode} day={data.current.day} className="text-amber-500" />
                <span className="text-2xl font-extrabold">{Math.round(data.current.temperature)}°</span>
                <span className="flex items-center gap-1 text-xs text-white/60">
                  <Wind size={14} /> {Math.round(data.current.windSpeed)} km/h
                </span>
              </div>
            )}
          </Reveal>

          <div className="grid gap-5">
            <Reveal delay={0.1} className="rounded-[2rem] bg-night-800 p-6 shadow-xl shadow-teal-900/5 ring-1 ring-white/5 sm:p-8">
              <p className="font-display text-xl text-white">Nível das lagoas ao longo do ano</p>
              <div className="mt-6 flex h-44 items-end gap-1.5 sm:gap-3">
                {data.monthLevels.map((lvl, i) => (
                  <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className={`text-[10px] font-bold ${i === month ? "text-flame-400" : "text-white/30"}`}>{lvl}%</span>
                    <div
                      className={`w-full rounded-t-xl transition-all ${
                        i === month ? "bg-gradient-to-t from-amber-500 to-amber-400" : "bg-gradient-to-t from-flame-500 to-flame-300"
                      }`}
                      style={{ height: `${Math.max(6, lvl)}%`, opacity: i === month ? 1 : 0.35 + lvl / 160 }}
                    />
                    <span className={`text-[11px] font-bold ${i === month ? "text-amber-600" : "text-white/50"}`}>{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {data.days.length > 0 && (
              <Reveal delay={0.2} className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
                {data.days.slice(0, 7).map((d) => {
                  const date = parseISODate(d.date);
                  return (
                    <div key={d.date} className="min-w-[110px] flex-1 rounded-3xl bg-night-800 p-4 text-center shadow-sm ring-1 ring-white/5">
                      <p className="text-xs font-bold uppercase text-white/50">
                        {date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}
                      </p>
                      <WeatherIcon code={d.weatherCode} className="mx-auto my-2 text-amber-500" size={26} />
                      <p className="text-sm font-extrabold text-white">
                        {Math.round(d.max)}° <span className="font-semibold text-white/40">{Math.round(d.min)}°</span>
                      </p>
                      <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-white/50">
                        <Sunset size={11} /> {d.sunset}
                      </p>
                    </div>
                  );
                })}
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
