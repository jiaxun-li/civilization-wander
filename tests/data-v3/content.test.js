const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../../data/v3/atlas-data.js');

test('four migrated examples contain complete editorial cards', () => {
  for (const entityId of ['buddhism', 'shakyamuni', 'ashoka', 'maurya']) {
    const entity = data.entities.find(item => item.id === entityId);
    const card = data.cards.find(item => item.id === entity.defaultCardId);
    const scenes = card.sceneIds.map(id => data.scenes.find(scene => scene.id === id));
    assert.ok(card.question);
    assert.ok(card.introduction);
    assert.ok(scenes.length >= 4);
    assert.ok(scenes.every(scene => scene.mapStateId));
    assert.ok(scenes.every(scene => scene.sourceIds.length));
    assert.match(
      scenes.flatMap(scene => scene.contentBlocks).map(block => block.text || '').join(' '),
      /(不能|不会自动|不意味着|并不等于|不能.*化约)/
    );
  }
});

test('approximate teaching geometries are explicitly labelled', () => {
  for (const geometry of data.geometries.filter(item => item.approximate)) {
    assert.match(geometry.label, /近似|示意|教学/);
  }
});

test('every relationship fact lives in StructuralEdge', () => {
  const ashokaMaurya = data.structuralEdges.find(edge => edge.id === 'edge-ashoka-maurya');
  assert.equal(ashokaMaurya.family, 'role');
  assert.equal(ashokaMaurya.type, 'ruled');
  assert.equal(
    data.structuralEdges.some(edge => edge.family === 'lineage' && [edge.sourceId, edge.targetId].includes('ashoka')),
    false
  );
  assert.equal(data.structureViews.find(view => view.family === 'context').query.edgeFamilies.length > 1, true);
});

