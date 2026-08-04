(function exposeAncientChinaV4(root, factory) {
  const data = factory();
  if (root) root.ATLAS_V4_ANCIENT_CHINA = data;
  if (typeof module === 'object' && module.exports) module.exports = data;
}(typeof window !== 'undefined' ? window : globalThis, function createAncientChinaV4Data() {
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

  function historicalCase(id, title, text, eventIds, sourceIds) {
    return { id, kind: 'historicalCase', title, text, eventIds, sourceIds };
  }

  function synthesis(id, text, sourceIds) {
    return { id, kind: 'editorialSynthesis', text, sourceIds };
  }

  function limitation(id, text, sourceIds) {
    return { id, kind: 'limitation', text, sourceIds };
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

  const mapPresentation = (mapStateId, layers, caption) => ({ kind: 'mapAndText', map: { mapStateId, transition: 'cut', structureViewIds: [], layers, caption } });
  const mapLayer = (entityId, annotationId, sourceIds) => ({ kind: 'entity', entityId, annotationId, sourceIds });

  const sources = [
    { id: 'source-unesco-liangzhu', title: 'Archaeological Ruins of Liangzhu City', publisher: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/1592/' },
    { id: 'source-erlitou-cass-report', title: 'Erlitou, 1999–2006', author: 'Institute of Archaeology, Chinese Academy of Social Sciences', year: 2014, publisher: 'Encyclopaedia of China Publishing House' },
    { id: 'source-erlitou-rethinking', title: 'Rethinking Erlitou: Legend, History and Chinese Archaeology', author: 'Li Liu and Hong Xu', year: 2007, publisher: 'Antiquity', url: 'https://www.cambridge.org/core/journals/antiquity/article/abs/rethinking-erlitou-legend-history-and-chinese-archaeology/FDBD0E8E7C661FC180CAD54AD9742E31' },
    { id: 'source-liu-chen-archaeology-china', title: 'The Archaeology of China: From the Late Paleolithic to the Early Bronze Age', author: 'Li Liu and Xingcan Chen', year: 2012, publisher: 'Cambridge University Press' },
    { id: 'source-xu-xia-debate', title: 'The Erlitou Culture and the Search for the Xia Dynasty', author: 'Hong Xu', year: 2020, publisher: 'The Oxford Handbook of Early China', url: 'https://academic.oup.com/edited-volume/34296' },
    { id: 'source-erlitou-radiocarbon', title: '14C Dating of the Erlitou Site', author: 'Zhang et al.', year: 2021, publisher: 'Radiocarbon', url: 'https://www.cambridge.org/core/journals/radiocarbon/article/14c-dating-of-the-erlitou-site/475359D750D8F9AE70E5126CF4744A4C' },
    { id: 'source-zhao-erlitou-settlement', title: 'New Insights into the Settlement Patterns of the Capital City at Erlitou', author: 'Haitao Zhao', year: 2021, publisher: 'Chinese Archaeology', url: 'https://doi.org/10.1515/char-2021-0012' },
    { id: 'source-thorp-erlitou-xia', title: 'Erlitou and the Search for the Xia', author: 'Robert L. Thorp', publisher: 'Early China' },
    { id: 'source-erlitou-turquoise-restoration', title: 'Study on Archaeological Cleaning and Restoration of Turquoise-Inlaid Dragon-Shaped Artifact from Erlitou Site', year: 2024, publisher: 'Journal of Gems and Gemmology', url: 'https://jogg.cug.edu.cn/article/doi/10.15964/j.cnki.027jgg.2024.05.002' },
    { id: 'source-bagley-shang-archaeology', title: 'Shang Archaeology', author: 'Robert Bagley', year: 1999, publisher: 'The Cambridge History of Ancient China', url: 'https://doi.org/10.1017/CHOL9780521470308.005' },
    { id: 'source-keightley-shang-history', title: 'Sources of Shang History: The Oracle-Bone Inscriptions of Bronze Age China', author: 'David N. Keightley', year: 1978, publisher: 'University of California Press', url: 'https://books.google.com/books?id=8j3pPZqFQVkC' },
    { id: 'source-keightley-ancestral-landscape', title: 'The Ancestral Landscape', author: 'David N. Keightley', year: 2000, publisher: 'Institute of East Asian Studies, University of California, Berkeley', url: 'https://www.ucpress.edu/books/the-ancestral-landscape/paper' },
    { id: 'source-campbell-violence-kinship', title: 'Violence, Kinship and the Early Chinese State', author: 'Roderick Campbell', year: 2018, publisher: 'Cambridge University Press' },
    { id: 'source-liu-shang-ancestors', title: 'Who Were the Ancestors? The Origins of Chinese Ancestral Cult', author: 'Li Liu', year: 1999, publisher: 'Antiquity' },
    { id: 'source-unesco-yinxu', title: 'Yin Xu', publisher: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/1114' },
    { id: 'source-unesco-oracle-bones', title: 'Chinese Oracle-Bone Inscriptions', publisher: 'UNESCO Memory of the World', url: 'https://www.unesco.org/en/memory-world/chinese-oracle-bone-inscriptions' },
    { id: 'source-smithsonian-anyang-neighborhood', title: 'Life in the City: An Anyang Neighborhood', publisher: 'Smithsonian National Museum of Asian Art', url: 'https://asia.si.edu/interactives/anyang/life-in-the-city/index.html' },
    { id: 'source-mizoguchi-xibeigang', title: 'The Xibeigang Royal Cemetery at Anyang', author: 'Koji Mizoguchi and Kazuya Uchida', year: 2018, publisher: 'Routledge' },
    { id: 'source-smarthistory-fu-hao', title: 'War and Sacrifice: The Tomb of Fu Hao', author: 'Cortney E. Chaffin', year: 2021, publisher: 'Smarthistory', url: 'https://smarthistory.org/tomb-of-fu-hao/' },
    { id: 'source-met-shang-zhou-bronze', title: 'Shang and Zhou Dynasties: The Bronze Age of China', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/toah/hd/shzh/hd_shzh.htm' },
    { id: 'source-an-zhengzhou-shang-city', title: 'The Shang City at Zhengzhou and Related Problems', author: 'Jinhuai An', publisher: 'Early China', url: 'https://www.cambridge.org/core/journals/early-china/article/2-the-shang-city-at-zhengzhou-and-related-problems/CC79184977EE1B2D6143C9EB03FA9720' },
    { id: 'source-steinke-erligang', title: 'Art and Archaeology of the Erligang Civilization', author: 'Kyle Steinke and Dora C. Y. Ching', year: 2014, publisher: 'Princeton University Press', url: 'https://tang.princeton.edu/publications/art-and-archaeology-erligang-civilization' },
    { id: 'source-li-feng-early-china', title: 'Early China: A Social and Cultural History', author: 'Li Feng', year: 2013, publisher: 'Cambridge University Press' },
    { id: 'source-national-museum-li-gui', title: 'Li Vessel (Gui)', publisher: 'National Museum of China', url: 'https://en.chnmuseum.cn/collections_577/collection_highlights_608/201911/t20191121_172589.html' },
    { id: 'source-national-museum-guoji-zibai-pan', title: 'Guoji Zibai Pan', publisher: 'National Museum of China', url: 'https://www.chnmuseum.cn/zp/zpml/csp/202008/t20200826_247376.shtml' },
    { id: 'source-anyang-fall', title: 'Annihilation or Decline: The Fall of Anyang as an Urban Center', author: 'Yung-ti Li, Zhanwei Yue and Yuling He', year: 2018, publisher: 'Archaeological Research in Asia', url: 'https://doi.org/10.1016/j.ara.2017.06.003' },
    { id: 'source-cook-western-zhou-rites', title: 'Western Zhou Ritual and the Transformation of Ancestral Practice', author: 'Constance A. Cook', year: 2020, publisher: 'The Oxford Handbook of Early China' },
    { id: 'source-khayutina-cultural-memory', title: 'The Beginning of Cultural Memory Production in China and the Memory Policy of the Zhou Royal House', author: 'Maria Khayutina', year: 2021, publisher: 'Early China', url: 'https://epub.ub.uni-muenchen.de/91298/1/91298.pdf' },
    { id: 'source-schwartz-huayuanzhuang', title: 'The Oracle Bone Inscriptions from Huayuanzhuang East', author: 'Adam C. Schwartz', year: 2019, publisher: 'De Gruyter', url: 'https://doi.org/10.1515/9781501505294' },
    { id: 'source-schwartz-zhen', title: 'A Glimpse of China’s Earliest Decision-Making: The Meaning of Zhēn 貞 “Test” in the Huāyuánzhuāng East Oracular Inscriptions', author: 'Adam Craig Schwartz', year: 2022, publisher: 'Old World: Journal of Ancient Africa and Eurasia' },
    { id: 'source-nivison-question', title: 'The “Question” Question', author: 'David S. Nivison', year: 1990, publisher: 'Early China' },
    { id: 'source-boltz-sexagenary-cycle', title: 'The Chinese Sexagenary Cycle and the Origin of the Chinese Writing System', author: 'William G. Boltz', year: 2019, publisher: 'Max Planck Research Library for the History and Development of Knowledge', url: 'https://www.mprl-series.mpg.de/media/proceedings/11/5/Proceedings11Chap05.pdf' },
    { id: 'source-smithsonian-bronze-casting', title: 'Bronze Age Casting', publisher: 'Smithsonian National Museum of Asian Art', url: 'https://asia-archive.si.edu/learn/ancient-chinese-bronzes/bronze-age-casting/' },
    { id: 'source-smithsonian-anyang-kings', title: 'Anyang: China’s Ancient City of Kings', publisher: 'Smithsonian National Museum of Asian Art', url: 'https://asia.si.edu/exhibition/anyang-chinas-ancient-city-of-kings/' },
    { id: 'source-wikimedia-erlitou-plaque', title: 'Erlitou turquoise-inlaid bronze plaque photograph, CC BY-SA 4.0', author: 'Siyuwj', year: 2024, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:嵌绿松石铜牌饰（87VIM57）,_2024-06-22.jpg' },
    { id: 'source-wikimedia-erlitou-dragon', title: 'Erlitou turquoise dragon-form artifact and bronze bell photograph, CC BY-SA 4.0', author: 'Siyuwj', year: 2024, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:绿松石龙形器及铜铃,_2024-06-23.jpg' },
    { id: 'source-wikimedia-erlitou-site', title: 'Erlitou archaeological site photograph, CC BY-SA 4.0', author: 'Windmemories', year: 2024, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:20240815_Erlitou_Site_01.jpg' },
    { id: 'source-henan-yinxu-royal-tombs-aerial', title: '殷墟文化丨一起走近我国目前已知最早、最完整的王陵墓葬群', author: '河南省文化和旅游厅', year: 2023, publisher: '河南省文化和旅游厅', url: 'https://hct.henan.gov.cn/2023/04-05/2719750.html' },
    { id: 'source-wikimedia-shang-gu', title: 'Shang bronze gu wine vessel photograph, CC BY-SA 3.0', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Gu_wine_vessel_from_the_Shang_Dynasty.jpg' },
    { id: 'source-wikimedia-oracle-bones', title: 'Shang inscribed ox scapula photograph, CC0', author: 'Gary Lee Todd', year: 2013, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Shang_Inscribed_Ox_Scapula_(for_divination).jpg' },
    { id: 'source-wikimedia-fu-hao-tomb', title: 'Reconstructed Tomb of Fu Hao photograph, CC0', author: 'Gary Lee Todd', year: 2008, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Fu_Hao_Tomb,_c._1200_BC,_Reign_of_King_Wu_Ding,_Shang_Dynasty_(10197552004).jpg' },
    { id: 'source-wikimedia-shang-dagger-axes', title: 'Shang bronze dagger-axes from Yinxu photograph, CC0', author: 'Gary Lee Todd', year: 2018, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Shang_Bronze_Ge_Dagger-Axes,_Yinxu,_Anyang.jpg' },
    { id: 'source-wikimedia-shang-pottery', title: 'Shang pottery workshop display photograph, CC0', author: 'Gary Lee Todd', year: 2018, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Shang_Pottery_Workshop_(45146511164).jpg' },
    { id: 'source-wikimedia-li-gui', title: 'Early Western Zhou Li gui photograph, CC0', author: 'Gary Lee Todd', year: 2019, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Early_Western_Zhou_Bronze_Gui_01.jpg' },
    { id: 'source-wikimedia-oracle-pit-marks', title: 'Chinese oracle bone with pit marks photograph, CC0', publisher: 'British Library via Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Chinese_oracle_bone_(16th-10th_C_BC)_-_BL_Or._7694.jpg' },
    { id: 'source-wikimedia-huayuanzhuang-plastron', title: 'Shang turtle plastron with oracle-bone script photograph, CC BY-SA 3.0', author: 'BabelStone', year: 2016, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Ningxia_Museum_Shang_dynasty_turtle_plastron_oracle_bone.jpg' },
    { id: 'source-wikimedia-oracle-eclipse', title: 'Shang inscribed ox bone recording an eclipse divination photograph, CC0', author: 'Gary Todd', year: 2011, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Shang_Inscribed_Ox_Bone_(9830543424).jpg' },
    { id: 'source-wikimedia-oracle-collection', title: 'Shang ox-bone oracle-bone collection photograph, CC0', author: 'Gary Lee Todd', year: 2009, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Shang_Ox_Bone_Oracle_Bones.jpg' },
    { id: 'source-wikimedia-bronze-casting-apparatus', title: 'Shang bronze-casting apparatus and clay moulds photograph, CC0', author: 'Gary Todd', year: 2018, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Shang_Bronze_Casting_Apparatus_%26_Clay_Moulds_(30934169087).jpg' },
    { id: 'source-wikimedia-bronze-mould', title: 'Shang pottery mould for casting bronze photograph, CC0', author: 'Gary Todd', year: 2008, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Shang_Pottery_Mould_for_Casting_Bronze_(10197668873).jpg' },
    { id: 'source-wikimedia-fuhao-cooking-vessels', title: 'Shang bronze cooking vessels from the Tomb of Fu Hao photograph, CC0', author: 'Gary Todd', year: 2018, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Shang_Bronze_Cooking_Vessels_(45001649745).jpg' },
    { id: 'source-sxd-antiquity-2022', title: 'New Discoveries at the Sanxingdui Bronze Age Site in South-west China', author: 'Honglin Ran and colleagues', year: 2022, publisher: 'Antiquity', url: 'https://doi.org/10.15184/aqy.2022.150' },
    { id: 'source-sxd-sacrificial-area-2023', title: 'The Sacrificial Area at the Sanxingdui Site in Guanghan, Sichuan', author: 'Sacrificial Area Archaeological Team of the Sanxingdui Site', year: 2023, publisher: 'Chinese Archaeology', url: 'https://doi.org/10.1515/char-2023-0003' },
    { id: 'source-sxd-ritual-pits-2025', title: 'Newly Discovered Sacrificial Pits at the Sanxingdui Site: Insights into Bronze Age Ritual Remains in Southwest China', author: 'Honglin Ran and colleagues', year: 2025, publisher: 'Archaeological Research in Asia', url: 'https://doi.org/10.1016/j.ara.2025.100621' },
  { id: 'source-sxd-southwest-exchange-2024', title: 'The Southwest Silk Road: Artistic Exchange and Transmission in Early China', year: 2024, publisher: 'Bulletin of the School of Oriental and African Studies', url: 'https://doi.org/10.1017/S0041977X24000120' },
    { id: 'source-sxd-writing-2021', title: 'New Archeological Marvels of Ancient Shu Civilization', author: 'Weijie Zhao', year: 2021, publisher: 'National Science Review', url: 'https://doi.org/10.1093/nsr/nwab071' },
    { id: 'source-wikimedia-sxd-gold-mask-head', title: 'Sanxingdui bronze head with gold foil mask photograph, CC BY 2.0', author: 'momo', year: 2011, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Gold_Mask_(黄金面罩).jpg' },
    { id: 'source-sxd-museum-bronze-tree', title: '青铜神树（馆藏图）', author: '三星堆博物馆', publisher: '三星堆博物馆', url: 'https://www.sxd.cn/relics/' },
    { id: 'source-wikimedia-sxd-ivory-tusk', title: 'Sanxingdui ivory tusk photograph, CC0', author: 'Gary Lee Todd', year: 2008, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Sanxingdui_Ivory_Tusk_(9950882376).jpg' },
    { id: 'source-wikimedia-jinsha-sun-bird', title: 'Jinsha gold sun-bird disc photograph, CC0', author: 'Gary Lee Todd', year: 2014, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:2014_Jinsha_Gold_Sun-Bird_Disc.jpg' },
    { id: 'source-western-zhou-domain', title: 'Archaeological Perspectives on the Western Zhou State and Its Domain', year: 2018, publisher: 'Archaeological Research in Asia', url: 'https://www.sciencedirect.com/science/article/pii/S2352226717300570' },
    { id: 'source-national-museum-da-yu-ding', title: '大盂鼎与西周册命', publisher: '中国国家博物馆', url: 'https://www.chnmuseum.cn/zl/zlhg/201812/t20181220_32409.shtml' },
    { id: 'source-national-museum-ceming', title: '西周册命礼研究', publisher: '中国国家博物馆', url: 'https://www.chnmuseum.cn/yj/xscg/xslw/201812/t20181224_36456.shtml' },
    { id: 'source-li-feng-bronze-offices', title: 'Offices in Bronze Inscriptions and Western Zhou Government Administration', author: 'Li Feng', publisher: 'Early China', url: 'https://www.cambridge.org/core/journals/early-china/article/abs/offices-in-bronze-inscriptions-and-western-zhou-government-administration/55732DE5CD51B308243EC7233C630834' },
    { id: 'source-li-feng-western-zhou-fall', title: 'The Fall of the Western Zhou: Partisan Struggle and Spatial Collapse', author: 'Li Feng', publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/landscape-and-power-in-early-china/fall-of-the-western-zhou-partisan-struggle-and-spatial-collapse/9ED3767010631C65EBB52B4BAF9E5766' },
    { id: 'source-generated-western-zhou-investiture', title: '西周册命仪式教学插图', author: 'OpenAI image generation, edited and reviewed for Civilization Wander', year: 2026, publisher: 'Civilization Wander' }
  ];

  const entities = [
    {
      id: 'western-zhou',
      type: 'polity',
      name: '西周',
      alternativeNames: ['Western Zhou'],
      canonicalSummary: '约公元前1046—前771年，周王室以关中宗周和洛阳附近成周为重要中心，通过亲族与盟友、册命、军事义务和祖先祭祀连接多个区域政治中心。',
      timeSpan: timeSpan(-1046, -771, '约公元前1046—前771年', true),
      defaultCardId: 'western-zhou-bronze-commands',
      tags: ['古中国', '政治实体', '青铜时代'],
      sourceIds: ['source-national-museum-li-gui', 'source-western-zhou-domain', 'source-cook-western-zhou-rites']
    },
    {
      id: 'china-early-bronze-world',
      type: 'culturalTradition',
      name: '中国早期青铜时代',
      alternativeNames: ['Early Bronze Age China'],
      canonicalSummary: '约公元前1900—前771年，黄河、长江及周边地区的城市和区域传统以青铜铸造、礼仪、祖先祭祀与远距离材料交换，形成彼此联系又不完全相同的文化世界。',
      timeSpan: timeSpan(-1900, -771, '约公元前1900—前771年', true),
      defaultCardId: 'china-early-bronze-connected-worlds',
      tags: ['古中国', '文化传统', '青铜时代'],
      sourceIds: ['source-liu-chen-archaeology-china', 'source-met-shang-zhou-bronze', 'source-unesco-liangzhu']
    },
    {
      id: 'erlitou-site',
      type: 'SettlementSite',
      name: '二里头',
      alternativeNames: ['Erlitou'],
      canonicalSummary: '约公元前二千纪前半叶位于洛阳盆地的大型聚落遗址；道路、中央建筑区、专业作坊和差异化墓葬保存了早期城市秩序的重要证据。',
      timeSpan: timeSpan(-1900, -1500, '约公元前1900—前1500年', true),
      defaultCardId: 'erlitou-ritual-world',
      tags: ['古中国', '聚落遗址', '早期青铜时代'],
      sourceIds: ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement', 'source-erlitou-radiocarbon']
    },
    {
      id: 'shang-civilization',
      type: 'polity',
      name: '商文明',
      alternativeNames: ['Shang civilization', '商'],
      canonicalSummary: '约公元前1600—前1000年，由商王室统领的政治实体，以城市、青铜礼器、甲骨文字、祖先祭祀和跨区域联系留下丰富材料。其政治控制的范围和方式会随时期与地点而变化。',
      timeSpan: timeSpan(-1600, -1000, '约公元前1600—前1000年', true),
      defaultCardId: 'shang-ancestors-world',
      tags: ['古中国', '政治实体', '青铜时代'],
      sourceIds: ['source-bagley-shang-archaeology', 'source-keightley-ancestral-landscape', 'source-unesco-yinxu']
    },
    {
      id: 'shang-oracle-bone-inscriptions',
      type: 'TextDocument',
      name: '商代甲骨卜辞',
      alternativeNames: ['oracle-bone inscriptions', '甲骨文'],
      canonicalSummary: '晚商王室在牛肩胛骨和龟甲上留下的占卜文字，记录日期、所问之事、判断与部分结果。',
      timeSpan: timeSpan(-1250, -1046, '晚商时期', true),
      defaultCardId: 'shang-oracle-bones-record',
      tags: ['古中国', '文字', '占卜'],
      sourceIds: ['source-keightley-shang-history', 'source-unesco-oracle-bones', 'source-schwartz-huayuanzhuang']
    },
    {
      id: 'shang-bronze-ritual-vessels',
      type: 'CulturalObject',
      name: '商代青铜礼器',
      alternativeNames: ['Shang ritual bronzes', '青铜礼器'],
      canonicalSummary: '由商代工匠以陶范铸造、用于酒食祭献并常随主人入墓的一组青铜器物。',
      timeSpan: timeSpan(-1600, -1000, '约公元前1600—前1000年', true),
      defaultCardId: 'shang-bronzes-ancestor-feast',
      tags: ['古中国', '青铜器', '祖先礼仪'],
      sourceIds: ['source-bagley-shang-archaeology', 'source-met-shang-zhou-bronze', 'source-smithsonian-bronze-casting']
    },
    {
      id: 'sanxingdui-site',
      type: 'SettlementSite',
      name: '三星堆遗址',
      alternativeNames: ['Sanxingdui'],
      canonicalSummary: '位于今天四川广汉、在青铜时代长期发展的遗址。城址与集中埋藏的青铜、金、玉、象牙等材料，共同保存了成都平原一种独特的仪式世界。',
      timeSpan: timeSpan(-1800, -1000, '约公元前1800—前1000年', true),
      defaultCardId: 'sanxingdui-ritual-world',
      tags: ['古中国', '聚落遗址', '青铜时代', '成都平原'],
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023']
    }
  ];

  const events = [
    {
      id: 'event-western-zhou-eastern-expansion', title: '西周建设东方政治中心', timeSpan: timeSpan(-1045, -1000, '约公元前1045—前1000年', true), participantEntityIds: ['western-zhou'],
      evidenceBlocks: [fact('event-western-zhou-east-evidence', '灭商与东方反叛之后，周人在洛阳附近建设成周，驻扎军队并举行册命与朝会。', ['source-western-zhou-domain', 'source-li-feng-early-china'])],
      sourceIds: ['source-western-zhou-domain', 'source-li-feng-early-china'],
      editorialReview: review([], [], [interpretation('event-western-zhou-east-control', '东方中心与各区域政治实体之间的控制强度随时期和地点而变化。', ['source-western-zhou-domain'])], [], ['source-western-zhou-domain'])
    },
    {
      id: 'event-western-zhou-investiture', title: '西周册命进入青铜铭文', timeSpan: timeSpan(-1020, -850, '约公元前1020—前850年', true), participantEntityIds: ['western-zhou'],
      evidenceBlocks: [fact('event-western-zhou-investiture-evidence', '大盂鼎等青铜铭文记录周王授予贵族职位、任务、礼服、车马和人员，作器者再把王命献给祖先。', ['source-national-museum-da-yu-ding', 'source-national-museum-ceming'])],
      sourceIds: ['source-national-museum-da-yu-ding', 'source-national-museum-ceming'],
      editorialReview: review([limitation('event-western-zhou-investiture-elite', '册命铭文主要保存王室与贵族的政治经验。', ['source-national-museum-ceming'])], [], [], [], ['source-national-museum-ceming'])
    },
    {
      id: 'event-western-zhou-capitals-fall', title: '西周王都失守', timeSpan: timeSpan(-771, -771, '公元前771年'), participantEntityIds: ['western-zhou'],
      evidenceBlocks: [fact('event-western-zhou-fall-evidence', '公元前771年，宫廷反对者与西北方向的武装集团进攻西方王都，周幽王被杀，王室随后迁往成周。', ['source-li-feng-western-zhou-fall', 'source-li-feng-early-china'])],
      sourceIds: ['source-li-feng-western-zhou-fall', 'source-li-feng-early-china'],
      editorialReview: review([], [], [interpretation('event-western-zhou-fall-records', '事件细节部分依赖较晚传世文献，参与者与先后关系仍需结合地理和政治背景解释。', ['source-li-feng-western-zhou-fall'])], [], ['source-li-feng-western-zhou-fall'])
    },
    {
      id: 'event-erlitou-urban-consolidation',
      title: '二里头城市中心形成',
      timeSpan: timeSpan(-1800, -1600, '二里头文化第二至第三期', true),
      participantEntityIds: ['erlitou-site'],
      evidenceBlocks: [
        fact('event-erlitou-urban-consolidation-evidence', '二里头在发展过程中快速扩展，交叉道路、中央建筑区和专业作坊逐渐形成。', ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement'])
      ],
      sourceIds: ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement', 'source-erlitou-radiocarbon'],
      editorialReview: review(
        [limitation('event-erlitou-urban-consolidation-excavation', '已发掘道路与建筑只覆盖遗址的一部分。', ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement'])],
        [],
        [interpretation('event-erlitou-urban-consolidation-phasing', '道路、围墙和建筑区在不同阶段形成，不能视为一次完成的规划。', ['source-zhao-erlitou-settlement', 'source-erlitou-radiocarbon'])],
        [interpretation('event-erlitou-urban-consolidation-causes', '人口集中、生产组织、区域竞争和礼仪活动可能共同推动城市变化。', ['source-liu-chen-archaeology-china', 'source-zhao-erlitou-settlement'])],
        ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement', 'source-erlitou-radiocarbon', 'source-liu-chen-archaeology-china']
      )
    },
    {
      id: 'event-erligang-urban-expansion',
      title: '二里岗城市与物质文化扩展',
      timeSpan: timeSpan(-1600, -1400, '约公元前1600—前1400年', true),
      participantEntityIds: ['shang-civilization', 'western-zhou'],
      evidenceBlocks: [
        fact('event-erligang-urban-expansion-evidence', '郑州出现大型城址和专业作坊，具有相似风格的精英器物与生产技术传播到更广地区。', ['source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-bagley-shang-archaeology'])
      ],
      sourceIds: ['source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-bagley-shang-archaeology'],
      editorialReview: review(
        [limitation('event-erligang-urban-expansion-material', '相似物质文化的分布不能直接等同于边界清晰的政治控制。', ['source-steinke-erligang'])],
        [],
        [interpretation('event-erligang-urban-expansion-identity', '二里岗材料通常与早商相联系，但缺少与晚商甲骨相当的同时代档案。', ['source-bagley-shang-archaeology', 'source-an-zhengzhou-shang-city'])],
        [interpretation('event-erligang-urban-expansion-network', '扩展可能包括直接控制、人员移动、资源获取、地方模仿与区域交换等多种过程。', ['source-steinke-erligang'])],
        ['source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-bagley-shang-archaeology']
      )
    },
    {
      id: 'event-late-shang-royal-divination',
      title: '晚商王室占卜并保存甲骨记录',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      participantEntityIds: ['shang-civilization', 'shang-oracle-bone-inscriptions'],
      evidenceBlocks: [
        fact('event-late-shang-royal-divination-evidence', '晚商王室在牛肩胛骨与龟甲上留下关于祭祀、天气、收成、疾病、战争和王室事务的占卜记录。', ['source-keightley-shang-history', 'source-unesco-oracle-bones'])
      ],
      sourceIds: ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-unesco-oracle-bones'],
      editorialReview: review(
        [limitation('event-late-shang-royal-divination-bias', '现存甲骨主要记录晚商王室的关切，不能代表所有居民。', ['source-keightley-shang-history'])],
        [],
        [interpretation('event-late-shang-royal-divination-survival', '现存甲骨只是商代书写实践中能够保存下来的一部分。', ['source-keightley-shang-history', 'source-unesco-oracle-bones'])],
        [interpretation('event-late-shang-royal-divination-functions', '占卜同时参与亲属秩序、仪式安排和政治决策，不能只归入单一宗教功能。', ['source-keightley-ancestral-landscape', 'source-campbell-violence-kinship'])],
        ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-unesco-oracle-bones', 'source-campbell-violence-kinship']
      )
    },
    {
      id: 'event-fu-hao-activities',
      title: '妇好参与晚商军事与祭祀活动',
      timeSpan: timeSpan(-1250, -1190, '公元前十三世纪', true),
      participantEntityIds: ['shang-civilization'],
      evidenceBlocks: [
        fact('event-fu-hao-activities-evidence', '甲骨记录妇好的分娩、疾病、祭祀与军事行动，未被盗掘的墓葬又保存了带名铜器、兵器和其他随葬品。', ['source-keightley-shang-history', 'source-smarthistory-fu-hao', 'source-mizoguchi-xibeigang'])
      ],
      sourceIds: ['source-keightley-shang-history', 'source-smarthistory-fu-hao', 'source-mizoguchi-xibeigang'],
      editorialReview: review(
        [limitation('event-fu-hao-activities-title', '“第一位女武将”是面向现代读者的通行称呼，不是晚商时代的正式头衔。', ['source-smarthistory-fu-hao'])],
        [],
        [interpretation('event-fu-hao-activities-correlation', '甲骨人物与墓葬材料的对应来自姓名、年代、地点和器物等多组证据的综合。', ['source-keightley-shang-history', 'source-smarthistory-fu-hao'])],
        [interpretation('event-fu-hao-activities-roles', '妇好的地位来自王室亲属、祭祀、军事和资源关系的共同作用。', ['source-smarthistory-fu-hao', 'source-campbell-violence-kinship'])],
        ['source-keightley-shang-history', 'source-smarthistory-fu-hao', 'source-mizoguchi-xibeigang', 'source-campbell-violence-kinship']
      )
    },
    {
      id: 'event-zhou-conquest-of-shang',
      title: '周征服商王室',
      timeSpan: timeSpan(-1050, -1040, '公元前十一世纪中叶', true),
      participantEntityIds: ['shang-civilization'],
      evidenceBlocks: [
        fact('event-zhou-conquest-of-shang-evidence', '早期西周利簋铭文记录周王征服商，安阳不同区域的考古材料显示城市活动并非在同一时刻完全停止。', ['source-national-museum-li-gui', 'source-anyang-fall'])
      ],
      sourceIds: ['source-national-museum-li-gui', 'source-anyang-fall', 'source-khayutina-cultural-memory'],
      editorialReview: review(
        [limitation('event-zhou-conquest-of-shang-memory', '后世关于纣王的道德化故事不能作为战败现场的同时代记录。', ['source-khayutina-cultural-memory', 'source-li-feng-early-china'])],
        [],
        [interpretation('event-zhou-conquest-of-shang-date', '征服的精确公历年份和过程仍有学术讨论。', ['source-li-feng-early-china', 'source-national-museum-li-gui'])],
        [interpretation('event-zhou-conquest-of-shang-change', '政治征服、城市衰落、人口流动和文化转型可能以不同节奏发生。', ['source-anyang-fall'])],
        ['source-national-museum-li-gui', 'source-anyang-fall', 'source-khayutina-cultural-memory', 'source-li-feng-early-china']
      )
    },
    {
      id: 'event-sanxingdui-ritual-object-deposition',
      title: '三星堆仪式器物集中埋藏',
      timeSpan: timeSpan(-1200, -950, '约公元前1200—前950年', true),
      participantEntityIds: ['sanxingdui-site'],
      evidenceBlocks: [
        fact('event-sanxingdui-deposition-evidence', '三星堆相邻的八座器物坑中发现了青铜、金、玉、象牙等材料。部分坑内的器物以明显层次堆放，并保留了破碎和灰烬等痕迹。', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023'])
      ],
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025'],
      editorialReview: review(
        [limitation('event-sanxingdui-deposition-pit-functions', '不同器物坑的形成和用途不能一概而论；发掘报告对部分坑的用途提出了不同判断。', ['source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025'])],
        [],
        [interpretation('event-sanxingdui-deposition-chronology', '各坑的精确年代与彼此关系仍会随新的测年和拼对材料调整。', ['source-sxd-antiquity-2022', 'source-sxd-ritual-pits-2025'])],
        [interpretation('event-sanxingdui-deposition-causes', '有意处置仪式器物并不自动说明迁徙、战争、政权更替或单一宗教事件。', ['source-sxd-southwest-exchange-2024', 'source-sxd-ritual-pits-2025'])],
        ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025']
      )
    }
  ];

  const structuralEdges = [
    {
      id: 'edge-erlitou-shang-transition',
      family: 'historicalNetwork',
      type: 'preceded_and_overlapped_with_early_shang',
      source: { kind: 'entity', id: 'erlitou-site' },
      target: { kind: 'entity', id: 'shang-civilization' },
      timeSpan: timeSpan(-1700, -1500, '二里头晚期与早商物质文化交接时期', true),
      label: { forward: '进入继起的商文明', reverse: '追溯更早的城市礼仪秩序' },
      summaries: { canonical: '二里头晚期与早商物质文化在时间上存在交接和互动；两张故事分别从城市秩序与祖先礼仪观察这段变化。' },
      qualifiers: ['不把考古文化转换写成已经完全确定的单线王朝继承'],
      sourceIds: ['source-erlitou-rethinking', 'source-liu-chen-archaeology-china', 'source-bagley-shang-archaeology']
    },
    {
      id: 'edge-sanxingdui-shang-bronze-comparison',
      family: 'historicalNetwork',
      type: 'shared_bronze_age_material_connections',
      source: { kind: 'entity', id: 'sanxingdui-site' },
      target: { kind: 'entity', id: 'shang-bronze-ritual-vessels' },
      timeSpan: timeSpan(-1300, -1000, '晚商至西周初期', true),
      label: { forward: '比较两套青铜仪式', reverse: '进入成都平原的青铜世界' },
      summaries: { canonical: '三星堆与商代青铜礼器共享青铜时代的材料与技术联系，却把器物组织进不同的仪式形象与使用方式。' },
      qualifiers: ['器物与技术联系不等于政治控制，也不等于单向模仿。'],
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-southwest-exchange-2024', 'source-bagley-shang-archaeology']
    }
  ];

  const cards = [
    {
      id: 'western-zhou-bronze-commands', kind: 'overview', primaryEntityId: 'western-zhou', relatedEntityIds: ['shang-civilization', 'china-early-bronze-world'],
      eventIds: ['event-zhou-conquest-of-shang', 'event-western-zhou-eastern-expansion', 'event-western-zhou-investiture', 'event-western-zhou-capitals-fall'],
      title: '西周把王命铸进青铜', editorialPurpose: '从征服、东方中心、册命、宗族和军事义务讲述西周王国。',
      introduction: '周人击败商王室后，接过了商代成熟的青铜铸造和文字传统。他们把战争、赏赐与任命铸进礼器，让王命能够在一次次祖先祭祀中被重新讲述。',
      thesis: { text: '西周通过多个政治中心、亲族与盟友、册命仪式、军事义务和祖先祭祀，把不同地区连接成一个王国。', sourceIds: ['source-national-museum-li-gui', 'source-western-zhou-domain', 'source-national-museum-da-yu-ding', 'source-cook-western-zhou-rites'] },
      timeSpan: timeSpan(-1046, -771, '约公元前1046—前771年', true),
      sceneIds: ['western-zhou-muye-victory', 'western-zhou-eastern-center', 'western-zhou-allies-regional-centers', 'western-zhou-command-cast-in-ding', 'western-zhou-rites-and-armies', 'western-zhou-capital-falls'],
      sourceIds: ['source-national-museum-li-gui', 'source-western-zhou-domain', 'source-national-museum-da-yu-ding', 'source-national-museum-ceming', 'source-cook-western-zhou-rites', 'source-li-feng-bronze-offices', 'source-li-feng-western-zhou-fall'],
      editorialReview: review(
        [limitation('western-zhou-review-elite', '青铜铭文主要保存周王室与贵族的活动，普通人的声音很少。', ['source-national-museum-ceming'])],
        [historicalCase('western-zhou-review-local-centers', '地方中心发展自己的关系', '各区域政治中心在回应王命的同时，也逐渐拥有自己的祖先、军队和盟友。', ['event-western-zhou-eastern-expansion'], ['source-western-zhou-domain'])],
        [interpretation('western-zhou-review-dates', '灭商的精确公历年份、铭文官职的制度尺度和公元前771年事件细节仍有讨论。', ['source-li-feng-early-china', 'source-li-feng-bronze-offices', 'source-li-feng-western-zhou-fall'])],
        [interpretation('western-zhou-review-combination', '亲族、军事驻点、地方协商、资源分配与礼仪共同维系西周。', ['source-western-zhou-domain', 'source-cook-western-zhou-rites'])],
        ['source-western-zhou-domain', 'source-national-museum-ceming', 'source-li-feng-western-zhou-fall']
      )
    },
    {
      id: 'china-early-bronze-connected-worlds',
      kind: 'overview',
      primaryEntityId: 'china-early-bronze-world',
      relatedEntityIds: ['erlitou-site', 'shang-civilization', 'shang-oracle-bone-inscriptions', 'shang-bronze-ritual-vessels', 'sanxingdui-site'],
      eventIds: ['event-erlitou-urban-consolidation', 'event-erligang-urban-expansion', 'event-late-shang-royal-divination', 'event-sanxingdui-ritual-object-deposition', 'event-zhou-conquest-of-shang'],
      title: '青铜器连接不同的世界',
      editorialPurpose: '把青铜器从孤立的博物馆珍品还原为原料、作坊、城市和仪式共同产生的物件，同时用良渚、二里头、商、三星堆和西周打破单一中心、单一王朝的叙述。',
      introduction: '一件青铜礼器的旅程从矿料和泥土开始，最后抵达祖先、神灵与国王面前。不同城市使用相似的金属，却没有铸出同一个世界。',
      thesis: {
        text: '青铜把矿料、工匠、作坊和远方城市连接起来，也被不同地区放进各自的祭祀与政治生活。它没有突然创造复杂社会，更没有把所有地区变成一种文明；真正值得观察的，是人们怎样让同一种材料承担不同意义。',
        sourceIds: ['source-unesco-liangzhu', 'source-liu-chen-archaeology-china', 'source-smithsonian-bronze-casting', 'source-met-shang-zhou-bronze', 'source-sxd-antiquity-2022']
      },
      timeSpan: timeSpan(-1900, -771, '约公元前1900—前771年', true),
      sceneIds: ['china-bronze-before-bronze', 'china-bronze-materials-fire', 'china-bronze-erlitou-center', 'china-bronze-shang-cities', 'china-bronze-ancestors-records', 'china-bronze-sanxingdui-world', 'china-bronze-zhou-changes'],
      sourceIds: ['source-unesco-liangzhu', 'source-liu-chen-archaeology-china', 'source-smithsonian-bronze-casting', 'source-erlitou-cass-report', 'source-zhao-erlitou-settlement', 'source-bagley-shang-archaeology', 'source-an-zhengzhou-shang-city', 'source-met-shang-zhou-bronze', 'source-keightley-ancestral-landscape', 'source-unesco-yinxu', 'source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-national-museum-li-gui', 'source-cook-western-zhou-rites'],
      editorialReview: review(
        [limitation('china-bronze-world-review-elite', '现存青铜器、甲骨和大型墓葬集中反映统治者、祭祀者与精英生活；“中国早期青铜时代”是覆盖多个区域传统的编辑范围，不是当时人的共同自称。', ['source-liu-chen-archaeology-china', 'source-bagley-shang-archaeology'])],
        [historicalCase('china-bronze-world-review-liangzhu', '复杂社会早于青铜礼器兴盛', '良渚已经拥有城址、水利、社会分化和大型工程；三星堆则说明共享材料与技术不等于共享同一种仪式和政治秩序。', ['event-sanxingdui-ritual-object-deposition'], ['source-unesco-liangzhu', 'source-sxd-antiquity-2022'])],
        [interpretation('china-bronze-world-review-identities', '二里头与文献中夏王朝的对应没有同时代文字完成确认；三星堆器物坑的形成过程、器物身份和仪式用途仍在研究。', ['source-erlitou-rethinking', 'source-sxd-sacrificial-area-2023'])],
        [interpretation('china-bronze-world-review-causes', '青铜生产扩大可能同时受到礼仪需求、战争、区域竞争、矿料网络和统治者资源调动推动；城市和权力集中并非青铜技术自动造成。', ['source-liu-chen-archaeology-china', 'source-smithsonian-bronze-casting'])],
        ['source-unesco-liangzhu', 'source-liu-chen-archaeology-china', 'source-smithsonian-bronze-casting', 'source-erlitou-rethinking', 'source-bagley-shang-archaeology', 'source-sxd-antiquity-2022', 'source-met-shang-zhou-bronze']
      )
    },
    {
      id: 'erlitou-ritual-world',
      kind: 'overview',
      primaryEntityId: 'erlitou-site',
      relatedEntityIds: ['shang-civilization'],
      eventIds: ['event-erlitou-urban-consolidation'],
      title: '二里头形成新的礼仪世界',
      editorialPurpose: '一座没有留下自称的城市，怎样让社会秩序变得可见？',
      introduction: '四千年前，洛阳盆地的一片聚落忽然长出宽阔道路、成组院落和专门作坊。没有人把这里的名字写下来，城市本身却留下了秩序形成的痕迹。',
      thesis: {
        text: '道路、围合空间、专门作坊与差异明显的墓葬，共同把人与人的距离做进城市和器物之中。这里可以被理解为一个正在形成的新礼仪世界，但遗址本身没有留下足以确认其国名的文字。',
        sourceIds: ['source-erlitou-cass-report', 'source-erlitou-rethinking', 'source-zhao-erlitou-settlement']
      },
      timeSpan: timeSpan(-1900, -1500, '约公元前1900—前1500年', true),
      sceneIds: [
        'erlitou-roads-cross-city',
        'erlitou-enclosed-center',
        'erlitou-rare-materials-workshop',
        'erlitou-objects-enter-burials',
        'erlitou-xia-name-absent'
      ],
      sourceIds: ['source-erlitou-cass-report', 'source-erlitou-rethinking', 'source-liu-chen-archaeology-china', 'source-xu-xia-debate', 'source-erlitou-radiocarbon', 'source-zhao-erlitou-settlement', 'source-erlitou-turquoise-restoration'],
      editorialReview: review(
        [
          limitation('erlitou-review-excavation-bias', '发掘集中于中心区和重要遗迹，不能代表所有居民的日常生活。', ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement']),
          limitation('erlitou-review-function', '建筑功能、空间进入规则和器物用途包含考古解释。', ['source-erlitou-rethinking', 'source-liu-chen-archaeology-china'])
        ],
        [],
        [
          interpretation('erlitou-review-chronology', '二里头各阶段的精确年代受样品与统计模型影响。', ['source-erlitou-radiocarbon']),
          interpretation('erlitou-review-xia', '二里头与文献中夏的关系尚无同时代文字完成验证。', ['source-erlitou-rethinking', 'source-xu-xia-debate', 'source-thorp-erlitou-xia'])
        ],
        [
          interpretation('erlitou-review-other-causes', '城市变化也可从资源调配、人口聚集、区域竞争和生产组织解释，不能只归因于礼仪。', ['source-liu-chen-archaeology-china', 'source-zhao-erlitou-settlement']),
          interpretation('erlitou-review-synthesis', '“新的礼仪世界”是本故事对多组证据的编辑综合，不是遗址自称。', ['source-erlitou-cass-report', 'source-erlitou-rethinking'])
        ],
        ['source-erlitou-cass-report', 'source-erlitou-rethinking', 'source-liu-chen-archaeology-china', 'source-xu-xia-debate', 'source-erlitou-radiocarbon', 'source-zhao-erlitou-settlement', 'source-thorp-erlitou-xia']
      )
    },
    {
      id: 'shang-ancestors-world',
      kind: 'overview',
      primaryEntityId: 'shang-civilization',
      relatedEntityIds: ['erlitou-site', 'shang-oracle-bone-inscriptions', 'shang-bronze-ritual-vessels'],
      eventIds: ['event-erligang-urban-expansion', 'event-late-shang-royal-divination', 'event-fu-hao-activities', 'event-zhou-conquest-of-shang'],
      title: '商人生活在祖先的目光下',
      editorialPurpose: '商人怎样让死者继续参与活人的世界，并把这种关系写进城市、器物和记忆？',
      introduction: '商人相信死亡没有让家人离开。祖先仍会收到酒肉、听见问题，也可能影响收成、疾病和战争。',
      thesis: {
        text: '商文明的独特性不只在青铜或甲骨本身，而在于它把亲属关系、祭献、占卜、战争和城市劳动组织成一个以祖先为中心的生活秩序。商王朝结束后，这些传统被周人继承和改变，商也被重新写进后世的政治记忆。',
        sourceIds: ['source-bagley-shang-archaeology', 'source-keightley-ancestral-landscape', 'source-campbell-violence-kinship', 'source-khayutina-cultural-memory']
      },
      timeSpan: timeSpan(-1600, -1000, '约公元前1600—前1000年', true),
      sceneIds: [
        'shang-civilization-forms-between-cities',
        'shang-dead-remain-in-family',
        'shang-meal-for-ancestors',
        'shang-when-bone-cracks',
        'shang-fu-hao-two-records',
        'shang-war-enters-sacrifice',
        'shang-people-beyond-royal-house',
        'shang-last-king-story-spreads'
      ],
      sourceIds: ['source-bagley-shang-archaeology', 'source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-campbell-violence-kinship', 'source-unesco-yinxu', 'source-unesco-oracle-bones', 'source-smithsonian-anyang-neighborhood', 'source-smarthistory-fu-hao', 'source-anyang-fall', 'source-khayutina-cultural-memory'],
      editorialReview: review(
        [
          limitation('shang-review-oracle-bias', '现存甲骨主要来自晚商王室，占卜问题不能代表所有商人。', ['source-keightley-shang-history', 'source-unesco-oracle-bones']),
          limitation('shang-review-early-archives', '郑州至安阳之间缺少同等密度的连续文字档案，早商叙事主要依靠考古材料。', ['source-bagley-shang-archaeology', 'source-steinke-erligang'])
        ],
        [historicalCase('shang-review-regional-variation', '不同社群的礼仪并不完全相同', '商代礼仪在不同家庭、地区和社会层级中可能存在显著差异。', ['event-erligang-urban-expansion'], ['source-liu-shang-ancestors', 'source-smithsonian-anyang-neighborhood'])],
        [
          interpretation('shang-review-erligang-control', '二里岗物质文化的广泛分布不等于一套边界清晰、控制方式一致的帝国。', ['source-steinke-erligang']),
          interpretation('shang-review-fu-hao', '妇好相关甲骨、器物铭名及人物身份的对应依赖多组材料的综合判断。', ['source-keightley-shang-history', 'source-smarthistory-fu-hao']),
          interpretation('shang-review-conquest', '周征服的精确年份、过程和安阳各区域的衰落节奏仍有讨论。', ['source-anyang-fall', 'source-li-feng-early-china'])
        ],
        [
          interpretation('shang-review-power', '战争、祭祀、亲属关系、劳动力和资源获取共同塑造商王权，不能压缩成宗教控制一切。', ['source-campbell-violence-kinship']),
          interpretation('shang-review-last-king', '末代昏君故事属于后世政治和道德记忆，不能替代同时代证据。', ['source-khayutina-cultural-memory', 'source-li-feng-early-china'])
        ],
        ['source-bagley-shang-archaeology', 'source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-campbell-violence-kinship', 'source-liu-shang-ancestors', 'source-steinke-erligang', 'source-smarthistory-fu-hao', 'source-anyang-fall', 'source-khayutina-cultural-memory']
      )
    },
    {
      id: 'shang-oracle-bones-record',
      kind: 'story',
      primaryEntityId: 'shang-oracle-bone-inscriptions',
      relatedEntityIds: ['shang-civilization'],
      eventIds: ['event-late-shang-royal-divination'],
      title: '甲骨把问神变成记录',
      editorialPurpose: '一场转瞬即逝的占卜，怎样因为刻写而变成三千多年后仍可追索的记录？',
      introduction: '一场占卜原本只存在于火、裂纹和人的判断之间。商人把文字刻在旁边后，一次转瞬即逝的求问，三千多年后仍能被重新读出。',
      thesis: {
        text: '晚商王室把灼骨、判断、日名与刻写连成一套可反复操作的记录实践，使战争、祭祀、收成与家庭忧虑留下了可以彼此对读的文字材料。',
        sourceIds: ['source-keightley-shang-history', 'source-schwartz-huayuanzhuang', 'source-unesco-oracle-bones']
      },
      timeSpan: timeSpan(-1250, -1046, '晚商时期', true),
      sceneIds: [
        'shang-oracle-fire-opens-bone',
        'shang-oracle-divination-becomes-record',
        'shang-oracle-question-repeated',
        'shang-oracle-ancestors-calendar',
        'shang-oracle-royal-questions-survive'
      ],
      sourceIds: ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-schwartz-huayuanzhuang', 'source-schwartz-zhen', 'source-nivison-question', 'source-boltz-sexagenary-cycle', 'source-unesco-oracle-bones'],
      editorialReview: review(
        [limitation('shang-oracle-review-royal-bias', '现存材料主要保存晚商王室及其亲属的关切，不能代表所有商人的书写与生活。', ['source-keightley-shang-history', 'source-schwartz-huayuanzhuang'])],
        [],
        [
          interpretation('shang-oracle-review-earliest-corpus', '甲骨卜辞是中国目前所知最早的大规模成熟文字材料，不等于已经证明文字只在此时突然出现。', ['source-unesco-oracle-bones', 'source-boltz-sexagenary-cycle']),
          interpretation('shang-oracle-review-inscription-parts', '命辞、占辞与验辞的辨认以及部分刻辞的排列顺序仍依赖释读与分期。', ['source-keightley-shang-history', 'source-nivison-question'])
        ],
        [interpretation('shang-oracle-review-deposition', '成批埋藏的甲骨来自不同形成、整理和弃置过程，不应直接等同于按现代制度建立的档案库。', ['source-keightley-shang-history', 'source-schwartz-huayuanzhuang'])],
        ['source-keightley-shang-history', 'source-schwartz-huayuanzhuang', 'source-nivison-question', 'source-boltz-sexagenary-cycle', 'source-unesco-oracle-bones']
      )
    },
    {
      id: 'shang-bronzes-ancestor-feast',
      kind: 'story',
      primaryEntityId: 'shang-bronze-ritual-vessels',
      relatedEntityIds: ['shang-civilization'],
      eventIds: ['event-fu-hao-activities', 'event-zhou-conquest-of-shang'],
      title: '青铜从作坊进入祖先宴席',
      editorialPurpose: '一件青铜礼器怎样从原料与作坊出发，进入祖先祭献、身份秩序和历史记忆？',
      introduction: '一件商代青铜器并不从墓里开始。它先汇聚远方的矿料和作坊里的许多双手，最终进入献给祖先的酒食，又随主人一同埋入地下。',
      thesis: {
        text: '商代青铜礼器把跨区域原料、复杂铸造、酒食祭献与亲属身份连接起来；商亡之后，这套技术与礼仪继续存在，并在周人的铭文和政治秩序中获得新的用途。',
        sourceIds: ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting', 'source-met-shang-zhou-bronze', 'source-cook-western-zhou-rites']
      },
      timeSpan: timeSpan(-1600, -1000, '约公元前1600—前1000年', true),
      sceneIds: [
        'shang-bronze-materials-reach-workshop',
        'shang-bronze-clay-mould-shapes-vessel',
        'shang-bronze-vessels-form-feast',
        'shang-bronze-mask-and-name',
        'shang-bronze-follows-owner-to-tomb'
      ],
      sourceIds: ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting', 'source-smithsonian-anyang-kings', 'source-met-shang-zhou-bronze', 'source-keightley-ancestral-landscape', 'source-smarthistory-fu-hao', 'source-cook-western-zhou-rites'],
      editorialReview: review(
        [
          limitation('shang-bronze-review-distribution', '相似青铜器与铸造材料的分布不能直接等同于边界清晰、控制一致的商王朝疆域。', ['source-bagley-shang-archaeology']),
          limitation('shang-bronze-review-centralization', '大型作坊显示高度组织的生产，却不能说明所有铸造都由单一王室中心直接管理。', ['source-smithsonian-bronze-casting', 'source-bagley-shang-archaeology'])
        ],
        [],
        [
          interpretation('shang-bronze-review-mask-meaning', '后称“饕餮”的兽面纹在商代的名称与具体寓意并不确定。', ['source-met-shang-zhou-bronze', 'source-bagley-shang-archaeology']),
          interpretation('shang-bronze-review-vessel-codes', '礼器组合会随时期、地区和身份变化，不宜写成一套从不改变的精确等级代码。', ['source-bagley-shang-archaeology', 'source-cook-western-zhou-rites'])
        ],
        [interpretation('shang-bronze-review-casting-variation', '分范法是商代青铜铸造的核心技术，但具体制模、合范与浇铸工序存在器类和作坊差异。', ['source-smithsonian-bronze-casting', 'source-bagley-shang-archaeology'])],
        ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting', 'source-met-shang-zhou-bronze', 'source-smarthistory-fu-hao', 'source-cook-western-zhou-rites']
      )
    },
    {
      id: 'sanxingdui-ritual-world',
      kind: 'story',
      primaryEntityId: 'sanxingdui-site',
      relatedEntityIds: ['shang-bronze-ritual-vessels'],
      eventIds: ['event-sanxingdui-ritual-object-deposition'],
      title: '三星堆让看不见的世界现身',
      editorialPurpose: '从八座器物坑出发，解释面具、人像、神树与稀有材料如何可能在仪式中发挥作用，同时让读者看见这些器物尚未被完全破解。',
      introduction: '在成都平原，一座青铜时代古城留下了巨大的面孔、人像、树、象牙与金器。它们被集中送进相邻的坑中，却没有留下能读懂的文字来解释自己。',
      thesis: {
        text: '三星堆的青铜面具、立人、树形器、金器与象牙很可能共同构成了一场可被观看的仪式，而非互不相干的奇物。不过，器物没有留下可以逐一解读的说明：它们代表谁、如何被使用、埋藏为何发生，至今仍是考古学者正在追问的问题。',
        sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-southwest-exchange-2024', 'source-sxd-writing-2021']
      },
      timeSpan: timeSpan(-1800, -950, '约公元前1800—前950年', true),
      sceneIds: [
        'sanxingdui-pits-beneath-city',
        'sanxingdui-bronze-faces-watch',
        'sanxingdui-people-tree-birds',
        'sanxingdui-materials-meet',
        'sanxingdui-ritual-world-is-buried'
      ],
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025', 'source-sxd-southwest-exchange-2024', 'source-sxd-writing-2021'],
      editorialReview: review(
        [
          limitation('sanxingdui-review-evidence-scope', '现有材料主要来自城址和器物坑，不能把它们当成三星堆所有居民日常生活的完整记录。', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023'])
        ],
        [],
        [
          interpretation('sanxingdui-review-identities', '青铜头像、面具、立人和树形器的具体身份、名称与仪式角色尚不能由同时代文字直接确认。', ['source-sxd-writing-2021', 'source-sxd-southwest-exchange-2024'])
        ],
        [
          interpretation('sanxingdui-review-jinsha', '三星堆与金沙之间的相似材料和图像支持关联与延续的讨论，但不足以证明单一、整体的人口迁徙。', ['source-sxd-southwest-exchange-2024'])
        ],
        ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-ritual-pits-2025', 'source-sxd-southwest-exchange-2024', 'source-sxd-writing-2021']
      )
    }
  ];

  const scenes = [
    {
      id: 'western-zhou-muye-victory', title: '甲子日清晨，周军攻向商王', eyebrow: '牧野与利簋', timeSpan: timeSpan(-1046, -1046, '约公元前1046年', true),
      contentBlocks: [fact('western-zhou-muye-victory-fact', '来自西方的周人联合盟友，在牧野击败商王的军队。商代最后一位君王帝辛死去，周武王成为新的天下共主。胜利后不久，一名叫“利”的官员铸造青铜簋，在器内写下甲子日清晨的战事，以及周王赐给自己的金属。周王朝由战争开始，也从一开始就把胜利写进青铜。', ['source-national-museum-li-gui', 'source-li-feng-early-china'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-li-gui' }, sourceIds: ['source-national-museum-li-gui', 'source-li-feng-early-china', 'source-wikimedia-li-gui']
    },
    {
      id: 'western-zhou-eastern-center', title: '周人在东方建起新的中心', eyebrow: '宗周与成周', timeSpan: timeSpan(-1045, -1000, '约公元前1045—前1000年', true),
      contentBlocks: [fact('western-zhou-eastern-center-fact', '周人的故乡在关中，商王朝原有的人口、城邑和道路却广泛分布在东方。周武王去世后，东方发生反叛，年轻的新王面临重新控制旧商地区的任务。周人随后在今天洛阳附近建设成周。这里驻有军队、贵族和迁来的居民，也能举行册命与朝会。西方的宗周与东方的成周共同支撑王国。', ['source-western-zhou-domain', 'source-li-feng-early-china'])],
      presentation: mapPresentation('map-western-zhou-two-centers', [mapLayer('western-zhou', 'annotation-western-zhou-zongzhou', ['source-western-zhou-domain']), mapLayer('western-zhou', 'annotation-western-zhou-chengzhou', ['source-western-zhou-domain'])], '圆点标出关中的宗周与洛阳附近的成周；连线表示两个王室中心的政治联系。'), sourceIds: ['source-western-zhou-domain', 'source-li-feng-early-china', 'source-natural-earth']
    },
    {
      id: 'western-zhou-allies-regional-centers', title: '亲族和盟友带着王命前往各地', eyebrow: '区域政治中心', timeSpan: timeSpan(-1040, -950, '约公元前1040—前950年', true),
      contentBlocks: [synthesis('western-zhou-allies-regional-centers-synthesis', '周王把亲族、功臣和盟友派往各地。他们带着人员、车辆和礼器建立新的据点，控制道路，组织军队，也与当地社群建立婚姻和政治关系。这些首领从周王那里获得土地、人口和身份，在战争与朝会时则要提供兵员、车辆和贡物。随着时间推移，他们的家族在当地拥有自己的祖先墓地、军队与盟友。', ['source-western-zhou-domain', 'source-li-feng-bronze-offices'])],
      presentation: mapPresentation('map-western-zhou-regional-centers', [mapLayer('western-zhou', 'annotation-western-zhou-royal-core', ['source-western-zhou-domain']), mapLayer('western-zhou', 'annotation-western-zhou-eastern-regions', ['source-western-zhou-domain']), mapLayer('western-zhou', 'annotation-western-zhou-northern-regions', ['source-western-zhou-domain'])], '圆点表示王室核心与若干区域政治中心的教学选点；连线表示册命、朝会与军事联系。'), sourceIds: ['source-western-zhou-domain', 'source-li-feng-bronze-offices', 'source-natural-earth']
    },
    {
      id: 'western-zhou-command-cast-in-ding', title: '一次任命被铸进大鼎', eyebrow: '大盂鼎与册命', timeSpan: timeSpan(-1000, -950, '约公元前1000—前950年', true),
      contentBlocks: [fact('western-zhou-command-cast-in-ding-fact', '周康王在宗庙中召见一名叫“盂”的贵族，宣布他的职位和任务。仪式中有官员宣读王命，盂随后获得礼服、旗帜、车马和人员。盂铸造了一件巨大的青铜鼎，把这次任命写在内壁，并将它献给祖先。此后家族举行祭祀时，鼎中的铭文会再次唤起周王的命令。', ['source-national-museum-da-yu-ding', 'source-national-museum-ceming'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-western-zhou-investiture-teaching' }, sourceIds: ['source-national-museum-da-yu-ding', 'source-national-museum-ceming', 'source-generated-western-zhou-investiture']
    },
    {
      id: 'western-zhou-rites-and-armies', title: '祭祖、宴饮和出兵维持王国', eyebrow: '礼仪与义务', timeSpan: timeSpan(-950, -850, '约公元前950—前850年', true),
      contentBlocks: [synthesis('western-zhou-rites-and-armies-synthesis', '贵族用鼎、簋和酒器祭祀祖先，在宴饮中安排席位、交换礼物并确认身份。青铜器上的铭文提醒家族，他们的地位来自哪位周王，又承担着怎样的职责。西周晚期，虢季子白出征后在王前献俘、参加宴饮并接受赏赐，又把战功写进大型青铜盘。周王发动战争时，各地首领带领人员、车辆和武器前来，完成任务的人则可能把新的功绩铸进青铜。', ['source-cook-western-zhou-rites', 'source-national-museum-ceming', 'source-li-feng-bronze-offices', 'source-national-museum-guoji-zibai-pan'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-guoji-zibai-pan' }, sourceIds: ['source-cook-western-zhou-rites', 'source-national-museum-ceming', 'source-li-feng-bronze-offices', 'source-national-museum-guoji-zibai-pan']
    },
    {
      id: 'western-zhou-capital-falls', title: '王都失守，周王室迁向东方', eyebrow: '公元前771年', timeSpan: timeSpan(-850, -771, '约公元前850—前771年', true),
      contentBlocks: [synthesis('western-zhou-capital-falls-synthesis', '西周晚期，各地贵族已经积累了自己的军队、土地和盟友。王室内部的继承冲突也把不同政治集团卷入争斗。公元前771年，宫廷反对者与来自西北方向的武装集团共同进攻西方王都，周幽王被杀。新的周王在诸侯支持下迁往东方的成周。周王室、祭祀和王命仍然延续，政治中心却已经改变。', ['source-li-feng-western-zhou-fall', 'source-li-feng-early-china'])],
      presentation: mapPresentation('map-western-zhou-eastward-move', [mapLayer('western-zhou', 'annotation-western-zhou-fallen-capital', ['source-li-feng-western-zhou-fall']), mapLayer('western-zhou', 'annotation-western-zhou-eastern-capital', ['source-li-feng-western-zhou-fall'])], '宗周在公元前771年失守；粗线由关中指向洛阳附近的成周，标出王室东迁。'), sourceIds: ['source-li-feng-western-zhou-fall', 'source-li-feng-early-china', 'source-natural-earth']
    },
    {
      id: 'china-bronze-before-bronze',
      title: '青铜以前，城市已经出现',
      eyebrow: '良渚与更早的区域中心',
      timeSpan: timeSpan(-3300, -1900, '约公元前3300—前1900年', true),
      contentBlocks: [fact('china-bronze-before-bronze-fact', '在青铜礼器大量出现以前，长江下游的良渚人已经筑城、修建水坝、种植水稻，并把精细玉器放进少数人的墓中。更北方也出现围墙、台基和大型公共工程。复杂社会不是青铜突然带来的；青铜后来进入的，是一个早已有许多区域中心的世界。', ['source-unesco-liangzhu', 'source-liu-chen-archaeology-china'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-china-early-bronze-world', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'china-early-bronze-world', annotationId: 'annotation-china-bronze-liangzhu', sourceIds: ['source-unesco-liangzhu'] },
        { kind: 'entity', entityId: 'erlitou-site', annotationId: 'annotation-china-bronze-erlitou', sourceIds: ['source-erlitou-cass-report'] },
        { kind: 'entity', entityId: 'sanxingdui-site', annotationId: 'annotation-china-bronze-sanxingdui', sourceIds: ['source-sxd-antiquity-2022'] }
      ], caption: '三个文字标注分别指出良渚、二里头与三星堆；它们所处年代不同，用来展示区域中心的接续与多样性，不表示同时存在的统一网络。' } },
      sourceIds: ['source-unesco-liangzhu', 'source-liu-chen-archaeology-china', 'source-erlitou-cass-report', 'source-sxd-antiquity-2022', 'source-natural-earth']
    },
    {
      id: 'china-bronze-materials-fire',
      title: '矿料在火中变成礼器',
      eyebrow: '青铜作坊',
      timeSpan: timeSpan(-2000, -771, '约公元前2000—前771年', true),
      contentBlocks: [fact('china-bronze-materials-fire-fact', '青铜不是从地下直接挖出的成品。矿料被送进作坊，铜与锡等材料在炉火中熔合。工匠先用泥做出模型，再分块制成陶范，合拢后把金属液倒进去。采矿、运输、制范、烧炉和浇铸缺一不可；一件大礼器背后，站着一整条看不见的协作队伍。', ['source-smithsonian-bronze-casting', 'source-met-shang-zhou-bronze'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-bronze-casting-apparatus' },
      sourceIds: ['source-smithsonian-bronze-casting', 'source-met-shang-zhou-bronze', 'source-wikimedia-bronze-casting-apparatus']
    },
    {
      id: 'china-bronze-erlitou-center',
      title: '二里头把作坊放进城市中心',
      eyebrow: '洛阳盆地',
      timeSpan: timeSpan(-1900, -1500, '约公元前1900—前1500年', true),
      contentBlocks: [fact('china-bronze-erlitou-center-fact', '约四千年前，洛阳盆地的二里头迅速扩大。宽阔道路把居住区、作坊和成组的大型建筑分开，铜器与绿松石器物则集中出现在城市中心附近。多数墓葬十分简单，少数死者身旁却放着铜铃、玉器和成千片绿松石。材料、道路和仪式共同标出了城市的中心。', ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement', 'source-erlitou-turquoise-restoration'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-erlitou-turquoise-bronze-plaque' },
      sourceIds: ['source-erlitou-cass-report', 'source-zhao-erlitou-settlement', 'source-erlitou-turquoise-restoration', 'source-wikimedia-erlitou-plaque']
    },
    {
      id: 'china-bronze-shang-cities',
      title: '商文明在城市之间成形',
      eyebrow: '早商城市网络',
      timeSpan: timeSpan(-1600, -1250, '约公元前1600—前1250年', true),
      contentBlocks: [synthesis('china-bronze-shang-cities-synthesis', '公元前二千纪中叶，郑州出现巨大的城墙和成片作坊。相似的青铜器、陶器与制作方法也在更远的城市出现，一直抵达长江附近。工匠、器物和往来路线让商文明逐渐获得形状。它的开端不是一个能够圈出的日子，而是一张不断扩展的城市网络。', ['source-bagley-shang-archaeology', 'source-an-zhengzhou-shang-city', 'source-steinke-erligang'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-early-shang-network', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'shang-civilization', annotationId: 'annotation-shang-zhengzhou', sourceIds: ['source-an-zhengzhou-shang-city'] },
        { kind: 'entity', entityId: 'shang-civilization', annotationId: 'annotation-shang-panlongcheng', sourceIds: ['source-steinke-erligang'] },
        { kind: 'entity', entityId: 'shang-civilization', annotationId: 'annotation-shang-anyang', sourceIds: ['source-unesco-yinxu'] }
      ], caption: '文字标出郑州、盘龙城和晚期中心安阳；浅棕色范围表示相似物质文化的大致传播区域，不是商王朝的确定边界。' } },
      sourceIds: ['source-bagley-shang-archaeology', 'source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-unesco-yinxu', 'source-natural-earth']
    },
    {
      id: 'china-bronze-ancestors-records',
      title: '青铜和甲骨把祖先请进王室',
      eyebrow: '晚商祖先祭祀',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [fact('china-bronze-ancestors-records-fact', '在晚商都城安阳，祭祀常从一顿郑重安排的酒食开始。青铜鼎盛放食物，酒器把祭品送给祖先；另一边，王室把关于收成、疾病和战争的问题刻在龟甲与牛骨上，再用火灼出裂纹。青铜让祖先享用祭品，文字则把向祖先提出的问题保存下来。', ['source-keightley-ancestral-landscape', 'source-keightley-shang-history', 'source-unesco-oracle-bones'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-bronze-vessel-set' },
      sourceIds: ['source-keightley-ancestral-landscape', 'source-keightley-shang-history', 'source-unesco-oracle-bones', 'source-wikimedia-fuhao-cooking-vessels']
    },
    {
      id: 'china-bronze-sanxingdui-world',
      title: '三星堆铸出另一套神灵形象',
      eyebrow: '成都平原',
      timeSpan: timeSpan(-1200, -950, '约公元前1200—前950年', true),
      contentBlocks: [synthesis('china-bronze-sanxingdui-world-synthesis', '成都平原的三星堆也拥有熟练的青铜工匠，却没有只铸造中原常见的酒食礼器。巨大的面具、戴金面罩的头像、立人和青铜树被送进相邻的器物坑。这里没有留下能够读懂的文字解释它们，但这些器物足以让人看见：相似的金属技术，可以进入完全不同的仪式世界。', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-writing-2021'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-sxd-gold-mask-head' },
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-writing-2021', 'source-wikimedia-sxd-gold-mask-head']
    },
    {
      id: 'china-bronze-zhou-changes',
      title: '周人接过青铜，也改变青铜',
      eyebrow: '西周的继承与变化',
      timeSpan: timeSpan(-1046, -771, '约公元前1046—前771年', true),
      contentBlocks: [fact('china-bronze-zhou-changes-fact', '周人击败商王室后，仍使用商代已经成熟的铸造技术。利簋内部的短铭文记录了灭商之战，后来的西周青铜器又写下赏赐、任命和家族功绩。青铜继续服务祖先，也开始保存新的政治关系。', ['source-national-museum-li-gui', 'source-met-shang-zhou-bronze', 'source-cook-western-zhou-rites'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-li-gui' },
      sourceIds: ['source-national-museum-li-gui', 'source-met-shang-zhou-bronze', 'source-cook-western-zhou-rites', 'source-wikimedia-li-gui']
    },
    {
      id: 'erlitou-roads-cross-city',
      title: '道路穿过城市',
      eyebrow: '约四千年前的洛阳盆地',
      timeSpan: timeSpan(-1900, -1600, '约公元前1900—前1600年', true),
      contentBlocks: [fact('erlitou-roads-cross-city-fact', '约四千年前，洛阳盆地的一处聚落迅速扩展。几条宽阔道路彼此相交，把居住、生产和大型建筑所在的区域分开；人们每天沿路搬运泥土、木料与粮食，也在行走中反复确认城市的中心在哪里。', ['source-erlitou-cass-report', 'source-erlitou-radiocarbon', 'source-zhao-erlitou-settlement'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-erlitou-location',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'erlitou-site', annotationId: 'annotation-erlitou-location', sourceIds: ['source-erlitou-cass-report'] }
          ],
          caption: '深色圆点与文字标出二里头遗址。'
        }
      },
      sourceIds: ['source-erlitou-cass-report', 'source-erlitou-radiocarbon', 'source-zhao-erlitou-settlement', 'source-natural-earth']
    },
    {
      id: 'erlitou-enclosed-center',
      title: '被围合的中心',
      eyebrow: '门、墙与路径',
      timeSpan: timeSpan(-1800, -1550, '约公元前1800—前1550年', true),
      contentBlocks: [interpretation('erlitou-enclosed-center-interpretation', '道路围出的中心并非谁都能随意穿过。成组院落、夯土基址和围墙把空间层层收拢，接近大型建筑要经过更少而更明确的入口。秩序不只由人宣布，也被做进了门、墙和路径。', ['source-erlitou-cass-report', 'source-erlitou-rethinking', 'source-zhao-erlitou-settlement'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-erlitou-location',
          transition: 'hold',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'erlitou-site', annotationId: 'annotation-erlitou-location', sourceIds: ['source-erlitou-cass-report'] }
          ],
          caption: '深色圆点与文字标出二里头遗址。'
        }
      },
      sourceIds: ['source-erlitou-cass-report', 'source-erlitou-rethinking', 'source-zhao-erlitou-settlement', 'source-natural-earth']
    },
    {
      id: 'erlitou-rare-materials-workshop',
      title: '稀有材料进入作坊',
      eyebrow: '铜、陶范与绿松石',
      timeSpan: timeSpan(-1800, -1550, '约公元前1800—前1550年', true),
      contentBlocks: [synthesis('erlitou-rare-materials-workshop-synthesis', '中心附近的作坊里，工匠把铜熔进陶范，又将一片片绿松石磨薄、拼合。原料从远处来到这里，复杂技术也被集中起来；少量特别的器物因此能够进入少数人的仪式与葬礼。', ['source-erlitou-cass-report', 'source-liu-chen-archaeology-china', 'source-zhao-erlitou-settlement'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-erlitou-turquoise-bronze-plaque' },
      sourceIds: ['source-erlitou-cass-report', 'source-liu-chen-archaeology-china', 'source-zhao-erlitou-settlement', 'source-wikimedia-erlitou-plaque']
    },
    {
      id: 'erlitou-objects-enter-burials',
      title: '器物跟随主人下葬',
      eyebrow: '少数墓葬中的稀有器物',
      timeSpan: timeSpan(-1750, -1550, '约公元前1750—前1550年', true),
      contentBlocks: [synthesis('erlitou-objects-enter-burials-synthesis', '多数墓葬并不华丽，少数死者身旁却放着铜器、玉器、铃和成千片绿松石拼成的龙形器。生前的差别被带进坟墓，稀有材料、声音与形象共同标出某些人的特殊位置。', ['source-erlitou-cass-report', 'source-liu-chen-archaeology-china', 'source-erlitou-turquoise-restoration'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-erlitou-turquoise-dragon-bell' },
      sourceIds: ['source-erlitou-cass-report', 'source-liu-chen-archaeology-china', 'source-erlitou-turquoise-restoration', 'source-wikimedia-erlitou-dragon']
    },
    {
      id: 'erlitou-xia-name-absent',
      title: '夏的名字没有写在遗址里',
      eyebrow: '考古材料与后世名称',
      timeSpan: timeSpan(-1900, -1500, '约公元前1900—前1500年', true),
      contentBlocks: [interpretation('erlitou-xia-name-absent-interpretation', '后来的人循着古书记载的“夏”来到二里头。遗址的年代、规模和位置使这个联系极有吸引力，但这里尚未发现能读出国名或王名的同时代文字。我们能看见一套新秩序怎样成形，却不能让沉默的遗址替自己说出“夏”。', ['source-erlitou-rethinking', 'source-xu-xia-debate', 'source-erlitou-radiocarbon', 'source-thorp-erlitou-xia'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-erlitou-site' },
      sourceIds: ['source-erlitou-rethinking', 'source-xu-xia-debate', 'source-erlitou-radiocarbon', 'source-thorp-erlitou-xia', 'source-wikimedia-erlitou-site']
    },
    {
      id: 'shang-civilization-forms-between-cities',
      title: '商文明在城市之间成形',
      eyebrow: '公元前二千纪中叶',
      timeSpan: timeSpan(-1600, -1400, '约公元前1600—前1400年', true),
      contentBlocks: [synthesis('shang-civilization-forms-between-cities-synthesis', '公元前二千纪中叶，郑州出现巨大的城墙与成片作坊。相似的青铜器、陶器和制作方法随后抵达更远地方，南至长江边。我们看到的开端不是一个确定的“开国日”，而是商文明在城市、工匠与往来网络中逐渐获得形状。', ['source-bagley-shang-archaeology', 'source-an-zhengzhou-shang-city', 'source-steinke-erligang'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-early-shang-network',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'shang-civilization', annotationId: 'annotation-shang-zhengzhou', sourceIds: ['source-an-zhengzhou-shang-city'] },
            { kind: 'entity', entityId: 'shang-civilization', annotationId: 'annotation-shang-panlongcheng', sourceIds: ['source-steinke-erligang'] },
            { kind: 'entity', entityId: 'shang-civilization', annotationId: 'annotation-shang-anyang', sourceIds: ['source-bagley-shang-archaeology'] }
          ],
          caption: '深色圆点和文字标出郑州、盘龙城与安阳；浅棕色范围表示相似物质文化的大致传播区域，不表示商王朝的确定政治边界。'
        }
      },
      sourceIds: ['source-bagley-shang-archaeology', 'source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-natural-earth']
    },
    {
      id: 'shang-dead-remain-in-family',
      title: '死者仍在家族之中',
      eyebrow: '晚商王室的祖先',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [interpretation('shang-dead-remain-in-family-interpretation', '在晚商王室，死亡并不等于离开家族。祖先按世代和亲疏被排列，王在不同日子向他们献祭，并询问收成、天气、疾病和战争。死者仍占有位置：他们是被供奉的家人，也是可能降下帮助或灾祸的力量。', ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-liu-shang-ancestors'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-yinxu-royal-tombs' },
      sourceIds: ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-liu-shang-ancestors', 'source-henan-yinxu-royal-tombs-aerial']
    },
    {
      id: 'shang-meal-for-ancestors',
      title: '一餐送给祖先',
      eyebrow: '青铜礼器中的酒食',
      timeSpan: timeSpan(-1400, -1046, '约公元前1400—前1046年', true),
      contentBlocks: [synthesis('shang-meal-for-ancestors-synthesis', '祭祀常从一顿被郑重安排的酒食开始。鼎、簋盛放食物，觚、爵与卣处理酒；器物的形状、组合和数量让宴饮变成可重复的仪式，也让参与者看见家族次序与身份差别。青铜的重量，托住的是人与祖先之间的一次正式相遇。', ['source-bagley-shang-archaeology', 'source-keightley-ancestral-landscape', 'source-met-shang-zhou-bronze'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-bronze-gu' },
      sourceIds: ['source-bagley-shang-archaeology', 'source-keightley-ancestral-landscape', 'source-met-shang-zhou-bronze', 'source-wikimedia-shang-gu']
    },
    {
      id: 'shang-when-bone-cracks',
      title: '骨头裂开时',
      eyebrow: '一次占卜成为记录',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [fact('shang-when-bone-cracks-fact', '占卜前，牛肩胛骨或龟甲先被整治、钻凿。火炙使它裂开，王或占卜者观察裂纹，提出“会”与“不会”的问题；日期、提问、判断，有时还有结果，被刻在骨面上。一次稍纵即逝的问神之事，从此能够被保存和复看。', ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-unesco-oracle-bones'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-oracle-bones' },
      sourceIds: ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-unesco-oracle-bones', 'source-wikimedia-oracle-bones']
    },
    {
      id: 'shang-fu-hao-two-records',
      title: '妇好留下两份记录',
      eyebrow: '甲骨中的名字与未被盗掘的墓',
      timeSpan: timeSpan(-1250, -1190, '约公元前1250—前1190年', true),
      contentBlocks: [
        fact('shang-fu-hao-two-records-fact', '妇好被称为“第一位女武将”。她生活在三千多年前的晚商，是商王武丁的配偶，也是能够主持祭祀、带兵出征的重要王室女性。甲骨一次次记下她的名字：王询问她的分娩和疾病，也占卜她的祭祀与军事行动。', ['source-keightley-shang-history', 'source-smarthistory-fu-hao']),
        synthesis('shang-fu-hao-two-records-synthesis', '三千多年后，考古学家在安阳发现了她未被盗掘的墓。墓中的带名铜器、兵器和大量随葬品，与甲骨记录中的人物彼此照应。妇好不再只是古老文字里的一个名字，我们能够看见她承担过什么职责，也看见她死后怎样进入王室祭祀的祖先行列。', ['source-mizoguchi-xibeigang', 'source-smarthistory-fu-hao', 'source-keightley-shang-history'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-fu-hao-tomb' },
      sourceIds: ['source-keightley-shang-history', 'source-mizoguchi-xibeigang', 'source-smarthistory-fu-hao', 'source-wikimedia-fu-hao-tomb']
    },
    {
      id: 'shang-war-enters-sacrifice',
      title: '战争进入祭祀',
      eyebrow: '出征、俘虏与占卜',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [interpretation('shang-war-enters-sacrifice-interpretation', '甲骨中的战争不只写出出征与胜负，也记下俘虏如何被带回祭献。兵器、王权与祖先礼仪在这里相接：对外的暴力能够转化为王室向神灵和先人展示秩序的行动，占卜也被用来决定出征和祭献的时机。', ['source-keightley-shang-history', 'source-campbell-violence-kinship', 'source-smarthistory-fu-hao'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-bronze-dagger-axes' },
      sourceIds: ['source-keightley-shang-history', 'source-campbell-violence-kinship', 'source-smarthistory-fu-hao', 'source-wikimedia-shang-dagger-axes']
    },
    {
      id: 'shang-people-beyond-royal-house',
      title: '王室之外的商人',
      eyebrow: '安阳的街道、家庭与作坊',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [synthesis('shang-people-beyond-royal-house-synthesis', '离开宫殿和王陵，安阳还有道路、水沟、院落、制陶作坊和普通墓葬。工匠烧制日用陶器，家庭在城中居住、劳动、埋葬亲人；他们并不都拥有王室青铜与刻辞，却共同支撑了这座城市，也以不同程度参加祭献与亲属生活。', ['source-smithsonian-anyang-neighborhood', 'source-bagley-shang-archaeology', 'source-unesco-yinxu'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-pottery-workshop' },
      sourceIds: ['source-smithsonian-anyang-neighborhood', 'source-bagley-shang-archaeology', 'source-unesco-yinxu', 'source-wikimedia-shang-pottery']
    },
    {
      id: 'shang-last-king-story-spreads',
      title: '亡国之君的故事开始流传',
      eyebrow: '王朝结束以后的商',
      timeSpan: timeSpan(-1050, -1000, '约公元前1050—前1000年', true),
      contentBlocks: [
        synthesis('shang-last-king-story-spreads-tyrant', '约公元前11世纪中叶，周击败商军，商最后一位君王帝辛（后世称“纣王”）战死。胜利者将改朝换代解释为“天命转移”：旧王失德，因此王朝更替。这个末代昏君的形象，也在后世叙事中不断被强化。', ['source-li-feng-early-china', 'source-khayutina-cultural-memory']),
        fact('shang-last-king-story-spreads-li-gui', '周人随后铸造利簋，记录灭商之战。这件青铜器属于新的统治者，却继承了商人成熟的铸造技术，并继续用于礼仪与祖先祭祀。', ['source-national-museum-li-gui', 'source-met-shang-zhou-bronze', 'source-cook-western-zhou-rites']),
        synthesis('shang-last-king-story-spreads-memory', '商朝消亡后，青铜、文字和礼制并未消失，而是被周人重新赋予意义：铭文记录功绩与赏赐，祭祀维系新的政治秩序。商留下的遗产，一部分延续在器物与制度中，另一部分则成为后世反复讲述的亡国故事。', ['source-anyang-fall', 'source-cook-western-zhou-rites', 'source-khayutina-cultural-memory'])
      ],
      presentation: mapPresentation('map-western-zhou-two-centers', [mapLayer('western-zhou', 'annotation-western-zhou-zongzhou', ['source-western-zhou-domain']), mapLayer('western-zhou', 'annotation-western-zhou-chengzhou', ['source-western-zhou-domain'])], '周灭商后，宗周与东方成周共同支撑新王朝；青铜、文字与礼制也在这套政治网络中延续。'),
      sourceIds: ['source-li-feng-early-china', 'source-national-museum-li-gui', 'source-anyang-fall', 'source-cook-western-zhou-rites', 'source-khayutina-cultural-memory', 'source-western-zhou-domain', 'source-natural-earth']
    },
    {
      id: 'shang-oracle-fire-opens-bone',
      title: '火让骨头开口',
      eyebrow: '安阳的火与裂纹',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [fact('shang-oracle-fire-opens-bone-fact', '三千多年前，在今天河南安阳一带，商王室把牛的肩胛骨和龟的腹甲削整，在背面钻出小坑，再用火灼烧。热力逼出裂纹，商王或占卜者观察裂纹的方向和形状，判断祖先与神灵给出的征兆。', ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-unesco-oracle-bones'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-oracle-pit-marks' },
      sourceIds: ['source-keightley-shang-history', 'source-keightley-ancestral-landscape', 'source-unesco-oracle-bones', 'source-wikimedia-oracle-pit-marks']
    },
    {
      id: 'shang-oracle-divination-becomes-record',
      title: '一次占卜成为记录',
      eyebrow: '日期、命辞与结果',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [fact('shang-oracle-divination-becomes-record-fact', '裂纹出现后，刻写者在旁边留下日期、占卜者和要判断的事情。有时，商王还会加上自己的判断；事情过去后，又可能补记结果。一块骨面于是能够串起一次行动：何时举行、为了什么、当时怎样判断、后来发生了什么。', ['source-keightley-shang-history', 'source-nivison-question', 'source-schwartz-zhen'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-oracle-bones' },
      sourceIds: ['source-keightley-shang-history', 'source-nivison-question', 'source-schwartz-zhen', 'source-wikimedia-oracle-bones']
    },
    {
      id: 'shang-oracle-question-repeated',
      title: '同一件事问了不止一次',
      eyebrow: '相近日期里的反复占问',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [synthesis('shang-oracle-question-repeated-synthesis', '王室不会总在一条裂纹后停下。同一场战争、收成、分娩或祭祀，常在相近日期再次占卜；有时还会从相反方向表述同一件事。把这些刻辞放在一起，读者看见的不只是一个答案，而是一群人在不确定中反复试探和作出决定。', ['source-keightley-shang-history', 'source-schwartz-huayuanzhuang', 'source-schwartz-zhen'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-huayuanzhuang-plastron' },
      sourceIds: ['source-keightley-shang-history', 'source-schwartz-huayuanzhuang', 'source-schwartz-zhen', 'source-wikimedia-huayuanzhuang-plastron']
    },
    {
      id: 'shang-oracle-ancestors-calendar',
      title: '祖先拥有自己的日程',
      eyebrow: '六十天循环与祖先日名',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [fact('shang-oracle-ancestors-calendar-fact', '刻辞开头常先写当天的日名。商人用十个符号和十二个符号依次配对，循环记录六十天；王室祖先也常以其中十个符号之一命名。哪一天向哪位祖先献祭、何时再次占问，由此进入一套可以重复安排的时间秩序。', ['source-keightley-ancestral-landscape', 'source-boltz-sexagenary-cycle'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-oracle-eclipse' },
      sourceIds: ['source-keightley-ancestral-landscape', 'source-boltz-sexagenary-cycle', 'source-wikimedia-oracle-eclipse']
    },
    {
      id: 'shang-oracle-royal-questions-survive',
      title: '王室的问题留了下来',
      eyebrow: '被重新拼合的晚商材料',
      timeSpan: timeSpan(-1250, -1046, '约公元前1250—前1046年', true),
      contentBlocks: [synthesis('shang-oracle-royal-questions-survive-synthesis', '这些骨甲后来成批留在地下，碎裂、散失，又在三千多年后重新出土。大多数记录围绕商王，也有一批来自其他王室成员自己的占卜与书写人员。它们构成中国目前所知最早的大规模成熟文字材料，让祭祀、战争和家庭忧虑从一次行动变成可以追索的过去。', ['source-keightley-shang-history', 'source-schwartz-huayuanzhuang', 'source-unesco-oracle-bones'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-oracle-collection' },
      sourceIds: ['source-keightley-shang-history', 'source-schwartz-huayuanzhuang', 'source-unesco-oracle-bones', 'source-wikimedia-oracle-collection']
    },
    {
      id: 'shang-bronze-materials-reach-workshop',
      title: '矿料来到王室作坊',
      eyebrow: '合金、作坊与远方原料',
      timeSpan: timeSpan(-1600, -1046, '约公元前1600—前1046年', true),
      contentBlocks: [fact('shang-bronze-materials-reach-workshop-fact', '青铜不是从地下直接挖出的金属。工匠把铜与锡等材料配成合金，有时还会加入铅。在安阳等商代城市发现的铸铜遗迹里，熔炉、陶范碎片和各道工序留下的废料成片分布。不同地区汇来的原料，在这里变成仪式所需的器物。', ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting', 'source-smithsonian-anyang-kings'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-bronze-casting-apparatus' },
      sourceIds: ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting', 'source-smithsonian-anyang-kings', 'source-wikimedia-bronze-casting-apparatus']
    },
    {
      id: 'shang-bronze-clay-mould-shapes-vessel',
      title: '泥范先做出器物',
      eyebrow: '分范、合范与浇铸',
      timeSpan: timeSpan(-1600, -1046, '约公元前1600—前1046年', true),
      contentBlocks: [fact('shang-bronze-clay-mould-shapes-vessel-fact', '工匠先用泥做出器物模型，再覆上一层泥壳。外壳被切成几块，模型则被削小，成为撑住器物内部的泥芯。工匠重新合上外范，留下薄薄空隙，让熔化的青铜从浇口流入。冷却后打碎陶范，器壁与纹饰一起显现。', ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-bronze-pottery-mould' },
      sourceIds: ['source-bagley-shang-archaeology', 'source-smithsonian-bronze-casting', 'source-wikimedia-bronze-mould']
    },
    {
      id: 'shang-bronze-vessels-form-feast',
      title: '一件器物加入祖先宴席',
      eyebrow: '食物、酒与器物组合',
      timeSpan: timeSpan(-1400, -1046, '约公元前1400—前1046年', true),
      contentBlocks: [synthesis('shang-bronze-vessels-form-feast-synthesis', '一口鼎用于烹煮或盛放肉食，细长的觚用于饮酒，带提梁的卣储放祭酒。它们很少孤零零地出现，而是按照不同用途组成一套，盛起献给祖先的食物和酒。器物的组合与数量，也把宴饮中的亲属次序和身份差别摆到人们眼前。', ['source-bagley-shang-archaeology', 'source-keightley-ancestral-landscape', 'source-met-shang-zhou-bronze'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-bronze-vessel-set' },
      sourceIds: ['source-bagley-shang-archaeology', 'source-keightley-ancestral-landscape', 'source-met-shang-zhou-bronze', 'source-wikimedia-fuhao-cooking-vessels']
    },
    {
      id: 'shang-bronze-mask-and-name',
      title: '兽面与名字留在器表',
      eyebrow: '纹饰与短铭文',
      timeSpan: timeSpan(-1400, -1046, '约公元前1400—前1046年', true),
      contentBlocks: [fact('shang-bronze-mask-and-name-fact', '工匠常在泥范内壁刻出眼睛、角、鸟和龙。青铜凝固时，纹饰便与器身同时出现。最醒目的是正面展开的兽面，后人常称它为“饕餮”，商人自己的叫法和寓意已经失传。器内有时还铸着短短几个字，标明家族、作器者或接受祭献的祖先。', ['source-bagley-shang-archaeology', 'source-met-shang-zhou-bronze'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-shang-bronze-gu' },
      sourceIds: ['source-bagley-shang-archaeology', 'source-met-shang-zhou-bronze', 'source-wikimedia-shang-gu']
    },
    {
      id: 'shang-bronze-follows-owner-to-tomb',
      title: '礼器跟随主人进入墓中',
      eyebrow: '妇好墓与商周之间',
      timeSpan: timeSpan(-1250, -1000, '约公元前1250—前1000年', true),
      contentBlocks: [synthesis('shang-bronze-follows-owner-to-tomb-synthesis', '被称为“第一位女武将”的妇好，是商王的配偶，也曾主持祭祀、带兵出征。她死后，成套青铜礼器随她进入墓中，器上的名字让墓主人、生前职责和祖先礼仪彼此照应。商亡以后，周人继续使用陶范、礼器和祖先祭祀，又让铜器铭文逐渐承担更多纪事。青铜没有随王朝结束，而是带着被改变的礼仪进入新的历史记忆。', ['source-smarthistory-fu-hao', 'source-keightley-shang-history', 'source-met-shang-zhou-bronze', 'source-cook-western-zhou-rites'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-fu-hao-tomb' },
      sourceIds: ['source-smarthistory-fu-hao', 'source-keightley-shang-history', 'source-met-shang-zhou-bronze', 'source-cook-western-zhou-rites', 'source-wikimedia-fu-hao-tomb']
    },
    {
      id: 'sanxingdui-pits-beneath-city',
      title: '一场仪式最后留下的坑',
      eyebrow: '成都平原的青铜时代古城',
      timeSpan: timeSpan(-1800, -1000, '约公元前1800—前1000年', true),
      contentBlocks: [fact('sanxingdui-pits-beneath-city-fact', '四川广汉附近的三星堆，是一座被城墙围起的古城，城内有居住、生产和举行重要活动的空间。考古人员在这里发现了八座相邻的器物坑：青铜、玉器、金器和大量象牙被集中放入其中，许多器物还先被破碎、焚烧。它们不像一处日常废弃物，更像一场重要行动最后留下的现场。', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-sanxingdui-location',
          transition: 'cut',
          structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'sanxingdui-site', annotationId: 'annotation-sanxingdui-location', sourceIds: ['source-sxd-antiquity-2022'] }
          ],
          caption: '深色圆点标出三星堆遗址。'
        }
      },
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-natural-earth']
    },
    {
      id: 'sanxingdui-bronze-faces-watch',
      title: '面具让某个存在现身',
      eyebrow: '青铜与金面',
      timeSpan: timeSpan(-1200, -1000, '约公元前1200—前1000年', true),
      contentBlocks: [
        fact('sanxingdui-bronze-faces-watch-fact', '有的青铜面具眼睛突出、耳朵宽大；有的头像脸上覆盖着薄薄的金面。它们被刻意做得远比日常的人脸醒目。', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023']),
        interpretation('sanxingdui-bronze-faces-watch-interpretation', '这些面具究竟代表神、祖先，还是由人在仪式里佩戴的形象，至今没有答案。较稳妥的理解是：它们被用来让某种超出日常的存在“现身”，成为聚集人群共同观看和敬畏的焦点。', ['source-sxd-antiquity-2022', 'source-sxd-writing-2021'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-sxd-gold-mask-head' },
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-southwest-exchange-2024', 'source-wikimedia-sxd-gold-mask-head']
    },
    {
      id: 'sanxingdui-people-tree-birds',
      title: '人、树与鸟搭起向上的世界',
      eyebrow: '一件向上展开的器物',
      timeSpan: timeSpan(-1200, -1000, '约公元前1200—前1000年', true),
      contentBlocks: [
        fact('sanxingdui-people-tree-birds-fact', '一尊巨大的青铜立人双手向前伸出，仿佛曾托举某个如今失去的东西。另一件青铜树由枝、花和鸟组成，部件铸成后再拼接起来。', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023']),
        interpretation('sanxingdui-people-tree-birds-interpretation', '研究者常把树、鸟与人的组合理解为连接人间和高处世界的仪式图景：人抬头观看，鸟沿枝条上升，树把目光引向上方。但它们讲述的究竟是哪一个故事，至今没有被破译。', ['source-sxd-antiquity-2022', 'source-sxd-southwest-exchange-2024', 'source-sxd-writing-2021'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-sxd-bronze-tree' },
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-southwest-exchange-2024', 'source-sxd-museum-bronze-tree']
    },
    {
      id: 'sanxingdui-materials-meet',
      title: '贵重材料把一场仪式聚到一起',
      eyebrow: '不同材料汇到成都平原',
      timeSpan: timeSpan(-1300, -1000, '约公元前1300—前1000年', true),
      contentBlocks: [
        fact('sanxingdui-materials-meet-fact', '在这些坑中，青铜同象牙、金、玉和贝并列。部分器形、纹样和铸造手法能看出与中原、长江中下游地区的联系。', ['source-sxd-antiquity-2022', 'source-sxd-southwest-exchange-2024']),
        interpretation('sanxingdui-materials-meet-interpretation', '我们不知道是谁决定收集这些材料，也不知道仪式的完整规则。但把它们做成面具、人像和树形器，需要调动远超日常生活的资源与工艺；一种合理的理解是，这些器物共同搭起了一场面向众人的仪式，而不是单独使用的珍宝。', ['source-sxd-antiquity-2022', 'source-sxd-southwest-exchange-2024'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-sxd-ivory-tusk' },
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-southwest-exchange-2024', 'source-wikimedia-sxd-ivory-tusk']
    },
    {
      id: 'sanxingdui-ritual-world-is-buried',
      title: '埋下的不是谜底',
      eyebrow: '埋藏与新的中心',
      timeSpan: timeSpan(-1200, -950, '约公元前1200—前950年', true),
      contentBlocks: [
        fact('sanxingdui-ritual-world-is-buried-fact', '许多器物在进入坑前已经破碎，坑内还可见灰烬与层层堆放的痕迹。它们不是随手丢进坑里的。', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023']),
        interpretation('sanxingdui-ritual-world-is-buried-interpretation', '这场埋藏是仪式的结束、一次危机后的处置，还是另一种我们尚未想到的行动？目前没有定论。后来金沙遗址仍出现鸟、鱼、太阳、金器和人像等相近表达，但这也不能替我们补出三星堆人当时讲述的故事。被埋下的不是谜底，而是一份仍待解读的仪式档案。', ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-southwest-exchange-2024', 'source-sxd-writing-2021'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-jinsha-sun-bird-disc' },
      sourceIds: ['source-sxd-antiquity-2022', 'source-sxd-sacrificial-area-2023', 'source-sxd-southwest-exchange-2024', 'source-wikimedia-jinsha-sun-bird']
    }
  ];

  const navigationOptions = [
    {
      id: 'nav-western-zhou-china-bronze', target: { cardId: 'china-early-bronze-connected-worlds', sceneId: 'china-bronze-zhou-changes' }, basis: { kind: 'relatedCard', cardId: 'china-early-bronze-connected-worlds' },
      label: '进入中国的早期青铜世界', description: '从一次册命走向更长的材料史，看矿料、作坊、城市和礼仪怎样共同塑造青铜时代。'
    },
    {
      id: 'nav-china-bronze-western-zhou', target: { cardId: 'western-zhou-bronze-commands', sceneId: 'western-zhou-muye-victory' }, basis: { kind: 'relatedCard', cardId: 'western-zhou-bronze-commands' },
      label: '进入把王命铸进青铜的时代', description: '从周人接过商代铸造技术，继续看战争、赏赐和任命怎样进入铭文。'
    },
    {
      id: 'nav-western-zhou-shang-ending', target: { cardId: 'shang-ancestors-world', sceneId: 'shang-last-king-story-spreads' }, basis: { kind: 'event', eventId: 'event-zhou-conquest-of-shang' },
      label: '进入商王朝的最后时刻', description: '从周人的胜利铭文转向商的考古终点与后世不断扩写的亡国故事。'
    },
    {
      id: 'nav-shang-ending-western-zhou', target: { cardId: 'western-zhou-bronze-commands', sceneId: 'western-zhou-muye-victory' }, basis: { kind: 'event', eventId: 'event-zhou-conquest-of-shang' },
      label: '跟随胜利者进入西周', description: '从商王室的终点转向利簋、东方中心和青铜册命留下的周人世界。'
    },
    {
      id: 'nav-china-bronze-erlitou',
      target: { cardId: 'erlitou-ritual-world', sceneId: 'erlitou-roads-cross-city' },
      basis: { kind: 'relatedCard', cardId: 'erlitou-ritual-world' },
      label: '进入二里头的城市中心',
      description: '沿道路、院落和作坊，看看早期青铜时代的中心怎样被组织起来。'
    },
    {
      id: 'nav-china-bronze-shang',
      target: { cardId: 'shang-ancestors-world', sceneId: 'shang-civilization-forms-between-cities' },
      basis: { kind: 'relatedCard', cardId: 'shang-ancestors-world' },
      label: '进入商人的祖先世界',
      description: '从城市与青铜网络，走进占卜、祭祀和王室共同组成的商代生活。'
    },
    {
      id: 'nav-china-bronze-oracle',
      target: { cardId: 'shang-oracle-bones-record', sceneId: 'shang-oracle-fire-opens-bone' },
      basis: { kind: 'relatedCard', cardId: 'shang-oracle-bones-record' },
      label: '进入甲骨留下的记录',
      description: '细看火、裂纹和刻辞怎样把一次问神变成三千年后仍能读到的记录。'
    },
    {
      id: 'nav-china-bronze-vessels',
      target: { cardId: 'shang-bronzes-ancestor-feast', sceneId: 'shang-bronze-materials-reach-workshop' },
      basis: { kind: 'relatedCard', cardId: 'shang-bronzes-ancestor-feast' },
      label: '跟随青铜礼器的旅程',
      description: '从矿料和泥范出发，看器物怎样进入祖先宴席、铭文和墓葬。'
    },
    {
      id: 'nav-china-bronze-sanxingdui',
      target: { cardId: 'sanxingdui-ritual-world', sceneId: 'sanxingdui-materials-meet' },
      basis: { kind: 'relatedCard', cardId: 'sanxingdui-ritual-world' },
      label: '进入三星堆的青铜世界',
      description: '看看成都平原怎样用相似的材料，创造出与中原不同的面孔、人像与神树。'
    },
    {
      id: 'nav-erlitou-china-bronze',
      target: { cardId: 'china-early-bronze-connected-worlds', sceneId: 'china-bronze-erlitou-center' },
      basis: { kind: 'relatedCard', cardId: 'china-early-bronze-connected-worlds' },
      label: '进入中国的早期青铜世界',
      description: '把二里头放回良渚、商代城市、三星堆与西周共同组成的长时段图景中。'
    },
    {
      id: 'nav-shang-china-bronze',
      target: { cardId: 'china-early-bronze-connected-worlds', sceneId: 'china-bronze-shang-cities' },
      basis: { kind: 'relatedCard', cardId: 'china-early-bronze-connected-worlds' },
      label: '进入中国的早期青铜世界',
      description: '从商人的祖先世界，回看不同城市、材料与礼仪传统怎样彼此连接。'
    },
    {
      id: 'nav-sanxingdui-china-bronze',
      target: { cardId: 'china-early-bronze-connected-worlds', sceneId: 'china-bronze-sanxingdui-world' },
      basis: { kind: 'relatedCard', cardId: 'china-early-bronze-connected-worlds' },
      label: '进入中国的早期青铜世界',
      description: '把三星堆放回多个区域共同使用青铜、又创造不同仪式世界的时代。'
    },
    {
      id: 'nav-oracle-china-bronze',
      target: { cardId: 'china-early-bronze-connected-worlds', sceneId: 'china-bronze-ancestors-records' },
      basis: { kind: 'relatedCard', cardId: 'china-early-bronze-connected-worlds' },
      label: '进入甲骨所在的青铜时代',
      description: '王室占卜与城市、礼器、祖先祭祀和跨区域联系共同组成这个时代。'
    },
    {
      id: 'nav-vessels-china-bronze',
      target: { cardId: 'china-early-bronze-connected-worlds', sceneId: 'china-bronze-ancestors-records' },
      basis: { kind: 'relatedCard', cardId: 'china-early-bronze-connected-worlds' },
      label: '进入青铜器连接的世界',
      description: '一件礼器的旅程连接着多座城市、不同区域与王朝更替。'
    },
    {
      id: 'nav-erlitou-shang-ancestors',
      target: { cardId: 'shang-ancestors-world', sceneId: 'shang-civilization-forms-between-cities' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-erlitou-shang-transition' },
      label: '进入商人的祖先世界',
      description: '看青铜、占卜和家族仪式怎样被组织成更清晰的商代秩序。'
    },
    {
      id: 'nav-shang-erlitou-center',
      target: { cardId: 'erlitou-ritual-world', sceneId: 'erlitou-roads-cross-city' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-erlitou-shang-transition' },
      label: '进入二里头的城市中心',
      description: '在甲骨出现以前，看道路、作坊与墓葬怎样先把礼仪秩序做进城市。'
    },
    {
      id: 'nav-shang-overview-oracle-record',
      target: { cardId: 'shang-oracle-bones-record', sceneId: 'shang-oracle-fire-opens-bone' },
      basis: { kind: 'event', eventId: 'event-late-shang-royal-divination' },
      label: '进入甲骨留下的记录',
      description: '从灼骨、裂纹到刻辞，细看一次问神怎样变成可追索的记录。'
    },
    {
      id: 'nav-shang-oracle-overview',
      target: { cardId: 'shang-ancestors-world', sceneId: 'shang-fu-hao-two-records' },
      basis: { kind: 'event', eventId: 'event-late-shang-royal-divination' },
      label: '进入商人的祖先世界',
      description: '沿甲骨中的妇好，继续看文字、祭祀和王室生活怎样彼此连接。'
    },
    {
      id: 'nav-shang-overview-bronze-feast',
      target: { cardId: 'shang-bronzes-ancestor-feast', sceneId: 'shang-bronze-materials-reach-workshop' },
      basis: { kind: 'relatedCard', cardId: 'shang-bronzes-ancestor-feast' },
      label: '进入青铜礼器的旅程',
      description: '从矿料和泥范出发，看青铜怎样进入祖先宴席与墓葬。'
    },
    {
      id: 'nav-shang-bronze-overview',
      target: { cardId: 'shang-ancestors-world', sceneId: 'shang-meal-for-ancestors' },
      basis: { kind: 'relatedCard', cardId: 'shang-ancestors-world' },
      label: '进入商人的祖先世界',
      description: '从一套餐饮礼器继续理解祖先、占卜、战争与城市生活组成的商代秩序。'
    },
    {
      id: 'nav-shang-bronze-sanxingdui',
      target: { cardId: 'sanxingdui-ritual-world', sceneId: 'sanxingdui-materials-meet' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sanxingdui-shang-bronze-comparison' },
      label: '进入成都平原的青铜世界',
      description: '同样是青铜时代的材料与技艺，在三星堆为何会被组合成巨大的面孔、人像与树形器？'
    },
    {
      id: 'nav-sanxingdui-shang-bronze',
      target: { cardId: 'shang-bronzes-ancestor-feast', sceneId: 'shang-bronze-materials-reach-workshop' },
      basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-sanxingdui-shang-bronze-comparison' },
      label: '进入商代青铜礼器的旅程',
      description: '走进商代作坊和祖先宴席，比较另一套青铜器物如何被制作、组合和使用。'
    }
  ];

  const navigationPlacements = [
    { id: 'placement-western-zhou-china-bronze-inline', navigationOptionId: 'nav-western-zhou-china-bronze', owner: { kind: 'scene', sceneId: 'western-zhou-command-cast-in-ding' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-china-bronze-western-zhou-inline', navigationOptionId: 'nav-china-bronze-western-zhou', owner: { kind: 'scene', sceneId: 'china-bronze-zhou-changes' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-western-zhou-shang-inline', navigationOptionId: 'nav-western-zhou-shang-ending', owner: { kind: 'scene', sceneId: 'western-zhou-muye-victory' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-shang-western-zhou-inline', navigationOptionId: 'nav-shang-ending-western-zhou', owner: { kind: 'scene', sceneId: 'shang-last-king-story-spreads' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-china-bronze-erlitou-inline', navigationOptionId: 'nav-china-bronze-erlitou', owner: { kind: 'scene', sceneId: 'china-bronze-erlitou-center' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-china-bronze-shang-inline', navigationOptionId: 'nav-china-bronze-shang', owner: { kind: 'scene', sceneId: 'china-bronze-shang-cities' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-china-bronze-oracle-inline', navigationOptionId: 'nav-china-bronze-oracle', owner: { kind: 'scene', sceneId: 'china-bronze-ancestors-records' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-china-bronze-vessels-inline', navigationOptionId: 'nav-china-bronze-vessels', owner: { kind: 'scene', sceneId: 'china-bronze-ancestors-records' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-china-bronze-sanxingdui-inline', navigationOptionId: 'nav-china-bronze-sanxingdui', owner: { kind: 'scene', sceneId: 'china-bronze-sanxingdui-world' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-erlitou-china-bronze-final', navigationOptionId: 'nav-erlitou-china-bronze', owner: { kind: 'scene', sceneId: 'erlitou-xia-name-absent' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-shang-china-bronze-final', navigationOptionId: 'nav-shang-china-bronze', owner: { kind: 'scene', sceneId: 'shang-last-king-story-spreads' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-sanxingdui-china-bronze-final', navigationOptionId: 'nav-sanxingdui-china-bronze', owner: { kind: 'scene', sceneId: 'sanxingdui-ritual-world-is-buried' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-oracle-china-bronze-final', navigationOptionId: 'nav-oracle-china-bronze', owner: { kind: 'scene', sceneId: 'shang-oracle-royal-questions-survive' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-vessels-china-bronze-final', navigationOptionId: 'nav-vessels-china-bronze', owner: { kind: 'scene', sceneId: 'shang-bronze-follows-owner-to-tomb' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-erlitou-shang-closing', navigationOptionId: 'nav-erlitou-shang-ancestors', owner: { kind: 'card', cardId: 'erlitou-ritual-world' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-shang-erlitou-closing', navigationOptionId: 'nav-shang-erlitou-center', owner: { kind: 'card', cardId: 'shang-ancestors-world' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-shang-overview-oracle-inline', navigationOptionId: 'nav-shang-overview-oracle-record', owner: { kind: 'scene', sceneId: 'shang-when-bone-cracks' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-shang-oracle-overview-closing', navigationOptionId: 'nav-shang-oracle-overview', owner: { kind: 'card', cardId: 'shang-oracle-bones-record' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-shang-overview-bronze-inline', navigationOptionId: 'nav-shang-overview-bronze-feast', owner: { kind: 'scene', sceneId: 'shang-meal-for-ancestors' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-shang-bronze-overview-closing', navigationOptionId: 'nav-shang-bronze-overview', owner: { kind: 'card', cardId: 'shang-bronzes-ancestor-feast' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-shang-bronze-sanxingdui-inline', navigationOptionId: 'nav-shang-bronze-sanxingdui', owner: { kind: 'scene', sceneId: 'shang-bronze-materials-reach-workshop' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-sanxingdui-shang-bronze-closing', navigationOptionId: 'nav-sanxingdui-shang-bronze', owner: { kind: 'card', cardId: 'sanxingdui-ritual-world' }, slot: 'closing', rank: 1, visible: true, interactive: true }
  ];

  const cameraPresets = [
    { id: 'camera-western-zhou-two-centers', center: [110.8, 34.5], scale: 5.1 },
    { id: 'camera-western-zhou-regional-centers', center: [113, 35], scale: 3.6 },
    { id: 'camera-china-early-bronze-world', center: [110.5, 31.5], scale: 4.3 },
    { id: 'camera-erlitou-location', center: [112.69, 34.69], scale: 10 },
    { id: 'camera-early-shang-network', center: [113.5, 33.4], scale: 5.8 },
    { id: 'camera-sanxingdui-location', center: [104.2, 30.99], scale: 10 }
  ];

  const geometries = [
    {
      id: 'geometry-western-zhou-two-centers', geometry: { type: 'LineString', coordinates: [[108.9, 34.3], [112.45, 34.62]] },
      timeSpan: timeSpan(-1045, -1000, '约公元前1045—前1000年', true), approximate: true, label: '宗周与成周的政治联系教学线',
      sourceIds: ['source-western-zhou-domain', 'source-natural-earth']
    },
    {
      id: 'geometry-western-zhou-regional-centers', geometry: { type: 'MultiLineString', coordinates: [[[108.9, 34.3], [112.45, 34.62]], [[112.45, 34.62], [117.1, 36.7]], [[112.45, 34.62], [114.5, 38.0]]] },
      timeSpan: timeSpan(-1040, -850, '约公元前1040—前850年', true), approximate: true, label: '王室中心与东方、北方区域中心的教学联系',
      sourceIds: ['source-western-zhou-domain', 'source-natural-earth']
    },
    {
      id: 'geometry-western-zhou-eastward-move', geometry: { type: 'LineString', coordinates: [[108.9, 34.3], [110.7, 34.5], [112.45, 34.62]] },
      timeSpan: timeSpan(-771, -770, '公元前771年以后'), approximate: true, label: '宗周失守后，周王室由关中迁向成周的教学方向',
      sourceIds: ['source-li-feng-western-zhou-fall', 'source-natural-earth']
    },
    {
      id: 'geometry-china-early-bronze-centers',
      geometry: { type: 'MultiPoint', coordinates: [[119.98, 30.38], [112.6901, 34.6925], [104.1998, 30.9937]] },
      timeSpan: timeSpan(-3300, -950, '良渚、二里头与三星堆主要年代', true),
      approximate: true,
      label: '良渚、二里头与三星堆教学选点（年代不同）',
      sourceIds: ['source-unesco-liangzhu', 'source-erlitou-cass-report', 'source-sxd-antiquity-2022', 'source-natural-earth']
    },
    {
      id: 'geometry-erlitou-location',
      geometry: { type: 'Point', coordinates: [112.6901, 34.6925] },
      timeSpan: timeSpan(-1900, -1500, '二里头遗址主要年代', true),
      approximate: false,
      label: '二里头遗址',
      sourceIds: ['source-erlitou-cass-report', 'source-natural-earth']
    },
    {
      id: 'geometry-early-shang-centers',
      geometry: { type: 'MultiPoint', coordinates: [[113.68, 34.75], [114.30, 30.65], [114.31, 36.13]] },
      timeSpan: timeSpan(-1600, -1046, '早商至晚商重要遗址教学选点', true),
      approximate: true,
      label: '郑州、盘龙城与安阳教学选点（近似）',
      sourceIds: ['source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-unesco-yinxu', 'source-natural-earth']
    },
    {
      id: 'geometry-early-shang-material-spread',
      geometry: { type: 'Polygon', coordinates: [[[109.5, 36.8], [116.8, 36.8], [117.2, 32.5], [115.5, 29.8], [112, 29.5], [109.2, 32.2], [109.5, 36.8]]] },
      timeSpan: timeSpan(-1600, -1400, '二里岗物质文化传播教学范围', true),
      approximate: true,
      label: '二里岗物质文化传播教学范围（近似，不是政治边界）',
      sourceIds: ['source-steinke-erligang', 'source-bagley-shang-archaeology', 'source-natural-earth']
    },
    {
      id: 'geometry-sanxingdui-location',
      geometry: { type: 'Point', coordinates: [104.1998, 30.9937] },
      timeSpan: timeSpan(-1800, -1000, '三星堆遗址主要年代', true),
      approximate: false,
      label: '三星堆遗址',
      sourceIds: ['source-sxd-antiquity-2022', 'source-natural-earth']
    }
  ];

  const mapStates = [
    {
      id: 'map-western-zhou-two-centers', cameraPresetId: 'camera-western-zhou-two-centers',
      layers: [{ kind: 'geometry', geometryId: 'geometry-western-zhou-two-centers', timeSpan: timeSpan(-1045, -1000, '约公元前1045—前1000年', true), sourceIds: ['source-western-zhou-domain', 'source-natural-earth'] }]
    },
    {
      id: 'map-western-zhou-regional-centers', cameraPresetId: 'camera-western-zhou-regional-centers',
      layers: [{ kind: 'geometry', geometryId: 'geometry-western-zhou-regional-centers', timeSpan: timeSpan(-1040, -850, '约公元前1040—前850年', true), sourceIds: ['source-western-zhou-domain', 'source-natural-earth'] }]
    },
    {
      id: 'map-western-zhou-eastward-move', cameraPresetId: 'camera-western-zhou-two-centers',
      layers: [{ kind: 'geometry', geometryId: 'geometry-western-zhou-eastward-move', timeSpan: timeSpan(-771, -770, '公元前771年以后'), sourceIds: ['source-li-feng-western-zhou-fall', 'source-natural-earth'] }]
    },
    {
      id: 'map-china-early-bronze-world',
      cameraPresetId: 'camera-china-early-bronze-world',
      layers: [
        { kind: 'geometry', geometryId: 'geometry-china-early-bronze-centers', timeSpan: timeSpan(-3300, -950, '良渚、二里头与三星堆主要年代', true), sourceIds: ['source-unesco-liangzhu', 'source-erlitou-cass-report', 'source-sxd-antiquity-2022', 'source-natural-earth'] }
      ]
    },
    {
      id: 'map-erlitou-location',
      cameraPresetId: 'camera-erlitou-location',
      layers: [
        { kind: 'geometry', geometryId: 'geometry-erlitou-location', timeSpan: timeSpan(-1900, -1500, '二里头遗址主要年代', true), sourceIds: ['source-erlitou-cass-report', 'source-natural-earth'] }
      ]
    },
    {
      id: 'map-early-shang-network',
      cameraPresetId: 'camera-early-shang-network',
      layers: [
        { kind: 'geometry', geometryId: 'geometry-early-shang-material-spread', timeSpan: timeSpan(-1600, -1400, '二里岗物质文化传播教学范围', true), sourceIds: ['source-steinke-erligang', 'source-bagley-shang-archaeology', 'source-natural-earth'] },
        { kind: 'geometry', geometryId: 'geometry-early-shang-centers', timeSpan: timeSpan(-1600, -1046, '早商至晚商重要遗址教学选点', true), sourceIds: ['source-an-zhengzhou-shang-city', 'source-steinke-erligang', 'source-unesco-yinxu', 'source-natural-earth'] }
      ]
    },
    {
      id: 'map-sanxingdui-location',
      cameraPresetId: 'camera-sanxingdui-location',
      layers: [
        { kind: 'geometry', geometryId: 'geometry-sanxingdui-location', timeSpan: timeSpan(-1800, -1000, '三星堆遗址主要年代', true), sourceIds: ['source-sxd-antiquity-2022', 'source-natural-earth'] }
      ]
    }
  ];

  const mapAnnotations = [
    {
      id: 'annotation-western-zhou-zongzhou', subject: { kind: 'entity', entityId: 'western-zhou' }, anchor: { kind: 'geo', coordinates: [108.9, 34.3] }, anchorMeaning: 'associatedWith', approximate: true,
      sourceIds: ['source-western-zhou-domain'], placement: 'left', label: '宗周（关中王室中心）'
    },
    {
      id: 'annotation-western-zhou-chengzhou', subject: { kind: 'entity', entityId: 'western-zhou' }, anchor: { kind: 'geo', coordinates: [112.45, 34.62] }, anchorMeaning: 'associatedWith', approximate: true,
      sourceIds: ['source-western-zhou-domain'], placement: 'right', label: '成周（东方中心）'
    },
    {
      id: 'annotation-western-zhou-royal-core', subject: { kind: 'entity', entityId: 'western-zhou' }, anchor: { kind: 'geo', coordinates: [110.5, 34.5] }, anchorMeaning: 'associatedWith', approximate: true,
      sourceIds: ['source-western-zhou-domain'], placement: 'left', label: '王室核心'
    },
    {
      id: 'annotation-western-zhou-eastern-regions', subject: { kind: 'entity', entityId: 'western-zhou' }, anchor: { kind: 'geo', coordinates: [117.1, 36.7] }, anchorMeaning: 'associatedWith', approximate: true,
      sourceIds: ['source-western-zhou-domain'], placement: 'right', label: '东方区域中心'
    },
    {
      id: 'annotation-western-zhou-northern-regions', subject: { kind: 'entity', entityId: 'western-zhou' }, anchor: { kind: 'geo', coordinates: [114.5, 38.0] }, anchorMeaning: 'associatedWith', approximate: true,
      sourceIds: ['source-western-zhou-domain'], placement: 'right', label: '北方区域中心'
    },
    {
      id: 'annotation-western-zhou-fallen-capital', subject: { kind: 'entity', entityId: 'western-zhou' }, anchor: { kind: 'geo', coordinates: [108.9, 34.3] }, anchorMeaning: 'associatedWith', approximate: true,
      sourceIds: ['source-li-feng-western-zhou-fall'], placement: 'left', label: '宗周：公元前771年失守'
    },
    {
      id: 'annotation-western-zhou-eastern-capital', subject: { kind: 'entity', entityId: 'western-zhou' }, anchor: { kind: 'geo', coordinates: [112.45, 34.62] }, anchorMeaning: 'associatedWith', approximate: true,
      sourceIds: ['source-li-feng-western-zhou-fall'], placement: 'right', label: '成周：周王室东迁'
    },
    {
      id: 'annotation-china-bronze-liangzhu',
      subject: { kind: 'entity', entityId: 'china-early-bronze-world' },
      anchor: { kind: 'geo', coordinates: [119.98, 30.38] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-unesco-liangzhu'],
      placement: 'below',
      label: '良渚（约前3300—2300年）'
    },
    {
      id: 'annotation-china-bronze-erlitou',
      subject: { kind: 'entity', entityId: 'erlitou-site' },
      anchor: { kind: 'geo', coordinates: [112.6901, 34.6925] },
      anchorMeaning: 'locatedAt',
      approximate: false,
      sourceIds: ['source-erlitou-cass-report'],
      placement: 'above',
      label: '二里头（约前1900—前1500年）'
    },
    {
      id: 'annotation-china-bronze-sanxingdui',
      subject: { kind: 'entity', entityId: 'sanxingdui-site' },
      anchor: { kind: 'geo', coordinates: [104.1998, 30.9937] },
      anchorMeaning: 'locatedAt',
      approximate: false,
      sourceIds: ['source-sxd-antiquity-2022'],
      placement: 'left',
      label: '三星堆（约前1800—前950年）'
    },
    {
      id: 'annotation-erlitou-location',
      subject: { kind: 'entity', entityId: 'erlitou-site' },
      anchor: { kind: 'geo', coordinates: [112.6901, 34.6925] },
      anchorMeaning: 'locatedAt',
      approximate: false,
      sourceIds: ['source-erlitou-cass-report'],
      placement: 'above',
      label: '二里头遗址'
    },
    {
      id: 'annotation-shang-zhengzhou',
      subject: { kind: 'entity', entityId: 'shang-civilization' },
      anchor: { kind: 'geo', coordinates: [113.68, 34.75] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-an-zhengzhou-shang-city'],
      placement: 'left',
      label: '郑州商城'
    },
    {
      id: 'annotation-shang-panlongcheng',
      subject: { kind: 'entity', entityId: 'shang-civilization' },
      anchor: { kind: 'geo', coordinates: [114.30, 30.65] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-steinke-erligang'],
      placement: 'below',
      label: '盘龙城'
    },
    {
      id: 'annotation-shang-anyang',
      subject: { kind: 'entity', entityId: 'shang-civilization' },
      anchor: { kind: 'geo', coordinates: [114.31, 36.13] },
      anchorMeaning: 'associatedWith',
      approximate: true,
      sourceIds: ['source-unesco-yinxu'],
      placement: 'right',
      label: '晚期中心安阳'
    },
    {
      id: 'annotation-sanxingdui-location',
      subject: { kind: 'entity', entityId: 'sanxingdui-site' },
      anchor: { kind: 'geo', coordinates: [104.1998, 30.9937] },
      anchorMeaning: 'locatedAt',
      approximate: false,
      sourceIds: ['source-sxd-antiquity-2022'],
      placement: 'above',
      label: '三星堆遗址'
    }
  ];

  const assets = [
    { id: 'asset-western-zhou-investiture-teaching', type: 'image', src: 'assets/images/ancient-china/western-zhou-investiture-teaching.png', title: '西周册命仪式教学插图', alt: '教学插图表现宗庙内宣读册命、贵族接受礼服与赏赐的场景，前景放置青铜鼎；画面不承担具体铭文字形证据。', sourceIds: ['source-generated-western-zhou-investiture', 'source-national-museum-da-yu-ding', 'source-national-museum-ceming'] },
    { id: 'asset-erlitou-turquoise-bronze-plaque', type: 'image', src: 'assets/images/ancient-china/erlitou-turquoise-bronze-plaque.jpg', title: '嵌绿松石青铜兽面牌饰', alt: '二里头出土的嵌绿松石青铜兽面牌饰完整正面，铜胎上密集排列数百枚蓝绿色小片。', sourceIds: ['source-wikimedia-erlitou-plaque', 'source-erlitou-cass-report'] },
    { id: 'asset-erlitou-turquoise-dragon-bell', type: 'image', src: 'assets/images/ancient-china/erlitou-turquoise-dragon-bell.jpg', title: '绿松石龙形器及铜铃', alt: '展柜中完整陈列的二里头绿松石龙形器与铜铃，细小绿松石片组成弯曲的长形器物。', sourceIds: ['source-wikimedia-erlitou-dragon', 'source-erlitou-turquoise-restoration'] },
    { id: 'asset-erlitou-site', type: 'image', src: 'assets/images/ancient-china/erlitou-site.jpg', title: '二里头遗址', alt: '二里头遗址的完整现场照片，平坦田野间保留考古遗址标识与远处村落。', sourceIds: ['source-wikimedia-erlitou-site', 'source-erlitou-cass-report'] },
    { id: 'asset-yinxu-royal-tombs', type: 'image', src: 'assets/images/ancient-china/yinxu-royal-tombs.jpg', title: '殷墟王陵区航拍', alt: '从空中俯瞰殷墟王陵区，修整后的绿篱清楚勾勒出大型墓葬的方形墓室和向外延伸的长墓道。', sourceIds: ['source-henan-yinxu-royal-tombs-aerial', 'source-unesco-yinxu'] },
    { id: 'asset-shang-bronze-gu', type: 'image', src: 'assets/images/ancient-china/shang-bronze-gu.jpg', title: '商代青铜觚', alt: '一件完整的商代青铜觚，喇叭形口沿、细长器身和表面纹饰清晰可见。', sourceIds: ['source-wikimedia-shang-gu', 'source-met-shang-zhou-bronze'] },
    { id: 'asset-shang-oracle-bones', type: 'image', src: 'assets/images/ancient-china/shang-oracle-bones.jpg', title: '商代牛肩胛骨卜辞', alt: '一块完整陈列的晚商牛肩胛骨卜辞，骨面可见裂纹和密集刻写的文字。', sourceIds: ['source-wikimedia-oracle-bones', 'source-unesco-oracle-bones'] },
    { id: 'asset-fu-hao-tomb', type: 'image', src: 'assets/images/ancient-china/fu-hao-tomb.jpg', title: '妇好墓', alt: '从上方向下俯瞰妇好墓的墓坑复原陈列，墓壁、青铜礼器和其他随葬品的位置清晰可见。', sourceIds: ['source-wikimedia-fu-hao-tomb', 'source-smarthistory-fu-hao'] },
    { id: 'asset-shang-bronze-dagger-axes', type: 'image', src: 'assets/images/ancient-china/shang-bronze-dagger-axes.jpg', title: '殷墟出土青铜戈', alt: '多件殷墟出土的商代青铜戈并排完整陈列，长条形援部与内部纹饰清晰可见。', sourceIds: ['source-wikimedia-shang-dagger-axes', 'source-campbell-violence-kinship'] },
    { id: 'asset-shang-pottery-workshop', type: 'image', src: 'assets/images/ancient-china/shang-pottery-workshop.jpg', title: '殷墟制陶作坊陈列', alt: '殷墟博物馆中制陶作坊相关陶器与生产遗物的完整陈列照片。', sourceIds: ['source-wikimedia-shang-pottery', 'source-smithsonian-anyang-neighborhood'] },
    { id: 'asset-li-gui', type: 'image', src: 'assets/images/ancient-china/li-gui.jpg', title: '利簋', alt: '早期西周利簋的完整正面照片，圆腹双耳的青铜器置于方形底座之上。', sourceIds: ['source-wikimedia-li-gui', 'source-national-museum-li-gui'] },
    { id: 'asset-guoji-zibai-pan', type: 'image', src: 'assets/images/ancient-china/guoji-zibai-pan.jpg', title: '虢季子白盘', alt: '虢季子白盘的完整正面照片，长方形青铜盘以四足承托，器壁环绕窃曲纹并设有兽首衔环。', sourceIds: ['source-national-museum-guoji-zibai-pan'] },
    { id: 'asset-shang-oracle-pit-marks', type: 'image', src: 'assets/images/ancient-china/shang-oracle-pit-marks.jpg', title: '背面带钻凿坑的商代卜骨', alt: '一块商代牛肩胛骨卜骨的完整背面，沿骨面排列的圆形钻凿坑清晰可见。', sourceIds: ['source-wikimedia-oracle-pit-marks', 'source-keightley-shang-history'] },
    { id: 'asset-shang-huayuanzhuang-plastron', type: 'image', src: 'assets/images/ancient-china/shang-huayuanzhuang-plastron.jpg', title: '花园庄东地龟腹甲卜辞', alt: '一块晚商龟腹甲的完整正面，骨面分布多组刻辞，可见同一甲面上的多次占问。', sourceIds: ['source-wikimedia-huayuanzhuang-plastron', 'source-schwartz-huayuanzhuang'] },
    { id: 'asset-shang-oracle-eclipse', type: 'image', src: 'assets/images/ancient-china/shang-oracle-eclipse.jpg', title: '记录占问的晚商牛骨刻辞', alt: '一块竖直陈列的晚商牛骨刻辞，骨面上的成行文字与缺损边缘完整可见。', sourceIds: ['source-wikimedia-oracle-eclipse', 'source-keightley-shang-history'] },
    { id: 'asset-shang-oracle-collection', type: 'image', src: 'assets/images/ancient-china/shang-oracle-collection.jpg', title: '成组陈列的商代卜骨', alt: '多块大小不同的商代牛骨卜辞在展柜中成组陈列，显示甲骨材料的碎裂与多样形态。', sourceIds: ['source-wikimedia-oracle-collection', 'source-unesco-oracle-bones'] },
    { id: 'asset-shang-bronze-casting-apparatus', type: 'image', src: 'assets/images/ancient-china/shang-bronze-casting-apparatus.jpg', title: '殷墟铸铜工具与陶范陈列', alt: '殷墟博物馆中铸铜装置、陶范和相关工具的完整展柜照片，多个工序遗物并置可见。', sourceIds: ['source-wikimedia-bronze-casting-apparatus', 'source-smithsonian-bronze-casting'] },
    { id: 'asset-shang-bronze-pottery-mould', type: 'image', src: 'assets/images/ancient-china/shang-bronze-pottery-mould.jpg', title: '商代青铜器陶范', alt: '一块商代铸造青铜器使用的陶范完整陈列，内壁凹下的纹饰和器形轮廓清晰可见。', sourceIds: ['source-wikimedia-bronze-mould', 'source-smithsonian-bronze-casting'] },
    { id: 'asset-shang-bronze-vessel-set', type: 'image', src: 'assets/images/ancient-china/shang-bronze-vessel-set.jpg', title: '妇好墓出土青铜炊食器组合', alt: '多件妇好墓出土的商代青铜炊食器成组陈列，鼎、甗等不同器形并置可见。', sourceIds: ['source-wikimedia-fuhao-cooking-vessels', 'source-smarthistory-fu-hao'] },
    { id: 'asset-sxd-gold-mask-head', type: 'image', src: 'assets/images/ancient-china/sanxingdui-gold-mask-head.jpg', title: '金面青铜人头像', alt: '三星堆遗址二号坑出土的一件青铜人头像，面部覆盖金箔面罩，眼睛、鼻梁和耳朵的轮廓清晰可见。', sourceIds: ['source-wikimedia-sxd-gold-mask-head', 'source-sxd-antiquity-2022'] },
    { id: 'asset-sxd-bronze-tree', type: 'image', src: 'assets/images/ancient-china/sanxingdui-bronze-tree.png', title: '青铜神树', alt: '三星堆博物馆发布的青铜神树正面图，细长树干向上伸展，枝头可见花与鸟形构件。', sourceIds: ['source-sxd-museum-bronze-tree', 'source-sxd-antiquity-2022'] },
    { id: 'asset-sxd-ivory-tusk', type: 'image', src: 'assets/images/ancient-china/sanxingdui-ivory-tusk.jpg', title: '三星堆出土象牙', alt: '展柜中横向陈列的一枚三星堆象牙，弧形牙体与保存后的表面纹理清晰可见。', sourceIds: ['source-wikimedia-sxd-ivory-tusk', 'source-sxd-antiquity-2022'] },
    { id: 'asset-jinsha-sun-bird-disc', type: 'image', src: 'assets/images/ancient-china/jinsha-gold-sun-bird-disc.jpg', title: '金沙遗址太阳神鸟金饰', alt: '一枚圆形金饰，中央是太阳形纹样，周围环绕四只飞行的鸟。', sourceIds: ['source-wikimedia-jinsha-sun-bird', 'source-sxd-southwest-exchange-2024'] }
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
