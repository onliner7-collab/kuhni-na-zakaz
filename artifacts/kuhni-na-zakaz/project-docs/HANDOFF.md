# Handoff — КухниBY

## Project overview

**КухниBY** — production-ready commercial kitchen sales website for Belarus.  
Stack: **Next.js 15.3.3 App Router** + PostgreSQL + Prisma + Tailwind + Sonner.

---

## Key access

| What | Value |
|---|---|
| Admin URL | `/admin/login` |
| Admin email | `admin@kuhniminsk.by` |
| Admin password | `Admin123!` |
| Git remote | `origin` = `onliner7-collab/kuhni-na-zakaz.git` |
| Git branch | `work` |

---

## Architecture notes

### Routing
- Express (api-server artifact) intercepts all `/api/*` routes
- **Next.js internal API routes MUST use `/kapi/` prefix** to avoid Express conflict
- Public site at `/`, admin at `/admin/*`

### Auth
- JWT stored in `session` cookie (HttpOnly, Secure)
- Roles: `SUPER_ADMIN`, `MANAGER`, `GUEST`
- Guest access: timed token with whitelisted sections, stored in `GuestAccess` table
- Middleware: `middleware.ts` protects `/admin/*`

### Design tokens
- Primary: `hsl(263, 85%, 62%)` (violet)
- Font: Manrope 800 for headings
- Hero gradient: `linear-gradient(135deg, #1a0533, #2d1060, #0f1a3d)`
- Dark steps section: `linear-gradient(160deg, #0f0f1a, #1a1030, #0c1a30)`

### ReviewStatus enum
`NEW → PENDING → PUBLISHED | REJECTED | DELETED`  
⚠️ Always use `ReviewStatus.PUBLISHED` — **NOT** `ReviewStatus.APPROVED` (doesn't exist)

---

## Database models

| Model | Purpose |
|---|---|
| `Kitchen` | Catalog items |
| `PortfolioCase` | Completed project gallery |
| `Review` | Customer reviews with status moderation |
| `BlogPost` | Articles |
| `PriceRow` | Price table entries |
| `FAQItem` | FAQ items (page-scoped) |
| `LocationPage` | City/region SEO pages |
| `HomepageBlock` | Homepage editable blocks (scenario/step/advantage/trust) |
| `ScenarioPage` | Scenario pages with needs, solutions, features, tips, related entities |
| `SiteSettings` | Global settings: phone, email, address, socials (id=1) |
| `Lead` | Form submissions |
| `User` | Admin users |
| `GuestAccess` | Temporary admin tokens |
| `ActivityLog` | Admin action audit trail |

---

## Admin pages

| URL | Purpose |
|---|---|
| `/admin/dashboard` | Stats + recent activity |
| `/admin/homepage` | Edit HomepageBlocks |
| `/admin/kitchens` | Kitchen catalog CRUD |
| `/admin/portfolio` | Portfolio cases CRUD |
| `/admin/reviews` | Review moderation |
| `/admin/blog` | Blog posts CRUD |
| `/admin/prices` | Price table CRUD |
| `/admin/locations` | City SEO pages CRUD |
| `/admin/leads` | View form submissions |
| `/admin/contacts` | Edit SiteSettings (phone, address, socials) |
| `/admin/notifications` | Telegram webhook config |
| `/admin/settings` | Site-wide settings |
| `/admin/users` | User management (SUPER_ADMIN only) |
| `/admin/guest-access` | Temp access tokens |
| `/admin/activity-log` | Audit trail |

---

## Pending / Next tasks

1. **Contacts page** (`/contacts`) — currently static; should read `SiteSettings` from DB for phone/address/hours
2. **Images** — upload system via object storage or S3; currently only URL fields in DB
3. **Blog** — blog listing + article pages exist but content needs to be seeded
4. **Prices page** — `/prices` reads from `PriceRow` but needs seeded data
5. **Styles page** — currently static mockup, no DB model yet
6. **Regional pages** — expand LocationPages beyond Минск/Область/Борисов to all 6 oblasts
7. **Email notifications** — currently only Telegram; consider adding email for leads
8. **Production deployment** — run `npx prisma migrate deploy` in production, set `SESSION_SECRET` env var

---

## Environment variables required

| Variable | Where |
|---|---|
| `DATABASE_URL` | Replit secret (auto-set) |
| `SESSION_SECRET` | Replit secret — must be set for JWT signing |
| `TELEGRAM_BOT_TOKEN` | Set in admin `/admin/notifications` (stored in SiteSettings) |
| `TELEGRAM_CHAT_ID` | Set in admin `/admin/notifications` (stored in SiteSettings) |
