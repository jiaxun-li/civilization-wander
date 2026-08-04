const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ancientEgypt = require('../../data/ancient-egypt.js');
const data = require('../../data/atlas-data.js');
const queries = require('../../data/queries.js');

const root = path.resolve(__dirname, '../..');
const cardById = new Map(ancientEgypt.cards.map(card => [card.id, card]));
const sceneById = new Map(ancientEgypt.scenes.map(scene => [scene.id, scene]));

test('Ancient Egypt exposes the civilization overview, three kingdom stories, and four thematic stories', () => {
  assert.deepEqual(
    ancientEgypt.entities.map(entity => [entity.id, entity.type]),
    [
      ['ancient-egypt-civilization', 'culturalTradition'],
      ['egypt-old-kingdom', 'polity'],
      ['egypt-middle-kingdom', 'polity'],
      ['egypt-new-kingdom', 'polity'],
      ['egypt-pyramids', 'wonder'],
      ['egyptian-religion', 'religionAndMyth'],
      ['egyptian-art', 'artStyle'],
      ['egyptian-hieroglyphs', 'writingSystem']
    ]
  );
  assert.deepEqual(
    ancientEgypt.cards.map(card => [card.id, card.sceneIds.length]),
    [
      ['ancient-egypt-gift-of-nile', 8],
      ['egypt-old-kingdom-overview', 5],
      ['egypt-middle-kingdom-overview', 3],
      ['egypt-new-kingdom-overview', 7],
      ['egypt-pyramids-kingdom-at-work', 8],
      ['egypt-afterlife-journey', 9],
      ['egyptian-art-identity-eternity', 7],
      ['egyptian-hieroglyphs-words-sounds', 6]
    ]
  );
  assert.ok(ancientEgypt.cards.slice(1, 4).every(card => card.primaryEntityId.endsWith('-kingdom')));
});

