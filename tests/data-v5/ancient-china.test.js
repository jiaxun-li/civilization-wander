const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ancientChina = require('../../data/ancient-china.js');
const { atlasData: data } = require('../../src/data/atlas-data.ts');
const { queriesModule: queries } = require('../../src/data/queries.ts');

const root = path.resolve(__dirname, '../..');
const cardById = new Map(ancientChina.cards.map(card => [card.id, card]));
const sceneById = new Map(ancientChina.scenes.map(scene => [scene.id, scene]));

test('Ancient China adds the early bronze overview and approved focused stories', () => {
  assert.deepEqual(
    ancientChina.entities.map(entity => [entity.id, entity.type]),
    [
      ['western-zhou', 'polity'],
      ['china-early-bronze-world', 'culturalTradition'],
      ['erlitou-site', 'SettlementSite'],
      ['shang-civilization', 'polity'],
      ['shang-oracle-bone-inscriptions', 'TextDocument'],
      ['shang-bronze-ritual-vessels', 'CulturalObject'],
      ['sanxingdui-site', 'SettlementSite']
    ]
  );
  assert.deepEqual(
    ancientChina.cards.map(card => [card.id, card.title, card.sceneIds.length]),
    [
      ['western-zhou-bronze-commands', '西周把王命铸进青铜', 6],
      ['china-early-bronze-connected-worlds', '青铜器连接不同的世界', 7],
      ['erlitou-ritual-world', '二里头形成新的礼仪世界', 5],
      ['shang-ancestors-world', '商人生活在祖先的目光下', 8],
      ['shang-oracle-bones-record', '甲骨把问神变成记录', 5],
      ['shang-bronzes-ancestor-feast', '青铜从作坊进入祖先宴席', 5],
      ['sanxingdui-ritual-world', '三星堆让看不见的世界现身', 5]
    ]
  );
});

test('the approved Scene order and final prose are preserved', () => {
  assert.deepEqual(cardById.get('western-zhou-bronze-commands').sceneIds, [
    'western-zhou-muye-victory',
    'western-zhou-eastern-center',
    'western-zhou-allies-regional-centers',
    'western-zhou-command-cast-in-ding',
    'western-zhou-rites-and-armies',
    'western-zhou-capital-falls'
  ]);
  assert.deepEqual(cardById.get('china-early-bronze-connected-worlds').sceneIds, [
    'china-bronze-before-bronze',
    'china-bronze-materials-fire',
    'china-bronze-erlitou-center',
    'china-bronze-shang-cities',
    'china-bronze-ancestors-records',
    'china-bronze-sanxingdui-world',
    'china-bronze-zhou-changes'
  ]);
  assert.deepEqual(cardById.get('erlitou-ritual-world').sceneIds, [
    'erlitou-roads-cross-city',
    'erlitou-enclosed-center',
    'erlitou-rare-materials-workshop',
    'erlitou-objects-enter-burials',
    'erlitou-xia-name-absent'
  ]);
  assert.deepEqual(cardById.get('shang-ancestors-world').sceneIds, [
    'shang-civilization-forms-between-cities',
    'shang-dead-remain-in-family',
    'shang-meal-for-ancestors',
    'shang-when-bone-cracks',
    'shang-fu-hao-two-records',
    'shang-war-enters-sacrifice',
    'shang-people-beyond-royal-house',
    'shang-last-king-story-spreads'
  ]);
  assert.deepEqual(cardById.get('shang-oracle-bones-record').sceneIds, [
    'shang-oracle-fire-opens-bone',
    'shang-oracle-divination-becomes-record',
    'shang-oracle-question-repeated',
    'shang-oracle-ancestors-calendar',
    'shang-oracle-royal-questions-survive'
  ]);
  assert.deepEqual(cardById.get('shang-bronzes-ancestor-feast').sceneIds, [
    'shang-bronze-materials-reach-workshop',
    'shang-bronze-clay-mould-shapes-vessel',
    'shang-bronze-vessels-form-feast',
    'shang-bronze-mask-and-name',
    'shang-bronze-follows-owner-to-tomb'
  ]);
  assert.deepEqual(cardById.get('sanxingdui-ritual-world').sceneIds, [
    'sanxingdui-pits-beneath-city',
    'sanxingdui-bronze-faces-watch',
    'sanxingdui-people-tree-birds',
    'sanxingdui-materials-meet',
    'sanxingdui-ritual-world-is-buried'
  ]);
  assert.match(sceneById.get('sanxingdui-ritual-world-is-buried').contentBlocks.map(block => block.text).join('\n'), /太阳/);
  assert.match(sceneById.get('sanxingdui-bronze-faces-watch').contentBlocks.map(block => block.text).join('\n'), /至今没有答案/);
  assert.match(sceneById.get('sanxingdui-ritual-world-is-buried').contentBlocks.map(block => block.text).join('\n'), /目前没有定论/);
  assert.match(sceneById.get('shang-fu-hao-two-records').contentBlocks[0].text, /妇好被称为“第一位女武将”/);
  const ending = sceneById.get('shang-last-king-story-spreads').contentBlocks.map(block => block.text).join('\n');
  assert.match(ending, /纣王/);
  assert.match(ending, /天命转移/);
  assert.match(ending, /利簋/);
  assert.match(ending, /青铜、文字和礼制并未消失/);
  assert.match(ending, /重新赋予意义/);
  assert.equal(
    sceneById.get('shang-oracle-divination-becomes-record').contentBlocks[0].text,
    '裂纹出现后，刻写者在旁边留下日期、占卜者和要判断的事情。有时，商王还会加上自己的判断；事情过去后，又可能补记结果。一块骨面于是能够串起一次行动：何时举行、为了什么、当时怎样判断、后来发生了什么。'
  );
  assert.match(sceneById.get('shang-bronze-follows-owner-to-tomb').contentBlocks[0].text, /被称为“第一位女武将”的妇好/);
  assert.match(sceneById.get('shang-bronze-follows-owner-to-tomb').contentBlocks[0].text, /进入新的历史记忆/);
});

