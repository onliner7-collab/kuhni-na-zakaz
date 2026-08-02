# General rollout — этап 7, волна 7A

Дата: 2026-08-02

Статус: `WAVE_7A_ACCEPTED`

Runtime HEAD: `fa0be4e5f3e341312cfe620b411129ccf16b3438`

## Этап/волна

Этап 7, волна 7A — каталог.

## Scope URL

- `/catalog`;
- `/catalog/uglovye-kuhni`;
- `/catalog/pryamye-kuhni`;
- `/catalog/p-obraznye-kuhni`;
- `/catalog/kuhni-s-ostrovom`;
- `/catalog/malenkie-kuhni`;
- `/catalog/kuhni-do-potolka`;
- `/catalog/kuhni-bez-ruchek`.

## KEEP / ADAPT / REPLACE / MOVE / REMOVE

- **KEEP:** семь accepted route-specific visual series, уникальные detail-вопросы, metadata, canonical, H1, JSON-LD, ExploreContext, формы и Lead pipeline.
- **ADAPT:** `/catalog` перенесён к visual-first вопросу до длинного текста; выбор формы сразу меняет изображение, ограничение и route-specific CTA.
- **REPLACE / MOVE / REMOVE:** detail-страницы не переписывались; существующий SEO-контент не удалялся.

## Новые media и provenance

Новых media нет. Audit: `REUSE`. Использованы существующие оптимизированные WebP, помеченные как концепции, созданные нейросетью; они не выдаются за выполненные проекты.

## Runtime files

- `artifacts/kuhni-na-zakaz/app/catalog/page.tsx`;
- `artifacts/kuhni-na-zakaz/components/catalog/CatalogShapeExplorer.tsx`;
- `artifacts/kuhni-na-zakaz/lib/transition-registry.ts`.

## SEO changes

Title, description, canonical, robots и schema не менялись. Hub сохранил owned intent «выбрать форму кухни». Все семь detail routes остаются обычными server-rendered links; один H1, self-canonical, русские alt и отсутствие overflow проверены.

## Transitions activated

Для `/catalog` активированы три crawlable next steps: к материалам, дизайн-проекту и расчёту. Всего в scope runtime registry — 25 active transitions; русские `anchorRu`/`reasonRu`, fallbacks, unique IDs и единственный PROOF с `verified` evidence прошли. Baseline under-linked targets в scope 7A отсутствуют.

Evidence: `artifacts/general-rollout/stage-7a/transition-qa.json`.

## Local checks

- typecheck — PASS;
- exploration — 11/11 PASS;
- leads — 6/6 PASS;
- sitemap — 112 URL PASS;
- SEO — PASS;
- images — 300 references, broken/oversized/bad names: 0;
- build — PASS, 127 prerendered pages через штатный static fallback;
- local PostgreSQL `127.0.0.1:5434` недоступна, schema/data не менялись;
- Playwright — 43/43 PASS: 8 routes × 5 widths, interaction/context, Arrow/Home/End и crawlable next steps;
- Browser 390 px — H1=1, overflow=false, broken images=0, console errors=0, visual switch PASS.

## Commit / push / deploy

- Commit: `fa0be4e` — `feat(stage7a): add visual catalog comparator`.
- Push `origin/work`: PASS.
- Standard Timeweb deploy: PASS; fast-forward `f96b4f9` → `fa0be4e`.
- Production build: PASS, 173 static generation steps, sitemap 112 URL.
- Service: `kuhni-na-zakaz` active; production runtime HEAD `fa0be4e5f3e341312cfe620b411129ccf16b3438`.

## Production smoke

Прямой HTTPS-маршрут от текущей Windows-машины после deploy давал transport timeout ещё до HTTP. Поэтому smoke выполнен через SSH-туннель к фактическому production Next.js process `127.0.0.1:3001`, без локальной сборки:

- scope routes 8/8 PASS;
- protected/core 5/5 PASS;
- catalog interaction и 3 server links PASS;
- sitemap и robots HTTP 200;
- суммарно 16/16 PASS.

Evidence: `artifacts/general-rollout/stage-7a/playwright-production-smoke.json`.

## Lighthouse

Standard simulated mobile по production runtime через SSH-туннель:

| URL | Performance | Accessibility | SEO | LCP, мс | CLS | TBT, мс |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/catalog` | 100 | 100 | 100 | 1531 | 0 | 4 |
| `/catalog/pryamye-kuhni` | 100 | 96 | 100 | 1526 | 0 | 4 |

Evidence: `artifacts/general-rollout/stage-7a/lighthouse-production/`.

## Rollback

При воспроизводимой runtime-регрессии: `git revert fa0be4e`, push `work`, standard deploy, затем повторить 8 scope routes, 5 protected routes, sitemap/robots, interaction smoke и representative Lighthouse. DB/schema/data rollback не нужен.

## Remaining risks

- Внешний HTTPS-маршрут от текущей машины был недоступен по сети после deploy; серверный production runtime, systemd service, production build, SSH-tunneled Playwright и Lighthouse прошли. Это transport limitation, а не подтверждённый продуктовый дефект.
- Общий dirty worktree пользователя сохранён и не включён в scope commit.
- По контракту ТЗ следующая волна 7B разрешена только отдельным продолжением после принятой 7A; автоматический переход не выполнялся.

## Final status

`WAVE_7A_ACCEPTED`

Этап 7 целиком не принят: ожидаются 7B и 7C. Этап 8 не начат.
