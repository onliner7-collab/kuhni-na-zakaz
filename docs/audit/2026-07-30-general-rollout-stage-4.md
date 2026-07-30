# General rollout stage 4 — shared exploration platform v2

Stage: 4
Status: `LOCAL_PASS`, production pending
Date: 2026-07-30

## Scope

- Input acceptance: `STAGE_2_ACCEPTED`, `STAGE_3_ACCEPTED`.
- Runtime diff ограничен shared exploration foundation, Lead context adapter, analytics taxonomy и QA configs/tests.
- Массовое подключение 336 planned links к 112 страницам не выполнялось.
- Protected page-specific content, metadata, sitemap logic, schema, `/privacy-policy`, media и DB не изменялись.

## KEEP / ADAPT

- KEEP: `MediaSequence`, style/scenario explorers, family data, route-specific visual shells, Lead/Telegram endpoints.
- ADAPT: ExploreContext, ContextSummary, RelatedExplorationRail, transition registry, analytics adapter, ContactForm answers context.
- REPLACE/MOVE/REMOVE: none.

## Local verification

| Check | Result |
| --- | --- |
| Typecheck | PASS |
| Exploration unit/server tests | 9/9 PASS |
| Lead tests | 6/6 PASS |
| Sitemap | 112 URL PASS; static fallback из-за локальной DB |
| SEO brand | PASS |
| Images | 296 references; broken/oversized/bad names = 0 |
| Production build | PASS; 127 static pages |
| Visual-rescue stage 25 | 2/2 PASS; 23/23 routes |
| Widths | 360/390/412/768/1440 PASS |
| Protected five | 5/5 PASS |
| H1/canonical/overflow/broken images | PASS |
| Keyboard/focus/reduced motion | PASS |
| Lighthouse provided network | 3/3: Performance/Accessibility/SEO 100 |
| LCP provided | 123–274 ms |
| CLS provided | 0.00004–0.01567 |
| TBT provided | 0 ms |

## Performance evidence boundary

Стандартная simulated mobile модель дала Performance 89/92/92 и LCP 3.31–3.77 с при CLS ≤0.016 и TBT ≤6 мс. LCP insight подтвердил, что изображения:

- 15–44 КБ AVIF;
- eager + fetchpriority high;
- discoverable в initial HTML;
- TTFB 4–12 мс;
- resource delay 3–9 мс;
- download 1–3 мс.

Provided-network gate проходит строгие пороги ТЗ. Production representative перепроверяется после deploy; simulated score сохранён как evidence limitation, а не скрыт.

## Build evidence limitation

Локальная PostgreSQL `127.0.0.1:5434` недоступна. Next.js production build завершился успешно на предусмотренных fallback datasets. DB/schema/data не менялись.

## Runtime contract

- Versioned `sessionStorage` v2 с legacy migration.
- PII/unknown/facet fields отбрасываются.
- Active links остаются server-rendered; planned/disabled/blocked evidence скрыты.
- Lead получает только whitelisted meaningful context в `answers.exploreContext`.
- Analytics использует существующие providers и не передаёт PII.

## Evidence

- `artifacts/general-rollout/stage-4/browser/`
- `artifacts/general-rollout/stage-4/lighthouse/`
- `docs/architecture/transition-graph-qa.json`

## Rollback

`git revert <stage-4-runtime-commit>`, push `work`, стандартный deploy, повторить production smoke + 23 visual + protected five + Lead/analytics checks. DB rollback не нужен.
