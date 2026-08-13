# L1B: media audit

Дата: 2026-08-12

## До внедрения

Молодечно, Жодино, Слуцк и Марьина Горка не имеют активной route-specific серии из четырёх состояний и продолжают использовать общий visual fallback региональной страницы.

## Решение

- `REPLACE`: общий fallback на каждом из четырёх route.
- `ADAPT`: active registry, unit и Playwright scope расширить только на L1B.
- `KEEP`: server shell, metadata, schema, lead pipeline и индексируемый контент после explorer.
- `REMOVE`: ничего; fallback остаётся для ещё не внедрённых волн.

## Необходимое производство

- 16 distinct masters: 4 города × 4 состояния.
- Для каждого master: исходный PNG, WebP и AVIF 1200×800, а также mobile WebP 480×320.
- Runtime использует AVIF/WebP; PNG сохраняется как исходник.
- Один eager visual на route, остальные lazy после выбора.
- Видимый disclosure: `AI-концепция, не фото выполненной работы.`

Статус до визуальной проверки: `MEDIA_PRODUCTION_REQUIRED`.
