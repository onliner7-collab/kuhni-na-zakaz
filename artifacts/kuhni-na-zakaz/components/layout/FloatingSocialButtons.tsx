"use client";

import { type ComponentType, type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, Instagram, MessageCircle, Phone } from "lucide-react";
import { animate, type JSAnimation } from "animejs";
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
// - Mobile: bottom-36 до скролла, затем компактный dock слева в шапке, чтобы
//   не перекрывать кнопку телефона справа.
// - Desktop (>= lg): dock в верхней зоне может занимать широкую панель.
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
const DOCK_SCROLL_Y = 120;
const FLIGHT_DURATION = 680;
const FLIGHT_EASE = "out(3)";
const FLIGHT_ROTATION_DEG = 360;
const FLIGHT_TRANSFORM =
  "translate3d(var(--floating-contact-flight-x), var(--floating-contact-flight-y), 0) rotate(var(--floating-contact-flight-rotate))";

type FloatingContactIcon = ComponentType<{ className?: string }>;
type FloatingContactOption = {
  id: string;
  label: string;
  href: string;
  icon: FloatingContactIcon;
};

function setFlightTransform(element: HTMLElement, x: number, y: number, rotate: number) {
  element.style.setProperty("--floating-contact-flight-x", `${x}px`);
  element.style.setProperty("--floating-contact-flight-y", `${y}px`);
  element.style.setProperty("--floating-contact-flight-rotate", `${rotate}deg`);
  element.style.transform = FLIGHT_TRANSFORM;
}

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
  const [isDocked, setIsDocked] = useState(false);
  const [isWideHeaderDock, setIsWideHeaderDock] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const layoutRef = useRef<AutoLayout | null>(null);
  const flightAnimationRef = useRef<JSAnimation | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);
  const flightFromRectRef = useRef<DOMRect | null>(null);
  const reducedMotionRef = useRef(false);
  const telegramHref = buildTelegramHref(telegram);
  const instagramHref = buildInstagramHref(instagram);

  const visibleOptions = ([
    telegramHref ? { id: "telegram", label: "Telegram", href: telegramHref, icon: TelegramIcon } : null,
    instagramHref ? { id: "instagram", label: "Instagram", href: instagramHref, icon: Instagram } : null,
    phoneHref ? { id: "phone", label: "Телефон", href: phoneHref, icon: Phone } : null,
  ] as Array<FloatingContactOption | null>).filter((item): item is FloatingContactOption => Boolean(item));

  useLayoutEffect(() => {
    if (!motionRef.current) return;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotionRef.current = isReducedMotion;
    setPrefersReducedMotion(isReducedMotion);
    if (isReducedMotion) return;

    layoutRef.current = createLayout(motionRef.current, {
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

  useLayoutEffect(() => {
    const root = rootRef.current;
    const motion = motionRef.current;
    const fromRect = flightFromRectRef.current;
    flightFromRectRef.current = null;

    if (!root || !motion || !fromRect || reducedMotionRef.current) return;

    const toRect = root.getBoundingClientRect();
    const deltaX = fromRect.left - toRect.left;
    const deltaY = fromRect.top - toRect.top;

    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

    flightAnimationRef.current?.cancel();
    setFlightTransform(motion, deltaX, deltaY, isDocked ? -FLIGHT_ROTATION_DEG : FLIGHT_ROTATION_DEG);

    const flight = {
      x: deltaX,
      y: deltaY,
      rotate: isDocked ? -FLIGHT_ROTATION_DEG : FLIGHT_ROTATION_DEG,
    };

    flightAnimationRef.current = animate(flight, {
      x: 0,
      y: 0,
      rotate: 0,
      duration: FLIGHT_DURATION,
      ease: FLIGHT_EASE,
      onUpdate: () => {
        setFlightTransform(motion, flight.x, flight.y, flight.rotate);
      },
      onComplete: () => {
        setFlightTransform(motion, 0, 0, 0);
        flightAnimationRef.current = null;
      },
    });

    return () => {
      flightAnimationRef.current?.cancel();
      flightAnimationRef.current = null;
    };
  }, [isDocked]);

  useEffect(() => {
    let frame = 0;
    const media = window.matchMedia("(min-width: 1024px)");
    let lastDocked = window.scrollY > DOCK_SCROLL_Y;

    setIsWideHeaderDock(media.matches);
    setIsDocked(lastDocked);

    const onMediaChange = () => {
      setIsWideHeaderDock(media.matches);
      flightFromRectRef.current = rootRef.current?.getBoundingClientRect() ?? null;
    };

    const onScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextDocked = window.scrollY > DOCK_SCROLL_Y;

        if (nextDocked !== lastDocked) {
          lastDocked = nextDocked;
          flightFromRectRef.current = rootRef.current?.getBoundingClientRect() ?? null;
          setIsDocked(nextDocked);
        }
      });
    };

    media.addEventListener("change", onMediaChange);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
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
  const rootStyle = {
    left: isDocked && isWideHeaderDock ? "calc(50% - min(9.5rem, calc((100vw - 2rem) / 2)))" : undefined,
  } as CSSProperties;
  const motionStyle = {
    "--floating-contact-flight-x": "0px",
    "--floating-contact-flight-y": "0px",
    "--floating-contact-flight-rotate": "0deg",
    transform: FLIGHT_TRANSFORM,
    transformOrigin: "center center",
    transition: prefersReducedMotion ? "none" : undefined,
  } as CSSProperties;

  return (
    <nav
      ref={rootRef}
      aria-label="Быстрая связь"
      style={rootStyle}
      className={cn(
        "fixed max-w-[calc(100vw-2rem)] motion-reduce:transition-none",
        isDocked && isWideHeaderDock
          ? "top-3 bottom-auto right-auto z-[60] w-[min(19rem,calc(100vw-2rem))] lg:top-4"
          : isDocked
            ? "left-3 top-3 right-auto bottom-auto z-[60] w-auto"
            : "right-7 bottom-36 left-auto top-auto z-40 lg:right-5 lg:bottom-6",
      )}
      data-state={isOpen ? "open" : "closed"}
      data-position={isDocked ? "header" : "floating"}
      data-testid="floating-social-buttons"
    >
      <div
        ref={motionRef}
        style={motionStyle}
        className={cn(
          "flex gap-2 will-change-transform motion-reduce:transition-none",
          isDocked && isWideHeaderDock ? "w-full flex-col items-center" : isDocked ? "flex-col items-start" : "flex-col items-end",
        )}
      >
        {isOpen && (
          <div
            id="floating-contact-panel"
            className={cn(
              "floating-contact-item w-[min(19rem,calc(100vw-2rem))] rounded-lg border border-border/80 bg-white p-3 shadow-2xl shadow-black/20",
              isDocked ? "order-2" : "order-1",
            )}
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
          className={cn(
            "electric-contact-toggle floating-contact-item inline-flex min-h-12 items-center gap-2 rounded-full border border-transparent bg-stone-950/88 px-3 py-2 text-left text-white shadow-2xl shadow-black/20 backdrop-blur-md transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100",
            isDocked ? "order-1" : "order-2",
          )}
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
      </div>
    </nav>
  );
}
