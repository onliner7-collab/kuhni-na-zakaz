import { Phone } from "lucide-react";

import Link from "@/components/navigation/Link";
import { PhoneReveal } from "@/components/layout/PhoneReveal";
import { CONTACT_DEFAULTS } from "@/lib/contact-defaults";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

const primaryLinks = [
  ["/catalog", "Каталог"],
  ["/styles", "Стили"],
  ["/materials", "Материалы"],
  ["/materials/furnitura", "Фурнитура"],
  ["/portfolio", "Портфолио"],
  ["/design-proekt-kuhni", "3D-проект кухни"],
  ["/calculator", "Калькулятор"],
  ["/prices", "Цены"],
  ["/blog", "Блог"],
] as const;

const secondaryLinks = [
  ["/about", "О нас"],
  ["/contacts", "Контакты"],
  ["/reviews", "Отзывы"],
  ["/delivery-installation", "Доставка и монтаж"],
  ["/warranty", "Гарантия"],
] as const;

export function Header({
  phone,
  phoneHref,
}: {
  phone?: string;
  phoneHref?: string;
}) {
  const phoneDisplay = phone || CONTACT_DEFAULTS.phoneDisplay;
  const phoneLink = phoneHref || `tel:${CONTACT_DEFAULTS.phone}`;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/96 text-foreground backdrop-blur-xl">
      <div className="container-site">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-3 py-3 lg:min-h-20 lg:py-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            aria-label="КухниBY — производитель кухонь на заказ в Беларуси"
          >
            <span aria-hidden="true">
              <span className="block text-xl font-black tracking-tight sm:text-2xl">
                Кухни<span className="text-gradient">BY</span>
              </span>
              <span className="hidden text-xs text-muted-foreground lg:block">
                Кухни на заказ по Беларуси с замером и проектом
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 lg:flex">
            <PhoneReveal
              phone={phoneDisplay}
              phoneHref={phoneLink}
              source="header"
            />
            <Link
              href="/contacts#form"
              className="btn-primary text-sm"
              data-testid="header-cta"
            >
              Согласовать замер
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={phoneLink}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-primary"
              aria-label={phoneDisplay}
            >
              <Phone className="h-4 w-4" aria-hidden />
            </a>
            <MobileNavigation primaryLinks={primaryLinks} secondaryLinks={secondaryLinks} />
          </div>
        </div>

        <div className="hidden min-h-14 items-center justify-between gap-6 border-t border-border/70 lg:flex">
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2" aria-label="Основная навигация">
            {primaryLinks.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
          <nav className="flex items-center gap-1 py-2" aria-label="Дополнительная навигация">
            {secondaryLinks.slice(0, 2).map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
