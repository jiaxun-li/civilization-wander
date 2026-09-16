import type { RelationParticipant, SourceIds, TemporalRelation } from '../../schema/index.ts';

function participant(
  entityId: string,
  phaseId: string,
  role: string,
  viewLabel: string,
  sourceIds: SourceIds
): RelationParticipant {
  return { subject: { kind: 'entity', id: entityId }, phaseId, role, viewLabel, sourceIds };
}

export const ancientEgyptTemporalRelations = [
  {
    id: 'relation-egypt-old-middle-kingdom-transition',
    family: 'historicalTransition',
    type: 'reunifiedAfterFragmentation',
    orientation: 'directed',
    participants: [
      participant(
        'egypt-old-kingdom',
        'egypt-old-kingdom-regional-presence',
        'fragmentingPredecessorPolity',
        '统一王权结束后形成南北分裂',
        ['source-muller-old-kingdom-end']
      ),
      participant(
        'egypt-middle-kingdom',
        'egypt-middle-kingdom-reunification',
        'reunifyingSuccessorPolity',
        '底比斯王室在分裂后建立新的统一王国',
        ['source-ucl-mentuhotep-ii']
      )
    ],
    timeSpan: { start: -2181, end: -2025, label: '古王国结束至中王国重新统一', approximate: true },
    summary: '古王国结束后的南北分裂，构成底比斯王室重新统一埃及并建立中王国的直接前史。',
    qualifiers: ['不把中王国视为古王国制度的简单恢复'],
    sourceIds: ['source-muller-old-kingdom-end', 'source-ucl-mentuhotep-ii']
  },
  {
    id: 'relation-egypt-middle-new-kingdom-transition',
    family: 'historicalTransition',
    type: 'reunifiedAfterFragmentation',
    orientation: 'directed',
    participants: [
      participant(
        'egypt-middle-kingdom',
        'egypt-middle-kingdom-consolidated-order',
        'fragmentingPredecessorPolity',
        '统一秩序分化为阿瓦里斯、底比斯等中心',
        ['source-ucl-second-intermediate', 'source-uee-second-intermediate']
      ),
      participant(
        'egypt-new-kingdom',
        'egypt-new-kingdom-reunification',
        'reunifyingSuccessorPolity',
        '雅赫摩斯攻取阿瓦里斯并重建统一王权',
        ['source-ucl-ahmose']
      )
    ],
    timeSpan: { start: -1700, end: -1550, label: '中王国结束至新王国重新统一', approximate: true },
    summary: '中王国结束后的阿瓦里斯与底比斯对峙，构成雅赫摩斯重新统一埃及并建立新王国的直接前史。',
    qualifiers: ['不把新王国扩张解释为单一战争的自动结果'],
    sourceIds: ['source-ucl-second-intermediate', 'source-ucl-ahmose']
  },
] as const satisfies readonly TemporalRelation[];
