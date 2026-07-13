# Information Architecture

| Группа         | Parent | Роль                      | Дочерние типы          | Основные связи                    | Риск                           |
| -------------- | ------ | ------------------------- | ---------------------- | --------------------------------- | ------------------------------ |
| Главная        | —      | широкий коммерческий вход | hubs и ключевые услуги | catalog, prices, Minsk, portfolio | каннибализация широкого intent |
| Каталог        | /      | выбор формы               | category pages         | scenarios, materials, prices      | шаблонность категорий          |
| Стили          | /      | выбор визуального языка   | style pages            | portfolio, materials              | пересечение с portfolio        |
| Материалы      | /      | выбор комплектации        | material pages         | prices, categories, blog          | одинаковые сравнения           |
| Сценарии       | /      | выбор по бытовой задаче   | scenario pages         | category, blog                    | пересечение с категориями      |
| Цены           | /      | объяснение бюджета        | calculator, form       | materials, categories             | непроверенные абсолютные цены  |
| Проектирование | /      | подготовка решения        | configurator/form      | calculator, portfolio             | тяжёлый client JS              |
| Портфолио      | /      | доказательства            | project pages          | city, style, category             | provenance и city claims       |
| Локации        | /      | география обслуживания    | city pages             | delivery, contacts, portfolio     | doorway-подобные шаблоны       |
| Блог           | /      | информационный спрос      | articles               | релевантные commercial pages      | каннибализация статей          |
| Служебные      | /      | доверие/право/результат   | policies, thanks       | forms                             | indexability rules             |

Ничего не удалять и не перенаправлять автоматически. Parent/child и текущие 112 URL перечислены в `11_PAGE_REGISTRY.md`.
