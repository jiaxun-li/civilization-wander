const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const lateBronzeAge = require('../../data/late-bronze-age.js');
const data = require('../../data/atlas-data.js');

const root = path.resolve(__dirname, '../..');
const cardById = new Map(lateBronzeAge.cards.map(card => [card.id, card]));
const sceneById = new Map(lateBronzeAge.scenes.map(scene => [scene.id, scene]));

test('the Late Bronze Age module contains both approved three-card batches', () => {
  assert.deepEqual(
    lateBronzeAge.entities.map(entity => [entity.id, entity.type]),
    [
      ['hittite-empire', 'polity'],
      ['ugarit-kingdom', 'polity'],
      ['battle-of-kadesh-war', 'war'],
      ['amarna-letters-corpus', 'TextDocument'],
      ['medinet-habu-war-records', 'CulturalObject'],
      ['late-bronze-palace-system', 'institution']
    ]
  );
  assert.deepEqual(
    lateBronzeAge.cards.map(card => [card.id, card.sceneIds.length]),
    [
      ['hittite-syria-treaties', 6],
      ['ugarit-kings-trade', 6],
      ['kadesh-did-not-end-war', 6],
      ['amarna-kings-write-world', 7],
      ['medinet-habu-sea-raiders', 5],
      ['late-bronze-palaces-go-dark', 7]
    ]
  );
});

test('Hittite overview spans formation, renewed empire, treaty rule, great-power diplomacy, and dissolution', () => {
  const card = cardById.get('hittite-syria-treaties');
  const scenes = cardById.get('hittite-syria-treaties').sceneIds.map(sceneId => sceneById.get(sceneId));
  const prose = scenes.map(scene => scene.contentBlocks.map(block => block.text).join('\n'));
  assert.equal(card.title, '高原王国成为条约帝国');
  assert.equal(card.timeSpan.label, '约公元前1650—前1180年');
  assert.match(prose[0], /早期国王哈图西里一世/);
  assert.match(prose[0], /哈图沙.*王国中心/s);
  assert.match(prose[0], /巴比伦/);
  assert.match(prose[2], /苏庇路里乌玛一世.*王族.*卡尔凯美什/s);
  assert.match(prose[3], /乌加里特.*维鲁萨.*特洛伊/s);
  assert.match(prose[4], /卡迭石.*拉美西斯二世.*哈图西里三世.*交换条约/s);
  assert.match(prose[5], /哈图沙遭到破坏并被放弃.*中央王国.*一同解体.*继续使用赫梯的名称/s);
});

test('Ugarit begins with formation and explicitly reaches its destruction', () => {
  const scenes = cardById.get('ugarit-kings-trade').sceneIds.map(sceneId => sceneById.get(sceneId));
  assert.match(scenes[0].contentBlocks[0].text, /很早便有人定居.*一个王国清晰可见/s);
  assert.match(scenes.at(-1).contentBlocks[0].text, /严重毁坏.*原有王国没有恢复/s);
});

test('every new Scene has reviewed non-text media and claim-level provenance', () => {
  assert.equal(lateBronzeAge.scenes.length, 37);
  for (const scene of lateBronzeAge.scenes) {
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
      assert.ok(lateBronzeAge.mapStates.some(item => item.id === scene.presentation.map.mapStateId), scene.id);
    }
  }
});

