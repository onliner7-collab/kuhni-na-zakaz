const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../docs/seo/portfolio-20261027');
const mode = process.argv[2] || 'final';
const protectedRoutes = ['/', '/design-proekt-kuhni', '/locations/minskaya-oblast', '/locations/minsk', '/materials/furnitura', '/locations/borisov'];
function get(route) { return new Promise((resolve, reject) => {
  const req = https.get({ hostname: 'kuhni.minsk.by', path: route, lookup: (_n,o,cb) => o.all ? cb(null,[{address:'5.42.108.140',family:4}]) : cb(null,'5.42.108.140',4), timeout:30000 }, res => {
    let body=''; res.setEncoding('utf8'); res.on('data', c => body+=c); res.on('end', () => resolve({status:res.statusCode,body}));
  }); req.on('error',reject); req.on('timeout',()=>req.destroy(Error('timeout')));
}); }
const match = (body,re) => body.match(re)?.[1] || '';
function meta(body) { return {
  title:match(body,/<title>(.*?)<\/title>/s),
  description:match(body,/<meta name="description" content="(.*?)"/s),
  h1:match(body,/<h1[^>]*>(.*?)<\/h1>/s).replace(/<[^>]*>/g,''),
  canonical:match(body,/<link rel="canonical" href="(.*?)"/s),
}; }
(async()=>{
  fs.mkdirSync(root,{recursive:true});
  const protectedSnapshot = {};
  for(const route of protectedRoutes) {const r=await get(route);assert.equal(r.status,200,route);protectedSnapshot[route]=meta(r.body);}
  if(mode==='baseline') {
    fs.writeFileSync(path.join(root,'protected-before.json'),JSON.stringify(protectedSnapshot,null,2));
    console.log('PROTECTED_BASELINE_SAVED'); return;
  }
  assert.deepEqual(protectedSnapshot,JSON.parse(fs.readFileSync(path.join(root,'protected-before.json'),'utf8')));
  const hub=await get('/portfolio'); assert.equal(hub.status,200);
  const collection=[...hub.body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .flatMap(m=>{const json=JSON.parse(m[1]);return Array.isArray(json)?json:[json];}).find(item=>item['@type']==='CollectionPage');
  const urls=collection.mainEntity.itemListElement.map(item=>new URL(item.url).pathname);
  assert.equal(urls.length,49);assert.equal(new Set(urls).size,49);
  const results=[];
  for(const route of urls) {
    const r=await get(route);assert.equal(r.status,200,route);const m=meta(r.body);
    assert.doesNotMatch(m.h1,/Минск|Гомел|Могил[её]в|Витебск|Брест|Гродно/i,route);
    assert.match(m.title,/идея кухни/,route);assert.ok(m.description,route);
    const json=[...r.body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
      .flatMap(m=>{const j=JSON.parse(m[1]);return Array.isArray(j)?j:[j];});
    const work=json.find(j=>j['@type']==='CreativeWork'); assert.ok(work,route);
    assert.equal(work.contentLocation,undefined,route);assert.equal(work.offers,undefined,route);
    assert.ok(r.body.includes('Стоимость похожей кухни'),route);
    results.push({route,status:r.status,...m});
  }
  assert.equal(new Set(results.map(row=>row.title)).size,results.length,'unique titles');
  const sitemap=await get('/sitemap.xml');assert.equal(sitemap.status,200);
  const sitemapUrls=[...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.equal(sitemapUrls.length,111);
  fs.writeFileSync(path.join(root,'http-final.json'),JSON.stringify({protected:protectedSnapshot,portfolio:results,sitemapCount:sitemapUrls.length},null,2));
  console.log('PORTFOLIO_HTTP_QA_PASS: 49 pages, 6 protected routes, 111 sitemap URLs');
})().catch(error=>{console.error(error);process.exitCode=1;});
