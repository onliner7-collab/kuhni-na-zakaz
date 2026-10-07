# Борисов: мобильный визуальный подбор

Маршрут: `/locations/borisov`. Основание релиза: production `7d90382985a31136358846e89b874be829ab6723`. Только Борисов; остальные городские страницы не масштабируются автоматически.

## Diff-аудит и контракт

| Блок | Решение | Результат |
| --- | --- | --- |
| Hero | ADAPT | Существующий быстрый hero сохранён, H1 и lead короче |
| Планировки | ADAPT | Прямая, угловая, П-образная, остров; выбор меняет фото |
| Повтор углового фото | REPLACE | Четыре идеи под квартиру, дачу, деревню и частный дом |
| Стили/пожелания | MOVE/ADAPT | Визуальный выбор четырёх стилей; материал и цвет раскрываются отдельно |
| Бюджет | ADAPT | Три коротких пункта, факторы цены в details; нет выдуманных цен |
| Этапы | ADAPT | Четыре визуальных этапа, подробные семь в details |
| Форма | MOVE | Перед FAQ; выбранные scenario/idea/layout/style/materials/color передаются в answers |
| Локальные факты | ADAPT | Производственный/юридический адрес из CONTACT_DEFAULTS, условия района согласуются |
| FAQ | ADAPT | Первые пять + ещё четыре в details; единый источник с JSON-LD сохранён |
| Footer | ADAPT | Только Борисов: группы сворачиваются на мобильном; контакты видимы |

Основные якоря `types`, `local-proof`, `process`, `calculation`, `measure` сохранены. Title, description, canonical, URL и schema не изменены. Общие запросы принадлежат существующим категориям, городские — Борисову. Материал/цвет в выборе — пожелание для проекта, фото не обещает точную комплектацию. AI-фото подписаны как идеи дизайна. Реальные объекты, отзывы, размеры, цены и гарантии не придуманы.

Новые API/зависимости и изменения backend отсутствуют. Локальный тест формы использует отдельный HTTP proxy, который перехватывает `/kapi/leads` и никогда не отправляет заявку в backend.

## Медиа

Встроенный Codex/OpenAI `imagegen`, 7 октября 2026. Серия `borisov-housing-20261007`, статус после визуального просмотра: MEDIA_ACCEPTED. Четыре независимых идеи; это не ракурсы одного объекта. Между независимыми идеями геометрия не фиксируется. Нет людей, брендов, встроенного текста, логотипов или водяных знаков. Проверены пропорции шкафов, мойка/плита, форма помещения и читаемость на мобильном. Используются только на Борисове.

Исходники и производные: `artifacts/kuhni-na-zakaz/public/media/borisov-20261007/`. PNG сохранены; UI подключает только WebP. Полная версия 1200×800, мобильная 480×320; качество WebP 78.

| Имя | Сюжет | WebP 1200 / 480, байт |
| --- | --- | --- |
| apartment | Компактная светлая прямая кухня для квартиры | 57178 / 11980 |
| dacha | Зелёная кухня для дачи, открытая полка | 74260 / 16140 |
| village | Кремовая угловая кухня для деревенского дома | 74256 / 17234 |
| country | Графитовая кухня с островом для загородного дома | 85720 / 17554 |

Русские alt хранятся в BorisovKitchenPicker. Подпись: «Идеи дизайна, созданные с помощью ИИ». Кухни не обозначены выполненными заказами.

## Финальные prompts встроенного imagegen

**apartment**

Use case: photorealistic-natural. Asset type: kitchen design idea photograph for a Russian custom kitchen website, landscape 3:2. Subject: compact straight Scandinavian kitchen in a modest Belarusian apartment, pale warm white flat cabinet fronts, natural oak laminate countertop, useful upper cupboards to the ceiling, single built-in oven, induction hob with extractor, single sink with one faucet. Scene: small realistic room, window daylight, pale neutral walls, practical uncluttered surfaces. Composition: professional interior photograph at eye level, complete kitchen cabinetry clearly visible, natural perspective, tactile real materials. Constraints: realistic buildable kitchen, no people, no words, no logos, no watermark, no collage, no oversized luxury room, no CGI appearance.

**dacha**

Use case: photorealistic-natural. Landscape 3:2 interior photograph for custom kitchen design ideas. A small practical straight kitchen for a Belarusian summer cottage, Scandinavian style: muted sage green flat cabinet doors, light oak worktop, limited upper cabinetry and open oak shelf, single sink, small electric hob and compact oven, freestanding refrigerator at edge. Simple white painted wooden cottage walls, window facing garden, authentic modest welcoming interior, subtle kettle and two cups. Eye level professional architectural photo, entire cabinetry visible, soft daylight, real texture. No people, text, logos, watermark, collage, artificial CGI look or luxury mansion.

**village**

Use case: photorealistic-natural. Landscape 3:2 realistic architectural photograph. Custom angular L-shaped kitchen in a renovated modest Belarusian village house, warm cream neoclassical shaker doors with restrained framing, oak countertop, small black handles, single sink underneath window, oven and hob along adjacent wall, enclosed corner cabinetry, ample practical drawers. Plastered walls and subtle wooden ceiling beam, garden outside, cozy natural daylight, lived-in but tidy. Entire L shape clearly visible from doorway at eye level, realistic cabinet proportions and buildable layout. No people, text, logos, watermark, collage, CGI or exaggerated luxury.

**country**

Use case: photorealistic-natural. Landscape 3:2 professional interior photograph. Spacious yet realistic custom kitchen in a Belarusian suburban family home, modern restrained loft style, matte charcoal flat cabinets, warm oak tall units, stone-look light worktop, usable central island without a sink with two stools, main sink and induction hob placed separately along the wall, built-in oven. Large garden window, neutral plaster and a small brick accent wall, daylight, real textures, tidy and practical. Wide eye-level composition showing complete island and main cabinetry with generous walkways, physically plausible appliances and doors. No people, text, logos, watermark, collage, glossy CGI, extreme luxury.

## Проверка и выпуск

Локальная production-сборка завершена, типизация успешна. Локальная БД недоступна: сборка использовала предусмотренный fallback контента. Финальные мобильные проверки, серверная сборка с production БД, деплой и smoke фиксируются ниже после выполнения.

Rollback: вернуть предыдущий `.next` из `/var/www/kuhni-na-zakaz/.deploy-backups/next-before-borisov-showroom-20261007`, перезапустить сервис; source откатывается отдельным revert scope-коммита, без сброса сторонних данных. БД/schema не меняются.