test('Late Bronze Age media is local, substantial, and not over-reused', () => {
  const useCounts = new Map();
  for (const asset of lateBronzeAge.assets) {
    assert.ok(asset.src.startsWith('assets/images/late-bronze-age/'), asset.id);
    const filePath = path.resolve(root, asset.src);
    assert.equal(fs.existsSync(filePath), true, asset.src);
    assert.ok(fs.statSync(filePath).size > 1_000, asset.src);
    assert.ok(asset.alt.length >= 15, asset.id);
  }
  for (const scene of lateBronzeAge.scenes.filter(item => item.presentation.kind === 'imageAndText')) {
    useCounts.set(scene.presentation.assetId, (useCounts.get(scene.presentation.assetId) || 0) + 1);
  }
  assert.ok([...useCounts.values()].every(count => count <= 2));
  assert.equal(useCounts.get('asset-lba-ugarit-palace'), 2);
  const globalUseCounts = new Map();
  for (const scene of data.scenes.filter(item => item.presentation.kind === 'imageAndText')) {
    globalUseCounts.set(scene.presentation.assetId, (globalUseCounts.get(scene.presentation.assetId) || 0) + 1);
  }
  assert.ok([...globalUseCounts.values()].every(count => count <= 2));
  assert.equal(globalUseCounts.get('asset-egypt-new-amarna-letter'), 2);
  assert.equal(globalUseCounts.get('asset-lba-kadesh-ramesses-relief'), 2);
});

test('the revised second batch preserves the approved narrative focus and Scene cuts', () => {
  const amarna = cardById.get('amarna-kings-write-world');
  assert.match(amarna.editorialPurpose, /破除青铜时代只有战争与征服/);
  assert.match(amarna.thesis.text, /不仅通过战争竞争.*外交秩序/s);
  assert.match(sceneById.get('amarna-small-kings-write').contentBlocks[0].text, /不能像大王一样把法老称作兄弟.*臣属的口吻/s);
  assert.match(sceneById.get('amarna-diplomacy-routine').contentBlocks[0].text, /巴比伦、米坦尼、赫梯和阿拉西亚.*亚述.*日常工作方式/s);
  assert.match(sceneById.get('amarna-palaces-stop-replying').contentBlocks[0].text, /继续运转了一个多世纪.*部分档案不再增长/s);

  const sea = cardById.get('medinet-habu-sea-raiders');
  assert.equal(sea.sceneIds.length, 5);
  assert.equal(sea.sceneIds.includes('medinet-habu-many-names'), false);
  assert.match(sceneById.get('medinet-habu-temple-record').contentBlocks[0].text, /合称为“海上民族”/);

  const palaces = cardById.get('late-bronze-palaces-go-dark');
  assert.equal(palaces.sceneIds.length, 7);
  assert.equal(palaces.sceneIds.includes('palaces-destructions-not-simultaneous'), false);
  assert.match(sceneById.get('palaces-egypt-holds').contentBlocks[0].text, /国家仍然延续/);
  assert.match(sceneById.get('palaces-archaeologists-causes').contentBlocks[0].text, /旱灾、地震、战争、迁徙、内乱与贸易中断/);
});

test('the palace-system opening leads the regional story and the Aegean scene uses a Pylos tablet', () => {
  const opening = sceneById.get('palaces-connect-kingdoms');
  const aegean = sceneById.get('palaces-aegean-writing-stops');
  assert.equal(opening.contentBlocks.length, 2);
  assert.equal(opening.title, '晚青铜时代的宫殿世界崩塌');
  assert.match(opening.contentBlocks[0].text, /约公元前1200年前后.*“晚青铜时代崩溃”.*政府、仓库、作坊和档案中心/s);
  assert.match(opening.contentBlocks[1].text, /赫梯中央王国终结.*乌加里特没有重建.*线形文字B.*政治、经济和社会转折/s);
  assert.deepEqual(opening.presentation, { kind: 'imageAndText', assetId: 'asset-lba-ugarit-throne-hall' });
  assert.ok(opening.sourceIds.includes('source-wikimedia-ugarit-throne-hall'));
  assert.deepEqual(aegean.presentation, { kind: 'imageAndText', assetId: 'asset-lba-pylos-linear-b-tablet' });
  assert.ok(aegean.sourceIds.includes('source-wikimedia-pylos-linear-b-tablet'));
});

