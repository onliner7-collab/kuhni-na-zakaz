# Decision Log

## 2026-07-13 — этап 1: документационный baseline

- **Решение:** не менять production-код, URL, SEO, UI, формы или media.
- **Причина:** текущий этап создаёт только архитектурный фундамент.
- **Альтернативы:** немедленный рефакторинг отклонён.
- **Затронутые файлы:** `AGENT.md`, `docs/00_*`–`docs/15_*`.
- **Риски:** документация может устареть; код всегда перепроверяется.
- **Rollback:** восстановить документационные файлы из предыдущего commit.
- **Статус:** принято.

## 2026-07-13 — страницы не удаляются автоматически

- **Решение:** все 112 canonical URL сохраняются до отдельной матрицы и redirect plan.
- **Причина:** защита поискового спроса, ссылок и пользовательских путей.
- **Альтернативы:** массовая консолидация отклонена.
- **Риски:** существующая каннибализация остаётся до анализа.
- **Rollback:** не требуется.
- **Статус:** принято.

## 2026-07-13 — пилоты до масштабирования

- **Решение:** сначала три пилота и совместный аудит; компоненты появляются только по подтверждённой потребности.
- **Причина:** проверить уникальность, UX, JS и media contract на реальных страницах.
- **Альтернативы:** абстрактная библиотека и массовая переработка отклонены.
- **Риски:** текущий код уже содержит pilot implementations; этап 2 начинает с reverse-audit.
- **Rollback:** не менять существующий pilot code в документационном этапе.
- **Статус:** принято с зафиксированным расхождением baseline.

## 2026-07-13 — медиасистема

- **Решение:** проектирование до генерации; короткие видео/изображения вместо тяжёлого 3D; masters + AVIF/WebP; real/AI provenance обязателен.
- **Причина:** скорость и достоверность.
- **Альтернативы:** WebGL-first и массовая генерация отклонены.
- **Риски:** старые assets не имеют полного provenance.
- **Rollback:** новые media не подключать до manifest/QA.
- **Статус:** принято.

## 2026-07-13 — mobile-first и handoff

- **Решение:** 360–412 px — основной contract; каждый чат обновляет registry, Decision Log и Handoff.
- **Причина:** мобильная версия — основной продукт, а проект продолжается между чатами.
- **Альтернативы:** desktop-first и chat-only state отклонены.
- **Риски:** выявленные targets 40–42 px остаются долгом до разрешённого UI-этапа.
- **Rollback:** документационное правило можно изменить только отдельным решением.
- **Статус:** принято.

## 2026-07-13 — этап 2 начинается с reverse-audit существующих пилотов

- **Решение:** существующие pilot implementations не считаются автоматически утверждённым target design; сохранить работающие contracts, а target state описать отдельно.
- **Причина:** код содержит Angular/Borisov/Hardware pilot branches, созданные до нового Master Plan.
- **Проверенный код:** `app/catalog/[slug]/page.tsx`, `app/locations/[city]/page.tsx`, `app/materials/furnitura/page.tsx`, pilot components/data/media.
- **Расхождение документации и кода:** Master Plan называет пилоты будущими этапами, но production code уже реализован. Source of truth для current state — код; stage docs задают будущий contract.
- **Rollback:** удалить только `docs/pilots/*` и восстановить registry/log/handoff из commit этапа 1; production code не затронут.
- **Статус:** принято.

## 2026-07-13 — три разные модели взаимодействия

- **Решение:** Angular = пространственный `CornerStorageExplorer`; Borisov = временной `ProductionJourney`; Hardware = причинно-механический `HardwareCabinetExplorer`.
- **Причина:** одинаковый hero/sequence с заменой текста не создаёт уникального продукта.
- **Расхождение кода:** текущие Angular и Borisov используют близкий full-screen hero pattern; Hardware визуально отличается.
- **Риск:** общие primitives могут незаметно вернуть одинаковую композицию.
- **Контроль:** uniqueness failure test в `docs/pilots/07_PILOT_UNIQUENESS_MATRIX.md`.
- **Статус:** принято.

## 2026-07-13 — furnitura gallery не монтируется целиком

