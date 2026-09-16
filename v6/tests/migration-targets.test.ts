import assert from 'node:assert/strict';
import test from 'node:test';

import type { V6KnowledgeCore } from '../schema/index.ts';
import {
  EXPECTED_V6_MIGRATION_HANDOFF_COUNT,
  type MigrationTargetBundle,
  validateMigrationTargets
} from '../validation/index.ts';

const MODULES = [
  'data/module-a.ts',
  'data/module-b.ts',
  'data/module-c.ts',
  'data/module-d.ts',
  'data/module-e.ts',
  'data/module-f.ts',
  'data/module-g.ts'
] as const;

function validCore(): V6KnowledgeCore {
  return {
    schemaVersion: 6,
    sources: [
      { id: 'source-a', title: 'Source A' },
      { id: 'source-b', title: 'Source B' }
    ],
    regions: [
      { id: 'region-a', name: 'Region A', displayOrder: 1, sourceIds: ['source-a'] }
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
        timeSpan: { start: -1000, end: -900, label: 'A phase' },
        regions: [{ regionId: 'region-a', role: 'core', approximate: false, sourceIds: ['source-a'] }],
        relationIds: ['relation-a-b'],
        sourceIds: ['source-a']
      },
      {
        id: 'phase-b',
        entityId: 'entity-b',
        timeSpan: { start: -980, end: -880, label: 'B phase' },
        regions: [{ regionId: 'region-a', role: 'attested', approximate: true, sourceIds: ['source-b'] }],
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
        timeSpan: { start: -950, end: -950, label: 'Event A' },
        regions: [{ regionId: 'region-a', role: 'associated', approximate: true, sourceIds: ['source-a'] }],
        participants: [{ entityId: 'entity-a', phaseId: 'phase-a', role: 'participant', sourceIds: ['source-a'] }],
        evidence: [{ v5ClaimBlockId: 'claim-a', sourceIds: ['source-a'] }],
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
          { subject: { kind: 'entity', id: 'entity-a' }, phaseId: 'phase-a', role: 'actor', viewLabel: 'acts on', sourceIds: ['source-a'] },
          { subject: { kind: 'entity', id: 'entity-b' }, phaseId: 'phase-b', role: 'counterparty', viewLabel: 'is affected by', sourceIds: ['source-b'] }
        ],
        timeSpan: { start: -950, end: -920, label: 'Relation A–B' },
        summary: 'A sourced relation.',
        sourceIds: ['source-a', 'source-b']
      }
    ]
  };
}

function checks(): Record<string, true> {
  return {
    baselineGenerated: true,
    entityDecisionsComplete: true,
    eventDecisionsComplete: true,
    phasesReviewed: true,
    edgeDecisionsComplete: true,
    relationCandidatesReviewed: true
  };
}

