# Состояние проекта (Handoff)

## Текущее состояние

**Версия**: 0.4.0  
**Дата**: 9 апреля 2026  
**Статус**: Этап 1 завершён — product foundation и архитектура конфигуратора готовы

### Этап 1 — выполнено

- Prisma schema расширена: 10 новых моделей конфигуратора + 4 enum
- TypeScript: типы, редьюсер (store), движок совместимости, расчёт цены
- Admin: 11 новых страниц для управления всеми каталогами конфигуратора
- Публичный маршрут `/kitchen-configurator` — placeholder
- `AdminSidebar` обновлён

### Все 12 этапов — выполнено

**Версия**: 0.5.0  
**Статус**: Визуальный конфигуратор полностью реализован

#### Реализовано:
- [x] Этап 1: Prisma schema, TypeScript types, store, compatibility engine, price engine
- [x] Этап 2: SVG 2D-план, форма помещения (размеры/двери/окна/выступы), placement модулей
- [x] Этап 3: Каталог модулей с фильтрацией, выбор шаблонов планировок
- [x] Этап 4: Материалы: фасады, столешницы, скинали, ручки, техника
- [x] Этап 5: R3F 3D-сцена (стены, пол, модули, фасады, столешницы, OrbitControls, lite-режим)
- [x] Этап 6: 8 стилевых пресетов (Минимализм, Дуб, Камень, Графит, Матовые, Витрины, Премиум, Кухня-гостиная)
- [x] Этап 7: Анимации (stepper pulse/check, slide transitions, whileInView hero)
- [x] Этап 8: Сохранение (IndexedDB autosave + server, restore draft, named saves)
- [x] Этап 9: Экспорт JSON / PNG / PDF (print) + showSaveFilePicker fallback
- [x] Этап 10: Share (Web Share API + Telegram/WhatsApp/Viber/Email + copy link fallback)
- [x] Этап 11: Mobile-first (sticky nav, price indicator, lite 3D, responsive grids)
- [x] Этап 12: Landing page с hero, how-it-works (whileInView), ссылка в Header

#### Требует для полной работы:
- Запуск `prisma db push` для применения новых моделей
- Запуск `pnpm install` для установки @react-three/fiber, @react-three/drei, three
- Заполнение каталогов через `/admin/configurator-visual/` (модули, шаблоны, фасады)

## Что уже сделано

### Документация (project-docs/)
- [x] README.md
- [x] PROJECT_OVERVIEW.md
- [x] TECHNICAL_SPEC.md
- [x] AI_RULES.md
- [x] CONTENT_RULES.md
- [x] SEO_STRATEGY.md
- [x] UI_UX_GUIDE.md
- [x] ADMIN_PANEL_SPEC.md
- [x] ROUTES_MAP.md
- [x] CONTENT_MODELS.md
- [x] CHANGELOG.md
- [x] HANDOFF.md (этот файл)
- [x] FEATURE_BACKLOG.md
- [x] DEPLOYMENT.md
- [x] TEST_CHECKLIST.md
- [x] REPLIT_EXECUTION_PLAN.md
- [x] COMPONENT_LIBRARY.md

### Публичный сайт (artifacts/kuhni-na-zakaz/)
- [x] React + Vite + TypeScript + Tailwind
- [x] Wouter роутинг
- [x] Framer Motion анимации
- [x] Цветовая тема (тёплые тона + янтарный акцент)
- [x] Playfair Display + Inter шрифты
- [x] Шапка — логотип, навигация, телефон, CTA
- [x] Мобильное меню
- [x] Sticky mobile CTA-панель
- [x] Подвал — навигация, контакты, юридика
- [x] Главная страница — все 10 блоков
- [x] Каталог — список + детальные страницы категорий
- [x] Портфолио — список + детальные страницы кейсов
- [x] Страница цен с сегментами и калькулятором-квизом
- [x] Отзывы — список + форма отправки
- [x] Блог — список + детальные страницы статей
- [x] О компании
- [x] Контакты с формой
- [x] Доставка и монтаж
- [x] Гарантия
- [x] Локальные страницы (Минск, Минская область)
- [x] Юридические страницы (privacy, terms, personal-data)
- [x] Страница благодарности (/thanks)
- [x] Статичные данные (data.ts)

