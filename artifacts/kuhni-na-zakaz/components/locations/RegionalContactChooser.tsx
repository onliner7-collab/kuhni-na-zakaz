"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Instagram, MessageCircle, Phone, Send } from "lucide-react";
import { createLayout, type AutoLayout } from "animejs/layout";

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
    text: "Быстро обсудить город, размеры и удобное время для замера.",
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

export function RegionalContactChooser({ source }: RegionalContactChooserProps) {
  const [activeId, setActiveId] = useState(contactOptions[0].id);
  const layoutRef = useRef<AutoLayout | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    layoutRef.current = createLayout(rootRef.current, {
      children: ".contact-layout-item",
      duration: 460,
      ease: "out(3)",
      enterFrom: { opacity: 0, y: 12 },
      leaveTo: { opacity: 0, y: -12 },
    });

    return () => {
      layoutRef.current?.revert();
      layoutRef.current = null;
    };
  }, []);

  function chooseOption(id: string) {
    layoutRef.current?.record();
    setActiveId(id);
    window.requestAnimationFrame(() => {
      layoutRef.current?.animate({
        duration: 460,
        ease: "out(3)",
      });
    });
  }

  const activeOption = contactOptions.find((item) => item.id === activeId) ?? contactOptions[0];
  const ActiveIcon = activeOption.icon;

  return (
    <div
      ref={rootRef}
      className="rounded-lg border border-white/14 bg-white/[0.07] p-3 shadow-2xl shadow-black/20 backdrop-blur-md"
      data-contact-source={source}
    >
      <div className="grid gap-3 md:grid-cols-[0.9fr_1.1fr] md:items-stretch">
        <div className="contact-layout-item grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-1">
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

        <div className="contact-layout-item relative overflow-hidden rounded-md bg-black/24 p-5">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-amber-300/18 text-amber-100">
            <ActiveIcon className="h-5 w-5" aria-hidden />
          </div>
          <h3 className="text-xl font-bold text-white">{activeOption.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/68">{activeOption.text}</p>
          <a
            href={activeOption.href}
            target={activeOption.href.startsWith("http") ? "_blank" : undefined}
            rel={activeOption.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-stone-950 transition-colors hover:bg-amber-100"
          >
            {activeOption.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
