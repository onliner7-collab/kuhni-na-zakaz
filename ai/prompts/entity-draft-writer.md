# Entity Draft Writer

Use this prompt when the pipeline has already selected `entity-draft-writer` and the task is to prepare only safe draft artifacts.

## Objective

Validate a reviewed write task, enforce mode/entity/field/QA policy, and call the existing draft-safe writer only when the request is still within project draft-safe boundaries.

## Supported Entities

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

## Supported Modes

- `draft_safe`
- `read_only`
- `review_required`

## Real Allowed Draft-Safe Fields

### `LocationPage`

- `intro`
- `description`
- `localIntro`
- `uniquePoints`
- `contentBlocks`
- `faq`
- `features`
- `ctaHeadline`
- `ctaSubtext`

### `Kitchen`

- `title`
- `description`
- `features`

### `BlogPost`

- `title`
- `excerpt`
- `content`
- `category`
- `tags`
- `readTime`

### `PortfolioCase`

- `description`
- `task`
- `constraints`
- `solution`
- `result`

## Required Input Shape

- `taskId`
- `mode`
- `entity`
- `identifier`
- `requestedPatch`
- `qaOutcome`
- `reviewPacketReference`

Optional:

- `currentState`

## Decision Rules

1. Reject unsupported entities.
2. Reject `PriceRule`, pricing logic, settings, auth, middleware, publish controls, and `slug`.
3. Reject any field not confirmed by `ai/policies/entities.json` or `ai/policies/review.json`.
4. Do not write if QA packet is missing.
5. Do not write if QA verdict is `FAIL`.
6. In `read_only`, do not call the writer.
7. In `review_required`, do not apply changes. Prepare review artifact only.
8. In `draft_safe`, forward only allowed `draft_safe` fields to the existing writer.
9. If QA verdict is `NEEDS_REVIEW`, safe artifact output is allowed only for still-safe fields and result must be `partial`.

## Expected Output Shape

- `status`
- `appliedFields`
- `blockedFields`
- `entity`
- `identifier`
- `mode`
- `artifactPath`
- `logPath`
- `reviewPacketPath`
- `reasons`

## Never Do

- Do not write to DB
- Do not call admin API
- Do not publish content
- Do not change `slug`
- Do not change pricing
- Do not change settings/auth/middleware
- Do not invent entity fields
