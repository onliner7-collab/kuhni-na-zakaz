# Финальная SEO/GEO и индексационная приемка Минской области

Дата: 2026-06-01 14:20 +03:00
Сайт: https://kuhni.minsk.by
Приложение: `C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/kuhni-na-zakaz`
Коммит деплоя: `1e38992` (`work`)

## Что изменено перед финальной приемкой

- Уточнены SEO-метаданные городских страниц Минской области в `artifacts/kuhni-na-zakaz/data/locations.ts`.
- Исправлен короткий title страницы `/locations/uzda`.
- Расширены короткие meta description до корректного диапазона для городов волн 2-3 и части ранее добавленных страниц.
- Изменения закоммичены и отправлены в `origin/work`.
- Production-деплой выполнен через серверный deploy script, сервис `kuhni-na-zakaz.service` перезапущен и активен.

## Проверенные городские URL

Проверено 24 страницы Минской области:

`/locations/borisov`, `/locations/zhodino`, `/locations/molodechno`, `/locations/soligorsk`, `/locations/slutsk`, `/locations/fanipol`, `/locations/smolevichi`, `/locations/dzerzhinsk`, `/locations/zaslavl`, `/locations/logoisk`, `/locations/vileyka`, `/locations/nesvizh`, `/locations/berezino`, `/locations/volozhin`, `/locations/stolbtsy`, `/locations/uzda`, `/locations/cherven`, `/locations/maryina-gorka`, `/locations/kletsk`, `/locations/kopyl`, `/locations/krupki`, `/locations/lyuban`, `/locations/myadel`, `/locations/starye-dorogi`.

## Автоматическая production-проверка

Production scan после деплоя:

- `robots.txt`: 200
- `sitemap.xml`: 200
- `llms.txt`: 200
- URL в sitemap: 96
- Служебные/закрытые URL в sitemap: 0
- Городские страницы в sitemap: 24/24
- Ошибки по городским страницам: 0
- Диапазон title: 45-63 символа
- Диапазон meta description: 121-148 символов

Для каждой из 24 страниц проверено:

- HTTP 200
- наличие в `sitemap.xml`
- canonical на собственный URL
- title и description в рабочем SEO-диапазоне
- H1
- FAQPage JSON-LD
- BreadcrumbList JSON-LD
- русские alt у контентных изображений
- ссылка из `/locations`
- ссылка из `/locations/minskaya-oblast`

Примечание по alt: служебный noscript-пиксель Яндекс.Метрики имеет пустой alt и исключен как tracking/decorative pixel; контентные изображения и 3D-визуализации имеют русские alt.

## Локальные проверки перед деплоем

- `pnpm typecheck`: пройден.
- `pnpm sitemap:check`: пройден, sitemap fallback сформирован; в логах есть ожидаемое предупреждение Prisma о недоступной локальной БД `127.0.0.1:5434`.
- `pnpm build`: пройден, production build собран.
- `pnpm smoke:key-pages`: 57/60 passed. Три старых desktop-smoke падения относятся к portfolio URL и не затрагивают городские страницы Минской области:
  - `/portfolio/kuhnya-s-ostrovom-minimalizm-005`
  - `/portfolio/uglovaya-kuhnya-sovremennaya-001`
  - `/portfolio/seraya-uglovaya-kuhnya-novostrojka-minsk`

## Ручная Playwright-проверка

Проверены production-страницы:

- desktop: `/locations/berezino`
- mobile: `/locations/uzda`
- desktop: `/locations/minskaya-oblast`
- mobile: `/locations`

Результат:

- H1 отображается корректно.
- Canonical присутствует.
- FAQ schema присутствует на городских и областной страницах.
- CTA и телефонные/форменные сценарии доступны.
- Формы на проверенных страницах присутствуют, поля доступны.
- Ссылки на города из `/locations` и `/locations/minskaya-oblast` доступны.
- Изображения после прокрутки загружаются, битых контентных изображений не обнаружено.
- 3D/AI изображения подписаны как `3D-визуализация КухниBY`.

## Индексационные действия

Google Search Console:

- Открыт ресурс `sc-domain:kuhni.minsk.by`.
- Отправлен sitemap: `https://kuhni.minsk.by/sitemap.xml`.
- Для `https://kuhni.minsk.by/locations/uzda` выполнена live-проверка:
  - URL доступен Google.
  - Страница может быть проиндексирована.
  - Breadcrumbs обнаружены без ошибок.
  - FAQ обнаружен без ошибок.
  - Запрос на индексирование отправлен.

Яндекс Вебмастер:

- Открыт раздел переобхода для `https://kuhni.minsk.by`.
- Все 24 городских URL отправлены на переобход.
- Статус после отправки: `В очереди`.
- Время отправки в интерфейсе: `01.06.2026 14:20`.

## Итоговый статус

Финальная SEO/GEO приемка городских страниц Минской области пройдена. Все 24 городские страницы отдают 200, присутствуют в sitemap, доступны из региональных разделов, имеют корректные canonical/title/description/H1/schema/FAQ/alt, а production `robots.txt`, `sitemap.xml` и `llms.txt` актуальны и доступны.

Остаточные риски не блокируют этап:

- Локальная БД для Prisma на `127.0.0.1:5434` недоступна в dev-окружении, но sitemap fallback и production DB работают.
- В smoke остаются 3 старых desktop-падения портфолио, не связанные с Минской областью и текущими SEO-страницами.
