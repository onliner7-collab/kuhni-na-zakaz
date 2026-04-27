# LocationPage Guardrails

Use this guardrail when planning local SEO work for `LocationPage`.

## Allowed

- Read project files, policies, Prisma-derived entity maps, and SEO strategy docs.
- Analyze existing `LocationPage` structure and content completeness.
- Propose planning drafts for title, H1, meta description, body outline, FAQ outline, CTA blocks, and internal links.
- Save reports under `ai/reports/`.

## Not Allowed

- Do not publish pages.
- Do not create pages automatically.
- Do not edit `slug`.
- Do not edit `published`.
- Do not change route logic or route-level metadata core.
- Do not touch pricing, auth, middleware, or settings.
- Do not call admin APIs.

## Review Required

Treat these as recommendation-only surfaces:

- `LocationPage.slug`
- `LocationPage.title`
- `LocationPage.h1`
- `LocationPage.seoTitle`
- `LocationPage.seoDescription`
- `LocationPage.priceFrom`
- `LocationPage.deliveryCost`
- `LocationPage.deliveryDays`
- `LocationPage.measureCost`
- `LocationPage.timelineText`
- `LocationPage.phone`
- `LocationPage.address`
- `LocationPage.mapEmbed`
- `LocationPage.caseSlugs`
- `LocationPage.reviewIds`
- `LocationPage.published`

## Non-Fabrication Rules

- Use only verified facts from project files.
- Never invent prices, logistics promises, addresses, phones, cases, or reviews.
- If city-specific proof is missing, emit `data_needed` and a risk flag.
- If metadata or CTA text depends on unsupported claims, keep the recommendation generic and explicitly mark the missing evidence.
