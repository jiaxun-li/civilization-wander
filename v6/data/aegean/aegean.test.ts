import { V6_SOURCES } from '../../catalogs/sources.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { aegeanData as v5Aegean } from '../../../data/aegean.ts';
import { lateBronzeAgeData as v5LateBronzeAge } from '../../../data/late-bronze-age.ts';
import { REGIONS } from '../../catalogs/regions.ts';
import { createV6KnowledgeCore, type V6KnowledgeModule } from '../../knowledge-core.ts';
import type { EntityPhase, RelationParticipant, TemporalRelation } from '../../schema/index.ts';
import { validateV6KnowledgeCore } from '../../validation/validate-core.ts';
import { aegeanPendingHistoricalProcesses, aegeanV6Data } from './index.ts';

const naturalEarthSource = {
  id: 'source-natural-earth', title: 'Natural Earth 1:50m Physical Vectors', author: 'Natural Earth', year: 2025,
  publisher: 'Natural Earth', url: 'https://www.naturalearthdata.com/downloads/50m-physical-vectors/'
};

const hittiteDependencyFixture = {
  entities: [{
    id: 'hittite-empire', type: 'polity', name: '赫梯帝国', alternativeNames: ['Hittite Empire'],
    canonicalSummary: '仅用于隔离验证 Aegean 模块的已声明跨包依赖。', conceptLayerId: 'polityAndSociety',
    phaseIds: ['hittite-syrian-control'], tags: ['外部依赖测试'],
    sourceIds: ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa']
  }],
  entityPhases: [{
    id: 'hittite-syrian-control', entityId: 'hittite-empire', title: '晚期帝国阶段',
    timeSpan: { start: -1300, end: -1200, label: '约公元前1300—前1200年', approximate: true },
    regions: [
      { regionId: 'central-anatolia', role: 'core', approximate: true, sourceIds: ['source-british-museum-alaksandu-wilusa'] },
      { regionId: 'western-anatolia', role: 'influence', approximate: true, sourceIds: ['source-cambridge-hittite-troy'] }
    ],
    relationIds: [], sourceIds: ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa']
  }],
  events: [], temporalRelations: []
} as const satisfies V6KnowledgeModule;

const isEntityParticipant = (participant: RelationParticipant): participant is Extract<RelationParticipant, { subject: { kind: 'entity' } }> => participant.subject.kind === 'entity';

test('Aegean V6 exposes only the four module-owned structural collections', () => {
  assert.deepEqual(Object.keys(aegeanV6Data).sort(), ['entities', 'entityPhases', 'events', 'temporalRelations']);
  assert.equal(aegeanV6Data.entities.length, 11);
  assert.equal(aegeanV6Data.entityPhases.length, 13);
  assert.equal(aegeanV6Data.events.length, 1);
  assert.equal(aegeanV6Data.temporalRelations.length, 3);
  for (const forbidden of ['cards', 'scenes', 'assets', 'navigationOptions', 'mapStates']) {
    assert.equal(Object.hasOwn(aegeanV6Data, forbidden), false, forbidden);
  }
});

test('Aegean historical processes remain pending rather than entering the accepted core', () => {
  assert.equal(aegeanPendingHistoricalProcesses.length, 6);
  assert.equal(
    aegeanPendingHistoricalProcesses.every(review => review.candidate.kind === 'historicalProcess'),
    true
  );
  assert.equal(aegeanV6Data.events.some(event => event.kind === 'historicalProcess'), false);
});

test('epics remain single approximate work nodes without oral-propagation identities', () => {
  const entityIds = new Set<string>(aegeanV6Data.entities.map(entity => entity.id));
  for (const id of ['greek-heroic-tradition', 'iliad-oral-tradition', 'odyssey-oral-tradition']) {
    assert.equal(entityIds.has(id), false, id);
  }
  assert.equal(aegeanV6Data.entities.find(entity => entity.id === 'greek-divine-tradition')?.type, 'religiousTradition');
  for (const id of ['iliad-text', 'odyssey-text']) {
    const entity = aegeanV6Data.entities.find(candidate => candidate.id === id);
    assert.equal(entity?.type, 'literaryWork');
    assert.equal(entity?.phaseIds.length, 1);
    const phase = aegeanV6Data.entityPhases.find(candidate => candidate.entityId === id);
    assert.deepEqual(phase?.timeSpan, { start: -700, end: -700, label: '约公元前700年', approximate: true });
    assert.equal(phase?.regions.length, 1);
    assert.equal(phase?.regions[0]?.role, 'associated');
    assert.equal(phase?.regions[0]?.regionId, 'aegean-islands');
    assert.deepEqual(phase?.relationIds, []);
  }
  assert.equal(aegeanV6Data.events.some(event => /iliad|odyssey|heroic/.test(event.id)), false);
});

