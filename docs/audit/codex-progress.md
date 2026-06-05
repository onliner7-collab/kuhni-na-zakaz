# Codex audit progress

## 2026-05-19 - Image loading on key templates

- Created this progress file because it was absent at task start.
- Reviewed current git diff before changes. Existing unrelated edits were already present in sitemap, analytics, contact form, design project page, and package scripts; they were not reverted.
- Updated `next/image` usage on key public templates so above-the-fold hero or first-card images are eager/high priority where appropriate, while below-the-fold cards, galleries, related content, and thumbnails are explicitly lazy.
- Kept existing image files unchanged; no image optimization pipeline or image generation was run.
- Reused existing image components (`CatalogCategoryImage`, `CatalogImageGallery`, material and portfolio gallery components). No new shared component was added because current components already encode different layout contracts (`fill`, fixed dimensions, gallery thumbnails).
- Covered templates/routes in scope:
  - `/`
  - `/catalog` and `/catalog/[slug]`
  - `/materials`, `/materials/[slug]`, `/materials/mdf-fasady`, `/materials/ldsp`, `/materials/plastik-hpl`
  - `/locations/[city]` and regional location component
  - `/blog` and `/blog/[slug]`
  - `/portfolio` cards and `/portfolio/[slug]` hero/gallery components
  - `/styles` and `/styles/[slug]`
- Ordinary `<img>` remain only in admin/configurator surfaces outside this audit's public key-template scope.
- Verification:
  - `pnpm --filter @workspace/kuhni-na-zakaz typecheck` passed.
  - `pnpm --filter @workspace/kuhni-na-zakaz build` passed.
  - `pnpm --filter @workspace/kuhni-na-zakaz run lint` could not run because the package has no `lint` script.
  - `pnpm --filter @workspace/kuhni-na-zakaz test` produced no project test run because the package has no `test` script.
- Browser QA used local `next dev` on `http://127.0.0.1:3010`.
  - Checked `/`, `/catalog/uglovye-kuhni`, `/materials/mdf-fasady`, `/locations/minsk`: first viewport rendered without obvious layout break or horizontal overflow.
  - Checked `/portfolio/kuhnya-s-ostrovom-minimalizm-005`: local app returned 404 "Страница не найдена"; `/portfolio` had no project links in current local data, so a live project-detail visual check was not possible.
  - Screenshots saved under `.tmp/image-loading-qa/`.

## 2026-05-19 - Push and production deploy

- Committed the image-loading work together with earlier pending sitemap/analytics/design-project changes and related project files.
- Commit pushed to `origin/work`: `d951ba0 Improve image loading and sitemap coverage`.
- Local pre-push validation:
  - `pnpm --filter @workspace/kuhni-na-zakaz sitemap:check` passed with 61 URLs.
  - `pnpm --filter @workspace/kuhni-na-zakaz typecheck` passed when run by itself.
  - `pnpm --filter @workspace/kuhni-na-zakaz build` passed.
- Production deploy:
  - Ran `bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work` on Timeweb VPS.
  - Initial deploy attempts were blocked by server-side untracked style assets and root `docs` ownership; matching style asset hashes were verified, exact conflicting untracked files were removed, `/var/www/kuhni-na-zakaz/docs` ownership was corrected to `kuhni:kuhni`, and a server-side git stash backup `pre-deploy-conflict-backup-d951ba0` was created before retrying.
  - Final deploy fast-forwarded production to `d951ba0`, installed dependencies, ran Prisma generate/db push, imported prepared photos and portfolio folders, wrote static sitemap fallback with 126 URLs, synchronized NAP, built Next.js successfully, and restarted `kuhni-na-zakaz`.
- Production verification after restart:
  - `https://kuhni.minsk.by/` returned `200 OK`.
  - `https://kuhni.minsk.by/catalog/uglovye-kuhni` returned `200 OK`.
  - `https://kuhni.minsk.by/materials/mdf-fasady` returned `200 OK`.
  - `https://kuhni.minsk.by/locations/minsk` returned `200 OK`.
  - `https://kuhni.minsk.by/portfolio/kuhnya-s-ostrovom-minimalizm-005` returned `200 OK`.
- Server note:
  - The deploy import scripts generated untracked portfolio upload files and `project-docs/stage-4-2-photo-import/import-report.json` on the production checkout; these were left in place because they are generated runtime/import artifacts.

## 2026-05-19 - Public text cleanup and SEO/UX copy audit

- Reviewed this progress file and the current git diff before editing. The tracked worktree was clean at start; many unrelated untracked local files were present later and were not staged.
- Removed or replaced public-facing service/template wording from site sources:
  - portfolio import defaults now use: "Стоимость и комплектация рассчитываются индивидуально после замера, выбора материалов и согласования проекта."
  - regional city copy now uses: "Расчёт, проектирование и согласование доступны удалённо; условия замера, доставки и монтажа уточняются индивидуально."
  - 3D kitchen idea disclosure now states that it is a 3D visualization, not a realized-object photo.
- Translated visible English sidebar headings:
  - `Other styles` -> `Другие стили`
  - `Other materials` -> `Другие материалы`
- Fixed material gallery grammar:
  - акрил: "Как выглядят акриловые фасады для кухни в образцах и интерьере"
  - МДФ фасады: "Как выглядят МДФ фасады для кухни в образцах и интерьере"
  - шпон: "Шпон для кухни: образцы, фактура и примеры в интерьере"
