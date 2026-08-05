const test = require('node:test');
const assert = require('node:assert/strict');
const {
  atlasData,
  contentModuleDefinitions,
  createAtlasV5Data
} = require('../../src/data/atlas-data.ts');

const definitionsWithFirstModule = data => contentModuleDefinitions.map((definition, index) =>
  index === 0 ? { ...definition, data } : definition
);

test('typed aggregator preserves the exact fourteen-collection module boundary', () => {
  const rebuilt = createAtlasV5Data();
  assert.deepEqual(rebuilt, atlasData);

  const withoutScenes = { ...contentModuleDefinitions[0].data };
  delete withoutScenes.scenes;
  assert.throws(
    () => createAtlasV5Data(definitionsWithFirstModule(withoutScenes)),
    /data\/mesopotamia\.ts is missing required collection scenes/
  );

  const invalidCollection = {
    ...contentModuleDefinitions[0].data,
    scenes: null
  };
  assert.throws(
    () => createAtlasV5Data(definitionsWithFirstModule(invalidCollection)),
    /data\/mesopotamia\.ts collection scenes must be an array/
  );

  const unknownCollection = {
    ...contentModuleDefinitions[0].data,
    rendererFallbacks: []
  };
  assert.throws(
    () => createAtlasV5Data(definitionsWithFirstModule(unknownCollection)),
    /data\/mesopotamia\.ts exports unknown collection rendererFallbacks/
  );
});

test('content modules use named exports without publishing legacy globals', () => {
  for (const globalName of [
    'ATLAS_V5_MESOPOTAMIA',
    'ATLAS_V5_ANCIENT_EGYPT',
    'ATLAS_V5_ANCIENT_INDIA',
    'ATLAS_V5_ANCIENT_CHINA',
    'ATLAS_V5_LATE_BRONZE_AGE',
    'ATLAS_V5_AEGEAN',
    'ATLAS_V5_IRON_AGE_NEAR_EAST'
  ]) {
    assert.equal(Object.hasOwn(globalThis, globalName), false, globalName);
  }
});
