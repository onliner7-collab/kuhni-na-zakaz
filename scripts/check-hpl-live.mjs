import https from 'node:https';
import fs from 'node:fs/promises';
async function get(route){return new Promise((resolve,reject)=>{const req=https.get({hostname:'kuhni.minsk.by',servername:'kuhni.minsk.by',path:route,lookup:(_n,o,cb)=>o.all?cb(null,[{address:'5.42.108.140',family:4}]):cb(null,'5.42.108.140',4),timeout:20000},res=>{let body='';res.setEncoding('utf8');res.on('data',x=>body+=x);res.on('end',()=>resolve({status:res.statusCode,body}));});req.on('timeout',()=>req.destroy(Error('timeout')));req.on('error',reject);});}
const sitemap=await get('/sitemap.xml');
const robots=await get('/robots.txt');
const result={checkedAt:'2026-10-20',sitemapStatus:sitemap.status,robotsStatus:robots.status,sitemapUrls:(sitemap.body.match(/<loc>/g)||[]).length,hplEntry:sitemap.body.match(/<url>\s*<loc>https:\/\/kuhni\.minsk\.by\/materials\/plastik-hpl<\/loc>[\s\S]*?<\/url>/)?.[0]};
await fs.writeFile('docs/seo/materials-comparison/stage-5/production-http.json',JSON.stringify(result,null,2),'utf8');
if(result.sitemapStatus!==200||result.robotsStatus!==200||result.sitemapUrls!==112||!result.hplEntry?.includes('2026-10-20'))throw Error(JSON.stringify(result));
console.log(result);
