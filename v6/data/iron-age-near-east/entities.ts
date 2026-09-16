import type { Entity, EntityPhase, RegionalAssociation, RegionalRole, SourceIds } from '../../schema/index.ts';

const region = (regionId: string, role: RegionalRole, sourceIds: SourceIds): RegionalAssociation =>
  ({ regionId, role, approximate: true, sourceIds });

export const ironAgeNearEastEntities = [
{
  "id": "lydian-language",
  "name": "吕底亚语",
  "type": "language",
  "canonicalSummary": "以萨第斯为中心的吕底亚地区语言，使用由希腊字母发展而来的吕底亚字母。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "lydian-language-west-use"
  ],
  "sourceIds": [
    "source-sardis-lydian-language-reviewed"
  ]
},
{
  "id": "lydian-alphabet",
  "name": "吕底亚字母",
  "type": "writingSystem",
  "canonicalSummary": "在希腊字母基础上形成的本地字母系统，主要从右向左书写。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "lydian-alphabet-west-use"
  ],
  "sourceIds": [
    "source-sardis-lydian-language-reviewed"
  ]
},
{
  "id": "phoenician-language",
  "name": "腓尼基语",
  "type": "language",
  "canonicalSummary": "黎凡特沿海腓尼基城市的语言，以腓尼基字母书写，随海上交往传播到地中海各地。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "phoenician-language-coastal-use"
  ],
  "sourceIds": [
    "source-sns-phoenician-reviewed",
    "source-met-phoenician-alphabet-usage"
  ]
},
{
  "id": "phoenician-alphabet",
  "name": "腓尼基字母",
  "type": "writingSystem",
  "canonicalSummary": "从右向左书写的辅音字母系统，后来影响了希腊和阿拉米等字母。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "phoenician-alphabet-coastal-use"
  ],
  "sourceIds": [
    "source-sns-phoenician-reviewed",
    "source-sns-phoenician-examples-reviewed"
  ]
},
{
  "id": "hebrew-language",
  "name": "希伯来语",
  "type": "language",
  "canonicalSummary": "古代以色列与犹大的语言，保存在铭文、书信与宗教文献中。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "hebrew-language-southern-levant"
  ],
  "sourceIds": [
    "source-sns-hebrew-reviewed"
  ]
},
{
  "id": "paleo-hebrew-alphabet",
  "name": "古希伯来字母",
  "type": "writingSystem",
  "canonicalSummary": "源自腓尼基字母的早期希伯来书写系统，以辅音字母从右向左书写。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "paleo-hebrew-southern-levant"
  ],
  "sourceIds": [
    "source-sns-hebrew-reviewed"
  ]
},
{
  "id": "aramaic-alphabet",
  "name": "阿拉米字母",
  "type": "writingSystem",
  "canonicalSummary": "随近东交流与行政网络传播的字母系统，广泛用于跨地区通信。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "aramaic-alphabet-upper-use"
  ],
  "sourceIds": [
    "source-iranica-aramaic-periods-reviewed",
    "source-oracc-aramaic-hebrew",
    "source-iranica-aramaic-general-usage"
  ]
},
{
  "id": "elamite-language",
  "name": "埃兰语",
  "type": "language",
  "canonicalSummary": "伊朗西南部的古老语言，文献集中于苏萨与法尔斯地区，以楔形文字书写。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "elamite-language-southwest-use"
  ],
  "sourceIds": [
    "source-iranica-elamite-language-reviewed",
    "source-chicago-persepolis-usage"
  ]
},
{
  "id": "old-persian-language",
  "name": "古波斯语",
  "type": "language",
  "canonicalSummary": "古代波斯人的语言，阿契美尼德王室以古波斯楔形文字记述征服、营建与祭神活动。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "old-persian-royal-use"
  ],
  "sourceIds": [
    "source-iranica-old-persian-epigraphy-reviewed"
  ]
},
{
  "id": "old-persian-cuneiform",
  "name": "古波斯楔形文字",
  "type": "writingSystem",
  "canonicalSummary": "阿契美尼德王室采用的专门书写系统，以楔形笔画组成较为简洁的符号。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "old-persian-script-royal-use"
  ],
  "sourceIds": [
    "source-iranica-old-persian-epigraphy-reviewed"
  ]
},
  {
  "id": "assur-community",
  "type": "community",
  "name": "亚述城社群",
  "canonicalSummary": "以亚述城为中心的城市社群，商人沿陆路经营安纳托利亚贸易，城市也长期承担宗教与政治职能。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "assur-old-assyrian-trade-community",
    "assur-middle-assyrian-urban-tradition"
  ],
  "tags": [
    "近东",
    "亚述",
    "城市社群"
  ],
  "sourceIds": [
    "source-met-old-assyrian-community-reviewed",
    "source-oracc-assyrian-heartland-reviewed",
    "source-met-assyrian-caravan-object-reviewed"
  ]
},
  { id: 'babylon-city', type: 'settlement', name: '巴比伦城', canonicalSummary: '幼发拉底河畔的城市，公元前七世纪经历亚述统治下的毁坏与重建，随后成为新巴比伦帝国首都。当前展示前689—前539年的片段；前539年波斯征服结束了新巴比伦王权，城市仍继续存在。', conceptLayerId: 'placeAndSite', phaseIds: ['babylon-city-late-iron-age-presence'], tags: ['近东', '城市', '巴比伦'], sourceIds: ['source-met-esarhaddon-prism', 'source-met-babylon-lion', 'source-met-babylon', 'source-bm-cyrus-cylinder'] },
  {
  "id": "kingdom-of-judah",
  "type": "polity",
  "name": "犹大王国",
  "canonicalSummary": "以耶路撒冷为中心，在亚述、巴比伦与埃及之间维持统治的黎凡特王国。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "judah-kingdom-presence"
  ],
  "tags": [
    "黎凡特",
    "铁器时代"
  ],
  "sourceIds": [
    "source-met-ancient-israel",
    "source-bm-babylonian-chronicle",
    "source-met-judean-diaspora-reviewed"
  ]
},
  { id: 'ancient-israelite-tradition', type: 'religiousTradition', name: '古代以色列宗教传统', canonicalSummary: '古代以色列与犹大社群的宗教传统，包含祖先叙事、敬拜与共同体记忆。巴比伦流亡改变了社群处境；雅各改名故事不能据以确定宗教的起止年代。', conceptLayerId: 'religionAndThought', phaseIds: [], tags: ['黎凡特', '宗教传统', '传统叙事'], sourceIds: ['source-genesis-jacob', 'source-met-cyrus-return', 'source-sefaria-kings'] },
  {
  "id": "neo-assyrian-empire",
  "type": "polity",
  "name": "新亚述帝国",
  "canonicalSummary": "从两河北部兴起，通过战争、行省治理和人口迁徙建立横跨近东的帝国。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "neo-assyrian-expansion",
    "neo-assyrian-syrian-provinces",
    "neo-assyrian-imperial-administration",
    "neo-assyrian-western-contraction",
    "neo-assyrian-collapse"
  ],
  "tags": [
    "近东",
    "铁器时代",
    "帝国"
  ],
  "sourceIds": [
    "source-met-assyria",
    "source-bm-introducing-assyrians",
    "source-oracc-governance-reviewed"
  ]
},
  { id: 'phoenician-tradition', type: 'tradeNetwork', name: '腓尼基海上交换网络', canonicalSummary: '公元前一千纪前半叶，以黎凡特海岸港口和海外聚落为节点、连接地中海多地的海上交换网络。', conceptLayerId: 'technologyAndExchange', phaseIds: ['phoenician-maritime-connections'], tags: ['近东', '地中海', '航海', '交换网络'], sourceIds: ['source-met-phoenicians', 'source-bm-phoenician'] },
  {
  "id": "kingdom-of-israel",
  "type": "polity",
  "name": "以色列王国",
  "canonicalSummary": "与邻近诸国往来、曾向亚述纳贡的南黎凡特王国，后来被亚述吞并。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "israel-kingdom-presence"
  ],
  "tags": [
    "黎凡特",
    "铁器时代"
  ],
  "sourceIds": [
    "source-met-ancient-israel",
    "source-oracc-israel",
    "source-oracc-israel-reviewed",
    "source-met-judean-diaspora-reviewed"
  ]
},
  {
  "id": "aramaic-language",
  "type": "language",
  "name": "阿拉米语",
  "canonicalSummary": "起源于叙利亚一带的语言，逐渐成为近东广泛使用的交流与行政语言。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "aramaic-northern-levant-use",
    "aramaic-southern-levant-use",
    "aramaic-in-assyrian-administration",
    "aramaic-later-imperial-administration"
  ],
  "tags": [
    "近东",
    "语言",
    "字母书写"
  ],
  "sourceIds": [
    "source-oxford-aramaeans",
    "source-oracc-aramaic-hebrew",
    "source-iranica-aramaic",
    "source-iranica-aramaic-periods-reviewed",
    "source-sns-hebrew-reviewed",
    "source-iranica-aramaic-general-usage",
    "source-chicago-persepolis-usage"
  ]
},
  {
  "id": "neo-babylonian-empire",
  "type": "polity",
  "name": "新巴比伦帝国",
  "canonicalSummary": "以巴比伦为首都，击败亚述并向地中海扩张；王室同时大规模重建首都。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "neo-babylonian-rise-against-assyria",
    "neo-babylonian-capital-and-rule"
  ],
  "tags": [
    "近东",
    "铁器时代",
    "帝国"
  ],
  "sourceIds": [
    "source-met-babylon"
  ]
},
  {
  "id": "lydian-kingdom",
  "type": "polity",
  "name": "吕底亚王国",
  "canonicalSummary": "安纳托利亚西部的富裕王国，连接内陆河谷与爱琴海沿岸城市。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "lydian-kingdom-presence"
  ],
  "tags": [
    "安纳托利亚",
    "铁器时代",
    "政权"
  ],
  "sourceIds": [
    "source-met-sardis",
    "source-iranica-cyrus",
    "source-sardis-introduction-reviewed"
  ]
},
  { id: 'iron', type: 'technology', name: '铁器技术', canonicalSummary: '这里选取南黎凡特铁器生产和黄河中游铸铁见证两个地区实例，不表示二者是前后相接的传播路线。黄河中游早期铸铁碎片的发现不等于当时已普遍掌握成熟铸造工艺，后续工具与作坊证据更加明确。', conceptLayerId: 'technologyAndExchange', phaseIds: ['iron-post-palatial-diffusion', 'iron-chinese-cast-iron'], tags: ['铁器时代', '冶金技术', '欧亚'], sourceIds: ['source-erb-satullo-iron-adoption', 'source-qian-huang-cast-iron-reviewed', 'source-han-chen-casting-iron-reviewed'] }
] as const satisfies readonly Entity[];

