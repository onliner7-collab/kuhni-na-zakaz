# Deploy и индексация `/materials/furnitura`

Дата: 2026-06-02

## Статус

Страница `/materials/furnitura` создана и задеплоена в рамках этапа 2.

- Commit: `c23faf4 Add kitchen hardware materials page`.
- Push: `origin/work` успешно обновлен.
- Deploy: выполнен 2026-06-02 через `deploy/scripts/update-production.sh work`.
- Production service: `kuhni-na-zakaz.service` активен после restart.

## Sitemap и robots

- Локально `/materials/furnitura` добавлен в `STATIC_PATHS` файла `artifacts/kuhni-na-zakaz/app/sitemap.ts`.
- `robots.ts` не блокирует `/materials/furnitura`.
- `robots.ts` содержит ссылку на canonical sitemap через `CANONICAL_SITE_URL`.
- Проверка `http://127.0.0.1:3012/sitemap.xml`: URL `https://kuhni.minsk.by/materials/furnitura` присутствует.
- Проверка `http://127.0.0.1:3012/robots.txt`: robots.txt доступен, `/materials/furnitura` не заблокирован.
- Production `https://kuhni.minsk.by/sitemap.xml`: URL `https://kuhni.minsk.by/materials/furnitura` присутствует.
- Production `https://kuhni.minsk.by/robots.txt`: robots.txt доступен, содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`, `/materials/furnitura` не заблокирован.

## Локальная проверка страницы

- `http://127.0.0.1:3012/materials/furnitura` — 200 OK.
- Browser desktop: один H1, canonical корректный, noindex нет, горизонтального overflow нет.
- Browser mobile 390px: один H1, canonical корректный, noindex нет, горизонтального overflow нет.
- Production `https://kuhni.minsk.by/materials/furnitura` — 200 OK.
- Production title: `Фурнитура для кухни на заказ в Минске | Петли, направляющие, доводчики | КухниBY`.
- Production canonical: `https://kuhni.minsk.by/materials/furnitura`.
- Production noindex: нет.
- Production `/materials` содержит ссылку на `/materials/furnitura`.
- Production Browser mobile 390px: один H1, canonical корректный, noindex нет, горизонтального overflow нет.

## Индексация

- Google Search Console:
  - вход выполнен через встроенный браузер под аккаунтом `onliner7@gmail.com`;
  - URL `https://kuhni.minsk.by/materials/furnitura` проверен в live inspection;
  - GSC показал: `URL доступен Google`;
  - GSC показал: `Эту страницу можно проиндексировать`;
  - нажато `Запросить индексирование`;
  - GSC подтвердил: `Отправлен запрос на индексирование`;
  - sitemap `https://kuhni.minsk.by/sitemap.xml` уже добавлен в GSC, статус `Успешно`, дата последней обработки в интерфейсе: 1 июня 2026 г.
- Google Search Console API:
  - попытка отправить sitemap через OAuth API не выполнена, потому что refresh token вернул `invalid_grant`;
  - для обычной страницы не использовался Google Indexing API, так как страница не является `JobPosting` или `BroadcastEvent`.
- Yandex Webmaster:
  - API-доступ через локальный OAuth-токен сработал;
  - host-id: `https:kuhni.minsk.by:443`;
  - URL `https://kuhni.minsk.by/materials/furnitura` отправлен в очередь переобхода, API status `202`, task_id `174ac110-5e6c-11f1-8c0e-b3bde9ad69d3`, quota_remainder `150`;
  - sitemap `https://kuhni.minsk.by/sitemap.xml` уже был добавлен в Yandex Webmaster, API status `409`, error_code `SITEMAP_ALREADY_ADDED`, sitemap_id `39bff829-022b-3e39-884a-527f04d4eb5c`.

Нельзя писать, что страница гарантированно проиндексирована.
