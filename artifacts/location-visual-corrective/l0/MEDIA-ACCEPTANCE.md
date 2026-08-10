# L0 media acceptance

Статус: `MEDIA_ACCEPTED`
Дата: 2026-08-10

## Проверено

- 12/12 подключаемых masters сохранены в `public/uploads/locations/*-visual-l0/`.
- 12/12 имеют отдельные WebP и AVIF 1200×800; runtime не использует PNG masters.
- WebP весят 27–40 КБ, AVIF — 14–25 КБ; broken/oversized audit = 0.
- Все изображения без текста, логотипов, watermark и людей.
- Русские alt и disclosure присутствуют в registry.
- Серии не выдаются за реальные проекты и не содержат локальных фактических claims.
- На contact sheets сохранены геометрия, камера, палитра и логика соседних состояний.
- Первый слабый storage-state Солигорска заменён на визуально различимый v2.

## Evidence

- `artifacts/location-visual-corrective/l0/contact-sheets/soligorsk-contact-sheet.webp`
- `artifacts/location-visual-corrective/l0/contact-sheets/fanipol-contact-sheet.webp`
- `artifacts/location-visual-corrective/l0/contact-sheets/gomel-contact-sheet.webp`
- `artifacts/location-visual-corrective/l0/IMAGE-BRIEFS.md`

Источник генерации: только встроенный генератор Codex/OpenAI через навык `imagegen`.
