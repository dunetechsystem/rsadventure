import { site } from "@/config/site";
import type { AgencyPublicProfile } from "./dunastour/types";
import { instagramHandle } from "./format";

/** Contato da agência pros componentes do layout — o do DunasTour, ou o do config se a API estiver fora. */
export interface AgencyInfo {
  name: string;
  phone: string;
  instagram: string;
  city: string;
  description: string | null;
  logoUrl: string | null;
  cnpj: string | null;
  legalName: string | null;
  /** Link do registro no Cadastur (Ministério do Turismo), preenchido pela agência no DunasTour. */
  cadasturUrl: string | null;
}

export function agencyInfo(agency: AgencyPublicProfile | null): AgencyInfo {
  return {
    name: site.name,
    phone: agency?.phone || site.fallbackWhatsapp,
    instagram: instagramHandle(agency?.instagramHandle) ?? site.fallbackInstagram,
    city: agency?.addressCity || "Barreirinhas",
    description: agency?.description ?? null,
    logoUrl: agency?.logoUrl ?? null,
    cnpj: agency?.documentCnpj ?? null,
    legalName: agency?.legalName ?? null,
    cadasturUrl: agency?.cadasturUrl || null,
  };
}
