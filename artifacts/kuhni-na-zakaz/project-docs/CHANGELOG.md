# Changelog — КухниBY

## [Unreleased] — 2026-04-06 (Этап 7: Image handling improvement)

### Added
- **`BlogPost.coverImage String @default("")`** — новое поле обложки статьи в Prisma schema. Применено через `prisma db push`.
- **`BlogPostForm`** — новый блок «Обложка статьи» в правом сайдбаре: URL-поле (`type="url"`), live preview в aspect-video-контейнере, placeholder пока URL не вставлен.
- **`app/kapi/admin/blog/route.ts`** — `coverImage` добавлен в `BlogSchema` (POST).
- **`app/kapi/admin/blog/[id]/route.ts`** — `coverImage` добавлен в `BlogSchema` (PUT).

### Changed
- **`PortfolioCaseForm` — `ArrayUrlField`** — переделан: сетка `grid-cols-2/3` вместо плоского списка, thumbnails `aspect-video` вместо `w-12 h-12`, badge «1» на первом фото, hover-кнопка удаления, `type="url"` + inline ошибка валидации ("URL должен начинаться с https://").
- **`PortfolioCaseForm` — `mainImage`** — улучшен preview: `aspect-video` контейнер с badge «Обложка», placeholder-заглушка когда поле пустое, `type="url"` на input, более подробная подпись.
- **`StyleForm` — `image`** — добавлен live preview (`aspect-video`), placeholder-заглушка, подсказка, `type="url"`, `font-mono` на input.
- **`MaterialForm` — `image`** — аналогично StyleForm.

### Ограничения (не изменились)
- Загрузка файлов напрямую из admin не реализована — только URL-поля. Изображения нужно хостить внешне (CDN, облачное хранилище) и вставлять URL.
- Upload в S3/object storage — не сделан в этом этапе.

---

## [Unreleased] — 2026-04-06 (Этап 6 cleanup: email recipient hardcoded)

### Changed
- **`lib/email.ts`** — получатель email-уведомлений зафиксирован как `onliner7@gmail.com` (константа `LEAD_NOTIFICATION_RECIPIENT`). Убраны: `EMAIL_TO` env var, fallback через `SiteSettings.email`, DB-запрос к `prisma.siteSettings`, импорт `prisma`. Логика SMTP-транспорта и guard без `EMAIL_SMTP_HOST` не изменились.

---

## [Unreleased] — 2026-04-06 (Этап 6: Email notifications for leads)

### Added
- **`lib/email.ts`** — модуль email-уведомлений о новых заявках. SMTP через env vars (`EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS`, `EMAIL_SMTP_SECURE`). Получатель: `EMAIL_TO` env → `SiteSettings.email` fallback. Отправитель: `EMAIL_FROM` env → auto-from-smtp-user. HTML-шаблон: форма, дата, имя, телефон, город, комментарий, источник, ответы. Если `EMAIL_SMTP_HOST` не задан — пропуск с предупреждением в console.
- **`app/kapi/leads/route.ts`** — добавлен вызов `sendEmailNotification(lead)` после Telegram. Email запускается fire-and-forget (не `await`), ошибка перехватывается `.catch()` — не влияет ни на Telegram, ни на HTTP-ответ.
- **`nodemailer`** + **`@types/nodemailer`** добавлены в `package.json`.

### Env vars (для email, все опциональны)
| Переменная | Обязательна | Назначение |
|---|---|---|
| `EMAIL_SMTP_HOST` | Да (для активации) | SMTP-хост. Если не задан — email пропускается. |
| `EMAIL_SMTP_PORT` | Нет | Порт (по умолчанию: 587) |
| `EMAIL_SMTP_SECURE` | Нет | `"true"` для SSL (порт 465). По умолчанию: STARTTLS. |
| `EMAIL_SMTP_USER` | Нет | Логин SMTP |
| `EMAIL_SMTP_PASS` | Нет | Пароль SMTP |
| `EMAIL_FROM` | Нет | Адрес отправителя. По умолчанию: `"КухниBY" <EMAIL_SMTP_USER>` |
| `EMAIL_TO` | Нет | Адрес получателя. Fallback: `SiteSettings.email` (`info@kuhniby.by`) |

### Поведение при отсутствии конфига
- `EMAIL_SMTP_HOST` не задан → `[EMAIL] EMAIL_SMTP_HOST not set — skipping`, лид создаётся нормально
- `EMAIL_TO` не задан + SiteSettings.email пуст → `[EMAIL] No recipient configured — skipping`
- SMTP-ошибка при отправке → `[EMAIL] <error>` в console, лид и Telegram не затронуты

---

## [Unreleased] — 2026-04-06 (Этап 5: Prices page completion)

### Changed
- **`components/sections/PriceQuiz.tsx`** — переключён на DB-driven расчёт: вместо локальной таблицы `PRICES[]` вызывает `POST /kapi/calculator` с маппингом ответов на параметры калькулятора (layout, area, material, hardware, tech, style=modern, countertop=postforming, priority=balance). Показывает `priceFrom–priceTo` из БД.
- **`app/prices/page.tsx`** — исправлены metadata: убрано "в Минске", добавлено "по Беларуси"; "Доставка по Минску" → "Доставка по городу", добавлена строка "Доставка в другой город — по договорённости". Сегменты (Эконом/Стандарт/Премиум) помечены как редакционный fallback через JSDoc-комментарии — нет модели PriceSegment в БД.

### Архитектура после этапа
- **DB-driven:** расчёт стоимости в PriceQuiz — через `PriceRule` и `POST /kapi/calculator`
- **Static fallback (задокументирован):** SEGMENTS — маркетинговые диапазоны без DB-эквивалента; EXTRA_WORKS — услуги вне формулы калькулятора
- **Не сломано:** `/kapi/calculator`, `/admin/prices`, формула PriceRule

---

## [Unreleased] — 2026-04-06 (Blog seed + Regional expansion)

