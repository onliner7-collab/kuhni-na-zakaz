# Спецификация админ-панели

## Роли

### Super Admin
- Полный доступ ко всем разделам
- Управление пользователями и ролями
- Управление системными настройками
- Просмотр всех логов

### Manager
- Управление кухнями, кейсами, ценами
- Модерация отзывов
- Редактирование контента страниц
- Управление блогом
- Нет доступа к системным настройкам и управлению пользователями

### Guest Admin (временный доступ)
- Ограниченный доступ по разделам (назначается при создании)
- Истечение срока доступа (дата/время)
- Только разрешённые действия (read, edit — на выбор)
- Все действия логируются
- Нет доступа к системным настройкам
- Нет доступа к управлению пользователями

## Guest Access

### Как работает
1. Super Admin создаёт guest access с параметрами:
   - Разделы (kitchens, portfolio, blog, etc.)
   - Действия (view, edit, moderate)
   - Срок действия (DateTime)
2. Генерируется одноразовая ссылка или временные credentials
3. Гость входит по ссылке/credentials
4. Все действия записываются в ActivityLog
5. По истечении срока — доступ автоматически блокируется
6. Возможность ручного отзыва доступа

### Ограничения для Guest Admin
- Нельзя изменять системные настройки
- Нельзя удалять данные (только помечать)
- Нельзя изменять других пользователей
- Нельзя создавать новых пользователей

## Модерация отзывов

### Статусы
- `new` — новый, ещё не проверен
- `pending` — на рассмотрении
- `published` — опубликован
- `rejected` — отклонён
- `deleted` — удалён

### Поток модерации
1. Пользователь оставляет отзыв
2. Статус: `new`
3. Модератор видит в очереди
4. Проверяет: реальный ли клиент, нет ли спама
5. Публикует → `published` или отклоняет → `rejected`
6. Публичный сайт показывает только `published`

## Поля сущностей

### Kitchen (кухня в каталоге)
- id, title, slug, description, category
- style, material, priceFrom, priceTo
- features[], images[]
- seoTitle, seoDescription, canonical
- published (bool), createdAt, updatedAt

### PortfolioCase (кейс)
- id, title, slug, city, area, style, material
- priceFrom, priceTo, days
- description, task, solution
- images[], mainImage
- seoTitle, seoDescription
- published (bool), createdAt, updatedAt

### Review (отзыв)
- id, name, city, phone, rating, text, date
- status (new/pending/published/rejected/deleted)
- moderatedBy, moderatedAt, rejectionReason
- createdAt

### BlogPost (статья)
- id, title, slug, excerpt, content (rich text)
- category, tags[], readTime
- seoTitle, seoDescription
- published (bool), publishedAt, createdAt, updatedAt

### User (пользователь системы)
- id, email, name, role (super_admin/manager)
- createdAt, lastLoginAt

### GuestAccess
- id, userId (если создан), createdBy
- allowedSections[], allowedActions[]
- expiresAt, revokedAt
- loginLink (одноразовый токен), credentials (login/password)
- createdAt

### ActivityLog
- id, userId (или guestAccessId), action
- entity, entityId, details (JSON)
- ip, userAgent, createdAt

## Безопасность
- HTTPS обязателен
- Все пароли хешируются (bcrypt)
- Session timeout: 8 часов для Manager, 2 часа для Guest
- Rate limiting на login endpoint
- CSRF-protection на все формы
- XSS-protection, Content-Security-Policy
