# Prompt Style Guide

Каждый AI/technical asset в manifest содержит восемь частей: main prompt, negative prompt, consistency, camera, lighting, materials, mobile composition и variation instructions.

## Общий стиль

Современная европейская кухня; реалистичные пропорции; светлый интерьер; тёплый белый, натуральный дуб, светлый камень и серо-бежевые фасады; умеренные зелёные, графитовые или синие акценты; мягкий дневной свет; без текста и логотипов.

## Camera и mobile

- 35–50 мм, уровень глаз, прямые вертикали, без чрезмерного wide-angle;
- главный объект читается на 360, 390 и 412 px;
- hero имеет свободную зону для UI, но угол кухни остаётся главным;
- technical asset показывает весь ход механизма, а не декоративный macro без контекста.

## Варианты

- hero: минимум 4 варианта;
- прочий критичный asset: 3–6 вариантов;
- cutaway: минимум 2 композиции;
- sequence сначала: closed / half / full, затем промежуточные кадры.

Для sequence обязательна инструкция: `Do not change camera position, focal length, cabinet layout, materials, lighting, appliance placement or object count between frames.`

Промпты не привязаны к названию внешнего сервиса. Фактическая генерация kitchen images выполняется только встроенным Codex/OpenAI `imagegen` по правилам проекта.
