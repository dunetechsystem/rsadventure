import Link from "next/link";
import { BadgeCheck, MapPin, Phone } from "lucide-react";
import { site } from "@/config/site";
import type { AgencyInfo } from "@/lib/agency-info";
import { whatsappUrl } from "@/lib/format";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { RsLogo } from "@/components/ui/Logo";

export function Footer({ info }: { info: AgencyInfo }) {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-night-950 text-white/75">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <RsLogo className="text-xl" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            {site.slogan} Passeios, aventuras e experiências privativas em Barreirinhas e nos Lençóis Maranhenses.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={`https://instagram.com/${info.instagram}`} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-flame-500">
              <InstagramIcon />
            </a>
            {site.tiktok && (
              <a href={`https://www.tiktok.com/@${site.tiktok}`} target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-flame-500">
                <TikTokIcon />
              </a>
            )}
            <a href={whatsappUrl(info.phone)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-flame-500">
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        <div>
          <p className="font-label text-xl font-bold text-flame-500">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/passeios" className="hover:text-flame-400">Todos os passeios</Link></li>
            <li><Link href="/galeria" className="hover:text-flame-400">Galeria de fotos e vídeos</Link></li>
            <li><Link href="/#lagoas" className="hover:text-flame-400">Como estão as lagoas</Link></li>
            {site.onlineBooking && <li><Link href="/reservar" className="hover:text-flame-400">Meu roteiro</Link></li>}
            <li><Link href="/termos" className="hover:text-flame-400">Termos e privacidade</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-label text-xl font-bold text-flame-500">Contato</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-flame-500" />
              <a href={whatsappUrl(info.phone)} target="_blank" rel="noreferrer" className="hover:text-flame-400">{info.phone}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <InstagramIcon size={16} className="mt-0.5 shrink-0 text-flame-500" />
              <a href={`https://instagram.com/${info.instagram}`} target="_blank" rel="noreferrer" className="hover:text-flame-400">@{info.instagram}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-flame-500" />
              <span>{info.city} · Maranhão · Brasil</span>
            </li>
            {info.cadasturUrl && (
              <li className="flex items-start gap-2.5">
                <BadgeCheck size={16} className="mt-0.5 shrink-0 text-flame-500" />
                <a href={info.cadasturUrl} target="_blank" rel="noreferrer" className="hover:text-flame-400">Agência cadastrada no Cadastur</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {info.legalName ?? site.name}
            {info.cnpj ? ` · CNPJ ${info.cnpj}` : ""}
          </p>
          <p>
            {site.onlineBooking && "Reservas processadas com segurança pela plataforma DunasTour · "}
            Site feito por{" "}
            <a href="https://dunastour.com.br" target="_blank" rel="noreferrer" className="font-semibold text-flame-500 hover:text-white">
              DunasTour
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
