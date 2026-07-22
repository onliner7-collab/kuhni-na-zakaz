# Handoff

> **Актуальное уточнение 2026-07-19:** исторические блоки ниже сохранены для audit trail. Текущий implementation contract и следующий шаг определяются секциями `2026-07-19 — полный пакет ТЗ интерактивного хаба` и `design/10-implementation-qa-rollout.md` в конце файла.

## Current stage

Product Architecture этапа 4.5 завершена как docs-only работа на ветке `work`. Созданы `docs/product/00_*`–`11_*`, обновлены master docs, Page/Component Registry, Decision Log и этот Handoff. Production-код, UI, routes, metadata, sitemap, robots, forms, Prisma и media не менялись; deploy сайта не требуется и не выполняется.

Production runtime остаётся на проверенном baseline единой Lead/Telegram системы: commit после deploy/fixes `1376c9149a8e12b45710495accd8ca62930f2d02`; более поздние docs commits не означают runtime UI change. Исторический stage 5 `/catalog/uglovye-kuhni` остаётся live и принят.

## Product Architecture 4.5 completed

- Пользовательский путь: `форма → стиль → назначение → материалы и механизмы → наши работы → цена → заявка`.
- «Выбрать кухню» — карточная группа меню, не новый URL.
- `/catalog` получает пользовательское имя «Идеи кухонь» и допускает концепты/визуализации.
- `/portfolio` получает имя «Наши работы» и допускает только подтверждённые реальные объекты.
- Всё без подтверждённого происхождения считается идеей/визуализацией.
- Глобальный mobile Dock: `Выбрать / Цены / Наши работы / Оставить заявку`, один порядок на всех public UI routes.
- Dock включается на `/calculator` и legal. Исключения: `/admin`, `/kapi`, `/robots.txt`, `/sitemap.xml`, `/thanks`, API/route handlers и технические непользовательские поверхности.
- Page-specific действия переводятся в нефиксированный `PageActionRail`; второй fixed Dock запрещён.
- `FloatingSocialButtons` сохраняется без изменения поведения.
- Первый шаг заявки: имя, телефон или способ связи, submit; дополнительные поля необязательны. Действующая Lead/Telegram/outbox модель сохраняется.

## Verified current mismatches

- Главная выводит запрещённую подпись «SEO-страница категории».
- Главная называет смешанный набор «Реальные кухни, которые уже установлены», хотя внутри есть 3D-визуализации.
- `/portfolio` добавляет `GENERATED_MINSK_PORTFOLIO_CASES`; текущая DB/path-классификация не является достаточным provenance gate.
- Текущий `MobileBottomNav` меняет все четыре действия по маршруту и не соответствует новому постоянному global contract.
- `/styles` и `/scenarios` hubs не закрывают полную контекстную цепочку выбора.

Эти расхождения записаны как backlog. Stage 4.5 не исправляет production UI.

## Stage 4.5 verification

- Создано 12 обязательных файлов `docs/product/00_*`–`11_*`.
- В commit этапа подготовлены 22 файла только из `AGENT.md` и `docs/**`; две появившиеся параллельно незастейдженные правки `artifacts/kuhni-na-zakaz/components/leads/KitchenImageLeadLauncher.tsx` и `artifacts/kuhni-na-zakaz/tests/smoke/kitchen-image-leads.spec.ts` не относятся к этапу, не изменялись в рамках Product Architecture и исключены из commit.
- UTF-8 strict decode прошёл для всех изменённых файлов; BOM и подозрительная mojibake не найдены.
- Локальные Markdown-ссылки и `git diff --check` прошли без ошибок.
- `pnpm.cmd run sitemap:check` прошёл: 112 URL, с предусмотренным static fallback при недоступности dynamic URLs.
- Typecheck/build не запускались, потому что этап является строго docs-only.

## Stage 4.5 files

Созданы:

- `docs/product/00_PRODUCT_PRINCIPLES.md`
- `docs/product/01_USER_JOURNEYS.md`
- `docs/product/02_NAVIGATION_ARCHITECTURE.md`
- `docs/product/03_GLOBAL_DOCK_SPEC.md`
- `docs/product/04_MENU_CARD_SYSTEM.md`
- `docs/product/05_PAGE_TRANSITION_MAP.md`
- `docs/product/06_SCREEN_RULES.md`
- `docs/product/07_UI_LANGUAGE_RULES.md`
- `docs/product/08_CONTENT_AND_MEDIA_RULES.md`
- `docs/product/09_PAGE_UNIQUENESS_MATRIX.md`
- `docs/product/10_ROLLOUT_PLAN.md`
- `docs/product/11_STAGE_REPORT.md`

Обновлены: `AGENT.md`, `docs/00_MASTER_PLAN.md`, `docs/01_PROJECT_VISION.md`, `docs/05_INFORMATION_ARCHITECTURE.md`, `docs/06_DESIGN_SYSTEM.md`, `docs/07_UX_RULES.md`, `docs/11_PAGE_REGISTRY.md`, `docs/12_COMPONENT_REGISTRY.md`, `docs/14_DECISION_LOG.md`, `docs/15_HANDOFF.md`.

## Numbering rule