### Added
- **`prisma/seed-blog.ts`** — 6 публичных блог-постов (советы, цены, дизайн, материалы, фурнитура, остров). Все опубликованы с `publishedAt`. Теги, relatedStyle/Scenario slugs заполнены для cross-linking.
- **`prisma/seed-locations.ts`** — 7 новых LocationPage: Брест, Гродно, Витебск, Гомель, Могилёв (5 областных центров), + Жодино и Молодечно (Минская обл). Каждая с: intro, features, uniquePoints, contentBlocks, faq, ctaHeadline, ctaSubtext, SEO-полями.
- **`package.json`** — команды `db:seed-blog` и `db:seed-locations`.

### Changed
- **`components/layout/Footer.tsx`** — расширен блок «Города»: добавлены ссылки на Брест, Гродно, Витебск, Гомель, Могилёв (теперь 7 городов вместо 2).

### DB данные
- `BlogPost`: было 0 → стало 6 записей
- `LocationPage`: было 3 (Минск, Минская обл, Борисов) → стало 10 (+ 5 областных + Жодино + Молодечно)

### Закрытые pending tasks (из HANDOFF)
- ✅ Blog — контент посеян, страница берёт данные из БД (не fallback)
- ✅ Regional pages — все 6 областных центров Беларуси теперь имеют LocationPage

---

## [Unreleased] — 2026-04-06 (Этап 4: StaticPage CMS)

### Added
- **`prisma/schema.prisma`** — новая модель `StaticPage` (slug unique, title, content, seoTitle, seoDescription, published, timestamps).
- **`prisma/seed-static-pages.ts`** — seed-скрипт для 6 страниц: about, delivery-installation, warranty, privacy-policy, terms, personal-data.
- **`package.json`** — команда `db:seed-static` → `tsx prisma/seed-static-pages.ts`.
- **`lib/render-content.tsx`** — легковесный renderer: `## Заголовок` → `<h2>`, `- пункт` → `<ul><li>`, блок текста → `<p>`.
- **`app/kapi/admin/static-pages/route.ts`** — GET (список страниц).
- **`app/kapi/admin/static-pages/[id]/route.ts`** — GET (одна страница) + PATCH (обновление).
- **`app/admin/pages/[id]/edit/page.tsx`** — Client Component: редактор страницы (title, content, seoTitle, seoDescription, published), сохранение через PATCH.

### Changed
- **`app/admin/pages/page.tsx`** — заменён stub с amber-предупреждением: теперь полноценный список из БД с колонками Заголовок/URL/Статус + иконки Редактировать/Открыть.
- **`app/about/page.tsx`** — SSR из `StaticPage` slug=about; FACTS-grid и ContactForm сохранены как hardcoded визуальные компоненты; `generateMetadata` читает seoTitle/seoDescription из БД.
- **`app/warranty/page.tsx`** — SSR из `StaticPage` slug=warranty; карточки гарантии (5/2/1 год) hardcoded; контент из БД.
- **`app/delivery-installation/page.tsx`** — полностью DB-driven (title + content из БД).
- **`app/privacy-policy/page.tsx`** — полностью DB-driven.
- **`app/terms/page.tsx`** — полностью DB-driven.
- **`app/personal-data/page.tsx`** — полностью DB-driven.

### DB migration
- `prisma db push` → таблица `StaticPage` создана.
- `pnpm db:seed-static` → 6 записей посеяны.

---

## [Unreleased] — 2026-04-06 (Этап 3: Contacts page DB-driven)

### Changed
- **`app/contacts/page.tsx`** — конвертирован в `async` Server Component. Читает `phone`, `phoneDisplay`, `phone2`, `phoneDisplay2`, `email`, `address`, `workingHours` из `SiteSettings` (id=1) через Prisma. При DB-ошибке — `catch(() => null)`, код показывает значения из `DEFAULTS`. Страница более не оторвана от глобальных настроек.
- **`prisma/schema.prisma`** — исправлен `default` для `SiteSettings.email`: `"info@kuhniminsk.by"` → `"info@kuhniby.by"`. Влияет только на создание новых записей (существующие данные в БД не затронуты).
- **`project-docs/HANDOFF.md`** — удалена строка «Contacts page — currently static» из Pending tasks (задача выполнена); нумерация списка исправлена.

### Что стало DB-driven
| Поле | Источник |
|---|---|
| телефон / доп. телефон | `SiteSettings.phone` / `phone2` |
| email | `SiteSettings.email` |
| адрес | `SiteSettings.address` |
| время работы | `SiteSettings.workingHours` (split по `,` → отдельные строки) |

### Что осталось fallback
- `DEFAULTS` в `contacts/page.tsx` — safety-net при отсутствии записи SiteSettings
- Placeholder карты (`Карта — {c.address}`) — статический блок, адрес динамический

### Verified (не изменено)
- `Footer.tsx` — уже DB-driven ✓
- `Header.tsx` — принимает phone-props из `layout.tsx` (читает SiteSettings) ✓
- `layout.tsx` — SiteSettings + Header props без изменений ✓

---

## [Unreleased] — 2026-04-06 (Brand & positioning cleanup)

### Подэтап A — docs fix

- **`project-docs/HANDOFF.md`** — убрано слово `production-ready` из описания проекта (маркетинговое утверждение без доказательной базы в рамках этой задачи).
- **`project-docs/HANDOFF.md`** — запись `Этап 2 (Бренд)` переименована в `Brand & positioning cleanup` во избежание конфликта с продуктовым `Этап 2` (ScenarioPage).

### Подэтап B — static pages & global content hygiene

#### Изменено: `app/layout.tsx`
- metadataBase fallback: `"https://kuhniminsk.by"` → `"https://kuhniby.by"`
- OG url fallback: то же

#### Изменено: `components/layout/Footer.tsx`
- `FOOTER_DEFAULTS.email`: `"info@kuhniminsk.by"` → `"info@kuhniby.by"`

