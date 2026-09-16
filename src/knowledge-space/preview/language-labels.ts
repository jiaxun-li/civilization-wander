import type { LaidOutRegionTimeMark } from '../layout/index.ts';

/** Representative language centres in the existing Region rows. These are
 * label anchors, not new city locations or claims of a single language origin. */
export const LANGUAGE_LABEL_REGIONS: Readonly<Record<string, string>> = {
  'sumerian-language': 'southern-mesopotamia',
  'akkadian-language': 'central-mesopotamia',
  'egyptian-language': 'nile-valley',
  'greek-language': 'greek-mainland',
  'hittite-language': 'central-anatolia',
  'lydian-language': 'western-anatolia',
  'phoenician-language': 'syria-northern-levant',
  'hebrew-language': 'southern-levant',
  'aramaic-language': 'syria-northern-levant',
  'elamite-language': 'iranian-plateau',
  'old-persian-language': 'iranian-plateau',
  'old-chinese-language': 'north-china-plain',
  'vedic-sanskrit-language': 'south-asia-northwest'
};

/** One name per language, on its widest visible placement in the chosen centre.
 * A hidden or out-of-window centre never transfers its label to another row. */
export function languageLabelMarkIds(marks: readonly LaidOutRegionTimeMark[]): ReadonlySet<string> {
  const chosen = new Map<string, LaidOutRegionTimeMark>();
  for (const mark of marks) {
    if (mark.sourceMark.semanticKind.kind !== 'entity'
      || mark.sourceMark.semanticKind.entityType !== 'language'
      || mark.regionId !== LANGUAGE_LABEL_REGIONS[mark.sourceMark.subjectRef.id]) continue;
    const previous = chosen.get(mark.sourceMark.subjectRef.id);
    if (!previous || mark.xEnd - mark.xStart > previous.xEnd - previous.xStart) {
      chosen.set(mark.sourceMark.subjectRef.id, mark);
    }
  }
  return new Set([...chosen.values()].map(mark => mark.id));
}
