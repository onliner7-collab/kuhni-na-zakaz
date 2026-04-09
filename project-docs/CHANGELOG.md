# Журнал изменений

## [0.4.0] — 2026-04-09 — Этап 1: Product Foundation

### Добавлено

**Prisma schema — новые модели:**
- `KitchenModule` — модули кухни (нижние, верхние, пеналы, угловые, под мойку, с ящиками, с витринами, с подъёмным механизмом)
- `KitchenTemplate` — шаблоны планировок (прямая, угловая, П-образная, с островом, с полуостровом, компактная)
- `KitchenFacade` — фасады (МДФ, эмаль, шпон, пластик; цвет, фактура, ценовой множитель)
- `KitchenCountertop` — столешницы (ламинат, камень, кварц, дерево; цена за пм)
- `KitchenSkinal` — скинали / фартуки (стекло, плитка, акрил, МДФ; цена за м²)
- `KitchenHandle` — ручки и системы открывания (стандартные, врезные, push-to-open, интегрированные)
- `KitchenMechanism` — механизмы (Aventos и аналоги, мягкое закрытие, выдвижные системы)
- `KitchenAppliance` — встраиваемая техника (духовки, варочные панели, посудомойки, холодильники)
- `VisualProject` — пользовательский проект (roomConfig, modulePlacement, materialsConfig, priceEstimate; связан с Lead)
- `CompatibilityRule` — правила совместимости компонентов (INCOMPATIBLE / REQUIRES / WARNING)
- `KitchenConfiguratorSettings` — настройки конфигуратора (синглтон; размеры по умолч., тексты шаринга)
- Новые enum: `KitchenModuleType`, `KitchenLayoutType`, `KitchenHandleType`, `CompatibilityRuleType`
- Relation `Lead.visualProject` → `VisualProject`

**TypeScript:**
- `lib/kitchen-configurator/types.ts` — полный набор типов: RoomConfig, PlacedModule, CatalogModule, MaterialsConfig, PriceBreakdown, VisualProjectState, ConfiguratorAction и др.
- `lib/kitchen-configurator/store.ts` — useReducer-совместимый редьюсер, начальное состояние, селекторы
- `lib/kitchen-configurator/compatibility.ts` — движок проверки совместимости (перекрытия модулей, блокировка проёмов, правила из БД)
- `lib/kitchen-configurator/price.ts` — расчёт стоимости (модули, фасады, столешница, скиналь, ручки, техника, монтаж)
- `lib/kitchen-configurator/index.ts` — re-export всего

**Admin-панель — новые страницы:**
- `/admin/configurator-visual` — хаб управления конфигуратором
- `/admin/configurator-visual/modules` — CRUD-список модулей
- `/admin/configurator-visual/templates` — CRUD-список шаблонов
- `/admin/configurator-visual/facades` — CRUD-список фасадов
- `/admin/configurator-visual/countertops` — CRUD-список столешниц
- `/admin/configurator-visual/skinals` — CRUD-список скиналей
- `/admin/configurator-visual/handles` — CRUD-список ручек
- `/admin/configurator-visual/mechanisms` — CRUD-список механизмов
- `/admin/configurator-visual/appliances` — CRUD-список техники
- `/admin/configurator-visual/compatibility` — список правил совместимости
- `/admin/configurator-visual/settings` — просмотр настроек конфигуратора
- Ссылка «Визуальный конфигуратор» добавлена в `AdminSidebar`

**Публичный сайт:**
- `/kitchen-configurator` — страница-placeholder с описанием шагов и CTA

### Системные (не admin-managed)
- Типы TypeScript, редьюсер, движок совместимости, расчёт цены — системная логика, управляется кодом

### Затронутые файлы
- `artifacts/kuhni-na-zakaz/prisma/schema.prisma`
- `artifacts/kuhni-na-zakaz/lib/kitchen-configurator/*` (новая директория)
- `artifacts/kuhni-na-zakaz/app/admin/configurator-visual/**` (новые страницы)
- `artifacts/kuhni-na-zakaz/app/kitchen-configurator/page.tsx`
- `artifacts/kuhni-na-zakaz/components/admin/AdminSidebar.tsx`

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
