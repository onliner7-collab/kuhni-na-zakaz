"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { PhoneReveal } from "@/components/layout/PhoneReveal";

export function MobileCTA({ phoneHref }: { phoneHref?: string }) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isConfigurator =
    pathname === "/kitchen-configurator" || pathname.startsWith("/kitchen-configurator/");

  useEffect(() => {
    let frame = 0;
    let lastVisible = window.scrollY > 300;

    setVisible(lastVisible);

    const onScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextVisible = window.scrollY > 300;

        if (nextVisible !== lastVisible) {
          lastVisible = nextVisible;
          setVisible(nextVisible);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  if (!visible || isConfigurator) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 backdrop-blur-xl border-t border-black/8 shadow-lg"
      data-testid="mobile-cta-bar"
    >
      <div className="flex items-center gap-2 p-3 pb-safe">
        <PhoneReveal
          phone={CONTACT_DEFAULTS.phoneDisplay}
          phoneHref={phoneHref || `tel:${CONTACT_DEFAULTS.phone}`}
          source="mobile-sticky"
          compact
          className="flex-1 justify-center rounded-xl bg-muted py-3"
        />
        <Link
          href="/contacts#form"
          className="flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold text-sm shadow-lg"
          style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
          data-testid="mobile-cta-order"
        >
          Заказать замер
        </Link>
      </div>
    </div>
  );
}
