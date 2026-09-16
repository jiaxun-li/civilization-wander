import assert from 'node:assert/strict';
import test from 'node:test';

import type { KnowledgeSpaceMarkKind } from '../../src/knowledge-space/model/index.ts';
import {
  buildContinuousBlockRuns,
  layoutRegionTimeMarks,
  type LaidOutRegionTimeMark
} from '../../src/knowledge-space/layout/index.ts';
import type { ProjectedRegionTimeMark } from '../../src/knowledge-space/projection/index.ts';

function projected(
  id: string,
  xStart: number,
  xEnd: number,
  markKind: KnowledgeSpaceMarkKind,
  sortKey = id,
  subjectId = id,
  timeStart = xStart,
  timeEnd = xEnd
): ProjectedRegionTimeMark {
  const anchorX = (xStart + xEnd) / 2;
  return {
    id,
    markId: id,
    rowId: 'region:test',
    rowIndex: 0,
    regionId: 'test',
    regionRole: 'attested',
    markKind,
    xStart,
    xEnd,
    anchorX,
    clippedStart: false,
    clippedEnd: false,
    regionApproximate: false,
    sortKey,
    sourceMark: {
      id,
      subjectRef: { kind: 'entity', id: subjectId },
      label: id,
      conceptLayerId: 'polityAndSociety',
      timeSpan: { start: timeStart, end: timeEnd, label: id, approximate: false },
      regionSegments: [{
        regionId: 'test',
        role: 'attested',
        approximate: false,
        sourceIds: [],
        presenceMode: 'tracked'
      }],
      markKind,
      certainty: { timeApproximate: false, regionApproximate: false },
      textureSeed: id,
      semanticKind: { kind: 'entity', entityId: subjectId, entityType: 'polity' }
    }
  };
}

function byId(layout: readonly LaidOutRegionTimeMark[]): Map<string, LaidOutRegionTimeMark> {
  return new Map(layout.map((mark) => [mark.id, mark]));
}

test('clean bands keep separate stable rows without changing their dates', () => {
  const layout = byId(layoutRegionTimeMarks([
    projected('long-band', 0, 1, 'crayonStrip'),
    projected('short-band', 0.2, 0.5, 'crayonStrip')
  ], { separateBands: true }));
  const long = layout.get('long-band')!.trackSegments;
  const short = layout.get('short-band')!.trackSegments;
  assert.equal(long.length, 1);
  assert.equal(short.length, 1);
  assert.notEqual(long[0]!.laneIndex, short[0]!.laneIndex);
  assert.deepEqual([long[0]!.start, long[0]!.end], [0, 1]);
  assert.deepEqual([short[0]!.start, short[0]!.end], [0.2, 0.5]);
});

test('political arrivals branch below earlier subjects regardless of alphabetical identity', () => {
  const layout = byId(layoutRegionTimeMarks([
    projected('z-first', 0, 1, 'block'),
    projected('a-second', 0.2, 0.7, 'block'),
    projected('b-third', 0.4, 0.5, 'block')
  ]));
  assert.ok(layout.get('z-first')!.trackSegments.every(segment => segment.laneIndex === 0));
  assert.ok(layout.get('a-second')!.trackSegments.every(segment => segment.laneIndex === 1));
  assert.equal(layout.get('b-third')!.trackSegments[0]!.laneIndex, 2);
  assert.equal(layout.get('z-first')!.trackSegments.at(-1)!.laneCount, 1);
  assert.equal(layout.get('z-first')!.trackSegments.at(-1)!.end, 1);
});

test('solid marks branch only during collision intervals and merge afterwards', () => {
  const layout = byId(layoutRegionTimeMarks([
    projected('a', 0, 1, 'block', 'a'),
    projected('b', 0.2, 0.4, 'trace', 'b'),
    projected('c', 0.3, 0.6, 'block', 'c')
  ]));

  assert.deepEqual(layout.get('a')?.trackSegments, [
    { start: 0, end: 0.2, laneIndex: 0, laneCount: 1, laneTop: 0, laneHeight: 1 },
    { start: 0.2, end: 0.3, laneIndex: 0, laneCount: 2, laneTop: 0, laneHeight: 0.5 },
    { start: 0.3, end: 0.4, laneIndex: 0, laneCount: 3, laneTop: 0, laneHeight: 1 / 3 },
    { start: 0.4, end: 0.6, laneIndex: 0, laneCount: 2, laneTop: 0, laneHeight: 0.5 },
    { start: 0.6, end: 1, laneIndex: 0, laneCount: 1, laneTop: 0, laneHeight: 1 }
  ]);
  assert.equal(layout.get('b')?.trackSegments.at(-1)?.end, 0.4);
  assert.deepEqual(layout.get('c')?.trackSegments.at(-1), {
    start: 0.4,
    end: 0.6,
    laneIndex: 1,
    laneCount: 2,
    laneTop: 0.5,
    laneHeight: 0.5
  });
});

