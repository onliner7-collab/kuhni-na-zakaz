# Development Rules

## Процесс

1. Прочитать `AGENT.md`, Master Plan, stage docs и Handoff.
2. Проверить status/log и фактический код; зафиксировать baseline commit.
3. Работать минимальными изменениями в отдельной ветке или атомарными commits; не смешивать чужой dirty diff.
4. Сначала mobile contract 360/390/412, затем desktop.
5. Выполнить команды из фактического package.json, затем browser/e2e и SEO regression.
6. Обновить три registry, Decision Log и полностью Handoff.
7. Записать rollback: commit/files/data migration и способ проверки восстановления.

## Фактические команды

- Корень: `pnpm.cmd run typecheck`, `pnpm.cmd run build`.
- App: `pnpm.cmd run typecheck`, `pnpm.cmd run build`, `pnpm.cmd run sitemap:check`, `pnpm.cmd run images:audit`, `pnpm.cmd run seo:check`.
- Smoke: `pnpm.cmd run smoke:key-pages` или целевой Playwright config из app package.

Этап 1 не меняет код, поэтому build/typecheck не обязательны; sitemap check и документационные проверки достаточны. UTF-8 без BOM; русские правки через apply_patch/UTF-8 safe tooling.