test('Amarna and palace collapse now expose the approved reciprocal transition', () => {
  const amarnaToCollapse = lateBronzeAge.navigationOptions.find(option => option.id === 'nav-amarna-collapse');
  const collapseToAmarna = lateBronzeAge.navigationOptions.find(option => option.id === 'nav-collapse-amarna');
  assert.deepEqual(amarnaToCollapse.target, { cardId: 'late-bronze-palaces-go-dark', sceneId: 'palaces-connect-kingdoms' });
  assert.deepEqual(collapseToAmarna.target, { cardId: 'amarna-kings-write-world', sceneId: 'amarna-palaces-stop-replying' });
  assert.equal(sceneById.get('amarna-palaces-stop-replying').presentation.map.mapStateId, 'map-lba-palace-centers');
  assert.match(sceneById.get('amarna-palaces-stop-replying').presentation.map.caption, /埃及延续.*哈图沙、乌加里特和皮洛斯/s);
});

test('Amarna diplomacy links directly to the approved Kassite Babylon Scene', () => {
  const option = lateBronzeAge.navigationOptions.find(item => item.id === 'nav-amarna-mesopotamia');
  const placement = lateBronzeAge.navigationPlacements.find(item => item.navigationOptionId === option.id);
  assert.equal(option.label, '进入与法老通信的巴比伦王朝');
  assert.deepEqual(option.target, {
    cardId: 'mesopotamia-cities-outlast-dynasties',
    sceneId: 'mesopotamia-babylon-writes-assyria-grows'
  });
  assert.deepEqual(option.entry, { kind: 'targetScene' });
  assert.deepEqual(placement.owner, { kind: 'scene', sceneId: 'amarna-diplomacy-routine' });
  assert.equal(placement.slot, 'inline');
});

test('Amarna uses the approved mix of messenger illustration, diplomatic facsimile, letter, and maps', () => {
  assert.equal(sceneById.get('amarna-shared-writing').presentation.assetId, 'asset-lba-amarna-mail-carrier');
  assert.equal(sceneById.get('amarna-gifts-repeat-friendship').presentation.assetId, 'asset-lba-amarna-tushratta-marriage-letter');
  assert.equal(sceneById.get('amarna-small-kings-write').presentation.assetId, 'asset-lba-amarna-four-foreign-rulers');
  assert.equal(sceneById.get('amarna-kings-brothers').presentation.kind, 'mapAndText');
  assert.equal(sceneById.get('amarna-diplomacy-routine').presentation.kind, 'mapAndText');

  const mailCarrier = lateBronzeAge.assets.find(item => item.id === 'asset-lba-amarna-mail-carrier');
  const foreignRulers = lateBronzeAge.assets.find(item => item.id === 'asset-lba-amarna-four-foreign-rulers');
  assert.match(mailCarrier.alt, /后世插图.*并非阿玛尔纳使者的现场记录/);
  assert.match(foreignRulers.alt, /原画比阿玛尔纳时代更早/);
});

test('Amarna exposes the approved reciprocal links to cuneiform, the New Kingdom, and collapse', () => {
  const sceneOwner = new Map(data.cards.flatMap(card => card.sceneIds.map(sceneId => [sceneId, card.id])));
  const optionById = new Map(data.navigationOptions.map(option => [option.id, option]));
  const directions = new Set(data.navigationPlacements.map(placement => {
    const sourceCardId = placement.owner.kind === 'card' ? placement.owner.cardId : sceneOwner.get(placement.owner.sceneId);
    return `${sourceCardId}->${optionById.get(placement.navigationOptionId).target.cardId}`;
  }));
  assert.equal(directions.has('amarna-kings-write-world->cuneiform-overview'), true);
  assert.equal(directions.has('cuneiform-overview->amarna-kings-write-world'), true);
  assert.equal(directions.has('amarna-kings-write-world->egypt-new-kingdom-overview'), true);
  assert.equal(directions.has('egypt-new-kingdom-overview->amarna-kings-write-world'), true);
  assert.equal(directions.has('amarna-kings-write-world->late-bronze-palaces-go-dark'), true);
  assert.equal(directions.has('late-bronze-palaces-go-dark->amarna-kings-write-world'), true);
  assert.equal(directions.has('amarna-kings-write-world->old-babylonian-rise-and-fragmentation'), false);
  assert.equal(directions.has('old-babylonian-rise-and-fragmentation->amarna-kings-write-world'), false);
});

