import { V6_SOURCES } from '../../catalogs/sources.ts';
import assert from 'node:assert/strict';
import test from 'node:test';

import { ancientIndiaData as v5AncientIndia } from '../../../data/ancient-india.ts';
import { REGIONS } from '../../catalogs/regions.ts';
import { createV6KnowledgeCore } from '../../knowledge-core.ts';
import type { EntityPhase, RelationParticipant, TemporalRelation } from '../../schema/index.ts';
import { validateV6KnowledgeCore } from '../../validation/validate-core.ts';
import { ancientIndiaPendingHistoricalProcesses, ancientIndiaV6Data } from './index.ts';

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

test('Ancient India V6 exports only module-owned structural collections', () => {
  assert.deepEqual(Object.keys(ancientIndiaV6Data).sort(), [
    'entities',
    'entityPhases',
    'events',
    'temporalRelations'
  ]);
  assert.equal(ancientIndiaV6Data.entities.length, 5);
  assert.equal(ancientIndiaV6Data.entityPhases.length, 5);
  assert.equal(ancientIndiaV6Data.events.length, 0);
  assert.equal(ancientIndiaPendingHistoricalProcesses.length, 3);
  assert.equal(ancientIndiaV6Data.temporalRelations.length, 1);
  for (const forbidden of ['cards', 'scenes', 'assets', 'navigationOptions', 'mapStates']) {
    assert.equal(Object.hasOwn(ancientIndiaV6Data, forbidden), false, forbidden);
  }
});

test('Mohenjo-daro is an archaeological site and no migration or community placeholder is created', () => {
  assert.equal(
    ancientIndiaV6Data.entities.find(entity => entity.id === 'mohenjo-daro')?.type,
    'archaeologicalSite'
  );
  assert.deepEqual(
    new Set(ancientIndiaV6Data.entities.map(entity => entity.id)),
    new Set(['indus-civilization', 'mohenjo-daro', 'vedic-tradition', 'vedic-sanskrit-language', 'indus-sign-system'])
  );
});

test('Rigveda textual evidence becomes a Vedic EntityPhase instead of a runtime Event', () => {
  const eventIds = new Set<string>(ancientIndiaV6Data.events.map(event => event.id));
  assert.equal(eventIds.has('event-rigveda-composed-transmitted'), false);
  const phase = ancientIndiaV6Data.entityPhases.find(
    value => value.id === 'vedic-early-hymn-oral-tradition'
  );
  assert.ok(phase);
  for (const sourceId of [
    'source-jamison-brereton-rigveda',
    'source-oxford-vedic-oral-tradition',
    'source-cambridge-veda-before-print'
  ] as const) {
    assert.equal(phase.sourceIds.includes(sourceId), true, sourceId);
  }
});

test('Indus city communities cover the mature urban network without a rural successor phase', () => {
  const phases = new Map<string, EntityPhase>(ancientIndiaV6Data.entityPhases.map(phase => [phase.id, phase]));
  assert.equal(ancientIndiaV6Data.entities.find(e => e.id === 'indus-civilization')?.type, 'community');
  assert.equal(phases.get('indus-civilization-core-presence')?.timeSpan.start, -2600);
  assert.equal(phases.get('indus-civilization-core-presence')?.timeSpan.end, -1900);
  assert.equal(phases.has('indus-regional-transformation'), false);
  assert.equal(
    ancientIndiaV6Data.entityPhases.filter(phase => phase.entityId === 'indus-civilization').length,
    1
  );
  assert.equal(phases.has('vedic-formation-through-mobility-and-contact'), false);
  assert.equal(
    ancientIndiaV6Data.entityPhases.some(phase => Object.hasOwn(phase, 'conceptLayerId')),
    false
  );
});

test('the cross-module exchange uses the stable Mesopotamia EntityPhase without copying it', () => {
  assert.equal(
    ancientIndiaV6Data.entities.map(entity => String(entity.id)).includes('akkadian-empire'),
    false
  );
  assert.equal(
    ancientIndiaV6Data.entityPhases.map(phase => String(phase.id)).includes('akkadian-imperial-order'),
    false
  );
  const exchange = ancientIndiaPendingHistoricalProcesses.find(
    event => event.id === 'event-indus-mesopotamia-exchange'
  );
  assert.ok(exchange);
  assert.equal(
    exchange.candidate.participants.some(
      participant => participant.entityId === 'akkadian-empire' &&
        participant.phaseId === 'akkadian-imperial-order'
    ),
    true
  );
});

test('Entity phase ownership and local TemporalRelation back-references are exact', () => {
  const phases = new Map<string, EntityPhase>(
    ancientIndiaV6Data.entityPhases.map(phase => [phase.id, phase])
  );
  const relations = new Map<string, TemporalRelation>(
    ancientIndiaV6Data.temporalRelations.map(relation => [relation.id, relation])
  );

  for (const entity of ancientIndiaV6Data.entities) {
    assert.deepEqual(
      ancientIndiaV6Data.entityPhases.filter(phase => phase.entityId === entity.id).map(phase => phase.id),
      [...entity.phaseIds],
      entity.id
    );
  }
  for (const relation of ancientIndiaV6Data.temporalRelations) {
    for (const participant of relation.participants) {
      if (!isEntityRelationParticipant(participant)) continue;
      assert.equal(phases.get(participant.phaseId)?.entityId, participant.subject.id);
      assert.equal(phases.get(participant.phaseId)?.relationIds.includes(relation.id), true);
    }
  }
  for (const phase of ancientIndiaV6Data.entityPhases) {
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

test('the isolated Ancient India accepted core passes without pending process dependencies', () => {
  const core = createV6KnowledgeCore([ancientIndiaV6Data], {
    sources: V6_SOURCES,
    regions: REGIONS
  });
  const result = validateV6KnowledgeCore(core);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.deepEqual(result.errors, []);
});

test('Vedic review retains the tradition as one northwestern range without a speculative Ganges branch', () => {
  const entity = ancientIndiaV6Data.entities.find(entity => entity.id === 'vedic-tradition');
  assert.equal(entity?.name, '吠陀传统');
  const phases = ancientIndiaV6Data.entityPhases.filter(phase => phase.entityId === 'vedic-tradition');
  assert.equal(phases.length, 1);
  assert.deepEqual(phases.flatMap(phase => phase.regions.map(region => region.regionId)), ['south-asia-northwest']);
  assert.equal(phases[0].timeSpan.start, -1500);
  assert.equal(phases[0].timeSpan.end, -500);
});
