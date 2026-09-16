import type { KnowledgeSpaceMark } from '../model/index.ts';

/** Reviewed detail-only placements. Full spatial evidence remains in the core
 * and selection details; these are not deletion or repair of invalid records.
 */
export const POLITY_DETAIL_ONLY_PLACEMENTS = [
  { phaseId: 'neo-assyrian-imperial-administration', regionId: 'southern-levant', role: 'controlled', reason: '只涵盖米吉多等征服地区；延续已批准的总览精简，不挤占犹大与以色列的独立轨道。' },
  { phaseId: 'neo-babylonian-capital-and-rule', regionId: 'southern-levant', role: 'influence', reason: '战争与宗主势力的概括关联不等于全时段直辖；保留在详情。' }
] as const;

export function buildPolityOverviewMarks(marks: readonly KnowledgeSpaceMark[]): readonly KnowledgeSpaceMark[] {
  for (const placement of POLITY_DETAIL_ONLY_PLACEMENTS) {
    const mark = marks.find(mark => mark.phaseId === placement.phaseId);
    const segment = mark?.regionSegments.find(segment => segment.regionId === placement.regionId);
    if (!mark || mark.conceptLayerId !== 'polityAndSociety' || segment?.role !== placement.role) {
      throw new Error(`Political overview review is stale: ${placement.phaseId}@${placement.regionId}`);
    }
  }
  return marks.map(mark => {
    const regionSegments = mark.regionSegments.filter(segment => !POLITY_DETAIL_ONLY_PLACEMENTS.some(
      placement => placement.phaseId === mark.phaseId && placement.regionId === segment.regionId
    ));
    return regionSegments.length === mark.regionSegments.length ? mark : { ...mark, regionSegments };
  });
}
