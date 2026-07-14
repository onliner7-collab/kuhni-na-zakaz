# Sequence Rules

- один `sequenceId`, фиксированные camera/lens/light/materials/layout/object count;
- последовательные индексы без пропусков, одинаковые ratio и delivery dimensions;
- сначала генерируются closed / half / full; промежуточные кадры — только после continuity review;
- delivery name: `{sequence-id}-frame-{index}-v{version}.avif` + WebP fallback;
- manifest хранит `frameCount`, `frameRateHint`, `interactionType`, `preloadPolicy`, `fallbackPoster`, `reducedMotionFallback`;
- preload только poster; соседний кадр — после intent; весь набор не попадает в initial mobile payload;
- reduced motion использует first/last static states и кнопки, без autoplay/interpolation;
- PNG/TIFF остаётся master, не production delivery.

Текущий Angular legacy sequence из 12 кадров сохранён и зарегистрирован после continuity review. Planned drawer sequence — 8 кадров и остаётся `PROMPT_READY` до генерации ключевых состояний.