- **Решение:** legacy gallery остаётся источником/архивом, но target initial DOM ограничивается 8–12 thumbnails; остальные категории монтируются по intent.
- **Причина:** проверено 201 registry item, 203 image elements, 220 buttons, 2894 DOM elements и 55–60 тыс. px mobile page height.
- **Альтернатива:** оставить 201 lazy image отклонено; lazy network не устраняет DOM/a11y/layout cost.
- **Rollback:** будущая реализация сохраняет legacy registry и может вернуть category view без повторной генерации.
- **Статус:** принято.

## 2026-07-13 — schema должна совпадать с visible content

- **Решение:** Angular/Borisov FAQPage не переносится автоматически: будущая реализация либо показывает exact FAQ, либо удаляет schema отдельным SEO change.
- **Причина:** current pilot branches получают FAQ JSON-LD из data, но не выводят видимый FAQ.
- **Дополнительно:** Borisov Service/Offer/provider address и Furnitura Article/ImageObject scope требуют evidence/role review; на этапе 2 ничего не меняется.
- **Статус:** принято, открыто для реализации.

## 2026-07-13 — media plan до генерации

- **Решение:** этап 3 получает 33 planned media groups: Angular 9, Borisov 12, Hardware 12.
- **Причина:** storyboard, consistency, provenance и load contract должны быть утверждены до prompts/generation.
- **Ограничение:** существующие media не получают `MEDIA_READY`; финальные images в этапе 2 не генерируются.
- **Статус:** принято.

## 2026-07-13 — публикация документации этапа 2

- **Решение:** по прямому финальному указанию пользователя выполнить deploy отдельного docs-only commit после проверок; runtime code/media/SEO/UI не менять.
- **Причина:** ТЗ внутри этапа запрещает внедрение/deploy production changes, но пользователь отдельно потребовал deploy после завершения. Публикуется только документация; сайт функционально не перерабатывается.
- **Риск:** production deploy pipeline выполнит стандартную сборку без runtime diff.
- **Rollback:** вернуть ветку `work` к предыдущему commit через отдельный revert docs commit; не использовать destructive reset.
- **Статус:** принято как явно запрошенная операция передачи состояния.

## 2026-07-14 — runtime media path и library path разделены

- **Решение:** manifests и архитектурная структура живут в корне проекта, а реальные delivery-файлы Next.js — в `artifacts/kuhni-na-zakaz/public/media/pilots`; новые masters сохраняются вне public в `prepared-images/generated-sources/pilots`.
- **Причина:** корневой `public` не является runtime public-dir приложения; дублировать тяжёлые binaries запрещено.
- **Расхождение:** ТЗ перечисляет `/public/media`, а проверенный runtime находится глубже. Обе структуры созданы, но binaries размещаются только в фактическом runtime path.
- **Rollback:** revert stage-3 commit.
- **Статус:** принято.

## 2026-07-14 — legacy pilot assets не получают ready автоматически

- **Решение:** 33 существующих master/AVIF/WebP family прошли contact-sheet и dimension review; 23 зарегистрированы, 10 оставлены `REVIEW_REQUIRED` из-за ratio/crop.
- **Причина:** документация этапа 2 прямо запрещает считать существующие файлы готовыми без asset-level QA.
- **Контроль:** status history, hashes и точные paths находятся в manifests v2.
- **Статус:** принято.

## 2026-07-14 — scope 203 изображений фурнитуры

- **Решение:** число 203 трактуется как подтверждённый исходный DOM: 201 legacy gallery records + hero + initial hinge state. Остальные pilot state files отдельно входят в target manifest, но не подменяют этот audit count.
- **Результат:** 203 записи классифицированы; 0 удалений; 0 точных дублей; у 203 provenance `SOURCE_UNKNOWN` до доказательств.
- **Статус:** принято.

## 2026-07-14 — ограниченная генерация тестовых вариантов

- **Решение:** после утверждения 33-group media map создано четыре новых revision только для critical Angular hero; три выбраны и оптимизированы, один отклонён из-за псевдомаркировки техники.
- **Причина:** выполнить variant review без массовой генерации сотен файлов.
- **Ограничение:** новые assets не подключены; target status не выше `REGISTERED`.
- **Статус:** принято.

## 2026-07-14 — deploy этапа 3

- **Решение:** по прямому указанию пользователя выполнить стандартный deploy отдельного stage-3 commit.
- **Scope:** docs, manifests, scripts, unconnected media variants; runtime pages/components/SEO/forms/Prisma не меняются.
- **Rollback:** отдельный revert stage-3 commit и стандартный deploy ветки `work`.
- **Статус:** принято.

