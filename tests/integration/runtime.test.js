const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { atlasData: data } = require('../../src/data/atlas-data.ts');
const { queriesModule: queryModule } = require('../../src/data/queries.ts');

const root = path.resolve(__dirname, '../..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('index.html');
const entry = read('src/main.ts');
const app = read('src/app.ts');
const globalCss = read('styles.css');
const cardCss = read('styles/v4/cards.css');
const mapCss = read('styles/v4/map.css');
const mapSource = read('src/map/map-renderer.ts');
const cardsSource = read('src/reader/card-components.ts');

test('entrypoint, aggregator, and syntax manifest keep one content-module order', () => {
  const { spawnSync } = require('node:child_process');
  const result = spawnSync(process.execPath, ['scripts/check-runtime-manifests.js'], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('Vite entrypoint loads only the V5 main path in dependency order', () => {
  assert.match(html, /<script type="module" src="\/src\/main\.ts"><\/script>/);
  const imports = [...entry.matchAll(/import\s+['"]([^'"]+)['"]/g)]
    .map(match => path.posix.normalize(path.posix.join('src', match[1])));
  assert.deepEqual(imports, [
    'styles.css',
    'styles/v4/cards.css',
    'styles/v4/map.css',
    'src/data/world-physical.ts',
    'data/mesopotamia.js',
    'data/ancient-egypt.js',
    'data/ancient-india.ts',
    'data/ancient-china.ts',
    'data/late-bronze-age.ts',
    'data/aegean.js',
    'data/iron-age-near-east.ts',
    'src/data/atlas-data.ts',
    'src/data/queries.ts',
    'src/reader/card-components.ts',
    'src/reader/card-reader.ts',
    'src/map/natural-earth-base.ts',
    'src/map/map-renderer.ts',
    'src/app.ts'
  ]);
});

test('runtime contains no timeline or interactive basemap state', () => {
  const runtime = [html, app, globalCss, cardCss, mapCss, mapSource].join('\n');
  for (const forbidden of [
    'server.arcgisonline.com',
    'World_Imagery',
    'World_Hillshade',
    'tile-layer',
    'entity-timeline',
    'cursorYear',
    'activeEntityYear',
    'zoom-world',
    'data-world-style',
    'map-mode-switch'
  ]) {
    assert.equal(runtime.includes(forbidden), false, forbidden);
  }
  assert.doesNotMatch(mapSource, /addEventListener\(['"](?:wheel|pointerdown|pointermove|mousedown|touchmove)/);
});

test('V5 validation proves all references and objects are complete', () => {
  const result = queryModule.createQueries(data).validateAtlasData();
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.deepEqual(result.errors, []);
  assert.equal(result.counts.assets, data.assets.length);
  for (const [collection, count] of Object.entries(result.counts)) {
    if (collection !== 'structureViews') assert.ok(count > 0, collection);
  }
});

test('brand and default experience are centralized and editorial', () => {
  assert.match(app, /const BRAND_CONFIG(?::[^=]+)? = Object\.freeze/);
  assert.match(app, /const HOME_SECTIONS(?::[^=]+)? = Object\.freeze/);
  assert.match(app, /name: '文明漫游'/);
  assert.match(app, /startCardId: 'sumer-measuring-land-time'/);
  assert.match(app, /eyebrow: '四个古代世界'[\s\S]*title: '从一个文明开始'/);
  assert.match(app, /eyebrow: '史诗与神话'[\s\S]*title: '从一个故事开始'/);
  assert.match(app, /eyebrow: '遗物与奇观'[\s\S]*title: '从一个遗存开始'/);
  assert.match(app, /'tower-of-babel-story-and-etemenanki'/);
  assert.match(html, /data-start-card="sumer-measuring-land-time"/);
  assert.match(html, /data-start-card="odyssey-name-and-home"/);
  assert.match(html, /data-start-card="egypt-pyramids-kingdom-at-work"/);
  assert.match(html, /class="home-primary-actions"/);
  assert.match(html, /从苏美尔开始[\s\S]*从《奥德赛》开始[\s\S]*从金字塔开始/);
  assert.match(html, /data-home-sections/);
  assert.match(html, /历史的线索/);
  assert.match(html, /从一个故事出发，走进彼此相连的历史/);
  assert.match(html, /一个人物、一座城市、一件器物或一部作品，都承载着具体的时代与生活/);
  assert.doesNotMatch(html, /连续阅读 · 连续点击|下一种历史视角/);
  assert.doesNotMatch(html, /第一批文明实体|政治实体|地图范围、路线与节点/);
  assert.doesNotMatch(html, /山河与文明|为什么历史会在这个地方/);
});

test('map and body are Scene-driven through one callback chain', () => {
  assert.match(app, /onMapStateChange\(/);
  assert.match(app, /renderMapState\([\s\S]*context\?\.presentationScene \|\| scene,[\s\S]*mapConfig,[\s\S]*context[\s\S]*\)/);
  assert.match(app, /onStructureViewsChange\(/);
  assert.match(app, /setStructureViews\([\s\S]*views,[\s\S]*presentationScene,[\s\S]*context[\s\S]*\)/);
  assert.match(app, /onNavigate\([\s\S]*reader\?\.followNavigation\(navigationId\)/);
});

test('desktop media retains the available reader height below the sticky back bar', () => {
  assert.match(cardCss, /\.v4-main-card__media\s*\{[^}]*top:\s*var\(--story-back-bar-height\);[^}]*height:\s*calc\(100vh - var\(--story-back-bar-height\)\)/s);
  assert.doesNotMatch(cardCss, /data-card-id="sumer-uruk-city"/);
});

test('left-column images crossfade while unchanged images remain stable', () => {
  assert.match(app, /activeImageAssetId === asset\.id && mapContainer === nextContainer/);
  assert.match(app, /cloneNode\(true\)/);
  assert.match(app, /is-media-image-entering-active/);
  assert.match(app, /is-media-image-leaving-active/);
  assert.match(cardCss, /is-media-image-entering[\s\S]*opacity: 0/);
  assert.match(cardCss, /is-media-image-entering-active[\s\S]*opacity: 1/);
  assert.match(cardCss, /is-media-image-leaving-active[\s\S]*opacity: 0/);
  assert.match(app, /incomingImage\.decoding = 'async'/);
  assert.match(app, /incomingImage\.fetchPriority = 'high'/);
  assert.match(app, /waitForImageReady\(incomingImage\)\.then/);
  assert.match(app, /preloadAdjacentSceneImages\(context\?\.cardId, scene\?\.id, asset\.id\)/);
  assert.match(app, /image\.fetchPriority = 'low'/);
  assert.match(cardsSource, /loading="lazy" decoding="async"/);
});

test('same-Card image presentations preserve the map DOM underneath', () => {
  const imageRenderer = app.match(/function renderImagePresentation\([\s\S]*?\r?\n    reader =/)?.[0] || '';
  assert.doesNotMatch(imageRenderer, /map\?\.destroy\(\)|map = null|nextContainer\.innerHTML/);
  assert.match(imageRenderer, /nextContainer\.append\(incomingImage\)/);
  assert.match(imageRenderer, /setAttribute\('aria-hidden', 'true'\)/);
  assert.match(app, /removeAttribute\('aria-hidden'\)/);
});

test('all images stay centered and fully visible against the map land color', () => {
  assert.match(cardCss, /\.v4-main-card__map-slot > img\s*\{[^}]*position:\s*absolute;[^}]*object-fit:\s*contain;[^}]*object-position:\s*center;[^}]*background:\s*#c8cbbb/s);
  assert.match(cardCss, /\.v4-scene__asset img\s*\{[^}]*object-fit:\s*contain;[^}]*object-position:\s*center;[^}]*background:\s*#c8cbbb/s);
});

test('media captions stay above both incoming and outgoing images', () => {
  assert.match(cardCss, /\.v4-main-card__media-caption\s*\{[^}]*z-index:\s*4;/s);
  assert.match(cardCss, /\.v4-main-card__map-slot > img\s*\{[^}]*z-index:\s*2;/s);
  assert.match(cardCss, /\.v4-main-card__map-slot > img\.is-media-image-leaving\s*\{[^}]*z-index:\s*3;/s);
});

test('map cards and approximation copy are visually hidden without deleting their data path', () => {
  assert.match(
    mapCss,
    /\.v4-map__nodes,\s*\.v4-map__legend,\s*\.v4-map__approximation\s*\{\s*display: none;/
  );
  assert.match(mapSource, /data-map-nodes/);
  assert.match(mapSource, /data-map-legend/);
  assert.match(mapSource, /近似教学示意 · 非精确疆界或路线/);
});

test('SVG camera transform is not shifted by a second CSS transform origin', () => {
  const mapCss = fs.readFileSync(path.resolve(__dirname, '../../styles/v4/map.css'), 'utf8');
  assert.doesNotMatch(mapCss, /\.v4-map__camera\s*\{[^}]*transform-origin/);
});

test('accessibility landmarks and reduced motion are present', () => {
  assert.match(html, /data-story-back/);
  assert.match(html, /data-story-trail[^>]*aria-label="漫游足迹"/);
  assert.doesNotMatch(html, /reading-path/);
  assert.match(html, /aria-label="当前历史故事"/);
  assert.match(globalCss, /\.story-back-bar\s*\{[^}]*position:\s*sticky;[^}]*top:\s*0;/s);
  assert.match(cardCss, /:focus-visible/);
  assert.match(mapCss, /:focus-visible/);
  assert.match(globalCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(cardCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(mapCss, /@media \(prefers-reduced-motion: reduce\)/);
});

