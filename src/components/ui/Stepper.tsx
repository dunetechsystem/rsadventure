"use client";

import { Minus, Plus } from "lucide-react";

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 30,
  label,
  hint,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div>
        <p className="text-sm font-bold text-white">{label}</p>
        {hint && <p className="text-xs text-white/50">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Menos ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-night-700 disabled:opacity-25"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center text-lg font-extrabold tabular-nums text-white">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Mais ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-night-700 disabled:opacity-25"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
