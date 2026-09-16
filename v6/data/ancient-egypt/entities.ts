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

export const ancientEgyptEntities = [
{
  "id": "egyptian-language",
  "type": "language",
  "name": "埃及语",
  "canonicalSummary": "尼罗河流域长期使用的语言，以象形文字、僧侣体和世俗体等形式书写。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "egyptian-language-nile-use"
  ],
  "sourceIds": [
    "source-ucl-egyptian-language",
    "source-ucl-egyptian-literacy-usage",
    "source-ucl-hieratic-usage"
  ]
},
{
  "id": "egyptian-hieratic",
  "type": "writingSystem",
  "name": "僧侣体",
  "canonicalSummary": "由象形文字简化而来的草写体，笔画连贯，适合快速书写。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "hieratic-nile-use"
  ],
  "sourceIds": [
    "source-ucl-writing-scope",
    "source-ucl-hieratic"
  ]
},
{
  "id": "egyptian-demotic",
  "type": "writingSystem",
  "name": "世俗体",
  "canonicalSummary": "由埃及草写传统发展而来的书体，字形进一步简化，与象形文字和僧侣体长期并存。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "demotic-nile-use"
  ],
  "sourceIds": [
    "source-ucl-demotic",
    "source-ucl-writing-scope",
    "source-ucl-papyrus-ostraca-reviewed",
    "source-ucl-hieratic"
  ]
},
  {
  "id": "egypt-old-kingdom",
  "type": "polity",
  "name": "古埃及古王国",
  "alternativeNames": [
    "Old Kingdom of Egypt"
  ],
  "canonicalSummary": "统一王权组织尼罗河流域的资源，建造金字塔与大型王室陵墓。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "egypt-old-kingdom-regional-presence"
  ],
  "tags": [
    "非洲",
    "古埃及",
    "政治实体"
  ],
  "sourceIds": [
    "source-met-old-kingdom",
    "source-muller-old-kingdom-end",
    "source-ucl-memphis-background"
  ]
},
  {
  "id": "egypt-middle-kingdom",
  "type": "polity",
  "name": "古埃及中王国",
  "alternativeNames": [
    "Middle Kingdom of Egypt"
  ],
  "canonicalSummary": "底比斯王室重新统一埃及，随后向下努比亚扩展，并迎来文学与艺术的繁荣。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "egypt-middle-kingdom-reunification",
    "egypt-middle-kingdom-consolidated-order"
  ],
  "tags": [
    "非洲",
    "古埃及",
    "政治实体"
  ],
  "sourceIds": [
    "source-ucl-middle-kingdom",
    "source-met-middle-kingdom",
    "source-uee-second-intermediate",
    "source-ucl-middle-kingdom-guide",
    "source-ucl-nubia-middle-kingdom"
  ]
},
  {
  "id": "egypt-new-kingdom",
  "type": "polity",
  "name": "古埃及新王国",
  "alternativeNames": [
    "New Kingdom of Egypt"
  ],
  "canonicalSummary": "埃及王权向努比亚与黎凡特扩展，王室以远征、外交和大型神庙连接各地。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "egypt-new-kingdom-reunification",
    "egypt-new-kingdom-nubian-expansion",
    "egypt-new-kingdom-imperial-court-order",
    "egypt-new-kingdom-fragmentation"
  ],
  "tags": [
    "非洲",
    "古埃及",
    "政治实体"
  ],
  "sourceIds": [
    "source-met-new-kingdom",
    "source-hayes-scepter-ii",
    "source-ucl-memphis-background",
    "source-met-akhenaten-city",
    "source-ucl-ramesses-ii",
    "source-ucl-egypt-asia-new-kingdom"
  ]
},
  {
    id: 'egypt-pyramids',
    type: 'monument',
    name: '古王国金字塔营建',
    alternativeNames: ['Egyptian pyramids'],
    canonicalSummary: '古王国王室陵墓从阶梯金字塔发展为平滑斜面的金字塔建筑群。这里选取约前2700—前2400年的早期营建范围，包括左塞尔、斯尼夫鲁和吉萨工程，不表示埃及全部金字塔的存在起止。',
    conceptLayerId: 'materialAndArchitecture',
    phaseIds: ['egypt-pyramids-nile-presence'],
    tags: ['非洲', '古埃及', '纪念建筑', '建筑'],
    sourceIds: ['source-met-old-kingdom', 'source-ucl-pyramid-shape', 'source-ucl-pyramids-overview']
  },
  {
    id: 'egyptian-religion',
    type: 'religiousTradition',
    name: '古埃及丧葬信仰',
    alternativeNames: ['Ancient Egyptian funerary beliefs'],
    canonicalSummary: '通过身体保存、供奉、咒语和审判理解死亡与重生的信仰。金字塔文、棺材文和《死者之书》在不同载体上保存相关祈愿与死后旅程知识；这里展示古王国至新王国的尼罗河谷见证，不代表全部古埃及宗教的起止。',
    conceptLayerId: 'religionAndThought',
    phaseIds: ['egyptian-religion-nile-presence'],
    tags: ['非洲', '古埃及', '宗教传统', '死后世界'],
    sourceIds: ['source-ucl-burial-customs', 'source-ucl-religious-texts', 'source-ucl-coffin-texts', 'source-bm-book-of-dead', 'source-ucl-book-of-dead-faq', 'source-bm-afterlife-journey']
  },
  {
    id: 'egyptian-art',
    type: 'artisticTradition',
    name: '古埃及艺术',
    alternativeNames: ['Ancient Egyptian art'],
    canonicalSummary: '用人物朝向、比例、服饰、姿势和材料表现身份、祭祀与永生的视觉传统。这里收录约前2700—前1100年的尼罗河谷作品；阿玛尔纳的王室形象曾改变传统表现方式，阿布辛贝等努比亚纪念建筑也留有古埃及艺术作品。',
    conceptLayerId: 'artAndLiterature',
    phaseIds: ['egyptian-art-formal-conventions'],
    tags: ['非洲', '古埃及', '艺术传统'],
    sourceIds: ['source-met-ancient-egypt-art', 'source-arnold-pyramids', 'source-met-akhenaten-city', 'source-egypt-monuments-abu-simbel']
  },
  {
  "id": "egyptian-hieroglyphs",
  "type": "writingSystem",
  "name": "古埃及象形文字",
  "alternativeNames": [
    "Egyptian hieroglyphs"
  ],
  "canonicalSummary": "以人物、动物和器物等形象构成符号，结合表音、表意及限定含义的符号记录文字。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "egyptian-hieroglyphs-monumental-and-cursive-use"
  ],
  "tags": [
    "非洲",
    "古埃及",
    "文字系统",
    "语言"
  ],
  "sourceIds": [
    "source-ucl-hieroglyphic-system",
    "source-ucl-writing-development",
    "source-bm-hieroglyphs-decipherment",
    "source-ucl-hieratic"
  ]
},
  {
    id: 'sinuhe-work',
    type: 'literaryWork',
    name: '《辛奴赫的故事》',
    alternativeNames: ['The Tale of Sinuhe', 'Story of Sinuhe'],
    canonicalSummary: '讲述辛奴赫离开埃及、在异乡生活并最终返乡的古埃及文学作品。',
    conceptLayerId: 'artAndLiterature',
    phaseIds: ['sinuhe-work-formation'],
    tags: ['非洲', '古埃及', '文学作品'],
    sourceIds: ['source-ucl-sinuhe', 'source-bm-sinuhe-literature']
  },
] as const satisfies readonly Entity[];

