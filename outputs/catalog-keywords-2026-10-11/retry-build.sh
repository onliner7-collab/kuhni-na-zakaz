#!/usr/bin/env bash
set -euo pipefail
target=$1
[[ "$target" =~ ^[a-f0-9]{40}$ ]]
repo=/var/www/kuhni-na-zakaz
app=$repo/artifacts/kuhni-na-zakaz
test "$(git -C "$repo" rev-parse HEAD)" = "$target"
test -z "$(git -C "$repo" status --porcelain --untracked-files=no)"
cp "$app/next.config.ts" "/tmp/keywords-retry-$target-next.config.ts"
cp "$app/tsconfig.json" "/tmp/keywords-retry-$target-tsconfig.json"
trap 'cp "/tmp/keywords-retry-$target-next.config.ts" "$app/next.config.ts"; cp "/tmp/keywords-retry-$target-tsconfig.json" "$app/tsconfig.json"; chown kuhni:kuhni "$app/next.config.ts" "$app/tsconfig.json"' EXIT
sudo -u kuhni node -e 'const fs=require("fs");const p="/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/next.config.ts";const s=fs.readFileSync(p,"utf8");if(!s.includes("experimental: {"))throw Error("No experimental config");fs.writeFileSync(p,s.replace("experimental: {","experimental: {\n    cpus: 1,\n    webpackMemoryOptimizations: true,"))'
sudo -u kuhni bash -c "cd '$app' && NODE_OPTIONS=--max-old-space-size=1400 NEXT_DIST_DIR=.next-gallery-$target pnpm exec next build"
test -s "$app/.next-gallery-$target/BUILD_ID"
echo 'Keyword build ready; previous runtime remains active'
