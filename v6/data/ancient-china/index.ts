import type { V6KnowledgeModule } from '../../knowledge-core.ts';
import { ancientChinaEntities, ancientChinaEntityPhases } from './entities.ts';
import { ancientChinaEvents } from './events.ts';
export { ancientChinaPendingHistoricalProcesses } from './events.ts';
import { ancientChinaTemporalRelations } from './relations.ts';

export const ancientChinaV6Data = {
  entities: ancientChinaEntities,
  entityPhases: ancientChinaEntityPhases,
  events: ancientChinaEvents,
  temporalRelations: ancientChinaTemporalRelations
} as const satisfies V6KnowledgeModule;
