# Changelog вЂ” РљСѓС…РЅРёBY

## [Unreleased] - 2026-04-21 (Production styles fix and deploy access refresh)

### Added
- Local uploaded image assets for `styles`, `kitchens`, and `portfolio` were committed into `artifacts/kuhni-na-zakaz/public/uploads/...` for controlled runtime serving.
- `project-docs/HANDOFF.md`, `deploy/README.md`, and `deploy/timeweb/README.md` now document the live production server, working SSH key, deploy branch, runtime path, and restart flow so a fresh chat can push and deploy without rediscovery.

### Fixed
- Production `styles` pages on `https://kuhni.minsk.by` no longer show broken previews: the deployed runtime now serves `/uploads/styles/...` assets correctly after syncing files, rebuilding, and restarting `kuhni-na-zakaz`.

## [Unreleased] - 2026-04-20 (Bulk import v1 production closure package)

### Added
- `project-docs/BULK_IMPORT_V1_FINAL_HANDOFF.md` - final handoff package after go-live: implemented scope, operator flow, v1 in/out, canonical assets, post-import checks, and v2 recommendations.
- `project-docs/BULK_IMPORT_V1_OPERATIONAL_SUMMARY_2026-04-20.md` - short release-note / operational summary for production close-out.

### Changed
- `project-docs/BULK_IMPORT_V1_BASELINE.md` - updated with production launch baseline (`2026-04-20`) and idempotency re-run snapshot.
- `project-docs/HANDOFF.md` - added closure snapshot and direct links to final bulk import v1 docs.


## [Unreleased] вЂ” 2026-04-06 (Image handling improvement)

## [Unreleased] - 2026-04-13 (Bulk import v1 docs refresh)

### Added
- `project-docs/BULK_IMPORT_V1.md` - single source of truth for actual `bulk import v1` behavior: scope, non-scope, pipeline, Excel template rules, imported fields, guardrails, preview/apply flow, and post-import smoke checks.
- `tests/smoke/README.md` refresh - aligned with the implemented smoke suite and linked to the main bulk import runbook.
- `project-docs/HANDOFF.md` refresh - added direct references to bulk import docs.

---

### Added
- **`BlogPost.coverImage String @default("")`** вЂ” РЅРѕРІРѕРµ РїРѕР»Рµ РѕР±Р»РѕР¶РєРё СЃС‚Р°С‚СЊРё РІ Prisma schema. РџСЂРёРјРµРЅРµРЅРѕ С‡РµСЂРµР· `prisma db push`.
- **`BlogPostForm`** вЂ” РЅРѕРІС‹Р№ Р±Р»РѕРє В«РћР±Р»РѕР¶РєР° СЃС‚Р°С‚СЊРёВ» РІ РїСЂР°РІРѕРј СЃР°Р№РґР±Р°СЂРµ: URL-РїРѕР»Рµ (`type="url"`), live preview РІ aspect-video-РєРѕРЅС‚РµР№РЅРµСЂРµ, placeholder РїРѕРєР° URL РЅРµ РІСЃС‚Р°РІР»РµРЅ.
- **`app/kapi/admin/blog/route.ts`** вЂ” `coverImage` РґРѕР±Р°РІР»РµРЅ РІ `BlogSchema` (POST).
- **`app/kapi/admin/blog/[id]/route.ts`** вЂ” `coverImage` РґРѕР±Р°РІР»РµРЅ РІ `BlogSchema` (PUT).

### Changed
- **`PortfolioCaseForm` вЂ” `ArrayUrlField`** вЂ” РїРµСЂРµРґРµР»Р°РЅ: СЃРµС‚РєР° `grid-cols-2/3` РІРјРµСЃС‚Рѕ РїР»РѕСЃРєРѕРіРѕ СЃРїРёСЃРєР°, thumbnails `aspect-video` РІРјРµСЃС‚Рѕ `w-12 h-12`, badge В«1В» РЅР° РїРµСЂРІРѕРј С„РѕС‚Рѕ, hover-РєРЅРѕРїРєР° СѓРґР°Р»РµРЅРёСЏ, `type="url"` + inline РѕС€РёР±РєР° РІР°Р»РёРґР°С†РёРё ("URL РґРѕР»Р¶РµРЅ РЅР°С‡РёРЅР°С‚СЊСЃСЏ СЃ https://").
- **`PortfolioCaseForm` вЂ” `mainImage`** вЂ” СѓР»СѓС‡С€РµРЅ preview: `aspect-video` РєРѕРЅС‚РµР№РЅРµСЂ СЃ badge В«РћР±Р»РѕР¶РєР°В», placeholder-Р·Р°РіР»СѓС€РєР° РєРѕРіРґР° РїРѕР»Рµ РїСѓСЃС‚РѕРµ, `type="url"` РЅР° input, Р±РѕР»РµРµ РїРѕРґСЂРѕР±РЅР°СЏ РїРѕРґРїРёСЃСЊ.
- **`StyleForm` вЂ” `image`** вЂ” РґРѕР±Р°РІР»РµРЅ live preview (`aspect-video`), placeholder-Р·Р°РіР»СѓС€РєР°, РїРѕРґСЃРєР°Р·РєР°, `type="url"`, `font-mono` РЅР° input.
- **`MaterialForm` вЂ” `image`** вЂ” Р°РЅР°Р»РѕРіРёС‡РЅРѕ StyleForm.

### РћРіСЂР°РЅРёС‡РµРЅРёСЏ (РЅРµ РёР·РјРµРЅРёР»РёСЃСЊ)
- Р—Р°РіСЂСѓР·РєР° С„Р°Р№Р»РѕРІ РЅР°РїСЂСЏРјСѓСЋ РёР· admin РЅРµ СЂРµР°Р»РёР·РѕРІР°РЅР° вЂ” С‚РѕР»СЊРєРѕ URL-РїРѕР»СЏ. РР·РѕР±СЂР°Р¶РµРЅРёСЏ РЅСѓР¶РЅРѕ С…РѕСЃС‚РёС‚СЊ РІРЅРµС€РЅРµ (CDN, РѕР±Р»Р°С‡РЅРѕРµ С…СЂР°РЅРёР»РёС‰Рµ) Рё РІСЃС‚Р°РІР»СЏС‚СЊ URL.
- Upload РІ S3/object storage вЂ” РЅРµ СЃРґРµР»Р°РЅ РІ СЌС‚РѕРј СЌС‚Р°РїРµ.

---

## [Unreleased] вЂ” 2026-04-06 (Email notifications for leads)

### Added
- **`lib/email.ts`** вЂ” РјРѕРґСѓР»СЊ email-СѓРІРµРґРѕРјР»РµРЅРёР№ Рѕ РЅРѕРІС‹С… Р·Р°СЏРІРєР°С…. SMTP С‡РµСЂРµР· env vars. РџРѕР»СѓС‡Р°С‚РµР»СЊ Р·Р°С„РёРєСЃРёСЂРѕРІР°РЅ РєР°Рє `onliner7@gmail.com` (РєРѕРЅСЃС‚Р°РЅС‚Р° `LEAD_NOTIFICATION_RECIPIENT`). HTML-С€Р°Р±Р»РѕРЅ: РґР°С‚Р°, РёРјСЏ, С‚РµР»РµС„РѕРЅ, РіРѕСЂРѕРґ, РєРѕРјРјРµРЅС‚Р°СЂРёР№, РёСЃС‚РѕС‡РЅРёРє, РѕС‚РІРµС‚С‹. Р•СЃР»Рё `EMAIL_SMTP_HOST` РЅРµ Р·Р°РґР°РЅ вЂ” РїСЂРѕРїСѓСЃРє.
- **`app/kapi/leads/route.ts`** вЂ” РІС‹Р·РѕРІ `sendEmailNotification(lead)` РїРѕСЃР»Рµ Telegram. Fire-and-forget, РѕС€РёР±РєР° РЅРµ РІР»РёСЏРµС‚ РЅР° Telegram Рё HTTP-РѕС‚РІРµС‚.
- **`nodemailer`** + **`@types/nodemailer`** РґРѕР±Р°РІР»РµРЅС‹ РІ `package.json`.

### Env vars (РґР»СЏ email, РІСЃРµ РѕРїС†РёРѕРЅР°Р»СЊРЅС‹)
| РџРµСЂРµРјРµРЅРЅР°СЏ | РћР±СЏР·Р°С‚РµР»СЊРЅР° | РќР°Р·РЅР°С‡РµРЅРёРµ |
|---|---|---|
| `EMAIL_SMTP_HOST` | Р”Р° (РґР»СЏ Р°РєС‚РёРІР°С†РёРё) | SMTP-С…РѕСЃС‚. Р•СЃР»Рё РЅРµ Р·Р°РґР°РЅ вЂ” email РїСЂРѕРїСѓСЃРєР°РµС‚СЃСЏ. |
| `EMAIL_SMTP_PORT` | РќРµС‚ | РџРѕСЂС‚ (РїРѕ СѓРјРѕР»С‡Р°РЅРёСЋ: 587) |
| `EMAIL_SMTP_SECURE` | РќРµС‚ | `"true"` РґР»СЏ SSL (РїРѕСЂС‚ 465). РџРѕ СѓРјРѕР»С‡Р°РЅРёСЋ: STARTTLS. |
| `EMAIL_SMTP_USER` | РќРµС‚ | Р›РѕРіРёРЅ SMTP |
| `EMAIL_SMTP_PASS` | РќРµС‚ | РџР°СЂРѕР»СЊ SMTP |

РџРѕР»СѓС‡Р°С‚РµР»СЊ `onliner7@gmail.com` Р·Р°С…Р°СЂРґРєРѕР¶РµРЅ вЂ” `EMAIL_TO` РЅРµ РёСЃРїРѕР»СЊР·СѓРµС‚СЃСЏ.

---

## [Unreleased] вЂ” 2026-04-06 (Р­С‚Р°Рї 5: Prices page completion)

### Changed
- **`components/sections/PriceQuiz.tsx`** вЂ” РїРµСЂРµРєР»СЋС‡С‘РЅ РЅР° DB-driven СЂР°СЃС‡С‘С‚: РІРјРµСЃС‚Рѕ Р»РѕРєР°Р»СЊРЅРѕР№ С‚Р°Р±Р»РёС†С‹ `PRICES[]` РІС‹Р·С‹РІР°РµС‚ `POST /kapi/calculator` СЃ РјР°РїРїРёРЅРіРѕРј РѕС‚РІРµС‚РѕРІ РЅР° РїР°СЂР°РјРµС‚СЂС‹ РєР°Р»СЊРєСѓР»СЏС‚РѕСЂР° (layout, area, material, hardware, tech, style=modern, countertop=postforming, priority=balance). РџРѕРєР°Р·С‹РІР°РµС‚ `priceFromвЂ“priceTo` РёР· Р‘Р”.
- **`app/prices/page.tsx`** вЂ” РёСЃРїСЂР°РІР»РµРЅС‹ metadata: СѓР±СЂР°РЅРѕ "РІ РњРёРЅСЃРєРµ", РґРѕР±Р°РІР»РµРЅРѕ "РїРѕ Р‘РµР»Р°СЂСѓСЃРё"; "Р”РѕСЃС‚Р°РІРєР° РїРѕ РњРёРЅСЃРєСѓ" в†’ "Р”РѕСЃС‚Р°РІРєР° РїРѕ РіРѕСЂРѕРґСѓ", РґРѕР±Р°РІР»РµРЅР° СЃС‚СЂРѕРєР° "Р”РѕСЃС‚Р°РІРєР° РІ РґСЂСѓРіРѕР№ РіРѕСЂРѕРґ вЂ” РїРѕ РґРѕРіРѕРІРѕСЂС‘РЅРЅРѕСЃС‚Рё". РЎРµРіРјРµРЅС‚С‹ (Р­РєРѕРЅРѕРј/РЎС‚Р°РЅРґР°СЂС‚/РџСЂРµРјРёСѓРј) РїРѕРјРµС‡РµРЅС‹ РєР°Рє СЂРµРґР°РєС†РёРѕРЅРЅС‹Р№ fallback С‡РµСЂРµР· JSDoc-РєРѕРјРјРµРЅС‚Р°СЂРёРё вЂ” РЅРµС‚ РјРѕРґРµР»Рё PriceSegment РІ Р‘Р”.

### РђСЂС…РёС‚РµРєС‚СѓСЂР° РїРѕСЃР»Рµ СЌС‚Р°РїР°
- **DB-driven:** СЂР°СЃС‡С‘С‚ СЃС‚РѕРёРјРѕСЃС‚Рё РІ PriceQuiz вЂ” С‡РµСЂРµР· `PriceRule` Рё `POST /kapi/calculator`
- **Static fallback (Р·Р°РґРѕРєСѓРјРµРЅС‚РёСЂРѕРІР°РЅ):** SEGMENTS вЂ” РјР°СЂРєРµС‚РёРЅРіРѕРІС‹Рµ РґРёР°РїР°Р·РѕРЅС‹ Р±РµР· DB-СЌРєРІРёРІР°Р»РµРЅС‚Р°; EXTRA_WORKS вЂ” СѓСЃР»СѓРіРё РІРЅРµ С„РѕСЂРјСѓР»С‹ РєР°Р»СЊРєСѓР»СЏС‚РѕСЂР°
- **РќРµ СЃР»РѕРјР°РЅРѕ:** `/kapi/calculator`, `/admin/prices`, С„РѕСЂРјСѓР»Р° PriceRule

---

## [Unreleased] вЂ” 2026-04-06 (Blog seed + Regional expansion)

