# Еженедельный SEO-контроль: этап 15

Дата: 2026-07-19  
Сайт: `https://kuhni.minsk.by`  
Основа: `docs/audit/2026-06-07-stage-11-15-final-seo-report.md`, `docs/audit/2026-06-06-stage-14-15-indexing-and-pixelplus-monitoring.md`, `docs/audit/2026-07-12-stage-15-weekly-seo-control.md`

## 1. Production: robots, sitemap, ключевые URL

Проверено напрямую на production 19 июля 2026:

- `https://kuhni.minsk.by/robots.txt` отвечает `200`.
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

Вывод: по public production базовые технические сигналы остаются стабильными. `robots.txt`, `sitemap.xml`, canonical, `index, follow` и базовые redirect-правила на ключевых страницах не сломаны.

## 2. Google Search Console

Ресурс открыт во встроенном браузере: `sc-domain:kuhni.minsk.by`.

Что подтверждено live в панели 19 июля 2026:

- overview показывает `61` клик в веб-поиске;
- в блоке индексирования: `123` страницы проиндексированы, `62` не проиндексированы;
- в HTTPS-отчете: `12` HTTPS-страниц и `0` проблемных;
- в улучшениях `Строки навигации`: `12` страниц без ошибок, `0` ошибок;
- в shopping-отчетах `Описания товара` и `Данные о товарах продавца`: по `3` страницы без ошибок, `0` ошибок;
- `https://kuhni.minsk.by/sitemap.xml` в разделе `Файлы Sitemap` имеет статус `Успешно`;
- дата отправки sitemap в текущей карточке: `22 июн. 2026 г.`;
- дата последней обработки sitemap в GSC: `19 июл. 2026 г.`;
- количество выявленных страниц в sitemap: `112`.

Точечная URL Inspection в той же browser-сессии:

| URL | Статус | Дополнительно |
|---|---|---|
| `https://kuhni.minsk.by/catalog` | `URL есть в индексе Google` | `HTTPS` ок, `Строки навигации` без ошибок |
| `https://kuhni.minsk.by/locations/minskaya-oblast` | `URL есть в индексе Google` | `HTTPS` ок, `Строки навигации` без ошибок |
| `https://kuhni.minsk.by/calculator` | `URL есть в индексе Google` | `HTTPS` ок, `Строки навигации` без ошибок |

В этом weekly-проходе новые ручные запросы индексирования не отправлялись. Отчет фиксирует текущее состояние панели и URL Inspection, но не обещает гарантированную переиндексацию или рост позиций.

## 3. Яндекс Вебмастер

Ресурс открыт во встроенном браузере: `https://kuhni.minsk.by`.

Что подтверждено live в панели 19 июля 2026:

- на сводке: `Ошибок нет`;
- остается `1` рекомендация;
- в блоке дублей указано, что большого количества дублирующихся `title` и `description` на сайте не найдено;
- в `Обновления поиска до 19 июля` за период `12–18 июля 2026` видно `0` добавленных и `0` удаленных страниц;
- в последних изменениях продолжают всплывать неканонические тестовые URL, включая `/?codex=...`, `/?codex_scroll_check=...`, `/?codex_scroll_visible_images=...`, а также ` /catalog/uglovye-kuhni?stage5=1`;
- в `Истории обхода` в последних строках остаются свежие `404` для ` /styles/temnye-kuhni` и ` /styles/zelenye-kuhni`.

Раздел `Файлы Sitemap`:

- `https://kuhni.minsk.by/sitemap.xml` присутствует в добавленных вручную;
- этот же sitemap найден через `robots.txt`;
- статус в обоих блоках: `ок`;
- последняя загрузка: `17.07.2026, 6:12`;
- число ссылок в файле: `112`.

Раздел `Переобход страниц`:

- таблица содержит `125` ранее отправленных URL;
- по видимым адресам статус — `Заявка обработана`;
- это подтверждается как для свежей июньской волны portfolio URL (`22.06.2026 17:18`), так и для money-pages и geo-страниц, отправленных ранее (`/catalog`, `/prices`, `/locations/minsk`, `/locations/minskaya-oblast`, `/locations/zhodino`, `/catalog/uglovye-kuhni`, `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026`);
- в списке по-прежнему остаются старые мусорные следы со статусом `Заявка обработана`:
  - `/https:/kuhni.minsk.by/images/blog/...webp`
  - `/preload`
  - `/locations/preload`
  - `/catalog/preload`