#### Изменено: `app/about/page.tsx`
- metadata title: "О компании — кухни на заказ в Минске" → "О компании КухниBY — кухни на заказ по Беларуси"
- metadata description: убран "в Минске", бренд исправлен на "КухниBY"
- JSON-LD `name`: "КухниMinsk" → "КухниBY"
- JSON-LD `description`: "в Минске и Минской области" → "по всей Беларуси"
- JSON-LD `email`: "info@kuhniminsk.by" → "info@kuhniby.by"
- Body: "КухниMinsk — производитель кухонь на заказ в Минске и Минской области" → бренд + охват исправлены

#### Изменено: `app/delivery-installation/page.tsx`
- metadata title: "Доставка и монтаж кухни в Минске" → "Доставка и монтаж кухни — КухниBY"
- metadata description: убрано "в Минске и Минской области" как единственный охват; добавлены все регионы
- Зоны доставки в body ("Доставка по Минску", "по Минской области") оставлены — это фактические ценовые зоны, не брендовое позиционирование

#### Изменено: `app/warranty/page.tsx`
- metadata description: убрано "Гарантийное обслуживание в Минске" — страница описывает общий сервис
- Body email: "info@kuhniminsk.by" → "info@kuhniby.by"

#### Изменено: `app/privacy-policy/page.tsx`
- metadata description: "КухниMinsk" → "КухниBY"
- Body: "КухниMinsk" → "КухниBY" (2 места)
- Body: "info@kuhniminsk.by" → "info@kuhniby.by" (2 места)

#### Изменено: `app/terms/page.tsx`
- metadata description: "КухниMinsk" → "КухниBY"
- Body: "kuhniminsk.by" → "kuhniby.by"
- Body: "КухниMinsk" → "КухниBY"

#### Изменено: `app/personal-data/page.tsx`
- metadata description: "КухниMinsk" → "КухниBY"
- Body: "kuhniminsk.by" → "kuhniby.by"
- Body: "info@kuhniminsk.by" → "info@kuhniby.by"
- Body: "КухниMinsk" → "КухниBY" (включая блок оператора данных)
- Физический адрес "г. Минск, ул. Притыцкого, 100" — оставлен (фактический адрес оператора)

#### Изменено: `app/contacts/page.tsx`
- metadata title: "Контакты — кухни на заказ в Минске" → "Контакты КухниBY — кухни на заказ по Беларуси"
- metadata description: "КухниMinsk" → "КухниBY", убрано "адрес в Минске" как позиционирование
- Body email: "info@kuhniminsk.by" → "info@kuhniby.by"
- Физический адрес "г. Минск, ул. Притыцкого, 100" — оставлен (фактические данные)
- Placeholder карты "Карта — г. Минск, ул. Притыцкого, 100" — оставлен

### Verified (не изменено)
- `app/page.tsx` JSON-LD `areaServed: { name: "Беларусь" }` — уже корректно ✓
- `app/page.tsx` `address.addressLocality: "Минск"` — физический адрес, оставлен ✓
- Footer city links `/locations/minsk`, `/locations/minskaya-oblast` — локальные SEO, оставлены ✓
- `/locations/*` pages — не тронуты ✓
- auth-логика, db schema — не тронуты ✓

---

## [Unreleased] — 2026-04-06 (Этап 1: Security & Housekeeping)

### Security
- **`lib/auth.ts` — убран небезопасный fallback secret**: вместо `process.env.SESSION_SECRET || "kuhni-minsk-secret-change-in-prod"` модуль теперь бросает `Error` при старте если `SESSION_SECRET` не задан. Никакого молчаливого fallback. `SESSION_SECRET` должен быть установлен через Replit Secrets (уже установлен). Commit: `4360f6c+`

### Fixed
- **`asChild` prop на DOM-элементе** — убран из `app/admin/kitchens/page.tsx` и `components/sections/PriceQuiz.tsx`. Кастомный `Button` не поддерживает Radix UI `asChild`. Заменено на `<Link className={buttonVariants(...)}>` и `<a className={buttonVariants()}>`. Устраняет React warning в консоли. Commit: `4360f6c`

### Changed
- **Trust bar (4 статистики) на мобильных** — переработан в вертикальный столбик компактных карточек (`sm:hidden`): иконка + заголовок + подзаголовок в одну строку. На планшетах+ — прежняя 4-column сетка. Commit: `ee78ce5`

### Chores
- **`.next/` удалён из git-индекса** — `git rm -r --cached artifacts/kuhni-na-zakaz/.next/` — 49 отслеживаемых build-файлов (manifests, webpack-кэш, server chunks) убраны из tracking. Файлы на диске сохранены. В следующих коммитах `.next/` отслеживаться не будет.
- **`.gitignore`** — расширен: добавлены `dist/`, `.pnpm-store/`, `*.log`, `coverage/`, `.nyc_output/`, `.turbo/`, `.cache/`, `.vercel/`, `.env.production`
- Не было конфликтов в build: TypeScript-типы корректны, все import-пути валидны

---

## [Unreleased] — 2026-04-06 (Admin UX audit: полнота редактирования без кода)

### Added (FAQ Admin — новый раздел)
- **API GET/POST `/kapi/admin/faq`** — список всех вопросов + создание нового
- **API PATCH/DELETE `/kapi/admin/faq/[id]`** — редактирование и удаление по ID
- **`/admin/faq` — новая страница** со списком FAQ:
  - Фильтр по странице сайта (Главная, Цены, Доставка и др.)
  - Добавление, редактирование, удаление вопросов прямо в браузере
  - Порядок отображения (кнопки ↑ / ↓ для каждого вопроса)
  - Раскрытие ответа по клику
  - Все поля: вопрос, ответ, страница, порядок
- **AdminSidebar** — добавлен пункт «FAQ — Вопросы и ответы» (HelpCircle icon)

### Added (Admin Leads — улучшения)
- **Поиск заявок** — строка поиска по имени, телефону, городу, тексту комментария (URL-based, GET-параметр `q`)
- **`LeadAssignedEditor`** — inline редактор ответственного менеджера (`assignedTo`) на каждой заявке (hover-to-edit, аналог LeadNoteEditor)
- `admin/leads/page.tsx` — интегрированы: поиск, LeadAssignedEditor, requireAdmin (server-side auth check)

