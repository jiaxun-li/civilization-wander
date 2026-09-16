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
  phaseId: string,
  role: string,
  sourceIds: SourceIds,
  description?: string
): EventParticipant {
  return { entityId, phaseId, role, description, sourceIds };
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

const lateBronzeAgeEventDefinitions = [
  {
    id: 'event-hittite-central-kingship-consolidates',
    kind: 'historicalProcess',
    title: '赫梯中央王权在哈图沙重组',
    timeSpan: { start: -1650, end: -1350, label: '约公元前1650—前1350年', approximate: true },
    regions: [region('central-anatolia', 'attested', ['source-bryce-hittite-kingdom', 'source-unesco-hattusha'])],
    participants: [participant('hittite-empire', 'hittite-early-central-kingship', 'consolidatingPolity', ['source-bryce-hittite-kingdom', 'source-unesco-hattusha'])],
    evidence: [evidence('event-hittite-central-kingship-evidence', ['source-bryce-hittite-kingdom', 'source-unesco-hattusha'])],
    editorialReview: review(
      ['source-bryce-hittite-kingdom', 'source-unesco-hattusha'],
      { limitationClaimIds: ['event-hittite-central-kingship-gaps'] }
    ),
    sourceIds: ['source-bryce-hittite-kingdom', 'source-unesco-hattusha']
  },
  {
    id: 'event-ugarit-palace-port-network-operates',
    kind: 'historicalProcess',
    title: '乌加里特宫廷与港口网络运转',
    timeSpan: { start: -1800, end: -1200, label: '约公元前1800—前1200年', approximate: true },
    regions: [
      region('syria-northern-levant', 'attested', ['source-yon-city-of-ugarit', 'source-met-ugarit']),
      region('eastern-mediterranean-sea', 'exchange', ['source-french-ugarit-exchange'])
    ],
    participants: [
      participant('ugarit-kingdom', 'ugarit-kingdom-presence', 'palacePortNetwork', ['source-yon-city-of-ugarit', 'source-met-ugarit'])
    ],
    evidence: [evidence('event-ugarit-palace-port-network-evidence', ['source-yon-city-of-ugarit', 'source-met-ugarit', 'source-french-ugarit-texts'])],
    editorialReview: review(
      ['source-yon-city-of-ugarit', 'source-met-ugarit'],
      { limitationClaimIds: ['event-ugarit-palace-port-network-archive'] }
    ),
    sourceIds: ['source-yon-city-of-ugarit', 'source-met-ugarit', 'source-french-ugarit-texts']
  },
  {
    id: 'event-amarna-diplomatic-correspondence-operates',
    kind: 'historicalProcess',
    title: '阿玛尔纳外交书信网络运转',
    timeSpan: { start: -1360, end: -1330, label: '约公元前1360—前1330年', approximate: true },
    regions: [
      region('nile-valley', 'attested', ['source-met-amarna-letters', 'source-moran-amarna-letters']),
      region('syria-northern-levant', 'exchange', ['source-moran-amarna-letters']),
      region('southern-levant', 'exchange', ['source-moran-amarna-letters'])
    ],
    participants: [
      participant('amarna-letters-corpus', 'amarna-diplomatic-correspondence', 'diplomaticDocumentCorpus', ['source-met-amarna-letters', 'source-moran-amarna-letters']),
      participant('cuneiform', 'cuneiform-eastern-mediterranean-diplomacy', 'sharedDiplomaticWritingSystem', ['source-met-amarna-letters', 'source-moran-amarna-letters'])
    ],
    evidence: [evidence('event-amarna-diplomatic-correspondence-evidence', ['source-met-amarna-letters', 'source-moran-amarna-letters'])],
    editorialReview: review(
      ['source-met-amarna-letters', 'source-moran-amarna-letters'],
      { limitationClaimIds: ['event-amarna-diplomatic-correspondence-survival'] }
    ),
    sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters']
  },
  {
  "id": "event-hittite-sack-babylon",
  "kind": "historicalEvent",
  "title": "赫梯军队突袭巴比伦",
  "timeSpan": {
    "start": -1595,
    "end": -1595,
    "label": "约公元前1595年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-met-isin-larsa-old-babylonian"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "hittite-empire",
      "phaseId": "hittite-early-central-kingship",
      "role": "raidingPolity",
      "sourceIds": [
        "source-bryce-hittite-kingdom"
      ]
    },
    {
      "entityId": "old-babylonian-kingdom",
      "phaseId": "old-babylonian-city-kingdom-emergence",
      "role": "raidedPolity",
      "sourceIds": [
        "source-met-isin-larsa-old-babylonian"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-hittite-sack-babylon-evidence",
      "sourceIds": [
        "source-bryce-hittite-kingdom",
        "source-met-isin-larsa-old-babylonian"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-hittite-sack-babylon-chronology"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-bryce-hittite-kingdom",
      "source-met-isin-larsa-old-babylonian"
    ]
  },
  "sourceIds": [
    "source-bryce-hittite-kingdom",
    "source-met-isin-larsa-old-babylonian"
  ]
},
  {
    id: 'event-hittite-syrian-expansion',
    kind: 'historicalProcess',
    title: '赫梯王权进入叙利亚',
    timeSpan: { start: -1350, end: -1320, label: '约公元前1350—前1320年', approximate: true },
    regions: [
      region('central-anatolia', 'associated', ['source-bryce-hittite-kingdom']),
      region('syria-northern-levant', 'controlled', ['source-bryce-hittite-kingdom', 'source-met-hittites'])
    ],
    participants: [participant('hittite-empire', 'hittite-syrian-control', 'expandingPolity', ['source-bryce-hittite-kingdom', 'source-met-hittites'])],
    evidence: [evidence('event-hittite-syrian-expansion-evidence', ['source-bryce-hittite-kingdom', 'source-met-hittites'])],
    editorialReview: review(
      ['source-bryce-hittite-kingdom', 'source-met-hittites'],
      { uncertaintyClaimIds: ['event-hittite-syrian-expansion-boundaries'] }
    ),
    sourceIds: ['source-bryce-hittite-kingdom', 'source-met-hittites']
  },
  {
    id: 'event-hittite-ugarit-treaty',
    kind: 'historicalEvent',
    title: '乌加里特进入赫梯条约体系',
    timeSpan: { start: -1350, end: -1330, label: '约公元前1350—前1330年', approximate: true },
    regions: [
      region('syria-northern-levant', 'attested', ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit'])
    ],
    participants: [
      participant('hittite-empire', 'hittite-syrian-control', 'overlordPolity', ['source-beckman-hittite-diplomatic-texts']),
      participant('ugarit-kingdom', 'ugarit-kingdom-presence', 'treatyBoundPolity', ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit'])
    ],
    evidence: [evidence('event-hittite-ugarit-treaty-evidence', ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit'])],
    editorialReview: review(
      ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit'],
      { limitationClaimIds: ['event-hittite-ugarit-treaty-practice'] }
    ),
    sourceIds: ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit']
  },
  {
    id: 'event-hittite-central-kingdom-ends',
    kind: 'historicalProcess',
    title: '赫梯中央王国解体',
    timeSpan: { start: -1200, end: -1180, label: '约公元前1200—前1180年', approximate: true },
    regions: [
      region('central-anatolia', 'attested', ['source-bryce-hittite-kingdom', 'source-met-hittites']),
      region('syria-northern-levant', 'associated', ['source-bryce-neo-hittite-kingdoms'])
    ],
    participants: [participant('hittite-empire', 'hittite-syrian-control', 'dissolvingCentralPolity', ['source-bryce-hittite-kingdom', 'source-met-hittites'])],
    evidence: [evidence('event-hittite-central-kingdom-ends-evidence', ['source-bryce-hittite-kingdom', 'source-met-hittites'])],
    editorialReview: review(
      ['source-bryce-hittite-kingdom', 'source-bryce-neo-hittite-kingdoms', 'source-met-hittites'],
      {
        uncertaintyClaimIds: ['event-hittite-central-kingdom-ends-causes'],
        alternativeExplanationClaimIds: ['event-hittite-central-kingdom-ends-continuity']
      }
    ),
    sourceIds: ['source-bryce-hittite-kingdom', 'source-met-hittites']
  },
  {
  "id": "event-ramesses-iii-northern-invasions",
  "kind": "historicalEvent",
  "title": "拉美西斯三世抵御北方来敌",
  "timeSpan": {
    "start": -1177,
    "end": -1175,
    "label": "约公元前1177—前1175年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-delta",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-isac-medinet-habu-i",
        "source-edgerton-wilson-ramesses-iii"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "egypt-new-kingdom",
      "phaseId": "egypt-new-kingdom-imperial-court-order",
      "role": "defendingPolity",
      "sourceIds": [
        "source-isac-medinet-habu-i",
        "source-edgerton-wilson-ramesses-iii"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-ramesses-iii-northern-invasions-evidence",
      "sourceIds": [
        "source-isac-medinet-habu-i",
        "source-edgerton-wilson-ramesses-iii",
        "source-grandet-ramesses-iii"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [
      "event-ramesses-iii-royal-record"
    ],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-ramesses-iii-groups"
    ],
    "alternativeExplanationClaimIds": [
      "event-ramesses-iii-mixed-movements"
    ],
    "sourceIds": [
      "source-isac-medinet-habu-i",
      "source-cifola-ramesses-sea-peoples",
      "source-yasur-landau-philistines"
    ]
  },
  "sourceIds": [
    "source-isac-medinet-habu-i",
    "source-edgerton-wilson-ramesses-iii",
    "source-grandet-ramesses-iii"
  ]
}
] as const satisfies readonly EventWithoutConceptLayer[];

const lateBronzeAgeEventReviewPartition = quarantineHistoricalProcesses(attachEventConceptLayers(
  lateBronzeAgeEventDefinitions,
  {
    'event-hittite-central-kingship-consolidates': 'polityAndSociety',
    'event-ugarit-palace-port-network-operates': 'technologyAndExchange',
    'event-amarna-diplomatic-correspondence-operates': 'languageAndKnowledge',
    'event-hittite-sack-babylon': 'eventAndConflict',
    'event-hittite-syrian-expansion': 'eventAndConflict',
    'event-hittite-ugarit-treaty': 'eventAndConflict',
    'event-hittite-central-kingdom-ends': 'eventAndConflict',
    'event-ramesses-iii-northern-invasions': 'eventAndConflict'
  }
));

export const lateBronzeAgeEvents = lateBronzeAgeEventReviewPartition.acceptedEvents;
export const lateBronzeAgePendingHistoricalProcesses = lateBronzeAgeEventReviewPartition.pendingHistoricalProcesses;
