import type { ProjectedRegionTimeMark } from '../projection/index.ts';
import { timeSpansAreContinuous } from './continuous-block-runs.ts';

export interface LocalTrackSegment {
  readonly start: number;
  readonly end: number;
  readonly laneIndex: number;
  readonly laneCount: number;
  /** Normalized position inside one Region row. */
  readonly laneTop: number;
  /** Normalized height inside one Region row. */
  readonly laneHeight: number;
}

export interface LaidOutRegionTimeMark extends ProjectedRegionTimeMark {
  readonly participatesInCollisionLayout: boolean;
  readonly trackSegments: readonly LocalTrackSegment[];
}

export interface LocalTrackLayoutOptions {
  /** Minimum normalized footprint used to detect visual collisions for nodes. */
  readonly minimumNodeWidth?: number;
  /** Reviewed rows whose overlapping political subjects keep fixed positions. */
  readonly stablePolityRegionIds?: readonly string[];
  readonly separateBands?: boolean;
}

interface CollisionItem {
  readonly mark: ProjectedRegionTimeMark;
  readonly members: readonly ProjectedRegionTimeMark[];
  readonly start: number;
  readonly end: number;
}

function collisionItems(marks: readonly ProjectedRegionTimeMark[], minimumNodeWidth: number): CollisionItem[] {
  const items: CollisionItem[] = [];
  const blocks = new Map<string, ProjectedRegionTimeMark[]>();
  for (const mark of marks) {
    if (mark.markKind !== 'block' && mark.markKind !== 'crayonStrip') {
      items.push({ mark, members: [mark], ...collisionSpan(mark, minimumNodeWidth) });
      continue;
    }
    const key = `${mark.sourceMark.subjectRef.kind}:${mark.sourceMark.subjectRef.id}`;
    const bucket = blocks.get(key) ?? [];
    bucket.push(mark);
    blocks.set(key, bucket);
  }
  for (const bucket of blocks.values()) {
    const sorted = [...bucket].sort((left, right) => left.xStart - right.xStart || left.xEnd - right.xEnd || left.id.localeCompare(right.id));
    let members: ProjectedRegionTimeMark[] = [];
    let timeEnd = -Infinity;
    const flush = () => {
      if (!members.length) return;
      items.push({
        mark: members[0]!, members,
        start: Math.min(...members.map(mark => collisionSpan(mark, minimumNodeWidth).start)),
        end: Math.max(...members.map(mark => collisionSpan(mark, minimumNodeWidth).end))
      });
      members = [];
      timeEnd = -Infinity;
    };
    for (const mark of sorted) {
      if (members.length && !timeSpansAreContinuous(timeEnd, mark.sourceMark.timeSpan.start)) flush();
      members.push(mark);
      timeEnd = Math.max(timeEnd, mark.sourceMark.timeSpan.end);
    }
    flush();
  }
  return items;
}

function collisionSpan(
  mark: ProjectedRegionTimeMark,
  minimumNodeWidth: number
): Pick<CollisionItem, 'start' | 'end'> {
  if (mark.markKind === 'node') {
    const halfWidth = minimumNodeWidth / 2;
    return {
      start: Math.max(0, mark.anchorX - halfWidth),
      end: Math.min(1, mark.anchorX + halfWidth)
    };
  }
  if (mark.xStart === mark.xEnd) {
    const halfWidth = minimumNodeWidth / 2;
    return {
      start: Math.max(0, mark.xStart - halfWidth),
      end: Math.min(1, mark.xEnd + halfWidth)
    };
  }
  return { start: mark.xStart, end: mark.xEnd };
}

function mergeAdjacentSegments(
  segments: readonly LocalTrackSegment[]
): readonly LocalTrackSegment[] {
  const merged: LocalTrackSegment[] = [];
  for (const segment of segments) {
    const previous = merged.at(-1);
    if (
      previous
      && previous.end === segment.start
      && previous.laneIndex === segment.laneIndex
      && previous.laneCount === segment.laneCount
    ) {
      merged[merged.length - 1] = { ...previous, end: segment.end };
    } else {
      merged.push(segment);
    }
  }
  return merged;
}

/**
 * Assigns subtracks only to solid marks and only during actual collision
 * intervals. Crayon strips and fields remain on the full row and may overlap.
 */
