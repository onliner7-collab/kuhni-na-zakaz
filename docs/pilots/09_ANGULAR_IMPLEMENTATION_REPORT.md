# Этап 5 — отчёт внедрения `/catalog/uglovye-kuhni`

Дата: 2026-07-14. Baseline: `4c156783d39b3e52a8b9bf2da2317532b2e4d5ef`, ветка `work`, production service `active`, URL до изменений отвечал `200`.

## 1. Baseline

- Route: `app/catalog/[slug]/page.tsx`; pilot shell был Server Component, интерактив — монолитный `AngularKitchenShowroom`.
- На 390 px baseline имел 700 DOM elements, 5 images (1 eager, 4 lazy), main около 9709 px, 0 horizontal overflow.
- Hero, кнопочная галерея, три текстовых типа угла, три старых состояния хранения, 12-кадровый slider, два range и форма уже существовали.
- Tabs не имели полной связи tab/tabpanel; gallery не поддерживала native swipe; FAQPage schema не имела видимого FAQ.
- Production baseline совпал с локальным commit `4c15678`; сервис был активен.

## 2. Изменённые файлы

- Route/schema: `app/catalog/[slug]/page.tsx`.
- Серверная композиция: `components/catalog/angular-kitchens/AngularKitchenPage.tsx`.
- Новый клиентский island: `components/catalog/angular-kitchens/AngularStage5Interactive.tsx`.
- Library changes: `MobileHero`, `SwipeGallery`, `CornerStorageExplorer`, `KitchenLayoutCheck`, `MechanismComparison`.
- Structured lead answers и 44 px controls: `components/sections/ContactForm.tsx`.
- Tests: `tests/smoke/angular-kitchens-stage3.spec.ts` сохранён по историческому пути, но переведён на acceptance этапа 5.
- Media: 10 masters + 10 AVIF + 10 WebP; manifest и asset validator обновлены.

## 3. Подключённые компоненты

- `MobileHero`, `SwipeGallery`, `CornerStorageExplorer`, `KitchenLayoutCheck`, `MechanismComparison`, `BottomSheet`.
- Контекстный Dock остаётся единым global `MobileBottomNav` для exact route: `Планировка / Внутри / Цена / Рассчитать`. Второй Dock не монтируется, чтобы не создавать конфликт двух fixed navigation surfaces.
- `ProductionJourney`, `HardwareCabinetExplorer`, `HardwarePicker` не подключались.

## 4. Медиа

- Используются 24 asset-level записи Angular manifest: 1 hero, 3 gallery, 2 corner type, 12 sequence, 3 storage/mechanism, 3 materials.
- 10 новых изображений сгенерированы встроенным `imagegen`; masters сохранены в `prepared-images/generated-sources/pilots/angular-kitchens`.
- Delivery: 1200×800 AVIF/WebP, WebP 39–80 KB. Heavy PNG не используется как visible `src`.
- Все подписи явно маркируют `AI-концепт`; русские alt и captions проверены.
- Local lifecycle после browser QA: 24 `VERIFIED`, 5 `REGISTERED`, 20 `PROMPT_READY`, 2 `REVIEW_REQUIRED`. `LIVE` выставляется только после production QA.

## 5. Сохранено

- URL, canonical, BreadcrumbList, Product/ImageObject schema, route/server rendering, existing `/kapi/leads`, upload, honeypot, rate limit и notification pipeline.
- Обычные ссылки на каталог, цены, материалы, стили, портфолио, дизайн-проект и локации.
- Реальная project link отделена от AI concepts.

## 6. Заменено

- Full-screen overlay hero заменён spatial `MobileHero` без текстового перекрытия изображения.
- Button-only gallery заменена native snap `SwipeGallery` с counter, buttons и reduced motion.
- CSS-эскиз и отдельный монолитный showroom заменены общими stage-4 primitives и одним feature-local orchestration island.
- Hidden FAQPage schema удалена; видимый FAQ не добавлялся.
- Неподтверждённые сроки и гарантийные claims не перенесены.

## 7. DOM

- 390 px local stage-5: 772 DOM elements, 56 controls, 6 library component markers, 1 H1, main около 11148 px.
- DOM вырос на 72 elements относительно baseline, потому что добавлены visible tab semantics, 8 price factors, material choices и structured layout questions.
- Sequence одновременно монтирует только один image; 12 кадров не присутствуют в DOM одновременно.

## 8. Initial image loading

