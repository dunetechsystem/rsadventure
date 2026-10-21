/** A API grava os uploads com http:// — no site (https) isso viraria conteúdo misto bloqueado. */
export function fixMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.replace(/^http:\/\/api\.dunastour\.com\.br/, "https://api.dunastour.com.br");
}

export function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

/** Galeria vinda do DunasTour — media de cada lugar, com o nome do lugar pra filtrar. */
export interface GalleryItem {
  url: string;
  place: string;
  video: boolean;
}
