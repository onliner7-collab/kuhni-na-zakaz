# Матрица канонических маршрутов

Источник перечня: `artifacts/kuhni-na-zakaz/public/sitemap-static.xml`, 112 URL.
Статус URL означает текущий канонический маршрут, а не готовность нового UX-архетипа.

## Поля, обязательные для каждой строки реестра

```text
route
family
archetype
primary_query_cluster
user_question
unique_promise
primary_interaction
proof_required
related_routes
index_policy
current_status
target_stage
owner
```

Ключевые слова и фактические объёмы должны быть подтверждены отдельным Search Console/SERP исследованием. До такого подтверждения поле `primary_query_cluster` обозначает рабочую гипотезу, а не утверждённую семантику.

## Сводка по семействам

| Семейство | Количество в sitemap | Целевой архетип | Основное действие |
| --- | ---: | --- | --- |
| Основные hubs и сервис | 15 | hub / price / service / legal | выбрать направление или понять следующий шаг |
| Планировки | 7 | layout | проверить применимость и хранение |
| Стили | 8 | style | выбрать визуальное направление |
| Материалы | 8 | material / hardware | сравнить поверхность или механизм |
| Сценарии | 6 | scenario | решить бытовую задачу |
| Портфолио | 13 | verified project | изучить доказанный объект |
| Статьи | 24 | guide | получить практический ответ |
| Локации | 31 | location | понять реальные условия работы |
| **Всего** | **112** |  |  |

## Основные hubs и сервис — 15 URL

| URL | Архетип | Вопрос | Главный интерактив | Доказательство |
| --- | --- | --- | --- | --- |
| `/` | hub | С чего начать выбор? | визуальные входы по задачам | честный split идей/работ |
| `/about` | trust | Кто отвечает за результат? | раскрытие фактов о компании | подтверждённые сведения |
| `/catalog` | hub | Что можно выбрать? | карточки планировок и сценариев | идеи с provenance |
| `/calculator` | price | Какой ориентир бюджета? | пошаговый расчёт | правила расчёта и ограничения |
| `/design-proekt-kuhni` | service | Как подготовить проект? | progressive brief | фактический процесс |
| `/prices` | price | Из чего складывается цена? | сравнение комплектаций | действующие price rules |
| `/contacts` | trust | Как связаться? | выбор канала связи | подтверждённые контакты |
| `/portfolio` | portfolio hub | Что реально сделано? | фильтр подтверждённых работ | provenance gate |
| `/reviews` | trust | Что говорят клиенты? | просмотр подтверждённых отзывов | source и moderation status |
| `/blog` | guide hub | Что изучить до заказа? | выбор вопроса | полезные статьи |
| `/delivery-installation` | service | Как проходит доставка и монтаж? | этапы процесса | подтверждённые условия |
| `/styles` | hub | Какой вид кухни мне близок? | mood cards | идеи и реальные примеры разделены |
| `/scenarios` | hub | Какая кухня подходит моей жизни? | карточки бытовых задач | сценарии без дублирования |
| `/locations` | location hub | Где работает компания? | выбор зоны обслуживания | реальные условия |
| `/warranty` | service | Какие условия гарантии? | раскрытие условий | только договорные факты |

## Планировки — 7 URL

| URL | Архетип | Уникальная модель |
| --- | --- | --- |
| `/catalog/uglovye-kuhni` | layout | угловое хранение, две стены, CornerStorageExplorer |
| `/catalog/pryamye-kuhni` | layout | одна линия, рабочий треугольник и ограничения длины |
| `/catalog/p-obraznye-kuhni` | layout | три рабочие стороны и безопасные проходы |
| `/catalog/kuhni-s-ostrovom` | layout | остров, проходы, функции и коммуникации |
| `/catalog/malenkie-kuhni` | scenario/layout | полезная рабочая зона при ограниченной площади |
| `/catalog/kuhni-do-potolka` | scenario/layout | вертикальное хранение и доступ к верхним секциям |
| `/catalog/kuhni-bez-ruchek` | layout/style | способы открывания и ограничения без ручек |

## Стили — 8 URL

Все страницы этого семейства должны отличаться не только цветом. Обязательны собственные visual mood, признаки стиля, сочетания материалов, ограничения и следующий сценарий.

| URL | Архетип | Основной визуальный вопрос |
| --- | --- | --- |
| `/styles/neoklassika` | style | Как получить классическую выразительность без перегруза? |
| `/styles/hay-tek` | style | Как устроен функциональный технологичный интерьер? |
| `/styles/provans` | style | Как использовать мягкие детали и не сделать интерьер декоративным? |
| `/styles/loft` | style | Как сочетать дерево, металл и тёмные поверхности? |
| `/styles/sovremennye` | style | Какие решения составляют современную кухню? |
| `/styles/skandinavskie` | style | Как сочетать свет, дерево и практичное хранение? |
| `/styles/klassicheskie` | style | Как собрать классическую кухню под современную технику? |
| `/styles/minimalizm` | style | Как уменьшить визуальный шум и сохранить удобство? |

## Материалы и фурнитура — 8 URL

| URL | Архетип | Основное действие |
| --- | --- | --- |
| `/materials/akril` | material | рассмотреть глянцевую поверхность и ограничения |
| `/materials/mdf-emal` | material | сравнить эмаль, уход и варианты фасада |
| `/materials/ldsp` | material | понять роль корпуса и бюджетный сценарий |
| `/materials/mdf-fasady` | material | сравнить фасадные решения МДФ |
| `/materials/plastik-hpl` | material | сравнить HPL для активной эксплуатации |
| `/materials/shpon` | material | рассмотреть древесную фактуру и уход |
| `/materials` | material hub | выбрать слой кухни |
| `/materials/furnitura` | hardware | открыть шкаф и выбрать зону механизма |

## Сценарии — 6 URL

| URL | Архетип | Сценарий |
| --- | --- | --- |
| `/scenarios/s-ostrovom` | scenario | кухня с островом и проверкой проходов |
| `/scenarios/do-potolka` | scenario | максимум вертикального хранения |
| `/scenarios/dlya-semi` | scenario | ежедневное использование семьёй |
| `/scenarios/dlya-studii` | scenario | кухня в студии и визуальное зонирование |
| `/scenarios/dlya-malenkoy-kuhni` | scenario | ограниченная площадь и приоритеты |
| `/scenarios/byudzhetnaya-kuhnya` | scenario | управление составом комплектации без обещания цены |

## Портфолио — 13 URL

| URL | Архетип | Gate |
| --- | --- | --- |
| `/portfolio/kuhnya-japandi-zelenye-fasady-minsk` | project | подтвердить реальность, город, фото и материалы |
| `/portfolio/loft-kuhnya-oreh-poluostrov-minsk` | project | подтвердить реальность, город, фото и материалы |
| `/portfolio/neoklassicheskaya-kuhnya-sinie-fasady-minsk` | project | подтвердить реальность, город, фото и материалы |
| `/portfolio/belaya-kuhnya-do-potolka-minsk` | project | подтвердить реальность, город, фото и материалы |
| `/portfolio/kuhnya-s-ostrovom-zelenyj-akcent-minsk` | project | подтвердить реальность, город, фото и материалы |
| `/portfolio/pryamaya-kuhnya-studiya-dubovaya-nisha-minsk` | project | подтвердить реальность, город, фото и материалы |
| `/portfolio/seraya-uglovaya-kuhnya-novostrojka-minsk` | project | подтвердить реальность, город, фото и материалы |
| `/portfolio/pryamaya-kuhnya-dlya-studii-brest` | project | подтвердить реальность и связь с Брестом |
| `/portfolio/kuhnya-s-ostrovom-grodno` | project | подтвердить реальность и связь с Гродно |
| `/portfolio/neoklassicheskaya-kuhnya-vitebsk` | project | подтвердить реальность и связь с Витебском |
| `/portfolio/malenkaya-kuhnya-gomel` | project | подтвердить реальность и связь с Гомелем |
| `/portfolio/kuhnya-do-potolka-mogilev` | project | подтвердить реальность и связь с Могилёвом |
| `/portfolio/uglovaya-kuhnya-dlya-novostroyki-minsk` | project | подтвердить реальность, город, фото и материалы |

До прохождения provenance gate ни один проект не должен выводиться пользователю как «Наша работа». AI/3D/unknown остаются идеями или нейтральными примерами; URL не удаляется без отдельного решения.

## Статьи — 24 URL

