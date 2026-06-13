# Sitemap, robots, canonical и индексируемость

Дата: 13 июня 2026  
Сайт: `https://kuhni.minsk.by`

## Итог

- Production `/sitemap.xml` отдаёт static sitemap: заголовок `X-Sitemap-Source: static`.
- Static sitemap выбран официальным fallback-источником для production.
- `public/sitemap-static.xml` синхронизирован с production и содержит 108 URL.
- `pnpm run build` теперь автоматически запускает `pnpm run sitemap:write-static` через `prebuild`.
- `pnpm run sitemap:check` проверяет, что static sitemap совпадает с `app/sitemap.ts`.

## Что изменено

| Файл | Изменение |
|---|---|
| `artifacts/kuhni-na-zakaz/app/sitemap.ts` | Добавлены статические fallback-URL для styles, materials, scenarios, portfolio и blog, чтобы без БД sitemap давал 108 URL. |
| `artifacts/kuhni-na-zakaz/public/sitemap-static.xml` | Перегенерирован до 108 URL. |
| `artifacts/kuhni-na-zakaz/scripts/check-sitemap.ts` | Добавлена проверка совпадения static sitemap с динамическим генератором. |
| `artifacts/kuhni-na-zakaz/package.json` | Добавлен `prebuild`, который обновляет static sitemap перед сборкой. |

## Robots и canonical

- `robots.ts` указывает canonical sitemap: `https://kuhni.minsk.by/sitemap.xml`.
- Служебные зоны закрыты: `/admin/`, `/api/`, `/kapi/`, `/search/`, `/thanks/`.
- CSS/JS/images не блокируются.
- Middleware принудительно нормализует production на HTTPS и non-www.
- Query URLs получают `X-Robots-Tag: noindex, follow, noarchive`.

## Проверки

- `pnpm run sitemap:write-static`: 108 URL.
- `pnpm run sitemap:check`: passed, 108 URL.
- Production `https://kuhni.minsk.by/sitemap.xml`: `X-Sitemap-Source: static`, 108 URL.
- После деплоя production smoke: `/`, `/catalog`, `/catalog/uglovye-kuhni`, `/locations/minsk`, `/prices`, `/blog`, `/contacts`, `/reviews`, `/sitemap.xml`, `/robots.txt` отдают 200.
- Redirect smoke: `http://kuhni.minsk.by/catalog/uglovye-kuhni` и `https://www.kuhni.minsk.by/catalog/uglovye-kuhni` отдают 301 на canonical HTTPS non-www.

## Открытые пункты

- Google Search Console: аккаунт `onliner7@gmail.com` не имеет доступа к URL-prefix ресурсу `https://kuhni.minsk.by/`, sitemap/URL отправить не удалось.
- Яндекс.Вебмастер: sitemap уже добавлен и найден через robots.txt, статус `ok`, 108 ссылок, последняя загрузка 12.06.2026 23:58.
