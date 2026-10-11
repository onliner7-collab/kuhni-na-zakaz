#!/usr/bin/env bash
set -euo pipefail
target=$1
[[ "$target" =~ ^[a-f0-9]{40}$ ]]
repo=/var/www/kuhni-na-zakaz
app=$repo/artifacts/kuhni-na-zakaz
test "$(git -C "$repo" rev-parse HEAD)" = "576fa18f0f8c2489dc1b525e3968129d7667435d"
test -z "$(git -C "$repo" status --porcelain --untracked-files=no)"
sudo -u kuhni git -C "$repo" fetch origin codex/catalog-deploy-20261011
sudo -u kuhni git -C "$repo" merge --ff-only "$target"
test "$(git -C "$repo" rev-parse HEAD)" = "$target"
cp "$app/next.config.ts" "/tmp/gallery-$target-next.config.ts"
cp "$app/tsconfig.json" "/tmp/gallery-$target-tsconfig.json"
trap 'cp "/tmp/gallery-$target-next.config.ts" "$app/next.config.ts"; cp "/tmp/gallery-$target-tsconfig.json" "$app/tsconfig.json"; chown kuhni:kuhni "$app/next.config.ts" "$app/tsconfig.json"' EXIT
sudo -u kuhni node -e 'const fs=require("fs");const p="/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/next.config.ts";const s=fs.readFileSync(p,"utf8");if(!s.includes("experimental: {"))throw Error("No experimental config");fs.writeFileSync(p,s.replace("experimental: {","experimental: {\n    cpus: 1,\n    webpackMemoryOptimizations: true,"))'
sudo -u kuhni bash -c "cd '$app' && NODE_OPTIONS=--max-old-space-size=1100 NEXT_DIST_DIR=.next-gallery-$target pnpm exec next build"
test -s "$app/.next-gallery-$target/BUILD_ID"
echo 'Gallery build ready; previous runtime remains active'