export const ancientEgyptEntityPhases = [
{
  "id": "egyptian-language-nile-use",
  "entityId": "egyptian-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -3000,
    "end": -300,
    "label": "约前3000—前300年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-ucl-egyptian-language"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-ucl-egyptian-language"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-ucl-egyptian-language"
  ]
},
{
  "id": "hieratic-nile-use",
  "entityId": "egyptian-hieratic",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -3000,
    "end": -300,
    "label": "约前3000—前300年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-ucl-writing-scope",
        "source-ucl-hieratic"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-ucl-writing-scope",
    "source-ucl-hieratic"
  ]
},
{
  "id": "demotic-nile-use",
  "entityId": "egyptian-demotic",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -650,
    "end": -300,
    "label": "约前650—前300年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-ucl-demotic",
        "source-ucl-writing-scope"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-ucl-demotic",
        "source-ucl-writing-scope"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-ucl-demotic",
    "source-ucl-writing-scope"
  ]
},
  {
  "id": "egypt-old-kingdom-regional-presence",
  "entityId": "egypt-old-kingdom",
  "title": "尼罗河谷与三角洲",
  "timeSpan": {
    "start": -2686,
    "end": -2181,
    "label": "约公元前2686—前2181年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-old-kingdom",
        "source-muller-old-kingdom-end"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-met-old-kingdom",
        "source-muller-old-kingdom-end"
      ]
    }
  ],
  "relationIds": [
    "relation-egypt-old-middle-kingdom-transition"
  ],
  "sourceIds": [
    "source-met-old-kingdom",
    "source-muller-old-kingdom-end",
    "source-ucl-egypt-chronology"
  ]
},
  {
  "id": "egypt-middle-kingdom-reunification",
  "entityId": "egypt-middle-kingdom",
  "title": "尼罗河流域统一",
  "timeSpan": {
    "start": -2025,
    "end": -1960,
    "label": "约公元前2025—前1960年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "core",
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
  "relationIds": [
    "relation-egypt-old-middle-kingdom-transition"
  ],
  "sourceIds": [
    "source-ucl-mentuhotep-ii",
    "source-ucl-middle-kingdom",
    "source-ucl-egypt-chronology"
  ]
},
  {
  "id": "egypt-middle-kingdom-consolidated-order",
  "entityId": "egypt-middle-kingdom",
  "title": "沿下努比亚设置要塞",
  "timeSpan": {
    "start": -1960,
    "end": -1700,
    "label": "约公元前1960—前1700年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-ucl-middle-kingdom",
        "source-met-middle-kingdom"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-met-middle-kingdom"
      ]
    },
    {
      "regionId": "nubia",
      "role": "influence",
      "approximate": true,
      "sourceIds": [
        "source-ucl-nubia-middle-kingdom",
        "source-ucl-buhen-middle-kingdom"
      ]
    }
  ],
  "relationIds": [
    "relation-egypt-middle-new-kingdom-transition"
  ],
  "sourceIds": [
    "source-ucl-middle-kingdom",
    "source-met-middle-kingdom",
    "source-ucl-nubia-middle-kingdom",
    "source-ucl-second-intermediate",
    "source-uee-second-intermediate",
    "source-ucl-egypt-chronology"
  ]
},
  
  
{
  "id": "egypt-new-kingdom-reunification",
  "entityId": "egypt-new-kingdom",
  "title": "尼罗河流域重新统一",
  "timeSpan": {
    "start": -1550,
    "end": -1500,
    "label": "约公元前1550—前1500年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-ucl-ahmose",
        "source-met-new-kingdom"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-ucl-ahmose"
      ]
    }
  ],
  "relationIds": [
    "relation-egypt-middle-new-kingdom-transition"
  ],
  "sourceIds": [
    "source-ucl-ahmose",
    "source-met-new-kingdom",
    "source-ucl-egypt-chronology"
  ]
},
{
  "id": "egypt-new-kingdom-nubian-expansion",
  "entityId": "egypt-new-kingdom",
  "title": "向努比亚扩展",
  "timeSpan": {
    "start": -1500,
    "end": -1450,
    "label": "约公元前1500—前1450年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-akmenkalns-nubian-egyptian-interactions"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-akmenkalns-nubian-egyptian-interactions"
      ]
    },
    {
      "regionId": "nubia",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-akmenkalns-nubian-egyptian-interactions"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-ucl-ahmose",
    "source-met-new-kingdom",
    "source-ucl-egypt-chronology",
    "source-akmenkalns-nubian-egyptian-interactions"
  ]
},
  {
  "id": "egypt-new-kingdom-imperial-court-order",
  "entityId": "egypt-new-kingdom",
  "title": "扩展至南黎凡特",
  "timeSpan": {
    "start": -1450,
    "end": -1145,
    "label": "约公元前1450—前1145年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-new-kingdom",
        "source-hayes-scepter-ii"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-met-new-kingdom"
      ]
    },
    {
      "regionId": "nubia",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-ucl-nubia-new-kingdom"
      ]
    },
    {
      "regionId": "southern-levant",
      "role": "influence",
      "approximate": true,
      "sourceIds": [
        "source-hayes-scepter-ii"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-met-new-kingdom",
    "source-hayes-scepter-ii",
    "source-ucl-nubia-new-kingdom",
    "source-ucl-egypt-asia-new-kingdom",
    "source-ucl-ramesses-iv"
  ]
},
  {
  "id": "egypt-new-kingdom-fragmentation",
  "entityId": "egypt-new-kingdom",
  "title": "撤出南黎凡特",
  "timeSpan": {
    "start": -1145,
    "end": -1069,
    "label": "约公元前1145—前1069年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-ucl-egypt-asia-new-kingdom",
        "source-ucl-ramesses-iv",
        "source-akmenkalns-nubian-egyptian-interactions"
      ]
    },
    {
      "regionId": "nile-delta",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-ucl-egypt-asia-new-kingdom",
        "source-ucl-ramesses-iv",
        "source-akmenkalns-nubian-egyptian-interactions"
      ]
    },
    {
      "regionId": "nubia",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-ucl-egypt-asia-new-kingdom",
        "source-ucl-ramesses-iv",
        "source-akmenkalns-nubian-egyptian-interactions"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-turin-strike-papyrus",
    "source-uee-early-mid-20th-dynasty",
    "source-met-third-intermediate",
    "source-ucl-egypt-asia-new-kingdom",
    "source-ucl-ramesses-iv",
    "source-akmenkalns-nubian-egyptian-interactions"
  ]
},
  {
    id: 'egypt-pyramids-nile-presence',
    entityId: 'egypt-pyramids',
    title: '古王国早期金字塔营建',
    timeSpan: { start: -2700, end: -2400, label: '约公元前2700—前2400年', approximate: true },
    regions: [region('nile-valley', 'attested', [
      'source-ucl-pyramid-shape',
      'source-ucl-pyramids-overview',
      'source-ifao-merer-log',
      'source-aera-lost-city',
      'source-aera-feeding-workers'
    ])],
    relationIds: [],
    sourceIds: [
      'source-ucl-pyramid-shape',
      'source-ucl-pyramids-overview',
      'source-ifao-merer-log',
      'source-aera-lost-city',
      'source-aera-feeding-workers'
    ]
  },
  {
    id: 'egyptian-religion-nile-presence',
    entityId: 'egyptian-religion',
    title: '古王国至新王国的丧葬信仰见证',
    timeSpan: { start: -2686, end: -1069, label: '约公元前2686—前1069年', approximate: true },
    regions: [region('nile-valley', 'attested', [
      'source-ucl-burial-customs',
      'source-ucl-religious-texts',
      'source-ucl-coffin-texts',
      'source-bm-book-of-dead',
      'source-bm-afterlife-journey'
    ])],
    relationIds: [],
    sourceIds: [
      'source-ucl-burial-customs',
      'source-ucl-religious-texts',
      'source-ucl-cult-offerings',
      'source-ucl-coffin-texts',
      'source-bm-book-of-dead',
      'source-bm-afterlife-journey',
      'source-ucl-book-of-dead-125'
    ]
  },
  {
    id: 'egyptian-art-formal-conventions',
    entityId: 'egyptian-art',
    title: '尼罗河谷艺术作品见证',
    timeSpan: { start: -2700, end: -1100, label: '约公元前2700—前1100年', approximate: true },
    regions: [region('nile-valley', 'attested', ['source-met-ancient-egypt-art', 'source-arnold-pyramids', 'source-met-hatshepsut-publication', 'source-met-akhenaten-city'])],
    relationIds: [],
    sourceIds: ['source-met-ancient-egypt-art', 'source-arnold-pyramids', 'source-met-hatshepsut-publication', 'source-met-akhenaten-city']
  },
  {
  "id": "egyptian-hieroglyphs-monumental-and-cursive-use",
  "entityId": "egyptian-hieroglyphs",
  "title": "尼罗河谷象形文字见证",
  "timeSpan": {
    "start": -3250,
    "end": 394,
    "label": "约前3250—公元394年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "nile-valley",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-ucl-writing-development",
        "source-ucl-hieroglyphic-system",
        "source-bm-hieroglyphs-decipherment"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-ucl-writing-development",
    "source-ucl-hieroglyphic-system",
    "source-bm-hieroglyphs-decipherment"
  ]
},
  {
    id: 'sinuhe-work-formation',
    entityId: 'sinuhe-work',
    title: '故事成篇',
    timeSpan: { start: -1850, end: -1850, label: '约公元前1850年', approximate: true },
    regions: [region('nile-valley', 'associated', ['source-ucl-sinuhe', 'source-bm-sinuhe-literature'])],
    relationIds: [],
    sourceIds: ['source-oxford-tale-sinuhe', 'source-ucl-sinuhe', 'source-bm-sinuhe-literature']
  },
] as const satisfies readonly EntityPhase[];
