const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const data = require('../../data/atlas-data.js');
const queries = require('../../data/queries.js');
const cardsModule = require('../../src/reader/card-components.ts');
const readerModule = require('../../src/reader/card-reader.ts');

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

test('approved Entity types have stable public labels', () => {
  const primaryTypes = new Set(data.cards.map(card => queries.getEntity(card.primaryEntityId).type));
  for (const type of primaryTypes) {
    assert.equal(typeof queries.getEntityTypeLabel(type), 'string');
    assert.ok(queries.getEntityTypeLabel(type).length > 0);
  }
});

test('the story header combines the primary Entity name and its generated years without the Entity type', () => {
  const markup = components.renderMainCard('greek-heroes-live-in-song');
  assert.match(markup, /<p class="v4-main-card__coordinate">希腊英雄传统 · 约公元前1600—前800年<\/p>/);
  assert.doesNotMatch(markup, /<p class="v4-main-card__coordinate">宗教与神话 ·/);
  assert.match(
    components.renderMainCard('assyria-orders-cross-empire'),
    /<p class="v4-main-card__coordinate">新亚述帝国 · 约公元前911—前609年<\/p>/
  );
  assert.equal(cardsModule.formatTimeSpan({ start: -44, end: 14 }), '公元前44—公元14年');
  assert.equal(cardsModule.formatTimeSpan({ start: 618, end: 907 }), '公元618—907年');
});

test('typed public blocks render semantic markup and escape untrusted text', () => {
  assert.match(
    components.renderContentBlock({
      id: 'case', kind: 'historicalCase', title: '<证据>', text: 'a & b', eventIds: ['event'], sourceIds: ['source']
    }),
    /<strong>&lt;证据&gt;<\/strong> a &amp; b/
  );
  assert.match(
    components.renderContentBlock({
      id: 'mechanism', kind: 'mechanism', statement: '组合条件', steps: ['第一步', '第二步'], sourceIds: ['source']
    }),
    /<ol><li>第一步<\/li><li>第二步<\/li><\/ol>/
  );
});

test('every Scene displays timeSpan.label instead of the free-form eyebrow', () => {
  const markup = components.renderMainCard('sumer-measuring-land-time');
  assert.match(markup, /<p class="v4-scene__time">约公元前3500—前2000年 <span class="v4-scene__progress">· 01 \/ 05<\/span><\/p>/);
  assert.match(markup, /<span class="v4-scene__progress">· 05 \/ 05<\/span>/);
  assert.doesNotMatch(markup, /<p class="v4-scene__time">南部美索不达米亚<\/p>/);
  assert.doesNotMatch(markup, /v4-scene__eyebrow/);
});

test('undated epic episodes keep the time line with one fixed public label', () => {
  const markup = components.renderMainCard('gilgamesh-mortality');
  assert.match(markup, /<p class="v4-scene__time">约公元前2000—前600年 <span class="v4-scene__progress">· 01 \/ 09<\/span><\/p>/);
  assert.equal((markup.match(/<p class="v4-scene__time">叙事时间 · 无可考年份 <span class="v4-scene__progress">· \d{2} \/ 09<\/span><\/p>/g) || []).length, 8);
  assert.doesNotMatch(markup, /<p class="v4-scene__time">约公元前1000—前600年/);
});

test('internal editorial purpose and review never enter default public markup', () => {
  const markup = components.renderMainCard('sumer-measuring-land-time');
  const card = queries.getCard('sumer-measuring-land-time');
  assert.doesNotMatch(markup, /EditorialReview|NavigationPlacement|ScenePresentation/);
  assert.equal(markup.includes(card.editorialPurpose), false);
  for (const block of card.editorialReview.limitations) assert.equal(markup.includes(block.text), false);
  assert.throws(() => components.renderContentBlock({
    id: 'internal-only', kind: 'limitation', text: 'INTERNAL-LIMITATION-SENTINEL', sourceIds: [card.sourceIds[0]]
  }), /not valid public Scene content/);
});

test('text-only stories create no media dependency and ordinary links retain fallback hashes', () => {
  const fixtureData = structuredClone(data);
  const card = fixtureData.cards.find(item => item.id === 'sumer-measuring-land-time');
  for (const sceneId of card.sceneIds) {
    fixtureData.scenes.find(scene => scene.id === sceneId).presentation = { kind: 'textOnly' };
  }
  const fixtureQueries = queries.createQueries(fixtureData);
  const fixtureComponents = cardsModule.createCardComponents({ data: fixtureData, queries: fixtureQueries });
  const markup = fixtureComponents.renderMainCard(card.id);
  assert.match(markup, /is-text-only-card/);
  assert.doesNotMatch(markup, /data-map-slot/);
  assert.match(markup, /href="#card\/akkadian-empire-overview\/akkadian-empire-city-states"/);
});

