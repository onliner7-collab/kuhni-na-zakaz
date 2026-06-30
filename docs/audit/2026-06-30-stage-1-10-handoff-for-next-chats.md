# Handoff для новых чатов: этапы 1-10

Дата: 30 июня 2026  
Проект: `C:\Users\User\Desktop\kuhni-na-zakaz`  
Ветка: `work`  
Сайт: `https://kuhni.minsk.by`  
Production HEAD после последнего деплоя: `18e2f13`

## Короткий вывод

Этапы 1-10 уже реализованы, проверены, запушены в `origin/work` и задеплоены на production. Следующим чатам не нужно начинать заново или переписывать страницу `/design-proekt-kuhni`: работать нужно поверх текущей реализации.

Главные рабочие коммиты:

| Коммит | Назначение |
|---|---|
| `a92693c feat: rebuild design project page` | Основная реализация этапов 1-5 для `/design-proekt-kuhni` |
| `e78efbc feat: strengthen seo stages 7 10` | Усиление блога, кейсов, geo-страниц, внутренней перелинковки и внешний sprint |
| `bdf9f45 fix: keep static blog seo relations` | Production-fix: SEO-связи блога сохраняются, даже если статья приходит из БД |
| `18e2f13 fix: update design project neoclassical links` | Production-fix: битые ссылки `/styles/neoklassika` заменены на `/portfolio?style=neoklassika` |

## Отчет по моей части: этапы 1-5

Моя часть работы была выполнена в коммите `a92693c feat: rebuild design project page`, запушена в `origin/work` и задеплоена на production до последующих доработок этапов 6-10. Следующие чаты должны считать этот коммит базовой реализацией интерактивной страницы `/design-proekt-kuhni`, а не черновиком.

### Что было реализовано

| Этап | Что сделано | Основные файлы |
|---|---|---|
| 1. Базовая SEO-страница `/design-proekt-kuhni` | Страница переписана под концепцию "От пустой комнаты до будущей кухни"; обновлены Title, Description, Open Graph, H1, хлебные крошки, SEO-текст, FAQ, внутренние ссылки, CTA и JSON-LD. | `artifacts/kuhni-na-zakaz/app/design-proekt-kuhni/page.tsx` |
| 2. Первый экран с превращением комнаты | Добавлен fullscreen hero: пустое помещение, этапы проектирования, чертежные линии, появление финальной кухни, CTA и fallback через реальные изображения. | `components/design-project/DesignProjectInteractive.tsx`, `public/images/design-proekt-kuhni/*empty-room*` |
| 3. Визуальный конфигуратор | Добавлен блок "Соберите идею кухни": форма кухни, размер, стиль, фасады, дополнительные опции; справа меняется крупная визуализация. | `DesignProjectInteractive.tsx` |
| 4. Передача выбора в заявку и аналитика | Выбранные параметры конфигуратора сохраняются в `sessionStorage` и добавляются в комментарий заявки. Добавлены события аналитики для hero, выбора параметров, завершения конфигуратора, слоев, кейсов и материалов. | `components/sections/ContactForm.tsx`, `lib/analytics.ts` |
| 5. Визуальные блоки страницы | Добавлены блоки "Разберите кухню на слои", 6 кейсов до/после, "Выберите свою ситуацию", маршрут создания проекта, фильтруемая галерея, "Что входит в 3D-проект", материалы, ошибки, FAQ и финальный CTA. | `DesignProjectInteractive.tsx`, `page.tsx` |

### Сгенерированное изображение

Для первого экрана через встроенный Codex/OpenAI `imagegen` было сгенерировано реалистичное пустое кухонное помещение без текста, людей и мебели. Исходник сохранен в проекте, в UI подключены оптимизированные WebP-версии.

| Файл | Назначение | Размер |
|---|---|---:|
| `artifacts/kuhni-na-zakaz/public/images/design-proekt-kuhni/3d-proekt-kuhni-empty-room-20260629.png` | Исходник, не основной visible `src` | `1696996` bytes |
| `artifacts/kuhni-na-zakaz/public/images/design-proekt-kuhni/3d-proekt-kuhni-empty-room-20260629.webp` | Desktop hero layer | `35912` bytes |
| `artifacts/kuhni-na-zakaz/public/images/design-proekt-kuhni/3d-proekt-kuhni-empty-room-20260629-mobile.webp` | Mobile hero layer | `9324` bytes |

