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
import { MobileCTA } from "@/components/layout/MobileCTA";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isAdmin) {
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
      <main>{children}</main>
      <Footer />
      <MobileCTA phoneHref={`tel:${CONTACT_DEFAULTS.phone}`} />
      <FloatingSocialButtons
        instagram={CONTACT_DEFAULTS.instagram}
        telegram={CONTACT_DEFAULTS.telegram}
        phone={CONTACT_DEFAULTS.phoneDisplay}
        phoneHref={`tel:${CONTACT_DEFAULTS.phone}`}
      />
    </>
  );
}
