(function exposeAtlasV3(root, factory) {
  const data = factory();
  if (root) root.ATLAS_V3_DATA = data;
  if (typeof module === 'object' && module.exports) module.exports = data;
}(typeof window !== 'undefined' ? window : globalThis, function createAtlasV3Data() {
  'use strict';

  const sources = [
    {
      id: 'source-gombrich-buddhism',
      title: 'Richard Gombrich, Theravada Buddhism: A Social History',
      author: 'Richard Gombrich',
      year: 2006,
      publisher: 'Routledge',
      url: 'https://www.routledge.com/Theravada-Buddhism-A-Social-History-from-Ancient-Benares-to-Modern/Gombrich/p/book/9780415365093'
    },
    {
      id: 'source-strong-ashoka',
      title: 'John S. Strong, The Legend of King Aśoka',
      author: 'John S. Strong',
      year: 1983,
      publisher: 'Princeton University Press',
      url: 'https://press.princeton.edu/books/paperback/9780691605074/the-legend-of-king-asoka'
    },
    {
      id: 'source-thapar-ashoka',
      title: 'Romila Thapar, Aśoka and the Decline of the Mauryas',
      author: 'Romila Thapar',
      year: 1997,
      publisher: 'Oxford University Press',
      url: 'https://global.oup.com/academic/product/asoka-and-the-decline-of-the-mauryas-9780195644456'
    },
    {
      id: 'source-singh-ancient-india',
      title: 'Upinder Singh, A History of Ancient and Early Medieval India',
      author: 'Upinder Singh',
      year: 2008,
      publisher: 'Pearson',
      url: 'https://www.pearsoned.co.in/web/books/9788131716779_A-History-of-Ancient-and-Early-Medieval-India_Upinder-Singh.aspx'
    },
    {
      id: 'source-bechert-buddha',
      title: 'Heinz Bechert, When Did the Buddha Live?',
      author: 'Heinz Bechert',
      year: 1995,
      publisher: 'Sri Satguru Publications',
      url: 'https://search.worldcat.org/title/33123630'
    },
    {
      id: 'source-natural-earth',
      title: 'Natural Earth 1:50m Physical Vectors',
      author: 'Natural Earth',
      year: 2025,
      publisher: 'Natural Earth',
      url: 'https://www.naturalearthdata.com/downloads/50m-physical-vectors/'
    },
    {
      id: 'source-fortson-indo-european',
      title: 'Benjamin W. Fortson IV, Indo-European Language and Culture',
      author: 'Benjamin W. Fortson IV',
      year: 2010,
      publisher: 'Wiley-Blackwell',
      url: 'https://www.wiley.com/en-us/Indo+European+Language+and+Culture%3A+An+Introduction%2C+2nd+Edition-p-9781405188968'
    }
  ];

  const entities = [
    {
      id: 'buddhism',
      type: 'religiousTradition',
      level: 'religion',
      name: '佛教',
      alternativeNames: ['Buddhism'],
      canonicalSummary: '发端于南亚、围绕佛陀教说与僧团实践发展，并在长期传播中形成多种传统的宗教。',
      existence: { start: -500, label: '约公元前5世纪起' },
      defaultCardId: 'buddhism-overview',
      featuredCardIds: ['buddhism-overview', 'buddhism-networks'],
      tags: ['南亚', '宗教传统', '传播网络'],
      sourceIds: ['source-gombrich-buddhism', 'source-singh-ancient-india']
    },
    {
      id: 'shakyamuni',
      type: 'person',
      name: '释迦牟尼',
      alternativeNames: ['乔达摩·悉达多', 'Gautama Buddha'],
      canonicalSummary: '佛教传统尊为佛陀的历史人物，其生平年代与细节需要区分早期材料和后世传记。',
      existence: { start: -500, end: -400, approximate: true, label: '约公元前5世纪' },
      defaultCardId: 'shakyamuni-overview',
      featuredCardIds: ['shakyamuni-overview'],
      tags: ['人物', '恒河中游'],
      sourceIds: ['source-bechert-buddha', 'source-gombrich-buddhism']
    },
    {
      id: 'ashoka',
      type: 'person',
      name: '阿育王',
      alternativeNames: ['Aśoka'],
      canonicalSummary: '孔雀帝国君主，以跨区域敕令、道德治理主张和对佛教僧团的支持著称。',
      existence: { start: -304, end: -232, approximate: true, label: '约公元前304—前232年' },
      defaultCardId: 'ashoka-overview',
      featuredCardIds: ['ashoka-overview'],
      tags: ['人物', '王权', '敕令'],
      sourceIds: ['source-thapar-ashoka', 'source-strong-ashoka']
    },
    {
      id: 'maurya',
      type: 'polity',
      name: '孔雀帝国',
      alternativeNames: ['Maurya Empire'],
      canonicalSummary: '公元前4—前2世纪统治南亚大部的政治实体，通过王权、税收与交通网络连接差异显著的地区。',
      existence: { start: -322, end: -185, label: '公元前322—前185年' },
      defaultCardId: 'maurya-overview',
      featuredCardIds: ['maurya-overview'],
      tags: ['政治实体', '南亚'],
      sourceIds: ['source-thapar-ashoka', 'source-singh-ancient-india']
    },
    {
      id: 'maurya-administration',
      type: 'institution',
      name: '孔雀帝国行政网络',
      canonicalSummary: '用于连接宫廷、区域官员、税收与交通的多层制度安排，而非单一同质官僚机器。',
      existence: { start: -322, end: -185, label: '孔雀帝国时期' },
      defaultCardId: 'maurya-administration-overview',
      featuredCardIds: ['maurya-administration-overview'],
      tags: ['制度', '组成结构'],
      sourceIds: ['source-singh-ancient-india', 'source-thapar-ashoka']
    },
    {
      id: 'indo-european',
      type: 'languageSystem',
      level: 'family',
      name: '印欧语系',
      canonicalSummary: '通过历史比较语言学重建的语言家族，包含多个直接分支。',
      defaultCardId: 'indo-european-overview',
      featuredCardIds: ['indo-european-overview'],
      tags: ['语言系统', '测试谱系'],
      sourceIds: ['source-fortson-indo-european']
    },
    {
      id: 'indo-iranian',
      type: 'languageSystem',
      level: 'branch',
      name: '印度—伊朗语支',
      canonicalSummary: '印欧语系的一个直接分支，包括印度—雅利安语和伊朗语等后续分支。',
      defaultCardId: 'indo-iranian-overview',
      featuredCardIds: ['indo-iranian-overview'],
      tags: ['语言系统', '测试谱系'],
      sourceIds: ['source-fortson-indo-european']
    }
  ];

  const structuralEdges = [
    {
      id: 'edge-shakyamuni-buddhism',
      family: 'transmission',
      type: 'taught_foundation',
      sourceId: 'shakyamuni',
      targetId: 'buddhism',
      time: { start: -500, end: -400, approximate: true, label: '约公元前5世纪' },
      label: { forward: '教说促成传统形成', reverse: '追溯教说至' },
      canonicalSummary: '早期佛教共同体把释迦牟尼的教说和修行范式视为传统的根本来源。',
      forwardSummary: '释迦牟尼的教说与实践形成早期共同体的核心参照。',
      reverseSummary: '佛教传统把自身根本教说追溯到释迦牟尼。',
      qualifiers: ['生平年代与早期传记细节存在学术争议'],
      sourceIds: ['source-bechert-buddha', 'source-gombrich-buddhism']
    },
    {
      id: 'edge-ashoka-maurya',
      family: 'role',
      type: 'ruled',
      sourceId: 'ashoka',
      targetId: 'maurya',
      time: { start: -268, end: -232, approximate: true, label: '约公元前268—前232年' },
      label: { forward: '统治', reverse: '由其统治' },
      canonicalSummary: '阿育王在孔雀帝国政治结构中作为君主行使王权。',
      forwardSummary: '阿育王统治孔雀帝国，但帝国不能被化约为君主个人。',
      reverseSummary: '孔雀帝国在阿育王时期留下大范围敕令证据。',
      sourceIds: ['source-thapar-ashoka', 'source-singh-ancient-india']
    },
    {
      id: 'edge-ashoka-buddhism',
      family: 'role',
      type: 'patronized',
      sourceId: 'ashoka',
      targetId: 'buddhism',
      time: { start: -260, end: -232, approximate: true, label: '约公元前260—前232年' },
      label: { forward: '支持僧团并提高公共可见度', reverse: '获得其支持' },
      canonicalSummary: '阿育王对佛教僧团的支持提高了佛教的公共可见度，但其敕令面向帝国内多种群体。',
      forwardSummary: '王权支持扩大了僧团活动空间，却不是佛教传播的唯一原因。',
      reverseSummary: '佛教在阿育王时期获得显著王权支持，但并非帝国唯一宗教。',
      qualifiers: ['不把敕令等同于佛教教义文本'],
      sourceIds: ['source-thapar-ashoka', 'source-strong-ashoka']
    },
    {
      id: 'edge-maurya-buddhism',
      family: 'historicalNetwork',
      type: 'political_context',
      sourceId: 'maurya',
      targetId: 'buddhism',
      time: { start: -322, end: -185, label: '孔雀帝国时期' },
      label: { forward: '构成政治与交通环境', reverse: '活动于其政治环境中' },
      canonicalSummary: '孔雀帝国的交通、行政与跨区域王权构成佛教组织活动的一层政治环境，但没有单线决定其传播。',
      sourceIds: ['source-singh-ancient-india', 'source-gombrich-buddhism']
    },
    {
      id: 'edge-maurya-administration',
      family: 'composition',
      type: 'included_institution',
      sourceId: 'maurya',
      targetId: 'maurya-administration',
      time: { start: -322, end: -185, label: '孔雀帝国时期' },
      label: { forward: '包含制度网络', reverse: '构成其制度部分' },
      canonicalSummary: '孔雀帝国包含连接宫廷与区域的行政网络，但各地治理强度并不均一。',
      sourceIds: ['source-singh-ancient-india', 'source-thapar-ashoka']
    },
    {
      id: 'edge-indo-iranian-indo-european',
      family: 'lineage',
      type: 'branch_of',
      sourceId: 'indo-iranian',
      targetId: 'indo-european',
      label: { forward: '是其分支', reverse: '包含直接分支' },
      canonicalSummary: '历史比较语言学把印度—伊朗语支归为印欧语系的直接分支。',
      sourceIds: ['source-fortson-indo-european']
    }
  ];

  const cards = [
    {
      id: 'buddhism-overview',
      entityId: 'buddhism',
      kind: 'overview',
      title: '佛教如何从一套教说成为跨区域传统？',
      question: '人物、共同体与政治环境怎样共同塑造佛教的早期扩展？',
      introduction: '这张 Card 从恒河中游的教说共同体出发，追踪僧团、王权与跨区域网络的交汇。',
      scope: { time: { start: -500, end: -185 }, edgeFamilies: ['transmission', 'role', 'historicalNetwork'], featuredEntityIds: ['shakyamuni', 'ashoka', 'maurya'] },
      sceneIds: ['buddhism-origins', 'buddhism-teacher', 'buddhism-community', 'buddhism-ashoka-period', 'buddhism-open-network'],
      structureViewIds: ['view-buddhism-context', 'view-buddhism-network'],
      closingNavigationIds: ['nav-buddhism-ashoka', 'nav-buddhism-networks', 'nav-buddhism-shakyamuni'],
      sourceIds: ['source-gombrich-buddhism', 'source-singh-ancient-india']
    },
    {
      id: 'buddhism-networks',
      entityId: 'buddhism',
      kind: 'facet',
      lens: '传播与政治环境',
      title: '佛教传播不是一条单线',
      question: '早期佛教网络为何不能只用一位君主或一条路线解释？',
      introduction: '传播由僧团组织、城市与交通、赞助者以及地方接受共同构成。',
      scope: { time: { start: -500, end: -185 }, edgeFamilies: ['transmission', 'role', 'historicalNetwork'], featuredEntityIds: ['shakyamuni', 'ashoka', 'maurya'] },
      sceneIds: ['networks-many-causes', 'networks-patronage', 'networks-political-space', 'networks-limits'],
      structureViewIds: ['view-buddhism-network'],
      closingNavigationIds: ['nav-networks-overview', 'nav-networks-ashoka'],
      sourceIds: ['source-gombrich-buddhism', 'source-thapar-ashoka']
    },
    {
      id: 'shakyamuni-overview',
      entityId: 'shakyamuni',
      kind: 'overview',
      title: '释迦牟尼：历史人物与传统记忆',
      question: '我们如何在有限的早期证据与丰富的后世传记之间阅读佛陀生平？',
      introduction: '这张 Card 把可谨慎讨论的历史环境，与具有宗教意义的传记传统分开。',
      scope: { time: { start: -500, end: -400 }, edgeFamilies: ['transmission'], featuredEntityIds: ['buddhism'] },
      sceneIds: ['shakyamuni-sources', 'shakyamuni-ganges', 'shakyamuni-teaching', 'shakyamuni-memory'],
      structureViewIds: ['view-buddhism-network'],
      closingNavigationIds: ['nav-shakyamuni-buddhism'],
      sourceIds: ['source-bechert-buddha', 'source-gombrich-buddhism']
    },
    {
      id: 'ashoka-overview',
      entityId: 'ashoka',
      kind: 'overview',
      title: '阿育王如何把王权写进公共空间？',
      question: '敕令、道德治理与佛教支持之间是什么关系？',
      introduction: '岩石与石柱上的敕令让我们看见一位君主如何面向差异显著的臣民表达治理主张。',
      scope: { time: { start: -268, end: -232 }, edgeFamilies: ['role', 'historicalNetwork'], featuredEntityIds: ['maurya', 'buddhism'] },
      sceneIds: ['ashoka-emperor', 'ashoka-edicts', 'ashoka-dhamma', 'ashoka-buddhism', 'ashoka-limits'],
      structureViewIds: ['view-ashoka-context'],
      closingNavigationIds: ['nav-ashoka-maurya', 'nav-ashoka-buddhism'],
      sourceIds: ['source-thapar-ashoka', 'source-strong-ashoka']
    },
    {
      id: 'maurya-overview',
      entityId: 'maurya',
      kind: 'overview',
      title: '孔雀帝国怎样连接差异显著的地区？',
      question: '大范围政治秩序依靠什么维持，又在哪里显得有限？',
      introduction: '帝国范围并不等于均一控制；交通、官员、税收和地方协商共同形成有差异的统治网络。',
      scope: { time: { start: -322, end: -185 }, edgeFamilies: ['role', 'composition', 'historicalNetwork'], featuredEntityIds: ['ashoka', 'maurya-administration', 'buddhism'] },
      sceneIds: ['maurya-formation', 'maurya-scale', 'maurya-administration-network', 'maurya-religious-context'],
      structureViewIds: ['view-maurya-composition', 'view-buddhism-context'],
      closingNavigationIds: ['nav-maurya-ashoka', 'nav-maurya-buddhism'],
      sourceIds: ['source-singh-ancient-india', 'source-thapar-ashoka']
    },
    {
      id: 'maurya-administration-overview',
      entityId: 'maurya-administration',
      kind: 'overview',
      title: '孔雀帝国行政网络',
      question: '制度如何在不同地区以不同强度运作？',
      introduction: '这是一张用于组成结构示例的简短支持 Card。',
      sceneIds: ['maurya-administration-note'],
      structureViewIds: ['view-maurya-composition'],
      closingNavigationIds: ['nav-administration-maurya'],
      sourceIds: ['source-singh-ancient-india']
    },
    {
      id: 'indo-european-overview',
      entityId: 'indo-european',
      kind: 'overview',
      title: '印欧语系的直接分支',
      question: '谱系视图为什么只展开一层？',
      introduction: '这张支持 Card 用于验证语言系统的直接谱系查询。',
      sceneIds: ['indo-european-branch'],
      structureViewIds: ['view-indo-european-lineage'],
      closingNavigationIds: ['nav-indo-european-indo-iranian'],
      sourceIds: ['source-fortson-indo-european']
    },
    {
      id: 'indo-iranian-overview',
      entityId: 'indo-iranian',
      kind: 'overview',
      title: '印度—伊朗语支',
      question: '一个语言分支如何被归入更大的语系？',
      introduction: '语言谱系来自比较语言学关系，不是人群血统分类。',
      sceneIds: ['indo-iranian-parent'],
      structureViewIds: ['view-indo-european-lineage'],
      closingNavigationIds: ['nav-indo-iranian-indo-european'],
      sourceIds: ['source-fortson-indo-european']
    }
  ];

  const sceneSeed = [
    ['buddhism-origins', 'buddhism-overview', 1, '约公元前5世纪', '恒河中游的思想与城镇世界', ['早期佛教产生在恒河中游多国并存、城镇增长和游行修行者活跃的环境中。', '地理与城市网络提供相遇条件，却不会自动产生某一种教说。'], 'map-buddhism-origins', ['view-buddhism-context'], []],
    ['buddhism-teacher', 'buddhism-overview', 2, '约公元前5世纪', '一位教师与可实践的道路', ['传统把教说追溯到释迦牟尼。早期材料更适合帮助我们理解教说和共同体，而不是重建一部无争议的现代传记。'], 'map-shakyamuni', ['view-buddhism-network'], ['nav-buddhism-shakyamuni']],
    ['buddhism-community', 'buddhism-overview', 3, '早期共同体', '僧团让教说能够持续', ['共同生活、传授和布施关系，使佛教不只依赖一位教师的在场。', '这种组织能力与地方社会的接受同样重要。'], 'map-buddhism-community', ['view-buddhism-context'], []],
    ['buddhism-ashoka-period', 'buddhism-overview', 4, '约公元前260—前232年', '阿育王时期：支持与公共可见度', ['阿育王的支持扩大了僧团的公共活动空间。', '但敕令面向帝国内不同人群，不能被简单读成佛教教义文本。'], 'map-ashoka-network', ['view-buddhism-context', 'view-buddhism-network'], ['nav-buddhism-ashoka']],
    ['buddhism-open-network', 'buddhism-overview', 5, '长期过程', '传播没有单一发动机', ['王权、商路、城市、僧团和翻译传统在不同时期发挥不同作用。', '这条机制链说明条件如何组合，不意味着地理或帝国决定了佛教必然扩展。'], 'map-buddhism-network', ['view-buddhism-network'], ['nav-buddhism-networks']],
    ['networks-many-causes', 'buddhism-networks', 1, '早期网络', '多个节点，而非一条箭头', ['传播往往通过重复旅行、共同体建立和地方重述发生。'], 'map-buddhism-network', ['view-buddhism-network'], []],
    ['networks-patronage', 'buddhism-networks', 2, '赞助关系', '赞助者提供空间，但不控制全部意义', ['不同层级的赞助为僧团提供资源；阿育王只是证据最醒目的赞助者之一。'], 'map-ashoka-network', ['view-buddhism-context'], ['nav-networks-ashoka']],
    ['networks-political-space', 'buddhism-networks', 3, '帝国环境', '政治空间降低部分连接成本', ['孔雀帝国的交通与行政环境可能帮助跨区域往来，但各地控制强度并不均一。'], 'map-maurya', ['view-buddhism-network'], []],
    ['networks-limits', 'buddhism-networks', 4, '限制', '网络解释也不能包办历史', ['相似的交通与政治条件不会自动产生相同宗教结果；教义选择、组织实践和地方社会都保有能动性。'], 'map-buddhism-origins', ['view-buddhism-context'], ['nav-networks-overview']],
    ['shakyamuni-sources', 'shakyamuni-overview', 1, '证据层次', '先区分早期材料与后世传记', ['学者对佛陀年代仍有讨论。谨慎叙事不把后世传记细节全部当作同时代记录。'], 'map-shakyamuni', ['view-buddhism-network'], []],
    ['shakyamuni-ganges', 'shakyamuni-overview', 2, '恒河中游', '移动的教师与多国环境', ['城镇和道路让教师、门徒与赞助者相遇，但环境只是条件，不是思想内容的决定者。'], 'map-buddhism-origins', ['view-buddhism-context'], []],
    ['shakyamuni-teaching', 'shakyamuni-overview', 3, '教说与实践', '共同体围绕实践形成', ['教说、戒律与共同生活让传统获得可延续的形式。'], 'map-buddhism-community', ['view-buddhism-network'], ['nav-shakyamuni-buddhism']],
    ['shakyamuni-memory', 'shakyamuni-overview', 4, '后世记忆', '历史人物也是传统记忆的中心', ['传记传统表达宗教意义，不应与可直接验证的历史细节混为一谈；地理环境不会自动决定一种教说如何被记忆。'], 'map-shakyamuni', ['view-buddhism-network'], []],
    ['ashoka-emperor', 'ashoka-overview', 1, '约公元前268年起', '阿育王首先是孔雀帝国君主', ['他的行动依赖既有的王朝、交通与行政网络，不能把帝国写成个人的谱系后代。'], 'map-maurya', ['view-ashoka-context'], ['nav-ashoka-maurya']],
    ['ashoka-edicts', 'ashoka-overview', 2, '在位时期', '敕令进入公共空间', ['岩刻与柱刻分布在帝国不同区域，以不同语言和文字面向多样人群。'], 'map-ashoka-edicts', ['view-ashoka-context'], []],
    ['ashoka-dhamma', 'ashoka-overview', 3, '治理主张', '“法”不是单一宗派宣言', ['敕令强调克制、照护和对多种群体的尊重。把它们等同于佛教教义会缩窄其政治语境。'], 'map-ashoka-edicts', ['view-ashoka-context'], []],
    ['ashoka-buddhism', 'ashoka-overview', 4, '王权与僧团', '支持佛教，但并非只服务佛教', ['传统与碑铭共同表明阿育王和佛教关系密切；证据仍要求区分政治表达和宗教记忆。'], 'map-ashoka-network', ['view-ashoka-context'], ['nav-ashoka-buddhism']],
    ['ashoka-limits', 'ashoka-overview', 5, '限制', '石刻分布不等于均匀统治', ['地图上的点显示保存下来的证据位置，不是精确疆界或控制强度。地理范围不能决定政策是否被接受。'], 'map-ashoka-edicts', ['view-ashoka-context'], []],
    ['maurya-formation', 'maurya-overview', 1, '公元前4世纪末', '一个大范围政治实体形成', ['孔雀王朝从摩揭陀扩展，连接此前分属不同政治传统的地区。'], 'map-maurya', ['view-maurya-composition'], []],
    ['maurya-scale', 'maurya-overview', 2, '帝国尺度', '边界是近似教学覆盖', ['古代控制范围随时间和地区变化；本图不把现代边界精度投射到古代。'], 'map-maurya', ['view-maurya-composition'], ['nav-maurya-ashoka']],
    ['maurya-administration-network', 'maurya-overview', 3, '制度网络', '交通、官员与地方协商', ['帝国需要制度连接中心与地区，但不能假设各地由同一种官僚方式均匀管理。'], 'map-maurya-administration', ['view-maurya-composition'], ['nav-maurya-administration']],
    ['maurya-religious-context', 'maurya-overview', 4, '多元社会', '佛教处在多种传统之间', ['帝国构成佛教活动的一层政治环境，却没有决定佛教的全部发展。'], 'map-ashoka-network', ['view-buddhism-context'], ['nav-maurya-buddhism']],
    ['maurya-administration-note', 'maurya-administration-overview', 1, '孔雀帝国时期', '制度不是一张静态组织图', ['行政网络随区域和证据类型而异；这张组成视图是解释模型，不是完整官署名录，也不主张地理决定制度形态。'], 'map-maurya-administration', ['view-maurya-composition'], ['nav-administration-maurya']],
    ['indo-european-branch', 'indo-european-overview', 1, '比较语言学', '只看直接下一层', ['印度—伊朗语支是直接分支。语言谱系表示语言关系，不表示人群血统，地理分布也不决定语言必然分化。'], 'map-language-lineage', ['view-indo-european-lineage'], ['nav-indo-european-indo-iranian']],
    ['indo-iranian-parent', 'indo-iranian-overview', 1, '比较语言学', '从分支回到语系', ['印度—伊朗语支归入印欧语系；这是语言系统关系，不把 PeopleGroup 当作语言分支，也不主张环境决定语言变化。'], 'map-language-lineage', ['view-indo-european-lineage'], ['nav-indo-iranian-indo-european']]
  ];

  const scenes = sceneSeed.map(([id, cardId, order, timeLabel, title, paragraphs, mapStateId, activeStructureViewIds, navigationIds]) => ({
    id,
    cardId,
    order,
    time: { label: timeLabel },
    eyebrow: timeLabel,
    title,
    contentBlocks: paragraphs.map(text => ({ type: 'paragraph', text })),
    takeaway: paragraphs[paragraphs.length - 1],
    mapStateId,
    activeStructureViewIds,
    navigationIds,
    featuredEntityIds: [],
    sourceIds: cardId.startsWith('ashoka') ? ['source-thapar-ashoka'] :
      cardId.startsWith('maurya') ? ['source-singh-ancient-india'] :
      cardId.startsWith('indo-') ? ['source-fortson-indo-european'] :
      cardId.startsWith('shakyamuni') ? ['source-bechert-buddha'] :
      ['source-gombrich-buddhism']
  }));
  scenes.find(scene => scene.id === 'buddhism-origins').contentBlocks.push({
    type: 'asset',
    assetId: 'asset-natural-earth',
    alt: 'Natural Earth 本地矢量底图来源说明'
  });

  const structureViews = [
    {
      id: 'view-buddhism-context',
      family: 'context',
      title: '早期佛教的精选情境',
      query: { edgeFamilies: ['transmission', 'role', 'historicalNetwork'], direction: 'both' },
      maxVisible: 3,
      featuredEntityIds: ['shakyamuni', 'ashoka', 'maurya'],
      display: 'mapAndCards'
    },
    {
      id: 'view-buddhism-network',
      family: 'historicalNetwork',
      title: '人物、僧团与政治环境的历史网络',
      query: { edgeFamilies: ['transmission', 'historicalNetwork'], direction: 'both' },
      maxVisible: 4,
      featuredEntityIds: ['shakyamuni', 'buddhism', 'maurya'],
      display: 'sequence'
    },
    {
      id: 'view-ashoka-context',
      family: 'context',
      title: '阿育王的多重角色',
      query: { edgeFamilies: ['role', 'historicalNetwork'], direction: 'both' },
      maxVisible: 3,
      featuredEntityIds: ['maurya', 'buddhism'],
      display: 'mapAndCards'
    },
    {
      id: 'view-maurya-composition',
      family: 'composition',
      title: '孔雀帝国的组成结构',
      query: { edgeFamilies: ['composition'], direction: 'outgoing' },
      maxVisible: 3,
      featuredEntityIds: ['maurya-administration'],
      display: 'mapAndCards'
    },
    {
      id: 'view-indo-european-lineage',
      family: 'lineage',
      title: '印欧语系的直接分支',
      query: { edgeFamilies: ['lineage'], edgeTypes: ['branch_of'], direction: 'incoming' },
      depth: 1,
      maxVisible: 4,
      featuredEntityIds: ['indo-iranian'],
      display: 'cards'
    }
  ];

  const navigationOptions = [
    ['nav-buddhism-shakyamuni', 'buddhism-overview', 'buddhism-teacher', 'shakyamuni-overview', 'structuralEdge', 'edge-shakyamuni-buddhism', '走近释迦牟尼', '如何区分历史人物与传统记忆？', 'inline'],
    ['nav-buddhism-ashoka', 'buddhism-overview', 'buddhism-ashoka-period', 'ashoka-overview', 'structuralEdge', 'edge-ashoka-buddhism', '进入阿育王', '王权支持怎样进入公共空间？', 'mapNode'],
    ['nav-buddhism-networks', 'buddhism-overview', 'buddhism-open-network', 'buddhism-networks', 'relatedCard', 'buddhism-networks', '继续：传播网络', '同一实体的另一种策展视角', 'closingCard'],
    ['nav-networks-overview', 'buddhism-networks', 'networks-limits', 'buddhism-overview', 'relatedCard', 'buddhism-overview', '返回佛教概览', '回到早期形成的完整叙事', 'closingCard'],
    ['nav-networks-ashoka', 'buddhism-networks', 'networks-patronage', 'ashoka-overview', 'structuralEdge', 'edge-ashoka-buddhism', '阅读阿育王', '检视最醒目的王权赞助案例', 'inline'],
    ['nav-shakyamuni-buddhism', 'shakyamuni-overview', 'shakyamuni-teaching', 'buddhism-overview', 'structuralEdge', 'edge-shakyamuni-buddhism', '进入佛教概览', '教说如何成为可延续的传统？', 'closingCard'],
    ['nav-ashoka-maurya', 'ashoka-overview', 'ashoka-emperor', 'maurya-overview', 'structuralEdge', 'edge-ashoka-maurya', '进入孔雀帝国', '不要把帝国化约为一位君主', 'mapNode'],
    ['nav-ashoka-buddhism', 'ashoka-overview', 'ashoka-buddhism', 'buddhism-overview', 'structuralEdge', 'edge-ashoka-buddhism', '进入佛教概览', '从被支持的传统一侧重读关系', 'inline'],
    ['nav-maurya-ashoka', 'maurya-overview', 'maurya-scale', 'ashoka-overview', 'structuralEdge', 'edge-ashoka-maurya', '进入阿育王', '从帝国回到留下敕令的君主', 'inline'],
    ['nav-maurya-buddhism', 'maurya-overview', 'maurya-religious-context', 'buddhism-overview', 'structuralEdge', 'edge-maurya-buddhism', '进入佛教概览', '政治环境如何与宗教网络交汇？', 'closingCard'],
    ['nav-maurya-administration', 'maurya-overview', 'maurya-administration-network', 'maurya-administration-overview', 'structuralEdge', 'edge-maurya-administration', '查看行政网络', '把组成关系与传播箭头分开', 'inline'],
    ['nav-administration-maurya', 'maurya-administration-overview', 'maurya-administration-note', 'maurya-overview', 'structuralEdge', 'edge-maurya-administration', '返回孔雀帝国', '把制度放回整体政治实体', 'closingCard'],
    ['nav-indo-european-indo-iranian', 'indo-european-overview', 'indo-european-branch', 'indo-iranian-overview', 'structuralEdge', 'edge-indo-iranian-indo-european', '进入印度—伊朗语支', '验证直接下一级谱系', 'inline'],
    ['nav-indo-iranian-indo-european', 'indo-iranian-overview', 'indo-iranian-parent', 'indo-european-overview', 'structuralEdge', 'edge-indo-iranian-indo-european', '返回印欧语系', '从分支回到直接上一级', 'closingCard']
  ].map(([id, fromCardId, fromSceneId, targetCardId, kind, basisId, label, hook, presentation], rank) => ({
    id,
    fromCardId,
    fromSceneId,
    targetCardId,
    basis: { kind, id: basisId },
    label,
    hook,
    summary: hook,
    presentation,
    rank: rank + 1
  }));

  const geometries = [
    {
      id: 'geometry-ganges-heartland',
      geometry: { type: 'Polygon', coordinates: [[[76, 25], [86, 24], [88, 27], [82, 30], [76, 28], [76, 25]]] },
      approximate: true,
      label: '恒河中游教学范围（近似）',
      sourceIds: ['source-natural-earth', 'source-gombrich-buddhism']
    },
    {
      id: 'geometry-maurya-extent',
      geometry: { type: 'Polygon', coordinates: [[[66, 24], [72, 31], [82, 31], [90, 25], [84, 18], [78, 10], [72, 18], [66, 24]]] },
      approximate: true,
      label: '孔雀帝国约公元前3世纪教学覆盖（近似）',
      sourceIds: ['source-natural-earth', 'source-singh-ancient-india']
    },
    {
      id: 'geometry-ashoka-edicts',
      geometry: { type: 'MultiPoint', coordinates: [[69.2, 34.5], [72.8, 25.6], [78.1, 27.2], [80.9, 25.4], [85.1, 25.6], [77.6, 12.9]] },
      approximate: true,
      label: '部分阿育王敕令地点（教学选点）',
      sourceIds: ['source-thapar-ashoka', 'source-natural-earth']
    },
    {
      id: 'geometry-buddhist-network',
      geometry: { type: 'MultiLineString', coordinates: [[[82.9, 25.3], [80.9, 26.8], [77.2, 28.6]], [[82.9, 25.3], [85.1, 25.6], [88.4, 26.7]]] },
      approximate: true,
      label: '早期佛教联系方向（近似，非精确路线）',
      sourceIds: ['source-gombrich-buddhism', 'source-natural-earth']
    },
    {
      id: 'geometry-language-lineage',
      geometry: { type: 'Point', coordinates: [70, 35] },
      approximate: true,
      label: '语言谱系示意节点（非族群疆界）',
      sourceIds: ['source-fortson-indo-european']
    }
  ];

  const mapStates = [
    ['map-buddhism-origins', [82, 26.5], 5.2, ['geometry-ganges-heartland'], ['buddhism'], []],
    ['map-shakyamuni', [82.7, 26.4], 6.2, ['geometry-ganges-heartland'], ['shakyamuni', 'buddhism'], ['nav-buddhism-shakyamuni']],
    ['map-buddhism-community', [82.5, 26], 5.7, ['geometry-ganges-heartland'], ['buddhism'], []],
    ['map-ashoka-network', [80, 24], 3.9, ['geometry-maurya-extent', 'geometry-ashoka-edicts', 'geometry-buddhist-network'], ['ashoka', 'maurya', 'buddhism'], ['nav-buddhism-ashoka', 'nav-ashoka-maurya']],
    ['map-buddhism-network', [82, 25], 4.3, ['geometry-buddhist-network'], ['buddhism', 'shakyamuni', 'maurya'], []],
    ['map-maurya', [79, 23], 4, ['geometry-maurya-extent'], ['maurya', 'ashoka'], ['nav-ashoka-maurya']],
    ['map-ashoka-edicts', [78, 24], 4.2, ['geometry-maurya-extent', 'geometry-ashoka-edicts'], ['ashoka'], []],
    ['map-maurya-administration', [79, 23], 4.1, ['geometry-maurya-extent'], ['maurya', 'maurya-administration'], ['nav-maurya-administration']],
    ['map-language-lineage', [70, 35], 3.2, ['geometry-language-lineage'], ['indo-european', 'indo-iranian'], ['nav-indo-european-indo-iranian']]
  ].map(([id, center, scale, geometryIds, entityIds, navigationIds]) => ({
    id,
    camera: { center, scale },
    layerIds: [
      ...geometryIds.map(geometryId => ({ id: `${id}-${geometryId}`, kind: 'geometry', geometryId })),
      ...entityIds.map(entityId => ({ id: `${id}-${entityId}`, kind: 'entity', entityId })),
      ...navigationIds.map(navigationId => ({ id: `${id}-${navigationId}`, kind: 'navigation', navigationId }))
    ],
    caption: '范围与路线均为近似教学表达；地图呈现条件和关系，不主张地理决定历史。'
  }));

  const assets = [
    {
      id: 'asset-natural-earth',
      type: 'data',
      src: 'data/world-physical.js',
      title: 'Natural Earth 本地矢量底图',
      alt: '低对比度的本地海陆与水系矢量背景',
      sourceIds: ['source-natural-earth']
    }
  ];

  return {
    schemaVersion: 3,
    entities,
    structuralEdges,
    cards,
    scenes,
    structureViews,
    navigationOptions,
    mapStates,
    geometries,
    assets,
    sources
  };
}));
