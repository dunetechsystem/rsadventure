"use client";

import Image from "next/image";
import { Pencil, ShieldAlert, X } from "lucide-react";
import { itemKey, itemTotal, useCart, type CartItem } from "@/lib/cart";
import { longDate, money, unitCount } from "@/lib/format";

export function CartLine({ item, onEdit, error }: { item: CartItem; onEdit: () => void; error?: string }) {
  const remove = useCart((s) => s.remove);
  return (
    <div className="flex gap-3 rounded-3xl bg-night-800 p-3 shadow-sm ring-1 ring-white/5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-night-800">
        {item.image && <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className="line-clamp-2 flex-1 text-sm font-bold leading-snug text-white">{item.title}</p>
          <button
            onClick={() => remove(itemKey(item))}
            aria-label="Remover"
            className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/40 transition hover:bg-flame-500/10 hover:text-flame-500"
          >
            <X size={15} />
          </button>
        </div>
        <p className="mt-0.5 text-xs capitalize text-white/60">{item.date ? longDate(item.date) : "Sem data"}</p>
        <p className="text-xs text-white/60">
          {unitCount(item.saleUnit, item.seats)}
          {item.infants > 0 && ` + ${item.infants} de colo`}
        </p>
        {item.risk && (
          <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-600">
            <ShieldAlert size={12} /> Atividade de aventura · termo de risco
          </p>
        )}
        {error && <p className="mt-1 text-xs font-semibold text-flame-500">{error}</p>}
        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-1 text-xs font-bold text-white transition hover:border-night-700"
          >
            <Pencil size={11} /> Alterar
          </button>
          <span className="text-sm font-extrabold text-white">{money(itemTotal(item))}</span>
        </div>
      </div>
    </div>
  );
}
