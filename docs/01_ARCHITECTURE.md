# Архитектура проекта

## Текущее устройство

Репозиторий — pnpm workspace. Основное приложение: `artifacts/kuhni-na-zakaz`, Next.js 15 App Router, React 19, TypeScript 5.9, Tailwind CSS 4, Prisma 6. Публичные маршруты находятся в `app`, серверные данные — в `lib`, `data` и Prisma, переиспользуемый UI — в `components`.

Основные области компонентов:

- `components/layout` — Header, Footer, PublicChrome, MobileBottomNav, плавающие контакты;
- `components/sections` — формы, FAQ, галереи материалов и общие контентные секции;
- `components/catalog`, `locations`, `prices`, `portfolio`, `reviews` — feature-компоненты страниц;
- `components/configurator`, `calculator`, `design-project` — изолированные интерактивные сценарии;
- `components/navigation/Link.tsx` — общий crawlable Link с отключённым prefetch по умолчанию;
- `lib/schema-org.tsx`, `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts` — общий SEO-контракт.

## Server/Client границы

- Страница, metadata, JSON-LD, основной текст, ссылки и начальные данные остаются Server Components.
- Client Component получает минимальный сериализуемый набор данных и отвечает только за жесты, состояние, hotspot, сравнение или sheet.
- Нельзя переносить H1, критический текст, внутренние ссылки или CTA целиком в клиентский рендер.
- Тяжёлые клиентские модули загружаются динамически после первого экрана, если без них сохраняется смысл страницы.

## Предлагаемая библиотека интерактивов

Размещать в `components/showroom` по feature-папкам:

- `SwipeGallery` — свайп ракурсов с доступными кнопками;
- `FrameSequence` — лениво загружаемая последовательность с poster и reduced-motion fallback;
- `HotspotImage` — кнопки 44×44 px, клавиатура и подписи вне изображения;
- `CompareSlider` — сравнение двух изображений с обычными альтернативными карточками;
- `OptionSheet` — bottom sheet выбора;
- `ContextDock` — конфигурация четырёх действий для конкретной страницы;
- `DimensionSimulator` — простая 2D-схема без WebGL.

## Feature-based организация пилотов

```text
components/showroom/angular-kitchens/
components/showroom/borisov/
components/showroom/hardware/
content/media/pilots/
public/media/pilots/
```

Общие примитивы выносятся только после второго реального использования. Страница пилота импортирует свой feature, а не набор внутренних деталей другого пилота.

## Интеграция без переписывания

1. Сохранить текущий route file, metadata, canonical, JSON-LD и формы.
2. Найти все места использования изменяемого shared-компонента через `rg`.
3. Добавлять новые server-секции и изолированные client-islands постепенно.
4. Медиа подключать через manifest и существующий `optimizedImageSrc`; WebP/AVIF обязаны существовать до ссылки на них.
5. Не менять `PublicChrome` или глобальный Dock ради одного пилота — использовать конфигурацию маршрута.
6. После каждого шага запускать проверки из `05_DEVELOPMENT_RULES.md`.

## Текущие архитектурные риски

- часть страниц зависит от Prisma, поэтому локальная недоступность БД требует статических fallback, а не удаления маршрутов;
- значительная доля интерактивов уже клиентская — нельзя увеличивать общий JS без бюджетов и lazy loading;
- `PublicChrome`, MobileBottomNav и плавающие контакты глобальны и могут дать регрессии на всех страницах;
- изображения приходят из нескольких исторических каталогов и через watermark helper — нужен единый manifest для пилотов;
- динамические `[slug]` и `[city]` маршруты разделяют код между множеством URL, поэтому локальная правка требует проверки всех потребителей.