### Added
- **`prisma/seed-blog.ts`** вЂ” 6 РїСѓР±Р»РёС‡РЅС‹С… Р±Р»РѕРі-РїРѕСЃС‚РѕРІ (СЃРѕРІРµС‚С‹, С†РµРЅС‹, РґРёР·Р°Р№РЅ, РјР°С‚РµСЂРёР°Р»С‹, С„СѓСЂРЅРёС‚СѓСЂР°, РѕСЃС‚СЂРѕРІ). Р’СЃРµ РѕРїСѓР±Р»РёРєРѕРІР°РЅС‹ СЃ `publishedAt`. РўРµРіРё, relatedStyle/Scenario slugs Р·Р°РїРѕР»РЅРµРЅС‹ РґР»СЏ cross-linking.
- **`prisma/seed-locations.ts`** вЂ” 7 РЅРѕРІС‹С… LocationPage: Р‘СЂРµСЃС‚, Р“СЂРѕРґРЅРѕ, Р’РёС‚РµР±СЃРє, Р“РѕРјРµР»СЊ, РњРѕРіРёР»С‘РІ (5 РѕР±Р»Р°СЃС‚РЅС‹С… С†РµРЅС‚СЂРѕРІ), + Р–РѕРґРёРЅРѕ Рё РњРѕР»РѕРґРµС‡РЅРѕ (РњРёРЅСЃРєР°СЏ РѕР±Р»). РљР°Р¶РґР°СЏ СЃ: intro, features, uniquePoints, contentBlocks, faq, ctaHeadline, ctaSubtext, SEO-РїРѕР»СЏРјРё.
- **`package.json`** вЂ” РєРѕРјР°РЅРґС‹ `db:seed-blog` Рё `db:seed-locations`.

### Changed
- **`components/layout/Footer.tsx`** вЂ” СЂР°СЃС€РёСЂРµРЅ Р±Р»РѕРє В«Р“РѕСЂРѕРґР°В»: РґРѕР±Р°РІР»РµРЅС‹ СЃСЃС‹Р»РєРё РЅР° Р‘СЂРµСЃС‚, Р“СЂРѕРґРЅРѕ, Р’РёС‚РµР±СЃРє, Р“РѕРјРµР»СЊ, РњРѕРіРёР»С‘РІ (С‚РµРїРµСЂСЊ 7 РіРѕСЂРѕРґРѕРІ РІРјРµСЃС‚Рѕ 2).

### DB РґР°РЅРЅС‹Рµ
- `BlogPost`: Р±С‹Р»Рѕ 0 в†’ СЃС‚Р°Р»Рѕ 6 Р·Р°РїРёСЃРµР№
- `LocationPage`: Р±С‹Р»Рѕ 3 (РњРёРЅСЃРє, РњРёРЅСЃРєР°СЏ РѕР±Р», Р‘РѕСЂРёСЃРѕРІ) в†’ СЃС‚Р°Р»Рѕ 10 (+ 5 РѕР±Р»Р°СЃС‚РЅС‹С… + Р–РѕРґРёРЅРѕ + РњРѕР»РѕРґРµС‡РЅРѕ)

### Р—Р°РєСЂС‹С‚С‹Рµ pending tasks (РёР· HANDOFF)
- вњ… Blog вЂ” РєРѕРЅС‚РµРЅС‚ РїРѕСЃРµСЏРЅ, СЃС‚СЂР°РЅРёС†Р° Р±РµСЂС‘С‚ РґР°РЅРЅС‹Рµ РёР· Р‘Р” (РЅРµ fallback)
- вњ… Regional pages вЂ” РІСЃРµ 6 РѕР±Р»Р°СЃС‚РЅС‹С… С†РµРЅС‚СЂРѕРІ Р‘РµР»Р°СЂСѓСЃРё С‚РµРїРµСЂСЊ РёРјРµСЋС‚ LocationPage

---

## [Unreleased] вЂ” 2026-04-06 (Р­С‚Р°Рї 4: StaticPage CMS)

### Added
- **`prisma/schema.prisma`** вЂ” РЅРѕРІР°СЏ РјРѕРґРµР»СЊ `StaticPage` (slug unique, title, content, seoTitle, seoDescription, published, timestamps).
- **`prisma/seed-static-pages.ts`** вЂ” seed-СЃРєСЂРёРїС‚ РґР»СЏ 6 СЃС‚СЂР°РЅРёС†: about, delivery-installation, warranty, privacy-policy, terms, personal-data.
- **`package.json`** вЂ” РєРѕРјР°РЅРґР° `db:seed-static` в†’ `tsx prisma/seed-static-pages.ts`.
- **`lib/render-content.tsx`** вЂ” Р»РµРіРєРѕРІРµСЃРЅС‹Р№ renderer: `## Р—Р°РіРѕР»РѕРІРѕРє` в†’ `<h2>`, `- РїСѓРЅРєС‚` в†’ `<ul><li>`, Р±Р»РѕРє С‚РµРєСЃС‚Р° в†’ `<p>`.
- **`app/kapi/admin/static-pages/route.ts`** вЂ” GET (СЃРїРёСЃРѕРє СЃС‚СЂР°РЅРёС†).
- **`app/kapi/admin/static-pages/[id]/route.ts`** вЂ” GET (РѕРґРЅР° СЃС‚СЂР°РЅРёС†Р°) + PATCH (РѕР±РЅРѕРІР»РµРЅРёРµ).
- **`app/admin/pages/[id]/edit/page.tsx`** вЂ” Client Component: СЂРµРґР°РєС‚РѕСЂ СЃС‚СЂР°РЅРёС†С‹ (title, content, seoTitle, seoDescription, published), СЃРѕС…СЂР°РЅРµРЅРёРµ С‡РµСЂРµР· PATCH.

### Changed
- **`app/admin/pages/page.tsx`** вЂ” Р·Р°РјРµРЅС‘РЅ stub СЃ amber-РїСЂРµРґСѓРїСЂРµР¶РґРµРЅРёРµРј: С‚РµРїРµСЂСЊ РїРѕР»РЅРѕС†РµРЅРЅС‹Р№ СЃРїРёСЃРѕРє РёР· Р‘Р” СЃ РєРѕР»РѕРЅРєР°РјРё Р—Р°РіРѕР»РѕРІРѕРє/URL/РЎС‚Р°С‚СѓСЃ + РёРєРѕРЅРєРё Р РµРґР°РєС‚РёСЂРѕРІР°С‚СЊ/РћС‚РєСЂС‹С‚СЊ.
- **`app/about/page.tsx`** вЂ” SSR РёР· `StaticPage` slug=about; FACTS-grid Рё ContactForm СЃРѕС…СЂР°РЅРµРЅС‹ РєР°Рє hardcoded РІРёР·СѓР°Р»СЊРЅС‹Рµ РєРѕРјРїРѕРЅРµРЅС‚С‹; `generateMetadata` С‡РёС‚Р°РµС‚ seoTitle/seoDescription РёР· Р‘Р”.
- **`app/warranty/page.tsx`** вЂ” SSR РёР· `StaticPage` slug=warranty; РєР°СЂС‚РѕС‡РєРё РіР°СЂР°РЅС‚РёРё (5/2/1 РіРѕРґ) hardcoded; РєРѕРЅС‚РµРЅС‚ РёР· Р‘Р”.
- **`app/delivery-installation/page.tsx`** вЂ” РїРѕР»РЅРѕСЃС‚СЊСЋ DB-driven (title + content РёР· Р‘Р”).
- **`app/privacy-policy/page.tsx`** вЂ” РїРѕР»РЅРѕСЃС‚СЊСЋ DB-driven.
- **`app/terms/page.tsx`** вЂ” РїРѕР»РЅРѕСЃС‚СЊСЋ DB-driven.
- **`app/personal-data/page.tsx`** вЂ” РїРѕР»РЅРѕСЃС‚СЊСЋ DB-driven.

### DB migration
- `prisma db push` в†’ С‚Р°Р±Р»РёС†Р° `StaticPage` СЃРѕР·РґР°РЅР°.
- `pnpm db:seed-static` в†’ 6 Р·Р°РїРёСЃРµР№ РїРѕСЃРµСЏРЅС‹.

---

## [Unreleased] вЂ” 2026-04-06 (Р­С‚Р°Рї 3: Contacts page DB-driven)

### Changed
- **`app/contacts/page.tsx`** вЂ” РєРѕРЅРІРµСЂС‚РёСЂРѕРІР°РЅ РІ `async` Server Component. Р§РёС‚Р°РµС‚ `phone`, `phoneDisplay`, `phone2`, `phoneDisplay2`, `email`, `address`, `workingHours` РёР· `SiteSettings` (id=1) С‡РµСЂРµР· Prisma. РџСЂРё DB-РѕС€РёР±РєРµ вЂ” `catch(() => null)`, РєРѕРґ РїРѕРєР°Р·С‹РІР°РµС‚ Р·РЅР°С‡РµРЅРёСЏ РёР· `DEFAULTS`. РЎС‚СЂР°РЅРёС†Р° Р±РѕР»РµРµ РЅРµ РѕС‚РѕСЂРІР°РЅР° РѕС‚ РіР»РѕР±Р°Р»СЊРЅС‹С… РЅР°СЃС‚СЂРѕРµРє.
- **`prisma/schema.prisma`** вЂ” РёСЃРїСЂР°РІР»РµРЅ `default` РґР»СЏ `SiteSettings.email`: `"onliner7@gmail.com"` в†’ `"onliner7@gmail.com"`. Р’Р»РёСЏРµС‚ С‚РѕР»СЊРєРѕ РЅР° СЃРѕР·РґР°РЅРёРµ РЅРѕРІС‹С… Р·Р°РїРёСЃРµР№ (СЃСѓС‰РµСЃС‚РІСѓСЋС‰РёРµ РґР°РЅРЅС‹Рµ РІ Р‘Р” РЅРµ Р·Р°С‚СЂРѕРЅСѓС‚С‹).
- **`project-docs/HANDOFF.md`** вЂ” СѓРґР°Р»РµРЅР° СЃС‚СЂРѕРєР° В«Contacts page вЂ” currently staticВ» РёР· Pending tasks (Р·Р°РґР°С‡Р° РІС‹РїРѕР»РЅРµРЅР°); РЅСѓРјРµСЂР°С†РёСЏ СЃРїРёСЃРєР° РёСЃРїСЂР°РІР»РµРЅР°.

### Р§С‚Рѕ СЃС‚Р°Р»Рѕ DB-driven
| РџРѕР»Рµ | РСЃС‚РѕС‡РЅРёРє |
|---|---|
| С‚РµР»РµС„РѕРЅ / РґРѕРї. С‚РµР»РµС„РѕРЅ | `SiteSettings.phone` / `phone2` |
| email | `SiteSettings.email` |
| Р°РґСЂРµСЃ | `SiteSettings.address` |
| РІСЂРµРјСЏ СЂР°Р±РѕС‚С‹ | `SiteSettings.workingHours` (split РїРѕ `,` в†’ РѕС‚РґРµР»СЊРЅС‹Рµ СЃС‚СЂРѕРєРё) |

### Р§С‚Рѕ РѕСЃС‚Р°Р»РѕСЃСЊ fallback
- `DEFAULTS` РІ `contacts/page.tsx` вЂ” safety-net РїСЂРё РѕС‚СЃСѓС‚СЃС‚РІРёРё Р·Р°РїРёСЃРё SiteSettings
- Placeholder РєР°СЂС‚С‹ (`РљР°СЂС‚Р° вЂ” {c.address}`) вЂ” СЃС‚Р°С‚РёС‡РµСЃРєРёР№ Р±Р»РѕРє, Р°РґСЂРµСЃ РґРёРЅР°РјРёС‡РµСЃРєРёР№

### Verified (РЅРµ РёР·РјРµРЅРµРЅРѕ)
- `Footer.tsx` вЂ” СѓР¶Рµ DB-driven вњ“
- `Header.tsx` вЂ” РїСЂРёРЅРёРјР°РµС‚ phone-props РёР· `layout.tsx` (С‡РёС‚Р°РµС‚ SiteSettings) вњ“
- `layout.tsx` вЂ” SiteSettings + Header props Р±РµР· РёР·РјРµРЅРµРЅРёР№ вњ“

---

## [Unreleased] вЂ” 2026-04-06 (Brand & positioning cleanup)

### РџРѕРґСЌС‚Р°Рї A вЂ” docs fix

- **`project-docs/HANDOFF.md`** вЂ” СѓР±СЂР°РЅРѕ СЃР»РѕРІРѕ `production-ready` РёР· РѕРїРёСЃР°РЅРёСЏ РїСЂРѕРµРєС‚Р° (РјР°СЂРєРµС‚РёРЅРіРѕРІРѕРµ СѓС‚РІРµСЂР¶РґРµРЅРёРµ Р±РµР· РґРѕРєР°Р·Р°С‚РµР»СЊРЅРѕР№ Р±Р°Р·С‹ РІ СЂР°РјРєР°С… СЌС‚РѕР№ Р·Р°РґР°С‡Рё).
- **`project-docs/HANDOFF.md`** вЂ” Р·Р°РїРёСЃСЊ `Р­С‚Р°Рї 2 (Р‘СЂРµРЅРґ)` РїРµСЂРµРёРјРµРЅРѕРІР°РЅР° РІ `Brand & positioning cleanup` РІРѕ РёР·Р±РµР¶Р°РЅРёРµ РєРѕРЅС„Р»РёРєС‚Р° СЃ РїСЂРѕРґСѓРєС‚РѕРІС‹Рј `Р­С‚Р°Рї 2` (ScenarioPage).

### РџРѕРґСЌС‚Р°Рї B вЂ” static pages & global content hygiene

#### РР·РјРµРЅРµРЅРѕ: `app/layout.tsx`
- metadataBase fallback: `"https://kuhni.minsk.by"` в†’ `"https://kuhni.minsk.by"`
- OG url fallback: С‚Рѕ Р¶Рµ

#### РР·РјРµРЅРµРЅРѕ: `components/layout/Footer.tsx`
- `FOOTER_DEFAULTS.email`: `"onliner7@gmail.com"` в†’ `"onliner7@gmail.com"`

#### РР·РјРµРЅРµРЅРѕ: `app/about/page.tsx`
- metadata title: "Рћ РєРѕРјРїР°РЅРёРё вЂ” РєСѓС…РЅРё РЅР° Р·Р°РєР°Р· РІ РњРёРЅСЃРєРµ" в†’ "Рћ РєРѕРјРїР°РЅРёРё РљСѓС…РЅРёBY вЂ” РєСѓС…РЅРё РЅР° Р·Р°РєР°Р· РїРѕ Р‘РµР»Р°СЂСѓСЃРё"
- metadata description: СѓР±СЂР°РЅ "РІ РњРёРЅСЃРєРµ", Р±СЂРµРЅРґ РёСЃРїСЂР°РІР»РµРЅ РЅР° "РљСѓС…РЅРёBY"
- JSON-LD `name`: "РљСѓС…РЅРёMinsk" в†’ "РљСѓС…РЅРёBY"
- JSON-LD `description`: "РІ РњРёРЅСЃРєРµ Рё РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё" в†’ "РїРѕ РІСЃРµР№ Р‘РµР»Р°СЂСѓСЃРё"
- JSON-LD `email`: "onliner7@gmail.com" в†’ "onliner7@gmail.com"
- Body: "РљСѓС…РЅРёMinsk вЂ” РїСЂРѕРёР·РІРѕРґРёС‚РµР»СЊ РєСѓС…РѕРЅСЊ РЅР° Р·Р°РєР°Р· РІ РњРёРЅСЃРєРµ Рё РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё" в†’ Р±СЂРµРЅРґ + РѕС…РІР°С‚ РёСЃРїСЂР°РІР»РµРЅС‹

