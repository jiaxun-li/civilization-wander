import { mesopotamiaData } from '../../data/mesopotamia.ts';
import { ancientEgyptData } from '../../data/ancient-egypt.ts';
import { ancientIndiaData } from '../../data/ancient-india.ts';
import { ancientChinaData } from '../../data/ancient-china.ts';
import { lateBronzeAgeData } from '../../data/late-bronze-age.ts';
import { aegeanData } from '../../data/aegean.ts';
import { ironAgeNearEastData } from '../../data/iron-age-near-east.ts';

import type {
  AtlasData,
  ContentModule,
  ContentModuleCollectionMap
} from '../types/runtime.ts';

type UnknownRecord = Record<string, unknown>;

type CollectionName = keyof ContentModuleCollectionMap;

type ModuleDefinition = {
  readonly file: string;
  readonly data: unknown;
};

const MODULE_COLLECTIONS = [
  'sources', 'entities', 'events', 'structuralEdges', 'cards', 'scenes',
  'structureViews', 'navigationOptions', 'navigationPlacements',
  'cameraPresets', 'mapStates', 'geometries', 'mapAnnotations', 'assets'
] as const satisfies readonly CollectionName[];

const MODULE_COLLECTION_SET = new Set<string>(MODULE_COLLECTIONS);

// This is the single runtime aggregation order for formal content modules.
export const contentModuleDefinitions: readonly ModuleDefinition[] = [
  {
    file: 'data/mesopotamia.ts',
    data: mesopotamiaData
  },
  {
    file: 'data/ancient-egypt.ts',
    data: ancientEgyptData
  },
  {
    file: 'data/ancient-india.ts',
    data: ancientIndiaData
  },
  {
    file: 'data/ancient-china.ts',
    data: ancientChinaData
  },
  {
    file: 'data/late-bronze-age.ts',
    data: lateBronzeAgeData
  },
  {
    file: 'data/aegean.ts',
    data: aegeanData
  },
  {
    file: 'data/iron-age-near-east.ts',
    data: ironAgeNearEastData
  }
];

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertContentModule(
  value: unknown,
  definition: ModuleDefinition
): asserts value is ContentModule {
  if (!isRecord(value)) throw new TypeError(`${definition.file} must export a content module object`);

  for (const collection of MODULE_COLLECTIONS) {
    if (!Object.prototype.hasOwnProperty.call(value, collection)) {
      throw new Error(`${definition.file} is missing required collection ${collection}`);
    }
    if (!Array.isArray(value[collection])) {
      throw new TypeError(`${definition.file} collection ${collection} must be an array`);
    }
  }

  for (const key of Object.keys(value)) {
    if (!MODULE_COLLECTION_SET.has(key)) {
      throw new Error(`${definition.file} exports unknown collection ${key}`);
    }
  }
}

export function createAtlasV5Data(
  definitions: readonly ModuleDefinition[] = contentModuleDefinitions
): AtlasData {
  const modules = definitions.map(definition => {
    assertContentModule(definition.data, definition);
    return definition.data;
  });

  function combine<Collection extends CollectionName>(
    collection: Collection
  ): ContentModuleCollectionMap[Collection][number][] {
    const items: ContentModuleCollectionMap[Collection][number][] = [];
    for (const moduleData of modules) items.push(...moduleData[collection]);
    return items;
  }

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
    sources: [naturalEarthSource, ...combine('sources')]
  };
}

export const atlasData = createAtlasV5Data();