test('five simultaneous solid marks receive five stable local lanes', () => {
  const marks = Array.from({ length: 5 }, (_, index) => (
    projected(`mark-${index}`, 0.25, 0.75, index === 2 ? 'node' : 'block', `key-${index}`)
  ));
  const layout = layoutRegionTimeMarks(marks, { minimumNodeWidth: 0.5 });
  assert.deepEqual(
    layout.map((mark) => mark.trackSegments.find((segment) => segment.start === 0.25)?.laneCount),
    [5, 5, 5, 5, 5]
  );
  assert.deepEqual(
    layout.map((mark) => mark.trackSegments.find((segment) => segment.start === 0.25)?.laneIndex),
    [0, 1, 2, 3, 4]
  );
});

test('touching endpoints do not create a permanent or zero-width branch', () => {
  const layout = byId(layoutRegionTimeMarks([
    projected('left', 0.1, 0.5, 'trace'),
    projected('right', 0.5, 0.9, 'trace')
  ]));
  assert.deepEqual(layout.get('left')?.trackSegments, [{
    start: 0.1, end: 0.5, laneIndex: 0, laneCount: 1, laneTop: 0, laneHeight: 1
  }]);
  assert.deepEqual(layout.get('right')?.trackSegments, [{
    start: 0.5, end: 0.9, laneIndex: 0, laneCount: 1, laneTop: 0, laneHeight: 1
  }]);
});

test('nodes use a minimum visual footprint for collision while retaining their anchor', () => {
  const layout = byId(layoutRegionTimeMarks([
    projected('long', 0.1, 0.9, 'trace', 'a'),
    projected('point', 0.5, 0.5, 'node', 'b')
  ], { minimumNodeWidth: 0.1 }));

  assert.deepEqual(layout.get('point')?.trackSegments, [{
    start: 0.45,
    end: 0.55,
    laneIndex: 1,
    laneCount: 2,
    laneTop: 0.5,
    laneHeight: 0.5
  }]);
  assert.equal(layout.get('point')?.anchorX, 0.5);
  assert.equal(layout.get('long')?.trackSegments[0]?.laneCount, 1);
  assert.equal(layout.get('long')?.trackSegments.at(-1)?.laneCount, 1);
});

test('bands overlap without entering collision tracks', () => {
  const layout = layoutRegionTimeMarks([
    projected('strip', 0.1, 0.8, 'crayonStrip'),
    projected('field', 0.2, 0.9, 'crayonStrip'),
    projected('solid', 0.3, 0.7, 'block')
  ]);
  for (const mark of layout.filter(({ id }) => id !== 'solid')) {
    assert.equal(mark.participatesInCollisionLayout, false);
    assert.equal(mark.trackSegments[0]?.laneCount, 1);
  }
  assert.deepEqual(layout.find(({ id }) => id === 'solid')?.trackSegments, [{
    start: 0.3, end: 0.7, laneIndex: 0, laneCount: 1, laneTop: 0, laneHeight: 1
  }]);
});

test('layout is deterministic across input order, including phases of the same Entity', () => {
  const marks = [
    projected('phase-b', 0.2, 0.8, 'block', 'entity:shared:phase-b', 'shared'),
    projected('phase-a', 0.2, 0.8, 'block', 'entity:shared:phase-a', 'shared'),
    projected('other', 0.3, 0.6, 'trace', 'entity:zzz', 'zzz')
  ];
  const normalize = (layout: readonly LaidOutRegionTimeMark[]) => (
    [...layout]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map(({ id, trackSegments }) => ({ id, trackSegments }))
  );

  assert.deepEqual(
    normalize(layoutRegionTimeMarks(marks)),
    normalize(layoutRegionTimeMarks([...marks].reverse()))
  );
});

