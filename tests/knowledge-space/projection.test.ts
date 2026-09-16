import assert from 'node:assert/strict';
import test from 'node:test';

import { deriveKnowledgeSpaceMarks } from '../../src/knowledge-space/model/index.ts';
import {
  markIntersectsSlice,
  projectRegionTimeSlice
} from '../../src/knowledge-space/projection/index.ts';
import { fixtureInput, fixtureRegions } from './fixtures.ts';

const timeWindow = {
  start: -100,
  end: 0,
  label: '前100—公元元年',
  approximate: false
} as const;

test('all three SliceSpec forms select marks without adding cross-layer projections', () => {
  const marks = deriveKnowledgeSpaceMarks(fixtureInput);
  const polityMark = marks.find((mark) => mark.id === 'phase:polity-phase')!;

  assert.equal(markIntersectsSlice(polityMark, {
    kind: 'region-time',
    conceptLayerId: 'polityAndSociety'
  }), true);
  assert.equal(markIntersectsSlice(polityMark, {
    kind: 'region-time',
    conceptLayerId: 'artAndLiterature'
  }), false);
  assert.equal(markIntersectsSlice(polityMark, {
    kind: 'concept-time',
    regionId: 'a-one'
  }), true);
  assert.equal(markIntersectsSlice(polityMark, {
    kind: 'concept-time',
    regionId: 'a-two'
  }), false);
  assert.equal(markIntersectsSlice(polityMark, {
    kind: 'region-concept',
    timeWindow: { start: -75, end: -70, label: '测试窗口', approximate: false }
  }), true);
  assert.equal(markIntersectsSlice(polityMark, {
    kind: 'region-concept',
    timeWindow: { start: 10, end: 20, label: '测试窗口', approximate: false }
  }), false);
});

test('Region × Time projection uses macro headers and an explicit unscoped row', () => {
  const marks = deriveKnowledgeSpaceMarks(fixtureInput);
  const projection = projectRegionTimeSlice(marks, fixtureRegions, {
    kind: 'region-time',
    conceptLayerId: 'artAndLiterature',
    timeWindow
  });

  assert.deepEqual(projection.axisGroups.map(({ label }) => label), ['大区甲']);
  assert.deepEqual(projection.axisRows.map(({ id, label }) => ({ id, label })), [{
    id: 'region:macro-a:unscoped',
    label: '大区甲（未细分）'
  }]);
  assert.equal(projection.marks.length, 1);
  assert.equal(projection.marks[0]?.markKind, 'node');
  assert.equal(projection.marks[0]?.rowId, 'region:macro-a:unscoped');
});

test('Region × Time projection includes only the locked concept layer and normalizes time', () => {
  const marks = deriveKnowledgeSpaceMarks(fixtureInput, [{
    phaseId: 'language-phase',
    presenceMode: 'pervasive',
    regionIds: ['a-one'],
    rationale: 'Fixture evidence supports broad use.',
    sourceIds: ['source-one']
  }]);
  const projection = projectRegionTimeSlice(marks, fixtureRegions, {
    kind: 'region-time',
    conceptLayerId: 'languageAndKnowledge',
    timeWindow
  });

  assert.deepEqual(projection.axisRows.map(({ regionId }) => regionId), ['a-one', 'a-two']);
  assert.deepEqual(projection.marks.map(({ markKind }) => markKind).sort(), ['crayonStrip', 'crayonStrip']);
  assert.ok(projection.marks.every(({ sourceMark }) => sourceMark.conceptLayerId === 'languageAndKnowledge'));
  assert.ok(projection.marks.every(({ xStart }) => Math.abs(xStart - 0.1) < 1e-9));
  assert.ok(projection.marks.every(({ xEnd }) => Math.abs(xEnd - 0.9) < 1e-9));
});

test('scaffolding Regions are opt-in and contain no invented marks', () => {
  const marks = deriveKnowledgeSpaceMarks(fixtureInput);
  const projection = projectRegionTimeSlice(marks, fixtureRegions, {
    kind: 'region-time',
    conceptLayerId: 'polityAndSociety',
    timeWindow,
    includeScaffolding: true
  });

  assert.deepEqual(projection.axisGroups.map(({ regionId }) => regionId), ['macro-a', 'macro-b']);
  assert.deepEqual(projection.axisRows.map(({ regionId }) => regionId), ['a-one', 'a-two', 'macro-b']);
  assert.equal(projection.marks.length, 1);
  assert.equal(projection.marks[0]?.regionId, 'a-one');
});
