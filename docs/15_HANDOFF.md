# Handoff

## Current stage

Этап 2 — reverse-audit и детальное проектирование трёх пилотов. Baseline этапа 1: `6f78fbb`. Commit этапа 2: `STAGE2_COMMIT_TO_BE_REPLACED`.

## Completed

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

## Modified production files

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

- Angular/Borisov current FAQPage schema is not backed by visible pilot FAQ.
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

## Rollback

Revert the stage-2 docs commit with a new Git revert commit. No database/media/runtime rollback is required because production code is unchanged.

## Next required stage

ЭТАП 3 — создание точной медиасистемы, генерационных prompts и медиакарт для трёх утверждённых пилотных страниц. Не генерировать assets до проверки всех 33 groups и approval consistency/provenance contract.

## Exact starting instruction for next chat

```text
Сначала прочитай /AGENT.md, /docs/00_MASTER_PLAN.md, /docs/15_HANDOFF.md и все /docs/pilots/*.md. Проверь git status, ветку work, последние коммиты и baseline этапа 2, указанный в Handoff. Выполни ЭТАП 3 — создай точную медиасистему, asset-level медиакарты и генерационные prompts для 33 групп PILOT-AK-01..09, PILOT-BR-01..12, PILOT-HW-01..12. Не меняй production UI/routes/metadata/schema/forms/Prisma. Не генерируй изображения, пока не проверены storyboard, mobile/desktop crop, consistency, provenance, real/AI labels, AVIF/WebP/master contract, loading priority и sequence budget. Для новых фото кухонь используй только встроенный imagegen после чтения его SKILL.md; masters сохраняй в проекте, visible src — оптимизированный AVIF/WebP. Обнови Page/Component/Media Registry, Decision Log и Handoff; не отмечай MEDIA_READY без реальных файлов и QA.
```
