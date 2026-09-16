import type {
  ClaimBlockId,
  EntityId,
  EntityPhaseId,
  EventId,
  SourceIds,
  TimeSpan
} from './common.ts';
import type { ConceptLayerId } from './concept.ts';
import type { RegionalAssociation } from './region.ts';

export const EVENT_KINDS = [
  'historicalEvent',
  'historicalProcess'
] as const;

export type EventKind = typeof EVENT_KINDS[number];

export interface EventParticipant {
  readonly entityId: EntityId;
  readonly phaseId?: EntityPhaseId;
  readonly role: string;
  readonly description?: string;
  readonly sourceIds: SourceIds;
}

/**
 * Structural evidence references retained by the V6 knowledge core. Public
 * Card prose and media are deliberately outside this migration boundary.
 */
export interface EventEvidenceReference {
  readonly v5ClaimBlockId: ClaimBlockId;
  readonly sourceIds: SourceIds;
}

/**
 * Structural pointers to V5 review claims. The public wording is intentionally
 * not copied into the structure-only migration product.
 */
export interface EditorialReviewReferences {
  readonly limitationClaimIds: readonly ClaimBlockId[];
  readonly counterexampleClaimIds: readonly ClaimBlockId[];
  readonly uncertaintyClaimIds: readonly ClaimBlockId[];
  readonly alternativeExplanationClaimIds: readonly ClaimBlockId[];
  readonly sourceIds: SourceIds;
}

export interface Event {
  readonly id: EventId;
  readonly kind: EventKind;
  /** The conceptual slice in which this event or process is primarily shown. */
  readonly conceptLayerId: ConceptLayerId;
  readonly title: string;
  readonly timeSpan: TimeSpan;
  readonly regions: readonly RegionalAssociation[];
  readonly participants: readonly EventParticipant[];
  readonly evidence: readonly EventEvidenceReference[];
  readonly editorialReview: EditorialReviewReferences;
  readonly sourceIds: SourceIds;
}
