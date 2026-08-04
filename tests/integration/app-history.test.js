const test = require('node:test');
const assert = require('node:assert/strict');

require('../../app.js');

const {
  homeSections,
  normalizeLastReadSnapshot,
  parseLastReadSnapshot,
  pushHistoryEntryAfterSavingCard,
  shouldResetMediaCard,
  adjacentSceneImageAssets,
  waitForImageReady,
  storyBackMode,
  storyTrailEntityNames
} = globalThis.ATLAS_V5_APP_INTERNALS;
const data = require('../../data/atlas-data.js');
const queries = require('../../data/queries.js');

test('home curation stores stable Card IDs and reads current titles from atlas data', () => {
  assert.deepEqual(homeSections.map(section => section.title), [
    '从一个文明开始',
    '从一个故事开始',
    '从一个遗存开始'
  ]);
  assert.deepEqual(homeSections[0].cardIds, [
    'sumer-measuring-land-time',
    'ancient-egypt-gift-of-nile',
    'indus-civilization-network',
    'china-early-bronze-connected-worlds'
  ]);
  const cardIds = homeSections.flatMap(section => section.cardIds);
  assert.equal(new Set(cardIds).size, 12);
  assert.ok(cardIds.every(cardId => queries.getCard(cardId)));
  assert.ok(homeSections.every(section => Object.keys(section).sort().join(',') === 'cardIds,eyebrow,title'));
});

test('last-read snapshots keep only valid Card, Scene, trail, and scroll state', () => {
  const snapshot = normalizeLastReadSnapshot({
    atlasV5: true,
    cardId: 'tower-of-babel-story-and-etemenanki',
    sceneId: 'tower-of-babel-builders-stay-together',
    scrollY: 640,
    navigationStack: [
      {
        cardId: 'gilgamesh-mortality',
        sceneId: 'gilgamesh-many-tablets',
        scrollY: 320,
        navigationId: 'nav-gilgamesh-babel'
      },
      { cardId: 'missing-card', sceneId: 'missing-scene' }
    ]
  }, queries);
  assert.deepEqual(snapshot, {
    atlasV5: true,
    cardId: 'tower-of-babel-story-and-etemenanki',
    sceneId: 'tower-of-babel-builders-stay-together',
    scrollY: 640,
    navigationStack: [{
      cardId: 'gilgamesh-mortality',
      sceneId: 'gilgamesh-many-tablets',
      scrollY: 320,
      navigationId: 'nav-gilgamesh-babel'
    }]
  });
  assert.equal(normalizeLastReadSnapshot({
    atlasV5: true,
    cardId: 'tower-of-babel-story-and-etemenanki',
    sceneId: 'missing-scene'
  }, queries), null);
  assert.equal(parseLastReadSnapshot('{broken', queries), null);
});

test('the core back control distinguishes story entries from home and direct entries', () => {
  assert.equal(storyBackMode({ atlasV5: true, entrySource: 'card' }), 'story');
  assert.equal(storyBackMode({ atlasV5: true, entrySource: 'home' }), 'home');
  assert.equal(storyBackMode({ atlasV5: true }), 'home');
  assert.equal(storyBackMode(null), 'home');
});

test('the wander trail uses compact primary Entity names and hides on first entry', () => {
  assert.deepEqual(storyTrailEntityNames({
    activeCardId: 'sumer-measuring-land-time',
    navigationStack: []
  }, queries), []);
  assert.deepEqual(storyTrailEntityNames({
    activeCardId: 'ur-iii-reordered-city-world',
    navigationStack: [
      { cardId: 'sumer-measuring-land-time' },
      { cardId: 'akkadian-empire-overview' }
    ]
  }, queries), ['苏美尔文明', '阿卡德王朝', '乌尔第三王朝']);
  assert.ok(data.cards.every(card => queries.getEntity(card.primaryEntityId)));
});

