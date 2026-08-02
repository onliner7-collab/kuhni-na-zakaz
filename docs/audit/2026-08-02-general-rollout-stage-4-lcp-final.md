# Финальная приёмка LCP этапа 4

Дата: 2026-08-02
Итог: `STAGE_4_ACCEPTED`

## Причина и решение

Локальный Lighthouse 12.6.1 с профилем `mobile` + `simulate` воспроизводимо показывал LCP 2855–3095 мс, хотя observed trace до фактической LCP-отрисовки составлял около 83–130 мс. Production-control тем же профилем до deploy прошёл 12/12 с LCP 1591–2044 мс. Это позволило выполнить предусмотренный ТЗ обратимый production verification.

Контролируемые эксперименты не подтвердили пользу `decoding="sync"`, удаления blur или ручного `react-dom preload()`. Дублирующие ручные preload удалены; первый LCP frame больше не получает forced async, последующие intent-mounted frames остаются async. Корректирующие русские подписи и progressive-галерея сохранены.

## Проверки до deploy

- typecheck — PASS;
- exploration tests — 11/11 PASS;
- lead tests — 6/6 PASS;
- sitemap — 112 URL PASS;
- SEO check — PASS;
- image audit — 296 references, broken/oversized/bad names: 0;
- production build — PASS;
- corrective Playwright — 12/12 PASS;
- visual-rescue: 23 routes, widths 360/390/412/768/1440, protected five, keyboard/focus/reduced motion — PASS;
- H1, self-canonical, overflow, broken images и crawlable server links — PASS.

## Commit и deploy

- runtime commit: `30fc9388a78493becb1ec344e236e88752fb6b22`;
- push `origin/work` — PASS;
- Timeweb build — PASS;
- сервис `kuhni-na-zakaz` — active;
- server HEAD совпадает с runtime commit;
- четыре LCP-маршрута, главная, representative/protected routes, `/sitemap.xml` и `/robots.txt` — HTTP 200.

Production Browser подтвердил 23/23 маршрута: H1=1, self-canonical, overflow=0, broken images=0, missing alt=0. Интерактивный state минимализма переключается; progressive-галерея фурнитуры после отложенного монтажа показывает 18 изображений в DOM без битых файлов и кнопку «Показать ещё».

## Production Lighthouse hard gate

Lighthouse 12.6.1, simulated mobile, три прогона каждого URL:

| Маршрут | LCP, мс | Performance | CLS | TBT, мс | Accessibility | SEO |
|---|---:|---:|---:|---:|---:|---:|
| `/catalog/uglovye-kuhni` | 1598/1700/1774 | 99–100 | 0 | 2–3 | 100 | 100 |
| `/styles/minimalizm` | 1459/1492/1563 | 99 | 0 | 0 | 100 | 100 |
| `/scenarios/dlya-malenkoy-kuhni` | 1467/1473/1491 | 100 | 0 | 3–6 | 100 | 100 |
| `/materials/furnitura` | 1446/1447/1523 | 99–100 | 0 | 5–10 | 96 | 100 |

Hard gate PASS 12/12; console errors 0. Откат не потребовался.

## Evidence и rollback

Evidence: `artifacts/general-rollout/stage-4-lcp-final/`, включая local-before, production-control-before, controlled experiments, final local и production-after JSON/HTML reports.

Точный rollback runtime: `git revert 30fc9388a78493becb1ec344e236e88752fb6b22`, push ветки `work`, стандартный Timeweb deploy, затем smoke и production-control.

```text
STAGE_2_ACCEPTED
STAGE_3_ACCEPTED
STAGE_4_ACCEPTED
GENERAL_ROLLOUT_FOUNDATION_ACCEPTED
```
