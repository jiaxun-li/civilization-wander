import type {
  EntityId,
  EntityPhaseId,
  SourceIds,
  TemporalRelationId,
  TimeSpan
} from './common.ts';
import type { ConceptLayerId } from './concept.ts';
import type { EntityType } from './entity-types.ts';
import type { RegionalAssociation } from './region.ts';

export interface Entity {
  readonly id: EntityId;
  readonly type: EntityType;
  readonly name: string;
  readonly alternativeNames?: readonly string[];
  readonly canonicalSummary: string;
  readonly conceptLayerId: ConceptLayerId;
  readonly phaseIds: readonly EntityPhaseId[];
  readonly tags?: readonly string[];
  readonly sourceIds: SourceIds;
}

export interface EntityPhase {
  readonly id: EntityPhaseId;
  readonly entityId: EntityId;
  readonly title?: string;
  readonly timeSpan: TimeSpan;
  readonly regions: readonly RegionalAssociation[];
  readonly relationIds: readonly TemporalRelationId[];
  readonly sourceIds: SourceIds;
}
