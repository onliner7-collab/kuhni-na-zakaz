# Bulk Import v1 Operational Summary

Date: `2026-04-20`
Release type: production closure / handoff

## Release Note (Short)

- `bulk import v1` rollout is complete and formally closed.
- Product admin import UI is live and used as the official import path.
- Production import baseline is established and validated.
- Post-import smoke checks passed.
- Calculator/configurator import remains out of scope for v1.

## Operational Outcome

- Workbook processed: `pilot-bulk-import-v1-2026-04-20.xlsx`
- Launch apply result:
  - `created: 4`
  - `updated: 7`
  - `unchanged: 0`
  - `invalid: 0`
  - `warnings: 2` (legacy `externalId` backfill)
- Follow-up idempotency re-run:
  - `create: 0`
  - `update: 0`
  - `unchanged: 11`
  - `invalid: 0`
  - `errors: 0`
  - `warnings: 0`

## Operational Procedure (Canonical)

1. Prepare workbook from template.
2. Upload in `/admin/imports`.
3. Review preview summary and issues.
4. Apply only when errors are zero.
5. Run post-import checks:
   - `pnpm smoke:post-import`
   - manual key-page checks from post-import checklist.

## Source Docs

- `project-docs/BULK_IMPORT_V1_FINAL_HANDOFF.md`
- `project-docs/BULK_IMPORT_V1.md`
- `project-docs/BULK_IMPORT_V1_BASELINE.md`
- `project-docs/BULK_IMPORT_V1_OPERATOR_GUIDE_RU.md`
- `project-docs/BULK_IMPORT_V1_POST_IMPORT_CHECKLIST_RU.md`