Исторически названный stage 5 Angular уже реализован. Следующий этап всегда называть `Product этап 5 — глобальная навигация`. Product этап 6 выполняет diff-аудит live Angular по новой архитектуре и не переписывает принятые блоки с нуля.

## Stage 5 completed

- Route сохранил Server Component shell, URL/canonical/BreadcrumbList/Product/ImageObject; hidden FAQPage удалён.
- Подключены `MobileHero`, `SwipeGallery`, `CornerStorageExplorer`, `KitchenLayoutCheck`, `MechanismComparison`, `BottomSheet`; Angular orchestration находится в одном feature-local client island.
- Global `MobileBottomNav` остаётся единственным Context Dock: `Планировка / Внутри / Цена / Рассчитать`; второй fixed Dock не создан.
- 10 новых imagegen masters сохранены в проекте, созданы AVIF/WebP; 24 connected media прошли production browser QA и имеют `LIVE`.
- Форма передаёт structured answers по event bridge в существующий `/kapi/leads`; request body проверен Playwright.
- Local: typecheck/build/assets/sitemap pass. Production: target Playwright 13 pass + 1 expected desktop skip; 48 WebP/AVIF URL — HTTP `200`; browser 390 px — 1 H1, 0 overflow, 0 broken images, 0 visible PNG.
- Полный отчёт: `docs/pilots/09_ANGULAR_IMPLEMENTATION_REPORT.md`.

## Stage 5 production evidence

- server hash `fd4287b5de413e1dc87f29fcf970654b32440ffc`, service `active`;
- URL, `robots.txt`, `sitemap.xml` — HTTP `200`; sitemap остаётся 112 URL;
- schema: `BreadcrumbList`, `Product`, `ImageObject`, без hidden `FAQPage`;
- форма проверена перехватом `/kapi/leads` без создания реальной заявки; Telegram delivery отдельно не заявляется;
- lifecycle 24 assets `VERIFIED → LIVE`; неподключённые media не повышались.

## Stage 4 completed

- Проверен побочный import stage 3: style content не менялся, но два timestamp обновились; 36 published portfolio orders сдвинулись на +36.
- Обычный deploy больше не запускает content migration автоматически; нужен `RUN_CONTENT_IMPORTS=1`.
- Контрольный production rerun обоих importers дал 0 updated; полный content hash до/после совпал: `5b5c9e…6b0`.
- Созданы shared `MobileHero`, `ContextDock`, `SwipeGallery`, `BottomSheet`, `DeferredMediaViewer`.
- Созданы specialized `CornerStorageExplorer`, `ProductionJourney`, `HardwareCabinetExplorer`, `KitchenLayoutCheck`, `MechanismComparison`, `HardwarePicker`.
- Компоненты имеют русский UI, 44 px targets, reduced-motion path, text fallback и intent media mount.
- Production pilot pages не импортируют library. Dev preview закрыт production 404.
- Полный import audit: `docs/audit/2026-07-14-stage-4-content-import-audit.md`; component report: `docs/components/01_STAGE_4_REPORT.md`.

## Stage 4 rollback

Revert `86eebe5` для component library, `791f245` для media-authority fix и `994516a` для import/deploy guard отдельными Git revert commits. Не откатывать production database автоматически: order drift зафиксирован как фактическое состояние и требует отдельного бизнес-решения.

## Stage 4 media and duplicate scope

- Только `REGISTERED` media используются в preview; lifecycle не повышен до production `CONNECTED`.
- 203 legacy furnitura images сохранены и не монтируются library.
- `0 duplicates` этапа 3 означает 306 scoped files/exact SHA-256; site-wide 47 groups остаются отдельным подтверждённым baseline.

## Stage 3 completed

- Созданы `docs/assets/00_*`–`10_*`, manifests v2 и безопасные read-only/dry-run проверки.
- 33 группы разложены на 137 asset-level записей; 131 AI/technical запись имеет полный prompt package.
- Статусы: 26 `REGISTERED`, 10 `REVIEW_REQUIRED`, 95 `PROMPT_READY`, 6 `PLANNED`; `CONNECTED/VERIFIED/LIVE` отсутствуют.
- Существующие 33 pilot candidates проверены по contact sheets. 23 зарегистрированы, 10 оставлены на re-crop/review.
- Через встроенный `imagegen` создано 4 новых Angular hero revision: 3 выбраны и оптимизированы в AVIF/WebP, 1 отклонён и сохранён с причиной.
- Hardware inventory содержит ровно 203 записи исходного DOM: 201 gallery + hero + initial hinge state. Удалено 0; точных дублей 0; у 203 source status остаётся `SOURCE_UNKNOWN`.
- Production pages, components, CSS, routes, metadata, schema, forms, sitemap, robots, canonical и Prisma не изменялись. Новые assets не подключались.

## Stage 3 paths

- `content/media/pilots/<pilot>/manifest.json`
- `content/media/pilots/hardware/existing-hardware-inventory.json`
- `content/media/pilots/angular-kitchens/revisions.json`
- `prepared-images/generated-sources/pilots/`
- `artifacts/kuhni-na-zakaz/public/media/pilots/<pilot>/{hero,gallery,sequences,cutaways,comparisons,details,covers,posters}`
- `scripts/assets/`

