# SEO QA отчет `/materials/furnitura`

Дата обновления: 2026-06-04

## Статус этапов 8-10

Этапы 8, 9 и 10 выполнены локально:

- этап 8: schema.org-разметка страницы усилена и проверена;
- этап 9: внутренняя перелинковка на `/materials/furnitura` усилена с релевантных страниц;
- этап 10: sitemap, robots.txt, canonical и индексируемость проверены локально и на production.

## Этап 8: schema.org

На странице `/materials/furnitura` сохранены существующие `BreadcrumbList`, `WebPage` и `FAQPage`.

Добавлено:

- `Article` для экспертного гайда по фурнитуре;
- `primaryImageOfPage` внутри `WebPage`;
- 12 `ImageObject` для hero и репрезентативных изображений галереи.

Не добавлялось:

- `Product`;
- fake reviews;
- rating / aggregateRating.

Browser QA на `http://127.0.0.1:3036/materials/furnitura`:

- H1: 1;
- canonical: `https://kuhni.minsk.by/materials/furnitura`;
- `noindex`: нет;
- schema types: `BreadcrumbList`, `WebPage`, `Article`, 12 `ImageObject`, `FAQPage`;
- пустых alt у изображений: 0;
- горизонтального overflow: нет.

## Этап 9: внутренняя перелинковка

Добавлены или подтверждены входящие ссылки на `/materials/furnitura`:

- `/` — блок популярных материалов;
- `/materials` — карточка материала;
- `/materials/mdf-fasady` — блок дальнейших ссылок;
- `/materials/ldsp` — блок дальнейших ссылок;
- `/materials/plastik-hpl` — блок дальнейших ссылок;
- `/prices` — блок про влияние комплектации на цену;
- `/portfolio` — CTA-ссылка про петли, направляющие и комплектацию;
- `/design-proekt-kuhni` — блок внутренних ссылок.

Browser QA входящих страниц:

- все перечисленные страницы содержат ссылку на `/materials/furnitura`;
- `noindex` на проверенных страницах не найден;
- горизонтального overflow на проверенных страницах не найден.

## Этап 10: sitemap, robots.txt, canonical, indexability

Локальная проверка `http://127.0.0.1:3036`:

- `/materials/furnitura` — HTTP 200;
- canonical: `https://kuhni.minsk.by/materials/furnitura`;
- `noindex`: нет;
- `/sitemap.xml` — HTTP 200, содержит `https://kuhni.minsk.by/materials/furnitura`;
- `/robots.txt` — HTTP 200, содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`;
- блокировки `/materials/furnitura` в robots.txt не найдено.

Production-проверка до нового деплоя:

- `https://kuhni.minsk.by/materials/furnitura` — HTTP 200;
- canonical: `https://kuhni.minsk.by/materials/furnitura`;
- `noindex`: нет;
- `https://kuhni.minsk.by/sitemap.xml` — HTTP 200, содержит URL страницы;
- `https://kuhni.minsk.by/robots.txt` — HTTP 200, содержит canonical sitemap.

## Запущенные проверки

- `pnpm --filter @workspace/kuhni-na-zakaz typecheck` — успешно.
- `pnpm --filter @workspace/kuhni-na-zakaz sitemap:check` — успешно, 75 URL; есть ожидаемые Prisma-предупреждения из-за недоступной локальной БД `127.0.0.1:5434`.
- `pnpm --filter @workspace/kuhni-na-zakaz build` — успешно; во время build есть ожидаемые Prisma-предупреждения из-за недоступной локальной БД, сборка завершилась без ошибки.

## Оставшиеся действия после deploy

- повторно проверить production HTML на наличие `Article` и `ImageObject`;
- при необходимости повторно отправить URL `/materials/furnitura` и sitemap в Google Search Console и Yandex Webmaster.

---

## Production update после этапов 8-10

Дата обновления: 2026-06-04

- Commit: `2237507 Complete furnitura SEO schema and internal links`.
- Push: `origin/work` выполнен успешно.
- Deploy: выполнен на Timeweb VPS; первая попытка уперлась в права на `.next/diagnostics/build-diagnostics.json`, после исправления владельца `.next` production build прошел успешно.
- Service `kuhni-na-zakaz`: active после restart.

Production QA после deploy:

