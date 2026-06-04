# SEO Sprint: Google/Yandex Top-1 Direction

Date: 2026-06-04
Site: https://kuhni.minsk.by

## Source Signals

- Google Search Console: 9 clicks, 1.08k impressions, CTR 0.8%, average position 32 for 2026-04-26 to 2026-06-01.
- Main Google queries with weak positions: `кухни на заказ` position 59.1, `кухни на заказ минск` position 75.6, `кухни на заказ цены` position 55.1, `кухни под заказ` position 57.8.
- Main Google pages by impressions: `/`, `/locations/minsk`, `/prices`, `/catalog`, `/locations`, `/contacts`, `/styles/sovremennye`, `/warranty`, blog/material pages.
- Google indexing: 98 indexed pages, 49 not indexed. The largest active bucket is "Discovered, not indexed" with 26 URLs.
- Yandex Webmaster: no critical site errors, 1 recommendation, 19 duplicated titles, 31 duplicated descriptions.
- Yandex crawl history showed public URL variants with `?idea3d=...`, `?ideaTitle=...`, `?sourceType=...`, and `/calculator?project=...`.

## Implemented Now

- Removed crawlable query-parameter CTA links from the 3D kitchen ideas sections.
- Added `X-Robots-Tag: noindex, follow, noarchive` for public pages opened with any query string.
- Kept clean public pages indexable without an `X-Robots-Tag`.
- Updated CTR-focused metadata for the main commercial pages:
  - `/`: `Кухни на заказ в Минске: цены от 900 BYN`
  - `/prices`: `Цены на кухни на заказ в Минске от 900 BYN`
  - `/catalog`: `Каталог кухонь на заказ в Минске: фото и цены`

## Verified

- `pnpm --filter @workspace/kuhni-na-zakaz typecheck`
- `pnpm --filter @workspace/kuhni-na-zakaz sitemap:check`
- `pnpm --filter @workspace/kuhni-na-zakaz build`
- Local production check on port 3011:
  - `/locations/molodechno`: 200, no `X-Robots-Tag`
  - `/locations/molodechno?sourceType=location_3d_ideas`: 200, `X-Robots-Tag: noindex, follow, noarchive`
  - `/calculator?project=test`: 200, `X-Robots-Tag: noindex, follow, noarchive`
  - `/robots.txt`: 200, `text/plain`
- In-app browser check: `/locations/molodechno` has `#form` and no internal links containing `sourceType`, `idea3d`, or `?project`.

## Next Priority

1. Deploy these fixes and submit the priority clean URLs for recrawl in Yandex Webmaster and Google Search Console.
2. Recheck Yandex duplicate title/description report after the next robot visit. The currently visible examples were crawled mostly on 2026-05-05 and 2026-05-17.
3. Build a top cluster around `/`, `/locations/minsk`, `/prices`, and `/catalog`:
   - `кухни на заказ минск`
   - `кухни на заказ цены`
   - `кухни под заказ минск`
   - `кухни на заказ в минске`
   - `стоимость кухни на заказ`
4. Strengthen internal links from indexed pages to discovered-but-not-indexed pages: `/about`, `/blog`, `/design-proekt-kuhni`, `/portfolio`, `/reviews`, `/scenarios`, `/locations/*`, `/styles/*`.
5. Add fresh commercial content blocks with real proof: production process, warranty terms, price examples, city coverage, reviews, portfolio cases, and comparison tables.
6. Start weekly rank tracking for Google and Yandex. Top-1 is not something that can be guaranteed, but these are the levers that move the site from visibility to competition.
