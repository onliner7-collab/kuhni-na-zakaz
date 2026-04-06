# Changelog — КухниBY

## [Unreleased] — 2026-04-06 (Этап 6: Конфигуратор кухни)

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
