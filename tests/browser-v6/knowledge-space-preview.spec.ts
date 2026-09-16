import { expect, test, type Page } from '@playwright/test';

const criticalResourceTypes = new Set(['document', 'script', 'stylesheet', 'image']);

function collectBrowserFailures(page: Page): {
  readonly runtimeErrors: string[];
  readonly resourceErrors: string[];
} {
  const runtimeErrors: string[] = [];
  const resourceErrors: string[] = [];

  page.on('pageerror', error => runtimeErrors.push(error.stack || error.message));
  page.on('console', message => {
    if (message.type() === 'error') runtimeErrors.push(message.text());
  });
  page.on('requestfailed', request => {
    if (criticalResourceTypes.has(request.resourceType())) {
      resourceErrors.push(
        `${request.resourceType()} ${request.url()}: ${request.failure()?.errorText || 'failed'}`
      );
    }
  });
  page.on('response', response => {
    if (response.status() >= 400 && criticalResourceTypes.has(response.request().resourceType())) {
      resourceErrors.push(
        `${response.request().resourceType()} ${response.url()}: HTTP ${response.status()}`
      );
    }
  });

  return { runtimeErrors, resourceErrors };
}

async function expandAllVisibleRegions(page: Page): Promise<void> {
  const collapsed = page.locator('[data-region-group-toggle][aria-expanded="false"]');
  while (await collapsed.count() > 0) {
    await collapsed.first().click();
  }
}

async function documentGeometry(page: Page, selector: string): Promise<{
  readonly top: number;
  readonly width: number;
  readonly height: number;
}> {
  return page.locator(selector).evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return {
      top: bounds.top + window.scrollY,
      width: bounds.width,
      height: bounds.height
    };
  });
}

test('the production V6 preview switches concept slices and selects a history mark', async ({
  page
}, testInfo) => {
  const failures = collectBrowserFailures(page);

  await page.goto('knowledge-space-preview.html', { waitUntil: 'networkidle' });

  const preview = page.locator('[data-knowledge-space-preview]');
  await expect(preview).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('在时间与地域中观察历史');
  await expect(page.locator('[data-region-time-slice]')).toBeVisible();

  const conceptButtons = page.locator('[data-concept-layer-id]');
  await expect(conceptButtons).toHaveCount(8);
  await expect(page.locator('[data-concept-layer-id="polityAndSociety"]')).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  await expect(page.locator('[data-region-group-toggle][aria-expanded="true"]')).toHaveCount(0);
  await expect(page.locator('[data-region-thumbnail]')).not.toHaveCount(0);
  await expect(page.locator('[data-knowledge-space-mark]')).toHaveCount(0);

  const originalWindow = await page.locator('[data-time-window]').textContent();
  await page.locator('[data-time-action="zoom-in"]').click();
  await expect(page.locator('[data-time-window]')).not.toHaveText(originalWindow ?? '');
  await page.locator('[data-time-action="all"]').click();

  const eventLayer = page.locator('[data-concept-layer-id="eventAndConflict"]');
  await eventLayer.click();
  await expandAllVisibleRegions(page);
  await expect(page.locator('[data-knowledge-space-mark][aria-label*="卡迭石战役"]')).not.toHaveCount(0);
  await expect(page.locator('[data-knowledge-space-mark][aria-label*="埃及书写系统跨媒介"]')).toHaveCount(0);
  await expect(page.locator('[data-knowledge-space-mark][aria-label*="尼罗河年周期"]')).toHaveCount(0);

  const technologyLayer = page.locator('[data-concept-layer-id="technologyAndExchange"]');
  await technologyLayer.click();
  await expandAllVisibleRegions(page);
  await expect(page.locator('[data-knowledge-space-mark][aria-label*="铁器技术"]')).not.toHaveCount(0);
  await expect(page.locator('[data-knowledge-space-mark][aria-label*="陨铁被制成稀有器物"]')).toHaveCount(0);

  const languageLayer = page.locator('[data-concept-layer-id="languageAndKnowledge"]');
  await languageLayer.click();
  await expandAllVisibleRegions(page);
  await expect(page.locator('[data-knowledge-space-mark][aria-label*="古埃及象形文字"]')).not.toHaveCount(0);
  await expect(page.locator('[data-knowledge-space-mark][aria-label*="埃及书写系统跨媒介"]')).toHaveCount(0);

  const artLayer = page.locator('[data-concept-layer-id="artAndLiterature"]');
  await artLayer.click();
  await expandAllVisibleRegions(page);
  await expect(artLayer).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-concept-layer-id="polityAndSociety"]')).toHaveAttribute(
    'aria-pressed',
    'false'
  );
  await expect(page.locator('[data-knowledge-space-mark][aria-label*="古埃及艺术"]')).not.toHaveCount(0);
  await expect(page.locator('[data-knowledge-space-mark][aria-label*="古埃及正式艺术规则"]')).toHaveCount(0);

  const marks = page.locator('[data-knowledge-space-mark]');
  await expect.poll(() => marks.count()).toBeGreaterThan(0);
  const firstMark = marks.first();
  await firstMark.scrollIntoViewIfNeeded();
  if (testInfo.project.name === 'mobile-chromium') {
    const box = await firstMark.boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
  } else {
    await firstMark.focus();
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('[data-knowledge-space-details]')).toContainText('已选中');
  await expect(page.locator('.ks-mark.is-selected')).not.toHaveCount(0);

  await expect(page.locator('[data-temporal-relation], [data-relation-edge]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /返回\s*3D|关系/i })).toHaveCount(0);

  expect(failures.resourceErrors, failures.resourceErrors.join('\n')).toEqual([]);
  expect(failures.runtimeErrors, failures.runtimeErrors.join('\n')).toEqual([]);
});

