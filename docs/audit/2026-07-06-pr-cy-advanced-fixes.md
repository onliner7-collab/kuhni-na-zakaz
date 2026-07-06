# PR-CY Advanced audit and fixes, 2026-07-06

URL checked: https://a.pr-cy.ru/advanced/kuhni.minsk.by/
Site: https://kuhni.minsk.by

## PR-CY facts

- Overall score: 84.62/100.
- Tests: 33 successful, 1 error, 5 warnings.
- Yandex indexed pages: 149 by public check, 159 by connected Yandex Webmaster.
- Google indexed pages by public `site:` estimate: 80, down 42.
- Yandex Reviews: not found.
- External backlinks in Yandex Webmaster: no data.
- PR-CY rank: 13/100.
- Google Search Console keywords in PR-CY: 438.
- Yandex tracked keywords: 0 top-1, 0 top-3, 0 top-10, 4 in top-50.
- Homepage text signal: 6,828 words and PR-CY nausea without stop words 22.23%.
- Speed: desktop 64/100, mobile 53/100.

## Code fixes made

- Reduced homepage portfolio image multiplication: homepage portfolio photos are capped at 12 and the loop repeats fewer times.
- Reduced homepage `<img>` count in local production HTML from 342 to 56.
- Rewrote homepage title and description to remove repeated exact-match phrasing.
- Rewrote the homepage materials H2 from a repeated commercial keyword phrase to a natural heading.
- Limited homepage database portfolio fetch to 12 cases.

## Verification

- `node_modules/.bin/tsc.CMD --noEmit --incremental false` passed.
- `pnpm.cmd build` passed. Local database was unavailable at `127.0.0.1:5434`, so the build used fallback data; this is expected in the local environment.
- Local production smoke at `http://127.0.0.1:3261/`: status 200, title updated, description updated, 56 images, no broken images, no mobile horizontal overflow at 390px.

## Not code-fixable from the repo

- Yandex Reviews requires a real Yandex Business/review profile and real customer reviews.
- VK warning should only be fixed when a confirmed official VK page exists.
- Empty backlink profile requires link building and local citations, not a code patch.
- Google/Yandex position growth requires authority, reviews, CTR, content and links after technical cleanup.
