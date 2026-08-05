import type {
  Bounds,
  GeneratedNaturalEarthPath,
  GeneratedNaturalEarthVector,
  NaturalEarthAdapterModule,
  NaturalEarthData,
  NaturalEarthPath
} from '../types/runtime';

const sourcePath = 'src/data/world-physical.ts';
const dataset = 'Natural Earth 1:50m physical vectors';

export function pathBounds(pathData: unknown): Bounds | null {
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

function boundedPath(item: GeneratedNaturalEarthPath): NaturalEarthPath {
  return Object.freeze({ ...item, bounds: pathBounds(item.d) });
}

export function splitPath(pathData: unknown): readonly NaturalEarthPath[] {
  return Object.freeze(
    (String(pathData || '').match(/M[^M]*/g) || [])
      .filter(Boolean)
      .map(d => boundedPath({ d }))
  );
}

export function createNaturalEarthBase(vector: GeneratedNaturalEarthVector): NaturalEarthData {
  if (!vector || !Number.isFinite(vector.size) || typeof vector.landPath !== 'string') {
    throw new TypeError('A generated local Natural Earth vector is required');
  }
  return Object.freeze({
    size: vector.size,
    landPath: vector.landPath,
    land: splitPath(vector.landPath),
    lakes: Object.freeze((vector.lakes || []).filter(item => item?.d).map(boundedPath)),
    rivers: Object.freeze(
      (vector.rivers || [])
        .filter(item => item?.d && (item.rank ?? 9) <= 6)
        .map(boundedPath)
    ),
    source: sourcePath,
    dataset,
    license: 'Public domain',
    cached: true
  });
}

type NaturalEarthRuntimeRoot = typeof globalThis & {
  ATLAS_WORLD_VECTOR?: GeneratedNaturalEarthVector;
  ATLAS_NATURAL_EARTH?: NaturalEarthAdapterModule;
};

const root = (typeof window !== 'undefined' ? window : globalThis) as NaturalEarthRuntimeRoot;

export const naturalEarthModule: NaturalEarthAdapterModule = Object.freeze({
  base: root.ATLAS_WORLD_VECTOR ? createNaturalEarthBase(root.ATLAS_WORLD_VECTOR) : null,
  sourcePath,
  dataset,
  pathBounds,
  splitPath,
  createNaturalEarthBase
});

root.ATLAS_NATURAL_EARTH = naturalEarthModule;