test('approved Scene order and key prose are preserved', () => {
  assert.deepEqual(cardById.get('ancient-egypt-gift-of-nile').sceneIds, [
    'ancient-egypt-two-lands',
    'ancient-egypt-river-returns',
    'ancient-egypt-pyramid-kingdom',
    'ancient-egypt-visible-identity',
    'ancient-egypt-dead-needs',
    'ancient-egypt-reunifications',
    'ancient-egypt-power-far-away',
    'ancient-egypt-survives-palaces'
  ]);
  assert.deepEqual(cardById.get('egypt-old-kingdom-overview').sceneIds, [
    'egypt-old-two-lands',
    'egypt-old-pyramids-horizon',
    'egypt-old-afterlife-road',
    'egypt-old-officials',
    'egypt-old-north-south'
  ]);
  assert.deepEqual(cardById.get('egypt-middle-kingdom-overview').sceneIds, [
    'egypt-middle-thebes-reunifies',
    'egypt-middle-sinuhe-home',
    'egypt-middle-avaris'
  ]);
  assert.deepEqual(cardById.get('egypt-new-kingdom-overview').sceneIds, [
    'egypt-new-ahmose-avaris',
    'egypt-new-hatshepsut',
    'egypt-new-beyond-borders',
    'egypt-new-amarna-letters',
    'egypt-new-akhenaten-city',
    'egypt-new-kadesh',
    'egypt-new-contraction'
  ]);
  assert.deepEqual(cardById.get('egypt-pyramids-kingdom-at-work').sceneIds, [
    'egypt-pyramid-stone-grows',
    'egypt-pyramid-sneferu-three',
    'egypt-pyramid-whole-complex',
    'egypt-pyramid-merer-boats',
    'egypt-pyramid-workers-city',
    'egypt-pyramid-feeding-city',
    'egypt-pyramid-cult-continues',
    'egypt-pyramid-walls-speak'
  ]);
  assert.deepEqual(cardById.get('egypt-afterlife-journey').sceneIds, [
    'egypt-afterlife-wah-wrapped',
    'egypt-afterlife-many-parts',
    'egypt-afterlife-offerings-continue',
    'egypt-afterlife-pyramid-spells',
    'egypt-afterlife-coffin-texts',
    'egypt-afterlife-travel-guide',
    'egypt-afterlife-gods-on-road',
    'egypt-afterlife-heart-trial',
    'egypt-afterlife-field-work'
  ]);
  assert.deepEqual(cardById.get('egyptian-art-identity-eternity').sceneIds, [
    'egypt-art-images-work',
    'egypt-art-composite-body',
    'egypt-art-size-status',
    'egypt-art-statues-live',
    'egypt-art-hatshepsut-pharaoh',
    'egypt-art-amarna-motion',
    'egypt-art-abu-simbel-scale'
  ]);
  assert.deepEqual(cardById.get('egyptian-hieroglyphs-words-sounds').sceneIds, [
    'egypt-hieroglyph-narmer-name',
    'egypt-hieroglyph-word-sound',
    'egypt-hieroglyph-silent-guides',
    'egypt-hieroglyph-stone-papyrus',
    'egypt-hieroglyph-language-changes',
    'egypt-hieroglyph-alphabet-road'
  ]);
  assert.match(sceneById.get('egypt-old-two-lands').contentBlocks[0].text, /南北两个王国.*纳尔迈尔.*上下埃及之王/s);
  assert.match(sceneById.get('egypt-old-pyramids-horizon').contentBlocks[0].text, /胡夫.*运输、供给和组织工作/s);
  assert.match(sceneById.get('egypt-old-afterlife-road').contentBlocks[0].text, /死后生活.*乌尼斯/s);
  assert.match(sceneById.get('egypt-middle-sinuhe-home').contentBlocks[0].text, /^古埃及文学在中王国达到了巅峰.*辛奴赫.*新国王原谅了他/s);
  assert.match(sceneById.get('egypt-new-hatshepsut').contentBlocks[0].text, /埃及第一位女法老.*在她之前.*共同在位.*她没有假装自己是男人/s);
  assert.match(sceneById.get('egypt-new-akhenaten-city').contentBlocks[0].text, /同时敬奉许多神.*阿蒙.*改成阿肯那顿.*新城很快被放弃/s);
  assert.match(sceneById.get('egypt-new-kadesh').contentBlocks[0].text, /赫梯战车.*未能夺取卡迭石.*真实结果更接近僵局.*约十五年后.*和平条约/s);
  assert.match(sceneById.get('egypt-new-contraction').contentBlocks[0].text, /我们饿了.*北方国王与南方祭司.*新王国结束/s);
  assert.match(sceneById.get('egypt-pyramid-merer-boats').contentBlocks[0].text, /梅勒.*装船、航行、停泊和交货/s);
  assert.match(sceneById.get('egypt-pyramid-feeding-city').contentBlocks[0].text, /面包.*供应网络/s);
  assert.match(sceneById.get('egypt-afterlife-wah-wrapped').contentBlocks[0].text, /瓦赫.*完整、能够被认出的身体/s);
  assert.match(sceneById.get('egypt-afterlife-travel-guide').contentBlocks[0].text, /随身旅行指南.*《亡灵书》.*不是一本人人照抄的标准书/s);
  assert.match(sceneById.get('egypt-art-composite-body').contentBlocks[0].text, /脸和双腿.*侧面.*眼睛和肩膀.*正面/s);
  assert.match(sceneById.get('egypt-art-hatshepsut-pharaoh').contentBlocks[0].text, /并不只有一种样子.*礼仪假胡须.*是她/s);
  assert.match(sceneById.get('egypt-art-abu-simbel-scale').contentBlocks[0].text, /四个高约二十一米.*力量像这座山/s);
  assert.match(sceneById.get('egypt-hieroglyph-word-sound').contentBlocks[0].text, /一个、两个甚至三个辅音.*通常不把元音写出来/s);
  assert.match(sceneById.get('egypt-hieroglyph-stone-papyrus').contentBlocks[0].text, /僧侣体.*并不是每个埃及人都会使用/s);
  assert.match(sceneById.get('egypt-hieroglyph-alphabet-road').contentBlocks[0].text, /第一个声音.*阿列夫.*腓尼基字母/s);
  for (const removedSceneId of [
    'egypt-old-art-status',
    'egypt-middle-king-face',
    'egypt-new-nefertiti-face',
    'egypt-new-tutankhamun-restoration',
    'egypt-new-ramesses-monuments',
    'egypt-middle-nubian-forts',
    'egypt-new-nubia-administration'
  ]) {
    assert.equal(sceneById.has(removedSceneId), false, removedSceneId);
  }
});

