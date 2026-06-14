# Прогресс по мастер-ТЗ топ-1 Google/Яндекс

Дата старта: 13 июня 2026  
Мастер-ТЗ: `docs/audit/2026-06-13-top1-google-yandex-master-tz.md`

## Текущее состояние

- Мастер-ТЗ создано.
- PR-CY открыт на странице позиций: `https://a.pr-cy.ru/keywords/overview/kuhni.minsk.by/`.
- В PR-CY уже есть weekly-baseline: `94` запроса, средняя позиция `81.55`, видимость `0.90`.
- Production sitemap: 108 URL, все проверенные URL живые.
- Текущая browser-сессия 14.06.2026 не авторизована в GSC и Яндекс.Вебмастере, поэтому live-статусы индексации нужно добрать отдельным browser-проходом после входа.

## Этапы

| Этап | Статус | Дата | Результат |
|---|---|---:|---|
| 0. Мониторинг позиций и baseline | Частично выполнен | 13.06.2026 | PR-CY принял 94 запроса; baseline создан; конкуренты подготовлены, но форма редактирования PR-CY увела на неавторизованный `pr-cy.io` |
| 1. Sitemap, robots, canonical | Выполнен | 13.06.2026 | Static sitemap закреплён как fallback, local/production 108 URL, deploy выполнен |
| 2. Local SEO, NAP, schema доверия | Выполнен | 13.06.2026 | Борисов/Минск разведены, LocalBusiness усилен, Яндекс переобход `/contacts` и `/locations/minsk` отправлен |
| 3. Отзывы и review schema | Выполнен | 13.06.2026 | Product/AggregateRating убран с главной, review schema фильтрует качественные отзывы |
| 4. Скорость и CWV | Выполнен | 14.06.2026 | Local production-like LHCI mobile: performance 100, LCP 490-885 мс на 5 ключевых URL; битых изображений и горизонтального скролла нет |
| 5. Money-pages | Выполнен | 14.06.2026 | Усилены `/catalog`, `/catalog/*` и `/prices`: смета, договор, техника, FAQ и FAQPage schema для цен |
| 6. Контент-кластеры | Не начат | — | Нужно запланировать и публиковать волны статей |
| 7. Портфолио и кейсы | Не начат | — | Нужно усилить реальные доказательства |
| 8. Geo-страницы | Не начат | — | Нужно убрать риск шаблонности |
| 9. Внутренняя перелинковка | Не начат | — | Нужно направить вес на money-pages |
| 10. Внешние сигналы | Не начат | — | Нужно отзывы, карты, ссылки, бренд |
| 11. GSC/Яндекс/PR-CY переобход | Не начат | — | Выполнять после крупных деплоев |
| 12. Еженедельный SEO-контроль | Частично выполнен | 14.06.2026 | Production и PR-CY weekly-check выполнены; GSC/Яндекс не обновлены из-за отсутствия browser-login |

## Правило обновления

Каждый новый чат после выполнения своего этапа обязан обновить эту таблицу и добавить ниже краткий лог:

```text
Дата:
Этап:
Что изменено:
Проверки:
Деплой:
Production URL:
GSC/Яндекс:
Осталось:
```

## Лог выполнения

```text
Дата: 13.06.2026
Этап: 0. Мониторинг позиций и baseline
Что изменено: создан docs/audit/2026-06-13-rank-baseline.md; подготовлено 95 запросов и 7 конкурентов; в PR-CY добавлены 94 ключевые фразы.
Проверки: PR-CY больше не показывает "Запросы (0)"; после добавления лимит изменился до 29 906 доступных фраз.
Деплой: не требовался для PR-CY, документы вошли в commit 655bb61.
Production URL: https://kuhni.minsk.by/
GSC/Яндекс: не применимо для этапа 0.
Осталось: добавить конкурентов в PR-CY, когда русская форма редактирования конкурентов будет доступна; дождаться первого съёма позиций и заполнить среднюю позицию/видимость/top-группы.
```

```text
Дата: 13.06.2026
Этап: 1. Sitemap, robots, canonical
Что изменено: static sitemap fallback синхронизирован через app/sitemap.ts; добавлен prebuild; sitemap:check сравнивает static XML с генератором.
Проверки: pnpm run sitemap:write-static; pnpm run sitemap:check; pnpm run typecheck; pnpm run seo:check; pnpm run build; production /sitemap.xml 200, X-Sitemap-Source: static, 108 URL.
Деплой: выполнен командой ssh -i C:/Users/User/.ssh/timeweb_kuhni_ed25519 root@5.42.108.140 "bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work".
Production URL: https://kuhni.minsk.by/sitemap.xml
GSC/Яндекс: GSC недоступен текущему аккаунту; в Яндекс.Вебмастере sitemap уже добавлен и найден через robots.txt, статус ok, 108 URL.
Осталось: добавить доступ к GSC или войти в аккаунт с правами на ресурс.
```

```text
Дата: 13.06.2026
Этап: 2. Local SEO, NAP, schema доверия
Что изменено: footer, /contacts, llms.txt и LocalBusiness schema разводят производственный/юридический адрес Борисов и зону обслуживания Минск/Беларусь; исправлен provider address на geo-страницах.
Проверки: typecheck, seo:check, build; production DOM: / и /contacts содержат Борисов и LocalBusiness.
Деплой: выполнен в commit 655bb61.
Production URL: https://kuhni.minsk.by/contacts, https://kuhni.minsk.by/locations/minsk
GSC/Яндекс: /contacts и /locations/minsk отправлены в Яндекс.Вебмастере на переобход 13.06.2026 23:10, статус "В очереди"; GSC недоступен текущему аккаунту.
Осталось: сверить NAP в Google Business Profile и Яндекс.Бизнес вручную.
```

