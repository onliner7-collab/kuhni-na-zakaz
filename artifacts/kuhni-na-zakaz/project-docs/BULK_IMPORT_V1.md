# Bulk Import v1

This document describes the actual `bulk import v1` behavior implemented in code today.

Primary code references:
- `lib/bulk-import/v1.ts`
- `app/kapi/admin/imports/bulk/v1/upload/route.ts`
- `app/kapi/admin/imports/bulk/v1/sessions/[id]/route.ts`
- `app/kapi/admin/imports/bulk/v1/sessions/[id]/confirm/route.ts`
- `prisma/schema.prisma`
- `tests/smoke/post-import.smoke.spec.ts`
- `tests/smoke/README.md`

Short safe-scope summary:
- `project-docs/BULK_IMPORT_V1_BASELINE.md`

Operator-facing assets:
- `project-docs/templates/bulk-import-v1-template.xlsx`
- `project-docs/BULK_IMPORT_V1_OPERATOR_GUIDE_RU.md`
- `project-docs/BULK_IMPORT_V1_OPERATOR_LIMITATIONS_RU.md`
- `project-docs/BULK_IMPORT_V1_POST_IMPORT_CHECKLIST_RU.md`

## Scope v1

`bulk import v1` supports only these six entities:
- `Kitchens`
- `Styles`
- `Materials`
- `Scenarios`
- `Portfolio`
- `Locations`

Implemented behavior:
- admin uploads one `.xlsx` workbook
- server reads supported sheets from that workbook
- rows are normalized into typed payloads
- preview session is created with per-row operation and issues
- confirm/apply upserts rows by `externalId`
- preview session is stored on local filesystem for `1 hour`

Not part of v1:
- calculator/configurator import
- calculator validation
- homepage blocks
- blog posts
- FAQ items
- reviews moderation data
- static pages
- site settings
- visual configurator catalog
- delete / archive flow
- media upload / file hosting
- auto-run smoke tests from the import API
- repo-local CLI runner

## Data Model Changes

`bulk import v1` relies on nullable unique `externalId` fields on the six imported models:
- `Kitchen.externalId`
- `StylePage.externalId`
- `MaterialPage.externalId`
- `ScenarioPage.externalId`
- `PortfolioCase.externalId`
- `LocationPage.externalId`

Public routing still depends on `slug`, and `slug` remains unique on all six models.

Relevant JSON-backed fields used by import:
- `ScenarioPage.features`
- `LocationPage.faq`
- `LocationPage.uniquePoints`
- `LocationPage.contentBlocks`

Fields present in Prisma but intentionally not mutated by safe bulk import v1:
- `StylePage.relatedMaterials`
- `StylePage.relatedCaseSlugs`
- `StylePage.relatedScenarioSlugs`
- `MaterialPage.relatedStyles`
- `MaterialPage.relatedCaseSlugs`
- `MaterialPage.relatedScenarioSlugs`
- `ScenarioPage.relatedStyles`
- `ScenarioPage.relatedMaterials`
- `ScenarioPage.relatedCaseSlugs`
- `PortfolioCase.styleSlug`
- `PortfolioCase.materialSlugs`
- `PortfolioCase.scenarioSlugs`
- `LocationPage.caseSlugs`
- `LocationPage.reviewIds`
- all `id` / timestamp fields

## `externalId`

`externalId` is the import identity key for all supported entities.

Rules implemented in code:
- every imported row must have non-empty `externalId`
- accepted header aliases: `externalId`, `external_id`, `id`
- preview compares incoming rows against current DB snapshot by `externalId`
- when `externalId` is missing on an existing legacy record but the same `slug` already exists, preview treats that row as a legacy backfill candidate
- confirm/apply backfills the matched legacy record with the workbook `externalId` before running the normal update path
- apply uses `findUnique({ where: { externalId } })`
- if record is missing, import creates it
- if record exists, import updates only the entity's safe update allowlist
- duplicate `externalId` values inside the same sheet are hard errors

Important operational note:
- `externalId` is not treated as a mutable business field
- for existing rows, `slug` changes are not applied even if supplied in Excel

## Excel Template v1

The checked-in operator template is:
- `project-docs/templates/bulk-import-v1-template.xlsx`

The parser in `lib/bulk-import/v1.ts` remains the source of truth for accepted headers and normalization behavior.

Recommended workbook shape:
- one workbook per import
- one supported entity per sheet
- row 1 contains headers
- one record per subsequent row

Canonical sheet names:
- `Kitchens`
- `Styles`
- `Materials`
- `Scenarios`
- `Portfolio`
- `Locations`

Accepted sheet aliases:
- `kitchens`, `kitchen`
- `styles`, `style`
- `materials`, `material`
- `scenarios`, `scenario`
- `portfolio`, `cases`
- `locations`, `location`

