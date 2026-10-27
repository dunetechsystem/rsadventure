import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { site } from "@/config/site";

/**
 * Card do link compartilhado (WhatsApp, Instagram, Facebook) de passeios e pacotes: a foto do
 * passeio ao fundo, o selo, o nome e o preço. Sai em JPEG leve — o WhatsApp não mostra imagem
 * acima de ~300 KB, e as fotos do DunasTour vêm direto do celular (vertical, 0,5–1 MB).
 */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/jpeg";

const asset = (file: string) => readFile(join(process.cwd(), "src/assets", file));
const dataUrl = (buf: Buffer, type: string) => `data:${type};base64,${buf.toString("base64")}`;

/** Foto do passeio recortada no tamanho do card; sem foto (ou se falhar) = dunas vistas do avião. */
async function background(photoUrl: string | null | undefined) {
  if (photoUrl) {
    try {
      const res = await fetch(photoUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const buf = await sharp(Buffer.from(await res.arrayBuffer()))
          .rotate()
          .resize(ogSize.width, ogSize.height, { fit: "cover", position: "attention" })
          .jpeg({ quality: 80 })
          .toBuffer();
        return dataUrl(buf, "image/jpeg");
      }
    } catch {}
  }
  return dataUrl(await asset("og-bg.jpg"), "image/jpeg");
}

export async function ogCard({ title, kicker, price, photoUrl }: { title: string; kicker: string; price?: string | null; photoUrl?: string | null }) {
  const [bg, logo, barlow, outfit500, outfit600] = await Promise.all([
    background(photoUrl),
    asset("og-logo.png"),
    asset("BarlowCondensed-800.ttf"),
    asset("Outfit-500.ttf"),
    asset("Outfit-600.ttf"),
  ]);
  const titleSize = title.length <= 18 ? 96 : title.length <= 30 ? 80 : title.length <= 44 ? 66 : 56;

  const png = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#050c1c", fontFamily: "Outfit" }}>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={bg} width={ogSize.width} height={ogSize.height} style={{ position: "absolute", top: 0, left: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: ogSize.width,
            height: ogSize.height,
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, #050c1c 0%, rgba(5,12,28,0.94) 40%, rgba(5,12,28,0.55) 66%, rgba(5,12,28,0.1) 90%)",
          }}
        />
        <div style={{ position: "absolute", left: 64, top: 52, bottom: 52, width: 760, display: "flex", flexDirection: "column" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={dataUrl(logo, "image/png")} width={116} height={116} />
          <div style={{ marginTop: 26, fontSize: 26, fontWeight: 600, color: "#ff6a00", letterSpacing: 1 }}>{kicker}</div>
          <div
            style={{
              marginTop: 6,
              fontFamily: "Barlow",
              fontSize: titleSize,
              lineHeight: 0.95,
              color: "#fff",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {title}
          </div>
          {price && (
            <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", color: "rgba(255,255,255,0.85)", fontSize: 26, fontWeight: 500 }}>
              a partir de&nbsp;<span style={{ color: "#fff", fontSize: 36, fontWeight: 600 }}>{price}</span>
            </div>
          )}
          <div style={{ marginTop: "auto", display: "flex", alignItems: "center", fontSize: 24, fontWeight: 600, color: "#fff" }}>
            <div
              style={{
                display: "flex",
                background: "#ff6a00",
                borderRadius: 999,
                padding: "8px 20px",
                marginRight: 16,
                fontFamily: "Barlow",
                fontSize: 26,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Barreirinhas · MA
            </div>
            {new URL(site.url).host}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Barlow", data: barlow, weight: 800, style: "normal" },
        { name: "Outfit", data: outfit500, weight: 500, style: "normal" },
        { name: "Outfit", data: outfit600, weight: 600, style: "normal" },
      ],
    },
  );

  const jpg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), {
    headers: { "Content-Type": ogContentType, "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