test('the throne-crisis and merchant-palace scenes use the approved non-tablet references', () => {
  const throneScene = sceneById.get('hittite-throne-crises');
  const tradeScene = sceneById.get('ugarit-merchants-palace');
  const throneAsset = lateBronzeAge.assets.find(item => item.id === throneScene.presentation.assetId);
  const tradeAsset = lateBronzeAge.assets.find(item => item.id === tradeScene.presentation.assetId);

  assert.equal(throneAsset.id, 'asset-lba-hittite-inandik-vase');
  assert.equal(tradeAsset.id, 'asset-lba-ugarit-uluburun-reconstruction');
  assert.ok(throneAsset.sourceIds.includes('source-wikimedia-inandik-vase'));
  assert.ok(tradeAsset.sourceIds.includes('source-wikimedia-uluburun-reconstruction'));
  assert.doesNotMatch(`${throneAsset.id} ${tradeAsset.id}`, /tablet/);
});

test('the revised Late Bronze Age maps separate crowded labels and great-power diplomacy', () => {
  const hittiteScene = sceneById.get('hittite-syria-princes');
  const amarnaScene = sceneById.get('amarna-kings-brothers');
  const amarnaOverview = sceneById.get('amarna-diplomacy-routine');
  const aleppo = lateBronzeAge.mapAnnotations.find(item => item.id === 'annotation-lba-aleppo');
  const carchemish = lateBronzeAge.mapAnnotations.find(item => item.id === 'annotation-lba-carchemish');
  const greatKingsGeometry = lateBronzeAge.geometries.find(item => item.id === 'geometry-lba-amarna-great-kings');
  const fullDiplomacyGeometry = lateBronzeAge.geometries.find(item => item.id === 'geometry-lba-amarna-diplomacy');
  const fullDiplomacyMap = lateBronzeAge.mapStates.find(item => item.id === 'map-lba-amarna-diplomacy');
  const fullDiplomacyCamera = lateBronzeAge.cameraPresets.find(item => item.id === 'camera-lba-amarna-full-diplomacy');
  const ugaritCamera = lateBronzeAge.cameraPresets.find(item => item.id === 'camera-lba-ugarit-connections');
  const ugaritPort = lateBronzeAge.mapAnnotations.find(item => item.id === 'annotation-lba-ugarit-port');

  assert.equal(hittiteScene.presentation.map.mapStateId, 'map-lba-hittite-syria');
  assert.deepEqual([aleppo.placement, carchemish.placement], ['left', 'right']);
  assert.equal(amarnaScene.presentation.map.mapStateId, 'map-lba-amarna-great-kings');
  assert.equal(greatKingsGeometry.geometry.type, 'LineString');
  assert.deepEqual(greatKingsGeometry.geometry.coordinates, [[27.65, 27.65], [34.62, 40.02]]);
  assert.equal(amarnaOverview.presentation.map.mapStateId, 'map-lba-amarna-diplomacy');
  assert.equal(amarnaOverview.presentation.map.layers.length, 7);
  assert.equal(fullDiplomacyMap.cameraPresetId, 'camera-lba-amarna-full-diplomacy');
  assert.deepEqual(fullDiplomacyCamera, { id: 'camera-lba-amarna-full-diplomacy', center: [36, 34], scale: 8 });
  assert.equal(fullDiplomacyGeometry.geometry.type, 'MultiLineString');
  assert.equal(fullDiplomacyGeometry.geometry.coordinates.length, 6);
  assert.ok(fullDiplomacyGeometry.geometry.coordinates.some(line =>
    line.some(point => point[0] === 35.78 && point[1] === 35.6)
  ));
  for (const destination of [[44.42, 32.54], [43.25, 35.46], [40, 37], [33.2, 35.1]]) {
    assert.ok(fullDiplomacyGeometry.geometry.coordinates.some(line =>
      line.some(point => point[0] === destination[0] && point[1] === destination[1])
    ));
  }
  assert.deepEqual(ugaritCamera, { id: 'camera-lba-ugarit-connections', center: [34.5, 35.4], scale: 10 });
  assert.equal(ugaritPort.placement, 'below');
});

