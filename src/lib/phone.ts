/**
 * Telefone com DDI — enviado como "+55 (98) 99999-9999", igual ao link do DunasTour (o backend compara
 * só os dígitos e ignora o 55 do Brasil).
 */
export interface PhoneCountry {
  iso: string;
  name: string;
  flag: string;
  dial: string;
  minDigits: number;
  maxDigits: number;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: "BR", name: "Brasil", flag: "🇧🇷", dial: "55", minDigits: 10, maxDigits: 11 },
  { iso: "AR", name: "Argentina", flag: "🇦🇷", dial: "54", minDigits: 10, maxDigits: 11 },
  { iso: "UY", name: "Uruguai", flag: "🇺🇾", dial: "598", minDigits: 8, maxDigits: 8 },
  { iso: "PY", name: "Paraguai", flag: "🇵🇾", dial: "595", minDigits: 9, maxDigits: 9 },
  { iso: "CL", name: "Chile", flag: "🇨🇱", dial: "56", minDigits: 9, maxDigits: 9 },
  { iso: "US", name: "Estados Unidos", flag: "🇺🇸", dial: "1", minDigits: 10, maxDigits: 10 },
  { iso: "PT", name: "Portugal", flag: "🇵🇹", dial: "351", minDigits: 9, maxDigits: 9 },
  { iso: "ES", name: "Espanha", flag: "🇪🇸", dial: "34", minDigits: 9, maxDigits: 9 },
  { iso: "FR", name: "França", flag: "🇫🇷", dial: "33", minDigits: 9, maxDigits: 9 },
  { iso: "IT", name: "Itália", flag: "🇮🇹", dial: "39", minDigits: 9, maxDigits: 10 },
  { iso: "DE", name: "Alemanha", flag: "🇩🇪", dial: "49", minDigits: 10, maxDigits: 11 },
  { iso: "GB", name: "Reino Unido", flag: "🇬🇧", dial: "44", minDigits: 10, maxDigits: 10 },
];

export function formatNational(country: PhoneCountry, digits: string) {
  const d = digits.slice(0, country.maxDigits);
  if (country.iso !== "BR") return d;
  if (d.length <= 2) return d;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  const split = rest.length > 8 ? 5 : 4;
  return rest.length > split ? `(${ddd}) ${rest.slice(0, split)}-${rest.slice(split)}` : `(${ddd}) ${rest}`;
}

export const buildPhone = (country: PhoneCountry, national: string) =>
  `+${country.dial} ${formatNational(country, national.replace(/\D/g, ""))}`;

export function isCompletePhone(country: PhoneCountry, national: string) {
  const n = national.replace(/\D/g, "").length;
  return n >= country.minDigits && n <= country.maxDigits;
}
