import type {
  Entity,
  EntityPhase,
  RegionalAssociation,
  RegionalRole,
  SourceIds
} from '../../schema/index.ts';

function region(
  regionId: string,
  role: RegionalRole,
  sourceIds: SourceIds,
  approximate = true
): RegionalAssociation {
  return { regionId, role, approximate, sourceIds };
}

export const mesopotamiaEntities = [
{
  "id": "sumerian-language",
  "type": "language",
  "name": "苏美尔语",
  "canonicalSummary": "两河南部的古老语言，以楔形文字书写，留下了城市账目、史诗与宗教赞歌。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "sumerian-southern-use"
  ],
  "sourceIds": [
    "source-oracc-language-continuity",
    "source-met-sumerian-writing"
  ]
},
{
  "id": "akkadian-language",
  "type": "language",
  "name": "阿卡德语",
  "canonicalSummary": "两河流域长期使用的语言，以楔形文字书写，主要包括巴比伦和亚述两大方言。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "akkadian-southern-use",
    "akkadian-babylonian-use",
    "akkadian-assyrian-use"
  ],
  "sourceIds": [
    "source-oracc-language-continuity",
    "source-bm-akkadian-regional-forms-reviewed",
    "source-chicago-akkadian-usage",
    "source-met-assyrian-letter-usage"
  ]
},
  {
    id: 'rim-sin-i', type: 'person', name: '里姆辛一世',
    canonicalSummary: '拉尔萨国王；汉谟拉比的第31年年名记载其军队被击败、本人被制服。',
    conceptLayerId: 'polityAndSociety', phaseIds: [],
    sourceIds: ['source-cdli-hammurabi-year-31-reviewed']
  },
  {
    id: 'uruk',
    type: 'settlement',
    name: '乌鲁克',
    alternativeNames: ['Uruk', 'Erech'],
    canonicalSummary: '位于今天伊拉克南部的古代聚落遗址；当前展示公元前四千纪后期的城市发展片段，人口集中、公共建筑、物资管理与早期书写在这里留下了丰富证据。',
    conceptLayerId: 'placeAndSite',
    phaseIds: ['uruk-urban-expansion'],
    tags: ['西亚', '聚落遗址', '早期城市'],
    sourceIds: ['source-getty-uruk', 'source-met-uruk-first-city']
  },
  {
  "id": "cuneiform",
  "type": "writingSystem",
  "name": "楔形文字",
  "alternativeNames": [
    "Cuneiform"
  ],
  "canonicalSummary": "起源于两河流域的文字系统，以楔形笔画组合成符号，兼用词符和音节符号。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "cuneiform-hittite-use",
    "cuneiform-early-development",
    "cuneiform-multilingual-transmission",
    "cuneiform-eastern-mediterranean-diplomacy"
  ],
  "tags": [
    "西亚",
    "文字系统",
    "泥板"
  ],
  "sourceIds": [
    "source-englund-proto-cuneiform",
    "source-british-museum-cuneiform",
    "source-met-grammatical-text-object",
    "source-chicago-hittite-language-reviewed",
    "source-met-amarna-letters"
  ]
},
  {
  "id": "akkadian-empire",
  "type": "polity",
  "name": "阿卡德王朝",
  "alternativeNames": [
    "Akkadian Empire",
    "Kingdom of Akkad"
  ],
  "canonicalSummary": "萨尔贡及其继承者征服南部城邦，建立了以阿卡德为中心的跨地区王朝。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "akkadian-imperial-order",
    "akkadian-fragmentation"
  ],
  "tags": [
    "西亚",
    "政治实体",
    "阿卡德"
  ],
  "sourceIds": [
    "source-met-akkadian-period",
    "source-westenholz-kingdom-akkad"
  ]
},
  {
    id: 'epic-of-gilgamesh',
    type: 'literaryWork',
    name: '《吉尔伽美什史诗》',
    alternativeNames: ['Epic of Gilgamesh'],
    canonicalSummary: '讲述吉尔伽美什与恩奇都的友谊、失去与追寻永生的史诗；以约公元前12世纪的标准巴比伦版本为代表。',
    conceptLayerId: 'artAndLiterature',
    phaseIds: ['gilgamesh-standard-version-composition'],
    tags: ['西亚', '文学作品', '楔形文字'],
    sourceIds: [
      'source-george-babylonian-gilgamesh-epic',
      'source-met-gilgamesh-overview',
      'source-oxford-classical-dictionary-gilgamesh'
    ]
  },
  {
  "id": "ur-iii-kingdom",
  "type": "polity",
  "name": "乌尔第三王朝",
  "alternativeNames": [
    "Ur III Kingdom",
    "Third Dynasty of Ur"
  ],
  "canonicalSummary": "以乌尔为王都，重新联结两河南部城邦，以贡赋征集和密集的文书记录组织王国。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "ur-iii-kingdom-order"
  ],
  "tags": [
    "西亚",
    "政治实体",
    "乌尔第三王朝"
  ],
  "sourceIds": [
    "source-garfinkle-kingdom-ur",
    "source-oracc-ur-namma-inscriptions",
    "source-steinkeller-ur-iii-core-periphery",
    "source-met-isin-larsa-old-babylonian"
  ]
},
  {
  "id": "old-babylonian-kingdom",
  "type": "polity",
  "name": "古巴比伦王国",
  "alternativeNames": [
    "Old Babylonian Kingdom",
    "First Dynasty of Babylon"
  ],
  "canonicalSummary": "巴比伦第一王朝在汉谟拉比时期征服多个两河城邦，使巴比伦成为重要的政治中心。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "old-babylonian-city-kingdom-emergence"
  ],
  "tags": [
    "西亚",
    "政治实体",
    "巴比伦"
  ],
  "sourceIds": [
    "source-met-isin-larsa-old-babylonian",
    "source-podany-hammurabi-babylon",
    "source-louvre-hammurabi-code"
  ]
},
  {
    id: 'hammurabi-code',
    type: 'documentCorpus',
    name: '汉谟拉比法典石碑',
    alternativeNames: ['Laws of Hammurabi', 'Code of Hammurabi'],
    canonicalSummary: '汉谟拉比命人刻在大型石碑上的王室法律文本，约制于公元前1750年，以具体案件和王权图像宣示国王维护秩序与公正的权威。',
    conceptLayerId: 'materialAndArchitecture',
    phaseIds: ['hammurabi-code-stele-created'],
    tags: ['西亚', '法律文本', '王权'],
    sourceIds: ['source-louvre-hammurabi-code', 'source-ehammurabi-laws']
  },
  {
    id: 'tower-of-babel-tradition',
    type: 'literaryWork',
    name: '巴别塔故事',
    alternativeNames: ['Tower of Babel'],
    canonicalSummary: '《创世记》中以共同语言、建塔、语言混乱与人群分散为核心的故事，后来常与巴比伦的埃特曼安吉塔庙联系。',
    conceptLayerId: 'religionAndThought',
    phaseIds: [],
    tags: ['西亚', '文本传统', '巴比伦'],
    sourceIds: ['source-sefaria-genesis-11', 'source-george-tower-of-babel']
  }
] as const satisfies readonly Entity[];

