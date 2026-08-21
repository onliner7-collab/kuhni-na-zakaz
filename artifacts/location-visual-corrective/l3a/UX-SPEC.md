# UX specification: L3A location visual corrective

Дата: 2026-08-14  
Scope: Березино, Столбцы, Узда.

## Пользовательский путь

```text
H1 и короткое обещание → route-specific visual → четыре кнопки-состояния
→ три изменения currentSrc → короткое следствие выбора
→ сохранение meaningful choice → два crawlable next link
```

## Контракт экрана

- `RegionalLocationPage` остаётся server shell; client island активируется только для трёх L3A route.
- Начальный visual и важные next links присутствуют в server HTML, последующие кадры загружаются после выбора.
- На 360–412 px visual 3:2 расположен до controls; сетка 2×2 имеет touch target не меньше 44 px.
- Tabs работают с Tab, Enter/Space, стрелками, Home/End и видимым focus; выбранное состояние имеет `aria-selected=true`.
- Выбор меняет `currentSrc`, заголовок и consequence без скачка scroll и CLS выше 0.02.
- ExploreContext хранит только город и сценарий без PII.
- Metadata, canonical, H1, schema, sitemap и длинный индексируемый контент не меняются.
- Все controls, alt и disclosure — на русском; изображения честно обозначены как AI-концепции.

## Route-specific flows

| Route | Состояния | Результат |
| --- | --- | --- |
| `/locations/berezino` | исходные данные → планировка → техника → маршрут замера | Подготовить проект дистанционно и оставить выезду проверку точной геометрии. |
| `/locations/stolbtsy` | фото и размеры → планировка → техника → точный замер | Разделить дистанционные решения и обязательные проверки на объекте. |
| `/locations/uzda` | маленькая прямая → угловая → хранение → замер | Сравнить формы и сохранить проходы при увеличении хранения. |
