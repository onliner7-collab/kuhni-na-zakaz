# Аудит побочного импорта перед этапом 4

Дата проверки: 2026-07-14. Production baseline: `19ac6ab`.

## Источники

- backup до deploy: `db-backup-2026-07-14T05-50-44-331Z.json`;
- текущие строки production PostgreSQL прочитаны через Prisma без записи;
- отчёт `project-docs/stage-4-2-photo-import/import-report.json`;
- код `import-prepared-kitchen-photos.ts`, `import-portfolio-project-folders.ts` и `update-production.sh`.

## Что изменилось

### StylePage

`minimalizm` и `skandinavskie`: изменился только `updatedAt` с `2026-07-13T21:09:26.*Z` на `2026-07-14T05:50:44.*Z`. Значения `slug`, URL, title/headline, description/intro/content, image, SEO title/description/keywords, price, publication state и relation arrays не изменились. CSV содержит те же image URL, поэтому это повторный безусловный `UPDATE`, а не новое назначение изображения.

### PortfolioCase

36 опубликованных записей сохранили URL, изображения, alt, подписи, тексты, SEO-поля и остальные данные, но получили новый `order` и `updatedAt`. Каждый order сдвинулся на `+36`:

```text
kuhnya-s-ostrovom-minimalizm-005 7528→7564
kuhnya-s-ostrovom-minimalizm-011 7529→7565
kuhnya-s-ostrovom-minimalizm-025 7530→7566
kuhnya-s-ostrovom-sovremennaya-009 7531→7567
malenkaya-kuhnya-sovremennaya-030 7532→7568
pryamaya-kuhnya-klassika-019 7533→7569
pryamaya-kuhnya-minimalizm-003 7534→7570
pryamaya-kuhnya-minimalizm-004 7535→7571
pryamaya-kuhnya-minimalizm-006 7536→7572
pryamaya-kuhnya-minimalizm-010 7537→7573
pryamaya-kuhnya-minimalizm-016 7538→7574
pryamaya-kuhnya-minimalizm-022 7539→7575
pryamaya-kuhnya-minimalizm-027 7540→7576
pryamaya-kuhnya-minimalizm-034 7541→7577
pryamaya-kuhnya-neoklassika-020 7542→7578
pryamaya-kuhnya-neoklassika-028 7543→7579
pryamaya-kuhnya-sovremennaya-008 7544→7580
pryamaya-kuhnya-sovremennaya-013 7545→7581
pryamaya-kuhnya-sovremennaya-026 7546→7582
pryamaya-kuhnya-sovremennaya-031 7547→7583
uglovaya-kuhnya-loft-023 7548→7584
uglovaya-kuhnya-minimalizm-017 7549→7585
uglovaya-kuhnya-minimalizm-018 7550→7586
uglovaya-kuhnya-minimalizm-029 7551→7587
uglovaya-kuhnya-minimalizm-033 7552→7588
uglovaya-kuhnya-minimalizm-036 7553→7589
uglovaya-kuhnya-neoklassika-002 7554→7590
uglovaya-kuhnya-neoklassika-014 7555→7591
uglovaya-kuhnya-neoklassika-035 7556→7592
uglovaya-kuhnya-skandinavskaya-012 7557→7593
uglovaya-kuhnya-sovremennaya-001 7558→7594
uglovaya-kuhnya-sovremennaya-007 7559→7595
uglovaya-kuhnya-sovremennaya-015 7560→7596
uglovaya-kuhnya-sovremennaya-021 7561→7597
uglovaya-kuhnya-sovremennaya-024 7562→7598
uglovaya-kuhnya-sovremennaya-032 7563→7599
```

MaterialPage: 5 до/после, различий нет.

## Причина и идемпотентность

Обычный deploy безусловно запускал два миграционных importer. Первый выполнял `UPDATE` даже при одинаковом image/data. Второй вычислял order от текущего максимума при каждом запуске, поэтому 36 записей сдвигались повторно. Baseline `19ac6ab` не был идемпотентен по данным.

Исправление этапа 4:

- обычный deploy по умолчанию пропускает content imports; для согласованной миграции нужен явный `RUN_CONTENT_IMPORTS=1`;
- importers сравнивают payload и не вызывают Prisma update без фактической разницы;
- существующий portfolio order сохраняется, если manifest не задаёт order явно.

После deploy исправления требуется контроль: в логе должна быть строка `content imports skipped`, а current `order` и `updatedAt` должны остаться неизменными.

## Область проверки дублей

Stage 3 `assets:duplicates` проверял **306 файлов** только в `public/media/pilots` и `public/images/materials-gallery-v2/furnitura`, точным SHA-256: 0 групп. Архитектурный аудит с 47 группами проверял **весь runtime public** (около 1008 файлов) и остаётся действительным. Результаты не противоречат друг другу: scope и набор файлов различаются; near-duplicate/perceptual анализ в stage-3 команде не выполнялся.
