"use client";

import { useEffect, type ReactNode } from "react";
import { useHydrated } from "@/lib/cart";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/** Modal: folha que sobe no celular, painel centralizado (ou lateral, side="right") no computador. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  side = "center",
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  side?: "center" | "right";
  className?: string;
}) {
  const mounted = useHydrated();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal>
          <motion.div
            className="absolute inset-0 bg-night-950/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={side === "right" ? { x: "100%" } : { y: "100%", opacity: 0.5 }}
            animate={side === "right" ? { x: 0 } : { y: 0, opacity: 1 }}
            exit={side === "right" ? { x: "100%" } : { y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-night-900 shadow-2xl",
              side === "right"
                ? "ml-auto h-dvh max-h-dvh sm:max-w-md sm:self-stretch"
                : "rounded-t-[2rem] sm:max-w-lg sm:rounded-[2rem]",
              className
            )}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <div className="min-w-0 flex-1 font-display text-xl text-white">{title}</div>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
