import type { Entity, EntityPhase, RegionalAssociation, RegionalRole, SourceIds } from '../../schema/index.ts';

function region(regionId: string, role: RegionalRole, sourceIds: SourceIds): RegionalAssociation {
  return { regionId, role, approximate: true, sourceIds };
}

export const aegeanEntities = [
{
  "id": "greek-language",
  "name": "希腊语",
  "type": "language",
  "canonicalSummary": "希腊大陆与爱琴海地区的语言。迈锡尼时代以线形文字B记录，后来使用希腊字母。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "greek-mainland-crete-use",
    "greek-islands-use"
  ],
  "sourceIds": [
    "source-cambridge-greek-language-reviewed",
    "source-cambridge-linear-b-reviewed",
    "source-bm-greek-alphabet-reviewed",
    "source-heraklion-linear-b-usage",
    "source-bm-greek-public-writing-usage",
    "source-bm-who-was-homer"
  ]
},
{
  "id": "greek-alphabet",
  "name": "希腊字母",
  "type": "writingSystem",
  "canonicalSummary": "由腓尼基字母发展而来，在希腊大陆与爱琴海地区广泛使用的字母系统。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "greek-alphabet-use"
  ],
  "sourceIds": [
    "source-bm-greek-alphabet-reviewed",
    "source-bm-greek-public-writing-usage"
  ]
},
{
  "id": "linear-a",
  "name": "线形文字A",
  "type": "writingSystem",
  "canonicalSummary": "青铜时代克里特使用的文字，兼有音节符号与表示物品的符号。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "linear-a-crete-use"
  ],
  "sourceIds": [
    "source-cambridge-linear-a-reviewed"
  ]
},
{
  "id": "linear-b",
  "name": "线形文字B",
  "type": "writingSystem",
  "canonicalSummary": "从线形文字A改造而来的音节文字，保存在迈锡尼时代的宫殿档案中。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "linear-b-palace-use"
  ],
  "sourceIds": [
    "source-cambridge-linear-b-reviewed",
    "source-heraklion-linear-b-usage"
  ]
},
  {
  "id": "minoan-palatial-civilization",
  "type": "community",
  "name": "克里特宫殿社群",
  "alternativeNames": [
    "Minoan palatial civilization"
  ],
  "canonicalSummary": "克里特围绕多座宫殿形成的城市社群，宫殿集中行政、储藏、手工业与祭仪活动。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "minoan-first-palatial-centres",
    "minoan-knossos-linear-b-reorganization"
  ],
  "tags": [
    "爱琴海",
    "克里特",
    "城市社群"
  ],
  "sourceIds": [
    "source-unesco-minoan-palatial-centres",
    "source-met-minoan-crete",
    "source-heraklion-knossos-reviewed"
  ]
},
  {
  "id": "mycenaean-civilization",
  "type": "community",
  "name": "迈锡尼城市社群",
  "alternativeNames": [
    "Mycenaean civilization"
  ],
  "canonicalSummary": "希腊大陆以城堡与宫殿为中心的城市社群，依靠农业、手工业和海上贸易发展。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "mycenaean-palatial-administration"
  ],
  "tags": [
    "爱琴海",
    "希腊大陆",
    "城市社群"
  ],
  "sourceIds": [
    "source-met-mycenaean-civilization",
    "source-killen-mycenaean-society"
  ]
},
  {
  "id": "greek-dark-age-communities",
  "type": "community",
  "name": "希腊早期聚落社群",
  "alternativeNames": [
    "Greek Early Iron Age communities",
    "Greek Dark Age communities"
  ],
  "canonicalSummary": "迈锡尼宫殿衰落后，希腊大陆与爱琴海岛屿的地方聚落继续耕作、制造器物并开展海上交往。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "greek-postpalatial-local-communities"
  ],
  "tags": [
    "爱琴海",
    "后宫殿社会",
    "早期铁器时代",
    "城市社群"
  ],
  "sourceIds": [
    "source-cambridge-mycenaean-transformation",
    "source-cambridge-greek-iron-age-pottery",
    "source-oxford-lefkandi-reviewed"
  ]
},
  {
    id: 'greek-divine-tradition', type: 'religiousTradition', name: '希腊诸神传统',
    alternativeNames: ['Greek divine tradition'],
    canonicalSummary: '从迈锡尼泥版中的部分神名与献祭记录，到后宫殿时期祭祀、歌唱和叙事重组之间可见连续与变化的宗教传统。当前展示希腊大陆已收录的见证时期；克里特的泥版材料保留为背景，不能据此确定整个岛屿的传统退出年代。',
    conceptLayerId: 'religionAndThought',
    phaseIds: ['greek-divine-mycenaean-attestations'],
    tags: ['希腊', '宗教传统', '诸神'],
    sourceIds: ['source-cambridge-mycenaean-religion', 'source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology']
  },
  {
    id: 'troy-archaeological-site', type: 'archaeologicalSite', name: '特洛伊遗址',
    alternativeNames: ['Troy', 'Hisarlık'],
    canonicalSummary: '位于西安纳托利亚希萨尔勒克的多层考古遗址，青铜时代晚期城址经历毁坏与重建，后世又被史诗传统赋予英雄战争记忆。当前展示约前1700—前1180年的城址片段，毁坏与重建并非一场持续战争。',
    conceptLayerId: 'placeAndSite',
    phaseIds: ['troy-late-bronze-presence'],
    tags: ['西安纳托利亚', '考古遗址', '特洛伊'],
    sourceIds: ['source-unesco-troy', 'source-british-museum-lost-troy', 'source-cambridge-hittite-troy']
  },
  {
    id: 'iliad-text', type: 'literaryWork', name: '《伊利亚特》',
    alternativeNames: ['Iliad'],
    canonicalSummary: '以阿喀琉斯的愤怒及其后果为中心的古希腊史诗作品；它在长期口头作诗传统中形成，诗中情节不是青铜时代战争档案。',
    conceptLayerId: 'artAndLiterature',
    phaseIds: ['iliad-work-formation'],
    tags: ['希腊', '史诗', '文学作品'],
    sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad']
  },
  {
    id: 'odyssey-text', type: 'literaryWork', name: '《奥德赛》',
    alternativeNames: ['Odyssey'],
    canonicalSummary: '围绕奥德修斯返乡、待客与家庭秩序展开的古希腊史诗作品；它在归乡歌和口头作诗传统中形成，叙事情节不作为历史事件处理。',
    conceptLayerId: 'artAndLiterature',
    phaseIds: ['odyssey-work-formation'],
    tags: ['希腊', '史诗', '文学作品'],
    sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey']
  },
] as const satisfies readonly Entity[];

