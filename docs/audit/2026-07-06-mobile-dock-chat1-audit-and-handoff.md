# Чат 1: аудит, архитектура и безопасная подготовка мобильного Dock-меню

Дата: 2026-07-06  
Проект: `C:\Users\User\Desktop\kuhni-na-zakaz`  
Сайт: `https://kuhni.minsk.by`  
Статус: подготовка выполнена, финальный Dock-интерфейс не внедрялся.

## 1. Технология сайта

- Стек: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4.
- Публичная оболочка сайта: `artifacts/kuhni-na-zakaz/components/layout/PublicChrome.tsx`.
- Глобальный layout: `artifacts/kuhni-na-zakaz/app/layout.tsx`.
- Глобальные стили: `artifacts/kuhni-na-zakaz/app/globals.css`.
- Иконки уже есть через `lucide-react`, поэтому для Dock не нужен отдельный сетевой набор иконок.
- Сборка и деплой идут из `artifacts/kuhni-na-zakaz`, production-скрипт: `deploy/scripts/update-production.sh work`.

## 2. Существующее нижнее мобильное меню

Найдено существующее меню:

- Файл: `artifacts/kuhni-na-zakaz/components/layout/MobileBottomNav.tsx`.
- Подключение: `PublicChrome.tsx`, после `Footer`.
- CSS/позиционирование: Tailwind-классы прямо в компоненте, `fixed inset-x-0 bottom-0 z-[70] ... md:hidden`.
- Нижний отступ контента: `PublicChrome.tsx`, `<main className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">`.
- Активное состояние: локальный `activeHref` плюс scroll-listener по `sectionId`.

Почему часть меню отправляет на главную:

- Для `/prices` первый пункт явно `{ label: "Главная", href: "/", icon: Home }`.
- Для `/catalog*`, `/portfolio*`, `/locations*` и fallback-конфига также есть пункт `Главная`.
- Это не контекстное меню по типу страницы, а общий компонент с условиями по `pathname`.

Дублирования HTML Dock в шаблонах не найдено: меню централизовано в `MobileBottomNav.tsx`.

## 3. Карта типов страниц

| URL / тип URL | Тип Dock | Текущая реализация |
| --- | --- | --- |
| `/` | `home` | `app/page.tsx` + `HomeMobileShowroom.tsx` |
| `/prices` | `prices` | `app/prices/page.tsx` + `InteractivePricesCatalog.tsx` |
| `/design-proekt-kuhni` | `designProject` | `app/design-proekt-kuhni/page.tsx` + `DesignProjectInteractive.tsx` |
| `/portfolio` | `portfolio` | `app/portfolio/page.tsx` + `PortfolioFilters.tsx` |
| `/portfolio/[slug]` | `project` | `app/portfolio/[slug]/page.tsx` + `ProjectGallery.tsx` |
| `/locations/[city]` | `location` | динамическая страница города |
| `/locations/minsk`, `/locations/minskaya-oblast` | `regionalLocation` | `RegionalLocationPage.tsx` |
| `/catalog/[slug]` | `category` | динамическая категория кухни |
| `/materials` | `materialsIndex` | индекс материалов |
| `/materials/[slug]` | `materials` | динамическая страница материала |
| `/styles/[slug]` | `style` | страница стиля, нужна отдельная проверка перед чатом 2 |
| `/contacts`, `/calculator`, `/about`, `/reviews`, `/blog/*` | fallback или отдельный будущий тип | не включать без отдельной карты целей |
| `/privacy-policy`, `/personal-data`, `/terms`, `/thanks`, `/admin/*`, `/kapi/*` | disabled | Dock лучше не показывать |

## 4. Подготовленный конфиг

Создан файл:

- `artifacts/kuhni-na-zakaz/lib/mobile-dock.config.js`

Он пока не подключен к сайту. В нем зафиксированы:

- breakpoint `767px`;
- offset для sticky header и Dock;
- типы страниц и 4 пункта для каждого типа;
- отключенные служебные URL;
- `fallbackTarget` для действий формы;
- пометки `requiredIdStatus`, где во втором чате нужно добавить стабильный `id`.

## 5. Таблица целей меню

