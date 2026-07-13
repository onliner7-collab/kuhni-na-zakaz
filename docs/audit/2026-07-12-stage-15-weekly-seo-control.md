# Еженедельный SEO-контроль: этап 15

Дата: 2026-07-12  
Сайт: `https://kuhni.minsk.by`  
Основа: `docs/audit/2026-06-07-stage-11-15-final-seo-report.md`, `docs/audit/2026-06-06-stage-14-15-indexing-and-pixelplus-monitoring.md`, `docs/audit/2026-06-21-stage-15-weekly-seo-control.md`

## 1. Production: robots, sitemap, ключевые URL

Проверено напрямую на production 12 июля 2026:

- `https://kuhni.minsk.by/robots.txt` отвечает `200` и по-прежнему содержит:
  - `Allow: /`
  - `Disallow: /admin/`
  - `Disallow: /admin/imports/`
  - `Disallow: /login/`
  - `Disallow: /api/`
  - `Disallow: /kapi/`
  - `Disallow: /search/`
  - `Disallow: /thanks/`
  - `Sitemap: https://kuhni.minsk.by/sitemap.xml`
- `https://kuhni.minsk.by/sitemap.xml` отвечает `200`, текущее число URL: `112`.
- В sitemap подтверждено наличие ключевых URL этапа 15:
  - `/`
  - `/catalog`
  - `/locations/minsk`
  - `/locations/minskaya-oblast`
  - `/catalog/uglovye-kuhni`
  - `/catalog/pryamye-kuhni`
  - `/catalog/p-obraznye-kuhni`
  - `/catalog/malenkie-kuhni`
  - `/catalog/kuhni-do-potolka`
  - `/catalog/kuhni-s-ostrovom`
  - `/locations/borisov`
  - `/locations/zhodino`
  - `/locations/molodechno`
  - `/locations/soligorsk`
  - `/locations/slutsk`
  - `/locations/fanipol`
  - `/locations/smolevichi`
  - `/design-proekt-kuhni`

Точечная проверка indexable URL и страниц следующего цикла:

| URL | HTTP | Canonical | Robots | H1 |
|---|---:|---|---|---|
| `https://kuhni.minsk.by/` | `200` | `https://kuhni.minsk.by` | `index, follow` | `Купить кухню в Минске под размер, с проектом и монтажом` |
| `https://kuhni.minsk.by/catalog` | `200` | `https://kuhni.minsk.by/catalog` | `index, follow` | `Каталог кухонь на заказ: виды, формы и гарнитуры` |
| `https://kuhni.minsk.by/locations/minsk` | `200` | `https://kuhni.minsk.by/locations/minsk` | `index, follow` | `Купить кухню на заказ в Минске под размер` |
| `https://kuhni.minsk.by/locations/minskaya-oblast` | `200` | `https://kuhni.minsk.by/locations/minskaya-oblast` | `index, follow` | `Купить кухню в Минской области под размер, с доставкой и монтажом` |
| `https://kuhni.minsk.by/catalog/kuhni-do-potolka` | `200` | `https://kuhni.minsk.by/catalog/kuhni-do-potolka` | `index, follow` | `Купить кухню до потолка на заказ в Минске` |
| `https://kuhni.minsk.by/materials/mdf-emal` | `200` | `https://kuhni.minsk.by/materials/mdf-emal` | `index, follow` | `Фасады МДФ эмаль для аккуратной кухни в нужном цвете` |
| `https://kuhni.minsk.by/materials/plastik-hpl` | `200` | `https://kuhni.minsk.by/materials/plastik-hpl` | `index, follow` | `Кухни с пластиковыми фасадами HPL` |
| `https://kuhni.minsk.by/calculator` | `200` | `https://kuhni.minsk.by/calculator` | `index, follow` | `Рассчитать кухню онлайн` |
| `https://kuhni.minsk.by/locations/fanipol` | `200` | `https://kuhni.minsk.by/locations/fanipol` | `index, follow` | `Кухни на заказ в Фаниполе` |
| `https://kuhni.minsk.by/locations/logoisk` | `200` | `https://kuhni.minsk.by/locations/logoisk` | `index, follow` | `Кухни на заказ в Логойске` |
| `https://kuhni.minsk.by/locations/smolevichi` | `200` | `https://kuhni.minsk.by/locations/smolevichi` | `index, follow` | `Кухни на заказ в Смолевичах` |
| `https://kuhni.minsk.by/locations/molodechno` | `200` | `https://kuhni.minsk.by/locations/molodechno` | `index, follow` | `Кухни на заказ в Молодечно` |

