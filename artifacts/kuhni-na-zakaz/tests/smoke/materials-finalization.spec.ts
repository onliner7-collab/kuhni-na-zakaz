import { test, expect, type Page } from "@playwright/test";
import { MATERIAL_ROUTES } from "../../data/material-solutions";
import { VENEER_PHOTOS } from "../../data/veneer-content";
import { MATERIAL_MARKET_OFFERS } from "../../data/material-pricing";
const route = "/materials/shpon";
const selection = "?compare=veneer,ldsp&preferred=veneer";
const state = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("kuhni-materials-v1") || "{}"));

test('all seven pages at five widths: no overflow, one Dock, loaded visible images and shared price evidence', async ({page,request})=>{
  test.setTimeout(240000);
  for(const width of [360,390,768,1024,1440]) for(const path of MATERIAL_ROUTES){
    await page.setViewportSize({width,height:960});
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByTestId('mobile-bottom-nav')).toHaveCount(1);
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    const evidence=page.locator('#market-prices');await evidence.scrollIntoViewIfNeeded();
    await expect(evidence.locator('time')).toHaveAttribute('datetime','2026-10-26');
    await expect(evidence).toContainText('В расчёт включены замер');
    if(width===390 || width===1440){
      for(const image of await page.locator('main img, #veneer-visual-page img, #mdf-visual-page img, #ldsp-visual-page img, #enamel-visual-page img, #hpl-visual-page img, #acrylic-visual-page img').all()){
        if(!await image.isVisible())continue;
        await image.scrollIntoViewIfNeeded();
        await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
      }
      await evidence.scrollIntoViewIfNeeded();
      await page.screenshot({path:`../../docs/seo/materials-comparison/finalization-2026-10-26/browser/${path.split('/').pop()}-prices-${width}.png`});
    }
  }
  const hub=await request.get('/materials');const html=await hub.text();
  for(const offer of MATERIAL_MARKET_OFFERS.filter(o=>o.publicExample&&o.materialConfirmed)){
    expect(html).toContain(`data-offer-id="${offer.id}"`);
    const paths:Record<string,string>={ldsp:'ldsp','mdf-film':'mdf-fasady','mdf-enamel':'mdf-emal',hpl:'plastik-hpl',acrylic:'akril',veneer:'shpon'};
    const detail=await request.get('/materials/'+paths[offer.materialId]);
    expect(await detail.text()).toContain(`data-offer-id="${offer.id}"`);
  }
});

test('URL wins over saved choice; preferred removal and clearing keep city/style/layout',async({page})=>{
  await page.goto('/materials?compare=ldsp,mdf-film&preferred=ldsp');
  await expect(page.getByTestId('materials-selection')).not.toHaveAttribute('inert','');
  await page.evaluate(()=>sessionStorage.setItem('kuhni-explore-context-v2',JSON.stringify({version:2,value:{layout:'corner',style:'modern',location:'minsk',sourceRoute:'/materials',lastMeaningfulAction:'selection'}})));
  await page.goto('/materials?compare=acrylic,veneer');
  await expect.poll(async()=> (await state(page)).comparisonIds).toEqual(['acrylic','veneer']);
  expect((await state(page)).preferredId).toBeNull();
  await page.goto('/materials?compare=ldsp,veneer&preferred=ldsp#compare');
  await page.locator('#compare').getByRole('button',{name:'Убрать из сравнения Фасады ЛДСП',exact:true}).click();
  await expect.poll(async()=> (await state(page)).preferredId).toBeNull();
  await page.reload();expect((await state(page)).comparisonIds).toEqual(['veneer']);
  const panel=page.getByTestId('materials-selection');
  await panel.locator('details > summary').first().click();
  await panel.getByRole('button',{name:'Очистить сравнение материалов',exact:true}).click();
  await expect.poll(async()=> (await state(page)).comparisonIds).toEqual([]);
  const context=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('kuhni-explore-context-v2')||'{}'));
  expect(context.value.location).toBe('minsk');expect(context.value.style).toBe('modern');expect(context.value.layout).toBe('corner');
  await page.reload();expect((await state(page)).comparisonIds).toEqual([]);
});

