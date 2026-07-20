# Visual rescue — этап 1: production visual audit

Дата: 2026-07-20  
Scope: 23 canonical routes из этапов 2–24  
Runtime deploy: `NO RUNTIME DEPLOY — runtime unchanged`

Аудит выполнен на `https://kuhni.minsk.by` в viewport 390×844. Для каждого route сохранены initial/after-first-action/visual-result screenshots и screen recording. Browser evidence: [audit.json](/C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/visual-rescue/stage-1/audit.json), [screenshots](/C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/visual-rescue/stage-1/screenshots), [videos](/C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/visual-rescue/stage-1/videos).

| Route | HTTP | Route-specific masters | Generic reuse | Visual changes | First action Y | Text-only sections | Status |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/catalog/uglovye-kuhni` | 200 | 6 | 0 | 0 | 3122 | 3 | `REDESIGN_VISUAL_FLOW` |
| `/locations/borisov` | 200 | 1 initial / 7 registered | 0 | 1 | 2028 | 3 | `VISUAL_BACKFILL` |
| `/materials/mdf-fasady` | 200 | 4 | 0 | 0 | 1639 | 3 | `REDESIGN_VISUAL_FLOW` |
| `/catalog/pryamye-kuhni` | 200 | 0 | 1 | 0 | 731 | 2 | `VISUAL_BACKFILL` |
| `/catalog/p-obraznye-kuhni` | 200 | 1 | 0 | 0 | 731 | 2 | `VISUAL_BACKFILL` |
| `/catalog/kuhni-s-ostrovom` | 200 | 0 | 1 | 0 | 703 | 2 | `VISUAL_BACKFILL` |
| `/catalog/malenkie-kuhni` | 200 | 0 | 1 | 0 | 703 | 2 | `VISUAL_BACKFILL` |
| `/catalog/kuhni-do-potolka` | 200 | 0 | 1 | 0 | 703 | 2 | `VISUAL_BACKFILL` |
| `/catalog/kuhni-bez-ruchek` | 200 | 1 | 0 | 0 | 735 | 2 | `VISUAL_BACKFILL` |
| `/styles/neoklassika` | 200 | 1 | 0 | 0 | 1496 | 4 | `VISUAL_BACKFILL` |
| `/styles/hay-tek` | 200 | 1 | 0 | 0 | 1496 | 4 | `VISUAL_BACKFILL` |
| `/styles/provans` | 200 | 0 | 1 | 0 | 1430 | 4 | `VISUAL_BACKFILL` |
| `/styles/loft` | 200 | 1 | 0 | 0 | 1496 | 4 | `VISUAL_BACKFILL` |
| `/styles/sovremennye` | 200 | 1 | 0 | 0 | 1524 | 4 | `VISUAL_BACKFILL` |
| `/styles/skandinavskie` | 200 | 1 | 0 | 0 | 1496 | 4 | `VISUAL_BACKFILL` |
| `/styles/klassicheskie` | 200 | 0 | 1 | 0 | 1552 | 4 | `VISUAL_BACKFILL` |
| `/styles/minimalizm` | 200 | 1 | 0 | 0 | 1581 | 4 | `VISUAL_BACKFILL` |
| `/scenarios/s-ostrovom` | 200 | 0 | 1 | 0 | 1242 | 2 | `VISUAL_BACKFILL` |
| `/scenarios/do-potolka` | 200 | 0 | 1 | 0 | 1262 | 3 | `VISUAL_BACKFILL` |
| `/scenarios/dlya-semi` | 200 | 1 | 0 | 0 | 1205 | 2 | `VISUAL_BACKFILL` |
| `/scenarios/dlya-studii` | 200 | 1 | 0 | 0 | 1290 | 2 | `VISUAL_BACKFILL` |
| `/scenarios/dlya-malenkoy-kuhni` | 200 | 0 | 1 | 0 | 1261 | 2 | `VISUAL_BACKFILL` |
| `/scenarios/byudzhetnaya-kuhnya` | 200 | 0 | 1 | 0 | 1205 | 2 | `VISUAL_BACKFILL` |

Вывод: этапы 2–3 являются приоритетными remediation pilots. Existing approved/registered masters сохранены; runtime redesign нужен для того, чтобы meaningful visual action был в первом/втором viewport и менял изображение, а не только текст.