test('selection details show public descriptions, participants, regional roles and source titles', async ({ page }) => {
  await page.goto('knowledge-space-preview.html');
  await page.locator('[data-concept-layer-id="eventAndConflict"]').click();
  await expandAllVisibleRegions(page);
  const eventMark = page.locator('[data-knowledge-space-mark][aria-label*="卡迭石战役"]').first();
  await eventMark.focus();
  await page.keyboard.press('Enter');
  const panel = page.locator('[data-knowledge-space-details]');
  await expect(panel.getByRole('region', { name: '简介' })).toContainText('拉美西斯');
  await expect(panel.locator('.ks-detail-participants')).toContainText('古埃及新王国');
  await expect(panel.locator('.ks-detail-participants')).toContainText('赫梯帝国');
  await expect(panel.locator('.ks-detail-regions')).toContainText('材料见证');
  await panel.locator('.ks-detail-overview summary').click();
  await expect(panel.locator('.ks-detail-overview a').first()).toBeVisible();
  await expect(panel.locator('.ks-detail-overview a').first()).toHaveAttribute('href', /^https?:\/\//);
  await expect(panel).not.toContainText('source-');
  await page.locator('[data-selection-close]').click();
  await page.locator('[data-concept-layer-id="artAndLiterature"]').click();
  await expandAllVisibleRegions(page);
  await page.locator('[data-knowledge-space-mark][aria-label*="吉尔伽美什"]').first().focus();
  await page.keyboard.press('Enter');
  await expect(panel.getByRole('region', { name: '简介' })).toContainText('永生');
  await expect(panel.locator('.ks-detail-regions')).toContainText('相关地域');
  await expect(panel.locator('.ks-selection-panel__header')).toContainText('约公元前12世纪');
});

test('Egypt civilization background stays in its reviewed Regions and follows time across layers', async ({ page }) => {
  const failures = collectBrowserFailures(page);
  await page.goto('knowledge-space-preview.html');
  await page.locator('[data-region-group-toggle="nile-northeast-africa"]').click();
  const backdrop = page.locator('[data-backdrop-region="nile-valley"]');
  await expect(backdrop).toHaveCount(1);
  await expect(page.locator('[data-civilization-backdrop="ancient-egypt"][data-backdrop-region="nubia"]')).toHaveCount(0);
  await expect(page.locator('[data-civilization-motif="sphinx"]')).toHaveCount(1);
  const initialStyle = await backdrop.getAttribute('style');
  for (const layer of ['languageAndKnowledge', 'religionAndThought', 'artAndLiterature']) {
    await page.locator(`[data-concept-layer-id="${layer}"]`).click();
    await expect(backdrop).toHaveCount(1);
    const style = await backdrop.evaluate(element => ({ left: (element as HTMLElement).style.left, width: (element as HTMLElement).style.width }));
    expect(initialStyle).toContain(`left: ${style.left}`);
    expect(initialStyle).toContain(`width: ${style.width}`);
    await expect(page.locator('[data-civilization-motif="sphinx"]')).toHaveCount(1);
  }
  const art = page.locator('[data-subject-id="egyptian-art"]').first();
  await expect(art).toHaveCSS('color', 'rgb(136, 98, 31)');
  await art.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.ks-subject-swatch')).toHaveCSS('background-color', 'rgb(136, 98, 31)');
  await page.locator('[data-selection-close]').click();
  await page.locator('[data-time-action="zoom-in"]').click();
  expect(await backdrop.getAttribute('style')).not.toBe(initialStyle);
  expect(failures.resourceErrors).toEqual([]);
  expect(failures.runtimeErrors).toEqual([]);
});

test('all reviewed cultural backdrops have one noninteractive motif and preserve subject selection', async ({ page }) => {
  const failures = collectBrowserFailures(page);
  await page.goto('knowledge-space-preview.html');
  await expandAllVisibleRegions(page);
  for (const id of ['ancient-egypt', 'mesopotamia', 'babylonia', 'assyria', 'indus', 'early-china', 'minoan', 'mycenaean', 'hittite', 'nubia']) {
    const context = page.locator(`[data-backdrop-context="${id}"]`);
    await expect(context).toHaveCount(1);
    await expect(context.locator('[data-civilization-motif]')).toHaveCount(1);
    await expect(context).toHaveText('');
    await expect(context).toHaveCSS('pointer-events', 'none');
  }
  await expect(page.locator('[data-civilization-backdrop="mycenaean"][data-backdrop-region="crete"]')).toHaveCount(0);
  await expect(page.locator('[data-civilization-backdrop="hittite"][data-backdrop-region="syria-northern-levant"]')).toHaveCount(0);
  const shang = page.locator('[data-subject-id="shang-civilization"]').first();
  await shang.click();
  await expect(page.locator('[data-knowledge-space-details] h2')).toHaveText('商王朝');
  expect(failures.resourceErrors).toEqual([]);
  expect(failures.runtimeErrors).toEqual([]);
});

test('political subjects retain distinct colors in blocks, thumbnails and selection details', async ({ page }) => {
  await page.goto('knowledge-space-preview.html');
  await expandAllVisibleRegions(page);
  const first = page.locator('[data-subject-id="akkadian-empire"]').first();
  const second = page.locator('[data-subject-id="ur-iii-kingdom"]').first();
  const color = await first.evaluate(element => getComputedStyle(element).color);
  expect(await second.evaluate(element => getComputedStyle(element).color)).not.toBe(color);
  const relatedColors = await page.locator('[data-subject-id="akkadian-empire"]').evaluateAll(elements => elements.map(element => getComputedStyle(element).color));
  expect(relatedColors.every(value => value === color)).toBe(true);
  await first.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.ks-subject-swatch')).toHaveCSS('background-color', color);
  await page.locator('[data-selection-close]').click();
  await page.locator('[data-region-group-toggle]').filter({ hasText: '两河流域' }).click();
  const thumbnailColors = await page.locator('[data-region-thumbnail-mark*="akkadian"]').evaluateAll(elements => elements.map(element => getComputedStyle(element).color));
  expect(thumbnailColors.length).toBeGreaterThan(0);
  expect(thumbnailColors.every(value => value === color)).toBe(true);
});

test('region expansion persists across slices and one Entity selection highlights every visible Phase', async ({
  page
}, testInfo) => {
  const failures = collectBrowserFailures(page);
  await page.goto('knowledge-space-preview.html', { waitUntil: 'networkidle' });

  const mesopotamiaToggle = page.locator('[data-region-group-toggle="mesopotamia"]');
  await expect(mesopotamiaToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('[data-region-group="mesopotamia"] [data-region-thumbnail]')).toBeVisible();
  await mesopotamiaToggle.click();
  await expect(mesopotamiaToggle).toHaveAttribute('aria-expanded', 'true');

  const akkadianMarks = page.locator('[data-subject-kind="entity"][data-subject-id="akkadian-empire"]');
  await expect.poll(() => akkadianMarks.count()).toBeGreaterThan(1);
  const chartBoxBeforeSelection = await documentGeometry(page, '[data-region-time-slice]');
  await akkadianMarks.first().focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => akkadianMarks.evaluateAll((marks) => (
    marks.every((mark) => mark.classList.contains('is-selected'))
  ))).toBe(true);
  await expect(page.locator('.ks-chart.has-selection')).toHaveCount(1);
  await expect(page.locator('[data-knowledge-space-details]')).toContainText('阿卡德王朝');
  await expect(page.locator('[data-knowledge-space-details] h2')).toHaveCount(1);
  const displayedPhaseIds = await page.locator('[data-selection-phase-id]').evaluateAll((items) => (
    items.map((item) => item.getAttribute('data-selection-phase-id'))
  ));
  expect(new Set(displayedPhaseIds).size).toBe(displayedPhaseIds.length);
  expect(await documentGeometry(page, '[data-region-time-slice]')).toEqual(chartBoxBeforeSelection);

  if (testInfo.project.name === 'desktop-chromium') {
    await akkadianMarks.first().hover();
    await expect(page.locator('[data-knowledge-space-hover]')).toBeVisible();
    expect(await documentGeometry(page, '[data-region-time-slice]')).toEqual(chartBoxBeforeSelection);
  }

  await page.locator('[data-concept-layer-id="languageAndKnowledge"]').click();
  await expect(page.locator('[data-region-group-toggle="mesopotamia"]')).toHaveAttribute(
    'aria-expanded',
    'true'
  );

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('[data-region-group-toggle="mesopotamia"]')).toHaveAttribute(
    'aria-expanded',
    'true'
  );

  await expandAllVisibleRegions(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator('[data-sticky-chart-context]')).toHaveCount(0);

  expect(failures.resourceErrors, failures.resourceErrors.join('\n')).toEqual([]);
  expect(failures.runtimeErrors, failures.runtimeErrors.join('\n')).toEqual([]);
});

