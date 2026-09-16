import type { EditorialReviewReferences, EventKind, EventParticipant, RegionalAssociation, RegionalRole, SourceIds, TimeSpan } from '../../schema/index.ts';
import {
  attachEventConceptLayers,
  quarantineHistoricalProcesses,
  type EventWithoutConceptLayer
} from '../event-concepts.ts';

function region(regionId: string, role: RegionalRole, sourceIds: SourceIds): RegionalAssociation {
  return { regionId, role, approximate: true, sourceIds };
}
function participant(entityId: string, phaseId: string, role: string, sourceIds: SourceIds, description?: string): EventParticipant {
  return { entityId, phaseId, role, sourceIds, description };
}
interface ReviewIds { limitation?: readonly string[]; counterexample?: readonly string[]; uncertainty?: readonly string[]; alternativeExplanation?: readonly string[]; }
function review(ids: ReviewIds, sourceIds: SourceIds): EditorialReviewReferences {
  return { limitationClaimIds: ids.limitation ?? [], counterexampleClaimIds: ids.counterexample ?? [], uncertaintyClaimIds: ids.uncertainty ?? [], alternativeExplanationClaimIds: ids.alternativeExplanation ?? [], sourceIds };
}
interface Input { id: string; kind: EventKind; title: string; timeSpan: TimeSpan; regions: readonly RegionalAssociation[]; participants: readonly EventParticipant[]; evidenceId: string; evidenceSources: SourceIds; reviewIds: ReviewIds; reviewSources: SourceIds; sourceIds: SourceIds; }
function makeEvent(input: Input): EventWithoutConceptLayer {
  return { id: input.id, kind: input.kind, title: input.title, timeSpan: input.timeSpan, regions: input.regions, participants: input.participants, evidence: [{ v5ClaimBlockId: input.evidenceId, sourceIds: input.evidenceSources }], editorialReview: review(input.reviewIds, input.reviewSources), sourceIds: input.sourceIds };
}

