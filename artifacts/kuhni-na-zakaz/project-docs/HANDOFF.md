# Handoff — КухниBY

## Current docs

- Bulk import v1 actual-state doc: `project-docs/BULK_IMPORT_V1.md`
- Bulk import v1 final closure handoff: `project-docs/BULK_IMPORT_V1_FINAL_HANDOFF.md`
- Bulk import v1 operational summary: `project-docs/BULK_IMPORT_V1_OPERATIONAL_SUMMARY_2026-04-20.md`
- Post-import smoke runbook: `tests/smoke/README.md`

## Bulk Import v1 Closure Snapshot

- Status: closed and in operation.
- Scope: `Kitchens`, `Styles`, `Materials`, `Scenarios`, `Portfolio`, `Locations`.
- Out of scope: calculator/configurator import and all non-listed content areas.
- Canonical template: `project-docs/templates/bulk-import-v1-template.xlsx`.
- Canonical operator instruction: `project-docs/BULK_IMPORT_V1_OPERATOR_GUIDE_RU.md`.
- Canonical post-import checks: `project-docs/BULK_IMPORT_V1_POST_IMPORT_CHECKLIST_RU.md` and `tests/smoke/README.md`.

## Project overview

**КухниBY** — commercial kitchen sales website for Belarus.  
Stack: **Next.js 15.3.3 App Router** + PostgreSQL + Prisma + Tailwind + Sonner.

---

## Completed Stages

| Этап | Статус | Описание |
|---|---|---|
| Этап 1 | ✅ Done | HomepageBlock — DB-driven homepage, admin page, API routes |
| Этап 2 | ✅ Done | ScenarioPage — 6 сценариев, admin CRUD 4-tab form, public /scenarios |
| Этап 3 | ✅ Done | StylePage + MaterialPage — расширены схемы (+12 полей каждая), 5+5 записей посеяно, admin CRUD + forms, SEO-посадочные, internal linking |
| Этап 4 | ✅ Done | PortfolioCase — расширена схема (+15 полей), 6 кейсов посеяно, 4-tab admin form, /portfolio (Server Component + client filters), /portfolio/[slug] (полный кейс-стади + история + до/после + отзывы + internal links + sidebar), JSON-LD Article |
| Этап 5 | ✅ Done | PriceRule — 34 правила в 8 категориях, /kapi/calculator (POST), PriceRulesEditor (bulk inline CRUD), /admin/prices DB-driven, /calculator (8-шаговый wizard SSR+CSR) |
| Этап 6 | ✅ Done | Конфигуратор — ConfigStep/ConfigOption/ConfigResult (3 модели), 8 шагов + 32 варианта с тег-системой, /configure (8-шаговый wizard), /configure/result (SSR рекомендации из БД), /admin/configurator (полный CRUD) |
| Этап 7 | ✅ Done | Система отзывов — 5 новых полей (region/source/sourceUrl/featured/managerNote), 4-tab модерация, SourceBadge, связь с кейсом caseSlug, workflow NEW→PENDING→PUBLISHED/REJECTED |
| Этап 8 | ✅ Done | LocationPage — 7 новых полей (localIntro/uniquePoints/contentBlocks/caseSlugs/reviewIds/ctaHeadline/ctaSubtext), публичная страница переработана, LocationForm расширена, DB seed Минск + Минская обл. |
| Этап 9 | ✅ Done | Smart cross-linking — BlogPost (+3 поля), StylePage/MaterialPage/ScenarioPage показывают связанные кейсы, BlogPost публичная страница с 3 секциями related-контента, BlogPostForm панель «Связанный контент» |
| Этап 10 | ✅ Done | Персонализация — Lead (+8 полей), SavedConfig, FavoriteCase (новые модели); usePersonalization hook; FavoriteButton; ConfigResultActions; SavedConfigBanner; admin/leads полный перепис с статусами/заметками/config-данными |
| Admin UX audit | ✅ Done | FAQ admin CRUD (/admin/faq + API), LeadAssignedEditor, поиск заявок, Dashboard новые заявки |
| Security & Cleanup | ✅ Done | `lib/auth.ts` — убран fallback secret, throw если SESSION_SECRET не задан; `.next/` удалён из git-индекса; `asChild` bug fixed |
| Brand & positioning cleanup | ✅ Done | Убраны минские fallback-домены из metadataBase/OG/Footer. Статические страницы: "КухниMinsk" → "КухниBY", домен → kuhniby.by |
| Contacts DB cleanup | ✅ Done | `/contacts` читает phone/email/address/workingHours из SiteSettings (id=1) с fallback. Schema default email исправлен. |
| StaticPage CMS | ✅ Done | StaticPage model + /admin/pages (CRUD, редактор: /admin/pages/[id]/edit) + 6 страниц посеяно; публичные about/warranty/delivery/privacy/terms/personal-data читают контент из БД |
| Blog seed + Regional expansion | ✅ Done | 6 blog posts посеяно; 10 LocationPages (все 6 областных центров + Борисов/Жодино/Молодечно); sitemap.ts DB-driven; renderContent поддерживает bold+lists |
| Email notifications | ✅ Done | `lib/email.ts` через nodemailer + SMTP env vars; получатель захардкожен как `onliner7@gmail.com`; fire-and-forget после Telegram |
| Image handling improvement | ✅ Done | BlogPost.coverImage добавлен в схему+форму+API; PortfolioCaseForm.ArrayUrlField переделан в grid-preview; StyleForm/MaterialForm получили live-preview и URL-валидацию |

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
- **`lib/auth.ts`**: `SESSION_SECRET` is required at startup — throws `Error` if missing. No fallback.
- Login flow: `POST /kapi/auth/login` → bcrypt verify → JWT cookie. Logout: `POST /kapi/auth/logout` → clear cookie.
- **⚠️ Do not add** `SESSION_SECRET` fallback back — intentional security hardening.

