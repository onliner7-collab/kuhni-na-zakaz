"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, LogIn, Menu, Phone, X } from "lucide-react";

import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  exact?: boolean;
};

const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: "/catalog", label: "РљР°С‚Р°Р»РѕРі" },
  { href: "/styles", label: "РЎС‚РёР»Рё" },
  { href: "/portfolio", label: "РџРѕСЂС‚С„РѕР»РёРѕ" },
  { href: "/kitchen-configurator", label: "РљРѕРЅС„РёРіСѓСЂР°С‚РѕСЂ" },
  { href: "/calculator", label: "РљР°Р»СЊРєСѓР»СЏС‚РѕСЂ" },
  { href: "/prices", label: "Р¦РµРЅС‹" },
  { href: "/blog", label: "Р‘Р»РѕРі" },
];

const SECONDARY_NAV_LINKS: NavLink[] = [
  { href: "/about", label: "Рћ РЅР°СЃ" },
  { href: "/contacts", label: "РљРѕРЅС‚Р°РєС‚С‹", exact: true },
];

const MOBILE_EXTRA_LINKS: NavLink[] = [
  { href: "/reviews", label: "РћС‚Р·С‹РІС‹" },
  { href: "/delivery-installation", label: "Р”РѕСЃС‚Р°РІРєР° Рё РјРѕРЅС‚Р°Р¶" },
  { href: "/warranty", label: "Р“Р°СЂР°РЅС‚РёСЏ" },
];

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
  const phoneDisplay = phone || "+375 (29) 123-45-67";
  const phoneLink = phoneHref || "tel:+375291234567";
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
            aria-label="РљСѓС…РЅРёBY - РіР»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р°"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
              }}
            >
              <span className="text-base font-black">Рљ</span>
            </div>
            <div className="min-w-0">
              <div className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                РљСѓС…РЅРё
                <span className="text-gradient">BY</span>
              </div>
              <p className="hidden text-xs text-muted-foreground lg:block">
                РљСѓС…РЅРё РЅР° Р·Р°РєР°Р· РїРѕ Р‘РµР»Р°СЂСѓСЃРё СЃ Р·Р°РјРµСЂРѕРј Рё РїСЂРѕРµРєС‚РѕРј
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
                  РљРѕРЅСЃСѓР»СЊС‚Р°С†РёСЏ
                </span>
                <span className="block whitespace-nowrap text-sm font-bold text-foreground xl:text-base">
                  {phoneDisplay}
                </span>
              </span>
            </a>

            <Link
              href="/admin/login"
              className="hidden items-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground/60 transition-colors hover:bg-muted hover:text-foreground xl:inline-flex"
              data-testid="header-login"
            >
              <LogIn className="h-4 w-4" />
              Р’С…РѕРґ
            </Link>

            <Link
              href="/contacts#form"
              className="btn-primary rounded-2xl px-5 py-3 text-sm shadow-xl shadow-primary/20"
              data-testid="header-cta"
            >
              Р‘РµСЃРїР»Р°С‚РЅС‹Р№ Р·Р°РјРµСЂ
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
            <Link
              href="/admin/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-3.5 text-sm font-semibold text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Р’С…РѕРґ РІ Р°РґРјРёРЅРєСѓ"
              data-testid="header-login-mobile"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden min-[380px]:inline">Р’С…РѕРґ</span>
            </Link>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white transition-colors hover:bg-muted"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ" : "РћС‚РєСЂС‹С‚СЊ РјРµРЅСЋ"}
              data-testid="mobile-menu-btn"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="hidden border-t border-border/70 lg:block">
          <div className="flex min-h-14 items-center justify-between gap-6">
            <nav
              aria-label="РћСЃРЅРѕРІРЅР°СЏ РЅР°РІРёРіР°С†РёСЏ"
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2"
            >
              {PRIMARY_NAV_LINKS.map((link) => (
                <DesktopNavLink key={link.href} {...link} pathname={pathname} />
              ))}
            </nav>

            <nav
              aria-label="Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅР°СЏ РЅР°РІРёРіР°С†РёСЏ"
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
            <nav aria-label="РњРѕР±РёР»СЊРЅР°СЏ РЅР°РІРёРіР°С†РёСЏ" className="grid gap-2">
              {PRIMARY_NAV_LINKS.map((link) => (
                <MobileNavLink key={link.href} {...link} pathname={pathname} />
              ))}
              {SECONDARY_NAV_LINKS.map((link) => (
                <MobileNavLink key={link.href} {...link} pathname={pathname} />
              ))}
            </nav>

            <div className="mt-4 rounded-3xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                РџРѕР»РµР·РЅС‹Рµ СЂР°Р·РґРµР»С‹
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
                Р‘РµСЃРїР»Р°С‚РЅС‹Р№ Р·Р°РјРµСЂ
              </Link>

              <a
                href={phoneLink}
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Phone className="h-4 w-4 text-primary" />
                {phoneDisplay}
              </a>

              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3.5 text-sm font-semibold text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogIn className="h-4 w-4" />
                Р’С…РѕРґ РІ Р°РґРјРёРЅРєСѓ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
