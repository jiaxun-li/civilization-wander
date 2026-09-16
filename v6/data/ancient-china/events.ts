import type {
  EditorialReviewReferences,
  EventEvidenceReference,
  EventParticipant,
  RegionalAssociation,
  RegionalRole,
  SourceIds
} from '../../schema/index.ts';
import {
  attachEventConceptLayers,
  quarantineHistoricalProcesses,
  type EventWithoutConceptLayer
} from '../event-concepts.ts';

function region(regionId: string, role: RegionalRole, sourceIds: SourceIds): RegionalAssociation {
  return { regionId, role, approximate: true, sourceIds };
}

function participant(
  entityId: string,
  phaseId: string,
  role: string,
  sourceIds: SourceIds,
  description?: string
): EventParticipant {
  return { entityId, phaseId, role, ...(description ? { description } : {}), sourceIds };
}

function evidence(v5ClaimBlockId: string, sourceIds: SourceIds): EventEvidenceReference {
  return { v5ClaimBlockId, sourceIds };
}

function review(
  sourceIds: SourceIds,
  refs: Partial<Omit<EditorialReviewReferences, 'sourceIds'>> = {}
): EditorialReviewReferences {
  return {
    limitationClaimIds: refs.limitationClaimIds ?? [],
    counterexampleClaimIds: refs.counterexampleClaimIds ?? [],
    uncertaintyClaimIds: refs.uncertaintyClaimIds ?? [],
    alternativeExplanationClaimIds: refs.alternativeExplanationClaimIds ?? [],
    sourceIds
  };
}