Статьи являются входами в интерактивные сценарии, а не отдельным текстовым островом. Каждая статья должна иметь прямой следующий шаг: планировка, материал, механизм, проект или расчёт.

| URL | Целевой вопрос |
| --- | --- |
| `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026` | от чего зависит ориентир стоимости в Минске |
| `/blog/uglovaya-kuhnya-razmery-planirovka` | как проверить размеры угловой планировки |
| `/blog/kuhnya-do-potolka-plyusy-minusy-cena` | кому подходит кухня до потолка |
| `/blog/kuhnya-na-zakaz-ili-gotovaya-chto-vygodnee` | сравнение заказа и готового решения |
| `/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera` | что подготовить до замера |
| `/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh` | структура сметы |
| `/blog/oshibki-pri-zakaze-kuhni-15-punktov-pered-dogovorom` | чек-лист ошибок перед договором |
| `/blog/materialy-dlya-kuhni-ldsp-mdf-emal-hpl-shpon` | сравнение материалов |
| `/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat` | выбор формы |
| `/blog/kak-podgotovitsya-k-zameru-kuhni` | подготовка к замеру |
| `/blog/kuhnya-dlya-chastnogo-doma-planirovka-hranenie-tehnika` | кухня для дома |
| `/blog/kuhnya-6-kv-m-v-hruschevke` | решение для 6 м² |
| `/blog/chto-vhodit-v-stoimost-kuhni-na-zakaz` | состав стоимости |
| `/blog/kuhnya-pod-vstroennuyu-tehniku` | планирование техники |
| `/blog/p-obraznaya-kuhnya-razmery-prohody-cena` | П-образная планировка |
| `/blog/kak-vybrat-kuhnyu` | общий путь выбора |
| `/blog/skolko-stoit-kuhnya-na-zakaz` | общий вопрос цены |
| `/blog/kuhnya-dlya-malenkoy-kvartiry` | маленькая квартира |
| `/blog/kakie-fasady-luchshe` | выбор фасадов |
| `/blog/kuhni-blum-hettich-gtv` | сравнение фурнитуры по функции и бренду |
| `/blog/kuhnya-s-ostrovom` | остров и проходы |
| `/blog/kakuyu-planirovku-kuhni-vybrat` | выбор планировки |
| `/blog/kak-vybrat-materialy-dlya-kuhni` | выбор материалов |
| `/blog/kuhnya-pod-scenarij-semi-studii-doma` | сценарии жизни |

Каждая статья получает один primary intent и не повторяет целиком соответствующую коммерческую страницу.

## Локации — 31 URL

| URL | Архетип | Правило уникальности |
| --- | --- | --- |
| `/locations/minsk` | location | только подтверждённые условия работы в Минске |
| `/locations/minskaya-oblast` | location | условия области, не копия Минска |
| `/locations/borisov` | process/local | process-led пилот и подтверждённая local proof |
| `/locations/zhodino` | location | условия и доказательства Жодино |
| `/locations/molodechno` | location | условия и доказательства Молодечно |
| `/locations/soligorsk` | location | условия и доказательства Солигорска |
| `/locations/slutsk` | location | условия и доказательства Слуцка |
| `/locations/fanipol` | location | условия и доказательства Фаниполя |
| `/locations/smolevichi` | location | условия и доказательства Смолевичей |
| `/locations/dzerzhinsk` | location | условия и доказательства Дзержинска |
| `/locations/zaslavl` | location | условия и доказательства Заславля |
| `/locations/logoisk` | location | условия и доказательства Логойска |
| `/locations/vileyka` | location | условия и доказательства Вилейки |
| `/locations/nesvizh` | location | условия и доказательства Несвижа |
| `/locations/berezino` | location | условия и доказательства Березино |
| `/locations/volozhin` | location | условия и доказательства Воложина |
| `/locations/stolbtsy` | location | условия и доказательства Столбцов |
| `/locations/uzda` | location | условия и доказательства Узды |
| `/locations/cherven` | location | условия и доказательства Червеня |
| `/locations/maryina-gorka` | location | условия и доказательства Марьиной Горки |
| `/locations/kletsk` | location | условия и доказательства Клецка |
| `/locations/kopyl` | location | условия и доказательства Копыля |
| `/locations/krupki` | location | условия и доказательства Крупок |
| `/locations/lyuban` | location | условия и доказательства Любаня |
| `/locations/myadel` | location | условия и доказательства Мяделя |
| `/locations/starye-dorogi` | location | условия и доказательства Старых Дорог |
| `/locations/gomel` | location | условия и доказательства Гомеля |
| `/locations/grodno` | location | условия и доказательства Гродно |
| `/locations/brest` | location | условия и доказательства Бреста |
| `/locations/vitebsk` | location | условия и доказательства Витебска |
| `/locations/mogilev` | location | условия и доказательства Могилёва |

Нельзя считать городскую страницу уникальной только по замене названия города. Для каждой опубликованной локации нужны подтверждённые условия, зона выезда, фактическая логистика и локальные примеры при наличии. Если уникальной ценности нет, страница остаётся техническим fallback до отдельного решения об index policy.

## Принцип расширения каталога

Новые стили, планировки, материалы и механизмы добавляются в сущности и связки. Индексируемый URL появляется только после заполнения полей из `06-ux-spec.md` и прохождения `10-implementation-qa-rollout.md`.

## Protected baseline routes

Эти URL остаются существующими canonical surfaces без page-specific redesign в текущем rollout. Таблица ниже — supplemental protection register, а не дополнительные sitemap-строки; canonical inventory по-прежнему содержит 112 уникальных URL.

| Route | Роль baseline | Разрешённая интеграция | Запрет до отдельной приёмки |
|---|---|---|---|
| `/` | hub | ссылки, shared shell, analytics, lead context, regression | собственный redesign, SEO/meta/schema/media changes |
| `/design-proekt-kuhni` | service / design brief | контекстный вход из новых сценариев, shared shell, analytics | переписывание услуги и основной формы |
| `/locations/minskaya-oblast` | regional location | подтверждённые локальные ссылки, shared shell, analytics | копирование городских страниц, новые claims |
| `/locations/minsk` | city location | подтверждённые локальные ссылки, shared shell, analytics | изменение локального контента и доказательств |
| `/materials/furnitura` | hardware hub | deep-links из materials/styles/layouts, shared shell, analytics | перестройка архива, замена медиа и SEO-роли |

В каждом implementation ticket эти пять маршрутов указываются отдельным regression scope.

## Route/intent и SEO-карта — аудит 2026-07-20

Статус: `PASS_WITH_EVIDENCE_GAPS`. Инвентарь взят из проверенного `public/sitemap-static.xml` и production `/sitemap.xml`: 112 уникальных canonical URL, `missing = 0`, `extra = 0`. Поля ниже описывают различимые пользовательские задачи и редакционные границы; они не утверждают поисковый объём, позиции или фактическую локальную/проектную доказательность. `GSC/SERP evidence required` означает, что гипотезу интента нужно подтвердить данными до изменения metadata, index policy или контента.

Обозначения index policy:

- `INDEX_EXISTING` — сохранить текущий canonical и текущую включённость в sitemap; runtime policy этим docs-only этапом не меняется;
- `EVIDENCE_GATE` — URL сейчас остаётся `INDEX_EXISTING`, но дальнейшее подтверждение `index/follow` требует указанной доказательности;
- `PROTECTED` — один из пяти защищённых URL; разрешена только regression-проверка и документирование;
- `NO_FACETS` — состояния фильтров/сравнений не создают новые canonical URL.

### Основные hubs, сервисы и материалы — 23 URL

