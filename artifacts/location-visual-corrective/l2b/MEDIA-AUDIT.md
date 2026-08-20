# L2B: media audit

Дата: 2026-08-14

## До внедрения

- Вилейка, Несвиж и Мядель имеют по три legacy 3D/AI-изображения, но не имеют принятой серии из четырёх continuity/process states.
- Воложин имеет шесть legacy-файлов, однако они образуют две версии трёх одинаковых сюжетов и не покрывают инженерную подготовку и монтаж.
- Все четыре route не имеют активной записи в `locationVisualSeries` и продолжают использовать общий fallback региональной страницы.

## Решение

- `REPLACE`: общий runtime fallback новой route-specific серией на каждом из четырёх route.
- `KEEP`: legacy-файлы, server shell, metadata, schema, lead pipeline и индексируемый контент после explorer.
- `ADAPT`: registry, unit и Playwright scope только для L2B.
- `REMOVE`: ничего.

## Необходимое производство

- 16 distinct masters: 4 города × 4 состояния.
- Для каждого master: исходный PNG, WebP и AVIF 1200×800, mobile WebP 480×320.
- Runtime использует AVIF/WebP; PNG остаётся исходником.
- Один eager visual на route, остальные lazy после выбора.
- Видимый disclosure: `AI-концепция, не фото выполненной работы.`

Статус до визуальной проверки: `MEDIA_PRODUCTION_REQUIRED`.
