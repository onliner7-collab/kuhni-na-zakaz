# Этапы 11-15: финальная SEO-проверка, деплой, индексация и мониторинг

Дата: 2026-06-07  
Сайт: `https://kuhni.minsk.by`  
Ветка деплоя: `work`  
ТЗ: `docs/audit/2026-06-06-seo-finalization-stage-tz.md`

## Этап 11. Schema.org

Проверены production HTML и JSON-LD для ключевых типов страниц:

- главная `/`;
- каталог `/catalog`;
- категории `/catalog/uglovye-kuhni`, `/catalog/pryamye-kuhni`, `/catalog/p-obraznye-kuhni`, `/catalog/malenkie-kuhni`, `/catalog/kuhni-do-potolka`, `/catalog/kuhni-s-ostrovom`;
- Минск и Минская область;
- P0/P1 города Минской области;
- `/reviews`;
- `/prices`;
- 11 SEO-статей блога.

Итог:

- JSON-LD на проверенных страницах парсится без ошибок `INVALID_JSONLD`;
- главная использует `WebSite`, `LocalBusiness`, `BreadcrumbList`, `Product`, `FAQPage`;
- каталог использует `BreadcrumbList`, `FAQPage`;
- категории используют `BreadcrumbList`, `Product`, `FAQPage`;
- городские страницы используют `BreadcrumbList`, `FAQPage`, `Service`;
- блоговые статьи используют `BreadcrumbList`, `BlogPosting`;
- `/reviews` использует `BreadcrumbList`, `LocalBusiness`;
- `/prices` использует `BreadcrumbList`, `Service`;
- FAQ schema обнаружена на страницах, где FAQ есть в видимом контенте;
- ложные рейтинги или отзывы дополнительно не добавлялись.

Наблюдение для следующего технического прохода: Яндекс.Вебмастер в истории обхода еще показывает старые 404 URL вида `/https:/kuhni.minsk.by/images/blog/...webp`. В текущем коде соответствующие markdown-ссылки уже относительные `/images/...`, поэтому это похоже на след старой версии и требует контроля после нового обхода.

## Этап 12. Техническая проверка

Локальные проверки:

- `pnpm --filter @workspace/kuhni-na-zakaz typecheck` — успешно;
- `pnpm --filter @workspace/kuhni-na-zakaz sitemap:check` — успешно, 83 URL; есть ожидаемые локальные Prisma-предупреждения из-за недоступной БД `127.0.0.1:5434`, генератор использовал fallback;
- `pnpm --filter @workspace/kuhni-na-zakaz build` — успешно; локальная сборка с fallback-данными, так как локальная БД недоступна.

Production-проверки:

- `/sitemap.xml` — `200`;
- `/robots.txt` — `200`, содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`;
- 34 ключевых URL из главной, каталога, категорий, P0 и P1 городов найдены в sitemap;
- admin/API/private пути не найдены в sitemap по проверенному генератору;
- повторная последовательная проверка URL после деплоя подтвердила `200`, canonical, H1 и schema для страниц, которые временно таймаутились сразу после рестарта.

Playwright production smoke:

- до деплоя: `30 passed`;
- после деплоя: `29 passed`, один временный `ERR_CONNECTION_TIMED_OUT` на `/locations/berezino`;
- повторная точечная проверка `/locations/berezino` сразу после этого вернула `200`, canonical и schema.

## Этап 13. Деплой

Выполнен серверный deploy на `5.42.108.140` через `deploy/scripts/update-production.sh work`.

Что прошло:

- `git fetch/checkout/pull` — ветка `work` актуальна;
- `pnpm install --frozen-lockfile` — успешно;
- `prisma generate` и `db:push` — успешно, production DB синхронизирована;
- импорт подготовленных фото и портфолио — успешно;
- `sitemap:write-static` — записано 108 URL в `public/sitemap-static.xml`;
- синхронизация NAP — успешно;
- production `next build` — успешно, 173 страницы.

SSH-соединение оборвалось после build до автоматического рестарта, поэтому рестарт выполнен отдельно:

- `systemctl restart kuhni-na-zakaz` — успешно;
- service активен с `2026-06-07 06:42:18 UTC`;
- Next.js стартовал на `127.0.0.1:3001`.

## Этап 14. Google Search Console и Яндекс.Вебмастер

### Google Search Console

Ресурс открыт во встроенном браузере: `sc-domain:kuhni.minsk.by`.

Sitemap:

- `https://kuhni.minsk.by/sitemap.xml` уже добавлен;
- статус: `Успешно`;
- последняя обработка: `6 июн. 2026 г.`;
- выявлено страниц: `104`.

