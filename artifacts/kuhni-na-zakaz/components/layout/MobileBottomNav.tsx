"use client";

import { Calculator, FolderOpen, Home, Images, Palette, Ruler } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ComponentType, type SVGProps, useEffect, useMemo, useState } from "react";

type BottomNavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  sectionId?: string;
};

function getItems(pathname: string): BottomNavItem[] {
  if (pathname === "/") {
    return [
      { label: "Проекты", href: "/#projects", icon: Images, sectionId: "projects" },
      { label: "Подобрать", href: "/#selector", icon: Palette, sectionId: "selector" },
      { label: "Цены", href: "/#prices", icon: Calculator, sectionId: "prices" },
      { label: "Рассчитать", href: "/#calculate", icon: Ruler, sectionId: "calculate" },
    ];
  }

  if (pathname === "/prices") {
    return [
      { label: "Главная", href: "/", icon: Home },
      { label: "Стили", href: "#styles", icon: Palette, sectionId: "styles" },
      { label: "Цены", href: "#catalog", icon: Calculator, sectionId: "catalog" },
      { label: "Рассчитать", href: "#calculate", icon: Ruler, sectionId: "calculate" },
    ];
  }

  if (pathname.startsWith("/catalog") || pathname.startsWith("/portfolio")) {
    return [
      { label: "Главная", href: "/", icon: Home },
      { label: "Каталог", href: "/catalog", icon: FolderOpen },
      { label: "Цены", href: "/prices", icon: Calculator },
      { label: "Рассчитать", href: "/contacts#form", icon: Ruler },
    ];
  }

  if (pathname.startsWith("/locations")) {
    return [
      { label: "Главная", href: "/", icon: Home },
      { label: "Проекты", href: "/portfolio", icon: Images },
      { label: "Цены", href: "/prices", icon: Calculator },
      { label: "Рассчитать", href: "/contacts#form", icon: Ruler },
    ];
  }

  return [
    { label: "Главная", href: "/", icon: Home },
    { label: "Каталог", href: "/catalog", icon: FolderOpen },
    { label: "Цены", href: "/prices", icon: Calculator },
    { label: "Рассчитать", href: "/contacts#form", icon: Ruler },
  ];
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const items = useMemo(() => getItems(pathname), [pathname]);
  const [activeHref, setActiveHref] = useState(items[0]?.href || "/");
  const [isFormFocused, setIsFormFocused] = useState(false);

  useEffect(() => {
    setActiveHref(items.find((item) => item.href === pathname)?.href || items[0]?.href || "/");
  }, [items, pathname]);

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      setIsFormFocused(Boolean(target?.closest("input, textarea, select, [contenteditable='true']")));
    };
    const onFocusOut = () => setIsFormFocused(false);

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  useEffect(() => {
    const sectionItems = items.filter((item) => item.sectionId);
    if (sectionItems.length === 0) return;

    const elements = sectionItems
      .map((item) => ({ item, element: document.getElementById(item.sectionId || "") }))
      .filter((entry): entry is { item: BottomNavItem; element: HTMLElement } => Boolean(entry.element));

    if (elements.length === 0) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const current = elements
          .map((entry) => ({
            href: entry.item.href,
            distance: Math.abs(entry.element.getBoundingClientRect().top - 90),
            top: entry.element.getBoundingClientRect().top,
          }))
          .filter((entry) => entry.top < window.innerHeight * 0.72)
          .sort((a, b) => a.distance - b.distance)[0];

        if (current) setActiveHref(current.href);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-[70] border-t border-[#d5b078]/24 bg-[#17120e]/96 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-12px_34px_rgba(0,0,0,0.28)] backdrop-blur transition duration-200 md:hidden ${
        isFormFocused ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
      aria-label="Нижняя навигация сайта"
      data-testid="mobile-bottom-nav"
    >
      <div className="grid grid-cols-4 gap-2 text-[0.68rem] font-black text-white/76">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeHref === item.href || (item.href !== "/" && pathname === item.href);

          return (
            <a
              key={`${item.label}-${item.href}`}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setActiveHref(item.href)}
              className={`relative flex min-h-12 flex-col items-center justify-center rounded-lg px-1.5 py-1 transition ${
                isActive
                  ? "bg-[#c99a62] text-[#17110b] shadow-[0_8px_20px_rgba(201,154,98,0.24)]"
                  : "text-white/76 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span
                className={`absolute inset-x-4 top-0 h-0.5 rounded-full transition ${
                  isActive ? "bg-[#17110b]/70" : "bg-transparent"
                }`}
                aria-hidden
              />
              <Icon className="mb-1 h-4 w-4" aria-hidden />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
