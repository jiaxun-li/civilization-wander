import type {
  EntityId,
  EntityPhaseId,
  EventId,
  SourceIds,
  TemporalRelationId,
  TimeSpan
} from './common.ts';

export const RELATION_FAMILIES = [
  'political',
  'military',
  'social',
  'economic',
  'technological',
  'linguistic',
  'literary',
  'artistic',
  'religious',
  'spatial',
  'historicalTransition'
] as const;

export type RelationFamily = typeof RELATION_FAMILIES[number];

export type RelationOrientation = 'directed' | 'symmetric' | 'multiParty';

export type RelationParticipant =
  | {
      readonly subject: { readonly kind: 'entity'; readonly id: EntityId };
      readonly phaseId: EntityPhaseId;
      readonly role: string;
      readonly viewLabel: string;
      readonly sourceIds: SourceIds;
    }
  | {
      readonly subject: { readonly kind: 'event'; readonly id: EventId };
      readonly role: string;
      readonly viewLabel: string;
      readonly sourceIds: SourceIds;
    };

export interface TemporalRelation {
  readonly id: TemporalRelationId;
  readonly family: RelationFamily;
  /** Specific relation vocabulary remains migration-reviewed rather than open-ended UI copy. */
  readonly type: string;
  readonly orientation: RelationOrientation;
  readonly participants: readonly RelationParticipant[];
  readonly timeSpan: TimeSpan;
  readonly summary: string;
  readonly qualifiers?: readonly string[];
  readonly sourceIds: SourceIds;
}
