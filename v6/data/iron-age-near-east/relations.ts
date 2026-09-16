import type { RelationParticipant, SourceIds, TemporalRelation } from '../../schema/index.ts';

const entityParticipant = (id: string, phaseId: string, role: string, viewLabel: string, sourceIds: SourceIds): RelationParticipant => ({ subject: { kind: 'entity', id }, phaseId, role, viewLabel, sourceIds });

export const ironAgeNearEastTemporalRelations = [
  {
  "id": "relation-assyria-conquers-israel",
  "family": "political",
  "type": "annexedKingdom",
  "orientation": "directed",
  "participants": [
    {
      "subject": {
        "kind": "entity",
        "id": "neo-assyrian-empire"
      },
      "phaseId": "neo-assyrian-syrian-provinces",
      "role": "annexingEmpire",
      "viewLabel": "逐步削减并吞并北方王国",
      "sourceIds": [
        "source-oracc-israel"
      ]
    },
    {
      "subject": {
        "kind": "entity",
        "id": "neo-assyrian-empire"
      },
      "phaseId": "neo-assyrian-imperial-administration",
      "role": "annexingEmpire",
      "viewLabel": "逐步削减并吞并北方王国",
      "sourceIds": [
        "source-oracc-israel"
      ]
    },
    {
      "subject": {
        "kind": "entity",
        "id": "kingdom-of-israel"
      },
      "phaseId": "israel-kingdom-presence",
      "role": "annexedKingdom",
      "viewLabel": "在贡赋与战争后被并入帝国",
      "sourceIds": [
        "source-oracc-israel"
      ]
    }
  ],
  "timeSpan": {
    "start": -734,
    "end": -720,
    "label": "约公元前734—前720年",
    "approximate": true
  },
  "summary": "亚述逐步削减并最终吞并以色列王国。",
  "sourceIds": [
    "source-oracc-israel"
  ]
},
  {
  "id": "relation-assyria-uses-aramaic",
  "family": "linguistic",
  "type": "usedInImperialAdministration",
  "orientation": "directed",
  "participants": [
    {
      "subject": {
        "kind": "entity",
        "id": "neo-assyrian-empire"
      },
      "phaseId": "neo-assyrian-expansion",
      "role": "adoptingEmpire",
      "viewLabel": "把阿拉米语书吏纳入多语言行政",
      "sourceIds": [
        "source-oracc-palace-scribe"
      ]
    },
    {
      "subject": {
        "kind": "entity",
        "id": "neo-assyrian-empire"
      },
      "phaseId": "neo-assyrian-syrian-provinces",
      "role": "adoptingEmpire",
      "viewLabel": "把阿拉米语书吏纳入多语言行政",
      "sourceIds": [
        "source-oracc-palace-scribe"
      ]
    },
    {
      "subject": {
        "kind": "entity",
        "id": "neo-assyrian-empire"
      },
      "phaseId": "neo-assyrian-imperial-administration",
      "role": "adoptingEmpire",
      "viewLabel": "把阿拉米语书吏纳入多语言行政",
      "sourceIds": [
        "source-oracc-palace-scribe"
      ]
    },
    {
      "subject": {
        "kind": "entity",
        "id": "aramaic-language"
      },
      "phaseId": "aramaic-in-assyrian-administration",
      "role": "administrativeLanguage",
      "viewLabel": "进入亚述宫廷与地方行政网络",
      "sourceIds": [
        "source-oracc-aramaic-hebrew",
        "source-oracc-palace-scribe"
      ]
    }
  ],
  "timeSpan": {
    "start": -800,
    "end": -700,
    "label": "约公元前8世纪，所选书吏见证",
    "approximate": true
  },
  "summary": "新亚述宫廷和地方行政逐渐把阿拉米语书吏纳入多语言文书系统。",
  "sourceIds": [
    "source-oracc-aramaic-hebrew",
    "source-oracc-palace-scribe"
  ]
},
  { id: 'relation-neo-babylon-succeeds-assyria', family: 'historicalTransition', type: 'overthrewAndSucceededImperialSpace', orientation: 'directed', participants: [entityParticipant('neo-babylonian-empire', 'neo-babylonian-rise-against-assyria', 'successorPolity', '推翻亚述并争夺其帝国空间', ['source-met-babylon']), entityParticipant('neo-assyrian-empire', 'neo-assyrian-collapse', 'fallingPredecessorPolity', '在战争中失去王都与帝国空间', ['source-met-assyria'])], timeSpan: { start: -626, end: -605, label: '公元前626—前605年' }, summary: '新巴比伦联合米底推翻亚述王权，并继续争夺亚述留下的叙利亚与黎凡特。', sourceIds: ['source-met-babylon', 'source-met-assyria'] }
] as const satisfies readonly TemporalRelation[];
