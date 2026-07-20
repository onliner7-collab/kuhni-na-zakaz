# Контракт контента, данных, медиа и SEO

## 1. Модель публикации

Публичная страница состоит из четырёх слоёв:

1. **Смысл:** вопрос пользователя, ответ, ограничения и следующий шаг.
2. **Данные:** сущности, связи, поля доказательности и дата актуальности.
3. **Медиа:** изображение/серия/схема с provenance и delivery-форматом.
4. **Техническая выдача:** server HTML, metadata, canonical, schema и sitemap policy.

Ни один слой не может подменять другой. Например, путь файла не подтверждает реальность проекта, а интерактивное изображение не заменяет текстовый ответ.

## 2. Сущности текущего Prisma и целевой контракт

### Kitchen / идея или каталог

Текущие поля: `title`, `slug`, `description`, `category`, `style`, `material`, `priceFrom`, `priceTo`, `features`, `images`, `mainImage`, `seoTitle`, `seoDescription`, `published`.

Обязательное расширение контракта перед массовым масштабированием:

```text
contentRole: idea | catalog | visualization
provenanceStatus: verified_real | ai_concept | technical_illustration | unknown | rejected
primaryIntent: string
userQuestion: string
primaryInteraction: string
relatedStyleSlugs: string[]
relatedScenarioSlugs: string[]
relatedMaterialSlugs: string[]
relatedHardwareSlugs: string[]
evidenceRefs: string[]
```

`priceFrom` не публикуется без актуального источника и понятной подписи, что именно входит в ориентир.

### PortfolioCase / реальный проект

Текущих полей много: город, планировка, стиль, материалы, размеры, стоимость, сроки, задача, ограничения, решение, результат, фото, alt/caption и SEO-поля.

Обязательный gate до публикации в `/portfolio`:

```text
provenanceStatus = verified
evidenceRefs не пустой
rightsStatus = approved
projectSource проверен владельцем
mainImage и gallery проверены
город и характеристики подтверждены
```

Если gate не пройден, запись показывается только как идея/пример с нейтральной подписью или остаётся unpublished. `published=true` не является provenance-доказательством.

### StylePage / MaterialPage / ScenarioPage

Общие обязательные поля:

```text
slug
title
headline
intro
content
seoTitle
seoDescription
published
primaryIntent
userQuestion
uniquePromise
primaryInteraction
relatedEntities
evidenceRefs
contentOwner
updatedReason
```

Массивы `pros`, `cons`, `careGuide`, `suitableFor` должны иметь фактологический источник или быть явно помечены как редакционная рекомендация.

### LocationPage

Публикация отдельной локации требует проверки:

- реальной зоны работы;
- условий замера, доставки и монтажа;
- разрешённого текста о стоимости и сроках;
- локальных изображений и проектов при наличии;
- отсутствия выдуманного офиса или филиала;
- уникальных локальных фактов.

`address`, `mapEmbed`, `phone`, `priceFrom`, `deliveryCost`, `deliveryDays` не выводятся автоматически только потому, что поле заполнено.

### Конфигуратор и визуальный проект

Текущие модели `ConfigStep`, `ConfigOption`, `ConfigResult`, `KitchenModule`, `KitchenTemplate`, `KitchenFacade`, `KitchenCountertop`, `KitchenSkinal`, `KitchenHandle`, `KitchenMechanism`, `KitchenAppliance`, `CompatibilityRule`, `VisualProject` используются как основа интерактивного выбора.

Контракт:

- результат всегда называется предварительным ориентиром, а не проектом или финальной сметой;
- compatibility rule объясняет конфликт понятным русским текстом;
- сервер сохраняет выбранный контекст без персональных данных до явной отправки формы;
- в заявку передаются выбранные сущности и route context;
- недоступная комбинация не ломает сценарий, а показывает причину и альтернативу.

## 3. Provenance и доказательства (data/provenance gate)

| Статус | Пользовательская роль | Разрешённое использование |
| --- | --- | --- |
| `verified_real` | Подтверждённый реальный проект | `/portfolio`, project schema при наличии данных |
| `ai_concept` | AI concept / идея кухни | `/catalog`, style/scenario/material pages с явной маркировкой |
| `technical_illustration` | Техническая или process-иллюстрация | схема устройства/этапа; не доказательство объекта |
| `unknown` | Источник неизвестен | только нейтральная идея/пример после редакционного решения; не portfolio/local proof |
| `rejected` | Отклонено | не публиковать; архивировать причину и дату |

`process_illustration` — не отдельный доказательный статус: это подтип `technical_illustration` с `viewRole=process_step`. Старые значения `verified`, `ai`, `technical` принимаются только как legacy-алиасы при импорте и должны быть нормализованы в пять канонических статусов до публикации.

Публикация реального проекта требует минимум двух независимых evidence references: источник проекта/подтверждение владельца и подтверждённая media set. Город, путь файла, имя файла, DB record, `published=true`, realism или статус delivery-файла не считаются доказательствами. Для local proof дополнительно нужен exact-city источник; для `before_after` — доказанная пара до/после одного объекта.

### Evidence owner и допуск полей

