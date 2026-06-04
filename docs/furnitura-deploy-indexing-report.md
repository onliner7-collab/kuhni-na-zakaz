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

---

## Этапы 3-4: deploy, production QA и переобход

Дата обновления: 2026-06-02

### Commit / push / deploy

- Commit: `dcfe48c Add furnitura gallery images and lightbox`.
- Push: `origin/work` успешно обновлен.
- Deploy: выполнен через `deploy/scripts/update-production.sh work` на Timeweb VPS.
- Production build на сервере: успешно.
- Service `kuhni-na-zakaz`: active после restart.

### Production QA

- `https://kuhni.minsk.by/materials/furnitura` — HTTP 200.
- Hero asset `/images/materials-gallery-v2/furnitura/furniture-furnitura-hero-01.webp` — HTTP 200, `image/webp`.
- `https://kuhni.minsk.by/sitemap.xml` — HTTP 200, URL `/materials/furnitura` присутствует.
- `https://kuhni.minsk.by/robots.txt` — HTTP 200, содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`, `/materials` не заблокирован.
- Production HTML содержит галерею и hero-изображение.
- Canonical: `https://kuhni.minsk.by/materials/furnitura`.
- `noindex` не найден.
- Browser production desktop с cache-bust URL: 1 H1, 50 кнопок галереи, 10 категорий, горизонтального overflow нет, console errors 0.
- Production lightbox: открытие по клику, фокус на кнопке закрытия, ArrowRight листает, Esc закрывает и возвращает фокус на миниатюру.
- Browser production mobile 390px: 1 H1, 50 кнопок галереи, горизонтального overflow нет, console errors 0.
- Первичная production-навигация без cache-bust показала stale 404 на старый `_next` chunk `/contacts/page-00558f17e7ce2d91.js`; текущий HTML этот chunk не содержит, актуальный chunk на сервере есть, повторная проверка с cache-bust прошла без ошибок.

### Индексация / переобход

- Google Search Console:
  - property: `sc-domain:kuhni.minsk.by`;
  - URL inspection для `https://kuhni.minsk.by/materials/furnitura` выполнен;
  - GSC показал: `URL есть в индексе Google`;
  - нажато `Запросить индексирование`;
  - GSC подтвердил: `Отправлен запрос на индексирование`, URL добавлен в приоритетную очередь сканирования.
- Yandex Webmaster:
  - API host-id: `https:kuhni.minsk.by:443`;
  - URL `https://kuhni.minsk.by/materials/furnitura` отправлен в очередь переобхода;
  - task_id: `6b8869d0-5e76-11f1-8076-9b1b78fb5add`;
  - quota_remainder: `149`;
  - sitemap `https://kuhni.minsk.by/sitemap.xml` уже добавлен, API вернул `SITEMAP_ALREADY_ADDED`, sitemap_id `39bff829-022b-3e39-884a-527f04d4eb5c`.

Не писать, что страница гарантированно проиндексирована: URL отправлен на переобход/индексацию, sitemap доступен и уже добавлен.

---

## Этап 7: детали, электрика, подсветка и защита

Дата обновления: 2026-06-04

### Commit / push / deploy

- Commit: `11655c6 Add furnitura stage 7 detail images`.
- Push: `origin/work` успешно обновлен.
- Deploy: выполнен через `deploy/scripts/update-production.sh work` на Timeweb VPS.
- Production build на сервере: успешно.
- Service `kuhni-na-zakaz`: active после restart.

### Production QA

- `https://kuhni.minsk.by/materials/furnitura` — HTTP 200.
- `https://kuhni.minsk.by/sitemap.xml` — HTTP 200, URL `/materials/furnitura` присутствует.
- `https://kuhni.minsk.by/robots.txt` — HTTP 200, содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`, `/materials/furnitura` не заблокирован.
- Stage 7 asset `/images/materials-gallery-v2/furnitura/furniture-lighting-led-profile-product-01.webp` — HTTP 200, `image/webp`.
- Browser production desktop: 1 H1, canonical `https://kuhni.minsk.by/materials/furnitura`, noindex нет, 201 изображение контента, 200 кнопок галереи, 50 кнопок этапа 7, отсутствующие alt — 0, горизонтального overflow нет, AI-дисклеймер есть.
- Browser production mobile 390px: 1 H1, 201 изображение, 200 кнопок галереи, отсутствующие alt — 0, горизонтального overflow нет.
- Production lightbox: изображение этапа 7 открывается, фокус попадает на `Закрыть галерею`, Esc закрывает модальное окно и возвращает фокус на исходную миниатюру.
- Console errors: 0; остались только браузерные предупреждения о third-party cookies.

