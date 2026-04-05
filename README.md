# Кухни на заказ — коммерческий SEO-сайт

## О проекте

Коммерческий SEO-ориентированный сайт по продаже кухонь на заказ в Минске и Минской области. Цель — генерация заявок с органического трафика, карт и прямых заходов.

## Цели

- Получать заявки из органического поиска и локального SEO
- Работать на мобильных и десктопных устройствах
- Иметь сильную конверсионную структуру
- Быть SEO-готовым под Google и Яндекс
- Масштабироваться на новые города без переработки архитектуры

## Технический стек

- **Frontend**: React + Vite + TypeScript
- **Стилизация**: Tailwind CSS
- **Роутинг**: Wouter
- **Анимации**: Framer Motion
- **Формы**: React Hook Form + Zod
- **Монорепо**: pnpm workspaces

## Структура проекта

```
artifacts/kuhni-na-zakaz/   — основной фронтенд сайта
artifacts/api-server/       — API сервер (Express)
lib/db/                     — схема базы данных (Drizzle + PostgreSQL)
project-docs/               — проектная документация
```

## Запуск

```bash
pnpm install
pnpm --filter @workspace/kuhni-na-zakaz run dev
```

## Обязательно к прочтению перед кодом

Вся документация в папке `project-docs/`. Порядок чтения:
1. PROJECT_OVERVIEW.md
2. TECHNICAL_SPEC.md
3. AI_RULES.md
4. CONTENT_RULES.md
5. SEO_STRATEGY.md
6. UI_UX_GUIDE.md
7. ADMIN_PANEL_SPEC.md
8. ROUTES_MAP.md

**Правило: перед написанием любого кода обязательно прочитать документацию.**

## GitHub

- Ветка `main` — продакшн
- Ветка `dev` — разработка
- Push по команде пользователя

## Деплой

См. `project-docs/DEPLOYMENT.md`

## Окружение

Создайте `.env` на основе `.env.example`:
```
VITE_SITE_URL=https://yourdomain.by
VITE_PHONE=+375291234567
VITE_EMAIL=info@kuhni.by
VITE_TELEGRAM_BOT_TOKEN=
VITE_TELEGRAM_CHAT_ID=
```
