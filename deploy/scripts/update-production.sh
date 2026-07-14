#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/kuhni-na-zakaz"
APP_RUNTIME_DIR="$APP_DIR/artifacts/kuhni-na-zakaz"
BRANCH="${1:-work}"

echo "[deploy] updating repo"
sudo -u kuhni git -C "$APP_DIR" fetch origin
sudo -u kuhni git -C "$APP_DIR" checkout "$BRANCH"
sudo -u kuhni git -C "$APP_DIR" pull --ff-only origin "$BRANCH"

echo "[deploy] installing dependencies"
sudo -u kuhni bash -lc "cd '$APP_DIR' && pnpm install --frozen-lockfile"

echo "[deploy] applying prisma changes"
sudo -u kuhni bash -lc "cd '$APP_RUNTIME_DIR' && pnpm exec prisma generate && pnpm run db:push"

if [[ "${RUN_CONTENT_IMPORTS:-0}" == "1" ]]; then
  echo "[deploy] importing prepared kitchen photos as an explicit migration"
  sudo -u kuhni bash -lc "cd '$APP_RUNTIME_DIR' && pnpm run photos:import-prepared"

  echo "[deploy] importing portfolio project folders (manifest + images)"
  sudo -u kuhni bash -lc "cd '$APP_RUNTIME_DIR' && pnpm run photos:import-portfolio-folders"
else
  echo "[deploy] content imports skipped (set RUN_CONTENT_IMPORTS=1 only for an approved migration)"
fi

echo "[deploy] writing static sitemap fallback"
sudo -u kuhni bash -lc "cd '$APP_RUNTIME_DIR' && pnpm run sitemap:write-static"

echo "[deploy] synchronizing public contact NAP"
sudo -u kuhni bash -lc "cd '$APP_RUNTIME_DIR' && pnpm exec tsx scripts/sync-contact-nap.ts"

echo "[deploy] building app"
sudo -u kuhni bash -lc "cd '$APP_RUNTIME_DIR' && pnpm run build"

echo "[deploy] restarting service"
systemctl restart kuhni-na-zakaz
systemctl status --no-pager kuhni-na-zakaz | head -n 20
