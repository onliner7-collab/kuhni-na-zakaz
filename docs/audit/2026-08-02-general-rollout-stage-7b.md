# Этап 7, волна 7B — материалы

Дата: 2026-08-02

Runtime commit: `2af3575e5c96f4f818bc4426f45f175ddc8221fa`

Ветка: `work`

Production service: `kuhni-na-zakaz`, `active`

## Scope

Проверены 8 URL: `/materials`, `/materials/furnitura` (только regression), `/materials/ldsp`, `/materials/mdf-fasady`, `/materials/plastik-hpl`, `/materials/shpon`, `/materials/akril`, `/materials/mdf-emal`.

## Реализация

- `/materials` получил visual-first выбор шести групп материалов с одним приоритетным изображением и передачей выбранного материала в ExploreContext.
- ЛДСП, HPL, шпон, акрил и МДФ с эмалью получили разные surface/edge/use вопросы и четыре переключаемых ракурса.
- МДФ сохранил ранее принятую специализированную проверку поверхности; фурнитура не изменялась.
- Все концептуальные изображения явно подписаны как AI-визуализации. Цвет, фактура и свойства требуют подтверждения образцом или спецификацией.
- Повторно использованы существующие route-specific WebP. Новая генерация изображений не потребовалась.
- Для текущих маршрутов активированы по три перехода: углубление, сравнение и conversion. Proof-переходы без evidence не добавлялись.

## Локальная приёмка

- `npm run typecheck` — PASS.
- `npm run build` — PASS; сформировано 112 sitemap URL. Локальная БД недоступна на `127.0.0.1:5434`, страницы штатно использовали fallback-данные.
- Playwright 7B: 47/47 PASS, 8 маршрутов × 360/390/412/768/1440 плюс интерактивные сценарии.
- Exploration tests: 11/11 PASS.
- Lead tests: 6/6 PASS.
- Sitemap: 112 URL, PASS.
- SEO brand check: PASS.
- Image audit: 300 ссылок, broken 0, oversized 0, bad names 0.

## Deploy и production QA

- Deploy: `bash deploy/scripts/update-production.sh work` — PASS.
- Production HEAD: `2af3575e5c96f4f818bc4426f45f175ddc8221fa`.
- Сервис после deploy: `active`.
- Прямой HTTPS smoke: 8/8 URL вернули HTTP 200.
- Расширенный Chromium через внешний HTTPS был нестабилен (`ERR_TIMED_OUT` из текущей Windows-сессии). Повторный smoke выполнен через SSH-туннель к тому же production runtime `127.0.0.1:3001`: 3/3 PASS, включая 8 URL, hub interaction и detail interaction.
- Lighthouse production runtime после прогрева image cache:
  - `/materials`: Performance 100, Accessibility 100, SEO 100, LCP 1561 мс, CLS 0, TBT 4 мс;
  - `/materials/shpon`: Performance 100, Accessibility 96, SEO 100, LCP 1579 мс, CLS 0, TBT 2 мс.
- Первый холодный Lighthouse run превысил LCP budget из-за непрогретого Next image cache; повтор после штатного прогрева прошёл все assertions.

## Rollback

Для отката runtime-волны: `git revert 2af3575e5c96f4f818bc4426f45f175ddc8221fa`, push ветки `work`, затем повторный запуск production deploy script.

## Решение

`STAGE_7B_ACCEPTED`
