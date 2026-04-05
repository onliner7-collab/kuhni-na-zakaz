# Библиотека компонентов

## Базовые компоненты (shadcn/ui)

Все расположены в `artifacts/kuhni-na-zakaz/src/components/ui/`

| Компонент | Используется |
|-----------|-------------|
| Button | везде — CTA, формы, навигация |
| Card, CardContent, CardHeader | каталог, портфолио, отзывы, цены |
| Badge | статусы, категории, стили |
| Input, Textarea | все формы |
| Label | все формы |
| Accordion | FAQ (альтернатива) |
| Dialog | popup-форма (планируется) |
| Toast, Toaster | уведомления |
| Tooltip | подсказки |

## Кастомные компоненты

### Layout (`src/components/Layout.tsx`)
- **Назначение**: общая обёртка всех страниц
- **Включает**: Header, Footer, MobileCTA
- **Props**: `children: React.ReactNode`
- **State**: `isMenuOpen` (мобильное меню)

### Header (внутри Layout)
- **Назначение**: липкая шапка сайта
- **Элементы**: логотип, навигация, телефон, CTA-кнопка, бургер
- **Поведение**: sticky top-0, backdrop-blur

### Footer (внутри Layout)
- **Назначение**: подвал
- **Секции**: О компании, Навигация, Услуги, Контакты
- **Нижняя строка**: копирайт, юридические ссылки

### MobileCTA (внутри Layout)
- **Назначение**: фиксированная панель на мобильных
- **Кнопки**: Позвонить (tel:), Оставить заявку
- **Видимость**: `md:hidden`

## Компоненты страниц

### Breadcrumb
- **Используется**: все страницы кроме главной
- **Props**: `items: Array<{label, href?}>`

### StarRating
- **Используется**: Reviews, Home (отзывы)
- **Props**: `rating: number`

### QuizCalculator (встроен в PricesPage)
- **Шаги**: 7 шагов + контактная форма
- **State**: `quizStep`, `answers`, `submitted`

## Иконки

Все из `lucide-react`:
- `Phone` — контакты, телефон
- `Mail` — email
- `MapPin` — адрес, город
- `Clock` — время работы, сроки
- `CheckCircle` — преимущества, подтверждение
- `Shield` — гарантия
- `Ruler` — размеры
- `Wrench` — монтаж
- `FileText` — смета
- `Star` — рейтинг
- `ChevronDown` — FAQ, dropdown
- `ChevronRight` — ссылки
- `Menu`, `X` — мобильное меню
- `ArrowLeft` — назад
- `Maximize2` — площадь
- `Calculator` — калькулятор
- `Truck` — доставка
- `MessageCircle` — мессенджеры

## Принципы компонентов

1. Все интерактивные элементы имеют `data-testid`
2. Анимации через Framer Motion `whileInView`
3. Адаптивность через Tailwind responsive prefixes
4. Нет бизнес-логики в UI-компонентах
5. Данные импортируются из `@/lib/data`
