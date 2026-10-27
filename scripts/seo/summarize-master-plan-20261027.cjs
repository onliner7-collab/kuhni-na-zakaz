const fs=require('fs'),path=require('path');
const out=path.resolve('docs/seo/audit-20261027');
const crawl=JSON.parse(fs.readFileSync(path.join(out,'crawl.json'),'utf8'));
const implemented=new Map([
 ['/','Внедрено; контроль доказательности/эффективности'],
 ['/catalog','Внедрено; проверять модели/цены/фильтры'],
 ['/prices','Внедрено; синхронизировать условия и актуальность цен'],
 ['/calculator','Внедрено; проверить покрытие тарифами и актуальные расчёты'],
 ['/catalog/uglovye-kuhni','Внедрено; цены сопоставимых комплектов и гарантийные факты'],
 ['/catalog/pryamye-kuhni','Внедрено; контроль актуальных комплектов/заявок'],
 ['/catalog/malenkie-kuhni','Внедрено; основной владелец маленьких кухонь'],
 ['/catalog/kuhni-do-potolka','Внедрено; контроль актуальных комплектов/заявок'],
 ['/locations/borisov','Сделано владельцем; защищено от переделки'],
 ['/locations/minsk','Внедрено; сохранять свежую реализацию'],
 ['/locations/zhodino','Внедрено; контроль местных условий/заявок'],
 ['/locations/smolevichi','Внедрено; контроль местных условий/заявок'],
 ['/scenarios/byudzhetnaya-kuhnya','Внедрено; проверить первый экран и актуальность цен'],
 ['/materials','Внедрена система материалов; финальная цена по проекту'],
 ...['ldsp','mdf-fasady','plastik-hpl','mdf-emal','akril','shpon'].map(s=>['/materials/'+s,'Внедрено; серии/спецификацию/цену подтверждать для заказа'])
]);
function status(p){
 if(implemented.has(p))return implemented.get(p);
 if(p==='/scenarios/dlya-malenkoy-kuhni')return 'Выведен из самостоятельных страниц; 308 → /catalog/malenkie-kuhni';
 if(p==='/reviews')return 'P1: проверить 5 seed-совпадающих отзывов и рейтинг';
 if(p==='/portfolio'||p.startsWith('/portfolio/'))return 'P1: provenance, география, реальные работы отдельно от идей';
 if(p==='/delivery-installation'||p==='/warranty')return 'P1: подтвердить тарифы/обещания/гарантию, согласовать с другими страницами';
 if(p.startsWith('/catalog/'))return 'Следующая коммерческая доработка; старый короткий visual explorer';
 if(p.startsWith('/styles/'))return 'Не закрыто коммерческое ТЗ; улучшить примеры/состав/CTA';
 if(p==='/locations/minskaya-oblast')return 'Частично; защищённый baseline, проверить повторение и условия';
 if(p.startsWith('/locations/'))return 'Частично; городская структура есть, убрать повторы и подтвердить минимальную цену/логистику';
 if(p.startsWith('/scenarios/'))return 'Проверить самостоятельную пользу и ссылки; не удалять автоматически';
 if(p.startsWith('/blog/'))return 'Существующая статья; проверка актуальности, источников и различия с соседними ещё нужна';
 if(p==='/design-proekt-kuhni')return 'Существующий функционал; состав услуги/интент/форму проверить отдельно';
 if(p==='/materials/furnitura')return 'Прежний technical baseline; не включать в статус новой системы фасадов';
 return 'Базовая страница есть; адресная проверка содержания/фактов/навигации';
}
const lines=['# Статус каждой страницы относительно мастер-плана','','Дата 27.10.2026. Состояние HTML до узкого релиза; строка удалённого сценария отражает согласованное изменение. «Внедрено» — реализация видна, не гарантия позиций и не новая полная приёмка всех состояний. Для статусов использованы текущий HTML, отчёты 07–26 октября и выборочный browser smoke.','','| URL | H1 | Следующее действие |','|---|---|---|'];
for(const row of crawl.rows){const p=new URL(row.url).pathname;lines.push('| '+p+' | '+row.h1.join('; ').replaceAll('|','/')+' | '+status(p)+' |');}
fs.writeFileSync(path.join(out,'page-status.md'),lines.join('\n')+'\n');
console.log('Status matrix',crawl.rows.length,'URLs');
