# Post-import smoke checks

Minimal smoke suite for verifying `bulk import v1` after apply/import.

Main bulk import documentation:
- `project-docs/BULK_IMPORT_V1.md`

## Coverage

- `homepage`
  - page opens without hard runtime failure
  - has `h1`, hero CTA, catalog link, portfolio link
  - FAQ section is non-empty
- `catalog`
  - index page opens and is non-empty
  - representative detail page `/catalog/uglovye-kuhni` opens
  - detail page has content and a lead form
- `portfolio`
  - portfolio index opens
  - at least one case card exists
- `materials`
  - materials index opens
  - comparison table is present
  - links to material pages are present
- `location pages`
  - representative location page `/locations/brest` opens
  - page has content, a form, and enough visible sections
- both `desktop` and `mobile` viewports

The calculator is intentionally out of scope for this suite.

## Run

Install dependencies and browser:

```bash
pnpm install
cd artifacts/kuhni-na-zakaz
pnpm exec playwright install chromium
```

Run smoke suite:

```bash
pnpm smoke:post-import
```

Run in headed mode:

```bash
pnpm smoke:post-import:headed
```

## Important notes

- Playwright starts the app automatically with `pnpm dev`
- default base URL is `http://127.0.0.1:3001`
- suite expects a working `DATABASE_URL`
- if import broke public data or emptied critical sections, tests should fail
- if DB is unavailable, some checks will also fail; this is an expected signal
