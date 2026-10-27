const fs=require('fs'),path=require('path'),{createRequire}=require('module');
const req=createRequire(path.resolve('artifacts/kuhni-na-zakaz/package.json'));
const {chromium,expect}=req('@playwright/test');
const base='https://kuhni.minsk.by',old='/scenarios/dlya-malenkoy-kuhni',destination='/catalog/malenkie-kuhni';
const out=path.resolve('docs/seo/audit-20261027');
(async()=>{
 const results={date:'2026-10-27',redirects:[],protected:[],viewports:[],oldLinks:[]};
 for(const suffix of ['', '?from=qa']){
   const r=await fetch(base+old+suffix,{redirect:'manual'});
   const location=r.headers.get('location');
   if(r.status!==308||new URL(location,base).pathname!==destination)throw Error('Redirect failed '+r.status+' '+location);
   results.redirects.push({url:old+suffix,status:r.status,location});await r.body?.cancel();
 }
 const xml=await(await fetch(base+'/sitemap.xml')).text();
 const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 if(xml.includes('<loc>'+base+old+'</loc>')||urls.length!==111)throw Error('Sitemap failed '+urls.length);
 results.sitemapCount=urls.length;
 const baseline=JSON.parse(fs.readFileSync(path.join(out,'crawl.json'),'utf8'));
 const b=await chromium.launch({headless:true});
 const p=await b.newPage({viewport:{width:390,height:844}});
 for(const route of ['/','/locations/borisov','/locations/minsk','/locations/minskaya-oblast','/materials/furnitura','/design-proekt-kuhni']){
   const html=await(await fetch(base+route)).text();
   const observed=await p.evaluate(html=>{
     const d=new DOMParser().parseFromString(html,'text/html');return{title:d.title,description:d.querySelector('meta[name=description]')?.content,h1:[...d.querySelectorAll('h1')].map(e=>e.textContent.trim()),canonicals:[...d.querySelectorAll('link[rel=canonical]')].map(e=>e.getAttribute('href'))};
   },html);
   const before=baseline.rows.find(r=>new URL(r.url).pathname===route);
   for(const key of ['title','description','h1','canonicals'])if(JSON.stringify(observed[key])!==JSON.stringify(before[key]))throw Error('Protected change '+route+' '+key);
   results.protected.push(route);
 }
 for(const url of urls){
   const response=await fetch(url);const html=await response.text();
   if(response.status!==200)throw Error('Non200 '+url);
   const links=await p.evaluate(html=>{const d=new DOMParser().parseFromString(html,'text/html');return[...d.querySelectorAll('a[href],link[rel=canonical]')].map(e=>e.getAttribute('href')).filter(h=>h?.split(/[?#]/)[0].replace(/\/$/,'')==='/scenarios/dlya-malenkoy-kuhni')},html);
   if(links.length)results.oldLinks.push({url,links});
   if(new URL(url).pathname==='/scenarios'){
     const schemaHas=await p.evaluate(html=>{const d=new DOMParser().parseFromString(html,'text/html');return[...d.querySelectorAll('script[type="application/ld+json"]')].some(s=>s.textContent.includes('/scenarios/dlya-malenkoy-kuhni'))},html);
     if(schemaHas)throw Error('Retired URL in hub schema');
   }
   await new Promise(r=>setTimeout(r,180));
 }
 if(results.oldLinks.length)throw Error(JSON.stringify(results.oldLinks));
 for(const width of [320,390,768,1440]){
   await p.setViewportSize({width,height:844});
   const r=await p.goto(base+old,{waitUntil:'networkidle'});
   await expect(p).toHaveURL(base+destination);
   await expect(p.getByRole('heading',{level:1})).toHaveText('Маленькие кухни на заказ');
   const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,oldLinks:[...document.querySelectorAll('a')].filter(a=>a.href.includes('/scenarios/dlya-malenkoy-kuhni')).length}));
   if(state.overflow||state.oldLinks||r.status()!==200)throw Error('Browser fail '+width);
   results.viewports.push({width,...state});
   if(width===390)await p.screenshot({path:path.join(out,'retired-destination-mobile.png')});
 }
 await b.close();fs.writeFileSync(path.join(out,'retirement-production-qa.json'),JSON.stringify(results,null,2));console.log('RETIREMENT_PRODUCTION_QA_PASS',JSON.stringify(results));
})().catch(e=>{console.error(e);process.exit(1)});
