"use client";

import Image from "next/image";
import { useState } from "react";
import { Images, Play } from "lucide-react";
import { isVideo, type GalleryItem } from "@/lib/media";
import { Lightbox } from "@/components/gallery/Lightbox";
import { cn } from "@/lib/cn";

/** Mosaico de fotos do passeio (1 grande + 4) com "Ver todas" abrindo o lightbox. */
export function MediaMosaic({ urls, title }: { urls: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const items: GalleryItem[] = urls.map((url) => ({ url, place: title, video: isVideo(url) }));
  const shown = items.slice(0, 5);
  if (!items.length) return null;
  return (
    <>
      <div className={cn("grid gap-2 overflow-hidden rounded-[2rem] sm:gap-3", shown.length > 1 && "grid-cols-4 grid-rows-2")}>
        {shown.map((item, i) => (
          <button
            key={item.url}
            onClick={() => setOpen(i)}
            className={cn(
              "group relative overflow-hidden bg-night-800",
              shown.length === 1 ? "aspect-video" : i === 0 ? "col-span-4 row-span-2 aspect-[4/3] sm:col-span-2" : "hidden aspect-square sm:block"
            )}
          >
            {item.video ? (
              <>
                <video src={`${item.url}#t=0.5`} muted preload="metadata" className="h-full w-full object-cover" />
                <Play className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 fill-white text-white" />
              </>
            ) : (
              <Image
                src={item.url}
                alt={title}
                fill
                priority={i === 0}
                sizes={i === 0 ? "(max-width: 640px) 100vw, 50vw" : "25vw"}
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            )}
          </button>
        ))}
      </div>
      {items.length > 1 && (
        <button
          onClick={() => setOpen(0)}
          className="mt-3 flex items-center gap-2 rounded-full bg-night-800 px-4 py-2 text-sm font-bold text-white shadow-sm ring-1 ring-white/10 transition hover:ring-white/30"
        >
          <Images size={16} /> Ver as {items.length} fotos
        </button>
      )}
      <Lightbox items={items} index={open} onClose={() => setOpen(null)} />
    </>
  );
}
