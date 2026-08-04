const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const data = require('../../data/atlas-data.js');
const mesopotamia = require('../../data/mesopotamia.js');
const ancientEgypt = require('../../data/ancient-egypt.js');
const ancientIndia = require('../../data/ancient-india.js');
const ancientChina = require('../../data/ancient-china.js');
const lateBronzeAge = require('../../data/late-bronze-age.js');
const aegean = require('../../data/aegean.js');
const ironAgeNearEast = require('../../data/iron-age-near-east.js');
const queries = require('../../data/queries.js');

test('all complete stories have two sourced evidence groups, two sources, and internal review', () => {
  const evidenceKinds = new Set([
    'geographyObservation',
    'historicalFact',
    'historicalCase',
    'interpretation',
    'mechanism'
  ]);
  for (const card of data.cards) {
    const blocks = card.sceneIds.flatMap(sceneId =>
      data.scenes.find(scene => scene.id === sceneId).contentBlocks
    );
    assert.equal('eventIds' in card, false, card.id);
    assert.ok(card.sceneIds.every(sceneId => {
      const scene = data.scenes.find(item => item.id === sceneId);
      return Array.isArray(scene.eventIds) && scene.eventIds.length > 0;
    }), card.id);
    assert.ok(blocks.filter(block =>
      evidenceKinds.has(block.kind) && Array.isArray(block.sourceIds) && block.sourceIds.length > 0
    ).length >= 2, card.id);
    assert.ok(new Set(card.sourceIds).size >= 2, card.id);
    const reviewCount = card.editorialReview.limitations.length +
      card.editorialReview.counterexamples.length +
      card.editorialReview.uncertainties.length +
      card.editorialReview.alternativeExplanations.length;
    assert.ok(reviewCount > 0, card.id);
  }
});

test('political entities and cultural traditions open their summaries with the normalized time span', () => {
  const datedTypes = new Set(['polity', 'culturalTradition']);
  const entities = data.entities.filter(entity => datedTypes.has(entity.type));
  assert.ok(entities.length > 0);
  for (const entity of entities) {
    assert.ok(
      entity.canonicalSummary.startsWith(`${entity.timeSpan.label}，`),
      `${entity.id}: ${entity.canonicalSummary}`
    );
  }
});

test('every Scene timeSpan label is a pure year range derived from start and end', () => {
  function expectedLabel(timeSpan) {
    const prefix = timeSpan.approximate ? '约' : '';
    if (timeSpan.start < 0 && timeSpan.end < 0) {
      return timeSpan.start === timeSpan.end
        ? `${prefix}公元前${Math.abs(timeSpan.start)}年`
        : `${prefix}公元前${Math.abs(timeSpan.start)}—前${Math.abs(timeSpan.end)}年`;
    }
    if (timeSpan.start > 0 && timeSpan.end > 0) {
      return timeSpan.start === timeSpan.end
        ? `${prefix}公元${timeSpan.start}年`
        : `${prefix}公元${timeSpan.start}—${timeSpan.end}年`;
    }
    return `${prefix}公元前${Math.abs(timeSpan.start)}—公元${timeSpan.end}年`;
  }

  for (const scene of data.scenes) {
    assert.equal(scene.timeSpan.label, expectedLabel(scene.timeSpan), scene.id);
  }
});

test('only approved literary episodes use the fixed undated display mode', () => {
  const undatedSceneIds = data.scenes
    .filter(scene => scene.timeDisplay === 'undatedNarrative')
    .map(scene => scene.id);
  assert.deepEqual(undatedSceneIds, [
    'gilgamesh-enkidu-enters-uruk',
    'gilgamesh-rivals-become-friends',
    'gilgamesh-cedar-forest',
    'gilgamesh-bull-of-heaven',
    'gilgamesh-enkidu-dies',
    'gilgamesh-worlds-end',
    'gilgamesh-flood-survivor',
    'gilgamesh-immortality-lost',
    'tower-of-babel-builders-stay-together',
    'tower-of-babel-languages-stop-work',
    'gods-younger-overthrow-older',
    'gods-three-brothers-divide-world',
    'gods-olympus-quarrels',
    'gods-gifts-and-requests',
    'gods-demeter-persephone-return',
    'gods-turn-to-heroes',
    'heroes-between-gods-and-mortals',
    'heroes-monsters-wait',
    'heroes-board-argo',
    'heroes-curses-cross-generations',
    'heroes-gather-at-troy',
    'heroes-homecomings-continue',
    'iliad-two-captives-start-quarrel',
    'iliad-achilles-lets-greeks-fail',
    'iliad-hector-reaches-ships',
    'iliad-patroclus-wears-armor',
    'iliad-new-shield-returns-hero',
    'iliad-hector-dies-outside-walls',
    'iliad-priam-enters-enemy-camp',
    'odyssey-suitors-consume-house',
    'odyssey-calypso-releases-hero',
    'odyssey-princess-leads-stranger',
    'odyssey-nobody-defeats-cyclops',
    'odyssey-wind-bag-opens',
    'odyssey-witch-and-dead-guide-home',
    'odyssey-songs-monsters-taboo-kill-crew',
    'odyssey-beggar-enters-own-hall',
    'odyssey-bow-and-bed-restore-name',
    'israel-jacob-gets-another-name'
  ]);
});

