import { test, expect } from '@playwright/test';
test.setTimeout(120_000);

const route = '/catalog/kuhni-do-potolka';
for (const width of [320, 390, 768, 1440]) {
  test(`ceiling kitchen layout and images at ${width}px`, async ({ page, request }, info) => {
    await page.setViewportSize({ width, height: 844 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    const root = page.getByTestId('ceiling-kitchen-page');
    await expect(root.locator('h1')).toHaveText('Кухни до потолка на заказ');
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://kuhni.minsk.by${route}`);
    expect(await root.locator('img').first().evaluate(img => img.getBoundingClientRect().top)).toBeLessThan(700);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.screenshot({ path: info.outputPath(`ceiling-${width}-hero.png`) });
    const gallery = page.getByTestId('ceiling-gallery');
    await gallery.getByRole('button', { name: 'Все варианты', exact: true }).click();
    await expect(gallery.locator('article:visible')).toHaveCount(8);
    for (const image of await root.locator('img').all()) {
      if (!await image.isVisible()) continue;
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      expect(await image.getAttribute('alt')).toMatch(/[А-Яа-я]/);
    }
    const storage = root.locator('[data-interaction-role=ceiling-storage-explorer]');
    for (const button of await storage.locator('button[data-frame-id]').all()) {
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect.poll(() => storage.locator('img').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
    const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => { const value = JSON.parse(node.textContent!); return Array.isArray(value) ? value : [value]; }));
    expect(schemas.some(item => item['@type'] === 'CollectionPage')).toBeTruthy();
    expect(schemas.some(item => item['@type'] === 'Product' || item.offers)).toBeFalsy();
    const faq = schemas.find(item => item['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(9);
    for (const question of faq.mainEntity) {
      expect(await root.textContent()).toContain(question.name);
      expect(await root.textContent()).toContain(question.acceptedAnswer.text);
    }
    expect(await root.textContent()).not.toMatch(/hardware-переход|ложной точности|Форма получит тип страницы/);
    expect(errors).toEqual([]);
    await page.screenshot({ path: info.outputPath(`ceiling-${width}-form.png`) });
    if (width === 390) {
      const links = [...new Set(await root.locator('a[href^="/"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')!)))];
      for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
      for (const name of ['hero', 'straight', 'compact', 'handleless', 'wood', 'warm', 'small', 'house', 'dacha']) {
        const src = `/images/ceiling-kitchens/20261013/${name}.webp`;
        expect((await request.get(src)).status(), src).toBe(200);
        expect((await request.get(`/kapi/watermarked-image?src=${encodeURIComponent(src)}`)).status(), src).toBe(200);
      }
    }
  });
}

test('filters, preview, construction and room selection reach intercepted lead', async ({ page }) => {
  await page.goto(route);
  const root = page.getByTestId('ceiling-kitchen-page');
  const gallery = page.getByTestId('ceiling-gallery');
  await gallery.getByLabel('Планировка', { exact: true }).selectOption('Прямая');
  await expect(gallery.locator('article:visible')).toHaveCount(2);
  await gallery.getByLabel('Внешний вид', { exact: true }).selectOption('Цветные');
  await expect(gallery.getByText('Такого сочетания среди примеров пока нет.', { exact: false })).toBeVisible();
  await gallery.getByRole('button', { name: 'Сбросить фильтры' }).click();
  const opener = gallery.getByRole('button', { name: 'Увеличить: Прямая кухня для новостройки', exact: true });
  await opener.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(opener).toBeFocused();
  await gallery.locator('#idea-straight').getByRole('button', { name: 'Выбрать для расчёта', exact: true }).click();
  await root.locator('#construction').getByRole('button', { name: /^Добор/ }).click();
  await expect(root.locator('#ceiling-scheme-title')).toHaveText('Схема: Добор');
  const planner = page.getByTestId('ceiling-planner');
  await planner.getByRole('button', { name: 'Дача', exact: true }).click();
  await expect(planner.getByRole('heading', { level: 3 })).toHaveText('Кухня под потолок для дачи');
  await planner.getByLabel('Высота потолка, см').fill('abc');
  await expect(planner.getByLabel('Высота потолка, см')).toHaveAttribute('aria-invalid', 'true');
  await planner.getByLabel('Высота потолка, см').fill('275');
  await planner.getByLabel('Форма кухни').selectOption('Прямая');
  await planner.getByLabel('Потолок', { exact: true }).selectOption('Натяжной');
  await root.getByRole('button', { name: 'Практичная комплектация', exact: true }).click();
  const form = root.locator('#form');
  await expect(form.getByLabel('Примерные размеры', { exact: true })).toHaveValue('Высота потолка 275 см');
  await form.getByLabel('Примерные размеры', { exact: true }).fill('Стена 3,2 м; потолок 2,75 м');
  await planner.getByLabel('Высота потолка, см').fill('280');
  await expect(form.getByLabel('Примерные размеры', { exact: true })).toHaveValue('Стена 3,2 м; потолок 2,75 м');
  await form.getByLabel('Имя *', { exact: true }).fill('Тестовый пользователь');
  await form.getByLabel('Телефон *', { exact: true }).fill('+375291234567');
  await form.getByLabel('Город, деревня или СТ и район', { exact: true }).fill('СТ Тестовое, Смолевичский район');
  await form.getByRole('checkbox', { name: /Согласен на/ }).check();
  let payload: any;
  await page.route('**/kapi/leads', async intercepted => { payload = intercepted.request().postDataJSON(); await intercepted.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }); });
  await form.getByRole('button', { name: 'Отправить на расчёт', exact: true }).click();
  await expect(form.getByTestId('form-success')).toBeVisible();
  expect(payload.sourcePage).toBe(route);
  expect(payload.kitchenType).toBe('До потолка');
  expect(payload.answers.room).toBe('dacha');
  expect(payload.answers.height).toBe('280');
  expect(payload.answers.construction).toBe('Добор');
  expect(payload.answers.selectedIdea).toBe('Прямая кухня для новостройки');
  expect(payload.city).toBe('СТ Тестовое, Смолевичский район');
  expect(payload.dimensions).toBe('Стена 3,2 м; потолок 2,75 м');
});
