# L1A registry update

Дата: 2026-08-11

- Active runtime series: 7 — три L0 pilot + Витебск, Гродно, Брест, Могилёв.
- Остальные 21 generic-city route остаются без active config до своих волн.
- Protected routes Минск, Минская область и Борисов не имеют generic series.
- Каждая новая серия: 4 states, 4 unique WebP, 4 AVIF, русские controls/alt/disclosure, 2 canonical next routes на state.
- Исправлен contract-target Гродно с несуществующего `/styles/sovremennyy` на canonical `/styles/sovremennye`.
- В новом unit gate nextRoutes активных серий проверяются по `public/sitemap-static.xml`.

Основные docs registry уже содержат незакоммиченные пользовательские изменения, поэтому L1A delta сохранена изолированно и не перезаписывает эти файлы.
