"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";

type NavLink = {
  href: string;
  label: string;
  exact?: boolean;
};

const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: "/catalog", label: "\u041a\u0430\u0442\u0430\u043b\u043e\u0433" },
  { href: "/styles", label: "\u0421\u0442\u0438\u043b\u0438" },
  { href: "/portfolio", label: "\u041f\u043e\u0440\u0442\u0444\u043e\u043b\u0438\u043e" },
  { href: "/kitchen-configurator", label: "\u041a\u043e\u043d\u0444\u0438\u0433\u0443\u0440\u0430\u0442\u043e\u0440" },
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

const BRAND_NAME = "\u041a\u0443\u0445\u043d\u0438";
const BRAND_LETTER = "\u041a";
const BRAND_SUBTITLE =
  "\u041a\u0443\u0445\u043d\u0438 \u043d\u0430 \u0437\u0430\u043a\u0430\u0437 \u043f\u043e \u0411\u0435\u043b\u0430\u0440\u0443\u0441\u0438 \u0441 \u0437\u0430\u043c\u0435\u0440\u043e\u043c \u0438 \u043f\u0440\u043e\u0435\u043a\u0442\u043e\u043c";
const MAIN_NAV_ARIA = "\u041e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f";
const EXTRA_NAV_ARIA = "\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f";
const MOBILE_NAV_ARIA = "\u041c\u043e\u0431\u0438\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f";
const OPEN_MENU = "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e";
const CLOSE_MENU = "\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e";
const CTA_LABEL = "\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0439 \u0437\u0430\u043c\u0435\u0440";
const CONSULTATION_LABEL = "\u041a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0438\u044f";
const USEFUL_SECTIONS_LABEL = "\u041f\u043e\u043b\u0435\u0437\u043d\u044b\u0435 \u0440\u0430\u0437\u0434\u0435\u043b\u044b";
const HOME_ARIA = "\u041a\u0443\u0445\u043d\u0438BY - \u0433\u043b\u0430\u0432\u043d\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430";

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
}: NavLink & { pathname: string }) {
  const isActive = isActivePath(pathname, href, exact);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/72 hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
      {isActive && (
        <span className="absolute inset-x-4 -bottom-[9px] h-0.5 rounded-full bg-primary" />
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
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 opacity-60" />
    </Link>
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
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/70 bg-white/96 transition-all duration-300",
        scrolled && "shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl",
      )}
    >
      <div className="container-site">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-3 py-3 lg:min-h-20 lg:py-4">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3"
            aria-label={HOME_ARIA}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
              }}
            >
              <span className="text-base font-black">{BRAND_LETTER}</span>
            </div>
            <div className="min-w-0">
              <div className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                {BRAND_NAME}
                <span className="text-gradient">BY</span>
              </div>
              <p className="hidden text-xs text-muted-foreground lg:block">
                {BRAND_SUBTITLE}
              </p>
            </div>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex">
            <a
              href={phoneLink}
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-white px-4 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/5"
              data-testid="header-phone"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {CONSULTATION_LABEL}
                </span>
                <span className="block whitespace-nowrap text-sm font-bold text-foreground xl:text-base">
                  {phoneDisplay}
                </span>
              </span>
            </a>

            <Link
              href="/contacts#form"
              className="btn-primary rounded-2xl px-5 py-3 text-sm shadow-xl shadow-primary/20"
              data-testid="header-cta"
            >
              {CTA_LABEL}
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={phoneLink}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-primary transition-colors hover:bg-primary/5"
              aria-label={phoneDisplay}
              data-testid="header-phone-mobile"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white transition-colors hover:bg-muted"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? CLOSE_MENU : OPEN_MENU}
              data-testid="mobile-menu-btn"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="hidden border-t border-border/70 lg:block">
          <div className="flex min-h-14 items-center justify-between gap-6">
            <nav
              aria-label={MAIN_NAV_ARIA}
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2"
            >
              {PRIMARY_NAV_LINKS.map((link) => (
                <DesktopNavLink key={link.href} {...link} pathname={pathname} />
              ))}
            </nav>

            <nav
              aria-label={EXTRA_NAV_ARIA}
              className="flex items-center gap-1 py-2"
            >
              {SECONDARY_NAV_LINKS.map((link) => (
                <DesktopNavLink key={link.href} {...link} pathname={pathname} />
              ))}
            </nav>
          </div>
        </div>
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
                className="btn-primary justify-center rounded-2xl py-3.5 text-sm shadow-xl shadow-primary/20"
              >
                {CTA_LABEL}
              </Link>

              <a
                href={phoneLink}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Phone className="h-4 w-4 text-primary" />
                {phoneDisplay}
              </a>

            </div>
          </div>
        </div>
      )}
    </header>
  );
}
