import https from 'node:https';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
async function get(route){return await new Promise((resolve,reject)=>{const req=https.get({hostname:'kuhni.minsk.by',servername:'kuhni.minsk.by',path:route,lookup:(_n,o,cb)=>o.all?cb(null,[{address:'5.42.108.140',family:4}]):cb(null,'5.42.108.140',4),timeout:25000},res=>{let body='';res.setEncoding('utf8');res.on('data',d=>body+=d);res.on('end',()=>resolve({status:res.statusCode,body}));});req.on('timeout',()=>req.destroy(Error('timeout')));req.on('error',reject);});}
const page=await get('/materials/mdf-emal');assert.equal(page.status,200);
const sitemap=await get('/sitemap.xml');assert.equal(sitemap.status,200);
const robots=await get('/robots.txt');assert.equal(robots.status,200);
const entry=sitemap.body.match(/<url>\s*<loc>https:\/\/kuhni\.minsk\.by\/materials\/mdf-emal<\/loc>[\s\S]*?<\/url>/)?.[0];
assert.ok(entry?.includes('2026-10-17T00:00:00.000Z'));
const h1=(page.body.match(/<h1\b/g)||[]).length;assert.equal(h1,1);
const canonical=page.body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];assert.equal(canonical,'https://kuhni.minsk.by/materials/mdf-emal');
const schemas=[...page.body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
assert.ok(schemas.some(s=>s['@type']==='BreadcrumbList'));
for(const id of ['enamel-visual-page','material-explorer','material-detail-gallery','enamel-faq','materials-form'])assert.ok(page.body.includes(`id="${id}"`));
const report={date:'2026-10-17',status:'PASS',pageStatus:page.status,sitemapStatus:sitemap.status,robotsStatus:robots.status,sitemapCount:(sitemap.body.match(/<loc>/g)||[]).length,sitemapEntry:entry,h1,canonical,jsonLdTypes:schemas.map(s=>s['@type'])};
await fs.mkdir('docs/seo/materials-comparison/stage-4/production',{recursive:true});await fs.writeFile('docs/seo/materials-comparison/stage-4/production/live-seo.json',JSON.stringify(report,null,2),'utf8');console.log(JSON.stringify(report,null,2));