const ancientChinaEventDefinitions = [
  {
    id: 'event-early-china-regional-centers-emerge', kind: 'historicalProcess', title: '中国多地大型聚落与区域中心形成',
    timeSpan: { start: -3300, end: -1900, label: '约公元前3300—前1900年', approximate: true },
    regions: [region('middle-yellow-river', 'attested', ['source-liu-chen-archaeology-china']), region('lower-yangtze', 'attested', ['source-unesco-liangzhu'])],
    participants: [participant('china-early-bronze-world', 'early-china-regional-centers', 'regionalCulturalWorld', ['source-unesco-liangzhu', 'source-liu-chen-archaeology-china'])],
    evidence: [evidence('event-early-china-centers-evidence', ['source-unesco-liangzhu', 'source-liu-chen-archaeology-china'])],
    editorialReview: review(['source-liu-chen-archaeology-china'], { limitationClaimIds: ['event-early-china-centers-difference'] }),
    sourceIds: ['source-unesco-liangzhu', 'source-liu-chen-archaeology-china']
  },
  {
    id: 'event-shang-bronze-production-and-ritual-use', kind: 'historicalProcess', title: '商代青铜生产进入祖先礼仪',
    timeSpan: { start: -1600, end: -1046, label: '约公元前1600—前1046年', approximate: true },
    regions: [region('middle-yellow-river', 'attested', ['source-bagley-shang-archaeology']), region('north-china-plain', 'attested', ['source-met-shang-zhou-bronze'])],
    participants: [
      participant('shang-bronze-ritual-vessels', 'shang-bronzes-erligang-production', 'producedArtifactClass', ['source-smithsonian-bronze-casting']),
      participant('shang-bronze-ritual-vessels', 'shang-bronzes-late-ritual-use', 'ritualArtifactClass', ['source-met-shang-zhou-bronze']),
      participant('shang-civilization', 'shang-regional-rule', 'organizingPolity', ['source-bagley-shang-archaeology']),
      participant('shang-civilization', 'shang-regional-rule', 'ritualPolity', ['source-bagley-shang-archaeology'])
    ],
    evidence: [evidence('event-shang-bronze-ritual-evidence', ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting', 'source-met-shang-zhou-bronze'])],
    editorialReview: review(['source-met-shang-zhou-bronze'], { limitationClaimIds: ['event-shang-bronze-ritual-elite'] }),
    sourceIds: ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting', 'source-met-shang-zhou-bronze']
  },
  {
    id: 'event-western-zhou-eastern-expansion', kind: 'historicalProcess', title: '西周建设东方政治中心',
    timeSpan: { start: -1045, end: -1000, label: '约公元前1045—前1000年', approximate: true },
    regions: [region('middle-yellow-river', 'core', ['source-li-feng-early-china']), region('north-china-plain', 'controlled', ['source-western-zhou-domain'])],
    participants: [participant('western-zhou', 'western-zhou-regional-rule', 'expandingPolity', ['source-western-zhou-domain', 'source-li-feng-early-china'])],
    evidence: [evidence('event-western-zhou-east-evidence', ['source-western-zhou-domain', 'source-li-feng-early-china'])],
    editorialReview: review(['source-western-zhou-domain'], { uncertaintyClaimIds: ['event-western-zhou-east-control'] }),
    sourceIds: ['source-western-zhou-domain', 'source-li-feng-early-china']
  },
  {
    id: 'event-western-zhou-investiture', kind: 'historicalProcess', title: '西周册命进入青铜铭文',
    timeSpan: { start: -1020, end: -850, label: '约公元前1020—前850年', approximate: true },
    regions: [region('middle-yellow-river', 'attested', ['source-national-museum-da-yu-ding', 'source-national-museum-ceming'])],
    participants: [
      participant('western-zhou', 'western-zhou-regional-rule', 'commissioningPolity', ['source-national-museum-da-yu-ding']),
      participant('western-zhou', 'western-zhou-regional-rule', 'commissioningPolity', ['source-national-museum-ceming'])
    ],
    evidence: [evidence('event-western-zhou-investiture-evidence', ['source-national-museum-da-yu-ding', 'source-national-museum-ceming'])],
    editorialReview: review(['source-national-museum-ceming'], { limitationClaimIds: ['event-western-zhou-investiture-elite'] }),
    sourceIds: ['source-national-museum-da-yu-ding', 'source-national-museum-ceming']
  },
  {
    id: 'event-erlitou-urban-consolidation', kind: 'historicalProcess', title: '二里头城市中心形成',
    timeSpan: { start: -1800, end: -1600, label: '二里头文化第二至第三期', approximate: true },
    regions: [region('middle-yellow-river', 'attested', ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement'])],
    participants: [participant('erlitou-site', 'erlitou-site-presence', 'developingUrbanSite', ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement'])],
    evidence: [evidence('event-erlitou-urban-consolidation-evidence', ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement'])],
    editorialReview: review(['source-erlitou-cass-report', 'source-zhao-erlitou-settlement', 'source-erlitou-radiocarbon', 'source-liu-chen-archaeology-china'], {
      limitationClaimIds: ['event-erlitou-urban-consolidation-excavation'],
      uncertaintyClaimIds: ['event-erlitou-urban-consolidation-phasing'],
      alternativeExplanationClaimIds: ['event-erlitou-urban-consolidation-causes']
    }),
    sourceIds: ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement', 'source-erlitou-radiocarbon']
  },
  {
    id: 'event-erligang-urban-expansion', kind: 'historicalProcess', title: '二里岗城市与物质文化扩展',
    timeSpan: { start: -1600, end: -1400, label: '约公元前1600—前1400年', approximate: true },
    regions: [region('middle-yellow-river', 'core', ['source-an-zhengzhou-shang-city']), region('north-china-plain', 'influence', ['source-steinke-erligang'])],
    participants: [participant('shang-civilization', 'shang-regional-rule', 'expandingPolity', ['source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-bagley-shang-archaeology'])],
    evidence: [evidence('event-erligang-urban-expansion-evidence', ['source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-bagley-shang-archaeology'])],
    editorialReview: review(['source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-bagley-shang-archaeology'], {
      limitationClaimIds: ['event-erligang-urban-expansion-material'],
      uncertaintyClaimIds: ['event-erligang-urban-expansion-identity'],
      alternativeExplanationClaimIds: ['event-erligang-urban-expansion-network']
    }),
    sourceIds: ['source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-bagley-shang-archaeology']
  },
  {
    id: 'event-late-shang-royal-divination', kind: 'historicalProcess', title: '晚商王室占卜并保存甲骨记录',
    timeSpan: { start: -1250, end: -1046, label: '约公元前1250—前1046年', approximate: true },
    regions: [region('north-china-plain', 'attested', ['source-keightley-shang-history', 'source-unesco-oracle-bones'])],
    participants: [
      participant('shang-civilization', 'shang-regional-rule', 'diviningRoyalPolity', ['source-keightley-shang-history', 'source-keightley-ancestral-landscape']),
      participant('shang-oracle-bone-inscriptions', 'shang-oracle-bone-royal-divination-corpus', 'recordCorpus', ['source-keightley-shang-history', 'source-unesco-oracle-bones'])
    ],
    evidence: [evidence('event-late-shang-royal-divination-evidence', ['source-keightley-shang-history', 'source-unesco-oracle-bones'])],
    editorialReview: review(['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-unesco-oracle-bones'], {
      limitationClaimIds: ['event-late-shang-royal-divination-bias'],
      uncertaintyClaimIds: ['event-late-shang-royal-divination-survival'],
      alternativeExplanationClaimIds: ['event-late-shang-royal-divination-functions']
    }),
    sourceIds: ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-unesco-oracle-bones']
  },
  {
    id: 'event-fu-hao-activities', kind: 'historicalProcess', title: '妇好参与晚商祭祀、军事与王室事务',
    timeSpan: { start: -1250, end: -1190, label: '公元前十三世纪', approximate: true },
    regions: [region('north-china-plain', 'attested', ['source-keightley-shang-history', 'source-smarthistory-fu-hao'])],
    participants: [participant('shang-civilization', 'shang-regional-rule', 'royalPoliticalContext', ['source-keightley-shang-history', 'source-smarthistory-fu-hao'])],
    evidence: [evidence('event-fu-hao-activities-evidence', ['source-keightley-shang-history', 'source-smarthistory-fu-hao', 'source-mizoguchi-xibeigang'])],
    editorialReview: review(['source-keightley-shang-history', 'source-smarthistory-fu-hao', 'source-mizoguchi-xibeigang'], {
      limitationClaimIds: ['event-fu-hao-activities-title'],
      uncertaintyClaimIds: ['event-fu-hao-activities-correlation'],
      alternativeExplanationClaimIds: ['event-fu-hao-activities-roles']
    }),
    sourceIds: ['source-keightley-shang-history', 'source-smarthistory-fu-hao', 'source-mizoguchi-xibeigang']
  },
  {
    id: 'event-zhou-conquest-of-shang', kind: 'historicalEvent', title: '武王克商',
    timeSpan: { start: -1046, end: -1046, label: '约公元前1046年', approximate: true },
    regions: [region('middle-yellow-river', 'attested', ['source-national-museum-li-gui']), region('north-china-plain', 'attested', ['source-anyang-fall'])],
    participants: [
      participant('shang-civilization', 'shang-regional-rule', 'defeatedPolity', ['source-anyang-fall', 'source-khayutina-cultural-memory']),
      participant('western-zhou', 'western-zhou-regional-rule', 'conqueringPolity', ['source-national-museum-li-gui'])
    ],
    evidence: [evidence('event-zhou-conquest-of-shang-evidence', ['source-national-museum-li-gui', 'source-anyang-fall', 'source-khayutina-cultural-memory', 'source-met-shang-zhou-bronze'])],
    editorialReview: review(['source-national-museum-li-gui', 'source-anyang-fall', 'source-khayutina-cultural-memory', 'source-met-shang-zhou-bronze'], {
      limitationClaimIds: ['event-zhou-conquest-of-shang-memory'],
      uncertaintyClaimIds: ['event-zhou-conquest-of-shang-date'],
      alternativeExplanationClaimIds: ['event-zhou-conquest-of-shang-change']
    }),
    sourceIds: ['source-national-museum-li-gui', 'source-anyang-fall', 'source-khayutina-cultural-memory', 'source-met-shang-zhou-bronze']
  },
  {
    id: 'event-sanxingdui-ritual-object-deposition', kind: 'historicalEvent', title: '三星堆器物埋藏',
    timeSpan: { start: -1200, end: -950, label: '埋藏定年范围：约公元前1200—前950年', approximate: true },
    regions: [region('sichuan-basin', 'attested', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023'])],
    participants: [participant('sanxingdui-site', 'sanxingdui-site-presence', 'depositionSite', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025'])],
    evidence: [evidence('event-sanxingdui-deposition-evidence', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025'])],
    editorialReview: review(['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025', 'source-sxd-southwest-exchange-2024'], {
      limitationClaimIds: ['event-sanxingdui-deposition-pit-functions'],
      uncertaintyClaimIds: ['event-sanxingdui-deposition-chronology'],
      alternativeExplanationClaimIds: ['event-sanxingdui-deposition-causes']
    }),
    sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025']
  }
] as const satisfies readonly EventWithoutConceptLayer[];

const ancientChinaEventReviewPartition = quarantineHistoricalProcesses(attachEventConceptLayers(
  ancientChinaEventDefinitions,
  {
    'event-early-china-regional-centers-emerge': 'placeAndSite',
    'event-shang-bronze-production-and-ritual-use': 'technologyAndExchange',
    'event-western-zhou-eastern-expansion': 'polityAndSociety',
    'event-western-zhou-investiture': 'languageAndKnowledge',
    'event-erlitou-urban-consolidation': 'placeAndSite',
    'event-erligang-urban-expansion': 'placeAndSite',
    'event-late-shang-royal-divination': 'religionAndThought',
    'event-fu-hao-activities': 'polityAndSociety',
    'event-zhou-conquest-of-shang': 'eventAndConflict',
    'event-sanxingdui-ritual-object-deposition': 'religionAndThought'
  }
));

export const ancientChinaEvents = ancientChinaEventReviewPartition.acceptedEvents;
export const ancientChinaPendingHistoricalProcesses = ancientChinaEventReviewPartition.pendingHistoricalProcesses;
