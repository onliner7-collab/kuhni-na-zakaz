# Promotion Plan (Safe Mode)

## Goal

Use the local AI agent to grow organic traffic and leads for `https://www.kuhni.minsk.by` without unsafe auto-publish behavior.

## Operating Modes

### 1) `audit_only`

- Crawl and analyze only.
- No admin writes.
- Output: SEO backlog with priorities.

### 2) `draft_only`

- Create or update content drafts in admin.
- `published` must stay `false`.
- Output: review-ready drafts.

### 3) `review_publish`

- Human reviews all diffs.
- Only approved pages are published manually.

## Weekly Loop

### Monday

- Run technical SEO and content gap audit.
- Refresh priority backlog (P0/P1/P2).

### Tuesday

- Generate 2-3 draft pages:
  - one commercial page
  - one local page
  - one blog article

### Wednesday

- Internal linking pass:
  - add contextual links
  - verify anchors
  - check orphan pages

### Thursday

- Rewrite weak metadata:
  - `title`
  - `meta description`
  - H1 consistency

### Friday

- QA pass:
  - spam check
  - duplication check
  - structure check
  - image-alt check (where supported)
- Prepare publish queue for human approval.

## Priority Rules

- P0:
  - indexation blockers
  - broken canonical or robots errors
  - missing critical templates
- P1:
  - weak commercial pages with low conversion intent
  - missing local pages for target regions
- P2:
  - blog support content
  - incremental metadata improvements

## Hard Safety Rules

- Never auto-publish.
- Never auto-change pricing rules.
- Never auto-change auth, users, permissions, deployment, or env settings.
- Never invent prices, guarantees, deadlines, addresses, or legal claims.
- Every write action must produce a change log:
  - entity
  - field
  - old value
  - new value

## Success Metrics

- Growth in indexed target pages.
- Growth in non-brand impressions and clicks.
- Increase in leads from organic landing pages.
- Share of pages with complete metadata and FAQ blocks.

