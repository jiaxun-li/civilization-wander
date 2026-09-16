import type { SourceIds } from '../../../v6/schema/index.ts';

interface WritingClaim { readonly text: string; readonly sourceIds: SourceIds }
export interface WritingDescription {
  readonly languages: WritingClaim;
  readonly materials: WritingClaim;
  readonly uses: WritingClaim;
}

/** Public summaries of reviewed evidence, with claim-level provenance. */
export const WRITING_DESCRIPTIONS: Readonly<Record<string, WritingDescription>> = {
  'cuneiform': {
    languages: { text: '苏美尔语、阿卡德语、赫梯语等。', sourceIds: ['source-british-museum-cuneiform'] },
    materials: { text: '以泥板为主，用削平的芦苇笔压出楔形笔画。', sourceIds: ['source-british-museum-cuneiform'] },
    uses: { text: '账目、书信、书吏教学、文学与宗教文本。', sourceIds: ['source-british-museum-cuneiform', 'source-met-grammatical-text-object', 'source-met-amarna-letters'] }
  },
  'egyptian-hieroglyphs': {
    languages: { text: '埃及语。', sourceIds: ['source-ucl-hieroglyphic-system'] },
    materials: { text: '神庙、墓葬和纪念碑的石质表面。', sourceIds: ['source-ucl-hieratic'] },
    uses: { text: '王室纪念铭文、宗教仪式与丧葬文本。', sourceIds: ['source-ucl-hieratic'] }
  },
  'egyptian-hieratic': {
    languages: { text: '埃及语。', sourceIds: ['source-ucl-hieratic'] },
    materials: { text: '纸草、陶片和石片，以笔蘸墨书写。', sourceIds: ['source-ucl-hieratic'] },
    uses: { text: '账目、书信、文学与祭仪文本；后期以宗教书写为主。', sourceIds: ['source-ucl-hieratic'] }
  },
  'egyptian-demotic': {
    languages: { text: '埃及语。', sourceIds: ['source-ucl-demotic'] },
    materials: { text: '纸草和陶片。', sourceIds: ['source-ucl-demotic', 'source-ucl-papyrus-ostraca-reviewed'] },
    uses: { text: '日常书信、账目和文学。', sourceIds: ['source-ucl-hieratic'] }
  },
  'indus-sign-system': {
    languages: { text: '尚未确定。', sourceIds: ['source-indus-undeciphered-reviewed'] },
    materials: { text: '石质印章、陶器和小型刻铭板。', sourceIds: ['source-kenoyer-script-materials-reviewed'] },
    uses: { text: '印章钤印与器物标记，铭文含义尚未释读。', sourceIds: ['source-kenoyer-script-materials-reviewed', 'source-indus-undeciphered-reviewed'] }
  },
  'chinese-writing-system': {
    languages: { text: '上古汉语。', sourceIds: ['source-schuessler-old-chinese-reviewed'] },
    materials: { text: '龟甲、兽骨和青铜器。', sourceIds: ['source-unesco-oracle-bones', 'source-national-museum-li-gui'] },
    uses: { text: '占卜祭祀、王事记录和赏赐纪念。', sourceIds: ['source-unesco-oracle-bones', 'source-national-museum-li-gui'] }
  },
  'greek-alphabet': {
    languages: { text: '希腊语。', sourceIds: ['source-bm-greek-alphabet-reviewed'] },
    materials: { text: '石碑和建筑石材。', sourceIds: ['source-bm-greek-public-writing-usage'] },
    uses: { text: '法律、条约、公共账目、献礼和墓志。', sourceIds: ['source-bm-greek-public-writing-usage'] }
  },
  'linear-a': {
    languages: { text: '米诺斯语言，尚未释读。', sourceIds: ['source-cambridge-linear-a-reviewed'] },
    materials: { text: '泥板、封泥、石器和陶器。', sourceIds: ['source-cambridge-linear-a-reviewed'] },
    uses: { text: '宫殿经济管理与祭祀器物题记。', sourceIds: ['source-cambridge-linear-a-reviewed'] }
  },
  'linear-b': {
    languages: { text: '迈锡尼时代的希腊语。', sourceIds: ['source-heraklion-linear-b-usage'] },
    materials: { text: '以泥板为主，划刻成行。', sourceIds: ['source-heraklion-linear-b-usage'] },
    uses: { text: '宫殿行政与经济记录，包括人员名册和物资账目。', sourceIds: ['source-heraklion-linear-b-usage'] }
  },
  'lydian-alphabet': {
    languages: { text: '吕底亚语。', sourceIds: ['source-sardis-lydian-language-reviewed'] },
    materials: { text: '石碑、印章、陶器和钱币。', sourceIds: ['source-sardis-lydian-language-reviewed'] },
    uses: { text: '墓志、法令、献礼与器物归属题记。', sourceIds: ['source-sardis-lydian-language-reviewed'] }
  },
  'phoenician-alphabet': {
    languages: { text: '腓尼基语及布匿语。', sourceIds: ['source-sns-phoenician-reviewed'] },
    materials: { text: '石刻和金属铭牌。', sourceIds: ['source-sns-phoenician-examples-reviewed'] },
    uses: { text: '王室献礼、祭神与营建纪念铭文。', sourceIds: ['source-sns-phoenician-examples-reviewed'] }
  },
  'paleo-hebrew-alphabet': {
    languages: { text: '希伯来语。', sourceIds: ['source-sns-hebrew-reviewed'] },
    materials: { text: '陶片、石刻和印章。', sourceIds: ['source-sns-hebrew-reviewed'] },
    uses: { text: '书信、器物题记和纪念铭文。', sourceIds: ['source-sns-hebrew-reviewed'] }
  },
  'aramaic-alphabet': {
    languages: { text: '阿拉米语。', sourceIds: ['source-iranica-aramaic-general-usage'] },
    materials: { text: '皮革、纸草和石刻。', sourceIds: ['source-iranica-aramaic-general-usage', 'source-oracc-aramaic-hebrew'] },
    uses: { text: '行政通信、私人书信和契约。', sourceIds: ['source-iranica-aramaic-general-usage'] }
  },
  'old-persian-cuneiform': {
    languages: { text: '古波斯语。', sourceIds: ['source-iranica-old-persian-epigraphy-reviewed'] },
    materials: { text: '山崖、宫殿石材和器物。', sourceIds: ['source-iranica-old-persian-epigraphy-reviewed'] },
    uses: { text: '王室宣告、征服记述和营建铭文。', sourceIds: ['source-iranica-old-persian-epigraphy-reviewed'] }
  }
};

export function writingClaims(description: WritingDescription): readonly WritingClaim[] {
  return [description.languages, description.materials, description.uses];
}