function validBundle(): MigrationTargetBundle {
  return {
    core: validCore(),
    pendingHistoricalProcesses: [],
    baselineLedgers: MODULES.map((sourceModule, index) => ({
      baselineVersion: 1,
      sourceSchemaVersion: 5,
      sourceModule,
      counts: {
        entities: index === 0 ? 1 : 0,
        events: index === 0 ? 1 : 0,
        scenes: index === 0 ? 1 : 0,
        structuralEdges: index === 0 ? 1 : 0
      },
      entities: index === 0 ? [{ id: 'v5-entity-a' }] : [],
      events: index === 0 ? [{ id: 'v5-event-a' }] : [],
      scenes: index === 0 ? [{ id: 'v5-scene-a' }] : [],
      structuralEdges: index === 0 ? [{ id: 'v5-edge-a' }] : []
    })),
    entityDecisionLedgers: MODULES.map((sourceModule, index) => ({
      ledgerVersion: 1,
      sourceModule,
      decisions: index === 0 ? [{
        entityId: 'v5-entity-a',
        acceptedPhaseIds: ['phase-a'],
        acceptedDisposition: { kind: 'migrated', entityId: 'entity-a' },
        status: 'accepted'
      }] : []
    })),
    eventDecisionLedgers: MODULES.map((sourceModule, index) => ({
      ledgerVersion: 1,
      sourceModule,
      decisions: index === 0 ? [{
        eventId: 'v5-event-a',
        acceptedDisposition: { kind: 'migratedAsEvent', eventId: 'event-a' },
        status: 'accepted'
      }] : []
    })),
    scenePhaseLedgers: MODULES.map((sourceModule, index) => ({
      ledgerVersion: 1,
      sourceModule,
      scenePhaseSignals: index === 0 ? [{
        id: 'signal-a',
        v5SceneId: 'v5-scene-a',
        entitySignals: [{ entityId: 'v5-entity-a' }],
        disposition: { kind: 'mapped', phaseIds: ['phase-a'] }
      }] : []
    })),
    edgeDecisionLedgers: MODULES.map((sourceModule, index) => ({
      ledgerVersion: 1,
      sourceModule,
      decisions: index === 0 ? [{
        structuralEdgeId: 'v5-edge-a',
        acceptedDisposition: { kind: 'migrated', relationId: 'relation-a-b' },
        status: 'accepted'
      }] : []
    })),
    relationCandidateLedgers: MODULES.map((sourceModule, index) => ({
      ledgerVersion: 1,
      runtimeCollection: false,
      sourceModule,
      candidates: index === 0 ? [{
        candidate: {
          id: 'candidate-a',
          participants: [
            {
              kind: 'knownSubject',
              subject: { kind: 'entity', id: 'entity-a' },
              proposedPhaseId: 'phase-a'
            },
            { kind: 'unresolvedSubject', label: 'Unknown', notes: 'Not stable.' }
          ]
        },
        audit: { sourceModule }
      }] : []
    })),
    handoffLedgers: MODULES.map((sourceModule, index) => ({
      handoffVersion: 1,
      sourceModule,
      status: 'readyForIntegration',
      coverage: {
        entities: index === 0 ? 1 : 0,
        events: index === 0 ? 1 : 0,
        scenes: index === 0 ? 1 : 0,
        structuralEdges: index === 0 ? 1 : 0
      },
      scenePhaseSignalCount: index === 0 ? 1 : 0,
      entitySignalCount: index === 0 ? 1 : 0,
      unresolvedRelationCandidateCount: index === 0 ? 1 : 0,
      checks: checks()
    }))
  };
}

function mutableBundle(): Record<string, any> {
  return structuredClone(validBundle()) as Record<string, any>;
}

test('a final migration bundle resolves every ledger target and all seven handoffs', () => {
  const result = validateMigrationTargets(validBundle());
  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  assert.equal(result.counts.handoffs, EXPECTED_V6_MIGRATION_HANDOFF_COUNT);
});

test('converted, split, candidate, and event-only dispositions resolve by their own semantics', () => {
  const converted = mutableBundle();
  converted.entityDecisionLedgers[0].decisions[0].acceptedPhaseIds = [];
  converted.entityDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'convertedToEvent', eventId: 'event-a' };
  converted.eventDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'convertedToEntity', entityId: 'entity-a' };
  converted.edgeDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'candidate', candidateId: 'candidate-a' };
  converted.scenePhaseLedgers[0].scenePhaseSignals[0].disposition = { kind: 'eventOnly', eventIds: ['event-a'] };
  assert.equal(validateMigrationTargets(converted as MigrationTargetBundle).valid, true);

  const split = mutableBundle();
  split.entityDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'split', intoEntityIds: ['entity-a', 'entity-b'] };
  split.eventDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'split', eventIds: ['event-a'], entityIds: ['entity-b'] };
  split.edgeDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'split', relationIds: ['relation-a-b'] };
  split.scenePhaseLedgers[0].scenePhaseSignals[0].disposition = { kind: 'merged', phaseId: 'phase-a' };
  assert.equal(validateMigrationTargets(split as MigrationTargetBundle).valid, true);
});