The implementation also contains Cyrillic aliases, but the safest operational template is the canonical English naming above.

Header parsing rules:
- headers are case-insensitive
- spaces, underscores, dots, and dashes are normalized away
- some aliases are accepted for fields such as `seoTitle/metaTitle` and `seoDescription/metaDescription`

Cell parsing rules:
- string arrays can be JSON arrays or plain text split by newline, comma, semicolon, or pipe
- number arrays use the same split behavior and keep only valid integers
- object arrays must be valid JSON arrays
- booleans accept values like `1/0`, `true/false`, `yes/no`, `published/draft`
- empty `slug` is auto-generated from `title` or `city`
- `Kitchens.mainImage` and `Portfolio.mainImage` fall back to the first gallery image when omitted
- image fields are validated in preview as direct image URLs; page/share links are blocked before apply

### Canonical headers by sheet

#### Kitchens
- `externalId`
- `title`
- `slug`
- `description`
- `category`
- `style`
- `material`
- `priceFrom`
- `priceTo`
- `features`
- `images`
- `mainImage`
- `seoTitle`
- `seoDescription`
- `published`

#### Styles
- `externalId`
- `slug`
- `title`
- `headline`
- `description`
- `intro`
- `content`
- `suitableFor`
- `pros`
- `cons`
- `careGuide`
- `pairsWith`
- `budgetLevel`
- `priceFrom`
- `image`
- `relatedMaterials`
- `relatedCaseSlugs`
- `relatedScenarioSlugs`
- `seoTitle`
- `seoDescription`
- `seoKeywords`
- `order`
- `published`

#### Materials
- `externalId`
- `slug`
- `title`
- `headline`
- `description`
- `intro`
- `content`
- `pros`
- `cons`
- `suitableFor`
- `careGuide`
- `budgetLevel`
- `pricePer`
- `priceFrom`
- `image`
- `relatedStyles`
- `relatedCaseSlugs`
- `relatedScenarioSlugs`
- `seoTitle`
- `seoDescription`
- `seoKeywords`
- `order`
- `published`

#### Scenarios
- `externalId`
- `slug`
- `icon`
- `badge`
- `title`
- `headline`
- `intro`
- `seoTitle`
- `seoDescription`
- `seoKeywords`
- `needs`
- `solutions`
- `features`
- `tips`
- `relatedStyles`
- `relatedMaterials`
- `relatedCaseSlugs`
- `ctaText`
- `ctaHref`
- `order`
- `published`

#### Portfolio
- `externalId`
- `title`
- `slug`
- `city`
- `region`
- `area`
- `layout`
- `style`
- `styleSlug`
- `material`
- `materialSlugs`
- `scenarioSlugs`
- `priceFrom`
- `priceTo`
- `days`
- `completedAt`
- `description`
- `task`
- `constraints`
- `solution`
- `result`
- `mainImage`
- `images`
- `photosBefore`
- `photosAfter`
- `featured`
- `order`
- `seoTitle`
- `seoDescription`
- `seoKeywords`
- `published`

#### Locations
- `externalId`
- `city`
- `slug`
- `region`
- `title`
- `h1`
- `intro`
- `description`
- `priceFrom`
- `deliveryCost`
- `deliveryDays`
- `measureCost`
- `timelineText`
- `visitDetails`
- `installDetails`
- `images`
- `areas`
- `workZone`
- `mapEmbed`
- `features`
- `faq`
- `localIntro`
- `uniquePoints`
- `contentBlocks`
- `caseSlugs`
- `reviewIds`
- `ctaHeadline`
- `ctaSubtext`
- `phone`
- `address`
- `seoTitle`
- `seoDescription`
- `published`

## Safe Apply Allowlist

The parser can read more fields than the safe apply phase actually mutates.

### Create and update behavior

`Kitchens`
- create fields: `externalId`, `slug`, `title`, `description`, `category`, `style`, `material`, `priceFrom`, `priceTo`, `features`, `images`, `mainImage`, `seoTitle`, `seoDescription`, `published`
- update fields: `title`, `description`, `category`, `style`, `material`, `priceFrom`, `priceTo`, `features`, `images`, `mainImage`, `seoTitle`, `seoDescription`, `published`

`Styles`
- create fields: `externalId`, `slug`, `title`, `headline`, `description`, `intro`, `content`, `suitableFor`, `pros`, `cons`, `careGuide`, `pairsWith`, `budgetLevel`, `priceFrom`, `image`, `seoTitle`, `seoDescription`, `seoKeywords`, `order`, `published`
- update fields: `title`, `headline`, `description`, `intro`, `content`, `suitableFor`, `pros`, `cons`, `careGuide`, `pairsWith`, `budgetLevel`, `priceFrom`, `image`, `seoTitle`, `seoDescription`, `seoKeywords`, `order`, `published`
- parsed but ignored: `relatedMaterials`, `relatedCaseSlugs`, `relatedScenarioSlugs`

