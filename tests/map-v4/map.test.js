const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const data = require('../../data/atlas-data.js');
const { queriesModule: queries } = require('../../src/data/queries.ts');
const mapModule = require('../../src/map/map-renderer.ts');
const naturalEarthModule = require('../../assets/natural-earth/base.js');

function classList() {
  const values = new Set();
  return {
    add(...items) { items.forEach(item => values.add(item)); },
    remove(...items) { items.forEach(item => values.delete(item)); },
    contains(item) { return values.has(item); }
  };
}

function overlayElement(extra = {}) {
  const element = {
    markup: '',
    writes: 0,
    classList: classList(),
    set innerHTML(value) { this.markup = value; this.writes += 1; },
    get innerHTML() { return this.markup; }
  };
  return Object.assign(element, extra);
}

function pathElement() {
  return {
    attributes: {},
    writes: 0,
    setAttribute(name, value) {
      this.attributes[name] = value;
      this.writes += 1;
    }
  };
}

function createMapHarness(
  reducedMotion = false,
  queryApi = queries,
  atlasData = data,
  deferTransitions = false,
  naturalEarthData = null
) {
  const timers = new Map();
  let nextTimerId = 1;
  const elements = {
    root: { dataset: {}, classList: classList() },
    camera: {
      style: {},
      attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; }
    },
    historical: overlayElement(),
    land: pathElement(),
    lakes: pathElement(),
    rivers: pathElement(),
    nodes: overlayElement({ querySelectorAll() { return []; } }),
    legend: overlayElement(),
    description: { textContent: '' }
  };
  const selectorMap = new Map([
    ['[data-v4-map]', elements.root],
    ['[data-map-camera]', elements.camera],
    ['[data-map-land]', elements.land],
    ['[data-map-lakes]', elements.lakes],
    ['[data-map-historical]', elements.historical],
    ['[data-map-rivers]', elements.rivers],
    ['[data-map-nodes]', elements.nodes],
    ['[data-map-legend]', elements.legend],
    ['#v4-map-description', elements.description]
  ]);
  const container = {
    markup: '',
    set innerHTML(value) { this.markup = value; },
    get innerHTML() { return this.markup; },
    querySelector(selector) { return selectorMap.get(selector) || null; }
  };
  const windowRef = {
    matchMedia() { return { matches: reducedMotion }; },
    requestAnimationFrame(callback) { callback(); },
    setTimeout(callback) {
      const id = nextTimerId++;
      if (deferTransitions) timers.set(id, callback);
      else callback();
      return id;
    },
    clearTimeout(id) { timers.delete(id); }
  };
  const map = mapModule.createNaturalEarthMap({
    container,
    data: atlasData,
    queries: queryApi,
    naturalEarth: naturalEarthData || {
      size: 4096,
      landPath: 'M0 0L10 0L10 10Z',
      lakes: [],
      rivers: []
    },
    documentRef: { defaultView: windowRef },
    windowRef
  });
  return {
    map,
    elements,
    pendingTransitionCount() { return timers.size; },
    snapshotTransitionCallbacks() { return Array.from(timers.values()); },
    flushTransitions() {
      while (timers.size) {
        const pending = Array.from(timers.values());
        timers.clear();
        pending.forEach(callback => callback());
      }
    }
  };
}

function sceneMap(sceneId, transition) {
  const scene = queries.getScene(sceneId);
  const config = structuredClone(scene.presentation.map);
  if (transition) config.transition = transition;
  return { scene, mapState: queries.getMapState(config.mapStateId), config };
}

let cachedWorldBase = null;

function worldBase() {
  if (cachedWorldBase) return cachedWorldBase;
  const sandbox = { window: {} };
  vm.runInNewContext(
    fs.readFileSync(path.resolve(__dirname, '../../data/world-physical.js'), 'utf8'),
    sandbox
  );
  cachedWorldBase = naturalEarthModule.createNaturalEarthBase(sandbox.window.ATLAS_WORLD_VECTOR);
  return cachedWorldBase;
}

test('Natural Earth adapter retains every eligible river segment', () => {
  const rivers = Array.from({ length: 461 }, (_, index) => ({ d: `M${index} 0L${index} 1`, rank: 6 }));
  const base = naturalEarthModule.createNaturalEarthBase({ size: 4096, landPath: 'M0 0Z', rivers });
  assert.equal(base.rivers.length, 461);
  assert.equal(base.rivers.at(-1).d, 'M460 0L460 1');
  assert.deepEqual(base.rivers.at(-1).bounds, [460, 0, 460, 1]);
  assert.equal(base.land.length, 1);
  assert.deepEqual(base.land[0].bounds, [0, 0, 0, 0]);
});

