import type {
  ConceptLayerId,
  Region,
  RegionalRole
} from '../../../v6/schema/index.ts';
import type {
  KnowledgeSpaceMark,
  KnowledgeSpaceMarkKind,
  ResolvedTimeSpan
} from '../model/index.ts';
import { KnowledgeSpaceModelError } from '../model/index.ts';
import { createRegionAxis, type RegionAxisGroup, type RegionAxisRow } from './region-axis.ts';
import { markIntersectsSlice, timeSpansIntersect } from './slice-spec.ts';

export interface RegionTimeSliceSpec {
  readonly kind: 'region-time';
  readonly conceptLayerId: ConceptLayerId;
  readonly timeWindow: ResolvedTimeSpan;
  readonly includeScaffolding?: boolean;
}

export interface ProjectedRegionTimeMark {
  readonly id: string;
  readonly markId: string;
  readonly sourceMark: KnowledgeSpaceMark;
  readonly rowId: string;
  readonly rowIndex: number;
  readonly regionId: string;
  readonly regionRole: RegionalRole;
  readonly markKind: KnowledgeSpaceMarkKind;
  readonly xStart: number;
  readonly xEnd: number;
  readonly anchorX: number;
  readonly clippedStart: boolean;
  readonly clippedEnd: boolean;
  readonly regionApproximate: boolean;
  readonly sortKey: string;
}

export interface RegionTimeProjection {
  readonly spec: RegionTimeSliceSpec;
  readonly axisGroups: readonly RegionAxisGroup[];
  readonly axisRows: readonly RegionAxisRow[];
  readonly marks: readonly ProjectedRegionTimeMark[];
}

function normalizeYear(year: number, window: ResolvedTimeSpan): number {
  const duration = window.end - window.start;
  if (duration === 0) return 0.5;
  return (year - window.start) / duration;
}

export function projectRegionTimeSlice(
  marks: readonly KnowledgeSpaceMark[],
  regions: readonly Region[],
  spec: RegionTimeSliceSpec
): RegionTimeProjection {
  if (
    !Number.isFinite(spec.timeWindow.start)
    || !Number.isFinite(spec.timeWindow.end)
    || spec.timeWindow.start > spec.timeWindow.end
  ) {
    throw new KnowledgeSpaceModelError(
      'INVALID_SLICE_TIME_WINDOW',
      'Region × Time slice needs a finite, ordered time window.'
    );
  }

  const visibleMarks = marks.filter((mark) => (
    markIntersectsSlice(mark, spec)
    && timeSpansIntersect(mark.timeSpan, spec.timeWindow)
  ));
  const activeRegionIds = new Set(
    visibleMarks.flatMap((mark) => mark.regionSegments.map((segment) => segment.regionId))
  );
  const axis = createRegionAxis(regions, activeRegionIds, {
    includeScaffolding: spec.includeScaffolding
  });
  const rowIndexById = new Map(axis.rows.map((row, index) => [row.id, index] as const));
  const projectedMarks: ProjectedRegionTimeMark[] = [];

  for (const mark of visibleMarks) {
    const visibleStart = Math.max(mark.timeSpan.start, spec.timeWindow.start);
    const visibleEnd = Math.min(mark.timeSpan.end, spec.timeWindow.end);
    for (const segment of mark.regionSegments) {
      const row = axis.rowByRegionId.get(segment.regionId);
      if (!row) {
        throw new KnowledgeSpaceModelError(
          'MISSING_REGION_AXIS_ROW',
          `Region "${segment.regionId}" has no row in the current axis.`,
          mark.id
        );
      }
      const rowIndex = rowIndexById.get(row.id)!;
      projectedMarks.push({
        id: `${mark.id}@${row.id}`,
        markId: mark.id,
        sourceMark: mark,
        rowId: row.id,
        rowIndex,
        regionId: segment.regionId,
        regionRole: segment.role,
        markKind: mark.markKind,
        xStart: normalizeYear(visibleStart, spec.timeWindow),
        xEnd: normalizeYear(visibleEnd, spec.timeWindow),
        anchorX: Math.min(1, Math.max(
          0,
          normalizeYear((mark.timeSpan.start + mark.timeSpan.end) / 2, spec.timeWindow)
        )),
        clippedStart: mark.timeSpan.start < spec.timeWindow.start,
        clippedEnd: mark.timeSpan.end > spec.timeWindow.end,
        regionApproximate: segment.approximate,
        sortKey: `${mark.subjectRef.kind}:${mark.subjectRef.id}:${mark.phaseId ?? ''}:${mark.id}`
      });
    }
  }

  projectedMarks.sort((left, right) => (
    left.rowIndex - right.rowIndex
    || left.xStart - right.xStart
    || left.sortKey.localeCompare(right.sortKey)
  ));

  return {
    spec,
    axisGroups: axis.groups,
    axisRows: axis.rows,
    marks: projectedMarks
  };
}