## 2026-07-14 — побочный content import в deploy baseline 19ac6ab

- **Факт:** `minimalizm` и `skandinavskie` получили только новый `updatedAt`; URL, image, alt/caption, тексты и SEO не изменились. Дополнительно 36 опубликованных portfolio cases получили `order +36` и новый `updatedAt`; остальные поля не изменились.
- **Причина:** два миграционных importer запускались при каждом deploy; первый делал безусловный update, второй назначал существующим cases новый order от текущего максимума.
- **Решение:** обычный deploy пропускает imports. Они запускаются только с `RUN_CONTENT_IMPORTS=1`; importers сравнивают payload, сохраняют существующий order, а prepared-photo importer не заменяет непустую каноническую project-folder gallery.
- **Доказательство:** `docs/audit/2026-07-14-stage-4-content-import-audit.md` содержит backup/current comparison, полный список 36 cases и production rerun: 0 updated, одинаковый SHA-256 до/после `5b5c9e…6b0`.
- **Rollback:** вернуть guard/importer commit отдельным revert; данные автоматически не откатывать без отдельного решения владельца.
- **Статус:** принято; post-deploy zero-drift check выполнен на `791f245`.

## 2026-07-14 — область duplicate check этапа 3

- **Решение:** формулировка `0 exact duplicates` всегда сопровождается scope: 306 файлов `media/pilots` + furnitura v2, SHA-256.
- **Причина:** site-wide audit проверял около 1008 public files и нашёл 47 exact groups; это другой набор.
- **Статус:** принято; site-wide 47 groups остаются долгом этапа 9.

## 2026-07-14 — Component Library изолирована от production pilots

- **Решение:** shared/specialized components находятся в `components/pilots/library`; единственный consumer этапа 4 — dev preview, закрытый production 404.
- **Причина:** сначала проверить API, mobile, a11y и intent-loading без замены работающих пилотных страниц.
- **Media:** только `REGISTERED`; остальное — текстовый fallback. Hardware archive 203 не передаётся компонентам.
- **Статус:** принято как `ISOLATED_TESTED`, не `IMPLEMENTED` на pilot pages.

## 2026-07-14 — адресное подключение Angular stage 5

- **Решение:** подключить stage-4 primitives только к `/catalog/uglovye-kuhni`; route/page остаются Server Components, один `AngularStage5Interactive` оркестрирует связанные selections.
- **Причина:** тип угла, механизм, материал и размеры должны передаваться в существующую форму согласованным structured state без превращения всей страницы в Client Component.
- **SEO:** hidden FAQPage schema удалена, потому что видимого exact FAQ нет; canonical, BreadcrumbList, Product и ImageObject сохранены.
- **Dock:** используется единственный существующий global `MobileBottomNav` с exact Angular config; второй fixed `ContextDock` запрещён как конфликтующая дублирующая навигация.
- **Media:** 10 новых imagegen masters сохранены в проекте; 24 connected assets прошли production QA и повышены до `LIVE`; 48 WebP/AVIF URL получили HTTP `200`.
- **Rollback:** revert итогового stage-5 commit; content imports и Prisma migration отсутствуют.
- **Статус:** принято и проверено на production `fd4287b`; service active, target Playwright 13 pass + 1 expected desktop skip.
## 2026-07-15 — единая Lead-модель и Telegram как рабочее место

- **Решение:** сайт и бот пишут в одну Lead-модель; `/admin/leads` остаётся read-only fallback.
- **Получатели:** Дмитрий (`344649719`, owner) и Александр (`1349736681`, manager), каждый в личном чате.
- **Коммуникация:** только текст и ссылки; файлы в формах и боте отключены, WhatsApp/Viber пока отсутствуют.
- **Deep link:** одноразовый hash-only токен, TTL 24 часа; при нескольких активных заявках клиент выбирает нужную.
- **Надёжность:** DB outbox + systemd timer; форма успешна после записи Lead независимо от Telegram API.
- **Security:** Telegram token только в server environment; токен, опубликованный в чате, считается скомпрометированным и не используется.
- **Legal:** сохраняется бренд «КухниBY» без публикации личного ФИО владельца; это зафиксированное бизнес-решение, не внешнее юридическое заключение.
- **Status:** `LIVE` с 2026-07-16; backup, миграция, webhook, обе карточки, outbox timer и production UI проверены. Старый токен временно используется по прямому решению владельца и подлежит будущей ротации.

