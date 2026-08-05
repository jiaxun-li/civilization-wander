const test = require('node:test');
const assert = require('node:assert/strict');
const { atlasData, createAtlasV5Data } = require('../../src/data/atlas-data.ts');

const moduleGlobals = [
  'ATLAS_V5_MESOPOTAMIA',
  'ATLAS_V5_ANCIENT_EGYPT',
  'ATLAS_V5_ANCIENT_INDIA',
  'ATLAS_V5_ANCIENT_CHINA',
  'ATLAS_V5_LATE_BRONZE_AGE',
  'ATLAS_V5_AEGEAN',
  'ATLAS_V5_IRON_AGE_NEAR_EAST'
];

const runtimeValues = () => Object.fromEntries(
  moduleGlobals.map(globalName => [globalName, globalThis[globalName]])
);

test('typed aggregator preserves the exact fourteen-collection module boundary', () => {
  const rebuilt = createAtlasV5Data(runtimeValues());
  assert.deepEqual(rebuilt, atlasData);

  const missingModule = runtimeValues();
  delete missingModule.ATLAS_V5_MESOPOTAMIA;
  assert.throws(
    () => createAtlasV5Data(missingModule),
    /data\/mesopotamia\.ts must load before src\/data\/atlas-data\.ts/
  );

  const missingCollection = runtimeValues();
  const withoutScenes = { ...missingCollection.ATLAS_V5_MESOPOTAMIA };
  delete withoutScenes.scenes;
  missingCollection.ATLAS_V5_MESOPOTAMIA = withoutScenes;
  assert.throws(
    () => createAtlasV5Data(missingCollection),
    /data\/mesopotamia\.ts is missing required collection scenes/
  );

  const invalidCollection = runtimeValues();
  invalidCollection.ATLAS_V5_MESOPOTAMIA = {
    ...invalidCollection.ATLAS_V5_MESOPOTAMIA,
    scenes: null
  };
  assert.throws(
    () => createAtlasV5Data(invalidCollection),
    /data\/mesopotamia\.ts collection scenes must be an array/
  );

  const unknownCollection = runtimeValues();
  unknownCollection.ATLAS_V5_MESOPOTAMIA = {
    ...unknownCollection.ATLAS_V5_MESOPOTAMIA,
    rendererFallbacks: []
  };
  assert.throws(
    () => createAtlasV5Data(unknownCollection),
    /data\/mesopotamia\.ts exports unknown collection rendererFallbacks/
  );
});
