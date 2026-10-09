# Жодино: информативная страница покупки кухни

Дата: 09.10.2026. URL: https://kuhni.minsk.by/locations/zhodino.

Статус: опубликовано, production QA во встроенном браузере Codex пройдена. Runtime 4cc591a. Последнее прямое поручение пользователя разрешает деплой и заменяет прежнее ограничение обсуждением.

## Основание и источники

Общий контракт и строка Жодино: 2026-10-07-master-page-plan.md. Семантика: 2026-10-09-zhodino-semantics-discussion.md. Главное намерение, подтверждённое пользователем: «купить кухню Жодино» со смысловыми вариациями. Поддерживающие темы: изготовление по размерам, угловые/прямые/маленькие кухни, стоимость и бюджет, фасады и стиль, замер/доставка/монтаж.

Wordstat проверен браузером по Беларуси: широкая фраза покупки 39; строка «купить кухню в жодино» 29 за 05.09–04.10.2026. Это пересекающиеся показатели Яндекса, не суммарный спрос и не Google. Остальные расширения не получают вымышленных частот/KD. Google проверен по покупке и заказу, интерфейс персонализирован с географией Борисов. Яндекс заблокирован капчей; текущая выдача не подтверждена.

Применены technical-seo-developer, keyword-research, serp, web-feature-builder, mcp-doc-router, on-page-seo-auditor, meta-tags-optimizer, schema-markup-generator, internal-linking-optimizer, accessibility-performance-qa, playwright, security-review, imagegen и image-generation-brief. Используются существующие API Next 15.3.9 и React, без новых библиотек. SEO-подход сверён с официальным Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide.

## Baseline и сохранение пользовательской работы

Текущий сервер до релиза: 696e8f925c52c8b8a4cd4f6ab0025a3f0009b24e, включает свежую главную и коммерческую страницу угловых кухонь. Локальная основная ветка work отстаёт от production и содержит большой чужой diff.

Релиз готовится в C:/Users/User/Desktop/kuhni-zhodino-deploy, ветка codex/zhodino-deploy-20261009, непосредственно от серверного HEAD. Не публиковать весь основной dirty diff. Маршрутизация добавляется отдельной веткой city === zhodino до общего регионального рендера; существующие data/locations.ts, RegionalLocationPage, Борисов и другие города не переписываются.

До изменений title Жодино: «Купить кухню в Жодино | Замер, проект и монтаж | КухниBY», H1 «Кухни на заказ в Жодино». Были визуальный explorer, многочисленные повторные блоки расчёта/логистики/услуг и примеры дизайна. Browser baseline и семантика сохранены в outputs/zhodino-implementation-2026-10-09/.

## Метаданные

- Title: Купить кухню в Жодино — на заказ по вашим размерам | КухниBY.
- H1: Купить кухню в Жодино на заказ.
- Description: Кухни на заказ в Жодино: прямые, угловые и маленькие. Сравните идеи, материалы и комплектацию. Отправьте размеры для расчёта цены, замера, доставки и монтажа.
- OG/Twitter: согласованные title/description и новый WebP 1200×800.
- Self-canonical: https://kuhni.minsk.by/locations/zhodino.
- lastmod меняется только у Жодино на 09.10.2026; даты главной и угловых сохранены.

Альтернативы title: «Купить кухню на заказ в Жодино — планировки и расчёт»; «Купить кухню в Жодино — угловые и прямые на заказ». Альтернативы description: «Купить кухню в Жодино по вашим размерам: сравните прямую и угловую планировки, фасады и хранение. Оставьте заявку на расчёт и согласование замера.»; «Планируете кухню в Жодино? Посмотрите идеи для квартиры и дома, выберите материалы и приоритет бюджета. Согласуем проект, стоимость, доставку и монтаж.» Выбран вариант с явной покупкой и индивидуальными размерами, без обещания каталога подтверждённых цен.

## Diff-аудит

| Решение | Блок | Результат |
|---|---|---|
| KEEP / ADAPT | Визуальный выбор | Четыре изображения, простые кнопки, русские подписи; новая угловая кухня вместо неоднозначной формы старого hero |
| ADAPT | Первый экран | Один H1, короткое предложение, сразу фотографическая иллюстрация |
| REPLACE | Повторные объяснения | Карточки планировок, сравнение фасадов, три приоритета бюджета, четыре этапа |
| ADAPT | Локальные условия | Адрес, этаж, лифт, готовность ремонта; детали в доступном details |
| ADAPT | FAQ | Семь реальных вопросов, серверный HTML и совпадающий FAQPage |
| ADAPT | Форма | Действующий ContactForm; имя, телефон, согласие; город и пожелания автоматически |
| KEEP | Global Dock / связь | Shared-компоненты не изменяются |
| REMOVE | Неподтверждённые обещания | Нет цены «от», фиктивных работ/филиала, бесплатных услуг, срока и рассрочки без подтверждения |

