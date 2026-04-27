---
name: seo-metadata-auditor
description: Read-only audit of app-level and first-wave entity-level SEO metadata architecture, live metadata dependencies, and risky SEO surfaces.
---

# SEO Metadata Auditor

Use this skill when the AI operator needs a safe audit of how SEO metadata is defined, overridden, and exposed in the project.

## Purpose

- Audit app-level SEO surfaces:
  - `artifacts/kuhni-na-zakaz/app/layout.tsx`
  - `artifacts/kuhni-na-zakaz/app/robots.ts`
  - `artifacts/kuhni-na-zakaz/app/sitemap.ts`
  - route-level `generateMetadata`
- Audit entity-level SEO metadata usage for:
  - `LocationPage`
  - `Kitchen`
  - `BlogPost`
  - `PortfolioCase`
- Identify metadata source of truth, conflicts, gaps, live metadata dependencies, and risky SEO surfaces.

## Mode

- `read_only` only

## Supported Entities

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

## Required Inputs

- app SEO files under `artifacts/kuhni-na-zakaz/app/**`
- `ai/reports/prisma-entity-map.json`
- `ai/policies/entities.json`
- `ai/reports/seo-surface-map.json`

## Required Outputs

- `ai/reports/seo/metadata-audit.json`
- `ai/reports/seo/metadata-audit-summary.md`
- `ai/reports/seo/live-seo-risk-map.json`

## Detection Scope

### App-Level

- global metadata export
- route-level `generateMetadata`
- robots behavior
- sitemap behavior
- canonical-like logic
- slug-sensitive routing links
- publish-sensitive indexing logic

### Entity-Level

- presence of `seoTitle`
- presence of `seoDescription`
- presence of `slug`
- presence of `published`
- real route usage in live metadata
- fallback behavior from content fields such as `title`, `description`, `excerpt`

## Safety Rules

- No code changes
- No DB writes
- No admin API writes
- No route changes
- No publish changes
- No slug changes
- No robots or sitemap edits

If the audit finds slug-sensitive logic, canonical behavior, publish-sensitive metadata, or robots/sitemap/indexing behavior, mark it as `review_required`.
