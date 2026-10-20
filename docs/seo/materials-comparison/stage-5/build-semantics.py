"""Rebuild a curated candidate set; never manufactures volume or demand metrics."""
import collections
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATE = '2026-10-20'
OWNER = '/materials/plastik-hpl'
FIELDS = 'query normalizedQuery cluster intent scenario geography sourceUrl sourceType observedOrHypothesis checkedAt volume volumeRegion difficulty priority ownerRoute targetBlock notes'.split()

# Each line is editorially selected, not a Cartesian product of modifiers.
GROUPS = [
('Заказ кухни', 'transactional', 'P1', '#hpl-title', 'https://fabio.kitchen/kuhni/plastik-hpl/', '''
кухни HPL
кухни из HPL пластика
кухни из пластика
кухни из пластика на заказ
кухня с фасадами HPL на заказ
купить кухню из пластика
заказать кухню с пластиковыми фасадами
кухня HPL по индивидуальным размерам
изготовление кухни с фасадами HPL
производство кухонь из пластика
кухонный гарнитур с пластиковыми фасадами
кухня МДФ пластик на заказ
куплю кухню из пластика
закажу кухню с фасадами HPL
кухни из пластика под заказ
пластиковая кухня от производителя
кухни из пластика купить
'''),
('Цена и состав', 'commercial', 'P1', '#hpl-price', 'https://mkfaraon.by/kuhni/kuhni-iz-plastika/', '''
кухня HPL цена
сколько стоит кухня из пластика
кухни из пластика фото цены
кухни из пластика фото и цены
кухня из пластика цена за погонный метр
недорогая кухня с пластиковыми фасадами
бюджетная кухня HPL
расчет стоимости кухни с фасадами HPL
что входит в стоимость кухни из пластика
кухня пластик со столешницей цена
кухня HPL без техники стоимость
кухня из пластика с установкой стоимость
кухня HPL с доводчиками цена
кухня из пластика эконом комплектация
пластиковые фасады для кухни цена
кухня HPL с антресолями стоимость
почему кухни HPL стоят по разному
'''),
('Основание и покрытие', 'informational', 'P1', '#hpl-construction', 'https://general-plast.ru/hpl-fasady', '''
что такое HPL фасады для кухни
что такое пластиковые фасады для кухни
как делают пластиковые фасады для кухни
фасады HPL пластик что это
пластиковые фасады для кухни что это
из чего состоит фасад HPL
HPL это МДФ или пластик
основа фасада HPL МДФ или ДСП
HPL на МДФ для кухни
HPL на ДСП для кухни
толщина фасадов HPL для кухни
обратная сторона фасада HPL
чем HPL отличается от обычного пластика
HPL и CPL разница для фасадов кухни
HPL и пленка ПВХ в чем разница
корпус и фасады HPL из чего делают
пластик высокого давления для кухонных фасадов
фасады из HPL пластика для кухни
'''),
('Кромка и торец', 'informational', 'P1', '#hpl-edge', 'https://zamenafasadov.ru/catalog/plastic/', '''
какая кромка лучше для фасадов HPL
фасады HPL в кромке АБС
фасады HPL в кромке ПВХ
лазерная кромка фасадов HPL
фасады HPL с PUR клеем
виден ли стык кромки на фасадах HPL
кромка в цвет фасада HPL
контрастная кромка пластиковых фасадов
пластиковые фасады в алюминиевой рамке
что такое постформинг фасадов кухни
постформинг или кромка HPL
как проверить кромку пластикового фасада
защита торцов HPL у мойки
пластиковые фасады без видимого шва
'''),
('Фото и декоры', 'commercial', 'P1', '#hpl-gallery', 'https://fabio.kitchen/kuhni/plastik-hpl/', '''
кухни из пластика фото
пластиковые фасады для кухни фото
пластиковые фасады для кухни цвета
кухни HPL каталог декоров
белая кухня из пластика
бежевая кухня HPL
серая кухня с пластиковыми фасадами
кухня HPL графит
зеленая кухня с фасадами HPL
кухня HPL под дерево
кухня HPL под дуб
кухня HPL под камень
кухня HPL под бетон
двухцветная кухня из пластика
кухня HPL белый верх дерево низ
как выбрать цвет пластиковых фасадов
сочетание фасадов HPL и столешницы
кухня с фасадами HPL и шпоном
'''),
('Финиш и внешний вид', 'commercial', 'P1', '#hpl-finish', 'https://minsk.zovofficial.com/materialy-furnitura/fasadnye-materialy/plastik-hpl-ru/', '''
матовые пластиковые фасады для кухни
глянцевые фасады HPL для кухни
матовый или глянцевый HPL для кухни
суперматовые фасады HPL
фасады HPL софт тач
фактурные фасады HPL под дерево
гладкие фасады HPL для кухни
видны ли отпечатки на матовом HPL
черная кухня HPL отпечатки пальцев
как выглядит HPL при разном освещении
пластиковые фасады с фрезеровкой
можно ли сделать интегрированную ручку в HPL
кухня HPL без ручек
'''),
('Размеры и планировки', 'commercial', 'P2', '#hpl-layouts', 'https://mkfaraon.by/kuhni/kuhni-iz-plastika/', '''
прямая кухня из пластика 3 метра
кухня из пластика 2 метра
угловая кухня с фасадами HPL
кухни из пластика фото и цены угловые для маленькой кухни
маленькая кухня из пластика
кухня HPL до потолка
кухня HPL с антресолями
кухня HPL с островом
П образная кухня из пластика
кухня HPL со встроенной техникой
кухня из пластика с барной стойкой
угловая кухня HPL 2 4 на 1 8
'''),
('Помещения и эксплуатация', 'commercial', 'P2', '#hpl-rooms', 'https://alanmebel.by/kuhni/katalog-kuhni-iz-plastika-foto/', '''
кухня HPL для квартиры
кухня из пластика для новостройки
кухня HPL для студии
кухня HPL для кухни гостиной
кухня из пластика для частного дома
кухня HPL для загородного дома
кухня из пластика для деревенского дома
кухня с фасадами HPL для дачи
можно ли кухню HPL на неотапливаемую дачу
кухня HPL для сезонного проживания
кухня из пластика для съемной квартиры
кухня HPL для семьи с детьми
кухня HPL для ежедневной готовки
заказать кухню HPL в деревню с установкой
'''),
('Уход и ограничения', 'informational', 'P1', '#hpl-care', 'https://kitchen.slotex.com/upload/iblock/bbe/dxcy9y7cbnvfli3b4eqrjm8ql8te9zx1.pdf', '''
уход за фасадами HPL
чем мыть пластиковые фасады кухни
как убрать жир с фасадов HPL
как мыть матовую кухню из пластика без разводов
можно ли чистить HPL меламиновой губкой
можно ли мыть HPL пароочистителем
боятся ли фасады HPL воды
фасады HPL рядом с посудомоечной машиной
фасады HPL рядом с духовкой
можно ли ставить чайник под шкафом HPL
царапаются ли пластиковые фасады
выгорают ли фасады HPL на солнце
желтеют ли белые пластиковые фасады
отклеивается ли HPL от фасада
почему разбухла кромка пластикового фасада
срок службы фасадов HPL
экологичность фасадов HPL для кухни
как выбрать HPL фасады по сертификатам
'''),
('Выбор и сравнение', 'commercial', 'P1', '#hpl-alternatives', 'https://kuhnivtule.ru/blog/kakie-materialy-luchshe-vybrat-dlya-kukhni-mdf-massiv-akril-plastik-plyusy-i-minusy', '''
кухня акрил или пластик что лучше
кухня пластик или акрил
HPL или акрил для фасадов кухни
пластик HPL или ЛДСП для кухни
пластик или МДФ для кухни что лучше
HPL на МДФ или пленка для кухни
кухни из пластика плюсы и минусы
пластиковые фасады для кухни плюсы и минусы
кухни из пластика отзывы
пластиковые фасады для кухни отзывы
HPL пластик фасады для кухни отзывы
как выбрать качественные фасады HPL
какие вопросы задать при заказе кухни HPL
как проверить образец пластикового фасада
что лучше HPL или AGT для кухни
'''),
('Заказ и комплектация', 'transactional', 'P2', '#hpl-order', 'https://alanmebel.by/kuhni/katalog-kuhni-iz-plastika-foto/', '''
заказать кухню HPL по своему проекту
кухня HPL с замером и проектом
кухня из пластика с доставкой и сборкой
кухня HPL под размеры помещения
какие размеры нужны для расчета кухни HPL
как согласовать декор и кромку HPL
образцы HPL перед заказом кухни
что проверить в спецификации кухни HPL
'''),
]