test('failed form keeps contacts and selection; client navigation restores the draft; analytics has no contacts',async({page})=>{
  let payload:any;let attempt=0;
  await page.route('**/kapi/leads',async r=>{attempt++;payload=r.request().postDataJSON();await r.fulfill({status:attempt===1?500:200,contentType:'application/json',body:JSON.stringify(attempt===1?{error:'Проверка ошибки'}:{ok:true,id:999,publicNumber:999})});});
  await page.goto('/materials/mdf-emal?compare=mdf-enamel,ldsp&preferred=ldsp');
  const form=page.locator('#form form');
  await form.locator('[name="name"]').fill('ТЕСТ ЧЕРНОВИКА');await form.locator('[name="phone"]').fill('+375291234567');await form.locator('[name="agreement"]').check();
  await form.getByRole('button',{name:'Рассчитать кухню',exact:true}).click();
  await expect.poll(()=>attempt).toBe(1);await expect(form.locator('[name="name"]')).toHaveValue('ТЕСТ ЧЕРНОВИКА');
  await page.getByRole('navigation',{name:'Другие материалы',exact:true}).getByRole('link',{name:'Фасады ЛДСП',exact:true}).click();
  await expect(page).toHaveURL(/\/materials\/ldsp(?:\?|$)/);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Кухни из ЛДСП на заказ');
  const next=page.locator('#form form');await expect(next.locator('[name="name"]')).toHaveValue('ТЕСТ ЧЕРНОВИКА');
  await next.getByRole('button',{name:'Рассчитать кухню',exact:true}).click();await expect.poll(()=>attempt).toBe(2);
  expect(payload.answers.materialSelection.comparisonIds).toEqual(['mdf-enamel','ldsp']);expect(payload.answers.materialSelection.preferredId).toBe('ldsp');
  expect(payload.sourcePage).toBe('/materials/ldsp');expect(payload.sourceType).toBe('material');
  expect(JSON.stringify(payload.answers.materialSelection)).not.toMatch(/recentViews|View|ТЕСТ/);
  expect(page.url()).not.toMatch(/ТЕСТ|375291234567|name=/);
  expect(await page.evaluate(()=>JSON.stringify(window.dataLayer||[]))).not.toMatch(/ТЕСТ ЧЕРНОВИКА|375291234567/);
  expect((await state(page)).comparisonIds).toEqual(['mdf-enamel','ldsp']);
});
test.beforeEach(async ({ page }) => { await page.route("**/kapi/leads", r => r.abort("blockedbyclient")); await page.route(/mc\.yandex|google-analytics|googletagmanager|jivo|jivosite/, r => r.abort()); });

test("veneer page: responsive images, metadata, existing galleries and watermarked covers", async ({ page, request }) => {
  test.setTimeout(120000);
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 960 }); await page.goto(route);
    await expect(page.locator("h1")).toHaveText("Кухни с фасадами из натурального шпона на заказ");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://kuhni.minsk.by/materials/shpon");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await expect(page.getByTestId("materials-selection")).not.toHaveAttribute("inert", "");
    expect((await state(page)).comparisonIds).toEqual([]);
    if (width === 390 || width === 1440) {
      for (const id of ["veneer-title", "veneer-surface", "veneer-gallery", "veneer-alternatives", "materials-form"]) {
        const block = page.locator("#" + id); await block.scrollIntoViewIfNeeded();
        const images = id === "veneer-title" ? page.locator('#veneer-visual-page > div > section').first().locator('img') : block.locator('img');
        for (const img of await images.all()) await expect.poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
        await page.screenshot({ path: `../../docs/seo/materials-comparison/finalization-2026-10-26/browser/${id}-${width}.png` });
      }
    }
  }
  for (const p of VENEER_PHOTOS) {
    expect((await request.get(p.src)).status()).toBe(200);
    const marked = await request.get('/kapi/watermarked-image?src=' + encodeURIComponent(p.src) + '&w=720');
    expect(marked.status(), p.src).toBe(200); expect(marked.headers()['content-type']).toContain('image/webp');
  }
  await page.getByText('Ещё ракурсы: фасад спереди, под углом и в интерьере', { exact: true }).click();
  await expect(page.locator('#material-explorer')).toBeVisible();
  await page.getByText('Прежняя подборка кухонь и крупных планов', { exact: true }).click();
  await expect(page.locator('#material-detail-gallery')).toBeVisible();
  expect(errors).toEqual([]);
});