`Materials`
- create fields: `externalId`, `slug`, `title`, `headline`, `description`, `intro`, `content`, `pros`, `cons`, `suitableFor`, `careGuide`, `budgetLevel`, `pricePer`, `priceFrom`, `image`, `seoTitle`, `seoDescription`, `seoKeywords`, `order`, `published`
- update fields: `title`, `headline`, `description`, `intro`, `content`, `pros`, `cons`, `suitableFor`, `careGuide`, `budgetLevel`, `pricePer`, `priceFrom`, `image`, `seoTitle`, `seoDescription`, `seoKeywords`, `order`, `published`
- parsed but ignored: `relatedStyles`, `relatedCaseSlugs`, `relatedScenarioSlugs`

`Scenarios`
- create fields: `externalId`, `slug`, `icon`, `badge`, `title`, `headline`, `intro`, `seoTitle`, `seoDescription`, `seoKeywords`, `needs`, `solutions`, `features`, `tips`, `ctaText`, `ctaHref`, `order`, `published`
- update fields: `icon`, `badge`, `title`, `headline`, `intro`, `seoTitle`, `seoDescription`, `seoKeywords`, `needs`, `solutions`, `features`, `tips`, `ctaText`, `ctaHref`, `order`, `published`
- parsed but ignored: `relatedStyles`, `relatedMaterials`, `relatedCaseSlugs`

`Portfolio`
- create fields: `externalId`, `slug`, `title`, `city`, `region`, `area`, `layout`, `style`, `material`, `priceFrom`, `priceTo`, `days`, `completedAt`, `description`, `task`, `constraints`, `solution`, `result`, `mainImage`, `images`, `photosBefore`, `photosAfter`, `featured`, `order`, `seoTitle`, `seoDescription`, `seoKeywords`, `published`
- update fields: `title`, `city`, `region`, `area`, `layout`, `style`, `material`, `priceFrom`, `priceTo`, `days`, `completedAt`, `description`, `task`, `constraints`, `solution`, `result`, `mainImage`, `images`, `photosBefore`, `photosAfter`, `featured`, `order`, `seoTitle`, `seoDescription`, `seoKeywords`, `published`
- parsed but ignored: `styleSlug`, `materialSlugs`, `scenarioSlugs`

`Locations`
- create fields: `externalId`, `slug`, `city`, `region`, `title`, `h1`, `intro`, `description`, `priceFrom`, `deliveryCost`, `deliveryDays`, `measureCost`, `timelineText`, `visitDetails`, `installDetails`, `images`, `areas`, `workZone`, `mapEmbed`, `features`, `faq`, `localIntro`, `uniquePoints`, `contentBlocks`, `ctaHeadline`, `ctaSubtext`, `phone`, `address`, `seoTitle`, `seoDescription`, `published`
- update fields: `city`, `region`, `title`, `h1`, `intro`, `description`, `priceFrom`, `deliveryCost`, `deliveryDays`, `measureCost`, `timelineText`, `visitDetails`, `installDetails`, `images`, `areas`, `workZone`, `mapEmbed`, `features`, `faq`, `localIntro`, `uniquePoints`, `contentBlocks`, `ctaHeadline`, `ctaSubtext`, `phone`, `address`, `seoTitle`, `seoDescription`, `published`
- parsed but ignored: `caseSlugs`, `reviewIds`

## Validate / Preview / Apply Flow

### Validate + preview

1. Admin uploads workbook to `POST /kapi/admin/imports/bulk/v1/upload`.
2. Route requires `requireAdmin()`.
3. Server reads the workbook with `xlsx`.
4. Each sheet is matched by canonical name or alias.
5. Unknown sheets are skipped with a workbook-level warning.
6. Rows are normalized through Zod-backed parsers.
7. Preview compares incoming row data with current DB snapshot.
8. A session JSON file is written to `.tmp/bulk-import-sessions/<sessionId>.json`.
9. API returns preview payload with `summary`, `issues`, `rows`, `expiresAt`.

Preview row operation values:
- `create`
- `update`
- `unchanged`
- `invalid`

A row becomes `invalid` if it has at least one `error`.

### Reload preview

`GET /kapi/admin/imports/bulk/v1/sessions/<sessionId>`

Behavior:
- requires admin auth
- returns saved preview session
- returns `404` when session is missing
- throws expiration error after TTL

### Apply

`POST /kapi/admin/imports/bulk/v1/sessions/<sessionId>/confirm`

