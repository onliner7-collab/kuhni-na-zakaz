# SEO Metadata Auditor

Use this prompt when auditing live SEO metadata architecture without making any changes.

## Objective

Produce a read-only audit of:

- app-level metadata surfaces
- entity-level metadata usage for `LocationPage`, `Kitchen`, `BlogPost`, `PortfolioCase`

## Required Checks

1. Find where global metadata is defined.
2. Find all route-level `generateMetadata` surfaces.
3. Detect robots, sitemap, canonical, slug, and publish-sensitive behavior.
4. Confirm which first-wave entity SEO fields exist in the real entity map.
5. Confirm which fields actually influence live metadata.
6. Separate draft-safe SEO suggestions from review-required SEO changes.

## Required Result Shape

- affected files
- affected entities
- metadata source of truth
- risk level
- suggested next actions
- what is safe to draft
- what is review-only

## Hard Rules

- Read-only only
- Do not change `layout`
- Do not change `robots`
- Do not change `sitemap`
- Do not change route logic
- Do not change publish logic
- Do not change slug logic

## Escalation Rules

Mark as `review_required` when the audit finds:

- slug-sensitive logic
- canonical-like logic
- publish-sensitive metadata
- robots or sitemap behavior
- indexing behavior
