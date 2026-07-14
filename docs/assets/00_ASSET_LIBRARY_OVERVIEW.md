# Этап 3 — Digital Asset Library

Дата: 2026-07-14. Библиотека подготовлена для `/catalog/uglovye-kuhni`, `/locations/borisov` и `/materials/furnitura` без изменения production-страниц.

## Состав

- 33 коллекции: 9 Angular, 12 Borisov, 12 Hardware.
- 137 asset-level записей; 131 запись AI/technical имеет полный prompt package.
- 36 кандидатов имеют master + AVIF + WebP: 26 прошли визуальный отбор и зарегистрированы, 10 оставлены `REVIEW_REQUIRED` из-за несовпадения целевого ratio/crop. В число 36 входят 33 legacy-кандидата и 3 новых выбранных hero-варианта.
- 95 новых записей имеют `PROMPT_READY`; 6 real-only placeholder имеют `PLANNED` и не подменяются AI-контентом.
- 203 исходных image-node страницы фурнитуры классифицированы отдельно; удалено 0 файлов, точных дублей найдено 0, provenance не подтверждён у 203 записей.

## Источники истины

- manifests v2: `content/media/pilots/<pilot>/manifest.json`;
- legacy hardware inventory: `content/media/pilots/hardware/existing-hardware-inventory.json`;
- структура будущей библиотеки: `public/media/pilots/<pilot>/<collection>/`;
- фактические существующие runtime-файлы: `artifacts/kuhni-na-zakaz/public/media/pilots/<pilot>/{masters,avif,webp}`.

Корневой `public/media` не является runtime public-dir Next.js-приложения. Бинарные файлы не копируются туда автоматически: это предотвращает второй тяжёлый набор. Новые delivery-файлы должны сохраняться в runtime public-dir, а manifest хранит и public path, и project path.

## Запреты этапа

Ни один asset не получил `CONNECTED`, `VERIFIED` или `LIVE` в target-stage contract. Production routes, components, CSS, metadata, schema, forms, sitemap, robots, canonical и Prisma не изменяются.
