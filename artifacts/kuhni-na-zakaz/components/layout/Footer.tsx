import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";

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
    <footer className="mt-16" style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #1a1030 50%, #0f1525 100%)" }}>
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
              >
                <span className="text-white font-black text-sm">К</span>
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                Кухни<span style={{ background: "linear-gradient(135deg, #a78bfa, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Minsk</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-white/50 leading-relaxed">
              Кухни на заказ в Минске и Минской области. Собственное производство.
            </p>
            <div className="mt-4 space-y-2.5">
              <a href="tel:+375291234567" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone className="w-4 h-4 shrink-0 text-violet-400" />
                +375 (29) 123-45-67
              </a>
              <a href="mailto:info@kuhniminsk.by" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail className="w-4 h-4 shrink-0 text-violet-400" />
                info@kuhniminsk.by
              </a>
              <div className="flex items-start gap-2 text-sm text-white/60">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-violet-400" />
                г. Минск, ул. Притыцкого, 100
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="w-4 h-4 shrink-0 text-violet-400" />
                Пн–Сб 9:00–19:00, Вс 10:00–17:00
              </div>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="font-bold text-white/90 mb-4 text-xs uppercase tracking-widest">Каталог</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.catalog.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-white/90 mb-4 text-xs uppercase tracking-widest">О компании</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.info.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities + Legal */}
          <div>
            <h3 className="font-bold text-white/90 mb-4 text-xs uppercase tracking-widest">Города</h3>
            <ul className="space-y-2.5">
              <li><Link href="/locations/minsk" className="text-sm text-white/50 hover:text-white transition-colors">Кухни в Минске</Link></li>
              <li><Link href="/locations/minskaya-oblast" className="text-sm text-white/50 hover:text-white transition-colors">Кухни в Минской области</Link></li>
            </ul>
            <div className="mt-6">
              <h3 className="font-bold text-white/90 mb-4 text-xs uppercase tracking-widest">Правовое</h3>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} КухниMinsk. Все права защищены.
          </p>
          <p className="text-sm text-white/30">
            УНП 000000000 | г. Минск, Беларусь
          </p>
        </div>
      </div>
    </footer>
  );
}
