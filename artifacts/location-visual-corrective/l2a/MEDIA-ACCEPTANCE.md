# L2A media acceptance

Дата: 2026-08-13
Статус: `MEDIA_ACCEPTED`

## Принятые серии

| Route | Series | Masters | Delivery |
| --- | --- | ---: | --- |
| `/locations/smolevichi` | `location-smolevichi-pre-finish-l2a` | 4 | PNG source + WebP/AVIF 1200×800 + mobile WebP 480×320 |
| `/locations/dzerzhinsk` | `location-dzerzhinsk-apartment-family-l2a` | 4 | PNG source + WebP/AVIF 1200×800 + mobile WebP 480×320 |
| `/locations/zaslavl` | `location-zaslavl-house-apartment-l2a` | 4 | PNG source + WebP/AVIF 1200×800 + mobile WebP 480×320 |
| `/locations/logoisk` | `location-logoisk-house-dacha-l2a` | 4 | PNG source + WebP/AVIF 1200×800 + mobile WebP 480×320 |

## Visual QA

- 16/16 masters созданы отдельными вызовами встроенного Codex/OpenAI `imagegen`.
- Masters сохранены в `public/uploads/locations/*-visual-l2a/`; runtime не подключает PNG.
- Четыре contact sheet просмотрены в original detail; каждый state различим и соответствует brief.
- Нет людей, текста, логотипов, watermark и признаков документального local proof.
- Русские alt и видимый disclosure определены в active registry.
- Mobile WebP: максимум 13 722 байта; representative LCP transfer после подключения mobile srcset — 8 507 байт.
- WebP/AVIF parity и существование файлов подтверждены unit tests.

Contact sheets: `artifacts/location-visual-corrective/l2a/contact-sheets/`.
Briefs и final prompts: `artifacts/location-visual-corrective/l2a/IMAGE-BRIEFS.md`.
