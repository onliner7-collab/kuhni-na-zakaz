# Bulk Import v1 Final Handoff

Final closure package for `bulk import v1` after production go-live.

## Status

- Pilot/import phase: completed.
- Production import flow: completed and validated.
- System state: in operation.
- Calculator/configurator import: explicitly out of scope for v1.

## What Was Implemented

- Product admin UI flow at `/admin/imports`:
  - workbook upload
  - preview with summary and row-level issues
  - explicit `Confirm and apply`
- Backend import pipeline for six entities only:
  - `Kitchens`
  - `Styles`
  - `Materials`
  - `Scenarios`
  - `Portfolio`
  - `Locations`
- Safe apply boundary:
  - upsert by `externalId`
  - no delete/archive behavior
  - immutable slug on updates
  - strict direct-image validation
- Post-import verification:
  - smoke suite (`tests/smoke/post-import.smoke.spec.ts`)
  - manual key-page checks
  - duplicate/regression checks

## How To Use (Operator Path)

1. Open `/admin/imports`.
2. Upload one `.xlsx` workbook.
3. Review preview summary and all errors/warnings.
4. If there are errors: fix workbook and re-upload.
5. If preview is acceptable: run `Confirm and apply`.
6. Run post-import checks (smoke + manual checks).

## v1 Scope

Included:
- Import via admin UI only (`preview -> apply`)
- Six entity sheets listed above
- `externalId`-based create/update
- Post-import smoke checks run separately

Excluded:
- calculator/configurator import
- homepage/blog/FAQ/settings/reviews moderation import
- delete/archive semantics
- media upload/hosting pipeline
- automatic smoke run from import API

## Canonical Assets

- Template:
  - `project-docs/templates/bulk-import-v1-template.xlsx`
- Main technical runbook:
  - `project-docs/BULK_IMPORT_V1.md`
- Operator instruction (RU):
  - `project-docs/BULK_IMPORT_V1_OPERATOR_GUIDE_RU.md`
- Operator limitations (RU):
  - `project-docs/BULK_IMPORT_V1_OPERATOR_LIMITATIONS_RU.md`
- Post-import checklist (RU):
  - `project-docs/BULK_IMPORT_V1_POST_IMPORT_CHECKLIST_RU.md`
- Short baseline:
  - `project-docs/BULK_IMPORT_V1_BASELINE.md`

## How To Run Post-Import Checks

```bash
cd artifacts/kuhni-na-zakaz
pnpm smoke:post-import
```

Optional headed run:

```bash
cd artifacts/kuhni-na-zakaz
pnpm smoke:post-import:headed
```

## Real Launch Baseline

Reference production launch for this workbook:
- Date: `2026-04-20`
- Workbook: `pilot-bulk-import-v1-2026-04-20.xlsx`
- Apply summary: `created=4, updated=7, unchanged=0, invalid=0`
- Warnings: `2` (legacy `externalId` backfill for location records)

Idempotency re-check completed after launch:
- Re-run summary: `create=0, update=0, unchanged=11, invalid=0, errors=0, warnings=0`

## v2 Recommendations

1. Add relational existence checks (not only slug-format validation) for relation-like arrays.
2. Add first-class rollback tooling (automated restore script and operator playbook).
3. Add optional dry-run export (`preview.json` and diff snapshots) directly from UI.
4. Add centralized media ingestion/hosting pipeline and image canonicalization.
5. Add optional post-apply automated smoke trigger with stored report artifact.
6. Add import observability (session history page, metrics, alerting on invalid/warning spikes).
7. Add controlled support for currently ignored relation fields if business approves.
