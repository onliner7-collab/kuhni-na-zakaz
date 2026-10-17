import fs from 'node:fs';
const dir='docs/seo/materials-comparison/stage-3';
let cluster=''; const rows=[];
for(const line of fs.readFileSync(`${dir}/semantics-raw.md`,'utf8').split(/\r?\n/)){
 if(line.startsWith('## ')){cluster=line.slice(3);continue;}
 if(!cluster||!line.trim())continue;
 const query=line.trim();
 const city=/Минск|Минская|Минской|Борисов|Жодино|Смолевичи|Молодечно/i.test(query);
 const pending=/Blum|Hettich|Gola|ПУР/i.test(query);
 rows.push({query,cluster,intent: /как|чем|почему|можно|какая|какие|какой|боится|подходит|чтобы|что выбрать/i.test(query)?'информационный':'коммерческий',owner:city?'существующая городская страница':'/materials/ldsp',priority:pending?'проверить доступность':city?'поддержка городской страницы':['Заказ','Цена','Конструкция','Сравнение и уход'].includes(cluster)?'высокий':'средний',volume:'',difficulty:'',evidence:'кандидат по темам исследования; спрос не измерен'});
}
if(rows.length!==150||new Set(rows.map(r=>r.query.toLocaleLowerCase('ru'))).size!==150)throw Error('Expected 150 unique candidates');
const keys=Object.keys(rows[0]);
const quote=v=>'"'+String(v).replaceAll('"','""')+'"';
fs.writeFileSync(`${dir}/semantics.csv`,[keys,...rows.map(r=>keys.map(k=>r[k]))].map(row=>row.map(quote).join(',')).join('\n')+'\n','utf8');
console.log('150 candidates exported, no invented metrics');
