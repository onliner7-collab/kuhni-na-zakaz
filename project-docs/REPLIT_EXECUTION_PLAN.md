# План выполнения в Replit

## Milestones

### Milestone 1 — Документация [ВЫПОЛНЕНО]
**Commit**: `docs: add project documentation and development rules`
- README.md
- project-docs/*.md (16 файлов)

### Milestone 2 — Основа приложения [ВЫПОЛНЕНО]
**Commit**: `chore: initialize react vite app structure`
- React + Vite + TypeScript + Tailwind
- Шапка, подвал, мобильное меню
- Цветовая тема

### Milestone 3 — Оболочка публичного сайта [ВЫПОЛНЕНО]
**Commit**: `feat: add public site shell and core routes`
- Все 23 публичных маршрута
- Статичные данные
- Все страницы

### Milestone 4 — Контент-архитектура [ВЫПОЛНЕНО]
**Commit**: `feat: add content models and data layer`
- Модели данных (CONTENT_MODELS.md)
- lib/data.ts — все статичные данные

### Milestone 5 — Лид-формы [ВЫПОЛНЕНО]
**Commit**: `feat: add lead generation forms calculator`
- Калькулятор-квиз
- Формы на /contacts, главной, /reviews
- Страница /thanks

### Milestone 6 — SEO-слой [В ОЧЕРЕДИ]
**Commit**: `feat: add seo metadata sitemap robots breadcrumbs and schema`
- JSON-LD на каждой странице
- Open Graph
- robots.txt
- sitemap.xml

### Milestone 7 — Интеграции [В ОЧЕРЕДИ]
**Commit**: `feat: add telegram webhook and analytics`
- Telegram webhook
- Google Analytics 4

### Milestone 8 — Бэкенд/БД [В ОЧЕРЕДИ]
**Commit**: `feat: add database schema and api routes`
- Drizzle схема
- API endpoints
- Хранение заявок

### Milestone 9 — Админ-панель [В ОЧЕРЕДИ]
**Commit**: `feat: add admin shell and role-based structure`
- /admin/login
- /admin/dashboard
- Роли и доступы

### Milestone 10 — Push в GitHub [ПО КОМАНДЕ]
**Commit**: (финальный коммит по команде)
- `git push origin main`

## Правила commit messages

```
docs: — документация
chore: — инфраструктура
feat: — новый функционал
fix: — исправление бага
style: — стили без логики
refactor: — рефакторинг
perf: — производительность
```
