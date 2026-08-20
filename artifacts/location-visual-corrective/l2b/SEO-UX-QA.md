# L2B SEO / UX / accessibility / performance QA

Дата: 2026-08-14

## PASS

- `pnpm.cmd run typecheck` — PASS.
- `pnpm.cmd run test:exploration` — 20/20 PASS.
- `pnpm.cmd run test:leads` — 6/6 PASS.
- `pnpm.cmd run sitemap:check` — 112 URL PASS.
- `pnpm.cmd run seo:check` — PASS.
- `pnpm.cmd run images:audit` — broken/oversized/badNames = 0.
- `pnpm.cmd run build` — PASS; ожидаемые DB fallback warnings при недоступной локальной PostgreSQL не прервали сборку.
- Route-specific Playwright — 19/19 PASS: четыре route, 3 `currentSrc` changes, naturalWidth, ExploreContext, scroll stability, CLS, mobile 390, responsive 360/412/768/1440, keyboard, reduced motion и 6 protected routes.
- Browser 390×844 — H1=1, explorer начинается на 320 px, ширина 343–356 px, controls 48–62 px, overflow отсутствует, mobile `currentSrc` = `*-mobile.webp`, `naturalWidth=480`.
- Metadata, canonical, schema и sitemap не изменены.
- `/scenarios/dlya-doma` из ТЗ отсутствует в canonical registry; вместо нового URL используются `/scenarios` и существующие узкие маршруты.

## Performance gate — финальная перепроверка 2026-08-20

Первоначальный Lighthouse representative `/locations/vileyka`, mobile 390×844, Lantern `simulate`:

- Performance 95–97;
- Accessibility 97;
- SEO 100;
- CLS 0;
- TBT 2–17.5 мс;
- LCP 2559–2565 мс на повторных simulated runs.

Mobile LCP asset исправлен с 1200 px на 480 px (8 030 байт), request discoverability/fetch priority PASS. Разбор фаз показал, что TTFB, discovery и загрузка не являются блокером: request delay 7–39 мс, загрузка 5–64 мс, observed render delay 108–274 мс. Завышение создавалось Lantern-моделью: после обновления локального Chrome до 151 она стала показывать 2,9–3,2 с и на ранее принятом L1B, приписывая почти всё время simulated render delay.

Финальный Lighthouse 12.6.1, mobile 390×844, `throttlingMethod=devtools`, три холодных прогона:

| Прогон | Performance | Accessibility | SEO | LCP | TBT | CLS |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 98 | 97 | 100 | 1806 мс | 49,4 мс | 0 |
| 2 | 98 | 97 | 100 | 1800 мс | 51,9 мс | 0 |
| 3 | 99 | 97 | 100 | 1791 мс | 48,4 мс | 0 |

Evidence: `lighthouse-vileyka-devtools-final-1.report.json` — `-3.report.json`. Изолированный Playwright повторно прошёл 19/19: `playwright-l2b-isolated-final.json`.

Статус: `LOCAL_PASS_PRODUCTION_PENDING`.
