const fs=require('fs'),path=require('path'),{createRequire}=require('module');
const req=createRequire(path.resolve('artifacts/kuhni-na-zakaz/package.json'));
const {chromium}=req('@playwright/test');
const out=path.resolve('docs/seo/audit-20261027');
const routes=['/','/catalog','/prices','/calculator','/catalog/uglovye-kuhni','/catalog/pryamye-kuhni','/catalog/malenkie-kuhni','/catalog/kuhni-do-potolka','/catalog/kuhni-bez-ruchek','/catalog/p-obraznye-kuhni','/catalog/kuhni-s-ostrovom','/locations/borisov','/locations/minsk','/locations/zhodino','/locations/smolevichi','/locations/logoisk','/locations/minskaya-oblast','/materials','/materials/mdf-fasady','/materials/akril','/styles/sovremennye','/styles/neoklassika','/scenarios/dlya-studii','/scenarios/do-potolka','/scenarios/byudzhetnaya-kuhnya','/design-proekt-kuhni','/reviews','/portfolio','/blog/kuhnya-6-kv-m-v-hruschevke'];
(async()=>{
  fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({headless:true});const results=[];
  for(const route of routes){
    const p=await b.newPage({viewport:{width:390,height:844}});const errors=[];
    p.on('pageerror',e=>errors.push(e.message));
    try{
      await p.goto('https://kuhni.minsk.by'+route,{waitUntil:'networkidle',timeout:45000});
      const initial=await p.evaluate(()=>({heroTop:[...document.querySelectorAll('main img')].find(i=>i.getBoundingClientRect().width>200)?.getBoundingClientRect().top??null,overflow:document.documentElement.scrollWidth>innerWidth,height:document.documentElement.scrollHeight}));
      for(let y=0;y<Math.min(initial.height,30000);y+=700){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(80);}
      await p.waitForTimeout(300);
      const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.getBoundingClientRect().width>0&&i.complete&&!i.naturalWidth).map(i=>i.currentSrc||i.src),pendingLazy:[...document.images].filter(i=>i.getBoundingClientRect().width>0&&!i.complete).map(i=>i.currentSrc||i.src),blankButtons:[...document.querySelectorAll('button')].filter(e=>!e.textContent.trim()&&!e.getAttribute('aria-label')&&!e.getAttribute('title')).length,missingAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(e=>e.hash.length>1&&!document.getElementById(decodeURIComponent(e.hash.slice(1)))).map(e=>e.hash)}));
      await p.evaluate(()=>scrollTo(0,0));
      if(['/catalog/kuhni-bez-ruchek','/styles/sovremennye','/scenarios/dlya-studii','/reviews','/portfolio'].includes(route))await p.screenshot({path:path.join(out,route.slice(1).replaceAll('/','-')+'.png'),fullPage:true});
      results.push({route,width:390,initial,...state,errors});
      if(['/','/catalog/malenkie-kuhni','/locations/minsk','/materials/mdf-fasady','/design-proekt-kuhni','/locations/minskaya-oblast'].includes(route)){
        await p.setViewportSize({width:1440,height:900});
        results.push({route,width:1440,...await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,height:document.documentElement.scrollHeight}))});
      }
      console.log(route,JSON.stringify({overflow:state.overflow,broken:state.broken.length,anchors:state.missingAnchors,errors:errors.length,heroTop:initial.heroTop}));
    }catch(e){results.push({route,error:e.message});console.log('ERROR',route,e.message)}
    await p.close();
  }
  fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify(results,null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
