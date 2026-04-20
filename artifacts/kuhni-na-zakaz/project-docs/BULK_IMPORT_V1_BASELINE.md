# Bulk Import v1 Baseline

Short safe-scope baseline for the implemented `bulk import v1`.

Source of truth:
- `project-docs/BULK_IMPORT_V1.md`
- `lib/bulk-import/v1.ts`
- `prisma/schema.prisma`
- `tests/smoke/post-import.smoke.spec.ts`

Operational closure docs:
- `project-docs/BULK_IMPORT_V1_FINAL_HANDOFF.md`
- `project-docs/BULK_IMPORT_V1_OPERATIONAL_SUMMARY_2026-04-20.md`

## Final Scope v1

Supported entities:
- `Kitchens`
- `Styles`
- `Materials`
- `Scenarios`
- `Portfolio`
- `Locations`

Supported transport and lifecycle:
- Excel workbook upload only
- preview session on local filesystem
- explicit confirm/apply
- upsert by `externalId`
- no delete flow
- session TTL is `1 hour`

Calculator/configurator data is out of scope.

## Identity

`externalId` is the stable import key on:
- `Kitchen`
- `StylePage`
- `MaterialPage`
- `ScenarioPage`
- `PortfolioCase`
- `LocationPage`

Rules:
- import creates missing records by `externalId`
- import updates existing records by `externalId`
- `externalId` itself is not treated as a mutable business field
- `slug` for existing records is frozen in v1

## Safe Mutation Boundary

Allowed creates:
- create can set `slug` plus the safe content fields for each entity

Allowed updates:
- update excludes `slug`, `externalId`, ids, and timestamp fields

Parsed but intentionally ignored in safe v1:
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

## Guardrails

Rows are blocked on:
- schema / normalization errors
- duplicate `externalId` in one sheet
- duplicate create-time `slug` in one sheet
- create-time slug collision with existing data
- invalid numeric values in numeric columns
- invalid URL / href checks implemented for style, material, scenario CTA, and portfolio media fields
- invalid published portfolio without `mainImage`
- invalid portfolio ordering / price bounds

Rows are warning-only on:
- unknown sheets
- ignored out-of-scope fields
- slug changes on existing records
- thin published content
- oversized text / arrays

Important current limitation:
- relation values are format-checked only; the code does not verify target existence in DB

## Explicit Exclusions

Excluded from v1:
- calculator/configurator import
- auth or login changes
- media upload / hosting
- delete / archive semantics
- blog, FAQ, reviews moderation, homepage blocks, static pages, site settings
- automatic smoke execution from the import flow

## Verification Target

After apply, run the smoke suite and confirm:
- homepage renders
- catalog stays non-empty
- portfolio stays non-empty
- materials stays non-empty
- representative location page renders

Calculator remains explicitly out of scope.

## Production Baseline (Closed)

Launch reference:
- Date: `2026-04-20`
- Workbook: `pilot-bulk-import-v1-2026-04-20.xlsx`
- Apply result: `created=4, updated=7, unchanged=0, invalid=0`
- Warnings: `2` (legacy location `externalId` backfill)

Idempotency validation after launch:
- Re-run summary: `create=0, update=0, unchanged=11, invalid=0, errors=0, warnings=0`