def norm(q):
    return re.sub(r'\s+', ' ', q.lower().replace('ё', 'е')).strip()

evidence = json.loads((ROOT / 'suggestions-evidence.json').read_text(encoding='utf-8'))
observed = collections.defaultdict(list)
raw = []
for item in evidence:
    for q in item['suggestions']:
        observed[norm(q)].append(item)
        raw.append(dict(query=q, normalizedQuery=norm(q), cluster='', sourceUrl=item['url'], sourceType='autocomplete-' + item['engine'].lower(), observedOrHypothesis='observed', checkedAt=DATE, decision='pending', reason='Наблюдаемая подсказка; не частотность и не подтверждение услуг'))

rows = {}
for cluster, intent, priority, block, source, lines in GROUPS:
    for q in lines.strip().splitlines():
        key = norm(q)
        assert key not in rows, q
        hit = observed.get(key, [])
        notes = 'Кандидат; спрос и сложность не измерены. Источник гипотезы — тема страницы, не точное вхождение запроса.'
        if hit:
            notes = 'Точная формулировка наблюдалась в автоподсказках; частотность неизвестна. Геолокация выдачи не подтверждена.'
        if cluster in ['Кромка и торец', 'Финиш и внешний вид', 'Основание и покрытие']:
            notes += ' Технология/серия/основание требуют подтверждения; это вопрос, а не обещание доступности.'
        if cluster == 'Уход и ограничения':
            notes += ' Ответ сверить с первичным документом выбранной серии; общий лимит температуры не переносить.'
        if cluster == 'Помещения и эксплуатация':
            notes += ' Гипотеза сценария; особенно проверить условия влажности, отопления и географию выезда.'
        if 'отзыв' in key:
            notes += ' Не создавать вымышленные отзывы; показать проверяемые примеры и ограничения.'
        scenario = next((x for x in ['неотапливаем', 'сезонн', 'дач', 'дерев', 'новострой', 'студи', 'частного дома', 'съемн', 'детьми'] if x in key), '')
        rows[key] = dict(zip(FIELDS, [q, key, cluster, intent, scenario, 'Беларусь', ' | '.join(x['url'] for x in hit) if hit else source, 'autocomplete' if hit else 'analyst-expansion-from-reviewed-theme', 'observed' if hit else 'hypothesis', DATE, '', 'Беларусь; не измерено', '', priority, OWNER, block, notes]))
        raw.append(dict(query=q, normalizedQuery=key, cluster=cluster, sourceUrl=source, sourceType='analyst-curated-candidate', observedOrHypothesis='hypothesis', checkedAt=DATE, decision='keep-hpl', reason='Ручное расширение темы, уточняется точными подсказками при совпадении'))

