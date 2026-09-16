import assert from 'node:assert/strict';
import test from 'node:test';
import { POLITY_LABEL_REGIONS } from '../../src/knowledge-space/preview/polity-labels.ts';
import { V6_KNOWLEDGE_SPACE_DATA } from '../../src/knowledge-space/adapters/v6-adapter.ts';

test('every political subject has one label anchor in an existing placement', () => {
  const entities = V6_KNOWLEDGE_SPACE_DATA.entities.filter(entity => entity.conceptLayerId === 'polityAndSociety' && entity.phaseIds.length > 0);
  assert.deepEqual(Object.keys(POLITY_LABEL_REGIONS).sort(), entities.map(entity => entity.id).sort());
  for (const entity of entities) {
    const phases = V6_KNOWLEDGE_SPACE_DATA.entityPhases.filter(phase => phase.entityId === entity.id);
    assert.ok(phases.some(phase => phase.regions.some(region => region.regionId === POLITY_LABEL_REGIONS[entity.id])), entity.id);
  }
});
