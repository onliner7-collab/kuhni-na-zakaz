# Техническое задание

## Стек

- **Frontend**: React 18 + Vite + TypeScript
- **Стилизация**: Tailwind CSS v4
- **Роутинг**: Wouter
- **Анимации**: Framer Motion
- **Формы**: React Hook Form + Zod
- **UI-компоненты**: Radix UI + shadcn/ui
- **Иконки**: Lucide React
- **API**: Express.js (для форм и webhook)
- **БД**: PostgreSQL + Drizzle ORM (для будущей CMS/админки)
- **Монорепо**: pnpm workspaces

## Публичные маршруты

```
/                            — главная
/catalog                     — каталог кухонь
/catalog/uglovye-kuhni       — угловые кухни
/catalog/pryamye-kuhni       — прямые кухни
/catalog/p-obraznye-kuhni    — П-образные
/catalog/kuhni-s-ostrovom    — с островом
/catalog/malenkie-kuhni      — маленькие
/catalog/kuhni-do-potolka    — до потолка
/catalog/kuhni-bez-ruchek    — без ручек
/styles                      — стили
/styles/sovremennye          — современные
/styles/klassicheskie        — классические
/styles/skandinavskie        — скандинавские
/styles/minimalizm           — минимализм
/styles/loft                 — лофт
/materials                   — материалы
/materials/mdf               — МДФ
/materials/plastik           — пластик
/materials/emal              — эмаль
/materials/shpon             — шпон
/materials/egger             — EGGER
/prices                      — цены + калькулятор
/portfolio                   — портфолио
/portfolio/:slug             — детальный кейс
/reviews                     — отзывы
/about                       — о компании
/delivery-installation       — доставка и монтаж
/warranty                    — гарантия
/blog                        — блог
/blog/:slug                  — статья
/locations/minsk             — Минск
/locations/minskaya-oblast   — Минская область
/contacts                    — контакты
/privacy-policy              — политика конфиденциальности
/terms                       — условия использования
/personal-data               — согласие на данные
/thanks                      — страница благодарности
```

## SEO-требования

- Уникальный title на каждой странице
- Уникальный meta description
- Canonical URL
- Open Graph теги
- Breadcrumbs на всех внутренних страницах
- robots.txt
- sitemap.xml
- JSON-LD: Organization, LocalBusiness, FAQPage, BreadcrumbList
- H1 уникальный на каждой странице
- Структурированные данные для портфолио и отзывов

## Требования к мобильной версии

- Mobile-first layout
- Sticky header с логотипом, телефоном, бургером
- Фиксированная нижняя CTA-панель (звонок + заявка)
- Крупные кнопки (min 48px)
- Адаптивные формы и карточки
- Горизонтальный скролл для галерей
- Корректная работа калькулятора на мобильных

## Требования к формам

- Валидация всех полей (Zod)
- Защита от спама (honeypot поле)
- Маска телефона
- После отправки: показ success-экрана + редирект на /thanks
- Отправка данных: email / Telegram webhook / CRM

## Требования к аналитике (будущее)

- Google Analytics 4
- Google Search Console
- Яндекс Метрика
- Яндекс Вебмастер
- Цели: отправка формы, клик по телефону, начало квиза, завершение квиза

## Этапы разработки

### Milestone 1 — Основа приложения
- Next.js App Router замена → React+Vite (текущий стек)
- Шапка, подвал, мобильное меню
- Sticky CTA-панель
- Базовые компоненты

### Milestone 2 — Оболочка публичного сайта
- Все страницы-заглушки
- Роутинг

### Milestone 3 — Контент и дизайн
- Главная страница полностью
- Каталог с карточками
- Портфолио
- Калькулятор

### Milestone 4 — SEO-слой
- Metadata хелперы
- JSON-LD
- Sitemap, robots
- Breadcrumbs

### Milestone 5 — Лид-формы
- Форма заявки
- Калькулятор-квиз
- Webhook-интеграция

### Milestone 6 — Админ-панель (будущее)
- Роли: Super Admin, Manager, Guest Admin
- Управление контентом
- Модерация отзывов
