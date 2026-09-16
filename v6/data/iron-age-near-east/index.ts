import type { V6KnowledgeModule } from '../../knowledge-core.ts';
import { ironAgeNearEastEntities, ironAgeNearEastEntityPhases } from './entities.ts';
import { ironAgeNearEastEvents } from './events.ts';
export { ironAgeNearEastPendingHistoricalProcesses } from './events.ts';
import { ironAgeNearEastTemporalRelations } from './relations.ts';

export const ironAgeNearEastV6Data = { entities: ironAgeNearEastEntities, entityPhases: ironAgeNearEastEntityPhases, events: ironAgeNearEastEvents, temporalRelations: ironAgeNearEastTemporalRelations } as const satisfies V6KnowledgeModule;
