"use client";

import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "@/components/navigation/Link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { animate, type JSAnimation } from "animejs";

import { cn } from "@/lib/utils";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { PhoneReveal } from "@/components/layout/PhoneReveal";

type NavLink = {
  href: string;
  label: string;
  exact?: boolean;
};

interface HeaderCardLink {
  href: string;
  label: string;
}

interface HeaderCardGroup {
  label: string;
  bgColor: string;
  textColor: string;
  links: HeaderCardLink[];
}

const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: "/catalog", label: "\u041a\u0430\u0442\u0430\u043b\u043e\u0433" },
  { href: "/styles", label: "\u0421\u0442\u0438\u043b\u0438" },
  { href: "/materials", label: "\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b" },
  { href: "/materials/furnitura", label: "\u0424\u0443\u0440\u043d\u0438\u0442\u0443\u0440\u0430" },
  { href: "/portfolio", label: "\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e" },
  { href: "/design-proekt-kuhni", label: "3D-проект кухни" },
  { href: "/calculator", label: "\u041a\u0430\u043b\u044c\u043a\u0443\u043b\u044f\u0442\u043e\u0440" },
  { href: "/prices", label: "\u0426\u0435\u043d\u044b" },
  { href: "/blog", label: "\u0411\u043b\u043e\u0433" },
];

const SECONDARY_NAV_LINKS: NavLink[] = [
  { href: "/about", label: "\u041e \u043d\u0430\u0441" },
  { href: "/contacts", label: "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b", exact: true },
];

const MOBILE_EXTRA_LINKS: NavLink[] = [
  { href: "/reviews", label: "\u041e\u0442\u0437\u044b\u0432\u044b" },
  { href: "/delivery-installation", label: "\u0414\u043e\u0441\u0442\u0430\u0432\u043a\u0430 \u0438 \u043c\u043e\u043d\u0442\u0430\u0436" },
  { href: "/warranty", label: "\u0413\u0430\u0440\u0430\u043d\u0442\u0438\u044f" },
];

const HEADER_CARD_GROUPS: HeaderCardGroup[] = [
  {
    label: "Выбрать кухню",
    bgColor: "#17120e",
    textColor: "#fffaf4",
    links: [
      { href: "/catalog", label: "Каталог" },
      { href: "/styles", label: "Стили" },
      { href: "/materials", label: "Материалы" },
    ],
  },
  {
    label: "Посмотреть работы",
    bgColor: "#f6f1ea",
    textColor: "#201912",
    links: [
      { href: "/portfolio", label: "Портфолио" },
      { href: "/design-proekt-kuhni", label: "3D-проект кухни" },
      { href: "/blog", label: "Блог" },
    ],
  },
  {
    label: "Рассчитать заказ",
    bgColor: "#c99a62",
    textColor: "#17120e",
    links: [
      { href: "/calculator", label: "Калькулятор" },
      { href: "/prices", label: "Цены" },
      { href: "/contacts#form", label: "Заказать замер" },
    ],
  },
];

const BRAND_NAME = "\u041a\u0443\u0445\u043d\u0438";
const BRAND_LETTER = "\u041a";
const BRAND_SUBTITLE =
  "\u041a\u0443\u0445\u043d\u0438 \u043d\u0430 \u0437\u0430\u043a\u0430\u0437 \u043f\u043e \u0411\u0435\u043b\u0430\u0440\u0443\u0441\u0438 \u0441 \u0437\u0430\u043c\u0435\u0440\u043e\u043c \u0438 \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u043c";
const MAIN_NAV_ARIA = "\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f";
const EXTRA_NAV_ARIA = "\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f";
const MOBILE_NAV_ARIA = "\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f";
const OPEN_MENU = "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e";
const CLOSE_MENU = "\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e";
const CTA_LABEL = "\u0421\u043e\u0433\u043b\u0430\u0441\u043e\u0432\u0430\u0442\u044c \u0437\u0430\u043c\u0435\u0440";
const USEFUL_SECTIONS_LABEL = "\u041f\u043e\u043b\u0435\u0437\u043d\u044b\u0435 \u0440\u0430\u0437\u0434\u0435\u043b\u044b";
const HOME_ARIA =
  "\u041a\u0443\u0445\u043d\u0438BY \u2014 \u043f\u0440\u043e\u0438\u0437\u0432\u043e\u0434\u0438\u0442\u0435\u043b\u044c \u043a\u0443\u0445\u043e\u043d\u044c \u043d\u0430 \u0437\u0430\u043a\u0430\u0437 \u0432 \u0411\u0435\u043b\u0430\u0440\u0443\u0441\u0438";
const CARD_NAV_OPEN = "Открыть карточное меню";
const CARD_NAV_CLOSE = "Закрыть карточное меню";
const CARD_NAV_DURATION = 420;
const CARD_NAV_EASE = "out(3)";

