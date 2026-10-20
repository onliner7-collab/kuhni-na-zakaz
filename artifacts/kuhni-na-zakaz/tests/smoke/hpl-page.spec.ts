import { test, expect, type Page } from "@playwright/test";
import { MATERIAL_ROUTES } from "../../data/material-solutions";
import { HPL_PHOTOS } from "../../data/hpl-content";

const route="/materials/plastik-hpl";
const selected="?compare=hpl,acrylic&preferred=hpl";
const errors:string[]=[];
async function state(page:Page){return page.evaluate(()=>JSON.parse(localStorage.getItem("kuhni-materials-v1")||"{}"));}
test.beforeEach(async({page})=>{
  errors.length=0;
  page.on("pageerror",e=>errors.push(e.message));
  await page.route(/https:\/\/(mc\.yandex\.|www\.googletagmanager|.*google-analytics)/,r=>r.abort());
});
test.afterEach(()=>expect(errors).toEqual([]));

test("HPL page renders at five widths with intact optimized images and metadata",async({page,request})=>{
  for(const width of [360,390,768,1024,1440]){
    await page.setViewportSize({width,height:960});
    await page.goto(route);
    await expect(page.locator("h1")).toHaveText("Кухни с фасадами HPL на заказ");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href","https://kuhni.minsk.by/materials/plastik-hpl");
    await expect(page.locator("#hpl-visual-page")).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    const escapedCaptions=await page.locator('#hpl-visual-page figure').evaluateAll(figures=>figures.filter(f=>{const c=f.querySelector('figcaption');return c&&getComputedStyle(c).position!=='absolute'&&c.getBoundingClientRect().bottom>f.getBoundingClientRect().bottom+1;}).length);
    expect(escapedCaptions,`Подписи не выходят из блока при ширине ${width}`).toBe(0);
    await expect.poll(()=>page.locator("#hpl-title").evaluate(el=>{const img=el.closest('section')!.querySelector('img')!;return img.complete&&img.naturalWidth>0;})).toBe(true);
    const hplState=await state(page);
    expect(hplState.comparisonIds).toEqual([]);
    expect(hplState.preferredId).toBeNull();
    if(width===390||width===1440)await page.screenshot({path:`../../docs/seo/materials-comparison/stage-5/hero-${width}.png`});
  }
  for(const p of HPL_PHOTOS.slice(0,8)){
    const response=await request.get(p.src);expect(response.status(),p.src).toBe(200);
    const marked=await request.get('/kapi/watermarked-image?src='+encodeURIComponent(p.src)+'&w=720');expect(marked.status(),p.src).toBe(200);
    expect(marked.headers()['content-type']).toContain('image/webp');
  }
  await page.locator('#hpl-gallery').scrollIntoViewIfNeeded();
  for(const img of await page.locator('#hpl-gallery img').all())await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
  await page.screenshot({path:'../../docs/seo/materials-comparison/stage-5/gallery-desktop.png'});
});

