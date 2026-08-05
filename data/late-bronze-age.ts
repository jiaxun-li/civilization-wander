import type { ContentModule, ContentRecord, TimeSpan } from '../src/types/runtime.ts';

type SourceIds = readonly string[];

  function timeSpan(start: number, end: number, label: string, approximate = false): TimeSpan {
    const value: { start: number; end: number; label: string; approximate?: true } = { start, end, label };
    if (approximate) value.approximate = true;
    return value;
  }

  function fact(id: string, text: string, sourceIds: SourceIds): ContentRecord {
    return { id, kind: 'historicalFact', text, sourceIds };
  }

  function interpretation(id: string, text: string, sourceIds: SourceIds): ContentRecord {
    return { id, kind: 'interpretation', text, sourceIds };
  }

  function synthesis(id: string, text: string, sourceIds: SourceIds): ContentRecord {
    return { id, kind: 'editorialSynthesis', text, sourceIds };
  }

  function limitation(id: string, text: string, sourceIds: SourceIds): ContentRecord {
    return { id, kind: 'limitation', text, sourceIds };
  }

  function historicalCase(id: string, title: string, text: string, eventIds: SourceIds, sourceIds: SourceIds): ContentRecord {
    return { id, kind: 'historicalCase', title, text, eventIds, sourceIds };
  }

  function review(
    limitations: readonly ContentRecord[],
    counterexamples: readonly ContentRecord[],
    uncertainties: readonly ContentRecord[],
    alternatives: readonly ContentRecord[],
    sourceIds: SourceIds
  ): ContentRecord {
    return {
      limitations: limitations || [],
      counterexamples: counterexamples || [],
      uncertainties: uncertainties || [],
      alternativeExplanations: alternatives || [],
      sourceIds
    };
  }

  const sources = [
    { id: 'source-bryce-hittite-kingdom', title: 'The Kingdom of the Hittites, 2nd edition', author: 'Trevor Bryce', year: 2005, publisher: 'Oxford University Press', url: 'https://academic.oup.com/book/36172' },
    { id: 'source-bryce-neo-hittite-kingdoms', title: 'The World of the Neo-Hittite Kingdoms', author: 'Trevor Bryce', year: 2012, publisher: 'Oxford University Press', url: 'https://academic.oup.com/book/9649' },
    { id: 'source-beckman-hittite-diplomatic-texts', title: 'Hittite Diplomatic Texts, 2nd edition', author: 'Gary Beckman', year: 1999, publisher: 'Society of Biblical Literature', url: 'https://cart.sbl-site.org/books/061507E' },
    { id: 'source-unesco-hattusha', title: 'Hattusha: the Hittite Capital', publisher: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/377' },
    { id: 'source-met-hittites', title: 'The Hittites', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/the-hittites' },
    { id: 'source-yon-city-of-ugarit', title: 'The City of Ugarit at Tell Ras Shamra', author: 'Marguerite Yon', year: 2006, publisher: 'Eisenbrauns', url: 'https://commons.library.stonybrook.edu/amar/163/' },
    { id: 'source-met-ugarit', title: 'Ugarit', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/ugarit' },
    { id: 'source-heltzer-ugarit-metal-trade', title: 'The Metal Trade of Ugarit and the Problem of Transportation of Commercial Goods', author: 'Michael Heltzer', year: 1977, publisher: 'Iraq', url: 'https://www.cambridge.org/core/journals/iraq/article/abs/metal-trade-of-ugarit-and-the-problem-of-transportation-of-commercial-goods/288D631EBD77E72D691B387AAD0453D3' },
    { id: 'source-boyes-writing-ugarit', title: 'Writing and Social Diversity in Late Bronze Age Ugarit', author: 'Philip Boyes', publisher: 'Papers from the Institute of Archaeology', url: 'https://student-journals.ucl.ac.uk/pia/article/id/1379/' },
    { id: 'source-french-ugarit-exchange', title: 'Un centre d’échange majeur', publisher: 'Ministère de la Culture, Mission archéologique d’Ougarit', url: 'https://archeologie.culture.gouv.fr/ougarit/fr/un-centre-dechange-majeur' },
    { id: 'source-french-ugarit-texts', title: 'Corpus et langues : la documentation textuelle d’Ougarit', publisher: 'Ministère de la Culture, Mission archéologique d’Ougarit', url: 'https://archeologie.culture.gouv.fr/ougarit/fr/corpus-et-langue-la-documentation-textuelle-dougarit' },
    { id: 'source-french-ugarit-history', title: 'Une histoire pluri-millénaire', publisher: 'Ministère de la Culture, Mission archéologique d’Ougarit', url: 'https://archeologie.culture.gouv.fr/ougarit/fr/une-histoire-pluri-millenaire' },
    { id: 'source-leriche-ugarit-after-1180', title: 'Réflexions sur Ougarit après ca 1180 av. J.-C.', author: 'Pierre Leriche', year: 2008, publisher: 'Persée', url: 'https://www.persee.fr/doc/mom_1955-4982_2008_act_47_1_2523' },
    { id: 'source-spalinger-war-egypt', title: 'War in Ancient Egypt: The New Kingdom', author: 'Anthony Spalinger', year: 2005, publisher: 'Wiley-Blackwell', url: 'https://www.wiley-vch.de/en/areas-interest/humanities-social-sciences/classical-studies-12cl/ancient-classical-history-12cl4/ancient-egyptian-history-12cl41/war-in-ancient-egypt-978-1-4051-1372-4' },
    { id: 'source-langdon-gardiner-egypt-hatti-treaty', title: 'The Treaty of Alliance between Hattusili, King of the Hittites, and the Pharaoh Ramesses II of Egypt', author: 'Stephen Langdon and Alan Gardiner', year: 1920, publisher: 'The Journal of Egyptian Archaeology', url: 'https://doi.org/10.1177/030751332000600119' },

    { id: 'source-wikimedia-hattusa-wall', title: 'Reconstructed Hittite city wall at Hattusa, CC BY-SA 3.0', author: 'Bernard Gagnon', year: 2014, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Hattusa_-_Hittite_city_wall_01.jpg' },
    { id: 'source-wikimedia-inandik-vase', title: 'İnandık Vase with relief scenes of a sacred festival, CC BY-SA 2.0', author: 'Carole Raddato', year: 2016, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:The_%C4%B0nand%C4%B1k_vase%2C_a_Hittite_four-handled_large_terracota_vase_with_scenes_in_relief_depicting_a_sacred_wedding_ceremony%2C_mid_17th_century%2C_found_in_%C4%B0nand%C4%B1ktepe%2C_Museum_of_Anatolian_Civilizations%2C_Ankara_%2826167755270%29.jpg' },
    { id: 'source-wikimedia-aleppo-treaty', title: 'Hittite treaty tablet with the king of Aleppo, CC BY-SA 4.0', author: 'Zunkir', year: 2019, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Aleppo_treaty_-_Hittites.jpg' },
    { id: 'source-wikimedia-hattusa-ruins', title: 'Büyükkaya ruins at Hattusa, freely licensed photograph', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Hattusa_B%C3%BCy%C3%BCkkaya.JPG' },
    { id: 'source-wikimedia-ugarit-palace', title: 'Royal Palace ruins at Ugarit, CC BY-SA 4.0', author: 'Dosseman', year: 2008, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Ugarit_Royal_Tombs_3928.jpg' },
    { id: 'source-wikimedia-ugarit-law-tablet', title: 'Akkadian legal text of King Niqmepa from Ugarit, CC BY-SA 2.0', author: 'ALFGRN', year: 2019, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Text_of_Law_in_Akkadian_by_King_Niqmepa_with_dynastic_seal_Ras_Shamra_Louvre_Museum.jpg' },
    { id: 'source-wikimedia-uluburun-reconstruction', title: 'Uluburun shipwreck and cargo reconstruction at the Bodrum Museum, CC BY-SA 4.0', author: 'Dosseman', year: 2015, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Bodrum_Museum_Uluburun_shipwreck_reconstruction_in_2015_3704_Panorama.jpg' },
    { id: 'source-wikimedia-ugarit-admin-tablet', title: 'Administrative tablet in Ugaritic from Ugarit, freely licensed photograph', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Tablette_administrative_Ugarit_AO19967.jpg' },
    { id: 'source-wikimedia-pylos-linear-b-tablet', title: 'Linear B tablet PY Ub 1318 from the Palace of Pylos, CC BY 2.0', author: 'Sharon Mollerus', year: 2009, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:NAMA_Linear_B_tablet_of_Pylos.jpg' },
    { id: 'source-wikimedia-ugarit-throne-hall', title: 'Throne hall in the Royal Palace of Ugarit, CC BY-SA 4.0', author: 'Dosseman', year: 2008, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Ugarit_Royal_Palace_throne_hall_3909.jpg' },
    { id: 'source-wikimedia-kadesh-spies', title: 'Relief of captured scouts in the Kadesh narrative, public domain', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Ancient_carving_-_Shasu_spies_being_beaten_by_Egyptians.png' },
    { id: 'source-wikimedia-kadesh-attack-map', title: 'English adaptation of the Kadesh surprise-attack teaching map, CC BY-SA 3.0', author: 'Zunkir; English adaptation by Civilization Wander', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Qadesh_-_attaque_hittite.svg' },
    { id: 'source-wikimedia-kadesh-relief', title: 'Ramesses II relief at Abu Simbel depicting Kadesh, public domain', author: 'Mustang Joe', year: 2023, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Ramesses_II_relief_in_the_tomb_at_Abu_Simbel.jpg' },
    { id: 'source-wikimedia-kadesh-treaty', title: 'Egyptian-Hittite treaty tablet in Istanbul, attribution license', author: 'Giovanni Dall’Orto', year: 2006, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Istanbul_-_Museo_archeol._-_Trattato_di_Qadesh_fra_ittiti_ed_egizi_(1269_a.C.)_-_Foto_G._Dall%27Orto_28-5-2006.jpg' },

    { id: 'source-moran-amarna-letters', title: 'The Amarna Letters', author: 'William L. Moran', year: 1992, publisher: 'Johns Hopkins University Press', url: 'https://www.press.jhu.edu/books/title/2462/amarna-letters' },
    { id: 'source-runeberg-egypt-mail-carrier', title: 'Ancient Egyptian mail carrier, anonymous 1915 book illustration after a Theban painting, public domain', year: 1915, publisher: 'Nordisk familjebok / Project Runeberg', url: 'https://runeberg.org/nfcb/0040.html' },
    { id: 'source-met-four-foreign-rulers', title: 'Four Foreign Rulers, Tomb of Puyemre, twentieth-century facsimile of a New Kingdom painting, public domain', author: 'Norman de Garis Davies', year: 1915, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/544596' },
    { id: 'source-wikimedia-tushratta-marriage-letter', title: 'Amarna letter from Tushratta to Amenhotep III concerning diplomatic marriage and gold, CC BY-SA 4.0', author: 'Osama Shukir Muhammed Amin', year: 2016, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Amarna_letter._Letter_from_Tushratta_king_of_Mitanni_to_Amenhotep_III._From_Tell_el-Amarna,_Egypt._1st_half_of_the_14th_century_BCE._British_Museum.jpg' },
    { id: 'source-isac-medinet-habu-i', title: 'Medinet Habu I: Earlier Historical Records of Ramses III', author: 'The Epigraphic Survey', year: 1930, publisher: 'University of Chicago Press', url: 'https://isac.uchicago.edu/research/projects/epigraphic-survey-bibliography' },
    { id: 'source-edgerton-wilson-ramesses-iii', title: 'Historical Records of Ramses III: The Texts in Medinet Habu Volumes I and II', author: 'William F. Edgerton and John A. Wilson', year: 1936, publisher: 'University of Chicago Press', url: 'https://isac.uchicago.edu/research/publications/saoc/saoc-12-historical-records-ramses-iii-texts-medinet-habu-volumes-1-and-2' },
    { id: 'source-cifola-ramesses-sea-peoples', title: 'Ramses III and the Sea Peoples: A Structural Analysis of the Medinet Habu Inscriptions', author: 'Barbara Cifola', year: 1988, publisher: 'Orientalia 57.3', url: 'https://ixtheo.de/Record/179821718X' },
    { id: 'source-yasur-landau-philistines', title: 'The Philistines and Aegean Migration at the End of the Late Bronze Age', author: 'Assaf Yasur-Landau', year: 2010, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/the-philistines-and-aegean-migration-at-the-end-of-the-late-bronze-age/47F89801F12D8073A797FFE775CE5856' },
    { id: 'source-knapp-manning-crisis', title: 'Crisis in Context: The End of the Late Bronze Age in the Eastern Mediterranean', author: 'A. Bernard Knapp and Sturt W. Manning', year: 2016, publisher: 'American Journal of Archaeology 120.1', url: 'https://www.journals.uchicago.edu/doi/10.3764/aja.120.1.0099' },
    { id: 'source-deger-jalkotzy-aftermath', title: 'Decline, Destruction, Aftermath', author: 'Sigrid Deger-Jalkotzy', year: 2008, publisher: 'The Cambridge Companion to the Aegean Bronze Age', url: 'https://www.cambridge.org/core/books/abs/cambridge-companion-to-the-aegean-bronze-age/decline-destruction-aftermath/6F5022A91B80E31A3B6CB086909FE1BD' },
    { id: 'source-middleton-understanding-collapse', title: 'Understanding Collapse: Ancient History and Modern Myths', author: 'Guy D. Middleton', year: 2017, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/abs/understanding-collapse/understanding-collapse/1895D096EF873882EEF97F93F38A922C' },
    { id: 'source-wikimedia-medinet-habu-temple', title: 'Medinet Habu temple exterior, freely licensed photograph', author: 'Walaa', year: 2024, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Medinet_Habu,_Egypt003.jpg' },
    { id: 'source-wikimedia-medinet-habu-naval', title: 'Nineteenth-century photograph of the Medinet Habu naval battle relief, CC0', publisher: 'Museo Egizio Photo Archive', url: 'https://commons.wikimedia.org/wiki/File:Theban_region,_Medinet_Habu,_19th_century_pictures,_1870-1896,_photo_44_of_51_-_Archivio_fotografico_Museo_Egizio,_Turin_INV10_001_cropped.JPG' },
    { id: 'source-wikimedia-medinet-habu-land-battle', title: 'Medinet Habu plate 50: oxcart and warriors of the Sea Peoples, public domain', author: 'The Epigraphic Survey', year: 1930, publisher: 'University of Chicago Press', url: 'https://isac.uchicago.edu/research/projects/epigraphic-survey-bibliography' }
  ];

  const entities = [
    {
      id: 'hittite-empire',
      type: 'polity',
      name: '赫梯帝国',
      alternativeNames: ['Hittite Empire', '赫梯王国'],
      canonicalSummary: '约公元前1650—前1180年，以哈图沙为中心形成并多次重整，通过战争、王族据点、地方条约与大国外交连接安纳托利亚和叙利亚的政治实体。',
      timeSpan: timeSpan(-1650, -1180, '约公元前1650—前1180年', true),

      tags: ['西亚', '晚青铜时代', '政治实体'],
      sourceIds: ['source-bryce-hittite-kingdom', 'source-beckman-hittite-diplomatic-texts', 'source-unesco-hattusha', 'source-met-hittites']
    },
    {
      id: 'ugarit-kingdom',
      type: 'polity',
      name: '乌加里特王国',
      alternativeNames: ['Kingdom of Ugarit', 'Ugarit'],
      canonicalSummary: '约公元前1800—前1180年，以叙利亚海岸城市乌加里特及其港口为中心，通过农业、宫殿管理、外交和跨区域贸易维持的王国。',
      timeSpan: timeSpan(-1800, -1180, '约公元前1800—前1180年', true),

      tags: ['西亚', '晚青铜时代', '政治实体'],
      sourceIds: ['source-yon-city-of-ugarit', 'source-met-ugarit']
    },
    {
      id: 'battle-of-kadesh-war',
      type: 'war',
      name: '卡迭石战役',
      alternativeNames: ['Battle of Kadesh'],
      canonicalSummary: '约公元前1274年，埃及新王国与赫梯帝国在叙利亚卡迭石附近进行的大规模战争事件，详细战况主要由埃及王室文本和图像保存。',
      timeSpan: timeSpan(-1274, -1274, '约公元前1274年', true),

      tags: ['西亚', '晚青铜时代', '战争'],
      sourceIds: ['source-bm-kadesh-sallier', 'source-spalinger-war-egypt', 'source-bryce-hittite-kingdom']
    },
    {
      id: 'amarna-letters-corpus',
      type: 'TextDocument',
      name: '阿玛尔纳书信',
      alternativeNames: ['Amarna Letters'],
      canonicalSummary: '约公元前1360—前1330年，埃及宫廷保存的一批楔形文字外交泥版，记录大国国王、地方统治者与法老之间的问候、礼物、婚姻和求援。',
      timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true),

      tags: ['西亚', '古埃及', '外交', '楔形文字'],
      sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters']
    },
    {
      id: 'medinet-habu-war-records',
      type: 'CulturalObject',
      name: '麦迪奈特哈布战争浮雕与铭文',
      alternativeNames: ['Medinet Habu war reliefs and inscriptions'],
      canonicalSummary: '约公元前1180—前1150年，拉美西斯三世祭庙中记录北方来敌、陆战和尼罗河口海战的王室浮雕与铭文。',
      timeSpan: timeSpan(-1180, -1150, '约公元前1180—前1150年', true),

      tags: ['古埃及', '战争图像', '晚青铜时代'],
      sourceIds: ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-grandet-ramesses-iii']
    },
    {
      id: 'late-bronze-palace-system',
      type: 'institution',
      name: '晚青铜时代宫殿体系',
      alternativeNames: ['Late Bronze Age palace systems'],
      canonicalSummary: '约公元前1600—前1100年，东地中海多地以宫殿集中书写、储藏、生产、贡赋与外交资源的政治和行政组织方式。',
      timeSpan: timeSpan(-1600, -1100, '约公元前1600—前1100年', true),

      tags: ['东地中海', '制度', '晚青铜时代'],
      sourceIds: ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-middleton-understanding-collapse']
    }
  ];

  const events = [
    {
      id: 'event-hittite-central-kingship-consolidates', kind: 'historicalProcess', title: '赫梯中央王权在哈图沙重组', timeSpan: timeSpan(-1650, -1350, '约公元前1650—前1350年', true), participantEntityIds: ['hittite-empire'],
      evidenceBlocks: [fact('event-hittite-central-kingship-evidence', '赫梯统治者以哈图沙为中心经历王位危机、远征和继承安排，逐步形成能够再次进入叙利亚的中央王权。', ['source-bryce-hittite-kingdom', 'source-unesco-hattusha'])],
      sourceIds: ['source-bryce-hittite-kingdom', 'source-unesco-hattusha'], editorialReview: review([limitation('event-hittite-central-kingship-gaps', '王表和宫廷文书留下的材料不连续，不能把长期重组写成无间断的中央控制。', ['source-bryce-hittite-kingdom'])], [], [], [], ['source-bryce-hittite-kingdom', 'source-unesco-hattusha'])
    },
    {
      id: 'event-ugarit-palace-port-network-operates', kind: 'historicalProcess', title: '乌加里特宫廷与港口网络运转', timeSpan: timeSpan(-1800, -1200, '约公元前1800—前1200年', true), participantEntityIds: ['ugarit-kingdom'],
      evidenceBlocks: [fact('event-ugarit-palace-port-network-evidence', '乌加里特王城、港口、商人和多语书吏把内陆宫廷接入东地中海交换与外交网络。', ['source-yon-city-of-ugarit', 'source-met-ugarit', 'source-french-ugarit-texts'])],
      sourceIds: ['source-yon-city-of-ugarit', 'source-met-ugarit', 'source-french-ugarit-texts'], editorialReview: review([limitation('event-ugarit-palace-port-network-archive', '宫殿与商人档案保存不均，不能把王室记录当作全部港口居民的经验。', ['source-yon-city-of-ugarit'])], [], [], [], ['source-yon-city-of-ugarit', 'source-met-ugarit'])
    },
    {
      id: 'event-amarna-diplomatic-correspondence-operates', kind: 'historicalProcess', title: '阿玛尔纳外交书信网络运转', timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), participantEntityIds: ['amarna-letters-corpus'],
      evidenceBlocks: [fact('event-amarna-diplomatic-correspondence-evidence', '大国国王与黎凡特小国统治者使用阿卡德语楔形文字交换礼物、婚姻协商、地位称谓与军事请求。', ['source-met-amarna-letters', 'source-moran-amarna-letters'])],
      sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters'], editorialReview: review([limitation('event-amarna-diplomatic-correspondence-survival', '现存书信是偶然保存的宫廷档案，不能代表所有外交往来或每次礼物是否兑现。', ['source-moran-amarna-letters'])], [], [], [], ['source-met-amarna-letters', 'source-moran-amarna-letters'])
    },
    {
      id: 'event-hittite-sack-babylon', kind: 'historicalEvent',
      title: '赫梯军队突袭巴比伦',
      timeSpan: timeSpan(-1595, -1595, '约公元前1595年', true),
      participantEntityIds: ['hittite-empire', 'old-babylonian-kingdom'],
      evidenceBlocks: [fact('event-hittite-sack-babylon-evidence', '早期赫梯军队远征并突袭巴比伦，古巴比伦第一王朝随后结束；赫梯没有在巴比伦建立长期统治。', ['source-bryce-hittite-kingdom', 'source-met-isin-larsa-old-babylonian'])],
      sourceIds: ['source-bryce-hittite-kingdom', 'source-met-isin-larsa-old-babylonian'],
      editorialReview: review([], [], [interpretation('event-hittite-sack-babylon-chronology', '突袭的绝对年代随古代近东年代体系而略有差异。', ['source-bryce-hittite-kingdom'])], [], ['source-bryce-hittite-kingdom', 'source-met-isin-larsa-old-babylonian'])
    },
    {
      id: 'event-hittite-syrian-expansion', kind: 'historicalProcess',
      title: '赫梯王权进入叙利亚',
      timeSpan: timeSpan(-1350, -1320, '约公元前1350—前1320年', true),
      participantEntityIds: ['hittite-empire'],
      evidenceBlocks: [fact('event-hittite-syrian-expansion-evidence', '赫梯王权趁叙利亚北部旧有强国衰退向南扩张，并让王族成员坐镇区域要地。', ['source-bryce-hittite-kingdom', 'source-met-hittites'])],
      sourceIds: ['source-bryce-hittite-kingdom', 'source-met-hittites'],
      editorialReview: review([], [], [interpretation('event-hittite-syrian-expansion-boundaries', '赫梯在叙利亚的影响范围会随战争、条约和地方忠诚变化，不能重建成固定国界。', ['source-bryce-hittite-kingdom'])], [], ['source-bryce-hittite-kingdom', 'source-met-hittites'])
    },
    {
      id: 'event-hittite-ugarit-treaty', kind: 'historicalEvent',
      title: '乌加里特进入赫梯条约体系',
      timeSpan: timeSpan(-1350, -1330, '约公元前1350—前1330年', true),
      participantEntityIds: ['hittite-empire', 'ugarit-kingdom'],
      evidenceBlocks: [fact('event-hittite-ugarit-treaty-evidence', '赫梯与乌加里特的外交文本确认地方王位和领土，同时规定忠诚、贡赋与军事义务。', ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit'])],
      sourceIds: ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit'],
      editorialReview: review([limitation('event-hittite-ugarit-treaty-practice', '条约保存的是王室规定，实际执行还需结合书信和地方档案。', ['source-beckman-hittite-diplomatic-texts'])], [], [], [], ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit'])
    },
    {
      id: 'event-hittite-central-kingdom-ends', kind: 'historicalProcess',
      title: '赫梯中央王国解体',
      timeSpan: timeSpan(-1200, -1180, '约公元前1200—前1180年', true),
      participantEntityIds: ['hittite-empire'],
      evidenceBlocks: [fact('event-hittite-central-kingdom-ends-evidence', '哈图沙约在公元前1200年前后遭到破坏并被放弃，赫梯中央王国及其条约网络解体。', ['source-bryce-hittite-kingdom', 'source-met-hittites'])],
      sourceIds: ['source-bryce-hittite-kingdom', 'source-met-hittites'],
      editorialReview: review([], [], [interpretation('event-hittite-central-kingdom-ends-causes', '都城放弃、破坏与中央王国解体的次序和原因不能归结为单一入侵。', ['source-bryce-hittite-kingdom', 'source-met-hittites'])], [interpretation('event-hittite-central-kingdom-ends-continuity', '安纳托利亚东南部和叙利亚北部的后继政权延续了部分赫梯名称、符号与政治传统。', ['source-bryce-neo-hittite-kingdoms'])], ['source-bryce-hittite-kingdom', 'source-bryce-neo-hittite-kingdoms', 'source-met-hittites'])
    },
    {
      id: 'event-ugarit-destruction', kind: 'historicalEvent',
      title: '乌加里特王国毁灭',
      timeSpan: timeSpan(-1200, -1180, '约公元前1200—前1180年', true),
      participantEntityIds: ['ugarit-kingdom'],
      evidenceBlocks: [fact('event-ugarit-destruction-evidence', '乌加里特在公元前12世纪初遭到严重毁坏，原有王国和宫殿行政体系没有恢复。', ['source-yon-city-of-ugarit', 'source-french-ugarit-history'])],
      sourceIds: ['source-yon-city-of-ugarit', 'source-french-ugarit-history', 'source-leriche-ugarit-after-1180'],
      editorialReview: review([], [], [interpretation('event-ugarit-destruction-agent', '毁城者、精确日期与毁灭后的有限再占用仍需谨慎判断。', ['source-yon-city-of-ugarit', 'source-leriche-ugarit-after-1180'])], [], ['source-yon-city-of-ugarit', 'source-french-ugarit-history', 'source-leriche-ugarit-after-1180'])
    },
    {
      id: 'event-ramesses-iii-northern-invasions', kind: 'historicalEvent',
      title: '拉美西斯三世抵御北方来敌',
      timeSpan: timeSpan(-1177, -1175, '约公元前1177—前1175年', true),
      participantEntityIds: ['egypt-new-kingdom'],
      evidenceBlocks: [fact('event-ramesses-iii-northern-invasions-evidence', '麦迪奈特哈布的浮雕与铭文把来自北方的若干群体分别列名，并表现埃及军队在陆地和尼罗河口作战。', ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-grandet-ramesses-iii'])],
      sourceIds: ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-grandet-ramesses-iii'],
      editorialReview: review(
        [limitation('event-ramesses-iii-royal-record', '主要叙事来自埃及获胜方的王室祭庙，不能视为中立战地记录。', ['source-cifola-ramesses-sea-peoples'])],
        [],
        [interpretation('event-ramesses-iii-groups', '各族名的来源、彼此关系、人数与行动方式无法完整复原。', ['source-yasur-landau-philistines'])],
        [interpretation('event-ramesses-iii-mixed-movements', '迁徙、劫掠、雇佣兵活动和地方政治重组可能同时存在。', ['source-yasur-landau-philistines'])],
        ['source-isac-medinet-habu-i', 'source-cifola-ramesses-sea-peoples', 'source-yasur-landau-philistines']
      )
    }
  ];

  const structuralEdges = [
    {
      id: 'edge-hittite-old-babylon-raid', family: 'historicalNetwork', type: 'raided',
      source: { kind: 'entity', id: 'hittite-empire' }, target: { kind: 'entity', id: 'old-babylonian-kingdom' },
      timeSpan: timeSpan(-1595, -1595, '约公元前1595年', true),
      label: { forward: '突袭其都城', reverse: '遭到远征突袭' },
      summaries: { canonical: '早期赫梯军队突袭巴比伦，古巴比伦第一王朝随后结束，但赫梯没有在当地建立长期统治。' },
      qualifiers: ['不表示赫梯长期统治巴比伦'], sourceIds: ['source-bryce-hittite-kingdom', 'source-met-isin-larsa-old-babylonian']
    },
    {
      id: 'edge-ugarit-hittite-vassal', family: 'historicalNetwork', type: 'vassal_treaty',
      source: { kind: 'entity', id: 'ugarit-kingdom' }, target: { kind: 'entity', id: 'hittite-empire' },
      timeSpan: timeSpan(-1350, -1180, '约公元前1350—前1180年', true),
      label: { forward: '以条约承担义务', reverse: '以条约确认其王位与义务' },
      summaries: { canonical: '乌加里特在赫梯主导的条约体系中保留地方王权，同时承担贡赋、忠诚和军事义务。' },
      qualifiers: ['条约规定不等于每项义务始终完整执行'], sourceIds: ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit']
    },
    {
      id: 'edge-kadesh-hittite-participant', family: 'historicalNetwork', type: 'participant_in',
      source: { kind: 'entity', id: 'hittite-empire' }, target: { kind: 'event', id: 'event-battle-of-kadesh' },
      timeSpan: timeSpan(-1274, -1274, '约公元前1274年', true),
      label: { forward: '参加卡迭石战役', reverse: '赫梯帝国参战' },
      summaries: { canonical: '赫梯帝国在卡迭石附近以战车突袭尚未集结的埃及军队。' },
      sourceIds: ['source-bryce-hittite-kingdom', 'source-spalinger-war-egypt']
    },
    {
      id: 'edge-amarna-cuneiform', family: 'historicalNetwork', type: 'written_in',
      source: { kind: 'entity', id: 'amarna-letters-corpus' }, target: { kind: 'entity', id: 'cuneiform' },
      timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true),
      label: { forward: '以楔形文字书写', reverse: '被外交宫廷继续使用' },
      summaries: { canonical: '阿玛尔纳外交泥版使用楔形文字和以阿卡德语为主的宫廷书写惯例，让不同语言的王国能够通信。' },
      qualifiers: ['共同书写惯例不表示各地居民日常使用同一种语言'],
      sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters']
    }
  ];

  const cards = [
    {
      id: 'hittite-syria-treaties', kind: 'overview', primaryEntityId: 'hittite-empire', relatedEntityIds: ['old-babylonian-kingdom', 'ugarit-kingdom', 'troy-archaeological-site', 'battle-of-kadesh-war', 'egypt-new-kingdom'],

      title: '高原王国成为条约帝国',
      editorialPurpose: '从王国形成、内部危机、再次扩张、条约治理、大国战争与外交一直讲到中央王国终结，呈现赫梯帝国的完整兴衰。',
      introduction: '赫梯并不是从建立之初便一路扩张。高原王国经历王位危机后重新强盛，大王再用战争、王族据点和一份份条约，把相距遥远的地方国王接进同一个政治世界。',
      thesis: { text: '赫梯帝国依靠军事力量扩张，却不能只靠军队维持；王族据点、地方王宫、附庸条约和与埃及等大国的外交共同构成了它不断调整的统治秩序。', sourceIds: ['source-bryce-hittite-kingdom', 'source-beckman-hittite-diplomatic-texts'] },
      timeSpan: timeSpan(-1650, -1180, '约公元前1650—前1180年', true),
      sceneIds: ['hittite-hattusa-center', 'hittite-throne-crises', 'hittite-syria-princes', 'hittite-kings-treaty', 'hittite-carchemish-supervision', 'hittite-network-ends'],
      sourceIds: ['source-bryce-hittite-kingdom', 'source-bryce-neo-hittite-kingdoms', 'source-beckman-hittite-diplomatic-texts', 'source-unesco-hattusha', 'source-met-hittites', 'source-met-isin-larsa-old-babylonian', 'source-met-ugarit', 'source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa', 'source-spalinger-war-egypt', 'source-un-egypt-hatti-treaty'],
      editorialReview: review(
        [limitation('hittite-review-treaty-survival', '现存条约偏向王室规定，地方社会的实际回应更难复原。', ['source-beckman-hittite-diplomatic-texts'])],
        [],
        [interpretation('hittite-review-collapse', '哈图沙的破坏、放弃与中央王国解体的具体次序仍不完全清楚。', ['source-bryce-hittite-kingdom', 'source-met-hittites'])],
        [interpretation('hittite-review-direct-force', '赫梯也会直接出兵、废黜统治者或干预继承，不能把帝国只写成协商网络。', ['source-bryce-hittite-kingdom']), interpretation('hittite-review-other-bonds', '王室婚姻、粮食调动、宗教誓言和军事威慑也参与维持帝国。', ['source-bryce-hittite-kingdom', 'source-beckman-hittite-diplomatic-texts'])],
        ['source-bryce-hittite-kingdom', 'source-bryce-neo-hittite-kingdoms', 'source-beckman-hittite-diplomatic-texts', 'source-met-hittites']
      )
    },
    {
      id: 'ugarit-kings-trade', kind: 'overview', primaryEntityId: 'ugarit-kingdom', relatedEntityIds: ['hittite-empire'],

      title: '乌加里特在诸王之间做生意',
      editorialPurpose: '说明乌加里特的商业活动如何嵌在宫殿、外交和大国秩序之中。',
      introduction: '在叙利亚海岸，一座小王国靠港口、宫殿和书吏穿行于大国之间。乌加里特的生意从来不只是买卖，也是一种求生政治。',
      thesis: { text: '乌加里特把农业、港口、商人、宫殿账目和外交义务接在一起，因而能够在大国之间维持王国，也深受跨区域网络变化影响。', sourceIds: ['source-yon-city-of-ugarit', 'source-met-ugarit', 'source-heltzer-ugarit-metal-trade'] },
      timeSpan: timeSpan(-1800, -1150, '约公元前1800—前1150年', true),
      sceneIds: ['ugarit-old-city-kingdom', 'ugarit-port-inland', 'ugarit-treaty-tribute', 'ugarit-merchants-palace', 'ugarit-scribes-languages', 'ugarit-destruction-layer'],
      sourceIds: ['source-yon-city-of-ugarit', 'source-met-ugarit', 'source-heltzer-ugarit-metal-trade', 'source-boyes-writing-ugarit', 'source-french-ugarit-exchange', 'source-french-ugarit-texts', 'source-french-ugarit-history', 'source-leriche-ugarit-after-1180', 'source-beckman-hittite-diplomatic-texts'],
      editorialReview: review(
        [limitation('ugarit-review-palace-archives', '现存档案主要来自宫殿、神庙和书吏，普通居民的经济经验可见度较低。', ['source-yon-city-of-ugarit', 'source-boyes-writing-ugarit'])],
        [],
        [interpretation('ugarit-review-borders-and-end', '王国疆域、毁灭日期、毁城者及后续有限再占用均不能精确确定。', ['source-yon-city-of-ugarit', 'source-leriche-ugarit-after-1180'])],
        [interpretation('ugarit-review-agriculture', '乌加里特也依赖农业腹地，不能完全写成只靠转口贸易生存的港口。', ['source-met-ugarit']), interpretation('ugarit-review-prosperity', '繁荣还与农业生产、王室组织和大国保护有关，地理位置不是唯一解释。', ['source-met-ugarit', 'source-yon-city-of-ugarit'])],
        ['source-yon-city-of-ugarit', 'source-met-ugarit', 'source-boyes-writing-ugarit', 'source-leriche-ugarit-after-1180']
      )
    },
    {
      id: 'kadesh-did-not-end-war', kind: 'thematic', primaryEntityId: 'battle-of-kadesh-war', relatedEntityIds: ['egypt-new-kingdom', 'hittite-empire'],

      title: '卡迭石没有结束战争',
      editorialPurpose: '区分战场脱险、战略结果、王室宣传和十五年后的外交和解。',
      introduction: '拉美西斯二世把卡迭石刻成一场个人胜利，城池却仍在赫梯一侧。真正改变两国关系的，不是战场上的一天，而是此后十五年的较量。',
      thesis: { text: '埃及军队在卡迭石的突袭中恢复并撤离，却从未夺取城市；埃及王室把危机塑造成胜利，而两国直到约十五年后才缔结条约。', sourceIds: ['source-bm-kadesh-sallier', 'source-spalinger-war-egypt', 'source-bryce-hittite-kingdom', 'source-beckman-hittite-diplomatic-texts'] },
      timeSpan: timeSpan(-1274, -1258, '约公元前1274—前1258年', true),
      sceneIds: ['kadesh-two-powers-meet', 'kadesh-false-message', 'kadesh-chariots-camp', 'kadesh-city-not-taken', 'kadesh-temple-victory', 'kadesh-treaty-later'],
      sourceIds: ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii', 'source-un-egypt-hatti-treaty', 'source-spalinger-war-egypt', 'source-bryce-hittite-kingdom', 'source-beckman-hittite-diplomatic-texts', 'source-langdon-gardiner-egypt-hatti-treaty'],
      editorialReview: review(
        [limitation('kadesh-review-egyptian-record', '战役详细过程主要来自埃及王室文本和图像，双方证据并不对称。', ['source-bm-kadesh-sallier'])],
        [],
        [interpretation('kadesh-review-reconstruction', '双方兵力、战车数量、渡河位置、路线和部分战术次序无法精确复原。', ['source-spalinger-war-egypt'])],
        [interpretation('kadesh-review-recovery', '埃及军队恢复抵抗并撤离，战略上未夺取城市不等于战场上全军覆没。', ['source-spalinger-war-egypt', 'source-bryce-hittite-kingdom']), interpretation('kadesh-review-treaty-motives', '条约可能同时受到长期消耗、地区力量变化和赫梯王位合法性需求影响。', ['source-bryce-hittite-kingdom', 'source-beckman-hittite-diplomatic-texts'])],
        ['source-bm-kadesh-sallier', 'source-spalinger-war-egypt', 'source-bryce-hittite-kingdom', 'source-beckman-hittite-diplomatic-texts']
      )
    },
    {
      id: 'amarna-kings-write-world', kind: 'thematic', primaryEntityId: 'amarna-letters-corpus', relatedEntityIds: ['egypt-new-kingdom', 'hittite-empire', 'ugarit-kingdom', 'cuneiform', 'late-bronze-palace-system', 'mesopotamia-region'],

      title: '诸王把世界写进书信',
      editorialPurpose: '破除青铜时代只有战争与征服的刻板印象，让读者看见诸王持续经营的外交关系。',
      introduction: '战车、城墙和征服并不是青铜时代的全部。在战争之外，诸王不断写信、派遣使者、交换礼物，也努力让远方的国王继续把自己当作朋友。',
      thesis: { text: '晚青铜时代的大国不仅通过战争竞争，也发展出持续运作的外交秩序；称呼、礼物、婚姻和书信让统治者协商地位、处理争端并维持远距离关系。', sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters'] },
      timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true),
      sceneIds: ['amarna-letters-remain', 'amarna-shared-writing', 'amarna-kings-brothers', 'amarna-gifts-repeat-friendship', 'amarna-small-kings-write', 'amarna-diplomacy-routine', 'amarna-palaces-stop-replying'],
      sourceIds: ['source-met-amarna-letters', 'source-met-amarna-letter-object', 'source-moran-amarna-letters', 'source-beckman-hittite-diplomatic-texts', 'source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-yon-city-of-ugarit'],
      editorialReview: review(
        [limitation('amarna-review-egypt-archive', '档案主要保存埃及宫廷收到的信件，只呈现国际通信的一侧，也不能用于计算和平与战争各自持续的时间。', ['source-met-amarna-letters', 'source-moran-amarna-letters'])],
        [],
        [interpretation('amarna-review-order', '部分泥版的具体年代、先后次序和原始存放位置仍不确定。', ['source-moran-amarna-letters'])],
        [interpretation('amarna-review-gifts', '礼物交换同时包含互惠外交、竞争、索取和威望展示；大王以兄弟相称也没有消除战争、威胁或实际实力差距。', ['source-met-amarna-letters', 'source-moran-amarna-letters'])],
        ['source-met-amarna-letters', 'source-moran-amarna-letters']
      )
    },
    {
      id: 'medinet-habu-sea-raiders', kind: 'thematic', primaryEntityId: 'medinet-habu-war-records', relatedEntityIds: ['egypt-new-kingdom', 'ugarit-kingdom'],

      title: '海上来敌出现在法老的墙上',
      editorialPurpose: '先认识海上民族说法所依赖的埃及王室证据，再理解这份证据怎样塑造现代人看到的敌人。',
      introduction: '战船翻覆，弓箭落下，俘虏排成队列。法老把来自北方的敌人刻上神庙墙，也把一场危机改写成王权恢复秩序的胜利。',
      thesis: { text: '麦迪奈特哈布记录了埃及与若干来敌的战争，但今天常说的海上民族是把墙上多个名字组合起来的现代总称，浮雕本身又服从法老胜利叙事。', sourceIds: ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-cifola-ramesses-sea-peoples'] },
      timeSpan: timeSpan(-1180, -1100, '约公元前1180—前1100年', true),
      sceneIds: ['medinet-habu-temple-record', 'medinet-habu-delta-battle', 'medinet-habu-families-carts', 'medinet-habu-king-order', 'medinet-habu-egypt-contracts'],
      sourceIds: ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-grandet-ramesses-iii', 'source-cifola-ramesses-sea-peoples', 'source-yasur-landau-philistines', 'source-uee-early-mid-20th-dynasty'],
      editorialReview: review(
        [limitation('medinet-review-royal-monument', '现存主要叙事来自获胜方的王室祭庙，图像经过构图和意识形态安排。', ['source-cifola-ramesses-sea-peoples'])],
        [],
        [interpretation('medinet-review-identities', '墙上族名与具体考古群体之间的对应、来源和共同组织程度仍有争议。', ['source-yasur-landau-philistines'])],
        [interpretation('medinet-review-movements', '迁徙、海上劫掠、雇佣兵活动和地方政治重组可能同时存在。', ['source-yasur-landau-philistines'])],
        ['source-isac-medinet-habu-i', 'source-cifola-ramesses-sea-peoples', 'source-yasur-landau-philistines']
      )
    },
    {
      id: 'late-bronze-palaces-go-dark', kind: 'thematic', primaryEntityId: 'late-bronze-palace-system', relatedEntityIds: ['hittite-empire', 'ugarit-kingdom', 'egypt-new-kingdom', 'medinet-habu-war-records', 'mesopotamia-region'],

      title: '宫殿接连熄灭',
      editorialPurpose: '以赫梯、乌加里特、爱琴海和埃及四组证据讲清宫殿体系的不同结局，同时保留社会延续。',
      introduction: '有些宫殿在火中倒下，有些先被搬空，有些从此不再发出命令。短短几代人里，连接东地中海诸王的书信、仓库和贡赋网络失去了许多中心。',
      thesis: { text: '晚青铜时代的崩溃首先表现为多个宫殿中心停止原有行政、征收和外交功能；它由时间和结果不同的危机组成，不是一次让所有文明同时消失的灾难。', sourceIds: ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-middleton-understanding-collapse'] },
      timeSpan: timeSpan(-1250, -1050, '约公元前1250—前1050年', true),
      sceneIds: ['palaces-connect-kingdoms', 'palaces-hattusa-silent', 'palaces-ugarit-tablets-stop', 'palaces-aegean-writing-stops', 'palaces-egypt-holds', 'palaces-archaeologists-causes', 'palaces-life-reorganizes'],
      sourceIds: ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-middleton-understanding-collapse', 'source-bryce-hittite-kingdom', 'source-bryce-neo-hittite-kingdoms', 'source-yon-city-of-ugarit', 'source-uee-early-mid-20th-dynasty'],
      editorialReview: review(
        [limitation('palaces-review-composite', '晚青铜时代宫殿体系是跨地区编辑概括，各地宫殿的组织方式并不相同。', ['source-knapp-manning-crisis'])],
        [historicalCase('palaces-review-egypt', '埃及国家继续存在', '埃及经历战争、收缩和内部困难，却没有与赫梯、乌加里特或迈锡尼宫殿采取相同路径。', ['event-ramesses-iii-northern-invasions'], ['source-uee-early-mid-20th-dynasty'])],
        [interpretation('palaces-review-dating', '遗址毁灭年代、火灾原因和废弃过程存在测年与解释争议。', ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath'])],
        [interpretation('palaces-review-causes', '气候压力、地震、战争、内部冲突、迁徙、贸易中断和网络脆弱性都可能参与，尚无单一解释覆盖全部地区。', ['source-knapp-manning-crisis', 'source-middleton-understanding-collapse'])],
        ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-middleton-understanding-collapse']
      )
    }
  ];

  const scenes = [
    {
      id: 'hittite-hattusa-center', title: '一座旧城成为王国中心', eyebrow: '赫梯王国形成', timeSpan: timeSpan(-1650, -1595, '约公元前1650—前1595年', true), eventIds: ['event-hittite-central-kingship-consolidates'],
      contentBlocks: [fact('hittite-hattusa-center-fact', '约公元前17世纪，早期国王哈图西里一世把哈图沙——安纳托利亚高原上的一座旧城——变成王国中心。军队从这里越过山地，进入北叙利亚；下一位国王甚至远征巴比伦，结束当地的第一王朝。', ['source-bryce-hittite-kingdom', 'source-unesco-hattusha', 'source-met-isin-larsa-old-babylonian'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-hittite-hattusa-wall' },
      sourceIds: ['source-bryce-hittite-kingdom', 'source-unesco-hattusha', 'source-met-isin-larsa-old-babylonian', 'source-wikimedia-hattusa-wall']
    },
    {
      id: 'hittite-throne-crises', title: '远征回来，王位却失去秩序', eyebrow: '早期王国', timeSpan: timeSpan(-1595, -1400, '约公元前1595—前1400年', true), eventIds: ['event-hittite-sack-babylon', 'event-hittite-central-kingship-consolidates'],
      contentBlocks: [fact('hittite-throne-crises-fact', '远征巴比伦的国王回国后遇刺，接下来的王位不断在政变和复仇中易手。先前归服的地方趁机脱离，军队也难以持续向外行动。赫梯没有从建立之初便一路扩张；它先花了许多代人的时间，让继承规则、首都和军队重新稳定下来。', ['source-bryce-hittite-kingdom'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-hittite-inandik-vase' },
      sourceIds: ['source-bryce-hittite-kingdom', 'source-wikimedia-inandik-vase']
    },
    {
      id: 'hittite-syria-princes', title: '苏庇路里乌玛重建帝国', eyebrow: '赫梯再次扩张', timeSpan: timeSpan(-1350, -1320, '约公元前1350—前1320年', true), eventIds: ['event-hittite-syrian-expansion'],
      contentBlocks: [fact('hittite-syria-princes-fact', '公元前14世纪，赫梯国王苏庇路里乌玛一世重新稳定王权，并趁叙利亚北部的旧强国衰退向南推进。他没有让哈图沙直接管理每一座城，而是把赫梯王族派到阿勒颇、卡尔凯美什等交通和军事要地。帝国的远方权力先落在这些能够传令、出兵和监督地方国王的支点上。', ['source-bryce-hittite-kingdom', 'source-met-hittites'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-lba-hittite-syria', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'hittite-empire', annotationId: 'annotation-lba-hattusa', sourceIds: ['source-unesco-hattusha'] },
            { kind: 'entity', entityId: 'hittite-empire', annotationId: 'annotation-lba-aleppo', sourceIds: ['source-bryce-hittite-kingdom'] },
            { kind: 'entity', entityId: 'hittite-empire', annotationId: 'annotation-lba-carchemish', sourceIds: ['source-bryce-hittite-kingdom'] }
          ],
          caption: '深色圆点标出哈图沙与两个叙利亚支点；棕色虚线只表示政治联系，不是精确行军路线或国界。'
        }
      },
      sourceIds: ['source-bryce-hittite-kingdom', 'source-met-hittites', 'source-natural-earth']
    },
    {
      id: 'hittite-kings-treaty', title: '地方国王被写进条约', eyebrow: '条约治理', timeSpan: timeSpan(-1350, -1250, '约公元前1350—前1250年', true), eventIds: ['event-hittite-ugarit-treaty'],
      contentBlocks: [fact('hittite-kings-treaty-fact', '叙利亚海岸的乌加里特在战事逼近时投向赫梯。泥版条约确认当地国王的王位和领土，也列出贡赋、忠诚与军事协助。另一份约公元前13世纪的条约则把安纳托利亚西部维鲁萨的国王阿拉克桑杜写进同一种“大王—地方国王”关系；许多研究者把维鲁萨识别为特洛伊。两地相距遥远，条约内容也不完全相同，但都显示赫梯大王如何让地方王宫继续存在，同时要求其承担政治与军事义务。', ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit', 'source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-hittite-aleppo-treaty' },
      sourceIds: ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit', 'source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa', 'source-wikimedia-aleppo-treaty']
    },
    {
      id: 'hittite-carchemish-supervision', title: '卡迭石之后，敌手交换条约', eyebrow: '战争与大国外交', timeSpan: timeSpan(-1274, -1258, '约公元前1274—前1258年', true), eventIds: ['event-battle-of-kadesh', 'event-egypt-hatti-treaty'],
      contentBlocks: [fact('hittite-carchemish-supervision-synthesis', '赫梯与埃及都想控制叙利亚的城市和道路。约公元前1274年，两国军队在卡迭石交战；埃及法老拉美西斯二世没有夺取城市，赫梯也没有靠这一战结束竞争。约十五年后，拉美西斯二世与赫梯大王哈图西里三世交换条约，承诺和平、互助和王朝安全。赫梯的外交因此不只有大王对地方国王的命令，也包括两个大国在长期对抗后彼此承认。', ['source-spalinger-war-egypt', 'source-bryce-hittite-kingdom', 'source-beckman-hittite-diplomatic-texts', 'source-un-egypt-hatti-treaty'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-kadesh-treaty-tablet' },
      sourceIds: ['source-spalinger-war-egypt', 'source-bryce-hittite-kingdom', 'source-beckman-hittite-diplomatic-texts', 'source-un-egypt-hatti-treaty', 'source-wikimedia-kadesh-treaty']
    },
    {
      id: 'hittite-network-ends', title: '中央王国消失，赫梯之名继续存在', eyebrow: '赫梯帝国终结', timeSpan: timeSpan(-1200, -1180, '约公元前1200—前1180年', true), eventIds: ['event-hittite-central-kingdom-ends'],
      contentBlocks: [synthesis('hittite-network-ends-synthesis', '这种帝国活在反复确认的关系里：新王即位，要重申忠诚；战争来临，要兑现兵员和粮食。约公元前1200年前后，哈图沙遭到破坏并被放弃，赫梯中央王国和以它为中心的条约网络一同解体。不过，居民并没有全部消失；此后安纳托利亚东南部与叙利亚北部的一些政权继续使用赫梯的名称、王权符号和书写传统。帝国结束了，它留下的政治语言却没有立刻结束。', ['source-bryce-hittite-kingdom', 'source-bryce-neo-hittite-kingdoms', 'source-met-hittites'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-hittite-hattusa-ruins' },
      sourceIds: ['source-bryce-hittite-kingdom', 'source-bryce-neo-hittite-kingdoms', 'source-met-hittites', 'source-wikimedia-hattusa-ruins']
    },

    {
      id: 'ugarit-old-city-kingdom', title: '一座旧城形成一个王国', eyebrow: '乌加里特形成', timeSpan: timeSpan(-1800, -1450, '约公元前1800—前1450年', true), eventIds: ['event-ugarit-palace-port-network-operates'],
      contentBlocks: [fact('ugarit-old-city-kingdom-fact', '乌加里特不是晚青铜时代突然冒出的城市。这里很早便有人定居，公元前18世纪的远方文书已经提到它；到晚青铜时代，王宫、仓库和成群泥版让一个王国清晰可见。国王从城中管理周围土地，王国却没有留下可供今天精确描画的边界。', ['source-yon-city-of-ugarit', 'source-met-ugarit'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-ugarit-palace' },
      sourceIds: ['source-yon-city-of-ugarit', 'source-met-ugarit', 'source-wikimedia-ugarit-palace']
    },
    {
      id: 'ugarit-port-inland', title: '港口把王城接到海上', eyebrow: '海陆交换', timeSpan: timeSpan(-1450, -1200, '约公元前1450—前1200年', true), eventIds: ['event-ugarit-palace-port-network-operates'],
      contentBlocks: [fact('ugarit-port-inland-fact', '城外不远处的港口把王宫接到地中海，向东的道路又通往叙利亚内陆。船只带来塞浦路斯的铜和爱琴海风格的陶器，陆路运来粮食与其他货物。乌加里特作为十字路口的存在，让海上的货物能够继续向内陆移动。', ['source-yon-city-of-ugarit', 'source-french-ugarit-exchange', 'source-met-ugarit'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-lba-ugarit-connections', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'ugarit-kingdom', annotationId: 'annotation-lba-ugarit-city', sourceIds: ['source-yon-city-of-ugarit'] },
            { kind: 'entity', entityId: 'ugarit-kingdom', annotationId: 'annotation-lba-ugarit-port', sourceIds: ['source-french-ugarit-exchange'] },
            { kind: 'entity', entityId: 'ugarit-kingdom', annotationId: 'annotation-lba-cyprus-link', sourceIds: ['source-met-ugarit'] }
          ],
          caption: '深色圆点标出王城、近海港口和塞浦路斯方向；棕色虚线表示交换联系，不是单一商船的确定航线。'
        }
      },
      sourceIds: ['source-yon-city-of-ugarit', 'source-french-ugarit-exchange', 'source-met-ugarit', 'source-natural-earth']
    },
    {
      id: 'ugarit-treaty-tribute', title: '一份条约保住王位，也规定贡赋', eyebrow: '赫梯附庸关系', timeSpan: timeSpan(-1350, -1320, '约公元前1350—前1320年', true), eventIds: ['event-hittite-ugarit-treaty', 'event-ugarit-palace-port-network-operates'],
      contentBlocks: [fact('ugarit-treaty-tribute-fact', '公元前14世纪中叶，赫梯军队改变了叙利亚的力量格局。乌加里特国王在压力下加入赫梯主导的秩序：条约保护他的王位和部分领土，也规定贡赋、忠诚与出兵义务。小王国没有消失，却必须把自己的安全写进大王认可的条件里。', ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-ugarit-law-tablet' },
      sourceIds: ['source-beckman-hittite-diplomatic-texts', 'source-met-ugarit', 'source-wikimedia-ugarit-law-tablet']
    },
    {
      id: 'ugarit-merchants-palace', title: '货物经过商人，也经过王宫', eyebrow: '宫殿经济', timeSpan: timeSpan(-1350, -1200, '约公元前1350—前1200年', true), eventIds: ['event-ugarit-palace-port-network-operates'],
      contentBlocks: [fact('ugarit-merchants-palace-fact', '王宫的仓库、账目和书信记录着粮食、金属、木材与制成品的来往。商人替自己经营，也受王室差遣；外国人可以在城中交易，国王则征收、分配并向赫梯交纳贡赋。商业活动嵌在宫殿权力之中，也帮助宫殿履行对大国的义务。', ['source-met-ugarit', 'source-heltzer-ugarit-metal-trade', 'source-yon-city-of-ugarit'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-ugarit-uluburun-reconstruction' },
      sourceIds: ['source-met-ugarit', 'source-heltzer-ugarit-metal-trade', 'source-yon-city-of-ugarit', 'source-wikimedia-uluburun-reconstruction']
    },
    {
      id: 'ugarit-scribes-languages', title: '书吏在几种文字之间工作', eyebrow: '多语言档案', timeSpan: timeSpan(-1350, -1200, '约公元前1350—前1200年', true), eventIds: ['event-ugarit-palace-port-network-operates'],
      contentBlocks: [fact('ugarit-scribes-languages-fact', '货物跨过边界，文书也要跨过语言。书吏用阿卡德语处理许多外交和行政事务，又用本地的乌加里特语记录祭仪、神话和日常业务；城中还留下其他语言与文字的痕迹。能在几套书写系统之间切换，本身就是这座港城的基础设施。', ['source-boyes-writing-ugarit', 'source-french-ugarit-texts', 'source-met-ugarit'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-ugarit-administrative-tablet' },
      sourceIds: ['source-boyes-writing-ugarit', 'source-french-ugarit-texts', 'source-met-ugarit', 'source-wikimedia-ugarit-admin-tablet']
    },
    {
      id: 'ugarit-destruction-layer', title: '生意停止在毁灭层里', eyebrow: '乌加里特终结', timeSpan: timeSpan(-1200, -1150, '约公元前1200—前1150年', true), eventIds: ['event-ugarit-destruction'],
      contentBlocks: [synthesis('ugarit-destruction-layer-synthesis', '繁荣也带来依赖：航路、粮食、王宫账目和大国命令，任何一环中断都会传到城里。约公元前12世纪初，乌加里特遭到严重毁坏，王宫行政和原有王国没有恢复。泥版留在倒塌的房间里；毁城者难以确定，而它们记录的国际世界也在同一时期解体。', ['source-yon-city-of-ugarit', 'source-french-ugarit-history', 'source-leriche-ugarit-after-1180'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-ugarit-palace' },
      sourceIds: ['source-yon-city-of-ugarit', 'source-french-ugarit-history', 'source-leriche-ugarit-after-1180', 'source-wikimedia-ugarit-palace']
    },

    {
      id: 'kadesh-two-powers-meet', title: '两大王权在卡迭石相遇', eyebrow: '叙利亚争夺', timeSpan: timeSpan(-1274, -1274, '约公元前1274年', true), eventIds: ['event-battle-of-kadesh'],
      contentBlocks: [fact('kadesh-two-powers-meet-fact', '约公元前1274年，埃及法老拉美西斯二世率军北上，目标是叙利亚要地卡迭石。北方的赫梯大王也集结军队。卡迭石靠近奥伦特河，处在两国争夺的地方王国之间；谁占住它，谁就更能左右叙利亚的盟友。', ['source-bryce-hittite-kingdom', 'source-spalinger-war-egypt', 'source-hayes-scepter-ii'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-lba-kadesh-powers', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-lba-egypt-core', sourceIds: ['source-hayes-scepter-ii'] },
            { kind: 'entity', entityId: 'hittite-empire', annotationId: 'annotation-lba-hattusa-kadesh', sourceIds: ['source-bryce-hittite-kingdom'] },
            { kind: 'entity', entityId: 'battle-of-kadesh-war', annotationId: 'annotation-lba-kadesh', sourceIds: ['source-bm-kadesh-sallier'] }
          ],
          caption: '深色圆点标出尼罗河谷核心、赫梯首都与卡迭石；棕色虚线只表示两方抵达争夺区的相对关系。'
        }
      },
      sourceIds: ['source-bryce-hittite-kingdom', 'source-spalinger-war-egypt', 'source-hayes-scepter-ii', 'source-natural-earth']
    },
    {
      id: 'kadesh-false-message', title: '法老先听见了错误的消息', eyebrow: '战前情报', timeSpan: timeSpan(-1274, -1274, '约公元前1274年', true), eventIds: ['event-battle-of-kadesh'],
      contentBlocks: [fact('kadesh-false-message-fact', '埃及各军团沿路分开行进，法老带领的一部先到城外。埃及王室文本说，两名被俘者谎称赫梯军队还在远方；后来抓到的侦察人员才供出真相。拉美西斯发现对手就在河对岸，而自己的大部分军队尚未赶到。', ['source-bm-kadesh-sallier', 'source-spalinger-war-egypt'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-kadesh-spies-relief' },
      sourceIds: ['source-bm-kadesh-sallier', 'source-spalinger-war-egypt', 'source-wikimedia-kadesh-spies']
    },
    {
      id: 'kadesh-chariots-camp', title: '战车冲进尚未集结的营地', eyebrow: '赫梯突袭', timeSpan: timeSpan(-1274, -1274, '约公元前1274年', true), eventIds: ['event-battle-of-kadesh'],
      contentBlocks: [fact('kadesh-chariots-camp-fact', '赫梯战车渡河后突然冲向正在扎营的埃及军队，撞散一支赶来的军团，又闯入法老营地。帐篷、士兵和车辆挤在一起，埃及军一度失去队形。后来那些神庙浮雕反复描绘的英雄时刻，首先来自一次危险的情报与集结失败。', ['source-bm-kadesh-sallier', 'source-spalinger-war-egypt'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-kadesh-surprise-map' },
      sourceIds: ['source-bm-kadesh-sallier', 'source-spalinger-war-egypt', 'source-wikimedia-kadesh-attack-map']
    },
    {
      id: 'kadesh-city-not-taken', title: '法老脱险，却没有得到卡迭石', eyebrow: '战略结果', timeSpan: timeSpan(-1274, -1274, '约公元前1274年', true), eventIds: ['event-battle-of-kadesh'],
      contentBlocks: [synthesis('kadesh-city-not-taken-synthesis', '拉美西斯身边的部队重新抵抗，后续援军也陆续抵达，埃及军没有在营地中覆灭。可他们同样没有夺下卡迭石，只能向南撤回。赫梯仍维持在叙利亚北部的影响。', ['source-bryce-hittite-kingdom', 'source-spalinger-war-egypt', 'source-hayes-scepter-ii'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-lba-kadesh-powers', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-lba-egypt-core', sourceIds: ['source-hayes-scepter-ii'] },
            { kind: 'entity', entityId: 'battle-of-kadesh-war', annotationId: 'annotation-lba-kadesh', sourceIds: ['source-bm-kadesh-sallier'] },
            { kind: 'entity', entityId: 'hittite-empire', annotationId: 'annotation-lba-syria-hittite', sourceIds: ['source-bryce-hittite-kingdom'] }
          ],
          caption: '卡迭石仍位于赫梯主导的叙利亚网络中；图上联系是教学概括，不表示精确撤军路线或固定国界。'
        }
      },
      sourceIds: ['source-bryce-hittite-kingdom', 'source-spalinger-war-egypt', 'source-hayes-scepter-ii', 'source-natural-earth']
    },
    {
      id: 'kadesh-temple-victory', title: '战役在神庙墙上变成胜利', eyebrow: '王室叙事', timeSpan: timeSpan(-1274, -1259, '约公元前1274—前1259年', true), eventIds: ['event-battle-of-kadesh'],
      contentBlocks: [fact('kadesh-temple-victory-fact', '回到埃及后，拉美西斯让文字和浮雕在多座神庙讲述同一场战役：军队溃散，法老独自迎敌，阿蒙神回应呼喊，敌军被赶入河中。重复出现的场面把危机改写成王权证明。今天关于战役最细的故事，也主要由这套埃及叙事保存下来。', ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-kadesh-ramesses-relief' },
      sourceIds: ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii', 'source-wikimedia-kadesh-relief']
    },
    {
      id: 'kadesh-treaty-later', title: '十五年后，双方才交换条约', eyebrow: '埃及—赫梯条约', timeSpan: timeSpan(-1274, -1258, '约公元前1274—前1258年', true), eventIds: ['event-battle-of-kadesh', 'event-egypt-hatti-treaty'],
      contentBlocks: [fact('kadesh-treaty-later-fact', '卡迭石之后，两国仍在叙利亚角力。约十五年后，赫梯大王哈图西里三世与拉美西斯二世才交换条约，承诺和平、互助和遣返逃亡者，也彼此支持王朝安全。长期竞争、两国各自的压力和新的权力平衡，最终把敌手带到谈判桌前。', ['source-beckman-hittite-diplomatic-texts', 'source-bryce-hittite-kingdom', 'source-langdon-gardiner-egypt-hatti-treaty', 'source-un-egypt-hatti-treaty'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-kadesh-treaty-tablet' },
      sourceIds: ['source-beckman-hittite-diplomatic-texts', 'source-bryce-hittite-kingdom', 'source-langdon-gardiner-egypt-hatti-treaty', 'source-un-egypt-hatti-treaty', 'source-wikimedia-kadesh-treaty']
    },

    {
      id: 'amarna-letters-remain', title: '战争之外，诸王仍要彼此说话', eyebrow: '阿玛尔纳档案', timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), eventIds: ['event-amarna-diplomatic-correspondence-operates'],
      contentBlocks: [synthesis('amarna-letters-remain-synthesis', '约公元前十四世纪，埃及法老把宫廷迁到一座新建的都城。宫廷后来离开，外国使者送来的泥版却留在房间里。现存近四百块书信来自大国王宫和东地中海许多地方统治者：有人问候法老，有人商议婚姻和礼物，也有人报告叛乱、围城与道路上的危险。这批档案让我们直接看到，外交已经是晚青铜时代宫廷的日常事务。', ['source-met-amarna-letters', 'source-moran-amarna-letters'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-new-amarna-letter' },
      sourceIds: ['source-met-amarna-letters', 'source-met-amarna-letter-object', 'source-moran-amarna-letters']
    },
    {
      id: 'amarna-shared-writing', title: '不同宫廷共用一种外交文字', eyebrow: '书吏与使者', timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), eventIds: ['event-amarna-diplomatic-correspondence-operates'],
      contentBlocks: [fact('amarna-shared-writing-fact', '埃及、赫梯、米坦尼和叙利亚各地的人并不说同一种语言，宫廷书吏却能采用共同的外交书写传统。他们把芦苇笔压进湿泥，使用楔形文字和以阿卡德语为主的外交语言起草来信。使者再把泥版、口信和礼物一起送往另一座宫廷，让相隔数月路程的统治者能够持续交谈。', ['source-met-amarna-letters', 'source-moran-amarna-letters'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-amarna-mail-carrier' },
      sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters', 'source-runeberg-egypt-mail-carrier']
    },
    {
      id: 'amarna-kings-brothers', title: '一声“兄弟”确认彼此地位', eyebrow: '大王外交', timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), eventIds: ['event-amarna-diplomatic-correspondence-operates'],
      contentBlocks: [interpretation('amarna-kings-brothers-interpretation', '几个强大王国的统治者在信中把法老称为“兄弟”。这个称呼把他们放进一个彼此承认的大王圈子：他们可以要求对方解释怠慢，争论使者受到的待遇，也可以提醒对方维持过去的友好关系。大王之间没有共同的最高统治者，称呼和礼节便成为确认平等地位、处理摩擦的重要方式。', ['source-met-amarna-letters', 'source-met-amarna-letter-object', 'source-moran-amarna-letters'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-lba-amarna-great-kings', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'amarna-letters-corpus', annotationId: 'annotation-lba-amarna-egypt', sourceIds: ['source-met-amarna-letters'] },
        { kind: 'entity', entityId: 'amarna-letters-corpus', annotationId: 'annotation-lba-amarna-hattusa', sourceIds: ['source-met-amarna-letters'] }
      ], caption: '两个深色圆点标出埃及宫廷与北方大王宫廷；棕色虚线表示互称“兄弟”的外交关系，不表示固定国界。' } },
      sourceIds: ['source-met-amarna-letters', 'source-met-amarna-letter-object', 'source-natural-earth']
    },
    {
      id: 'amarna-gifts-repeat-friendship', title: '礼物让友好变成反复的行动', eyebrow: '礼物与婚姻', timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), eventIds: ['event-amarna-diplomatic-correspondence-operates'],
      contentBlocks: [interpretation('amarna-gifts-repeat-friendship-interpretation', '大王之间的友好需要不断用行动确认。黄金、青金石、马匹和战车随使者往返，王室婚姻又把远隔千里的统治家族连接起来。国王会列出自己送过的礼物，催促对方回赠，也会为公主、嫁妆和接待方式反复交涉。礼物与婚姻不是外交之外的装饰，而是大国经营关系的具体手段。', ['source-met-amarna-letters', 'source-moran-amarna-letters'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-amarna-tushratta-marriage-letter' },
      sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters', 'source-wikimedia-tushratta-marriage-letter']
    },
    {
      id: 'amarna-small-kings-write', title: '小国也用书信争取生存空间', eyebrow: '地方统治者求援', timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), eventIds: ['event-amarna-diplomatic-correspondence-operates'],
      contentBlocks: [fact('amarna-small-kings-write-fact', '埃及势力之下的地方统治者不能像大王一样把法老称作兄弟。他们用臣属的口吻写信，报告贡赋、驻军、邻近城镇和地方冲突；遇到危险时，又请求法老派来弓箭手、粮食或其他援助。小国不能与埃及平等谈判，却能通过书信呈交情报、指控对手，并努力让远方宫廷作出有利于自己的决定。', ['source-met-amarna-letters', 'source-moran-amarna-letters'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-amarna-four-foreign-rulers' },
      sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters', 'source-met-four-foreign-rulers']
    },
    {
      id: 'amarna-diplomacy-routine', title: '外交成为诸王世界的日常工作', eyebrow: '书信秩序', timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), eventIds: ['event-amarna-diplomatic-correspondence-operates'],
      contentBlocks: [synthesis('amarna-diplomacy-routine-synthesis', '一封信要经过书吏起草、使者传递、宫廷接收，再等待答复沿着道路返回。埃及保存下来的泥版中，巴比伦、米坦尼、赫梯和阿拉西亚等地的统治者都曾向法老写信，亚述的来信后来也进入这座宫廷。把这些书信放在一起，可以看到外交并非埃及与少数邻国之间的偶然往来，而是晚青铜时代许多宫廷共同采用的日常工作方式。', ['source-met-amarna-letters', 'source-moran-amarna-letters'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-lba-amarna-diplomacy', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'amarna-letters-corpus', annotationId: 'annotation-lba-amarna-egypt', sourceIds: ['source-met-amarna-letters'] },
        { kind: 'entity', entityId: 'amarna-letters-corpus', annotationId: 'annotation-lba-amarna-hattusa', sourceIds: ['source-met-amarna-letters'] },
        { kind: 'entity', entityId: 'amarna-letters-corpus', annotationId: 'annotation-lba-amarna-ugarit', sourceIds: ['source-moran-amarna-letters'] },
        { kind: 'entity', entityId: 'amarna-letters-corpus', annotationId: 'annotation-lba-amarna-babylon', sourceIds: ['source-moran-amarna-letters'] },
        { kind: 'entity', entityId: 'amarna-letters-corpus', annotationId: 'annotation-lba-amarna-assur', sourceIds: ['source-moran-amarna-letters'] },
        { kind: 'entity', entityId: 'amarna-letters-corpus', annotationId: 'annotation-lba-amarna-mitanni', sourceIds: ['source-moran-amarna-letters'] },
        { kind: 'entity', entityId: 'amarna-letters-corpus', annotationId: 'annotation-lba-amarna-alashiya', sourceIds: ['source-moran-amarna-letters'] }
      ], caption: '阿玛尔纳是书信保存地，虚线连向档案中出现的若干大国与地方宫廷。米坦尼标示大致核心区域，阿拉西亚标示塞浦路斯方向。' } },
      sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters', 'source-natural-earth']
    },
    {
      id: 'amarna-palaces-stop-replying', title: '许多宫廷后来不再回信', eyebrow: '外交网络失去中心', timeSpan: timeSpan(-1330, -1180, '约公元前1330—前1180年', true), eventIds: ['event-amarna-diplomatic-correspondence-operates', 'event-hittite-central-kingdom-ends', 'event-ugarit-destruction'],
      contentBlocks: [synthesis('amarna-palaces-stop-replying-synthesis', '阿玛尔纳档案形成以后，诸王外交又继续运转了一个多世纪。使者仍在上路，赫梯与埃及后来签订了正式条约，乌加里特等地方王国也继续保存外国来信。然而到约公元前1200年前后，哈图沙、乌加里特和爱琴海多座宫殿相继失去原有功能，部分档案不再增长。失去的不只是一批统治者，也包括供养书吏、接待使者并让远方宫廷持续通信的许多中心。', ['source-met-amarna-letters', 'source-beckman-hittite-diplomatic-texts', 'source-yon-city-of-ugarit', 'source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-lba-palace-centers', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-hattusa', sourceIds: ['source-bryce-hittite-kingdom'] },
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-ugarit', sourceIds: ['source-yon-city-of-ugarit'] },
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-pylos', sourceIds: ['source-deger-jalkotzy-aftermath'] },
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-egypt', sourceIds: ['source-uee-early-mid-20th-dynasty'] }
      ], caption: '圆点把四个宫殿中心放在同一视野：埃及延续，哈图沙、乌加里特和皮洛斯则失去原有的中心功能。' } },
      sourceIds: ['source-met-amarna-letters', 'source-beckman-hittite-diplomatic-texts', 'source-yon-city-of-ugarit', 'source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-bryce-hittite-kingdom', 'source-uee-early-mid-20th-dynasty', 'source-natural-earth']
    },

    {
      id: 'medinet-habu-temple-record', title: '法老把不同来敌刻上祭庙', eyebrow: '麦迪奈特哈布', timeSpan: timeSpan(-1180, -1150, '约公元前1180—前1150年', true), eventIds: ['event-ramesses-iii-northern-invasions'],
      contentBlocks: [fact('medinet-habu-temple-record-fact', '拉美西斯三世是埃及新王国后期的法老。他在自己的祭庙墙上刻下成组的战争浮雕，并记录了若干来敌的名字。后来的研究者把其中一些群体合称为“海上民族”，这个总称也让不同来敌看起来像一支统一大军。', ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-grandet-ramesses-iii'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-medinet-habu-temple' },
      sourceIds: ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-grandet-ramesses-iii', 'source-wikimedia-medinet-habu-temple']
    },
    {
      id: 'medinet-habu-delta-battle', title: '战船在尼罗河口挤作一团', eyebrow: '尼罗河口海战', timeSpan: timeSpan(-1177, -1175, '约公元前1177—前1175年', true), eventIds: ['event-ramesses-iii-northern-invasions'],
      contentBlocks: [fact('medinet-habu-delta-battle-fact', '浮雕上的船只被挤在狭窄水面，桅杆交错，落水者伸手挣扎。岸上的埃及弓箭手向船队射击，法老则以远大于常人的身形站在一旁。画面把混乱的战斗整理成一场由王权指挥的胜利。', ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-cifola-ramesses-sea-peoples'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-medinet-habu-naval-battle' },
      sourceIds: ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-cifola-ramesses-sea-peoples', 'source-wikimedia-medinet-habu-naval']
    },
    {
      id: 'medinet-habu-families-carts', title: '车辆带来了战士的家人', eyebrow: '陆战浮雕', timeSpan: timeSpan(-1177, -1175, '约公元前1177—前1175年', true), eventIds: ['event-ramesses-iii-northern-invasions'],
      contentBlocks: [interpretation('medinet-habu-families-carts-interpretation', '另一组陆战画面不只有持兵器的男子。牛拉车辆载着妇女、孩子和生活物品，与战士一起向前。这使部分来敌更像正在寻找新居所的人群，而不只是完成一次突袭便离开的舰队。', ['source-isac-medinet-habu-i', 'source-yasur-landau-philistines'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-medinet-habu-ox-carts' },
      sourceIds: ['source-isac-medinet-habu-i', 'source-yasur-landau-philistines']
    },
    {
      id: 'medinet-habu-king-order', title: '法老站在秩序的中心', eyebrow: '王室胜利叙事', timeSpan: timeSpan(-1180, -1150, '约公元前1180—前1150年', true), eventIds: ['event-ramesses-iii-northern-invasions'],
      contentBlocks: [interpretation('medinet-habu-king-order-interpretation', '墙面上的法老总是巨大、稳定而有力，敌人则翻倒、被缚或等待计数。这样的构图不是旁观者留下的战地速写，而是王室安排的公开记忆：外部世界陷入混乱，法老击败来敌，让神所认可的秩序重新成立。', ['source-isac-medinet-habu-i', 'source-cifola-ramesses-sea-peoples'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-kadesh-ramesses-relief' },
      sourceIds: ['source-isac-medinet-habu-i', 'source-cifola-ramesses-sea-peoples', 'source-hayes-scepter-ii', 'source-wikimedia-kadesh-relief']
    },
    {
      id: 'medinet-habu-egypt-contracts', title: '埃及守住边境，旧帝国仍在收缩', eyebrow: '战后变化', timeSpan: timeSpan(-1177, -1100, '约公元前1177—前1100年', true), eventIds: ['event-ramesses-iii-northern-invasions'],
      contentBlocks: [synthesis('medinet-habu-egypt-contracts-synthesis', '埃及政权没有像一些北方宫殿那样消失，却逐渐失去在叙利亚和巴勒斯坦的旧有控制。与此同时，新的移民与当地居民在南部沿海建立社区。墙上的胜利保住了法老的王国，却没有让从前的区域秩序复原。', ['source-uee-early-mid-20th-dynasty', 'source-yasur-landau-philistines'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-lba-sea-raiders', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-lba-egypt-core', sourceIds: ['source-uee-early-mid-20th-dynasty'] },
        { kind: 'entity', entityId: 'ugarit-kingdom', annotationId: 'annotation-lba-ugarit', sourceIds: ['source-yon-city-of-ugarit'] },
        { kind: 'entity', entityId: 'hittite-empire', annotationId: 'annotation-lba-hattusa', sourceIds: ['source-bryce-hittite-kingdom'] }
      ], caption: '圆点标出埃及核心与两个已经失去旧有宫殿秩序的北方中心；本图只作地点比较，不重建来敌路线。' } },
      sourceIds: ['source-uee-early-mid-20th-dynasty', 'source-yasur-landau-philistines', 'source-natural-earth']
    },

    {
      id: 'palaces-connect-kingdoms', title: '晚青铜时代的宫殿世界崩塌', eyebrow: '区域转折', timeSpan: timeSpan(-1250, -1100, '约公元前1250—前1100年', true), eventIds: ['event-hittite-central-kingdom-ends', 'event-ugarit-destruction', 'event-mycenaean-palaces-end', 'event-ramesses-iii-northern-invasions'],
      contentBlocks: [
        synthesis('palaces-connect-kingdoms-concept', '历史学家常把约公元前1200年前后，东地中海与近东许多王国经历的剧烈转折称为“晚青铜时代崩溃”。在此前数百年，赫梯、乌加里特、迈锡尼诸王国与埃及等地都由宫殿组织统治和生产。宫殿既是王室居所，也是政府、仓库、作坊和档案中心；书吏、工匠、贡赋与远方使者都在这里汇集。', ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-yon-city-of-ugarit']),
        synthesis('palaces-connect-kingdoms-change', '约从公元前十三世纪末开始，许多宫殿在几代人内被焚毁、废弃或失去原有功能。赫梯中央王国终结，乌加里特没有重建，爱琴海宫殿停止使用线形文字B，跨海贸易与诸王外交也遭受冲击。这场横跨多个地区的政治、经济和社会转折，就是本故事所说的“崩溃”。', ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-middleton-understanding-collapse'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-ugarit-throne-hall' },
      sourceIds: ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-middleton-understanding-collapse', 'source-yon-city-of-ugarit', 'source-wikimedia-ugarit-throne-hall']
    },
    {
      id: 'palaces-hattusa-silent', title: '哈图沙不再发出大王的命令', eyebrow: '赫梯中央王国终结', timeSpan: timeSpan(-1200, -1180, '约公元前1200—前1180年', true), eventIds: ['event-hittite-central-kingdom-ends'],
      contentBlocks: [fact('palaces-hattusa-silent-fact', '哈图沙是赫梯大王发出命令的首都。约在公元前十二世纪初，宫殿和公共建筑遭到破坏，中央王权从文献中消失。过去能调动安纳托利亚资源、控制叙利亚属国的大王，不再出现在诸王的往来中。', ['source-knapp-manning-crisis', 'source-bryce-hittite-kingdom'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-hittite-hattusa-ruins' },
      sourceIds: ['source-knapp-manning-crisis', 'source-bryce-hittite-kingdom', 'source-wikimedia-hattusa-ruins']
    },
    {
      id: 'palaces-ugarit-tablets-stop', title: '乌加里特的泥版停在倒塌房间里', eyebrow: '乌加里特毁灭', timeSpan: timeSpan(-1190, -1180, '约公元前1190—前1180年', true), eventIds: ['event-ugarit-destruction'],
      contentBlocks: [fact('palaces-ugarit-tablets-stop-fact', '乌加里特的宫殿曾保存账目、契约和外国来信。城市毁灭时，一批尚未归档的泥版留在倒塌房间中，其中还能听见统治者调兵、求援和担忧船只的声音。此后，这里没有恢复为原来的王宫与港口中心。', ['source-knapp-manning-crisis', 'source-yon-city-of-ugarit'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-ugarit-administrative-tablet' },
      sourceIds: ['source-knapp-manning-crisis', 'source-yon-city-of-ugarit', 'source-wikimedia-ugarit-admin-tablet']
    },
    {
      id: 'palaces-aegean-writing-stops', title: '爱琴海的宫殿也停止书写', eyebrow: '迈锡尼宫殿终结', timeSpan: timeSpan(-1200, -1180, '约公元前1200—前1180年', true), eventIds: ['event-mycenaean-palaces-end'],
      contentBlocks: [fact('palaces-aegean-writing-stops-fact', '爱琴海诸王的宫殿也以书吏和仓库管理土地、牲畜、工匠与军备。约在同一时期，多座宫殿被毁，原有的行政文字随之停用。人们继续居住在希腊各地，能集中调配大批资源的宫殿政府却没有重新建立。', ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-pylos-linear-b-tablet' },
      sourceIds: ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-wikimedia-pylos-linear-b-tablet']
    },
    {
      id: 'palaces-egypt-holds', title: '来敌抵达埃及，宫殿仍未熄灭', eyebrow: '埃及的不同结局', timeSpan: timeSpan(-1177, -1100, '约公元前1177—前1100年', true), eventIds: ['event-ramesses-iii-northern-invasions'],
      contentBlocks: [fact('palaces-egypt-holds-fact', '后来被合称为“海上民族”的来敌也抵达埃及。法老的军队在陆地和尼罗河口作战，王室把胜利刻上祭庙。埃及此后失去了部分对外控制，内部也承受压力，但法老、神庙和书吏组成的国家仍然延续。', ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-uee-early-mid-20th-dynasty'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-medinet-habu-naval-battle' },
      sourceIds: ['source-isac-medinet-habu-i', 'source-edgerton-wilson-ramesses-iii', 'source-uee-early-mid-20th-dynasty', 'source-wikimedia-medinet-habu-naval']
    },
    {
      id: 'palaces-archaeologists-causes', title: '考古学家寻找秩序崩溃的原因', eyebrow: '多种解释', timeSpan: timeSpan(-1250, -1100, '约公元前1250—前1100年', true), eventIds: ['event-hittite-central-kingdom-ends', 'event-ugarit-destruction', 'event-mycenaean-palaces-end', 'event-ramesses-iii-northern-invasions'],
      contentBlocks: [interpretation('palaces-archaeologists-causes-interpretation', '考古学家比较毁灭层、环境记录、最后一批书信和聚落变化，提出过旱灾、地震、战争、迁徙、内乱与贸易中断等解释。没有一种原因能说明所有地点。不同压力可能在不同地区相遇，又被彼此依赖的宫殿网络放大。', ['source-knapp-manning-crisis', 'source-middleton-understanding-collapse'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-lba-palace-centers', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-hattusa', sourceIds: ['source-bryce-hittite-kingdom'] },
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-ugarit', sourceIds: ['source-yon-city-of-ugarit'] },
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-pylos', sourceIds: ['source-deger-jalkotzy-aftermath'] },
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-egypt', sourceIds: ['source-uee-early-mid-20th-dynasty'] }
      ], caption: '四个圆点代表结局不同的证据组；它们没有连成单一传播路线，也不表示各地在同一年发生变化。' } },
      sourceIds: ['source-knapp-manning-crisis', 'source-middleton-understanding-collapse', 'source-natural-earth']
    },
    {
      id: 'palaces-life-reorganizes', title: '宫殿熄灭以后，生活仍在重组', eyebrow: '断裂与延续', timeSpan: timeSpan(-1180, -1050, '约公元前1180—前1050年', true), eventIds: ['event-aegean-localizes-after-palaces'],
      contentBlocks: [synthesis('palaces-life-reorganizes-synthesis', '国王的档案停止增长，长距离礼物减少，许多城市的人口也下降了。但农民、商人和手工业者仍在迁移、交换并建立新的社区。赫梯传统在较小政权中延续，埃及也保住王国。熄灭的是一种宫殿秩序，不是所有人的历史。', ['source-deger-jalkotzy-aftermath', 'source-middleton-understanding-collapse', 'source-bryce-neo-hittite-kingdoms', 'source-uee-early-mid-20th-dynasty'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-lba-palace-centers', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-hattusa', sourceIds: ['source-bryce-neo-hittite-kingdoms'] },
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-ugarit', sourceIds: ['source-yon-city-of-ugarit'] },
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-pylos', sourceIds: ['source-deger-jalkotzy-aftermath'] },
        { kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-egypt', sourceIds: ['source-uee-early-mid-20th-dynasty'] }
      ], caption: '圆点标出四个不同结局：中央宫殿终结、城市未复原、宫殿书写停止，以及埃及国家延续。' } },
      sourceIds: ['source-deger-jalkotzy-aftermath', 'source-middleton-understanding-collapse', 'source-bryce-neo-hittite-kingdoms', 'source-uee-early-mid-20th-dynasty', 'source-natural-earth']
    }
  ];

  const navigationOptions = [
    { id: 'nav-amarna-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-babylon-writes-assyria-grows' }, entry: { kind: 'targetScene' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入与法老通信的巴比伦王朝', description: '从法老收到的巴比伦来信出发，直接认识重新统治巴比伦尼亚并进入大国外交的加喜特王朝。' },
    { id: 'nav-collapse-mesopotamia', target: { cardId: 'mesopotamia-cities-outlast-dynasties', sceneId: 'mesopotamia-cities-do-not-go-dark' }, basis: { kind: 'relatedCard', cardId: 'mesopotamia-cities-outlast-dynasties' }, label: '进入没有一同熄灭的两河流域', description: '把赫梯、乌加里特和爱琴海的宫殿终结同巴比伦、亚述的收缩与延续放在一起比较。' },
    { id: 'nav-collapse-egypt-civilization', target: { cardId: 'ancient-egypt-gift-of-nile', sceneId: 'ancient-egypt-survives-palaces' }, basis: { kind: 'relatedCard', cardId: 'ancient-egypt-gift-of-nile' }, label: '进入尼罗河边的三千年', description: '从晚青铜时代各地宫殿的不同结局，转向埃及跨越王朝兴衰的更长历史。' },
    { id: 'nav-sea-egypt-civilization', target: { cardId: 'ancient-egypt-gift-of-nile', sceneId: 'ancient-egypt-survives-palaces' }, basis: { kind: 'relatedCard', cardId: 'ancient-egypt-gift-of-nile' }, label: '进入尼罗河边的三千年', description: '在古埃及文明延续与变化的完整时间尺度中理解法老墙上的危机。' },
    { id: 'nav-hittite-old-babylon', target: { cardId: 'old-babylonian-rise-and-fragmentation', sceneId: 'old-babylonian-fragmentation' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-hittite-old-babylon-raid' }, label: '进入巴比伦，看第一王朝的终点', description: '同一次远征在赫梯故事中显示扩张能力，在巴比伦故事中却结束了一个王朝。' },
    { id: 'nav-old-babylon-hittite', target: { cardId: 'hittite-syria-treaties', sceneId: 'hittite-hattusa-center' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-hittite-old-babylon-raid' }, label: '进入赫梯，看突袭者从哪里来', description: '从巴比伦第一王朝的终点，转向安纳托利亚新王国的形成与远征。' },
    { id: 'nav-hittite-ugarit', target: { cardId: 'ugarit-kings-trade', sceneId: 'ugarit-treaty-tribute' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-ugarit-hittite-vassal' }, label: '进入乌加里特，看条约下的地方王国', description: '从大王规定的义务，转向地方国王如何用宫殿、书吏和贸易维持自己的位置。' },
    { id: 'nav-ugarit-hittite', target: { cardId: 'hittite-syria-treaties', sceneId: 'hittite-kings-treaty' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-ugarit-hittite-vassal' }, label: '进入赫梯，看大王如何管理地方国王', description: '从乌加里特承担的贡赋和出兵义务，转向整个叙利亚条约体系。' },
    { id: 'nav-hittite-kadesh', target: { cardId: 'kadesh-did-not-end-war', sceneId: 'kadesh-two-powers-meet' }, basis: { kind: 'event', eventId: 'event-battle-of-kadesh' }, label: '进入卡迭石，看条约帝国走上战场', description: '从叙利亚的王族据点和地方盟友，继续看赫梯与埃及如何在卡迭石相遇。' },
    { id: 'nav-kadesh-hittite', target: { cardId: 'hittite-syria-treaties', sceneId: 'hittite-carchemish-supervision' }, basis: { kind: 'event', eventId: 'event-battle-of-kadesh' }, label: '进入赫梯，看战场背后的叙利亚体系', description: '卡迭石不只是一座城；它处在由王族驻地、地方王宫和条约连接的政治网络里。' },
    { id: 'nav-kadesh-egypt', target: { cardId: 'egypt-new-kingdom-overview', sceneId: 'egypt-new-kadesh' }, basis: { kind: 'event', eventId: 'event-battle-of-kadesh' }, label: '进入埃及，看法老如何讲述卡迭石', description: '从战役经过转向新王国的王权故事，理解拉美西斯为何反复刻写这场危机。' },
    { id: 'nav-egypt-kadesh-detail', target: { cardId: 'kadesh-did-not-end-war', sceneId: 'kadesh-false-message' }, basis: { kind: 'event', eventId: 'event-battle-of-kadesh' }, label: '进入卡迭石战场', description: '沿着错误情报、战车突袭和未被夺取的城池，重新分开战场脱险与战争结果。' },
    { id: 'nav-amarna-cuneiform', target: { cardId: 'cuneiform-overview', sceneId: 'cuneiform-many-languages' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-amarna-cuneiform' }, label: '进入楔形文字', description: '从外交泥版继续追问，一套起于城市管理的文字怎样被不同语言的宫廷共同使用。' },
    { id: 'nav-cuneiform-amarna', target: { cardId: 'amarna-kings-write-world', sceneId: 'amarna-shared-writing' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-amarna-cuneiform' }, label: '进入诸王的外交书信', description: '看楔形文字离开早期城市之后，怎样让远隔数月路程的国王继续交谈。' },
    { id: 'nav-amarna-egypt-new', target: { cardId: 'egypt-new-kingdom-overview', sceneId: 'egypt-new-amarna-letters' }, basis: { kind: 'relatedCard', cardId: 'egypt-new-kingdom-overview' }, label: '进入埃及新王国', description: '把法老收到的外国来信放回新王国的扩张、阿玛尔纳改革与拉美西斯时代中理解。' },
    { id: 'nav-egypt-new-amarna', target: { cardId: 'amarna-kings-write-world', sceneId: 'amarna-kings-brothers' }, basis: { kind: 'relatedCard', cardId: 'amarna-kings-write-world' }, label: '进入诸王的外交书信', description: '从新王国宫廷收到的来信出发，看大王、小国统治者、书吏与使者怎样共同维持外交。' },
    { id: 'nav-amarna-hittite', target: { cardId: 'hittite-syria-treaties', sceneId: 'hittite-kings-treaty' }, basis: { kind: 'relatedCard', cardId: 'hittite-syria-treaties' }, label: '进入赫梯的条约世界', description: '从大王之间的书信礼节，转向大王怎样把地方王国的义务固定在条约中。' },
    { id: 'nav-hittite-amarna', target: { cardId: 'amarna-kings-write-world', sceneId: 'amarna-kings-brothers' }, basis: { kind: 'relatedCard', cardId: 'amarna-kings-write-world' }, label: '进入诸王的外交书信', description: '从赫梯管理属国的条约，转向大国国王彼此称兄弟、送礼与议婚的另一层外交。' },
    { id: 'nav-amarna-ugarit', target: { cardId: 'ugarit-kings-trade', sceneId: 'ugarit-scribes-languages' }, basis: { kind: 'relatedCard', cardId: 'ugarit-kings-trade' }, label: '进入乌加里特的书吏世界', description: '看一个地方王国怎样在多种文字、宫殿账目和外国关系之间维持日常工作。' },
    { id: 'nav-ugarit-amarna', target: { cardId: 'amarna-kings-write-world', sceneId: 'amarna-small-kings-write' }, basis: { kind: 'relatedCard', cardId: 'amarna-kings-write-world' }, label: '进入小国写给法老的信', description: '从乌加里特书吏的工作，进入地方统治者如何借外交泥版求援并影响远方宫廷。' },
    { id: 'nav-amarna-collapse', target: { cardId: 'late-bronze-palaces-go-dark', sceneId: 'palaces-connect-kingdoms' }, basis: { kind: 'relatedCard', cardId: 'late-bronze-palaces-go-dark' }, label: '进入许多宫廷停止回信的时代', description: '从仍能传递书信、礼物和使者的诸王世界，转向宫殿、仓库与档案中心接连终结的区域危机。' },
    { id: 'nav-collapse-amarna', target: { cardId: 'amarna-kings-write-world', sceneId: 'amarna-palaces-stop-replying' }, basis: { kind: 'relatedCard', cardId: 'amarna-kings-write-world' }, label: '进入仍在通信的诸王世界', description: '在观察宫殿接连熄灭以前，先看书吏、使者和礼物怎样让这些远方中心保持联系。' },
    { id: 'nav-sea-ugarit', target: { cardId: 'ugarit-kings-trade', sceneId: 'ugarit-destruction-layer' }, basis: { kind: 'relatedCard', cardId: 'ugarit-kings-trade' }, label: '进入没有恢复的乌加里特', description: '从法老墙上的胜利，转向一座没有重新成为宫殿与港口中心的叙利亚城市。' },
    { id: 'nav-ugarit-sea', target: { cardId: 'medinet-habu-sea-raiders', sceneId: 'medinet-habu-temple-record' }, basis: { kind: 'relatedCard', cardId: 'medinet-habu-sea-raiders' }, label: '进入法老墙上的来敌', description: '从乌加里特最后的求援和毁灭层，查看埃及王室怎样记录同一时期的北方危机。' },
    { id: 'nav-sea-collapse', target: { cardId: 'late-bronze-palaces-go-dark', sceneId: 'palaces-egypt-holds' }, basis: { kind: 'event', eventId: 'event-ramesses-iii-northern-invasions' }, label: '进入宫殿体系的不同结局', description: '把埃及王室的胜利放回赫梯、乌加里特和爱琴海宫殿相继终结的区域变化中。' },
    { id: 'nav-collapse-sea', target: { cardId: 'medinet-habu-sea-raiders', sceneId: 'medinet-habu-delta-battle' }, basis: { kind: 'event', eventId: 'event-ramesses-iii-northern-invasions' }, label: '进入法老记录的海战', description: '从多地宫殿危机转向一组具体王室证据，看埃及如何描绘来敌并宣布胜利。' },
    { id: 'nav-sea-egypt', target: { cardId: 'egypt-new-kingdom-overview', sceneId: 'egypt-new-contraction' }, basis: { kind: 'relatedCard', cardId: 'egypt-new-kingdom-overview' }, label: '进入埃及新王国的收缩', description: '从祭庙墙上的胜利，继续看新王国怎样在延续中失去部分对外控制。' },
    { id: 'nav-egypt-sea', target: { cardId: 'medinet-habu-sea-raiders', sceneId: 'medinet-habu-king-order' }, basis: { kind: 'relatedCard', cardId: 'medinet-habu-sea-raiders' }, label: '进入拉美西斯三世的战争墙面', description: '从新王国晚期的压力，观察法老怎样把来敌和危机组织成恢复秩序的胜利图像。' },
    { id: 'nav-collapse-hittite', target: { cardId: 'hittite-syria-treaties', sceneId: 'hittite-network-ends' }, basis: { kind: 'event', eventId: 'event-hittite-central-kingdom-ends' }, label: '进入赫梯中央王国的终点', description: '从区域性宫殿危机，深入一套以大王、王族驻地和条约维持的政治网络。' },
    { id: 'nav-hittite-collapse', target: { cardId: 'late-bronze-palaces-go-dark', sceneId: 'palaces-hattusa-silent' }, basis: { kind: 'event', eventId: 'event-hittite-central-kingdom-ends' }, label: '进入宫殿接连熄灭的时代', description: '把哈图沙的终结放回乌加里特、爱琴海和埃及的不同经历中比较。' },
    { id: 'nav-collapse-ugarit', target: { cardId: 'ugarit-kings-trade', sceneId: 'ugarit-destruction-layer' }, basis: { kind: 'event', eventId: 'event-ugarit-destruction' }, label: '进入乌加里特最后的房间', description: '从区域变化深入港城档案，看尚未归档的泥版怎样停在毁灭层里。' },
    { id: 'nav-ugarit-collapse', target: { cardId: 'late-bronze-palaces-go-dark', sceneId: 'palaces-ugarit-tablets-stop' }, basis: { kind: 'event', eventId: 'event-ugarit-destruction' }, label: '进入宫殿体系的区域危机', description: '把乌加里特的毁灭与赫梯、爱琴海和仍然延续的埃及放在一起观察。' }
  ];

  const navigationPlacements = [
    { id: 'placement-amarna-mesopotamia-inline', navigationOptionId: 'nav-amarna-mesopotamia', owner: { kind: 'scene', sceneId: 'amarna-diplomacy-routine' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-collapse-mesopotamia-closing', navigationOptionId: 'nav-collapse-mesopotamia', owner: { kind: 'card', cardId: 'late-bronze-palaces-go-dark' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-collapse-egypt-civilization-inline', navigationOptionId: 'nav-collapse-egypt-civilization', owner: { kind: 'scene', sceneId: 'palaces-egypt-holds' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-sea-egypt-civilization-final', navigationOptionId: 'nav-sea-egypt-civilization', owner: { kind: 'scene', sceneId: 'medinet-habu-egypt-contracts' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-hittite-old-babylon-inline', navigationOptionId: 'nav-hittite-old-babylon', owner: { kind: 'scene', sceneId: 'hittite-hattusa-center' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-old-babylon-hittite-inline', navigationOptionId: 'nav-old-babylon-hittite', owner: { kind: 'scene', sceneId: 'old-babylonian-fragmentation' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-hittite-ugarit-inline', navigationOptionId: 'nav-hittite-ugarit', owner: { kind: 'scene', sceneId: 'hittite-kings-treaty' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-ugarit-hittite-inline', navigationOptionId: 'nav-ugarit-hittite', owner: { kind: 'scene', sceneId: 'ugarit-treaty-tribute' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-hittite-kadesh-inline', navigationOptionId: 'nav-hittite-kadesh', owner: { kind: 'scene', sceneId: 'hittite-carchemish-supervision' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-kadesh-hittite-inline', navigationOptionId: 'nav-kadesh-hittite', owner: { kind: 'scene', sceneId: 'kadesh-two-powers-meet' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-kadesh-egypt-inline', navigationOptionId: 'nav-kadesh-egypt', owner: { kind: 'scene', sceneId: 'kadesh-temple-victory' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-kadesh-detail-inline', navigationOptionId: 'nav-egypt-kadesh-detail', owner: { kind: 'scene', sceneId: 'egypt-new-kadesh' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-amarna-cuneiform-inline', navigationOptionId: 'nav-amarna-cuneiform', owner: { kind: 'scene', sceneId: 'amarna-shared-writing' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-cuneiform-amarna-inline', navigationOptionId: 'nav-cuneiform-amarna', owner: { kind: 'scene', sceneId: 'cuneiform-many-languages' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-amarna-egypt-new-inline', navigationOptionId: 'nav-amarna-egypt-new', owner: { kind: 'scene', sceneId: 'amarna-letters-remain' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-new-amarna-inline', navigationOptionId: 'nav-egypt-new-amarna', owner: { kind: 'scene', sceneId: 'egypt-new-amarna-letters' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-amarna-hittite-inline', navigationOptionId: 'nav-amarna-hittite', owner: { kind: 'scene', sceneId: 'amarna-kings-brothers' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-hittite-amarna-inline', navigationOptionId: 'nav-hittite-amarna', owner: { kind: 'scene', sceneId: 'hittite-kings-treaty' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-amarna-ugarit-inline', navigationOptionId: 'nav-amarna-ugarit', owner: { kind: 'scene', sceneId: 'amarna-small-kings-write' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-ugarit-amarna-inline', navigationOptionId: 'nav-ugarit-amarna', owner: { kind: 'scene', sceneId: 'ugarit-scribes-languages' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-amarna-collapse-inline', navigationOptionId: 'nav-amarna-collapse', owner: { kind: 'scene', sceneId: 'amarna-palaces-stop-replying' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-collapse-amarna-inline', navigationOptionId: 'nav-collapse-amarna', owner: { kind: 'scene', sceneId: 'palaces-connect-kingdoms' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-sea-ugarit-inline', navigationOptionId: 'nav-sea-ugarit', owner: { kind: 'scene', sceneId: 'medinet-habu-egypt-contracts' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-ugarit-sea-inline', navigationOptionId: 'nav-ugarit-sea', owner: { kind: 'scene', sceneId: 'ugarit-destruction-layer' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-sea-collapse-closing', navigationOptionId: 'nav-sea-collapse', owner: { kind: 'card', cardId: 'medinet-habu-sea-raiders' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-collapse-sea-inline', navigationOptionId: 'nav-collapse-sea', owner: { kind: 'scene', sceneId: 'palaces-egypt-holds' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-sea-egypt-inline', navigationOptionId: 'nav-sea-egypt', owner: { kind: 'scene', sceneId: 'medinet-habu-temple-record' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-sea-inline', navigationOptionId: 'nav-egypt-sea', owner: { kind: 'scene', sceneId: 'egypt-new-contraction' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-collapse-hittite-inline', navigationOptionId: 'nav-collapse-hittite', owner: { kind: 'scene', sceneId: 'palaces-hattusa-silent' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-hittite-collapse-inline', navigationOptionId: 'nav-hittite-collapse', owner: { kind: 'scene', sceneId: 'hittite-network-ends' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-collapse-ugarit-inline', navigationOptionId: 'nav-collapse-ugarit', owner: { kind: 'scene', sceneId: 'palaces-ugarit-tablets-stop' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-ugarit-collapse-inline', navigationOptionId: 'nav-ugarit-collapse', owner: { kind: 'scene', sceneId: 'ugarit-destruction-layer' }, slot: 'inline', rank: 2, visible: true, interactive: true }
  ];

  const cameraPresets = [
    { id: 'camera-lba-hittite-syria', center: [35.5, 36.4], scale: 4.2 },
    { id: 'camera-lba-ugarit-connections', center: [34.5, 35.4], scale: 10.0 },
    { id: 'camera-lba-kadesh-powers', center: [34.0, 31.5], scale: 3.1 },
    { id: 'camera-lba-amarna-diplomacy', center: [32.0, 33.5], scale: 3.0 },
    { id: 'camera-lba-amarna-full-diplomacy', center: [36.0, 34.0], scale: 8.0 },
    { id: 'camera-lba-sea-raiders', center: [33.0, 32.5], scale: 3.0 },
    { id: 'camera-lba-palace-centers', center: [29.5, 34.0], scale: 2.7 }
  ];

  const geometries = [
    {
      id: 'geometry-lba-hittite-syria',
      geometry: { type: 'MultiLineString', coordinates: [[[34.62, 40.02], [37.16, 36.2]], [[34.62, 40.02], [38.01, 36.83]], [[38.01, 36.83], [35.78, 35.6]]] },
      timeSpan: timeSpan(-1350, -1200, '约公元前1350—前1200年', true), approximate: true,
      label: '哈图沙、阿勒颇、卡尔凯美什与乌加里特之间的教学联系',
      sourceIds: ['source-bryce-hittite-kingdom', 'source-met-ugarit', 'source-natural-earth']
    },
    {
      id: 'geometry-lba-ugarit-connections',
      geometry: { type: 'MultiLineString', coordinates: [[[35.78, 35.6], [35.77, 35.62]], [[35.78, 35.6], [33.2, 35.1]], [[35.78, 35.6], [36.3, 35.1]]] },
      timeSpan: timeSpan(-1450, -1200, '约公元前1450—前1200年', true), approximate: true,
      label: '乌加里特王城、港口、塞浦路斯方向与叙利亚内陆的教学联系',
      sourceIds: ['source-yon-city-of-ugarit', 'source-french-ugarit-exchange', 'source-met-ugarit', 'source-natural-earth']
    },
    {
      id: 'geometry-lba-kadesh-powers',
      geometry: { type: 'MultiLineString', coordinates: [[[31.2, 30.0], [36.5, 34.56]], [[34.62, 40.02], [36.5, 34.56]]] },
      timeSpan: timeSpan(-1274, -1258, '约公元前1274—前1258年', true), approximate: true,
      label: '埃及、赫梯与卡迭石的教学联系',
      sourceIds: ['source-bm-kadesh-sallier', 'source-bryce-hittite-kingdom', 'source-hayes-scepter-ii', 'source-natural-earth']
    },
    {
      id: 'geometry-lba-amarna-great-kings',
      geometry: { type: 'LineString', coordinates: [[27.65, 27.65], [34.62, 40.02]] },
      timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), approximate: true,
      label: '阿玛尔纳与哈图沙之间的大王外交教学联系',
      sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters', 'source-natural-earth']
    },
    {
      id: 'geometry-lba-amarna-diplomacy',
      geometry: { type: 'MultiLineString', coordinates: [
        [[27.65, 27.65], [34.62, 40.02]],
        [[27.65, 27.65], [35.78, 35.6]],
        [[27.65, 27.65], [44.42, 32.54]],
        [[27.65, 27.65], [43.25, 35.46]],
        [[27.65, 27.65], [40.0, 37.0]],
        [[27.65, 27.65], [33.2, 35.1]]
      ] },
      timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), approximate: true,
      label: '阿玛尔纳与赫梯、乌加里特、巴比伦、亚述、米坦尼和阿拉西亚的外交教学联系',
      sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters', 'source-natural-earth']
    },
    {
      id: 'geometry-lba-sea-raiders-sites',
      geometry: { type: 'MultiPoint', coordinates: [[31.2, 30.0], [35.78, 35.6], [34.62, 40.02]] },
      timeSpan: timeSpan(-1200, -1100, '约公元前1200—前1100年', true), approximate: true,
      label: '埃及核心、乌加里特与哈图沙的比较地点',
      sourceIds: ['source-uee-early-mid-20th-dynasty', 'source-yon-city-of-ugarit', 'source-bryce-hittite-kingdom', 'source-natural-earth']
    },
    {
      id: 'geometry-lba-palace-centers',
      geometry: { type: 'MultiPoint', coordinates: [[34.62, 40.02], [35.78, 35.6], [21.7, 37.03], [31.2, 30.0]] },
      timeSpan: timeSpan(-1250, -1050, '约公元前1250—前1050年', true), approximate: true,
      label: '哈图沙、乌加里特、皮洛斯与埃及的宫殿体系证据组',
      sourceIds: ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-uee-early-mid-20th-dynasty', 'source-natural-earth']
    }
  ];

  const mapStates = [
    { id: 'map-lba-hittite-syria', cameraPresetId: 'camera-lba-hittite-syria', layers: [{ kind: 'geometry', geometryId: 'geometry-lba-hittite-syria', timeSpan: timeSpan(-1350, -1200, '约公元前1350—前1200年', true), sourceIds: ['source-bryce-hittite-kingdom', 'source-met-ugarit', 'source-natural-earth'] }] },
    { id: 'map-lba-ugarit-connections', cameraPresetId: 'camera-lba-ugarit-connections', layers: [{ kind: 'geometry', geometryId: 'geometry-lba-ugarit-connections', timeSpan: timeSpan(-1450, -1200, '约公元前1450—前1200年', true), sourceIds: ['source-yon-city-of-ugarit', 'source-french-ugarit-exchange', 'source-met-ugarit', 'source-natural-earth'] }] },
    { id: 'map-lba-kadesh-powers', cameraPresetId: 'camera-lba-kadesh-powers', layers: [{ kind: 'geometry', geometryId: 'geometry-lba-kadesh-powers', timeSpan: timeSpan(-1274, -1258, '约公元前1274—前1258年', true), sourceIds: ['source-bm-kadesh-sallier', 'source-bryce-hittite-kingdom', 'source-hayes-scepter-ii', 'source-natural-earth'] }] },
    { id: 'map-lba-amarna-great-kings', cameraPresetId: 'camera-lba-amarna-diplomacy', layers: [{ kind: 'geometry', geometryId: 'geometry-lba-amarna-great-kings', timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters', 'source-natural-earth'] }] },
    { id: 'map-lba-amarna-diplomacy', cameraPresetId: 'camera-lba-amarna-full-diplomacy', layers: [{ kind: 'geometry', geometryId: 'geometry-lba-amarna-diplomacy', timeSpan: timeSpan(-1360, -1330, '约公元前1360—前1330年', true), sourceIds: ['source-met-amarna-letters', 'source-moran-amarna-letters', 'source-natural-earth'] }] },
    { id: 'map-lba-sea-raiders', cameraPresetId: 'camera-lba-sea-raiders', layers: [{ kind: 'geometry', geometryId: 'geometry-lba-sea-raiders-sites', timeSpan: timeSpan(-1200, -1100, '约公元前1200—前1100年', true), sourceIds: ['source-uee-early-mid-20th-dynasty', 'source-yon-city-of-ugarit', 'source-bryce-hittite-kingdom', 'source-natural-earth'] }] },
    { id: 'map-lba-palace-centers', cameraPresetId: 'camera-lba-palace-centers', layers: [{ kind: 'geometry', geometryId: 'geometry-lba-palace-centers', timeSpan: timeSpan(-1250, -1050, '约公元前1250—前1050年', true), sourceIds: ['source-knapp-manning-crisis', 'source-deger-jalkotzy-aftermath', 'source-uee-early-mid-20th-dynasty', 'source-natural-earth'] }] }
  ];

  function associatedAnnotation(
    id: string,
    subjectKind: string,
    subjectIdKey: string,
    subjectId: string,
    coordinates: readonly number[],
    sourceIds: SourceIds,
    placement: string,
    label: string
  ): ContentRecord {
    return { id, subject: { kind: subjectKind, [subjectIdKey]: subjectId }, anchor: { kind: 'geo', coordinates }, anchorMeaning: 'associatedWith', approximate: true, sourceIds, placement, label };
  }

  const mapAnnotations = [
    associatedAnnotation('annotation-lba-hattusa', 'entity', 'entityId', 'hittite-empire', [34.62, 40.02], ['source-unesco-hattusha'], 'left', '哈图沙（赫梯首都）'),
    associatedAnnotation('annotation-lba-aleppo', 'entity', 'entityId', 'hittite-empire', [37.16, 36.2], ['source-bryce-hittite-kingdom'], 'left', '阿勒颇（王族支点）'),
    associatedAnnotation('annotation-lba-carchemish', 'entity', 'entityId', 'hittite-empire', [38.01, 36.83], ['source-bryce-hittite-kingdom'], 'right', '卡尔凯美什（区域王族驻地）'),
    associatedAnnotation('annotation-lba-ugarit', 'entity', 'entityId', 'ugarit-kingdom', [35.78, 35.6], ['source-met-ugarit'], 'left', '乌加里特（地方王国）'),
    associatedAnnotation('annotation-lba-ugarit-city', 'entity', 'entityId', 'ugarit-kingdom', [35.78, 35.6], ['source-yon-city-of-ugarit'], 'right', '乌加里特王城'),
    associatedAnnotation('annotation-lba-ugarit-port', 'entity', 'entityId', 'ugarit-kingdom', [35.75, 35.61], ['source-french-ugarit-exchange'], 'below', '近海港口'),
    associatedAnnotation('annotation-lba-cyprus-link', 'entity', 'entityId', 'ugarit-kingdom', [33.2, 35.1], ['source-met-ugarit'], 'left', '塞浦路斯方向'),
    associatedAnnotation('annotation-lba-egypt-core', 'entity', 'entityId', 'egypt-new-kingdom', [31.2, 30.0], ['source-hayes-scepter-ii'], 'left', '埃及尼罗河谷核心'),
    associatedAnnotation('annotation-lba-hattusa-kadesh', 'entity', 'entityId', 'hittite-empire', [34.62, 40.02], ['source-bryce-hittite-kingdom'], 'right', '哈图沙（赫梯首都）'),
    associatedAnnotation('annotation-lba-kadesh', 'entity', 'entityId', 'battle-of-kadesh-war', [36.5, 34.56], ['source-bm-kadesh-sallier'], 'right', '卡迭石'),
    associatedAnnotation('annotation-lba-syria-hittite', 'entity', 'entityId', 'hittite-empire', [36.8, 35.4], ['source-bryce-hittite-kingdom'], 'right', '赫梯主导的叙利亚网络'),
    associatedAnnotation('annotation-lba-amarna-egypt', 'entity', 'entityId', 'amarna-letters-corpus', [27.65, 27.65], ['source-met-amarna-letters'], 'left', '阿玛尔纳（书信保存地）'),
    associatedAnnotation('annotation-lba-amarna-hattusa', 'entity', 'entityId', 'amarna-letters-corpus', [34.62, 40.02], ['source-met-amarna-letters'], 'above', '哈图沙（赫梯宫廷）'),
    associatedAnnotation('annotation-lba-amarna-ugarit', 'entity', 'entityId', 'amarna-letters-corpus', [35.78, 35.6], ['source-moran-amarna-letters'], 'right', '叙利亚海岸小国方向'),
    associatedAnnotation('annotation-lba-amarna-babylon', 'entity', 'entityId', 'amarna-letters-corpus', [44.42, 32.54], ['source-moran-amarna-letters'], 'left', '巴比伦宫廷'),
    associatedAnnotation('annotation-lba-amarna-assur', 'entity', 'entityId', 'amarna-letters-corpus', [43.25, 35.46], ['source-moran-amarna-letters'], 'right', '阿淑尔城（亚述宫廷）'),
    associatedAnnotation('annotation-lba-amarna-mitanni', 'entity', 'entityId', 'amarna-letters-corpus', [40.0, 37.0], ['source-moran-amarna-letters'], 'below', '米坦尼核心区域'),
    associatedAnnotation('annotation-lba-amarna-alashiya', 'entity', 'entityId', 'amarna-letters-corpus', [33.2, 35.1], ['source-moran-amarna-letters'], 'left', '塞浦路斯方向（阿拉西亚）'),
    associatedAnnotation('annotation-lba-collapse-hattusa', 'entity', 'entityId', 'late-bronze-palace-system', [34.62, 40.02], ['source-bryce-hittite-kingdom'], 'right', '哈图沙（中央王国终结）'),
    associatedAnnotation('annotation-lba-collapse-ugarit', 'entity', 'entityId', 'late-bronze-palace-system', [35.78, 35.6], ['source-yon-city-of-ugarit'], 'right', '乌加里特（宫殿城市未复原）'),
    associatedAnnotation('annotation-lba-collapse-pylos', 'entity', 'entityId', 'late-bronze-palace-system', [21.7, 37.03], ['source-deger-jalkotzy-aftermath'], 'left', '皮洛斯（宫殿书写停止）'),
    associatedAnnotation('annotation-lba-collapse-egypt', 'entity', 'entityId', 'late-bronze-palace-system', [31.2, 30.0], ['source-uee-early-mid-20th-dynasty'], 'left', '埃及核心（国家延续）')
  ];

  const assets = [
    { id: 'asset-lba-hittite-hattusa-wall', type: 'image', src: 'assets/images/late-bronze-age/hittite-hattusa-wall.webp', title: '哈图沙城墙的现代考古复原', alt: '安纳托利亚高原上以土坯和石基复原的一段赫梯城墙，城门和方形塔楼沿城墙排列。', sourceIds: ['source-wikimedia-hattusa-wall'] },
    { id: 'asset-lba-hittite-inandik-vase', type: 'image', src: 'assets/images/late-bronze-age/hittite-inandik-vase.webp', title: '伊南德克浮雕陶器；它呈现早期赫梯的宫廷祭仪，而非王位冲突本身', alt: '一件大型红褐色四耳陶器，器身分层排列立体人物、乐师、祭仪与动物图像；它为理解早期赫梯的王权仪式提供同时代视觉参照。', sourceIds: ['source-wikimedia-inandik-vase'] },
    { id: 'asset-lba-hittite-aleppo-treaty', type: 'image', src: 'assets/images/late-bronze-age/hittite-aleppo-treaty.webp', title: '赫梯大王与阿勒颇国王的条约泥版', alt: '一块竖长形浅褐色泥版，正面写满阿卡德语楔形文字，是赫梯管理叙利亚地方王国的条约实例。', sourceIds: ['source-wikimedia-aleppo-treaty'] },
    { id: 'asset-lba-hittite-hattusa-ruins', type: 'image', src: 'assets/images/late-bronze-age/hittite-hattusa-ruins.webp', title: '哈图沙遗址中的比于卡亚区域', alt: '哈图沙高地遗址的石墙基础和起伏地面，远处是安纳托利亚高原的山地。', sourceIds: ['source-wikimedia-hattusa-ruins'] },
    { id: 'asset-lba-ugarit-palace', type: 'image', src: 'assets/images/late-bronze-age/ugarit-royal-palace.webp', title: '乌加里特王宫遗址', alt: '乌加里特王宫遗址中成排的浅色石墙基础和房间轮廓，背景可见叙利亚海岸地区的植被。', sourceIds: ['source-wikimedia-ugarit-palace'] },
    { id: 'asset-lba-ugarit-law-tablet', type: 'image', src: 'assets/images/late-bronze-age/ugarit-royal-law-tablet.webp', title: '乌加里特国王尼克美帕的阿卡德语法律泥版', alt: '一块竖长形灰褐色泥版布满楔形文字，下部压印有王朝印章，显示王宫以书面文件处理权利。', sourceIds: ['source-wikimedia-ugarit-law-tablet'] },
    { id: 'asset-lba-ugarit-uluburun-reconstruction', type: 'image', src: 'assets/images/late-bronze-age/ugarit-uluburun-reconstruction.webp', title: '乌鲁布伦沉船与货舱复原；它展示同一贸易世界，并非乌加里特船只的复原', alt: '博物馆中的晚青铜时代商船剖面复原，甲板上有人物，船舱内密集堆放铜锭、陶罐和其他货物，表现海运货物如何共同装载。', sourceIds: ['source-wikimedia-uluburun-reconstruction'] },
    { id: 'asset-lba-ugarit-administrative-tablet', type: 'image', src: 'assets/images/late-bronze-age/ugarit-administrative-tablet.webp', title: '乌加里特语行政泥版', alt: '一块不规则浅褐色泥版的正面照片，泥面排列着使用字母楔形文字书写的行政记录。', sourceIds: ['source-wikimedia-ugarit-admin-tablet'] },
    { id: 'asset-lba-pylos-linear-b-tablet', type: 'image', src: 'assets/images/late-bronze-age/pylos-linear-b-tablet.webp', title: '皮洛斯宫殿的线形文字B泥版', alt: '一块横长的浅褐色泥版由数块残片拼合，表面分行刻写线形文字B；它记录牛、猪和鹿皮如何分配给制鞋与制鞍工匠，并因毁灭宫殿的火灾被烘硬保存。', sourceIds: ['source-wikimedia-pylos-linear-b-tablet'] },
    { id: 'asset-lba-ugarit-throne-hall', type: 'image', src: 'assets/images/late-bronze-age/ugarit-palace-throne-hall.webp', title: '乌加里特王宫的王座大厅', alt: '乌加里特王宫遗址中一间由高大石墙围合的大厅，右侧现场标牌写有“王座大厅”；它让王宫作为统治空间的实体尺度清晰可见。', sourceIds: ['source-wikimedia-ugarit-throne-hall'] },
    { id: 'asset-lba-kadesh-spies-relief', type: 'image', src: 'assets/images/late-bronze-age/kadesh-spies-relief.webp', title: '埃及浮雕中的被俘侦察人员', alt: '黑白浮雕画面中，埃及士兵控制并审问跪坐的人物；这一场面属于埃及王室对卡迭石战役的叙事。', sourceIds: ['source-wikimedia-kadesh-spies'] },
    { id: 'asset-lba-kadesh-surprise-map', type: 'image', src: 'assets/images/late-bronze-age/kadesh-surprise-attack.webp', title: '卡迭石战车突袭英语教学图', alt: '英语教学地图以箭头表示赫梯战车渡过奥伦特河、冲击拉神军团与埃及营地，并标出仍在南方行进的埃及部队；位置与路线均为现代重建。', sourceIds: ['source-wikimedia-kadesh-attack-map', 'source-spalinger-war-egypt'] },
    { id: 'asset-lba-kadesh-ramesses-relief', type: 'image', src: 'assets/images/late-bronze-age/kadesh-ramesses-relief.webp', title: '阿布辛贝神庙中的卡迭石浮雕', alt: '石墙浮雕表现拉美西斯二世乘战车迎战敌军；画面把法老置于战斗中心，是埃及王室塑造胜利记忆的一部分。', sourceIds: ['source-wikimedia-kadesh-relief'] },
    { id: 'asset-lba-kadesh-treaty-tablet', type: 'image', src: 'assets/images/late-bronze-age/kadesh-treaty-tablet.webp', title: '埃及—赫梯条约的赫梯文泥版残片', alt: '伊斯坦布尔考古博物馆收藏的褐色楔形文字泥版残片，是埃及与赫梯条约的赫梯文版本之一。', sourceIds: ['source-wikimedia-kadesh-treaty'] },
    { id: 'asset-lba-amarna-mail-carrier', type: 'image', src: 'assets/images/late-bronze-age/amarna-mail-carrier-1915.webp', title: '1915年书籍中的古埃及信使插图', alt: '1915年百科全书依据底比斯古画刊出的黑白线描：一名短发人物手持卷状物走向坐在柱廊中的官员；这是较早时期的后世插图，并非阿玛尔纳使者的现场记录。', sourceIds: ['source-runeberg-egypt-mail-carrier'] },
    { id: 'asset-lba-amarna-four-foreign-rulers', type: 'image', src: 'assets/images/late-bronze-age/amarna-four-foreign-rulers.webp', title: '《四位外国统治者》新王国墓画摹本', alt: 'Norman de Garis Davies于1915年制作的蛋彩摹本，四位不同服饰的外国统治者面向埃及铭文与礼物；原画比阿玛尔纳时代更早，作为埃及宫廷表现外国统治者的参照。', sourceIds: ['source-met-four-foreign-rulers'] },
    { id: 'asset-lba-amarna-tushratta-marriage-letter', type: 'image', src: 'assets/images/late-bronze-age/amarna-tushratta-marriage-letter.webp', title: '图什拉塔讨论王室婚姻与黄金的长信', alt: '一块高而宽的深褐色泥版布满密集楔形文字，并由横线分段；米坦尼国王图什拉塔在信中与阿蒙霍特普三世讨论王室婚姻、礼物和黄金。', sourceIds: ['source-wikimedia-tushratta-marriage-letter'] },
    { id: 'asset-lba-medinet-habu-temple', type: 'image', src: 'assets/images/late-bronze-age/medinet-habu-temple.webp', title: '麦迪奈特哈布的拉美西斯三世祭庙', alt: '蓝天下的麦迪奈特哈布祭庙入口与高墙，墙面覆盖巨大的埃及浮雕和铭文。', sourceIds: ['source-wikimedia-medinet-habu-temple'] },
    { id: 'asset-lba-medinet-habu-naval-battle', type: 'image', src: 'assets/images/late-bronze-age/medinet-habu-naval-battle.webp', title: '麦迪奈特哈布墙面上的尼罗河口海战', alt: '十九世纪照片记录的埃及浮雕细节，战船、弓箭手、落水者和倒伏人物密集交错。', sourceIds: ['source-wikimedia-medinet-habu-naval'] },
    { id: 'asset-lba-medinet-habu-ox-carts', type: 'image', src: 'assets/images/late-bronze-age/medinet-habu-ox-carts.webp', title: '麦迪奈特哈布图版中的牛车与战士细节', alt: '芝加哥大学考古调查的整页黑白图版，上半左侧记录牛车细节，其他三格记录埃及和北方来敌的战士。', sourceIds: ['source-isac-medinet-habu-i', 'source-wikimedia-medinet-habu-land-battle'] }
  ];

  export const lateBronzeAgeData = {
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
  } satisfies ContentModule;

const root = (typeof window !== 'undefined' ? window : globalThis) as typeof globalThis & {
  ATLAS_V5_LATE_BRONZE_AGE?: ContentModule;
};

root.ATLAS_V5_LATE_BRONZE_AGE = lateBronzeAgeData;