### Индексация / переобход через браузер

- Google Search Console:
  - property: `sc-domain:kuhni.minsk.by`;
  - URL inspection для `https://kuhni.minsk.by/materials/furnitura` выполнен через браузер;
  - GSC показал: `URL есть в индексе Google` и `Эта страница проиндексирована`;
  - нажато `Запросить индексирование`;
  - GSC подтвердил: `Отправлен запрос на индексирование`, URL добавлен в приоритетную очередь сканирования.
- Yandex Webmaster:
  - site: `https://kuhni.minsk.by`;
  - раздел `Индексирование` -> `Переобход страниц` открыт через браузер;
  - URL `https://kuhni.minsk.by/materials/furnitura` отправлен через форму в браузере;
  - новая строка в таблице: статус `В очереди`, отправлена `04.06.2026 9:03`;
  - дневной лимит после отправки: можно отправить еще `148` адресов;
  - раздел `Индексирование` -> `Файлы Sitemap` проверен через браузер;
  - sitemap `https://kuhni.minsk.by/sitemap.xml` есть в блоке добавленных вручную и найденных в `robots.txt`, статус `ок`, последняя загрузка `01.06.2026, 21:06`, число ссылок `96`.

Не писать, что страница гарантированно переиндексирована: URL поставлен в очередь переобхода, Google-запрос отправлен, sitemap доступен и принят в обеих панелях.

---

## Этапы 8-10: schema.org, перелинковка и indexability

Дата обновления: 2026-06-04

### Локальные изменения

- На `/materials/furnitura` добавлены `Article` и 12 `ImageObject`; существующие `BreadcrumbList`, `WebPage`, `FAQPage` сохранены.
- `Product`, fake reviews и rating не добавлялись.
- Усилены входящие ссылки на `/materials/furnitura` со страниц `/`, `/materials`, `/materials/mdf-fasady`, `/materials/ldsp`, `/materials/plastik-hpl`, `/prices`, `/portfolio`, `/design-proekt-kuhni`.
- Sitemap и robots.ts без изменений в коде: `/materials/furnitura` уже есть в `STATIC_PATHS`, robots.txt содержит canonical sitemap и не блокирует страницу.

### Локальная QA

- `http://127.0.0.1:3036/materials/furnitura` — HTTP 200.
- Canonical: `https://kuhni.minsk.by/materials/furnitura`.
- `noindex` не найден.
- Browser desktop: 1 H1, `Article` — 1, `ImageObject` — 12, `FAQPage` — 1, пустых alt — 0, горизонтального overflow нет.
- Browser mobile 390px: 1 H1, 200 кнопок галереи, пустых alt — 0, горизонтального overflow нет.
- `/sitemap.xml` локально — HTTP 200, содержит `https://kuhni.minsk.by/materials/furnitura`.
- `/robots.txt` локально — HTTP 200, содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`.

### Production QA до нового деплоя

- `https://kuhni.minsk.by/materials/furnitura` — HTTP 200.
- Canonical: `https://kuhni.minsk.by/materials/furnitura`.
- `noindex` не найден.
- `https://kuhni.minsk.by/sitemap.xml` — HTTP 200, содержит URL страницы.
- `https://kuhni.minsk.by/robots.txt` — HTTP 200, содержит canonical sitemap.

### Проверки команд

- `pnpm --filter @workspace/kuhni-na-zakaz typecheck` — успешно.
- `pnpm --filter @workspace/kuhni-na-zakaz sitemap:check` — успешно, 75 URL; есть ожидаемые Prisma-предупреждения из-за недоступной локальной БД `127.0.0.1:5434`.
- `pnpm --filter @workspace/kuhni-na-zakaz build` — успешно; есть ожидаемые Prisma-предупреждения из-за недоступной локальной БД, сборка завершилась без ошибки.

Нельзя писать, что страница гарантированно проиндексирована: можно фиксировать только факты проверки, отправки URL/sitemap и доступности production.