#### РР·РјРµРЅРµРЅРѕ: `app/delivery-installation/page.tsx`
- metadata title: "Р”РѕСЃС‚Р°РІРєР° Рё РјРѕРЅС‚Р°Р¶ РєСѓС…РЅРё РІ РњРёРЅСЃРєРµ" в†’ "Р”РѕСЃС‚Р°РІРєР° Рё РјРѕРЅС‚Р°Р¶ РєСѓС…РЅРё вЂ” РљСѓС…РЅРёBY"
- metadata description: СѓР±СЂР°РЅРѕ "РІ РњРёРЅСЃРєРµ Рё РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё" РєР°Рє РµРґРёРЅСЃС‚РІРµРЅРЅС‹Р№ РѕС…РІР°С‚; РґРѕР±Р°РІР»РµРЅС‹ РІСЃРµ СЂРµРіРёРѕРЅС‹
- Р—РѕРЅС‹ РґРѕСЃС‚Р°РІРєРё РІ body ("Р”РѕСЃС‚Р°РІРєР° РїРѕ РњРёРЅСЃРєСѓ", "РїРѕ РњРёРЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё") РѕСЃС‚Р°РІР»РµРЅС‹ вЂ” СЌС‚Рѕ С„Р°РєС‚РёС‡РµСЃРєРёРµ С†РµРЅРѕРІС‹Рµ Р·РѕРЅС‹, РЅРµ Р±СЂРµРЅРґРѕРІРѕРµ РїРѕР·РёС†РёРѕРЅРёСЂРѕРІР°РЅРёРµ

#### РР·РјРµРЅРµРЅРѕ: `app/warranty/page.tsx`
- metadata description: СѓР±СЂР°РЅРѕ "Р“Р°СЂР°РЅС‚РёР№РЅРѕРµ РѕР±СЃР»СѓР¶РёРІР°РЅРёРµ РІ РњРёРЅСЃРєРµ" вЂ” СЃС‚СЂР°РЅРёС†Р° РѕРїРёСЃС‹РІР°РµС‚ РѕР±С‰РёР№ СЃРµСЂРІРёСЃ
- Body email: "onliner7@gmail.com" в†’ "onliner7@gmail.com"

#### РР·РјРµРЅРµРЅРѕ: `app/privacy-policy/page.tsx`
- metadata description: "РљСѓС…РЅРёMinsk" в†’ "РљСѓС…РЅРёBY"
- Body: "РљСѓС…РЅРёMinsk" в†’ "РљСѓС…РЅРёBY" (2 РјРµСЃС‚Р°)
- Body: "onliner7@gmail.com" в†’ "onliner7@gmail.com" (2 РјРµСЃС‚Р°)

#### РР·РјРµРЅРµРЅРѕ: `app/terms/page.tsx`
- metadata description: "РљСѓС…РЅРёMinsk" в†’ "РљСѓС…РЅРёBY"
- Body: "kuhni.minsk.by" в†’ "kuhni.minsk.by"
- Body: "РљСѓС…РЅРёMinsk" в†’ "РљСѓС…РЅРёBY"

#### РР·РјРµРЅРµРЅРѕ: `app/personal-data/page.tsx`
- metadata description: "РљСѓС…РЅРёMinsk" в†’ "РљСѓС…РЅРёBY"
- Body: "kuhni.minsk.by" в†’ "kuhni.minsk.by"
- Body: "onliner7@gmail.com" в†’ "onliner7@gmail.com"
- Body: "РљСѓС…РЅРёMinsk" в†’ "РљСѓС…РЅРёBY" (РІРєР»СЋС‡Р°СЏ Р±Р»РѕРє РѕРїРµСЂР°С‚РѕСЂР° РґР°РЅРЅС‹С…)
- Р¤РёР·РёС‡РµСЃРєРёР№ Р°РґСЂРµСЃ "Рі. РњРёРЅСЃРє, СѓР». РџСЂРёС‚С‹С†РєРѕРіРѕ, 100" вЂ” РѕСЃС‚Р°РІР»РµРЅ (С„Р°РєС‚РёС‡РµСЃРєРёР№ Р°РґСЂРµСЃ РѕРїРµСЂР°С‚РѕСЂР°)

#### РР·РјРµРЅРµРЅРѕ: `app/contacts/page.tsx`
- metadata title: "РљРѕРЅС‚Р°РєС‚С‹ вЂ” РєСѓС…РЅРё РЅР° Р·Р°РєР°Р· РІ РњРёРЅСЃРєРµ" в†’ "РљРѕРЅС‚Р°РєС‚С‹ РљСѓС…РЅРёBY вЂ” РєСѓС…РЅРё РЅР° Р·Р°РєР°Р· РїРѕ Р‘РµР»Р°СЂСѓСЃРё"
- metadata description: "РљСѓС…РЅРёMinsk" в†’ "РљСѓС…РЅРёBY", СѓР±СЂР°РЅРѕ "Р°РґСЂРµСЃ РІ РњРёРЅСЃРєРµ" РєР°Рє РїРѕР·РёС†РёРѕРЅРёСЂРѕРІР°РЅРёРµ
- Body email: "onliner7@gmail.com" в†’ "onliner7@gmail.com"
- Р¤РёР·РёС‡РµСЃРєРёР№ Р°РґСЂРµСЃ "Рі. РњРёРЅСЃРє, СѓР». РџСЂРёС‚С‹С†РєРѕРіРѕ, 100" вЂ” РѕСЃС‚Р°РІР»РµРЅ (С„Р°РєС‚РёС‡РµСЃРєРёРµ РґР°РЅРЅС‹Рµ)
- Placeholder РєР°СЂС‚С‹ "РљР°СЂС‚Р° вЂ” Рі. РњРёРЅСЃРє, СѓР». РџСЂРёС‚С‹С†РєРѕРіРѕ, 100" вЂ” РѕСЃС‚Р°РІР»РµРЅ

### Verified (РЅРµ РёР·РјРµРЅРµРЅРѕ)
- `app/page.tsx` JSON-LD `areaServed: { name: "Р‘РµР»Р°СЂСѓСЃСЊ" }` вЂ” СѓР¶Рµ РєРѕСЂСЂРµРєС‚РЅРѕ вњ“
- `app/page.tsx` `address.addressLocality: "РњРёРЅСЃРє"` вЂ” С„РёР·РёС‡РµСЃРєРёР№ Р°РґСЂРµСЃ, РѕСЃС‚Р°РІР»РµРЅ вњ“
- Footer city links `/locations/minsk`, `/locations/minskaya-oblast` вЂ” Р»РѕРєР°Р»СЊРЅС‹Рµ SEO, РѕСЃС‚Р°РІР»РµРЅС‹ вњ“
- `/locations/*` pages вЂ” РЅРµ С‚СЂРѕРЅСѓС‚С‹ вњ“
- auth-Р»РѕРіРёРєР°, db schema вЂ” РЅРµ С‚СЂРѕРЅСѓС‚С‹ вњ“

---

## [Unreleased] вЂ” 2026-04-06 (Р­С‚Р°Рї 1: Security & Housekeeping)

### Security
- **`lib/auth.ts` вЂ” СѓР±СЂР°РЅ РЅРµР±РµР·РѕРїР°СЃРЅС‹Р№ fallback secret**: РІРјРµСЃС‚Рѕ `process.env.SESSION_SECRET || "kuhni-minsk-secret-change-in-prod"` РјРѕРґСѓР»СЊ С‚РµРїРµСЂСЊ Р±СЂРѕСЃР°РµС‚ `Error` РїСЂРё СЃС‚Р°СЂС‚Рµ РµСЃР»Рё `SESSION_SECRET` РЅРµ Р·Р°РґР°РЅ. РќРёРєР°РєРѕРіРѕ РјРѕР»С‡Р°Р»РёРІРѕРіРѕ fallback. `SESSION_SECRET` РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ Р·Р°РґР°РЅ С‡РµСЂРµР· Replit Secrets. Commit: `4360f6c+`

### Fixed
- **`asChild` prop РЅР° DOM-СЌР»РµРјРµРЅС‚Рµ** вЂ” СѓР±СЂР°РЅ РёР· `app/admin/kitchens/page.tsx` Рё `components/sections/PriceQuiz.tsx`. РљР°СЃС‚РѕРјРЅС‹Р№ `Button` РЅРµ РїРѕРґРґРµСЂР¶РёРІР°РµС‚ Radix UI `asChild`. Р—Р°РјРµРЅРµРЅРѕ РЅР° `<Link className={buttonVariants(...)}>` Рё `<a className={buttonVariants()}>`. РЈСЃС‚СЂР°РЅСЏРµС‚ React warning РІ РєРѕРЅСЃРѕР»Рё. Commit: `4360f6c`

### Changed
- **Trust bar (4 СЃС‚Р°С‚РёСЃС‚РёРєРё) РЅР° РјРѕР±РёР»СЊРЅС‹С…** вЂ” РїРµСЂРµСЂР°Р±РѕС‚Р°РЅ РІ РІРµСЂС‚РёРєР°Р»СЊРЅС‹Р№ СЃС‚РѕР»Р±РёРє РєРѕРјРїР°РєС‚РЅС‹С… РєР°СЂС‚РѕС‡РµРє (`sm:hidden`): РёРєРѕРЅРєР° + Р·Р°РіРѕР»РѕРІРѕРє + РїРѕРґР·Р°РіРѕР»РѕРІРѕРє РІ РѕРґРЅСѓ СЃС‚СЂРѕРєСѓ. РќР° РїР»Р°РЅС€РµС‚Р°С…+ вЂ” РїСЂРµР¶РЅСЏСЏ 4-column СЃРµС‚РєР°. Commit: `ee78ce5`

### Chores
- **`.next/` СѓРґР°Р»С‘РЅ РёР· git-РёРЅРґРµРєСЃР°** вЂ” `git rm -r --cached artifacts/kuhni-na-zakaz/.next/` вЂ” 49 РѕС‚СЃР»РµР¶РёРІР°РµРјС‹С… build-С„Р°Р№Р»РѕРІ (manifests, webpack-РєСЌС€, server chunks) СѓР±СЂР°РЅС‹ РёР· tracking. Р¤Р°Р№Р»С‹ РЅР° РґРёСЃРєРµ СЃРѕС…СЂР°РЅРµРЅС‹. Р’ СЃР»РµРґСѓСЋС‰РёС… РєРѕРјРјРёС‚Р°С… `.next/` РѕС‚СЃР»РµР¶РёРІР°С‚СЊСЃСЏ РЅРµ Р±СѓРґРµС‚.
- **`.gitignore`** вЂ” СЂР°СЃС€РёСЂРµРЅ: РґРѕР±Р°РІР»РµРЅС‹ `dist/`, `.pnpm-store/`, `*.log`, `coverage/`, `.nyc_output/`, `.turbo/`, `.cache/`, `.vercel/`, `.env.production`

---

## [Unreleased] вЂ” 2026-04-06 (Admin UX audit: РїРѕР»РЅРѕС‚Р° СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ Р±РµР· РєРѕРґР°)

### Added (FAQ Admin вЂ” РЅРѕРІС‹Р№ СЂР°Р·РґРµР»)
- **API GET/POST `/kapi/admin/faq`** вЂ” СЃРїРёСЃРѕРє РІСЃРµС… РІРѕРїСЂРѕСЃРѕРІ + СЃРѕР·РґР°РЅРёРµ РЅРѕРІРѕРіРѕ
- **API PATCH/DELETE `/kapi/admin/faq/[id]`** вЂ” СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ Рё СѓРґР°Р»РµРЅРёРµ РїРѕ ID
- **`/admin/faq` вЂ” РЅРѕРІР°СЏ СЃС‚СЂР°РЅРёС†Р°** СЃРѕ СЃРїРёСЃРєРѕРј FAQ:
  - Р¤РёР»СЊС‚СЂ РїРѕ СЃС‚СЂР°РЅРёС†Рµ СЃР°Р№С‚Р° (Р“Р»Р°РІРЅР°СЏ, Р¦РµРЅС‹, Р”РѕСЃС‚Р°РІРєР° Рё РґСЂ.)
  - Р”РѕР±Р°РІР»РµРЅРёРµ, СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ, СѓРґР°Р»РµРЅРёРµ РІРѕРїСЂРѕСЃРѕРІ РїСЂСЏРјРѕ РІ Р±СЂР°СѓР·РµСЂРµ
  - РџРѕСЂСЏРґРѕРє РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ (РєРЅРѕРїРєРё в†‘ / в†“ РґР»СЏ РєР°Р¶РґРѕРіРѕ РІРѕРїСЂРѕСЃР°)
  - Р Р°СЃРєСЂС‹С‚РёРµ РѕС‚РІРµС‚Р° РїРѕ РєР»РёРєСѓ
  - Р’СЃРµ РїРѕР»СЏ: РІРѕРїСЂРѕСЃ, РѕС‚РІРµС‚, СЃС‚СЂР°РЅРёС†Р°, РїРѕСЂСЏРґРѕРє
- **AdminSidebar** вЂ” РґРѕР±Р°РІР»РµРЅ РїСѓРЅРєС‚ В«FAQ вЂ” Р’РѕРїСЂРѕСЃС‹ Рё РѕС‚РІРµС‚С‹В» (HelpCircle icon)

