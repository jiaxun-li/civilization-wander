import type { ContinuousBlockRun } from '../layout/index.ts';

/** Label anchors only, never exact capital locations or territorial claims.
 * Capital regions are preferred; multi-centre cultures use a representative
 * core region. Akkad's city location remains uncertain.
 */
export const POLITY_LABEL_REGIONS: Readonly<Record<string, string>> = {
  'egypt-old-kingdom': 'nile-valley',
  'egypt-middle-kingdom': 'nile-valley',
  'egypt-new-kingdom': 'nile-valley',
  'akkadian-empire': 'central-mesopotamia',
  'ur-iii-kingdom': 'southern-mesopotamia',
  'old-babylonian-kingdom': 'central-mesopotamia',
  'neo-babylonian-empire': 'central-mesopotamia',
  'assur-community': 'upper-mesopotamia',
  'neo-assyrian-empire': 'upper-mesopotamia',
  'minoan-palatial-civilization': 'crete',
  'mycenaean-civilization': 'greek-mainland',
  'greek-dark-age-communities': 'greek-mainland',
  'hittite-empire': 'central-anatolia',
  'lydian-kingdom': 'western-anatolia',
  'ugarit-kingdom': 'syria-northern-levant',
  'kingdom-of-israel': 'southern-levant',
  'kingdom-of-judah': 'southern-levant',
  'indus-civilization': 'indus-basin',
  'shang-civilization': 'middle-yellow-river',
  'western-zhou': 'middle-yellow-river'
};

/** Keep one name per political subject, on its widest visible core run.
 * Do not move it to a peripheral region when the core is outside the window.
 */
export function polityLabelRunIds(runs: readonly ContinuousBlockRun[]): ReadonlySet<string> {
  const chosen = new Map<string, ContinuousBlockRun>();
  for (const run of runs) {
    const region = POLITY_LABEL_REGIONS[run.subjectRef.id];
    if (run.subjectRef.kind !== 'entity' || !region || run.rowId !== `region:${region}`) continue;
    const previous = chosen.get(run.subjectRef.id);
    if (!previous || run.xEnd - run.xStart > previous.xEnd - previous.xStart) {
      chosen.set(run.subjectRef.id, run);
    }
  }
  return new Set([...chosen.values()].map(run => run.id));
}
