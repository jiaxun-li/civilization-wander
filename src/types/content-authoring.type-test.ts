import type {
  ContentModule,
  ContentModuleCollectionMap,
  HistoricalFactClaim
} from './runtime.ts';

const invalidFactKind: HistoricalFactClaim = {
  id: 'type-test-fact',
  // @ts-expect-error Claim kinds are closed discriminants.
  kind: 'historicalFcat',
  text: 'This fixture must remain rejected by TypeScript.',
  sourceIds: ['type-test-source']
};

const invalidFactField: HistoricalFactClaim = {
  id: 'type-test-extra-field',
  kind: 'historicalFact',
  text: 'This fixture must remain rejected by TypeScript.',
  sourceIds: ['type-test-source'],
  // @ts-expect-error Unknown Claim fields must fail before runtime validation.
  defensiveAside: 'not part of the V5 Claim contract'
};

const invalidSources: ContentModuleCollectionMap['sources'] = [{
  id: 'type-test-source',
  title: 'Type-test source',
  // @ts-expect-error Source fields are an exact authoring contract.
  inventedLicenseField: 'not part of the runtime Source schema'
}];

// @ts-expect-error A content module must provide all fourteen collections.
const incompleteModule: ContentModule = { sources: invalidSources };

void invalidFactKind;
void invalidFactField;
void incompleteModule;