### Added (Admin Leads вЂ” СѓР»СѓС‡С€РµРЅРёСЏ)
- **РџРѕРёСЃРє Р·Р°СЏРІРѕРє** вЂ” СЃС‚СЂРѕРєР° РїРѕРёСЃРєР° РїРѕ РёРјРµРЅРё, С‚РµР»РµС„РѕРЅСѓ, РіРѕСЂРѕРґСѓ, С‚РµРєСЃС‚Сѓ РєРѕРјРјРµРЅС‚Р°СЂРёСЏ (URL-based, GET-РїР°СЂР°РјРµС‚СЂ `q`)
- **`LeadAssignedEditor`** вЂ” inline СЂРµРґР°РєС‚РѕСЂ РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕРіРѕ РјРµРЅРµРґР¶РµСЂР° (`assignedTo`) РЅР° РєР°Р¶РґРѕР№ Р·Р°СЏРІРєРµ (hover-to-edit, Р°РЅР°Р»РѕРі LeadNoteEditor)
- `admin/leads/page.tsx` вЂ” РёРЅС‚РµРіСЂРёСЂРѕРІР°РЅС‹: РїРѕРёСЃРє, LeadAssignedEditor, requireAdmin (server-side auth check)

### Changed (Dashboard)
- РљР°СЂС‚РѕС‡РєР° В«Р—Р°СЏРІРєРёВ» С‚РµРїРµСЂСЊ РїРѕРєР°Р·С‹РІР°РµС‚ РєРѕР»-РІРѕ Р·Р°СЏРІРѕРє СЃРѕ СЃС‚Р°С‚СѓСЃРѕРј `new` (РЅРµ РѕР±СЂР°Р±РѕС‚Р°РЅРЅС‹С…), РЅРµ РѕР±С‰РµРµ С‡РёСЃР»Рѕ
- РџРѕРґРїРёСЃСЊ РєР°СЂС‚РѕС‡РєРё вЂ” РµСЃР»Рё РµСЃС‚СЊ РЅРѕРІС‹Рµ: В«Р–РґСѓС‚ Р·РІРѕРЅРєР° вЂ” С‚СЂРµР±СѓСЋС‚ РІРЅРёРјР°РЅРёСЏВ» СЃ РІРёР·СѓР°Р»СЊРЅС‹Рј Р°Р»РµСЂС‚РѕРј
- Р”РѕР±Р°РІР»РµРЅ Р±С‹СЃС‚СЂС‹Р№ СЏСЂР»С‹Рє В«РћР±СЂР°Р±РѕС‚Р°С‚СЊ РЅРѕРІС‹Рµ Р·Р°СЏРІРєРёВ» РІ СЂР°Р·РґРµР» В«Р‘С‹СЃС‚СЂС‹Рµ РґРµР№СЃС‚РІРёСЏВ»

### Technical Debt (Р·Р°РґРѕРєСѓРјРµРЅС‚РёСЂРѕРІР°РЅРѕ, РЅРµ СЂРµР°Р»РёР·РѕРІР°РЅРѕ)
- **РЎС‚Р°С‚РёС‡РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹** вЂ” РєРѕРЅС‚РµРЅС‚ Рћ РЅР°СЃ, Р”РѕСЃС‚Р°РІРєР°, Р“Р°СЂР°РЅС‚РёСЏ, РџРѕР»РёС‚РёРєР° РєРѕРЅС„РёРґРµРЅС†РёР°Р»СЊРЅРѕСЃС‚Рё, РЈСЃР»РѕРІРёСЏ вЂ” Р·Р°С…Р°СЂРґРєРѕР¶РµРЅ РІ JSX-С„Р°Р№Р»Р°С…. РќРµС‚ CMS-РјРѕРґРµР»Рё. РњРµРЅРµРґР¶РµСЂ РЅРµ РјРѕР¶РµС‚ СЂРµРґР°РєС‚РёСЂРѕРІР°С‚СЊ С‚РµРєСЃС‚ СЌС‚РёС… СЃС‚СЂР°РЅРёС† Р±РµР· РїСЂР°РІРєРё РєРѕРґР°.

---

## [Unreleased] вЂ” 2026-04-06 (Р­С‚Р°Рї 10: РџРµСЂСЃРѕРЅР°Р»РёР·Р°С†РёСЏ Рё lead flow)

### Added (Schema)
- **Lead** РјРѕРґРµР»СЊ вЂ” СЂР°СЃС€РёСЂРµРЅР° 8 РЅРѕРІС‹РјРё РїРѕР»СЏРјРё:
  - `configSessionId String?` вЂ” link Рє СЃРѕС…СЂР°РЅС‘РЅРЅРѕР№ РєРѕРЅС„РёРіСѓСЂР°С†РёРё
  - `scenarioSlug String` вЂ” СЃС†РµРЅР°СЂРёР№ РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ
  - `styleSlug String` вЂ” РёРЅС‚РµСЂРµСЃСѓСЋС‰РёР№ СЃС‚РёР»СЊ
  - `materialSlug String` вЂ” РёРЅС‚РµСЂРµСЃСѓСЋС‰РёР№ РјР°С‚РµСЂРёР°Р»
  - `budgetLevel String` вЂ” Р±СЋРґР¶РµС‚РЅС‹Р№ СѓСЂРѕРІРµРЅСЊ (economy/standard/comfort/premium)
  - `status String` вЂ” СЃС‚Р°С‚СѓСЃ РІРµРґРµРЅРёСЏ (new/contacted/working/done/lost)
  - `managerNote String` вЂ” Р·Р°РјРµС‚РєР° РјРµРЅРµРґР¶РµСЂР°
  - `assignedTo String` вЂ” РѕС‚РІРµС‚СЃС‚РІРµРЅРЅС‹Р№ РјРµРЅРµРґР¶РµСЂ
- **SavedConfig** РЅРѕРІР°СЏ РјРѕРґРµР»СЊ (Р°РЅРѕРЅРёРјРЅС‹Рµ РєРѕРЅС„РёРіСѓСЂР°С†РёРё РїРѕ sessionId):
  - sessionId (unique), answers Json, tags String[], styleSlug, materialSlug, scenarioSlug, budgetLevel, label, phone, leadId
- **FavoriteCase** РЅРѕРІР°СЏ РјРѕРґРµР»СЊ (РёР·Р±СЂР°РЅРЅС‹Рµ РєРµР№СЃС‹ РїРѕ sessionId):
  - sessionId, caseSlug, @@unique([sessionId, caseSlug])

### Added (API)
- `POST/GET /kapi/saved-config` вЂ” СЃРѕС…СЂР°РЅРµРЅРёРµ Рё РїРѕР»СѓС‡РµРЅРёРµ РєРѕРЅС„РёРіСѓСЂР°С†РёРё РїРѕ sessionId (upsert)
- `POST/GET /kapi/favorites` вЂ” toggle РёР·Р±СЂР°РЅРЅРѕРіРѕ РєРµР№СЃР° + СЃРїРёСЃРѕРє РїРѕ sessionId
- `GET/PATCH /kapi/admin/leads/[id]` вЂ” GET РєРµР№СЃР° + PATCH СЃС‚Р°С‚СѓСЃ/Р·Р°РјРµС‚РєР°/РѕС‚РІРµС‚СЃС‚РІРµРЅРЅС‹Р№
- `GET /kapi/admin/saved-configs` вЂ” СЃРїРёСЃРѕРє СЃРѕС…СЂР°РЅС‘РЅРЅС‹С… РєРѕРЅС„РёРіСѓСЂР°С†РёР№ РґР»СЏ admin
- `/kapi/leads` POST вЂ” РїСЂРёРЅРёРјР°РµС‚ 5 РЅРѕРІС‹С… РїРѕР»РµР№ РїРµСЂСЃРѕРЅР°Р»РёР·Р°С†РёРё + РѕР±РЅРѕРІР»СЏРµС‚ SavedConfig.leadId

### Added (Frontend)
- `hooks/usePersonalization.ts` вЂ” localStorage sessionId + favorites + savedConfig (Р±РµР· Р°РєРєР°СѓРЅС‚Р°)
- `components/ui/FavoriteButton.tsx` вЂ” РєРЅРѕРїРєР° "Р’ РёР·Р±СЂР°РЅРЅРѕРµ" СЃ heart-toggle (rose-themed)
- `components/sections/ConfigResultActions.tsx` вЂ” РїР°РЅРµР»СЊ "Р’Р°С€ РІР°СЂРёР°РЅС‚": РЎРѕС…СЂР°РЅРёС‚СЊ РІС‹Р±РѕСЂ + РћС‚РїСЂР°РІРёС‚СЊ РЅР° РїСЂРѕСЃС‡С‘С‚ (СЃ inline-С„РѕСЂРјРѕР№ РёРјСЏ/С‚РµР»РµС„РѕРЅ/РіРѕСЂРѕРґ)
- `components/sections/SavedConfigBanner.tsx` вЂ” Р±Р°РЅРЅРµСЂ "РџСЂРѕРґРѕР»Р¶РёС‚СЊ РІР°С€ РїРѕРґР±РѕСЂ" РЅР° РєРѕРЅС„РёРіСѓСЂР°С‚РѕСЂРµ (С‡РёС‚Р°РµС‚ localStorage, РїРѕРєР°Р·С‹РІР°РµС‚СЃСЏ РµСЃР»Рё РµСЃС‚СЊ saved config)
- `lib/lead-status.ts` вЂ” shared РєРѕРЅСЃС‚Р°РЅС‚С‹ STATUS_OPTIONS (РґРѕСЃС‚СѓРїРЅС‹ Рё server, Рё client РєРѕРјРїРѕРЅРµРЅС‚Р°Рј)

### Added (Admin UI)
- `app/admin/leads/page.tsx` вЂ” РїРѕР»РЅС‹Р№ РїРµСЂРµРїРёСЃ:
  - РўР°Р±С‹ СЃС‚Р°С‚СѓСЃРѕРІ (Р’СЃРµ/РќРѕРІР°СЏ/РЎРІСЏР·Р°Р»РёСЃСЊ/Р’ СЂР°Р±РѕС‚Рµ/Р“РѕС‚РѕРІРѕ/РћС‚РєР°Р·) СЃ СЃС‡С‘С‚С‡РёРєР°РјРё
  - Р”Р»СЏ РєР°Р¶РґРѕР№ Р·Р°СЏРІРєРё: РєРѕРЅС‚Р°РєС‚, РёСЃС‚РѕС‡РЅРёРє, config-Р±Р»РѕРє СЃ С†РІРµС‚РЅС‹РјРё С‚РµРіР°РјРё (СЃС‚РёР»СЊ/РјР°С‚РµСЂРёР°Р»/Р±СЋРґР¶РµС‚/СЃС†РµРЅР°СЂРёР№)
  - Inline СЃРјРµРЅР° СЃС‚Р°С‚СѓСЃР° С‡РµСЂРµР· `LeadStatusControl`
  - Inline СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ Р·Р°РјРµС‚РєРё РјРµРЅРµРґР¶РµСЂР° С‡РµСЂРµР· `LeadNoteEditor`
  - РљРЅРѕРїРєР° "РџРѕР·РІРѕРЅРёС‚СЊ" РЅР° РєР°Р¶РґРѕР№ Р·Р°РїРёСЃРё
- `components/admin/LeadStatusControl.tsx` вЂ” РєР»РёРµРЅС‚СЃРєРёР№ dropdown СЃРјРµРЅС‹ СЃС‚Р°С‚СѓСЃР°
- `components/admin/LeadNoteEditor.tsx` вЂ” inline СЂРµРґР°РєС‚РѕСЂ Р·Р°РјРµС‚РєРё РјРµРЅРµРґР¶РµСЂР° (hover-to-edit)
- `app/admin/saved-configs/page.tsx` вЂ” РЅРѕРІР°СЏ СЃС‚СЂР°РЅРёС†Р° "РЎРѕС…СЂР°РЅС‘РЅРЅС‹Рµ РїРѕРґР±РѕСЂС‹" РІ admin sidebar

### Changed (Pages)
- `configure/result/page.tsx` вЂ” РґРѕР±Р°РІР»РµРЅ Р±Р»РѕРє `ConfigResultActions` (save + send) РІС‹С€Рµ СЂРµРєРѕРјРµРЅРґР°С†РёР№
- `configure/page.tsx` вЂ” РґРѕР±Р°РІР»РµРЅ `SavedConfigBanner` (РїРѕРєР°Р·С‹РІР°РµС‚СЃСЏ РµСЃР»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ СЂР°РЅРµРµ СЃРѕС…СЂР°РЅСЏР» РїРѕРґР±РѕСЂ)
- `portfolio/page.tsx` в†’ `PortfolioFilters.tsx` вЂ” РґРѕР±Р°РІР»РµРЅ `FavoriteButton` РЅР° РєР°Р¶РґСѓСЋ РєР°СЂС‚РѕС‡РєСѓ
- `portfolio/[slug]/page.tsx` вЂ” РґРѕР±Р°РІР»РµРЅ `FavoriteButton` СЂСЏРґРѕРј СЃ Р·Р°РіРѕР»РѕРІРєРѕРј РєРµР№СЃР°
- Admin sidebar вЂ” РґРѕР±Р°РІР»РµРЅ РїСѓРЅРєС‚ "РЎРѕС…СЂР°РЅС‘РЅРЅС‹Рµ РїРѕРґР±РѕСЂС‹" (Bookmark icon)

---

## [v9.0] вЂ” 2026-04-06 (Р­С‚Р°Рї 9: Smart cross-linking system)

### Added
- **BlogPost schema вЂ” 3 РЅРѕРІС‹С… РїРѕР»СЏ** (`prisma db push`):
  - `relatedCaseSlugs String[]` вЂ” РїСЂРёРєСЂРµРїР»С‘РЅРЅС‹Рµ РєРµР№СЃС‹ РїРѕСЂС‚С„РѕР»РёРѕ
  - `relatedStyleSlugs String[]` вЂ” РїСЂРёРєСЂРµРїР»С‘РЅРЅС‹Рµ СЃС‚РёР»Рё РєСѓС…РѕРЅСЊ
  - `relatedScenarioSlugs String[]` вЂ” РїСЂРёРєСЂРµРїР»С‘РЅРЅС‹Рµ СЃС†РµРЅР°СЂРёРё РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏ
- **StylePage РїСѓР±Р»РёС‡РЅР°СЏ СЃС‚СЂР°РЅРёС†Р°** (`/styles/[slug]`) вЂ” РЅРѕРІР°СЏ СЃРµРєС†РёСЏ В«Р Р°Р±РѕС‚С‹ РІ СЌС‚РѕРј СЃС‚РёР»РµВ» (СЃРµС‚РєР° РєРµР№СЃ-РєР°СЂС‚РѕС‡РµРє РёР· `relatedCaseSlugs`)
- **MaterialPage РїСѓР±Р»РёС‡РЅР°СЏ СЃС‚СЂР°РЅРёС†Р°** (`/materials/[slug]`) вЂ” РЅРѕРІР°СЏ СЃРµРєС†РёСЏ В«Р Р°Р±РѕС‚С‹ РёР· СЌС‚РѕРіРѕ РјР°С‚РµСЂРёР°Р»Р°В» (СЃРµС‚РєР° РєРµР№СЃ-РєР°СЂС‚РѕС‡РµРє РёР· `relatedCaseSlugs`)
- **PortfolioCase РїСѓР±Р»РёС‡РЅР°СЏ СЃС‚СЂР°РЅРёС†Р°** (`/portfolio/[slug]`) вЂ” РІРёРґР¶РµС‚ РІ sidebar В«РљСѓС…РЅРё РІ РІР°С€РµРј СЂРµРіРёРѕРЅРµВ»: Р°РІС‚Рѕ-РЅР°С…РѕРґРёС‚ LocationPage РїРѕ РїРѕР»СЋ `city` (Р±РµР· СЂСѓС‡РЅРѕР№ РЅР°СЃС‚СЂРѕР№РєРё)
- **BlogPost РїСѓР±Р»РёС‡РЅР°СЏ СЃС‚СЂР°РЅРёС†Р°** (`/blog/[slug]`) вЂ” РїРѕР»РЅРѕСЃС‚СЊСЋ РїРµСЂРµСЂР°Р±РѕС‚Р°РЅР°:
  - РЎРµРєС†РёСЏ В«РџРѕС…РѕР¶РёРµ РїСЂРѕРµРєС‚С‹ РёР· РїРѕСЂС‚С„РѕР»РёРѕВ» (РєР°СЂС‚РѕС‡РєРё РёР· `relatedCaseSlugs`)
  - РЎРµРєС†РёСЏ В«РЎС‚РёР»Рё РєСѓС…РѕРЅСЊ РїРѕ С‚РµРјРµВ» (РёР· `relatedStyleSlugs`)
  - РЎРµРєС†РёСЏ В«РџРѕРґС…РѕРґРёС‚ РґР»СЏ РІР°С€РµРіРѕ СЃС†РµРЅР°СЂРёСЏВ» (РёР· `relatedScenarioSlugs`)
  - Sidebar: С„РѕСЂРјР° Р·Р°С…РІР°С‚Р° Р»РёРґР° + Р±Р»РѕРє В«Р”СЂСѓРіРёРµ СЃС‚Р°С‚СЊРёВ»
- **BlogPostForm** вЂ” РЅРѕРІР°СЏ РїР°РЅРµР»СЊ В«РЎРІСЏР·Р°РЅРЅС‹Р№ РєРѕРЅС‚РµРЅС‚В» (3 textarea РґР»СЏ slug-РѕРІ РєРµР№СЃРѕРІ/СЃС‚РёР»РµР№/СЃС†РµРЅР°СЂРёРµРІ)
- **BlogPost API routes** (POST + PUT Zod schemas) вЂ” РґРѕР±Р°РІР»РµРЅС‹ 3 РЅРѕРІС‹С… РїРѕР»СЏ РІ РІР°Р»РёРґР°С†РёСЋ
- **Cross-link Р°РІС‚Рѕ-СЃРёРґ** вЂ” `relatedCaseSlugs` Р·Р°РїРѕР»РЅРµРЅС‹ РґР»СЏ РІСЃРµС… StylePage/MaterialPage/ScenarioPage РїРѕ СЃРѕРІРїР°РґРµРЅРёСЋ С‚РµРіРѕРІ:
  - `minimalizm` в†’ uglovaya-kuhnya, malenkaya-kuhnya-studiya
  - `sovremennye` в†’ kuhnya-s-ostrovom, kuhnya-do-potolka
  - `emal` в†’ uglovaya-kuhnya, klassicheskaya, kuhnya-do-potolka
  - `semya-s-detmi` в†’ skandinavskaya, kuhnya-do-potolka
  - (Рё С‚.Рґ. РґР»СЏ РІСЃРµС… СЃС‚РёР»РµР№/РјР°С‚РµСЂРёР°Р»РѕРІ/СЃС†РµРЅР°СЂРёРµРІ)

### Changed
- Zod BlogSchema (POST): РґРѕР±Р°РІР»РµРЅС‹ relatedCaseSlugs/relatedStyleSlugs/relatedScenarioSlugs СЃ `default([])`
- Zod BlogSchema (PUT): РґРѕР±Р°РІР»РµРЅС‹ С‚Рµ Р¶Рµ РїРѕР»СЏ РєР°Рє optional

---

## [v8.0] вЂ” 2026-04-06 (Р­С‚Р°Рї 8: LocationPage вЂ” СЂР°СЃС€РёСЂРµРЅРЅС‹Р№ РєРѕРЅС‚РµРЅС‚ Рё СЃРІСЏР·Рё)

### Added
- **LocationPage schema вЂ” 7 РЅРѕРІС‹С… РїРѕР»РµР№** (РјРёРіСЂРёСЂРѕРІР°РЅРѕ С‡РµСЂРµР· `prisma db push`):
  - `localIntro String?` вЂ” СѓРЅРёРєР°Р»СЊРЅС‹Р№ РІРІРѕРґРЅС‹Р№ Р°Р±Р·Р°С† РґР»СЏ РіРѕСЂРѕРґР°
  - `uniquePoints Json?` вЂ” РјР°СЃСЃРёРІ `{emoji, title, text}` вЂ” Р»РѕРєР°Р»СЊРЅС‹Рµ РїСЂРµРёРјСѓС‰РµСЃС‚РІР° СЃ РёРєРѕРЅРєРѕР№
  - `contentBlocks Json?` вЂ” РјР°СЃСЃРёРІ `{title, text, type}` вЂ” С‚РµРєСЃС‚РѕРІС‹Рµ Р±Р»РѕРєРё (type: "text"|"highlight")
  - `caseSlugs String[]` вЂ” РІСЂСѓС‡РЅСѓСЋ РїСЂРёРєСЂРµРїР»С‘РЅРЅС‹Рµ РєРµР№СЃС‹ РїРѕСЂС‚С„РѕР»РёРѕ
  - `reviewIds Int[]` вЂ” РІСЂСѓС‡РЅСѓСЋ РїСЂРёРєСЂРµРїР»С‘РЅРЅС‹Рµ РѕС‚Р·С‹РІС‹
  - `ctaHeadline String?` вЂ” РєР°СЃС‚РѕРјРЅС‹Р№ Р·Р°РіРѕР»РѕРІРѕРє CTA-Р±Р»РѕРєР°
  - `ctaSubtext String?` вЂ” РєР°СЃС‚РѕРјРЅС‹Р№ РїРѕРґР·Р°РіРѕР»РѕРІРѕРє CTA-Р±Р»РѕРєР°
- **РџСѓР±Р»РёС‡РЅР°СЏ `/locations/[city]/page.tsx` РїРѕР»РЅРѕСЃС‚СЊСЋ РїРµСЂРµСЂР°Р±РѕС‚Р°РЅР°**:
  - РЎРµРєС†РёСЏ В«РЈРЅРёРєР°Р»СЊРЅС‹Р№ РІРІРѕРґРЅС‹Р№ С‚РµРєСЃС‚В» (localIntro)
  - РЎРµРєС†РёСЏ В«РљР°Рє РјС‹ СЂР°Р±РѕС‚Р°РµРј РІ [РіРѕСЂРѕРґРµ]В» вЂ” РєР°СЂС‚РѕС‡РєРё uniquePoints СЃ emoji
  - РЎРµРєС†РёСЏ В«РќР°С€Рё СЂР°Р±РѕС‚С‹ РІ [РіРѕСЂРѕРґРµ]В» вЂ” РїСЂРёРєСЂРµРїР»С‘РЅРЅС‹Рµ + Р°РІС‚РѕРЅР°Р№РґРµРЅРЅС‹Рµ РєРµР№СЃС‹
  - РЎРµРєС†РёСЏ В«РћС‚Р·С‹РІС‹ РёР· [РіРѕСЂРѕРґР°]В» вЂ” РїСЂРёРєСЂРµРїР»С‘РЅРЅС‹Рµ + Р°РІС‚РѕРЅР°Р№РґРµРЅРЅС‹Рµ РѕС‚Р·С‹РІС‹
  - РЎРµРєС†РёСЏ В«Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ РјР°С‚РµСЂРёР°Р»С‹В» вЂ” contentBlocks (highlight РІС‹РґРµР»СЏРµС‚СЃСЏ С„РёРѕР»РµС‚РѕРІРѕР№ СЂР°РјРєРѕР№)
  - РљР°СЃС‚РѕРјРЅС‹Р№ CTA СЃ ctaHeadline/ctaSubtext РёР»Рё РґРµС„РѕР»С‚РЅС‹Р№ С‚РµРєСЃС‚
  - Safe cast `Array.isArray()` РґР»СЏ РІСЃРµС… JSON РїРѕР»РµР№
- **DB seed РњРёРЅСЃРє Рё РњРёРЅСЃРєР°СЏ РѕР±Р»Р°СЃС‚СЊ** вЂ” Р·Р°РїРѕР»РЅРµРЅС‹ uniquePoints (4 С€С‚.) Рё contentBlocks (2 С€С‚.) СЂРµР°Р»СЊРЅС‹Рј СѓРЅРёРєР°Р»СЊРЅС‹Рј РєРѕРЅС‚РµРЅС‚РѕРј
- **LocationForm.tsx вЂ” РїРѕР»РЅРѕРµ РѕР±РЅРѕРІР»РµРЅРёРµ** (6 РЅРѕРІС‹С… РІРєР»Р°РґРѕРє/СЃРµРєС†РёР№):
  - РќРѕРІР°СЏ РІРєР»Р°РґРєР° В«РЎРІСЏР·РёВ» вЂ” СЂРµРґР°РєС‚РѕСЂС‹ caseSlugs Рё reviewIds СЃ С‚РµРі-РїРёР»СЋР»СЏРјРё
  - Р’ РІРєР»Р°РґРєРµ В«РљРѕРЅС‚РµРЅС‚В» вЂ” СЂРµРґР°РєС‚РѕСЂС‹ localIntro, uniquePoints, contentBlocks СЃ inline preview
  - Р’ РІРєР»Р°РґРєРµ В«РћСЃРЅРѕРІРЅРѕРµВ» вЂ” РїРѕР»СЏ ctaHeadline Рё ctaSubtext
  - Р’СЃРµ С…РµР»РїРµСЂС‹: add/remove РґР»СЏ uniquePoints, contentBlocks, caseSlugs, reviewIds
- **Edit page** РѕР±РЅРѕРІР»С‘РЅ вЂ” РєРѕСЂСЂРµРєС‚РЅС‹Р№ cast РІСЃРµС… РЅРѕРІС‹С… Json/Array РїРѕР»РµР№ РїСЂРё Р·Р°РіСЂСѓР·РєРµ

---

## [Released] вЂ” 2026-04-06 (Р­С‚Р°Рї 7: РЎРёСЃС‚РµРјР° РѕС‚Р·С‹РІРѕРІ вЂ” СЂР°СЃС€РёСЂРµРЅРёРµ)

### Added
- **Review schema вЂ” 5 РЅРѕРІС‹С… РїРѕР»РµР№**: region, source, sourceUrl, featured, managerNote
- **РњРѕРґРµСЂР°С†РёСЏ (4 РІРєР»Р°РґРєРё)**: РќРѕРІС‹Рµ / РќР° РїСЂРѕРІРµСЂРєРµ / РћРїСѓР±Р»РёРєРѕРІР°РЅРѕ / РћС‚РєР»РѕРЅРµРЅРѕ
- **РџСѓР±Р»РёС‡РЅР°СЏ /reviews** СЃ СЃРµРєС†РёРµР№ featured РѕС‚Р·С‹РІРѕРІ
- **SourceBadge** вЂ” Р±РµР№РґР¶Рё РёСЃС‚РѕС‡РЅРёРєР° (Google/РЇРЅРґРµРєСЃ/2Р“РРЎ/Onliner/whatsapp/direct)
- **РЎРІСЏР·СЊ СЃ РєРµР№СЃРѕРј** С‡РµСЂРµР· caseSlug
- **РџРѕР»РЅС‹Р№ workflow РјРѕРґРµСЂР°С†РёРё** NEWв†’PENDINGв†’PUBLISHED|REJECTED

---

## [Released] вЂ” 2026-04-06 (Р­С‚Р°Рї 6: РљРѕРЅС„РёРіСѓСЂР°С‚РѕСЂ РєСѓС…РЅРё)

### Added
- **Prisma-РјРѕРґРµР»Рё (3 РЅРѕРІС‹С…)**:
  - `ConfigStep` вЂ” С€Р°РіРё РєРѕРЅС„РёРіСѓСЂР°С‚РѕСЂР° (key, question, hint, emoji, type, order, active)
  - `ConfigOption` вЂ” РІР°СЂРёР°РЅС‚С‹ РѕС‚РІРµС‚Р° (key, label, description, emoji, `tags[]`, order, active) c Cascade-СѓРґР°Р»РµРЅРёРµРј
  - `ConfigResult` вЂ” СЃРѕС…СЂР°РЅС‘РЅРЅС‹Рµ СЃРµСЃСЃРёРё (answers JSON, `tags[]` Р°РіСЂРµРі., leadId)
- **8 С€Р°РіРѕРІ + 32 РІР°СЂРёР°РЅС‚Р° РїРѕСЃРµСЏРЅРѕ** СЃ С‚РµРіР°РјРё:
  - РџР»Р°РЅРёСЂРѕРІРєР° (straight/corner/u_shape/island)
  - РџР»РѕС‰Р°РґСЊ (small/medium/large/xlarge)
  - РЎС‚РёР»СЊ (modern/scandinavian/minimalist/loft/classic/provence)
  - РџСЂРёРѕСЂРёС‚РµС‚ (design/balance/practical/budget)
  - Р”РµС‚Рё (yes_small/yes_older/no)
  - РҐСЂР°РЅРµРЅРёРµ (minimal/standard/lots/smart)
  - РўРµС…РЅРёРєР° (column/builtin/own)
  - Р‘СЋРґР¶РµС‚ (economy/standard/comfort/premium)
