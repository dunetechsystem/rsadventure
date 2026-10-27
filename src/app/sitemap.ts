import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getPackages, getTours } from "@/lib/dunastour/server";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, packages] = await Promise.all([getTours(), getPackages()]);
  const url = (path: string, priority: number) => ({ url: `${site.url}${path}`, lastModified: new Date(), priority });
  return [
    url("", 1),
    url("/passeios", 0.9),
    url("/galeria", 0.4),
    ...tours.map((t) => url(`/passeios/${t.slug ?? t.id}`, 0.9)),
    ...packages.map((p) => url(`/pacotes/${p.slug ?? p.id}`, 0.8)),
  ];
}
