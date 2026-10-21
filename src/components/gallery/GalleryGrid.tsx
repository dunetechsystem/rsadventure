"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Expand, Play } from "lucide-react";
import type { GalleryItem } from "@/lib/media";
import { Lightbox } from "./Lightbox";
import { cn } from "@/lib/cn";

/** Mosaico com filtro por lugar. `limit` mostra só os primeiros (prévia da home). */
export function GalleryGrid({ items, limit, filters = true }: { items: GalleryItem[]; limit?: number; filters?: boolean }) {
  const places = useMemo(() => [...new Set(items.map((i) => i.place))], [items]);
  const [place, setPlace] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const filtered = place ? items.filter((i) => i.place === place) : items;
  const shown = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      {filters && places.length > 1 && (
        <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {[null, ...places].map((p) => (
            <button
              key={p ?? "all"}
              onClick={() => setPlace(p)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition",
                place === p ? "bg-flame-500 text-white" : "bg-night-800 text-white ring-1 ring-white/10 hover:ring-white/30"
              )}
            >
              {p ?? "Tudo"}
            </button>
          ))}
        </div>
      )}
      <motion.div layout className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        <AnimatePresence>
          {shown.map((item, i) => (
            <motion.button
              layout
              key={item.url}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4 }}
              onClick={() => setOpen(i)}
              className={cn(
                "group relative mb-3 block w-full overflow-hidden rounded-3xl bg-night-800 sm:mb-4",
                i % 5 === 0 ? "aspect-[3/4]" : i % 3 === 0 ? "aspect-square" : "aspect-[4/5]"
              )}
            >
              {item.video ? (
                <video src={`${item.url}#t=0.5`} muted playsInline preload="metadata" className="h-full w-full object-cover" />
              ) : (
                <Image
                  src={item.url}
                  alt={item.place}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-night-950/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 translate-y-2 text-left text-sm font-bold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                {item.place}
              </span>
              <span
                className={cn(
                  "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-night-950/85 text-white shadow transition",
                  !item.video && "opacity-0 group-hover:opacity-100"
                )}
              >
                {item.video ? <Play size={15} className="fill-night-700" /> : <Expand size={14} />}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
      <Lightbox items={shown} index={open} onClose={() => setOpen(null)} />
    </div>
  );
}
