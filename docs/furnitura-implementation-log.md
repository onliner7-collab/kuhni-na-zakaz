# Лог внедрения `/materials/furnitura`

Дата: 2026-06-02

## Статус этапа 2

Этап 2 выполнен локально: создан SEO-каркас страницы `/materials/furnitura`, добавлена карточка на `/materials`, URL добавлен в sitemap.

## Измененные файлы

- `artifacts/kuhni-na-zakaz/app/materials/furnitura/page.tsx`
- `artifacts/kuhni-na-zakaz/app/materials/page.tsx`
- `artifacts/kuhni-na-zakaz/app/sitemap.ts`
- `docs/seo-materials-furnitura-audit.md`
- `docs/furnitura-implementation-log.md`
- `docs/furnitura-deploy-indexing-report.md`

## Что добавлено на страницу

- Breadcrumbs: Главная / Материалы / Фурнитура.
- Hero с H1 `Фурнитура для кухни на заказ`, подзаголовком и CTA.
- Блок о важности фурнитуры при заказе кухни.
- Категории фурнитуры:
  - петли;
  - направляющие;
  - подъемные механизмы;
  - ручки, профили и кухни без ручек;
  - системы хранения;
  - доводчики;
  - угловые системы;
  - цокольная и монтажная фурнитура;
  - фурнитура для столешниц и стеновых панелей;
  - фурнитура для встроенной техники;
  - подсветка и электрофурнитура;
  - уплотнители, демпферы и заглушки.
- Сравнительная таблица по задачам кухни.
- Блок выбора фурнитуры по бюджету.
- Внутренние ссылки на материалы, цены, портфолио и 3D-проект.
- FAQ из 8 вопросов.
- Финальный CTA с формой.

## SEO

- Title: `Фурнитура для кухни на заказ в Минске | Петли, направляющие, доводчики`.
- Description добавлен в metadata.
- Canonical: `/materials/furnitura`.
- Robots: `index, follow`.
- Open Graph добавлен.
- JSON-LD:
  - `BreadcrumbList`;
  - `WebPage`;
  - `FAQPage`.
- `Product`, fake reviews и rating не добавлялись.

## Доступность и responsive

- Используются семантические `main`, `section`, `nav`, `table`, `details/summary`.
- У навигации есть `aria-label`.
- Иконки помечены `aria-hidden`.
- CTA-ссылки имеют видимый текст и focus-visible стили.
- Таблица обернута в горизонтальный контейнер для мобильных экранов.

## Проверки 2026-06-02

- `pnpm run typecheck` — успешно.
- `pnpm run sitemap:check` — успешно, но с предупреждениями Prisma из-за недоступной локальной БД `127.0.0.1:5434`; статический sitemap fallback проверен.
- `pnpm run build` — успешно. Во время сборки также были Prisma-предупреждения по локальной БД, но сборка завершилась без ошибки.
- Локальный HTTP `http://127.0.0.1:3012/materials/furnitura` — 200 OK.
- Browser desktop:
  - H1: 1;
  - canonical: `https://kuhni.minsk.by/materials/furnitura`;
  - noindex: нет;
  - горизонтального overflow нет.
- Browser mobile 390px:
  - H1: 1;
  - canonical корректный;
  - noindex: нет;
  - горизонтального overflow нет.
- `/materials` локально содержит ссылку `/materials/furnitura`.
- `/sitemap.xml` локально содержит `https://kuhni.minsk.by/materials/furnitura`.
- `/robots.txt` локально доступен и содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`.
- Commit `c23faf4 Add kitchen hardware materials page` создан и отправлен в `origin/work`.
- Production deploy выполнен через Timeweb update script.
- Production `/materials/furnitura` отвечает 200 OK.
- Production `/materials` содержит ссылку на `/materials/furnitura`.
- Production sitemap содержит `https://kuhni.minsk.by/materials/furnitura`.
- Production robots.txt доступен и не блокирует страницу.
- Google Search Console: URL отправлен на индексирование через встроенный браузер.
- Yandex Webmaster: URL отправлен в очередь переобхода через API, sitemap уже добавлен.

## Что не входит в этап 2

- Полная галерея и lightbox для фурнитуры не добавлялись: это этапы 3-4.
- Изображения фурнитуры не генерировались: это этап 3 и следующие.
- Production deploy и отправка на индексацию фиксируются отдельно после успешных проверок и доступного push/deploy.

---

## Статус этапов 3-4

Дата обновления: 2026-06-02

Этапы 3 и 4 реализованы локально.

### Этап 3: изображения

- Добавлена базовая партия: 1 hero + 50 изображений галереи.
- Итоговая папка: `artifacts/kuhni-na-zakaz/public/images/materials-gallery-v2/furnitura`.
- Формат: `.webp`.
- Размеры: hero 1600x900, галерея 1200x675.
- Создан технический JSON-реестр: `public/images/materials-gallery-v2/furnitura/registry.json`.
- Создан обязательный отчет: `docs/furnitura-images-registry.md`.
- Создан файл промтов: `docs/furnitura-image-generation-prompts.md`.
- Live-догенерация через image provider не выполнена: `openai` вернул `Billing hard limit has been reached`. Использованы локальные демонстрационные исходники из `новые фото`, конвертированные и кадрированные в 16:9.

