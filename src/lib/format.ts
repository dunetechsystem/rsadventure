import type { TourCard, TourSaleUnit } from "./dunastour/types";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const money = (value: number) => BRL.format(value);

/** Mesma conta do Tour.discounted no backend: unitário arredondado no centavo. */
export function discountedPrice(price: number, discountPercent?: number | null) {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.round(price * (100 - discountPercent)) / 100;
}

export const tourUnitPrice = (tour: Pick<TourCard, "basePrice" | "discountPercent">) =>
  discountedPrice(tour.basePrice, tour.discountPercent);

export function duration(minutes: number) {
  if (!minutes) return "";
  if (minutes >= 360) return minutes >= 600 ? "Dia inteiro" : `${Math.round(minutes / 60)}h · dia inteiro`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h${m ? String(m).padStart(2, "0") : ""}` : `${m} min`;
}

/** A partir de 6h (ou com a tag "dia inteiro") o passeio ocupa o dia — dois na mesma data não cabem. */
export function isFullDayTour(tour: Pick<TourCard, "durationMinutes" | "tags">) {
  return tour.durationMinutes >= 360 || tour.tags.some((tag) => stripAccents(tag).trim().toLowerCase() === "dia inteiro");
}

export function stripAccents(text: string) {
  return text.normalize("NFD").replace(/\p{M}/gu, "");
}

/** Mesma regra do backend (RiskTermService.normalizeName): a assinatura tem que ser o nome da reserva. */
export function normalizeName(name: string) {
  return stripAccents(name).trim().replace(/\s+/g, " ").toLowerCase();
}

const SMALL_WORDS = new Set(["de", "da", "do", "das", "dos", "e", "a", "o", "com", "em", "no", "na", "por", "pra", "x"]);

/** "🌴CIRCUITO LAGOA BONITA📸" → "Circuito Lagoa Bonita" — títulos limpos pros cards do site. */
export function displayTitle(raw: string) {
  const clean = raw
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  const letters = clean.replace(/[^\p{L}]/gu, "");
  const mostlyUpper = letters.length > 0 && letters === letters.toUpperCase();
  if (!mostlyUpper) return clean || raw;
  return titleCase(clean);
}

export function titleCase(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word, i) => (i > 0 && SMALL_WORDS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

/** "lagoa-bonita" → "Lagoa Bonita" (ids dos pontos turísticos do DunasTour). */
export const spotName = (spotId: string) => titleCase(spotId.replace(/[-_]+/g, " "));

const UNIT_NAMES: Record<TourSaleUnit, [string, string]> = {
  PESSOA: ["pessoa", "pessoas"],
  QUADRICICLO: ["quadriciclo", "quadriciclos"],
  UTV: ["UTV", "UTVs"],
  MOTO_CRF: ["moto", "motos"],
  CARRO: ["veículo", "veículos"],
};

export function unitLabel(unit: TourSaleUnit | null | undefined, n: number) {
  const [one, many] = UNIT_NAMES[unit ?? "PESSOA"];
  return n === 1 ? one : many;
}

export const unitCount = (unit: TourSaleUnit | null | undefined, n: number) => `${n} ${unitLabel(unit, n)}`;
export const perUnit = (unit: TourSaleUnit | null | undefined) => `por ${unitLabel(unit, 1)}`;

// --- datas ("YYYY-MM-DD" sempre no fuso local, sem passar por UTC) ---

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function parseISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export const todayISO = () => toISODate(new Date());

export const longDate = (iso: string) =>
  parseISODate(iso).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "long" });

export const shortDate = (iso: string) => parseISODate(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

// --- contato ---

export const digitsOnly = (s: string) => s.replace(/\D/g, "");

/** api.whatsapp.com em vez de wa.me: o redirect do wa.me pro WhatsApp Web/Desktop perde as quebras de linha e quebra emojis. */
export function whatsappUrl(phone: string, text?: string) {
  const digits = digitsOnly(phone);
  const full = digits.length <= 11 ? `55${digits}` : digits;
  return `https://api.whatsapp.com/send?phone=${full}${text ? `&text=${encodeURIComponent(text)}` : ""}`;
}

/** A API guarda o Instagram às vezes como URL inteira ("https://www.instagram.com/lencoiscomkorea"). */
export function instagramHandle(value: string | null | undefined) {
  if (!value) return null;
  return value.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/[/?#].*$/, "") || null;
}

export function formatCpf(value: string) {
  const d = digitsOnly(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function isValidCpf(value: string) {
  const cpf = digitsOnly(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10]);
}

/** Passeio privativo = vendido por veículo (quadri, UTV, moto, carro) ou sobrevoo; o resto é coletivo (por pessoa). */
export function isPrivateTour(tour: Pick<TourCard, "saleUnit" | "title" | "riskType">) {
  if (tour.saleUnit && tour.saleUnit !== "PESSOA") return true;
  return /sobrevoo|voo\b|privativ|lancha exclusiv/i.test(tour.title) || !!tour.riskType;
}
