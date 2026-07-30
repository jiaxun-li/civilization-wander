/**
 * 山河与文明 · 最小知识图谱模型
 *
 * 浏览器直接读取普通 JavaScript，确保 file:// 仍可运行。JSDoc 类型用于约束
 * 数据形状；旧地区数据继续保留在 content.js，由 app.js 运行时适配为 Entity。
 *
 * @typedef {'region'|'geographicFeature'|'civilization'|'polity'|'empire'|'peopleGroup'|'religion'|'philosophy'|'language'|'languageFamily'|'writingSystem'|'technology'|'tradeRoute'|'commodity'|'artStyle'|'architectureStyle'|'event'|'person'|'city'|'story'|'pattern'} EntityType
 * @typedef {{id:string,type:EntityType,name:string,alternativeNames?:string[],shortDescription:string,description?:string,startYear?:number,endYear?:number,coordinates?:[number,number],parentEntityIds?:string[],tags?:string[],sourceIds?:string[],relatedEntityIds?:string[],relatedStoryIds?:string[],legacyStoryId?:string,contentStatus?:'reviewed'|'brief'|'placeholder'}} Entity
 * @typedef {{id:string,sourceId:string,targetId:string,type:string,verb?:string,startYear?:number,endYear?:number,summary:string,explanation?:string,geometry?:{type:'LineString',coordinates:[number,number][],approximate?:boolean},sourceIds?:string[]}} Relation
 * @typedef {{id:string,title:string,period:string,startYear:number,endYear:number,introduction:string,observation:string[],mechanism:string[],cases:string[],caveat:string,view:{lonMin:number,lonMax:number,latMin:number,latMax:number},entityIds:string[],nodeEntityIds:string[],routeIds:string[],sourceIds:string[],contentStatus:'reviewed'|'brief'|'placeholder'}} StoryChapter
 * @typedef {{id:string,title:string,subtitle:string,introduction:string,startYear:number,endYear:number,chapters:StoryChapter[],featuredEntityIds:string[],timelineEvents:{id:string,date:string,title:string,chapterId:string}[],relatedStoryIds:string[],sourceIds:string[],caveat:string,mapNote:string}} Story
 */

