"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

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
        <a
          href={phoneHref || `tel:${CONTACT_DEFAULTS.phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-muted text-foreground py-3 rounded-xl font-semibold text-sm"
          data-testid="mobile-cta-call"
        >
          <Phone className="w-4 h-4" />
          Позвонить
        </a>
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
