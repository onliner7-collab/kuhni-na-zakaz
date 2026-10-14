import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { MATERIAL_ROUTES } from '../data/material-solutions';
import { MATERIAL_PHOTOS } from '../data/material-hub-gallery';

async function main(){
const base=process.env.MATERIALS_QA_URL||'http://127.0.0.1:3015';
const out=path.resolve('../../docs/seo/materials-comparison/stage-1/qa');await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
page.setDefaultNavigationTimeout(60000);
const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
const report:Record<string,unknown>={base,date:'2026-10-14',routes:[],transitions:[],images:[],errors};
const query='?compare=mdf-film,ldsp&preferred=ldsp';
try{
 await page.goto(base+'/materials',{waitUntil:'domcontentloaded'});await page.locator('[data-material-id="ldsp"] button').first().waitFor();
 await page.locator('[data-material-id="mdf-film"]').getByRole('button',{name:'Добавить к сравнению',exact:true}).click();
 await page.locator('[data-material-id="ldsp"]').getByRole('button',{name:'Предпочитаю этот вариант',exact:true}).click();
 await page.locator('[data-material-id="hpl"]').getByRole('button',{name:'Добавить к сравнению',exact:true}).click();
 await page.locator('[data-material-id="acrylic"]').getByRole('button',{name:'Добавить к сравнению',exact:true}).click();
 assert.ok(await page.getByRole('dialog',{name:'В сравнении уже три варианта'}).isVisible());
 await page.getByRole('button',{name:'Отмена',exact:true}).click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('kuhni-materials-v1')!).comparisonIds.join(',')),'mdf-film,ldsp,hpl');
 await page.locator('[data-material-id="acrylic"]').getByRole('button',{name:'Предпочитаю этот вариант',exact:true}).click();
 await page.getByRole('button',{name:'Заменить Фасады с HPL',exact:true}).click();
 await page.reload();await page.locator('[data-material-id="acrylic"]').getByRole('button',{name:'Предпочитаю ✓',exact:true}).waitFor();report.selectionAndReplace='PASS';
 await page.getByLabel('Фильтр: материал',{exact:true}).selectOption('mdf-enamel');
 await page.getByLabel('Фильтр: цвет',{exact:true}).selectOption('Цветные');
 await page.goBack();assert.equal(await page.getByLabel('Фильтр: цвет',{exact:true}).inputValue(),'');
 await page.goForward();assert.equal(await page.getByLabel('Фильтр: цвет',{exact:true}).inputValue(),'Цветные');report.filterHistory='PASS';
 await page.locator('#gallery button[aria-label^="Увеличить фото"]').first().click();
 assert.ok(await page.getByRole('dialog',{name:'Фотогалерея материалов кухни'}).isVisible());
 await page.getByRole('button',{name:'Закрыть галерею',exact:true}).click();
 assert.ok((await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')))?.startsWith('Увеличить фото'));report.lightboxFocus='PASS';
 for(const width of [360,390,768,1280]){
   await page.setViewportSize({width,height:900});await page.goto(base+'/materials'+query,{waitUntil:'domcontentloaded'});
   await page.locator('#gallery').scrollIntoViewIfNeeded();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
   if(process.env.MATERIALS_QA_SCREENSHOTS!=='0'){
     await page.screenshot({path:path.join(out,`gallery-${width}.png`)});
     if(width===390){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,'first-screen-390.png')});}
   }
 }
 report.viewports='360, 390, 768, 1280 PASS';
 await page.setViewportSize({width:390,height:844});
 await page.route('**/*',r=>r.request().resourceType()==='image'?r.abort():r.continue());
 for(const from of MATERIAL_ROUTES){
   await page.goto(base+from+query,{waitUntil:'domcontentloaded'});await page.getByTestId('materials-selection').getByText('В сравнении: 2 из 3',{exact:true}).waitFor();await page.getByRole('navigation',{name:'Другие материалы',exact:true}).waitFor();
   assert.equal(await page.locator('h1').count(),1,from);
   assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://kuhni.minsk.by'+from);
   (report.routes as unknown[]).push({route:from,h1:1,canonical:'PASS'});
   for(const to of MATERIAL_ROUTES.filter(r=>r!==from)){
     await page.goto(base+from+query,{waitUntil:'domcontentloaded'});
     await page.getByTestId('materials-selection').getByText('В сравнении: 2 из 3',{exact:true}).waitFor();
     const nav=page.getByRole('navigation',{name:'Другие материалы',exact:true});
     await nav.locator(`a[href^="${to}?"]`).click();
     await page.waitForURL(u=>u.pathname===to,{waitUntil:'domcontentloaded'});
     await page.getByTestId('materials-selection').getByText('В сравнении: 2 из 3',{exact:true}).waitFor();
     await page.waitForFunction(()=>localStorage.getItem('kuhni-materials-v1')!==null);
     const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('kuhni-materials-v1')!));
     assert.deepEqual(s.comparisonIds,['mdf-film','ldsp']);assert.equal(s.preferredId,'ldsp');
     (report.transitions as unknown[]).push({from,to,status:'PASS'});
   }
   console.log('Transitions from',from,'PASS');
 }
 await page.unroute('**/*');
 for(const p of MATERIAL_PHOTOS){const r=await context.request.get(base+p.src);assert.equal(r.status(),200,p.src);(report.images as unknown[]).push({id:p.id,status:r.status()});}
 const watermarked=await context.request.get(base+'/kapi/watermarked-image?src='+encodeURIComponent('/images/materials-hub-20261014/hero-ivory.webp')+'&w=640');
 assert.equal(watermarked.status(),200);report.watermarkEndpoint=200;
 await page.goto(base+'/materials'+query,{waitUntil:'domcontentloaded'});
 await page.locator('#materials-form input[name="name"]').fill('Тест формы материалов');
 await page.locator('#materials-form input[name="phone"]').fill('+375291234567');
 await page.locator('#materials-form input[name="agreement"]').check();
 let payload:any=null;
 await page.route('**/kapi/leads',async route=>{payload=route.request().postDataJSON();await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true})});});
 await page.locator('#materials-form').getByRole('button',{name:'Получить расчёт выбранных вариантов',exact:true}).click();
 await page.getByTestId('form-success').waitFor();
 assert.deepEqual(payload.answers.materialSelection.comparisonIds,['mdf-film','ldsp']);assert.equal(payload.answers.materialSelection.preferredId,'ldsp');assert.ok(!('recentViews' in payload.answers.materialSelection));
 report.formPayload={method:'Intercepted locally; no real submission or notification',selection:payload.answers.materialSelection,source:payload.source};
 assert.equal(errors.length,0);report.status='PASS';
}catch(e){report.status='FAIL';report.error=String(e);try{await page.screenshot({path:path.join(out,'failure.png'),timeout:5000});}catch{}throw e;}
finally{await fs.writeFile(path.join(out,'browser-report.json'),JSON.stringify(report,null,2)+'\n','utf8');await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
