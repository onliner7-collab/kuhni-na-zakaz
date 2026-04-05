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

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background transition-shadow",
        scrolled && "shadow-md"
      )}
    >
      <div className="container-site flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-semibold text-foreground">
          КухниMinsk
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={PHONE_HREF}
            className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
            data-testid="header-phone"
          >
            <Phone className="w-4 h-4" />
            {PHONE}
          </a>
          <Link href="/contacts#form" className="btn-primary text-sm py-2 px-4" data-testid="header-cta">
            Заказать звонок
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
          data-testid="mobile-menu-btn"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container-site py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium py-1 transition-colors",
                  pathname === link.href
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={PHONE_HREF}
              className="flex items-center gap-2 text-sm font-medium text-primary mt-2"
            >
              <Phone className="w-4 h-4" />
              {PHONE}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
