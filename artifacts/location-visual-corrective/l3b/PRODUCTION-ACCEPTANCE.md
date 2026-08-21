# L3B — production acceptance

Дата: 2026-08-21  
Scope: Червень, Клецк, Копыль.

- production runtime: `cf5bd382ade69178b3589260bcb2ade488aaf2bb`;
- service: `active`;
- production Playwright: 21/21 PASS;
- четыре состояния и три фактические смены `currentSrc` на каждом route: PASS;
- canonical, один H1, mobile derivatives, отсутствие overflow, responsive 360/390/412/768/1440, keyboard/reduced motion и шесть protected routes: PASS.

## Lighthouse 12.6.1

Mobile 390×844, DevTools throttling, три холодных production-запуска Червеня:

| Прогон | Performance | Accessibility | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 95 | 95 | 100 | 1981 мс | 189 мс | 0 |
| 2 | 96 | 95 | 100 | 1978 мс | 139 мс | 0 |
| 3 | 96 | 95 | 100 | 1976 мс | 152 мс | 0 |

Все hard gates пройдены. Минимальный запас LCP — 519 мс.

Rollback: revert runtime-коммита `cf5bd382ade69178b3589260bcb2ade488aaf2bb` отдельным коммитом в `work`, затем стандартный deploy.

Статус: `LOCATION_VISUAL_CORRECTIVE_ACCEPTED`.
