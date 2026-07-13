# Еженедельный SEO-контроль: этап 15

Дата: 2026-06-14  
Сайт: `https://kuhni.minsk.by`  
Основа: `docs/audit/2026-06-07-stage-11-15-final-seo-report.md`, `docs/audit/2026-06-06-stage-14-15-indexing-and-pixelplus-monitoring.md`, `docs/audit/2026-06-13-top1-progress.md`

## 1. Production: robots, sitemap, ключевые URL

Проверено напрямую на production 14 июня 2026:

- `https://kuhni.minsk.by/robots.txt` отвечает `200` и содержит:
  - `Allow: /`
  - `Disallow: /admin/`
  - `Disallow: /admin/imports/`
  - `Disallow: /login/`
  - `Disallow: /api/`
  - `Disallow: /kapi/`
  - `Disallow: /search/`
  - `Disallow: /thanks/`
  - `Sitemap: https://kuhni.minsk.by/sitemap.xml`
- `https://kuhni.minsk.by/sitemap.xml` отвечает `200`, заголовок `X-Sitemap-Source: static`, число URL: `108`.
- В sitemap подтверждено наличие ключевых URL:
  - `/`
  - `/catalog`
  - `/locations/minsk`
  - `/locations/minskaya-oblast`
  - `/catalog/uglovye-kuhni`
  - `/prices`
  - `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026`
- Redirect hygiene остается корректной:
  - `http://kuhni.minsk.by/catalog/uglovye-kuhni` -> `301` -> `https://kuhni.minsk.by/catalog/uglovye-kuhni`
  - `https://www.kuhni.minsk.by/catalog/uglovye-kuhni` -> `301` -> `https://kuhni.minsk.by/catalog/uglovye-kuhni`

Точечная проверка indexable URL:

| URL | HTTP | Canonical | Robots | H1 |
|---|---:|---|---|---|
| `https://kuhni.minsk.by/` | `200` | `https://kuhni.minsk.by` | `index, follow` | `Кухни на заказ от производителя в Минске под ваш размер, стиль и бюджет` |
| `https://kuhni.minsk.by/catalog` | `200` | `https://kuhni.minsk.by/catalog` | `index, follow` | `Купить кухню в Минске: каталог кухонь на заказ` |
| `https://kuhni.minsk.by/locations/minsk` | `200` | `https://kuhni.minsk.by/locations/minsk` | `index, follow` | `Купить кухню в Минске на заказ под размер` |
| `https://kuhni.minsk.by/locations/minskaya-oblast` | `200` | `https://kuhni.minsk.by/locations/minskaya-oblast` | `index, follow` | `Купить кухню в Минской области с доставкой и монтажом` |
| `https://kuhni.minsk.by/catalog/uglovye-kuhni` | `200` | `https://kuhni.minsk.by/catalog/uglovye-kuhni` | `index, follow` | `Купить угловую кухню на заказ в Минске` |
| `https://kuhni.minsk.by/prices` | `200` | `https://kuhni.minsk.by/prices` | `index, follow` | `Цены на кухни на заказ` |
| `https://kuhni.minsk.by/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026` | `200` | `https://kuhni.minsk.by/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026` | `index, follow` | `Сколько стоит кухня на заказ в Минске в 2026 году` |

Вывод: на 14 июня 2026 базовые технические сигналы production остаются стабильными; свежих проблем по `robots.txt`, `sitemap.xml`, canonical, `index, follow` и главным URL не выявлено.

## 2. Google Search Console и Яндекс Вебмастер через браузер

Проверка выполнялась только через браузер, без fallback на API.

Факт текущей сессии:

- Google Search Console при переходе на ресурс `sc-domain:kuhni.minsk.by` открыл публичную страницу `https://search.google.com/search-console/about`, а не панель ресурса.
- Яндекс Вебмастер при переходе на `https://webmaster.yandex.ru/site/https:kuhni.minsk.by:443/dashboard/` перенаправил на страницу авторизации `passport.yandex.ru`.

Это означает, что в текущей browser-сессии на 14 июня 2026 не было активного входа в GSC и Яндекс.Вебмастер, поэтому свежие live-статусы индексации, покрытия и переобхода из этих двух панелей в этом weekly-проходе не обновлены.

Последние подтвержденные значения из локально сохраненных предыдущих browser-отчетов, которые остаются baseline, но не являются свежей проверкой 14 июня:

- GSC sitemap был успешен и обрабатывался `7 июня 2026`.
- Яндекс batches переобхода от `6` и `7 июня 2026` ранее были зафиксированы со статусом `Заявка обработана`.
- 13 июня 2026 по локальному progress-логу в Яндекс дополнительно отправлялись `/contacts` и `/locations/minsk`.

Важно: в этом отчете не делается вывод, что Google или Яндекс уже переиндексировали все отправленные URL. Зафиксирован только факт отсутствия активной browser-авторизации в текущем проходе.

## 3. PR-CY / мониторинг позиций

Актуальная аналитика открыта по новому адресу:

- `https://a.pr-cy.ru/keywords/overview/kuhni.minsk.by`

Что доступно в live-интерфейсе 14 июня 2026:

- запросов в мониторинге: `94`;
- средняя позиция: `81.55` (`+0.01`);
- видимость: `0.90` (`+0.9`).

Подтвержденные запросы с уже видимыми позициями в таблице:

- `кухня до потолка минск` -> `7` (было `8`);
- `кухня без ручек минск` -> `20` (было `25`);
- `калькулятор кухни минск` -> `16`;
- `кухня пластик hpl минск` -> `13` (было `12`);
- `мдф эмаль кухня минск` -> `11` (было `13`);
- `кухни на заказ жодино` -> `22` (было `21`);
- `кухни на заказ молодечно` -> `34` (было `32`);
- `кухни на заказ слуцк` -> `79` (было `77`);
- `кухни на заказ фаниполь` -> `16`;
- `кухни на заказ смолевичи` -> `22`;
- `кухни на заказ логойск` -> `15` (было `14`);
- `кухня до потолка плюсы минусы` -> `84` (было `88`);
- `как подготовиться к замеру кухни` -> `90` (было `89`);
- `как рассчитать бюджет кухни` -> `15` (было `13`);
- `кухни blum hettich gtv` -> `1` (было `2`);
- `сценарии кухни для семьи студии дома` -> `4`;
- `кухниby` -> `1`;
- `kuhni minsk by` -> `1`;
- `кухни бай минск` -> `5`;
- `кухниby отзывы` -> `8` (было `4`);
- `кухниby контакты` -> `1`;
- `кухниby портфолио` -> `1`.

Вкладка `URLs` показывает текущие заметные посадочные:

| URL | Ср. позиция | Запросов | Комментарий |
|---|---:|---:|---|
| `/` | `3.2` | `4` | главный брендовый/коммерческий охват |
| `/catalog/kuhni-do-potolka` | `7` | `1` | уже рядом с топ-5 |
| `/catalog/kuhni-bez-ruchek` | `20` | `1` | зона next-step оптимизации |
| `/calculator` | `16` | `1` | mid-page кластер, можно доталкивать в топ-10 |
| `/materials/plastik-hpl` | `13` | `1` | near top-10 |
| `/materials/mdf-emal` | `11` | `1` | near top-10 |
| `/locations/fanipol` | `16` | `1` | near top-10/top-15 |
| `/locations/logoisk` | `15` | `1` | near top-10/top-15 |
| `/locations/smolevichi` | `22` | `1` | вторая волна доработки geo |
| `/locations/molodechno` | `34` | `1` | требует усиления |

Отдельно проверены URL из live-таблиц PR-CY, которые могли вызвать вопросы:

- `https://kuhni.minsk.by/locations/zhodzina` -> `301` на `/locations/zhodino`, canonical уже нормализован;
- `https://kuhni.minsk.by/kitchen-configurator` -> `301` на `/design-proekt-kuhni`;
- `https://kuhni.minsk.by/calculator` остается `200` и self-canonical.

Вывод: свежий weekly-съем есть именно в PR-CY, поэтому отдельный PixelPlus-экспорт в проекте на 14 июня 2026 по-прежнему отсутствует, но data-gap частично закрыт живой PR-CY-панелью.

## 4. Что брать в следующий SEO-цикл

Приоритетные страницы и кластеры на следующий проход:

1. `/catalog/kuhni-do-potolka`  
Причина: уже `7` в PR-CY, это самый близкий коммерческий кандидат на дожим в топ-5.

2. `/materials/mdf-emal` и `/materials/plastik-hpl`  
Причина: позиции `11` и `13`; это лучший короткий коридор для входа в топ-10.

3. `/calculator`  
Причина: позиция `16`; нужен разбор сниппета, внутренней перелинковки и конверсии страницы.

4. `/locations/fanipol`, `/locations/logoisk`, `/locations/smolevichi`, `/locations/molodechno`  
Причина: geo-страницы уже ранжируются, но еще не закрепились; именно они ближе всего к practical uplift.

5. `/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh`  
Причина: позиция `15`; можно использовать как информационный вход с усилением внутренних ссылок в `/prices` и материалы.

6. `/blog/kuhni-blum-hettich-gtv` и брендовые/навигационные страницы `/reviews`, `/contacts`, `/portfolio`  
Причина: есть уже `1` или близкие к нему позиции; задача следующего цикла не сломать текущий захват и усилить CTR.

7. `Главная` и `brand/reputation cluster`  
Причина: `/` держит среднюю позицию `3.2` по части охвата, а `кухниby отзывы` просели до `8`; это сигнал на усиление reputation-блоков и review flow.

## 5. Резюме weekly-контроля

На 14 июня 2026 production у `https://kuhni.minsk.by` технически стабилен: `robots.txt` и `sitemap.xml` доступны, sitemap остается static на `108` URL, ключевые money-pages и статьи отвечают `200` и сохраняют корректные canonical и `index, follow`.

Свежие live-данные по позициям доступны в PR-CY по новому маршруту `a.pr-cy.ru`: сейчас в мониторинге `94` запроса, средняя позиция `81.55`, видимость `0.90`, а самые практичные зоны роста на следующую неделю — `kuhni-do-potolka`, материалы `mdf-emal` и `plastik-hpl`, `/calculator` и несколько geo-страниц из диапазона `11-22`.

Свежий статус GSC и Яндекс.Вебмастера именно через браузерный вход в этой сессии не обновлен, потому что browser-сессия 14 июня 2026 была неавторизована. Этот отчет фиксирует только подтвержденные факты production и доступного rank-monitoring и не обещает гарантированную индексацию, переиндексацию или рост позиций.
