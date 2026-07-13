# Полный SEO/GEO-аудит kuhni.minsk.by для движения к топ-1 Google и Яндекс

Дата: 28 июня 2026  
Сайт: https://kuhni.minsk.by  
Проект: `C:\Users\User\Desktop\kuhni-na-zakaz`  
Проверено: 112 URL из live sitemap  
Артефакты измерений:

- `.tmp/seo-crawl-2026-06-28.json` — HTML-аудит всех sitemap URL.
- `.tmp/seo-rendered-2026-06-28.json` — браузерная проверка RSC/рендера и сетевых ошибок.

## Ограничения данных

Запрошенные OpenSEO skills использованы как методология: project setup, keyword research, clustering, competitive landscape, competitor analysis, link prospecting и SEO coach. OpenSEO MCP-инструменты (`research_keywords`, `get_serp_results`, `get_domain_overview`, `get_ranked_keywords`, `get_backlinks_overview`, GSC через OpenSEO) в текущей сессии недоступны, поэтому аудит основан на живом production, sitemap, HTML/Playwright-проверках, локальных SEO-документах и ранее снятых GSC/PR-CY фактах.

Топ-1 нельзя гарантировать. Реалистичная цель: убрать технические ограничения, поднять CTR и индексируемость, усилить money-pages, доказательства, локальное доверие, карты/отзывы/ссылки и довести страницы до состояния, где топ-3/топ-1 становится возможным по конкретным кластерам.

## Executive Summary

Сайт уже имеет крепкую техническую базу: 112/112 sitemap URL отдают `200`, sitemap доступен, canonical/title/description/H1 уникальны, JSON-LD есть на всех продвигаемых URL, `/robots.txt` и HTTPS работают. Главные crawl-блокеры не найдены.

Главные ограничения для топ-1 сейчас не в индексации, а в конкуренции и качестве сигналов:

1. Слабая внешняя авторитетность: в предыдущем GSC-аудите было `0` внешних ссылок.
2. Низкий CTR и средняя видимость: предыдущий GSC срез показывал `28` кликов, `2.82k` показов, CTR `1%`, среднюю позицию `25.6`.
3. Есть backlog `57` неиндексируемых URL в GSC и discovered/crawled-not-indexed хвост.
4. 22 страницы имеют мало HTML-контента для самостоятельного ранжирования.
5. Внутренняя перелинковка недокачивает `/about`, `/warranty`, `/reviews` и часть блога.
6. 14 title слишком длинные, 7 title короткие; особенно страдают портфолио-страницы, где slug попадает в title.
7. При браузерном массовом обходе многие `_rsc` prefetch-запросы возвращали `503`. Обычный HTML `200`, но это риск UX/рендера и внутренней навигации.

Оценка текущей готовности:

| Блок | Оценка | Комментарий |
|---|---:|---|
| Crawl/index technical | 8/10 | 112 URL live, canonical/schema есть, но надо проверить GSC backlog и `_rsc` 503 |
| On-page money pages | 7/10 | Главная, каталог, цены, Минск сильные; калькулятор/сценарии/часть статей тонкие |
| Internal linking | 5/10 | Хабы есть, но link equity распределяется неидеально |
| Content depth | 6/10 | Есть хорошие кластеры, но сценарии и старый блог слабые |
| Local trust | 5/10 | Нужны Google/Yandex Business, отзывы, NAP-цитирования, фото/кейсы |
| External authority | 2/10 | Ссылочный профиль является главным барьером |
| Measurement | 5/10 | PR-CY baseline есть, свежий GSC/Яндекс/позиции нужно обновить через browser-login |

## Live Technical Audit

Проверка sitemap:

- `https://kuhni.minsk.by/sitemap.xml` доступен, `200`, `X-Sitemap-Source: static`.
- В sitemap: `112` URL.
- Все 112 URL из sitemap отдают `200`.
- Дублей title: `0`.
- Дублей description: `0`.
- Дублей H1: `0`.
- Страниц без JSON-LD: `0`.

Проверка robots/HTTPS:

- `/robots.txt` доступен, `200`.
- `http://kuhni.minsk.by/` корректно редиректит на `https://kuhni.minsk.by/`.
- Главная отдаёт prerendered HTML, `x-nextjs-prerender: 1`, cache HIT.

