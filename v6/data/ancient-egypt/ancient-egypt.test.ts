import { V6_SOURCES } from '../../catalogs/sources.ts';
import test from 'node:test';
import assert from 'node:assert/strict';

import { ancientEgyptData as v5AncientEgypt } from '../../../data/ancient-egypt.ts';
import { REGIONS } from '../../catalogs/regions.ts';
import { createV6KnowledgeCore, type V6KnowledgeModule } from '../../knowledge-core.ts';
import type { EntityPhase, RelationParticipant, TemporalRelation } from '../../schema/index.ts';
import { validateV6KnowledgeCore } from '../../validation/validate-core.ts';
import { ancientEgyptV6Data } from './index.ts';
import { ancientEgyptPendingHistoricalProcesses } from './events.ts';

const naturalEarthSource = {
  id: 'source-natural-earth',
  title: 'Natural Earth 1:50m Physical Vectors',
  author: 'Natural Earth',
  year: 2025,
  publisher: 'Natural Earth',
  url: 'https://www.naturalearthdata.com/downloads/50m-physical-vectors/'
};

// Explicit module-level dependency fixture. This is not exported by the Egypt
// module and is not an Ancient Egypt placeholder Entity. The Late Bronze Age
// module must provide the same stable Entity/Phase IDs before full integration.
const hittiteDependencyFixture = {
  entities: [{
    id: 'hittite-empire',
    type: 'polity',
    name: '赫梯帝国',
    alternativeNames: ['Hittite Empire'],
    canonicalSummary: '仅用于隔离验证埃及模块跨包引用的外部依赖。',
    conceptLayerId: 'polityAndSociety',
    phaseIds: ['hittite-syrian-control'],
    tags: ['外部依赖测试'],
    sourceIds: ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii']
  }],
  entityPhases: [{
    id: 'hittite-syrian-control',
    entityId: 'hittite-empire',
    title: '卡迭石战争与后续埃及—赫梯外交阶段',
    timeSpan: { start: -1300, end: -1200, label: '约公元前1300—前1200年', approximate: true },
    regions: [
      {
        regionId: 'central-anatolia',
        role: 'core',
        approximate: true,
        sourceIds: ['source-hayes-scepter-ii']
      },
      {
        regionId: 'syria-northern-levant',
        role: 'controlled',
        approximate: true,
        sourceIds: ['source-bm-kadesh-sallier']
      }
    ],
    relationIds: [],
    sourceIds: ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii', 'source-un-egypt-hatti-treaty']
  }],
  events: [],
  temporalRelations: []
} as const satisfies V6KnowledgeModule;

const isEntityRelationParticipant = (
  participant: RelationParticipant
): participant is Extract<RelationParticipant, { subject: { kind: 'entity' } }> =>
  participant.subject.kind === 'entity';

test('Ancient Egypt V6 migrates only the four module-owned structural collections', () => {
  assert.deepEqual(Object.keys(ancientEgyptV6Data).sort(), [
    'entities',
    'entityPhases',
    'events',
    'temporalRelations'
  ]);
  assert.equal(ancientEgyptV6Data.entities.length, 11);
  assert.equal(ancientEgyptV6Data.entityPhases.length, 15);
  assert.equal(ancientEgyptV6Data.events.length, 4);
  assert.equal(ancientEgyptPendingHistoricalProcesses.length, 10);
  assert.equal(ancientEgyptV6Data.events.every(event => event.kind === 'historicalEvent'), true);
  assert.equal(
    ancientEgyptPendingHistoricalProcesses.every(review => review.status === 'pending'),
    true
  );
  assert.equal(ancientEgyptV6Data.temporalRelations.length, 2);
  for (const forbidden of ['cards', 'scenes', 'assets', 'navigationOptions', 'mapStates']) {
    assert.equal(Object.hasOwn(ancientEgyptV6Data, forbidden), false, forbidden);
  }
});

test('textual-tradition Events become stable Entities and do not enter the V6 Event collection', () => {
  const eventIds = new Set(ancientEgyptV6Data.events.map(event => event.id));
  assert.equal(eventIds.has('event-sinuhe-story-composed-and-copied'), false);
  assert.equal(eventIds.has('event-egyptian-funerary-texts-and-rituals-expand'), false);
  assert.equal(ancientEgyptV6Data.entities.some(entity => String(entity.id) === 'sinuhe-literary-tradition'), false);
  assert.equal(ancientEgyptV6Data.entities.find(entity => entity.id === 'sinuhe-work')?.type, 'literaryWork');
  assert.equal(
    ancientEgyptV6Data.entityPhases.find(phase => phase.id === 'sinuhe-work-formation')?.entityId,
    'sinuhe-work'
  );
  assert.equal(ancientEgyptV6Data.entities.some(entity => String(entity.id) === 'egyptian-funerary-text-corpora'), false);
  assert.equal(
    ancientEgyptV6Data.entityPhases.filter(phase => String(phase.entityId) === 'egyptian-funerary-text-corpora').length,
    0
  );
});

test('Sinuhe keeps one approximate composition node and no copying phases', () => {
  const workPhases = ancientEgyptV6Data.entityPhases.filter(phase => phase.entityId === 'sinuhe-work');
  assert.equal(workPhases.length, 1);
  assert.deepEqual(workPhases[0]?.timeSpan, { start: -1850, end: -1850, label: '约公元前1850年', approximate: true });
  assert.equal(workPhases[0]?.regions.length, 1);
  assert.equal(workPhases[0]?.regions[0]?.role, 'associated');
  assert.deepEqual(workPhases[0]?.relationIds, []);
  for (const id of ['sinuhe-middle-kingdom-composition', 'sinuhe-scribal-transmission']) {
    assert.equal(ancientEgyptV6Data.entityPhases.some(phase => String(phase.id) === id), false, id);
  }
});

