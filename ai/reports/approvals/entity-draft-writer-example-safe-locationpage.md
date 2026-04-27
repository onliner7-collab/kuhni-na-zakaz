# Approval: entity-draft-writer-example-safe-locationpage

State: `approved_for_safe_apply`
Approved by: `human-reviewer`
Approval marker: `approved:2026-04-13T15:32:40.974Z:human-reviewer`
Safe apply eligible: `true`

## Allowed Fields
- `intro`
- `faq`
- `ctaHeadline`
- `ctaSubtext`

## Blocked Fields
- none

## Constraints
- apply only for draft_safe mode
- apply only with explicit approval marker
- apply only when QA is not FAIL
- no live publish
- no live admin writes
- no slug changes
- no pricing changes