## Stage 3 checks

- `pnpm.cmd run assets:validate`: 33 groups, 137 assets, 131 prompts, 36 complete triplets; pass; 10 expected ratio warnings remain only on `REVIEW_REQUIRED` legacy candidates.
- `pnpm.cmd run assets:duplicates`: 306 files, 0 exact duplicate groups.
- Generated hero delivery: 900×1200; AVIF 13–34 KB; WebP 19–46 KB.

## Stage 3 rollback

Revert commit `c791346` with a new Git revert commit. No database migration or runtime code rollback is required. The three new unconnected delivery variants and their project-local masters may be removed only by that revert; legacy media must remain.

## Stage 2 baseline completed

- Фактически изучены `/catalog/uglovye-kuhni`, `/locations/borisov`, `/materials/furnitura`: routes, server/client boundaries, hooks, data/Prisma fallbacks, metadata, JSON-LD, links, forms, Dock, media and build scripts.
- Локальный production-like DOM проверен во встроенном браузере на 360/390/412/768/1440 px.
- Созданы 9 документов `docs/pilots/00_*`–`08_*`.
- Зафиксированы preserve/replace decisions, три уникальных user flows, component contracts, 33 planned media groups, SEO ownership/cannibalization и future acceptance gate.
- Page/Component/Media Registry, Decision Log и Handoff обновлены.

## Created files

- `docs/pilots/00_PILOT_OVERVIEW.md`
- `docs/pilots/01_ANGULAR_KITCHENS_SPEC.md`
- `docs/pilots/02_BORISOV_SPEC.md`
- `docs/pilots/03_HARDWARE_SPEC.md`
- `docs/pilots/04_PILOT_COMPONENT_MAP.md`
- `docs/pilots/05_PILOT_MEDIA_REQUIREMENTS.md`
- `docs/pilots/06_PILOT_SEO_MAP.md`
- `docs/pilots/07_PILOT_UNIQUENESS_MATRIX.md`
- `docs/pilots/08_PILOT_ACCEPTANCE_CRITERIA.md`

## Stage 2 modified production files

Нет. `artifacts/kuhni-na-zakaz`, routes, metadata, schema, CSS, components, forms, Prisma, sitemap, robots и media не изменялись.

## Reverse-audit evidence

| Page at 390 px |  DOM |                  Images | Main height | Overflow | Dock              |
| -------------- | ---: | ----------------------: | ----------: | -------: | ----------------- |
| Angular        |  700 |     5 (1 eager, 4 lazy) |     9709 px |        0 | correct 4 actions |
| Borisov        |  679 |     3 (1 eager, 2 lazy) |     8401 px |        0 | correct 4 actions |
| Furnitura      | 2894 | 203 (1 eager, 202 lazy) |    57839 px |        0 | correct 4 actions |

- Dock at 390 px: 68 px fixed panel, 104 px main padding. At 1440 px: hidden, padding 0.
- Completed broken images: 0 in initial states. All 201 furnitura registry WebP exist; named AVIF/WebP pilot derivatives exist.
- Raw local script bytes in current build: Angular 972.2 KiB; Borisov 963.8 KiB; Furnitura 1030.5 KiB. Not gzip/transfer/CWV.
- Production browser before deploy timed out and is not claimed as verified. Local browser evidence is explicitly local.

## Preserve

- URLs/canonicals, server route shells, forms/API, Context Dock labels, crawlable links, Russian alt/caption, AI/real disclosure, exact-city project filtering and AVIF/WebP pattern.
- One main interactive client island per pilot; important meaning remains in server HTML.

## Replace in future implementation

- Angular: button-only gallery → swipe+buttons; target CornerStorageExplorer; correct tab semantics; hidden FAQ schema resolved.
- Borisov: 4-step/decorative flow → 7-step ProductionJourney; hero composition distinct; selections optionally passed to lead; no unverified local claims; hidden FAQ schema resolved.
- Furnitura: 201-image initial DOM → intent-mounted category gallery; real cabinet hotspots/text fallback; mobile comparisons; unsupported resource/brand claims removed or sourced.

## Registries

- Page Registry: three rows now `Current status=AUDITED`, `Redesign status=DESIGNED`; not MEDIA_READY/IMPLEMENTED/VERIFIED for the new project stage.
- Component Registry: shared and page-specific future components added as `PLANNED`.
- Media Registry: `PILOT-AK-01..09`, `PILOT-BR-01..12`, `PILOT-HW-01..12` added as `PLANNED`.

## Known open risks

- Borisov current FAQPage schema is not backed by visible pilot FAQ; Angular hidden FAQPage удалён в stage 5.
- Borisov shared Service schema/address/Offer and data timing/warranty claims need business evidence review.
- Furnitura current Article/ImageObject scope and technical/resource claims need review; 203-image DOM is P1 performance/UX debt.
- Global PublicChrome and forms still contain controls below future 44×44 target.
- Field CWV/Lighthouse, throttled network and real Android tests were not run in stage 2.
- Existing pilot media provenance/rights/consistency are not fully approved.

## Checks

