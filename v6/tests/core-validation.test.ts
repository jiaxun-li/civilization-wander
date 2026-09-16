import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EMPTY_V6_KNOWLEDGE_MODULE,
  assertV6KnowledgeModule,
  createV6KnowledgeCore,
  emptyV6KnowledgeCore
} from '../knowledge-core.ts';
import type { V6KnowledgeCore } from '../schema/index.ts';
import { validateV6KnowledgeCore } from '../validation/index.ts';

function validFixture(): V6KnowledgeCore {
  return {
    schemaVersion: 6,
    sources: [
      { id: 'source-a', title: 'Source A' },
      { id: 'source-b', title: 'Source B' }
    ],
    regions: [
      {
        id: 'region-a',
        name: 'Region A',
        displayOrder: 100,
        sourceIds: ['source-a']
      }
    ],
    entities: [
      {
        id: 'entity-a',
        type: 'polity',
        name: 'Entity A',
        canonicalSummary: 'Entity A summary.',
        conceptLayerId: 'polityAndSociety',
        phaseIds: ['phase-a'],
        sourceIds: ['source-a']
      },
      {
        id: 'entity-b',
        type: 'institution',
        name: 'Entity B',
        canonicalSummary: 'Entity B summary.',
        conceptLayerId: 'polityAndSociety',
        phaseIds: ['phase-b'],
        sourceIds: ['source-b']
      }
    ],
    entityPhases: [
      {
        id: 'phase-a',
        entityId: 'entity-a',
        timeSpan: { start: -1000, end: -900, label: '前1000—前900年' },
        regions: [
          { regionId: 'region-a', role: 'core', approximate: false, sourceIds: ['source-a'] }
        ],
        relationIds: ['relation-a-b'],
        sourceIds: ['source-a']
      },
      {
        id: 'phase-b',
        entityId: 'entity-b',
        timeSpan: { start: -980, end: -880, label: '前980—前880年' },
        regions: [
          { regionId: 'region-a', role: 'attested', approximate: true, sourceIds: ['source-b'] }
        ],
        relationIds: ['relation-a-b'],
        sourceIds: ['source-b']
      }
    ],
    events: [
      {
        id: 'event-a',
        kind: 'historicalEvent',
        conceptLayerId: 'eventAndConflict',
        title: 'Event A',
        timeSpan: { start: -950, end: -950, label: '约前950年', approximate: true },
        regions: [
          { regionId: 'region-a', role: 'associated', approximate: true, sourceIds: ['source-a'] }
        ],
        participants: [
          { entityId: 'entity-a', phaseId: 'phase-a', role: 'participant', sourceIds: ['source-a'] }
        ],
        evidence: [
          { v5ClaimBlockId: 'claim-a', sourceIds: ['source-a'] }
        ],
        editorialReview: {
          limitationClaimIds: ['review-a'],
          counterexampleClaimIds: [],
          uncertaintyClaimIds: [],
          alternativeExplanationClaimIds: [],
          sourceIds: ['source-a']
        },
        sourceIds: ['source-a']
      }
    ],
    temporalRelations: [
      {
        id: 'relation-a-b',
        family: 'political',
        type: 'testRelation',
        orientation: 'directed',
        participants: [
          {
            subject: { kind: 'entity', id: 'entity-a' },
            phaseId: 'phase-a',
            role: 'actor',
            viewLabel: 'acts on',
            sourceIds: ['source-a']
          },
          {
            subject: { kind: 'entity', id: 'entity-b' },
            phaseId: 'phase-b',
            role: 'counterparty',
            viewLabel: 'is affected by',
            sourceIds: ['source-b']
          }
        ],
        timeSpan: { start: -950, end: -920, label: '前950—前920年' },
        summary: 'A sourced relation.',
        sourceIds: ['source-a', 'source-b']
      }
    ]
  };
}

function mutableFixture(): Record<string, any> {
  return structuredClone(validFixture()) as Record<string, any>;
}

test('the empty V6 core and exact empty module boundary are valid', () => {
  assert.equal(validateV6KnowledgeCore(emptyV6KnowledgeCore).valid, true);
  assert.doesNotThrow(() => assertV6KnowledgeModule(EMPTY_V6_KNOWLEDGE_MODULE));
  assert.equal(validateV6KnowledgeCore(createV6KnowledgeCore([EMPTY_V6_KNOWLEDGE_MODULE])).valid, true);
  assert.throws(
    () => assertV6KnowledgeModule({ ...EMPTY_V6_KNOWLEDGE_MODULE, sources: [] }),
    /unknown collection sources/
  );
  assert.throws(
    () => assertV6KnowledgeModule({ entities: [], entityPhases: [], events: [] }),
    /missing required collection temporalRelations/
  );
});

