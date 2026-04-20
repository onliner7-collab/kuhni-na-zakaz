# Bulk Import v1: ограничения для оператора

Ниже только те ограничения, которые реально действуют в текущей реализации.

## Что поддерживается

- только один `.xlsx` workbook за один запуск
- только листы `Kitchens`, `Styles`, `Materials`, `Scenarios`, `Portfolio`, `Locations`
- только import через админку `/admin/imports`
- только `preview -> confirm/apply`

## Что не входит в v1

- калькулятор и конфигуратор
- blog
- homepage blocks
- static pages
- site settings
- FAQ items вне `Locations.faq`
- reviews moderation data
- delete / archive flow
- загрузка медиа на сервер

## Ограничения по данным

- `externalId` обязателен для каждой импортируемой строки
- одинаковый `externalId` внутри одного листа приведёт к ошибке
- для существующей записи `slug` не обновляется
- если запись уже существует, часть колонок вне safe scope будет проигнорирована даже если заполнена

Колонки, которые parser может прочитать, но bulk import v1 не должен использовать как обновляемые рабочие поля:
- `Styles.relatedMaterials`
- `Styles.relatedCaseSlugs`
- `Styles.relatedScenarioSlugs`
- `Materials.relatedStyles`
- `Materials.relatedCaseSlugs`
- `Materials.relatedScenarioSlugs`
- `Scenarios.relatedStyles`
- `Scenarios.relatedMaterials`
- `Scenarios.relatedCaseSlugs`
- `Portfolio.styleSlug`
- `Portfolio.materialSlugs`
- `Portfolio.scenarioSlugs`
- `Locations.caseSlugs`
- `Locations.reviewIds`

Практическое правило:
- если колонки нет в передаваемом шаблоне, не добавляйте её сами без согласования

## Ограничения по фото

- нужны только прямые image URLs
- страницы просмотра и шаринга не проходят валидацию
- `postimg.cc` и `postimages.org` использовать нельзя
- если сервер по ссылке возвращает HTML, а не `image/*`, строка уйдёт в ошибку

## Ограничения по preview/apply

- `apply` доступен только если в preview нет `errors`
- `warnings` не блокируют apply, но их должен проверить оператор
- preview-сессия временная и истекает примерно через `1 час`
- после истечения preview нужно загрузить workbook заново

## Ограничения по повторному импорту

- repeat import должен давать `unchanged`, если данные реально не менялись
- если в workbook есть реальные изменения, preview покажет `update`
- если workbook заполнен невалидно, строка будет `invalid`, а не `update` или `unchanged`
