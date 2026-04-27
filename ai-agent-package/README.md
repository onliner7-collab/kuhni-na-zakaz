# AI Agent Package for `kuhni-na-zakaz`

## Purpose

This package documents the real project structure and safe automation surface for a local AI agent working with `https://www.kuhni.minsk.by`.

It is based on the actual local repository at `C:/Users/User/Desktop/kuhni-na-zakaz`.

## Executive Summary

- The site is a custom Next.js 15 App Router application, not an external CMS.
- Public site and admin panel live in the same app: `artifacts/kuhni-na-zakaz`.
- Data storage uses Prisma + PostgreSQL, with the main schema in `artifacts/kuhni-na-zakaz/prisma/schema.prisma`.
- Admin API endpoints are internal Next route handlers under `artifacts/kuhni-na-zakaz/app/kapi/admin/**`.
- Access control is session-cookie based with JWT signing in `artifacts/kuhni-na-zakaz/lib/auth.ts` and path protection in `artifacts/kuhni-na-zakaz/middleware.ts`.
- Publication status for most content is controlled by a boolean `published` field rather than a full revision workflow.
- The project already contains a constrained guest access concept in schema and docs, but the implementation appears lighter than the full spec.
- SEO is split between global layout metadata, route-level `generateMetadata`, `app/robots.ts`, and `app/sitemap.ts`.
- Pricing uses two layers:
  - simple content-facing price ranges in content entities such as `Kitchen`, `LocationPage`, `StylePage`, `MaterialPage`
  - calculator/configurator logic and `PriceRule` records for rule-driven pricing.

## Stack

- Framework: Next.js 15 App Router
- UI: React 19, Tailwind CSS 4
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- Auth/session: JWT via `jose`, cookie-based session
- Package management: pnpm workspaces

## Main Project Areas

- Main site and admin app: `artifacts/kuhni-na-zakaz`
- Separate API server workspace: `artifacts/api-server`
- Shared db workspace: `lib/db`
- Shared generated API clients/spec: `lib/api-client-react`, `lib/api-spec`, `lib/api-zod`
- Project docs: `project-docs`
- Deployment assets: `deploy`

## CMS / Admin Model

This is a custom internal CMS implemented directly inside the Next app.

### Admin UI

- Admin pages live under `artifacts/kuhni-na-zakaz/app/admin/**`
- Admin forms live under `artifacts/kuhni-na-zakaz/components/admin/**`
- Examples:
  - kitchens: `app/admin/kitchens/**`, `components/admin/KitchenForm.tsx`
  - locations: `app/admin/locations/**`, `components/admin/LocationForm.tsx`
  - blog: `app/admin/blog/**`, `components/admin/BlogPostForm.tsx`
  - prices: `app/admin/prices/page.tsx`, `components/admin/PriceRulesEditor.tsx`

### Admin API

- Internal API routes live under `artifacts/kuhni-na-zakaz/app/kapi/admin/**`
- Examples:
  - kitchens: `app/kapi/admin/kitchens/route.ts`
  - prices: `app/kapi/admin/prices/route.ts`
  - static pages: `app/kapi/admin/static-pages/route.ts`

### Auth / Access

- Session creation and verification: `artifacts/kuhni-na-zakaz/lib/auth.ts`
- Middleware path guard: `artifacts/kuhni-na-zakaz/middleware.ts`
- Session cookie name: `kuhni_session`
- Session payload can include:
  - `userId`
  - `email`
  - `name`
  - `role`
  - `guestAccessId`
  - `guestSections`
  - `guestActions`

## Roles and Safety

### Confirmed in schema

From `artifacts/kuhni-na-zakaz/prisma/schema.prisma`:

- `UserRole`:
  - `SUPER_ADMIN`
  - `MANAGER`
- `GuestAccess` model exists with:
  - `allowedSections`
  - `allowedActions`
  - `loginToken`
  - expiration and revoke fields
- `ActivityLog` model exists

