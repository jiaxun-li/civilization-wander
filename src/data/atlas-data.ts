import '../../data/mesopotamia.js';
import '../../data/ancient-egypt.js';
import '../../data/ancient-india.js';
import '../../data/ancient-china.js';
import '../../data/late-bronze-age.js';
import '../../data/aegean.js';
import '../../data/iron-age-near-east.js';

import type {
  Asset,
  AtlasData,
  CameraPreset,
  Card,
  Entity,
  HistoricalGeometry,
  MapAnnotation,
  MapState,
  NavigationOption,
  NavigationPlacement,
  Scene,
  StructuralEdge,
  StructureView
} from '../types/runtime.ts';

type UnknownRecord = Record<string, unknown>;

type ModuleCollectionMap = {
  sources: UnknownRecord;
  entities: Entity;
  events: UnknownRecord;
  structuralEdges: StructuralEdge;
  cards: Card;
  scenes: Scene;
  structureViews: StructureView;
  navigationOptions: NavigationOption;
  navigationPlacements: NavigationPlacement;
  cameraPresets: CameraPreset;
  mapStates: MapState;
  geometries: HistoricalGeometry;
  mapAnnotations: MapAnnotation;
  assets: Asset;
};

type CollectionName = keyof ModuleCollectionMap;
type ContentModule = {
  readonly [Collection in CollectionName]: readonly ModuleCollectionMap[Collection][];
};

type ModuleDefinition = {
  readonly name: string;
  readonly globalName: string;
  readonly missingDependencyError: string;
};

const MODULE_COLLECTIONS = [
  'sources', 'entities', 'events', 'structuralEdges', 'cards', 'scenes',
  'structureViews', 'navigationOptions', 'navigationPlacements',
  'cameraPresets', 'mapStates', 'geometries', 'mapAnnotations', 'assets'
] as const satisfies readonly CollectionName[];

const MODULE_COLLECTION_SET = new Set<string>(MODULE_COLLECTIONS);

// Keep dependency failures byte-for-byte compatible with the former aggregator;
// module interface failures still name the JavaScript content file that owns them.
const MODULE_DEFINITIONS: readonly ModuleDefinition[] = [
  {
    name: 'mesopotamia',
    globalName: 'ATLAS_V5_MESOPOTAMIA',
    missingDependencyError: 'data/mesopotamia.js must load before data/atlas-data.js'
  },
  {
    name: 'ancient-egypt',
    globalName: 'ATLAS_V5_ANCIENT_EGYPT',
    missingDependencyError: 'data/ancient-egypt.js must load before data/atlas-data.js'
  },
  {
    name: 'ancient-india',
    globalName: 'ATLAS_V5_ANCIENT_INDIA',
    missingDependencyError: 'data/ancient-india.js must load before data/atlas-data.js'
  },
  {
    name: 'ancient-china',
    globalName: 'ATLAS_V5_ANCIENT_CHINA',
    missingDependencyError: 'data/ancient-china.js must load before data/atlas-data.js'
  },
  {
    name: 'late-bronze-age',
    globalName: 'ATLAS_V5_LATE_BRONZE_AGE',
    missingDependencyError: 'data/late-bronze-age.js must load before data/atlas-data.js'
  },
  {
    name: 'aegean',
    globalName: 'ATLAS_V5_AEGEAN',
    missingDependencyError: 'data/aegean.js must load before data/atlas-data.js'
  },
  {
    name: 'iron-age-near-east',
    globalName: 'ATLAS_V5_IRON_AGE_NEAR_EAST',
    missingDependencyError: 'data/iron-age-near-east.js must load before data/atlas-data.js'
  }
];

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function assertContentModule(
  value: unknown,
  definition: ModuleDefinition
): asserts value is ContentModule {
  if (!isRecord(value)) throw new Error(definition.missingDependencyError);

  for (const collection of MODULE_COLLECTIONS) {
    if (!Object.prototype.hasOwnProperty.call(value, collection)) {
      throw new Error(`data/${definition.name}.js is missing required collection ${collection}`);
    }
    if (!Array.isArray(value[collection])) {
      throw new TypeError(`data/${definition.name}.js collection ${collection} must be an array`);
    }
  }

  for (const key of Object.keys(value)) {
    if (!MODULE_COLLECTION_SET.has(key)) {
      throw new Error(`data/${definition.name}.js exports unknown collection ${key}`);
    }
  }
}

export function createAtlasV5Data(runtimeValues: Readonly<Record<string, unknown>>): AtlasData {
  const modules = MODULE_DEFINITIONS.map(definition => {
    const moduleData = runtimeValues[definition.globalName];
    assertContentModule(moduleData, definition);
    return moduleData;
  });

  function combine<Collection extends CollectionName>(
    collection: Collection
  ): ModuleCollectionMap[Collection][] {
    const items: ModuleCollectionMap[Collection][] = [];
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

const runtimeValues = globalThis as unknown as Readonly<Record<string, unknown>>;

export const atlasData = createAtlasV5Data(runtimeValues);

(globalThis as unknown as { ATLAS_V5_DATA?: AtlasData }).ATLAS_V5_DATA = atlasData;
