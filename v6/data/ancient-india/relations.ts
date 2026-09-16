import type {
  RelationParticipant,
  SourceIds,
  TemporalRelation
} from '../../schema/index.ts';

function participant(
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

export const ancientIndiaTemporalRelations = [
  {
    id: 'relation-mohenjo-daro-indus-civilization',
    family: 'spatial',
    type: 'settlementWithinUrbanCulturalNetwork',
    orientation: 'directed',
    participants: [
      participant(
        'mohenjo-daro',
        'mohenjo-daro-mature-urban-settlement',
        'networkSettlementAndArchaeologicalSite',
        '作为城市遗址呈现印度河网络的一种地方实践',
        ['source-unesco-mohenjo-daro', 'source-wright-ancient-indus']
      ),
      participant(
        'indus-civilization',
        'indus-civilization-core-presence',
        'regionalCulturalNetwork',
        '包含摩亨佐-达罗但不由单一城市代表',
        ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation']
      )
    ],
    timeSpan: { start: -2600, end: -1900, label: '印度河文明成熟期', approximate: true },
    summary: '摩亨佐-达罗是印度河文明成熟期的重要城市遗址之一，地方城市证据与广域文化网络构成互补尺度。',
    qualifiers: ['不把一座城市的证据视为整个文明所有地区的统一状况'],
    sourceIds: [
      'source-wright-ancient-indus',
      'source-kenoyer-indus-civilisation',
      'source-unesco-mohenjo-daro'
    ]
  }
] as const satisfies readonly TemporalRelation[];
