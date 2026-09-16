import { V6_SOURCES } from '../../catalogs/sources.ts';
import test from 'node:test';
import assert from 'node:assert/strict';

import { ancientChinaData as v5AncientChina } from '../../../data/ancient-china.ts';
import { REGIONS } from '../../catalogs/regions.ts';
import { createV6KnowledgeCore } from '../../knowledge-core.ts';
import type { EntityPhase, RelationParticipant, TemporalRelation } from '../../schema/index.ts';
import { validateV6KnowledgeCore } from '../../validation/validate-core.ts';
import { ancientChinaPendingHistoricalProcesses, ancientChinaV6Data } from './index.ts';

const naturalEarthSource = {
  id: 'source-natural-earth',
  title: 'Natural Earth 1:50m Physical Vectors',
  author: 'Natural Earth',
  year: 2025,
  publisher: 'Natural Earth',
  url: 'https://www.naturalearthdata.com/downloads/50m-physical-vectors/'
};

const isEntityRelationParticipant = (
  participant: RelationParticipant
): participant is Extract<RelationParticipant, { subject: { kind: 'entity' } }> =>
  participant.subject.kind === 'entity';

test('Ancient China V6 exports only structure-approved collections', () => {
  assert.deepEqual(Object.keys(ancientChinaV6Data).sort(), ['entities', 'entityPhases', 'events', 'temporalRelations']);
  assert.equal(ancientChinaV6Data.entities.length, 8);
  assert.equal(ancientChinaV6Data.entityPhases.length, 11);
  assert.equal(ancientChinaV6Data.events.length, 2);
  assert.equal(ancientChinaV6Data.temporalRelations.length, 2);
  for (const forbidden of ['cards', 'scenes', 'assets', 'navigationOptions', 'mapStates']) {
    assert.equal(Object.hasOwn(ancientChinaV6Data, forbidden), false, forbidden);
  }
});

test('broad chronological labels are not promoted as V6 Entities or EntityPhases', () => {
  assert.equal(
    ancientChinaV6Data.entities.some(entity => String(entity.id) === 'china-early-bronze-world'),
    false
  );
  for (const phaseId of [
    'early-china-regional-centers',
    'early-china-bronze-connected-worlds',
    'early-china-zhou-transformations'
  ]) {
    assert.equal(ancientChinaV6Data.entityPhases.some(phase => String(phase.id) === phaseId), false, phaseId);
  }
});

test('the impossible Western Zhou participant is removed from the Erligang process', () => {
  const review = ancientChinaPendingHistoricalProcesses.find(
    item => item.id === 'event-erligang-urban-expansion'
  );
  assert.ok(review);
  assert.deepEqual(review.candidate.participants.map(participant => participant.entityId), ['shang-civilization']);
  assert.equal(review.candidate.participants.some(participant => participant.entityId === 'western-zhou'), false);
});

test('historical processes remain available only in the pending review export', () => {
  assert.equal(ancientChinaPendingHistoricalProcesses.length, 8);
  assert.equal(
    ancientChinaPendingHistoricalProcesses.every(review => review.candidate.kind === 'historicalProcess'),
    true
  );
  assert.equal(ancientChinaV6Data.events.some(event => event.kind === 'historicalProcess'), false);
});

test('Entity phase ownership and relation back-references are exact', () => {
  const phases = new Map<string, EntityPhase>(ancientChinaV6Data.entityPhases.map(phase => [phase.id, phase]));
  const relations = new Map<string, TemporalRelation>(ancientChinaV6Data.temporalRelations.map(relation => [relation.id, relation]));
  for (const entity of ancientChinaV6Data.entities) {
    assert.deepEqual(
      ancientChinaV6Data.entityPhases.filter(phase => phase.entityId === entity.id).map(phase => phase.id),
      [...entity.phaseIds],
      entity.id
    );
  }
  for (const relation of ancientChinaV6Data.temporalRelations) {
    for (const participant of relation.participants) {
      if (!isEntityRelationParticipant(participant)) continue;
      assert.equal(phases.get(participant.phaseId)?.entityId, participant.subject.id, participant.phaseId);
      assert.equal(phases.get(participant.phaseId)?.relationIds.includes(relation.id), true, relation.id);
    }
  }
  for (const phase of ancientChinaV6Data.entityPhases) {
    for (const relationId of phase.relationIds) {
      const relation = relations.get(relationId);
      assert.ok(relation, relationId);
      assert.equal(relation.participants.some(participant => isEntityRelationParticipant(participant) && participant.phaseId === phase.id), true, phase.id);
    }
  }
});

test('the isolated Ancient China module passes the V6 validator', () => {
  const core = createV6KnowledgeCore([ancientChinaV6Data], {
    sources: V6_SOURCES,
    regions: REGIONS
  });
  const result = validateV6KnowledgeCore(core);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.deepEqual(result.errors, []);
});

test('review separates Shang production from Zhou reuse and preserves uncertain archaeological dating', () => {
  const phases = ancientChinaV6Data.entityPhases.filter(phase => phase.entityId === 'shang-bronze-ritual-vessels');
  assert.equal(phases.every(phase => phase.timeSpan.end <= -1046), true);
  const conquest = ancientChinaV6Data.events.find(event => event.id === 'event-zhou-conquest-of-shang');
  assert.ok(conquest);
  assert.equal(conquest.timeSpan.start, conquest.timeSpan.end);
  assert.equal(conquest.timeSpan.approximate, true);
  assert.equal(new Set(conquest.participants.map(p => p.entityId)).size, 2);
  const deposition = ancientChinaV6Data.events.find(event => event.id === 'event-sanxingdui-ritual-object-deposition');
  assert.ok(deposition);
  assert.equal(deposition.timeSpan.start, -1200);
  assert.equal(deposition.timeSpan.end, -950);
  assert.match(deposition.timeSpan.label ?? '', /定年范围/);
  assert.equal(ancientChinaV6Data.events.some(event => String(event.id) === 'event-western-zhou-capitals-fall'), false);
});