test('the base layers start as three regional path placeholders', () => {
  const container = {
    markup: '',
    set innerHTML(value) { this.markup = value; },
    get innerHTML() { return this.markup; },
    querySelector() { return null; }
  };
  mapModule.createNaturalEarthMap({
    container,
    data,
    queries,
    naturalEarth: {
      size: 4096,
      landPath: 'M0 0Z',
      lakes: [],
      rivers: [{ d: 'M1 1L2 2' }, { d: 'M3 3L4 4' }]
    },
    documentRef: { defaultView: {} },
    windowRef: {}
  });
  const riverGroup = container.markup.match(/<g class="v4-map__rivers">([\s\S]*?)<\/g>/)?.[1] || '';
  assert.match(container.markup, /data-map-land d=""/);
  assert.match(container.markup, /data-map-lakes d=""/);
  assert.equal((riverGroup.match(/<path\b/g) || []).length, 1);
  assert.match(riverGroup, /data-map-rivers d=""/);
  assert.doesNotMatch(riverGroup, /M1 1L2 2|M3 3L4 4/);
});

test('Egypt camera selects a regional river subset while retaining the Nile corridor', () => {
  const base = worldBase();
  const selected = mapModule.selectRegionalPaths(
    base.rivers,
    [{ id: 'egypt', center: [31.4, 27.8], scale: 4.8 }],
    base.size
  );
  assert.ok(selected.length > 0);
  assert.ok(selected.length < base.rivers.length / 2);
  assert.ok(
    selected.some(item =>
      item.bounds[0] < 2400 && item.bounds[2] > 2420 &&
      item.bounds[1] < 1700 && item.bounds[3] > 1815
    ),
    'the long Nile path through Egypt must remain in the regional subset'
  );
});

test('one Card keeps the same regional land, lake, and river paths across Scenes', () => {
  const harness = createMapHarness(false, queries, data, false, worldBase());
  const first = sceneMap('egypt-middle-thebes-reunifies', 'cut');
  harness.map.renderMapState(first.mapState, first.scene, first.config, {
    cardId: 'egypt-middle-kingdom-overview',
    trigger: 'direct',
    direction: 'stationary',
    toSceneId: first.scene.id
  });
  const writes = {
    land: harness.elements.land.writes,
    lakes: harness.elements.lakes.writes,
    rivers: harness.elements.rivers.writes
  };
  const second = sceneMap('egypt-middle-avaris', 'cut');
  harness.map.renderMapState(second.mapState, second.scene, second.config, {
    cardId: 'egypt-middle-kingdom-overview',
    trigger: 'scroll',
    direction: 'forward',
    fromSceneId: first.scene.id,
    toSceneId: second.scene.id
  });
  assert.deepEqual({
    land: harness.elements.land.writes,
    lakes: harness.elements.lakes.writes,
    rivers: harness.elements.rivers.writes
  }, writes);
  assert.equal(harness.elements.root.dataset.baseRegion, 'egypt-middle-kingdom-overview');
});

test('local projection and every supported geometry type are deterministic', () => {
  assert.deepEqual(mapModule.projectPoint([0, 0], 4096), [2048, 2048]);
  const geometries = [
    { type: 'Point', coordinates: [0, 0] },
    { type: 'MultiPoint', coordinates: [[0, 0], [1, 1]] },
    { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
    { type: 'MultiLineString', coordinates: [[[0, 0], [1, 1]]] },
    { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] },
    { type: 'MultiPolygon', coordinates: [[[[0, 0], [1, 0], [1, 1], [0, 0]]]] }
  ];
  for (const geometry of geometries) assert.match(mapModule.geometryToPath(geometry), /^M/);
});

