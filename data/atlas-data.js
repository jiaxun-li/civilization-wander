(function exposeAtlasV5(root, factory) {
  const mesopotamiaData = root && root.ATLAS_V5_MESOPOTAMIA
    ? root.ATLAS_V5_MESOPOTAMIA
    : (typeof module === 'object' && module.exports ? require('./mesopotamia.js') : null);
  const ancientEgyptData = root && root.ATLAS_V5_ANCIENT_EGYPT
    ? root.ATLAS_V5_ANCIENT_EGYPT
    : (typeof module === 'object' && module.exports ? require('./ancient-egypt.js') : null);
  const ancientIndiaData = root && root.ATLAS_V5_ANCIENT_INDIA
    ? root.ATLAS_V5_ANCIENT_INDIA
    : (typeof module === 'object' && module.exports ? require('./ancient-india.js') : null);
  const ancientChinaData = root && root.ATLAS_V5_ANCIENT_CHINA
    ? root.ATLAS_V5_ANCIENT_CHINA
    : (typeof module === 'object' && module.exports ? require('./ancient-china.js') : null);
  const lateBronzeAgeData = root && root.ATLAS_V5_LATE_BRONZE_AGE
    ? root.ATLAS_V5_LATE_BRONZE_AGE
    : (typeof module === 'object' && module.exports ? require('./late-bronze-age.js') : null);
  const aegeanData = root && root.ATLAS_V5_AEGEAN
    ? root.ATLAS_V5_AEGEAN
    : (typeof module === 'object' && module.exports ? require('./aegean.js') : null);
  const ironAgeNearEastData = root && root.ATLAS_V5_IRON_AGE_NEAR_EAST
    ? root.ATLAS_V5_IRON_AGE_NEAR_EAST
    : (typeof module === 'object' && module.exports ? require('./iron-age-near-east.js') : null);
  const data = factory(mesopotamiaData, ancientEgyptData, ancientIndiaData, ancientChinaData, lateBronzeAgeData, aegeanData, ironAgeNearEastData);
  if (root) root.ATLAS_V5_DATA = data;
  if (typeof module === 'object' && module.exports) module.exports = data;
}(typeof window !== 'undefined' ? window : globalThis, function createAtlasV5Data(mesopotamiaData, ancientEgyptData, ancientIndiaData, ancientChinaData, lateBronzeAgeData, aegeanData, ironAgeNearEastData) {
  'use strict';

  if (!mesopotamiaData) throw new Error('data/mesopotamia.js must load before data/atlas-data.js');
  if (!ancientEgyptData) throw new Error('data/ancient-egypt.js must load before data/atlas-data.js');
  if (!ancientIndiaData) throw new Error('data/ancient-india.js must load before data/atlas-data.js');
  if (!ancientChinaData) throw new Error('data/ancient-china.js must load before data/atlas-data.js');
  if (!lateBronzeAgeData) throw new Error('data/late-bronze-age.js must load before data/atlas-data.js');
  if (!aegeanData) throw new Error('data/aegean.js must load before data/atlas-data.js');
  if (!ironAgeNearEastData) throw new Error('data/iron-age-near-east.js must load before data/atlas-data.js');

  const moduleCollections = [
    'sources', 'entities', 'events', 'structuralEdges', 'cards', 'scenes',
    'structureViews', 'navigationOptions', 'navigationPlacements',
    'cameraPresets', 'mapStates', 'geometries', 'mapAnnotations', 'assets'
  ];
  const modules = [
    ['mesopotamia', mesopotamiaData],
    ['ancient-egypt', ancientEgyptData],
    ['ancient-india', ancientIndiaData],
    ['ancient-china', ancientChinaData],
    ['late-bronze-age', lateBronzeAgeData],
    ['aegean', aegeanData],
    ['iron-age-near-east', ironAgeNearEastData]
  ];
  modules.forEach(([moduleName, moduleData]) => {
    const keys = Object.keys(moduleData);
    moduleCollections.forEach(collection => {
      if (!Object.prototype.hasOwnProperty.call(moduleData, collection)) {
        throw new Error(`data/${moduleName}.js is missing required collection ${collection}`);
      }
      if (!Array.isArray(moduleData[collection])) {
        throw new TypeError(`data/${moduleName}.js collection ${collection} must be an array`);
      }
    });
    keys.forEach(key => {
      if (!moduleCollections.includes(key)) {
        throw new Error(`data/${moduleName}.js exports unknown collection ${key}`);
      }
    });
  });
  const combine = collection => modules.reduce(
    (items, [, moduleData]) => items.concat(moduleData[collection]),
    []
  );

  const naturalEarthSource = {
    id: 'source-natural-earth',
    title: 'Natural Earth 1:50m Physical Vectors',
    author: 'Natural Earth',
    year: 2025,
    publisher: 'Natural Earth',
    url: 'https://www.naturalearthdata.com/downloads/50m-physical-vectors/'
  };

  return {
    schemaVersion: 5,
    entities: combine('entities'),
    events: combine('events'),
    structuralEdges: combine('structuralEdges'),
    cards: combine('cards'),
    scenes: combine('scenes'),
    structureViews: combine('structureViews'),
    navigationOptions: combine('navigationOptions'),
    navigationPlacements: combine('navigationPlacements'),
    cameraPresets: combine('cameraPresets'),
    mapStates: combine('mapStates'),
    geometries: combine('geometries'),
    mapAnnotations: combine('mapAnnotations'),
    assets: combine('assets'),
    sources: [naturalEarthSource].concat(combine('sources'))
  };
}));
