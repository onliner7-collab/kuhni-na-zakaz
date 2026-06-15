"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { cn } from "@/lib/utils";

interface PhoneRevealProps {
  phone?: string;
  phoneHref?: string;
  source: string;
  isOverlay?: boolean;
  className?: string;
  compact?: boolean;
  dark?: boolean;
}

const DISCOUNT_HINT = 'Скажите: "звоню с сайта" — получите скидку 5% на кухню';

export function PhoneReveal({
  phone = CONTACT_DEFAULTS.phoneDisplay,
  phoneHref = `tel:${CONTACT_DEFAULTS.phone}`,
  source,
  isOverlay = false,
  className,
  compact = false,
  dark = false,
}: PhoneRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  function handleReveal() {
    setIsRevealed(true);
    trackAnalyticsEvent(ANALYTICS_EVENTS.PHONE_REVEAL, { source });
  }

  const iconClassName = cn(
    "flex shrink-0 items-center justify-center rounded-xl",
    compact ? "h-9 w-9" : "h-10 w-10",
    isOverlay
      ? "bg-white/12 text-white"
      : dark
        ? "bg-primary/15 text-primary"
        : "bg-primary/10 text-primary",
  );

  const shellClassName = cn(
    "flex min-w-0 items-center gap-3 rounded-xl border transition-colors",
    compact ? "px-3 py-2.5" : "px-4 py-2.5",
    isOverlay
      ? "border-white/14 bg-black/18 text-white hover:bg-white/10"
      : dark
        ? "border-white/10 bg-white/5 text-white hover:border-primary/40 hover:bg-white/10"
        : "border-border bg-white text-foreground hover:border-primary/30 hover:bg-primary/5",
    className,
  );

  if (!isRevealed) {
    return (
      <button
        type="button"
        onClick={handleReveal}
        className={shellClassName}
        data-testid={`phone-reveal-${source}`}
      >
        <span className={iconClassName}>
          <Phone className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 text-left">
          <span
            className={cn(
              "block text-[11px] font-semibold uppercase tracking-[0.14em]",
              isOverlay ? "text-white/62" : dark ? "text-white/55" : "text-muted-foreground",
            )}
          >
            Скидка 5% с сайта
          </span>
          <span className={cn("block whitespace-nowrap font-bold", compact ? "text-sm" : "text-sm xl:text-base")}>
            Показать номер
          </span>
        </span>
      </button>
    );
  }

  return (
    <a
      href={phoneHref}
      className={shellClassName}
      data-analytics-source={source}
      data-testid={`phone-link-${source}`}
    >
      <span className={iconClassName}>
        <Phone className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className={cn("block whitespace-nowrap font-bold", compact ? "text-sm" : "text-sm xl:text-base")}>
          {phone}
        </span>
        <span
          className={cn(
            "block text-[11px] leading-snug",
            isOverlay ? "text-white/70" : dark ? "text-white/60" : "text-muted-foreground",
          )}
        >
          {DISCOUNT_HINT}
        </span>
      </span>
    </a>
  );
}
