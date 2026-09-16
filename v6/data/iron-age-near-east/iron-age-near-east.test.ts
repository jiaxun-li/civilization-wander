import test from 'node:test';
import assert from 'node:assert/strict';

import { V6_SOURCES, REGIONS } from '../../catalogs/index.ts';
import { createV6KnowledgeCore } from '../../knowledge-core.ts';
import type { EntityPhase, RelationParticipant, TemporalRelation } from '../../schema/index.ts';
import { validateV6KnowledgeCore } from '../../validation/validate-core.ts';
import { ironAgeNearEastPendingHistoricalProcesses, ironAgeNearEastV6Data } from './index.ts';

const isEntityRelationParticipant = (participant: RelationParticipant): participant is Extract<RelationParticipant, { subject: { kind: 'entity' } }> => participant.subject.kind === 'entity';

test('Iron Age Near East exports only V6 structural collections', () => {
  assert.deepEqual(Object.keys(ironAgeNearEastV6Data).sort(), ['entities', 'entityPhases', 'events', 'temporalRelations']);
  assert.equal(ironAgeNearEastV6Data.entities.length, 21);
  assert.equal(ironAgeNearEastV6Data.entityPhases.length, 30);
  assert.equal(ironAgeNearEastV6Data.events.length, 1);
  assert.equal(ironAgeNearEastPendingHistoricalProcesses.length, 16);
  assert.equal(ironAgeNearEastV6Data.temporalRelations.length, 3);
});

test('traditional narrative does not invent a dated Phase and Assur remains distinct from the empire', () => {
  const eventIds = new Set<string>(ironAgeNearEastV6Data.events.map(event => event.id));
  const pendingIds = new Set<string>(ironAgeNearEastPendingHistoricalProcesses.map(event => event.id));
  assert.equal(eventIds.has('event-jacob-renamed-israel-tradition'), false);
  assert.equal(pendingIds.has('event-old-assyrian-trade-networks'), true);
  assert.equal(ironAgeNearEastV6Data.entityPhases.some(phase => String(phase.id) === 'israelite-jacob-name-tradition'), false);
  assert.equal(ironAgeNearEastV6Data.entities.find(entity => entity.id === 'assur-community')?.type, 'community');
  assert.equal(ironAgeNearEastV6Data.entities.find(entity => entity.id === 'neo-assyrian-empire')?.type, 'polity');
});

test('iron technology keeps two sourced regional examples without extra Phases', () => {
  const iron = ironAgeNearEastV6Data.entities.find(entity => entity.id === 'iron');
  assert.equal(iron?.name, '铁器技术');
  assert.equal(iron?.type, 'technology');
  assert.equal(iron?.conceptLayerId, 'technologyAndExchange');
  const ironPhases = ironAgeNearEastV6Data.entityPhases.filter(phase => phase.entityId === 'iron');
  assert.deepEqual(ironPhases.map(phase => ({
    id: phase.id,
    start: phase.timeSpan.start,
    end: phase.timeSpan.end,
    regions: phase.regions.map(association => association.regionId)
  })), [
    { id: 'iron-post-palatial-diffusion', start: -1200, end: -800, regions: ['southern-levant'] },
    { id: 'iron-chinese-cast-iron', start: -800, end: -300, regions: ['middle-yellow-river'] }
  ]);
  assert.equal(ironPhases.some(phase => Object.hasOwn(phase, 'conceptLayerId')), false);
});

test('mixed continuity and wrong-endpoint Phases are absent', () => {
  const phaseIds = new Set<string>(ironAgeNearEastV6Data.entityPhases.map(phase => phase.id));
  for (const phaseId of [
    'babylon-long-urban-tradition',
    'israelite-shared-kingdom-traditions',
    'israelite-post-exile-community-traditions',
    'phoenician-under-assyrian-tribute',
    'lydian-coinage-and-fall'
  ]) assert.equal(phaseIds.has(phaseId), false, phaseId);
  assert.equal(
    ironAgeNearEastV6Data.entities.find(entity => entity.id === 'phoenician-tradition')?.type,
    'tradeNetwork'
  );
  assert.equal(
    ironAgeNearEastV6Data.temporalRelations.map(relation => String(relation.id)).includes('relation-phoenician-script-influences-aramaic'),
    false
  );
});

