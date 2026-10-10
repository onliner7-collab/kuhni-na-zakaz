import { expect, test } from "@playwright/test";
import { priceExamples, priceStyles, priceLayouts, exampleImage } from "../../data/prices-showcase";

test("server HTML contains all price examples and honest schema", async ({ request }) => {
  for (const url of ["/prices", "/prices?style=scandi&model=scandi-straight-3m", "/prices?style=invalid&budget=invalid"]) {
    const response = await request.get(url);
    expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain('rel="canonical" href="https://kuhni.minsk.by/prices"');
    expect((html.match(/<h1[ >]/g) ?? []).length).toBe(1);
    for (const model of priceExamples) expect(html).toContain(model.name);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => {
      const value = JSON.parse(match[1]);
      return Array.isArray(value) ? value : [value];
    });
    expect(schemas.some(item => item["@type"] === "Service")).toBe(true);
    expect(schemas.some(item => item["@type"] === "BreadcrumbList")).toBe(true);
    expect(JSON.stringify(schemas)).not.toContain('"@type":"Offer"');
    expect(JSON.stringify(schemas)).not.toContain("hasOfferCatalog");
  }
});

test("mobile and desktop layout has visible first photo and unique anchors", async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/prices");
    const hero = page.locator("main header img").first();
    await expect.poll(() => hero.evaluate((image:HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    const box = await hero.boundingBox();
    expect(box!.y + Math.min(100, box!.height)).toBeLessThan(900);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const duplicates = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map(item => item.id);
      return ids.filter((id,index) => ids.indexOf(id) !== index);
    });
    expect(duplicates).toEqual([]);
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("filters cover every style and form, reset and browser Back work", async ({ page }) => {
  await page.goto("/prices?utm_source=test");
  await page.locator("#catalog summary").click();
  for (const style of priceStyles) {
    await page.getByRole("combobox", { name:"Стиль кухни", exact:true }).selectOption(style.id);
    await expect(page.getByTestId("price-example")).toHaveCount(priceExamples.filter(model => model.style === style.id).length);
  }
  await page.getByRole("button", { name:"Сбросить фильтры" }).click();
  for (const layout of priceLayouts) {
    await page.getByRole("combobox", { name:"Форма кухни", exact:true }).selectOption(layout.id);
    await expect(page.getByTestId("price-example")).toHaveCount(priceExamples.filter(model => model.layout === layout.id).length);
  }
  await page.goBack();
  await expect(page.getByRole("combobox", { name:"Форма кухни", exact:true })).toHaveValue("island");
  await page.getByRole("combobox", { name:"Стиль кухни", exact:true }).selectOption("provence");
  await expect(page.getByText("Такого сочетания пока нет в примерах")).toBeVisible();
  await page.getByRole("button", { name:"Показать все примеры" }).click();
  await expect(page).toHaveURL(/utm_source=test/);
  await page.getByRole("button", { name:"Показать ещё 6 примеров" }).click();
  await page.getByRole("button", { name:"Показать ещё 6 примеров" }).click();
  await expect(page.getByTestId("price-example")).toHaveCount(18);
});

test("all 18 galleries load four actual images and keep focus inside", async ({ page }) => {
  test.setTimeout(120000);
  await page.goto("/prices");
  await page.getByRole("button", { name:"Показать ещё 6 примеров" }).click();
  await page.getByRole("button", { name:"Показать ещё 6 примеров" }).click();
  for (const model of priceExamples) {
    const opener = page.getByRole("button", { name:`Посмотреть кухню: ${model.name}`, exact:true });
    await opener.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (const label of ["Общий вид", "Другой ракурс", "Рабочая зона", "Хранение"]) {
      await dialog.getByRole("button", { name:label, exact:true }).click();
      await expect.poll(() => dialog.locator('img[alt*="пример дизайна"]').evaluate((img:HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    for (let index=0;index<12;index++) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
  }
});

test("all raw WebP and watermark endpoints return images", async ({ request }) => {
  test.setTimeout(120000);
  for (const model of priceExamples) {
    for (let view=0;view<4;view++) {
      const src=exampleImage(model,view);
      for(const url of [src,`/kapi/watermarked-image?src=${encodeURIComponent(src)}&w=800`]){
        const response=await request.get(url);
        expect(response.status(),url).toBe(200);
        expect(response.headers()["content-type"]).toMatch(/^image\//);
        expect((await response.body()).length).toBeGreaterThan(1000);
      }
    }
  }
});

test("comparison passes selected example, city, dimensions and filters into a mocked lead", async ({ page }) => {
  let payload:Record<string,any>|undefined;
  await page.route("**/kapi/leads",async route=>{
    payload=route.request().postDataJSON();
    await route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({id:"intercepted-test",success:true})});
  });
  await page.goto("/prices?budget=4000-7000&utm_source=prices-test");
  const cards=page.getByTestId("price-example");
  for(let index=0;index<3;index++)await cards.nth(index).getByRole("button",{name:"Добавить к сравнению"}).click();
  await expect(cards.nth(3).getByRole("button",{name:"Добавить к сравнению"})).toBeDisabled();
  await page.locator("#comparison").getByRole("button",{name:"Рассчитать этот вариант"}).nth(1).click();
  const form=page.locator("#calculate form");
  await form.getByTestId("form-name").fill("Проверка формы");
  await form.getByTestId("form-phone").fill("+375291234567");
  await form.getByLabel("Город", {exact:true}).fill("Минск");
  await form.getByTestId("form-dimensions").fill("3000 × 2000 мм");
  await form.getByTestId("form-agreement").check();
  await form.getByRole("button",{name:"Получить расчёт моей кухни"}).click();
  await expect.poll(()=>Boolean(payload)).toBe(true);
  expect(payload!.city).toBe("Минск");
  expect(payload!.dimensions).toBe("3000 × 2000 мм");
  expect(payload!.answers.comparedExamples).toHaveLength(3);
  expect(payload!.answers.exampleId).toBeTruthy();
  expect(payload!.answers.filters.budget).toBe("4000-7000");
  expect(payload!.sourcePage).toContain("budget=4000-7000");
  expect(payload!.utmSource).toBe("prices-test");
});

test("model form handles errors and preserves entered contact details", async ({ page }) => {
  await page.route("**/kapi/leads",route=>route.fulfill({status:500,contentType:"application/json",body:JSON.stringify({error:"Проверка ошибки отправки"})}));
  await page.goto("/prices?model=modern-corner-3x2");
  const dialog=page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const form=dialog.locator("form");
  await form.getByTestId("form-name").fill("Проверка ошибки");
  await form.getByTestId("form-phone").fill("+375291234567");
  await form.getByTestId("form-agreement").check();
  await form.getByRole("button",{name:"Получить смету по этому примеру"}).click();
  await expect(page.getByText("Проверка ошибки отправки").first()).toBeVisible();
  await expect(form.getByTestId("form-name")).toHaveValue("Проверка ошибки");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
