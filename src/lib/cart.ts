"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import type { TourRiskType, TourSaleUnit } from "./dunastour/types";

/** Item do roteiro — um passeio ou pacote com a própria data (cada um pode ser num dia). */
export interface CartItem {
  kind: "tour" | "package";
  id: string;
  title: string;
  image: string | null;
  /** Preço unitário já com desconto. */
  unitPrice: number;
  /** Preço cheio (pra mostrar a economia). */
  fullPrice: number;
  saleUnit?: TourSaleUnit;
  vehicleMaxOccupancy?: number | null;
  risk: boolean;
  riskType?: TourRiskType | null;
  allowInfants: boolean;
  durationMinutes: number;
  tags: string[];
  trek: boolean;
  /** "YYYY-MM-DD" */
  date: string;
  seats: number;
  infants: number;
}

export const itemKey = (item: Pick<CartItem, "kind" | "id">) => `${item.kind}:${item.id}`;
export const itemTotal = (item: CartItem) => item.unitPrice * item.seats;

interface CartState {
  items: CartItem[];
  open: boolean;
  /** Último adicionado — o toast do carrinho mostra. */
  lastAdded: string | null;
  upsert: (item: CartItem) => void;
  remove: (key: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      lastAdded: null,
      upsert: (item) =>
        set((s) => {
          const key = itemKey(item);
          const exists = s.items.some((i) => itemKey(i) === key);
          return {
            items: exists ? s.items.map((i) => (itemKey(i) === key ? item : i)) : [...s.items, item],
            lastAdded: key,
          };
        }),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => itemKey(i) !== key) })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: "noma-roteiro",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);

/** O carrinho vem do localStorage: antes de hidratar, renderiza como vazio (sem mismatch). */
const noopSubscribe = () => () => {};

/** false no servidor e na hidratação, true depois — sem setState em effect. */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function useCartItems() {
  const items = useCart((s) => s.items);
  return useHydrated() ? items : [];
}
