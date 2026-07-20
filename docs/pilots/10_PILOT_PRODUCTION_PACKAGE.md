# Production-пакет трёх пилотов: data/provenance gate

Статус: `BRIEFS_READY / NO_RUNTIME_ASSETS`
Дата: 2026-07-20

Документ продолжает `design/11-media-transition-production-map.md`. Он описывает production-пакет, но не разрешает генерацию, подключение или публикацию. До отдельного принятия generation scope все слоты остаются планом, а все существующие изображения проходят повторный provenance/rights review.

## Общие правила допуска

- Канонические статусы: `verified_real`, `ai_concept`, `technical_illustration`, `unknown`, `rejected`.
- AI concept не может быть `project_story`, `before_after`, `local_proof` или доказательством цены, срока, гарантии, отзыва, бренда или характеристики.
- Для реального проекта нужны владелец проекта, два независимых `evidenceRefs`, подтверждённый media set и `rightsStatus=approved`. Для локального proof нужен exact-city источник.
- `LIVE`, `CONNECTED`, наличие PNG/WebP/AVIF, имя города/файла, реалистичность и запись в БД не являются evidence.
- До принятия scope: generation не выполняется; runtime asset paths не меняются; fallback остаётся текстовым.

## Пилот 1 — `/catalog/uglovye-kuhni`

Пользовательский путь: «Подойдёт ли угловая планировка?» → увидеть форму → выбрать рабочую зону → сравнить варианты хранения → получить ориентир состава/следующий шаг. Страница — каталог/идея; real project proof не обещается.

| Slot / series | Что проверяет пользователь | Brief до imagegen (не запускать) | altRu / captionRu | provenance / rights | Delivery и fallback |
| --- | --- | --- | --- | --- | --- |
| `AK-OV-01` `overview` hero | Как читаются две стены и угол? | Одна нейтральная светлая угловая кухня, две стены, постоянная геометрия и техника, вертикаль 3:4, мягкий дневной свет, без брендов/текста | «Светлая угловая кухня с двумя рабочими сторонами» / «AI-концепт планировки, не фотография реализованного объекта.» | `ai_concept`; `rightsStatus=internal_generation_pending` | master PNG в проекте; WebP primary, AVIF optional, intrinsic 900×1200; при ошибке — текстовый ответ и схема угла |
| `AK-OV-02..03` `overview` angles | Что меняется при взгляде с длинной/короткой стороны? | Continuity той же кухни, два ракурса, меняется только камера, landscape 3:2 | русские описания ракурса / AI concept | `ai_concept`; rights pending | WebP/AVIF lazy; empty — кнопочная текстовая «Длинная сторона / Короткая сторона» |
| `AK-LY-01..02` `layout_logic` zones | Где хранение, мойка и рабочая поверхность? | Техническая нейтральная схема сверху и фронтальный вид без размеров и claims, 16:9 | «Схема рабочих зон угловой кухни» / «Техническая иллюстрация для объяснения зон.» | `technical_illustration`; rights pending | WebP, не использовать как фото; error — HTML-таблица зон |
| `AK-ST-01..02` `storage_zone` comparison | Как использовать сложный угол? | Одна continuity-серия: закрытый фасад и открытая зона хранения, без бренда и числовых характеристик, 3:2 | «Угловая зона хранения с открытым фасадом» / «AI-концепт сценария хранения.» | `ai_concept`; rights pending | WebP/AVIF; empty — нейтральное сравнение «полка / выдвижной модуль» без обещания комплектации |
| `AK-ME-01` `hardware_action` mechanism | Что происходит при открывании? | Технический cutaway без логотипа, условные детали, последовательность 2 кадров | «Схема открывания углового модуля» / «Техническая иллюстрация, не спецификация бренда.» | `technical_illustration`; rights pending | WebP; error — пошаговый текст |

Rights: до приёмки владельцем все новые masters и производные `internal_generation_pending`; использовать только после фиксации лицензии/владельца и хеша. `realProjectId=null`.

## Пилот 2 — `/locations/borisov`

Пользовательский путь: «Как проходит заказ в Борисове?» → понять последовательность → проверить, какие условия нужно уточнить → оставить заявку с городом. AI-изображения здесь только process/idea; локальный проект и локальные условия не заявляются.

