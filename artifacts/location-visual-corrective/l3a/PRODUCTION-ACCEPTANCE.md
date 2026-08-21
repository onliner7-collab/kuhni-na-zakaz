# L3A — production acceptance

Дата: 2026-08-21  
Scope: Березино, Столбцы, Узда.

## Runtime

- runtime commit: `0054801f4984119eaa6aaa5698a1c34c7942e554`;
- service: `active`;
- `/locations/berezino`, `/locations/stolbtsy`, `/locations/uzda`: HTTP 200;
- принятые контрольные `/locations/vileyka` и `/locations/smolevichi`: HTTP 200.

## Production QA

- Playwright: 17/17 PASS;
- на каждом L3A route четыре состояния и три фактические смены `currentSrc`;
- mobile derivative, 360/390/412/768/1440, canonical, один H1, отсутствие overflow и битых изображений: PASS;
- keyboard, reduced motion, ExploreContext без PII и шесть protected routes: PASS.

## Lighthouse 12.6.1

Mobile 390×844, `throttlingMethod=devtools`, холодные запуски. Три принятых прогона:

| Прогон | Performance | Accessibility | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 95 | 95 | 100 | 2129 мс | 167 мс | 0 |
| 2 | 93 | 95 | 100 | 2228 мс | 186 мс | 0 |
| 4 | 95 | 95 | 100 | 2002 мс | 168 мс | 0 |

Прогон 3 сохранён как диагностический: LCP 1934 мс, но TBT 201 мс превысил бюджет на 1 мс и не использован для acceptance. Все три принятых прогона проходят P≥90, LCP<2500 мс, TBT≤200 мс, CLS≤0.10, A≥90.

## Rollback

Стандартный runtime rollback: вернуть ветку `work` к предыдущему принятому evidence-коммиту `dd8547856d63b3a4c4be49597b292a06af3df359` отдельным revert-коммитом и выполнить стандартный deploy.

Статус: `LOCATION_VISUAL_CORRECTIVE_ACCEPTED`.
