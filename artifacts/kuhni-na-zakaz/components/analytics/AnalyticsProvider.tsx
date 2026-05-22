"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import {
  ANALYTICS_EVENTS,
  YANDEX_METRIKA_ID,
  trackAnalyticsEvent,
  trackPageView,
} from "@/lib/analytics";

const gaId =
  process.env.NEXT_PUBLIC_GA_ID ||
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  "G-2135HXQLTN";
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const isYandexMetrikaEnabled = /^\d+$/.test(YANDEX_METRIKA_ID);

const MESSENGER_PATTERNS = [
  "t.me",
  "telegram.me",
  "wa.me",
  "api.whatsapp.com",
  "viber://",
];

export function AnalyticsProvider() {
  const pathname = usePathname();
  const lastTrackedCalculatorPath = useRef<string | null>(null);
  const lastTrackedPagePath = useRef<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (lastTrackedPagePath.current === null) {
      lastTrackedPagePath.current = path;
    } else if (lastTrackedPagePath.current !== path) {
      lastTrackedPagePath.current = path;
      trackPageView(path);
    }

    if (pathname === "/calculator" && lastTrackedCalculatorPath.current !== pathname) {
      lastTrackedCalculatorPath.current = pathname;
      trackAnalyticsEvent(ANALYTICS_EVENTS.CALCULATOR_OPEN, {
        source: "page_view",
        path: pathname,
      });
    }

    if (pathname !== "/calculator") {
      lastTrackedCalculatorPath.current = null;
    }

    if (pathname === "/thanks") {
      trackAnalyticsEvent(ANALYTICS_EVENTS.LEAD_SUCCESS, {
        source: "thanks_page",
        path: pathname,
      });
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a");
      const href = link?.getAttribute("href");
      if (!href) {
        return;
      }

      if (href.startsWith("tel:")) {
        trackAnalyticsEvent(ANALYTICS_EVENTS.PHONE_CLICK, {
          link_type: "phone",
          path: window.location.pathname,
        });
        return;
      }

      if (href.startsWith("mailto:")) {
        trackAnalyticsEvent(ANALYTICS_EVENTS.EMAIL_CLICK, {
          link_type: "email",
          path: window.location.pathname,
        });
        return;
      }

      if (isMessengerHref(href)) {
        trackAnalyticsEvent(ANALYTICS_EVENTS.MESSENGER_CLICK, {
          messenger: detectMessenger(href),
          path: window.location.pathname,
        });
        return;
      }

      if (isMeasureRequestHref(href)) {
        trackAnalyticsEvent(ANALYTICS_EVENTS.MEASURE_REQUEST, {
          link_type: "measure_request",
          path: window.location.pathname,
        });
        return;
      }

      if (isPriceCalculatorHref(href)) {
        trackAnalyticsEvent(ANALYTICS_EVENTS.COST_CALCULATION, {
          link_type: "price_calculator",
          path: window.location.pathname,
        });
      }
    };

    document.addEventListener("click", onClick);

    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}

      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="lazyOnload"
          />
          <Script id="ga-init" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                debug_mode: location.hostname === 'localhost' || location.hostname === '127.0.0.1' || new URLSearchParams(location.search).has('ga_debug')
              });
            `}
          </Script>
        </>
      )}

      {isYandexMetrikaEnabled && (
        <>
          <Script id="yandex-metrika-init" strategy="lazyOnload">
            {`
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}', 'ym');

              ym(${YANDEX_METRIKA_ID}, 'init', {
                ssr: true,
                webvisor: true,
                clickmap: true,
                ecommerce: 'dataLayer',
                referrer: document.referrer,
                url: location.pathname,
                accurateTrackBounce: true,
                trackLinks: true
              });
            `}
          </Script>
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}
    </>
  );
}

export function GoogleTagManagerNoScript() {
  if (!gtmId) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}

function isMessengerHref(href: string) {
  const normalized = href.toLowerCase();
  return MESSENGER_PATTERNS.some((pattern) => normalized.includes(pattern));
}

function detectMessenger(href: string) {
  const normalized = href.toLowerCase();

  if (normalized.includes("t.me") || normalized.includes("telegram.me")) {
    return "telegram";
  }

  if (normalized.includes("wa.me") || normalized.includes("whatsapp.com")) {
    return "whatsapp";
  }

  if (normalized.includes("viber://")) {
    return "viber";
  }

  return "messenger";
}

function isMeasureRequestHref(href: string) {
  const normalized = href.toLowerCase();
  return (
    normalized.includes("/contacts#form") ||
    normalized.includes("#contact-form")
  );
}

function isPriceCalculatorHref(href: string) {
  const normalized = href.toLowerCase();
  return (
    normalized === "/calculator" ||
    normalized.startsWith("/calculator?") ||
    normalized.includes("/prices#calculator")
  );
}
