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

export const ancientIndiaEntities = [
{
  "id": "vedic-sanskrit-language",
  "name": "吠陀梵语",
  "type": "language",
  "canonicalSummary": "吠陀赞歌和祭仪使用的古老梵语，通过诗人、祭司与弟子的口传世代保存。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "vedic-sanskrit-northwest-use"
  ],
  "sourceIds": [
    "source-witzel-vedic-language-reviewed"
  ]
},
{
  "id": "indus-sign-system",
  "name": "印度河符号系统",
  "type": "writingSystem",
  "canonicalSummary": "成熟印度河城市使用的符号系统，短铭常与动物图像并列。",
  "conceptLayerId": "languageAndKnowledge",
  "phaseIds": [
    "indus-sign-system-use"
  ],
  "sourceIds": [
    "source-kenoyer-indus-signs-reviewed",
    "source-indus-undeciphered-reviewed",
    "source-kenoyer-script-materials-reviewed"
  ]
},
  {
  "id": "indus-civilization",
  "type": "community",
  "name": "印度河城市社群",
  "alternativeNames": [
    "Indus Civilization",
    "Harappan Civilization"
  ],
  "canonicalSummary": "印度河流域及邻近地区的城市社群，以规划街区、排水设施、标准化器物和远距离贸易相互联系。",
  "conceptLayerId": "polityAndSociety",
  "phaseIds": [
    "indus-civilization-core-presence"
  ],
  "tags": [
    "南亚",
    "早期城市",
    "城市社群"
  ],
  "sourceIds": [
    "source-wright-ancient-indus",
    "source-kenoyer-indus-civilisation",
    "source-green-indus-public-goods"
  ]
},
  {
    id: 'mohenjo-daro',
    type: 'archaeologicalSite',
    name: '摩亨佐-达罗',
    alternativeNames: ['Mohenjo-daro', 'Moenjodaro'],
    canonicalSummary: '位于今天巴基斯坦信德省的印度河文明城市遗址；街道、水井、排水设施和大浴池保存了成熟期城市生活的考古证据。',
    conceptLayerId: 'placeAndSite',
    phaseIds: ['mohenjo-daro-mature-urban-settlement'],
    tags: ['南亚', '考古遗址', '印度河文明'],
    sourceIds: ['source-unesco-mohenjo-daro', 'source-wright-ancient-indus']
  },
  {
    id: 'vedic-tradition',
    type: 'culturalTradition',
    name: '吠陀传统',
    alternativeNames: ['Vedic Tradition', '早期吠陀传统'],
    canonicalSummary: '约公元前1500—前500年在南亚西北部逐渐形成，以早期印度—雅利安语言、口传赞歌、祭火仪式和牧农生活产生长期影响的文化传统。后期与恒河流域的联系留在说明中；当前展示西北部已收录的传统范围，不代表某一部文献的撰写时长。',
    conceptLayerId: 'religionAndThought',
    phaseIds: [
      'vedic-early-hymn-oral-tradition'
    ],
    tags: ['南亚', '文化传统', '吠陀'],
    sourceIds: [
      'source-jamison-brereton-rigveda',
      'source-oxford-vedic-oral-tradition',
      'source-singh-ancient-india'
    ]
  }
] as const satisfies readonly Entity[];

export const ancientIndiaEntityPhases = [
{
  "id": "vedic-sanskrit-northwest-use",
  "entityId": "vedic-sanskrit-language",
  "title": "早期吠陀口传范围",
  "timeSpan": {
    "start": -1500,
    "end": -400,
    "approximate": true,
    "label": "约前1500—前400年"
  },
  "regions": [
    {
      "regionId": "south-asia-northwest",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-witzel-vedic-language-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-witzel-vedic-language-reviewed"
  ]
},
{
  "id": "indus-sign-system-use",
  "entityId": "indus-sign-system",
  "title": "主要使用范围",
  "timeSpan": {
    "start": -2600,
    "end": -1900,
    "approximate": true,
    "label": "约前2600—前1900年"
  },
  "regions": [
    {
      "regionId": "indus-basin",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-kenoyer-indus-signs-reviewed",
        "source-indus-undeciphered-reviewed"
      ]
    }
  ],
  "relationIds": [],
  "sourceIds": [
    "source-kenoyer-indus-signs-reviewed",
    "source-indus-undeciphered-reviewed"
  ]
},
  {
  "id": "indus-civilization-core-presence",
  "entityId": "indus-civilization",
  "title": "成熟城市网络",
  "timeSpan": {
    "start": -2600,
    "end": -1900,
    "label": "约公元前2600—前1900年",
    "approximate": true
  },
  "regions": [
    {
      "regionId": "indus-basin",
      "role": "core",
      "approximate": true,
      "sourceIds": [
        "source-green-indus-public-goods",
        "source-wright-ancient-indus",
        "source-kenoyer-indus-civilisation"
      ]
    },
    {
      "regionId": "south-asia-northwest",
      "role": "attested",
      "approximate": true,
      "sourceIds": [
        "source-green-indus-public-goods",
        "source-wright-ancient-indus",
        "source-kenoyer-indus-civilisation"
      ]
    }
  ],
  "relationIds": [
    "relation-mohenjo-daro-indus-civilization"
  ],
  "sourceIds": [
    "source-wright-ancient-indus",
    "source-kenoyer-indus-civilisation",
    "source-possehl-indus-mesopotamia",
    "source-giosan-harappan-transformation",
    "source-green-indus-public-goods"
  ]
},
  
  {
    id: 'mohenjo-daro-mature-urban-settlement',
    entityId: 'mohenjo-daro',
    timeSpan: { start: -2600, end: -1900, label: '约公元前2600—前1900年', approximate: true },
    regions: [
      region('indus-basin', 'attested', ['source-unesco-mohenjo-daro', 'source-wright-ancient-indus'], false)
    ],
    relationIds: ['relation-mohenjo-daro-indus-civilization'],
    sourceIds: [
      'source-unesco-mohenjo-daro',
      'source-wright-ancient-indus',
      'source-jansen-mohenjo-water',
      'source-green-indus-public-goods'
    ]
  },
  {
    id: 'vedic-early-hymn-oral-tradition',
    entityId: 'vedic-tradition',
    title: '南亚西北部传统见证',
    timeSpan: { start: -1500, end: -500, label: '已收录范围：约公元前1500—前500年', approximate: true },
    regions: [region('south-asia-northwest', 'core', ['source-jamison-brereton-rigveda', 'source-oxford-vedic-oral-tradition', 'source-singh-ancient-india'])],
    relationIds: [],
    sourceIds: ['source-jamison-brereton-rigveda', 'source-oxford-vedic-oral-tradition', 'source-cambridge-veda-before-print', 'source-singh-ancient-india']
  }
] as const satisfies readonly EntityPhase[];
