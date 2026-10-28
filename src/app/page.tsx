import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/config/site";
import { getAgency, getLagoons, getPackages, getReviews, getTours } from "@/lib/dunastour/server";
import { getGallery } from "@/lib/dunastour/gallery";
import { tourUnitPrice } from "@/lib/format";
import { agencyInfo } from "@/lib/agency-info";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Featured } from "@/components/home/Featured";
import { TourSections } from "@/components/home/TourSections";
import { isTransfer } from "@/lib/transfers";
import { Services } from "@/components/home/Services";
import { About } from "@/components/home/About";
import { Credentials } from "@/components/home/Credentials";
import { Lagoons } from "@/components/home/Lagoons";
import { InstagramSection } from "@/components/home/InstagramSection";
import { Reviews } from "@/components/home/Reviews";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Reveal, SectionTitle } from "@/components/ui/Reveal";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export const revalidate = 300;

export default async function Home() {
  const [agency, tours, packages, reviews, lagoons, gallery] = await Promise.all([
    getAgency(),
    getTours(),
    getPackages(),
    getReviews(),
    getLagoons(),
    getGallery(),
  ]);
  const info = agencyInfo(agency);
  const photos = gallery.filter((g) => !g.video).map((g) => g.url);
  const heroImages = [...new Set([agency?.coverImageUrl, ...tours.filter((t) => !isTransfer(t)).map((t) => t.coverImageUrl), ...photos])]
    .filter((u): u is string => !!u)
    .slice(0, 6);
  const videos = gallery.filter((g) => g.video).map((g) => ({ src: g.url, title: g.place }));
  const googleRatings = (agency?.checkoutPage?.googleReviews ?? []).map((r) => r.rating);
  const ratingCount = (reviews?.count ?? 0) + googleRatings.length;
  const rating = ratingCount
    ? { average: ((reviews?.average ?? 0) * (reviews?.count ?? 0) + googleRatings.reduce((a, b) => a + b, 0)) / ratingCount, count: ratingCount }
    : null;
  // Preço de entrada do hero: o passeio por pessoa mais barato (veículo e transfer não comparam).
  const perPerson = tours
    .filter((t) => (!t.saleUnit || t.saleUnit === "PESSOA") && !(t.transferFrom && t.transferTo))
    .map(tourUnitPrice)
    .filter((p) => p > 0);
  const faqs = agency?.checkoutPage?.faqs.length ? [...agency.checkoutPage.faqs, ...site.faqs] : site.faqs;
  // Ficha da agência pro Google (nome, logo, telefone, cidade e Instagram no resultado da busca).
  // WebSite: nome do site no resultado do Google, no lugar do domínio.
  // WebPage: a miniatura do resultado é a imagem com a logo (o Google pode escolher outra foto, mas essa é a indicada).
  const logoCard = `${site.url}/opengraph-image.jpg`;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url },
    { "@context": "https://schema.org", "@type": "WebPage", url: site.url, name: site.name, primaryImageOfPage: logoCard },
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: site.name,
      slogan: site.slogan,
      url: site.url,
      logo: `${site.url}/brand/rs-adventure-logo-v2.png`,
      image: logoCard,
      telephone: info.phone,
      address: { "@type": "PostalAddress", addressLocality: info.city, addressRegion: "MA", addressCountry: "BR" },
      founder: { "@type": "Person", name: site.founder.name },
      sameAs: [`https://www.instagram.com/${info.instagram}`],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero
        images={heroImages}
        tourCount={tours.length + packages.length}
        phone={info.phone}
        lagoonLevel={lagoons?.level ?? null}
        rating={rating}
        cadasturUrl={info.cadasturUrl}
        minPrice={perPerson.length ? Math.min(...perPerson) : null}
      />
      <Marquee items={site.destinations} />
      <Featured tours={tours} phone={info.phone} />
      <TourSections tours={tours} packages={packages} phone={info.phone} />

      <Services />
      <About description={info.description} instagram={info.instagram} />
      <Credentials cadasturUrl={info.cadasturUrl} cnpj={info.cnpj} legalName={info.legalName} rating={rating} />

      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Galeria"
              title={
                <>
                  Paisagens que <em>não parecem reais</em>
                </>
              }
            />
            <Reveal>
              <Link href="/galeria" className="group flex items-center gap-2 font-label text-lg font-bold text-white underline decoration-flame-500 decoration-2 underline-offset-4">
                Ver galeria completa <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <GalleryGrid items={gallery} limit={12} filters={false} />
        </section>
      )}

      <InstagramSection instagram={info.instagram} photos={photos.slice(6)} videos={videos} />
      {lagoons && lagoons.monthLevels?.length === 12 && <Lagoons data={lagoons} />}
      <Reviews reviews={reviews} page={agency?.checkoutPage} />
      <Faq items={faqs} />
      <FinalCta images={photos.slice(4)} phone={info.phone} />
    </>
  );
}
