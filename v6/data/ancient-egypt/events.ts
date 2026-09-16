import type {
  EditorialReviewReferences,
  EventKind,
  EventParticipant,
  RegionalAssociation,
  RegionalRole,
  SourceIds,
  TimeSpan
} from '../../schema/index.ts';
import {
  attachEventConceptLayers,
  quarantineHistoricalProcesses,
  type EventWithoutConceptLayer
} from '../event-concepts.ts';

function region(regionId: string, role: RegionalRole, sourceIds: SourceIds): RegionalAssociation {
  return { regionId, role, approximate: true, sourceIds };
}

function participant(
  entityId: string,
  phaseId: string,
  role: string,
  sourceIds: SourceIds,
  description?: string
): EventParticipant {
  return { entityId, phaseId, role, description, sourceIds };
}

interface ReviewIds {
  readonly limitation?: readonly string[];
  readonly counterexample?: readonly string[];
  readonly uncertainty?: readonly string[];
  readonly alternativeExplanation?: readonly string[];
}

function review(ids: ReviewIds, sourceIds: SourceIds): EditorialReviewReferences {
  return {
    limitationClaimIds: ids.limitation ?? [],
    counterexampleClaimIds: ids.counterexample ?? [],
    uncertaintyClaimIds: ids.uncertainty ?? [],
    alternativeExplanationClaimIds: ids.alternativeExplanation ?? [],
    sourceIds
  };
}

interface EventInput {
  readonly id: string;
  readonly kind: EventKind;
  readonly title: string;
  readonly timeSpan: TimeSpan;
  readonly regions: readonly RegionalAssociation[];
  readonly participants: readonly EventParticipant[];
  readonly evidenceId: string;
  readonly evidenceSourceIds: SourceIds;
  readonly reviewIds: ReviewIds;
  readonly reviewSourceIds: SourceIds;
  readonly sourceIds: SourceIds;
}

function event(input: EventInput): EventWithoutConceptLayer {
  return {
    id: input.id,
    kind: input.kind,
    title: input.title,
    timeSpan: input.timeSpan,
    regions: input.regions,
    participants: input.participants,
    evidence: [{ v5ClaimBlockId: input.evidenceId, sourceIds: input.evidenceSourceIds }],
    editorialReview: review(input.reviewIds, input.reviewSourceIds),
    sourceIds: input.sourceIds
  };
}

