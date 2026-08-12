# UX specification: L1A location visual corrective

Дата: 2026-08-11
Scope: Витебск, Гродно, Брест, Могилёв.

## Пользовательский путь

```text
H1 и короткое обещание → route-specific кухня → четыре кнопки-состояния
→ три заметных изменения currentSrc → короткое следствие выбора
→ два релевантных server link → существующие подробности и форма
```

## Контракт экрана

- `RegionalLocationPage` остаётся server shell и включает explorer только по точному route из active registry.
- `LocationVisualExplorer` остаётся единственным маленьким client island; loading/error state сохраняет controls и ссылки.
- Начальный кадр существует в server HTML и является единственным eager visual.
- На 360–412 px изображение 3:2 предшествует controls; controls образуют сетку 2×2, touch target не меньше 44 px.
- На 768/1440 px порядок решения не меняется; изображения не вызывают layout shift.
- Tabs работают мышью, касанием, Enter/Space, стрелками, Home/End; выбранное состояние имеет `aria-selected=true`.
- ExploreContext сохраняет только `location`, `sourceRoute` и meaningful action без PII.
- Без JavaScript остаются вопрос, initial visual, disclosure и crawlable next links.

## Route-specific flows

| Route | Состояния | Результат |
| --- | --- | --- |
| `/locations/vitebsk` | городская квартира → до потолка → рабочий свет → монтаж | Пользователь видит сезонное хранение и подготовку установки. |
| `/locations/grodno` | светлая → древесная → скрытая техника → замер | Пользователь сравнивает спокойную отделку и практичную комплектацию. |
| `/locations/brest` | квартира → дом → хранение → логистика монтажа | Пользователь сравнивает масштаб объекта и требования к установке. |
| `/locations/mogilev` | прямая → угловая → рабочая зона → подготовка проекта | Пользователь проверяет форму и сохранение полезной столешницы. |

## SEO и provenance

- Metadata, canonical, H1, schema и sitemap не меняются.
- Все тексты и alt — по-русски.
- Все изображения обозначаются как AI-концепции, а не выполненные проекты в городе.
- Длинный индексируемый контент остаётся после visual journey.

Примечание: навык `ux-specification` рекомендует `design/06-ux-spec.md`, но файл уже является незакоммиченным пользовательским документом. Спецификация L1A сохранена в отдельном evidence scope без перезаписи пользовательской работы.
