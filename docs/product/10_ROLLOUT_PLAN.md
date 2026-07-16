# План адресного внедрения

## Общий процесс каждого этапа

1. Проверить branch/status/HEAD и live baseline.
2. Прочитать Product Architecture и page-specific docs.
3. Выполнить diff-аудит `KEEP / ADAPT / REPLACE / MOVE / REMOVE`.
4. Зафиксировать URL/metadata/schema/form/media contracts.
5. Реализовать минимальный разрешённый scope.
6. Проверить 360/390/412/768/1440, keyboard, focus, reduced motion, overflow и safe-area.
7. Проверить server HTML, crawlable links, canonical/schema и sitemap regression.
8. Проверить images/performance/initial payload.
9. Обновить registries, Decision Log, Handoff и rollback.
10. Отдельно принять этап до начала следующего.

## Последовательность

| Этап | Scope | Главный результат | Запрет |
| ---: | --- | --- | --- |
| 5 | Глобальная навигация | новое меню, постоянный Dock, короткий LeadFormSheet, перенос context actions | не переделывать страницы целиком |
| 6 | `/catalog/uglovye-kuhni` | diff-аудит уже внедрённого пилота по Product Architecture | не переписывать принятые блоки без доказательства |
| 7 | `/locations/borisov` | process-led journey и честное local proof | не копировать Angular IA |
| 8 | `/materials/furnitura` | intent-mounted gallery и mechanism education | не удалять 203 изображения |
| 9 | Совместный аудит пилотов | uniqueness, UX, CWV, SEO, a11y, forms | не масштабировать до приёмки |
| 10 | Главная | вход в цифровой шоурум, исправление языка и provenance split | не повторять каталог/портфолио |
| 11 | `/locations/minsk` | условия заказа в Минске | не придумывать офис/филиал |
| 12 | `/prices` | структура стоимости и путь к расчёту | не обещать точную цену без проекта |
| 13 | `/design-proekt-kuhni` | проектный brief и progressive form | не раздувать client JS |
| 14 | `/catalog/pryamye-kuhni` | отдельная модель одной линии | не копировать Angular explorer |
| 15 | Все оставшиеся страницы | URL-level uniqueness/transition matrix | не начинать массовую реализацию |
| 16+ | Группы страниц | постепенное масштабирование | не создавать city × type × style URLs |

## Коллизия исторической нумерации

В репозитории уже существует исторически названный «Этап 5» для `/catalog/uglovye-kuhni`, и он live. В Product Architecture новая последовательность использует «Этап 5» для глобальной навигации согласно утверждённому ТЗ.

Правило дальнейших handoff:

- писать `Product этап 5 — глобальная навигация`;
- существующую Angular реализацию называть `исторический pilot stage 5`;
- Product этап 6 начинает с reverse/diff-аудита live Angular, а не с переписывания с нуля.

## Product этап 5: минимальный scope

- адаптировать `Header` к новой IA и карточной системе;
- сделать `MobileBottomNav` глобальным с четырьмя постоянными пунктами;
- определить `PageActionRail` для текущих контекстных якорей;
- реализовать короткий `LeadFormSheet` поверх действующей Lead/Telegram модели;
- сохранить `FloatingSocialButtons` без изменения поведения;
- исключить admin/API/route handlers/technical pages/`thanks`;
- сохранить server links и active mapping;
- не менять metadata, sitemap, robots и URL без отдельного доказанного исправления.

## Rollback strategy

Каждый этап имеет отдельный commit. Shared navigation changes должны иметь route matrix и один revert commit path. Data migrations, media generation и content imports не включаются в Product этап 5 без отдельного разрешения.

## Gate масштабирования

Масштабирование запрещено, пока три пилота не прошли совместную проверку и нет доказательства, что новая глобальная навигация работает на всех route families, включая legal и calculator.
