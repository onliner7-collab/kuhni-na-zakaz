# Спецификация `/materials/furnitura`

Статус: `AUDITED`, `DESIGNED`; не `IMPLEMENTED` в рамках этапа 2.

## Reverse-audit

### Структура

- Route: `artifacts/kuhni-na-zakaz/app/materials/furnitura/page.tsx`, 34,556 bytes / 538 lines; Server Component со статическими данными.
- Client islands: `components/materials/hardware/HardwareShowroom.tsx`, 11,876 bytes / 121 lines; `FurnituraHardwareGallery.tsx`, 6101 bytes / 143 lines; child `ImageLightbox`; shared `ContactForm`.
- Hooks: `HardwareShowroom` — 3 `useState`, 1 `useMemo`; gallery — 2 `useState`, 2 `useMemo`.
- Gallery source: `lib/furnitura-gallery-registry.ts`, 74,672 bytes / 1366 lines, 201 records. Все 201 WebP существуют.
- Dynamic imports отсутствуют. Runtime imports: React, Next Image, Lucide и local UI; Three/WebGL/Framer не используются.
- DB не используется.

### Текущий UX и performance

- На 390 px: 2894 DOM elements, 203 image elements, 220 buttons, 202 lazy images, 1 eager hero, 0 horizontal overflow, main около 57,839 px.
- Существующая сборка подключает около 1030.5 KiB raw local JS; это не transfer size. Риск DOM подтверждён сильнее, чем относительная JS-разница.
- Pilot media group: 18 files = 6 PNG masters + 6 AVIF + 6 WebP, 12.3 MB. Legacy gallery: 201 WebP + registry JSON, около 8.76 MB.
- Lazy loading ограничивает initial network, но не стоимость 201 React elements, buttons, image wrappers, accessibility tree и layout.
- `HardwareShowroom` переключает четыре готовых изображения кнопками. Это не пространственные hotspots и не демонстрация движения механизма.
- Большая gallery повторяет одинаковую механику для сотен кадров; на mobile пользователь теряет сценарий выбора.
- Таблица имеет `min-width:760px` во внутреннем horizontal scroller. Page overflow отсутствует, но comparison требует более подходящего mobile pattern.

### SEO и claims

- Title: `Фурнитура для кухни: петли и направляющие | КухниBY`; description и H1 соответствуют теме; canonical корректный.
- JSON-LD: BreadcrumbList, WebPage, Article, FAQPage и 12 ImageObject. Article direction спорна для commercial/selection landing; `datePublished/dateModified` должны отражать подтверждённый editorial history.
- FAQ видим и соответствует schema — это лучше двух других пилотов.
- Current copy содержит `срок службы`, `нагрузку`, `надежные`, `выдерживают`, уровни `Эконом/Премиум`, а также общие брендовые/ресурсные тезисы. Без официальных manufacturer sources нельзя добавлять численные нагрузки, циклы, гарантии или превосходство бренда.
- Cannibalization: landing владеет выбором механизма и уровня комплектации; `/blog/kuhni-blum-hettich-gtv` должен владеть информационным brand comparison с источниками; budget article — общим чтением сметы.

## Целевая роль

Primary question: «Как работает механизм, какой уровень удобства мне нужен и где экономия станет неудобством?»

Primary cluster: `фурнитура для кухни`, `кухонная фурнитура`, `механизмы для кухонных шкафов`, `петли с доводчиком`, `направляющие для кухни`, `какую фурнитуру выбрать для кухни`, `Blum Hettich GTV для кухни`.

Brand phrase допускается как навигационный/сравнительный язык, но landing не заявляет победителя без официальных данных.

## Mobile flow 360–412 px

1. Hero `виртуальный шкаф`: один cabinet poster, H1, CTA `Выбрать механизм`, disclosure technical illustration.
2. `HardwareCabinetExplorer`: spatial hotspot list + equivalent text controls.
3. `DrawerMotionDemo`: закрыто → частично → полностью; intent-loaded frames.
4. `RunnerCutaway`: технический разрез и краткое объяснение без неподтверждённых параметров.
5. `MechanismComparison`: частичное/полное выдвижение в одинаковом масштабе.
6. `HingeExplorer`: обычная/с доводчиком как сценарий, не обещание ресурса.
7. `LiftMechanismExplorer`.
8. `CargoExplorer`: бутылочница/карго.
9. `CornerSystemLink`: кратко + ссылка на угловые кухни, без дублирования CornerStorageExplorer.
10. `WasteSortingOptions`.
11. `PackageLevelComparison`: базовый / ежедневный комфорт / расширенный; без `премиум лучше`.
12. `DoNotBlindlyEconomize`: петли частых фасадов, основные ящики, крепёж — как вопросы к проектировщику.
13. `HardwarePicker`: 3–5 вопросов, результат и передача summary в форму.
14. `RelatedLinks`: материалы, угловые/маленькие/до потолка, цены.
15. CTA `Подобрать уровень фурнитуры для кухни`.

Legacy gallery не является отдельным последовательным шагом. Она доступна по `Посмотреть больше примеров`, монтирует одну категорию и ограниченное число кадров по intent.

## HardwareCabinetExplorer contract

- Server fallback: статическая схема шкафа и список зон `Петля / Ящик / Верхний фасад / Узкий модуль / Угол` с HTML-описаниями.
- Client state: `activeZone`, optional `motionState`, `hasUserIntent`.
- Trigger: hotspot 44+ px и дублирующая button list; hover никогда не обязателен.
- Media: один consistent cabinet base, отдельные close/open/cutaway states; не смешивать разные кухни как кадры одной анимации.
- Feedback: название, назначение, где применяется, что уточнить в проекте. Без числовых нагрузок/циклов.
- Accessibility: hotspot имеет accessible name; `aria-controls/expanded`; logical focus order; изображение не является единственным носителем информации.
- Reduced motion: мгновенное переключение static states; последовательность заменяется closed/open pair.
- Lazy loading: base poster near hero; zone media только после intent; не preload all zones.
- Failure: текст и links работают, poster остаётся, interactive control скрывается.

## Dock и CTA

- Dock: `Механизмы` → `#mechanisms`; `Сравнить` → `#compare`; `Комплектация` → `#package`; `Подобрать` → `#pick`/form sheet.
- Primary conversion: подбор уровня фурнитуры.

## Preserve / remove / redesign

- Preserve: server route, canonical/H1, visible FAQ, breadcrumb, Dock, ContactForm, Russian alt, 6 pilot visual families, no WebGL.
- Remove during implementation: 201-image initial gallery tree, repeated five-column category cards, unsupported resource/brand claims, Article/ImageObject excess when not justified.
- Redesign: button list → cabinet explorer with text fallback; comparison table → mobile cards; levels → scenario-based choices; gallery → intent-mounted category sheet.

## Не придумывать

Нагрузки, циклы, сроки службы, гарантию, технические параметры и превосходство Blum/Hettich/GTV. Эти данные добавляются только со ссылкой на актуальный официальный документ производителя и с точным product/series scope.
