import type { V6KnowledgeModule } from '../../knowledge-core.ts';
import { mesopotamiaEntities, mesopotamiaEntityPhases } from './entities.ts';
import { mesopotamiaEvents } from './events.ts';
export { mesopotamiaPendingHistoricalProcesses } from './events.ts';
import { mesopotamiaTemporalRelations } from './relations.ts';

// Sources and Regions are shared catalogs supplied by V6 integration. This
// module never live-imports V5 data or duplicates shared catalogs.
export const mesopotamiaV6Data = {
  entities: mesopotamiaEntities,
  entityPhases: mesopotamiaEntityPhases,
  events: mesopotamiaEvents,
  temporalRelations: mesopotamiaTemporalRelations
} as const satisfies V6KnowledgeModule;
