const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const moduleData = require('../../data/iron-age-near-east.js');
const data = require('../../data/atlas-data.js');
const { queriesModule: queries } = require('../../src/data/queries.ts');

const root = path.resolve(__dirname, '../..');
const cardById = new Map(moduleData.cards.map(card => [card.id, card]));
const sceneById = new Map(moduleData.scenes.map(scene => [scene.id, scene]));

test('the seventh expansion contains the seven approved compact stories', () => {
  assert.deepEqual(moduleData.cards.map(card => [card.id, card.title, card.sceneIds.length]), [
    ['iron-crosses-empires-routes', '铁器穿过帝国与商路', 8],
    ['assyria-orders-cross-empire', '亚述的命令穿过帝国', 7],
    ['phoenician-cities-sail-mediterranean', '腓尼基城邦驶向地中海', 6],
    ['two-kingdoms-two-falls', '两个王国，两次陷落', 6],
    ['aramaic-crosses-empires', '王国消失，阿拉米语留下', 4],
    ['babylon-inherits-assyrian-empire', '巴比伦接过亚述的帝国', 6],
    ['lydia-coins-gold-silver', '吕底亚把金银铸成钱币', 4]
  ]);
  assert.equal(cardById.get('two-kingdoms-two-falls').primaryEntityId, 'ancient-israelite-tradition');
  assert.equal(moduleData.entities.find(entity => entity.id === 'kingdom-of-israel').type, 'polity');
  assert.equal(moduleData.entities.find(entity => entity.id === 'aramaic-language').type, 'languageSystem');
  assert.match(sceneById.get('lydia-mark-makes-alloy-speak').contentBlocks[0].text, /最早一批真正的钱币/);
  assert.match(sceneById.get('lydia-mark-makes-alloy-speak').contentBlocks[0].text, /世界上第一套国家铸币制度/);
  assert.match(sceneById.get('lydia-kingdom-falls-mint-continues').contentBlocks[0].text, /希腊海岸.*希腊本土.*古风和古典时代/s);
  assert.equal(sceneById.get('lydia-mark-makes-alloy-speak').presentation.assetId, 'asset-iane-lydian-electrum-lions');
  assert.match(cardById.get('aramaic-crosses-empires').introduction, /国家被征服了，语言反而穿过了帝国/);
  assert.match(sceneById.get('aramaic-two-scribes-one-palace').contentBlocks[0].text, /被征服者的语言.*征服者手中的帝国工具/s);
  assert.equal(sceneById.get('aramaic-two-scribes-one-palace').presentation.assetId, 'asset-iane-assyrian-scribes');
  assert.match(sceneById.get('aramaic-outlives-empires').contentBlocks[0].text, /被征服者的语言却继续为一个又一个征服者工作/);
  const aramaicRange = moduleData.geometries.find(item => item.id === 'geometry-iane-imperial-aramaic');
  assert.equal(aramaicRange.geometry.type, 'Polygon');
  assert.equal(aramaicRange.approximate, true);
  assert.match(sceneById.get('aramaic-outlives-empires').presentation.map.caption, /圈定范围.*约略区域/);
});

test('Assyria preserves the approved martial framing, merged administration, and library', () => {
  assert.match(sceneById.get('assyria-kings-prove-through-war').contentBlocks[0].text, /这是一个尚武的帝国/);
  assert.match(sceneById.get('assyria-rebellion-sees-consequences').contentBlocks[0].text, /残暴著称/);
  assert.match(sceneById.get('assyria-conquest-becomes-government').contentBlocks[0].text, /总督.*王家道路/s);
  assert.match(sceneById.get('assyria-conquest-becomes-government').contentBlocks[0].text, /腓尼基海岸城邦.*贡赋.*港口贸易/s);
  assert.match(sceneById.get('assyria-people-moved-elsewhere').contentBlocks[0].text, /以色列王国.*撒马利亚.*阿拉米小国.*阿拉米语/s);
  const administration = sceneById.get('assyria-conquest-becomes-government');
  const extent = moduleData.geometries.find(item => item.id === 'geometry-iane-assyrian-administration');
  assert.equal(administration.presentation.map.mapStateId, 'map-iane-assyrian-administration');
  assert.equal(extent.geometry.type, 'Polygon');
  assert.equal(extent.approximate, true);
  assert.match(administration.presentation.map.caption, /本土与行省控制区.*附庸国也不等同于行省/);
  assert.match(sceneById.get('assyria-nineveh-collects-knowledge').contentBlocks[0].text, /三万多件泥板和残片/);
});

