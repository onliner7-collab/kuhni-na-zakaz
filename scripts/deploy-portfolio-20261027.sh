#!/usr/bin/env bash
set -euo pipefail
phase=$1
target=$2
expected=${3:-384199790b6490ddaac4747fcdc142f332f94afd}
revision=${4:-20261027}
[[ "$target" =~ ^[a-f0-9]{40}$ ]]
[[ "$expected" =~ ^[a-f0-9]{40}$ ]]
[[ "$revision" =~ ^[0-9]{8}$ ]]
repo=/var/www/kuhni-na-zakaz
release=/var/www/kuhni-portfolio-$revision
app=artifacts/kuhni-na-zakaz
branch=codex/portfolio-cleanup-20261027
check_baseline() {
  test "$(sudo -u kuhni git -C "$repo" rev-parse HEAD)" = "$expected"
  sudo -u kuhni git -C "$repo" diff --quiet
  sudo -u kuhni git -C "$repo" diff --cached --quiet
}
if test "$phase" = build; then
  check_baseline
  test ! -e "$release"
  sudo -u kuhni git -C "$repo" fetch origin "$branch"
  test "$(sudo -u kuhni git -C "$repo" rev-parse FETCH_HEAD)" = "$target"
  install -d -o kuhni -g kuhni "$release"
  sudo -u kuhni git -C "$repo" worktree add --detach "$release" "$target"
  ln -s "$repo/node_modules" "$release/node_modules"
  ln -s "$repo/$app/node_modules" "$release/$app/node_modules"
  ln -s /etc/kuhni-na-zakaz.env "$release/$app/.env"
  sudo -u kuhni bash -lc "cd '$release/$app' && pnpm exec tsc --noEmit && pnpm exec tsx --test tests/unit/portfolio-provenance.test.ts && pnpm run build"
  test -f "$release/$app/.next/BUILD_ID"
  check_baseline
  echo PORTFOLIO_BUILD_PASS
elif test "$phase" = activate; then
  check_baseline
  test "$(sudo -u kuhni git -C "$release" rev-parse HEAD)" = "$target"
  test -f "$release/$app/.next/BUILD_ID"
  backup="$repo/$app/.next-before-portfolio-$revision"
  test ! -e "$backup"
  cp "$repo/$app/public/sitemap-static.xml" "/var/tmp/sitemap-before-portfolio-$revision.xml"
  sudo -u kuhni git -C "$repo" merge --ff-only "$target"
  mv "$repo/$app/.next" "$backup"
  ln -s "$release/$app/.next" "$repo/$app/.next"
  cp "$release/$app/public/sitemap-static.xml" "$repo/$app/public/sitemap-static.xml"
  chown kuhni:kuhni "$repo/$app/public/sitemap-static.xml"
  systemctl restart kuhni-na-zakaz
  for attempt in $(seq 1 20); do
    if curl -fsS --max-time 5 http://127.0.0.1:3001/portfolio -o /var/tmp/portfolio-activated.html && grep -q 'provenance' /var/tmp/portfolio-activated.html; then
      systemctl is-active kuhni-na-zakaz
      echo "PORTFOLIO_DEPLOYED $target"
      exit 0
    fi
    sleep 2
  done
  echo 'Activation verification failed; restoring previous build and code' >&2
  systemctl stop kuhni-na-zakaz
  unlink "$repo/$app/.next"
  mv "$backup" "$repo/$app/.next"
  sudo -u kuhni git -C "$repo" switch --detach "$expected"
  cp "/var/tmp/sitemap-before-portfolio-$revision.xml" "$repo/$app/public/sitemap-static.xml"
  chown kuhni:kuhni "$repo/$app/public/sitemap-static.xml"
  systemctl start kuhni-na-zakaz
  exit 1
else
  echo 'Expected build or activate' >&2
  exit 2
fi