### Changed (Dashboard)
- Карточка «Заявки» теперь показывает кол-во заявок со статусом `new` (не обработанных), не общее число
- Подпись карточки — если есть новые: «Ждут звонка — требуют внимания» с визуальным алертом
- Добавлен быстрый ярлык «Обработать новые заявки» в раздел «Быстрые действия»

### Technical Debt (задокументировано, не реализовано)
- **Статичные страницы** — контент О нас, Доставка, Гарантия, Политика конфиденциальности, Условия — захардкожен в JSX-файлах. Нет CMS-модели. Менеджер не может редактировать текст этих страниц без правки кода.

---

## [Unreleased] — 2026-04-06 (Этап 10: Персонализация и lead flow)

### Added (Schema)
- **Lead** модель — расширена 8 новыми полями:
  - `configSessionId String?` — link к сохранённой конфигурации
  - `scenarioSlug String` — сценарий использования
  - `styleSlug String` — интересующий стиль
  - `materialSlug String` — интересующий материал
  - `budgetLevel String` — бюджетный уровень (economy/standard/comfort/premium)
  - `status String` — статус ведения (new/contacted/working/done/lost)
  - `managerNote String` — заметка менеджера
  - `assignedTo String` — ответственный менеджер
- **SavedConfig** новая модель (анонимные конфигурации по sessionId):
  - sessionId (unique), answers Json, tags String[], styleSlug, materialSlug, scenarioSlug, budgetLevel, label, phone, leadId
- **FavoriteCase** новая модель (избранные кейсы по sessionId):
  - sessionId, caseSlug, @@unique([sessionId, caseSlug])

### Added (API)
- `POST/GET /kapi/saved-config` — сохранение и получение конфигурации по sessionId (upsert)
- `POST/GET /kapi/favorites` — toggle избранного кейса + список по sessionId
- `GET/PATCH /kapi/admin/leads/[id]` — GET кейса + PATCH статус/заметка/ответственный
- `GET /kapi/admin/saved-configs` — список сохранённых конфигураций для admin
- `/kapi/leads` POST — принимает 5 новых полей персонализации + обновляет SavedConfig.leadId

### Added (Frontend)
- `hooks/usePersonalization.ts` — localStorage sessionId + favorites + savedConfig (без аккаунта)
- `components/ui/FavoriteButton.tsx` — кнопка "В избранное" с heart-toggle (rose-themed)
- `components/sections/ConfigResultActions.tsx` — панель "Ваш вариант": Сохранить выбор + Отправить на просчёт (с inline-формой имя/телефон/город)
- `components/sections/SavedConfigBanner.tsx` — баннер "Продолжить ваш подбор" на конфигураторе (читает localStorage, показывается если есть saved config)
- `lib/lead-status.ts` — shared константы STATUS_OPTIONS (доступны и server, и client компонентам)

### Added (Admin UI)
- `app/admin/leads/page.tsx` — полный перепис:
  - Табы статусов (Все/Новая/Связались/В работе/Готово/Отказ) с счётчиками
  - Для каждой заявки: контакт, источник, config-блок с цветными тегами (стиль/материал/бюджет/сценарий)
  - Inline смена статуса через `LeadStatusControl`
  - Inline редактирование заметки менеджера через `LeadNoteEditor`
  - Кнопка "Позвонить" на каждой записи
- `components/admin/LeadStatusControl.tsx` — клиентский dropdown смены статуса
- `components/admin/LeadNoteEditor.tsx` — inline редактор заметки менеджера (hover-to-edit)
- `app/admin/saved-configs/page.tsx` — новая страница "Сохранённые подборы" в admin sidebar

### Changed (Pages)
- `configure/result/page.tsx` — добавлен блок `ConfigResultActions` (save + send) выше рекомендаций
- `configure/page.tsx` — добавлен `SavedConfigBanner` (показывается если пользователь ранее сохранял подбор)
- `portfolio/page.tsx` → `PortfolioFilters.tsx` — добавлен `FavoriteButton` на каждую карточку
- `portfolio/[slug]/page.tsx` — добавлен `FavoriteButton` рядом с заголовком кейса
- Admin sidebar — добавлен пункт "Сохранённые подборы" (Bookmark icon)

---

## [v9.0] — 2026-04-06 (Этап 9: Smart cross-linking system)

### Added
- **BlogPost schema — 3 новых поля** (`prisma db push`):
  - `relatedCaseSlugs String[]` — прикреплённые кейсы портфолио
  - `relatedStyleSlugs String[]` — прикреплённые стили кухонь
  - `relatedScenarioSlugs String[]` — прикреплённые сценарии использования
- **StylePage публичная страница** (`/styles/[slug]`) — новая секция «Работы в этом стиле» (сетка кейс-карточек из `relatedCaseSlugs`)
- **MaterialPage публичная страница** (`/materials/[slug]`) — новая секция «Работы из этого материала» (сетка кейс-карточек из `relatedCaseSlugs`)
- **PortfolioCase публичная страница** (`/portfolio/[slug]`) — виджет в sidebar «Кухни в вашем регионе»: авто-находит LocationPage по полю `city` (без ручной настройки)
- **BlogPost публичная страница** (`/blog/[slug]`) — полностью переработана:
  - Секция «Похожие проекты из портфолио» (карточки из `relatedCaseSlugs`)
  - Секция «Стили кухонь по теме» (из `relatedStyleSlugs`)
  - Секция «Подходит для вашего сценария» (из `relatedScenarioSlugs`)
  - Sidebar: форма захвата лида + блок «Другие статьи»
- **BlogPostForm** — новая панель «Связанный контент» (3 textarea для slug-ов кейсов/стилей/сценариев)
- **BlogPost API routes** (POST + PUT Zod schemas) — добавлены 3 новых поля в валидацию
- **Cross-link авто-сид** — `relatedCaseSlugs` заполнены для всех StylePage/MaterialPage/ScenarioPage по совпадению тегов:
  - `minimalizm` → uglovaya-kuhnya, malenkaya-kuhnya-studiya
  - `sovremennye` → kuhnya-s-ostrovom, kuhnya-do-potolka
  - `emal` → uglovaya-kuhnya, klassicheskaya, kuhnya-do-potolka
  - `semya-s-detmi` → skandinavskaya, kuhnya-do-potolka
  - (и т.д. для всех стилей/материалов/сценариев)

