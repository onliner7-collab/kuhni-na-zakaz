const fs = require('fs');
const path = require('path');
const {createRequire} = require('module');
const req = createRequire(path.resolve('artifacts/kuhni-na-zakaz/package.json'));
const {chromium} = req('@playwright/test');
const out = path.resolve('docs/seo/audit-20261027');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
(async () => {
  fs.mkdirSync(out, {recursive:true});
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage();
  const sitemap = await (await fetch('https://kuhni.minsk.by/sitemap.xml')).text();
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  const robots = await (await fetch('https://kuhni.minsk.by/robots.txt')).text();
  fs.writeFileSync(path.join(out,'robots.txt'),robots);
  const rows = [];
  for (const url of urls) {
    let response;
    for(let attempt=0;attempt<3;attempt++){
      response=await fetch(url,{redirect:'manual'});
      if(response.status!==503&&response.status!==429)break;
      await delay(1800);
    }
    const html=await response.text();
    const data = await page.evaluate(html=>{
      const doc=new DOMParser().parseFromString(html,'text/html');
      const schemas=[],schemaErrors=[];
      for(const script of doc.querySelectorAll('script[type="application/ld+json"]')){
        try{schemas.push(JSON.parse(script.textContent));}catch(e){schemaErrors.push(e.message);}
      }
      const allText=doc.body.textContent;
      const main=doc.querySelector('main')||doc.body;
      const mainClone=main.cloneNode(true);
      mainClone.querySelectorAll('script,style,header,footer,nav').forEach(e=>e.remove());
      const text=mainClone.textContent.replace(/\s+/g,' ').trim();
      const links=[...doc.querySelectorAll('a[href]')].map(a=>({href:a.getAttribute('href'),text:a.textContent.trim()}));
      const walk=v=>Array.isArray(v)?v.flatMap(walk):v&&typeof v==='object'?[v,...Object.values(v).flatMap(walk)]:[];
      const objects=schemas.flatMap(walk);
      return {
        title:doc.title,description:doc.querySelector('meta[name=description]')?.content,
        h1:[...doc.querySelectorAll('h1')].map(e=>e.textContent.trim()),
        h2:[...doc.querySelectorAll('h2')].map(e=>e.textContent.trim()),
        canonicals:[...doc.querySelectorAll('link[rel=canonical]')].map(e=>e.getAttribute('href')),
        robots:doc.querySelector('meta[name=robots]')?.content,
        viewport:doc.querySelector('meta[name=viewport]')?.content,
        images:[...main.querySelectorAll('img')].map(e=>({src:e.getAttribute('src'),alt:e.getAttribute('alt'),loading:e.getAttribute('loading')})),
        links,schemaTypes:[...new Set(objects.flatMap(o=>o['@type']||[]))],schemaErrors,
        faq:objects.filter(o=>o['@type']==='Question').map(o=>({q:o.name,a:o.acceptedAnswer?.text})),
        text,chars:text.length,priceMentions:(text.match(/BYN/g)||[]).length,
        sourceLanguage:text.match(/приоритеты вместо обещаний|следующие осмысленные шаги|Текстовый fallback|выбранные.*передаются.*полями|не обещая вместимость/gi)||[]
      };
    },html);
    rows.push({url,status:response.status,location:response.headers.get('location'),xRobots:response.headers.get('x-robots-tag'),...data});
    if(rows.length%15===0)console.log('Crawled',rows.length,'/',urls.length);
    await delay(180);
  }
  const duplicates=field=>{
    const groups=new Map();
    for(const row of rows){const value=typeof row[field]==='string'?row[field]:JSON.stringify(row[field]);if(!groups.has(value))groups.set(value,[]);groups.get(value).push(row.url);}
    return [...groups].filter(([value,group])=>value&&group.length>1).map(([value,urls])=>({value,urls}));
  };
  const known=new Set(rows.map(r=>r.url));
  const internal=[...new Set(rows.flatMap(r=>r.links.map(l=>l.href)).filter(h=>h&&h.startsWith('/')&&!h.startsWith('//')).map(h=>new URL(h,'https://kuhni.minsk.by').origin+new URL(h,'https://kuhni.minsk.by').pathname))];
  const extras=[];
  for(const url of internal.filter(u=>!known.has(u)&&!u.includes('/kapi/')&&!u.includes('/api/'))){
    const r=await fetch(url,{redirect:'manual'});extras.push({url,status:r.status,location:r.headers.get('location')});await r.body?.cancel();await delay(180);
  }
  const result={date:'2026-10-27',count:rows.length,robots,rows,extras,duplicateTitles:duplicates('title'),duplicateDescriptions:duplicates('description'),duplicateH1:duplicates('h1')};
  fs.writeFileSync(path.join(out,'crawl.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify({count:rows.length,non200:rows.filter(r=>r.status!==200).map(r=>({url:r.url,status:r.status})),badH1:rows.filter(r=>r.h1.length!==1).map(r=>r.url),badCanonical:rows.filter(r=>r.canonicals.length!==1||r.canonicals[0]!==r.url).map(r=>({url:r.url,canonical:r.canonicals})),noindex:rows.filter(r=>/noindex/.test(r.robots||r.xRobots||'')).map(r=>r.url),duplicateTitles:result.duplicateTitles,duplicateDescriptions:result.duplicateDescriptions,schemaErrors:rows.filter(r=>r.schemaErrors.length).map(r=>r.url),extraFailures:extras.filter(e=>e.status>=400),redirectLinks:extras.filter(e=>e.status>=300&&e.status<400)},null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
