"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [mounted, setMounted] = useState(false);
  const isAdmin = pathname.startsWith("/admin");
  const isKitchenScrollPrototype = pathname === "/kitchen-scroll-3d";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isAdmin || isKitchenScrollPrototype) {
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
