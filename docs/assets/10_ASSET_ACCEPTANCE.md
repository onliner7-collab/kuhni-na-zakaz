# Asset Acceptance

Asset принимается в `REGISTERED`, если:

- unique ID, version, collection, page, component, section и purpose заполнены;
- main/negative/consistency/camera/light/material/mobile/variation prompt заполнены для AI/technical;
- origin/rights честны, real proof подтверждён отдельно;
- русские alt и caption описывают содержимое, не спамят ключами;
- master + AVIF + WebP существуют, размеры и hashes читаются;
- geometry, mobile crop и continuity прошли review;
- loading/reduced-motion/fallback contract определён;
- status не завышен: без подключения запрещены `CONNECTED`, `VERIFIED`, `LIVE`.

## Команды gate

```powershell
pnpm.cmd run assets:build-stage3
pnpm.cmd run assets:validate
pnpm.cmd run assets:duplicates
git diff --check
```

Stage 4 может использовать только записи `REGISTERED`; `PROMPT_READY`, `PLANNED` и `REVIEW_REQUIRED` требуют placeholder/fallback и не должны молча становиться UI asset.
