"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/media";
import { useHydrated } from "@/lib/cart";

/** Tela cheia com setas, teclado e arrastar pro lado. */
export function Lightbox({ items, index, onClose }: { items: GalleryItem[]; index: number | null; onClose: () => void }) {
  const [current, setCurrent] = useState(index ?? 0);
  const [dir, setDir] = useState(0);
  const mounted = useHydrated();
  // Abriu em outra foto: começa nela (ajuste durante o render, sem effect).
  const [openedAt, setOpenedAt] = useState(index);
  if (index !== openedAt) {
    setOpenedAt(index);
    if (index != null) setCurrent(index);
  }

  const go = useCallback(
    (step: number) => {
      setDir(step);
      setCurrent((c) => (c + step + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    if (index == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, go, onClose]);

  if (!mounted) return null;
  const item = items[current];
  return createPortal(
    <AnimatePresence>
      {index != null && item && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-night-950/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
            <p className="text-sm font-semibold text-white/70">
              {item.place} <span className="text-white/40">· {current + 1}/{items.length}</span>
            </p>
            <button onClick={onClose} aria-label="Fechar" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <X size={20} />
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={item.url}
                custom={dir}
                className="absolute inset-0 flex items-center justify-center p-2 sm:p-8"
                initial={{ x: dir * 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: dir * -300, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 260 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
              >
                {item.video ? (
                  <video src={item.url} controls autoPlay playsInline className="max-h-full max-w-full rounded-2xl" />
                ) : (
                  <div className="relative h-full w-full">
                    <Image src={item.url} alt={item.place} fill sizes="100vw" className="pointer-events-none object-contain" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  aria-label="Anterior"
                  className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:flex"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Próxima"
                  className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:flex"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
            {items.map((it, i) => (
              <button
                key={it.url}
                onClick={() => {
                  setDir(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl transition ${i === current ? "ring-2 ring-amber-400" : "opacity-50 hover:opacity-100"}`}
              >
                {it.video ? (
                  <video src={`${it.url}#t=0.5`} muted preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  <Image src={it.url} alt="" fill sizes="56px" className="object-cover" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
