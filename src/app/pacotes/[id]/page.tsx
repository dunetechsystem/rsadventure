import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAgency, getPackage, getPackages, getTours } from "@/lib/dunastour/server";
import { agencyInfo } from "@/lib/agency-info";
import { packageBase } from "@/lib/booking-base";
import { displayTitle, money } from "@/lib/format";
import { PageHero } from "@/components/layout/PageHero";
import { MediaMosaic } from "@/components/tour/MediaMosaic";
import { BookingPanel } from "@/components/tour/BookingPanel";
import { RichText } from "@/components/tour/RichText";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getPackages()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/pacotes/[id]">): Promise<Metadata> {
  const pkg = await getPackage((await params).id);
  return { title: pkg ? displayTitle(pkg.title) : "Pacote não encontrado" };
}

export default async function PackagePage({ params }: PageProps<"/pacotes/[id]">) {
  const { id } = await params;
  const [pkg, packages, tours, agency] = await Promise.all([getPackage(id), getPackages(), getTours(), getAgency()]);
  if (!pkg) notFound();
  const card = packages.find((p) => p.id === id);
  const cover = pkg.mediaUrls[0] ?? card?.coverImageUrl ?? null;
  // Pacote com algum passeio de aventura: sem criança de colo (o termo de risco vem do servidor).
  const hasRisk = card?.hasRisk ?? pkg.tours.some((t) => tours.find((x) => x.id === t.id)?.riskType);
  const title = displayTitle(pkg.title);

  return (
    <>
      <PageHero
        image={cover}
        tall
        eyebrow={`Combo · ${pkg.tours.length} passeios · -${pkg.discountPercent}%`}
        title={title}
        crumbs={[
          { href: "/", label: "Início" },
          { href: "/passeios", label: "Passeios" },
        ]}
      />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div className="min-w-0">
          <MediaMosaic urls={pkg.mediaUrls} title={title} />
          <h2 className="mb-5 mt-12 font-display text-3xl text-white">Passeios incluídos</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pkg.tours.map((t) => (
              <Link key={t.id} href={`/passeios/${t.id}`} className="flex items-center gap-3 rounded-3xl bg-night-800 p-3 ring-1 ring-white/5 transition hover:ring-white/20">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-night-800">
                  {t.coverImageUrl && <Image src={t.coverImageUrl} alt="" fill sizes="64px" className="object-cover" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold text-white">{displayTitle(t.title)}</span>
                  <span className="text-sm text-white/50 line-through">{money(t.basePrice)}</span>
                </span>
              </Link>
            ))}
          </div>
          {pkg.description && (
            <div className="mt-12">
              <h2 className="mb-5 font-display text-3xl text-white">Sobre o combo</h2>
              <RichText text={pkg.description} />
            </div>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingPanel base={packageBase(pkg, cover, !!hasRisk)} phone={agencyInfo(agency).phone} />
        </aside>
      </div>
    </>
  );
}
