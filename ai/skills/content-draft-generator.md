---
name: content-draft-generator
description: Generate safe draft content packets for first-wave entities as report artifacts only, with no DB or live route writes.
---

# Content Draft Generator

## Purpose

Generate safe draft content packets for first-wave entities without writing to the database or changing live content.

## Supported Entities

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

## Allowed Modes

- `read_only`
- `draft_safe`

## Invokes Writer

- No

## Requires QA

- Yes, before any downstream apply step

## Required Inputs

- `ai/policies/entities.json`
- `ai/policies/review.json`
- `ai/prompts/content-draft-generator.md`
- relevant admin form files
- relevant live route files
- trusted seed or static content files when available

## Outputs

Write report artifacts only:

- `ai/reports/drafts/locationpage-drafts.json`
- `ai/reports/drafts/kitchen-drafts.json`
- `ai/reports/drafts/blogpost-drafts.json`
- `ai/reports/drafts/portfoliocase-drafts.json`
- `ai/reports/drafts/content-draft-summary.md`

## Forbidden Actions

- No DB writes
- No entity updates
- No publish
- No slug changes
- No metadata core changes
- No pricing/auth/settings changes

## Quality Rules

- Keep all factual claims grounded in trusted project inputs.
- Mark uncertainty via `riskFlags` and `dataNeeds`.
- Avoid repeated body copy across packets.
- Produce drafts that are easy for a human reviewer to edit and approve.
