"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Sobe e aparece quando entra na tela. */
export function Reveal({ children, delay = 0, className, y = 32 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  text,
  light = false,
  center = false,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className={`flex items-center gap-3 font-label text-base font-semibold text-flame-500 sm:text-lg ${center ? "justify-center" : ""}`}>
        <span className="h-0.5 w-8 -skew-x-[30deg] bg-flame-500" />
        {eyebrow}
        {center && <span className="h-0.5 w-8 -skew-x-[30deg] bg-flame-500" />}
      </p>
      <h2 className="mt-3 text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl">{title}</h2>
      <span className={`brush mt-3 block h-3 w-44 ${center ? "mx-auto" : ""}`} />
      {text && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? "text-white/80" : "text-white/60"}`}>{text}</p>}
    </Reveal>
  );
}
