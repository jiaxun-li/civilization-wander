import type { SourceIds } from '../../../v6/schema/index.ts';

interface UsageClaim { readonly text: string; readonly sourceIds: SourceIds }
export interface LanguageDescription {
  readonly people: UsageClaim;
  readonly contexts: UsageClaim;
  readonly change?: UsageClaim;
}

/** Reviewed public usage descriptions. Sources stay attached to each claim;
 * the panel collects them into one bibliography. No geographic inference. */
export const LANGUAGE_DESCRIPTIONS: Readonly<Record<string, LanguageDescription>> = {
  'sumerian-language': {
    people: { text: '早期苏美尔城市居民，以及宫殿、神庙和学校中的书吏。', sourceIds: ['source-met-sumerian-writing', 'source-oracc-language-continuity'] },
    contexts: { text: '行政账目、书吏教育、文学抄写和宗教祭仪。', sourceIds: ['source-met-sumerian-writing', 'source-oracc-language-continuity'] },
    change: { text: '前2000年前后逐渐退出日常口语，此后长期用于教育、文学和祭仪。', sourceIds: ['source-oracc-language-continuity'] }
  },
  'akkadian-language': {
    people: { text: '巴比伦和亚述的居民、商人、书吏与王室官员。', sourceIds: ['source-chicago-akkadian-usage', 'source-met-assyrian-letter-usage'] },
    contexts: { text: '日常交流、私人书信、商业契约、王室文告和文学。', sourceIds: ['source-chicago-akkadian-usage', 'source-met-assyrian-letter-usage'] }
  },
  'egyptian-language': {
    people: { text: '尼罗河流域居民，以及宫廷和神庙中的书吏、祭司。', sourceIds: ['source-ucl-egyptian-language', 'source-ucl-egyptian-literacy-usage'] },
    contexts: { text: '日常交谈、行政账目、私人书信、文学和宗教仪式。', sourceIds: ['source-ucl-egyptian-language', 'source-ucl-hieratic-usage'] }
  },
  'greek-language': {
    people: { text: '希腊大陆与爱琴海社群的居民，以及宫殿书吏、城邦官员和诗人。', sourceIds: ['source-heraklion-linear-b-usage', 'source-bm-greek-public-writing-usage', 'source-bm-who-was-homer'] },
    contexts: { text: '日常交流、宫殿账目、城邦法令、公共事务和诗歌。', sourceIds: ['source-heraklion-linear-b-usage', 'source-bm-greek-public-writing-usage', 'source-bm-who-was-homer'] }
  },
  'hittite-language': {
    people: { text: '赫梯王室官员、宫廷书吏和主持祭仪的人员。', sourceIds: ['source-hittite-text-genres-usage'] },
    contexts: { text: '王室编年、法令、条约、政治书信和宗教仪式。', sourceIds: ['source-hittite-text-genres-usage'] }
  },
  'lydian-language': {
    people: { text: '萨第斯及周边居民、祭司和神庙管理者。', sourceIds: ['source-sardis-lydian-language-reviewed'] },
    contexts: { text: '墓志、献礼铭文、财产安排、法令和器物题记。', sourceIds: ['source-sardis-lydian-language-reviewed'] }
  },
  'phoenician-language': {
    people: { text: '腓尼基沿海城市居民及往来地中海各港口的商人。', sourceIds: ['source-sns-phoenician-reviewed', 'source-met-phoenician-alphabet-usage'] },
    contexts: { text: '城市生活、海上商业往来和铭文书写。', sourceIds: ['source-sns-phoenician-reviewed', 'source-met-phoenician-alphabet-usage'] }
  },
  'hebrew-language': {
    people: { text: '古代以色列与犹大的居民和书吏。', sourceIds: ['source-sns-hebrew-reviewed'] },
    contexts: { text: '日常交流、书信、印章、器物题记和纪念铭文。', sourceIds: ['source-sns-hebrew-reviewed'] }
  },
  'aramaic-language': {
    people: { text: '阿拉米语社群居民，以及近东各地的行政官员和书吏。', sourceIds: ['source-iranica-aramaic-general-usage', 'source-chicago-persepolis-usage'] },
    contexts: { text: '日常交流、跨地区通信、行政文书和物资管理。', sourceIds: ['source-iranica-aramaic-general-usage', 'source-chicago-persepolis-usage'] },
    change: { text: '逐渐成为近东广泛使用的通用语，并进入亚述和波斯帝国的行政网络。', sourceIds: ['source-iranica-aramaic-general-usage'] }
  },
  'elamite-language': {
    people: { text: '伊朗西南部的埃兰语社群，以及王室行政机构的书吏。', sourceIds: ['source-iranica-elamite-language-reviewed', 'source-chicago-persepolis-usage'] },
    contexts: { text: '王室铭文、物资收支和人员口粮记录。', sourceIds: ['source-iranica-elamite-language-reviewed', 'source-chicago-persepolis-usage'] },
    change: { text: '阿契美尼德时期继续用于波斯波利斯的行政档案。', sourceIds: ['source-chicago-persepolis-usage'] }
  },
  'old-persian-language': {
    people: { text: '波斯语社群、阿契美尼德王室及负责王室铭文的书吏。', sourceIds: ['source-iranica-old-persian-epigraphy-reviewed'] },
    contexts: { text: '王室宣告、征服记述、宫殿营建和祭神铭文。', sourceIds: ['source-iranica-old-persian-epigraphy-reviewed'] }
  },
  'old-chinese-language': {
    people: { text: '早期汉语社群，以及商周王室、贵族、卜人和史官。', sourceIds: ['source-schuessler-old-chinese-reviewed', 'source-penn-oracle-bone-reviewed', 'source-met-zhou-inscriptions-reviewed'] },
    contexts: { text: '日常交谈、占卜祭祀、王命记录、册命与纪念铭文。', sourceIds: ['source-schuessler-old-chinese-reviewed', 'source-penn-oracle-bone-reviewed', 'source-met-zhou-inscriptions-reviewed', 'source-national-museum-li-gui'] }
  },
  'vedic-sanskrit-language': {
    people: { text: '创作赞歌的诗人家族、主持祭祀的祭司及其弟子。', sourceIds: ['source-witzel-vedic-language-reviewed'] },
    contexts: { text: '祭祀赞歌、仪式诵读和师徒口传。', sourceIds: ['source-witzel-vedic-language-reviewed'] }
  }
};

export function languageUsageClaims(description: LanguageDescription): readonly UsageClaim[] {
  return [description.people, description.contexts, ...(description.change ? [description.change] : [])];
}
