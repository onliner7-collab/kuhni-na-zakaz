import Link from "next/link";
import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";

import { regionalLocations } from "@/data/locations";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { resolveContactInfo } from "@/lib/contact-info";
import { prisma } from "@/lib/db";
import { buildInstagramHref, buildTelegramHref } from "@/lib/social-links";

function FooterTelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d="M21.94 4.32a1.5 1.5 0 0 0-1.6-.24L3.4 10.86c-1.06.43-1.05 1.05-.19 1.33l4.36 1.36 1.69 5.31c.2.61.34.83.69.83.27 0 .42-.12.6-.26l2.2-2.06 4.43 3.27c.81.45 1.4.22 1.6-.75l2.92-13.78c.28-1.31-.44-1.85-1.16-1.79zm-3.79 4.46-8.42 5.34-.33 3.5-.5-3.18 8.79-5.55c.4-.26.78-.13.46.15z" />
    </svg>
  );
}

const FOOTER_LINKS = {
  catalog: [
    { href: "/catalog/uglovye-kuhni", label: "Угловые кухни" },
    { href: "/catalog/pryamye-kuhni", label: "Прямые кухни" },
    { href: "/catalog/p-obraznye-kuhni", label: "П-образные" },
    { href: "/catalog/kuhni-s-ostrovom", label: "С островом" },
    { href: "/catalog/malenkie-kuhni", label: "Маленькие кухни" },
    { href: "/catalog/kuhni-do-potolka", label: "До потолка" },
  ],
  info: [
    { href: "/about", label: "О компании" },
    { href: "/portfolio", label: "Портфолио" },
    { href: "/reviews", label: "Отзывы" },
    { href: "/delivery-installation", label: "Доставка и монтаж" },
    { href: "/warranty", label: "Гарантия" },
    { href: "/blog", label: "Блог" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Политика конфиденциальности" },
    { href: "/terms", label: "Условия использования" },
    { href: "/personal-data", label: "Персональные данные" },
  ],
};

export async function Footer() {
  const s = process.env.DATABASE_URL
    ? await prisma.siteSettings.findFirst({ where: { id: 1 } }).catch(() => null)
    : null;
  const c = resolveContactInfo(s);
  const instagramHref = buildInstagramHref(c.instagram);
  const telegramHref = buildTelegramHref(c.telegram);
  const hasSocialLinks = Boolean(instagramHref || telegramHref);

  const priorityCities = regionalLocations.map((location) => ({
    href: `/locations/${location.slug}`,
    label: location.cityName,
  }));

  return (
    <footer className="mt-16 bg-stone-950 text-white">
      <div className="container-site py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="КухниBY — производитель кухонь на заказ в Беларуси"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-black text-white">
                К
              </span>
              <span className="text-xl font-black tracking-tight text-white">КухниBY</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Кухни на заказ по Беларуси: проектирование, производство, доставка и монтаж.
            </p>
            <div className="mt-4 space-y-2.5">
              <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {c.phoneDisplay}
              </a>
              {c.phone2 && c.phoneDisplay2 && (
                <a href={`tel:${c.phone2}`} className="flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {c.phoneDisplay2}
                </a>
              )}
              <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {c.email}
              </a>
              <div className="flex items-start gap-2 text-sm text-white/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                {c.address}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/65">
                <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {c.workingHours}
              </div>
            </div>
            {hasSocialLinks && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/55">
                  Мы в соцсетях
                </p>
                <ul className="flex items-center gap-2">
                  {instagramHref && (
                    <li>
                      <a
                        href={instagramHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Открыть наш профиль в Instagram (откроется в новой вкладке)"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-primary/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
                      >
                        <Instagram className="h-4 w-4" aria-hidden />
                      </a>
                    </li>
                  )}
                  {telegramHref && (
                    <li>
                      <a
                        href={telegramHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Написать нам в Telegram (откроется в новой вкладке)"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-primary/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
                      >
                        <FooterTelegramIcon className="h-4 w-4" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">Каталог</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.catalog.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">Компания</p>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.info.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">Кухни по городам</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {priorityCities.map((city) => (
                <li key={city.href}>
                  <Link href={city.href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {city.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">Правовое</p>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/55 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} КухниBY. Все права защищены.
          </p>
          <p className="text-sm text-white/60">
            УНП {CONTACT_DEFAULTS.unp} | {c.address}
          </p>
        </div>
      </div>
    </footer>
  );
}
