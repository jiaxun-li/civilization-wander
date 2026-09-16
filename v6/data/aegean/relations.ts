import type { RelationParticipant, SourceIds, TemporalRelation } from '../../schema/index.ts';

function p(entityId: string, phaseId: string, role: string, viewLabel: string, sourceIds: SourceIds): RelationParticipant {
  return { subject: { kind: 'entity', id: entityId }, phaseId, role, viewLabel, sourceIds };
}

export const aegeanTemporalRelations = [
  {
  "id": "relation-minoan-mycenaean-administration",
  "family": "linguistic",
  "type": "adaptedAdministrativeWritingPractice",
  "orientation": "directed",
  "participants": [
    {
      "subject": {
        "kind": "entity",
        "id": "mycenaean-civilization"
      },
      "phaseId": "mycenaean-palatial-administration",
      "role": "adaptingAdministrativeTradition",
      "viewLabel": "调整书写体系以记录早期希腊语",
      "sourceIds": [
        "source-salgarella-writing-bronze-age-crete",
        "source-bsa-linear-b"
      ]
    },
    {
      "subject": {
        "kind": "entity",
        "id": "minoan-palatial-civilization"
      },
      "phaseId": "minoan-knossos-linear-b-reorganization",
      "role": "existingCretanWritingContext",
      "viewLabel": "克诺索斯宫殿延续行政书写",
      "sourceIds": [
        "source-salgarella-writing-bronze-age-crete",
        "source-bsa-linear-b"
      ]
    }
  ],
  "timeSpan": {
    "start": -1450,
    "end": -1375,
    "label": "约公元前1450—前1375年",
    "approximate": true
  },
  "summary": "迈锡尼书吏在克里特既有线形书写传统的行政环境中使用线形文字B记录早期希腊语。",
  "qualifiers": [
    "文字形态联系不表示线形文字A与线形文字B记录同一种语言"
  ],
  "sourceIds": [
    "source-salgarella-writing-bronze-age-crete",
    "source-bsa-linear-b"
  ]
},
  {
    id: 'relation-mycenaean-dark-age-reorganization', family: 'historicalTransition', type: 'reorganizedAfterPalatialEnd', orientation: 'directed',
    participants: [
      p('mycenaean-civilization', 'mycenaean-palatial-administration', 'endingPalatialTradition', '宫殿终结并留下部分延续的物质与技术传统', ['source-deger-jalkotzy-aftermath']),
      p('greek-dark-age-communities', 'greek-postpalatial-local-communities', 'reorganizingCommunities', '在宫殿终结后以地方社区重新组织生活', ['source-cambridge-mycenaean-transformation'])
    ],
    timeSpan: { start: -1200, end: -1050, label: '约公元前1200—前1050年', approximate: true },
    summary: '迈锡尼宫殿终结后，爱琴海社区缩小并地方化，同时延续部分陶器、金属加工和航海传统。',
    sourceIds: ['source-deger-jalkotzy-aftermath', 'source-cambridge-mycenaean-transformation']
  },
  {
    id: 'relation-mycenaean-divine-names', family: 'religious', type: 'attestedDivineNamesInPalatialRecords', orientation: 'directed',
    participants: [
      p('mycenaean-civilization', 'mycenaean-palatial-administration', 'recordingPalatialContext', '宫殿泥版记录部分神名与献祭物', ['source-cambridge-mycenaean-religion', 'source-lupack-local-horizon']),
      p('greek-divine-tradition', 'greek-divine-mycenaean-attestations', 'attestedReligiousTradition', '部分后来熟悉的神名得到青铜时代文字见证', ['source-cambridge-mycenaean-religion', 'source-lupack-local-horizon'])
    ],
    timeSpan: { start: -1450, end: -1200, label: '约公元前1450—前1200年', approximate: true },
    summary: '迈锡尼宫殿泥版记录了宙斯、波塞冬、赫拉等神名与献祭物，但没有保存完整神话叙事。',
    qualifiers: ['神名连续不等于后世神话已经以相同形式存在'],
    sourceIds: ['source-cambridge-mycenaean-religion', 'source-lupack-local-horizon']
  },
] as const satisfies readonly TemporalRelation[];