test('Phoenician geography scenes keep maps while object-focused scenes use images', () => {
  const opening = sceneById.get('phoenicia-four-coastal-kings');
  const annotationById = new Map(data.mapAnnotations.map(item => [item.id, item]));
  const labels = opening.presentation.map.layers.map(layer => annotationById.get(layer.annotationId).label).join(' ');
  for (const city of ['推罗', '西顿', '比布鲁斯', '阿尔瓦德']) assert.match(labels, new RegExp(city));
  const west = sceneById.get('phoenicia-beyond-mediterranean-gate');
  assert.equal(west.presentation.kind, 'mapAndText');
  assert.match(west.contentBlocks[0].text, /直布罗陀海峡以西/);
  const westAnnotations = west.presentation.map.layers.map(layer => annotationById.get(layer.annotationId));
  assert.deepEqual(westAnnotations.slice(2).map(item => [item.label, item.placement]), [
    ['伊比利亚南岸', 'right'],
    ['直布罗陀', 'left'],
    ['摩洛哥大西洋岸', 'left']
  ]);
  for (const sceneId of ['phoenicia-cargo-many-hands', 'phoenicia-ships-bring-tribute', 'phoenicia-distant-ports-centres']) {
    assert.equal(sceneById.get(sceneId).presentation.kind, 'imageAndText');
  }
  assert.match(sceneById.get('phoenicia-distant-ports-centres').contentBlocks[0].text, /分散的海岸不断交换/);
});

test('Israel and Judah keep the approved merged imperial arc and myth display', () => {
  assert.equal(sceneById.get('israel-jacob-gets-another-name').timeDisplay, 'undatedNarrative');
  assert.match(sceneById.get('israel-enters-and-falls-to-assyria').contentBlocks[0].text, /亚哈.*以色列的新王耶户.*撒马利亚/s);
  assert.match(sceneById.get('judah-lachish-falls-jerusalem-remains').contentBlocks[0].text, /希西家交出大批金银贡物.*亚述军队撤走.*仍然在位/s);
  assert.match(sceneById.get('judah-babylon-twice-enters-jerusalem').contentBlocks[0].text, /第一次投降.*十一年后/s);
  assert.equal(moduleData.cameraPresets.find(item => item.id === 'camera-iane-assyria').scale, 4);
  assert.equal(sceneById.get('judah-people-continue-two-places').presentation.assetId, 'asset-iane-jehoiachin-ration-tablet');
});

test('all forty-one scenes have sourced non-text media and local licensed images exist', () => {
  assert.equal(moduleData.scenes.length, 41);
  for (const scene of moduleData.scenes) {
    assert.notEqual(scene.presentation.kind, 'textOnly', scene.id);
    assert.ok(scene.sourceIds.length > 0, scene.id);
    assert.ok(scene.contentBlocks.every(block => block.sourceIds.length > 0), scene.id);
  }
  for (const asset of moduleData.assets) {
    assert.ok(asset.src.startsWith('assets/images/iron-age-near-east/'), asset.id);
    const file = path.resolve(root, asset.src);
    assert.equal(fs.existsSync(file), true, asset.src);
    assert.ok(fs.statSync(file).size > 1_000, asset.src);
  }
  for (const card of moduleData.cards) {
    for (const sceneId of card.sceneIds) assert.equal(sceneById.has(sceneId), true, `${card.id}:${sceneId}`);
  }
  assert.equal(sceneById.get('iron-first-falls-from-sky').presentation.assetId, 'asset-iane-tutankhamun-dagger');
  assert.equal(sceneById.get('iron-bloom-leaves-furnace').presentation.assetId, 'asset-iane-iron-bloomery');
  assert.equal(sceneById.get('iron-hittite-court-smiths').presentation.assetId, 'asset-iane-kbo-1-14');
});

