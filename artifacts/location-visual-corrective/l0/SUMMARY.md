# L0 location visual corrective — local summary

Дата: 2026-08-10
Текущий статус: `L0_VISUAL_ACCEPTED`.

## Scope

- `/locations`;
- `/locations/soligorsk`;
- `/locations/fanipol`;
- `/locations/gomel`;
- regression: `/`, `/design-proekt-kuhni`, `/locations/minsk`, `/locations/minskaya-oblast`, `/locations/borisov`, `/materials/furnitura`.

## Local gates

- TypeScript: PASS.
- Exploration unit: 18/18 PASS.
- Lead unit: 6/6 PASS.
- Sitemap: 112 URL PASS, static fallback из-за недоступной локальной PostgreSQL.
- SEO brand: PASS.
- Images audit: broken 0, oversized 0, bad names 0.
- Production build: 127 static pages PASS; локальная PostgreSQL `127.0.0.1:5434` недоступна, штатные fallbacks отработали.
- Playwright: 26/26 PASS, три `currentSrc` change на каждом пилоте, widths 360/390/412/768/1440, keyboard/reduced motion, hub, protected 6/6.
- Lighthouse local production build:
  - Солигорск: Performance 100, Accessibility 97, SEO 100, LCP 463 ms, CLS 0, TBT 0 ms.
  - Фаниполь: Performance 99, Accessibility 97, SEO 100, LCP 426 ms, CLS 0, TBT 0 ms.
  - Гомель: Performance 99, Accessibility 97, SEO 100, LCP 425 ms, CLS 0, TBT 0 ms.
- Internal-link validation: 24 ссылки, 9 уникальных sitemap targets, missing 0.
- Подробный SEO/UX gate: `SEO-UX-QA.md`.

## Rollback

Runtime `1fedd22e26ebd55c1b2aa2ad2de8393af3ff9e9a` задеплоен штатным Timeweb script: server build PASS, service active. Финальный production Playwright 26/26 и встроенный Browser QA прошли. Подробности: `PRODUCTION-ACCEPTANCE.md`.

Rollback: `git revert 1fedd22e26ebd55c1b2aa2ad2de8393af3ff9e9a`, push рабочей ветки, стандартный production deploy, повторный smoke четырёх изменённых и шести protected URL.