test('a complete V6 structural fixture passes', () => {
  assert.deepEqual(validateV6KnowledgeCore(validFixture()).errors, []);
});

test('the core rejects wrong versions, extra collections, and RelationCandidate leakage', () => {
  const wrongVersion = mutableFixture();
  wrongVersion.schemaVersion = 5;
  assert.match(validateV6KnowledgeCore(wrongVersion).errors.join('\n'), /schemaVersion.*must equal 6/);

  const candidateLeak = mutableFixture();
  candidateLeak.relationCandidates = [];
  assert.match(validateV6KnowledgeCore(candidateLeak).errors.join('\n'), /relationCandidates.*unknown collection/);
});

test('the core rejects invalid Entity classification and broken Entity-Phase ownership', () => {
  const invalid = mutableFixture();
  invalid.entities[0].type = 'war';
  invalid.entities[0].conceptLayerId = 'secondaryLayer';
  invalid.entityPhases[0].entityId = 'entity-b';
  const errors = validateV6KnowledgeCore(invalid).errors.join('\n');
  assert.match(errors, /unknown EntityType/);
  assert.match(errors, /unknown ConceptLayerId/);
  assert.match(errors, /does not match owning Entity/);
});

test('a stable Entity may remain without a fabricated EntityPhase', () => {
  const withoutPhase = mutableFixture();
  withoutPhase.entities[1].phaseIds = [];
  withoutPhase.entityPhases = withoutPhase.entityPhases.filter((phase: any) => phase.id !== 'phase-b');
  withoutPhase.entities[0].phaseIds = [];
  withoutPhase.entityPhases = [];
  withoutPhase.events = [];
  withoutPhase.temporalRelations = [];
  assert.equal(validateV6KnowledgeCore(withoutPhase).valid, true);
});

test('adjacent EntityPhases must represent a changed spatial state', () => {
  const repeatedPolity = mutableFixture();
  repeatedPolity.entities[0].phaseIds.push('phase-a-late');
  repeatedPolity.entityPhases.push({
    ...structuredClone(repeatedPolity.entityPhases[0]),
    id: 'phase-a-late',
    title: 'Narrative late period',
    timeSpan: { start: -900, end: -850, label: '前900—前850年' },
    regions: [{
      ...structuredClone(repeatedPolity.entityPhases[0].regions[0]),
      role: 'associated'
    }],
    relationIds: []
  });
  assert.match(
    validateV6KnowledgeCore(repeatedPolity).errors.join('\n'),
    /repeats the spatial state.*merge narrative-only stages/
  );

  const changedFootprint = structuredClone(repeatedPolity);
  changedFootprint.regions.push({
    id: 'region-b',
    name: 'Region B',
    displayOrder: 200,
    sourceIds: ['source-a']
  });
  changedFootprint.entityPhases.at(-1).regions.push({
    regionId: 'region-b',
    role: 'controlled',
    approximate: true,
    sourceIds: ['source-a']
  });
  assert.equal(
    validateV6KnowledgeCore(changedFootprint).errors.some(error => error.includes('repeats the spatial state')),
    false
  );
});

test('the core rejects a missing or unknown Event concept layer', () => {
  const missing = mutableFixture();
  delete missing.events[0].conceptLayerId;
  assert.match(
    validateV6KnowledgeCore(missing).errors.join('\n'),
    /events\[0\].conceptLayerId: is required/
  );

  const unknown = mutableFixture();
  unknown.events[0].conceptLayerId = 'automaticEventLayer';
  assert.match(
    validateV6KnowledgeCore(unknown).errors.join('\n'),
    /events\[0\].conceptLayerId.*unknown ConceptLayerId/
  );
});

test('the core rejects Region cycles and duplicate sibling display order', () => {
  const invalid = mutableFixture();
  invalid.regions.push({
    id: 'region-b',
    name: 'Region B',
    parentRegionId: 'region-a',
    displayOrder: 100,
    sourceIds: []
  });
  invalid.regions.push({
    id: 'region-c',
    name: 'Region C',
    parentRegionId: 'region-a',
    displayOrder: 100,
    sourceIds: []
  });
  invalid.regions[0].parentRegionId = 'region-b';
  const errors = validateV6KnowledgeCore(invalid).errors.join('\n');
  assert.match(errors, /parent cycle/);
  assert.match(errors, /duplicates sibling/);
});

test('group-only Regions cannot be used as spatial associations', () => {
  const invalid = mutableFixture();
  invalid.regions[0].associationPolicy = 'groupOnly';
  const errors = validateV6KnowledgeCore(invalid).errors.join('\n');
  assert.match(errors, /group-only Region/);
});

