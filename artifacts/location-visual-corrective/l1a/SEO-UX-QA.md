# L1A SEO, UX, accessibility и performance QA

Дата: 2026-08-12

## PASS

- TypeScript: PASS.
- Exploration unit: 20/20 PASS.
- Lead unit: 6/6 PASS.
- Sitemap: 112 canonical URL PASS.
- SEO brand: PASS.
- Images audit: broken 0, oversized 0, bad names 0.
- Build: 127 static pages PASS; локальная PostgreSQL недоступна, штатные fallbacks отработали.
- Playwright: 19/19 PASS раздельными evidence runs: 4 routes × interaction + 390 px, representative 360/412/768/1440, keyboard/reduced motion, protected 6/6.
- Для каждого города три действия изменили загруженный `currentSrc`, `aria-selected=true`, context без PII, interaction CLS ≤ 0,02. Initial mobile visual использует 480×320 WebP; следующие desktop-assets сохраняют 1200×800 WebP/AVIF.
- Встроенный Browser 390×844: H1=1, tabs=4, initial image 1200 px, overflow=false, missing alt=0 на 4/4 routes; Витебск проверен через три последовательных состояния.
- Lighthouse desktop (тот же профиль, что в L0): Performance 100, Accessibility 100, SEO 100, LCP 705 мс, CLS 0, TBT 0.

## Performance evidence — PASS

- Фактический Lighthouse mobile с DevTools-троттлингом:

- Витебск: Performance 97, Accessibility 97, SEO 100, LCP 1729 мс, CLS 0, TBT 149 мс.
- Гродно: Performance 97, Accessibility 97, SEO 100, LCP 1718 мс, CLS 0, TBT 142 мс.
- Брест: Performance 97, Accessibility 97, SEO 100, LCP 1758 мс, CLS 0, TBT 139 мс.
- Могилёв: Performance 97, Accessibility 97, SEO 100, LCP 1727 мс, CLS 0, TBT 140 мс.

Все performance budgets раздела 13 пройдены. Reports сохранены в `lighthouse-local/*-mobile-final.report.{json,html}`; для Витебска — `vitebsk-mobile-devtools.report.{json,html}`.

## SEO/on-page/internal links

- Metadata, canonical, schema, H1 и sitemap не менялись.
- Все 32 state links (4 routes × 4 states × 2) ведут на canonical sitemap routes; self-loop нет.
- Anchors русские и меняются по выбранному намерению.
- Long-form индексируемый контент остаётся после visual journey.
- AI-концепции не размечены как real project/Product/Offer.