test('the Sumer and Uruk stories render their approved navigation and media rhythm', () => {
  const sumer = components.renderMainCard('sumer-measuring-land-time');
  assert.equal((sumer.match(/data-scene-id=/g) || []).length, 5);
  assert.equal((sumer.match(/data-presentation-kind="imageAndText"/g) || []).length, 3);
  assert.match(sumer, /data-navigation-id="nav-sumer-akkadian-empire"/);
  assert.match(sumer, /data-navigation-id="nav-sumer-ur-iii"/);

  const uruk = components.renderMainCard('sumer-uruk-city');
  assert.equal((uruk.match(/data-scene-id=/g) || []).length, 4);
  assert.match(uruk, /data-navigation-id="nav-uruk-akkadian-empire"/);
  assert.match(uruk, /data-navigation-id="nav-uruk-gilgamesh"/);
});

test('the Mesopotamian stories retain reciprocal curated entrances', () => {
  const akkadian = components.renderMainCard('akkadian-empire-overview');
  assert.equal((akkadian.match(/data-navigation-id="nav-akkadian-uruk"/g) || []).length, 1);
  assert.equal((akkadian.match(/data-navigation-id="nav-akkadian-sumer"/g) || []).length, 1);
  assert.match(components.renderMainCard('gilgamesh-mortality'), /data-navigation-id="nav-gilgamesh-uruk"/);
  assert.match(components.renderMainCard('cuneiform-overview'), /data-navigation-id="nav-cuneiform-sumer"/);
  const temple = components.renderMainCard('mesopotamian-temple-overview');
  const urIII = components.renderMainCard('ur-iii-reordered-city-world');
  assert.match(temple, /data-navigation-id="nav-temple-ur-iii"/);
  assert.match(urIII, /data-navigation-id="nav-ur-iii-mesopotamian-temple"/);
  assert.ok(temple.indexOf('data-scene-id="mesopotamian-temple-ur"') < temple.indexOf('data-navigation-id="nav-temple-ur-iii"'));
  assert.ok(urIII.indexOf('data-scene-id="ur-iii-building-order"') < urIII.indexOf('data-navigation-id="nav-ur-iii-mesopotamian-temple"'));
});

test('the Ancient India stories render approved scene and media counts', () => {
  const mohenjo = components.renderMainCard('mohenjo-daro-urban-order');
  assert.equal((mohenjo.match(/data-scene-id=/g) || []).length, 5);
  assert.equal((mohenjo.match(/data-presentation-kind="imageAndText"/g) || []).length, 4);
  assert.match(mohenjo, /data-navigation-id="nav-mohenjo-daro-indus-civilization"/);

  const indus = components.renderMainCard('indus-civilization-network');
  assert.equal((indus.match(/data-scene-id=/g) || []).length, 6);
  assert.equal((indus.match(/data-presentation-kind="mapAndText"/g) || []).length, 3);
  assert.match(indus, /data-navigation-id="nav-indus-civilization-mohenjo-daro"/);
  const firstScene = indus.indexOf('data-scene-id="indus-shared-measures"');
  const cityLink = indus.indexOf('data-navigation-id="nav-indus-civilization-mohenjo-daro"');
  const secondScene = indus.indexOf('data-scene-id="indus-seals-image-and-signs"');
  assert.ok(firstScene < cityLink && cityLink < secondScene);
});

test('the Ancient China stories render approved scene, media, and closing navigation', () => {
  const erlitou = components.renderMainCard('erlitou-ritual-world');
  assert.equal((erlitou.match(/data-scene-id=/g) || []).length, 5);
  assert.equal((erlitou.match(/data-presentation-kind="mapAndText"/g) || []).length, 2);
  assert.match(erlitou, /夏的名字没有写在遗址里/);
  assert.match(erlitou, /data-navigation-id="nav-erlitou-shang-ancestors"/);

  const shang = components.renderMainCard('shang-ancestors-world');
  assert.equal((shang.match(/data-scene-id=/g) || []).length, 8);
  assert.equal((shang.match(/data-presentation-kind="imageAndText"/g) || []).length, 6);
  assert.equal((shang.match(/data-presentation-kind="mapAndText"/g) || []).length, 2);
  assert.match(shang, /妇好被称为“第一位女武将”/);
  assert.match(shang, /商留下的遗产.*器物与制度.*亡国故事/s);
  assert.match(shang, /data-navigation-id="nav-shang-china-bronze"/);
  assert.match(shang, /data-navigation-id="nav-shang-erlitou-center"/);
});

