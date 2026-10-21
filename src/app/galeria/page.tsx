import type { Metadata } from "next";
import { getGallery } from "@/lib/dunastour/gallery";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const revalidate = 300;
export const metadata: Metadata = { title: "Galeria de fotos e vídeos" };

export default async function GalleryPage() {
  const gallery = await getGallery();
  const cover = gallery.find((g) => !g.video)?.url;
  return (
    <>
      <PageHero
        image={cover}
        eyebrow={`${gallery.length} fotos e vídeos`}
        title={
          <>
            Galeria dos <em className="text-sun-gradient">Lençóis</em>
          </>
        }
        crumbs={[{ href: "/", label: "Início" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {gallery.length > 0 ? (
          <GalleryGrid items={gallery} />
        ) : (
          <p className="py-20 text-center text-white/50">As fotos estão sendo atualizadas. Volte em instantes!</p>
        )}
      </div>
    </>
  );
}
