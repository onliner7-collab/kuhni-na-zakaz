# Review Summary: locationpage-admin-safe-draft-example

State: `blocked`
Entity: `LocationPage` / `brest`
Mode: `draft_safe`
QA: `NEEDS_REVIEW`
Risk: `high`
Suggested next action: `reject`

## What Changed
- `slug`
- `title`
- `h1`
- `intro`
- `description`
- `localIntro`
- `features`
- `faq`
- `ctaHeadline`
- `ctaSubtext`
- `priceFrom`
- `published`
- `seoTitle`
- `seoDescription`

## What Is Safe
- `intro`
- `description`
- `localIntro`
- `features`
- `faq`
- `ctaHeadline`
- `ctaSubtext`

## What Is Blocked
- `h1`
- `priceFrom`
- `published`
- `seoDescription`
- `seoTitle`
- `slug`
- `title`

## What Requires Manual Review
- `h1`
- `title`

## Writer Eligibility
- eligible: `true`
- requires explicit approval: `true`
- qa not fail: `true`

## Reasons
- `slug_change_blocked`
- `review_required_field_requested`
- `pricing_change_blocked`
- `publish_change_blocked`
- `sensitive_metadata_blocked`
- `qa_review_required`
- `review_required_fields_blocked`
- `blocked_fields_present`
