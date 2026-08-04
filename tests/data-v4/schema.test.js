const test = require('node:test');
const assert = require('node:assert/strict');

const data = require('../../data/atlas-data.js');
const queries = require('../../data/queries.js');

function clone() {
  return structuredClone(data);
}

test('active V4 dataset has the complete migrated collections and new first-class collections', () => {
  const result = queries.validateAtlasData(data);
  const liveCounts = Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => Array.isArray(value))
      .map(([name, value]) => [name, value.length])
  );
  assert.deepEqual(result, {
    valid: true,
    errors: [],
    counts: liveCounts
  });
});

test('V4 rejects other schema versions and unknown top-level collections', () => {
  const oldVersion = clone();
  oldVersion.schemaVersion = 3;
  assert.equal(queries.validateAtlasData(oldVersion).valid, false);
  assert.match(queries.validateAtlasData(oldVersion).errors.join('\n'), /schemaVersion.*must equal 4/);

  const futureVersion = clone();
  futureVersion.schemaVersion = 5;
  assert.equal(queries.validateAtlasData(futureVersion).valid, false);

  const unknown = clone();
  unknown.extraScenes = [];
  const result = queries.validateAtlasData(unknown);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /extraScenes.*unknown collection/);
});

test('V4 collections use globally unique top-level IDs', () => {
  const duplicate = clone();
  duplicate.events[0].id = duplicate.entities[0].id;
  const result = queries.validateAtlasData(duplicate);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /duplicates entities/);
});

test('Scene ownership and order exist only on Card.sceneIds', () => {
  for (const scene of data.scenes) {
    assert.equal('cardId' in scene, false);
    assert.equal('order' in scene, false);
    assert.equal('navigationIds' in scene, false);
    assert.equal('mapStateId' in scene, false);
    assert.equal('featuredEntityIds' in scene, false);
    const owners = data.cards.filter(card => card.sceneIds.includes(scene.id));
    assert.equal(owners.length, 1, scene.id);
  }
});

test('MapState owns reusable geometry only and Scene owns optional overlays', () => {
  for (const mapState of data.mapStates) {
    assert.equal('camera' in mapState, false);
    assert.ok(mapState.layers.every(layer => layer.kind === 'geometry'));
  }
  assert.ok(data.scenes.some(scene => scene.presentation.kind === 'textOnly'));
  assert.ok(data.scenes.some(scene => scene.presentation.map?.transition === 'cut'));
});