Redirect hygiene:

- `http://kuhni.minsk.by/catalog/uglovye-kuhni` -> `301` -> `https://kuhni.minsk.by/catalog/uglovye-kuhni`
- `https://www.kuhni.minsk.by/catalog/uglovye-kuhni` -> `301` -> `https://kuhni.minsk.by/catalog/uglovye-kuhni`
- `https://kuhni.minsk.by/locations/zhodzina` -> `301` -> `https://kuhni.minsk.by/locations/zhodino`
- `https://kuhni.minsk.by/kitchen-configurator` -> `301` -> `https://kuhni.minsk.by/design-proekt-kuhni`

Вывод: по public production базовые сигналы остаются стабильными. `robots.txt`, `sitemap.xml`, canonical и `index, follow` на money-pages и следующих SEO-кандидатах не сломаны.

## 2. Google Search Console

Ресурс открыт во встроенном браузере: `sc-domain:kuhni.minsk.by`.

Что подтверждено live в панели 12 июля 2026:

- overview показывает `53` клика, `5.48 тыс.` показов, `1 %` CTR и среднюю позицию `26.8` за выбранный диапазон `3 месяца`;
- индексирование на overview: `123` страницы проиндексированы, `61` не проиндексирована;
- `https://kuhni.minsk.by/sitemap.xml` в разделе `Файлы Sitemap` имеет статус `Успешно`;
- дата последней обработки sitemap в GSC: `12 июл. 2026 г.`;
- количество выявленных страниц в sitemap: `112`;
- enhancement `Строки навигации`: `9` страниц без ошибок, `0` ошибок;
- shopping-отчеты `Описания товара` и `Данные о товарах продавца`: по `2` страницы без ошибок, `0` ошибок;
- HTTPS-отчет показывает `9` HTTPS-страниц и `0` проблемных.

Ограничение текущего прохода:

- из этой browser-сессии зафиксирован live-status overview/performance/sitemap, но не проводилась новая массовая отправка URL через URL Inspection;
- поэтому в этом weekly-отчете не утверждается, что отдельные страницы уже гарантированно переиндексированы Google.

Вывод: по сравнению с июньским baseline sitemap в GSC синхронизирован уже на `112` URL и обработан `12 июля 2026`, а coverage вырос до `123 indexed / 61 not indexed`. Это лучшее подтверждаемое состояние панели на момент этого прохода, но не гарантия роста по конкретным запросам.

## 3. Яндекс Вебмастер

Ресурс открыт во встроенном браузере: `https://kuhni.minsk.by`.

Что подтверждено live в панели 12 июля 2026:

- на сводке: `Ошибок и рекомендаций нет`;
- в разделе `Заголовки и описания` зафиксировано состояние `Всё в порядке`, массовые дубли `title` и `description` больше не отображаются;
- в разделе `Файлы Sitemap` `https://kuhni.minsk.by/sitemap.xml` присутствует:
  - в добавленных вручную;
  - в sitemap, найденных через `robots.txt`;
  - статус: `ок`;
  - последняя загрузка: `09.07.2026, 18:18`;
  - число ссылок в файле: `112`;
- в `Страницы в поиске` за период `3–12 июля 2026` видно `3` добавленных и `0` удаленных страниц;
- в списке последних изменений есть канонические страницы `/materials`, `/catalog`, `/locations/dzerzhinsk`, `/locations/starye-dorogi`, `/locations/stolbtsy`, `/locations/berezino`, `/locations/gomel`, `/locations/kletsk`, `/locations/krupki`, `/locations/myadel`;
- одновременно Яндекс все еще показывает часть спорных состояний:
  - `/locations/zhodino` — `Канонический адрес не указан`;
  - `/locations/dzerzhinsk` и `/locations/starye-dorogi` встречаются также как `Малоценная или маловостребованная страница`;
  - неканонические querystring URL от техпроверок и Метрики (`/?codex=...`, `/?qa=...`, `/?links_check=...`, `/prices?style=loft`) попадают в историю изменений как неканонические;
- в `Переобход страниц` по отправленным URL виден статус `Заявка обработана`, в том числе для:
  - `/catalog`
  - `/prices`
  - `/locations`
  - `/locations/minsk`
  - `/locations/minskaya-oblast`
  - `/locations/borisov`
  - `/locations/zhodino`
  - `/catalog/uglovye-kuhni`
  - `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026`