| Тип | 4 пункта | Реальные цели сейчас | Что добавить во втором чате |
| --- | --- | --- | --- |
| `home` | Подобрать, Проекты, Цены, Расчёт | `#selector`, `#projects`, `#prices`, `#calculate` существуют | action `open-calculation-form` должен фокусировать форму в `#calculate` |
| `prices` | Стили, Варианты, Расчёт, Заявка | `#styles`, `#catalog`, `#calculate` существуют | action заявки использовать `#calculate`; не возвращать на `/` |
| `designProject` | Форма, Стиль, Материалы, Проект | `#idea-builder`, `#visual-gallery`, `#materials-eye`, `#request` существуют | action `open-design-form` должен вести к `#request` или открывать существующий выбор/модалку без нового тяжелого JS |
| `portfolio` | Все, Стили, Планировки, Похожую | `#portfolio-catalog-heading`, `#portfolio-request` существуют | лучше добавить `id` на контейнер фильтров: `#styles-filter`, `#layouts-filter`, `#all-projects` |
| `location` | Проекты, Цены, Отзывы, Замер | `#form` существует; блоки проектов/цен/отзывов есть, но без стабильных `id` | добавить `#location-projects`, `#location-prices`, `#location-reviews`; отзывы опциональны, если отзывов нет |
| `regionalLocation` | Проекты, Цены, Отзывы, Замер | `#form` существует; для Минска есть `#minsk-measurement`, но нет унифицированных целей | добавить те же `#location-*` на реальные секции |
| `category` | Примеры, Планировки, Стоимость, Расчёт | `#catalog-gallery-heading`, `#form` существуют | добавить `#catalog-layouts`, `#catalog-prices` |
| `materialsIndex` | Фасады, ЛДСП, Фурнитура, Расчёт | все пункты могут быть ссылками на реальные страницы или `/contacts#form` | можно включать без DOM-якорей |
| `materials` | Фото, Стоимость, Примеры, Подобрать | заголовок галереи имеет динамический `id` вида `material-detail-gallery-${slug}`; форма есть в сайдбаре, но без `#form` | добавить стабильные `#material-detail-gallery`, `#material-price`, `#material-projects`, `#form` |
| `project` | Фото, Материалы, Цена, Похожую | `#project-gallery-heading`, `#project-specs-heading`, `#project-request`; `#project-used-heading` опционален | если материалов нет, пункт Материалы скрывать и не подставлять главную |
| `style` | Примеры, Цены, Материалы, Расчёт | не проверялось полностью в DOM в чате 1 | перед внедрением добавить/подтвердить `#style-projects`, `#style-prices`, `#style-materials` |

Важное правило для чата 2: если целевой `id` не найден в DOM, пункт не рендерить. Запрещено заменять его на `/`.

## 6. Конфликты и fixed-элементы

Найдены потенциальные конфликты:

- `MobileBottomNav.tsx`: текущий bottom-nav `z-[70]`, должен быть заменен или выключен при новом Dock.
- `FloatingSocialButtons.tsx`: mobile `bottom-36`, `z-40`; при открытии может занимать нижнюю часть экрана.
- `Header.tsx`: sticky header, `z-50`, при открытии мобильного меню `z-[90]`.
- `InteractivePricesCatalog.tsx`: модалка модели `z-[80]`, полноэкранный просмотр `z-[90]`.
- `ImageLightbox.tsx`: lightbox `z-50`.
- `DesignProjectInteractive.tsx`: собственная мобильная sticky-панель `#design-mobile-sticky-panel`, `z-40`, и модалка `z-50`.
- `Toaster`: подключен в root layout, возможны перекрытия тостов.
- Формы `ContactForm`: текущий `MobileBottomNav` скрывается при фокусе input/textarea/select; новый Dock должен сохранить это поведение.

Cookie-баннер в проверенных исходниках не найден.

## 7. Файлы, которые можно менять в чате 2

Минимально допустимый набор:

- `artifacts/kuhni-na-zakaz/components/layout/MobileBottomNav.tsx`
- `artifacts/kuhni-na-zakaz/components/layout/PublicChrome.tsx`
- `artifacts/kuhni-na-zakaz/app/globals.css`
- `artifacts/kuhni-na-zakaz/lib/mobile-dock.config.js`

Для добавления стабильных `id`:

- `artifacts/kuhni-na-zakaz/components/home/HomeMobileShowroom.tsx`
- `artifacts/kuhni-na-zakaz/components/prices/InteractivePricesCatalog.tsx`
- `artifacts/kuhni-na-zakaz/components/design-project/DesignProjectInteractive.tsx`
- `artifacts/kuhni-na-zakaz/components/portfolio/PortfolioFilters.tsx`
- `artifacts/kuhni-na-zakaz/components/locations/RegionalLocationPage.tsx`
- `artifacts/kuhni-na-zakaz/app/locations/[city]/page.tsx`
- `artifacts/kuhni-na-zakaz/app/catalog/[slug]/page.tsx`
- `artifacts/kuhni-na-zakaz/app/materials/[slug]/page.tsx`
- `artifacts/kuhni-na-zakaz/app/portfolio/[slug]/page.tsx`
- `artifacts/kuhni-na-zakaz/app/styles/[slug]/page.tsx`

