# Architecture

## Фактическая модель

pnpm monorepo содержит библиотеки в `lib/*`, вспомогательные artifacts и основное Next-приложение в `artifacts/kuhni-na-zakaz`. Публичные и admin routes находятся в App Router; API использует префикс `/kapi`. Данные приходят из Prisma/PostgreSQL с локальными fallback-модулями для публичных страниц и sitemap.

## Правила развития

- Route/page/layout остаются Server Components по умолчанию.
- Клиентская граница охватывает минимальный интерактивный остров, а не страницу или глобальный shell.
- Новые feature-компоненты размещаются рядом по смыслу: `components/<feature>`; действительно общие primitives — в `components/ui`, chrome — в `components/layout`.
- Typed page configuration и данные интерактива хранятся в `data/<feature>.ts` или feature-local module; контент, provenance и media IDs не прячутся в JSX-монолите.
- Новый компонент появляется только при подтверждённой потребности страницы.
- Shared-компонент меняется только после поиска всех import/usages и regression matrix.
- Page-компонент оркестрирует секции; секции не должны превращаться в монолит на тысячи строк.

## Безопасная миграция

1. Зафиксировать route contract, metadata, schema, forms, links и visual baseline.
2. Вынести один изолированный блок без смены URL и HTML-смысла.
3. Сравнить mobile 360/390/412, desktop, keyboard, reduced motion, DOM/JS и SEO HTML.
4. Сохранить fallback и rollback commit.
5. Только после проверки повторять для следующего блока.

## Текущий долг

`PublicChrome` не должен автоматически считаться правильной будущей границей: весь chrome скрыт до mount. `RegionalLocationPage` и крупные interactive-компоненты требуют поэтапного разделения, но не в этапе 1.