test('the core rejects invalid Event participant, evidence, and review structure', () => {
  const invalid = mutableFixture();
  invalid.events[0].participants[0].phaseId = 'phase-b';
  invalid.events[0].evidence = [];
  invalid.events[0].editorialReview.limitationClaimIds = [];
  const errors = validateV6KnowledgeCore(invalid).errors.join('\n');
  assert.match(errors, /must belong to participant Entity/);
  assert.match(errors, /evidence.*must be a non-empty array/);
  assert.match(errors, /must retain at least one V5 review ClaimBlock reference/);
});

test('TemporalRelation and EntityPhase must back-reference one another', () => {
  const missingBackref = mutableFixture();
  missingBackref.entityPhases[1].relationIds = [];
  assert.match(
    validateV6KnowledgeCore(missingBackref).errors.join('\n'),
    /must back-reference this TemporalRelation/
  );

  const wrongForwardRef = mutableFixture();
  wrongForwardRef.entityPhases[0].relationIds = ['event-a'];
  assert.match(
    validateV6KnowledgeCore(wrongForwardRef).errors.join('\n'),
    /references missing temporalRelations object event-a/
  );
});

test('Event participation only needs overlap with its bound EntityPhase', () => {
  const eventOnlyOverlaps = mutableFixture();
  eventOnlyOverlaps.events[0].timeSpan = {
    start: -1050,
    end: -950,
    label: '前1050—前950年'
  };
  assert.equal(validateV6KnowledgeCore(eventOnlyOverlaps).valid, true);
});

test('one Entity subject may use adjacent Phases whose union covers a TemporalRelation', () => {
  const adjacent = mutableFixture();
  adjacent.entities[0].type = 'institution';
  adjacent.entities[0].phaseIds = ['phase-a-early', 'phase-a-late'];
  adjacent.entityPhases[0] = {
    ...adjacent.entityPhases[0],
    id: 'phase-a-early',
    timeSpan: { start: -1000, end: -950, label: '前1000—前950年' }
  };
  adjacent.entityPhases.push({
    ...adjacent.entityPhases[0],
    id: 'phase-a-late',
    timeSpan: { start: -950, end: -900, label: '前950—前900年' },
    regions: [{ ...adjacent.entityPhases[0].regions[0], role: 'attested' }]
  });
  adjacent.temporalRelations[0].participants = [
    {
      ...adjacent.temporalRelations[0].participants[0],
      phaseId: 'phase-a-early'
    },
    {
      ...adjacent.temporalRelations[0].participants[0],
      phaseId: 'phase-a-late'
    },
    adjacent.temporalRelations[0].participants[1]
  ];
  adjacent.events[0].participants[0].phaseId = 'phase-a-early';
  const adjacentResult = validateV6KnowledgeCore(adjacent);
  assert.equal(adjacentResult.valid, true, adjacentResult.errors.join('\n'));

  const gap = structuredClone(adjacent);
  gap.entityPhases[0].timeSpan.end = -960;
  gap.entityPhases[2].timeSpan.start = -940;
  assert.match(
    validateV6KnowledgeCore(gap).errors.join('\n'),
    /phases must cover TemporalRelation timeSpan without gaps/
  );

  const tailOutside = structuredClone(adjacent);
  tailOutside.entityPhases[2].timeSpan.end = -930;
  assert.match(
    validateV6KnowledgeCore(tailOutside).errors.join('\n'),
    /phases must cover TemporalRelation timeSpan without gaps/
  );
});

test('historicalTransition permits non-overlapping before and after Phases inside one relation envelope', () => {
  const transition = mutableFixture();
  transition.temporalRelations[0].family = 'historicalTransition';
  transition.temporalRelations[0].timeSpan = {
    start: -1000,
    end: -880,
    label: '前1000—前880年'
  };
  transition.entityPhases[0].timeSpan = {
    start: -1000,
    end: -960,
    label: '前1000—前960年'
  };
  transition.entityPhases[1].timeSpan = {
    start: -920,
    end: -880,
    label: '前920—前880年'
  };
  transition.events[0].timeSpan = {
    start: -970,
    end: -970,
    label: '约前970年'
  };
  const transitionResult = validateV6KnowledgeCore(transition);
  assert.equal(transitionResult.valid, true, transitionResult.errors.join('\n'));
});

test('a TemporalRelation requires at least two different KnowledgeSubjects', () => {
  const invalid = mutableFixture();
  invalid.temporalRelations[0].participants[1] = {
    ...invalid.temporalRelations[0].participants[0]
  };
  assert.match(
    validateV6KnowledgeCore(invalid).errors.join('\n'),
    /at least two different KnowledgeSubjects/
  );
});

test('malformed nested values fail closed instead of throwing', () => {
  const invalid = mutableFixture();
  invalid.events[0].participants = [null];
  const result = validateV6KnowledgeCore(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.length > 0);
});