test("viewing, filters, modal, Back, refresh and new tab preserve explicit choice", async ({ page, context }) => {
  await page.goto(route + selection); await expect(page.getByTestId('materials-selection')).not.toHaveAttribute('inert', '');
  const before = await state(page);
  await page.getByRole('button', { name: 'Отделка и оттенок', exact: true }).click();
  await expect(page.locator('#veneer-surface img')).toHaveAttribute('src', /finish-samples.webp/);
  await page.goBack(); await expect(page.getByRole('button', { name: 'Рисунок и торец', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goForward(); await expect(page.getByRole('button', { name: 'Отделка и оттенок', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Шпон и графит', exact: true }).click();
  const gallery = page.locator('#veneer-gallery'); await gallery.getByLabel('Планировка примера').selectOption('Деталь');
  await expect(gallery.getByRole('status')).toHaveText('Найдено примеров: 2');
  const opener = gallery.getByRole('button', { name: /Увеличить:/ }).first(); await opener.click();
  await expect(page.getByRole('dialog', { name: 'Примеры кухонь со шпоном' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(opener).toBeFocused();
  await page.reload(); await expect(gallery.getByLabel('Планировка примера')).toHaveValue('Деталь');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  for (const label of ['С ЛДСП под дерево', 'С плёнкой', 'С эмалью']) await page.locator('#veneer-alternatives').getByRole('button', { name: label, exact: true }).click();
  const after = await state(page); expect(after.comparisonIds).toEqual(before.comparisonIds); expect(after.preferredId).toBe(before.preferredId); expect(after.updatedAt).toBe(before.updatedAt);
  const another = await context.newPage(); await another.goto(route); await expect(another.getByTestId('materials-selection')).not.toHaveAttribute('inert', '');
  expect((await state(another)).comparisonIds).toEqual(['veneer', 'ldsp']); await another.close();
});

test("all 42 directed material links preserve choice and canonical URLs", async ({ page }) => {
  test.setTimeout(180000);
  let checked = 0;
  for (const from of MATERIAL_ROUTES) for (const to of MATERIAL_ROUTES.filter(r => r !== from)) {
    await page.goto(from + selection); const nav = page.getByRole('navigation', { name: 'Другие материалы', exact: true });
    await expect(nav).not.toHaveAttribute('inert', '');
    const link = nav.locator('a').filter({ hasText: /./ });
    const hrefs = await link.evaluateAll(as => as.map(a => a.getAttribute('href')));
    const href = hrefs.find(h => h && new URL(h, 'https://internal.test').pathname === to)!;
    expect(href, from + ' → ' + to).toBeTruthy();
    await nav.locator(`a[href="${href}"]`).click();
    await expect.poll(() => page.evaluate(() => location.pathname)).toBe(to);
    await expect.poll(async () => (await state(page)).preferredId).toBe('veneer');
    expect((await state(page)).comparisonIds).toEqual(['veneer', 'ldsp']);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://kuhni.minsk.by' + to);
    checked++;
  }
  expect(checked).toBe(42);
});

test("fourth material is confirmed and URL clearing survives refresh", async ({ page }) => {
  await page.goto(route + '?compare=ldsp,mdf-film,hpl&preferred=ldsp');
  await expect(page.getByTestId('materials-selection')).not.toHaveAttribute('inert', '');
  const hero = page.locator('#veneer-visual-page > div > section').first();
  await hero.getByRole('button', { name: 'Добавить к сравнению', exact: true }).filter({visible:true}).click();
  const dialog = page.getByRole('dialog', { name: 'В сравнении уже три варианта' }); await expect(dialog).toBeVisible();
  expect((await state(page)).comparisonIds).toEqual(['ldsp', 'mdf-film', 'hpl']);
  await page.keyboard.press('Escape'); expect((await state(page)).preferredId).toBe('ldsp');
  await hero.getByRole('button', { name: 'Предпочитаю этот вариант', exact: true }).filter({visible:true}).click();
  await dialog.getByRole('button', { name: 'Заменить Фасады ЛДСП', exact: true }).click();
  await expect.poll(async () => (await state(page)).preferredId).toBe('veneer');
  expect((await state(page)).comparisonIds).toEqual(['veneer', 'mdf-film', 'hpl']);
  await page.goto(route + '?compare='); await page.reload();
  await expect.poll(async () => (await state(page)).comparisonIds).toEqual([]);
});

test("lead includes selected IDs and scenario, excludes browsing and sends no real lead", async ({ page }) => {
  let payload: Record<string, any> | undefined;
  await page.route('**/kapi/leads', async r => {
    const req = r.request();
    if ((req.headers()['content-type'] || '').includes('application/json')) payload = req.postDataJSON();
    else { const fields = Object.fromEntries(Array.from((req.postData() || '').matchAll(/name="([^"]+)"\r\n\r\n([^]*?)(?=\r\n--)/g)).map(m => [m[1], m[2]])); payload = { ...fields, answers: JSON.parse(fields.answers || '{}') }; }
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, success: true, leadId: 'local-veneer-test' }) });
  });
  await page.goto(route + selection); await page.locator('#veneer-price').getByRole('button').nth(1).click();
  const form = page.locator('#form form'); await form.locator('[name="name"]').fill('Локальная проверка шпона'); await form.locator('[name="phone"]').fill('+375291234567'); await form.locator('[name="agreement"]').check(); await form.getByRole('button', { name: 'Рассчитать кухню', exact: true }).click();
  await expect.poll(() => Boolean(payload)).toBe(true); const material = payload!.answers.materialSelection;
  expect(material.comparisonIds).toEqual(['veneer', 'ldsp']); expect(material.preferredId).toBe('veneer'); expect(material.scenarioId).toBe('corner-24-18'); expect(JSON.stringify(material)).not.toMatch(/veneerView|recentViews|veneer-grain-edge/);
});

test("blocked storage and reduced motion keep controls usable", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('storage disabled'); } }); });
  const p = await context.newPage(); await p.goto((process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3046') + route + selection);
  await expect(p.getByTestId('materials-selection')).not.toHaveAttribute('inert', '');
  await p.getByRole('button', { name: 'Отделка и оттенок', exact: true }).click(); await expect(p.getByRole('button', { name: 'Отделка и оттенок', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await context.close();
});

test("comparison return, copied URL, gallery filter and recent photos restore", async ({ page, context }) => {
  await page.goto('/materials' + selection + '#compare');
  await page.locator('#compare').getByRole('link',{name:'Источники и состав',exact:true}).first().click();
  await expect(page.locator('#market-prices-title')).toBeInViewport();
  const headingBox=await page.locator('#market-prices-title').boundingBox();
  const headerBox=await page.locator('header').first().boundingBox();
  expect(headingBox!.y).toBeGreaterThanOrEqual(headerBox!.y+headerBox!.height);
  await page.goBack();
  const block=page.locator('#compare'); await block.getByLabel('Только отличия').check();
  await block.getByRole('button',{name:'Скопировать ссылку на сравнение',exact:true}).click();
  const portable=await block.getByLabel('Ссылка на ваше сравнение').inputValue();
  expect(portable).toContain('compare=veneer%2Cldsp'); expect(portable).toContain('preferred=veneer'); expect(portable).not.toMatch(/recent|phone|name=/);
  await block.locator('a[href^="/materials/shpon?"]').click();
  await expect(page).toHaveURL(/\/materials\/shpon\?.*returnTo=/);
  await page.getByTestId('materials-selection').getByText('Ещё',{exact:true}).click();
  await page.getByRole('link',{name:'Вернуться к сравнению',exact:true}).click();
  await expect(page.locator('#compare').getByLabel('Только отличия')).toBeChecked();
  const gallery=page.locator('#gallery'); await gallery.getByLabel('Фильтр: материал',{exact:true}).selectOption('veneer');
  await page.getByRole('navigation',{name:'Другие материалы',exact:true}).getByRole('link',{name:'Шпонированные фасады',exact:true}).click();
  await page.locator('#veneer-gallery').getByRole('button',{name:/Увеличить:/}).first().click(); await page.keyboard.press('Escape');
  await page.getByTestId('materials-selection').getByRole('link',{name:'Все материалы',exact:true}).click();
  await expect(page.locator('#gallery').getByLabel('Фильтр: материал',{exact:true})).toHaveValue('veneer');
  expect((await state(page)).recentViews.some((x:string)=>x.startsWith('veneer-'))).toBe(true);
  const tab=await context.newPage(); await tab.goto(portable); await expect(tab.getByTestId('materials-selection')).not.toHaveAttribute('inert','');
  expect((await state(tab)).comparisonIds).toEqual(['veneer','ldsp']); await tab.close();
});

test("all seven routes expose valid metadata, structured data, sitemap and robots",async({page,request})=>{
  const titles=new Set<string>();
  for(const path of MATERIAL_ROUTES){
    const response=await page.goto(path); expect(response?.status()).toBe(200);
    titles.add(await page.title()); await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
    const data=await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(data.length).toBeGreaterThan(0); for(const json of data) expect(()=>JSON.parse(json)).not.toThrow();
  }
  expect(titles.size).toBe(7);
  const sitemap=await request.get('/sitemap.xml');expect(sitemap.status()).toBe(200);
  for(const path of MATERIAL_ROUTES)expect(await sitemap.text()).toContain('<loc>https://kuhni.minsk.by'+path+'</loc>');
  expect((await request.get('/robots.txt')).status()).toBe(200);
});
