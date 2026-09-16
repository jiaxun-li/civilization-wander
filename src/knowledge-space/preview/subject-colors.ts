import type { KnowledgeSubject } from '../../../v6/schema/index.ts';
import { EGYPT_THEME, egyptSubjectColor } from './egypt-theme.ts';
import { CIVILIZATION_THEMES, civilizationSubjectColor } from './civilization-themes.ts';

/** Stable editorial identification colors, not claims about ancient flags. */
export const SUBJECT_COLORS: Readonly<Record<string, string>> = Object.freeze({
  ...EGYPT_THEME.polityColors,
  ...Object.assign({}, ...Object.values(CIVILIZATION_THEMES).map(theme => theme.polityColors))
});

// Stable language identities do not follow changes of dynasty.
const LANGUAGE_COLORS: Readonly<Record<string, string>> = {
  'sumerian-language': '#a16b38', 'akkadian-language': '#456d85',
  'egyptian-language': '#88621f', 'egyptian-hieratic': '#ad8042',
  'egyptian-demotic': '#654e30',
  'greek-language': '#356c82', 'greek-alphabet': '#356c82',
  'linear-a': '#438477', 'linear-b': '#356c82',
  'hittite-language': '#895346',
  'lydian-language': '#88683a', 'lydian-alphabet': '#88683a',
  'phoenician-language': '#87496b', 'phoenician-alphabet': '#87496b',
  'hebrew-language': '#426f81', 'paleo-hebrew-alphabet': '#426f81',
  'aramaic-language': '#6d607e', 'aramaic-alphabet': '#6d607e',
  'elamite-language': '#866044',
  'old-persian-language': '#3f7472', 'old-persian-cuneiform': '#3f7472',
  'old-chinese-language': '#99513e', 'chinese-writing-system': '#99513e',
  'vedic-sanskrit-language': '#956936', 'indus-sign-system': '#78684c'
};

/** Reviewed participant choices, never inferred from array order or location. */
export const EVENT_COLOR_PARTICIPANTS: Readonly<Record<string, string>> = Object.freeze({
  'event-hammurabi-conquests': 'old-babylonian-kingdom',
  'event-ahmose-captures-avaris': 'egypt-new-kingdom',
  'event-unas-pyramid-text-inscription': 'egypt-old-kingdom',
  'event-zhou-conquest-of-shang': 'western-zhou',
  'event-sanxingdui-ritual-object-deposition': 'sanxingdui-site',
  'event-hittite-sack-babylon': 'hittite-empire',
  'event-hittite-ugarit-treaty': 'hittite-empire',
  'event-ramesses-iii-northern-invasions': 'egypt-new-kingdom',
  'event-hittite-wilusa-treaty': 'hittite-empire',
  'event-lachish-captured': 'neo-assyrian-empire'
});

export const NEUTRAL_EVENT_COLOR = '#716c63';
export const EVENT_COLOR_EXCEPTIONS: Readonly<Record<string, string>> = Object.freeze({
  'event-battle-of-kadesh': '双方均宣称胜利，不指定单一胜方。',
  'event-egypt-hatti-treaty': '双方平等缔约，无单一主参与者。'
});

export function subjectColor(subject: KnowledgeSubject): string | undefined {
  if (subject.kind === 'event') {
    const participant = EVENT_COLOR_PARTICIPANTS[subject.id];
    return participant ? subjectColor({ kind: 'entity', id: participant }) : NEUTRAL_EVENT_COLOR;
  }
  return LANGUAGE_COLORS[subject.id] ?? egyptSubjectColor(subject)
    ?? (subject.kind === 'entity' ? SUBJECT_COLORS[subject.id] : undefined)
    ?? civilizationSubjectColor(subject);
}