test('a V5 historicalProcess may resolve to a quarantined pending review without entering core Events', () => {
  const pending = mutableBundle();
  const candidate = structuredClone(pending.core.events[0]);
  candidate.id = 'process-a';
  candidate.kind = 'historicalProcess';
  pending.pendingHistoricalProcesses = [{
    id: 'process-a',
    status: 'pending',
    reason: 'Needs identity review.',
    candidate
  }];
  pending.eventDecisionLedgers[0].decisions[0].oldKind = 'historicalProcess';
  pending.eventDecisionLedgers[0].decisions[0].acceptedDisposition = {
    kind: 'migratedAsEvent',
    eventId: 'process-a'
  };
  pending.scenePhaseLedgers[0].scenePhaseSignals[0].disposition = {
    kind: 'eventOnly',
    eventIds: ['process-a']
  };
  const result = validateMigrationTargets(pending as MigrationTargetBundle);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(result.counts.pendingHistoricalProcesses, 1);
});

test('missing Entity, Event, Relation, Scene, and Candidate targets all fail closed', () => {
  const invalid = mutableBundle();
  invalid.entityDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'merged', intoEntityId: 'missing-entity' };
  invalid.eventDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'migratedAsEvent', eventId: 'missing-event' };
  invalid.edgeDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'representedByEvent', eventId: 'missing-edge-event' };
  invalid.scenePhaseLedgers[0].scenePhaseSignals[0].disposition = { kind: 'mapped', phaseIds: ['missing-phase'] };
  invalid.relationCandidateLedgers[0].candidates[0].candidate.participants[0].subject.id = 'missing-candidate-entity';
  const errors = validateMigrationTargets(invalid as MigrationTargetBundle).errors.join('\n');
  assert.match(errors, /missing V6 Entity missing-entity/);
  assert.match(errors, /missing V6 accepted Event or pending historical process missing-event/);
  assert.match(errors, /missing V6 accepted Event or pending historical process missing-edge-event/);
  assert.match(errors, /missing V6 EntityPhase missing-phase/);
  assert.match(errors, /missing V6 Entity missing-candidate-entity/);
});

test('accepted phases and Candidate proposed phases must belong to their target Entity', () => {
  const invalid = mutableBundle();
  invalid.entityDecisionLedgers[0].decisions[0].acceptedPhaseIds = ['phase-b'];
  invalid.relationCandidateLedgers[0].candidates[0].candidate.participants[0].proposedPhaseId = 'phase-b';
  const errors = validateMigrationTargets(invalid as MigrationTargetBundle).errors.join('\n');
  assert.match(errors, /acceptedPhaseIds.*must belong to one of the migration target Entities/);
  assert.match(errors, /proposedPhaseId.*must belong to Entity entity-a/);

  const converted = mutableBundle();
  converted.entityDecisionLedgers[0].decisions[0].acceptedDisposition = { kind: 'convertedToEvent', eventId: 'event-a' };
  assert.match(
    validateMigrationTargets(converted as MigrationTargetBundle).errors.join('\n'),
    /acceptedPhaseIds.*must be empty when an Entity is converted to an Event/
  );
});

test('handoffs must be complete and agree with frozen per-module baselines and ledgers', () => {
  const invalid = mutableBundle();
  invalid.handoffLedgers[0].status = 'notStarted';
  invalid.handoffLedgers[0].coverage.entities = 2;
  invalid.handoffLedgers[0].checks.phasesReviewed = false;
  invalid.handoffLedgers.pop();
  const errors = validateMigrationTargets(invalid as MigrationTargetBundle).errors.join('\n');
  assert.match(errors, /missing ledger for data\/module-g\.ts/);
  assert.match(errors, /exactly 7 module handoffs/);
  assert.match(errors, /status.*readyForIntegration/);
  assert.match(errors, /coverage\.entities.*frozen baseline count 1/);
  assert.match(errors, /checks\.phasesReviewed.*must equal true/);
});

test('malformed target bundles report errors instead of throwing', () => {
  const invalid = mutableBundle();
  invalid.entityDecisionLedgers = null;
  assert.doesNotThrow(() => validateMigrationTargets(invalid as MigrationTargetBundle));
  const result = validateMigrationTargets(invalid as MigrationTargetBundle);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /entityDecisionLedgers: must be an array/);
});
