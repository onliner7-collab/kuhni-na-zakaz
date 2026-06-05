# Карта посадочных страниц Минской области

Дата: 2026-05-28
Цель: закрыть 450 добавленных гео-запросов из Excel по 24 городам Минской области.

## Правило для всех городов

Шаблон URL:

`https://kuhni.minsk.by/locations/<slug>`

Минимальный набор данных для каждой страницы:

- title: `Кухни на заказ в <городе> от 900 BYN`
- H1: `Кухни на заказ в <городе>`
- description: замер, 3D-проект, доставка, монтаж, гарантия
- цена от: 900-1200 BYN, если нет другого подтвержденного диапазона
- доставка: от 50 BYN или "рассчитывается по адресу"
- 3-5 FAQ
- 2-3 локальных соседних города
- 3-5 внутренних ссылок на типы кухонь
- 1 CTA с cityKey
- schema: BreadcrumbList, FAQPage, Service/LocalBusiness

## Матрица внедрения

| Город | Slug | Запросов в Excel | Текущий статус | Посадочная | Приоритет | Что сделать |
|---|---|---:|---|---|---|---|
| Борисов | borisov | 13 | Есть | `/locations/borisov` | Высокий | Усилить кейсами, отзывами, внутренними ссылками |
| Жодино | zhodino | 16 | Есть | `/locations/zhodino` | Высокий | Проверить редирект `zhodzina`, усилить контент |
| Молодечно | molodechno | 17 | Есть | `/locations/molodechno` | Высокий | Усилить локальные кейсы и FAQ |
| Солигорск | soligorsk | 16 | Есть | `/locations/soligorsk` | Высокий | Проверить гео-формы "Солигорск/Солигорске" |
| Слуцк | slutsk | 16 | Есть | `/locations/slutsk` | Высокий | Усилить блок доставки и работ по району |
| Фаниполь | fanipol | 17 | Есть | `/locations/fanipol` | Высокий | Связать с Дзержинском и Минском |
| Смолевичи | smolevichi | 17 | Есть | `/locations/smolevichi` | Высокий | Связать с Жодино, Борисовом, Минском |
| Дзержинск | dzerzhinsk | 18 | Нет, live 404 | `/locations/dzerzhinsk` | Высокий | Создать страницу, связать с Фаниполем и Узденским направлением |
| Заславль | zaslavl | 20 | Нет | `/locations/zaslavl` | Высокий | Создать страницу, связать с Минском и Логойском |
| Логойск | logoisk | 20 | Нет | `/locations/logoisk` | Высокий | Создать страницу, акцент на частные дома и дачи |
| Вилейка | vileyka | 20 | Нет | `/locations/vileyka` | Высокий | Создать страницу, связать с Молодечно и Мяделем |
| Несвиж | nesvizh | 20 | Нет | `/locations/nesvizh` | Высокий | Создать страницу, связать с Клецком и Столбцами |
| Березино | berezino | 20 | Нет, live 404 | `/locations/berezino` | Средний | Создать страницу, направление восток области |
| Воложин | volozhin | 20 | Нет | `/locations/volozhin` | Средний | Создать страницу, частные дома/дачи |
| Столбцы | stolbtsy | 20 | Нет | `/locations/stolbtsy` | Средний | Создать страницу, связать с Несвижем и Дзержинском |
| Узда | uzda | 20 | Нет | `/locations/uzda` | Средний | Создать страницу, связать с Дзержинском и Слуцком |
| Червень | cherven | 20 | Нет | `/locations/cherven` | Средний | Создать страницу, связать со Смолевичами и Березино |
| Клецк | kletsk | 20 | Нет | `/locations/kletsk` | Средний | Создать страницу, связать с Несвижем и Копылем |
| Копыль | kopyl | 20 | Нет | `/locations/kopyl` | Средний | Создать страницу, связать с Клецком и Слуцком |
| Крупки | krupki | 20 | Нет | `/locations/krupki` | Средний | Создать страницу, связать с Борисовом и Березино |
| Любань | lyuban | 20 | Нет | `/locations/lyuban` | Средний | Создать страницу, связать со Слуцком и Солигорском |
| Марьина Горка | maryina-gorka | 20 | Нет | `/locations/maryina-gorka` | Средний | Создать страницу, связать с Червенем и Минском |
| Мядель | myadel | 20 | Нет | `/locations/myadel` | Средний | Создать страницу, акцент на дома/дачи, связать с Вилейкой |
| Старые Дороги | starye-dorogi | 20 | Нет | `/locations/starye-dorogi` | Средний | Создать страницу, связать со Слуцком и Любанью |

