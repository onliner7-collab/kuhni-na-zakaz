# Волна 1 SEO/GEO для Минской области

Дата: 2026-05-29  
Приложение: `C:/Users/User/Desktop/kuhni-na-zakaz/artifacts/kuhni-na-zakaz`  
Сайт: `https://kuhni.minsk.by`

## Что сделано

- Созданы и интегрированы 5 городских посадочных страниц:
  - `/locations/dzerzhinsk` — Дзержинск
  - `/locations/zaslavl` — Заславль
  - `/locations/logoisk` — Логойск
  - `/locations/vileyka` — Вилейка
  - `/locations/nesvizh` — Несвиж
- Для каждой страницы добавлены уникальные SEO/GEO-тексты: intro, service area, замер, доставка, монтаж, price note, FAQ, popular solutions, соседние города и внутренние ссылки.
- Страницы связаны с главной, `/locations`, `/locations/minskaya-oblast`, соседними городами, каталогом, ценами и портфолио через существующие блоки навигации.
- Хаб `/locations/minskaya-oblast` теперь содержит новые города в списке Минской области.
- Новые города автоматически попадают в sitemap через `regionalLocations`.
- `public/llms.txt` дополнен новыми URL.
- `robots.txt` проверен: новые страницы не блокируются, sitemap указан.

## Изображения

Создано 15 новых AI/3D визуализаций, по 3 на город. Локальные папки с фото не использовались. Первичные файлы были сгенерированы через встроенный `image_gen`, затем сохранены в проекте как WebP.

Папки:

- `public/uploads/locations/dzerzhinsk-3d/`
- `public/uploads/locations/zaslavl-3d/`
- `public/uploads/locations/logoisk-3d/`
- `public/uploads/locations/vileyka-3d/`
- `public/uploads/locations/nesvizh-3d/`

Все изображения подключены как `3D-визуализация КухниBY`, имеют русские alt-тексты и HTML-ватермарку через `BrandedImageWatermark`. Сами изображения не используются как подтверждение реальных объектов в городах.

## Измененные файлы

- `components/locations/RegionalLocationPage.tsx`
- `components/sections/KitchenIdeas3DSection.tsx`
- `data/locations.ts`
- `data/kitchen-ideas-3d.ts`
- `public/llms.txt`
- `public/uploads/locations/*`

## Использованные skills и MCP

Skills:

- `technical-seo-developer`
- `geo-content-optimizer`
- `keyword-research`
- `image-generation-brief`
- `imagegen`
- `accessibility-performance-qa`
- `playwright`

MCP/tools:

- Browser/Playwright MCP для локальной проверки страниц, кликов, формы, sitemap/robots/llms и mobile/desktop QA.
- `image_gen` для генерации новых 3D-визуализаций.
- Docs MCP и web search не использовались: актуальное поведение библиотек/API уточнять не потребовалось.

## Проверки

Команды:

- `pnpm typecheck` — пройдено
- `pnpm build` — пройдено
- `pnpm sitemap:check` — пройдено, sitemap check passed: 70 URLs

Playwright/browser:

- Проверены URL: `/locations/dzerzhinsk`, `/locations/zaslavl`, `/locations/logoisk`, `/locations/vileyka`, `/locations/nesvizh`.
- Все 5 URL отдают 200 локально.
- На каждой странице один H1.
- Title, description и canonical присутствуют.
- Canonical ведет на `https://kuhni.minsk.by/locations/<slug>`.
- JSON-LD присутствует.
- Новые URL найдены в локальном `/sitemap.xml`.
- Новые URL найдены в `/llms.txt`.
- `robots.txt` содержит sitemap.
- Проверены CTA и переход на `/prices`.
- Проверена форма на `/locations/dzerzhinsk`: поля заполняются, `sourcePage=/locations/dzerzhinsk`, `sourceType=location-region`, `cityKey=dzerzhinsk`.
- Проверен хаб `/locations/minskaya-oblast`: ссылки на 5 новых городов есть.
- Проверены desktop и mobile viewport; горизонтального переполнения не найдено.
- Проверены городские 3D-карточки на `/locations/logoisk`: изображения загружаются, alt на русском, подпись `3D-визуализация КухниBY`, CTA ведут к форме с параметрами идеи.

Скриншоты QA:

- `C:/Users/User/Desktop/kuhni-na-zakaz/wave1-logoisk-desktop.png`
- `C:/Users/User/Desktop/kuhni-na-zakaz/wave1-nesvizh-mobile.png`

## Production и индексация

Деплой в рамках этой локальной волны не выполнялся. Production URL и отправка на индексацию в Google Search Console / Яндекс Вебмастер не выполнялись, потому что новые страницы еще не развернуты на production.

После деплоя нужно проверить:

- `https://kuhni.minsk.by/locations/dzerzhinsk`
- `https://kuhni.minsk.by/locations/zaslavl`
- `https://kuhni.minsk.by/locations/logoisk`
- `https://kuhni.minsk.by/locations/vileyka`
- `https://kuhni.minsk.by/locations/nesvizh`

Затем отправить URL на индексацию/переобход в Google Search Console и Яндекс Вебмастер.

## Риски и остаток

- Для новых городов нет подтвержденных локальных кейсов; страницы честно маркируют визуалы как 3D-визуализации.
- Нужна production-проверка после деплоя.
- Нужна отправка URL на индексацию после деплоя.
- В рабочем дереве до этой задачи уже были посторонние изменения и untracked-файлы; они не откатывались.