- `git diff --check` and docs-only scope.
- UTF-8 without BOM.
- Markdown formatting/check.
- Required 9 pilot docs and registry states.
- Local browser DOM matrix 360/390/412/768/1440.
- Media reference existence.
- `pnpm.cmd run sitemap:check`: passed, 112 URLs; dynamic DB source unavailable, static fallback used.
- `pnpm.cmd run typecheck`: passed.
- Build не запускался локально до commit: production code не менялся; deploy pipeline/build result записать после публикации.

## Stage 5 rollback

Revert итоговый stage-5 commit отдельным Git revert и задеплоить `work`. Это вернёт прежний Angular page shell/showroom, media mapping, schema branch и form props. Prisma migration и content imports в stage 5 отсутствуют.

## Next required stage

`Product этап 5 — глобальная навигация`: Header/menu, постоянный global Dock, короткий LeadFormSheet и перенос page-specific fixed actions в нефиксированный PageActionRail. Shared scope сначала проходит usage/regression audit.

## Exact starting instruction for next chat

```text
Сначала прочитай /AGENT.md, /docs/00_MASTER_PLAN.md, /docs/15_HANDOFF.md и все /docs/product/*.md. Проверь git status, ветку work, текущий HEAD/origin и фактические Header.tsx, PublicChrome.tsx, MobileBottomNav.tsx, FloatingSocialButtons.tsx, lib/mobile-dock.config.js, ContactForm и Telegram Lead pipeline. Выполни PRODUCT ЭТАП 5 — ГЛОБАЛЬНАЯ НАВИГАЦИЯ. Сделай меню по пользовательской логике и постоянный мобильный Dock строго в порядке «Выбрать / Цены / Наши работы / Оставить заявку» на всех публичных UI-страницах, включая /calculator и legal; исключи /admin, /kapi, /robots.txt, /sitemap.xml, /thanks, API/route handlers и технические поверхности. Текущие page-specific Dock actions перенеси в нефиксированный PageActionRail, не создавай второй fixed Dock. «Оставить заявку» должна за одно действие открывать короткий LeadFormSheet с именем, телефоном/способом связи и submit, сохраняя действующую /kapi/leads и Telegram/outbox логику. FloatingSocialButtons не удаляй и не меняй его движение без отдельного решения. Не меняй URL, metadata, sitemap, robots, Prisma и страницы вне доказанного shared scope. Проверь 360/390/412/768/1440, safe-area, keyboard/focus/Escape, reduced motion, overlap, active states, server links, sitemap, typecheck/build и production после отдельного разрешённого deploy. Обнови registries, Decision Log и Handoff.
```
## 2026-07-15 — unified leads + Telegram handoff

- Полный отчёт: `docs/audit/2026-07-15-unified-leads-telegram-implementation.md`.
- Реализация live: schema/migration, `/kapi/leads`, webhook, deep links, admin/client workflows, outbox worker/timer, read-only admin fallback, form redesign, image CTA/share, privacy additions.
- Проверки: typecheck, Prisma validate, unit 3/3, image desktop 7/7 + mobile 7/7, формы desktop/mobile 22/22, production build 124 pages.
- Production backup: `/var/backups/kuhni-na-zakaz/pre-unified-leads-20260716-040212.dump`, SHA-256 `7989747fa7b934cbf219bd2647041cf2c885ba4c2e54a0147fd81278f4431334`.
- Старый токен временно используется по прямому указанию владельца, находится только в server env `640 root:kuhni` и отсутствует в repo. Будущая ротация всё ещё рекомендуется.
- Live smoke: №1005 website form, №1006 deep link, обе admin cards delivered; реальные callbacks `lead_taken` и `manager_assigned` обработаны. После QA обе заявки помечены `spam`, ссылка аннулирована, card updates delivered. Webhook pending 0; сохранённый historical timeout относится к restart и опровергается последующими callback-аудитами. Production Playwright page coverage 14/14 и form/share 4/4.
- Компьютер не переводить в сон: пользователь отменил это действие 2026-07-16.
## Product этап 5 — текущий handoff

Глобальный Dock реализован в существующем `MobileBottomNav`; добавлен `LeadFormSheet` поверх существующего `ContactForm`. Dock виден на публичных страницах до 767 px, исключения и служебные маршруты не получают PublicChrome. Typecheck, production build и responsive smoke-проверка пройдены. Историческая формулировка о следующем commit/deploy сохранена для audit trail; актуальная последовательность работ указана ниже в implementation contract.

## 2026-07-19 — полный пакет ТЗ интерактивного хаба

### Защищённый baseline

До отдельной приёмки не менять собственные страницы `/`, `/design-proekt-kuhni`, `/locations/minskaya-oblast`, `/locations/minsk` и `/materials/furnitura`. Все будущие shared-изменения и новые маршруты должны включать эти пять URL в regression matrix и связывать их только через разрешённую интеграцию из `design/00-TZ-INDEX.md` и `design/06-ux-spec.md`.

### Новые изображения и логика переходов

Обязательный production contract находится в `design/11-media-transition-production-map.md`: два реестра Media Asset/Transition, continuity-серии, media slots по архетипам, `ExploreContext`, машина состояний, Next Best Action и hybrid hub-and-spoke + silo. Следующий implementation этап сначала заполняет slots/briefs/transitions для трёх пилотов и только затем запускает генерацию изображений через встроенный `imagegen`.

