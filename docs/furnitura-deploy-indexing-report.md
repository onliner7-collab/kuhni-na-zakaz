# Deploy и индексация `/materials/furnitura`

Дата: 2026-06-02

## Статус

Страница `/materials/furnitura` создана локально в рамках этапа 2. Локальные проверки пройдены. Отчет будет обновлен после commit/push, production deploy и фактической отправки URL/sitemap в Google Search Console и Yandex Webmaster.

## Sitemap и robots

- Локально `/materials/furnitura` добавлен в `STATIC_PATHS` файла `artifacts/kuhni-na-zakaz/app/sitemap.ts`.
- `robots.ts` не блокирует `/materials/furnitura`.
- `robots.ts` содержит ссылку на canonical sitemap через `CANONICAL_SITE_URL`.
- Проверка `http://127.0.0.1:3012/sitemap.xml`: URL `https://kuhni.minsk.by/materials/furnitura` присутствует.
- Проверка `http://127.0.0.1:3012/robots.txt`: robots.txt доступен, `/materials/furnitura` не заблокирован.

## Локальная проверка страницы

- `http://127.0.0.1:3012/materials/furnitura` — 200 OK.
- Browser desktop: один H1, canonical корректный, noindex нет, горизонтального overflow нет.
- Browser mobile 390px: один H1, canonical корректный, noindex нет, горизонтального overflow нет.

## Индексация

На текущий момент в этом отчете не фиксируется отправка URL или sitemap в поисковые системы. После выполнения отправки нужно указать только факты:

- URL `/materials/furnitura` отправлен на проверку/индексацию в Google Search Console.
- `https://kuhni.minsk.by/sitemap.xml` отправлен в Google Search Console.
- URL `/materials/furnitura` отправлен в Yandex Webmaster, если доступ был подтвержден.
- `https://kuhni.minsk.by/sitemap.xml` отправлен в Yandex Webmaster, если доступ был подтвержден.

Нельзя писать, что страница гарантированно проиндексирована.
