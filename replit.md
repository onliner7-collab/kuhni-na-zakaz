# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

---

## Проект: Кухни на заказ (artifacts/kuhni-na-zakaz)

### Описание

Production-ready коммерческий сайт для продажи кухонь на заказ. Next.js 15.3.3 App Router, SSR/SSG, PostgreSQL/Prisma, полная admin-панель с ролями.

### Технологии сайта

- **Next.js 15.3.3** App Router (SSR + SSG)
- TypeScript 5.9
- Tailwind CSS v4 (PostCSS plugin)
- Prisma 6 + PostgreSQL (DATABASE_URL)
- bcryptjs + jose (JWT auth, HttpOnly cookies)
- Zod + react-hook-form + @hookform/resolvers
- Sonner (toasts)
- Lucide React (icons)
- Google Fonts: Playfair Display + Inter

### Цветовая тема

- Background: `hsl(45, 33%, 97%)` — кремовый
- Primary: `hsl(29, 57%, 46%)` — медно-янтарный
- Serif: Playfair Display / Sans: Inter

### Структура проекта

```
artifacts/kuhni-na-zakaz/
  app/
    layout.tsx              — RootLayout (условный Header/Footer)
    page.tsx                — главная (Hero, FAQ, CTA sections)
    globals.css             — CSS переменные, Tailwind тема
    admin/
      layout.tsx            — AdminLayout (sidebar + main)
      login/page.tsx        — страница входа
      dashboard/page.tsx    — дашборд (статистика)
      kitchens/             — CRUD кухонь
      portfolio/            — CRUD портфолио
      blog/                 — CRUD блога
      reviews/              — модерация отзывов
      users/                — управление пользователями
      guest-access/         — временный гостевой доступ
      settings/             — настройки сайта
      activity-log/         — журнал действий
      leads/                — просмотр заявок
      prices/               — ценовая сетка
      pages/                — обзор страниц
      locations/            — управление городами
    api/
      auth/login|logout/    — JWT auth endpoints
      leads/                — обработка заявок + Telegram
      reviews/              — публичные отзывы
      admin/                — защищённые admin endpoints
    catalog/, blog/, portfolio/, reviews/, prices/
    about/, contacts/, delivery-installation/, warranty/
    locations/[slug]/       — SEO-страницы по городам
    styles/[slug]/, materials/[slug]/
    sitemap.ts, robots.ts   — SEO
  components/
    layout/Header|Footer|MobileCTA.tsx
    sections/               — HeroSection, FAQSection, PriceQuiz, etc.
    admin/                  — AdminSidebar, LoginForm, KitchenForm, BlogPostForm, etc.
    ui/                     — Button, Input, Badge, Card, Toaster
  lib/
    auth.ts                 — JWT encode/decode, session management
    prisma.ts               — Prisma client singleton
    utils.ts                — cn helper
  middleware.ts             — JWT проверка + pathname header
  prisma/
    schema.prisma           — все модели (User, Kitchen, BlogPost, Review, etc.)
    seed.ts                 — начальные данные
```

### Пользователи (из seed)

- **Super Admin**: `admin@kuhniminsk.by` / `Admin123!`

### Роли

- `SUPER_ADMIN` — полный доступ
- `MANAGER` — кухни, портфолио, блог, отзывы, заявки
- `GUEST` — временный доступ к выбранным разделам (токен + срок)

### API endpoints

- `POST /api/auth/login` — вход (JWT cookie)
- `POST /api/auth/logout` — выход
- `POST /api/leads` — заявка (Telegram webhook)
- `GET/POST /api/reviews` — публичные отзывы
- `GET/POST/PUT/DELETE /api/admin/kitchens`
- `GET/POST/PUT/DELETE /api/admin/blog`
- `GET/POST/PUT/DELETE /api/admin/portfolio`
- `GET/POST/PUT /api/admin/reviews`
- `GET/POST/DELETE /api/admin/users`
- `GET/POST/DELETE /api/admin/guest-access`
- `GET/PUT /api/admin/settings`
- `GET /api/admin/activity-log`
- `GET /api/admin/leads`

### Правила разработки

1. Все формы имеют honeypot-поле (anti-spam)
2. Все интерактивные элементы имеют `data-testid`
3. `@/*` алиас → корень `artifacts/kuhni-na-zakaz/`
4. GitHub push только по команде пользователя
5. Не удалять URL без редиректов (SEO)

### GitHub

```
repo: https://github.com/onliner7-collab/kuhni-na-zakaz.git
main = продакшн
```

**Push status:** Pushed successfully on 2026-04-05.
- Remote `github` added via `GITHUB_TOKEN` secret
- 298 objects pushed to `main` branch (28.75 MiB)
- HEAD at `ab1af3c` on GitHub main
- Command: `git push github main` → `2622c75..ab1af3c main -> main`
