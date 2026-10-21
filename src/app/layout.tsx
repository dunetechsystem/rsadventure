import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Outfit } from "next/font/google";
import "./globals.css";
import { cartEnabled, site } from "@/config/site";
import { getAgency } from "@/lib/dunastour/server";
import { agencyInfo } from "@/lib/agency-info";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { CartDrawer } from "@/components/checkout/CartDrawer";

// Outfit = títulos e textos (geométrica, como no site da marca); Barlow Condensed = letreiro dos cards e botões.
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "RS Adventure · Passeios e aventuras nos Lençóis Maranhenses",
    template: "%s · RS Adventure",
  },
  description:
    "Não vendemos passeio, vendemos experiência. Quadriciclo, motocross, UTV, sobrevoo, Lagoa Azul, Lagoa Bonita, Atins e Santo Amaro com a RS Adventure em Barreirinhas.",
  keywords: ["Lençóis Maranhenses", "Barreirinhas", "quadriciclo", "motocross", "UTV", "sobrevoo", "Lagoa Azul", "Lagoa Bonita", "Atins", "Santo Amaro", "RS Adventure"],
  icons: { icon: "/brand/rs-adventure-logo-v2.png" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "RS Adventure" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#050c1c",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const info = agencyInfo(await getAgency());
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${barlow.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        <Header info={info} />
        <main>{children}</main>
        <Footer info={info} />
        <WhatsAppFab phone={info.phone} />
        {cartEnabled && <CartDrawer phone={info.phone} />}
      </body>
    </html>
  );
}
