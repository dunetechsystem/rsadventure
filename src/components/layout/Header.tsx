"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart, useCartItems } from "@/lib/cart";
import { whatsappUrl } from "@/lib/format";
import type { AgencyInfo } from "@/lib/agency-info";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { RsLogo } from "@/components/ui/Logo";
import { cartEnabled } from "@/config/site";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/#passeios", label: "Passeios" },
  { href: "/#destaques", label: "Destaques" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/galeria", label: "Galeria" },
  { href: "/#lagoas", label: "Lagoas" },
  { href: "/#duvidas", label: "Dúvidas" },
];

/** Páginas com hero escuro no topo: o cabeçalho começa transparente e fica sólido ao rolar. */
const HERO_PAGES = [/^\/$/, /^\/passeios(\/[^/]+)?$/, /^\/pacotes\/[^/]+$/, /^\/galeria$/];

export function Header({ info }: { info: AgencyInfo }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartItems();
  const setCartOpen = useCart((s) => s.setOpen);
  // Trocou de página: fecha o menu.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }
  const solid = scrolled || menuOpen || !HERO_PAGES.some((re) => re.test(pathname));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        solid ? "bg-night-950/90 py-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl" : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="relative flex shrink-0 items-center gap-2" aria-label="RS Adventure — início">
          <RsLogo className={cn("text-[1.05rem] transition-all duration-500", !solid && "sm:text-[1.2rem]")} />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium tracking-wide transition",
                solid ? "text-white hover:bg-white/5" : "text-white/90 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <a
            href={`https://instagram.com/${info.instagram}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className={cn(
              "hidden h-10 w-10 items-center justify-center rounded-full transition sm:flex",
              solid ? "text-white hover:bg-white/5" : "text-white hover:bg-white/10"
            )}
          >
            <InstagramIcon />
          </a>
          {cartEnabled && (
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Meu roteiro (${items.length})`}
              className={cn(
                "relative flex h-10 items-center gap-2 rounded-full px-3 text-sm font-bold transition",
                solid
                  ? "bg-flame-500 text-white hover:bg-flame-400"
                  : "bg-white/15 text-white ring-1 ring-white/30 backdrop-blur hover:bg-white/25"
              )}
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Meu roteiro</span>
              <AnimatePresence>
                {items.length > 0 && (
                  <motion.span
                    key={items.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[11px] font-extrabold text-white ring-2 ring-night-900"
                  >
                    {items.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
          <a
            href={whatsappUrl(info.phone, "Olá, RS Adventure! Vim pelo site e quero saber sobre os passeios 😊")}
            target="_blank"
            rel="noreferrer"
            className={cn("hidden h-10 items-center gap-2 whitespace-nowrap rounded-xl px-5 font-label text-lg font-bold transition md:flex", "bg-flame-500 text-white hover:bg-flame-400")}
          >
            <WhatsAppIcon size={18} /> Falar agora
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
              solid ? "text-white hover:bg-white/5" : "text-white hover:bg-white/10"
            )}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pb-5 pt-3">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={item.href} className="block rounded-2xl px-4 py-3 font-display text-xl text-white hover:bg-night-800">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href={whatsappUrl(info.phone, "Olá, RS Adventure! Vim pelo site e quero saber sobre os passeios 😊")}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-flame-500 py-3.5 font-semibold text-white"
              >
                <WhatsAppIcon /> Falar no WhatsApp
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
