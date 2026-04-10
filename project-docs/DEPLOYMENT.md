# Deployment

## Current production model

- application: Next.js app in `artifacts/kuhni-na-zakaz`
- runtime: Node.js 22 + pnpm
- database: PostgreSQL
- process manager: `systemd`
- reverse proxy: `nginx`
- target server: Timeweb VPS with Linux

## Local development

From the repository root:

```bash
pnpm install
cd artifacts/kuhni-na-zakaz
pnpm run dev
```

By default the app starts on port `3001`.

To override the port:

```bash
PORT=3010 pnpm run dev
```

On Windows PowerShell:

```powershell
$env:PORT='3010'
pnpm run dev
```

## Required environment

Create `artifacts/kuhni-na-zakaz/.env` from `artifacts/kuhni-na-zakaz/.env.example`.

Minimum required variables:

```env
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/kuhni_production
SESSION_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_SITE_URL=https://example.com
```

Optional mail variables:

```env
EMAIL_SMTP_HOST=
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_SMTP_USER=
EMAIL_SMTP_PASS=
```

## Build and run

From `artifacts/kuhni-na-zakaz`:

```bash
pnpm run build
pnpm run start
```

The start command respects:

- `PORT`
- `HOST`

## First server deploy

1. Clone the repository to the server.
2. Create the production `.env`.
3. Run `pnpm install` in the repository root.
4. Run `pnpm exec prisma db push` in `artifacts/kuhni-na-zakaz`.
5. Run seed scripts only if the database is empty and seed content is approved for production.
6. Run `pnpm run build`.
7. Install the `systemd` service from `deploy/systemd/kuhni-na-zakaz.service`.
8. Install the nginx config from `deploy/nginx/kuhni-na-zakaz.conf`.
9. Configure HTTPS with Let's Encrypt.

## Supporting templates

- `deploy/nginx/kuhni-na-zakaz.conf`
- `deploy/systemd/kuhni-na-zakaz.service`
- `deploy/timeweb/README.md`
- `project-docs/RELEASE_CHECKLIST.md`