| route | primary intent | userQuestion | uniquePromise | archetype | primaryInteraction | index policy | evidence owner | 2–4 логичных перехода | риск пересечения |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | выбрать путь к кухне на заказ | С чего начать выбор кухни? | Собрать единый вход к форме, стилю, сценарию, материалам, работам и цене без смешения идей с реальными объектами. | hub | визуальные входы по задачам | `INDEX_EXISTING; PROTECTED; NO_FACETS` | product owner + SEO editor; GSC/SERP evidence required | `/catalog`; `/styles`; `/prices`; `/portfolio` | Высокий: широкий коммерческий интент пересекается с `/locations/minsk`, `/catalog` и `/prices`. |
| `/about` | проверить компанию и ответственность | Кто отвечает за проект, производство и результат? | Дать проверяемые сведения о компании и ролях без неподтверждённых регалий. | trust | раскрытие фактов и ответственных | `INDEX_EXISTING; EVIDENCE_GATE` | business owner | `/portfolio`; `/reviews`; `/contacts` | Средний: доверительные claims пересекаются с `/reviews` и `/warranty`. |
| `/catalog` | выбрать форму кухни | Какие варианты кухни можно изучить и заказать? | Развести идеи по планировкам и задачам, не выдавая визуализации за работы. | catalog hub | карточки форм и сценариев | `INDEX_EXISTING; NO_FACETS` | catalog editor + media/provenance owner | `/catalog/uglovye-kuhni`; `/catalog/pryamye-kuhni`; `/scenarios`; `/styles` | Средний: пересечение с `/styles` и `/scenarios`; владелец — выбор формы. |
| `/calculator` | получить предварительный ориентир бюджета | Какой ориентир стоимости даёт выбранная конфигурация? | Объяснить предварительный расчёт и ограничения без обещания финальной сметы. | price tool | пошаговый калькулятор | `INDEX_EXISTING; NO_FACETS` | pricing owner + product owner | `/prices`; `/materials`; `/design-proekt-kuhni`; `/contacts` | Высокий: пересечение с `/prices` и статьями о стоимости; владелец — интерактивный ориентир. |
| `/design-proekt-kuhni` | подготовить дизайн-проект | Как подготовить планировку и данные для проекта кухни? | Провести через фактический brief и следующий шаг без подмены проекта калькулятором. | service | progressive brief / configurator | `INDEX_EXISTING; PROTECTED; NO_FACETS` | design-process owner | `/catalog`; `/materials`; `/calculator`; `/contacts` | Средний: пересечение с `/calculator`; владелец — проектирование и исходные данные. |
| `/prices` | понять структуру цены | Из чего складывается стоимость кухни? | Показать состав и границы комплектаций только по актуальным правилам расчёта. | price explainer | сравнение составляющих цены | `INDEX_EXISTING; EVIDENCE_GATE` | pricing owner | `/calculator`; `/materials/furnitura`; `/design-proekt-kuhni`; `/contacts` | Высокий: пересечение с `/calculator` и двумя статьями о цене; владелец — правила стоимости. |
| `/contacts` | выбрать канал связи | Как связаться и передать контекст задачи? | Показать только подтверждённые контакты и безопасный следующий шаг. | contact/trust | выбор канала связи | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + lead-system owner | `/design-proekt-kuhni`; `/calculator`; `/portfolio` | Низкий: брендовый навигационный интент; риск только дублирования CTA. |
| `/portfolio` | проверить реальные работы | Какие подтверждённые кухни действительно выполнены компанией? | Показывать как «Наши работы» только объекты, прошедшие provenance gate. | portfolio hub | фильтр подтверждённых объектов | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | business owner + portfolio provenance editor | `/catalog`; `/styles`; `/locations`; `/calculator` | Высокий: generated/unknown cases пересекаются с идеями каталога и создают риск ложного proof. |
| `/reviews` | проверить опыт клиентов | Какие отзывы имеют подтверждённый источник? | Отделить подтверждённые отзывы от неподтверждённых заявлений и не создавать fake rating. | trust | explorer источников отзывов | `INDEX_EXISTING; EVIDENCE_GATE` | reviews moderator + business owner | `/portfolio`; `/about`; `/contacts` | Средний: пересечение с `/about` и общим trust-контентом. |
| `/blog` | выбрать практический вопрос | Что изучить до заказа кухни? | Развести 24 статьи по одному вопросу и вести к релевантному коммерческому шагу. | guide hub | рубрикатор вопросов | `INDEX_EXISTING; NO_FACETS` | editorial owner | `/blog/kak-vybrat-kuhnyu`; `/catalog`; `/materials`; `/prices` | Средний: hub не должен конкурировать с отдельными guide и commercial страницами. |
| `/delivery-installation` | понять доставку и монтаж | Как фактически проходят доставка и установка? | Показать подтверждённые этапы, границы ответственности и подготовку помещения. | service/process | последовательность этапов | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner | `/design-proekt-kuhni`; `/warranty`; `/locations`; `/contacts` | Средний: условия пересекаются с location pages; общие правила остаются здесь. |
| `/styles` | выбрать визуальное направление | Какой стиль подходит по признакам и ограничениям? | Сравнить стили по композиции и материалам, а не только по цвету. | style hub | mood-card explorer | `INDEX_EXISTING; NO_FACETS` | design editor + media owner | `/styles/minimalizm`; `/styles/neoklassika`; `/materials`; `/catalog` | Средний: пересечение с каталогом; владелец — визуальный язык. |
| `/materials` | выбрать материал или механизм | Из чего собрать кухню под свои условия? | Развести фасады, поверхности и фурнитуру по эксплуатационным решениям. | material hub | selector материалов | `INDEX_EXISTING; NO_FACETS` | materials editor + technical evidence owner | `/materials/mdf-fasady`; `/materials/plastik-hpl`; `/materials/furnitura`; `/prices` | Средний: пересечение со статьями-сравнениями; hub владеет навигацией. |
| `/scenarios` | выбрать кухню по бытовой задаче | Какая кухня подходит моему образу жизни и помещению? | Начать с задачи пользователя и вывести к форме, материалу и бюджету. | scenario hub | карточки бытовых задач | `INDEX_EXISTING; NO_FACETS` | product editor | `/scenarios/dlya-semi`; `/scenarios/dlya-studii`; `/catalog`; `/calculator` | Средний: пересечение с layout pages; владелец — жизненная задача. |
| `/locations` | проверить географию работ | Где компания подтверждённо выполняет заказы? | Показать зоны работы и evidence gaps без выдуманных филиалов. | location hub | карта/список зон | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | operations owner + location editor | `/locations/minsk`; `/locations/minskaya-oblast`; `/delivery-installation`; `/contacts` | Высокий: все city pages требуют фактов, а не топонимической подстановки. |
| `/warranty` | понять гарантийные условия | Какие подтверждённые условия действуют после монтажа? | Изложить только договорные случаи, исключения и канал обращения. | service/trust | раскрытие условий | `INDEX_EXISTING; EVIDENCE_GATE` | business/legal owner | `/delivery-installation`; `/about`; `/contacts` | Средний: пересечение с `/about` и монтажом; владелец — договорные условия. |
| `/materials/furnitura` | выбрать механизмы кухни | Как работают механизмы и где оправдана комплектация? | Объяснить функции фурнитуры и компромиссы без неподтверждённых brand/spec claims. | hardware | архив/сравнение механизмов | `INDEX_EXISTING; PROTECTED; EVIDENCE_GATE; NO_FACETS` | technical materials owner | `/materials`; `/prices`; `/catalog/uglovye-kuhni`; `/blog/kuhni-blum-hettich-gtv` | Высокий: пересечение с брендовой статьёй и P1 performance debt из 203 изображений. |
| `/materials/ldsp` | оценить ЛДСП для кухни | Когда ЛДСП достаточно по нагрузке, уходу и бюджету? | Дать decision model применимости ЛДСП, а не общий каталог фасадов. | material | образцы + ограничения | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | technical materials owner | `/materials/mdf-fasady`; `/materials/plastik-hpl`; `/prices`; `/blog/materialy-dlya-kuhni-ldsp-mdf-emal-hpl-shpon` | Средний: пересечение с общей material guide; владелец — решение по ЛДСП. |
| `/materials/mdf-fasady` | выбрать основу и покрытие МДФ | Какой вариант МДФ подходит по виду, уходу и ограничениям? | Сравнить покрытия МДФ и показать применимость без смешения с отдельной эмалью. | material | сравнение покрытий | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | technical materials owner | `/materials/mdf-emal`; `/materials/plastik-hpl`; `/styles`; `/calculator` | Высокий: пересечение с `/materials/mdf-emal` и статьёй о фасадах. |
| `/materials/plastik-hpl` | оценить HPL-поверхность | Где HPL оправдан по эксплуатации и уходу? | Разобрать свойства HPL как поверхности и сравнить с альтернативами. | material | сравнение поверхностей | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | technical materials owner | `/materials/mdf-fasady`; `/materials/akril`; `/materials/ldsp`; `/prices` | Средний: пересечение с общей статьёй о материалах. |
| `/materials/shpon` | оценить натуральную фактуру шпона | Когда шпон подходит и какие ограничения ухода учитывать? | Сфокусироваться на натуральной фактуре, вариативности и эксплуатации. | material | образцы + care guide | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | technical materials owner | `/styles/neoklassika`; `/styles/skandinavskie`; `/materials/mdf-fasady`; `/calculator` | Средний: визуальный интент пересекается со styles; материал владеет эксплуатацией. |
| `/materials/akril` | оценить акриловые фасады | Когда акрил оправдан по виду и эксплуатации? | Сравнить глянец, уход и ограничения акрила без недоказанных характеристик. | material | surface comparison | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | technical materials owner | `/materials/plastik-hpl`; `/materials/mdf-emal`; `/styles/hay-tek`; `/prices` | Средний: пересечение с HPL и эмалью; нужен evidence по свойствам. |
| `/materials/mdf-emal` | оценить окрашенный МДФ | Когда эмаль на МДФ подходит по цвету, ремонту и уходу? | Владеть вопросом окрашенного покрытия, не дублируя общий МДФ. | material | palette + constraint comparison | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | technical materials owner | `/materials/mdf-fasady`; `/materials/akril`; `/styles/neoklassika`; `/prices` | Высокий: близкий кластер с `/materials/mdf-fasady`; требуется чёткая ownership boundary. |