### Главное ТЗ

Единая постановка для следующей разработки находится в `design/12-master-tz.md`. Начинать новую implementation-задачу следует с него, затем открывать соответствующие нормативные приложения `design/06-*`–`design/11-*` и registries.

### План последовательных чатов

Готовые промты для 25 этапов находятся в `design/13-chat-execution-prompts.md`. Следующий чат запускается только после PASS предыдущего, commit, production smoke/deploy evidence или честного `NO RUNTIME DEPLOY` для документационного этапа, а также обновления Handoff.

Создан implementation contract для развития сайта как мобильного интерактивного хаба:

- `design/00-TZ-INDEX.md` — source of truth и границы пакета;
- `design/06-ux-spec.md` — UX, IA, flows, screen rules, archetypes и page acceptance;
- `design/07-route-matrix.md` — 112/112 canonical URL из static sitemap;
- `design/08-content-data-media-contract.md` — текущие Prisma entities, provenance, evidence, media delivery, metadata и index policy;
- `design/09-component-interaction-contract.md` — shell, components, states, accessibility и performance;
- `design/10-implementation-qa-rollout.md` — implementation phases, analytics, test matrix, gates и rollback.

Production UI, routes, metadata, sitemap, robots, Prisma и media data этим docs-only изменением не менялись.

### Следующее разрешённое действие

Не начинать массовую реализацию новых стилей/планировок/локаций. Сначала выполнить Phase 0 source-of-truth sync, затем заполнить route/intent matrix фактическими Search Console/SERP данными, провести portfolio/business evidence review и закрыть три пилота (`/catalog/uglovye-kuhni`, `/locations/borisov`, `/materials/mdf-fasady`). `/materials/furnitura` остаётся защищённым regression-узлом.

## 2026-07-20 — чат 2: route/intent и SEO-карта

### Результат

`PASS` по документационному scope и parity gate. `PASS_WITH_EVIDENCE_GAPS` по окончательной поисковой/бизнес-доказательности: Search Console/SERP export, operations facts и portfolio provenance не предоставлены и не были выдуманы.

- В `design/07-route-matrix.md` добавлено 112/112 post-row records: primary intent, `userQuestion`, `uniquePromise`, archetype, `primaryInteraction`, current index policy, evidence owner, 2–4 перехода и overlap risk.
- `public/sitemap-static.xml`, production `/sitemap.xml` и audit matrix совпадают: 112 unique, `missing = 0`, `extra = 0`, duplicates = 0.
- Новые facet URL не создавались; runtime URL, canonical, robots, metadata, schema, sitemap и UI не менялись.
- 31 location URL получили общий evidence gate: уникальность нельзя доказывать заменой топонима.
- 13 portfolio detail URL получили `PROVENANCE_REVIEW_REQUIRED`: DB record, slug, path, city и `published` не являются proof реального проекта.
- Пять защищённых URL проверены read-only и не изменены.

### Git baseline и пользовательские изменения

- Входной HEAD: `cc16b4a713e2a248a14caf5b9054ae13d8fa6544` (`work`, `origin/work`).
- До чата 2 уже существовали незакоммиченные docs-only изменения чата 1: `AGENT.md`, master/registry/log/handoff/product docs и untracked `design/`; также была untracked `.playwright-mcp/`.
- Эти пользовательские изменения не удалялись и не откатывались. Чат 2 адресно менял только `design/07-route-matrix.md`, `docs/11_PAGE_REGISTRY.md`, `docs/14_DECISION_LOG.md`, `docs/15_HANDOFF.md`.

### Проверки

| Проверка | Результат |
| --- | --- |
| `pnpm.cmd run typecheck` | PASS |
| `pnpm.cmd run sitemap:check` | PASS, 112 URL; dynamic DB unavailable, static fallback used |
| `pnpm.cmd run seo:check` | PASS |
| `pnpm.cmd run build` | PASS, Next.js 15.3.9; 124 static pages; DB fallback warnings for unavailable `127.0.0.1:5434` |
| production `/sitemap.xml` | HTTP 200, 112 unique |
| production `robots.txt` | HTTP 200 |
| audit route rows vs static sitemap | 112 unique, missing 0, extra 0, bad transition count 0 |
| UTF-8 / BOM / mojibake | проверить финальным docs gate перед commit |
| runtime deploy | `NO RUNTIME DEPLOY` |

Build PASS не означает проверку dynamic DB content: локальная PostgreSQL на `127.0.0.1:5434` была недоступна, а код использовал предусмотренные fallback-данные. Это открытый evidence risk для чата 3, а не причина менять runtime на docs-only этапе.

### Production baseline защищённых URL

Дата проверки: 2026-07-20, встроенный browser/Playwright, fresh-load console check, 360/390/412 px.

