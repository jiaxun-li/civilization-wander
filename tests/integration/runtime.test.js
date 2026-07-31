const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../../data/v3/atlas-data.js');
const queryModule = require('../../data/v3/queries.js');

const root = path.resolve(__dirname, '../..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('index.html');
const app = read('app.js');
const globalCss = read('styles.css');
const cardCss = read('styles/v3/cards.css');
const mapCss = read('styles/v3/map.css');
const mapJs = read('map/v3/map-renderer.js');

test('entrypoint loads only the V3 main path in dependency order', () => {
  const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(scripts, [
    'data/world-physical.js',
    'data/v3/atlas-data.js',
    'data/v3/queries.js',
    'ui/v3/cards.js',
    'ui/v3/card-reader.js',
    'assets/natural-earth/base.js',
    'map/v3/map-renderer.js',
    'app.js'
  ]);
  assert.doesNotMatch(html, /data\/(?:content|knowledge|curation|entity-network|entity-queries)\.js/);
});

test('runtime contains no legacy timeline or interactive basemap state', () => {
  const runtime = [html, app, globalCss, cardCss, mapCss, mapJs].join('\n');
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
  assert.doesNotMatch(mapJs, /addEventListener\(['"](?:wheel|pointerdown|pointermove|mousedown|touchmove)/);
});

test('V3 validation proves all references and objects are complete', () => {
  const result = queryModule.createAtlasQueries(data).validateAtlasData();
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.deepEqual(result.errors, []);
  for (const count of Object.values(result.counts)) assert.ok(count > 0);
});

test('brand and default experience are centralized and editorial', () => {
  assert.match(app, /const BRAND_CONFIG = Object\.freeze/);
  assert.match(app, /name: '文明漫游'/);
  assert.match(app, /defaultCardId: 'buddhism-overview'/);
  assert.match(html, /连续阅读 · 连续点击/);
  assert.match(html, /地图只负责安静地补充空间背景/);
  assert.doesNotMatch(html, /山河与文明|为什么历史会在这个地方/);
});

test('map and body are Scene-driven through one callback chain', () => {
  assert.match(app, /onMapStateChange\(mapState, scene\)/);
  assert.match(app, /renderMapState\(mapState, scene\)/);
  assert.match(app, /onStructureViewsChange\(views, scene\)/);
  assert.match(app, /setStructureViews\(views, scene\)/);
  assert.match(app, /onNavigate\(navigationId\)[\s\S]*reader\.followNavigation\(navigationId\)/);
});

test('accessibility landmarks and reduced motion are present', () => {
  assert.match(html, /aria-label="当前阅读路径"/);
  assert.match(html, /aria-label="当前文明 Card"/);
  assert.match(cardCss, /:focus-visible/);
  assert.match(mapCss, /:focus-visible/);
  assert.match(globalCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(cardCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(mapCss, /@media \(prefers-reduced-motion: reduce\)/);
});

