# LocationPage Admin Integration Report

## Current Admin Architecture
- Form: `artifacts/kuhni-na-zakaz/components/admin/LocationForm.tsx`
- List page: `artifacts/kuhni-na-zakaz/app/admin/locations/page.tsx`
- New page: `artifacts/kuhni-na-zakaz/app/admin/locations/new/page.tsx`
- Edit page: `artifacts/kuhni-na-zakaz/app/admin/locations/[id]/edit/page.tsx`
- Admin API collection: `artifacts/kuhni-na-zakaz/app/kapi/admin/locations/route.ts`
- Admin API item: `artifacts/kuhni-na-zakaz/app/kapi/admin/locations/[id]/route.ts`
- Live route: `artifacts/kuhni-na-zakaz/app/locations/[city]/page.tsx`
- Validator layer: `none_detected`
- Current write path: `client_fetch_to_internal_admin_api_to_prisma`

## Safest Integration Option
- Selected: `local_test_draft_adapter`

## Allowed Draft-Safe Fields
- `intro`
- `description`
- `localIntro`
- `uniquePoints`
- `contentBlocks`
- `faq`
- `features`
- `ctaHeadline`
- `ctaSubtext`

## Blocked Fields
- `address`
- `caseSlugs`
- `deliveryCost`
- `deliveryDays`
- `h1`
- `mapEmbed`
- `measureCost`
- `phone`
- `priceFrom`
- `published`
- `reviewIds`
- `seoDescription`
- `seoTitle`
- `slug`
- `timelineText`
- `title`

## Read-Only Fields
- `areas`
- `city`
- `id`
- `images`
- `installDetails`
- `region`
- `visitDetails`
- `workZone`
