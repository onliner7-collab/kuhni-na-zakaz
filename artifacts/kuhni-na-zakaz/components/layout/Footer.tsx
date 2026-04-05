import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

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

export function Footer() {
  return (
    <footer className="bg-foreground text-background/90 mt-16">
      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-xl font-semibold text-background">
              КухниMinsk
            </Link>
            <p className="mt-3 text-sm text-background/70 leading-relaxed">
              Кухни на заказ в Минске и Минской области. Собственное производство.
            </p>
            <div className="mt-4 space-y-2">
              <a href="tel:+375291234567" className="flex items-center gap-2 text-sm hover:text-background transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                +375 (29) 123-45-67
              </a>
              <a href="mailto:info@kuhniminsk.by" className="flex items-center gap-2 text-sm hover:text-background transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                info@kuhniminsk.by
              </a>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                г. Минск, ул. Притыцкого, 100
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 shrink-0" />
                Пн–Сб 9:00–19:00, Вс 10:00–17:00
              </div>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="font-semibold text-background mb-4 text-sm uppercase tracking-wide">Каталог</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.catalog.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-background mb-4 text-sm uppercase tracking-wide">О компании</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.info.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="font-semibold text-background mb-4 text-sm uppercase tracking-wide">Города</h3>
            <ul className="space-y-2">
              <li><Link href="/locations/minsk" className="text-sm text-background/70 hover:text-background transition-colors">Кухни в Минске</Link></li>
              <li><Link href="/locations/minskaya-oblast" className="text-sm text-background/70 hover:text-background transition-colors">Кухни в Минской области</Link></li>
            </ul>
            <div className="mt-6">
              <h3 className="font-semibold text-background mb-4 text-sm uppercase tracking-wide">Правовое</h3>
              <ul className="space-y-2">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} КухниMinsk. Все права защищены.
          </p>
          <p className="text-sm text-background/50">
            УНП 000000000 | г. Минск, Беларусь
          </p>
        </div>
      </div>
    </footer>
  );
}