test('reviewed Egyptian culture uses scoped evidence ranges and removes unsupported parallel placements', () => {
  const writing = ancientEgyptV6Data.entityPhases.filter(phase => phase.entityId === 'egyptian-hieroglyphs');
  assert.equal(writing.length, 1);
  assert.deepEqual(writing[0]?.regions.map(region => region.regionId), ['nile-valley']);
  assert.deepEqual([writing[0]?.timeSpan.start, writing[0]?.timeSpan.end], [-3250, 394]);
  assert.equal(writing[0]?.sourceIds.includes('source-bm-hieroglyphs-decipherment'), true);
  const art = ancientEgyptV6Data.entityPhases.filter(phase => phase.entityId === 'egyptian-art');
  assert.equal(art.length, 1);
  assert.deepEqual(art[0]?.regions.map(region => region.regionId), ['nile-valley']);
  assert.deepEqual([art[0]?.timeSpan.start, art[0]?.timeSpan.end], [-2700, -1100]);
  const belief = ancientEgyptV6Data.entities.find(entity => entity.id === 'egyptian-religion');
  assert.equal(belief?.name, '古埃及丧葬信仰');
  assert.match(belief?.canonicalSummary ?? '', /金字塔文、棺材文和《死者之书》/);
});

test('Avaris is an attested Delta attack and Unas has no deleted corpus participant', () => {
  const attack = ancientEgyptV6Data.events.find(event => event.id === 'event-ahmose-captures-avaris');
  assert.deepEqual(attack?.regions.map(region => [region.regionId, region.role]), [['nile-delta', 'attested']]);
  assert.ok(attack?.sourceIds.includes('source-oeaw-avaris'));
  const inscription = ancientEgyptV6Data.events.find(event => event.id === 'event-unas-pyramid-text-inscription');
  assert.ok(inscription);
  assert.equal(inscription.participants.some(participant => participant.entityId === 'egyptian-funerary-text-corpora'), false);
});

test('broad civilization and Nile-continuity placeholders stay out of the accepted knowledge core', () => {
  const entityIds = new Set<string>(ancientEgyptV6Data.entities.map(entity => entity.id));
  const phaseIds = new Set<string>(ancientEgyptV6Data.entityPhases.map(phase => phase.id));
  assert.equal(
    ancientEgyptV6Data.events.some(event => event.id === 'event-nile-annual-cycle-organizes-life'),
    false
  );
  assert.equal(entityIds.has('ancient-egypt-civilization'), false);
  assert.equal(phaseIds.has('ancient-egypt-nile-state-continuity'), false);
});

test('wonder is migrated to monument and Egyptian religion remains a tradition rather than a ritual institution', () => {
  assert.equal(ancientEgyptV6Data.entities.find(entity => entity.id === 'egypt-pyramids')?.type, 'monument');
  assert.equal(ancientEgyptV6Data.entities.find(entity => entity.id === 'egyptian-religion')?.type, 'religiousTradition');
  assert.equal(ancientEgyptV6Data.entities.some(entity => entity.id.includes('nile-transport')), false);
  assert.equal(ancientEgyptV6Data.entities.some(entity => entity.id.includes('ritual-institution')), false);
});

test('Entity phase ownership and TemporalRelation back-references are exact', () => {
  const phases = new Map<string, EntityPhase>(
    ancientEgyptV6Data.entityPhases.map(phase => [phase.id, phase])
  );
  const relations = new Map<string, TemporalRelation>(
    ancientEgyptV6Data.temporalRelations.map(relation => [relation.id, relation])
  );

  for (const entity of ancientEgyptV6Data.entities) {
    assert.ok(entity.phaseIds.length > 0, entity.id);
    assert.deepEqual(
      ancientEgyptV6Data.entityPhases.filter(phase => phase.entityId === entity.id).map(phase => phase.id),
      [...entity.phaseIds],
      entity.id
    );
  }

  for (const phase of ancientEgyptV6Data.entityPhases) {
    assert.equal(Object.hasOwn(phase, 'conceptLayerId'), false, phase.id);
    assert.doesNotMatch(phase.title, /长期延续|持续重组|继续存在/);
  }

  const phaseIds = new Set<string>(ancientEgyptV6Data.entityPhases.map(phase => phase.id));
  assert.equal(phaseIds.has('egypt-pyramids-inscription-and-cult'), false);
  assert.equal(phaseIds.has('egyptian-hieroglyphs-late-script-transformation'), false);

  for (const relation of ancientEgyptV6Data.temporalRelations) {
    for (const participant of relation.participants) {
      if (!isEntityRelationParticipant(participant)) continue;
      const phase = phases.get(participant.phaseId);
      assert.equal(phase?.entityId, participant.subject.id, participant.phaseId);
      assert.equal(phase?.relationIds.includes(relation.id), true, `${participant.phaseId} -> ${relation.id}`);
    }
  }

  assert.equal(relations.has('relation-egyptian-funerary-corpora-religion'), false);

  for (const phase of ancientEgyptV6Data.entityPhases) {
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

test('the isolated Ancient Egypt module passes the V6 validator with its declared external dependency', () => {
  const core = createV6KnowledgeCore([ancientEgyptV6Data, hittiteDependencyFixture], {
    sources: V6_SOURCES,
    regions: REGIONS
  });
  const result = validateV6KnowledgeCore(core);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.deepEqual(result.errors, []);
});
