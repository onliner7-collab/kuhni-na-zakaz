# Правила для ИИ-агента

## Что ИИ обязан делать

1. **Читать документацию** перед написанием любого кода. Порядок: PROJECT_OVERVIEW → TECHNICAL_SPEC → соответствующие спецификации.
2. **Обновлять CHANGELOG.md** после каждого значимого изменения.
3. **Обновлять HANDOFF.md** после завершения каждого milestone.
4. **Использовать commit messages** строго по шаблону (см. ниже).
5. **Следовать архитектуре** — не менять стек без явного согласования.
6. **Не хардкодить** данные, которые должны редактироваться через CMS.
7. **Соблюдать mobile-first** — всегда проверять адаптивность.
8. **Не делать дублей страниц** — каждый URL уникален.
9. **Проверять SEO-элементы** на каждой новой странице.

## Что ИИ запрещено делать

1. Менять роутинг без обновления ROUTES_MAP.md.
2. Создавать SPA без серверного рендера для SEO-страниц (при переходе на Next.js).
3. Хардкодить телефоны, адреса, цены в коде без ENV/CMS.
4. Создавать дорвеи или дубли городских страниц.
5. Удалять или переименовывать публичные URL без редиректов.
6. Делать commit без описательного сообщения.
7. Пушить в main напрямую — только через dev → PR → main.
8. Игнорировать требования accessibility (alt, aria-label, role).

## Как обновлять документацию

После каждого milestone:
1. Добавить запись в CHANGELOG.md (дата, что изменено, файлы).
2. Обновить HANDOFF.md (текущее состояние, следующий шаг).
3. При изменении маршрутов — обновить ROUTES_MAP.md.
4. При изменении моделей данных — обновить CONTENT_MODELS.md.

## Commit messages (шаблоны)

```
docs: add project documentation and development rules
chore: initialize nextjs app router project structure
feat: add public site shell and core routes
feat: add content models and dynamic route architecture
feat: add admin shell and role-based structure
feat: add content editing flows and moderation tools
feat: add temporary guest admin access with restrictions
feat: add lead generation forms calculator and submission flows
feat: add seo metadata sitemap robots breadcrumbs and schema
fix: <краткое описание бага>
refactor: <краткое описание>
style: <стилевые изменения без логики>
```

## GitHub flow

```
main         — продакшн, только через PR
dev          — основная ветка разработки
feature/*    — фичи, мержатся в dev
fix/*        — баги, мержатся в dev
```

Push выполняется только по команде пользователя.
