export const CONCEPT_LAYER_IDS = [
  'materialAndArchitecture',
  'placeAndSite',
  'eventAndConflict',
  'polityAndSociety',
  'technologyAndExchange',
  'languageAndKnowledge',
  'artAndLiterature',
  'religionAndThought'
] as const;

export type ConceptLayerId = typeof CONCEPT_LAYER_IDS[number];

export type ConceptLayerOrder = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ConceptLayerDefinition {
  readonly id: ConceptLayerId;
  readonly label: string;
  readonly order: ConceptLayerOrder;
  readonly description: string;
}
