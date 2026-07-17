"use client";

import { FolderOpen, Menu, Send, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { LeadFormSheet } from "@/components/leads/LeadFormSheet";
import { cn } from "@/lib/utils";

const DOCK_ITEMS = [
  { label: "Выбрать", href: "/catalog", icon: Menu, testId: "dock-catalog" },
  { label: "Цены", href: "/prices", icon: Wallet, testId: "dock-prices" },
  { label: "Наши работы", href: "/portfolio", icon: FolderOpen, testId: "dock-portfolio" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/catalog") return ["/catalog", "/styles", "/scenarios", "/materials"].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (href === "/prices") return pathname === "/prices" || pathname === "/calculator" || pathname.startsWith("/prices/");
  if (href === "/portfolio") return pathname === "/portfolio" || pathname.startsWith("/portfolio/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isExcludedPath(pathname: string) {
  return ["/admin", "/kapi", "/thanks", "/robots.txt", "/sitemap.xml", "/component-library-preview", "/__component-library"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function MobileBottomNav() {
  const pathname = usePathname() || "/";
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (isExcludedPath(pathname)) return;
    document.body.dataset.mobileDock = "global";
    return () => { delete document.body.dataset.mobileDock; };
  }, [pathname]);

  if (isExcludedPath(pathname)) return null;

  return (
    <>
      <nav className={cn("mobile-page-dock", isOpen && "mobile-page-dock--hidden")} aria-label="Основная навигация" data-testid="mobile-bottom-nav">
        {DOCK_ITEMS.map(({ label, href, icon: Icon, testId }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link key={href} href={href} className={cn("mobile-page-dock__item", active && "mobile-page-dock__item--active")} aria-current={active ? "page" : undefined} aria-label={label} data-testid={testId}>
              <span className="mobile-page-dock__icon" aria-hidden="true"><Icon /></span>
              <span className="mobile-page-dock__label">{label}</span>
            </Link>
          );
        })}
        <button ref={triggerRef} type="button" className={cn("mobile-page-dock__item mobile-page-dock__item--primary", isOpen && "mobile-page-dock__item--active")} aria-label="Оставить заявку" aria-expanded={isOpen} onClick={() => setIsOpen(true)} data-testid="dock-lead">
          <span className="mobile-page-dock__icon" aria-hidden="true"><Send /></span>
          <span className="mobile-page-dock__label">Оставить заявку</span>
        </button>
      </nav>
      {isOpen && <LeadFormSheet pathname={pathname} triggerRef={triggerRef} onClose={close} />}
    </>
  );
}
