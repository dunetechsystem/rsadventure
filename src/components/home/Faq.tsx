"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { SectionTitle } from "@/components/ui/Reveal";

export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" className="mx-auto grid max-w-7xl scroll-mt-20 gap-12 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-[1fr_1.4fr]">
      <SectionTitle
        eyebrow="Dúvidas"
        title={
          <>
            Tudo que você <em>precisa saber</em>
          </>
        }
        text="Não achou sua resposta? Chama no WhatsApp — a gente responde rapidinho."
      />
      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.question} className="overflow-hidden rounded-3xl bg-night-800 ring-1 ring-white/5 transition hover:ring-white/15">
              <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center gap-4 px-6 py-5 text-left" aria-expanded={isOpen}>
                <span className="flex-1 text-base font-bold text-white sm:text-lg">{item.question}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isOpen ? "bg-amber-500 text-white" : "bg-night-800 text-white"}`}
                >
                  <Plus size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3 }}>
                    <p className="px-6 pb-6 leading-relaxed text-white/70">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
