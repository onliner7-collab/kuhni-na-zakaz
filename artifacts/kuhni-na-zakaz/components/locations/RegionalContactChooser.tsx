"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Instagram, MessageCircle, Phone, Send } from "lucide-react";
import { createLayout, type AutoLayout } from "animejs/layout";

import { ANALYTICS_EVENTS, trackAnalyticsEvent } from "@/lib/analytics";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { cn } from "@/lib/utils";

interface ContactOption {
  id: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  icon: typeof Phone;
}

interface RegionalContactChooserProps {
  source: string;
}

const contactOptions: ContactOption[] = [
  {
    id: "phone",
    title: "Телефон",
    text: "Номер скрыт: скажите, что пришли с сайта, и получите скидку 5% на кухню.",
    cta: CONTACT_DEFAULTS.phoneDisplay,
    href: `tel:${CONTACT_DEFAULTS.phone}`,
    icon: Phone,
  },
  {
    id: "telegram",
    title: "Telegram",
    text: "Прислать фото кухни, размеры, список техники и получить первый ориентир.",
    cta: CONTACT_DEFAULTS.telegramLabel,
    href: CONTACT_DEFAULTS.telegram,
    icon: Send,
  },
  {
    id: "instagram",
    title: "Instagram",
    text: "Посмотреть визуальные идеи и написать по понравившемуся формату кухни.",
    cta: CONTACT_DEFAULTS.instagramLabel,
    href: CONTACT_DEFAULTS.instagram,
    icon: Instagram,
  },
  {
    id: "request",
    title: "Заявка",
    text: "Оставить контакты, чтобы менеджер сам уточнил детали и подготовил расчет.",
    cta: "Оставить заявку",
    href: "#form",
    icon: MessageCircle,
  },
];

const iconCycleOptions = contactOptions.filter((option) => option.id !== "request");

export function RegionalContactChooser({ source }: RegionalContactChooserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(contactOptions[0].id);
  const [cycleIndex, setCycleIndex] = useState(0);
  const layoutRef = useRef<AutoLayout | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotionRef = useRef(false);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotionRef.current = isReducedMotion;
    if (isReducedMotion) return;

    layoutRef.current = createLayout(rootRef.current, {
      children: ".contact-layout-item",
      duration: 420,
      ease: "out(3)",
      enterFrom: { opacity: 0, y: 10, scale: 0.97 },
      leaveTo: { opacity: 0, y: -8, scale: 0.97 },
    });

    return () => {
      layoutRef.current?.revert();
      layoutRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isOpen || reducedMotionRef.current) return;

    const intervalId = window.setInterval(() => {
      setCycleIndex((current) => (current + 1) % iconCycleOptions.length);
    }, 1800);

    return () => window.clearInterval(intervalId);
  }, [isOpen]);

  function animateLayout(update: () => void) {
    if (!layoutRef.current || reducedMotionRef.current) {
      update();
      return;
    }

    layoutRef.current.update(update, {
      duration: 420,
      ease: "out(3)",
    });
  }

  function toggleOpen() {
    const nextOpen = !isOpen;

    animateLayout(() => setIsOpen(nextOpen));

    trackAnalyticsEvent(nextOpen ? ANALYTICS_EVENTS.CONTACT_CHOOSER_OPEN : ANALYTICS_EVENTS.CONTACT_CHOOSER_CLOSE, {
      source,
      active: activeId,
    });
  }

  function chooseOption(id: string) {
    animateLayout(() => {
      setActiveId(id);
      setIsOpen(true);
    });

    trackAnalyticsEvent(ANALYTICS_EVENTS.CONTACT_CHOOSER_SELECT, {
      source,
      contact_type: id,
    });
  }

  function handleActionClick(option: ContactOption) {
    if (option.id !== "request") return;

    trackAnalyticsEvent(ANALYTICS_EVENTS.CTA_CLICK, {
      source,
      contact_type: option.id,
    });
  }

  const activeOption = contactOptions.find((item) => item.id === activeId) ?? contactOptions[0];
  const ActiveIcon = activeOption.icon;
  const CycleIcon = iconCycleOptions[cycleIndex]?.icon ?? Phone;

  return (
    <div
      ref={rootRef}
      className={cn(
        "ml-auto w-full max-w-md rounded-lg border border-white/14 bg-stone-950/72 shadow-2xl shadow-black/25 backdrop-blur-md transition-colors",
        isOpen ? "p-3" : "max-w-[18rem] p-2",
      )}
      data-contact-source={source}
      data-state={isOpen ? "open" : "closed"}
    >
      <button
        type="button"
        onClick={toggleOpen}
        className="contact-layout-item flex min-h-14 w-full items-center gap-3 rounded-md border border-white/12 bg-white/[0.08] px-3 py-2 text-left text-white transition-colors hover:bg-white/[0.13]"
        aria-expanded={isOpen}
        aria-controls="regional-contact-chooser-panel"
      >
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-300 text-stone-950">
          {isOpen ? (
            <ActiveIcon className="h-5 w-5" aria-hidden />
          ) : (
            <CycleIcon className="h-5 w-5 animate-[regional-contact-icon_1.8s_ease-in-out_infinite]" aria-hidden />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-100/78">
            Скидка 5% с сайта
          </span>
          <span className="block truncate text-sm font-bold">
            {isOpen ? "Выберите способ связи" : "Связаться с нами"}
          </span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-white/70 transition-transform", isOpen && "rotate-180")}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div id="regional-contact-chooser-panel" className="contact-layout-item mt-3 grid gap-3 md:grid-cols-[0.9fr_1.1fr] md:items-stretch">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-1">
          {contactOptions.map((option) => {
            const Icon = option.icon;
            const isActive = option.id === activeId;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => chooseOption(option.id)}
                className={cn(
                  "flex min-h-14 items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "border-amber-300/60 bg-amber-200/16 text-white"
                    : "border-white/10 bg-black/14 text-white/72 hover:bg-white/10 hover:text-white",
                )}
                aria-pressed={isActive}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="font-semibold">{option.title}</span>
              </button>
            );
          })}
          </div>

          <div className="relative overflow-hidden rounded-md bg-black/24 p-5">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-amber-300/18 text-amber-100">
            <ActiveIcon className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="text-xl font-bold text-white">{activeOption.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/68">{activeOption.text}</p>
          <a
            href={activeOption.href}
            target={activeOption.href.startsWith("http") ? "_blank" : undefined}
            rel={activeOption.href.startsWith("http") ? "noopener noreferrer" : undefined}
            onClick={() => handleActionClick(activeOption)}
            data-analytics-source={source}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-100"
          >
            {activeOption.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          </div>
        </div>
      )}
    </div>
  );
}