## 2026-07-16 — Product Architecture этапа 4.5

- **Решение:** зафиксировать site-wide продуктовый каркас до дальнейших page implementations; production-код на этапе не менять.
- **Модель:** мобильный цифровой шоурум и образовательный продукт; путь `форма → стиль → назначение → материалы и механизмы → наши работы → цена → заявка`.
- **Документы:** `docs/product/00_PRODUCT_PRINCIPLES.md`–`11_STAGE_REPORT.md`.
- **Статус:** принято.

## 2026-07-16 — каталог и портфолио разделены по доказательности

- **Решение:** `/catalog` показывается пользователю как «Идеи кухонь» и допускает концепты/визуализации. `/portfolio` показывается как «Наши работы» и допускает только подтверждённые реальные объекты.
- **Правило:** всё без подтверждённого происхождения считается идеей/визуализацией; путь файла, DB record и город в названии не являются доказательством.
- **Проверенное расхождение:** `/portfolio` импортирует generated cases; главная называет смешанный блок «Реальные кухни».
- **Действие:** stage 4.5 фиксирует backlog; очистка/переименование выполняется адресно в следующих этапах.
- **Статус:** принято.

## 2026-07-16 — постоянная глобальная навигация в mobile Dock

- **Решение:** целевой Dock имеет постоянный порядок `Выбрать / Цены / Наши работы / Оставить заявку` на всех публичных UI-страницах.
- **Coverage:** включены `/calculator` и legal; исключены `/admin`, `/kapi`, `/robots.txt`, `/sitemap.xml`, `/thanks`, API/route handlers и непользовательские технические поверхности.
- **Контекст:** текущие page-specific наборы полезны, но переносятся в нефиксированный `PageActionRail` и не заменяют global nav.
- **Конверсия:** «Оставить заявку» открывает короткий first-step sheet; действующая Lead/Telegram/outbox модель сохраняется.
- **Плавающая связь:** `FloatingSocialButtons` сохраняется без изменения поведения.
- **Статус:** принято как target Product этапа 5.

## 2026-07-16 — коллизия нумерации этапов

- **Факт:** исторический stage 5 Angular уже live; утверждённое Product ТЗ называет глобальную навигацию этапом 5.
- **Решение:** в новых документах использовать `Product этап 5 — глобальная навигация`; существующую реализацию называть `исторический pilot stage 5`. Product этап 6 начинает с diff-аудита Angular и не переписывает его с нуля.
- **Статус:** принято для однозначного handoff.

## 2026-07-16 — docs-only commit и push

- **Решение:** этап 4.5 фиксируется отдельным docs-only commit и отправляется в `work` без production deploy.
- **Scope gate:** разрешены только `AGENT.md`, перечисленные master/registry/log/handoff docs и `docs/product/*`.
- **Rollback:** отдельный Git revert документационного commit; runtime/data rollback не требуется.
- **Статус:** принято по прямому указанию пользователя.
## 2026-07-17 — Product этап 5: глобальная навигация

- Реализован единый mobile Dock на существующем `MobileBottomNav` в порядке «Выбрать / Цены / Наши работы / Оставить заявку».
- Короткая заявка использует существующий `/kapi/leads` и обязательные имя, телефон и согласие; backend и Telegram/outbox не менялись.
- Breakpoint Dock: до 767 px включительно; с 768 px используется desktop chrome.
- PageActionRail не подключался к пилотным страницам по прямому решению владельца.

## 2026-07-19 — единый пакет ТЗ мобильного интерактивного хаба

- **Решение:** не создавать отдельный шаблон под каждый из 100+ URL. Все routes классифицируются по архетипам, а каждая индексируемая страница получает собственный вопрос, promise, primary interaction, proof и next step.
- **Пакет:** `design/00-TZ-INDEX.md`, `design/06-ux-spec.md`, `design/07-route-matrix.md`, `design/08-content-data-media-contract.md`, `design/09-component-interaction-contract.md`, `design/10-implementation-qa-rollout.md`, `design/11-media-transition-production-map.md`.
- **Факт:** static sitemap содержит 112 canonical URL; route matrix проверена на полное соответствие sitemap: 112/112, без missing/extra routes.
- **SEO policy:** комбинации фильтров не становятся indexable URL по умолчанию; canonical/index/sitemap policy выбирается для каждой выделенной страницы после intent и quality gate.
- **Provenance:** portfolio, отзывы, цены, сроки, гарантии, locations и media требуют подтверждённого evidence; заполненная DB record не считается доказательством.
- **Mobile policy:** baseline 360/390/412 px; one thought/one answer/one action, Dock остаётся единственным fixed mobile navigation.

