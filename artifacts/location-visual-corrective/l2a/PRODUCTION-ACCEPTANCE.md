# L2A — production acceptance

Дата: 2026-08-13
Статус: `PRODUCTION_ACCEPTED`

## Развёртывание

- Ветка: `work`.
- Runtime commit: `57860f20c4a4b2e865e228df3e2b4144056c798f`.
- Production HEAD после deploy: `57860f20c4a4b2e865e228df3e2b4144056c798f`.
- Сервис `kuhni-na-zakaz`: `active`.
- Deploy выполнен штатным `deploy/scripts/update-production.sh work`.

## Live smoke

- Целевые URL `/locations/smolevichi`, `/locations/dzerzhinsk`, `/locations/zaslavl`, `/locations/logoisk`: `200`, canonical совпадает с route, по одному `h1`, четыре доступные вкладки.
- Production Playwright после уточнения границы измерения interaction CLS: `19/19 PASS`.
- Проверены viewport `360/390/412/768/1440`, keyboard, reduced motion, сохранение meaningful ExploreContext без PII и отсутствие scroll jump.
- Защищённые `/`, `/design-proekt-kuhni`, `/locations/minsk`, `/locations/minskaya-oblast`, `/locations/borisov`, `/materials/furnitura`: PASS, generic explorer не появился.
- 48 delivery assets (`WebP`, `AVIF`, mobile `WebP`): `48/48 HTTP 200`, корректные MIME и ненулевой `Content-Length`; максимальный наблюдённый HEAD — 804 мс.
- Browser-проверка `/locations/smolevichi`: выбран сценарий «Подготовка замера», `currentSrc` переключился на `smolevichi-measurement-ready.avif`, `naturalWidth=1200`, русский alt, broken image отсутствует.

Первые холодные полные прогоны дали `17/19` и `18/19`: счётчик CLS захватывал позднюю загрузку страницы до взаимодействия, а один кадр не декодировался за исходные 5 секунд. Тест исправлен по контракту ТЗ: interaction CLS обнуляется после готовности первого кадра и шрифтов, сетевое окно декодирования увеличено до 15 секунд. Прямой smoke всех 48 assets подтвердил отсутствие ошибок доставки; итоговый полный прогон — `19/19 PASS`.

## Representative production Lighthouse

URL: `https://kuhni.minsk.by/locations/smolevichi`.

- Performance: `100`;
- Accessibility: `97`;
- Best Practices: `100`;
- SEO: `100`;
- LCP: `1437 мс`;
- CLS: `0`;
- TBT: `18 мс`;
- transfer: `409132 B`.

Отчёты: `lighthouse-production/smolevichi-mobile.report.html` и `.json`. Все hard gates волны пройдены.

## Rollback

Runtime rollback: `git revert 57860f20c4a4b2e865e228df3e2b4144056c798f`, push ветки `work`, штатный deploy, затем повтор target/protected/media/sitemap/robots smoke. Предыдущий runtime commit: `c01396856f8e08ac546a20048fd7cdc5a4e545b9`. Изменений DB/schema/content нет.
