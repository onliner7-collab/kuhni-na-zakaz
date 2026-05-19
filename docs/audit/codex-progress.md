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
