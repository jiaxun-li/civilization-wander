import type { ConceptLayerId, RegionId } from '../../../v6/schema/index.ts';
import type { KnowledgeSpaceMark, ResolvedTimeSpan } from '../model/index.ts';

export type SliceSpec =
  | {
      readonly kind: 'region-time';
      readonly conceptLayerId: ConceptLayerId;
    }
  | {
      readonly kind: 'concept-time';
      readonly regionId: RegionId;
    }
  | {
      readonly kind: 'region-concept';
      readonly timeWindow: ResolvedTimeSpan;
    };

export function timeSpansIntersect(
  left: Pick<ResolvedTimeSpan, 'start' | 'end'>,
  right: Pick<ResolvedTimeSpan, 'start' | 'end'>
): boolean {
  return left.start <= right.end && right.start <= left.end;
}

/**
 * Shared semantic selector for all three future slice orientations. Only the
 * Region x Time slice receives screen coordinates in the first preview.
 */
export function markIntersectsSlice(mark: KnowledgeSpaceMark, spec: SliceSpec): boolean {
  switch (spec.kind) {
    case 'region-time':
      return mark.conceptLayerId === spec.conceptLayerId;
    case 'concept-time':
      return mark.regionSegments.some((segment) => segment.regionId === spec.regionId);
    case 'region-concept':
      return timeSpansIntersect(mark.timeSpan, spec.timeWindow);
    default: {
      const exhaustive: never = spec;
      return exhaustive;
    }
  }
}
