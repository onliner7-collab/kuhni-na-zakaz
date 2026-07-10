# Отчет по этапам 4-6 SEO

Дата: 2026-07-10

Проект: kuhni.minsk.by

## Этап 4. Страницы типов кухонь

Сделано:

- Усилена коммерческая обвязка страницы `/catalog/kuhni-bez-ruchek`: добавлен buying guide с параметрами, рекомендациями, частыми ошибками и ссылкой на материал про фасады.
- Для `/catalog/kuhni-do-potolka` и `/catalog/kuhni-bez-ruchek` добавлены ссылки на 3D-проект как шаг перед расчетом.
- Для спорных типов добавлены ссылки на сценарии-гиды:
  - `/catalog/kuhni-s-ostrovom` -> `/scenarios/s-ostrovom`;
  - `/catalog/kuhni-do-potolka` -> `/scenarios/do-potolka`;
  - `/catalog/malenkie-kuhni` -> `/scenarios/dlya-malenkoy-kuhni`.

## Этап 5. Каталог и сценарии

Сделано:

- В сценариях `/scenarios/s-ostrovom`, `/scenarios/do-potolka`, `/scenarios/dlya-malenkoy-kuhni` добавлен отдельный коммерческий CTA на соответствующую страницу каталога.
- Для этих трех сценариев добавлен статический fallback, чтобы страницы не отдавали 404 при временно недоступной базе данных.
- `/scenarios` также получает fallback-карточки и не пустеет при недоступной базе.
- Логика разделения сохранена:
  - каталог продает конкретный тип кухни, показывает цену, фото, материалы и форму;
  - сценарий помогает понять, подходит ли решение, какие есть ограничения и ошибки.

## Этап 6. Региональные страницы

Сделано:

- Для всех региональных страниц через общий helper добавлены обязательные коммерческие внутренние ссылки:
  - каталог кухонь;
  - угловые кухни;
  - прямые кухни;
  - кухни до потолка;
  - цены на кухни;
  - портфолио.
- Существующие уникальные городские ссылки сохраняются первыми, поэтому страницы не превращаются в одинаковый шаблон.

## Проверка

Выполнено:

- `pnpm run typecheck` — успешно.
- `pnpm run seo:check` — успешно.
- `pnpm run sitemap:check` — успешно, 112 URL.
- `pnpm run build` — успешно.
- Playwright mobile 390px:
  - `/catalog/kuhni-bez-ruchek`;
  - `/catalog/kuhni-do-potolka`;
  - `/catalog/kuhni-s-ostrovom`;
  - `/catalog/malenkie-kuhni`;
  - `/scenarios/s-ostrovom`;
  - `/scenarios/do-potolka`;
  - `/scenarios/dlya-malenkoy-kuhni`;
  - `/locations/gomel`;
  - `/scenarios`.

Результат Playwright: 200 status, нужные ссылки найдены, page errors нет, broken images 0, horizontal overflow false.

Примечание:

- Во время локального `next build` Prisma выводил ошибки подключения к `127.0.0.1:5434`, потому что локальная база недоступна. Сборка завершилась успешно на fallback/static данных.
