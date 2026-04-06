# Handoff — КухниBY

## Project overview

**КухниBY** — commercial kitchen sales website for Belarus.  
Stack: **Next.js 15.3.3 App Router** + PostgreSQL + Prisma + Tailwind + Sonner.

---

## Completed Stages

| Этап | Статус | Описание |
|---|---|---|
| Этап 1 | ✅ Done | HomepageBlock — DB-driven homepage, admin page, API routes |
| Этап 2 | ✅ Done | ScenarioPage — 6 сценариев, admin CRUD 4-tab form, public /scenarios |
| Этап 3 | ✅ Done | StylePage + MaterialPage — расширены схемы (+12 полей каждая), 5+5 записей посеяно, admin CRUD + forms, полные SEO-посадочные, internal linking |
| Этап 4 | ✅ Done | PortfolioCase — расширена схема (+15 полей), 6 кейсов посеяно, 4-tab admin form, /portfolio (Server Component + client filters), /portfolio/[slug] (полный кейс-стади + история + до/после + отзывы + internal links + sidebar), JSON-LD Article |
| Этап 5 | ✅ Done | PriceRule — 34 правила в 8 категориях, /kapi/calculator (POST) с полной формулой, PriceRulesEditor (bulk inline CRUD), /admin/prices DB-driven, /calculator (8-шаговый wizard SSR+CSR) |
| Этап 6 | ✅ Done | Конфигуратор — ConfigStep/ConfigOption/ConfigResult (3 модели), 8 шагов + 32 варианта с тег-системой, /configure (8-шаговый wizard), /configure/result (SSR рекомендации из БД), /admin/configurator (полный CRUD), тег-маппинг на StylePage/MaterialPage/PortfolioCase |
| Этап 7 | ✅ Done | Система отзывов расширена — 5 новых полей (region/source/sourceUrl/featured/managerNote), 4-tab модерация, SourceBadge, связь с кейсом caseSlug, полный workflow NEW→PENDING→PUBLISHED/REJECTED |
| Этап 8 | ✅ Done | LocationPage — 7 новых полей (localIntro/uniquePoints/contentBlocks/caseSlugs/reviewIds/ctaHeadline/ctaSubtext), публичная страница полностью переработана, LocationForm расширена (вкладки «Связи», расширенный «Контент», CTA в «Основном»), DB seed Минск + Минская обл. |
| Этап 9 | ✅ Done | Smart cross-linking — BlogPost (+3 поля), StylePage/MaterialPage/ScenarioPage показывают связанные кейсы, PortfolioCase авто-находит LocationPage по городу, BlogPost публичная страница с 3 секциями related-контента, BlogPostForm панель «Связанный контент», auto-seed cross-links через prisma node-script |
| Этап 10 | ✅ Done | Персонализация — Lead (+8 полей), SavedConfig, FavoriteCase (новые модели); usePersonalization hook; FavoriteButton на портфолио; ConfigResultActions (save/send на просчёт); SavedConfigBanner; admin/leads полный перепис с статусами/заметками/config-данными; admin/saved-configs; LeadStatusControl/LeadNoteEditor |
| Admin UX audit | ✅ Done | FAQ admin CRUD (/admin/faq + API), LeadAssignedEditor (назначение менеджера), поиск заявок, Dashboard новые заявки; tech debt задокументирован |
| Security & Cleanup | ✅ Done | `lib/auth.ts` — убран fallback secret, throw если SESSION_SECRET не задан; `.next/` удалён из git-индекса; `.gitignore` расширен; `asChild` bug fixed в Button |
| Brand & positioning cleanup | ✅ Done | Убраны минские fallback-домены из metadataBase/OG/Footer email. Статические страницы: "КухниMinsk" → "КухниBY", email → kuhniby.by, metadata о Беларуси. Локальные city-страницы не тронуты. |
| Этап 3 (Contacts DB) | ✅ Done | `/contacts` конвертирован в async Server Component, читает phone/email/address/workingHours из SiteSettings (id=1) с fallback. Schema default email исправлен. |

---

## Key access

| What | Value |
|---|---|
| Admin URL | `/admin/login` |
| Admin login | `admin` |
| Admin password | `admin` |
| Git remote | `origin` = `onliner7-collab/kuhni-na-zakaz.git` |
| Git branch | `work` |

---

## Architecture notes

### Routing
- Express (api-server artifact) intercepts all `/api/*` routes
- **Next.js internal API routes MUST use `/kapi/` prefix** to avoid Express conflict
- Public site at `/`, admin at `/admin/*`

### Auth
- JWT stored in `kuhni_session` cookie (HttpOnly, Secure in production)
- Roles: `SUPER_ADMIN`, `MANAGER`, `GUEST`
- Guest access: timed token with whitelisted sections, stored in `GuestAccess` table
- Middleware: `middleware.ts` protects `/admin/*` — redirects unauthenticated to `/admin/login`
- **`lib/auth.ts`**: `SESSION_SECRET` is required at startup — throws `Error` if missing. No fallback. Set via Replit Secrets.
- Login flow: `POST /kapi/auth/login` → bcrypt verify → JWT cookie. Logout: `POST /kapi/auth/logout` → clear cookie.
- **⚠️ Do not add** `SESSION_SECRET` fallback back — this is intentional security hardening.