test('the Ancient Egypt art and hieroglyph stories render approved media and entrances', () => {
  const art = components.renderMainCard('egyptian-art-identity-eternity');
  assert.equal((art.match(/data-scene-id=/g) || []).length, 7);
  assert.equal((art.match(/data-presentation-kind="imageAndText"/g) || []).length, 7);
  assert.match(art, /data-scene-id="egypt-art-hatshepsut-pharaoh"/);
  assert.match(art, /四个高约二十一米的拉美西斯/);
  assert.match(art, /data-navigation-id="nav-egypt-art-new"/);
  assert.match(art, /data-navigation-id="nav-egypt-art-hieroglyph"/);

  const hieroglyphs = components.renderMainCard('egyptian-hieroglyphs-words-sounds');
  assert.equal((hieroglyphs.match(/data-scene-id=/g) || []).length, 6);
  assert.equal((hieroglyphs.match(/data-presentation-kind="imageAndText"/g) || []).length, 6);
  assert.match(hieroglyphs, /data-scene-id="egypt-hieroglyph-language-changes"/);
  assert.match(hieroglyphs, /牛头符号只留下开头那个辅音/);
  assert.match(hieroglyphs, /data-navigation-id="nav-egypt-hieroglyph-afterlife"/);
  assert.match(hieroglyphs, /data-navigation-id="nav-egypt-hieroglyph-pyramids"/);
  assert.match(hieroglyphs, /data-navigation-id="nav-egypt-hieroglyph-art"/);
});

test('afterlife Scene 4 renders three related entrances in approved order', () => {
  const afterlife = components.renderMainCard('egypt-afterlife-journey');
  const sceneFour = afterlife.indexOf('data-scene-id="egypt-afterlife-pyramid-spells"');
  const pyramidEntrance = afterlife.indexOf('data-navigation-id="nav-egypt-afterlife-pyramids"');
  const oldKingdomEntrance = afterlife.indexOf('data-navigation-id="nav-egypt-afterlife-old"');
  const hieroglyphEntrance = afterlife.indexOf('data-navigation-id="nav-egypt-afterlife-hieroglyph"');
  const sceneFive = afterlife.indexOf('data-scene-id="egypt-afterlife-coffin-texts"');
  assert.ok(sceneFour < pyramidEntrance && pyramidEntrance < oldKingdomEntrance && oldKingdomEntrance < hieroglyphEntrance && hieroglyphEntrance < sceneFive);
});

test('one NavigationOption has only one visible placement inside its source story', () => {
  const uses = data.navigationPlacements.filter(item => item.navigationOptionId === 'nav-sumer-akkadian-empire');
  assert.deepEqual(uses.map(item => item.slot), ['closing']);
  assert.ok(data.navigationOptions.every(option => !/返回|回到/.test(`${option.label} ${option.description}`)));
});

test('visible and interactive placement flags control navigation markup', () => {
  const optionId = 'nav-sumer-akkadian-empire';
  assert.match(components.renderSmallCard(optionId, { placement: { visible: true, interactive: true } }), /<a[\s\S]*data-navigation-id=/);
  const staticMarkup = components.renderSmallCard(optionId, { placement: { visible: true, interactive: false } });
  assert.match(staticMarkup, /<article[^>]*is-noninteractive/);
  assert.match(staticMarkup, /aria-disabled="true"/);
  assert.doesNotMatch(staticMarkup, /href=|data-navigation-id=|data-preview-navigation-id=/);
  assert.equal(components.renderSmallCard(optionId, { placement: { visible: false, interactive: true } }), '');
});