export const aegeanEntityPhases = [
{
  "id": "greek-mainland-crete-use",
  "entityId": "greek-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1400,
    "end": -300,
    "approximate": true,
    "label": "约前1400—前300年"
  },
  "regions": [
    {
      "regionId": "greek-mainland",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-greek-language-reviewed",
        "source-cambridge-linear-b-reviewed",
        "source-bm-greek-alphabet-reviewed"
      ]
    },
    {
      "regionId": "crete",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-greek-language-reviewed",
        "source-cambridge-linear-b-reviewed",
        "source-bm-greek-alphabet-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-cambridge-greek-language-reviewed",
    "source-cambridge-linear-b-reviewed",
    "source-bm-greek-alphabet-reviewed"
  ]
},
{
  "id": "greek-islands-use",
  "entityId": "greek-language",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -800,
    "end": -300,
    "approximate": true,
    "label": "约前800—前300年"
  },
  "regions": [
    {
      "regionId": "aegean-islands",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-greek-language-reviewed",
        "source-bm-greek-alphabet-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-cambridge-greek-language-reviewed",
    "source-bm-greek-alphabet-reviewed"
  ]
},
{
  "id": "greek-alphabet-use",
  "entityId": "greek-alphabet",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -800,
    "end": -300,
    "approximate": true,
    "label": "约前800—前300年"
  },
  "regions": [
    {
      "regionId": "greek-mainland",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-bm-greek-alphabet-reviewed"
      ]
    },
    {
      "regionId": "aegean-islands",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-bm-greek-alphabet-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-bm-greek-alphabet-reviewed"
  ]
},
{
  "id": "linear-a-crete-use",
  "entityId": "linear-a",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1800,
    "end": -1450,
    "approximate": true,
    "label": "约前1800—前1450年"
  },
  "regions": [
    {
      "regionId": "crete",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-linear-a-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-cambridge-linear-a-reviewed"
  ]
},
{
  "id": "linear-b-palace-use",
  "entityId": "linear-b",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -1400,
    "end": -1200,
    "approximate": true,
    "label": "约前1400—前1200年"
  },
  "regions": [
    {
      "regionId": "greek-mainland",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-linear-b-reviewed"
      ]
    },
    {
      "regionId": "crete",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-linear-b-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-cambridge-linear-b-reviewed"
  ]
},
  
