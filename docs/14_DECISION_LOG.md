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
