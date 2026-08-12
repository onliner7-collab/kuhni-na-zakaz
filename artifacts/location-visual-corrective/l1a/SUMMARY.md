# L1A location visual corrective — local summary

Дата: 2026-08-12
Статус: `L1A_LOCAL_ACCEPTANCE_PASS`

## Реализовано

- `/locations/vitebsk`;
- `/locations/grodno`;
- `/locations/brest`;
- `/locations/mogilev`.

Каждый route получил собственную серию из четырёх изображений, три изменения `currentSrc`, русские controls/alt/disclosure, meaningful ExploreContext и canonical next routes. 16 masters сохранены и оптимизированы в проекте.

## Приёмка

Media, unit, build, sitemap, SEO, images, responsive, keyboard, reduced motion, protected regression и Browser QA — PASS. Подробности: `MEDIA-ACCEPTANCE.md` и `SEO-UX-QA.md`.

Hard gates пройдены. Четыре фактических mobile Lighthouse-прогона с DevTools-троттлингом дали Performance 97, Accessibility 97, SEO 100, LCP 1718–1758 мс, CLS 0 и TBT 139–149 мс. Добавлены 480×320 WebP-производные 6–12 КБ и серверный initial visual, чтобы LCP-кандидат не зависел от клиентского переключателя. Следующий шаг — scope commit, push, стандартный deploy и production smoke.

## Rollback

До deploy локальный rollback — удалить только L1A series/tests/media/evidence и вернуть точечные L1A additions в runtime-файлах; DB/schema/data не менялись. После deploy — Git revert runtime commit, push и стандартный deploy.
