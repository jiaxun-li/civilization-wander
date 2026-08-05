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
  await expect(page.locator('[data-home-sections] .home-entities')).toHaveCount(3);
  await expect(page.locator('[data-home-sections] .home-entity-card')).toHaveCount(12);

  await page.locator(
    '.home-primary-actions [data-start-card="odyssey-name-and-home"]:not([data-home-primary-action])'
  ).click();
  await expect(page.locator('#home-view')).toBeHidden();
  await expect(page.locator('#card-view')).toBeVisible();
  await expect(page.locator('[data-card-id="odyssey-name-and-home"]')).toBeVisible();

  const previewTrigger = page.locator('[data-preview-navigation-id]').first();
  await previewTrigger.hover();
  await expect(page.locator('[data-preview-layer]')).toHaveAttribute('data-open', 'true');
  await expect(page.locator('[data-preview-layer] .v4-preview-card')).toBeVisible();

  const mediaImage = page.locator('[data-map-slot] > img:not([data-media-image-transition])');
  await expect(mediaImage).toBeVisible();
  await expect.poll(() => mediaImage.evaluate(image => {
    const element = image as HTMLImageElement;
    return element.complete && element.naturalWidth > 0;
  })).toBe(true);
  await expect(page.locator('[data-media-caption]')).not.toHaveText('');

  const secondScene = page.locator('[data-scene-id]').nth(1);
  await secondScene.scrollIntoViewIfNeeded();
  await expect(secondScene).toHaveClass(/\bis-active\b/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await expect(page.locator('[data-story-back-bar]')).toBeVisible();
  await expect(page.locator('[data-story-back]')).toHaveAttribute('aria-label', '返回首页');
  await page.locator('[data-story-back]').click();
  await expect(page.locator('#home-view')).toBeVisible();
  await expect(page.locator('#card-view')).toBeHidden();

  await page.locator(
    '.home-primary-actions [data-start-card="odyssey-name-and-home"]:not([data-home-primary-action])'
  ).click();
  await expect(page.locator('#card-view')).toBeVisible();
  await page.locator('.site-brand[data-home-link]').click();
  await expect(page.locator('#home-view')).toBeVisible();

  expect(resourceErrors, resourceErrors.join('\n')).toEqual([]);
  expect(runtimeErrors, runtimeErrors.join('\n')).toEqual([]);
});

test('React home continuation opens the stored Card and Scene', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('civilization-wander:v5:last-read', JSON.stringify({
      atlasV5: true,
      cardId: 'tower-of-babel-story-and-etemenanki',
      sceneId: 'tower-of-babel-builders-stay-together',
      scrollY: 0,
      navigationStack: []
    }));
  });

  await page.goto('./', { waitUntil: 'networkidle' });
  const continueLink = page.locator('[data-home-primary-action]');
  await expect(continueLink).toContainText('继续上次阅读');
  await expect(continueLink).toHaveAttribute('data-start-card', 'tower-of-babel-story-and-etemenanki');
  await continueLink.click();
  await expect(page.locator('[data-card-id="tower-of-babel-story-and-etemenanki"]')).toBeVisible();
  await expect(page.locator('[data-scene-id="tower-of-babel-builders-stay-together"]')).toHaveClass(/\bis-active\b/);
});