### Планировки, стили и сценарии — 21 URL

| route | primary intent | userQuestion | uniquePromise | archetype | primaryInteraction | index policy | evidence owner | 2–4 логичных перехода | риск пересечения |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/catalog/uglovye-kuhni` | выбрать угловую планировку | Подойдёт ли две стены и как использовать угол? | Проверить угол, хранение, рабочие зоны и ограничения проходов. | layout | CornerStorageExplorer + layout check | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | layout editor + technical owner | `/catalog/pryamye-kuhni`; `/materials/furnitura`; `/blog/uglovaya-kuhnya-razmery-planirovka`; `/calculator` | Высокий: две угловые статьи; commercial page владеет выбором и заказом. |
| `/catalog/pryamye-kuhni` | выбрать прямую планировку | Когда одной линии достаточно и как расставить зоны? | Показать ограничения длины и последовательность рабочих зон. | layout | line-layout check | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | layout editor | `/catalog/uglovye-kuhni`; `/catalog/malenkie-kuhni`; `/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat`; `/calculator` | Средний: пересечение со сравнительной статьёй и маленькими кухнями. |
| `/catalog/p-obraznye-kuhni` | выбрать П-образную планировку | Хватит ли места для трёх сторон и безопасных проходов? | Проверить проходы, углы и распределение трёх рабочих сторон. | layout | clearance comparison | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | layout editor | `/catalog/uglovye-kuhni`; `/blog/p-obraznaya-kuhnya-razmery-prohody-cena`; `/materials/furnitura`; `/calculator` | Высокий: статья владеет объяснением размеров, commercial page — применимостью и заказом. |
| `/catalog/kuhni-s-ostrovom` | выбрать кухню с островом | Поместится ли остров и какую функцию ему дать? | Проверить проходы, коммуникации и роли острова в конкретной схеме. | layout | island clearance planner | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | layout editor + technical owner | `/scenarios/s-ostrovom`; `/blog/kuhnya-s-ostrovom`; `/catalog/p-obraznye-kuhni`; `/calculator` | Высокий: scenario и guide разделяют бытовую задачу и обучение; commercial владеет формой. |
| `/catalog/malenkie-kuhni` | выбрать решение для малой площади | Как сохранить рабочую зону и хранение в маленькой кухне? | Сопоставить компактные layout-приёмы и реальные ограничения помещения. | scenario/layout | small-space trade-off explorer | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | layout editor | `/scenarios/dlya-malenkoy-kuhni`; `/catalog/pryamye-kuhni`; `/blog/kuhnya-6-kv-m-v-hruschevke`; `/calculator` | Высокий: scenario и две статьи; commercial page владеет вариантами заказа. |
| `/catalog/kuhni-do-potolka` | выбрать вертикальное хранение | Стоит ли поднимать шкафы до потолка и как ими пользоваться? | Проверить доступ, объём хранения, вентиляцию и ограничения верхних секций. | scenario/layout | vertical-storage explorer | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | layout editor + technical owner | `/scenarios/do-potolka`; `/blog/kuhnya-do-potolka-plyusy-minusy-cena`; `/materials/furnitura`; `/calculator` | Высокий: тесный кластер со scenario и guide; commercial владеет конфигурацией. |
| `/catalog/kuhni-bez-ruchek` | выбрать способ открывания без ручек | Какой механизм без ручек подходит и какие у него ограничения? | Сравнить способы открывания как планировочное и эксплуатационное решение. | layout/style | opening-mechanism comparison | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | technical materials owner + design editor | `/materials/furnitura`; `/styles/minimalizm`; `/styles/hay-tek`; `/calculator` | Высокий: hardware и style clusters; страница владеет целостным решением «без ручек». |
| `/styles/neoklassika` | выбрать неоклассический стиль | Как получить классическую выразительность без перегруза? | Разобрать пропорции, фасады, детали и ограничения неоклассики. | style | mood + feature comparison | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | design editor + media owner | `/materials/mdf-emal`; `/styles/klassicheskie`; `/catalog`; `/portfolio` | Высокий: пересечение с классикой; различие — современная умеренная интерпретация. |
| `/styles/hay-tek` | выбрать хай-тек | Как устроить технологичный интерьер без декоративного шума? | Связать гладкие поверхности, интеграцию техники и функциональные детали. | style | feature hotspot explorer | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | design editor + media owner | `/materials/akril`; `/catalog/kuhni-bez-ruchek`; `/styles/minimalizm`; `/portfolio` | Средний/высокий: пересечение с минимализмом и безручечными кухнями. |
| `/styles/provans` | выбрать прованс | Как использовать мягкие детали и не перегрузить кухню декором? | Показать характерные детали, материалы и границы декоративности. | style | mood-board comparison | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | design editor + media owner | `/styles/klassicheskie`; `/materials/shpon`; `/catalog`; `/portfolio` | Средний: пересечение с классикой; уникальность — мягкая деревенская пластика. |
| `/styles/loft` | выбрать лофт | Как сочетать индустриальные материалы с удобной кухней? | Сопоставить фактуры, открытые элементы и практические ограничения. | style | material/mood mixer | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | design editor + media owner | `/materials/ldsp`; `/materials/shpon`; `/styles/sovremennye`; `/portfolio` | Средний: пересечение с современным стилем; владелец — индустриальная композиция. |
| `/styles/sovremennye` | выбрать современный стиль | Какие решения делают кухню современной, но не привязывают к одному подстилю? | Дать базовую рамку актуальной функциональной композиции и направить к более узким стилям. | style | feature selector | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | design editor | `/styles/minimalizm`; `/styles/hay-tek`; `/materials`; `/catalog` | Высокий: широкий стиль может каннибализировать минимализм и хай-тек; нужен GSC/SERP evidence. |
| `/styles/skandinavskie` | выбрать скандинавский стиль | Как совместить светлый образ, тепло и практичность? | Разобрать свет, натуральные фактуры, простоту и эксплуатационные компромиссы. | style | mood/material pairing | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | design editor + media owner | `/materials/shpon`; `/styles/minimalizm`; `/catalog/malenkie-kuhni`; `/portfolio` | Средний/высокий: пересечение с минимализмом и маленькими кухнями. |
| `/styles/klassicheskie` | выбрать классический стиль | Какие пропорции и детали создают классическую кухню? | Показать классическую композицию и её требования к пространству и уходу. | style | detail explorer | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | design editor + media owner | `/styles/neoklassika`; `/styles/provans`; `/materials/mdf-emal`; `/portfolio` | Высокий: пересечение с неоклассикой; ownership — традиционные пропорции и декор. |
| `/styles/minimalizm` | выбрать минимализм | Как убрать визуальный шум без потери удобства? | Связать скрытое хранение, чистые линии и требования к дисциплине поверхности. | style | clutter/feature comparison | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | design editor + media owner | `/catalog/kuhni-bez-ruchek`; `/styles/sovremennye`; `/materials/furnitura`; `/portfolio` | Высокий: пересечение с modern/high-tech/без ручек; владелец — принцип визуального сокращения. |
| `/scenarios/s-ostrovom` | решить бытовую задачу с островом | Для каких ежедневных действий нужен остров? | Начать с сценария готовки, общения и хранения, затем проверить layout. | scenario | task-to-island-role selector | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | product editor | `/catalog/kuhni-s-ostrovom`; `/blog/kuhnya-s-ostrovom`; `/materials`; `/calculator` | Высокий: layout владеет геометрией, guide — обучением, scenario — бытовой ролью. |
| `/scenarios/do-potolka` | увеличить вертикальное хранение | Какие вещи и как хранить в верхних секциях? | Оценить частоту доступа и организацию хранения до выбора конфигурации. | scenario | storage-frequency planner | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | product editor | `/catalog/kuhni-do-potolka`; `/blog/kuhnya-do-potolka-plyusy-minusy-cena`; `/materials/furnitura`; `/calculator` | Высокий: нужен строгий split с commercial layout и guide. |
| `/scenarios/dlya-semi` | выбрать кухню для семьи | Как организовать совместную готовку, хранение и безопасность? | Сформировать требования семьи к зонам, доступу и повседневной нагрузке. | scenario | household-needs selector | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | product editor | `/catalog/uglovye-kuhni`; `/materials`; `/blog/kuhnya-pod-scenarij-semi-studii-doma`; `/calculator` | Средний: пересечение с общей scenario article; page владеет интерактивным выбором. |
| `/scenarios/dlya-studii` | выбрать кухню для студии | Как вписать кухню в общее пространство и контролировать визуальный шум? | Свести зонирование, хранение, технику и внешний вид для студии. | scenario | studio-zone planner | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | product editor | `/catalog/pryamye-kuhni`; `/catalog/malenkie-kuhni`; `/styles/minimalizm`; `/calculator` | Средний/высокий: пересечение с малой площадью; владелец — совмещённое пространство. |
| `/scenarios/dlya-malenkoy-kuhni` | решить ограничения маленькой кухни | Какие приоритеты сохранить при дефиците площади? | Помочь ранжировать рабочую поверхность, хранение, технику и проходы. | scenario | priority trade-off | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | product editor | `/catalog/malenkie-kuhni`; `/blog/kuhnya-6-kv-m-v-hruschevke`; `/blog/kuhnya-dlya-malenkoy-kvartiry`; `/calculator` | Высокий: три соседних URL; scenario владеет decision model, не готовым layout. |
| `/scenarios/byudzhetnaya-kuhnya` | распределить ограниченный бюджет | На чём экономить без ущерба ключевым функциям? | Разделить обязательное, опциональное и рискованную экономию без выдуманной цены. | scenario/price | budget-priority selector | `INDEX_EXISTING; EVIDENCE_GATE; NO_FACETS` | pricing owner + product editor | `/prices`; `/calculator`; `/materials/ldsp`; `/materials/furnitura` | Высокий: пересечение с price pages; владелец — приоритеты, а не прайс. |

### Портфолио — 13 URL

Для всех строк ниже `uniquePromise` является редакционной границей карточки после подтверждения происхождения, а не утверждением, что объект уже доказан. До business/media evidence review все 13 detail URL сохраняют текущий runtime status, но имеют `PROVENANCE_REVIEW_REQUIRED`.

| route | primary intent | userQuestion | uniquePromise | archetype | primaryInteraction | index policy | evidence owner | 2–4 логичных перехода | риск пересечения |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/portfolio/kuhnya-japandi-zelenye-fasady-minsk` | изучить подтверждённый проект japandi | Как в одном объекте сочетаются japandi и зелёные фасады? | После provenance gate разобрать задачу, ограничения и решения конкретного объекта, а не только mood. | verified project | annotated project story | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor | `/portfolio`; `/styles/skandinavskie`; `/materials/mdf-fasady`; `/locations/minsk` | Высокий: без evidence выглядит как style idea; город и slug не доказывают реальность. |
| `/portfolio/loft-kuhnya-oreh-poluostrov-minsk` | изучить проект loft с полуостровом | Как ореховая фактура и полуостров решают задачу объекта? | После gate показать причинную связь планировки, материала и результата. | verified project | before/constraints/solution story | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor | `/portfolio`; `/styles/loft`; `/catalog/kuhni-s-ostrovom`; `/locations/minsk` | Высокий: пересечение со style/layout ideas; требуется media-set evidence. |
| `/portfolio/neoklassicheskaya-kuhnya-sinie-fasady-minsk` | изучить неоклассический проект | Как синие фасады работают в неоклассической композиции объекта? | После gate показать фактические ограничения, выбор фасадов и реализованный результат. | verified project | detail + decision annotations | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor | `/portfolio`; `/styles/neoklassika`; `/materials/mdf-emal`; `/locations/minsk` | Высокий: без evidence конкурирует со style page и AI concepts. |
| `/portfolio/belaya-kuhnya-do-potolka-minsk` | изучить проект до потолка | Как верхние секции и белые фасады решают хранение конкретного объекта? | После gate связать замеры, доступ, хранение и фактический результат. | verified project | vertical-storage project story | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor | `/portfolio`; `/catalog/kuhni-do-potolka`; `/scenarios/do-potolka`; `/locations/minsk` | Высокий: пересечение с commercial/scenario pages; реальность требует независимого proof. |
| `/portfolio/kuhnya-s-ostrovom-zelenyj-akcent-minsk` | изучить проект кухни с островом | Как остров и зелёный акцент работают в конкретном объекте? | После gate показать функции острова, проходы и подтверждённый итог. | verified project | island project walkthrough | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor | `/portfolio`; `/catalog/kuhni-s-ostrovom`; `/scenarios/s-ostrovom`; `/locations/minsk` | Высокий: самый тесный overlap с island cluster; detail владеет только доказанным объектом. |
| `/portfolio/pryamaya-kuhnya-studiya-dubovaya-nisha-minsk` | изучить прямую кухню для студии | Как прямая линия и дубовая ниша решают задачу студии? | После gate объяснить зонирование и хранение на фактических ограничениях объекта. | verified project | studio project walkthrough | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor | `/portfolio`; `/catalog/pryamye-kuhni`; `/scenarios/dlya-studii`; `/locations/minsk` | Высокий: пересечение со studio/layout; slug не подтверждает проект. |
| `/portfolio/seraya-uglovaya-kuhnya-novostrojka-minsk` | изучить угловой проект новостройки | Как угловая схема адаптирована к ограничениям новостройки? | После gate показать замер, угол, инженерные ограничения и результат. | verified project | constraints-to-solution story | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor | `/portfolio`; `/catalog/uglovye-kuhni`; `/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera`; `/locations/minsk` | Высокий: пересечение с layout/guide; detail владеет только object evidence. |
| `/portfolio/pryamaya-kuhnya-dlya-studii-brest` | изучить проект студии в Бресте | Какие ограничения студии решены прямой кухней в этом объекте? | После gate показать объект, логистику и решение без выдуманного локального присутствия. | verified project | project + logistics story | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor + operations owner | `/portfolio`; `/catalog/pryamye-kuhni`; `/scenarios/dlya-studii`; `/locations/brest` | Критический: generated case и дальняя локация требуют подтверждения проекта и зоны работ. |
| `/portfolio/kuhnya-s-ostrovom-grodno` | изучить островной проект в Гродно | Как остров реализован в подтверждённом объекте Гродно? | После gate раскрыть геометрию, функции острова и фактическую логистику. | verified project | island project walkthrough | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor + operations owner | `/portfolio`; `/catalog/kuhni-s-ostrovom`; `/locations/grodno`; `/calculator` | Критический: generated/locality claims; город в названии не evidence. |
| `/portfolio/neoklassicheskaya-kuhnya-vitebsk` | изучить неоклассический проект в Витебске | Что определило неоклассическое решение этого объекта? | После gate показать реальные ограничения, материал и подтверждённый региональный процесс. | verified project | annotated project story | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor + operations owner | `/portfolio`; `/styles/neoklassika`; `/locations/vitebsk`; `/materials/mdf-emal` | Критический: generated/locality claims и overlap со style page. |
| `/portfolio/malenkaya-kuhnya-gomel` | изучить малую кухню в Гомеле | Какие приоритеты помогли решить маленькое пространство объекта? | После gate показать измеримые ограничения и реализованный trade-off. | verified project | small-space project story | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor + operations owner | `/portfolio`; `/catalog/malenkie-kuhni`; `/scenarios/dlya-malenkoy-kuhni`; `/locations/gomel` | Критический: generated/locality claims; без proof это только concept. |
| `/portfolio/kuhnya-do-potolka-mogilev` | изучить проект до потолка в Могилёве | Как вертикальное хранение реализовано в подтверждённом объекте? | После gate связать размеры, доступ и региональный процесс с доказанным результатом. | verified project | vertical-storage project story | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor + operations owner | `/portfolio`; `/catalog/kuhni-do-potolka`; `/scenarios/do-potolka`; `/locations/mogilev` | Критический: generated/locality claims и cluster overlap. |
| `/portfolio/uglovaya-kuhnya-dlya-novostroyki-minsk` | изучить угловой проект новостройки | Как угловая планировка решает ограничения конкретной новостройки? | После gate раскрыть исходные данные, решение угла и фактический результат. | verified project | constraints-to-solution story | `INDEX_EXISTING; EVIDENCE_GATE` | business owner + portfolio provenance editor | `/portfolio`; `/catalog/uglovye-kuhni`; `/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera`; `/locations/minsk` | Высокий: дублирует соседний угловой case по интенту; нужны различимые факты объекта. |