## 8. Файлы, которые нельзя менять без отдельной причины

- `app/sitemap.ts`, `app/robots.ts`, metadata/generateMetadata: задача не должна менять SEO-URL, canonical, H1-H6 или Schema.org.
- `prisma/*`, API routes, admin forms: Dock не требует изменения данных.
- Изображения и public assets: новые картинки не нужны.
- Текстовые SEO-блоки страниц: только добавление `id`, без переписывания структуры и заголовков.

## 9. Резервные копии и откат

Созданы копии потенциально затрагиваемых файлов:

- `docs/audit/2026-07-06-mobile-dock-chat1-backups/`
- Манифест: `docs/audit/2026-07-06-mobile-dock-chat1-backups/BACKUP_MANIFEST.txt`

Откат чата 1:

1. Удалить `artifacts/kuhni-na-zakaz/lib/mobile-dock.config.js`.
2. Удалить `docs/audit/2026-07-06-mobile-dock-chat1-audit-and-handoff.md`.
3. При необходимости удалить папку `docs/audit/2026-07-06-mobile-dock-chat1-backups/`.

Откат будущего чата 2:

1. Вернуть файлы из `docs/audit/2026-07-06-mobile-dock-chat1-backups/` по тем же относительным путям.
2. Запустить `pnpm.cmd run typecheck` и `pnpm.cmd build` в `artifacts/kuhni-na-zakaz`.
3. После деплоя проверить мобильные страницы на ширине 360-390 px.

## 10. Инструкция для чата 2

1. Использовать `mobile-dock.config.js` как источник правды, не копировать HTML меню в страницы.
2. Заменить текущий `MobileBottomNav` на контекстный Dock-компонент или переписать его с сохранением публичного API.
3. Добавить недостающие стабильные `id` к существующим блокам без изменения H1-H6, metadata и SEO-текста.
4. На мобильной ширине рендерить ровно 4 пункта только когда все цели существуют; если цель опциональна и отсутствует, выбрать заранее заданный альтернативный пункт того же типа, но не `/`.
5. Для action:
   - `open-calculation-form`: плавный скролл к `fallbackTarget` и фокус на первом видимом поле формы;
   - `open-design-form`: скролл к `#request` или существующий action в `DesignProjectInteractive`;
   - `open-measurement-form`: скролл к `#form`.
6. Сохранить скрытие Dock при фокусе в полях формы и при открытых полноэкранных модалках/lightbox.
7. Использовать `lucide-react` и CSS `transform`/`opacity`; не добавлять новый UI-фреймворк.
8. Добавить CSS:
   - desktop hide при `min-width: 768px`;
   - `scroll-margin-top: 92px`;
   - bottom padding для `main` и footer;
   - `prefers-reduced-motion`.

## 11. Риски

- На части страниц один и тот же тип блоков есть визуально, но без стабильных `id`; это нужно исправить перед включением Dock.
- На страницах проектов блок материалов может отсутствовать, поэтому пункт должен быть условным.
- На городских страницах отзывы могут отсутствовать, значит пункт `Отзывы` должен быть опциональным или заменяться заранее согласованной реальной целью.
- На `/design-proekt-kuhni` уже есть собственная мобильная sticky-панель; новый Dock должен скрывать или замещать ее без наложения.
- У `FloatingSocialButtons` есть mobile-позиция `bottom-36`; после Dock нужно проверить, что кнопка связи не перекрывает панель и формы.

## 12. Критерий передачи в чат 2

Подтверждено:

- Технология и место подключения найдены.
- Причина переходов на главную найдена.
- Безопасное место для будущего CSS/JS известно: `MobileBottomNav.tsx`, `PublicChrome.tsx`, `globals.css`.
- Конфиг создан.
- Резервная копия исходников создана.

Не подтверждено как готовое к финальному включению:

- Не все типы страниц имеют 4 уже существующих стабильных DOM-цели.
- Поэтому чат 2 должен сначала добавить перечисленные `id`, затем включить Dock и протестировать мобильную версию.
