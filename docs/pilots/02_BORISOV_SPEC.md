# Спецификация `/locations/borisov`

Статус: `AUDITED`, `DESIGNED`; не `IMPLEMENTED` в рамках этапа 2.

## Reverse-audit

### Структура

- Route: `app/locations/[city]/page.tsx`, 46,754 bytes / 1027 lines; Server Component, `force-static`, `revalidate=3600`.
- Data: `data/locations.ts`, Borisov entry. Portfolio cases запрашиваются через Prisma и фильтруются по точному нормализованному city; при DB error — пустой список.
- Shared router: `RegionalLocationPage.tsx`, 123,423 bytes / 2120 lines; Borisov сразу возвращает server `BorisovPilotPage.tsx`, 12,164 bytes / 95 lines.
- Интерактив: client `BorisovJourney.tsx`, 9536 bytes / 156 lines; 2 `useState`, 1 `useMemo`.
- Дочерние client surfaces: `BorisovJourney`, shared `ContactForm`; global public chrome/Dock отдельно.
- Dynamic imports отсутствуют. Three/Framer/R3F не используются.

### Текущий UX и media

- Full-height hero, 3 trust cards, 4-step journey, 5 choice groups, category links, cost, service conditions, AI concepts vs real projects, form.
- На 390 px: 679 DOM elements, 3 images, 1 eager + 2 lazy, 0 overflow, main около 8401 px.
- Pilot group: 18 files = 6 PNG masters + 6 AVIF + 6 WebP, 12.9 MB.
- Journey содержит `Проект / Замер / Производство / Монтаж`; отсутствуют отдельные `Заявка / Предварительный расчёт / Доставка` и порядок начинается не с заявки.
- Choice summary не передаётся в форму/API и не сохраняется; это декоративный черновик, а не завершённый user flow.
- Hero использует тот же full-screen/gradient/CTA pattern, что угловые кухни. Для уникальности оставить процесс, но изменить композицию на маршрут/таймлайн.

### Доказательность и SEO

- Current title: `Купить кухню на заказ в Борисове: каталог и цены | КухниBY`; H1: `Кухни на заказ в Борисове: от идеи до монтажа`; canonical корректный.
- JSON-LD: BreadcrumbList, FAQPage, Service с Offer и provider LocalBusiness. Видимый pilot UI не показывает FAQ, поэтому FAQ schema расходится с visible content.
- Shared Service schema содержит конкретный адрес Борисова и цену; новая реализация не должна наследовать это как новое доказательство без бизнес-подтверждения.
- `data/locations.ts` содержит формулировки о монтаже «под ключ», гарантии, выезде, цену `from`, а соседний legacy path — `deliveryDays=1`. Не переносить их в target copy автоматически.
- AI hero и process images явно подписаны; реальные проекты показываются только при exact-city match. Это сильная часть, сохранить.
- Primary conversion сейчас `Записаться на замер`; целевое объединение — `Заказать замер или предварительный расчёт в Борисове`.

## Целевая роль

Primary question: «Как кухня из производства в Борисове пройдёт путь от моей заявки до монтажа?»

Primary cluster: `купить кухню в Борисове`, `кухни на заказ в Борисове`, `заказать кухню Борисов`, `кухни под размер Борисов`, `изготовление кухонь Борисов`, `производитель кухонь Борисов`.

Secondary phrases применяются естественно и не создают отдельные локальные URL.

## Mobile flow 360–412 px

1. Process hero: вертикальная линия `идея → кухня`, H1, одно доказанное сообщение `производство находится в Борисове`, CTA `Посмотреть путь`.
2. `LocalProductionProof`: только проверенные факты; без адреса/шоурума/филиала/цехового фото.
3. `ProductionJourney`: 7 этапов; first four доступны в initial HTML list, active detail — progressive enhancement.
4. `KitchenTypeChoice`: links на commercial categories; выбор может быть приложен к lead draft.
5. `StyleChoice`.
6. `FacadeChoice`.
7. `WorktopChoice`.
8. `HardwareLevelChoice`.
9. `MeasureStep`: что подготовить; без обещания срока выезда.
10. `ProductionStep`: только подтверждённое описание процесса; AI media подписывается `Иллюстрация процесса`.
11. `DeliveryInstallationStep`: условия зависят от адреса/готовности; не обещать конкретные дни.
12. `VerifiedLocalProjects`: exact-city data или честное empty state.
13. `AiConcepts`: отдельная visual family и disclosure.
14. `LeadFormSheet`/inline form: расчёт или замер; выбранные параметры передаются как необязательный summary.

## ProductionJourney contract

- Этапы: `Заявка`, `Предварительный расчёт`, `Замер`, `Проект`, `Производство`, `Доставка`, `Монтаж`.
- Server HTML: ordered list с названием и коротким смыслом всех 7 этапов.
- Client state: `activeStep`; optional `leadDraft` для формы. Не хранить персональные данные до submit.
- Mobile: вертикальная timeline/stepper; кнопка этапа 44+ px; detail раскрывается рядом, без горизонтального обязательного swipe.
- Desktop: process rail + detail panel; порядок и текст те же.
- Accessibility: buttons или disclosure controls, `aria-expanded/controls`, focus остаётся на trigger; status не спамит screen reader.
- Reduced motion: мгновенная смена карточки; decorative path drawing выключен.
- Lazy loading: hero eager; process poster первого шага lazy near viewport; остальные media по intent/intersection.
- Fallback: весь ordered text читаем без JS, links/form доступны.

## Dock и CTA

- Dock: `Виды` → `#types`; `Процесс` → `#process`; `Стоимость` → `#price`; `Замер` → `#measure`.
- Primary conversion: `Заказать замер или предварительный расчёт в Борисове`.
- При открытии form sheet передать только выбранные не-персональные параметры; пользователь подтверждает отправку формы отдельно.

## Preserve / remove / redesign

- Preserve: exact-city portfolio filter/empty state, AI disclosure, server branch, canonical, breadcrumb, form, category links, location data source.
- Remove during implementation: invented-looking address/showroom implications, unverified timing/warranty claims, hidden FAQ schema, decorative summary not connected to lead.
- Redesign: 4-step journey → 7-step ProductionJourney; hero → process-led composition; choices → компактный progressive flow; verified projects remain conditional.

## Не придумывать

Адрес, шоурум, филиал, фотографии производства, выполненные проекты, отзывы, сроки и гарантию. Любая будущая AI-сцена процесса получает видимую подпись `Иллюстрация процесса`.
