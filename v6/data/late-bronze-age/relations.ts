import type { RelationParticipant, SourceIds, TemporalRelation } from '../../schema/index.ts';

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

export const lateBronzeAgeTemporalRelations = [
  {
    id: 'relation-ugarit-hittite-vassal',
    family: 'political',
    type: 'treatyBoundVassalPolity',
    orientation: 'directed',
    participants: [
      participant('ugarit-kingdom', 'ugarit-kingdom-presence', 'treatyBoundLocalPolity', '以条约承担忠诚、贡赋与军事义务', ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit']),
      participant('hittite-empire', 'hittite-syrian-control', 'overlordPolity', '以条约确认地方王位和义务', ['source-beckman-hittite-diplomatic-texts'])
    ],
    timeSpan: { start: -1350, end: -1180, label: '约公元前1350—前1180年', approximate: true },
    summary: '乌加里特在赫梯主导的条约体系中保留地方王权，同时承担贡赋、忠诚和军事义务，直到两个中央宫殿体系在公元前12世纪初终结。',
    qualifiers: ['条约规定不等于每项义务始终完整执行'],
    sourceIds: [
      'source-beckman-hittite-diplomatic-texts',
      'source-met-ugarit',
      'source-bryce-hittite-kingdom',
      'source-yon-city-of-ugarit'
    ]
  }
] as const satisfies readonly TemporalRelation[];