window.ATLAS_KNOWLEDGE = {
  schemaVersion: 1,
  entityTypes: [
    "region", "geographicFeature", "civilization", "polity", "empire",
    "peopleGroup", "religion", "philosophy", "language", "languageFamily",
    "writingSystem", "technology", "tradeRoute", "commodity", "artStyle",
    "architectureStyle", "event", "person", "city", "story", "pattern"
  ],
  relationTypes: [
    "originated_in", "located_in", "part_of", "controlled_by", "conquered_by",
    "succeeded", "influenced", "influenced_by", "evolved_from", "spread_from",
    "spread_to", "passed_through", "traded_along", "introduced_to",
    "translated_into", "associated_with", "enabled", "caused",
    "contributed_to", "declined_after", "practiced_by", "spoken_by", "used_by",
    "built_by"
  ],
  contentStatuses: {
    reviewed: "基础内容已核对",
    brief: "简略内容，待扩充",
    placeholder: "占位内容，不作为精确信息"
  },
  sources: [
    {
      id: "unesco-silk-roads",
      title: "UNESCO, About the Silk Roads",
      url: "https://www.unesco.org/en/silk-roads/about-silk-roads"
    },
    {
      id: "unesco-changan-tianshan",
      title: "UNESCO World Heritage Centre, Silk Roads: Chang'an–Tianshan Corridor",
      url: "https://whc.unesco.org/en/list/1442/"
    },
    {
      id: "unesco-kizil",
      title: "UNESCO Silk Roads Programme, Kizil Cave Murals and the Transmission of Buddhism",
      url: "https://en.unesco.org/silkroad/content/cultural-selection-kizil-cave-murals-and-silk-roads-transmission-buddhism-and-central-asian"
    },
    {
      id: "unesco-mogao",
      title: "UNESCO World Heritage Centre, Mogao Caves",
      url: "https://whc.unesco.org/en/list/440/"
    },
    {
      id: "met-kushan",
      title: "The Metropolitan Museum of Art, Kushan Empire",
      url: "https://www.metmuseum.org/essays/kushan-empire-ca-second-century-b-c-third-century-a-d"
    },
    {
      id: "met-gandhara",
      title: "The Metropolitan Museum of Art, Gandhara",
      url: "https://www.metmuseum.org/essays/gandhara"
    },
    {
      id: "met-korea",
      title: "The Metropolitan Museum of Art, Korea: Buddhism and Buddhist Art",
      url: "https://www.metmuseum.org/exhibitions/listings/2015/korea"
    },
    {
      id: "met-asuka-nara",
      title: "The Metropolitan Museum of Art, Asuka and Nara Periods",
      url: "https://www.metmuseum.org/essays/asuka-and-nara-periods-538-794"
    },
    {
      id: "smithsonian-japan",
      title: "National Museum of Asian Art, The Beginnings of Buddhism in Japan",
      url: "https://asia.si.edu/whats-on/exhibitions/the-beginnings-of-buddhism-in-japan/"
    },
    {
      id: "britannica-buddha",
      title: "Encyclopaedia Britannica, Buddha",
      url: "https://www.britannica.com/biography/Buddha-founder-of-Buddhism"
    },
    {
      id: "britannica-ashoka",
      title: "Encyclopaedia Britannica, Ashoka",
      url: "https://www.britannica.com/biography/Ashoka"
    }
  ],
  /** @type {Entity[]} */
  entities: [
    {
      id: "buddhism",
      type: "religion",
      name: "佛教",
      startYear: -500,
      shortDescription: "发端于南亚、随后形成多种传统并传播到亚洲多地的宗教与思想体系。",
      description: "第一版只追踪佛教向东传播的一条主线，不试图概括全部教义、宗派与海路传播。",
      tags: ["宗教", "思想", "传播"],
      sourceIds: ["britannica-buddha", "unesco-silk-roads"],
      relatedEntityIds: ["shakyamuni", "ganges-plain", "silk-roads"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "ganges-plain",
      type: "geographicFeature",
      name: "恒河平原",
      coordinates: [84.9, 25.6],
      shortDescription: "河流、农业腹地与城镇网络相连的北印度平原；早期佛教活动的重要地理环境。",
      tags: ["平原", "河流系统", "南亚"],
      sourceIds: ["britannica-buddha"],
      relatedEntityIds: ["shakyamuni", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "brief"
    },
    {
      id: "shakyamuni",
      type: "person",
      name: "释迦牟尼",
      alternativeNames: ["乔达摩·悉达多", "佛陀"],
      startYear: -600,
      endYear: -400,
      coordinates: [83.0, 27.5],
      shortDescription: "佛教传统的创立者；其活动年代存在学术争议，本图不采用看似精确的生卒年。",
      tags: ["宗教人物", "南亚"],
      sourceIds: ["britannica-buddha"],
      relatedEntityIds: ["buddhism", "ganges-plain"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "pataliputra",
      type: "city",
      name: "华氏城",
      alternativeNames: ["Pataliputra"],
      coordinates: [85.14, 25.61],
      shortDescription: "恒河流域的重要城市，孔雀帝国的政治中心之一。",
      tags: ["城市", "孔雀帝国"],
      sourceIds: ["britannica-ashoka"],
      relatedEntityIds: ["maurya", "ashoka"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "brief"
    },
    {
      id: "maurya",
      type: "empire",
      name: "孔雀帝国",
      startYear: -321,
      endYear: -185,
      coordinates: [80.0, 23.5],
      shortDescription: "在南亚建立广域统治网络的帝国；阿育王时期的铭文与佛教护持是专题关键节点。",
      tags: ["帝国", "南亚", "铭文"],
      sourceIds: ["britannica-ashoka"],
      relatedEntityIds: ["ashoka", "pataliputra", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "ashoka",
      type: "person",
      name: "阿育王",
      startYear: -304,
      endYear: -232,
      coordinates: [85.14, 25.61],
      shortDescription: "孔雀帝国君主，以石柱、岩刻敕令及对佛教的护持著称。",
      tags: ["统治者", "孔雀帝国", "铭文"],
      sourceIds: ["britannica-ashoka"],
      relatedEntityIds: ["maurya", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "gandhara",
      type: "region",
      name: "犍陀罗",
      coordinates: [71.6, 34.0],
      shortDescription: "位于今巴基斯坦北部与阿富汗东部一带的历史区域，连接南亚、伊朗高原与中亚通道。",
      tags: ["区域", "通道", "佛教艺术"],
      sourceIds: ["met-gandhara", "met-kushan"],
      relatedEntityIds: ["kushan", "gandharan-art", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "kushan",
      type: "empire",
      name: "贵霜帝国",
      startYear: 30,
      endYear: 375,
      coordinates: [70.2, 35.4],
      shortDescription: "连接中亚、阿富汗与北印度的帝国，贸易、城市生活、佛教思想与艺术在其统治下繁荣。",
      tags: ["帝国", "中亚", "南亚"],
      sourceIds: ["met-kushan"],
      relatedEntityIds: ["gandhara", "gandharan-art", "silk-roads"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "gandharan-art",
      type: "artStyle",
      name: "犍陀罗佛教艺术",
      startYear: 1,
      endYear: 500,
      coordinates: [71.6, 34.0],
      shortDescription: "在多文化交流环境中形成的佛教艺术传统，吸收古典、南亚、伊朗与中亚视觉因素。",
      tags: ["艺术", "佛像", "跨文化"],
      sourceIds: ["met-gandhara", "met-kushan"],
      relatedEntityIds: ["gandhara", "kushan", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "bactria",
      type: "region",
      name: "巴克特里亚",
      coordinates: [67.5, 36.7],
      shortDescription: "兴都库什以北的历史区域，是南亚、伊朗世界和中亚之间的接触带。",
      tags: ["区域", "中亚", "接触带"],
      sourceIds: ["met-kushan"],
      relatedEntityIds: ["gandhara", "kushan", "silk-roads"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "brief"
    },
    {
      id: "silk-roads",
      type: "tradeRoute",
      name: "丝绸之路网络",
      coordinates: [85.0, 40.0],
      shortDescription: "由多条陆路与海路组成、依靠绿洲与政治节点接力的跨区域网络，并非一条固定道路。",
      tags: ["贸易路线", "传播网络", "欧亚大陆"],
      sourceIds: ["unesco-silk-roads", "unesco-changan-tianshan"],
      relatedEntityIds: ["bactria", "tarim-basin", "hexi", "changan"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "tarim-basin",
      type: "geographicFeature",
      name: "塔里木盆地",
      coordinates: [82.0, 39.5],
      shortDescription: "沙漠与山地迫使远距离交通依靠盆地边缘绿洲串联的内陆盆地。",
      tags: ["盆地", "绿洲", "通道"],
      sourceIds: ["unesco-changan-tianshan", "unesco-kizil"],
      relatedEntityIds: ["kucha", "khotan", "silk-roads"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "khotan",
      type: "city",
      name: "于阗",
      coordinates: [79.92, 37.12],
      shortDescription: "塔里木盆地南缘绿洲城市，是商旅、僧侣与佛教文化活动的重要节点。",
      tags: ["绿洲城市", "塔里木盆地"],
      sourceIds: ["unesco-silk-roads"],
      relatedEntityIds: ["tarim-basin", "silk-roads", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "brief"
    },
    {
      id: "kucha",
      type: "city",
      name: "龟兹",
      alternativeNames: ["库车"],
      coordinates: [82.96, 41.72],
      shortDescription: "塔里木盆地北缘的绿洲中心；克孜尔石窟保存了佛教传播与艺术交流的证据。",
      tags: ["绿洲城市", "翻译", "石窟"],
      sourceIds: ["unesco-kizil"],
      relatedEntityIds: ["tarim-basin", "kumarajiva", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "kumarajiva",
      type: "person",
      name: "鸠摩罗什",
      startYear: 344,
      endYear: 413,
      coordinates: [82.96, 41.72],
      shortDescription: "与龟兹和长安相连的重要佛经译者；其经历体现翻译依赖跨区域语言能力与政治支持。",
      tags: ["译者", "僧侣", "龟兹", "长安"],
      sourceIds: ["unesco-kizil"],
      relatedEntityIds: ["kucha", "changan", "sanskrit", "literary-chinese"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "dunhuang",
      type: "city",
      name: "敦煌",
      coordinates: [94.66, 40.14],
      shortDescription: "河西走廊西端绿洲与交通节点，连接塔里木盆地、河西与中原。",
      tags: ["绿洲城市", "河西走廊", "丝绸之路"],
      sourceIds: ["unesco-mogao", "unesco-changan-tianshan"],
      relatedEntityIds: ["hexi", "mogao-caves", "silk-roads"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "hexi",
      type: "region",
      name: "河西走廊",
      coordinates: [99.2, 39.2],
      legacyStoryId: "hexi",
      shortDescription: "祁连山与北方干旱地带之间、由绿洲节点串联的狭长通道。",
      tags: ["通道", "绿洲", "河西"],
      sourceIds: ["unesco-changan-tianshan", "unesco-mogao"],
      relatedEntityIds: ["dunhuang", "silk-roads", "mogao-caves", "han-empire"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "mogao-caves",
      type: "architectureStyle",
      name: "敦煌石窟艺术",
      alternativeNames: ["莫高窟"],
      startYear: 366,
      coordinates: [94.81, 40.04],
      shortDescription: "在丝路交汇点持续营建的佛教石窟群，保存印度、中亚与中国艺术交流的物质证据。",
      tags: ["石窟", "壁画", "佛教艺术"],
      sourceIds: ["unesco-mogao"],
      relatedEntityIds: ["dunhuang", "hexi", "gandharan-art"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "han-empire",
      type: "empire",
      name: "汉帝国",
      startYear: -206,
      endYear: 220,
      coordinates: [108.9, 34.3],
      shortDescription: "其向河西与西域的经营改变了中原与中亚之间交通的政治条件。",
      tags: ["帝国", "河西", "交通"],
      sourceIds: ["unesco-changan-tianshan"],
      relatedEntityIds: ["hexi", "changan", "silk-roads"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "brief"
    },
    {
      id: "changan",
      type: "city",
      name: "长安",
      coordinates: [108.94, 34.34],
      legacyStoryId: "guanzhong",
      shortDescription: "汉唐政治中心与跨区域交通东端之一，也是佛经翻译、寺院与僧侣活动的重要城市。",
      tags: ["城市", "关中", "翻译"],
      sourceIds: ["unesco-changan-tianshan"],
      relatedEntityIds: ["hexi", "luoyang", "kumarajiva", "silk-roads"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "luoyang",
      type: "city",
      name: "洛阳",
      coordinates: [112.45, 34.62],
      shortDescription: "汉魏以来的重要都城与佛教活动中心，连接政治赞助、寺院建设与译经活动。",
      tags: ["城市", "翻译", "寺院"],
      sourceIds: ["unesco-changan-tianshan"],
      relatedEntityIds: ["changan", "buddhism", "literary-chinese"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "brief"
    },
    {
      id: "sanskrit",
      type: "language",
      name: "梵语",
      shortDescription: "佛教经典在传播与编纂过程中使用的重要语言之一；传播也涉及多种中亚语言。",
      tags: ["语言", "经典"],
      sourceIds: ["unesco-kizil"],
      relatedEntityIds: ["literary-chinese", "kumarajiva"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "brief"
    },
    {
      id: "literary-chinese",
      type: "language",
      name: "汉文",
      shortDescription: "佛经翻译进入中国及后续东亚传播的重要书面媒介。",
      tags: ["语言", "翻译", "汉字文化圈"],
      sourceIds: ["met-asuka-nara", "met-korea"],
      relatedEntityIds: ["sanskrit", "kumarajiva", "korean-peninsula", "nara"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "brief"
    },
    {
      id: "korean-peninsula",
      type: "region",
      name: "朝鲜半岛",
      coordinates: [127.4, 37.6],
      shortDescription: "佛教在约4世纪进入三国政治与文化网络，随后成为通往日本列岛的重要中介。",
      tags: ["区域", "东亚", "传播中介"],
      sourceIds: ["met-korea"],
      relatedEntityIds: ["korea-three-kingdoms", "nara", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "korea-three-kingdoms",
      type: "polity",
      name: "朝鲜三国",
      startYear: 300,
      endYear: 668,
      coordinates: [127.4, 37.6],
      shortDescription: "高句丽、百济与新罗先后接纳并重塑佛教，王权、寺院与艺术共同参与传播。",
      tags: ["政治实体", "朝鲜半岛", "佛教艺术"],
      sourceIds: ["met-korea"],
      relatedEntityIds: ["korean-peninsula", "nara", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    },
    {
      id: "nara",
      type: "city",
      name: "飞鸟—奈良",
      coordinates: [135.82, 34.68],
      shortDescription: "日本早期王权接纳佛教并发展寺院、造像与典章制度的核心区域。",
      tags: ["城市", "日本", "寺院"],
      sourceIds: ["met-asuka-nara", "smithsonian-japan"],
      relatedEntityIds: ["korean-peninsula", "literary-chinese", "buddhism"],
      relatedStoryIds: ["buddhism-eastward"],
      contentStatus: "reviewed"
    }
  ],
  /** @type {Relation[]} */
  relations: [
    { id: "rel-buddhism-origin", sourceId: "buddhism", targetId: "ganges-plain", type: "originated_in", startYear: -500, summary: "佛教发端于恒河流域诸国与城市网络。", sourceIds: ["britannica-buddha"] },
    { id: "rel-buddha-buddhism", sourceId: "shakyamuni", targetId: "buddhism", type: "associated_with", summary: "释迦牟尼的教导构成佛教传统的起点。", sourceIds: ["britannica-buddha"] },
    { id: "rel-ashoka-enabled", sourceId: "ashoka", targetId: "buddhism", type: "enabled", verb: "借助帝国网络扩大", startYear: -260, endYear: -232, summary: "帝国护持、铭文与交通网络扩大了佛教可见度与活动范围。", sourceIds: ["britannica-ashoka"] },
    { id: "rel-ashoka-maurya", sourceId: "ashoka", targetId: "maurya", type: "part_of", verb: "统治并借助", startYear: -268, endYear: -232, summary: "阿育王的宗教护持之所以能跨越地方尺度，与孔雀帝国的政治、交通和铭文网络密切相关。", sourceIds: ["britannica-ashoka"] },
    { id: "rel-ashoka-pataliputra", sourceId: "ashoka", targetId: "pataliputra", type: "associated_with", verb: "以此为政治中心", startYear: -268, endYear: -232, summary: "华氏城连接王权、行政与恒河流域交通，是理解阿育王行动尺度的重要节点。", sourceIds: ["britannica-ashoka"] },
    { id: "rel-maurya-pataliputra", sourceId: "maurya", targetId: "pataliputra", type: "associated_with", verb: "以此组织统治", startYear: -321, endYear: -185, summary: "孔雀帝国以恒河流域政治中心组织广域统治，但帝国范围与控制强度并非处处相同。", sourceIds: ["britannica-ashoka"] },
    { id: "rel-maurya-silk", sourceId: "maurya", targetId: "silk-roads", type: "contributed_to", verb: "把北印度接入更长的通道", startYear: -321, endYear: -185, summary: "孔雀帝国连接恒河流域与西北通道，为后来更密集的跨区域接力提供了政治与交通条件；这并不等于当时已有一条固定的“丝绸之路”。", sourceIds: ["britannica-ashoka", "unesco-silk-roads"] },
    { id: "rel-gandhara-art", sourceId: "gandharan-art", targetId: "buddhism", type: "associated_with", verb: "为其提供可传播的视觉语言", startYear: 1, endYear: 500, summary: "跨文化图像语言为佛教叙事提供了可移动、可再造的视觉形式。", sourceIds: ["met-gandhara", "met-kushan"] },
    { id: "rel-kushan-enabled", sourceId: "kushan", targetId: "gandharan-art", type: "enabled", verb: "以贸易、城市与赞助支持", startYear: 30, endYear: 375, summary: "贵霜时代的贸易、城市与赞助环境支持佛教思想和艺术繁荣。", sourceIds: ["met-kushan"] },
    {
      id: "route-india-gandhara",
      sourceId: "ganges-plain",
      targetId: "gandhara",
      type: "spread_to",
      startYear: -300,
      endYear: 200,
      summary: "从恒河流域经西北印度向犍陀罗的多段传播。",
      explanation: "路线为教学性概括，不代表单一人物沿固定线路一次完成传播。",
      geometry: { type: "LineString", coordinates: [[85.1, 25.6], [77.2, 28.6], [74.3, 31.5], [71.6, 34.0]], approximate: true },
      sourceIds: ["britannica-ashoka", "met-gandhara"]
    },
    {
      id: "route-gandhara-tarim",
      sourceId: "gandhara",
      targetId: "tarim-basin",
      type: "spread_to",
      startYear: 50,
      endYear: 450,
      summary: "经巴克特里亚及山地通道进入塔里木盆地绿洲网络。",
      explanation: "实际存在南北多条路线、季节变化与反向往来，本线只表示联系方向。",
      geometry: { type: "LineString", coordinates: [[71.6, 34.0], [67.5, 36.7], [73.0, 38.5], [79.9, 37.1], [83.0, 41.7]], approximate: true },
      sourceIds: ["met-kushan", "unesco-kizil"]
    },
    {
      id: "route-tarim-hexi",
      sourceId: "tarim-basin",
      targetId: "hexi",
      type: "passed_through",
      startYear: 100,
      endYear: 600,
      summary: "绿洲接力把僧侣、经卷、图像与赞助网络连接到敦煌和河西。",
      explanation: "塔里木盆地南北缘均有通路，图上以龟兹—敦煌主线作教学表达。",
      geometry: { type: "LineString", coordinates: [[79.9, 37.1], [83.0, 41.7], [89.2, 42.9], [94.7, 40.1], [99.2, 39.2]], approximate: true },
      sourceIds: ["unesco-kizil", "unesco-mogao"]
    },
    {
      id: "route-hexi-heartland",
      sourceId: "hexi",
      targetId: "changan",
      type: "passed_through",
      startYear: 100,
      endYear: 800,
      summary: "河西走廊把敦煌等节点与长安、洛阳的译经和寺院网络相连。",
      explanation: "政治控制、绿洲水源和驿站条件会改变路线的连续性。",
      geometry: { type: "LineString", coordinates: [[94.7, 40.1], [99.2, 39.2], [102.6, 37.9], [108.9, 34.3], [112.5, 34.6]], approximate: true },
      sourceIds: ["unesco-changan-tianshan", "unesco-mogao"]
    },
    {
      id: "route-heartland-east-asia",
      sourceId: "luoyang",
      targetId: "nara",
      type: "spread_to",
      startYear: 350,
      endYear: 700,
      summary: "佛教经中国政治文化网络进入朝鲜半岛，再进入日本列岛。",
      explanation: "海陆往来、使节、僧侣、工匠与文本共同参与，不能还原成一条单线。",
      geometry: { type: "LineString", coordinates: [[112.5, 34.6], [119.0, 36.0], [127.4, 37.6], [130.5, 34.8], [135.8, 34.7]], approximate: true },
      sourceIds: ["met-korea", "met-asuka-nara", "smithsonian-japan"]
    },
    { id: "rel-silk-buddhism", sourceId: "buddhism", targetId: "silk-roads", type: "traded_along", verb: "沿着传播", startYear: 1, endYear: 800, summary: "僧侣、商人、译者与赞助者借由丝路网络移动；贸易并非唯一动力。", sourceIds: ["unesco-silk-roads"] },
    { id: "rel-silk-kushan", sourceId: "kushan", targetId: "silk-roads", type: "traded_along", verb: "把多区域接入", startYear: 30, endYear: 375, summary: "贵霜控制的城市和通道连接中亚、阿富汗与北印度，使商品、人员和佛教文化能够在多段网络中接力。", sourceIds: ["met-kushan", "unesco-silk-roads"] },
    { id: "rel-silk-hexi", sourceId: "silk-roads", targetId: "hexi", type: "passed_through", verb: "沿绿洲节点穿过", summary: "河西是长安—天山走廊中的关键地理通道。", sourceIds: ["unesco-changan-tianshan"] },
    { id: "rel-hexi-buddhism", sourceId: "buddhism", targetId: "hexi", type: "passed_through", verb: "借助绿洲与走廊东传", startYear: 100, endYear: 600, summary: "佛教经卷、图像、僧侣与译者借助河西绿洲节点继续向东移动；走廊提供条件，但传播仍依赖赞助、翻译与地方接纳。", sourceIds: ["unesco-mogao", "unesco-changan-tianshan"] },
    { id: "rel-hexi-dunhuang", sourceId: "dunhuang", targetId: "hexi", type: "located_in", verb: "作为西端绿洲连接", summary: "敦煌把塔里木盆地的绿洲网络接入河西走廊，是人员、经卷、图像与军政补给转换方向的节点。", sourceIds: ["unesco-mogao", "unesco-changan-tianshan"] },
    { id: "rel-dunhuang-mogao", sourceId: "mogao-caves", targetId: "dunhuang", type: "located_in", verb: "在此把交流沉淀为石窟艺术", startYear: 366, summary: "莫高窟依托敦煌绿洲与长期赞助而持续营建，把跨区域宗教与艺术交流保存为物质证据。", sourceIds: ["unesco-mogao"] },
    { id: "rel-hexi-mogao", sourceId: "mogao-caves", targetId: "hexi", type: "located_in", verb: "在走廊中保存交流证据", startYear: 366, summary: "莫高窟位于敦煌绿洲附近，保存长期宗教与艺术交流证据。", sourceIds: ["unesco-mogao"] },
    { id: "rel-mogao-gandhara", sourceId: "mogao-caves", targetId: "gandharan-art", type: "influenced_by", verb: "吸收并重塑其视觉传统", startYear: 366, endYear: 700, summary: "敦煌石窟艺术吸收来自印度与中亚的佛教图像传统，又在本地材料、赞助与审美中持续重塑，不能理解为简单复制。", sourceIds: ["unesco-mogao", "met-gandhara"] },
    { id: "rel-hexi-han", sourceId: "hexi", targetId: "han-empire", type: "controlled_by", verb: "被纳入军政与补给网络", startYear: -121, endYear: 220, summary: "汉帝国经营河西改变了中原通往西域的政治与军事条件。", sourceIds: ["unesco-changan-tianshan"] },
    { id: "rel-text-translation", sourceId: "sanskrit", targetId: "literary-chinese", type: "translated_into", startYear: 100, endYear: 700, summary: "佛典翻译是重新解释概念、组织术语与建立读者共同体的过程。", sourceIds: ["unesco-kizil"] },
    { id: "rel-kumarajiva-translation", sourceId: "kumarajiva", targetId: "literary-chinese", type: "translated_into", startYear: 401, endYear: 413, summary: "鸠摩罗什在长安的译经活动连接龟兹背景、僧团协作与政治支持。", sourceIds: ["unesco-kizil"] },
    { id: "rel-korea-japan", sourceId: "korea-three-kingdoms", targetId: "nara", type: "introduced_to", startYear: 500, endYear: 600, summary: "朝鲜半岛政权、僧侣与工匠是佛教进入日本早期王权的重要中介。", sourceIds: ["met-korea", "smithsonian-japan"] }
  ],
  /** @type {Story[]} */
  stories: [
    {
      id: "buddhism-eastward",
      title: "佛教如何从印度传播到东亚？",
      subtitle: "一条思想如何借助帝国、绿洲、翻译与艺术跨越亚洲",
      introduction: "这不是一条从起点直达终点的箭头。佛教的向东传播由不同年代的僧侣、商人、统治者、译者、工匠和信众接力完成；每抵达一个区域，教义、图像与制度都被重新解释。",
      startYear: -500,
      endYear: 700,
      mapNote: "传播路线是根据历史接触区绘制的近似教学叠加层，不代表固定疆界、单一路线或一次性迁移。",
      caveat: "地形与通道改变了传播成本，却没有决定传播结果。帝国政策、翻译选择、宗派竞争、地方赞助与个体行动同样关键；海路和藏传路径也未纳入本次纵向切片。",
      featuredEntityIds: ["buddhism", "silk-roads", "kushan", "gandharan-art", "hexi", "mogao-caves"],
      relatedStoryIds: [],
      sourceIds: ["britannica-buddha", "britannica-ashoka", "met-kushan", "met-gandhara", "unesco-silk-roads", "unesco-kizil", "unesco-changan-tianshan", "unesco-mogao", "met-korea", "met-asuka-nara", "smithsonian-japan"],
      timelineEvents: [
        { id: "time-origin", date: "约前6—前5世纪", title: "佛教在恒河流域形成", chapterId: "origin" },
        { id: "time-ashoka", date: "前3世纪", title: "阿育王的护持与铭文", chapterId: "maurya" },
        { id: "time-kushan", date: "1—3世纪", title: "贵霜时代与犍陀罗艺术", chapterId: "gandhara-kushan" },
        { id: "time-oases", date: "2—5世纪", title: "塔里木绿洲的接力传播", chapterId: "central-asian-oases" },
        { id: "time-hexi", date: "2—6世纪", title: "敦煌与河西成为连接节点", chapterId: "hexi-corridor" },
        { id: "time-china", date: "2—8世纪", title: "译经、寺院与本土化", chapterId: "china-heartland" },
        { id: "time-eastasia", date: "4—7世纪", title: "进入朝鲜半岛与日本", chapterId: "korea-japan" }
      ],
      chapters: [
        {
          id: "origin",
          title: "恒河平原：观念在城市网络中形成",
          period: "约前6—前5世纪",
          startYear: -600,
          endYear: -400,
          introduction: "早期佛教出现在北印度政治竞争、城镇增长与修行传统活跃的环境中。它首先是一套由师徒、僧团和在家信众承载的实践，而不是一张已经画好的扩散地图。",
          observation: [
            "恒河流域提供连续农业腹地，城市与河陆交通使人口、物资和思想能够频繁接触。",
            "释迦牟尼的确切年代在学界存在争议，因此地图采用宽时间范围。"
          ],
          mechanism: [
            "人口密集与城市网络降低了讲学、结社和获得供养的成本。",
            "传播仍依赖僧团组织、口传记忆与信众选择，平原本身不会自动产生佛教。"
          ],
          cases: ["释迦牟尼的游行说法", "早期僧团与在家施主网络"],
          caveat: "本阶段是环境与组织条件的解释，不是“河流必然产生宗教”的决定论。",
          view: { lonMin: 78.0, lonMax: 89.0, latMin: 22.0, latMax: 29.5 },
          entityIds: ["buddhism", "ganges-plain", "shakyamuni", "pataliputra"],
          nodeEntityIds: ["ganges-plain", "shakyamuni"],
          routeIds: [],
          sourceIds: ["britannica-buddha"],
          contentStatus: "reviewed"
        },
        {
          id: "maurya",
          title: "孔雀帝国：统治网络放大传播",
          period: "前3世纪",
          startYear: -270,
          endYear: -232,
          introduction: "阿育王对佛教的护持、遍布帝国的铭文和政治交通网络，扩大了佛教的公共可见度。但帝国支持不是一次完成“亚洲传播”的开关。",
          observation: [
            "石柱与岩刻把统治者的伦理主张置于交通节点和公共空间。",
            "孔雀帝国覆盖广阔地区，为人员与信息移动提供了更大的政治尺度。"
          ],
          mechanism: [
            "政治赞助可提供资源、声望与跨地区网络，使宗教组织更容易越过地方边界。",
            "铭文面对不同语言与社群，说明传播必须经过地方化表达。"
          ],
          cases: ["阿育王敕令与石柱", "帝国内外的僧团联系"],
          caveat: "现存材料不能把所有后续传播都归因于阿育王；不同地区的过程并不同步。",
          view: { lonMin: 70.0, lonMax: 90.0, latMin: 20.0, latMax: 34.5 },
          entityIds: ["maurya", "ashoka", "pataliputra", "buddhism"],
          nodeEntityIds: ["ashoka", "gandhara"],
          routeIds: ["route-india-gandhara"],
          sourceIds: ["britannica-ashoka", "met-gandhara"],
          contentStatus: "reviewed"
        },
        {
          id: "gandhara-kushan",
          title: "犍陀罗与贵霜：图像成为跨文化媒介",
          period: "1—3世纪",
          startYear: 1,
          endYear: 300,
          introduction: "犍陀罗处在南亚、中亚与伊朗世界的接触带。贵霜时代的城市、贸易与赞助，使佛教思想和视觉艺术在多语言环境中繁荣。",
          observation: [
            "犍陀罗靠近山口与陆路交通，长期处于多族群、多政权互动之中。",
            "佛像与叙事浮雕吸收古典、南亚和区域视觉传统，形成可辨识又可再造的图像语言。"
          ],
          mechanism: [
            "可移动图像、舍利容器与僧院网络让宗教叙事能跨越语言差异。",
            "贵霜统治把多个接触区纳入更大的商业与政治空间，但地方工坊仍主动改造外来形式。"
          ],
          cases: ["犍陀罗佛像与叙事浮雕", "贵霜时期的佛教赞助与跨区域贸易"],
          caveat: "“希腊影响”不能解释犍陀罗艺术的全部，南亚传统、区域材料和地方赞助同样重要。",
          view: { lonMin: 63.0, lonMax: 77.0, latMin: 29.0, latMax: 40.5 },
          entityIds: ["gandhara", "kushan", "gandharan-art", "bactria", "buddhism"],
          nodeEntityIds: ["gandhara", "kushan", "bactria"],
          routeIds: ["route-india-gandhara", "route-gandhara-tarim"],
          sourceIds: ["met-kushan", "met-gandhara"],
          contentStatus: "reviewed"
        },
        {
          id: "central-asian-oases",
          title: "中亚绿洲：传播依赖一站一站的接力",
          period: "2—5世纪",
          startYear: 100,
          endYear: 500,
          introduction: "沙漠和高山没有阻断交流，却把长距离移动压缩到可补水、可补给、可翻译的绿洲节点。佛教由此不是横穿空白地带，而是在城市之间接力。",
          observation: [
            "塔里木盆地内部极端干旱，交通多沿山麓绿洲和通道展开。",
            "龟兹、于阗等节点留下寺院、石窟、壁画和多语言文本证据。"
          ],
          mechanism: [
            "商队提供移动基础，僧侣与翻译者把商业联系转化为宗教和知识联系。",
            "绿洲政权的赞助与安全条件决定节点能否长期积累寺院、文本与工匠。"
          ],
          cases: ["龟兹与克孜尔石窟", "于阗的绿洲佛教网络"],
          caveat: "“丝绸之路”是后世总称，实际路线多变且含反向流动，不应画成一条永恒大道。",
          view: { lonMin: 65.0, lonMax: 96.5, latMin: 31.0, latMax: 46.0 },
          entityIds: ["silk-roads", "bactria", "tarim-basin", "kucha", "khotan", "kumarajiva"],
          nodeEntityIds: ["bactria", "khotan", "kucha", "dunhuang"],
          routeIds: ["route-gandhara-tarim", "route-tarim-hexi"],
          sourceIds: ["unesco-silk-roads", "unesco-kizil"],
          contentStatus: "reviewed"
        },
        {
          id: "hexi-corridor",
          title: "河西走廊：经卷、译者与石窟在此汇合",
          period: "2—6世纪",
          startYear: 100,
          endYear: 600,
          introduction: "敦煌把塔里木盆地的绿洲网络接入河西走廊。这里既是军政补给链，也是经卷、图像、语言和人的转换节点。",
          observation: [
            "祁连山融水支持走廊绿洲；南北山地与荒漠使交通集中于一串有限节点。",
            "莫高窟从4世纪起持续营建，保存了中国、中亚与印度艺术交流的物质证据。"
          ],
          mechanism: [
            "走廊把分散绿洲变成可接续的补给链，降低了跨越干旱带的移动成本。",
            "国家控制、地方政权、寺院赞助和译经活动共同决定交流的密度与方向。"
          ],
          cases: ["敦煌莫高窟的长期营建", "河西政权与译经、僧侣活动"],
          caveat: "河西并非一直畅通；战争、政权更替、水源变化和替代路线都会使网络中断或转向。",
          view: { lonMin: 91.5, lonMax: 105.0, latMin: 35.5, latMax: 43.0 },
          entityIds: ["hexi", "dunhuang", "mogao-caves", "silk-roads", "han-empire"],
          nodeEntityIds: ["dunhuang", "hexi", "changan"],
          routeIds: ["route-tarim-hexi", "route-hexi-heartland"],
          sourceIds: ["unesco-mogao", "unesco-changan-tianshan"],
          contentStatus: "reviewed"
        },
        {
          id: "china-heartland",
          title: "洛阳与长安：翻译推动本土化",
          period: "2—8世纪",
          startYear: 100,
          endYear: 800,
          introduction: "进入中国内地后，佛教面对新的政治制度、书面语言与思想语汇。译经不是复制，而是选择概念、组织团队并建立新的解释共同体。",
          observation: [
            "长安、洛阳兼具都城、交通枢纽和寺院赞助中心的功能。",
            "僧侣、译者与本地学者将来自不同语言传统的文本转写为汉文。"
          ],
          mechanism: [
            "都城聚集资源、读者与政治赞助，使翻译和寺院制度具有持续性。",
            "语言转换改变概念表达；本土思想与政治需求又反过来塑造宗派和实践。"
          ],
          cases: ["鸠摩罗什在长安的译经活动", "北朝至隋唐的寺院与石窟赞助"],
          caveat: "“本土化”不是外来传统被动适应，而是僧团、信众、国家与既有思想之间的长期互动。",
          view: { lonMin: 94.0, lonMax: 116.5, latMin: 30.0, latMax: 42.0 },
          entityIds: ["changan", "luoyang", "kumarajiva", "sanskrit", "literary-chinese", "han-empire"],
          nodeEntityIds: ["dunhuang", "changan", "luoyang"],
          routeIds: ["route-hexi-heartland"],
          sourceIds: ["unesco-changan-tianshan", "unesco-kizil"],
          contentStatus: "brief"
        },
        {
          id: "korea-japan",
          title: "朝鲜半岛与日本：进入新的政治和艺术体系",
          period: "4—7世纪",
          startYear: 350,
          endYear: 700,
          introduction: "佛教经中国进入朝鲜半岛，再由使节、僧侣、文本、造像与工匠进入日本。新的王权把宗教与寺院、艺术和国家建设联系起来。",
          observation: [
            "佛教约在4世纪进入朝鲜三国的政治文化网络。",
            "日本在6世纪经朝鲜半岛接触佛教经典与造像，飞鸟—奈良时期寺院和国家赞助扩大。"
          ],
          mechanism: [
            "外交赠礼、技术人员迁移与书面语言共同携带宗教，不只是抽象教义在移动。",
            "王权赞助提供建筑与制度资源，地方社会则继续重塑信仰实践。"
          ],
          cases: ["朝鲜三国的佛教艺术与王权赞助", "百济向日本宫廷传入经典与造像的传统记载"],
          caveat: "“中国—朝鲜—日本”只是主线概括，人员和艺术影响并非单向，具体传入年代也因史料体系而异。",
          view: { lonMin: 107.0, lonMax: 140.5, latMin: 29.0, latMax: 43.5 },
          entityIds: ["korean-peninsula", "korea-three-kingdoms", "nara", "literary-chinese", "buddhism"],
          nodeEntityIds: ["luoyang", "korean-peninsula", "nara"],
          routeIds: ["route-heartland-east-asia"],
          sourceIds: ["met-korea", "met-asuka-nara", "smithsonian-japan"],
          contentStatus: "reviewed"
        }
      ]
    }
  ],
  topics: [
    { id: "geography", name: "Geography", zhName: "自然与地理", question: "自然环境如何塑造文明？", status: "available", route: "map" },
    { id: "civilizations", name: "Civilizations", zhName: "文明", question: "文明如何形成并彼此连接？", status: "building" },
    { id: "empires", name: "Empires", zhName: "帝国", question: "谁在什么时候统治了哪里？", status: "available", entityIds: ["maurya", "kushan", "han-empire"] },
    { id: "religions", name: "Religions", zhName: "宗教", question: "思想如何跨越语言与地理传播？", status: "available", route: "story-buddhism-eastward" },
    { id: "languages", name: "Languages & Writing", zhName: "语言与文字", question: "翻译如何改变知识？", status: "available", entityIds: ["sanskrit", "literary-chinese", "kumarajiva"] },
    { id: "technology", name: "Technology", zhName: "科技与知识", question: "新技术让人类获得了什么能力？", status: "building" },
    { id: "trade", name: "Trade & Economy", zhName: "商业与经济", question: "财富、商品与知识如何共同流动？", status: "available", entityIds: ["silk-roads", "hexi"] },
    { id: "art", name: "Art & Architecture", zhName: "艺术与建筑", question: "图像如何跨文化成为共同语言？", status: "available", entityIds: ["gandharan-art", "mogao-caves"] },
    { id: "peoples", name: "Peoples & Migration", zhName: "人群与迁徙", question: "人群如何移动、相遇与融合？", status: "building" },
    { id: "ideas", name: "Ideas", zhName: "思想", question: "人们相信什么，这些观念如何改变社会？", status: "available", route: "story-buddhism-eastward" },
    { id: "events", name: "Events", zhName: "事件", question: "哪些节点改变了历史方向？", status: "building" },
    { id: "patterns", name: "Patterns", zhName: "文明规律", question: "为什么宗教经常沿贸易路线传播？", status: "building" }
  ],
  storyPreviews: [
    { title: "铁器如何改变欧亚大陆？", theme: "科技 × 地理", status: "选题研究中" },
    { title: "丝绸之路不仅运输丝绸", theme: "贸易 × 迁徙", status: "资料整理中" },
    { title: "为什么工业革命发生在英国？", theme: "能源 × 制度", status: "未来专题" }
  ]
};