test('CameraPreset is applied and cut, ease, and hold produce different camera behavior', () => {
  const { map, elements } = createMapHarness();
  const cut = sceneMap('indus-shared-measures', 'cut');
  map.renderMapState(cut.mapState, cut.scene, cut.config);
  const firstTransform = elements.camera.attributes.transform;
  assert.equal(elements.root.dataset.effectiveCameraTransition, 'cut');

  const ease = sceneMap('indus-meluhha-ships', 'ease');
  map.renderMapState(ease.mapState, ease.scene, ease.config);
  const easedTransform = elements.camera.attributes.transform;
  assert.notEqual(easedTransform, firstTransform);
  assert.equal(elements.root.dataset.effectiveCameraTransition, 'ease');
  assert.match(elements.camera.style.transition, /transform 420ms/);

  const hold = sceneMap('indus-network-changes-shape', 'hold');
  map.renderMapState(hold.mapState, hold.scene, hold.config);
  assert.equal(elements.camera.attributes.transform, easedTransform);
  assert.equal(elements.root.dataset.effectiveCameraTransition, 'hold');
  assert.match(elements.historical.innerHTML, /geometry-indus-post-urban-focus/);
});

test('adjacent scrolling promotes cut to the 200ms camera animation', () => {
  const { map, elements } = createMapHarness();
  const first = sceneMap('indus-shared-measures', 'cut');
  map.renderMapState(first.mapState, first.scene, first.config, {
    trigger: 'direct', direction: 'stationary', toSceneId: first.scene.id
  });
  const next = sceneMap('indus-meluhha-ships', 'cut');
  map.renderMapState(next.mapState, next.scene, next.config, {
    trigger: 'scroll', direction: 'forward', fromSceneId: first.scene.id, toSceneId: next.scene.id
  });
  assert.equal(elements.root.dataset.effectiveCameraTransition, 'ease');
  assert.match(elements.camera.style.transition, /transform 200ms/);
});

test('validated camera boundary scales affect transforms without renderer clamping', () => {
  for (const scale of [0.7, 12]) {
    const candidate = structuredClone(data);
    candidate.cameraPresets[0].scale = scale;
    assert.equal(queries.validateAtlasData(candidate).valid, true);
    const expectedScale = (scale * (1000 / 4096)).toFixed(5);
    assert.match(mapModule.cameraTransform(candidate.cameraPresets[0], 4096), new RegExp(`scale\\(${expectedScale}\\)`));
  }
});

test('reduced motion degrades ease to cut without changing source presentation', () => {
  const { map, elements } = createMapHarness(true);
  const ease = sceneMap('indus-meluhha-ships', 'ease');
  map.renderMapState(ease.mapState, ease.scene, ease.config);
  assert.equal(ease.config.transition, 'ease');
  assert.equal(elements.root.dataset.effectiveCameraTransition, 'cut');
  assert.equal(elements.camera.style.transition, 'none');
});

test('direct and history entry force a camera cut on an existing map', () => {
  const { map, elements } = createMapHarness();
  const first = sceneMap('indus-shared-measures', 'cut');
  map.renderMapState(first.mapState, first.scene, first.config, { trigger: 'direct', direction: 'stationary', toSceneId: first.scene.id });
  const next = sceneMap('indus-meluhha-ships', 'ease');
  map.renderMapState(next.mapState, next.scene, next.config, { trigger: 'history', direction: 'stationary', toSceneId: next.scene.id });
  assert.equal(elements.root.dataset.effectiveCameraTransition, 'cut');
  assert.equal(elements.root.dataset.overlayTransition, 'none');
});

test('directional overlay crossfade replaces old geometry and nodes after its leaving phase', () => {
  const harness = createMapHarness(false, queries, data, true);
  const first = sceneMap('indus-shared-measures');
  harness.map.renderMapState(first.mapState, first.scene, first.config, { trigger: 'direct', direction: 'stationary', toSceneId: first.scene.id });
  assert.match(harness.elements.historical.innerHTML, /geometry-indus-major-settlements/);

  const next = sceneMap('indus-meluhha-ships');
  harness.map.renderMapState(next.mapState, next.scene, next.config, {
    trigger: 'scroll', direction: 'forward', fromSceneId: first.scene.id, toSceneId: next.scene.id, inheritedMedia: false
  });
  assert.match(harness.elements.historical.innerHTML, /geometry-indus-major-settlements/);
  harness.flushTransitions();
  assert.doesNotMatch(harness.elements.historical.innerHTML, /geometry-indus-major-settlements/);
  assert.match(harness.elements.historical.innerHTML, /geometry-indus-western-exchange/);
  assert.match(harness.elements.nodes.innerHTML, /annotation-indus-exchange-coast/);
});

