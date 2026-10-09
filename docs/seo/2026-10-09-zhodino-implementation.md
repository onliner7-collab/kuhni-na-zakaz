# Жодино: информативная страница покупки кухни

Дата: 09.10.2026. URL: https://kuhni.minsk.by/locations/zhodino.

Статус: внедрение готово, финальная проверка встроенным браузером и деплой в работе. Последнее прямое поручение пользователя разрешает деплой и заменяет прежнее ограничение обсуждением.

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

Смена материала меняет иллюстрацию и краткое объяснение; выбор бюджета сохраняет пожелание. Компоненты выбора не превращаются в калькулятор выдуманных цен. Пользовательский выбор передаётся в answers.zhodinoKitchenSelection с layout, view, material, budget; sourcePage /locations/zhodino, sourceType location, city Жодино, cityKey zhodino. Форма использует существующую валидацию и backend, новых endpoint, загрузок и внешних интеграций нет.

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

IAB evidence: iab-local-320/390/768/1440.jpg, iab-local-results.json и iab-form-payload.json. Lighthouse и полевые CWV после запроса проводить тесты только во встроенном браузере не измерены; не заявляется PASS числового LCP или общего CWV. Финальный коммит, серверная сборка и откат добавляются после публикации.
