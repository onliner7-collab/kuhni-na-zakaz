"use client";

import {
  Calculator,
  Grid2X2,
  Images,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  MessageCircle,
  Palette,
  PenTool,
  Ruler,
  Send,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  SquareStack,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  MOBILE_DOCK_DISABLED_PATH_PREFIXES,
  MOBILE_DOCK_SCROLL_OFFSETS,
  MOBILE_DOCK_TYPES,
} from "@/lib/mobile-dock.config";
import { cn } from "@/lib/utils";

type MobileDockAction = "open-calculation-form" | "open-design-form" | "open-measurement-form";

type MobileDockItem = {
  label: string;
  icon: keyof typeof ICONS;
  target?: string;
  href?: string;
  action?: MobileDockAction;
  fallbackTarget?: string;
  primary?: boolean;
  optional?: boolean;
  alternatives?: MobileDockItem[];
};

type MobileDockType = {
  match: string[];
  items: MobileDockItem[];
};

type ResolvedDockItem = MobileDockItem & {
  key: string;
  Icon: LucideIcon;
  activeTarget?: string;
};

const ICONS = {
  calculator: Calculator,
  "grid-2x2": Grid2X2,
  images: Images,
  layers: Layers,
  "layout-grid": LayoutGrid,
  "layout-template": LayoutTemplate,
  "message-circle": MessageCircle,
  palette: Palette,
  "pen-tool": PenTool,
  ruler: Ruler,
  send: Send,
  "settings-2": Settings2,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  "square-stack": SquareStack,
  wallet: Wallet,
};

const CONFIG = MOBILE_DOCK_TYPES as Record<string, MobileDockType>;

function isDisabledPath(pathname: string) {
  return MOBILE_DOCK_DISABLED_PATH_PREFIXES.some((prefix: string) => pathname.startsWith(prefix));
}

function matchesPattern(pathname: string, pattern: string) {
  if (pattern.endsWith("/*")) {
    const base = pattern.slice(0, -2);
    return pathname.startsWith(`${base}/`);
  }

  return pathname === pattern;
}

function getDockEntry(pathname: string) {
  if (isDisabledPath(pathname)) return null;

  const entries = Object.entries(CONFIG);
  const exact = entries.find(([, entry]) => entry.match.some((pattern) => !pattern.endsWith("/*") && pathname === pattern));
  if (exact) return { key: exact[0], entry: exact[1] };

  const wildcard = entries.find(([, entry]) => entry.match.some((pattern) => matchesPattern(pathname, pattern)));
  return wildcard ? { key: wildcard[0], entry: wildcard[1] } : null;
}

function targetExists(selector?: string) {
  if (!selector) return false;

  try {
    return Boolean(document.querySelector(selector));
  } catch {
    return false;
  }
}

function getActionTarget(item: MobileDockItem) {
  return item.fallbackTarget || item.target;
}

function resolveItem(item: MobileDockItem, index: number): ResolvedDockItem | null {
  const candidates = [item, ...(item.alternatives || [])];

  for (const candidate of candidates) {
    const target = candidate.target || getActionTarget(candidate);
    const hasTarget = target ? targetExists(target) : false;
    const hasHref = Boolean(candidate.href);
    const hasAction = Boolean(candidate.action && getActionTarget(candidate) && targetExists(getActionTarget(candidate)));

    if (!hasHref && !hasTarget && !hasAction) continue;

    const Icon = ICONS[candidate.icon] || Calculator;
    return {
      ...candidate,
      key: `${candidate.label}-${candidate.href || candidate.target || candidate.action || index}`,
      Icon,
      activeTarget: target,
    };
  }

  return null;
}

function focusFirstField(container: Element | null) {
  const field = container?.querySelector<HTMLElement>(
    "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled])",
  );

  window.setTimeout(() => field?.focus({ preventScroll: true }), 260);
}

function scrollToTarget(selector: string, focusForm = false) {
  const target = document.querySelector(selector);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - MOBILE_DOCK_SCROLL_OFFSETS.header;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });

  if (focusForm) focusFirstField(target);
}