- Improved image alt text:
  - catalog/design-project 3D gallery alts no longer say "из 3D-проекта" or "тот же ракурс";
  - portfolio project manifests now have per-image alt text by view/angle instead of repeated identical alt strings.
- Unique portfolio titles in prepared project manifests:
  - repeated titles now include the existing project number from the slug, for example `Кухня с островом белая в стиле минимализм, проект №005`.
  - no cities, prices, sizes, deadlines, reviews, or real-case details were invented.
- Blog text review:
  - removed exact unverified BYN price tables for kitchen комплектации and islands;
  - softened Blum/Hettich/GTV claims to require checking the specific series and load in the estimate/specification;
  - left general ergonomic dimensions/passages where they are presented as planning ориентиры, not as brand specifications or confirmed project facts.
- Additional public copy cleanup:
  - reviews page now says moderation happens before appearing on the site, avoiding the audit phrase "перед публикацией";
  - hidden contact form honeypot aria-label no longer uses "Служебное поле".
- Verification:
  - `rg` scan across public app/data/lib/scripts and prepared portfolio manifests found no remaining target service phrases, English "Other ..." headings, or technical 3D alt fragments.
  - Portfolio manifest check found `duplicateTitles: []` and `duplicateAltCount: 0`.
  - `pnpm --filter @workspace/kuhni-na-zakaz typecheck` passed.
  - `pnpm --filter @workspace/kuhni-na-zakaz build` passed after clearing the local `.next` cache.
  - `pnpm --filter @workspace/kuhni-na-zakaz run lint` could not run because the package has no `lint` script.
  - `pnpm --filter @workspace/kuhni-na-zakaz test` produced no project test run because the package has no `test` script.
- Browser QA:
  - Local dev server used `http://127.0.0.1:3014`.
  - Checked `/materials/mdf-fasady`, `/styles/neoklassika`, and `/locations/borisov`.
  - `/materials/akril` returned local 404 because that material page is not available in the current local data/routes.
  - After cache bypass, `/materials/mdf-fasady` showed the corrected heading "Как выглядят МДФ фасады для кухни в образцах и интерьере" without the earlier dev-cache hydration mismatch.
- Git and production deploy:
  - Committed and pushed `e91ad8e Clean public SEO copy` to `origin/work`.
  - Ran `bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work` on the Timeweb VPS.
  - Deploy fast-forwarded production to `e91ad8e`, imported prepared photo/portfolio data, wrote static sitemap fallback with 126 URLs, synchronized NAP, built Next.js successfully, and restarted `kuhni-na-zakaz`.
  - Production verification after restart:
    - `https://kuhni.minsk.by/` returned `200 OK`.
    - `https://kuhni.minsk.by/materials/mdf-fasady` returned `200 OK` and contained the corrected MДФ heading.
    - `https://kuhni.minsk.by/styles/neoklassika` returned `200 OK` and contained `Другие стили`.
    - `https://kuhni.minsk.by/locations/borisov` returned `200 OK`.
    - `https://kuhni.minsk.by/portfolio/kuhnya-s-ostrovom-minimalizm-005` returned `200 OK`.
  - Server verification: production checkout was on `e91ad8e`; `systemctl is-active kuhni-na-zakaz` returned `active`.

## 2026-05-19 - Key public page smoke coverage and location case cleanup

- Continued from an interrupted local diff. Existing unrelated untracked files were left untouched.
- Added `smoke:key-pages` Playwright coverage for key public routes on desktop and mobile:
  - home, catalog category pages, materials pages, city pages, one blog page, two portfolio detail URLs, `sitemap.xml`, and `robots.txt`;
  - checks title, visible `h1`, non-empty alt text for rendered images, no obvious browser errors, and no selected service/audit phrases.
- Added `lighthouserc.js` and LHCI scripts for repeatable local performance/SEO sampling of key URLs.
- Tightened regional location portfolio logic:
  - pinned and automatic cases must match the page city exactly after normalization;
  - regional pages no longer render generic cross-city portfolio cards when no confirmed local cases exist;
  - empty local portfolio state now points visitors to solution examples and 3D visualizations instead of unrelated cases.
- Added conservative concept fallbacks for two public portfolio URLs used by smoke/SEO checks:
  - `/portfolio/kuhnya-s-ostrovom-minimalizm-005`
  - `/portfolio/uglovaya-kuhnya-sovremennaya-001`
  These are explicitly labeled as 3D visualizations, not completed works.
- Cleaned remaining public wording around "неподтвержденные обещания" and "фейков"; reviews page now says reviews are moderated before appearing on the site without using harsher audit wording.
- Verification:
  - `pnpm --filter @workspace/kuhni-na-zakaz typecheck` passed.
  - `pnpm --filter @workspace/kuhni-na-zakaz sitemap:check` passed with 61 URLs.
  - `pnpm --filter @workspace/kuhni-na-zakaz smoke:key-pages` passed: 30 tests on desktop/mobile.
  - `pnpm --filter @workspace/kuhni-na-zakaz build` passed after clearing local `.next` dev/build cache.
- Local QA note:
  - One repeated smoke run timed out waiting for an old `3001` dev server, and another run on `3015` saw stale `.next` CSS/500 responses. Removing `artifacts/kuhni-na-zakaz/.next` and rerunning on `3016` resolved it.