test('Troy remains an archaeological site and Wilusa is not fabricated as a runtime Entity', () => {
  assert.equal(aegeanV6Data.entities.find(entity => entity.id === 'troy-archaeological-site')?.type, 'archaeologicalSite');
  assert.equal(aegeanV6Data.entities.some(entity => entity.id.includes('wilusa')), false);
  assert.equal(
    aegeanV6Data.entityPhases.some(phase => String(phase.id) === 'troy-post-bronze-age-site-memory'),
    false
  );
  assert.equal(
    aegeanV6Data.entityPhases.some(phase => String(phase.id) === 'minoan-postpalatial-continuity'),
    false
  );
});

test('mythic plots and retired transmission Scenes remain narrative-only', () => {
  const ledgerPath = fileURLToPath(new URL('../../migration/scene-phase/aegean.json', import.meta.url));
  const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8')) as { scenePhaseSignals: { disposition: { kind: string } }[] };
  assert.equal(ledger.scenePhaseSignals.length, 50);
  assert.equal(ledger.scenePhaseSignals.filter(signal => signal.disposition.kind === 'narrativeOnly').length, 33);
  assert.equal(ledger.scenePhaseSignals.some(signal => signal.disposition.kind === 'needsReview'), false);
});

test('Entity phase ownership and formal relation back-references are exact', () => {
  const phases = new Map<string, EntityPhase>(aegeanV6Data.entityPhases.map(phase => [phase.id, phase]));
  const relations = new Map<string, TemporalRelation>(aegeanV6Data.temporalRelations.map(relation => [relation.id, relation]));
  for (const entity of aegeanV6Data.entities) {
    assert.deepEqual(aegeanV6Data.entityPhases.filter(phase => phase.entityId === entity.id).map(phase => phase.id), [...entity.phaseIds], entity.id);
  }
  for (const relation of aegeanV6Data.temporalRelations) {
    for (const participant of relation.participants) {
      if (!isEntityParticipant(participant)) continue;
      assert.equal(phases.get(participant.phaseId)?.entityId, participant.subject.id, participant.phaseId);
      assert.equal(phases.get(participant.phaseId)?.relationIds.includes(relation.id), true, `${participant.phaseId} -> ${relation.id}`);
    }
  }
  for (const phase of aegeanV6Data.entityPhases) {
    for (const relationId of phase.relationIds) {
      const relation = relations.get(relationId);
      assert.ok(relation, relationId);
      assert.equal(relation.participants.some(participant => isEntityParticipant(participant) && participant.phaseId === phase.id), true, `${relationId} -> ${phase.id}`);
    }
  }
});

test('the isolated Aegean module passes with its declared Hittite dependency fixture', () => {
  const dependencySources = [...new Map(
    [...v5Aegean.sources, ...v5LateBronzeAge.sources].map(source => [source.id, source])
  ).values()];
  const core = createV6KnowledgeCore([aegeanV6Data, hittiteDependencyFixture], {
    sources: V6_SOURCES, regions: REGIONS
  });
  const result = validateV6KnowledgeCore(core);
  assert.equal(result.valid, true, result.errors.join('\n'));
});

test('review removes summary destruction events and never treats the Troy site as a treaty signatory', () => {
  const ids = new Set<string>(aegeanV6Data.events.map(event => event.id));
  assert.equal(ids.has('event-mycenaean-palaces-end'), false);
  assert.equal(ids.has('event-troy-vi-viia-destruction'), false);
  const treaty = aegeanV6Data.events.find(event => event.id === 'event-hittite-wilusa-treaty');
  assert.ok(treaty);
  assert.equal(treaty.participants.some(p => p.entityId === 'troy-archaeological-site'), false);
  assert.match(treaty.timeSpan.label ?? '', /定年范围/);
  const phases = aegeanV6Data.entityPhases.filter(phase => phase.entityId === 'greek-divine-tradition');
  assert.equal(phases.length, 1);
  assert.deepEqual(phases.flatMap(phase => phase.regions.map(region => region.regionId)), ['greek-mainland']);
});
