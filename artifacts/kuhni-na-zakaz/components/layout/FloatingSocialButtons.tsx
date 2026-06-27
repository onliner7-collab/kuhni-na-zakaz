"use client";

import { type ComponentType, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, Instagram, MessageCircle, Phone } from "lucide-react";
import { createLayout, type AutoLayout } from "animejs/layout";

import { ElectricContactBorder } from "@/components/layout/ElectricContactBorder";
import { PhoneReveal } from "@/components/layout/PhoneReveal";
import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";
import { buildInstagramHref, buildTelegramHref } from "@/lib/social-links";
import { cn } from "@/lib/utils";

// Плавающие кнопки соцсетей, показываются на всех публичных страницах
// (подключаются в app/layout.tsx только когда !isAdmin).
//
// Контракт:
// - Если ссылки соцсетей пустые/невалидные и телефон не передан — компонент
//   возвращает null и не занимает место в DOM.
// - Каждая ссылка нормализуется в полный https-URL независимо от того,
//   как админ ввёл значение в /admin/contacts (полный URL, t.me/handle,
//   @handle или просто username) — нормализация вынесена в lib/social-links.
// - Если ввели что-то совсем странное (например, телефон) — кнопка для
//   этой соцсети не показывается.
//
// Расположение:
// - Mobile: bottom-36, чтобы не перекрывать MobileCTA (bottom-0, ~64px
//   высоты + safe-area).
// - Desktop (>= lg): bottom-6, MobileCTA на этом размере скрыт.
// - z-40 — ниже MobileCTA (z-50), но выше обычного контента/тостов.

interface FloatingSocialButtonsProps {
  instagram?: string | null;
  telegram?: string | null;
  phone?: string;
  phoneHref?: string;
}

const TELEGRAM_BLUE = "#229ED9";
const INSTAGRAM_GRADIENT =
  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

type FloatingContactIcon = ComponentType<{ className?: string }>;
type FloatingContactOption = {
  id: string;
  label: string;
  href: string;
  icon: FloatingContactIcon;
};

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d="M21.94 4.32a1.5 1.5 0 0 0-1.6-.24L3.4 10.86c-1.06.43-1.05 1.05-.19 1.33l4.36 1.36 1.69 5.31c.2.61.34.83.69.83.27 0 .42-.12.6-.26l2.2-2.06 4.43 3.27c.81.45 1.4.22 1.6-.75l2.92-13.78c.28-1.31-.44-1.85-1.16-1.79zm-3.79 4.46-8.42 5.34-.33 3.5-.5-3.18 8.79-5.55c.4-.26.78-.13.46.15z" />
    </svg>
  );
}

export function FloatingSocialButtons({
  instagram,
  telegram,
  phone,
  phoneHref,
}: FloatingSocialButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);
  const layoutRef = useRef<AutoLayout | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotionRef = useRef(false);
  const telegramHref = buildTelegramHref(telegram);
  const instagramHref = buildInstagramHref(instagram);

  const visibleOptions = ([
    telegramHref ? { id: "telegram", label: "Telegram", href: telegramHref, icon: TelegramIcon } : null,
    instagramHref ? { id: "instagram", label: "Instagram", href: instagramHref, icon: Instagram } : null,
    phoneHref ? { id: "phone", label: "Телефон", href: phoneHref, icon: Phone } : null,
  ] as Array<FloatingContactOption | null>).filter((item): item is FloatingContactOption => Boolean(item));

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotionRef.current = isReducedMotion;
    if (isReducedMotion) return;

    layoutRef.current = createLayout(rootRef.current, {
      children: ".floating-contact-item",
      duration: 380,
      ease: "out(3)",
      enterFrom: { opacity: 0, y: 8, scale: 0.96 },
      leaveTo: { opacity: 0, y: 8, scale: 0.96 },
    });

    return () => {
      layoutRef.current?.revert();
      layoutRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isOpen || reducedMotionRef.current || visibleOptions.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setCycleIndex((current) => (current + 1) % visibleOptions.length);
    }, 1800);

    return () => window.clearInterval(intervalId);
  }, [isOpen, visibleOptions.length]);

  if (!telegramHref && !instagramHref && !phoneHref) return null;

  function animateLayout(update: () => void) {
    if (!layoutRef.current || reducedMotionRef.current) {
      update();
      return;
    }

    layoutRef.current.update(update, {
      duration: 380,
      ease: "out(3)",
    });
  }

  function toggleOpen() {
    const nextOpen = !isOpen;

    animateLayout(() => setIsOpen(nextOpen));
    trackAnalyticsEvent(nextOpen ? ANALYTICS_EVENTS.CONTACT_CHOOSER_OPEN : ANALYTICS_EVENTS.CONTACT_CHOOSER_CLOSE, {
      source: "floating-contact-buttons",
    });
  }

  const CycleIcon = visibleOptions[cycleIndex]?.icon ?? MessageCircle;

  return (
    <nav
      ref={rootRef}
      aria-label="Быстрая связь"
      className="fixed right-4 bottom-36 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 lg:right-5 lg:bottom-6"
      data-state={isOpen ? "open" : "closed"}
      data-testid="floating-social-buttons"
    >
      {isOpen && (
        <div
          id="floating-contact-panel"
          className="floating-contact-item w-[min(19rem,calc(100vw-2rem))] rounded-lg border border-border/80 bg-white p-3 shadow-2xl shadow-black/20"
        >
          <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Скидка 5% с сайта
          </p>
          <div className="grid gap-2">
            {telegramHref && (
              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Написать в Telegram"
                data-analytics-source="floating-contact-buttons"
                data-testid="floating-social-telegram"
                className="inline-flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
                style={{ backgroundColor: TELEGRAM_BLUE }}
              >
                <TelegramIcon className="h-5 w-5" />
                Написать в Telegram
              </a>
            )}
            {instagramHref && (
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Открыть Instagram"
                data-analytics-source="floating-contact-buttons"
                data-testid="floating-social-instagram"
                className="inline-flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
                style={{ background: INSTAGRAM_GRADIENT }}
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
                Открыть Instagram
              </a>
            )}
            {phoneHref && (
              <PhoneReveal
                phone={phone}
                phoneHref={phoneHref}
                source="floating-contact-buttons"
                compact
                className="min-h-11 w-full justify-start rounded-md"
              />
            )}
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-controls="floating-contact-panel"
        data-testid="floating-contact-toggle"
        className="electric-contact-toggle floating-contact-item inline-flex min-h-12 items-center gap-2 rounded-full border border-transparent bg-stone-950/88 px-3 py-2 text-left text-white shadow-2xl shadow-black/20 backdrop-blur-md transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <ElectricContactBorder className="electric-contact-frame" borderRadius={999} color="#5bf4ff" chaos={0.075} speed={0.38} thickness={0.95} />
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300 text-stone-950">
          <CycleIcon className="h-5 w-5 animate-[regional-contact-icon_1.8s_ease-in-out_infinite]" aria-hidden="true" />
        </span>
        <span className={cn("min-w-0 pr-1", isOpen ? "hidden sm:block" : "block")}>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100/78">
            Скидка 5%
          </span>
          <span className="block whitespace-nowrap text-sm font-bold">Связаться</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
      </button>
    </nav>
  );
}
