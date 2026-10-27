/**
 * Rastreamento pro tráfego pago: eventos pro Meta Pixel, GA4/Google Ads e GTM (só os que tiverem ID no
 * .env) e a origem da visita (UTM, gclid, fbclid), que vai no fim da mensagem do WhatsApp pra saber de
 * qual campanha veio cada conversa.
 */

export const trackingIds = {
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  ga4: process.env.NEXT_PUBLIC_GA4_ID ?? "",
  googleAds: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "",
  /** Rótulo da conversão "Lead" no Google Ads (o que vem depois da barra em AW-123/abc). */
  googleAdsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL ?? "",
  gtm: process.env.NEXT_PUBLIC_GTM_ID ?? "",
};

type Win = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

export type TrackEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Lead" | "Purchase";

interface TrackParams {
  value?: number;
  /** Nome do passeio/roteiro ou o tipo do contato ("viagem", "transfer", "geral"…). */
  item?: string;
  id?: string;
}

/** Nome do mesmo evento no GA4. */
const GA_EVENTS: Record<TrackEvent, string> = {
  ViewContent: "view_item",
  AddToCart: "add_to_cart",
  InitiateCheckout: "begin_checkout",
  Lead: "generate_lead",
  Purchase: "purchase",
};

/** `eventId`: no Purchase, o mesmo id que vai pro DunasTour (API de Conversões) — o Meta conta uma venda só. */
export function track(event: TrackEvent, { value, item, id }: TrackParams = {}, eventId?: string) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  const money = value ? { value: Math.round(value * 100) / 100, currency: "BRL" } : {};
  try {
    w.fbq?.("track", event, { ...money, content_name: item, content_ids: id ? [id] : undefined, content_type: id ? "product" : undefined }, eventId ? { eventID: eventId } : undefined);
    w.gtag?.("event", GA_EVENTS[event], { ...money, items: item ? [{ item_id: id ?? item, item_name: item }] : undefined });
    if (event === "Lead" && trackingIds.googleAds && trackingIds.googleAdsLeadLabel) {
      w.gtag?.("event", "conversion", { send_to: `${trackingIds.googleAds}/${trackingIds.googleAdsLeadLabel}`, ...money });
    }
    w.dataLayer?.push({ event: `rsadventure_${GA_EVENTS[event]}`, ...money, item, item_id: id });
  } catch {}
}

// --- origem da visita ---

const REF_KEY = "rsadventure-ref";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "fbclid"] as const;
type Ref = Partial<Record<(typeof PARAMS)[number] | "referrer", string>>;

/** Guarda a última origem com parâmetro de campanha (dura 30 dias). Chamado a cada página. */
export function captureRef() {
  try {
    const url = new URL(window.location.href);
    const found: Ref = {};
    PARAMS.forEach((p) => {
      const v = url.searchParams.get(p);
      if (v) found[p] = v.slice(0, 80);
    });
    const stored = readRef();
    if (Object.keys(found).length) {
      localStorage.setItem(REF_KEY, JSON.stringify({ ...found, at: Date.now() }));
    } else if (!stored && document.referrer && !document.referrer.startsWith(window.location.origin)) {
      localStorage.setItem(REF_KEY, JSON.stringify({ referrer: new URL(document.referrer).hostname.replace(/^www\./, ""), at: Date.now() }));
    }
  } catch {}
}

function readRef(): Ref | null {
  try {
    const raw = JSON.parse(localStorage.getItem(REF_KEY) ?? "null") as (Ref & { at?: number }) | null;
    if (!raw || !raw.at || Date.now() - raw.at > 30 * 864e5) return null;
    return raw;
  } catch {
    return null;
  }
}

/** "google/cpc/lagoa-azul" — curto, pra caber no fim da mensagem sem atrapalhar o cliente. */
export function refCode() {
  const r = readRef();
  if (!r) return "";
  const source = r.utm_source ?? (r.gclid || r.gbraid || r.wbraid ? "google" : r.fbclid ? "meta" : r.referrer);
  const medium = r.utm_medium ?? (r.gclid || r.gbraid || r.wbraid ? "cpc" : r.fbclid ? "social" : r.referrer ? "site" : undefined);
  return [source, medium, r.utm_campaign, r.utm_content].filter(Boolean).join("/");
}

/** Põe a origem no fim do texto de um link api.whatsapp.com (uma vez só). */
export function withRef(href: string) {
  const code = refCode();
  if (!code) return href;
  try {
    const text = new URL(href).searchParams.get("text") ?? "Olá!";
    if (text.includes("_ref: ")) return href;
    // encodeURIComponent (e não URLSearchParams, que troca espaço por "+") — igual ao whatsappUrl.
    const encoded = encodeURIComponent(`${text}\n\n_ref: ${code}_`);
    return /[?&]text=/.test(href) ? href.replace(/([?&]text=)[^&]*/, `$1${encoded}`) : `${href}&text=${encoded}`;
  } catch {
    return href;
  }
}

function cookie(name: string) {
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? undefined;
}

/**
 * Reserva pelo site (onlineBooking): vai junto pro DunasTour, que manda o mesmo "Purchase" pela API de Conversões
 * com o pixel da agência — cookies _fbp/_fbc e o id do evento. Null sem Meta Pixel.
 */
export function pixelTracking() {
  if (!trackingIds.metaPixel || typeof window === "undefined") return null;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  return {
    eventId: `checkout-${crypto.randomUUID()}`,
    fbp: cookie("_fbp"),
    fbc: cookie("_fbc") ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined),
    sourceUrl: window.location.href.slice(0, 1000),
  };
}
