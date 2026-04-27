# AI Agent Architecture

## Goal

Build a local AI operator foundation for `kuhni-na-zakaz` using an OpenClaw-style workflow without enabling dangerous autonomous behavior.

The first stage is policy-only:

- define safety modes
- define entity safety rules
- define review requirements
- define allowed and disallowed actions
- define future prompts/skills/knowledge structure

This stage does not change production logic.

## Project Context

- The project is a custom Next.js application with an internal admin panel.
- Prisma schema is the source of truth for entities and field names.
- Admin access is session-cookie based.
- SEO is spread between global metadata files and route-level metadata generation.

## First-Wave Entities

The first safe automation wave is limited to:

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

These entities can support audit, draft preparation, and review workflows.

## High-Risk Surfaces

The following surfaces are explicitly high-risk and are not part of the first automation wave:

- `PriceRule`
- `artifacts/kuhni-na-zakaz/lib/kitchen-configurator/price.ts`
- `artifacts/kuhni-na-zakaz/lib/auth.ts`
- `artifacts/kuhni-na-zakaz/middleware.ts`
- settings and global configuration surfaces
- publish flag changes
- slug changes
- route-level metadata core

## Source Of Truth Files

The operator foundation should rely on these files first:

- `artifacts/kuhni-na-zakaz/prisma/schema.prisma`
- `artifacts/kuhni-na-zakaz/components/admin/LocationForm.tsx`
- `artifacts/kuhni-na-zakaz/components/admin/KitchenForm.tsx`
- `artifacts/kuhni-na-zakaz/components/admin/BlogPostForm.tsx`
- `artifacts/kuhni-na-zakaz/components/admin/PortfolioCaseForm.tsx`
- `artifacts/kuhni-na-zakaz/app/layout.tsx`
- `artifacts/kuhni-na-zakaz/app/robots.ts`
- `artifacts/kuhni-na-zakaz/app/sitemap.ts`
- `project-docs/ADMIN_PANEL_SPEC.md`
- `project-docs/CONTENT_MODELS.md`
- `project-docs/SEO_STRATEGY.md`

## Safety Modes

### `read_only`

Purpose:

- inspect entities
- inspect admin structure
- inspect SEO behavior
- inspect source files and docs

Restrictions:

- no writes
- no publish changes
- no pricing changes
- no slug changes

### `draft_safe`

Purpose:

- prepare draft content
- prepare non-destructive entity updates
- generate review packets

Restrictions:

- no publish flips
- no slug changes
- no pricing updates
- no settings updates
- no auth or middleware changes
- no route-level metadata core changes

### `review_required`

Purpose:

- gate any sensitive change behind explicit human review

Applies to:

- publish flags
- slugs
- prices
- SEO metadata
- settings
- auth/session logic
- middleware
- calculator pricing logic

## Allowed Actions

- read schema, forms, docs, routes, and content entities
- produce draft copy
- produce audit reports
- produce review reports
- propose changes in structured form
- prepare safe updates to draft-friendly fields on first-wave entities

## Disallowed Actions

- auto-publish
- auto-edit pricing logic
- auto-edit auth/session logic
- auto-edit middleware
- auto-edit settings
- auto-change slugs
- auto-change sensitive SEO metadata
- auto-run migrations
- auto-touch production business routes

## Review Workflow

1. Agent reads entity, source files, and project docs.
2. Agent prepares a draft or recommendation.
3. Agent records the requested action and why it is safe or unsafe.
4. Sensitive surfaces are escalated to `review_required`.
5. Human approves or rejects.
6. Only approved safe changes can move forward in a later implementation phase.

## Why V1 Avoids Pricing, Auth, Publish, and Slugs

- `PriceRule` and configurator pricing directly affect commercial output.
- `auth.ts` and `middleware.ts` affect security boundaries.
- publish flags affect live production visibility.
- slugs affect routing, SEO, and internal linking.
- route-level metadata core affects search behavior globally.

These areas are too sensitive for first-wave automation and must stay behind explicit human review.
