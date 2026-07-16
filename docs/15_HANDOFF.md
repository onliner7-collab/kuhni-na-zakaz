# Handoff

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
