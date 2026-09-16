import type {
  CardId,
  EntityId,
  EntityPhaseId,
  EventId,
  KnowledgeSubject,
  RelationCandidateId,
  SceneId,
  ScenePhaseSignalId,
  SourceIds,
  TemporalRelationId,
  TimeSpan
} from './common.ts';
import type { EntityType } from './entity-types.ts';
import type { Event } from './event.ts';
import type { RelationFamily, RelationOrientation } from './relation.ts';

export type SceneEntitySignalBasis =
  | 'eventParticipant'
  | 'claimEntityReference'
  | 'ownerCardPrimaryEntity';

export interface SceneEntitySignal {
  readonly entityId: EntityId;
  readonly basis: SceneEntitySignalBasis;
  readonly referenceId: EventId | string;
}

/**
 * A migration-only observation extracted from a V5 Scene. It is evidence for
 * proposing phases, never a formal EntityPhase by itself.
 */
export interface ScenePhaseSignal {
  readonly id: ScenePhaseSignalId;
  readonly v5SceneId: SceneId;
  readonly v5OwnerCardId: CardId;
  readonly timeSpan: TimeSpan;
  readonly entitySignals: readonly SceneEntitySignal[];
  readonly eventIds: readonly EventId[];
  readonly sourceIds: SourceIds;
  readonly disposition: SceneMigrationDisposition;
}

export interface KnownRelationCandidateParticipant {
  readonly kind: 'knownSubject';
  readonly subject: KnowledgeSubject;
  readonly proposedPhaseId?: EntityPhaseId;
  readonly proposedRole?: string;
}

export interface UnresolvedRelationCandidateParticipant {
  readonly kind: 'unresolvedSubject';
  readonly label: string;
  readonly proposedEntityTypes?: readonly EntityType[];
  readonly notes: string;
}

export type RelationCandidateParticipant =
  | KnownRelationCandidateParticipant
  | UnresolvedRelationCandidateParticipant;

export const RELATION_CANDIDATE_REASONS = [
  'missingTarget',
  'ambiguousIdentity',
  'ambiguousTargetKind',
  'ambiguousRelationKind',
  'insufficientEvidence',
  'ordinaryExplanationOnly'
] as const;

export type RelationCandidateReason = typeof RELATION_CANDIDATE_REASONS[number];

/**
 * Non-runtime holding record for a relationship whose identity, endpoints,
 * role vocabulary, or classification is not yet stable enough for the atlas.
 */
export interface RelationCandidate {
  readonly id: RelationCandidateId;
  readonly originatingV5StructuralEdgeId?: string;
  readonly sourceSceneIds: readonly SceneId[];
  readonly proposedFamily?: RelationFamily;
  readonly proposedType?: string;
  readonly proposedOrientation?: RelationOrientation;
  readonly proposedTimeSpan?: TimeSpan;
  readonly participants: readonly RelationCandidateParticipant[];
  readonly summary: string;
  readonly reasons: readonly RelationCandidateReason[];
  readonly unresolvedQuestions: readonly string[];
  readonly sourceIds: SourceIds;
  readonly status: 'unresolved';
}

/**
 * A non-runtime review record for a broad V5 historical process whose stable
 * identity is not yet resolved as an EntityPhase, Event, or relationship.
 */
export interface PendingHistoricalProcessReview {
  readonly id: EventId;
  readonly status: 'pending';
  readonly reason: string;
  readonly candidate: Event;
}

export type EntityMigrationDisposition =
  | { readonly kind: 'migrated'; readonly entityId: EntityId }
  | { readonly kind: 'merged'; readonly intoEntityId: EntityId }
  | { readonly kind: 'split'; readonly intoEntityIds: readonly EntityId[] }
  | { readonly kind: 'convertedToEvent'; readonly eventId: EventId }
  | { readonly kind: 'deferred'; readonly reason: string };

export type EventMigrationDisposition =
  | { readonly kind: 'migratedAsEvent'; readonly eventId: EventId }
  | { readonly kind: 'convertedToEntity'; readonly entityId: EntityId }
  | {
      readonly kind: 'split';
      readonly eventIds: readonly EventId[];
      readonly entityIds: readonly EntityId[];
    }
  | { readonly kind: 'deferred'; readonly reason: string };

export type RelationMigrationDisposition =
  | { readonly kind: 'migrated'; readonly relationId: TemporalRelationId }
  | { readonly kind: 'split'; readonly relationIds: readonly TemporalRelationId[] }
  | { readonly kind: 'candidate'; readonly candidateId: RelationCandidateId }
  | { readonly kind: 'representedByEvent'; readonly eventId: EventId }
  | { readonly kind: 'retired'; readonly reason: string };

export type SceneMigrationDisposition =
  | { readonly kind: 'mapped'; readonly phaseIds: readonly EntityPhaseId[] }
  | { readonly kind: 'merged'; readonly phaseId: EntityPhaseId }
  | { readonly kind: 'eventOnly'; readonly eventIds: readonly EventId[] }
  | { readonly kind: 'narrativeOnly'; readonly reason: string }
  | { readonly kind: 'needsReview'; readonly questions: readonly string[] };

export interface V6MigrationWorkspace {
  readonly migrationVersion: 1;
  readonly targetSchemaVersion: 6;
  readonly scenePhaseSignals: readonly ScenePhaseSignal[];
  readonly relationCandidates: readonly RelationCandidate[];
  readonly entityDispositions: Readonly<Record<string, EntityMigrationDisposition>>;
  readonly eventDispositions: Readonly<Record<string, EventMigrationDisposition>>;
  readonly relationDispositions: Readonly<Record<string, RelationMigrationDisposition>>;
  readonly sceneDispositions: Readonly<Record<string, SceneMigrationDisposition>>;
}
