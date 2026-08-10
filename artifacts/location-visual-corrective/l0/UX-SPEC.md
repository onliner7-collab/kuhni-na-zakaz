# UX specification: L0 location visual corrective

## Цель

На `/locations`, `/locations/soligorsk`, `/locations/fanipol` и `/locations/gomel` пользователь сначала видит кухню, затем выбирает сценарий и получает три заметных изменения изображения без прыжка прокрутки. Длинный SEO-контент остаётся ниже visual journey.

## Поток detail page

```text
Хлебные крошки → H1 → короткое обещание → активное изображение
→ четыре доступные кнопки-состояния → короткое следствие выбора
→ 2–4 релевантных продолжения → существующие подробности и форма
```

## Компоненты

| Компонент | Граница | Поведение |
|---|---|---|
| `RegionalLocationPage` | server | Выбирает active series только по точному route; защищённые route не получают generic config. |
| `LocationVisualExplorer` | client island | Управляет выбранным state, клавиатурой, `aria-selected`, live-result и ExploreContext. |
| `LocationVisualStage` | внутри island | Показывает ровно одно активное WebP/AVIF, сохраняет aspect ratio и русский alt. |
| `LocationHubExplorer` | client island | На `/locations` переключает три направления и ведёт к соответствующему пилоту. |

## Состояния

- Initial: первый state существует в server HTML, LCP-кандидат eager/high.
- Selected: меняются `currentSrc`, заголовок и consequence; активная кнопка имеет `aria-selected=true`.
- Image error: сохраняются вопрос, controls и crawlable next links; выводится русское сообщение.
- Reduced motion: fade-переход отключён.
- No JavaScript: начальное изображение, вопрос, описание и обычные ссылки остаются в HTML.

## Responsive contract

- 360–412 px: H1 до трёх строк, lead до 180 знаков, media 3:2, controls сеткой 2×2, target не меньше 44 px.
- 768 px: controls 4 колонки, media сохраняет 3:2.
- 1440 px: stage и result образуют спокойную двухколоночную композицию без изменения порядка решения.

## SEO и доступность

- Один H1, self-canonical и существующий Service/Breadcrumb schema сохраняются.
- Tabs доступны Tab, стрелками, Home/End, Enter/Space; focus ring видим.
- Все alt, подписи, controls и disclosure — на русском.
- AI-концепции явно не называются выполненными проектами.

Примечание: навык `ux-specification` рекомендует `design/06-ux-spec.md`, но этот файл уже является незакоммиченным пользовательским документом. Чтобы не перезаписывать его, L0-спецификация сохранена в изолированном evidence scope.
