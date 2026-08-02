# General rollout — этап 6

Дата: 2026-08-02
Статус: `STAGE_6_ACCEPTED`
Runtime HEAD: `f96b4f9ec9db95eb20eed0466ee1de098cf9ad9c`

## Scope

- `/`;
- `/design-proekt-kuhni`;
- `/locations/minsk`;
- `/locations/minskaya-oblast`;
- `/materials/furnitura`.

## Reverse-audit и media

- **KEEP:** metadata, canonical, schema, H1, visual-first секции, формы, Lead/Telegram pipeline, подтверждённое портфолио, progressive gallery 15/200 и lightbox.
- **ADAPT:** существующие selectors подключены к ExploreContext v2; добавлены route-specific location questions и crawlable next steps.
- **MOVE / REPLACE / REMOVE:** не требовалось.
- Media audit: `REUSE`. Использованы существующие route-specific WebP/AVIF серии. Новые изображения не генерировались. AI-визуализации сохраняют disclosure и не используются как доказательство выполненного проекта или локальной работы.

## Реализация по волнам

- **6A:** главная сохраняет стиль, форму, бюджет и жизненный сценарий; выбор сценария сразу меняет visual; добавлены три server-rendered перехода.
- **6B:** дизайн-проект сохраняет помещение, форму, стиль, фасад, материал и ограничения только в whitelisted полях; preview меняется по выбору; ContactForm остаётся внутри provider.
- **6C:** Минск получил вопрос по типу помещения/задаче, область — navigator по городу; visual меняется рядом с control; неподтверждённые условия выезда не добавлялись.
- **6D:** HardwareShowroom сохраняет механизм и уровень комплектации; progressive gallery остаётся 15/200 с lightbox; добавлены три релевантных перехода.
- Transition registry: по три активных server/crawlable перехода для каждого из пяти маршрутов.

## Commits и deploy

- `d1bdf43` — 6A, главная;
- `f1ee69f` — 6B, дизайн-проект;
- `bc8a7b1` — 6C, Минск и Минская область;
- `f96b4f9` — 6D, фурнитура, переходы и QA.
- Push `origin/work`: PASS.
- Production fast-forward: `30fc9388` → `f96b4f9`.
- Production build: PASS, Next.js 15.3.9, 173 static generation steps, sitemap 112 URL.
- Service `kuhni-na-zakaz`: `active`, runtime HEAD `f96b4f9`.

Runtime-волны были задеплоены одним последовательным rollout range после выполнения объединённого запроса на этапы 5 и 6; каждый scope commit входит в активный production HEAD.

## Gates

- typecheck — PASS;
- exploration — 11/11 PASS;
- leads — 6/6 PASS;
- sitemap — 112 URL PASS; local DB `127.0.0.1:5434` была недоступна, штатный static fallback прошёл;
- SEO — PASS;
- images — 300 references, broken/oversized/bad names: 0;
- local production build — PASS, 127 prerendered pages;
- local stage-6 Playwright — 30/30 PASS: пять маршрутов × 360/390/412/768/1440 и пять interaction/context checks;
- production HTTP smoke — 5/5 scope URL, `sitemap.xml` и `robots.txt` отдают 200;
- production journey — 5/5 interaction checks PASS: 4/5 в основном прогоне, единственный транспортный `ERR_TIMED_OUT` для области прошёл отдельным повтором за 1,6 с;
- production Lighthouse simulated mobile — 5/5 PASS.

## Production Lighthouse

| URL | Performance | Accessibility | SEO | LCP, мс | CLS | TBT, мс |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 99 | 93 | 100 | 2042 | 0 | 0 |
| `/design-proekt-kuhni` | 98 | 96 | 100 | 2137 | 0 | 6 |
| `/locations/minsk` | 100 | 96 | 100 | 1502 | 0 | 0 |
| `/locations/minskaya-oblast` | 98 | 96 | 100 | 1860 | 0 | 0 |
| `/materials/furnitura` | 99 | 96 | 100 | 1611 | 0 | 6 |

Профиль: standard simulated mobile. Assertions: Performance ≥90, Accessibility ≥90, SEO 100, LCP <2500 мс, CLS <0,1, TBT <300 мс.

## Evidence

- `artifacts/general-rollout/stage-6/playwright-report.json` — local 30/30;
- `artifacts/general-rollout/stage-6/playwright-production-journey.json` — основной production journey;
- `artifacts/general-rollout/stage-6/playwright-production-journey-retry.json` — успешный повтор единственного сетевого timeout;
- `artifacts/general-rollout/stage-6/lighthouse-production/` — пять production JSON reports.

## Rollback

При воспроизводимой runtime-регрессии последовательно выполнить `git revert f96b4f9 bc8a7b1 f1ee69f d1bdf43`, push ветки `work`, standard build/restart, затем повторить smoke пяти маршрутов, `sitemap.xml`, `robots.txt` и representative Lighthouse. Изменения DB/schema/data в rollout не выполнялись.

## Remaining risks

- Внешний Chromium-маршрут к production периодически давал единичный 30-секундный transport timeout при плотном 30-case прогоне. Прямой HTTP smoke, пять Lighthouse и повтор упавшего journey прошли; продуктовый дефект не воспроизведён.
- Общие dirty/untracked файлы пользователя сохранены и не включались в scope commits.
