# Журнал изменений

## [0.3.1] — 2026-05-06

### Исправлено
- Восстановлены отсутствующие server exports для admin API (`requireAdmin`, `@/lib/prisma`), из-за которых Next.js/TypeScript сборка падала на маршрутах блога и портфолио.
- Запись в admin kitchen API и просмотр заявок на dashboard ограничены staff-сессиями (`SUPER_ADMIN`, `MANAGER`), чтобы guest-token не давал доступ к критичным данным и изменениям каталога.

### Затронуты файлы
- `artifacts/kuhni-na-zakaz/lib/auth.ts`
- `artifacts/kuhni-na-zakaz/lib/prisma.ts`
- `artifacts/kuhni-na-zakaz/app/api/admin/kitchens/route.ts`
- `artifacts/kuhni-na-zakaz/app/api/admin/kitchens/[id]/route.ts`
- `artifacts/kuhni-na-zakaz/app/admin/dashboard/page.tsx`

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
