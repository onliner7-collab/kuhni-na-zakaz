# Финальный отчет `/materials/furnitura`

Дата: 2026-06-04

## Итоговый статус

Этапы 11 и 12 завершены. Страница `/materials/furnitura` доступна локально и на production, проходит SEO QA, responsive QA, accessibility QA, production build, sitemap/robots-проверки и повторную отправку URL в очередь переобхода Яндекс.Вебмастера.

## Измененные файлы проекта

Основные файлы реализации, созданные и обновленные на этапах внедрения:

- `artifacts/kuhni-na-zakaz/app/materials/furnitura/page.tsx`
- `artifacts/kuhni-na-zakaz/app/materials/page.tsx`
- `artifacts/kuhni-na-zakaz/app/sitemap.ts`
- `artifacts/kuhni-na-zakaz/components/sections/FurnituraHardwareGallery.tsx`
- `artifacts/kuhni-na-zakaz/components/ui/ImageLightbox.tsx`
- `artifacts/kuhni-na-zakaz/lib/furnitura-gallery-registry.ts`
- `artifacts/kuhni-na-zakaz/lib/image-disclosure.ts`
- `artifacts/kuhni-na-zakaz/public/images/materials-gallery-v2/furnitura/*`
- `docs/seo-materials-furnitura-audit.md`
- `docs/furnitura-implementation-log.md`
- `docs/furnitura-images-registry.md`
- `docs/furnitura-image-generation-prompts.md`
- `docs/furnitura-responsive-a11y-report.md`
- `docs/furnitura-seo-qa-report.md`
- `docs/furnitura-deploy-indexing-report.md`
- `docs/furnitura-final-report.md`

## Добавленные страницы

- `https://kuhni.minsk.by/materials/furnitura` — экспертный гид по фурнитуре для кухни на заказ.
- На `/materials` добавлена карточка-ссылка на гид по фурнитуре.

## Изображения

- Всего подключено 201 WebP-файл: 1 hero и 200 изображений галереи.
- Hero: `1600x900`.
- Галерея: `1200x675`.
- Формат: `.webp`.
- Все видимые alt-тексты на русском языке.
- Пустые alt: 0.
- Дублирующиеся alt: 0.
- Изображения помечены как демонстрационные и не выдаются за фотографии выполненных проектов.

## SEO-поля

- Title: `Фурнитура для кухни на заказ в Минске | Петли, направляющие, доводчики | КухниBY`.
- Description: добавлен, 182 символа.
- Canonical: `https://kuhni.minsk.by/materials/furnitura`.
- Robots: `index, follow`.
- Open Graph: добавлен.
- H1: один, `Фурнитура для кухни на заказ`.
- FAQ: добавлен.

## Schema.org

Добавлена и проверена JSON-LD-разметка:

- `BreadcrumbList`
- `WebPage`
- `Article`
- 12 `ImageObject`
- `FAQPage`

Не добавлялись `Product`, fake reviews, rating или `aggregateRating`.

## Sitemap и robots

- `/materials/furnitura` добавлен в sitemap.
- Production `https://kuhni.minsk.by/sitemap.xml` доступен и содержит `https://kuhni.minsk.by/materials/furnitura`.
- Production `https://kuhni.minsk.by/robots.txt` доступен и содержит `Sitemap: https://kuhni.minsk.by/sitemap.xml`.
- Блокировки `/materials/furnitura` в robots.txt не найдено.

## Проверки

- `pnpm --filter @workspace/kuhni-na-zakaz typecheck` — успешно.
- `pnpm --filter @workspace/kuhni-na-zakaz sitemap:check` — успешно, 75 URL; есть ожидаемые Prisma-предупреждения из-за недоступной локальной БД `127.0.0.1:5434`.
- `pnpm --filter @workspace/kuhni-na-zakaz build` — успешно; во время build есть ожидаемые Prisma-предупреждения из-за недоступной локальной БД, сборка завершилась без ошибки.
- Отдельной команды `lint` в приложении нет; lint/type validation Next прошли внутри `next build`.
- Browser QA локально: 360, 390, 430, 768, 1024, 1440 px.
- Browser QA production: 390 и 1440 px.
- Проверено 58 внутренних ссылок со страницы, битых локальных ссылок не найдено.

## Production

- Production URL: `https://kuhni.minsk.by/materials/furnitura`.
- HTTP status: 200.
- `/materials`: 200.
- `/sitemap.xml`: 200.
- `/robots.txt`: 200.
- Последний production-коммит на ветке `work`: `a791a8b Allow Next ISR cache writes under systemd hardening`.
- Новых проблем на этапе 11 не найдено, поэтому дополнительный deploy после финального QA не требовался.

## Google Search Console

- В предыдущем production-этапе через GSC UI была выполнена проверка `https://kuhni.minsk.by/materials/furnitura`; UI показывал наличие URL в индексе Google, была нажата кнопка повторного запроса индексирования.
- 2026-06-04 повторная API-проверка сохраненного OAuth refresh token вернула HTTP 400, поэтому через этот OAuth-токен sitemap повторно не отправлен.
- Service account получил access token, но Search Console API вернул пустой список sites; у service account нет доступа к property, поэтому через него sitemap не отправлен.

## Yandex Webmaster

- URL `https://kuhni.minsk.by/materials/furnitura` повторно отправлен в очередь переобхода.
- Новый task_id: `8c2a1a00-6022-11f1-82f9-89e3d690e82d`.
- Состояние задачи на момент проверки: `IN_PROGRESS`.
- Время добавления: `2026-06-04T17:34:52.192+03:00`.
- Остаток квоты после отправки: `127`.
- Sitemap `https://kuhni.minsk.by/sitemap.xml` уже добавлен в Яндекс.Вебмастер, sitemap_id `39bff829-022b-3e39-884a-527f04d4eb5c`.

## Остаточные риски

- Локальная БД Prisma `127.0.0.1:5434` недоступна, поэтому локальный sitemap/build используют fallback-данные; production при этом проверен отдельно.
- Google API-доступ требует обновить OAuth refresh token или выдать service account доступ к Search Console property.
- Нельзя гарантировать сроки переиндексации в Google или Яндексе; зафиксированы только отправка/проверка и текущая доступность страницы.

## Повторная проверка через 7-14 дней

- Проверить в Google Search Console статус URL `/materials/furnitura`.
- Проверить, обновилась ли обработка `https://kuhni.minsk.by/sitemap.xml` в GSC.
- Проверить в Yandex Webmaster статус задачи `8c2a1a00-6022-11f1-82f9-89e3d690e82d`.
- Проверить, что страница остается в sitemap и не получает `noindex`.
- Посмотреть поисковые показы/клики по запросам про фурнитуру для кухни, петли, направляющие, доводчики, push-to-open и системы хранения.
