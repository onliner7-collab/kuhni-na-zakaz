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
  { href: "/catalog", label: "Каталог" },
  { href: "/styles", label: "Стили" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/kitchen-configurator", label: "Конфигуратор" },
  { href: "/configure", label: "Подбор кухни", exact: true },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/prices", label: "Цены" },
  { href: "/blog", label: "Блог" },
];

const SECONDARY_NAV_LINKS: NavLink[] = [
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты", exact: true },
];

const MOBILE_EXTRA_LINKS: NavLink[] = [
  { href: "/reviews", label: "Отзывы" },
  { href: "/delivery-installation", label: "Доставка и монтаж" },
  { href: "/warranty", label: "Гарантия" },
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
            aria-label="КухниBY - главная страница"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
              }}
            >
              <span className="text-base font-black">К</span>
            </div>
            <div className="min-w-0">
              <div className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                Кухни
                <span className="text-gradient">BY</span>
              </div>
              <p className="hidden text-xs text-muted-foreground lg:block">
                Кухни на заказ по Беларуси с замером и проектом
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
                  Консультация
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
              Вход
            </Link>

            <Link
              href="/contacts#form"
              className="btn-primary rounded-2xl px-5 py-3 text-sm shadow-xl shadow-primary/20"
              data-testid="header-cta"
            >
              Бесплатный замер
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
              aria-label="Вход в админку"
              data-testid="header-login-mobile"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden min-[380px]:inline">Вход</span>
            </Link>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white transition-colors hover:bg-muted"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              data-testid="mobile-menu-btn"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="hidden border-t border-border/70 lg:block">
          <div className="flex min-h-14 items-center justify-between gap-6">
            <nav
              aria-label="Основная навигация"
              className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2"
            >
              {PRIMARY_NAV_LINKS.map((link) => (
                <DesktopNavLink key={link.href} {...link} pathname={pathname} />
              ))}
            </nav>

            <nav
              aria-label="Дополнительная навигация"
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
            <nav aria-label="Мобильная навигация" className="grid gap-2">
              {PRIMARY_NAV_LINKS.map((link) => (
                <MobileNavLink key={link.href} {...link} pathname={pathname} />
              ))}
              {SECONDARY_NAV_LINKS.map((link) => (
                <MobileNavLink key={link.href} {...link} pathname={pathname} />
              ))}
            </nav>

            <div className="mt-4 rounded-3xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Полезные разделы
              </p>
              <div className="mt-3 grid gap-2">
                {MOBILE_EXTRA_LINKS.map((link) => (
                  <MobileNavLink
                    key={link.href}
                    {...link}
                    pathname={pathname}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Link
                href="/contacts#form"
                className="btn-primary justify-center rounded-2xl py-3.5 text-sm shadow-xl shadow-primary/20"
              >
                Бесплатный замер
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
                Вход в админку
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
