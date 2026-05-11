# SEO API audit: kuhni.minsk.by

Дата проверки: 2026-05-11
Период Search Console: 2026-02-08 - 2026-05-08

## Google Search Console

- Доступ к свойству: `sc-domain:kuhni.minsk.by`, уровень `siteOwner`.
- За период: 2 клика, 240 показов, CTR 0,83%, средняя позиция 26,8.
- Sitemap `https://kuhni.minsk.by/sitemap.xml`: повторно отправлен через API, ответ `204`.
- В GSC по sitemap: ошибок 0, предупреждений 0; last downloaded `2026-05-10T17:42:00Z`.
- URL Inspection:
  - `/`: `Submitted and indexed`, canonical OK, crawl mobile.
  - `/prices`: `Submitted and indexed`, canonical OK, crawl mobile.
  - `/locations/minsk`: `Submitted and indexed`, canonical OK, crawl mobile.
  - `/catalog/uglovye-kuhni`: `Discovered - currently not indexed`.
  - `/catalog/pryamye-kuhni`: `URL is unknown to Google`.

## Yandex Webmaster

- Сайт подтвержден: `https://kuhni.minsk.by/`, status `OK`.
- Критичные проблемы: не обнаружены.
- Активная рекомендация: `FAVICON_PROBLEM`.
- Популярные поисковые запросы за период: 0 строк.
- Sitemap в Яндексе: добавлен, ошибок 0, но last access `2026-04-18T19:58:25+03:00`, `urls_count: 0`.
- Через API отправлены в переобход 9 приоритетных URL: главная, каталог, основные категории, цены, Минск, контакты. Все запросы приняты, статус `202`.

## Что исправлено в коде

- В sitemap добавлен `lastmod` для статических страниц, статических категорий каталога и статических региональных страниц.
- Обновлена версия favicon-ссылок для сброса кеша.
- В metadata добавлены PNG icon-ссылки 192x192 и 512x512, чтобы усилить сигнал для Яндекса и браузеров.

## Остаточные риски

- Исправления в коде вступят в силу для поисковиков после деплоя.
- Google API не дает массово запросить индексацию обычных страниц; для Google сделана повторная отправка sitemap и точечная URL Inspection.
- Яндекс может обновлять данные sitemap и favicon до двух недель после переобхода.
- PageSpeed API вернул `429 Too Many Requests`, поэтому внешний Lighthouse через Google не был получен в этот прогон.