Вывод: Яндекс-панель подтверждает, что sitemap на `112` URL загружается нормально, массовые дубли не вернулись, а прежние заявки на переобход обработаны. Незакрытые сигналы сейчас связаны не с sitemap, а с мусорными querystring-следами и свежими `404` по style-URL в истории обхода.

## 4. PixelPlus / позиции / data-gap

Свежий weekly-export позиций из PixelPlus в проекте не найден.

Что подтверждено локально:

- в проекте по-прежнему есть baseline-документы и карты мониторинга:
  - `docs/audit/2026-06-05-pixelplus-keyword-map.md`
  - `docs/audit/2026-06-06-stage-14-15-indexing-and-pixelplus-monitoring.md`
  - `docs/audit/2026-06-07-pixelplus-monitoring-setup.md`
- нового `.csv`, `.xlsx` или `.xls` файла со свежим weekly-съемом позиций PixelPlus в рабочем проекте не выявлено.

Поэтому в этом weekly-отчете:

- нет нового keyword-by-keyword positional snapshot из PixelPlus;
- в качестве доступных live-сигналов по поиску зафиксированы только агрегаты GSC и текущие статусы индексации/переобхода в GSC и Яндекс Вебмастере.

Важно: отсутствие свежего PixelPlus-экспорта означает, что weekly delta по P0/P1 кластерам в разрезе позиций остается незакрытой.

## 5. Что брать в следующий SEO-цикл

Приоритет следующего цикла:

1. Очистка неканонических тестовых URL в сигналах Яндекса  
Причина: в сводке и истории изменений еще всплывают `/?codex=...`, `/?codex_scroll_check=...`, `/?codex_scroll_visible_images=...`, а также query-URL вида `/catalog/uglovye-kuhni?stage5=1`.

2. Проверка и разбор `404` по style-URL  
Причина: в истории обхода Яндекс показывает свежие `404` для `/styles/temnye-kuhni` и `/styles/zelenye-kuhni`; нужно понять, это легаси-ссылки, остатки перелинковки или внешние заходы, требующие redirect/очистки.

3. `/catalog/kuhni-do-potolka`  
Причина: страница технически стабильна и остается подходящим кандидатом для следующего on-page/CTR цикла.

4. `/materials/mdf-emal` и `/materials/plastik-hpl`  
Причина: страницы живые, self-canonical, indexable и подходят для следующего усиления сниппета и внутренней перелинковки.

5. `/calculator` и `/design-proekt-kuhni`  
Причина: `/calculator` уже подтвержден как indexable в production и GSC, а старый `/kitchen-configurator` корректно ведет на `/design-proekt-kuhni`; это важный коммерческий intent-кластер для следующего прохода.

6. Geo-shortlist: `/locations/fanipol`, `/locations/logoisk`, `/locations/smolevichi`, `/locations/molodechno`  
Причина: страницы стабильно доступны и индексируемы, но без свежего positional export по ним нельзя честно снять недельный rank-delta.

7. Fresh export из PixelPlus  
Причина: без него этап 15 остается неполным именно по weekly-позиционному мониторингу, даже при наличии актуальных данных индексации и переобхода.

## 6. Резюме weekly-контроля

На 19 июля 2026 production у `https://kuhni.minsk.by` технически стабилен: `robots.txt` и `sitemap.xml` доступны, в sitemap `112` URL, ключевые money-pages и shortlist следующего цикла отвечают `200`, сохраняют self-canonical и `index, follow`, а базовые redirect-правила работают корректно.

Через browser-login удалось обновить оба panel baseline. В GSC `sitemap.xml` обработан `19 июля 2026`, имеет статус `Успешно` и `112` выявленных страниц; в overview видно `123` indexed / `62` not indexed, а точечная URL Inspection подтверждает, что `catalog`, `minskaya-oblast` и `calculator` уже есть в индексе Google. В Яндекс Вебмастере sitemap также загружается на `112` URL со статусом `ок`, массовые дубли `title/description` не отображаются, а видимые заявки на переобход имеют статус `Заявка обработана`.

Главные незакрытые точки сейчас связаны с мусорными query-параметрами и следами техпроверок в Яндекс Вебмастере, а также со свежими `404` по `style`-URL и отсутствием нового PixelPlus-экспорта. Этот отчет фиксирует только подтвержденные факты production и панелей и не обещает гарантированную индексацию, переиндексацию или рост позиций.
