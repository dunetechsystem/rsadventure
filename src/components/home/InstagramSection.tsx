"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { site } from "@/config/site";
import { InstagramIcon, TikTokIcon } from "@/components/ui/BrandIcons";
import { DuneScene } from "@/components/ui/DuneScene";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { RsMark } from "@/components/ui/Logo";

/** "https://www.instagram.com/reel/ABC123/?igsh=…" → URL do embed oficial. */
function embedUrl(url: string) {
  const m = url.match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/i);
  if (!m) return null;
  const kind = m[1].toLowerCase() === "p" ? "p" : "reel";
  return `https://www.instagram.com/${kind}/${m[2]}/embed`;
}

/** Vídeo vertical estilo stories: toca mudo quando aparece na tela; tocar liga o som. */
function StoryVideo({ src, poster, title, handle }: { src: string; poster?: string; title: string; handle: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().then(() => setPlaying(true)).catch(() => {});
        else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.6 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className="group relative aspect-[9/16] w-[240px] shrink-0 snap-center overflow-hidden rounded-[2rem] bg-flame-500 shadow-2xl sm:w-[270px]">
      <video ref={ref} src={src} poster={poster} muted={muted} loop playsInline preload="metadata" className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-night-950/30" />
      <div className="absolute inset-x-0 top-0 flex items-center gap-2 p-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame-500 text-white ring-2 ring-amber-300">
          <RsMark className="h-6 w-6" />
        </span>
        <span className="text-xs font-bold text-white">{handle}</span>
      </div>
      {!playing && (
        <Play className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 fill-white/90 text-white/90" />
      )}
      <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-bold text-white">{title}</p>
      <button
        onClick={() => {
          setMuted((m) => !m);
          ref.current?.play().catch(() => {});
        }}
        aria-label={muted ? "Ligar som" : "Desligar som"}
        className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur"
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
}

/** Celular vazio com o selo — aparece até a agência cadastrar vídeos próprios. */
function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-[9/18.5] w-[170px] shrink-0 overflow-hidden rounded-[2rem] border-[5px] border-night-600 bg-night-950 shadow-2xl sm:w-[200px]", className)}>
      <span className="absolute left-1/2 top-1.5 z-10 h-3 w-14 -translate-x-1/2 rounded-full bg-night-600" />
      {children}
    </div>
  );
}

export function InstagramSection({
  instagram,
  photos,
  videos,
}: {
  instagram: string;
  /** Fotos pros celulares quando não há reels/vídeos. */
  photos: string[];
  /** Vídeos vindos do DunasTour (fotos/vídeos dos lugares). */
  videos: { src: string; title: string }[];
}) {
  const reels = site.instagramReels.map(embedUrl).filter((u): u is string => !!u);
  const stories = [...site.videos, ...videos];
  const profile = `https://instagram.com/${instagram}`;
  const phones = photos.slice(0, 4);

  return (
    <section id="instagram" className="scroll-mt-20 overflow-hidden py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.4fr]">
        <Reveal>
          <p className="font-label text-lg font-semibold text-flame-500">Experiências reais</p>
          <h2 className="mt-2 text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl">Veja como é viver essa aventura</h2>
          <span className="brush mt-3 block h-3 w-44" />
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">Momentos reais, paisagens incríveis e clientes que viveram experiências inesquecíveis com a RS Adventure.</p>
          <div className="mt-8 flex gap-3">
            <a href={profile} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 rounded-xl bg-flame-500 px-6 py-3.5 font-label text-lg font-bold text-white shadow-lg shadow-flame-500/25 transition hover:bg-flame-400">
              <InstagramIcon size={20} /> <span className="underline decoration-2 underline-offset-4">Veja mais no Instagram</span>
            </a>
            {site.tiktok && (
              <a href={`https://www.tiktok.com/@${site.tiktok}`} target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-night-800 text-white ring-1 ring-white/15 transition hover:bg-flame-500">
                <TikTokIcon />
              </a>
            )}
          </div>
        </Reveal>

        {reels.length === 0 && stories.length === 0 && (
          <Reveal delay={0.1} className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-14 sm:mx-0 sm:px-0 lg:justify-end">
            {[0, 1, 2, 3].map((i) => (
              <a key={i} href={profile} target="_blank" rel="noreferrer" className={cn("group block", i % 2 ? "sm:translate-y-8" : "")}>
                <PhoneFrame>
                  {phones[i] ? (
                    <Image src={phones[i]} alt="" fill sizes="200px" className="object-cover transition duration-700 group-hover:scale-110" />
                  ) : (
                    <DuneScene id={`p${i}`} className="transition duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-night-950/30" />
                  <RsMark className="absolute left-3 top-6 w-9" />
                  <span className="absolute inset-x-0 bottom-3 flex justify-center text-white">
                    <Play size={34} className="fill-white/90 text-white/90 transition group-hover:scale-110" />
                  </span>
                </PhoneFrame>
              </a>
            ))}
          </Reveal>
        )}
      </div>

      {(reels.length > 0 || stories.length > 0) && (
        <div className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 sm:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          {stories.map((v) => (
            <StoryVideo key={v.src} {...v} handle={instagram} />
          ))}
          {reels.map((src) => (
            <div key={src} className="w-[328px] shrink-0 snap-center overflow-hidden rounded-[2rem] bg-night-800 shadow-xl ring-1 ring-white/5">
              <iframe src={src} title="Reel do Instagram" loading="lazy" allowFullScreen className="h-[600px] w-full border-0" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
