import type { EditorialReviewReferences, EventEvidenceReference, EventParticipant, RegionalAssociation, RegionalRole, SourceIds } from '../../schema/index.ts';
import {
  attachEventConceptLayers,
  quarantineHistoricalProcesses,
  type EventWithoutConceptLayer
} from '../event-concepts.ts';

const region = (regionId: string, role: RegionalRole, sourceIds: SourceIds): RegionalAssociation => ({ regionId, role, approximate: true, sourceIds });
const participant = (entityId: string, phaseId: string | undefined, role: string, sourceIds: SourceIds): EventParticipant => ({ entityId, ...(phaseId === undefined ? {} : { phaseId }), role, sourceIds });
const evidence = (v5ClaimBlockId: string, sourceIds: SourceIds): EventEvidenceReference => ({ v5ClaimBlockId, sourceIds });
const review = (sourceIds: SourceIds, refs: Partial<Omit<EditorialReviewReferences, 'sourceIds'>> = {}): EditorialReviewReferences => ({ limitationClaimIds: refs.limitationClaimIds ?? [], counterexampleClaimIds: refs.counterexampleClaimIds ?? [], uncertaintyClaimIds: refs.uncertaintyClaimIds ?? [], alternativeExplanationClaimIds: refs.alternativeExplanationClaimIds ?? [], sourceIds });