Риск: `_rsc` prefetch под нагрузкой.

Во время Playwright-обхода 76 страниц ловили 503 на внутренних запросах вида:

```text
https://kuhni.minsk.by/catalog?_rsc=...
https://kuhni.minsk.by/blog?_rsc=...
https://kuhni.minsk.by/locations/minsk?_rsc=...
```

Это не ломает HTML-индексацию напрямую, но может вредить UX, INP/console health и внутренней навигации. Нужно отдельно проверить nginx/app logs и воспроизвести без параллельного краулинга.

## Page-Type Audit

| Раздел | URL | Средний текст | Главный вывод |
|---|---:|---:|---|
| Главная | 1 | 1610 слов | Money-page готова, дальше нужен CTR/доверие/ссылки |
| Каталог | 8 | 701 | Хорошая база для коммерческих кластеров |
| Цены | 1 | 772 | Сильная money-page, нужно расширять калькуляторную связку |
| Локации | 32 | 1488 | Самый сильный массив, но нужен антишаблонный контроль и локальные доказательства |
| Материалы | 8 | 756 | Хороший кластер, `/materials/furnitura` слишком длинный title/description |
| Портфолио | 14 | 476 | Полезно для E-E-A-T, но 8 title испорчены slug-ами |
| Блог | 25 | 614 | Новые статьи норм, старые тонкие и слабосвязанные |
| Стили | 9 | 504 | Нормально, но часть страниц с малым inbound |
| Сценарии | 7 | 191 | Самый слабый кластер, все страницы тонкие |
| About/Warranty/Reviews | 3 | 198 | Важны для доверия, но слабы по контенту и ссылкам |

## Priority Page Fixes

P0 — исправить быстро, потому что влияет на доверие, CTR или crawl quality:

| URL | Проблема | Что сделать |
|---|---|---|
| `/about` | 193 слова, 0 внутренних входящих ссылок, title 72 символа | Добавить ссылку из footer/header/about snippets, расширить блоками: производство, договор, адреса, команда/процесс, фото, FAQ |
| `/warranty` | 116 слов, 0 входящих ссылок | Добавить из footer, prices, catalog, contacts; расширить гарантийными условиями, исключениями, порядком обращения |
| `/reviews` | 285 слов, короткий title, 1 входящая ссылка | Усилить как trust hub: реальные отзывы, города, типы кухонь, фото/кейсы, FAQ, ссылки на портфолио |
| `/calculator` | 146 слов | Добавить SEO-блок: как считается цена, факторы, примеры диапазонов, ссылки на `/prices` и каталог |
| `/delivery-installation` | 109 слов, короткий title | Расширить доставкой по Минску/области, монтажом, сроками, подготовкой помещения |
| `_rsc` prefetch | 503 при массовом браузерном обходе | Проверить серверные логи, лимиты, prefetch стратегию, cache/revalidate, Next RSC ответы |

P1 — money/cluster growth:

| URL/группа | Проблема | Что сделать |
|---|---|---|
| `/scenarios/*` | Все 7 страниц тонкие: 172-178 слов | Сделать сценарии полноценными landing pages: задача, планировка, материалы, бюджет, ошибки, кейсы, FAQ |
| Старые статьи блога | 222-301 слов | Обновить до 900-1400 слов, добавить таблицы, FAQ, внутренние ссылки, свежие цены/сроки |
| Портфолио | 8 длинных title со slug | Убрать slug из title, сделать человекочитаемые title по типу кухни/городу/материалу |
| `/materials/furnitura` | title 80, description 182 | Сократить title/description, сохранить смысл: фурнитура, петли, направляющие, Минск |
| `/catalog/kuhni-bez-ruchek` | description 85 | Расширить description до 130-155 символов с выгодой и CTA |

P2 — добор качества:

- Переписать короткие title: `/blog`, `/styles`, `/materials/ldsp`, `/scenarios/dlya-semi`, `/scenarios/byudzhetnaya-kuhnya`.
- Добавить alt на 1 изображение в `/locations/minskaya-oblast`.
- Освежить `lastmod` для реально изменённых страниц, чтобы Google/Яндекс видели актуальность.

