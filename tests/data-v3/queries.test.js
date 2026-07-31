const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../../data/v3/atlas-data.js');
const { createAtlasQueries } = require('../../data/v3/queries.js');

const queries = createAtlasQueries(data);

test('core objects and ordered scenes are independently queryable', () => {
  for (const entityId of ['buddhism', 'shakyamuni', 'ashoka', 'maurya']) {
    const entity = queries.getEntity(entityId);
    assert.ok(entity);
    assert.equal(queries.getTargetCardForEntity(entityId).id, entity.defaultCardId);
    const scenes = queries.getScenesForCard(entity.defaultCardId);
    assert.ok(scenes.length >= 4 && scenes.length <= 7);
    assert.deepEqual(scenes.map(scene => scene.order), scenes.map((_, index) => index + 1));
  }
});

test('StructuralEdge filtering preserves role and time semantics', () => {
  assert.equal(queries.getStructuralEdge('edge-ashoka-maurya').family, 'role');
  assert.equal(queries.getStructuralEdge('edge-ashoka-maurya').type, 'ruled');
  assert.deepEqual(
    queries.getEdgesForEntity('ashoka', { edgeFamilies: ['role'], timeFilter: { year: -250 } }).map(edge => edge.id).sort(),
    ['edge-ashoka-buddhism', 'edge-ashoka-maurya']
  );
  assert.deepEqual(
    queries.getEdgesForEntity('ashoka', { edgeFamilies: ['role'], timeFilter: { year: -300 } }),
    []
  );
});

test('direct lineage query returns one level and only language systems', () => {
  const children = queries.getDirectLineageChildren('indo-european');
  assert.deepEqual(children.map(item => item.entity.id), ['indo-iranian']);
  assert.ok(children.every(item => item.entity.type === 'languageSystem'));
  assert.deepEqual(queries.getDirectLineageChildren('indo-iranian'), []);
});

test('context and historical network views curate StructuralEdges', () => {
  const context = queries.getStructureViewItems('view-buddhism-context', 'buddhism-ashoka-period');
  assert.deepEqual(new Set(context.map(item => item.entity.id)), new Set(['shakyamuni', 'ashoka', 'maurya']));
  assert.ok(context.every(item => ['transmission', 'role', 'historicalNetwork'].includes(item.edge.family)));

  const network = queries.getStructureViewItems('view-buddhism-network', 'buddhism-open-network');
  assert.ok(network.some(item => item.edge.id === 'edge-shakyamuni-buddhism'));
  assert.ok(network.some(item => item.edge.id === 'edge-maurya-buddhism'));
});

test('Scene navigation uses one NavigationOption model', () => {
  const options = queries.getNavigationOptionsForScene('buddhism-ashoka-period');
  assert.deepEqual(options.map(option => option.id), ['nav-buddhism-ashoka']);
  assert.equal(queries.getCard(options[0].targetCardId).entityId, 'ashoka');
  assert.equal(options[0].presentation, 'mapNode');
});

test('queries never fall back to legacy data', () => {
  const isolated = createAtlasQueries({
    ...data,
    entities: data.entities.filter(entity => entity.id !== 'buddhism')
  });
  assert.equal(isolated.getEntity('buddhism'), null);
  assert.equal(isolated.getCard('buddhism-overview').entityId, 'buddhism');
  assert.equal(isolated.validateAtlasData().valid, false);
});