Смена материала меняет иллюстрацию и краткое объяснение; выбор бюджета сохраняет пожелание. Компоненты выбора не превращаются в калькулятор выдуманных цен. Пользовательский выбор передаётся в answers.zhodinoKitchenSelection с layout, view, material, budget, details; sourcePage /locations/zhodino, sourceType location, city Жодино, cityKey zhodino. Добавлено необязательное поле размеров/техники/пожеланий, ограниченное 1500 символами. Форма использует существующую валидацию и backend, новых endpoint, загрузок и внешних интеграций нет.

## Перелинковка и разметка

Хлебные крошки: главная → города → Жодино. Контекстные ссылки: угловые/прямые/маленькие/до потолка/с островом, материалы ЛДСП/МДФ/шпон, современные/неоклассика, цены, калькулятор, бюджетный сценарий, дизайн-проект, доставка/монтаж, подготовка к замеру, контакты/гарантия. Существующие inbound links главной/каталога/городов сохранены; Борисов не менялся.

BreadcrumbList, WebPage и FAQPage описывают только показанные факты. Фиктивных Product/Offer/рейтингов и локального адреса нет. FAQ не гарантирует расширенный сниппет. Один основной H1, логические H2/H3, details доступны клавиатурой, выбранные кнопки имеют aria-pressed и focus styles.

## Медиа

Новый hero создан встроенным Codex/OpenAI imagegen, не внешний сервис. Источник: public/uploads/locations/zhodino-20261009/zhodino-corner-kitchen-source.png. WebP 1200×800 — 50 790 байт; mobile WebP 600×400 — 18 030 байт. Исходник сохранён в проекте, напрямую не подключается.

Повторно используются изображения прямой кухни, ящиков и монтажа из zhodino-visual-l1b, а также иллюстрации ЛДСП/МДФ/шпона. Hero eager/high priority, нижние изображения lazy с размерами; карточки используют готовые WebP/mobile srcset, исключая повторную тяжёлую оптимизацию. Русские alt и честные подписи иллюстраций; новые изображения не выдаются за объект в Жодино.

Промпт:

Use case: photorealistic-natural. Create one realistic interior photograph, landscape 3:2, for a Belarusian custom kitchen website city landing page. Subject: a practical attractive L-shaped kitchen in an ordinary modern apartment, exactly TWO perpendicular cabinet runs meeting in ONE corner, no third run, no peninsula or island. Viewed diagonally from the open dining area at eye level, 26 mm interior lens with straight verticals. Warm off-white matte upper cabinets to ceiling, muted sage lower cabinets, oak-look worktop with a continuous usable prep space, simple black handles. Sink on short run below a window, induction hob and built-in oven on long run, tall refrigerator housing at end. Natural soft daylight, clean neutral walls and light oak floor, subtle realistic joinery and surface texture, one small plant and a kettle. Well-built feasible cabinetry, correct appliance scale and door clearances, bright exposure and credible natural photographic detail. Clearly show the entire L shape and open floor, including cabinet bases and upper cabinets. No people, no text, no labels, no watermark, no logos, no collage. This is an illustrative design concept, not a claim of an actual completed local project.

## Проверки и ограничения

TypeScript в основной рабочей копии PASS. Изолированная production build с lint/type validation PASS; локальная БД 127.0.0.1:5434 недоступна, используется существующий fallback. Тесты Lead 6/6 PASS. После уточнения пользователя все дальнейшие UI-проверки выполняются во встроенном браузере Codex (IAB), не отдельным shell Playwright.

Начальный отдельный browser script был остановлен/заменён: networkidle оказался ненадёжным из-за сторонних запросов; старые страницы без main потребовали изменить extraction regression baseline. Эти попытки не считаются финальным PASS. Во встроенном браузере выявлены пустые картинки карточек и заменены на прямые готовые WebP.

Для проверки успешной формы используется локальный прокси http://127.0.0.1:3020 той же сборки: POST /kapi/leads перехватывается, сохраняет только тестовый payload и возвращает success без обращения к БД/Telegram. Production-форма проверяется на доступность и валидацию; реальный лид не создаётся.

Финальная локальная production build PASS. IAB Codex: 320×568, 390×844, 768×1024 и 1440×960 — один H1, self-canonical, 7 FAQ, overflow=false. Все шесть изображений после прокрутки имеют naturalWidth > 0; смена МДФ/шпона меняет src. Три переключения hero меняют src. Консоль без ошибок. Поля и согласие валидируются; тестовая форма показала успех. Payload содержит sourcePage /locations/zhodino, sourceType location, city Жодино, cityKey zhodino и выбранные Прямая/МДФ/Баланс цены и удобства. До готовности клиентских обработчиков кнопки выбора disabled, чтобы первый клик не терялся при hydration.

