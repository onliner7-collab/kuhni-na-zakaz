# L1A location visual corrective — local summary

Дата: 2026-08-12
Статус: `VISUAL_ACCEPTED`

## Реализовано

- `/locations/vitebsk`;
- `/locations/grodno`;
- `/locations/brest`;
- `/locations/mogilev`.

Каждый route получил собственную серию из четырёх изображений, три изменения `currentSrc`, русские controls/alt/disclosure, meaningful ExploreContext и canonical next routes. 16 masters сохранены и оптимизированы в проекте.

## Приёмка

Media, unit, build, sitemap, SEO, images, responsive, keyboard, reduced motion, protected regression и Browser QA — PASS. Подробности: `MEDIA-ACCEPTANCE.md` и `SEO-UX-QA.md`.

Hard gates пройдены локально и на production. Production final Playwright 19/19 PASS; фактические mobile Lighthouse-прогоны дали Performance 93–95, Accessibility 97, SEO 100, LCP 1948–2168 мс, CLS 0 и TBT 156–200 мс. Добавлены 480×320 WebP-производные, server initial visual, hydration guard и постоянный 3:2-контейнер без scroll jump. Production HEAD `b0da6eaa2a801de4e376f45a4d1b56c40a4840ef`, service active.

## Rollback

Rollback: `git revert b0da6ea cc04bd7 89285ea`, push `work`, стандартный deploy и повтор smoke. DB/schema/content rollback не требуется.