### Design tokens
- Primary: `hsl(263, 85%, 62%)` (violet)
- Font: Manrope 800 for headings
- Hero gradient: `linear-gradient(135deg, #1a0533, #2d1060, #0f1a3d)`
- Dark steps section: `linear-gradient(160deg, #0f0f1a, #1a1030, #0c1a30)`

### ReviewStatus enum
`NEW → PENDING → PUBLISHED | REJECTED | DELETED`  
⚠️ Always use `ReviewStatus.PUBLISHED` — **NOT** `ReviewStatus.APPROVED` (doesn't exist)

---

## Database models

| Model | Purpose |
|---|---|
| `Kitchen` | Catalog items |
| `PortfolioCase` | Completed project gallery |
| `Review` | Customer reviews with status moderation |
| `BlogPost` | Articles |
| `PriceRow` | Price table entries |
| `FAQItem` | FAQ items (page-scoped) |
| `LocationPage` | City/region SEO pages |
| `HomepageBlock` | Homepage editable blocks (scenario/step/advantage/trust) |
| `ScenarioPage` | Scenario pages with needs, solutions, features, tips, related entities |
| `SiteSettings` | Global settings: phone, email, address, socials (id=1) |
| `Lead` | Form submissions |
| `User` | Admin users |
| `GuestAccess` | Temporary admin tokens |
| `ActivityLog` | Admin action audit trail |

---

## Admin pages

| URL | Purpose | Кто может |
|---|---|---|
| `/admin/dashboard` | Stats + recent activity | SUPER_ADMIN, MANAGER |
| `/admin/homepage` | Edit HomepageBlocks (сценарии, преимущества, шаги, доверие) | SUPER_ADMIN, MANAGER |
| `/admin/kitchens` | Kitchen catalog CRUD | SUPER_ADMIN, MANAGER |
| `/admin/portfolio` | Portfolio cases CRUD (опубликовать/скрыть, featured, order) | SUPER_ADMIN, MANAGER |
| `/admin/reviews` | Review moderation (NEW→PENDING→PUBLISHED/REJECTED) | SUPER_ADMIN, MANAGER |
| `/admin/blog` | Blog posts CRUD (draft/published, publishedAt) | SUPER_ADMIN, MANAGER |
| `/admin/prices` | Price table CRUD (34 правила, inline bulk-edit) | SUPER_ADMIN, MANAGER |
| `/admin/configurator` | Конфигуратор — шаги + варианты CRUD | SUPER_ADMIN, MANAGER |
| `/admin/scenarios` | Сценарии выбора кухни CRUD | SUPER_ADMIN, MANAGER |
| `/admin/styles` | Стили кухонь CRUD | SUPER_ADMIN, MANAGER |
| `/admin/materials` | Материалы фасадов CRUD | SUPER_ADMIN, MANAGER |
| `/admin/faq` | FAQ вопросы и ответы — добавить/редактировать/удалить/сортировать по страницам | SUPER_ADMIN, MANAGER |
| `/admin/locations` | City SEO pages CRUD | SUPER_ADMIN, MANAGER |
| `/admin/leads` | Заявки — статус, назначение менеджера, заметки, поиск | SUPER_ADMIN, MANAGER |
| `/admin/saved-configs` | Сохранённые подборы клиентов (read-only) | SUPER_ADMIN, MANAGER |
| `/admin/contacts` | Edit SiteSettings (phone, address, socials) | SUPER_ADMIN |
| `/admin/notifications` | Telegram webhook config | SUPER_ADMIN |
| `/admin/settings` | Site-wide settings | SUPER_ADMIN |
| `/admin/users` | User management | SUPER_ADMIN |
| `/admin/guest-access` | Temp access tokens | SUPER_ADMIN |
| `/admin/activity-log` | Audit trail | SUPER_ADMIN, MANAGER |

---

## Технический долг (hardcoded content)

Следующий контент **захардкожен в JSX-файлах** и не редактируется из admin-панели без правки кода. Задокументировано для следующего этапа:

| Страница | Файл | Что захардкожено |
|---|---|---|
| `/about` | `app/about/page.tsx` | Весь текст О компании, история, команда, ценности |
| `/delivery-installation` | `app/delivery-installation/page.tsx` | Условия и сроки доставки, зоны, цены на доставку |
| `/warranty` | `app/warranty/page.tsx` | Условия гарантии, сроки, контакты сервиса |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Текст политики конфиденциальности |
| `/terms` | `app/terms/page.tsx` | Текст условий использования |
| `/personal-data` | `app/personal-data/page.tsx` | Согласие на обработку персональных данных |

**Рекомендация**: добавить Prisma-модель `StaticPage { slug, title, content, updatedAt }`, admin CRUD страницу `/admin/static-pages`, и публичные страницы читать из БД вместо JSX. Объём работы: ~1 день.

---

## Pending / Next tasks

1. **Images** — upload system via object storage or S3; currently only URL fields in DB
2. **Blog** ✅ DONE — 6 posts seeded (seed-blog.ts), article renderer uses renderContent (bold + lists)
3. **Prices page** ✅ DONE — PriceQuiz теперь вызывает `/kapi/calculator` (DB-driven). Metadata исправлен (Беларусь). SEGMENTS и EXTRA_WORKS — задокументированный static fallback (нет PriceSegment в БД).
4. **Regional pages** ✅ DONE — 10 LocationPages total: all 6 oblast capitals + Борисов, Жодино, Молодечно
5. **Email notifications** — currently only Telegram; consider adding email for leads
6. **Production deployment** — run `npx prisma migrate deploy` in production. `SESSION_SECRET` ✅ already set via Replit Secrets and auth module will throw on missing secret.
7. **StaticPage CMS** ✅ DONE — StaticPage model + /admin/static-pages + 6 pages seeded; public pages read from DB

### Sitemap (✅ db5c50d)
`app/sitemap.ts` dynamically fetches all LocationPages, BlogPosts, PortfolioCases, StaticPages from DB. BASE_URL default = `https://kuhniby.by`.

### Known patterns / gotchas
- `Button` component (`components/ui/button.tsx`) does **not** support `asChild`. Use `<Link className={buttonVariants(...)}>` or `<a className={buttonVariants()}>` instead. Do not add `asChild` to Button props.
- All Next.js API routes must use `/kapi/` prefix (not `/api/`) to avoid Express intercept conflict.

---

## Environment variables required

| Variable | Where |
|---|---|
| `DATABASE_URL` | Replit secret (auto-set) |
| `SESSION_SECRET` | Replit secret — must be set for JWT signing |
| `TELEGRAM_BOT_TOKEN` | Set in admin `/admin/notifications` (stored in SiteSettings) |
| `TELEGRAM_CHAT_ID` | Set in admin `/admin/notifications` (stored in SiteSettings) |

---

## Configurator tag system (Этап 6)

Tags format: `prefix:value` stored on `ConfigOption.tags[]`

| Prefix | Maps to | Example |
|---|---|---|
| `style:` | StylePage.slug via STYLE_SLUG map | `style:scandinavian` → `skandinavskie` |
| `budget:` | MaterialPage.budgetLevel via BUDGET_LEVEL map | `budget:standard` → `Средний` |
| `material:` | MaterialPage.slug via MATERIAL_SLUG map | `material:veneer` → `shpon` |
| `layout:` | used for human summary + calculator URL pre-fill | |
| `hardware:` | informational tag | |
| `storage:` | informational tag | |
| `children:` | informational tag | |
| `tech:` | informational tag | |

**To add a new style/material recommendation**: add appropriate tag to ConfigOption and ensure StylePage/MaterialPage has matching slug in the DB. Maps are defined in `app/configure/result/page.tsx`.

---

## Этап 7 — Система отзывов и доверия

### Новые поля Review (schema.prisma)
| Поле | Тип | Назначение |
|---|---|---|
| `region` | String @default("") | Регион: Минская обл., г. Минск, Брестская обл. |
| `source` | String @default("website") | Источник: website, google, yandex, telegram, instagram, vk, direct |
| `sourceUrl` | String @default("") | Ссылка на оригинальный отзыв |
| `featured` | Boolean @default(false) | Избранный (отдельная секция на /reviews) |
| `managerNote` | String @default("") | Внутренняя заметка менеджера (не публикуется) |

### Workflow модерации
```
NEW → PENDING → PUBLISHED
NEW → REJECTED
PENDING → PUBLISHED | REJECTED
PUBLISHED → DELETED
REJECTED | DELETED → PUBLISHED (повторная публикация)
```
Ни один отзыв не публикуется автоматически. Статус NEW = ещё не рассмотрен, PENDING = взят в работу.

### Связь с кейсами
- `Review.caseSlug` → `PortfolioCase.slug`
- В публичной части: ссылка "Смотреть проект" рядом с отзывом
- В админке: slug редактируется inline, название кейса резолвится через БД

### API
- `PATCH /kapi/admin/reviews/[id]` с `action=publish|reject|delete|pending` — модерация
- `PATCH /kapi/admin/reviews/[id]` без action — редактирование полей (featured, caseSlug, source, managerNote)
- `POST /kapi/reviews` — публичная форма теперь принимает `region`, `source`, `caseSlug`

### Файлы изменены
- `prisma/schema.prisma` — +5 полей в Review
- `app/kapi/reviews/route.ts` — +region, source, caseSlug в schema
- `app/kapi/admin/reviews/[id]/route.ts` — dual-mode PATCH + GET
- `components/admin/ReviewModerationList.tsx` — полный переписан (4 tabs, SourceBadge, featured toggle, manager note, reject с причиной)
- `app/admin/reviews/page.tsx` — 4-вкладочная загрузка с JOIN кейсов
- `app/reviews/page.tsx` — избранные отзывы, ссылки на кейсы, источник, без статик-фолбека
