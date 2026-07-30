# Информационная архитектура сайта v2

Статус: `STAGE_2_ACCEPTED`
Дата: 2026-07-30
Scope: documentation/data-design; runtime не изменён.

## Инвентарь

- Canonical indexable: **112/112**.
- Utility/noindex/redirect: **6/6**, отделены от intent ownership.
- Семейства и экранные архетипы: **19/19**.
- Protected: **5/5**.
- Accepted visual-rescue: **23/23**.

## Логическая архитектура

```text
/ → catalog | styles | materials | scenarios | locations | portfolio | blog
  → design-proekt-kuhni | prices | calculator
  → about | reviews | delivery-installation | warranty | contacts
```

## Core flows

### 1. По форме

- Trigger: Поисковый или внутренний контекстный вход.
- Happy path: поисковый вход → catalog detail → visual формы → сравнение → сценарий/материал → calculator
- Decision points: Первичный выбор → сравнение/углубление → evidence → решение.
- Alternative: Возврат в parent hub или ближайший detail.
- Evidence blocked: Не показывать proof; объяснить границу и вести в общий /portfolio.
- Media error: Сохранить вопрос, пояснение и обычные server links.
- Conversion: /calculator или существующая lead-форма
- Analytics: exploration_entry, exploration_select, exploration_compare, exploration_transition_click, lead_open_with_context.

### 2. По стилю

- Trigger: Поисковый или внутренний контекстный вход.
- Happy path: style detail → выраженность → материал → форма → proof/fallback → calculator
- Decision points: Первичный выбор → сравнение/углубление → evidence → решение.
- Alternative: Возврат в parent hub или ближайший detail.
- Evidence blocked: Не показывать proof; объяснить границу и вести в общий /portfolio.
- Media error: Сохранить вопрос, пояснение и обычные server links.
- Conversion: /calculator или существующая lead-форма
- Analytics: exploration_entry, exploration_select, exploration_compare, exploration_transition_click, lead_open_with_context.

### 3. По материалу

- Trigger: Поисковый или внутренний контекстный вход.
- Happy path: material detail → поверхность → вопросы к образцу → стиль/hardware → calculator
- Decision points: Первичный выбор → сравнение/углубление → evidence → решение.
- Alternative: Возврат в parent hub или ближайший detail.
- Evidence blocked: Не показывать proof; объяснить границу и вести в общий /portfolio.
- Media error: Сохранить вопрос, пояснение и обычные server links.
- Conversion: /calculator или существующая lead-форма
- Analytics: exploration_entry, exploration_select, exploration_compare, exploration_transition_click, lead_open_with_context.

### 4. По сценарию

- Trigger: Поисковый или внутренний контекстный вход.
- Happy path: scenario detail → приоритет → компромисс → layout → material/hardware → calculator
- Decision points: Первичный выбор → сравнение/углубление → evidence → решение.
- Alternative: Возврат в parent hub или ближайший detail.
- Evidence blocked: Не показывать proof; объяснить границу и вести в общий /portfolio.
- Media error: Сохранить вопрос, пояснение и обычные server links.
- Conversion: /calculator или существующая lead-форма
- Analytics: exploration_entry, exploration_select, exploration_compare, exploration_transition_click, lead_open_with_context.

### 5. По городу

- Trigger: Поисковый или внутренний контекстный вход.
- Happy path: location detail → подтверждённый процесс → proof/fallback → design project → заявка с городом
- Decision points: Первичный выбор → сравнение/углубление → evidence → решение.
- Alternative: Возврат в parent hub или ближайший detail.
- Evidence blocked: Не показывать proof; объяснить границу и вести в общий /portfolio.
- Media error: Сохранить вопрос, пояснение и обычные server links.
- Conversion: /calculator или существующая lead-форма
- Analytics: exploration_entry, exploration_select, exploration_compare, exploration_transition_click, lead_open_with_context.

### 6. Через проект

- Trigger: Поисковый или внутренний контекстный вход.
- Happy path: portfolio detail → доказанные решения → style/layout/material → calculator
- Decision points: Первичный выбор → сравнение/углубление → evidence → решение.
- Alternative: Возврат в parent hub или ближайший detail.
- Evidence blocked: Не показывать proof; объяснить границу и вести в общий /portfolio.
- Media error: Сохранить вопрос, пояснение и обычные server links.
- Conversion: /calculator или существующая lead-форма
- Analytics: exploration_entry, exploration_select, exploration_compare, exploration_transition_click, lead_open_with_context.

### 7. Через статью

- Trigger: Поисковый или внутренний контекстный вход.
- Happy path: blog article → ответ → профильный hub/detail → visual проверка → calculator
- Decision points: Первичный выбор → сравнение/углубление → evidence → решение.
- Alternative: Возврат в parent hub или ближайший detail.
- Evidence blocked: Не показывать proof; объяснить границу и вести в общий /portfolio.
- Media error: Сохранить вопрос, пояснение и обычные server links.
- Conversion: /calculator или существующая lead-форма
- Analytics: exploration_entry, exploration_select, exploration_compare, exploration_transition_click, lead_open_with_context.