- в очереди переобхода остаются и старые мусорные/служебные следы:
  - `/https:/kuhni.minsk.by/images/blog/...webp`
  - `/preload`
  - `/locations/preload`
  - `/catalog/preload`

Вывод: Яндекс-панель сейчас заметно чище, чем в июньском baseline: массовые дубли `title/description` исчезли, sitemap на `112` URL загружен корректно, а старые batches переобхода имеют `Заявка обработана`. Но у Яндекса еще остаются low-value сигналы по части geo-страниц и мусорные неканонические следы.

## 4. PixelPlus / позиции / data-gap

Свежий weekly-export позиций из PixelPlus в проекте не найден.

Что подтверждено в рабочей директории:

- найдены только baseline-документы по настройке мониторинга:
  - `docs/audit/2026-06-06-stage-14-15-indexing-and-pixelplus-monitoring.md`
  - `docs/audit/2026-06-05-pixelplus-keyword-map.md`
  - `docs/audit/2026-06-07-pixelplus-monitoring-setup.md`
- нового `.csv` / `.xlsx` / `.xls` экспорта с weekly-позициями PixelPlus в проекте не выявлено.

Поэтому в этом отчете:

- нет честного свежего keyword-by-keyword среза позиций из PixelPlus;
- как доступный rank-signal зафиксированы только агрегаты GSC: `53` клика, `5.48 тыс.` показов, `1 %` CTR, средняя позиция `26.8` за `3 месяца`.

Важно: эти агрегаты не заменяют полноценный weekly-export PixelPlus и не позволяют корректно заполнить таблицу изменений по каждой группе запросов.

## 5. Что брать в следующий SEO-цикл

Приоритет следующего цикла:

1. `/locations/zhodino`
Причина: Яндекс сейчас показывает состояние `Канонический адрес не указан`, хотя production canonical у страницы есть и redirect с `/locations/zhodzina` работает.

2. `/locations/dzerzhinsk` и `/locations/starye-dorogi`
Причина: эти страницы одновременно видны как канонические и как `Малоценная или маловостребованная страница` в Яндекс Вебмастере.

3. Очистка техследов и неканонических URL
Причина: в Яндексе все еще всплывают `/?codex=...`, `/?qa=...`, `/?links_check=...`, `/prices?style=loft`, а в переобходах живут старые `/https:/kuhni...webp` и `*/preload`.

4. `/catalog/kuhni-do-potolka`
Причина: это сохраненный из прошлых weekly-контролей коммерческий кандидат следующего дожима, а технически страница остается стабильной и indexable.

5. `/materials/mdf-emal` и `/materials/plastik-hpl`
Причина: страницы живые, self-canonical и пригодны для следующего on-page/CTR прохода, но без свежего PixelPlus-экспорта их rank-state нужно переснять отдельно.

6. `/calculator`
Причина: URL indexable и self-canonical, а redirect со старого `/kitchen-configurator` по-прежнему работает; страница остается важной для intent-кластера `цена/расчет`.

7. `/locations/fanipol`, `/locations/logoisk`, `/locations/smolevichi`, `/locations/molodechno`
Причина: это прежний shortlist из weekly-бейзлайна, который still-valid как набор для следующей локальной итерации после прояснения panel-state по geo.

8. Fresh export из PixelPlus
Причина: без него нельзя честно оценить недельное изменение по P0/P1 кластерам и закрыть этап 15 по позиционному мониторингу.

## 6. Резюме weekly-контроля

На 12 июля 2026 production у `https://kuhni.minsk.by` технически стабилен: `robots.txt` и `sitemap.xml` доступны, в sitemap `112` URL, ключевые money-pages и shortlist следующего цикла отвечают `200`, сохраняют self-canonical и `index, follow`.

Через browser-login удалось обновить оба panel baseline. В GSC `sitemap.xml` обработан `12 июля 2026` со статусом `Успешно` и `112` выявленными страницами; overview показывает `123` indexed / `61` not indexed и агрегат `53` клика / `5.48 тыс.` показов / `1 %` CTR / средняя позиция `26.8` за `3 месяца`. В Яндекс Вебмастере sitemap также загружен на `112` URL, массовые дубли `title/description` больше не отображаются, а старые batches переобхода имеют статус `Заявка обработана`.

Главные незакрытые точки сейчас не в `robots` или sitemap, а в качестве geo-страниц и мусорных неканонических следах внутри Яндекс Вебмастера, плюс в отсутствии свежего PixelPlus-экспорта с недельными позициями. Этот отчет фиксирует только подтвержденные факты панели и production и не обещает гарантированную индексацию, переиндексацию или рост позиций.