# Supporting owners remain in a separate file; they do not inflate the HPL total.
support = [
('кухни из пластика Минск', '/locations/minsk', 'География', 'Ссылка на материалы HPL; локальные условия и выезд на странице Минска'),
('кухни HPL Минск', '/locations/minsk', 'География', 'Не создавать новую городскую посадочную'),
('кухни из пластика Минская область', '/locations/minskaya-oblast', 'География', 'Условия обслуживания уточнить'),
('кухни HPL Беларусь', OWNER, 'География', 'На HPL допустим рынок Беларусь, без обещания выезда во все города'),
('пластик или эмаль для кухни', '/materials/mdf-emal', 'Сравнения других владельцев', 'Подробное сравнение на эмали; здесь краткий вывод и ссылка'),
('HPL или эмаль что лучше', '/materials/mdf-emal', 'Сравнения других владельцев', 'Сохранить существующее распределение'),
('ЛДСП или МДФ для кухни', '/materials/ldsp', 'Сравнения других владельцев', 'Разбор основ на ЛДСП'),
('какие фасады для кухни лучше', '/materials', 'Общий выбор', 'Общее сравнение шести исполнений'),
('кухни МДФ на заказ', '/materials/mdf-fasady', 'Основа МДФ', 'Обзор покрытий на МДФ'),
('акриловые кухни', '/materials/akril', 'Акрил', 'Не подменять HPL акрилом'),
('кухни из шпона', '/materials/shpon', 'Шпон', 'Рисунок дерева и натуральный шпон'),
('прямые кухни', '/catalog/pryamye-kuhni', 'Общие планировки', 'На HPL — пример с материалом и ссылка'),
('угловые кухни', '/catalog/uglovye-kuhni', 'Общие планировки', 'На HPL — пример с материалом и ссылка'),
('маленькие кухни', '/catalog/malenkie-kuhni', 'Общие планировки', 'На HPL — пример с материалом и ссылка'),
('кухни до потолка', '/catalog/kuhni-do-potolka', 'Общие планировки', 'На HPL — пример с материалом и ссылка'),
('кухни с островом', '/catalog/kuhni-s-ostrovom', 'Общие планировки', 'На HPL — пример с материалом и ссылка'),
('стоимость кухни на заказ', '/prices', 'Общая стоимость', 'Числа только из действующих данных бизнеса'),
('рассчитать кухню', '/calculator', 'Расчет', 'Передать явный выбор HPL'),
('кухня для дачи', '', 'Общий сценарий', 'Проверить страницу-владельца; без нового URL в этом этапе'),
('кухня для новостройки', '', 'Общий сценарий', 'Проверить страницу-владельца; без нового URL в этом этапе'),
('кухня в частный дом', '', 'Общий сценарий', 'Проверить страницу-владельца; без нового URL в этом этапе'),
]
support_rows = []
for q, route, cluster, note in support:
    hit = observed.get(norm(q), [])
    support_rows.append(dict(zip(FIELDS, [q, norm(q), cluster, 'commercial', '', 'Беларусь', ' | '.join(x['url'] for x in hit), 'autocomplete' if hit else 'analyst-boundary-check', 'observed' if hit else 'hypothesis', DATE, '', 'Беларусь; не измерено', '', 'P2', route, '', note])))

