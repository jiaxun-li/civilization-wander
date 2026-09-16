import type { Source } from '../schema/index.ts';
import frozenV5SourceSnapshot from '../migration/baseline/sources-v5.json' with { type: 'json' };

/**
 * Immutable source boundary for the structure-only migration. This reads the
 * frozen V5 snapshot, never the live V5 aggregator, so later V5 edits cannot
 * silently change an approved V6 core.
 */
export const FROZEN_V5_SOURCE_DIGEST = frozenV5SourceSnapshot.digest;

export const FROZEN_V5_SOURCES = frozenV5SourceSnapshot.sources satisfies readonly Source[];

/** Explicit V6 editorial additions; the migration baseline remains immutable. */
export const REVIEWED_V6_SOURCES = [
{
  "id": "source-qian-huang-cast-iron-reviewed",
  "title": "Invention of cast iron smelting in early China: Archaeological survey and numerical simulation",
  "author": "Wei Qian and Xing Huang",
  "year": 2021,
  "publisher": "Advances in Archaeomaterials 2(1), 4–14",
  "url": "https://www.sciencedirect.com/science/article/pii/S2667136021000017"
},
{
  "id": "source-han-chen-casting-iron-reviewed",
  "title": "Casting iron in ancient China",
  "author": "Han Rubin and Chen Jianli",
  "year": 2013,
  "publisher": "Archaeometallurgy in Europe III, pp. 168–177; author copy hosted by Peking University",
  "url": "https://archaeology.pku.edu.cn/2013Casting-iron-in-ancient-China.pdf"
},
{
  "id": "source-cdli-hammurabi-year-31-reviewed",
  "title": "Babylon Hammu-rabi 31a: defeat of Rim-Sin",
  "publisher": "Cuneiform Digital Library Initiative",
  "url": "https://cdli-gh.github.io/year-names/GLOSSAR/T12K06Y48.htm"
},
  {
    id: 'source-oeaw-avaris', title: 'Tell el-Dabʿa / Avaris',
    publisher: 'Austrian Archaeological Institute, Austrian Academy of Sciences',
    url: 'https://www.oeaw.ac.at/en/oeai/institute/branches/cairo/excavations-projects/tell-el-dab%CA%BFa'
  },
  {
    id: 'source-bm-who-was-homer', title: 'Who was Homer?', author: 'Daisy Dunn',
    publisher: 'British Museum', year: 2019,
    url: 'https://www.britishmuseum.org/blog/who-was-homer'
  },
  {
    id: 'source-oxford-tale-sinuhe', title: 'The Tale of Sinuhe',
    publisher: 'University of Oxford, Faculty of Asian and Middle Eastern Studies',
    url: 'https://www.orinst.ox.ac.uk/article/tale-sinuhe'
  }
,
{"id":"source-oracc-language-continuity","title":"Lexical lists and bilingualism in Mesopotamia","publisher":"Oracc / Digital Corpus of Cuneiform Lexical Texts","url":"https://oracc.museum.upenn.edu/dcclt/intro/lexical_intro.html"},
{"id":"source-met-sumerian-writing","title":"Cuneiform tablet: administrative account with entries concerning malt and barley groats","publisher":"The Metropolitan Museum of Art","url":"https://www.metmuseum.org/art/collection/search/327385"},
{"id":"source-ucl-egyptian-language","title":"Languages spoken in Egypt","publisher":"University College London, Digital Egypt","url":"https://www.ucl.ac.uk/museums-static/digitalegypt/sound/index.html"},
{"id":"source-ucl-writing-scope","title":"Scope of writing in ancient Egypt","publisher":"University College London, Digital Egypt","url":"https://www.ucl.ac.uk/museums-static/digitalegypt/writing/writingscope.html"}
,
{
  "id": "source-cambridge-greek-language-reviewed",
  "title": "The Decipherment of Linear B: Introduction",
  "publisher": "University of Cambridge, Faculty of Classics",
  "url": "https://www.classics.cam.ac.uk/ORDER/seminars/projects/mycep/decipherment"
},
{
  "id": "source-cambridge-linear-b-reviewed",
  "title": "Mycenaean Epigraphy Group",
  "publisher": "University of Cambridge, Faculty of Classics",
  "url": "https://www.classics.cam.ac.uk/research/projects/mycep"
},
{
  "id": "source-cambridge-linear-a-reviewed",
  "title": "Linear A",
  "publisher": "University of Cambridge Repository",
  "url": "https://www.repository.cam.ac.uk/items/f50c0df4-f355-4bc0-be2a-8e960b2bb5da",
  "author": "Ester Salgarella"
},
{
  "id": "source-bm-greek-alphabet-reviewed",
  "title": "Greece 1050–520 BC",
  "publisher": "British Museum",
  "url": "https://www.britishmuseum.org/collection/galleries/greece-1050-520-bc"
},
{
  "id": "source-chicago-hittite-language-reviewed",
  "title": "The Chicago Hittite Dictionary Project",
  "publisher": "University of Chicago, Institute for the Study of Ancient Cultures",
  "url": "https://isac.uchicago.edu/research/projects/hit/chicago-hittite-dictionary-project"
},
{
  "id": "source-sardis-lydian-language-reviewed",
  "title": "Lydian Language and Inscriptions",
  "publisher": "Archaeological Exploration of Sardis",
  "url": "https://sardisexpedition.org/en/essays/latw-melchert-lydian-language",
  "author": "H. Craig Melchert"
},
{
  "id": "source-sns-phoenician-reviewed",
  "title": "Phoenician",
  "publisher": "Scuola Normale Superiore, Mnamon",
  "url": "https://mnamon.sns.it/index.php?id=23&lang=en&page=Scrittura",
  "author": "Paolo Merlo"
},
{
  "id": "source-sns-hebrew-reviewed",
  "title": "Hebrew",
  "publisher": "Scuola Normale Superiore, Mnamon",
  "url": "https://mnamon.sns.it/index.php?id=8&lang=en&page=Scrittura",
  "author": "Daniele Tripaldi; Valentina Marchetto"
},
{
  "id": "source-iranica-aramaic-periods-reviewed",
  "title": "Aramaic",
  "publisher": "Encyclopaedia Iranica",
  "url": "https://www.iranicaonline.org/articles/iran-vii10-aramaic/",
  "author": "Gernot L. Windfuhr"
},
{
  "id": "source-iranica-elamite-language-reviewed",
  "title": "Elam: Elamite Language",
  "publisher": "Encyclopaedia Iranica",
  "url": "https://www.iranicaonline.org/articles/elam-v/",
  "author": "Françoise Grillot-Susini"
},
{
  "id": "source-iranica-old-persian-epigraphy-reviewed",
  "title": "Epigraphy: Old Persian and Middle Iranian epigraphy",
  "publisher": "Encyclopaedia Iranica",
  "url": "https://www.iranicaonline.org/articles/epigraphy-i/"
},
{
  "id": "source-schuessler-old-chinese-reviewed",
  "title": "Minimal Old Chinese and Later Han Chinese: A Companion to Grammata Serica Recensa",
  "publisher": "University of Hawai‘i Press",
  "url": "https://uhpress.hawaii.edu/title/minimal-old-chinese-and-later-han-chinese-a-companion-to-grammata-serica-recensa/",
  "author": "Axel Schuessler"
},
{
  "id": "source-penn-oracle-bone-reviewed",
  "title": "The Case of the Wayward Oracle Bone",
  "publisher": "Penn Museum, Expedition 43(2)",
  "url": "https://www.penn.museum/sites/expedition/the-case-of-the-wayward-oracle-bone/",
  "author": "Victor H. Mair"
},
{
  "id": "source-met-zhou-inscriptions-reviewed",
  "title": "Spouted Ritual Water Vessel (He)",
  "publisher": "The Metropolitan Museum of Art",
  "url": "https://www.metmuseum.org/art/collection/search/42168"
},
{
  "id": "source-witzel-vedic-language-reviewed",
  "title": "Vedic tradition: stratification and oral transmission",
  "publisher": "Research correspondence archived by Frances Pritchett",
  "url": "https://franpritchett.com/00indciv/04upan/txt_witzel_2006.html",
  "author": "Michael Witzel"
},
{
  "id": "source-kenoyer-indus-signs-reviewed",
  "title": "How old is the oldest ancient Indus writing?",
  "publisher": "Harappa.com: researcher responses",
  "url": "https://www.harappa.com/answers/how-old-oldest-ancient-indus-writing",
  "author": "Jonathan Mark Kenoyer; Asko Parpola; Nisha Yadav"
},
{
  "id": "source-indus-undeciphered-reviewed",
  "title": "A Markov model of the Indus script",
  "publisher": "Proceedings of the National Academy of Sciences",
  "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC2721819/"
}
,
{
  "id": "source-bm-akkadian-regional-forms-reviewed",
  "title": "Akkadian: language history and Babylonian and Assyrian forms",
  "publisher": "The British Museum",
  "url": "https://www.britishmuseum.org/collection/term/x13587"
}
,
{
  "id": "source-chicago-akkadian-usage",
  "title": "Akkadian Language Program",
  "publisher": "University of Chicago",
  "url": "https://mes.uchicago.edu/language-study/akkadian-language-program"
},
{
  "id": "source-met-assyrian-letter-usage",
  "title": "Cuneiform tablet: private letter",
  "publisher": "The Metropolitan Museum of Art",
  "url": "https://www.metmuseum.org/art/collection/search/325842"
},
{
  "id": "source-ucl-egyptian-literacy-usage",
  "title": "Language and Literacy",
  "publisher": "University College London, Petrie Museum",
  "url": "https://www.ucl.ac.uk/3dpetriemuseum/stories/ancient-life/egyptian-life/language-and-literacy.html"
},
{
  "id": "source-ucl-hieratic-usage",
  "title": "Hieratic script",
  "publisher": "University College London, Digital Egypt",
  "url": "https://www.ucl.ac.uk/museums-static/digitalegypt/writing/hieratic.html"
},
{
  "id": "source-bm-greek-public-writing-usage",
  "title": "Classical inscriptions",
  "publisher": "The British Museum",
  "url": "https://www.britishmuseum.org/collection/galleries/classical-inscriptions"
},
{
  "id": "source-met-phoenician-alphabet-usage",
  "title": "Alphabet Origins: From Kipling to Sinai",
  "publisher": "The Metropolitan Museum of Art",
  "url": "https://www.metmuseum.org/exhibitions/listings/2014/assyria-to-iberia/blog/posts/alphabet"
},
{
  "id": "source-iranica-aramaic-general-usage",
  "title": "Aramaic i. General",
  "author": "Franz Rosenthal",
  "publisher": "Encyclopaedia Iranica",
  "url": "https://www.iranicaonline.org/articles/aramaic/i-general/"
},
{
  "id": "source-chicago-persepolis-usage",
  "title": "Persepolis Fortification Archive",
  "publisher": "University of Chicago, OCHRE",
  "url": "https://voices.uchicago.edu/ochre/project/pfa/"
},
{
  "id": "source-hittite-text-genres-usage",
  "title": "The Chicago Hittite Dictionary Project",
  "publisher": "University of Chicago",
  "url": "https://isac.uchicago.edu/sites/default/files/uploads/shared/docs/Research/CHD/Hittite-Brochure-2015.pdf"
},
{
  "id": "source-heraklion-linear-b-usage",
  "title": "Linear B page tablet",
  "publisher": "Heraklion Archaeological Museum",
  "url": "https://heraklionmuseum.gr/en/exhibit/linear-b-page-tablet/"
}
,
{
  "id": "source-ucl-papyrus-ostraca-reviewed",
  "title": "An Introduction to the Papyrus for the People Project",
  "publisher": "UCL Culture",
  "year": 2017,
  "url": "https://blogs.ucl.ac.uk/museums/2017/07/05/an-introduction-to-the-papyrus-for-the-people-project/"
},
{
  "id": "source-kenoyer-script-materials-reviewed",
  "title": "Origin and Development of the Indus Script: Insights from Harappa and other sites",
  "author": "Jonathan Mark Kenoyer",
  "publisher": "Harappa",
  "year": 2020,
  "url": "https://www.harappa.com/sites/default/files/pdf/Kenoyer2020%20Origin%20of%20Indus%20Script.pdf"
},
{
  "id": "source-sns-phoenician-examples-reviewed",
  "title": "Phoenician — Examples of writing",
  "publisher": "Scuola Normale Superiore, Mnamon",
  "author": "Paolo Merlo",
  "url": "https://mnamon.sns.it/index.php?id=23&lang=en&page=Esempi"
}
,
{
  "id": "source-met-old-assyrian-community-reviewed",
  "title": "The Old Assyrian Period (ca. 2000–1600 B.C.)",
  "publisher": "The Metropolitan Museum of Art",
  "url": "https://www.metmuseum.org/essays/the-old-assyrian-period"
},
{
  "id": "source-met-assyrian-caravan-object-reviewed",
  "title": "Cuneiform tablet: caravan account",
  "publisher": "The Metropolitan Museum of Art",
  "url": "https://www.metmuseum.org/art/collection/search/325851"
},
{
  "id": "source-oracc-assyrian-heartland-reviewed",
  "title": "Central Assyria, the lands between Assur, Nineveh and Arbela",
  "author": "Karen Radner",
  "publisher": "ORACC / University College London",
  "year": 2025,
  "url": "https://oracc2.museum.upenn.edu/saao/aebp/Essentials/Countries/CentralAssyria/index.html"
},
{
  "id": "source-oxford-lefkandi-reviewed",
  "title": "Early Excavations at Lefkandi: The Protogeometric Building and the Cemetery of Toumba",
  "publisher": "University of Oxford Lefkandi Excavations",
  "url": "https://lefkandi.classics.ox.ac.uk/Toumba.html"
},
{
  "id": "source-ucl-memphis-background",
  "title": "Memphis, background",
  "publisher": "UCL Digital Egypt for Universities",
  "url": "https://www.ucl.ac.uk/museums-static/digitalegypt/memphis/background.html"
},
{
  "id": "source-ucl-middle-kingdom-guide",
  "title": "A Guided Tour: Middle Kingdom",
  "publisher": "UCL Digital Egypt for Universities",
  "url": "https://www.ucl.ac.uk/museums-static/digitalegypt/main/guidemk.html"
},
{
  "id": "source-ucl-egypt-asia-new-kingdom",
  "title": "Asia: foreign relations with Egypt in the New Kingdom",
  "publisher": "UCL Digital Egypt for Universities",
  "url": "https://www.ucl.ac.uk/museums-static/digitalegypt/foreignrelations/asiank.html"
},
{
  "id": "source-ucl-ramesses-iv",
  "title": "Ramesses IV",
  "publisher": "UCL Digital Egypt for Universities",
  "url": "https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/ramsesiv.html"
},
{
  "id": "source-ucl-ramesses-ii",
  "title": "Ramesses II",
  "publisher": "UCL Digital Egypt for Universities",
  "url": "https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/ramsesii.html"
},
{
  "id": "source-akmenkalns-nubian-egyptian-interactions",
  "title": "Cultural Continuity and Change in the Wake of Ancient Nubian-Egyptian Interactions",
  "author": "Jessika Louise Groth Akmenkalns",
  "year": 2018,
  "publisher": "University of California, Santa Barbara",
  "url": "https://escholarship.org/uc/item/40f8g7vn"
},
{
  "id": "source-smithsonian-shang-dynasty",
  "title": "Shang dynasty (ca. 1600–1050 BCE)",
  "publisher": "Smithsonian National Museum of Asian Art",
  "url": "https://asia-archive.si.edu/learn/for-educators/teaching-china-with-the-smithsonian/explore-by-dynasty/shang-dynasty-2/"
},
{
  "id": "source-hk-history-museum-zhou-organization",
  "title": "歷史博物館展出夏商周珍貴文物",
  "publisher": "香港政府新聞公報／香港歷史博物館",
  "year": 2007,
  "url": "https://www.info.gov.hk/gia/general/200702/13/P200702130088.htm"
},
{
  "id": "source-ucl-egypt-chronology",
  "title": "Egyptian Chronology",
  "publisher": "UCL Digital Egypt for Universities",
  "url": "https://www.ucl.ac.uk/museums-static/digitalegypt/chronology/index.html"
},
{
  "id": "source-oracc-tiglath-pileser-territory-reviewed",
  "title": "Tiglath-pileser III, king of Assyria (744–727 BC)",
  "author": "Karen Radner",
  "publisher": "ORACC / University College London",
  "year": 2025,
  "url": "https://oracc.museum.upenn.edu/saao/aebp/Essentials/Kings/Tiglath-pileserIII/index.html"
},
{
  "id": "source-eshel-silver-levant-2025",
  "title": "Keseph: The Use of Silver Money in the Southern Levant from the Middle Bronze Age to the End of the Iron Age",
  "author": "Tzilla Eshel",
  "publisher": "Journal of World Prehistory",
  "year": 2025,
  "url": "https://doi.org/10.1007/s10963-025-09191-7"
},
{
  "id": "source-bm-fall-nineveh-chronicle-reviewed",
  "title": "Cuneiform tablet with part of the Babylonian Chronicle (616–609 BC)",
  "publisher": "British Museum",
  "url": "https://artsandculture.google.com/asset/cuneiform-tablet-with-part-of-the-babylonian-chronicle-616-609-bc/xAEPSobA2ozDxw?hl=en"
},
{
  "id": "source-sardis-introduction-reviewed",
  "title": "Introduction to the Lydians and Their World",
  "author": "Crawford H. Greenewalt, jr.",
  "publisher": "Archaeological Exploration of Sardis",
  "year": 2010,
  "url": "https://sardisexpedition.org/en/essays/latw-greenewalt-introduction"
},
{
  "id": "source-met-judean-diaspora-reviewed",
  "title": "Cyrus and the Judean Diaspora",
  "author": "Ira Spar",
  "publisher": "The Metropolitan Museum of Art",
  "year": 2013,
  "url": "https://www.metmuseum.org/es/perspectives/cyrus-and-the-judean-diaspora"
},
{
  "id": "source-oracc-israel-reviewed",
  "title": "Israel, the House of Omri",
  "author": "Karen Radner",
  "publisher": "ORACC / University College London",
  "url": "https://oracc.museum.upenn.edu/saao/aebp/Essentials/Countries/Israel/index.html"
},
{
  "id": "source-oracc-governance-reviewed",
  "title": "Provincial governors",
  "publisher": "ORACC / University College London",
  "url": "https://oracc.museum.upenn.edu/saao/aebp/Essentials/Governors/index.html"
}
,
{
  "id": "source-heraklion-knossos-reviewed",
  "title": "Knossos",
  "publisher": "Municipality of Heraklion",
  "url": "https://www.heraklion.gr/en/visitor/knossos/knossos.html"
}
] as const satisfies readonly Source[];

export const V6_SOURCES: readonly Source[] = [...FROZEN_V5_SOURCES, ...REVIEWED_V6_SOURCES];