const ironAgeNearEastEventDefinitions = [
  { id: 'event-meteoric-iron-prestige-use', kind: 'historicalProcess', title: '陨铁被制成稀有器物', timeSpan: { start: -3400, end: -1300, label: '约公元前3400—前1300年', approximate: true }, regions: [region('nile-valley', 'attested', ['source-matsui-tutankhamun-dagger'])], participants: [participant('iron', undefined, 'prestigeMaterial', ['source-matsui-tutankhamun-dagger'])], evidence: [evidence('event-meteoric-iron-use-evidence', ['source-matsui-tutankhamun-dagger'])], editorialReview: review(['source-matsui-tutankhamun-dagger'], { limitationClaimIds: ['event-meteoric-iron-use-rarity'] }), sourceIds: ['source-matsui-tutankhamun-dagger'] },
  {
  "id": "event-old-assyrian-trade-networks",
  "kind": "historicalProcess",
  "title": "古亚述商人经营安纳托利亚贸易",
  "timeSpan": {
    "start": -2000,
    "end": -1750,
    "label": "约公元前2000—前1750年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-old-assyrian-community-reviewed"
      ]
    },
    {
      "regionId": "central-anatolia",
      "role": "exchange",
      "approximate": true,
      "sourceIds": [
        "source-met-old-assyrian-community-reviewed"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "assur-community",
      "phaseId": "assur-old-assyrian-trade-community",
      "role": "merchantCommunity",
      "sourceIds": [
        "source-met-old-assyrian-community-reviewed"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-old-assyrian-trade-evidence",
      "sourceIds": [
        "source-met-old-assyrian-community-reviewed"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [
      "event-old-assyrian-trade-archive"
    ],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-met-old-assyrian-community-reviewed"
    ]
  },
  "sourceIds": [
    "source-met-old-assyrian-community-reviewed"
  ]
},
  { id: 'event-ashurbanipal-collections-assembled', kind: 'historicalProcess', title: '亚述巴尼拔在尼尼微组织泥版收藏', timeSpan: { start: -668, end: -631, label: '公元前668—前631年' }, regions: [region('upper-mesopotamia', 'attested', ['source-bm-ashurbanipal-library'])], participants: [participant('neo-assyrian-empire', 'neo-assyrian-imperial-administration', 'collectingPolity', ['source-bm-ashurbanipal-library', 'source-oracc-assembling-library'])], evidence: [evidence('event-ashurbanipal-collections-evidence', ['source-bm-ashurbanipal-library', 'source-oracc-assembling-library'])], editorialReview: review(['source-bm-ashurbanipal-library'], { limitationClaimIds: ['event-ashurbanipal-collections-rooms'] }), sourceIds: ['source-bm-ashurbanipal-library', 'source-oracc-assembling-library'] },
  { id: 'event-israel-and-judah-develop-separate-kingships', kind: 'historicalProcess', title: '以色列与犹大发展为两个王国', timeSpan: { start: -930, end: -853, label: '约公元前930—前853年', approximate: true }, regions: [region('southern-levant', 'attested', ['source-met-ancient-israel'])], participants: [participant('kingdom-of-israel', 'israel-kingdom-presence', 'northernKingship', ['source-met-ancient-israel']), participant('kingdom-of-judah', 'judah-kingdom-presence', 'southernKingship', ['source-met-ancient-israel'])], evidence: [evidence('event-israel-judah-kingships-evidence', ['source-met-ancient-israel'])], editorialReview: review(['source-met-ancient-israel'], { uncertaintyClaimIds: ['event-israel-judah-kingships-chronology'] }), sourceIds: ['source-met-ancient-israel'] },
  { id: 'event-judean-communities-continue-after-exile', kind: 'historicalProcess', title: '犹大社群在本地与巴比伦继续生活', timeSpan: { start: -586, end: -500, label: '约公元前586—前500年', approximate: true }, regions: [region('southern-levant', 'attested', ['source-sefaria-kings']), region('central-mesopotamia', 'attested', ['source-met-cyrus-return'])], participants: [participant('ancient-israelite-tradition', 'israelite-post-exile-community-traditions', 'continuingCommunityTradition', ['source-met-cyrus-return', 'source-sefaria-kings'])], evidence: [evidence('event-judean-communities-after-exile-evidence', ['source-met-cyrus-return', 'source-sefaria-kings'])], editorialReview: review(['source-met-cyrus-return', 'source-sefaria-kings'], { alternativeExplanationClaimIds: ['event-judean-communities-after-exile-many-paths'] }), sourceIds: ['source-met-cyrus-return', 'source-sefaria-kings'] },
  { id: 'event-babylon-destroyed-and-rebuilt-under-assyria', kind: 'historicalProcess', title: '巴比伦在亚述统治下被毁并重建', timeSpan: { start: -689, end: -626, label: '公元前689—前626年' }, regions: [region('central-mesopotamia', 'attested', ['source-met-esarhaddon-prism'])], participants: [participant('babylon-city', 'babylon-city-late-iron-age-presence', 'destroyedAndRebuiltCity', ['source-met-esarhaddon-prism']), participant('neo-assyrian-empire', 'neo-assyrian-imperial-administration', 'rulingPolity', ['source-met-esarhaddon-prism'])], evidence: [evidence('event-babylon-assyria-destruction-rebuilding-evidence', ['source-met-esarhaddon-prism'])], editorialReview: review(['source-met-esarhaddon-prism'], { limitationClaimIds: ['event-babylon-assyria-destruction-rebuilding-records'] }), sourceIds: ['source-met-esarhaddon-prism'] },
  { id: 'event-nebuchadnezzar-rebuilds-babylon', kind: 'historicalProcess', title: '尼布甲尼撒二世重建巴比伦', timeSpan: { start: -605, end: -562, label: '约公元前605—前562年', approximate: true }, regions: [region('central-mesopotamia', 'attested', ['source-met-babylon-lion', 'source-met-nebuchadnezzar-cylinder'])], participants: [participant('neo-babylonian-empire', 'neo-babylonian-capital-and-rule', 'commissioningPolity', ['source-met-nebuchadnezzar-cylinder']), participant('babylon-city', 'babylon-city-late-iron-age-presence', 'rebuiltCapital', ['source-met-babylon-lion'])], evidence: [evidence('event-nebuchadnezzar-rebuilds-babylon-evidence', ['source-met-babylon-lion', 'source-met-nebuchadnezzar-cylinder'])], editorialReview: review(['source-met-babylon-lion'], { limitationClaimIds: ['event-nebuchadnezzar-rebuilds-babylon-labor'] }), sourceIds: ['source-met-babylon-lion', 'source-met-nebuchadnezzar-cylinder'] },
  {
  "id": "event-neo-assyrian-expansion",
  "kind": "historicalProcess",
  "title": "新亚述帝国向外扩张",
  "timeSpan": {
    "start": -911,
    "end": -700,
    "label": "约公元前911—前700年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-assyria"
      ]
    },
    {
      "regionId": "syria-northern-levant",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-oracc-governance-reviewed"
      ]
    },
    {
      "regionId": "southern-levant",
      "role": "influence",
      "approximate": true,
      "sourceIds": [
        "source-oracc-deportation"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "neo-assyrian-empire",
      "phaseId": "neo-assyrian-expansion",
      "role": "expandingPolity",
      "sourceIds": [
        "source-met-assyria",
        "source-oracc-governance-reviewed",
        "source-oracc-deportation"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-assyria-expansion-evidence",
      "sourceIds": [
        "source-met-assyria",
        "source-oracc-governance-reviewed",
        "source-oracc-deportation"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-assyria-expansion-uncertainty"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-met-assyria"
    ]
  },
  "sourceIds": [
    "source-met-assyria",
    "source-oracc-governance-reviewed",
    "source-oracc-deportation"
  ]
},
  { id: 'event-phoenician-westward-connections', kind: 'historicalProcess', title: '腓尼基海上联系向西扩展', timeSpan: { start: -1000, end: -700, label: '约公元前1000—前700年', approximate: true }, regions: [region('syria-northern-levant', 'core', ['source-met-phoenician-sailing']), region('central-mediterranean', 'exchange', ['source-antiquity-phoenician-diaspora'])], participants: [participant('phoenician-tradition', 'phoenician-maritime-connections', 'maritimeNetworkTradition', ['source-met-phoenician-sailing', 'source-antiquity-phoenician-diaspora'])], evidence: [evidence('event-phoenician-west-evidence', ['source-met-phoenician-sailing', 'source-antiquity-phoenician-diaspora'])], editorialReview: review(['source-antiquity-phoenician-diaspora'], { alternativeExplanationClaimIds: ['event-phoenician-west-alternative'] }), sourceIds: ['source-met-phoenician-sailing', 'source-antiquity-phoenician-diaspora'] },
  { id: 'event-israel-falls-to-assyria', kind: 'historicalProcess', title: '以色列王国被亚述吞并', timeSpan: { start: -853, end: -720, label: '公元前853—前720年' }, regions: [region('southern-levant', 'attested', ['source-bm-black-obelisk', 'source-oracc-israel'])], participants: [participant('kingdom-of-israel', 'israel-kingdom-presence', 'annexedPolity', ['source-oracc-israel']), participant('neo-assyrian-empire', 'neo-assyrian-expansion', 'annexingPolity', ['source-bm-black-obelisk', 'source-oracc-israel'])], evidence: [evidence('event-israel-falls-evidence', ['source-bm-black-obelisk', 'source-oracc-israel'])], editorialReview: review(['source-oracc-israel'], { uncertaintyClaimIds: ['event-israel-falls-date'] }), sourceIds: ['source-bm-black-obelisk', 'source-oracc-israel'] },
  {
  "id": "event-lachish-captured",
  "kind": "historicalEvent",
  "title": "亚述攻陷拉吉",
  "timeSpan": {
    "start": -701,
    "end": -701,
    "label": "公元前701年"
  },
  "regions": [
    {
      "regionId": "southern-levant",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-bm-lachish"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "neo-assyrian-empire",
      "phaseId": "neo-assyrian-imperial-administration",
      "role": "attackingPolity",
      "sourceIds": [
        "source-bm-lachish"
      ]
    },
    {
      "entityId": "kingdom-of-judah",
      "phaseId": "judah-kingdom-presence",
      "role": "defendingPolity",
      "sourceIds": [
        "source-bm-lachish"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-lachish-evidence",
      "sourceIds": [
        "source-bm-lachish"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [
      "event-lachish-royal-view"
    ],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-bm-lachish"
    ]
  },
  "sourceIds": [
    "source-bm-lachish"
  ]
},
  { id: 'event-aramaic-enters-imperial-administration', kind: 'historicalProcess', title: '阿拉米语进入帝国行政', timeSpan: { start: -800, end: -330, label: '约公元前800—前330年', approximate: true }, regions: [region('upper-mesopotamia', 'attested', ['source-oracc-palace-scribe']), region('iranian-plateau', 'attested', ['source-iranica-aramaic'])], participants: [participant('aramaic-language', 'aramaic-in-assyrian-administration', 'administrativeLanguage', ['source-oracc-palace-scribe']), participant('aramaic-language', 'aramaic-later-imperial-administration', 'continuingAdministrativeLanguage', ['source-iranica-aramaic']), participant('neo-assyrian-empire', 'neo-assyrian-imperial-administration', 'adoptingPolity', ['source-oracc-palace-scribe']), participant('neo-babylonian-empire', 'neo-babylonian-capital-and-rule', 'continuingPolityUser', ['source-iranica-aramaic'])], evidence: [evidence('event-aramaic-administration-evidence', ['source-oracc-palace-scribe', 'source-iranica-aramaic'])], editorialReview: review(['source-oracc-palace-scribe', 'source-iranica-aramaic'], { counterexampleClaimIds: ['event-aramaic-administration-counterexample'] }), sourceIds: ['source-oracc-palace-scribe', 'source-iranica-aramaic'] },
  {
  "id": "event-neo-babylonian-western-campaigns",
  "kind": "historicalProcess",
  "title": "新巴比伦帝国向西征服",
  "timeSpan": {
    "start": -605,
    "end": -586,
    "label": "公元前605—前586年"
  },
  "regions": [
    {
      "regionId": "syria-northern-levant",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-met-babylon"
      ]
    },
    {
      "regionId": "southern-levant",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-bm-babylonian-chronicle"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "neo-babylonian-empire",
      "phaseId": "neo-babylonian-capital-and-rule",
      "role": "conqueringPolity",
      "sourceIds": [
        "source-met-babylon",
        "source-bm-babylonian-chronicle"
      ]
    },
    {
      "entityId": "kingdom-of-judah",
      "phaseId": "judah-kingdom-presence",
      "role": "conqueredPolity",
      "sourceIds": [
        "source-bm-babylonian-chronicle"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-babylon-west-evidence",
      "sourceIds": [
        "source-met-babylon",
        "source-bm-babylonian-chronicle"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [
      "event-babylon-west-limitation"
    ],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-babylon-west-date"
    ],
    "alternativeExplanationClaimIds": [],
    "sourceIds": [
      "source-met-babylon",
      "source-bm-babylonian-chronicle"
    ]
  },
  "sourceIds": [
    "source-met-babylon",
    "source-bm-babylonian-chronicle"
  ]
},
  {
  "id": "event-lydian-coinage-emerges",
  "kind": "historicalProcess",
  "title": "吕底亚出现早期钱币",
  "timeSpan": {
    "start": -650,
    "end": -546,
    "label": "约公元前650—前546年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "western-anatolia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-sardis-coins",
        "source-met-sardis"
      ]
    }
  ],
  "participants": [
    {
      "entityId": "lydian-kingdom",
      "phaseId": "lydian-kingdom-presence",
      "role": "issuingPolity",
      "sourceIds": [
        "source-sardis-coins",
        "source-met-sardis"
      ]
    }
  ],
  "evidence": [
    {
      "v5ClaimBlockId": "event-lydian-coinage-evidence",
      "sourceIds": [
        "source-sardis-coins",
        "source-met-sardis"
      ]
    }
  ],
  "editorialReview": {
    "limitationClaimIds": [],
    "counterexampleClaimIds": [],
    "uncertaintyClaimIds": [
      "event-lydian-coinage-uncertainty"
    ],
    "alternativeExplanationClaimIds": [
      "event-lydian-coinage-alternative"
    ],
    "sourceIds": [
      "source-sardis-coins"
    ]
  },
  "sourceIds": [
    "source-sardis-coins",
    "source-met-sardis"
  ]
},
  { id: 'event-extractive-iron-metallurgy-develops', kind: 'historicalProcess', title: '工匠开始从矿石中获得铁坯', timeSpan: { start: -2000, end: -1000, label: '约公元前2000—前1000年', approximate: true }, regions: [region('anatolia-caucasus', 'attested', ['source-erb-satullo-iron-adoption'])], participants: [participant('iron', undefined, 'workedMaterial', ['source-erb-satullo-iron-adoption']), participant('iron', undefined, 'courtProducedMaterial', ['source-erb-satullo-iron-adoption'])], evidence: [evidence('event-extractive-iron-evidence', ['source-erb-satullo-iron-adoption'])], editorialReview: review(['source-erb-satullo-iron-adoption'], { limitationClaimIds: ['event-extractive-iron-preservation'] }), sourceIds: ['source-erb-satullo-iron-adoption'] },
  { id: 'event-iron-use-expands-after-palaces', kind: 'historicalProcess', title: '宫殿时代之后铁器使用扩大', timeSpan: { start: -1200, end: -800, label: '约公元前1200—前800年', approximate: true }, regions: [region('western-anatolia', 'attested', ['source-bsa-aegean-iron-technologies']), region('aegean-islands', 'attested', ['source-bsa-aegean-iron-technologies']), region('cyprus', 'attested', ['source-erb-satullo-iron-adoption']), region('southern-levant', 'attested', ['source-erb-satullo-iron-adoption'])], participants: [participant('iron', undefined, 'increasinglyUsedMaterial', ['source-erb-satullo-iron-adoption', 'source-bsa-aegean-iron-technologies'])], evidence: [evidence('event-iron-expands-evidence', ['source-erb-satullo-iron-adoption', 'source-bsa-aegean-iron-technologies'])], editorialReview: review(['source-erb-satullo-iron-adoption'], { counterexampleClaimIds: ['event-iron-expands-bronze'] }), sourceIds: ['source-erb-satullo-iron-adoption', 'source-bsa-aegean-iron-technologies'] },
  { id: 'event-cast-iron-develops-in-china', kind: 'historicalProcess', title: '中国工匠发展铸铁技术', timeSpan: { start: -800, end: -300, label: '约公元前800—前300年', approximate: true }, regions: [region('upper-yellow-river-hexi', 'attested', ['source-intarch-iron-china']), region('middle-yellow-river', 'attested', ['source-qian-huang-cast-iron-reviewed', 'source-han-chen-casting-iron-reviewed'])], participants: [participant('iron', undefined, 'castMaterial', ['source-qian-huang-cast-iron-reviewed', 'source-han-chen-casting-iron-reviewed', 'source-intarch-iron-china'])], evidence: [evidence('event-cast-iron-china-evidence', ['source-qian-huang-cast-iron-reviewed', 'source-han-chen-casting-iron-reviewed', 'source-intarch-iron-china'])], editorialReview: review(['source-qian-huang-cast-iron-reviewed', 'source-han-chen-casting-iron-reviewed', 'source-intarch-iron-china'], { alternativeExplanationClaimIds: ['event-cast-iron-china-paths'] }), sourceIds: ['source-qian-huang-cast-iron-reviewed', 'source-han-chen-casting-iron-reviewed', 'source-intarch-iron-china'] }
] as const satisfies readonly EventWithoutConceptLayer[];

const ironAgeNearEastEventReviewPartition = quarantineHistoricalProcesses(attachEventConceptLayers(
  ironAgeNearEastEventDefinitions,
  {
    'event-meteoric-iron-prestige-use': 'technologyAndExchange',
    'event-old-assyrian-trade-networks': 'technologyAndExchange',
    'event-ashurbanipal-collections-assembled': 'languageAndKnowledge',
    'event-israel-and-judah-develop-separate-kingships': 'polityAndSociety',
    'event-judean-communities-continue-after-exile': 'religionAndThought',
    'event-babylon-destroyed-and-rebuilt-under-assyria': 'eventAndConflict',
    'event-nebuchadnezzar-rebuilds-babylon': 'materialAndArchitecture',
    'event-neo-assyrian-expansion': 'eventAndConflict',
    'event-phoenician-westward-connections': 'technologyAndExchange',
    'event-israel-falls-to-assyria': 'eventAndConflict',
    'event-lachish-captured': 'eventAndConflict',
    'event-aramaic-enters-imperial-administration': 'languageAndKnowledge',
    'event-neo-babylonian-western-campaigns': 'eventAndConflict',
    'event-lydian-coinage-emerges': 'technologyAndExchange',
    'event-extractive-iron-metallurgy-develops': 'technologyAndExchange',
    'event-iron-use-expands-after-palaces': 'technologyAndExchange',
    'event-cast-iron-develops-in-china': 'technologyAndExchange'
  }
));

export const ironAgeNearEastEvents = ironAgeNearEastEventReviewPartition.acceptedEvents;
export const ironAgeNearEastPendingHistoricalProcesses = ironAgeNearEastEventReviewPartition.pendingHistoricalProcesses;
