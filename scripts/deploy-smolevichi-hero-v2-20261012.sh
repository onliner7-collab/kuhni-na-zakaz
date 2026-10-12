#!/usr/bin/env bash
set -euo pipefail
target=$1
base=c328fa351cb2ee43f0dfeefdf923f77f7b94ea45
[[ "$target" =~ ^[a-f0-9]{40}$ ]]
repo=/var/www/kuhni-na-zakaz
app=$repo/artifacts/kuhni-na-zakaz
release=$app/.next-smolevichi-hero-$target
backup=$app/.next-before-smolevichi-hero-$target
swap=/var/tmp/smolevichi-hero-v2-20261012-build.swap
config_backup=/var/tmp/smolevichi-hero-v2-20261012-next.config.ts
tsconfig_backup=/var/tmp/smolevichi-hero-v2-20261012-tsconfig.json
sitemap_backup=/var/tmp/smolevichi-hero-v2-20261012-sitemap.xml
activated=0
test "$(git -C "$repo" rev-parse HEAD)" = "$base"
test -z "$(git -C "$repo" status --porcelain --untracked-files=no)"
test ! -e "$swap"
test ! -e "$release"
test ! -e "$backup"
git -C "$repo" fetch origin codex/smolevichi-release
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
   git -C "$repo" switch --detach "$base"
   cp "$sitemap_backup" "$app/public/sitemap-static.xml"
 fi
}
trap cleanup EXIT
fallocate -l 4G "$swap"
chmod 600 "$swap"
mkswap "$swap"
swapon "$swap"
chown kuhni:kuhni "$app/next.config.ts" "$app/tsconfig.json" "$app/public/sitemap-static.xml"
mkdir -p "$release/cache"
if test -d "$app/.next/cache"; then cp -a "$app/.next/cache/." "$release/cache/"; fi
chown -R kuhni:kuhni "$release"
sudo -u kuhni node -e 'const fs=require("fs");const p="/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/next.config.ts";const s=fs.readFileSync(p,"utf8");if(!s.includes("experimental: {"))throw Error("Missing config anchor");fs.writeFileSync(p,s.replace("experimental: {","experimental: {\n    cpus: 1,\n    webpackMemoryOptimizations: true,"))'
sudo -u kuhni bash -c "cd '$app' && pnpm run sitemap:write-static && NODE_OPTIONS=--max-old-space-size=1024 NEXT_DIST_DIR=.next-smolevichi-hero-$target pnpm exec next build"
restore_config
test -s "$release/BUILD_ID"
test -z "$(git -C "$repo" status --porcelain --untracked-files=no)"
systemctl stop kuhni-na-zakaz
mv "$app/.next" "$backup"
mv "$release" "$app/.next"
systemctl start kuhni-na-zakaz
for attempt in $(seq 1 25); do
 if curl -fsS --max-time 10 https://kuhni.minsk.by/locations/smolevichi -o /var/tmp/smolevichi-hero-v2-20261012-release.html; then break; fi
 sleep 2
done
if ! grep -q 'smolevichi-hero-v2-20261012/corner' /var/tmp/smolevichi-hero-v2-20261012-release.html; then
 systemctl stop kuhni-na-zakaz
 mv "$app/.next" "$release"
 mv "$backup" "$app/.next"
 git -C "$repo" switch --detach "$base"
 cp "$sitemap_backup" "$app/public/sitemap-static.xml"
 systemctl start kuhni-na-zakaz
 exit 1
fi
activated=1
systemctl is-active kuhni-na-zakaz
printf 'DEPLOYED %s\nROLLBACK_BUILD %s\n' "$target" "$backup"