## 2026-07-19 — защищённый baseline пяти существующих страниц

- **Решение:** не менять пока собственные контент, layout, SEO-роли, медиа и основные интерактивные сценарии `/`, `/design-proekt-kuhni`, `/locations/minskaya-oblast`, `/locations/minsk`, `/materials/furnitura`.
- **Интеграция:** новые страницы и shared-компоненты связываются с ними через crawlable links, global shell/Dock, analytics, lead context и regression QA.
- **Ограничение:** любое page-specific изменение этих маршрутов выносится в отдельное решение и не считается частью текущего rollout.

## 2026-07-19 — медиа-серии и объяснимый граф переходов

- **Решение:** новые изображения создаются не россыпью, а continuity-сериями под media slots, сущности и состояния интерактивности.
- **Навигация:** применяется гибрид hub-and-spoke + silo; Next Best Action имеет тип `DEEPEN / COMPARE / PROOF / CONVERT`, причину, fallback и обычный crawlable URL.
- **Контекст:** выбор пользователя хранится как `ExploreContext`, переносится между связанными страницами и в заявку, но не создаёт автоматически индексируемые facet URL.
- **Пилот:** вместо защищённого `/materials/furnitura` новый material-сценарий проектируется на `/materials/mdf-fasady`.
- **Документ:** `design/11-media-transition-production-map.md`.

## 2026-07-19 — единое главное ТЗ

- **Решение:** создать `design/12-master-tz.md` как основной вход для постановки задач, разработки и приёмки.
- **Состав:** документ объединяет согласованные требования к мобильному интерактивному хабу, уникальности 112 URL, защищённым страницам, новым изображениям, переходам, SEO, этапам и Definition of Done.
- **Приложения:** `design/06-ux-spec.md`–`design/11-media-transition-production-map.md` остаются нормативными и не заменяются кратким главным документом.

## 2026-07-19 — разбиение реализации на 25 чатов

- **Решение:** не выполнять всё ТЗ одним контекстом; использовать `design/13-chat-execution-prompts.md` с малыми route batches и отдельным deploy/production smoke после каждого implementation этапа.
- **Безопасность:** пять защищённых URL входят в regression scope каждого чата; page-specific изменения на них запрещены.
- **SEO-финиш:** отдельный финальный чат выполняет production audit, отправку актуального sitemap и приоритетных URL через Google Search Console и Яндекс Вебмастер только в браузере с ручной авторизацией пользователя.
- **Следующий этап:** Phase 0 source-of-truth sync, затем route/intent audit и provenance review; массовое масштабирование запрещено до трёх эталонных пилотов.
- **Статус:** принято как рабочий implementation contract; production UI и данные этим docs-only изменением не менялись.

## 2026-07-20 — route/intent ownership для 112 canonical URL

- **Решение:** для каждого URL production sitemap зафиксировать один primary intent, один user question, различимый promise, archetype/interaction, текущую index policy, evidence owner, 2–4 crawlable продолжения и overlap risk.
- **Инвентарь:** production `/sitemap.xml` и `public/sitemap-static.xml` содержат по 112 уникальных URL; route/intent audit содержит 112 уникальные строки, `missing = 0`, `extra = 0`, facet URL не добавлены.
- **Index policy:** docs-only этап не меняет runtime `index/follow`, canonical или sitemap. Маркер `EVIDENCE_GATE` означает обязательный следующий review, а не выполненный `noindex`.
- **Location rule:** топоним не считается unique promise. Все 31 location URL требуют owner-reviewed зоны работ, логистики и фактических условий; до evidence локальная ценность остаётся незакрытым риском.
- **Portfolio rule:** все 13 detail URL требуют business/media provenance review. DB record, `published`, путь, slug и город не являются доказательством «Нашей работы».
- **Keyword evidence:** Search Console export и live SERP dataset не предоставлены; объёмы, позиции и окончательное keyword ownership не выдумываются и помечены `GSC/SERP evidence required`.
- **Защищённый baseline:** `/`, `/design-proekt-kuhni`, `/locations/minskaya-oblast`, `/locations/minsk`, `/materials/furnitura` проверены read-only и не изменены.
- **Deploy:** `NO RUNTIME DEPLOY`, потому что изменена только документация, production artifact идентичен текущему runtime и рискованный rebuild/restart не даёт пользовательской ценности.
- **Rollback:** отдельный Git revert документационного commit; database, content imports, assets и service restart не требуются.
- **Статус:** принято как PASS для route/sitemap parity и PASS_WITH_EVIDENCE_GAPS для semantic/evidence completeness.

