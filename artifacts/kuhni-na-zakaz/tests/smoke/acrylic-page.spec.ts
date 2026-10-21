import { test, expect, type Page } from "@playwright/test";
import { MATERIAL_ROUTES } from "../../data/material-solutions";
import { ACRYLIC_PHOTOS } from "../../data/acrylic-content";

const route = "/materials/akril";
const selected = "?compare=acrylic,hpl&preferred=acrylic";
test("comparison switches the decoded alternative image next to its controls on mobile and desktop",async({page})=>{
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:960});await page.goto(route+selected);
    await expect(page.locator('[data-testid="materials-selection"]')).not.toHaveAttribute('inert','');
    const block=page.locator('#acrylic-alternatives');
    const before=await state(page);
    for(const [label,id,file] of [['С HPL','hpl','hpl-graphite'],['С эмалью','mdf-enamel','enamel-green'],['С плёнкой','mdf-film','film-country']]){
      await block.getByRole('button',{name:label,exact:true}).click();
      const card=block.locator(`[data-comparison-material="${id}"]`);
      await expect.poll(()=>card.locator('img').evaluate((i:HTMLImageElement,expected:string)=>i.complete&&i.naturalWidth>0&&decodeURIComponent(i.currentSrc).includes(expected+'.webp'),file)).toBe(true);
      if(width===390)expect((await card.boundingBox())!.y).toBeLessThan((await block.locator('[data-comparison-material="acrylic"]').boundingBox())!.y);
      await expect(block.getByRole('status')).toContainText('Сравниваем: акрил и');
      await page.screenshot({path:`../../docs/seo/materials-comparison/stage-6/comparison-fixed-${width}-${id}.png`});
    }
    const after=await state(page);expect(after.comparisonIds).toEqual(before.comparisonIds);expect(after.preferredId).toBe(before.preferredId);expect(after.updatedAt).toBe(before.updatedAt);
  }
});
test("replacement needs confirmation and protected pages remain accessible",async({page,context})=>{
  await page.goto(route+'?compare=ldsp,mdf-film,hpl&preferred=ldsp');
  await page.locator('#acrylic-title').locator('..').getByRole('button',{name:'Добавить к сравнению',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'В сравнении уже три варианта'});await expect(dialog).toBeVisible();
  expect((await state(page)).comparisonIds).toEqual(['ldsp','mdf-film','hpl']);
  await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();expect((await state(page)).preferredId).toBe('ldsp');
  for(const path of ['/','/locations/borisov','/locations/minsk','/locations/minskaya-oblast','/design-proekt-kuhni','/materials/furnitura']){
    const response=await page.goto(path);expect(response?.status(),path).toBe(200);await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe('https://kuhni.minsk.by'+(path==='/'?'':path));
  }
  const noStorage=await context.browser()!.newContext();await noStorage.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('storage disabled');}});});
  const p=await noStorage.newPage();await p.goto(route+selected);await expect(p.locator('[data-testid="materials-selection"]')).not.toHaveAttribute('inert','');await expect(p.getByRole('button',{name:'Глянец под углом',exact:true})).toBeVisible();await p.getByRole('button',{name:'Мат и глянец',exact:true}).click();await expect(p.getByRole('button',{name:'Мат и глянец',exact:true})).toHaveAttribute('aria-pressed','true');await noStorage.close();
});
test("visual review screenshots for gallery, surface and mobile form",async({page})=>{
  for(const width of [390,1440]){
    await page.setViewportSize({width,height:960});await page.goto(route);
    for(const id of ['acrylic-surface','acrylic-gallery','acrylic-alternatives','materials-form']){
      const block=page.locator('#'+id);await block.scrollIntoViewIfNeeded();
      for(const img of await block.locator('img').all())await expect.poll(()=>img.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
      await page.screenshot({path:`../../docs/seo/materials-comparison/stage-6/${id}-${width}.png`});
    }
  }
});
const state = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("kuhni-materials-v1") || "{}"));
test.beforeEach(async ({ page }) => {
  await page.route(/mc\.yandex|google-analytics|googletagmanager|jivo|jivosite/, r => r.abort());
});
test("acrylic production page: five widths, images, metadata and existing galleries", async ({ page, request }) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  for (const width of [360,390,768,1024,1440]) {
    await page.setViewportSize({width,height:960});
    await page.goto(route);
    await expect(page.locator("h1")).toHaveText("Кухни с акриловыми фасадами на заказ");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://kuhni.minsk.by/materials/akril");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const hero=page.locator('#acrylic-title').locator('..').locator('..').locator('figure img');
    await expect.poll(() => hero.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    await expect.poll(async () => (await state(page)).comparisonIds).toEqual([]);
    if (width===390 || width===1440) await page.screenshot({path:`../../docs/seo/materials-comparison/stage-6/hero-${width}.png`});
    expect(await page.locator('#acrylic-visual-page figure').evaluateAll(figures => figures.filter(f => {const c=f.querySelector('figcaption'); return c && getComputedStyle(c).position!=='absolute' && c.getBoundingClientRect().bottom>f.getBoundingClientRect().bottom+1;}).length)).toBe(0);
  }
  for(const p of ACRYLIC_PHOTOS) {
    expect((await request.get(p.src)).status()).toBe(200);
    const marked=await request.get('/kapi/watermarked-image?src='+encodeURIComponent(p.src)+'&w=720');
    expect(marked.status(),p.src).toBe(200); expect(marked.headers()['content-type']).toContain('image/webp');
  }
  await page.getByText('Ещё ракурсы: фасад спереди, под углом и в интерьере',{exact:true}).click();
  await expect(page.locator('#material-explorer')).toBeVisible();
  await page.getByText('Прежняя подборка кухонь и крупных планов',{exact:true}).click();
  await expect(page.locator('#material-detail-gallery')).toBeVisible();
  await page.locator('#acrylic-gallery').scrollIntoViewIfNeeded();
  for(const img of await page.locator('#acrylic-gallery img').all()) await expect.poll(() => img.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
  expect(errors).toEqual([]);
});
test("acrylic visual changes, filtering, modal focus and history preserve explicit selection", async ({page,context})=>{
  await page.goto(route+selected);
  await expect(page.locator('[data-testid="materials-selection"]')).not.toHaveAttribute('inert','');
  await page.getByRole('button',{name:'Торец крупным планом',exact:true}).click();
  await expect(page.getByRole('button',{name:'Торец крупным планом',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.goBack(); await expect(page.getByRole('button',{name:'Глянец под углом',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.goForward(); await expect(page.getByRole('button',{name:'Торец крупным планом',exact:true})).toHaveAttribute('aria-pressed','true');
  const before=await state(page);
  const gallery=page.locator('#acrylic-gallery');
  await gallery.getByLabel('Цвет примера').selectOption('Цветные');
  await expect(gallery.getByRole('status')).toHaveText('Найдено примеров: 1');
  const opener=gallery.getByRole('button',{name:/Увеличить:/}); await opener.click();
  await expect(page.getByRole('dialog',{name:'Примеры акриловых кухонь'})).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible(); await expect(opener).toBeFocused();
  await page.reload(); await expect(gallery.getByLabel('Цвет примера')).toHaveValue('Цветные');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await gallery.getByLabel('Планировка примера').selectOption('С островом');
  await expect(gallery.getByRole('status')).toHaveText('Найдено примеров: 0');
  await gallery.getByRole('button',{name:'Сбросить фильтры'}).click(); await expect(gallery.getByRole('status')).toHaveText('Найдено примеров: 10');
  await gallery.getByRole('button',{name:'Показать ещё примеры'}).click(); await expect(gallery.locator('figure')).toHaveCount(10);
  for(const [label,file] of [['Глянец под углом','gloss-side-light'],['Мат и глянец','matte-sample'],['Торец крупным планом','edge-macro']]){
    await page.getByRole('button',{name:label,exact:true}).click(); const image=page.locator('#acrylic-surface img');
    await expect.poll(()=>image.evaluate((i:HTMLImageElement,f:string)=>i.complete&&i.naturalWidth>0&&decodeURIComponent(i.currentSrc).includes(f+'.webp'),file)).toBe(true);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [label,file] of [['Квартира и новостройка','straight-grey'],['Дом и кухня-гостиная','graphite-island'],['Дача и деревенский дом','cream-country']]){
    await page.locator('#acrylic-rooms').getByRole('button',{name:label,exact:true}).click();
    await expect.poll(()=>page.locator('#acrylic-rooms img').evaluate((i:HTMLImageElement,f:string)=>i.complete&&i.naturalWidth>0&&decodeURIComponent(i.currentSrc).includes(f+'.webp'),file)).toBe(true);
  }
  const after=await state(page); expect(after.comparisonIds).toEqual(['acrylic','hpl']); expect(after.preferredId).toBe('acrylic'); expect(after.updatedAt).toBe(before.updatedAt);
  const tab=await context.newPage();await tab.goto(route);await expect.poll(async()=>(await state(tab)).preferredId).toBe('acrylic');await tab.close();
});
test("all 42 material transitions retain acrylic selection and preference",async({page})=>{
  for(const from of MATERIAL_ROUTES) for(const to of MATERIAL_ROUTES.filter(x=>x!==from)) {
    await page.goto(from+selected);
    const nav=page.getByRole('navigation',{name:'Другие материалы'});await expect(nav).not.toHaveAttribute('inert','');
    const target=nav.locator('a').filter({hasText: /.*/});
    const href=await target.evaluateAll((links,destination)=>links.map(l=>l.getAttribute('href')||'').find(h=>h.split('?')[0]===destination),to);
    expect(href).toBeTruthy();await nav.locator(`a[href="${href}"]`).click();
    await expect.poll(()=>page.evaluate(()=>location.pathname)).toBe(to);
    await expect.poll(async()=>(await state(page)).preferredId).toBe('acrylic');expect((await state(page)).comparisonIds).toEqual(['acrylic','hpl']);
    await expect(page.locator('h1')).toHaveCount(1);
  }
});
test("acrylic lead serializes explicit selection and scenario only",async({page})=>{
  let payload:Record<string,any>|undefined;
  await page.route('**/kapi/leads',async intercepted=>{
    const req=intercepted.request();
    if((req.headers()['content-type']||'').includes('application/json'))payload=req.postDataJSON();
    else {const fields=Object.fromEntries(Array.from((req.postData()||'').matchAll(/name="([^"]+)"\r\n\r\n([^]*?)(?=\r\n--)/g)).map(m=>[m[1],m[2]]));payload={...fields,answers:JSON.parse(fields.answers||'{}')};}
    await intercepted.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,success:true,leadId:'local-acrylic-test'})});
  });
  await page.goto(route+selected);await page.locator('#acrylic-price').getByRole('button').nth(1).click();
  const form=page.locator('#form form');await form.locator('[name="name"]').fill('Локальная проверка акрила');await form.locator('[name="phone"]').fill('+375291234567');await form.locator('[name="agreement"]').check();await form.getByRole('button',{name:'Рассчитать кухню',exact:true}).click();
  await expect.poll(()=>Boolean(payload)).toBe(true);const material=payload!.answers.materialSelection;
  expect(material.comparisonIds).toEqual(['acrylic','hpl']);expect(material.preferredId).toBe('acrylic');expect(material.scenarioId).toBe('corner-24-18');expect(JSON.stringify(material)).not.toMatch(/acrylicView|recentViews|acrylic-edge-macro/);
});