### Проверки моей части

После этапов 1-5 были выполнены проверки:

```powershell
node_modules\.bin\tsc.CMD --noEmit --incremental false
pnpm.cmd run images:audit
pnpm.cmd exec playwright test -c playwright.smoke.config.ts tests/smoke/design-proekt-kuhni.spec.ts --reporter=line
pnpm.cmd run build
```

Результаты:

- TypeScript: без ошибок.
- `images:audit`: битых, oversized и плохих имен изображений не найдено.
- Smoke `/design-proekt-kuhni`: `10 passed`.
- Production build: успешно; локальные Prisma-сообщения про `127.0.0.1:5434` были ожидаемыми, сборка завершилась через fallback-данные.
- Browser QA на production-like сервере: desktop и mobile без горизонтального overflow, H1/FAQ/form/schema на месте, загруженные изображения без `naturalWidth=0`.

### Production после моей части

Моя часть была опубликована стандартным Timeweb-путем:

```powershell
git push origin work
ssh -i C:\Users\User\.ssh\timeweb_kuhni_ed25519 -o StrictHostKeyChecking=no root@5.42.108.140 "bash /var/www/kuhni-na-zakaz/deploy/scripts/update-production.sh work"
```

Проверки после деплоя моей части:

- server git: `a92693c`;
- `systemctl is-active kuhni-na-zakaz` -> `active`;
- `https://kuhni.minsk.by/design-proekt-kuhni` -> `200`;
- `3d-proekt-kuhni-empty-room-20260629.webp` -> `200`, `image/webp`, `35912` bytes;
- `3d-proekt-kuhni-empty-room-20260629-mobile.webp` -> `200`, `image/webp`, `9324` bytes;
- live HTML содержал `3D-проект кухни на заказ в Минске`, `Соберите идею кухни`, `Разберите кухню на слои`, `Примеры кухонь, которые можно спроектировать`, `Частые вопросы о 3D-проекте кухни`.

### Важные ограничения для следующих чатов

- Не переписывать `/design-proekt-kuhni` с нуля: этапы 1-5 уже являются рабочей production-базой.
- Если расширять hero, галерею или материалы, не подключать тяжелый PNG как основной `src`; использовать WebP/AVIF и сохранять исходники отдельно.
- Сохранять SEO-контент, FAQ, внутренние ссылки и JSON-LD доступными в HTML, а не только через client-only интерактив.
- Сохранять русские видимые тексты и русские alt-тексты.
- Если нужны новые фото кухни, использовать только встроенный `imagegen` по правилам `AGENTS.md`.

## Что сделано по этапам 1-10

| Этап | Статус | Где смотреть | Что сделано |
|---|---|---|---|
| 1. Страница `/design-proekt-kuhni` | Выполнен | `app/design-proekt-kuhni/page.tsx` | Полностью переработана посадочная страница 3D-проекта кухни: hero, SEO-текст, FAQ, CTA, внутренние ссылки, JSON-LD. |
| 2. Интерактивный hero | Выполнен | `components/design-project/DesignProjectInteractive.tsx` | Добавлен сценарий "пустая комната -> будущая кухня" с этапами превращения помещения в кухню. |
| 3. Визуальный конфигуратор | Выполнен | `DesignProjectInteractive.tsx`, `ContactForm.tsx` | Блок "Соберите идею кухни" собирает форму, размер, стиль, фасады и пожелания; выбранные параметры попадают в комментарий формы заявки. |
| 4. Слои кухни | Выполнен | `DesignProjectInteractive.tsx` | Добавлен блок "Разберите кухню на слои": фасады, столешница, фурнитура, техника, свет. |
| 5. Кейсы, ситуации, маршрут, галерея | Выполнен | `DesignProjectInteractive.tsx`, `page.tsx` | Добавлены 6 кейсов, ситуации клиента, маршрут создания проекта, галерея, материалы, SEO-блоки и финальный CTA. |
| 6. Контент-кластеры и блог | Выполнен + усилен | `app/blog/[slug]/page.tsx`, `lib/blog-seo-fallback.ts`, `lib/blog-resolve.ts` | Блоговые статьи получили связи с релевантными кейсами портфолио; production-статьи из БД теперь сохраняют fallback SEO-связи. |
| 7. Портфолио и кейсы | Выполнен | `app/portfolio/[slug]/page.tsx` | Кейсы усилены proof-блоком: задача, решение, материалы, срок/бюджет, статус изображения и переходы на money/trust-страницы. |
| 8. Geo-страницы | Выполнен | `components/locations/RegionalLocationPage.tsx` | Городские страницы получили блок локальных условий без фальшивой привязки чужих фото к городам. |
| 9. Внутренняя перелинковка | Выполнен | blog, portfolio, geo templates | Блог ведет на кейсы; кейсы ведут на цены, калькулятор, материалы, город, гарантию и отзывы; geo ведет на цены, калькулятор, портфолио и гарантию. |
| 10. Внешние сигналы | Подготовлен | `docs/audit/2026-06-29-stage-7-10-trust-linking-external-sprint.md` | Создан NAP-пакет, список 50 площадок/направлений, UTM-шаблоны, план отзывов и 14-дневный чеклист. Аккаунтные размещения остаются ручным шагом. |