test('every Ancient Egypt Scene has reviewed non-text media and claim-level provenance', () => {
  assert.equal(ancientEgypt.scenes.length, 53);
  for (const scene of ancientEgypt.scenes) {
    assert.notEqual(scene.presentation.kind, 'textOnly', scene.id);
    assert.ok(scene.contentBlocks.length > 0, scene.id);
    assert.ok(scene.contentBlocks.every(block => Array.isArray(block.sourceIds) && block.sourceIds.length > 0), scene.id);
    assert.ok(Array.isArray(scene.sourceIds) && scene.sourceIds.length > 0, scene.id);
    if (scene.presentation.kind === 'imageAndText') {
      const asset = data.assets.find(item => item.id === scene.presentation.assetId);
      assert.ok(asset, scene.presentation.assetId);
      assert.ok(scene.sourceIds.some(sourceId => asset.sourceIds.includes(sourceId)), scene.id);
    } else {
      assert.equal(scene.presentation.kind, 'mapAndText', scene.id);
      assert.ok(ancientEgypt.mapStates.some(item => item.id === scene.presentation.map.mapStateId), scene.id);
    }
  }
  assert.equal(sceneById.get('egypt-old-pyramids-horizon').presentation.assetId, 'asset-egypt-old-giza-pyramids');
  assert.equal(sceneById.get('egypt-old-afterlife-road').presentation.assetId, 'asset-egypt-old-unas-exterior');
  assert.equal(sceneById.get('egypt-hieroglyph-word-sound').presentation.assetId, 'asset-egypt-hieroglyph-champollion-table');
  assert.equal(sceneById.get('egypt-hieroglyph-silent-guides').presentation.assetId, 'asset-egypt-hieroglyph-karnak-color');
  assert.equal(sceneById.get('egypt-hieroglyph-alphabet-road').presentation.assetId, 'asset-egypt-hieroglyph-alphabet-chart');
  assert.equal(sceneById.get('egypt-new-contraction').presentation.assetId, 'asset-egypt-new-strike-papyrus');
});

test('Ancient Egypt owns active local assets and preserves reserved future-story files', () => {
  assert.equal(ancientEgypt.assets.length, 30);
  for (const asset of ancientEgypt.assets) {
    assert.ok(asset.src.startsWith('assets/images/ancient-egypt/'), asset.id);
    const filePath = path.resolve(root, asset.src);
    assert.equal(fs.existsSync(filePath), true, asset.src);
    assert.ok(fs.statSync(filePath).size > 1_000, asset.src);
    assert.ok(asset.alt.length >= 15, asset.id);
  }
  const nefertitiSource = ancientEgypt.sources.find(source => source.id === 'source-smb-nefertiti-image-cc-by-sa');
  assert.equal(nefertitiSource.author, 'Sandra Steiß');
  assert.ok(nefertitiSource.title.includes('CC BY-SA 4.0'));
  assert.match(ancientEgypt.assets.find(asset => asset.id === 'asset-egypt-art-anubis-facsimile').title, /现代1:1摹本/);
  assert.match(ancientEgypt.assets.find(asset => asset.id === 'asset-egypt-art-abu-simbel-color').alt, /四尊.*拉美西斯二世坐像/);
  for (const relativePath of [
    'assets/images/ancient-egypt/old-kingdom-sahure-statue.webp',
    'assets/images/ancient-egypt/middle-kingdom-senwosret-iii.webp',
    'assets/images/ancient-egypt/new-kingdom-nefertiti.webp',
    'assets/images/ancient-egypt/new-kingdom-amun-head.webp',
    'assets/images/ancient-egypt/new-kingdom-abu-simbel.webp'
  ]) {
    const filePath = path.resolve(root, relativePath);
    assert.equal(fs.existsSync(filePath), true, relativePath);
    assert.ok(fs.statSync(filePath).size > 1_000, relativePath);
  }
});

