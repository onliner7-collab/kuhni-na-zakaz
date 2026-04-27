# Key Files Index

## Core app

- `artifacts/kuhni-na-zakaz/package.json`
  - Main site/admin workspace package.
  - Confirms Next.js app, Prisma workflows, and local run commands.

- `artifacts/kuhni-na-zakaz/app/layout.tsx`
  - Global metadata, robots defaults, verification placeholders, Organization JSON-LD.
  - Important for global SEO and site-wide rendering.

- `artifacts/kuhni-na-zakaz/middleware.ts`
  - Protects `/admin` routes and injects pathname header.
  - Important for admin access and guest-section restrictions.

## Auth and access

- `artifacts/kuhni-na-zakaz/lib/auth.ts`
  - Session creation and verification.
  - Defines JWT session payload and cookie behavior.
  - Sensitive: never auto-edit.

- `project-docs/ADMIN_PANEL_SPEC.md`
  - Human spec for roles, guest access, moderation, and admin concepts.
  - Useful as intent, but must be cross-checked against implementation.

## Database and entities

- `artifacts/kuhni-na-zakaz/prisma/schema.prisma`
  - Source of truth for models, roles, review statuses, pricing rules, settings, and content entities.
  - Highest-priority file for AI understanding.

- `artifacts/kuhni-na-zakaz/prisma/seed.ts`
  - Seeds initial data and can reveal expected starting entities/config.

- `artifacts/kuhni-na-zakaz/prisma/seed-locations.ts`
  - Helpful for city-page structure and default local SEO content.

- `artifacts/kuhni-na-zakaz/prisma/seed-blog.ts`
  - Helpful for blog content examples and publication patterns.

## Admin forms

- `artifacts/kuhni-na-zakaz/components/admin/KitchenForm.tsx`
  - Real editable field map for kitchen catalog items.

- `artifacts/kuhni-na-zakaz/components/admin/BlogPostForm.tsx`
  - Real editable field map for blog posts.

- `artifacts/kuhni-na-zakaz/components/admin/LocationForm.tsx`
  - Real editable field map for local landing pages.
  - One of the most important files for local SEO automation.

- `artifacts/kuhni-na-zakaz/components/admin/PriceRulesEditor.tsx`
  - Pricing-rule editing UI.
  - High-risk operational surface.

- `artifacts/kuhni-na-zakaz/components/admin/PortfolioCaseForm.tsx`
  - Use when mapping case-study fields and proof content.

- `artifacts/kuhni-na-zakaz/components/admin/SettingsForm.tsx`
  - Use when reviewing editable site-wide settings.
  - Sensitive because it can expose contact and notification settings.

## Admin APIs

- `artifacts/kuhni-na-zakaz/app/kapi/admin/kitchens/route.ts`
  - Create/list API for kitchens.
  - Good example of schema validation and publication control.

- `artifacts/kuhni-na-zakaz/app/kapi/admin/prices/route.ts`
  - Bulk update API for `PriceRule`.
  - High-risk endpoint.

- `artifacts/kuhni-na-zakaz/app/kapi/admin/static-pages/route.ts`
  - Static-page fetch endpoint.

- `artifacts/kuhni-na-zakaz/app/kapi/auth/login/route.ts`
  - Inspect when documenting login flow and rate limiting behavior.

## Public page rendering

- `artifacts/kuhni-na-zakaz/app/catalog/[slug]/page.tsx`
  - Shows mixed DB + hardcoded fallback catalog logic.
  - Important to avoid assuming every page is CMS-driven.

- `artifacts/kuhni-na-zakaz/app/locations/[city]/page.tsx`
  - Main local SEO landing-page renderer.
  - Includes metadata generation and JSON-LD.

- `artifacts/kuhni-na-zakaz/app/blog/[slug]/page.tsx`
  - Use for blog SEO/rendering rules.

- `artifacts/kuhni-na-zakaz/app/portfolio/[slug]/page.tsx`
  - Use for case-study rendering and internal-link patterns.

## SEO-specific files

- `artifacts/kuhni-na-zakaz/app/robots.ts`
  - Robots rules and disallowed sections.

- `artifacts/kuhni-na-zakaz/app/sitemap.ts`
  - Sitemap generation from both static and DB-driven routes.

- `project-docs/SEO_STRATEGY.md`
  - Human strategy doc for search positioning and page goals.

## Pricing / configurator

- `artifacts/kuhni-na-zakaz/lib/kitchen-configurator/price.ts`
  - Core calculator price breakdown logic.
  - Must not be changed by AI without explicit business approval.

- `artifacts/kuhni-na-zakaz/lib/kitchen-configurator/types.ts`
  - Type definitions for pricing/configurator entities.

- `artifacts/kuhni-na-zakaz/components/configurator/KitchenConfigurator.tsx`
  - Main visual/configurator UI entry point.

## Content docs

- `project-docs/PROJECT_OVERVIEW.md`
  - Business goals, positioning, geography, and audience context.

- `project-docs/CONTENT_MODELS.md`
  - Human-readable summary of core entities.

- `project-docs/ROUTES_MAP.md`
  - Public route map and intended navigation.

- `project-docs/TECHNICAL_SPEC.md`
  - Higher-level system design and assumptions.
