import { readdirSync, readFileSync } from 'node:fs';

import { atlasData } from '../../src/data/atlas-data.ts';
import type { MigrationCoverageBundle } from './validate-migration-coverage.ts';

function readJsonDirectory(name: string): unknown[] {
  const directory = new URL(`../migration/${name}/`, import.meta.url);
  return readdirSync(directory)
    .filter(file => file.endsWith('.json'))
    .sort()
    .map(file => JSON.parse(readFileSync(new URL(file, directory), 'utf8')));
}

export function loadCurrentMigrationCoverageBundle(): MigrationCoverageBundle {
  return {
    source: {
      entityIds: atlasData.entities.map(item => item.id),
      eventIds: atlasData.events.map(item => item.id),
      sceneIds: atlasData.scenes.map(item => item.id),
      structuralEdgeIds: atlasData.structuralEdges.map(item => item.id)
    },
    entityDecisionLedgers: readJsonDirectory('entity-decisions'),
    eventDecisionLedgers: readJsonDirectory('event-decisions'),
    scenePhaseLedgers: readJsonDirectory('scene-phase'),
    edgeDecisionLedgers: readJsonDirectory('edge-decisions'),
    relationCandidateLedgers: readJsonDirectory('relation-candidates')
  };
}