test('touching polity Phases render as one continuous block with one in-block Entity label', async ({
  page
}) => {
  const failures = collectBrowserFailures(page);
  await page.goto('knowledge-space-preview.html', { waitUntil: 'networkidle' });

  const egyptToggle = page.locator('[data-region-group-toggle="nile-northeast-africa"]');
  await egyptToggle.click();

  const nileRun = page.locator(
    '[data-region-row="region:nile-valley"] [data-block-run-id][data-subject-id="egypt-new-kingdom"]'
  );
  await expect(nileRun).toHaveCount(1);
  await expect(nileRun).toHaveAttribute('data-phase-count', '4');
  await expect(nileRun.locator('path.ks-block-run__body')).toHaveCount(1);
  await expect(nileRun.locator('path.ks-block-run__body')).toHaveAttribute('data-block-style', 'straight-branch');
  await expect(nileRun.locator('polygon')).toHaveCount(0);

  const entityLabels = page.locator('[data-block-label-subject-id="egypt-new-kingdom"]');
  await expect(entityLabels).toHaveCount(1);
  await expect(entityLabels.first()).toHaveText('古埃及新王国');

  const blockRuns = page.locator('[data-block-run-id]');
  const blockLabels = page.locator('[data-block-label-subject-id]');
  expect(await blockLabels.count()).toBeLessThan(await blockRuns.count());
  await expect(page.locator('[data-subject-id="event-hatshepsut-rules-as-pharaoh"]')).toHaveCount(0);
  const labels = await blockLabels.evaluateAll(elements => elements.map(element => element.getAttribute('data-block-label-subject-id')));
  expect(new Set(labels).size).toBe(labels.length);
  await expect(page.locator('[data-mark-label-kind="trace"], [data-mark-label-kind="node"], [data-mark-label-kind="crayonStrip"], [data-mark-label-kind="crayonField"]')).toHaveCount(0);

  await nileRun.focus();
  await page.keyboard.press('Enter');
  const panel = page.locator('[data-knowledge-space-details]');
  await expect(panel.locator('h2')).toHaveText('古埃及新王国');
  await expect(panel.locator('[data-selection-phase-id]')).toHaveCount(4);
  await expect(panel.getByText('古埃及新王国', { exact: true })).toHaveCount(1);

  expect(failures.resourceErrors, failures.resourceErrors.join('\n')).toEqual([]);
  expect(failures.runtimeErrors, failures.runtimeErrors.join('\n')).toEqual([]);
});