### Sitemap
`app/sitemap.ts` dynamically fetches LocationPages, BlogPosts, PortfolioCases, StaticPages from DB. BASE_URL = `https://kuhniby.by`.

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
| `BlogPost` | Articles (incl. `coverImage`) |
| `PriceRule` | Price calculation rules (34 rules, 8 categories) |
| `FAQItem` | FAQ items (page-scoped) |
| `LocationPage` | City/region SEO pages |
| `StylePage` | Kitchen style SEO pages |
| `MaterialPage` | Facade material SEO pages |
| `ScenarioPage` | Use-case scenario pages |
| `StaticPage` | CMS-editable static pages (about, warranty, etc.) |
| `HomepageBlock` | Homepage editable blocks (scenario/step/advantage/trust) |
| `SiteSettings` | Global settings: phone, email, address, socials (id=1) |
| `Lead` | Form submissions |
| `SavedConfig` | Anonymous configurator sessions (by sessionId) |
| `FavoriteCase` | Favorited portfolio cases (by sessionId) |
| `ConfigStep` | Configurator steps |
| `ConfigOption` | Configurator options (with tags) |
| `User` | Admin users |
| `GuestAccess` | Temporary admin tokens |
| `ActivityLog` | Admin action audit trail |
| `TelegramRecipient` | Telegram notification targets |

---

## Admin pages

| URL | Purpose | Кто может |
|---|---|---|
| `/admin/dashboard` | Stats + recent activity | SUPER_ADMIN, MANAGER |
| `/admin/homepage` | Edit HomepageBlocks (сценарии, преимущества, шаги, доверие) | SUPER_ADMIN, MANAGER |
| `/admin/kitchens` | Kitchen catalog CRUD | SUPER_ADMIN, MANAGER |
| `/admin/portfolio` | Portfolio cases CRUD (опубликовать/скрыть, featured, order) | SUPER_ADMIN, MANAGER |
| `/admin/reviews` | Review moderation (NEW→PENDING→PUBLISHED/REJECTED) | SUPER_ADMIN, MANAGER |
| `/admin/blog` | Blog posts CRUD (draft/published, coverImage) | SUPER_ADMIN, MANAGER |
| `/admin/prices` | Price table CRUD (34 правила, inline bulk-edit) | SUPER_ADMIN, MANAGER |
| `/admin/configurator` | Конфигуратор — шаги + варианты CRUD | SUPER_ADMIN, MANAGER |
| `/admin/scenarios` | Сценарии выбора кухни CRUD | SUPER_ADMIN, MANAGER |
| `/admin/styles` | Стили кухонь CRUD | SUPER_ADMIN, MANAGER |
| `/admin/materials` | Материалы фасадов CRUD | SUPER_ADMIN, MANAGER |
| `/admin/faq` | FAQ вопросы и ответы | SUPER_ADMIN, MANAGER |
| `/admin/locations` | City SEO pages CRUD | SUPER_ADMIN, MANAGER |
| `/admin/leads` | Заявки — статус, назначение менеджера, заметки, поиск | SUPER_ADMIN, MANAGER |
| `/admin/saved-configs` | Сохранённые подборы клиентов (read-only) | SUPER_ADMIN, MANAGER |
| `/admin/pages` | Static pages CMS (about, warranty, delivery, privacy...) | SUPER_ADMIN, MANAGER |
| `/admin/contacts` | Edit SiteSettings (phone, address, socials) | SUPER_ADMIN |
| `/admin/notifications` | Telegram webhook config | SUPER_ADMIN |
| `/admin/settings` | Site-wide settings | SUPER_ADMIN |
| `/admin/users` | User management | SUPER_ADMIN |
| `/admin/guest-access` | Temp access tokens | SUPER_ADMIN |
| `/admin/activity-log` | Audit trail | SUPER_ADMIN, MANAGER |

