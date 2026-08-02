# Этап 7, волна 7A — production acceptance

Статус: `WAVE_7A_ACCEPTED`

- Runtime commit: `fa0be4e5f3e341312cfe620b411129ccf16b3438`.
- Scope: `/catalog` и семь detail-маршрутов каталога.
- Media: `REUSE`; accepted visual rescue серии сохранены, новые изображения не создавались.
- Local Playwright: 43/43 PASS на 360/390/412/768/1440.
- Production smoke: 16/16 PASS через SSH-туннель к активному production Next.js runtime.
- Production Lighthouse: `/catalog` — 100/100/100, LCP 1531 мс; `/catalog/pryamye-kuhni` — 100/96/100, LCP 1526 мс; CLS 0, TBT 4 мс.
- Transition QA: 25 active, P0=0, P1=0, русские labels/reasons и fallbacks PASS.
- Production build: 173 static generation steps; service `kuhni-na-zakaz` active.

Подробности: `docs/audit/2026-08-02-general-rollout-stage-7a.md`.
