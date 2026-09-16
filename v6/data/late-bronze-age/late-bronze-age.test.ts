import assert from 'node:assert/strict';
import test from 'node:test';

import { ancientEgyptData as v5AncientEgypt } from '../../../data/ancient-egypt.ts';
import { lateBronzeAgeData as v5LateBronzeAge } from '../../../data/late-bronze-age.ts';
import { mesopotamiaData as v5Mesopotamia } from '../../../data/mesopotamia.ts';
import { REGIONS } from '../../catalogs/regions.ts';
import { V6_SOURCES } from '../../catalogs/sources.ts';
import { createV6KnowledgeCore } from '../../knowledge-core.ts';
import type { EntityPhase, RelationParticipant, TemporalRelation } from '../../schema/index.ts';
import { validateV6KnowledgeCore } from '../../validation/validate-core.ts';
import { ancientEgyptV6Data } from '../ancient-egypt/index.ts';
import { mesopotamiaV6Data } from '../mesopotamia/index.ts';
import { lateBronzeAgePendingHistoricalProcesses, lateBronzeAgeV6Data } from './index.ts';

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

test('Late Bronze Age V6 exports only its structural migration product', () => {
  assert.deepEqual(Object.keys(lateBronzeAgeV6Data).sort(), [
    'entities',
    'entityPhases',
    'events',
    'temporalRelations'
  ]);
  assert.equal(lateBronzeAgeV6Data.entities.length, 5);
  assert.equal(lateBronzeAgeV6Data.entityPhases.length, 6);
  assert.equal(lateBronzeAgeV6Data.events.length, 3);
  assert.equal(lateBronzeAgeV6Data.temporalRelations.length, 1);
  for (const forbidden of ['cards', 'scenes', 'assets', 'navigationOptions', 'mapStates']) {
    assert.equal(Object.hasOwn(lateBronzeAgeV6Data, forbidden), false, forbidden);
  }
});

test('the broad palace-system category remains migration evidence rather than a V6 Entity', () => {
  assert.equal(
    lateBronzeAgeV6Data.entityPhases.some(
      phase => String(phase.id) === 'post-palatial-regional-reorganization'
    ),
    false
  );
  assert.equal(
    lateBronzeAgeV6Data.entities.some(entity => String(entity.id) === 'late-bronze-palace-system'),
    false
  );
  assert.equal(
    lateBronzeAgeV6Data.entityPhases.some(phase => (
      String(phase.id) === 'late-bronze-palace-network-operation'
      || String(phase.id) === 'late-bronze-palace-system-crisis'
    )),
    false
  );
});

test('the duplicate Kadesh war Entity is removed and the stable Hittite dependency IDs exist', () => {
  assert.equal(
    lateBronzeAgeV6Data.entities.map(entity => String(entity.id)).includes('battle-of-kadesh-war'),
    false
  );
  assert.equal(
    lateBronzeAgeV6Data.entities.find(entity => entity.id === 'hittite-empire')?.type,
    'polity'
  );
  const phase = lateBronzeAgeV6Data.entityPhases.find(
    value => value.id === 'hittite-syrian-control'
  );
  assert.ok(phase);
  assert.ok((phase.timeSpan.start ?? Number.POSITIVE_INFINITY) <= -1300);
  assert.ok((phase.timeSpan.end ?? Number.NEGATIVE_INFINITY) >= -1200);
  assert.equal(
    ancientEgyptV6Data.events.find(event => event.id === 'event-battle-of-kadesh')?.participants.some(
      participant => participant.entityId === 'hittite-empire' &&
        participant.phaseId === 'hittite-syrian-control'
    ),
    true
  );
});

test('Ugarit keeps its treaty and a single bounded kingdom phase', () => {
  const ugarit = lateBronzeAgeV6Data.entities.find(entity => entity.id === 'ugarit-kingdom');
  assert.deepEqual(ugarit?.phaseIds, ['ugarit-kingdom-presence']);
  const phase = lateBronzeAgeV6Data.entityPhases.find(value => value.id === 'ugarit-kingdom-presence');
  assert.deepEqual(phase?.regions.map(region => region.regionId), ['syria-northern-levant']);
  assert.equal(
    lateBronzeAgeV6Data.events.some(event => event.id === 'event-ugarit-destruction'),
    false
  );
  assert.equal(phase?.timeSpan.end, -1180);
});

