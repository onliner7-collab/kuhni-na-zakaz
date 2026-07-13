# Media System

## Целевая структура

`public/media/<page-or-feature>/{masters,avif,webp,posters,sequences}`; manifest рядом в `content/media/<page-or-feature>.json`. Точные медиакарты создаются только в этапе 3.

## Manifest contract

Обязательные поля: assetId, path/master, avif, webp, poster, type, width, height, aspectRatio, realOrAi, source/rights, prompt (для AI), alt, caption, pageUsage, mobileVariant, desktopVariant, sequenceOrder, loading, priority, checksum и status.

## Правила

- Kitchen images генерируются только встроенным `imagegen`; master хранится в проекте.
- PNG/JPEG master не подключается как основной visible src при наличии WebP/AVIF.
- Hero может быть priority только один; прочие медиа lazy. Скрытые sequences не загружаются до намерения пользователя/появления.
- Видео имеет poster, muted/no autoplay по умолчанию и текстовую альтернативу.
- Реальный проект и AI-концепт имеют разные статусы и понятную русскую маркировку.
- Имена: `<page>-<scene>-<variant>-<orientation>-<version>.<ext>`; asset ID стабилен при замене файла.

## Baseline

Public содержит 1008 файлов/358 МБ и смешанные директории `images`, `uploads`, `media/pilots`. Есть AVIF/WebP и pilot manifests, но общего provenance нет; 47 групп точных дублей. Нельзя массово перемещать файлы до usage map и redirect/reference plan.