function isSuppressedByOverlay() {
  const overlaySelectors = [
    "[role='dialog']",
    "[data-radix-dialog-content]",
    ".fixed.inset-0",
    "[data-mobile-dock-suppress='true']",
  ];

  return overlaySelectors.some((selector) => {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return false;

    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;

    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > window.innerHeight * 0.72;
  });
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const dockEntry = useMemo(() => getDockEntry(pathname), [pathname]);
  const [items, setItems] = useState<ResolvedDockItem[]>([]);
  const [activeKey, setActiveKey] = useState("");
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [isSuppressed, setIsSuppressed] = useState(false);
  const clickLockRef = useRef(0);

  useEffect(() => {
    if (!dockEntry) {
      document.body.removeAttribute("data-mobile-dock");
      setItems([]);
      return;
    }

    document.body.dataset.mobileDock = dockEntry.key;

    const resolve = () => {
      const resolved = dockEntry.entry.items
        .map((item, index) => resolveItem(item, index))
        .filter((item): item is ResolvedDockItem => Boolean(item))
        .slice(0, 4);

      setItems(resolved.length === 4 ? resolved : []);
      setActiveKey(resolved[0]?.key || "");
    };

    resolve();
    const frame = window.requestAnimationFrame(resolve);

    return () => window.cancelAnimationFrame(frame);
  }, [dockEntry]);

  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      setIsFormFocused(Boolean(target?.closest("input, textarea, select, [contenteditable='true']")));
    };
    const onFocusOut = () => window.setTimeout(() => setIsFormFocused(false), 80);

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setIsSuppressed(isSuppressedByOverlay());
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("click", update, true);
    document.addEventListener("keydown", update, true);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("click", update, true);
      document.removeEventListener("keydown", update, true);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const sectionItems = items.filter((item) => item.activeTarget?.startsWith("#") && !item.href);
    if (sectionItems.length === 0) return;

    const observed = sectionItems
      .map((item) => ({ item, element: document.querySelector(item.activeTarget || "") }))
      .filter((entry): entry is { item: ResolvedDockItem; element: Element } => Boolean(entry.element));

    if (observed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];

        const match = observed.find((entry) => entry.element === visible?.target);
        if (match) setActiveKey(match.item.key);
      },
      { rootMargin: "-35% 0px -52% 0px", threshold: [0, 0.12, 0.4] },
    );

    observed.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  if (!dockEntry || items.length !== 4) return null;

  function handleItemClick(item: ResolvedDockItem) {
    const now = Date.now();
    if (now - clickLockRef.current < 180) return;
    clickLockRef.current = now;
    setActiveKey(item.key);

    if (item.href) {
      window.location.href = item.href;
      return;
    }

    const target = getActionTarget(item) || item.target;
    if (!target) return;

    scrollToTarget(target, Boolean(item.action));
  }

  const hidden = isFormFocused || isSuppressed;

  return (
    <nav
      className={cn("mobile-page-dock", hidden && "mobile-page-dock--hidden")}
      aria-label="Навигация по странице"
      data-testid="mobile-bottom-nav"
      data-mobile-dock-type={dockEntry.key}
    >
      {items.map((item, index) => {
        const isActive = activeKey === item.key;
        const isNeighbor = items[index - 1]?.key === activeKey || items[index + 1]?.key === activeKey;
        const ariaCurrent = isActive && !item.action ? "location" : undefined;

        return (
          <button
            key={item.key}
            className={cn(
              "mobile-page-dock__item",
              item.primary && "mobile-page-dock__item--primary",
              isActive && "mobile-page-dock__item--active",
              isNeighbor && "mobile-page-dock__item--neighbor",
            )}
            type="button"
            aria-current={ariaCurrent}
            aria-label={item.label}
            onClick={() => handleItemClick(item)}
          >
            <span className="mobile-page-dock__icon" aria-hidden="true">
              <item.Icon />
            </span>
            <span className="mobile-page-dock__label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
