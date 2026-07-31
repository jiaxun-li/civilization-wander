const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const data = require('../../data/v3/atlas-data.js');
const queryModule = require('../../data/v3/queries.js');
const cardsModule = require('../../ui/v3/cards.js');
const readerModule = require('../../ui/v3/card-reader.js');

const queries = queryModule.createAtlasQueries(data);
const components = cardsModule.createCardComponents({ data, queries });

function fakeRoot() {
  return {
    innerHTML: '',
    querySelectorAll() { return []; },
    querySelector() { return null; }
  };
}

function fakeWindow(hash = '') {
  const calls = { push: [], replace: [], scroll: [], listeners: new Map() };
  return {
    location: { hash },
    history: {
      pushState(state, _title, nextHash) {
        calls.push.push({ state, hash: nextHash });
        this.state = state;
      },
      replaceState(state, _title, nextHash) {
        calls.replace.push({ state, hash: nextHash });
        this.state = state;
      },
      state: null
    },
    scrollY: 0,
    scrollTo(x, y) { calls.scroll.push([x, y]); this.scrollY = y; },
    requestAnimationFrame(callback) { callback(); },
    setTimeout(callback) { callback(); return 1; },
    clearTimeout() {},
    addEventListener(type, handler) { calls.listeners.set(type, handler); },
    removeEventListener(type) { calls.listeners.delete(type); },
    calls
  };
}

test('Small, Preview and Main Card presentations use one NavigationOption', () => {
  const small = components.renderSmallCard('nav-buddhism-ashoka');
  const preview = components.renderPreviewCard('nav-buddhism-ashoka');
  const main = components.renderMainCard('buddhism-overview');
  assert.match(small, /class="v3-small-card"/);
  assert.match(small, /data-navigation-id="nav-buddhism-ashoka"/);
  assert.match(preview, /class="v3-preview-card"/);
  assert.match(preview, /下一张 Card/);
  assert.match(main, /class="v3-main-card"/);
  assert.match(main, /data-map-slot/);
  assert.match(main, /data-scene-id="buddhism-ashoka-period"/);
  assert.doesNotMatch(main, /timeline|时间轴|cursorYear/);
});

test('all four migrated Entity default Cards render 4-7 continuous Scenes', () => {
  for (const id of ['buddhism', 'shakyamuni', 'ashoka', 'maurya']) {
    const card = queries.getTargetCardForEntity(id);
    const markup = components.renderMainCard(card.id);
    const matches = [...markup.matchAll(/data-scene-id="([^"]+)"/g)];
    assert.equal(matches.length, card.sceneIds.length);
    assert.ok(matches.length >= 4 && matches.length <= 7);
    assert.match(markup, /<h1 tabindex="-1">/);
    assert.match(markup, /aria-labelledby="scene-title-/);
  }
});

test('hash routes support direct Card and Scene URLs', () => {
  const hash = readerModule.buildCardHash('buddhism-overview', 'buddhism-ashoka-period');
  assert.equal(hash, '#card/buddhism-overview/buddhism-ashoka-period');
  assert.deepEqual(readerModule.parseCardHash(hash), {
    cardId: 'buddhism-overview',
    sceneId: 'buddhism-ashoka-period'
  });
  assert.equal(readerModule.parseCardHash('#entity-buddhism/-260'), null);
});

test('reader activates the direct Scene and emits its MapState', () => {
  const root = fakeRoot();
  const windowRef = fakeWindow('#card/buddhism-overview/buddhism-ashoka-period');
  const mapChanges = [];
  const reader = readerModule.createCardReader({
    data,
    queries,
    components,
    root,
    windowRef,
    onMapStateChange(mapState, scene) { mapChanges.push([mapState.id, scene.id]); }
  });
  reader.start();
  assert.equal(reader.state.activeCardId, 'buddhism-overview');
  assert.equal(reader.state.activeSceneId, 'buddhism-ashoka-period');
  assert.deepEqual(mapChanges.at(-1), ['map-ashoka-network', 'buddhism-ashoka-period']);
  assert.equal(windowRef.history.state.sceneId, 'buddhism-ashoka-period');
});

test('unified navigation covers cross-Entity and related Card jumps', () => {
  const root = fakeRoot();
  const windowRef = fakeWindow('#card/buddhism-overview/buddhism-ashoka-period');
  const reader = readerModule.createCardReader({ data, queries, components, root, windowRef });
  reader.start();
  windowRef.scrollY = 920;
  assert.equal(reader.followNavigation('nav-buddhism-ashoka'), true);
  assert.equal(reader.state.activeCardId, 'ashoka-overview');
  assert.equal(windowRef.calls.replace.at(-1).state.scrollY, 920);
  assert.equal(windowRef.calls.push.at(-1).state.cardId, 'ashoka-overview');

  reader.renderCard('buddhism-overview', 'buddhism-open-network');
  assert.equal(reader.followNavigation('nav-buddhism-networks'), true);
  assert.equal(reader.state.activeCardId, 'buddhism-networks');
});

test('popstate restores the prior Card, Scene and scroll position', () => {
  const root = fakeRoot();
  const windowRef = fakeWindow('');
  const reader = readerModule.createCardReader({ data, queries, components, root, windowRef });
  reader.start();
  reader.handlePopState({
    state: {
      atlasV3: true,
      cardId: 'buddhism-overview',
      sceneId: 'buddhism-ashoka-period',
      scrollY: 1337
    }
  });
  assert.equal(reader.state.activeSceneId, 'buddhism-ashoka-period');
  assert.deepEqual(windowRef.calls.scroll.at(-1), [0, 1337]);
});

test('Preview remains optional and cannot intercept click navigation', () => {
  const source = fs.readFileSync(path.resolve(__dirname, '../../ui/v3/card-reader.js'), 'utf8');
  assert.match(source, /mouseenter/);
  assert.match(source, /focus/);
  assert.match(source, /followNavigation\(control\.dataset\.navigationId\)/);
  assert.doesNotMatch(source, /longpress|touchstart/);
  assert.match(
    components.renderSmallCard('nav-ashoka-maurya'),
    /href="#card\/maurya-overview\/maurya-formation"/
  );
});

test('mobile and reduced-motion CSS preserve ordinary vertical reading', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../../styles/v3/cards.css'), 'utf8');
  assert.match(css, /@media \(max-width: 780px\)/);
  assert.match(css, /overflow-x: clip/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.v3-main-card__media\s*\{[^}]*position: sticky/s);
  assert.doesNotMatch(css, /overflow-x:\s*(auto|scroll)/);
  assert.doesNotMatch(css, /scroll-snap-type/);
});