## Экранные архетипы

| Семейство | URL | Назначение | Первый meaningful action | Evidence boundary |
| --- | ---: | --- | --- | --- |
| blog article | 24 | один информационный вопрос | Получить ответ и открыть профильный hub или detail. | Не выдавать ai_concept или illustration за выполненный проект. |
| blog listing | 1 | информационный hub | Выбрать один информационный вопрос. | Не выдавать ai_concept или illustration за выполненный проект. |
| calculator/tool | 1 | ввод исходных параметров | Передать допустимые исходные параметры для расчёта. | Не выдавать ai_concept или illustration за выполненный проект. |
| catalog detail | 7 | конкретная планировка и её ограничения | Проверить форму и сравнить ближайшую альтернативу. | Не выдавать ai_concept или illustration за выполненный проект. |
| catalog listing | 1 | выбор формы и типа кухни | Выбрать планировку для дальнейшей проверки. | Не выдавать ai_concept или illustration за выполненный проект. |
| hardware | 1 | механизмы и сценарии использования фурнитуры | Выбрать механизм и сформировать вопросы к проекту. | Точные свойства и совместимость требуют образца или технического evidence. |
| home | 1 | широкий вход и выбор направления | Выбрать слой решения: форма, стиль, материал, сценарий, работы или расчёт. | Не выдавать ai_concept или illustration за выполненный проект. |
| hub | 2 | выбор тематического направления | Выбрать один тематический detail-маршрут. | Не выдавать ai_concept или illustration за выполненный проект. |
| location detail | 31 | подтверждённый путь заказа в городе | Проверить процесс и передать город в проект или заявку. | Local proof только при подтверждении exact-city; иначе честный fallback к /portfolio. |
| location hub | 1 | выбор региона или города | Выбрать город и открыть подтверждённый путь заказа. | Local proof только при подтверждении exact-city; иначе честный fallback к /portfolio. |
| material detail | 6 | поверхность, конструкция и вопросы проверки материала | Определить, что проверить на образце и куда перейти дальше. | Точные свойства и совместимость требуют образца или технического evidence. |
| material listing | 1 | выбор группы материалов | Выбрать группу поверхности или конструкции для проверки. | Точные свойства и совместимость требуют образца или технического evidence. |
| portfolio detail | 13 | история одного подтверждённого объекта | Проверить решения объекта и перейти к похожему слою выбора. | Только verified project evidence из принятого источника. |
| portfolio listing | 1 | проверка evidence-approved проектов | Выбрать подтверждённый объект для подробной проверки. | Только verified project evidence из принятого источника. |
| scenario | 6 | конкретный жизненный компромисс | Выбрать приоритет и допустимый компромисс. | Не выдавать ai_concept или illustration за выполненный проект. |
| service | 5 | условия, процесс или коммерческий ориентир страницы | Проверить условие и перейти к проекту, расчёту или заявке. | Не выдавать ai_concept или illustration за выполненный проект. |
| style | 8 | выраженность конкретного стиля | Выбрать выраженность стиля и следующий материал или форму. | Не выдавать ai_concept или illustration за выполненный проект. |
| trust | 2 | доверие и проверяемые сведения | Проверить ответственность и перейти к условиям или заявке. | Не выдавать ai_concept или illustration за выполненный проект. |
| utility | 6 | служебная, юридическая или redirect-функция без SEO intent ownership | Вернуться к основному сайту или завершить служебное действие. | Не выдавать ai_concept или illustration за выполненный проект. |

Полные поля, route-specific deviations и mobile/desktop contracts находятся в `site-architecture-v2.json`.

## Protected five

- `/`: KEEP; intent «выбрать путь к кухне на заказ»; отдельная wave 1; protection с runtime не снята.
- `/design-proekt-kuhni`: KEEP; intent «подготовить дизайн-проект»; отдельная wave 2; protection с runtime не снята.
- `/materials/furnitura`: KEEP; intent «выбрать механизмы кухни»; отдельная wave 4; protection с runtime не снята.
- `/locations/minsk`: KEEP; intent «проверить заказ кухни в Минске»; отдельная wave 2; protection с runtime не снята.
- `/locations/minskaya-oblast`: KEEP; intent «проверить заказ по Минской области»; отдельная wave 2; protection с runtime не снята.

## Accepted visual-rescue

Все 23 маршрута сохраняют статус `accepted`, seriesId и запрет на повторную генерацию без доказанной необходимости.

## Граница фактов и гипотез

Фактами считаются route inventory, HTTP/indexability baseline, parent/depth, protection и принятые visual series. Intent ownership — `ownership_hypothesis` до GSC/SERP; каннибализация не объявлена доказанной.
