# Visual rescue — этапы 2–3

Дата: 2026-07-20  
Scope: `/catalog/uglovye-kuhni`, `/locations/borisov`  
Статус до deploy: `IMPLEMENTED_VERIFIED_LOCAL`

## Этап 2 — угловые кухни

- `KEEP`: существующие `AngularKitchenPage`, `AngularStage5Interactive`, `ExploreContext`, Lead pipeline, metadata/SEO и approved continuity media.
- `ADAPT`: добавлен `AngularQuickChoice` сразу после hero.
- `REPLACE/MOVE/REMOVE`: page-specific layout не переписывался; длинные price/proof blocks не менялись и остаются после visual journey.
- Series: `PILOT-AK-01..06`, AI concept, не real project; 6 accepted route-specific masters в contact sheet [angular-kitchens-contact-sheet.webp](/C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/visual-rescue/stage-2/angular-kitchens-contact-sheet.webp).
- Meaningful changes: `Две стены → Рабочая зона → Угол`; screenshot evidence подтверждает смену `currentSrc` с `angular-kitchens-angles-full-room-front-landscape-v1.webp` на `angular-kitchens-angles-long-side-landscape.webp`.

## Этап 3 — Борисов

- `KEEP`: `BorisovJourney`, local-proof fallback, AI disclosure, city context and Lead pipeline.
- `ADAPT/MOVE`: `BorisovJourney` поднят непосредственно под hero; карточки подтверждённых границ перенесены после process journey.
- Series: `BR-PROCESS-2026-07-20`, 7 AI process masters, [borisov-process-contact-sheet.webp](/C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/visual-rescue/stage-3/borisov-process-contact-sheet.webp).
- Meaningful changes: выбор этапа `Заявка → Предварительный расчёт → Замер → Проект → Производство → Доставка → Монтаж` меняет process frame; local proof остаётся `BLOCKED_BY_INPUT`.
- Запрещённые claims не добавлялись: нет адреса/филиала/сроков/реальных сотрудников/локального проекта.

Evidence: [stage-2 screenshots](/C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/visual-rescue/stage-2/screenshots), [stage-3 screenshots](/C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/visual-rescue/stage-3/screenshots), [videos](/C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/visual-rescue/videos), [stage-2-3-evidence.json](/C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/visual-rescue/stage-2-3-evidence.json).

Local evidence at 390×844: Angular first action Y=342, Borisov process controls Y=269; both routes H1=1, overflow=0, broken images=0, reduced-motion=true, one image changes after first action, image HTTP 200.

## Stage report

| Field | Stage 2 | Stage 3 |
| --- | --- | --- |
| Scope respected | PASS | PASS |
| KEEP / ADAPT / REPLACE / MOVE / REMOVE | KEEP foundation/media; ADAPT first selector; no replace/move/remove | KEEP journey/proof/lead; MOVE journey under hero; no replace/remove |
| Visual masters created | 0 new; 6 existing accepted | 0 new; 7 existing accepted |
| Derived WebP/AVIF | Existing WebP/AVIF verified; no new derivatives | Existing WebP/AVIF verified; no new derivatives |
| SeriesId | `PILOT-AK-01..06` | `BR-PROCESS-2026-07-20` |
| Meaningful visual changes | 3 choices; evidence `currentSrc` changed | 7 process steps; evidence `currentSrc` changed |
| First action at 390×844 | 342 px | 269 px |
| Visible copy before first action | H1 + short lead + one question | H1 + short lead + process question |
| Text-only sections before action | 0 | 0 |
| Initial JS / media | 4 JS resources / 5 image requests | 4 JS resources / 2 image requests |
| LCP / CLS / INP | Hero eager, intrinsic dimensions, reserved aspect ratio; no overflow | Hero eager, intrinsic dimensions, reserved aspect ratio; no overflow |
| Accessibility | 44px controls, Russian alt/caption, reduced-motion, keyboard smoke PASS | 44px controls, Russian alt/caption, reduced-motion, keyboard smoke PASS |
| SEO | HTTP 200, one H1, self canonical, server HTML, Russian alt | HTTP 200, one H1, self canonical, server HTML, Russian alt |
| Typecheck / tests / build | PASS | PASS |
| Browser widths | 360/390/412/768/1440 | 360/390/412/768/1440 |
| Protected regression | 5/5 PASS | 5/5 PASS |
| Deploy | `45546e4` pushed to `work`; production deploy PASS; mobile production smoke PASS | `45546e4` pushed to `work`; production deploy PASS; mobile production smoke PASS |
| Rollback | `git revert <visual-rescue-commit>` + standard deploy | `git revert <visual-rescue-commit>` + standard deploy |

## Production acceptance

- Commit `45546e4` deployed with `deploy/scripts/update-production.sh work`; Prisma was in sync, static sitemap contained 112 URLs, Next production build generated 173 pages, and `kuhni-na-zakaz.service` remained active.
- Playwright against `https://kuhni.minsk.by` at the mobile profile: 2/2 PASS. Angular tab `Угол` changed the frame to `angular-corner-types-straight-corner-front`; Borisov step `Предварительный расчёт` changed the frame to `borisov-process-estimate`.
- The smoke waits for `networkidle` before the first interaction so the assertion covers hydrated production UI rather than server HTML alone.
- Rollback: `git revert 45546e4`, push `work`, rerun the same deployment command and production smoke.
