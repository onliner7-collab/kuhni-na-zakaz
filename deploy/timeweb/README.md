# Timeweb VPS Deployment Baseline

This guide is the baseline for the first production deploy to a Timeweb VPS with Ubuntu.

## Active production instance

- Public site: `https://kuhni.minsk.by`
- Host: `5.42.108.140`
- Hostname: `msk-1-vm-7shr`
- SSH user: `root`
- Preferred auth on this workstation: `C:\Users\User\.ssh\timeweb_kuhni_ed25519`
- Repo root: `/var/www/kuhni-na-zakaz`
- App service user: `kuhni`
- App root inside repo: `/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz`
- systemd service: `kuhni-na-zakaz`
- Active deploy branch: `work`

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

## Current production update workflow

1. Push the required commit to `origin/work`.
2. SSH to the server:
   - `ssh -i C:\Users\User\.ssh\timeweb_kuhni_ed25519 root@5.42.108.140`
3. Run the update script:
   - `bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work`
4. If assets, Prisma client, or the Next build are stale, rebuild manually:
   - `sudo -u kuhni bash -lc "cd /var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz && pnpm exec prisma generate && pnpm run build"`
5. Restart the service:
   - `systemctl restart kuhni-na-zakaz`
6. Verify:
   - `curl -I https://kuhni.minsk.by/uploads/styles/style-modern.png`
   - open `https://kuhni.minsk.by/styles`

## 2026-04-21 styles asset incident

- Production HTML already referenced local style image paths under `/uploads/styles/...`.
- The runtime returned `404` because `public/uploads/styles` was missing from the deployed runtime and the service had not been restarted after the asset update.
- Recovery path that worked:
  - deploy commit `7b4a4fd`
  - confirm `public/uploads/styles` exists in `/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/public/uploads/styles`
  - run `pnpm exec prisma generate && pnpm run build`
  - run `systemctl restart kuhni-na-zakaz`
  - verify direct asset URLs return `200`

## DNS and SSL timing (root + www)

If `www.__DOMAIN__` resolves earlier than `__DOMAIN__`, wait until both domains resolve to the same VPS IP before issuing a shared certificate.

Quick checks:

- `dig +short __DOMAIN__`
- `dig +short www.__DOMAIN__`

When both return the VPS IP, issue one certificate for both names:

- `sudo certbot --nginx --cert-name __DOMAIN__ -d __DOMAIN__ -d www.__DOMAIN__`

The nginx template in `deploy/nginx/kuhni-na-zakaz.conf` already keeps `www` as a redirect to the canonical root domain.
