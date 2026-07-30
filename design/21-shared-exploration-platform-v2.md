# Shared exploration platform v2

Статус: `STAGE_4_ACCEPTED`
Дата: 2026-07-30
Scope: общая foundation для будущих волн без массового подключения planned transitions.

## Аудит существующей foundation

| Модуль | Решение | Обоснование |
| --- | --- | --- |
| `ExploreContext.tsx` | ADAPT | Сохранён Provider API; добавлены v2 storage migration, безопасная очистка и analytics. |
| `RelatedExplorationRail.tsx` | ADAPT | Сохранён server reader и обычные href; добавлен небольшой progressive-enhancement link. |
| `MediaSequence.tsx` | KEEP | Дублирование нового visual shell не доказано. |
| `ContextSummary.tsx` | ADAPT | Добавлена очистка одного поля, раздельные русские значения материалов/фурнитуры и 44 px controls. |
| `StyleVisualExplorer.tsx` | KEEP | Уже выполняет native tabs, keyboard, focus, reduced motion и один active visual. |
| `ScenarioVisualExplorer.tsx` | KEEP | Уже выполняет native tabs, keyboard, focus, reduced motion и один active visual. |
| `FamilyDecisionControls.tsx` | KEEP | Route-specific interaction сохраняется без унификации шаблона. |
| `lib/transition-registry.ts` | ADAPT | Существующие active записи сохранены; добавлены v2 types, Zod validation, stable IDs и evidence/status gate. |
| `data/exploration-families.ts` | KEEP | Семейные контракты и accepted links не переписываются. |
| `tests/unit/exploration-foundation.test.ts` | KEEP | Исходные regression tests сохранены и дополнены отдельным v2 suite. |
| Lead contracts | ADAPT | В `answers.exploreContext` передаются только whitelisted неперсональные поля. |
| Analytics contracts | ADAPT | Добавлена единая exploration taxonomy без нового provider и без PII. |
| Visual shell | KEEP (не создавать) | Нет подтверждённого дублирования минимум в трёх независимых семействах. |

`REPLACE`, `MOVE`, `REMOVE`: отсутствуют.

## Runtime registry v2

- TypeScript + Zod schema validation при загрузке модуля.
- Stable ID выводится детерминированно из route/state/action/target; дубли останавливают сборку.
- `readTransitions` возвращает только `active`, сортирует по priority и ограничивает список четырьмя ссылками.
- `planned`, `disabled`, `blocked_evidence` не отображаются.
- PROOF с `evidence_required` получает `blocked_evidence`.
- Targets и fallback принимают только внутренний route/fragment.
- Registry статический, без DB и client fetch; design JSON из `docs/` не импортируется в bundle.

## ExploreContext v2

- Storage key: `kuhni-explore-context-v2`.
- Envelope: `{ version: 2, value }`.
- Legacy key `kuhni-explore-context` мигрирует один раз и удаляется.
- Разрешены только layout/style/materials/hardware/scenario/location/budgetIntent/evidencePreference/sourceRoute/lastMeaningfulAction.
- Имя, телефон, адрес, свободный текст, точная цена, href/searchParams и неизвестные поля отбрасываются.
- Поле или весь контекст очищаются пользователем; очистка отправляет только безопасное имя измерения.
- URL и canonical не изменяются; обычные ссылки работают без JavaScript.

## Related rail и server fallback

`RelatedExplorationRail` остаётся server component. Каждая ссылка присутствует в HTML как обычный `href` с русским anchor и reason. Client island на клике только сохраняет contextPatch и отправляет один analytics event; переход не перехватывается.

При отсутствии active transitions остаётся русское текстовое объяснение. Planned registry не попадает в client bundle и не подключается массово к 112 страницам.

## Lead и analytics

`ContactForm` читает сохранённый контекст непосредственно перед submit и добавляет его в `answers.exploreContext`, только если есть meaningful selection. PII из формы не смешивается с exploration analytics.

События: `exploration_entry`, `exploration_select`, `exploration_compare`, `exploration_proof_open`, `exploration_transition_click`, `exploration_context_clear`, `lead_open_with_context`.

Разрешённые параметры: source route/family, state, action, target, selected dimension, evidence preference. Новый provider не добавлялся.

## Accessibility и performance

- Существующие visual tabs/keyboard/focus/reduced-motion contracts сохранены.
- Новые кнопки очистки имеют русские accessible names и размер 44×44.
- Navigation остаётся semantic `nav`.
- Один eager LCP visual и intent-mounted остальные media сохранены.
- Visual-rescue regression: 23/23; widths 360/390/412/768/1440; protected five 5/5.
- First Load JS изменился примерно на 1 КБ на representative scenario route и остаётся ниже лимита +10 КБ.

## Rollback

1. `git revert <stage-4-runtime-commit>`.
2. Push `work`.
3. Стандартный production deploy.
4. Повторить smoke, visual-rescue 23, protected five, Lead/Telegram и analytics checks.

DB/schema/data rollback не требуется.

## Production acceptance

- Runtime commit: `2b140a9`.
- Push: `origin/work` PASS.
- Timeweb production build: 173 pages PASS.
- Service: `kuhni-na-zakaz` active.
- Representative HTTP, protected five, sitemap и robots: HTTP 200.
- Production visual-rescue 23 + responsive/protected matrix: 2/2 PASS.
- Production Lighthouse provided: Performance/Accessibility/SEO 100; LCP 516–692 ms; CLS 0; TBT 0.
