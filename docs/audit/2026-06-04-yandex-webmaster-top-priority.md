# Yandex Webmaster and top-priority SEO actions

Date: 2026-06-04

## Applied in Yandex Webmaster

- Enabled `Индексирование -> Обход по счетчикам` for Metrika counter `Кухни • 109329747`.
- Verified the counter is linked to the site and the crawl toggle is `Включен`.
- Verified production Metrika on `https://kuhni.minsk.by/`: `window.ym` exists, `tag.js?id=109329747` loads, `mc.yandex.ru/watch/109329747` returns 200.
- Added Clean-param rules for noisy query parameters across the whole site:
  - `sourceType` -> `Не учитывать`;
  - `idea3d` -> `Не учитывать`;
  - `ideaTitle` -> `Не учитывать`.
- Verified Sitemap in Yandex Webmaster:
  - `https://kuhni.minsk.by/sitemap.xml`;
  - status `ok`;
  - found both manually and from `robots.txt`;
  - last Yandex load shown as `01.06.2026, 21:06`;
  - Yandex displayed `96` URLs.
- Submitted 20 priority URLs to `Переобход страниц` through the browser.
- Reindex queue status after submission: `В очереди`, `04.06.2026 9:30`.
- Remaining daily reindex quota after submission: `128`.

## Code changes deployed

- Commit `9bf8166 Improve Yandex crawl and duplicate metadata signals`.
- Commit `9243d09 Clean portfolio metadata titles`.
- Production build succeeded on the server.
- Service `kuhni-na-zakaz` restarted and is `active`.

## Duplicate metadata issue

Yandex Webmaster reported:

- `19` pages with duplicate title.
- `31` pages with duplicate description.

Representative duplicate groups:

- `/portfolio/uglovaya-kuhnya-sovremennaya-007`
- `/portfolio/uglovaya-kuhnya-sovremennaya-015`
- `/portfolio/uglovaya-kuhnya-sovremennaya-024`
- `/portfolio/pryamaya-kuhnya-minimalizm-016`
- `/portfolio/pryamaya-kuhnya-minimalizm-003`
- `/portfolio/pryamaya-kuhnya-minimalizm-022`
- `/scenarios/dlya-studii`
- `/scenarios/kuhnya-dlya-studii`

Implemented fix:

- Portfolio metadata now includes a stable unique marker from the slug, e.g. `проект №007`.
- The marker is included once in title and description.
- Page title relies on the root layout title template for `| КухниBY`, avoiding duplicate brand text.
- Secondary scenario aliases now resolve to canonical behavior; production check for `/scenarios/kuhnya-dlya-studii?qa=9243d09` returned `301` to `/scenarios/dlya-studii?qa=9243d09`.

Production spot-check:

- `/portfolio/uglovaya-kuhnya-sovremennaya-007` title: `Угловая кухня комбинированная в современном стиле — проект №007 | КухниBY`.
- `/portfolio/uglovaya-kuhnya-sovremennaya-015` title: `Угловая кухня комбинированная в современном стиле — проект №015 | КухниBY`.
- `/portfolio/uglovaya-kuhnya-sovremennaya-024` title: `Угловая кухня комбинированная в современном стиле — проект №024 | КухниBY`.

## SERP baseline

Google browser check for `кухни на заказ минск`:

- `kuhni.minsk.by` was not found on the first visible result set.
- Visible competitor domains included:
  - `primebeli.by`;
  - `pinskdrev.by`;
  - `grosslend.by`;
  - `nebo.by`;
  - `mebelzakaz5.by`;
  - `zov-shop.by`;
  - `novuskuhni.by`;
  - `shefkuhni.by`.

Yandex browser SERP check for the same query was blocked by Yandex CAPTCHA, so no SERP positions were extracted from Yandex search. Yandex Webmaster settings and reports were available and were used instead.

## Remaining blockers for top-1 work

- Yandex duplicate metadata report will update only after recrawl; do not expect instant disappearance.
- Production logs show `EROFS` errors when Next tries to update ISR/prerender cache under `.next`; the site remains available, but this should be fixed because it can affect freshness and crawl consistency.
- Top-1 cannot be guaranteed by technical settings alone. Next work should compare the visible competitors above on content depth, commercial trust, reviews, local signals, internal linking, and backlinks.
