const test = require('node:test');
const assert = require('node:assert/strict');

const data = require('../../data/atlas-data.js');
const queries = require('../../data/queries.js');
const cardsModule = require('../../src/reader/card-components.ts');
const readerModule = require('../../src/reader/card-reader.ts');

const components = cardsModule.createCardComponents({ data, queries });

function fakeRoot() {
  return { innerHTML: '', querySelectorAll() { return []; }, querySelector() { return null; } };
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
    clearTimeout() {}, addEventListener() {}, removeEventListener() {}, snapshots
  };
}

function harness(hash) {
  const windowRef = fakeWindow(hash);
  const presentationChanges = [];
  const mapChanges = [];
  const reader = readerModule.createCardReader({
    data, queries, components, root: fakeRoot(), windowRef,
    onPresentationChange(presentation, scene) {
      presentationChanges.push({ kind: presentation.kind, sceneId: scene.id });
    },
    onMapStateChange(mapState, scene, mapConfig) {
      mapChanges.push({ mapStateId: mapState?.id || null, transition: mapConfig?.transition || null, sceneId: scene.id });
    }
  });
  reader.start();
  return { reader, windowRef, presentationChanges, mapChanges };
}

test('V5 flow: story-opening navigation to Akkadian and Ur III with two restorations', () => {
  const { reader, windowRef } = harness('#card/sumer-measuring-land-time/sumer-methods-outlast-dynasties');
  windowRef.scrollY = 960;
  reader.followNavigation('nav-sumer-akkadian-empire');
  assert.deepEqual([reader.state.activeCardId, reader.state.activeSceneId], ['akkadian-empire-overview', 'akkadian-empire-city-states']);
  windowRef.scrollY = 620;
  reader.followNavigation('nav-akkadian-ur-iii');
  assert.deepEqual([reader.state.activeCardId, reader.state.activeSceneId], ['ur-iii-reordered-city-world', 'ur-iii-rises-after-akkad']);

  const akkadianSnapshot = [...windowRef.snapshots].reverse().find(item =>
    item.mode === 'replace' && item.state.cardId === 'akkadian-empire-overview' && item.state.scrollY === 620
  );
  reader.handlePopState({ state: akkadianSnapshot.state });
  assert.equal(windowRef.scrollY, 620);

  const sumerSnapshot = windowRef.snapshots.find(item =>
    item.mode === 'replace' && item.state.cardId === 'sumer-measuring-land-time' && item.state.scrollY === 960
  );
  reader.handlePopState({ state: sumerSnapshot.state });
  assert.deepEqual([reader.state.activeCardId, reader.state.activeSceneId, windowRef.scrollY], [
    'sumer-measuring-land-time', 'sumer-methods-outlast-dynasties', 960
  ]);
});

test('V5 flow: Aegean direct link crosses Crete, Mycenae, and the Dark Age with restoration', () => {
  const { reader, windowRef } = harness('#card/crete-through-palatial-age/crete-tablets-change-language');
  windowRef.scrollY = 740;
  reader.followNavigation('nav-crete-mycenae');
  assert.deepEqual([reader.state.activeCardId, reader.state.activeSceneId], [
    'mycenae-graves-palaces-tablets', 'mycenae-gold-enters-graves'
  ]);

  reader.announceScene(data.scenes.find(scene => scene.id === 'mycenae-palaces-stop-commanding'));
  windowRef.scrollY = 510;
  reader.followNavigation('nav-mycenae-dark-age');
  assert.deepEqual([reader.state.activeCardId, reader.state.activeSceneId], [
    'greece-reconnects-after-palaces', 'dark-age-orders-stop-tablets'
  ]);

  const mycenaeSnapshot = [...windowRef.snapshots].reverse().find(item =>
    item.mode === 'replace' && item.state.cardId === 'mycenae-graves-palaces-tablets' && item.state.scrollY === 510
  );
  reader.handlePopState({ state: mycenaeSnapshot.state });
  assert.deepEqual([reader.state.activeCardId, reader.state.activeSceneId, windowRef.scrollY], [
    'mycenae-graves-palaces-tablets', 'mycenae-palaces-stop-commanding', 510
  ]);
});

test('V5 flow: textOnly direct link inherits prior same-story media across refresh', () => {
  const hash = '#card/sumer-measuring-land-time/sumer-methods-outlast-dynasties';
  const first = harness(hash);
  const refreshed = harness(hash);
  assert.deepEqual(first.presentationChanges.at(-1), { kind: 'imageAndText', sceneId: 'sumer-methods-outlast-dynasties' });
  assert.deepEqual(first.mapChanges.at(-1), { mapStateId: null, transition: null, sceneId: 'sumer-methods-outlast-dynasties' });
  assert.deepEqual(refreshed.reader.state, first.reader.state);
});

test('V5 flow: every active story remains readable', () => {
  for (const card of data.cards) {
    const instance = harness(`#card/${card.id}/${card.sceneIds[0]}`);
    assert.equal(instance.reader.state.activeCardId, card.id);
    assert.ok(instance.reader.state.activeSceneId);
    assert.match(components.renderMainCard(card.id), new RegExp(`data-card-id="${card.id}"`));
  }
});
