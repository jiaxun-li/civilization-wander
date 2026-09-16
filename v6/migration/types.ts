import type {
  EntityMigrationDisposition,
  EventMigrationDisposition,
  RelationCandidate,
  RelationMigrationDisposition,
  ScenePhaseSignal
} from '../schema/migration.ts';
import type { ConceptLayerId } from '../schema/concept.ts';
import type { EntityType } from '../schema/entity-types.ts';

export type MigrationReviewStatus = 'pending' | 'accepted' | 'rejected' | 'needsResearch';

export interface V5TimeSpanSnapshot {
  readonly start?: number;
  readonly end?: number;
  readonly label?: string;
  readonly approximate?: boolean;
}

export interface MigrationCounts {
  readonly entities: number;
  readonly events: number;
  readonly scenes: number;
  readonly structuralEdges: number;
}

export type ScenePhaseSignalFlag =
  | 'multipleEvents'
  | 'multipleEntities'
  | 'cardPrimaryNotParticipant'
  | 'undatedNarrative'
  | 'timeConflict'
  | 'crossModuleReference';

export interface SceneEntityEvidenceAudit {
  readonly entityId: string;
  readonly eventIds: readonly string[];
  readonly eventTimeSpans: readonly {
    readonly eventId: string;
    readonly timeSpan: V5TimeSpanSnapshot;
  }[];
  readonly suggestedTimeSpan?: V5TimeSpanSnapshot;
}

export interface ScenePhaseSignalAudit {
  readonly scenePhaseSignalId: string;
  readonly sourceModule: string;
  readonly cardPrimaryEntityId: string;
  readonly entityEvidence: readonly SceneEntityEvidenceAudit[];
  readonly flags: readonly ScenePhaseSignalFlag[];
}

export interface ScenePhaseSignalLedger {
  readonly ledgerVersion: 1;
  readonly sourceModule: string;
  readonly scenePhaseSignals: readonly ScenePhaseSignal[];
  readonly audit: readonly ScenePhaseSignalAudit[];
}

export interface RelationCandidateAudit {
  readonly sourceModule: string;
  readonly originatingEntityId?: string;
  readonly originatingPhaseCandidateIds: readonly string[];
  readonly sourceEventIds: readonly string[];
  readonly sourceStructuralEdgeIds: readonly string[];
}

export interface AuditedRelationCandidate {
  readonly candidate: RelationCandidate;
  readonly audit: RelationCandidateAudit;
}

export interface RelationCandidateLedger {
  readonly ledgerVersion: 1;
  readonly runtimeCollection: false;
  readonly sourceModule: string;
  readonly candidates: readonly AuditedRelationCandidate[];
}

export interface EntityDecisionRecord {
  readonly entityId: string;
  readonly oldType: string;
  readonly recommendedDisposition: 'migrateEntity' | 'convertToEventSubject';
  readonly proposedEntityTypes: readonly EntityType[];
  readonly proposedConceptLayers: readonly ConceptLayerId[];
  readonly acceptedEntityType: EntityType | null;
  readonly acceptedConceptLayerId: ConceptLayerId | null;
  readonly acceptedPhaseIds: readonly string[];
  readonly acceptedDisposition: EntityMigrationDisposition | null;
  readonly status: MigrationReviewStatus;
}

export interface EventDecisionRecord {
  readonly eventId: string;
  readonly oldKind: string;
  readonly recommendedDisposition: 'retainEvent' | 'useAsPhaseEvidence';
  readonly acceptedDisposition: EventMigrationDisposition | null;
  readonly participantRolesResolved: boolean;
  readonly status: MigrationReviewStatus;
}

export interface EdgeDecisionRecord {
  readonly structuralEdgeId: string;
  readonly recommendedDisposition: 'reviewForTemporalRelation';
  readonly acceptedDisposition: RelationMigrationDisposition | null;
  readonly participantRolesResolved: boolean;
  readonly phaseBindingsResolved: boolean;
  readonly relationFamilyResolved: boolean;
  readonly relationTypeResolved: boolean;
  readonly status: MigrationReviewStatus;
}
