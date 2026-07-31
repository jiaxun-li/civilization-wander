const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../../data/v3/atlas-data.js');
const mapModule = require('../../map/v3/map-renderer.js');
const naturalEarthModule = require('../../assets/natural-earth/base.js');

const ownedFiles = [
  '../../map/v3/map-renderer.js',
  '../../assets/natural-earth/base.js',
  '../../styles/v3/map.css'
].map(relative => path.resolve(__dirname, relative));
const ownedSource = ownedFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n');

test('Natural Earth adapter uses the existing local generated vector and caches it', () => {
  const base = naturalEarthModule.createNaturalEarthBase({
    size: 4096,
    landPath: 'M0 0L10 0L10 10Z',
    lakes: [{ d: 'M1 1Z' }],
    rivers: [{ d: 'M1 1L2 2', rank: 2 }, { d: 'M2 2L3 3', rank: 8 }]
  });
  assert.equal(base.source, 'data/world-physical.js');
  assert.equal(base.dataset, 'Natural Earth 1:50m physical vectors');
  assert.equal(base.cached, true);
  assert.equal(base.rivers.length, 1);
  assert.equal(Object.isFrozen(base), true);
});

test('projection and Geometry paths are deterministic and reusable', () => {
  assert.deepEqual(mapModule.projectPoint([0, 0], 4096), [2048, 2048]);
  for (const geometry of data.geometries) {
    const pathData = mapModule.geometryToPath(geometry.geometry, 4096);
    assert.ok(pathData.startsWith('M'), geometry.id);
    assert.ok(pathData.length > 8, geometry.id);
  }
  assert.equal(
    mapModule.geometryToPath(data.geometries[0].geometry),
    mapModule.geometryToPath(data.geometries[0].geometry)
  );
});

test('every MapState layer reference is valid', () => {
  const geometryIds = new Set(data.geometries.map(item => item.id));
  const entityIds = new Set(data.entities.map(item => item.id));
  const navigationIds = new Set(data.navigationOptions.map(item => item.id));
  for (const mapState of data.mapStates) {
    assert.match(mapModule.cameraTransform(mapState.camera), /^translate\(500 350\) scale\(/);
    for (const layer of mapState.layerIds) {
      if (layer.geometryId) assert.ok(geometryIds.has(layer.geometryId));
      if (layer.entityId) assert.ok(entityIds.has(layer.entityId));
      if (layer.navigationId) assert.ok(navigationIds.has(layer.navigationId));
    }
  }
});

test('all four StructureView families have semantically distinct map styles', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../../styles/v3/map.css'), 'utf8');
  for (const family of ['lineage', 'composition', 'context', 'historicalNetwork']) {
    assert.ok(mapModule.VIEW_FAMILIES.has(family));
    assert.match(css, new RegExp(`(?:is-|item--).*${family}`));
  }
  assert.match(css, /marker-end/);
  assert.match(css, /stroke-dasharray/);
});

test('the map implementation contains no remote tile, imagery or hillshade dependency', () => {
  assert.doesNotMatch(ownedSource, /https?:\/\//i);
  assert.doesNotMatch(ownedSource, /server\.arcgisonline\.com/i);
  assert.doesNotMatch(ownedSource, /World_Imagery|World_Hillshade/i);
  assert.doesNotMatch(ownedSource, /tile\/\{?z|satellite/i);
  assert.match(ownedSource, /Natural Earth 1:50m physical vectors/);
});

test('there are no user zoom, pan, drag or basemap controls/listeners', () => {
  const js = fs.readFileSync(path.resolve(__dirname, '../../map/v3/map-renderer.js'), 'utf8');
  assert.doesNotMatch(js, /addEventListener\(['"](?:wheel|pointerdown|pointermove|mousedown|mousemove|touchmove)/);
  assert.doesNotMatch(js, /zoom-in|zoom-out|reset-map|basemap|map-mode-switch/);
  assert.match(js, /data-map-navigation-id/);
  assert.match(js, /addEventListener\('click'/);
});

test('approximate geometry and routes remain explicitly qualified', () => {
  assert.ok(data.geometries.every(geometry => !geometry.approximate || /近似|示意|教学/.test(geometry.label)));
  assert.match(ownedSource, /近似教学示意/);
  assert.match(ownedSource, /非精确疆界或路线/);
  assert.match(ownedSource, /近似方向与阶段/);
});

test('CSS covers mobile and reduced-motion without horizontal interaction', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../../styles/v3/map.css'), 'utf8');
  assert.match(css, /@media \(max-width: 780px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /transition: none/);
  assert.doesNotMatch(css, /overflow-x:\s*(auto|scroll)/);
});

test('all runtime asset paths are GitHub Pages-safe relative paths', () => {
  assert.equal(naturalEarthModule.sourcePath, 'data/world-physical.js');
  assert.doesNotMatch(naturalEarthModule.sourcePath, /^(?:\/|[a-z]+:)/i);
  assert.doesNotMatch(ownedSource, /file:\/\/|[A-Z]:\\/);
});
