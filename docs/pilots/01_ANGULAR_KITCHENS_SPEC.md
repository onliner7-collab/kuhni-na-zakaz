# Спецификация `/catalog/uglovye-kuhni`

Статус: `AUDITED`, `DESIGNED`; не `IMPLEMENTED` в рамках этапа 2.

## Reverse-audit

### Структура

- Route: `artifacts/kuhni-na-zakaz/app/catalog/[slug]/page.tsx`, 78,822 bytes / 1044 lines; Server Component, `force-static`, `revalidate=3600`.
- Pilot branch: server `components/catalog/angular-kitchens/AngularKitchenPage.tsx`, 12,394 bytes / 107 lines.
- Интерактив: client `AngularKitchenShowroom.tsx`, 16,706 bytes / 220 lines; hooks: 6 `useState`, 1 `useMemo`.
- Дочерние client surfaces: `AngularKitchenShowroom`, shared `ContactForm`; shared public chrome/Dock гидратируется глобально.
- Dynamic imports в pilot files отсутствуют. Внешние runtime imports: React, Next/link abstraction, Lucide; Three/Framer/R3F не используются.
- Данные pilot slug статические. Route умеет Prisma fallback для других slugs, но `uglovye-kuhni` использует `STATIC_CATEGORIES`.

### Текущий UX и media

- Full-height hero, 3 ракурса, 3 типа угла, 3 системы хранения, slider 12 кадров, два dimension sliders, сравнение, материалы, ссылки, зона работы и форма.
- На 390 px: 700 DOM elements, 5 `<img>` в текущем state, 1 eager + 4 lazy, 0 overflow, main около 9709 px.
- Pilot media group: 63 files = 21 masters PNG + 21 AVIF + 21 WebP, 44.3 MB; видимые src используют AVIF/WebP.
- Нет touch swipe у ракурсов; только кнопки. Slider кадра меняет src по состоянию, но нет явной стратегии prefetch соседних кадров/error fallback.
- Tabs имеют `role=tab`, но нет `aria-controls`, tabpanel relation и Arrow key navigation.
- Сохраняем: русские alt/caption, disclosure AI, fixed dimensions, один eager hero, lazy ниже fold, кнопки 44+ в интерактиве.

### SEO и конверсия

- Current title: `Купить угловую кухню на заказ в Минске | КухниBY`; description закрепляет Минск, хотя целевой кластер пилота нерегиональный.
- H1: `Угловая кухня на заказ под ваши размеры`; canonical корректный.
- JSON-LD: BreadcrumbList, Product/Offer, FAQPage и ImageObject. FAQ берётся из static data, но текущий pilot UI не выводит эти вопросы; schema не подтверждена видимым содержимым.
- Static data содержит сроки `до 3 рабочих дней`, `18–28 рабочих дней`, `1–2 дня`, а также гарантийные/материальные claims. Они не должны автоматически попасть в новую спецификацию без подтверждения.
- Primary CTA сейчас форма `Рассчитать угловую кухню`; secondary CTA ведёт на `/design-proekt-kuhni`. Иерархия соответствует целевой конверсии.
- Cannibalization: коммерческий category должен владеть `купить/заказать/цена/под размер`; `/blog/uglovaya-kuhnya-razmery-planirovka` — размеры и ошибки; `/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat` — информационное сравнение; `/scenarios/dlya-malenkoy-kuhni` — бытовой сценарий.

## Целевая роль

Primary question: «Подойдёт ли угловая кухня моему помещению и как не потерять доступ к углу?»

Primary cluster: `купить угловую кухню`, `угловая кухня на заказ`, `заказать угловую кухню`, `угловая кухня под размер`, `угловые кухни цена`.

Secondary language: `угловой кухонный гарнитур`, `кухня буквой Г`, `маленькая угловая кухня`, `угловая кухня до потолка`, `угловая кухня с окном`. Не создавать city-combination URLs.

## Mobile flow 360–412 px

1. Hero: один portrait visual угла, H1, короткое обещание, CTA `Проверить планировку` и disclosure.
2. `SwipeGallery`: нативный horizontal snap, 3 ракурса; видимый cue, counter, Prev/Next и keyboard fallback.
3. `CornerTypeSelector`: рабочий угол / мойка / хранение; результат — короткая рекомендация и ограничения.
4. `CornerStorageExplorer`: закрытое состояние → действие → открытое состояние; без autoplay.
5. `MechanismComparison`: полка / карусель / выдвижная система в одинаковом ракурсе.
6. `StorageUseCases`: крупная посуда / ежедневные запасы / редко используемое; HTML cards без обязательного JS.
7. `KitchenLayoutCheck`: две стены, окно/дверь/коммуникации как вопросы, не как технический расчёт.
8. `MaterialSwatches`: 4–6 вариантов с переходами в materials; не делать фотореалистичный configurator.
9. `CostFactors`: длина плеч, угол, фасады/столешница, ящики; без фиктивной точной цены.
10. `RelatedProjects`: только подтверждённые реальные проекты; иначе переход в общее портфолио с честной подписью.
11. `ServiceArea`: кратко, без city-keyword multiplication.
12. `LeadFormSheet`/inline form: предварительный расчёт по размерам/фото.

Один экран решает одну задачу. Секции 4–7 можно объединить только если initial DOM и смысл остаются компактными.

## CornerStorageExplorer contract

- Initial state: poster закрытого угла и три текстовых варианта доступны в HTML.
- Trigger: tap/click/Enter/Space или horizontal slider; drag не является единственным способом.
- State: `mechanism`, `progress`, `hasUserIntent`; URL state не нужен.
- Media: poster + 6–12 последовательных кадров на один механизм; соседний кадр prefetch только после intent.
- Feedback: progress `1/12`, краткое назначение, доступ к содержимому; `aria-live=polite` только для итогового описания.
- Reduced motion: без interpolation/autoplay; discrete previous/next и статические open/closed states.
- Failure: poster, текст и сравнение остаются; control скрывается при недоступной sequence.

## Dock и CTA

- Dock: `Планировка` → `#planning`; `Внутри` → `#inside`; `Цена` → `#price`; `Рассчитать` → `#calculate`/form sheet.
- Primary conversion: предварительный расчёт угловой кухни.
- Dock скрывается при focus в форме/sheet, учитывает safe-area и имеет 104+ px content compensation.

## Preserve / remove / redesign

- Preserve: route branch, server page, canonical, breadcrumb, form/API, Dock labels, media disclosure, price-factor semantics, material/blog links.
- Remove during implementation: duplicate decorative cards, invisible FAQ schema, unsupported timelines/guarantees, city-stuffed title direction, non-semantic tabs.
- Redesign: gallery to real swipe+buttons; explorer to intent-loaded sequence; dimension check to questions and disclaimer; hero composition distinct from Borisov.

## Desktop

- Та же IA, не отдельная desktop story. Hero может стать split-view, explorer — media + comparison rail. Не загружать больше media только из-за ширины.
