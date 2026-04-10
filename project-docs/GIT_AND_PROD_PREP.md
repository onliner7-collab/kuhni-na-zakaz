# Git And Production Prep

## Goal

Prepare the repository for:

- first clean push to Git
- predictable deployment to a Linux server
- future content, code, and SEO updates without chaos

## Current repository rules

- Production app lives in `artifacts/kuhni-na-zakaz`
- Local-only files must never be committed:
  - `.local-postgres/`
  - `.claude/`
  - runtime log files
  - any `.env`

## Git strategy

- `main` - production branch
- `dev` - integration branch
- feature branches - short-lived work branches

Recommended flow:

1. Work in `dev` or a feature branch.
2. Verify local app behavior manually.
3. Merge into `main` only after deployment-ready verification.

## Production structure

- App process: Next.js app from `artifacts/kuhni-na-zakaz`
- Reverse proxy: nginx
- Process manager: systemd
- Database: PostgreSQL
- Secrets: server-side `.env`, never in Git

## Required production environment variables

- `DATABASE_URL`
- `SESSION_SECRET`
- `NEXT_PUBLIC_SITE_URL`

Optional but recommended:

- `EMAIL_SMTP_HOST`
- `EMAIL_SMTP_PORT`
- `EMAIL_SMTP_SECURE`
- `EMAIL_SMTP_USER`
- `EMAIL_SMTP_PASS`

## Deployment baseline

Server deploy sequence:

1. Clone repository.
2. Install Node.js and pnpm.
3. Copy `.env.example` to `.env` and fill secrets.
4. Run `pnpm install`.
5. Run `pnpm exec prisma db push`.
6. Run seed scripts if initial content is needed.
7. Run `pnpm run build`.
8. Run `pnpm run start` behind nginx/systemd.

## Next steps

- prepare Timeweb VPS deployment guide with Ubuntu commands
- add SSL and domain configuration
- add backup and restore instructions
- add release/update checklist

## Timeweb baseline

Assumption for the first production deploy:

- target platform is a Linux VPS in Timeweb
- app runs as a Node.js process behind nginx
- PostgreSQL is either on the same VPS or on a managed external host

Templates in `deploy/` are now aligned to Linux paths and can be used as a starting point for that setup.