- DOM: 10 images, из них 1 eager/critical и 9 lazy.
- Baseline был 5 images (1 eager, 4 lazy). Рост DOM image count связан с swipe figures и активными comparison/material states.
- Только hero имеет eager/fetchPriority; sequence и inactive mechanism/material images не получают eager.
- Hidden collections не загружаются как 12-frame batch; active frame меняется после intent.

## 9. Client JS

- Next.js production build: `/catalog/[slug]` size 8.25 kB, First Load JS 175 kB.
- Старый reverse-audit фиксировал 972.2 KiB raw local script bytes для Angular, но это другой способ измерения; прямое процентное сравнение не заявляется.
- Page/route остаются Server Components; feature island не охватывает price/projects/service/form server sections.

## 10. SEO

- H1: `Угловые кухни на заказ`; один H1.
- Canonical и URL сохранены; metadata direction не менялся массово.
- BreadcrumbList, Product и ImageObject сохранены; FAQPage удалён до появления точного видимого FAQ.
- Commercial category intent сохранён; planning articles/scenarios доступны обычными ссылками и не дублируются длинной статьёй.

## 11. Форма

- Existing `ContactForm` и `/kapi/leads` сохранены.
- В `answers` отдельно передаются `sourcePage`, `kitchenType=angular`, `selectedCornerType`, `selectedMechanism`, `selectedMaterial`, `wallOneLength`, `wallTwoLength`, `windowPosition`, `doorPosition`, `communicationsPosition`, `pageUrl`.
- Playwright перехватил фактический request body и подтвердил выбранные `sink`, `carousel`, `graphite` и wall length.
- Telegram не обязателен для submit; существующий API сначала сохраняет заявку и обрабатывает notifications своим текущим fallback.

## 12. Проверки

- `pnpm.cmd --dir artifacts/kuhni-na-zakaz run typecheck` — pass.
- `pnpm.cmd run assets:validate` — pass: 33 groups, 137 assets, 43 complete triplets; 7 старых ожидаемых ratio warnings вне подключённого stage-5 набора.
- `pnpm.cmd run assets:duplicates` — pass: 326 scoped files, 0 exact duplicate groups.
- `pnpm.cmd --dir artifacts/kuhni-na-zakaz run sitemap:check` — pass, 112 URLs.
- `pnpm.cmd --dir artifacts/kuhni-na-zakaz run build` — pass; static fallback использован при недоступной local DB.
- Target Playwright — 13 pass, 1 expected desktop skip.

## 13. Viewports

- 360, 390, 412, 768, 1440: no horizontal overflow; visible page controls не меньше 44×44 px.
- Browser 390: hero 666 px после final trim, вторичный CTA остаётся выше mobile Dock; 0 broken images, 0 PNG visible src, 4 Dock actions.
- Reduced motion: gallery и explorer остаются дискретно управляемыми.

## 14. Sitemap

- 112 URL, новых routes не добавлено; `/catalog/uglovye-kuhni` сохранён.
- `RUN_CONTENT_IMPORTS` не включался; migration imports не запускались.

## 15. Production

- До deploy: `4c15678`, service active, URL `200`.
- После deploy: заполняется только после server hash, service, HTTP, HTML, assets и form smoke.

## 16. Итоговый commit

- Заполняется после commit/push.

## 17. Ограничения

- Field CWV/CrUX не измерялись; visual/browser QA и local build не заменяют field data.
- Global Dock реализован существующим `MobileBottomNav`, а не вторым экземпляром library `ContextDock`.
- Неподключённые manifest assets сохраняют честные `PROMPT_READY/REVIEW_REQUIRED/REGISTERED` состояния.

## 18. Готовность к этапу 6

- Решение принимается после production deploy и live QA. Этап 6 не должен копировать spatial Angular IA.

## 19. Следующему чату

```text
Сначала прочитай /AGENT.md, /docs/00_MASTER_PLAN.md, /docs/15_HANDOFF.md и /docs/pilots/09_ANGULAR_IMPLEMENTATION_REPORT.md. Проверь production commit и stage-5 live evidence. Выполни ЭТАП 6 только для /locations/borisov, используя ProductionJourney и временную модель из docs/pilots/02_BORISOV_SPEC.md. Не копируй spatial hero, CornerStorageExplorer, sequence, порядок блоков или material selector страницы угловых кухонь. Сохрани URL/canonical/forms/schema parity, используй только lifecycle-approved media и проверь 360/390/412/768/1440, reduced motion, intent loading, sitemap 112 URL и production после deploy.
```

## Rollback

Revert итоговый stage-5 commit отдельным Git revert и стандартно задеплоить `work`. Это вернёт старую страницу, media mapping, schema branch, form props и library behavior. Prisma migration и content imports отсутствуют.
