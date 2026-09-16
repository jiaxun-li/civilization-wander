import { V6_SOURCES } from '../../catalogs/sources.ts';
import test from 'node:test';
import assert from 'node:assert/strict';

import { REGIONS } from '../../catalogs/regions.ts';
import { createV6KnowledgeCore } from '../../knowledge-core.ts';
import type { EntityPhase, RelationParticipant, TemporalRelation } from '../../schema/index.ts';
import { validateV6KnowledgeCore } from '../../validation/validate-core.ts';
import { mesopotamiaV6Data } from './index.ts';
import { mesopotamiaPendingHistoricalProcesses } from './events.ts';

const isEntityRelationParticipant = (
  participant: RelationParticipant
): participant is Extract<RelationParticipant, { subject: { kind: 'entity' } }> =>
  participant.subject.kind === 'entity';

test('Mesopotamia V6 migrates only the structure-approved knowledge collections', () => {
  assert.deepEqual(Object.keys(mesopotamiaV6Data).sort(), [
    'entities',
    'entityPhases',
    'events',
    'temporalRelations'
  ]);
  assert.equal(mesopotamiaV6Data.entities.length, 11);
  assert.equal(mesopotamiaV6Data.entityPhases.length, 15);
  assert.equal(mesopotamiaV6Data.events.length, 1);
  assert.equal(mesopotamiaPendingHistoricalProcesses.length, 10);
  assert.equal(mesopotamiaV6Data.events.every(event => event.kind === 'historicalEvent'), true);
  assert.equal(
    mesopotamiaPendingHistoricalProcesses.every(review => review.status === 'pending'),
    true
  );
  assert.equal(mesopotamiaV6Data.temporalRelations.length, 2);
  for (const forbidden of ['cards', 'scenes', 'assets', 'navigationOptions', 'mapStates']) {
    assert.equal(Object.hasOwn(mesopotamiaV6Data, forbidden), false, forbidden);
  }
});

test('polity-stage summaries are removed while distinct actions remain Events', () => {
  const eventIds = mesopotamiaV6Data.events.map(event => String(event.id));
  assert.deepEqual(eventIds, [
    'event-hammurabi-conquests'
  ]);
  const pendingIds = new Set(mesopotamiaPendingHistoricalProcesses.map(review => String(review.id)));
  for (const removedId of [
    'event-akkadian-imperial-expansion',
    'event-akkadian-empire-fragments',
    'event-ur-iii-fragmentation',
    'event-old-babylonian-fragmentation'
  ]) assert.equal(pendingIds.has(removedId), false, removedId);
});

test('broad regional, pseudo-civilization, and mixed temple identities stay out of the accepted knowledge core', () => {
  const entityIds = new Set<string>(mesopotamiaV6Data.entities.map(entity => entity.id));
  assert.equal(entityIds.has('mesopotamia-region'), false);
  assert.equal(entityIds.has('mesopotamian-temple'), false);
  assert.equal(entityIds.has('sumer'), false);

  const uruk = mesopotamiaV6Data.entities.find(entity => entity.id === 'uruk');
  assert.deepEqual(uruk?.phaseIds, ['uruk-urban-expansion']);
  const phaseIds = new Set<string>(mesopotamiaV6Data.entityPhases.map(phase => phase.id));
  assert.equal(
    phaseIds.has('sumer-city-and-knowledge-traditions'),
    false
  );
  assert.equal(
    mesopotamiaV6Data.entityPhases.find(phase => phase.id === 'uruk-urban-expansion')?.title,
    '乌鲁克晚期城市扩张'
  );
});

test('Mesopotamia uses five ordered child Regions and no direct macro-Region attachment', () => {
  assert.deepEqual(
    REGIONS
      .filter(region => 'parentRegionId' in region && region.parentRegionId === 'mesopotamia')
      .sort((left, right) => left.displayOrder - right.displayOrder)
      .map(region => region.id),
    [
      'upper-mesopotamia',
      'middle-euphrates',
      'central-mesopotamia',
      'southern-mesopotamia',
      'persian-gulf'
    ]
  );

  const spatialRecords = [
    ...mesopotamiaV6Data.entityPhases,
    ...mesopotamiaV6Data.events,
    ...mesopotamiaPendingHistoricalProcesses.map(review => review.candidate)
  ];
  for (const record of spatialRecords) {
    assert.equal(
      record.regions.some(region => region.regionId === 'mesopotamia'),
      false,
      record.id
    );
  }
});

test('Babylon keeps its continuous core and conquests retain their dated Event geography', () => {
  const phaseById = new Map<string, EntityPhase>(
    mesopotamiaV6Data.entityPhases.map(phase => [phase.id, phase])
  );
  const regionIds = (phaseId: string): string[] => (
    phaseById.get(phaseId)?.regions.map(region => region.regionId) ?? []
  );

  assert.deepEqual(regionIds('old-babylonian-city-kingdom-emergence'), ['central-mesopotamia']);
  assert.deepEqual(mesopotamiaV6Data.events.find(event => event.id === 'event-hammurabi-conquests')?.regions.map(region => region.regionId), [
    'central-mesopotamia',
    'southern-mesopotamia',
    'middle-euphrates'
  ]);
  assert.equal(phaseById.has('old-babylonian-contraction'), false);
  assert.equal(phaseById.get('old-babylonian-city-kingdom-emergence')?.timeSpan.end, -1595);
  assert.deepEqual(regionIds('uruk-urban-expansion'), ['southern-mesopotamia']);
});

