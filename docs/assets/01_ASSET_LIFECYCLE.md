# Asset Lifecycle

Единая последовательность: `PLANNED → PROMPT_READY → GENERATED → REVIEW_REQUIRED → SELECTED → UPSCALED → OPTIMIZED → REGISTERED → CONNECTED → VERIFIED → LIVE → ARCHIVED`. `REJECTED` — отдельная ветка после review; файл сохраняется с причиной отказа.

| Status | Значение |
| --- | --- |
| `PLANNED` | Запланирована запись, но точный prompt или подтверждённый real source отсутствует. |
| `PROMPT_READY` | Готовы main/negative/consistency/camera/light/material/mobile/variation instructions. |
| `GENERATED` | Созданы варианты, но не выполнен полный визуальный review. |
| `REVIEW_REQUIRED` | Нужна проверка геометрии, crop, provenance, continuity или качества. |
| `SELECTED` | Выбран конкретный master/revision. |
| `REJECTED` | Вариант не используется; причина обязательна, файл не удаляется автоматически. |
| `UPSCALED` | Master увеличен только при доказанной необходимости. |
| `OPTIMIZED` | Созданы проверенные AVIF и WebP. |
| `REGISTERED` | Пути, hashes, alt, caption, rights и loading contract записаны в manifest/registry. |
| `CONNECTED` | Asset подключён к компоненту. Не используется на этапе 3. |
| `VERIFIED` | Проверен внутри страницы. Не используется на этапе 3. |
| `LIVE` | Проверен после production deploy. Не используется на этапе 3. |
| `ARCHIVED` | Сохранён, но больше не используется. |

Статус — текущая точка, а `lifecycleHistory` хранит пройденные точки. Пропуск review, rights и optimization запрещён.