test('Mesopotamia has explicit child rows and one continuous Old Babylon core', async ({ page }) => {
  const failures = collectBrowserFailures(page);
  await page.goto('knowledge-space-preview.html', { waitUntil: 'networkidle' });

  await page.locator('[data-region-group-toggle="mesopotamia"]').click();
  await expect(page.locator('[data-region-row="region:mesopotamia:unscoped"]')).toHaveCount(0);
  await expect(page.locator('[data-subject-id="sumer"]')).toHaveCount(0);

  const visibleRows = page.locator('[data-region-row^="region:"]');
  const mesopotamiaRows = (await visibleRows.evaluateAll(rows => rows
    .map(row => row.getAttribute('data-region-row'))
    .filter(id => [
      'region:upper-mesopotamia',
      'region:middle-euphrates',
      'region:central-mesopotamia',
      'region:southern-mesopotamia'
    ].includes(id ?? ''))));
  expect(mesopotamiaRows).toEqual([
    'region:upper-mesopotamia',
    'region:central-mesopotamia',
    'region:southern-mesopotamia'
  ]);

  const centralRun = page.locator(
    '[data-region-row="region:central-mesopotamia"] [data-block-run-id][data-subject-id="old-babylonian-kingdom"]'
  );
  await expect(centralRun).toHaveCount(1);
  await expect(centralRun).toHaveAttribute('data-phase-count', '1');

  const middleRun = page.locator(
    '[data-region-row="region:middle-euphrates"] [data-block-run-id][data-subject-id="old-babylonian-kingdom"]'
  );
  await expect(middleRun).toHaveCount(0);
  await expect(page.locator('[data-region-row="region:southern-mesopotamia"] [data-subject-id="old-babylonian-kingdom"]')).toHaveCount(0);
  await centralRun.focus();
  await page.keyboard.press('Enter');
  const expansion = page.locator('[data-political-history-id="event-hammurabi-conquests"]');
  await expect(expansion).toContainText('马里');
  await expect(expansion).toContainText('拉尔萨');

  expect(failures.resourceErrors, failures.resourceErrors.join('\n')).toEqual([]);
  expect(failures.runtimeErrors, failures.runtimeErrors.join('\n')).toEqual([]);
});