| Данные/роль | Evidence owner | Минимальный допуск | Если evidence отсутствует |
| --- | --- | --- | --- |
| Portfolio, город, размеры, фото, результат | владелец проекта + редактор provenance | signed/traceable project source, exact-city/characteristics confirmation и media set с правами | `unknown`/`ai_concept` или unpublished; не `/portfolio` |
| Location: зона работы, доставка, монтаж, замер | операционный владелец/руководитель продаж + редактор | действующее внутреннее правило/документ с датой и областью действия | нейтральный process fallback; адрес/филиал/срок не выводить |
| Цены и priceFrom/priceTo | владелец прайс-листа/коммерческий руководитель | актуальный прайс, scope комплектации, валюта, дата и подпись «ориентир» | не показывать число; оставить «точная стоимость после размеров и комплектации» |
| Сроки и deliveryDays/workDuration | производство/логистика | подтверждённый SLA или заказная статистика с периодом и условиями | не обещать срок; показывать этапы без длительности |
| Гарантии | юридический/сервисный владелец | действующая редакция гарантийных условий и область действия | не публиковать срок/объём гарантии |
| Отзывы и ratings | владелец CRM/модератор отзывов | первичный источник, consent/traceability, `status=PUBLISHED`, связь с проектом при наличии | не публиковать отзыв/рейтинг и не добавлять schema |
| Бренды, модели и характеристики | закупки/технический владелец или официальный источник бренда | datasheet/официальная страница + дата проверки; только заявленные поля | использовать нейтральное «вариант фурнитуры/техники», без бренда и чисел |

`contentOwner` отвечает за редакционное содержание, но не заменяет `evidenceOwner`. У каждой записи должен быть `evidenceRefs[]`, owner, `lastReviewedAt` и список разрешённых claims. До появления этих полей в runtime-коде gate ведётся в реестре; это не означает автоматического допуска существующих DB/fallback records.

## 4. Медиа-доставка

Каждое медиа имеет:

```text
mediaId
sourcePath
optimizedWebp
optimizedAvif (если поддерживается pipeline)
width
height
altRu
captionRu
provenanceStatus
rightsStatus
intendedQuestion
loadPriority
relatedRoute
seriesId
viewRole
interactionRole
allowedRoutes[]
generationBriefId
```

Правила:

- visible src — WebP/AVIF, если delivery-файл существует;
- PNG/JPEG master не используется как основной тяжёлый src;
- hero/LCP имеет intrinsic dimensions и priority только при реальной необходимости;
- галерея и sequences монтируются по intent;
- WebP для блоговых изображений стремится к 150–250 КБ при достаточном качестве;
- пропавшее медиа не убирает текст, CTA или переход;
- все alt/caption на русском и описывают содержание, а не ключевую фразу.
- фотографическая серия одной кухни сохраняет геометрию, материалы, технику, освещение и детали между ракурсами;
- каждый asset связан с вопросом пользователя и состоянием интеракции;
- полный production brief и slot model определены в `11-media-transition-production-map.md`.

## 5. Контентный пакет страницы

Перед статусом `MEDIA_READY` у страницы должны быть:

1. `userQuestion`;
2. `answerSummary` — короткий ответ для первого экрана;
3. `decisionModel` — что пользователь выбирает или сравнивает;
4. `constraints` — где решение не подходит;
5. `proof` — подтверждения и источники;
6. `mediaPlan`;
7. `relatedEntities`;
8. `nextBestActions`;
9. русские alt/caption;
10. текстовый fallback;
11. редактор и дата проверки;
12. честная маркировка идеи/реального объекта.

## 6. SEO metadata contract

Для каждой indexable page:

```text
title: уникальный, описывает конкретную пользу и интент
description: уникальная, отвечает на вопрос и не обещает недоказанное
h1: один, совпадает со смыслом страницы, не обязан дословно повторять title
canonical: один абсолютный URL
robots: index/follow только после page gate
og:title / og:description / og:image: соответствуют visible page
breadcrumb: соответствует реальному пути
schema: только по видимому подтверждённому содержанию
sitemap: только canonical indexable URL с HTTP 200
```

Нельзя добавлять fake reviews, ratings, offers, guarantees, addresses, availability или FAQ schema без видимого и подтверждённого содержимого.

## 7. Facets, filters и комбинации

UI может фильтровать по стилю, планировке, материалу, сценарию и бюджету, но большинство комбинаций не получают самостоятельный indexable URL.

Default для фильтров:

- не добавлять в sitemap;
- не создавать отдельные titles/H1;
- сохранять canonical родительской страницы;
- не ссылаться на них как на самостоятельные SEO-страницы;
- измерять как UX-состояния и аналитические события.

Выделенный URL допускается только после ручного page gate из `06-ux-spec.md`.

## 8. Internal linking contract

Каждая публичная страница имеет 2–4 контекстных продолжения:

1. углубление текущего вопроса;
2. сравнение альтернативы;
3. подтверждённый проект или честная идея;
4. расчёт или заявка.

Анкор описывает результат: «Изучить угловое хранение», «Сравнить МДФ и HPL», «Посмотреть реальные кухни с островом». Ссылки работают без JavaScript и присутствуют в server HTML.

Для динамического продолжения используется `Transition Registry`: source route/state, вопрос, тип действия, русский анкор, target route, context patch, причина, fallback и analytics event. Модель link graph — гибрид hub-and-spoke + silo; orphan pages target = 0, важные страницы должны находиться не глубже трёх смысловых переходов от hub.

## 9. Редакционный цикл

Каждая фактологическая страница имеет:

- owner;
- evidence refs;
- `lastReviewedAt`;
- `reviewReason`;
- список полей, которые нельзя изменять без владельца бизнеса;
- историю изменения SEO-полей и visible facts.

Изменение даты без существенного обновления содержания запрещено.
