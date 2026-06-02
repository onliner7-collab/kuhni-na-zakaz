# Аудит проекта перед внедрением `/materials/furnitura`

Дата: 2026-06-02

## Статус этапа 1

Этап 1 выполнен. Проверена структура проекта, существующие страницы материалов, SEO-механика, sitemap, robots.txt, компоненты галерей, lightbox, CTA, FAQ и хранение изображений.

## Найденная структура проекта

- Основное приложение: `artifacts/kuhni-na-zakaz`.
- Фреймворк: Next.js App Router.
- Страницы материалов:
  - `artifacts/kuhni-na-zakaz/app/materials/page.tsx`
  - `artifacts/kuhni-na-zakaz/app/materials/mdf-fasady/page.tsx`
  - `artifacts/kuhni-na-zakaz/app/materials/ldsp/page.tsx`
  - `artifacts/kuhni-na-zakaz/app/materials/plastik-hpl/page.tsx`
  - `artifacts/kuhni-na-zakaz/app/materials/[slug]/page.tsx`

## Компоненты и паттерны

- Карточки материалов на `/materials`: массив `featuredMaterialPages` и компонент `MaterialsCardsGrid`.
- CTA и форма: `components/sections/ContactForm.tsx`.
- Галерея материалов: `components/sections/MaterialDetailGallery.tsx`.
- Lightbox: `components/ui/ImageLightbox.tsx`.
- FAQ на статических страницах материалов реализован через семантические `details/summary`.
- Хлебные крошки реализуются локально на страницах и через JSON-LD helper `breadcrumbJsonLd`.

## SEO и schema

- Metadata задается через `export const metadata: Metadata`.
- Canonical задается через `alternates: { canonical: "..." }`.
- Robots для страниц материалов задается явно как `{ index: true, follow: true }` на статических страницах.
- JSON-LD helpers: `lib/schema-org.tsx`.
- Используемые типы schema на похожих страницах: `BreadcrumbList`, `FAQPage`, `Service`, `WebPage`.
- Для `/materials/furnitura` не следует использовать `Product`, рейтинги или отзывы, так как страница является экспертным гидом, а не карточкой товара.

## Sitemap и robots.txt

- Sitemap: `artifacts/kuhni-na-zakaz/app/sitemap.ts`.
- Static URL добавляются в `STATIC_PATHS`.
- Динамические материалы дополнительно подтягиваются из `prisma.materialPage`.
- Robots: `artifacts/kuhni-na-zakaz/app/robots.ts`.
- Robots закрывает `/admin/`, `/api/`, `/kapi/`, `/search/`, `/thanks/`, но не блокирует `/materials`.
- `robots.ts` указывает sitemap: `https://kuhni.minsk.by/sitemap.xml`.

## Изображения

- Публичные изображения сайта лежат в `artifacts/kuhni-na-zakaz/public`.
- Материалы и галереи используют:
  - `public/uploads/seo-showcase`
  - `public/images/materials-gallery-v2`
  - `public/images/blog`
- Для следующих этапов с изображениями нужно соблюдать правило ТЗ: отдельные изображения 16:9, `.webp` или `.avif`, уникальные русские alt и без текста внутри изображения.

## Deploy

- Production: `https://kuhni.minsk.by`.
- Инструкция: `deploy/timeweb/README.md`.
- Скрипт обновления production: `deploy/scripts/update-production.sh`.
- Активная production-ветка по документации: `work`.
- Деплой требует push в `origin/work`, SSH на сервер и запуск `bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work`.

## Вывод для этапа 2

- Новую страницу лучше делать статической: `app/materials/furnitura/page.tsx`.
- Нужно переиспользовать существующие классы `section-padding`, `container-site`, `card-base`, `ContactForm`, `JsonLd`, `breadcrumbJsonLd`, `faqJsonLd`.
- Нужно добавить карточку на `/materials`.
- Нужно добавить `/materials/furnitura` в `STATIC_PATHS` sitemap.
