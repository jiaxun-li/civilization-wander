(function exposeNaturalEarthBase(root, factory) {
  const api = factory();
  const vector = root && root.ATLAS_WORLD_VECTOR;
  api.base = vector ? api.createNaturalEarthBase(vector) : null;
  if (root) root.ATLAS_NATURAL_EARTH = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function buildNaturalEarthAdapter() {
  'use strict';

  function createNaturalEarthBase(vector) {
    if (!vector || !Number.isFinite(vector.size) || typeof vector.landPath !== 'string') {
      throw new TypeError('A generated local Natural Earth vector is required');
    }
    return Object.freeze({
      size: vector.size,
      landPath: vector.landPath,
      lakes: Object.freeze((vector.lakes || []).filter(item => item?.d).slice(0, 360)),
      rivers: Object.freeze((vector.rivers || []).filter(item => item?.d && (item.rank ?? 9) <= 6).slice(0, 220)),
      source: 'data/world-physical.js',
      dataset: 'Natural Earth 1:50m physical vectors',
      license: 'Public domain',
      cached: true
    });
  }

  return {
    sourcePath: 'data/world-physical.js',
    dataset: 'Natural Earth 1:50m physical vectors',
    createNaturalEarthBase
  };
}));