- **API routes (6 РЅРѕРІС‹С…)**:
  - `GET /kapi/configurator/steps` вЂ” Р°РєС‚РёРІРЅС‹Рµ С€Р°РіРё СЃ РѕРїС†РёСЏРјРё (РїСѓР±Р»РёС‡РЅС‹Р№)
  - `POST /kapi/configurator/result` вЂ” СЃРѕС…СЂР°РЅРµРЅРёРµ СЃРµСЃСЃРёРё
  - `GET/POST /kapi/admin/configurator/steps` вЂ” CRUD С€Р°РіРѕРІ (admin)
  - `PATCH/DELETE /kapi/admin/configurator/steps/[id]`
  - `POST /kapi/admin/configurator/options` вЂ” СЃРѕР·РґР°РЅРёРµ РІР°СЂРёР°РЅС‚Р°
  - `PATCH/DELETE /kapi/admin/configurator/options/[id]`
- **`/configure`** вЂ” РїСѓР±Р»РёС‡РЅР°СЏ SSR-РѕР±РѕР»РѕС‡РєР° РєРѕРЅС„РёРіСѓСЂР°С‚РѕСЂР°
- **`ConfiguratorFlow.tsx`** вЂ” 8-С€Р°РіРѕРІС‹Р№ wizard (client):
  - Р—Р°РіСЂСѓР·РєР° С€Р°РіРѕРІ РёР· DB С‡РµСЂРµР· `/kapi/configurator/steps`
  - РџСЂРѕРіСЂРµСЃСЃ-Р±Р°СЂ + С‚РѕС‡РєРё С€Р°РіРѕРІ (Р°РєС‚РёРІРЅР°СЏ = С€РёСЂРѕРєР°СЏ)
  - РђРІС‚Рѕ-РїРµСЂРµС…РѕРґ (300РјСЃ) РїРѕСЃР»Рµ РІС‹Р±РѕСЂР° РІР°СЂРёР°РЅС‚Р°
  - РљРЅРѕРїРєР° В«РџСЂРѕРїСѓСЃС‚РёС‚СЊВ» РґР»СЏ РЅРµРѕР±СЏР·Р°С‚РµР»СЊРЅС‹С… С€Р°РіРѕРІ
  - РџСЂРё Р·Р°РІРµСЂС€РµРЅРёРё: Р°РіСЂРµРіР°С†РёСЏ С‚РµРіРѕРІ в†’ save в†’ redirect СЃ `?tags=...`
- **`/configure/result`** вЂ” SSR СЃС‚СЂР°РЅРёС†Р° СЂРµР·СѓР»СЊС‚Р°С‚Р°:
  - РџР°СЂСЃРёРЅРі С‚РµРіРѕРІ РёР· query params
  - РњР°РїРїРёРЅРі tag-РєР»СЋС‡РµР№ в†’ DB slugs (`style:scandinavian` в†’ `skandinavskie`)
  - Р‘Р»РѕРє СЃС‚РёР»РµР№ (StylePage), РјР°С‚РµСЂРёР°Р»РѕРІ (MaterialPage), РєРµР№СЃРѕРІ (PortfolioCase)
  - CTA: РєР°Р»СЊРєСѓР»СЏС‚РѕСЂ СЃ РїСЂРµРґР·Р°РїРѕР»РЅРµРЅРЅС‹РјРё РѕС‚РІРµС‚Р°РјРё, С„РѕСЂРјР° Р·Р°РјРµСЂР°
  - РљРЅРѕРїРєР° В«РџСЂРѕР№С‚Рё Р·Р°РЅРѕРІРѕВ»
- **`/admin/configurator`** вЂ” admin CRUD:
  - РЎС‡С‘С‚С‡РёРє РїСЂРѕР№РґРµРЅРЅС‹С… СЃРµСЃСЃРёР№
  - РџРѕСЏСЃРЅРµРЅРёРµ Р»РѕРіРёРєРё С‚РµРіРѕРІ
  - `ConfigStepsEditor.tsx` вЂ” СЂР°СЃРєСЂС‹РІР°РµРјС‹Рµ С€Р°РіРё, inline-СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ
  - `OptionRow` вЂ” СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ РІР°СЂРёР°РЅС‚Р°: label/emoji/desc/tags СЃ С†РІРµС‚РЅС‹РјРё Р±РµР№РґР¶Р°РјРё РїРѕ РїСЂРµС„РёРєСЃСѓ
  - РЎРѕР·РґР°РЅРёРµ РЅРѕРІС‹С… С€Р°РіРѕРІ Рё РІР°СЂРёР°РЅС‚РѕРІ С‡РµСЂРµР· С„РѕСЂРјСѓ
  - РЈРїСЂР°РІР»РµРЅРёРµ Р°РєС‚РёРІРЅРѕСЃС‚СЊСЋ (show/hide)
- **РќР°РІРёРіР°С†РёСЏ** вЂ” В«РџРѕРґР±РѕСЂ РєСѓС…РЅРёВ» РІ РїСѓР±Р»РёС‡РЅРѕРј С…РµРґРµСЂРµ, В«РљРѕРЅС„РёРіСѓСЂР°С‚РѕСЂВ» РІ admin sidebar

### Architecture
- РўРµРі С„РѕСЂРјР°С‚: `prefix:value` (style:scandinavian, budget:standard, material:veneerвЂ¦)
- Р РµРєРѕРјРµРЅРґР°С†РёРё СЃС‚СЂРѕСЏС‚СЃСЏ СЃРµСЂРІРµСЂРѕРј РЅР° РѕСЃРЅРѕРІРµ СЃРѕР±СЂР°РЅРЅС‹С… С‚РµРіРѕРІ Р±РµР· С…Р°СЂРґРєРѕРґР°
- Admin РјРµРЅСЏРµС‚ С‚РµРіРё РІР°СЂРёР°РЅС‚РѕРІ в†’ СЂРµРєРѕРјРµРЅРґР°С†РёРё РјРµРЅСЏСЋС‚СЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё

---

## [Unreleased] вЂ” 2026-04-06 (Р­С‚Р°Рї 5: РљР°Р»СЊРєСѓР»СЏС‚РѕСЂ СЃ DB-driven PriceRules)

### Added
- **Prisma-РјРѕРґРµР»СЊ `PriceRule`** вЂ” 34 РїСЂР°РІРёР»Р° РїРѕСЃРµСЏРЅРѕ РІ 8 РєР°С‚РµРіРѕСЂРёСЏС…:
  - `material` (5 РїСЂР°РІРёР») вЂ” Р±Р°Р·РѕРІС‹Рµ С†РµРЅС‹ С„Р°СЃР°РґРѕРІ (BYN/РјВІ)
  - `layout` (4) вЂ” РєРѕСЌС„С„РёС†РёРµРЅС‚С‹ РїР»Р°РЅРёСЂРѕРІРєРё
  - `style` (6) вЂ” РєРѕСЌС„С„РёС†РёРµРЅС‚С‹ СЃС‚РёР»СЏ
  - `countertop` (4) вЂ” РЅР°РґР±Р°РІРєРё Р·Р° СЃС‚РѕР»РµС€РЅРёС†Сѓ
  - `hardware` (3) вЂ” РЅР°РґР±Р°РІРєРё Р·Р° С„СѓСЂРЅРёС‚СѓСЂСѓ (BYN/РјВІ)
  - `tech` (3) вЂ” РЅР°РґР±Р°РІРєРё Р·Р° РІСЃС‚СЂРѕРµРЅРЅСѓСЋ С‚РµС…РЅРёРєСѓ
  - `priority` (4) вЂ” РєРѕСЂСЂРµРєС‚РёСЂРѕРІРєРё РїСЂРёРѕСЂРёС‚РµС‚Р° РєР»РёРµРЅС‚Р°
  - `config` (5) вЂ” РїР°СЂР°РјРµС‚СЂС‹ СЂР°СЃС‡С‘С‚Р° (РґРёР°РїР°Р·РѕРЅ, РјРёРЅ/РјР°РєСЃ/РґРµС„РѕР»С‚ РїР»РѕС‰Р°РґСЊ)
- **`/kapi/calculator` (POST)** вЂ” API СЂР°СЃС‡С‘С‚Р° СЃС‚РѕРёРјРѕСЃС‚Рё. Р¤РѕСЂРјСѓР»Р°:
  `base = material/РјВІ Г— area Г— layoutCoeff Г— styleCoeff + countertop + hardware/РјВІ Г— area + tech`
  `в†’ Г— (1+priority) в†’ Г— rangeLow..rangeHigh в†’ round50`
- **`/kapi/admin/prices` (GET/PUT)** вЂ” РїСЂРѕСЃРјРѕС‚СЂ Рё bulk-РѕР±РЅРѕРІР»РµРЅРёРµ РїСЂР°РІРёР»
- **`/kapi/admin/prices/[id]` (PATCH)** вЂ” РѕР±РЅРѕРІР»РµРЅРёРµ РѕРґРЅРѕРіРѕ РїСЂР°РІРёР»Р°
- **`/admin/prices`** вЂ” РїРѕР»РЅРѕСЃС‚СЊСЋ РїРµСЂРµРїРёСЃР°РЅР°: DB-driven, РіСЂСѓРїРїРёСЂРѕРІРєР° РїРѕ РєР°С‚РµРіРѕСЂРёСЏРј, С„РѕСЂРјСѓР»Р° РІ РїРѕРґСЃРєР°Р·РєРµ
- **`PriceRulesEditor.tsx`** вЂ” РєР»РёРµРЅС‚СЃРєРёР№ РєРѕРјРїРѕРЅРµРЅС‚ СЂРµРґР°РєС‚РѕСЂР°:
  - Р“СЂСѓРїРїРёСЂРѕРІРєР° РїРѕ 8 РєР°С‚РµРіРѕСЂРёСЏРј, РєР°Р¶РґР°СЏ СЃРІРѕСЂР°С‡РёРІР°РµС‚СЃСЏ/СЂР°Р·РІРѕСЂР°С‡РёРІР°РµС‚СЃСЏ
  - Inline-СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ value/label/description
  - Sticky save-bar РїСЂРё РЅР°Р»РёС‡РёРё РЅРµСЃРѕС…СЂР°РЅС‘РЅРЅС‹С… РёР·РјРµРЅРµРЅРёР№
  - Batch PATCH С‡РµСЂРµР· `/kapi/admin/prices` (PUT)
- **`/calculator`** вЂ” РїСѓР±Р»РёС‡РЅР°СЏ СЃС‚СЂР°РЅРёС†Р° РєР°Р»СЊРєСѓР»СЏС‚РѕСЂР° (SSR)
- **`CalculatorWizard.tsx`** вЂ” 8-С€Р°РіРѕРІС‹Р№ РєР»РёРµРЅС‚СЃРєРёР№ РІРёР·Р°СЂРґ:
  - РЁР°РіРё: РїР»Р°РЅРёСЂРѕРІРєР°, РїР»РѕС‰Р°РґСЊ (СЃР»Р°Р№РґРµСЂ), СЃС‚РёР»СЊ, РјР°С‚РµСЂРёР°Р», СЃС‚РѕР»РµС€РЅРёС†Р°, С„СѓСЂРЅРёС‚СѓСЂР°, С‚РµС…РЅРёРєР°, РїСЂРёРѕСЂРёС‚РµС‚
  - РђРІС‚Рѕ-РїРµСЂРµС…РѕРґ РїРѕСЃР»Рµ РІС‹Р±РѕСЂР° РІР°СЂРёР°РЅС‚Р° (260РјСЃ)
  - Р РµР·СѓР»СЊС‚Р°С‚: РґРёР°РїР°Р·РѕРЅ С†РµРЅ + С„Р°РєС‚РѕСЂС‹ + CTA-С„РѕСЂРјР° Р·Р°РјРµСЂР°
  - Р‘С‹СЃС‚СЂС‹Рµ РєРЅРѕРїРєРё РїР»РѕС‰Р°РґРё (8/12/16/20/24/28 РјВІ)
- **РќР°РІРёРіР°С†РёСЏ** вЂ” РґРѕР±Р°РІР»РµРЅР° СЃСЃС‹Р»РєР° В«РљР°Р»СЊРєСѓР»СЏС‚РѕСЂВ» РІ РґРµСЃРєС‚РѕРїРЅРѕРµ Рё РјРѕР±РёР»СЊРЅРѕРµ РјРµРЅСЋ

---

## [Unreleased] вЂ” 2026-04-06 (Р­С‚Р°Рї 4: PortfolioCase РєР°Рє РїРѕР»РЅРѕС†РµРЅРЅС‹Рµ РєРµР№СЃ-СЃС‚Р°РґРё)

### Added
- **Р Р°СЃС€РёСЂРµРЅР° Prisma-РјРѕРґРµР»СЊ `PortfolioCase`** вЂ” РґРѕР±Р°РІР»РµРЅРѕ 15+ РїРѕР»РµР№:
  - `region`, `layout`, `completedAt` вЂ” РіРµРѕРіСЂР°С„РёСЏ Рё РїР»Р°РЅРёСЂРѕРІРєР°
  - `constraints`, `result` вЂ” РёСЃС‚РѕСЂРёСЏ РїСЂРѕРµРєС‚Р°: РѕРіСЂР°РЅРёС‡РµРЅРёСЏ + СЂРµР·СѓР»СЊС‚Р°С‚
  - `photosBefore[]`, `photosAfter[]` вЂ” Р±Р»РѕРє В«Р”Рѕ Рё РџРѕСЃР»РµВ»
  - `reviewIds[]` вЂ” РїСЂРёРІСЏР·РєР° РѕС‚Р·С‹РІРѕРІ Рє РєРµР№СЃСѓ
  - `featured`, `order` вЂ” СѓРїСЂР°РІР»РµРЅРёРµ РїСЂРёРѕСЂРёС‚РµС‚РѕРј РѕС‚РѕР±СЂР°Р¶РµРЅРёСЏ
  - `styleSlug`, `materialSlugs[]`, `scenarioSlugs[]` вЂ” РІРЅСѓС‚СЂРµРЅРЅРёРµ СЃСЃС‹Р»РєРё РїРѕ slug
  - `seoKeywords` вЂ” SEO РєР»СЋС‡РµРІС‹Рµ СЃР»РѕРІР° РєРµР№СЃР°