const aegeanEventDefinitions = [
  {
  "id": "event-mycenaean-shaft-grave-elites-emerge",
  "kind": "historicalProcess",
  "title": "迈锡尼竖井墓精英形成",
  "timeSpan": {
    "start": -1700,
    "end": -1450,
    "label": "约公元前1700—前1450年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "greek-mainland",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-met-mycenaean-civilization",
        "source-cambridge-guide-mycenae"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "mycenaean-civilization",
      "phaseId": "mycenaean-palatial-administration",
      "role": "emergingEliteTradition",
      "sourceIds": [
        "source-met-mycenaean-civilization",
        "source-cambridge-guide-mycenae"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-mycenaean-shaft-grave-elites-emerge-evidence",
      "sourceIds": [
        "source-met-mycenaean-civilization",
        "source-cambridge-guide-mycenae"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [
      "event-mycenaean-shaft-grave-elites-emerge-review"
    ],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-met-mycenaean-civilization",
      "source-cambridge-guide-mycenae"
    ]
  },
  "sourceIds": [
    "source-met-mycenaean-civilization",
    "source-cambridge-guide-mycenae"
  ]
},
  {
  "id": "event-crete-palaces-emerge-and-rebuild",
  "kind": "historicalProcess",
  "title": "克里特宫殿出现并重建",
  "timeSpan": {
    "start": -2000,
    "end": -1450,
    "label": "约公元前2000—前1450年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "crete",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-unesco-minoan-palatial-centres",
        "source-met-minoan-crete"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "minoan-palatial-civilization",
      "phaseId": "minoan-first-palatial-centres",
      "role": "developingPalatialTradition",
      "sourceIds": [
        "source-unesco-minoan-palatial-centres"
      ]
    },
    {
      "entityId": "minoan-palatial-civilization",
      "phaseId": "minoan-first-palatial-centres",
      "role": "rebuiltPalatialTradition",
      "sourceIds": [
        "source-unesco-minoan-palatial-centres",
        "source-met-minoan-crete"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-crete-palaces-emerge-evidence",
      "sourceIds": [
        "source-unesco-minoan-palatial-centres",
        "source-met-minoan-crete"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [
      "event-crete-palaces-emerge-review"
    ],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-unesco-minoan-palatial-centres",
      "source-met-minoan-crete"
    ]
  },
  "sourceIds": [
    "source-unesco-minoan-palatial-centres",
    "source-met-minoan-crete"
  ]
},
  {
  "id": "event-knossos-linear-b-administration",
  "kind": "historicalProcess",
  "title": "克诺索斯改用线形文字B",
  "timeSpan": {
    "start": -1450,
    "end": -1375,
    "label": "约公元前1450—前1375年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "crete",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-salgarella-writing-bronze-age-crete",
        "source-bsa-linear-b"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "minoan-palatial-civilization",
      "phaseId": "minoan-first-palatial-centres",
      "role": "administrativeContext",
      "sourceIds": [
        "source-salgarella-writing-bronze-age-crete"
      ]
    },
    {
      "entityId": "mycenaean-civilization",
      "phaseId": "mycenaean-palatial-administration",
      "role": "adaptingAdministrativeTradition",
      "sourceIds": [
        "source-bsa-linear-b"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-knossos-linear-b-evidence",
      "sourceIds": [
        "source-salgarella-writing-bronze-age-crete",
        "source-bsa-linear-b"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-knossos-linear-b-review"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-salgarella-writing-bronze-age-crete",
      "source-bsa-linear-b"
    ]
  },
  "sourceIds": [
    "source-salgarella-writing-bronze-age-crete",
    "source-bsa-linear-b"
  ]
},
  {
  "id": "event-mycenaean-palace-administration",
  "kind": "historicalProcess",
  "title": "迈锡尼宫殿行政扩展",
  "timeSpan": {
    "start": -1450,
    "end": -1200,
    "label": "约公元前1450—前1200年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "greek-mainland",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-killen-mycenaean-society",
        "source-bsa-linear-b"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "mycenaean-civilization",
      "phaseId": "mycenaean-palatial-administration",
      "role": "palatialAdministrativeTradition",
      "sourceIds": [
        "source-killen-mycenaean-society",
        "source-bsa-linear-b"
      ]
    },
    {
      "entityId": "mycenaean-civilization",
      "phaseId": "mycenaean-palatial-administration",
      "role": "latePalatialTradition",
      "sourceIds": [
        "source-killen-mycenaean-society"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-mycenaean-palace-evidence",
      "sourceIds": [
        "source-killen-mycenaean-society",
        "source-bsa-linear-b",
        "source-cambridge-mycenaean-religion"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [
      "event-mycenaean-palace-review"
    ],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-killen-mycenaean-society",
      "source-bsa-linear-b"
    ]
  },
  "sourceIds": [
    "source-killen-mycenaean-society",
    "source-bsa-linear-b",
    "source-cambridge-mycenaean-religion"
  ]
},
  {
  "id": "event-aegean-localizes-after-palaces",
  "kind": "historicalProcess",
  "title": "爱琴海社会转向地方社区",
  "timeSpan": {
    "start": -1200,
    "end": -1050,
    "label": "约公元前1200—前1050年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "greek-mainland",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-deger-jalkotzy-aftermath",
        "source-cambridge-mycenaean-transformation"
      ]
    },
    {
      "regionId": "aegean-islands",
      "role": "associated",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-mycenaean-transformation"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "mycenaean-civilization",
      "phaseId": "mycenaean-palatial-administration",
      "role": "precedingPalatialTradition",
      "sourceIds": [
        "source-deger-jalkotzy-aftermath"
      ]
    },
    {
      "entityId": "greek-dark-age-communities",
      "phaseId": "greek-postpalatial-local-communities",
      "role": "reorganizingCommunities",
      "sourceIds": [
        "source-cambridge-mycenaean-transformation"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-aegean-localizes-evidence",
      "sourceIds": [
        "source-deger-jalkotzy-aftermath",
        "source-cambridge-mycenaean-transformation"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [],
    "alternativeExplanationClaimIds": [
      "event-aegean-localizes-alternative"
    ],
    "sourceIds": [
      "source-deger-jalkotzy-aftermath",
      "source-cambridge-mycenaean-transformation"
    ]
  },
  "sourceIds": [
    "source-deger-jalkotzy-aftermath",
    "source-cambridge-mycenaean-transformation"
  ]
},
  {
  "id": "event-aegean-regional-links-renew",
  "kind": "historicalProcess",
  "title": "爱琴海区域联系重新增密",
  "timeSpan": {
    "start": -1050,
    "end": -800,
    "label": "约公元前1050—前800年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "greek-mainland",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-bsa-aegean-iron-technologies",
        "source-cambridge-greek-iron-age-pottery"
      ]
    },
    {
      "regionId": "aegean-islands",
      "role": "exchange",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-greek-iron-age-pottery"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "greek-dark-age-communities",
      "phaseId": "greek-postpalatial-local-communities",
      "role": "renewingRegionalCommunities",
      "sourceIds": [
        "source-bsa-aegean-iron-technologies",
        "source-cambridge-greek-iron-age-pottery"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-aegean-links-evidence",
      "sourceIds": [
        "source-bsa-aegean-iron-technologies",
        "source-cambridge-greek-iron-age-pottery"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-aegean-links-review"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-bsa-aegean-iron-technologies",
      "source-cambridge-greek-iron-age-pottery"
    ]
  },
  "sourceIds": [
    "source-bsa-aegean-iron-technologies",
    "source-cambridge-greek-iron-age-pottery"
  ]
},
  makeEvent({
    id: 'event-hittite-wilusa-treaty', kind: 'historicalEvent', title: '赫梯大王与维鲁萨国王缔结条约',
    timeSpan: { start: -1300, end: -1250, label: '签约定年范围：约公元前1300—前1250年', approximate: true },
    regions: [region('western-anatolia', 'associated', ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa']), region('central-anatolia', 'associated', ['source-british-museum-alaksandu-wilusa'])],
    participants: [
      participant('hittite-empire', 'hittite-syrian-control', 'treatyGreatKingdom', ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa'])
    ],
    evidenceId: 'event-hittite-wilusa-treaty-evidence', evidenceSources: ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa'],
    reviewIds: { uncertainty: ['event-hittite-wilusa-treaty-identification'] }, reviewSources: ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa'], sourceIds: ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa']
  })
] as const satisfies readonly EventWithoutConceptLayer[];

const aegeanEventReviewPartition = quarantineHistoricalProcesses(attachEventConceptLayers(
  aegeanEventDefinitions,
  {
    'event-mycenaean-shaft-grave-elites-emerge': 'polityAndSociety',
    'event-crete-palaces-emerge-and-rebuild': 'materialAndArchitecture',
    'event-knossos-linear-b-administration': 'languageAndKnowledge',
    'event-mycenaean-palace-administration': 'polityAndSociety',
    'event-aegean-localizes-after-palaces': 'polityAndSociety',
    'event-aegean-regional-links-renew': 'technologyAndExchange',
    'event-hittite-wilusa-treaty': 'eventAndConflict'
  }
));

export const aegeanEvents = aegeanEventReviewPartition.acceptedEvents;
export const aegeanPendingHistoricalProcesses = aegeanEventReviewPartition.pendingHistoricalProcesses;
