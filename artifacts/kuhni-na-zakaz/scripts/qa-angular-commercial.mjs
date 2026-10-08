import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:3108";
const out = path.resolve(process.env.QA_OUTPUT || "../../outputs/angular-commercial-20261008/local");
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const result = { base, viewports: [], links: [], form: null };
try {
  for (const [width, height] of [[320,568],[390,844],[768,1024],[1440,960]]) {
    const page = await browser.newPage({viewport:{width,height}, reducedMotion:"reduce"});
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.route("**/kapi/leads", route => route.abort());
    const response = await page.goto(base+"/catalog/uglovye-kuhni", {waitUntil:"networkidle"});
    assert.equal(response.status(),200);
    assert.equal(await page.locator("h1").count(),1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"),"https://kuhni.minsk.by/catalog/uglovye-kuhni");
    const data = await page.locator('script[type="application/ld+json"]').allTextContents();
    const schema = data.map(text=>JSON.parse(text));
    const schemaText=JSON.stringify(schema);
    assert.ok(schemaText.includes("FAQPage") && schemaText.includes("CollectionPage") && schemaText.includes("Service"));
    assert.ok(!schemaText.includes('"@type":"Product"'));
    const dimensions = await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
    assert.equal(dimensions.scroll,dimensions.client);
    const heroCta = page.locator('section[aria-labelledby="angular-title"] a[href="#calculate"]');
    const rect = await heroCta.boundingBox();
    assert.ok(rect && rect.y+rect.height < height-60,"Hero CTA below mobile dock");
    await page.screenshot({path:path.join(out,"hero-"+width+".png")});
    await heroCta.click();
    assert.ok((await page.locator("#calculate").boundingBox()).y < height);
    // Trigger lazy images throughout the page before checking their actual decode.
    for (const img of await page.locator("main img").all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(image=>image.decode());
    }
    const images=await page.locator("main img").evaluateAll(nodes=>nodes.map(i=>({src:i.currentSrc,width:i.naturalWidth,alt:i.alt})));
    assert.ok(images.length>=8);
    assert.ok(images.every(i=>i.width>0 && i.alt && !/\.png(?:\?|$)/.test(i.src)));
    await page.getByRole("tab",{name:"Мойка в углу",exact:true}).click();
    assert.match(await page.locator("#corner-type-panel img").getAttribute("src"),/sink-corner/);
    await page.locator('[data-component="MechanismComparison"]').getByRole("button",{name:"Карусель",exact:false}).click();
    assert.equal(await page.locator('[data-component="CornerStorageExplorer"]').getByRole("button",{name:"Карусель",exact:false}).getAttribute("aria-pressed"),"true");
    await page.getByRole("button",{name:"Графитовый",exact:false}).click();
    await page.getByLabel("Первая стена, см").fill("320");
    await page.getByRole("button",{name:"Посмотреть выбранные параметры",exact:true}).click();
    assert.ok(await page.getByRole("dialog",{name:"Ваш предварительный выбор"}).isVisible());
    await page.keyboard.press("Escape");
    assert.ok(!(await page.getByRole("dialog",{name:"Ваш предварительный выбор"}).isVisible()));
    assert.deepEqual(errors,[]);
    if (width===390) {
      await page.unroute("**/kapi/leads");
      let payload;
      await page.route("**/kapi/leads", async route=>{
        payload=route.request().postDataJSON();
        await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({success:true})});
      });
      const form=page.locator("#calculate form");
      assert.equal(await form.locator('input:not([type="hidden"]):not([type="checkbox"]):visible').count(),3);
      await form.getByTestId("form-name").fill("Тест угловой кухни");
      await form.getByTestId("form-phone").fill("+375291112233");
      await form.getByTestId("form-city").fill("Борисовский район");
      await form.getByTestId("form-agreement").check();
      await form.getByTestId("form-submit").click();
      await page.getByText("Заявка отправлена",{exact:false}).waitFor();
      assert.equal(payload.sourcePage,"/catalog/uglovye-kuhni");
      assert.equal(payload.city,"Борисовский район");
      assert.equal(payload.answers.selectedCornerType,"sink");
      assert.equal(payload.answers.selectedMechanism,"carousel");
      assert.equal(payload.answers.selectedMaterial,"graphite");
      assert.equal(payload.answers.wallOneLength,320);
      result.form={intercepted:true,sourcePage:payload.sourcePage,sourceType:payload.sourceType,city:payload.city,answers:payload.answers};
      await page.screenshot({path:path.join(out,"form-success.png")});
    }
    if (width===1440) {
      const hrefs=await page.locator("main a[href^='/']").evaluateAll(nodes=>[...new Set(nodes.map(a=>a.getAttribute("href")))]);
      for (const href of hrefs) {
        const r=await page.request.get(base+href);
        result.links.push({href,status:r.status()}); assert.equal(r.status(),200,href);
      }
      for(const href of ["/","/design-proekt-kuhni","/locations/minskaya-oblast","/locations/minsk","/locations/borisov","/materials/furnitura","/robots.txt","/sitemap.xml"]) {
        const r=await page.request.get(base+href); assert.equal(r.status(),200,href);
      }
      const xml=await (await page.request.get(base+"/sitemap.xml")).text();
      assert.match(xml,/<loc>https:\/\/kuhni\.minsk\.by\/catalog\/uglovye-kuhni<\/loc>\s*<lastmod>2026-10-08/);
    }
    result.viewports.push({width,height,images:images.length,errors,ctaBottom:rect.y+rect.height,overflow:false});
    await page.close();
  }
  await fs.writeFile(path.join(out,"results.json"),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
} finally { await browser.close(); }
