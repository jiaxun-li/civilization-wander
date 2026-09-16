import type { Source } from './common.ts';
import type { Entity, EntityPhase } from './entity.ts';
import type { Event } from './event.ts';
import type { Region } from './region.ts';
import type { TemporalRelation } from './relation.ts';

/**
 * The isolated, structure-only V6 migration product. It deliberately excludes
 * Cards, Scenes, media, maps, and navigation until their later migration.
 */
export interface V6KnowledgeCore {
  readonly schemaVersion: 6;
  readonly sources: readonly Source[];
  readonly regions: readonly Region[];
  readonly entities: readonly Entity[];
  readonly entityPhases: readonly EntityPhase[];
  readonly events: readonly Event[];
  readonly temporalRelations: readonly TemporalRelation[];
}
