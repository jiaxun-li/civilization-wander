import type { ResolvedTimeSpan } from '../model/index.ts';
import { EGYPT_THEME } from './egypt-theme.ts';
import { CIVILIZATION_THEMES } from './civilization-themes.ts';
import type { CivilizationMotifKind } from '../renderers/svg/civilization-motif.tsx';

export interface CivilizationBackdropSpec {
  readonly id: string;
  readonly regionIds: readonly string[];
  readonly start: number;
  readonly end: number;
  readonly foreground: string;
  readonly background: string;
  readonly motifKind: CivilizationMotifKind;
  readonly rationale: string;
  readonly evidence: readonly string[];
  readonly referenceTimeSpan?: { readonly start: number; readonly end: number };
}

/** Editorial display coverage, not the birth/end of a civilization or a territory. */
export const EGYPT_BACKDROP = Object.freeze({
  id: 'ancient-egypt',
  label: '古埃及',
  regionIds: ['nile-delta', 'nile-valley'] as readonly string[],
  start: -3500,
  end: -300,
  rationale: '用户指定暂以公元前3500—前300年为背景展示范围；连续底色表示文化阅读环境，不表示连续统一统治。边界是设计范围，不是文明起止或历史阶段断限。',
  motif: '原创简化狮身人面像轮廓，用作文明识别装饰，不是器物摹本或建设日期标记。'
});

function culturalBackdrop(
  id: keyof typeof CIVILIZATION_THEMES,
  regionIds: readonly string[], start: number, end: number,
  motifKind: CivilizationMotifKind, evidence: readonly string[], rationale: string
): CivilizationBackdropSpec {
  const theme = CIVILIZATION_THEMES[id];
  return { id, regionIds, start, end, motifKind, evidence, rationale,
    foreground: theme.foreground, background: theme.background };
}

/** Reviewed cultural reading contexts, never generated from political control. */
const REVIEWED_CULTURAL_CONTEXTS: readonly CivilizationBackdropSpec[] = [
  { ...EGYPT_BACKDROP, foreground: EGYPT_THEME.foreground, background: EGYPT_THEME.background,
    motifKind: 'sphinx', evidence: ['用户指定前3500—前300年为背景展示范围。'] },
  culturalBackdrop('mesopotamia', ['central-mesopotamia', 'southern-mesopotamia'], -3500, -1894,
    'ziggurat', ['source-met-uruk-first-city', 'source-met-ur-ziggurat'],
    '早期两河城市文化背景；在现有古巴比伦起点转入巴比伦配色，是阅读分段，不表示早期传统消失。'),
  culturalBackdrop('babylonia', ['central-mesopotamia', 'southern-mesopotamia'], -1894, -539,
    'ishtar-gate', ['source-met-babylon'],
    '覆盖现有古巴比伦至新巴比伦的文化阅读区间，不表示始终统一统治；城门是识别符号，不把新巴比伦建筑倒定年到前二千纪。'),
  culturalBackdrop('assyria', ['upper-mesopotamia'], -911, -609,
    'lamassu', ['source-met-assyria'], '新亚述核心文化区域；不把征服地或早期贸易站纳入背景。'),
  culturalBackdrop('indus', ['indus-basin'], -3300, -1300,
    'indus-seal', ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation'],
    '现有印度河早期至区域转型的文化背景，不包括吠陀传统的恒河及西北部范围。'),
  culturalBackdrop('early-china', ['middle-yellow-river', 'north-china-plain'], -1600, -771,
    'ding', ['source-bagley-shang-archaeology', 'source-national-museum-da-yu-ding'],
    '商周青铜礼器文化背景；不自动覆盖四川盆地，也不等同每个时期的政治疆域。'),
  culturalBackdrop('minoan', ['crete'], -2000, -1375,
    'bull-horns', ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete'],
    '克里特宫殿文化范围；海上交流不使其他爱琴海岛屿自动继承背景。'),
  culturalBackdrop('mycenaean', ['greek-mainland'], -1700, -1050,
    'lion-gate', ['source-met-mycenaean-civilization'],
    '迈锡尼大陆文化背景；与克里特分开，狮子门仅作为文化标识，不代表整个范围的建筑建设日期。'),
  culturalBackdrop('hittite', ['central-anatolia'], -1650, -1180,
    'hittite-gate', ['source-unesco-hattusha'],
    '赫梯核心地区文化背景；不覆盖叙利亚扩张地、吕底亚或特洛伊。'),
  culturalBackdrop('nubia', ['nubia'], -2450, -1480,
    'kerma-beaker', ['https://kerma.ch/en/history/', 'https://www.metmuseum.org/art/collection/search/545772'],
    '凯尔马考古项目早、中、经典阶段的文化背景；独立于埃及政权放置，暂不延伸到后续努比亚时代。')
];

/** User-approved longer decorative backgrounds. These are display windows,
 * not newly asserted dates of kingdoms, artifacts, or cultural continuity.
 * The reviewed reference intervals remain attached separately below.
 */
const BACKGROUND_DISPLAY_WINDOWS: Readonly<Record<string, readonly [number, number]>> = {
  babylonia: [-1894, -300],
  assyria: [-2500, -500],
  indus: [-3500, -800],
  'early-china': [-2500, -300],
  minoan: [-3000, -1000],
  mycenaean: [-2500, -800],
  hittite: [-2200, -800],
  nubia: [-3000, -1000]
};

export const CIVILIZATION_BACKDROPS: readonly CivilizationBackdropSpec[] = REVIEWED_CULTURAL_CONTEXTS.map(context => {
  const display = BACKGROUND_DISPLAY_WINDOWS[context.id];
  return display ? {
    ...context,
    referenceTimeSpan: { start: context.start, end: context.end },
    start: display[0], end: display[1],
    rationale: `${context.rationale} 用户要求背景加长：显示范围向两端延展，仅为视觉背景，不改变上述历史参考范围或任何前景对象的年代。`
  } : context;
});

export function backdropWindow(
  backdrop: Pick<CivilizationBackdropSpec, 'start' | 'end'>,
  window: Pick<ResolvedTimeSpan, 'start' | 'end'>
): { readonly left: number; readonly width: number } | null {
  const duration = window.end - window.start;
  const start = Math.max(window.start, backdrop.start);
  const end = Math.min(window.end, backdrop.end);
  if (duration <= 0 || end <= start) return null;
  return { left: (start - window.start) / duration, width: (end - start) / duration };
}

export function egyptBackdropWindow(window: Pick<ResolvedTimeSpan, 'start' | 'end'>): {
  readonly left: number;
  readonly width: number;
} | null {
  return backdropWindow(EGYPT_BACKDROP, window);
}