| URL | HTTP | canonical / robots | H1 | изображения | Dock / overflow / console |
| --- | ---: | --- | --- | --- | --- |
| `/` | 200 | self / `index, follow` | 1: «Купить кухню в Минске под размер, с проектом и монтажом» | 54, broken 0, missing alt 0 | global Dock visible/fixed; overflow 0; errors 0 |
| `/design-proekt-kuhni` | 200 | self / `index, follow` | 1: «3D-проект кухни на заказ» | 52, broken 0, missing alt 0 | global Dock visible/fixed; overflow 0; errors 0 |
| `/locations/minskaya-oblast` | 200 | self / `index, follow` | 1: «Купить кухню в Минской области под размер, с доставкой и монтажом» | 21, broken 0, missing alt 0 | global Dock visible/fixed; overflow 0; errors 0 |
| `/locations/minsk` | 200 | self / `index, follow` | 1: «Купить кухню на заказ в Минске под размер» | 82, broken 0, missing alt 0 | global Dock visible/fixed; overflow 0; errors 0 |
| `/materials/furnitura` | 200 | self / `index, follow` | 1: «Фурнитура для кухни на заказ» | 203, broken 0, missing alt 0 | global Dock visible/fixed; overflow 0; errors 0 |

Сохраняется P1 performance/UX debt `/materials/furnitura`: 203 изображения и тяжёлый HTML response (около 819 КБ в HTTP smoke). В этом чате страница защищена и не изменялась.

### Фактический deploy и rollback

Deploy branch — `work`, repo на VPS — `/var/www/kuhni-na-zakaz`, app — `artifacts/kuhni-na-zakaz`, systemd service — `kuhni-na-zakaz`. Стандартный путь: push commit в `origin/work` → SSH `root@5.42.108.140` → `bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work`. Скрипт выполняет fast-forward pull, frozen install, Prisma generate/migration/db push, recipient/contact sync, static sitemap write, Next build, timer install и restart service. Content imports по умолчанию отключены и разрешены только с `RUN_CONTENT_IMPORTS=1`.

Rollback runtime: выбрать последний проверенный runtime commit, создать отдельный Git revert проблемного commit, push в `work`, запустить тот же update script и выполнить production smoke. Database нельзя автоматически откатывать Git revert; для migration/data нужен отдельный backup/restore decision. Для текущего docs-only commit rollback — только отдельный Git revert, без service restart, DB, imports или asset operations.

### NO RUNTIME DEPLOY

`NO RUNTIME DEPLOY`: изменены только route matrix и registries/log/handoff. Production artifact, UI, routes, metadata, sitemap, Prisma и assets не менялись. Запуск update script создал бы лишний риск Prisma/build/restart без изменения пользовательского результата.

### Открытые риски

1. Search Console и live SERP evidence отсутствуют; primary intent и overlap — редакционная гипотеза до data review.
2. 31 location URL находятся в sitemap/index baseline без подтверждённого в этом чате city-specific evidence.
3. 13 portfolio detail URL требуют provenance review; часть generated cases не может называться «Нашими работами» без owner approval.
4. Две статьи о стоимости (`/blog/skolko-stoit-kuhnya-na-zakaz` и dated Minsk 2026 URL) имеют критический overlap; ownership решается после GSC/SERP evidence.
5. Локальная DB недоступна во время build, поэтому dynamic content quality не проверена против production DB.
6. `/materials/furnitura` сохраняет 203-image performance debt, но защищена от изменений текущим scope.

### Точный handoff для чата 3

```text
Подготовь data/provenance gate без массового UI. До действий прочитай AGENT.md, design/12-master-tz.md, design/08-content-data-media-contract.md, design/11-media-transition-production-map.md, design/07-route-matrix.md (секцию аудита 2026-07-20), docs/11_PAGE_REGISTRY.md, docs/13_MEDIA_REGISTRY.md, docs/14_DECISION_LOG.md, docs/15_HANDOFF.md и фактические Prisma schema/seed/fallback data.

Начни с git status/HEAD и сохрани пользовательские изменения. Проверь разделение real project, AI concept, technical illustration, process illustration, unknown и rejected. Проведи evidence review для 13 portfolio detail URL и 31 location URL; отдельно назначь/подтверди evidence owner для prices, guarantees, reviews и material/brand/product claims. DB record, published flag, путь, slug, город и реалистичность изображения не являются proof.

Не придумывай адреса, филиалы, проекты, цены, сроки, гарантии, отзывы, specs или локальные условия. Не меняй runtime UI, URL, canonical, sitemap и пять защищённых страниц: /, /design-proekt-kuhni, /locations/minskaya-oblast, /locations/minsk, /materials/furnitura. Если Search Console/SERP/owner evidence отсутствует, фиксируй evidence required, а не выдумывай вывод.

Добавляй только безопасные data/provenance поля и реестры, предусмотренные ТЗ и существующей схемой. Миграция допустима только при реальной необходимости, с backup, diff, data-impact audit и точным rollback; иначе оставь documentation-only. Обнови Page/Media Registry, Decision Log и Handoff. Выполни typecheck, schema checks, sitemap parity 112/112 и regression smoke пяти protected URL. Deploy только если действительно изменился runtime data contract; иначе явно напиши NO RUNTIME DEPLOY и причину.
```

## 2026-07-20 — чат 3: data/provenance gate

### Результат

`PASS_WITH_EVIDENCE_GAPS` для документационного scope. Канонические статусы и evidence-owner rules закреплены в `design/08-content-data-media-contract.md`; production-пакет трёх пилотов и Transition Registry находятся в `docs/pilots/10_PILOT_PRODUCTION_PACKAGE.md`. Новые claims, runtime assets, Prisma fields и пять protected pages не менялись.