test('touching block Phases of one Entity become one visual run without changing members', () => {
  const marks = layoutRegionTimeMarks([
    projected('phase-early', 0.1, 0.4, 'block', 'entity:shared:early', 'shared'),
    projected('phase-late', 0.4, 0.8, 'block', 'entity:shared:late', 'shared')
  ]);
  const runs = buildContinuousBlockRuns(marks);

  assert.equal(runs.length, 1);
  assert.equal(runs[0]?.xStart, 0.1);
  assert.equal(runs[0]?.xEnd, 0.8);
  assert.deepEqual(runs[0]?.members.map(({ id }) => id), ['phase-early', 'phase-late']);
});

test('overlapping phases of one polity share a lane rather than colliding with themselves', () => {
  const layout = byId(layoutRegionTimeMarks([
    projected('early', 0.1, 0.6, 'block', 'a:early', 'same', -1000, -500),
    projected('late', 0.4, 0.9, 'block', 'a:late', 'same', -700, -200),
    projected('neighbor', 0.5, 0.7, 'block', 'b', 'other', -600, -400)
  ]));
  assert.deepEqual(layout.get('early')!.trackSegments, layout.get('late')!.trackSegments);
  assert.deepEqual(layout.get('early')!.trackSegments.map(segment => segment.laneCount), [1, 2, 1]);
  assert.equal(layout.get('early')!.trackSegments[0]!.start, 0.1);
  assert.equal(layout.get('early')!.trackSegments.at(-1)!.end, 0.9);
});

test('consecutive calendar phases share an unbroken layout span while true gaps remain empty', () => {
  const layout = byId(layoutRegionTimeMarks([
    projected('early', 0.1, 0.4, 'block', 'same:early', 'same', -100, -51),
    projected('late', 0.41, 0.6, 'block', 'same:late', 'same', -50, -20),
    projected('return', 0.8, 0.9, 'block', 'same:return', 'same', 10, 20)
  ]));
  assert.deepEqual(layout.get('early')!.trackSegments, layout.get('late')!.trackSegments);
  assert.equal(layout.get('early')!.trackSegments[0]!.start, 0.1);
  assert.equal(layout.get('early')!.trackSegments.at(-1)!.end, 0.6);
  assert.equal(layout.get('return')!.trackSegments[0]!.start, 0.8);
  assert.equal(buildContinuousBlockRuns([...layout.values()]).length, 2);
});

test('consecutive historical years form one visual run without inventing year zero', () => {
  const ancientRuns = buildContinuousBlockRuns(layoutRegionTimeMarks([
    projected('old-babylon-early', 0.1, 0.4, 'block', 'entity:old-babylon:early', 'old-babylon', -1894, -1765),
    projected('old-babylon-expansion', 0.405, 0.55, 'block', 'entity:old-babylon:expansion', 'old-babylon', -1764, -1750),
    projected('old-babylon-late', 0.555, 0.8, 'block', 'entity:old-babylon:late', 'old-babylon', -1749, -1595)
  ]));
  assert.equal(ancientRuns.length, 1);
  assert.deepEqual(
    ancientRuns[0]?.members.map(({ id }) => id),
    ['old-babylon-early', 'old-babylon-expansion', 'old-babylon-late']
  );

  const eraBoundaryRuns = buildContinuousBlockRuns(layoutRegionTimeMarks([
    projected('bce', 0.1, 0.4, 'block', 'entity:era:bce', 'era', -10, -1),
    projected('ce', 0.405, 0.8, 'block', 'entity:era:ce', 'era', 1, 10)
  ]));
  assert.equal(eraBoundaryRuns.length, 1);
});

test('a real time gap or a different Entity keeps block runs separate', () => {
  const runs = buildContinuousBlockRuns(layoutRegionTimeMarks([
    projected('shared-left', 0.1, 0.3, 'block', 'entity:shared:left', 'shared'),
    projected('shared-right', 0.4, 0.7, 'block', 'entity:shared:right', 'shared'),
    projected('other', 0.3, 0.6, 'block', 'entity:other', 'other'),
    projected('shared-trace', 0.7, 0.9, 'trace', 'entity:shared:trace', 'shared')
  ]));

  assert.equal(runs.length, 3);
  assert.deepEqual(
    runs.map((run) => run.members.map(({ id }) => id)),
    [['shared-left'], ['other'], ['shared-right']]
  );
});
