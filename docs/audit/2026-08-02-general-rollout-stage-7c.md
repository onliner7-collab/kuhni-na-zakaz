# Этап 7, волна 7C — стили и сценарии

Дата: 2026-08-02

Runtime commit: `b199892`

Ветка: `work`

## Scope и реализация

Проверены 16 URL: `/styles`, `/scenarios`, восемь style details и шесть scenario details из recommended wave 5 Page Registry v2.

- `/styles` получил visual-first сравнение визуального языка по принятым route-specific сериям.
- `/scenarios` получил visual-first выбор по жизненной задаче.
- Все 14 detail pages сохранили ранее принятые explorers: 6 состояний для каждого стиля и 5 состояний для каждого сценария.
- Новые изображения не создавались; принятые WebP/AVIF серии не регенерировались.
- Технические enum не показываются пользователю; первый визуальный state присутствует в серверном HTML.
- В реестре активно 62 перехода текущего scope: по 3 на каждом hub и по 4 на каждой detail page. Неодобренные proof-переходы скрываются реестром.

## Локальная приёмка

- TypeScript — PASS.
- Production build — PASS; sitemap fallback содержит 112 URL.
- Playwright: 96/96 PASS, 16 URL × 360/390/412/768/1440, оба hub interaction и explorers всех detail pages.
- Exploration tests 11/11, lead tests 6/6 — PASS.
- Sitemap, SEO brand и image audit — PASS; broken/oversized/bad-name images: 0/0/0.

## Deploy и production QA

- Deploy `update-production.sh work` — PASS.
- Runtime HEAD: `b199892`; сервис `kuhni-na-zakaz` после deploy — active.
- Прямой HTTPS smoke: 16/16 URL вернули 200.
- Production Playwright через SSH-туннель к серверному runtime `127.0.0.1:3001`: 4/4 PASS, включая оба hub и representative details.
- Lighthouse после прогрева штатного Next image cache:
  - `/styles`: Performance 100, Accessibility 100, SEO 100, LCP 1601 мс, CLS 0, TBT 3 мс;
  - `/scenarios`: Performance 100, Accessibility 100, SEO 100, LCP 1377 мс, CLS 0, TBT 2 мс.
- Холодный первый Lighthouse run превысил LCP budget из-за первичной оптимизации изображений; повторный run прошёл все assertions.

## Rollback

`git revert b199892`, push ветки `work`, затем повторный запуск `deploy/scripts/update-production.sh work`.

## Приёмка этапа 7

- 7A: 8/8 URL — ACCEPTED.
- 7B: 8/8 URL — ACCEPTED.
- 7C: 16/16 URL — ACCEPTED.
- Итого: 32/32 URL, три отдельных runtime commit/deploy/production QA.

Результат: `STAGE_7C_ACCEPTED`, `STAGE_7_ACCEPTED`.