test('Levant imperial influence does not replace local kingdoms or claim continuous direct rule', () => {
  const westernCampaigns = ironAgeNearEastV6Data.entityPhases.find(phase => phase.id === 'neo-babylonian-capital-and-rule');
  assert.ok(westernCampaigns);
  assert.deepEqual(westernCampaigns.timeSpan, { start: -605, end: -539, label: '约公元前605—前539年', approximate: true });
  assert.equal(westernCampaigns.regions.find(region => region.regionId === 'central-mesopotamia')?.role, 'core');
  const levant = westernCampaigns.regions.find(region => region.regionId === 'southern-levant');
  assert.equal(levant?.role, 'influence');
  assert.ok(levant?.sourceIds.includes('source-met-babylon'));
  for (const id of ['judah-kingdom-presence', 'israel-kingdom-presence']) {
    const local = ironAgeNearEastV6Data.entityPhases.find(phase => phase.id === id);
    assert.equal(local?.regions.find(region => region.regionId === 'southern-levant')?.role, 'core');
  }
});

test('Entity phase ownership and relation back-references are exact', () => {
  const phases = new Map<string, EntityPhase>(ironAgeNearEastV6Data.entityPhases.map(phase => [phase.id, phase]));
  const relations = new Map<string, TemporalRelation>(ironAgeNearEastV6Data.temporalRelations.map(relation => [relation.id, relation]));
  for (const entity of ironAgeNearEastV6Data.entities) {
    assert.deepEqual(ironAgeNearEastV6Data.entityPhases.filter(phase => phase.entityId === entity.id).map(phase => phase.id), [...entity.phaseIds], entity.id);
  }
  for (const relation of ironAgeNearEastV6Data.temporalRelations) for (const participant of relation.participants) {
    if (!isEntityRelationParticipant(participant)) continue;
    assert.equal(phases.get(participant.phaseId)?.entityId, participant.subject.id, participant.phaseId);
    assert.equal(phases.get(participant.phaseId)?.relationIds.includes(relation.id), true, relation.id);
  }
  for (const phase of ironAgeNearEastV6Data.entityPhases) for (const relationId of phase.relationIds) {
    const relation = relations.get(relationId);
    assert.ok(relation, relationId);
    assert.equal(relation.participants.some(participant => isEntityRelationParticipant(participant) && participant.phaseId === phase.id), true, phase.id);
  }
});

test('the isolated Iron Age Near East module passes the V6 validator', () => {
  const core = createV6KnowledgeCore([ironAgeNearEastV6Data], { sources: V6_SOURCES, regions: REGIONS });
  const result = validateV6KnowledgeCore(core);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.deepEqual(result.errors, []);
});

test('religious stories do not invent dates and Aramaic uses local document witnesses', () => {
 assert.deepEqual(ironAgeNearEastV6Data.entities.find(e => e.id === 'ancient-israelite-tradition')?.phaseIds, []);
 const language = ironAgeNearEastV6Data.entityPhases.filter(p => p.entityId === 'aramaic-language');
 assert.deepEqual(language.map(p => [p.timeSpan.start, p.timeSpan.end, p.regions.map(r => r.regionId)]), [
   [-950, -300, ['syria-northern-levant']], [-500, -300, ['southern-levant']],
   [-800, -300, ['upper-mesopotamia']], [-500, -400, ['iranian-plateau']]
 ]);
 assert.deepEqual(ironAgeNearEastV6Data.events.map(e => e.id), ['event-lachish-captured']);
});