const ancientEgyptEventDefinitions = [
  event({
    id: 'event-upper-lower-egypt-unified',
    kind: 'historicalProcess',
    title: '上下埃及王权逐步统一',
    timeSpan: { start: -3300, end: -3050, label: '约公元前3300—前3050年', approximate: true },
    regions: [
      region('nile-valley', 'attested', ['source-ucl-narmer']),
      region('nile-delta', 'attested', ['source-ucl-narmer'])
    ],
    participants: [participant('ancient-egypt-civilization', 'ancient-egypt-royal-formation', 'formingRoyalOrder', ['source-ucl-narmer'])],
    evidenceId: 'event-upper-lower-egypt-unified-evidence',
    evidenceSourceIds: ['source-ucl-narmer'],
    reviewIds: { limitation: ['event-upper-lower-egypt-unified-process'] },
    reviewSourceIds: ['source-ucl-narmer'],
    sourceIds: ['source-ucl-narmer']
  }),
  event({
    id: 'event-old-kingdom-pyramid-complexes-develop',
    kind: 'historicalProcess',
    title: '古王国金字塔建筑群持续发展',
    timeSpan: { start: -2700, end: -2300, label: '约公元前2700—前2300年', approximate: true },
    regions: [region('nile-valley', 'attested', ['source-ucl-pyramid-shape', 'source-ucl-pyramids-overview', 'source-met-old-kingdom'])],
    participants: [
      participant('egypt-old-kingdom', 'egypt-old-kingdom-regional-presence', 'organizingPolity', ['source-met-old-kingdom']),
      participant('egypt-pyramids', 'egypt-pyramids-nile-presence', 'developingMonumentTradition', ['source-ucl-pyramid-shape']),
      participant('egypt-pyramids', 'egypt-pyramids-nile-presence', 'developingMonumentTradition', ['source-ucl-pyramids-overview']),
      participant('egypt-pyramids', 'egypt-pyramids-inscription-and-cult', 'developingMonumentTradition', ['source-ucl-pyramids-overview'])
    ],
    evidenceId: 'event-old-kingdom-pyramids-develop-evidence',
    evidenceSourceIds: ['source-ucl-pyramid-shape', 'source-ucl-pyramids-overview', 'source-met-old-kingdom'],
    reviewIds: { limitation: ['event-old-kingdom-pyramids-develop-methods'] },
    reviewSourceIds: ['source-ucl-pyramid-shape', 'source-ucl-pyramids-overview'],
    sourceIds: ['source-ucl-pyramid-shape', 'source-ucl-pyramids-overview', 'source-met-old-kingdom']
  }),
  event({
    id: 'event-egyptian-formal-art-conventions-persist',
    kind: 'historicalProcess',
    title: '古埃及正式艺术规则延续并被调整',
    timeSpan: { start: -2700, end: -1100, label: '约公元前2700—前1100年', approximate: true },
    regions: [
      region('nile-valley', 'attested', ['source-met-ancient-egypt-art', 'source-met-hatshepsut-publication', 'source-met-akhenaten-city']),
      region('nubia', 'attested', ['source-egypt-monuments-abu-simbel'])
    ],
    participants: [
      participant('egyptian-art', 'egyptian-art-formal-conventions', 'persistentVisualTradition', ['source-met-ancient-egypt-art', 'source-met-hatshepsut-publication', 'source-met-akhenaten-city'])
    ],
    evidenceId: 'event-egyptian-art-conventions-evidence',
    evidenceSourceIds: ['source-met-ancient-egypt-art', 'source-met-hatshepsut-publication', 'source-met-akhenaten-city'],
    reviewIds: { limitation: ['event-egyptian-art-conventions-context'] },
    reviewSourceIds: ['source-met-ancient-egypt-art', 'source-met-hatshepsut-publication'],
    sourceIds: ['source-met-ancient-egypt-art', 'source-met-hatshepsut-publication', 'source-met-akhenaten-city']
  }),
  event({
    id: 'event-egyptian-writing-system-changes',
    kind: 'historicalProcess',
    title: '埃及书写系统跨媒介与语言阶段变化',
    timeSpan: { start: -3150, end: 400, label: '约公元前3150—公元400年', approximate: true },
    regions: [
      region('nile-valley', 'attested', ['source-ucl-writing-development', 'source-ucl-hieratic', 'source-ucl-demotic', 'source-ucl-coptic']),
      region('nile-delta', 'attested', ['source-ucl-writing-development', 'source-ucl-demotic', 'source-ucl-coptic'])
    ],
    participants: [
      participant('egyptian-hieroglyphs', 'egyptian-hieroglyphs-monumental-and-cursive-use', 'changingWritingSystem', ['source-ucl-writing-development', 'source-ucl-hieroglyphic-system']),
      participant('egyptian-hieroglyphs', 'egyptian-hieroglyphs-late-script-transformation', 'transformingWritingSystem', ['source-ucl-demotic', 'source-ucl-coptic'])
    ],
    evidenceId: 'event-egyptian-writing-changes-evidence',
    evidenceSourceIds: ['source-ucl-writing-development', 'source-ucl-hieratic', 'source-ucl-demotic', 'source-ucl-coptic'],
    reviewIds: { limitation: ['event-egyptian-writing-changes-overlap'] },
    reviewSourceIds: ['source-ucl-writing-development', 'source-ucl-demotic', 'source-ucl-coptic'],
    sourceIds: ['source-ucl-writing-development', 'source-ucl-hieratic', 'source-ucl-demotic', 'source-ucl-coptic']
  }),
  event({
    id: 'event-old-kingdom-fragmentation',
    kind: 'historicalProcess',
    title: '古王国统一王权瓦解',
    timeSpan: { start: -2250, end: -2181, label: '约公元前23—前22世纪', approximate: true },
    regions: [
      region('nile-valley', 'associated', ['source-muller-old-kingdom-end']),
      region('nile-delta', 'associated', ['source-muller-old-kingdom-end'])
    ],
    participants: [participant('egypt-old-kingdom', 'egypt-old-kingdom-regional-presence', 'fragmentingPolity', ['source-muller-old-kingdom-end'])],
    evidenceId: 'event-old-kingdom-fragmentation-evidence',
    evidenceSourceIds: ['source-muller-old-kingdom-end'],
    reviewIds: {
      uncertainty: ['event-old-kingdom-fragmentation-weight'],
      alternativeExplanation: ['event-old-kingdom-fragmentation-causes']
    },
    reviewSourceIds: ['source-muller-old-kingdom-end'],
    sourceIds: ['source-muller-old-kingdom-end']
  }),
  {
  "id": "event-middle-kingdom-reunification",
  "kind": "historicalProcess",
  "title": "孟图霍特普二世重新统一埃及",
  "timeSpan": {
    "start": -2025,
    "end": -2025,
    "label": "约公元前2025年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-ucl-mentuhotep-ii",
        "source-ucl-middle-kingdom"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-ucl-mentuhotep-ii"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "egypt-middle-kingdom",
      "phaseId": "egypt-middle-kingdom-reunification",
      "role": "reunifyingPolity",
      "sourceIds": [
        "source-ucl-mentuhotep-ii",
        "source-ucl-middle-kingdom"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-middle-kingdom-reunification-evidence",
      "sourceIds": [
        "source-ucl-mentuhotep-ii",
        "source-ucl-middle-kingdom"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-middle-kingdom-reunification-process"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-ucl-mentuhotep-ii",
      "source-ucl-middle-kingdom"
    ]
  },
  "sourceIds": [
    "source-ucl-mentuhotep-ii",
    "source-ucl-middle-kingdom"
  ]
},
  {
  "id": "event-middle-kingdom-fragmentation",
  "kind": "historicalProcess",
  "title": "中王国统一王权结束",
  "timeSpan": {
    "start": -1700,
    "end": -1650,
    "label": "约公元前18—前17世纪",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "associated",
      "approximate": true,
      "sourceIds": [
        "source-met-middle-kingdom",
        "source-uee-second-intermediate"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "associated",
      "approximate": true,
      "sourceIds": [
        "source-ucl-second-intermediate",
        "source-uee-second-intermediate"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "egypt-middle-kingdom",
      "phaseId": "egypt-middle-kingdom-consolidated-order",
      "role": "fragmentingPolity",
      "sourceIds": [
        "source-met-middle-kingdom",
        "source-uee-second-intermediate"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-middle-kingdom-fragmentation-evidence",
      "sourceIds": [
        "source-met-middle-kingdom",
        "source-uee-second-intermediate"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-middle-kingdom-fragmentation-populations"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-ucl-second-intermediate",
      "source-uee-second-intermediate"
    ]
  },
  "sourceIds": [
    "source-met-middle-kingdom",
    "source-uee-second-intermediate"
  ]
},
  event({
    id: 'event-ahmose-captures-avaris',
    kind: 'historicalEvent',
    title: '雅赫摩斯攻下阿瓦里斯',
    timeSpan: { start: -1555, end: -1545, label: '约公元前1550年', approximate: true },
    regions: [region('nile-delta', 'attested', ['source-ucl-ahmose', 'source-oeaw-avaris'])],
    participants: [participant('egypt-new-kingdom', 'egypt-new-kingdom-reunification', 'reunifyingPolity', ['source-ucl-ahmose'], '攻取东部三角洲的阿瓦里斯，推动埃及重新统一；约前年份为定年范围，不表示攻城持续十年。')],
    evidenceId: 'event-ahmose-captures-avaris-evidence',
    evidenceSourceIds: ['source-ucl-ahmose'],
    reviewIds: { uncertainty: ['event-ahmose-captures-avaris-chronology'] },
    reviewSourceIds: ['source-ucl-ahmose'],
    sourceIds: ['source-ucl-ahmose', 'source-oeaw-avaris']
  }),
  event({
    id: 'event-amarna-reform',
    kind: 'historicalProcess',
    title: '阿肯那顿建立阿玛尔纳新秩序',
    timeSpan: { start: -1353, end: -1336, label: '约公元前1353—前1336年', approximate: true },
    regions: [region('nile-valley', 'attested', ['source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun'])],
    participants: [participant('egypt-new-kingdom', 'egypt-new-kingdom-imperial-court-order', 'reformingRoyalOrder', ['source-met-akhenaten-city', 'source-met-akhenaten-duck'])],
    evidenceId: 'event-amarna-reform-evidence',
    evidenceSourceIds: ['source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun'],
    reviewIds: { limitation: ['event-amarna-reform-regional-practice'] },
    reviewSourceIds: ['source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun'],
    sourceIds: ['source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun']
  }),
  event({
    id: 'event-battle-of-kadesh',
    kind: 'historicalEvent',
    title: '卡迭石战役',
    timeSpan: { start: -1274, end: -1274, label: '约公元前1274年', approximate: true },
    regions: [region('syria-northern-levant', 'attested', ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii'])],
    participants: [
      participant('egypt-new-kingdom', 'egypt-new-kingdom-imperial-court-order', 'belligerentPolity', ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii']),
      participant('hittite-empire', 'hittite-syrian-control', 'belligerentPolity', ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii'])
    ],
    evidenceId: 'event-battle-of-kadesh-evidence',
    evidenceSourceIds: ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii'],
    reviewIds: { limitation: ['event-battle-of-kadesh-royal-account'] },
    reviewSourceIds: ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii'],
    sourceIds: ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii']
  }),
  event({
    id: 'event-egypt-hatti-treaty',
    kind: 'historicalEvent',
    title: '埃及与赫梯签订和平条约',
    timeSpan: { start: -1259, end: -1258, label: '约公元前1259年', approximate: true },
    regions: [
      region('nile-valley', 'associated', ['source-un-egypt-hatti-treaty']),
      region('central-anatolia', 'associated', ['source-un-egypt-hatti-treaty'])
    ],
    participants: [
      participant('egypt-new-kingdom', 'egypt-new-kingdom-imperial-court-order', 'treatyPolity', ['source-un-egypt-hatti-treaty']),
      participant('hittite-empire', 'hittite-syrian-control', 'treatyPolity', ['source-un-egypt-hatti-treaty'])
    ],
    evidenceId: 'event-egypt-hatti-treaty-evidence',
    evidenceSourceIds: ['source-un-egypt-hatti-treaty'],
    reviewIds: { limitation: ['event-egypt-hatti-treaty-texts'] },
    reviewSourceIds: ['source-un-egypt-hatti-treaty'],
    sourceIds: ['source-un-egypt-hatti-treaty']
  }),
  event({
    id: 'event-new-kingdom-fragmentation',
    kind: 'historicalProcess',
    title: '新王国统一王权结束',
    timeSpan: { start: -1186, end: -1069, label: '约公元前1186—前1069年', approximate: true },
    regions: [
      region('nile-valley', 'associated', ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty']),
      region('nile-delta', 'associated', ['source-met-third-intermediate'])
    ],
    participants: [participant('egypt-new-kingdom', 'egypt-new-kingdom-fragmentation', 'fragmentingPolity', ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'])],
    evidenceId: 'event-new-kingdom-fragmentation-evidence',
    evidenceSourceIds: ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'],
    reviewIds: {
      uncertainty: ['event-new-kingdom-fragmentation-weight'],
      alternativeExplanation: ['event-new-kingdom-fragmentation-causes']
    },
    reviewSourceIds: ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'],
    sourceIds: ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate']
  }),
  event({
    id: 'event-khufu-great-pyramid-construction',
    kind: 'historicalProcess',
    title: '胡夫大金字塔工程',
    timeSpan: { start: -2580, end: -2560, label: '约公元前26世纪', approximate: true },
    regions: [region('nile-valley', 'attested', ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers'])],
    participants: [
      participant('egypt-old-kingdom', 'egypt-old-kingdom-regional-presence', 'organizingPolity', ['source-ifao-merer-log', 'source-aera-lost-city']),
      participant('egypt-pyramids', 'egypt-pyramids-nile-presence', 'constructedMonumentComplex', ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers'])
    ],
    evidenceId: 'event-khufu-great-pyramid-construction-evidence',
    evidenceSourceIds: ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers'],
    reviewIds: {
      limitation: ['event-khufu-workforce-status'],
      uncertainty: ['event-khufu-ramp-uncertainty']
    },
    reviewSourceIds: ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers'],
    sourceIds: ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers']
  }),
  event({
    id: 'event-unas-pyramid-text-inscription',
    kind: 'historicalEvent',
    title: '乌尼斯金字塔文',
    timeSpan: { start: -2375, end: -2325, label: '约公元前24世纪', approximate: true },
    regions: [region('nile-valley', 'attested', ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts'])],
    participants: [
      participant('egypt-old-kingdom', 'egypt-old-kingdom-regional-presence', 'royalContext', ['source-ucl-religious-texts']),
      participant('egyptian-religion', 'egyptian-religion-nile-presence', 'funeraryTradition', ['source-ucl-religious-texts'])
    ],
    evidenceId: 'event-unas-pyramid-text-inscription-evidence',
    evidenceSourceIds: ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts'],
    reviewIds: { limitation: ['event-unas-royal-context'] },
    reviewSourceIds: ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts'],
    sourceIds: ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts']
  })
] as const satisfies readonly EventWithoutConceptLayer[];

const ancientEgyptEventReviewPartition = quarantineHistoricalProcesses(attachEventConceptLayers(
  ancientEgyptEventDefinitions,
  {
    'event-upper-lower-egypt-unified': 'eventAndConflict',
    'event-old-kingdom-pyramid-complexes-develop': 'materialAndArchitecture',
    'event-egyptian-formal-art-conventions-persist': 'artAndLiterature',
    'event-egyptian-writing-system-changes': 'languageAndKnowledge',
    'event-old-kingdom-fragmentation': 'eventAndConflict',
    'event-middle-kingdom-reunification': 'eventAndConflict',
    'event-middle-kingdom-fragmentation': 'eventAndConflict',
    'event-ahmose-captures-avaris': 'eventAndConflict',
    'event-amarna-reform': 'religionAndThought',
    'event-battle-of-kadesh': 'eventAndConflict',
    'event-egypt-hatti-treaty': 'eventAndConflict',
    'event-new-kingdom-fragmentation': 'eventAndConflict',
    'event-khufu-great-pyramid-construction': 'materialAndArchitecture',
    'event-unas-pyramid-text-inscription': 'religionAndThought'
  }
));

export const ancientEgyptEvents = ancientEgyptEventReviewPartition.acceptedEvents;
export const ancientEgyptPendingHistoricalProcesses = ancientEgyptEventReviewPartition.pendingHistoricalProcesses;
