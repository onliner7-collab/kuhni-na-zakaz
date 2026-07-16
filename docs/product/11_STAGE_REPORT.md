# Отчёт этапа 4.5 — Product Architecture

Дата: 2026-07-16. Ветка: `work`. Baseline до документационных изменений: `ede1f2d25f92237494a24606bd2d9ab9aa3e70fa`.

## Выполнено

Создан единый продуктовый каркас: принципы, пользовательские пути, новая навигационная модель, постоянный Dock, карточное меню, карта переходов, правила экранов/языка/медиа, матрица уникальности и план адресного внедрения.

## Предложенное меню

- Выбрать кухню — карточная группа: форма, стиль, назначение, материалы, механизмы, цена.
- Идеи кухонь — `/catalog`.
- Из чего состоит кухня — `/materials`.
- Наши работы — `/portfolio`, только подтверждённые реальные объекты.
- Цены — `/prices`.
- Полезные статьи — `/blog`.
- Второй уровень: 3D-проект, где работаем, о компании, отзывы, доставка и монтаж, гарантия, контакты.

## Каталог и портфолио

- Каталог отвечает «Что можно выбрать и заказать?» и допускает концепты/визуализации.
- Портфолио отвечает «Что компания реально сделала?» и проходит provenance gate.
- Всё без подтверждения относится к идеям/визуализациям.
- Текущий `/portfolio` содержит generated cases; это backlog данных/интерфейса, а не подтверждённое «Наши работы».

## Глобальный Dock

Постоянный порядок:

`Выбрать / Цены / Наши работы / Оставить заявку`.

Dock покрывает все публичные UI-страницы, включая calculator и legal. Исключения: `/admin`, `/kapi`, `/robots.txt`, `/sitemap.xml`, `/thanks`, API/route handlers и непользовательские технические поверхности.

Кнопка «Оставить заявку» открывает короткий LeadFormSheet в одно действие. Первый шаг: имя, телефон или способ связи, submit. Дополнительные данные необязательны. Существующая Telegram/outbox логика сохраняется.

## Спроектированные пути

- основной последовательный выбор;
- путь от изображения/идеи;
- путь из статьи;
- путь из локации;
- путь из материала;
- путь из подтверждённого проекта;
- короткая заявка с любой страницы.

## Текущие тупики и расхождения

- `/styles` hub не даёт полноценного контекстного перехода к форме, материалам, работам и цене;
- `/scenarios` hub слабо связывает сценарий с категориями/материалами/работами/ценой;
- на главной видна техническая подпись «SEO-страница категории»;
- блок «Реальные кухни» содержит 3D-визуализации;
- `/portfolio` смешивает generated и потенциально реальные записи;
- empty states некоторых DB-backed hubs говорят о внутреннем хранилище/импорте;
- текущий Dock меняет весь состав по маршрутам и не является постоянной глобальной навигацией.

## Сохранить

- URL/canonical/search intent;
- Server Component shells и crawlable links;
- действующую Lead/Telegram модель;
- плавающий баннер и его поведение;
- проверенные pilot components и media lifecycle;
- русские alt/caption и AI disclosure;
- safe-area/reduced-motion patterns.

## Адаптировать

- Header и карточные группы к пользовательским названиям;
- MobileBottomNav к постоянному составу;
- контекстные Dock actions в PageActionRail;
- формы к короткому первому шагу;
- catalog/portfolio presentation к provenance split;
- hub transition blocks и empty states.

## Риски

- историческая коллизия нумерации этапов;
- нет структурного provenance field, достаточного для автоматического допуска в «Наши работы»;
- `getImageDisclosure` частично классифицирует по пути;
- изменение shared chrome затронет все public routes;
- длинная подпись «Оставить заявку» требует проверки 360 px;
- плавающий баннер, Dock, sheets и клавиатура могут конфликтовать по z-index/overlap;
- field CWV не измерялся в этом docs-only этапе.

## Production-код

Не менялся. Не менялись UI, routes, metadata, sitemap, robots, canonical, forms, Prisma и media. Новые финальные изображения не создавались.

## Проверки этапа

- обязательные документы и проверенный код изучены;
- live production baseline проверен на 390 px;
- branch/status/HEAD/origin проверены;
- создано ровно 12 обязательных файлов `docs/product/00_*`–`11_*`;
- в commit этапа подготовлено 22 файла: только `AGENT.md` и `docs/**`; две появившиеся параллельно незастейдженные правки production-файлов не относятся к этапу и исключены из commit;
- UTF-8 strict decode: ошибок нет; BOM: 0; подозрительной mojibake: 0;
- локальные Markdown-ссылки: битых ссылок нет;
- `git diff --check`: ошибок нет;
- `pnpm.cmd run sitemap:check`: passed, 112 URL; dynamic URLs были недоступны, использован предусмотренный static fallback;
- typecheck/build не запускались: этап меняет только Markdown и `AGENT.md`, production-код и runtime assets не затронуты.

## Готовность

После документационных проверок проект готов к отдельному `Product этапу 5 — глобальная навигация`. Реализация должна начинаться с shared-component usage audit и route matrix, а не с массового редизайна страниц.

## Точный текст следующему чату

```text
Сначала прочитай /AGENT.md, /docs/00_MASTER_PLAN.md, /docs/15_HANDOFF.md и все /docs/product/*.md. Проверь git status, ветку work, текущий HEAD/origin и фактические Header.tsx, PublicChrome.tsx, MobileBottomNav.tsx, FloatingSocialButtons.tsx, lib/mobile-dock.config.js, ContactForm и Telegram Lead pipeline. Выполни PRODUCT ЭТАП 5 — ГЛОБАЛЬНАЯ НАВИГАЦИЯ. Сделай меню по пользовательской логике и постоянный мобильный Dock строго в порядке «Выбрать / Цены / Наши работы / Оставить заявку» на всех публичных UI-страницах, включая /calculator и legal; исключи /admin, /kapi, /robots.txt, /sitemap.xml, /thanks, API/route handlers и технические поверхности. Текущие page-specific Dock actions перенеси в нефиксированный PageActionRail, не создавай второй fixed Dock. «Оставить заявку» должна за одно действие открывать короткий LeadFormSheet с именем, телефоном/способом связи и submit, сохраняя действующую /kapi/leads и Telegram/outbox логику. FloatingSocialButtons не удаляй и не меняй его движение без отдельного решения. Не меняй URL, metadata, sitemap, robots, Prisma и страницы вне доказанного shared scope. Проверь 360/390/412/768/1440, safe-area, keyboard/focus/Escape, reduced motion, overlap, active states, server links, sitemap, typecheck/build и production после отдельного разрешённого deploy. Обнови registries, Decision Log и Handoff.
```
