# Журнал изменений

## [0.5.0] — 2026-04-09 — Этапы 2–12: Полный визуальный конфигуратор

### Этап 2 — 2D Планировщик помещения
- `components/configurator/canvas/Room2D.tsx` — SVG-холст плана помещения: стены, проёмы, выступы, модули на стенах, snapping
- `components/configurator/steps/RoomStep.tsx` — форма размеров (slider+number), добавление дверей/окон/выступов с tabs, live-preview плана
- `app/kapi/configurator-visual/catalog/route.ts` — GET all catalogs за один запрос
- `app/kapi/configurator-visual/projects/route.ts` — POST save/update project
- `app/kapi/configurator-visual/projects/[id]/route.ts` — GET project by id

### Этап 3 — Каталог модулей и шаблонов
- `components/configurator/steps/TemplateStep.tsx` — выбор планировки (карточки с SVG-превью или изображением, анимация motion)
- `components/configurator/steps/ModulesStep.tsx` — каталог модулей с фильтром по типу, выбор стены для размещения, drag на плане, inspector выбранного модуля

### Этап 4 — Материалы, фасады, столешницы, скинали, механизмы
- `components/configurator/steps/MaterialsStep.tsx` — tab-панель: фасады (color swatch), столешницы, скинали, ручки, техника (toggle выбора)

### Этап 5 — 3D ядро
- `@react-three/fiber`, `@react-three/drei`, `three`, `@types/three` добавлены в package.json
- `components/configurator/canvas/Scene3D.tsx` — R3F сцена: пол, стены, модули на стенах с фасадами, столешницами; OrbitControls, ambient/directional light, Environment; lite-режим для мобильных
- `components/configurator/steps/View3DStep.tsx` — dynamic import Scene3D (no SSR), toolbar (пресеты ракурсов, lite toggle, reset camera), hints управления

### Этап 6 — Стилевые пресеты
- `lib/kitchen-configurator/style-presets.ts` — 8 встроенных пресетов: Минимализм, Тёплый дуб, Светлый камень, Графит+Дерево, Матовые фасады, Витрины+Подсветка, Премиум безручечный, Кухня-гостиная
- `components/configurator/steps/StyleStep.tsx` — карточки пресетов с gradient preview, применение + переход к ручной настройке

### Этап 7 — Анимация и premium UI
- `components/configurator/ConfiguratorStepper.tsx` — анимированный stepper: pulse на активном шаге, check на завершённых, gradient connector
- `KitchenConfigurator.tsx` — AnimatePresence slide-transition между шагами, motion кнопки
- `KitchenConfiguratorPage.tsx` — Hero с motion.h1, whileInView секции, scroll cue

### Этап 8 — Сохранение проекта
- `lib/kitchen-configurator/idb-storage.ts` — IndexedDB: autosave, save/load draft, named saves, list projects
- `KitchenConfigurator.tsx` — автосохранение каждые 8 с, восстановление черновика при монтировании (toast-banner), сохранение на сервер через API
- `SummaryStep.tsx` — кнопка «Сохранить», статус dirty/saved в header

### Этап 9 — Экспорт
- `lib/kitchen-configurator/export.ts` — exportProjectAsJSON (download), exportPlanAsPNG (SVG→canvas→PNG), exportProjectAsPDF (HTML print + fallback download); progressive enhancement showSaveFilePicker

### Этап 10 — Поделиться
- `lib/kitchen-configurator/share.ts` — nativeShare (Web Share API + canShare для файлов), copyLinkToClipboard (clipboard API + execCommand fallback), buildShareLinks (Telegram, WhatsApp, Viber, Email)
- `SummaryStep.tsx` — кнопка Share с fallback-панелью мессенджеров + copy link

### Этап 11 — Mobile-first UX
- `ConfiguratorStepper` — горизонтальный scroll, short labels, emoji-иконки
- Sticky header + sticky bottom nav с price indicator и Prev/Next
- Все step-компоненты responsive: grid адаптируется, slider+number для размеров
- View3DStep: lite-режим (низкое dpr, ambient only, no shadows) для мобильных

### Этап 12 — Onboarding, Hero, Visual presentation
- `components/configurator/KitchenConfiguratorPage.tsx` — landing → configurator SPA; Hero с gradient bg, motion h1/p/button, How-it-works (whileInView), CTA bottom
- `app/kitchen-configurator/page.tsx` — Server Component загружает каталог из БД, передаёт в client-компонент
- `components/layout/Header.tsx` — ссылка «🏠 Конфигуратор» добавлена в навигацию

### Системные (не admin-managed)
- Редьюсер, типы, движок совместимости, расчёт цены — системная логика
- Встроенные стилевые пресеты — системные (расширяемы через admin в следующих итерациях)

---

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
## [0.5.1] вЂ” 2026-04-20 вЂ” Удалён старый подбор кухни

### Изменено
- Из публичной части сайта удалён сценарий `Подбор кухни` и его отдельные страницы `/configure` и `/configure/result`.
- В навигации сайта и админки оставлены только актуальные направления: визуальный конфигуратор и калькулятор.
- Из sitemap и персонализации удалены ссылки и состояние, связанные со старым подбором.

### Удалено
- Старые страницы, API-роуты и админ-интерфейсы квиза-конфигуратора.
- Логика сохранённых конфигураций и вспомогательные UI-компоненты старого подбора.
- Остаточные упоминания квиза в FAQ и в типах заявок админ-панели.