test('historical Events are accepted while historical processes remain pending review', () => {
  assert.deepEqual(
    new Set(lateBronzeAgeV6Data.events.map(event => event.id)),
    new Set(['event-hittite-sack-babylon', 'event-hittite-ugarit-treaty', 'event-ramesses-iii-northern-invasions'])
  );
  assert.deepEqual(
    new Set(lateBronzeAgePendingHistoricalProcesses.map(review => review.id)),
    new Set(v5LateBronzeAge.events.filter(event => event.kind === 'historicalProcess').map(event => event.id))
  );
  assert.equal(lateBronzeAgeV6Data.events.every(event => event.kind === 'historicalEvent'), true);
});

test('cross-module references use stable external subjects without copying them', () => {
  const ownedEntityIds = new Set<string>(lateBronzeAgeV6Data.entities.map(entity => entity.id));
  for (const externalId of ['old-babylonian-kingdom', 'cuneiform', 'egypt-new-kingdom']) {
    assert.equal(ownedEntityIds.has(externalId), false, externalId);
  }
  assert.equal(
    lateBronzeAgeV6Data.events.find(event => event.id === 'event-hittite-sack-babylon')
      ?.participants.some(participant => participant.phaseId === 'old-babylonian-city-kingdom-emergence'),
    true
  );
  assert.equal(
    lateBronzeAgePendingHistoricalProcesses.find(review => review.id === 'event-amarna-diplomatic-correspondence-operates')
      ?.candidate.participants.some(participant => participant.phaseId === 'cuneiform-eastern-mediterranean-diplomacy'),
    true
  );
  assert.equal(
    lateBronzeAgeV6Data.events.find(event => event.id === 'event-ramesses-iii-northern-invasions')
      ?.participants.some(participant => participant.phaseId === 'egypt-new-kingdom-imperial-court-order'),
    true
  );
});

test('Entity phase ownership and the local treaty relation have exact back-references', () => {
  const phases = new Map<string, EntityPhase>(
    lateBronzeAgeV6Data.entityPhases.map(phase => [phase.id, phase])
  );
  const relations = new Map<string, TemporalRelation>(
    lateBronzeAgeV6Data.temporalRelations.map(relation => [relation.id, relation])
  );
  for (const entity of lateBronzeAgeV6Data.entities) {
    assert.deepEqual(
      lateBronzeAgeV6Data.entityPhases.filter(phase => phase.entityId === entity.id).map(phase => phase.id),
      [...entity.phaseIds],
      entity.id
    );
  }
  for (const relation of lateBronzeAgeV6Data.temporalRelations) {
    for (const participant of relation.participants) {
      if (!isEntityRelationParticipant(participant)) continue;
      assert.equal(phases.get(participant.phaseId)?.entityId, participant.subject.id);
      assert.equal(phases.get(participant.phaseId)?.relationIds.includes(relation.id), true);
    }
  }
  for (const phase of lateBronzeAgeV6Data.entityPhases) {
    for (const relationId of phase.relationIds) {
      const relation = relations.get(relationId);
      assert.ok(relation, relationId);
      assert.equal(
        relation.participants.some(
          participant => isEntityRelationParticipant(participant) && participant.phaseId === phase.id
        ),
        true
      );
    }
  }
});

test('Late Bronze Age validates with its declared Mesopotamia and Egypt dependencies', () => {
  const core = createV6KnowledgeCore(
    [mesopotamiaV6Data, ancientEgyptV6Data, lateBronzeAgeV6Data],
    {
      sources: V6_SOURCES,
      regions: REGIONS
    }
  );
  const result = validateV6KnowledgeCore(core);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.deepEqual(result.errors, []);
});
