# Style и scenario families — отчёт приёмки

Дата: 2026-07-20
Статус до deploy: `PASS / IMPLEMENTED_VERIFIED_LOCAL`

## Scope

Реализованы только восемь `/styles/*` и шесть `/scenarios/*`, перечисленные в мастер-ТЗ задачи. Новые URL, facet/query canonical и комбинации city/style/material не создавались. Пять protected routes не изменялись и участвовали в read-only regression.

## Контракты

- Style: уникальные metadata/H1/question, visual language, materials, constraints, comparison, variants, `style_variants-*` seriesId, disclosure и четыре server links.
- Scenario: уникальные metadata/H1/question, visual scenario, три приоритета, layout/material/article links, ограничения, disclosure и `DEEPEN/COMPARE/PROOF/CONVERT`.
- `ExploreContext` хранится в sessionStorage и не создаёт индексируемых facets.
- AI concept не используется как portfolio proof; бюджет, вместимость и результат не обещаются без evidence.

## QA evidence

- `pnpm.cmd run typecheck` — PASS.
- `pnpm.cmd exec tsx --test tests/unit/exploration-foundation.test.ts` — 3/3 PASS.
- `pnpm.cmd run sitemap:check` — 112 URL, PASS.
- `pnpm.cmd run build` — PASS; локальная Prisma DB недоступна, сработали штатные fallbacks.
- `pnpm.cmd exec playwright test -c playwright.smoke.config.ts tests/smoke/style-scenario-families.spec.ts --workers=1` — 40/40 PASS.
- Проверены 360/390/412/768/1440, H1/canonical/description, русские alt, `naturalWidth > 0`, touch targets, keyboard, ExploreContext, server-linked transitions, overflow и protected baseline.

## Deploy и rollback

Runtime commit: `a243bddd8bac781575a4378aa18b8f0409d8ed9f`.

- `work` запушен и задеплоен через `bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work`.
- Production Prisma schema in sync; static sitemap 112 URL; Next build 173 pages; service active.
- Production Playwright against `https://kuhni.minsk.by` — 40/40 PASS, включая 14 target и 5 protected URL.
- Rollback: `git revert a243bdd`, push `work`, повторный deploy и тот же smoke; Prisma/schema/data rollback не нужен.