test('the approved Sumer and Akkadian revision stays concise and keeps Akkad outside the Sumerian tradition', () => {
  const sceneById = new Map(data.scenes.map(scene => [scene.id, scene]));
  const sumerCard = data.cards.find(card => card.id === 'sumer-measuring-land-time');
  const akkadianCard = data.cards.find(card => card.id === 'akkadian-empire-overview');
  const revisedSceneIds = [...sumerCard.sceneIds, ...akkadianCard.sceneIds];

  assert.match(sceneById.get('sumer-water-network').contentBlocks[0].text, /底格里斯河与幼发拉底河/);
  assert.match(sceneById.get('sumer-methods-outlast-dynasties').contentBlocks[0].text, /它不是苏美尔王朝/);
  assert.match(akkadianCard.introduction, /不属于苏美尔城邦传统/);
  assert.match(sceneById.get('akkadian-empire-city-states').contentBlocks[0].text, /纳入一个外来的王权/);
  assert.equal(sceneById.get('akkadian-empire-sargon-memory').contentBlocks.length, 2);
  assert.equal(sceneById.get('akkadian-empire-sargon-memory').timeSpan.label, '约公元前2350—前600年');

  for (const sceneId of revisedSceneIds) {
    const length = sceneById.get(sceneId).contentBlocks.map(block => block.text).join('').replace(/\s/g, '').length;
    assert.ok(length <= 150, `${sceneId}: ${length}`);
  }
});

test('the cuneiform ending reaches Amarna, Assyria, and the last dated text', () => {
  const entity = mesopotamia.entities.find(item => item.id === 'cuneiform');
  const card = mesopotamia.cards.find(item => item.id === 'cuneiform-overview');
  const scene = mesopotamia.scenes.find(item => item.id === 'cuneiform-many-languages');
  const prose = scene.contentBlocks.map(block => block.text).join('\n');

  assert.deepEqual([entity.timeSpan.start, entity.timeSpan.end], [-3350, 75]);
  assert.equal(entity.timeSpan.label, '约公元前3350—公元75年');
  assert.deepEqual([card.timeSpan.start, card.timeSpan.end], [-3350, 75]);
  assert.deepEqual([scene.timeSpan.start, scene.timeSpan.end], [-2600, 75]);
  assert.match(prose, /阿玛尔纳.*交换信件/s);
  assert.match(prose, /亚述和巴比伦.*尼尼微/s);
  assert.match(prose, /公元75年/);
});

test('the Sumer story derives its Events from Scenes and offers the five approved entrances', () => {
  const card = data.cards.find(item => item.id === 'sumer-measuring-land-time');
  assert.equal('eventIds' in card, false);
  assert.deepEqual(
    queries.getEventsForCard(card.id).map(event => event.id),
    [
      'event-southern-mesopotamia-water-land-management',
      'event-proto-cuneiform-accounting-emerges',
      'event-mesopotamian-number-calendar-practices-develop',
      'event-akkadian-imperial-expansion',
      'event-ur-iii-formation'
    ]
  );
  const placements = data.navigationPlacements.filter(placement =>
    (placement.owner.kind === 'card' && placement.owner.cardId === card.id) ||
    (placement.owner.kind === 'scene' && card.sceneIds.includes(placement.owner.sceneId))
  );
  assert.deepEqual(
    placements.map(placement => placement.navigationOptionId),
    ['nav-sumer-mesopotamia', 'nav-sumer-uruk', 'nav-sumer-cuneiform', 'nav-sumer-akkadian-empire', 'nav-sumer-ur-iii']
  );
  const closing = placements.filter(placement => placement.slot === 'closing');
  assert.deepEqual(closing.map(placement => placement.navigationOptionId), ['nav-sumer-mesopotamia', 'nav-sumer-akkadian-empire']);
  const urIIIPlacement = placements.find(placement => placement.navigationOptionId === 'nav-sumer-ur-iii');
  assert.deepEqual(urIIIPlacement.owner, { kind: 'scene', sceneId: 'sumer-methods-outlast-dynasties' });
  assert.equal(urIIIPlacement.slot, 'inline');
});

test('the Ur III entrances sit in the final Scenes of the Sumer and Akkadian stories', () => {
  const expected = new Map([
    ['nav-sumer-ur-iii', 'sumer-methods-outlast-dynasties'],
    ['nav-akkadian-ur-iii', 'akkadian-empire-fragmentation']
  ]);
  for (const [navigationOptionId, sceneId] of expected) {
    const placement = data.navigationPlacements.find(item => item.navigationOptionId === navigationOptionId);
    assert.deepEqual(placement.owner, { kind: 'scene', sceneId });
    assert.equal(placement.slot, 'inline');
  }
});

