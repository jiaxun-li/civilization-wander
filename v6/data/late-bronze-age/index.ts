import type { V6KnowledgeModule } from '../../knowledge-core.ts';
import { lateBronzeAgeEntities, lateBronzeAgeEntityPhases } from './entities.ts';
import { lateBronzeAgeEvents } from './events.ts';
export { lateBronzeAgePendingHistoricalProcesses } from './events.ts';
import { lateBronzeAgeTemporalRelations } from './relations.ts';

// Shared catalogs and declared Mesopotamia/Egypt dependencies are supplied by
// integration. This module owns only its five stable Entities and related
// structural records; it does not duplicate cross-module objects.
export const lateBronzeAgeV6Data = {
  entities: lateBronzeAgeEntities,
  entityPhases: lateBronzeAgeEntityPhases,
  events: lateBronzeAgeEvents,
  temporalRelations: lateBronzeAgeTemporalRelations
} as const satisfies V6KnowledgeModule;