function isActivePath(pathname: string, href: string, exact = false) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopNavLink({
  href,
  label,
  pathname,
  exact,
  isOverlay = false,
}: NavLink & { pathname: string; isOverlay?: boolean }) {
  const isActive = isActivePath(pathname, href, exact);

  return (
    <Link
      href={href}
      prefetch={false}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
        isOverlay && isActive
          ? "bg-white/15 text-white"
          : isOverlay
            ? "text-white/86 hover:bg-white/12 hover:text-white"
            : isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/72 hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
      {isActive && (
        <span className={cn("absolute inset-x-4 -bottom-[9px] h-0.5 rounded-full", isOverlay ? "bg-white" : "bg-primary")} />
      )}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  pathname,
  exact,
}: NavLink & { pathname: string }) {
  const isActive = isActivePath(pathname, href, exact);

  return (
    <Link
      href={href}
      prefetch={false}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 opacity-60" aria-hidden />
    </Link>
  );
}

function HeaderCardNavPanel({
  open,
  isOverlay,
  reducedMotion,
}: {
  open: boolean;
  isOverlay: boolean;
  reducedMotion: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const animationRef = useRef<JSAnimation | null>(null);
  const cardAnimationRefs = useRef<JSAnimation[]>([]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return;

    animationRef.current?.cancel();
    cardAnimationRefs.current.forEach((animation) => animation.cancel());
    cardAnimationRefs.current = [];

    const cards = cardRefs.current.filter((card): card is HTMLDivElement => Boolean(card));
    const targetHeight = open ? content.scrollHeight + 16 : 0;

    if (reducedMotion) {
      panel.style.height = open ? `${targetHeight}px` : "0px";
      cards.forEach((card) => {
        card.style.opacity = open ? "1" : "0";
        card.style.transform = open ? "translate3d(0, 0, 0)" : "translate3d(0, 20px, 0)";
      });
      return;
    }

    const heightState = { height: panel.getBoundingClientRect().height };
    animationRef.current = animate(heightState, {
      height: targetHeight,
      duration: CARD_NAV_DURATION,
      ease: CARD_NAV_EASE,
      onUpdate: () => {
        panel.style.height = `${heightState.height}px`;
      },
      onComplete: () => {
        panel.style.height = open ? "auto" : "0px";
        animationRef.current = null;
      },
    });

    cards.forEach((card, index) => {
      const cardState = {
        y: open ? 24 : 0,
        opacity: open ? 0 : 1,
      };

      const cardAnimation = animate(cardState, {
        y: open ? 0 : 24,
        opacity: open ? 1 : 0,
        duration: open ? 360 : 220,
        delay: open ? index * 70 + 80 : 0,
        ease: CARD_NAV_EASE,
        onUpdate: () => {
          card.style.opacity = String(cardState.opacity);
          card.style.transform = `translate3d(0, ${cardState.y}px, 0)`;
        },
      });

      cardAnimationRefs.current.push(cardAnimation);
    });

    return () => {
      animationRef.current?.cancel();
      animationRef.current = null;
      cardAnimationRefs.current.forEach((animation) => animation.cancel());
      cardAnimationRefs.current = [];
    };
  }, [open, reducedMotion]);

  return (
    <div
      ref={panelRef}
      id="header-card-navigation"
      className={cn(
        "hidden overflow-hidden lg:block",
        isOverlay ? "border-t border-white/12" : "border-t border-border/70",
      )}
      style={{ height: 0 }}
      aria-hidden={!open}
      data-testid="header-card-nav-panel"
    >
      <div ref={contentRef} className="grid grid-cols-3 gap-3 py-3">
        {HEADER_CARD_GROUPS.map((group, index) => (
          <div
            key={group.label}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            className="min-h-[8.5rem] rounded-lg p-4 opacity-0 shadow-sm"
            style={
              {
                backgroundColor: group.bgColor,
                color: group.textColor,
                transform: "translate3d(0, 24px, 0)",
              } as CSSProperties
            }
          >
            <div className="text-lg font-black">{group.label}</div>
            <div className="mt-4 grid gap-2">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  tabIndex={open ? undefined : -1}
                  className="group inline-flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-bold transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Header({
  phone,
  phoneHref,
}: {
  phone?: string;
  phoneHref?: string;
}) {
  const phoneDisplay = phone || CONTACT_DEFAULTS.phoneDisplay;
  const phoneLink = phoneHref || `tel:${CONTACT_DEFAULTS.phone}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cardNavOpen, setCardNavOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isOverlay = isHome && !scrolled && !open;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setReducedMotion(media.matches);

    updateReducedMotion();
    media.addEventListener("change", updateReducedMotion);

    return () => media.removeEventListener("change", updateReducedMotion);
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastScrolled = window.scrollY > 12;

    setScrolled(lastScrolled);

    const onScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextScrolled = window.scrollY > 12;

        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled;
          setScrolled(nextScrolled);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setCardNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "top-0 z-50 border-b transition-all duration-300",
        isOverlay
          ? "absolute inset-x-0 border-white/12 bg-transparent text-white"
          : "sticky border-border/70 bg-white/96 text-foreground",
        scrolled && "shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl",
      )}
    >
      <div className="container-site">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-3 py-3 lg:min-h-20 lg:py-4">
          <Link
            href="/"
            prefetch={false}
            className="group flex min-w-0 items-center gap-3"
            aria-label={HOME_ARIA}
          >
            <span className="flex min-w-0 items-center gap-3" aria-hidden="true">
              <div className="min-w-0">
                <div className={cn("text-xl font-black tracking-tight sm:text-2xl", isOverlay ? "text-white" : "text-foreground")}>
                  {BRAND_NAME}
                  <span className={isOverlay ? "text-[#d8aa72]" : "text-gradient"}>BY</span>
                </div>
                <p className={cn("hidden text-xs lg:block", isOverlay ? "text-white/70" : "text-muted-foreground")}>
                  {BRAND_SUBTITLE}
                </p>
              </div>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex">
            <PhoneReveal
              phone={phoneDisplay}
              phoneHref={phoneLink}
              source="header"
              isOverlay={isOverlay}
            />

            <Link
              href="/contacts#form"
              prefetch={false}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all active:scale-95",
                isOverlay
                  ? "bg-[#c99a62] text-white shadow-xl shadow-black/20 hover:bg-[#b9874f]"
                  : "btn-primary shadow-xl shadow-primary/20",
              )}
              data-testid="header-cta"
            >
              {CTA_LABEL}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={phoneLink}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors",
                isOverlay
                  ? "border-white/18 bg-black/18 text-white hover:bg-white/10"
                  : "border-border bg-white text-primary hover:bg-primary/5",
              )}
              aria-label={phoneDisplay}
              data-testid="header-phone-mobile"
            >
              <Phone className="h-4 w-4" aria-hidden />
            </a>
            <button
              ref={menuButtonRef}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors",
                isOverlay
                  ? "border-white/18 bg-black/18 text-white hover:bg-white/10"
                  : "border-border bg-white hover:bg-muted",
              )}
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? CLOSE_MENU : OPEN_MENU}
              data-testid="mobile-menu-btn"
            >
              {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>

        <div className={cn("hidden border-t lg:block", isOverlay ? "border-white/12" : "border-border/70")}>
          <div className="flex min-h-14 items-center justify-between gap-6">
            <nav
              aria-label={MAIN_NAV_ARIA}
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2"
            >
              {PRIMARY_NAV_LINKS.map((link) => (
                <DesktopNavLink key={link.href} {...link} pathname={pathname} isOverlay={isOverlay} />
              ))}
            </nav>

            <nav
              aria-label={EXTRA_NAV_ARIA}
              className="flex items-center gap-1 py-2"
            >
              <button
                type="button"
                onClick={() => setCardNavOpen((value) => !value)}
                aria-expanded={cardNavOpen}
                aria-controls="header-card-navigation"
                aria-label={cardNavOpen ? CARD_NAV_CLOSE : CARD_NAV_OPEN}
                data-testid="header-card-nav-toggle"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
                  isOverlay
                    ? "text-white/86 hover:bg-white/12 hover:text-white"
                    : cardNavOpen
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/72 hover:bg-muted hover:text-foreground",
                )}
              >
                {cardNavOpen ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
                <span>Разделы</span>
              </button>
              {SECONDARY_NAV_LINKS.map((link) => (
                <DesktopNavLink key={link.href} {...link} pathname={pathname} isOverlay={isOverlay} />
              ))}
            </nav>
          </div>
        </div>
        <HeaderCardNavPanel open={cardNavOpen} isOverlay={isOverlay} reducedMotion={reducedMotion} />
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-border bg-white/95 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden"
        >
          <div className="container-site py-4">
            <nav aria-label={MOBILE_NAV_ARIA} className="grid gap-2">
              {PRIMARY_NAV_LINKS.map((link) => (
                <MobileNavLink key={link.href} {...link} pathname={pathname} />
              ))}
              {SECONDARY_NAV_LINKS.map((link) => (
                <MobileNavLink key={link.href} {...link} pathname={pathname} />
              ))}
            </nav>

            <div className="mt-4 rounded-3xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {USEFUL_SECTIONS_LABEL}
              </p>
              <div className="mt-3 grid gap-2">
                {MOBILE_EXTRA_LINKS.map((link) => (
                  <MobileNavLink key={link.href} {...link} pathname={pathname} />
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Link
                href="/contacts#form"
                prefetch={false}
                className="btn-primary justify-center rounded-2xl py-3.5 text-sm shadow-xl shadow-primary/20"
              >
                {CTA_LABEL}
              </Link>

              <PhoneReveal
                phone={phoneDisplay}
                phoneHref={phoneLink}
                source="mobile-menu"
                compact
                className="justify-center rounded-2xl py-3.5"
              />

            </div>
          </div>
        </div>
      )}
    </header>
  );
}
