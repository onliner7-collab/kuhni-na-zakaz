# L1B location visual corrective — local summary

Дата: 2026-08-13
Статус: `LOCAL_ACCEPTED`

## Реализовано

- `/locations/molodechno`;
- `/locations/zhodino`;
- `/locations/slutsk`;
- `/locations/maryina-gorka`.

Каждый route получил собственную серию из четырёх изображений, три изменения `currentSrc`, русские controls/alt/disclosure, meaningful ExploreContext и canonical next routes. 16 masters сохранены и оптимизированы в проекте.

## Приёмка

Media, unit, typecheck, build, sitemap, SEO, images, responsive, keyboard, reduced motion, protected regression, Browser и mobile Lighthouse — PASS. Подробности: `MEDIA-ACCEPTANCE.md` и `SEO-UX-QA.md`.

До production deploy и live interaction smoke нельзя использовать общий статус `LOCATION_VISUAL_CORRECTIVE_ACCEPTED`.

## Rollback

После runtime commit: `git revert <L1B-commit>`, push `work`, стандартный deploy и повтор target/protected/media/sitemap/robots smoke. DB/schema/content rollback не требуется.