test('small navigation cards show only their curated title while previews keep context', () => {
  const optionId = 'nav-sumer-akkadian-empire';
  const smallCard = components.renderSmallCard(optionId, { placement: { visible: true, interactive: true } });
  const preview = components.renderPreviewCard(optionId);

  assert.match(smallCard, /v4-small-card__title/);
  assert.match(smallCard, /aria-controls="v4-navigation-preview"/);
  assert.doesNotMatch(smallCard, /v4-small-card__(?:eyebrow|description|action)/);
  assert.doesNotMatch(smallCard, />继续\s*→</);
  assert.match(preview, /v4-preview-card__eyebrow/);
  assert.match(preview, /<p>/);
  assert.match(preview, /<small>/);
});

test('public navigation opens at the first Scene unless an approved targetScene entry overrides it', () => {
  for (const navigation of data.navigationOptions) {
    const targetCard = queries.getCard(navigation.target.cardId);
    const expectedSceneId = navigation.entry?.kind === 'targetScene'
      ? navigation.target.sceneId
      : targetCard.sceneIds[0];
    const smallCard = components.renderSmallCard(navigation.id, {
      placement: { visible: true, interactive: true }
    });
    assert.match(
      smallCard,
      new RegExp(`href="#card/${targetCard.id}/${expectedSceneId}"`),
      navigation.id
    );
  }
});

test('coarse-pointer navigation opens its preview before following on a second tap', () => {
  const listeners = {};
  const attributes = {};
  const control = {
    dataset: {
      navigationId: 'nav-sumer-akkadian-empire',
      previewNavigationId: 'nav-sumer-akkadian-empire'
    },
    addEventListener(type, handler) { listeners[type] = handler; },
    setAttribute(name, value) { attributes[name] = value; }
  };
  const layer = {
    innerHTML: '',
    setAttribute(name, value) { attributes[`layer:${name}`] = value; },
    removeAttribute(name) { delete attributes[`layer:${name}`]; }
  };
  const root = {
    innerHTML: '',
    querySelectorAll(selector) {
      if (selector === '[data-navigation-id]' || selector === '[data-preview-navigation-id]') return [control];
      return [];
    },
    querySelector(selector) { return selector === '[data-preview-layer]' ? layer : null; }
  };
  const windowRef = fakeWindow('#card/sumer-measuring-land-time/sumer-methods-outlast-dynasties');
  windowRef.matchMedia = () => ({ matches: true });
  const reader = readerModule.createCardReader({ data, queries, components, root, windowRef });
  reader.start();
  const tap = () => listeners.click({
    defaultPrevented: false,
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    preventDefault() {}
  });

  tap();
  assert.match(layer.innerHTML, /v4-preview-card/);
  assert.equal(attributes['aria-expanded'], 'true');
  assert.equal(windowRef.calls.push.length, 0);

  tap();
  assert.equal(reader.state.activeCardId, 'akkadian-empire-overview');
  assert.equal(windowRef.calls.push.length, 1);
});

test('hash routes preserve direct story and section addresses', () => {
  const hash = readerModule.buildCardHash('sumer-measuring-land-time', 'sumer-clay-records');
  assert.equal(hash, '#card/sumer-measuring-land-time/sumer-clay-records');
  assert.deepEqual(readerModule.parseCardHash(hash), { cardId: 'sumer-measuring-land-time', sceneId: 'sumer-clay-records' });
});

test('a direct section address aligns the requested Scene', () => {
  const sceneIds = queries.getCard('egypt-old-kingdom-overview').sceneIds;
  const calls = [];
  const sceneElements = sceneIds.map(sceneId => ({
    dataset: { sceneId }, classList: { toggle() {} }, setAttribute() {},
    scrollIntoView(options) { calls.push([sceneId, options]); }
  }));
  const root = {
    innerHTML: '',
    querySelectorAll(selector) { return selector === '[data-scene-id]' ? sceneElements : []; },
    querySelector() { return null; }
  };
  const reader = readerModule.createCardReader({
    data, queries, components, root,
    windowRef: fakeWindow('#card/egypt-old-kingdom-overview/egypt-old-pyramids-horizon')
  });
  reader.start();
  assert.deepEqual(calls, [
    ['egypt-old-pyramids-horizon', { behavior: 'auto', block: 'start' }],
    ['egypt-old-pyramids-horizon', { behavior: 'auto', block: 'start' }]
  ]);
});

