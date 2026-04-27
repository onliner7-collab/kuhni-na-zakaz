# SEO Metadata Audit Summary

Generated: 2026-04-13T15:19:41.767Z
Mode: read_only

## App-Level

- Affected files: 17
- Risky surfaces: 15

### Conflicts

- Base URL mismatch: layout uses "https://kuhniby.by" but robots uses "https://kuhniminsk.by".

### Gaps

- Some route-level metadata surfaces do not declare canonical output: artifacts/kuhni-na-zakaz/app/admin/scenarios/[id]/page.tsx.

## Entity-Level

- LocationPage: live fields -> slug, title, description, seoTitle, seoDescription, published; risk=critical
- Kitchen: live fields -> title, slug, description, seoTitle, seoDescription, published; risk=critical
- BlogPost: live fields -> title, slug, excerpt, seoTitle, seoDescription, published; risk=critical
- PortfolioCase: live fields -> title, slug, description, seoTitle, seoDescription, seoKeywords, published; risk=critical

## Safe To Draft

- Draft SEO title suggestions in report artifacts only.
- Draft meta description suggestions in report artifacts only.
- Draft entity-level SEO recommendation packets without applying live metadata changes.

## Review Only

- slug-linked route metadata behavior
- canonical behavior
- published/indexing behavior
- robots policy
- sitemap generation
- live route-level generateMetadata changes

## Suggested Next Actions

- Review base URL consistency across layout, robots, and sitemap.
- Review Kitchen and BlogPost metadata fetch paths for unpublished slug behavior.
- Keep canonical, slug, publish, robots, and sitemap proposals in review_required.
