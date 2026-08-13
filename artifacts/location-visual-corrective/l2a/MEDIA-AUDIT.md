# L2A: media audit

Дата: 2026-08-13

## До внедрения

- Смолевичи не имеют собственной визуальной серии.
- Дзержинск, Заславль и Логойск имеют по три legacy 3D-изображения, но они не образуют принятый corrective-контракт из четырёх continuity/process states.
- Все четыре route не имеют активной записи в `locationVisualSeries` и продолжают использовать общий fallback региональной страницы.

## Решение

- `REPLACE`: общий fallback на каждом из четырёх route новой route-specific серией.
- `KEEP`: legacy 3D-файлы, server shell, metadata, schema, lead pipeline и индексируемый контент после explorer.
- `ADAPT`: active registry, unit и Playwright scope расширить только на L2A.
- `REMOVE`: ничего.

## Необходимое производство

- 16 distinct masters: 4 города × 4 состояния.
- Для каждого master: исходный PNG, WebP и AVIF 1200×800, а также mobile WebP 480×320.
- Runtime использует AVIF/WebP; PNG сохраняется как исходник.
- Один eager visual на route, остальные lazy после выбора.
- Видимый disclosure: `AI-концепция, не фото выполненной работы.`

Статус до визуальной проверки: `MEDIA_PRODUCTION_REQUIRED`.