### Changed
- Zod BlogSchema (POST): добавлены relatedCaseSlugs/relatedStyleSlugs/relatedScenarioSlugs с `default([])`
- Zod BlogSchema (PUT): добавлены те же поля как optional

---

## [v8.0] — 2026-04-06 (Этап 8: LocationPage — расширенный контент и связи)

### Added
- **LocationPage schema — 7 новых полей** (мигрировано через `prisma db push`):
  - `localIntro String?` — уникальный вводный абзац для города
  - `uniquePoints Json?` — массив `{emoji, title, text}` — локальные преимущества с иконкой
  - `contentBlocks Json?` — массив `{title, text, type}` — текстовые блоки (type: "text"|"highlight")
  - `caseSlugs String[]` — вручную прикреплённые кейсы портфолио
  - `reviewIds Int[]` — вручную прикреплённые отзывы
  - `ctaHeadline String?` — кастомный заголовок CTA-блока
  - `ctaSubtext String?` — кастомный подзаголовок CTA-блока
- **Публичная `/locations/[city]/page.tsx` полностью переработана**:
  - Секция «Уникальный вводный текст» (localIntro)
  - Секция «Как мы работаем в [городе]» — карточки uniquePoints с emoji
  - Секция «Наши работы в [городе]» — прикреплённые + автонайденные кейсы
  - Секция «Отзывы из [города]» — прикреплённые + автонайденные отзывы
  - Секция «Дополнительные материалы» — contentBlocks (highlight выделяется фиолетовой рамкой)
  - Кастомный CTA с ctaHeadline/ctaSubtext или дефолтный текст
  - Safe cast `Array.isArray()` для всех JSON полей
- **DB seed Минск и Минская область** — заполнены uniquePoints (4 шт.) и contentBlocks (2 шт.) реальным уникальным контентом
- **LocationForm.tsx — полное обновление** (6 новых вкладок/секций):
  - Новая вкладка «Связи» — редакторы caseSlugs и reviewIds с тег-пилюлями
  - В вкладке «Контент» — редакторы localIntro, uniquePoints, contentBlocks с inline preview
  - В вкладке «Основное» — поля ctaHeadline и ctaSubtext
  - Все хелперы: add/remove для uniquePoints, contentBlocks, caseSlugs, reviewIds
- **Edit page** обновлён — корректный cast всех новых Json/Array полей при загрузке

---

## [Released] — 2026-04-06 (Этап 7: Система отзывов — расширение)

### Added
- **Review schema — 5 новых полей**: region, source, sourceUrl, featured, managerNote
- **Модерация (4 вкладки)**: Новые / На проверке / Опубликовано / Отклонено
- **Публичная /reviews** с секцией featured отзывов
- **SourceBadge** — бейджи источника (Google/Яндекс/2ГИС/Onliner/whatsapp/direct)
- **Связь с кейсом** через caseSlug
- **Полный workflow модерации** NEW→PENDING→PUBLISHED|REJECTED

---

## [Released] — 2026-04-06 (Этап 6: Конфигуратор кухни)

### Added
- **Prisma-модели (3 новых)**:
  - `ConfigStep` — шаги конфигуратора (key, question, hint, emoji, type, order, active)
  - `ConfigOption` — варианты ответа (key, label, description, emoji, `tags[]`, order, active) c Cascade-удалением
  - `ConfigResult` — сохранённые сессии (answers JSON, `tags[]` агрег., leadId)
- **8 шагов + 32 варианта посеяно** с тегами:
  - Планировка (straight/corner/u_shape/island)
  - Площадь (small/medium/large/xlarge)
  - Стиль (modern/scandinavian/minimalist/loft/classic/provence)
  - Приоритет (design/balance/practical/budget)
  - Дети (yes_small/yes_older/no)
  - Хранение (minimal/standard/lots/smart)
  - Техника (column/builtin/own)
  - Бюджет (economy/standard/comfort/premium)
- **API routes (6 новых)**:
  - `GET /kapi/configurator/steps` — активные шаги с опциями (публичный)
  - `POST /kapi/configurator/result` — сохранение сессии
  - `GET/POST /kapi/admin/configurator/steps` — CRUD шагов (admin)
  - `PATCH/DELETE /kapi/admin/configurator/steps/[id]`
  - `POST /kapi/admin/configurator/options` — создание варианта
  - `PATCH/DELETE /kapi/admin/configurator/options/[id]`
- **`/configure`** — публичная SSR-оболочка конфигуратора
- **`ConfiguratorFlow.tsx`** — 8-шаговый wizard (client):
  - Загрузка шагов из DB через `/kapi/configurator/steps`
  - Прогресс-бар + точки шагов (активная = широкая)
  - Авто-переход (300мс) после выбора варианта
  - Кнопка «Пропустить» для необязательных шагов
  - При завершении: агрегация тегов → save → redirect с `?tags=...`
- **`/configure/result`** — SSR страница результата:
  - Парсинг тегов из query params
  - Маппинг tag-ключей → DB slugs (`style:scandinavian` → `skandinavskie`)
  - Блок стилей (StylePage), материалов (MaterialPage), кейсов (PortfolioCase)
  - CTA: калькулятор с предзаполненными ответами, форма замера
  - Кнопка «Пройти заново»
- **`/admin/configurator`** — admin CRUD:
  - Счётчик пройденных сессий
  - Пояснение логики тегов
  - `ConfigStepsEditor.tsx` — раскрываемые шаги, inline-редактирование
  - `OptionRow` — редактирование варианта: label/emoji/desc/tags с цветными бейджами по префиксу
  - Создание новых шагов и вариантов через форму
  - Управление активностью (show/hide)
