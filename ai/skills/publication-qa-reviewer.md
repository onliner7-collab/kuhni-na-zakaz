---
name: publication-qa-reviewer
description: Review draft content packets for content quality, SEO completeness, and safety policy compliance before any manual apply or review decision.
---

# Publication QA Reviewer

Use this skill when the agent needs to review generated draft packets before human review or manual apply.

## Purpose

- Check content quality for thin copy, repetition, spam signals, and unverified claims.
- Check SEO completeness for title, H1, meta description, FAQ, CTA, and internal links.
- Check safety compliance against draft-safe policies and review-required fields.

## Inputs

- `ai/reports/drafts/locationpage-drafts.json`
- `ai/reports/drafts/kitchen-drafts.json`
- `ai/reports/drafts/blogpost-drafts.json`
- `ai/reports/drafts/portfoliocase-drafts.json`
- `ai/policies/modes.json`
- `ai/policies/entities.json`
- `ai/policies/actions.json`
- `ai/policies/review.json`

## Supported Entities

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

## Allowed Modes

- `draft_safe`
- `review_required`

## Workflow

1. Load the draft packets and policy files.
2. Run content quality checks.
3. Run SEO completeness checks.
4. Run safety checks against forbidden surfaces and review-required fields.
5. Produce `PASS`, `NEEDS_REVIEW`, or `FAIL`.
6. Save review packets only under `ai/reports/reviews/`.

## Hard Stops

- Do not write to production entities.
- Do not publish content.
- Do not modify `slug`, `published`, pricing, auth, middleware, settings, or metadata core.
- Do not call admin APIs.

## Outputs

- `ai/reports/reviews/publication-qa-review.json`
- `ai/reports/reviews/publication-qa-summary.md`
