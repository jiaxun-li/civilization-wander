import type {
  EditorialReviewReferences,
  EventEvidenceReference,
  EventParticipant,
  RegionalAssociation,
  RegionalRole,
  SourceIds
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
  phaseId: string | undefined,
  role: string,
  sourceIds: SourceIds,
  description?: string
): EventParticipant {
  return { entityId, ...(phaseId === undefined ? {} : { phaseId }), role, description, sourceIds };
}

function evidence(v5ClaimBlockId: string, sourceIds: SourceIds): EventEvidenceReference {
  return { v5ClaimBlockId, sourceIds };
}

function review(
  sourceIds: SourceIds,
  values: Partial<Pick<
    EditorialReviewReferences,
    'limitationClaimIds' | 'counterexampleClaimIds' |
    'uncertaintyClaimIds' | 'alternativeExplanationClaimIds'
  >>
): EditorialReviewReferences {
  return {
    limitationClaimIds: values.limitationClaimIds ?? [],
    counterexampleClaimIds: values.counterexampleClaimIds ?? [],
    uncertaintyClaimIds: values.uncertaintyClaimIds ?? [],
    alternativeExplanationClaimIds: values.alternativeExplanationClaimIds ?? [],
    sourceIds
  };
}

const mesopotamiaEventDefinitions = [
  {
    id: 'event-southern-mesopotamia-water-land-management',
    kind: 'historicalProcess',
    title: '南部美索不达米亚形成水渠与土地管理实践',
    timeSpan: { start: -3500, end: -2000, label: '约公元前3500—前2000年', approximate: true },
    regions: [region('southern-mesopotamia', 'attested', [
      'source-adams-heartland-cities',
      'source-isac-irrigation-southern-mesopotamia'
    ])],
    participants: [
      participant('uruk', 'uruk-urban-expansion', 'urbanCommunity', ['source-adams-heartland-cities'])
    ],
    evidence: [evidence('event-southern-mesopotamia-water-land-management-evidence', [
      'source-adams-heartland-cities',
      'source-isac-irrigation-southern-mesopotamia',
      'source-proust-mesopotamian-mathematics'
    ])],
    editorialReview: review(
      ['source-adams-heartland-cities', 'source-isac-irrigation-southern-mesopotamia'],
      { uncertaintyClaimIds: ['event-southern-mesopotamia-water-land-management-review'] }
    ),
    sourceIds: [
      'source-adams-heartland-cities',
      'source-isac-irrigation-southern-mesopotamia',
      'source-proust-mesopotamian-mathematics'
    ]
  },
  {
    id: 'event-proto-cuneiform-accounting-emerges',
    kind: 'historicalProcess',
    title: '原始楔形文字记账体系形成',
    timeSpan: { start: -3350, end: -3000, label: '约公元前3350—前3000年', approximate: true },
    regions: [region('southern-mesopotamia', 'origin', [
      'source-englund-proto-cuneiform',
      'source-met-origins-writing'
    ])],
    participants: [
      participant('uruk', 'uruk-urban-expansion', 'earlyAttestation', ['source-met-origins-writing']),
      participant('cuneiform', 'cuneiform-early-development', 'emergingWritingSystem', ['source-englund-proto-cuneiform'])
    ],
    evidence: [evidence('event-proto-cuneiform-accounting-emerges-evidence', [
      'source-englund-proto-cuneiform',
      'source-met-origins-writing',
      'source-isac-writing-early-mesopotamia'
    ])],
    editorialReview: review(
      ['source-englund-proto-cuneiform', 'source-met-origins-writing'],
      { uncertaintyClaimIds: ['event-proto-cuneiform-accounting-emerges-review'] }
    ),
    sourceIds: [
      'source-englund-proto-cuneiform',
      'source-met-origins-writing',
      'source-isac-writing-early-mesopotamia'
    ]
  },
  {
    id: 'event-mesopotamian-number-calendar-practices-develop',
    kind: 'historicalProcess',
    title: '美索不达米亚计数与历法实践发展',
    timeSpan: { start: -3300, end: -2000, label: '约公元前3300—前2000年', approximate: true },
    regions: [region('southern-mesopotamia', 'attested', [
      'source-proust-mesopotamian-mathematics',
      'source-firth-sumerian-calendars'
    ])],
    participants: [
      participant('cuneiform', 'cuneiform-early-development', 'recordingSystem', ['source-proust-mesopotamian-mathematics'])
    ],
    evidence: [evidence('event-mesopotamian-number-calendar-practices-develop-evidence', [
      'source-proust-mesopotamian-mathematics',
      'source-firth-sumerian-calendars'
    ])],
    editorialReview: review(
      ['source-proust-mesopotamian-mathematics', 'source-firth-sumerian-calendars'],
      { uncertaintyClaimIds: ['event-mesopotamian-number-calendar-practices-develop-review'] }
    ),
    sourceIds: ['source-proust-mesopotamian-mathematics', 'source-firth-sumerian-calendars']
  },
  {
    id: 'event-uruk-urban-expansion',
    kind: 'historicalProcess',
    title: '乌鲁克发展为大型城市中心',
    timeSpan: { start: -3500, end: -3000, label: '约公元前3500—前3000年', approximate: true },
    regions: [region('southern-mesopotamia', 'attested', ['source-getty-uruk', 'source-met-uruk-first-city'])],
    participants: [
      participant('uruk', 'uruk-urban-expansion', 'expandingSettlement', ['source-getty-uruk', 'source-met-uruk-first-city'])
    ],
    evidence: [evidence('event-uruk-urban-expansion-evidence', [
      'source-getty-uruk',
      'source-met-uruk-first-city',
      'source-adams-heartland-cities'
    ])],
    editorialReview: review(
      ['source-getty-uruk', 'source-pollock-household-production'],
      { limitationClaimIds: ['event-uruk-urban-expansion-review'] }
    ),
    sourceIds: ['source-getty-uruk', 'source-met-uruk-first-city', 'source-adams-heartland-cities']
  },
  {
    id: 'event-early-mesopotamian-temple-centers-develop',
    kind: 'historicalProcess',
    title: '南部美索不达米亚神庙中心长期发展',
    timeSpan: { start: -5000, end: -3000, label: '约公元前5000—前3000年', approximate: true },
    regions: [region('southern-mesopotamia', 'attested', ['source-yale-ubaid-summary', 'source-met-uruk-first-city'])],
    participants: [
      participant('mesopotamian-temple', 'mesopotamian-temple-early-centers', 'developingInstitution', ['source-yale-ubaid-summary']),
      participant('uruk', 'uruk-urban-expansion', 'laterUrbanAttestation', ['source-met-uruk-first-city'])
    ],
    evidence: [evidence('event-early-mesopotamian-temple-centers-develop-evidence', [
      'source-yale-ubaid-summary',
      'source-met-uruk-first-city'
    ])],
    editorialReview: review(
      ['source-yale-ubaid-summary', 'source-met-uruk-first-city'],
      { uncertaintyClaimIds: ['event-early-mesopotamian-temple-centers-develop-review'] }
    ),
    sourceIds: ['source-yale-ubaid-summary', 'source-met-uruk-first-city']
  },
  {
    id: 'event-cuneiform-wedge-and-phonetic-writing-develop',
    kind: 'historicalProcess',
    title: '楔形笔画与表音书写逐步发展',
    timeSpan: { start: -3000, end: -2000, label: '约公元前3000—前2000年', approximate: true },
    regions: [region('southern-mesopotamia', 'attested', [
      'source-british-museum-cuneiform',
      'source-penn-uses-writing'
    ])],
    participants: [
      participant('cuneiform', 'cuneiform-early-development', 'developingWritingSystem', ['source-british-museum-cuneiform', 'source-penn-uses-writing'])
    ],
    evidence: [evidence('event-cuneiform-wedge-and-phonetic-writing-develop-evidence', [
      'source-british-museum-cuneiform',
      'source-penn-uses-writing',
      'source-damerow-writing-epistemology'
    ])],
    editorialReview: review(
      ['source-british-museum-cuneiform', 'source-penn-uses-writing'],
      { uncertaintyClaimIds: ['event-cuneiform-wedge-and-phonetic-writing-develop-review'] }
    ),
    sourceIds: ['source-british-museum-cuneiform', 'source-penn-uses-writing', 'source-damerow-writing-epistemology']
  },
  {
    id: 'event-cuneiform-multilingual-transmission',
    kind: 'historicalProcess',
    title: '楔形文字被多种语言采用并长期传承',
    timeSpan: { start: -2600, end: 75, label: '约公元前2600—公元75年', approximate: true },
    regions: [
      region('upper-mesopotamia', 'attested', ['source-british-museum-cuneiform', 'source-met-grammatical-text-object']),
      region('central-mesopotamia', 'attested', ['source-british-museum-cuneiform', 'source-met-grammatical-text-object']),
      region('southern-mesopotamia', 'attested', ['source-british-museum-cuneiform', 'source-met-grammatical-text-object']),
      region('anatolia-caucasus', 'attested', ['source-british-museum-cuneiform'])
    ],
    participants: [
      participant('cuneiform', 'cuneiform-multilingual-transmission', 'transmittedWritingSystem', ['source-british-museum-cuneiform', 'source-met-grammatical-text-object'])
    ],
    evidence: [evidence('event-cuneiform-multilingual-transmission-evidence', [
      'source-british-museum-cuneiform',
      'source-met-grammatical-text-object'
    ])],
    editorialReview: review(
      ['source-british-museum-cuneiform'],
      { uncertaintyClaimIds: ['event-cuneiform-multilingual-transmission-review'] }
    ),
    sourceIds: ['source-british-museum-cuneiform', 'source-met-grammatical-text-object']
  },
  {
  "id": "event-old-babylonian-city-kingdoms-emerge",
  "kind": "historicalProcess",
  "title": "乌尔第三王朝之后城邦王国重新组合",
  "timeSpan": {
    "start": -2004,
    "end": -1764,
    "label": "约公元前2004—前1764年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "associated",
      "approximate": true,
      "sourceIds": [
        "source-met-isin-larsa-old-babylonian",
        "source-podany-hammurabi-babylon"
      ]
    },
    {
      "regionId": "southern-mesopotamia",
      "role": "associated",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-ur-iii-old-babylonian-transition",
        "source-met-isin-larsa-old-babylonian"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "old-babylonian-kingdom",
      "phaseId": "old-babylonian-city-kingdom-emergence",
      "role": "emergingPolity",
      "sourceIds": [
        "source-met-isin-larsa-old-babylonian",
        "source-podany-hammurabi-babylon"
      ]
    },
    {
      "entityId": "ur-iii-kingdom",
      "phaseId": "ur-iii-kingdom-order",
      "role": "precedingPolity",
      "sourceIds": [
        "source-cambridge-ur-iii-old-babylonian-transition"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-old-babylonian-city-kingdoms-emerge-evidence",
      "sourceIds": [
        "source-cambridge-ur-iii-old-babylonian-transition",
        "source-met-isin-larsa-old-babylonian",
        "source-podany-hammurabi-babylon"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-old-babylonian-city-kingdoms-emerge-review"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-met-isin-larsa-old-babylonian",
      "source-podany-hammurabi-babylon"
    ]
  },
  "sourceIds": [
    "source-cambridge-ur-iii-old-babylonian-transition",
    "source-met-isin-larsa-old-babylonian",
    "source-podany-hammurabi-babylon"
  ]
},
  {
  "id": "event-babylonian-scribal-urban-continuity",
  "kind": "historicalProcess",
  "title": "巴比伦城市与书写传统跨越王朝延续",
  "timeSpan": {
    "start": -1595,
    "end": -1000,
    "label": "约公元前1595—前1000年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-brinkman-kassite-history",
        "source-met-kassite-period"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "mesopotamia-region",
      "phaseId": "mesopotamia-long-regional-continuity",
      "role": "regionalContinuity",
      "sourceIds": [
        "source-van-de-mieroop-ancient-near-east"
      ]
    },
    {
      "entityId": "cuneiform",
      "phaseId": "cuneiform-multilingual-transmission",
      "role": "scribalTradition",
      "sourceIds": [
        "source-met-kassite-period"
      ]
    },
    {
      "entityId": "old-babylonian-kingdom",
      "phaseId": "old-babylonian-city-kingdom-emergence",
      "role": "precedingPolityTradition",
      "sourceIds": [
        "source-brinkman-kassite-history"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-babylonian-scribal-urban-continuity-evidence",
      "sourceIds": [
        "source-brinkman-kassite-history",
        "source-met-kassite-period",
        "source-van-de-mieroop-ancient-near-east"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-babylonian-scribal-urban-continuity-review"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-brinkman-kassite-history",
      "source-van-de-mieroop-ancient-near-east"
    ]
  },
  "sourceIds": [
    "source-brinkman-kassite-history",
    "source-met-kassite-period",
    "source-van-de-mieroop-ancient-near-east"
  ]
},
  {
  "id": "event-hammurabi-conquests",
  "kind": "historicalEvent",
  "title": "汉谟拉比征服战争",
  "timeSpan": {
    "start": -1764,
    "end": -1755,
    "label": "约公元前1764—前1755年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cdli-hammurabi-year-names",
        "source-podany-hammurabi-babylon"
      ]
    },
    {
      "regionId": "southern-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cdli-hammurabi-year-names",
        "source-podany-hammurabi-babylon"
      ]
    },
    {
      "regionId": "middle-euphrates",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cdli-hammurabi-year-names",
        "source-podany-hammurabi-babylon"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "old-babylonian-kingdom",
      "phaseId": "old-babylonian-city-kingdom-emergence",
      "role": "attackingPolity",
      "description": "年名记载对拉尔萨、埃什嫩纳和马里等地的军事行动；地域表示这些战事的概略发生区域，不表示整个区域均受占领。",
      "sourceIds": [
        "source-cdli-hammurabi-year-names",
        "source-podany-hammurabi-babylon"
      ]
    },
    {
      "entityId": "rim-sin-i",
      "role": "opposingRuler",
      "description": "拉尔萨国王，汉谟拉比第31年年名记载其战败。",
      "sourceIds": [
        "source-cdli-hammurabi-year-31-reviewed"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-hammurabi-conquests-evidence",
      "sourceIds": [
        "source-cdli-hammurabi-year-names",
        "source-podany-hammurabi-babylon"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-hammurabi-conquests-review-chronology"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-cdli-hammurabi-year-names",
      "source-podany-hammurabi-babylon"
    ]
  },
  "sourceIds": [
    "source-cdli-hammurabi-year-names",
    "source-podany-hammurabi-babylon",
    "source-cdli-hammurabi-year-31-reviewed"
  ]
},
  {
    id: 'event-etemenanki-rebuilding',
    kind: 'historicalProcess',
    title: '埃特曼安吉塔庙重建',
    timeSpan: { start: -689, end: -562, label: '约公元前689—前562年', approximate: true },
    regions: [region('central-mesopotamia', 'attested', [
      'source-met-etemenanki-cylinder',
      'source-oracc-nebuchadnezzar-etemenanki'
    ])],
    participants: [
      participant(
        'mesopotamian-temple',
        'mesopotamian-temple-late-babylonian-monumentality',
        'rebuiltTempleTradition',
        ['source-met-etemenanki-cylinder', 'source-oracc-nebuchadnezzar-etemenanki'],
        'V6 不把后来的巴别塔故事当作重建工程的实际参与者。'
      )
    ],
    evidence: [evidence('event-etemenanki-rebuilding-evidence', [
      'source-george-tower-of-babel',
      'source-met-etemenanki-cylinder',
      'source-oracc-nebuchadnezzar-etemenanki'
    ])],
    editorialReview: review(
      ['source-george-tower-of-babel', 'source-met-etemenanki-cylinder', 'source-wikimedia-esagil-tablet'],
      { uncertaintyClaimIds: ['event-etemenanki-rebuilding-review-form'] }
    ),
    sourceIds: [
      'source-george-tower-of-babel',
      'source-met-etemenanki-cylinder',
      'source-oracc-nebuchadnezzar-etemenanki'
    ]
  }
] as const satisfies readonly EventWithoutConceptLayer[];

const mesopotamiaEventReviewPartition = quarantineHistoricalProcesses(attachEventConceptLayers(
  mesopotamiaEventDefinitions,
  {
    'event-southern-mesopotamia-water-land-management': 'technologyAndExchange',
    'event-proto-cuneiform-accounting-emerges': 'languageAndKnowledge',
    'event-mesopotamian-number-calendar-practices-develop': 'languageAndKnowledge',
    'event-uruk-urban-expansion': 'placeAndSite',
    'event-early-mesopotamian-temple-centers-develop': 'polityAndSociety',
    'event-cuneiform-wedge-and-phonetic-writing-develop': 'languageAndKnowledge',
    'event-cuneiform-multilingual-transmission': 'languageAndKnowledge',
    'event-old-babylonian-city-kingdoms-emerge': 'polityAndSociety',
    'event-babylonian-scribal-urban-continuity': 'languageAndKnowledge',
    'event-hammurabi-conquests': 'eventAndConflict',
    'event-etemenanki-rebuilding': 'materialAndArchitecture'
  }
));

export const mesopotamiaEvents = mesopotamiaEventReviewPartition.acceptedEvents;
export const mesopotamiaPendingHistoricalProcesses = mesopotamiaEventReviewPartition.pendingHistoricalProcesses;
