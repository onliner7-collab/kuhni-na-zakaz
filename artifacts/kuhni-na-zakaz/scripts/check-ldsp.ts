import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { MATERIAL_ROUTES } from '../data/material-solutions';

async function main() {
 const base=process.env.LDSP_QA_URL || 'http://127.0.0.1:3034';
 const phase=process.env.LDSP_QA_PHASE || 'local';
 const out=path.resolve('../../docs/seo/materials-comparison/stage-3',phase);
 await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},recordVideo:{dir:out,size:{width:390,height:844}},reducedMotion:'reduce'});
 await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 const page=await context.newPage();page.setDefaultNavigationTimeout(60000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const report:Record<string,any>={base,date:'2026-10-17',phase,errors};
 const ready=()=>page.waitForFunction(()=>{const e=document.querySelector('[data-testid="materials-selection"]');return e&&!e.hasAttribute('inert');});
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('kuhni-materials-v1') || '{}'));
 const loadImages=async()=>{await page.locator('#ldsp-visual-page img').evaluateAll(async es=>{for(const e of es){const img=e as HTMLImageElement;img.loading='eager';}await Promise.all(es.map(e=>(e as HTMLImageElement).decode().catch(()=>{})));});assert.deepEqual(await page.locator('#ldsp-visual-page img').evaluateAll(es=>es.filter(e=>!(e as HTMLImageElement).naturalWidth).map(e=>(e as HTMLImageElement).src)),[]);};
 try {
  await page.goto(base+'/materials/ldsp');await ready();await page.evaluate(()=>localStorage.clear());await page.reload();await ready();
  assert.deepEqual((await state()).comparisonIds,[]);
  for(const width of [360,390,412,768,1440]){
   await page.setViewportSize({width,height:844});await loadImages();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);
   await page.evaluate(()=>scrollTo(0,0));
   await page.screenshot({path:path.join(out,`first-screen-${width}.png`)});
  }
  report.viewports=[360,390,412,768,1440];
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'3. Кромка',exact:true}).click();
  assert.ok((await page.locator('#ldsp-construction img').getAttribute('src'))?.includes('edge'));
  await page.getByRole('button',{name:'Дерево + однотонный',exact:true}).click();
  await page.getByRole('button',{name:'Дача и сезонное проживание',exact:true}).click();
  await page.getByRole('button',{name:'Сравнить с эмалью',exact:true}).click();
  await page.goBack();await ready();assert.equal((await state()).ldspView.alternative,'mdf-film');
  await page.goForward();await ready();assert.equal((await state()).ldspView.alternative,'mdf-enamel');
  let s=await state();assert.deepEqual(s.comparisonIds,[]);assert.equal(s.preferredId,null);assert.equal(s.updatedAt,0);
  await page.reload();await ready();assert.equal(await page.getByRole('button',{name:'Сравнить с эмалью',exact:true}).getAttribute('aria-pressed'),'true');
  report.visualState={restored:s.ldspView,selectionUnchanged:true,backForward:true};
  const frameButtons=page.locator('#material-explorer button[data-frame-id]');
  assert.equal(await frameButtons.count(),4);
  for(let i=0;i<4;i++){await frameButtons.nth(i).click();assert.equal(await frameButtons.nth(i).getAttribute('aria-pressed'),'true');}
  await page.locator('#material-detail-gallery button[aria-label^="Показать фото 8:"]').click();
  await page.locator('#material-detail-gallery button[aria-label^="Открыть фото"]').click();
  await page.getByRole('dialog',{name:'Фото материала ЛДСП для кухни'}).waitFor();
  await page.getByRole('button',{name:'Закрыть галерею',exact:true}).click();
  assert.ok((await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')))?.startsWith('Открыть фото'));
  report.preservedBlocks='4 explorer frames, 8 gallery photos, lightbox and focus PASS';
  await page.locator('#ldsp-visual-page').getByRole('button',{name:'Предпочитаю этот вариант',exact:true}).first().click();
  await page.locator('#ldsp-alternatives').getByRole('button',{name:'Добавить к сравнению',exact:true}).click();
  s=await state();assert.deepEqual(s.comparisonIds,['ldsp','mdf-enamel']);assert.equal(s.preferredId,'ldsp');
  await page.getByRole('button',{name:'Угловая кухня около 2,4 × 1,8 м',exact:true}).click();
  await page.locator('#materials-form input[name="name"]').fill('Проверка без отправки');
  await page.locator('#materials-form input[name="phone"]').fill('+375291234567');
  await page.locator('#materials-form input[name="agreement"]').check();
  let payload:any=null;
  await page.route('**/kapi/leads',async r=>{payload=r.request().postDataJSON();await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true})});});
  await page.locator('#materials-form').getByRole('button',{name:'Рассчитать кухню',exact:true}).click();
  await page.getByTestId('form-success').waitFor();
  assert.deepEqual(payload.answers.materialSelection.comparisonIds,['ldsp','mdf-enamel']);
  assert.equal(payload.answers.materialSelection.preferredId,'ldsp');
  assert.equal(payload.answers.materialSelection.scenarioId,'corner-24-18');
  assert.ok(!('ldspView' in payload.answers.materialSelection));
  report.form={intercepted:true,selection:payload.answers.materialSelection,noExternalSubmission:true};
  await page.goto(base+'/materials/ldsp?compare=ldsp,mdf-film&preferred=ldsp');await ready();await loadImages();
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,'mobile-full.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:path.join(out,'desktop-full.png'),fullPage:true});
  for(const name of ['apartment','cabinet','edge','country']){
   const r=await context.request.get(base+'/images/ldsp-20261017/'+name+'.webp');assert.equal(r.status(),200);
   const w=await context.request.get(base+'/kapi/watermarked-image?src='+encodeURIComponent('/images/ldsp-20261017/'+name+'.webp')+'&w=640');assert.equal(w.status(),200);
  }
  report.newImages='4 files and 4 watermarked requests: 200';
  const video=page.video();await context.close();if(video)await video.saveAs(path.join(out,'journey.webm'));
  const navContext=await browser.newContext();
  await navContext.route('**/*',r=>new URL(r.request().url()).origin!==base||r.request().resourceType()==='image'?r.abort():r.continue());
  const navPage=await navContext.newPage();navPage.on('pageerror',e=>errors.push(e.message));
  const transitions=[];
  const navReady=()=>navPage.waitForFunction(()=>{const e=document.querySelector('[data-testid="materials-selection"]');return e&&!e.hasAttribute('inert');});
  for(const from of MATERIAL_ROUTES){
   for(const to of MATERIAL_ROUTES.filter(r=>r!==from)){
    await navPage.goto(base+from+'?compare=ldsp,mdf-film&preferred=ldsp');await navReady();
    await navPage.getByRole('navigation',{name:'Другие материалы',exact:true}).locator(`a[href^="${to}?"]`).click();
    await navPage.waitForURL(u=>u.pathname===to);await navReady();
    const n=await navPage.evaluate(()=>JSON.parse(localStorage.getItem('kuhni-materials-v1')!));
    assert.deepEqual(n.comparisonIds,['ldsp','mdf-film']);assert.equal(n.preferredId,'ldsp');
    assert.equal(await navPage.locator('h1').count(),1);
    assert.equal(await navPage.locator('link[rel="canonical"]').getAttribute('href'),'https://kuhni.minsk.by'+to);
    transitions.push({from,to,status:'PASS'});
   }
   console.log('Transitions from '+from+' PASS');
  }
  report.transitions=transitions;assert.equal(transitions.length,42);
  const tab=await navContext.newPage();await tab.goto(base+'/materials/ldsp?compare=ldsp,mdf-film&preferred=ldsp');await tab.waitForFunction(()=>localStorage.getItem('kuhni-materials-v1')!==null);assert.equal((await tab.evaluate(()=>JSON.parse(localStorage.getItem('kuhni-materials-v1')!))).preferredId,'ldsp');report.newTab=true;
  const noStorage=await browser.newContext();await noStorage.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Unavailable','SecurityError');}});});
  const blocked=await noStorage.newPage();await blocked.goto(base+'/materials/ldsp?compare=ldsp&preferred=ldsp');await blocked.getByRole('button',{name:'Предпочитаю ✓',exact:true}).first().waitFor();assert.ok(await blocked.locator('#ldsp-visual-page').isVisible());await noStorage.close();report.blockedStorage=true;
  assert.equal(errors.length,0);report.status='PASS';console.log('LDSP browser QA PASS');
 }catch(e){report.status='FAIL';report.failure=String(e);throw e;}
 finally{await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2),'utf8');await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