export function layoutRegionTimeMarks(
  marks: readonly ProjectedRegionTimeMark[],
  options: LocalTrackLayoutOptions = {}
): readonly LaidOutRegionTimeMark[] {
  const minimumNodeWidth = options.minimumNodeWidth ?? 0.018;
  if (!Number.isFinite(minimumNodeWidth) || minimumNodeWidth <= 0 || minimumNodeWidth > 1) {
    throw new Error('minimumNodeWidth must be greater than 0 and no greater than 1.');
  }

  const result = new Map<string, LaidOutRegionTimeMark>();
  const collisionKinds = new Set(['block', 'node', 'trace']);
  if (options.separateBands) collisionKinds.add('crayonStrip');
  const byRow = new Map<string, ProjectedRegionTimeMark[]>();

  for (const mark of marks) {
    if (!collisionKinds.has(mark.markKind)) {
      result.set(mark.id, {
        ...mark,
        participatesInCollisionLayout: false,
        trackSegments: [{
          start: mark.xStart,
          end: mark.xEnd,
          laneIndex: 0,
          laneCount: 1,
          laneTop: 0,
          laneHeight: 1
        }]
      });
      continue;
    }
    const rowMarks = byRow.get(mark.rowId) ?? [];
    rowMarks.push(mark);
    byRow.set(mark.rowId, rowMarks);
  }

  for (const rowMarks of byRow.values()) {
    if (rowMarks.every(mark => mark.sourceMark.conceptLayerId === 'languageAndKnowledge')) {
      const languages = rowMarks.filter(mark => mark.sourceMark.semanticKind.kind === 'entity'
        && mark.sourceMark.semanticKind.entityType === 'language');
      const languageLanes = new Map<string, number>();
      const laneEnds = [-Infinity, -Infinity];
      const preferredLanes = new Map<string, number>();
      for (const item of collisionItems(languages, minimumNodeWidth).sort((a, b) => a.start - b.start || a.mark.id.localeCompare(b.mark.id))) {
        const preferred = preferredLanes.get(item.mark.sourceMark.subjectRef.id);
        const lane = preferred !== undefined && laneEnds[preferred]! < item.start
          ? preferred : laneEnds.findIndex(end => end < item.start);
        if (lane < 0) throw new Error(`Language row exceeds two concurrent languages: ${item.mark.regionId}`);
        laneEnds[lane] = item.end;
        preferredLanes.set(item.mark.sourceMark.subjectRef.id, lane);
        for (const member of item.members) languageLanes.set(member.id, lane);
      }
      for (const mark of rowMarks) {
        const laneIndex = languageLanes.get(mark.id) ?? 2;
        result.set(mark.id, { ...mark, participatesInCollisionLayout: true, trackSegments: [{
          start: mark.xStart, end: mark.xEnd, laneIndex, laneCount: 3,
          laneTop: laneIndex / 3, laneHeight: 1 / 3
        }] });
      }
      continue;
    }
    // One continuous polity run is one collision participant, regardless of
    // how many overlapping or adjacent editorial Phases it contains.
    const items = collisionItems(rowMarks, minimumNodeWidth);
    if ((options.stablePolityRegionIds?.includes(rowMarks[0]!.regionId)
      && rowMarks.every(mark => mark.sourceMark.conceptLayerId === 'polityAndSociety'))
      || (options.separateBands && rowMarks.some(mark => mark.markKind === 'crayonStrip'))) {
      // Allocate each connected overlap group once. Longer local core subjects
      // get first choice; nonoverlapping subjects may reuse a lane. Empty space
      // after a neighbour ends preserves position, not a territorial percentage.
      const pending = [...items].sort((a, b) => a.start - b.start || a.end - b.end);
      while (pending.length) {
        const group = [pending.shift()!];
        let groupEnd = group[0]!.end;
        while (pending.length && pending[0]!.start < groupEnd) {
          const next = pending.shift()!;
          group.push(next);
          groupEnd = Math.max(groupEnd, next.end);
        }
        const languagePriority = (item: CollisionItem) => item.mark.sourceMark.semanticKind.kind === 'entity'
          && item.mark.sourceMark.semanticKind.entityType === 'language' ? 0 : 1;
        group.sort((a, b) => (rowMarks.every(mark => mark.sourceMark.conceptLayerId === 'languageAndKnowledge')
          ? languagePriority(a) - languagePriority(b) : 0) || Number(b.mark.regionRole === 'core') - Number(a.mark.regionRole === 'core')
          || (b.end - b.start) - (a.end - a.start) || a.mark.sortKey.localeCompare(b.mark.sortKey));
        const lanes: CollisionItem[][] = [];
        const assignments = new Map<CollisionItem, number>();
        for (const item of group) {
          let lane = lanes.findIndex(members => members.every(other => item.end <= other.start || item.start >= other.end));
          if (lane < 0) { lane = lanes.length; lanes.push([]); }
          lanes[lane]!.push(item);
          assignments.set(item, lane);
        }
        for (const item of group) {
          const laneIndex = assignments.get(item)!;
          const laneCount = lanes.length;
          const trackSegments = [{ start: item.start, end: item.end, laneIndex, laneCount, laneTop: laneIndex / laneCount, laneHeight: 1 / laneCount }];
          for (const member of item.members) result.set(member.id, { ...member, participatesInCollisionLayout: true, trackSegments });
        }
      }
      continue;
    }
    const boundaries = [...new Set(items.flatMap((item) => [item.start, item.end]))]
      .sort((left, right) => left - right);
    const segmentsByMark = new Map<string, LocalTrackSegment[]>();
    const politicalRow = rowMarks.every(mark => mark.sourceMark.conceptLayerId === 'polityAndSociety');
    const arrival = (item: CollisionItem) => Math.min(...item.members.map(member => member.sourceMark.timeSpan.start));

    for (let index = 0; index < boundaries.length - 1; index += 1) {
      const start = boundaries[index]!;
      const end = boundaries[index + 1]!;
      if (start === end) continue;
      const midpoint = (start + end) / 2;
      const active = items
        .filter((item) => item.start < midpoint && item.end > midpoint)
        .sort((left, right) => (politicalRow ? arrival(left) - arrival(right) : 0)
          || left.mark.sortKey.localeCompare(right.mark.sortKey));

      active.forEach((item, laneIndex) => {
        const markSegments = segmentsByMark.get(item.mark.id) ?? [];
        markSegments.push({
          start,
          end,
          laneIndex,
          laneCount: active.length,
          laneTop: laneIndex / active.length,
          laneHeight: 1 / active.length
        });
        segmentsByMark.set(item.mark.id, markSegments);
      });
    }

    for (const item of items) {
      const trackSegments = mergeAdjacentSegments(segmentsByMark.get(item.mark.id) ?? [{
          start: item.start,
          end: item.end,
          laneIndex: 0,
          laneCount: 1,
          laneTop: 0,
          laneHeight: 1
        }]);
      for (const member of item.members) {
        result.set(member.id, { ...member, participatesInCollisionLayout: true, trackSegments });
      }
    }
  }

  return marks.map((mark) => result.get(mark.id)!);
}
