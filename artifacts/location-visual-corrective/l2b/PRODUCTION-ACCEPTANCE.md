# Location visual corrective L2B — production acceptance

Дата: 2026-08-20

Runtime commit: `e30d3251a0038c025d0ec6a59639cf1508d5825e`

Scope: Вилейка, Несвиж, Воложин, Мядель.

## Deploy

- `origin/work` обновлён до `e30d325`.
- Стандартный `deploy/scripts/update-production.sh work` завершил fast-forward, install, Prisma sync, sitemap, production build и restart.
- `kuhni-na-zakaz.service` — `active`.
- Production HEAD — `e30d3251a0038c025d0ec6a59639cf1508d5825e`.
- Четыре L2B URL, 15 ранее принятых L0–L2A URL, protected routes, `/robots.txt` и `/sitemap.xml` отвечают `200`.

## Production Browser / Playwright

- Playwright production: 19/19 PASS — четыре L2B route, три изменения загруженного `currentSrc`, 390 px, responsive 360/412/768/1440, keyboard, reduced motion и шесть protected routes.
- Browser 390×844: все 19 принятых L0–L2B route имеют четыре состояния, один H1, self-canonical, overflow 0, загруженное изображение и фактическое изменение `currentSrc`; ошибок консоли нет.
- L2B mobile assets используют `*-mobile.webp`, `naturalWidth=480` до и после переключения.

Evidence:

- `playwright-production-accepted.json`;
- `playwright-production-accepted-results/`;
- `lighthouse-vileyka-production-final-1.report.json` — `-3.report.json`.

## Production Lighthouse

Lighthouse 12.6.1, `/locations/vileyka`, mobile 390×844, `throttlingMethod=devtools`, три холодных прогона:

| Прогон | Performance | Accessibility | SEO | LCP | TBT | CLS |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 97 | 97 | 100 | 2111 мс | 84 мс | 0 |
| 2 | 96 | 97 | 100 | 2121 мс | 81 мс | 0 |
| 3 | 97 | 97 | 100 | 2093 мс | 80 мс | 0 |

Все прогоны прошли hard gate LCP `<2500 мс` с запасом минимум 379 мс.

## Rollback

`git revert e30d325`, push `work`, стандартный deploy и повтор L2B/protected/L0–L2A smoke. Prisma schema, data и content imports в L2B не менялись.

Статус: `LOCATION_VISUAL_CORRECTIVE_ACCEPTED`.
