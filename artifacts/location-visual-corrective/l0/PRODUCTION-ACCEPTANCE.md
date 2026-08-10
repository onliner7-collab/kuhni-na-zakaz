# L0 — production acceptance

Дата: 2026-08-10

## Deploy

- Runtime commit: `1fedd22e26ebd55c1b2aa2ad2de8393af3ff9e9a`.
- Ветка: `work`, push в `origin/work` выполнен.
- Штатный Timeweb deploy: `deploy/scripts/update-production.sh work`, exit 0.
- Production build: PASS, 173 страницы.
- Service `kuhni-na-zakaz`: `active`.
- Production HEAD подтверждён на сервере.

## HTTP и media

- HTTP 200: `/locations`, три pilot route, шесть protected route, `/robots.txt`, `/sitemap.xml`.
- Контрольные AVIF/WebP трёх серий: HTTP 200.
- В production browser каждый initial visual загрузился с `naturalWidth=1200`; missing alt 0, horizontal overflow 0.

## Live interaction

- Финальный Playwright production run: 26/26 PASS.
- На каждом пилоте три действия меняют `currentSrc`, новый кадр загружается, CLS ≤ 0.02, позиция после уже видимого control не прыгает.
- Responsive matrix: 360/390/412/768/1440 для трёх пилотов.
- Keyboard, focus, reduced motion и `/locations` hub: PASS.
- Protected regression: 6/6 PASS.
- Первый live run выявил сетевую гонку самого теста: `currentSrc` менялся раньше завершения декодирования AVIF. Assertion исправлен на ожидание `naturalWidth > 0`.
- Один последующий keyboard run стартовал до hydration; production test дополнен явным ожиданием готовности сети. Изолированный retry 1/1 и финальный полный run 26/26 прошли.

## Встроенный Browser

- Mobile viewport 390×844.
- `/locations/soligorsk`: 4 состояния, корректные русские заголовки/alt/disclosure; переключение загрузило `soligorsk-storage-to-ceiling-v2.avif` размером 1200×800.
- `/locations/fanipol`, `/locations/gomel`, `/locations`: H1 и visual question корректны; initial AVIF 1200 px; overflow false; missing alt 0.
- Ошибок console уровня error не обнаружено.

## Статус и rollback

`L0_VISUAL_ACCEPTED`.

Rollback runtime: `git revert 1fedd22e26ebd55c1b2aa2ad2de8393af3ff9e9a`, push `work`, штатный deploy, затем повтор targets/protected/media/sitemap/robots smoke. DB/schema/data rollback не требуется.
