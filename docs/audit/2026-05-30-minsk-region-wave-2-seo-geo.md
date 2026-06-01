# Волна 2 SEO/GEO внедрения по Минской области

Дата финальной проверки: 2026-05-31  
Проект: `C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/kuhni-na-zakaz`  
Сайт: `https://kuhni.minsk.by`  
Статус: локально реализовано и проверено. Деплой не выполнялся, потому что этап не был явно помечен как деплойный.

## Созданные страницы

- `/locations/berezino` — Березино
- `/locations/volozhin` — Воложин
- `/locations/stolbtsy` — Столбцы
- `/locations/uzda` — Узда
- `/locations/cherven` — Червень
- `/locations/maryina-gorka` — Марьина Горка

## Что сделано

- Добавлены 6 городов волны 2 в `data/locations.ts`.
- Новые URL подключены к динамическому маршруту `/locations/[city]`, общей странице `/locations`, странице `/locations/minskaya-oblast`, sitemap и внутренним блокам ссылок.
- Для каждой страницы подготовлены уникальные русскоязычные title, description, H1, intro, локальные SEO/GEO-блоки, FAQ, соседние города и ссылки на релевантные категории.
- В региональный шаблон добавлена JSON-LD разметка `Service` вместе с существующими `BreadcrumbList` и `FAQPage`.
- В `data/kitchen-ideas-3d.ts` подключены 18 новых фотореалистичных 3D-визуализаций, по 3 на город.
- Изображения сохранены в `public/uploads/locations/*-3d/*generated-*-20260531.webp`.
- Все новые визуалы честно маркируются как `3D-визуализация КухниBY`; alt-тексты на русском, без утверждения о выполненных объектах.
- Для `/uploads/locations/` включена disclosure/watermark-логика через `lib/image-disclosure.ts`.
- Промежуточные отвергнутые `real-photo-*` assets удалены из `public/uploads/locations`.
- Smoke-тест `tests/smoke/key-pages.spec.ts` расширен шестью URL волны 2.

## Проверки

- `npm run typecheck` — passed.
- `npm run sitemap:check` — passed, 67 URL. Есть предупреждение Prisma: локальная БД `127.0.0.1:5434` недоступна, поэтому динамические URL из базы не подтянулись.
- `npm run build` — passed. Сборка успешна; во время build также есть предупреждения Prisma из-за недоступной локальной БД.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 npm run smoke:key-pages` — passed, 48/48.
- Playwright desktop `/locations/berezino`:
  - HTTP 200, один H1.
  - canonical `https://kuhni.minsk.by/locations/berezino`.
  - 0 изображений без alt.
  - новые `generated-*` изображения загружаются через Next Image.
  - 3 бейджа `3D-визуализация КухниBY`.
  - клик `Хочу похожую кухню` ведет к форме с `#form`.
  - горизонтального overflow нет.
- Playwright mobile `/locations/maryina-gorka`:
  - HTTP 200, один H1.
  - canonical `https://kuhni.minsk.by/locations/maryina-gorka`.
  - 0 изображений без alt.
  - есть ссылки на главную, `/locations`, `/locations/minskaya-oblast`, соседний город и каталог.
  - форма есть, горизонтального overflow нет.

## Скриншоты

- `wave2-berezino-desktop-generated-final.png`
- `wave2-maryina-gorka-mobile-generated-final.png`
- Контакт-лист новых project assets: `artifacts/kuhni-na-zakaz/.tmp/wave2-project-generated-contact.jpg`

## Production и индексация

Production-проверка, деплой и отправка в Google Search Console / Яндекс Вебмастер не выполнялись. После деплоя нужно проверить 6 production URL, `sitemap.xml`, canonical и отправить страницы на индексацию.

## Остаточные риски

- Новые изображения являются 3D/AI-визуализациями, а не подтвержденными фото выполненных работ. Это явно указано на страницах.
- Для полной проверки динамической части sitemap нужна запущенная локальная БД на `127.0.0.1:5434` или production-среда.
