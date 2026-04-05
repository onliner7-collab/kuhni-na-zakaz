# Changelog — КухниBY

## [Unreleased] — 2026-04-05 (ScenarioPage system)

### Added
- **Prisma model `ScenarioPage`** — 20+ fields: slug, icon, badge, title, headline, intro, needs[], solutions[], features (JSON), tips[], relatedStyles[], relatedMaterials[], relatedCaseSlugs[], SEO fields (seoTitle, seoDescription, seoKeywords), ctaText, ctaHref, order, published, timestamps
- **6 unique scenarios seeded** with full content (not clones):
  - `semya-s-detmi` — Кухня для семьи с детьми (badge: Популярный)
  - `malenkaya-kukhnya` — Маленькая кухня 5–8 м² (badge: Запрос №1)
  - `kukhnya-gostinaya` — Кухня-гостиная (открытое пространство)
  - `lyublyu-gotovit` — Кухня для тех, кто любит готовить (badge: Для гурмана)
  - `bez-pereplaty` — Кухня без переплаты (badge: Выгодно)
  - `maksimum-khraneniya` — Хочу максимум хранения
- **API routes** — `/kapi/admin/scenarios` (GET/POST) + `/kapi/admin/scenarios/[id]` (GET/PUT/DELETE)
- **Admin pages**:
  - `/admin/scenarios` — список с таблицей (эмодзи, badge, URL, связи, статус)
  - `/admin/scenarios/new` — создание сценария
  - `/admin/scenarios/[id]` — редактирование с 4 вкладками
- **ScenarioForm component** (`components/admin/ScenarioForm.tsx`) — 4-вкладочная форма:
  - Вкладка «Основное»: slug, icon, badge, title, headline, intro, CTA, порядок
  - Вкладка «Контент»: потребности (needs), решения (solutions), особенности (features), советы (tips) — все динамические списки с +/−
  - Вкладка «Связи»: relatedStyles[], relatedMaterials[], relatedCaseSlugs[]
  - Вкладка «SEO»: seoTitle, seoDescription, seoKeywords + превью в поиске
- **Публичные страницы**:
  - `/scenarios` — index с 6 карточками, JSON-LD ItemList, breadcrumb
  - `/scenarios/[slug]` — полноценная страница (hero + needs/solutions + features + related cases/styles/materials + tips + other scenarios + ContactForm), JSON-LD Article + BreadcrumbList
- **AdminSidebar** — добавлен пункт «Сценарии выбора» с иконкой Route

## [Unreleased] — 2026-04-05

### Added
- **HomepageBlock system** — Prisma model + 21 DB-seeded blocks (5 scenarios, 6 steps, 6 advantages, 4 trust items)
- **Admin: Главная страница** (`/admin/homepage`) — full CRUD, publish/hide toggle, filter by type, stats
- **API routes** — `/kapi/admin/homepage` (GET/POST) + `/kapi/admin/homepage/[id]` (PUT/DELETE)
- **New homepage** (`app/page.tsx`) — fully DB-driven with SSR fallbacks, JSON-LD, all-Belarus positioning
  - Hero: deep purple gradient, animated trust badges
  - "С чего хотите начать?" — 5 scenario cards from DB
  - Trust stats strip (4 counters from DB)
  - Portfolio preview (3 most recent cases)
  - Catalog (7 kitchens or 6 static category cards)
  - "Как проходит заказ" — 6 steps from DB on dark background
  - "Почему выбирают нас" — 6 advantage cards from DB
  - Guarantees section (Shield, Clock, FileCheck, MapPin)
  - Reviews grid (4 most recent PUBLISHED reviews)
  - FAQ section
  - CTA banner + ContactForm
- **AdminSidebar** — "Главная страница" link (Home icon) added to Структура group

### Fixed
- `ReviewStatus.APPROVED` → `ReviewStatus.PUBLISHED` in `/locations/[city]/page.tsx` (bug: reviews never showed on city pages)
- Catalog meta title: "в Минске" → "по Беларуси"
- Reviews meta title: "в Минске" → "по всей Беларуси"
- Portfolio meta description: Минск → вся Беларусь

---

## 2026-04-04

### Added
- **LocationPage system** — 15+ Prisma fields, CRUD admin (5-tab LocationForm), public `/locations/[city]` pages
- Prisma schema extended: `HomepageBlock` model added
- 3 LocationPages seeded: Минск, Минская область, Борисов
- JSON-LD on location pages: LocalBusiness + FAQPage + BreadcrumbList

### Fixed
- ReviewStatus enum — standardised to PUBLISHED across all pages

---

## Earlier milestones

- Telegram webhook for leads → `/kapi/leads`
- KitchenForm with city prop and honeypot
- Dynamic Header/Footer from DB (SiteSettings)
- Admin roles: SUPER_ADMIN, MANAGER, GUEST
- Guest temporary access with token + expiry
- Review moderation (NEW → PENDING → PUBLISHED / REJECTED)
- Activity log for admin actions
- SEO: sitemap.xml, robots.txt, JSON-LD, BreadcrumbList
- All public pages: catalog, portfolio, reviews, blog, prices, contacts, warranty, etc.
