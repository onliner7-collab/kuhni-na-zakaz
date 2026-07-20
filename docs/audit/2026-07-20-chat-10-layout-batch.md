# Чат 10 — совместная приёмка пилотов и batch планировок

Дата: 2026-07-20
Основное ТЗ: `design/12-master-tz.md`

## Итог

`PASS` для трёх пилотов после блокирующих исправлений и `PASS` для batch из шести разрешённых URL. Масштабирование разрешено только на следующий route-family этап по `design/13-chat-execution-prompts.md`; автоматическое расширение URL или facet-страниц запрещено.

## Пилоты

- `/catalog/uglovye-kuhni` сохраняет spatial/Angular interaction;
- `/locations/borisov` сохраняет process journey и честный `BLOCKED_BY_INPUT` для local proof;
- `/materials/mdf-fasady` сохраняет surface comparator.

Исправлены только блокеры: вложенные main landmarks; ложная маркировка AI-концепта как реализованного проекта; неподключённые Transition Registry rails Borisov/MDF; неполный MDF Lead context; невидимый MDF provenance; некорректная tab-семантика Borisov. Global Dock сохранён единым в соответствии с master-ТЗ; page-specific действия находятся в server-rendered rails и обычных ссылках.

## Batch

| URL | userQuestion | interaction role | ExploreContext |
| --- | --- | --- | --- |
| `/catalog/pryamye-kuhni` | Когда одной линии достаточно и как расставить зоны? | `line-layout-check` | `layout=прямая` |
| `/catalog/p-obraznye-kuhni` | Хватит ли места для трёх сторон и безопасных проходов? | `clearance-comparison` | `layout=П-образная` |
| `/catalog/kuhni-s-ostrovom` | Поместится ли остров и какую функцию ему дать? | `island-clearance-planner` | `layout=с островом` + выбранная роль |
| `/catalog/malenkie-kuhni` | Как сохранить рабочую зону и хранение в маленькой кухне? | `small-space-trade-off-explorer` | scenario/приоритет |
| `/catalog/kuhni-do-potolka` | Стоит ли поднимать шкафы до потолка и как ими пользоваться? | `vertical-storage-explorer` | scenario/уровень доступа |
| `/catalog/kuhni-bez-ruchek` | Какой способ открывания без ручек подходит и какие у него ограничения? | `opening-mechanism-comparison` | hardware/способ открывания |

Records созданы до runtime-кода: `content/media/layout-batch-2026-07-20.json` и `content/transitions/layout-batch-2026-07-20.json`. Runtime Transition Registry содержит по три объяснимых перехода на каждый URL; все targets — обычные crawlable links, query/facet URL не создавались.

## QA evidence

- `typecheck`, `sitemap:check` (112 URL), production build — PASS;
- server HTML: HTTP 200, self canonical, один H1, уникальный title, вопрос, ограничения и crawlable links;
- 360/390/412/768/1440: overflow 0, broken images 0, missing alt 0;
- шесть уникальных `data-interaction-role`, ExploreContext сохраняется после выбора, `aria-pressed` обновляется;
- три пилота: один main landmark после исправления, rails доступны в server HTML;
- локальный lab baseline: LCP 112–726 мс, CLS 0–0.0472, TBT 0; catalog route First Load JS 177 КБ. Это lab evidence, не field CWV;
- локальная Prisma DB `127.0.0.1:5434` недоступна; build использовал предусмотренные static fallbacks. Production smoke обязателен после deploy.

## Protected baseline и rollback

Page-specific файлы `/`, `/design-proekt-kuhni`, `/locations/minskaya-oblast`, `/locations/minsk`, `/materials/furnitura` не менялись. Разрешены только исходящие ссылки из batch и regression QA.

Rollback: `git revert <chat-10-commit>`, push `work`, стандартный `deploy/scripts/update-production.sh work`, затем smoke девяти целевых и пяти protected URL. Prisma/schema/data migration отсутствует.