### Статьи — 24 URL

| route | primary intent | userQuestion | uniquePromise | archetype | primaryInteraction | index policy | evidence owner | 2–4 логичных перехода | риск пересечения |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026` | узнать актуальный ориентир цены в Минске | Какие факторы формируют цену кухни в Минске в 2026 году? | Дать датированный разбор только по подтверждённым pricing rules и явно ограничить срок актуальности. | guide/price | cost-factor breakdown | `INDEX_EXISTING; EVIDENCE_GATE` | pricing owner + editorial owner | `/prices`; `/calculator`; `/locations/minsk`; `/blog/chto-vhodit-v-stoimost-kuhni-na-zakaz` | Критический: пересечение с evergreen price article и `/prices`; GSC/SERP evidence required. |
| `/blog/uglovaya-kuhnya-razmery-planirovka` | изучить размеры угловой кухни | Какие размеры и зоны проверить перед выбором угловой схемы? | Объяснить измерения и типовые ошибки, не заменяя commercial layout page. | guide/layout | annotated measurement checklist | `INDEX_EXISTING; EVIDENCE_GATE` | layout editor + editorial owner | `/catalog/uglovye-kuhni`; `/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat`; `/design-proekt-kuhni` | Высокий: коммерческая страница владеет заказом; статья — подготовкой и размерами. |
| `/blog/kuhnya-do-potolka-plyusy-minusy-cena` | оценить плюсы, минусы и цену кухни до потолка | Кому подходит кухня до потолка и какие компромиссы учитывать? | Свести преимущества, ограничения и price factors без дублирования configurator. | guide/comparison | pros/cons decision table | `INDEX_EXISTING; EVIDENCE_GATE` | editorial owner + pricing/technical owners | `/catalog/kuhni-do-potolka`; `/scenarios/do-potolka`; `/materials/furnitura`; `/calculator` | Высокий: три тесных соседних URL; статья владеет сравнительным ответом. |
| `/blog/kuhnya-na-zakaz-ili-gotovaya-chto-vygodnee` | сравнить заказную и готовую кухню | Как сравнить два подхода по fit, срокам, рискам и бюджету? | Дать нейтральную decision table без недоказанных цен и сроков. | guide/comparison | comparison matrix | `INDEX_EXISTING; EVIDENCE_GATE` | editorial owner + operations/pricing owners | `/catalog`; `/prices`; `/design-proekt-kuhni`; `/contacts` | Средний: широкий commercial overlap; уникальность — сравнение моделей покупки. |
| `/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera` | подготовить новостройку к замеру | Что проверить в новостройке до замера кухни? | Дать локально релевантный checklist только на подтверждённых процессах, без выдуманных норм. | guide/checklist | pre-measure checklist | `INDEX_EXISTING; EVIDENCE_GATE` | design-process owner + editorial owner | `/design-proekt-kuhni`; `/locations/minsk`; `/blog/kak-podgotovitsya-k-zameru-kuhni`; `/portfolio/uglovaya-kuhnya-dlya-novostroyki-minsk` | Высокий: пересечение с общим замером; уникальность — новостройка и готовность помещения. |
| `/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh` | распределить бюджет по составляющим | Как разложить бюджет на материалы, фурнитуру и монтаж? | Дать структуру сметы и evidence gaps, не выдавая формулу за оферту. | guide/price | budget worksheet | `INDEX_EXISTING; EVIDENCE_GATE` | pricing owner + editorial owner | `/prices`; `/calculator`; `/materials`; `/materials/furnitura` | Высокий: пересечение с `/prices`; статья владеет методикой распределения. |
| `/blog/oshibki-pri-zakaze-kuhni-15-punktov-pered-dogovorom` | проверить заказ перед договором | Какие риски проверить до подписания договора? | Дать 15 проверяемых пунктов без юридических гарантий и неподтверждённых claims. | guide/checklist | contract-risk checklist | `INDEX_EXISTING; EVIDENCE_GATE` | editorial owner + business/legal owner | `/warranty`; `/design-proekt-kuhni`; `/delivery-installation`; `/contacts` | Низкий/средний: уникальный checklist; юридические пункты требуют owner evidence. |
| `/blog/materialy-dlya-kuhni-ldsp-mdf-emal-hpl-shpon` | сравнить основные материалы | Чем отличаются ЛДСП, МДФ, эмаль, HPL и шпон для разных задач? | Дать верхнеуровневую сравнительную рамку и вести на detail pages. | guide/comparison | material comparison table | `INDEX_EXISTING; EVIDENCE_GATE` | technical materials owner + editorial owner | `/materials/ldsp`; `/materials/mdf-fasady`; `/materials/plastik-hpl`; `/materials/shpon` | Высокий: пересечение со всем material silo; статья владеет сравнением, detail — решением материала. |
| `/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat` | сравнить угловую и прямую формы | Какая из двух планировок лучше подходит ограничениям помещения? | Дать decision tree между двумя формами, не продавать обе на одной странице. | guide/comparison | layout decision tree | `INDEX_EXISTING; EVIDENCE_GATE` | layout editor + editorial owner | `/catalog/uglovye-kuhni`; `/catalog/pryamye-kuhni`; `/blog/kakuyu-planirovku-kuhni-vybrat`; `/calculator` | Высокий: overlap с двумя commercial pages и общей planning guide. |
| `/blog/kak-podgotovitsya-k-zameru-kuhni` | подготовиться к замеру | Какие данные и условия подготовить перед приездом замерщика? | Дать универсальный operational checklist и границы ответственности. | guide/checklist | preparation checklist | `INDEX_EXISTING; EVIDENCE_GATE` | design-process owner + editorial owner | `/design-proekt-kuhni`; `/delivery-installation`; `/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera` | Средний/высокий: общий замер vs новостройка; эта статья — универсальная. |
| `/blog/kuhnya-dlya-chastnogo-doma-planirovka-hranenie-tehnika` | спланировать кухню в частном доме | Какие особенности дома влияют на layout, хранение и технику? | Свести автономные коммуникации, масштабы и бытовые сценарии без фиктивных норм. | guide/scenario | house-specific checklist | `INDEX_EXISTING; EVIDENCE_GATE` | layout/technical owners + editorial owner | `/catalog`; `/scenarios/dlya-semi`; `/blog/kuhnya-pod-vstroennuyu-tehniku`; `/design-proekt-kuhni` | Средний: широкий scope, но уникальный тип помещения. |
| `/blog/kuhnya-6-kv-m-v-hruschevke` | решить кухню 6 м² в хрущёвке | Какие решения реально помещаются на 6 м² и какие компромиссы неизбежны? | Дать размерно-ограниченный кейс, не обобщая его на все маленькие кухни. | guide/small-space | 6 m² constraint map | `INDEX_EXISTING; EVIDENCE_GATE` | layout editor + editorial owner | `/catalog/malenkie-kuhni`; `/scenarios/dlya-malenkoy-kuhni`; `/blog/kuhnya-dlya-malenkoy-kvartiry`; `/calculator` | Высокий: пересечение с small-space cluster; уникальность — 6 м²/тип дома. |
| `/blog/chto-vhodit-v-stoimost-kuhni-na-zakaz` | понять состав стоимости | Какие работы и элементы входят или не входят в стоимость? | Дать checklist состава цены, не публикуя неподтверждённый прайс. | guide/price | inclusion/exclusion checklist | `INDEX_EXISTING; EVIDENCE_GATE` | pricing owner + editorial owner | `/prices`; `/calculator`; `/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh` | Высокий: overlap с price hub; статья владеет составом, не цифрой. |
| `/blog/kuhnya-pod-vstroennuyu-tehniku` | подготовить кухню под встроенную технику | Какие размеры, вентиляцию и сервисный доступ учесть? | Дать технический preparation map без выдуманных характеристик конкретных моделей. | guide/technical | appliance integration checklist | `INDEX_EXISTING; EVIDENCE_GATE` | technical owner + editorial owner | `/design-proekt-kuhni`; `/materials/furnitura`; `/catalog`; `/contacts` | Средний: технический интент различим; claims требуют source evidence. |
| `/blog/p-obraznaya-kuhnya-razmery-prohody-cena` | оценить П-образную планировку | Какие размеры, проходы и price factors проверить? | Дать предварительную проверку применимости и вести к commercial page. | guide/layout | clearance checklist | `INDEX_EXISTING; EVIDENCE_GATE` | layout/pricing owners + editorial owner | `/catalog/p-obraznye-kuhni`; `/calculator`; `/materials/furnitura`; `/design-proekt-kuhni` | Высокий: commercial page владеет заказом, статья — размерами и объяснением. |
| `/blog/kak-vybrat-kuhnyu` | пройти общий путь выбора | В какой последовательности выбрать форму, стиль, материалы и бюджет? | Дать evergreen roadmap и распределить пользователя по узким hubs. | guide/pillar | choice roadmap | `INDEX_EXISTING; EVIDENCE_GATE` | editorial owner + product owner | `/catalog`; `/styles`; `/materials`; `/calculator` | Высокий: широкий интент пересекается с главной и hubs; GSC/SERP evidence required. |
| `/blog/skolko-stoit-kuhnya-na-zakaz` | понять evergreen price factors | От каких факторов обычно зависит стоимость кухни на заказ? | Объяснить стабильные факторы без года, города и недоказанных цифр. | guide/price | cost-factor explainer | `INDEX_EXISTING; EVIDENCE_GATE` | pricing owner + editorial owner | `/prices`; `/calculator`; `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026` | Критический: прямой дубль dated price article; нужен GSC/SERP decision по ownership. |
| `/blog/kuhnya-dlya-malenkoy-kvartiry` | выбрать кухню для маленькой квартиры | Как учесть не только площадь кухни, но и сценарий всей квартиры? | Сфокусироваться на квартире, хранении вне кухни и визуальной интеграции. | guide/scenario | apartment trade-off guide | `INDEX_EXISTING; EVIDENCE_GATE` | product/layout owners + editorial owner | `/catalog/malenkie-kuhni`; `/scenarios/dlya-malenkoy-kuhni`; `/blog/kuhnya-6-kv-m-v-hruschevke` | Высокий: small-space cluster; граница — квартира как система, не 6 м². |
| `/blog/kakie-fasady-luchshe` | выбрать фасады по условиям | Какие фасады лучше именно для моих приоритетов? | Дать criteria-based decision tree и вести к material details. | guide/comparison | facade decision tree | `INDEX_EXISTING; EVIDENCE_GATE` | technical materials owner + editorial owner | `/materials/mdf-fasady`; `/materials/ldsp`; `/materials/plastik-hpl`; `/materials/mdf-emal` | Высокий: пересечение со всеми фасадными pages; guide владеет сравнением. |
| `/blog/kuhni-blum-hettich-gtv` | сравнить бренды фурнитуры по функции | Как сравнивать Blum, Hettich и GTV без выбора только по бренду? | Сравнить подтверждённые функции и классы механизмов, не публикуя неподтверждённые specs. | guide/comparison | function-first brand matrix | `INDEX_EXISTING; EVIDENCE_GATE` | technical hardware owner + editorial owner | `/materials/furnitura`; `/prices`; `/catalog/kuhni-bez-ruchek` | Критический: brand/spec claims и overlap с furnitura; требует source evidence. |
| `/blog/kuhnya-s-ostrovom` | изучить требования к острову | Какие проходы, функции и коммуникации нужны кухне с островом? | Дать обучающий checklist до выбора коммерческой конфигурации. | guide/layout | island readiness checklist | `INDEX_EXISTING; EVIDENCE_GATE` | layout/technical owners + editorial owner | `/catalog/kuhni-s-ostrovom`; `/scenarios/s-ostrovom`; `/design-proekt-kuhni`; `/calculator` | Высокий: island cluster; guide владеет требованиями, не заказом или бытовым сценарием. |
| `/blog/kakuyu-planirovku-kuhni-vybrat` | сравнить все базовые планировки | Как выбрать между прямой, угловой, П-образной и островной схемой? | Дать верхнеуровневое дерево выбора и вести на detail layout pages. | guide/pillar | layout decision tree | `INDEX_EXISTING; EVIDENCE_GATE` | layout editor + editorial owner | `/catalog/pryamye-kuhni`; `/catalog/uglovye-kuhni`; `/catalog/p-obraznye-kuhni`; `/catalog/kuhni-s-ostrovom` | Высокий: pillar не должен ранжироваться как отдельная commercial category. |
| `/blog/kak-vybrat-materialy-dlya-kuhni` | построить процесс выбора материалов | В какой последовательности выбирать корпус, фасады, столешницу и фурнитуру? | Дать workflow выбора, отличный от сравнительной таблицы конкретных материалов. | guide/pillar | material-choice roadmap | `INDEX_EXISTING; EVIDENCE_GATE` | technical materials owner + editorial owner | `/materials`; `/blog/materialy-dlya-kuhni-ldsp-mdf-emal-hpl-shpon`; `/materials/furnitura`; `/calculator` | Высокий: overlap с comparison article и hub; владелец — процесс выбора. |
| `/blog/kuhnya-pod-scenarij-semi-studii-doma` | сравнить бытовые сценарии | Чем различаются требования семьи, студии и частного дома? | Дать cross-scenario comparison и вести на отдельные scenario/detail pages. | guide/comparison | scenario comparison | `INDEX_EXISTING; EVIDENCE_GATE` | product editor + editorial owner | `/scenarios/dlya-semi`; `/scenarios/dlya-studii`; `/blog/kuhnya-dlya-chastnogo-doma-planirovka-hranenie-tehnika`; `/calculator` | Высокий: пересекается с тремя сценариями; статья владеет сравнением. |

### Локации — 31 URL

У location family единая строгая граница: топоним не является `uniquePromise`. Promise считается выполненным только при наличии подтверждённых city-specific условий зоны выезда, замера, доставки/монтажа и, если показывается, локального проекта. Пока evidence отсутствует, строка фиксирует вопрос и владельца доказательств, но не создаёт локальный claim. Search Console/SERP intent для каждой локации — `evidence required`.

| route | primary intent | userQuestion | uniquePromise | archetype | primaryInteraction | index policy | evidence owner | 2–4 логичных перехода | риск пересечения |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/locations/minsk` | проверить заказ кухни в Минске | Какие подтверждённые этапы и условия действуют для заказа в Минске? | Владеть только доказанным городским путём: замер, проект, доставка, монтаж и локальные примеры. | location | local order-path explorer | `INDEX_EXISTING; PROTECTED; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/design-proekt-kuhni`; `/delivery-installation`; `/portfolio` | Критический: пересечение с главной по «кухни в Минске»; GSC/SERP ownership required. |
| `/locations/minskaya-oblast` | проверить заказ по Минской области | Чем путь заказа по области отличается от Минска? | Владеть подтверждёнными зоной выезда и региональной логистикой, а не копией Минска. | regional location | zone/logistics explorer | `INDEX_EXISTING; PROTECTED; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/locations/minsk`; `/delivery-installation`; `/contacts` | Критический: overlap с Минском и всеми городами области; нужны реальные regional rules. |
| `/locations/borisov` | проверить процесс заказа в Борисове | Как проходит заказ для подтверждённой зоны Борисова? | Process-led pilot: показать фактическую последовательность и local proof только после owner review. | process/location | ProductionJourney | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/design-proekt-kuhni`; `/calculator` | Высокий: без local proof превращается в шаблон города; pilot evidence incomplete. |
| `/locations/zhodino` | проверить работу в Жодино | Входит ли адрес в подтверждённую зону и как проходит заказ? | Публиковать только city-specific зону, логистику и проверенный пример; иначе фиксировать evidence gap. | location | eligibility + order path | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/calculator` | Высокий: шаблонность с Борисовом/Смолевичами; уникальность не подтверждена. |
| `/locations/molodechno` | проверить работу в Молодечно | Какие подтверждённые условия замера и монтажа действуют для адреса? | Отличаться фактической зоной, графиком/логистикой и evidence, не названием города. | location | eligibility + logistics path | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/design-proekt-kuhni` | Высокий: local evidence required; иначе overlap со всеми городскими страницами. |
| `/locations/soligorsk` | проверить работу в Солигорске | Как подтверждается возможность дальнего замера, доставки и монтажа? | Владеть только доказанным remote-order path и границами обслуживания. | remote location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/calculator`; `/contacts` | Высокий: дальняя логистика не подтверждена; риск фиктивной локальности. |
| `/locations/slutsk` | проверить работу в Слуцке | Какие этапы и ограничения действуют для заказа из Слуцка? | Показать подтверждённый маршрут заказа и ограничения зоны, не общий шаблон. | location | eligibility + order path | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/calculator` | Высокий: city uniqueness/evidence missing. |
| `/locations/fanipol` | проверить работу в Фаниполе | Входит ли адрес в зону и как организованы замер и монтаж? | Зафиксировать только подтверждённые условия близкой к Минску зоны и реальную логистику. | location | zone eligibility check | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/locations/minsk`; `/delivery-installation` | Высокий: пересечение с Минском/областью; нужна отдельная service-zone ценность. |
| `/locations/smolevichi` | проверить работу в Смолевичах | Как проверить зону и следующий шаг для адреса в Смолевичах? | Дать city-specific eligibility и process evidence либо честно оставить gap. | location | zone eligibility check | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/contacts` | Высокий: шаблонность с Жодино/Борисовом; evidence required. |
| `/locations/dzerzhinsk` | проверить работу в Дзержинске | Какие подтверждённые условия заказа действуют по этому направлению? | Владеть проверенной зоной выезда и фактическим order path. | location | eligibility + order path | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/calculator` | Высокий: без operations evidence неразличима с соседними городами. |
| `/locations/zaslavl` | проверить работу в Заславле | Чем процесс для адреса в Заславле отличается от Минска? | Показать подтверждённые границы зоны и логистику, если различие реально существует. | location | zone/logistics comparison | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minsk`; `/locations/minskaya-oblast`; `/delivery-installation` | Высокий: прямой overlap с Минском/областью; unique value пока требует evidence. |
| `/locations/logoisk` | проверить работу в Логойске | Входит ли адрес в подтверждённую зону и как устроен выезд? | Владеть проверяемой зоной и ограничениями выезда, а не универсальным текстом. | location | zone eligibility check | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/contacts` | Высокий: evidence missing, template overlap. |
| `/locations/vileyka` | проверить работу в Вилейке | Как подтверждается возможность замера и монтажа в Вилейке? | Описать только доказанный маршрут выезда и региональные ограничения. | location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/calculator` | Высокий: дальняя логистика требует evidence. |
| `/locations/nesvizh` | проверить работу в Несвиже | Какие фактические этапы доступны для заказа из Несвижа? | Дать подтверждённую схему удалённого заказа либо явно отметить отсутствие evidence. | remote location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/design-proekt-kuhni` | Высокий: риск фиктивной local landing page. |
| `/locations/berezino` | проверить работу в Березино | Как проверить возможность выезда и монтажа по адресу? | Владеть только подтверждёнными условиями зоны и процесса. | location | eligibility + order path | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/contacts` | Высокий: city-specific evidence absent. |
| `/locations/volozhin` | проверить работу в Воложине | Какие ограничения и этапы действуют для адреса в Воложине? | Показать реальный service path и ограничения без топонимической подстановки. | location | eligibility + logistics path | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/calculator` | Высокий: template overlap; operations evidence required. |
| `/locations/stolbtsy` | проверить работу в Столбцах | Как организован подтверждённый заказ по этому направлению? | Владеть проверенной логистикой и зоной, если они подтверждены владельцем. | location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/contacts` | Высокий: без evidence не имеет самостоятельной ценности. |
| `/locations/uzda` | проверить работу в Узде | Входит ли адрес в зону и как проходит заказ? | Публиковать only verified zone/order facts; отсутствие фактов остаётся явным gap. | location | zone eligibility check | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/calculator` | Высокий: template overlap and evidence gap. |
| `/locations/cherven` | проверить работу в Червене | Какие подтверждённые этапы доступны для адреса в Червене? | Отличаться фактическим маршрутом и ограничениями, а не названием города. | location | eligibility + order path | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/contacts` | Высокий: unique local value not evidenced. |
| `/locations/maryina-gorka` | проверить работу в Марьиной Горке | Как проверить зону выезда и условия монтажа? | Зафиксировать подтверждённую зону, логистику и owner-reviewed next step. | location | zone/logistics explorer | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations/minskaya-oblast`; `/delivery-installation`; `/calculator` | Высокий: шаблонность и отсутствие local proof. |
| `/locations/kletsk` | проверить работу в Клецке | Как подтверждается возможность заказа из Клецка? | Владеть только доказанным remote-order process и ограничениями. | remote location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/contacts` | Высокий: дальняя зона и local claims требуют evidence. |
| `/locations/kopyl` | проверить работу в Копыле | Какие фактические условия действуют для заказа из Копыля? | Показать owner-reviewed service path или честно зафиксировать gap. | remote location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/calculator` | Высокий: самостоятельная ценность не подтверждена. |
| `/locations/krupki` | проверить работу в Крупках | Входит ли адрес в рабочую зону и каков следующий шаг? | Дать проверяемый eligibility answer и реальный процесс, не generic city copy. | location | zone eligibility check | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/contacts` | Высокий: evidence missing; шаблонный overlap. |
| `/locations/lyuban` | проверить работу в Любани | Как подтверждается возможность замера, доставки и монтажа? | Владеть доказанной удалённой логистикой и ограничениями. | remote location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/calculator` | Высокий: remote claims require evidence. |
| `/locations/myadel` | проверить работу в Мяделе | Какие этапы доступны для удалённого заказа из Мяделя? | Показать подтверждённый процесс и service boundaries без выдуманного офиса. | remote location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/contacts` | Высокий: удалённая локация, evidence absent. |
| `/locations/starye-dorogi` | проверить работу в Старых Дорогах | Как проверить возможность выезда и монтажа по адресу? | Дать city-specific verified eligibility и ограничения или evidence gap. | remote location | zone eligibility check | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/calculator` | Высокий: no unique facts confirmed. |
| `/locations/gomel` | проверить дальний заказ в Гомеле | Возможен ли подтверждённый заказ и как устроена межрегиональная логистика? | Владеть только доказанным remote-order path; не создавать впечатление филиала. | remote regional location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/portfolio/malenkaya-kuhnya-gomel`; `/contacts` | Критический: дальняя зона плюс unverified portfolio case создают двойной claim-risk. |
| `/locations/grodno` | проверить дальний заказ в Гродно | Какие подтверждённые условия действуют для межрегионального заказа? | Показать доказанный service path и ограничения без фиктивного локального присутствия. | remote regional location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/portfolio/kuhnya-s-ostrovom-grodno`; `/contacts` | Критический: remote service и portfolio provenance оба требуют evidence. |
| `/locations/brest` | проверить дальний заказ в Бресте | Как проходит подтверждённый заказ между Минском и Брестом? | Владеть фактической межрегиональной логистикой и owner-reviewed границами. | remote regional location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/portfolio/pryamaya-kuhnya-dlya-studii-brest`; `/contacts` | Критический: unverified дальняя зона и project case. |
| `/locations/vitebsk` | проверить дальний заказ в Витебске | Возможны ли замер и монтаж и на каких подтверждённых условиях? | Дать verified remote path, не обещая филиал, сроки или цену без источника. | remote regional location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/portfolio/neoklassicheskaya-kuhnya-vitebsk`; `/contacts` | Критический: remote claims + portfolio provenance gap. |
| `/locations/mogilev` | проверить дальний заказ в Могилёве | Как подтверждается возможность межрегионального заказа? | Показать только owner-verified service route и ограничения. | remote regional location | remote-order journey | `INDEX_EXISTING; EVIDENCE_GATE` | operations owner + location editor | `/locations`; `/delivery-installation`; `/portfolio/kuhnya-do-potolka-mogilev`; `/contacts` | Критический: remote claims + unverified case; city slug is not evidence. |

## Evidence backlog и ownership decisions

- Search Console query/page export и live Google/Яндекс SERP не предоставлены: все primary-intent и overlap decisions являются проверенными редакционными гипотезами, но не оценкой спроса или позиций.
- 31 location URL требуют operations evidence; до него городские promises остаются conditions-to-prove, а не локальными claims.
- 13 portfolio detail URL требуют business + media provenance review; generated record, DB status, путь или город в slug не доказывают реальный объект.
- Pricing claims принадлежат pricing owner; warranties/terms — business/legal owner; material/brand/spec claims — technical owner.
- Ни один facet URL не добавлен. Все 112 строки используют только canonical inventory production sitemap.