- **Навигация** — «Подбор кухни» в публичном хедере, «Конфигуратор» в admin sidebar

### Architecture
- Тег формат: `prefix:value` (style:scandinavian, budget:standard, material:veneer…)
- Рекомендации строятся сервером на основе собранных тегов без хардкода
- Admin меняет теги вариантов → рекомендации меняются автоматически

---

## [Unreleased] — 2026-04-06 (Этап 5: Калькулятор с DB-driven PriceRules)

### Added
- **Prisma-модель `PriceRule`** — 34 правила посеяно в 8 категориях:
  - `material` (5 правил) — базовые цены фасадов (BYN/м²)
  - `layout` (4) — коэффициенты планировки
  - `style` (6) — коэффициенты стиля
  - `countertop` (4) — надбавки за столешницу
  - `hardware` (3) — надбавки за фурнитуру (BYN/м²)
  - `tech` (3) — надбавки за встроенную технику
  - `priority` (4) — корректировки приоритета клиента
  - `config` (5) — параметры расчёта (диапазон, мин/макс/дефолт площадь)
- **`/kapi/calculator` (POST)** — API расчёта стоимости. Формула:
  `base = material/м² × area × layoutCoeff × styleCoeff + countertop + hardware/м² × area + tech`
  `→ × (1+priority) → × rangeLow..rangeHigh → round50`
- **`/kapi/admin/prices` (GET/PUT)** — просмотр и bulk-обновление правил
- **`/kapi/admin/prices/[id]` (PATCH)** — обновление одного правила
- **`/admin/prices`** — полностью переписана: DB-driven, группировка по категориям, формула в подсказке
- **`PriceRulesEditor.tsx`** — клиентский компонент редактора:
  - Группировка по 8 категориям, каждая сворачивается/разворачивается
  - Inline-редактирование value/label/description
  - Sticky save-bar при наличии несохранённых изменений
  - Batch PATCH через `/kapi/admin/prices` (PUT)
- **`/calculator`** — публичная страница калькулятора (SSR)
- **`CalculatorWizard.tsx`** — 8-шаговый клиентский визард:
  - Шаги: планировка, площадь (слайдер), стиль, материал, столешница, фурнитура, техника, приоритет
  - Авто-переход после выбора варианта (260мс)
  - Результат: диапазон цен + факторы + CTA-форма замера
  - Быстрые кнопки площади (8/12/16/20/24/28 м²)
- **Навигация** — добавлена ссылка «Калькулятор» в десктопное и мобильное меню

---

## [Unreleased] — 2026-04-06 (Этап 4: PortfolioCase как полноценные кейс-стади)

### Added
- **Расширена Prisma-модель `PortfolioCase`** — добавлено 15+ полей:
  - `region`, `layout`, `completedAt` — география и планировка
  - `constraints`, `result` — история проекта: ограничения + результат
  - `photosBefore[]`, `photosAfter[]` — блок «До и После»
  - `reviewIds[]` — привязка отзывов к кейсу
  - `featured`, `order` — управление приоритетом отображения
  - `styleSlug`, `materialSlugs[]`, `scenarioSlugs[]` — внутренние ссылки по slug
  - `seoKeywords` — SEO ключевые слова кейса
- **Добавлено поле `caseSlug` в модель `Review`** — привязка отзыва к конкретному кейсу
- **6 богатых кейсов посеяно** в БД:
  - `uglovaya-kuhnya-minimalizm-minsk-kirova` — Угловая, 14 м², минимализм, Минск
  - `skandinavskaya-kuhnya-borisov-chastniy-dom` — П-образная, 16 м², скандинав, Борисов
  - `kuhnya-s-ostrovom-minsk-partizansky` — С островом, 22 м², современный, Минск ★ featured
  - `klassicheskaya-kuhnya-molodechno-chastniy-dom` — Классика с патиной, 18 м², Молодечно
  - `malenkaya-kuhnya-studiya-suharyovo` — Студия, 6 м², минимализм, Минск
  - `kuhnya-do-potolka-minsk-vostok` — До потолка, 12 м², современный, Минск
- **Обновлены API routes** `/kapi/admin/portfolio` (GET/POST) и `/kapi/admin/portfolio/[id]` (GET/PUT/DELETE):
  - Переход с `@/lib/prisma` → `@/lib/db`
  - Убрана зависимость `zod` — упрощённая обработка данных
  - GET-список сортирует по `order asc, createdAt desc`
- **`PortfolioCaseForm.tsx`** — полностью перестроена под 4 вкладки:
  - **Основное**: название, slug, город/регион/дата, площадь/планировка/срок, цена, стиль, материалы, сценарии, краткое описание, featured/published/order
  - **История проекта**: задача клиента, ограничения, решение, результат (свободный текст)
  - **Фото**: главное фото, галерея, фото до/после с превью
  - **SEO**: live-превью поиска Google, title/description/keywords с счётчиком символов
- **Создана страница** `/admin/portfolio/[id]/page.tsx` — редактирование существующего кейса
- **Обновлён** `/admin/portfolio/page.tsx` — сортировка по order+date, кнопка «На сайте» (открывает публичную страницу)
- **Перестроен** `/portfolio/page.tsx` — Server Component (прямой запрос Prisma), использует `PortfolioFilters`
- **Создан** `components/portfolio/PortfolioFilters.tsx` — клиентский компонент фильтрации (стиль / площадь / бюджет) без перезагрузки страницы
- **Перестроен** `/portfolio/[slug]/page.tsx` — полный кейс-стади:
  - Плашки стиля/планировки/featured
  - Specs strip (город, площадь, планировка, материал, срок, дата)
  - Ценовой блок с CTA → калькулятор
  - История: Задача → Ограничения → Решение → До/После → Результат
  - Отзывы клиента (если привязаны через reviewIds)
  - Внутренние ссылки: стиль, материалы, сценарии — из БД
  - Похожие проекты (другие кейсы, 3 штуки)
  - Sticky sidebar: ContactForm + характеристики + навигация
  - JSON-LD Article + BreadcrumbList + generateMetadata (seoTitle/seoDescription/seoKeywords)