rejected = []
def reject(q, reason, source='', kind='hypothesis'):
    rejected.append(dict(query=q, normalizedQuery=norm(q), reason=reason, sourceUrl=source, observedOrHypothesis=kind, checkedAt=DATE))

for q, reason in [
('купить лист HPL', 'Листовой материал; другая товарная категория'),
('HPL пластик оптом', 'Опт и B2B не подтверждены'),
('раскрой HPL пластика', 'Услуга обработки не подтверждена'),
('замена пластиковых фасадов кухни', 'Отдельная услуга не подтверждена; не рекламировать'),
('ремонт фасадов HPL', 'Услуга не подтверждена; причины повреждений можно объяснить информационно'),
('купить фасады HPL отдельно', 'Поставка деталей не подтверждена; не включать в CTA кухни'),
('кухни из пластика бесплатно', 'Нерелевантное ценовое обещание'),
('кухни HPL рассрочка', 'Финансовая услуга не подтверждена'),
('кухня HPL за 3 дня', 'Срок изготовления не подтвержден'),
('AGT это HPL', 'Вопрос терминологии допустим, но объединять все серии AGT с HPL нельзя'),
('купить кухню HPL Москва', 'Нецелевой рынок; Москва только источник тем'),
('HPL фасадные панели для дома', 'Архитектурный фасад здания, не фасад кухни'),
]:
    reject(q, reason)

