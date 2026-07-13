# Этап 2 — обзор трёх пилотов

Дата reverse-audit: 2026-07-13. Baseline этапа 2: `6f78fbb` (`docs: establish engineering project baseline`). Production-код на этом этапе не изменяется.

## Источники и метод

- Проверен фактический App Router, page-компоненты, client islands, данные, metadata, JSON-LD, Dock config и media registries.
- Локальный production-like DOM проверен во встроенном браузере на 360, 390, 412, 768 и 1440 px. Production до деплоя не открылся во встроенном браузере из-за тайм-аута; это не считается live UI-проверкой.
- Оценка JS — raw bytes фактически подключённых локальных script-файлов существующей сборки; это не gzip/brotli transfer и не CWV.
- Lighthouse/field CWV не запускались. CLS/LCP/INP ниже отмечены как риски, а не как измеренные значения.

## Сводка текущего состояния

| Страница                 | Фактическая реализация                                                                                         | 390 px DOM / images / высота main |     Raw JS | Что сохраняем                                                                                                     | Что заменяем при реализации                                                                                                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- | --------------------------------: | ---------: | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/catalog/uglovye-kuhni` | `app/catalog/[slug]/page.tsx` → server `AngularKitchenPage` → client `AngularKitchenShowroom`                  |                 700 / 5 / 9709 px |  972.2 KiB | URL, server route, hero disclosure, малый интерактивный остров, Dock, форма, HTML-секции, AVIF/WebP               | ручную смену ракурсов без swipe; 12 кадров без intent-prefetch; слабую семантику tabs; пересечение schema FAQ с невидимым FAQ; частично одинаковый hero-паттерн                                           |
| `/locations/borisov`     | `app/locations/[city]/page.tsx` → `RegionalLocationPage` → server `BorisovPilotPage` → client `BorisovJourney` |                 679 / 3 / 8401 px |  963.8 KiB | URL, local data source, честное разделение AI/real, проверку local cases, Dock, форму, server shell               | 4 шага вместо 7; декоративный выбор без передачи данных; одинаковый full-screen hero-паттерн; schema FAQ без видимого FAQ; неподтверждённые сроки/адресные claims из shared data/schema                   |
| `/materials/furnitura`   | server `app/materials/furnitura/page.tsx` + client `HardwareShowroom` + client gallery/lightbox                |             2894 / 203 / 57839 px | 1030.5 KiB | URL, canonical, server HTML, отдельный technical visual family, quiz concept, Dock, форма, 6 pilot media families | initial DOM из 201 gallery item; длинную энциклопедическую ленту; псевдо-hotspots; брендовые/ресурсные claims без источников; Article/ImageObject over-markup; mobile table/scroller как основной паттерн |

Raw JS включает framework/shared shell. Разница страницы фурнитуры относительно двух других — около 58–67 KiB raw, но главный подтверждённый риск страницы — DOM и 201 gallery image, а не только JS.

## Mobile evidence

- На 360/390/412/768/1440 px у всех трёх страниц `overflowX = 0`, один H1, корректный canonical и ни одного завершившего загрузку битого изображения.
- Mobile Dock: угловые — `Планировка / Внутри / Цена / Рассчитать`; Борисов — `Виды / Процесс / Стоимость / Замер`; фурнитура — `Механизмы / Сравнить / Комплектация / Подобрать`.
- На 390 px Dock имеет высоту 68 px, fixed-position, а main получает 104 px нижнего padding. На 1440 px Dock `display:none`, padding снимается.
- Общий mobile shell содержит ссылки высотой 28–36 px. Формы содержат поля высотой 40 px. Угловая страница дополнительно имеет chips 40–42 px; Борисов — inline link 19 px; фурнитура — breadcrumb 20 px и FAQ summary около 24 px. Это не соответствует будущему минимуму 44 px.
- На 360–412 px нет доказанного horizontal overflow, но высота `/materials/furnitura` 55–60 тыс. px делает сценарий чрезмерно длинным.

## Решение preserve / replace

### Сохранить как contract

- Три URL, canonical, один H1, breadcrumb, crawlable links, server-rendered смысловой текст и существующие формы/API.
- Route-level Server Components; интерактивы — небольшие Client Components.
- Существующий Context Dock config и ровно четыре действия на mobile.
- Русские alt/caption и явную маркировку AI-концептов/иллюстраций.
- Media master + AVIF/WebP, один critical hero, остальные media lazy.

### Сохранить условно

- Текущие pilot media можно переиспользовать только после этапа 3: provenance, consistency, composition, mobile crop и manifest должны быть подтверждены.
- Текущие цены/сроки/гарантии/адресные данные не переносить автоматически. Нужна бизнес-проверка.
- Shared `ContactForm`, `PublicChrome` и Dock не переписываются в пилотах без отдельной regression matrix.

### Заменить в этапах 4–7

- Один и тот же full-viewport hero-каркас для угловых и Борисова: сохранить общую доступность, но развести композицию и входное действие.
- Невидимый FAQ JSON-LD: либо вывести совпадающий FAQ в HTML, либо удалить FAQ schema в отдельном SEO-изменении.
- Tabs без `aria-controls`, roving focus и Arrow key handling.
- Gallery фурнитуры: не монтировать 201 кнопку/изображение сразу; категории монтировать по намерению, с ограниченным initial set.
- Декоративные интерактивы, которые не влияют на заявку и не дают пользователю понятный результат.

## Различие пилотов

- Угловые кухни: пространство и доступ к углу; пользователь сравнивает планировку и хранение.
- Борисов: временная последовательность заказа; пользователь понимает местный производственный процесс.
- Фурнитура: причинно-механическая модель; пользователь понимает движение механизма и уровень комплектации.

Подробные решения: `01_ANGULAR_KITCHENS_SPEC.md`, `02_BORISOV_SPEC.md`, `03_HARDWARE_SPEC.md` и `07_PILOT_UNIQUENESS_MATRIX.md`.
