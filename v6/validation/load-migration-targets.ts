import { readdirSync, readFileSync } from 'node:fs';

import type { V6KnowledgeCore } from '../schema/index.ts';
import type { MigrationTargetBundle } from './validate-migration-targets.ts';
import { V6_PENDING_HISTORICAL_PROCESSES } from '../module-registry.ts';

function readJsonDirectory(name: string): unknown[] {
  const directory = new URL(`../migration/${name}/`, import.meta.url);
  return readdirSync(directory)
    .filter(file => file.endsWith('.json'))
    .sort()
    .map(file => JSON.parse(readFileSync(new URL(file, directory), 'utf8')));
}

function readModuleBaselines(): unknown[] {
  const excluded = new Set([
    'atlas-v5-summary.json',
    'drift-report.json',
    'sources-v5.json'
  ]);
  const directory = new URL('../migration/baseline/', import.meta.url);
  return readdirSync(directory)
    .filter(file => file.endsWith('.json') && !excluded.has(file))
    .sort()
    .map(file => JSON.parse(readFileSync(new URL(file, directory), 'utf8')));
}

/** Load the frozen, read-only migration ledgers for target validation. */
export function loadMigrationTargetBundle(core: V6KnowledgeCore): MigrationTargetBundle {
  return {
    core,
    pendingHistoricalProcesses: V6_PENDING_HISTORICAL_PROCESSES,
    baselineLedgers: readModuleBaselines(),
    entityDecisionLedgers: readJsonDirectory('entity-decisions'),
    eventDecisionLedgers: readJsonDirectory('event-decisions'),
    scenePhaseLedgers: readJsonDirectory('scene-phase'),
    edgeDecisionLedgers: readJsonDirectory('edge-decisions'),
    relationCandidateLedgers: readJsonDirectory('relation-candidates'),
    handoffLedgers: readJsonDirectory('handoffs')
  };
}
