export const ENTITY_TYPES = [
  'person',
  'polity',
  'community',
  'institution',
  'culturalTradition',
  'settlement',
  'archaeologicalSite',
  'naturalFeature',
  'geographicRegion',
  'commodity',
  'artifactClass',
  'monument',
  'technology',
  'productionSystem',
  'tradeNetwork',
  'language',
  'writingSystem',
  'documentCorpus',
  'literaryWork',
  'literaryTradition',
  'artisticTradition',
  'religiousTradition',
  'philosophicalTradition',
  'mythicTradition'
] as const;

export type EntityType = typeof ENTITY_TYPES[number];
