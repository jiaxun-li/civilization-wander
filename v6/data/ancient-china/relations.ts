import type { RelationParticipant, SourceIds, TemporalRelation } from '../../schema/index.ts';

function entityParticipant(
  id: string,
  phaseId: string,
  role: string,
  viewLabel: string,
  sourceIds: SourceIds
): RelationParticipant {
  return { subject: { kind: 'entity', id }, phaseId, role, viewLabel, sourceIds };
}

export const ancientChinaTemporalRelations = [
  {
    id: 'relation-erlitou-shang-transition',
    family: 'historicalTransition',
    type: 'overlappedWithEarlyShangFormation',
    orientation: 'directed',
    participants: [
      entityParticipant('erlitou-site', 'erlitou-site-presence', 'precedingUrbanTradition', '晚期遗存与早商物质文化交接', ['source-erlitou-rethinking', 'source-liu-chen-archaeology-china']),
      entityParticipant('shang-civilization', 'shang-regional-rule', 'emergingPoliticalOrder', '形成继起的早商城市网络', ['source-bagley-shang-archaeology'])
    ],
    timeSpan: { start: -1700, end: -1500, label: '二里头晚期与早商物质文化交接时期', approximate: true },
    summary: '二里头晚期与早商物质文化在时间上存在交接和互动。',
    qualifiers: ['不把考古文化转换写成已经完全确定的单线王朝继承'],
    sourceIds: ['source-erlitou-rethinking', 'source-liu-chen-archaeology-china', 'source-bagley-shang-archaeology']
  },
  {
    id: 'relation-sanxingdui-shang-bronze-comparison',
    family: 'technological',
    type: 'sharedMaterialAndTechnicalConnections',
    orientation: 'symmetric',
    participants: [
      entityParticipant('sanxingdui-site', 'sanxingdui-site-presence', 'regionalRitualContext', '以成都平原的仪式组合使用青铜材料', ['source-sxd-antiquity-2022', 'source-sxd-southwest-exchange-2024']),
      entityParticipant('shang-bronze-ritual-vessels', 'shang-bronzes-late-ritual-use', 'comparedArtifactTradition', '与另一套青铜仪式组合比较', ['source-bagley-shang-archaeology'])
    ],
    timeSpan: { start: -1300, end: -1046, label: '晚商时期的材料与技术比较', approximate: true },
    summary: '三星堆与商代青铜礼器共享材料与技术联系，却把器物组织进不同的仪式形象与使用方式。',
    qualifiers: ['器物与技术联系不等于政治控制，也不等于单向模仿'],
    sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-southwest-exchange-2024', 'source-bagley-shang-archaeology']
  }
] as const satisfies readonly TemporalRelation[];
