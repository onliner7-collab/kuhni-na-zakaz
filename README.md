# kuhni-na-zakaz

Коммерческий SEO-сайт и админ-панель для проекта кухонь на заказ.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
- pnpm workspaces

## Main app

- `artifacts/kuhni-na-zakaz` - сайт и админка
- `project-docs` - документация
- `deploy` - production templates

## Local run

```bash
pnpm install
cd artifacts/kuhni-na-zakaz
pnpm run dev
```

Локальный dev-сервер поднимается на `http://localhost:3001`.

## Environment

Создавайте локальный `.env` на основе `artifacts/kuhni-na-zakaz/.env.example`.

Минимально нужны:

- `DATABASE_URL`
- `SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Production prep docs

- `project-docs/GIT_AND_PROD_PREP.md`
- `project-docs/RELEASE_CHECKLIST.md`
- `project-docs/DEPLOYMENT.md`
- `project-docs/TELEGRAM_NOTIFICATIONS.md` — настройка Telegram webhook и уведомлений

## Git

- `origin`: `https://github.com/onliner7-collab/kuhni-na-zakaz.git`
- `main` - production branch
- `dev` - integration branch
