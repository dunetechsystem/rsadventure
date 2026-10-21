/** Fundos dos blocos coloridos do site (fundo · marca · texto). */
export const TONES = {
  noite: { card: "bg-night-700", accent: "text-flame-500", text: "text-white/70" },
  laranja: { card: "bg-flame-500", accent: "text-white", text: "text-white/85" },
  lagoa: { card: "bg-lagoon-500", accent: "text-white", text: "text-white/85" },
  "azul-royal": { card: "bg-night-600", accent: "text-amber-400", text: "text-white/75" },
} as const;

export type Tone = keyof typeof TONES;

export const toneOf = (name: string) => TONES[name as Tone] ?? TONES.noite;