- **Р”РѕР±Р°РІР»РµРЅРѕ РїРѕР»Рµ `caseSlug` РІ РјРѕРґРµР»СЊ `Review`** вЂ” РїСЂРёРІСЏР·РєР° РѕС‚Р·С‹РІР° Рє РєРѕРЅРєСЂРµС‚РЅРѕРјСѓ РєРµР№СЃСѓ
- **6 Р±РѕРіР°С‚С‹С… РєРµР№СЃРѕРІ РїРѕСЃРµСЏРЅРѕ** РІ Р‘Р”:
  - `uglovaya-kuhnya-minimalizm-minsk-kirova` вЂ” РЈРіР»РѕРІР°СЏ, 14 РјВІ, РјРёРЅРёРјР°Р»РёР·Рј, РњРёРЅСЃРє
  - `skandinavskaya-kuhnya-borisov-chastniy-dom` вЂ” Рџ-РѕР±СЂР°Р·РЅР°СЏ, 16 РјВІ, СЃРєР°РЅРґРёРЅР°РІ, Р‘РѕСЂРёСЃРѕРІ
  - `kuhnya-s-ostrovom-minsk-partizansky` вЂ” РЎ РѕСЃС‚СЂРѕРІРѕРј, 22 РјВІ, СЃРѕРІСЂРµРјРµРЅРЅС‹Р№, РњРёРЅСЃРє в… featured
  - `klassicheskaya-kuhnya-molodechno-chastniy-dom` вЂ” РљР»Р°СЃСЃРёРєР° СЃ РїР°С‚РёРЅРѕР№, 18 РјВІ, РњРѕР»РѕРґРµС‡РЅРѕ
  - `malenkaya-kuhnya-studiya-suharyovo` вЂ” РЎС‚СѓРґРёСЏ, 6 РјВІ, РјРёРЅРёРјР°Р»РёР·Рј, РњРёРЅСЃРє
  - `kuhnya-do-potolka-minsk-vostok` вЂ” Р”Рѕ РїРѕС‚РѕР»РєР°, 12 РјВІ, СЃРѕРІСЂРµРјРµРЅРЅС‹Р№, РњРёРЅСЃРє
- **РћР±РЅРѕРІР»РµРЅС‹ API routes** `/kapi/admin/portfolio` (GET/POST) Рё `/kapi/admin/portfolio/[id]` (GET/PUT/DELETE):
  - РџРµСЂРµС…РѕРґ СЃ `@/lib/prisma` в†’ `@/lib/db`
  - РЈР±СЂР°РЅР° Р·Р°РІРёСЃРёРјРѕСЃС‚СЊ `zod` вЂ” СѓРїСЂРѕС‰С‘РЅРЅР°СЏ РѕР±СЂР°Р±РѕС‚РєР° РґР°РЅРЅС‹С…
  - GET-СЃРїРёСЃРѕРє СЃРѕСЂС‚РёСЂСѓРµС‚ РїРѕ `order asc, createdAt desc`
- **`PortfolioCaseForm.tsx`** вЂ” РїРѕР»РЅРѕСЃС‚СЊСЋ РїРµСЂРµСЃС‚СЂРѕРµРЅР° РїРѕРґ 4 РІРєР»Р°РґРєРё:
  - **РћСЃРЅРѕРІРЅРѕРµ**: РЅР°Р·РІР°РЅРёРµ, slug, РіРѕСЂРѕРґ/СЂРµРіРёРѕРЅ/РґР°С‚Р°, РїР»РѕС‰Р°РґСЊ/РїР»Р°РЅРёСЂРѕРІРєР°/СЃСЂРѕРє, С†РµРЅР°, СЃС‚РёР»СЊ, РјР°С‚РµСЂРёР°Р»С‹, СЃС†РµРЅР°СЂРёРё, РєСЂР°С‚РєРѕРµ РѕРїРёСЃР°РЅРёРµ, featured/published/order
  - **РСЃС‚РѕСЂРёСЏ РїСЂРѕРµРєС‚Р°**: Р·Р°РґР°С‡Р° РєР»РёРµРЅС‚Р°, РѕРіСЂР°РЅРёС‡РµРЅРёСЏ, СЂРµС€РµРЅРёРµ, СЂРµР·СѓР»СЊС‚Р°С‚ (СЃРІРѕР±РѕРґРЅС‹Р№ С‚РµРєСЃС‚)
  - **Р¤РѕС‚Рѕ**: РіР»Р°РІРЅРѕРµ С„РѕС‚Рѕ, РіР°Р»РµСЂРµСЏ, С„РѕС‚Рѕ РґРѕ/РїРѕСЃР»Рµ СЃ РїСЂРµРІСЊСЋ
  - **SEO**: live-РїСЂРµРІСЊСЋ РїРѕРёСЃРєР° Google, title/description/keywords СЃ СЃС‡С‘С‚С‡РёРєРѕРј СЃРёРјРІРѕР»РѕРІ
- **РЎРѕР·РґР°РЅР° СЃС‚СЂР°РЅРёС†Р°** `/admin/portfolio/[id]/page.tsx` вЂ” СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ СЃСѓС‰РµСЃС‚РІСѓСЋС‰РµРіРѕ РєРµР№СЃР°
- **РћР±РЅРѕРІР»С‘РЅ** `/admin/portfolio/page.tsx` вЂ” СЃРѕСЂС‚РёСЂРѕРІРєР° РїРѕ order+date, РєРЅРѕРїРєР° В«РќР° СЃР°Р№С‚РµВ» (РѕС‚РєСЂС‹РІР°РµС‚ РїСѓР±Р»РёС‡РЅСѓСЋ СЃС‚СЂР°РЅРёС†Сѓ)
- **РџРµСЂРµСЃС‚СЂРѕРµРЅ** `/portfolio/page.tsx` вЂ” Server Component (РїСЂСЏРјРѕР№ Р·Р°РїСЂРѕСЃ Prisma), РёСЃРїРѕР»СЊР·СѓРµС‚ `PortfolioFilters`
- **РЎРѕР·РґР°РЅ** `components/portfolio/PortfolioFilters.tsx` вЂ” РєР»РёРµРЅС‚СЃРєРёР№ РєРѕРјРїРѕРЅРµРЅС‚ С„РёР»СЊС‚СЂР°С†РёРё (СЃС‚РёР»СЊ / РїР»РѕС‰Р°РґСЊ / Р±СЋРґР¶РµС‚) Р±РµР· РїРµСЂРµР·Р°РіСЂСѓР·РєРё СЃС‚СЂР°РЅРёС†С‹
- **РџРµСЂРµСЃС‚СЂРѕРµРЅ** `/portfolio/[slug]/page.tsx` вЂ” РїРѕР»РЅС‹Р№ РєРµР№СЃ-СЃС‚Р°РґРё:
  - РџР»Р°С€РєРё СЃС‚РёР»СЏ/РїР»Р°РЅРёСЂРѕРІРєРё/featured
  - Specs strip (РіРѕСЂРѕРґ, РїР»РѕС‰Р°РґСЊ, РїР»Р°РЅРёСЂРѕРІРєР°, РјР°С‚РµСЂРёР°Р», СЃСЂРѕРє, РґР°С‚Р°)
  - Р¦РµРЅРѕРІРѕР№ Р±Р»РѕРє СЃ CTA в†’ РєР°Р»СЊРєСѓР»СЏС‚РѕСЂ
  - РСЃС‚РѕСЂРёСЏ: Р—Р°РґР°С‡Р° в†’ РћРіСЂР°РЅРёС‡РµРЅРёСЏ в†’ Р РµС€РµРЅРёРµ в†’ Р”Рѕ/РџРѕСЃР»Рµ в†’ Р РµР·СѓР»СЊС‚Р°С‚
  - РћС‚Р·С‹РІС‹ РєР»РёРµРЅС‚Р° (РµСЃР»Рё РїСЂРёРІСЏР·Р°РЅС‹ С‡РµСЂРµР· reviewIds)
  - Р’РЅСѓС‚СЂРµРЅРЅРёРµ СЃСЃС‹Р»РєРё: СЃС‚РёР»СЊ, РјР°С‚РµСЂРёР°Р»С‹, СЃС†РµРЅР°СЂРёРё вЂ” РёР· Р‘Р”
  - РџРѕС…РѕР¶РёРµ РїСЂРѕРµРєС‚С‹ (РґСЂСѓРіРёРµ РєРµР№СЃС‹, 3 С€С‚СѓРєРё)
  - Sticky sidebar: ContactForm + С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєРё + РЅР°РІРёРіР°С†РёСЏ
  - JSON-LD Article + BreadcrumbList + generateMetadata (seoTitle/seoDescription/seoKeywords)

### Changed
- API routes РїРѕСЂС‚С„РѕР»РёРѕ: РёР·Р±Р°РІРёР»РёСЃСЊ РѕС‚ `zod`, РїРµСЂРµС…РѕРґ РЅР° `@/lib/db`
- РџСѓР±Р»РёС‡РЅС‹Р№ СЃРїРёСЃРѕРє РїРѕСЂС‚С„РѕР»РёРѕ С‚РµРїРµСЂСЊ Server Component (SEO-friendly, РЅРµС‚ client fetch)

---

## [Unreleased] вЂ” 2026-04-05 (Р­С‚Р°Рї 3: StylePage + MaterialPage РєР°Рє SEO-РїРѕСЃР°РґРѕС‡РЅС‹Рµ)

### Added
- **Р Р°СЃС€РёСЂРµРЅР° Prisma-РјРѕРґРµР»СЊ `StylePage`** вЂ” РґРѕР±Р°РІР»РµРЅРѕ 12 РїРѕР»РµР№: `headline`, `intro`, `suitableFor[]`, `pros[]`, `cons[]`, `careGuide[]`, `pairsWith[]`, `budgetLevel`, `relatedMaterials[]`, `relatedCaseSlugs[]`, `relatedScenarioSlugs[]`, `seoKeywords`, `order`, `updatedAt`
- **Р Р°СЃС€РёСЂРµРЅР° Prisma-РјРѕРґРµР»СЊ `MaterialPage`** вЂ” РґРѕР±Р°РІР»РµРЅРѕ 12 РїРѕР»РµР№: `headline`, `intro`, `suitableFor[]`, `careGuide[]`, `budgetLevel`, `pricePer`, `relatedStyles[]`, `relatedCaseSlugs[]`, `relatedScenarioSlugs[]`, `seoKeywords`, `order`, `updatedAt`
- **5 СЃС‚РёР»РµР№ РїРѕСЃРµСЏРЅРѕ** СЃ Р±РѕРіР°С‚С‹Рј РєРѕРЅС‚РµРЅС‚РѕРј (suitableFor, pros, cons, careGuide, pairsWith, relatedMaterials, relatedScenarioSlugs, SEO):
  - `sovremennye` вЂ” РЎРѕРІСЂРµРјРµРЅРЅС‹Р№ (РЎСЂРµРґРЅРёР№, РѕС‚ 1 800 BYN)
  - `klassicheskie` вЂ” РљР»Р°СЃСЃРёС‡РµСЃРєРёР№ (РџСЂРµРјРёСѓРј, РѕС‚ 3 500 BYN)
  - `skandinavskie` вЂ” РЎРєР°РЅРґРёРЅР°РІСЃРєРёР№ (РЎСЂРµРґРЅРёР№, РѕС‚ 2 000 BYN)
  - `minimalizm` вЂ” РњРёРЅРёРјР°Р»РёР·Рј (РЎСЂРµРґРЅРёР№, РѕС‚ 2 200 BYN)
  - `loft` вЂ” Р›РѕС„С‚ (РЎСЂРµРґРЅРёР№, РѕС‚ 2 500 BYN)
- **5 РјР°С‚РµСЂРёР°Р»РѕРІ РїРѕСЃРµСЏРЅРѕ** СЃ Р±РѕРіР°С‚С‹Рј РєРѕРЅС‚РµРЅС‚РѕРј (pros, cons, suitableFor, careGuide, relatedStyles, relatedScenarioSlugs, SEO):
  - `mdf` вЂ” РњР”Р¤ СЃ РїР»С‘РЅРєРѕР№ РџР’РҐ (Р­РєРѕРЅРѕРјРЅС‹Р№, РѕС‚ 1 200 BYN)
  - `plastik` вЂ” HPL Рё Р°РєСЂРёР» (РЎСЂРµРґРЅРёР№, РѕС‚ 1 500 BYN)
  - `emal` вЂ” Р­РјР°Р»СЊ РјР°С‚РѕРІР°СЏ (Р’С‹С€Рµ СЃСЂРµРґРЅРµРіРѕ, РѕС‚ 2 200 BYN)
  - `shpon` вЂ” РќР°С‚СѓСЂР°Р»СЊРЅС‹Р№ С€РїРѕРЅ (РџСЂРµРјРёСѓРј, РѕС‚ 3 200 BYN)
  - `egger` вЂ” Р›Р”РЎРџ EGGER (Р­РєРѕРЅРѕРјРЅС‹Р№, РѕС‚ 900 BYN)
