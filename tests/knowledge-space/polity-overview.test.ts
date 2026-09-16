import assert from 'node:assert/strict';
import test from 'node:test';
import { V6_KNOWLEDGE_SPACE_DATA as data } from '../../src/knowledge-space/adapters/v6-adapter.ts';
import { buildPolityOverviewMarks, POLITY_DETAIL_ONLY_PLACEMENTS } from '../../src/knowledge-space/adapters/polity-overview.ts';
import { projectRegionTimeSlice } from '../../src/knowledge-space/projection/index.ts';
import { layoutRegionTimeMarks } from '../../src/knowledge-space/layout/index.ts';

test('reviewed detail-only placements leave full evidence intact and do not alter dates', () => {
  const overview = buildPolityOverviewMarks(data.marks);
  for (const rule of POLITY_DETAIL_ONLY_PLACEMENTS) {
    const original = data.marks.find(mark => mark.phaseId === rule.phaseId)!;
    const reduced = overview.find(mark => mark.phaseId === rule.phaseId)!;
    assert.ok(original.regionSegments.some(segment => segment.regionId === rule.regionId));
    assert.ok(!reduced.regionSegments.some(segment => segment.regionId === rule.regionId));
    assert.deepEqual(reduced.timeSpan, original.timeSpan);
  }
  assert.throws(() => buildPolityOverviewMarks(data.marks.filter(mark => mark.phaseId !== POLITY_DETAIL_ONLY_PLACEMENTS[0].phaseId)), /review is stale/);
  assert.ok(overview.every(mark => mark.regionSegments.length > 0));
});

test('Levant local kingdoms keep one fixed lane each and Akkad no longer overlaps Ur', () => {
  const projection = projectRegionTimeSlice(buildPolityOverviewMarks(data.marks), data.regions, {
    kind: 'region-time', conceptLayerId: 'polityAndSociety',
    timeWindow: { start: -3500, end: 400, label: 'test', approximate: false }
  });
  const layout = layoutRegionTimeMarks(projection.marks, { stablePolityRegionIds: ['southern-levant'] });
  const judah = layout.find(mark => mark.sourceMark.subjectRef.id === 'kingdom-of-judah')!;
  const israel = layout.find(mark => mark.sourceMark.subjectRef.id === 'kingdom-of-israel')!;
  assert.equal(judah.trackSegments.length, 1);
  assert.equal(israel.trackSegments.length, 1);
  assert.equal(judah.trackSegments[0]!.laneIndex, 0);
  assert.equal(israel.trackSegments[0]!.laneIndex, 1);
  assert.equal(judah.trackSegments[0]!.laneCount, 2);
  const akkad = data.entityPhases.filter(phase => phase.entityId === 'akkadian-empire');
  const ur = data.entityPhases.filter(phase => phase.entityId === 'ur-iii-kingdom');
  assert.ok(Math.max(...akkad.map(phase => phase.timeSpan.end!)) < Math.min(...ur.map(phase => phase.timeSpan.start!)));
});
