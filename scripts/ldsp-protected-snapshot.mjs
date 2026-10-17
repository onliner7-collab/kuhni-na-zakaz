import https from 'node:https';
import fs from 'node:fs/promises';
const phase=process.argv[2];
if(!['before','after'].includes(phase))throw Error('Pass before or after');
const routes=['/','/locations/borisov','/locations/minsk','/locations/minskaya-oblast','/design-proekt-kuhni','/materials/furnitura','/materials/mdf-fasady','/materials'];
const result=[];
for(const route of routes){
 const body=await new Promise((resolve,reject)=>{const req=https.get({hostname:'kuhni.minsk.by',servername:'kuhni.minsk.by',path:route,lookup:(_n,o,cb)=>o.all?cb(null,[{address:'5.42.108.140',family:4}]):cb(null,'5.42.108.140',4),timeout:25000},res=>{let s='';res.setEncoding('utf8');res.on('data',d=>s+=d);res.on('end',()=>res.statusCode===200?resolve(s):reject(Error(route+': '+res.statusCode)));});req.on('timeout',()=>req.destroy(Error('timeout')));req.on('error',reject);});
 result.push({route,title:body.match(/<title>([\s\S]*?)<\/title>/)?.[1],h1:body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g,''),canonical:body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1]});
}
const dir='docs/seo/materials-comparison/stage-3';
await fs.mkdir(dir,{recursive:true});
await fs.writeFile(`${dir}/protected-${phase}.json`,JSON.stringify(result,null,2));
if(phase==='after'&&JSON.stringify(JSON.parse(await fs.readFile(`${dir}/protected-before.json`,'utf8')))!==JSON.stringify(result))throw Error('Protected metadata changed');
console.log('Protected '+phase+': '+result.length+' routes PASS');