test('Reader activates inherited optional media independently from map availability', () => {
  const presentations = [];
  const maps = [];
  const windowRef = fakeWindow('#card/sumer-measuring-land-time/sumer-methods-outlast-dynasties');
  const reader = readerModule.createCardReader({
    data, queries, components, root: fakeRoot(), windowRef,
    onPresentationChange(presentation, scene, context) { presentations.push([presentation.kind, scene.id, context]); },
    onMapStateChange(mapState, scene) { maps.push([mapState?.id || null, scene.id]); }
  });
  reader.start();
  assert.equal(presentations.at(-1)[0], 'imageAndText');
  assert.equal(presentations.at(-1)[1], 'sumer-methods-outlast-dynasties');
  assert.equal(presentations.at(-1)[2].inheritedMedia, true);
  assert.equal(presentations.at(-1)[2].presentationSceneId, 'sumer-sixty-and-moon');
  assert.deepEqual(maps.at(-1), [null, 'sumer-methods-outlast-dynasties']);
});

test('Reader derives media inheritance only from earlier Scenes in the same story', () => {
  const inherited = readerModule.resolveSceneMedia(queries, 'sumer-measuring-land-time', 'sumer-methods-outlast-dynasties');
  assert.equal(inherited.inherited, true);
  assert.equal(inherited.presentationScene.id, 'sumer-sixty-and-moon');
  assert.equal(inherited.presentation.kind, 'imageAndText');

  const firstSceneCandidate = structuredClone(data);
  firstSceneCandidate.scenes.find(scene => scene.id === 'sumer-water-network').presentation = { kind: 'textOnly' };
  const firstSceneQueries = queries.createQueries(firstSceneCandidate);
  const noEarlierMedia = readerModule.resolveSceneMedia(firstSceneQueries, 'sumer-measuring-land-time', 'sumer-water-network');
  assert.equal(noEarlierMedia.inherited, false);
  assert.equal(noEarlierMedia.presentation.kind, 'textOnly');

});

test('Reader derives forward and backward Scene direction without schema fields', () => {
  assert.equal(readerModule.deriveSceneDirection(queries, 'sumer-measuring-land-time', 'sumer-land-measurement', 'sumer-clay-records'), 'forward');
  assert.equal(readerModule.deriveSceneDirection(queries, 'sumer-measuring-land-time', 'sumer-clay-records', 'sumer-land-measurement'), 'backward');
  assert.equal(data.scenes.some(scene => 'direction' in scene || 'trigger' in scene), false);
});

test('cross-story navigation opens the target story at its first Scene and snapshots source scroll', () => {
  const windowRef = fakeWindow('#card/ur-iii-reordered-city-world/ur-iii-fragmentation');
  const reader = readerModule.createCardReader({ data, queries, components, root: fakeRoot(), windowRef });
  reader.start();
  windowRef.scrollY = 940;
  assert.equal(reader.followNavigation('nav-ur-iii-sumer'), true);
  assert.equal(reader.state.activeCardId, 'sumer-measuring-land-time');
  assert.equal(reader.state.activeSceneId, 'sumer-water-network');
  assert.equal(windowRef.calls.replace.at(-1).state.scrollY, 940);
  assert.equal(windowRef.calls.replace.at(-1).state.entrySource, 'home');
  assert.equal(windowRef.calls.push.at(-1).hash, '#card/sumer-measuring-land-time/sumer-water-network');
  assert.equal(windowRef.calls.push.at(-1).state.entrySource, 'card');
  assert.deepEqual(windowRef.calls.push.at(-1).state.navigationStack.map(entry => entry.cardId), ['ur-iii-reordered-city-world']);
});

test('an approved targetScene entry opens the complete target story at that Scene', () => {
  const windowRef = fakeWindow('#card/amarna-kings-write-world/amarna-diplomacy-routine');
  const reader = readerModule.createCardReader({ data, queries, components, root: fakeRoot(), windowRef });
  reader.start();
  assert.equal(reader.followNavigation('nav-amarna-mesopotamia'), true);
  assert.equal(reader.state.activeCardId, 'mesopotamia-cities-outlast-dynasties');
  assert.equal(reader.state.activeSceneId, 'mesopotamia-babylon-writes-assyria-grows');
  assert.equal(
    windowRef.calls.push.at(-1).hash,
    '#card/mesopotamia-cities-outlast-dynasties/mesopotamia-babylon-writes-assyria-grows'
  );
});

