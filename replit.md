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

Коммерческий сайт для продажи кухонь на заказ. Целевая аудитория — жители Минска и Минской области. SEO-направленный, статичный (пока без бэкенда).

### Технологии сайта

- React + Vite + TypeScript
- Tailwind CSS v4
- Wouter (роутинг)
- Framer Motion (анимации)
- shadcn/ui компоненты
- Google Fonts: Playfair Display + Inter

### Цветовая тема

- Background: `hsl(45, 33%, 97%)` — кремовый
- Primary: `hsl(29, 57%, 46%)` — медно-янтарный
- Serif: Playfair Display / Sans: Inter

### Структура проекта

```
artifacts/kuhni-na-zakaz/
  src/
    App.tsx             — роутинг (23 маршрута)
    components/
      Layout.tsx        — шапка, подвал, мобильная CTA
      ui/               — shadcn компоненты
    pages/
      Home.tsx          — главная (10 блоков)
      CatalogPage.tsx   — каталог + детальные страницы
      PortfolioPage.tsx — портфолио + детальные страницы
      PricesPage.tsx    — цены + калькулятор-квиз
      ReviewsPage.tsx   — отзывы + форма
      BlogPage.tsx      — блог + статьи
      AboutPage.tsx     — о компании
      ContactsPage.tsx  — контакты + форма
      LocationPage.tsx  — Минск и Минская область
      DeliveryPage.tsx  — доставка и монтаж
      WarrantyPage.tsx  — гарантия
      ThanksPage.tsx    — страница благодарности
      LegalPages.tsx    — privacy, terms, personal-data
    lib/
      data.ts           — все статичные данные сайта
```

### Важные файлы документации

- `project-docs/AI_RULES.md` — правила для ИИ-агента
- `project-docs/HANDOFF.md` — текущее состояние и следующий шаг
- `project-docs/ROUTES_MAP.md` — все URL и их назначение
- `project-docs/CHANGELOG.md` — журнал изменений

### Правила разработки

1. Не хардкодить телефон/адрес/цены — только из SITE_CONFIG или data.ts
2. Не удалять и не переименовывать URL без редиректов
3. Все формы имеют honeypot-поле
4. Все интерактивные элементы имеют data-testid
5. GitHub push только по команде пользователя
6. Бранч: feature/* → dev → PR → main

### GitHub

```
repo: https://github.com/onliner7-collab/kuhni-na-zakaz.git
main = продакшн
dev = разработка
```