| Slot / series | Вопрос | Brief до imagegen (не запускать) | altRu / captionRu | provenance / rights | Delivery и fallback |
| --- | --- | --- | --- | --- | --- |
| `BR-PR-01` `process_step` hero | Какие этапы нужно пройти? | Нейтральная кухня и лист с условной схемой «заявка → проект», без адреса, вывески, людей и брендов, 3:4 | «Иллюстрация пути от заявки к проекту кухни» / «AI-концепт процесса; не доказательство работы в Борисове.» | `ai_concept`; rights pending | WebP/AVIF; при ошибке — вертикальный список этапов |
| `BR-PR-02..04` `process_step` | Что обсуждают на замере, проекте и согласовании? | Три отдельные технические иллюстрации, без сроков/стоимости/адреса, 3:2, единая палитра | «Иллюстрация обсуждения размеров кухни» / «Техническая иллюстрация этапа заказа.» | `technical_illustration`; rights pending | WebP lazy; empty — доступные текстовые шаги |
| `BR-PR-05` `local_proof` | Есть ли подтверждённый объект именно в Борисове? | Не генерировать. Slot заблокирован до exact-city evidence и rights | «Подтверждённый проект в Борисове» / не показывать до gate | `unknown` → `verified_real` только после gate; `rightsStatus=blocked` | Не подключать; fallback «Подтверждённые локальные примеры будут добавлены после проверки.» |
| `BR-PR-06` `overview` idea | Как может выглядеть выбранный вариант? | Нейтральная концептуальная кухня без Борисовских признаков, 3:2 | «Концепция кухни для обсуждения решения» / «AI-концепт, не выполненный объект.» | `ai_concept`; rights pending | WebP; error — карточка без изображения |

Нельзя выводить из URL или media: филиал, адрес, локальную команду, доставку, срок, цену, гарантию или факт монтажа. Evidence owner для этих claims — операционный владелец/руководитель продаж; до предоставления документов поля blocked.

## Пилот 3 — `/materials/mdf-fasady`

Пользовательский путь: «Как ведёт себя МДФ-фасад?» → рассмотреть поверхность → сравнить матовый/глянцевый сценарий → понять ограничения ухода → перейти к расчёту или заявке. Страница — material comparator, не portfolio.

| Slot / series | Вопрос | Brief до imagegen (не запускать) | altRu / captionRu | provenance / rights | Delivery и fallback |
| --- | --- | --- | --- | --- | --- |
| `MF-SU-01` `material_surface` hero | Как выглядит поверхность МДФ крупным планом? | Нейтральный фасад МДФ без бренда и конкретного производителя, мягкий боковой свет, макро 4:3 | «Крупный план матового фасада МДФ» / «AI-концепт фактуры; оттенок уточняется по образцу.» | `ai_concept`; rights pending | WebP/AVIF, intrinsic 1200×900; error — текстовая характеристика без цвета |
| `MF-SU-02..03` `material_surface` | Чем отличаются матовый и глянцевый варианты? | Одна панель, два finish-варианта, одинаковый свет и фон, без чисел и claims, 3:2 | «Матовая поверхность фасада МДФ» / «Концептуальное сравнение покрытия.» | `ai_concept`; rights pending | WebP lazy; empty — таблица сравнения текстом |
| `MF-CM-01` `style_variants` | С чем сочетать МДФ? | Фасад + нейтральная столешница/стена, без названий брендов и гарантии цвета, 3:2 | «Фасад МДФ в нейтральном сочетании» / «AI-концепт сочетания материалов.» | `ai_concept`; rights pending | WebP; fallback — список допустимых сочетаний без визуального обещания |
| `MF-TE-01` `technical_illustration` | Где кромка и что нужно уточнить? | Условный технический разрез фасада с кромкой, без размеров и нормативных claims, 16:9 | «Схема слоёв фасада МДФ» / «Техническая иллюстрация, не паспорт изделия.» | `technical_illustration`; rights pending | WebP/AVIF; error — доступный текстовый разрез |
| `MF-PR-01` `project_story` | Есть ли реальный проект с этим фасадом? | Не генерировать. Только evidence-approved project media с material confirmation | «Реальный проект с фасадами МДФ» / показывать только после gate | `unknown` → `verified_real`; `rightsStatus=blocked` | Не подключать; fallback — «Реальные примеры публикуются после подтверждения источника.» |

Характеристики, уход, бренды, цена за метр и гарантия требуют evidence owner из технического/закупочного и коммерческого контуров; концепт не подтверждает эти поля.

## Delivery contract для всех пилотов

Для каждого принятого slot: master сохраняется в проекте, рядом создаются WebP и при наличии pipeline AVIF; visible `src` — WebP/AVIF, PNG/JPEG только master/fallback. Нужны `mediaId`, `seriesId`, `viewRole`, `interactionRole`, `altRu`, `captionRu`, `provenanceStatus`, `rightsStatus`, `generationBriefId`, `allowedRoutes[]`, `forbiddenClaims[]`, lifecycle status и проверка `naturalWidth>0`/HTTP 200. При loading показывается reserved box, при empty — русский текстовый fallback, при error — та же смысловая информация и обычные ссылки.

