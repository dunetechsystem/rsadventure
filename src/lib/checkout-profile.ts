"use client";

/** "Lembrar meus dados neste aparelho" — fica só no navegador (citado na política de privacidade). */
export interface CheckoutProfile {
  name: string;
  email: string;
  phoneIso: string;
  phone: string;
  cpf: string;
  address: string;
}

const KEY = "noma-dados";

export function loadProfile(): CheckoutProfile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CheckoutProfile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: CheckoutProfile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // sem storage: só não lembra
  }
}

export function clearProfile() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // idem
  }
}
