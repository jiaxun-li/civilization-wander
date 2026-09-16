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

export const ancientChinaEntities = [
{
  "id": "old-chinese-language",
  "name": "上古汉语",
  "type": "language",
  "canonicalSummary": "商周至战国时期的早期汉语，保存在甲骨卜辞、青铜器铭文和传世文献中。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "old-chinese-language-anyang-use",
    "old-chinese-language-zhou-use"
  ],
  "sourceIds": [
    "source-schuessler-old-chinese-reviewed",
    "source-penn-oracle-bone-reviewed",
    "source-met-zhou-inscriptions-reviewed",
    "source-unesco-oracle-bones",
    "source-national-museum-li-gui"
  ]
},
{
  "id": "chinese-writing-system",
  "name": "汉字",
  "type": "writingSystem",
  "canonicalSummary": "在商周至战国时期持续发展的文字系统，甲骨文和金文保留了不同的早期字形。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "chinese-writing-system-anyang-use",
    "chinese-writing-system-zhou-use"
  ],
  "sourceIds": [
    "source-schuessler-old-chinese-reviewed",
    "source-penn-oracle-bone-reviewed",
    "source-met-zhou-inscriptions-reviewed",
    "source-unesco-oracle-bones",
    "source-national-museum-li-gui"
  ]
},
  {
  "id": "western-zhou",
  "type": "polity",
  "name": "西周",
  "alternativeNames": [
    "Western Zhou"
  ],
  "canonicalSummary": "周王室以关中和洛阳为中心，通过封国、册命与祖先祭祀连接黄河中下游的政治中心。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "western-zhou-regional-rule"
  ],
  "tags": [
    "古中国",
    "政治实体",
    "青铜时代"
  ],
  "sourceIds": [
    "source-national-museum-li-gui",
    "source-western-zhou-domain",
    "source-cook-western-zhou-rites",
    "source-li-feng-western-zhou-fall",
    "source-national-museum-da-yu-ding",
    "source-national-museum-ceming",
    "source-hk-history-museum-zhou-organization"
  ]
},
  {
    id: 'erlitou-site',
    type: 'archaeologicalSite',
    name: '二里头遗址',
    alternativeNames: ['Erlitou'],
    canonicalSummary: '位于洛阳盆地的大型考古遗址；道路、中央建筑区、专业作坊和差异化墓葬保存了早期城市秩序的重要证据。',
    conceptLayerId: 'placeAndSite',
    phaseIds: ['erlitou-site-presence'],
    tags: ['古中国', '考古遗址', '早期青铜时代'],
    sourceIds: ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement', 'source-erlitou-radiocarbon']
  },
  {
  "id": "shang-civilization",
  "type": "polity",
  "name": "商王朝",
  "alternativeNames": [
    "Shang dynasty",
    "商"
  ],
  "canonicalSummary": "以王室、城市和祖先祭祀为中心的早期王朝，发展了青铜礼器与甲骨占卜。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "shang-regional-rule"
  ],
  "tags": [
    "古中国",
    "政治实体",
    "青铜时代"
  ],
  "sourceIds": [
    "source-bagley-shang-archaeology",
    "source-keightley-ancestral-landscape",
    "source-unesco-yinxu",
    "source-an-zhengzhou-shang-city",
    "source-smithsonian-shang-dynasty"
  ]
},
  {
    id: 'shang-oracle-bone-inscriptions',
    type: 'documentCorpus',
    name: '甲骨卜辞',
    alternativeNames: ['oracle-bone inscriptions', '甲骨文'],
    canonicalSummary: '晚商王室在牛肩胛骨和龟甲上留下的占卜文献群，记录日期、所问之事、判断与部分结果。',
    conceptLayerId: 'materialAndArchitecture',
    phaseIds: ['shang-oracle-bone-royal-divination-corpus'],
    tags: ['古中国', '文献群', '占卜'],
    sourceIds: ['source-keightley-shang-history', 'source-unesco-oracle-bones', 'source-schwartz-huayuanzhuang']
  },
  {
    id: 'shang-bronze-ritual-vessels',
    type: 'artifactClass',
    name: '商代青铜礼器',
    alternativeNames: ['Shang ritual bronzes', '青铜礼器'],
    canonicalSummary: '由商代工匠以陶范铸造、用于酒食祭献并常随主人入墓的一类青铜器物。',
    conceptLayerId: 'materialAndArchitecture',
    phaseIds: ['shang-bronzes-erligang-production', 'shang-bronzes-late-ritual-use'],
    tags: ['古中国', '器物类别', '祖先礼仪'],
    sourceIds: ['source-bagley-shang-archaeology', 'source-met-shang-zhou-bronze', 'source-smithsonian-bronze-casting']
  },
  {
    id: 'sanxingdui-site',
    type: 'archaeologicalSite',
    name: '三星堆遗址',
    alternativeNames: ['Sanxingdui'],
    canonicalSummary: '位于四川盆地、在青铜时代长期发展的考古遗址；城址与集中埋藏的青铜、金、玉和象牙保存了成都平原独特的仪式世界。',
    conceptLayerId: 'placeAndSite',
    phaseIds: ['sanxingdui-site-presence'],
    tags: ['古中国', '考古遗址', '四川盆地'],
    sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023']
  }
] as const satisfies readonly Entity[];