### Changed
- API routes портфолио: избавились от `zod`, переход на `@/lib/db`
- Публичный список портфолио теперь Server Component (SEO-friendly, нет client fetch)

---

## [Unreleased] — 2026-04-05 (Этап 3: StylePage + MaterialPage как SEO-посадочные)

### Added
- **Расширена Prisma-модель `StylePage`** — добавлено 12 полей: `headline`, `intro`, `suitableFor[]`, `pros[]`, `cons[]`, `careGuide[]`, `pairsWith[]`, `budgetLevel`, `relatedMaterials[]`, `relatedCaseSlugs[]`, `relatedScenarioSlugs[]`, `seoKeywords`, `order`, `updatedAt`
- **Расширена Prisma-модель `MaterialPage`** — добавлено 12 полей: `headline`, `intro`, `suitableFor[]`, `careGuide[]`, `budgetLevel`, `pricePer`, `relatedStyles[]`, `relatedCaseSlugs[]`, `relatedScenarioSlugs[]`, `seoKeywords`, `order`, `updatedAt`
- **5 стилей посеяно** с богатым контентом (suitableFor, pros, cons, careGuide, pairsWith, relatedMaterials, relatedScenarioSlugs, SEO):
  - `sovremennye` — Современный (Средний, от 1 800 BYN)
  - `klassicheskie` — Классический (Премиум, от 3 500 BYN)
  - `skandinavskie` — Скандинавский (Средний, от 2 000 BYN)
  - `minimalizm` — Минимализм (Средний, от 2 200 BYN)
  - `loft` — Лофт (Средний, от 2 500 BYN)
- **5 материалов посеяно** с богатым контентом (pros, cons, suitableFor, careGuide, relatedStyles, relatedScenarioSlugs, SEO):
  - `mdf` — МДФ с плёнкой ПВХ (Экономный, от 1 200 BYN)
  - `plastik` — HPL и акрил (Средний, от 1 500 BYN)
  - `emal` — Эмаль матовая (Выше среднего, от 2 200 BYN)
  - `shpon` — Натуральный шпон (Премиум, от 3 200 BYN)
  - `egger` — ЛДСП EGGER (Экономный, от 900 BYN)
- **API routes для стилей**: `/kapi/admin/styles` (GET/POST) + `/kapi/admin/styles/[id]` (GET/PUT/DELETE)
- **API routes для материалов**: `/kapi/admin/materials` (GET/POST) + `/kapi/admin/materials/[id]` (GET/PUT/DELETE)
- **StyleForm** (`components/admin/StyleForm.tsx`) — 4-вкладочная форма: Основное / Контент / Связи / SEO
- **MaterialForm** (`components/admin/MaterialForm.tsx`) — 4-вкладочная форма: Основное / Контент / Связи / SEO
- **Admin страницы для стилей**: `/admin/styles`, `/admin/styles/new`, `/admin/styles/[id]`
- **Admin страницы для материалов**: `/admin/materials`, `/admin/materials/new`, `/admin/materials/[id]`
- **Перестроен `/styles/page.tsx`** — карточки с бюджетным уровнем, первый плюс, step-блок «Как получить консультацию», ContactForm внизу, JSON-LD ItemList
- **Перестроен `/styles/[slug]/page.tsx`** — H1 + intro + плашка бюджета + цена с кнопкой → калькулятор + блок «Кому подходит» + «Плюсы и минусы» + «Советы по уходу» + «Сочетается с» + «Рекомендуемые материалы» + «Подходящие сценарии» + sticky sidebar с FormContact + быстрые факты + навигация по стилям. JSON-LD Article + BreadcrumbList
- **Перестроен `/materials/page.tsx`** — таблица сравнения (плюс/минус первый, цена, бюджет) + карточки с pros/cons, ContactForm внизу, JSON-LD ItemList
- **Перестроен `/materials/[slug]/page.tsx`** — полноценная SEO-посадочная: headline + intro + цена → калькулятор + «Плюсы и минусы» + «Кому подходит» + «Уход» + «Подходящие стили» + «Сценарии использования» + sticky sidebar + навигация по материалам. JSON-LD Article + BreadcrumbList
- **Внутренняя перелинковка**: стили↔материалы, стили↔сценарии, материалы↔стили, материалы↔сценарии — все из БД
- **AdminSidebar** — добавлены «Стили кухонь» (Palette) и «Материалы» (Layers) в раздел Структура

### Changed
- 16 файлов изменено/создано в этом этапе

## [Unreleased] — 2026-04-05 (ScenarioPage system)

### Added
- **Prisma model `ScenarioPage`** — 20+ fields: slug, icon, badge, title, headline, intro, needs[], solutions[], features (JSON), tips[], relatedStyles[], relatedMaterials[], relatedCaseSlugs[], SEO fields (seoTitle, seoDescription, seoKeywords), ctaText, ctaHref, order, published, timestamps
- **6 unique scenarios seeded** with full content (not clones):
  - `semya-s-detmi` — Кухня для семьи с детьми (badge: Популярный)
  - `malenkaya-kukhnya` — Маленькая кухня 5–8 м² (badge: Запрос №1)
  - `kukhnya-gostinaya` — Кухня-гостиная (открытое пространство)
  - `lyublyu-gotovit` — Кухня для тех, кто любит готовить (badge: Для гурмана)
  - `bez-pereplaty` — Кухня без переплаты (badge: Выгодно)
  - `maksimum-khraneniya` — Хочу максимум хранения
- **API routes** — `/kapi/admin/scenarios` (GET/POST) + `/kapi/admin/scenarios/[id]` (GET/PUT/DELETE)
- **Admin pages**:
  - `/admin/scenarios` — список с таблицей (эмодзи, badge, URL, связи, статус)
  - `/admin/scenarios/new` — создание сценария
  - `/admin/scenarios/[id]` — редактирование с 4 вкладками