### Зафиксированные ограничения

- `verified_real` требует owner-confirmed project source, два независимых evidence refs, exact characteristics/media set и approved rights.
- `/locations/borisov` не получает local proof, адрес, филиал, срок, доставку или гарантию без operations evidence.
- `/catalog/uglovye-kuhni` может использовать только честно маркированные AI concepts/technical illustrations; `LIVE` в manifest — технический lifecycle, не real-project proof.
- `/materials/mdf-fasady` получает material concepts/technical fallbacks; brands, specs, care, prices, warranties и real project blocked до owner evidence.
- `/materials/furnitura` остаётся защищённым и не изменён.

### Следующий разрешённый шаг — чат 4 (Media Asset Registry + Transition Registry)

Используй `docs/pilots/10_PILOT_PRODUCTION_PACKAGE.md` как production input. Проверь существующие manifests и Page Registry, нормализуй только registry-level поля (`mediaId`, `seriesId`, `viewRole`, `interactionRole`, `altRu`, `captionRu`, `provenanceStatus`, `rightsStatus`, delivery paths, forbidden claims). Не генерируй массово изображения и не подключай runtime. Для каждого transition сохраняй `fromRoute`, `fromState`, `userQuestion`, `DEEPEN/COMPARE/PROOF/CONVERT`, русский анкор, target, reason, contextPatch, fallback и analytics event. `/materials/furnitura` не менять. После docs-only проверки — `NO RUNTIME DEPLOY`.

### Следующий разрешённый шаг — чат 5 (shared foundation)

Только после приёмки чата 4 реализуй shared `ExploreContext`, reader Transition Registry, `RelatedExplorationRail`, `MediaSequence` и `ContextSummary` по `design/09-component-interaction-contract.md`. Не делай page-specific redesign и не подключай неapproved media. Сохрани server HTML, обычные ссылки, loading/empty/error fallback, keyboard/reduced-motion и regression matrix пяти protected URL. Deploy допускается только если runtime data contract/assets реально изменились и все QA PASS; иначе `NO RUNTIME DEPLOY`.

### Checks / rollback

Перед commit: UTF-8 без BOM/mojibake, `git diff --check`, `pnpm.cmd run typecheck`, Prisma schema check, `pnpm.cmd run sitemap:check` (112/112), docs smoke и read-only regression пяти protected URL. В этом чате schema diff отсутствует, backup/migration/database rollback не требуются; rollback — Git revert docs-only commit.

## 2026-07-20 — чат 5: shared foundation

Реализованы `ExploreContext`, Transition Registry reader, `RelatedExplorationRail`, `MediaSequence` и `ContextSummary`. Runtime consumer ограничен `/catalog/uglovye-kuhni`; защищённые пять URL получили только regression smoke. `ExploreContext` использует sessionStorage и не создаёт facet URL; server HTML содержит обычные ссылки rail и текстовые fallback states. Existing Lead/Telegram/outbox и global Dock сохранены.

QA: `pnpm.cmd run typecheck` PASS; `pnpm.cmd run test:leads` PASS; foundation unit tests PASS; `pnpm.cmd run sitemap:check` PASS (112 URL); `pnpm.cmd run build` PASS (ожидаемые Prisma fallback warnings при недоступной `127.0.0.1:5434`). Browser local: 360/390/412/768/1440 — 1 H1, overflow 0, broken images 0, rail/sequence present, Dock visible до 767 px; protected baseline 390 — H1 1, overflow 0, broken images 0, Dock present. Keyboard: Lead sheet открывается, Escape закрывает, focus возвращается на trigger.

## Rollback для shared foundation

Откатить отдельный runtime commit этого чата через `git revert <commit>`, push в `work`, затем выполнить `bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work` и повторить smoke `/catalog/uglovye-kuhni` + пять baseline URL. Prisma, media lifecycle и sitemap rollback не нужны: schema/assets/URL не менялись.

## 2026-07-20 — Borisov + MDF implementation handoff

- `/locations/borisov`: server-first question/conditions/7-step process/local-proof fallback/next step; exact-city project proof отсутствует и явно `BLOCKED_BY_INPUT`.
- `/materials/mdf-fasady`: surface close-up/comparator/questions/limitations/style-layout continuation/calculation; `/materials/furnitura` не изменён.
- Media: 7 Borisov + 4 MDF imagegen masters сохранены в project `prepared-images`; WebP delivery 11–49 КБ, один eager hero на route, остальные lazy/intent-mounted, русские alt/captions.
- SEO: self canonical, один H1, BreadcrumbList only; Borisov не наследует общий FAQ/Service/Offer/address schema.
- Lead: Borisov city/context and MDF material context передаются через существующий ContactForm answers contract; персональные данные не сохраняются в ExploreContext.
- Rollback: `git revert <pilot-commit>`, push `work`, standard deploy, smoke пилотов + protected baseline; DB/schema/import rollback не нужен.

## 2026-07-20 — Handoff для чата 10

