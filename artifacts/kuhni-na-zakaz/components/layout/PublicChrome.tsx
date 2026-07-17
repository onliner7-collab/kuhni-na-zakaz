"use client";

import { usePathname } from "next/navigation";

import {
  AnalyticsProvider,
  GoogleTagManagerNoScript,
} from "@/components/analytics/AnalyticsProvider";
import { FloatingSocialButtons } from "@/components/layout/FloatingSocialButtons";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isExcluded = ["/admin", "/kapi", "/thanks", "/robots.txt", "/sitemap.xml", "/component-library-preview", "/__component-library"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isKitchenScrollPrototype = pathname === "/kitchen-scroll-3d";

  if (isExcluded || isKitchenScrollPrototype) {
    return <>{children}</>;
  }

  return (
    <>
      <GoogleTagManagerNoScript />
      <AnalyticsProvider />
      <Header
        phone={CONTACT_DEFAULTS.phoneDisplay}
        phoneHref={`tel:${CONTACT_DEFAULTS.phone}`}
      />
      <main className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <FloatingSocialButtons
        instagram={CONTACT_DEFAULTS.instagram}
        telegram={CONTACT_DEFAULTS.telegram}
        phone={CONTACT_DEFAULTS.phoneDisplay}
        phoneHref={`tel:${CONTACT_DEFAULTS.phone}`}
      />
    </>
  );
}
