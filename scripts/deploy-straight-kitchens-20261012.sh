#!/usr/bin/env bash
set -euo pipefail
target=$1
base=427531232ac40364dc33617a5ac9a9d2e2c4d0f2
[[ "$target" =~ ^[a-f0-9]{40}$ ]]
repo=/var/www/kuhni-na-zakaz
app=$repo/artifacts/kuhni-na-zakaz
release=$app/.next-straight-$target
backup=$app/.next-before-straight-$target
swap=/var/tmp/straight-kitchens-build.swap
activated=0
test "$(git -C "$repo" rev-parse HEAD)" = "$base"
test -z "$(git -C "$repo" status --porcelain --untracked-files=no)"
test ! -e "$swap"
git -C "$repo" fetch origin codex/straight-kitchens-release
test "$(git -C "$repo" rev-parse FETCH_HEAD)" = "$target"
git -C "$repo" switch --detach "$target"
cp "$app/next.config.ts" /tmp/straight-next.config.ts
cp "$app/tsconfig.json" /tmp/straight-tsconfig.json
restore_config() {
 cp /tmp/straight-next.config.ts "$app/next.config.ts"
 cp /tmp/straight-tsconfig.json "$app/tsconfig.json"
 chown kuhni:kuhni "$app/next.config.ts" "$app/tsconfig.json"
}
cleanup() {
 local result=$?
 restore_config
 if swapon --show=NAME --noheadings | grep -Fxq "$swap"; then swapoff "$swap"; fi
 if test -f "$swap"; then rm -f -- "$swap"; fi
 if test "$result" -ne 0 && test "$activated" -eq 0; then git -C "$repo" switch --detach "$base"; fi
}
trap cleanup EXIT
fallocate -l 4G "$swap"
chmod 600 "$swap"
mkswap "$swap"
swapon "$swap"
chown kuhni:kuhni "$app/next.config.ts" "$app/tsconfig.json"
sudo -u kuhni node -e 'const fs=require("fs");const p="/var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/next.config.ts";const s=fs.readFileSync(p,"utf8");if(!s.includes("experimental: {"))throw Error("Missing config anchor");fs.writeFileSync(p,s.replace("experimental: {","experimental: {\n    cpus: 1,\n    webpackMemoryOptimizations: true,"))'
if ! sudo -u kuhni bash -c "cd '$app' && NODE_OPTIONS=--max-old-space-size=1024 NEXT_DIST_DIR=.next-straight-$target pnpm exec next build"; then
 restore_config
 git -C "$repo" switch --detach "$base"
 exit 1
fi
restore_config
test -s "$release/BUILD_ID"
test ! -e "$backup"
test -z "$(git -C "$repo" status --porcelain --untracked-files=no)"
systemctl stop kuhni-na-zakaz
mv "$app/.next" "$backup"
mv "$release" "$app/.next"
systemctl start kuhni-na-zakaz
for attempt in $(seq 1 25); do
 if curl -fsS --max-time 10 https://kuhni.minsk.by/catalog/pryamye-kuhni -o /tmp/straight-release-live.html && grep -q 'straight-storage-choice' /tmp/straight-release-live.html; then
  sudo -u kuhni bash -c "cd '$app' && pnpm run sitemap:write-static"
  activated=1
  echo "STRAIGHT_RELEASE_ACTIVE=$target"
  exit 0
 fi
 sleep 2
done
systemctl stop kuhni-na-zakaz
mv "$app/.next" "$release"
mv "$backup" "$app/.next"
git -C "$repo" switch --detach "$base"
systemctl start kuhni-na-zakaz
echo 'Activation failed; previous runtime restored' >&2
exit 1
