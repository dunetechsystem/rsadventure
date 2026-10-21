import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

/** Topo escuro das páginas internas (o cabeçalho transparente fica legível em cima). */
export function PageHero({
  image,
  eyebrow,
  title,
  children,
  crumbs = [],
  tall = false,
}: {
  image?: string | null;
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  crumbs?: { href: string; label: string }[];
  tall?: boolean;
}) {
  return (
    <section className={`relative flex items-end overflow-hidden bg-night-800 ${tall ? "min-h-[70svh]" : "min-h-[46svh]"}`}>
      {image && <Image src={image} alt="" fill priority sizes="100vw" className="animate-kenburns object-cover opacity-70" />}
      <div className="absolute inset-0 bg-gradient-to-b from-night-950/80 via-night-950/30 to-night-950/90" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:px-6 sm:pb-24">
        {crumbs.length > 0 && (
          <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs font-semibold text-white/60">
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-1">
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
                <ChevronRight size={12} />
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <div className="font-label text-lg font-semibold text-flame-500">{eyebrow}</div>}
        <h1 className="mt-3 max-w-4xl text-balance font-label text-6xl font-bold leading-[0.95] text-white sm:text-7xl lg:text-8xl">{title}</h1>
        {children}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-night-900 to-transparent" />
    </section>
  );
}
