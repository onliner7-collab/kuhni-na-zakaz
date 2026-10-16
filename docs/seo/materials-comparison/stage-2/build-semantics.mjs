import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const headers=['query','normalizedQuery','cluster','intent','scenario','geography','sourceUrl','sourceType','observedOrHypothesis','checkedAt','volume','volumeRegion','difficulty','priority','ownerRoute','targetBlock','notes'];
const observations=new Map([
 ['кухни с фасадами из МДФ пленка ПВХ на заказ','https://fabio.kitchen/kuhni/mdf-plyenka/'],
 ['пленочные кухни на заказ','https://alanmebel.by/kuhni/katalog-kuhni-plenochnye-foto/'],
]);
let group=[],rows=[];
for(const line of fs.readFileSync(path.join(dir,'semantic-candidates.txt'),'utf8').split(/\r?\n/).filter(Boolean)){
 if(line.startsWith('# ')){group=line.slice(2).split('|');continue;}
 const norm=line.toLowerCase().replaceAll('ё','е').replace(/\s+/g,' ').trim();
 const source=observations.get(line)||'';
 const city=/Минск/.test(line);
 rows.push([line,norm,group[0],group[2],['Квартира','Дом','Дача'].includes(group[0])?group[0]:'общий',city?'Минск / Минская область':'Беларусь',source,source?'страница продавца':'редакторское расширение по исследованным темам',source?'observed':'hypothesis','2026-10-15','','','',['Покупка','Плёнка','Цена'].includes(group[0])?'1':group[0]==='Основа'?'3':'2',city?(/Минская область/.test(line)?'/locations/minskaya-oblast':'/locations/minsk'):'/materials/mdf-fasady',group[1],city?'Городской интент: поддерживающее упоминание, владелец — городская страница.':'Частотность и сложность не измерены; кандидат, не доказанный спрос.']);
}
if(new Set(rows.map(r=>r[1])).size!==rows.length)throw Error('Дубли нормализованных запросов');
const csv=(data)=>data.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n')+'\n';
fs.writeFileSync(path.join(dir,'semantics.csv'),csv([headers,...rows]));
fs.writeFileSync(path.join(dir,'semantics-raw.csv'),csv([['query','sourceUrl','observedOrHypothesis'],...rows.map(r=>[r[0],r[6],r[8]])]));
console.log(JSON.stringify({candidates:rows.length,observed:observations.size,normalizedUnique:new Set(rows.map(r=>r[1])).size}));
