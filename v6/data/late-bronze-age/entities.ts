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

export const lateBronzeAgeEntities = [
{
  "id": "hittite-language",
  "name": "赫梯语",
  "type": "language",
  "canonicalSummary": "古代安纳托利亚的语言，以楔形文字书写，大量泥板文书保存于赫梯都城哈图沙。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "hittite-language-central-use"
  ],
  "sourceIds": [
    "source-chicago-hittite-language-reviewed",
    "source-hittite-text-genres-usage"
  ]
},
  {
  "id": "hittite-empire",
  "type": "polity",
  "name": "赫梯帝国",
  "alternativeNames": [
    "Hittite Empire",
    "赫梯王国"
  ],
  "canonicalSummary": "以安纳托利亚为核心，通过王族驻地和附庸条约连接叙利亚诸国的王国。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "hittite-early-central-kingship",
    "hittite-syrian-control"
  ],
  "tags": [
    "安纳托利亚",
    "政权",
    "晚青铜时代"
  ],
  "sourceIds": [
    "source-bryce-hittite-kingdom",
    "source-beckman-hittite-diplomatic-texts",
    "source-unesco-hattusha",
    "source-met-hittites"
  ]
},
  {
  "id": "ugarit-kingdom",
  "type": "polity",
  "name": "乌加里特王国",
  "alternativeNames": [
    "Kingdom of Ugarit",
    "Ugarit"
  ],
  "canonicalSummary": "连接叙利亚内陆与地中海海路的沿海王国，宫廷和商人共同参与远距离贸易。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "ugarit-kingdom-presence"
  ],
  "tags": [
    "黎凡特",
    "港口王国",
    "晚青铜时代"
  ],
  "sourceIds": [
    "source-yon-city-of-ugarit",
    "source-met-ugarit",
    "source-french-ugarit-history"
  ]
},
  {
    id: 'amarna-letters-corpus',
    type: 'documentCorpus',
    name: '阿玛尔纳书信泥板',
    alternativeNames: ['Amarna Letters'],
    canonicalSummary: '约公元前14世纪保存在埃及阿玛尔纳的外交泥版文书群，记录大国国王和黎凡特地方统治者之间的礼物、婚姻、地位与军事请求。',
    conceptLayerId: 'materialAndArchitecture',
    phaseIds: ['amarna-diplomatic-correspondence'],
    tags: ['外交文书', '楔形文字', '晚青铜时代'],
    sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters']
  },
  {
    id: 'medinet-habu-war-records',
    type: 'documentCorpus',
    name: '麦迪奈特哈布战争浮雕',
    alternativeNames: ['Medinet Habu war reliefs and inscriptions'],
    canonicalSummary: '拉美西斯三世祭庙中的战争浮雕与铭文组合，以埃及王室视角表现北方来敌、陆战与尼罗河口战斗。',
    conceptLayerId: 'materialAndArchitecture',
    phaseIds: ['medinet-habu-war-records-created'],
    tags: ['埃及', '王室铭文', '战争图像'],
    sourceIds: [
      'source-isac-medinet-habu-i',
      'source-edgerton-wilson-ramesses-iii',
      'source-grandet-ramesses-iii'
    ]
  }
] as const satisfies readonly Entity[];

export const lateBronzeAgeEntityPhases = [
{
  "id": "hittite-language-central-use",
  "entityId": "hittite-language",
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
  "id": "hittite-early-central-kingship",
  "entityId": "hittite-empire",
  "title": "安纳托利亚中部核心阶段",
  "timeSpan": {
    "start": -1650,
    "end": -1350,
    "label": "约公元前1650—前1350年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-anatolia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-bryce-hittite-kingdom",
        "source-unesco-hattusha"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-bryce-hittite-kingdom",
    "source-unesco-hattusha"
  ]
},
  {
  "id": "hittite-syrian-control",
  "entityId": "hittite-empire",
  "title": "控制范围扩展至叙利亚内陆",
  "timeSpan": {
    "start": -1350,
    "end": -1180,
    "label": "约公元前1350—前1180年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-anatolia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-bryce-hittite-kingdom"
      ]
    },
    {
      "regionId": "syria-northern-levant",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-bryce-hittite-kingdom",
        "source-beckman-hittite-diplomatic-texts",
        "source-bm-kadesh-sallier",
        "source-spalinger-war-egypt",
        "source-bryce-neo-hittite-kingdoms"
      ]
    }
  ],
  "relationIds": [
    "relation-ugarit-hittite-vassal"
  ],
  "sourceIds": [
    "source-bryce-hittite-kingdom",
    "source-met-hittites",
    "source-beckman-hittite-diplomatic-texts",
    "source-bm-kadesh-sallier",
    "source-spalinger-war-egypt",
    "source-un-egypt-hatti-treaty",
    "source-bryce-neo-hittite-kingdoms"
  ]
},
  {
  "id": "ugarit-kingdom-presence",
  "entityId": "ugarit-kingdom",
  "title": "乌加里特王国存在期",
  "timeSpan": {
    "start": -1800,
    "end": -1180,
    "label": "约公元前1800—前1180年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "syria-northern-levant",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-yon-city-of-ugarit",
        "source-met-ugarit"
      ]
    }
  ],
  "relationIds": [
    "relation-ugarit-hittite-vassal"
  ],
  "sourceIds": [
    "source-yon-city-of-ugarit",
    "source-met-ugarit",
    "source-french-ugarit-history",
    "source-leriche-ugarit-after-1180"
  ]
},
  {
    id: 'amarna-diplomatic-correspondence',
    entityId: 'amarna-letters-corpus',
    title: '外交书信形成期',
    timeSpan: { start: -1360, end: -1330, label: '约公元前1360—前1330年', approximate: true },
    regions: [region('nile-valley', 'attested', ['source-met-amarna-letters', 'source-moran-amarna-letters'], false)],
    relationIds: [],
    sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters']
  },
  {
    id: 'medinet-habu-war-records-created',
    entityId: 'medinet-habu-war-records',
    title: '浮雕与铭文制作期',
    timeSpan: { start: -1180, end: -1150, label: '约公元前1180—前1150年', approximate: true },
    regions: [region('nile-valley', 'attested', ['source-isac-medinet-habu-i', 'source-grandet-ramesses-iii'], false)],
    relationIds: [],
    sourceIds: [
      'source-isac-medinet-habu-i',
      'source-edgerton-wilson-ramesses-iii',
      'source-grandet-ramesses-iii'
    ]
  }
] as const satisfies readonly EntityPhase[];