test('cross-story navigation resets inherited media', () => {
  const changes = [];
  const reader = readerModule.createCardReader({
    data, queries, components, root: fakeRoot(),
    windowRef: fakeWindow('#card/sumer-measuring-land-time/sumer-methods-outlast-dynasties'),
    onPresentationChange(presentation, scene, context) { changes.push({ kind: presentation.kind, sceneId: scene.id, context }); }
  });
  reader.start();
  reader.followNavigation('nav-sumer-akkadian-empire');
  const latest = changes.at(-1);
  assert.equal(latest.kind, 'mapAndText');
  assert.equal(latest.context.cardId, 'akkadian-empire-overview');
  assert.equal(latest.context.inheritedMedia, false);
});

test('Scene prose has no visual box except curated navigation cards', () => {
  const markup = components.renderMainCard('sumer-measuring-land-time');
  assert.doesNotMatch(markup, /Natural Earth 本地矢量底图来源说明/);
  const css = fs.readFileSync(path.resolve(__dirname, '../../styles/v4/cards.css'), 'utf8');
  const globalCss = fs.readFileSync(path.resolve(__dirname, '../../styles.css'), 'utf8');
  const proseRule = css.match(/\.v4-scene__case,\s*\.v4-scene__mechanism\s*\{([^}]*)\}/)?.[1] || '';
  const assetRule = css.match(/\.v4-scene__asset\s*\{([^}]*)\}/)?.[1] || '';
  assert.doesNotMatch(proseRule, /border|background|padding/);
  assert.doesNotMatch(assetRule, /border|background|padding/);
  assert.match(css, /\.v4-small-card\s*\{[\s\S]*border:/);
  assert.match(globalCss, /html\s*\{[^}]*scroll-behavior:\s*auto/);
});

test('real back-forward-back traversal preserves story, section, and scroll state', () => {
  const listeners = new Map();
  const entries = [{ state: null, hash: '#card/sumer-measuring-land-time/sumer-methods-outlast-dynasties' }];
  let index = 0;
  const windowRef = {
    location: { hash: entries[0].hash }, scrollY: 0, innerHeight: 800,
    history: {
      get state() { return entries[index].state; },
      pushState(state, _title, hash) { entries.splice(index + 1); entries.push({ state: structuredClone(state), hash }); index = entries.length - 1; windowRef.location.hash = hash; },
      replaceState(state, _title, hash) { entries[index] = { state: structuredClone(state), hash }; windowRef.location.hash = hash; },
      back() { if (index === 0) return; index -= 1; windowRef.location.hash = entries[index].hash; listeners.get('popstate')?.({ state: structuredClone(entries[index].state) }); },
      forward() { if (index >= entries.length - 1) return; index += 1; windowRef.location.hash = entries[index].hash; listeners.get('popstate')?.({ state: structuredClone(entries[index].state) }); }
    },
    scrollTo(_x, y) { this.scrollY = y; },
    requestAnimationFrame(callback) { callback(); },
    setTimeout(callback) { callback(); return 1; }, clearTimeout() {},
    addEventListener(type, handler) { listeners.set(type, handler); },
    removeEventListener(type) { listeners.delete(type); }
  };
  const reader = readerModule.createCardReader({ data, queries, components, root: fakeRoot(), windowRef });
  reader.start();
  windowRef.scrollY = 120;
  reader.followNavigation('nav-sumer-akkadian-empire');
  windowRef.scrollY = 340;
  reader.followNavigation('nav-akkadian-ur-iii');

  assert.deepEqual(reader.state.navigationStack.map(entry => entry.cardId), ['sumer-measuring-land-time', 'akkadian-empire-overview']);

  windowRef.history.back();
  assert.deepEqual([reader.state.activeCardId, reader.state.activeSceneId, windowRef.scrollY], ['akkadian-empire-overview', 'akkadian-empire-city-states', 340]);
  assert.deepEqual(reader.state.navigationStack.map(entry => entry.cardId), ['sumer-measuring-land-time']);
  windowRef.history.forward();
  assert.deepEqual([reader.state.activeCardId, reader.state.activeSceneId, windowRef.scrollY], ['ur-iii-reordered-city-world', 'ur-iii-rises-after-akkad', 0]);
  assert.deepEqual(reader.state.navigationStack.map(entry => entry.cardId), ['sumer-measuring-land-time', 'akkadian-empire-overview']);
  windowRef.history.back();
  assert.deepEqual([reader.state.activeCardId, reader.state.activeSceneId, windowRef.scrollY], ['akkadian-empire-overview', 'akkadian-empire-city-states', 340]);
  assert.deepEqual(reader.state.navigationStack.map(entry => entry.cardId), ['sumer-measuring-land-time']);
});
