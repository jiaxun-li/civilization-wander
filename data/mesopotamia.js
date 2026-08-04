(function exposeSumerV4(root, factory) {
  const data = factory();
  if (root) root.ATLAS_V4_SUMER = data;
  if (typeof module === 'object' && module.exports) module.exports = data;
}(typeof window !== 'undefined' ? window : globalThis, function createSumerV4Data() {
  'use strict';

  function timeSpan(start, end, label, approximate) {
    const value = { start, end, label };
    if (approximate) value.approximate = true;
    if (start === null) delete value.start;
    if (end === null) delete value.end;
    return value;
  }

  function interpretation(id, text, sourceIds) {
    return { id, kind: 'interpretation', text, sourceIds };
  }

  function fact(id, text, sourceIds) {
    return { id, kind: 'historicalFact', text, sourceIds };
  }

  function synthesis(id, text, sourceIds) {
    return { id, kind: 'editorialSynthesis', text, sourceIds };
  }

  function limitation(id, text, sourceIds) {
    return { id, kind: 'limitation', text, sourceIds };
  }

  const sources = [
    {
      id: 'source-getty-uruk',
      title: 'Uruk: First City of the Ancient World',
      author: 'Nicola Crüsemann et al., eds.',
      year: 2019,
      publisher: 'J. Paul Getty Museum',
      url: 'https://books.google.com/books/about/Uruk.html?id=muCvDwAAQBAJ'
    },
    {
      id: 'source-mcmahon-early-urbanism',
      title: 'Early Urbanism in Northern Mesopotamia',
      author: 'Augusta McMahon',
      year: 2020,
      publisher: 'Journal of Archaeological Research',
      url: 'https://link.springer.com/article/10.1007/s10814-019-09136-7'
    },
    {
      id: 'source-adams-heartland-cities',
      title: 'Heartland of Cities: Surveys of Ancient Settlement and Land Use on the Central Floodplain of the Euphrates',
      author: 'Robert McC. Adams',
      year: 1981,
      publisher: 'Oriental Institute of the University of Chicago',
      url: 'https://isac.uchicago.edu/research/publications/misc/heartland-cities-surveys-ancient-settlement-and-land-use-central'
    },
    {
      id: 'source-englund-proto-cuneiform',
      title: 'Proto-Cuneiform Account-Books and Journals',
      author: 'Robert K. Englund',
      year: 2004,
      publisher: 'Cuneiform Digital Library Initiative',
      url: 'https://cdli.mpiwg-berlin.mpg.de/files-up/publications/englund2004a.pdf'
    },
    {
      id: 'source-met-origins-writing',
      title: 'The Origins of Writing',
      author: 'Ira Spar',
      year: 2004,
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/essays/the-origins-of-writing'
    },
    {
      id: 'source-met-uruk-first-city',
      title: 'Uruk: The First City',
      year: 2003,
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/essays/uruk-the-first-city'
    },
    {
      id: 'source-pollock-household-production',
      title: 'Household Production at the Uruk Mound, Abu Salabikh, Iraq',
      author: 'Susan Pollock, Melody Pope, and Cheryl Coursey',
      year: 1996,
      publisher: 'American Journal of Archaeology',
      url: 'https://www.journals.uchicago.edu/doi/10.2307/506673'
    },
    {
      id: 'source-dai-uruk',
      title: 'Uruk (Warka)',
      author: 'German Archaeological Institute',
      publisher: 'German Archaeological Institute',
      url: 'https://www.dainst.org/forschung/projekte/noslug/2604'
    },
    {
      id: 'source-wikimedia-uruk-white-temple-ziggurat',
      title: 'White Temple Ziggurat in Uruk, CC BY-SA 2.0 photograph',
      author: 'tobeytravels',
      year: 2020,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:White_Temple_ziggurat_in_Uruk.jpg'
    },
    {
      id: 'source-met-grain-tablet',
      title: 'Cuneiform tablet: administrative account concerning the distribution of barley and emmer',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/327384'
    },
    {
      id: 'source-met-uruk-cylinder-seal',
      title: 'Cylinder seal and modern impression: ritual scene before a temple facade',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/326721'
    },
    {
      id: 'source-british-museum-bevelled-rim-bowl',
      title: 'Bevelled-rim bowl from Uruk',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/collection/object/W_1919-1011-513'
    },
    {
      id: 'source-unesco-uruk-location',
      title: 'The Ahwar of Southern Iraq: supplemental information and location of Uruk',
      publisher: 'UNESCO World Heritage Centre',
      url: 'https://whc.unesco.org/document/169033'
    },
    {
      id: 'source-met-late-uruk-mosaic-cone',
      title: 'Mosaic cone, Late Uruk, ca. 3500–3100 BCE',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/325523'
    },
    {
      id: 'source-wikimedia-bevelled-rim-bowl-photo',
      title: 'Bevelled-rim bowl from Nineveh, Late Uruk period, CC0 photograph',
      author: 'Vassil',
      year: 2019,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:British_Museum_Middle_east_14022019_Beveled_rim_bowl_Nineveh_Late_Uruk_Period_3672.jpg'
    },
    {
      id: 'source-wikimedia-warka-vase-360',
      title: 'Warka Vase, four-view CC BY-SA 4.0 photograph',
      author: 'Osama Shukir Muhammed Amin',
      year: 2019,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Warka_vase_(360).jpg'
    },
    {
      id: 'source-isac-irrigation-southern-mesopotamia',
      title: 'The Organization of Irrigated Agriculture in Southern Mesopotamia',
      author: 'Stephanie Rost',
      publisher: 'Institute for the Study of Ancient Cultures, University of Chicago',
      url: 'https://isac.uchicago.edu/article/lecture-stephanie-rost-organization-irrigated-agriculture-southern-mesopotamia'
    },
    {
      id: 'source-proust-mesopotamian-mathematics',
      title: 'Numerical and Metrological Graphemes: From Cuneiform to Transliteration',
      author: 'Christine Proust',
      year: 2009,
      publisher: 'Cuneiform Digital Library Journal',
      url: 'https://cdli.earth/articles/cdlj/2009-1'
    },
    {
      id: 'source-firth-sumerian-calendars',
      title: 'Sumerian Calendars and Calendar Reform in the Ur III Period',
      author: 'Richard Firth',
      year: 2016,
      publisher: 'Cuneiform Digital Library Journal',
      url: 'https://cdli.earth/articles/cdlj/2016-1.pdf'
    },
    {
      id: 'source-met-ushumgal-stele',
      title: 'Stele of Ushumgal and Shara-igizi-Abzu',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/329079'
    },
    {
      id: 'source-morgan-warka-vase',
      title: 'Plaster Cast of the Uruk Vase',
      publisher: 'The Morgan Library & Museum',
      url: 'https://www.themorgan.org/exhibitions/online/she-who-wrote/uruk-vase'
    },
    {
      id: 'source-smarthistory-warka-vase',
      title: 'Warka Vase',
      publisher: 'Smarthistory',
      url: 'https://smarthistory.org/warka-vase/'
    }
  ];

  const entities = [
    {
      id: 'sumer',
      type: 'culturalTradition',
      name: '苏美尔文明',
      alternativeNames: ['Sumer', 'Sumerian civilization'],
      canonicalSummary: '约公元前3500—前2000年，形成于南部美索不达米亚城市世界，以苏美尔语及相关书写、计量、历法、神庙与城市传统为重要特征的古代文明。',
      timeSpan: timeSpan(-3500, -2000, '约公元前3500—前2000年', true),
      defaultCardId: 'sumer-measuring-land-time',
      tags: ['西亚', '文化传统', '苏美尔'],
      sourceIds: ['source-adams-heartland-cities', 'source-met-origins-writing', 'source-proust-mesopotamian-mathematics']
    },
    {
      id: 'uruk',
      type: 'SettlementSite',
      name: '乌鲁克',
      alternativeNames: ['Uruk', 'Erech'],
      canonicalSummary: '位于今天伊拉克南部的古代聚落遗址；公元前四千纪后期，人口集中、公共建筑、物资管理与早期书写在这里留下了丰富证据。',
      timeSpan: timeSpan(-3500, -2000, '约公元前3500—前2000年', true),
      defaultCardId: 'sumer-uruk-city',
      tags: ['西亚', '聚落遗址', '早期城市'],
      sourceIds: ['source-getty-uruk', 'source-met-uruk-first-city']
    }
  ];

  const cards = [
    {
      id: 'sumer-measuring-land-time',
      kind: 'overview',
      primaryEntityId: 'sumer',
      relatedEntityIds: ['uruk', 'cuneiform', 'akkadian-empire', 'ur-iii-kingdom'],
      eventIds: [],
      title: '苏美尔人测量土地与时间',
      editorialPurpose: '水渠、土地、泥板、数字和月相怎样逐渐成为苏美尔城市组织物质与时间的方法？',
      introduction: '一条水渠、一块泥板和一轮新月，看起来毫不相干。苏美尔城市却把它们放进了同一个世界：河水要送进田地，土地要划定边界，谷物和劳作要留下记录，月份也要跟上季节。',
      thesis: {
        text: '苏美尔文明并非依靠某一项突然出现的发明。南部城市长期经营水道、田地和粮食，由此发展出不同的计量方法；数字进入泥板以后，数量与时间逐渐能够跨越个人记忆。王朝不断更替，这些方法却被阿卡德和乌尔第三王朝继续使用与改造。',
        sourceIds: ['source-adams-heartland-cities', 'source-met-origins-writing', 'source-proust-mesopotamian-mathematics', 'source-firth-sumerian-calendars']
      },
      timeSpan: timeSpan(-3500, -2000, '约公元前3500—前2000年', true),
      sceneIds: [
        'sumer-water-network',
        'sumer-land-measurement',
        'sumer-clay-records',
        'sumer-sixty-and-moon',
        'sumer-methods-outlast-dynasties'
      ],
      sourceIds: [
        'source-adams-heartland-cities',
        'source-isac-irrigation-southern-mesopotamia',
        'source-met-origins-writing',
        'source-proust-mesopotamian-mathematics',
        'source-firth-sumerian-calendars',
        'source-met-ushumgal-stele',
        'source-met-ur-iii-dugga-account'
      ],
      editorialReview: {
        limitations: [
          limitation('sumer-review-regional-variety', '苏美尔文明由多个城市传统构成，灌溉、计量和历法并非处处相同。', ['source-adams-heartland-cities', 'source-firth-sumerian-calendars'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('sumer-review-language', '晚期乌鲁克原始楔形文字与苏美尔语的对应仍不能完全确定。', ['source-englund-proto-cuneiform', 'source-met-origins-writing']),
          interpretation('sumer-review-number-systems', '早期数字系统随计量对象而变化，六十进制结构形成的过程不能压缩成一次发明。', ['source-proust-mesopotamian-mathematics'])
        ],
        alternativeExplanations: [
          interpretation('sumer-review-irrigation-causes', '灌溉协作是南部城市生活的重要条件，但城市与国家形成还涉及人口、交换、仪式和政治竞争。', ['source-adams-heartland-cities', 'source-isac-irrigation-southern-mesopotamia'])
        ],
        sourceIds: ['source-adams-heartland-cities', 'source-isac-irrigation-southern-mesopotamia', 'source-englund-proto-cuneiform', 'source-proust-mesopotamian-mathematics', 'source-firth-sumerian-calendars']
      }
    },
    {
      id: 'sumer-uruk-city',
      kind: 'overview',
      primaryEntityId: 'uruk',
      relatedEntityIds: ['sumer'],
      eventIds: [],
      title: '城市的诞生',
      editorialPurpose: '人口集中以后，乌鲁克怎样组织食物、公共建筑和大量陌生人的共同生活？',
      introduction: '越来越多的人进入同一座城市以后，食物、劳动、公共空间和彼此陌生的生活都必须重新组织。',
      thesis: {
        text: '乌鲁克的成长不仅表现为人口和房屋增加。城市需要从周围土地持续获得食物，投入大量劳动修建公共中心，并让农民、搬运者、工匠、仪式人员和管理者共同生活。',
        sourceIds: ['source-getty-uruk', 'source-adams-heartland-cities', 'source-met-uruk-first-city']
      },
      timeSpan: timeSpan(-3500, -3000, '约公元前3500—前3000年', true),
      sceneIds: [
        'sumer-uruk-gathering',
        'sumer-uruk-feeding',
        'sumer-uruk-public-center',
        'sumer-uruk-strangers'
      ],
      sourceIds: ['source-getty-uruk', 'source-mcmahon-early-urbanism', 'source-adams-heartland-cities', 'source-met-uruk-first-city', 'source-morgan-warka-vase', 'source-smarthistory-warka-vase'],
      editorialReview: {
        limitations: [
          limitation('sumer-uruk-review-survival', '现存证据偏向大型建筑、行政器物和保存下来的泥板；普通居民的家庭生活、迁居原因和个人经验更难复原。', ['source-getty-uruk', 'source-pollock-household-production']),
          limitation('sumer-uruk-review-excavation', '已发掘部分不能代表整座乌鲁克。', ['source-dai-uruk'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('sumer-uruk-review-population', '乌鲁克的精确人口以及人口集中的主要原因仍不确定。', ['source-getty-uruk', 'source-mcmahon-early-urbanism']),
          interpretation('sumer-uruk-review-buildings', '晚期乌鲁克大型建筑的具体功能不能全部确定。', ['source-dai-uruk', 'source-met-uruk-first-city']),
          interpretation('sumer-uruk-review-vase', '乌鲁克瓶呈现的是仪式化秩序，而不是城市日常生活的客观全景。', ['source-morgan-warka-vase', 'source-smarthistory-warka-vase'])
        ],
        alternativeExplanations: [
          interpretation('sumer-uruk-review-causes', '城市成长可能同时涉及人口迁移、区域交换、农业条件、公共仪式、制度吸引、政治竞争和家庭选择。', ['source-getty-uruk', 'source-mcmahon-early-urbanism', 'source-adams-heartland-cities'])
        ],
        sourceIds: ['source-getty-uruk', 'source-mcmahon-early-urbanism', 'source-pollock-household-production', 'source-dai-uruk', 'source-morgan-warka-vase', 'source-smarthistory-warka-vase']
      }
    }
  ];

  const scenes = [
    {
      id: 'sumer-water-network',
      title: '水渠把城市连在一起',
      eyebrow: '南部美索不达米亚',
      timeSpan: timeSpan(-3500, -2000, '约公元前3500—前2000年', true),
      contentBlocks: [{
        id: 'sumer-water-network-geography',
        kind: 'geographyObservation',
        text: '南部美索不达米亚雨水很少，底格里斯河与幼发拉底河却会泛滥、淤积和改道。人们挖渠把河水送进田地，之后还要年年清淤、修堤，商量谁先取水。上游一处改变，下游就会受到影响。乌鲁克正是在这样的水网中长成大城。',
        sourceIds: ['source-adams-heartland-cities', 'source-isac-irrigation-southern-mesopotamia']
      }],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-sumer-uruk',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'uruk', annotationId: 'annotation-mesopotamia-uruk-site', sourceIds: ['source-unesco-uruk-location'] }
          ],
          caption: '棕色圆点与文字共同标出乌鲁克遗址；它位于两河下游，古代河道不断变化。'
        }
      },
      sourceIds: ['source-adams-heartland-cities', 'source-isac-irrigation-southern-mesopotamia', 'source-unesco-uruk-location', 'source-natural-earth']
    },
    {
      id: 'sumer-land-measurement',
      title: '土地成为可以记录的数量',
      eyebrow: '晚期乌鲁克至早王朝时期',
      timeSpan: timeSpan(-3300, -2700, '约公元前3300—前2700年', true),
      contentBlocks: [
        fact('sumer-land-measurement-fact', '水渠把田地连在一起，也让边界变得越来越重要。书吏测量土地的长宽，把面积、房屋、牲畜、交易者和见证人写进记录。土地从此不只存在于人的脚步和记忆中，也能被计算、比较、分配和转让。', ['source-proust-mesopotamian-mathematics', 'source-met-ushumgal-stele'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-sumer-ushumgal-stele' },
      sourceIds: ['source-proust-mesopotamian-mathematics', 'source-met-ushumgal-stele']
    },
    {
      id: 'sumer-clay-records',
      title: '粮食和劳作进入泥板',
      eyebrow: '约公元前3300年以后',
      timeSpan: timeSpan(-3300, -2600, '约公元前3300—前2600年', true),
      contentBlocks: [
        interpretation('sumer-clay-records-interpretation', '城市每天接收大麦、小麦和牲畜，也要分派工作、发放口粮。往来多到无法只凭记忆，书吏便把物品和数量压进湿泥。泥板最初服务于仓库和配给，后来符号开始记录词语与声音，逐渐学会跟随人的语言。', ['source-englund-proto-cuneiform', 'source-met-origins-writing', 'source-met-grain-tablet'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-sumer-uruk-proto-cuneiform-tablet' },
      sourceIds: ['source-englund-proto-cuneiform', 'source-met-origins-writing', 'source-met-grain-tablet']
    },
    {
      id: 'sumer-sixty-and-moon',
      title: '六十与月亮安排数量和时间',
      eyebrow: '早期城市至乌尔第三王朝',
      timeSpan: timeSpan(-3300, -2000, '约公元前3300—前2000年', true),
      contentBlocks: [
        fact('sumer-sixty-and-moon-fact', '书吏计算不同物品时，会使用不同的记数方法，其中一些以六十为重要层级。月份跟着月亮变化；十二个月逐渐追不上农时，人们便再加入一个月。一块泥板因此可以同时写下羊群数量与日期，让账目、收获和祭祀共享同一套时间。', ['source-proust-mesopotamian-mathematics', 'source-firth-sumerian-calendars', 'source-met-ur-iii-dugga-account'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-sumer-balanced-account-dugga' },
      sourceIds: ['source-proust-mesopotamian-mathematics', 'source-firth-sumerian-calendars', 'source-met-ur-iii-dugga-account']
    },
    {
      id: 'sumer-methods-outlast-dynasties',
      title: '方法比王朝活得更久',
      eyebrow: '阿卡德至乌尔第三王朝',
      timeSpan: timeSpan(-2350, -2004, '约公元前2350—前2004年', true),
      contentBlocks: [
        synthesis('sumer-methods-outlast-dynasties-synthesis', '苏美尔城邦不断争夺土地和水道。后来，来自苏美尔城邦体系之外的阿卡德王朝征服南方城市；它不是苏美尔王朝，却接手了当地的书吏、泥板、神庙和计量方法。征服者和王朝不断更换，城市赖以运转的许多知识仍被继续使用。', ['source-met-akkadian-period', 'source-foster-sargonic-administration', 'source-garfinkle-kingdom-ur', 'source-met-ur-iii-dugga-account'])
      ],
      presentation: { kind: 'textOnly' },
      sourceIds: ['source-met-akkadian-period', 'source-foster-sargonic-administration', 'source-garfinkle-kingdom-ur', 'source-met-ur-iii-dugga-account']
    },
    {
      id: 'sumer-uruk-gathering',
      title: '人群汇入乌鲁克',
      eyebrow: '约公元前3200年',
      timeSpan: timeSpan(-3300, -3100, '约公元前3300—前3100年', true),
      contentBlocks: [{
        id: 'sumer-uruk-gathering-geography',
        kind: 'geographyObservation',
        text: '公元前四千纪后期，乌鲁克逐渐超过周围聚落。到约公元前3200年，它已经覆盖约250公顷，泥砖房屋、作坊、街道和水道在城市中不断扩展。越来越多的人离开小型聚落或来到这里谋生，使乌鲁克不再只是一个放大的村庄：每天的食物、劳动和公共空间都必须面对新的规模。更广阔的苏美尔世界，则能解释这座城市所依靠的河流、水渠和知识传统。',
        sourceIds: ['source-mcmahon-early-urbanism', 'source-met-uruk-first-city', 'source-met-origins-writing']
      }],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-sumer-uruk',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'uruk', annotationId: 'annotation-mesopotamia-uruk-site', sourceIds: ['source-unesco-uruk-location'] }
          ],
          caption: '棕色圆点与文字共同标出乌鲁克遗址；它位于今天伊拉克南部，古代河道为示意。'
        }
      },
      sourceIds: ['source-mcmahon-early-urbanism', 'source-met-uruk-first-city', 'source-met-origins-writing', 'source-unesco-uruk-location', 'source-natural-earth']
    },
    {
      id: 'sumer-uruk-feeding',
      title: '城市每天都要吃饭',
      eyebrow: '公元前四千纪晚期',
      timeSpan: timeSpan(-3500, -3000, '约公元前3500—前3000年', true),
      contentBlocks: [
        synthesis('sumer-uruk-feeding-synthesis', '乌鲁克的居民并不都在自己的房屋旁种植粮食。成千上万的人聚集以后，城市每天需要从周围农田、牧地和水道获得大麦、牲畜、鱼类、芦苇和其他物资。有人耕种和放牧，有人驾船或赶着牲畜进入城市，也有人负责储存、加工与分配。城市规模越大，这条供给链就越长；一次收成、水道受阻或运输中断，都可能影响许多并不认识生产者的居民。乌鲁克因此依靠城市与乡村之间持续不断的物资流动。', ['source-adams-heartland-cities', 'source-met-uruk-first-city'])
      ],
      presentation: { kind: 'textOnly' },
      sourceIds: ['source-adams-heartland-cities', 'source-met-uruk-first-city']
    },
    {
      id: 'sumer-uruk-public-center',
      title: '泥砖筑起公共中心',
      eyebrow: '公元前四千纪晚期',
      timeSpan: timeSpan(-3500, -3000, '约公元前3500—前3000年', true),
      contentBlocks: [
        interpretation('sumer-uruk-public-center-interpretation', '乌鲁克中心出现了远远超过普通住宅的泥砖建筑。工人搬运泥土、制砖、铺设高台，又把成千上万枚染色陶锥嵌入墙面，组成远处也能看见的几何图案。白庙矗立在高台之上，埃安娜区域则汇集了仪式和公共建筑。建造这些空间需要长期调集材料、食物和劳动力，也让神庙、仪式与城市权力获得一个共同的可见中心。乌鲁克的巨大建筑因此不仅改变天际线，也改变了人们组织共同劳动的方式。', ['source-dai-uruk', 'source-met-uruk-first-city'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-sumer-uruk-public-center' },
      sourceIds: ['source-dai-uruk', 'source-met-uruk-first-city', 'source-wikimedia-uruk-white-temple-ziggurat']
    },
    {
      id: 'sumer-uruk-strangers',
      title: '陌生人组成一座城市',
      eyebrow: '公元前四千纪晚期',
      timeSpan: timeSpan(-3500, -3000, '约公元前3500—前3000年', true),
      contentBlocks: [
        synthesis('sumer-uruk-strangers-synthesis', '乌鲁克把农民、牧人、渔民、搬运者、工匠、仪式人员和掌握资源的人聚集在一起。乌鲁克瓶把这种相互依赖刻成一条由下向上的队伍：水与植物生长在最下层，羊群行走在其上，赤裸的搬运者携带篮筐和器皿，最上层的物资则被送往伊南娜的圣所。城市在这里被想象成一套由土地、动物、劳动和神祇共同维持的秩序。城市不仅意味着更多房屋，也意味着大量陌生人开始依靠彼此生活。', ['source-morgan-warka-vase', 'source-smarthistory-warka-vase'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-sumer-uruk-warka-vase' },
      sourceIds: ['source-morgan-warka-vase', 'source-smarthistory-warka-vase', 'source-wikimedia-warka-vase-360']
    }
  ];

  const cameraPresets = [
    { id: 'camera-southern-mesopotamia', center: [45.6, 31.5], scale: 7.5 }
  ];

  const geometries = [{
    id: 'geometry-uruk-site',
    geometry: { type: 'Point', coordinates: [45.637222, 31.324167] },
    timeSpan: timeSpan(-3500, -3000, '公元前四千纪晚期的乌鲁克遗址位置', true),
    approximate: false,
    label: '乌鲁克遗址',
    sourceIds: ['source-unesco-uruk-location']
  }];

  const mapStates = [{
    id: 'map-sumer-uruk',
    cameraPresetId: 'camera-southern-mesopotamia',
    layers: [{
      kind: 'geometry',
      geometryId: 'geometry-uruk-site',
      timeSpan: timeSpan(-3500, -3000, '公元前四千纪晚期', true),
      sourceIds: ['source-unesco-uruk-location', 'source-natural-earth']
    }]
  }];

  const assets = [
    {
      id: 'asset-sumer-uruk-public-center',
      type: 'image',
      src: 'assets/images/mesopotamia/sumer-uruk-public-center.jpg',
      title: '乌鲁克白庙台基遗址',
      alt: '乌鲁克白庙所在的泥砖高台遗址照片，层层风化的土色台基从平原上隆起。',
      sourceIds: ['source-wikimedia-uruk-white-temple-ziggurat', 'source-dai-uruk']
    },
    {
      id: 'asset-sumer-uruk-proto-cuneiform-tablet',
      type: 'image',
      src: 'assets/images/mesopotamia/sumer-uruk-proto-cuneiform-tablet.jpg',
      title: '记录谷物分配的原始楔形文字泥板',
      alt: '一块小型浅褐色泥板，表面分栏刻画谷穗等图形，并压有圆形数字记号。',
      sourceIds: ['source-met-grain-tablet']
    },
    {
      id: 'asset-sumer-uruk-warka-vase',
      type: 'image',
      src: 'assets/images/mesopotamia/sumer-uruk-warka-vase.jpg',
      title: '乌鲁克瓶上的搬运队列',
      alt: '乌鲁克瓶中层的局部照片，赤裸的搬运者依次托举篮筐与器皿向前行进。',
      sourceIds: ['source-wikimedia-warka-vase-360', 'source-morgan-warka-vase', 'source-smarthistory-warka-vase']
    },
    {
      id: 'asset-sumer-ushumgal-stele',
      type: 'image',
      src: 'assets/images/mesopotamia/sumer-ushumgal-stele.jpg',
      title: '乌舒姆伽尔与莎拉伊吉齐阿布石碑',
      alt: '一件圆顶石碑的完整正面，中央人物双手交握，人物上方与衣裙刻有早期苏美尔文字，侧面还能看到交易见证人。',
      sourceIds: ['source-met-ushumgal-stele']
    },
    {
      id: 'asset-sumer-balanced-account-dugga',
      type: 'image',
      src: 'assets/images/mesopotamia/sumer-balanced-account-dugga.jpg',
      title: '杜伽的平衡账目泥板',
      alt: '一块公元前2039年的长方形泥板完整正面，横向分栏内密集记录牲畜账目，并写有阿马尔辛八年一月二十五日。',
      sourceIds: ['source-met-ur-iii-dugga-account']
    }
  ];

  return {
    sources,
    entities,
    cards,
    scenes,
    cameraPresets,
    geometries,
    mapStates,
    assets
  };
}));

(function exposeMesopotamiaV4(root, factory) {
  const data = factory(root && root.ATLAS_V4_SUMER);
  if (root) root.ATLAS_V4_MESOPOTAMIA = data;
  if (typeof module === 'object' && module.exports) module.exports = data;
}(typeof window !== 'undefined' ? window : globalThis, function createMesopotamiaV4Data(sumer) {
  'use strict';

  if (!sumer) throw new Error('Sumer data must initialize inside data/mesopotamia.js');

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

  const sources = [
    {
      id: 'source-yale-ubaid-summary',
      title: 'The Ubaid Period: Summary',
      publisher: 'Yale University eHRAF Archaeology',
      url: 'https://ehrafarchaeology.yale.edu/traditions/mh55/summary'
    },
    {
      id: 'source-met-mesopotamian-deities',
      title: 'Mesopotamian Deities',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/essays/mesopotamian-deities'
    },
    {
      id: 'source-met-ur-ziggurat',
      title: 'Ur: The Ziggurat',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/essays/ur-the-ziggurat'
    },
    {
      id: 'source-goddeeris-old-babylonian-economy',
      title: 'The Old Babylonian Economy',
      author: 'Anne Goddeeris',
      publisher: 'Routledge',
      url: 'https://www.taylorfrancis.com/chapters/edit/10.4324/9780203946237-16/old-babylonian-economy-anne-goddeeris'
    },
    {
      id: 'source-met-isin-larsa-old-babylonian',
      title: 'The Isin-Larsa and Old Babylonian Periods',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/essays/the-isin-larsa-and-old-babylonian-periods-2004-1595-b-c'
    },
    {
      id: 'source-damerow-writing-epistemology',
      title: 'The Origins of Writing as a Problem of Historical Epistemology',
      author: 'Peter Damerow',
      year: 2006,
      publisher: 'Cuneiform Digital Library Journal',
      url: 'https://cdli.mpiwg-berlin.mpg.de/articles/cdlj/2006-1.pdf'
    },
    {
      id: 'source-wikimedia-proto-cuneiform-barley-tablet-pd',
      title: 'Proto-Cuneiform Administrative Account of Barley Distribution, Public Domain',
      publisher: 'Wikimedia Commons / The Metropolitan Museum of Art',
      url: 'https://commons.wikimedia.org/wiki/File:Cuneiform_tablet-_administrative_account_of_barley_distribution_with_cylinder_seal_impression_of_a_male_figure,_hunting_dogs,_and_boars_MET_DT847.jpg'
    },
    {
      id: 'source-penn-uses-writing',
      title: 'The Uses of Writing',
      publisher: 'Penn Museum',
      url: 'https://www.penn.museum/sites/expedition/the-uses-of-writing/'
    },
    {
      id: 'source-isac-writing-early-mesopotamia',
      title: 'Writing in Early Mesopotamia',
      publisher: 'Institute for the Study of Ancient Cultures, University of Chicago',
      url: 'https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/ar/11-20/13-14/ar2013-14.pdf'
    },
    {
      id: 'source-british-museum-cuneiform',
      title: 'How to Write Cuneiform',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/blog/how-write-cuneiform'
    },
    {
      id: 'source-british-museum-gilgamesh-tablet-i',
      title: 'Cuneiform Tablet: Epic of Gilgamesh, Tablet I',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/collection/object/W_1880-0617-913'
    },
    {
      id: 'source-met-akkadian-period',
      title: 'The Akkadian Period (ca. 2350–2150 B.C.)',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/essays/the-akkadian-period-ca-2350-2150-b-c'
    },
    {
      id: 'source-westenholz-kingdom-akkad',
      title: 'The Kingdom of Akkad',
      author: 'Aage Westenholz',
      publisher: 'Oxford University Press',
      url: 'https://academic.oup.com/book/37433/chapter-abstract/331534882'
    },
    {
      id: 'source-fordham-sargon-birth-legend',
      title: 'The Legend of Sargon of Akkad',
      publisher: 'Internet History Sourcebooks Project, Fordham University',
      url: 'https://sourcebooks.web.fordham.edu/ancient/2300sargon1.asp'
    },
    {
      id: 'source-etcsl-sargon-ur-zababa',
      title: 'Sargon and Ur-Zababa',
      publisher: 'Electronic Text Corpus of Sumerian Literature, University of Oxford',
      url: 'https://etcsl.orinst.ox.ac.uk/cgi-bin/etcsl.cgi?text=t.2.1.4'
    },
    {
      id: 'source-british-museum-enheduanna',
      title: 'Enheduanna',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/collection/term/BIOG132760'
    },
    {
      id: 'source-wikimedia-sargon-legend-tablet',
      title: 'Birth Legend of Sargon of Akkad, Louvre AO 7673, CC BY-SA 4.0 photograph',
      author: '0x010C',
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:2015-12_Birth_Sargon_of_Akkad_Louvre-AO_7673.jpg'
    },
    {
      id: 'source-wikimedia-enheduanna-disk',
      title: 'Disk of Enheduanna, CC0 photograph',
      author: 'Mefman00',
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Disk_of_Enheduanna.JPG'
    },
    {
      id: 'source-foster-sargonic-administration',
      title: 'Administration and Use of Institutional Land in Sargonic Sumer',
      author: 'Benjamin R. Foster',
      publisher: 'Yale University eHRAF Archaeology',
      url: 'https://ehrafarchaeology.yale.edu/traditions/mh66/documents/003'
    },
    {
      id: 'source-frayne-sargonic-inscriptions',
      title: 'Sargonic and Gutian Periods Royal Inscriptions',
      author: 'Douglas Frayne',
      publisher: 'Cuneiform Digital Library Initiative',
      url: 'https://cdli.earth/publications/56940'
    },
    {
      id: 'source-eckart-akkadian-empire',
      title: 'The Akkadian Empire',
      author: 'Walther Sallaberger and Aage Westenholz',
      publisher: 'Oxford University Press',
      url: 'https://academic.oup.com/book/28459/chapter-abstract/229049037'
    },
    {
      id: 'source-lawrence-climate-urbanism',
      title: 'Climate Change and Ancient Urban Societies',
      publisher: 'WIREs Climate Change',
      url: 'https://wires.onlinelibrary.wiley.com/doi/10.1002/wcc.741'
    },
    {
      id: 'source-wikimedia-ur-ziggurat-photo',
      title: 'Photograph of the Ziggurat of Ur, CC BY-SA 4.0',
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:%D8%B2%D9%82%D9%88%D8%B1%D8%A9_%D8%A7%D9%88%D8%B1_%D8%A7%D9%84%D8%A7%D8%AB%D8%B1%D9%8A%D8%A9.jpg'
    },
    {
      id: 'source-wikimedia-eanna-4b-plan',
      title: 'Eanna District of Uruk IVb Plan, CC BY-SA 3.0',
      author: 'Lamassu Design',
      year: 2009,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Eanna4b.svg'
    },
    {
      id: 'source-wikimedia-etemenanki-reconstruction',
      title: 'Etemenanki Reconstruction Based on Hansjörg Schmid, Public Domain',
      author: 'Jona Lendering',
      year: 2007,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Etemenanki_drawing.gif'
    },
    {
      id: 'source-british-museum-etemenanki-tablet',
      title: 'Neo-Babylonian Building Inscription about Etemenanki',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/collection/object/W_1894-0115-10'
    },
    {
      id: 'source-met-student-exercise-object',
      title: 'Cuneiform Tablet: Student Exercise Tablet',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/321878'
    },
    {
      id: 'source-wikimedia-gilgamesh-flood-tablet',
      title: 'British Museum Flood Tablet, CC0 photograph',
      author: 'BabelStone',
      year: 2010,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:British_Museum_Flood_Tablet.jpg'
    },
    {
      id: 'source-wikimedia-gilgamesh-old-babylonian-fragments',
      title: 'Epic of Gilgamesh, three Old Babylonian fragments, CC0 photograph',
      author: 'Daderot',
      year: 2014,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Epic_of_Gilgamesh,_three_fragments_-_Oriental_Institute_Museum,_University_of_Chicago_-_DSC07124.JPG'
    },
    {
      id: 'source-met-grammatical-text-object',
      title: 'Cuneiform Tablet: Late Babylonian Grammatical Text',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/321677'
    },
    {
      id: 'source-wikimedia-akkadian-ruler-head',
      title: 'Bronze Head of an Akkadian Ruler, public-domain photograph',
      author: 'Unknown photographer',
      year: 1936,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Sargon_of_Akkad.jpg'
    },
    {
      id: 'source-wikimedia-sargon-victory-stele',
      title: 'Sargon on His Victory Stele, CC BY-SA 2.0 photograph',
      author: 'ALFGRN',
      year: 2019,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Sargon_on_his_victory_stele.jpg'
    },
    {
      id: 'source-wikimedia-naram-sin-victory-stele',
      title: 'Victory Stele of Naram-Sin, CC BY-SA photograph',
      author: 'Rama',
      year: 2007,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Victory_stele_of_Naram_Sin_9065.jpg'
    },
    {
      id: 'source-louvre-naram-sin-victory-stele',
      title: 'Stèle de Naram-Sin',
      publisher: 'Musée du Louvre',
      url: 'https://collections.louvre.fr/en/ark:/53355/cl010123450'
    },
    {
      id: 'source-met-akkadian-inscribed-bowl-object',
      title: 'Inscribed Bowl of Shar-Kali-Sharri',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/324054'
    },
    {
      id: 'source-met-ur-nammu-foundation-figure-object',
      title: 'Foundation Figure of Ur-Namma Holding a Basket',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/329067'
    },
    {
      id: 'source-george-babylonian-gilgamesh-epic',
      title: 'The Babylonian Gilgamesh Epic: Introduction, Critical Edition and Cuneiform Texts',
      author: 'Andrew R. George',
      year: 2003,
      publisher: 'Oxford University Press'
    },
    {
      id: 'source-george-gilgamesh-whats-new',
      title: "What's New in the Gilgamesh Epic?",
      author: 'Andrew R. George',
      publisher: 'SOAS Research Online',
      url: 'https://eprints.soas.ac.uk/3251/1/GilgameshWhat%27sNew.pdf'
    },
    {
      id: 'source-oxford-classical-dictionary-gilgamesh',
      title: 'Gilgamesh',
      publisher: 'Oxford Classical Dictionary',
      year: 2025,
      url: 'https://doi.org/10.1093/acrefore/9780199381135.013.9025'
    },
    {
      id: 'source-met-gilgamesh-overview',
      title: 'Gilgamesh',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/es/essays/gilgamesh'
    },
    {
      id: 'source-george-civilizing-enkidu',
      title: 'The Civilizing of Ea-Enkidu: An Unusual Tablet of the Babylonian Gilgamesh Epic',
      author: 'Andrew R. George',
      year: 2007,
      publisher: 'Revue d’assyriologie et d’archéologie orientale',
      url: 'https://eprints.soas.ac.uk/6088/1/RA101George.pdf'
    },
    {
      id: 'source-british-museum-gilgamesh-tablet-vi',
      title: 'Cuneiform Tablet: Epic of Gilgamesh, Tablet VI',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/collection/object/W_K-231'
    },
    {
      id: 'source-british-museum-gilgamesh-flood-tablet',
      title: 'Cuneiform Tablet: Epic of Gilgamesh, Flood Tablet',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/collection/object/W_K-3375'
    },
    {
      id: 'source-soas-gilgamesh-old-babylonian-x',
      title: 'Gilgamesh X: Old Babylonian Version',
      publisher: 'SOAS Babylonian and Assyrian Poetry and Literature Archive',
      url: 'https://www.soas.ac.uk/baplar/recordings/gilgamesh-x-read-john-huehnergard'
    },
    {
      id: 'source-soas-gilgamesh-old-babylonian-grief',
      title: 'Epic of Gilgamesh: Old Babylonian Version, VA+BM Tablet',
      publisher: 'SOAS Babylonian and Assyrian Poetry and Literature Archive',
      url: 'https://www.soas.ac.uk/baplar/recordings/epic-gilgamesh-old-babylonian-version-part-vabm-tablet-read-martin-west'
    },
    {
      id: 'source-soas-gilgamesh-xi-opening',
      title: 'Epic of Gilgamesh, Standard Version, Tablet XI, Lines 1–34',
      publisher: 'SOAS Babylonian and Assyrian Poetry and Literature Archive',
      url: 'https://www.soas.ac.uk/baplar/recordings/epic-gilgames-standard-version-tablet-xi-lines-1-34-read-nathan-wasserman'
    },
    {
      id: 'source-soas-gilgamesh-xi-flood',
      title: 'Epic of Gilgamesh, Standard Version, Tablet XI, Lines 92–139',
      publisher: 'SOAS Babylonian and Assyrian Poetry and Literature Archive',
      url: 'https://www.soas.ac.uk/baplar/recordings/epic-gilgames-standard-version-tablet-xi-lines-92-139-read-martin-west'
    },
    {
      id: 'source-etcsl-gilgamesh-stories',
      title: 'The Electronic Text Corpus of Sumerian Literature: Gilgamesh Stories',
      publisher: 'University of Oxford',
      url: 'https://etcsl.orinst.ox.ac.uk/catalogue/catalogue1.htm'
    },
    {
      id: 'source-garfinkle-kingdom-ur',
      title: 'The Kingdom of Ur',
      author: 'Steven J. Garfinkle',
      year: 2022,
      publisher: 'Oxford University Press',
      url: 'https://academic.oup.com/book/43915/chapter/370990907'
    },
    {
      id: 'source-corcoran-tadd-livestock-early-states',
      title: 'The Political Economy of Livestock in Early States',
      author: 'Noah Corcoran-Tadd et al.',
      year: 2023,
      publisher: 'Cambridge Archaeological Journal',
      url: 'https://www.cambridge.org/core/journals/cambridge-archaeological-journal/article/political-economy-of-livestock-in-early-states/A94F5FBA63DE00BCE461E86D13F4FD89'
    },
    {
      id: 'source-steinkeller-ur-iii-core-periphery',
      title: 'The Administrative and Economic Organization of the Ur III State: The Core and the Periphery',
      author: 'Piotr Steinkeller',
      year: 1987,
      publisher: 'Oriental Institute of the University of Chicago',
      url: 'https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/saoc46.pdf'
    },
    {
      id: 'source-hilgert-drehem-administrative-documents',
      title: 'Cuneiform Texts from the Ur III Period in the Oriental Institute, Volume 1: Drehem Administrative Documents',
      author: 'Markus Hilgert',
      year: 1998,
      publisher: 'Oriental Institute of the University of Chicago',
      url: 'https://isac.uchicago.edu/research/publications/oip/cuneiform-texts-ur-iii-period-oriental-institute-volume-1-drehem'
    },
    {
      id: 'source-rost-ur-iii-irrigation-umma',
      title: 'Irrigation Management in the Ur III Period: The Case of I-sala in Umma',
      author: 'Stephanie Rost',
      publisher: 'Institute for the Study of Ancient Cultures, University of Chicago',
      url: 'https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/Publications/OIS/ois13.pdf'
    },
    {
      id: 'source-oracc-ur-namma-inscriptions',
      title: 'Electronic Text Corpus of Sumerian Royal Inscriptions: Ur-Namma Inscriptions',
      publisher: 'Open Richly Annotated Cuneiform Corpus',
      url: 'https://oracc.museum.upenn.edu/etcsri/'
    },
    {
      id: 'source-british-museum-ur-iii-barley-rations',
      title: 'Cuneiform Tablet Recording Barley Rations',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/collection/object/W_1895-1017-219'
    },
    {
      id: 'source-british-museum-ur-iii-drehem-sheep',
      title: 'Cuneiform Tablet Recording Sheep at Drehem',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/collection/object/W_2010-6022-2'
    },
    {
      id: 'source-british-museum-ur-iii-fields-yields',
      title: 'Cuneiform Tablet Recording Fields and Yields',
      publisher: 'The British Museum',
      url: 'https://www.britishmuseum.org/collection/object/W_1914-0404-182'
    },
    {
      id: 'source-met-ur-iii-dugga-account',
      title: 'Cuneiform Tablet: Balanced Account of Dugga',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/322447'
    },
    {
      id: 'source-cambridge-ur-iii-old-babylonian-transition',
      title: 'The Ur III–Old Babylonian Transition: An Archaeological Perspective',
      publisher: 'Iraq',
      url: 'https://www.cambridge.org/core/journals/iraq/article/ur-iiiold-babylonian-transition-an-archaeological-perspective/42C3A224B7D64BA31EED67E620732C10'
    },
    {
      id: 'source-wikimedia-ur-iii-administrative-tablet',
      title: 'Administrative Tablet, Third Dynasty of Ur, 2026 BC, CC0 photograph',
      author: 'Gary Todd',
      year: 2017,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Administrative_Tablet,_Third_Dynasty_of_Ur,_2026_BC.jpg'
    },
    {
      id: 'source-wikimedia-lament-for-ur-penn',
      title: 'CBS7080 Lament for Ur, CC BY-SA 4.0 photograph',
      author: 'Onceinawhile',
      year: 2022,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:CBS7080_Lament_for_Ur_Penn_Museum.jpg'
    },
    {
      id: 'source-podany-hammurabi-babylon',
      title: 'Hammurabi of Babylon',
      author: 'Amanda H. Podany',
      publisher: 'Oxford University Press',
      url: 'https://academic.oup.com/book/43915'
    },
    {
      id: 'source-cdli-hammurabi-year-names',
      title: 'Hammurabi Year Names',
      publisher: 'Cuneiform Digital Library Initiative',
      url: 'https://cdli.earth/dl/year-names/HTML/T12K9.htm'
    },
    {
      id: 'source-cdli-samsuiluna-year-names',
      title: 'Samsuiluna Year Names',
      publisher: 'Cuneiform Digital Library Initiative',
      url: 'https://cdli.earth/dl/year-names/HTML/T12K10.htm'
    },
    {
      id: 'source-brinkman-kassite-history',
      title: 'Materials and Studies for Kassite History, Volume I',
      author: 'J. A. Brinkman',
      year: 1976,
      publisher: 'Oriental Institute of the University of Chicago'
    },
    {
      id: 'source-met-kassite-period',
      title: 'The Middle Babylonian / Kassite Period (ca. 1595–1155 B.C.) in Mesopotamia',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/essays/the-middle-babylonian-kassite-period-ca-1595-1155-b-c-in-mesopotamia'
    },
    {
      id: 'source-wikimedia-kurigalzu-kudurru',
      title: 'Kudurru mentioning the name of the Kassite king Kurigalzu II, CC BY-SA 4.0 photograph',
      author: 'Osama Shukir Muhammed Amin',
      year: 2014,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Kudurru_mentioning_the_name_of_the_Kassite_king_Kurigalzu_II,_from_Nippur,_Iraq,_Ancient_Orient_Museum.jpg'
    },
    {
      id: 'source-van-de-mieroop-ancient-near-east',
      title: 'A History of the Ancient Near East, ca. 3000–323 BC',
      author: 'Marc Van De Mieroop',
      year: 2016,
      publisher: 'Wiley Blackwell'
    },
    {
      id: 'source-radner-ancient-assyria',
      title: 'Ancient Assyria: A Very Short Introduction',
      author: 'Karen Radner',
      year: 2015,
      publisher: 'Oxford University Press'
    },
    {
      id: 'source-wikimedia-hammurabi-letter',
      title: 'Letter from Hammurabi to Sin-iddinam, CC BY-SA 4.0 photograph',
      author: 'Zunkir',
      year: 2020,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Lettre_de_Hammurabi_a_Sin-iddinam_AO_5420.jpg'
    },
    {
      id: 'source-louvre-hammurabi-code',
      title: 'Law Code of Hammurabi, King of Babylon',
      publisher: 'Musée du Louvre',
      url: 'https://collections.louvre.fr/en/ark:/53355/cl010174436'
    },
    {
      id: 'source-ehammurabi-laws',
      title: 'The Laws of Hammurabi: Electronic Edition',
      publisher: 'eHammurabi',
      url: 'https://ehammurabi.org/law'
    },
    {
      id: 'source-cdli-law-collections',
      title: 'Law Collections from Mesopotamia and Asia Minor',
      publisher: 'Cuneiform Digital Library Initiative',
      url: 'https://cdli.earth/publications/2464389'
    },
    {
      id: 'source-isac-law-society',
      title: 'Law and Society in the Ancient Near East',
      publisher: 'Institute for the Study of Ancient Cultures, University of Chicago',
      url: 'https://isac.uchicago.edu/research/publications/saoc/saoc-62-law-and-society-ancient-near-east'
    },
    {
      id: 'source-cambridge-hammurabi-copies',
      title: 'The Laws of Hammurabi in the First Millennium',
      publisher: 'Cambridge University Press',
      url: 'https://www.cambridge.org/core/books/laws-of-hammurabi/'
    },
    {
      id: 'source-wikimedia-hammurabi-stele',
      title: 'Code of Hammurabi Stele, CC BY-SA 2.0 photograph',
      author: 'Urko Dorronsoro',
      year: 2011,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Code_Of_Hammurabi.jpg'
    },
    {
      id: 'source-wikimedia-hammurabi-trial-1915',
      title: 'Trial Before Hammurabi, public-domain historical illustration',
      author: 'Anonymous',
      year: 1915,
      publisher: "Wikimedia Commons / Hutchinson's Story of the Nations",
      url: 'https://commons.wikimedia.org/wiki/File:Trial_Before_Hammurabi.jpg'
    },
    {
      id: 'source-wikimedia-babylonian-canals-1898',
      title: 'Ancient Babylonian Canals, no known copyright restrictions',
      author: 'Unknown',
      year: 1898,
      publisher: 'Wikimedia Commons / Internet Archive Book Images',
      url: 'https://commons.wikimedia.org/wiki/File:Ancient_Babylonian_canals.jpg'
    },
    {
      id: 'source-wikimedia-hammurabi-full-stele',
      title: 'Code of Hammurabi Stele, public-domain photograph',
      author: 'Rlunaro',
      year: 2009,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Hammurabi_code.jpg'
    },
    {
      id: 'source-wikimedia-hammurabi-discovery',
      title: 'Discovery of the Hammurabi Stele, public-domain photograph',
      year: 1902,
      publisher: 'Wikimedia Commons / Musée du Louvre',
      url: 'https://commons.wikimedia.org/wiki/File:Code_of_Hammurabi_104.jpg'
    },
    {
      id: 'source-sefaria-genesis-11',
      title: 'Genesis 11:1–9',
      publisher: 'Sefaria',
      url: 'https://www.sefaria.org/Genesis.11.1-9'
    },
    {
      id: 'source-george-tower-of-babel',
      title: 'The Tower of Babel: Archaeology, History and Cuneiform Texts',
      author: 'Andrew R. George',
      publisher: 'SOAS Research Online',
      url: 'https://soas-repository.worktribe.com/output/421527/the-tower-of-babel-archaeology-history-and-cuneiform-texts'
    },
    {
      id: 'source-met-etemenanki-cylinder',
      title: 'Cuneiform Cylinder Commemorating the Reconstruction of Etemenanki',
      publisher: 'The Metropolitan Museum of Art',
      url: 'https://www.metmuseum.org/art/collection/search/321908'
    },
    {
      id: 'source-oracc-nebuchadnezzar-etemenanki',
      title: 'Nebuchadnezzar II Inscriptions Concerning Etemenanki',
      publisher: 'Open Richly Annotated Cuneiform Corpus',
      url: 'https://oracc.museum.upenn.edu/ribo/babylon7/'
    },
    {
      id: 'source-wikimedia-bruegel-babel',
      title: 'The Tower of Babel by Pieter Bruegel the Elder, Public Domain',
      author: 'Pieter Bruegel the Elder',
      year: 1563,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_(Vienna)_-_Google_Art_Project.jpg'
    },
    {
      id: 'source-wikimedia-dore-confusion',
      title: 'The Confusion of Tongues by Gustave Doré, Public Domain',
      author: 'Gustave Doré',
      year: 1865,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Confusion_of_Tongues.png'
    },
    {
      id: 'source-wikimedia-esagil-tablet',
      title: 'Esagil Tablet Fragment BM 40813, CC BY-SA 4.0 photograph',
      author: 'Zunkir',
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Esagil_tablet_fragment_BM_40813.jpg'
    },
    {
      id: 'source-wikimedia-etemenanki-ruins',
      title: 'Remains of the Foundations of Etemenanki, CC0 photograph',
      author: 'Marjon Verburg',
      year: 2012,
      publisher: 'Wikimedia Commons',
      url: 'https://commons.wikimedia.org/wiki/File:Remains_of_the_foundations_of_the_Etemnanki_Zigurat.jpg'
    }
  ];

  const entities = [
    {
      id: 'mesopotamia-region',
      type: 'GeographicFeature',
      name: '两河流域',
      alternativeNames: ['美索不达米亚', 'Mesopotamia'],
      canonicalSummary: '以底格里斯河、幼发拉底河及其相邻平原为核心，苏美尔、阿卡德、巴比伦与亚述等城市和政权长期形成、竞争并重组的历史区域。',
      timeSpan: timeSpan(-5000, -900, '约公元前五千纪—前一千纪初', true),
      defaultCardId: 'mesopotamia-cities-outlast-dynasties',
      tags: ['西亚', '历史区域', '青铜时代'],
      sourceIds: ['source-adams-heartland-cities', 'source-van-de-mieroop-ancient-near-east']
    },
    {
      id: 'mesopotamian-temple',
      type: 'institution',
      name: '美索不达米亚神庙',
      alternativeNames: ['Mesopotamian temple'],
      canonicalSummary: '从早期聚落的特殊建筑发展为连接仪式、城市身份、物资组织与王权表达的长期制度。',
      timeSpan: timeSpan(-5000, -539, '约公元前五千纪—前6世纪', true),
      defaultCardId: 'mesopotamian-temple-overview',
      tags: ['西亚', '制度', '神庙'],
      sourceIds: ['source-yale-ubaid-summary', 'source-met-isin-larsa-old-babylonian', 'source-british-museum-etemenanki-tablet']
    },
    {
      id: 'cuneiform',
      type: 'writingSystem',
      name: '楔形文字',
      alternativeNames: ['Cuneiform'],
      canonicalSummary: '约公元前3350—公元75年，在泥板上以楔形笔画书写、从早期管理记录逐渐发展为可记录多种语言，并被宫廷、帝国与学者反复改造的文字系统。',
      timeSpan: timeSpan(-3350, 75, '约公元前3350—公元75年', true),
      defaultCardId: 'cuneiform-overview',
      tags: ['西亚', '文字系统', '泥板'],
      sourceIds: ['source-englund-proto-cuneiform', 'source-british-museum-cuneiform', 'source-met-grammatical-text-object']
    },
    {
      id: 'akkadian-empire',
      type: 'polity',
      name: '阿卡德王朝',
      alternativeNames: ['Akkadian Empire', 'Kingdom of Akkad'],
      canonicalSummary: '约公元前2350—前2150年，由萨尔贡及其继承者建立和维持，连接南部美索不达米亚城邦与更广区域的早期王朝政治秩序。',
      timeSpan: timeSpan(-2350, -2150, '约公元前2350—前2150年', true),
      defaultCardId: 'akkadian-empire-overview',
      tags: ['西亚', '政治实体', '阿卡德'],
      sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad']
    },
    {
      id: 'epic-of-gilgamesh',
      type: 'TextDocument',
      name: '吉尔伽美什史诗传统',
      alternativeNames: ['Epic of Gilgamesh'],
      canonicalSummary: '由苏美尔语故事、古巴比伦阿卡德语版本和后来的标准巴比伦版本共同构成的长期文学传统。',
      timeSpan: timeSpan(-2000, -600, '约公元前二千纪早期—前一千纪中期的文本传统', true),
      defaultCardId: 'gilgamesh-mortality',
      tags: ['西亚', '文学传统', '楔形文字'],
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-oxford-classical-dictionary-gilgamesh']
    },
    {
      id: 'ur-iii-kingdom',
      type: 'polity',
      name: '乌尔第三王朝',
      alternativeNames: ['Ur III Kingdom', 'Third Dynasty of Ur'],
      canonicalSummary: '约公元前2112—前2004年，以乌尔为王权中心，通过建筑、书写和多层级资源关系组织南部美索不达米亚的政治实体。',
      timeSpan: timeSpan(-2112, -2004, '约公元前2112—前2004年', true),
      defaultCardId: 'ur-iii-reordered-city-world',
      tags: ['西亚', '政治实体', '乌尔第三王朝'],
      sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery']
    },
    {
      id: 'old-babylonian-kingdom',
      type: 'polity',
      name: '古巴比伦王国',
      alternativeNames: ['Old Babylonian Kingdom', 'First Dynasty of Babylon'],
      canonicalSummary: '约公元前1894—前1595年，以巴比伦城为中心、在汉谟拉比晚年迅速扩张，又在其继承者时期逐步收缩的第一王朝政治实体。',
      timeSpan: timeSpan(-1894, -1595, '约公元前1894—前1595年', true),
      defaultCardId: 'old-babylonian-rise-and-fragmentation',
      tags: ['西亚', '政治实体', '巴比伦'],
      sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-podany-hammurabi-babylon']
    },
    {
      id: 'hammurabi-code',
      type: 'TextDocument',
      name: '汉谟拉比法典',
      alternativeNames: ['Laws of Hammurabi', 'Code of Hammurabi'],
      canonicalSummary: '刻在大型石碑上的古巴比伦王室法律文本，以具体案件展示国王维护秩序与公正的权威。',
      timeSpan: timeSpan(-1750, -1750, '约公元前1750年', true),
      defaultCardId: 'hammurabi-code-justice',
      tags: ['西亚', '法律文本', '王权'],
      sourceIds: ['source-louvre-hammurabi-code', 'source-ehammurabi-laws']
    },
    {
      id: 'tower-of-babel-tradition',
      type: 'TextDocument',
      name: '巴别塔故事',
      alternativeNames: ['Tower of Babel'],
      canonicalSummary: '《创世记》中以共同语言、建塔、语言混乱与人群分散为核心的故事，后来常与巴比伦的埃特曼安吉塔庙联系。',
      timeSpan: timeSpan(-1000, -400, '约公元前一千纪的文本形成时期', true),
      defaultCardId: 'tower-of-babel-story-and-etemenanki',
      tags: ['西亚', '文本传统', '巴比伦'],
      sourceIds: ['source-sefaria-genesis-11', 'source-george-tower-of-babel']
    }
  ];

  const events = [
    {
      id: 'event-ur-iii-formation',
      title: '乌尔第三王朝形成',
      timeSpan: timeSpan(-2112, -2095, '乌尔那木统治时期，约公元前2112—前2095年', true),
      participantEntityIds: ['ur-iii-kingdom'],
      evidenceBlocks: [
        fact('event-ur-iii-formation-evidence', '阿卡德王朝收缩后的地方竞争中，乌尔那木建立新王朝，逐步使南方多座城市服从乌尔，并以“苏美尔与阿卡德之王”等称号表达新的跨城邦秩序。', ['source-garfinkle-kingdom-ur', 'source-oracc-ur-namma-inscriptions'])
      ],
      sourceIds: ['source-garfinkle-kingdom-ur', 'source-oracc-ur-namma-inscriptions', 'source-steinkeller-ur-iii-core-periphery'],
      editorialReview: {
        limitations: [
          limitation('event-ur-iii-formation-review-royal-claims', '王室称号和建筑铭文表达统治者希望呈现的秩序，不能单独确定地方接受程度。', ['source-oracc-ur-namma-inscriptions'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('event-ur-iii-formation-review-process', '王朝扩张的具体阶段、范围及地方服从方式仍不能压缩成一个单日事件。', ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery'])
        ],
        alternativeExplanations: [],
        sourceIds: ['source-garfinkle-kingdom-ur', 'source-oracc-ur-namma-inscriptions', 'source-steinkeller-ur-iii-core-periphery']
      }
    },
    {
      id: 'event-ur-iii-fragmentation',
      title: '乌尔第三王朝瓦解',
      timeSpan: timeSpan(-2028, -2004, '伊比辛统治后期至乌尔陷落，约公元前2028—前2004年', true),
      participantEntityIds: ['ur-iii-kingdom'],
      evidenceBlocks: [
        fact('event-ur-iii-fragmentation-evidence', '伊比辛统治后期，粮食危机、军事失利和地方脱离削弱乌尔王朝，来自东方的埃兰军队最终攻陷乌尔。', ['source-garfinkle-kingdom-ur', 'source-cambridge-ur-iii-old-babylonian-transition'])
      ],
      sourceIds: ['source-garfinkle-kingdom-ur', 'source-cambridge-ur-iii-old-babylonian-transition'],
      editorialReview: {
        limitations: [],
        counterexamples: [],
        uncertainties: [
          interpretation('event-ur-iii-fragmentation-review-weight', '粮食、环境、军事和地方政治因素分别发挥多大作用仍难精确衡量。', ['source-garfinkle-kingdom-ur', 'source-cambridge-ur-iii-old-babylonian-transition'])
        ],
        alternativeExplanations: [
          interpretation('event-ur-iii-fragmentation-review-causes', '王朝瓦解应理解为多重压力逐渐累积，而不是一次入侵独自造成的突然崩溃。', ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery'])
        ],
        sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-cambridge-ur-iii-old-babylonian-transition']
      }
    },
    {
      id: 'event-hammurabi-conquests',
      title: '汉谟拉比统一南部与中部美索不达米亚',
      timeSpan: timeSpan(-1764, -1755, '汉谟拉比统治后期，约公元前1764—前1755年', true),
      participantEntityIds: ['old-babylonian-kingdom'],
      evidenceBlocks: [
        fact('event-hammurabi-conquests-evidence', '汉谟拉比统治晚年连续击败拉尔萨、埃什努那和幼发拉底河上游的对手，使巴比伦短暂成为广大王国的中心。', ['source-cdli-hammurabi-year-names', 'source-podany-hammurabi-babylon'])
      ],
      sourceIds: ['source-cdli-hammurabi-year-names', 'source-podany-hammurabi-babylon'],
      editorialReview: {
        limitations: [],
        counterexamples: [],
        uncertainties: [
          interpretation('event-hammurabi-conquests-review-chronology', '王室纪年名突出国王希望纪念的胜利，不能独自还原所有联盟、战斗和地方服从过程。', ['source-cdli-hammurabi-year-names'])
        ],
        alternativeExplanations: [],
        sourceIds: ['source-cdli-hammurabi-year-names', 'source-podany-hammurabi-babylon']
      }
    },
    {
      id: 'event-old-babylonian-fragmentation',
      title: '古巴比伦王国收缩并结束',
      timeSpan: timeSpan(-1749, -1595, '约公元前1749—前1595年', true),
      participantEntityIds: ['old-babylonian-kingdom'],
      evidenceBlocks: [
        fact('event-old-babylonian-fragmentation-evidence', '汉谟拉比去世后，南方城市和海地王国逐渐脱离巴比伦；约公元前1595年，赫梯军队袭击巴比伦，第一王朝结束。', ['source-cdli-samsuiluna-year-names', 'source-met-isin-larsa-old-babylonian'])
      ],
      sourceIds: ['source-cdli-samsuiluna-year-names', 'source-met-isin-larsa-old-babylonian'],
      editorialReview: {
        limitations: [],
        counterexamples: [],
        uncertainties: [
          interpretation('event-old-babylonian-fragmentation-review-sequence', '南方脱离、财政和军事压力及赫梯袭击之间的具体因果次序不能归结为单一原因。', ['source-cdli-samsuiluna-year-names', 'source-met-isin-larsa-old-babylonian'])
        ],
        alternativeExplanations: [],
        sourceIds: ['source-cdli-samsuiluna-year-names', 'source-met-isin-larsa-old-babylonian']
      }
    },
    {
      id: 'event-hammurabi-code-stele',
      title: '汉谟拉比法典石碑建立',
      timeSpan: timeSpan(-1750, -1750, '约公元前1750年', true),
      participantEntityIds: ['hammurabi-code', 'old-babylonian-kingdom'],
      evidenceBlocks: [
        fact('event-hammurabi-code-stele-evidence', '高约2.25米的石碑以顶部浮雕、序言、近三百项案件和结语展示汉谟拉比维护公正的王权形象。', ['source-louvre-hammurabi-code', 'source-ehammurabi-laws'])
      ],
      sourceIds: ['source-louvre-hammurabi-code', 'source-ehammurabi-laws', 'source-cdli-law-collections'],
      editorialReview: {
        limitations: [],
        counterexamples: [],
        uncertainties: [
          interpretation('event-hammurabi-code-stele-review-use', '石碑原本竖立的位置、主要观看者及其与日常审判实践的具体关系仍不完全确定。', ['source-louvre-hammurabi-code', 'source-isac-law-society'])
        ],
        alternativeExplanations: [
          interpretation('event-hammurabi-code-stele-review-genre', '这组文字可同时从王室纪念碑、书吏法律传统和案件汇编等角度理解。', ['source-cdli-law-collections', 'source-isac-law-society'])
        ],
        sourceIds: ['source-louvre-hammurabi-code', 'source-cdli-law-collections', 'source-isac-law-society']
      }
    },
    {
      id: 'event-etemenanki-rebuilding',
      title: '埃特曼安吉塔庙重建',
      timeSpan: timeSpan(-689, -562, '约公元前689—前562年', true),
      participantEntityIds: ['tower-of-babel-tradition', 'mesopotamian-temple'],
      evidenceBlocks: [
        fact('event-etemenanki-rebuilding-evidence', '亚述与新巴比伦统治者先后重建巴比伦的埃特曼安吉，铭文、地基和测量文本保存了这座塔庙的历史证据。', ['source-george-tower-of-babel', 'source-met-etemenanki-cylinder', 'source-oracc-nebuchadnezzar-etemenanki'])
      ],
      sourceIds: ['source-george-tower-of-babel', 'source-met-etemenanki-cylinder', 'source-oracc-nebuchadnezzar-etemenanki'],
      editorialReview: {
        limitations: [],
        counterexamples: [],
        uncertainties: [
          interpretation('event-etemenanki-rebuilding-review-form', '高处泥砖已经消失，现有证据不能完全确定每一层的形状和最终完成程度。', ['source-george-tower-of-babel', 'source-wikimedia-esagil-tablet'])
        ],
        alternativeExplanations: [],
        sourceIds: ['source-george-tower-of-babel', 'source-met-etemenanki-cylinder', 'source-wikimedia-esagil-tablet']
      }
    }
  ];

  const structuralEdges = [
    {
      id: 'edge-uruk-mesopotamian-temple',
      family: 'historicalNetwork',
      type: 'developed_in_city_traditions',
      source: { kind: 'entity', id: 'uruk' },
      target: { kind: 'entity', id: 'mesopotamian-temple' },
      timeSpan: timeSpan(-5000, -1595, '从早期南部美索不达米亚聚落至古巴比伦时期', true),
      label: { forward: '发展并重组神庙制度', reverse: '形成于相关城市传统中' },
      summaries: { canonical: '南部美索不达米亚城市传统推动神庙成为兼具仪式、公共组织与王权表达的长期制度，但各城与各时期并不相同。' },
      qualifiers: ['不把所有大型公共建筑认定为神庙', '不把神庙视为城市形成的单一原因'],
      sourceIds: ['source-yale-ubaid-summary', 'source-met-uruk-first-city', 'source-met-isin-larsa-old-babylonian']
    },
    {
      id: 'edge-sumer-uruk',
      family: 'historicalNetwork',
      type: 'city_within_cultural_tradition',
      source: { kind: 'entity', id: 'sumer' },
      target: { kind: 'entity', id: 'uruk' },
      timeSpan: timeSpan(-3500, -2000, '约公元前3500—前2000年', true),
      label: { forward: '在乌鲁克观察城市形成', reverse: '进入更广阔的苏美尔世界' },
      summaries: { canonical: '乌鲁克是南部美索不达米亚苏美尔城市世界的重要遗址；城市的水道、计量与书写实践也属于更广阔的区域传统。' },
      qualifiers: ['乌鲁克不能代表所有苏美尔城市'],
      sourceIds: ['source-getty-uruk', 'source-adams-heartland-cities', 'source-met-uruk-first-city']
    },
    {
      id: 'edge-sumer-cuneiform',
      family: 'transmission',
      type: 'early_development_context',
      source: { kind: 'entity', id: 'sumer' },
      target: { kind: 'entity', id: 'cuneiform' },
      timeSpan: timeSpan(-3350, -2000, '约公元前3350—前2000年', true),
      label: { forward: '形成早期书写传统', reverse: '早期发展于相关城市传统中' },
      summaries: { canonical: '原始楔形文字在南部城市的管理实践中形成，并逐渐发展为能够记录苏美尔语及其他语言的文字系统。' },
      qualifiers: ['不主张由单一人物或单一前身直接发明'],
      sourceIds: ['source-englund-proto-cuneiform', 'source-met-origins-writing', 'source-damerow-writing-epistemology']
    },
    {
      id: 'edge-sumer-akkadian-empire',
      family: 'historicalNetwork',
      type: 'conquered_and_reorganized_city_world',
      source: { kind: 'entity', id: 'sumer' },
      target: { kind: 'entity', id: 'akkadian-empire' },
      timeSpan: timeSpan(-2350, -2150, '约公元前2350—前2150年', true),
      label: { forward: '进入阿卡德王朝的政治网络', reverse: '征服并重组南方城邦世界' },
      summaries: { canonical: '阿卡德王朝通过征服、驻军、官员和地方合作，把许多南方城邦纳入强度不一的王朝政治网络。' },
      qualifiers: ['铭文中的征服范围不等于稳定国界', '地方制度与语言并未消失'],
      sourceIds: ['source-met-akkadian-period', 'source-foster-sargonic-administration', 'source-frayne-sargonic-inscriptions']
    },
    {
      id: 'edge-sumer-ur-iii',
      family: 'historicalNetwork',
      type: 'reorganized_sumerian_city_traditions',
      source: { kind: 'entity', id: 'sumer' },
      target: { kind: 'entity', id: 'ur-iii-kingdom' },
      timeSpan: timeSpan(-2112, -2004, '约公元前2112—前2004年', true),
      label: { forward: '由乌尔第三王朝重新组织', reverse: '重新使用苏美尔城市的知识传统' },
      summaries: { canonical: '乌尔第三王朝从南部城市兴起，以王权和大量行政书写重新组织苏美尔城市传统。' },
      qualifiers: ['制度在继承中发生变化'],
      sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-met-ur-iii-dugga-account']
    },
    {
      id: 'edge-cuneiform-gilgamesh',
      family: 'transmission',
      type: 'recorded_and_transmitted_literary_tradition',
      source: { kind: 'entity', id: 'cuneiform' },
      target: { kind: 'entity', id: 'epic-of-gilgamesh' },
      timeSpan: timeSpan(-2000, -600, '约公元前二千纪早期—前一千纪中期', true),
      label: { forward: '记录并传递史诗传统', reverse: '由楔形文字泥板保存' },
      summaries: { canonical: '书吏以楔形文字记录和改写吉尔伽美什故事，使不同语言、时代与版本的文本得以保存。' },
      qualifiers: ['现存史诗不是一次写成的单一原作'],
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-tablet-i']
    },
    {
      id: 'edge-akkadian-ur-iii-transition',
      family: 'historicalNetwork',
      type: 'reorganized_after_fragmentation',
      source: { kind: 'entity', id: 'akkadian-empire' },
      target: { kind: 'entity', id: 'ur-iii-kingdom' },
      timeSpan: timeSpan(-2200, -2095, '阿卡德王朝收缩至乌尔第三王朝形成', true),
      label: { forward: '破碎后形成新的跨城邦秩序', reverse: '继承阿卡德之后的政治世界' },
      summaries: { canonical: '阿卡德王朝收缩后，南部城市经历重新竞争，乌尔第三王朝逐步建立了不同于阿卡德的跨城邦秩序。' },
      qualifiers: ['不表示两个王朝之间存在立即而完整的政权交接'],
      sourceIds: ['source-met-akkadian-period', 'source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery']
    },
    {
      id: 'edge-ur-iii-mesopotamian-temple',
      family: 'historicalNetwork',
      type: 'built_and_supported_temple_complexes',
      source: { kind: 'entity', id: 'ur-iii-kingdom' },
      target: { kind: 'entity', id: 'mesopotamian-temple' },
      timeSpan: timeSpan(-2112, -2004, '乌尔第三王朝时期，约公元前2112—前2004年', true),
      label: { forward: '以神庙建造表达王权秩序', reverse: '由乌尔第三王朝重建和支持' },
      summaries: { canonical: '乌尔那木等乌尔第三王朝统治者以修建和支持神庙表达对神明的职责，也借大型工程组织资源并宣告城市秩序的恢复。' },
      qualifiers: ['不把神庙缩减为王权工具', '不同城市的神庙组织并不完全相同'],
      sourceIds: ['source-met-ur-ziggurat', 'source-oracc-ur-namma-inscriptions', 'source-goddeeris-old-babylonian-economy']
    }
  ];

  const cards = [
    {
      id: 'mesopotamia-cities-outlast-dynasties',
      kind: 'overview',
      primaryEntityId: 'mesopotamia-region',
      relatedEntityIds: ['sumer', 'uruk', 'akkadian-empire', 'ur-iii-kingdom', 'old-babylonian-kingdom', 'mesopotamian-temple', 'cuneiform', 'amarna-letters-corpus', 'late-bronze-palace-system', 'neo-assyrian-empire'],
      eventIds: ['event-ur-iii-formation', 'event-ur-iii-fragmentation', 'event-hammurabi-conquests', 'event-old-babylonian-fragmentation'],
      title: '两河流域的城市比王朝更长久',
      editorialPurpose: '从苏美尔城市走到中亚述，理解不同王朝怎样反复接管并改造两河流域的城市、神庙、书写与行政经验。',
      introduction: '在巴比伦和亚述成为大国以前，两河流域已经有许多城市和王国。一次次征服改变了首都和疆界，后来者却常常走进旧城，接管神庙、书吏和泥板，再用这些遗产建立新的秩序。',
      thesis: {
        text: '青铜时代的两河流域由多个城市和政权反复重组而成。苏美尔城市、阿卡德、乌尔、巴比伦和亚述并不是同一个王朝的连续阶段，但新的统治者不断采用并改变已有的城市、书写、神庙和行政实践，使区域秩序在王朝终结后仍能再次建立。',
        sourceIds: ['source-adams-heartland-cities', 'source-met-akkadian-period', 'source-garfinkle-kingdom-ur', 'source-met-isin-larsa-old-babylonian', 'source-brinkman-kassite-history', 'source-oracc-middle-assyrian']
      },
      timeSpan: timeSpan(-3500, -1000, '约公元前3500—前1000年', true),
      sceneIds: [
        'mesopotamia-many-cities-between-rivers',
        'mesopotamia-akkad-gathers-cities',
        'mesopotamia-ur-tablets-reorder-cities',
        'mesopotamia-babylon-becomes-center',
        'mesopotamia-babylon-writes-assyria-grows',
        'mesopotamia-cities-do-not-go-dark'
      ],
      sourceIds: ['source-adams-heartland-cities', 'source-met-uruk-first-city', 'source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-met-isin-larsa-old-babylonian', 'source-podany-hammurabi-babylon', 'source-brinkman-kassite-history', 'source-met-amarna-letters', 'source-moran-amarna-letters', 'source-oracc-middle-assyrian', 'source-van-de-mieroop-ancient-near-east', 'source-radner-ancient-assyria'],
      editorialReview: {
        limitations: [
          limitation('mesopotamia-region-review-continuity', '城市、神庙和书写的延续不等于社会生活毫无断裂；战争、人口变化和王朝瓦解仍会造成严重损失。', ['source-cambridge-ur-iii-old-babylonian-transition', 'source-van-de-mieroop-ancient-near-east'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('mesopotamia-region-review-kassite-transition', '古巴比伦第一王朝结束后，加喜特统治形成的具体过程和早期时序仍不完整。', ['source-brinkman-kassite-history'])
        ],
        alternativeExplanations: [
          interpretation('mesopotamia-region-review-persistence', '区域秩序能够重建，可能同时来自城市人口、农业基础、神庙资源、书吏传统和新统治者的政治投入，不能归因于单一制度。', ['source-adams-heartland-cities', 'source-goddeeris-old-babylonian-economy', 'source-van-de-mieroop-ancient-near-east'])
        ],
        sourceIds: ['source-adams-heartland-cities', 'source-cambridge-ur-iii-old-babylonian-transition', 'source-brinkman-kassite-history', 'source-oracc-middle-assyrian', 'source-van-de-mieroop-ancient-near-east']
      }
    },
    {
      id: 'mesopotamian-temple-overview',
      kind: 'overview',
      primaryEntityId: 'mesopotamian-temple',
      relatedEntityIds: ['uruk', 'ur-iii-kingdom', 'old-babylonian-kingdom', 'tower-of-babel-tradition'],
      eventIds: [],
      title: '神庙穿过城邦与王朝',
      editorialPurpose: '一座供奉神明的建筑，为什么会成为城市里延续最久的公共机构之一？',
      introduction: '在两河流域，城市会被摧毁，王朝会改名，神庙却一次次在旧址上重建。',
      thesis: {
        text: '神庙从早期聚落中的特殊建筑，逐渐成为连接仪式、城市身份、物资组织与王权表达的制度；它的延续来自不断重组，而非一成不变。',
        sourceIds: ['source-yale-ubaid-summary', 'source-met-ur-ziggurat', 'source-met-isin-larsa-old-babylonian']
      },
      timeSpan: timeSpan(-5000, -539, '约公元前五千纪—前6世纪', true),
      sceneIds: [
        'mesopotamian-temple-eridu',
        'mesopotamian-temple-uruk',
        'mesopotamian-temple-ur',
        'mesopotamian-temple-old-babylonian'
      ],
      sourceIds: ['source-yale-ubaid-summary', 'source-met-uruk-first-city', 'source-met-ur-ziggurat', 'source-goddeeris-old-babylonian-economy', 'source-met-isin-larsa-old-babylonian', 'source-british-museum-etemenanki-tablet'],
      editorialReview: {
        limitations: [
          limitation('mesopotamian-temple-review-evidence', '早期建筑是否属于神庙仍依赖考古解释，保存下来的神庙档案也不能代表城市全部活动。', ['source-yale-ubaid-summary', 'source-goddeeris-old-babylonian-economy'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('mesopotamian-temple-review-functions', '不同建筑空间的用途，以及早期高台与后期塔庙之间的连续程度仍不完全确定。', ['source-met-uruk-first-city', 'source-met-ur-ziggurat'])
        ],
        alternativeExplanations: [
          interpretation('mesopotamian-temple-review-continuity', '神庙的延续可能同时来自仪式、城市身份、经济资源、地方传统和王权投入。', ['source-met-mesopotamian-deities', 'source-met-isin-larsa-old-babylonian'])
        ],
        sourceIds: ['source-yale-ubaid-summary', 'source-met-uruk-first-city', 'source-met-ur-ziggurat', 'source-goddeeris-old-babylonian-economy', 'source-met-isin-larsa-old-babylonian', 'source-british-museum-etemenanki-tablet']
      }
    },
    {
      id: 'cuneiform-overview',
      kind: 'overview',
      primaryEntityId: 'cuneiform',
      relatedEntityIds: ['sumer', 'uruk', 'hammurabi-code', 'amarna-letters-corpus', 'neo-assyrian-empire'],
      eventIds: [],
      title: '泥板学会记录语言',
      editorialPurpose: '一套原本擅长记数量的符号，怎样变成能够记录不同语言，并被宫廷、帝国和学者沿用三千多年的文字？',
      introduction: '最早的泥板并没有写诗；真正奇妙的变化，是这些符号后来学会了记录人的语言。',
      thesis: {
        text: '楔形文字没有单一的发明时刻；它从管理记录中形成，经过数百年调整获得记录词语、声音和语法的能力，又因不同语言、宫廷和学术传统持续改造而延续三千多年。',
        sourceIds: ['source-englund-proto-cuneiform', 'source-damerow-writing-epistemology', 'source-british-museum-cuneiform', 'source-met-grammatical-text-object']
      },
      timeSpan: timeSpan(-3350, 75, '约公元前3350—公元75年', true),
      sceneIds: [
        'cuneiform-quantities',
        'cuneiform-before-sentences',
        'cuneiform-wedges',
        'cuneiform-sound',
        'cuneiform-language',
        'cuneiform-many-languages'
      ],
      sourceIds: ['source-englund-proto-cuneiform', 'source-met-origins-writing', 'source-damerow-writing-epistemology', 'source-penn-uses-writing', 'source-isac-writing-early-mesopotamia', 'source-british-museum-cuneiform', 'source-met-grammatical-text-object', 'source-met-amarna-letters', 'source-bm-ashurbanipal-library'],
      editorialReview: {
        limitations: [
          limitation('cuneiform-review-survival', '保存下来的早期材料偏向管理记录，不能代表当时全部交流方式。', ['source-englund-proto-cuneiform', 'source-damerow-writing-epistemology'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('cuneiform-review-maturity', '最早泥板与口语的具体对应关系，以及所谓成熟文字的精确界线仍不确定。', ['source-englund-proto-cuneiform', 'source-damerow-writing-epistemology'])
        ],
        alternativeExplanations: [
          interpretation('cuneiform-review-causes', '文字形成可能由行政、仪式、身份标识和既有视觉传统共同推动，并非单一需求的结果。', ['source-met-origins-writing', 'source-penn-uses-writing'])
        ],
        sourceIds: ['source-englund-proto-cuneiform', 'source-met-origins-writing', 'source-damerow-writing-epistemology', 'source-penn-uses-writing']
      }
    },
    {
      id: 'akkadian-empire-overview',
      kind: 'overview',
      primaryEntityId: 'akkadian-empire',
      relatedEntityIds: ['sumer', 'uruk', 'cuneiform', 'ur-iii-kingdom'],
      eventIds: [],
      title: '从征服城邦到统治帝国',
      editorialPurpose: '阿卡德王朝征服说不同语言、忠于不同城市传统的人群以后，怎样维持第一个帝国？',
      introduction: '萨尔贡的王朝同样生长在美索不达米亚，却不属于苏美尔城邦传统。它从阿卡德出发征服南方城市；接下来要解决的，不是怎样再赢一仗，而是怎样统治语言和传统都不同的臣民。',
      thesis: {
        text: '阿卡德王朝由使用闪米特语族阿卡德语的统治者建立，并不是苏美尔王朝。它以征服创建第一个帝国，又通过官员、军队、土地、王室成员和地方精英维持统治。王朝最终瓦解，但它扩展王权的方法影响了随后的乌尔第三王朝。',
        sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-foster-sargonic-administration']
      },
      timeSpan: timeSpan(-2350, -2150, '约公元前2350—前2150年', true),
      sceneIds: [
        'akkadian-empire-city-states',
        'akkadian-empire-sargon-memory',
        'akkadian-empire-conquests',
        'akkadian-empire-fragmentation'
      ],
      sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-fordham-sargon-birth-legend', 'source-etcsl-sargon-ur-zababa', 'source-foster-sargonic-administration', 'source-frayne-sargonic-inscriptions', 'source-british-museum-enheduanna', 'source-eckart-akkadian-empire', 'source-garfinkle-kingdom-ur'],
      editorialReview: {
        limitations: [
          limitation('akkadian-empire-review-royal-evidence', '主要证据大量来自王室铭文、后世抄本和保存不均的行政材料。', ['source-frayne-sargonic-inscriptions', 'source-westenholz-kingdom-akkad'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('akkadian-empire-review-extent', '不同地区的实际控制程度，以及王朝晚期的具体时序仍不确定。', ['source-met-akkadian-period', 'source-eckart-akkadian-empire']),
          interpretation('akkadian-empire-review-language-identity', '阿卡德语属于闪米特语族，但语言分类不能直接等同于现代民族身份。', ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad'])
        ],
        alternativeExplanations: [
          interpretation('akkadian-empire-review-fragmentation', '王朝收缩可能同时涉及继承问题、地方反抗、行政成本、外部冲突和环境压力。', ['source-eckart-akkadian-empire', 'source-lawrence-climate-urbanism'])
        ],
        sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-frayne-sargonic-inscriptions', 'source-eckart-akkadian-empire', 'source-lawrence-climate-urbanism', 'source-foster-sargonic-administration']
      }
    },
    {
      id: 'gilgamesh-mortality',
      kind: 'story',
      primaryEntityId: 'epic-of-gilgamesh',
      relatedEntityIds: ['cuneiform', 'uruk'],
      eventIds: [],
      title: '吉尔伽美什没有找到永生',
      editorialPurpose: '一个能够战胜人和怪物的英雄，怎样在朋友死后发现自己无法战胜死亡？',
      introduction: '一个英雄最害怕的，不是遇到更强的敌人，而是在朋友死后看见自己的结局。',
      thesis: {
        text: '恩奇都之死让吉尔伽美什开始恐惧自己的死亡。他走到世界尽头，听完洪水幸存者的故事，最后却连恢复青春的植物也没有保住，只能带着失败回到乌鲁克。',
        sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-oxford-classical-dictionary-gilgamesh']
      },
      timeSpan: timeSpan(-2000, -600, '约公元前二千纪早期—前一千纪中期的文本传统', true),
      sceneIds: [
        'gilgamesh-many-tablets',
        'gilgamesh-enkidu-enters-uruk',
        'gilgamesh-rivals-become-friends',
        'gilgamesh-cedar-forest',
        'gilgamesh-bull-of-heaven',
        'gilgamesh-enkidu-dies',
        'gilgamesh-worlds-end',
        'gilgamesh-flood-survivor',
        'gilgamesh-immortality-lost'
      ],
      sourceIds: [
        'source-george-babylonian-gilgamesh-epic',
        'source-george-gilgamesh-whats-new',
        'source-oxford-classical-dictionary-gilgamesh',
        'source-met-gilgamesh-overview',
        'source-british-museum-gilgamesh-tablet-i',
        'source-british-museum-gilgamesh-tablet-vi',
        'source-british-museum-gilgamesh-flood-tablet',
        'source-soas-gilgamesh-old-babylonian-x',
        'source-etcsl-gilgamesh-stories'
      ],
      editorialReview: {
        limitations: [
          limitation('gilgamesh-review-survival', '现存文本来自不同时代、地点和抄写环境，泥板缺损与现代拼合影响今天所读到的连续性。', ['source-george-babylonian-gilgamesh-epic', 'source-george-gilgamesh-whats-new'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('gilgamesh-review-versions', '古巴比伦版本与标准巴比伦版本对西杜丽、恩奇都及部分旅程的安排并不相同。', ['source-george-babylonian-gilgamesh-epic', 'source-soas-gilgamesh-old-babylonian-x']),
          interpretation('gilgamesh-review-historical-identity', '是否存在能够与文学人物直接对应的历史吉尔伽美什仍不确定。', ['source-oxford-classical-dictionary-gilgamesh', 'source-etcsl-gilgamesh-stories']),
          interpretation('gilgamesh-review-formation', '标准版本形成的具体年代、编辑过程及其作者归属不能写成已经解决的问题。', ['source-george-babylonian-gilgamesh-epic', 'source-george-gilgamesh-whats-new'])
        ],
        alternativeExplanations: [
          interpretation('gilgamesh-review-ending', '结尾可以从接受有限生命、返回王权责任、城市建造或文字保存名声等角度理解，这些解释可以并存。', ['source-george-babylonian-gilgamesh-epic', 'source-met-gilgamesh-overview'])
        ],
        sourceIds: [
          'source-george-babylonian-gilgamesh-epic',
          'source-george-gilgamesh-whats-new',
          'source-oxford-classical-dictionary-gilgamesh',
          'source-soas-gilgamesh-old-babylonian-x',
          'source-etcsl-gilgamesh-stories'
        ]
      }
    },
    {
      id: 'ur-iii-reordered-city-world',
      kind: 'story',
      primaryEntityId: 'ur-iii-kingdom',
      relatedEntityIds: ['sumer', 'akkadian-empire', 'uruk', 'cuneiform', 'mesopotamian-temple', 'old-babylonian-kingdom'],
      eventIds: ['event-ur-iii-formation', 'event-ur-iii-fragmentation'],
      title: '泥板让许多城市一起运转',
      editorialPurpose: '阿卡德王朝收缩以后，乌尔怎样通过王权、建造和书写重新组织南部城市，这种秩序又为什么瓦解？',
      introduction: '阿卡德王朝的统治收缩以后，南部美索不达米亚没有立刻进入另一个完整帝国。乌尔第三王朝正是在这个破碎的政治世界里逐步形成的。',
      thesis: {
        text: '乌尔第三王朝把王权、神庙、地方行政和大量书写记录重新组合起来，形成强大的跨城市秩序；王朝最终瓦解，它使用的书写、法律和行政实践却进入了下一个时代。',
        sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-cambridge-ur-iii-old-babylonian-transition']
      },
      timeSpan: timeSpan(-2112, -2004, '约公元前2112—前2004年', true),
      sceneIds: [
        'ur-iii-rises-after-akkad',
        'ur-iii-building-order',
        'ur-iii-tablet-administration',
        'ur-iii-fragmentation'
      ],
      sourceIds: [
        'source-garfinkle-kingdom-ur',
        'source-steinkeller-ur-iii-core-periphery',
        'source-oracc-ur-namma-inscriptions',
        'source-met-ur-nammu-foundation-figure-object',
        'source-met-ur-ziggurat',
        'source-hilgert-drehem-administrative-documents',
        'source-british-museum-ur-iii-barley-rations',
        'source-british-museum-ur-iii-drehem-sheep',
        'source-british-museum-ur-iii-fields-yields',
        'source-cambridge-ur-iii-old-babylonian-transition'
      ],
      editorialReview: {
        limitations: [
          limitation('ur-iii-review-archive-bias', '王室铭文和机构档案对家庭生产、非机构交换及没有进入书写系统的活动反映不足。', ['source-corcoran-tadd-livestock-early-states', 'source-steinkeller-ur-iii-core-periphery'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('ur-iii-review-bala', '巴拉体系在不同时期、地区和资源类别中的具体运作仍有争论。', ['source-steinkeller-ur-iii-core-periphery', 'source-hilgert-drehem-administrative-documents']),
          interpretation('ur-iii-review-control', '王朝对核心区和外围的控制深度、地方自主程度与行政变化的统一程度并不固定。', ['source-steinkeller-ur-iii-core-periphery', 'source-rost-ur-iii-irrigation-umma'])
        ],
        alternativeExplanations: [
          interpretation('ur-iii-review-households', '机构记录之外仍存在家庭、商人、借贷和地方经济活动，动物遗存也会呈现文本不重视的生产。', ['source-corcoran-tadd-livestock-early-states', 'source-met-ur-iii-dugga-account']),
          interpretation('ur-iii-review-collapse', '王朝瓦解可能涉及政治离心、军事压力、粮食与财政困难及环境变化的相互作用。', ['source-garfinkle-kingdom-ur', 'source-cambridge-ur-iii-old-babylonian-transition'])
        ],
        sourceIds: [
          'source-garfinkle-kingdom-ur',
          'source-corcoran-tadd-livestock-early-states',
          'source-steinkeller-ur-iii-core-periphery',
          'source-hilgert-drehem-administrative-documents',
          'source-rost-ur-iii-irrigation-umma',
          'source-met-ur-iii-dugga-account',
          'source-cambridge-ur-iii-old-babylonian-transition'
        ]
      }
    },
    {
      id: 'old-babylonian-rise-and-fragmentation',
      kind: 'story',
      primaryEntityId: 'old-babylonian-kingdom',
      relatedEntityIds: ['ur-iii-kingdom', 'hammurabi-code', 'tower-of-babel-tradition', 'mesopotamian-temple'],
      eventIds: ['event-hammurabi-conquests', 'event-old-babylonian-fragmentation'],
      title: '一座城成为王国中心',
      editorialPurpose: '巴比伦怎样从乌尔王朝之后的众多小国之一，短暂成为广大王国的中心，又为什么迅速收缩？',
      introduction: '乌尔王朝倒下后，每座城市都想填补它留下的空位。后来名震世界的巴比伦，此时只控制着河边一小片土地。',
      thesis: {
        text: '巴比伦用近百年在城市竞争中站稳，汉谟拉比又在晚年迅速打破力量平衡；大王国随后收缩，巴比伦这座城市的名字却继续吸引后来的统治者。',
        sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-podany-hammurabi-babylon', 'source-cdli-hammurabi-year-names']
      },
      timeSpan: timeSpan(-2004, -1595, '约公元前2004—前1595年', true),
      sceneIds: [
        'old-babylonian-after-ur-iii',
        'old-babylonian-small-river-kingdom',
        'old-babylonian-hammurabi-conquests',
        'old-babylonian-orders-and-institutions',
        'old-babylonian-fragmentation'
      ],
      sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-podany-hammurabi-babylon', 'source-cdli-hammurabi-year-names', 'source-cdli-samsuiluna-year-names', 'source-goddeeris-old-babylonian-economy'],
      editorialReview: {
        limitations: [
          limitation('old-babylonian-review-archaeology', '巴比伦城的古巴比伦层保存和发掘有限，许多城市史需要借助王室纪年名、书信和其他城市档案重建。', ['source-met-isin-larsa-old-babylonian', 'source-cdli-hammurabi-year-names'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('old-babylonian-review-alliances', '汉谟拉比晚年联盟转变和各次战争的完整过程仍不能仅凭胜利纪年完全还原。', ['source-cdli-hammurabi-year-names', 'source-podany-hammurabi-babylon'])
        ],
        alternativeExplanations: [
          interpretation('old-babylonian-review-rise', '巴比伦的上升既涉及汉谟拉比的军事选择，也依赖前代国王积累、河道交通、地方行政和对手力量变化。', ['source-met-isin-larsa-old-babylonian', 'source-goddeeris-old-babylonian-economy'])
        ],
        sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-podany-hammurabi-babylon', 'source-cdli-hammurabi-year-names', 'source-goddeeris-old-babylonian-economy']
      }
    },
    {
      id: 'hammurabi-code-justice',
      kind: 'story',
      primaryEntityId: 'hammurabi-code',
      relatedEntityIds: ['old-babylonian-kingdom', 'cuneiform', 'tower-of-babel-tradition'],
      eventIds: ['event-hammurabi-code-stele'],
      title: '石碑上的公正',
      editorialPurpose: '一块大型王室石碑怎样通过具体纠纷，展示国王所承诺的秩序、公正和社会等级？',
      introduction: '一块比人还高的黑色石碑，把被打瞎的眼睛、冲毁的田地、失败的手术和被俘的士兵放在一起。国王要让人相信：无论发生什么纠纷，他都能给出秩序。',
      thesis: {
        text: '石碑以神授王权和大量具体案件展示汉谟拉比的裁判权；它既规定对等惩罚，也公开区分社会等级，并在灾害、债务和服役中保护维持家庭生活的财产。',
        sourceIds: ['source-louvre-hammurabi-code', 'source-ehammurabi-laws', 'source-isac-law-society']
      },
      timeSpan: timeSpan(-1750, -1750, '约公元前1750年的石碑及其文本传统', true),
      sceneIds: [
        'hammurabi-code-divine-justice',
        'hammurabi-code-final-judge',
        'hammurabi-code-equal-retaliation',
        'hammurabi-code-status-inequality',
        'hammurabi-code-property-welfare',
        'hammurabi-code-transmission-discovery'
      ],
      sourceIds: ['source-louvre-hammurabi-code', 'source-ehammurabi-laws', 'source-cdli-law-collections', 'source-isac-law-society', 'source-cambridge-hammurabi-copies'],
      editorialReview: {
        limitations: [
          limitation('hammurabi-code-review-court-records', '石碑上的案件不是保存下来的法庭判决档案，不能直接代表每一次现实审判。', ['source-isac-law-society', 'source-cdli-law-collections'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('hammurabi-code-review-display', '石碑最初陈列地点、普通人接触文字的方式以及法官在具体案件中如何使用这些条文仍不完全确定。', ['source-louvre-hammurabi-code', 'source-isac-law-society'])
        ],
        alternativeExplanations: [
          interpretation('hammurabi-code-review-purpose', '研究者会把它理解为王室公正宣言、书吏训练传统、案例汇编或这些功能的结合。', ['source-cdli-law-collections', 'source-cambridge-hammurabi-copies'])
        ],
        sourceIds: ['source-louvre-hammurabi-code', 'source-cdli-law-collections', 'source-isac-law-society', 'source-cambridge-hammurabi-copies']
      }
    },
    {
      id: 'tower-of-babel-story-and-etemenanki',
      kind: 'story',
      primaryEntityId: 'tower-of-babel-tradition',
      relatedEntityIds: ['old-babylonian-kingdom', 'hammurabi-code', 'mesopotamian-temple'],
      eventIds: ['event-etemenanki-rebuilding'],
      title: '一座高塔进入另一种记忆',
      editorialPurpose: '《创世记》的建塔故事怎样与巴比伦真实存在的埃特曼安吉塔庙产生联系，又为什么不能简单等同？',
      introduction: '一群说着同一种语言的人想建造通天高塔；在故事之外，巴比伦也真的有一座反复重建的巨大塔庙。',
      thesis: {
        text: '《创世记》用建塔、语言混乱和人群分散解释“巴别”的名字；巴比伦的埃特曼安吉很可能构成故事的历史背景，但真实建筑进入文本后获得了新的意义。',
        sourceIds: ['source-sefaria-genesis-11', 'source-george-tower-of-babel', 'source-met-etemenanki-cylinder']
      },
      timeSpan: timeSpan(-1000, -331, '约公元前一千纪的文本传统与埃特曼安吉晚期历史', true),
      sceneIds: [
        'tower-of-babel-builders-stay-together',
        'tower-of-babel-languages-stop-work',
        'tower-of-babel-real-etemenanki',
        'tower-of-babel-evidence-and-reconstruction',
        'tower-of-babel-building-becomes-memory'
      ],
      sourceIds: ['source-sefaria-genesis-11', 'source-george-tower-of-babel', 'source-met-etemenanki-cylinder', 'source-oracc-nebuchadnezzar-etemenanki', 'source-british-museum-etemenanki-tablet'],
      editorialReview: {
        limitations: [
          limitation('tower-of-babel-review-evidence-systems', '《创世记》的文学文本和巴比伦塔庙的考古、铭文证据属于不同证据系统，不能把故事当作建筑报告。', ['source-sefaria-genesis-11', 'source-george-tower-of-babel'])
        ],
        counterexamples: [],
        uncertainties: [
          interpretation('tower-of-babel-review-influence', '故事形成的具体年代、埃特曼安吉影响文本的方式，以及塔庙最终高度与完成程度仍有争论。', ['source-george-tower-of-babel', 'source-wikimedia-esagil-tablet'])
        ],
        alternativeExplanations: [
          interpretation('tower-of-babel-review-other-towers', '作者也可能综合了其他美索不达米亚塔庙、城市记忆和关于语言分化的传统。', ['source-george-tower-of-babel'])
        ],
        sourceIds: ['source-sefaria-genesis-11', 'source-george-tower-of-babel', 'source-met-etemenanki-cylinder', 'source-wikimedia-esagil-tablet']
      }
    }
  ];

  const scenes = [
    {
      id: 'mesopotamia-many-cities-between-rivers',
      title: '许多城市在两条河之间出现',
      eyebrow: '公元前四千纪后期',
      timeSpan: timeSpan(-3500, -2350, '约公元前3500—前2350年', true),
      contentBlocks: [
        fact('mesopotamia-many-cities-between-rivers-fact', '在今天伊拉克南部，幼发拉底河与底格里斯河带来的水和泥沙养育了大片农田。到公元前四千纪后期，乌鲁克、乌尔等城市逐渐长大，神庙、仓库、书吏和统治者共同组织城市生活。许多居民使用苏美尔语，今天人们把这一城市传统称为苏美尔。苏美尔并不是一个统一王国：水渠、土地、贸易和战争让这些城市彼此依赖，也让它们不断竞争。', ['source-adams-heartland-cities', 'source-met-uruk-first-city', 'source-met-origins-writing'])
      ],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-mesopotamia-early-cities',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'mesopotamia-region', annotationId: 'annotation-mesopotamia-early-uruk', sourceIds: ['source-met-uruk-first-city'] },
            { kind: 'entity', entityId: 'mesopotamia-region', annotationId: 'annotation-mesopotamia-early-ur', sourceIds: ['source-met-ur-ziggurat'] },
            { kind: 'entity', entityId: 'mesopotamia-region', annotationId: 'annotation-mesopotamia-early-nippur', sourceIds: ['source-adams-heartland-cities'] },
            { kind: 'entity', entityId: 'mesopotamia-region', annotationId: 'annotation-mesopotamia-early-lagash', sourceIds: ['source-adams-heartland-cities'] }
          ],
          caption: '四个棕色圆点与文字标出乌鲁克、乌尔、尼普尔和拉格什；它们是早期南部城市世界的代表，并非完整城市名录。'
        }
      },
      sourceIds: ['source-adams-heartland-cities', 'source-met-uruk-first-city', 'source-met-origins-writing', 'source-met-ur-ziggurat', 'source-natural-earth']
    },
    {
      id: 'mesopotamia-akkad-gathers-cities',
      title: '阿卡德把许多城市纳入帝国',
      eyebrow: '约公元前2350—前2150年',
      timeSpan: timeSpan(-2350, -2150, '约公元前2350—前2150年', true),
      contentBlocks: [
        fact('mesopotamia-akkad-gathers-cities-fact', '约公元前二十四世纪，一个使用阿卡德语的王朝从两河流域中部兴起，征服了南部的苏美尔城市。国王派官员和军队进入各地，也让王室成员掌管重要神庙。地方书吏、土地制度和城市精英仍然参与统治。阿卡德由此把原本各自为政的城市放进一个更大的帝国，却没有把它们变成彼此相同的地方。', ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-foster-sargonic-administration'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-akkadian-naram-sin-victory-stele' },
      sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-foster-sargonic-administration', 'source-wikimedia-naram-sin-victory-stele', 'source-louvre-naram-sin-victory-stele']
    },
    {
      id: 'mesopotamia-ur-tablets-reorder-cities',
      title: '乌尔用泥板重新组织城市世界',
      eyebrow: '约公元前2112—前2004年',
      timeSpan: timeSpan(-2112, -2004, '约公元前2112—前2004年', true),
      contentBlocks: [
        fact('mesopotamia-ur-tablets-reorder-cities-fact', '阿卡德王朝瓦解后，南部城市重新展开竞争。约公元前二十一世纪，乌尔建立新的王朝，再次让多座城市服从同一个中心。成千上万块泥板记录田地、谷物、牲畜、工匠和劳动力，让王宫、神庙和地方官员能够核对跨城市流动的资源。乌尔王朝后来也倒下了，这些书写和行政经验则进入伊辛、拉尔萨等后继王国。', ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-cambridge-ur-iii-old-babylonian-transition'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-mesopotamian-temple-ur-ziggurat' },
      sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-cambridge-ur-iii-old-babylonian-transition', 'source-wikimedia-ur-ziggurat-photo', 'source-met-ur-ziggurat']
    },
    {
      id: 'mesopotamia-babylon-becomes-center',
      title: '巴比伦从小城变成新的中心',
      eyebrow: '约公元前2004—前1595年',
      timeSpan: timeSpan(-2004, -1595, '约公元前2004—前1595年', true),
      contentBlocks: [
        fact('mesopotamia-babylon-becomes-center-fact', '乌尔王朝结束后，伊辛、拉尔萨和其他城市先后争夺南部。幼发拉底河边的巴比伦起初只控制周围一小片土地，经过数代经营才站稳脚跟。汉谟拉比在统治晚年连续击败主要对手，使巴比伦短暂成为广大王国的中心。第一王朝后来在领土收缩和赫梯军队的突袭中结束，巴比伦城、神庙和书吏传统却没有随之消失。', ['source-met-isin-larsa-old-babylonian', 'source-podany-hammurabi-babylon', 'source-cdli-hammurabi-year-names', 'source-cdli-samsuiluna-year-names'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-hammurabi-code-stele' },
      sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-podany-hammurabi-babylon', 'source-cdli-hammurabi-year-names', 'source-cdli-samsuiluna-year-names', 'source-wikimedia-hammurabi-full-stele', 'source-louvre-hammurabi-code']
    },
    {
      id: 'mesopotamia-babylon-writes-assyria-grows',
      title: '巴比伦重新写信，亚述在北方成长',
      eyebrow: '约公元前1595—前1200年',
      timeSpan: timeSpan(-1595, -1200, '约公元前1595—前1200年', true),
      contentBlocks: [
        fact('mesopotamia-babylon-writes-assyria-grows-fact', '第一王朝结束后，加喜特王族逐渐统治巴比伦尼亚。他们在巴比伦等旧城市建立王权，赞助当地神庙，并继续使用楔形文字处理政务。两个多世纪后，巴比伦国王已经作为“大王”同埃及交换书信、礼物和王室婚姻。与此同时，北方的阿淑尔也从商贸城市发展成中亚述王国，开始向外扩张并进入大国外交。两河流域由此形成南方巴比伦尼亚与北方亚述两个长期政治中心。', ['source-brinkman-kassite-history', 'source-met-amarna-letters', 'source-moran-amarna-letters', 'source-oracc-middle-assyrian'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-kassite-kurigalzu-kudurru' },
      sourceIds: ['source-brinkman-kassite-history', 'source-met-kassite-period', 'source-met-amarna-letters', 'source-moran-amarna-letters', 'source-oracc-middle-assyrian', 'source-wikimedia-kurigalzu-kudurru']
    },
    {
      id: 'mesopotamia-cities-do-not-go-dark',
      title: '两河流域没有随宫殿一起熄灭',
      eyebrow: '公元前十二至十一世纪',
      timeSpan: timeSpan(-1200, -1000, '约公元前1200—前1000年', true),
      contentBlocks: [
        synthesis('mesopotamia-cities-do-not-go-dark-synthesis', '公元前十二至十一世纪，巴比伦和亚述都经历了严重转折。来自东面的埃兰王国军队攻入巴比伦尼亚，结束了加喜特王朝；中亚述也失去许多外围领土，过去伸向叙利亚的权力网络随之收缩。巴比伦、阿淑尔等城市仍然存在，神庙和楔形文字书写也继续运转。这些仍在运转的城市和制度，构成了下一段历史的起点：进入公元前一千纪，亚述将从北方重新扩张。', ['source-brinkman-kassite-history', 'source-oracc-middle-assyrian', 'source-van-de-mieroop-ancient-near-east', 'source-radner-ancient-assyria'])
      ],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-mesopotamia-babylon-ashur',
          transition: 'ease',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'mesopotamia-region', annotationId: 'annotation-mesopotamia-continuity-babylon', sourceIds: ['source-brinkman-kassite-history'] },
            { kind: 'entity', entityId: 'mesopotamia-region', annotationId: 'annotation-mesopotamia-continuity-ashur', sourceIds: ['source-oracc-middle-assyrian'] }
          ],
          caption: '两个棕色圆点与文字分别标出南方的巴比伦和北方的阿淑尔；地图不绘制统一疆界，两城在危机后仍是各自政治传统的中心。'
        }
      },
      sourceIds: ['source-brinkman-kassite-history', 'source-oracc-middle-assyrian', 'source-van-de-mieroop-ancient-near-east', 'source-radner-ancient-assyria', 'source-natural-earth']
    },
    {
      id: 'mesopotamian-temple-eridu',
      title: '一间房被不断重建',
      eyebrow: '约公元前五千纪',
      timeSpan: timeSpan(-5000, -4000, '约公元前5000—前4000年', true),
      contentBlocks: [
        interpretation('mesopotamian-temple-eridu-interpretation', '埃里都的一些建筑被拆除后，又在原处反复重建。它们并不宏伟，却拥有不同于普通住宅的布局和器物。一些考古学者把它们解释为早期神庙，但我们无法给每一面墙确定用途。神庙的故事，可能就开始于人们一次次回到同一个地方。', ['source-yale-ubaid-summary'])
      ],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-mesopotamian-temple-places',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'mesopotamian-temple', annotationId: 'annotation-mesopotamia-temple-cities', sourceIds: ['source-yale-ubaid-summary', 'source-met-uruk-first-city', 'source-met-ur-ziggurat', 'source-met-isin-larsa-old-babylonian'] }
          ],
          caption: '四个棕色圆点依次代表埃里都、乌鲁克、乌尔与巴比伦；文字标出这组神庙故事中的城市，它们不是同一时期的政治范围。'
        }
      },
      sourceIds: ['source-yale-ubaid-summary', 'source-met-uruk-first-city', 'source-met-ur-ziggurat', 'source-met-isin-larsa-old-babylonian', 'source-natural-earth']
    },
    {
      id: 'mesopotamian-temple-uruk',
      title: '乌鲁克把神庙放进城市中心',
      eyebrow: '公元前四千纪晚期',
      timeSpan: timeSpan(-3500, -3000, '约公元前3500—前3000年', true),
      contentBlocks: [
        interpretation('mesopotamian-temple-uruk-interpretation', '到了乌鲁克，泥砖高台、庭院和厅堂组成了远超普通住宅的大型建筑群。这里可能举行仪式，也可能储存物资、召集劳力和展示城市秩序。城市还把自己与守护神联系起来，使主神庙成为讲述“我们是谁”的地方。不过，这些大型建筑并非全部都是神庙，城市也从来不只由宗教组织。', ['source-met-uruk-first-city', 'source-dai-uruk', 'source-met-mesopotamian-deities'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-mesopotamian-temple-uruk-eanna-plan' },
      sourceIds: ['source-met-uruk-first-city', 'source-dai-uruk', 'source-met-mesopotamian-deities', 'source-wikimedia-eanna-4b-plan']
    },
    {
      id: 'mesopotamian-temple-ur',
      title: '乌尔把神庙举向天空',
      eyebrow: '约公元前2100年',
      timeSpan: timeSpan(-2112, -2004, '约公元前2112—前2004年', true),
      contentBlocks: [
        fact('mesopotamian-temple-ur-fact', '到乌尔第三王朝，神庙已经不只是一座举行仪式的建筑。它需要土地、仓库、牲畜和工作人员来维持供奉，也参与物资与劳力的组织。乌尔那木又为月神修建巨大的阶梯形塔庙，并把自己的名字留在砖块和奠基物上。国王借修建神庙表达虔敬，也宣告自己恢复了城市秩序。', ['source-met-ur-ziggurat', 'source-goddeeris-old-babylonian-economy'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-mesopotamian-temple-ur-ziggurat' },
      sourceIds: ['source-met-ur-ziggurat', 'source-goddeeris-old-babylonian-economy']
    },
    {
      id: 'mesopotamian-temple-old-babylonian',
      title: '巴比伦继续重建神庙',
      eyebrow: '古巴比伦至新巴比伦',
      timeSpan: timeSpan(-2004, -539, '约公元前2004—前539年', true),
      contentBlocks: [
        synthesis('mesopotamian-temple-old-babylonian-synthesis', '到了古巴比伦时期，神庙仍拥有土地、人员和仪式职责，却要与王宫、地方精英、家族和私人经营者共同生活。不同城市的安排并不相同，神庙也可能失去资源、获得修复或改变职能。几个世纪以后，新巴比伦王朝重建了巴比伦的埃特曼安吉塔庙；它常被后世与《圣经》中的巴别塔联系起来，但两者不能直接画等号。神庙能穿过城邦与王朝，并不是因为从未改变，而是因为每个时代都重新安排了它的位置。', ['source-goddeeris-old-babylonian-economy', 'source-met-isin-larsa-old-babylonian', 'source-british-museum-etemenanki-tablet'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-mesopotamian-temple-old-babylonian' },
      sourceIds: ['source-goddeeris-old-babylonian-economy', 'source-met-isin-larsa-old-babylonian', 'source-british-museum-etemenanki-tablet', 'source-wikimedia-etemenanki-reconstruction']
    },
    {
      id: 'cuneiform-quantities',
      title: '泥板先记数量',
      eyebrow: '约公元前3350—前3000年',
      timeSpan: timeSpan(-3350, -3000, '约公元前3350—前3000年', true),
      contentBlocks: [
        fact('cuneiform-quantities-fact', '乌鲁克最早的一批泥板上，挤满了数量、货物和人员分类。它们记录粮食、牲畜、纺织品和劳动力，让一个人不必只靠记忆管理成百上千份物资。文字最初进入城市时，并不是为了讲故事，而是为了让复杂的事务留下痕迹。', ['source-englund-proto-cuneiform', 'source-met-origins-writing'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-sumer-uruk-proto-cuneiform-tablet' },
      sourceIds: ['source-englund-proto-cuneiform', 'source-met-origins-writing']
    },
    {
      id: 'cuneiform-before-sentences',
      title: '符号还说不出一句话',
      eyebrow: '公元前四千纪末',
      timeSpan: timeSpan(-3350, -3000, '约公元前3350—前3000年', true),
      contentBlocks: [
        interpretation('cuneiform-before-sentences-interpretation', '早期泥板能够告诉管理者“多少”和“哪一类”，却很难让今天的读者复原一句完整的话。符号的排列不像口语句子，语法和读音也很少被写下。它已经承担了文字的一部分工作，却还没有稳定地跟随语言前进。', ['source-englund-proto-cuneiform', 'source-damerow-writing-epistemology'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-cuneiform-proto-account-seal' },
      sourceIds: ['source-englund-proto-cuneiform', 'source-damerow-writing-epistemology', 'source-wikimedia-proto-cuneiform-barley-tablet-pd']
    },
    {
      id: 'cuneiform-wedges',
      title: '芦苇笔压出楔形',
      eyebrow: '公元前三千纪',
      timeSpan: timeSpan(-3000, -2000, '约公元前3000—前2000年', true),
      contentBlocks: [
        fact('cuneiform-wedges-fact', '湿泥适合按压，不适合慢慢画曲线。书写者把削过的芦苇笔压进泥面，留下粗细不同的楔形笔画。旧图像逐渐旋转、拆分和简化，写起来更快，也越来越不像它原本描绘的东西。“楔形”说的是笔画形状，并不是一种语言的名字。', ['source-british-museum-cuneiform', 'source-penn-uses-writing'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-cuneiform-stylus' },
      sourceIds: ['source-british-museum-cuneiform', 'source-penn-uses-writing']
    },
    {
      id: 'cuneiform-sound',
      title: '一个符号借出声音',
      eyebrow: '公元前三千纪',
      timeSpan: timeSpan(-3000, -2400, '约公元前3000—前2400年', true),
      contentBlocks: [
        interpretation('cuneiform-sound-interpretation', '一个符号不必永远只代表它画出的东西。书写者开始借用词语的读音，让旧符号去拼写人名、语法成分和无法画出来的概念。文字由此不再只给物品贴标签，而是慢慢靠近人们真正说出的语言。', ['source-penn-uses-writing', 'source-isac-writing-early-mesopotamia'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-cuneiform-sound' },
      sourceIds: ['source-penn-uses-writing', 'source-isac-writing-early-mesopotamia']
    },
    {
      id: 'cuneiform-language',
      title: '泥板开始跟着语言走',
      eyebrow: '公元前三千纪至后世',
      timeSpan: timeSpan(-2800, -2000, '约公元前2800—前2000年', true),
      contentBlocks: [
        interpretation('cuneiform-language-interpretation', '经过数百年调整，泥板能够更充分地记录词语、声音和语法。名单、契约、书信、王室铭文和文学作品逐渐进入书写世界。后来，《吉尔伽美什史诗》的不同版本也被书吏写在泥板上，让一段故事穿过许多时代。但这里没有一条清楚的毕业线，不同地区和文本采用新写法的速度并不一致。', ['source-damerow-writing-epistemology', 'source-isac-writing-early-mesopotamia', 'source-british-museum-gilgamesh-tablet-i'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-cuneiform-genres' },
      sourceIds: ['source-damerow-writing-epistemology', 'source-isac-writing-early-mesopotamia', 'source-british-museum-gilgamesh-tablet-i']
    },
    {
      id: 'cuneiform-many-languages',
      title: '一套文字写下多种语言',
      eyebrow: '公元前三千纪至公元一世纪',
      timeSpan: timeSpan(-2600, 75, '约公元前2600—公元75年', true),
      contentBlocks: [
        synthesis('cuneiform-many-languages-synthesis', '楔形文字起于南部美索不达米亚，后来被用来书写苏美尔语、阿卡德语、赫梯语、胡里安语等多种语言。不同语言会重新选择符号、调整读音，这套文字也随之改变。\n\n公元前二千纪，阿卡德语楔形文字成为宫廷外交工具，阿玛尔纳泥板保存了法老与外国国王用它交换信件的记录。公元前一千纪，亚述和巴比伦的书吏继续记录命令、占卜和天文观察，尼尼微也收藏并抄写古老文本。\n\n随着阿拉米语和希腊语等语言改用其他文字，楔形文字逐渐退入神庙和学者圈子。现存最后一份有明确年代的记录对应公元75年。它能延续三千多年，正因为一代代书吏不断改造它。', ['source-penn-uses-writing', 'source-british-museum-cuneiform', 'source-met-grammatical-text-object', 'source-met-amarna-letters', 'source-bm-ashurbanipal-library'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-cuneiform-many-languages' },
      sourceIds: ['source-penn-uses-writing', 'source-british-museum-cuneiform', 'source-met-grammatical-text-object', 'source-met-amarna-letters', 'source-bm-ashurbanipal-library']
    },
    {
      id: 'akkadian-empire-city-states',
      title: '阿卡德从苏美尔城邦之外兴起',
      eyebrow: '约公元前24世纪',
      timeSpan: timeSpan(-2400, -2300, '约公元前2400—前2300年', true),
      contentBlocks: [
        fact('akkadian-empire-city-states-fact', '萨尔贡兴起以前，苏美尔由许多彼此竞争的城邦组成。萨尔贡的王朝从阿卡德兴起，王室使用的阿卡德语不同于苏美尔语。它同样属于美索不达米亚，却不属于苏美尔城邦传统；萨尔贡通过战争，把南方城市纳入一个外来的王权。', ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad'])
      ],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-akkadian-southern-city-world',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'akkadian-empire', annotationId: 'annotation-akkadian-southern-city-world', sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad'] }
          ],
          caption: '半透明色块表示萨尔贡征服前后的南部美索不达米亚城邦世界；文字标出区域含义，色块不是固定国界。'
        }
      },
      sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-natural-earth']
    },
    {
      id: 'akkadian-empire-sargon-memory',
      title: '传说中的孩子成为征服者',
      eyebrow: '后世记忆与王室铭文',
      timeSpan: timeSpan(-2350, -600, '约公元前2350—前600年', true),
      contentBlocks: [
        interpretation('akkadian-empire-sargon-memory-birth-interpretation', '后世传说把萨尔贡写成一个来历隐秘的孩子：母亲把他放进涂有沥青的芦苇篮，任河水带走；一名取水人救起并养大了他。故事让人想象一个出身低微者怎样登上王位。', ['source-fordham-sargon-birth-legend', 'source-etcsl-sargon-ur-zababa', 'source-westenholz-kingdom-akkad']),
        fact('akkadian-empire-sargon-memory-conquest-fact', '萨尔贡的王朝从阿卡德出发，击败苏美尔城邦，把军队送往更远地区。王室铭文把远征写成国王力量的证明；对被征服的城市来说，战争带来了物资征集和新的服从关系。', ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-frayne-sargonic-inscriptions'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-akkadian-sargon-memory' },
      sourceIds: ['source-fordham-sargon-birth-legend', 'source-etcsl-sargon-ur-zababa', 'source-westenholz-kingdom-akkad', 'source-wikimedia-akkadian-ruler-head']
    },
    {
      id: 'akkadian-empire-conquests',
      title: '征服者必须借助当地人',
      eyebrow: '阿卡德王朝时期',
      timeSpan: timeSpan(-2350, -2150, '约公元前2350—前2150年', true),
      contentBlocks: [
        interpretation('akkadian-empire-conquests-interpretation', '阿卡德王室派出官员和军队控制土地与物资，也让一部分地方统治者和苏美尔书吏继续处理城市事务。萨尔贡还把女儿恩赫杜安娜安排为乌尔重要神庙的女祭司，让王室成员进入当地最有影响力的职位。外来的王朝想长期统治，就必须借助被征服城市原有的人、制度和信仰。', ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-foster-sargonic-administration', 'source-british-museum-enheduanna'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-akkadian-administration' },
      sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-foster-sargonic-administration', 'source-british-museum-enheduanna', 'source-wikimedia-enheduanna-disk']
    },
    {
      id: 'akkadian-empire-fragmentation',
      title: '帝国收缩，南方城市重新兴起',
      eyebrow: '约公元前22世纪',
      timeSpan: timeSpan(-2200, -2000, '约公元前2200—前2000年', true),
      contentBlocks: [
        synthesis('akkadian-empire-fragmentation-synthesis', '王朝后期，王位争夺和地方反抗逐渐削弱阿卡德的控制，南方一些城市重新取得独立。最后几位国王能够直接统治的土地不断缩小，帝国最终瓦解。此后，从南方兴起的乌尔第三王朝重新突出苏美尔语言和城市传统，也继承了组织多个城邦的统治经验。', ['source-met-akkadian-period', 'source-eckart-akkadian-empire', 'source-garfinkle-kingdom-ur'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-akkadian-fragmentation' },
      sourceIds: ['source-met-akkadian-period', 'source-eckart-akkadian-empire', 'source-garfinkle-kingdom-ur', 'source-met-ur-nammu-foundation-figure-object']
    },
    {
      id: 'gilgamesh-many-tablets',
      title: '泥板留下许多个吉尔伽美什',
      eyebrow: '跨越多个时代的文本传统',
      timeSpan: timeSpan(-2000, -600, '约公元前2000—前600年', true),
      contentBlocks: [
        fact('gilgamesh-many-tablets-fact', '吉尔伽美什的故事没有一个可以直接指认的“初稿”。现存较早材料包括五篇彼此独立的苏美尔语故事；到古巴比伦时期，书吏已经用阿卡德语重新组织他的经历。第一千纪的标准巴比伦版本保留了更完整的长篇结构，也留下若干不同抄本。后人把这些泥板拼合起来，才得到今天熟悉的故事。', ['source-george-babylonian-gilgamesh-epic', 'source-george-gilgamesh-whats-new', 'source-etcsl-gilgamesh-stories']),
        interpretation('gilgamesh-many-tablets-interpretation', '传统把吉尔伽美什描写为乌鲁克的古代国王，但现有证据不足以还原一个可以与史诗人物完全重合的历史人物。这里首先要进入的是一部不断被传抄和改写的文学作品，而不是一份王室编年史。', ['source-oxford-classical-dictionary-gilgamesh', 'source-british-museum-gilgamesh-tablet-i'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-gilgamesh-old-babylonian-fragments' },
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-george-gilgamesh-whats-new', 'source-oxford-classical-dictionary-gilgamesh', 'source-british-museum-gilgamesh-tablet-i', 'source-etcsl-gilgamesh-stories', 'source-wikimedia-gilgamesh-old-babylonian-fragments']
    },
    {
      id: 'gilgamesh-enkidu-enters-uruk',
      title: '恩奇都来到乌鲁克',
      eyebrow: '史诗叙事',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -600, '约公元前1000—前600年', true),
      contentBlocks: [
        synthesis('gilgamesh-enkidu-enters-uruk-king-synthesis', '在巴比伦版本的故事中，吉尔伽美什是乌鲁克强大的国王。他的母亲宁孙是一位女神，他拥有远超常人的力量和智慧，也主持修建了环绕城市的高墙。但年轻的吉尔伽美什不知道怎样节制自己的权力。他不断支使城中的青年，侵扰居民原有的生活。乌鲁克人的呼告传到诸神那里，诸神于是创造恩奇都，让他成为足以与国王抗衡的人。', ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-tablet-i']),
        synthesis('gilgamesh-enkidu-enters-uruk-shamhat-synthesis', '恩奇都最初生活在荒野，与野兽一同饮水，破坏猎人设置的陷阱。猎人无法接近他，便请来沙姆哈特。沙姆哈特是故事中一位来自城市社会的女子，也是引导恩奇都进入人类生活的人。与她相处以后，野兽不再像过去那样接纳恩奇都；她教他吃面包、喝啤酒、穿上衣服，并向他讲述乌鲁克和吉尔伽美什。恩奇都于是走向城市，准备阻止这位无人能够约束的国王。', ['source-george-babylonian-gilgamesh-epic', 'source-george-civilizing-enkidu', 'source-british-museum-gilgamesh-tablet-i'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-gilgamesh-uruk-kingship' },
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-george-civilizing-enkidu', 'source-british-museum-gilgamesh-tablet-i']
    },
    {
      id: 'gilgamesh-rivals-become-friends',
      title: '对手成为朋友',
      eyebrow: '史诗叙事',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -600, '约公元前1000—前600年', true),
      contentBlocks: [
        synthesis('gilgamesh-rivals-become-friends-fight-synthesis', '恩奇都挡住吉尔伽美什的道路，两人在门前搏斗。吉尔伽美什没有遇见过这样势均力敌的对手；搏斗结束后，他们不再继续争夺，而是承认彼此的力量，成为同行者。', ['source-george-babylonian-gilgamesh-epic']),
        synthesis('gilgamesh-rivals-become-friends-journey-synthesis', '成为朋友以后，两人的勇气很快彼此放大。吉尔伽美什提出前往遥远的雪松林，杀死守卫森林的洪巴巴，为自己取得长久的名声。恩奇都知道洪巴巴的可怕，起初警告他不要出发，最后却仍与他同行。', ['source-george-babylonian-gilgamesh-epic', 'source-oxford-classical-dictionary-gilgamesh'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-gilgamesh-rivals-become-friends' },
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-oxford-classical-dictionary-gilgamesh']
    },
    {
      id: 'gilgamesh-cedar-forest',
      title: '雪松林的胜利越过界限',
      eyebrow: '史诗叙事',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -600, '约公元前1000—前600年', true),
      contentBlocks: [
        synthesis('gilgamesh-cedar-forest-battle-synthesis', '吉尔伽美什和恩奇都穿过漫长道路抵达雪松林。面对洪巴巴时，吉尔伽美什并非只靠自己的力量取胜：太阳神沙马什放出强风困住守卫，使他无法逃脱。洪巴巴随即求饶，并提出服从吉尔伽美什。', ['source-george-babylonian-gilgamesh-epic']),
        synthesis('gilgamesh-cedar-forest-death-synthesis', '吉尔伽美什一度动摇，恩奇都却催促他立刻杀死洪巴巴。两人最终砍下他的头，又砍伐雪松，把木材带回城市。远征给他们带来声名，也让他们杀死了受神授权的守卫。这场胜利开始积累他们必须承担的后果。', ['source-george-babylonian-gilgamesh-epic', 'source-etcsl-gilgamesh-stories'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-gilgamesh-cedar-forest' },
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-etcsl-gilgamesh-stories']
    },
    {
      id: 'gilgamesh-bull-of-heaven',
      title: '天牛之死带来判决',
      eyebrow: '史诗叙事',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -600, '约公元前1000—前600年', true),
      contentBlocks: [
        synthesis('gilgamesh-bull-of-heaven-ishtar-synthesis', '回到乌鲁克后，女神伊什塔尔向吉尔伽美什求婚。伊什塔尔是巴比伦人最重要的女神之一，与爱情、战争和王权都有密切关系。吉尔伽美什列举她过去怎样对待伴侣，公开拒绝并羞辱了她。', ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-tablet-vi']),
        synthesis('gilgamesh-bull-of-heaven-judgment-synthesis', '伊什塔尔向天神安努索要天牛，让灾难降临乌鲁克。吉尔伽美什与恩奇都再次联手，杀死天牛；恩奇都还把牛腿掷向女神。诸神随后召开会议，决定两位英雄中必须有一人死去，死亡落在恩奇都身上。', ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-tablet-vi'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-gilgamesh-bull-of-heaven' },
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-tablet-vi']
    },
    {
      id: 'gilgamesh-enkidu-dies',
      title: '恩奇都死去',
      eyebrow: '史诗叙事',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -600, '约公元前1000—前600年', true),
      contentBlocks: [
        synthesis('gilgamesh-enkidu-dies-illness-synthesis', '恩奇都梦见诸神作出判决，随后病倒。他愤怒地诅咒把自己带向城市生活的人，也诅咒沙姆哈特；在太阳神提醒他曾经获得的食物、衣服、友情和声名以后，他又收回诅咒，改为祝福。疾病仍没有停止，恩奇都最终死去。', ['source-george-babylonian-gilgamesh-epic', 'source-soas-gilgamesh-old-babylonian-grief']),
        synthesis('gilgamesh-enkidu-dies-grief-synthesis', '吉尔伽美什为他举行哀悼，呼唤城市、荒野和一路相遇的人共同哭泣。他面对朋友的遗体，也第一次清楚看见自己的命运：恩奇都所经历的，迟早会发生在他身上。对死亡的恐惧由此取代了对名声的追求。', ['source-george-babylonian-gilgamesh-epic', 'source-soas-gilgamesh-old-babylonian-grief'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-gilgamesh-enkidu-dies' },
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-soas-gilgamesh-old-babylonian-grief']
    },
    {
      id: 'gilgamesh-worlds-end',
      title: '吉尔伽美什走到世界尽头',
      eyebrow: '史诗叙事',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -600, '约公元前1000—前600年', true),
      contentBlocks: [
        synthesis('gilgamesh-worlds-end-darkness-synthesis', '吉尔伽美什离开乌鲁克，披着兽皮独自穿越荒野。他要寻找洪水幸存者乌特纳比什提姆，因为诸神曾赐给这个人不死的生命。他来到太阳出入的双峰，在守卫山口的蝎人允许下穿过漫长的黑暗，最终抵达长着宝石树木的花园和世界尽头的大海。', ['source-george-babylonian-gilgamesh-epic']),
        synthesis('gilgamesh-worlds-end-siduri-synthesis', '海边的酒馆女主人西杜丽劝他接受人的生活：吃饱、洗净身体、穿上洁净衣服，与家人共享能够得到的欢乐。吉尔伽美什仍不愿停下。西杜丽告诉他去寻找熟悉死亡之水的船夫。吉尔伽美什在船夫帮助下渡过无人能够触碰的水域，终于来到乌特纳比什提姆面前。', ['source-george-babylonian-gilgamesh-epic', 'source-soas-gilgamesh-old-babylonian-x'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-gilgamesh-worlds-end' },
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-soas-gilgamesh-old-babylonian-x']
    },
    {
      id: 'gilgamesh-flood-survivor',
      title: '洪水幸存者的故事',
      eyebrow: '史诗叙事',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -600, '约公元前1000—前600年', true),
      contentBlocks: [
        synthesis('gilgamesh-flood-survivor-story-synthesis', '乌特纳比什提姆告诉吉尔伽美什，诸神曾决定用洪水毁灭人类。智慧神埃阿暗中发出警告，使他建造大船，把家人、工匠和生命的种子带上船。洪水退去后，他献上祭品。诸神最终让他与妻子居住在远方，并赐予两人不死。', ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-flood-tablet', 'source-soas-gilgamesh-xi-flood']),
        synthesis('gilgamesh-flood-survivor-test-synthesis', '但这份永生来自诸神在一次特殊灾难后的决定，不是一套任何英雄都能照做的办法。乌特纳比什提姆让吉尔伽美什接受保持清醒的考验；疲惫的吉尔伽美什几乎立即睡去。连睡眠都不能战胜，他也就没有证明自己能够逃脱死亡。', ['source-george-babylonian-gilgamesh-epic', 'source-soas-gilgamesh-xi-opening'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-gilgamesh-flood-survivor' },
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-flood-tablet', 'source-soas-gilgamesh-xi-opening', 'source-soas-gilgamesh-xi-flood']
    },
    {
      id: 'gilgamesh-immortality-lost',
      title: '永生从他手中消失',
      eyebrow: '史诗叙事',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -600, '约公元前1000—前600年', true),
      contentBlocks: [
        synthesis('gilgamesh-immortality-lost-plant-synthesis', '乌特纳比什提姆本已让吉尔伽美什离开，他的妻子却劝他送给远来的旅人一份礼物。乌特纳比什提姆于是说出一种生长在深水中的植物，它能使老人重新恢复青春。吉尔伽美什潜入水中取得植物，准备带回乌鲁克，让城里的老人先试用。', ['source-george-babylonian-gilgamesh-epic']),
        synthesis('gilgamesh-immortality-lost-snake-synthesis', '途中，他在一处清凉的水边停下洗澡。一条蛇闻到植物的气味，把它偷走，并在离开时蜕下旧皮。吉尔伽美什坐在地上哭泣：走到世界尽头以后，他仍然没有把青春或永生带回去。', ['source-george-babylonian-gilgamesh-epic', 'source-oxford-classical-dictionary-gilgamesh']),
        interpretation('gilgamesh-immortality-lost-interpretation', '故事最后，他回到乌鲁克，再次观看自己城市的城墙。城墙没有使他逃过死亡，他最终仍像所有人一样死去。几千年以后，乌鲁克的遗址和出土的泥板却共同把他的名字带到我们面前。永生没有属于英雄，这段故事却比他的生命走得更远。', ['source-george-babylonian-gilgamesh-epic', 'source-met-gilgamesh-overview'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-gilgamesh-immortality-lost' },
      sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-oxford-classical-dictionary-gilgamesh', 'source-met-gilgamesh-overview']
    },
    {
      id: 'ur-iii-rises-after-akkad',
      title: '乌尔在破碎的城邦世界中兴起',
      eyebrow: '约公元前2112年以后',
      timeSpan: timeSpan(-2112, -2095, '约公元前2112—前2095年', true),
      contentBlocks: [
        fact('ur-iii-rises-after-akkad-fact', '阿卡德王朝的统治收缩以后，南部城市重新进入彼此竞争的局面。乌尔那木从这个破碎的政治世界中建立新王朝，逐步使多座城市服从乌尔。他使用“乌尔之王”和“苏美尔与阿卡德之王”等称号，把自己的统治描述为跨城邦秩序的恢复。', ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-oracc-ur-namma-inscriptions'])
      ],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-ur-iii-southern-mesopotamia',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'ur-iii-kingdom', annotationId: 'annotation-ur-iii-core-region', sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery'] }
          ],
          caption: '半透明色块表示乌尔第三王朝在南部美索不达米亚的核心地带；文字标出区域含义，色块不是固定国界。'
        }
      },
      sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-oracc-ur-namma-inscriptions', 'source-natural-earth']
    },
    {
      id: 'ur-iii-building-order',
      title: '国王用建造宣布秩序恢复',
      eyebrow: '乌尔那木统治时期',
      timeSpan: timeSpan(-2112, -2095, '约公元前2112—前2095年', true),
      contentBlocks: [
        fact('ur-iii-building-order-foundation-fact', '乌尔那木的地基奠藏像把国王表现为头顶泥砖筐的建造者。像上的铭文把它与献给女神伊南娜的神庙工程联系起来。国王负担砖筐的形象被埋入建筑地基，以此宣告他履行了对神的职责。', ['source-oracc-ur-namma-inscriptions', 'source-met-ur-nammu-foundation-figure-object']),
        fact('ur-iii-building-order-ziggurat-fact', '乌尔的塔庙则把建造、祭祀和王权集中在城市中心。大型工程调动劳力、粮食和材料，也让新王朝能够用修复神圣空间的方式宣布秩序已经恢复。', ['source-met-ur-ziggurat', 'source-oracc-ur-namma-inscriptions'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-akkadian-fragmentation' },
      sourceIds: ['source-oracc-ur-namma-inscriptions', 'source-met-ur-nammu-foundation-figure-object', 'source-met-ur-ziggurat']
    },
    {
      id: 'ur-iii-tablet-administration',
      title: '泥板让资源跨城市流动',
      eyebrow: '乌尔第三王朝时期',
      timeSpan: timeSpan(-2112, -2004, '约公元前2112—前2004年', true),
      contentBlocks: [
        fact('ur-iii-tablet-administration-records-fact', '乌尔第三王朝留下了数量庞大的行政泥板。小泥板可能只记录几个人领取的谷物，普兹里什-达甘的档案持续登记牲畜的接收和转移，大型汇总泥板则计算田地面积、预期产量与实际收获。', ['source-hilgert-drehem-administrative-documents', 'source-british-museum-ur-iii-barley-rations', 'source-british-museum-ur-iii-drehem-sheep', 'source-british-museum-ur-iii-fields-yields']),
        fact('ur-iii-tablet-administration-flow-fact', '书吏把人、动物、土地和产品转化成可以核对的数量。泥板上的记录帮助王室、神庙和地方官员追踪资源，让粮食、牲畜和劳动力能够在不同机构与城市之间流动。', ['source-hilgert-drehem-administrative-documents', 'source-steinkeller-ur-iii-core-periphery'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-ur-iii-administrative-tablet' },
      sourceIds: ['source-hilgert-drehem-administrative-documents', 'source-british-museum-ur-iii-barley-rations', 'source-british-museum-ur-iii-drehem-sheep', 'source-british-museum-ur-iii-fields-yields', 'source-wikimedia-ur-iii-administrative-tablet']
    },
    {
      id: 'ur-iii-fragmentation',
      title: '记录最多的王朝仍然瓦解',
      eyebrow: '约公元前2004年以前',
      timeSpan: timeSpan(-2028, -2004, '约公元前2028—前2004年', true),
      contentBlocks: [
        fact('ur-iii-fragmentation-fall-fact', '伊比辛统治后期，乌尔王朝同时面对粮食危机、军事失利和地方脱离。伊辛的统治者离开原有体系，乌尔能够调动的城市和资源不断减少。来自东方的埃兰军队最终攻陷乌尔，王朝随之结束。', ['source-garfinkle-kingdom-ur', 'source-cambridge-ur-iii-old-babylonian-transition']),
        fact('ur-iii-fragmentation-legacy-fact', '乌尔陷落以后，伊辛和拉尔萨等政权继续使用并改造此前的书写、法律、王权和行政实践。乌尔建立的秩序已经破裂，它留下的制度却进入了下一个时代。', ['source-garfinkle-kingdom-ur', 'source-cambridge-ur-iii-old-babylonian-transition'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-ur-iii-lament-for-ur' },
      sourceIds: ['source-garfinkle-kingdom-ur', 'source-cambridge-ur-iii-old-babylonian-transition', 'source-wikimedia-lament-for-ur-penn']
    },
    {
      id: 'old-babylonian-after-ur-iii',
      title: '乌尔留下许多竞争者',
      eyebrow: '约公元前2004—前1894年',
      timeSpan: timeSpan(-2004, -1894, '约公元前2004—前1894年', true),
      contentBlocks: [
        fact('old-babylonian-after-ur-iii-fact', '乌尔王朝倒下后，南方城市各自拥立国王。伊辛是一座靠近旧宗教中心的城市，它先接管旧都和重要神庙；更南面的拉尔萨随后夺走越来越多的土地。王冠不再只属于一个中心，水渠、粮仓和神庙归谁控制，要靠每一次联盟与战争重新决定。', ['source-cambridge-ur-iii-old-babylonian-transition', 'source-met-isin-larsa-old-babylonian'])
      ],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-old-babylonian-four-centers',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-ur', sourceIds: ['source-met-isin-larsa-old-babylonian'] },
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-isin', sourceIds: ['source-met-isin-larsa-old-babylonian'] },
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-larsa', sourceIds: ['source-met-isin-larsa-old-babylonian'] },
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-babylon', sourceIds: ['source-met-isin-larsa-old-babylonian'] }
          ],
          caption: '四个棕色圆点与文字分别标出乌尔、伊辛、拉尔萨和巴比伦；它们表示城市位置，不是同时存在的固定国界。'
        }
      },
      sourceIds: ['source-cambridge-ur-iii-old-babylonian-transition', 'source-met-isin-larsa-old-babylonian', 'source-natural-earth']
    },
    {
      id: 'old-babylonian-small-river-kingdom',
      title: '巴比伦先守住一段河岸',
      eyebrow: '约公元前1894—前1792年',
      timeSpan: timeSpan(-1894, -1792, '约公元前1894—前1792年', true),
      contentBlocks: [
        fact('old-babylonian-small-river-kingdom-fact', '巴比伦坐落在幼发拉底河边，能用河道连接南北，却只控制周围一小片土地。前几代国王修墙、开渠、争夺邻近城镇，用近百年让小国站稳。汉谟拉比继位时，拉尔萨已经是南方最强的王国；后来最有名的国王，此刻仍要向更强的对手谨慎周旋。', ['source-met-isin-larsa-old-babylonian', 'source-podany-hammurabi-babylon'])
      ],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-old-babylonian-babylon-larsa',
          transition: 'hold',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-babylon', sourceIds: ['source-met-isin-larsa-old-babylonian'] },
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-larsa', sourceIds: ['source-met-isin-larsa-old-babylonian'] }
          ],
          caption: '两个棕色圆点与文字标出巴比伦和拉尔萨；地图比较两座王国的中心位置，不绘制证据不足的早期领土边界。'
        }
      },
      sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-podany-hammurabi-babylon', 'source-natural-earth']
    },
    {
      id: 'old-babylonian-hammurabi-conquests',
      title: '汉谟拉比等到力量平衡破裂',
      eyebrow: '公元前1792—前1750年',
      timeSpan: timeSpan(-1792, -1750, '公元前1792—前1750年', false),
      contentBlocks: [
        fact('old-babylonian-hammurabi-conquests-fact', '汉谟拉比在位很久以后，才连续发动决定性的战争。他先与邻国联手抵挡共同敌人，形势改变后，又转身攻打昔日盟友。南方的粮仓、东面的河谷和幼发拉底河上游的宫廷先后服从巴比伦。不到十年，一座小国拆掉了维持数十年的力量平衡。', ['source-cdli-hammurabi-year-names', 'source-podany-hammurabi-babylon'])
      ],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-old-babylonian-conquest-centers',
          transition: 'hold',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-babylon', sourceIds: ['source-cdli-hammurabi-year-names'] },
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-conquest-south', sourceIds: ['source-cdli-hammurabi-year-names'] },
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-conquest-east', sourceIds: ['source-cdli-hammurabi-year-names'] },
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-conquest-upstream', sourceIds: ['source-cdli-hammurabi-year-names'] }
          ],
          caption: '棕色圆点与编号文字标出巴比伦及汉谟拉比晚年战争涉及的南方、东方和上游中心；编号表示叙事先后，不是具体行军路线。'
        }
      },
      sourceIds: ['source-cdli-hammurabi-year-names', 'source-podany-hammurabi-babylon', 'source-natural-earth']
    },
    {
      id: 'old-babylonian-orders-and-institutions',
      title: '每一道命令都要有人执行',
      eyebrow: '汉谟拉比统治后期',
      timeSpan: timeSpan(-1763, -1750, '约公元前1763—前1750年', true),
      contentBlocks: [
        fact('old-babylonian-orders-and-institutions-fact', '一座被征服的城市，不会因为换了国王就自动交粮。汉谟拉比不断写信，要求官员清理水渠、核对田地、召集士兵、审理案件。神庙掌握土地、仓库和大量人员，既接受国王修建，也要为王国提供粮食与劳力。与此同时，汉谟拉比把一系列裁决刻上石碑，让“公正”成为国王公开承担的职责。王宫、地方官、书吏和神庙共同运转，才把短暂的征服变成可以维持的统治。', ['source-goddeeris-old-babylonian-economy', 'source-wikimedia-hammurabi-letter', 'source-louvre-hammurabi-code'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-old-babylonian-hammurabi-letter' },
      sourceIds: ['source-goddeeris-old-babylonian-economy', 'source-wikimedia-hammurabi-letter', 'source-louvre-hammurabi-code']
    },
    {
      id: 'old-babylonian-fragmentation',
      title: '大王国缩回一座城',
      eyebrow: '公元前1750—前1595年',
      timeSpan: timeSpan(-1750, -1595, '公元前1750—前1595年', false),
      contentBlocks: [
        fact('old-babylonian-fragmentation-fact', '汉谟拉比死后不久，南方城市开始脱离，湿地中的新王国夺走大片土地，巴比伦能征收粮食和派遣官员的范围不断缩小。约公元前1595年，一支来自安纳托利亚的赫梯军队长途奔袭巴比伦，第一王朝结束。大王国消失了，巴比伦城却继续吸引后来的国王。', ['source-cdli-samsuiluna-year-names', 'source-met-isin-larsa-old-babylonian'])
      ],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-old-babylonian-fragmentation',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-babylon', sourceIds: ['source-met-isin-larsa-old-babylonian'] },
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-sealand', sourceIds: ['source-cdli-samsuiluna-year-names'] },
            { kind: 'entity', entityId: 'old-babylonian-kingdom', annotationId: 'annotation-old-babylonian-hattusa', sourceIds: ['source-met-isin-larsa-old-babylonian'] }
          ],
          caption: '棕色圆点与文字标出巴比伦和赫梯中心哈图沙；“南方湿地”文字是海地王国活动区的约略提示，地图不绘制未经证实的远征路线。'
        }
      },
      sourceIds: ['source-cdli-samsuiluna-year-names', 'source-met-isin-larsa-old-babylonian', 'source-natural-earth']
    },
    {
      id: 'hammurabi-code-divine-justice',
      title: '国王站在公正之神面前',
      eyebrow: '约公元前1750年',
      timeSpan: timeSpan(-1750, -1750, '约公元前1750年', true),
      contentBlocks: [
        fact('hammurabi-code-divine-justice-fact', '石碑高约两米二十五，观看者必须抬头。顶部浮雕中，汉谟拉比站在一位掌管太阳与公正的神面前，神把象征权力的圆环和短杖伸向他。图像告诉每个来到石碑前的人：下面的判断不是私人意见，而是国王受神认可后承担的职责。', ['source-louvre-hammurabi-code'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-hammurabi-code-stele' },
      sourceIds: ['source-louvre-hammurabi-code', 'source-wikimedia-hammurabi-full-stele']
    },
    {
      id: 'hammurabi-code-final-judge',
      title: '国王要成为最后的裁判者',
      eyebrow: '约公元前1750年',
      timeSpan: timeSpan(-1750, -1750, '约公元前1750年', true),
      contentBlocks: [
        fact('hammurabi-code-final-judge-fact', '汉谟拉比先列出自己照料过的城市、修复过的神庙和击败过的敌人，然后宣布自己的任务：制止强者欺压弱者，让受屈的人得到判断。石碑结尾又邀请有纠纷的人来到国王像前，请识字者读出相关文字。每一个案件最终都在证明同一件事——国王有能力恢复秩序。', ['source-louvre-hammurabi-code', 'source-ehammurabi-laws'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-hammurabi-code-relief' },
      sourceIds: ['source-louvre-hammurabi-code', 'source-wikimedia-hammurabi-stele']
    },
    {
      id: 'hammurabi-code-equal-retaliation',
      title: '以牙还牙，以眼还眼',
      eyebrow: '石碑第196、197、200条',
      timeSpan: timeSpan(-1750, -1750, '约公元前1750年', true),
      contentBlocks: [
        fact('hammurabi-code-equal-retaliation-fact', '石碑最著名的一组判决，把伤害原样还给施害者：打瞎别人的眼睛，自己的眼睛也要被打瞎；打断别人的骨头，自己的骨头也要被打断；打落别人的牙齿，也要失去自己的牙齿。处罚不只是交出银钱，而是让施害者亲身承受同一种损失。“以牙还牙”把私人报复变成了国王规定的对等惩罚。', ['source-ehammurabi-laws', 'source-isac-law-society'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-hammurabi-code-equal-retaliation' },
      sourceIds: ['source-ehammurabi-laws', 'source-isac-law-society']
    },
    {
      id: 'hammurabi-code-status-inequality',
      title: '同一种伤害，不同的代价',
      eyebrow: '石碑第196、198、199条',
      timeSpan: timeSpan(-1750, -1750, '约公元前1750年', true),
      contentBlocks: [
        fact('hammurabi-code-status-inequality-fact', '这种“对等”只存在于地位相近的人之间。伤害身份较低的人，同样的眼睛和骨头往往只需用银钱赔偿；伤害奴隶，赔偿甚至交给奴隶的主人。医生的报酬会随病人的身份升降，手术失败后的处罚也不相同。法典没有把所有人视为平等个体，而是公开按照身份，为身体、劳动和生命规定不同的价值。', ['source-ehammurabi-laws', 'source-isac-law-society'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-hammurabi-code-status-penalties' },
      sourceIds: ['source-ehammurabi-laws', 'source-isac-law-society']
    },
    {
      id: 'hammurabi-code-property-welfare',
      title: '灾难来时，先保住田地',
      eyebrow: '石碑第32、48条',
      timeSpan: timeSpan(-1750, -1750, '约公元前1750年', true),
      contentBlocks: [
        fact('hammurabi-code-property-welfare-fact', '暴雨冲毁农田、洪水带走庄稼或缺水造成绝收，欠粮的人当年可以暂停还债。士兵奉命出征而被俘，无钱赎身时，本城神庙和王宫要依次出资，他的田地、果园和房屋不能被卖掉。王国承担最后责任，使服役者能够保住养活家庭和继续劳作的土地。', ['source-ehammurabi-laws', 'source-isac-law-society'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-hammurabi-code-property-welfare' },
      sourceIds: ['source-ehammurabi-laws', 'source-isac-law-society']
    },
    {
      id: 'hammurabi-code-transmission-discovery',
      title: '石碑被带走，文字没有消失',
      eyebrow: '约公元前1750年—1902年',
      timeSpan: timeSpan(-1750, 1902, '约公元前1750—公元1902年', true),
      contentBlocks: [
        fact('hammurabi-code-transmission-discovery-fact', '汉谟拉比以前已经有国王整理法律，他的案例后来也被书吏抄到泥板上。几个世纪后，埃兰军队把石碑作为战利品带到今天伊朗西南部的苏萨。石碑在那里破损并被掩埋，直到1901—1902年重新出土。实物离开了巴比伦，文字却在抄写中继续流传。', ['source-cdli-law-collections', 'source-cambridge-hammurabi-copies', 'source-louvre-hammurabi-code'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-hammurabi-code-discovery' },
      sourceIds: ['source-cdli-law-collections', 'source-cambridge-hammurabi-copies', 'source-louvre-hammurabi-code', 'source-wikimedia-hammurabi-discovery']
    },
    {
      id: 'tower-of-babel-builders-stay-together',
      title: '《圣经》里的建塔者不愿分散',
      eyebrow: '《创世记》的叙事时间',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -400, '约公元前1000—前400年', true),
      contentBlocks: [
        fact('tower-of-babel-builders-stay-together-fact', '《圣经·创世记》讲述洪水之后的人类仍说着同一种语言。他们迁徙到示拿平原，决定停下来共同生活。那里缺少石材，人们便烧硬泥砖，用沥青把砖黏在一起。他们要建造一座城市和一座塔，让塔顶伸向天空，为自己留下显赫的名字，也让所有人不再分散到世界各处。', ['source-sefaria-genesis-11'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-babel-tower-bruegel' },
      sourceIds: ['source-sefaria-genesis-11', 'source-wikimedia-bruegel-babel']
    },
    {
      id: 'tower-of-babel-languages-stop-work',
      title: '语言终止了工程',
      eyebrow: '故事中的转折',
      timeDisplay: 'undatedNarrative',
      timeSpan: timeSpan(-1000, -400, '约公元前1000—前400年', true),
      contentBlocks: [
        fact('tower-of-babel-languages-stop-work-fact', '故事继续说，神俯视人们建造的城市，发现共同的语言使他们能够完成越来越大的计划，于是打乱了他们的言语。工人听不懂命令，邻居无法回答彼此，原本协调一致的工程停了下来。人群最终四散，这座城被称为“巴别”；故事让“巴比伦”的名字听起来像希伯来语中的“混乱”。', ['source-sefaria-genesis-11'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-babel-confusion-dore' },
      sourceIds: ['source-sefaria-genesis-11', 'source-wikimedia-dore-confusion']
    },
    {
      id: 'tower-of-babel-real-etemenanki',
      title: '巴比伦真的有一座高塔',
      eyebrow: '约公元前689—前562年',
      timeSpan: timeSpan(-689, -562, '约公元前689—前562年', true),
      contentBlocks: [
        fact('tower-of-babel-real-etemenanki-fact', '巴比伦城中心确实有一座阶梯形塔庙，名叫埃特曼安吉，意思接近“天地根基之屋”。它属于供奉城市主神马尔杜克的神庙建筑群。亚述国王重建过它，后来那波帕拉萨尔和尼布甲尼撒二世又继续施工，以烧砖、沥青和釉砖抬高这座庞然大物。', ['source-george-tower-of-babel', 'source-met-etemenanki-cylinder', 'source-oracc-nebuchadnezzar-etemenanki'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-mesopotamian-temple-old-babylonian' },
      sourceIds: ['source-george-tower-of-babel', 'source-met-etemenanki-cylinder', 'source-oracc-nebuchadnezzar-etemenanki', 'source-wikimedia-etemenanki-reconstruction']
    },
    {
      id: 'tower-of-babel-evidence-and-reconstruction',
      title: '重建留下证据，外形留下空白',
      eyebrow: '约公元前689—前331年',
      timeSpan: timeSpan(-689, -331, '约公元前689—前331年', true),
      contentBlocks: [
        fact('tower-of-babel-evidence-and-reconstruction-fact', '塔庙的地基、建筑铭文和古代测量文本证明它真实存在，也让研究者估算底座与层级。可是泥砖高处早已消失，国王声称恢复“旧貌”的文字也不能告诉我们每一层的形状。今天常见的高塔图像都是研究复原，不是从遗址中完整站立起来的原貌。', ['source-george-tower-of-babel', 'source-wikimedia-esagil-tablet'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-babel-esagil-tablet' },
      sourceIds: ['source-george-tower-of-babel', 'source-wikimedia-esagil-tablet']
    },
    {
      id: 'tower-of-babel-building-becomes-memory',
      title: '一座塔进入另一种记忆',
      eyebrow: '约公元前700—前400年',
      timeSpan: timeSpan(-700, -400, '约公元前700—前400年', true),
      contentBlocks: [
        interpretation('tower-of-babel-building-becomes-memory-interpretation', '埃特曼安吉位于巴比伦，使用故事提到的砖与沥青，也曾以惊人高度支配城市景观；它很可能为巴别塔叙事提供了历史背景。故事却把王室反复重建的神圣中心改写成一项中断的工程，让城市荣耀变成语言、合作与分散的难题。真实建筑进入了故事，却不再只是原来的建筑。', ['source-sefaria-genesis-11', 'source-george-tower-of-babel'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-babel-etemenanki-ruins' },
      sourceIds: ['source-sefaria-genesis-11', 'source-george-tower-of-babel', 'source-wikimedia-etemenanki-ruins']
    }
  ];

  const navigationOptions = [
    { id: 'nav-mesopotamia-uruk', target: { cardId: 'sumer-uruk-city', sceneId: 'sumer-uruk-gathering' }, basis: { kind: 'relatedCard', cardId: 'sumer-uruk-city' }, label: '进入乌鲁克', description: '走进一座迅速扩大的城市，观察食物、公共建筑与陌生人的共同生活怎样被组织起来。' },
    { id: 'nav-uruk-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-many-cities-between-rivers' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入两河流域的城市长史', description: '把乌鲁克放回更长的区域历史，看一座座城市怎样穿过阿卡德、乌尔、巴比伦与亚述的王朝更替。' },
    { id: 'nav-mesopotamia-sumer', target: { cardId: 'sumer-measuring-land-time', sceneId: 'sumer-water-network' }, basis: { kind: 'relatedCard', cardId: 'sumer-measuring-land-time' }, label: '进入苏美尔文明', description: '从城市群转向水渠、土地、泥板与历法，看看苏美尔人怎样组织物质和时间。' },
    { id: 'nav-sumer-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-many-cities-between-rivers' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入两河流域的城市长史', description: '从苏美尔城市出发，继续观察后来王朝怎样接管并改变它们留下的制度。' },
    { id: 'nav-mesopotamia-akkadian', target: { cardId: 'akkadian-empire-overview', sceneId: 'akkadian-empire-city-states' }, basis: { kind: 'relatedCard', cardId: 'akkadian-empire-overview' }, label: '进入阿卡德王朝', description: '从区域长史转向征服者的视角，看阿卡德怎样统治语言和传统不同的城市。' },
    { id: 'nav-akkadian-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-akkad-gathers-cities' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入两河流域的城市长史', description: '把阿卡德放在前后王朝之间，观察帝国消失以后城市与书吏怎样继续工作。' },
    { id: 'nav-mesopotamia-ur-iii', target: { cardId: 'ur-iii-reordered-city-world', sceneId: 'ur-iii-rises-after-akkad' }, basis: { kind: 'relatedCard', cardId: 'ur-iii-reordered-city-world' }, label: '进入乌尔第三王朝', description: '跟随行政泥板，看看乌尔怎样把土地、劳力与多座城市重新组织起来。' },
    { id: 'nav-ur-iii-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-ur-tablets-reorder-cities' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入两河流域的城市长史', description: '从乌尔的密集行政走向更长时段，看看这套经验怎样进入后继王国。' },
    { id: 'nav-mesopotamia-old-babylonian', target: { cardId: 'old-babylonian-rise-and-fragmentation', sceneId: 'old-babylonian-after-ur-iii' }, basis: { kind: 'relatedCard', cardId: 'old-babylonian-rise-and-fragmentation' }, label: '进入古巴比伦', description: '从伊辛、拉尔萨的竞争开始，看看巴比伦怎样从小国成为广大王国的中心。' },
    { id: 'nav-old-babylonian-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-babylon-becomes-center' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入两河流域的城市长史', description: '把古巴比伦的兴衰放回区域长时段，继续看第一王朝以后谁接管了巴比伦。' },
    { id: 'nav-mesopotamia-amarna', target: { cardId: 'amarna-kings-write-world', sceneId: 'amarna-diplomacy-routine' }, basis: { kind: 'relatedCard', cardId: 'amarna-kings-write-world' }, label: '进入诸王的外交书信', description: '从巴比伦与亚述的来信出发，看看晚青铜时代的大国和小国怎样用不同方式处理外交。' },
    { id: 'nav-mesopotamia-temple', target: { cardId: 'mesopotamian-temple-overview', sceneId: 'mesopotamian-temple-uruk' }, basis: { kind: 'relatedCard', cardId: 'mesopotamian-temple-overview' }, label: '进入神庙的漫长历史', description: '沿着反复重建的建筑和机构，看看神庙怎样穿过城邦与王朝。' },
    { id: 'nav-temple-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-cities-do-not-go-dark' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入两河流域的城市长史', description: '把神庙的延续放回城市、书写和王朝反复重组的区域历史。' },
    { id: 'nav-mesopotamia-cuneiform', target: { cardId: 'cuneiform-overview', sceneId: 'cuneiform-quantities' }, basis: { kind: 'relatedCard', cardId: 'cuneiform-overview' }, label: '进入楔形文字', description: '从跨越王朝的泥板继续追问，这套符号怎样从记录数量发展到记录多种语言。' },
    { id: 'nav-cuneiform-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-cities-do-not-go-dark' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入两河流域的城市长史', description: '把文字的延续放回使用它的城市、神庙和王朝，观察书写怎样参与一次次重建。' },
    { id: 'nav-mesopotamia-collapse', target: { cardId: 'late-bronze-palaces-go-dark', sceneId: 'palaces-connect-kingdoms' }, basis: { kind: 'relatedCard', cardId: 'late-bronze-palaces-go-dark' }, label: '进入宫殿接连熄灭的时代', description: '从巴比伦与亚述的收缩转向赫梯、乌加里特、爱琴海和埃及各自不同的结局。' },
    { id: 'nav-mesopotamia-assyria', target: { cardId: 'assyria-orders-cross-empire', sceneId: 'assyria-merchants-before-empire' }, basis: { kind: 'relatedCard', cardId: 'assyria-orders-cross-empire' }, label: '进入重新扩张的亚述', description: '从阿淑尔的商贸和中亚述王权继续，看这些城市、书写与远程组织经验怎样进入新亚述帝国。' },
    { id: 'nav-assyria-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-cities-do-not-go-dark' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入两河流域的城市长史', description: '从新亚述向前追溯，看看阿淑尔的商贸、书写和中亚述王权怎样从更早的两河城市世界中成长。' },
    {
      id: 'nav-uruk-mesopotamian-temple',
      target: { cardId: 'mesopotamian-temple-overview', sceneId: 'mesopotamian-temple-uruk' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-uruk-mesopotamian-temple' },
      label: '进入美索不达米亚神庙',
      description: '继续观察神庙怎样成为城市中延续长久的公共机构。'
    },
    {
      id: 'nav-temple-uruk',
      target: { cardId: 'sumer-uruk-city', sceneId: 'sumer-uruk-public-center' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-uruk-mesopotamian-temple' },
      label: '进入乌鲁克的公共中心',
      description: '从神庙制度走进泥砖建筑与城市公共空间形成的现场。'
    },
    {
      id: 'nav-sumer-uruk',
      target: { cardId: 'sumer-uruk-city', sceneId: 'sumer-uruk-gathering' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sumer-uruk' },
      label: '进入乌鲁克',
      description: '观察水网中的一座城市怎样迅速扩大。'
    },
    {
      id: 'nav-uruk-sumer',
      target: { cardId: 'sumer-measuring-land-time', sceneId: 'sumer-water-network' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sumer-uruk' },
      label: '进入苏美尔人的土地与时间',
      description: '从乌鲁克走向支撑城市的水道、计量与历法。'
    },
    {
      id: 'nav-sumer-cuneiform',
      target: { cardId: 'cuneiform-overview', sceneId: 'cuneiform-quantities' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sumer-cuneiform' },
      label: '进入楔形文字',
      description: '从记粮食的符号，看到泥板怎样学会记录语言。'
    },
    {
      id: 'nav-cuneiform-sumer',
      target: { cardId: 'sumer-measuring-land-time', sceneId: 'sumer-clay-records' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sumer-cuneiform' },
      label: '进入苏美尔人的记录世界',
      description: '从文字本身观察粮食、劳作和数量为什么最先进入泥板。'
    },
    {
      id: 'nav-sumer-akkadian-empire',
      target: { cardId: 'akkadian-empire-overview', sceneId: 'akkadian-empire-city-states' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sumer-akkadian-empire' },
      label: '进入阿卡德王朝',
      description: '看使用阿卡德语的王室怎样征服并管理苏美尔城市。'
    },
    {
      id: 'nav-akkadian-sumer',
      target: { cardId: 'sumer-measuring-land-time', sceneId: 'sumer-water-network' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sumer-akkadian-empire' },
      label: '进入苏美尔人的土地与时间',
      description: '观察阿卡德统治者接手了怎样的城市知识。'
    },
    {
      id: 'nav-sumer-ur-iii',
      target: { cardId: 'ur-iii-reordered-city-world', sceneId: 'ur-iii-rises-after-akkad' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sumer-ur-iii' },
      label: '进入乌尔第三王朝',
      description: '看南方王朝怎样把土地、工程与书写重新组织起来。'
    },
    {
      id: 'nav-ur-iii-sumer',
      target: { cardId: 'sumer-measuring-land-time', sceneId: 'sumer-clay-records' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sumer-ur-iii' },
      label: '进入苏美尔人的记录传统',
      description: '从密集的行政泥板追溯数字、土地与书写的早期结合。'
    },
    {
      id: 'nav-uruk-akkadian-empire',
      target: { cardId: 'akkadian-empire-overview', sceneId: 'akkadian-empire-city-states' },
      basis: { kind: 'relatedCard', cardId: 'akkadian-empire-overview' },
      label: '进入阿卡德王朝',
      description: '看乌鲁克等苏美尔城市怎样被纳入新的帝国。'
    },
    {
      id: 'nav-akkadian-uruk',
      target: { cardId: 'sumer-uruk-city', sceneId: 'sumer-uruk-gathering' },
      basis: { kind: 'relatedCard', cardId: 'sumer-uruk-city' },
      label: '进入乌鲁克',
      description: '观察阿卡德征服以前，这座苏美尔城市怎样形成自己的公共世界。'
    },
    {
      id: 'nav-cuneiform-gilgamesh',
      target: { cardId: 'gilgamesh-mortality', sceneId: 'gilgamesh-many-tablets' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-cuneiform-gilgamesh' },
      label: '进入吉尔伽美什的故事',
      description: '从能够保存语言的泥板，读完一位英雄寻找永生却失败的旅程。'
    },
    {
      id: 'nav-gilgamesh-cuneiform',
      target: { cardId: 'cuneiform-overview', sceneId: 'cuneiform-language' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-cuneiform-gilgamesh' },
      label: '进入楔形文字',
      description: '观察泥板怎样从记录数量，发展到保存语言、文学和不同文本版本。'
    },
    {
      id: 'nav-uruk-gilgamesh',
      target: { cardId: 'gilgamesh-mortality', sceneId: 'gilgamesh-enkidu-enters-uruk' },
      basis: { kind: 'relatedCard', cardId: 'gilgamesh-mortality' },
      label: '进入乌鲁克的英雄记忆',
      description: '从考古所见的城市，进入后世书吏讲述的吉尔伽美什。'
    },
    {
      id: 'nav-gilgamesh-uruk',
      target: { cardId: 'sumer-uruk-city', sceneId: 'sumer-uruk-gathering' },
      basis: { kind: 'relatedCard', cardId: 'sumer-uruk-city' },
      label: '进入考古所见的乌鲁克',
      description: '从史诗结尾的城墙，观察早期城市怎样在物质、劳动和制度中成长。'
    },
    {
      id: 'nav-akkadian-ur-iii',
      target: { cardId: 'ur-iii-reordered-city-world', sceneId: 'ur-iii-rises-after-akkad' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-akkadian-ur-iii-transition' },
      label: '进入乌尔第三王朝',
      description: '看阿卡德王朝收缩以后，乌尔怎样重新组织南方城市。'
    },
    {
      id: 'nav-ur-iii-akkadian',
      target: { cardId: 'akkadian-empire-overview', sceneId: 'akkadian-empire-fragmentation' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-akkadian-ur-iii-transition' },
      label: '进入阿卡德王朝的瓦解',
      description: '从乌尔建立的新秩序，观察它所继承的跨城邦统治经验与破碎政治世界。'
    },
    {
      id: 'nav-ur-iii-mesopotamian-temple',
      target: { cardId: 'mesopotamian-temple-overview', sceneId: 'mesopotamian-temple-ur' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-ur-iii-mesopotamian-temple' },
      label: '进入乌尔的神庙',
      description: '从国王的建造行动，继续观察塔庙怎样连接祭祀、资源与城市秩序。'
    },
    {
      id: 'nav-temple-ur-iii',
      target: { cardId: 'ur-iii-reordered-city-world', sceneId: 'ur-iii-building-order' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-ur-iii-mesopotamian-temple' },
      label: '进入乌尔第三王朝',
      description: '从乌尔塔庙进入新王朝，观察乌尔那木怎样用建造宣告秩序恢复。'
    },
    {
      id: 'nav-akkadian-indus',
      target: { cardId: 'indus-civilization-network', sceneId: 'indus-meluhha-ships' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-indus-akkadian-exchange' },
      label: '进入梅鲁哈船只的来路',
      description: '从阿卡德王室的远方声望，沿海湾港口、印章与红玉髓进入印度河世界。'
    },
    {
      id: 'nav-ur-iii-old-babylonian',
      target: { cardId: 'old-babylonian-rise-and-fragmentation', sceneId: 'old-babylonian-after-ur-iii' },
      basis: { kind: 'event', eventId: 'event-ur-iii-fragmentation' },
      label: '进入古巴比伦',
      description: '看乌尔王朝瓦解后，伊辛、拉尔萨和巴比伦怎样争夺留下的空位。'
    },
    {
      id: 'nav-old-babylonian-ur-iii',
      target: { cardId: 'ur-iii-reordered-city-world', sceneId: 'ur-iii-fragmentation' },
      basis: { kind: 'event', eventId: 'event-ur-iii-fragmentation' },
      label: '进入乌尔第三王朝的瓦解',
      description: '从城市竞争追溯旧王朝怎样失去粮食、军队和地方支持。'
    },
    {
      id: 'nav-old-babylonian-code',
      target: { cardId: 'hammurabi-code-justice', sceneId: 'hammurabi-code-final-judge' },
      basis: { kind: 'event', eventId: 'event-hammurabi-code-stele' },
      label: '进入汉谟拉比法典',
      description: '从王国的命令与机构，观察国王怎样把公正刻在石碑上。'
    },
    {
      id: 'nav-code-old-babylonian',
      target: { cardId: 'old-babylonian-rise-and-fragmentation', sceneId: 'old-babylonian-orders-and-institutions' },
      basis: { kind: 'event', eventId: 'event-hammurabi-code-stele' },
      label: '进入汉谟拉比统治的王国',
      description: '把石碑上的王权承诺放回官员、神庙和书吏共同运转的现实中。'
    },
    {
      id: 'nav-old-babylonian-temple',
      target: { cardId: 'mesopotamian-temple-overview', sceneId: 'mesopotamian-temple-old-babylonian' },
      basis: { kind: 'relatedCard', cardId: 'mesopotamian-temple-overview' },
      label: '进入巴比伦的神庙',
      description: '继续观察神庙怎样管理土地、人员和仪式，又与王宫共同生活。'
    },
    {
      id: 'nav-temple-old-babylonian',
      target: { cardId: 'old-babylonian-rise-and-fragmentation', sceneId: 'old-babylonian-orders-and-institutions' },
      basis: { kind: 'relatedCard', cardId: 'old-babylonian-rise-and-fragmentation' },
      label: '进入古巴比伦王国',
      description: '从神庙制度进入王宫、地方官和书吏共同维持的统治。'
    },
    {
      id: 'nav-code-cuneiform',
      target: { cardId: 'cuneiform-overview', sceneId: 'cuneiform-language' },
      basis: { kind: 'relatedCard', cardId: 'cuneiform-overview' },
      label: '进入楔形文字',
      description: '观察法典案例赖以抄写、保存并跨越时代流传的文字系统。'
    },
    {
      id: 'nav-cuneiform-code',
      target: { cardId: 'hammurabi-code-justice', sceneId: 'hammurabi-code-transmission-discovery' },
      basis: { kind: 'relatedCard', cardId: 'hammurabi-code-justice' },
      label: '进入汉谟拉比法典的流传',
      description: '从楔形文字记录语言的能力，观察法律案例怎样在石碑和泥板间延续。'
    },
    {
      id: 'nav-babel-temple',
      target: { cardId: 'mesopotamian-temple-overview', sceneId: 'mesopotamian-temple-old-babylonian' },
      basis: { kind: 'event', eventId: 'event-etemenanki-rebuilding' },
      label: '进入美索不达米亚神庙',
      description: '把埃特曼安吉放回神庙制度的长时段变化中。'
    },
    {
      id: 'nav-temple-babel',
      target: { cardId: 'tower-of-babel-story-and-etemenanki', sceneId: 'tower-of-babel-real-etemenanki' },
      basis: { kind: 'event', eventId: 'event-etemenanki-rebuilding' },
      label: '进入巴别塔',
      description: '从真实的埃特曼安吉塔庙，观察建筑怎样进入《创世记》的故事记忆。'
    }
  ];

  const navigationPlacements = [
    { id: 'placement-mesopotamia-uruk-inline', navigationOptionId: 'nav-mesopotamia-uruk', owner: { kind: 'scene', sceneId: 'mesopotamia-many-cities-between-rivers' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mesopotamia-sumer-inline', navigationOptionId: 'nav-mesopotamia-sumer', owner: { kind: 'scene', sceneId: 'mesopotamia-many-cities-between-rivers' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-mesopotamia-akkadian-inline', navigationOptionId: 'nav-mesopotamia-akkadian', owner: { kind: 'scene', sceneId: 'mesopotamia-akkad-gathers-cities' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mesopotamia-ur-iii-inline', navigationOptionId: 'nav-mesopotamia-ur-iii', owner: { kind: 'scene', sceneId: 'mesopotamia-ur-tablets-reorder-cities' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mesopotamia-old-babylonian-inline', navigationOptionId: 'nav-mesopotamia-old-babylonian', owner: { kind: 'scene', sceneId: 'mesopotamia-babylon-becomes-center' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mesopotamia-amarna-inline', navigationOptionId: 'nav-mesopotamia-amarna', owner: { kind: 'scene', sceneId: 'mesopotamia-babylon-writes-assyria-grows' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mesopotamia-collapse-inline', navigationOptionId: 'nav-mesopotamia-collapse', owner: { kind: 'scene', sceneId: 'mesopotamia-cities-do-not-go-dark' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mesopotamia-assyria-inline', navigationOptionId: 'nav-mesopotamia-assyria', owner: { kind: 'scene', sceneId: 'mesopotamia-cities-do-not-go-dark' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-mesopotamia-temple-closing', navigationOptionId: 'nav-mesopotamia-temple', owner: { kind: 'card', cardId: 'mesopotamia-cities-outlast-dynasties' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-mesopotamia-cuneiform-closing', navigationOptionId: 'nav-mesopotamia-cuneiform', owner: { kind: 'card', cardId: 'mesopotamia-cities-outlast-dynasties' }, slot: 'closing', rank: 2, visible: true, interactive: true },
    { id: 'placement-uruk-mesopotamia-closing', navigationOptionId: 'nav-uruk-mesopotamia', owner: { kind: 'card', cardId: 'sumer-uruk-city' }, slot: 'closing', rank: 3, visible: true, interactive: true },
    { id: 'placement-sumer-mesopotamia-closing', navigationOptionId: 'nav-sumer-mesopotamia', owner: { kind: 'card', cardId: 'sumer-measuring-land-time' }, slot: 'closing', rank: 2, visible: true, interactive: true },
    { id: 'placement-akkadian-mesopotamia-closing', navigationOptionId: 'nav-akkadian-mesopotamia', owner: { kind: 'card', cardId: 'akkadian-empire-overview' }, slot: 'closing', rank: 2, visible: true, interactive: true },
    { id: 'placement-ur-iii-mesopotamia-closing', navigationOptionId: 'nav-ur-iii-mesopotamia', owner: { kind: 'card', cardId: 'ur-iii-reordered-city-world' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-old-babylonian-mesopotamia-closing', navigationOptionId: 'nav-old-babylonian-mesopotamia', owner: { kind: 'card', cardId: 'old-babylonian-rise-and-fragmentation' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-temple-mesopotamia-closing', navigationOptionId: 'nav-temple-mesopotamia', owner: { kind: 'card', cardId: 'mesopotamian-temple-overview' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-cuneiform-mesopotamia-closing', navigationOptionId: 'nav-cuneiform-mesopotamia', owner: { kind: 'card', cardId: 'cuneiform-overview' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-assyria-mesopotamia-closing', navigationOptionId: 'nav-assyria-mesopotamia', owner: { kind: 'card', cardId: 'assyria-orders-cross-empire' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-uruk-temple-inline', navigationOptionId: 'nav-uruk-mesopotamian-temple', owner: { kind: 'scene', sceneId: 'sumer-uruk-public-center' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-temple-uruk-inline', navigationOptionId: 'nav-temple-uruk', owner: { kind: 'scene', sceneId: 'mesopotamian-temple-uruk' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-sumer-uruk-inline', navigationOptionId: 'nav-sumer-uruk', owner: { kind: 'scene', sceneId: 'sumer-water-network' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-uruk-sumer-inline', navigationOptionId: 'nav-uruk-sumer', owner: { kind: 'scene', sceneId: 'sumer-uruk-gathering' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-sumer-cuneiform-inline', navigationOptionId: 'nav-sumer-cuneiform', owner: { kind: 'scene', sceneId: 'sumer-clay-records' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-cuneiform-sumer-inline', navigationOptionId: 'nav-cuneiform-sumer', owner: { kind: 'scene', sceneId: 'cuneiform-quantities' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-sumer-akkadian-closing', navigationOptionId: 'nav-sumer-akkadian-empire', owner: { kind: 'card', cardId: 'sumer-measuring-land-time' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-akkadian-sumer-closing', navigationOptionId: 'nav-akkadian-sumer', owner: { kind: 'card', cardId: 'akkadian-empire-overview' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-sumer-ur-iii-inline', navigationOptionId: 'nav-sumer-ur-iii', owner: { kind: 'scene', sceneId: 'sumer-methods-outlast-dynasties' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-ur-iii-sumer-inline', navigationOptionId: 'nav-ur-iii-sumer', owner: { kind: 'scene', sceneId: 'ur-iii-tablet-administration' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-uruk-akkadian-closing', navigationOptionId: 'nav-uruk-akkadian-empire', owner: { kind: 'card', cardId: 'sumer-uruk-city' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-akkadian-uruk-inline', navigationOptionId: 'nav-akkadian-uruk', owner: { kind: 'scene', sceneId: 'akkadian-empire-city-states' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-cuneiform-gilgamesh-inline', navigationOptionId: 'nav-cuneiform-gilgamesh', owner: { kind: 'scene', sceneId: 'cuneiform-language' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-gilgamesh-cuneiform-inline', navigationOptionId: 'nav-gilgamesh-cuneiform', owner: { kind: 'scene', sceneId: 'gilgamesh-many-tablets' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-uruk-gilgamesh-closing', navigationOptionId: 'nav-uruk-gilgamesh', owner: { kind: 'card', cardId: 'sumer-uruk-city' }, slot: 'closing', rank: 2, visible: true, interactive: true },
    { id: 'placement-gilgamesh-uruk-inline', navigationOptionId: 'nav-gilgamesh-uruk', owner: { kind: 'scene', sceneId: 'gilgamesh-immortality-lost' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-akkadian-ur-iii-inline', navigationOptionId: 'nav-akkadian-ur-iii', owner: { kind: 'scene', sceneId: 'akkadian-empire-fragmentation' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-ur-iii-akkadian-inline', navigationOptionId: 'nav-ur-iii-akkadian', owner: { kind: 'scene', sceneId: 'ur-iii-rises-after-akkad' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-ur-iii-temple-inline', navigationOptionId: 'nav-ur-iii-mesopotamian-temple', owner: { kind: 'scene', sceneId: 'ur-iii-building-order' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-temple-ur-iii-inline', navigationOptionId: 'nav-temple-ur-iii', owner: { kind: 'scene', sceneId: 'mesopotamian-temple-ur' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-akkadian-indus-inline', navigationOptionId: 'nav-akkadian-indus', owner: { kind: 'scene', sceneId: 'akkadian-empire-conquests' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-ur-iii-old-babylonian-inline', navigationOptionId: 'nav-ur-iii-old-babylonian', owner: { kind: 'scene', sceneId: 'ur-iii-fragmentation' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-old-babylonian-ur-iii-inline', navigationOptionId: 'nav-old-babylonian-ur-iii', owner: { kind: 'scene', sceneId: 'old-babylonian-after-ur-iii' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-old-babylonian-code-inline', navigationOptionId: 'nav-old-babylonian-code', owner: { kind: 'scene', sceneId: 'old-babylonian-orders-and-institutions' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-code-old-babylonian-inline', navigationOptionId: 'nav-code-old-babylonian', owner: { kind: 'scene', sceneId: 'hammurabi-code-final-judge' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-old-babylonian-temple-inline', navigationOptionId: 'nav-old-babylonian-temple', owner: { kind: 'scene', sceneId: 'old-babylonian-orders-and-institutions' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-temple-old-babylonian-inline', navigationOptionId: 'nav-temple-old-babylonian', owner: { kind: 'scene', sceneId: 'mesopotamian-temple-old-babylonian' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-code-cuneiform-inline', navigationOptionId: 'nav-code-cuneiform', owner: { kind: 'scene', sceneId: 'hammurabi-code-transmission-discovery' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-cuneiform-code-inline', navigationOptionId: 'nav-cuneiform-code', owner: { kind: 'scene', sceneId: 'cuneiform-language' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-babel-temple-inline', navigationOptionId: 'nav-babel-temple', owner: { kind: 'scene', sceneId: 'tower-of-babel-real-etemenanki' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-temple-babel-inline', navigationOptionId: 'nav-temple-babel', owner: { kind: 'scene', sceneId: 'mesopotamian-temple-old-babylonian' }, slot: 'inline', rank: 2, visible: true, interactive: true },
  ];

  const cameraPresets = [
    { id: 'camera-mesopotamia-story', center: [45.25, 31.7], scale: 7.2 },
    { id: 'camera-southern-city-world', center: [45.7, 31.2], scale: 8 },
    { id: 'camera-mesopotamia-two-centers', center: [43.85, 34.05], scale: 5.5 },
    { id: 'camera-old-babylonian-south', center: [45.25, 31.9], scale: 8.4 },
    { id: 'camera-old-babylonian-conquests', center: [43.6, 33.1], scale: 6.2 },
    { id: 'camera-old-babylonian-fragmentation', center: [40.1, 35.4], scale: 3.8 }
  ];

  const geometries = [
    {
      id: 'geometry-mesopotamia-early-cities',
      geometry: { type: 'MultiPoint', coordinates: [[45.64, 31.32], [46.1, 30.96], [45.23, 32.13], [46.17, 31.41]] },
      timeSpan: timeSpan(-3500, -2350, '早期南部美索不达米亚城市世界', true),
      approximate: true,
      label: '乌鲁克、乌尔、尼普尔与拉格什（近似教学选点）',
      sourceIds: ['source-adams-heartland-cities', 'source-met-uruk-first-city', 'source-met-ur-ziggurat', 'source-natural-earth']
    },
    {
      id: 'geometry-mesopotamia-babylon-ashur',
      geometry: { type: 'MultiPoint', coordinates: [[44.42, 32.54], [43.26, 35.46]] },
      timeSpan: timeSpan(-1200, -1000, '晚青铜时代末期的巴比伦与阿淑尔', true),
      approximate: true,
      label: '巴比伦与阿淑尔（近似教学选点）',
      sourceIds: ['source-brinkman-kassite-history', 'source-oracc-middle-assyrian', 'source-natural-earth']
    },
    {
      id: 'geometry-mesopotamia-story-places',
      geometry: { type: 'MultiPoint', coordinates: [[45.99, 30.82], [45.64, 31.32], [46.1, 30.96], [44.42, 32.54]] },
      timeSpan: timeSpan(-5000, -1595, '从早期埃里都至古巴比伦时期的教学选点', true),
      approximate: true,
      label: '埃里都、乌鲁克、乌尔与巴比伦（近似教学选点）',
      sourceIds: ['source-yale-ubaid-summary', 'source-met-uruk-first-city', 'source-met-ur-ziggurat', 'source-met-isin-larsa-old-babylonian', 'source-natural-earth']
    },
    {
      id: 'geometry-southern-mesopotamia-city-world',
      geometry: { type: 'Polygon', coordinates: [[[44.3, 29.8], [47.1, 29.8], [47.3, 32.3], [45.1, 33], [44.2, 31.5], [44.3, 29.8]]] },
      timeSpan: timeSpan(-2500, -2350, '萨尔贡以前的南部美索不达米亚城邦世界', true),
      approximate: true,
      label: '南部美索不达米亚城邦世界（近似教学范围）',
      sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-natural-earth']
    },
    {
      id: 'geometry-ur-iii-southern-mesopotamia',
      geometry: { type: 'Polygon', coordinates: [[[44.3, 29.8], [47.1, 29.8], [47.3, 32.3], [45.1, 33], [44.2, 31.5], [44.3, 29.8]]] },
      timeSpan: timeSpan(-2112, -2004, '乌尔第三王朝时期，约公元前2112—前2004年', true),
      approximate: true,
      label: '乌尔第三王朝在南部美索不达米亚的核心地带（近似教学范围）',
      sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-natural-earth']
    },
    {
      id: 'geometry-old-babylonian-four-centers',
      geometry: { type: 'MultiPoint', coordinates: [[46.1, 30.96], [45.27, 31.95], [45.87, 31.29], [44.42, 32.54]] },
      timeSpan: timeSpan(-2004, -1894, '乌尔王朝瓦解后的城市竞争时期', true),
      approximate: true,
      label: '乌尔、伊辛、拉尔萨与巴比伦（近似教学选点）',
      sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-cambridge-ur-iii-old-babylonian-transition', 'source-natural-earth']
    },
    {
      id: 'geometry-old-babylonian-babylon-larsa',
      geometry: { type: 'MultiPoint', coordinates: [[44.42, 32.54], [45.87, 31.29]] },
      timeSpan: timeSpan(-1894, -1792, '巴比伦早期王朝至汉谟拉比继位', true),
      approximate: true,
      label: '巴比伦与拉尔萨（近似教学选点）',
      sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-natural-earth']
    },
    {
      id: 'geometry-old-babylonian-conquest-centers',
      geometry: { type: 'MultiPoint', coordinates: [[44.42, 32.54], [45.87, 31.29], [44.72, 33.49], [40.89, 34.55]] },
      timeSpan: timeSpan(-1764, -1755, '汉谟拉比晚年战争涉及的主要中心', true),
      approximate: true,
      label: '巴比伦、拉尔萨、埃什努那与马里（近似教学选点）',
      sourceIds: ['source-cdli-hammurabi-year-names', 'source-podany-hammurabi-babylon', 'source-natural-earth']
    },
    {
      id: 'geometry-old-babylonian-fragmentation',
      geometry: { type: 'MultiPoint', coordinates: [[44.42, 32.54], [46.2, 30.6], [34.62, 40.02]] },
      timeSpan: timeSpan(-1750, -1595, '古巴比伦王国收缩至第一王朝结束', true),
      approximate: true,
      label: '巴比伦、南方湿地与哈图沙（近似教学选点）',
      sourceIds: ['source-cdli-samsuiluna-year-names', 'source-met-isin-larsa-old-babylonian', 'source-natural-earth']
    }
  ];

  const mapStates = [
    {
      id: 'map-mesopotamia-early-cities',
      cameraPresetId: 'camera-southern-city-world',
      layers: [{
        kind: 'geometry',
        geometryId: 'geometry-mesopotamia-early-cities',
        timeSpan: timeSpan(-3500, -2350, '早期南部美索不达米亚城市世界', true),
        sourceIds: ['source-adams-heartland-cities', 'source-met-uruk-first-city', 'source-met-ur-ziggurat', 'source-natural-earth']
      }]
    },
    {
      id: 'map-mesopotamia-babylon-ashur',
      cameraPresetId: 'camera-mesopotamia-two-centers',
      layers: [{
        kind: 'geometry',
        geometryId: 'geometry-mesopotamia-babylon-ashur',
        timeSpan: timeSpan(-1200, -1000, '晚青铜时代末期', true),
        sourceIds: ['source-brinkman-kassite-history', 'source-oracc-middle-assyrian', 'source-natural-earth']
      }]
    },
    {
      id: 'map-mesopotamian-temple-places',
      cameraPresetId: 'camera-mesopotamia-story',
      layers: [{
        kind: 'geometry',
        geometryId: 'geometry-mesopotamia-story-places',
        timeSpan: timeSpan(-5000, -1595, '从早期埃里都至古巴比伦时期', true),
        sourceIds: ['source-yale-ubaid-summary', 'source-met-uruk-first-city', 'source-met-ur-ziggurat', 'source-met-isin-larsa-old-babylonian', 'source-natural-earth']
      }]
    },
    {
      id: 'map-akkadian-southern-city-world',
      cameraPresetId: 'camera-southern-city-world',
      layers: [{
        kind: 'geometry',
        geometryId: 'geometry-southern-mesopotamia-city-world',
        timeSpan: timeSpan(-2500, -2350, '萨尔贡以前', true),
        sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad', 'source-natural-earth']
      }]
    },
    {
      id: 'map-ur-iii-southern-mesopotamia',
      cameraPresetId: 'camera-southern-city-world',
      layers: [{
        kind: 'geometry',
        geometryId: 'geometry-ur-iii-southern-mesopotamia',
        timeSpan: timeSpan(-2112, -2004, '乌尔第三王朝时期', true),
        sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery', 'source-natural-earth']
      }]
    },
    {
      id: 'map-old-babylonian-four-centers',
      cameraPresetId: 'camera-old-babylonian-south',
      layers: [{
        kind: 'geometry',
        geometryId: 'geometry-old-babylonian-four-centers',
        timeSpan: timeSpan(-2004, -1894, '乌尔王朝瓦解后的城市竞争时期', true),
        sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-cambridge-ur-iii-old-babylonian-transition', 'source-natural-earth']
      }]
    },
    {
      id: 'map-old-babylonian-babylon-larsa',
      cameraPresetId: 'camera-old-babylonian-south',
      layers: [{
        kind: 'geometry',
        geometryId: 'geometry-old-babylonian-babylon-larsa',
        timeSpan: timeSpan(-1894, -1792, '巴比伦早期王朝至汉谟拉比继位', true),
        sourceIds: ['source-met-isin-larsa-old-babylonian', 'source-natural-earth']
      }]
    },
    {
      id: 'map-old-babylonian-conquest-centers',
      cameraPresetId: 'camera-old-babylonian-conquests',
      layers: [{
        kind: 'geometry',
        geometryId: 'geometry-old-babylonian-conquest-centers',
        timeSpan: timeSpan(-1764, -1755, '汉谟拉比晚年战争涉及的主要中心', true),
        sourceIds: ['source-cdli-hammurabi-year-names', 'source-podany-hammurabi-babylon', 'source-natural-earth']
      }]
    },
    {
      id: 'map-old-babylonian-fragmentation',
      cameraPresetId: 'camera-old-babylonian-fragmentation',
      layers: [{
        kind: 'geometry',
        geometryId: 'geometry-old-babylonian-fragmentation',
        timeSpan: timeSpan(-1750, -1595, '古巴比伦王国收缩至第一王朝结束', true),
        sourceIds: ['source-cdli-samsuiluna-year-names', 'source-met-isin-larsa-old-babylonian', 'source-natural-earth']
      }]
    }
  ];

  const mapAnnotations = [
    {
      id: 'annotation-mesopotamia-early-uruk',
      subject: { kind: 'entity', entityId: 'mesopotamia-region' },
      anchor: { kind: 'geo', coordinates: [45.64, 31.32] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-met-uruk-first-city'],
      placement: 'left',
      label: '乌鲁克'
    },
    {
      id: 'annotation-mesopotamia-early-ur',
      subject: { kind: 'entity', entityId: 'mesopotamia-region' },
      anchor: { kind: 'geo', coordinates: [46.1, 30.96] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-met-ur-ziggurat'],
      placement: 'bottomRight',
      label: '乌尔'
    },
    {
      id: 'annotation-mesopotamia-early-nippur',
      subject: { kind: 'entity', entityId: 'mesopotamia-region' },
      anchor: { kind: 'geo', coordinates: [45.23, 32.13] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-adams-heartland-cities'],
      placement: 'topLeft',
      label: '尼普尔'
    },
    {
      id: 'annotation-mesopotamia-early-lagash',
      subject: { kind: 'entity', entityId: 'mesopotamia-region' },
      anchor: { kind: 'geo', coordinates: [46.17, 31.41] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-adams-heartland-cities'],
      placement: 'right',
      label: '拉格什'
    },
    {
      id: 'annotation-mesopotamia-continuity-babylon',
      subject: { kind: 'entity', entityId: 'mesopotamia-region' },
      anchor: { kind: 'geo', coordinates: [44.42, 32.54] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-brinkman-kassite-history'],
      placement: 'bottomLeft',
      label: '巴比伦'
    },
    {
      id: 'annotation-mesopotamia-continuity-ashur',
      subject: { kind: 'entity', entityId: 'mesopotamia-region' },
      anchor: { kind: 'geo', coordinates: [43.26, 35.46] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-oracc-middle-assyrian'],
      placement: 'topRight',
      label: '阿淑尔'
    },
    {
      id: 'annotation-mesopotamia-uruk-site',
      subject: { kind: 'entity', entityId: 'uruk' },
      anchor: { kind: 'geo', coordinates: [45.637222, 31.324167] },
      anchorMeaning: 'locatedAt',
      approximate: false,
      sourceIds: ['source-unesco-uruk-location'],
      placement: 'right',
      label: '乌鲁克'
    },
    {
      id: 'annotation-mesopotamia-temple-cities',
      subject: { kind: 'entity', entityId: 'mesopotamian-temple' },
      anchor: { kind: 'geo', coordinates: [45.25, 31.7] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-yale-ubaid-summary', 'source-met-uruk-first-city', 'source-met-ur-ziggurat', 'source-met-isin-larsa-old-babylonian'],
      placement: 'above',
      label: '埃里都 · 乌鲁克 · 乌尔 · 巴比伦'
    },
    {
      id: 'annotation-akkadian-southern-city-world',
      subject: { kind: 'entity', entityId: 'akkadian-empire' },
      anchor: { kind: 'geo', coordinates: [45.7, 31.2] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-met-akkadian-period', 'source-westenholz-kingdom-akkad'],
      placement: 'above',
      label: '南部城邦世界'
    },
    {
      id: 'annotation-ur-iii-core-region',
      subject: { kind: 'entity', entityId: 'ur-iii-kingdom' },
      anchor: { kind: 'geo', coordinates: [45.7, 31.2] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-garfinkle-kingdom-ur', 'source-steinkeller-ur-iii-core-periphery'],
      placement: 'above',
      label: '乌尔第三王朝核心地带'
    },
    {
      id: 'annotation-old-babylonian-ur',
      subject: { kind: 'entity', entityId: 'old-babylonian-kingdom' },
      anchor: { kind: 'geo', coordinates: [46.1, 30.96] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-met-isin-larsa-old-babylonian'],
      placement: 'below',
      label: '乌尔'
    },
    {
      id: 'annotation-old-babylonian-isin',
      subject: { kind: 'entity', entityId: 'old-babylonian-kingdom' },
      anchor: { kind: 'geo', coordinates: [45.27, 31.95] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-met-isin-larsa-old-babylonian'],
      placement: 'left',
      label: '伊辛'
    },
    {
      id: 'annotation-old-babylonian-larsa',
      subject: { kind: 'entity', entityId: 'old-babylonian-kingdom' },
      anchor: { kind: 'geo', coordinates: [45.87, 31.29] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-met-isin-larsa-old-babylonian'],
      placement: 'right',
      label: '拉尔萨'
    },
    {
      id: 'annotation-old-babylonian-babylon',
      subject: { kind: 'entity', entityId: 'old-babylonian-kingdom' },
      anchor: { kind: 'geo', coordinates: [44.42, 32.54] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-met-isin-larsa-old-babylonian'],
      placement: 'above',
      label: '巴比伦'
    },
    {
      id: 'annotation-old-babylonian-conquest-south',
      subject: { kind: 'entity', entityId: 'old-babylonian-kingdom' },
      anchor: { kind: 'geo', coordinates: [45.87, 31.29] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-cdli-hammurabi-year-names'],
      placement: 'below',
      label: '① 南方：拉尔萨'
    },
    {
      id: 'annotation-old-babylonian-conquest-east',
      subject: { kind: 'entity', entityId: 'old-babylonian-kingdom' },
      anchor: { kind: 'geo', coordinates: [44.72, 33.49] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-cdli-hammurabi-year-names'],
      placement: 'right',
      label: '② 东方：埃什努那'
    },
    {
      id: 'annotation-old-babylonian-conquest-upstream',
      subject: { kind: 'entity', entityId: 'old-babylonian-kingdom' },
      anchor: { kind: 'geo', coordinates: [40.89, 34.55] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-cdli-hammurabi-year-names'],
      placement: 'left',
      label: '③ 上游：马里'
    },
    {
      id: 'annotation-old-babylonian-sealand',
      subject: { kind: 'entity', entityId: 'old-babylonian-kingdom' },
      anchor: { kind: 'geo', coordinates: [46.2, 30.6] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-cdli-samsuiluna-year-names'],
      placement: 'below',
      label: '南方湿地 · 海地王国活动区（约略）'
    },
    {
      id: 'annotation-old-babylonian-hattusa',
      subject: { kind: 'entity', entityId: 'old-babylonian-kingdom' },
      anchor: { kind: 'geo', coordinates: [34.62, 40.02] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-met-isin-larsa-old-babylonian'],
      placement: 'above',
      label: '哈图沙 · 赫梯王国中心'
    }
  ];

  const assets = [
    { id: 'asset-akkadian-naram-sin-victory-stele', type: 'image', src: 'assets/images/mesopotamia/akkadian-naram-sin-victory-stele.jpg', title: '纳拉姆辛胜利碑', alt: '粉褐色石碑浮雕中，头戴角冠的阿卡德国王纳拉姆辛持弓站在山坡高处，士兵沿山势向上推进，战败者倒下或求饶。', sourceIds: ['source-wikimedia-naram-sin-victory-stele', 'source-louvre-naram-sin-victory-stele'] },
    { id: 'asset-kassite-kurigalzu-kudurru', type: 'image', src: 'assets/images/mesopotamia/kassite-kurigalzu-kudurru.jpg', title: '刻有库里加尔祖二世名字的库杜鲁', alt: '一块深灰色不规则石碑完整入镜，表面刻有密集楔形文字和图像；它记录加喜特国王库里加尔祖二世作出的土地赠予，原本保存在神庙中。', sourceIds: ['source-wikimedia-kurigalzu-kudurru', 'source-met-kassite-period'] },
    { id: 'asset-mesopotamian-temple-ur-ziggurat', type: 'image', src: 'assets/images/mesopotamia/mesopotamian-temple-ur-ziggurat.jpg', title: '今天的乌尔塔庙遗址', alt: '夕阳下的乌尔塔庙遗址照片，宽阔阶梯通向经过修复的泥砖台基。', sourceIds: ['source-wikimedia-ur-ziggurat-photo', 'source-met-ur-ziggurat'] },
    { id: 'asset-mesopotamian-temple-uruk-eanna-plan', type: 'image', src: 'assets/images/mesopotamia/mesopotamian-temple-uruk-eanna-plan.jpg', title: '乌鲁克 Eanna IVb 神庙区平面示意图', alt: '乌鲁克 Eanna IVb 神庙区平面示意图，多个大厅、庭院与神庙建筑分布在围合空间内；淡色叠加部分是后期建筑参照。', sourceIds: ['source-wikimedia-eanna-4b-plan', 'source-dai-uruk'] },
    { id: 'asset-mesopotamian-temple-old-babylonian', type: 'image', src: 'assets/images/mesopotamia/mesopotamian-temple-old-babylonian.jpg', title: '埃特曼安吉塔庙研究重建示意图', alt: '依据现代研究绘制的埃特曼安吉塔庙重建示意图，多层阶梯式台基逐级升高，顶端设有神殿；它不是遗址原貌照片。', sourceIds: ['source-wikimedia-etemenanki-reconstruction', 'source-british-museum-etemenanki-tablet'] },
    { id: 'asset-cuneiform-proto-account-seal', type: 'image', src: 'assets/images/mesopotamia/cuneiform-proto-account-seal.jpg', title: '记录大麦分配并带有滚印的早期泥板', alt: '一块浅褐色早期行政泥板，表面分栏刻有谷穗、容器等图形和圆形数量记号，下方还保留人物、猎犬与野猪的滚筒印章图案。', sourceIds: ['source-wikimedia-proto-cuneiform-barley-tablet-pd'] },
    { id: 'asset-cuneiform-stylus', type: 'image', src: 'assets/images/mesopotamia/cuneiform-student-exercise.jpg', title: '古巴比伦书吏练习泥板', alt: '一块狭长的古巴比伦练习泥板，表面可见书吏反复压出的楔形笔画。', sourceIds: ['source-met-student-exercise-object', 'source-british-museum-cuneiform'] },
    { id: 'asset-cuneiform-sound', type: 'image', src: 'assets/images/mesopotamia/cuneiform-student-exercise-reverse.jpg', title: '书吏练习泥板的另一面', alt: '古巴比伦练习泥板的另一面，楔形符号用于练习能够表示词与声音的写法。', sourceIds: ['source-met-student-exercise-object', 'source-isac-writing-early-mesopotamia'] },
    { id: 'asset-cuneiform-genres', type: 'image', src: 'assets/images/mesopotamia/cuneiform-gilgamesh-flood-tablet.jpg', title: '《吉尔伽美什史诗》洪水泥板', alt: '英国博物馆所藏《吉尔伽美什史诗》第十一泥板，密集楔形文字写在不规则褐色泥板表面。', sourceIds: ['source-wikimedia-gilgamesh-flood-tablet', 'source-british-museum-gilgamesh-tablet-i'] },
    { id: 'asset-cuneiform-many-languages', type: 'image', src: 'assets/images/mesopotamia/cuneiform-sumerian-akkadian-grammar.jpg', title: '苏美尔语与阿卡德语语法泥板', alt: '一块晚期巴比伦语法泥板，左栏列苏美尔语条目，右栏记录阿卡德语翻译。', sourceIds: ['source-met-grammatical-text-object', 'source-british-museum-cuneiform'] },
    { id: 'asset-akkadian-sargon-memory', type: 'image', src: 'assets/images/mesopotamia/akkadian-ruler-head.jpg', title: '常被称作萨尔贡的阿卡德王头像', alt: '尼尼微出土的阿卡德时期青铜王头像完整正面，眼部受损，编结胡须与头发仍清晰可见；它常被称为萨尔贡头像，也可能表现纳拉姆辛。', sourceIds: ['source-wikimedia-akkadian-ruler-head'] },
    { id: 'asset-akkadian-administration', type: 'image', src: 'assets/images/mesopotamia/akkadian-enheduanna-disk.jpg', title: '恩赫杜安娜圆盘', alt: '恩赫杜安娜圆盘的完整照片，圆盘中央浮雕表现一列人物参加祭祀，恩赫杜安娜是其中身着层叠长袍的女性。', sourceIds: ['source-wikimedia-enheduanna-disk', 'source-british-museum-enheduanna'] },
    { id: 'asset-akkadian-fragmentation', type: 'image', src: 'assets/images/mesopotamia/ur-nammu-foundation-figure.jpg', title: '乌尔那木奠基像', alt: '乌尔那木头顶泥土篮子的铜合金奠基像，表现国王作为神庙建造者的身份。', sourceIds: ['source-met-ur-nammu-foundation-figure-object', 'source-met-ur-ziggurat'] },
    { id: 'asset-ur-iii-administrative-tablet', type: 'image', src: 'assets/images/mesopotamia/ur-iii-administrative-tablet.jpg', title: '伊比辛时期行政泥板', alt: '一块公元前2026年的乌尔第三王朝行政泥板，褐色泥面分栏刻有密集的楔形文字。', sourceIds: ['source-wikimedia-ur-iii-administrative-tablet', 'source-british-museum-ur-iii-fields-yields'] },
    { id: 'asset-ur-iii-lament-for-ur', type: 'image', src: 'assets/images/mesopotamia/ur-iii-lament-for-ur.jpg', title: '后世抄写的《乌尔哀歌》残片', alt: '宾夕法尼亚大学博物馆所藏《乌尔哀歌》泥板残片，浅褐色表面分栏写有苏美尔语楔形文字；这是王朝结束后抄写的文学文本。', sourceIds: ['source-wikimedia-lament-for-ur-penn', 'source-cambridge-ur-iii-old-babylonian-transition'] },
    { id: 'asset-gilgamesh-old-babylonian-fragments', type: 'image', src: 'assets/images/mesopotamia/gilgamesh-old-babylonian-fragments.jpg', title: '古巴比伦《吉尔伽美什》泥板残片', alt: '芝加哥大学所藏的三块古巴比伦《吉尔伽美什》泥板残片，照片经纯几何裁切后以上二下一的方式排列，泥板裂口、楔形笔画与展架均保持原貌。', sourceIds: ['source-wikimedia-gilgamesh-old-babylonian-fragments', 'source-george-babylonian-gilgamesh-epic'] },
    { id: 'asset-gilgamesh-uruk-kingship', type: 'image', src: 'assets/images/mesopotamia/gilgamesh-uruk-kingship.jpg', title: '吉尔伽美什统治乌鲁克（AI生成）', alt: 'AI 生成图中的吉尔伽美什坐在泥砖大厅的低台木座上，一名居民俯身放下谷物和椰枣，另一人呈上织物，持长流嘴陶壶的侍者站在一旁。', sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-tablet-i'] },
    { id: 'asset-gilgamesh-rivals-become-friends', type: 'image', src: 'assets/images/mesopotamia/gilgamesh-rivals-become-friends.jpg', title: '吉尔伽美什与恩奇都搏斗（AI生成）', alt: 'AI 生成图中的吉尔伽美什与恩奇都在乌鲁克泥砖门道中压低重心、锁住手臂激烈角力，脚下扬起尘土，门后居民紧张观望。', sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-oxford-classical-dictionary-gilgamesh'] },
    { id: 'asset-gilgamesh-cedar-forest', type: 'image', src: 'assets/images/mesopotamia/gilgamesh-cedar-forest.jpg', title: '洪巴巴在雪松林中求饶（AI生成）', alt: 'AI 生成图中的洪巴巴被强风困在弯曲的雪松之间，跪地伸手求饶；吉尔伽美什垂下斧头犹豫，恩奇都在一旁催促。', sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-etcsl-gilgamesh-stories'] },
    { id: 'asset-gilgamesh-worlds-end', type: 'image', src: 'assets/images/mesopotamia/gilgamesh-worlds-end.jpg', title: '吉尔伽美什进入双峰间的黑暗（AI生成）', alt: 'AI 生成图中的吉尔伽美什披着旅途斗篷，独自走向两座山之间漆黑的入口；两名蝎人守卫在入口两侧举起手掌。', sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-soas-gilgamesh-old-babylonian-x'] },
    { id: 'asset-gilgamesh-immortality-lost', type: 'image', src: 'assets/images/mesopotamia/gilgamesh-immortality-lost.jpg', title: '蛇带走恢复青春的植物（AI生成）', alt: 'AI 生成图中的蛇衔着带刺植物从水边爬走，旁边留下浅色蜕皮；水中的吉尔伽美什伸手追赶，却已经来不及。', sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-oxford-classical-dictionary-gilgamesh', 'source-met-gilgamesh-overview'] },
    { id: 'asset-gilgamesh-bull-of-heaven', type: 'image', src: 'assets/images/mesopotamia/gilgamesh-bull-of-heaven.jpg', title: '天牛冲向吉尔伽美什与恩奇都（AI生成）', alt: 'AI 生成图中的巨大天牛低头猛烈冲撞，前蹄击碎地面；吉尔伽美什贴近牛角闪避，恩奇都从后方拉住牛尾，城中居民躲在泥砖墙后。', sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-tablet-vi'] },
    { id: 'asset-gilgamesh-enkidu-dies', type: 'image', src: 'assets/images/mesopotamia/gilgamesh-enkidu-dies.jpg', title: '吉尔伽美什哀悼恩奇都（AI生成）', alt: 'AI 生成图中的恩奇都安静躺在编织床上，吉尔伽美什握住他的手臂含泪呼唤；几名哀悼者站在摆有油灯、陶器、织物与树枝的泥砖房间后方。', sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-soas-gilgamesh-old-babylonian-grief'] },
    { id: 'asset-gilgamesh-flood-survivor', type: 'image', src: 'assets/images/mesopotamia/gilgamesh-flood-survivor.jpg', title: '乌特纳比什提姆讲述洪水（AI生成）', alt: 'AI 生成图中的乌特纳比什提姆与旅途中的吉尔伽美什在水边对坐交谈；乌特纳比什提姆身旁的无文字叙事框中，大船正穿过暴雨与巨浪。', sourceIds: ['source-george-babylonian-gilgamesh-epic', 'source-british-museum-gilgamesh-flood-tablet', 'source-soas-gilgamesh-xi-flood'] },
    { id: 'asset-old-babylonian-hammurabi-letter', type: 'image', src: 'assets/images/mesopotamia/old-babylonian-hammurabi-letter.jpg', title: '汉谟拉比命令地方官召集船工', alt: '一块竖长的浅褐色泥板，正面密布横向排列的楔形文字；信中汉谟拉比要求地方官召集船工前往巴比伦。', sourceIds: ['source-wikimedia-hammurabi-letter'] },
    { id: 'asset-hammurabi-code-stele', type: 'image', src: 'assets/images/mesopotamia/hammurabi-code-stele.jpg', title: '汉谟拉比法典石碑', alt: '一块高大的黑色石碑立在展厅中，顶部为汉谟拉比面对公正之神的浮雕，下方刻满密集楔形文字。', sourceIds: ['source-wikimedia-hammurabi-full-stele', 'source-louvre-hammurabi-code'] },
    { id: 'asset-hammurabi-code-relief', type: 'image', src: 'assets/images/mesopotamia/hammurabi-code-relief.jpg', title: '汉谟拉比面对公正之神', alt: '法典石碑顶部浮雕近景，汉谟拉比站在左侧，右侧戴角冠的神坐在宝座上并伸出权力象征。', sourceIds: ['source-wikimedia-hammurabi-stele', 'source-louvre-hammurabi-code'] },
    { id: 'asset-hammurabi-code-equal-retaliation', type: 'image', src: 'assets/images/mesopotamia/hammurabi-trial-1915.jpg', title: '《汉谟拉比面前的审判》', alt: '1915年的历史插画中，汉谟拉比高坐庭中，当事人在他面前申诉，卫兵和围观者分立两侧；这是近代插画家对古代审判的想象，不是现场记录。', sourceIds: ['source-wikimedia-hammurabi-trial-1915'] },
    { id: 'asset-hammurabi-code-status-penalties', type: 'image', src: 'assets/images/mesopotamia/hammurabi-trial-status-crop-1915.jpg', title: '审判庭上的身份与位置', alt: '《汉谟拉比面前的审判》局部：高坐的国王、阶前的申诉者与两侧不同装束的人群构成鲜明层级；这是1915年历史插画的裁切，不是古代图像证据。', sourceIds: ['source-wikimedia-hammurabi-trial-1915'] },
    { id: 'asset-hammurabi-code-property-welfare', type: 'image', src: 'assets/images/mesopotamia/hammurabi-babylonian-canals-1898.jpg', title: '田地与灌溉渠道', alt: '1898年的历史插画中，灌溉渠道穿过巴比伦的田地，农人在水边劳作；这是近代对古代农田水利的想象图。', sourceIds: ['source-wikimedia-babylonian-canals-1898'] },
    { id: 'asset-hammurabi-code-discovery', type: 'image', src: 'assets/images/mesopotamia/hammurabi-code-discovery.jpg', title: '苏萨发掘中的法典石碑', alt: '一张早期黑白发掘照片，数名工作人员站在出土的黑色石碑旁。', sourceIds: ['source-wikimedia-hammurabi-discovery', 'source-louvre-hammurabi-code'] },
    { id: 'asset-babel-tower-bruegel', type: 'image', src: 'assets/images/mesopotamia/babel-tower-bruegel.jpg', title: '勃鲁盖尔想象的巴别塔', alt: '一座尚未完工的巨大圆形高塔耸立在城市与港口之间，大量工人在不同楼层施工；这是十六世纪画家的故事想象。', sourceIds: ['source-wikimedia-bruegel-babel', 'source-sefaria-genesis-11'] },
    { id: 'asset-babel-confusion-dore', type: 'image', src: 'assets/images/mesopotamia/babel-confusion-dore.png', title: '多雷笔下的语言混乱', alt: '高塔下的人群彼此呼喊、争执和转身离去，原本共同施工的秩序已经瓦解；这是十九世纪的故事插图。', sourceIds: ['source-wikimedia-dore-confusion', 'source-sefaria-genesis-11'] },
    { id: 'asset-babel-esagil-tablet', type: 'image', src: 'assets/images/mesopotamia/babel-esagil-tablet.jpg', title: '记录埃特曼安吉尺寸的泥板残片', alt: '一块不规则的深褐色泥板残片，正面保存数列楔形文字；文字记录了埃特曼安吉的尺寸。', sourceIds: ['source-wikimedia-esagil-tablet', 'source-george-tower-of-babel'] },
    { id: 'asset-babel-etemenanki-ruins', type: 'image', src: 'assets/images/mesopotamia/babel-etemenanki-ruins.jpg', title: '埃特曼安吉地基遗址', alt: '平坦遗址中残留一片积水和低矮土层，昔日高塔已不再直立。', sourceIds: ['source-wikimedia-etemenanki-ruins', 'source-george-tower-of-babel'] }
  ];

  return {
    sources: sumer.sources.concat(sources),
    entities: sumer.entities.concat(entities),
    events,
    structuralEdges,
    cards: sumer.cards.concat(cards),
    scenes: sumer.scenes.concat(scenes),
    structureViews: [],
    navigationOptions,
    navigationPlacements,
    cameraPresets: sumer.cameraPresets.concat(cameraPresets),
    geometries: sumer.geometries.concat(geometries),
    mapStates: sumer.mapStates.concat(mapStates),
    mapAnnotations,
    assets: sumer.assets.concat(assets)
  };
}));
