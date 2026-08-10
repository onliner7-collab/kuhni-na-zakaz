# L0 registry update

## Page registry

- `/locations`: visual hub, три изменения изображения, progressive disclosure полного city directory.
- `/locations/soligorsk`: active series `location-soligorsk-compact-storage-l0`.
- `/locations/fanipol`: active series `location-fanipol-new-build-l0`.
- `/locations/gomel`: active series `location-gomel-family-worktop-l0`.
- Остальные 25 corrective routes: page contract существует, active series отсутствует до своей волны.
- `/locations/minsk`, `/locations/minskaya-oblast`, `/locations/borisov`: protected, generic config отсутствует.

## Component registry

- `LocationVisualExplorer`: маленький client island, native tabs, four-state image switch, ExploreContext.
- `LocationVisualStage`: один активный responsive visual, intrinsic 1200×800, AVIF/WebP.
- `LocationHubExplorer`: три route-specific направления на hub.
- `RegionalLocationPage`: ADAPT только по exact active-series route gate.

## Media registry

- 12 AI-concept/process masters, 12 WebP, 12 AVIF.
- Provenance: `ai-concept` или `process-illustration`; disclosure: «AI-концепция, не фото выполненной работы».
- Rights/source: generated in-project via built-in Codex/OpenAI imagegen.

## Decision log

- Фактический audit имеет 11 generic fallback и 17 трёхкадровых route-specific серий; rollout следует коду, а не устаревшему числу 11 во вводной части ТЗ.
- Registry разделён на 28 page contracts и active series. Это исключает фиктивное подключение отсутствующих media для будущих волн.
- Metadata, canonical, schema и lead API не изменялись.

## Handoff

- L0 local implementation и media приняты.
- L1 запрещено начинать до commit/deploy/production acceptance L0.
- Shared root registries были уже изменены пользователем до этого чата; чтобы не смешивать чужие незакоммиченные изменения с L0 commit, точный additive update сохранён этим отдельным документом.