## Файлы, которые уже трогались

Основная реализация `/design-proekt-kuhni`:

- `artifacts/kuhni-na-zakaz/app/design-proekt-kuhni/page.tsx`
- `artifacts/kuhni-na-zakaz/components/design-project/DesignProjectInteractive.tsx`
- `artifacts/kuhni-na-zakaz/components/sections/ContactForm.tsx`
- `artifacts/kuhni-na-zakaz/lib/analytics.ts`
- `artifacts/kuhni-na-zakaz/public/images/design-proekt-kuhni/3d-proekt-kuhni-empty-room-20260629.png`
- `artifacts/kuhni-na-zakaz/public/images/design-proekt-kuhni/3d-proekt-kuhni-empty-room-20260629.webp`
- `artifacts/kuhni-na-zakaz/public/images/design-proekt-kuhni/3d-proekt-kuhni-empty-room-20260629-mobile.webp`

SEO и перелинковка этапов 6-10:

- `artifacts/kuhni-na-zakaz/app/blog/[slug]/page.tsx`
- `artifacts/kuhni-na-zakaz/lib/blog-seo-fallback.ts`
- `artifacts/kuhni-na-zakaz/lib/blog-resolve.ts`
- `artifacts/kuhni-na-zakaz/app/portfolio/[slug]/page.tsx`
- `artifacts/kuhni-na-zakaz/components/locations/RegionalLocationPage.tsx`
- `docs/audit/2026-06-13-top1-progress.md`
- `docs/audit/2026-06-29-stage-7-10-trust-linking-external-sprint.md`

Последний точечный фикс:

- `app/design-proekt-kuhni/page.tsx`: `/styles/neoklassika` -> `/portfolio?style=neoklassika`
- `components/design-project/DesignProjectInteractive.tsx`: `/styles/neoklassika` -> `/portfolio?style=neoklassika`

## Проверки, которые прошли

Перед последним деплоем были выполнены:

```powershell
node_modules\.bin\tsc.CMD --noEmit --incremental false
pnpm.cmd run images:audit
pnpm.cmd exec playwright test -c playwright.smoke.config.ts tests/smoke/design-proekt-kuhni.spec.ts --reporter=line
pnpm.cmd run build
```

Результат:

- TypeScript: без ошибок.
- `images:audit`: `broken: []`, `oversized: []`, `badNames: []`.
- Smoke `/design-proekt-kuhni`: `10 passed`.
- Build: успешно. Локально в build есть ожидаемые Prisma-сообщения про недоступную БД `127.0.0.1:5434`, но сборка завершается через fallback-данные.

Production-проверки после деплоя:

```text
server git rev-parse --short HEAD -> 18e2f13
systemctl is-active kuhni-na-zakaz -> active
https://kuhni.minsk.by/design-proekt-kuhni -> 200
```

Live HTML подтвердил:

- есть `3D-проект кухни на заказ`;
- есть `Соберите идею кухни`;
- есть `Разберите кухню на слои`;
- есть `Примеры кухонь, которые можно спроектировать`;
- есть `FAQ`;
- есть `/portfolio?style=neoklassika`;
- нет `/styles/neoklassika`;
- `3d-proekt-kuhni-empty-room-20260629.webp` подключен;
- `3d-proekt-kuhni-empty-room-20260629.png` не подключен как основной `src`.

Live image checks:

| URL | Статус |
|---|---|
| `/images/design-proekt-kuhni/3d-proekt-kuhni-empty-room-20260629.webp` | `200`, `image/webp`, `35912` bytes |
| `/images/design-proekt-kuhni/3d-proekt-kuhni-empty-room-20260629-mobile.webp` | `200`, `image/webp`, `9324` bytes |
| `/images/design-proekt-kuhni/3d-proekt-kuhni-empty-room-20260629.png` | `200`, `image/png`, `1696996` bytes; это исходник, не основной visible src |

Production browser-check:

| Viewport | Статус | Горизонтальный scroll | Картинки |
|---|---|---|---|
| Mobile `390x844` | `200` | нет, `scrollWidth=390` | 40 видимых, битых нет |
| Desktop `1440x960` | `200` | нет, `scrollWidth=1440` | 40 видимых, битых нет |

## Отчет по моей части: этапы 11-16

Дата выполнения: 30 июня 2026
Страница: `/design-proekt-kuhni`
Статус: код реализован, проверен, запушен в `origin/work` и задеплоен на production.

### Что сделано

| Этап | Статус | Что изменено |
|---|---|---|
| 11. Как создается проект | Выполнен | Блок превращен в горизонтальный визуальный маршрут из 6 сцен. На mobile это свайп-лента без горизонтального overflow документа, на desktop — 6 сцен в ряд. |
| 12. Галерея визуализаций | Выполнен | Сохранена masonry-галерея с фильтрами, добавлены кнопки предыдущего/следующего изображения, клавиатурная навигация и свайп в полноэкранном просмотре. |
| 13. Что входит в 3D-проект | Выполнен | Состав проекта расширен до 10 элементов из ТЗ: планировка, техника, хранение, фасады, столешница, палитра, свет, 3D-визуализация, расчет, правки. |
| 14. Материалы глазами | Выполнен | Материалы разделены по категориям: фасады, столешницы, фартуки, ручки, фурнитура, подсветка. Выбор категории меняет доступные образцы и крупную визуализацию. |
| 15. SEO-блоки | Проверен и сохранен | Читаемый HTML SEO-раздел, внутренние ссылки, H1/H2/H3, metadata и schema остаются в серверной странице. Новых URL не добавлено. |
| 16. FAQ | Проверен и сохранен | На странице остаются 10 видимых `details` FAQ; JSON-LD FAQ соответствует видимым вопросам и ответам. |

### Основные файлы

- `artifacts/kuhni-na-zakaz/components/design-project/DesignProjectInteractive.tsx`
- `artifacts/kuhni-na-zakaz/lib/analytics.ts`
- `docs/audit/2026-06-30-stage-1-10-handoff-for-next-chats.md`

### Изображения и производительность

- Новые фото кухни не генерировались: для этапов 11-16 хватило уже сохраненных в проекте WebP-изображений.
- Тяжелые PNG/JPEG не подключались как visible `src`.
- После изменений `/design-proekt-kuhni` в production build: `12.4 kB`, First Load JS `169 kB`.
- Горизонтальные интерактивные ленты ограничены собственными `overflow-x-auto` контейнерами, чтобы mobile-документ не распирался.

### Локальные проверки

```powershell
node_modules\.bin\tsc.CMD --noEmit --incremental false
pnpm.cmd run images:audit
pnpm.cmd exec playwright test -c playwright.smoke.config.ts tests/smoke/design-proekt-kuhni.spec.ts --reporter=line
pnpm.cmd run build
```

Результаты:

- TypeScript: без ошибок.
- `images:audit`: `broken: []`, `oversized: []`, `badNames: []`.
- Smoke `/design-proekt-kuhni`: `9 passed`; один dev-only timeout на проверке внутренних ссылок при запросе `/privacy-policy`, без факта 404.
- Отдельная проверка внутренних ссылок: `16` URL, `broken: []`; локальные `500` у части catalog-страниц связаны с недоступной dev-БД `127.0.0.1:5434`, а не с новыми ссылками.
- Production build: успешно; Prisma-сообщения про `127.0.0.1:5434` ожидаемы, сборка завершилась через fallback-данные.
- Production-like browser QA на `next start -p 3160`: mobile `390x844` и desktop `1440x960` без горизонтального scroll; после прокрутки нет битых загруженных изображений; lightbox листается кнопкой и свайпом.

### Production после деплоя

