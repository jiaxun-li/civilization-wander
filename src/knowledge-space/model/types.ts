import type {
  ConceptLayerId,
  EntityId,
  EntityPhaseId,
  EntityType,
  EventId,
  EventKind,
  KnowledgeSubject,
  RegionId,
  RegionalRole,
  SourceId
} from '../../../v6/schema/index.ts';

/** V2 removes crayonField; rebuild derived marks from the unchanged V6 core. */
export const KNOWLEDGE_SPACE_PRESENTATION_VERSION = 2;

export type KnowledgeSpaceMarkKind =
  | 'block'
  | 'node'
  | 'trace'
  | 'crayonStrip';

export type PresenceMode = 'tracked' | 'pervasive';

export interface ResolvedTimeSpan {
  readonly start: number;
  readonly end: number;
  readonly label: string;
  readonly approximate: boolean;
}

export interface KnowledgeSpaceRegionSegment {
  readonly regionId: RegionId;
  readonly role: RegionalRole;
  readonly approximate: boolean;
  readonly sourceIds: readonly SourceId[];
  readonly presenceMode: PresenceMode;
}

/**
 * Renderer-neutral mark in the three-dimensional knowledge space. It must not
 * contain SVG paths, pixels, CSS colors, or WebGL objects.
 */
export interface KnowledgeSpaceMark {
  readonly id: string;
  readonly subjectRef: KnowledgeSubject;
  readonly phaseId?: EntityPhaseId;
  readonly label: string;
  /** Optional reviewed phase label; the stable Entity name remains primary. */
  readonly phaseLabel?: string;
  readonly conceptLayerId: ConceptLayerId;
  readonly timeSpan: ResolvedTimeSpan;
  readonly regionSegments: readonly KnowledgeSpaceRegionSegment[];
  readonly markKind: KnowledgeSpaceMarkKind;
  readonly certainty: {
    readonly timeApproximate: boolean;
    readonly regionApproximate: boolean;
  };
  readonly textureSeed: string;
  readonly semanticKind:
    | { readonly kind: 'entity'; readonly entityId: EntityId; readonly entityType: EntityType }
    | { readonly kind: 'event'; readonly eventId: EventId; readonly eventKind: EventKind };
}

export class KnowledgeSpaceModelError extends Error {
  readonly code: string;
  readonly objectId?: string;

  constructor(code: string, message: string, objectId?: string) {
    super(message);
    this.name = 'KnowledgeSpaceModelError';
    this.code = code;
    this.objectId = objectId;
  }
}
