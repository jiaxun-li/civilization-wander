import type { V6KnowledgeModule } from '../../knowledge-core.ts';
import { ancientEgyptEntities, ancientEgyptEntityPhases } from './entities.ts';
import { ancientEgyptEvents } from './events.ts';
export { ancientEgyptPendingHistoricalProcesses } from './events.ts';
import { ancientEgyptTemporalRelations } from './relations.ts';

// Shared Sources and Regions are supplied only by V6 integration. The module
// contains structure-approved knowledge data and never imports V5 at runtime.
export const ancientEgyptV6Data = {
  entities: ancientEgyptEntities,
  entityPhases: ancientEgyptEntityPhases,
  events: ancientEgyptEvents,
  temporalRelations: ancientEgyptTemporalRelations
} as const satisfies V6KnowledgeModule;
