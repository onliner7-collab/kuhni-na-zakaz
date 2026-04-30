# SEO-аудит портфолио и смежных разделов

Дата аудита: 2026-04-30.

## 1. Текущая архитектура

Проект устроен как pnpm workspace. Основное публичное приложение находится в `artifacts/kuhni-na-zakaz`.

Стек основного приложения:

- Next.js 15.3.3 с App Router.
- React 19.1.0.
- TypeScript 5.9.
- Tailwind CSS 4.
- Prisma 6 и PostgreSQL.
- `next/image` используется для оптимизации изображений.
- Есть legacy React/Vite-слой в `src/legacy-pages` и `src/components/ui`, но текущая публичная маршрутизация работает через `app`.

Маршрутизация:

- Страницы: `artifacts/kuhni-na-zakaz/app/**/page.tsx`.
- API: `artifacts/kuhni-na-zakaz/app/kapi/**/route.ts`.
- Динамические страницы: `app/portfolio/[slug]/page.tsx`, `app/locations/[city]/page.tsx`, `app/catalog/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/styles/[slug]/page.tsx`, `app/materials/[slug]/page.tsx`, `app/scenarios/[slug]/page.tsx`.
- Middleware: `artifacts/kuhni-na-zakaz/middleware.ts`. Он отвечает за admin-guard, noindex headers для закрытых путей, канонический хост и legacy-редиректы.
- Redirect в `next.config.ts`: `/configurator` -> `/kitchen-configurator`.

Данные:

- Основной источник данных: Prisma-модели в `artifacts/kuhni-na-zakaz/prisma/schema.prisma`.
- Города: модель `LocationPage`, seed `prisma/seed-locations.ts`, админка `app/admin/locations/**`, API `app/kapi/admin/locations/**`.
- Портфолио: модель `PortfolioCase`, админка `app/admin/portfolio/**`, API `app/kapi/admin/portfolio/**`, изображения в `public/uploads/portfolio`, `public/uploads/kitchens/portfolio`, `public/uploads/seo-showcase`.
- Цены: модель `PriceRule` для формулы калькулятора; страница `/prices` содержит редакционные статические сегменты `SEGMENTS` и `EXTRA_WORKS`; админка цен `app/admin/prices/page.tsx`; API `app/kapi/admin/prices/**` и `app/kapi/calculator/route.ts`.
- Отзывы: модель `Review`, публичная страница `app/reviews/page.tsx`, форма `components/sections/ReviewForm.tsx`, админка `app/admin/reviews/page.tsx`, API `app/kapi/reviews/route.ts` и `app/kapi/admin/reviews/**`.
- Общие настройки контактов: модель `SiteSettings`, fallback `lib/contact-defaults.ts`.
- Legacy-статические данные: `src/lib/data.ts`. Их нельзя считать главным источником текущих публичных страниц App Router, но файл может использоваться legacy-компонентами.

SEO:

