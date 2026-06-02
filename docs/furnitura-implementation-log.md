# Лог внедрения `/materials/furnitura`

Дата: 2026-06-02

## Статус этапа 2

Этап 2 выполнен локально: создан SEO-каркас страницы `/materials/furnitura`, добавлена карточка на `/materials`, URL добавлен в sitemap.

## Измененные файлы

- `artifacts/kuhni-na-zakaz/app/materials/furnitura/page.tsx`
- `artifacts/kuhni-na-zakaz/app/materials/page.tsx`
- `artifacts/kuhni-na-zakaz/app/sitemap.ts`
- `docs/seo-materials-furnitura-audit.md`
- `docs/furnitura-implementation-log.md`
- `docs/furnitura-deploy-indexing-report.md`

## Что добавлено на страницу

- Breadcrumbs: Главная / Материалы / Фурнитура.
- Hero с H1 `Фурнитура для кухни на заказ`, подзаголовком и CTA.
- Блок о важности фурнитуры при заказе кухни.
- Категории фурнитуры:
  - петли;
  - направляющие;
  - подъемные механизмы;
  - ручки, профили и кухни без ручек;
  - системы хранения;
  - доводчики;
  - угловые системы;
  - цокольная и монтажная фурнитура;
  - фурнитура для столешниц и стеновых панелей;
  - фурнитура для встроенной техники;
  - подсветка и электрофурнитура;
  - уплотнители, демпферы и заглушки.
- Сравнительная таблица по задачам кухни.
- Блок выбора фурнитуры по бюджету.
- Внутренние ссылки на материалы, цены, портфолио и 3D-проект.
- FAQ из 8 вопросов.
- Финальный CTA с формой.

## SEO

- Title: `Фурнитура для кухни на заказ в Минске | Петли, направляющие, доводчики`.
- Description добавлен в metadata.
- Canonical: `/materials/furnitura`.
- Robots: `index, follow`.
- Open Graph добавлен.
- JSON-LD:
  - `BreadcrumbList`;
  - `WebPage`;
  - `FAQPage`.
- `Product`, fake reviews и rating не добавлялись.

## Доступность и responsive

- Используются семантические `main`, `section`, `nav`, `table`, `details/summary`.
- У навигации есть `aria-label`.
- Иконки помечены `aria-hidden`.
- CTA-ссылки имеют видимый текст и focus-visible стили.
- Таблица обернута в горизонтальный контейнер для мобильных экранов.

## Проверки 2026-06-02

- `pnpm run typecheck` — успешно.
- `pnpm run sitemap:check` — успешно, но с предупреждениями Prisma из-за недоступной локальной БД `127.0.0.1:5434`; статический sitemap fallback проверен.
- `pnpm run build` — успешно. Во время сборки также были Prisma-предупреждения по локальной БД, но сборка завершилась без ошибки.
- Локальный HTTP `http://127.0.0.1:3012/materials/furnitura` — 200 OK.
- Browser desktop:
  - H1: 1;
  - canonical: `https://kuhni.minsk.by/materials/furnitura`;
  - noindex: нет;
  - горизонтального overflow нет.
- Browser mobile 390px:
  - H1: 1;
  - canonical корректный;
  - noindex: нет;
  - горизонтального overflow нет.
- `/materials` локально содержит ссылку `/materials/furnitura`.
- `/sitemap.xml` локально содержит `https://kuhni.minsk.by/materials/furnitura`.
- `/robots.txt` локально доступен и содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`.
- Commit `c23faf4 Add kitchen hardware materials page` создан и отправлен в `origin/work`.
- Production deploy выполнен через Timeweb update script.
- Production `/materials/furnitura` отвечает 200 OK.
- Production `/materials` содержит ссылку на `/materials/furnitura`.
- Production sitemap содержит `https://kuhni.minsk.by/materials/furnitura`.
- Production robots.txt доступен и не блокирует страницу.
- Google Search Console: URL отправлен на индексирование через встроенный браузер.
- Yandex Webmaster: URL отправлен в очередь переобхода через API, sitemap уже добавлен.

## Что не входит в этап 2

- Полная галерея и lightbox для фурнитуры не добавлялись: это этапы 3-4.
- Изображения фурнитуры не генерировались: это этап 3 и следующие.
- Production deploy и отправка на индексацию фиксируются отдельно после успешных проверок и доступного push/deploy.
