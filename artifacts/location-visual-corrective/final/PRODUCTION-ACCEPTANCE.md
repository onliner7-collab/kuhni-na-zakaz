# Location visual corrective — final production acceptance

Дата: 2026-08-21  
Production runtime: `e7cd4baad7279968e559f9cc43ddce26804bdb8f`.

## Итог

- L0–L3C: 28/28 городов с собственным активным визуальным контрактом;
- финальная locations regression: 32/32 PASS;
- на каждом из 28 активных routes: четыре состояния, загруженное изображение и три фактические смены `currentSrc`;
- `/locations`, `/locations/minsk`, `/locations/minskaya-oblast`, `/locations/borisov`: protected PASS без generic explorer;
- production sitemap: 112 URL, 112/112 HTTP 200, 112/112 self-canonical;
- robots.txt: HTTP 200, sitemap объявлен;
- `/locations`: ссылки на все 28 активных городов;
- image audit: 524 referenced, 0 broken, 0 oversized, 0 bad names;
- service: active.

## Финальные performance gates

| Batch | Representative | Production LCP | Performance | TBT | CLS | A11y | SEO |
|---|---|---|---|---|---|---|---|
| L3A | Березино | 2129 / 2228 / 2002 мс | 93–95 | 167–186 мс | 0 | 95 | 100 |
| L3B | Червень | 1981 / 1978 / 1976 мс | 95–96 | 139–189 мс | 0 | 95 | 100 |
| L3C | Любань | 2142 / 1986 / 2071 мс | 93–95 | 164–192 мс | 0 | 95 | 100 |

## Browser evidence

Встроенный Browser на `/locations/lyuban`: AVIF сменился с `lyuban-open-passage.avif` на `lyuban-appliance-priority.avif`, `naturalWidth=1200`, выбранный tab обновился, H1=1, self-canonical, missing alt=0, overflow отсутствует, console errors=0.

Статус: `LOCATION_VISUAL_CORRECTIVE_ACCEPTED`.
