#!/usr/bin/env bash
set -euo pipefail
target=$1
[[ "$target" =~ ^[a-f0-9]{40}$ ]]
repo=/var/www/kuhni-na-zakaz
app=$repo/artifacts/kuhni-na-zakaz
release=$app/.next-gallery-$target
backup=$app/.next-before-gallery-$target
test "$(git -C "$repo" rev-parse HEAD)" = "$target"
test -z "$(git -C "$repo" status --porcelain --untracked-files=no)"
test -s "$release/BUILD_ID"
test ! -e "$backup"
systemctl stop kuhni-na-zakaz
mv "$app/.next" "$backup"
mv "$release" "$app/.next"
systemctl start kuhni-na-zakaz
for attempt in $(seq 1 25); do
 if curl -fsS --max-time 10 https://kuhni.minsk.by/catalog | grep -q 'catalog-model-wood-green'; then
  sudo -u kuhni bash -c "cd '$app' && pnpm run sitemap:write-static"
  echo 'Gallery release activated and sitemap refreshed'
  exit 0
 fi
 sleep 2
done
systemctl stop kuhni-na-zakaz
mv "$app/.next" "$release"
mv "$backup" "$app/.next"
sudo -u kuhni git -C "$repo" switch --detach 576fa18f0f8c2489dc1b525e3968129d7667435d
systemctl start kuhni-na-zakaz
echo 'Activation failed; previous runtime restored' >&2
exit 1
