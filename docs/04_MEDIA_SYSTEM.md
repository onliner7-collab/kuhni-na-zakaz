# Медиа-система

## Структура

```text
public/media/pilots/<pilot>/masters/     # исходные PNG, не подключаются как основной src
public/media/pilots/<pilot>/avif/        # основной delivery
public/media/pilots/<pilot>/webp/        # fallback
public/media/pilots/<pilot>/video/       # MP4 H.264 до 5 секунд без звука
content/media/pilots/<pilot>.json        # источник истины по ассетам
```

Пилоты: `angular-kitchens`, `borisov`, `hardware`.

## Имена и manifest

Имя: `<pilot>-<section>-<subject>-<view-or-frame>-<orientation>.<ext>`, только латиница, kebab-case. `assetId` стабилен и не зависит от расширения. У каждого ассета обязательны pageUrl, sectionId, purpose, assetType, provenance, orientation, aspectRatio, mobile/desktop dimensions, master/delivery formats, filename, русский alt, русская caption, готовый prompt, sequenceName/index и loadingPriority.

Manifest поддерживает наследование: поля `defaults` и `groups[].defaults` применяются к каждому объекту `assets`; уникальные поля ассета переопределяют их. Это позволяет не копировать одинаковый safety prompt, но после разрешения наследования каждый ассет имеет полный набор обязательных полей.

## Генерация и происхождение

- Все новые изображения кухни создаются только встроенным Codex/OpenAI `imagegen` по системному skill.
- Нельзя брать существующее изображение вместо нового ассета пилота.
- `AI-generated` обозначается в manifest и в видимой подписи как «AI-концепт» или «Иллюстрация процесса».
- Реальный проект имеет `real` только при подтверждённом происхождении и согласии на публикацию.
- Серия использует один continuity anchor: геометрия, фасады, техника, свет и камера не меняются между кадрами.
- Техническая иллюстрация не содержит неподтверждённых размеров, нагрузок, брендов и характеристик.

## Форматы и размеры

- мастер: качественный PNG в каталоге `masters`;
- сайт: AVIF основной, WebP fallback; PNG остаётся источником;
- hero desktop обычно 1600×900, mobile 900×1200; контент 1200×800 или 1200×900;
- видео: MP4 H.264, без звука, до 5 секунд, отдельный `poster.webp`;
- WebP стремится к 150–250 КБ для контентного изображения; hero может быть больше только по визуальной необходимости.

## Загрузка

- только один настоящий LCP hero имеет `priority/eager`;
- остальные изображения `lazy`, последовательность сначала загружает poster и ближайшие кадры;
- desktop/mobile варианты выбираются через `<picture>` или Next Image `sizes`;
- до коммита проверить существование WebP/AVIF, `naturalWidth > 0`, watermark route 200 там, где он применяется, и отсутствие тяжёлой прокрутки.

## Alt и caption

Alt описывает полезное содержание по-русски без SEO-спама. Caption объясняет, что пользователь должен заметить, и честно обозначает AI/иллюстрацию. Декоративным изображениям — пустой alt.
