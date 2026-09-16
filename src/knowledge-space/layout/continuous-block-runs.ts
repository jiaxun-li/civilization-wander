import type { KnowledgeSubject } from '../../../v6/schema/index.ts';
import type { LaidOutRegionTimeMark } from './local-tracks.ts';

export interface ContinuousBlockRun {
  readonly id: string;
  readonly rowId: string;
  readonly rowIndex: number;
  readonly subjectRef: KnowledgeSubject;
  readonly label: string;
  readonly xStart: number;
  readonly xEnd: number;
  readonly members: readonly LaidOutRegionTimeMark[];
}

function subjectKey(subject: KnowledgeSubject): string {
  return `${subject.kind}:${subject.id}`;
}

function nextHistoricalYear(year: number): number | undefined {
  if (!Number.isInteger(year)) return undefined;
  return year === -1 ? 1 : year + 1;
}

export function timeSpansAreContinuous(
  previousEnd: number,
  nextStart: number
): boolean {
  if (nextStart <= previousEnd) return true;
  return nextHistoricalYear(previousEnd) === nextStart;
}

/**
 * Groups only touching or overlapping block placements of the same subject in
 * one Region row. EntityPhase data remains separate in `members`; this is a
 * presentation run used to remove false visual gaps at internal boundaries.
 */
export function buildContinuousBlockRuns(
  marks: readonly LaidOutRegionTimeMark[]
): readonly ContinuousBlockRun[] {
  const buckets = new Map<string, LaidOutRegionTimeMark[]>();
  for (const mark of marks) {
    if (mark.markKind !== 'block') continue;
    const key = `${mark.rowId}@${subjectKey(mark.sourceMark.subjectRef)}`;
    const bucket = buckets.get(key) ?? [];
    bucket.push(mark);
    buckets.set(key, bucket);
  }

  const runs: ContinuousBlockRun[] = [];
  for (const bucket of buckets.values()) {
    const sorted = [...bucket].sort((left, right) => (
      left.xStart - right.xStart
      || left.xEnd - right.xEnd
      || left.id.localeCompare(right.id)
    ));
    let members: LaidOutRegionTimeMark[] = [];
    let runTimeEnd = Number.NEGATIVE_INFINITY;

    const flush = (): void => {
      if (members.length === 0) return;
      const first = members[0]!;
      const last = members.at(-1)!;
      const runIndex = runs.filter((run) => (
        run.rowId === first.rowId
        && subjectKey(run.subjectRef) === subjectKey(first.sourceMark.subjectRef)
      )).length;
      runs.push({
        id: `block-run:${subjectKey(first.sourceMark.subjectRef)}@${first.rowId}:${runIndex}`,
        rowId: first.rowId,
        rowIndex: first.rowIndex,
        subjectRef: first.sourceMark.subjectRef,
        label: first.sourceMark.label,
        xStart: first.xStart,
        xEnd: Math.max(...members.map((member) => member.xEnd)),
        members
      });
      members = [];
      runTimeEnd = Number.NEGATIVE_INFINITY;
    };

    for (const mark of sorted) {
      if (
        members.length > 0
        && !timeSpansAreContinuous(runTimeEnd, mark.sourceMark.timeSpan.start)
      ) {
        flush();
      }
      members.push(mark);
      runTimeEnd = Math.max(runTimeEnd, mark.sourceMark.timeSpan.end);
    }
    flush();
  }

  return runs.sort((left, right) => (
    left.rowIndex - right.rowIndex
    || left.xStart - right.xStart
    || left.id.localeCompare(right.id)
  ));
}
