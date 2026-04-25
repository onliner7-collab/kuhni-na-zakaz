# Production Deployment Assets

This folder contains production deployment assets for the `@workspace/kuhni-na-zakaz` app.

Included:

- `nginx/kuhni-na-zakaz.conf` - reverse proxy template
- `systemd/kuhni-na-zakaz.service` - app service template
- `timeweb/README.md` - first-pass deployment notes for a Timeweb VPS

Active production target:

- Public site: `https://kuhni.minsk.by`
- Host: `5.42.108.140`
- Hostname: `msk-1-vm-7shr`
- SSH user: `root`
- Preferred auth on this workstation: `C:\Users\User\.ssh\timeweb_kuhni_ed25519`
- Repo root: `/var/www/kuhni-na-zakaz`
- App root: `/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz`
- Service: `kuhni-na-zakaz`
- Deploy branch: `work`

Before using them:

1. Replace `__APP_DIR__`, `__APP_USER__`, `__DOMAIN__`, and `__PORT__`.
2. Create a real production env file at `/etc/kuhni-na-zakaz.env` from `artifacts/kuhni-na-zakaz/.env.example`.
3. Symlink `/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/.env` to `/etc/kuhni-na-zakaz.env` for build and Prisma commands.
4. Set env file permissions to `640` with owner `root` and group `kuhni`.
5. Run the app build and start commands from `artifacts/kuhni-na-zakaz`.
6. If the server is on Timeweb VPS, follow `timeweb/README.md` for the live production workflow.