support_keys = {norm(r['query']) for r in support_rows}
for key, hits in observed.items():
    if key in rows or key in support_keys:
        continue
    q = next(q for q in hits[0]['suggestions'] if norm(q) == key)
    if any(x in key for x in ['столешниц', 'фартук']):
        reason = 'Рабочая поверхность/фартук, не фасады; отдельная тема вне этапа'
    elif any(x in key for x in ['москв', 'бобруйск', 'кухні']):
        reason = 'Нецелевой регион/язык либо география обслуживания не подтверждена'
    elif any(x in key for x in ['арпа', 'феникс', 'стильные кухни']):
        reason = 'Брендовая/навигационная формулировка; серия и поставка не подтверждены'
    else:
        reason = 'Близкая формулировка уже представлена; не раздувать ядро перестановками и неоднозначными деталями'
    reject(q, reason, ' | '.join(x['url'] for x in hits), 'observed')

for r in raw:
    key = r['normalizedQuery']
    r['decision'] = 'keep-hpl' if key in rows else 'supporting-owner' if key in support_keys else 'reject'
    if r['sourceType'].startswith('autocomplete'):
        r['cluster'] = rows[key]['cluster'] if key in rows else 'Требует другого владельца/исключение'
for r in support_rows:
    raw.append(dict(query=r['query'], normalizedQuery=r['normalizedQuery'], cluster=r['cluster'], sourceUrl=r['sourceUrl'], sourceType=r['sourceType'], observedOrHypothesis=r['observedOrHypothesis'], checkedAt=DATE, decision='supporting-owner', reason=r['notes']))
for r in rejected:
    if r['observedOrHypothesis'] == 'hypothesis':
        raw.append(dict(query=r['query'], normalizedQuery=r['normalizedQuery'], cluster='Исключения', sourceUrl='', sourceType='analyst-boundary-check', observedOrHypothesis='hypothesis', checkedAt=DATE, decision='reject', reason=r['reason']))

def write_csv(name, records, fields):
    with (ROOT / name).open('w', encoding='utf-8', newline='') as handle:
        writer = csv.DictWriter(handle, fields, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(records)

write_csv('semantics.csv', list(rows.values()), FIELDS)
write_csv('supporting-queries.csv', support_rows, FIELDS)
write_csv('semantics-raw.csv', raw, list(raw[0]))
write_csv('rejected-queries.csv', rejected, list(rejected[0]))
summary = dict(date=DATE, hplCandidates=len(rows), observedAutocompleteCandidates=sum(r['observedOrHypothesis']=='observed' for r in rows.values()), hypothesisCandidates=sum(r['observedOrHypothesis']=='hypothesis' for r in rows.values()), clusters=dict(collections.Counter(r['cluster'] for r in rows.values())), priorities=dict(collections.Counter(r['priority'] for r in rows.values())), supportingCandidates=len(support_rows), rejectedCandidates=len(rejected), rawRows=len(raw), uniqueRawCandidates=len({r['normalizedQuery'] for r in raw}), autocompleteRequests=len(evidence), successfulAutocompleteRequests=sum(r['status']=='ok' for r in evidence), autocompleteOccurrences=sum(len(r['suggestions']) for r in evidence), uniqueAutocompletePhrases=len(observed))
(ROOT / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=True))
