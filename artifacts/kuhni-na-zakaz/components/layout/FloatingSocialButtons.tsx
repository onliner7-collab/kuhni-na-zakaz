import { Instagram } from "lucide-react";

import { buildInstagramHref, buildTelegramHref } from "@/lib/social-links";

// Плавающие кнопки соцсетей, показываются на всех публичных страницах
// (подключаются в app/layout.tsx только когда !isAdmin).
//
// Контракт:
// - Если обе ссылки пустые/невалидные — компонент возвращает null и не
//   занимает место в DOM.
// - Каждая ссылка нормализуется в полный https-URL независимо от того,
//   как админ ввёл значение в /admin/contacts (полный URL, t.me/handle,
//   @handle или просто username) — нормализация вынесена в lib/social-links.
// - Если ввели что-то совсем странное (например, телефон) — кнопка для
//   этой соцсети не показывается.
//
// Расположение:
// - Mobile: bottom-24, чтобы не перекрывать MobileCTA (bottom-0, ~64px
//   высоты + safe-area).
// - Desktop (>= lg): bottom-6, MobileCTA на этом размере скрыт.
// - z-40 — ниже MobileCTA (z-50), но выше обычного контента/тостов.

interface FloatingSocialButtonsProps {
  instagram?: string | null;
  telegram?: string | null;
}

const TELEGRAM_BLUE = "#229ED9";
const INSTAGRAM_GRADIENT =
  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

function TelegramIcon({ className }: { className?: string }) {
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

export function FloatingSocialButtons({
  instagram,
  telegram,
}: FloatingSocialButtonsProps) {
  const telegramHref = buildTelegramHref(telegram);
  const instagramHref = buildInstagramHref(instagram);

  if (!telegramHref && !instagramHref) return null;

  const baseClasses =
    "inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/15 ring-1 ring-black/5 transition-transform duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none motion-reduce:hover:scale-100";

  return (
    <nav
      aria-label="Связаться в мессенджерах"
      className="fixed right-4 bottom-24 z-40 flex flex-col gap-3 lg:right-5 lg:bottom-6"
      data-testid="floating-social-buttons"
    >
      {telegramHref && (
        <a
          href={telegramHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Написать в Telegram"
          data-testid="floating-social-telegram"
          className={`${baseClasses} focus-visible:ring-sky-400`}
          style={{ backgroundColor: TELEGRAM_BLUE }}
        >
          <TelegramIcon className="h-6 w-6" />
        </a>
      )}
      {instagramHref && (
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть Instagram"
          data-testid="floating-social-instagram"
          className={`${baseClasses} focus-visible:ring-pink-500`}
          style={{ background: INSTAGRAM_GRADIENT }}
        >
          <Instagram className="h-6 w-6" aria-hidden="true" />
        </a>
      )}
    </nav>
  );
}
