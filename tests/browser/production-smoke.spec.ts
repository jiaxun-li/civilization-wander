import { expect, test } from '@playwright/test';

const criticalResourceTypes = new Set(['document', 'script', 'stylesheet', 'image']);

test('production build opens a Card, activates a scrolled Scene, and loads its image', async ({ page }) => {
  const runtimeErrors: string[] = [];
  const resourceErrors: string[] = [];

  page.on('pageerror', error => runtimeErrors.push(error.stack || error.message));
  page.on('console', message => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  page.on('requestfailed', request => {
    if (criticalResourceTypes.has(request.resourceType())) {
      resourceErrors.push(`${request.resourceType()} ${request.url()}: ${request.failure()?.errorText || 'failed'}`);
    }
  });
  page.on('response', response => {
    if (response.status() >= 400 && criticalResourceTypes.has(response.request().resourceType())) {
      resourceErrors.push(`${response.request().resourceType()} ${response.url()}: HTTP ${response.status()}`);
    }
  });

  await page.goto('./', { waitUntil: 'networkidle' });
  await expect(page.locator('#home-view')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.locator('.home-primary-actions [data-start-card="odyssey-name-and-home"]').click();
  await expect(page.locator('#home-view')).toBeHidden();
  await expect(page.locator('#card-view')).toBeVisible();
  await expect(page.locator('[data-card-id="odyssey-name-and-home"]')).toBeVisible();

  const mediaImage = page.locator('[data-map-slot] > img:not([data-media-image-transition])');
  await expect(mediaImage).toBeVisible();
  await expect.poll(() => mediaImage.evaluate(image => {
    const element = image as HTMLImageElement;
    return element.complete && element.naturalWidth > 0;
  })).toBe(true);

  const secondScene = page.locator('[data-scene-id]').nth(1);
  await secondScene.scrollIntoViewIfNeeded();
  await expect(secondScene).toHaveClass(/\bis-active\b/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  expect(resourceErrors, resourceErrors.join('\n')).toEqual([]);
  expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
});
