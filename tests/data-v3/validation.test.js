const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../../data/v3/atlas-data.js');
const queryModule = require('../../data/v3/queries.js');

test('the complete V3 atlas passes schema and orphan validation', () => {
  const result = queryModule.createAtlasQueries(data).validateAtlasData();
  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  assert.equal(result.counts.entities, 7);
  assert.ok(result.counts.scenes >= 25);
});

test('all ids are globally unique and references stay in V3', () => {
  const collections = [
    data.entities,
    data.structuralEdges,
    data.cards,
    data.scenes,
    data.structureViews,
    data.navigationOptions,
    data.mapStates,
    data.geometries,
    data.assets,
    data.sources
  ];
  const ids = collections.flatMap(items => items.map(item => item.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(data.schemaVersion, 3);
  assert.equal(JSON.stringify(data).includes('ATLAS_ENTITY_NETWORK'), false);
  assert.equal(JSON.stringify(data).includes('cursorYear'), false);
});

test('validator rejects missing references and cross-card scenes', () => {
  const broken = structuredClone(data);
  broken.cards[0].sceneIds.push('missing-scene');
  broken.scenes[0].cardId = 'ashoka-overview';
  const result = queryModule.createAtlasQueries(broken).validateAtlasData();
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes('missing scenes id: missing-scene')));
  assert.ok(result.errors.some(error => error.includes('owned by ashoka-overview')));
});

test('validator rejects invalid lineage semantics', () => {
  const broken = structuredClone(data);
  broken.structuralEdges.push({
    id: 'bad-ashoka-lineage',
    family: 'lineage',
    type: 'child_of',
    sourceId: 'ashoka',
    targetId: 'maurya',
    label: { forward: '错误谱系' },
    canonicalSummary: '错误测试数据',
    sourceIds: ['source-thapar-ashoka']
  });
  const result = queryModule.createAtlasQueries(broken).validateAtlasData();
  assert.ok(result.errors.some(error => error.includes('Ashoka must not be a lineage child')));
});

test('validator rejects lineage recursion beyond one level', () => {
  const broken = structuredClone(data);
  broken.structureViews.find(view => view.family === 'lineage').depth = 2;
  const result = queryModule.createAtlasQueries(broken).validateAtlasData();
  assert.ok(result.errors.some(error => error.includes('depth must equal 1')));
});

