# L1B SEO, UX, accessibility and performance QA

Дата: 2026-08-13
Статус: `LOCAL_ACCEPTED`

## Scope

- `/locations/molodechno`;
- `/locations/zhodino`;
- `/locations/slutsk`;
- `/locations/maryina-gorka`.

## UX и accessibility

- четыре route-specific visual state на каждой странице;
- три последовательных действия меняют `currentSrc` и короткое следствие;
- `naturalWidth > 0`, interaction CLS ≤ 0.02, scroll jump ≤ 2 px;
- tabs имеют русские accessible names и `aria-selected`;
- keyboard arrows/Home/End, reduced motion и touch target ≥44 px — PASS;
- responsive 360/390/412/768/1440 без horizontal overflow — PASS;
- ExploreContext сохраняет meaningful location choice без PII;
- embedded Browser подтвердил H1=1, self-canonical, `naturalWidth=1200`, отсутствие overflow и видимую смену initial → worktop на Молодечно.

## SEO и внутренняя перелинковка

- metadata, schema, canonical contract, slugs, robots и sitemap logic не менялись;
- sitemap: 112 canonical URL;
- server HTML содержит H1, вопрос, initial visual, disclosure и crawlable next links;
- каждый state имеет 2 релевантных canonical next routes, self-loop отсутствует;
- русские alt/disclosure и честное обозначение AI-концепций — PASS;
- исправлено generic local-proof значение: текущий город используется вместо соседнего элемента `areas`.

## Performance

Representative mobile Lighthouse, production build, `/locations/molodechno`:

| Метрика | Результат |
| --- | ---: |
| Performance | 95 |
| Accessibility | 97 |
| SEO | 100 |
| LCP | 1704 мс |
| CLS | 0 |
| TBT | 7 мс |

Responsive preload начального mobile WebP устранил позднее обнаружение LCP без роста client JS. Runtime WebP не превышают 55,7 КБ; mobile WebP меньше 25 КБ.

## Команды

- `pnpm.cmd run typecheck` — PASS;
- `pnpm.cmd run test:exploration` — 20/20 PASS;
- `pnpm.cmd run test:leads` — 6/6 PASS;
- `pnpm.cmd run sitemap:check` — 112 URL PASS;
- `pnpm.cmd run seo:check` — PASS;
- `pnpm.cmd run images:audit` — broken/oversized/badNames = 0;
- `pnpm.cmd run build` — PASS;
- `pnpm.cmd exec playwright test -c playwright.location-visual-l1b.config.ts` — 19/19 PASS после final performance fix.

Production acceptance остаётся отдельным gate после commit, push и стандартного deploy.