## 2026-07-20 — data/provenance gate и production-пакет трёх пилотов

- **Канонические статусы:** `verified_real`, `ai_concept`, `technical_illustration`, `unknown`, `rejected`. `process_illustration` нормализуется как подтип technical illustration; старые `verified/ai/technical` — только legacy-алиасы.
- **Evidence rule:** portfolio допускается только при owner-confirmed source, двух независимых evidence refs, exact characteristics/media set и approved rights. Location/local proof дополнительно требует exact-city source. Путь, slug, DB record, `published`, город в имени и реалистичность не считаются evidence.
- **Evidence owners:** операции/продажи — зона работы, доставка, монтаж и сроки; коммерческий владелец — цены; юридический/сервисный владелец — гарантия; CRM-модератор — отзывы; закупки/технический владелец или официальный брендовый источник — бренды и характеристики; владелец проекта + редактор provenance — portfolio.
- **Pilot package:** добавлен `docs/pilots/10_PILOT_PRODUCTION_PACKAGE.md` для `/catalog/uglovye-kuhni`, `/locations/borisov` и `/materials/mdf-fasady`: slots, continuity, briefs, русские alt/caption, rights/provenance, master/WebP/AVIF delivery, fallback и Transition Registry.
- **Gate result:** `BRIEFS_READY / PASS_WITH_EVIDENCE_GAPS`. Angular существующие AI assets не становятся real projects из-за технического `LIVE`; Borisov local proof и MDF real project slots заблокированы до evidence. Новые claims не опубликованы.
- **Prisma:** schema не изменялась. Поля provenance/evidence пока ведутся в contract/registry; опасная миграция не нужна без принятого runtime data model, backup, diff и rollback plan.
- **Защищённые страницы:** пять baseline URL не изменялись; `/materials/furnitura` и его hardware registry не входят в scope.
- **Deploy:** `NO RUNTIME DEPLOY` — изменены только документация и реестры, runtime assets/contract/schema/UI не менялись.
- **Rollback:** отдельный Git revert docs-only commit; DB backup/restore, imports, asset operations и service restart не требуются.

## 2026-07-20 — shared foundation чат 5

- **KEEP:** `PublicChrome`, `MobileBottomNav`, действующие `ContactForm`/`LeadFormSheet`, `FloatingSocialButtons`, существующие galleries и `SwipeGallery` вне Angular pilot.
- **ADAPT:** только consumer `/catalog/uglovye-kuhni`: continuity gallery переведена на `MediaSequence`; Angular selections пишутся в sessionStorage-backed `ExploreContext` и продолжают передаваться через существующий answers event в Lead pipeline.
- **REPLACE:** не выполнялась; page-specific blocks, metadata, canonical, schema и URL сохранены.
- **MOVE/REMOVE:** не выполнялись; второй fixed Dock и facet URL не создавались.
- **Решение:** shared foundation остаётся server-first: rail и registry reader серверные, client boundary ограничен контекстом/медиа/summary. Все transition anchors — обычные href с fallback.
- **Проверки:** typecheck, unit tests, sitemap check, build, Browser QA 360/390/412/768/1440 и пяти protected URL прошли; build сохранил ожидаемые предупреждения недоступной локальной Prisma DB.
- **Rollback:** отдельный revert runtime commit `chat-5-shared-foundation`; затем стандартный deploy script и production smoke. DB/assets/schema rollback не требуется.

## 2026-07-20 — process pilot Borisov и material pilot MDF