- `https://kuhni.minsk.by/materials/furnitura` — HTTP 200.
- Canonical: `https://kuhni.minsk.by/materials/furnitura`.
- `noindex` не найден.
- JSON-LD на странице: `BreadcrumbList`, `WebPage`, `Article`, `FAQPage`, `ImageObject`.
- Browser desktop: 1 H1, `Article` — 1, `FAQPage` — 1, top-level `ImageObject` — 12, пустых alt — 0, горизонтального overflow нет.
- Browser mobile 390px: 1 H1, пустых alt — 0, горизонтального overflow нет.
- `https://kuhni.minsk.by/sitemap.xml` — HTTP 200, содержит `https://kuhni.minsk.by/materials/furnitura`.
- `https://kuhni.minsk.by/robots.txt` — HTTP 200, содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`.
- Проверенные входящие страницы `/`, `/materials`, `/materials/mdf-fasady`, `/materials/ldsp`, `/materials/plastik-hpl`, `/prices`, `/portfolio`, `/design-proekt-kuhni` открываются с HTTP 200 и содержат ссылку на `/materials/furnitura`.

Индексация / переобход:

- Google Search Console UI: URL inspection для `https://kuhni.minsk.by/materials/furnitura` показал `URL есть в индексе Google` и `Эта страница проиндексирована`; нажата кнопка повторного запроса индексирования. Финальный диалог подтверждения повторного запроса не удалось перечитать после блокировки browser-профиля Playwright.
- Google Search Console API: refresh token вернул `invalid_grant`, поэтому API-проверка/отправка через сохраненный OAuth-токен не выполнена.
- Yandex Webmaster API: URL `https://kuhni.minsk.by/materials/furnitura` отправлен в очередь переобхода, API status `202`, task_id `aa38b740-5fe1-11f1-8910-737450a8b321`, quota_remainder `128`.
- Yandex Webmaster API: sitemap `https://kuhni.minsk.by/sitemap.xml` уже есть в списке sitemap, sitemap_id `39bff829-022b-3e39-884a-527f04d4eb5c`, last_access_date `2026-06-01T21:06:55.000+03:00`, errors_count `0`.

Нельзя писать, что страница гарантированно проиндексирована или будет переиндексирована: зафиксированы только доступность страницы, наличие URL в Google по данным GSC, отправка URL в очередь переобхода Яндекса и доступность sitemap.

---

## Этап 11: полный SEO QA

Дата обновления: 2026-06-04

Локальная проверка выполнена на `http://127.0.0.1:3042/materials/furnitura` после production build.

### SEO и indexability

- Title: `Фурнитура для кухни на заказ в Минске | Петли, направляющие, доводчики | КухниBY`.
- Description: есть, 182 символа.
- H1: 1, `Фурнитура для кухни на заказ`.
- H2/H3: 36 заголовков, структура логичная для гайда и галереи.
- Canonical: `https://kuhni.minsk.by/materials/furnitura`.
- Robots meta: `index, follow`.
- Open Graph title: `Фурнитура для кухни на заказ`.
- `noindex`: не найден.
- JSON-LD: `BreadcrumbList`, `WebPage`, `Article`, 12 `ImageObject`, `FAQPage`.
- `Product`, fake reviews и rating не добавлялись.
- Изображения: 201, пустые alt — 0, дублирующиеся alt — 0.
- Внутренние ссылки: проверено 58, 404/500 не найдено.

### Responsive SEO QA

На ширинах 360, 390, 430, 768, 1024 и 1440 px подтверждены:

- один H1;
- canonical без изменений;
- `index, follow`;
- отсутствие горизонтального overflow;
- наличие 200 кнопок галереи;
- отсутствие пустых и повторяющихся alt.

### Production SEO QA

Проверка `https://kuhni.minsk.by/materials/furnitura?codex_stage12=20260604`:

- HTTP 200.
- Canonical: `https://kuhni.minsk.by/materials/furnitura`.
- Robots meta: `index, follow`.
- H1: 1.
- JSON-LD: `BreadcrumbList`, `WebPage`, `Article`, 12 `ImageObject`, `FAQPage`.
- Изображения: 201; пустые alt — 0; дублирующиеся alt — 0.
- `https://kuhni.minsk.by/materials` — HTTP 200.
- `https://kuhni.minsk.by/sitemap.xml` — HTTP 200, содержит `https://kuhni.minsk.by/materials/furnitura`.
- `https://kuhni.minsk.by/robots.txt` — HTTP 200, содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`, блокировки `/materials/furnitura` не найдено.

### Команды

- `pnpm --filter @workspace/kuhni-na-zakaz typecheck` — успешно.
- `pnpm --filter @workspace/kuhni-na-zakaz sitemap:check` — успешно, 75 URL; есть ожидаемые Prisma-предупреждения из-за недоступной локальной БД `127.0.0.1:5434`.
- `pnpm --filter @workspace/kuhni-na-zakaz build` — успешно; во время build есть ожидаемые Prisma-предупреждения из-за недоступной локальной БД, сборка завершилась без ошибки.
- Отдельной команды `lint` в `artifacts/kuhni-na-zakaz/package.json` нет; lint-стадия Next была выполнена внутри `next build`.