## Keyword And Page Mapping

Главный принцип: не пытаться ранжировать всё одной главной. Каждый кластер должен иметь одну основную страницу и 3-8 поддерживающих ссылок.

| Кластер | Primary page | Supporting pages | Приоритет |
|---|---|---|---|
| кухни на заказ Минск / купить кухню Минск | `/` + `/locations/minsk` | `/catalog`, `/prices`, `/portfolio`, `/reviews` | P0 |
| кухни на заказ цены Минск | `/prices` | `/calculator`, price blog articles, `/catalog/*` | P0 |
| угловые кухни на заказ | `/catalog/uglovye-kuhni` | угловые статьи, портфолио, `/locations/minsk` | P0 |
| кухни до потолка | `/catalog/kuhni-do-potolka` | `/scenarios/do-potolka`, blog, portfolio | P0 |
| маленькая кухня | `/catalog/malenkie-kuhni` | `/scenarios/dlya-malenkoy-kuhni`, blog small kitchen | P1 |
| П-образная кухня | `/catalog/p-obraznye-kuhni` | blog P-образная, portfolio | P1 |
| кухня с островом | `/catalog/kuhni-s-ostrovom` | `/scenarios/s-ostrovom`, blog, portfolio | P1 |
| фурнитура/Blum/Hettich/GTV | `/materials/furnitura` | `/blog/kuhni-blum-hettich-gtv`, price/material pages | P1 |
| фасады/МДФ/ЛДСП/HPL/шпон | `/materials/*` | material blog, catalog pages | P1 |
| города Минской области | `/locations/{city}` | `/locations/minskaya-oblast`, related portfolio, delivery | P1 |
| доверие/отзывы/гарантия | `/reviews`, `/warranty`, `/about` | footer, contacts, every money page | P0 for trust |

## Competitive Landscape

Без OpenSEO MCP и свежего SERP API конкурентный блок является directional. В проектных документах уже выделены основные SEO/бизнес-конкуренты:

- `grosslend.by`
- `mebelzakaz5.by`
- `primebeli.by`
- `mke.by`
- `rrr.by`
- `pinskdrev.by`
- `zakaz-kuhni-minsk.by`

Что они, вероятно, обгоняют за счёт:

1. Более сильный бренд/история домена.
2. Больше внешних упоминаний, каталогов, отзывов, карт.
3. Больше коммерческих страниц с прямым интентом.
4. Более привычные коммерческие сниппеты: цена, рассрочка, сроки, адрес, отзывы.
5. Для Яндекса — локальные/поведенческие сигналы и карты.

Как бить их не копированием, а углом:

- Сделать сайт самым понятным по цене: калькулятор, сметы, диапазоны, что входит/не входит.
- Сделать сайт самым доказательным: кейсы до/после, договор, сроки, реальные отзывы, фото производства.
- Сделать городские страницы не шаблонами, а локальными landing pages с логистикой, сроками, примерами и FAQ.
- Снять барьер доверия Борисов/Минск: честно объяснять производство/офис/выезд/обслуживание Минска.

## Link Prospecting Plan

Главный барьер — внешние ссылки и упоминания. Сайт не выйдет стабильно в топ-1 по коммерческим запросам только внутренними текстами.

Лучшие linkable assets:

1. `/prices` — прозрачная смета кухни на заказ.
2. `/calculator` — калькулятор стоимости кухни.
3. `/materials/furnitura` — большой справочник по фурнитуре.
4. `/blog/chto-vhodit-v-stoimost-kuhni-na-zakaz` — объяснение цены.
5. `/portfolio` — реальные/демонстрационные кейсы с фото.

Типы ссылок и упоминаний:

| Тип | Где искать | Угол |
|---|---|---|
| Local directories | каталоги Минска/Беларуси, карты, справочники | Производство кухонь, замер, монтаж |
| Home/interior media | интерьерные блоги, подборки, ремонты | Экспертный комментарий по кухне/фурнитуре/цене |
| Partner links | дизайнеры, ремонтники, техника, столешницы | Партнёрские страницы и кейсы |
| Review platforms | Google Business, Яндекс Бизнес, Otzyv, каталоги | Сбор реальных отзывов с фото |
| Resource/list pages | "где заказать кухню", "кухни Минск" | Добавление в подборки с уникальным преимуществом |