test('every Ancient China Scene has sourced non-text media', () => {
  assert.equal(ancientChina.scenes.length, 41);
  for (const scene of ancientChina.scenes) {
    assert.notEqual(scene.presentation.kind, 'textOnly', scene.id);
    assert.ok(scene.contentBlocks.length > 0, scene.id);
    assert.ok(scene.contentBlocks.every(block => Array.isArray(block.sourceIds) && block.sourceIds.length > 0), scene.id);
    assert.ok(scene.sourceIds.length > 0, scene.id);
    if (scene.presentation.kind === 'imageAndText') {
      const asset = ancientChina.assets.find(item => item.id === scene.presentation.assetId);
      assert.ok(asset, scene.presentation.assetId);
      assert.ok(scene.sourceIds.some(sourceId => asset.sourceIds.includes(sourceId)), scene.id);
    } else {
      assert.equal(scene.presentation.kind, 'mapAndText', scene.id);
      assert.ok(ancientChina.mapStates.some(item => item.id === scene.presentation.map.mapStateId), scene.id);
    }
  }
});

test('Ancient China owns twenty-three reviewed local images', () => {
  assert.equal(ancientChina.assets.length, 23);
  for (const asset of ancientChina.assets) {
    assert.ok(asset.src.startsWith('assets/images/ancient-china/'), asset.id);
    const filePath = path.resolve(root, asset.src);
    assert.equal(fs.existsSync(filePath), true, asset.src);
    assert.ok(fs.statSync(filePath).size > 1_000, asset.src);
    assert.ok(asset.alt.length >= 15, asset.id);
  }
  assert.equal(sceneById.get('western-zhou-muye-victory').presentation.assetId, 'asset-li-gui');
  assert.equal(sceneById.get('western-zhou-rites-and-armies').presentation.assetId, 'asset-guoji-zibai-pan');
  assert.equal(sceneById.get('western-zhou-capital-falls').presentation.map.mapStateId, 'map-western-zhou-eastward-move');
});