{
  "id": "minoan-first-palatial-centres",
  "entityId": "minoan-palatial-civilization",
  "title": "克里特宫殿中心",
  "timeSpan": {
    "start": -1900,
    "end": -1450,
    "label": "约公元前1900—前1450年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "crete",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-unesco-minoan-palatial-centres",
        "source-met-minoan-crete"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-unesco-minoan-palatial-centres",
    "source-met-minoan-crete",
    "source-salgarella-writing-bronze-age-crete",
    "source-bsa-linear-b"
  ]
},
{
  "id": "minoan-knossos-linear-b-reorganization",
  "entityId": "minoan-palatial-civilization",
  "title": "克诺索斯宫殿延续",
  "timeSpan": {
    "start": -1450,
    "end": -1350,
    "label": "约公元前1450—前1350年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "crete",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-heraklion-knossos-reviewed"
      ]
    }
  ],
  "relationIds": [
    "relation-minoan-mycenaean-administration"
  ],
  "sourceIds": [
    "source-heraklion-knossos-reviewed",
    "source-salgarella-writing-bronze-age-crete"
  ]
},
  
  
  
  {
  "id": "mycenaean-palatial-administration",
  "entityId": "mycenaean-civilization",
  "title": "希腊大陆城市与宫殿",
  "timeSpan": {
    "start": -1600,
    "end": -1200,
    "label": "约公元前1600—前1200年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "greek-mainland",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-met-mycenaean-civilization",
        "source-killen-mycenaean-society"
      ]
    }
  ],
  "relationIds": [
    "relation-minoan-mycenaean-administration",
    "relation-mycenaean-divine-names",
    "relation-mycenaean-dark-age-reorganization"
  ],
  "sourceIds": [
    "source-killen-mycenaean-society",
    "source-bsa-linear-b",
    "source-cambridge-mycenaean-religion",
    "source-met-mycenaean-civilization",
    "source-cambridge-guide-mycenae",
    "source-deger-jalkotzy-aftermath",
    "source-knapp-manning-crisis",
    "source-cambridge-mycenaean-transformation"
  ]
},
  
  {
  "id": "greek-postpalatial-local-communities",
  "entityId": "greek-dark-age-communities",
  "title": "大陆与岛屿聚落",
  "timeSpan": {
    "start": -1200,
    "end": -800,
    "label": "约公元前1200—前800年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "greek-mainland",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-mycenaean-transformation",
        "source-cambridge-greek-iron-age-pottery",
        "source-oxford-lefkandi-reviewed"
      ]
    },
    {
      "regionId": "aegean-islands",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-cambridge-mycenaean-transformation",
        "source-cambridge-greek-iron-age-pottery",
        "source-oxford-lefkandi-reviewed"
      ]
    }
  ],
  "relationIds": [
    "relation-mycenaean-dark-age-reorganization"
  ],
  "sourceIds": [
    "source-deger-jalkotzy-aftermath",
    "source-cambridge-mycenaean-transformation",
    "source-bsa-aegean-iron-technologies",
    "source-cambridge-greek-iron-age-pottery",
    "source-oxford-lefkandi-reviewed"
  ]
},
  
  {
    id: 'greek-divine-mycenaean-attestations', entityId: 'greek-divine-tradition', title: '希腊大陆宗教见证范围',
    timeSpan: { start: -1450, end: -800, label: '已收录见证：约公元前1450—前800年', approximate: true },
    regions: [region('greek-mainland', 'attested', ['source-cambridge-mycenaean-religion', 'source-lupack-local-horizon', 'source-rutherford-greek-religion-lba-eia'])],
    relationIds: ['relation-mycenaean-divine-names'],
    sourceIds: ['source-cambridge-mycenaean-religion', 'source-lupack-local-horizon', 'source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology']
  },
  {
    id: 'troy-late-bronze-presence', entityId: 'troy-archaeological-site', title: '晚青铜时代城址',
    timeSpan: { start: -1700, end: -1180, label: '约公元前1700—前1180年', approximate: true },
    regions: [region('western-anatolia', 'attested', ['source-unesco-troy', 'source-british-museum-lost-troy'])], relationIds: [],
    sourceIds: ['source-unesco-troy', 'source-british-museum-lost-troy', 'source-cambridge-iliad-history-fiction']
  },
  {
    id: 'iliad-work-formation', entityId: 'iliad-text', title: '史诗成篇',
    timeSpan: { start: -700, end: -700, label: '约公元前700年', approximate: true },
    regions: [region('aegean-islands', 'associated', ['source-bm-who-was-homer'])],
    relationIds: [], sourceIds: ['source-bm-who-was-homer', 'source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad']
  },
  {
    id: 'odyssey-work-formation', entityId: 'odyssey-text', title: '史诗成篇',
    timeSpan: { start: -700, end: -700, label: '约公元前700年', approximate: true },
    regions: [region('aegean-islands', 'associated', ['source-bm-who-was-homer'])],
    relationIds: [], sourceIds: ['source-bm-who-was-homer', 'source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey']
  }
] as const satisfies readonly EntityPhase[];
