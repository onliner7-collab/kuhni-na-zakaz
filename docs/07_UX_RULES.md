# UX Rules

1. Сначала проектировать 360–412 px и управление одной рукой; затем tablet/desktop.
2. Один экран — одна основная задача, одна заметная CTA hierarchy.
3. Короткие подписи и progressive disclosure; важный контент не скрывается обязательно за JS.
4. Swipe-area имеет понятный визуальный cue, native scrolling и keyboard alternative.
5. Hotspots, comparisons и sliders работают touch/keyboard и имеют текстовый эквивалент.
6. Bottom sheet не перекрывает системную навигацию, удерживает и возвращает focus.
7. Глобальная навигация доступна всегда; Context Dock различается по странице и не заменяет IA.
8. Dock скрывается при keyboard/form focus и overlays, учитывает safe-area и оставляет нижний padding контента.
9. Никакого горизонтального page scroll. Внутренний horizontal scroller допустим только как явный контролируемый паттерн.
10. Motion необязателен, не блокирует задачу и отключается при `prefers-reduced-motion`.
11. Медленная сеть: hero минимален, скрытые sequences не загружаются заранее, есть poster/skeleton без CLS.
12. Страница не готова, если desktop хорош, а mobile перегружен, медленен или имеет targets меньше 44 px.