export const ancientChinaEntityPhases = [
{
  "id": "old-chinese-language-anyang-use",
  "entityId": "old-chinese-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1250,
    "end": -300,
    "approximate": true,
    "label": "约前1250—前300年"
  },
  "regions": [
    {
      "regionId": "north-china-plain",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-schuessler-old-chinese-reviewed",
        "source-penn-oracle-bone-reviewed",
        "source-unesco-oracle-bones"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-schuessler-old-chinese-reviewed",
    "source-penn-oracle-bone-reviewed",
    "source-unesco-oracle-bones"
  ]
},
{
  "id": "old-chinese-language-zhou-use",
  "entityId": "old-chinese-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1046,
    "end": -300,
    "approximate": true,
    "label": "约前1046—前300年"
  },
  "regions": [
    {
      "regionId": "middle-yellow-river",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-schuessler-old-chinese-reviewed",
        "source-met-zhou-inscriptions-reviewed",
        "source-national-museum-li-gui"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-schuessler-old-chinese-reviewed",
    "source-met-zhou-inscriptions-reviewed",
    "source-national-museum-li-gui"
  ]
},
{
  "id": "chinese-writing-system-anyang-use",
  "entityId": "chinese-writing-system",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1250,
    "end": -300,
    "approximate": true,
    "label": "约前1250—前300年"
  },
  "regions": [
    {
      "regionId": "north-china-plain",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-schuessler-old-chinese-reviewed",
        "source-penn-oracle-bone-reviewed",
        "source-unesco-oracle-bones"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-schuessler-old-chinese-reviewed",
    "source-penn-oracle-bone-reviewed",
    "source-unesco-oracle-bones"
  ]
},
{
  "id": "chinese-writing-system-zhou-use",
  "entityId": "chinese-writing-system",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1046,
    "end": -300,
    "approximate": true,
    "label": "约前1046—前300年"
  },
  "regions": [
    {
      "regionId": "middle-yellow-river",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-schuessler-old-chinese-reviewed",
        "source-met-zhou-inscriptions-reviewed",
        "source-national-museum-li-gui"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-schuessler-old-chinese-reviewed",
    "source-met-zhou-inscriptions-reviewed",
    "source-national-museum-li-gui"
  ]
},
  {
  "id": "western-zhou-regional-rule",
  "entityId": "western-zhou",
  "title": "关中、洛阳与东方封国",
  "timeSpan": {
    "start": -1046,
    "end": -771,
    "label": "约公元前1046—前771年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "middle-yellow-river",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-national-museum-li-gui",
        "source-national-museum-da-yu-ding"
      ]
    },
    {
      "regionId": "north-china-plain",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-western-zhou-domain"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-national-museum-li-gui",
    "source-national-museum-da-yu-ding",
    "source-national-museum-ceming",
    "source-western-zhou-domain",
    "source-cook-western-zhou-rites",
    "source-li-feng-early-china",
    "source-li-feng-western-zhou-fall"
  ]
},
  
  {
    id: 'erlitou-site-presence', entityId: 'erlitou-site', title: '黄河中游遗址存在期',
    timeSpan: { start: -1900, end: -1500, label: '约公元前1900—前1500年', approximate: true },
    regions: [region('middle-yellow-river', 'attested', [
      'source-erlitou-cass-report',
      'source-zhao-erlitou-settlement',
      'source-erlitou-rethinking'
    ], false)],
    relationIds: ['relation-erlitou-shang-transition'],
    sourceIds: [
      'source-erlitou-cass-report',
      'source-zhao-erlitou-settlement',
      'source-erlitou-radiocarbon',
      'source-erlitou-rethinking',
      'source-liu-chen-archaeology-china'
    ]
  },
  {
  "id": "shang-regional-rule",
  "entityId": "shang-civilization",
  "title": "黄河中游与华北平原统治范围",
  "timeSpan": {
    "start": -1600,
    "end": -1046,
    "label": "约公元前1600—前1046年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "middle-yellow-river",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-an-zhengzhou-shang-city",
        "source-bagley-shang-archaeology"
      ]
    },
    {
      "regionId": "north-china-plain",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-steinke-erligang",
        "source-unesco-yinxu"
      ]
    }
  ],
  "relationIds": [
    "relation-erlitou-shang-transition"
  ],
  "sourceIds": [
    "source-an-zhengzhou-shang-city",
    "source-steinke-erligang",
    "source-bagley-shang-archaeology",
    "source-keightley-ancestral-landscape",
    "source-unesco-yinxu",
    "source-national-museum-li-gui",
    "source-anyang-fall",
    "source-khayutina-cultural-memory"
  ]
},
  {
    id: 'shang-oracle-bone-royal-divination-corpus', entityId: 'shang-oracle-bone-inscriptions', title: '晚商卜辞形成期',
    timeSpan: { start: -1250, end: -1046, label: '约公元前1250—前1046年', approximate: true },
    regions: [region('north-china-plain', 'attested', ['source-keightley-shang-history', 'source-unesco-oracle-bones'], false)],
    relationIds: [], sourceIds: ['source-keightley-shang-history', 'source-unesco-oracle-bones', 'source-schwartz-huayuanzhuang']
  },
  {
    id: 'shang-bronzes-erligang-production', entityId: 'shang-bronze-ritual-vessels', title: '黄河中游礼器见证',
    timeSpan: { start: -1600, end: -1400, label: '约公元前1600—前1400年', approximate: true },
    regions: [region('middle-yellow-river', 'attested', ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting'])],
    relationIds: [], sourceIds: ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting']
  },
  {
    id: 'shang-bronzes-late-ritual-use', entityId: 'shang-bronze-ritual-vessels', title: '黄河中游与华北礼器见证',
    timeSpan: { start: -1400, end: -1046, label: '约公元前1400—前1046年', approximate: true },
    regions: [region('north-china-plain', 'attested', ['source-met-shang-zhou-bronze']), region('middle-yellow-river', 'attested', ['source-bagley-shang-archaeology'])],
    relationIds: ['relation-sanxingdui-shang-bronze-comparison'], sourceIds: ['source-bagley-shang-archaeology', 'source-met-shang-zhou-bronze']
  },
  {
    id: 'sanxingdui-site-presence', entityId: 'sanxingdui-site', title: '三星堆城址发展见证',
    timeSpan: { start: -1800, end: -950, label: '约公元前1800—前950年', approximate: true },
    regions: [region('sichuan-basin', 'attested', [
      'source-sxd-antiquity-2022',
      'source-sxd-sacrificial-area-2023',
      'source-sxd-ritual-pits-2025'
    ], false)],
    relationIds: ['relation-sanxingdui-shang-bronze-comparison'],
    sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025']
  }
] as const satisfies readonly EntityPhase[];
