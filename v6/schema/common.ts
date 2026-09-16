export type SourceId = string;
export type EntityId = string;
export type EntityPhaseId = string;
export type EventId = string;
export type TemporalRelationId = string;
export type RegionId = string;
export type GeometryId = string;
export type CardId = string;
export type SceneId = string;
export type ClaimBlockId = string;
export type RelationCandidateId = string;
export type ScenePhaseSignalId = string;

export type SourceIds = readonly SourceId[];

export interface TimeSpan {
  readonly start?: number;
  readonly end?: number;
  readonly label: string;
  readonly approximate?: boolean;
}

export interface Source {
  readonly id: SourceId;
  readonly title: string;
  readonly author?: string;
  readonly year?: number;
  readonly publisher?: string;
  readonly url?: string;
}

export type KnowledgeSubject =
  | { readonly kind: 'entity'; readonly id: EntityId }
  | { readonly kind: 'event'; readonly id: EventId };
