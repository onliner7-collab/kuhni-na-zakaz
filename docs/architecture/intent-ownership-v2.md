# Intent ownership v2

Статус: `STAGE_2_ACCEPTED`. Все 112 canonical URL имеют владельца intent в `site-architecture-v2.json`.

| Route | Family | Owned intent (hypothesis) | Must not own | Fallback |
| --- | --- | --- | --- | --- |
| `/` | home | выбрать путь к кухне на заказ | конкретная планировка; точная цена; неподтверждённое локальное доказательство | `/` |
| `/about` | trust | проверить компанию и ответственность | неподтверждённые регалии; выдуманный отзыв; точная цена | `/` |
| `/catalog` | catalog listing | выбрать форму кухни | конкретный стиль; характеристика материала; история реализованного объекта | `/` |
| `/calculator` | calculator/tool | получить предварительный ориентир бюджета | гарантированная итоговая цена; detail-интент формы или стиля; локальное доказательство | `/` |
| `/design-proekt-kuhni` | service | подготовить дизайн-проект | чужой detail-интент; неподтверждённое доказательство; обещание результата | `/` |
| `/prices` | service | понять структуру цены | чужой detail-интент; неподтверждённое доказательство; обещание результата | `/` |
| `/contacts` | service | выбрать канал связи | чужой detail-интент; неподтверждённое доказательство; обещание результата | `/` |
| `/portfolio` | portfolio listing | проверить реальные работы | AI-концепт как реализованный объект; выбор материала как основной интент; точная цена | `/` |
| `/reviews` | trust | проверить опыт клиентов | неподтверждённые регалии; выдуманный отзыв; точная цена | `/` |
| `/blog` | blog listing | выбрать практический вопрос | коммерческий detail-интент; точная цена; локальное доказательство | `/` |
| `/delivery-installation` | service | понять доставку и монтаж | чужой detail-интент; неподтверждённое доказательство; обещание результата | `/` |
| `/styles` | hub | выбрать визуальное направление | интент конкретной detail-страницы; точная стоимость; неподтверждённый proof | `/` |
| `/materials` | material listing | выбрать материал или механизм | точная характеристика без образца; стиль; реальный проект | `/` |
| `/materials/furnitura` | hardware | выбрать механизмы кухни | гарантированная совместимость; точная комплектация; точная цена | `/materials` |
| `/materials/ldsp` | material detail | оценить ЛДСП для кухни | точная характеристика без evidence; стиль; гарантированная совместимость | `/materials` |
| `/materials/mdf-fasady` | material detail | выбрать основу и покрытие МДФ | точная характеристика без evidence; стиль; гарантированная совместимость | `/materials` |
| `/materials/plastik-hpl` | material detail | оценить HPL-поверхность | точная характеристика без evidence; стиль; гарантированная совместимость | `/materials` |
| `/materials/shpon` | material detail | оценить натуральную фактуру шпона | точная характеристика без evidence; стиль; гарантированная совместимость | `/materials` |
| `/scenarios` | hub | выбрать кухню по бытовой задаче | интент конкретной detail-страницы; точная стоимость; неподтверждённый proof | `/` |
| `/locations` | location hub | проверить географию работ | локальное доказательство конкретного города; точные условия выезда; точная цена | `/` |
| `/warranty` | service | понять гарантийные условия | чужой detail-интент; неподтверждённое доказательство; обещание результата | `/` |
| `/catalog/uglovye-kuhni` | catalog detail | выбрать угловую планировку | владение стилевым интентом; точная стоимость; доказательство реализации без evidence | `/catalog` |
| `/catalog/pryamye-kuhni` | catalog detail | выбрать прямую планировку | владение стилевым интентом; точная стоимость; доказательство реализации без evidence | `/catalog` |
| `/catalog/p-obraznye-kuhni` | catalog detail | выбрать П-образную планировку | владение стилевым интентом; точная стоимость; доказательство реализации без evidence | `/catalog` |
| `/catalog/kuhni-s-ostrovom` | catalog detail | выбрать кухню с островом | владение стилевым интентом; точная стоимость; доказательство реализации без evidence | `/catalog` |
| `/catalog/malenkie-kuhni` | catalog detail | выбрать решение для малой площади | владение стилевым интентом; точная стоимость; доказательство реализации без evidence | `/catalog` |
| `/catalog/kuhni-do-potolka` | catalog detail | выбрать вертикальное хранение | владение стилевым интентом; точная стоимость; доказательство реализации без evidence | `/catalog` |
| `/catalog/kuhni-bez-ruchek` | catalog detail | выбрать способ открывания без ручек | владение стилевым интентом; точная стоимость; доказательство реализации без evidence | `/catalog` |
| `/styles/neoklassika` | style | выбрать неоклассический стиль | владение планировкой; характеристика материала; реальный проект без evidence | `/styles` |
| `/styles/hay-tek` | style | выбрать хай-тек | владение планировкой; характеристика материала; реальный проект без evidence | `/styles` |
| `/styles/provans` | style | выбрать прованс | владение планировкой; характеристика материала; реальный проект без evidence | `/styles` |
| `/styles/loft` | style | выбрать лофт | владение планировкой; характеристика материала; реальный проект без evidence | `/styles` |
| `/styles/sovremennye` | style | выбрать современный стиль | владение планировкой; характеристика материала; реальный проект без evidence | `/styles` |
| `/styles/skandinavskie` | style | выбрать скандинавский стиль | владение планировкой; характеристика материала; реальный проект без evidence | `/styles` |
| `/styles/klassicheskie` | style | выбрать классический стиль | владение планировкой; характеристика материала; реальный проект без evidence | `/styles` |
| `/styles/minimalizm` | style | выбрать минимализм | владение планировкой; характеристика материала; реальный проект без evidence | `/styles` |
| `/materials/akril` | material detail | оценить акриловые фасады | точная характеристика без evidence; стиль; гарантированная совместимость | `/materials` |
| `/materials/mdf-emal` | material detail | оценить окрашенный МДФ | точная характеристика без evidence; стиль; гарантированная совместимость | `/materials` |
| `/scenarios/s-ostrovom` | scenario | решить бытовую задачу с островом | владение формой; характеристика материала; точная стоимость | `/scenarios` |
| `/scenarios/do-potolka` | scenario | увеличить вертикальное хранение | владение формой; характеристика материала; точная стоимость | `/scenarios` |
| `/scenarios/dlya-semi` | scenario | выбрать кухню для семьи | владение формой; характеристика материала; точная стоимость | `/scenarios` |
| `/scenarios/dlya-studii` | scenario | выбрать кухню для студии | владение формой; характеристика материала; точная стоимость | `/scenarios` |
| `/scenarios/dlya-malenkoy-kuhni` | scenario | решить ограничения маленькой кухни | владение формой; характеристика материала; точная стоимость | `/scenarios` |
| `/scenarios/byudzhetnaya-kuhnya` | scenario | распределить ограниченный бюджет | владение формой; характеристика материала; точная стоимость | `/scenarios` |
| `/portfolio/kuhnya-japandi-zelenye-fasady-minsk` | portfolio detail | изучить подтверждённый проект japandi | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/loft-kuhnya-oreh-poluostrov-minsk` | portfolio detail | изучить проект loft с полуостровом | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/neoklassicheskaya-kuhnya-sinie-fasady-minsk` | portfolio detail | изучить неоклассический проект | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/belaya-kuhnya-do-potolka-minsk` | portfolio detail | изучить проект до потолка | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/kuhnya-s-ostrovom-zelenyj-akcent-minsk` | portfolio detail | изучить проект кухни с островом | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/pryamaya-kuhnya-studiya-dubovaya-nisha-minsk` | portfolio detail | изучить прямую кухню для студии | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/seraya-uglovaya-kuhnya-novostrojka-minsk` | portfolio detail | изучить угловой проект новостройки | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/pryamaya-kuhnya-dlya-studii-brest` | portfolio detail | изучить проект студии в Бресте | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/kuhnya-s-ostrovom-grodno` | portfolio detail | изучить островной проект в Гродно | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/neoklassicheskaya-kuhnya-vitebsk` | portfolio detail | изучить неоклассический проект в Витебске | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/malenkaya-kuhnya-gomel` | portfolio detail | изучить малую кухню в Гомеле | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/kuhnya-do-potolka-mogilev` | portfolio detail | изучить проект до потолка в Могилёве | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/portfolio/uglovaya-kuhnya-dlya-novostroyki-minsk` | portfolio detail | изучить угловой проект новостройки | обобщённый каталог; неподтверждённые характеристики; точная цена другого проекта | `/portfolio` |
| `/blog/skolko-stoit-kuhnya-na-zakaz-minsk-2026` | blog article | узнать актуальный ориентир цены в Минске | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/uglovaya-kuhnya-razmery-planirovka` | blog article | изучить размеры угловой кухни | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhnya-do-potolka-plyusy-minusy-cena` | blog article | оценить плюсы, минусы и цену кухни до потолка | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhnya-na-zakaz-ili-gotovaya-chto-vygodnee` | blog article | сравнить заказную и готовую кухню | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhnya-dlya-novostroyki-v-minske-do-zamera` | blog article | подготовить новостройку к замеру | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kak-rasschitat-byudzhet-kuhni-materialy-furnitura-montazh` | blog article | распределить бюджет по составляющим | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/oshibki-pri-zakaze-kuhni-15-punktov-pered-dogovorom` | blog article | проверить заказ перед договором | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/materialy-dlya-kuhni-ldsp-mdf-emal-hpl-shpon` | blog article | сравнить основные материалы | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/uglovaya-kuhnya-ili-pryamaya-chto-vybrat` | blog article | сравнить угловую и прямую формы | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kak-podgotovitsya-k-zameru-kuhni` | blog article | подготовиться к замеру | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhnya-dlya-chastnogo-doma-planirovka-hranenie-tehnika` | blog article | спланировать кухню в частном доме | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhnya-6-kv-m-v-hruschevke` | blog article | решить кухню 6 м² в хрущёвке | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/chto-vhodit-v-stoimost-kuhni-na-zakaz` | blog article | понять состав стоимости | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhnya-pod-vstroennuyu-tehniku` | blog article | подготовить кухню под встроенную технику | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/p-obraznaya-kuhnya-razmery-prohody-cena` | blog article | оценить П-образную планировку | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kak-vybrat-kuhnyu` | blog article | пройти общий путь выбора | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/skolko-stoit-kuhnya-na-zakaz` | blog article | понять evergreen price factors | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhnya-dlya-malenkoy-kvartiry` | blog article | выбрать кухню для маленькой квартиры | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kakie-fasady-luchshe` | blog article | выбрать фасады по условиям | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhni-blum-hettich-gtv` | blog article | сравнить бренды фурнитуры по функции | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhnya-s-ostrovom` | blog article | изучить требования к острову | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kakuyu-planirovku-kuhni-vybrat` | blog article | сравнить все базовые планировки | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kak-vybrat-materialy-dlya-kuhni` | blog article | построить процесс выбора материалов | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/blog/kuhnya-pod-scenarij-semi-studii-doma` | blog article | сравнить бытовые сценарии | основной коммерческий интент detail-страницы; неподтверждённый proof; точная персональная цена | `/blog` |
| `/locations/vitebsk` | location detail | проверить дальний заказ в Витебске | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/gomel` | location detail | проверить дальний заказ в Гомеле | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/grodno` | location detail | проверить дальний заказ в Гродно | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/molodechno` | location detail | проверить работу в Молодечно | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/minsk` | location detail | проверить заказ кухни в Минске | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/brest` | location detail | проверить дальний заказ в Бресте | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/minskaya-oblast` | location detail | проверить заказ по Минской области | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/mogilev` | location detail | проверить дальний заказ в Могилёве | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/borisov` | location detail | проверить процесс заказа в Борисове | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/zhodino` | location detail | проверить работу в Жодино | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/soligorsk` | location detail | проверить работу в Солигорске | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/slutsk` | location detail | проверить работу в Слуцке | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/fanipol` | location detail | проверить работу в Фаниполе | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/smolevichi` | location detail | проверить работу в Смолевичах | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/dzerzhinsk` | location detail | проверить работу в Дзержинске | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/zaslavl` | location detail | проверить работу в Заславле | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/logoisk` | location detail | проверить работу в Логойске | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/vileyka` | location detail | проверить работу в Вилейке | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/nesvizh` | location detail | проверить работу в Несвиже | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/berezino` | location detail | проверить работу в Березино | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/volozhin` | location detail | проверить работу в Воложине | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/stolbtsy` | location detail | проверить работу в Столбцах | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/uzda` | location detail | проверить работу в Узде | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/cherven` | location detail | проверить работу в Червене | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/maryina-gorka` | location detail | проверить работу в Марьиной Горке | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/kletsk` | location detail | проверить работу в Клецке | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/kopyl` | location detail | проверить работу в Копыле | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/krupki` | location detail | проверить работу в Крупках | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/lyuban` | location detail | проверить работу в Любани | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/myadel` | location detail | проверить работу в Мяделе | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |
| `/locations/starye-dorogi` | location detail | проверить работу в Старых Дорогах | неподтверждённый local proof; точные сроки; точная стоимость | `/locations` |

Utility routes не получают SEO intent ownership. Для location/material/portfolio claims сохраняется `evidence_required`; для широких пересечений нужны GSC/SERP данные.
