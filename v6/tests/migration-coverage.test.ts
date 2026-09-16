import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import {
  EXPECTED_V5_BASELINE_COUNTS,
  loadCurrentMigrationCoverageBundle,
  validateMigrationCoverage
} from '../validation/index.ts';
import type { MigrationCoverageBundle } from '../validation/index.ts';

function realBundle(): MigrationCoverageBundle {
  return loadCurrentMigrationCoverageBundle();
}

test('the completed migration ledgers cover the frozen V5 baseline with no pending records', () => {
  const result = validateMigrationCoverage(realBundle());
  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  assert.equal(result.complete, true);
  assert.deepEqual(result.pending, []);
  assert.deepEqual(
    {
      entities: result.counts.entities,
      events: result.counts.events,
      scenes: result.counts.scenes,
      structuralEdges: result.counts.structuralEdges
    },
    EXPECTED_V5_BASELINE_COUNTS
  );
});

test('coverage rejects a missing migration decision', () => {
  const bundle = structuredClone(realBundle()) as any;
  bundle.entityDecisionLedgers[0].decisions.pop();
  assert.match(validateMigrationCoverage(bundle).errors.join('\n'), /missing migration record/);
});

test('coverage rejects duplicate decisions and baseline count drift', () => {
  const duplicate = structuredClone(realBundle()) as any;
  duplicate.eventDecisionLedgers[0].decisions.push(duplicate.eventDecisionLedgers[0].decisions[0]);
  assert.match(validateMigrationCoverage(duplicate).errors.join('\n'), /duplicates migration coverage/);

  const drift = structuredClone(realBundle()) as any;
  drift.source.sceneIds.pop();
  assert.match(validateMigrationCoverage(drift).errors.join('\n'), /frozen V5 baseline count 297/);
});

test('RelationCandidate ledgers are non-runtime and unresolved only', () => {
  const bundle = structuredClone(realBundle()) as any;
  bundle.relationCandidateLedgers[0].runtimeCollection = true;
  bundle.relationCandidateLedgers[0].candidates.push({
    candidate: {
      id: 'candidate-invalid',
      status: 'promoted',
      reasons: ['inventedReason'],
      sourceSceneIds: [],
      participants: [],
      summary: 'invalid fixture',
      unresolvedQuestions: [],
      sourceIds: []
    },
    audit: {
      sourceModule: 'data/mesopotamia.ts',
      originatingPhaseCandidateIds: [],
      sourceEventIds: [],
      sourceStructuralEdgeIds: []
    }
  });
  const errors = validateMigrationCoverage(bundle).errors.join('\n');
  assert.match(errors, /runtimeCollection.*must equal false/);
  assert.match(errors, /status.*must equal unresolved/);
  assert.match(errors, /unknown RelationCandidate reason/);
});

test('one V5 StructuralEdge may split into two or more unique TemporalRelations', () => {
  const validSplit = structuredClone(realBundle()) as any;
  const decision = validSplit.edgeDecisionLedgers[0].decisions[0];
  decision.status = 'accepted';
  decision.acceptedDisposition = {
    kind: 'split',
    relationIds: ['relation-phase-one', 'relation-phase-two']
  };
  assert.deepEqual(validateMigrationCoverage(validSplit).errors, []);

  const tooShort = structuredClone(validSplit) as any;
  tooShort.edgeDecisionLedgers[0].decisions[0].acceptedDisposition.relationIds = ['relation-only'];
  assert.match(
    validateMigrationCoverage(tooShort).errors.join('\n'),
    /split must contain at least two TemporalRelation IDs/
  );

  const duplicate = structuredClone(validSplit) as any;
  duplicate.edgeDecisionLedgers[0].decisions[0].acceptedDisposition.relationIds = [
    'relation-duplicate',
    'relation-duplicate'
  ];
  assert.match(
    validateMigrationCoverage(duplicate).errors.join('\n'),
    /split TemporalRelation IDs must be unique/
  );
});

test('one V5 Entity may convert to a V6 Event only with a non-empty Event ID', () => {
  const validConversion = structuredClone(realBundle()) as any;
  const decision = validConversion.entityDecisionLedgers[0].decisions[0];
  decision.status = 'accepted';
  decision.acceptedDisposition = {
    kind: 'convertedToEvent',
    eventId: 'event-battle-of-kadesh'
  };
  assert.deepEqual(validateMigrationCoverage(validConversion).errors, []);

  const missingEventId = structuredClone(validConversion) as any;
  missingEventId.entityDecisionLedgers[0].decisions[0].acceptedDisposition.eventId = '';
  assert.match(
    validateMigrationCoverage(missingEventId).errors.join('\n'),
    /convertedToEvent must provide a non-empty V6 Event ID/
  );
});

test('baseline generator preserves reviewed Mesopotamia Scene dispositions on consecutive runs', () => {
  const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url));
  const generatorPath = fileURLToPath(new URL('../migration/generate-baseline.ts', import.meta.url));
  const ledgerPath = fileURLToPath(new URL(
    '../migration/scene-phase/mesopotamia.json',
    import.meta.url
  ));
  const readDispositions = (): unknown[] => {
    const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8')) as {
      scenePhaseSignals: { v5SceneId: string; disposition: unknown }[];
    };
    assert.equal(ledger.scenePhaseSignals.length, 58);
    return ledger.scenePhaseSignals.map(signal => ({
      v5SceneId: signal.v5SceneId,
      disposition: signal.disposition
    }));
  };

  const before = readDispositions();
  assert.equal(before.some(value => (value as any).disposition.kind === 'needsReview'), false);
  for (let run = 0; run < 2; run += 1) {
    const result = spawnSync(process.execPath, [generatorPath], {
      cwd: repositoryRoot,
      encoding: 'utf8'
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.deepEqual(readDispositions(), before);
  }
});