test('material objects live in the material layer, with scripts shown as traces', async ({ page }) => {
  await page.goto('knowledge-space-preview.html');
  await page.locator('[data-concept-layer-id="materialAndArchitecture"]').click();
  await expandAllVisibleRegions(page);
  const code = page.locator('[data-subject-id="hammurabi-code"]');
  await expect(code).toHaveCount(1);
  await expect(code).toHaveAttribute('data-mark-kind', 'node');
  await code.click();
  await expect(page.locator('[data-knowledge-space-details] h2')).toHaveText('汉谟拉比法典石碑');
  await expect(page.locator('[data-subject-id="event-hammurabi-code-stele"], [data-subject-id="egyptian-funerary-text-corpora"]')).toHaveCount(0);
  await page.locator('[data-concept-layer-id="materialAndArchitecture"]').click();
  await expandAllVisibleRegions(page);
  await expect(page.locator('[data-subject-id="medinet-habu-war-records"]')).toHaveCount(1);
  await page.locator('[data-concept-layer-id="languageAndKnowledge"]').click();
  await expandAllVisibleRegions(page);
  await expect(page.locator('[data-subject-id="hammurabi-code"], [data-subject-id="amarna-letters-corpus"], [data-subject-id="medinet-habu-war-records"], [data-subject-id="shang-oracle-bone-inscriptions"]')).toHaveCount(0);
  await expect(page.locator('[data-subject-id="cuneiform"]').first()).toHaveAttribute('data-mark-kind', 'trace');
  await expect(page.locator('[data-subject-id="event-unas-pyramid-text-inscription"]')).toHaveCount(0);
  await page.locator('[data-concept-layer-id="religionAndThought"]').click();
  await expandAllVisibleRegions(page);
  await expect(page.locator('[data-subject-id="event-unas-pyramid-text-inscription"]')).toHaveCount(1);
  await expect(page.locator('[data-subject-id="tower-of-babel-tradition"], [data-subject-id="ancient-israelite-tradition"]')).toHaveCount(0);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the preview remains operable without animation or transition durations', async ({ page }) => {
    const failures = collectBrowserFailures(page);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('knowledge-space-preview.html', { waitUntil: 'networkidle' });
    const preview = page.locator('[data-knowledge-space-preview]');
    await expect(preview).toBeVisible();
    await page.locator('[data-region-group-toggle]').first().click();

    const movingElements = await preview.locator('*').evaluateAll(elements => elements
      .map(element => {
        const style = getComputedStyle(element);
        return {
          tag: element.tagName,
          animationDuration: style.animationDuration,
          transitionDuration: style.transitionDuration
        };
      })
      .filter(({ animationDuration, transitionDuration }) => {
        const hasDuration = (value: string): boolean => value
          .split(',')
          .some(part => Number.parseFloat(part) > 0);
        return hasDuration(animationDuration) || hasDuration(transitionDuration);
      }));

    expect(movingElements).toEqual([]);

    const mark = page.locator('[data-knowledge-space-mark]').first();
    await mark.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-knowledge-space-details]')).toContainText('已选中');

    expect(failures.resourceErrors, failures.resourceErrors.join('\n')).toEqual([]);
    expect(failures.runtimeErrors, failures.runtimeErrors.join('\n')).toEqual([]);
  });
});

