# Массовая загрузка фото портфолио (папки + manifest.json)

## Правило группировки

Один объект кухни = одна папка = один проект в БД. Все ракурсы и детали лежат в одной папке и перечислены в `manifest.json` в массиве `images`.

## Пересборка WebP по классификации (формат и размер)

Из корня репозитория: заново записать `prepared-images/portfolio/` и `needs-review/` из исходников в `photo-classification.csv` (макс. ширина **1920 px**, WebP **quality 82**), затем пересобрать папки проектов:

```bash
python scripts/rebuild_prepared_webp_from_classification.py
python scripts/generate_portfolio_manifests_from_mapping.py
```

Отчёт: `prepared-images/reports/webp-rebuild-report.json`.

## Автогенерация из CSV (все группы из отчёта)

Если актуальный полный маппинг лежит в `prepared-images/reports/portfolio-draft-mapping.csv`, можно пересобрать папки и `manifest.json` одной командой из корня репозитория:

```bash
python scripts/generate_portfolio_manifests_from_mapping.py
```

Скрипт читает `photo-classification.csv` для полей `alt`, копирует файлы в `prepared-images/portfolio-projects/<slug>/` и перезаписывает каталоги проектов (кроме `_template`).

## Структура

```
prepared-images/portfolio-projects/
  _template/
    manifest.json          ← образец полей и нейтральных значений
  project-001/             ← ваш проект (имя папки любое, кроме _*)
    manifest.json
    01-obshiy-view.webp
    02-rakurs-sleva.webp
    ...
```

## Обязательные поля manifest

- `externalId` — уникальный стабильный id (например `portfolio-project-001`).
- `slug` — уникальный URL-сегмент (`/portfolio/[slug]`).
- `title` — заголовок проекта.
- `layoutType` — ключ планировки: `uglovaya-kuhnya`, `pryamaya-kuhnya`, `kuhnya-s-ostrovom`, `malenkaya-kuhnya`, `p-obraznaya-kuhnya`, `kuhnya-do-potolka`, `kuhnya-bez-ruchek` или другая строка (будет показана как есть).
- `style` — ключ стиля (как в CSV-импорте): `sovremennaya`, `minimalizm`, …
- `images[]` — список файлов в **этой же папке**: для каждого `file`, `alt`, `caption`.

Поле `mainImageIndex` (по умолчанию `0`) задаёт, какое фото главное в галерее.

## Если данных не хвещает

Используйте нейтральные значения из `_template/manifest.json`:

- неизвестный город → `city`: `""`, не заполняйте `relatedLocationSlugs` из города;
- цена неизвестна → `priceFrom`/`priceTo`: `0`, `priceNote` как в шаблоне;
- материалы неизвестны → `material`: `""`, `materials`: `[]`;
- размер / район / срок → `size`, `district`, `workDuration`: `""`.

Не указывайте город и региональные привязки, если это не подтверждено.

## Запрет дубликатов фото

Один и тот же файл (совпадение содержимого) не может быть привязан к двум разным проектам. Скрипт проверяет это при импорте.

## Импорт локально

Из каталога приложения `artifacts/kuhni-na-zakaz`:

```bash
pnpm run photos:import-portfolio-folders
```

Скрипт:

1. копирует изображения в `public/uploads/kitchens/portfolio/` с уникальными именами;
2. создаёт или обновляет записи `PortfolioCase`, включая `imageAlts` и `imageCaptions`;
3. пишет отчёт `project-docs/stage-4-2-photo-import/portfolio-folders-import-report.json`.

## Деплой

После коммита и пуша в ветку `work` на сервере выполняется `deploy/scripts/update-production.sh`, который вызывает этот импорт после `photos:import-prepared`.