- Базовые meta задаются в `app/layout.tsx` через `export const metadata`.
- Статические страницы используют `export const metadata` в своих `page.tsx`.
- Динамические страницы используют `generateMetadata`, например `app/portfolio/[slug]/page.tsx` и `app/locations/[city]/page.tsx`.
- Очистка title и обрезка description находятся в `lib/seo.ts`: `cleanSeoTitle`, `trimMetaDescription`.
- JSON-LD генерируется через `lib/schema-org.tsx`: `JsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `offerJsonLd`.
- Sitemap генерируется в `app/sitemap.ts`, robots в `app/robots.ts`.
- Дополнительно есть статический `public/sitemap-static.xml`, но основная Next.js sitemap доступна как `/sitemap.xml`.

Компоненты:

- Карточки UI: `components/ui/card.tsx`, `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/textarea.tsx`, `components/ui/FavoriteButton.tsx`.
- Карточки портфолио сейчас собраны внутри `components/portfolio/PortfolioFilters.tsx` и частично inline в `app/portfolio/[slug]/page.tsx`, `app/locations/[city]/page.tsx`, `app/page.tsx`.
- Формы: `components/sections/ContactForm.tsx`, `components/sections/ReviewForm.tsx`, `components/sections/PriceQuiz.tsx`, `components/calculator/CalculatorWizard.tsx`.
- Галереи: отдельного компонента `Gallery`/`Lightbox` в текущем App Router-слое не найдено. Галереи сделаны inline сетками с `next/image` на страницах портфолио и городов.
- Breadcrumbs: отдельного актуального компонента в `components` не найдено. Хлебные крошки в публичных страницах сверстаны inline через `<nav>`. В legacy UI есть `src/components/ui/breadcrumb.tsx`, но он не подключен к текущим App Router-страницам.
- SEO-компонент: отдельного визуального `SEO`-компонента нет; используются Next Metadata API и `JsonLd`.

Изображения:

- Используется `next/image` на главной, в портфолио, городах, каталоге, материалах, стилях и других страницах.
- Lazy loading есть: многие изображения указаны с `loading="lazy"`. Hero/главные изображения используют `priority` и `fetchPriority="high"`, где это уместно.
- Дополнительная простая оптимизация путей есть в `lib/image-optimization.ts`: PNG из `/uploads/seo-showcase/` и `/images/` переписываются на `.webp`.
- Next image config находится в `next.config.ts`: включены AVIF/WebP, cache TTL, размеры устройств, remote patterns.
- Есть скрипт `images:optimize` (`scripts/optimize-site-images.js`).

## 2. Файлы, отвечающие за portfolio

- `artifacts/kuhni-na-zakaz/app/portfolio/page.tsx` - индекс портфолио `/portfolio`, загрузка опубликованных `PortfolioCase`, meta, JSON-LD CollectionPage, inline breadcrumbs, форма заявки.
- `artifacts/kuhni-na-zakaz/app/portfolio/[slug]/page.tsx` - карточка проекта `/portfolio/{slug}`, `generateMetadata`, загрузка кейса, связанного стиля, материалов, сценариев, отзывов, города, фото и похожих проектов.
- `artifacts/kuhni-na-zakaz/components/portfolio/PortfolioFilters.tsx` - клиентская фильтрация и карточки портфолио на индексной странице.
- `artifacts/kuhni-na-zakaz/components/ui/FavoriteButton.tsx` - избранное для кейсов.
- `artifacts/kuhni-na-zakaz/prisma/schema.prisma` - модель `PortfolioCase` и связанные поля `styleSlug`, `materialSlugs`, `scenarioSlugs`, `reviewIds`, `images`, `photosBefore`, `photosAfter`, `seoTitle`, `seoDescription`.
- `artifacts/kuhni-na-zakaz/app/admin/portfolio/**` - админские страницы портфолио.
- `artifacts/kuhni-na-zakaz/components/admin/PortfolioCaseForm.tsx` - форма редактирования кейса.
- `artifacts/kuhni-na-zakaz/app/kapi/admin/portfolio/**` - API админки портфолио.
- `artifacts/kuhni-na-zakaz/app/sitemap.ts` - добавляет `/portfolio/{slug}` для опубликованных кейсов.
- Изображения: `artifacts/kuhni-na-zakaz/public/uploads/portfolio`, `public/uploads/kitchens/portfolio`, `public/uploads/seo-showcase`.

## 3. Файлы, отвечающие за locations

- `artifacts/kuhni-na-zakaz/app/locations/page.tsx` - индекс городов `/locations`, загрузка опубликованных `LocationPage`, meta, JSON-LD CollectionPage, inline breadcrumbs, форма заявки.
- `artifacts/kuhni-na-zakaz/app/locations/[city]/page.tsx` - городская страница `/locations/{city}`, `generateMetadata`, fallback для основных городов, локальный контент, связанные кейсы и отзывы, галерея, FAQ, CTA.
- `artifacts/kuhni-na-zakaz/prisma/schema.prisma` - модель `LocationPage`: slug, city, region, title/h1/intro/description, prices, delivery, images, areas, mapEmbed, features, faq, uniquePoints, contentBlocks, caseSlugs, reviewIds, SEO-поля.
- `artifacts/kuhni-na-zakaz/prisma/seed-locations.ts` - начальные данные городов.
- `artifacts/kuhni-na-zakaz/app/admin/locations/**` - админские страницы городов.
- `artifacts/kuhni-na-zakaz/components/admin/LocationForm.tsx` - форма города.
- `artifacts/kuhni-na-zakaz/app/kapi/admin/locations/**` - API админки городов.
- `artifacts/kuhni-na-zakaz/app/sitemap.ts` - добавляет `/locations/{slug}` для опубликованных городов.

## 4. Что нужно для следующих этапов

- Не создавать новые публичные страницы и не менять существующие URL без отдельного плана редиректов.
- Перед SEO-доработками нормализовать кодировку русских строк в исходниках: в PowerShell вывод сейчас выглядит как mojibake, но публичные тексты менять без проверки нельзя.
- Вынести повторяющиеся inline breadcrumbs в общий компонент только после проверки, что это не изменит визуальный дизайн. Можно переиспользовать подход из `src/components/ui/breadcrumb.tsx`, но лучше создать адаптацию в актуальном `components/ui` или `components/layout`.
- Если понадобится галерея или lightbox, сначала добавить общий компонент без изменения текущей сетки и подключать постепенно. Сейчас lightbox отсутствует.
- Для портфолио не переписывать модель и страницу целиком: безопаснее дорабатывать `PortfolioFilters`, `generateMetadata`, JSON-LD и мелкие блоки карточки проекта.
- Для городов сохранять текущие slug из `LocationPage.slug` и fallback-slug в `app/locations/[city]/page.tsx`.
- Для цен учитывать двойную природу данных: маркетинговые сегменты в `/prices` статические, а расчет калькулятора идет через `PriceRule` и `/kapi/calculator`.
- При добавлении новых SEO-данных обновлять sitemap только через существующий `app/sitemap.ts`.
- Для изображений продолжать использовать `next/image`, `optimizedImageSrc`, существующие `/uploads/**` пути и не переносить файлы без миграции ссылок в БД.

## 5. Риски

- В `next.config.ts` стоит `typescript.ignoreBuildErrors: true`, поэтому `next build` может пройти при ошибках TypeScript. Обязателен отдельный `pnpm run typecheck`.
- Публичные страницы зависят от базы данных; при недоступной `DATABASE_URL` часть страниц вернет fallback или пустые списки.
- Есть смешение актуального App Router-кода и legacy `src/legacy-pages`; нельзя удалять legacy-файлы без отдельной проверки зависимостей.
- Breadcrumbs и галереи сейчас дублируются inline, поэтому точечные SEO-правки могут разъехаться между страницами.
- Портфолио и города связаны через строки (`slug`, `city`, массивы `caseSlugs`, `reviewIds`), поэтому переименование slug/city может сломать связи.
- Middleware содержит legacy-редиректы и канонизацию хоста; изменения в маршрутах могут неожиданно повлиять на SEO и индексацию.
- Есть отдельный `public/sitemap-static.xml`, который может устаревать относительно динамического `/sitemap.xml`.

## 6. URL, которые нельзя сломать

Основные публичные URL:

- `/`
- `/portfolio`
- `/portfolio/{slug}`
- `/locations`
- `/locations/{city}`
- `/prices`
- `/calculator`
- `/contacts`
- `/contacts#form`
- `/catalog`
- `/catalog/{slug}`
- `/blog`
- `/blog/{slug}`
- `/reviews`
- `/styles`
- `/styles/{slug}`
- `/materials`
- `/materials/{slug}`
- `/scenarios`
- `/scenarios/{slug}`
- `/delivery-installation`
- `/warranty`
- `/about`
- `/privacy-policy`
- `/personal-data`
- `/terms`
- `/thanks`
- `/sitemap.xml`
- `/robots.txt`

Legacy-URL из `middleware.ts`, которые сейчас редиректят и тоже нельзя ломать:

- `/kuhni` -> `/catalog`
- `/katalog` -> `/catalog`
- `/catalog.html` -> `/catalog`
- `/portfolio.html` -> `/portfolio`
- `/ceny` -> `/prices`
- `/price` -> `/prices`
- `/prices.html` -> `/prices`
- `/kontakty` -> `/contacts`
- `/contacts.html` -> `/contacts`
- `/blog.html` -> `/blog`
- `/catalog/kuhnya-bez-ruchek` -> `/catalog/kuhni-bez-ruchek`
- `/catalog/kuhnya-bez-ruchek-minsk` -> `/catalog/kuhni-bez-ruchek`
- `/catalog/kuhnya-do-potolka` -> `/catalog/kuhni-do-potolka`
- `/catalog/kuhnya-do-potolka-minsk` -> `/catalog/kuhni-do-potolka`
- `/catalog/malenkaya-kuhnya` -> `/catalog/malenkie-kuhni`
- `/catalog/malenkaya-kuhnya-minsk` -> `/catalog/malenkie-kuhni`
- `/catalog/pryamaya-kuhnya` -> `/catalog/pryamye-kuhni`
- `/catalog/pryamaya-kuhnya-minsk` -> `/catalog/pryamye-kuhni`
- `/catalog/uglovaya-kuhnya` -> `/catalog/uglovye-kuhni`
- `/catalog/uglovaya-kuhnya-minsk` -> `/catalog/uglovye-kuhni`
- `/catalog/p-obraznaya-kuhnya` -> `/catalog/p-obraznye-kuhni`
- `/catalog/p-obraznaya-kuhnya-minsk` -> `/catalog/p-obraznye-kuhni`
- `/catalog/kuhnya-s-ostrovom-minsk` -> `/catalog/kuhni-s-ostrovom`
- `/catalog/kuhnya-dlya-studii-minsk` -> `/catalog/malenkie-kuhni`

Внутренние URL, которые не должны попасть в индекс, но должны продолжать работать:

- `/admin/**`
- `/kapi/**`
- `/api/**`
- `/search/**`
