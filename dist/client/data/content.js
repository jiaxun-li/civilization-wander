window.ATLAS_STORIES = [
  {
    id: "guanzhong",
    shortTitle: "关中",
    eyebrow: "中国与内亚 · 核心区",
    title: "关中",
    thesis: "关中的优势不是单纯“易守难攻”，而是防御、农业基础和向东投射力量三者同时存在。",
    confidence: "较高",
    tileZoom: 8,
    mapAsset: "assets/guanzhong-relief.webp",
    view: { lonMin: 102.0, lonMax: 112.2, latMin: 31.2, latMax: 37.2 },
    mapNote: "地图只标注关中平原、山脉与河流等自然地理要素，不叠加现代行政区名称。",
    features: [
      { type: "area", kind: "plain", label: "关中平原", lon: 108.2, lat: 34.45, rx: 2.25, ry: 0.62, dy: -8 },
      { type: "ridge", label: "秦岭", points: [[104.4, 33.65], [106.2, 33.45], [108.2, 33.5], [110.0, 33.75], [111.1, 33.9]], dy: 28 },
      { type: "ridge", label: "北山", points: [[105.2, 35.45], [107.2, 35.75], [109.2, 35.65], [110.3, 35.35]], dy: -18 },
      { type: "river", label: "渭河", points: [[104.2, 34.55], [106.0, 34.4], [107.6, 34.35], [109.1, 34.45], [110.25, 34.55]], dy: -16 },
      { type: "river", label: "泾河", points: [[107.5, 36.0], [107.8, 35.3], [108.2, 34.75], [108.55, 34.45]], dx: 20, dy: -10 },
      { type: "river", label: "黄河", points: [[110.2, 36.5], [110.45, 35.7], [110.25, 34.55], [110.7, 33.65], [111.25, 32.9]], dx: 24, dy: 6 }
    ],
    geography: {
      sourceTitle: "Wikipedia：Guanzhong（Geography / Climate）",
      sourceUrl: "https://en.wikipedia.org/wiki/Guanzhong#Geography",
      topography: "关中是秦岭以北、北山山系以南的弧形盆地。盆地中央为渭河下游及其支流堆积形成的冲积平原，平均海拔约300—700米；渭河自西向东贯穿平原，并在东部汇入黄河。",
      geology: "关中盆地属于晋陕盆地带和山西裂谷系的一部分，基本形态是断陷盆地。山前物质与渭河水系长期搬运、堆积，塑造了平原和阶地，也使盆地边缘与内部地貌存在明显高差。",
      climate: "区域年平均气温约13°C，年降水约400—900毫米、平均约600毫米。降水年际波动和较强蒸发共同作用，使原生植被呈森林与草原交错特征；今天看到的广阔农田则是长期人类改造的结果。"
    },
    sections: [
      {
        heading: "地理事实",
        body: [
          "关中位于渭河中下游的河谷平原，南侧为秦岭，北侧为黄土高原南缘，西部和东部由山地及河谷收束。",
          "渭河自西向东贯穿关中，东端经潼关方向连接黄河与中原；西面连接陇西，南面越过秦岭可达汉中。"
        ]
      },
      {
        heading: "地缘政治",
        body: [
          "第一，受保护的核心区降低了敌军直接冲击政治中心的机会，使政权更容易积累人口、粮食与军队。",
          "第二，渭河平原提供农业基础；但这种生产力并非纯天然赠予，也依赖灌溉、人口组织和国家建设。",
          "第三，有限的东向出口既是防线，也是出击通道。因此关中更像一个“有屏障的前进基地”，而不是只能自守的盆地。"
        ]
      },
      {
        heading: "历史实例",
        body: [
          "西周、秦、西汉和唐都把关中作为重要都城区域。秦从这一核心区向东扩张，但最终统一不能只归因于地形：变法、军事组织、官僚制度、人口与资源整合都不可缺少。",
          "关中的地理优势帮助解释“为什么这里适合积累力量”，却不能单独解释“为什么恰好是秦完成统一”。"
        ]
      }
    ],
    timelineNote: "收录改变关中政治地位、都城体系、攻防格局或跨区域交通的关键转折；不是关中发生过的全部事件。",
    timeline: [
      { date: "约前11世纪", title: "周人在关中建立丰镐都城体系", summary: "周人在沣河两岸营建丰、镐，并以关中为核心向东方扩展政治网络。", significance: "关中第一次长期成为统治广大区域的王朝核心，显示盆地资源与东向通道可以结合。", sourceIds: ["shaanxi-chronicle"] },
      { date: "前770年", title: "周平王东迁洛邑", summary: "西周王畿遭受战争冲击，王室把政治中心从关中迁往洛邑。", significance: "说明山河屏障只能提高防御成本，不能保证核心区在政治和军事危机中永不失守。", sourceIds: ["shaanxi-chronicle"] },
      { date: "前350年", title: "秦迁都咸阳", summary: "秦孝公时期将都城迁至渭河北岸的咸阳，变法、农业开发和军事扩张由此加速。", significance: "关中成为秦整合资源并向东方持续投射力量的基地。", sourceIds: ["shaanxi-chronicle", "fang-unification"] },
      { date: "前221年", title: "秦完成统一", summary: "秦国由关中出发兼并六国，建立首个统一的中央集权帝国。", significance: "这是关中“内部积累—东向出击”机制最典型的历史结果，但统一也依赖制度与组织能力。", sourceIds: ["fang-unification"] },
      { date: "前206年", title: "秦亡与刘邦据有关中", summary: "刘邦入关，随后在楚汉战争中重新夺取关中，并把这里作为争夺天下的后方。", significance: "关中在王朝崩溃后仍能迅速被下一支竞争力量转化为战略核心。", sourceIds: ["changan-gazetteer"] },
      { date: "前202—前200年", title: "西汉定都长安", summary: "刘邦建立汉朝，先驻栎阳，随后迁入新建的长安城。", significance: "关中再次成为帝国首都区，并通过漕运、驰道和关隘与全国连接。", sourceIds: ["changan-gazetteer"] },
      { date: "9—23年", title: "新莽末年与长安陷落", summary: "王莽改制引发的政治社会危机与各地战争最终波及长安，新朝覆亡。", significance: "首都的防御优势无法抵消全国性财政、社会和军事秩序的瓦解。", sourceIds: ["shaanxi-chronicle"] },
      { date: "4—5世纪", title: "十六国政权反复争夺长安", summary: "前赵、前秦、后秦等政权先后以长安为都或争夺关中。", significance: "关中仍是北方政治整合的重要奖品，但频繁战争也持续消耗其人口与生产基础。", sourceIds: ["shaanxi-history"] },
      { date: "534—581年", title: "西魏、北周经营关中", summary: "西魏与北周以长安为中心重组军事和政治力量，最终为隋统一奠定基础。", significance: "关中再次发挥受保护的整合基地作用，并连接西北军事集团与中原。", sourceIds: ["shaanxi-chronicle"] },
      { date: "582年", title: "隋营建大兴城", summary: "隋文帝在汉长安城东南建设新都大兴，唐代继续扩建为长安城。", significance: "大规模都城建设体现国家组织能力如何放大关中的区位优势。", sourceIds: ["changan-gazetteer"] },
      { date: "618年", title: "唐朝建立并定都长安", summary: "李渊在长安称帝，唐朝以关中为首都区并逐步完成统一。", significance: "关中最后一次成为长期大一统王朝的首都核心，也是连接东亚与内亚网络的枢纽。", sourceIds: ["shaanxi-chronicle"] },
      { date: "755—763年", title: "安史之乱冲击关中", summary: "叛军攻入长安，唐廷数次撤离；763年吐蕃又短暂占领长安。", significance: "当东部财政基础和西北防线同时失稳时，关中的地形保护不足以维持首都安全。", sourceIds: ["shaanxi-chronicle"] },
      { date: "904年", title: "唐廷被迫东迁洛阳", summary: "朱温强迫唐昭宗迁都，并毁坏长安宫室与城市设施。", significance: "关中作为全国首都核心的时代结束，政治经济重心进一步东移。", sourceIds: ["changan-gazetteer"] },
      { date: "1936年", title: "西安事变", summary: "张学良、杨虎城在西安扣留蒋介石，促成停止内战、共同抗日方向的形成。", significance: "近代交通与政治格局已经改变，但关中作为西北门户和战略后方仍具全国影响。", sourceIds: ["changan-gazetteer"] }
    ],
    takeaway: "关中的真正优势：内部可积累，外部可防守，同时保留进入中原的出口。",
    caveat: "不要把“关中有山河之险”写成决定论。相似地形不会自动产生相同政权，制度与历史时机仍然关键。",
    sources: [
      {
        id: "korolkov-migration",
        title: "Korolkov & Hein, State-Induced Migration and the Creation of State Spaces in Early Chinese Empires",
        url: "https://www.cambridge.org/core/journals/journal-of-chinese-history/article/stateinduced-migration-and-the-creation-of-state-spaces-in-early-chinese-empires-perspectives-from-history-and-archaeology/87D09AD61610E2E7ACC49405863893AB/share/7d75a8cd295189fc97c871073da14cdca0be7967"
      },
      {
        id: "lander-ecology",
        title: "Brian Lander, Birds and Beasts Were Many: Ecology and Climate of the Guanzhong Basin",
        url: "https://www.cambridge.org/core/product/identifier/S0362502820000103/type/journal_article"
      },
      {
        id: "fang-unification",
        title: "Fang et al., China's initial political unification and its aftermath",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4522747/"
      },
      {
        id: "shaanxi-chronicle",
        shortTitle: "陕西省志",
        title: "陕西省地方志办公室，陕西历史沿革与历代都城资料",
        url: "https://dfz.shaanxi.gov.cn/"
      },
      {
        id: "changan-gazetteer",
        shortTitle: "长安县志",
        title: "长安县地方志编纂委员会，《长安县志》大事记",
        url: "https://dfz.shaanxi.gov.cn/zslm/fzzlk/xbsxsxz/xbsxz/xas_16198/201405/P020240923619952680635.pdf"
      },
      {
        id: "shaanxi-history",
        shortTitle: "陕西历史沿革",
        title: "陕西历史沿革：十六国时期关中政权",
        url: "https://www.taiwan.cn/zt/wj/shanxixing_1/xqh/mlsx/201004/t20100415_1321134_3.htm"
      }
    ]
  },
  {
    id: "hexi",
    shortTitle: "河西走廊",
    eyebrow: "中国与内亚 · 通道",
    title: "河西走廊",
    thesis: "河西走廊的重要性来自“可通行地带被压缩”：南北两侧的高山和荒漠，使人员、军队和补给集中到一串绿洲节点。",
    confidence: "较高",
    tileZoom: 8,
    mapAsset: "assets/hexi-relief.webp",
    view: { lonMin: 92.2, lonMax: 104.8, latMin: 35.6, latMax: 42.2 },
    mapNote: "地图只标注走廊、山地、荒漠与主要内流河，不叠加现代城市或行政区名称。",
    features: [
      { type: "area", kind: "plain", label: "河西走廊", lon: 99.2, lat: 39.25, rx: 4.8, ry: 0.62, dy: -8 },
      { type: "area", kind: "desert", label: "巴丹吉林沙漠", lon: 101.1, lat: 41.05, rx: 2.1, ry: 0.72, dy: -4 },
      { type: "ridge", label: "祁连山", points: [[93.5, 37.3], [96.0, 36.85], [98.5, 36.95], [100.8, 37.15], [103.3, 37.55]], dy: 30 },
      { type: "ridge", label: "龙首山—合黎山", points: [[96.2, 40.9], [98.6, 40.55], [100.5, 40.0], [102.5, 39.3]], dy: -18 },
      { type: "river", label: "石羊河", points: [[102.2, 37.25], [102.55, 37.9], [102.8, 38.6], [103.1, 39.25]], dx: 18, dy: -8 },
      { type: "river", label: "黑河", points: [[99.6, 37.1], [100.0, 38.0], [100.45, 38.95], [100.1, 40.0], [99.5, 41.0]], dx: 20, dy: -8 },
      { type: "river", label: "疏勒河", points: [[96.2, 37.5], [96.0, 38.4], [95.4, 39.2], [94.6, 40.0]], dx: -22, dy: -8 }
    ],
    geography: {
      sourceTitle: "Wikipedia：Hexi Corridor（Geography / Geology / Climate）",
      sourceUrl: "https://en.wikipedia.org/wiki/Hexi_Corridor#Geography",
      topography: "河西走廊是一条夹在祁连山与北侧山地、荒漠之间的狭长低地，长约1100公里、典型宽度约40—100公里，地势大体由东南约1500米降至西北约1000米。石羊河、黑河和疏勒河主要接受祁连山冰雪融水，形成冲积扇、内流盆地和间隔分布的绿洲。",
      geology: "走廊是青藏高原抬升、地壳缩短和向北推进形成的新生代前陆盆地，受西北走向逆断层控制，地震活动较强。内部隆起把它分成多个凹陷，凹陷中堆积了厚层第四纪河流与湖相沉积物。",
      climate: "主体属于温带半干旱与温带干旱气候，年平均气温约4—10°C，年降水通常不足200毫米并总体由西南向东北减少。这里处在东部季风影响与西部西风带影响的过渡地带，水源和绿洲范围会随长期气候波动而改变。"
    },
    sections: [
      {
        heading: "地理事实",
        body: [
          "河西走廊位于祁连山北侧，北面和东北面连接戈壁、沙漠与蒙古高原。相较周围地形，它是一条更低、更可通行的狭长地带。",
          "祁连山的冰雪融水向北流入内陆河，河流出山后形成彼此间隔的冲积扇和绿洲。武威、张掖、酒泉、敦煌分布在这条绿洲带上。"
        ]
      },
      {
        heading: "地缘政治",
        body: [
          "第一，祁连山融水形成的绿洲为人口、商旅和军队提供水源与补给；周围的高山和荒漠又把东西交通压缩到较少路线，因此控制绿洲节点就能显著影响整个通道。",
          "第二，绿洲使长距离交通成为可能，但节点之间仍隔着干旱地带，所以补给线脆弱、维护成本高。",
          "第三，它既是贸易通道也是军事走廊：商队、移民、宗教传播、驻军和征服往往使用同一空间网络。"
        ]
      },
      {
        heading: "历史实例",
        body: [
          "汉朝控制河西后设置郡县和屯田据点，从而更稳定地进入塔里木盆地，并切断或限制草原与高原势力之间的联系。",
          "唐朝安史之乱后，西北驻军被调往内地，中央对河西和西域的控制能力下降；但这不是“一条路被永久切断”，而是国家维持节点和补给网络的能力衰退。"
        ]
      }
    ],
    timelineNote: "收录改变走廊控制权、绿洲补给网络、东西交通或族群文化格局的关键转折；早期年代与个别设郡年份存在学术分歧。",
    timeline: [
      { date: "前2世纪以前", title: "月氏、乌孙与匈奴角逐河西", summary: "走廊及周边草原先后是月氏、乌孙等人群活动区域，随后匈奴取得优势。", significance: "在汉朝进入之前，河西已经是连接蒙古高原、青藏高原与中亚的竞争空间。", sourceIds: ["cas-corridors"] },
      { date: "前121年", title: "霍去病河西之战", summary: "汉军击败河西匈奴势力，浑邪王降汉，汉朝开始系统控制走廊。", significance: "走廊控制权转移，使汉朝能够从关中向西建立连续的军事与补给节点。", sourceIds: ["hexi-heritage"] },
      { date: "前121—前88年", title: "河西四郡逐步设立", summary: "汉朝先后经营武威、酒泉、张掖、敦煌四郡，并发展屯田、驿传和边塞体系。", significance: "绿洲节点被纳入行政网络，临时军事通道转化为可持续经营的国家空间。", sourceIds: ["cas-corridors", "hexi-heritage"] },
      { date: "前60年", title: "西域都护设置", summary: "汉朝设置西域都护，河西成为连接中央政权与塔里木盆地的重要后勤通道。", significance: "河西的战略意义从边疆防御扩大为维持跨区域政治联系。", sourceIds: ["cas-corridors"] },
      { date: "2—3世纪", title: "丝路交通与佛教传播增强", summary: "商旅、使节与僧侣经敦煌等绿洲往来，佛教经典、图像和知识沿走廊传播。", significance: "同一条补给链既服务军政控制，也成为跨文化交流网络。", sourceIds: ["dunhuang-unesco"] },
      { date: "301—439年", title: "凉州诸政权并立", summary: "前凉、后凉、南凉、北凉、西凉等政权先后控制走廊不同部分。", significance: "中央王朝衰弱时，绿洲节点足以支持区域政权，却也容易因走廊分段而长期竞争。", sourceIds: ["hexi-heritage"] },
      { date: "366年起", title: "莫高窟持续营建", summary: "敦煌莫高窟传统上以366年为开窟起点，此后历代不断扩建。", significance: "洞窟艺术保存了走廊作为宗教、语言、艺术与贸易交汇地的物质证据。", sourceIds: ["dunhuang-unesco"] },
      { date: "609年", title: "隋炀帝经营河西", summary: "隋朝加强对河西与西域方向的经营，并在张掖一带进行大规模政治外交活动。", significance: "统一王朝重新把走廊作为向西投射国家能力的主轴。", sourceIds: ["cas-corridors"] },
      { date: "7—8世纪前期", title: "唐朝完善河西军政体系", summary: "唐朝设置州郡、军镇与驿站，使河西成为连接长安、安西和北庭的交通骨架。", significance: "强大财政和驻军体系使分散绿洲再次组成连续可控的走廊。", sourceIds: ["hexi-heritage"] },
      { date: "755—约790年", title: "安史之乱后吐蕃占领河西", summary: "唐朝抽调西北军力平乱，吐蕃逐步控制陇右、河西及更西地区。", significance: "走廊价值取决于国家维持驻军与补给节点的能力，而不仅是道路本身存在。", sourceIds: ["hexi-heritage"] },
      { date: "848年", title: "张议潮起事与归义军形成", summary: "张议潮在沙州起事，随后控制河西多地并向唐朝归附，归义军政权延续其后。", significance: "地方力量可利用绿洲网络重建区域秩序，但与中央的联系仍受长距离交通制约。", sourceIds: ["dunhuang-unesco"] },
      { date: "1030年代—1227年", title: "西夏控制河西", summary: "西夏逐步掌握河西重要城市，直至蒙古灭西夏。", significance: "控制走廊为西夏带来贸易、农业和战略纵深，也使其处于宋、辽金与草原力量之间。", sourceIds: ["ethnic-history"] },
      { date: "1271—1368年", title: "元代纳入横贯欧亚的帝国网络", summary: "元朝控制河西后，驿站和跨区域交通与更广阔的蒙古帝国网络衔接。", significance: "当沿线处于同一政治体系内，节点之间的制度性障碍显著降低。", sourceIds: ["cas-corridors"] },
      { date: "1372—1539年", title: "明朝经营嘉峪关与河西诸卫", summary: "明军控制河西东中部，嘉峪关及沿线卫所逐步形成，同时关外控制范围反复收缩。", significance: "关隘可以管理走廊，却不能消除关外绿洲、草原政权与补给距离带来的压力。", sourceIds: ["ethnic-history"] },
      { date: "1760年代", title: "清朝统一新疆后重整西北交通", summary: "清朝控制新疆后，河西由帝国边缘防线转为通往新疆的内部联系轴。", significance: "更大范围的统一改变了走廊两端的政治条件，却没有改变水源和节点对交通的约束。", sourceIds: ["cas-corridors"] }
    ],
    takeaway: "河西走廊的战略价值不只在狭窄，而在于高山、荒漠和绿洲共同制造了一条可控制的补给链。",
    caveat: "“河西走廊”不是从古至今完全不变的一条单线。气候、绿洲水量、政权能力与替代路线都会改变它的实际重要性。",
    sources: [
      {
        id: "cas-corridors",
        title: "Chinese Academy of Sciences, Three Famous Corridors",
        url: "https://english.igsnrr.cas.cn/ecg/zrdl/topography/202011/t20201119_251644.html"
      },
      {
        id: "natural-earth",
        title: "Natural Earth / regional geographic synthesis for the corridor",
        url: "https://www.naturalearthdata.com/"
      },
      {
        id: "hexi-heritage",
        title: "Liu et al., Evolution of Hexi Corridor architectural spaces under environmental and geopolitical pressures",
        url: "https://www.nature.com/articles/s40494-025-02053-7"
      },
      {
        id: "dunhuang-unesco",
        shortTitle: "UNESCO 莫高窟",
        title: "UNESCO World Heritage Centre, Mogao Caves",
        url: "https://whc.unesco.org/en/list/440/"
      },
      {
        id: "ethnic-history",
        shortTitle: "国家民委历史沿革",
        title: "国家民族事务委员会，河西相关历史沿革",
        url: "https://www.neac.gov.cn/seac/ztzl/ygz/lsyg.shtml"
      }
    ]
  },
  {
    id: "sichuan",
    shortTitle: "四川盆地",
    eyebrow: "中国与内亚 · 盆地",
    title: "四川盆地",
    thesis: "四川盆地把“内部资源丰富”和“跨山对外投射困难”结合在一起：这有利于维持区域政权，却不保证能向全国扩张。",
    confidence: "中等偏高",
    tileZoom: 8,
    mapAsset: "assets/sichuan-relief.webp",
    view: { lonMin: 100.5, lonMax: 112.2, latMin: 26.7, latMax: 34.6 },
    mapNote: "地图只标注盆地、平原、山脉与主要河流，不叠加现代城市或行政区名称。",
    features: [
      { type: "area", kind: "basin", label: "四川盆地", lon: 105.9, lat: 30.35, rx: 3.15, ry: 2.05, dy: 14 },
      { type: "area", kind: "plain", label: "成都平原", lon: 103.85, lat: 30.75, rx: 0.82, ry: 0.72, dx: -10, dy: -8 },
      { type: "ridge", label: "龙门山", points: [[102.7, 32.5], [103.2, 31.7], [103.55, 30.7], [103.4, 29.7]], dx: -25, dy: -6 },
      { type: "ridge", label: "大巴山", points: [[106.2, 32.7], [108.0, 32.5], [109.7, 32.2], [110.6, 31.7]], dy: -18 },
      { type: "ridge", label: "巫山", points: [[109.2, 31.5], [109.4, 30.8], [110.0, 30.3], [110.3, 29.7]], dx: 20, dy: -6 },
      { type: "river", label: "长江", points: [[104.6, 28.75], [105.7, 28.9], [106.55, 29.55], [107.8, 30.0], [109.0, 30.55], [110.8, 30.8]], dy: 22 },
      { type: "river", label: "岷江", points: [[103.6, 32.2], [103.65, 31.2], [103.95, 30.7], [103.85, 29.6], [104.0, 28.85]], dx: -22, dy: -8 },
      { type: "river", label: "嘉陵江", points: [[106.0, 33.0], [106.1, 32.0], [106.3, 31.0], [106.7, 30.2], [106.55, 29.55]], dx: 22, dy: -8 },
      { type: "river", label: "大渡河", points: [[102.1, 31.1], [102.6, 30.4], [103.1, 29.7], [103.75, 29.55]], dx: -20, dy: 12 }
    ],
    geography: {
      sourceTitle: "Wikipedia：Sichuan Basin（Geography / Geology / Climate）",
      sourceUrl: "https://en.wikipedia.org/wiki/Sichuan_Basin#Geography",
      topography: "四川盆地是一片四周被山地包围的低地区域，内部并非完全平坦，而以低丘和起伏地形为主。西部成都平原由岷江等河流进入盆地后形成的冲积扇组成；长江上游及岷江、嘉陵江、大渡河等支流共同排泄整个盆地。",
      geology: "盆地位于扬子板块坚硬的西北缘。印度板块与欧亚板块碰撞造成的挤压集中在西缘龙门山断裂带，东缘则形成显著褶皱；盆地广泛出露红色砂岩，因此又有“红色盆地”之称。",
      climate: "盆地以湿润、常多云的四季气候为主，冬季凉到温和，夏季炎热潮湿，东部通常更暖更湿，整体属于湿润亚热带。周围山地容易形成逆温，使雾和低云较常见。"
    },
    sections: [
      {
        heading: "地理事实",
        body: [
          "四川盆地四周多山，内部由成都平原、川中丘陵及长江上游支流网络组成。成都平原位于盆地西部，长江从盆地南部和东部流过。",
          "盆地北面经汉中与秦岭山道相连，东面经长江和三峡通向长江中游；主要出入方向都穿过山地、峡谷或河谷。"
        ]
      },
      {
        heading: "地缘政治",
        body: [
          "第一，内部农业和水利基础能养活较大人口，为地方政权提供财政与兵源。都江堰体现了人类工程如何放大成都平原的地理优势。",
          "第二，外围山地提高了大军进入和持续补给的成本，有限通道给防守方提供时间，也使外部政权必须先控制关键路线和补给节点。",
          "第三，同样的屏障也增加了四川政权向关中、华北或长江中下游长期投射兵力的成本。防守优势不等于进攻优势。"
        ]
      },
      {
        heading: "历史实例",
        body: [
          "古蜀文明长期保持鲜明地方特色；秦征服巴蜀后，四川资源反过来增强了秦的总体实力。三国蜀汉、前蜀和后蜀等政权也说明盆地可以成为区域政权的稳定核心。",
          "但四川并非不可征服。只要外部强权控制汉中、蜀道或长江通道，并维持后勤，盆地的屏障就可能被突破。"
        ]
      }
    ],
    timelineNote: "收录改变四川盆地内部生产、出入通道、政权归属或区域社会结构的关键转折；考古文化年代采用约数。",
    timeline: [
      { date: "约前2500—前1700年", title: "宝墩文化城址群形成", summary: "成都平原出现多座史前城址，反映定居农业、聚落组织和区域中心的发展。", significance: "盆地内部在进入文字史以前已经具备支持复杂社会的资源与组织基础。", sourceIds: ["ancient-shu-chronology"] },
      { date: "约前1700—前1100年", title: "三星堆文明兴盛", summary: "以三星堆为代表的古蜀文化发展出大型城址、青铜祭祀体系和远距离交流网络。", significance: "山地环绕并不意味着文化隔绝；盆地形成了独特中心，同时持续吸收外部技术与物质。", sourceIds: ["ancient-shu-sites", "ancient-shu-capital"] },
      { date: "约前1200—前600年", title: "金沙成为重要中心", summary: "古蜀政治文化中心由三星堆区域转向成都平原腹地的金沙一带。", significance: "盆地内部的核心位置也会随河流、聚落和政治网络变化，并非固定不变。", sourceIds: ["ancient-shu-sites"] },
      { date: "前316年", title: "秦灭巴蜀", summary: "秦军经由山地通道进入四川，兼并巴、蜀，随后设置郡县。", significance: "一旦外部强权掌握入蜀路线与后勤，盆地屏障可以被突破；四川资源随后反哺秦国。", sourceIds: ["sichuan-history"] },
      { date: "约前256年", title: "李冰主持建设都江堰", summary: "秦蜀郡守李冰主持扩建和完善都江堰水利体系，长期灌溉成都平原。", significance: "工程和治理能力放大了自然条件，把水患与水资源转化为稳定农业产出。", sourceIds: ["dujiangyan-gazetteer", "dujiangyan-unesco"] },
      { date: "前206—前202年", title: "巴蜀成为刘邦的战略后方", summary: "刘邦被封汉王后以汉中、巴蜀为基础，重返关中并参与楚汉战争。", significance: "四川不仅能供地方政权自守，也能在通道被有效组织时支撑对外反攻。", sourceIds: ["sichuan-history"] },
      { date: "221年", title: "蜀汉在成都建立", summary: "刘备在成都称帝，蜀汉以四川盆地为核心，并多次经汉中向关中发动北伐。", significance: "盆地足以维持长期政权，但跨越山地的进攻与补给成本限制了持续扩张。", sourceIds: ["sichuan-history"] },
      { date: "263年", title: "魏灭蜀汉", summary: "魏军从北方多路攻蜀，邓艾越过险要山地进入成都平原，蜀汉灭亡。", significance: "屏障并非绝对防线；战略突袭、内部决策和防御部署可以改变地形优势。", sourceIds: ["sichuan-history"] },
      { date: "304—347年", title: "成汉割据四川", summary: "西晋末年动乱中，李氏政权在成都建立成汉，后为东晋桓温所灭。", significance: "外部秩序崩解时，盆地资源和通道防御再次支持独立区域政权。", sourceIds: ["sichuan-history"] },
      { date: "907—965年", title: "前蜀、后蜀相继建立", summary: "唐末五代时期，前蜀与后蜀先后以成都为都，最终被后唐和北宋征服。", significance: "四川可以在全国分裂期维持较稳定政权，但外部完成整合后仍可能沿通道攻入。", sourceIds: ["sichuan-history"] },
      { date: "994年", title: "王小波、李顺起义", summary: "北宋初年四川爆发大规模民变，李顺一度占领成都。", significance: "富庶农业与商业并不自动带来稳定，税赋、土地和政治治理同样决定区域秩序。", sourceIds: ["sichuan-history"] },
      { date: "1258—1279年", title: "宋元战争长期拉锯", summary: "蒙古—元军与南宋在四川山城和长江上游持续争夺，钓鱼城等防御体系延缓了推进。", significance: "山地与要塞能显著提高征服成本，但在更大范围的战略包围下难以永久阻止统一。", sourceIds: ["sichuan-history"] },
      { date: "明末清初", title: "长期战争与人口锐减", summary: "农民军、南明与清军等多方战争反复波及四川，社会经济和人口遭到严重破坏。", significance: "盆地的防守条件也可能延长多方争夺，使战争破坏在内部累积。", sourceIds: ["sichuan-history"] },
      { date: "17世纪末—18世纪", title: "大规模移民与区域重建", summary: "清代持续推动和吸引来自湖广、江西、广东等地的人口迁入四川。", significance: "四川后来的人口与农业恢复不是自然资源自动完成，而依赖迁徙、制度和基层重建。", sourceIds: ["sichuan-history"] },
      { date: "1937—1945年", title: "抗战时期成为战略大后方", summary: "全面抗战期间，大量机构、工厂、学校和人口迁入四川，重庆成为战时首都。", significance: "盆地纵深、长江交通与远离主要战线的区位共同塑造了现代“后方”角色。", sourceIds: ["sichuan-history"] },
      { date: "1952年", title: "成渝铁路全线通车", summary: "连接成都与重庆的成渝铁路建成，成为新中国第一条自行修建的铁路。", significance: "现代基础设施显著降低盆地内部交通成本，也逐步改变传统山地通道的约束方式。", sourceIds: ["sichuan-history"] }
    ],
    takeaway: "四川的地理更擅长帮助一个政权“活下来”，不一定擅长帮助它“打出去”。",
    caveat: "“四川必然割据”同样是错误说法。盆地是否独立，取决于外部政权强弱、交通建设、内部精英联盟和军事组织。",
    sources: [
      {
        id: "dujiangyan-unesco",
        title: "UNESCO, Mount Qingcheng and the Dujiangyan Irrigation System",
        url: "https://whc.unesco.org/en/list/1001/"
      },
      {
        id: "ancient-shu-sites",
        title: "UNESCO, Archaeological Sites of the Ancient Shu State",
        url: "https://whc.unesco.org/en/tentativelists/5816/"
      },
      {
        id: "micang-unesco",
        title: "UNESCO, Guangwushan-Nuoshuihe and the Micang Ancient Road",
        url: "https://www.unesco.org/archives/multimedia/document-4693"
      },
      {
        id: "dujiangyan-gazetteer",
        shortTitle: "《都江堰志》",
        title: "四川省地方志，《四川省志·都江堰志》",
        url: "https://scdfz.sc.gov.cn/scfzg/zssjk/scsz/dylsz18401985/content_3637"
      },
      {
        id: "ancient-shu-chronology",
        shortTitle: "古蜀文明大事年表",
        title: "四川省地方志工作办公室，古蜀文明发展史大事年表",
        url: "https://scsqw.cn/zzfw/zzcy/content_122475"
      },
      {
        id: "ancient-shu-capital",
        shortTitle: "先秦蜀国都城研究",
        title: "全国哲学社会科学工作办公室，先秦蜀国的都城和疆域",
        url: "https://www.nopss.gov.cn/n/2013/0419/c362367-21203630.html"
      },
      {
        id: "sichuan-history",
        shortTitle: "四川历史沿革",
        title: "四川省地方志工作办公室，四川历史沿革",
        url: "https://www.scsqw.cn/scdqs/scsq/content_12033"
      }
    ]
  }
];
