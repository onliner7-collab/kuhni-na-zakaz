#!/usr/bin/env bash
set -euo pipefail
target=$1
[[ "$target" =~ ^[a-f0-9]{40}$ ]]
swap=/var/tmp/catalog-keywords-build.swap
test ! -e "$swap"
cleanup() {
  if swapon --show=NAME --noheadings | grep -Fxq "$swap"; then
    swapoff "$swap" || return 1
  fi
  rm -f -- "$swap"
}
trap cleanup EXIT
fallocate -l 2G "$swap"
chmod 600 "$swap"
mkswap "$swap"
swapon "$swap"
bash /tmp/catalog-keywords-retry-build.sh "$target"