Минимальная цель на 90 дней:

- 20-30 качественных локальных citations.
- 10-15 реальных отзывов в Google/Yandex с фото/городом/типом кухни.
- 5-10 тематических ссылок с ремонтов/интерьеров/партнёров.
- 3-5 экспертных материалов или комментариев со ссылкой на `/prices` или `/materials/furnitura`.

## GEO / AI Citation Readiness

Для ChatGPT, Perplexity, AI Overviews и Gemini сайт должен давать короткие, цитируемые ответы и ясную entity-структуру.

Что уже хорошо:

- Есть `llms.txt` по прошлым работам.
- Есть FAQPage на многих страницах.
- Есть LocalBusiness/Service/Breadcrumb/Article/BlogPosting schema.
- Главная и локации отвечают на коммерческий интент.

Что добавить:

- На money-pages: 25-50 слов "короткий ответ" в начале блока: сколько стоит, как заказать, сроки, что входит.
- Таблицы: цена по типу кухни, материалы, сроки, фурнитура, этапы.
- Датированные формулировки: "Актуально на 2026 год".
- Явные entity-связки: КухниBY, кухни на заказ, Минск, Беларусь, производство, замер, монтаж.
- Блок "данные и источники": собственные расчёты, условия договора, диапазоны цен, сроки.

## Roadmap To Top-1

### Неделя 1: убрать быстрые ограничения

1. Исправить `_rsc` 503: серверные логи, лимиты, prefetch/cache.
2. Переписать 21 проблемный title/description.
3. Добавить входящие ссылки на `/about`, `/warranty`, `/reviews`.
4. Расширить `/calculator`, `/delivery-installation`, `/warranty`.
5. Исправить alt на `/locations/minskaya-oblast`.

### Недели 2-3: усилить money и сценарии

1. Развернуть `/scenarios/*` в полноценные посадочные.
2. Усилить `/catalog/kuhni-do-potolka`, `/catalog/malenkie-kuhni`, `/catalog/p-obraznye-kuhni`.
3. Обновить старые статьи: `kak-vybrat-kuhnyu`, `skolko-stoit-kuhnya-na-zakaz`, `kuhnya-dlya-malenkoy-kvartiry`, `kakie-fasady-luchshe`, `kuhni-blum-hettich-gtv`, `kuhnya-s-ostrovom`.
4. Добавить внутренние ссылки из новых статей на money-pages.

### Месяц 1: доверие и локальные сигналы

1. Google Business Profile и Яндекс Бизнес: NAP, категории, фото, услуги, отзывы.
2. Отзывы: минимум 10 новых реальных отзывов с деталями проекта.
3. Портфолио: убрать slug из title, добавить больше доказательности.
4. City pages: добавить локальные кейсы/логистику/сроки по ключевым городам.

### Месяцы 2-3: внешние ссылки и контентная глубина

1. 20-30 citations.
2. 5-10 тематических ссылок.
3. 8-12 новых статей под кластеры с низкой конкуренцией.
4. Еженедельный PR-CY/GSC/Yandex мониторинг.

## Measurement Plan

Каждую неделю фиксировать:

- PR-CY позиции по 94+ запросам: top 1-3, 4-10, 11-30, 31-100.
- GSC: клики, показы, CTR, средняя позиция по query+page.
- GSC Indexing: indexed/not indexed, discovered/crawled not indexed.
- Яндекс Вебмастер: страницы в поиске, исключённые, переобход.
- Ссылки: новые referring domains, локальные citations, отзывы.
- Production QA: sitemap count, robots, ключевые URL `200`, `_rsc` 503.

## Next Actions

1. Войти через встроенный браузер в GSC и Яндекс Вебмастер, обновить факты по sitemap/indexing/query+page.
2. Исправить P0-техническое: `_rsc` 503.
3. Исправить P0-страницы: `/about`, `/warranty`, `/reviews`, `/calculator`, `/delivery-installation`.
4. Сделать внутреннюю перелинковку trust pages -> money pages -> supporting content.
5. Запустить link/citation sprint на `/prices`, `/calculator`, `/materials/furnitura`.

