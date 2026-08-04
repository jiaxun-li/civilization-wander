const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ancientIndia = require('../../data/ancient-india.js');
const data = require('../../data/atlas-data.js');
const queries = require('../../data/queries.js');

const root = path.resolve(__dirname, '../..');
const cardById = new Map(ancientIndia.cards.map(card => [card.id, card]));
const sceneById = new Map(ancientIndia.scenes.map(scene => [scene.id, scene]));

test('Ancient India adds the approved settlement, civilization, and early Vedic stories', () => {
  assert.deepEqual(
    ancientIndia.entities.map(entity => [entity.id, entity.type, entity.defaultCardId]),
    [
      ['indus-civilization', 'culturalTradition', 'indus-civilization-network'],
      ['mohenjo-daro', 'SettlementSite', 'mohenjo-daro-urban-order'],
      ['vedic-tradition', 'culturalTradition', 'indo-aryan-enters-south-asia']
    ]
  );
  assert.deepEqual(
    ancientIndia.cards.map(card => [card.id, card.sceneIds.length]),
    [
      ['mohenjo-daro-urban-order', 5],
      ['indus-civilization-network', 6],
      ['indo-aryan-enters-south-asia', 6]
    ]
  );
});

test('approved Scene order and revised story prose are preserved', () => {
  assert.deepEqual(cardById.get('mohenjo-daro-urban-order').sceneIds, [
    'mohenjo-daro-partial-city',
    'mohenjo-daro-neighborhood-wells',
    'mohenjo-daro-water-leaves-home',
    'mohenjo-daro-great-bath',
    'mohenjo-daro-unnamed-managers'
  ]);
  assert.deepEqual(cardById.get('indus-civilization-network').sceneIds, [
    'indus-shared-measures',
    'indus-seals-image-and-signs',
    'indus-short-unread-script',
    'indus-carnelian-goes-west',
    'indus-meluhha-ships',
    'indus-network-changes-shape'
  ]);
  assert.deepEqual(cardById.get('indo-aryan-enters-south-asia').sceneIds, [
    'indo-aryan-cities-change-first',
    'indo-aryan-local-settlements',
    'indo-aryan-steppe-groups-move-south',
    'indo-aryan-language-enters-northwest',
    'indo-aryan-poets-sing-rivers-fire',
    'indo-aryan-new-society-forms'
  ]);
  assert.equal(cardById.get('mohenjo-daro-urban-order').introduction, '一座四千多年前的砖城，没有留下国王的名字，却留下了水井、浴室和排水沟。沿着水的去向，我们走进摩亨佐-达罗的日常生活。');
  assert.match(sceneById.get('mohenjo-daro-partial-city').contentBlocks[0].text, /房屋倒下又建起.*城市的形状/s);
  assert.match(sceneById.get('indus-seals-image-and-signs').contentBlocks[0].text, /掌心大小.*印章保存了动作/s);
  assert.match(sceneById.get('indus-network-changes-shape').contentBlocks[0].text, /没有在某一天突然消失.*地方生活/s);
});

test('every Ancient India Scene has sourced non-text media', () => {
  assert.equal(ancientIndia.scenes.length, 17);
  for (const scene of ancientIndia.scenes) {
    assert.notEqual(scene.presentation.kind, 'textOnly', scene.id);
    assert.ok(scene.contentBlocks.length > 0, scene.id);
    assert.ok(scene.contentBlocks.every(block => Array.isArray(block.sourceIds) && block.sourceIds.length > 0), scene.id);
    assert.ok(scene.sourceIds.length > 0, scene.id);
    if (scene.presentation.kind === 'imageAndText') {
      const asset = ancientIndia.assets.find(item => item.id === scene.presentation.assetId);
      assert.ok(asset, scene.presentation.assetId);
      assert.ok(scene.sourceIds.some(sourceId => asset.sourceIds.includes(sourceId)), scene.id);
    } else {
      assert.equal(scene.presentation.kind, 'mapAndText', scene.id);
      assert.ok(ancientIndia.mapStates.some(item => item.id === scene.presentation.map.mapStateId), scene.id);
    }
  }
});

test('Ancient India owns eight reviewed local images with the corrected seal and Cemetery H views', () => {
  assert.equal(ancientIndia.assets.length, 8);
  for (const asset of ancientIndia.assets) {
    assert.ok(asset.src.startsWith('assets/images/ancient-india/'), asset.id);
    const filePath = path.resolve(root, asset.src);
    assert.equal(fs.existsSync(filePath), true, asset.src);
    assert.ok(fs.statSync(filePath).size > 50_000, asset.src);
    assert.ok(asset.alt.length >= 15, asset.id);
  }
  assert.equal(fs.existsSync(path.resolve(root, 'assets/images/ancient-india/indus-unicorn-impression.jpg')), false);
  assert.equal(sceneById.get('indus-seals-image-and-signs').presentation.assetId, 'asset-indus-unicorn-seal');
  assert.equal(sceneById.get('indus-short-unread-script').presentation.assetId, 'asset-indus-unicorn-seal');
  assert.equal(sceneById.get('indo-aryan-cities-change-first').presentation.assetId, 'asset-mohenjo-daro-overview');
  assert.equal(sceneById.get('indo-aryan-local-settlements').presentation.assetId, 'asset-cemetery-h-pottery');
  assert.equal(sceneById.get('indo-aryan-new-society-forms').presentation.map.mapStateId, 'map-indo-aryan-synthesis');
});

