# Матрица уникальности пилотов

| Dimension              | Угловые кухни                                                     | Борисов                                                                                        | Фурнитура                                                              |
| ---------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Page                   | `/catalog/uglovye-kuhni`                                          | `/locations/borisov`                                                                           | `/materials/furnitura`                                                 |
| Primary goal           | понять планировку и доступ к углу                                 | понять местный путь заказа                                                                     | понять работу механизмов и уровень комплектации                        |
| Primary user question  | «Подойдёт ли две стены и как использовать угол?»                  | «Как заказ пройдёт от заявки до монтажа?»                                                      | «Как механизм работает и где экономить?»                               |
| Hero concept           | фокус на геометрии Г-образного угла; вход `Проверить планировку`  | вертикальный путь/этапы; вход `Посмотреть процесс`                                             | открытый технический шкаф; вход `Выбрать механизм`                     |
| Main interaction       | `CornerStorageExplorer`                                           | `ProductionJourney`                                                                            | `HardwareCabinetExplorer`                                              |
| Secondary interactions | swipe ракурсов, corner type, dimensions check, storage comparison | kitchen choice draft, measure checklist, verified projects vs AI concepts                      | drawer motion, cutaway, package comparison, picker                     |
| Visual family          | тёплый интерьер, дуб/камень, одинаковая кухня и угол              | emerald process cards, neutral object moving through stages, illustrations explicitly labelled | blue/graphite technical renders, macro/cutaway, neutral cabinet        |
| Narrative structure    | пространственная: снаружи → внутрь → сравнение → размеры → цена   | временная: заявка → расчёт → замер → проект → производство → доставка → монтаж                 | причинная: зона → движение → назначение → сравнение → комплект         |
| Dock                   | Планировка / Внутри / Цена / Рассчитать                           | Виды / Процесс / Стоимость / Замер                                                             | Механизмы / Сравнить / Комплектация / Подобрать                        |
| Primary CTA            | предварительный расчёт угловой кухни                              | замер или предварительный расчёт в Борисове                                                    | подобрать уровень фурнитуры                                            |
| SEO intent             | commercial category                                               | local commercial/service                                                                       | commercial investigation + technical education                         |
| Forbidden similarities | process timeline, cabinet hotspot hero, generic 7-card journey    | corner slider, cabinet technical cutaway, copy of category hero                                | full-room swipe showroom, local journey, copy of CornerStorageExplorer |

## Hero differentiation rules

- Не использовать один и тот же `full viewport image + bottom gradient + two pills` как финальную композицию для угловых и Борисова.
- `MobileHero` может переиспользовать доступность/spacing API, но slots, media behavior, content order и first action обязаны отличаться.
- Угловые: hero показывает конкретную пространственную проблему.
- Борисов: hero показывает последовательность и локальный факт, а не просто красивую кухню.
- Фурнитура: hero выглядит как технический стенд, а не интерьерный каталог.

## Interaction differentiation rules

- `CornerStorageExplorer` управляет геометрически согласованной media sequence одного угла.
- `ProductionJourney` меняет этапы во времени и всегда имеет ordered text fallback.
- `HardwareCabinetExplorer` выбирает зоны одного шкафа и объясняет назначение механизма.
- Общий `MechanismComparison` допускается только как primitive; content model, visuals и narrative на угловой/фурнитуре различаются.

## Failure test

Проектирование отклоняется, если после замены H1 и акцентного цвета:

- последовательность блоков остаётся одинаковой;
- hero сохраняет одинаковое действие;
- один interactive component можно перенести между страницами без изменения модели данных;
- media одной страницы можно выдать за media другой без потери смысла.

Текущий код частично проваливает hero test для Angular/Borisov: одинаковая full-screen композиция. Целевая спецификация это исправляет; код в этапе 2 не меняется.
