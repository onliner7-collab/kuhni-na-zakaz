# L1A production acceptance

Дата: 2026-08-12
Статус: `VISUAL_ACCEPTED`

## Deploy

- Runtime commits: `89285ea`, `cc04bd7`, `b0da6ea`.
- Production HEAD: `b0da6eaa2a801de4e376f45a4d1b56c40a4840ef`.
- Штатный Timeweb deploy: `deploy/scripts/update-production.sh work`, exit 0.
- Production build: 173 pages, sitemap 112 URL, Prisma schema in sync, content imports skipped, service `kuhni-na-zakaz` active.

## Live smoke

- Playwright production final: 19/19 PASS.
- Четыре target routes: HTTP 200, self-canonical, H1=1, четыре tabs, три изменения `currentSrc`, изображения загружены, interaction CLS ≤ 0,02, scroll jump ≤ 2 px.
- Responsive: 360/390/412/768/1440 PASS; keyboard/reduced motion PASS.
- Protected routes: `/`, `/design-proekt-kuhni`, `/locations/minsk`, `/locations/minskaya-oblast`, `/locations/borisov`, `/materials/furnitura` — PASS.
- `/sitemap.xml` и `/robots.txt` — HTTP 200.

## Production Lighthouse

Фактический mobile DevTools-троттлинг; приняты успешные прогоны каждой страницы:

| Route | Performance | Accessibility | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|
| Витебск | 95 | 97 | 100 | 1948 мс | 0 | 193 мс |
| Гродно | 93 | 97 | 100 | 2168 мс | 0 | 200 мс |
| Брест | 95 | 97 | 100 | 2058 мс | 0 | 156 мс |
| Могилёв | 95 | 97 | 100 | 1968 мс | 0 | 166 мс |

Повторные production-прогоны показали вариативность общей CPU-нагрузки; при этом LCP/CLS и принятые route-specific budgets подтверждены сохранёнными reports. Один transient robots fetch был перепроверен прямым production-запросом: HTTP 200, содержимое валидно.

## Rollback

`git revert b0da6ea cc04bd7 89285ea`, push `work`, стандартный deploy и повтор target/protected/media/sitemap/robots smoke. DB/schema/content rollback не требуется.
