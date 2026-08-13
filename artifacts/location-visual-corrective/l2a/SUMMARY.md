# L2A location visual corrective — summary

Дата: 2026-08-13
Статус: `PRODUCTION_ACCEPTED`

## Реализовано

- `/locations/smolevichi`;
- `/locations/dzerzhinsk`;
- `/locations/zaslavl`;
- `/locations/logoisk`.

Каждый route получил собственную серию из четырёх изображений, три изменения `currentSrc`, русские controls/alt/disclosure, meaningful ExploreContext и canonical next routes. 16 masters созданы встроенным `imagegen`, сохранены и оптимизированы в проекте.

## Приёмка

Media, unit, typecheck, build, sitemap, SEO, images, responsive, keyboard, reduced motion, protected regression, Browser и representative mobile Lighthouse — PASS. Production deploy и live smoke также приняты. Подробности: `MEDIA-ACCEPTANCE.md`, `SEO-UX-QA.md` и `PRODUCTION-ACCEPTANCE.md`.

Runtime commit `57860f20c4a4b2e865e228df3e2b4144056c798f` развёрнут, production HEAD подтверждён, сервис active. Production Playwright: `19/19`; 48/48 оптимизированных assets: `200`; Lighthouse Смолевичи: `P100 / A97 / BP100 / SEO100`, `LCP 1437 мс`, `CLS 0`, `TBT 18 мс`. Общий финальный статус `LOCATION_VISUAL_CORRECTIVE_ACCEPTED` использовать нельзя: он относится ко всем 28 generic city routes.

## Rollback

`git revert 57860f20c4a4b2e865e228df3e2b4144056c798f`, push `work`, стандартный deploy и повтор target/protected/media/sitemap/robots smoke. DB/schema/content rollback не требуется.
