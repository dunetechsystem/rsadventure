import { cn } from "@/lib/cn";

/**
 * Pôr do sol nas dunas em SVG — o fundo de marca quando um passeio ainda não tem foto no DunasTour
 * (e a base do hero, por baixo do slideshow). Sol listrado como o da logo.
 */
export function DuneScene({ className, sun = true, id = "a" }: { className?: string; sun?: boolean; id?: string }) {
  // Posição do sol varia por id, pra cards sem foto não ficarem todos iguais.
  const seed = [...id].reduce((n, c) => n + c.charCodeAt(0), 0);
  const cx = 330 + ((seed * 37) % 140);
  const dx = cx - 400;
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className={cn("absolute inset-0 h-full w-full", className)} aria-hidden>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1630" />
          <stop offset=".45" stopColor="#7a2a1b" />
          <stop offset=".72" stopColor="#ff6a00" />
          <stop offset="1" stopColor="#ffb43a" />
        </linearGradient>
        <linearGradient id={`d1-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1608" />
          <stop offset="1" stopColor="#120a10" />
        </linearGradient>
        <clipPath id={`sunclip-${id}`}>
          <circle cx={cx} cy="330" r="120" />
        </clipPath>
      </defs>
      <rect width="800" height="600" fill={`url(#sky-${id})`} />
      {sun && (
        <g clipPath={`url(#sunclip-${id})`}>
          <rect x={270 + dx} y="205" width="260" height="250" fill="#ffd28a" />
          {[245, 275, 300, 322, 342, 360].map((y, i) => (
            <rect key={y} x={270 + dx} y={y} width="260" height={2 + i * 1.6} fill={`url(#sky-${id})`} />
          ))}
        </g>
      )}
      <path d="M0 380c90-22 170-30 260-14s150 34 240 20 200-44 300-24v238H0z" fill="#8a3410" opacity=".75" />
      <path d="M0 440c110-40 190-34 290-8s190 36 290 6 160-26 220-8v176H0z" fill="#5a210b" />
      <path d="M0 510c130-32 230-18 330 6s210 24 470-14v98H0z" fill={`url(#d1-${id})`} />
    </svg>
  );
}
