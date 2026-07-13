# Current State Audit

Дата baseline: 2026-07-13. Источники: фактический репозиторий, `app/sitemap.ts`, `public/sitemap-static.xml`, production sitemap и мобильная DOM-проверка.

## Структура и сильные стороны

- Monorepo: корень `C:/Users/User/Desktop/kuhni-na-zakaz`, pnpm workspace; основное приложение — `artifacts/kuhni-na-zakaz`.
- Стек подтверждён package files: Next.js 15.3.9, React 19.1.5, TypeScript 5.9, Tailwind 4, Prisma 6/PostgreSQL.
- App Router: 103 page-файла (32 публичных, 71 admin), 68 route handlers, 2 layouts. Есть `not-found.tsx`; error/loading boundaries не найдены.
- Публичный sitemap содержит 112 canonical URL; локальный `pnpm.cmd run sitemap:check` и production `/sitemap.xml` согласованы.
- Metadata API, canonical, robots, sitemap и JSON-LD реализованы; shared schema находится в `lib/schema-org.tsx`.
- Формы валидируются на клиенте и сервере, заявки пишутся через Prisma, есть honeypot, rate limit, Telegram/email notifications и загрузка файла до 8 МБ.
- В `globals.css` присутствуют safe-area offsets и reduced-motion правила; pilot Dock умеет ровно четыре контекстных действия после hydration.

## Архитектурные риски

| Риск                                       | Фактическое подтверждение                                                                                       | Приоритет |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | --------- |
| Глобальный public shell — Client Component | `components/layout/PublicChrome.tsx` ждёт mount и оборачивает весь публичный контент                            | высокий   |
| Чрезмерная клиентская поверхность          | 79 из 91 component-файлов помечены `use client`                                                                 | высокий   |
| Монолиты                                   | `RegionalLocationPage.tsx` — 2121 строк; `HomeMobileShowroom.tsx` — 1327; `DesignProjectInteractive.tsx` — 1220 | высокий   |
| Нет route loading/error boundaries         | найден только `app/not-found.tsx`                                                                               | средний   |
| Смешение server data и крупных UI          | региональный shared-компонент 123 КБ source; множество условных веток                                           | высокий   |
| Неиспользуемые/косвенные компоненты        | registry содержит компоненты без прямых импортов; требуется ручная проверка перед удалением                     | средний   |

## Mobile UX и a11y

- На production при 360, 390 и 412 px горизонтальный overflow не обнаружен, H1 по одному, битых завершивших загрузку изображений не найдено.
- После полной hydration /catalog/uglovye-kuhni получает Dock с четырьмя действиями и `body[data-mobile-dock=angularKitchen]`.
- На проверенных страницах найдены поля и кнопки высотой 40 px, локальные ссылки 37–42 px и маленькие checkbox controls; это ниже требования 44×44 px. Исправление отложено, потому что этап 1 запрещает менять UI.
- `/materials/furnitura` создаёт 203 image elements в DOM. Lazy loading снижает сеть, но размер DOM и медиаплан требуют отдельного профилирования.
- На главной в DOM 54 изображения и 120 видимых controls; одному экрану и управлению одной рукой требуется отдельный сценарный аудит.

## Медиа и performance

- `artifacts/kuhni-na-zakaz/public`: 1008 файлов, около 358 МБ; PNG около 304,5 МБ, WebP около 49,3 МБ, AVIF около 2,9 МБ.
- 47 SHA-256 групп содержат 116 точных дублей.
- Крупнейшие masters — PNG 2,1–2,7 МБ. Они допустимы как masters, но не как основной visible src.
- Зависимости включают Three/React Three Fiber, Framer Motion, Anime.js и XLSX. Их route-level попадание в bundle требует измерения; абсолютные CWV здесь не заявляются.
- Измерения LCP/CLS/INP в текущем этапе не запускались; старые отчёты нельзя считать текущим baseline без повторной проверки.

## SEO и IA

- 112 URL охватывают hubs, категории, стили, материалы, сценарии, портфолио, блог и 30 location pages.
- Риск каннибализации: главная/Минск/каталог/цены; категории и одноимённые сценарии/статьи; локальные страницы с повторяемым шаблоном.
- Sitemap имеет DB fallback. Локальная проверка сообщила: dynamic URLs недоступны, использован static fallback; это штатная деградация, но свежесть production зависит от генерации static sitemap.
- В коде есть явная маркировка AI-концептов на пилотах, но provenance старых 1008 media не унифицирован.

## Неподтверждённые данные

- Нет единого источника прав/лицензий и real/AI provenance для всех старых изображений.
- Нет текущих field CWV для среднего Android и медленной сети.
- Не подтверждена полнота alt для DB-driven media без production DB audit.
- Не подтверждены реальные проекты для каждого города; город в URL не является доказательством объекта или филиала.
- Не подтверждена актуальность всех цен/сроков/гарантийных формулировок бизнес-владельцем.
