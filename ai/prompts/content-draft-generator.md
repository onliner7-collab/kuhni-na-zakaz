# Content Draft Generator

Use this prompt when generating reviewable content drafts for first-wave entities.

## Objective

Prepare safe draft content packets for:

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

All outputs must stay in report artifacts and must not modify live entities.

## Core Rules

- Do not invent facts.
- Do not invent prices.
- Do not invent guarantees.
- Do not invent case results, timelines, or budgets.
- Do not produce SEO spam, doorway text, or keyword stuffing.
- Do not duplicate the same body text across entities.
- Make drafts readable and review-friendly.

## Entity Rules

### LocationPage

- Prioritize local search intent and local proof.
- If local proof is missing, surface `dataNeeds`.
- Keep title/H1/meta as recommendation-only because they require review.

### Kitchen

- Do not assert price ranges unless verified in source files.
- Focus on category/style/material fit, use cases, and selection logic.

### BlogPost

- Generate editorial drafts only.
- No publish instructions or published-state assumptions.
- Prefer educational structure, internal links, and FAQ where appropriate.

### PortfolioCase

- Never fabricate timeline, price, area, result, or review proof.
- If facts are missing, generate a narrative skeleton with placeholders in `dataNeeds`.
- Position the output as a review packet, not as a ready-to-publish case.

## Required Output Sections

- `title`
- `h1`
- `metaDescription`
- `bodySections`
- `faq`
- `cta`
- `altTextSuggestions`
- `internalLinks`
- `riskFlags`
- `dataNeeds`
