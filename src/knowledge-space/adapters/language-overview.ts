import type { KnowledgeSpaceMark } from '../model/index.ts';

/** Editorial overview choices: retained objects remain in the knowledge core. */
export const LANGUAGE_DETAIL_ONLY_PLACEMENTS = [
  { entityId: 'egyptian-hieratic', regionId: 'nile-valley' },
  { entityId: 'egyptian-demotic', regionId: 'nile-valley' },
  { entityId: 'aramaic-language', regionId: 'iranian-plateau' }
] as const;

/** Writing systems used for these languages; not inferred from overlapping dates. */
export const LANGUAGE_WRITING_DETAILS: Readonly<Record<string, readonly string[]>> = {
  'egyptian-language': ['egyptian-hieroglyphs', 'egyptian-hieratic', 'egyptian-demotic'],
  'sumerian-language': ['cuneiform'],
  'akkadian-language': ['cuneiform'],
  'greek-language': ['linear-b', 'greek-alphabet'],
  'hittite-language': ['cuneiform'],
  'lydian-language': ['lydian-alphabet'],
  'phoenician-language': ['phoenician-alphabet'],
  'hebrew-language': ['paleo-hebrew-alphabet'],
  'aramaic-language': ['aramaic-alphabet'],
  'elamite-language': ['cuneiform'],
  'old-persian-language': ['old-persian-cuneiform'],
  'old-chinese-language': ['chinese-writing-system']
};

export function buildLanguageOverviewMarks(marks: readonly KnowledgeSpaceMark[]): readonly KnowledgeSpaceMark[] {
  for (const choice of LANGUAGE_DETAIL_ONLY_PLACEMENTS) {
    if (!marks.some(mark => mark.subjectRef.id === choice.entityId
      && mark.conceptLayerId === 'languageAndKnowledge'
      && mark.regionSegments.some(region => region.regionId === choice.regionId))) {
      throw new Error(`Language overview choice is stale: ${choice.entityId}@${choice.regionId}`);
    }
  }
  const overview = marks.map(mark => mark.conceptLayerId !== 'languageAndKnowledge' ? mark : {
    ...mark,
    regionSegments: mark.regionSegments.filter(region => !LANGUAGE_DETAIL_ONLY_PLACEMENTS.some(
      choice => choice.entityId === mark.subjectRef.id && choice.regionId === region.regionId
    ))
  });
  const rows = new Map<string, KnowledgeSpaceMark[]>();
  for (const mark of overview) {
    if (mark.conceptLayerId !== 'languageAndKnowledge' || mark.semanticKind.kind !== 'entity') continue;
    for (const region of mark.regionSegments) {
      const row = rows.get(region.regionId) ?? [];
      row.push(mark);
      rows.set(region.regionId, row);
    }
  }
  // Inclusive historical spans: starts are enough to detect every peak.
  // Count identities, so overlapping phases of one subject count only once.
  for (const [regionId, row] of rows) {
    for (const year of new Set(row.map(mark => mark.timeSpan.start))) {
      const languages = new Set<string>();
      const scripts = new Set<string>();
      for (const mark of row) {
        if (mark.timeSpan.start > year || mark.timeSpan.end < year || mark.semanticKind.kind !== 'entity') continue;
        (mark.semanticKind.entityType === 'language' ? languages : scripts).add(mark.subjectRef.id);
      }
      if (languages.size > 2 || scripts.size > 1) throw new Error(`Language overview needs editorial review: ${regionId}@${year}`);
    }
  }
  return overview;
}
