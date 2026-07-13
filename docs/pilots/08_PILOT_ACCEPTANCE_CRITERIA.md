# Критерии приёмки будущих пилотов

Эти критерии применяются в этапах 4–8. Статус этапа 2: спецификация создана; UI ещё не принят.

## Mobile UX

- [ ] Проверено 360, 390 и 412 px на среднем Android profile; отдельно 768 и desktop.
- [ ] `documentElement.scrollWidth === clientWidth`; контролируемый inner scroller имеет label/cue.
- [ ] Все interactive touch targets минимум 44×44 px, включая header, breadcrumb, FAQ summary, form controls и inline project links.
- [ ] Dock содержит ровно 4 page-specific actions, учитывает safe-area, скрывается при keyboard/sheet/form focus и не перекрывает content/submit/errors.
- [ ] Main имеет измеренную компенсацию высоты Dock; последний control доступен над Dock.
- [ ] Один экран — одна основная задача; нет непрерывной 50k+ px gallery/card wall.
- [ ] Основной текст читается без zoom; H1/CTA не обрезаны на первом экране.
- [ ] Swipe имеет visual cue, counter и button/keyboard alternative; drag не обязателен.
- [ ] Tabs/disclosures имеют `aria-controls`, selected/expanded state и keyboard behavior.
- [ ] Bottom sheet trap/restore focus, Escape/close label и safe-area.
- [ ] `prefers-reduced-motion` выключает autoplay/path drawing/interpolation; функциональность остаётся.

## Performance

- [ ] Один hero priority; fixed width/height/aspect-ratio; poster не блокирует текстовый first paint.
- [ ] Hidden sequences и inactive option media не запрашиваются до intent/intersection.
- [ ] `/materials/furnitura` не монтирует сотни image/button nodes: initial gallery target 8–12 thumbnails, остальные category-on-demand.
- [ ] Page/layout остаются Server Components; каждый main interactive — изолированный Client Component.
- [ ] Route client JS измерен до/после на одинаковой production build; regression имеет объяснение и budget decision.
- [ ] Нет обязательного WebGL/Three/R3F/video autoplay.
- [ ] AVIF/WebP production src; masters не подключены напрямую.
- [ ] Нет layout shift от images, sheets, fonts и hydration; CLS проверен инструментом, а не визуальным впечатлением.
- [ ] LCP/INP/CLS проверены на mobile throttle и отдельно field data, если доступно; не заявлять pass без измерения.
- [ ] Повторные renders/state ограничены текущим island; gallery data не сериализуется без нужды.

## SEO

- [ ] URL сохранён; один абсолютный self-canonical; robots/sitemap не изменены случайно.
- [ ] Один H1; logical H2/H3; важный текст присутствует в initial server HTML.
- [ ] Все важные переходы — crawlable `<a href>`, descriptive varied anchors.
- [ ] Breadcrumb видим и BreadcrumbList совпадает.
- [ ] FAQ schema существует только для точного видимого FAQ; hidden pilot FAQ запрещён.
- [ ] Service/Product/Offer/Article/ImageObject используются только при совпадении с ролью страницы и подтверждёнными фактами.
- [ ] AI/real status видим пользователю; alt/caption на русском.
- [ ] Angular commercial cluster не поглощает informational blog/scenario queries.
- [ ] Borisov не становится doorway page и не заявляет адрес/showroom/проекты/отзывы/сроки/гарантию без доказательств.
- [ ] Furnitura не публикует нагрузки, циклы, lifetime, warranty или brand superiority без official source/series scope.
- [ ] Title/description проверены как направления после GSC/SERP data; keyword stuffing отсутствует.

## Функциональность

- [ ] Existing form API, validation, honeypot, rate limit, notifications и optional file path проходят regression tests.
- [ ] Context summary передаётся в форму только как non-personal draft; submit остаётся явным действием пользователя.
- [ ] Dock anchors, internal links, CTA, close/back и form success/error работают.
- [ ] Desktop сохраняет ту же IA и полноценную функциональность.
- [ ] Каждый interactive имеет no-JS/static fallback и failure state при missing media.
- [ ] Missing image/sequence не делает секцию пустой и не блокирует заявку.
- [ ] Verified local project logic не показывает project другого города как Borisov proof.

## Browser/e2e matrix

| Test                      | Angular                 | Borisov              | Furnitura                  |
| ------------------------- | ----------------------- | -------------------- | -------------------------- |
| H1/canonical/breadcrumb   | required                | required             | required                   |
| Dock labels and targets   | 4 exact                 | 4 exact              | 4 exact                    |
| Main interaction keyboard | slider/tabs/buttons     | 7-step disclosure    | hotspots + duplicate list  |
| Reduced motion            | discrete frames         | instant steps        | static states              |
| Lazy media                | sequence after intent   | journey after intent | zone/category after intent |
| Primary form              | calculation             | measure/calculation  | hardware selection         |
| Proof constraint          | real project provenance | exact-city/empty     | official technical sources |

## Release gate

Пилот нельзя отметить `IMPLEMENTED`/`VERIFIED`, пока:

1. нет code review и build/typecheck;
2. нет browser matrix и form smoke;
3. нет SEO HTML/schema regression;
4. media registry не имеет `READY` assets с provenance;
5. unresolved P0/P1 по mobile, performance или proof остаются открыты.