test('language overview has a fixed two-language one-script budget and white labels', async ({ page }) => {
  await page.goto('knowledge-space-preview.html');
  await page.locator('[data-concept-layer-id="languageAndKnowledge"]').click();
  await expandAllVisibleRegions(page);
  await expect(page.locator('[data-subject-id="egyptian-hieratic"]')).toHaveCount(0);
  await expect(page.locator('[data-subject-id="egyptian-demotic"]')).toHaveCount(1);
  const labels = page.locator('.ks-language-label');
  await expect(labels.first()).toHaveCSS('color', 'rgb(251, 248, 239)');
  const labelledSubjects = await labels.evaluateAll(elements => elements.map(e => e.getAttribute('data-language-label-subject-id')));
  expect(new Set(labelledSubjects).size).toBe(labelledSubjects.length);
  await expect(page.locator('[data-language-label-subject-id="egyptian-language"]')).toHaveCount(1);
  for (const id of ['egyptian-language', 'greek-language', 'old-chinese-language', 'akkadian-language']) {
    const count = await page.locator(`[data-language-label-subject-id="${id}"]`).count();
    if (page.viewportSize()!.width >= 900) expect(count).toBe(1);
    else expect(count).toBeLessThanOrEqual(1); // Short mobile bands retain the existing 90px label threshold.
    expect(await page.locator(`[data-knowledge-space-mark][data-subject-id="${id}"]`).count()).toBeGreaterThan(1);
  }
  const bands = await page.locator('.ks-mark__solid-band').evaluateAll(elements => elements.map(e => Number(e.getAttribute('height'))));
  expect(bands.length).toBeGreaterThan(0);
  expect(bands.every(height => height === 12)).toBe(true);
  await page.locator('[data-subject-id="egyptian-language"]').first().click();
  await expect(page.locator('[data-language-details]')).toContainText('使用人群');
  await expect(page.locator('[data-knowledge-space-details] summary').filter({hasText:'书写形式'})).toHaveCount(0);
  for (const id of ['greek-language', 'hittite-language', 'phoenician-language', 'hebrew-language', 'old-persian-language', 'old-chinese-language', 'vedic-sanskrit-language', 'indus-sign-system']) {
    expect(await page.locator(`[data-knowledge-space-mark][data-subject-id="${id}"]`).count()).toBeGreaterThan(0);
  }
  await expect(page.locator('[data-knowledge-space-mark][data-subject-id="linear-b"]')).toHaveCount(2);
  await expect(page.locator('[data-subject-id="linear-b"] text')).toHaveCount(0);
  await expect(page.locator('[data-subject-id="chinese-writing-system"] text')).toHaveCount(0);
  await page.locator('[data-knowledge-space-mark][data-subject-id="greek-language"]').first().click();
  await expect(page.locator('[data-language-details] [aria-label="简介"]')).toContainText('线形文字B');
});