### Confirmed in docs

From `project-docs/ADMIN_PANEL_SPEC.md`:

- documented roles:
  - Super Admin
  - Manager
  - Guest Admin
- documented idea:
  - temporary restricted guest access
  - action logging
  - limited sections/actions

### Important implementation note

The schema and middleware clearly support restricted guest routing, but the current route handlers commonly check only for “has session” or `requireAdmin()`. For AI automation this means:

- do not assume fine-grained ACL is enforced everywhere;
- treat destructive and publishing actions as `review_required`;
- prefer a separate low-privilege account plus external workflow restrictions.

## Publication Workflow

The real implementation is mostly boolean publish flags, not a full editorial workflow.

### Confirmed patterns

- `Kitchen.published`
- `PortfolioCase.published`
- `BlogPost.published`
- `LocationPage.published`
- `StylePage.published`
- `MaterialPage.published`
- `StaticPage.published`
- `HomepageBlock.published`

### Special case

- `Review.status` uses:
  - `NEW`
  - `PENDING`
  - `PUBLISHED`
  - `REJECTED`
  - `DELETED`

### Conclusion

Safe AI mode should be designed as:

- `read_only`: inspect only
- `draft_safe`: create/update items with `published = false`
- `review_required`: any change that flips `published`, edits prices, settings, or permissions
- `never_auto_edit`: auth, tokens, user management, deployment, infrastructure settings

## Main Content Entities

These are confirmed in `artifacts/kuhni-na-zakaz/prisma/schema.prisma`.

### 1. `Kitchen`

Purpose:

- catalog item / commercial kitchen page

Core fields:

- `title`
- `slug`
- `description`
- `category`
- `style`
- `material`
- `priceFrom`
- `priceTo`
- `features`
- `images`
- `mainImage`
- `seoTitle`
- `seoDescription`
- `published`

AI safety:

- `title`: `draft_safe`
- `slug`: `review_required`
- `description`: `draft_safe`
- `category`, `style`, `material`: `review_required`
- `priceFrom`, `priceTo`: `review_required`
- `features`: `draft_safe`
- `images`, `mainImage`: `review_required`
- `seoTitle`, `seoDescription`: `draft_safe`
- `published`: `review_required`

### 2. `PortfolioCase`

Purpose:

- real project / proof page

Core fields:

- `title`
- `slug`
- `city`
- `region`
- `area`
- `layout`
- `style`
- `styleSlug`
- `material`
- `materialSlugs`
- `scenarioSlugs`
- `priceFrom`
- `priceTo`
- `days`
- `description`
- `task`
- `constraints`
- `solution`
- `result`
- `mainImage`
- `images`
- `photosBefore`
- `photosAfter`
- `reviewIds`
- `featured`
- `seoTitle`
- `seoDescription`
- `seoKeywords`
- `published`

AI safety:

- case narrative fields: `draft_safe`
- price, timeline, linked reviews: `review_required`
- images: `review_required`
- slug: `review_required`
- published flag: `review_required`

### 3. `BlogPost`

Purpose:

- article / supporting SEO content

Core fields:

- `title`
- `slug`
- `excerpt`
- `content`
- `category`
- `tags`
- `readTime`
- `relatedCaseSlugs`
- `relatedStyleSlugs`
- `relatedScenarioSlugs`
- `coverImage`
- `seoTitle`
- `seoDescription`
- `published`
- `publishedAt`

AI safety:

- article text fields: `draft_safe`
- related slugs: `review_required`
- cover image: `review_required`
- slug: `review_required`
- published: `review_required`

### 4. `LocationPage`

Purpose:

- local SEO landing page per city/region

Core fields:

- `city`
- `slug`
- `region`
- `title`
- `h1`
- `intro`
- `description`
- `priceFrom`
- `deliveryCost`
- `deliveryDays`
- `measureCost`
- `timelineText`
- `visitDetails`
- `installDetails`
- `images`
- `areas`
- `workZone`
- `mapEmbed`
- `features`
- `faq`
- `localIntro`
- `uniquePoints`
- `contentBlocks`
- `caseSlugs`
- `reviewIds`
- `ctaHeadline`
- `ctaSubtext`
- `phone`
- `address`
- `seoTitle`
- `seoDescription`
- `published`

AI safety:

- local content, faq, unique points, content blocks: `draft_safe`
- slug, title, h1, seoTitle, seoDescription: `review_required`
- linked case/review relations: `review_required`
- phone, address, mapEmbed: `review_required`
- pricing/logistics claims: `review_required`
- published: `review_required`

### 5. `StylePage`

Purpose:

- style landing page

Core fields:

- `slug`
- `title`
- `headline`
- `description`
- `intro`
- `content`
- `suitableFor`
- `pros`
- `cons`
- `careGuide`
- `pairsWith`
- `budgetLevel`
- `priceFrom`
- `image`
- `relatedMaterials`
- `relatedCaseSlugs`
- `relatedScenarioSlugs`
- `seoTitle`
- `seoDescription`
- `seoKeywords`
- `order`
- `published`

AI safety:

- explanatory text: `draft_safe`
- budget, price, relations, image: `review_required`
- slug and publish state: `review_required`

### 6. `MaterialPage`

Purpose:

- material landing page

Core fields:

- `slug`
- `title`
- `headline`
- `description`
- `intro`
- `content`
- `pros`
- `cons`
- `suitableFor`
- `careGuide`
- `budgetLevel`
- `pricePer`
- `priceFrom`
- `image`
- `relatedStyles`
- `relatedCaseSlugs`
- `relatedScenarioSlugs`
- `seoTitle`
- `seoDescription`
- `seoKeywords`
- `order`
- `published`

AI safety:

- explanatory text: `draft_safe`
- price and compatibility claims: `review_required`
- image and relations: `review_required`
- slug and publish state: `review_required`

### 7. `StaticPage`

Purpose:

- informational pages such as about, delivery, warranty

Core fields:

- `slug`
- `title`
- `content`
- `seoTitle`
- `seoDescription`
- `published`

AI safety:

- content: `draft_safe`
- slug: `review_required`
- published: `review_required`

### 8. `Review`

Purpose:

- moderated user reviews

Core fields:

- `name`
- `city`
- `region`
- `phone`
- `rating`
- `text`
- `date`
- `caseSlug`
- `source`
- `sourceUrl`
- `featured`
- `managerNote`
- `status`
- `moderatedById`
- `moderatedAt`
- `rejectionReason`

AI safety:

- moderation notes: `review_required`
- public review text/source/rating: `never_auto_edit` without human verification
- status changes: `review_required`

### 9. Pricing / calculator support entities

- `PriceRule`
- `HomepageBlock`
- configurator models later in schema
- `SavedConfig`
- `Lead`
- `FavoriteCase`

AI safety:

- price rules: `never_auto_edit` unless explicit supervised mode
- homepage blocks: `review_required`
- lead records: `read_only`
- saved configs/favorites: `read_only`

## Representative Page Field Maps

### Kitchen page

Confirmed from `components/admin/KitchenForm.tsx` and `app/kapi/admin/kitchens/route.ts`.

Fields exposed in admin:

- main content:
  - `title`
  - `slug`
  - `description`
  - `category`
  - `style`
  - `material`
- pricing:
  - `priceFrom`
  - `priceTo`
- list/meta:
  - `features`
  - `images`
  - `mainImage` derived from first image
- SEO:
  - `seoTitle`
  - `seoDescription`
- publishing:
  - `published`

Observations:

- no explicit canonical field in this entity
- no explicit robots field in this entity
- no alt text field for catalog images
- slug is user-editable
- create route validates slug format and numbers with Zod

### Blog page

Confirmed from `components/admin/BlogPostForm.tsx`.

Fields exposed in admin:

- `title`
- `slug`
- `excerpt`
- `content`
- `category`
- `tags`
- `readTime`
- `coverImage`
- `relatedCaseSlugs`
- `relatedStyleSlugs`
- `relatedScenarioSlugs`
- `seoTitle`
- `seoDescription`
- `published`

Observations:

- content is markdown-like plain text
- slugs can be generated automatically from title
- related content is linked manually by slug strings

### Location page

Confirmed from `components/admin/LocationForm.tsx` and `app/locations/[city]/page.tsx`.

Fields exposed in admin:

- identity:
  - `city`
  - `slug`
  - `region`
  - `title`
  - `h1`
- intro/description:
  - `intro`
  - `description`
  - `localIntro`
- commercial/logistics:
  - `priceFrom`
  - `deliveryCost`
  - `deliveryDays`
  - `measureCost`
  - `timelineText`
  - `visitDetails`
  - `installDetails`
- local proof:
  - `areas`
  - `caseSlugs`
  - `reviewIds`
- visual/content:
  - `images`
  - `features`
  - `faq`
  - `uniquePoints`
  - `contentBlocks`
- CTA/contact:
  - `ctaHeadline`
  - `ctaSubtext`
  - `phone`
  - `address`
  - `mapEmbed`
- SEO:
  - `seoTitle`
  - `seoDescription`
- publishing:
  - `published`

Observations:

- there are predefined city templates in the form component
- local schema markup is built from these fields
- this entity is very important for local SEO

## Template / Rendering Logic

### Public rendering

- App Router pages live in `artifacts/kuhni-na-zakaz/app/**`
- Rendering is page-type specific, not through a generic page-builder

Examples:

- catalog detail: `app/catalog/[slug]/page.tsx`
- location detail: `app/locations/[city]/page.tsx`
- blog detail: `app/blog/[slug]/page.tsx`
- portfolio detail: `app/portfolio/[slug]/page.tsx`

### Important implementation detail

`app/catalog/[slug]/page.tsx` mixes:

- dynamic DB content from `Kitchen`
- hardcoded fallback content from `STATIC_CATEGORIES`

This means an AI agent must distinguish:

- DB-managed pages
- code-defined fallback pages

and should not assume all catalog pages are fully CMS-driven.

### Rich text/content rendering

- `artifacts/kuhni-na-zakaz/lib/render-content.tsx` renders simple markdown-like blocks:
  - headings
  - bullet lists
  - numbered lists
  - paragraphs
  - bold inline text

This matters for blog/static content because malformed content can reduce quality even if it does not crash rendering.

## SEO Logic

### Global SEO

Global metadata is defined in `artifacts/kuhni-na-zakaz/app/layout.tsx`.

Confirmed global controls:

- default `title`
- title template
- global `description`
- default keywords
- `metadataBase`
- OpenGraph defaults
- Twitter defaults
- robots defaults
- Google and Yandex verification placeholders from env
- Organization JSON-LD

### Route-level SEO

Route-level metadata is generated in page files, for example:

- `app/catalog/[slug]/page.tsx`
- `app/locations/[city]/page.tsx`

Confirmed route-level controls:

- per-page title
- per-page description
- canonical via `alternates.canonical`
- OpenGraph image on location pages

### Robots and sitemap

- robots: `artifacts/kuhni-na-zakaz/app/robots.ts`
- sitemap: `artifacts/kuhni-na-zakaz/app/sitemap.ts`

Confirmed robots exclusions:

- `/admin/`
- `/admin/login`
- `/kapi/`
- `/thanks`

Confirmed sitemap sources:

- hardcoded static public routes
- hardcoded catalog/style/material slugs
- DB-driven published:
  - portfolio cases
  - blog posts
  - location pages
  - static pages

### Structured data

Confirmed structured data:

- `Organization` JSON-LD in root layout
- `LocalBusiness` JSON-LD on location pages
- `FAQPage` JSON-LD on location pages
- `BreadcrumbList` JSON-LD on location pages

