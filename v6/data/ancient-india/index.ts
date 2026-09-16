import type { V6KnowledgeModule } from '../../knowledge-core.ts';
import { ancientIndiaEntities, ancientIndiaEntityPhases } from './entities.ts';
import { ancientIndiaEvents } from './events.ts';
export { ancientIndiaPendingHistoricalProcesses } from './events.ts';
import { ancientIndiaTemporalRelations } from './relations.ts';

// Shared Sources, Regions, and the declared Mesopotamia dependency are supplied
// by V6 integration. This module never imports V5 data or duplicates external
// Entity/Phase objects at runtime.
export const ancientIndiaV6Data = {
  entities: ancientIndiaEntities,
  entityPhases: ancientIndiaEntityPhases,
  events: ancientIndiaEvents,
  temporalRelations: ancientIndiaTemporalRelations
} as const satisfies V6KnowledgeModule;