- **ScenarioForm component** (`components/admin/ScenarioForm.tsx`) — 4-вкладочная форма:
  - Вкладка «Основное»: slug, icon, badge, title, headline, intro, CTA, порядок
  - Вкладка «Контент»: потребности (needs), решения (solutions), особенности (features), советы (tips) — все динамические списки с +/−
  - Вкладка «Связи»: relatedStyles[], relatedMaterials[], relatedCaseSlugs[]
  - Вкладка «SEO»: seoTitle, seoDescription, seoKeywords + превью в поиске
- **Публичные страницы**:
  - `/scenarios` — index с 6 карточками, JSON-LD ItemList, breadcrumb
  - `/scenarios/[slug]` — полноценная страница (hero + needs/solutions + features + related cases/styles/materials + tips + other scenarios + ContactForm), JSON-LD Article + BreadcrumbList
- **AdminSidebar** — добавлен пункт «Сценарии выбора» с иконкой Route

## [Unreleased] — 2026-04-05

### Added
- **HomepageBlock system** — Prisma model + 21 DB-seeded blocks (5 scenarios, 6 steps, 6 advantages, 4 trust items)
- **Admin: Главная страница** (`/admin/homepage`) — full CRUD, publish/hide toggle, filter by type, stats
- **API routes** — `/kapi/admin/homepage` (GET/POST) + `/kapi/admin/homepage/[id]` (PUT/DELETE)
- **New homepage** (`app/page.tsx`) — fully DB-driven with SSR fallbacks, JSON-LD, all-Belarus positioning
  - Hero: deep purple gradient, animated trust badges
  - "С чего хотите начать?" — 5 scenario cards from DB
  - Trust stats strip (4 counters from DB)
  - Portfolio preview (3 most recent cases)
  - Catalog (7 kitchens or 6 static category cards)
  - "Как проходит заказ" — 6 steps from DB on dark background
  - "Почему выбирают нас" — 6 advantage cards from DB
  - Guarantees section (Shield, Clock, FileCheck, MapPin)
  - Reviews grid (4 most recent PUBLISHED reviews)
  - FAQ section
  - CTA banner + ContactForm
- **AdminSidebar** — "Главная страница" link (Home icon) added to Структура group

### Fixed
- `ReviewStatus.APPROVED` → `ReviewStatus.PUBLISHED` in `/locations/[city]/page.tsx` (bug: reviews never showed on city pages)
- Catalog meta title: "в Минске" → "по Беларуси"
- Reviews meta title: "в Минске" → "по всей Беларуси"
- Portfolio meta description: Минск → вся Беларусь

---

## 2026-04-04

### Added
- **LocationPage system** — 15+ Prisma fields, CRUD admin (5-tab LocationForm), public `/locations/[city]` pages
- Prisma schema extended: `HomepageBlock` model added
- 3 LocationPages seeded: Минск, Минская область, Борисов
- JSON-LD on location pages: LocalBusiness + FAQPage + BreadcrumbList

### Fixed
- ReviewStatus enum — standardised to PUBLISHED across all pages

---

## Earlier milestones

- Telegram webhook for leads → `/kapi/leads`
- KitchenForm with city prop and honeypot
- Dynamic Header/Footer from DB (SiteSettings)
- Admin roles: SUPER_ADMIN, MANAGER, GUEST
- Guest temporary access with token + expiry
- Review moderation (NEW → PENDING → PUBLISHED / REJECTED)
- Activity log for admin actions
- SEO: sitemap.xml, robots.txt, JSON-LD, BreadcrumbList
- All public pages: catalog, portfolio, reviews, blog, prices, contacts, warranty, etc.

## Этап 7 — Система отзывов и доверия ($(date +%Y-%m-%d))

### Prisma: 5 новых полей в Review
- `region String @default("")` — регион Беларуси (Минская обл., г. Минск, Брестская обл. и т.д.)
- `source String @default("website")` — источник: website | google | yandex | telegram | instagram | vk | direct
- `sourceUrl String @default("")` — ссылка на оригинальный отзыв (для Google, Instagram и т.д.)
- `featured Boolean @default(false)` — избранный отзыв (отдельная секция на странице)
- `managerNote String @default("")` — внутренняя заметка менеджера (не публикуется)

### API
- `POST /kapi/reviews` — расширен полями `region`, `source`, `caseSlug`
- `PATCH /kapi/admin/reviews/[id]` — два режима:
  - action-режим: `publish | reject | delete | pending` с `reason`, `managerNote`
  - edit-режим: `featured`, `caseSlug`, `source`, `sourceUrl`, `region`, `managerNote`
- `GET /kapi/admin/reviews/[id]` — получить отдельный отзыв (для admin)

### Workflow модерации (4 статуса)
NEW → PENDING → PUBLISHED | REJECTED → (повторная публикация возможна)

### Компоненты
- `ReviewModerationList.tsx` — полный переписан:
  - 4 вкладки: Новые / На проверке / Опубликовано / Отклонено
  - Цветная левая граница по статусу
  - `SourceBadge` (Google, Telegram, Instagram, ВКонтакте, сайт)
  - Бейдж "Избранный" + toggle
  - Collapse/expand длинного текста
  - Связанный проект: slug → ссылка + название кейса
  - Ссылка на оригинал (sourceUrl)
  - Поле менеджерской заметки (не публикуется)
  - Inline редактирование source + caseSlug
  - Reject с вводом причины
  - Кнопка "На проверку" (PENDING) для двухэтапной модерации

### Публичная страница /reviews
- Секция "Избранные отзывы" (карточки с border-primary)
- Связь с PortfolioCase → ссылка "Смотреть проект"
- Источник отзыва (Google, Telegram, Instagram) — в подписи
- Регион — рядом с городом
- Убраны статические fallback-данные (только DB)
- JSON-LD Schema.org Review + AggregateRating корректен
- Уведомление о модерации в форме

### Данные
- Все 5 существующих отзывов получили: region, source, caseSlug, featured
- Добавлен NEW отзыв (Светлана Петрова, Гродно) — для тестирования очереди
- Добавлен PENDING отзыв (Андрей Козловский, Брест) с managerNote