### Этап 4: галерея и lightbox

- Добавлен компонент `components/sections/FurnituraHardwareGallery.tsx`.
- Компонент переиспользует существующий `components/ui/ImageLightbox.tsx`.
- Реализованы hover, click-to-open, закрытие по Esc, клик вне изображения, стрелки, keyboard navigation и mobile swipe.
- Использованы кнопки с русскими `aria-label`, уникальные alt и стабильный `aspect-video` без layout shift.
- Папка `/images/materials-gallery-v2/furnitura/` добавлена в disclosure-логику как демонстрационная/generated зона.
- На странице добавлен дисклеймер: демонстрационные изображения не являются фотографиями выполненных проектов.

### Измененные файлы этапов 3-4

- `artifacts/kuhni-na-zakaz/app/materials/furnitura/page.tsx`
- `artifacts/kuhni-na-zakaz/components/sections/FurnituraHardwareGallery.tsx`
- `artifacts/kuhni-na-zakaz/lib/image-disclosure.ts`
- `artifacts/kuhni-na-zakaz/public/images/materials-gallery-v2/furnitura/*`
- `docs/furnitura-images-registry.md`
- `docs/furnitura-image-generation-prompts.md`
- `docs/furnitura-responsive-a11y-report.md`

---

## Статус этапов 5-6

Дата обновления: 2026-06-03

Этапы 5 и 6 реализованы локально.

После уточнения пользователя производные изображения для этапов 5-6 заменены на 100 новых AI-generated изображений, созданных встроенным `image_gen`. PNG-исходники сохранены локально в `.tmp/generated-furnitura-stage56`, итоговые WebP-файлы записаны в `artifacts/kuhni-na-zakaz/public/images/materials-gallery-v2/furnitura`. Provider `imgx/openai` для этой партии был недоступен из-за `Billing hard limit has been reached`.

### Этап 5: продвинутая фурнитура

Добавлено по 5 изображений для 10 позиций:

- Петля 165°.
- Push-to-open петля.
- Push-to-open направляющие.
- Высокий ящик для кастрюль.
- Внутренний ящик.
- Ящик под мойку.
- Бутылочница.
- Складной подъемник.
- Параллельный подъемник.
- Интегрированная ручка.

### Этап 6: угловые, специальные системы и фурнитура для техники

Добавлено по 5 изображений для 10 позиций:

- Карусель.
- Magic corner.
- Складной угловой фасад.
- Выдвижные корзины.
- Регулируемые ножки.
- Цокольная планка.
- Вентиляционная решетка в цоколе.
- Крепление фасада посудомоечной машины.
- Направляющие фасада встроенного холодильника.
- Вентиляционные элементы для техники.

### Что изменено

- Галерея расширена с 50 до 150 изображений.
- Реестр `registry.json` и TypeScript-реестр синхронизированы.
- У hero исправлен битый alt-текст.
- На странице добавлен SEO-блок `Продвинутая фурнитура, угловые системы и решения для техники`.
- Галерея теперь группирует изображения по партиям: базовая фурнитура, продвинутая фурнитура, угловые и специальные системы.
- Обновлены `docs/furnitura-images-registry.md` и `docs/furnitura-image-generation-prompts.md`.

### Проверка изображений

- Всего в папке `public/images/materials-gallery-v2/furnitura`: 151 `.webp`.
- Всего в реестре: 151 запись.
- Для этапов 5-6: 100 новых AI-generated изображений, не производные от локального source pool.
- Hero: 1600x900.
- Галерея: 1200x675.
- У всех изображений уникальные русские alt.
- Битой кириллицы `???` в реестрах не найдено.
- Изображения остаются демонстрационными и не выдаются за реальные выполненные проекты.


---

## Статус этапа 7

Дата обновления: 2026-06-03

Этап 7 реализован локально: добавлена финальная партия из 50 отдельных изображений и контентный блок про подсветку, электрику, планки для столешницы, демпферы, заглушки и уплотнители.

- По 5 изображений для 10 позиций: LED-профиль; LED-лента; Сенсорный выключатель; Встроенный розеточный блок; Стыковочная планка для столешницы; Торцевая планка; Пристеночный бортик; Силиконовые демпферы; Заглушки для крепежа; Уплотнители.
- 50 отдельных PNG-генераций сохранены как проектные источники в `.tmp/generated-furnitura-stage7/final-sources`; 1 неудачный split-screen кадр отбракован и не подключен.
- Галерея расширена с 150 до 200 изображений, без учета hero.
- Общий реестр: 201 запись, включая hero.
- На страницу добавлен третий блок в секцию про продвинутую фурнитуру и спецсистемы.
