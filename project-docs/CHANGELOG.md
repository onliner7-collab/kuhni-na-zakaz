# Журнал изменений

## [0.3.1] — 2026-05-14

### Исправлено
- Закрыто неавторизованное чтение заявок и приватных настроек Telegram через API.
- Восстановлены недостающие серверные helper/export для админских страниц и API Next.js.
- Исключены legacy Vite pages из Next production build и восстановлена поддержка `asChild` в кнопках.
- Добавлена генерация Prisma Client из каталога Next-приложения при установке зависимостей.
- Исправлен тип JSON-поля `answers` при сохранении заявки через Prisma.
- Исправлены оставшиеся typecheck-блокеры Next-приложения после миграции.

### Затронуты файлы
- `artifacts/kuhni-na-zakaz/lib/auth.ts`
- `artifacts/kuhni-na-zakaz/lib/prisma.ts`
- `artifacts/kuhni-na-zakaz/app/api/leads/route.ts`
- `artifacts/kuhni-na-zakaz/app/api/admin/settings/route.ts`
- `artifacts/kuhni-na-zakaz/app/api/admin/blog/[id]/route.ts`
- `artifacts/kuhni-na-zakaz/next.config.ts`
- `artifacts/kuhni-na-zakaz/components/ui/button.tsx`
- `artifacts/kuhni-na-zakaz/components/admin/AdminSidebar.tsx`
- `artifacts/kuhni-na-zakaz/package.json`
- `artifacts/kuhni-na-zakaz/app/portfolio/page.tsx`
- `artifacts/kuhni-na-zakaz/tsconfig.json`
- `pnpm-workspace.yaml`

---

## [0.3.0] — 2025-04-05

### Добавлено
- Все публичные страницы сайта (23 страницы)
- Статичные данные: портфолио, каталог, блог, отзывы, FAQ
- Калькулятор-квиз на 7 шагов
- Форма заявки с honeypot-защитой
- Страница благодарности (/thanks)
- Локальные страницы: Минск и Минская область
- Юридические страницы

### Затронуты файлы
- `artifacts/kuhni-na-zakaz/src/App.tsx` — полный роутинг
- `artifacts/kuhni-na-zakaz/src/lib/data.ts` — статичные данные
- `artifacts/kuhni-na-zakaz/src/pages/*` — все страницы

---

## [0.2.0] — 2025-04-05

### Добавлено
- Базовая структура React+Vite приложения
- Шапка с навигацией, мобильное меню, sticky header
- Подвал с навигацией и контактами
- Фиксированная мобильная CTA-панель
- Базовая главная страница с hero, преимуществами, категориями
- Цветовая тема: тёплые бежевые тона, медно-янтарный акцент
- Google Fonts: Playfair Display + Inter

### Затронуты файлы
- `artifacts/kuhni-na-zakaz/src/index.css` — тема
- `artifacts/kuhni-na-zakaz/src/components/Layout.tsx` — шапка и подвал
- `artifacts/kuhni-na-zakaz/src/pages/Home.tsx` — главная

---

## [0.1.0] — 2025-04-05

### Добавлено
- Вся проектная документация (16 файлов в project-docs/)
- README.md
- Создан artifact kuhni-na-zakaz (React + Vite)

### Затронуты файлы
- `README.md`
- `project-docs/*.md` — все документы проекта
