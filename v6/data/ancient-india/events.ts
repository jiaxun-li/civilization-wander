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

const ancientIndiaEventDefinitions = [
  {
    id: 'event-steppe-related-ancestry-enters-south-asia',
    kind: 'historicalProcess',
    title: '草原相关人群进入南亚',
    timeSpan: { start: -2000, end: -1500, label: '约公元前2000—前1500年', approximate: true },
    regions: [
      region('eurasian-steppe', 'associated', ['source-narasimhan-south-central-asia']),
      region('south-asia-northwest', 'attested', [
        'source-narasimhan-south-central-asia',
        'source-shinde-rakhigarhi-genome'
      ])
    ],
    participants: [
      participant(
        'vedic-tradition',
        'vedic-formation-through-mobility-and-contact',
        'formingCulturalTradition',
        ['source-narasimhan-south-central-asia', 'source-singh-ancient-india'],
        '人口移动与地方接触属于早期吠陀传统形成的背景，不等同于单一族群替代。'
      )
    ],
    evidence: [
      evidence('event-steppe-related-ancestry-evidence', [
        'source-narasimhan-south-central-asia',
        'source-shinde-rakhigarhi-genome'
      ])
    ],
    editorialReview: review(
      [
        'source-narasimhan-south-central-asia',
        'source-shinde-rakhigarhi-genome',
        'source-singh-ancient-india'
      ],
      {
        limitationClaimIds: ['event-steppe-related-ancestry-population-language'],
        uncertaintyClaimIds: ['event-steppe-related-ancestry-pace'],
        alternativeExplanationClaimIds: ['event-steppe-related-ancestry-contact']
      }
    ),
    sourceIds: ['source-narasimhan-south-central-asia', 'source-shinde-rakhigarhi-genome']
  },
  {
    id: 'event-indus-mesopotamia-exchange',
    kind: 'historicalProcess',
    title: '印度河与两河流域开展海上交换',
    timeSpan: { start: -2600, end: -1900, label: '约公元前2600—前1900年', approximate: true },
    regions: [
      region('indus-basin', 'exchange', ['source-possehl-indus-mesopotamia']),
      region('persian-gulf', 'exchange', ['source-bm-gulf-seal-ur', 'source-possehl-indus-mesopotamia']),
      region('southern-mesopotamia', 'exchange', ['source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur'])
    ],
    participants: [
      participant(
        'indus-civilization',
        'indus-civilization-core-presence',
        'easternExchangeNetwork',
        ['source-possehl-indus-mesopotamia']
      ),
      participant(
        'akkadian-empire',
        'akkadian-imperial-order',
        'westernPoliticalAndTextualContext',
        ['source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur'],
        '阿卡德王室铭文与两河、海湾物证构成交换网络西端的政治和文本语境。'
      )
    ],
    evidence: [
      evidence('event-indus-mesopotamia-exchange-evidence', [
        'source-possehl-indus-mesopotamia',
        'source-oracc-sargon-meluhha',
        'source-bm-gulf-seal-ur'
      ])
    ],
    editorialReview: review(
      [
        'source-possehl-indus-mesopotamia',
        'source-oracc-sargon-meluhha',
        'source-bm-gulf-seal-ur',
        'source-laursen-dilmun-seals',
        'source-kenoyer-kish-carnelian'
      ],
      {
        limitationClaimIds: ['event-indus-mesopotamia-exchange-object-identity'],
        uncertaintyClaimIds: ['event-indus-mesopotamia-exchange-meluhha'],
        alternativeExplanationClaimIds: ['event-indus-mesopotamia-exchange-routes']
      }
    ),
    sourceIds: [
      'source-possehl-indus-mesopotamia',
      'source-oracc-sargon-meluhha',
      'source-bm-gulf-seal-ur'
    ]
  },
  {
  "id": "event-indus-urban-transformation",
  "kind": "historicalProcess",
  "title": "印度河大城市网络转型",
  "timeSpan": {
    "start": -2000,
    "end": -1300,
    "label": "约公元前2000—前1300年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "indus-basin",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-wright-ancient-indus",
        "source-kenoyer-indus-civilisation",
        "source-giosan-harappan-transformation"
      ]
    },
    {
      "regionId": "south-asia-northwest",
      "role": "associated",
      "approximate": true,
      "sourceIds": [
        "source-giosan-harappan-transformation"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "indus-civilization",
      "phaseId": "indus-civilization-core-presence",
      "role": "transformingRegionalTradition",
      "sourceIds": [
        "source-wright-ancient-indus",
        "source-giosan-harappan-transformation"
      ]
    },
    {
      "entityId": "mohenjo-daro",
      "phaseId": "mohenjo-daro-mature-urban-settlement",
      "role": "contractingUrbanCenter",
      "sourceIds": [
        "source-unesco-mohenjo-daro",
        "source-giosan-harappan-transformation"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-indus-urban-transformation-evidence",
      "sourceIds": [
        "source-wright-ancient-indus",
        "source-kenoyer-indus-civilisation",
        "source-giosan-harappan-transformation"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [
      "event-indus-urban-transformation-regional-variation"
    ],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-indus-urban-transformation-population"
    ],
    "alternativeExplanationClaimIds": [
      "event-indus-urban-transformation-causes"
    ],
    "sourceIds": [
      "source-wright-ancient-indus",
      "source-kenoyer-indus-civilisation",
      "source-giosan-harappan-transformation"
    ]
  },
  "sourceIds": [
    "source-wright-ancient-indus",
    "source-kenoyer-indus-civilisation",
    "source-giosan-harappan-transformation"
  ]
}
] as const satisfies readonly EventWithoutConceptLayer[];

const ancientIndiaEventReviewPartition = quarantineHistoricalProcesses(attachEventConceptLayers(
  ancientIndiaEventDefinitions,
  {
    'event-steppe-related-ancestry-enters-south-asia': 'eventAndConflict',
    'event-indus-mesopotamia-exchange': 'technologyAndExchange',
    'event-indus-urban-transformation': 'placeAndSite'
  }
));

export const ancientIndiaEvents = ancientIndiaEventReviewPartition.acceptedEvents;
export const ancientIndiaPendingHistoricalProcesses = ancientIndiaEventReviewPartition.pendingHistoricalProcesses;
