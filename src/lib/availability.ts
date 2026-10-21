"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DayStatus, PublicAvailability } from "./dunastour/types";
import { fetchAvailability, fetchClosedDays } from "./dunastour/client";

/**
 * Regras de data do checkout — as mesmas do link dunastour.com.br/<slug> (CheckoutLinkPage): dias em que a
 * agência não abre aparecem como "Lotado"; passeio com vagas controladas só sai nos dias da lista e até
 * as vagas acabarem. Trekking ignora o dia fechado (a agência marcou a saída de propósito). O servidor
 * confere tudo de novo ao reservar.
 */
export type DayInfo = { status: "closed" | "full" | "open"; left?: number | null };

const FULL = "Lotado nessa data — escolha outro dia";
const NOT_RUNNING = "Esse passeio não sai nesse dia";

let closedDaysPromise: Promise<string[]> | null = null;
const availabilityCache = new Map<string, { at: number; promise: Promise<PublicAvailability> }>();

function loadClosedDays() {
  closedDaysPromise ??= fetchClosedDays().catch(() => {
    closedDaysPromise = null;
    return [];
  });
  return closedDaysPromise;
}

function loadAvailability(tourId: string, trek: boolean) {
  const cached = availabilityCache.get(tourId);
  if (cached && Date.now() - cached.at < 30_000) return cached.promise;
  const promise = fetchAvailability(tourId, trek).catch(() => ({ mode: null, days: [] }) as PublicAvailability);
  availabilityCache.set(tourId, { at: Date.now(), promise });
  return promise;
}

export interface DayRulesTarget {
  kind: "tour" | "package";
  id: string;
  trek: boolean;
}

export function useDayRules(target: DayRulesTarget) {
  const key = `${target.kind}:${target.id}`;
  // Resultado guardado com a chave do alvo: trocou o alvo, volta a "carregando" sem setState em effect.
  const [loaded, setLoaded] = useState<{ key: string; closed: Set<string>; avail: PublicAvailability } | null>(null);
  const loading = loaded?.key !== key;
  const closed = useMemo(() => (loading ? new Set<string>() : loaded!.closed), [loading, loaded]);
  const avail = loading ? null : loaded!.avail;

  useEffect(() => {
    let alive = true;
    Promise.all([
      loadClosedDays(),
      target.kind === "tour" ? loadAvailability(target.id, target.trek) : Promise.resolve<PublicAvailability>({ mode: null, days: [] }),
    ]).then(([closedDays, availability]) => {
      if (alive) setLoaded({ key, closed: new Set(closedDays), avail: availability });
    });
    return () => {
      alive = false;
    };
  }, [key, target.kind, target.id, target.trek]);

  /** undefined = sem informação (sem limite, ou além da janela do "todo dia"). */
  const dayOf = useCallback(
    (date: string): DayStatus | null | undefined => {
      if (!date || !avail?.mode) return undefined;
      const day = avail.days.find((d) => d.date === date);
      if (day) return day;
      const last = avail.days[avail.days.length - 1]?.date;
      return avail.mode === "DATES" || (last && date <= last) ? null : undefined;
    },
    [avail]
  );

  const isClosed = useCallback((date: string) => !target.trek && closed.has(date), [closed, target.trek]);

  const dateError = useCallback(
    (date: string, seats = 1): string | undefined => {
      if (!date) return undefined;
      if (isClosed(date)) return FULL;
      const day = dayOf(date);
      if (day === undefined) return undefined;
      if (!day || !day.open) return NOT_RUNNING;
      const left = day.left ?? 0;
      if (left <= 0) return FULL;
      return left < seats ? `Só ${left === 1 ? "resta 1 vaga" : `restam ${left} vagas`} nessa data` : undefined;
    },
    [dayOf, isClosed]
  );

  const dayInfo = useCallback(
    (date: string): DayInfo | undefined => {
      if (isClosed(date)) return { status: "closed" };
      const day = dayOf(date);
      if (day === undefined) return undefined;
      if (!day || !day.open) return { status: "closed" };
      return (day.left ?? 0) <= 0 ? { status: "full", left: 0 } : { status: "open", left: day.left };
    },
    [dayOf, isClosed]
  );

  /** Primeira data com vaga — trekking/datas fixas já abrem o calendário nela. */
  const firstOpenDate = avail?.mode === "DATES" ? avail.days.find((d) => d.open && (d.left ?? 1) > 0 && !isClosed(d.date))?.date : undefined;

  return { loading, dateError, dayInfo, firstOpenDate };
}
