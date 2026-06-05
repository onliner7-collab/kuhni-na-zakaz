# Отчёт по подготовке фотографий кухонь

Этап 4.1 выполнен локально: сайт, база данных, каталог, sitemap, production-страницы и Excel-импорт не изменялись.

## Итоги
- Найдено фото: 89
- Принято без обязательной проверки: 32
- Отклонено: 1
- Дубли / почти дубли: 1
- Групп проектов: 36
- Требует ручной проверки: 56

## Выбор для каталога
- /catalog/uglovye-kuhni: uglovaya-kuhnya-neoklassika-belaya-002-main.webp; confidence=high; needs_review=false
- /catalog/pryamye-kuhni: pryamaya-kuhnya-minimalizm-kombinacii-016-main.webp; confidence=high; needs_review=true
- /catalog/p-obraznye-kuhni: не выбрано; confidence=low; needs_review=true
- /catalog/kuhni-s-ostrovom: kuhnya-s-ostrovom-sovremennaya-kombinacii-009-main.webp; confidence=high; needs_review=true
- /catalog/malenkie-kuhni: malenkaya-kuhnya-sovremennaya-seraya-030-main.webp; confidence=medium; needs_review=true
- /catalog/kuhni-do-potolka: uglovaya-kuhnya-minimalizm-seraya-017-main.webp; confidence=high; needs_review=true
- /catalog/kuhni-bez-ruchek: kuhnya-s-ostrovom-sovremennaya-kombinacii-009-main.webp; confidence=high; needs_review=false

## Что нельзя определить по фото достоверно
- Материал фасадов: МДФ, ЛДСП, эмаль, акрил, пластик/HPL, шпон или массив без подтверждения владельца не назначались.
- Город, адрес, цена, срок изготовления, дата выполнения и отзывы не определялись по изображениям.
- Для фото в защитной плёнке или на этапе монтажа финальный цвет/стиль нужно подтвердить вручную.
- Часть островных/барных зон помечена `needs_review=true`, если по ракурсу нельзя строго отличить остров от полуострова.

## Что подтвердить вручную
- Проверить все строки с `needs_review=true` в `photo-classification.csv` и `project-groups.csv`.
- Подтвердить материалы для страниц `/materials/*`; сейчас mapping по материалам оставлен без фото.
- Подтвердить, какие монтажные фото использовать в портфолио, а какие оставить только как внутренний архив.
- Проверить средние по разрешению фото `photo_2026-*` и кадры со штампом камеры перед публикацией.
