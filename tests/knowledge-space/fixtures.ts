import type {
  Entity,
  EntityPhase,
  Event,
  Region,
  Source
} from '../../v6/schema/index.ts';
import type { KnowledgeSpaceModelInput } from '../../src/knowledge-space/model/index.ts';

export const fixtureSources = [
  { id: 'source-one', title: 'Source one' },
  { id: 'source-two', title: 'Source two' }
] as const satisfies readonly Source[];

export const fixtureRegions = [
  { id: 'macro-a', name: '大区甲', displayOrder: 100, sourceIds: [] },
  { id: 'a-one', name: '甲一', parentRegionId: 'macro-a', displayOrder: 110, sourceIds: [] },
  { id: 'a-two', name: '甲二', parentRegionId: 'macro-a', displayOrder: 120, sourceIds: [] },
  { id: 'macro-b', name: '大区乙', displayOrder: 200, sourceIds: [] }
] as const satisfies readonly Region[];

export const fixtureEntities = [
  {
    id: 'polity-one',
    type: 'polity',
    name: '甲王国',
    canonicalSummary: '测试政权。',
    conceptLayerId: 'polityAndSociety',
    phaseIds: ['polity-phase'],
    sourceIds: ['source-one']
  },
  {
    id: 'language-one',
    type: 'language',
    name: '甲语言',
    canonicalSummary: '测试语言。',
    conceptLayerId: 'languageAndKnowledge',
    phaseIds: ['language-phase'],
    sourceIds: ['source-one']
  },
  {
    id: 'work-one',
    type: 'literaryWork',
    name: '《甲史诗》',
    canonicalSummary: '测试文学作品。',
    conceptLayerId: 'artAndLiterature',
    phaseIds: ['work-phase'],
    sourceIds: ['source-one']
  },
  {
    id: 'city-one',
    type: 'settlement',
    name: '甲城',
    canonicalSummary: '测试聚落。',
    conceptLayerId: 'placeAndSite',
    phaseIds: ['city-phase'],
    sourceIds: ['source-one']
  }
] as const satisfies readonly Entity[];

export const fixturePhases = [
  {
    id: 'polity-phase',
    entityId: 'polity-one',
    title: '甲王国延续',
    timeSpan: { start: -100, end: -50, label: '前100—前50年' },
    regions: [{ regionId: 'a-one', role: 'core', approximate: false, sourceIds: ['source-one'] }],
    relationIds: [],
    sourceIds: ['source-one']
  },
  {
    id: 'language-phase',
    entityId: 'language-one',
    title: '甲语言传播',
    timeSpan: { start: -90, end: -10, label: '约前90—前10年', approximate: true },
    regions: [
      { regionId: 'a-one', role: 'core', approximate: false, sourceIds: ['source-one'] },
      { regionId: 'a-two', role: 'influence', approximate: true, sourceIds: ['source-one'] }
    ],
    relationIds: [],
    sourceIds: ['source-one']
  },
  {
    id: 'work-phase',
    entityId: 'work-one',
    title: '《甲史诗》形成',
    timeSpan: { start: -75, end: -65, label: '约前75—前65年', approximate: true },
    regions: [{ regionId: 'macro-a', role: 'associated', approximate: true, sourceIds: ['source-one'] }],
    relationIds: [],
    sourceIds: ['source-one']
  },
  {
    id: 'city-phase',
    entityId: 'city-one',
    title: '甲城延续',
    timeSpan: { start: -120, end: -20, label: '前120—前20年' },
    regions: [{ regionId: 'a-two', role: 'attested', approximate: false, sourceIds: ['source-one'] }],
    relationIds: [],
    sourceIds: ['source-one']
  }
] as const satisfies readonly EntityPhase[];

const emptyReview = {
  limitationClaimIds: [],
  counterexampleClaimIds: [],
  uncertaintyClaimIds: [],
  alternativeExplanationClaimIds: [],
  sourceIds: ['source-one']
} as const;

export const fixtureEvents = [
  {
    id: 'event-one',
    kind: 'historicalEvent',
    conceptLayerId: 'eventAndConflict',
    title: '甲战役发生',
    timeSpan: { start: -60, end: -60, label: '前60年' },
    regions: [{ regionId: 'a-one', role: 'attested', approximate: false, sourceIds: ['source-one'] }],
    participants: [],
    evidence: [],
    editorialReview: emptyReview,
    sourceIds: ['source-one']
  },
  {
    id: 'process-one',
    kind: 'historicalProcess',
    conceptLayerId: 'technologyAndExchange',
    title: '甲迁徙持续',
    timeSpan: { start: -55, end: -35, label: '约前55—前35年', approximate: true },
    regions: [{ regionId: 'a-two', role: 'associated', approximate: true, sourceIds: ['source-one'] }],
    participants: [],
    evidence: [],
    editorialReview: emptyReview,
    sourceIds: ['source-one']
  }
] as const satisfies readonly Event[];

export const fixtureInput: KnowledgeSpaceModelInput = {
  sources: fixtureSources,
  regions: fixtureRegions,
  entities: fixtureEntities,
  entityPhases: fixturePhases,
  events: fixtureEvents
};
