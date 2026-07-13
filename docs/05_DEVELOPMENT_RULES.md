# Правила разработки

## Порядок работы

1. Прочитать `AGENTS.md`, `AGENT.md`, документы 00–07 и ТЗ этапа.
2. Проверить `git status`, ветку и чужие изменения; не смешивать и не откатывать их.
3. Найти route, metadata, schema, данные, формы и все потребители shared-компонентов.
4. Зафиксировать baseline: `pnpm.cmd run sitemap:check`, доступные тесты и затронутые viewport.
5. Для изолированной задачи создать ветку с префиксом `codex/`, если пользователь не требует работать в текущей release-ветке.
6. Вносить небольшие типизированные изменения; один этап — одна проверяемая цель.
7. Обновить `07_DECISION_LOG.md` и профильную документацию.

## Проверки

Из `artifacts/kuhni-na-zakaz`:

```powershell
pnpm.cmd run sitemap:check
pnpm.cmd run typecheck
pnpm.cmd run seo:check
pnpm.cmd run images:audit
pnpm.cmd run smoke:key-pages
pnpm.cmd run build
```

В package scripts нет отдельной команды `lint` и общей команды `test`; не объявлять их успешными. Запускать конкретные Playwright smoke-тесты. При проблеме с `tsconfig.tsbuildinfo`: `node_modules/.bin/tsc.CMD --noEmit --incremental false`.

## Визуальная приёмка

- viewport: 360, 390, 412, 768 и desktop;
- нет горизонтального overflow, перекрытия Dock/CTA и скачка hero;
- клавиатура, focus, reduced motion, подписи и touch targets работают;
- все новые изображения загружены, имеют русские alt/caption и правильную маркировку;
- важный HTML, ссылки, metadata, canonical и JSON-LD присутствуют в серверном ответе.

## Lighthouse и бюджеты

Проверять mobile Lighthouse на стабильной production-like сборке. Новая feature не должна ухудшать LCP из-за загрузки всех кадров, INP из-за тяжёлого JS и CLS из-за неизвестных размеров. Сначала poster/hero, затем lazy loading.

## Безопасный релиз и rollback

- перед коммитом: `git diff --check`, список изменённых файлов и повтор ключевых проверок;
- не включать чужие файлы в commit;
- rollback — revert отдельного этапного commit, а не `reset --hard`;
- при регрессии shared-компонента отключить новый feature-флаг/конфигурацию маршрута и восстановить предыдущую серверную разметку;
- deploy выполняется только если он входит в запрос; после deploy проверяются commit, service health, HTTP и mobile UI.
