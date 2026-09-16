import type { KnowledgeSubject } from '../../../v6/schema/index.ts';

export interface CivilizationTheme {
  readonly id: string;
  readonly label: string;
  readonly foreground: string;
  readonly background: string;
  readonly motif?: 'ziggurat' | 'lamassu' | 'ishtar-gate' | 'indus-seal' | 'ding' | 'bull-horns' | 'lion-gate' | 'hittite-gate' | 'kerma-beaker';
  readonly polityColors: Readonly<Record<string, string>>;
  readonly provenance: { readonly title: string; readonly url: string; readonly rationale: string };
}

/** Local presentation choices inspired by documented objects, never reconstructed flags.
 * Exact shades and dynastic variants are editorial, not sampled historical colors.
 * A theme neither asserts a common state nor automatically assigns nearby subjects.
 */
export const CIVILIZATION_THEMES = Object.freeze({
  mesopotamia: {
    id: 'mesopotamia', label: '两河文明', foreground: '#8b503b', background: '#be8969', motif: 'ziggurat',
    polityColors: { 'akkadian-empire': '#8b503b', 'ur-iii-kingdom': '#704a3b' },
    provenance: { title: 'Uruk: The First City', url: 'https://www.metmuseum.org/essays/uruk-the-first-city', rationale: '泥砖建筑与泥板提供陶土色系灵感；并非所有两河社会的专属色，明暗为设计选择。' }
  },
  assyria: {
    id: 'assyria', label: '亚述', foreground: '#565c68', background: '#a2a5ae', motif: 'lamassu',
    polityColors: { 'assur-community': '#656772', 'neo-assyrian-empire': '#434c5a' },
    provenance: { title: 'Relief panel, Assyrian', url: 'https://www.metmuseum.org/art/collection/search/322613', rationale: '亚述石膏浮雕启发冷石灰色；深浅蓝灰为现代识别设计，不声称原本彩绘、早期亚述或旗帜使用此色。' }
  },
  babylonia: {
    id: 'babylonia', label: '巴比伦', foreground: '#315b82', background: '#759aba', motif: 'ishtar-gate',
    polityColors: { 'old-babylonian-kingdom': '#43688b', 'neo-babylonian-empire': '#294e78' },
    provenance: { title: 'Guide to the Collections: Ancient Near Eastern Art', url: 'https://resources.metmuseum.org/resources/metpublications/pdf/Guide_to_the_Collections_Ancient_Near_Eastern_Art.pdf', rationale: '新巴比伦釉砖的蓝色提供视觉灵感；将古巴比伦纳入同色系仅为文明识别，并非把后期釉砖艺术前推。' }
  },
  indus: {
    id: 'indus', label: '印度河文明', foreground: '#646758', background: '#b4b59c', motif: 'indus-seal',
    polityColors: { 'indus-civilization': '#646758' },
    provenance: { title: 'Stamp seal: buffalo with incense burner (?)', url: 'https://www.metmuseum.org/art/collection/search/324063', rationale: '滑石印章提供低饱和石色灵感；偏绿灰为识别用设计，不代表印章的精确实物色或未释读的文化意义。' }
  },
  'early-china': {
    id: 'early-china', label: '早期中国', foreground: '#35665b', background: '#76a28c', motif: 'ding',
    polityColors: { 'shang-civilization': '#35665b', 'western-zhou': '#455f43' },
    provenance: { title: 'Shang and Zhou Dynasties: The Bronze Age of China', url: 'https://www.metmuseum.org/fr/essays/shang-and-zhou-dynasties-the-bronze-age-of-china', rationale: '青铜器与玉器启发青绿配色；铜绿是器物今天常见的视觉印象，并非新铸青铜原色、商周旗色或所有早期社会的统一政治身份。' }
  },
  minoan: {
    id: 'minoan', label: '克里特', foreground: '#944e43', background: '#c57f70', motif: 'bull-horns',
    polityColors: { 'minoan-palatial-civilization': '#944e43' },
    provenance: { title: 'The Bull-Leaping Fresco', url: 'https://heraklionmuseum.gr/en/exhibit/the-bull-leaping-fresco/', rationale: '克诺索斯壁画中的红色人物与公牛题材提供灵感；不是克里特统一国旗或对壁画原色的复原。' }
  },
  mycenaean: {
    id: 'mycenaean', label: '迈锡尼', foreground: '#82602e', background: '#bd9653', motif: 'lion-gate',
    polityColors: { 'mycenaean-civilization': '#82602e' },
    provenance: { title: 'Collection of Mycenaean Antiquities', url: 'https://www.namuseum.gr/en/permanent_exhibition/mykinaikes-archaiotites/', rationale: '迈锡尼墓葬金器启发偏褐的金色，与埃及赭金保持同材质而不同视觉身份；不是国家标志。' }
  },
  hittite: {
    id: 'hittite', label: '赫梯', foreground: '#6c6264', background: '#aaa0a1', motif: 'hittite-gate',
    polityColors: { 'hittite-empire': '#6c6264' },
    provenance: { title: 'Hattusha: the Hittite Capital', url: 'https://whc.unesco.org/en/list/377', rationale: '哈图沙石造城门与岩刻启发暖石灰色；微紫灰调是区分亚述冷灰的界面选择，并非历史旗色。' }
  },
  nubia: {
    id: 'nubia', label: '努比亚·凯尔马', foreground: '#8b493f', background: '#c37862', motif: 'kerma-beaker', polityColors: {},
    provenance: { title: 'Classic Kerma Beaker', url: 'https://www.metmuseum.org/art/collection/search/545772', rationale: '凯尔马黑顶红陶启发陶红色与杯形；仅代表凯尔马相关背景，不泛指所有努比亚时代。' }
  },
  levant: {
    id: 'levant', label: '黎凡特文化', foreground: '#765775', background: '#ad94ac',
    polityColors: { 'ugarit-kingdom': '#695b79', 'kingdom-of-israel': '#765775', 'kingdom-of-judah': '#615064' },
    provenance: { title: 'The Phoenicians (1500–300 B.C.)', url: 'https://www.metmuseum.org/fr/essays/the-phoenicians-1500-300-b-c', rationale: '腓尼基紫染料启发其传统对象的灰紫色；乌加里特、以色列、犹大以近邻灰紫变体便于视觉分组，这是纯编辑选择，不声称它们皆为腓尼基、共享旗帜或使用同种染料。此组不生成黎凡特统一文明背景。' }
  },
  lydia: {
    id: 'lydia', label: '吕底亚', foreground: '#706337', background: '#ada16c',
    polityColors: { 'lydian-kingdom': '#706337' },
    provenance: { title: 'Electrum coin from Lydia', url: 'https://www.britishmuseum.org/collection/object/C_1866-1201-3671', rationale: '吕底亚琥珀金货币启发偏浅黄、低饱和金属色；前景为可读性加深，不是旗帜颜色或精确材质取样。' }
  },
  greek: {
    id: 'greek', label: '早期希腊', foreground: '#725c47', background: '#ad9276',
    polityColors: { 'greek-dark-age-communities': '#725c47' },
    provenance: { title: 'Terracotta oinochoe (jug)', url: 'https://www.metmuseum.org/art/collection/search/247178', rationale: '几何时期陶器的深色装饰与浅陶底启发棕色；希腊神话与荷马作品采用文化身份色，并不归属迈锡尼政权。' }
  }
} satisfies Record<string, CivilizationTheme>);

