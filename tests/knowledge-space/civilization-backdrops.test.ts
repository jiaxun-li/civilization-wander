import assert from 'node:assert/strict';
import test from 'node:test';
import { EGYPT_BACKDROP, egyptBackdropWindow } from '../../src/knowledge-space/preview/civilization-backdrops.ts';
import { CIVILIZATION_BACKDROPS, backdropWindow } from '../../src/knowledge-space/preview/civilization-backdrops.ts';
import { V6_KNOWLEDGE_SPACE_DATA } from '../../src/knowledge-space/adapters/v6-adapter.ts';
import { V6_SOURCES } from '../../v6/catalogs/sources.ts';

test('curated backdrops cover the requested cultures without conflicting regional washes', () => {
  const required = ['ancient-egypt', 'mesopotamia', 'babylonia', 'assyria', 'indus', 'early-china', 'minoan', 'mycenaean', 'hittite', 'nubia'];
  assert.deepEqual(CIVILIZATION_BACKDROPS.map(item => item.id).sort(), required.sort());
  for (const context of CIVILIZATION_BACKDROPS) {
    assert.ok(context.start < context.end);
    assert.ok(context.regionIds.every(id => V6_KNOWLEDGE_SPACE_DATA.regions.some(region => region.id === id)), context.id);
    assert.ok(context.evidence.length && context.rationale);
    for (const evidence of context.evidence.filter(value => value.startsWith('source-'))) {
      assert.ok(V6_SOURCES.some(source => source.id === evidence), evidence);
    }
    assert.deepEqual(backdropWindow(context, { start: context.start, end: context.end }), { left: 0, width: 1 });
    assert.equal(backdropWindow(context, { start: context.end, end: context.end + 100 }), null);
    for (const other of CIVILIZATION_BACKDROPS.filter(other => other.id !== context.id)) {
      if (!context.regionIds.some(id => other.regionIds.includes(id))) continue;
      assert.ok(context.end <= other.start || other.end <= context.start, `${context.id}/${other.id}: conflicting cultural backgrounds`);
    }
  }
});

test('Egypt background clips to the viewport and never extends into later unreviewed eras', () => {
  assert.equal(egyptBackdropWindow({ start: -300, end: 400 }), null);
  assert.equal(egyptBackdropWindow({ start: -4000, end: -3500 }), null);
  assert.equal(egyptBackdropWindow({ start: -1500, end: -1500 }), null);
  assert.deepEqual(egyptBackdropWindow({ start: -2000, end: -1500 }), { left: 0, width: 1 });
  assert.deepEqual(egyptBackdropWindow({ start: -4000, end: 0 }), { left: 500 / 4000, width: 3200 / 4000 });
  assert.deepEqual(egyptBackdropWindow({ start: -500, end: 0 }), { left: 0, width: 200 / 500 });
  assert.deepEqual(EGYPT_BACKDROP.regionIds, ['nile-delta', 'nile-valley']);
});
