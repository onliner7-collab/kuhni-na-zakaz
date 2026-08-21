# L3A SEO, UX, accessibility and performance QA

Дата: 2026-08-14

- TypeScript: PASS.
- Exploration/registry: 20/20 PASS.
- Leads: 6/6 PASS.
- Sitemap: 112 canonical URL PASS.
- SEO brand audit: PASS.
- Image audit: 476 referenced, 0 broken, 0 oversized.
- Production build: PASS; локальная БД `127.0.0.1:5434` недоступна, предусмотренные static fallbacks отработали.
- Playwright: 17/17 PASS после исправления mobile derivative recognition; три `currentSrc` changes на route, naturalWidth, scroll stability, CLS≤0.02, ExploreContext без PII, keyboard/reduced motion, 360/390/412/768/1440 и шесть protected routes.
- Встроенный Browser: Березино PASS — source AVIF сменился на layout AVIF, `naturalWidth=1200`, `aria-selected` обновлён, overflow отсутствует.
- Lighthouse 12.6.1 mobile Березино, DevTools throttling, три холодных запуска: P96–97/A95/SEO100, LCP 1834 / 1681 / 1728 мс, CLS 0, TBT 151–162 мс. LCP-элемент — первый route-specific visual; в третьем прогоне TTFB 7 мс, resource delay 610 мс, load 632 мс, render delay 479 мс.

Все локальные hard gates пройдены, минимальный запас LCP — 666 мс. Production acceptance фиксируется отдельным evidence после deploy.

Статус локального гейта: `LOCATION_VISUAL_CORRECTIVE_LOCAL_ACCEPTED`.