test('the Ancient China stories expose reciprocal curated paths including the overview', () => {
  const directions = ancientChina.navigationPlacements.map(placement => {
    const option = ancientChina.navigationOptions.find(item => item.id === placement.navigationOptionId);
    const sourceCardId = placement.owner.kind === 'card'
      ? placement.owner.cardId
      : ancientChina.cards.find(card => card.sceneIds.includes(placement.owner.sceneId)).id;
    return `${sourceCardId}->${option.target.cardId}:${placement.slot}`;
  }).sort();
  const existingDirections = [
    'erlitou-ritual-world->shang-ancestors-world:closing',
    'sanxingdui-ritual-world->shang-bronzes-ancestor-feast:closing',
    'shang-ancestors-world->erlitou-ritual-world:closing',
    'shang-ancestors-world->shang-bronzes-ancestor-feast:inline',
    'shang-ancestors-world->shang-oracle-bones-record:inline',
    'shang-bronzes-ancestor-feast->sanxingdui-ritual-world:inline',
    'shang-bronzes-ancestor-feast->shang-ancestors-world:closing',
    'shang-oracle-bones-record->shang-ancestors-world:closing'
  ];
  for (const direction of existingDirections) assert.ok(directions.includes(direction), direction);
  for (const direction of [
    'western-zhou-bronze-commands->china-early-bronze-connected-worlds:inline',
    'china-early-bronze-connected-worlds->western-zhou-bronze-commands:inline',
    'western-zhou-bronze-commands->shang-ancestors-world:inline',
    'shang-ancestors-world->western-zhou-bronze-commands:inline',
    'china-early-bronze-connected-worlds->erlitou-ritual-world:inline',
    'china-early-bronze-connected-worlds->shang-ancestors-world:inline',
    'china-early-bronze-connected-worlds->shang-oracle-bones-record:inline',
    'china-early-bronze-connected-worlds->shang-bronzes-ancestor-feast:inline',
    'china-early-bronze-connected-worlds->sanxingdui-ritual-world:inline',
    'erlitou-ritual-world->china-early-bronze-connected-worlds:inline',
    'shang-ancestors-world->china-early-bronze-connected-worlds:inline',
    'sanxingdui-ritual-world->china-early-bronze-connected-worlds:inline'
  ]) assert.ok(directions.includes(direction), direction);
  for (const optionId of ['nav-erlitou-china-bronze', 'nav-shang-china-bronze', 'nav-sanxingdui-china-bronze']) {
    assert.equal(ancientChina.navigationOptions.find(option => option.id === optionId).label, '进入中国的早期青铜世界');
  }
});

test('map captions explain symbols and keep the Shang spread approximate', () => {
  const erlitou = sceneById.get('erlitou-roads-cross-city').presentation.map;
  assert.match(erlitou.caption, /圆点/);
  assert.match(erlitou.caption, /文字/);
  assert.deepEqual(erlitou.layers.map(layer => layer.annotationId), ['annotation-erlitou-location']);
  assert.deepEqual(
    sceneById.get('erlitou-enclosed-center').presentation.map.layers.map(layer => layer.annotationId),
    ['annotation-erlitou-location']
  );
  assert.deepEqual(
    ancientChina.mapAnnotations.filter(annotation => annotation.subject.entityId === 'erlitou-site').map(annotation => annotation.label),
    ['二里头（约前1900—前1500年）', '二里头遗址']
  );
  const shang = sceneById.get('shang-civilization-forms-between-cities').presentation.map;
  assert.match(shang.caption, /大致传播区域/);
  assert.match(shang.caption, /不表示.*政治边界/);
  assert.equal(ancientChina.geometries.find(item => item.id === 'geometry-early-shang-material-spread').approximate, true);
  const sanxingdui = sceneById.get('sanxingdui-pits-beneath-city').presentation.map;
  assert.match(sanxingdui.caption, /三星堆遗址/);
  assert.deepEqual(sanxingdui.layers.map(layer => layer.annotationId), ['annotation-sanxingdui-location']);
});

test('the aggregated V5 atlas validates with Ancient China included', () => {
  const result = queries.createQueries(data).validateAtlasData();
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(data.cards.find(card => card.id === 'western-zhou-bronze-commands'), ancientChina.cards[0]);
  assert.equal(data.cards.find(card => card.id === 'china-early-bronze-connected-worlds'), ancientChina.cards[1]);
  assert.equal(data.cards.find(card => card.id === 'erlitou-ritual-world'), ancientChina.cards[2]);
  assert.equal(data.cards.find(card => card.id === 'shang-ancestors-world'), ancientChina.cards[3]);
  assert.equal(data.cards.find(card => card.id === 'shang-oracle-bones-record'), ancientChina.cards[4]);
  assert.equal(data.cards.find(card => card.id === 'shang-bronzes-ancestor-feast'), ancientChina.cards[5]);
});