test('the Ancient India Cards keep reciprocal entrances and place the city link in Scene 1', () => {
  const directions = ancientIndia.navigationPlacements.map(placement => {
    const option = ancientIndia.navigationOptions.find(item => item.id === placement.navigationOptionId);
    const sourceCardId = placement.owner.kind === 'card'
      ? placement.owner.cardId
      : ancientIndia.cards.find(card => card.sceneIds.includes(placement.owner.sceneId)).id;
    return `${sourceCardId}->${option.target.cardId}`;
  }).sort();
  assert.deepEqual(directions, [
    'indo-aryan-enters-south-asia->indus-civilization-network',
    'indus-civilization-network->akkadian-empire-overview',
    'indus-civilization-network->indo-aryan-enters-south-asia',
    'indus-civilization-network->mohenjo-daro-urban-order',
    'mohenjo-daro-urban-order->indus-civilization-network'
  ]);
  const toCivilization = ancientIndia.navigationPlacements.find(placement =>
    placement.navigationOptionId === 'nav-mohenjo-daro-indus-civilization'
  );
  assert.deepEqual(toCivilization.owner, { kind: 'card', cardId: 'mohenjo-daro-urban-order' });
  assert.equal(toCivilization.slot, 'closing');
  const toCity = ancientIndia.navigationPlacements.find(placement =>
    placement.navigationOptionId === 'nav-indus-civilization-mohenjo-daro'
  );
  assert.deepEqual(toCity.owner, { kind: 'scene', sceneId: 'indus-shared-measures' });
  assert.equal(toCity.slot, 'inline');
  const toAkkadian = ancientIndia.navigationPlacements.find(placement =>
    placement.navigationOptionId === 'nav-indus-akkadian-empire'
  );
  assert.deepEqual(toAkkadian.owner, { kind: 'scene', sceneId: 'indus-meluhha-ships' });
  assert.equal(toAkkadian.slot, 'inline');
});

test('map teaching overlays stay explicitly approximate except the excavated site point', () => {
  assert.equal(ancientIndia.geometries.length, 8);
  const site = ancientIndia.geometries.find(item => item.id === 'geometry-mohenjo-daro-site');
  assert.equal(site.approximate, false);
  assert.deepEqual(site.geometry.type, 'Point');
  for (const geometry of ancientIndia.geometries.filter(item => item.id !== site.id)) {
    assert.equal(geometry.approximate, true, geometry.id);
    assert.match(geometry.label, /教学|近似/);
  }
});

test('the western exchange map names its endpoints and explains its points and line', () => {
  const scene = sceneById.get('indus-meluhha-ships');
  assert.match(scene.presentation.map.caption, /圆点依次标出印度河沿海、海湾中转节点与两河流域/);
  assert.match(scene.presentation.map.caption, /棕色虚线.*不是精确航线/);
  assert.deepEqual(
    scene.presentation.map.layers.map(layer => layer.annotationId),
    ['annotation-indus-exchange-coast', 'annotation-indus-exchange-mesopotamia']
  );
  assert.deepEqual(
    scene.presentation.map.layers.map(layer =>
      ancientIndia.mapAnnotations.find(annotation => annotation.id === layer.annotationId).label
    ),
    ['印度河沿海', '两河流域']
  );
  assert.ok(ancientIndia.geometries.some(geometry =>
    geometry.id === 'geometry-indus-western-exchange-nodes' && geometry.geometry.type === 'MultiPoint'
  ));
});

test('the network transformation map names its two layers in plain language', () => {
  const scene = sceneById.get('indus-network-changes-shape');
  assert.match(scene.presentation.map.caption, /深色圆点表示成熟期主要城市/);
  assert.match(scene.presentation.map.caption, /蓝灰色范围表示.*后更分散的聚落重心/);
  assert.match(scene.presentation.map.caption, /不是人口边界或迁徙路线/);
  assert.deepEqual(
    scene.presentation.map.layers.map(layer => layer.annotationId),
    ['annotation-indus-mature-cities', 'annotation-indus-later-settlements']
  );
  assert.deepEqual(
    ['annotation-indus-mature-cities', 'annotation-indus-later-settlements'].map(id => ancientIndia.mapAnnotations.find(annotation => annotation.id === id).label),
    ['成熟期主要城市', '后期聚落重心']
  );
});

test('the remaining Ancient India maps pair visible symbols with plain-language labels', () => {
  const site = sceneById.get('mohenjo-daro-partial-city').presentation.map;
  assert.match(site.caption, /深色圆点与文字共同标出摩亨佐-达罗/);
  assert.deepEqual(site.layers.map(layer => layer.annotationId), ['annotation-mohenjo-daro-site-label']);

  const network = sceneById.get('indus-shared-measures').presentation.map;
  assert.match(network.caption, /深色圆点表示成熟期主要城市/);
  assert.match(network.caption, /点位不表示统一帝国边界/);
  assert.deepEqual(network.layers.map(layer => layer.annotationId), [
    'annotation-mohenjo-daro-site-label',
    'annotation-indus-major-cities-label'
  ]);
});

test('the aggregated V4 atlas validates with Ancient India included', () => {
  const result = queries.createQueries(data).validateAtlasData();
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(data.cards.find(card => card.id === 'mohenjo-daro-urban-order'), ancientIndia.cards[0]);
  assert.equal(data.cards.find(card => card.id === 'indus-civilization-network'), ancientIndia.cards[1]);
  assert.equal(data.cards.find(card => card.id === 'indo-aryan-enters-south-asia'), ancientIndia.cards[2]);
});
