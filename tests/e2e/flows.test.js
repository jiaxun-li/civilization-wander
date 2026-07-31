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
  const snapshots = [];
  return {
    location: { hash },
    history: {
      state: null,
      pushState(state, _title, nextHash) {
        this.state = state;
        snapshots.push({ mode: 'push', state: structuredClone(state), hash: nextHash });
      },
      replaceState(state, _title, nextHash) {
        this.state = state;
        snapshots.push({ mode: 'replace', state: structuredClone(state), hash: nextHash });
      }
    },
    scrollY: 0,
    scrollTo(_x, y) { this.scrollY = y; },
    requestAnimationFrame(callback) { callback(); },
    setTimeout(callback) { callback(); return 1; },
    clearTimeout() {},
    addEventListener() {},
    removeEventListener() {},
    snapshots
  };
}

function createReader(hash) {
  const root = fakeRoot();
  const windowRef = fakeWindow(hash);
  const mapChanges = [];
  const reader = readerModule.createCardReader({
    data,
    queries,
    components,
    root,
    windowRef,
    onMapStateChange(mapState, scene) {
      mapChanges.push({ mapStateId: mapState.id, sceneId: scene.id });
    }
  });
  reader.start();
  return { root, windowRef, reader, mapChanges };
}

test('Flow A: Buddhism → Ashoka → Maurya and two back restorations', () => {
  const harness = createReader('#card/buddhism-overview/buddhism-ashoka-period');
  const { reader, windowRef, mapChanges } = harness;
  windowRef.scrollY = 960;
  assert.equal(reader.state.activeSceneId, 'buddhism-ashoka-period');
  assert.equal(mapChanges.at(-1).mapStateId, 'map-ashoka-network');

  reader.followNavigation('nav-buddhism-ashoka');
  assert.equal(reader.state.activeCardId, 'ashoka-overview');
  reader.announceScene(queries.getScene('ashoka-emperor'));
  windowRef.scrollY = 620;
  reader.followNavigation('nav-ashoka-maurya');
  assert.equal(reader.state.activeCardId, 'maurya-overview');

  const ashokaSnapshot = [...windowRef.snapshots].reverse()
    .find(item => item.mode === 'replace' && item.state.cardId === 'ashoka-overview' && item.state.scrollY === 620);
  reader.handlePopState({ state: ashokaSnapshot.state });
  assert.equal(reader.state.activeCardId, 'ashoka-overview');
  assert.equal(reader.state.activeSceneId, 'ashoka-emperor');
  assert.equal(windowRef.scrollY, 620);

  const buddhismSnapshot = windowRef.snapshots
    .find(item => item.mode === 'replace' && item.state.cardId === 'buddhism-overview' && item.state.scrollY === 960);
  reader.handlePopState({ state: buddhismSnapshot.state });
  assert.equal(reader.state.activeCardId, 'buddhism-overview');
  assert.equal(reader.state.activeSceneId, 'buddhism-ashoka-period');
  assert.equal(windowRef.scrollY, 960);
  assert.equal(mapChanges.at(-1).mapStateId, 'map-ashoka-network');
});

test('Flow B: same-Entity related Card returns to the source position', () => {
  const { reader, windowRef } = createReader('#card/buddhism-overview/buddhism-open-network');
  windowRef.scrollY = 1180;
  reader.followNavigation('nav-buddhism-networks');
  assert.equal(reader.state.activeCardId, 'buddhism-networks');
  const source = windowRef.snapshots.find(item =>
    item.mode === 'replace' && item.state.cardId === 'buddhism-overview' && item.state.scrollY === 1180
  );
  reader.handlePopState({ state: source.state });
  assert.equal(reader.state.activeSceneId, 'buddhism-open-network');
  assert.equal(windowRef.scrollY, 1180);
});

test('Flow C: direct Card/Scene URL is stable across refresh', () => {
  const hash = '#card/ashoka-overview/ashoka-edicts';
  const first = createReader(hash);
  const refreshed = createReader(hash);
  assert.deepEqual(
    [first.reader.state.activeCardId, first.reader.state.activeSceneId, first.mapChanges.at(-1).mapStateId],
    ['ashoka-overview', 'ashoka-edicts', 'map-ashoka-edicts']
  );
  assert.deepEqual(refreshed.reader.state, first.reader.state);
});

test('Flow D: mobile needs no hover and has no horizontal scrolling contract', () => {
  const markup = components.renderMainCard('buddhism-overview');
  const styles = [
    fs.readFileSync(path.resolve(__dirname, '../../styles.css'), 'utf8'),
    fs.readFileSync(path.resolve(__dirname, '../../styles/v3/cards.css'), 'utf8'),
    fs.readFileSync(path.resolve(__dirname, '../../styles/v3/map.css'), 'utf8')
  ].join('\n');
  assert.match(markup, /href="#card\/ashoka-overview\/ashoka-emperor"/);
  assert.match(markup, /data-navigation-id="nav-buddhism-ashoka"/);
  assert.match(styles, /@media \(max-width: 780px\)/);
  assert.doesNotMatch(styles, /overflow-x:\s*(auto|scroll)/);
  assert.doesNotMatch(markup, /onmouseover|onmouseenter/);
});