test('reciprocal paths connect all seven stories with their curated neighbours', () => {
  const sceneOwner = new Map(data.cards.flatMap(card => card.sceneIds.map(sceneId => [sceneId, card.id])));
  const optionById = new Map(data.navigationOptions.map(option => [option.id, option]));
  const directions = new Set(moduleData.navigationPlacements.map(placement => {
    const source = sceneOwner.get(placement.owner.sceneId);
    return `${source}->${optionById.get(placement.navigationOptionId).target.cardId}`;
  }));
  assert.deepEqual(directions, new Set([
    'iron-crosses-empires-routes->hittite-syria-treaties',
    'hittite-syria-treaties->iron-crosses-empires-routes',
    'iron-crosses-empires-routes->late-bronze-palaces-go-dark',
    'late-bronze-palaces-go-dark->iron-crosses-empires-routes',
    'iron-crosses-empires-routes->greece-reconnects-after-palaces',
    'greece-reconnects-after-palaces->iron-crosses-empires-routes',
    'iron-crosses-empires-routes->phoenician-cities-sail-mediterranean',
    'phoenician-cities-sail-mediterranean->iron-crosses-empires-routes',
    'iron-crosses-empires-routes->assyria-orders-cross-empire',
    'assyria-orders-cross-empire->iron-crosses-empires-routes',
    'assyria-orders-cross-empire->two-kingdoms-two-falls',
    'two-kingdoms-two-falls->assyria-orders-cross-empire',
    'assyria-orders-cross-empire->phoenician-cities-sail-mediterranean',
    'phoenician-cities-sail-mediterranean->assyria-orders-cross-empire',
    'phoenician-cities-sail-mediterranean->greece-reconnects-after-palaces',
    'greece-reconnects-after-palaces->phoenician-cities-sail-mediterranean',
    'phoenician-cities-sail-mediterranean->ugarit-kings-trade',
    'ugarit-kings-trade->phoenician-cities-sail-mediterranean',
    'assyria-orders-cross-empire->cuneiform-overview',
    'cuneiform-overview->assyria-orders-cross-empire',
    'assyria-orders-cross-empire->aramaic-crosses-empires',
    'aramaic-crosses-empires->assyria-orders-cross-empire',
    'phoenician-cities-sail-mediterranean->aramaic-crosses-empires',
    'aramaic-crosses-empires->phoenician-cities-sail-mediterranean',
    'assyria-orders-cross-empire->babylon-inherits-assyrian-empire',
    'babylon-inherits-assyrian-empire->assyria-orders-cross-empire',
    'two-kingdoms-two-falls->babylon-inherits-assyrian-empire',
    'babylon-inherits-assyrian-empire->two-kingdoms-two-falls',
    'lydia-coins-gold-silver->hittite-syria-treaties',
    'hittite-syria-treaties->lydia-coins-gold-silver',
    'assyria-orders-cross-empire->late-bronze-palaces-go-dark',
    'late-bronze-palaces-go-dark->assyria-orders-cross-empire',
    'aramaic-crosses-empires->late-bronze-palaces-go-dark',
    'late-bronze-palaces-go-dark->aramaic-crosses-empires',
    'lydia-coins-gold-silver->late-bronze-palaces-go-dark',
    'late-bronze-palaces-go-dark->lydia-coins-gold-silver',
    'babylon-inherits-assyrian-empire->tower-of-babel-story-and-etemenanki',
    'tower-of-babel-story-and-etemenanki->babylon-inherits-assyrian-empire'
  ]));
});
