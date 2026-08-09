"use client";

import { useRef, type MouseEvent } from "react";
import { ChevronDown, Menu } from "lucide-react";

import Link from "@/components/navigation/Link";

interface MobileNavigationProps {
  primaryLinks: ReadonlyArray<readonly [string, string]>;
  secondaryLinks: ReadonlyArray<readonly [string, string]>;
}

export function MobileNavigation({ primaryLinks, secondaryLinks }: MobileNavigationProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  function closeAfterSelection(event: MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest("a[href]")) detailsRef.current?.removeAttribute("open");
  }

  return (
    <details ref={detailsRef} className="group">
      <summary
        className="inline-flex h-11 min-w-11 cursor-pointer list-none items-center justify-center gap-1 rounded-2xl border border-border bg-white px-3 [&::-webkit-details-marker]:hidden"
        aria-controls="mobile-navigation"
        data-testid="mobile-menu-btn"
      >
        <Menu className="h-5 w-5 group-open:hidden" aria-hidden />
        <ChevronDown className="hidden h-5 w-5 group-open:block" aria-hidden />
        <span className="sr-only">Меню сайта</span>
      </summary>
      <nav
        id="mobile-navigation"
        className="fixed inset-x-0 top-[4.5rem] max-h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-border bg-white px-4 py-5 shadow-xl"
        aria-label="Мобильная навигация"
        data-testid="mobile-card-nav-panel"
        onClick={closeAfterSelection}
      >
        <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2">
          {primaryLinks.map(([href, label]) => (
            <Link key={href} href={href} className="flex min-h-11 items-center rounded-xl bg-muted/60 px-4 py-3 text-sm font-bold">
              {label}
            </Link>
          ))}
          {secondaryLinks.map(([href, label]) => (
            <Link key={href} href={href} className="flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-semibold">
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </details>
  );
}
