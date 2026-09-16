import type { KnowledgeSubject } from '../../../v6/schema/index.ts';

/** Presentation metadata only: these shades express cultural association, not ownership. */
export const EGYPT_THEME = Object.freeze({
  id: 'ancient-egypt',
  label: '古埃及',
  foreground: '#88621f',
  background: '#d5ab48',
  polityColors: Object.freeze({
    'egypt-old-kingdom': '#88621f',
    'egypt-middle-kingdom': '#795719',
    'egypt-new-kingdom': '#624715'
  }),
  provenance: Object.freeze({
    title: 'Colours of Ancient Egypt – Yellow',
    author: 'Anna Pokorska',
    publisher: 'UCL Researchers in Museums',
    url: 'https://blogs.ucl.ac.uk/researchers-in-museums/2019/02/20/colours-of-ancient-egypt-yellow/',
    basis: 'pigment-inspired editorial palette',
    rationale: '黄赭石与黄色模拟黄金的古埃及艺术实践提供色系依据；具体色值与王国明暗由界面设计选定，不是历史旗帜、实物取样或王朝专属色。'
  })
});

interface EgyptianSubjectAssignment {
  readonly subject: KnowledgeSubject;
  readonly rationale: string;
  readonly sourceIds: readonly string[];
}

/** Explicit reviews; neither Region, module ownership nor a participant automatically assigns a color. */
export const EGYPT_SUBJECT_ASSIGNMENTS: readonly EgyptianSubjectAssignment[] = [
  { subject: { kind: 'entity', id: 'egypt-old-kingdom' }, rationale: '古埃及古王国政治实体。', sourceIds: ['source-met-old-kingdom'] },
  { subject: { kind: 'entity', id: 'egypt-middle-kingdom' }, rationale: '古埃及中王国政治实体。', sourceIds: ['source-met-middle-kingdom'] },
  { subject: { kind: 'entity', id: 'egypt-new-kingdom' }, rationale: '古埃及新王国政治实体。', sourceIds: ['source-met-new-kingdom'] },
  { subject: { kind: 'entity', id: 'egypt-pyramids' }, rationale: '古埃及王室陵墓建筑传统。', sourceIds: ['source-ucl-pyramid-shape'] },
  { subject: { kind: 'entity', id: 'egyptian-religion' }, rationale: '古埃及宗教传统身份，不按出现地域推定归属。', sourceIds: ['source-ucl-religious-texts'] },
  { subject: { kind: 'entity', id: 'egyptian-art' }, rationale: '古埃及艺术传统身份，在努比亚等地出现时仍保留此身份色。', sourceIds: ['source-met-ancient-egypt-art'] },
  { subject: { kind: 'entity', id: 'egyptian-hieroglyphs' }, rationale: '用于记录古埃及语的书写系统。', sourceIds: ['source-ucl-hieroglyphic-system'] },
  { subject: { kind: 'entity', id: 'sinuhe-work' }, rationale: '古埃及文学作品；叙事中的异乡不改变作品的文化关联。', sourceIds: ['source-ucl-sinuhe'] },
  { subject: { kind: 'entity', id: 'medinet-habu-war-records' }, rationale: '埃及王室制作的浮雕与铭文，色彩关联制作语境而非全部交战群体。', sourceIds: ['source-isac-medinet-habu-i'] },
  { subject: { kind: 'event', id: 'event-ahmose-captures-avaris' }, rationale: '按雅赫摩斯王权形成的事件主题配色，不表示双方均属埃及文化。', sourceIds: ['source-ucl-ahmose'] },
  { subject: { kind: 'event', id: 'event-unas-pyramid-text-inscription' }, rationale: '古埃及王室丧葬文献的铭刻事件。', sourceIds: ['source-ucl-religious-texts'] },
  { subject: { kind: 'event', id: 'event-ramesses-iii-northern-invasions' }, rationale: '按埃及王室防御行动的事件主题配色，不赋予来敌埃及身份。', sourceIds: ['source-isac-medinet-habu-i'] }
];

const egyptianSubjectKeys = new Set(EGYPT_SUBJECT_ASSIGNMENTS.map(({ subject }) => `${subject.kind}:${subject.id}`));

export function egyptSubjectColor(subject: KnowledgeSubject): string | undefined {
  if (!egyptianSubjectKeys.has(`${subject.kind}:${subject.id}`)) return undefined;
  return (subject.kind === 'entity'
    ? (EGYPT_THEME.polityColors as Readonly<Record<string, string>>)[subject.id]
    : undefined) ?? EGYPT_THEME.foreground;
}