test("HPL views, gallery, Back and refresh restore without changing explicit selection",async({page,context})=>{
  await page.goto(route+selected);
  await page.getByRole('button',{name:'Основание ДСП',exact:true}).click();
  await expect(page.getByRole('button',{name:'Основание ДСП',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.goBack();
  await expect(page.getByRole('button',{name:'Основание МДФ',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.goForward();
  await expect(page.getByRole('button',{name:'Основание ДСП',exact:true})).toHaveAttribute('aria-pressed','true');
  const before=await state(page);
  const gallery=page.locator('#hpl-gallery');
  await gallery.getByRole('combobox').nth(0).selectOption('Древесные');
  await expect(gallery.getByRole('status')).toHaveText('Найдено примеров: 1');
  await gallery.getByRole('button',{name:/Увеличить:/}).click();
  await expect(page.getByRole('dialog',{name:'Примеры кухонь с HPL и деталей фасада'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(gallery.getByRole('button',{name:/Увеличить:/})).toBeFocused();
  await page.reload();
  await expect(gallery.getByRole('combobox').nth(0)).toHaveValue('Древесные');
  await expect(page.getByRole('button',{name:'Основание ДСП',exact:true})).toHaveAttribute('aria-pressed','true');
  const after=await state(page);
  expect(after.comparisonIds).toEqual(['hpl','acrylic']);expect(after.preferredId).toBe('hpl');expect(after.updatedAt).toBe(before.updatedAt);
  await gallery.getByRole('combobox').nth(2).selectOption('Угловая');
  await expect(gallery.getByRole('status')).toHaveText('Найдено примеров: 0');
  await gallery.getByRole('button',{name:'Сбросить фильтры'}).click();
  await expect(gallery.getByRole('status')).toHaveText('Найдено примеров: 12');
  const newTab=await context.newPage();await newTab.goto(route+selected);await expect.poll(async()=> (await state(newTab)).preferredId).toBe('hpl');await newTab.close();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button',{name:'Глянцевая поверхность',exact:true}).click();
  await expect(page.getByRole('button',{name:'Глянцевая поверхность',exact:true})).toHaveAttribute('aria-pressed','true');
});

test("all 42 material navigation transitions retain comparison and preference",async({page})=>{
  let transitions=0;
  for(const from of MATERIAL_ROUTES){
    for(const to of MATERIAL_ROUTES.filter(p=>p!==from)){
      await page.goto(from+selected);
      const nav=page.getByRole('navigation',{name:'Другие материалы'});
      await expect(nav).not.toHaveAttribute('inert','');
      const href=await nav.locator('a').evaluateAll((links,destination)=>links.map(l=>l.getAttribute('href')||'').find(h=>h.split('?')[0]===destination),to);
      expect(href).toBeTruthy();
      await nav.locator(`a[href="${href}"]`).click();
      await expect(page).toHaveURL(new RegExp(to.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\?'));
      await expect.poll(async()=> (await state(page)).preferredId).toBe('hpl');
      expect((await state(page)).comparisonIds).toEqual(['hpl','acrylic']);
      await expect(page.locator('h1')).toHaveCount(1);
      transitions++;
    }
  }
  expect(transitions).toBe(42);
});

test("each room, alternative, finish and price scenario displays its own decoded photo",async({page})=>{
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:960});
    await page.goto(route+selected);
    await expect(page.locator('[data-testid="materials-selection"]')).not.toHaveAttribute('inert','');
    for(const [label,file] of [['Квартира и новостройка','straight-sage'],['Дом и кухня-гостиная','graphite-island'],['Дача и деревенский дом','wood-country']]){
      await page.locator('#hpl-rooms').getByRole('button',{name:label,exact:true}).click();
      const photo=page.locator('#hpl-rooms img');
      await expect.poll(()=>photo.evaluate((i:HTMLImageElement)=>new URL(i.src).pathname)).toBe(`/images/hpl-20261020/${file}.webp`);
      await expect.poll(()=>photo.evaluate((i:HTMLImageElement, expected:string)=>i.complete&&i.naturalWidth>0&&i.currentSrc.includes(expected+'.webp'),file)).toBe(true);
    }
    for(const [label,id,file] of [['С акрилом','acrylic','acrylic-grey'],['С эмалью','mdf-enamel','enamel-green'],['С ЛДСП','ldsp','ldsp-home']]){
      await page.locator('#hpl-alternatives').getByRole('button',{name:label,exact:true}).click();
      const card=page.locator(`[data-comparison-material="${id}"]`);const photo=card.locator('img');
      await expect.poll(()=>photo.evaluate((i:HTMLImageElement)=>new URL(i.src).pathname)).toBe(`/images/materials-hub-20261014/${file}.webp`);
      await expect.poll(()=>photo.evaluate((i:HTMLImageElement, expected:string)=>i.complete&&i.naturalWidth>0&&i.currentSrc.includes(expected+'.webp'),file)).toBe(true);
      if(width===390)expect((await card.boundingBox())!.y).toBeLessThan((await page.locator('[data-comparison-material="hpl"]').boundingBox())!.y);
    }
    for(const [index,file] of [[0,'straight-sage'],[1,'hero-beige']] as const){
      await page.locator('#hpl-price').getByRole('button').nth(index).click();const photo=page.locator('#hpl-price img');
      await expect.poll(()=>photo.evaluate((i:HTMLImageElement)=>new URL(i.src).pathname)).toBe(`/images/hpl-20261020/${file}.webp`);
      await expect.poll(()=>photo.evaluate((i:HTMLImageElement, expected:string)=>i.complete&&i.naturalWidth>0&&i.currentSrc.includes(expected+'.webp'),file)).toBe(true);
    }
    for(const [label,file] of [['Матовая поверхность','straight-sage'],['Глянцевая поверхность','gloss-white']]){
      await page.locator('#hpl-finish').getByRole('button',{name:label,exact:true}).click();const photo=page.locator('#hpl-finish img');
      await expect.poll(()=>photo.evaluate((i:HTMLImageElement)=>new URL(i.src).pathname)).toBe(`/images/hpl-20261020/${file}.webp`);
      await expect.poll(()=>photo.evaluate((i:HTMLImageElement, expected:string)=>i.complete&&i.naturalWidth>0&&i.currentSrc.includes(expected+'.webp'),file)).toBe(true);
    }
  }
});

test("lead contains explicit HPL selection and scenario but no view or history",async({page})=>{
  let payload:Record<string,any>|undefined;
  await page.route('**/kapi/leads',async intercepted=>{
    const req=intercepted.request();
    const type=req.headers()['content-type']||'';
    if(type.includes('application/json'))payload=req.postDataJSON();
    else {
      const body=req.postData()||'';
      const fields=Object.fromEntries(Array.from(body.matchAll(/name="([^"]+)"\r\n\r\n([^]*?)(?=\r\n--)/g)).map(m=>[m[1],m[2]]));
      payload={...fields,answers:JSON.parse(fields.answers||'{}')};
    }
    await intercepted.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,success:true,leadId:'local-hpl-test'})});
  });
  await page.goto(route+selected);
  const price=page.locator('#hpl-price');await price.getByRole('button').nth(1).click();
  await page.getByRole('button',{name:'Основание ДСП',exact:true}).click();
  const form=page.locator('#form form');
  await form.locator('[name="name"]').fill('Локальная проверка HPL');
  await form.locator('[name="phone"]').fill('+375291234567');
  await form.locator('[name="agreement"]').check();
  await form.getByRole('button',{name:'Рассчитать кухню',exact:true}).click();
  await expect.poll(()=>Boolean(payload)).toBe(true);
  const answers=payload!.answers;
  const material=answers.materialSelection;
  expect(material.comparisonIds).toEqual(['hpl','acrylic']);expect(material.preferredId).toBe('hpl');expect(material.scenarioId).toBe('corner-24-18');
  expect(JSON.stringify(material)).not.toMatch(/hplView|recentViews|Древесные|hpl-wood-country/);
});
