# AI Skill Router

Use this router before doing any task directly.

The router must decide:

1. task type
2. target entity or surface
3. target skill
4. execution mode
5. risk level
6. next step

Do not skip the router.

## Priority

1. Identify whether the request targets a forbidden or high-risk surface.
2. Identify the entity or route surface from real project files and reports.
3. Choose the narrowest valid skill.
4. Choose the lowest safe mode that can handle the task.
5. Return a structured routing decision before any apply step.

## Task Types

- `project_read`
- `entity_mapping`
- `seo_planning`
- `content_drafting`
- `draft_writing`
- `seo_metadata_audit`
- `qa_review`
- `pricing_risk_check`
- `admin_surface_analysis`
- `forbidden_request`

## Entity Detection

Use real project entities and surfaces only:

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`
- `PriceRule`
- `auth`
- `middleware`
- `settings`
- `route-level-seo-core`
- `admin-routes`
- `project-structure`
- `prisma-schema`

If the request mentions a field, route, DTO, or handler name, first match it against:

- `artifacts/kuhni-na-zakaz/prisma/schema.prisma`
- `ai/reports/prisma-entity-map.json`
- `ai/reports/admin-surface-map.json`
- `ai/reports/seo-surface-map.json`
- `ai/reports/risk-surfaces.json`

If the name is not confirmed by real project files, do not invent a mapping. Route to `project-structure-reader` or `prisma-entity-mapper` first.

## Skill Selection

### `project-structure-reader`

Use when the task is about:

- finding files
- understanding folders
- locating routes, forms, or source-of-truth files
- resolving uncertainty about where logic lives

Default mode: `read_only`

### `prisma-entity-mapper`

Use when the task is about:

- models
- fields
- relations
- entity safety categories
- confirming real field names before any draft/write work

Default mode: `read_only`

### `locationpage-seo-planner`

Use when the task is about:

- `LocationPage`
- local SEO planning
- city coverage
- local page gaps
- local page outlines

Default mode: `read_only`

Escalate to `draft_safe` only if producing draft planning artifacts.

### `content-draft-generator`

Use when the task is about:

- generating draft content
- title/H1/meta/body/FAQ/CTA drafts
- internal link suggestions
- alt-text suggestions

Allowed entities:

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

Default mode: `draft_safe`

### `entity-draft-writer`

Use when the task is about:

- taking an approved draft patch
- checking patch fields against entity safety matrix
- preparing or applying only draft-safe entity fields

Allowed entities:

- `LocationPage`
- `Kitchen`
- `BlogPost`
- `PortfolioCase`

Default mode: `draft_safe`

Never use this skill for pricing, publish, slug, auth, settings, or route-level metadata core.

### `seo-metadata-auditor`

Use when the task is about:

- auditing metadata
- finding title/meta/H1 gaps
- checking route-level metadata usage

Default mode: `read_only`

If the task asks to change metadata, route to `review_required`.

### `publication-qa-reviewer`

Use when the task is about:

- reviewing drafts
- checking quality and safety before manual apply
- producing `PASS`, `NEEDS_REVIEW`, or `FAIL`

Default mode: `draft_safe`

### `pricing-risk-guard`

Use when the task is about:

- `PriceRule`
- `price.ts`
- calculator pricing
- price ranges
- commercial logic

Default mode: `review_required`

If the request asks to apply pricing changes automatically, treat it as forbidden.

### `admin-route-surface-mapper`

Use when the task is about:

- `app/kapi/admin/**`
- admin route capabilities
- safe-looking vs high-risk endpoints
- admin attack surface or write surface discovery

Default mode: `read_only`

## Mode Selection

### `read_only`

Choose when the task only needs:

- reading code
- reading docs
- reading reports
- mapping entities
- mapping routes
- auditing structure

### `draft_safe`

Choose when the task needs:

- draft generation
- safe draft packet preparation
- QA review of draft packets
- draft-safe entity writing on allowed fields only

### `review_required`

Choose when the task touches:

- pricing
- `PriceRule`
- `price.ts`
- `slug`
- publish state
- sensitive SEO metadata
- auth
- middleware
- settings
- route-level SEO core

## Risk Selection

- `low`: structure reading or non-sensitive mapping
- `medium`: draft planning or content drafting on first-wave entities
- `high`: tasks touching review-required fields or admin write surfaces
- `critical`: pricing, auth, middleware, settings, publish, slug, or metadata core apply requests

## Special Cases

### Pricing

If the task mentions:

- `PriceRule`
- `price.ts`
- calculator price logic
- price formulas
- price recalculation

Route to:

- skill: `pricing-risk-guard`
- mode: `review_required`
- risk: `critical`

### Auth, middleware, settings

If the task mentions:

- `auth.ts`
- `middleware.ts`
- admin auth
- roles
- settings routes
- `SettingsForm`

Route to:

- skill: `pricing-risk-guard`
- mode: `review_required`
- risk: `critical`

If the request asks for direct autonomous changes, mark as `forbidden_request`.

### Publish and slug

If the task mentions:

- `published`
- `publish`
- `slug`
- route path changes

Route to:

- mode: `review_required`
- risk: `high` or `critical`

Use the narrowest matching skill for inspection or review, but never allow draft-safe auto-apply.

### Route-level SEO core

If the task targets:

- `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- route-level `generateMetadata`

Route to:

- `seo-metadata-auditor` for reading and auditing
- `review_required` for any proposed change

### LocationPage planning

If the task is about local SEO planning for cities or local landing pages:

- skill: `locationpage-seo-planner`
- mode: `read_only` or `draft_safe`
- risk: `medium`

## Required Router Output

Return a structured decision with:

- `task_type`
- `target_entity`
- `target_surface`
- `selected_skill`
- `selected_mode`
- `risk_level`
- `allowed_to_proceed`
- `why`
- `next_step`

## Hard Rules

- Do not guess entity fields or route handlers.
- Do not invent DTOs or write surfaces.
- Do not bypass policy files.
- Do not route around `review_required`.
- Do not treat a high-risk surface as first-wave draft-safe work.