test('approved reciprocal navigation connects Babylon, Hittite, Ugarit, Kadesh, and Egypt', () => {
  const sceneOwner = new Map(data.cards.flatMap(card => card.sceneIds.map(sceneId => [sceneId, card.id])));
  const optionById = new Map(data.navigationOptions.map(option => [option.id, option]));
  const directions = data.navigationPlacements
    .filter(placement => placement.navigationOptionId.startsWith('nav-hittite-') ||
      placement.navigationOptionId.startsWith('nav-ugarit-hittite') ||
      placement.navigationOptionId.startsWith('nav-kadesh-') ||
      placement.navigationOptionId === 'nav-old-babylon-hittite' ||
      placement.navigationOptionId === 'nav-egypt-kadesh-detail')
    .map(placement => {
      const sourceCardId = placement.owner.kind === 'card'
        ? placement.owner.cardId
        : sceneOwner.get(placement.owner.sceneId);
      return `${sourceCardId}->${optionById.get(placement.navigationOptionId).target.cardId}`;
    });
  for (const expected of [
    'hittite-syria-treaties->old-babylonian-rise-and-fragmentation',
    'old-babylonian-rise-and-fragmentation->hittite-syria-treaties',
    'hittite-syria-treaties->ugarit-kings-trade',
    'ugarit-kings-trade->hittite-syria-treaties',
    'hittite-syria-treaties->kadesh-did-not-end-war',
    'kadesh-did-not-end-war->hittite-syria-treaties',
    'kadesh-did-not-end-war->egypt-new-kingdom-overview',
    'egypt-new-kingdom-overview->kadesh-did-not-end-war'
  ]) {
    assert.ok(directions.includes(expected), expected);
  }
});

test('the two late Bronze Age routes enter the three-thousand-year Nile overview at their approved Scenes', () => {
  for (const [optionId, sceneId] of [
    ['nav-collapse-egypt-civilization', 'palaces-egypt-holds'],
    ['nav-sea-egypt-civilization', 'medinet-habu-egypt-contracts']
  ]) {
    const option = lateBronzeAge.navigationOptions.find(item => item.id === optionId);
    const placement = lateBronzeAge.navigationPlacements.find(item => item.navigationOptionId === optionId);
    assert.equal(option.label, '进入尼罗河边的三千年');
    assert.equal(option.target.cardId, 'ancient-egypt-gift-of-nile');
    assert.deepEqual(placement.owner, { kind: 'scene', sceneId });
    assert.equal(placement.slot, 'inline');
  }
});

test('Kadesh reuses the existing Event while exposing the approved war Entity', () => {
  assert.equal(data.events.filter(event => event.id === 'event-battle-of-kadesh').length, 1);
  const event = data.events.find(item => item.id === 'event-battle-of-kadesh');
  assert.deepEqual(event.participantEntityIds, ['egypt-new-kingdom', 'hittite-empire']);
  assert.equal(data.entities.find(entity => entity.id === 'battle-of-kadesh-war').type, 'war');
  assert.deepEqual(
    [...new Set(cardById.get('kadesh-did-not-end-war').sceneIds.flatMap(sceneId => sceneById.get(sceneId).eventIds))],
    ['event-battle-of-kadesh', 'event-egypt-hatti-treaty']
  );
});

test('the Kadesh surprise-attack diagram uses the approved English adaptation', () => {
  const asset = lateBronzeAge.assets.find(item => item.id === 'asset-lba-kadesh-surprise-map');
  const source = lateBronzeAge.sources.find(item => item.id === 'source-wikimedia-kadesh-attack-map');
  assert.match(asset.title, /英语教学图/);
  assert.match(asset.alt, /英语教学地图/);
  assert.match(source.title, /English adaptation/);
  assert.ok(asset.sourceIds.includes('source-spalinger-war-egypt'));
});