IAB evidence: iab-local-320/390/768/1440.jpg, iab-local-results.json и iab-form-payload.json. Lighthouse и полевые CWV после запроса проводить тесты только во встроенном браузере не измерены; не заявляется PASS числового LCP или общего CWV.

## Публикация и итоговая проверка

Runtime 4cc591a (предыдущий собственный коммит 30d85e1), ветка codex/zhodino-deploy-20261009, push выполнен. Сервер root@5.42.108.140, репозиторий /var/www/kuhni-na-zakaz, service kuhni-na-zakaz. Выпущен только diff Жодино от production 696e8f925c52c8b8a4cd4f6ab0025a3f0009b24e; чужие локальные изменения не публиковались. БД/schema и shared backend не менялись.

Финальная server build: lint/type validation PASS, 173/173 страницы сформированы. Две попытки финальной компиляции остановлены OOM/SIGKILL; успешная сборка выполнена отдельно от работающей версии с cpus=1, webpackMemoryOptimizations и временным дополнительным swap 4 ГБ. Временные next.config.ts/tsconfig.json восстановлены. Сервис после замены сборки active; production показывает новый H1/title/hero.

IAB production: viewport 320×568, 390×844, 768×1024, 1440×960 (clientWidth на 15 px меньше из-за полосы прокрутки), overflow=false, один H1, self-canonical, FAQ 7. Все шесть изображений после прокрутки naturalWidth > 0; сменяемые hero и МДФ/шпон декодируются. На первом мгновенном наблюдении отдельных новых src naturalWidth был 0 до загрузки; повторная визуальная проверка подтвердила загрузку. Выбор планировки/фасада/бюджета отражён в форме; необязательный комментарий доступен. Пустая production-форма показала ошибки имени, телефона и согласия; успешный POST проверен локальным перехватчиком без реального лида. FAQ раскрывается, JSON-LD содержит BreadcrumbList/WebPage/FAQPage с 7 вопросами. Ошибок консоли не обнаружено.

Все 19 уникальных целевых страниц исходной перелинковки открылись с ожидаемыми title/H1. Title/H1/canonical семи защищённых URL совпали с baseline. Содержимое section Борисова, угловых кухонь, дизайн-проекта, Минской области, Минска и фурнитуры совпало точно. На главной изменился только восстановленный сохранённый пользовательский выбор; после исключения этого динамического текста остальное совпало. Ничего в Борисове не изменено.

Прямое открытие /robots.txt и /sitemap.xml встроенный браузер блокирует net::ERR_BLOCKED_BY_CLIENT; их HTTP-ответ после релиза не подтверждён этим инструментом. Код robots/canonical не менялся, sitemap получил только lastModified Жодино 2026-10-09. Реальные позиции, индексация, доставка лида в БД/Telegram и числовые CWV этим выпуском не проверены. Запрос на переобход не отправлялся.

Production evidence в outputs/zhodino-implementation-2026-10-09/: iab-production-320/390/768/1440.jpg, iab-production-results.json, iab-protected-before.json, iab-protected-after.json, iab-link-results.json. Runtime-файлы: data/zhodino-page.ts, components/locations/zhodino/ZhodinoPage.tsx и ZhodinoShowroom.tsx, ветка zhodino в app/locations/[city]/page.tsx, app/sitemap.ts, public/uploads/locations/zhodino-20261009/.

## Откат и следующий чат

После сборки временный swap отключён и удалён. Tracked дерево сервера чистое; HEAD 4cc591a7c04097ca046abe5f4afb84ccaba6a67f, service active, backup BUILD_ID сохранён.

Предыдущая действующая сборка сохранена: /var/www/kuhni-na-zakaz/artifacts/kuhni-na-zakaz/.next-before-zhodino-4cc591a; её код 696e8f925c52c8b8a4cd4f6ab0025a3f0009b24e. Для отката остановить service, сохранить новую .next под отдельным именем, вернуть эту backup-сборку в .next, восстановить код 696e8f9 и запустить service; БД не откатывать. Проверить страницу и защищённые URL встроенным браузером.

Для следующей задачи сначала проверить текущий production HEAD: не деплоить старую ветку work или весь основной dirty diff. Не создавать отдельные URL под словоформы Жодино. Яндекс SERP требует ручного решения капчи пользователем; частоты без новых данных не обновлять. Дальнейшие UI-тесты проводить только во встроенном браузере Codex.
