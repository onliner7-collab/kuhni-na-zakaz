# Stage 4 LCP final — итоговая сводка

Дата: 2026-08-02
Итог: `STAGE_4_ACCEPTED`.

- Local simulated mobile: LCP FAIL 12/12; остальные budgets PASS.
- Production-control до deploy: hard gate PASS 12/12, LCP 1591–2044 мс.
- Environment delta подтверждён trace-фазами и повторяемыми сериями.
- Недоказанные ручные preloads удалены; первый LCP frame больше не получает forced async; последующие intent frames остаются async.
- Corrective Playwright 12/12 PASS.
- Visual-rescue 23 routes + widths + protected five: 2/2 PASS.
- Typecheck, exploration 11/11, leads 6/6, sitemap 112, SEO, images 296, build 127 pages: PASS.
- Runtime commit: `30fc9388a78493becb1ec344e236e88752fb6b22`.
- Timeweb deploy: build PASS, `kuhni-na-zakaz` active, server HEAD совпадает с runtime commit.
- Production smoke: четыре LCP-маршрута, главная, protected routes, sitemap и robots — HTTP 200.
- Production Browser: 23/23 маршрута; H1=1, self-canonical, overflow=0, broken images=0, русские alt; visual state и progressive gallery работают.
- Production Lighthouse 12.6.1 simulated mobile после deploy: hard gate PASS 12/12; LCP 1446–1774 мс, Performance 99–100, CLS 0, TBT 0–10 мс, Accessibility 96–100, SEO 100, console errors 0.

Точный rollback: `git revert 30fc9388a78493becb1ec344e236e88752fb6b22`, push `work`, повторить стандартный Timeweb deploy, smoke и production-control.
