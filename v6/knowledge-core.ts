import type {
  Entity,
  EntityPhase,
  Event,
  Region,
  Source,
  TemporalRelation,
  V6KnowledgeCore
} from './schema/index.ts';
import { V6_SOURCES, REGIONS } from './catalogs/index.ts';
import { V6_MODULE_REGISTRY } from './module-registry.ts';

export interface V6KnowledgeModule {
  readonly entities: readonly Entity[];
  readonly entityPhases: readonly EntityPhase[];
  readonly events: readonly Event[];
  readonly temporalRelations: readonly TemporalRelation[];
}

export const EMPTY_V6_KNOWLEDGE_MODULE: V6KnowledgeModule = Object.freeze({
  entities: [],
  entityPhases: [],
  events: [],
  temporalRelations: []
});

const MODULE_KEYS = [
  'entities',
  'entityPhases',
  'events',
  'temporalRelations'
] as const satisfies readonly (keyof V6KnowledgeModule)[];

export function assertV6KnowledgeModule(
  candidate: unknown,
  label = 'V6 knowledge module'
): asserts candidate is V6KnowledgeModule {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    throw new TypeError(`${label} must be an object`);
  }
  const record = candidate as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!MODULE_KEYS.includes(key as typeof MODULE_KEYS[number])) {
      throw new Error(`${label} exports unknown collection ${key}`);
    }
  }
  for (const key of MODULE_KEYS) {
    if (!Object.prototype.hasOwnProperty.call(record, key)) {
      throw new Error(`${label} is missing required collection ${key}`);
    }
    if (!Array.isArray(record[key])) {
      throw new TypeError(`${label} collection ${key} must be an array`);
    }
  }
}

export function createV6KnowledgeCore(
  modules: readonly unknown[] = [],
  shared: {
    readonly sources?: readonly Source[];
    readonly regions?: readonly Region[];
  } = {}
): V6KnowledgeCore {
  const accepted = modules.map((module, index) => {
    assertV6KnowledgeModule(module, `V6 knowledge module[${index}]`);
    return module;
  });
  const combine = <Key extends keyof V6KnowledgeModule>(
    key: Key
  ): V6KnowledgeModule[Key][number][] => {
    const items: V6KnowledgeModule[Key][number][] = [];
    for (const module of accepted) {
      items.push(...module[key] as readonly V6KnowledgeModule[Key][number][]);
    }
    return items;
  };
  return {
    schemaVersion: 6,
    sources: [...(shared.sources ?? [])],
    regions: [...(shared.regions ?? [])],
    entities: combine('entities'),
    entityPhases: combine('entityPhases'),
    events: combine('events'),
    temporalRelations: combine('temporalRelations')
  };
}

export const emptyV6KnowledgeCore = createV6KnowledgeCore();

/**
 * Current integrated migration product. V5 runtime code does not import this
 * value; it exists solely for V6 validation and migration review.
 */
export const currentV6KnowledgeCore = createV6KnowledgeCore(
  V6_MODULE_REGISTRY.map(entry => entry.data),
  { sources: V6_SOURCES, regions: REGIONS }
);
