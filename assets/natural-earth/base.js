(function exposeNaturalEarthBase(root, factory) {
  const api = factory();
  const vector = root && root.ATLAS_WORLD_VECTOR;
  api.base = vector ? api.createNaturalEarthBase(vector) : null;
  if (root) root.ATLAS_NATURAL_EARTH = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function buildNaturalEarthAdapter() {
  'use strict';

  function pathBounds(pathData) {
    const numbers = String(pathData || '').match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi) || [];
    if (numbers.length < 2 || numbers.length % 2 !== 0) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let index = 0; index < numbers.length; index += 2) {
      const x = Number(numbers[index]);
      const y = Number(numbers[index + 1]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    return Object.freeze([minX, minY, maxX, maxY]);
  }

  function boundedPath(item) {
    return Object.freeze({ ...item, bounds: pathBounds(item.d) });
  }

  function splitPath(pathData) {
    return (String(pathData || '').match(/M[^M]*/g) || [])
      .filter(Boolean)
      .map(d => boundedPath({ d }));
  }

  function createNaturalEarthBase(vector) {
    if (!vector || !Number.isFinite(vector.size) || typeof vector.landPath !== 'string') {
      throw new TypeError('A generated local Natural Earth vector is required');
    }
    return Object.freeze({
      size: vector.size,
      landPath: vector.landPath,
      land: Object.freeze(splitPath(vector.landPath)),
      lakes: Object.freeze((vector.lakes || []).filter(item => item?.d).map(boundedPath)),
      rivers: Object.freeze(
        (vector.rivers || [])
          .filter(item => item?.d && (item.rank ?? 9) <= 6)
          .map(boundedPath)
      ),
      source: 'data/world-physical.js',
      dataset: 'Natural Earth 1:50m physical vectors',
      license: 'Public domain',
      cached: true
    });
  }

  return {
    sourcePath: 'data/world-physical.js',
    dataset: 'Natural Earth 1:50m physical vectors',
    pathBounds,
    splitPath,
    createNaturalEarthBase
  };
}));