test('regional Scenes use sourced maps while removed survey Scenes stay absent', () => {
  const mapSceneIds = ancientEgypt.scenes
    .filter(scene => scene.presentation.kind === 'mapAndText')
    .map(scene => scene.id);
  assert.deepEqual(mapSceneIds, [
    'ancient-egypt-river-returns',
    'ancient-egypt-reunifications',
    'ancient-egypt-power-far-away',
    'egypt-old-two-lands',
    'egypt-old-north-south',
    'egypt-middle-thebes-reunifies',
    'egypt-middle-avaris',
    'egypt-new-ahmose-avaris',
    'egypt-new-beyond-borders',
    'egypt-new-kadesh'
  ]);
  assert.equal(ancientEgypt.cameraPresets.length, 4);
  assert.equal(ancientEgypt.mapStates.length, 4);
  assert.equal(ancientEgypt.geometries.length, 4);
  assert.equal(ancientEgypt.mapAnnotations.length, 14);
  assert.ok(ancientEgypt.geometries.every(geometry => geometry.approximate === true));
  assert.ok(ancientEgypt.geometries.every(geometry => /近似/.test(geometry.label)));
  assert.ok(ancientEgypt.mapAnnotations.every(annotation =>
    annotation.anchorMeaning === 'associatedWith' && annotation.approximate === true
  ));
  assert.deepEqual([
    sceneById.get('egypt-pyramid-merer-boats').presentation.assetId,
    sceneById.get('egypt-pyramid-workers-city').presentation.assetId
  ], [
    'asset-egypt-pyramid-oarsmen-relief',
    'asset-egypt-pyramid-giza-complex-map'
  ]);
  assert.match(ancientEgypt.assets.find(asset => asset.id === 'asset-egypt-pyramid-oarsmen-relief').title, /并不直接描绘梅勒的船队/);
  assert.match(ancientEgypt.assets.find(asset => asset.id === 'asset-egypt-pyramid-giza-complex-map').title, /Builders’ quarters/);
  assert.match(sceneById.get('egypt-old-two-lands').presentation.map.caption, /不是.*精确边界/);
  assert.match(sceneById.get('egypt-new-beyond-borders').presentation.map.caption, /不是精确行军路线或国界/);
  assert.equal(sceneById.get('egypt-new-contraction').presentation.kind, 'imageAndText');
});

