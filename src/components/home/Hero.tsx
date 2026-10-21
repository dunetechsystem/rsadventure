"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BadgeCheck, ChevronDown, Compass, Droplets, Star } from "lucide-react";
import { site } from "@/config/site";
import { whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { DuneScene } from "@/components/ui/DuneScene";
import { RsMark } from "@/components/ui/Logo";

/**
 * Abertura: pôr do sol nas dunas (SVG de marca) com as fotos dos passeios passando por cima, o texto
 * da marca à esquerda e o selo da RS Adventure à direita.
 */
export function Hero({
  images,
  tourCount,
  phone,
  lagoonLevel,
  rating,
  cadasturUrl,
}: {
  images: string[];
  tourCount: number;
  phone: string;
  lagoonLevel: number | null;
  rating: { average: number; count: number } | null;
  cadasturUrl: string | null;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2 || site.heroVideo) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 6500);
    return () => clearInterval(id);
  }, [images.length]);

  const stats = [
    rating && { href: "/#avaliacoes", icon: Star, title: `${rating.average.toFixed(1).replace(".", ",")} de nota`, text: `${rating.count} avaliações` },
    cadasturUrl
      ? { href: cadasturUrl, icon: BadgeCheck, title: "Cadastur", text: "Registro no Min. do Turismo" }
      : { href: "/#sobre", icon: BadgeCheck, title: `${site.founder.yearsInTourism} anos`, text: "de turismo nos Lençóis" },
    lagoonLevel != null && { href: "/#lagoas", icon: Droplets, title: `${lagoonLevel}% cheias`, text: "Lagoas hoje" },
    tourCount > 0 && { href: "/#passeios", icon: Compass, title: `${tourCount} passeios`, text: site.onlineBooking ? "Reserva online" : "Reserva pelo WhatsApp" },
  ].filter(Boolean) as { href: string; icon: typeof Star; title: string; text: string }[];

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-night-900">
      {(images.length === 0 || site.heroVideo) && <DuneScene id="hero" />}
      {site.heroVideo ? (
        <video className="absolute inset-0 h-full w-full object-cover" src={site.heroVideo} autoPlay muted loop playsInline poster={images[0]} />
      ) : (
        <AnimatePresence mode="sync">
          {images[index] && (
            <motion.div
              key={images[index]}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6 }}
            >
              <Image src={images[index]} alt="" fill priority sizes="100vw" className="animate-kenburns object-cover" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-night-950/90 via-night-950/55 to-night-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-transparent to-night-950/50" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-40 pt-32 sm:px-6 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-label text-lg font-semibold text-flame-400 sm:text-xl"
          >
            Bem-vindo à RS Adventure
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 text-balance font-label text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.92] text-white"
          >
            Transformando turismo em <span className="text-flame-500">experiências reais</span>
          </motion.h1>
          <motion.span
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="brush mt-3 block h-4 w-56 origin-left sm:w-80"
          />
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
            Passeios, aventuras e experiências privativas em Barreirinhas e região. {site.slogan}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <a
              href={whatsappUrl(phone, "Olá, RS Adventure! Quero reservar um passeio nos Lençóis 😊")}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-center gap-3 rounded-xl bg-flame-500 px-7 py-4 font-label text-lg font-bold text-white shadow-2xl shadow-flame-500/30 transition hover:bg-flame-400"
            >
              <WhatsAppIcon size={22} />
              <span className="underline decoration-2 underline-offset-4">Reservar pelo WhatsApp</span>
            </a>
            <Link
              href="/#passeios"
              className="flex items-center justify-center rounded-xl px-7 py-4 font-label text-lg font-bold text-white ring-1 ring-white/35 backdrop-blur-md transition hover:bg-white/10"
            >
              Ver passeios
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 inline-flex max-w-full flex-wrap overflow-hidden rounded-2xl bg-night-950/55 text-left text-sm text-white ring-1 ring-white/15 backdrop-blur-md"
          >
            {stats.map(({ href, icon: Icon, title, text }, i) => (
              <Link key={title} href={href} className={`flex items-center gap-2.5 px-5 py-3.5 transition hover:bg-white/10 ${i > 0 ? "sm:border-l sm:border-white/15" : ""}`}>
                <Icon size={22} className="text-flame-500" />
                <span className="leading-tight">
                  <strong className="block">{title}</strong>
                  <span className="text-xs text-white/65">{text}</span>
                </span>
              </Link>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto hidden w-full max-w-sm animate-float drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)] lg:block"
        >
          <RsMark priority />
        </motion.div>
      </div>

      {images.length > 1 && !site.heroVideo && (
        <div className="absolute bottom-24 right-6 hidden gap-1.5 sm:flex">
          {images.map((s, i) => (
            <button key={s} onClick={() => setIndex(i)} aria-label={`Foto ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === index ? "w-8 bg-flame-500" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
      )}
      <Link href="/#destaques" aria-label="Rolar" className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 text-white/60 sm:block">
        <ChevronDown className="animate-bounce" />
      </Link>
    </section>
  );
}
