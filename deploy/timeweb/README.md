# Timeweb VPS Deployment Baseline

This guide is the baseline for the first production deploy to a Timeweb VPS with Ubuntu.

## Assumptions

- Ubuntu 22.04 or newer
- SSH access with sudo
- domain already points to the VPS IP
- Node.js 22 and pnpm will be installed on the server
- nginx will terminate HTTPS and proxy to the Next.js app

## Suggested server layout

- app directory: `/var/www/kuhni-na-zakaz`
- app service user: `kuhni`
- app port: `3001`
- app root inside repo: `/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz`

## First deploy outline

1. Install system packages: `git`, `curl`, `nginx`, `postgresql` if local DB is needed.
2. Install Node.js 22 and `pnpm`.
3. Clone the repository into `/var/www/kuhni-na-zakaz`.
4. Copy `artifacts/kuhni-na-zakaz/.env.example` to `artifacts/kuhni-na-zakaz/.env`.
5. Fill in `DATABASE_URL`, `SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
6. Run `pnpm install` in the repository root.
7. Run `pnpm run build` inside `artifacts/kuhni-na-zakaz`.
8. Run `pnpm exec prisma db push` inside `artifacts/kuhni-na-zakaz`.
9. Run seed scripts only if the production database is empty and test content is desired.
10. Install the `systemd` service from `deploy/systemd/kuhni-na-zakaz.service`.
11. Install the nginx config from `deploy/nginx/kuhni-na-zakaz.conf`.
12. Issue SSL certificates with `certbot` after nginx is serving the domain.

## Notes

- `pnpm run start` now respects `PORT` and `HOST`, so the same app scripts work on Windows and Linux.
- Keep the production `.env` only on the server.
- Do not run local demo seeds on production unless we explicitly decide which content is safe to publish.
- After the first deploy you can automate updates with `deploy/scripts/update-production.sh`.