## Что делать следующим шагом

### Приоритет 1 — SEO
- [ ] robots.txt
- [ ] sitemap.xml (генерация)
- [ ] JSON-LD на каждой странице
- [ ] Open Graph теги
- [ ] Canonical URLs

### Приоритет 2 — Контент
- [ ] Реальные фото/изображения для каталога, портфолио, главной
- [ ] Полные тексты статей блога
- [ ] Заполненные страницы стилей и материалов

### Приоритет 3 — Интеграции
- [ ] Webhook для форм (Telegram бот или email)
- [ ] Google Analytics 4
- [ ] Яндекс Метрика

### Приоритет 4 — Бэкенд/CMS
- [ ] Схема базы данных (Drizzle + PostgreSQL)
- [ ] API для форм
- [ ] Базовая админ-панель

### Приоритет 5 — Push в GitHub
- [ ] По команде пользователя

## Что нельзя ломать

1. Роутинг — все URL зафиксированы в ROUTES_MAP.md
2. Цветовая тема — переменные в index.css
3. Структура папок artifacts/kuhni-na-zakaz/src/
4. Данные в lib/data.ts — основа контента
5. Форма на главной (id="contact-form") — якорная ссылка


---

## 2026-04-12 Update (New Chat Bootstrap)

Use these files first:
- project-docs/NEW_CHAT_CONTEXT.md
- project-docs/SERVER_RUNBOOK_2026-04-12.md
- project-docs/GIT_PUSH_RUNBOOK_2026-04-12.md

They contain current production/security status, deploy commands, git push flow, and next actions.

---

## 2026-05-02 Update (Lightbox portfolio UX/a11y)

### Что сделано
- Доработан `ImageLightbox` для более устойчивой работы на мобильных и с клавиатурой.
- Включён lock прокрутки не только для `body`, но и для `html`.
- Улучшен контроль фокуса: при уходе фокуса из модального окна `Tab` возвращает фокус в lightbox.
- Доработан `ProjectGallery`: миниатюры стали управлять главным фото без открытия lightbox.
- Добавлена отдельная иконка увеличения на миниатюрах для открытия lightbox с конкретного изображения.
- Добавлено визуальное выделение активной миниатюры (граница + ring).
- Добавлен скрипт аудита распределения фото: `scripts/audit_portfolio_photo_distribution.py`.
- Сгенерирован vetted mapping: `prepared-images/reports/portfolio-vetted-mapping.csv` (11 принятых групп из 36).
- Обновлён stage mapping для импорта: `artifacts/kuhni-na-zakaz/project-docs/stage-4-2-photo-import/portfolio-draft-mapping.csv`.
- На проде выполнен импорт `photos:import-prepared` с обновлением 11 портфолио кейсов и последующим `build + restart`.
- Для SEO обновлён `app/sitemap.ts`: добавлены обязательные URL `/calculator` и фиксированные региональные страницы (`minsk`, `minskaya-oblast`, `gomel`, `mogilev`, `vitebsk`).
- На live проверены `robots.txt`, canonical/meta/OG/Twitter для ключевых URL и 404 на несуществующий `/portfolio/[slug]`.
- Подтверждён редирект с `www` на основной домен и canonical в non-www виде.

### Что проверено
- `pnpm --dir artifacts/kuhni-na-zakaz run build` проходит успешно.
- Локально в сборке нет ошибок линтера для `components/ui/ImageLightbox.tsx`.

### Риски/совместимость
- Изменения точечные, затрагивают только поведение модального окна.
- Публичные URL, данные CMS и API не изменялись.
- Остальные компоненты (`ProjectGallery`, `PortfolioProjectHeroImage`) продолжают использовать тот же API lightbox без миграции.
- В импорт не попали группы с `needs_review=true` и `confidence=low`; для них требуется ручная валидация перед публикацией.