test('repeated activation keeps unchanged map DOM stable', () => {
  const harness = createMapHarness(false, queries, data, true);
  const context = sceneMap('indus-shared-measures');
  const direct = { trigger: 'direct', direction: 'stationary', toSceneId: context.scene.id };
  harness.map.setStructureViews(context.config.structureViewIds.map(id => queries.getStructureView(id)), context.scene, direct);
  harness.map.renderMapState(context.mapState, context.scene, context.config, direct);
  const writes = [harness.elements.historical.writes, harness.elements.nodes.writes, harness.elements.legend.writes];
  harness.map.setStructureViews(context.config.structureViewIds.map(id => queries.getStructureView(id)), context.scene, direct);
  harness.map.renderMapState(context.mapState, context.scene, context.config, direct);
  assert.deepEqual([harness.elements.historical.writes, harness.elements.nodes.writes, harness.elements.legend.writes], writes);
});

test('a reversed overlay transition invalidates stale callbacks', () => {
  const harness = createMapHarness(false, queries, data, true);
  const first = sceneMap('indus-shared-measures');
  const direct = { trigger: 'direct', direction: 'stationary', toSceneId: first.scene.id };
  harness.map.renderMapState(first.mapState, first.scene, first.config, direct);
  const committed = harness.elements.historical.innerHTML;
  const next = sceneMap('indus-meluhha-ships');
  harness.map.renderMapState(next.mapState, next.scene, next.config, { trigger: 'scroll', direction: 'forward', fromSceneId: first.scene.id, toSceneId: next.scene.id });
  const staleCallbacks = harness.snapshotTransitionCallbacks();
  harness.map.renderMapState(first.mapState, first.scene, first.config, { trigger: 'scroll', direction: 'backward', fromSceneId: next.scene.id, toSceneId: first.scene.id });
  staleCallbacks.forEach(callback => callback());
  assert.equal(harness.pendingTransitionCount(), 0);
  assert.equal(harness.elements.historical.innerHTML, committed);
});

test('reduced motion disables directional camera and overlay animation', () => {
  const harness = createMapHarness(true, queries, data, true);
  const first = sceneMap('indus-shared-measures');
  harness.map.renderMapState(first.mapState, first.scene, first.config, { trigger: 'direct', direction: 'stationary', toSceneId: first.scene.id });
  const next = sceneMap('indus-meluhha-ships', 'ease');
  harness.map.renderMapState(next.mapState, next.scene, next.config, { trigger: 'scroll', direction: 'forward', fromSceneId: first.scene.id, toSceneId: next.scene.id });
  assert.equal(harness.elements.root.dataset.effectiveCameraTransition, 'cut');
  assert.equal(harness.elements.root.dataset.overlayTransition, 'none');
  assert.match(harness.elements.historical.innerHTML, /geometry-indus-western-exchange/);
});

test('MapState supplies geometry while the current Scene supplies annotations', () => {
  const { map, elements } = createMapHarness();
  const context = sceneMap('indus-shared-measures');
  map.renderMapState(context.mapState, context.scene, context.config);
  assert.match(elements.historical.innerHTML, /geometry-indus-major-settlements/);
  assert.match(elements.nodes.innerHTML, /annotation-mohenjo-daro-site-label/);
  assert.match(elements.nodes.innerHTML, /annotation-indus-major-cities-label/);
});

test('screenCallout is not projected while geo annotations can be projected explicitly', () => {
  const camera = { center: [70, 35], scale: 3.2 };
  const screen = { anchor: { kind: 'screen' }, anchorMeaning: 'screenCallout' };
  assert.equal(mapModule.projectAnnotation(screen, camera), null);
  const projected = mapModule.projectAnnotation({ anchor: { kind: 'geo', coordinates: [70, 35] } }, camera);
  assert.deepEqual(projected.map(value => Math.round(value)), [50, 50]);
});

test('geographic labels are enabled for the western exchange map and cleared afterward', () => {
  const { map, elements } = createMapHarness();
  const context = sceneMap('indus-meluhha-ships');
  map.renderMapState(context.mapState, context.scene, context.config);
  assert.equal(elements.root.classList.contains('has-geographic-labels'), true);
  assert.match(elements.nodes.innerHTML, /annotation-indus-exchange-coast/);
  assert.match(elements.nodes.innerHTML, /annotation-indus-exchange-mesopotamia/);
  map.clear();
  assert.equal(elements.root.classList.contains('has-geographic-labels'), false);
});