- **API routes РґР»СЏ СЃС‚РёР»РµР№**: `/kapi/admin/styles` (GET/POST) + `/kapi/admin/styles/[id]` (GET/PUT/DELETE)
- **API routes РґР»СЏ РјР°С‚РµСЂРёР°Р»РѕРІ**: `/kapi/admin/materials` (GET/POST) + `/kapi/admin/materials/[id]` (GET/PUT/DELETE)
- **StyleForm** (`components/admin/StyleForm.tsx`) вЂ” 4-РІРєР»Р°РґРѕС‡РЅР°СЏ С„РѕСЂРјР°: РћСЃРЅРѕРІРЅРѕРµ / РљРѕРЅС‚РµРЅС‚ / РЎРІСЏР·Рё / SEO
- **MaterialForm** (`components/admin/MaterialForm.tsx`) вЂ” 4-РІРєР»Р°РґРѕС‡РЅР°СЏ С„РѕСЂРјР°: РћСЃРЅРѕРІРЅРѕРµ / РљРѕРЅС‚РµРЅС‚ / РЎРІСЏР·Рё / SEO
- **Admin СЃС‚СЂР°РЅРёС†С‹ РґР»СЏ СЃС‚РёР»РµР№**: `/admin/styles`, `/admin/styles/new`, `/admin/styles/[id]`
- **Admin СЃС‚СЂР°РЅРёС†С‹ РґР»СЏ РјР°С‚РµСЂРёР°Р»РѕРІ**: `/admin/materials`, `/admin/materials/new`, `/admin/materials/[id]`
- **РџРµСЂРµСЃС‚СЂРѕРµРЅ `/styles/page.tsx`** вЂ” РєР°СЂС‚РѕС‡РєРё СЃ Р±СЋРґР¶РµС‚РЅС‹Рј СѓСЂРѕРІРЅРµРј, РїРµСЂРІС‹Р№ РїР»СЋСЃ, step-Р±Р»РѕРє В«РљР°Рє РїРѕР»СѓС‡РёС‚СЊ РєРѕРЅСЃСѓР»СЊС‚Р°С†РёСЋВ», ContactForm РІРЅРёР·Сѓ, JSON-LD ItemList
- **РџРµСЂРµСЃС‚СЂРѕРµРЅ `/styles/[slug]/page.tsx`** вЂ” H1 + intro + РїР»Р°С€РєР° Р±СЋРґР¶РµС‚Р° + С†РµРЅР° СЃ РєРЅРѕРїРєРѕР№ в†’ РєР°Р»СЊРєСѓР»СЏС‚РѕСЂ + Р±Р»РѕРє В«РљРѕРјСѓ РїРѕРґС…РѕРґРёС‚В» + В«РџР»СЋСЃС‹ Рё РјРёРЅСѓСЃС‹В» + В«РЎРѕРІРµС‚С‹ РїРѕ СѓС…РѕРґСѓВ» + В«РЎРѕС‡РµС‚Р°РµС‚СЃСЏ СЃВ» + В«Р РµРєРѕРјРµРЅРґСѓРµРјС‹Рµ РјР°С‚РµСЂРёР°Р»С‹В» + В«РџРѕРґС…РѕРґСЏС‰РёРµ СЃС†РµРЅР°СЂРёРёВ» + sticky sidebar СЃ FormContact + Р±С‹СЃС‚СЂС‹Рµ С„Р°РєС‚С‹ + РЅР°РІРёРіР°С†РёСЏ РїРѕ СЃС‚РёР»СЏРј. JSON-LD Article + BreadcrumbList
- **РџРµСЂРµСЃС‚СЂРѕРµРЅ `/materials/page.tsx`** вЂ” С‚Р°Р±Р»РёС†Р° СЃСЂР°РІРЅРµРЅРёСЏ (РїР»СЋСЃ/РјРёРЅСѓСЃ РїРµСЂРІС‹Р№, С†РµРЅР°, Р±СЋРґР¶РµС‚) + РєР°СЂС‚РѕС‡РєРё СЃ pros/cons, ContactForm РІРЅРёР·Сѓ, JSON-LD ItemList
- **РџРµСЂРµСЃС‚СЂРѕРµРЅ `/materials/[slug]/page.tsx`** вЂ” РїРѕР»РЅРѕС†РµРЅРЅР°СЏ SEO-РїРѕСЃР°РґРѕС‡РЅР°СЏ: headline + intro + С†РµРЅР° в†’ РєР°Р»СЊРєСѓР»СЏС‚РѕСЂ + В«РџР»СЋСЃС‹ Рё РјРёРЅСѓСЃС‹В» + В«РљРѕРјСѓ РїРѕРґС…РѕРґРёС‚В» + В«РЈС…РѕРґВ» + В«РџРѕРґС…РѕРґСЏС‰РёРµ СЃС‚РёР»РёВ» + В«РЎС†РµРЅР°СЂРёРё РёСЃРїРѕР»СЊР·РѕРІР°РЅРёСЏВ» + sticky sidebar + РЅР°РІРёРіР°С†РёСЏ РїРѕ РјР°С‚РµСЂРёР°Р»Р°Рј. JSON-LD Article + BreadcrumbList
- **Р’РЅСѓС‚СЂРµРЅРЅСЏСЏ РїРµСЂРµР»РёРЅРєРѕРІРєР°**: СЃС‚РёР»Рёв†”РјР°С‚РµСЂРёР°Р»С‹, СЃС‚РёР»Рёв†”СЃС†РµРЅР°СЂРёРё, РјР°С‚РµСЂРёР°Р»С‹в†”СЃС‚РёР»Рё, РјР°С‚РµСЂРёР°Р»С‹в†”СЃС†РµРЅР°СЂРёРё вЂ” РІСЃРµ РёР· Р‘Р”
- **AdminSidebar** вЂ” РґРѕР±Р°РІР»РµРЅС‹ В«РЎС‚РёР»Рё РєСѓС…РѕРЅСЊВ» (Palette) Рё В«РњР°С‚РµСЂРёР°Р»С‹В» (Layers) РІ СЂР°Р·РґРµР» РЎС‚СЂСѓРєС‚СѓСЂР°

### Changed
- 16 С„Р°Р№Р»РѕРІ РёР·РјРµРЅРµРЅРѕ/СЃРѕР·РґР°РЅРѕ РІ СЌС‚РѕРј СЌС‚Р°РїРµ

## [Unreleased] вЂ” 2026-04-05 (ScenarioPage system)

### Added
- **Prisma model `ScenarioPage`** вЂ” 20+ fields: slug, icon, badge, title, headline, intro, needs[], solutions[], features (JSON), tips[], relatedStyles[], relatedMaterials[], relatedCaseSlugs[], SEO fields (seoTitle, seoDescription, seoKeywords), ctaText, ctaHref, order, published, timestamps
- **6 unique scenarios seeded** with full content (not clones):
  - `semya-s-detmi` вЂ” РљСѓС…РЅСЏ РґР»СЏ СЃРµРјСЊРё СЃ РґРµС‚СЊРјРё (badge: РџРѕРїСѓР»СЏСЂРЅС‹Р№)
  - `malenkaya-kukhnya` вЂ” РњР°Р»РµРЅСЊРєР°СЏ РєСѓС…РЅСЏ 5вЂ“8 РјВІ (badge: Р—Р°РїСЂРѕСЃ в„–1)
  - `kukhnya-gostinaya` вЂ” РљСѓС…РЅСЏ-РіРѕСЃС‚РёРЅР°СЏ (РѕС‚РєСЂС‹С‚РѕРµ РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІРѕ)
  - `lyublyu-gotovit` вЂ” РљСѓС…РЅСЏ РґР»СЏ С‚РµС…, РєС‚Рѕ Р»СЋР±РёС‚ РіРѕС‚РѕРІРёС‚СЊ (badge: Р”Р»СЏ РіСѓСЂРјР°РЅР°)
  - `bez-pereplaty` вЂ” РљСѓС…РЅСЏ Р±РµР· РїРµСЂРµРїР»Р°С‚С‹ (badge: Р’С‹РіРѕРґРЅРѕ)
  - `maksimum-khraneniya` вЂ” РҐРѕС‡Сѓ РјР°РєСЃРёРјСѓРј С…СЂР°РЅРµРЅРёСЏ
- **API routes** вЂ” `/kapi/admin/scenarios` (GET/POST) + `/kapi/admin/scenarios/[id]` (GET/PUT/DELETE)
- **Admin pages**:
  - `/admin/scenarios` вЂ” СЃРїРёСЃРѕРє СЃ С‚Р°Р±Р»РёС†РµР№ (СЌРјРѕРґР·Рё, badge, URL, СЃРІСЏР·Рё, СЃС‚Р°С‚СѓСЃ)
  - `/admin/scenarios/new` вЂ” СЃРѕР·РґР°РЅРёРµ СЃС†РµРЅР°СЂРёСЏ
  - `/admin/scenarios/[id]` вЂ” СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ СЃ 4 РІРєР»Р°РґРєР°РјРё
- **ScenarioForm component** (`components/admin/ScenarioForm.tsx`) вЂ” 4-РІРєР»Р°РґРѕС‡РЅР°СЏ С„РѕСЂРјР°:
  - Р’РєР»Р°РґРєР° В«РћСЃРЅРѕРІРЅРѕРµВ»: slug, icon, badge, title, headline, intro, CTA, РїРѕСЂСЏРґРѕРє
  - Р’РєР»Р°РґРєР° В«РљРѕРЅС‚РµРЅС‚В»: РїРѕС‚СЂРµР±РЅРѕСЃС‚Рё (needs), СЂРµС€РµРЅРёСЏ (solutions), РѕСЃРѕР±РµРЅРЅРѕСЃС‚Рё (features), СЃРѕРІРµС‚С‹ (tips) вЂ” РІСЃРµ РґРёРЅР°РјРёС‡РµСЃРєРёРµ СЃРїРёСЃРєРё СЃ +/в€’
  - Р’РєР»Р°РґРєР° В«РЎРІСЏР·РёВ»: relatedStyles[], relatedMaterials[], relatedCaseSlugs[]
  - Р’РєР»Р°РґРєР° В«SEOВ»: seoTitle, seoDescription, seoKeywords + РїСЂРµРІСЊСЋ РІ РїРѕРёСЃРєРµ
- **РџСѓР±Р»РёС‡РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹**:
  - `/scenarios` вЂ” index СЃ 6 РєР°СЂС‚РѕС‡РєР°РјРё, JSON-LD ItemList, breadcrumb
  - `/scenarios/[slug]` вЂ” РїРѕР»РЅРѕС†РµРЅРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° (hero + needs/solutions + features + related cases/styles/materials + tips + other scenarios + ContactForm), JSON-LD Article + BreadcrumbList
- **AdminSidebar** вЂ” РґРѕР±Р°РІР»РµРЅ РїСѓРЅРєС‚ В«РЎС†РµРЅР°СЂРёРё РІС‹Р±РѕСЂР°В» СЃ РёРєРѕРЅРєРѕР№ Route

## [Unreleased] вЂ” 2026-04-05

### Added
- **HomepageBlock system** вЂ” Prisma model + 21 DB-seeded blocks (5 scenarios, 6 steps, 6 advantages, 4 trust items)
- **Admin: Р“Р»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р°** (`/admin/homepage`) вЂ” full CRUD, publish/hide toggle, filter by type, stats
- **API routes** вЂ” `/kapi/admin/homepage` (GET/POST) + `/kapi/admin/homepage/[id]` (PUT/DELETE)
- **New homepage** (`app/page.tsx`) вЂ” fully DB-driven with SSR fallbacks, JSON-LD, all-Belarus positioning
  - Hero: deep purple gradient, animated trust badges
  - "РЎ С‡РµРіРѕ С…РѕС‚РёС‚Рµ РЅР°С‡Р°С‚СЊ?" вЂ” 5 scenario cards from DB
  - Trust stats strip (4 counters from DB)
  - Portfolio preview (3 most recent cases)
  - Catalog (7 kitchens or 6 static category cards)
  - "РљР°Рє РїСЂРѕС…РѕРґРёС‚ Р·Р°РєР°Р·" вЂ” 6 steps from DB on dark background
  - "РџРѕС‡РµРјСѓ РІС‹Р±РёСЂР°СЋС‚ РЅР°СЃ" вЂ” 6 advantage cards from DB
  - Guarantees section (Shield, Clock, FileCheck, MapPin)
  - Reviews grid (4 most recent PUBLISHED reviews)
  - FAQ section
  - CTA banner + ContactForm
- **AdminSidebar** вЂ” "Р“Р»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р°" link (Home icon) added to РЎС‚СЂСѓРєС‚СѓСЂР° group

### Fixed
- `ReviewStatus.APPROVED` в†’ `ReviewStatus.PUBLISHED` in `/locations/[city]/page.tsx` (bug: reviews never showed on city pages)
- Catalog meta title: "РІ РњРёРЅСЃРєРµ" в†’ "РїРѕ Р‘РµР»Р°СЂСѓСЃРё"
- Reviews meta title: "РІ РњРёРЅСЃРєРµ" в†’ "РїРѕ РІСЃРµР№ Р‘РµР»Р°СЂСѓСЃРё"
- Portfolio meta description: РњРёРЅСЃРє в†’ РІСЃСЏ Р‘РµР»Р°СЂСѓСЃСЊ

---

## 2026-04-04

### Added
- **LocationPage system** вЂ” 15+ Prisma fields, CRUD admin (5-tab LocationForm), public `/locations/[city]` pages
- Prisma schema extended: `HomepageBlock` model added
- 3 LocationPages seeded: РњРёРЅСЃРє, РњРёРЅСЃРєР°СЏ РѕР±Р»Р°СЃС‚СЊ, Р‘РѕСЂРёСЃРѕРІ
- JSON-LD on location pages: LocalBusiness + FAQPage + BreadcrumbList

### Fixed
- ReviewStatus enum вЂ” standardised to PUBLISHED across all pages

---

## Earlier milestones

- Telegram webhook for leads в†’ `/kapi/leads`
- KitchenForm with city prop and honeypot
- Dynamic Header/Footer from DB (SiteSettings)
- Admin roles: SUPER_ADMIN, MANAGER, GUEST
- Guest temporary access with token + expiry
- Review moderation (NEW в†’ PENDING в†’ PUBLISHED / REJECTED)
- Activity log for admin actions
- SEO: sitemap.xml, robots.txt, JSON-LD, BreadcrumbList
- All public pages: catalog, portfolio, reviews, blog, prices, contacts, warranty, etc.
## [Unreleased] - 2026-04-20 (Kitchen selection quiz removal)

### Changed
- Public navigation now keeps only the visual configurator and calculator flows; the legacy kitchen selection quiz is no longer linked from the site or admin sidebar.
- Personalization and sitemap cleanup removed stale quiz-specific state and URLs.

### Removed
- Legacy quiz pages: `/configure` and `/configure/result`.
- Legacy quiz admin surfaces, API routes, saved-config endpoints, and supporting React components.
- Residual admin references to the removed quiz in FAQ page options and lead source labels.
