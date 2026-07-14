# Этап 4 — Component Library

Baseline: production `19ac6ab`. Компоненты реализованы в `artifacts/kuhni-na-zakaz/components/pilots/library` и не импортируются тремя production-страницами.

## Shared

- `MobileHero`: server primitive с вариантами `spatial`, `journey`, `technical`;
- `ContextDock`: ровно четыре контекстных действия;
- `SwipeGallery`: native snap, counter, buttons и reduced-motion behavior;
- `BottomSheet`: dialog, focus trap/restore, Escape и safe-area;
- `DeferredMediaViewer`: poster-first и dynamic gallery chunk после intent.

## Specialized

- `CornerStorageExplorer`;
- `ProductionJourney` — ровно семь этапов и текстовые fallback;
- `HardwareCabinetExplorer` — одна зона/одно media после intent;
- `KitchenLayoutCheck` — только предварительный ориентир;
- `MechanismComparison`;
- `HardwarePicker` — discussion brief, не specification.

Dev preview: `/component-library-preview`. В production route возвращает 404 без `ENABLE_COMPONENT_LIBRARY_PREVIEW=1`, имеет `noindex` и не входит в sitemap. Stage-4 Playwright проверяет 360/390/412/768/1440 px, 44 px targets, overflow, focus, Escape, reduced motion и intent mounting.