test('the network transformation map labels both visual layers', () => {
  const { map, elements } = createMapHarness();
  const context = sceneMap('indus-network-changes-shape');
  map.renderMapState(context.mapState, context.scene, context.config);
  assert.match(elements.nodes.innerHTML, /annotation-indus-mature-cities/);
  assert.match(elements.nodes.innerHTML, /annotation-indus-later-settlements/);
});

test('the other Ancient India maps expose geographic text beside their symbols', () => {
  let harness = createMapHarness();
  let context = sceneMap('mohenjo-daro-partial-city');
  harness.map.renderMapState(context.mapState, context.scene, context.config);
  assert.match(harness.elements.nodes.innerHTML, /annotation-mohenjo-daro-site-label/);

  harness = createMapHarness();
  context = sceneMap('indus-shared-measures');
  harness.map.renderMapState(context.mapState, context.scene, context.config);
  assert.match(harness.elements.nodes.innerHTML, /annotation-mohenjo-daro-site-label/);
  assert.match(harness.elements.nodes.innerHTML, /annotation-indus-major-cities-label/);
  assert.match(harness.elements.nodes.innerHTML, /is-placement-left/);
  assert.match(harness.elements.nodes.innerHTML, /is-placement-right/);
});

test('all Mesopotamian map Scenes render their geographic text labels', () => {
  const expected = new Map([
    ['sumer-water-network', ['annotation-mesopotamia-uruk-site']],
    ['sumer-uruk-gathering', ['annotation-mesopotamia-uruk-site']],
    ['mesopotamian-temple-eridu', ['annotation-mesopotamia-temple-cities']],
    ['akkadian-empire-city-states', ['annotation-akkadian-southern-city-world']],
    ['ur-iii-rises-after-akkad', ['annotation-ur-iii-core-region']]
  ]);
  for (const [sceneId, annotationIds] of expected) {
    const harness = createMapHarness();
    const context = sceneMap(sceneId);
    harness.map.renderMapState(context.mapState, context.scene, context.config);
    assert.equal(harness.elements.root.classList.contains('has-geographic-labels'), true, sceneId);
    for (const annotationId of annotationIds) {
      assert.match(harness.elements.nodes.innerHTML, new RegExp(annotationId), sceneId);
    }
  }
});

test('StructureView query results are consumed in generated legend counts', () => {
  const fixtureData = structuredClone(data);
  fixtureData.structureViews.push({
    id: 'view-test-sumer-network',
    family: 'historicalNetwork',
    title: '测试内结构视图',
    query: {
      endpointKinds: ['entity'],
      edgeFamilies: ['historicalNetwork'],
      edgeTypes: ['city_within_cultural_tradition'],
      direction: 'outgoing'
    },
    depth: 1,
    maxVisible: 4,
    includeEntityIds: ['uruk'],
    display: 'cards'
  });
  const fixtureQueries = queries.createQueries(fixtureData);
  const { map, elements } = createMapHarness(false, fixtureQueries, fixtureData);
  const scene = fixtureQueries.getScene('sumer-water-network');
  map.setStructureViews([fixtureQueries.getStructureView('view-test-sumer-network')], scene);
  assert.match(elements.legend.innerHTML, /data-structure-view-id="view-test-sumer-network"/);
  assert.match(elements.legend.innerHTML, /data-structure-item-count="[1-9]/);
});

test('clear removes prior geometry, nodes, caption state, and active map identity', () => {
  const { map, elements } = createMapHarness();
  const context = sceneMap('indus-shared-measures');
  map.renderMapState(context.mapState, context.scene, context.config);
  map.clear();
  assert.equal(elements.historical.innerHTML, '');
  assert.equal(elements.nodes.innerHTML, '');
  assert.equal(map.getActiveMapState(), null);
});

test('map runtime has no network, zoom, pan, drag, or basemap controls', () => {
  const source = [
    fs.readFileSync(path.resolve(__dirname, '../../src/map/map-renderer.ts'), 'utf8'),
    fs.readFileSync(path.resolve(__dirname, '../../styles/v4/map.css'), 'utf8')
  ].join('\n');
  assert.doesNotMatch(source, /https?:\/\//i);
  assert.doesNotMatch(source, /addEventListener\(['"](?:wheel|pointerdown|pointermove|mousedown|touchmove)/);
  assert.doesNotMatch(source, /zoom-in|zoom-out|reset-map|basemap|map-mode-switch/);
  assert.match(source, /prefers-reduced-motion/);
});
