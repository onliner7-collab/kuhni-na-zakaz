# L0 — SEO, перелинковка и production-readiness

Дата проверки: 2026-08-10
Scope: `/locations`, `/locations/soligorsk`, `/locations/fanipol`, `/locations/gomel`.

## Technical SEO

- Canonical URL, metadata и JSON-LD существующих location routes не переписывались.
- На каждом пилоте сохранён единственный серверный `h1`; visual explorer остаётся ограниченным client island.
- `pnpm run sitemap:check`: PASS, 112 URL; локальная PostgreSQL недоступна, поэтому проверен штатный static fallback.
- `pnpm run seo:check`: PASS.
- `pnpm run build`: PASS, 127 статических страниц.
- Новые runtime-изображения существуют в WebP и AVIF; PNG используется только как master и не подключён в UI.
- `pnpm run images:audit`: broken 0, oversized 0, bad names 0.

## On-page и доступность

- Вопрос, обещание, названия состояний, последствия, alt-тексты и disclosure написаны по-русски.
- Disclosure не выдаёт AI-концепции за выполненные проекты.
- Все четыре состояния каждого пилота меняют видимый `currentSrc`; кадр сохраняет фиксированную геометрию.
- Управление работает мышью, касанием и клавиатурой (`ArrowLeft`, `ArrowRight`, `Home`, `End`); выбранное состояние отражено через `aria-selected`.
- Reduced motion и фокус проверены Playwright.
- Lighthouse local: Performance 99–100, Accessibility 97, SEO 100, CLS 0, TBT 0.

## Внутренняя перелинковка

- В каждом состоянии есть два обычных crawlable `href`: 24 ссылки, 9 уникальных целевых маршрутов.
- Все 9 целей присутствуют в `public/sitemap-static.xml`; отсутствующих целей нет.
- Ссылки меняются вместе с намерением пользователя и не ведут обратно на текущий location route.
- `/locations` сохраняет серверный список всех городов внутри native `details`, поэтому маршруты доступны без выполнения JavaScript.
- Related rail сохранён после visual journey.

## Защищённые маршруты

Page-specific runtime не менялся для `/`, `/design-proekt-kuhni`, `/locations/minsk`, `/locations/minskaya-oblast`, `/locations/borisov`, `/materials/furnitura`. Локальная regression matrix: 6/6 PASS.

## Решение до production

`LOCAL_ACCEPTED`. Production-статус будет присвоен только после scope commit, push, штатного deploy и live smoke targets/protected/media/sitemap/robots.
