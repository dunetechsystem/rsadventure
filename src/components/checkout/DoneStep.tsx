"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PartyPopper } from "lucide-react";
import type { CheckoutSubmissionResponse } from "@/lib/dunastour/types";
import { displayTitle, longDate, money, whatsappUrl } from "@/lib/format";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";

const CONFETTI = ["#5e9faa", "#e3b23c", "#c4541c", "#a9aa3c", "#ebd6a9"];

/** Reserva enviada: cada item virou um voucher pendente na agência. O próximo passo é o WhatsApp pra combinar o pagamento. */
export function DoneStep({
  result,
  agencyName,
  agencyPhone,
}: {
  result: { items: CheckoutSubmissionResponse[]; infants: number; risk: boolean; name: string };
  agencyName: string;
  agencyPhone: string;
}) {
  const total = result.items.reduce((s, r) => s + r.totalAmount, 0);
  const phone = result.items[0]?.agencyPhone || agencyPhone;
  const message = [
    `Olá, ${result.items[0]?.agencyName ?? agencyName}! Acabei de fazer uma reserva pelo site:`,
    ...result.items.map((r) => `• ${displayTitle(r.tourTitle)} — ${r.seats} pessoa(s) — ${longDate(r.scheduledDate)} — ${money(r.totalAmount)}`),
    ...(result.infants > 0 ? [`👶 ${result.infants} criança(s) de colo`] : []),
    `Nome: ${result.name}`,
    `Total: ${money(total)}`,
    ...(result.risk ? ["✅ Termo de risco assinado"] : []),
    "",
    "Como faço o pagamento?",
  ].join("\n");

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 pb-10 pt-32 text-center sm:px-6">
      {Array.from({ length: 28 }, (_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute top-20 h-3 w-2 rounded-sm"
          style={{ left: `${(i * 37) % 100}%`, background: CONFETTI[i % CONFETTI.length] }}
          initial={{ y: -40, opacity: 1, rotate: 0 }}
          animate={{ y: 700, opacity: 0, rotate: 360 + i * 20 }}
          transition={{ duration: 2.4 + (i % 5) * 0.3, delay: (i % 7) * 0.08, ease: "easeIn" }}
        />
      ))}
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-2xl shadow-amber-500/40"
      >
        <PartyPopper size={42} />
      </motion.span>
      <h1 className="mt-8 font-display text-5xl text-white">Reserva enviada!</h1>
      <p className="mt-3 text-lg text-white/60">
        Agora é só chamar a {agencyName} no WhatsApp pra confirmar e combinar o pagamento. Você também recebe tudo por e-mail.
      </p>

      <div className="mt-8 divide-y divide-white/10 rounded-[2rem] bg-night-800 p-6 text-left ring-1 ring-white/5">
        {/* O id é o do voucher — vários passeios no mesmo voucher repetem o id. */}
        {result.items.map((r, i) => (
          <div key={`${r.id}-${i}`} className="flex justify-between gap-4 py-3 first:pt-0">
            <div>
              <p className="font-bold text-white">{displayTitle(r.tourTitle)}</p>
              <p className="text-sm capitalize text-white/60">
                {longDate(r.scheduledDate)} · {r.seats} pessoa(s)
              </p>
            </div>
            <p className="shrink-0 font-bold text-white">{money(r.totalAmount)}</p>
          </div>
        ))}
        <div className="flex justify-between pt-4 text-lg font-extrabold text-white">
          <span>Total</span>
          <span>{money(total)}</span>
        </div>
      </div>

      <a
        href={whatsappUrl(phone, message)}
        target="_blank"
        rel="noreferrer"
        className="mt-8 flex items-center justify-center gap-3 rounded-full bg-[#25D366] py-5 text-base font-extrabold text-white shadow-xl shadow-[#25D366]/30 transition hover:brightness-105"
      >
        <WhatsAppIcon size={24} /> Confirmar pelo WhatsApp
      </a>
      <Link href="/" className="mt-5 inline-block text-sm font-bold text-white/60 underline">
        Voltar ao início
      </Link>
    </div>
  );
}
