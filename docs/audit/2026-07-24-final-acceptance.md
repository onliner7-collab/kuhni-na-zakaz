# Финальная приёмка — 24–29 июля 2026

Статус после production-проверки: `FINAL_ACCEPTED`.

Production-коммит: `437a4f0` (`work`), развёрнут на `https://kuhni.minsk.by`.

## Реализовано

- `sitemap.xml`: 112 канонических URL без дублей; для 23 доработанных страниц установлен `lastmod` `2026-07-24T19:30:00.000Z`.
- Accessibility: у вкладок удалён конфликтующий `aria-pressed`; сохранены `aria-selected`, `aria-controls`, roving `tabIndex`, стрелки, Home/End и видимый клавиатурный фокус.
- Structured data: страницы стилей и сценариев отдают отдельные `Article` и `BreadcrumbList`, соответствующие видимым хлебным крошкам.
- Performance: тяжёлая Telegram-анимация вынесена из глобального initial bundle; GA и Яндекс Метрика сохраняют очередь событий и загружаются по первому взаимодействию или через 8 секунд; LCP-изображения 23 страниц получают ранний preload; hashed Next.js assets и `/media/*` кешируются на год.
- Mobile UI: Telegram-плашка скрывается на мобильных страницах с главным визуальным explorer, нижняя навигация автоматически уходит при пересечении explorer.
- Security: добавлены HSTS, CSP, Referrer-Policy, Permissions-Policy и сохранён `X-Content-Type-Options`.

## Автоматические проверки

- `pnpm typecheck` — PASS.
- `pnpm build` — PASS, 127 маршрутов; локальная БД была выключена, сработали предусмотренные fallback-данные.
- `pnpm sitemap:check` — PASS, 112 URL.
- `pnpm images:audit` — PASS, 296 ссылок, `broken: []`, `oversized: []`, `badNames: []`.
- `pnpm seo:check` — PASS.
- Аналитика — PASS: после взаимодействия загружается по одному скрипту GA и Метрики; счётчик 109329747 отправляет `watch`, CSP-ошибок нет, события до загрузки остаются в очереди.
- Playwright final acceptance — PASS: 2/2 теста.
  - 23 страницы: смена изображения, ARIA, стрелки/Home/End, focus, скрытие dock.
  - 23 × 5 ширин: 360/390/412/768/1440.
  - На каждой странице: `200`, один H1, canonical, alt-атрибуты, отсутствие overflow и битых изображений.
  - На стилях и сценариях: валидно читаемый отдельный `BreadcrumbList`.
  - 5 защищённых страниц: `/`, `/design-proekt-kuhni`, `/locations/minskaya-oblast`, `/locations/minsk`, `/materials/furnitura`.
- Lighthouse Mobile, Chrome:
  - `/styles/neoklassika`, DevTools throttling: Performance 97, LCP 2,0 с, CLS 0, TBT 90 мс.
  - `/styles/neoklassika`, simulated: Performance 92, Accessibility 100, Best Practices 100, SEO 100, CLS 0, TBT 0 мс.
  - `/scenarios/dlya-studii`, simulated: Performance 93, Accessibility 100, Best Practices 100, SEO 100, CLS 0, TBT 0 мс.
  - production `/styles/neoklassika`: Performance 95, Accessibility 100, SEO 100, LCP 2,3 с, CLS 0, TBT 20 мс.
  - production Best Practices 79 объясняется диагностикой сторонних cookies Google/Яндекса и Chrome Issues; обязательные HSTS, CSP с `frame-ancestors`, HTTPS redirect, Referrer-Policy, Permissions-Policy и `nosniff` присутствуют.

Успешный машинный отчёт: `artifacts/final-acceptance/playwright-report.json`.
Устаревший failed-run `artifacts/visual-rescue/stage-25/playwright-report.json` и его `playwright-results` удалены; восстановление возможно повторным запуском теста.

## Production-проверка и выпуск

- Production отвечает с коммита `437a4f0`; systemd-сервис активен.
- `sitemap.xml`: 112 уникальных URL, все 112 отвечают `200`; у всех 23 доработанных страниц подтверждён новый `lastmod`.
- Production image audit: 112 HTML-страниц, 536 уникальных `/uploads` и `/images`, все отвечают `200/304`; `/kapi/watermarked-image` отвечает `200`.
- Production Playwright final acceptance: 2/2 теста, включая 23 интерактивные страницы, 115 адаптивных комбинаций и 5 защищённых страниц.
- Production analytics smoke: страница `200`, 1 запрос Google Analytics и 7 запросов Яндекс Метрики после первого взаимодействия, без CSP и page errors.
- Google Search Console: `https://kuhni.minsk.by/sitemap.xml` повторно отправлен 29 июля 2026; интерфейс подтвердил отправку, таблица содержит 112 URL.
- Яндекс Вебмастер: существующий sitemap со статусом «ок» и 112 URL отправлен на переобход 29 июля 2026; доступный лимит переобхода уменьшился с 10 до 9.
- Отправка sitemap не означает гарантированную индексацию: дальнейшую обработку выполняют поисковые системы.

## Отдельный технический долг

`/materials/furnitura` не переделывалась.

Локальный Lighthouse Mobile:

- Performance: 91.
- Общий transfer size: 525 231 байт (513 KiB).
- JavaScript transfer: 282 915 байт.
- Изображения: 88 171 байт.
- CLS: 0.
- TBT: 0 мс.
- Simulated LCP: 3,4 с.

Это отдельный performance-долг страницы и не включён в текущую визуальную доработку.

## Документация и допущения

Для реализации использована официальная документация Next.js через Context7: Next.js 15.1.8 (ближайшая доступная стабильная документация к установленной версии 15.3.9) по `headers()`, CSP, `next/script` и App Router sitemap. Использованные API совместимы с локальной сборкой Next.js 15.3.9, что подтверждено typecheck и production build.

Production-проверка, публикация и отправка sitemap завершены. Итоговый статус: `FINAL_ACCEPTED`.
