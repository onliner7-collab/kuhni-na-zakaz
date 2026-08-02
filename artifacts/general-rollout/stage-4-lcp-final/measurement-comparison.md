# Сравнение LCP до финального deploy

Дата: 2026-08-02
Lighthouse: 12.6.1
Профиль: `formFactor: mobile`, `throttlingMethod: simulate`, по три прогона каждого URL
Локальная сборка: HEAD `388d39a` + сохранённый corrective dirty diff, отдельный production build, `next start` на `127.0.0.1:3012`
Production-control: текущий deployed production до нового deploy, `https://kuhni.minsk.by`

## Hard-gate метрики

| Origin | Маршрут | Performance | FCP, мс | LCP, мс | CLS | TBT, мс | A11y | SEO |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| local | `/catalog/uglovye-kuhni` | 94/94/94 | 1056–1059 | 3097/3098/3105 | 0 | 0–5 | 100 | 100 |
| local | `/styles/minimalizm` | 95/95/95 | 1056–1057 | 2861/2862/2863 | 0 | 0–2 | 100 | 100 |
| local | `/scenarios/dlya-malenkoy-kuhni` | 96/96/96 | 1055–1056 | 2855/2855/2856 | 0 | 0 | 100 | 100 |
| local | `/materials/furnitura` | 95/95/95 | 1054–1055 | 3008/3009/3009 | 0 | 3–9 | 96 | 100 |
| production | `/catalog/uglovye-kuhni` | 98/98/99 | 1291–1294 | 2041/2044/2044 | 0 | 4–11 | 100 | 100 |
| production | `/styles/minimalizm` | 99/99/100 | 1292–1324 | 1592/1592/1624 | 0 | 1–5 | 100 | 100 |
| production | `/scenarios/dlya-malenkoy-kuhni` | 99/100/100 | 1291–1309 | 1591/1593/1609 | 0 | 2–5 | 100 | 100 |
| production | `/materials/furnitura` | 98/99/99 | 1440–1443 | 1890/1892/1893 | 0 | 5–9 | 100 | 100 |

Production-control проходит hard gate 12/12; localhost не проходит только LCP 12/12. Остальные budgets проходят на обоих origin.

## Trace-факты

LCP candidates во всех локальных отчётах находятся в initial HTML, `eager/high`, без lazy loading. Preload URL и фактический AVIF `currentSrc` совпадают. Console errors: 0 во всех 24 отчётах.

| Маршрут | LCP asset | Median local image transfer | Median local observed LCP phases, мс | Median local legacy simulated render delay, мс |
|---|---|---:|---|---:|
| `/catalog/uglovye-kuhni` | `angular-kitchens-hero-corner-wide-portrait.avif` | 45 039 Б; request 3,1 мс | TTFB 6,3; delay 3,1; load 3,4; render 87,8 | 2644,7 |
| `/styles/minimalizm` | `minimal-overview.avif` | 16 736 Б; request 1,4 мс | TTFB 7,1; delay 3,0; load 1,6; render 71,1 | 2408,7 |
| `/scenarios/dlya-malenkoy-kuhni` | `small-limit.avif` | 17 563 Б; request 1,3 мс | TTFB 13,9; delay 3,8; load 1,6; render 70,5 | 2243,6 |
| `/materials/furnitura` | `hardware-hero-open-cabinet-portrait.avif` | 36 777 Б; request 2,5 мс | TTFB 6,4; delay 2,9; load 2,8; render 117,3 | 2556,9 |

Локальный observed trace не подтверждает сетевой или decode bottleneck: до отрисовки LCP проходит примерно 83–130 мс. Порог нарушает legacy simulated projection, которая добавляет 2,2–2,6 с synthetic render delay. Production тем же Lighthouse/profile стабильно проходит.

Перед deploy применён разрешённый ТЗ статус `PROVISIONAL_DEPLOY_FOR_PRODUCTION_LCP_VERIFICATION`.

## Production после deploy

Runtime commit: `30fc9388a78493becb1ec344e236e88752fb6b22`. Все 12 прогонов Lighthouse 12.6.1 с тем же simulated mobile профилем прошли hard gate.

| Маршрут | Performance | LCP, мс | CLS | TBT, мс | A11y | SEO |
|---|---:|---:|---:|---:|---:|---:|
| `/catalog/uglovye-kuhni` | 99–100 | 1598/1700/1774 | 0 | 2–3 | 100 | 100 |
| `/styles/minimalizm` | 99 | 1459/1492/1563 | 0 | 0 | 100 | 100 |
| `/scenarios/dlya-malenkoy-kuhni` | 100 | 1467/1473/1491 | 0 | 3–6 | 100 | 100 |
| `/materials/furnitura` | 99–100 | 1446/1447/1523 | 0 | 5–10 | 96 | 100 |

Console errors: 0 во всех 12 отчётах. Итог: environment delta подтверждён, production hard gate PASS 12/12, `STAGE_4_ACCEPTED`.
