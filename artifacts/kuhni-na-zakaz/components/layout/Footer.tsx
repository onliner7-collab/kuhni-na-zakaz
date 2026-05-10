import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { regionalLocations } from "@/data/locations";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { resolveContactInfo } from "@/lib/contact-info";
import { prisma } from "@/lib/db";

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
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">Каталог</h3>
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
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">Компания</h3>
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
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">Кухни по городам</h3>
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
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/90">Правовое</h3>
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
          <p className="text-sm text-white/35">
            © {new Date().getFullYear()} КухниBY. Все права защищены.
          </p>
          <p className="text-sm text-white/35">
            УНП {CONTACT_DEFAULTS.unp} | {c.address}
          </p>
        </div>
      </div>
    </footer>
  );
}
