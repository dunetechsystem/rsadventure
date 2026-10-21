"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Compass, ShoppingBag } from "lucide-react";
import { itemKey, itemTotal, useCart, useCartItems, type CartItem } from "@/lib/cart";
import { money } from "@/lib/format";
import { Sheet } from "@/components/ui/Sheet";
import { CartLine } from "./CartLine";
import { BookingForm } from "./BookingForm";

export function CartDrawer() {
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const items = useCartItems();
  const [editing, setEditing] = useState<CartItem | null>(null);
  const pathname = usePathname();
  const total = items.reduce((sum, i) => sum + itemTotal(i), 0);

  return (
    <>
      <Sheet
        open={open && !pathname.startsWith("/reservar")}
        onClose={() => setOpen(false)}
        side="right"
        title={
          <span className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-500" /> Meu roteiro
          </span>
        }
      >
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-8 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-night-800 text-flame-500">
              <Compass size={36} />
            </div>
            <p className="font-display text-2xl text-white">Seu roteiro está vazio</p>
            <p className="text-sm text-white/60">Escolha os passeios, a data e quantas pessoas vão — tudo numa reserva só.</p>
            <Link
              href="/passeios"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-flame-500 px-6 py-3 text-sm font-bold text-white"
            >
              Ver passeios
            </Link>
          </div>
        ) : (
          <div className="flex min-h-full flex-col">
            <div className="flex-1 space-y-3 p-5">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div key={itemKey(item)} layout exit={{ opacity: 0, x: 40 }}>
                    <CartLine item={item} onEdit={() => setEditing(item)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="sticky bottom-0 border-t border-white/10 bg-night-950/85 p-5 backdrop-blur">
              <div className="mb-4 flex items-end justify-between">
                <span className="text-sm font-semibold text-white/60">Total</span>
                <span className="font-display text-3xl text-white">{money(total)}</span>
              </div>
              <Link
                href="/reservar"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-amber-500/30"
              >
                Finalizar reserva <ArrowRight size={18} />
              </Link>
              <p className="mt-3 text-center text-xs text-white/50">Sem pagamento agora · a agência confirma pelo WhatsApp</p>
            </div>
          </div>
        )}
      </Sheet>
      <Sheet open={!!editing} onClose={() => setEditing(null)} title={editing?.title}>
        {editing && (
          <div className="p-5">
            <BookingForm base={editing} mode="edit" onDone={() => setEditing(null)} compact />
          </div>
        )}
      </Sheet>
    </>
  );
}