export const ironAgeNearEastEntityPhases = [
{
  "id": "lydian-language-west-use",
  "entityId": "lydian-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -650,
    "end": -300,
    "approximate": true,
    "label": "约前650—前300年"
  },
  "regions": [
    {
      "regionId": "western-anatolia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-sardis-lydian-language-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-sardis-lydian-language-reviewed"
  ]
},
{
  "id": "lydian-alphabet-west-use",
  "entityId": "lydian-alphabet",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -650,
    "end": -300,
    "approximate": true,
    "label": "约前650—前300年"
  },
  "regions": [
    {
      "regionId": "western-anatolia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-sardis-lydian-language-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-sardis-lydian-language-reviewed"
  ]
},
{
  "id": "phoenician-language-coastal-use",
  "entityId": "phoenician-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1200,
    "end": -300,
    "approximate": true,
    "label": "约前1200—前300年"
  },
  "regions": [
    {
      "regionId": "syria-northern-levant",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-sns-phoenician-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-sns-phoenician-reviewed"
  ]
},
{
  "id": "phoenician-alphabet-coastal-use",
  "entityId": "phoenician-alphabet",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1200,
    "end": -300,
    "approximate": true,
    "label": "约前1200—前300年"
  },
  "regions": [
    {
      "regionId": "syria-northern-levant",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-sns-phoenician-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-sns-phoenician-reviewed"
  ]
},
{
  "id": "hebrew-language-southern-levant",
  "entityId": "hebrew-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -800,
    "end": -300,
    "approximate": true,
    "label": "约前800—前300年"
  },
  "regions": [
    {
      "regionId": "southern-levant",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-sns-hebrew-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-sns-hebrew-reviewed"
  ]
},
{
  "id": "paleo-hebrew-southern-levant",
  "entityId": "paleo-hebrew-alphabet",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -800,
    "end": -300,
    "approximate": true,
    "label": "约前800—前300年"
  },
  "regions": [
    {
      "regionId": "southern-levant",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-sns-hebrew-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-sns-hebrew-reviewed"
  ]
},
{
  "id": "aramaic-alphabet-upper-use",
  "entityId": "aramaic-alphabet",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -800,
    "end": -300,
    "approximate": true,
    "label": "约前800—前300年"
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-iranica-aramaic-periods-reviewed",
        "source-oracc-aramaic-hebrew"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-iranica-aramaic-periods-reviewed",
    "source-oracc-aramaic-hebrew"
  ]
},
{
  "id": "elamite-language-southwest-use",
  "entityId": "elamite-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -2300,
    "end": -350,
    "approximate": true,
    "label": "约前2300—前350年"
  },
  "regions": [
    {
      "regionId": "iranian-plateau",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-iranica-elamite-language-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-iranica-elamite-language-reviewed"
  ]
},
{
  "id": "old-persian-royal-use",
  "entityId": "old-persian-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -520,
    "end": -330,
    "approximate": true,
    "label": "约前520—前330年"
  },
  "regions": [
    {
      "regionId": "iranian-plateau",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-iranica-old-persian-epigraphy-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-iranica-old-persian-epigraphy-reviewed"
  ]
},
{
  "id": "old-persian-script-royal-use",
  "entityId": "old-persian-cuneiform",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -520,
    "end": -330,
    "approximate": true,
    "label": "约前520—前330年"
  },
  "regions": [
    {
      "regionId": "iranian-plateau",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-iranica-old-persian-epigraphy-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-iranica-old-persian-epigraphy-reviewed"
  ]
},
{
  "id": "aramaic-northern-levant-use",
  "entityId": "aramaic-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -950,
    "end": -300,
    "approximate": true,
    "label": "约前950—前300年"
  },
  "regions": [
    {
      "regionId": "syria-northern-levant",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-iranica-aramaic-periods-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-iranica-aramaic-periods-reviewed"
  ]
},
{
  "id": "aramaic-southern-levant-use",
  "entityId": "aramaic-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -500,
    "end": -300,
    "approximate": true,
    "label": "约前500—前300年"
  },
  "regions": [
    {
      "regionId": "southern-levant",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-sns-hebrew-reviewed",
        "source-iranica-aramaic-periods-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-sns-hebrew-reviewed",
    "source-iranica-aramaic-periods-reviewed"
  ]
},
  {
  "id": "assur-old-assyrian-trade-community",
  "entityId": "assur-community",
  "title": "古亚述时期",
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
  "relationIds": [],
  "sourceIds": [
    "source-met-old-assyrian-community-reviewed"
  ]
},
  {
  "id": "assur-middle-assyrian-urban-tradition",
  "entityId": "assur-community",
  "title": "中亚述时期",
  "timeSpan": {
    "start": -1400,
    "end": -1000,
    "label": "约公元前1400—前1000年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-oracc-assyrian-heartland-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-oracc-assyrian-heartland-reviewed"
  ]
},
  { id: 'babylon-city-late-iron-age-presence', entityId: 'babylon-city', title: '毁坏、重建与新巴比伦时期', timeSpan: { start: -689, end: -539, label: '公元前689—前539年' }, regions: [region('central-mesopotamia', 'core', ['source-met-esarhaddon-prism', 'source-met-babylon-lion'])], relationIds: [], sourceIds: ['source-met-esarhaddon-prism', 'source-met-babylon-lion', 'source-met-nebuchadnezzar-cylinder'] },
  {
  "id": "judah-kingdom-presence",
  "entityId": "kingdom-of-judah",
  "title": "南黎凡特统治范围",
  "timeSpan": {
    "start": -900,
    "end": -586,
    "label": "约公元前900—前586年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "southern-levant",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-ancient-israel",
        "source-bm-lachish",
        "source-bm-babylonian-chronicle"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-met-ancient-israel",
    "source-bm-lachish",
    "source-bm-babylonian-chronicle"
  ]
},
  