export const mesopotamiaEntityPhases = [
{
  "id": "cuneiform-hittite-use",
  "entityId": "cuneiform",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1650,
    "end": -1180,
    "approximate": true,
    "label": "约前1650—前1180年"
  },
  "regions": [
    {
      "regionId": "central-anatolia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-chicago-hittite-language-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-chicago-hittite-language-reviewed"
  ]
},
{
  "id": "sumerian-southern-use",
  "entityId": "sumerian-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -2900,
    "end": -300,
    "label": "约前2900—前300年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "southern-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-oracc-language-continuity",
        "source-met-sumerian-writing"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-oracc-language-continuity",
    "source-met-sumerian-writing"
  ]
},
{
  "id": "akkadian-southern-use",
  "entityId": "akkadian-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -2500,
    "end": -300,
    "label": "约前2500—前300年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "southern-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-oracc-language-continuity"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-oracc-language-continuity"
  ]
},
  {
    id: 'uruk-urban-expansion',
    entityId: 'uruk',
    title: '乌鲁克晚期城市扩张',
    timeSpan: { start: -3500, end: -3000, label: '约公元前3500—前3000年', approximate: true },
    regions: [region('southern-mesopotamia', 'core', ['source-getty-uruk', 'source-met-uruk-first-city'], false)],
    relationIds: [],
    sourceIds: ['source-getty-uruk', 'source-met-uruk-first-city', 'source-adams-heartland-cities']
  },
  {
  "id": "cuneiform-early-development",
  "entityId": "cuneiform",
  "title": "两河南部长期书写",
  "timeSpan": {
    "start": -3350,
    "end": -300,
    "label": "约前3350—前300年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "southern-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-englund-proto-cuneiform",
        "source-met-origins-writing",
        "source-oracc-language-continuity"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-englund-proto-cuneiform",
    "source-met-origins-writing",
    "source-british-museum-cuneiform",
    "source-penn-uses-writing",
    "source-oracc-language-continuity"
  ]
},
  {
  "id": "cuneiform-multilingual-transmission",
  "entityId": "cuneiform",
  "title": "巴比伦及周边的书写见证",
  "timeSpan": {
    "start": -2000,
    "end": 75,
    "label": "约前2000—公元75年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-met-babylon",
        "source-met-grammatical-text-object"
      ]
    }
  ],
  "relationIds": [
    "relation-cuneiform-gilgamesh"
  ],
  "sourceIds": [
    "source-met-babylon",
    "source-met-grammatical-text-object",
    "source-british-museum-cuneiform"
  ]
},
  {
  "id": "cuneiform-eastern-mediterranean-diplomacy",
  "entityId": "cuneiform",
  "title": "阿玛尔纳时代黎凡特外交文书见证",
  "timeSpan": {
    "start": -1400,
    "end": -1300,
    "label": "约前1400—前1300年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "southern-levant",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-met-amarna-letters"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-met-amarna-letters",
    "source-moran-amarna-letters"
  ]
},
  {
  "id": "akkadian-imperial-order",
  "entityId": "akkadian-empire",
  "title": "以中部为核心并控制南部城邦",
  "timeSpan": {
    "start": -2350,
    "end": -2200,
    "label": "约公元前2350—前2200年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-akkadian-period",
        "source-westenholz-kingdom-akkad"
      ]
    },
    {
      "regionId": "southern-mesopotamia",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-met-akkadian-period",
        "source-westenholz-kingdom-akkad"
      ]
    },
    {
      "regionId": "upper-mesopotamia",
      "role": "influence",
      "approximate": true,
      "sourceIds": [
        "source-westenholz-kingdom-akkad",
        "source-frayne-sargonic-inscriptions"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-met-akkadian-period",
    "source-westenholz-kingdom-akkad",
    "source-frayne-sargonic-inscriptions"
  ]
},
  {
  "id": "akkadian-fragmentation",
  "entityId": "akkadian-empire",
  "title": "收缩至阿卡德城周边",
  "timeSpan": {
    "start": -2200,
    "end": -2150,
    "label": "约公元前2200—前2150年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-akkadian-period"
      ]
    }
  ],
  "relationIds": [
    "relation-akkadian-ur-iii-transition"
  ],
  "sourceIds": [
    "source-met-akkadian-period"
  ]
},
  {
    id: 'gilgamesh-standard-version-composition',
    entityId: 'epic-of-gilgamesh',
    title: '标准巴比伦版本成文',
    timeSpan: { start: -1150, end: -1150, label: '约公元前12世纪', approximate: true },
    regions: [
      region('central-mesopotamia', 'associated', ['source-met-gilgamesh-overview'])
    ],
    relationIds: ['relation-cuneiform-gilgamesh'],
    sourceIds: [
      'source-george-babylonian-gilgamesh-epic',
      'source-met-gilgamesh-overview',
      'source-oxford-classical-dictionary-gilgamesh'
    ]
  },
  {
  "id": "ur-iii-kingdom-order",
  "entityId": "ur-iii-kingdom",
  "title": "两河南部城邦",
  "timeSpan": {
    "start": -2112,
    "end": -2004,
    "label": "约公元前2112—前2004年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "southern-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-garfinkle-kingdom-ur"
      ]
    }
  ],
  "relationIds": [
    "relation-akkadian-ur-iii-transition"
  ],
  "sourceIds": [
    "source-garfinkle-kingdom-ur",
    "source-steinkeller-ur-iii-core-periphery",
    "source-cambridge-ur-iii-old-babylonian-transition"
  ]
},
  
  {
  "id": "old-babylonian-city-kingdom-emergence",
  "entityId": "old-babylonian-kingdom",
  "title": "巴比伦王国核心",
  "timeSpan": {
    "start": -1894,
    "end": -1595,
    "label": "约公元前1894—前1595年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-isin-larsa-old-babylonian"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-met-isin-larsa-old-babylonian",
    "source-podany-hammurabi-babylon",
    "source-cdli-hammurabi-year-names",
    "source-cdli-samsuiluna-year-names"
  ]
},
  
  
  {
    id: 'hammurabi-code-stele-created',
    entityId: 'hammurabi-code',
    title: '法典石碑制作',
    timeSpan: { start: -1750, end: -1750, label: '约公元前1750年', approximate: true },
    regions: [region('central-mesopotamia', 'origin', ['source-louvre-hammurabi-code', 'source-ehammurabi-laws'])],
    relationIds: [],
    sourceIds: ['source-louvre-hammurabi-code', 'source-ehammurabi-laws', 'source-cdli-law-collections']
  },
{
  "id": "akkadian-babylonian-use",
  "entityId": "akkadian-language",
  "title": "巴比伦地区的使用",
  "timeSpan": {
    "start": -2000,
    "end": -300,
    "approximate": true,
    "label": "约前2000—前300年"
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-bm-akkadian-regional-forms-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-bm-akkadian-regional-forms-reviewed"
  ]
},
{
  "id": "akkadian-assyrian-use",
  "entityId": "akkadian-language",
  "title": "亚述地区的使用",
  "timeSpan": {
    "start": -2000,
    "end": -600,
    "approximate": true,
    "label": "约前2000—前600年"
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-bm-akkadian-regional-forms-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-bm-akkadian-regional-forms-reviewed"
  ]
}
] as const satisfies readonly EntityPhase[];
