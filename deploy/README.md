# Production Deployment Assets

This folder contains baseline production assets for the `@workspace/kuhni-na-zakaz` app.

Included:

- `nginx/kuhni-na-zakaz.conf` - reverse proxy template
- `systemd/kuhni-na-zakaz.service` - app service template
- `timeweb/README.md` - first-pass deployment notes for a Timeweb VPS

Before using them:

1. Replace `__APP_DIR__`, `__APP_USER__`, `__DOMAIN__`, and `__PORT__`.
2. Create a real `.env` on the server from `artifacts/kuhni-na-zakaz/.env.example`.
3. Run the app build and start commands from `artifacts/kuhni-na-zakaz`.
4. If the server is on Timeweb VPS, follow `timeweb/README.md` as the baseline.
