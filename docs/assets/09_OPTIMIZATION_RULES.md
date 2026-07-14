# Optimization Rules

1. Сохранить versioned PNG/TIFF master вне client imports.
2. Создать AVIF и WebP из одного master; не использовать тяжёлый PNG как visible src.
3. Проверить geometry/crop до агрессивного сжатия.
4. Проверить width/height, ratio, filename, checksum, alt/caption и manifest.
5. Для mobile создавать отдельный вариант; не раздавать один desktop master всем viewport.
6. Hero — единственный critical asset страницы; остальное near-view/lazy/interaction-only.
7. Не снижать качество до потери мелких деталей направляющей, петли или крепления.

Ориентиры: portrait 1080×1350/1440; landscape 1200×800; desktop до 1600×1000/1200. Видео допустимо только до 5 секунд, muted, playsinline, с poster и доказанной выгодой перед sequence.

После генерации используется установленный `sharp`; новые dependency не нужны. Каждый выбранный test asset должен иметь master, AVIF, WebP и hashes.
