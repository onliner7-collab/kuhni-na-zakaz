import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';

async function main(){
 const base=process.env.PROFILE_QA_URL||'http://127.0.0.1:3037';
 const phase=process.env.PROFILE_QA_PHASE||'local';
 const out=path.resolve('../../docs/seo/materials-comparison/stage-4/profile-fix',phase);await fs.mkdir(out,{recursive:true});
 const browser=await chromium.launch({headless:true});const errors:string[]=[];const results:any[]=[];
 const report:any={base,phase,date:'2026-10-17',results,errors};
 try{
  for(const reducedMotion of ['reduce','no-preference'] as const){
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion});
   await context.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
   const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/materials/mdf-emal?compare=ldsp,hpl&preferred=ldsp#enamel-profiles');
   await page.waitForFunction(()=>!document.querySelector('[data-testid="materials-selection"]')?.hasAttribute('inert'));
   const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('kuhni-materials-v1')!));const initial=await state();
   for(const width of [360,390,412,768,1440]){
    await page.setViewportSize({width,height:900});const hashes=[];const sources=[];
    for(const [index,label,file] of [[0,'Гладкий фасад','profile-smooth'],[1,'Тонкая рамка','profile-thin-frame'],[2,'Выраженная рамка','profile-deep-frame']] as const){
     const block=page.locator('#enamel-profiles');await block.getByRole('button',{name:label,exact:true}).click();
     const img=block.locator('img');await img.waitFor();await page.waitForFunction((file)=>{const i=document.querySelector('#enamel-profiles img') as HTMLImageElement;return i?.currentSrc.includes(file)&&i.complete&&i.naturalWidth>0;},file);
     assert.equal(await block.getByRole('button',{name:label,exact:true}).getAttribute('aria-pressed'),'true');
     const src=await img.getAttribute('src');assert.ok(src?.includes(file));sources.push(src);
     const pixels=await img.screenshot();hashes.push(createHash('sha256').update(pixels).digest('hex'));
     if(width===390||width===1440)await block.screenshot({path:path.join(out,`${reducedMotion}-${width}-${index}.png`)});
     assert.equal((await state()).enamelView.profile,index);
    }
    assert.equal(new Set(sources).size,3,'Each button must load a different file');assert.equal(new Set(hashes).size,3,'Visible photos must differ');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    results.push({reducedMotion,width,distinctSources:3,distinctRenderedPhotos:3});
   }
   await page.reload();await page.waitForFunction(()=>document.querySelector('#enamel-profiles img')?.getAttribute('src')?.includes('profile-deep-frame'));
   await page.locator('#enamel-profiles').getByRole('button',{name:'Гладкий фасад',exact:true}).click();
   await page.locator('#enamel-profiles').getByRole('button',{name:'Тонкая рамка',exact:true}).click();
   await page.goBack();await page.waitForFunction(()=>document.querySelector('#enamel-profiles img')?.getAttribute('src')?.includes('profile-smooth'));
   await page.goForward();await page.waitForFunction(()=>document.querySelector('#enamel-profiles img')?.getAttribute('src')?.includes('profile-thin-frame'));
   const final=await state();assert.deepEqual(final.comparisonIds,['ldsp','hpl']);assert.equal(final.preferredId,'ldsp');assert.equal(final.updatedAt,initial.updatedAt);
   if(reducedMotion==='reduce')for(const file of ['profile-smooth','profile-thin-frame','profile-deep-frame']){
    const src='/images/mdf-enamel-20261017/'+file+'.webp';assert.equal((await context.request.get(base+src)).status(),200);assert.equal((await context.request.get(base+'/kapi/watermarked-image?src='+encodeURIComponent(src)+'&w=640')).status(),200);
   }
   await context.close();
  }
  assert.deepEqual(errors,[]);report.status='PASS';report.refreshBackForward=true;report.selectionAndTTLUnchanged=true;console.log('Profile fix QA PASS: 5 widths × 2 motion modes × 3 distinct photos');
 }catch(e){report.status='FAIL';report.failure=String(e);throw e;}
 finally{await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2),'utf8');await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
