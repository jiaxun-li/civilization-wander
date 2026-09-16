import { loadCurrentMigrationCoverageBundle } from './load-migration-coverage.ts';
import { validateMigrationCoverage } from './validate-migration-coverage.ts';
import { V6_PENDING_HISTORICAL_PROCESSES } from '../module-registry.ts';

const requireComplete = process.argv.includes('--require-complete');
const verbose = process.argv.includes('--verbose');
const result = validateMigrationCoverage(loadCurrentMigrationCoverageBundle());
const pendingByKind = Object.fromEntries(
  ['entity', 'event', 'edge', 'scene'].map(kind => [
    kind,
    result.pending.filter(item => item.startsWith(`${kind}:`)).length
  ])
);

console.log(JSON.stringify({
  sourceSchemaVersion: 5,
  targetSchemaVersion: 6,
  valid: result.valid,
  complete: result.complete,
  counts: result.counts,
  pendingCount: result.pending.length,
  pendingByKind,
  pendingPreview: verbose ? result.pending : result.pending.slice(0, 20),
  pendingTruncated: !verbose && result.pending.length > 20,
  reviewQueue: {
    historicalProcesses: V6_PENDING_HISTORICAL_PROCESSES.length
  },
  errors: result.errors
}, null, 2));

if (!result.valid || (requireComplete && !result.complete)) process.exitCode = 1;