export type CivilizationThemeId = keyof typeof CIVILIZATION_THEMES;

interface CivilizationSubjectAssignment {
  readonly subject: KnowledgeSubject;
  readonly themeId: CivilizationThemeId;
  readonly rationale: string;
  readonly sourceIds: readonly string[];
}

/** Explicit cultural identity reviews. Shared writing, iron, diplomatic corpora and wars remain neutral. */
export const CIVILIZATION_SUBJECT_ASSIGNMENTS: readonly CivilizationSubjectAssignment[] = [
  { subject: { kind: 'entity', id: 'uruk' }, themeId: 'mesopotamia', rationale: '两河城市自身的文化身份。', sourceIds: ['source-met-uruk-first-city'] },
  { subject: { kind: 'entity', id: 'epic-of-gilgamesh' }, themeId: 'mesopotamia', rationale: '作品属于两河文学传统，不限于某一后期政权。', sourceIds: ['source-george-babylonian-gilgamesh-epic'] },
  { subject: { kind: 'entity', id: 'hammurabi-code' }, themeId: 'babylonia', rationale: '古巴比伦王室法典的制作语境。', sourceIds: ['source-louvre-hammurabi-code'] },
  { subject: { kind: 'entity', id: 'babylon-city' }, themeId: 'babylonia', rationale: '巴比伦城市身份。', sourceIds: ['source-met-babylon-lion'] },
  { subject: { kind: 'entity', id: 'mohenjo-daro' }, themeId: 'indus', rationale: '印度河文明城市身份；不将后世吠陀传统归入印度河文明。', sourceIds: ['source-unesco-mohenjo-daro'] },
  { subject: { kind: 'entity', id: 'erlitou-site' }, themeId: 'early-china', rationale: '早期中国考古文化的视觉分组，不等同于商或夏的确定王朝归属。', sourceIds: ['source-erlitou-cass-report'] },
  { subject: { kind: 'entity', id: 'shang-oracle-bone-inscriptions' }, themeId: 'early-china', rationale: '商代文字文献的明确文化身份。', sourceIds: ['source-unesco-oracle-bones'] },
  { subject: { kind: 'entity', id: 'shang-bronze-ritual-vessels' }, themeId: 'early-china', rationale: '商代礼器的明确文化身份。', sourceIds: ['source-met-shang-zhou-bronze'] },
  { subject: { kind: 'entity', id: 'sanxingdui-site' }, themeId: 'early-china', rationale: '早期中国青铜文化的视觉分组，保留三星堆独立身份，不推定商王朝统治。', sourceIds: ['source-sxd-antiquity-2022'] },
  { subject: { kind: 'entity', id: 'greek-divine-tradition' }, themeId: 'greek', rationale: '跨时期希腊宗教传统，不归入单一迈锡尼政权。', sourceIds: ['source-cambridge-companion-greek-mythology'] },
  { subject: { kind: 'entity', id: 'iliad-text' }, themeId: 'greek', rationale: '希腊语作品的撰写身份，区别于其叙述地点和战争参与者。', sourceIds: ['source-cambridge-guide-homer'] },
  { subject: { kind: 'entity', id: 'odyssey-text' }, themeId: 'greek', rationale: '希腊语作品的撰写身份。', sourceIds: ['source-cambridge-guide-homer'] },
  { subject: { kind: 'entity', id: 'ancient-israelite-tradition' }, themeId: 'levant', rationale: '以色列传统与以色列、犹大政权采用同组灰紫色；不是腓尼基文化归属。', sourceIds: ['source-sefaria-kings'] },
  { subject: { kind: 'entity', id: 'tower-of-babel-tradition' }, themeId: 'levant', rationale: '希伯来文本的文化身份，不因叙述巴比伦而视为巴比伦王室作品。', sourceIds: ['source-sefaria-genesis-11'] },
  { subject: { kind: 'entity', id: 'phoenician-tradition' }, themeId: 'levant', rationale: '腓尼基交换传统本身的身份色，不自动归属附近政权。', sourceIds: ['source-met-phoenicians'] }
];

const assignments = new Map(CIVILIZATION_SUBJECT_ASSIGNMENTS.map(item => [`${item.subject.kind}:${item.subject.id}`, item.themeId]));

export function civilizationSubjectColor(subject: KnowledgeSubject): string | undefined {
  const themeId = assignments.get(`${subject.kind}:${subject.id}`);
  return themeId ? CIVILIZATION_THEMES[themeId].foreground : undefined;
}
