# L1B location visual corrective — production acceptance

Дата: 2026-08-13
Статус: `PRODUCTION_ACCEPTED`

## Deploy

- Runtime commit: `54d3d6e9cf30ca9dde72a102c38aeb2e1669365b`.
- Ветка `work` отправлена в `origin/work`.
- Штатный deploy: `deploy/scripts/update-production.sh work`.
- Production HEAD: `54d3d6e9cf30ca9dde72a102c38aeb2e1669365b`.
- Service `kuhni-na-zakaz`: active, новый Next.js 15.3.9 process запущен.
- DB/schema/content imports не менялись.

## Live QA

- Production Playwright: 19/19 PASS.
- Targets: Молодечно, Жодино, Слуцк, Марьина Горка — HTTP 200, H1=1, self-canonical, 4 tabs, 3 последовательных `currentSrc` changes, `naturalWidth > 0`, scroll stable, ExploreContext safe.
- Responsive: 360/390/412/768/1440 PASS.
- Keyboard, reduced motion и protected routes `/`, `/design-proekt-kuhni`, `/locations/minsk`, `/locations/minskaya-oblast`, `/locations/borisov`, `/materials/furnitura` — PASS.
- 48/48 L1B WebP/AVIF URLs — HTTP 200.
- `/sitemap.xml` и `/robots.txt` — HTTP 200; sitemap contract остаётся 112 canonical URL.

## Production Lighthouse

Representative `/locations/molodechno`, mobile:

| Метрика | Результат |
| --- | ---: |
| Performance | 100 |
| Accessibility | 97 |
| SEO | 100 |
| LCP | 1296 мс |
| CLS | 0 |
| TBT | 10 мс |

Reports: `lighthouse-production/molodechno-mobile.report.report.json` и `.report.html`.

## Rollback

```text
git revert 54d3d6e
git push origin work
ssh -i C:\Users\User\.ssh\timeweb_kuhni_ed25519 root@5.42.108.140 "bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work"
```

После rollback повторить четыре target, шесть protected routes, 48 media URL, sitemap/robots и representative Lighthouse. DB/schema/content rollback не требуется.
