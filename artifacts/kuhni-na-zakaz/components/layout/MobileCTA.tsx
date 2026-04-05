"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

export function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t border-border"
      data-testid="mobile-cta-bar"
    >
      <div className="flex items-center gap-2 p-3">
        <a
          href="tel:+375291234567"
          className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-lg font-medium text-sm"
          data-testid="mobile-cta-call"
        >
          <Phone className="w-4 h-4" />
          Позвонить
        </a>
        <Link
          href="/contacts#form"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm"
          data-testid="mobile-cta-order"
        >
          Заказать замер
        </Link>
      </div>
    </div>
  );
}
