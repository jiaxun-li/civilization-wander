import type {
  RelationParticipant,
  SourceIds,
  TemporalRelation
} from '../../schema/index.ts';

function entityParticipant(
  id: string,
  phaseId: string,
  role: string,
  viewLabel: string,
  sourceIds: SourceIds
): RelationParticipant {
  return {
    subject: { kind: 'entity', id },
    phaseId,
    role,
    viewLabel,
    sourceIds
  };
}

export const mesopotamiaTemporalRelations = [
  {
    id: 'relation-cuneiform-gilgamesh',
    family: 'literary',
    type: 'writtenInScript',
    orientation: 'directed',
    participants: [
      entityParticipant('cuneiform', 'cuneiform-multilingual-transmission', 'recordingSystem', '以楔形文字书写史诗', [
        'source-british-museum-gilgamesh-tablet-i',
        'source-george-babylonian-gilgamesh-epic'
      ]),
      entityParticipant('epic-of-gilgamesh', 'gilgamesh-standard-version-composition', 'writtenWork', '标准巴比伦版本以楔形文字书写', [
        'source-met-gilgamesh-overview',
        'source-george-babylonian-gilgamesh-epic',
        'source-british-museum-gilgamesh-tablet-i'
      ])
    ],
    timeSpan: { start: -1150, end: -1150, label: '约公元前12世纪', approximate: true },
    summary: '《吉尔伽美什史诗》的标准巴比伦版本以楔形文字书写。',
    qualifiers: ['采用标准巴比伦版本的代表成文年代，不表示早期故事始于此时或可确定某一撰写年'],
    sourceIds: [
      'source-met-gilgamesh-overview',
      'source-george-babylonian-gilgamesh-epic',
      'source-british-museum-gilgamesh-tablet-i'
    ]
  },
  {
    id: 'relation-akkadian-ur-iii-transition',
    family: 'historicalTransition',
    type: 'reorganizedAfterFragmentation',
    orientation: 'directed',
    participants: [
      entityParticipant('akkadian-empire', 'akkadian-fragmentation', 'fragmentingPredecessorPolity', '破碎后形成新的跨城邦秩序', [
        'source-met-akkadian-period',
        'source-garfinkle-kingdom-ur'
      ]),
      entityParticipant('ur-iii-kingdom', 'ur-iii-kingdom-order', 'emergingSuccessorOrder', '继承阿卡德之后的政治世界', [
        'source-garfinkle-kingdom-ur',
        'source-steinkeller-ur-iii-core-periphery'
      ])
    ],
    timeSpan: { start: -2200, end: -2095, label: '约公元前2200—前2095年', approximate: true },
    summary: '阿卡德王朝收缩后，南部城市经历重新竞争，乌尔第三王朝逐步建立了不同于阿卡德的跨城邦秩序。',
    qualifiers: ['不表示两个王朝之间存在立即而完整的政权交接'],
    sourceIds: [
      'source-met-akkadian-period',
      'source-garfinkle-kingdom-ur',
      'source-steinkeller-ur-iii-core-periphery'
    ]
  }
] as const satisfies readonly TemporalRelation[];
