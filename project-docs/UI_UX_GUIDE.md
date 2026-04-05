# UI/UX руководство

## Цветовая палитра

### Светлая тема
- **Background**: `hsl(45, 33%, 97%)` — тёплый кремовый
- **Foreground**: `hsl(0, 0%, 10%)` — почти чёрный
- **Primary**: `hsl(29, 57%, 46%)` — медно-янтарный (CTA)
- **Secondary**: `hsl(45, 10%, 85%)` — тёплый светло-серый
- **Card**: `hsl(0, 0%, 100%)` — белый
- **Muted**: `hsl(30, 10%, 80%)` — бежевый

### Акцентные цвета (hero, dark sections)
- Stone-900: `#1c1917` — тёмно-коричневый
- Amber-400: `#fbbf24` — янтарный для CTA на тёмном фоне

## Типографика

- **Serif (заголовки)**: Playfair Display — H1, H2, названия компонентов, лого
- **Sans-serif (текст)**: Inter — всё остальное

### Размеры
- H1: `text-4xl md:text-5xl` (главная: `text-5xl md:text-7xl`)
- H2: `text-3xl md:text-4xl`
- H3: `text-xl md:text-2xl`
- Body: `text-sm` / `text-base`
- Caption: `text-xs`

## Сетка

- Контейнер: `container mx-auto px-4`
- Макс. ширина: 1280px
- Колонки: 1 (мобайл) → 2 (таблет) → 3-4 (десктоп)
- Отступы между блоками: `py-20`
- Отступы между карточками: `gap-5` / `gap-6`

## Кнопки

- **Primary**: `bg-primary text-white` — главное действие
- **Secondary / Outline**: для второстепенных действий
- **Размер**: `size="lg"` для основных CTA
- **Скруглённые**: `rounded-full` для hero CTA
- **Минимальная высота**: 44px (accessibility)

## Hero Section

- Полная высота: `min-h-[88vh]`
- Фон: тёмный градиент + паттерн или фото
- CTA кнопки: янтарный + outline white
- Доверительные маркеры под кнопками

## Карточки

- Скругление: `rounded-xl` или `rounded-2xl`
- Тень: `shadow-sm` / при hover `shadow-lg`
- Изображение: `h-44` / `h-52` / `h-48`
- Hover эффект: `transition-all duration-300`

## Формы

- Инпуты: `rounded-xl px-4 py-3 border`
- Focus: `ring-2 ring-primary/50`
- Все поля с `label` выше инпута
- Кнопки отправки: `w-full size="lg"`
- Согласие с политикой под кнопкой

## Анимации

- Библиотека: Framer Motion
- Паттерн: `fadeUp` — `opacity: 0, y: 30` → `opacity: 1, y: 0`
- Задержка: `delay: i * 0.1` для списков
- При скролле: `whileInView` с `viewport={{ once: true }}`
- Длительность: `duration: 0.5`

## Mobile-first правила

- Все блоки сначала для мобайл, расширяются на md/lg
- Sticky header: `sticky top-0 z-50`
- Мобильная CTA панель: `fixed bottom-0 md:hidden`
- Шрифты: не меньше `text-sm` нигде
- Тапабельные зоны: минимум 44x44px

## Breadcrumbs

- На всех страницах кроме главной
- Формат: `Главная / Каталог / Угловые кухни`
- `text-sm text-muted-foreground`
- Последний элемент — `text-foreground` (не ссылка)

## Секции на главной

Отступы между секциями:
- Светлая секция на тёмную: визуальный контраст
- Чередование: светлый → secondary → тёмный → светлый

## SEO-совместимость разметки

- H1 — ровно один на страницу
- H2 — разделы контента
- H3 — подразделы
- Alt text — на всех изображениях
- ARIA labels — на иконочных кнопках
