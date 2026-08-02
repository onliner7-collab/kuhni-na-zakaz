# Контролируемые LCP-эксперименты

Representative route: `/styles/minimalizm`. Каждый вариант собран отдельным production build и проверен тремя Lighthouse 12.6.1 simulated mobile прогонами.

| Вариант | LCP, мс (sorted) | Median | Worst | Решение |
|---|---|---:|---:|---|
| Baseline corrective | 2861/2862/2863 | 2862 | 2863 | контроль |
| Первый frame `decoding="sync"` | 2862/2865/2865 | 2865 | 2865 | REVERT — улучшения нет |
| Без ручного `react-dom preload()` | 2859/2863/2872 | 2863 | 2872 | KEEP REMOVED — ручной вызов дублировал автоматический React preload и не помогал |
| Без `backdrop-blur` на badge | 2860/2861/2875 | 2861 | 2875 | REVERT — улучшения нет |
| Финал: без forced async на первом frame, последующие async | 2860/2863/2871 | 2863 | 2871 | ADAPT — безопасная семантика без доказанного изменения synthetic LCP |

## Reverse-audit performance hunks

| Изменение corrective diff | Предполагаемая причина | Измеренный эффект | Решение |
|---|---|---|---|
| Ручные `react-dom preload()` четырёх LCP images | более раннее обнаружение | request уже discoverable/high; React сам создаёт совпадающий preload; representative без изменения | REVERT |
| `decoding="async"` на первом LCP frame | убрать синхронный decode | sync/default не меняют synthetic LCP | ADAPT: первый frame без forced async, intent-mounted frames async |
| Route Link preload headers | старт до HTML | URL точно совпадает с AVIF/currentSrc, duplicate/mismatch requests нет | KEEP |
| Разделение `PublicChrome` и deferred enhancements | сократить pre-LCP client work | local JS и main-thread не выросли; production-control проходит; regression обнаружил только mount-after-scroll race | KEEP + адаптировать начальное состояние Dock |
| Упрощённые global Header/Footer/font/CSS hunks | сократить shell/шрифт до LCP | отдельного выигрыша synthetic LCP не доказано; функциональные и a11y regression проходят | KEEP как часть принятого corrective shell, не заявлять LCP fix |
| Удаление `backdrop-blur` на LCP badge | уменьшить compositing | median отличается в пределах шума, worst хуже | REVERT |

## Финальный local gate

Финальный код: catalog 3090–3095 мс; minimalism 2860–2862 мс; scenario 2855 мс; furnitura 3008–3010 мс. Performance 94–96, CLS 0, TBT 0–13 мс, Accessibility 96–100, SEO 100, console errors 0. Local LCP остаётся честным FAIL; разрешение на provisional deploy основано только на production-control 12/12 PASS и полной regression.