test('all languages use two compact detail blocks and one deduplicated bibliography', async ({ page }) => {
  const failures = collectBrowserFailures(page);
  await page.goto('knowledge-space-preview.html');
  await page.locator('[data-concept-layer-id="languageAndKnowledge"]').click();
  await expandAllVisibleRegions(page);
  for (const id of ['sumerian-language','akkadian-language','egyptian-language','greek-language','hittite-language','lydian-language','phoenician-language','hebrew-language','aramaic-language','elamite-language','old-persian-language','old-chinese-language','vedic-sanskrit-language']) {
    await page.locator(`[data-knowledge-space-mark][data-subject-id="${id}"]`).first().click();
    const panel = page.locator('[data-knowledge-space-details]');
    await expect(panel).toHaveAttribute('data-selection-id', id);
    await expect(panel.locator('.ks-language-detail-block')).toHaveCount(2);
    await expect(panel.locator('.ks-selection-panel__phases')).toHaveCount(0);
    await expect(panel.locator('details')).toHaveCount(1);
    await expect(panel.getByRole('heading', {name:'时间与地域',exact:true})).toBeVisible();
    await expect(panel.getByRole('heading', {name:'谁在使用',exact:true})).toBeVisible();
    await expect(panel).not.toContainText('书写形式');
    await expect(panel).not.toContainText('非消亡');
    await expect(panel).not.toContainText('材料见证');
    await expect(panel).not.toContainText('这里');
    if (id === 'akkadian-language') await expect(panel.locator('tbody tr')).toHaveCount(3);
    await panel.locator('details > summary').click();
    const links = await panel.locator('details a').evaluateAll(elements => elements.map(e => e.getAttribute('href')));
    expect(links.length).toBeGreaterThan(0);
    expect(new Set(links).size).toBe(links.length);
    await panel.getByRole('button', {name:'取消选择',exact:true}).click();
  }
  expect(failures.runtimeErrors).toEqual([]);
});