## Как обновить Excel

Для листа "Города Минской области" заполнить "Рекомендуемая посадочная":

| Slug | Рекомендуемая посадочная |
|---|---|
| berezino | `https://kuhni.minsk.by/locations/berezino` |
| borisov | `https://kuhni.minsk.by/locations/borisov` |
| vileyka | `https://kuhni.minsk.by/locations/vileyka` |
| volozhin | `https://kuhni.minsk.by/locations/volozhin` |
| dzerzhinsk | `https://kuhni.minsk.by/locations/dzerzhinsk` |
| zhodino | `https://kuhni.minsk.by/locations/zhodino` |
| zaslavl | `https://kuhni.minsk.by/locations/zaslavl` |
| kletsk | `https://kuhni.minsk.by/locations/kletsk` |
| kopyl | `https://kuhni.minsk.by/locations/kopyl` |
| krupki | `https://kuhni.minsk.by/locations/krupki` |
| logoisk | `https://kuhni.minsk.by/locations/logoisk` |
| lyuban | `https://kuhni.minsk.by/locations/lyuban` |
| maryina-gorka | `https://kuhni.minsk.by/locations/maryina-gorka` |
| molodechno | `https://kuhni.minsk.by/locations/molodechno` |
| myadel | `https://kuhni.minsk.by/locations/myadel` |
| nesvizh | `https://kuhni.minsk.by/locations/nesvizh` |
| smolevichi | `https://kuhni.minsk.by/locations/smolevichi` |
| slutsk | `https://kuhni.minsk.by/locations/slutsk` |
| soligorsk | `https://kuhni.minsk.by/locations/soligorsk` |
| starye-dorogi | `https://kuhni.minsk.by/locations/starye-dorogi` |
| stolbtsy | `https://kuhni.minsk.by/locations/stolbtsy` |
| uzda | `https://kuhni.minsk.by/locations/uzda` |
| fanipol | `https://kuhni.minsk.by/locations/fanipol` |
| cherven | `https://kuhni.minsk.by/locations/cherven` |

## Блоки для каждой новой страницы

1. Hero: город, цена от, замер, доставка, монтаж.
2. Локальный intro: 120-180 слов, без шаблонного копипаста.
3. Популярные решения:
   - угловая кухня;
   - прямая кухня;
   - кухня до потолка;
   - маленькая кухня;
   - кухня для частного дома.
4. Замер и доставка:
   - как согласуется выезд;
   - что проверяется на объекте;
   - как считается доставка.
5. Портфолио/примеры:
   - реальные кейсы города, если есть;
   - иначе честно маркированные примеры без утверждения, что это реальный объект города.
6. FAQ:
   - "Выезжаете ли на замер в <город>?"
   - "Сколько стоит доставка кухни в <город>?"
   - "Можно ли заказать кухню до потолка?"
   - "Какие сроки изготовления?"
   - "Что входит в монтаж?"
7. Внутренняя перелинковка:
   - хаб Минской области;
   - 2-3 соседних города;
   - 3-5 категорий каталога.

## Контроль после внедрения

- Все 24 URL отдают 200.
- Все 24 URL есть в sitemap.
- Все 24 URL связаны с `/locations/minskaya-oblast`.
- На каждой странице один H1.
- Title 45-65 символов.
- Description 120-160 символов.
- Есть canonical на саму страницу.
- Есть FAQPage JSON-LD, если FAQ виден на странице.
- В Excel нет пустых посадочных для гео-строк.
