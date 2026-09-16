import type {
  ConceptLayerId,
  Entity,
  EntityType,
  EventKind
} from '../../../v6/schema/index.ts';
import type { KnowledgeSpaceMarkKind, PresenceMode } from '../model/types.ts';

export type VisualizationEntityType = EntityType;

type EntityMarkPolicy = KnowledgeSpaceMarkKind | 'conceptualCulturalTradition';

export const ENTITY_MARK_POLICIES = {
  person: 'trace',
  polity: 'block',
  community: 'block',
  institution: 'block',
  culturalTradition: 'conceptualCulturalTradition',
  settlement: 'trace',
  archaeologicalSite: 'trace',
  naturalFeature: 'trace',
  geographicRegion: 'trace',
  commodity: 'crayonStrip',
  artifactClass: 'crayonStrip',
  monument: 'trace',
  technology: 'crayonStrip',
  productionSystem: 'crayonStrip',
  tradeNetwork: 'crayonStrip',
  language: 'crayonStrip',
  writingSystem: 'trace',
  documentCorpus: 'crayonStrip',
  literaryWork: 'node',
  literaryTradition: 'crayonStrip',
  artisticTradition: 'crayonStrip',
  religiousTradition: 'crayonStrip',
  philosophicalTradition: 'crayonStrip',
  mythicTradition: 'crayonStrip'
} as const satisfies Record<VisualizationEntityType, EntityMarkPolicy>;

export const PERVASIVE_PRESENCE_ENTITY_TYPES = [
  'language',
  'writingSystem',
  'religiousTradition'
] as const satisfies readonly EntityType[];

export function supportsPervasivePresence(entityType: EntityType): boolean {
  return (PERVASIVE_PRESENCE_ENTITY_TYPES as readonly EntityType[]).includes(entityType);
}

export function defaultEntityMarkKind(entity: {
  readonly type: VisualizationEntityType;
  readonly conceptLayerId: ConceptLayerId;
}): KnowledgeSpaceMarkKind {
  const policy = ENTITY_MARK_POLICIES[entity.type];

  if (policy === 'conceptualCulturalTradition') {
    return entity.conceptLayerId === 'polityAndSociety' ? 'block' : 'crayonStrip';
  }

  return policy;
}

export function eventMarkKind(eventKind: EventKind): 'node' | 'trace' {
  switch (eventKind) {
    case 'historicalEvent':
      return 'node';
    case 'historicalProcess':
      return 'trace';
    default: {
      const exhaustive: never = eventKind;
      return exhaustive;
    }
  }
}

export function applyPresenceMode(
  baseKind: KnowledgeSpaceMarkKind,
  presenceMode: PresenceMode
): KnowledgeSpaceMarkKind {
  // Presence remains evidence metadata; it no longer creates a field mark.
  void presenceMode;
  return baseKind;
}

export type KnowledgeSpaceEntity = Omit<Entity, 'type'> & {
  readonly type: VisualizationEntityType;
};
