# SEO-карта пилотов

Это направления, не окончательные metadata. Текущие title/description/canonical не меняются на этапе 2.

## Карта

| URL                      | Primary / secondary cluster                                                                            | Intent                                         | Proposed H1 direction                                  | Title / description direction                                                                      | Required HTML sections                                                                                                                                    | Internal links in / out                                                                                                                                                                                               | Schema candidates                                                                                                                   | Risks / excluded queries                                                                                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/catalog/uglovye-kuhni` | купить/заказать угловую кухню, под размер, цена; буквой Г, маленькая, до потолка, с окном              | commercial category + planning decision        | `Угловая кухня на заказ под размеры помещения`         | убрать обязательную привязку к Минску из направления; показать plan/storage/cost, не обещать сроки | suitability, corner types, storage mechanisms, dimensions check, materials, cost factors, projects, service, CTA                                          | in: `/catalog`, `/`, `/prices`, relevant scenarios/blog/materials; out: `/materials/furnitura`, facade materials, `/prices`, `/calculator`, `/design-proekt-kuhni`, verified portfolio, informational blog            | BreadcrumbList; Product/Service only with valid Offer facts; FAQ only if visible; ImageObject optional                              | category vs `/scenarios/dlya-malenkoy-kuhni`, `/blog/uglovaya-kuhnya-razmery-planirovka`, comparison blog. Exclude city×type URLs and pure informational `размеры/ошибки` ownership |
| `/locations/borisov`     | купить/заказать кухню Борисов, под размер, изготовление, производитель                                 | local commercial/service                       | `Кухни на заказ в Борисове: от заявки до монтажа`      | local process and production; no invented address/showroom/timing                                  | verified local fact, 7-step journey, choices, measurement, production, delivery/install, verified projects/empty state, AI concepts, CTA                  | in: `/locations`, `/locations/minskaya-oblast`, `/`, `/catalog`, delivery/contact pages; out: categories, `/prices`, `/calculator`, `/design-proekt-kuhni`, `/portfolio` with caveat, nearby cities only where useful | BreadcrumbList; Service with verified area/provider; FAQ only visible; Organization reference, not duplicate invented LocalBusiness | overlap with `/` and `/locations/minskaya-oblast`; doorway risk. Exclude separate `угловые кухни Борисов` URLs, showroom/address queries unless facts exist                         |
| `/materials/furnitura`   | фурнитура для кухни, механизмы, петли с доводчиком, направляющие, выбор; Blum/Hettich/GTV as secondary | commercial investigation + technical education | `Фурнитура для кухни: механизмы и уровни комплектации` | mechanism behavior, where to spend/save, CTA selection; no unverified specs                        | cabinet explorer fallback text, drawers, hinges, lifts, cargo, corners, waste, package levels, economy questions, picker, related categories, visible FAQ | in: `/materials`, `/prices`, `/calculator`, categories, home; out: relevant categories, `/materials`, `/prices`, `/calculator`, `/blog/kuhni-blum-hettich-gtv`                                                        | BreadcrumbList; WebPage; FAQ if exact visible; ItemList only for visible mechanisms; avoid Article unless editorial role retained   | overlap with brand comparison blog and budget article. Exclude load/cycles/lifetime/warranty/superiority queries until official sources                                             |

## Current metadata evidence

- Angular title targets `в Минске`, while page role and canonical are non-location category. Direction should become national/non-city without creating city variants.
- Borisov title/description are local and aligned, but contain `каталог и цены`; target content must actually support those concepts without doorway repetition.
- Furnitura title is concise and aligned. The larger problem is content/DOM excess and unsupported claims, not missing keywords.

## Cannibalization ownership

### Угловые

- Category: buy/order/price/configuration and decision to request calculation.
- `/blog/uglovaya-kuhnya-razmery-planirovka`: measurements, planning rules, mistakes.
- `/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat`: informational comparison.
- `/scenarios/dlya-malenkoy-kuhni`: small-room life scenario; links to angular only as one option.
- `/scenarios/do-potolka`: height/storage scenario; not an angular subtype page.

### Борисов

- `/locations/borisov`: local production/order process and local conversion.
- `/locations/minskaya-oblast`: region hub, logistics and city discovery.
- `/`: broad `купить кухню` intent; link to Borisov as production/local proof, not duplicate local copy.

### Фурнитура

- `/materials/furnitura`: choose mechanisms/level for an order.
- `/blog/kuhni-blum-hettich-gtv`: sourced informational brand comparison.
- `/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh`: total-estimate reading, with furnitura as one factor.

## Anchor plan

- Use descriptive varied anchors: `системы хранения для угловой кухни`, `как выбрать фурнитуру`, `этапы заказа в Борисове`.
- Avoid repeating exact primary cluster in every footer/card.
- Every interactive destination must also be an ordinary `<a href>` or anchor in server HTML.
- No new URL is proposed in stage 2.

## Schema decision

- Current Angular and Borisov FAQPage are not backed by visible FAQ in their pilot branches. Before future release: render identical visible FAQ or remove FAQPage.
- Borisov Service/Offer/provider address is retained unchanged in stage 2 but marked for evidence review; do not add new address/showroom claims.
- Furnitura FAQ is visible and can remain if content stays exact. Review Article/date/ImageObject scope when page becomes an interactive commercial stand.
