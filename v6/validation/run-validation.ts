import { currentV6KnowledgeCore } from '../knowledge-core.ts';
import { validateV6KnowledgeCore } from './validate-core.ts';
import { loadMigrationTargetBundle } from './load-migration-targets.ts';
import { validateMigrationTargets } from './validate-migration-targets.ts';

const coreResult = validateV6KnowledgeCore(currentV6KnowledgeCore);
const targetResult = validateMigrationTargets(
  loadMigrationTargetBundle(currentV6KnowledgeCore)
);
const valid = coreResult.valid && targetResult.valid;

console.log(JSON.stringify({
  schemaVersion: 6,
  mode: 'structure-only',
  valid,
  counts: coreResult.counts,
  migrationTargets: targetResult.counts,
  errors: [
    ...coreResult.errors.map(error => `core: ${error}`),
    ...targetResult.errors.map(error => `migrationTargets: ${error}`)
  ]
}, null, 2));

if (!valid) process.exitCode = 1;
