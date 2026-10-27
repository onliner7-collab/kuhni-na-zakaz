#!/usr/bin/env bash
set -euo pipefail
repo=/var/www/kuhni-na-zakaz
release=/var/www/kuhni-five-article-links-20261027
app=artifacts/kuhni-na-zakaz
branch=codex/fix-five-article-links-20261027
expected=5187e91460dcb85e0489cf0ac68f5afae2550387
check_baseline() {
  test "$(sudo -u kuhni git -C "$repo" rev-parse HEAD)" = "$expected"
  sudo -u kuhni git -C "$repo" diff --quiet
  sudo -u kuhni git -C "$repo" diff --cached --quiet
}
check_baseline
test ! -e "$release"
sudo -u kuhni git -C "$repo" fetch origin "$branch"
install -d -o kuhni -g kuhni "$release"
sudo -u kuhni git -C "$repo" worktree add --detach "$release" "origin/$branch"
ln -s "$repo/node_modules" "$release/node_modules"
ln -s "$repo/$app/node_modules" "$release/$app/node_modules"
ln -s /etc/kuhni-na-zakaz.env "$release/$app/.env"
sudo -u kuhni bash -lc "cd '$release/$app' && pnpm exec tsc --noEmit && pnpm run build"
test -f "$release/$app/.next/BUILD_ID"
test -f "$release/$app/.next/prerender-manifest.json"
test -f "$release/$app/public/sitemap-static.xml"
check_baseline
test ! -e "$repo/$app/.next-before-five-article-links-20261027"
cp "$repo/$app/public/sitemap-static.xml" /var/tmp/sitemap-before-five-article-links-20261027.xml
sudo -u kuhni git -C "$repo" merge --ff-only "origin/$branch"
mv "$repo/$app/.next" "$repo/$app/.next-before-five-article-links-20261027"
ln -s "$release/$app/.next" "$repo/$app/.next"
cp "$release/$app/public/sitemap-static.xml" "$repo/$app/public/sitemap-static.xml"
chown kuhni:kuhni "$repo/$app/public/sitemap-static.xml"
systemctl restart kuhni-na-zakaz
systemctl is-active kuhni-na-zakaz
echo FIVE_ARTICLE_LINKS_DEPLOY_COMPLETE
