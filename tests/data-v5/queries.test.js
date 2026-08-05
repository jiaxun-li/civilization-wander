const test = require('node:test');
const assert = require('node:assert/strict');

const { atlasData: data } = require('../../src/data/atlas-data.ts');
const { queriesModule: queries } = require('../../src/data/queries.ts');

test('Card scene order and reverse ownership come from Card.sceneIds only', () => {
  const card = queries.getCard('sumer-measuring-land-time');
  assert.deepEqual(queries.getScenesForCard(card.id).map(scene => scene.id), card.sceneIds);
  assert.equal(queries.getOwnerCardForScene('sumer-land-measurement').id, card.id);
});

test('the Uruk SettlementSite resolves to its primary Card and approved Scene order', () => {
  const entity = queries.getEntity('uruk');
  const [card] = queries.getPrimaryCardsForEntity(entity.id);
  assert.equal(entity.type, 'SettlementSite');
  assert.equal(card.id, 'sumer-uruk-city');
  assert.deepEqual(queries.getScenesForCard(card.id).map(scene => scene.id), card.sceneIds);
});

test('the Sumer cultural tradition resolves to its own five-Scene Card', () => {
  const entity = queries.getEntity('sumer');
  const [card] = queries.getPrimaryCardsForEntity(entity.id);
  assert.equal(entity.type, 'culturalTradition');
  assert.equal(card.id, 'sumer-measuring-land-time');
  assert.equal(queries.getScenesForCard(card.id).length, 5);
});

test('Entity Card indexes distinguish primary and related Cards without storing an entry Card', () => {
  assert.deepEqual(
    queries.getCardsForEntity('sumer').map(card => card.id),
    ['sumer-measuring-land-time', 'sumer-uruk-city', 'mesopotamia-cities-outlast-dynasties', 'cuneiform-overview', 'akkadian-empire-overview', 'ur-iii-reordered-city-world']
  );
  assert.deepEqual(queries.getPrimaryCardsForEntity('sumer').map(card => card.id), ['sumer-measuring-land-time']);
  assert.deepEqual(
    queries.getRelatedCardsForEntity('sumer').map(card => card.id),
    ['sumer-uruk-city', 'mesopotamia-cities-outlast-dynasties', 'cuneiform-overview', 'akkadian-empire-overview', 'ur-iii-reordered-city-world']
  );
  assert.equal('defaultCardId' in queries.getEntity('sumer'), false);
});

test('Scene owns Event links and Card Events are derived in Scene order', () => {
  assert.deepEqual(
    queries.getEventsForScene('sumer-land-measurement').map(event => event.id),
    ['event-southern-mesopotamia-water-land-management']
  );
  assert.deepEqual(
    queries.getEventsForCard('sumer-uruk-city').map(event => event.id),
    ['event-uruk-urban-expansion']
  );
  assert.equal('eventIds' in queries.getCard('sumer-uruk-city'), false);
});

test('Events are independently queryable and typed endpoints filter by direction and time', () => {
  assert.equal(queries.getEvent('event-ur-iii-formation').title, '乌尔第三王朝形成');
  assert.deepEqual(
    queries.getEdgesForEndpoint('entity', 'sumer', {
      direction: 'outgoing',
      timeSpan: { start: -2200, end: -2000, label: '约公元前2200—前2000年' }
    }).map(edge => edge.id),
    ['edge-sumer-uruk', 'edge-sumer-cuneiform', 'edge-sumer-akkadian-empire', 'edge-sumer-ur-iii']
  );
});

test('placements are sorted locally and a Card exposes one placement per target Card', () => {
  assert.deepEqual(
    queries.getNavigationPlacementsForCard('sumer-uruk-city', 'closing').map(item => item.rank),
    [1, 2, 3]
  );
  const uses = data.navigationPlacements.filter(item => item.navigationOptionId === 'nav-sumer-akkadian-empire');
  assert.deepEqual(uses.map(item => item.slot), ['closing']);
});

test('Navigation target Scene is a stable section within the target Card', () => {
  const option = queries.getNavigationOption('nav-amarna-mesopotamia');
  assert.deepEqual(option.target, { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-babylon-writes-assyria-grows' });
  assert.ok(queries.getCard(option.target.cardId).sceneIds.includes(option.target.sceneId));
});

test('TimeSpan overlap handles BCE, CE, and one-sided ranges', () => {
  assert.equal(queries.timeSpanOverlaps({ start: -500, end: -400 }, { start: -450, end: -300 }), true);
  assert.equal(queries.timeSpanOverlaps({ start: -500, end: -400 }, { start: 1, end: 100 }), false);
  assert.equal(queries.timeSpanOverlaps({ start: -500 }, { end: -600 }), false);
  assert.equal(queries.timeSpanOverlaps({ start: -500 }, { end: -400 }), true);
  assert.equal(queries.timeSpanOverlaps({ start: 1786 }, { start: 1900, end: 2000 }), true);
});

test('StructureView returns live typed StructuralEdge results', () => {
  const fixtureData = structuredClone(data);
  fixtureData.structureViews.push({
    id: 'view-test-sumer-network',
    family: 'historicalNetwork',
    title: '测试内结构视图',
    query: {
      endpointKinds: ['entity'],
      edgeFamilies: ['historicalNetwork'],
      edgeTypes: ['city_within_cultural_tradition'],
      direction: 'outgoing'
    },
    depth: 1,
    maxVisible: 4,
    includeEntityIds: ['uruk'],
    display: 'cards'
  });
  const fixtureQueries = queries.createQueries(fixtureData);
  const items = fixtureQueries.getStructureViewItems(
    'view-test-sumer-network',
    { kind: 'entity', id: 'sumer' }
  );
  assert.ok(items.length > 0);
  assert.ok(items.every(edge => edge.family === 'historicalNetwork'));
  assert.ok(items.some(edge => edge.id === 'edge-sumer-uruk'));
});
