import type { ClaimBlockId, EventId, SourceIds } from '../../../v6/schema/index.ts';

export interface ReviewedEventDescription {
  readonly v5ClaimBlockId: ClaimBlockId;
  readonly sourceIds: SourceIds;
  readonly text: string;
}

/**
 * Reviewed V6 public event summaries. Original claim IDs retain provenance;
 * editorial revisions may change wording and source lists independently of V5.
 * Internal review is not public prose. This module has no V5 runtime imports.
 */
export const REVIEWED_EVENT_DESCRIPTIONS: Readonly<Record<EventId, ReviewedEventDescription>> = {
  "event-hammurabi-conquests": {
    "v5ClaimBlockId": "event-hammurabi-conquests-evidence",
    "sourceIds": [
      "source-cdli-hammurabi-year-names",
      "source-podany-hammurabi-babylon"
    ],
    "text": "汉谟拉比统治晚年连续击败拉尔萨、埃什努那和幼发拉底河上游的对手，使巴比伦短暂成为广大王国的中心。"
  },
  "event-ahmose-captures-avaris": {
    "v5ClaimBlockId": "event-ahmose-captures-avaris-evidence",
    "sourceIds": [
      "source-ucl-ahmose"
    ],
    "text": "底比斯王室向北推进，雅赫摩斯攻下阿瓦里斯并重新统一埃及。"
  },
  "event-battle-of-kadesh": {
    "v5ClaimBlockId": "event-battle-of-kadesh-evidence",
    "sourceIds": [
      "source-bm-kadesh-sallier",
      "source-hayes-scepter-ii"
    ],
    "text": "拉美西斯二世的军队在卡迭石附近遭遇赫梯战车突袭；埃及纪念文字突出国王的个人勇武，但埃及没有长期夺取卡迭石。"
  },
  "event-egypt-hatti-treaty": {
    "v5ClaimBlockId": "event-egypt-hatti-treaty-evidence",
    "sourceIds": [
      "source-un-egypt-hatti-treaty"
    ],
    "text": "卡迭石战役多年以后，埃及与赫梯签订条约，约定停止敌对并在受到威胁时互相援助。"
  },
  "event-unas-pyramid-text-inscription": {
    "v5ClaimBlockId": "event-unas-pyramid-text-inscription-evidence",
    "sourceIds": [
      "source-ucl-religious-texts",
      "source-wikimedia-unas-pyramid-texts"
    ],
    "text": "乌尼斯金字塔墓室的石墙刻上成列咒语，用来保护死者、供给力量并帮助国王通往天空与众神。"
  },
  "event-zhou-conquest-of-shang": {
    "v5ClaimBlockId": "event-zhou-conquest-of-shang-evidence",
    "sourceIds": [
      "source-national-museum-li-gui",
      "source-anyang-fall"
    ],
    "text": "早期西周利簋铭文记录周王征服商，安阳不同区域的考古材料显示城市活动并非在同一时刻完全停止。"
  },
  "event-sanxingdui-ritual-object-deposition": {
    "v5ClaimBlockId": "event-sanxingdui-deposition-evidence",
    "sourceIds": [
      "source-sxd-antiquity-2022",
      "source-sxd-sacrificial-area-2023"
    ],
    "text": "三星堆相邻的八座器物坑中发现了青铜、金、玉、象牙等材料。部分坑内的器物以明显层次堆放，并保留了破碎和灰烬等痕迹。"
  },
  "event-hittite-sack-babylon": {
    "v5ClaimBlockId": "event-hittite-sack-babylon-evidence",
    "sourceIds": [
      "source-bryce-hittite-kingdom",
      "source-met-isin-larsa-old-babylonian"
    ],
    "text": "早期赫梯军队远征并突袭巴比伦，古巴比伦第一王朝随后结束；赫梯没有在巴比伦建立长期统治。"
  },
  "event-hittite-ugarit-treaty": {
    "v5ClaimBlockId": "event-hittite-ugarit-treaty-evidence",
    "sourceIds": [
      "source-beckman-hittite-diplomatic-texts",
      "source-met-ugarit"
    ],
    "text": "赫梯与乌加里特的外交文本确认地方王位和领土，同时规定忠诚、贡赋与军事义务。"
  },
  "event-ramesses-iii-northern-invasions": {
    "v5ClaimBlockId": "event-ramesses-iii-northern-invasions-evidence",
    "sourceIds": [
      "source-isac-medinet-habu-i",
      "source-edgerton-wilson-ramesses-iii",
      "source-grandet-ramesses-iii"
    ],
    "text": "麦迪奈特哈布的浮雕与铭文把来自北方的若干群体分别列名，并表现埃及军队在陆地和尼罗河口作战。"
  },
  "event-hittite-wilusa-treaty": {
    "v5ClaimBlockId": "event-hittite-wilusa-treaty-evidence",
    "sourceIds": [
      "source-cambridge-hittite-troy",
      "source-british-museum-alaksandu-wilusa"
    ],
    "text": "赫梯大王穆瓦塔利二世与维鲁萨国王阿拉克桑杜订立条约，要求地方国王忠诚并在战争时提供帮助。"
  },
  "event-lachish-captured": {
    "v5ClaimBlockId": "event-lachish-evidence",
    "sourceIds": [
      "source-bm-lachish"
    ],
    "text": "亚述国王辛那赫里布的军队在公元前701年攻陷拉吉，宫殿浮雕表现攻城、处决、俘虏与贡物。"
  }
};
