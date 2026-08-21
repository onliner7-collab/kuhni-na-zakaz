# L3C — production acceptance

Дата: 2026-08-21  
Scope: Крупки, Любань, Старые Дороги.

- production runtime: `e7cd4baad7279968e559f9cc43ddce26804bdb8f`;
- service: `active`;
- production Playwright: 21/21 PASS;
- четыре состояния и три фактические смены `currentSrc` на каждом route: PASS;
- canonical, H1, mobile derivatives, responsive, keyboard/reduced motion и protected regression: PASS.

## Lighthouse 12.6.1

Mobile 390×844, DevTools throttling, три холодных production-запуска Любани:

| Прогон | Performance | Accessibility | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 93 | 95 | 100 | 2142 мс | 192 мс | 0 |
| 2 | 95 | 95 | 100 | 1986 мс | 164 мс | 0 |
| 3 | 95 | 95 | 100 | 2071 мс | 167 мс | 0 |

Все hard gates пройдены. Минимальный запас LCP — 358 мс.

Rollback: revert runtime-коммита `e7cd4baad7279968e559f9cc43ddce26804bdb8f` отдельным коммитом в `work`, затем стандартный deploy.

Статус: `LOCATION_VISUAL_CORRECTIVE_ACCEPTED`.
