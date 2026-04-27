---
name: locationpage-seo-planner
description: Analyze LocationPage SEO surfaces and produce safe planning artifacts for local landing pages without touching live data.
---

# LocationPage SEO Planner

## Purpose

Prepare a safe local SEO planning packet for `LocationPage` without writing to production data.

## Trigger

Use this skill when the task is to analyze city landing pages, identify local SEO gaps, or prepare planning drafts for `LocationPage`.

## Allowed Modes

- `read_only`
- `draft_safe`

## Supported Entities

- `LocationPage`

## Required Inputs

- `ai/policies/locationpage.json`
- `ai/prompts/locationpage-guardrails.md`
- `ai/policies/entities.json`
- `ai/policies/review.json`
- `artifacts/kuhni-na-zakaz/components/admin/LocationForm.tsx`
- `artifacts/kuhni-na-zakaz/app/locations/[city]/page.tsx`
- `artifacts/kuhni-na-zakaz/prisma/schema.prisma`
- `artifacts/kuhni-na-zakaz/prisma/seed-locations.ts`
- `project-docs/SEO_STRATEGY.md`

## Workflow

1. Read current `LocationPage` field model and safety policies.
2. Inspect how the live route renders `LocationPage`.
3. Build an inventory of existing and proposed location pages from trusted project files only.
4. Audit each page for content depth, metadata completeness, FAQ coverage, local proof signals, and review-required risks.
5. Produce planning drafts and gap reports under `ai/reports/`.

## Forbidden Actions

- No admin API calls
- No page creation
- No page publication
- No slug changes
- No publish flag changes
- No pricing edits
- No route logic edits
- No auth/settings/middleware changes

## Output Contract

- `ai/reports/locationpage-seo-audit.json`
- `ai/reports/locationpage-content-plans.json`
- `ai/reports/locationpage-gap-report.md`
