import type {
  ContentModule,
  ContentModuleCollectionMap,
  EditorialReview,
  HistoricalFactClaim,
  InterpretationClaim,
  LabeledTimeSpan,
  LimitationClaim,
  MapAnnotation,
  Position,
  ScreenPlacement,
  TextClaim
} from '../src/types/runtime.ts';

type SourceIds = readonly string[];
type Collection<Name extends keyof ContentModuleCollectionMap> = ContentModuleCollectionMap[Name];

  function timeSpan(start: number, end: number, label: string, approximate = false): LabeledTimeSpan {
    const value: { start: number; end: number; label: string; approximate?: true } = { start, end, label };
    if (approximate) value.approximate = true;
    return value;
  }

  function fact(id: string, text: string, sourceIds: SourceIds): HistoricalFactClaim {
    return { id, kind: 'historicalFact', text, sourceIds };
  }

  function interpretation(id: string, text: string, sourceIds: SourceIds): InterpretationClaim {
    return { id, kind: 'interpretation', text, sourceIds };
  }

  function synthesis(id: string, text: string, sourceIds: SourceIds): TextClaim {
    return { id, kind: 'editorialSynthesis', text, sourceIds };
  }

  function limitation(id: string, text: string, sourceIds: SourceIds): LimitationClaim {
    return { id, kind: 'limitation', text, sourceIds };
  }

  function review(
    limitations: readonly LimitationClaim[],
    uncertainties: readonly InterpretationClaim[],
    alternatives: readonly InterpretationClaim[],
    sourceIds: SourceIds
  ): EditorialReview {
    return {
      limitations: limitations || [],
      counterexamples: [],
      uncertainties: uncertainties || [],
      alternativeExplanations: alternatives || [],
      sourceIds
    };
  }

  const sources: Collection<'sources'> = [
    { id: 'source-ucl-narmer', title: 'Narmer', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/narmer.html' },
    { id: 'source-met-telling-time-egypt', title: 'Telling Time in Ancient Egypt', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/telling-time-in-ancient-egypt' },
    { id: 'source-met-egypt-1000-1', title: 'Egypt, 1000 B.C.–1 A.D.', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/toah/ht/04/afe.html' },
    { id: 'source-met-old-kingdom', title: 'Egypt in the Old Kingdom', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/egypt-in-the-old-kingdom-ca-2649-2130-b-c' },
    { id: 'source-met-ancient-egypt-art', title: 'The Art of Ancient Egypt: A Resource for Educators', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/-/media/files/learn/for-educators/publications-for-educators/the-art-of-ancient-egypt.pdf' },
    { id: 'source-arnold-pyramids', title: 'When the Pyramids Were Built: Egyptian Art of the Old Kingdom', author: 'Dorothea Arnold', year: 1999, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/met-publications/when-the-pyramids-were-built-egyptian-art-of-the-old-kingdom' },
    { id: 'source-wikimedia-giza-pyramids', title: 'Giza pyramids photograph, CC0', author: 'Gary Todd', year: 2013, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Giza_Pyramids_of_Khufu,_Khafre_%26_Menkaure_(9793903476).jpg' },
    { id: 'source-wikimedia-unas-pyramid-texts', title: 'Unas pyramid texts historical photograph, public domain', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Unas_Pyramidentexte.jpg' },
    { id: 'source-met-sahure-statue', title: 'King Sahure Accompanied by a Divine Figure', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/543882' },
    { id: 'source-met-mitry-statue', title: 'Statue of Mitry', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/543872' },
    { id: 'source-muller-old-kingdom-end', title: 'The End of the Old Kingdom', author: 'Renate Müller-Wollermann', publisher: 'UCLA Encyclopedia of Egyptology', url: 'https://escholarship.org/uc/item/2ns3652b' },
    { id: 'source-ucl-middle-kingdom', title: 'Middle Kingdom', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/mk/index.html' },
    { id: 'source-met-middle-kingdom', title: 'Egypt in the Middle Kingdom (ca. 2030–1650 B.C.)', author: 'Adela Oppenheim', year: 2019, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/egypt-in-the-middle-kingdom-2030-1640-b-c' },
    { id: 'source-ucl-mentuhotep-ii', title: 'Mentuhotep II', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/mentuhotepII.html' },
    { id: 'source-ucl-middle-kingdom-art', title: 'Middle Kingdom Art', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/art/mk.html' },
    { id: 'source-met-senwosret-iii', title: 'Face of Senwosret III', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/544184' },
    { id: 'source-ucl-sinuhe', title: 'The Story of Sinuhe', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/literature/sinuhe.html' },
    { id: 'source-bm-sinuhe-literature', title: 'Page turners: literature in ancient Egypt', author: 'Ilona Regulski', year: 2023, publisher: 'The British Museum', url: 'https://www.britishmuseum.org/blog/page-turners-literature-ancient-egypt' },
    { id: 'source-bm-sinuhe-ostracon', title: 'Ostracon of the Tale of Sinuhe (EA5629)', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/collection/object/Y_EA5629' },
    { id: 'source-wikimedia-sinuhe-papyrus', title: 'Sinuhe Papyrus facsimile, public domain', author: 'Georg Möller', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Sinuhe-Papyrus_(Papyrus_Berlin_3022).jpg' },
    { id: 'source-ucl-nubia-middle-kingdom', title: 'Middle Kingdom Egypt and Nubia', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/nubia/mk.html' },
    { id: 'source-ucl-buhen-middle-kingdom', title: 'Buhen in the Middle Kingdom', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/buhen/mk.html' },
    { id: 'source-ucl-second-intermediate', title: 'Second Intermediate Period', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/2interkings/index.html' },
    { id: 'source-uee-second-intermediate', title: 'Second Intermediate Period', author: 'Alexander Ilin-Tomich', year: 2016, publisher: 'UCLA Encyclopedia of Egyptology', url: 'https://escholarship.org/uc/item/72q561r2' },
    { id: 'source-ucl-ahmose', title: 'Ahmose', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/ahmose.html' },
    { id: 'source-met-new-kingdom', title: 'Egypt in the New Kingdom', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/egypt-in-the-new-kingdom-ca-1550-1070-b-c' },
    { id: 'source-ucl-nubia-new-kingdom', title: 'Nubia in the New Kingdom', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/nubia/nk.html' },
    { id: 'source-met-hatshepsut', title: 'Seated Statue of Hatshepsut', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/544450' },
    { id: 'source-met-hatshepsut-exhibition', title: 'Hatshepsut: From Queen to Pharaoh', year: 2006, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/exhibitions/listings/2006/hatshepsut' },
    { id: 'source-met-hatshepsut-female-pharaoh', title: 'The Female Pharaoh Hatshepsut', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/544849' },
    { id: 'source-ucl-sobeknofru', title: 'Sobeknofru', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/sobeknofru.html' },
    { id: 'source-met-amarna-letters', title: 'The Amarna Letters', author: 'Elizabeth Knott', year: 2016, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/the-amarna-letters' },
    { id: 'source-met-amarna-letter-object', title: 'Royal Letter from Ashur-uballit to the King of Egypt', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/544695' },
    { id: 'source-met-akhenaten-duck', title: 'Akhenaten Sacrificing a Duck', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/544056' },
    { id: 'source-met-akhenaten-city', title: 'Art, Architecture, and the City in the Reign of Amenhotep IV / Akhenaten', author: 'Marsha Hill', year: 2014, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/art-architecture-and-the-city-in-the-reign-of-amenhotep-iv-akhenaten-ca-13531336-b-c' },
    { id: 'source-smb-nefertiti', title: 'Bust of Nefertiti', publisher: 'Staatliche Museen zu Berlin', url: 'https://www.smb.museum/en/museums-institutions/aegyptisches-museum-und-papyrussammlung/collection-research/bust-of-nefertiti/' },
    { id: 'source-smb-nefertiti-image-cc-by-sa', title: 'Bust of Queen Nefertiti, Sandra Steiß photograph (CC BY-SA 4.0)', author: 'Sandra Steiß', publisher: 'Staatliche Museen zu Berlin', url: 'https://search.smb.museum/object/obj-606189' },
    { id: 'source-ucl-tutankhamun', title: 'Tutankhamun', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/tutankhamun.html' },
    { id: 'source-met-amun-head', title: 'Head of the God Amun', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/544780' },
    { id: 'source-hayes-scepter-ii', title: 'The Scepter of Egypt, Volume II', author: 'William C. Hayes', year: 1959, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/met-publications/the-scepter-of-egypt-vol-2-the-hyksos-period-and-the-new-kingdom-1675-1080-bc' },
    { id: 'source-wikimedia-abu-simbel', title: 'Abu Simbel historical photograph, no known copyright restrictions', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:S10.08_Abu_Simbel,_image_9930.jpg' },
    { id: 'source-bm-kadesh-sallier', title: 'Papyrus Sallier III and the Battle of Kadesh', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/collection/object/Y_EA10181' },
    { id: 'source-un-egypt-hatti-treaty', title: 'Treaty of Kadesh replica and historical note', publisher: 'United Nations', url: 'https://www.un.org/ungifts/treaty-kadesh' },
    { id: 'source-grandet-ramesses-iii', title: 'The Medinet Habu Records of the Foreign Wars of Ramesses III', author: 'Pierre Grandet', publisher: 'Oriental Institute of the University of Chicago', url: 'https://isac.uchicago.edu/research/publications/oip/medinet-habu-records-foreign-wars-ramesses-iii' },
    { id: 'source-turin-strike-papyrus', title: 'Strike Papyrus', publisher: 'Museo Egizio', url: 'https://collezioni.museoegizio.it/en-GB/material/Cat_1880' },
    { id: 'source-uee-early-mid-20th-dynasty', title: 'Early to Mid-20th Dynasty', author: 'Pierre Grandet', year: 2014, publisher: 'UCLA Encyclopedia of Egyptology', url: 'https://escholarship.org/uc/item/0d84248t' },
    { id: 'source-met-third-intermediate', title: 'Egypt in the Third Intermediate Period (ca. 1070–664 B.C.)', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/egypt-in-the-third-intermediate-period-1070-712-b-c' },
    { id: 'source-ucl-pyramid-shape', title: 'Development of the Pyramid Shape', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/pyramids/shape.html' },
    { id: 'source-ucl-pyramids-overview', title: 'Pyramids: An Overview', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/pyramids/index.html' },
    { id: 'source-ucl-pyramid-towns', title: 'Pyramid Towns', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/pyramids/town.html' },
    { id: 'source-ucl-king-cult', title: 'The Cult of the King', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/ideology/king/cult.html' },
    { id: 'source-aera-lost-city', title: 'The Lost City of the Pyramids', publisher: 'Ancient Egypt Research Associates', url: 'https://aeraweb.org/projects/lost-city/' },
    { id: 'source-aera-feeding-workers', title: 'Feeding Pyramid Workers', publisher: 'Ancient Egypt Research Associates', url: 'https://aeraweb.org/feeding-pyramid-workers/' },
    { id: 'source-ifao-merer-log', title: 'Les papyrus de la mer Rouge I: Le «Journal de Merer»', author: 'Pierre Tallet', year: 2017, publisher: 'Institut français d’archéologie orientale', url: 'https://www.ifao.egnet.net/uploads/publications/divers/MIFAO136_ann_01.pdf' },
    { id: 'source-met-oarsmen-official', title: 'Oarsmen and an Official', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/552238' },
    { id: 'source-wikimedia-oarsmen-official', title: 'Oarsmen and an Official photograph, CC0', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Oarsmen_and_an_Official_MET_DP251956.jpg' },
    { id: 'source-wikimedia-giza-complex-map', title: 'Giza Pyramid Complex Map, CC BY-SA 3.0', author: 'MesserWoland', year: 2006, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Giza_pyramid_complex_(map).svg' },
    { id: 'source-wikimedia-djoser-step', title: 'Saqqara Stepped Pyramid Photograph, Public Domain', author: 'Charles J. Sharp', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Saqqara_stepped_pyramid.jpg' },
    { id: 'source-wikimedia-bent-pyramid', title: 'Bent Pyramid Angle Photograph, CC BY-SA 3.0', author: 'Timsdad', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Bent_Pyramid_angle.jpg' },
    { id: 'source-met-offering-bearers', title: 'Offering Bearers, Old Kingdom', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/547738' },
    { id: 'source-met-neferiu-false-door', title: 'False Door of Neferiu', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/543863' },
    { id: 'source-ucl-burial-customs', title: 'Ancient Egyptian Burial Customs', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/burialcustoms/index.html' },
    { id: 'source-ucl-mummies', title: 'Mummies', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/mummy/index.html' },
    { id: 'source-met-life-along-nile', title: 'Life Along the Nile: Three Egyptians of Ancient Thebes', publisher: 'The Metropolitan Museum of Art', url: 'https://resources.metmuseum.org/resources/metpublications/pdf/Life_Along_the_Nile_Three_Egyptians_of_Ancient_Thebes_The_Metropolitan_Museum_of_Art_Bulletin_v_60_no_1_Summer_2002.pdf' },
    { id: 'source-ucl-tombs', title: 'Tombs', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/burialcustoms/tombs.html' },
    { id: 'source-ucl-cult-offerings', title: 'Cult and Offerings', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/religion/cultindex.html' },
    { id: 'source-ucl-religious-texts', title: 'Ancient Egyptian Religious Texts', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/literature/religious/index.html' },
    { id: 'source-ucl-coffin-texts', title: 'Coffin Texts', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/literature/religious/coffin.html' },
    { id: 'source-ucl-book-of-dead-faq', title: 'Questions about the Book of the Dead', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/literature/religious/bdquestions.html' },
    { id: 'source-bm-book-of-dead', title: 'What Is the Book of the Dead?', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/blog/what-book-dead' },
    { id: 'source-met-transforming-dead', title: 'Transforming the Dead: Culturally Modified Egyptian Mummies in the Predynastic Period', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/-/media/files/about-the-met/curatorial-departments/egyptian/facsimiles/2014_transformingthedead_web.pdf' },
    { id: 'source-bm-egyptian-gods', title: 'Ancient Egyptian Gods and Goddesses', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/ancient-egyptian-gods-and-goddesses' },
    { id: 'source-ucl-shabtis', title: 'Shabtis', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/burialcustoms/shabtis.html' },
    { id: 'source-ucl-book-of-dead-125', title: 'Book of the Dead, Chapter 125', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/literature/religious/bd125a.html' },
    { id: 'source-bm-afterlife-journey', title: 'Journey to the Afterlife', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt/journey-afterlife' },
    { id: 'source-met-wah-statuette', title: 'Statuette of Wah', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/545111' },
    { id: 'source-met-heart-scarab', title: 'Heart Scarab', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/550986' },
    { id: 'source-met-ukhhotep-coffin', title: 'Outer Coffin of Ukhhotep', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/546303' },
    { id: 'source-met-nesiamun-book-dead', title: 'Book of the Dead for the Chantress of Amun, Nesi-amun', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/550820' },
    { id: 'source-met-hatnefer-osiris', title: 'Osiris Figure from the Burial of Hatnefer', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/548954' },
    { id: 'source-met-anubis-weighing-heart', title: 'Anubis Weighing the Heart', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/557830' },
    { id: 'source-met-seti-i-shabti', title: 'Shabti of Seti I', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/544763' },
    { id: 'source-met-hatshepsut-publication', title: 'Hatshepsut: From Queen to Pharaoh', year: 2005, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/met-publications/hatshepsut-from-queen-to-pharaoh' },
    { id: 'source-bm-ramesses-ii-colossal-statue', title: 'Colossal Statue of Ramesses II', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/collection/galleries/egyptian-sculpture/colossal-statue-ramesses-ii' },
    { id: 'source-egypt-monuments-abu-simbel', title: 'Abu Simbel', publisher: 'Ministry of Tourism and Antiquities, Egypt', url: 'https://egymonuments.gov.eg/en/archaeological-sites/abu-simbel/' },
    { id: 'source-ucl-hieroglyphic-system', title: 'The System of Egyptian Hieroglyphic Writing', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/writing/system.html' },
    { id: 'source-ucl-art-script', title: 'Art and Script in Ancient Egypt', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/art/artscript.html' },
    { id: 'source-ucl-writing-development', title: 'Development of Writing', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/writing/development.html' },
    { id: 'source-ucl-hieratic', title: 'Hieratic Script', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/writing/hieratic.html' },
    { id: 'source-ucl-demotic', title: 'Demotic', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/writing/demotic.html' },
    { id: 'source-ucl-coptic', title: 'Coptic', publisher: 'UCL Digital Egypt for Universities', url: 'https://www.ucl.ac.uk/museums-static/digitalegypt/writing/coptic.html' },
    { id: 'source-bm-hieroglyphs-decipherment', title: 'Egyptian Hieroglyphs: Decipherment Timeline', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/exhibitions/hieroglyphs-unlocking-ancient-egypt/egyptian-hieroglyphs-decipherment-timeline' },
    { id: 'source-bm-hieroglyphs-resources', title: 'Hieroglyphs Resources', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/hieroglyphs-resources' },
    { id: 'source-yale-wadi-el-hol', title: 'Two Early Alphabetic Inscriptions from the Wadi el-Hol', publisher: 'Yale University', url: 'https://nelc.yale.edu/publications/two-early-alphabetic-inscriptions-wadi-el-hol-new-evidence-origin-alphabet-western' },
    { id: 'source-isac-visible-language', title: 'Visible Language: Inventions of Writing in the Ancient Middle East and Beyond', year: 2010, publisher: 'Institute for the Study of Ancient Cultures, University of Chicago', url: 'https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/oimp32.pdf' },
    { id: 'source-wikimedia-narmer-palette-cc0', title: 'The Narmer Palette Photograph, CC0', author: 'Joe deSousa', year: 2023, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:The_Narmer_Palette_(53250074700).jpg' },
    { id: 'source-met-coptic-manuscript', title: 'Manuscript Leaves Fragment, Coptic', publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/art/collection/search/475055' },
    { id: 'source-wikimedia-champollion-table-pd', title: 'Champollion Table of Hieroglyphic and Demotic Phonetic Signs, Public Domain', author: 'Jean-François Champollion', year: 1822, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Champollion_table.jpg' },
    { id: 'source-wikimedia-karnak-hieroglyphs', title: 'Colourful Egyptian Hieroglyphs at Karnak, CC BY-SA 4.0', author: 'Sandy Gamal', year: 2023, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Egyptian_Hieroglyphs.jpg' },
    { id: 'source-wikimedia-unas-exterior', title: 'Pyramid of Unas Photograph, CC BY-SA 3.0', author: 'Markh', year: 2006, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Pyramid_of_Unas.jpg' },
    { id: 'source-thinkzone-alphabet-chart', title: 'Egyptian Hieroglyphs to Latin Alphabet Chart, CC BY-SA 4.0', author: 'Keith Enevoldsen', year: 2021, publisher: "Keith's Think Zone", url: 'https://thinkzone.wlonk.com/AlphabetHistory/EgyptianToLatin.html' },
    { id: 'source-wikimedia-abu-simbel-color', title: 'Abu Simbel Great Temple Façade Photograph, CC BY 2.0', author: 'Arian Zwegers', year: 1998, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Abu_Simbel,_fa%C3%A7ade_of_the_Great_Temple_(6201194723).jpg' }
  ];

  const entities: Collection<'entities'> = [
    { id: 'ancient-egypt-civilization', type: 'culturalTradition', name: '古埃及文明', alternativeNames: ['Ancient Egyptian civilization'], canonicalSummary: '约公元前3100—前30年，形成于尼罗河河谷与三角洲，以法老王权、神庙、象形文字、死后信仰和不断变化的艺术传统延续了近三千年的古代文明。', timeSpan: timeSpan(-3100, -30, '约公元前3100—前30年', true), tags: ['非洲', '古埃及', '文化传统'], sourceIds: ['source-ucl-narmer', 'source-met-telling-time-egypt', 'source-met-egypt-1000-1'] },
    { id: 'egypt-old-kingdom', type: 'polity', name: '古埃及古王国', alternativeNames: ['Old Kingdom of Egypt'], canonicalSummary: '约公元前2686—前2181年，以统一王权、大型王室陵墓和不断扩展的行政网络为重要特征的古埃及政治实体。', timeSpan: timeSpan(-2686, -2181, '约公元前2686—前2181年', true), tags: ['非洲', '古埃及', '政治实体'], sourceIds: ['source-met-old-kingdom', 'source-muller-old-kingdom-end'] },
    { id: 'egypt-middle-kingdom', type: 'polity', name: '古埃及中王国', alternativeNames: ['Middle Kingdom of Egypt'], canonicalSummary: '约公元前2055—前1650年，由底比斯王室重新统一埃及后形成，并以文学、王权重组和后期政治分裂留下鲜明证据的政治实体。', timeSpan: timeSpan(-2055, -1650, '约公元前2055—前1650年', true), tags: ['非洲', '古埃及', '政治实体'], sourceIds: ['source-ucl-middle-kingdom', 'source-met-middle-kingdom', 'source-uee-second-intermediate'] },
    { id: 'egypt-new-kingdom', type: 'polity', name: '古埃及新王国', alternativeNames: ['New Kingdom of Egypt'], canonicalSummary: '约公元前1550—前1069年，从重新统一走向跨区域扩张，并经历阿玛尔纳改革、拉美西斯时代和晚期收缩的古埃及政治实体。', timeSpan: timeSpan(-1550, -1069, '约公元前1550—前1069年', true), tags: ['非洲', '古埃及', '政治实体'], sourceIds: ['source-met-new-kingdom', 'source-hayes-scepter-ii'] },
    { id: 'egypt-pyramids', type: 'wonder', name: '古埃及金字塔', alternativeNames: ['Egyptian pyramids'], canonicalSummary: '古埃及以王室墓葬为核心发展出的石造建筑群，形状、施工组织与后续祭祀经历了长期变化。', timeSpan: timeSpan(-2700, -2200, '约公元前27—前23世纪', true), tags: ['非洲', '古埃及', '奇观', '建筑'], sourceIds: ['source-met-old-kingdom', 'source-ucl-pyramid-shape', 'source-ucl-pyramids-overview'] },
    { id: 'egyptian-religion', type: 'religionAndMyth', name: '古埃及宗教', alternativeNames: ['Ancient Egyptian religion'], canonicalSummary: '通过身体保存、供奉、咒语、众神与审判来理解死亡和重生的一组长期宗教与神话传统。', timeSpan: timeSpan(-2686, -1069, '古王国至新王国', true), tags: ['非洲', '古埃及', '宗教与神话', '死后世界'], sourceIds: ['source-ucl-burial-customs', 'source-ucl-religious-texts', 'source-bm-afterlife-journey'] },
    { id: 'egyptian-art', type: 'artStyle', name: '古埃及艺术', alternativeNames: ['Ancient Egyptian art'], canonicalSummary: '用人物朝向、大小、服饰、姿势、名字和材料表现身份、权力、祭祀与永生的一套长期视觉传统。', timeSpan: timeSpan(-2700, -1100, '古王国至新王国', true), tags: ['非洲', '古埃及', '艺术风格'], sourceIds: ['source-met-ancient-egypt-art', 'source-arnold-pyramids', 'source-met-akhenaten-city'] },
    { id: 'egyptian-hieroglyphs', type: 'writingSystem', name: '古埃及象形文字', alternativeNames: ['Egyptian hieroglyphs'], canonicalSummary: '把词、辅音和帮助判断词义的无声符号组合起来记录古埃及语的书写系统。', timeSpan: timeSpan(-3100, 400, '约公元前3100年至公元4世纪', true), tags: ['非洲', '古埃及', '文字系统', '语言'], sourceIds: ['source-ucl-hieroglyphic-system', 'source-ucl-writing-development', 'source-ucl-coptic'] }
  ];

  const events: Collection<'events'> = [
    {
      id: 'event-upper-lower-egypt-unified', kind: 'historicalProcess', title: '上下埃及王权逐步统一', timeSpan: timeSpan(-3300, -3050, '约公元前3300—前3050年', true), participantEntityIds: ['ancient-egypt-civilization'],
      evidenceBlocks: [fact('event-upper-lower-egypt-unified-evidence', '纳尔迈石板等早期王权图像把南北冠冕、征服与仪式结合起来，显示上下埃及统一王权正在形成。', ['source-ucl-narmer'])],
      sourceIds: ['source-ucl-narmer'], editorialReview: review([limitation('event-upper-lower-egypt-unified-process', '统一不是一日完成的单场战争，石板图像也服务于王权表达。', ['source-ucl-narmer'])], [], [], ['source-ucl-narmer'])
    },
    {
      id: 'event-nile-annual-cycle-organizes-life', kind: 'historicalProcess', title: '尼罗河年周期持续组织生产与交通', timeSpan: timeSpan(-3100, -30, '约公元前3100—前30年', true), participantEntityIds: ['ancient-egypt-civilization'],
      evidenceBlocks: [fact('event-nile-annual-cycle-evidence', '尼罗河水位的季节变化与河运长期影响播种、收获、田地管理和物资交通。', ['source-met-telling-time-egypt', 'source-met-life-along-nile'])],
      sourceIds: ['source-met-telling-time-egypt', 'source-met-life-along-nile'], editorialReview: review([limitation('event-nile-annual-cycle-labor', '河流条件不能替代灌溉维护、土地管理和劳动组织对生产的作用。', ['source-met-life-along-nile'])], [], [], ['source-met-telling-time-egypt', 'source-met-life-along-nile'])
    },
    {
      id: 'event-sinuhe-story-composed-and-copied', kind: 'textualTradition', title: '《辛奴赫的故事》形成并持续抄写', timeSpan: timeSpan(-2000, -1100, '约公元前2000—前1100年', true), participantEntityIds: ['egypt-middle-kingdom'],
      evidenceBlocks: [fact('event-sinuhe-story-evidence', '《辛奴赫的故事》以中王国宫廷与返乡为主题，后来仍被书吏反复抄写。', ['source-ucl-sinuhe', 'source-bm-sinuhe-literature', 'source-bm-sinuhe-ostracon'])],
      sourceIds: ['source-ucl-sinuhe', 'source-bm-sinuhe-literature', 'source-bm-sinuhe-ostracon'], editorialReview: review([limitation('event-sinuhe-story-literature', '作品是文学叙事，不能把主人公经历逐项当作同时代档案。', ['source-bm-sinuhe-literature'])], [], [], ['source-ucl-sinuhe', 'source-bm-sinuhe-literature'])
    },
    {
      id: 'event-hatshepsut-rules-as-pharaoh', kind: 'historicalEvent', title: '哈特谢普苏特以法老身份统治', timeSpan: timeSpan(-1479, -1458, '约公元前1479—前1458年', true), participantEntityIds: ['egypt-new-kingdom', 'egyptian-art'],
      evidenceBlocks: [fact('event-hatshepsut-rules-evidence', '哈特谢普苏特采用完整王名与法老图像，在新王国早期以国王身份统治。', ['source-met-hatshepsut', 'source-met-hatshepsut-publication'])],
      sourceIds: ['source-met-hatshepsut', 'source-met-hatshepsut-publication'], editorialReview: review([limitation('event-hatshepsut-rules-images', '不同雕像中的身体与服饰变化属于王权图像选择，不能简单还原为私人身份表达。', ['source-met-hatshepsut-publication'])], [], [], ['source-met-hatshepsut', 'source-met-hatshepsut-publication'])
    },
    {
      id: 'event-old-kingdom-pyramid-complexes-develop', kind: 'historicalProcess', title: '古王国金字塔建筑群持续发展', timeSpan: timeSpan(-2700, -2300, '约公元前2700—前2300年', true), participantEntityIds: ['egypt-old-kingdom', 'egypt-pyramids'],
      evidenceBlocks: [fact('event-old-kingdom-pyramids-develop-evidence', '王室陵墓从阶梯式石造建筑发展为包含金字塔、神庙、堤道、聚落和持续祭祀的建筑群。', ['source-ucl-pyramid-shape', 'source-ucl-pyramids-overview', 'source-met-old-kingdom'])],
      sourceIds: ['source-ucl-pyramid-shape', 'source-ucl-pyramids-overview', 'source-met-old-kingdom'], editorialReview: review([limitation('event-old-kingdom-pyramids-develop-methods', '不同金字塔的施工顺序与提升技术不能由单一模型概括。', ['source-ucl-pyramids-overview'])], [], [], ['source-ucl-pyramid-shape', 'source-ucl-pyramids-overview'])
    },
    {
      id: 'event-egyptian-funerary-texts-and-rituals-expand', kind: 'textualTradition', title: '丧葬文字与死后仪式扩展', timeSpan: timeSpan(-2400, -1069, '约公元前2400—前1069年', true), participantEntityIds: ['egyptian-religion'],
      evidenceBlocks: [fact('event-egyptian-funerary-tradition-evidence', '丧葬咒语从王室金字塔墙面进入棺材和纸草卷，并与身体保存、供奉、审判和沙布提等仪式实践结合。', ['source-ucl-religious-texts', 'source-ucl-coffin-texts', 'source-bm-book-of-dead'])],
      sourceIds: ['source-ucl-religious-texts', 'source-ucl-coffin-texts', 'source-bm-book-of-dead'], editorialReview: review([limitation('event-egyptian-funerary-tradition-access', '保存下来的墓葬与文字偏向能够承担葬礼费用的人群，实践也随时期和地区变化。', ['source-ucl-burial-customs'])], [], [], ['source-ucl-religious-texts', 'source-ucl-coffin-texts', 'source-bm-book-of-dead'])
    },
    {
      id: 'event-egyptian-formal-art-conventions-persist', kind: 'historicalProcess', title: '古埃及正式艺术规则延续并被调整', timeSpan: timeSpan(-2700, -1100, '约公元前2700—前1100年', true), participantEntityIds: ['egyptian-art'],
      evidenceBlocks: [fact('event-egyptian-art-conventions-evidence', '人物朝向、尺度、姿势、服饰与名字长期共同表达身份和功能，不同时期的统治者也会调整这些规则。', ['source-met-ancient-egypt-art', 'source-met-hatshepsut-publication', 'source-met-akhenaten-city'])],
      sourceIds: ['source-met-ancient-egypt-art', 'source-met-hatshepsut-publication', 'source-met-akhenaten-city'], editorialReview: review([limitation('event-egyptian-art-conventions-context', '正式墓葬与王室艺术不能代表所有人的视觉经验，也不能按现代写实标准衡量。', ['source-met-ancient-egypt-art'])], [], [], ['source-met-ancient-egypt-art', 'source-met-hatshepsut-publication'])
    },
    {
      id: 'event-egyptian-writing-system-changes', kind: 'historicalProcess', title: '埃及书写系统跨媒介与语言阶段变化', timeSpan: timeSpan(-3150, 400, '约公元前3150—公元400年', true), participantEntityIds: ['egyptian-hieroglyphs'],
      evidenceBlocks: [fact('event-egyptian-writing-changes-evidence', '象形文字与行草书体在石墙、木片和纸草上记录语言，后来又与世俗体和科普特字母等书写阶段相接。', ['source-ucl-writing-development', 'source-ucl-hieratic', 'source-ucl-demotic', 'source-ucl-coptic'])],
      sourceIds: ['source-ucl-writing-development', 'source-ucl-hieratic', 'source-ucl-demotic', 'source-ucl-coptic'], editorialReview: review([limitation('event-egyptian-writing-changes-overlap', '不同书体和语言阶段存在长期重叠，不能理解成一种文字在单一年份突然取代另一种。', ['source-ucl-writing-development'])], [], [], ['source-ucl-writing-development', 'source-ucl-demotic', 'source-ucl-coptic'])
    },
    {
      id: 'event-old-kingdom-fragmentation', kind: 'historicalProcess', title: '古王国统一王权瓦解', timeSpan: timeSpan(-2250, -2181, '约公元前23—前22世纪', true), participantEntityIds: ['egypt-old-kingdom'],
      evidenceBlocks: [fact('event-old-kingdom-fragmentation-evidence', '第六王朝后期，王位继承、中央资源与地方权力发生变化；古王国结束后，赫拉克利奥波利斯与底比斯成为主要政治中心。', ['source-muller-old-kingdom-end'])],
      sourceIds: ['source-muller-old-kingdom-end'], editorialReview: review([], [interpretation('event-old-kingdom-fragmentation-weight', '王位继承、行政变化、地方家族与环境压力分别发挥多大作用仍难精确衡量。', ['source-muller-old-kingdom-end'])], [interpretation('event-old-kingdom-fragmentation-causes', '古王国结束应作为多种长期变化的汇合来理解。', ['source-muller-old-kingdom-end'])], ['source-muller-old-kingdom-end'])
    },
    {
      id: 'event-middle-kingdom-reunification', kind: 'historicalProcess', title: '孟图霍特普二世重新统一埃及', timeSpan: timeSpan(-2055, -2040, '约公元前21世纪', true), participantEntityIds: ['egypt-middle-kingdom'],
      evidenceBlocks: [fact('event-middle-kingdom-reunification-evidence', '孟图霍特普二世领导的底比斯王室击败北方对手，再次控制上下埃及。', ['source-ucl-mentuhotep-ii', 'source-ucl-middle-kingdom'])],
      sourceIds: ['source-ucl-mentuhotep-ii', 'source-ucl-middle-kingdom'], editorialReview: review([], [interpretation('event-middle-kingdom-reunification-process', '重新统一是持续推进的政治与军事过程，不能压缩成已知细节完整的一场战役。', ['source-ucl-mentuhotep-ii'])], [], ['source-ucl-mentuhotep-ii', 'source-ucl-middle-kingdom'])
    },
    {
      id: 'event-middle-kingdom-fragmentation', kind: 'historicalProcess', title: '中王国统一王权结束', timeSpan: timeSpan(-1700, -1650, '约公元前18—前17世纪', true), participantEntityIds: ['egypt-middle-kingdom'],
      evidenceBlocks: [fact('event-middle-kingdom-fragmentation-evidence', '中王国后期王位更换频繁，统一政治秩序最终分成阿瓦里斯、底比斯和库施等不同中心。', ['source-met-middle-kingdom', 'source-uee-second-intermediate'])],
      sourceIds: ['source-met-middle-kingdom', 'source-uee-second-intermediate'], editorialReview: review([], [interpretation('event-middle-kingdom-fragmentation-populations', '阿瓦里斯居民的来源、身份与政治关系不能简化成一个单一外来集团；第二中间期的起点和王表顺序也仍有争议。', ['source-ucl-second-intermediate', 'source-uee-second-intermediate'])], [], ['source-ucl-second-intermediate', 'source-uee-second-intermediate'])
    },
    {
      id: 'event-ahmose-captures-avaris', kind: 'historicalEvent', title: '雅赫摩斯攻下阿瓦里斯', timeSpan: timeSpan(-1555, -1545, '约公元前1550年', true), participantEntityIds: ['egypt-new-kingdom'],
      evidenceBlocks: [fact('event-ahmose-captures-avaris-evidence', '底比斯王室向北推进，雅赫摩斯攻下阿瓦里斯并重新统一埃及。', ['source-ucl-ahmose'])],
      sourceIds: ['source-ucl-ahmose'], editorialReview: review([], [interpretation('event-ahmose-captures-avaris-chronology', '战争的具体年次与每次军事行动仍不能全部确定。', ['source-ucl-ahmose'])], [], ['source-ucl-ahmose'])
    },
    {
      id: 'event-amarna-reform', kind: 'historicalProcess', title: '阿肯那顿建立阿玛尔纳新秩序', timeSpan: timeSpan(-1353, -1336, '约公元前1353—前1336年', true), participantEntityIds: ['egypt-new-kingdom'],
      evidenceBlocks: [fact('event-amarna-reform-evidence', '阿肯那顿建立阿玛尔纳新都，把王室祭祀集中到阿顿，并改变神庙资源与王室图像；他死后，新都被放弃，王室恢复对传统众神的支持。', ['source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun'])],
      sourceIds: ['source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun'], editorialReview: review([limitation('event-amarna-reform-regional-practice', '王室改革的范围不能直接代表全国居民的日常宗教实践，也不能简单等同于现代意义的一神教国家。', ['source-met-akhenaten-city'])], [], [], ['source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun'])
    },
    {
      id: 'event-battle-of-kadesh', kind: 'historicalEvent', title: '卡迭石战役', timeSpan: timeSpan(-1274, -1274, '约公元前1274年', true), participantEntityIds: ['egypt-new-kingdom', 'hittite-empire'],
      evidenceBlocks: [fact('event-battle-of-kadesh-evidence', '拉美西斯二世的军队在卡迭石附近遭遇赫梯战车突袭；埃及纪念文字突出国王的个人勇武，但埃及没有长期夺取卡迭石。', ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii'])],
      sourceIds: ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii'], editorialReview: review([limitation('event-battle-of-kadesh-royal-account', '埃及材料服务于王室纪念，不能单独决定战役胜负。', ['source-bm-kadesh-sallier'])], [], [], ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii'])
    },
    {
      id: 'event-egypt-hatti-treaty', kind: 'historicalEvent', title: '埃及与赫梯签订和平条约', timeSpan: timeSpan(-1259, -1258, '约公元前1259年', true), participantEntityIds: ['egypt-new-kingdom', 'hittite-empire'],
      evidenceBlocks: [fact('event-egypt-hatti-treaty-evidence', '卡迭石战役多年以后，埃及与赫梯签订条约，约定停止敌对并在受到威胁时互相援助。', ['source-un-egypt-hatti-treaty'])],
      sourceIds: ['source-un-egypt-hatti-treaty'], editorialReview: review([limitation('event-egypt-hatti-treaty-texts', '现存埃及文与赫梯文版本都服务于王室外交表达，具体执行情况还需结合后续政治材料。', ['source-un-egypt-hatti-treaty'])], [], [], ['source-un-egypt-hatti-treaty'])
    },
    {
      id: 'event-new-kingdom-fragmentation', kind: 'historicalProcess', title: '新王国统一王权结束', timeSpan: timeSpan(-1186, -1069, '约公元前1186—前1069年', true), participantEntityIds: ['egypt-new-kingdom'],
      evidenceBlocks: [fact('event-new-kingdom-fragmentation-evidence', '新王国晚期的财政、军事与地方权力压力持续累积，埃及对外控制收缩；拉美西斯十一世死后，北方国王与南方阿蒙祭司分别掌握权力。', ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'])],
      sourceIds: ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'], editorialReview: review([], [interpretation('event-new-kingdom-fragmentation-weight', '外部战争、财政困难、粮食供应和地方权力变化的相对影响仍不能精确量化。', ['source-uee-early-mid-20th-dynasty', 'source-turin-strike-papyrus'])], [interpretation('event-new-kingdom-fragmentation-causes', '新王国结束是长期收缩与政治重组，不是工匠停工或一次入侵造成的突然消失。', ['source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'])], ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'])
    },
    {
      id: 'event-khufu-great-pyramid-construction', kind: 'historicalProcess', title: '胡夫大金字塔工程', timeSpan: timeSpan(-2580, -2560, '约公元前26世纪', true), participantEntityIds: ['egypt-old-kingdom', 'egypt-pyramids'],
      evidenceBlocks: [fact('event-khufu-great-pyramid-construction-evidence', '梅勒的日志记录船队从图拉装载石灰岩并运往吉萨，吉萨聚落遗迹则保存了住房、作坊、仓库与食物供应的证据。', ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers'])],
      sourceIds: ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers'], editorialReview: review([limitation('event-khufu-workforce-status', '工程参与者身份多样，现有证据不能把所有人统一称为奴隶或自由雇工。', ['source-aera-lost-city'])], [interpretation('event-khufu-ramp-uncertainty', '大金字塔各阶段具体采用何种坡道与提升方式仍不能完全确定。', ['source-ucl-pyramids-overview'])], [], ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers'])
    },
    {
      id: 'event-unas-pyramid-text-inscription', kind: 'historicalEvent', title: '乌尼斯金字塔铭文刻写', timeSpan: timeSpan(-2375, -2325, '约公元前24世纪', true), participantEntityIds: ['egypt-old-kingdom', 'egypt-pyramids', 'egyptian-religion'],
      evidenceBlocks: [fact('event-unas-pyramid-text-inscription-evidence', '乌尼斯金字塔墓室的石墙刻上成列咒语，用来保护死者、供给力量并帮助国王通往天空与众神。', ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts'])],
      sourceIds: ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts'], editorialReview: review([limitation('event-unas-royal-context', '乌尼斯墓室文字属于王室墓葬证据，不能直接代表所有古埃及人的葬礼条件。', ['source-ucl-religious-texts'])], [], [], ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts'])
    }
  ];

  const additionalCards = [
    {
      id: 'egyptian-art-identity-eternity', kind: 'thematic', primaryEntityId: 'egyptian-art', relatedEntityIds: ['egypt-old-kingdom', 'egypt-new-kingdom', 'egyptian-religion', 'egypt-pyramids'], title: '古埃及人把身份画进永恒',
      editorialPurpose: '从图像用途、人体画法、身份符号和尺度变化出发，理解古埃及正式艺术如何让身份、权力与永生变得可见。',
      introduction: '古埃及画里的人总把脸转向一边，肩膀却正对观众；国王还常比所有人高大。画师在用一套当时观众熟悉的规则，让身份、权力和永生出现在画面上。',
      thesis: { text: '古埃及艺术不只描绘一个人长什么样，还要说明他是谁、拥有什么身份、正在履行什么职责，以及希望如何长久存在。稳定的视觉规则延续了许多代，但不同统治者也会借用、调整甚至重新安排这些规则。', sourceIds: ['source-met-ancient-egypt-art', 'source-met-mitry-statue', 'source-met-hatshepsut-publication', 'source-egypt-monuments-abu-simbel'] },
      timeSpan: timeSpan(-2700, -1100, '约公元前27—前12世纪', true),
      sceneIds: ['egypt-art-images-work', 'egypt-art-composite-body', 'egypt-art-size-status', 'egypt-art-statues-live', 'egypt-art-hatshepsut-pharaoh', 'egypt-art-amarna-motion', 'egypt-art-abu-simbel-scale'],
      sourceIds: ['source-met-ancient-egypt-art', 'source-met-offering-bearers', 'source-met-neferiu-false-door', 'source-met-anubis-weighing-heart', 'source-met-sahure-statue', 'source-arnold-pyramids', 'source-met-mitry-statue', 'source-met-hatshepsut', 'source-met-hatshepsut-publication', 'source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-bm-ramesses-ii-colossal-statue', 'source-egypt-monuments-abu-simbel', 'source-wikimedia-abu-simbel-color'],
      editorialReview: review([
        limitation('egypt-art-review-elite-survival', '现存古埃及艺术大量来自王室建筑、神庙和精英墓葬，普通家庭制作和使用的物品保存得更少。', ['source-met-ancient-egypt-art']),
        limitation('egypt-art-review-formal-rules', '卡片中的视觉规则主要解释正式艺术，不能自动套用到所有速写、练习稿、工匠涂画和日常小物件。', ['source-met-ancient-egypt-art'])
      ], [
        interpretation('egypt-art-review-viewers', '现代研究可以分析作品的预定功能，却不能假定所有古代观看者面对同一件作品时都有完全相同的理解。', ['source-met-ancient-egypt-art']),
        interpretation('egypt-art-review-likeness', '个别雕像面部是否表现真实年龄、理想身份或某种王权观念，需要结合具体作品判断。', ['source-met-mitry-statue', 'source-met-hatshepsut-publication'])
      ], [interpretation('egypt-art-review-change', '艺术变化不应只归因于统治者个人意愿；作品用途、放置地点、材料、工匠传统和神庙环境同样会改变最终形象。', ['source-met-ancient-egypt-art'])], ['source-met-ancient-egypt-art', 'source-met-mitry-statue', 'source-met-hatshepsut-publication', 'source-egypt-monuments-abu-simbel'])
    },
    {
      id: 'egyptian-hieroglyphs-words-sounds', kind: 'thematic', primaryEntityId: 'egyptian-hieroglyphs', relatedEntityIds: ['egypt-old-kingdom', 'egypt-middle-kingdom', 'egypt-new-kingdom', 'egyptian-religion', 'egypt-pyramids'], title: '象形文字写下词与声音',
      editorialPurpose: '把象形文字作为一套语言书写系统来介绍，并从正式石刻、日常手写、后期文字与早期字母的联系说明其变化和影响。',
      introduction: '鸟、眼睛、流水、面包——石墙上的小图看起来像一排画谜。真正读起来，它们却会变成词、辅音和判断词义的提示，有时连一个不发音的符号也必不可少。',
      thesis: { text: '象形文字是一套同时记录声音与意义的混合书写系统。正式石刻、日常手写和后来的埃及文字采用不同外形；在埃及与说闪米特语人群的接触中，部分符号又被赋予新声音，为后来的字母传统准备了道路。', sourceIds: ['source-ucl-hieroglyphic-system', 'source-ucl-writing-development', 'source-ucl-coptic', 'source-yale-wadi-el-hol'] },
      timeSpan: timeSpan(-3100, 400, '约公元前3100年至公元5世纪', true),
      sceneIds: ['egypt-hieroglyph-narmer-name', 'egypt-hieroglyph-word-sound', 'egypt-hieroglyph-silent-guides', 'egypt-hieroglyph-stone-papyrus', 'egypt-hieroglyph-language-changes', 'egypt-hieroglyph-alphabet-road'],
      sourceIds: ['source-ucl-narmer', 'source-ucl-hieroglyphic-system', 'source-ucl-art-script', 'source-ucl-writing-development', 'source-ucl-hieratic', 'source-ucl-demotic', 'source-ucl-coptic', 'source-bm-hieroglyphs-decipherment', 'source-bm-hieroglyphs-resources', 'source-yale-wadi-el-hol', 'source-isac-visible-language', 'source-wikimedia-narmer-palette-cc0', 'source-wikimedia-champollion-table-pd', 'source-wikimedia-karnak-hieroglyphs', 'source-wikimedia-sinuhe-papyrus', 'source-met-coptic-manuscript', 'source-thinkzone-alphabet-chart'],
      editorialReview: review([
        limitation('egypt-hieroglyph-review-survival', '保存下来的文字材料受石刻、神庙、墓葬、行政机关和书吏群体影响，不能代表所有人的语言经验。', ['source-ucl-writing-development']),
        limitation('egypt-hieroglyph-review-stages', '“象形文字”“僧侣体”“世俗体”和“科普特文字”既涉及不同书写外形，也跨越不同语言阶段，正文中的简化顺序主要用于初次理解。', ['source-ucl-hieratic', 'source-ucl-demotic', 'source-ucl-coptic'])
      ], [
        interpretation('egypt-hieroglyph-review-vowels', '古埃及文字通常不写元音，因此法老时代词语的精确读音不能全部恢复。', ['source-bm-hieroglyphs-decipherment']),
        interpretation('egypt-hieroglyph-review-sinaitic-origin', '原始西奈字母的具体形成地点、年代、参与群体和部分符号来源仍有争论。', ['source-yale-wadi-el-hol', 'source-isac-visible-language']),
        interpretation('egypt-hieroglyph-review-origin-contexts', 'Wadi el-Hol与西奈矿区材料支持不同的起源情境，不应只把其中一种解释写成唯一答案。', ['source-yale-wadi-el-hol', 'source-isac-visible-language'])
      ], [
        interpretation('egypt-hieroglyph-review-multiple-contacts', '早期字母可能来自长期、多地点的语言接触，而不是某个人在某一天完成的一次“发明”。', ['source-yale-wadi-el-hol', 'source-isac-visible-language']),
        interpretation('egypt-hieroglyph-review-borrowing', '字母符号与埃及文字之间既可能涉及图形借用，也可能涉及书写观念和书吏实践的影响，不能把每个字母都画成确定无疑的象形文字后代。', ['source-isac-visible-language'])
      ], ['source-ucl-hieroglyphic-system', 'source-ucl-writing-development', 'source-ucl-coptic', 'source-yale-wadi-el-hol', 'source-isac-visible-language'])
    }
  ];

  const structuralEdges: Collection<'structuralEdges'> = [
    { id: 'edge-egypt-old-middle-kingdom', family: 'historicalNetwork', type: 'reunified_after_fragmentation', source: { kind: 'entity', id: 'egypt-old-kingdom' }, target: { kind: 'entity', id: 'egypt-middle-kingdom' }, timeSpan: timeSpan(-2181, -2055, '古王国结束至中王国重新统一', true), label: { forward: '分裂后形成新的统一王国', reverse: '继承并重组更早的王权传统' }, summaries: { canonical: '古王国结束后的南北分裂，构成底比斯王室重新统一埃及并建立中王国的直接前史。' }, qualifiers: ['不把中王国视为古王国制度的简单恢复'], sourceIds: ['source-muller-old-kingdom-end', 'source-ucl-mentuhotep-ii'] },
    { id: 'edge-egypt-middle-new-kingdom', family: 'historicalNetwork', type: 'reunified_after_fragmentation', source: { kind: 'entity', id: 'egypt-middle-kingdom' }, target: { kind: 'entity', id: 'egypt-new-kingdom' }, timeSpan: timeSpan(-1650, -1550, '中王国结束至新王国重新统一', true), label: { forward: '分裂后形成新的统一王国', reverse: '继承并扩大早期边界经验' }, summaries: { canonical: '中王国结束后的阿瓦里斯与底比斯对峙，构成雅赫摩斯重新统一埃及并建立新王国的直接前史。' }, qualifiers: ['不把新王国扩张解释为单一战争的自动结果'], sourceIds: ['source-ucl-second-intermediate', 'source-ucl-ahmose'] }
  ];

  const cards: Collection<'cards'> = [
    {
      id: 'ancient-egypt-gift-of-nile', kind: 'overview', primaryEntityId: 'ancient-egypt-civilization', relatedEntityIds: ['egypt-old-kingdom', 'egypt-middle-kingdom', 'egypt-new-kingdom', 'egypt-pyramids', 'egyptian-religion', 'egyptian-art', 'egyptian-hieroglyphs', 'late-bronze-palace-system', 'medinet-habu-war-records'], title: '尼罗河的赠礼',
      editorialPurpose: '以尼罗河提供的环境条件为入口，解释古埃及人如何通过劳动、国家组织、文字、图像和信仰把这些条件变成一个长期延续、又不断变化的文明。',
      introduction: '尼罗河每年带来水和泥土，也把狭长河谷连成一条道路。古埃及人用近三千年，把这份赠礼变成王国、文字、神庙和通往死后世界的想象。',
      thesis: { text: '尼罗河提供了耕地、水源和交通条件，人们则通过年复一年的劳动、运输和组织利用这些条件。王朝会分裂和更替，但王权、文字、图像、神庙和死后信仰不断被继承与改造，使古埃及长期保持可辨认的文化传统。', sourceIds: ['source-met-telling-time-egypt', 'source-ucl-narmer', 'source-met-ancient-egypt-art', 'source-ucl-hieroglyphic-system', 'source-ucl-burial-customs', 'source-met-egypt-1000-1'] },
      timeSpan: timeSpan(-3100, -30, '约公元前3100—前30年', true),
      sceneIds: ['ancient-egypt-two-lands', 'ancient-egypt-river-returns', 'ancient-egypt-pyramid-kingdom', 'ancient-egypt-visible-identity', 'ancient-egypt-dead-needs', 'ancient-egypt-reunifications', 'ancient-egypt-power-far-away', 'ancient-egypt-survives-palaces'],
      sourceIds: ['source-ucl-narmer', 'source-met-telling-time-egypt', 'source-met-life-along-nile', 'source-met-old-kingdom', 'source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers', 'source-ucl-hieroglyphic-system', 'source-ucl-art-script', 'source-met-ancient-egypt-art', 'source-ucl-burial-customs', 'source-bm-afterlife-journey', 'source-muller-old-kingdom-end', 'source-met-middle-kingdom', 'source-met-new-kingdom', 'source-met-amarna-letters', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate', 'source-met-egypt-1000-1', 'source-isac-medinet-habu-i', 'source-knapp-manning-crisis'],
      editorialReview: review(
        [limitation('ancient-egypt-civilization-review-elite', '现存材料严重偏向王室、神庙与精英墓葬；八幕总览不能代替各王国和专题故事。', ['source-met-old-kingdom', 'source-ucl-burial-customs'])],
        [interpretation('ancient-egypt-civilization-review-unification', '上下埃及统一的时间、过程和纳尔迈尔的具体角色仍有讨论；“古埃及文明”以公元前30年收束是本故事的编辑范围，相关传统此后仍继续变化。', ['source-ucl-narmer', 'source-met-egypt-1000-1'])],
        [interpretation('ancient-egypt-civilization-review-causes', '长期延续还可从地方社区、神庙经济、书吏传统、农业组织、王权记忆和对外交流解释，不能只归因于尼罗河。', ['source-met-telling-time-egypt', 'source-met-ancient-egypt-art'])],
        ['source-ucl-narmer', 'source-met-telling-time-egypt', 'source-met-old-kingdom', 'source-ucl-hieroglyphic-system', 'source-ucl-burial-customs', 'source-met-new-kingdom', 'source-met-egypt-1000-1']
      )
    },
    {
      id: 'egypt-old-kingdom-overview', kind: 'overview', primaryEntityId: 'egypt-old-kingdom', relatedEntityIds: ['egypt-middle-kingdom', 'egypt-pyramids', 'egyptian-religion'], title: '金字塔背后的古王国',
      editorialPurpose: '从统一王权与金字塔工程出发，讲清古王国如何依靠粮食、人员、官员和祭祀长期运转。',
      introduction: '金字塔不是法老说一声就能建成的。石块升上地平线的同时，一个能够调动粮食、工匠、书吏和祭司的王国也显出了形状。',
      thesis: { text: '古王国的力量不只表现在金字塔有多高，更表现在它能否让人力、物资和祭祀持续运转；当这些联系不再稳定，王权也会失去原有的支撑。', sourceIds: ['source-met-old-kingdom', 'source-arnold-pyramids', 'source-muller-old-kingdom-end'] },
      timeSpan: timeSpan(-3150, -2055, '约公元前31世纪至中王国形成', true),
      sceneIds: ['egypt-old-two-lands', 'egypt-old-pyramids-horizon', 'egypt-old-afterlife-road', 'egypt-old-officials', 'egypt-old-north-south'],
      sourceIds: ['source-ucl-narmer', 'source-met-old-kingdom', 'source-arnold-pyramids', 'source-met-sahure-statue', 'source-met-mitry-statue', 'source-muller-old-kingdom-end', 'source-ifao-merer-log', 'source-ucl-religious-texts'],
      editorialReview: review([limitation('egypt-old-review-elite-evidence', '古王国现存材料大量来自王室和精英墓葬，普通人的经验更难复原。', ['source-met-old-kingdom', 'source-arnold-pyramids'])], [interpretation('egypt-old-review-unification', '纳尔迈尔时代统一的具体过程与持续时间仍不能完全确定。', ['source-ucl-narmer'])], [interpretation('egypt-old-review-end', '古王国结束涉及王位继承、行政、地方家族与环境等多重变化。', ['source-muller-old-kingdom-end'])], ['source-ucl-narmer', 'source-met-old-kingdom', 'source-arnold-pyramids', 'source-muller-old-kingdom-end'])
    },
    {
      id: 'egypt-middle-kingdom-overview', kind: 'overview', primaryEntityId: 'egypt-middle-kingdom', relatedEntityIds: ['egypt-old-kingdom', 'egypt-new-kingdom'], title: '重新统一的中王国',
      editorialPurpose: '从重新统一、辛奴赫的流亡与归乡、再次分裂三个步骤，讲清中王国的政治首尾与文学中的个人归属。',
      introduction: '埃及分裂以后，南方的国王重新把两片土地合在一起。几百年后，同一个王国却又出现了不同的统治中心。',
      thesis: { text: '中王国重新建立统一王权；《辛奴赫的故事》让读者从一个流亡者的选择中感受故乡、国王和安葬的意义，而王国最终再次分裂。', sourceIds: ['source-ucl-mentuhotep-ii', 'source-ucl-sinuhe', 'source-bm-sinuhe-literature', 'source-uee-second-intermediate'] },
      timeSpan: timeSpan(-2055, -1550, '约公元前2055年至新王国形成', true),
      sceneIds: ['egypt-middle-thebes-reunifies', 'egypt-middle-sinuhe-home', 'egypt-middle-avaris'],
      sourceIds: ['source-ucl-middle-kingdom', 'source-met-middle-kingdom', 'source-ucl-mentuhotep-ii', 'source-ucl-sinuhe', 'source-bm-sinuhe-literature', 'source-bm-sinuhe-ostracon', 'source-ucl-second-intermediate', 'source-uee-second-intermediate'],
      editorialReview: review([limitation('egypt-middle-review-literary-peak', '“古埃及文学在中王国达到巅峰”是对这一时期经典文学地位的编辑概括，不表示其他时期没有重要文学作品。', ['source-met-middle-kingdom', 'source-bm-sinuhe-literature'])], [interpretation('egypt-middle-review-sinuhe', '《辛奴赫的故事》是文学作品，不能当作真实人物的逐事传记，也不能直接代表所有中王国人的真实心理。', ['source-ucl-sinuhe', 'source-bm-sinuhe-literature'])], [interpretation('egypt-middle-review-end', '中期王国结束后的政治格局不止阿瓦里斯与底比斯两个中心，库施及其他可能的政治单位也需要计入。', ['source-uee-second-intermediate'])], ['source-met-middle-kingdom', 'source-ucl-sinuhe', 'source-bm-sinuhe-literature', 'source-uee-second-intermediate'])
    },
    {
      id: 'egypt-new-kingdom-overview', kind: 'overview', primaryEntityId: 'egypt-new-kingdom', relatedEntityIds: ['egypt-middle-kingdom'], title: '法老把权力伸向远方',
      editorialPurpose: '用王朝建立、女性法老、远方治理、外交、宗教改革、战争叙述和粮食供应，连续检验新王国法老的权力边界。',
      introduction: '新王国的法老能够调动军队、黄金和神庙，却没有谁只靠头衔就能统治。他们一次次证明自己，也一次次碰到权力够不到的地方。',
      thesis: { text: '新王国法老的身份、远方统治、外交、宗教权威、战争形象和供应能力都需要不断维持；王权越强大，暴露出的边界也越多。', sourceIds: ['source-met-new-kingdom', 'source-met-hatshepsut-female-pharaoh', 'source-ucl-nubia-new-kingdom', 'source-met-amarna-letters', 'source-met-akhenaten-city', 'source-bm-kadesh-sallier', 'source-turin-strike-papyrus'] },
      timeSpan: timeSpan(-1550, -1069, '约公元前1550—前1069年', true),
      sceneIds: ['egypt-new-ahmose-avaris', 'egypt-new-hatshepsut', 'egypt-new-beyond-borders', 'egypt-new-amarna-letters', 'egypt-new-akhenaten-city', 'egypt-new-kadesh', 'egypt-new-contraction'],
      sourceIds: ['source-ucl-ahmose', 'source-met-new-kingdom', 'source-ucl-nubia-new-kingdom', 'source-met-hatshepsut', 'source-met-hatshepsut-exhibition', 'source-met-hatshepsut-female-pharaoh', 'source-ucl-sobeknofru', 'source-met-amarna-letters', 'source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun', 'source-hayes-scepter-ii', 'source-bm-kadesh-sallier', 'source-un-egypt-hatti-treaty', 'source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'],
      editorialReview: review([limitation('egypt-new-review-royal-records', '王室纪念物和官方文字在现存材料中占比很高，会放大国王宣称的胜利与秩序。', ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii'])], [interpretation('egypt-new-review-hatshepsut', '哈特谢普苏特常被通俗称为“埃及第一位女法老”，但在她以前已有索贝克内弗鲁等女性以国王身份统治。', ['source-ucl-sobeknofru', 'source-met-hatshepsut-female-pharaoh']), interpretation('egypt-new-review-nubia', '努比亚不同地区的本地延续与身份变化不能只从埃及式物质文化判断。', ['source-ucl-nubia-new-kingdom'])], [interpretation('egypt-new-review-end', '新王国结束涉及外部战争、财政、粮食供应、神庙权力和地方政治等多重压力；工匠停工不是唯一原因。', ['source-uee-early-mid-20th-dynasty', 'source-turin-strike-papyrus', 'source-met-third-intermediate'])], ['source-met-new-kingdom', 'source-ucl-nubia-new-kingdom', 'source-met-hatshepsut-female-pharaoh', 'source-ucl-sobeknofru', 'source-met-akhenaten-city', 'source-bm-kadesh-sallier', 'source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'])
    },
    {
      id: 'egypt-pyramids-kingdom-at-work', kind: 'thematic', primaryEntityId: 'egypt-pyramids', relatedEntityIds: ['egypt-old-kingdom', 'egyptian-religion'], title: '一座金字塔需要整个王国',
      editorialPurpose: '让读者从形状试验、石料运输、工人聚落、食物供应与长期祭祀理解金字塔是一项持续运转的王国工程。',
      introduction: '金字塔看上去像一座沉默的石山，建造时却喧闹得像一座城市。石块要从河上来，面包要每天出炉；法老死后，祭司还要让这里继续运转。',
      thesis: { text: '金字塔的形状经过多代工程试验才逐渐形成，它的建造与长期使用依靠船队、工匠、粮仓、书吏和祭司共同维持。', sourceIds: ['source-ucl-pyramid-shape', 'source-ifao-merer-log', 'source-aera-lost-city', 'source-ucl-king-cult'] },
      timeSpan: timeSpan(-2700, -2200, '约公元前27—前23世纪', true),
      sceneIds: ['egypt-pyramid-stone-grows', 'egypt-pyramid-sneferu-three', 'egypt-pyramid-whole-complex', 'egypt-pyramid-merer-boats', 'egypt-pyramid-workers-city', 'egypt-pyramid-feeding-city', 'egypt-pyramid-cult-continues', 'egypt-pyramid-walls-speak'],
      sourceIds: ['source-met-old-kingdom', 'source-ucl-pyramid-shape', 'source-ucl-pyramids-overview', 'source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers', 'source-ucl-pyramid-towns', 'source-ucl-king-cult', 'source-ucl-religious-texts'],
      editorialReview: review([
        limitation('egypt-pyramids-review-giza', '工人聚落与供应证据主要来自吉萨第四王朝遗址，不能代表所有地点和时代的金字塔工程。', ['source-aera-lost-city', 'source-aera-feeding-workers']),
        limitation('egypt-pyramids-review-elite', '王室和精英墓葬在现存材料中占据优势，普通参与者的个人经历更难复原。', ['source-met-old-kingdom'])
      ], [interpretation('egypt-pyramids-review-workforce', '工程劳动力包含不同身份与组织方式，现有证据不支持把所有人统一称为奴隶或自由雇工。', ['source-aera-lost-city'])], [interpretation('egypt-pyramids-review-methods', '具体运输、坡道和提升方法可能随工程阶段变化，不能压缩成唯一施工方案。', ['source-ucl-pyramids-overview'])], ['source-met-old-kingdom', 'source-ucl-pyramid-shape', 'source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers'])
    },
    {
      id: 'egypt-afterlife-journey', kind: 'thematic', primaryEntityId: 'egyptian-religion', relatedEntityIds: ['egypt-old-kingdom', 'egypt-middle-kingdom', 'egypt-new-kingdom', 'egypt-pyramids'], title: '死亡以后，旅程才开始',
      editorialPurpose: '跟随一位死者从身体保存、持续供奉和随身咒语走向众神、审判与来世田野，让宗教观念通过一次完整旅程被理解。',
      introduction: '对古埃及人来说，死亡不是一扇关上的门，而是一场容易迷路的远行。身体、名字、心和生命力量都要保存下来；众神会一路帮助，也会在终点等待。',
      thesis: { text: '古埃及的死后旅程需要保存身体与名字、维持供奉、准备咒语并通过众神的帮助和审判，最后在一个理想化的埃及继续生活。', sourceIds: ['source-ucl-burial-customs', 'source-ucl-religious-texts', 'source-bm-afterlife-journey'] },
      timeSpan: timeSpan(-2400, -1069, '约公元前24—前11世纪', true),
      sceneIds: ['egypt-afterlife-wah-wrapped', 'egypt-afterlife-many-parts', 'egypt-afterlife-offerings-continue', 'egypt-afterlife-pyramid-spells', 'egypt-afterlife-coffin-texts', 'egypt-afterlife-travel-guide', 'egypt-afterlife-gods-on-road', 'egypt-afterlife-heart-trial', 'egypt-afterlife-field-work'],
      sourceIds: ['source-ucl-burial-customs', 'source-ucl-mummies', 'source-met-life-along-nile', 'source-ucl-tombs', 'source-ucl-cult-offerings', 'source-ucl-religious-texts', 'source-ucl-coffin-texts', 'source-ucl-book-of-dead-faq', 'source-bm-book-of-dead', 'source-bm-egyptian-gods', 'source-ucl-book-of-dead-125', 'source-ucl-shabtis', 'source-bm-afterlife-journey'],
      editorialReview: review([
        limitation('egypt-afterlife-review-elite', '精美棺材、纸草卷和陪葬小像主要反映有能力准备这些物品的人，普通墓葬往往简单得多。', ['source-ucl-burial-customs']),
        limitation('egypt-afterlife-review-variation', '葬俗会随时代、地区和家庭条件变化，并不存在所有埃及人共同采用的一套完整流程。', ['source-ucl-burial-customs', 'source-ucl-mummies'])
      ], [interpretation('egypt-afterlife-review-text-sequence', '金字塔铭文、棺材铭文和《亡灵书》之间既有继承也有重新组合，不能写成后一种简单取代前一种。', ['source-ucl-religious-texts', 'source-ucl-coffin-texts', 'source-ucl-book-of-dead-faq'])], [interpretation('egypt-afterlife-review-gods', '众神的职责与关系会随时代和地方重叠、变化，场景中的分工是为旅程主线所作的编辑组织。', ['source-bm-egyptian-gods'])], ['source-ucl-burial-customs', 'source-ucl-religious-texts', 'source-ucl-coffin-texts', 'source-bm-book-of-dead', 'source-bm-afterlife-journey'])
    },
    ...additionalCards
  ];

  const scenes: Collection<'scenes'> = [
    {
      id: 'ancient-egypt-two-lands', title: '两片土地成为一个王国', eyebrow: '文明的政治起点', timeSpan: timeSpan(-3300, -2686, '约公元前3300—前2686年', true), eventIds: ['event-upper-lower-egypt-unified'],
      contentBlocks: [fact('ancient-egypt-two-lands-fact', '古王国开始前约四百年，尼罗河南方河谷与北方三角洲仍由不同的政治中心控制。约公元前3100年，一块石板把国王纳尔迈尔画了两次：一面戴南方白冠，一面戴北方红冠。画面宣告两片土地归于一王，后来的法老也一直自称“上下埃及之王”。', ['source-ucl-narmer'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-hieroglyph-narmer' }, sourceIds: ['source-ucl-narmer', 'source-wikimedia-narmer-palette-cc0']
    },
    {
      id: 'ancient-egypt-river-returns', title: '河水每年回来', eyebrow: '尼罗河的赠礼', timeSpan: timeSpan(-3100, -30, '约公元前3100—前30年', true), eventIds: ['event-nile-annual-cycle-organizes-life'],
      contentBlocks: [synthesis('ancient-egypt-river-returns-synthesis', '尼罗河的水每年上涨又退去，河边的人据此安排播种和收获。泥土不会自己变成粮食：人们还要清理水道、划分田地、把谷物送进仓库。船只沿河来往，让石料、粮食、官员和消息穿过狭长的国家。所谓“尼罗河的赠礼”，也包括人们年复一年接住它的劳动。', ['source-met-telling-time-egypt', 'source-met-life-along-nile'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-egypt-upper-lower', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'ancient-egypt-civilization', annotationId: 'annotation-ancient-egypt-nile-south', sourceIds: ['source-met-telling-time-egypt'] },
        { kind: 'entity', entityId: 'ancient-egypt-civilization', annotationId: 'annotation-ancient-egypt-nile-north', sourceIds: ['source-met-telling-time-egypt'] }
      ], caption: '尼罗河从南方河谷流向北方三角洲；文字标出河流连接的两段主要地貌，不表示固定政治边界。' } }, sourceIds: ['source-met-telling-time-egypt', 'source-met-life-along-nile', 'source-natural-earth']
    },
    {
      id: 'ancient-egypt-pyramid-kingdom', title: '金字塔让整个王国忙起来', eyebrow: '古王国的工程', timeSpan: timeSpan(-2686, -2181, '约公元前2686—前2181年', true), eventIds: ['event-old-kingdom-pyramid-complexes-develop', 'event-khufu-great-pyramid-construction'],
      contentBlocks: [fact('ancient-egypt-pyramid-kingdom-fact', '胡夫建造大金字塔时，一名叫梅勒的船队管理员每天记下工作：从图拉装载石灰岩，再沿水路送往吉萨。工地附近还要准备住房、面包、肉食、工具和仓库。石块能够一层层升高，是因为船工、工匠、书吏和供粮者把整个王国接进了同一项工程。', ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-pyramid-oarsmen-relief' }, sourceIds: ['source-ifao-merer-log', 'source-aera-lost-city', 'source-aera-feeding-workers', 'source-met-oarsmen-official']
    },
    {
      id: 'ancient-egypt-visible-identity', title: '文字和图像让身份被看见', eyebrow: '文字与艺术', timeSpan: timeSpan(-3100, -30, '约公元前3100—前30年', true), eventIds: ['event-egyptian-formal-art-conventions-persist', 'event-egyptian-writing-system-changes'],
      contentBlocks: [synthesis('ancient-egypt-visible-identity-synthesis', '神庙和墓室墙上的鸟、眼睛与流水不只是装饰，它们可以写出词和声音。旁边的人物也遵守一套容易辨认的规则：脸朝侧面，肩膀正对观众，国王常比其他人高大。文字写下名字，图像说明身份，两者一起让死者、神和法老被人认出。', ['source-ucl-hieroglyphic-system', 'source-ucl-art-script', 'source-met-ancient-egypt-art'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-hieroglyph-karnak-color' }, sourceIds: ['source-ucl-hieroglyphic-system', 'source-ucl-art-script', 'source-met-ancient-egypt-art', 'source-wikimedia-karnak-hieroglyphs']
    },
    {
      id: 'ancient-egypt-dead-needs', title: '死者仍需要身体、名字和食物', eyebrow: '宗教与死后世界', timeSpan: timeSpan(-2686, -30, '约公元前2686—前30年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [synthesis('ancient-egypt-dead-needs-synthesis', '死亡没有让一个人的需要全部停止。身体要被保存，名字要继续被读出，墓室还要收到食物和香料。棺材、石墙与纸草上的咒语帮助死者穿过危险、接受众神审判，最后在一个理想的埃及重新生活。墓葬不是装满宝物的仓库，而是一段漫长旅程的出发点。', ['source-ucl-burial-customs', 'source-ucl-religious-texts', 'source-bm-afterlife-journey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-afterlife-ukhhotep-coffin' }, sourceIds: ['source-ucl-burial-customs', 'source-ucl-religious-texts', 'source-bm-afterlife-journey', 'source-met-ukhhotep-coffin']
    },
    {
      id: 'ancient-egypt-reunifications', title: '王国分裂，又重新合在一起', eyebrow: '分裂与重建', timeSpan: timeSpan(-2181, -1550, '约公元前2181—前1550年', true), eventIds: ['event-old-kingdom-fragmentation', 'event-middle-kingdom-reunification', 'event-middle-kingdom-fragmentation'],
      contentBlocks: [fact('ancient-egypt-reunifications-fact', '古王国结束后，北方和南方分别出现新的统治中心。约公元前21世纪，南方底比斯的国王重新统一两片土地，中王国由此开始。几百年后，埃及再次分开：北方听命于阿瓦里斯，南方仍由底比斯掌握。王朝会中断，统一也要一次次重新争取。', ['source-muller-old-kingdom-end', 'source-ucl-mentuhotep-ii', 'source-uee-second-intermediate'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-egypt-middle-centers', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'egypt-old-kingdom', annotationId: 'annotation-egypt-middle-north', sourceIds: ['source-muller-old-kingdom-end'] },
        { kind: 'entity', entityId: 'egypt-middle-kingdom', annotationId: 'annotation-egypt-middle-south', sourceIds: ['source-ucl-mentuhotep-ii'] }
      ], caption: '文字标出古王国结束后北方与南方的主要权力中心；点位是教学选点，不表示边界。' } }, sourceIds: ['source-muller-old-kingdom-end', 'source-ucl-mentuhotep-ii', 'source-uee-second-intermediate', 'source-natural-earth']
    },
    {
      id: 'ancient-egypt-power-far-away', title: '法老把权力伸向远方', eyebrow: '新王国的世界', timeSpan: timeSpan(-1550, -1069, '约公元前1550—前1069年', true), eventIds: ['event-ahmose-captures-avaris', 'event-amarna-diplomatic-correspondence-operates'],
      contentBlocks: [synthesis('ancient-egypt-power-far-away-synthesis', '重新统一后，新王国的法老把军队派往努比亚和地中海东岸。攻下一座城只是开始：要塞需要守军，黄金与粮食需要运输，远方首领也要继续合作。各国国王还用泥板书信交换礼物、安排婚姻、争论地位。埃及不再只沿尼罗河向内运转，也进入了诸王彼此注视的世界。', ['source-met-new-kingdom', 'source-ucl-nubia-new-kingdom', 'source-met-amarna-letters'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-egypt-new-reach', transition: 'cut', structureViewIds: [], layers: [
        { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-core', sourceIds: ['source-met-new-kingdom'] },
        { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-nubia', sourceIds: ['source-ucl-nubia-new-kingdom'] },
        { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-levant', sourceIds: ['source-met-amarna-letters'] }
      ], caption: '文字标出尼罗河谷核心、努比亚方向与西亚方向；浅色范围是教学范围，不是稳定国界。' } }, sourceIds: ['source-met-new-kingdom', 'source-ucl-nubia-new-kingdom', 'source-met-amarna-letters', 'source-natural-earth']
    },
    {
      id: 'ancient-egypt-survives-palaces', title: '宫殿熄灭以后，埃及仍然继续', eyebrow: '青铜时代危机以后', timeSpan: timeSpan(-1250, -30, '约公元前1250—前30年', true), eventIds: ['event-new-kingdom-fragmentation'],
      contentBlocks: [fact('ancient-egypt-survives-palaces-fact', '约公元前12世纪，拉美西斯三世把战船、俘虏和若干来敌刻上神庙墙；后人把其中一些群体合称为“海上民族”。同一时期，东地中海许多宫殿和书信网络停止运转。埃及也失去领地、再次分裂，却没有消失。此后王朝继续更替，直到公元前30年，埃及才被纳入罗马统治。', ['source-isac-medinet-habu-i', 'source-cifola-ramesses-sea-peoples', 'source-knapp-manning-crisis', 'source-met-third-intermediate', 'source-met-egypt-1000-1'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-lba-medinet-habu-temple' }, sourceIds: ['source-isac-medinet-habu-i', 'source-cifola-ramesses-sea-peoples', 'source-knapp-manning-crisis', 'source-met-third-intermediate', 'source-met-egypt-1000-1', 'source-wikimedia-medinet-habu-temple']
    },
    {
      id: 'egypt-old-two-lands', title: '一位国王戴上两顶王冠', eyebrow: '古王国之前', timeSpan: timeSpan(-3150, -3050, '约公元前3150—前3050年', true), eventIds: ['event-upper-lower-egypt-unified'],
      contentBlocks: [fact('egypt-old-two-lands-fact', '古埃及最初分成南北两个王国。南方位于尼罗河上游，所以叫上埃及；北方位于下游三角洲，叫下埃及。约公元前3100年，一块石板把国王纳尔迈尔画了两次：一面戴上埃及的白冠，一面戴下埃及的红冠。石板上方的象形符号写着他的名字。画面宣告两片土地已经归于一王，后来的法老也一直自称“上下埃及之王”。', ['source-ucl-narmer'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-egypt-upper-lower', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'egypt-old-kingdom', annotationId: 'annotation-egypt-upper', sourceIds: ['source-ucl-narmer'] },
            { kind: 'entity', entityId: 'egypt-old-kingdom', annotationId: 'annotation-egypt-lower', sourceIds: ['source-ucl-narmer'] }
          ],
          caption: '深色圆点标出南方河谷的上埃及与北方三角洲的下埃及；这是教学位置，不是统一前的精确边界。'
        }
      }, sourceIds: ['source-ucl-narmer', 'source-natural-earth']
    },
    {
      id: 'egypt-old-pyramids-horizon', title: '金字塔登上地平线', eyebrow: '第三至第四王朝', timeSpan: timeSpan(-2686, -2490, '约公元前2686—前2490年', true), eventIds: ['event-old-kingdom-pyramid-complexes-develop'],
      contentBlocks: [synthesis('egypt-old-pyramids-horizon-synthesis', '约公元前26世纪，胡夫的金字塔在吉萨沙漠边缘升起。巨石要从采石场运来，工匠需要住所，成千上万人的口粮必须按时送到。金字塔看起来像一位国王的纪念物，背后却是一整套持续多年的运输、供给和组织工作。', ['source-met-ancient-egypt-art', 'source-arnold-pyramids'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-old-giza-pyramids' }, sourceIds: ['source-met-ancient-egypt-art', 'source-arnold-pyramids', 'source-wikimedia-giza-pyramids']
    },
    {
      id: 'egypt-old-afterlife-road', title: '为死后的旅程写下道路', eyebrow: '第五王朝', timeSpan: timeSpan(-2375, -2345, '约公元前2375—前2345年', true), eventIds: ['event-unas-pyramid-text-inscription', 'event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [fact('egypt-old-afterlife-road-fact', '金字塔封闭后，国王的死后生活才刚刚开始。祭司继续送来食物、香料和祷告。国王乌尼斯的墓室里，成行文字为死者指路：升向星空，跟随太阳，在另一个世界重新获得生命。石头保护身体，祭祀和文字则让这段旅程继续下去。', ['source-met-old-kingdom', 'source-wikimedia-unas-pyramid-texts'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-old-unas-exterior' }, sourceIds: ['source-met-old-kingdom', 'source-wikimedia-unas-pyramid-texts', 'source-wikimedia-unas-exterior']
    },
    {
      id: 'egypt-old-officials', title: '国王之外的办事人', eyebrow: '第六王朝', timeSpan: timeSpan(-2345, -2181, '约公元前2345—前2181年', true), eventIds: ['event-old-kingdom-pyramid-complexes-develop'],
      contentBlocks: [synthesis('egypt-old-officials-synthesis', '一名叫米特里的官员为自己留下了多座雕像。他不是法老，却要记录财物、管理人员，在宫廷、神庙和地方之间传递命令。更多没有留下姓名的书吏、工匠、船工和农民，则让石料能够抵达、粮食能够集中、祭祀能够年年继续。', ['source-met-mitry-statue', 'source-met-old-kingdom'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-old-mitry-statue' }, sourceIds: ['source-met-mitry-statue', 'source-met-old-kingdom']
    },
    {
      id: 'egypt-old-north-south', title: '命令不再通向所有地方', eyebrow: '古王国结束以后', timeSpan: timeSpan(-2250, -2055, '约公元前2250—前2055年', true), eventIds: ['event-old-kingdom-fragmentation'],
      contentBlocks: [synthesis('egypt-old-north-south-synthesis', '到了古王国末期，王位更换加快，许多地方职位开始在家族中延续。王室越来越难像从前那样稳定地汇集粮食、人力和土地收益。古王国结束后，北方和南方分别出现新的权力中心。下一次统一，将由南方的底比斯王室完成。', ['source-muller-old-kingdom-end', 'source-ucl-mentuhotep-ii'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-egypt-middle-centers', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'egypt-old-kingdom', annotationId: 'annotation-egypt-middle-north', sourceIds: ['source-muller-old-kingdom-end'] },
            { kind: 'entity', entityId: 'egypt-middle-kingdom', annotationId: 'annotation-egypt-middle-south', sourceIds: ['source-ucl-mentuhotep-ii'] }
          ],
          caption: '深色圆点标出北方赫拉克利奥波利斯、孟斐斯与南方底比斯的近似位置。'
        }
      }, sourceIds: ['source-muller-old-kingdom-end', 'source-ucl-mentuhotep-ii', 'source-natural-earth']
    },
    {
      id: 'egypt-middle-thebes-reunifies', title: '国王从南方出发', eyebrow: '第十一王朝', timeSpan: timeSpan(-2055, -2010, '约公元前2055—前2010年', true), eventIds: ['event-middle-kingdom-reunification'],
      contentBlocks: [fact('egypt-middle-thebes-reunifies-fact', '古王国结束后，埃及失去了共同的国王，北方和南方各自听命于不同的统治者。约公元前21世纪，南方底比斯的国王孟图霍特普二世击败北方对手，再次把两片土地置于同一位国王之下。中王国由此开始，底比斯也从南方城市变成了王国的权力中心。', ['source-ucl-mentuhotep-ii', 'source-met-middle-kingdom'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-egypt-middle-centers', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'egypt-old-kingdom', annotationId: 'annotation-egypt-middle-north', sourceIds: ['source-muller-old-kingdom-end'] },
            { kind: 'entity', entityId: 'egypt-middle-kingdom', annotationId: 'annotation-egypt-middle-south', sourceIds: ['source-ucl-mentuhotep-ii'] }
          ],
          caption: '深色圆点标出北方赫拉克利奥波利斯、孟斐斯与南方底比斯的近似位置。'
        }
      }, sourceIds: ['source-ucl-mentuhotep-ii', 'source-met-middle-kingdom', 'source-muller-old-kingdom-end', 'source-natural-earth']
    },
    {
      id: 'egypt-middle-sinuhe-home', title: '辛奴赫逃走，又回到埃及', eyebrow: '中王国文学', timeSpan: timeSpan(-2000, -1800, '约公元前2000—前1800年', true), eventIds: ['event-sinuhe-story-composed-and-copied'],
      contentBlocks: [synthesis('egypt-middle-sinuhe-home-synthesis', '古埃及文学在中王国达到了巅峰，辛奴赫的故事就是一个例子。故事里，他听到老国王去世，惊慌得不敢回营，独自逃出埃及。他在异乡娶妻成家，得到土地，也在战斗中赢得名声。可到了晚年，他只想回到埃及，在熟悉的仪式中安葬。新国王原谅了他，为他准备住宅和墓地，漫长逃亡终于结束。', ['source-ucl-sinuhe', 'source-bm-sinuhe-literature', 'source-bm-sinuhe-ostracon'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-middle-sinuhe-papyrus' }, sourceIds: ['source-ucl-sinuhe', 'source-bm-sinuhe-literature', 'source-bm-sinuhe-ostracon', 'source-wikimedia-sinuhe-papyrus']
    },
    {
      id: 'egypt-middle-avaris', title: '埃及再次出现几个中心', eyebrow: '中王国以后', timeSpan: timeSpan(-1700, -1550, '约公元前1700—前1550年', true), eventIds: ['event-middle-kingdom-fragmentation'],
      contentBlocks: [fact('egypt-middle-avaris-fact', '中王国延续几百年后，王位更换越来越频繁，统一的命令也渐渐失去力量。三角洲东部的阿瓦里斯控制了北方，南方仍由底比斯的国王掌握，更南面的库施也有自己的统治者。重新统一的埃及再次分开，而底比斯王室已经准备向北发动战争。', ['source-met-middle-kingdom', 'source-uee-second-intermediate', 'source-ucl-ahmose'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-egypt-thebes-avaris', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'egypt-middle-kingdom', annotationId: 'annotation-egypt-middle-south', sourceIds: ['source-ucl-second-intermediate'] },
            { kind: 'entity', entityId: 'egypt-middle-kingdom', annotationId: 'annotation-egypt-middle-avaris', sourceIds: ['source-ucl-second-intermediate'] }
          ],
          caption: '深色圆点标出南方底比斯与三角洲东部阿瓦里斯的近似位置。'
        }
      }, sourceIds: ['source-met-middle-kingdom', 'source-uee-second-intermediate', 'source-ucl-ahmose', 'source-natural-earth']
    },
    {
      id: 'egypt-new-ahmose-avaris', title: '战争带来新王朝', eyebrow: '第十八王朝开始', timeSpan: timeSpan(-1555, -1525, '约公元前1555—前1525年', true), eventIds: ['event-ahmose-captures-avaris'],
      contentBlocks: [fact('egypt-new-ahmose-avaris-fact', '埃及再次分裂后，北方由阿瓦里斯的国王控制，南方则听命于底比斯。两地经过几代人的战争，约公元前1550年，底比斯国王雅赫摩斯终于攻下阿瓦里斯，重新统一埃及。新王国从这场胜利中诞生，而它的军队很快又开始越过埃及原有的边界。', ['source-ucl-ahmose', 'source-met-new-kingdom'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-egypt-thebes-avaris', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-thebes', sourceIds: ['source-ucl-ahmose'] },
            { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-avaris', sourceIds: ['source-ucl-ahmose'] }
          ],
          caption: '深色圆点标出南方底比斯与三角洲东部阿瓦里斯的近似位置；它们不表示具体行军路线。'
        }
      }, sourceIds: ['source-ucl-ahmose', 'source-met-new-kingdom', 'source-natural-earth']
    },
    {
      id: 'egypt-new-beyond-borders', title: '法老把命令送到远方', eyebrow: '第十八王朝', timeSpan: timeSpan(-1550, -1350, '约公元前1550—前1350年', true), eventIds: ['event-amarna-diplomatic-correspondence-operates'],
      contentBlocks: [synthesis('egypt-new-beyond-borders-synthesis', '后来的法老把军队派往尼罗河南方和地中海东岸。可攻下一座城市只是开始：要塞需要守军，黄金和粮食需要运输，远方的命令也要有人执行。在努比亚，法老派出总督，同时让当地首领继续管理自己的社区，有些首领的孩子还被送到埃及宫廷生活。', ['source-met-new-kingdom', 'source-ucl-nubia-new-kingdom'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-egypt-new-reach', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-core', sourceIds: ['source-met-new-kingdom'] },
            { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-nubia', sourceIds: ['source-ucl-nubia-new-kingdom'] },
            { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-west-asia', sourceIds: ['source-met-amarna-letters'] }
          ],
          caption: '棕色虚线表示新王国向努比亚与西亚延伸的历史联系，不是精确行军路线或国界。'
        }
      }, sourceIds: ['source-met-new-kingdom', 'source-ucl-nubia-new-kingdom', 'source-natural-earth']
    },
    {
      id: 'egypt-new-hatshepsut', title: '哈特谢普苏特成为法老', eyebrow: '第十八王朝', timeSpan: timeSpan(-1479, -1458, '约公元前1479—前1458年', true), eventIds: ['event-hatshepsut-rules-as-pharaoh'],
      contentBlocks: [synthesis('egypt-new-hatshepsut-synthesis', '哈特谢普苏特常被称为“埃及第一位女法老”。严格来说，在她之前已经有女性以国王身份统治；她却是古埃及最著名、统治最成功的女法老之一。她原本是法老的王后，丈夫去世后，年幼的图特摩斯三世继承王位，她先替这个孩子处理国家事务。几年后，她取得法老的全部名号，与图特摩斯三世共同在位，并掌握主要权力。\n\n埃及人熟悉的法老形象通常是男性，所以她必须让人看懂自己拥有同样的权力。神庙里的雕像为她戴上王巾和礼仪假胡须，让她像历代法老一样向众神献祭；另一些雕像仍把她表现为女性。她没有假装自己是男人，而是借用人们熟悉的王权形象，公开表明：现在履行法老职责的人是她。', ['source-met-hatshepsut', 'source-met-hatshepsut-exhibition', 'source-met-hatshepsut-female-pharaoh', 'source-ucl-sobeknofru'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-new-hatshepsut' }, sourceIds: ['source-met-hatshepsut', 'source-met-hatshepsut-exhibition', 'source-met-hatshepsut-female-pharaoh', 'source-ucl-sobeknofru']
    },
    {
      id: 'egypt-new-amarna-letters', title: '外国国王把法老叫作兄弟', eyebrow: '阿玛尔纳时期', timeSpan: timeSpan(-1353, -1336, '约公元前1353—前1336年', true), eventIds: ['event-amarna-diplomatic-correspondence-operates'],
      contentBlocks: [fact('egypt-new-amarna-letters-fact', '王宫档案里保存着数百封外国来信。受埃及控制的小城统治者称法老为主人，请求他派兵解围；实力强大的外国国王却称他为“兄弟”。他们索要埃及黄金，交换马匹、战车和宝石，还商谈王室婚姻。走出埃及以后，法老既会收到求援，也必须与别的国王讨价还价。', ['source-met-amarna-letters', 'source-met-amarna-letter-object'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-new-amarna-letter' }, sourceIds: ['source-met-amarna-letters', 'source-met-amarna-letter-object']
    },
    {
      id: 'egypt-new-akhenaten-city', title: '阿肯那顿要求埃及敬奉阿顿', eyebrow: '阿玛尔纳时期', timeSpan: timeSpan(-1353, -1336, '约公元前1353—前1336年', true), eventIds: ['event-amarna-reform'],
      contentBlocks: [synthesis('egypt-new-akhenaten-city-synthesis', '埃及人同时敬奉许多神，新王国最重要的神之一，是底比斯的阿蒙。历代法老不断扩建阿蒙的神庙，并送去土地、财物和战利品。\n\n法老阿蒙霍特普四世却把代表太阳光芒的阿顿抬到最高位置。他把自己的名字改成阿肯那顿，意思是“对阿顿有用的人”，又带着宫廷离开底比斯，在沙漠边缘建起一座新都。阿蒙等旧神失去王室支持，一些名字和形象还被从神庙中凿去。\n\n但法老的命令没有让这场改变长久维持。阿肯那顿死后，继位者离开新都，重新供奉阿蒙和其他旧神。新城很快被放弃，许多建筑也被拆走。阿肯那顿曾试图重新安排国王、众神和城市之间的关系，结果证明，即使是法老，也很难独自改变延续多代的信仰。', ['source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-new-akhenaten' }, sourceIds: ['source-met-akhenaten-city', 'source-met-akhenaten-duck', 'source-ucl-tutankhamun']
    },
    {
      id: 'egypt-new-kadesh', title: '拉美西斯把卡迭石写成胜利', eyebrow: '拉美西斯二世时期', timeSpan: timeSpan(-1274, -1258, '约公元前1274—前1258年', true), eventIds: ['event-battle-of-kadesh'],
      contentBlocks: [synthesis('egypt-new-kadesh-synthesis', '公元前13世纪，埃及与赫梯争夺叙利亚的控制权，卡迭石成为双方交锋的关键。约公元前1274年，拉美西斯二世率军北上，却因军队分散遭遇赫梯战车突袭。埃及最终稳住阵脚，但未能夺取卡迭石。  回到埃及后，拉美西斯将这场战役刻在神庙墙壁上，把自己塑造成击退强敌的英雄。然而真实结果更接近僵局：赫梯仍控制叙利亚北部，两国继续竞争。约十五年后，双方签订和平条约，结束长期战争。', ['source-bm-kadesh-sallier', 'source-hayes-scepter-ii', 'source-un-egypt-hatti-treaty'])],
      presentation: {
        kind: 'mapAndText',
        map: {
          mapStateId: 'map-egypt-new-reach', transition: 'cut', structureViewIds: [],
          layers: [
            { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-core', sourceIds: ['source-bm-kadesh-sallier'] },
            { kind: 'entity', entityId: 'egypt-new-kingdom', annotationId: 'annotation-egypt-new-kadesh', sourceIds: ['source-bm-kadesh-sallier', 'source-un-egypt-hatti-treaty'] }
          ],
          caption: '深色标注显示卡迭石与尼罗河谷的相对位置；棕色虚线不是精确行军路线或国界。'
        }
      }, sourceIds: ['source-bm-kadesh-sallier', 'source-un-egypt-hatti-treaty', 'source-natural-earth']
    },
    {
      id: 'egypt-new-contraction', title: '给法老修墓的人停工了', eyebrow: '第二十王朝晚期', timeSpan: timeSpan(-1186, -1069, '约公元前1186—前1069年', true), eventIds: ['event-new-kingdom-fragmentation'],
      contentBlocks: [synthesis('egypt-new-contraction-synthesis', '一百多年后，给法老修建陵墓的工匠已经多日领不到作为工资的粮食。他们放下工具，越过工地岗哨，坐在神庙后高喊：“我们饿了！”此后埃及逐渐失去西亚和部分努比亚领地。最后一位新王国法老死后，北方国王与南方祭司分别掌握权力，统一的新王国结束了。', ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-new-strike-papyrus' }, sourceIds: ['source-turin-strike-papyrus', 'source-uee-early-mid-20th-dynasty', 'source-met-third-intermediate']
    },
    {
      id: 'egypt-pyramid-stone-grows', title: '石墓开始往天上长', eyebrow: '左塞尔的阶梯金字塔', timeSpan: timeSpan(-2700, -2630, '约公元前2700—前2630年', true), eventIds: ['event-old-kingdom-pyramid-complexes-develop'],
      contentBlocks: [fact('egypt-pyramid-stone-grows-fact', '约公元前27世纪，法老左塞尔的墓最初仍像一座低矮的长方形石台。工匠不断向上加建，石台最后变成层层升高的巨塔。它的周围还有院墙、祭坛和举行仪式的院落。金字塔从一开始就不是孤零零的石堆，而是一整片为死去国王准备的世界。', ['source-ucl-pyramid-shape', 'source-met-old-kingdom'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-pyramid-djoser-step' }, sourceIds: ['source-ucl-pyramid-shape', 'source-met-old-kingdom', 'source-wikimedia-djoser-step']
    },
    {
      id: 'egypt-pyramid-sneferu-three', title: '一位法老建了三座', eyebrow: '斯尼夫鲁的工程试验', timeSpan: timeSpan(-2630, -2580, '约公元前2630—前2580年', true), eventIds: ['event-old-kingdom-pyramid-complexes-develop'],
      contentBlocks: [fact('egypt-pyramid-sneferu-three-fact', '后来的法老斯尼夫鲁没有一次就得到今天熟悉的轮廓。他先把一座阶梯金字塔的外侧填平，又在达舒尔建造两座巨塔。其中一座修到半途时改变了坡度，于是留下明显的折角；另一座则以平直斜面升到顶端。金字塔的形状，是在一次次建造中试出来的。', ['source-ucl-pyramid-shape'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-pyramid-bent-angle' }, sourceIds: ['source-ucl-pyramid-shape', 'source-wikimedia-bent-pyramid']
    },
    {
      id: 'egypt-pyramid-whole-complex', title: '一座金字塔不止有一座塔', eyebrow: '吉萨建筑群', timeSpan: timeSpan(-2600, -2450, '约公元前2600—前2450年', true), eventIds: ['event-old-kingdom-pyramid-complexes-develop'],
      contentBlocks: [fact('egypt-pyramid-whole-complex-fact', '站在吉萨，人们最先看到的是三角形巨塔，真正的建筑群却一直向河边延伸。河谷神庙与塔旁神庙之间有长长的通道，周围还有王室家族的小金字塔、墓地、码头和仓库。那座最高的石塔只是最醒目的部分，整片土地都在为国王的葬礼和死后祭祀服务。', ['source-ucl-pyramids-overview', 'source-met-old-kingdom'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-old-giza-pyramids' }, sourceIds: ['source-ucl-pyramids-overview', 'source-met-old-kingdom', 'source-wikimedia-giza-pyramids']
    },
    {
      id: 'egypt-pyramid-merer-boats', title: '梅勒的船今天又出发了', eyebrow: '胡夫统治晚期', timeSpan: timeSpan(-2580, -2560, '约公元前2580—前2560年', true), eventIds: ['event-khufu-great-pyramid-construction'],
      contentBlocks: [fact('egypt-pyramid-merer-boats-fact', '胡夫统治晚期，一位名叫梅勒的领队每天记下船队去了哪里。他们在图拉装上白色石灰岩，沿水道驶向吉萨，再把石料交给大金字塔工程。日记里没有神秘机关，只有装船、航行、停泊和交货。巨大的金字塔，也由这样一天天的普通工作累积而成。', ['source-ifao-merer-log'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-pyramid-oarsmen-relief' }, sourceIds: ['source-ifao-merer-log', 'source-met-oarsmen-official', 'source-wikimedia-oarsmen-official']
    },
    {
      id: 'egypt-pyramid-workers-city', title: '金字塔脚下也有一座城', eyebrow: '吉萨工人聚落', timeSpan: timeSpan(-2600, -2500, '约公元前2600—前2500年', true), eventIds: ['event-khufu-great-pyramid-construction'],
      contentBlocks: [fact('egypt-pyramid-workers-city-fact', '石头到了吉萨，还要有人凿平、搬运、磨制工具、清点物资。考古学家在狮身人面像以南发现了成排住房、作坊、仓库、厨房和管理者的房屋。这里不只住着拉石块的人，也有工匠、厨师、书吏和负责安排工作的人。建造金字塔，需要先让一座城市运转起来。', ['source-aera-lost-city', 'source-ucl-pyramid-towns'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-pyramid-giza-complex-map' }, sourceIds: ['source-aera-lost-city', 'source-ucl-pyramid-towns', 'source-wikimedia-giza-complex-map']
    },
    {
      id: 'egypt-pyramid-feeding-city', title: '先让所有人吃上饭', eyebrow: '工地的供应网络', timeSpan: timeSpan(-2600, -2500, '约公元前2600—前2500年', true), eventIds: ['event-khufu-great-pyramid-construction'],
      contentBlocks: [synthesis('egypt-pyramid-feeding-city-synthesis', '城里的烤炉不断把面团变成面包，粮仓把谷物分给厨房和酿造作坊，成群牛羊也被送来。养活工地的人，背后还需要种田、牧养、运输和记账的人。法老调动的不是一支只会搬石头的队伍，而是一条从尼罗河两岸汇向吉萨的供应网络。', ['source-aera-feeding-workers', 'source-met-offering-bearers'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-pyramid-offering-bearers' }, sourceIds: ['source-aera-feeding-workers', 'source-met-offering-bearers']
    },
    {
      id: 'egypt-pyramid-cult-continues', title: '法老下葬了，工作还没结束', eyebrow: '持续多代的祭祀', timeSpan: timeSpan(-2600, -2200, '约公元前2600—前2200年', true), eventIds: ['event-khufu-great-pyramid-construction'],
      contentBlocks: [fact('egypt-pyramid-cult-continues-fact', '国王的遗体被封入地下墓室后，地上的神庙仍然开门。祭司献上面包、啤酒、肉和香油，念出国王的名字；附近的聚落继续提供人员和物资。一些祭祀维持了几代人。金字塔不只是完成后便被离开的工地，也是一处需要长期照料的王室圣地。', ['source-ucl-king-cult', 'source-ucl-cult-offerings'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-false-door-neferiu' }, sourceIds: ['source-ucl-king-cult', 'source-ucl-cult-offerings', 'source-met-neferiu-false-door']
    },
    {
      id: 'egypt-pyramid-walls-speak', title: '石墙开始说话', eyebrow: '乌尼斯金字塔', timeSpan: timeSpan(-2375, -2325, '约公元前2375—前2325年', true), eventIds: ['event-unas-pyramid-text-inscription'],
      contentBlocks: [fact('egypt-pyramid-walls-speak-fact', '到了古王国晚期，法老乌尼斯的墓室出现了新的景象：密密麻麻的象形文字覆盖石墙。文字呼唤众神、驱开沿途危险，帮助国王升上天空，也让他在死后继续获得食物和力量。金字塔把国王藏在石头里，墙上的话则要把他送往另一个世界。', ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-old-unas-pyramid-texts' }, sourceIds: ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts']
    },
    {
      id: 'egypt-afterlife-wah-wrapped', title: '瓦赫被一层层包好', eyebrow: '中王国的底比斯', timeSpan: timeSpan(-2000, -1900, '约公元前2000—前1900年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [fact('egypt-afterlife-wah-wrapped-fact', '约公元前20世纪，管仓库的瓦赫去世了。人们用天然盐让他的身体干燥，再用长长的亚麻布一层层包住；项链、戒指和护身符被藏进布层，最后把他安放进木棺。准备这一切，是因为旅程开始以后，他仍然需要一个完整、能够被认出的身体。', ['source-ucl-mummies', 'source-met-life-along-nile'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-afterlife-wah-statuette' }, sourceIds: ['source-ucl-mummies', 'source-met-life-along-nile', 'source-met-wah-statuette']
    },
    {
      id: 'egypt-afterlife-many-parts', title: '一个人不只是一具身体', eyebrow: '名字、心与生命力量', timeSpan: timeSpan(-2000, -1100, '约公元前2000—前1100年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [synthesis('egypt-afterlife-many-parts-synthesis', '埃及人认为，人活着时由许多部分共同组成。心保存记忆和选择，名字让一个人不会被遗忘；还有一种能够离开墓室、像人首鸟一样飞行的力量。死亡会让这些部分分散，墓葬、画像和咒语要做的，就是让它们找到彼此，让死者重新成为完整的人。', ['source-ucl-burial-customs', 'source-met-transforming-dead'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-afterlife-heart-scarab' }, sourceIds: ['source-ucl-burial-customs', 'source-met-transforming-dead', 'source-met-heart-scarab']
    },
    {
      id: 'egypt-afterlife-offerings-continue', title: '墓门关上，饭还要送来', eyebrow: '活人与死者继续来往', timeSpan: timeSpan(-2200, -1100, '约公元前2200—前1100年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [fact('egypt-afterlife-offerings-continue-fact', '安葬结束后，地下墓室被封住，活人却还能走进地上的小礼拜堂。他们把面包、啤酒和肉放到供桌上，念出死者的名字。墙上的假门不会真的打开，却表示死者可以来到这里接受供奉。死亡没有切断家庭关系，只是把见面的方式改变了。', ['source-ucl-tombs', 'source-ucl-cult-offerings'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-false-door-neferiu' }, sourceIds: ['source-ucl-tombs', 'source-ucl-cult-offerings', 'source-met-neferiu-false-door']
    },
    {
      id: 'egypt-afterlife-pyramid-spells', title: '咒语先写在国王的石墙上', eyebrow: '古王国晚期', timeSpan: timeSpan(-2375, -2325, '约公元前2375—前2325年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [fact('egypt-afterlife-pyramid-spells-fact', '比瓦赫早几百年，乌尼斯金字塔的工匠已经在墓室墙上刻满咒语。它们为国王打开天空之门，赶走沿途危险，还要求众神给他道路、食物和力量。当时这些文字主要属于王室墓葬；一位死去的法老，要靠整座金字塔替他说话。', ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-old-unas-pyramid-texts' }, sourceIds: ['source-ucl-religious-texts', 'source-wikimedia-unas-pyramid-texts']
    },
    {
      id: 'egypt-afterlife-coffin-texts', title: '文字搬进了棺材', eyebrow: '中王国', timeSpan: timeSpan(-2050, -1750, '约公元前2050—前1750年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [fact('egypt-afterlife-coffin-texts-fact', '到了瓦赫生活的中王国，许多棺材的内壁也写满了密密麻麻的咒语。棺盖合上后，文字贴近死者，告诉他怎样呼吸、怎样找到食物、怎样变换形态、怎样穿过危险之地。原本刻在王室石墙上的一些话被重新组合，陪伴更多有能力准备精美墓葬的人。', ['source-ucl-coffin-texts', 'source-met-ukhhotep-coffin'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-afterlife-ukhhotep-coffin' }, sourceIds: ['source-ucl-coffin-texts', 'source-met-ukhhotep-coffin']
    },
    {
      id: 'egypt-afterlife-travel-guide', title: '一本带进墓里的旅行指南', eyebrow: '新王国的纸草卷', timeSpan: timeSpan(-1550, -1069, '约公元前1550—前1069年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [fact('egypt-afterlife-travel-guide-fact', '到了新王国，人们把护送死者的咒语抄在可以卷起的纸草上，放进墓里。它像一份随身旅行指南：告诉死者该念什么话、怎样避开怪物、怎样打开大门、怎样重新见到白昼。今天我们把这类卷轴统称为《亡灵书》。它不是一本人人照抄的标准书；墓主人可以挑选需要的咒语，再请书吏和画师写下、画好，陪自己上路。', ['source-ucl-book-of-dead-faq', 'source-bm-book-of-dead'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-afterlife-nesiamun-book-dead' }, sourceIds: ['source-ucl-book-of-dead-faq', 'source-bm-book-of-dead', 'source-met-nesiamun-book-dead']
    },
    {
      id: 'egypt-afterlife-gods-on-road', title: '众神在路上各有事情', eyebrow: '向导、榜样与主人', timeSpan: timeSpan(-1550, -1069, '约公元前1550—前1069年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [synthesis('egypt-afterlife-gods-on-road-synthesis', '死者并不是独自赶路。胡狼头的阿努比斯照看遗体、引他走向天平；太阳神拉每天穿过黑夜，又在清晨升起，给死者重生的希望；曾经死去又重新成为国王的奥西里斯，则在另一个世界等待来客。众神是这场旅程里的向导、榜样和主人。', ['source-bm-egyptian-gods', 'source-bm-afterlife-journey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-afterlife-hatnefer-osiris' }, sourceIds: ['source-bm-egyptian-gods', 'source-bm-afterlife-journey', 'source-met-hatnefer-osiris']
    },
    {
      id: 'egypt-afterlife-heart-trial', title: '心脏不能说谎', eyebrow: '审判大厅', timeSpan: timeSpan(-1550, -1069, '约公元前1550—前1069年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [fact('egypt-afterlife-heart-trial-fact', '旅程来到大厅，阿努比斯把死者的心放上天平，另一边代表正直与秩序。死者要说明自己没有欺骗、偷窃或伤害别人，书写之神则记录结果。如果心通过检验，他便能走向奥西里斯；如果失败，守在天平旁的怪兽会把心吞掉。', ['source-ucl-book-of-dead-125', 'source-bm-afterlife-journey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-afterlife-anubis-weighing-heart' }, sourceIds: ['source-ucl-book-of-dead-125', 'source-bm-afterlife-journey', 'source-met-anubis-weighing-heart']
    },
    {
      id: 'egypt-afterlife-field-work', title: '死后的田野也要下地干活', eyebrow: '理想的来世田野', timeSpan: timeSpan(-1550, -1069, '约公元前1550—前1069年', true), eventIds: ['event-egyptian-funerary-texts-and-rituals-expand'],
      contentBlocks: [fact('egypt-afterlife-field-work-fact', '通过审判后，死者盼望进入一片熟悉又完美的埃及：河水充足，庄稼茂盛，家人团聚。不过田地仍要耕种，沟渠仍要清理。墓里那些握着锄头的小像会在召唤时回答，替主人去劳动。埃及人所向往的永生不在天堂，而是在不会衰败的尼罗河边继续生活。', ['source-ucl-shabtis', 'source-bm-afterlife-journey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-afterlife-seti-shabti' }, sourceIds: ['source-ucl-shabtis', 'source-bm-afterlife-journey', 'source-met-seti-i-shabti']
    },
    {
      id: 'egypt-art-images-work', title: '图像也有工作要做', eyebrow: '图像的用途', timeSpan: timeSpan(-2700, -1100, '约公元前2700—前1100年', true), eventIds: ['event-egyptian-formal-art-conventions-persist'],
      contentBlocks: [fact('egypt-art-images-work-fact', '今天，我们常把艺术挂在墙上欣赏。古埃及神庙和墓中的图像却还要“做事”：墙上的法老不断向神献祭，墓中的食物不断送到死者面前，刻下的名字则让主人不会被遗忘。仪式可能早已结束，人们却相信，只要形象仍在，它代表的行动就能继续。', ['source-met-ancient-egypt-art'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-pyramid-offering-bearers' }, sourceIds: ['source-met-ancient-egypt-art', 'source-met-offering-bearers']
    },
    {
      id: 'egypt-art-composite-body', title: '身体一次朝向好几个方向', eyebrow: '完整的人体', timeSpan: timeSpan(-1550, -1069, '约公元前1550—前1069年', true), eventIds: ['event-egyptian-formal-art-conventions-persist'],
      contentBlocks: [fact('egypt-art-composite-body-fact', '画师会把脸和双腿画成侧面，让鼻子、嘴和迈开的脚清楚可见；眼睛和肩膀却转向正面，让它们保持完整。这样的人体并不是从某个角度看到的一瞬间，而是把每个部分最容易辨认的样子组合起来。画面追求的不是一张快照，而是一个不会缺少重要部分的完整人物。', ['source-met-ancient-egypt-art'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-art-anubis-facsimile' }, sourceIds: ['source-met-ancient-egypt-art', 'source-met-anubis-weighing-heart']
    },
    {
      id: 'egypt-art-size-status', title: '谁最大，谁最重要', eyebrow: '大小与地位', timeSpan: timeSpan(-2458, -2446, '约公元前2458—前2446年', true), eventIds: ['event-egyptian-formal-art-conventions-persist'],
      contentBlocks: [fact('egypt-art-size-status-fact', '一座古王国雕像里，法老萨胡拉端坐在王座上，身边的地方神祇反而比他小。王巾、额头上的眼镜蛇和笔直的假胡须继续告诉观众：中央的人是法老。在古埃及艺术中，画得更大通常不是因为本人更高，而是因为他在这个场面里更重要。', ['source-met-ancient-egypt-art', 'source-met-sahure-statue'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-art-sahure' }, sourceIds: ['source-met-ancient-egypt-art', 'source-met-sahure-statue']
    },
    {
      id: 'egypt-art-statues-live', title: '雕像替主人继续活着', eyebrow: '墓中的身份', timeSpan: timeSpan(-2345, -2181, '约公元前2345—前2181年', true), eventIds: ['event-egyptian-formal-art-conventions-persist'],
      contentBlocks: [fact('egypt-art-statues-live-fact', '古王国官员米特里的墓中放着十一座木雕。他在这些雕像里换了发型、衣服和年龄，有时像官员，有时像书吏，仿佛把一生中不同的身份都留在墓里。雕像不必像现代证件照那样只保留一张面孔；服装、姿势和刻下的名字共同说明“这个人是谁”，让他在死后继续接受供奉。', ['source-met-ancient-egypt-art', 'source-arnold-pyramids', 'source-met-mitry-statue'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-old-mitry-statue' }, sourceIds: ['source-met-ancient-egypt-art', 'source-arnold-pyramids', 'source-met-mitry-statue']
    },
    {
      id: 'egypt-art-hatshepsut-pharaoh', title: '哈特谢普苏特穿上法老的形象', eyebrow: '女性法老', timeSpan: timeSpan(-1479, -1458, '约公元前1479—前1458年', true), eventIds: ['event-egyptian-formal-art-conventions-persist', 'event-hatshepsut-rules-as-pharaoh'],
      contentBlocks: [fact('egypt-art-hatshepsut-pharaoh-fact', '哈特谢普苏特成为法老后，神庙里的她并不只有一种样子。有些雕像保留女性的面容和身体，有些则让她戴上王巾、穿上法老短裙，甚至加上礼仪假胡须。这些形象不是要抹掉她是女性，而是在告诉当时的观众：现在站在众神面前献祭、统治上下埃及的人，是她。', ['source-met-hatshepsut', 'source-met-hatshepsut-publication'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-new-hatshepsut' }, sourceIds: ['source-met-hatshepsut', 'source-met-hatshepsut-publication']
    },
    {
      id: 'egypt-art-amarna-motion', title: '阿玛尔纳让王室动起来', eyebrow: '阿肯那顿的时代', timeSpan: timeSpan(-1353, -1336, '约公元前1353—前1336年', true), eventIds: ['event-egyptian-formal-art-conventions-persist', 'event-amarna-reform'],
      contentBlocks: [fact('egypt-art-amarna-motion-fact', '阿肯那顿把太阳圆盘阿顿放到王室祭祀的中心，新浮雕也出现了陌生的样子：太阳光线伸出一只只小手，国王夫妇抱着孩子、乘车穿过城市，拉长的身体充满动作。可画师没有把旧规则全部丢掉。阿肯那顿抓住一只挣扎的鸭子时，手掌仍被特意转过来，让五根手指都能看清。', ['source-met-akhenaten-city', 'source-met-akhenaten-duck'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-new-akhenaten' }, sourceIds: ['source-met-akhenaten-city', 'source-met-akhenaten-duck']
    },
    {
      id: 'egypt-art-abu-simbel-scale', title: '拉美西斯把自己刻得像山一样高', eyebrow: '阿布辛贝大神庙', timeSpan: timeSpan(-1279, -1213, '约公元前1279—前1213年', true), eventIds: ['event-egyptian-formal-art-conventions-persist'],
      contentBlocks: [fact('egypt-art-abu-simbel-scale-fact', '一个多世纪后，拉美西斯二世在埃及南方边界附近，把神庙直接凿进岩山。入口前坐着四个高约二十一米的拉美西斯，进入神庙后，人们还会一次次遇见他的站像、名字和献祭场面。坚硬的山体、巨大的尺寸和通往神殿的排列共同传达同一件事：国王希望自己的力量像这座山一样难以忽视。', ['source-bm-ramesses-ii-colossal-statue', 'source-egypt-monuments-abu-simbel'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-art-abu-simbel-color' }, sourceIds: ['source-bm-ramesses-ii-colossal-statue', 'source-egypt-monuments-abu-simbel', 'source-wikimedia-abu-simbel-color']
    },
    {
      id: 'egypt-hieroglyph-narmer-name', title: '石板上写着国王的名字', eyebrow: '文字进入王权图像', timeSpan: timeSpan(-3150, -3050, '约公元前3150—前3050年', true), eventIds: ['event-egyptian-writing-system-changes'],
      contentBlocks: [fact('egypt-hieroglyph-narmer-name-fact', '约公元前3100年，刻着纳尔迈尔国王的石板把他画成征服敌人、巡视队伍的统治者。在国王形象上方，几枚小符号被放进一个像宫殿正面的边框里，写出他的名字。画面不再只让人看见“一位国王”，文字还告诉读者：眼前的人是纳尔迈尔。', ['source-ucl-narmer', 'source-ucl-writing-development'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-hieroglyph-narmer' }, sourceIds: ['source-ucl-narmer', 'source-ucl-writing-development', 'source-wikimedia-narmer-palette-cc0']
    },
    {
      id: 'egypt-hieroglyph-word-sound', title: '一幅图既可以是词，也可以是声音', eyebrow: '一套混合书写系统', timeSpan: timeSpan(-2400, -2200, '约公元前2400—前2200年', true), eventIds: ['event-egyptian-writing-system-changes'],
      contentBlocks: [fact('egypt-hieroglyph-word-sound-fact', '一个符号可以直接表示它画出的东西，也可以借来记录这个词中的声音。记录声音时，一枚符号可能代表一个、两个甚至三个辅音。古埃及人通常不把元音写出来，因此一个词往往要由几种符号合作完成。象形文字不是把二十几个字母依次排开，而是在声音和意义之间来回配合。', ['source-ucl-hieroglyphic-system', 'source-bm-hieroglyphs-decipherment'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-hieroglyph-champollion-table' }, sourceIds: ['source-ucl-hieroglyphic-system', 'source-bm-hieroglyphs-decipherment', 'source-wikimedia-champollion-table-pd']
    },
    {
      id: 'egypt-hieroglyph-silent-guides', title: '不出声的符号也在帮助阅读', eyebrow: '词义与阅读方向', timeSpan: timeSpan(-2700, -1100, '约公元前2700—前1100年', true), eventIds: ['event-egyptian-writing-system-changes'],
      contentBlocks: [fact('egypt-hieroglyph-silent-guides-fact', '只写辅音容易让几个词看起来相同，于是书吏常在词尾加上一枚不发音的提示：小人表示这个词与人有关，迈动的腿让人想到行动，城镇符号则把词带向地点。读一行字前，还可以先看鸟、人和动物朝向哪边——它们通常面对这一行的开头，像是在悄悄告诉读者从哪里出发。', ['source-ucl-hieroglyphic-system', 'source-ucl-art-script'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-hieroglyph-karnak-color' }, sourceIds: ['source-ucl-hieroglyphic-system', 'source-ucl-art-script', 'source-wikimedia-karnak-hieroglyphs']
    },
    {
      id: 'egypt-hieroglyph-stone-papyrus', title: '石墙上的字，纸草上的字', eyebrow: '正式书写与日常手写', timeSpan: timeSpan(-2000, -1600, '约公元前2000—前1600年', true), eventIds: ['event-egyptian-writing-system-changes'],
      contentBlocks: [fact('egypt-hieroglyph-stone-papyrus-fact', '神庙和墓室里的象形文字要清楚、端正，最好能和石墙一起长久保存。写信、记账或抄故事时，书吏则用笔在纸草和陶片上快速落下线条，完整图形逐渐缩成僧侣体。两者记录的仍是埃及语，却适合不同场合。会写字需要长期训练，日常文字主要掌握在书吏手中，并不是每个埃及人都会使用。', ['source-ucl-writing-development', 'source-ucl-hieratic', 'source-bm-hieroglyphs-resources'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-middle-sinuhe-papyrus' }, sourceIds: ['source-ucl-writing-development', 'source-ucl-hieratic', 'source-bm-hieroglyphs-resources', 'source-wikimedia-sinuhe-papyrus']
    },
    {
      id: 'egypt-hieroglyph-language-changes', title: '语言变了，书写也跟着变化', eyebrow: '世俗体与科普特文字', timeSpan: timeSpan(-700, 400, '约公元前700—公元400年', true), eventIds: ['event-egyptian-writing-system-changes'],
      contentBlocks: [fact('egypt-hieroglyph-language-changes-fact', '几千年过去，埃及人说话的方式不断变化，书吏的笔迹也越来越简略。后来出现的世俗体常用于账目、合同和书信；再到罗马时代前后，人们开始用希腊字母加上几枚埃及来源的字母书写埃及语，这就是科普特语。它写出了许多旧文字没有标明的声音，后来也帮助学者重新听见古埃及语留下的线索。', ['source-ucl-demotic', 'source-ucl-coptic', 'source-bm-hieroglyphs-decipherment'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-hieroglyph-coptic' }, sourceIds: ['source-ucl-demotic', 'source-ucl-coptic', 'source-bm-hieroglyphs-decipherment', 'source-met-coptic-manuscript']
    },
    {
      id: 'egypt-hieroglyph-alphabet-road', title: '一头牛的名字变成了一个声音', eyebrow: '通向早期字母', timeSpan: timeSpan(-1900, -1500, '约公元前1900—前1500年', true), eventIds: ['event-egyptian-writing-system-changes'],
      contentBlocks: [fact('egypt-hieroglyph-alphabet-road-fact', '约四千年前，在埃及控制的矿区和沙漠道路附近，说闪米特语的人见过埃及人的文字。他们采用了一种新办法：借用图形，却按照自己语言中物体名称的第一个声音来读。牛头在他们的语言里叫作类似“阿列夫”的词，于是牛头符号只留下开头那个辅音。少量符号就能拼写许多词，后来与迦南和腓尼基字母相连的传统也沿用了这种办法。', ['source-yale-wadi-el-hol', 'source-isac-visible-language'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-egypt-hieroglyph-alphabet-chart' }, sourceIds: ['source-yale-wadi-el-hol', 'source-isac-visible-language', 'source-thinkzone-alphabet-chart']
    }
  ];

  const navigationOptions: Collection<'navigationOptions'> = [
    { id: 'nav-egypt-civilization-old', target: { cardId: 'egypt-old-kingdom-overview', sceneId: 'egypt-old-pyramids-horizon' }, basis: { kind: 'relatedCard', cardId: 'egypt-old-kingdom-overview' }, label: '进入金字塔时代的古王国', description: '从尼罗河边的长期文明，走进最早的大型金字塔与支撑它们的王国。' },
    { id: 'nav-egypt-civilization-pyramids', target: { cardId: 'egypt-pyramids-kingdom-at-work', sceneId: 'egypt-pyramid-merer-boats' }, basis: { kind: 'relatedCard', cardId: 'egypt-pyramids-kingdom-at-work' }, label: '走进金字塔工地', description: '跟着运石船、工匠和粮食，看看一座金字塔怎样让整个王国忙起来。' },
    { id: 'nav-egypt-civilization-hieroglyphs', target: { cardId: 'egyptian-hieroglyphs-words-sounds', sceneId: 'egypt-hieroglyph-word-sound' }, basis: { kind: 'relatedCard', cardId: 'egyptian-hieroglyphs-words-sounds' }, label: '读懂象形文字', description: '看看鸟、眼睛和流水的图形怎样同时记录词、声音与意义。' },
    { id: 'nav-egypt-civilization-art', target: { cardId: 'egyptian-art-identity-eternity', sceneId: 'egypt-art-images-work' }, basis: { kind: 'relatedCard', cardId: 'egyptian-art-identity-eternity' }, label: '看古埃及艺术怎样工作', description: '从人物的姿势、大小和服饰中，读出身份、权力与永生。' },
    { id: 'nav-egypt-civilization-afterlife', target: { cardId: 'egypt-afterlife-journey', sceneId: 'egypt-afterlife-wah-wrapped' }, basis: { kind: 'relatedCard', cardId: 'egypt-afterlife-journey' }, label: '进入死后的旅程', description: '跟随一位死者，看身体、供奉、咒语与众神怎样陪他继续生活。' },
    { id: 'nav-egypt-civilization-middle', target: { cardId: 'egypt-middle-kingdom-overview', sceneId: 'egypt-middle-thebes-reunifies' }, basis: { kind: 'relatedCard', cardId: 'egypt-middle-kingdom-overview' }, label: '进入重新统一的中王国', description: '从一次分裂后的重建，理解法老国家怎样重新连接南北。' },
    { id: 'nav-egypt-civilization-new', target: { cardId: 'egypt-new-kingdom-overview', sceneId: 'egypt-new-beyond-borders' }, basis: { kind: 'relatedCard', cardId: 'egypt-new-kingdom-overview' }, label: '进入向外扩张的新王国', description: '看法老的军队、贡赋与外交怎样把埃及带入更广阔的世界。' },
    { id: 'nav-egypt-civilization-collapse', target: { cardId: 'late-bronze-palaces-go-dark', sceneId: 'palaces-egypt-holds' }, basis: { kind: 'relatedCard', cardId: 'late-bronze-palaces-go-dark' }, label: '进入宫殿接连熄灭的时代', description: '把埃及的延续放回晚青铜时代的区域危机中，比较各地截然不同的结局。' },
    { id: 'nav-egypt-civilization-sea', target: { cardId: 'medinet-habu-sea-raiders', sceneId: 'medinet-habu-temple-record' }, basis: { kind: 'relatedCard', cardId: 'medinet-habu-sea-raiders' }, label: '查看法老墙上的海上来敌', description: '从文明的长时段转向一组具体图像，看王室怎样讲述危机与胜利。' },
    { id: 'nav-egypt-old-civilization', target: { cardId: 'ancient-egypt-gift-of-nile', sceneId: 'ancient-egypt-pyramid-kingdom' }, basis: { kind: 'relatedCard', cardId: 'ancient-egypt-gift-of-nile' }, label: '进入尼罗河边的三千年', description: '把古王国放回统一、分裂、再统一与向外扩张的漫长历史中。' },
    { id: 'nav-egypt-middle-civilization', target: { cardId: 'ancient-egypt-gift-of-nile', sceneId: 'ancient-egypt-reunifications' }, basis: { kind: 'relatedCard', cardId: 'ancient-egypt-gift-of-nile' }, label: '进入尼罗河边的三千年', description: '在古埃及跨越多个王朝的长期变化中理解中王国的重新统一。' },
    { id: 'nav-egypt-new-civilization', target: { cardId: 'ancient-egypt-gift-of-nile', sceneId: 'ancient-egypt-power-far-away' }, basis: { kind: 'relatedCard', cardId: 'ancient-egypt-gift-of-nile' }, label: '进入尼罗河边的三千年', description: '在古埃及文明更长的时间尺度中理解新王国的扩张与收缩。' },
    { id: 'nav-egypt-pyramids-civilization', target: { cardId: 'ancient-egypt-gift-of-nile', sceneId: 'ancient-egypt-pyramid-kingdom' }, basis: { kind: 'relatedCard', cardId: 'ancient-egypt-gift-of-nile' }, label: '进入金字塔之外的古埃及', description: '一项王国工程连接着尼罗河、王朝、文字、艺术与宗教共同延续的文明。' },
    { id: 'nav-egypt-art-civilization', target: { cardId: 'ancient-egypt-gift-of-nile', sceneId: 'ancient-egypt-visible-identity' }, basis: { kind: 'relatedCard', cardId: 'ancient-egypt-gift-of-nile' }, label: '进入古埃及文明的全景', description: '艺术中的身份规则属于三千年的王朝、城市与宗教生活。' },
    { id: 'nav-egypt-hieroglyph-civilization', target: { cardId: 'ancient-egypt-gift-of-nile', sceneId: 'ancient-egypt-visible-identity' }, basis: { kind: 'relatedCard', cardId: 'ancient-egypt-gift-of-nile' }, label: '进入象形文字生活的世界', description: '书写连接着尼罗河边的王权、神庙、墓葬与日常管理。' },
    { id: 'nav-egypt-afterlife-civilization', target: { cardId: 'ancient-egypt-gift-of-nile', sceneId: 'ancient-egypt-dead-needs' }, basis: { kind: 'relatedCard', cardId: 'ancient-egypt-gift-of-nile' }, label: '进入古埃及人的现世与来世', description: '墓葬、祭祀与整个国家都生活在同一个尼罗河世界里。' },
    { id: 'nav-egypt-old-middle', target: { cardId: 'egypt-middle-kingdom-overview', sceneId: 'egypt-middle-thebes-reunifies' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-egypt-old-middle-kingdom' }, label: '进入中王国', description: '从古王国结束后的南北分裂，继续看底比斯怎样重新统一埃及。' },
    { id: 'nav-egypt-middle-old', target: { cardId: 'egypt-old-kingdom-overview', sceneId: 'egypt-old-north-south' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-egypt-old-middle-kingdom' }, label: '进入古王国的终点', description: '从中王国的重新统一，理解它所接续的分裂从何而来。' },
    { id: 'nav-egypt-middle-new', target: { cardId: 'egypt-new-kingdom-overview', sceneId: 'egypt-new-ahmose-avaris' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-egypt-middle-new-kingdom' }, label: '进入新王国', description: '从阿瓦里斯与底比斯的对峙，继续看雅赫摩斯怎样建立新的王朝。' },
    { id: 'nav-egypt-new-middle', target: { cardId: 'egypt-middle-kingdom-overview', sceneId: 'egypt-middle-avaris' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-egypt-middle-new-kingdom' }, label: '进入中王国的终点', description: '从雅赫摩斯的胜利，理解阿瓦里斯与底比斯为何会成为两个中心。' },
    { id: 'nav-egypt-old-pyramids', target: { cardId: 'egypt-pyramids-kingdom-at-work', sceneId: 'egypt-pyramid-merer-boats' }, basis: { kind: 'event', eventId: 'event-khufu-great-pyramid-construction' }, label: '走进金字塔工地', description: '跟着梅勒的船队、工匠和粮食，看看一座金字塔怎样让整个王国忙起来。' },
    { id: 'nav-egypt-pyramids-old', target: { cardId: 'egypt-old-kingdom-overview', sceneId: 'egypt-old-pyramids-horizon' }, basis: { kind: 'event', eventId: 'event-khufu-great-pyramid-construction' }, label: '进入金字塔背后的古王国', description: '从一项巨大工程继续理解调动物资、官员和祭祀的王权。' },
    { id: 'nav-egypt-old-afterlife', target: { cardId: 'egypt-afterlife-journey', sceneId: 'egypt-afterlife-wah-wrapped' }, basis: { kind: 'relatedCard', cardId: 'egypt-afterlife-journey' }, label: '进入古埃及的死后世界', description: '从国王墓室继续跟随一位死者，看身体、供奉和咒语怎样陪他上路。' },
    { id: 'nav-egypt-afterlife-old', target: { cardId: 'egypt-old-kingdom-overview', sceneId: 'egypt-old-afterlife-road' }, basis: { kind: 'relatedCard', cardId: 'egypt-old-kingdom-overview' }, label: '进入金字塔背后的古王国', description: '从死后的旅程看古王国为何长期维持墓室、祭祀和供奉。' },
    { id: 'nav-egypt-pyramids-afterlife', target: { cardId: 'egypt-afterlife-journey', sceneId: 'egypt-afterlife-pyramid-spells' }, basis: { kind: 'event', eventId: 'event-unas-pyramid-text-inscription' }, label: '进入死者接下来的旅程', description: '石墙上的咒语只是开端，接着看身体、众神与审判怎样组成整段旅程。' },
    { id: 'nav-egypt-afterlife-pyramids', target: { cardId: 'egypt-pyramids-kingdom-at-work', sceneId: 'egypt-pyramid-walls-speak' }, basis: { kind: 'event', eventId: 'event-unas-pyramid-text-inscription' }, label: '进入文字所在的金字塔', description: '从墓室咒语走进石墙、祭祀与整座建筑群共同运转的地方。' },
    { id: 'nav-egypt-art-old', target: { cardId: 'egypt-old-kingdom-overview', sceneId: 'egypt-old-officials' }, basis: { kind: 'relatedCard', cardId: 'egypt-old-kingdom-overview' }, label: '进入官员维持的古王国', description: '从雕像中的国王与神祇，继续看官员、书吏和地方家族怎样支撑王国。' },
    { id: 'nav-egypt-old-art', target: { cardId: 'egyptian-art-identity-eternity', sceneId: 'egypt-art-size-status' }, basis: { kind: 'relatedCard', cardId: 'egyptian-art-identity-eternity' }, label: '看身份如何出现在艺术里', description: '从古王国官员和法老的职位，转向画面如何用大小、服饰与姿势说明谁更重要。' },
    { id: 'nav-egypt-art-afterlife', target: { cardId: 'egypt-afterlife-journey', sceneId: 'egypt-afterlife-offerings-continue' }, basis: { kind: 'relatedCard', cardId: 'egypt-afterlife-journey' }, label: '进入雕像继续生活的死后世界', description: '从墓中雕像的身份，继续看图像、名字和供奉怎样维持死者的生活。' },
    { id: 'nav-egypt-afterlife-art', target: { cardId: 'egyptian-art-identity-eternity', sceneId: 'egypt-art-statues-live' }, basis: { kind: 'relatedCard', cardId: 'egyptian-art-identity-eternity' }, label: '看雕像怎样留下一个人', description: '从持续供奉的墓室，转向服饰、姿势和名字如何把不同身份留给死者。' },
    { id: 'nav-egypt-art-new', target: { cardId: 'egypt-new-kingdom-overview', sceneId: 'egypt-new-kadesh' }, basis: { kind: 'relatedCard', cardId: 'egypt-new-kingdom-overview' }, label: '进入拉美西斯讲述的卡迭石', description: '从阿布辛贝的巨大国王形象，继续看拉美西斯怎样把一场艰难战斗讲成个人胜利。' },
    { id: 'nav-egypt-new-art', target: { cardId: 'egyptian-art-identity-eternity', sceneId: 'egypt-art-hatshepsut-pharaoh' }, basis: { kind: 'relatedCard', cardId: 'egyptian-art-identity-eternity' }, label: '看哈特谢普苏特怎样成为可见的法老', description: '从女性法老的统治，转向王巾、短裙和假胡须怎样向观众说明她的身份。' },
    { id: 'nav-egypt-hieroglyph-afterlife', target: { cardId: 'egypt-afterlife-journey', sceneId: 'egypt-afterlife-pyramid-spells' }, basis: { kind: 'relatedCard', cardId: 'egypt-afterlife-journey' }, label: '进入石墙文字保护的死后旅程', description: '从日常手写与正式石刻的差别，继续看墓室里的咒语要为死者做什么。' },
    { id: 'nav-egypt-afterlife-hieroglyph', target: { cardId: 'egyptian-hieroglyphs-words-sounds', sceneId: 'egypt-hieroglyph-stone-papyrus' }, basis: { kind: 'relatedCard', cardId: 'egyptian-hieroglyphs-words-sounds' }, label: '看石墙与纸草怎样写字', description: '从金字塔墓室的咒语，转向正式象形文字和书吏日常手写之间的差别。' },
    { id: 'nav-egypt-hieroglyph-pyramids', target: { cardId: 'egypt-pyramids-kingdom-at-work', sceneId: 'egypt-pyramid-walls-speak' }, basis: { kind: 'event', eventId: 'event-unas-pyramid-text-inscription' }, label: '进入文字所在的金字塔', description: '从符号怎样记录词和声音，继续看这些文字为什么会覆盖国王墓室的石墙。' },
    { id: 'nav-egypt-pyramids-hieroglyph', target: { cardId: 'egyptian-hieroglyphs-words-sounds', sceneId: 'egypt-hieroglyph-word-sound' }, basis: { kind: 'event', eventId: 'event-unas-pyramid-text-inscription' }, label: '读懂墙上的符号怎样工作', description: '从乌尼斯墓室里成列的咒语，转向象形文字怎样同时记录词、辅音和意义。' },
    { id: 'nav-egypt-hieroglyph-art', target: { cardId: 'egyptian-art-identity-eternity', sceneId: 'egypt-art-images-work' }, basis: { kind: 'relatedCard', cardId: 'egyptian-art-identity-eternity' }, label: '看文字怎样成为图像的一部分', description: '从不发音的提示和阅读方向，继续看名字、人物与供奉场面为什么要一起留在墙上。' },
    { id: 'nav-egypt-art-hieroglyph', target: { cardId: 'egyptian-hieroglyphs-words-sounds', sceneId: 'egypt-hieroglyph-silent-guides' }, basis: { kind: 'relatedCard', cardId: 'egyptian-hieroglyphs-words-sounds' }, label: '看图形怎样帮助读者认词', description: '从会继续“做事”的墓室图像，转向动物朝向和不发音符号怎样引导阅读。' },
  ];

  const navigationPlacements: Collection<'navigationPlacements'> = [
    { id: 'placement-egypt-civilization-old-inline', navigationOptionId: 'nav-egypt-civilization-old', owner: { kind: 'scene', sceneId: 'ancient-egypt-pyramid-kingdom' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-civilization-pyramids-inline', navigationOptionId: 'nav-egypt-civilization-pyramids', owner: { kind: 'scene', sceneId: 'ancient-egypt-pyramid-kingdom' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-egypt-civilization-hieroglyphs-inline', navigationOptionId: 'nav-egypt-civilization-hieroglyphs', owner: { kind: 'scene', sceneId: 'ancient-egypt-visible-identity' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-civilization-art-inline', navigationOptionId: 'nav-egypt-civilization-art', owner: { kind: 'scene', sceneId: 'ancient-egypt-visible-identity' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-egypt-civilization-afterlife-inline', navigationOptionId: 'nav-egypt-civilization-afterlife', owner: { kind: 'scene', sceneId: 'ancient-egypt-dead-needs' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-civilization-middle-inline', navigationOptionId: 'nav-egypt-civilization-middle', owner: { kind: 'scene', sceneId: 'ancient-egypt-reunifications' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-civilization-new-inline', navigationOptionId: 'nav-egypt-civilization-new', owner: { kind: 'scene', sceneId: 'ancient-egypt-power-far-away' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-civilization-collapse-inline', navigationOptionId: 'nav-egypt-civilization-collapse', owner: { kind: 'scene', sceneId: 'ancient-egypt-survives-palaces' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-civilization-sea-inline', navigationOptionId: 'nav-egypt-civilization-sea', owner: { kind: 'scene', sceneId: 'ancient-egypt-survives-palaces' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-egypt-old-civilization-final', navigationOptionId: 'nav-egypt-old-civilization', owner: { kind: 'scene', sceneId: 'egypt-old-north-south' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-egypt-middle-civilization-final', navigationOptionId: 'nav-egypt-middle-civilization', owner: { kind: 'scene', sceneId: 'egypt-middle-avaris' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-egypt-new-civilization-final', navigationOptionId: 'nav-egypt-new-civilization', owner: { kind: 'scene', sceneId: 'egypt-new-contraction' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-egypt-pyramids-civilization-final', navigationOptionId: 'nav-egypt-pyramids-civilization', owner: { kind: 'scene', sceneId: 'egypt-pyramid-walls-speak' }, slot: 'inline', rank: 3, visible: true, interactive: true },
    { id: 'placement-egypt-art-civilization-final', navigationOptionId: 'nav-egypt-art-civilization', owner: { kind: 'scene', sceneId: 'egypt-art-abu-simbel-scale' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-egypt-hieroglyph-civilization-final', navigationOptionId: 'nav-egypt-hieroglyph-civilization', owner: { kind: 'scene', sceneId: 'egypt-hieroglyph-alphabet-road' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-afterlife-civilization-final', navigationOptionId: 'nav-egypt-afterlife-civilization', owner: { kind: 'scene', sceneId: 'egypt-afterlife-field-work' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-old-middle-inline', navigationOptionId: 'nav-egypt-old-middle', owner: { kind: 'scene', sceneId: 'egypt-old-north-south' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-middle-old-inline', navigationOptionId: 'nav-egypt-middle-old', owner: { kind: 'scene', sceneId: 'egypt-middle-thebes-reunifies' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-middle-new-inline', navigationOptionId: 'nav-egypt-middle-new', owner: { kind: 'scene', sceneId: 'egypt-middle-avaris' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-new-middle-inline', navigationOptionId: 'nav-egypt-new-middle', owner: { kind: 'scene', sceneId: 'egypt-new-ahmose-avaris' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-old-pyramids-inline', navigationOptionId: 'nav-egypt-old-pyramids', owner: { kind: 'scene', sceneId: 'egypt-old-pyramids-horizon' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-pyramids-old-closing', navigationOptionId: 'nav-egypt-pyramids-old', owner: { kind: 'card', cardId: 'egypt-pyramids-kingdom-at-work' }, slot: 'closing', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-old-afterlife-inline', navigationOptionId: 'nav-egypt-old-afterlife', owner: { kind: 'scene', sceneId: 'egypt-old-afterlife-road' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-afterlife-old-inline', navigationOptionId: 'nav-egypt-afterlife-old', owner: { kind: 'scene', sceneId: 'egypt-afterlife-pyramid-spells' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-egypt-pyramids-afterlife-inline', navigationOptionId: 'nav-egypt-pyramids-afterlife', owner: { kind: 'scene', sceneId: 'egypt-pyramid-walls-speak' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-afterlife-pyramids-inline', navigationOptionId: 'nav-egypt-afterlife-pyramids', owner: { kind: 'scene', sceneId: 'egypt-afterlife-pyramid-spells' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-art-old-inline', navigationOptionId: 'nav-egypt-art-old', owner: { kind: 'scene', sceneId: 'egypt-art-size-status' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-old-art-inline', navigationOptionId: 'nav-egypt-old-art', owner: { kind: 'scene', sceneId: 'egypt-old-officials' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-art-afterlife-inline', navigationOptionId: 'nav-egypt-art-afterlife', owner: { kind: 'scene', sceneId: 'egypt-art-statues-live' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-afterlife-art-inline', navigationOptionId: 'nav-egypt-afterlife-art', owner: { kind: 'scene', sceneId: 'egypt-afterlife-offerings-continue' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-art-new-inline', navigationOptionId: 'nav-egypt-art-new', owner: { kind: 'scene', sceneId: 'egypt-art-abu-simbel-scale' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-new-art-inline', navigationOptionId: 'nav-egypt-new-art', owner: { kind: 'scene', sceneId: 'egypt-new-hatshepsut' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-hieroglyph-afterlife-inline', navigationOptionId: 'nav-egypt-hieroglyph-afterlife', owner: { kind: 'scene', sceneId: 'egypt-hieroglyph-stone-papyrus' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-afterlife-hieroglyph-inline', navigationOptionId: 'nav-egypt-afterlife-hieroglyph', owner: { kind: 'scene', sceneId: 'egypt-afterlife-pyramid-spells' }, slot: 'inline', rank: 3, visible: true, interactive: true },
    { id: 'placement-egypt-hieroglyph-pyramids-inline', navigationOptionId: 'nav-egypt-hieroglyph-pyramids', owner: { kind: 'scene', sceneId: 'egypt-hieroglyph-word-sound' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-pyramids-hieroglyph-inline', navigationOptionId: 'nav-egypt-pyramids-hieroglyph', owner: { kind: 'scene', sceneId: 'egypt-pyramid-walls-speak' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-egypt-hieroglyph-art-inline', navigationOptionId: 'nav-egypt-hieroglyph-art', owner: { kind: 'scene', sceneId: 'egypt-hieroglyph-silent-guides' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-egypt-art-hieroglyph-inline', navigationOptionId: 'nav-egypt-art-hieroglyph', owner: { kind: 'scene', sceneId: 'egypt-art-images-work' }, slot: 'inline', rank: 1, visible: true, interactive: true },
  ];

  const cameraPresets: Collection<'cameraPresets'> = [
    { id: 'camera-egypt-upper-lower', center: [31.4, 27.8], scale: 4.8 },
    { id: 'camera-egypt-middle-centers', center: [31.5, 27.8], scale: 5.2 },
    { id: 'camera-egypt-thebes-avaris', center: [32.1, 27.8], scale: 4.9 },
    { id: 'camera-egypt-new-reach', center: [33.2, 27.5], scale: 3.5 }
  ];

  const geometries: Collection<'geometries'> = [
    {
      id: 'geometry-egypt-upper-lower',
      geometry: { type: 'MultiPoint', coordinates: [[32.64, 25.69], [31.1, 30.7]] },
      timeSpan: timeSpan(-3150, -3050, '上下埃及统一前后的教学选点', true), approximate: true,
      label: '上埃及南方河谷与下埃及北方三角洲（近似教学选点）',
      sourceIds: ['source-ucl-narmer', 'source-natural-earth']
    },
    {
      id: 'geometry-egypt-middle-centers',
      geometry: { type: 'MultiPoint', coordinates: [[30.9, 29.1], [31.25, 29.85], [32.64, 25.69]] },
      timeSpan: timeSpan(-2250, -2010, '古王国结束至中王国初期的教学选点', true), approximate: true,
      label: '赫拉克利奥波利斯、孟斐斯与底比斯（近似教学选点）',
      sourceIds: ['source-muller-old-kingdom-end', 'source-ucl-mentuhotep-ii', 'source-natural-earth']
    },
    {
      id: 'geometry-egypt-thebes-avaris',
      geometry: { type: 'MultiPoint', coordinates: [[32.64, 25.69], [31.84, 30.79]] },
      timeSpan: timeSpan(-1700, -1525, '底比斯与阿瓦里斯对峙时期的教学选点', true), approximate: true,
      label: '底比斯与阿瓦里斯（近似教学选点）',
      sourceIds: ['source-ucl-second-intermediate', 'source-ucl-ahmose', 'source-natural-earth']
    },
    {
      id: 'geometry-egypt-new-reach',
      geometry: { type: 'MultiLineString', coordinates: [[[31.2, 30], [35.18, 32.58], [36.5, 34.56]], [[32.64, 25.69], [32.9, 24.1], [31.5, 21.9]]] },
      timeSpan: timeSpan(-1550, -1258, '新王国向努比亚与西亚延伸的教学联系', true), approximate: true,
      label: '新王国向努比亚与西亚延伸（近似教学联系，非行军路线）',
      sourceIds: ['source-met-new-kingdom', 'source-ucl-nubia-new-kingdom', 'source-met-amarna-letters', 'source-bm-kadesh-sallier', 'source-natural-earth']
    }
  ];

  const mapStates: Collection<'mapStates'> = [
    { id: 'map-egypt-upper-lower', cameraPresetId: 'camera-egypt-upper-lower', layers: [{ kind: 'geometry', geometryId: 'geometry-egypt-upper-lower', timeSpan: timeSpan(-3150, -3050, '上下埃及统一前后', true), sourceIds: ['source-ucl-narmer', 'source-natural-earth'] }] },
    { id: 'map-egypt-middle-centers', cameraPresetId: 'camera-egypt-middle-centers', layers: [{ kind: 'geometry', geometryId: 'geometry-egypt-middle-centers', timeSpan: timeSpan(-2250, -2010, '古王国结束至中王国初期', true), sourceIds: ['source-muller-old-kingdom-end', 'source-ucl-mentuhotep-ii', 'source-natural-earth'] }] },
    { id: 'map-egypt-thebes-avaris', cameraPresetId: 'camera-egypt-thebes-avaris', layers: [{ kind: 'geometry', geometryId: 'geometry-egypt-thebes-avaris', timeSpan: timeSpan(-1700, -1525, '底比斯与阿瓦里斯对峙时期', true), sourceIds: ['source-ucl-second-intermediate', 'source-ucl-ahmose', 'source-natural-earth'] }] },
    { id: 'map-egypt-new-reach', cameraPresetId: 'camera-egypt-new-reach', layers: [{ kind: 'geometry', geometryId: 'geometry-egypt-new-reach', timeSpan: timeSpan(-1550, -1258, '新王国向努比亚与西亚延伸', true), sourceIds: ['source-met-new-kingdom', 'source-ucl-nubia-new-kingdom', 'source-met-amarna-letters', 'source-bm-kadesh-sallier', 'source-natural-earth'] }] }
  ];

  function associatedAnnotation(id: string, entityId: string, coordinates: Position, sourceIds: SourceIds, placement: ScreenPlacement, label: string): MapAnnotation {
    return { id, subject: { kind: 'entity', entityId }, anchor: { kind: 'geo', coordinates }, anchorMeaning: 'associatedWith', approximate: true, sourceIds, placement, label };
  }

  const mapAnnotations: Collection<'mapAnnotations'> = [
    associatedAnnotation('annotation-ancient-egypt-nile-south', 'ancient-egypt-civilization', [32.64, 25.69], ['source-met-telling-time-egypt'], 'left', '南方河谷'),
    associatedAnnotation('annotation-ancient-egypt-nile-north', 'ancient-egypt-civilization', [31.1, 30.7], ['source-met-telling-time-egypt'], 'right', '北方三角洲'),
    associatedAnnotation('annotation-egypt-upper', 'egypt-old-kingdom', [32.64, 25.69], ['source-ucl-narmer'], 'left', '上埃及（南方河谷）'),
    associatedAnnotation('annotation-egypt-lower', 'egypt-old-kingdom', [31.1, 30.7], ['source-ucl-narmer'], 'right', '下埃及（北方三角洲）'),
    associatedAnnotation('annotation-egypt-middle-north', 'egypt-old-kingdom', [30.9, 29.1], ['source-muller-old-kingdom-end'], 'left', '北方中心'),
    associatedAnnotation('annotation-egypt-middle-south', 'egypt-middle-kingdom', [32.64, 25.69], ['source-ucl-mentuhotep-ii'], 'right', '底比斯（南方中心）'),
    associatedAnnotation('annotation-egypt-middle-avaris', 'egypt-middle-kingdom', [31.84, 30.79], ['source-ucl-second-intermediate'], 'right', '阿瓦里斯（北方中心）'),
    associatedAnnotation('annotation-egypt-new-thebes', 'egypt-new-kingdom', [32.64, 25.69], ['source-ucl-ahmose'], 'left', '底比斯'),
    associatedAnnotation('annotation-egypt-new-avaris', 'egypt-new-kingdom', [31.84, 30.79], ['source-ucl-ahmose'], 'right', '阿瓦里斯'),
    associatedAnnotation('annotation-egypt-new-core', 'egypt-new-kingdom', [31.5, 27.7], ['source-met-new-kingdom'], 'left', '尼罗河谷核心'),
    associatedAnnotation('annotation-egypt-new-nubia', 'egypt-new-kingdom', [31.5, 21.9], ['source-ucl-nubia-new-kingdom'], 'left', '努比亚方向'),
    associatedAnnotation('annotation-egypt-new-west-asia', 'egypt-new-kingdom', [35.18, 32.58], ['source-met-amarna-letters'], 'right', '西亚方向'),
    associatedAnnotation('annotation-egypt-new-levant', 'egypt-new-kingdom', [35.18, 32.58], ['source-met-amarna-letters'], 'right', '黎凡特方向'),
    associatedAnnotation('annotation-egypt-new-kadesh', 'egypt-new-kingdom', [36.5, 34.56], ['source-bm-kadesh-sallier', 'source-un-egypt-hatti-treaty'], 'right', '卡迭石')
  ];

  const assets: Collection<'assets'> = [
    { id: 'asset-egypt-old-giza-pyramids', type: 'image', src: 'assets/images/ancient-egypt/old-kingdom-giza-pyramids.webp', title: '吉萨三座大金字塔', alt: '沙漠地平线上的胡夫、哈夫拉与孟卡拉金字塔实景照片，三座金字塔按远近排列。', sourceIds: ['source-wikimedia-giza-pyramids'] },
    { id: 'asset-egypt-old-unas-pyramid-texts', type: 'image', src: 'assets/images/ancient-egypt/old-kingdom-unas-pyramid-texts.webp', title: '乌尼斯金字塔墓室内的文字', alt: '乌尼斯金字塔墓室的历史照片，成列象形文字覆盖在石壁表面。', sourceIds: ['source-wikimedia-unas-pyramid-texts'] },
    { id: 'asset-egypt-old-mitry-statue', type: 'image', src: 'assets/images/ancient-egypt/old-kingdom-mitry-statue.webp', title: '官员米特里的木雕像', alt: '彩绘木雕表现站立的官员米特里，他短发、赤裸上身，穿着白色短裙。', sourceIds: ['source-met-mitry-statue'] },
    { id: 'asset-egypt-middle-sinuhe-papyrus', type: 'image', src: 'assets/images/ancient-egypt/middle-kingdom-sinuhe-papyrus.webp', title: '《辛奴赫的故事》纸草摹本', alt: '横向展开的纸草摹本上排列着多行黑色僧侣体文字。', sourceIds: ['source-wikimedia-sinuhe-papyrus'] },
    { id: 'asset-egypt-new-hatshepsut', type: 'image', src: 'assets/images/ancient-egypt/new-kingdom-hatshepsut.webp', title: '哈特谢普苏特坐像', alt: '哈特谢普苏特的浅色石雕坐像，头戴王巾，双手平放在膝上。', sourceIds: ['source-met-hatshepsut'] },
    { id: 'asset-egypt-new-amarna-letter', type: 'image', src: 'assets/images/ancient-egypt/new-kingdom-amarna-letter.webp', title: '阿玛尔纳书信泥板', alt: '一块小型长方形泥板，正面覆盖着密集的楔形文字。', sourceIds: ['source-met-amarna-letter-object'] },
    { id: 'asset-egypt-new-akhenaten', type: 'image', src: 'assets/images/ancient-egypt/new-kingdom-akhenaten.webp', title: '阿肯那顿向阿顿献祭', alt: '彩绘石灰岩浮雕表现阿肯那顿手持鸭子献祭，上方太阳圆盘的光线末端伸出小手。', sourceIds: ['source-met-akhenaten-duck'] },
    { id: 'asset-egypt-new-strike-papyrus', type: 'image', src: 'assets/images/ancient-egypt/new-kingdom-strike-papyrus.webp', title: '都灵罢工纸草', alt: '横向展开的棕色纸草残卷装裱在玻璃框内，纸面写满深色僧侣体文字，右侧有几块分离的残片。', sourceIds: ['source-turin-strike-papyrus'] },
    { id: 'asset-egypt-pyramid-djoser-step', type: 'image', src: 'assets/images/ancient-egypt/djoser-step-pyramid.webp', title: '左塞尔阶梯金字塔', alt: '萨卡拉沙漠中的左塞尔阶梯金字塔实景，六层石台逐级向上收窄。', sourceIds: ['source-wikimedia-djoser-step'] },
    { id: 'asset-egypt-pyramid-bent-angle', type: 'image', src: 'assets/images/ancient-egypt/bent-pyramid-angle.webp', title: '达舒尔弯曲金字塔', alt: '弯曲金字塔从近处仰望的实景，塔身在较高位置明显改变坡度。', sourceIds: ['source-wikimedia-bent-pyramid'] },
    { id: 'asset-egypt-pyramid-oarsmen-relief', type: 'image', src: 'assets/images/ancient-egypt/pyramid-oarsmen-official-met.webp', title: '古王国船运浮雕。船上的大型货物可能是石块或建筑构件；这件浮雕并不直接描绘梅勒的船队。', alt: '一块古王国石灰岩浮雕，上部刻着奋力划船的船员和绑在甲板上的大型货物，下部是一名站立的官员。', sourceIds: ['source-met-oarsmen-official', 'source-wikimedia-oarsmen-official'] },
    { id: 'asset-egypt-pyramid-giza-complex-map', type: 'image', src: 'assets/images/ancient-egypt/pyramid-giza-complex-map.webp', title: '吉萨金字塔建筑群地图；左侧的“Builders’ quarters”标出建造者居住区。', alt: '吉萨金字塔建筑群英文地图，标出三座主要金字塔、神庙、堤道、墓地、采石场、狮身人面像与建造者居住区。', sourceIds: ['source-wikimedia-giza-complex-map'] },
    { id: 'asset-egypt-pyramid-offering-bearers', type: 'image', src: 'assets/images/ancient-egypt/old-kingdom-offering-bearers.webp', title: '运送食物的古王国人物模型', alt: '古王国彩绘木质人物模型，多名人物排成一列，用篮筐和容器运送食物与物资。', sourceIds: ['source-met-offering-bearers'] },
    { id: 'asset-egypt-false-door-neferiu', type: 'image', src: 'assets/images/ancient-egypt/false-door-neferiu.webp', title: '尼费里乌的假门', alt: '石灰岩墓葬假门上刻有人物、供品与象形文字，为死者接受供奉提供象征通道。', sourceIds: ['source-met-neferiu-false-door'] },
    { id: 'asset-egypt-afterlife-wah-statuette', type: 'image', src: 'assets/images/ancient-egypt/statuette-of-wah.webp', title: '瓦赫的小雕像', alt: '中王国管仓库者瓦赫的彩绘木雕立像，人物穿白色亚麻衣站立。', sourceIds: ['source-met-wah-statuette'] },
    { id: 'asset-egypt-afterlife-heart-scarab', type: 'image', src: 'assets/images/ancient-egypt/heart-scarab.webp', title: '心形圣甲虫护身符', alt: '深绿色石制心形圣甲虫护身符，背部呈甲虫形状，底面刻有文字。', sourceIds: ['source-met-heart-scarab'] },
    { id: 'asset-egypt-afterlife-ukhhotep-coffin', type: 'image', src: 'assets/images/ancient-egypt/ukhhotep-0.webp', title: '乌赫霍特普的外棺', alt: '中王国木棺完全展开的博物馆照片，内外表面绘有人物、物品并写满成行文字。', sourceIds: ['source-met-ukhhotep-coffin'] },
    { id: 'asset-egypt-afterlife-nesiamun-book-dead', type: 'image', src: 'assets/images/ancient-egypt/book-of-dead-nesiamun-original.webp', title: '内西亚蒙的《亡灵书》纸草卷', alt: '横向展开的新王国纸草卷，上方有多行文字，下方绘制死者、众神和仪式场景。', sourceIds: ['source-met-nesiamun-book-dead'] },
    { id: 'asset-egypt-afterlife-hatnefer-osiris', type: 'image', src: 'assets/images/ancient-egypt/osiris-figure-hatnefer.webp', title: '哈特奈弗墓中的奥西里斯像', alt: '小型木质奥西里斯立像，神戴高冠、身体包裹成木乃伊形状，双手交叉在胸前。', sourceIds: ['source-met-hatnefer-osiris'] },
    { id: 'asset-egypt-afterlife-anubis-weighing-heart', type: 'image', src: 'assets/images/ancient-egypt/anubis-weighing-heart.webp', title: '阿努比斯称量心脏', alt: '纸草画面中胡狼头的阿努比斯站在天平旁，监督死者心脏的称量。', sourceIds: ['source-met-anubis-weighing-heart'] },
    { id: 'asset-egypt-afterlife-seti-shabti', type: 'image', src: 'assets/images/ancient-egypt/shabti-seti-i.webp', title: '塞提一世的沙布提小像', alt: '蓝绿色人形陪葬小像双臂交叉，手中握着用于来世劳动的工具。', sourceIds: ['source-met-seti-i-shabti'] },
    { id: 'asset-egypt-art-anubis-facsimile', type: 'image', src: 'assets/images/ancient-egypt/anubis-weighing-heart.webp', title: '阿努比斯称量心脏（现代1:1摹本）', alt: '现代等比例摹本重现古埃及纸草画面：胡狼头的阿努比斯站在天平旁，人物的脸与双腿朝向侧面，眼睛与肩膀更接近正面。', sourceIds: ['source-met-anubis-weighing-heart'] },
    { id: 'asset-egypt-art-sahure', type: 'image', src: 'assets/images/ancient-egypt/old-kingdom-sahure-statue.webp', title: '法老萨胡拉与地方神祇', alt: '深色石雕中，戴王巾的法老萨胡拉端坐在高大王座上，一位体量较小的地方神祇站在他身旁。', sourceIds: ['source-met-sahure-statue'] },
    { id: 'asset-egypt-art-abu-simbel-color', type: 'image', src: 'assets/images/ancient-egypt/art-abu-simbel-color.webp', title: '阿布辛贝大神庙正面', alt: '彩色照片中，阿布辛贝大神庙从赭色岩山中凿出，入口两侧排列着四尊巨大的拉美西斯二世坐像。', sourceIds: ['source-wikimedia-abu-simbel-color'] },
    { id: 'asset-egypt-hieroglyph-narmer', type: 'image', src: 'assets/images/ancient-egypt/hieroglyph-narmer-palette.webp', title: '纳尔迈尔石板', alt: '灰绿色石板正面刻着头戴白冠的纳尔迈尔举起权杖，国王头顶的宫殿形边框中写有他的名字。', sourceIds: ['source-wikimedia-narmer-palette-cc0'] },
    { id: 'asset-egypt-hieroglyph-coptic', type: 'image', src: 'assets/images/ancient-egypt/hieroglyph-coptic-manuscript.webp', title: '科普特语羊皮纸手稿', alt: '一张棕黄色的科普特语手稿残页，墨写字母排成多行，字形接近希腊字母。', sourceIds: ['source-met-coptic-manuscript'] },
    { id: 'asset-egypt-hieroglyph-champollion-table', type: 'image', src: 'assets/images/ancient-egypt/hieroglyph-champollion-table.webp', title: '商博良1822年的语音符号对照表', alt: '一张黑白历史表格把多种世俗体写法和象形文字符号按语音分行排列；这是商博良研究解读文字时制作的表格，并非古埃及人使用的字母表。', sourceIds: ['source-wikimedia-champollion-table-pd'] },
    { id: 'asset-egypt-hieroglyph-karnak-color', type: 'image', src: 'assets/images/ancient-egypt/hieroglyph-karnak-color.webp', title: '卡尔纳克神庙梁柱上的彩色文字', alt: '仰视照片中，两根巨柱之间的石梁保留着彩色象形文字；鸟、人和其他图形朝着特定方向排列。', sourceIds: ['source-wikimedia-karnak-hieroglyphs'] },
    { id: 'asset-egypt-old-unas-exterior', type: 'image', src: 'assets/images/ancient-egypt/old-kingdom-unas-exterior.webp', title: '今天的乌尼斯金字塔', alt: '萨卡拉遗址中的乌尼斯金字塔如今像一座低矮的沙石丘，前方仍能看到建筑墙体和散落石块。', sourceIds: ['source-wikimedia-unas-exterior'] },
    { id: 'asset-egypt-hieroglyph-alphabet-chart', type: 'image', src: 'assets/images/ancient-egypt/hieroglyph-egyptian-to-sinaitic-chart.webp', title: '埃及象形文字到原始西奈文字示意图（简化且有推测）', alt: '彩色表格从左到右排列埃及象形文字、原始西奈文字、腓尼基字母、古希腊字母和拉丁字母，第一行显示牛头图形逐渐变成字母A的过程。', sourceIds: ['source-thinkzone-alphabet-chart'] }
  ];

  export const ancientEgyptData = {
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