```text
Дата: 13.06.2026
Этап: 3. Отзывы и review schema
Что изменено: убран Product/AggregateRating с главной; добавлен общий фильтр содержательных отзывов для главной и JSON-LD; /reviews использует LocalBusiness AggregateRating/Review только по качественным опубликованным отзывам.
Проверки: typecheck, build; production DOM: главная без Product schema, /reviews содержит AggregateRating и Review schema.
Деплой: выполнен в commit 655bb61.
Production URL: https://kuhni.minsk.by/, https://kuhni.minsk.by/reviews
GSC/Яндекс: GSC недоступен текущему аккаунту; Яндекс переобход для изменённых local pages отправлен.
Осталось: валидировать /reviews через Schema.org Validator/Rich Results Test и продолжать сбор реальных отзывов.
```

```text
Дата: 14.06.2026
Этап: 4. Скорость, Core Web Vitals и mobile UX
Что изменено: проверены hero/контентные изображения и ключевые money-pages; новых тяжёлых изображений не добавлялось; подтверждено, что видимые изображения оптимизированы и нет broken/oversized refs.
Проверки: pnpm run images:audit; pnpm run typecheck; pnpm run seo:check; pnpm run sitemap:check; pnpm run build; Browser local production-like QA на /, /catalog, /catalog/uglovye-kuhni, /prices, /locations/minsk: brokenImages=0, horizontalOverflow=false; LHCI mobile по /, /catalog/uglovye-kuhni, /locations/minsk, /prices, /blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026: performance 100, LCP 490-885 мс, TBT 0, CLS низкий.
Деплой: выполнен командой ssh -i C:/Users/User/.ssh/timeweb_kuhni_ed25519 root@5.42.108.140 "bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work".
Production URL: https://kuhni.minsk.by/, https://kuhni.minsk.by/catalog/uglovye-kuhni, https://kuhni.minsk.by/locations/minsk, https://kuhni.minsk.by/prices
GSC/Яндекс: URL не отправлялись в этом этапе; требуется отдельный browser-login для этапа 11.
Осталось: после деплоя повторить PageSpeed/PR-CY mobile speed на production и зафиксировать внешний показатель.
```

```text
Дата: 14.06.2026
Этап: 5. Money-pages
Что изменено: на /catalog добавлен блок проверки перед заказом кухни; на /catalog/[slug] добавлен блок подтверждения сметы, договора, сроков и производства под размеры; на /prices добавлены факторы расчёта, FAQ и FAQPage schema.
Проверки: pnpm run typecheck; pnpm run seo:check; pnpm run sitemap:check; pnpm run build; production-like HTTP 200 для /, /catalog, /catalog/uglovye-kuhni, /catalog/pryamye-kuhni, /catalog/p-obraznye-kuhni, /catalog/kuhni-s-ostrovom, /catalog/malenkie-kuhni, /catalog/kuhni-do-potolka, /prices, /locations/minsk, /blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026, /sitemap.xml, /robots.txt; Browser QA подтвердил видимость новых блоков.
Деплой: выполнен командой ssh -i C:/Users/User/.ssh/timeweb_kuhni_ed25519 root@5.42.108.140 "bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work".
Production URL: https://kuhni.minsk.by/catalog, https://kuhni.minsk.by/catalog/uglovye-kuhni, https://kuhni.minsk.by/prices, https://kuhni.minsk.by/locations/minsk
GSC/Яндекс: не отправлялись из-за отсутствия активной browser-авторизации; выполнить в этапе 11.
Осталось: по данным GSC/PR-CY отдельно подготовить CTR-варианты title/description для страниц с низким CTR и продолжить усиление `/catalog/kuhni-do-potolka`, материалов и калькулятора.
```

```text
Дата: 14.06.2026
Этап: 12. Еженедельный SEO-контроль
Что изменено: создан docs/audit/2026-06-14-stage-15-weekly-seo-control.md; подтверждены production robots/sitemap/canonical/H1 и свежий PR-CY baseline по 94 запросам.
Проверки: production /robots.txt 200; /sitemap.xml 200, X-Sitemap-Source: static, 108 URL; ключевые URL 200 и indexable; PR-CY live по адресу https://a.pr-cy.ru/keywords/overview/kuhni.minsk.by.
Деплой: не требовался.
Production URL: https://kuhni.minsk.by/, https://kuhni.minsk.by/catalog, https://kuhni.minsk.by/locations/minskaya-oblast, https://kuhni.minsk.by/prices
GSC/Яндекс: в browser-сессии 14.06.2026 не было активной авторизации; GSC открыл public about page, Яндекс Вебмастер редиректил на login, поэтому свежий live-status индексации и переобхода в этом проходе не обновлен.
Осталось: повторить weekly-check после входа в GSC и Яндекс через браузер; дожать /catalog/kuhni-do-potolka, /materials/mdf-emal, /materials/plastik-hpl, /calculator и geo-страницы 11-22.
```