- commit: `7c843ca feat: finish design project seo stages 11 16`;
- production code baseline: `7c843ca`; последующие docs-only обновления отчета не меняют код страницы;
- `systemctl is-active kuhni-na-zakaz` -> `active`;
- `https://kuhni.minsk.by/design-proekt-kuhni` -> `200`;
- live mobile browser-check `390x844`: `scrollWidth=390`, блоки `project-route`, `visual-gallery`, `project-includes`, `materials-eye`, `seo-content`, `faq` на месте;
- live counts: `project-includes` содержит `10` кнопок, `FAQ` содержит `10` раскрываемых вопросов;
- live lightbox: кнопка "следующее изображение" и свайп меняют изображение в полноэкранном просмотре.

### GSC/Яндекс

Новых URL, sitemap-изменений и robots/canonical-изменений не добавлено. После деплоя панельный переобход GSC/Яндекс не обязателен; если нужно отправлять именно обновленную страницу `/design-proekt-kuhni`, это лучше делать отдельным браузерным действием через авторизованный сеанс пользователя.

## Важные выводы для следующего чата

1. Не откатывать `a92693c`, `e78efbc`, `bdf9f45`, `18e2f13`: это уже опубликованная рабочая цепочка.
2. Перед любой новой работой обязательно:

```powershell
git fetch origin
git checkout work
git pull --ff-only origin work
git log --oneline -5
```

3. В рабочем дереве могут быть чужие незакоммиченные изменения и много untracked-артефактов. Не чистить их без прямой команды пользователя.
4. Если smoke-тест `/design-proekt-kuhni` падает на horizontal scroll, сначала убедиться, что dev-server свежий и CSS реально загрузился. В прошлой проверке старый dev-server отдавал `_next` чанки с `404/ERR_ABORTED`, из-за чего страница считалась без CSS.
5. Если smoke-тест внутренних ссылок падает по timeout на `/prices` или `/privacy-policy`, это может быть cold compile dev-server. Прогреть страницу или перезапустить server и повторить тест. Реальная 404 была только на `/styles/neoklassika`, она уже исправлена.
6. Для новых фото кухонь строго соблюдать `AGENTS.md`: только встроенный `imagegen`, исходник сохранять в проекте, WebP использовать в UI, alt-тексты на русском.
7. Для сайта не подключать тяжелый PNG как основной `src`. Исходники можно хранить, но visible content должен использовать WebP.
8. GSC/Яндекс переобход не был выполнен для этих изменений: новых URL нет, а панельные действия требуют авторизованный browser-сеанс.
9. Этап 10 по внешним сигналам подготовлен, но не равен фактическому созданию внешних карточек/отзывов. Карты, отзывы и каталоги требуют ручного входа/подтверждений.

## Что делать дальше

Следующим этапом логично делать этап 11:

- открыть GSC и Яндекс Вебмастер через встроенный браузер;
- проверить sitemap, coverage/indexing, URL inspection для `/design-proekt-kuhni`;
- при необходимости отправить обновленную страницу на переобход;
- не обещать индексацию, фиксировать только факт отправки/доступности.

После этого этап 12:

- еженедельный SEO-контроль;
- свежий sitemap count;
- GSC/Yandex статусы;
- PR-CY/PixelPlus позиции, если доступен экспорт;
- проверка CTR и внешних ссылок.

Параллельно по этапу 10:

- создать/обновить Яндекс/Google/2ГИС карточки;
- заполнить единый NAP;
- собрать первые реальные отзывы;
- начать 3-5 профильных внешних упоминаний с UTM.

## Готовый стартовый prompt для следующего чата

```text
Работай в C:\Users\User\Desktop\kuhni-na-zakaz, ветка work, сайт https://kuhni.minsk.by.

Сначала:
git fetch origin
git checkout work
git pull --ff-only origin work
git log --oneline -5

Убедись, что HEAD содержит:
- a92693c feat: rebuild design project page
- e78efbc feat: strengthen seo stages 7 10
- bdf9f45 fix: keep static blog seo relations
- 18e2f13 fix: update design project neoclassical links

Прочитай:
- docs/audit/2026-06-30-stage-1-10-handoff-for-next-chats.md
- docs/audit/2026-06-13-top1-progress.md
- docs/audit/2026-06-29-stage-7-10-trust-linking-external-sprint.md

Не откатывай чужие незакоммиченные изменения.
Если нужны фото кухни, используй только встроенный imagegen и подключай WebP.
Следующая задача: этап 11 или 12 по GSC/Яндекс/еженедельному SEO-контролю.
```