Behavior:
- requires admin auth
- reloads saved preview session
- skips rows with `operation = invalid` or missing payload
- applies entities in fixed order: `kitchens -> styles -> materials -> scenarios -> portfolio -> locations`
- creates missing records by `externalId`
- updates existing records only within the safe update allowlist
- stores `appliedAt` and `applyResult.summary`
- if the same session is applied again, returns the stored result without reapplying

## Constraints And Protective Rules

Hard blockers that make a row `invalid`:
- Zod/schema parsing errors
- non-numeric values in numeric columns that must parse as integers
- duplicate `externalId` inside the same sheet
- duplicate `slug` inside the same sheet for rows that would create new records
- create-time slug collision with another existing record
- invalid slug format for `slug` and slug-reference arrays
- image URL that is not a direct image URL
- image URL that resolves to `text/html` or another non-image content-type
- known page/share image links such as `postimg.cc/...` or `postimages.org/...`
- invalid `Kitchens.mainImage`
- invalid image URLs inside `Kitchens.images`
- invalid `Style.image`
- invalid `Material.image`
- invalid `Scenario.ctaHref`
- invalid `Portfolio.mainImage`
- invalid image URLs inside `Portfolio.images`
- invalid image URLs inside `Portfolio.photosBefore`
- invalid image URLs inside `Portfolio.photosAfter`
- invalid image URLs inside `Locations.images`
- missing `Portfolio.mainImage` when the row is published and no gallery fallback exists
- `Portfolio.priceTo < priceFrom` when `priceTo > 0`
- negative `Portfolio.order`
- workbook with no supported sheets

Warnings that do not block apply:
- unknown workbook sheets
- legacy record matched by `slug` and scheduled for `externalId` backfill on apply
- slug changes on existing records
- non-empty out-of-scope fields that are parsed but ignored in safe v1
- published `Style` without image
- published `Style` without `intro`, `description`, and `content`
- published `Material` without image
- published `Material` without `intro`, `description`, and `content`
- published `Scenario` without `intro`
- incomplete `Scenario.features` items
- `Portfolio.mainImage` missing from `Portfolio.images`
- empty or zero `Portfolio.area`
- empty or zero `Portfolio.days`
- published `Portfolio` without description
- text fields above recommended max lengths
- arrays above recommended max sizes
- duplicate image URLs inside portfolio image arrays

Current validation boundary in code:
- there is no DB existence check for related slugs
- relation arrays are only checked for slug format, not for whether the target record exists
- direct image validation accepts:
- relative site paths with an image file extension such as `/uploads/photo.webp`
- absolute `http` / `https` URLs that are confirmed as `image/*` by `HEAD` or fallback `GET`
- direct file links with standard image extensions such as `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`, `.avif`, `.bmp`, `.ico`, `.tif`, `.tiff`
- direct image validation rejects:
- page/share links such as `https://postimg.cc/...` and `https://postimages.org/...`
- URLs that return HTML pages, landing pages, or another non-image `content-type`
- URLs that cannot be confirmed as direct image links during preview validation

## Exclusions And Unsupported Cases

Explicit exclusions in v1:
- delete semantics
- slug rewrites for existing records
- cross-entity relation mutation through ignored relation fields
- bulk editing `reviewIds`
- bulk editing location `caseSlugs`
- importing calculator/configurator data
- auth or login changes
- media upload pipeline
- automatic smoke run after apply

Known unsupported-but-parsed cases:
- workbook may contain ignored relation columns and still preview successfully
- those fields can produce warnings but do not participate in apply diff or DB mutation

## Post-Import Smoke Checks

Smoke suite:
- `tests/smoke/post-import.smoke.spec.ts`

What it verifies:
- homepage renders without hard runtime failure
- homepage still shows `h1`, hero CTA, FAQ items, catalog links, and portfolio links
- catalog index stays non-empty
- representative kitchen detail `/catalog/uglovye-kuhni` renders content and lead form
- portfolio index stays non-empty
- materials index stays non-empty
- representative location page `/locations/brest` renders content and form
- suite runs on both desktop and mobile projects

The calculator is intentionally out of scope for both the import and the smoke suite.

Run commands:

```bash
cd artifacts/kuhni-na-zakaz
pnpm exec playwright install chromium
pnpm smoke:post-import
```

Audit current legacy coverage:

```bash
pnpm bulk-import:audit-external-ids
```

Headed run:

```bash
pnpm smoke:post-import:headed
```

Runtime assumptions:
- Playwright starts the app with `pnpm dev`
- default base URL is `http://127.0.0.1:3001`
- a working `DATABASE_URL` is required

## Operator Checklist

1. Prepare workbook with only the six supported sheets.
2. Prefer canonical headers and canonical sheet names.
3. Treat `externalId` as mandatory stable identity.
4. Review preview for every `error` and clear them before apply.
5. Review warnings for ignored fields and thin published content.
6. Apply before session expiration.
7. Run post-import smoke checks immediately after apply.
