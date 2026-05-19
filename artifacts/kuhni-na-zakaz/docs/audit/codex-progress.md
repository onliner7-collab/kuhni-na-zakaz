# Codex progress

Updated: 2026-05-18

## Current task: sitemap.xml and robots.txt

Completed:
- Found current Next.js App Router metadata routes in `app/sitemap.ts` and `app/robots.ts`.
- Updated `app/sitemap.ts` to include legal pages that exist: `/privacy-policy`, `/personal-data`, `/terms`.
- Added published `Kitchen` records to `/catalog/*`, so dynamic catalog pages are included alongside static catalog categories.
- Added static blog fallback entries from `lib/blog-static.ts` and `lib/blog-seo-fallback.ts`, so fallback public blog pages are still listed if database blog reads are empty or unavailable.
- Kept canonical host as `https://kuhni.minsk.by` through existing `getSiteUrl()` normalization.
- Kept private/technical and redirected paths out of sitemap, including `/admin`, `/api`, `/kapi`, `/search`, `/thanks`, `/configurator`, `/kitchen-configurator`.
- Added `scripts/check-sitemap.ts` and `pnpm sitemap:check` to verify required URLs, canonical host, duplicates, metadata fields, forbidden paths, and robots sitemap pointer.
- Regenerated `public/sitemap-static.xml` with 61 URLs via `pnpm sitemap:write-static`.

Validation run:
- `pnpm sitemap:check` passed, 61 URLs.
- `pnpm typecheck` passed.
- `pnpm build` passed.
- Dev HTTP check reached `/robots.txt` and `/sitemap.xml` with 200 responses according to Next dev logs.

Notes:
- `app/robots.ts` already allowed public pages and pointed to `https://kuhni.minsk.by/sitemap.xml`; no code change was needed there.
- A local `pnpm start` HTTP check hit an existing middleware runtime issue: `EvalError: Code generation from strings disallowed for this context`. Build itself still passed; this was not caused by the sitemap changes.
- There is no `lint` or generic `test` script in `package.json`. Playwright smoke scripts exist, but were not run because the task asked not to use Playwright when ordinary checks are enough.

Unresolved URLs:
- No unresolved required sitemap URLs from the task.
- `/materials/akril`, `/materials/shpon`, `/materials/mdf-emal` are not added as static URLs because they are dynamic `/materials/[slug]` pages and should only enter sitemap when published `MaterialPage` records exist in the database.
- `/portfolio/*` pages depend on published `PortfolioCase` records; no extra portfolio URLs were invented.

Touched files for this task:
- `app/sitemap.ts`
- `package.json`
- `scripts/check-sitemap.ts`
- `docs/audit/codex-progress.md`

## 2026-05-19 - Image loading, push, and production deploy

Completed:
- Added explicit eager/high-priority handling for hero and first viewport images on key public templates.
- Added explicit lazy loading to below-the-fold cards, galleries, thumbnails, related content, and material/style/project image blocks where sizes were already defined.
- Kept existing image assets unchanged for the image-loading task; separately included the pending tracked style loft public assets that already existed locally/server-side.
- Included earlier pending changes from the worktree: sitemap coverage, lead submit analytics/form location, sitemap check script, design project smoke spec, and audit reports.

Validation:
- `pnpm --filter @workspace/kuhni-na-zakaz sitemap:check` passed with 61 URLs before deployment.
- `pnpm --filter @workspace/kuhni-na-zakaz typecheck` passed when run by itself.
- `pnpm --filter @workspace/kuhni-na-zakaz build` passed locally.

Push and deploy:
- Pushed `origin/work` at `d951ba0 Improve image loading and sitemap coverage`.
- Deployed on Timeweb VPS with `bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work`.
- Production deploy fast-forwarded to `d951ba0`, installed dependencies, ran Prisma generate/db push, imported prepared photos and portfolio folders, wrote static sitemap fallback with 126 URLs, synchronized NAP, built Next.js successfully, and restarted `kuhni-na-zakaz`.
- Production `curl -I` checks returned `200 OK` for `/`, `/catalog/uglovye-kuhni`, `/materials/mdf-fasady`, `/locations/minsk`, and `/portfolio/kuhnya-s-ostrovom-minimalizm-005`.

Deploy notes:
- The first deploy attempt found matching untracked style loft assets already present on the server; hashes matched local files, then only those exact conflicting files were removed so Git could track them.
- The root server `docs` directory was owned by `root:root`; ownership was corrected to `kuhni:kuhni`.
- A server-side stash backup `pre-deploy-conflict-backup-d951ba0` was created before retrying the deploy.
- Deploy import scripts generated untracked portfolio upload files and `project-docs/stage-4-2-photo-import/import-report.json` on the production checkout; these were left in place as runtime/import artifacts.
