# L2A SEO / UX / accessibility / performance QA

Дата: 2026-08-13
Статус локально: `VISUAL_ACCEPTED`

## Scope

- `/locations/smolevichi`;
- `/locations/dzerzhinsk`;
- `/locations/zaslavl`;
- `/locations/logoisk`.

## UX и accessibility

- 4 states и 3 distinct `currentSrc` changes на каждом route.
- `aria-selected`, tablist/tabpanel, Enter/Space, стрелки, Home/End, visible focus и reduced motion — PASS.
- 360/390/412/768/1440 responsive — PASS; horizontal overflow = 0.
- Touch target controls ≥ 44 px, Dock suppression во время interaction — PASS.
- ExploreContext сохраняет только meaningful location choice без PII.
- Browser 390×844 подтвердил server initial WebP `naturalWidth=1200`, три изменения visual, русские alt/consequence/disclosure и отсутствие Dock overlap.

## SEO и linking

- H1 = 1, self canonical, metadata/schema/sitemap не изменялись.
- Sitemap остаётся 112 URL; active next routes присутствуют в canonical sitemap.
- Initial visual, вопрос, disclosure и next links существуют в server HTML.
- Protected `/`, `/design-proekt-kuhni`, `/locations/minsk`, `/locations/minskaya-oblast`, `/locations/borisov`, `/materials/furnitura` не получают generic explorer и прошли regression.
- Images audit: 420 referenced, broken 0, oversized 0, bad names 0.

## Lighthouse representative

`/locations/smolevichi`, simulated mobile, Lighthouse 12.6.1:

- Performance 97;
- Accessibility 97;
- Best Practices 100;
- SEO 100;
- LCP 2 556 ms;
- CLS 0;
- TBT 4 ms;
- mobile LCP transfer 8 507 bytes.

Performance remediation: общий location helper расширен на L2A mobile derivatives; 1200 px WebP больше не является mobile LCP request.

## Команды

- `pnpm.cmd run typecheck` — PASS.
- `pnpm.cmd run test:exploration` — 20/20 PASS.
- `pnpm.cmd run test:leads` — 6/6 PASS.
- `pnpm.cmd run sitemap:check` — 112 PASS.
- `pnpm.cmd run seo:check` — PASS.
- `pnpm.cmd run images:audit` — PASS.
- `pnpm.cmd run build` — PASS, 127 static pages с ожидаемым DB fallback.
- `pnpm.cmd exec playwright test -c playwright.location-visual-l2a.config.ts` — 19/19 PASS.

Evidence: `artifacts/location-visual-corrective/l2a/`.
