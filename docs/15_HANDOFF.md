# Handoff

## Current stage

Этап 1 — архитектурный фундамент и фактический аудит. Документация сформирована на baseline commit `658571b` ветки `work`.

## Completed

- Проанализированы workspace/app structure, routes, metadata, sitemap, robots, schema, components, styles, safe-area/reduced-motion, media, forms, Prisma, notifications, analytics и performance risks.
- Production sitemap и локальный static fallback подтверждают 112 URL.
- Созданы обязательные 16 документов и краткий `AGENT.md`.
- Реестры основаны на фактических URL, 91 TSX-компоненте и media directories.

## Created files

`docs/00_MASTER_PLAN.md` — `docs/15_HANDOFF.md`; обновлён `AGENT.md`. Старая дублирующая серия `docs/00_PROJECT_VISION.md` — `docs/08_HANDOFF.md` удалена после переноса актуальной информации.

## Modified production files

Нет. Файлы внутри `artifacts/kuhni-na-zakaz`, runtime config, routes, styles, SEO, forms и media не изменялись.

## Git status

До работы: clean, `work...origin/work`. После работы изменены только `AGENT.md` и документация: старая серия 00–08 удалена, новая серия 00–15 добавлена. Production-пути вне `docs/` не затронуты. Следующий чат обязан повторить `git status`.

## Latest commit

`658571b docs: record full project deploy`.

## Checks executed

- `git status --short --branch` и `git log -5 --oneline --decorate`.
- `pnpm.cmd run sitemap:check` в app: passed, 112 URL, static fallback.
- Production `https://kuhni.minsk.by/sitemap.xml`: HTTP 200, 112 URL.
- Static inventory: 103 pages, 68 route handlers, 91 components, 1008 public files.
- Browser mobile DOM: 360, 390 и 412 px; H1/overflow/broken images; pilot Dock после hydration.
- Проверка 17 обязательных файлов, UTF-8 без BOM, 112/91/21 строк реестров, sitemap-to-registry diff, `git diff --check` и Prettier Markdown.

## Checks passed

Sitemap consistency; production sitemap availability; отсутствие horizontal overflow и broken completed images на проверенных страницах; один H1; hydrated pilot Dock = 4 items; все обязательные файлы существуют; Page Registry совпадает с 112 sitemap URL; только документационный git diff; Markdown после форматирования проходит Prettier.

## Checks failed or not executed

- Build/typecheck/lint не запускались: production-код не менялся.
- Lighthouse/CWV/throttled network не запускались; абсолютные показатели не подтверждены.
- Локальная DB недоступна для sitemap script, поэтому использован предусмотренный static fallback.

## Known issues

79/91 client components; глобальный client PublicChrome; монолиты 600–2100 строк; controls 40–42 px; 358 МБ public media; 47 duplicate hash groups; furnitura DOM с 203 images; нет route error/loading boundaries; неполный media provenance.

## Unverified assumptions

Права и real/AI status старых медиа, актуальные field CWV, полнота DB-driven alt, бизнес-актуальность всех цен/сроков/гарантий, наличие реальных проектов в каждом городе.

## Do not change

URL/canonical/sitemap/robots/metadata, формы и API, Prisma schema, shared chrome/Dock, pilot implementations и media до соответствующего утверждённого этапа. Не выдавать AI за реальные проекты.

## Next required stage

Следующий этап: проектирование трёх пилотных страниц без реализации и без генерации финальных медиа. Поскольку код уже содержит более поздние реализации, сначала выполнить reverse-audit и не считать существующий UI автоматически утверждённым дизайном.

## Exact starting instruction

Сначала прочитай /AGENT.md, /docs/00_MASTER_PLAN.md и /docs/15_HANDOFF.md.
Затем прочитай документы, относящиеся к текущему этапу.
Проверь git status, последние коммиты и фактический код.
Не полагайся только на описание предыдущего чата.

Выполни ЭТАП 2 — детальное UX-, SEO- и компонентное проектирование /catalog/uglovye-kuhni, /locations/borisov, /materials/furnitura без изменений production-страниц, без генерации финальных медиа и без массового создания компонентов. Сначала сопоставь проектирование с уже существующими pilot implementations и зафиксируй расхождения.
