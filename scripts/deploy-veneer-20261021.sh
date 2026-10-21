#!/usr/bin/env bash
set -euo pipefail
target=$1
base=d27492037e0986d8e4bd8d8fac21d5b4ee7ae6b6
[[ "$target" =~ ^[a-f0-9]{40}$ ]]
repo=/var/www/kuhni-na-zakaz
app=$repo/artifacts/kuhni-na-zakaz
release=$app/.next-veneer-$target
backup=$app/.next-before-veneer-$target
config_backup=/var/tmp/veneer-$target-next.config.ts
tsconfig_backup=/var/tmp/veneer-$target-tsconfig.json
sitemap_backup=/var/tmp/veneer-$target-sitemap.xml
swap=/var/tmp/veneer-$target-build.swap
activated=0
swapped=0
test "$(git -C "$repo" rev-parse HEAD)" = "$base"
test -z "$(git -C "$repo" status --porcelain --untracked-files=no)"
test ! -e "$release"
test ! -e "$backup"
test ! -e "$swap"
git -C "$repo" fetch origin codex/veneer-20261021
test "$(git -C "$repo" rev-parse FETCH_HEAD)" = "$target"
git -C "$repo" switch --detach "$target"
cp "$app/next.config.ts" "$config_backup"
cp "$app/tsconfig.json" "$tsconfig_backup"
cp "$app/public/sitemap-static.xml" "$sitemap_backup"
restore_config() {
 cp "$config_backup" "$app/next.config.ts"
 cp "$tsconfig_backup" "$app/tsconfig.json"
 chown kuhni:kuhni "$app/next.config.ts" "$app/tsconfig.json"
}
cleanup() {
 local result=$?
 restore_config
 if swapon --show=NAME --noheadings | grep -Fxq "$swap"; then swapoff "$swap"; fi
 if test -f "$swap"; then rm -f -- "$swap"; fi
 if test "$result" -ne 0 && test "$activated" -eq 0; then
   if test "$swapped" -eq 1; then
     systemctl stop kuhni-na-zakaz
     mv "$app/.next" "$release"
     mv "$backup" "$app/.next"
   fi
   git -C "$repo" switch --detach "$base"
   cp "$sitemap_backup" "$app/public/sitemap-static.xml"
   chown kuhni:kuhni "$app/public/sitemap-static.xml"
   systemctl start kuhni-na-zakaz
 fi
}
trap cleanup EXIT
fallocate -l 4G "$swap"
chmod 600 "$swap"
mkswap "$swap"
swapon "$swap"
mkdir -p "$release/cache"
chown -R kuhni:kuhni "$release"
chown kuhni:kuhni "$app/next.config.ts" "$app/tsconfig.json" "$app/public/sitemap-static.xml"
sudo -u kuhni node -e 'const fs=require("fs");const p="/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/next.config.ts";const s=fs.readFileSync(p,"utf8");if(!s.includes("experimental: {"))throw Error("Missing config anchor");fs.writeFileSync(p,s.replace("experimental: {","experimental: {\n    cpus: 1,\n    webpackBuildWorker: true,\n    webpackMemoryOptimizations: true,").replace("const nextConfig: NextConfig = {","const nextConfig: NextConfig = {\n  webpack: (config, { dev }) => { if (!dev) { config.cache = false; config.parallelism = 1; } return config; },"))'
sudo -u kuhni bash -c "cd '$app' && RAYON_NUM_THREADS=1 UV_THREADPOOL_SIZE=2 NODE_OPTIONS=--max-old-space-size=1024 NEXT_DIST_DIR=.next-veneer-$target pnpm exec next build && pnpm run sitemap:write-static"
restore_config
test -s "$release/BUILD_ID"
test -z "$(git -C "$repo" status --porcelain --untracked-files=no)"
systemctl stop kuhni-na-zakaz
mv "$app/.next" "$backup"
mv "$release" "$app/.next"
swapped=1
systemctl start kuhni-na-zakaz
for attempt in $(seq 1 25); do
 if curl -fsS --max-time 10 https://kuhni.minsk.by/materials/shpon -o /var/tmp/veneer-release-$target.html && grep -q 'veneer-visual-page' /var/tmp/veneer-release-$target.html; then
   activated=1
   systemctl is-active kuhni-na-zakaz
   printf 'DEPLOYED %s\nROLLBACK_BUILD %s\n' "$target" "$backup"
   exit 0
 fi
 sleep 2
done
echo 'Veneer verification failed; restoring previous runtime' >&2
exit 1