test('Ur III and the temple story link reciprocally at the shared building episode', () => {
  const expected = new Map([
    ['nav-ur-iii-mesopotamian-temple', ['ur-iii-building-order', 'mesopotamian-temple-overview', 'mesopotamian-temple-ur']],
    ['nav-temple-ur-iii', ['mesopotamian-temple-ur', 'ur-iii-reordered-city-world', 'ur-iii-building-order']]
  ]);
  for (const [navigationOptionId, [ownerSceneId, targetCardId, targetSceneId]] of expected) {
    const option = data.navigationOptions.find(item => item.id === navigationOptionId);
    const placement = data.navigationPlacements.find(item => item.navigationOptionId === navigationOptionId);
    assert.deepEqual(option.target, { cardId: targetCardId, sceneId: targetSceneId });
    assert.equal(option.basis.structuralEdgeId, 'edge-ur-iii-mesopotamian-temple');
    assert.deepEqual(placement.owner, { kind: 'scene', sceneId: ownerSceneId });
    assert.equal(placement.slot, 'inline');
  }
});

test('Sumer and its Mesopotamian expansion are authored in one module with the approved stories and Events', () => {
  assert.deepEqual(
    mesopotamia.entities.map(entity => entity.id),
    ['sumer', 'uruk', 'mesopotamia-region', 'mesopotamian-temple', 'cuneiform', 'akkadian-empire', 'epic-of-gilgamesh', 'ur-iii-kingdom', 'old-babylonian-kingdom', 'hammurabi-code', 'tower-of-babel-tradition']
  );
  assert.deepEqual(
    mesopotamia.cards.map(card => card.id),
    ['sumer-measuring-land-time', 'sumer-uruk-city', 'mesopotamia-cities-outlast-dynasties', 'mesopotamian-temple-overview', 'cuneiform-overview', 'akkadian-empire-overview', 'gilgamesh-mortality', 'ur-iii-reordered-city-world', 'old-babylonian-rise-and-fragmentation', 'hammurabi-code-justice', 'tower-of-babel-story-and-etemenanki']
  );
  assert.deepEqual(mesopotamia.cards.map(card => card.sceneIds.length), [5, 4, 6, 4, 6, 4, 9, 4, 5, 6, 5]);
  assert.ok(mesopotamia.events.length > 6);
  assert.ok(mesopotamia.events.every(event => ['historicalEvent', 'historicalProcess', 'textualTradition', 'traditionalNarrative'].includes(event.kind)));
  assert.ok(mesopotamia.cards.every(card => !('eventIds' in card)));
  assert.ok(mesopotamia.scenes.every(scene => Array.isArray(scene.eventIds) && scene.eventIds.length > 0));
  assert.deepEqual(queries.getEventsForCard('ur-iii-reordered-city-world').map(event => event.id), ['event-ur-iii-formation', 'event-ur-iii-fragmentation']);
  assert.deepEqual(queries.getEventsForCard('old-babylonian-rise-and-fragmentation').map(event => event.id), ['event-old-babylonian-city-kingdoms-emerge', 'event-hammurabi-conquests', 'event-hammurabi-code-stele', 'event-old-babylonian-fragmentation']);
  assert.deepEqual(queries.getEventsForCard('hammurabi-code-justice').map(event => event.id), ['event-hammurabi-code-stele']);
  assert.deepEqual(queries.getEventsForCard('tower-of-babel-story-and-etemenanki').map(event => event.id), ['event-tower-babel-textual-tradition-forms', 'event-etemenanki-rebuilding']);
  assert.ok(mesopotamia.scenes.every(scene => scene.sourceIds.length > 0));
  assert.equal(mesopotamia.assets.length, 40);
  for (const card of mesopotamia.cards) {
    assert.equal(data.cards.find(item => item.id === card.id), card);
  }

  assert.equal(fs.existsSync(path.resolve(__dirname, '../..', 'data/sumer.js')), false);
  const atlasSource = fs.readFileSync(path.resolve(__dirname, '../..', 'data/atlas-data.js'), 'utf8');
  assert.doesNotMatch(atlasSource, /id:\s*['"](?:sumer|mesopotamian-temple|cuneiform|akkadian-empire)(?:-|['"])/);
});

test('each content module keeps all of its image assets in its own directory', () => {
  const assetRoot = 'assets/images/mesopotamia/';
  assert.ok(mesopotamia.assets.length > 0);
  assert.ok(mesopotamia.assets.every(asset => asset.src.startsWith(assetRoot)));
  for (const asset of mesopotamia.assets) {
    assert.equal(fs.existsSync(path.resolve(__dirname, '../..', asset.src)), true, asset.src);
  }
});

test('the Mesopotamian regional story links its six stages and preserves the approved reciprocal placements', () => {
  const card = data.cards.find(item => item.id === 'mesopotamia-cities-outlast-dynasties');
  const entity = data.entities.find(item => item.id === 'mesopotamia-region');
  const scenes = card.sceneIds.map(sceneId => data.scenes.find(scene => scene.id === sceneId));
  assert.equal(entity.type, 'GeographicFeature');
  assert.equal(card.title, '两河流域的城市比王朝更长久');
  assert.deepEqual(scenes.map(scene => scene.title), [
    '许多城市在两条河之间出现',
    '阿卡德把许多城市纳入帝国',
    '乌尔用泥板重新组织城市世界',
    '巴比伦从小城变成新的中心',
    '巴比伦重新写信，亚述在北方成长',
    '两河流域没有随宫殿一起熄灭'
  ]);
  assert.deepEqual(scenes.map(scene => scene.presentation.kind), [
    'mapAndText',
    'imageAndText',
    'imageAndText',
    'imageAndText',
    'imageAndText',
    'mapAndText'
  ]);
  assert.deepEqual(scenes.slice(1, 5).map(scene => scene.presentation.assetId), [
    'asset-akkadian-naram-sin-victory-stele',
    'asset-mesopotamian-temple-ur-ziggurat',
    'asset-hammurabi-code-stele',
    'asset-kassite-kurigalzu-kudurru'
  ]);
  for (const scene of scenes) {
    assert.ok(scene.contentBlocks.every(block => block.sourceIds.length > 0), scene.id);
    if (scene.presentation.kind === 'imageAndText') {
      const asset = data.assets.find(item => item.id === scene.presentation.assetId);
      assert.ok(asset, scene.presentation.assetId);
      assert.ok(scene.sourceIds.some(sourceId => asset.sourceIds.includes(sourceId)), scene.id);
    } else {
      assert.ok(data.mapStates.some(mapState => mapState.id === scene.presentation.map.mapStateId), scene.id);
      assert.match(scene.presentation.map.caption, /圆点.*文字/s, scene.id);
    }
  }

  const sceneOnePlacements = data.navigationPlacements.filter(placement =>
    placement.owner.kind === 'scene' && placement.owner.sceneId === scenes[0].id
  );
  assert.deepEqual(sceneOnePlacements.map(placement => placement.navigationOptionId), [
    'nav-mesopotamia-uruk',
    'nav-mesopotamia-sumer'
  ]);
  const finalPlacements = data.navigationPlacements.filter(placement =>
    placement.owner.kind === 'scene' && placement.owner.sceneId === scenes.at(-1).id
  );
  assert.deepEqual(finalPlacements.map(placement => placement.navigationOptionId), [
    'nav-mesopotamia-collapse',
    'nav-mesopotamia-assyria'
  ]);
  const regionalClosingPlacements = data.navigationPlacements.filter(placement =>
    placement.owner.kind === 'card' && placement.owner.cardId === card.id
  );
  assert.deepEqual(regionalClosingPlacements.map(placement => placement.navigationOptionId), [
    'nav-mesopotamia-temple',
    'nav-mesopotamia-cuneiform'
  ]);

  for (const navigationOptionId of [
    'nav-uruk-mesopotamia',
    'nav-sumer-mesopotamia',
    'nav-akkadian-mesopotamia',
    'nav-ur-iii-mesopotamia',
    'nav-old-babylonian-mesopotamia',
    'nav-temple-mesopotamia',
    'nav-cuneiform-mesopotamia',
    'nav-collapse-mesopotamia',
    'nav-assyria-mesopotamia'
  ]) {
    const placement = data.navigationPlacements.find(item => item.navigationOptionId === navigationOptionId);
    assert.equal(placement.owner.kind, 'card', navigationOptionId);
    assert.equal(placement.slot, 'closing', navigationOptionId);
  }

  const amarnaPlacement = data.navigationPlacements.find(item => item.navigationOptionId === 'nav-amarna-mesopotamia');
  assert.deepEqual(amarnaPlacement.owner, { kind: 'scene', sceneId: 'amarna-diplomacy-routine' });
  assert.equal(amarnaPlacement.slot, 'inline');
});

test('each story with an approved Uruk relationship offers one reciprocal Uruk entrance', () => {
  const expected = new Map([
    ['mesopotamian-temple-overview', ['mesopotamian-temple-uruk']],
    ['akkadian-empire-overview', ['akkadian-empire-city-states']],
    ['gilgamesh-mortality', ['gilgamesh-immortality-lost']]
  ]);
  for (const [cardId, sceneIds] of expected) {
    const card = data.cards.find(item => item.id === cardId);
    const placements = data.navigationPlacements.filter(placement =>
      placement.owner.kind === 'scene' &&
      card.sceneIds.includes(placement.owner.sceneId) &&
      data.navigationOptions.find(option => option.id === placement.navigationOptionId)?.target.cardId === 'sumer-uruk-city'
    );
    assert.deepEqual(placements.map(placement => placement.owner.sceneId), sceneIds);
    assert.ok(placements.every(placement => placement.visible && placement.interactive));
  }
});

test('Mesopotamian stories expose every approved reciprocal navigation direction', () => {
  const directions = new Set();
  const sceneOwner = new Map(data.cards.flatMap(card => card.sceneIds.map(sceneId => [sceneId, card.id])));
  for (const placement of data.navigationPlacements.filter(item => item.visible && item.interactive)) {
    const sourceCardId = placement.owner.kind === 'card' ? placement.owner.cardId : sceneOwner.get(placement.owner.sceneId);
    const option = data.navigationOptions.find(item => item.id === placement.navigationOptionId);
    directions.add(`${sourceCardId}->${option.target.cardId}`);
  }
  for (const direction of [
    'sumer-measuring-land-time->sumer-uruk-city',
    'sumer-uruk-city->sumer-measuring-land-time',
    'sumer-measuring-land-time->cuneiform-overview',
    'cuneiform-overview->sumer-measuring-land-time',
    'sumer-measuring-land-time->akkadian-empire-overview',
    'akkadian-empire-overview->sumer-measuring-land-time',
    'sumer-measuring-land-time->ur-iii-reordered-city-world',
    'ur-iii-reordered-city-world->sumer-measuring-land-time',
    'cuneiform-overview->gilgamesh-mortality',
    'gilgamesh-mortality->cuneiform-overview',
    'sumer-uruk-city->gilgamesh-mortality',
    'gilgamesh-mortality->sumer-uruk-city',
    'akkadian-empire-overview->ur-iii-reordered-city-world',
    'ur-iii-reordered-city-world->akkadian-empire-overview',
    'ur-iii-reordered-city-world->mesopotamian-temple-overview',
    'mesopotamian-temple-overview->ur-iii-reordered-city-world',
    'indus-civilization-network->akkadian-empire-overview',
    'akkadian-empire-overview->indus-civilization-network',
    'ur-iii-reordered-city-world->old-babylonian-rise-and-fragmentation',
    'old-babylonian-rise-and-fragmentation->ur-iii-reordered-city-world',
    'old-babylonian-rise-and-fragmentation->hammurabi-code-justice',
    'hammurabi-code-justice->old-babylonian-rise-and-fragmentation',
    'old-babylonian-rise-and-fragmentation->mesopotamian-temple-overview',
    'mesopotamian-temple-overview->old-babylonian-rise-and-fragmentation',
    'hammurabi-code-justice->cuneiform-overview',
    'cuneiform-overview->hammurabi-code-justice',
    'tower-of-babel-story-and-etemenanki->mesopotamian-temple-overview',
    'mesopotamian-temple-overview->tower-of-babel-story-and-etemenanki'
  ]) assert.equal(directions.has(direction), true, direction);
});

test('Gilgamesh keeps its approved illustrations while Ur III keeps its approved media', () => {
  const gilgamesh = data.cards.find(card => card.id === 'gilgamesh-mortality');
  assert.equal(data.entities.find(entity => entity.id === 'epic-of-gilgamesh').type, 'TextDocument');
  const gilgameshPresentations = gilgamesh.sceneIds.map(sceneId => data.scenes.find(scene => scene.id === sceneId).presentation);
  assert.deepEqual(
    gilgameshPresentations.map(item => item.kind),
    ['imageAndText', 'imageAndText', 'imageAndText', 'imageAndText', 'imageAndText', 'imageAndText', 'imageAndText', 'imageAndText', 'imageAndText']
  );
  assert.equal(gilgameshPresentations[0].assetId, 'asset-gilgamesh-old-babylonian-fragments');
  assert.equal(gilgameshPresentations[1].assetId, 'asset-gilgamesh-uruk-kingship');
  assert.equal(gilgameshPresentations[2].assetId, 'asset-gilgamesh-rivals-become-friends');
  assert.equal(gilgameshPresentations[3].assetId, 'asset-gilgamesh-cedar-forest');
  assert.equal(gilgameshPresentations[4].assetId, 'asset-gilgamesh-bull-of-heaven');
  assert.equal(gilgameshPresentations[5].assetId, 'asset-gilgamesh-enkidu-dies');
  assert.equal(gilgameshPresentations[6].assetId, 'asset-gilgamesh-worlds-end');
  assert.equal(gilgameshPresentations[7].assetId, 'asset-gilgamesh-flood-survivor');
  assert.equal(gilgameshPresentations[8].assetId, 'asset-gilgamesh-immortality-lost');
  const urIII = data.cards.find(card => card.id === 'ur-iii-reordered-city-world');
  const presentations = urIII.sceneIds.map(sceneId => data.scenes.find(scene => scene.id === sceneId).presentation);
  assert.deepEqual(presentations.map(item => item.kind), ['mapAndText', 'imageAndText', 'imageAndText', 'imageAndText']);
  assert.equal(presentations[0].map.mapStateId, 'map-ur-iii-southern-mesopotamia');
  assert.equal(presentations[1].assetId, 'asset-akkadian-fragmentation');
  assert.equal(presentations[2].assetId, 'asset-ur-iii-administrative-tablet');
  assert.equal(presentations[3].assetId, 'asset-ur-iii-lament-for-ur');
});

test('the approved Old Babylonian, Hammurabi Code, and Tower of Babel stories preserve their final prose and media rhythm', () => {
  const expected = new Map([
    ['old-babylonian-rise-and-fragmentation', [
      'old-babylonian-after-ur-iii',
      'old-babylonian-small-river-kingdom',
      'old-babylonian-hammurabi-conquests',
      'old-babylonian-orders-and-institutions',
      'old-babylonian-fragmentation'
    ]],
    ['hammurabi-code-justice', [
      'hammurabi-code-divine-justice',
      'hammurabi-code-final-judge',
      'hammurabi-code-equal-retaliation',
      'hammurabi-code-status-inequality',
      'hammurabi-code-property-welfare',
      'hammurabi-code-transmission-discovery'
    ]],
    ['tower-of-babel-story-and-etemenanki', [
      'tower-of-babel-builders-stay-together',
      'tower-of-babel-languages-stop-work',
      'tower-of-babel-real-etemenanki',
      'tower-of-babel-evidence-and-reconstruction',
      'tower-of-babel-building-becomes-memory'
    ]]
  ]);

  for (const [cardId, sceneIds] of expected) {
    const card = data.cards.find(item => item.id === cardId);
    assert.deepEqual(card.sceneIds, sceneIds, cardId);
    assert.ok(sceneIds.every(sceneId => data.scenes.find(scene => scene.id === sceneId).presentation.kind !== 'textOnly'));
  }

  const sceneById = new Map(data.scenes.map(scene => [scene.id, scene]));
  assert.equal(sceneById.get('hammurabi-code-equal-retaliation').title, '以牙还牙，以眼还眼');
  assert.match(sceneById.get('hammurabi-code-equal-retaliation').contentBlocks[0].text, /打瞎.*打断.*打落/);
  assert.equal(sceneById.get('hammurabi-code-status-inequality').title, '同一种伤害，不同的代价');
  assert.match(sceneById.get('hammurabi-code-status-inequality').contentBlocks[0].text, /没有把所有人视为平等个体/);
  assert.match(sceneById.get('old-babylonian-orders-and-institutions').contentBlocks[0].text, /神庙.*石碑/);
  assert.match(sceneById.get('tower-of-babel-builders-stay-together').contentBlocks[0].text, /^《圣经·创世记》/);
  assert.doesNotMatch(sceneById.get('tower-of-babel-languages-stop-work').contentBlocks[0].text, /《圣经》|《创世记》/);
  assert.equal(sceneById.get('tower-of-babel-real-etemenanki').presentation.assetId, 'asset-mesopotamian-temple-old-babylonian');
});

test('active Card navigation is origin-neutral and never repeats a target inside one source Card', () => {
  const sceneOwner = new Map(data.cards.flatMap(card => card.sceneIds.map(sceneId => [sceneId, card.id])));
  const seen = new Set();
  for (const placement of data.navigationPlacements.filter(item => item.visible && item.interactive)) {
    const sourceCardId = placement.owner.kind === 'card'
      ? placement.owner.cardId
      : sceneOwner.get(placement.owner.sceneId);
    const option = data.navigationOptions.find(item => item.id === placement.navigationOptionId);
    const direction = `${sourceCardId}->${option.target.cardId}`;
    assert.equal(seen.has(direction), false, direction);
    seen.add(direction);
    assert.doesNotMatch(`${option.label} ${option.description}`, /返回|回到/);
  }
});

test('the temple ending uses Etemenanki evidence while the removed Akkadian rule Scene is absent', () => {
  const templeScene = data.scenes.find(item => item.id === 'mesopotamian-temple-old-babylonian');
  assert.match(templeScene.contentBlocks[0].text, /巴别塔.*不能直接画等号/);
  assert.ok(templeScene.sourceIds.includes('source-british-museum-etemenanki-tablet'));
  assert.equal(data.scenes.some(item => item.id === 'akkadian-empire-rule'), false);
  assert.equal(data.scenes.some(item => item.id === 'akkadian-empire-capital'), false);
  assert.equal(data.assets.some(item => item.id === 'asset-akkadian-rule'), false);
  assert.equal(data.assets.some(item => item.id === 'asset-akkadian-capital-unknown'), false);
});

test('the three approved temple Scenes use their dedicated temple media', () => {
  const expectedAssets = new Map([
    ['sumer-uruk-public-center', 'asset-sumer-uruk-public-center'],
    ['mesopotamian-temple-uruk', 'asset-mesopotamian-temple-uruk-eanna-plan'],
    ['mesopotamian-temple-old-babylonian', 'asset-mesopotamian-temple-old-babylonian']
  ]);

  for (const [sceneId, assetId] of expectedAssets) {
    const scene = data.scenes.find(item => item.id === sceneId);
    assert.equal(scene.presentation.kind, 'imageAndText', sceneId);
    assert.equal(scene.presentation.assetId, assetId, sceneId);
    assert.ok(scene.sourceIds.some(sourceId => data.assets.find(asset => asset.id === assetId).sourceIds.includes(sourceId)), sceneId);
  }
});

test('the approved Gilgamesh Scene 1 artifact and Scene 2 through 9 illustrations appear in the left media column', () => {
  const expectedAssets = new Map([
    ['gilgamesh-many-tablets', 'asset-gilgamesh-old-babylonian-fragments'],
    ['gilgamesh-enkidu-enters-uruk', 'asset-gilgamesh-uruk-kingship'],
    ['gilgamesh-rivals-become-friends', 'asset-gilgamesh-rivals-become-friends'],
    ['gilgamesh-cedar-forest', 'asset-gilgamesh-cedar-forest'],
    ['gilgamesh-bull-of-heaven', 'asset-gilgamesh-bull-of-heaven'],
    ['gilgamesh-enkidu-dies', 'asset-gilgamesh-enkidu-dies'],
    ['gilgamesh-worlds-end', 'asset-gilgamesh-worlds-end'],
    ['gilgamesh-flood-survivor', 'asset-gilgamesh-flood-survivor'],
    ['gilgamesh-immortality-lost', 'asset-gilgamesh-immortality-lost']
  ]);

  for (const [sceneId, assetId] of expectedAssets) {
    const scene = data.scenes.find(item => item.id === sceneId);
    const asset = data.assets.find(item => item.id === assetId);
    assert.equal(scene.presentation.kind, 'imageAndText', sceneId);
    assert.equal(scene.presentation.assetId, assetId, sceneId);
    assert.ok(asset.src.startsWith('assets/images/mesopotamia/'), assetId);
    assert.ok(scene.sourceIds.some(sourceId => asset.sourceIds.includes(sourceId)), sceneId);
  }
});

test('every Sumer Scene carries provenance and the opening map uses a sourced site point', () => {
  const card = data.cards.find(item => item.id === 'sumer-measuring-land-time');
  const scenes = card.sceneIds.map(sceneId => data.scenes.find(scene => scene.id === sceneId));
  assert.equal(scenes.length, 5);
  assert.ok(scenes.every(scene => Array.isArray(scene.sourceIds) && scene.sourceIds.length > 0));
  assert.equal(scenes[0].presentation.kind, 'mapAndText');
  assert.match(scenes[0].presentation.map.caption, /棕色圆点与文字共同标出乌鲁克遗址/);
  assert.deepEqual(scenes.map(scene => scene.presentation.kind), ['mapAndText', 'imageAndText', 'imageAndText', 'imageAndText', 'textOnly']);
  assert.deepEqual(
    scenes.slice(1, 4).map(scene => scene.presentation.assetId),
    [
      'asset-sumer-ushumgal-stele',
      'asset-sumer-uruk-proto-cuneiform-tablet',
      'asset-sumer-balanced-account-dugga'
    ]
  );
  const geometry = data.geometries.find(item => item.id === 'geometry-uruk-site');
  assert.equal(geometry.geometry.type, 'Point');
  assert.equal(geometry.approximate, false);
  assert.ok(geometry.sourceIds.includes('source-unesco-uruk-location'));
});

test('every Mesopotamian map Scene pairs graphic marks with visible text labels', () => {
  const expectedScenes = [
    'sumer-water-network',
    'sumer-uruk-gathering',
    'mesopotamia-many-cities-between-rivers',
    'mesopotamia-cities-do-not-go-dark',
    'mesopotamian-temple-eridu',
    'akkadian-empire-city-states',
    'ur-iii-rises-after-akkad',
    'old-babylonian-after-ur-iii',
    'old-babylonian-small-river-kingdom',
    'old-babylonian-hammurabi-conquests',
    'old-babylonian-fragmentation'
  ];
  const mapScenes = mesopotamia.scenes.filter(scene => scene.presentation.kind === 'mapAndText');
  assert.deepEqual(mapScenes.map(scene => scene.id), expectedScenes);
  for (const scene of mapScenes) {
    assert.ok(scene.presentation.map.layers.length > 0, scene.id);
    assert.match(scene.presentation.map.caption, /圆点|色块/, scene.id);
    assert.match(scene.presentation.map.caption, /文字/, scene.id);
    for (const layer of scene.presentation.map.layers) {
      const annotation = mesopotamia.mapAnnotations.find(item => item.id === layer.annotationId);
      assert.ok(annotation?.label, `${scene.id}:${layer.annotationId}`);
      assert.equal(annotation.anchor.kind, 'geo', annotation.id);
    }
  }
});

test('Uruk is a four-Scene SettlementSite story with the Warka Vase procession detail', () => {
  const entity = data.entities.find(item => item.id === 'uruk');
  const card = data.cards.find(item => item.id === 'sumer-uruk-city');
  const scenes = card.sceneIds.map(sceneId => data.scenes.find(scene => scene.id === sceneId));
  assert.equal(entity.type, 'SettlementSite');
  assert.deepEqual(scenes.map(scene => scene.id), [
    'sumer-uruk-gathering',
    'sumer-uruk-feeding',
    'sumer-uruk-public-center',
    'sumer-uruk-strangers'
  ]);
  assert.equal(scenes.at(-1).presentation.assetId, 'asset-sumer-uruk-warka-vase');
  assert.equal(data.assets.find(item => item.id === 'asset-sumer-uruk-warka-vase').title, '乌鲁克瓶上的搬运队列');
});

test('public content uses curated ClaimBlock kinds and claim-level citations', () => {
  const kinds = new Set();
  for (const scene of data.scenes) {
    for (const block of scene.contentBlocks) {
      kinds.add(block.kind);
      if (block.kind !== 'narrativeTransition') {
        assert.ok(Array.isArray(block.sourceIds) && block.sourceIds.length > 0, block.id);
      }
    }
  }
  for (const required of [
    'geographyObservation',
    'historicalFact',
    'interpretation',
    'editorialSynthesis'
  ]) {
    assert.ok(kinds.has(required), required);
  }
  assert.equal(kinds.has('limitation'), false, 'internal limitations must not be public Scene blocks');
  assert.ok(data.scenes.every(scene => scene.contentBlocks.every(block => block.kind !== 'paragraph')));
});

test('editorial review remains separate from public Scene content', () => {
  const publicIds = new Set(data.scenes.flatMap(scene => scene.contentBlocks.map(block => block.id)));
  for (const owner of [...data.cards, ...data.events]) {
    for (const bucket of ['limitations', 'counterexamples', 'uncertainties', 'alternativeExplanations']) {
      for (const block of owner.editorialReview[bucket]) {
        assert.equal(publicIds.has(block.id), false, block.id);
      }
    }
  }
  assert.ok(data.cards.some(card => card.editorialReview.limitations.length > 0));
});

test('assets are local, relative, and present in the project', () => {
  for (const asset of data.assets) {
    assert.equal(path.isAbsolute(asset.src), false);
    assert.equal(/^[a-z][a-z0-9+.-]*:/i.test(asset.src), false);
    assert.equal(fs.existsSync(path.resolve(__dirname, '../..', asset.src)), true, asset.src);
  }
  assert.deepEqual(
    data.assets.map(asset => asset.id),
    [
      ...mesopotamia.assets.map(asset => asset.id),
      ...ancientEgypt.assets.map(asset => asset.id),
      ...ancientIndia.assets.map(asset => asset.id),
      ...ancientChina.assets.map(asset => asset.id),
      ...lateBronzeAge.assets.map(asset => asset.id),
      ...aegean.assets.map(asset => asset.id),
      ...ironAgeNearEast.assets.map(asset => asset.id)
    ]
  );
  assert.equal(data.assets.every(asset => asset.type === 'image'), true);
  assert.ok(data.assets.every(asset => !asset.src.endsWith('.svg')));
  assert.ok(mesopotamia.assets.every(asset => /\.(?:jpg|png)$/.test(asset.src)));
  const approvedSchematics = new Set([
    'asset-mesopotamian-temple-uruk-eanna-plan',
    'asset-mesopotamian-temple-old-babylonian',
    'asset-egypt-hieroglyph-alphabet-chart'
  ]);
  for (const asset of data.assets) {
    const describedAsSchematic = /示意图|复原图|历史重建/.test(`${asset.title} ${asset.alt}`);
    assert.equal(describedAsSchematic, approvedSchematics.has(asset.id), asset.id);
  }
  assert.ok(data.sources.some(source => source.id === 'source-natural-earth'));
  assert.ok(data.geometries.some(geometry => geometry.sourceIds.includes('source-natural-earth')));
});

test('the same physical image is used by no more than two Scenes', () => {
  const assetById = new Map(data.assets.map(asset => [asset.id, asset]));
  const usesByImageHash = new Map();
  for (const scene of data.scenes) {
    if (scene.presentation.kind !== 'imageAndText') continue;
    const asset = assetById.get(scene.presentation.assetId);
    assert.ok(asset, scene.presentation.assetId);
    const bytes = fs.readFileSync(path.resolve(__dirname, '../..', asset.src));
    const imageHash = crypto.createHash('sha256').update(bytes).digest('hex');
    const uses = usesByImageHash.get(imageHash) || [];
    uses.push(`${scene.id} (${asset.src})`);
    usesByImageHash.set(imageHash, uses);
  }
  for (const uses of usesByImageHash.values()) {
    assert.ok(uses.length <= 2, uses.join(', '));
  }
});

test('Natural Earth provenance remains internal to map sources, not public Scene copy', () => {
  const publicText = data.scenes.flatMap(scene => scene.contentBlocks)
    .map(block => [block.title, block.text, block.caption, block.statement].filter(Boolean).join(' '))
    .join('\n');
  assert.doesNotMatch(publicText, /Natural Earth 本地矢量底图来源说明/);
});

test('map annotations use screen callouts or sourced geographic anchors, never guessed coordinates', () => {
  assert.ok(data.mapAnnotations.length > 0);
  for (const annotation of data.mapAnnotations) {
    if (annotation.anchorMeaning === 'screenCallout') {
      assert.deepEqual(annotation.anchor, { kind: 'screen' });
      continue;
    }
    assert.equal(annotation.anchor.kind, 'geo');
    assert.ok(annotation.sourceIds.length > 0, annotation.id);
    if (annotation.anchorMeaning === 'associatedWith') {
      assert.equal(annotation.approximate, true, annotation.id);
    } else {
      assert.equal(annotation.anchorMeaning, 'locatedAt');
      assert.equal(annotation.approximate, false, annotation.id);
    }
  }
});
