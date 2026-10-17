import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import { MATERIAL_ROUTES } from '../data/material-solutions';
import { ENAMEL_PHOTOS } from '../data/enamel-content';

async function main() {
 const base=process.env.ENAMEL_QA_URL||'http://127.0.0.1:3035';
 const out=path.resolve('../../docs/seo/materials-comparison/stage-4',process.env.ENAMEL_QA_PHASE||'local');
 await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',recordVideo:{dir:out,size:{width:390,height:844}}});
 await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 const page=await context.newPage();page.setDefaultNavigationTimeout(60000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const report:Record<string,any>={base,date:'2026-10-17',errors};
 const ready=()=>page.waitForFunction(()=>{const e=document.querySelector('[data-testid="materials-selection"]');return e&&!e.hasAttribute('inert');});
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('kuhni-materials-v1')||'{}'));
 const loadImages=async()=>{await page.locator('#enamel-visual-page img').evaluateAll(async es=>{es.forEach(e=>(e as HTMLImageElement).loading='eager');await Promise.all(es.map(e=>(e as HTMLImageElement).decode().catch(()=>{})));});await page.waitForFunction(()=>Array.from(document.querySelectorAll('#enamel-visual-page img')).every(e=>(e as HTMLImageElement).complete&&(e as HTMLImageElement).naturalWidth>0),{},{timeout:30000});assert.deepEqual(await page.locator('#enamel-visual-page img').evaluateAll(es=>es.filter(e=>!(e as HTMLImageElement).naturalWidth).map(e=>(e as HTMLImageElement).src)),[]);};
 try {
  await page.goto(base+'/materials/mdf-emal');await ready();await page.evaluate(()=>localStorage.clear());await page.reload();await ready();
  assert.deepEqual((await state()).comparisonIds,[]);
  for(const width of [360,390,412,768,1440]){
   await page.setViewportSize({width,height:844});await loadImages();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,`first-screen-${width}.png`)});
  }
  report.viewports=[360,390,412,768,1440];await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Глянцевая эмаль',exact:true}).click();
  assert.ok((await page.locator('#enamel-finishes img').first().getAttribute('src'))?.includes('straight-gloss'));
  await page.getByRole('button',{name:'Выраженная рамка',exact:true}).click();
  assert.ok((await page.locator('#enamel-profiles img').getAttribute('style'))?.includes('66.666'));
  await page.getByRole('button',{name:'Дача и сезонное проживание',exact:true}).click();
  await page.getByRole('button',{name:'С HPL',exact:true}).click();
  await page.goBack();await ready();assert.equal((await state()).enamelView.alternative,'mdf-film');
  await page.goForward();await ready();assert.equal((await state()).enamelView.alternative,'hpl');
  await page.getByLabel('Финиш',{exact:true}).selectOption('Глянцевая');
  assert.equal(await page.locator('#enamel-gallery figure').count(),1);
  await page.reload();await ready();assert.equal(await page.getByLabel('Финиш',{exact:true}).inputValue(),'Глянцевая');
  await page.getByLabel('Фрезеровка',{exact:true}).selectOption('Рамочная');
  assert.equal(await page.locator('#enamel-gallery figure').count(),0);
  await page.getByRole('button',{name:'Сбросить фильтры',exact:true}).click();
  await page.getByRole('button',{name:'Показать ещё примеры',exact:true}).click();
  assert.equal(await page.locator('#enamel-gallery figure').count(),8);
  const opener=page.locator('#enamel-gallery button[aria-label^="Увеличить:"]').first();
  await opener.click();await page.getByRole('dialog',{name:'Примеры кухонь в эмали',exact:true}).waitFor();
  await page.keyboard.press('Escape');assert.equal(await opener.evaluate(el=>document.activeElement===el),true);
  let s=await state();assert.deepEqual(s.comparisonIds,[]);assert.equal(s.preferredId,null);assert.equal(s.updatedAt,0);
  report.visualState={restored:s.enamelView,emptySelection:true,unchangedTTL:true,backForward:true,emptyGallery:true,lightboxFocus:true};
  const frameButtons=page.locator('#material-explorer button[data-frame-id]');assert.equal(await frameButtons.count(),4);
  for(let i=0;i<4;i++){await frameButtons.nth(i).click();assert.equal(await frameButtons.nth(i).getAttribute('aria-pressed'),'true');}
  await page.locator('#material-detail-gallery button[aria-label^="Показать фото 8:"]').click();
  await page.locator('#material-detail-gallery button[aria-label^="Открыть фото"]').click();
  await page.getByRole('dialog',{name:'Фото материала МДФ с эмалью',exact:true}).waitFor();await page.keyboard.press('Escape');
  report.preservedBlocks='4 original comparison frames, 8 original gallery photos, original lightbox PASS';
  await page.locator('#enamel-visual-page').getByRole('button',{name:'Предпочитаю этот вариант',exact:true}).first().click();
  await page.locator('#enamel-alternatives').getByRole('button',{name:'Добавить к сравнению',exact:true}).click();
  s=await state();assert.deepEqual(s.comparisonIds,['mdf-enamel','hpl']);assert.equal(s.preferredId,'mdf-enamel');
  await page.getByRole('button',{name:'Угловая кухня около 2,4 × 1,8 м',exact:true}).click();
  await page.locator('#materials-form input[name="name"]').fill('Проверка без отправки');
  await page.locator('#materials-form input[name="phone"]').fill('+375291234567');
  await page.locator('#materials-form input[name="agreement"]').check();
  let payload:any=null;
  await page.route('**/kapi/leads',async r=>{payload=r.request().postDataJSON();await r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true})});});
  await page.locator('#materials-form').getByRole('button',{name:'Рассчитать кухню',exact:true}).click();await page.getByTestId('form-success').waitFor();
  assert.deepEqual(payload.answers.materialSelection.comparisonIds,['mdf-enamel','hpl']);
  assert.equal(payload.answers.materialSelection.preferredId,'mdf-enamel');assert.equal(payload.answers.materialSelection.scenarioId,'corner-24-18');
  assert.ok(!('enamelView' in payload.answers.materialSelection));
  report.form={intercepted:true,selection:payload.answers.materialSelection,noExternalSubmission:true};
  await page.goto(base+'/materials/mdf-emal?compare=mdf-enamel,hpl,mdf-film&preferred=mdf-enamel');await ready();
  await page.getByRole('button',{name:'С акрилом',exact:true}).click();
  await page.locator('#enamel-alternatives').getByRole('button',{name:'Добавить к сравнению',exact:true}).click();
  const replacement=page.getByRole('dialog').filter({hasText:'В сравнении уже три варианта'});
  await page.getByRole('button',{name:'Отмена',exact:true}).click();assert.deepEqual((await state()).comparisonIds,['mdf-enamel','hpl','mdf-film']);
  report.fourthVariantCancel=true;
  await page.locator('#enamel-alternatives').getByRole('button',{name:'Добавить к сравнению',exact:true}).click();
  await replacement.getByRole('button',{name:'Заменить Фасады с HPL',exact:true}).click();
  assert.deepEqual((await state()).comparisonIds,['mdf-enamel','acrylic','mdf-film']);assert.equal((await state()).preferredId,'mdf-enamel');
  await page.locator('[data-testid="materials-selection"] summary').click();
  await page.locator('[data-testid="materials-selection"]').getByRole('button',{name:'Убрать',exact:true}).first().click();
  assert.equal((await state()).preferredId,null);assert.deepEqual((await state()).comparisonIds,['acrylic','mdf-film']);
  await page.locator('[data-testid="materials-selection"]').getByRole('button',{name:'Очистить сравнение материалов',exact:true}).click();assert.deepEqual((await state()).comparisonIds,[]);
  report.replaceRemoveClear=true;
  await page.goto(base+'/materials?compare=mdf-enamel,hpl&preferred=mdf-enamel#compare');await ready();
  await page.locator('#compare').getByRole('checkbox',{name:'Только отличия',exact:true}).check();
  await page.locator('#compare').locator('a[href^="/materials/mdf-emal?"]').first().click();await page.waitForURL(u=>u.pathname==='/materials/mdf-emal');await ready();
  assert.ok(new URL(page.url()).searchParams.has('returnTo'));
  await page.locator('[data-testid="materials-selection"] summary').click();
  await page.getByRole('link',{name:'Вернуться к сравнению',exact:true}).click();await page.waitForURL(u=>u.pathname==='/materials');await ready();
  assert.equal(new URL(page.url()).pathname,'/materials');assert.equal((await state()).onlyDifferences,true);
  assert.deepEqual((await state()).comparisonIds,['mdf-enamel','hpl']);assert.equal((await state()).preferredId,'mdf-enamel');
  report.comparisonReturn=true;
  await page.goto(base+'/materials/mdf-emal?compare=mdf-enamel,hpl&preferred=mdf-enamel');await ready();await loadImages();
  await page.screenshot({path:path.join(out,'mobile-full.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});await loadImages();await page.screenshot({path:path.join(out,'desktop-full.png'),fullPage:true});
  for(const name of ['corner-sage','straight-gloss','milling-samples','finish-samples']){
   assert.equal((await context.request.get(base+'/images/mdf-enamel-20261017/'+name+'.webp')).status(),200);
   assert.equal((await context.request.get(base+'/kapi/watermarked-image?src='+encodeURIComponent('/images/mdf-enamel-20261017/'+name+'.webp')+'&w=640')).status(),200);
  }
  report.newImages='4 WebP and 4 watermarked-image responses: 200';
  const video=page.video();await context.close();if(video)await video.saveAs(path.join(out,'journey.webm'));
  const navContext=await browser.newContext();await navContext.route('**/*',r=>new URL(r.request().url()).origin!==base||r.request().resourceType()==='image'?r.abort():r.continue());
  const nav=await navContext.newPage();nav.on('pageerror',e=>errors.push(e.message));
  const navReady=()=>nav.waitForFunction(()=>{const e=document.querySelector('[data-testid="materials-selection"]');return e&&!e.hasAttribute('inert');});
  const transitions=[];
  for(const from of MATERIAL_ROUTES){for(const to of MATERIAL_ROUTES.filter(r=>r!==from)){
   await nav.goto(base+from+'?compare=mdf-enamel,hpl&preferred=mdf-enamel');await navReady();
   await nav.getByRole('navigation',{name:'Другие материалы',exact:true}).locator(`a[href^="${to}?"]`).click();await nav.waitForURL(u=>u.pathname===to);await navReady();
   const n=await nav.evaluate(()=>JSON.parse(localStorage.getItem('kuhni-materials-v1')!));assert.deepEqual(n.comparisonIds,['mdf-enamel','hpl']);assert.equal(n.preferredId,'mdf-enamel');
   assert.equal(await nav.locator('h1').count(),1);assert.equal(await nav.locator('link[rel="canonical"]').getAttribute('href'),'https://kuhni.minsk.by'+to);
   transitions.push({from,to,status:'PASS'});
  }console.log('Transitions from '+from+' PASS');}
  report.transitions=transitions;assert.equal(transitions.length,42);
  const tab=await navContext.newPage();await tab.goto(base+'/materials/mdf-emal?compare=mdf-enamel,hpl&preferred=mdf-enamel');await tab.waitForFunction(()=>localStorage.getItem('kuhni-materials-v1')!==null);assert.equal((await tab.evaluate(()=>JSON.parse(localStorage.getItem('kuhni-materials-v1')!))).preferredId,'mdf-enamel');report.newTab=true;
  const noStorage=await browser.newContext();await noStorage.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Unavailable','SecurityError');}}));
  await noStorage.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  const blocked=await noStorage.newPage();blocked.on('pageerror',e=>errors.push(e.message));await blocked.goto(base+'/materials/mdf-emal?compare=mdf-enamel&preferred=mdf-enamel');await blocked.getByRole('button',{name:'Предпочитаю ✓',exact:true}).first().waitFor();await noStorage.close();report.blockedStorage=true;
  const noJS=await browser.newContext({javaScriptEnabled:false});const staticPage=await noJS.newPage();await staticPage.goto(base+'/materials/mdf-emal');assert.equal(await staticPage.locator('h1').count(),1);assert.equal(await staticPage.locator('#enamel-faq details').count(),10);assert.ok(await staticPage.locator('#enamel-construction').isVisible());await noJS.close();report.serverHTML=true;
  assert.equal(errors.length,0);report.status='PASS';console.log('Enamel browser QA PASS');
 }catch(e){report.status='FAIL';report.failure=String(e);throw e;}
 finally{await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2),'utf8');await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
