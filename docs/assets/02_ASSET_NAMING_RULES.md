# Правила именования

Новый stem: `{page}-{collection}-{subject}-{state}-{view}-{index}-v{version}`. Только `a-z`, цифры и дефисы; без пробелов, брендов, неподтверждённых локаций и SEO-спама.

Sequence: `{sequence-id}-frame-{index}-v{version}.avif`. Индекс двухзначный, без пропусков. Master и delivery используют один stem.

Примеры:

- `angular-corner-types-pullout-corner-front-01-v1.webp`;
- `borisov-production-assembly-detail-03-v1.avif`;
- `hardware-drawer-open-frame-01-v1.avif`.

33 существующих pilot stem не содержат suffix `-v1`. Они помечены `LEGACY_GRANDFATHERED` и не переименованы, потому что уже используются runtime-кодом. Все новые planned stem проходят строгий checker.
