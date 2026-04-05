"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/styles", label: "Стили" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/prices", label: "Цены" },
  { href: "/blog", label: "Блог" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
];

const PHONE = "+375 (29) 123-45-67";
const PHONE_HREF = "tel:+375291234567";

// Redesigned: modern youth-oriented header with gradient logo, glassmorphism on scroll

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-black/5 shadow-sm"
          : "bg-white"
      )}
    >
      <div className="container-site flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
          >
            <span className="text-white font-black text-sm">К</span>
          </div>
          <span className="font-black text-xl tracking-tight text-foreground">
            Кухни
            <span
              style={{
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Minsk
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-3 py-2 text-sm font-semibold rounded-lg transition-all",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-primary"
                  : "text-foreground/60 hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
              {(pathname === link.href || pathname.startsWith(link.href + "/")) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={PHONE_HREF}
            className="flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            data-testid="header-phone"
          >
            <Phone className="w-4 h-4 text-primary" />
            {PHONE}
          </a>
          <Link
            href="/contacts#form"
            className="btn-primary text-sm py-2.5 px-5"
            data-testid="header-cta"
          >
            Бесплатный замер
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
          data-testid="mobile-menu-btn"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white/95 backdrop-blur-xl">
          <nav className="container-site py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold py-3 px-3 rounded-xl transition-all",
                  pathname === link.href
                    ? "text-primary bg-primary/8"
                    : "text-foreground hover:text-primary hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
              <a
                href={PHONE_HREF}
                className="flex items-center gap-2 text-sm font-semibold text-primary px-3 py-2"
              >
                <Phone className="w-4 h-4" />
                {PHONE}
              </a>
              <Link href="/contacts#form" className="btn-primary justify-center text-sm py-3">
                Бесплатный замер
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
