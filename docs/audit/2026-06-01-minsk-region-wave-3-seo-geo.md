# Волна 3 SEO/GEO внедрения по Минской области

Дата локальной проверки: 2026-06-01  
Проект: `C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/kuhni-na-zakaz`  
Сайт: `https://kuhni.minsk.by`  
Статус: реализовано, проверено локально, задеплоено вместе с волной 2 и проверено на production.

## Созданные страницы

- `/locations/kletsk` — Клецк
- `/locations/kopyl` — Копыль
- `/locations/krupki` — Крупки
- `/locations/lyuban` — Любань
- `/locations/myadel` — Мядель
- `/locations/starye-dorogi` — Старые Дороги

## Что сделано

- Добавлены 6 городов волны 3 в `data/locations.ts`.
- Новые URL подключены к динамическому маршруту `/locations/[city]`, хабам `/locations` и `/locations/minskaya-oblast`, sitemap и внутренним блокам ссылок.
- Для каждой страницы подготовлены уникальные русскоязычные title, description, H1, intro, локальные SEO/GEO-блоки, FAQ, соседние города и ссылки на релевантные категории.
- В `data/kitchen-ideas-3d.ts` добавлены 18 новых 3D-визуализаций, по 3 на город.
- Изображения сохранены в `public/uploads/locations/*-3d/*generated-*-20260601.webp`.
- Все новые визуалы маркируются как `3D-визуализация КухниBY`; alt-тексты на русском, без утверждения о выполненных объектах.
- `public/llms.txt` дополнен URL волн 2 и 3.
- Smoke-тест `tests/smoke/key-pages.spec.ts` расширен шестью URL волны 3.

## Созданные изображения

- `public/uploads/locations/kletsk-3d/` — 3 webp
- `public/uploads/locations/kopyl-3d/` — 3 webp
- `public/uploads/locations/krupki-3d/` — 3 webp
- `public/uploads/locations/lyuban-3d/` — 3 webp
- `public/uploads/locations/myadel-3d/` — 3 webp
- `public/uploads/locations/starye-dorogi-3d/` — 3 webp

Исходные генерации оставлены в `C:/Users/User/.codex/generated_images/019e81d0-330c-7633-8aab-523f4d780159`, проектные копии оптимизированы в webp и сохранены в рабочем проекте.

## Проверки

- `npm run typecheck` — passed.
- `npm run sitemap:check` — passed, 73 URL. Есть предупреждение Prisma: локальная БД `127.0.0.1:5434` недоступна, поэтому динамические URL из базы не подтянулись.
- `npm run build` — passed. Сборка успешна; во время build также есть предупреждения Prisma из-за недоступной локальной БД.
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3002 npm run smoke:key-pages` — passed, 60/60.
- Playwright desktop `/locations/kletsk`:
  - HTTP 200, один H1.
  - canonical `https://kuhni.minsk.by/locations/kletsk`.
  - 0 изображений без alt.
  - есть бейджи `3D-визуализация КухниBY`.
  - есть ссылки на главную, `/locations`, `/locations/minskaya-oblast`, соседний город, каталог и цены.
  - форма есть, горизонтального overflow нет.
- Playwright mobile `/locations/starye-dorogi`:
  - HTTP 200, один H1.
  - canonical `https://kuhni.minsk.by/locations/starye-dorogi`.
  - 0 изображений без alt.
  - CTA `Рассчитать стоимость` ведет к `#form`.
  - есть ссылки на главную, `/locations`, `/locations/minskaya-oblast`, соседний город, каталог и цены.
  - форма есть, горизонтального overflow нет.

## Skills и MCP

- Использованы skills: `technical-seo-developer`, `geo-content-optimizer`, `keyword-research`, `image-generation-brief`, `imagegen`, `accessibility-performance-qa`, `playwright`.
- Использован Playwright MCP для локальной ручной проверки.
- Web search и docs MCP не использовались: внешняя актуальная проверка и уточнение API не требовались.

## Production и индексация

- Деплой выполнен на production 2026-06-01 через `deploy/scripts/update-production.sh work`.
- Production commit: `65eb4b0`; сервис `kuhni-na-zakaz` активен.
- Production build прошел успешно; Prisma `db push` сообщил, что production БД уже синхронизирована со схемой.
- Проверены production URL волн 2 и 3:
  - `/locations/berezino`
  - `/locations/volozhin`
  - `/locations/maryina-gorka`
  - `/locations/kletsk`
  - `/locations/starye-dorogi`
- Для проверенных production страниц: HTTP 200, один H1, корректный title/description/canonical, 0 изображений без alt, есть маркировка `3D-визуализация КухниBY`, форма доступна, горизонтального overflow нет.
- `https://kuhni.minsk.by/sitemap.xml` — HTTP 200, содержит все URL волн 2 и 3.
- `https://kuhni.minsk.by/llms.txt` — HTTP 200, содержит все URL волн 2 и 3.
- Google Search Console:
  - URL Inspection для `https://kuhni.minsk.by/locations/kletsk`: страница пока не была в индексе Google, запрос на индексирование отправлен и принят.
  - `https://kuhni.minsk.by/sitemap.xml` переотправлен; GSC показал сообщение `Файл Sitemap отправлен`.
- Яндекс Вебмастер: открыта страница авторизации. Отправка sitemap/URL ожидает ручного входа в аккаунт в браузере.

## Остаточные риски

- Новые изображения являются 3D/AI-визуализациями, а не подтвержденными фото выполненных работ. Это явно указано на страницах.
- Для полной проверки динамической части sitemap нужна запущенная локальная БД на `127.0.0.1:5434` или production-среда.
