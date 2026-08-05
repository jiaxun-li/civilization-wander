const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const aegean = require('../../data/aegean.js');
const { atlasData: data } = require('../../src/data/atlas-data.ts');

const root = path.resolve(__dirname, '../..');
const cardById = new Map(aegean.cards.map(card => [card.id, card]));
const sceneById = new Map(aegean.scenes.map(scene => [scene.id, scene]));

test('the Aegean expansion contains the approved eight Cards', () => {
  assert.deepEqual(
    aegean.cards.map(card => [card.id, card.title, card.sceneIds.length]),
    [
      ['crete-through-palatial-age', '克里特岛走过宫殿时代', 5],
      ['mycenae-graves-palaces-tablets', '墓穴、宫殿与泥板', 5],
      ['greece-reconnects-after-palaces', '宫殿之后，希腊重新连接', 3],
      ['greek-gods-leave-palaces', '众神走出宫殿', 8],
      ['greek-heroes-live-in-song', '英雄活在歌声里', 8],
      ['troy-layered-city', '高墙下的层层城市', 3],
      ['iliad-achilles-anger', '阿喀琉斯的愤怒', 8],
      ['odyssey-name-and-home', '失去姓名，才能回家', 10]
    ]
  );
  assert.deepEqual(cardById.get('crete-through-palatial-age').timeSpan.start, -2000);
  assert.deepEqual(cardById.get('greece-reconnects-after-palaces').timeSpan.end, -800);
});

test('the approved Crete transition removes the rejected centre list', () => {
  const transitionText = sceneById.get('crete-tablets-change-language').contentBlocks[0].text;
  const allCreteText = cardById.get('crete-through-palatial-age').sceneIds
    .flatMap(sceneId => sceneById.get(sceneId).contentBlocks.map(block => block.text)).join('\n');
  assert.match(transitionText, /多处宫殿中心在毁坏后不再恢复原来的形态/);
  assert.doesNotMatch(allCreteText, /费斯托斯|马利亚|扎克罗斯/);
});

test('gods, heroes, Iliad, and Odyssey entrances are live', () => {
  assert.match(sceneById.get('mycenae-palaces-write-needs').contentBlocks[0].text, /波塞冬等神名/);
  assert.match(sceneById.get('mycenae-hero-stories-travel').contentBlocks[0].text, /《伊利亚特》/);
  assert.match(sceneById.get('dark-age-sea-routes-return').contentBlocks[0].text, /《奥德赛》/);
  assert.ok(aegean.navigationOptions.some(option => option.target.cardId === 'greek-gods-leave-palaces'));
  assert.ok(aegean.navigationOptions.some(option => option.target.cardId === 'greek-heroes-live-in-song'));
  assert.ok(aegean.navigationOptions.some(option => option.target.cardId === 'iliad-achilles-anger'));
  assert.ok(aegean.navigationOptions.some(option => option.target.cardId === 'odyssey-name-and-home'));
  assert.ok(cardById.has('iliad-achilles-anger'));
  assert.ok(cardById.has('odyssey-name-and-home'));
});

test('both new entities use the approved religionAndMyth type and myth scenes suppress dates', () => {
  const newEntities = aegean.entities.filter(entity => ['greek-divine-tradition', 'greek-heroic-tradition'].includes(entity.id));
  assert.deepEqual(newEntities.map(entity => entity.type), ['religionAndMyth', 'religionAndMyth']);
  const mythSceneIds = [
    ...cardById.get('greek-gods-leave-palaces').sceneIds.slice(2),
    ...cardById.get('greek-heroes-live-in-song').sceneIds.slice(2)
  ];
  assert.equal(mythSceneIds.length, 12);
  assert.ok(mythSceneIds.every(sceneId => sceneById.get(sceneId).timeDisplay === 'undatedNarrative'));
});

test('Troy is a SettlementSite while both epics are TextDocuments', () => {
  assert.equal(aegean.entities.find(entity => entity.id === 'troy-archaeological-site').type, 'SettlementSite');
  assert.equal(aegean.entities.find(entity => entity.id === 'iliad-text').type, 'TextDocument');
  assert.equal(aegean.entities.find(entity => entity.id === 'odyssey-text').type, 'TextDocument');
  assert.equal(cardById.get('troy-layered-city').sceneIds.length, 3);
});

test('every approved Scene has sourced non-text media', () => {
  assert.equal(aegean.scenes.length, 50);
  for (const scene of aegean.scenes) {
    assert.notEqual(scene.presentation.kind, 'textOnly', scene.id);
    assert.ok(scene.contentBlocks.every(block => Array.isArray(block.sourceIds) && block.sourceIds.length > 0), scene.id);
    assert.ok(scene.sourceIds.length > 0, scene.id);
    if (scene.presentation.kind === 'imageAndText') {
      const asset = data.assets.find(item => item.id === scene.presentation.assetId);
      assert.ok(asset, scene.presentation.assetId);
      assert.ok(scene.sourceIds.some(sourceId => asset.sourceIds.includes(sourceId)), scene.id);
    } else {
      assert.equal(scene.presentation.kind, 'mapAndText', scene.id);
      assert.ok(data.mapStates.some(item => item.id === scene.presentation.map.mapStateId), scene.id);
    }
  }
});