- **Решение:** `/locations/borisov` получает 7-step process journey, а `/materials/mdf-fasady` — surface comparator. Оба используют ExploreContext и существующий Lead pipeline.
- **Evidence boundary:** Borisov local proof остаётся `BLOCKED_BY_INPUT`; city/address/zone/price/deadline schema не добавляется. MDF не заявляет technical properties, durability, prices, brands или compatibility.
- **Media:** 11 masters созданы только встроенным Codex imagegen; UI использует WebP 11–49 КБ, русские alt/captions и AI disclosure. Изображения не считаются real project proof.
- **Protected routes:** page-specific content `/`, `/design-proekt-kuhni`, `/locations/minskaya-oblast`, `/locations/minsk`, `/materials/furnitura` не изменяется; furnitura получает только входящий crawlable deep-link с MDF.
- **Rollback:** отдельный `git revert <pilot-commit>`, deploy standard script, smoke двух пилотов и пяти protected URL; Prisma/data rollback не требуется.

## 2026-07-20 — чат 10: gate пилотов и layout batch

- **Pilot gate:** PASS после устранения только блокирующих дефектов provenance, Transition Registry, Lead context и landmarks. Единый global Dock сохранён как нормативный fixed navigation; уникальность обеспечивают page-specific вопросы, интерактивы и server-rendered transitions.
- **Batch:** шесть существующих canonical URL получают одну route-family реализацию, но шесть разных interaction roles и decision models. Angular pilot не копируется.
- **Index policy:** query/facet URL не создаются; canonical и sitemap остаются неизменными.
- **Evidence:** все подключённые batch visuals маркируются как `ai_concept`; ссылки на portfolio не доказывают реальность проекта сами по себе.
- **Protected boundary:** page-specific runtime пяти protected URL не меняется.
- **Scale gate:** следующий route-family чат разрешён только после production smoke текущего commit; массовое автоматическое масштабирование запрещено.

## 2026-07-20 — style и scenario families

- **Scope:** изменены только восемь `/styles/*` и шесть `/scenarios/*` из постановки; protected baseline и комбинационные URL не менялись.
- **Style uniqueness:** каждый style получает собственные visual language, материалы, ограничения, вопрос, сравнение, варианты и `style_variants-*` continuity `seriesId`; замена одного hero не считается реализацией.
- **Scenario uniqueness:** каждый scenario отвечает на отдельное бытовое ограничение, предлагает три приоритета и ведёт к конкретным plan/layout, material и guide URL без обещаний бюджета или вместимости.
- **Evidence:** видимые изображения маркируются как AI-концепты. `PROOF` всегда ведёт в отдельный `/portfolio`; ссылка не повышает provenance конкретного asset.
- **Architecture:** важный текст и четыре перехода остаются server-rendered; клиент хранит только неперсональный ExploreContext в sessionStorage. Facet URL отсутствуют.
- **QA gate:** typecheck, unit, sitemap 112/112, production build и последовательный Playwright 40/40 PASS; widths 360/390/412/768/1440, keyboard, touch targets, metadata/H1/canonical, images, overflow и protected regression проверены.
- **Rollback:** `git revert <style-scenario-commit>`, push `work`, standard deploy, повторить 14-route smoke и пять protected URL. Prisma/schema/import rollback не требуется.
- **Production gate:** commit `a243bddd8bac781575a4378aa18b8f0409d8ed9f` задеплоен; server build 173 pages, service active, production Playwright 40/40 PASS. Точный rollback — `git revert a243bdd`, push `work`, standard deploy и повтор того же batch.

## 2026-07-22 — Visual rescue stages 7–9

- `KEEP`: route shell, canonical/SEO pipeline, ExploreContext, form, transitions и global Dock.
- `ADAPT`: существующий `LayoutVisualExplorer` используется как ограниченный Client island с тремя новыми route-specific series.
- `REPLACE`: две generic media на route заменены шестью continuity states; текстовое переключение без смены изображения больше не считается результатом.
- `MOVE`: длинное объяснение остаётся после visual journey в disclosure.
- Performance decision: initial DOM получает один AVIF; другие состояния появляются только после выбора. PNG masters хранятся как source-only.
- Evidence decision: изображения маркируются `ai_concept`; UI не обещает применимость острова, вместимость маленькой кухни или техническую возможность шкафов до потолка без замера.
- Protected boundary: page-specific код пяти baseline routes не изменялся; shared change принят только после 5/5 regression smoke.