Совместная приёмка трёх пилотов и batch шести layout URL завершена локальным `PASS`. Блокирующие пилотные дефекты исправлены адресно: один main landmark; честный Angular provenance; Transition Registry rails на Borisov/MDF; выбранные MDF-поверхности в Lead answers; видимый AI-disclosure; корректная semantics кнопок этапов Borisov. Global Dock намеренно остался единым по master-ТЗ.

Batch реализована только для `/catalog/pryamye-kuhni`, `/catalog/p-obraznye-kuhni`, `/catalog/kuhni-s-ostrovom`, `/catalog/malenkie-kuhni`, `/catalog/kuhni-do-potolka`, `/catalog/kuhni-bez-ruchek`. Data/media/transition records были созданы до runtime-кода. У страниц шесть разных вопросов и interaction roles; server HTML содержит ограничения, disclosure, ссылки и Lead fallback. Facet URL не созданы.

Перед handoff выполнены typecheck, sitemap 112/112, production build и Browser/Playwright QA 360/390/412/768/1440. Локальная Prisma DB недоступна, поэтому production smoke должен подтвердить production data path. После успешного deploy записать commit, production HTTP/canonical/H1/images/interaction smoke и точную команду rollback в этот раздел.

Production deploy завершён для runtime commit `ed4dde9be4a27226e1ecbb0d42d99b01c92080e9`: `deploy/scripts/update-production.sh work`, production Prisma schema in sync, Next build PASS, service `kuhni-na-zakaz` active. Smoke `https://kuhni.minsk.by` для трёх пилотов, шести batch URL и пяти protected baseline: все HTTP 200, self-canonical, H1=1, overflow=0, broken images=0, missing alt=0; batch имеет шесть уникальных interaction roles и минимум три registry transition links. Rollback: `git revert ed4dde9`, push `work`, повторить стандартный deploy и тот же smoke. Этот follow-up меняет только Handoff: `NO RUNTIME DEPLOY — production artifact unchanged after verified ed4dde9`.

Следующий разрешённый шаг после production PASS — чат 11, только style family из `design/13-chat-execution-prompts.md`. Не расширять route scope, не менять protected URL и не создавать facet URL.

## 2026-07-20 — handoff style + scenario families

Локальный статус: `PASS / IMPLEMENTED_VERIFIED_LOCAL`. Восемь style и шесть scenario URL реализованы на едином data contract, но имеют разные вопросы, visual/decision models, материалы, ограничения и следующие переходы. Style использует `style_variants-*` seriesId; scenario — приоритетный decision model. AI concept и portfolio proof разделены видимым disclosure и типом перехода.

Проверено: `pnpm.cmd run typecheck`; foundation unit 3/3; `pnpm.cmd run sitemap:check` 112/112; `pnpm.cmd run build` PASS с ожидаемыми Prisma fallback warnings при недоступной локальной `127.0.0.1:5434`; Playwright style/scenario batch 40/40 на desktop/mobile, дополнительные 360/390/412/768, protected baseline 5/5. Route bundles: styles около 166 КБ First Load JS, scenarios около 160 КБ; один eager visual, остальные style sequence кадры lazy.

После отдельного commit требуется push `work`, standard production deploy, production smoke всех 14 URL и пяти protected routes. Rollback: `git revert <commit>`, повторный deploy и тот же smoke; data/schema rollback отсутствует.

Production PASS завершён для `a243bddd8bac781575a4378aa18b8f0409d8ed9f`: push `work`, `deploy/scripts/update-production.sh work`, Prisma schema in sync, static sitemap 112, Next build 173 pages, service `kuhni-na-zakaz` active. Playwright против `https://kuhni.minsk.by`: 40/40 PASS для desktop/mobile, 14 target, 360/390/412/768/1440 checks и пяти protected routes. Rollback: `git revert a243bdd`, push `work`, стандартный deploy и повтор того же smoke. Этот follow-up меняет только документацию: `NO RUNTIME DEPLOY — production artifact уже проверен`.

## 2026-07-22 — Visual rescue stages 7–9 local PASS

`VISUAL_ACCEPTED_LOCAL` для `/catalog/kuhni-s-ostrovom`, `/catalog/malenkie-kuhni`, `/catalog/kuhni-do-potolka`. Создано 18 route-specific imagegen masters, 18 WebP, 18 AVIF и три contact sheets. Legacy two-frame/text-result путь заменён шестью visual states на route; canonical, metadata/schema flow, ExploreContext, Lead pipeline, sitemap и protected page-specific UI сохранены.

Local evidence: typecheck PASS; sitemap 112/112; production build PASS с ожидаемым Prisma static fallback; Playwright 4/4 на 360/390/412/768/1440; protected routes 5/5. На 390 px visual начинается Y=426, action controls Y=931; initial media = один active AVIF, `naturalWidth=1200`, overflow=0, CLS observation 0.0002. Screenshots/video/report: `artifacts/visual-rescue/stages-7-9/`; полный отчёт: `docs/visual-rescue/stages-7-9-2026-07-22.md`.

До deploy статус production не заявляется. Требуется отдельный scope commit, push `work`, стандартный deploy и smoke трёх targets + пяти protected routes. Rollback: `git revert <stage-7-9-commit>`, push, standard deploy, повторный smoke; Prisma/schema/import rollback не нужен. Следующий разрешённый этап после production PASS — 10.
