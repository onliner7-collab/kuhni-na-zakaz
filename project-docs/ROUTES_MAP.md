# Карта маршрутов

## Публичные маршруты

| URL | Компонент | Назначение |
|-----|-----------|------------|
| / | HomePage | Главная страница |
| /catalog | CatalogPage | Каталог кухонь |
| /catalog/uglovye-kuhni | CatalogItemPage | Угловые кухни |
| /catalog/pryamye-kuhni | CatalogItemPage | Прямые кухни |
| /catalog/p-obraznye-kuhni | CatalogItemPage | П-образные кухни |
| /catalog/kuhni-s-ostrovom | CatalogItemPage | Кухни с островом |
| /catalog/malenkie-kuhni | CatalogItemPage | Маленькие кухни |
| /catalog/kuhni-do-potolka | CatalogItemPage | Кухни до потолка |
| /catalog/kuhni-bez-ruchek | CatalogItemPage | Кухни без ручек |
| /styles | StylesPage | Стили кухонь |
| /styles/sovremennye | StyleItemPage | Современный стиль |
| /styles/klassicheskie | StyleItemPage | Классический стиль |
| /styles/skandinavskie | StyleItemPage | Скандинавский стиль |
| /styles/minimalizm | StyleItemPage | Минимализм |
| /styles/loft | StyleItemPage | Лофт |
| /materials | MaterialsPage | Материалы и фасады |
| /materials/mdf | MaterialItemPage | МДФ |
| /materials/plastik | MaterialItemPage | Пластик |
| /materials/emal | MaterialItemPage | Эмаль |
| /materials/shpon | MaterialItemPage | Шпон |
| /materials/egger | MaterialItemPage | EGGER |
| /prices | PricesPage | Цены и калькулятор |
| /portfolio | PortfolioPage | Портфолио / кейсы |
| /portfolio/:slug | PortfolioItemPage | Детальный кейс |
| /reviews | ReviewsPage | Отзывы |
| /about | AboutPage | О компании |
| /delivery-installation | DeliveryPage | Доставка и монтаж |
| /warranty | WarrantyPage | Гарантия |
| /blog | BlogPage | Блог |
| /blog/:slug | BlogPostPage | Статья |
| /locations/minsk | LocationPage | Минск |
| /locations/minskaya-oblast | LocationPage | Минская область |
| /contacts | ContactsPage | Контакты |
| /privacy-policy | LegalPage | Политика конфиденциальности |
| /terms | LegalPage | Условия использования |
| /personal-data | LegalPage | Согласие на данные |
| /thanks | ThanksPage | После отправки заявки |

## Структура навигации

### Главное меню
- Каталог → /catalog (с выпадающим по типам)
- Цены → /prices
- Портфолио → /portfolio
- Отзывы → /reviews
- О компании → /about
- Контакты → /contacts

### Выпадающее меню каталога
- Угловые кухни → /catalog/uglovye-kuhni
- Прямые кухни → /catalog/pryamye-kuhni
- П-образные кухни → /catalog/p-obraznye-kuhni
- Кухни с островом → /catalog/kuhni-s-ostrovom
- Маленькие кухни → /catalog/malenkie-kuhni

### Мобильное меню
То же что главное + Доставка и монтаж + Гарантия

### Footer
- Каталог
- Стили
- Материалы
- Цены
- Портфолио
- Отзывы
- Блог
- О компании
- Контакты
- Доставка и монтаж
- Гарантия
- Политика конфиденциальности
- Условия использования
- Согласие на обработку данных

## CTA → Куда ведут

| CTA | Назначение |
|-----|------------|
| "Рассчитать стоимость" | /prices#calculator или popup |
| "Получить бесплатный проект" | Popup-форма или /contacts |
| "Смотреть варианты" | /catalog/[slug] |
| "Смотреть проект" | /portfolio/[slug] |
| "Отправить заявку" | POST → /api/leads → /thanks |
| "Позвонить" (мобильный) | tel:+375291234567 |