test('the wander trail keeps only the five most recent stories', () => {
  const cardIds = [
    'sumer-measuring-land-time',
    'sumer-uruk-city',
    'cuneiform-overview',
    'akkadian-empire-overview',
    'ur-iii-reordered-city-world',
    'mesopotamian-temple-overview'
  ];
  const names = storyTrailEntityNames({
    activeCardId: cardIds.at(-1),
    navigationStack: cardIds.slice(0, -1).map(cardId => ({ cardId }))
  }, queries);
  const expected = cardIds.slice(-5).map(cardId => {
    const card = queries.getCard(cardId);
    return queries.getEntity(card.primaryEntityId).name;
  });
  assert.deepEqual(names, expected);
});

test('App Card B to home to Card A preserves home and Card B history snapshots', () => {
  const entries = [{
    state: {
      atlasV5: true,
      cardId: 'akkadian-empire-overview',
      sceneId: 'akkadian-empire-city-states',
      scrollY: 0
    },
    hash: '#card/akkadian-empire-overview/akkadian-empire-city-states'
  }];
  let index = 0;
  let scrollY = 864;
  const history = {
    get state() { return entries[index].state; },
    replaceState(state, _title, hash) {
      entries[index] = { state: structuredClone(state), hash };
    },
    pushState(state, _title, hash) {
      entries.splice(index + 1);
      entries.push({ state: structuredClone(state), hash });
      index = entries.length - 1;
    },
    back() {
      if (index > 0) index -= 1;
      return entries[index];
    }
  };
  const cardView = { hidden: false };
  const reader = {
    replaceHistorySnapshot() {
      history.replaceState({
        ...history.state,
        scrollY
      }, '', entries[index].hash);
    }
  };

  assert.equal(pushHistoryEntryAfterSavingCard(
    cardView,
    history,
    reader,
    { atlasHome: true },
    '#home'
  ), true);
  cardView.hidden = true;
  scrollY = 0;

  assert.equal(pushHistoryEntryAfterSavingCard(
    cardView,
    history,
    reader,
    {
      atlasV5: true,
      cardId: 'sumer-measuring-land-time',
      sceneId: 'sumer-water-network',
      scrollY: 0
    },
    '#card/sumer-measuring-land-time/sumer-water-network'
  ), false,
    'opening Card A from home must not replace atlasHome with stale Card B'
  );
  assert.deepEqual(entries[index].state, {
    atlasV5: true,
    cardId: 'sumer-measuring-land-time',
    sceneId: 'sumer-water-network',
    scrollY: 0
  });

  const home = history.back();
  assert.deepEqual(home, { state: { atlasHome: true }, hash: '#home' });
  const cardB = history.back();
  assert.deepEqual(cardB, {
    state: {
      atlasV5: true,
      cardId: 'akkadian-empire-overview',
      sceneId: 'akkadian-empire-city-states',
      scrollY: 864
    },
    hash: '#card/akkadian-empire-overview/akkadian-empire-city-states'
  });
});

test('App retains media within one Card and resets it across Cards', () => {
  assert.equal(shouldResetMediaCard('sumer-measuring-land-time', 'sumer-measuring-land-time'), false);
  assert.equal(shouldResetMediaCard('sumer-measuring-land-time', 'akkadian-empire-overview'), true);
  assert.equal(shouldResetMediaCard(null, 'sumer-measuring-land-time'), true);
});

test('App selects only the nearest distinct image in each Scene direction for preloading', () => {
  const readerModule = require('../../ui/v4/card-reader.js');
  const assets = adjacentSceneImageAssets(
    queries,
    readerModule,
    'sanxingdui-ritual-world',
    'sanxingdui-people-tree-birds',
    'asset-sxd-bronze-tree'
  );
  assert.deepEqual(assets.map(asset => asset.id), [
    'asset-sxd-gold-mask-head',
    'asset-sxd-ivory-tusk'
  ]);
});

test('App waits for image decoding and rejects a completed broken image', async () => {
  let decoded = false;
  const ready = await waitForImageReady({
    complete: true,
    naturalWidth: 1200,
    async decode() { decoded = true; }
  });
  assert.equal(ready.naturalWidth, 1200);
  assert.equal(decoded, true);
  await assert.rejects(
    waitForImageReady({ complete: true, naturalWidth: 0 }),
    /failed to load/
  );
});
