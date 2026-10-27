"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { captureRef, track, trackingIds, withRef } from "@/lib/track";

const { metaPixel, ga4, googleAds, gtm } = trackingIds;
const gtagId = ga4 || googleAds;

/**
 * Pixels (só os que têm ID no .env) + um ouvinte único pros links do WhatsApp: todo clique em
 * api.whatsapp.com vira "Lead" (com `data-value`/`data-lead` do link, se tiver) e ganha a origem da
 * visita no fim da mensagem. Assim nenhum botão novo de WhatsApp fica sem rastreio.
 */
export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    captureRef();
    // O PageView da primeira página sai no init do pixel; o GA4 conta as navegações sozinho.
    if (first.current) first.current = false;
    else (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "PageView");
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='api.whatsapp.com/send']") as HTMLAnchorElement | null;
      if (!a || a.getAttribute("aria-disabled") === "true") return;
      a.href = withRef(a.href);
      track("Lead", { value: Number(a.dataset.value) || undefined, item: a.dataset.lead ?? "geral" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}
      {gtagId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${ga4 ? `gtag('config','${ga4}');` : ""}${googleAds ? `gtag('config','${googleAds}');` : ""}`}
          </Script>
        </>
      )}
      {metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