{
  "id": "neo-assyrian-expansion",
  "entityId": "neo-assyrian-empire",
  "title": "以上美索不达米亚为核心",
  "timeSpan": {
    "start": -911,
    "end": -740,
    "label": "约公元前911—前740年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-assyria",
        "source-bm-introducing-assyrians"
      ]
    }
  ],
  "relationIds": [
    "relation-assyria-uses-aramaic"
  ],
  "sourceIds": [
    "source-met-assyria",
    "source-oracc-governance-reviewed",
    "source-oracc-deportation",
    "source-bm-introducing-assyrians"
  ]
},
{
  "id": "neo-assyrian-syrian-provinces",
  "entityId": "neo-assyrian-empire",
  "title": "在叙利亚建立行省",
  "timeSpan": {
    "start": -740,
    "end": -732,
    "label": "约公元前740—前732年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-oracc-tiglath-pileser-territory-reviewed"
      ]
    },
    {
      "regionId": "syria-northern-levant",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-oracc-tiglath-pileser-territory-reviewed"
      ]
    }
  ],
  "relationIds": [
    "relation-assyria-conquers-israel",
    "relation-assyria-uses-aramaic"
  ],
  "sourceIds": [
    "source-met-assyria",
    "source-oracc-governance-reviewed",
    "source-oracc-deportation",
    "source-bm-introducing-assyrians",
    "source-oracc-tiglath-pileser-territory-reviewed"
  ]
},
  {
  "id": "neo-assyrian-imperial-administration",
  "entityId": "neo-assyrian-empire",
  "title": "控制扩展至南黎凡特",
  "timeSpan": {
    "start": -732,
    "end": -630,
    "label": "约公元前732—前630年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-oracc-tiglath-pileser-territory-reviewed",
        "source-oracc-israel",
        "source-eshel-silver-levant-2025"
      ]
    },
    {
      "regionId": "syria-northern-levant",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-oracc-tiglath-pileser-territory-reviewed",
        "source-oracc-israel",
        "source-eshel-silver-levant-2025"
      ]
    },
    {
      "regionId": "southern-levant",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-oracc-tiglath-pileser-territory-reviewed",
        "source-oracc-israel",
        "source-eshel-silver-levant-2025"
      ]
    }
  ],
  "relationIds": [
    "relation-assyria-conquers-israel",
    "relation-assyria-uses-aramaic"
  ],
  "sourceIds": [
    "source-oracc-governance-reviewed",
    "source-oracc-deportation",
    "source-bm-ashurbanipal-library",
    "source-oracc-tiglath-pileser-territory-reviewed",
    "source-oracc-israel",
    "source-eshel-silver-levant-2025"
  ]
},
{
  "id": "neo-assyrian-western-contraction",
  "entityId": "neo-assyrian-empire",
  "title": "南黎凡特控制收缩",
  "timeSpan": {
    "start": -630,
    "end": -612,
    "label": "约公元前630—前612年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-eshel-silver-levant-2025",
        "source-met-assyria",
        "source-bm-fall-nineveh-chronicle-reviewed"
      ]
    },
    {
      "regionId": "syria-northern-levant",
      "role": "controlled",
      "approximate": true,
      "sourceIds": [
        "source-eshel-silver-levant-2025",
        "source-met-assyria",
        "source-bm-fall-nineveh-chronicle-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-met-assyria",
    "source-oracc-governance-reviewed",
    "source-oracc-deportation",
    "source-bm-introducing-assyrians",
    "source-eshel-silver-levant-2025",
    "source-bm-fall-nineveh-chronicle-reviewed"
  ]
},
  {
  "id": "neo-assyrian-collapse",
  "entityId": "neo-assyrian-empire",
  "title": "退守哈兰一带",
  "timeSpan": {
    "start": -612,
    "end": -609,
    "label": "约公元前612—前609年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "associated",
      "approximate": true,
      "sourceIds": [
        "source-bm-fall-nineveh-chronicle-reviewed"
      ]
    }
  ],
  "relationIds": [
    "relation-neo-babylon-succeeds-assyria"
  ],
  "sourceIds": [
    "source-met-assyria",
    "source-bm-fall-nineveh-chronicle-reviewed"
  ]
},
  { id: 'phoenician-maritime-connections', entityId: 'phoenician-tradition', title: '地中海海上交换阶段', timeSpan: { start: -1000, end: -600, label: '约公元前1000—前600年', approximate: true }, regions: [region('syria-northern-levant', 'core', ['source-met-phoenicians']), region('eastern-mediterranean-sea', 'exchange', ['source-met-phoenician-sailing']), region('central-mediterranean', 'exchange', ['source-antiquity-phoenician-diaspora'])], relationIds: [], sourceIds: ['source-met-phoenicians', 'source-met-phoenician-sailing', 'source-antiquity-phoenician-diaspora'] },
  {
  "id": "israel-kingdom-presence",
  "entityId": "kingdom-of-israel",
  "title": "南黎凡特统治范围",
  "timeSpan": {
    "start": -930,
    "end": -720,
    "label": "约公元前930—前720年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "southern-levant",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-ancient-israel",
        "source-oracc-israel"
      ]
    }
  ],
  "relationIds": [
    "relation-assyria-conquers-israel"
  ],
  "sourceIds": [
    "source-met-ancient-israel",
    "source-bm-black-obelisk",
    "source-oracc-israel"
  ]
},
  {
  "id": "aramaic-in-assyrian-administration",
  "entityId": "aramaic-language",
  "title": "上美索不达米亚的使用",
  "timeSpan": {
    "start": -800,
    "end": -300,
    "label": "约前800—前300年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "upper-mesopotamia",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-oracc-aramaic-hebrew",
        "source-iranica-aramaic-periods-reviewed"
      ]
    }
  ],
  "relationIds": [
    "relation-assyria-uses-aramaic"
  ],
  "sourceIds": [
    "source-oracc-aramaic-hebrew",
    "source-oracc-palace-scribe",
    "source-iranica-aramaic-periods-reviewed"
  ]
},
  {
  "id": "aramaic-later-imperial-administration",
  "entityId": "aramaic-language",
  "title": "波斯波利斯行政铭文见证",
  "timeSpan": {
    "start": -500,
    "end": -400,
    "label": "约前500—前400年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "iranian-plateau",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-iranica-aramaic"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-iranica-aramaic"
  ]
},
  {
  "id": "neo-babylonian-rise-against-assyria",
  "entityId": "neo-babylonian-empire",
  "title": "巴比伦独立与反亚述战争",
  "timeSpan": {
    "start": -626,
    "end": -605,
    "label": "约公元前626—前605年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-babylon"
      ]
    }
  ],
  "relationIds": [
    "relation-neo-babylon-succeeds-assyria"
  ],
  "sourceIds": [
    "source-met-babylon",
    "source-met-assyria"
  ]
},
  
  {
  "id": "neo-babylonian-capital-and-rule",
  "entityId": "neo-babylonian-empire",
  "title": "向叙利亚与黎凡特扩展",
  "timeSpan": {
    "start": -605,
    "end": -539,
    "label": "约公元前605—前539年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "central-mesopotamia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-babylon"
      ]
    },
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
      "role": "influence",
      "approximate": true,
      "sourceIds": [
        "source-met-babylon"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-met-babylon-lion",
    "source-met-nebuchadnezzar-cylinder",
    "source-bm-cyrus-cylinder",
    "source-met-babylon",
    "source-bm-babylonian-chronicle",
    "source-met-cyrus-return"
  ]
},
  {
  "id": "lydian-kingdom-presence",
  "entityId": "lydian-kingdom",
  "title": "西安纳托利亚统治范围",
  "timeSpan": {
    "start": -680,
    "end": -546,
    "label": "约公元前680—前546年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "western-anatolia",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-sardis"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-met-sardis",
    "source-sardis-introduction",
    "source-iranica-cyrus"
  ]
},
  { id: 'iron-post-palatial-diffusion', entityId: 'iron', title: '南黎凡特的铁器生产', timeSpan: { start: -1200, end: -800, label: '约公元前1200—前800年', approximate: true }, regions: [region('southern-levant', 'attested', ['source-erb-satullo-iron-adoption'])], relationIds: [], sourceIds: ['source-erb-satullo-iron-adoption'] },
  { id: 'iron-chinese-cast-iron', entityId: 'iron', title: '黄河中游的铸铁见证', timeSpan: { start: -800, end: -300, label: '约公元前800—前300年', approximate: true }, regions: [region('middle-yellow-river', 'attested', ['source-qian-huang-cast-iron-reviewed', 'source-han-chen-casting-iron-reviewed'])], relationIds: [], sourceIds: ['source-qian-huang-cast-iron-reviewed', 'source-han-chen-casting-iron-reviewed'] }
] as const satisfies readonly EntityPhase[];
