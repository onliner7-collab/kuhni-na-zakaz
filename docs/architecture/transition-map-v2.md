# Карта переходов v2

Статус: `STAGE_3_ACCEPTED`
Дата: 2026-07-30
Scope: directed graph и linking design; runtime registry не изменён этим этапом.

## Покрытие

- Canonical routes в graph: **112/112**.
- Utility routes: **6/6**, отдельно.
- Transition entries: **336**.
- Status: active 0, planned 336, blocked_evidence 0, disabled 0.
- Actions: PARENT 111, DEEPEN 25, COMPARE 88, PROOF 0, CROSS_FAMILY 0, CONVERT 111, SUPPORT 1.
- Under-linked plan: **19/19**.
- Graph QA: **PASS**, P0=0, P1=0.

## Контракт

Все новые связи имеют `planned`; этап 3 не включает их в runtime. Каждая запись содержит стабильный id, русские anchor/reason, обычный target href, fallback, неперсональный contextPatch и analytics event. PROOF активируется только при verified evidence.

## Anchor distribution

- exact/partial match: около 20%, только там, где destination однозначен;
- branded: 0%, бренд не нужен в next-step анкерах;
- question/action: около 55%, основной будущий тип;
- generic: 0%, массовое «Подробнее» запрещено;
- URL: 0%;
- прочие descriptive: около 25%.

## Under-linked backlog

- `/styles/provans`: inbound 2; запланировано 4 релевантных источника.
- `/scenarios/s-ostrovom`: inbound 2; запланировано 4 релевантных источника.
- `/portfolio/neoklassicheskaya-kuhnya-vitebsk`: inbound 2; запланировано 4 релевантных источника.
- `/portfolio/malenkaya-kuhnya-gomel`: inbound 2; запланировано 4 релевантных источника.
- `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026`: inbound 1; запланировано 4 релевантных источника.
- `/blog/uglovaya-kuhnya-razmery-planirovka`: inbound 1; запланировано 4 релевантных источника.
- `/blog/kuhnya-do-potolka-plyusy-minusy-cena`: inbound 2; запланировано 4 релевантных источника.
- `/blog/kuhnya-na-zakaz-ili-gotovaya-chto-vygodnee`: inbound 1; запланировано 4 релевантных источника.
- `/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera`: inbound 2; запланировано 4 релевантных источника.
- `/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh`: inbound 2; запланировано 4 релевантных источника.
- `/blog/oshibki-pri-zakaze-kuhni-15-punktov-pered-dogovorom`: inbound 1; запланировано 4 релевантных источника.
- `/blog/kak-podgotovitsya-k-zameru-kuhni`: inbound 2; запланировано 4 релевантных источника.
- `/blog/kuhnya-dlya-chastnogo-doma-planirovka-hranenie-tehnika`: inbound 1; запланировано 4 релевантных источника.
- `/blog/kuhnya-6-kv-m-v-hruschevke`: inbound 2; запланировано 4 релевантных источника.
- `/blog/chto-vhodit-v-stoimost-kuhni-na-zakaz`: inbound 1; запланировано 4 релевантных источника.
- `/blog/kuhnya-pod-vstroennuyu-tehniku`: inbound 1; запланировано 4 релевантных источника.
- `/blog/p-obraznaya-kuhnya-razmery-prohody-cena`: inbound 2; запланировано 4 релевантных источника.
- `/blog/kak-vybrat-materialy-dlya-kuhni`: inbound 1; запланировано 4 релевантных источника.
- `/blog/kuhnya-pod-scenarij-semi-studii-doma`: inbound 1; запланировано 4 релевантных источника.

## Аналитика

`exploration_entry`, `exploration_select`, `exploration_compare`, `exploration_proof_open`, `exploration_transition_click`, `exploration_context_clear`, `lead_open_with_context`. PII и свободный текст не передаются.
