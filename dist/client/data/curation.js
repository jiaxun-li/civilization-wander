/**
 * 旧专题与未迁移实体的兼容策展配置。
 *
 * 第二版 Exploration 位于 entity-network.js。这里保留尚未迁移的入口文案、
 * 关系排序和提问，避免它们继续硬编码在 app.js。它不保存实体正文、地图几何
 * 或关系说明。
 */
window.ATLAS_CURATION = {
  storyChapterEntityIds: {
    origin: 'buddhism',
    maurya: 'ashoka',
    'gandhara-kushan': 'gandharan-art',
    'central-asian-oases': 'silk-roads',
    'hexi-corridor': 'hexi',
    'china-heartland': 'kumarajiva',
    'korea-japan': 'korea-three-kingdoms'
  },
  legacyEntityCopy: {
    'silk-roads': {
      question: '佛教如何跨越数千公里？',
      explanation: '所谓丝绸之路并非单线大道，而是由城市、绿洲、山口和政权接续起来的网络。商旅提供移动条件，僧侣、译者和赞助者则把商业联系转化为宗教联系；战争与水源变化也会让路线转向。'
    },
    hexi: {
      question: '为什么宗教经常沿绿洲和商路传播？',
      explanation: '河西走廊把高山与荒漠之间有限的水源、城镇和补给点串成一条可接续的通道。同一组节点能运输军队、商品、经卷和工匠，但传播密度仍取决于政权、寺院赞助与地方社会的主动选择。'
    },
    dunhuang: {
      question: '为什么敦煌会成为观念与图像的转换节点？',
      explanation: '敦煌位于塔里木绿洲网络与河西走廊的接口。人员在这里补给、停留、翻译和赞助，使远距离交流不只“经过”，还能够沉淀为文本、寺院与艺术；它的重要性也会随路线和政治条件变化。'
    },
    'mogao-caves': {
      question: '为什么敦煌会产生复杂的石窟艺术？',
      explanation: '莫高窟的长期营建依赖绿洲资源、交通往来、地方政权和信众赞助。来自印度与中亚的佛教图像在这里被重新组合，并与中国材料和审美相遇；复杂性来自持续协作，而不是地理位置自动产生。'
    },
    'gandharan-art': {
      question: '抽象教义如何获得可见形象？',
      explanation: '犍陀罗佛教艺术在南亚、中亚与伊朗世界的接触带中形成。可辨识、可复制的佛像与叙事图像帮助宗教跨越语言差异，但这种视觉语言是多种传统与地方工坊共同创造的，并非单一来源的移植。'
    },
    kushan: {
      question: '贵霜帝国为何能成为佛教艺术与交通的放大器？',
      explanation: '贵霜帝国连接中亚、阿富汗和北印度的城市与贸易网络，赞助环境让佛教思想、僧院和艺术工坊繁荣。帝国提供了联系尺度，却不能独自解释各种地方风格；工匠、信众和区域传统同样关键。'
    }
  },
  legacyRelationPriority: {
    'silk-roads': ['rel-silk-hexi', 'rel-silk-kushan', 'rel-silk-buddhism', 'route-gandhara-tarim'],
    hexi: ['rel-hexi-dunhuang', 'rel-silk-hexi', 'rel-hexi-han', 'rel-hexi-mogao'],
    dunhuang: ['rel-dunhuang-mogao', 'rel-hexi-dunhuang', 'rel-silk-hexi'],
    'mogao-caves': ['rel-mogao-gandhara', 'rel-dunhuang-mogao', 'rel-hexi-mogao'],
    'gandharan-art': ['rel-kushan-enabled', 'rel-gandhara-art', 'rel-mogao-gandhara'],
    kushan: ['rel-kushan-enabled', 'rel-silk-kushan', 'route-gandhara-tarim'],
    kumarajiva: ['rel-kumarajiva-translation'],
    'korea-three-kingdoms': ['rel-korea-japan']
  },
  legacyRelationQuestions: {
    'silk-roads:hexi': '这张网络进入中国内地前必须经过哪里？',
    'silk-roads:kushan': '哪个帝国连接了中亚与北印度？',
    'silk-roads:buddhism': '贸易网络为什么也会运输观念？',
    'silk-roads:gandhara': '山口与接触带如何接入丝路网络？',
    'silk-roads:maurya': '在“丝绸之路”成名之前，哪些帝国已连接北印度与西北通道？',
    'hexi:dunhuang': '走廊西端为什么会形成敦煌这个节点？',
    'hexi:silk-roads': '河西如何成为丝路网络的一段？',
    'hexi:han-empire': '为什么同一条走廊也运输军队？',
    'hexi:mogao-caves': '走廊中的交流如何留下物质证据？',
    'dunhuang:mogao-caves': '敦煌为什么会产生复杂的石窟艺术？',
    'dunhuang:hexi': '敦煌依靠怎样的走廊与内地连接？',
    'dunhuang:silk-roads': '敦煌如何接入多段丝路网络？',
    'mogao-caves:gandharan-art': '敦煌图像从哪些更早的视觉传统中获得资源？',
    'mogao-caves:dunhuang': '石窟为什么必须依托敦煌绿洲？',
    'mogao-caves:hexi': '莫高窟如何成为走廊交流的证据？',
    'gandharan-art:kushan': '什么样的帝国环境支持了这种艺术？',
    'gandharan-art:buddhism': '这种艺术如何让佛教教义变得可见？',
    'gandharan-art:mogao-caves': '这种视觉语言到敦煌后发生了什么？',
    'kushan:gandharan-art': '贵霜时代为何支持佛教图像繁荣？',
    'kushan:silk-roads': '贵霜如何把多区域接入贸易网络？',
    'kushan:gandhara': '贵霜的艺术中心位于怎样的接触带？'
  },
  regionQuestionPrompts: {
    hexi: [
      { question: '为什么宗教经常沿绿洲和商路传播？', targetId: 'buddhism', relationId: 'rel-hexi-buddhism' },
      { question: '为什么敦煌会产生复杂的石窟艺术？', targetId: 'mogao-caves', relationId: 'rel-hexi-mogao' },
      { question: '为什么同一条走廊既运输军队，也运输观念？', targetId: 'han-empire', relationId: 'rel-hexi-han' }
    ]
  },
  regionExplorationIds: {
    hexi: ['buddhism-eastward']
  },
  getLegacyChapterEntityId(chapter) {
    return this.storyChapterEntityIds[chapter?.id] || chapter?.entityIds?.[0] || null;
  },
  getLegacyEntityCopy(entityId, fallback = {}) {
    return this.legacyEntityCopy[entityId] || fallback;
  },
  prioritizeLegacyRelations(entityId, relations = []) {
    const prioritized = (this.legacyRelationPriority[entityId] || [])
      .map(id => relations.find(relation => relation.id === id))
      .filter(Boolean);
    return [...new Map([...prioritized, ...relations].map(relation => [relation.id, relation])).values()];
  },
  getLegacyRelationQuestion(sourceId, targetId) {
    return this.legacyRelationQuestions[`${sourceId}:${targetId}`] || '';
  },
  getRegionQuestionPrompts(regionId) {
    return (this.regionQuestionPrompts[regionId] || []).map(prompt => ({ ...prompt }));
  },
  getRegionExplorationIds(regionId) {
    return [...(this.regionExplorationIds[regionId] || [])];
  }
};
