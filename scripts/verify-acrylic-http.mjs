import fs from 'node:fs/promises';
const base='https://kuhni.minsk.by';
const result=[];
for(const route of ['/materials/akril','/robots.txt','/sitemap.xml']){
  const response=await fetch(base+route);const body=await response.text();
  if(response.status!==200)throw Error(route+': '+response.status);
  const item={route,status:response.status};
  if(route==='/materials/akril'){
    item.canonical=body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
    item.h1Count=[...body.matchAll(/<h1[\s>]/g)].length;
    item.visualPage=body.includes('acrylic-visual-page');
    if(item.canonical!==base+route||item.h1Count!==1||!item.visualPage)throw Error('Page SEO verification failed');
  }
  if(route==='/sitemap.xml'){
    const entries=[...body.matchAll(/<url>[\s\S]*?<\/url>/g)].map(m=>m[0]);
    item.urlCount=entries.length;
    item.acrylic=entries.find(x=>x.includes('<loc>'+base+'/materials/akril</loc>'));
    if(!item.acrylic?.includes('2026-10-21')||item.urlCount!==112)throw Error('Sitemap verification failed');
  }
  result.push(item);
}
await fs.writeFile('docs/seo/materials-comparison/stage-6/production-http.json',JSON.stringify(result,null,2)+'\n','utf8');
console.log(JSON.stringify(result));
