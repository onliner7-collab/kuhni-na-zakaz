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
