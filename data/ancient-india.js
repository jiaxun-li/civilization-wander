(function exposeAncientIndiaV5(root, factory) {
  const data = factory();
  if (root) root.ATLAS_V5_ANCIENT_INDIA = data;
  if (typeof module === 'object' && module.exports) module.exports = data;
}(typeof window !== 'undefined' ? window : globalThis, function createAncientIndiaV5Data() {
  'use strict';

  function timeSpan(start, end, label, approximate) {
    const value = { start, end, label };
    if (approximate) value.approximate = true;
    return value;
  }

  function fact(id, text, sourceIds) {
    return { id, kind: 'historicalFact', text, sourceIds };
  }

  function interpretation(id, text, sourceIds) {
    return { id, kind: 'interpretation', text, sourceIds };
  }

  function synthesis(id, text, sourceIds) {
    return { id, kind: 'editorialSynthesis', text, sourceIds };
  }

  function limitation(id, text, sourceIds) {
    return { id, kind: 'limitation', text, sourceIds };
  }

  function historicalCase(id, title, text, eventIds, sourceIds) {
    return { id, kind: 'historicalCase', title, text, eventIds, sourceIds };
  }

  function review(limitations, counterexamples, uncertainties, alternatives, sourceIds) {
    return {
      limitations: limitations || [],
      counterexamples: counterexamples || [],
      uncertainties: uncertainties || [],
      alternativeExplanations: alternatives || [],
      sourceIds
    };
  }

  const sources = [
    { id: 'source-wright-ancient-indus', title: 'The Ancient Indus: Urbanism, Economy, and Society', author: 'Rita P. Wright', year: 2010, publisher: 'Cambridge University Press', url: 'https://www.britishmuseum.org/collection/term/BIB8384' },
    { id: 'source-kenoyer-indus-civilisation', title: 'The Indus Civilisation', author: 'Jonathan Mark Kenoyer', publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/abs/cambridge-world-prehistory/indus-civilisation/6D73243ABD6561B46B84EE198929CC5E' },
    { id: 'source-unesco-mohenjo-daro', title: 'Archaeological Ruins at Moenjodaro', publisher: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/138/' },
    { id: 'source-jansen-mohenjo-water', title: 'Water Supply and Sewage Disposal at Mohenjo-Daro', author: 'Michael Jansen', year: 1989, publisher: 'World Archaeology', url: 'https://architexturez.net/doc/10-1080/00438243-1989-9980100' },
    { id: 'source-nakamura-mohenjo-drainage', title: 'A Reconsideration of the Drainage System at Mohenjo-Daro', author: 'Tetsuo Nakamura et al.', year: 1995, publisher: 'Journal of Historical Studies in Civil Engineering', url: 'https://www.jstage.jst.go.jp/article/journalhs1990/15/0/15_0_87/_article' },
    { id: 'source-green-priest-king', title: 'Killing the Priest-King: Addressing Egalitarianism in the Indus Civilization', author: 'Adam S. Green', year: 2020, publisher: 'Journal of Archaeological Research', url: 'https://link.springer.com/article/10.1007/s10814-020-09147-9' },
    { id: 'source-green-indus-public-goods', title: 'Collective Action and Public Goods in the Indus Civilization', author: 'Adam S. Green', year: 2022, publisher: 'Frontiers in Political Science', url: 'https://www.frontiersin.org/journals/political-science/articles/10.3389/fpos.2022.823071/full' },
    { id: 'source-kenoyer-harappan-measurement', title: 'Measuring the Harappan World', author: 'Jonathan Mark Kenoyer', publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/abs/archaeology-of-measurement/measuring-the-harappan-world-insights-into-the-indus-order-and-cosmology/CA35A61C8206304939641CD63DE42450' },
    { id: 'source-kenoyer-indus-seals', title: 'Indus Seals: An Overview of Iconography and Style', author: 'Jonathan Mark Kenoyer', publisher: 'Harappa.com', url: 'https://www.harappa.com/content/indus-seals-overview-iconography-and-style-0' },
    { id: 'source-kenoyer-inscribed-objects', title: 'Inscribed Objects from Harappa Excavations 1986–2007', author: 'Jonathan Mark Kenoyer and Richard H. Meadow', publisher: 'Harappa.com', url: 'https://www.harappa.com/content/inscribed-objects-harappa-excavations-1986-2007' },
    { id: 'source-rao-indus-script', title: 'Entropic Evidence for Linguistic Structure in the Indus Script', author: 'Rajesh P. N. Rao et al.', year: 2009, publisher: 'Science', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2721819/' },
    { id: 'source-farmer-indus-script', title: 'The Collapse of the Indus-Script Thesis', author: 'Steve Farmer, Richard Sproat and Michael Witzel', year: 2004, publisher: 'Electronic Journal of Vedic Studies', url: 'https://safarmer.com/files/fsw3.pdf' },
    { id: 'source-parpola-indus-script', title: 'Deciphering the Indus Script', author: 'Asko Parpola', year: 1994, publisher: 'Cambridge University Press', url: 'https://books.google.com/books/about/Deciphering_the_Indus_Script.html?id=m1WNQgAACAAJ' },
    { id: 'source-possehl-indus-mesopotamia', title: 'Meluhha', author: 'Gregory L. Possehl', year: 2002, publisher: 'Iranica Antiqua', url: 'https://poj.peeters-leuven.be/content.php?id=127&journal_code=IA&url=article.php' },
    { id: 'source-oracc-sargon-meluhha', title: 'Sargon 11', publisher: 'ORACC: Electronic Text Corpus of Sumerian Royal Inscriptions', url: 'https://oracc.museum.upenn.edu/etcsri/Q001403' },
    { id: 'source-bm-gulf-seal-ur', title: 'Gulf type stamp seal found at Ur', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/collection/object/W_1932-1008-178' },
    { id: 'source-laursen-dilmun-seals', title: 'Seals and Sealing Technology in the Dilmun Culture', author: 'Steffen Laursen', year: 2018, publisher: 'Aarhus University Press', url: 'https://pure.au.dk/portal/da/publications/seals-and-sealing-technology-in-the-dilmun-culture-the-post-harap/' },
    { id: 'source-kenoyer-kish-carnelian', title: 'Tracing the Origins of Etched Carnelian Beads from Kish', author: 'Jonathan Mark Kenoyer et al.', year: 2026, publisher: 'Archaeometry', url: 'https://onlinelibrary.wiley.com/doi/10.1111/arcm.13098' },
    { id: 'source-giosan-harappan-transformation', title: 'Neoglacial Climate Anomalies and the Harappan Metamorphosis', author: 'Liviu Giosan et al.', year: 2018, publisher: 'Climate of the Past', url: 'https://cp.copernicus.org/articles/14/1669/2018/index.html' },
    { id: 'source-wikimedia-mohenjo-well', title: 'Monejodaro well photograph, CC BY 3.0', author: 'Najamuddin Shahwani', year: 2010, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Monejodaro_well_-_panoramio.jpg' },
    { id: 'source-wikimedia-mohenjo-street', title: 'Street at Mohenjo-daro photograph, CC BY-SA 3.0', author: 'Saqib Qayyum', year: 2014, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Street_-_Mohenjodaro.JPG' },
    { id: 'source-wikimedia-mohenjo-great-bath', title: 'Great Bath of Mohenjo-daro photograph, CC BY-SA 3.0', author: 'Soban', year: 2014, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Great_Bath_of_Mohenjo-daro.jpg' },
    { id: 'source-wikimedia-mohenjo-overview', title: 'Mohenjo-daro excavated ruins photograph, CC BY-SA 3.0', author: 'Saqib Qayyum', year: 2014, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Mohenjo-daro.jpg' },
    { id: 'source-wikimedia-cemetery-h-pottery', title: 'Painted pottery urns from Harappa, Cemetery H period, CC BY-SA 4.0', author: 'Avantiputra7', year: 2017, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Cemetery_H_Pottery.png' },
    { id: 'source-met-indus-unicorn-seal', title: 'Stamp seal and modern impression: unicorn and incense burner (?)', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/324062' },
    { id: 'source-met-indus-carnelian-bead', title: 'Carnelian bead from Nippur', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/324872' },
    { id: 'source-shinde-rakhigarhi-genome', title: 'An Ancient Harappan Genome Lacks Ancestry from Steppe Pastoralists or Iranian Farmers', author: 'Vasant Shinde et al.', year: 2019, publisher: 'Cell', url: 'https://pubmed.ncbi.nlm.nih.gov/31495572/' },
    { id: 'source-narasimhan-south-central-asia', title: 'The Formation of Human Populations in South and Central Asia', author: 'Vagheesh M. Narasimhan et al.', year: 2019, publisher: 'Science', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6822619/' },
    { id: 'source-jamison-brereton-rigveda', title: 'The Rigveda: The Earliest Religious Poetry of India', author: 'Stephanie W. Jamison and Joel P. Brereton', year: 2014, publisher: 'Oxford University Press', url: 'https://academic.oup.com/book/33632' },
    { id: 'source-oxford-vedic-oral-tradition', title: 'Vedic Oral Tradition', publisher: 'Oxford Bibliographies', url: 'https://academic.oup.com/reference/62357/reference-article-abstract/554520720' },
    { id: 'source-cambridge-veda-before-print', title: 'The Veda before Print', year: 2022, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/kingdoms-of-memory-empires-of-ink/veda-before-print/57AD64AC6E5B8E08F619DFD392FD72B0' },
    { id: 'source-singh-ancient-india', title: 'A History of Ancient and Early Medieval India', author: 'Upinder Singh', year: 2008, publisher: 'Pearson Longman', url: 'https://books.google.com/books?id=Pq2iCwAAQBAJ' },
    { id: 'source-generated-vedic-recitation', title: 'Early Vedic recitation teaching illustration', year: 2026, publisher: 'OpenAI image generation' }
  ];

  const entities = [
    {
      id: 'indus-civilization',
      type: 'culturalTradition',
      name: '印度河文明',
      alternativeNames: ['Indus Civilization', 'Harappan Civilization'],
      canonicalSummary: '约公元前3300—前1300年，分布在今天巴基斯坦与印度西北部，以城市、标准化器物、印章和广域交换网络留下重要考古证据的文化传统。',
      timeSpan: timeSpan(-3300, -1300, '约公元前3300—前1300年', true),

      tags: ['南亚', '文化传统', '早期城市'],
      sourceIds: ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation']
    },
    {
      id: 'mohenjo-daro',
      type: 'SettlementSite',
      name: '摩亨佐-达罗',
      alternativeNames: ['Mohenjo-daro', 'Moenjodaro'],
      canonicalSummary: '位于今天巴基斯坦南部的印度河文明城市遗址；街道、砖砌水井、住宅用水空间和大浴池保存了成熟期城市生活的重要证据。',
      timeSpan: timeSpan(-2600, -1900, '约公元前2600—前1900年', true),

      tags: ['南亚', '聚落遗址', '印度河文明'],
      sourceIds: ['source-unesco-mohenjo-daro', 'source-wright-ancient-indus']
    },
    {
      id: 'vedic-tradition',
      type: 'culturalTradition',
      name: '早期吠陀传统',
      alternativeNames: ['Early Vedic Tradition'],
      canonicalSummary: '约公元前1500—前500年，在南亚西北部逐渐形成，以早期印度—雅利安语言、口传赞歌、祭火仪式和牧农生活留下深远影响的文化传统。',
      timeSpan: timeSpan(-1500, -500, '约公元前1500—前500年', true),

      tags: ['南亚', '文化传统', '吠陀'],
      sourceIds: ['source-jamison-brereton-rigveda', 'source-oxford-vedic-oral-tradition', 'source-singh-ancient-india']
    }
  ];

  const events = [
    {
      id: 'event-steppe-related-ancestry-enters-south-asia', kind: 'historicalProcess',
      title: '草原相关人群进入南亚',
      timeSpan: timeSpan(-2000, -1500, '约公元前2000—前1500年', true),
      participantEntityIds: ['vedic-tradition'],
      evidenceBlocks: [
        interpretation('event-steppe-related-ancestry-evidence', '古代基因研究显示，公元前二千纪中叶以后，来自欧亚草原方向的祖源进入南亚，并与当地人群发生长期混合。', ['source-narasimhan-south-central-asia', 'source-shinde-rakhigarhi-genome'])
      ],
      sourceIds: ['source-narasimhan-south-central-asia', 'source-shinde-rakhigarhi-genome'],
      editorialReview: review(
        [limitation('event-steppe-related-ancestry-population-language', '遗传祖源、语言传播与文化身份是不同层面的证据，不能逐一对应。', ['source-narasimhan-south-central-asia'])],
        [],
        [interpretation('event-steppe-related-ancestry-pace', '人群进入的具体路线、批次与各地区时间仍会随新样本调整。', ['source-narasimhan-south-central-asia'])],
        [interpretation('event-steppe-related-ancestry-contact', '人口移动与地方社群的婚姻、交换和联盟共同推动了语言文化变化。', ['source-narasimhan-south-central-asia', 'source-singh-ancient-india'])],
        ['source-narasimhan-south-central-asia', 'source-shinde-rakhigarhi-genome', 'source-singh-ancient-india']
      )
    },
    {
      id: 'event-rigveda-composed-transmitted', kind: 'textualTradition',
      title: '《梨俱吠陀》赞歌形成并口传',
      timeSpan: timeSpan(-1500, -1000, '约公元前1500—前1000年', true),
      participantEntityIds: ['vedic-tradition'],
      evidenceBlocks: [
        fact('event-rigveda-composed-evidence', '《梨俱吠陀》的早期吠陀梵语赞歌由祭司家族以严格口传方式保存，内容呈现南亚西北部的河流、祭祀、牛群、战车与联盟。', ['source-jamison-brereton-rigveda', 'source-oxford-vedic-oral-tradition', 'source-cambridge-veda-before-print'])
      ],
      sourceIds: ['source-jamison-brereton-rigveda', 'source-oxford-vedic-oral-tradition', 'source-cambridge-veda-before-print'],
      editorialReview: review(
        [limitation('event-rigveda-composed-date', '赞歌分层形成，精确年代不能由后来的文本定本直接给出。', ['source-jamison-brereton-rigveda'])],
        [],
        [interpretation('event-rigveda-composed-geography', '赞歌中的河流和地名主要指向南亚西北部，但不能重建完整而固定的疆域。', ['source-jamison-brereton-rigveda'])],
        [],
        ['source-jamison-brereton-rigveda', 'source-oxford-vedic-oral-tradition', 'source-cambridge-veda-before-print']
      )
    },
    {
      id: 'event-indus-mesopotamia-exchange', kind: 'historicalProcess',
      title: '印度河与两河流域开展海上交换',
      timeSpan: timeSpan(-2600, -1900, '约公元前2600—前1900年', true),
      participantEntityIds: ['indus-civilization', 'akkadian-empire'],
      evidenceBlocks: [
        fact('event-indus-mesopotamia-exchange-evidence', '两河流域遗址发现印度河或印度河风格物品，阿卡德王室铭文也提到来自梅鲁哈、马干和迪尔蒙的船只。', ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur'])
      ],
      sourceIds: ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur'],
      editorialReview: review(
        [limitation('event-indus-mesopotamia-exchange-object-identity', '物品产地、制作技术与持有者身份不能直接画等号。', ['source-possehl-indus-mesopotamia', 'source-kenoyer-kish-carnelian'])],
        [],
        [interpretation('event-indus-mesopotamia-exchange-meluhha', '梅鲁哈通常被联系到更大的印度河地区，但其准确范围与古代身份仍不能完全确定。', ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha'])],
        [interpretation('event-indus-mesopotamia-exchange-routes', '物品可能通过直航、中转贸易、人员迁移与当地加工等多种方式传播。', ['source-possehl-indus-mesopotamia', 'source-laursen-dilmun-seals', 'source-kenoyer-kish-carnelian'])],
        ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur', 'source-laursen-dilmun-seals', 'source-kenoyer-kish-carnelian']
      )
    },
    {
      id: 'event-indus-urban-transformation', kind: 'historicalProcess',
      title: '印度河大城市网络转型',
      timeSpan: timeSpan(-2000, -1300, '约公元前2000—前1300年', true),
      participantEntityIds: ['indus-civilization', 'mohenjo-daro'],
      evidenceBlocks: [
        fact('event-indus-urban-transformation-evidence', '约公元前1900年后，大城市收缩，标准化印章与短铭文停止使用，聚落和生产活动转向更多区域中心。', ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-giosan-harappan-transformation'])
      ],
      sourceIds: ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-giosan-harappan-transformation'],
      editorialReview: review(
        [limitation('event-indus-urban-transformation-regional-variation', '不同地区转型的时间、规模和表现并不一致。', ['source-wright-ancient-indus', 'source-giosan-harappan-transformation'])],
        [],
        [interpretation('event-indus-urban-transformation-population', '城市收缩不等于当地人口整体消失。', ['source-giosan-harappan-transformation'])],
        [interpretation('event-indus-urban-transformation-causes', '河流、降雨、贸易、生产和社会组织变化可能共同推动了转型。', ['source-wright-ancient-indus', 'source-giosan-harappan-transformation'])],
        ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-giosan-harappan-transformation']
      )
    }
  ];

  const structuralEdges = [
    {
      id: 'edge-mohenjo-daro-indus-civilization',
      family: 'historicalNetwork',
      type: 'part_of_cultural_network',
      source: { kind: 'entity', id: 'mohenjo-daro' },
      target: { kind: 'entity', id: 'indus-civilization' },
      timeSpan: timeSpan(-2600, -1900, '印度河文明成熟期', true),
      label: { forward: '属于印度河城市网络', reverse: '包含摩亨佐-达罗的城市生活' },
      summaries: { canonical: '摩亨佐-达罗是印度河文明成熟期的重要城市遗址之一，城市细部与广域网络构成两个互补的故事视角。' },
      qualifiers: ['不把一座城市的证据视为整个文明所有地区的统一状况'],
      sourceIds: ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-unesco-mohenjo-daro']
    },
    {
      id: 'edge-indus-akkadian-exchange',
      family: 'historicalNetwork',
      type: 'exchanged_with',
      source: { kind: 'entity', id: 'indus-civilization' },
      target: { kind: 'entity', id: 'akkadian-empire' },
      timeSpan: timeSpan(-2334, -2154, '阿卡德帝国时期', true),
      label: { forward: '物品与船只向西连接', reverse: '铭文与物证指向东方联系' },
      summaries: { canonical: '阿卡德时期的铭文以及两河流域、海湾地区的物证，共同显示印度河世界与西亚之间存在远距离交换。' },
      qualifiers: ['不把梅鲁哈直接写成已经确认的印度河自称', '不把教学联系线表示成唯一航线'],
      sourceIds: ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur']
    }
  ];

  const cards = [
    {
      id: 'mohenjo-daro-urban-order',
      kind: 'overview',
      primaryEntityId: 'mohenjo-daro',
      relatedEntityIds: ['indus-civilization'],

      title: '水流过印度河古城',
      editorialPurpose: '沿着取水、用水和排水的过程，让读者看见城市秩序怎样进入日常生活，并把无法确认的治理形式留在内部审查层。',
      introduction: '一座四千多年前的砖城，没有留下国王的名字，却留下了水井、浴室和排水沟。沿着水的去向，我们走进摩亨佐-达罗的日常生活。',
      thesis: {
        text: '城市中的水并非一项孤立技术。水井、住宅平台、街边砖沟和持续维修，把居民的日常动作连接成一种长期维持的城市秩序。',
        sourceIds: ['source-jansen-mohenjo-water', 'source-nakamura-mohenjo-drainage', 'source-green-indus-public-goods']
      },
      timeSpan: timeSpan(-2600, -1800, '约公元前2600—前1800年', true),
      sceneIds: [
        'mohenjo-daro-partial-city',
        'mohenjo-daro-neighborhood-wells',
        'mohenjo-daro-water-leaves-home',
        'mohenjo-daro-great-bath',
        'mohenjo-daro-unnamed-managers'
      ],
      sourceIds: ['source-unesco-mohenjo-daro', 'source-jansen-mohenjo-water', 'source-nakamura-mohenjo-drainage', 'source-green-priest-king', 'source-green-indus-public-goods', 'source-giosan-harappan-transformation'],
      editorialReview: review(
        [
          limitation('mohenjo-daro-review-excavation', '已发掘区域只占遗址的一部分，不同街区的证据密度并不一致。', ['source-unesco-mohenjo-daro']),
          limitation('mohenjo-daro-review-modern-labels', '浴室与排水沟等现代称呼只用于描述可见结构，不能自动等同现代设施。', ['source-jansen-mohenjo-water', 'source-nakamura-mohenjo-drainage'])
        ],
        [historicalCase('mohenjo-daro-review-street-change', '重建中的街道变化', '主街较稳定，但小巷、住宅边界与设施分布会随着重建改变。', ['event-indus-urban-transformation'], ['source-green-indus-public-goods'])],
        [
          interpretation('mohenjo-daro-review-great-bath-use', '大浴池的使用者、使用频率与活动性质仍不能确定。', ['source-unesco-mohenjo-daro', 'source-jansen-mohenjo-water']),
          interpretation('mohenjo-daro-review-governance', '遗址能显示长期协调，却不能确定负责维护的组织形式。', ['source-green-priest-king', 'source-green-indus-public-goods'])
        ],
        [interpretation('mohenjo-daro-review-maintenance', '设施可能由家庭、邻里、工匠群体或更高层组织共同维护。', ['source-green-priest-king', 'source-green-indus-public-goods'])],
        ['source-unesco-mohenjo-daro', 'source-jansen-mohenjo-water', 'source-nakamura-mohenjo-drainage', 'source-green-priest-king', 'source-green-indus-public-goods']
      )
    },
    {
      id: 'indus-civilization-network',
      kind: 'overview',
      primaryEntityId: 'indus-civilization',
      relatedEntityIds: ['mohenjo-daro', 'akkadian-empire'],

      title: '相同的砖，远行的珠子',
      editorialPurpose: '通过砖块、砝码、印章、文字和远行物品，让读者看见多座城市之间的联系，而不是把文明写成王朝名单或概念百科。',
      introduction: '从一块方砖、一枚小印章和一颗远行的红色珠子出发，我们会看见许多城市曾彼此相连。那是印度河文明留下的世界，也是一个至今没有自己开口讲述的世界。',
      thesis: {
        text: '共同尺度让不同城市相互连接，印章和短铭文保存了交流方式，远行的珠饰与船只又把这一网络延伸到两河流域。约公元前1900年后，大城市网络逐渐转入更多地方生活。',
        sourceIds: ['source-kenoyer-harappan-measurement', 'source-kenoyer-indus-seals', 'source-possehl-indus-mesopotamia', 'source-giosan-harappan-transformation']
      },
      timeSpan: timeSpan(-2600, -1300, '约公元前2600—前1300年', true),
      sceneIds: [
        'indus-shared-measures',
        'indus-seals-image-and-signs',
        'indus-short-unread-script',
        'indus-carnelian-goes-west',
        'indus-meluhha-ships',
        'indus-network-changes-shape'
      ],
      sourceIds: ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-kenoyer-harappan-measurement', 'source-kenoyer-indus-seals', 'source-rao-indus-script', 'source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha', 'source-kenoyer-kish-carnelian', 'source-giosan-harappan-transformation'],
      editorialReview: review(
        [
          limitation('indus-review-modern-category', '印度河文明是现代考古分类，不是已经确认的古代自称。', ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation']),
          limitation('indus-review-object-identity', '物品产地、技术传统与持有者身份不能直接画等号。', ['source-possehl-indus-mesopotamia', 'source-kenoyer-kish-carnelian'])
        ],
        [historicalCase('indus-review-regional-variety', '共同尺度中的地区差异', '砖块、砝码与印章具有相似性，各地区仍保留明显差异。', ['event-indus-urban-transformation'], ['source-kenoyer-harappan-measurement', 'source-wright-ancient-indus'])],
        [
          interpretation('indus-review-script', '印章功能、符号性质与语言归属仍未解决。', ['source-rao-indus-script', 'source-farmer-indus-script', 'source-parpola-indus-script']),
          interpretation('indus-review-meluhha', '梅鲁哈的准确范围与身份仍有讨论。', ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha'])
        ],
        [
          interpretation('indus-review-exchange-modes', '物品可能随商人、移居工匠、转手交换或当地加工传播。', ['source-possehl-indus-mesopotamia', 'source-laursen-dilmun-seals', 'source-kenoyer-kish-carnelian']),
          interpretation('indus-review-transformation-causes', '城市转型可能涉及河流、气候、贸易、生产和社会组织的共同变化。', ['source-wright-ancient-indus', 'source-giosan-harappan-transformation'])
        ],
        ['source-wright-ancient-indus', 'source-kenoyer-harappan-measurement', 'source-rao-indus-script', 'source-farmer-indus-script', 'source-parpola-indus-script', 'source-possehl-indus-mesopotamia', 'source-giosan-harappan-transformation']
      )
    },
    {
      id: 'indo-aryan-enters-south-asia',
      kind: 'overview',
      primaryEntityId: 'vedic-tradition',
      relatedEntityIds: ['indus-civilization'],

      title: '大城市缩小，赞歌在河流间响起',
      editorialPurpose: '从印度河城市体系的区域化开始，连接人口移动、语言传播与吠陀赞歌的形成，呈现早期吠陀社会由多种人群长期相遇而成。',
      introduction: '印度河大城市缩小之后，地方社区继续生活，来自草原和中亚方向的人群也陆续进入西北部。在持续数代的相遇中，新的语言、赞歌与社会关系逐渐形成。',
      thesis: {
        text: '公元前二千纪，印度河城市网络转向地方化生活，来自草原方向的人群与早期印度—雅利安语言进入南亚西北部，并在与当地居民的长期交往中形成早期吠陀世界。',
        sourceIds: ['source-giosan-harappan-transformation', 'source-narasimhan-south-central-asia', 'source-jamison-brereton-rigveda', 'source-singh-ancient-india']
      },
      timeSpan: timeSpan(-1900, -1000, '约公元前1900—前1000年', true),
      sceneIds: ['indo-aryan-cities-change-first', 'indo-aryan-local-settlements', 'indo-aryan-steppe-groups-move-south', 'indo-aryan-language-enters-northwest', 'indo-aryan-poets-sing-rivers-fire', 'indo-aryan-new-society-forms'],
      sourceIds: ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-giosan-harappan-transformation', 'source-shinde-rakhigarhi-genome', 'source-narasimhan-south-central-asia', 'source-jamison-brereton-rigveda', 'source-oxford-vedic-oral-tradition', 'source-cambridge-veda-before-print', 'source-singh-ancient-india'],
      editorialReview: review(
        [limitation('indo-aryan-review-language-genes', '语言、遗传祖源和文化身份不能被当作同一套边界。', ['source-narasimhan-south-central-asia', 'source-jamison-brereton-rigveda']), limitation('indo-aryan-review-harappan-continuity', '印度河城市转型后，许多地方人口与生活传统持续存在。', ['source-giosan-harappan-transformation', 'source-shinde-rakhigarhi-genome'])],
        [historicalCase('indo-aryan-review-regional-paths', '各地区形成不同路径', '西北部、恒河上游和南亚其他地区吸收新语言与仪式的时间和方式并不相同。', ['event-steppe-related-ancestry-enters-south-asia'], ['source-singh-ancient-india'])],
        [interpretation('indo-aryan-review-chronology', '人口移动、语言扩散与赞歌形成的精确年代仍是多个证据体系共同讨论的问题。', ['source-narasimhan-south-central-asia', 'source-jamison-brereton-rigveda'])],
        [interpretation('indo-aryan-review-mechanisms', '迁徙、通婚、联盟、交换和仪式共同参与了早期吠陀社会的形成。', ['source-narasimhan-south-central-asia', 'source-singh-ancient-india'])],
        ['source-giosan-harappan-transformation', 'source-shinde-rakhigarhi-genome', 'source-narasimhan-south-central-asia', 'source-jamison-brereton-rigveda', 'source-singh-ancient-india']
      )
    }
  ];

  const scenes = [
    {
      id: 'mohenjo-daro-partial-city',
      title: '一座尚未完全看见的城市',
      eyebrow: '约公元前2600—1900年',
      timeSpan: timeSpan(-2600, -1900, '约公元前2600—前1900年', true), eventIds: ['event-indus-urban-transformation'],
      contentBlocks: [fact('mohenjo-daro-partial-city-fact', '约四千五百年前，今天巴基斯坦南部出现了一座大砖城。它没有留下可读的法令和城市档案，街道与房屋只能替居民讲述往事。今天揭开的仍只是遗址的一部分：主街在一次次重建中延续，小巷和院墙则不断调整。房屋倒下又建起，道路被一代代人继续使用，城市的形状也在生活中一点点长了出来。', ['source-unesco-mohenjo-daro', 'source-green-indus-public-goods'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-mohenjo-daro-site',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'mohenjo-daro', annotationId: 'annotation-mohenjo-daro-site-label', sourceIds: ['source-unesco-mohenjo-daro'] }
          ],
          caption: '深色圆点与文字共同标出摩亨佐-达罗遗址；今天已发掘的区域只是古城的一部分。'
        }
      },
      sourceIds: ['source-unesco-mohenjo-daro', 'source-green-indus-public-goods', 'source-natural-earth']
    },
    {
      id: 'mohenjo-daro-neighborhood-wells',
      title: '水井进入街区和住宅',
      eyebrow: '城市里的每日取水',
      timeSpan: timeSpan(-2600, -1900, '约公元前2600—前1900年', true), eventIds: ['event-indus-urban-transformation'],
      contentBlocks: [fact('mohenjo-daro-neighborhood-wells-fact', '每天，居民都要把水从砖井里提起，再搬进院落和房间。这样的井在城里发现了数百口，有些开在街边，有些紧靠住宅，让许多人不必走很远就能取水。水随后被带到铺砖的平台，用于洗浴、清洁和其他日常活动。一桶桶水在人与井之间移动，把供水变成了街区生活中反复上演的动作。', ['source-jansen-mohenjo-water'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-mohenjo-daro-well' },
      sourceIds: ['source-jansen-mohenjo-water', 'source-wikimedia-mohenjo-well']
    },
    {
      id: 'mohenjo-daro-water-leaves-home',
      title: '用过的水流出房屋',
      eyebrow: '住宅与街道之间',
      timeSpan: timeSpan(-2600, -1900, '约公元前2600—前1900年', true), eventIds: ['event-indus-urban-transformation'],
      contentBlocks: [synthesis('mohenjo-daro-water-leaves-home-synthesis', '水进了家门，也要离开。不少住宅里，人们在铺砖平台上洗身或用水，水从略有坡度的地面流进短渠，再进入渗水设施或街边砖沟。一户人家的日常用水，就这样穿过墙脚，汇入门外的街道。砖沟需要清理，出口需要疏通，住宅里的生活也因此同街区的共同维护连在了一起。', ['source-jansen-mohenjo-water', 'source-nakamura-mohenjo-drainage', 'source-green-indus-public-goods'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-mohenjo-daro-street' },
      sourceIds: ['source-jansen-mohenjo-water', 'source-nakamura-mohenjo-drainage', 'source-green-indus-public-goods', 'source-wikimedia-mohenjo-street']
    },
    {
      id: 'mohenjo-daro-great-bath',
      title: '大浴池留下功能空白',
      eyebrow: '城中较高的建筑区',
      timeSpan: timeSpan(-2600, -1900, '约公元前2600—前1900年', true), eventIds: ['event-indus-urban-transformation'],
      contentBlocks: [interpretation('mohenjo-daro-great-bath-interpretation', '沿着城中较高的区域行走，会遇到一座由砖墙围起的长方形水池。人可以从两端台阶走到池底，池壁经过防水处理，旁边还有供水和排水设施。建造者为它投入了大量材料与工夫，显然期待许多人长期使用。可是没有文字告诉我们，人们为何来到这里。池水的痕迹保存下来，当年的活动却消失了。', ['source-unesco-mohenjo-daro', 'source-jansen-mohenjo-water'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-mohenjo-daro-great-bath' },
      sourceIds: ['source-unesco-mohenjo-daro', 'source-jansen-mohenjo-water', 'source-wikimedia-mohenjo-great-bath']
    },
    {
      id: 'mohenjo-daro-unnamed-managers',
      title: '城市秩序没有留下管理者的名字',
      eyebrow: '长期维护与城市转型',
      timeSpan: timeSpan(-2600, -1800, '约公元前2600—前1800年', true), eventIds: ['event-indus-urban-transformation'],
      contentBlocks: [synthesis('mohenjo-daro-unnamed-managers-synthesis', '砖沟不会自己保持畅通，井壁和街面也不会自己修好。几代人在原有道路旁重建房屋，说明清理、修补和协调一直有人承担。工作可能从一户人家开始，也可能由整个街区共同完成；城市里却没有留下能够辨认的管理者。我们看得见秩序怎样运转，却看不见谁在发出命令。约公元前1900年后，大城逐渐收缩，这套生活秩序也随之改变。', ['source-green-priest-king', 'source-green-indus-public-goods', 'source-giosan-harappan-transformation'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-mohenjo-daro-overview' },
      sourceIds: ['source-green-priest-king', 'source-green-indus-public-goods', 'source-giosan-harappan-transformation', 'source-wikimedia-mohenjo-overview']
    },
    {
      id: 'indus-shared-measures',
      title: '多座城市共享一种尺度',
      eyebrow: '约公元前2600—1900年',
      timeSpan: timeSpan(-2600, -1900, '约公元前2600—前1900年', true), eventIds: ['event-indus-mesopotamia-exchange'],
      contentBlocks: [synthesis('indus-shared-measures-synthesis', '约四千五百年前，从海边到内陆，许多聚落相隔很远，却重复着相似的做法：工匠烧制比例相近的砖，人们用成套的小石块称量货物，雕刻者制作形状相似的印章。旅行者带着物品穿过平原和河道，也把技艺与习惯带进下一座城市。共同的尺度让陌生人可以建造、称量和交换，把分散的聚落连成一个广阔世界。', ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-kenoyer-harappan-measurement'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-indus-mature-network',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'mohenjo-daro', annotationId: 'annotation-mohenjo-daro-site-label', sourceIds: ['source-unesco-mohenjo-daro'] },
            { kind: 'entity', entityId: 'indus-civilization', annotationId: 'annotation-indus-major-cities-label', sourceIds: ['source-kenoyer-indus-civilisation'] }
          ],
          caption: '深色圆点表示成熟期主要城市的教学选点；文字标出摩亨佐-达罗与城市群的位置，点位不表示统一帝国边界。'
        }
      },
      sourceIds: ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-kenoyer-harappan-measurement', 'source-natural-earth']
    },
    {
      id: 'indus-seals-image-and-signs',
      title: '印章把图像和符号放在一起',
      eyebrow: '掌心大小的物件',
      timeSpan: timeSpan(-2600, -1900, '约公元前2600—前1900年', true), eventIds: ['event-indus-mesopotamia-exchange'],
      contentBlocks: [fact('indus-seals-image-and-signs-fact', '一枚印章只有掌心大小，正面常刻着一只动物，上方挤着几个细小符号，背面的圆钮可以握住或穿系。有人把印面压进湿泥，于是图像和符号留在封口或物品上。不同城市的人反复制作、携带和使用这些小物件，让它们进入货物与身份交会的时刻。印章保存了动作，却没有留下使用说明。', ['source-kenoyer-indus-seals', 'source-kenoyer-inscribed-objects', 'source-met-indus-unicorn-seal'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-indus-unicorn-seal' },
      sourceIds: ['source-kenoyer-indus-seals', 'source-kenoyer-inscribed-objects', 'source-met-indus-unicorn-seal']
    },
    {
      id: 'indus-short-unread-script',
      title: '短短的文字仍无法读懂',
      eyebrow: '数千条短铭文',
      timeSpan: timeSpan(-2600, -1900, '约公元前2600—前1900年', true), eventIds: ['event-indus-mesopotamia-exchange'],
      contentBlocks: [interpretation('indus-short-unread-script-interpretation', '最让人着迷的，是印章上那一小行符号。人们已经找到数千条铭文，可多数短得像标签，平均只有约五个符号。某些符号常出现在开头，另一些习惯留在末尾，说明排列遵循着某种规则。然而，没有双语对照，也没有长篇记录帮助猜词。直到今天，这些符号仍停在可以辨认、却无法阅读的边缘。', ['source-rao-indus-script', 'source-farmer-indus-script', 'source-parpola-indus-script'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-indus-unicorn-seal' },
      sourceIds: ['source-rao-indus-script', 'source-farmer-indus-script', 'source-parpola-indus-script', 'source-met-indus-unicorn-seal']
    },
    {
      id: 'indus-carnelian-goes-west',
      title: '红玉髓走向西方',
      eyebrow: '印度河与两河流域之间',
      timeSpan: timeSpan(-2900, -1900, '约公元前2900—前1900年', true), eventIds: ['event-indus-mesopotamia-exchange'],
      contentBlocks: [synthesis('indus-carnelian-goes-west-synthesis', '一颗红色珠子可以走得比大多数人更远。在两河流域的古城遗址里，人们发现了带有印度河工艺特征的红玉髓珠；检测石料，又把其中一些指向印度西部。工匠先把石料磨成长珠，再用特殊方法留下白色纹样。珠子随后穿过海岸和港口，有些还可能在异乡完成加工。一颗小珠子，就这样把石料、手艺和人的移动串在了一起。', ['source-kenoyer-kish-carnelian', 'source-met-indus-carnelian-bead'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-indus-carnelian-bead' },
      sourceIds: ['source-kenoyer-kish-carnelian', 'source-met-indus-carnelian-bead']
    },
    {
      id: 'indus-meluhha-ships',
      title: '梅鲁哈的船来到阿卡德',
      eyebrow: '海湾港口与远方船只',
      timeSpan: timeSpan(-2334, -2154, '约公元前2334—前2154年', true), eventIds: ['event-indus-mesopotamia-exchange'],
      contentBlocks: [synthesis('indus-meluhha-ships-synthesis', '一位两河国王命人把功绩刻进文字，夸耀来自梅鲁哈等远方的船停在自己的都城。这个遥远名字大概指向印度河一带。沿途岛屿和港口发现的印章，既有印度河的动物与符号，也带着当地人的做法。有人可能随船远行，更多货物则在港口换船、转手，再进入下一段航程。大海把几片文明连接成一条接力完成的贸易网络。', ['source-oracc-sargon-meluhha', 'source-possehl-indus-mesopotamia', 'source-bm-gulf-seal-ur', 'source-laursen-dilmun-seals'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-indus-western-exchange',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'indus-civilization', annotationId: 'annotation-indus-exchange-coast', sourceIds: ['source-possehl-indus-mesopotamia'] },
            { kind: 'entity', entityId: 'akkadian-empire', annotationId: 'annotation-indus-exchange-mesopotamia', sourceIds: ['source-oracc-sargon-meluhha'] }
          ],
          caption: '圆点依次标出印度河沿海、海湾中转节点与两河流域；棕色虚线表示可能的交换联系，不是精确航线。'
        }
      },
      sourceIds: ['source-oracc-sargon-meluhha', 'source-possehl-indus-mesopotamia', 'source-bm-gulf-seal-ur', 'source-laursen-dilmun-seals', 'source-natural-earth']
    },
    {
      id: 'indus-network-changes-shape',
      title: '城市网络改变了形状',
      eyebrow: '约公元前1900年以后',
      timeSpan: timeSpan(-2100, -1300, '约公元前2100—前1300年', true), eventIds: ['event-indus-urban-transformation'],
      contentBlocks: [synthesis('indus-network-changes-shape-synthesis', '约公元前1900年后，大城里的生活慢慢换了样子。宽阔街区不再像过去那样维持，常见的小印章和短铭文停止使用，越来越多人住进规模较小、彼此分散的聚落。河流改道、降雨变化和远方贸易的减弱，一起改变了生活的重心。印度河文明没有在某一天突然消失，而是从庞大的城市网络转入了各不相同的地方生活。', ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-giosan-harappan-transformation'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-indus-network-transformation',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'indus-civilization', annotationId: 'annotation-indus-mature-cities', sourceIds: ['source-kenoyer-indus-civilisation'] },
            { kind: 'entity', entityId: 'indus-civilization', annotationId: 'annotation-indus-later-settlements', sourceIds: ['source-giosan-harappan-transformation'] }
          ],
          caption: '深色圆点表示成熟期主要城市的教学选点；蓝灰色范围表示约公元前1900年后更分散的聚落重心，不是人口边界或迁徙路线。'
        }
      },
      sourceIds: ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-giosan-harappan-transformation', 'source-natural-earth']
    },
    {
      id: 'indo-aryan-cities-change-first',
      title: '大城市先改变了',
      eyebrow: '约公元前1900年以后',
      timeSpan: timeSpan(-1900, -1700, '约公元前1900—前1700年', true), eventIds: ['event-indus-urban-transformation'],
      contentBlocks: [fact('indo-aryan-cities-change-first-fact', '约公元前1900年后，摩亨佐-达罗、哈拉帕等大城市逐渐缩小。过去常见的标准化砝码、印章和短铭文越来越少，一些街道、排水设施和大型建筑不再按照原来的规模维护。河流与降雨发生变化，远方贸易减弱，城市生产和管理也随之调整。不同地区以不同速度离开旧有城市体系，印度河文明原本统一而醒目的城市面貌逐渐分散。', ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-giosan-harappan-transformation'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-mohenjo-daro-overview' },
      sourceIds: ['source-wright-ancient-indus', 'source-kenoyer-indus-civilisation', 'source-giosan-harappan-transformation', 'source-wikimedia-mohenjo-overview', 'source-unesco-mohenjo-daro']
    },
    {
      id: 'indo-aryan-local-settlements',
      title: '生活转入地方聚落',
      eyebrow: '旧城之外的新重心',
      timeSpan: timeSpan(-1900, -1300, '约公元前1900—前1300年', true), eventIds: ['event-indus-urban-transformation'],
      contentBlocks: [synthesis('indo-aryan-local-settlements-synthesis', '一些家庭留在缩小的旧城，另一些人迁往村落和区域中心。新的聚落更多分布在印度河支流、季节性河道与恒河上游方向。人们继续种植小麦、大麦和当地作物，也制作陶器、珠饰与金属工具。哈拉帕墓地H时期的彩绘陶器沿用制陶传统，又形成新的器形与纹样。过去依赖大城市连接的社会，转变成许多规模较小、联系更加地方化的社区。', ['source-wright-ancient-indus', 'source-giosan-harappan-transformation', 'source-singh-ancient-india', 'source-wikimedia-cemetery-h-pottery'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-cemetery-h-pottery' },
      sourceIds: ['source-wright-ancient-indus', 'source-giosan-harappan-transformation', 'source-singh-ancient-india', 'source-wikimedia-cemetery-h-pottery']
    },
    {
      id: 'indo-aryan-steppe-groups-move-south',
      title: '草原人群向南移动',
      eyebrow: '经过中亚与山口',
      timeSpan: timeSpan(-2000, -1500, '约公元前2000—前1500年', true), eventIds: ['event-steppe-related-ancestry-enters-south-asia'],
      contentBlocks: [interpretation('indo-aryan-steppe-groups-move-south-interpretation', '青铜时代晚期，欧亚草原上的一些牧民群体向中亚移动。他们饲养牛羊和马匹，使用车辆，也与中亚绿洲居民交换金属、牲畜和农产品。其中一部分人继续经过山口和河谷，进入南亚西北部。古代基因研究显示，公元前二千纪中叶以后，南亚人群中开始出现来自草原方向的新祖源。这些移动持续了许多代，沿途形成新的家庭、联盟与社区。', ['source-narasimhan-south-central-asia', 'source-singh-ancient-india'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-indo-aryan-migration',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'vedic-tradition', annotationId: 'annotation-indo-aryan-central-asia', sourceIds: ['source-narasimhan-south-central-asia'] },
            { kind: 'entity', entityId: 'vedic-tradition', annotationId: 'annotation-indo-aryan-northwest-entry', sourceIds: ['source-narasimhan-south-central-asia'] }
          ],
          caption: '虚线概括草原相关人群经过中亚与山口进入南亚西北部的长期移动方向，不表示一次行军或固定路线。'
        }
      },
      sourceIds: ['source-narasimhan-south-central-asia', 'source-singh-ancient-india', 'source-natural-earth']
    },
    {
      id: 'indo-aryan-language-enters-northwest',
      title: '印度—雅利安语进入西北部',
      eyebrow: '语言随着人群传播',
      timeSpan: timeSpan(-1700, -1200, '约公元前1700—前1200年', true), eventIds: ['event-steppe-related-ancestry-enters-south-asia'],
      contentBlocks: [synthesis('indo-aryan-language-enters-northwest-synthesis', '这些人群中的一部分说着早期印度—雅利安语。它属于印度—伊朗语支，后来发展出的梵语及许多南亚语言，都与它有历史联系。“雅利安”在这里指这组古代语言及使用它们的文化社群。马、牛群和轻轮战车在他们的社会中十分重要，首领通过宴饮、赠礼和战争召集追随者。语言随着这些人群进入南亚，也在与当地居民的长期交往中吸收新的词语和经验。', ['source-jamison-brereton-rigveda', 'source-narasimhan-south-central-asia', 'source-singh-ancient-india'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-indo-aryan-northwest',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'vedic-tradition', annotationId: 'annotation-indo-aryan-northwest-world', sourceIds: ['source-jamison-brereton-rigveda'] }
          ],
          caption: '橙色范围概括早期吠陀赞歌主要关联的南亚西北部河流世界，是教学范围而非政治边界。'
        }
      },
      sourceIds: ['source-jamison-brereton-rigveda', 'source-narasimhan-south-central-asia', 'source-singh-ancient-india', 'source-natural-earth']
    },
    {
      id: 'indo-aryan-poets-sing-rivers-fire',
      title: '诗人歌唱河流与祭火',
      eyebrow: '《梨俱吠陀》的口传世界',
      timeSpan: timeSpan(-1500, -1000, '约公元前1500—前1000年', true), eventIds: ['event-rigveda-composed-transmitted'],
      contentBlocks: [fact('indo-aryan-poets-sing-rivers-fire-fact', '诗人在祭火旁创作赞歌，用早期吠陀梵语歌颂神灵、首领和祖先。他们吟唱印度河支流与旁遮普的河流，也歌唱牛群、战车、饮宴、联盟和战斗。这些赞歌由祭司家族记忆和传诵，后来被整理为《梨俱吠陀》。诗歌中的雷神因陀罗帮助战士取得胜利，火神阿耆尼把祭品带给诸神。语言、祭火和吟诵共同维系着早期吠陀社群。', ['source-jamison-brereton-rigveda', 'source-oxford-vedic-oral-tradition', 'source-cambridge-veda-before-print'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-vedic-recitation-teaching' },
      sourceIds: ['source-jamison-brereton-rigveda', 'source-oxford-vedic-oral-tradition', 'source-cambridge-veda-before-print', 'source-generated-vedic-recitation']
    },
    {
      id: 'indo-aryan-new-society-forms',
      title: '相遇形成新的社会',
      eyebrow: '早期吠陀世界',
      timeSpan: timeSpan(-1500, -1000, '约公元前1500—前1000年', true), eventIds: ['event-steppe-related-ancestry-enters-south-asia', 'event-rigveda-composed-transmitted'],
      contentBlocks: [synthesis('indo-aryan-new-society-forms-synthesis', '进入南亚的人群与当地居民共同生活。家庭通过婚姻连接，牧民学习当地农业，地方居民也参与新的联盟、宴饮和祭祀。语言、作物、神灵和仪式在交往中不断改变。几代之后，新的社会已经同时包含印度河文明之后的地方传统、中亚方向带来的语言文化，以及南亚各地区自己的生活经验。早期吠陀世界由这些相遇逐渐形成，并继续向恒河上游扩展。', ['source-narasimhan-south-central-asia', 'source-jamison-brereton-rigveda', 'source-singh-ancient-india'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-indo-aryan-synthesis',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'vedic-tradition', annotationId: 'annotation-indo-aryan-local-continuities', sourceIds: ['source-giosan-harappan-transformation', 'source-jamison-brereton-rigveda', 'source-singh-ancient-india'] },
            { kind: 'entity', entityId: 'vedic-tradition', annotationId: 'annotation-indo-aryan-upper-ganges', sourceIds: ['source-singh-ancient-india'] }
          ],
          caption: '阴影概括南亚西北部多种传统相遇的区域；线从旁遮普方向伸向恒河上游，表示早期吠陀世界随后向东扩展。'
        }
      },
      sourceIds: ['source-narasimhan-south-central-asia', 'source-jamison-brereton-rigveda', 'source-singh-ancient-india', 'source-giosan-harappan-transformation', 'source-natural-earth']
    }
  ];

  const navigationOptions = [
    {
      id: 'nav-mohenjo-daro-indus-civilization',
      target: { cardId: 'indus-civilization-network', sceneId: 'indus-shared-measures' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-mohenjo-daro-indus-civilization' },
      label: '进入更大的印度河世界',
      description: '从一座城市的生活细节，进入多座城市、文字与远距离交换组成的文明网络。'
    },
    {
      id: 'nav-indus-civilization-mohenjo-daro',
      target: { cardId: 'mohenjo-daro-urban-order', sceneId: 'mohenjo-daro-neighborhood-wells' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-mohenjo-daro-indus-civilization' },
      label: '进入摩亨佐-达罗',
      description: '从广阔文明网络进入一座城市，跟随水井、住宅和街道观察居民生活。'
    },
    {
      id: 'nav-indus-akkadian-empire',
      target: { cardId: 'akkadian-empire-overview', sceneId: 'akkadian-empire-conquests' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-indus-akkadian-exchange' },
      label: '进入记下梅鲁哈的阿卡德王朝',
      description: '从抵达西亚的船只，进入把梅鲁哈写进王室功绩的阿卡德王朝。'
    },
    {
      id: 'nav-indus-indo-aryan',
      target: { cardId: 'indo-aryan-enters-south-asia', sceneId: 'indo-aryan-cities-change-first' },
      basis: { kind: 'event', eventId: 'event-indus-urban-transformation' },
      label: '继续走进城市之后的南亚',
      description: '从印度河大城市的转型，进入地方聚落、人口移动与早期吠陀语言共同形成的新世界。'
    },
    {
      id: 'nav-indo-aryan-indus',
      target: { cardId: 'indus-civilization-network', sceneId: 'indus-network-changes-shape' },
      basis: { kind: 'event', eventId: 'event-indus-urban-transformation' },
      label: '追踪印度河城市网络的变化',
      description: '从早期吠陀世界的开端，进入此前连接多座大城市、印章与远方贸易的印度河网络。'
    }
  ];

  const navigationPlacements = [
    { id: 'placement-mohenjo-daro-indus-closing', navigationOptionId: 'nav-mohenjo-daro-indus-civilization', owner: { kind: 'card', cardId: 'mohenjo-daro-urban-order' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-indus-mohenjo-daro-inline', navigationOptionId: 'nav-indus-civilization-mohenjo-daro', owner: { kind: 'scene', sceneId: 'indus-shared-measures' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-indus-akkadian-inline', navigationOptionId: 'nav-indus-akkadian-empire', owner: { kind: 'scene', sceneId: 'indus-meluhha-ships' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-indus-indo-aryan-closing', navigationOptionId: 'nav-indus-indo-aryan', owner: { kind: 'scene', sceneId: 'indus-network-changes-shape' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-indo-aryan-indus-inline', navigationOptionId: 'nav-indo-aryan-indus', owner: { kind: 'scene', sceneId: 'indo-aryan-cities-change-first' }, slot: 'inline', rank: 1, visible: true, interactive: true }
  ];

  const cameraPresets = [
    { id: 'camera-mohenjo-daro-site', center: [68.132872, 27.325358], scale: 10 },
    { id: 'camera-indus-mature-network', center: [72.6, 27.2], scale: 4.6 },
    { id: 'camera-indus-western-exchange', center: [58.5, 27.5], scale: 5.2 },
    { id: 'camera-indus-network-transformation', center: [74.2, 28], scale: 4.4 },
    { id: 'camera-indo-aryan-migration', center: [69, 36], scale: 2.6 },
    { id: 'camera-indo-aryan-northwest', center: [73.5, 29.5], scale: 4.8 },
    { id: 'camera-indo-aryan-synthesis', center: [76.3, 29], scale: 3.7 }
  ];

  const geometries = [
    {
      id: 'geometry-mohenjo-daro-site',
      geometry: { type: 'Point', coordinates: [68.132872, 27.325358] },
      timeSpan: timeSpan(-2600, -1900, '印度河文明成熟期', true),
      approximate: false,
      label: '摩亨佐-达罗遗址',
      sourceIds: ['source-unesco-mohenjo-daro']
    },
    {
      id: 'geometry-indus-major-settlements',
      geometry: { type: 'MultiPoint', coordinates: [[68.13, 27.33], [72.87, 30.63], [70.22, 23.89], [76.12, 29.29], [72.25, 22.52]] },
      timeSpan: timeSpan(-2600, -1900, '成熟期主要城市教学选点', true),
      approximate: true,
      label: '摩亨佐-达罗、哈拉帕及其他主要城市（教学选点）',
      sourceIds: ['source-kenoyer-indus-civilisation', 'source-natural-earth']
    },
    {
      id: 'geometry-indus-western-exchange',
      geometry: { type: 'MultiLineString', coordinates: [[[67.5, 24], [58.5, 24], [50.55, 26], [47.5, 30.8]], [[67.5, 24], [57.5, 24], [50.55, 26]]] },
      timeSpan: timeSpan(-2600, -1900, '印度河、海湾与两河流域之间的教学联系', true),
      approximate: true,
      label: '印度河—海湾—两河流域联系（近似，非精确航线）',
      sourceIds: ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur', 'source-natural-earth']
    },
    {
      id: 'geometry-indus-western-exchange-nodes',
      geometry: { type: 'MultiPoint', coordinates: [[67.5, 24], [50.55, 26], [47.5, 30.8]] },
      timeSpan: timeSpan(-2600, -1900, '印度河沿海、海湾与两河流域的教学选点', true),
      approximate: true,
      label: '印度河沿海、海湾中转节点与两河流域（近似教学选点）',
      sourceIds: ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur', 'source-natural-earth']
    },
    {
      id: 'geometry-indus-post-urban-focus',
      geometry: { type: 'Polygon', coordinates: [[[70.5, 31.5], [77.5, 32], [80, 28], [77, 24], [72, 24], [70, 28], [70.5, 31.5]]] },
      timeSpan: timeSpan(-1900, -1300, '城市转型以后较分散的聚落重心教学范围', true),
      approximate: true,
      label: '公元前1900年后聚落重心教学范围（近似）',
      sourceIds: ['source-giosan-harappan-transformation', 'source-natural-earth']
    },
    {
      id: 'geometry-indo-aryan-migration',
      geometry: { type: 'MultiLineString', coordinates: [[[58, 48], [62, 43], [66, 38], [70, 34], [73, 30]]] },
      timeSpan: timeSpan(-2000, -1500, '草原相关人群经中亚进入南亚的长期移动方向', true),
      approximate: true,
      label: '草原—中亚—南亚西北部移动方向（近似教学线）',
      sourceIds: ['source-narasimhan-south-central-asia', 'source-natural-earth']
    },
    {
      id: 'geometry-indo-aryan-northwest-world',
      geometry: { type: 'Polygon', coordinates: [[[69.5, 33], [76.5, 33], [79, 29], [77.5, 25], [71, 26], [69.5, 33]]] },
      timeSpan: timeSpan(-1500, -1000, '早期吠陀赞歌主要关联的南亚西北部教学范围', true),
      approximate: true,
      label: '早期吠陀河流世界（近似教学范围）',
      sourceIds: ['source-jamison-brereton-rigveda', 'source-natural-earth']
    },
    {
      id: 'geometry-indo-aryan-upper-ganges-extension',
      geometry: { type: 'LineString', coordinates: [[75, 29.4], [78, 28.6], [81.5, 27.7]] },
      timeSpan: timeSpan(-1400, -1000, '早期吠陀社群向恒河上游扩展的教学方向', true),
      approximate: true,
      label: '从南亚西北部向恒河上游扩展（近似教学线）',
      sourceIds: ['source-singh-ancient-india', 'source-natural-earth']
    }
  ];

  const mapStates = [
    {
      id: 'map-mohenjo-daro-site',
      cameraPresetId: 'camera-mohenjo-daro-site',
      layers: [{ kind: 'geometry', geometryId: 'geometry-mohenjo-daro-site', timeSpan: timeSpan(-2600, -1900, '印度河文明成熟期', true), sourceIds: ['source-unesco-mohenjo-daro', 'source-natural-earth'] }]
    },
    {
      id: 'map-indus-mature-network',
      cameraPresetId: 'camera-indus-mature-network',
      layers: [{ kind: 'geometry', geometryId: 'geometry-indus-major-settlements', timeSpan: timeSpan(-2600, -1900, '成熟期主要城市教学选点', true), sourceIds: ['source-kenoyer-indus-civilisation', 'source-natural-earth'] }]
    },
    {
      id: 'map-indus-western-exchange',
      cameraPresetId: 'camera-indus-western-exchange',
      layers: [
        { kind: 'geometry', geometryId: 'geometry-indus-western-exchange', timeSpan: timeSpan(-2600, -1900, '印度河、海湾与两河流域之间的教学联系', true), sourceIds: ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur', 'source-natural-earth'] },
        { kind: 'geometry', geometryId: 'geometry-indus-western-exchange-nodes', timeSpan: timeSpan(-2600, -1900, '印度河沿海、海湾与两河流域的教学选点', true), sourceIds: ['source-possehl-indus-mesopotamia', 'source-oracc-sargon-meluhha', 'source-bm-gulf-seal-ur', 'source-natural-earth'] }
      ]
    },
    {
      id: 'map-indus-network-transformation',
      cameraPresetId: 'camera-indus-network-transformation',
      layers: [
        { kind: 'geometry', geometryId: 'geometry-indus-major-settlements', timeSpan: timeSpan(-2100, -1900, '成熟期城市网络末段', true), sourceIds: ['source-kenoyer-indus-civilisation', 'source-natural-earth'] },
        { kind: 'geometry', geometryId: 'geometry-indus-post-urban-focus', timeSpan: timeSpan(-1900, -1300, '城市转型后的教学范围', true), sourceIds: ['source-giosan-harappan-transformation', 'source-natural-earth'] }
      ]
    },
    {
      id: 'map-indo-aryan-migration',
      cameraPresetId: 'camera-indo-aryan-migration',
      layers: [
        { kind: 'geometry', geometryId: 'geometry-indo-aryan-migration', timeSpan: timeSpan(-2000, -1500, '草原相关人群向南亚移动', true), sourceIds: ['source-narasimhan-south-central-asia', 'source-natural-earth'] }
      ]
    },
    {
      id: 'map-indo-aryan-northwest',
      cameraPresetId: 'camera-indo-aryan-northwest',
      layers: [
        { kind: 'geometry', geometryId: 'geometry-indo-aryan-northwest-world', timeSpan: timeSpan(-1500, -1000, '早期吠陀河流世界', true), sourceIds: ['source-jamison-brereton-rigveda', 'source-natural-earth'] }
      ]
    },
    {
      id: 'map-indo-aryan-synthesis',
      cameraPresetId: 'camera-indo-aryan-synthesis',
      layers: [
        { kind: 'geometry', geometryId: 'geometry-indo-aryan-northwest-world', timeSpan: timeSpan(-1500, -1000, '多种传统相遇的南亚西北部', true), sourceIds: ['source-giosan-harappan-transformation', 'source-jamison-brereton-rigveda', 'source-singh-ancient-india', 'source-natural-earth'] },
        { kind: 'geometry', geometryId: 'geometry-indo-aryan-upper-ganges-extension', timeSpan: timeSpan(-1400, -1000, '向恒河上游扩展', true), sourceIds: ['source-singh-ancient-india', 'source-natural-earth'] }
      ]
    }
  ];

  const mapAnnotations = [
    {
      id: 'annotation-mohenjo-daro-site-label',
      subject: { kind: 'entity', entityId: 'mohenjo-daro' },
      anchor: { kind: 'geo', coordinates: [68.132872, 27.325358] },
      anchorMeaning: 'locatedAt',
      approximate: false,
      sourceIds: ['source-unesco-mohenjo-daro'],
      placement: 'left',
      label: '摩亨佐-达罗'
    },
    {
      id: 'annotation-indus-major-cities-label',
      subject: { kind: 'entity', entityId: 'indus-civilization' },
      anchor: { kind: 'geo', coordinates: [74.4, 27.2] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-kenoyer-indus-civilisation'],
      placement: 'right',
      label: '成熟期主要城市'
    },
    {
      id: 'annotation-indus-exchange-coast',
      subject: { kind: 'entity', entityId: 'indus-civilization' },
      anchor: { kind: 'geo', coordinates: [67.5, 24] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-possehl-indus-mesopotamia'],
      placement: 'above',
      label: '印度河沿海'
    },
    {
      id: 'annotation-indus-exchange-mesopotamia',
      subject: { kind: 'entity', entityId: 'akkadian-empire' },
      anchor: { kind: 'geo', coordinates: [47.5, 30.8] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-oracc-sargon-meluhha'],
      placement: 'above',
      label: '两河流域'
    },
    {
      id: 'annotation-indus-mature-cities',
      subject: { kind: 'entity', entityId: 'indus-civilization' },
      anchor: { kind: 'geo', coordinates: [69.4, 27.2] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-kenoyer-indus-civilisation'],
      placement: 'left',
      label: '成熟期主要城市'
    },
    {
      id: 'annotation-indus-later-settlements',
      subject: { kind: 'entity', entityId: 'indus-civilization' },
      anchor: { kind: 'geo', coordinates: [76.2, 28.2] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-giosan-harappan-transformation'],
      placement: 'right',
      label: '后期聚落重心'
    },
    {
      id: 'annotation-indo-aryan-central-asia',
      subject: { kind: 'entity', entityId: 'vedic-tradition' },
      anchor: { kind: 'geo', coordinates: [63, 41] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-narasimhan-south-central-asia'],
      placement: 'above',
      label: '经过中亚'
    },
    {
      id: 'annotation-indo-aryan-northwest-entry',
      subject: { kind: 'entity', entityId: 'vedic-tradition' },
      anchor: { kind: 'geo', coordinates: [73, 30] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-narasimhan-south-central-asia'],
      placement: 'right',
      label: '进入南亚西北部'
    },
    {
      id: 'annotation-indo-aryan-northwest-world',
      subject: { kind: 'entity', entityId: 'vedic-tradition' },
      anchor: { kind: 'geo', coordinates: [74.5, 29.5] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-jamison-brereton-rigveda'],
      placement: 'above',
      label: '早期吠陀河流世界'
    },
    {
      id: 'annotation-indo-aryan-local-continuities',
      subject: { kind: 'entity', entityId: 'vedic-tradition' },
      anchor: { kind: 'geo', coordinates: [74, 30.3] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-giosan-harappan-transformation', 'source-jamison-brereton-rigveda', 'source-singh-ancient-india'],
      placement: 'above',
      label: '南亚西北部：多种传统相遇'
    },
    {
      id: 'annotation-indo-aryan-upper-ganges',
      subject: { kind: 'entity', entityId: 'vedic-tradition' },
      anchor: { kind: 'geo', coordinates: [81.5, 27.7] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-singh-ancient-india'],
      placement: 'below',
      label: '恒河上游'
    }
  ];

  const assets = [
    { id: 'asset-mohenjo-daro-well', type: 'image', src: 'assets/images/ancient-india/mohenjo-daro-well.webp', title: '摩亨佐-达罗砖砌水井', alt: '摩亨佐-达罗遗址中的圆形砖砌水井俯视照片，井口由多层弧形砖围成。', sourceIds: ['source-wikimedia-mohenjo-well', 'source-jansen-mohenjo-water'] },
    { id: 'asset-mohenjo-daro-street', type: 'image', src: 'assets/images/ancient-india/mohenjo-daro-street.webp', title: '摩亨佐-达罗的街道与砖墙', alt: '摩亨佐-达罗遗址中的狭长街道，两侧保留高低不一的砖砌住宅墙体。', sourceIds: ['source-wikimedia-mohenjo-street', 'source-green-indus-public-goods'] },
    { id: 'asset-mohenjo-daro-great-bath', type: 'image', src: 'assets/images/ancient-india/mohenjo-daro-great-bath.webp', title: '摩亨佐-达罗大浴池', alt: '摩亨佐-达罗大浴池完整全景，长方形砖池、两端台阶和周边砖墙清晰可见。', sourceIds: ['source-wikimedia-mohenjo-great-bath', 'source-unesco-mohenjo-daro', 'source-jansen-mohenjo-water'] },
    { id: 'asset-mohenjo-daro-overview', type: 'image', src: 'assets/images/ancient-india/mohenjo-daro-overview.webp', title: '摩亨佐-达罗已发掘遗址', alt: '摩亨佐-达罗已发掘遗址全景，前景是大浴池与周边砖墙，远处可见层叠建筑遗迹和后建佛塔。', sourceIds: ['source-wikimedia-mohenjo-overview', 'source-unesco-mohenjo-daro'] },
    { id: 'asset-cemetery-h-pottery', type: 'image', src: 'assets/images/ancient-india/cemetery-h-pottery.webp', title: '哈拉帕墓地H时期彩绘陶器', alt: '新德里国家博物馆陈列的两件哈拉帕墓地H时期大型彩绘陶罐，罐肩可见动物、植物与几何纹样。', sourceIds: ['source-wikimedia-cemetery-h-pottery'] },
    { id: 'asset-indus-unicorn-seal', type: 'image', src: 'assets/images/ancient-india/indus-unicorn-seal.webp', title: '独角兽印章与现代压印', alt: '一枚带短行符号和独角兽图像的印度河印章与它的现代压印并列展示。', sourceIds: ['source-met-indus-unicorn-seal', 'source-kenoyer-indus-seals'] },
    { id: 'asset-indus-carnelian-bead', type: 'image', src: 'assets/images/ancient-india/indus-carnelian-bead.webp', title: '两河流域出土的印度河文化红玉髓珠', alt: '一颗桶形红玉髓珠的完整正面照片，红褐色表面分布着多组白色圆环纹样。', sourceIds: ['source-met-indus-carnelian-bead', 'source-kenoyer-kish-carnelian'] },
    { id: 'asset-vedic-recitation-teaching', type: 'image', src: 'assets/images/ancient-india/vedic-recitation-teaching.webp', title: '祭火旁的早期吠陀吟诵教学图', alt: '教学插图：夜色中的河岸营地，吟诵者与听众围坐在小型祭火旁，远处可见牛群和轻轮车辆；画面不含现代文字。', sourceIds: ['source-generated-vedic-recitation', 'source-jamison-brereton-rigveda'] }
  ];

  return {
    sources,
    entities,
    events,
    structuralEdges,
    cards,
    scenes,
    structureViews: [],
    navigationOptions,
    navigationPlacements,
    cameraPresets,
    mapStates,
    geometries,
    mapAnnotations,
    assets
  };
}));