test('Aegean images are local, substantial, and globally reused at most twice', () => {
  for (const asset of aegean.assets) {
    assert.ok(asset.src.startsWith('assets/images/aegean/'), asset.id);
    const filePath = path.resolve(root, asset.src);
    assert.equal(fs.existsSync(filePath), true, asset.src);
    assert.ok(fs.statSync(filePath).size > 1_000, asset.src);
    assert.ok(asset.alt.length >= 15, asset.id);
  }

  const useCounts = new Map();
  for (const scene of data.scenes.filter(item => item.presentation.kind === 'imageAndText')) {
    useCounts.set(scene.presentation.assetId, (useCounts.get(scene.presentation.assetId) || 0) + 1);
  }
  assert.ok([...useCounts.values()].every(count => count <= 2));
  assert.equal(useCounts.get('asset-aegean-knossos-linear-b'), 2);
  assert.equal(useCounts.get('asset-aegean-mycenae-warrior-krater'), 2);
});

test('the eight Cards and late Bronze Age collapse expose reciprocal links', () => {
  const sceneOwner = new Map(data.cards.flatMap(card => card.sceneIds.map(sceneId => [sceneId, card.id])));
  const optionById = new Map(data.navigationOptions.map(option => [option.id, option]));
  const directions = new Set(aegean.navigationPlacements.map(placement => {
    const sourceCardId = placement.owner.kind === 'card' ? placement.owner.cardId : sceneOwner.get(placement.owner.sceneId);
    return `${sourceCardId}->${optionById.get(placement.navigationOptionId).target.cardId}`;
  }));
  assert.deepEqual(directions, new Set([
    'crete-through-palatial-age->mycenae-graves-palaces-tablets',
    'mycenae-graves-palaces-tablets->crete-through-palatial-age',
    'mycenae-graves-palaces-tablets->greece-reconnects-after-palaces',
    'greece-reconnects-after-palaces->mycenae-graves-palaces-tablets',
    'mycenae-graves-palaces-tablets->late-bronze-palaces-go-dark',
    'greece-reconnects-after-palaces->late-bronze-palaces-go-dark',
    'late-bronze-palaces-go-dark->mycenae-graves-palaces-tablets',
    'late-bronze-palaces-go-dark->greece-reconnects-after-palaces',
    'mycenae-graves-palaces-tablets->greek-gods-leave-palaces',
    'greek-gods-leave-palaces->mycenae-graves-palaces-tablets',
    'mycenae-graves-palaces-tablets->greek-heroes-live-in-song',
    'greek-heroes-live-in-song->mycenae-graves-palaces-tablets',
    'greece-reconnects-after-palaces->greek-heroes-live-in-song',
    'greek-heroes-live-in-song->greece-reconnects-after-palaces',
    'greek-gods-leave-palaces->greek-heroes-live-in-song',
    'greek-heroes-live-in-song->greek-gods-leave-palaces',
    'troy-layered-city->hittite-syria-treaties',
    'hittite-syria-treaties->troy-layered-city',
    'troy-layered-city->iliad-achilles-anger',
    'iliad-achilles-anger->troy-layered-city',
    'greek-heroes-live-in-song->iliad-achilles-anger',
    'iliad-achilles-anger->greek-heroes-live-in-song',
    'greek-heroes-live-in-song->odyssey-name-and-home',
    'odyssey-name-and-home->greek-heroes-live-in-song',
    'greece-reconnects-after-palaces->odyssey-name-and-home',
    'odyssey-name-and-home->greece-reconnects-after-palaces',
    'greek-gods-leave-palaces->iliad-achilles-anger',
    'iliad-achilles-anger->greek-gods-leave-palaces'
  ]));
});

test('the two epics use a Flaxman-led illustration sequence without text-only scenes', () => {
  const iliadAssets = cardById.get('iliad-achilles-anger').sceneIds.map(sceneId => sceneById.get(sceneId).presentation.assetId);
  const odysseyAssets = cardById.get('odyssey-name-and-home').sceneIds.map(sceneId => sceneById.get(sceneId).presentation.assetId);
  assert.equal(iliadAssets.length, 8);
  assert.equal(odysseyAssets.length, 10);
  assert.ok(iliadAssets.every(Boolean));
  assert.ok(odysseyAssets.every(Boolean));
  assert.ok(iliadAssets.filter(assetId => /flaxman|athena-achilles|iliad-/.test(assetId)).length >= 7);
  assert.ok(odysseyAssets.filter(assetId => /odyssey|demodocus/.test(assetId)).length >= 9);
});