test('East Mediterranean cuneiform use has its own bounded diplomatic Phase', () => {
  const phase = mesopotamiaV6Data.entityPhases.find(
    value => value.id === 'cuneiform-eastern-mediterranean-diplomacy'
  );
  assert.deepEqual(
    phase?.regions.map(region => region.regionId),
    ['southern-levant']
  );
  assert.deepEqual(phase?.timeSpan, {
    start: -1400,
    end: -1300,
    label: '约前1400—前1300年',
    approximate: true
  });
});

test('textual-tradition Events become EntityPhase evidence instead of historical Events', () => {
  const eventIds = new Set<string>(mesopotamiaV6Data.events.map(event => event.id));
  assert.equal(eventIds.has('event-gilgamesh-textual-tradition-forms'), false);
  assert.equal(eventIds.has('event-tower-babel-textual-tradition-forms'), false);

  const phaseIds = new Set<string>(mesopotamiaV6Data.entityPhases.map(phase => phase.id));
  assert.equal(phaseIds.has('gilgamesh-sumerian-stories'), false);
  assert.equal(phaseIds.has('gilgamesh-babylonian-versions'), false);
  assert.equal(phaseIds.has('gilgamesh-standard-version-composition'), true);
  assert.equal(phaseIds.has('tower-of-babel-textual-formation'), false);
});

test('Gilgamesh uses one representative written work placement rather than repeated transmission bands', () => {
  const work = mesopotamiaV6Data.entities.find(entity => entity.id === 'epic-of-gilgamesh');
  assert.equal(work?.type, 'literaryWork');
  assert.deepEqual(work?.phaseIds, ['gilgamesh-standard-version-composition']);
  const phase = mesopotamiaV6Data.entityPhases.find(value => value.id === work?.phaseIds[0]);
  assert.deepEqual(phase?.timeSpan, {
    start: -1150, end: -1150, label: '约公元前12世纪', approximate: true
  });
  assert.equal(phase?.regions.length, 1);
  assert.equal(phase?.regions[0]?.role, 'associated');
  assert.ok(phase?.sourceIds.includes('source-met-gilgamesh-overview'));
  assert.equal(mesopotamiaV6Data.entities.find(entity => entity.id === 'tower-of-babel-tradition')?.type, 'literaryWork');
});

test('Entity phase ownership is exact and every relation participant has a phase back-reference', () => {
  const phases = new Map<string, EntityPhase>(
    mesopotamiaV6Data.entityPhases.map(phase => [phase.id, phase])
  );
  const relations = new Map<string, TemporalRelation>(
    mesopotamiaV6Data.temporalRelations.map(relation => [relation.id, relation])
  );

  for (const entity of mesopotamiaV6Data.entities) {
    for (const phaseId of entity.phaseIds) {
      assert.equal(phases.get(phaseId)?.entityId, entity.id, phaseId);
    }
    assert.deepEqual(
      mesopotamiaV6Data.entityPhases.filter(phase => phase.entityId === entity.id).map(phase => phase.id),
      [...entity.phaseIds],
      entity.id
    );
  }

  for (const phase of mesopotamiaV6Data.entityPhases) {
    assert.equal(Object.hasOwn(phase, 'conceptLayerId'), false, phase.id);
    assert.doesNotMatch(phase.title, /长期延续|持续重组|继续存在/);
  }

  for (const relation of mesopotamiaV6Data.temporalRelations) {
    for (const participant of relation.participants) {
      if (!isEntityRelationParticipant(participant)) continue;
      const phase = phases.get(participant.phaseId);
      assert.equal(phase?.entityId, participant.subject.id, participant.phaseId);
      assert.equal(phase?.relationIds.includes(relation.id), true, `${participant.phaseId} -> ${relation.id}`);
    }
  }

  for (const phase of mesopotamiaV6Data.entityPhases) {
    for (const relationId of phase.relationIds) {
      const relation = relations.get(relationId);
      assert.ok(relation, relationId);
      assert.equal(
        relation.participants.some(
          participant => isEntityRelationParticipant(participant) && participant.phaseId === phase.id
        ),
        true,
        `${relationId} -> ${phase.id}`
      );
    }
  }
});

test('the isolated Mesopotamia module passes the V6 validator with the reviewed V6 source catalog', () => {
  const core = createV6KnowledgeCore([mesopotamiaV6Data], {
    sources: V6_SOURCES,
    regions: REGIONS
  });
  const result = validateV6KnowledgeCore(core);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.deepEqual(result.errors, []);
});

test('curated language placements avoid applying the full writing-system span to unrelated regions', () => {
 const late = mesopotamiaV6Data.entityPhases.find(p => p.id === 'cuneiform-multilingual-transmission');
 assert.deepEqual(late?.regions.map(r => r.regionId), ['central-mesopotamia']);
 assert.equal(late?.timeSpan.start, -2000);
 assert.deepEqual(mesopotamiaV6Data.entities.find(e => e.id === 'tower-of-babel-tradition')?.phaseIds, []);
 const conquest = mesopotamiaV6Data.events.find(e => e.id === 'event-hammurabi-conquests');
 assert.ok(conquest?.participants.some(p => p.entityId === 'rim-sin-i' && !p.phaseId));
 assert.ok(conquest?.regions.every(r => r.role === 'attested'));
});