test('writing details show languages, materials and uses in one compact panel', async ({ page }) => {
  const failures = collectBrowserFailures(page);
  await page.goto('knowledge-space-preview.html');
  await page.locator('[data-concept-layer-id="languageAndKnowledge"]').click();
  await expandAllVisibleRegions(page);
  // Hieratic remains retained in the core and excluded by the existing overview choice.
  const ids = ['cuneiform', 'egyptian-hieroglyphs', 'egyptian-demotic', 'indus-sign-system',
    'chinese-writing-system', 'greek-alphabet', 'linear-a', 'linear-b', 'lydian-alphabet',
    'phoenician-alphabet', 'paleo-hebrew-alphabet', 'aramaic-alphabet', 'old-persian-cuneiform'];
  for (const id of ids) {
    await page.locator(`[data-knowledge-space-mark][data-subject-id="${id}"]`).first().click();
    const panel = page.locator('[data-knowledge-space-details]');
    await expect(panel).toHaveAttribute('data-selection-id', id);
    await expect(panel.locator('[data-writing-details]')).toHaveCount(1);
    await expect(panel.locator('.ks-selection-panel__phases')).toHaveCount(0);
    await expect(panel.getByRole('heading', { name: '时间与地域', exact: true })).toBeVisible();
    await expect(panel.getByRole('heading', { name: '书写与用途', exact: true })).toBeVisible();
    await expect(panel.locator('dt')).toHaveText(['记录语言', '书写载体', '主要用途']);
    await expect(panel).not.toContainText(/非消亡|非停止|材料见证|这里|本期收录|所录使用/);
    await expect(panel.locator('details')).toHaveCount(1);
    await expect(panel.locator('details')).not.toHaveAttribute('open', '');
    if (id === 'cuneiform') await expect(panel.locator('tbody tr')).toHaveCount(4);
    if (id === 'linear-a') await expect(panel).toContainText('尚未释读');
    if (id === 'indus-sign-system') await expect(panel).toContainText('尚未确定');
    await panel.locator('details > summary').click();
    const links = await panel.locator('details a').evaluateAll(elements => elements.map(e => e.getAttribute('href')));
    expect(links.length).toBeGreaterThan(0);
    expect(new Set(links).size).toBe(links.length);
    await panel.getByRole('button', { name: '取消选择', exact: true }).click();
  }
  expect(failures.runtimeErrors).toEqual([]);
});

test('all polities and city communities show one history table, centers and merged sources', async ({ page }) => {
  const failures = collectBrowserFailures(page);
  await page.goto('knowledge-space-preview.html');
  await expandAllVisibleRegions(page);
  const communities = new Set(['minoan-palatial-civilization', 'mycenaean-civilization', 'indus-civilization', 'greek-dark-age-communities', 'assur-community']);
  const ids = await page.locator('[data-knowledge-space-mark]').evaluateAll(elements => [...new Set(elements.map(e => e.getAttribute('data-subject-id')!))]);
  expect(ids).toHaveLength(20);
  for (const id of ids) {
    await page.locator(`[data-knowledge-space-mark][data-subject-id="${id}"]`).first().click();
    const panel = page.locator('[data-knowledge-space-details]');
    await expect(panel).toHaveAttribute('data-selection-id', id);
    await expect(panel.locator('[data-political-details]')).toHaveCount(1);
    await expect(panel.locator('table')).toHaveCount(1);
    await expect(panel.locator('.ks-selection-panel__phases')).toHaveCount(0);
    await expect(panel.locator('dt')).toHaveText(communities.has(id)
      ? ['主要中心', '核心地区', '组织方式'] : ['首都与政治中心', '核心地区', '统治方式']);
    await expect(panel).not.toContainText(/不表示|不等于|本期收录|非消亡|材料见证|文化传统/);
    await expect(panel.locator('details')).toHaveCount(1);
    await expect(panel.locator('details')).not.toHaveAttribute('open', '');
    if (id === 'neo-assyrian-empire') await expect(panel.locator('tbody tr')).toHaveCount(5);
    if (id === 'old-babylonian-kingdom') await expect(panel.locator('tbody')).toContainText('汉谟拉比');
    const overflow = await panel.locator('table').evaluate(table => table.scrollWidth > table.clientWidth + 1);
    expect(overflow, id).toBe(false);
    await panel.locator('details > summary').click();
    const links = await panel.locator('details a').evaluateAll(elements => elements.map(e => e.getAttribute('href')));
    expect(links.length).toBeGreaterThan(0);
    expect(new Set(links).size).toBe(links.length);
    await panel.getByRole('button', { name: '取消选择', exact: true }).click();
  }
  expect(failures.runtimeErrors).toEqual([]);
  expect(failures.resourceErrors).toEqual([]);
});
