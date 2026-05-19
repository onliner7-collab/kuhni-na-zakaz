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

