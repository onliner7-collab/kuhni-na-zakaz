# Передача проекта следующему чату

Дата актуализации: 2026-07-13

Проект: `C:\Users\User\Desktop\kuhni-na-zakaz`

Приложение Next.js: `artifacts/kuhni-na-zakaz`

Production: `https://kuhni.minsk.by`

## Git и production

- рабочая ветка: `work`;
- implementation commit этапов 4–6: `b5a7888` (`feat: complete pilot stages 4-6`);
- commit всего оставшегося проектного набора: `417f650` (`chore: publish remaining project work`);
- `b5a7888` отправлен в `origin/work`;
- `417f650` отправлен в `origin/work` и полностью задеплоен после этапов 4–6;
- deploy выполнен штатным скриптом `deploy/scripts/update-production.sh work`;
- серверный checkout был обновлён fast-forward с `53a4955` до `b5a7888`;
- production build завершён успешно;
- сервис `kuhni-na-zakaz.service` после рестарта — `active (running)`;
- итоговые docs-only commits с этим handoff идут после implementation commit и не меняют runtime-код; серверный checkout после deploy также fast-forward до актуального `origin/work` без повторной сборки приложения.

Перед продолжением обязательно выполнить:

```powershell
git status --short
git log -5 --oneline
```

## Состояние этапов 1–6

1. Этап 1 — документация проекта: выполнен.
2. Этап 2 — manifest-first медиасистема: выполнена как план и инвентаризация.
3. Этап 3 — `/catalog/uglovye-kuhni`: выполнен и задеплоен.
4. Этап 4 — `/locations/borisov`: выполнен и задеплоен.
5. Этап 5 — `/materials/furnitura`: выполнен и задеплоен.
6. Этап 6 — совместный аудит трёх пилотов: выполнен.

Итоговый отчёт: `docs/audit/2026-07-13-stages-4-6-pilots.md`.

## Этап 4 — Борисов

URL и canonical: `/locations/borisov`.

Добавлены:

- отдельная серверная страница `components/locations/borisov/BorisovPilotPage.tsx`;
- интерактивный путь заказа и черновик выбора в `BorisovJourney.tsx`;
- сценарий проект → замер → производство → монтаж;
- честное разделение AI-концептов и подтверждённых проектов;
- fallback, который не подставляет работы из другого города;
- контекстный Dock: `Виды / Процесс / Стоимость / Замер`;
- 6 PNG masters, 6 WebP и 6 AVIF в `public/media/pilots/borisov`;
- отдельное OG-изображение.

Специальная ветка включается только для Борисова. Остальные города продолжают использовать общий `RegionalLocationPage`.

## Этап 5 — Фурнитура

URL и canonical: `/materials/furnitura`.

Добавлены:

- `components/materials/hardware/HardwareShowroom.tsx`;
- виртуальный шкаф с hotspots для петли, направляющей, подъёмника и углового решения;
- техническое сравнение;
- уровни комплектации и блок «где не экономить»;
- мини-подбор по пользовательской задаче;
- контекстный Dock: `Механизмы / Сравнить / Комплектация / Подобрать`;
- 6 PNG masters, 6 WebP и 6 AVIF в `public/media/pilots/hardware`.

Существующий SEO-контент, большая галерея и schema страницы сохранены. Абсолютные неподтверждённые claims смягчены.

## Этап 6 — совместный аудит

Подтверждено, что три пилота различаются по задаче, hero, интерактиву, порядку секций, CTA и Dock.

Исправлены найденные дефекты:

- глобальная плавающая кнопка больше не перекрывает hero-CTA на мобильных пилотах; на остальных маршрутах, включая `/locations/zhodino`, она остаётся;
- исправлен контраст активной навигации, счётчика угловой страницы и элементов пути Борисова;
- доступное имя кнопок галереи фурнитуры содержит видимую подпись ракурса.

## Проверки

Успешно выполнены:

```powershell
pnpm.cmd run typecheck
pnpm.cmd run sitemap:check
pnpm.cmd run seo:check
pnpm.cmd run images:audit
pnpm.cmd run build
pnpm.cmd exec playwright test -c playwright.smoke.config.ts tests/smoke/pilots-stages-4-6.spec.ts
```

Факты:

- sitemap: 112 URL;
- image audit: 296 ссылок, без broken/oversized/badNames;
- Playwright: 21 passed, 3 ожидаемых desktop skip;
- ширины 360, 390, 412, 768 px: без горизонтального overflow;
- production build успешен;
- локальная PostgreSQL `127.0.0.1:5434` недоступна, но build успешно использует предусмотренные fallback-данные;
- размеры маршрутов из build: `/locations/[city]` около 165–166 КБ First Load JS, `/materials/furnitura` около 170 КБ.

Локальный Lighthouse production build:

| URL | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/catalog/uglovye-kuhni` | 100 | 100 | 78 | 100 | 648 мс | 0 | 0 мс |
| `/locations/borisov` | 98 | 100 | 78 | 100 | 654 мс | 0 | 0 мс |
| `/materials/furnitura` | 100 | 100 | 78 | 100 | 697 мс | 0 | 10 мс |

Best Practices 78 объясняется общими Chrome-предупреждениями `third-party-cookies` и `inspector-issues`; это остаётся общесайтовым техническим долгом.

## Production QA

Во встроенном браузере на 390 px для всех трёх URL подтверждены:

- HTTP-доступность страницы;
- новый H1;
- правильный canonical;
- уникальные четыре действия Dock;
- `overflow = 0`;
- отсутствие битых загруженных изображений;
- скрытие дублирующего floating contact.

Дополнительно подтверждены:

- Борисов: переключение на «Производство» и выбор «Угловая»;
- фурнитура: hotspot направляющей и рекомендация мини-подбора;
- новые AVIF/WebP изображения отображаются на live-страницах.

После deploy `417f650` отдельно проверена live-главная на 390 px: 6 горизонтальных scroller-блоков получили stepper-индикаторы, все индикаторы имеют `aria-hidden="true"`, горизонтального overflow и битых изображений нет, browser console без ошибок и предупреждений.

`RegionalContactChooser.tsx` сохранён в репозитории как подготовленный компонент, но на текущих маршрутах не импортируется и не меняет production UI.

## Медиа и manifests

- `content/media/pilots/angular-kitchens.json`: partial, 21 созданный asset из 48;
- `content/media/pilots/borisov.json`: partial, 6 созданных asset из 32;
- `content/media/pilots/hardware.json`: partial, 6 созданных asset из 69.

Остальные позиции — резерв. Не считать их готовыми и не генерировать весь список без отдельной потребности. PNG masters хранить, но в UI использовать AVIF/WebP.

## Рабочее дерево и сохранённые пользовательские изменения

В commit `b5a7888` намеренно не включены существовавшие до этапа 4 изменения/файлы:

- `AGENTS.md`;
- `artifacts/kuhni-na-zakaz/app/layout.tsx`;
- `artifacts/kuhni-na-zakaz/components/locations/RegionalContactChooser.tsx`;
- `artifacts/kuhni-na-zakaz/components/layout/HorizontalScrollStepperMotion.tsx`;
- Excel handoff и прежние незакоммиченные audit-файлы.

Они не являются мусором автоматически. Не удалять, не перезаписывать и не добавлять в следующий commit без отдельной проверки владельца/назначения.

## Выполненная очистка

По прямому запросу пользователя удалены подтверждённые временные и неиспользуемые данные: workspace caches, временные логи/скриншоты, промежуточные prepared-image каталоги, остановленные локальные Next-процессы и неиспользуемый 3D-прототип. Освобождено примерно 2,6 ГБ.

Любые tracked-файлы, затронутые первоначальной слишком широкой очисткой, были немедленно восстановлены через `git restore`; итоговый commit не содержит случайных удалений.

## Что нельзя ломать

- не менять URL/canonical пилотов без отдельного решения;
- не удалять существующие формы и JSON-LD;
- не выдавать AI-концепты за реальные проекты;
- не придумывать локальные шоурумы, адреса, проекты, сроки и точные цены;
- не подключать PNG как основной видимый `src` при наличии WebP/AVIF;
- не превращать страницы целиком в client components;
- не добавлять autoplay, обязательную motion-анимацию, WebGL/3D;
- Dock каждого пилота должен оставаться контекстным и содержать ровно четыре действия;
- новые видимые тексты и alt-тексты — только на русском языке;
- UTF-8 без BOM, текстовые правки через `apply_patch`;
- не включать посторонние пользовательские изменения в commit.

## Следующий шаг

Этапы 1–6 закрыты. Следующий чат не должен самовольно начинать массовую переработку остальных 109 URL. Продолжать только по отдельному новому этапу, выбирая страницы через `docs/06_PAGE_REGISTRY.md` и сохраняя для каждой уникальный вопрос, интерактив, CTA и доказательную базу.