---

## Технический долг

### Hardcoded content (partial)

Часть страниц содержит **визуальные компоненты**, которые не редактируются из admin-панели:

| Страница | Что захардкожено |
|---|---|
| `/about` | FACTS-grid (4 цифры), карточки команды, ценности — визуальные блоки. Текст страницы — DB-driven через StaticPage. |
| `/warranty` | Карточки сроков гарантии (5/2/1 год) — захардкожены. Текст — DB-driven через StaticPage. |

Остальные страницы (delivery-installation, privacy-policy, terms, personal-data) — полностью DB-driven через StaticPage.

### Image upload

Загрузка файлов напрямую из admin не реализована. В формах — только URL-поля. Изображения нужно хостить внешне (CDN, облачное хранилище) и вставлять URL. Для реализации upload нужен отдельный этап с S3/object storage.

---

## Pending / Next tasks

1. **File upload (S3/object storage)** — реализация загрузки изображений из admin-панели. Сейчас admin работает только с URL. Требует: S3-совместимое хранилище, API-route загрузки, интеграция в формы (Portfolio, Blog, Kitchens, Style, Material).

2. **Production deployment** — запуск в production. Шаги:
   - `npx prisma migrate deploy` или `prisma db push` (в зависимости от migration history)
   - Задать env vars: `SESSION_SECRET` (уже в Replit Secrets), SMTP vars (если нужен email)
   - Проверить `DATABASE_URL` в production окружении

---

## Known patterns / gotchas

- `Button` component (`components/ui/button.tsx`) does **not** support `asChild`. Use `<Link className={buttonVariants(...)}>` or `<a className={buttonVariants()}>` instead. Do not add `asChild` to Button props.
- All Next.js API routes must use `/kapi/` prefix (not `/api/`) to avoid Express intercept conflict.
- `ReviewStatus.APPROVED` does not exist — use `ReviewStatus.PUBLISHED`.
- Email recipient is hardcoded as `onliner7@gmail.com` in `lib/email.ts` (`LEAD_NOTIFICATION_RECIPIENT`). Not configurable via env.

---

## Environment variables required

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Replit secret (auto-set) |
| `SESSION_SECRET` | Yes | Must be set — auth throws if missing |
| `TELEGRAM_BOT_TOKEN` | No | Set in admin `/admin/notifications` (stored in SiteSettings) |
| `TELEGRAM_CHAT_ID` | No | Set in admin `/admin/notifications` (stored in SiteSettings) |
| `EMAIL_SMTP_HOST` | No | Activator: if absent, email is silently skipped |
| `EMAIL_SMTP_PORT` | No | Default: 587 |
| `EMAIL_SMTP_SECURE` | No | `"true"` for SSL/465, default STARTTLS |
| `EMAIL_SMTP_USER` | No | SMTP login |
| `EMAIL_SMTP_PASS` | No | SMTP password |

**Email recipient** is hardcoded as `onliner7@gmail.com` — not configurable via env.

---

## Configurator tag system

Tags format: `prefix:value` stored on `ConfigOption.tags[]`

| Prefix | Maps to | Example |
|---|---|---|
| `style:` | StylePage.slug via STYLE_SLUG map | `style:scandinavian` → `skandinavskie` |
| `budget:` | MaterialPage.budgetLevel via BUDGET_LEVEL map | `budget:standard` → `Средний` |
| `material:` | MaterialPage.slug via MATERIAL_SLUG map | `material:veneer` → `shpon` |
| `layout:` | human summary + calculator URL pre-fill | |
| `hardware:` | informational | |
| `storage:` | informational | |
| `children:` | informational | |
| `tech:` | informational | |

To add a new style/material recommendation: add appropriate tag to ConfigOption and ensure StylePage/MaterialPage has matching slug in DB. Maps are defined in `app/configure/result/page.tsx`.

---

## Review system — workflow

```
NEW → PENDING → PUBLISHED
NEW → REJECTED
PENDING → PUBLISHED | REJECTED
PUBLISHED → DELETED
REJECTED | DELETED → PUBLISHED (повторная публикация)
```

No review is published automatically. NEW = not yet reviewed, PENDING = in progress.

API:
- `PATCH /kapi/admin/reviews/[id]` with `action=publish|reject|delete|pending` — moderation
- `PATCH /kapi/admin/reviews/[id]` without action — field edit (featured, caseSlug, source, managerNote)
- `POST /kapi/reviews` — public form accepts `region`, `source`, `caseSlug`
