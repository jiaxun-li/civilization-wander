import type { V6KnowledgeModule } from '../../knowledge-core.ts';
import { aegeanEntities, aegeanEntityPhases } from './entities.ts';
import { aegeanEvents } from './events.ts';
export { aegeanPendingHistoricalProcesses } from './events.ts';
import { aegeanTemporalRelations } from './relations.ts';

export const aegeanV6Data = {
  entities: aegeanEntities,
  entityPhases: aegeanEntityPhases,
  events: aegeanEvents,
  temporalRelations: aegeanTemporalRelations
} as const satisfies V6KnowledgeModule;