test('navigation preserves existing paths and connects the civilization overview reciprocally', () => {
  const sceneOwner = new Map(ancientEgypt.cards.flatMap(card => card.sceneIds.map(sceneId => [sceneId, card.id])));
  const directions = ancientEgypt.navigationPlacements.map(placement => {
    const sourceCardId = placement.owner.kind === 'card'
      ? placement.owner.cardId
      : sceneOwner.get(placement.owner.sceneId);
    const option = ancientEgypt.navigationOptions.find(item => item.id === placement.navigationOptionId);
    return `${sourceCardId}->${option.target.cardId}`;
  }).sort();
  const existingDirections = [
    'egypt-afterlife-journey->egypt-old-kingdom-overview',
    'egypt-afterlife-journey->egypt-pyramids-kingdom-at-work',
    'egypt-afterlife-journey->egyptian-art-identity-eternity',
    'egypt-afterlife-journey->egyptian-hieroglyphs-words-sounds',
    'egypt-middle-kingdom-overview->egypt-new-kingdom-overview',
    'egypt-middle-kingdom-overview->egypt-old-kingdom-overview',
    'egypt-new-kingdom-overview->egypt-middle-kingdom-overview',
    'egypt-new-kingdom-overview->egyptian-art-identity-eternity',
    'egypt-old-kingdom-overview->egypt-afterlife-journey',
    'egypt-old-kingdom-overview->egypt-middle-kingdom-overview',
    'egypt-old-kingdom-overview->egypt-pyramids-kingdom-at-work',
    'egypt-old-kingdom-overview->egyptian-art-identity-eternity',
    'egypt-pyramids-kingdom-at-work->egypt-afterlife-journey',
    'egypt-pyramids-kingdom-at-work->egypt-old-kingdom-overview',
    'egypt-pyramids-kingdom-at-work->egyptian-hieroglyphs-words-sounds',
    'egyptian-art-identity-eternity->egypt-afterlife-journey',
    'egyptian-art-identity-eternity->egypt-new-kingdom-overview',
    'egyptian-art-identity-eternity->egypt-old-kingdom-overview',
    'egyptian-art-identity-eternity->egyptian-hieroglyphs-words-sounds',
    'egyptian-hieroglyphs-words-sounds->egypt-afterlife-journey',
    'egyptian-hieroglyphs-words-sounds->egypt-pyramids-kingdom-at-work',
    'egyptian-hieroglyphs-words-sounds->egyptian-art-identity-eternity'
  ];
  for (const direction of existingDirections) assert.ok(directions.includes(direction), direction);
  for (const direction of [
    'ancient-egypt-gift-of-nile->egypt-old-kingdom-overview',
    'ancient-egypt-gift-of-nile->egypt-middle-kingdom-overview',
    'ancient-egypt-gift-of-nile->egypt-new-kingdom-overview',
    'ancient-egypt-gift-of-nile->egypt-pyramids-kingdom-at-work',
    'ancient-egypt-gift-of-nile->egypt-afterlife-journey',
    'ancient-egypt-gift-of-nile->egyptian-art-identity-eternity',
    'ancient-egypt-gift-of-nile->egyptian-hieroglyphs-words-sounds',
    'ancient-egypt-gift-of-nile->late-bronze-palaces-go-dark',
    'ancient-egypt-gift-of-nile->medinet-habu-sea-raiders',
    'egypt-old-kingdom-overview->ancient-egypt-gift-of-nile',
    'egypt-middle-kingdom-overview->ancient-egypt-gift-of-nile',
    'egypt-new-kingdom-overview->ancient-egypt-gift-of-nile'
  ]) assert.ok(directions.includes(direction), direction);
  for (const optionId of ['nav-egypt-old-civilization', 'nav-egypt-middle-civilization', 'nav-egypt-new-civilization']) {
    assert.equal(ancientEgypt.navigationOptions.find(option => option.id === optionId).label, '进入尼罗河边的三千年');
  }
  assert.ok(directions.every(direction => !/old-kingdom-overview->egypt-new|new-kingdom-overview->egypt-old/.test(direction)));
  const oldToMiddle = ancientEgypt.navigationPlacements.find(placement =>
    placement.navigationOptionId === 'nav-egypt-old-middle'
  );
  assert.deepEqual(oldToMiddle.owner, { kind: 'scene', sceneId: 'egypt-old-north-south' });
  assert.equal(oldToMiddle.slot, 'inline');
  const middleToNew = ancientEgypt.navigationPlacements.find(placement =>
    placement.navigationOptionId === 'nav-egypt-middle-new'
  );
  assert.deepEqual(middleToNew.owner, { kind: 'scene', sceneId: 'egypt-middle-avaris' });
  assert.equal(middleToNew.slot, 'inline');
  assert.deepEqual(
    ancientEgypt.navigationPlacements.find(placement => placement.navigationOptionId === 'nav-egypt-old-pyramids').owner,
    { kind: 'scene', sceneId: 'egypt-old-pyramids-horizon' }
  );
  assert.deepEqual(
    ancientEgypt.navigationPlacements.find(placement => placement.navigationOptionId === 'nav-egypt-old-afterlife').owner,
    { kind: 'scene', sceneId: 'egypt-old-afterlife-road' }
  );
  const afterlifeSceneFourPlacements = ancientEgypt.navigationPlacements
    .filter(placement => placement.owner.kind === 'scene' && placement.owner.sceneId === 'egypt-afterlife-pyramid-spells')
    .sort((left, right) => left.rank - right.rank);
  assert.deepEqual(
    afterlifeSceneFourPlacements.map(placement => [placement.navigationOptionId, placement.slot, placement.rank]),
    [
      ['nav-egypt-afterlife-pyramids', 'inline', 1],
      ['nav-egypt-afterlife-old', 'inline', 2],
      ['nav-egypt-afterlife-hieroglyph', 'inline', 3]
    ]
  );
  assert.deepEqual(
    ancientEgypt.navigationPlacements.find(placement => placement.navigationOptionId === 'nav-egypt-hieroglyph-afterlife').owner,
    { kind: 'scene', sceneId: 'egypt-hieroglyph-stone-papyrus' }
  );
  assert.deepEqual(
    ancientEgypt.navigationPlacements.find(placement => placement.navigationOptionId === 'nav-egypt-hieroglyph-pyramids').owner,
    { kind: 'scene', sceneId: 'egypt-hieroglyph-word-sound' }
  );
  assert.deepEqual(
    ancientEgypt.navigationPlacements.find(placement => placement.navigationOptionId === 'nav-egypt-hieroglyph-art').owner,
    { kind: 'scene', sceneId: 'egypt-hieroglyph-silent-guides' }
  );
});

test('the aggregated V5 atlas validates with Ancient Egypt included', () => {
  const result = queries.createQueries(data).validateAtlasData();
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.ok(data.cards.some(card => card.id === 'egypt-new-kingdom-overview'));
});
