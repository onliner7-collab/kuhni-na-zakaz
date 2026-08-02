"use client";

import { usePathname } from "next/navigation";

import { DeferredPublicEnhancements } from "@/components/layout/DeferredPublicEnhancements";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

function usePublicChromeEnabled() {
  const pathname = usePathname();
  const isExcluded = ["/admin", "/kapi", "/thanks", "/robots.txt", "/sitemap.xml", "/component-library-preview", "/__component-library"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isKitchenScrollPrototype = pathname === "/kitchen-scroll-3d";

  return !isExcluded && !isKitchenScrollPrototype;
}

export function PublicChromeTop({ header }: { header: React.ReactNode }) {
  const enabled = usePublicChromeEnabled();
  if (!enabled) return null;

  return header;
}

export function PublicChromeBottom({ footer }: { footer: React.ReactNode }) {
  const enabled = usePublicChromeEnabled();
  if (!enabled) return null;

  return (
    <>
      {footer}
      <DeferredPublicEnhancements
        instagram={CONTACT_DEFAULTS.instagram}
        telegram={CONTACT_DEFAULTS.telegram}
        phone={CONTACT_DEFAULTS.phoneDisplay}
        phoneHref={`tel:${CONTACT_DEFAULTS.phone}`}
      />
    </>
  );
}
