# Еженедельный SEO-контроль: этап 15

Дата: 2026-06-21  
Сайт: `https://kuhni.minsk.by`  
Основа: `docs/audit/2026-06-07-stage-11-15-final-seo-report.md`, `docs/audit/2026-06-06-stage-14-15-indexing-and-pixelplus-monitoring.md`, `docs/audit/2026-06-14-stage-15-weekly-seo-control.md`, `docs/audit/2026-06-13-top1-progress.md`

## 1. Production: robots, sitemap, ключевые URL

Проверено напрямую на production 21 июня 2026:

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
- `https://kuhni.minsk.by/sitemap.xml` отвечает `200`, заголовок `X-Sitemap-Source: static`, число URL: `112`.
- В sitemap подтверждено наличие ключевых URL:
  - `/`
  - `/catalog`
  - `/locations/minsk`
  - `/locations/minskaya-oblast`
  - `/catalog/uglovye-kuhni`
  - `/prices`
  - `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026`

Точечная проверка indexable URL:

| URL | HTTP | Canonical | Robots | H1 |
|---|---:|---|---|---|
| `https://kuhni.minsk.by/` | `200` | `https://kuhni.minsk.by` | `index, follow` | `Купить кухню, кухня на заказ в Минске под ваш размер, стиль и бюджет` |
| `https://kuhni.minsk.by/catalog` | `200` | `https://kuhni.minsk.by/catalog` | `index, follow` | `Купить кухню в Минске: каталог кухонь на заказ` |
| `https://kuhni.minsk.by/locations/minsk` | `200` | `https://kuhni.minsk.by/locations/minsk` | `index, follow` | `Купить кухню в Минске на заказ под размер` |
| `https://kuhni.minsk.by/locations/minskaya-oblast` | `200` | `https://kuhni.minsk.by/locations/minskaya-oblast` | `index, follow` | `Купить кухню в Минской области под размер, с доставкой и монтажом` |
| `https://kuhni.minsk.by/catalog/uglovye-kuhni` | `200` | `https://kuhni.minsk.by/catalog/uglovye-kuhni` | `index, follow` | `Купить угловую кухню на заказ в Минске` |
| `https://kuhni.minsk.by/prices` | `200` | `https://kuhni.minsk.by/prices` | `index, follow` | `Цены на кухни на заказ` |
| `https://kuhni.minsk.by/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026` | `200` | `https://kuhni.minsk.by/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026` | `index, follow` | `Сколько стоит кухня на заказ в Минске в 2026 году` |

Redirect hygiene остается корректной:

- `http://kuhni.minsk.by/catalog/uglovye-kuhni` -> `https://kuhni.minsk.by/catalog/uglovye-kuhni`
- `https://www.kuhni.minsk.by/catalog/uglovye-kuhni` -> `https://kuhni.minsk.by/catalog/uglovye-kuhni`
- `https://kuhni.minsk.by/locations/zhodzina` -> `https://kuhni.minsk.by/locations/zhodino`
- `https://kuhni.minsk.by/kitchen-configurator` -> `https://kuhni.minsk.by/design-proekt-kuhni`
- `https://kuhni.minsk.by/calculator` остается рабочим `200`

Вывод: на 21 июня 2026 production технически стабилен. Свежих проблем по `robots.txt`, `sitemap.xml`, canonical, `index, follow` и ключевым money-pages не выявлено. Отдельно важно, что sitemap уже не `108`, а `112` URL. Это согласуется с июньским добавлением новой волны blog URL после этапа 6.

## 2. Google Search Console и Яндекс Вебмастер

Правило этого проекта сохраняется: статусы индексации и переобхода считаются только через browser-вход, без обещаний индексации.

Что удалось подтвердить в текущем проходе:

- прямой переход на `https://search.google.com/search-console?resource_id=sc-domain:kuhni.minsk.by` в неавторизованном состоянии приводит на публичную страницу `https://search.google.com/search-console/about`;
- прямой переход на `https://webmaster.yandex.ru/site/https:kuhni.minsk.by:443/dashboard/` в неавторизованном состоянии приводит на `passport.yandex.ru`.

Отдельно: в этой сессии Codex browser surface не дала полноценный интерактивный вход, поэтому свежие live-статусы покрытия, sitemap processing и переобхода именно из авторизованных панелей на 21 июня 2026 не обновлены.

Последние подтвержденные baseline-данные, которые можно использовать только как предыдущую точку сравнения, но не как свежую проверку 21 июня:

- GSC на `2026-06-07`: sitemap `Успешно`, последняя обработка `7 июня 2026`, найдено `108` страниц; агрегат покрытия `98` indexed / `49` not indexed.
- Яндекс Вебмастер на `2026-06-07`: ошибок `0`, рекомендаций `1`, дубли `title` `19`, дубли `description` `31`.
- Яндекс переобходы от `2026-06-06` и `2026-06-07` ранее были зафиксированы как `Заявка обработана`.
- На `2026-06-13` дополнительно отправлялись `/contacts` и `/locations/minsk`, но свежий статус их обработки в текущем проходе не подтвержден.

Важно: этот weekly-отчет не делает вывод, что Google или Яндекс уже переиндексировали новые или отправленные URL. Зафиксированы только текущая доступность production и отсутствие свежего авторизованного browser-check в панелях.

## 3. PixelPlus / PR-CY / доступные позиции

Свежий экспорт позиций в проекте на 21 июня 2026 не найден.

Что найдено локально:

- `C:\Users\User\Desktop\kuhni-na-zakaz\.tmp\pixelplus-kuhni-keywords-groups.csv` от `2026-06-07 11:35` содержит только группы запросов и целевые URL, а не weekly-съём позиций.
- нового CSV/XLSX-экспорта с позициями Google/Яндекс после 14 июня в проекте не выявлено.

Что удалось проверить снаружи:

- маршрут `https://a.pr-cy.ru/keywords/overview/kuhni.minsk.by/` без активной авторизации сейчас отдает страницу регистрации, поэтому fresh live-съём из PR-CY в этом проходе не получен.

Последний подтвержденный baseline по rank-monitoring остается из weekly-прохода `2026-06-14`:

- `94` запроса в PR-CY;
- средняя позиция `81.55`;
- видимость `0.90`;
- practical near-top targets: `/catalog/kuhni-do-potolka`, `/materials/mdf-emal`, `/materials/plastik-hpl`, `/calculator`, `/locations/fanipol`, `/locations/logoisk`, `/locations/smolevichi`, `/locations/molodechno`.

Вывод: на 21 июня data-gap по позициям снова сохраняется. Свежих цифр из PixelPlus/PR-CY без входа нет, а в проекте отсутствует новый экспорт после baseline-проходов 7-14 июня.

## 4. Что брать в следующий SEO-цикл

Приоритет следующего цикла:

1. `GSC + Яндекс Вебмастер через browser-login`
Причина: после роста sitemap до `112` URL нужно снять свежий статус обработки sitemap и новых blog URL, а также подтвердить текущее состояние очереди переобхода.

2. Новые blog URL из июньской волны этапа 6
Причина: sitemap уже вырос до `112`, но свежий статус их индексации/переобхода не подтвержден.

3. `/catalog/kuhni-do-potolka`
Причина: это ближайший коммерческий кандидат на дожим в топ-10/топ-5 по последнему подтвержденному baseline.

4. `/materials/mdf-emal` и `/materials/plastik-hpl`
Причина: это ближайшие material pages из зоны `11-13`, где одно точное улучшение может дать вход в топ-10.

5. `/calculator`
Причина: страница живая и indexable, а по последнему baseline была в зоне mid-page и требовала дожима по сниппету, перелинковке и intent-fit.

6. `/locations/fanipol`, `/locations/logoisk`, `/locations/smolevichi`, `/locations/molodechno`
Причина: эти geo-страницы уже имели подтвержденный ranking baseline и остаются лучшими кандидатами следующей локальной итерации.

7. Дубли `title` и `description` из Яндекс baseline
Причина: последний подтвержденный след оставался `19` / `31`; без новой панели нельзя сказать, уменьшились ли дубли после июньских изменений.

## 5. Резюме weekly-контроля

На 21 июня 2026 production у `https://kuhni.minsk.by` технически стабилен: `robots.txt` и `sitemap.xml` доступны, static sitemap теперь содержит `112` URL, ключевые money-pages и базовая ценовая статья отвечают `200`, self-canonical и сохраняют `index, follow`.

Главное изменение недели по подтверждаемым production-данным: sitemap вырос с `108` до `112` URL. Это хороший сигнал полноты discovery, но не подтверждение индексации.

Свежий статус GSC, Яндекс Вебмастера и live-рангов в PixelPlus/PR-CY в этом проходе не обновлен из-за отсутствия доступной авторизованной сессии. Поэтому practical next step остается прежним: сначала browser-login и подтверждение live-панелей, затем следующий цикл по новым blog URL, `kuhni-do-potolka`, material pages, `/calculator` и ближним geo-страницам.

Этот отчет фиксирует только подтвержденные факты доступности, sitemap/canonical/indexability и отсутствие свежих авторизованных данных. Он не обещает гарантированную индексацию, переиндексацию или рост позиций.