### SEO-sensitive fields

Treat as `review_required`:

- `slug`
- `title`
- `h1`
- `seoTitle`
- `seoDescription`
- canonical-related route identity
- linked page relations affecting internal linking

## Pricing and Calculator Logic

### Content-facing prices

Many public entities expose visible price anchors:

- `Kitchen.priceFrom`, `priceTo`
- `PortfolioCase.priceFrom`, `priceTo`
- `LocationPage.priceFrom`
- `StylePage.priceFrom`
- `MaterialPage.priceFrom`

These are commercial claims and should be `review_required`.

### Price rules admin

- editor UI: `components/admin/PriceRulesEditor.tsx`
- API: `app/kapi/admin/prices/route.ts`
- storage: `PriceRule` model

This is a sensitive operational surface because it edits pricing coefficients/labels in bulk.

### Visual/configurator pricing

Core calculation file:

- `artifacts/kuhni-na-zakaz/lib/kitchen-configurator/price.ts`

Confirmed pricing inputs:

- placed modules
- facade selection
- countertop selection
- skinal selection
- handle selection
- appliances
- installation percentage

Confirmed formula shape:

- module base prices sum
- facade multiplier on module subtotal
- countertop by running meter
- skinal by estimated area
- handles by counted module types
- appliances by selected item prices
- installation as percentage of subtotal

Important limitation:

- comments in code show some mechanism pricing is intentionally simplified and deferred

So an AI agent must not “improve” pricing logic by guessing missing business rules.

## Images and Media

### Confirmed patterns

- most entities store image URLs as strings or string arrays
- examples:
  - `Kitchen.images`
  - `PortfolioCase.images`
  - `PortfolioCase.photosBefore`
  - `PortfolioCase.photosAfter`
  - `LocationPage.images`
  - `BlogPost.coverImage`
  - `StylePage.image`
  - `MaterialPage.image`

### Important safety note

There is no strong evidence in the inspected forms/schema of dedicated alt fields for entity images.
That means:

- image URL changes are `review_required`
- alt generation may need code changes, not just CMS filling

## Safe AI Classification

### `read_only`

- leads and customer submissions
- saved configs
- favorites
- activity logs
- user records unless explicitly auditing roles
- deployment configs
- `.env`
- tokens and secrets

### `draft_safe`

- blog content body
- blog excerpt
- kitchen descriptions
- static page content
- location FAQ
- location informational text blocks
- non-sensitive feature lists

### `review_required`

- any `published` flag
- any slug
- SEO title/description
- H1/title
- linked relations by slug/id
- phone/address/map fields
- visible pricing text or numeric price ranges
- image URLs
- homepage blocks

### `never_auto_edit`

- auth/session code
- user management
- guest access permissions
- secret env vars
- Telegram tokens/chat IDs
- deployment scripts
- database connection settings
- price-rule bulk config unless explicitly supervised

## Gaps / Unknowns

These need manual confirmation before giving an AI agent write access.

- whether `ActivityLog` is actually written consistently in all admin mutations
- whether guest access restrictions are enforced in every admin route or only partially
- whether there is a separate staging environment for safe draft testing
- whether any admin screenshots or hidden UI fields exist beyond the code reviewed here
- whether image upload flow uses external storage conventions not visible in the inspected files
- whether some catalog/style/material pages are still partly driven by hardcoded fallback content

## Recommended AI Rollout

### Phase 1

- read-only repository and admin mapping only
- no writes
- no publication

### Phase 2

- draft-only edits for:
  - blog posts
  - static pages
  - location informational blocks
- human review required

### Phase 3

- controlled content updates on kitchens/styles/materials
- explicit approval for any SEO field or slug change

### Phase 4

- no autonomous pricing, auth, user, or publish actions

## Included Files

- `ai-agent-package/README.md`
- `ai-agent-package/project-tree.txt`
- `ai-agent-package/key-files.md`