## Transition Registry (план, не подключать)

| fromRoute | fromState | userQuestion | actionType | anchorRu | target | reason | contextPatch | fallback | analytics event |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/catalog/uglovye-kuhni` | `SELECTED:corner` | «Как использовать угол?» | `DEEPEN` | «Изучить варианты углового хранения» | `/catalog/uglovye-kuhni#storage` | Продолжает выбранную зону тем же интентом | `{layout:"corner",sourceRoute:"/catalog/uglovye-kuhni"}` | `/catalog/uglovye-kuhni` + текстовая секция | `pilot_transition_click` |
| `/catalog/uglovye-kuhni` | `COMPARE` | «Чем сравнить угловую планировку?» | `COMPARE` | «Сравнить с прямой кухней» | `/catalog/pryamye-kuhni` | Ближайшая пространственная альтернатива | `{layout:"straight",lastMeaningfulAction:"compare"}` | `/catalog` | `pilot_transition_click` |
| `/catalog/uglovye-kuhni` | `PROOF` | «Где увидеть честный пример?» | `PROOF` | «Посмотреть идеи кухонь» | `/catalog` | Нет approved real project в текущем gate | `{evidencePreference:"ideas"}` | `/catalog/uglovye-kuhni` | `pilot_transition_click` |
| `/catalog/uglovye-kuhni` | `DECISION` | «Что делать дальше?» | `CONVERT` | «Получить предварительный расчёт» | `/calculator` | Расчёт без обещания финальной цены | `{layout:"corner",sourceRoute:"/catalog/uglovye-kuhni"}` | `/prices` | `pilot_transition_click` |
| `/locations/borisov` | `EXPLORE` | «Как проходит заказ?» | `DEEPEN` | «Разобрать этапы заказа» | `/locations/borisov#process` | Объясняет процесс без локального claim | `{location:"borisov",lastMeaningfulAction:"process"}` | `/locations/borisov` | `pilot_transition_click` |
| `/locations/borisov` | `COMPARE` | «Какие условия нужно уточнить?» | `COMPARE` | «Сравнить варианты комплектации» | `/prices` | Переводит к проверяемым параметрам, не к обещанию цены | `{location:"borisov",budgetIntent:"уточнить"}` | `/calculator` | `pilot_transition_click` |
| `/locations/borisov` | `PROOF` | «Есть локальный реальный проект?» | `PROOF` | «Проверить подтверждённые проекты» | `/portfolio` | Target допустим только для approved records; иначе honest fallback | `{location:"borisov",evidencePreference:"real"}` | `/locations/borisov#local-proof` | `pilot_transition_click` |
| `/locations/borisov` | `DECISION` | «Как оставить запрос?» | `CONVERT` | «Оставить заявку на кухню» | `/calculator` | Сохраняет город без claims о сроке/стоимости | `{location:"borisov",sourceRoute:"/locations/borisov"}` | `/locations/borisov` | `pilot_transition_click` |
| `/materials/mdf-fasady` | `SELECTED` | «Как выглядит поверхность?» | `DEEPEN` | «Рассмотреть фактуру МДФ» | `/materials/mdf-fasady#surface` | Углубляет текущий material question | `{materials:["mdf"],lastMeaningfulAction:"surface"}` | `/materials/mdf-fasady` | `pilot_transition_click` |
| `/materials/mdf-fasady` | `COMPARE` | «Чем сравнить МДФ?» | `COMPARE` | «Сравнить МДФ и HPL» | `/materials/plastik-hpl` | Ближайшая material альтернатива | `{materials:["mdf","hpl"]}` | `/materials` | `pilot_transition_click` |
| `/materials/mdf-fasady` | `PROOF` | «Есть реальный пример?» | `PROOF` | «Посмотреть подтверждённые работы» | `/portfolio` | Только если найден material-confirmed case; иначе не показывать | `{materials:["mdf"],evidencePreference:"real"}` | `/materials/mdf-fasady#proof` | `pilot_transition_click` |
| `/materials/mdf-fasady` | `DECISION` | «Как узнать стоимость?» | `CONVERT` | «Перейти к предварительному расчёту» | `/calculator` | Цена зависит от размеров и комплектации | `{materials:["mdf"],sourceRoute:"/materials/mdf-fasady"}` | `/prices` | `pilot_transition_click` |

`target` в этой таблице не означает, что ссылка уже добавлена в UI. Перед подключением каждый target проходит page gate, evidence check и regression protected routes. Переход к `/materials/furnitura` не добавляется: это защищённая страница и не входит в scope.
