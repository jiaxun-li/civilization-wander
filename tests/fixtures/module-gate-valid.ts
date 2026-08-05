  import type {
    ContentModule,
    ContentModuleCollectionMap,
    EditorialReview,
    HistoricalCaseClaim
  } from '../../src/types/runtime.ts';

  type Collection<Name extends keyof ContentModuleCollectionMap> = ContentModuleCollectionMap[Name];
  type CollectionItem<Name extends keyof ContentModuleCollectionMap> = Collection<Name>[number];

  const sources: Collection<'sources'> = [
    { id: 'fixture-source-a', title: 'Fixture source A' },
    { id: 'fixture-source-b', title: 'Fixture source B' }
  ];
  const entities: Collection<'entities'> = [
    {
      id: 'fixture-entity-a', type: 'person', name: '甲',
      canonicalSummary: '用于模块门禁成功路径的第一个稳定身份。',
      sourceIds: ['fixture-source-a']
    },
    {
      id: 'fixture-entity-b', type: 'person', name: '乙',
      canonicalSummary: '用于模块门禁成功路径的第二个稳定身份。',
      sourceIds: ['fixture-source-b']
    }
  ];

  function editorialReview(prefix: string, addressedBlockId: string): EditorialReview {
    return {
      limitations: [{
        id: `${prefix}-limitation`, kind: 'limitation',
        text: '这个测试材料只能证明门禁契约，不能支持真实历史结论。',
        addressesBlockIds: [addressedBlockId],
        sourceIds: ['fixture-source-b']
      }],
      counterexamples: [],
      uncertainties: [],
      alternativeExplanations: [],
      sourceIds: ['fixture-source-b']
    };
  }

  const events: Collection<'events'> = ['a', 'b'].map((letter): CollectionItem<'events'> => ({
    id: `fixture-event-${letter}`,
    kind: 'historicalEvent',
    title: `测试事件${letter.toUpperCase()}`,
    timeSpan: { start: 100, end: 100, label: '公元100年' },
    participantEntityIds: [`fixture-entity-${letter}`],
    evidenceBlocks: [{
      id: `fixture-event-${letter}-evidence`, kind: 'historicalFact',
      text: '这是一条有来源的门禁测试事实。',
      timeSpan: { start: 100, end: 100, label: '公元100年' },
      entityIds: [`fixture-entity-${letter}`],
      sourceIds: ['fixture-source-a']
    }],
    sourceIds: ['fixture-source-a'],
    editorialReview: editorialReview(
      `fixture-event-${letter}-review`,
      `fixture-event-${letter}-evidence`
    )
  }));

  function cases(letter: string): HistoricalCaseClaim[] {
    return [1, 2].map(number => ({
      id: `fixture-scene-${letter}-case-${number}`,
      kind: 'historicalCase',
      title: `证据组${number}`,
      text: '这是一组只用于验证完整 Card 结构的来源证据。',
      timeSpan: { start: 100, end: 100, label: '公元100年' },
      eventIds: [`fixture-event-${letter}`],
      entityIds: [`fixture-entity-${letter}`],
      sourceIds: [number === 1 ? 'fixture-source-a' : 'fixture-source-b']
    }));
  }

  const scenes: Collection<'scenes'> = ['a', 'b'].map((letter): CollectionItem<'scenes'> => ({
    id: `fixture-scene-${letter}`,
    title: `测试段落${letter.toUpperCase()}`,
    timeSpan: { start: 100, end: 100, label: '公元100年' },
    eventIds: [`fixture-event-${letter}`],
    contentBlocks: cases(letter),
    presentation: { kind: 'textOnly' },
    sourceIds: ['fixture-source-a', 'fixture-source-b']
  }));

  const cards: Collection<'cards'> = ['a', 'b'].map((letter): CollectionItem<'cards'> => ({
    id: `fixture-card-${letter}`,
    kind: 'historicalStory',
    primaryEntityId: `fixture-entity-${letter}`,
    relatedEntityIds: [],
    title: `测试故事${letter.toUpperCase()}`,
    editorialPurpose: '证明合法 staging 模块可以通过孤立门禁。',
    introduction: '一个仅用于自动测试的完整故事。',
    thesis: {
      text: '门禁成功路径必须由结构完整的内容证明。',
      sourceIds: ['fixture-source-a']
    },
    timeSpan: { start: 100, end: 100, label: '公元100年' },
    sceneIds: [`fixture-scene-${letter}`],
    sourceIds: ['fixture-source-a', 'fixture-source-b'],
    editorialReview: editorialReview(
      `fixture-card-${letter}-review`,
      `fixture-scene-${letter}-case-1`
    )
  }));

  const navigationOptions: Collection<'navigationOptions'> = [
    {
      id: 'fixture-navigation-a-to-b',
      target: { cardId: 'fixture-card-b', sceneId: 'fixture-scene-b' },
      basis: { kind: 'relatedCard', cardId: 'fixture-card-b' },
      label: '进入测试故事B',
      description: '从另一项完整 fixture 检查双向导航。'
    },
    {
      id: 'fixture-navigation-b-to-a',
      target: { cardId: 'fixture-card-a', sceneId: 'fixture-scene-a' },
      basis: { kind: 'relatedCard', cardId: 'fixture-card-a' },
      label: '进入测试故事A',
      description: '从另一项完整 fixture 检查双向导航。'
    }
  ];
  const navigationPlacements: Collection<'navigationPlacements'> = [
    {
      id: 'fixture-placement-a-to-b',
      navigationOptionId: 'fixture-navigation-a-to-b',
      owner: { kind: 'card', cardId: 'fixture-card-a' },
      slot: 'closing', rank: 1, visible: true, interactive: true
    },
    {
      id: 'fixture-placement-b-to-a',
      navigationOptionId: 'fixture-navigation-b-to-a',
      owner: { kind: 'card', cardId: 'fixture-card-b' },
      slot: 'closing', rank: 1, visible: true, interactive: true
    }
  ];

  export const fixtureData = {
    sources,
    entities,
    events,
    structuralEdges: [],
    cards,
    scenes,
    structureViews: [],
    navigationOptions,
    navigationPlacements,
    cameraPresets: [],
    mapStates: [],
    geometries: [],
    mapAnnotations: [],
    assets: []
  } satisfies ContentModule;