URL Inspection:

| URL | Статус | Действие |
|---|---|---|
| `https://kuhni.minsk.by/catalog` | URL есть в индексе Google; HTTPS, breadcrumbs и FAQ без ошибок | Запрос индексирования отправлен, GSC показал: `URL добавлен в приоритетную очередь сканирования` |

Оставшиеся URL в GSC не отправлялись повторно в этом проходе, чтобы не расходовать лимит на десятки адресов после уже принятого sitemap. Для Google основной массовый сигнал сейчас — обновленный sitemap; ручной URL Inspection стоит продолжать точечно для страниц, где GSC показывает `URL неизвестен Google` или важное изменение сниппета.

### Яндекс.Вебмастер

Ресурс открыт во встроенном браузере: `https://kuhni.minsk.by`.

Сводка:

- ошибок сайта нет;
- есть 1 рекомендация;
- еще видны старые дубли: 19 title и 31 description;
- в истории обхода уже видны новые блоговые URL от 6 июня 2026.

Переобход:

- 17 P0 URL и категорий уже были отправлены 6 июня 2026 20:45 и отображаются как `Заявка обработана`;
- 28 дополнительных URL отправлены 7 июня 2026 09:51, статус `В очереди`;
- после отправки Яндекс показал остаток дневного лимита: `122` адреса.

Дополнительно отправлены:

- P1 города: `/locations/dzerzhinsk`, `/locations/zaslavl`, `/locations/logoisk`, `/locations/vileyka`, `/locations/nesvizh`, `/locations/berezino`, `/locations/volozhin`, `/locations/stolbtsy`, `/locations/uzda`, `/locations/cherven`, `/locations/maryina-gorka`, `/locations/kletsk`, `/locations/kopyl`, `/locations/krupki`, `/locations/lyuban`, `/locations/myadel`, `/locations/starye-dorogi`;
- новые статьи: `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026`, `/blog/materialy-dlya-kuhni-ldsp-mdf-emal-hpl-shpon`, `/blog/uglovaya-kuhnya-razmery-planirovka`, `/blog/kuhnya-do-potolka-plyusy-minusy-cena`, `/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat`, `/blog/kak-podgotovitsya-k-zameru-kuhni`, `/blog/oshibki-pri-zakaze-kuhni-15-punktov-pered-dogovorom`, `/blog/kuhnya-dlya-chastnogo-doma-planirovka-hranenie-tehnika`, `/blog/kuhnya-na-zakaz-ili-gotovaya-chto-vygodnee`, `/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera`, `/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh`.

Важно: отправка в GSC и Яндекс.Вебмастер не гарантирует индексацию или рост позиций. Зафиксированы только факты доступности, наличия sitemap и постановки URL в очередь.

## Этап 15. PixelPlus и контроль роста

Группы мониторинга зафиксированы в `docs/audit/2026-06-06-stage-14-15-indexing-and-pixelplus-monitoring.md`:

- главная услуга;
- купить кухню Минск;
- купить кухню + города;
- купить + тип кухни;
- цены;
- материалы;
- блог/информационные.

Посадочные URL соответствуют финальной карте `docs/audit/2026-06-06-stage-1-final-keyword-priority-map.md`.

Стартовые позиции в PixelPlus в этом проходе не выгружены: в проекте не найден актуальный экспорт PixelPlus с позициями или доступ к кабинету. Вместо этого подготовлен рабочий baseline-контур:

- дата следующего контроля: `2026-06-14`;
- минимальный отчет: Google и Яндекс позиции по P0/P1 запросам, ранжирующаяся страница, целевая посадочная, изменение за неделю, решение;
- первые страницы для следующего цикла: URL с остаточными дублями в Яндекс.Вебмастере, страницы с 404 image-path следами `/https:/kuhni...`, запросы на позициях 4-6, 11-15 и 16-25.

Для полного закрытия критерия PixelPlus нужно импортировать или снять свежий экспорт позиций из PixelPlus после обновления индекса и заполнить таблицу стартовых значений.
