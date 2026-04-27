---
name: pricing-risk-guard
description: Inspect high-risk pricing, publish, slug, auth, and settings requests and return a blocked or review-required safety decision without applying changes.
---

# Pricing Risk Guard

Use this skill when a task touches pricing, publish state, slug logic, auth, settings, or another protected surface that must never be auto-applied.

## Purpose

- Detect protected fields and sensitive intents.
- Stop unsafe write-oriented tasks before they reach a writer.
- Return an explicit safety decision for orchestration runtime and reviewers.

## Supported Entities

- `PriceRule`
- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

## Allowed Modes

- `read_only`
- `review_required`
- `draft_safe`

## Protected Surfaces

- pricing
- publish
- slug
- auth
- settings
- middleware

## Outputs

- safety decision only
- optional registry execution artifact under `ai/reports/skill-executions/`

## Forbidden Actions

- No DB writes
- No admin API writes
- No publish
- No pricing apply
- No auth/settings changes
