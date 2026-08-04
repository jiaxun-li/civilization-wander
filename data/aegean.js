(function exposeAegeanV5(root, factory) {
  const data = factory();
  if (root) root.ATLAS_V5_AEGEAN = data;
  if (typeof module === 'object' && module.exports) module.exports = data;
}(typeof window !== 'undefined' ? window : globalThis, function createAegeanV5Data() {
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
    { id: 'source-unesco-minoan-palatial-centres', title: 'Minoan Palatial Centres', year: 2025, publisher: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/decisions/8959/' },
    { id: 'source-met-minoan-crete', title: 'Minoan Crete', author: 'Seán Hemingway and Colette Hemingway', year: 2002, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/minoan-crete' },
    { id: 'source-salgarella-writing-bronze-age-crete', title: 'Writing in Bronze Age Crete', author: 'Ester Salgarella', year: 2025, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/elements/writing-in-bronze-age-crete/5D5094CF9E6B118C94AD0554E3D9762A' },
    { id: 'source-hooker-linear-a', title: 'Problems and Methods in the Decipherment of Linear A', author: 'J. T. Hooker', publisher: 'Journal of the Royal Asiatic Society', url: 'https://www.cambridge.org/core/services/aop-cambridge-core/content/view/7F3FA8E3EFED6A575EB2E8EA8F3556F5/S0035869X0013285Xa.pdf/problems-and-methods-in-the-decipherment-of-linear-a.pdf' },
    { id: 'source-poursat-minoan-artworks', title: 'The Historical Framework', author: 'Jean-Claude Poursat', year: 2022, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/product/identifier/9781108630672%23CN-bp-19/type/book_part' },
    { id: 'source-met-mycenaean-civilization', title: 'Mycenaean Civilization', author: 'Colette Hemingway and Seán Hemingway', year: 2003, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/mycenaean-civilization' },
    { id: 'source-killen-mycenaean-society', title: 'Mycenaean Society and Political Systems', author: 'John T. Killen', year: 2024, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/new-documents-in-mycenaean-greek/mycenaean-society-and-political-systems/C5357CAFD444CBF3477838D3ECB464FE' },
    { id: 'source-bsa-linear-b', title: 'Linear B', publisher: 'Annual of the British School at Athens', year: 2022, url: 'https://www.cambridge.org/core/journals/annual-of-the-british-school-at-athens/linear-b' },
    { id: 'source-cambridge-mycenaean-religion', title: 'Mycenaean Religion', author: 'Thomas G. Palaima', year: 2008, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/cambridge-companion-to-the-aegean-bronze-age/mycenaean-religion/190D846912C9E577315915FE29724D1C' },
    { id: 'source-cambridge-guide-homer', title: 'The Cambridge Guide to Homer: Introduction', publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/cambridge-guide-to-homer/introduction/A758931C64C54C11EE43039C00C011D5' },
    { id: 'source-cambridge-mycenaean-transformation', title: 'The Transformation of the Mycenaean World', publisher: 'Cambridge University Press', year: 2026, url: 'https://www.cambridge.org/core/books/abs/cambridge-companion-to-the-greek-iron-age/transformation-of-the-mycenaean-world/3FA169AC1267D35EC5365067710D44D5' },
    { id: 'source-bsa-aegean-iron-technologies', title: 'Tradition and Innovation in Aegean Iron Technologies', publisher: 'Annual of the British School at Athens', year: 2022, url: 'https://www.cambridge.org/core/journals/annual-of-the-british-school-at-athens/article/tradition-and-innovation-in-aegean-iron-technologies-a-view-from-early-iron-age-ionia/278E96D4E7813F158D8A71FA133466F9' },
    { id: 'source-cambridge-greek-iron-age-pottery', title: 'Greek Iron Age Pottery in the Mediterranean World', publisher: 'Cambridge University Press', year: 2024, url: 'https://www.cambridge.org/core/books/greek-iron-age-pottery-in-the-mediterranean-world/722978787F9792B9C404234D2D1C9CFA' },
    { id: 'source-lupack-local-horizon', title: 'Mycenaean Greek Worship in the Local Horizon', author: 'Susan Lupack', year: 2023, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/religion-and-cult-in-the-dodecanese-during-the-first-millennium-bc/mycenaean-greek-worship-in-the-local-horizon/66B141B08B0782957E8C7D5B6B0AD478' },
    { id: 'source-rutherford-greek-religion-lba-eia', title: 'Greek Religion in the Late Bronze Age and Early Iron Age', author: 'Ian Rutherford', year: 2020, publisher: 'Oxford Research Encyclopedia of Religion', url: 'https://oxfordre.com/religion/display/10.1093/acrefore/9780199340378.001.0001/acrefore-9780199340378-e-815' },
    { id: 'source-cambridge-companion-greek-mythology', title: 'The Cambridge Companion to Greek Mythology', author: 'Roger D. Woodard (ed.)', year: 2007, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/cambridge-companion-to-greek-mythology/80BE198A50A04D30FA79A4B9FC6B9640' },
    { id: 'source-perseus-hesiod-theogony', title: 'Hesiod, Theogony', author: 'Hesiod', publisher: 'Perseus Digital Library', url: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0130' },
    { id: 'source-perseus-homeric-hymn-demeter', title: 'Homeric Hymn to Demeter', publisher: 'Perseus Digital Library', url: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0138:hymn=2' },
    { id: 'source-met-greek-gods-practices', title: 'Greek Gods and Religious Practices', author: 'Colette Hemingway', year: 2003, publisher: 'The Metropolitan Museum of Art', url: 'https://www.metmuseum.org/essays/greek-gods-and-religious-practices' },
    { id: 'source-perseus-iliad', title: 'Homer, Iliad', author: 'Homer', publisher: 'Perseus Digital Library', url: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0134' },
    { id: 'source-perseus-odyssey-eight', title: 'Homer, Odyssey, Book 8', author: 'Homer', publisher: 'Perseus Digital Library', url: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0136:book=8' },
    { id: 'source-cambridge-guide-mycenae', title: 'Mycenae', publisher: 'The Cambridge Guide to Homer', url: 'https://www.cambridge.org/core/books/cambridge-guide-to-homer/mycenae/FE2680102FA57DCE7E5349929036E40B' },
    { id: 'source-rhodes-homeric-state', title: 'The Homeric State', author: 'P. J. Rhodes', year: 2019, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/cambridge-guide-to-homer/homeric-state/7DC9CDF0E391EAC2884D7D8E91664D49' },
    { id: 'source-stafford-herakles', title: 'Herakles between Gods and Heroes', author: 'Emma Stafford', year: 2010, publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/gods-and-heroes-in-ancient-greece/herakles-between-gods-and-heroes/39DC8D47D37C7D1060680510BEA8E7D5' },
    { id: 'source-perseus-apollodorus-library', title: 'Pseudo-Apollodorus, Library', author: 'Pseudo-Apollodorus', publisher: 'Perseus Digital Library', url: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0022' },

    { id: 'source-wikimedia-knossos-central-court', title: 'Panoramic view of the central court at Knossos, CC BY-SA 3.0', author: 'C messier', year: 2011, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Knossos_Central_Court_Panoramic.JPG' },
    { id: 'source-wikimedia-linear-a-akrotiri', title: 'Linear A tablets from Akrotiri, CC BY-SA 3.0', author: 'Portum', year: 2004, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Linear_A_tablets.jpg' },
    { id: 'source-wikimedia-akrotiri-flotilla', title: 'Bronze Age flotilla fresco from Akrotiri, public domain artwork', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Minoan_fresco,_showing_a_fleet_and_settlement_Akrotiri.jpg' },
    { id: 'source-wikimedia-knossos-linear-b', title: 'Knossos tablet KN Fp 13, CC BY 2.0', author: 'vintagedept', year: 2010, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Clay_Tablet_inscribed_with_Linear_B_script.jpg' },
    { id: 'source-wikimedia-mouliana-krater', title: 'Late Minoan IIIC krater from Mouliana, CC BY-SA 4.0', author: 'ArchaiOptix', year: 2019, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:LM_IIIC_dark_on_light_ware_krater_from_Mouliana_-_Herakleion_AM_-_01.jpg' },
    { id: 'source-wikimedia-mycenae-gold-mask', title: 'Gold funerary mask from Mycenae Grave Circle A, CC0', author: 'Gary Todd', year: 2016, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Gold_death-mask_known_as_%E2%80%98Mask_of_Agamemnon,%E2%80%99_Mycenae,_Grave_Circle_A,_Grave_V,_16th_cent._BC._%2828423089016%29.jpg' },
    { id: 'source-wikimedia-mycenae-athena-tablet', title: 'Linear B tablet from Mycenae mentioning Athena, CC BY-SA 4.0', author: 'Zde', year: 2020, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Linear_B_tablet,_AM_of_Mycenae,_201725.jpg' },
    { id: 'source-wikimedia-mycenae-warrior-krater', title: 'Mycenaean warrior krater, CC0', author: 'Gary Todd', year: 2016, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Mycenaean_Ceramic_Krater_depicting_Warriors_departing_for_battle,_from_Mycenae_Acropolis,_c._1200_BC.jpg' },
    { id: 'source-wikimedia-protogeometric-amphora', title: 'Protogeometric pottery amphora, CC0', author: 'Gary Todd', year: 2016, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Ancient_Greek_Protogeometric_Pottery_Amphora_%2827856941833%29.jpg' },
    { id: 'source-wikimedia-naxos-geometric-pottery', title: 'Geometric pottery from Donoussa dated 830–800 BCE, CC BY-SA 3.0', author: 'Zde', year: 2014, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Geometric_pottery,_830-800_BC,_AM_Naxos,_143284.jpg' },
    { id: 'source-wikimedia-rhea-cronus', title: 'Rhea presenting Cronus the stone wrapped in cloth, public domain', year: 1878, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Rhea_presenting_Cronus_the_stone_wrapped_in_cloth.jpg' },
    { id: 'source-wikimedia-three-realms', title: 'Jupiter, Neptune and Pluto dividing the universe, public domain', publisher: 'The Metropolitan Museum of Art / Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Jupiter,_Neptune_and_Pluto_dividing_the_universe_MET_DP812462.jpg' },
    { id: 'source-wikimedia-council-gods-met', title: 'Council of the Gods by Jacopo Zoboli, CC0', author: 'Jacopo Zoboli', publisher: 'The Metropolitan Museum of Art / Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Council_of_the_Gods_MET_DP331998.jpg' },
    { id: 'source-wikimedia-zeus-iris-libation', title: 'Zeus and Iris in a libation scene, photograph released to the public domain', author: 'Tangopaso', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Zeus_et_Iris_dans_une_sc%C3%A8ne_de_libation_(Louvre,_Cp_699).jpg' },
    { id: 'source-wikimedia-demeter-persephone-batten', title: 'Demeter and Persephone by John Dickson Batten, public domain', author: 'John Dickson Batten', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Demeter_and_Persephone).jpg' },
    { id: 'source-wikimedia-athena-achilles-illustration', title: 'Athene suppressing the fury of Achilles, public domain', author: 'John Flaxman', year: 1895, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Athene_suppressing_the_fury_of_Achilles.jpg' },
    { id: 'source-wikimedia-mycenae-lion-gate-clear', title: 'Lion Gate, Mycenae, CC BY-SA 4.0', author: 'Zde', year: 2020, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Lion_Gate,_Mycenae,_201505.jpg' },
    { id: 'source-wikimedia-demodocus-flaxman', title: 'Demodocus singing before Odysseus by John Flaxman, public domain', author: 'John Flaxman', year: 1810, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:OdysseyDemodokos.png' },
    { id: 'source-wikimedia-achilles-thetis-preller', title: 'Achilles and Thetis by Friedrich Preller the Younger, public domain', author: 'Friedrich Preller the Younger', publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Preller_Achilles_and_Thetis.jpg' },
    { id: 'source-wikimedia-heracles-lion-bm', title: 'Herakles and the Nemean lion on an Attic vase, photograph released to the public domain', author: 'Jastrow', year: 2006, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Herakles_Nemean_lion_BM_B621.jpg' },
    { id: 'source-wikimedia-argonauts-roberti', title: 'The Argonauts Leaving Colchis by Ercole de’ Roberti, public domain', author: 'Ercole de’ Roberti', year: 1480, publisher: 'Museo Nacional Thyssen-Bornemisza / Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Roberti_-_The_Argonauts_Leaving_Colchis,_ca._1480,_344_(1934.41).jpg' },
    { id: 'source-wikimedia-oedipus-sphinx-moreau', title: 'Oedipus and the Sphinx by Gustave Moreau, public domain', author: 'Gustave Moreau', year: 1864, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Oedipus_and_the_Sphinx_1864.jpg' },
    { id: 'source-wikimedia-achilles-hector-groeninge', title: 'Achilles kills Hector, CC0', author: 'Léonce Legendre', publisher: 'Groeningemuseum / Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Achilles_doodt_Hector,_circa_1831_-_circa_1893,_Groeningemuseum,_0041065000.jpg' },
    { id: 'source-wikimedia-odysseus-return-pinturicchio', title: 'The Return of Odysseus by Pinturicchio, public domain', author: 'Pinturicchio', year: 1509, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Pinturicchio,_Return_of_Odysseus.jpg' },

    { id: 'source-unesco-troy', title: 'Archaeological Site of Troy', publisher: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/849/' },
    { id: 'source-british-museum-lost-troy', title: 'The search for the lost city of Troy', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/blog/search-lost-city-troy' },
    { id: 'source-cambridge-hittite-troy', title: 'Hittite Literary Evidence', publisher: 'The Cambridge Guide to Homer', url: 'https://www.cambridge.org/core/books/abs/cambridge-guide-to-homer/hittite-literary-evidence/37462517BA9895BCE28F55C5F7A94924' },
    { id: 'source-british-museum-alaksandu-wilusa', title: 'Tablet recording the treaty between Muwatalli II and Alaksandu of Wilusa', publisher: 'The British Museum', url: 'https://www.britishmuseum.org/collection/object/W_1913-1011-22' },
    { id: 'source-cambridge-iliad-overview', title: 'The Iliad: An Overview', publisher: 'The Cambridge Guide to Homer', url: 'https://www.cambridge.org/core/books/abs/cambridge-guide-to-homer/iliad-an-overview/9EE503F97F456C5FA0CB870960B07298' },
    { id: 'source-cambridge-odyssey-overview', title: 'The Odyssey: An Overview', publisher: 'The Cambridge Guide to Homer', url: 'https://www.cambridge.org/core/books/abs/cambridge-guide-to-homer/odyssey-an-overview/87B5831A2781A4BC4F3C65737EAD93F9' },
    { id: 'source-perseus-odyssey', title: 'Homer, Odyssey', author: 'Homer', publisher: 'Perseus Digital Library', url: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0136' },
    { id: 'source-beck-odyssey-home-family', title: 'Homer, Odyssey: Heroism, Home, and Family', author: 'Deborah Beck', publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/stories-of-similes-in-greek-and-roman-epic/homer-odyssey/05E073DD67F6CF985933EE334EFDBC48' },
    { id: 'source-cambridge-iliad-history-fiction', title: 'History and Fiction in the Iliad', publisher: 'Cambridge University Press', url: 'https://www.cambridge.org/core/books/abs/iliad-a-commentary/history-and-fiction-in-the-iliad/69095136EB6ADE71D4F92DE362E54E36' },

    { id: 'source-wikimedia-troy-vi-walls', title: 'Legendary walls of Troy, CC BY 2.0, original 4288 × 2848', author: 'Jorge Láscar', year: 2012, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Legendary_walls_of_Troy_(8708672267).jpg' },
    { id: 'source-wikimedia-troy-wilusa-treaty', title: 'Hittite treaty tablet of Alaksandu and Muwatalli II, CC BY-SA 4.0, original 2992 × 4095', author: 'Dosseman', year: 2018, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Troy_Museum_Hittite_Treaty_0022.jpg' },
    { id: 'source-wikimedia-flaxman-iliad-title', title: 'Title plate for Flaxman’s Iliad engravings, CC BY 3.0, original 2337 × 1739', author: 'John Flaxman; engraving by Tommaso Piroli; photograph by H.-P. Haack', year: 1795, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:(0)_Flaxman_Ilias_Kupferstiche_1795,_Titelblatt,_182_x_251_mm.jpg' },
    { id: 'source-wikimedia-flaxman-iliad-thetis-zeus', title: 'Thetis appeals to Zeus, public domain, original 3110 × 2316', author: 'John Flaxman; engraving by Tommaso Piroli', year: 1795, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:(2)_Flaxman_Ilias_1793,_gestochen_1795,_185_x_251_mm.jpg' },
    { id: 'source-wikimedia-flaxman-iliad-embassy', title: 'The embassy to Achilles, public domain, original 800 × 501', author: 'John Flaxman; engraving by Tommaso Piroli', year: 1795, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:(14)_Flaxman_Ilias_1795,_Zeichnung_1793,_185_x_296_mm.jpg' },
    { id: 'source-wikimedia-flaxman-iliad-patroclus', title: 'Greeks and Trojans fight over Patroclus, public domain, original 2682 × 1533', author: 'John Flaxman; engraving by Tommaso Piroli', year: 1795, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:(22)_Flaxman_Ilias_1795,_Zeichnung_1793,_188_x_344_mm.jpg' },
    { id: 'source-wikimedia-flaxman-iliad-armor', title: 'Thetis brings new armor to Achilles, public domain, original 1973 × 1355', author: 'John Flaxman; engraving by Tommaso Piroli', year: 1795, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:(27)_Flaxman_Ilias_1795,_Zeichnung_1793,_189_x_284_mm.jpg' },
    { id: 'source-wikimedia-flaxman-iliad-hector', title: 'Achilles with the body of Hector, public domain, original 1714 × 1271', author: 'John Flaxman; engraving by Tommaso Piroli', year: 1795, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:(30)_Flaxman_Ilias_1793,_gestochen_1795,_187_x_256.jpg' },
    { id: 'source-wikimedia-flaxman-iliad-priam', title: 'Priam before Achilles, public domain, original 2481 × 1378', author: 'John Flaxman; engraving by Tommaso Piroli', year: 1795, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:(33)_Flaxman_Ilias_1793,_gestochen_1795,_184_x_340_mm.jpg' },
    { id: 'source-wikimedia-flaxman-iliad-funeral', title: 'The funeral of Hector, public domain, original 2518 × 1377', author: 'John Flaxman; engraving by Tommaso Piroli', year: 1795, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:(34)_Flaxman_Ilias_1793,_gestochen_1795,_184_x_346_mm.jpg' },
    { id: 'source-wikimedia-flaxman-odyssey-suitors', title: 'The suitors discover Penelope’s ruse, public domain, original 2124 × 1548', author: 'John Flaxman', year: 1810, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:OdysseySuitors.png' },
    { id: 'source-wikimedia-flaxman-odyssey-hermes', title: 'Hermes orders Calypso to release Odysseus, public domain, original 1884 × 1488', author: 'John Flaxman', year: 1810, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:OdysseyHermes.png' },
    { id: 'source-wikimedia-flaxman-odyssey-nausicaa', title: 'Nausicaa and her companions, public domain, original 2322 × 1584', author: 'John Flaxman', year: 1810, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:OdysseyNausikaa.png' },
    { id: 'source-wikimedia-flaxman-odyssey-polyphemus', title: 'Odysseus and Polyphemus, public domain, original 2088 × 1608', author: 'John Flaxman', year: 1810, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:OdysseyPolyphemos.png' },
    { id: 'source-wikimedia-flaxman-odyssey-antiphates', title: 'Antiphates attacks Odysseus’s crew, public domain, original 2148 × 1656', author: 'John Flaxman', year: 1810, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:OdysseyAntiphates.png' },
    { id: 'source-wikimedia-flaxman-odyssey-circe', title: 'Odysseus asks Circe to restore his companions, public domain, original 2244 × 1452', author: 'John Flaxman', year: 1810, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:OdysseyCirce.png' },
    { id: 'source-wikimedia-flaxman-odyssey-sirens', title: 'Odysseus hears the Sirens, public domain, original 2112 × 1404', author: 'John Flaxman', year: 1810, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:OdysseySirens.png' },
    { id: 'source-wikimedia-flaxman-odyssey-argus', title: 'Odysseus and his dog Argus, public domain, original 2048 × 1536', author: 'John Flaxman', year: 1835, publisher: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Flaxman_Odyssey_Ulysses_and_his_dog.jpg' }
  ];

  const entities = [
    {
      id: 'minoan-palatial-civilization', type: 'culturalTradition', name: '克里特宫殿文明', alternativeNames: ['米诺斯文明', 'Minoan civilization'],
      canonicalSummary: '约公元前2000—前1100年，克里特多个宫殿中心以庭院、仓储、作坊、仪式和书写组织区域生活，并在后期被迈锡尼行政传统改变。',
      timeSpan: timeSpan(-2000, -1100, '约公元前2000—前1100年', true),
      tags: ['爱琴海', '克里特', '青铜时代'], sourceIds: ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete']
    },
    {
      id: 'mycenaean-civilization', type: 'culturalTradition', name: '迈锡尼文明', alternativeNames: ['Mycenaean civilization'],
      canonicalSummary: '约公元前1700—前1050年，希腊大陆精英从墓葬权力发展出多个宫殿政权，以线形文字B记录早期希腊语，并在宫殿终结后延续部分物质与口头传统。',
      timeSpan: timeSpan(-1700, -1050, '约公元前1700—前1050年', true),
      tags: ['爱琴海', '希腊大陆', '青铜时代'], sourceIds: ['source-met-mycenaean-civilization', 'source-killen-mycenaean-society']
    },
    {
      id: 'greek-dark-age-communities', type: 'culturalTradition', name: '希腊黑暗时代社会', alternativeNames: ['Early Iron Age Greece'],
      canonicalSummary: '约公元前1200—前800年，爱琴海宫殿体系消失后形成的地方社区延续生产与航海，并通过铁器、陶器和逐步恢复的区域联系发展出新的社会组织。',
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      tags: ['爱琴海', '希腊黑暗时代', '早期铁器时代'], sourceIds: ['source-cambridge-mycenaean-transformation', 'source-cambridge-greek-iron-age-pottery']
    },
    {
      id: 'greek-divine-tradition', type: 'Religous_and_Myth', name: '希腊诸神传统', alternativeNames: ['Greek divine tradition'],
      canonicalSummary: '由迈锡尼宫殿泥版中的神名、地方祭祀与长期口头传讲共同留下的多神传统；其完整叙事主要见于较晚成文的诗歌。',
      timeSpan: timeSpan(-1450, -800, '约公元前1450—前800年', true),
      tags: ['爱琴海', '希腊神话', '奥林匹斯众神'], sourceIds: ['source-cambridge-mycenaean-religion', 'source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology']
    },
    {
      id: 'greek-heroic-tradition', type: 'Religous_and_Myth', name: '希腊英雄传统', alternativeNames: ['Greek heroic tradition'],
      canonicalSummary: '以神裔、战士、远航者与受诅咒家族为中心的口头叙事传统，把青铜时代遗迹、后宫殿社会经验与神话谱系组织成共同过去。',
      timeSpan: timeSpan(-1600, -800, '约公元前1600—前800年', true),
      tags: ['爱琴海', '希腊神话', '英雄时代'], sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-guide-mycenae', 'source-cambridge-companion-greek-mythology']
    },
    {
      id: 'troy-archaeological-site', type: 'SettlementSite', name: '特洛伊遗址', alternativeNames: ['维鲁萨', 'Troy', 'Wilusa'],
      canonicalSummary: '约公元前1700—前800年，安纳托利亚西北部土丘上的设防聚落反复毁坏、重建并继续有人居住；其晚青铜时代城市常与赫梯文献中的维鲁萨相联系。',
      timeSpan: timeSpan(-1700, -800, '约公元前1700—前800年', true),
      tags: ['爱琴海', '安纳托利亚', '晚青铜时代'], sourceIds: ['source-unesco-troy', 'source-british-museum-lost-troy', 'source-cambridge-hittite-troy']
    },
    {
      id: 'iliad-text', type: 'TextDocument', name: '《伊利亚特》', alternativeNames: ['Iliad'],
      canonicalSummary: '在约公元前1200—前800年的口头传讲中逐渐形成的英雄诗歌传统，以阿喀琉斯的愤怒、帕特罗克洛斯之死和赫克托耳葬礼组织特洛伊战争末期的一段故事。',
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      tags: ['爱琴海', '荷马史诗', '伊利亚特'], sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad']
    },
    {
      id: 'odyssey-text', type: 'TextDocument', name: '《奥德赛》', alternativeNames: ['Odyssey'],
      canonicalSummary: '在约公元前1200—前800年的归乡歌与口头传讲中逐渐形成的英雄诗歌传统，讲述奥德修斯失去船队、同伴和公开身份后重返伊塔卡。',
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      tags: ['爱琴海', '荷马史诗', '奥德赛'], sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey']
    }
  ];

  const events = [
    {
      id: 'event-mycenaean-shaft-grave-elites-emerge', kind: 'historicalProcess', title: '迈锡尼竖井墓精英形成', timeSpan: timeSpan(-1700, -1450, '约公元前1700—前1450年', true),
      participantEntityIds: ['mycenaean-civilization'],
      evidenceBlocks: [fact('event-mycenaean-shaft-grave-elites-emerge-evidence', '迈锡尼等地的竖井墓集中放置金器、武器与远方材料，显示希腊大陆部分家族在宫殿形成前积累了突出的财富与地位。', ['source-met-mycenaean-civilization', 'source-cambridge-guide-mycenae'])],
      sourceIds: ['source-met-mycenaean-civilization', 'source-cambridge-guide-mycenae'],
      editorialReview: review([limitation('event-mycenaean-shaft-grave-elites-emerge-review', '高等级墓葬主要呈现少数精英的自我表达，不能代表同时期所有社区。', ['source-met-mycenaean-civilization'])], [], [], [], ['source-met-mycenaean-civilization', 'source-cambridge-guide-mycenae'])
    },
    {
      id: 'event-greek-divine-narratives-form-in-song', kind: 'textualTradition', title: '希腊诸神叙事在祭祀与歌唱中重组', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      participantEntityIds: ['greek-divine-tradition', 'greek-dark-age-communities'],
      evidenceBlocks: [fact('event-greek-divine-narratives-form-in-song-evidence', '宫殿书写停止后，部分神名继续见于后世传统；地方祭祀与口头诗歌逐渐把诸神组织成亲属、权力与互惠关系。', ['source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology', 'source-perseus-hesiod-theogony'])],
      sourceIds: ['source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology', 'source-perseus-hesiod-theogony'],
      editorialReview: review([], [], [interpretation('event-greek-divine-narratives-form-in-song-review', '现存诗歌较晚成文，公元前1200—前800年间具体叙事如何变化不能逐步复原。', ['source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology'])], [], ['source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology'])
    },
    {
      id: 'event-greek-heroic-songs-form-and-circulate', kind: 'textualTradition', title: '希腊英雄歌在口头表演中形成并传播', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      participantEntityIds: ['greek-heroic-tradition', 'greek-dark-age-communities'],
      evidenceBlocks: [fact('event-greek-heroic-songs-form-and-circulate-evidence', '宫殿时代结束后，歌者在宴会和公共表演中反复改写英雄、远航、战争与归乡故事，把遗迹、旧地名和后宫殿社会经验组织成共享过去。', ['source-cambridge-guide-homer', 'source-rhodes-homeric-state', 'source-perseus-odyssey-eight'])],
      sourceIds: ['source-cambridge-guide-homer', 'source-rhodes-homeric-state', 'source-perseus-odyssey-eight'],
      editorialReview: review([limitation('event-greek-heroic-songs-form-and-circulate-review', '英雄歌不是青铜时代事件的连续报道，具体人物与情节不能据此直接认定为历史事实。', ['source-cambridge-guide-homer'])], [], [], [], ['source-cambridge-guide-homer', 'source-rhodes-homeric-state'])
    },
    {
      id: 'event-iliad-oral-composition-and-transmission', kind: 'textualTradition', title: '《伊利亚特》在口头作诗传统中形成', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      participantEntityIds: ['iliad-text', 'greek-heroic-tradition', 'greek-divine-tradition'],
      evidenceBlocks: [fact('event-iliad-oral-composition-and-transmission-evidence', '《伊利亚特》从更广的英雄歌传统中组织出阿喀琉斯愤怒及其后果；现存诗篇保留长期口头创作与传承形成的结构。', ['source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad'])],
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad'],
      editorialReview: review([limitation('event-iliad-oral-composition-and-transmission-review', '诗中争吵、战斗、死亡与赎回属于史诗叙事，不能当作一场可逐项验证的青铜时代战争记录。', ['source-cambridge-guide-homer', 'source-cambridge-iliad-history-fiction'])], [], [], [], ['source-cambridge-guide-homer', 'source-cambridge-iliad-history-fiction'])
    },
    {
      id: 'event-odyssey-oral-composition-and-transmission', kind: 'textualTradition', title: '《奥德赛》在归乡歌传统中形成', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      participantEntityIds: ['odyssey-text', 'greek-heroic-tradition', 'greek-dark-age-communities'],
      evidenceBlocks: [fact('event-odyssey-oral-composition-and-transmission-evidence', '不同归乡歌、海上故事与伊塔卡家庭叙事在长期口头创作中被组织为奥德修斯失去身份并重返家园的长诗。', ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey'])],
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey'],
      editorialReview: review([limitation('event-odyssey-oral-composition-and-transmission-review', '诗中的岛屿、怪物、神祇介入和归乡情节属于文学传统，不能组合成一条精确的历史航线。', ['source-cambridge-odyssey-overview', 'source-perseus-odyssey'])], [], [], [], ['source-cambridge-odyssey-overview', 'source-perseus-odyssey'])
    },
    {
      id: 'event-crete-palaces-emerge-and-rebuild', kind: 'historicalProcess', title: '克里特宫殿出现并重建', timeSpan: timeSpan(-2000, -1450, '约公元前2000—前1450年', true),
      participantEntityIds: ['minoan-palatial-civilization'],
      evidenceBlocks: [fact('event-crete-palaces-emerge-evidence', '约公元前2000年起，克里特多个中心发展出围绕中央庭院的宫殿建筑；部分宫殿约在公元前1700年前后毁坏后又在原址重建。', ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete'])],
      sourceIds: ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete'],
      editorialReview: review([limitation('event-crete-palaces-emerge-review', '宫殿一词概括了规模、沿革和区域作用并不完全相同的多个中心。', ['source-unesco-minoan-palatial-centres'])], [], [], [], ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete'])
    },
    {
      id: 'event-knossos-linear-b-administration', kind: 'historicalProcess', title: '克诺索斯改用线形文字B', timeSpan: timeSpan(-1450, -1375, '约公元前1450—前1375年', true),
      participantEntityIds: ['minoan-palatial-civilization', 'mycenaean-civilization'],
      evidenceBlocks: [fact('event-knossos-linear-b-evidence', '约公元前1450年后，克诺索斯行政泥版出现记录早期希腊语的线形文字B，显示来自大陆的迈锡尼书写与统治传统进入克里特。', ['source-salgarella-writing-bronze-age-crete', 'source-bsa-linear-b'])],
      sourceIds: ['source-salgarella-writing-bronze-age-crete', 'source-bsa-linear-b'],
      editorialReview: review([], [], [interpretation('event-knossos-linear-b-review', '迈锡尼统治进入克里特的具体过程、强度和克诺索斯档案年代仍存在讨论。', ['source-salgarella-writing-bronze-age-crete', 'source-bsa-linear-b'])], [], ['source-salgarella-writing-bronze-age-crete', 'source-bsa-linear-b'])
    },
    {
      id: 'event-mycenaean-palace-administration', kind: 'historicalProcess', title: '迈锡尼宫殿行政扩展', timeSpan: timeSpan(-1450, -1200, '约公元前1450—前1200年', true),
      participantEntityIds: ['mycenaean-civilization'],
      evidenceBlocks: [fact('event-mycenaean-palace-evidence', '希腊大陆多个宫殿中心以线形文字B记录物资、劳作与献祭，却没有形成一个统一的迈锡尼国家。', ['source-killen-mycenaean-society', 'source-bsa-linear-b', 'source-cambridge-mycenaean-religion'])],
      sourceIds: ['source-killen-mycenaean-society', 'source-bsa-linear-b', 'source-cambridge-mycenaean-religion'],
      editorialReview: review([limitation('event-mycenaean-palace-review', '泥版档案集中记录宫殿关心的事项，不能代表全部生产、交换与信仰生活。', ['source-killen-mycenaean-society'])], [], [], [], ['source-killen-mycenaean-society', 'source-bsa-linear-b'])
    },
    {
      id: 'event-mycenaean-palaces-end', kind: 'historicalEvent', title: '迈锡尼宫殿接连终结', timeSpan: timeSpan(-1250, -1180, '约公元前1250—前1180年', true),
      participantEntityIds: ['mycenaean-civilization', 'greek-dark-age-communities'],
      evidenceBlocks: [fact('event-mycenaean-palaces-end-evidence', '公元前13世纪后期至前12世纪初，希腊大陆多个宫殿相继毁坏或废弃，线形文字B行政档案停止增加。', ['source-deger-jalkotzy-aftermath', 'source-knapp-manning-crisis'])],
      sourceIds: ['source-deger-jalkotzy-aftermath', 'source-knapp-manning-crisis'],
      editorialReview: review([], [], [interpretation('event-mycenaean-palaces-end-review', '各中心转折并非同一天发生，战争、内部冲突、迁徙、环境压力与网络中断可能以不同组合参与。', ['source-deger-jalkotzy-aftermath', 'source-knapp-manning-crisis'])], [], ['source-deger-jalkotzy-aftermath', 'source-knapp-manning-crisis'])
    },
    {
      id: 'event-aegean-localizes-after-palaces', kind: 'historicalProcess', title: '爱琴海社会转向地方社区', timeSpan: timeSpan(-1200, -1050, '约公元前1200—前1050年', true),
      participantEntityIds: ['mycenaean-civilization', 'greek-dark-age-communities'],
      evidenceBlocks: [fact('event-aegean-localizes-evidence', '宫殿行政消失后，许多大型中心缩小或被放弃，生产更多由村落、家庭与地方首领组织。', ['source-deger-jalkotzy-aftermath', 'source-cambridge-mycenaean-transformation'])],
      sourceIds: ['source-deger-jalkotzy-aftermath', 'source-cambridge-mycenaean-transformation'],
      editorialReview: review([], [], [], [interpretation('event-aegean-localizes-alternative', '不同地区收缩程度不一，一些技术、航海与交换活动仍然延续。', ['source-cambridge-mycenaean-transformation'])], ['source-deger-jalkotzy-aftermath', 'source-cambridge-mycenaean-transformation'])
    },
    {
      id: 'event-aegean-regional-links-renew', kind: 'historicalProcess', title: '爱琴海区域联系重新增密', timeSpan: timeSpan(-1050, -800, '约公元前1050—前800年', true),
      participantEntityIds: ['greek-dark-age-communities'],
      evidenceBlocks: [fact('event-aegean-links-evidence', '铁器制作经验与具有地区风格的陶器在爱琴海传播，显示公元前11至前9世纪的区域联系逐步增密。', ['source-bsa-aegean-iron-technologies', 'source-cambridge-greek-iron-age-pottery'])],
      sourceIds: ['source-bsa-aegean-iron-technologies', 'source-cambridge-greek-iron-age-pottery'],
      editorialReview: review([], [], [interpretation('event-aegean-links-review', '陶器风格和器物移动不能单独证明具体族群迁徙或固定贸易路线。', ['source-cambridge-greek-iron-age-pottery'])], [], ['source-bsa-aegean-iron-technologies', 'source-cambridge-greek-iron-age-pottery'])
    },
    {
      id: 'event-troy-vi-viia-destruction', kind: 'historicalEvent', title: '特洛伊VI与VIIa经历毁坏和重建', timeSpan: timeSpan(-1700, -1180, '约公元前1700—前1180年', true),
      participantEntityIds: ['troy-archaeological-site'],
      evidenceBlocks: [fact('event-troy-vi-viia-evidence', '特洛伊VI的城墙和聚落严重受损后，居民在旧防御体系内建立了更密集的特洛伊VIIa；后者又经历火灾和破坏。', ['source-unesco-troy', 'source-british-museum-lost-troy'])],
      sourceIds: ['source-unesco-troy', 'source-british-museum-lost-troy'],
      editorialReview: review([], [historicalCase('event-troy-vi-viia-continuity', '毁坏之后仍有生活', '毁坏之后仍有居民继续在土丘上生活，城市经历的不是一次彻底而永久的遗弃。', ['event-troy-vi-viia-destruction'], ['source-unesco-troy'])], [interpretation('event-troy-vi-viia-causes', '特洛伊VI与VIIa毁坏的具体年代、原因和彼此关系仍有讨论。', ['source-british-museum-lost-troy', 'source-cambridge-iliad-history-fiction'])], [], ['source-unesco-troy', 'source-british-museum-lost-troy', 'source-cambridge-iliad-history-fiction'])
    },
    {
      id: 'event-hittite-wilusa-treaty', kind: 'historicalEvent', title: '赫梯大王与维鲁萨国王缔结条约', timeSpan: timeSpan(-1300, -1250, '约公元前1300—前1250年', true),
      participantEntityIds: ['hittite-empire', 'troy-archaeological-site'],
      evidenceBlocks: [fact('event-hittite-wilusa-treaty-evidence', '赫梯大王穆瓦塔利二世与维鲁萨国王阿拉克桑杜订立条约，要求地方国王忠诚并在战争时提供帮助。', ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa'])],
      sourceIds: ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa'],
      editorialReview: review([], [], [interpretation('event-hittite-wilusa-treaty-identification', '把维鲁萨识别为特洛伊是得到广泛支持的学术解释，但条约本身不使用现代遗址名称。', ['source-cambridge-hittite-troy'])], [], ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa'])
    }
  ];

  const structuralEdges = [
    {
      id: 'edge-minoan-mycenaean-administration', family: 'historicalNetwork', type: 'adapted_administrative_practice',
      source: { kind: 'entity', id: 'mycenaean-civilization' }, target: { kind: 'entity', id: 'minoan-palatial-civilization' },
      timeSpan: timeSpan(-1450, -1375, '约公元前1450—前1375年', true),
      label: { forward: '调整并采用其书写行政传统', reverse: '其行政工具被迈锡尼统治者采用' },
      summaries: { canonical: '迈锡尼书吏在克里特已有线形书写传统上调整出记录早期希腊语的线形文字B。' },
      qualifiers: ['文字相似不表示线形文字A与线形文字B记录同一种语言'], sourceIds: ['source-salgarella-writing-bronze-age-crete', 'source-bsa-linear-b']
    },
    {
      id: 'edge-mycenaean-dark-age-reorganization', family: 'historicalNetwork', type: 'reorganized_after',
      source: { kind: 'entity', id: 'greek-dark-age-communities' }, target: { kind: 'entity', id: 'mycenaean-civilization' },
      timeSpan: timeSpan(-1200, -1050, '约公元前1200—前1050年', true),
      label: { forward: '在宫殿终结后重新组织生活', reverse: '宫殿终结后由地方社区延续部分传统' },
      summaries: { canonical: '迈锡尼宫殿终结后，爱琴海社区缩小并地方化，同时延续部分陶器、金属加工和航海传统。' },
      sourceIds: ['source-deger-jalkotzy-aftermath', 'source-cambridge-mycenaean-transformation']
    },
    {
      id: 'edge-mycenaean-divine-names', family: 'historicalNetwork', type: 'preserved_divine_names',
      source: { kind: 'entity', id: 'greek-divine-tradition' }, target: { kind: 'entity', id: 'mycenaean-civilization' },
      timeSpan: timeSpan(-1450, -1200, '约公元前1450—前1200年', true),
      label: { forward: '部分神名见于宫殿泥版', reverse: '泥版记录了后来仍熟悉的神名' },
      summaries: { canonical: '迈锡尼宫殿泥版记录了宙斯、波塞冬、赫拉等神名和献祭物，但没有保存完整神话。' },
      sourceIds: ['source-cambridge-mycenaean-religion', 'source-lupack-local-horizon']
    },
    {
      id: 'edge-mycenaean-heroic-memory', family: 'historicalNetwork', type: 'reworked_as_heroic_memory',
      source: { kind: 'entity', id: 'greek-heroic-tradition' }, target: { kind: 'entity', id: 'mycenaean-civilization' },
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      label: { forward: '把遗迹与旧名重组为英雄过去', reverse: '遗迹与物质记忆进入英雄歌唱' },
      summaries: { canonical: '青铜时代城墙、墓葬、器物和旧地名进入长期口头创作，但英雄故事不是宫殿档案的直接转写。' },
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-guide-mycenae']
    },
    {
      id: 'edge-dark-age-heroic-song', family: 'historicalNetwork', type: 'performed_in_oral_tradition',
      source: { kind: 'entity', id: 'greek-heroic-tradition' }, target: { kind: 'entity', id: 'greek-dark-age-communities' },
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      label: { forward: '在口头表演中形成共同过去', reverse: '通过歌者重组英雄故事' },
      summaries: { canonical: '宫殿书写停止后，英雄故事通过宴会与公共表演中的歌者不断重组并传递。' },
      sourceIds: ['source-cambridge-guide-homer', 'source-perseus-odyssey-eight']
    },
    {
      id: 'edge-gods-shape-heroic-fates', family: 'historicalNetwork', type: 'divine_intervention_in_heroic_story',
      source: { kind: 'entity', id: 'greek-divine-tradition' }, target: { kind: 'entity', id: 'greek-heroic-tradition' },
      timeSpan: timeSpan(-1200, -800, '神话叙事约在公元前800年前形成', true),
      label: { forward: '介入英雄的选择与命运', reverse: '在神意帮助与惩罚中行动' },
      summaries: { canonical: '英雄叙事把诸神写成帮助者、阻碍者和冲突参与者，使神界争端在人间产生后果。' },
      sourceIds: ['source-perseus-iliad', 'source-cambridge-companion-greek-mythology']
    },
    {
      id: 'edge-hittite-wilusa-treaty', family: 'historicalNetwork', type: 'vassal_treaty',
      source: { kind: 'entity', id: 'troy-archaeological-site' }, target: { kind: 'entity', id: 'hittite-empire' },
      timeSpan: timeSpan(-1300, -1250, '约公元前1300—前1250年', true),
      label: { forward: '以维鲁萨国王身份进入赫梯条约网络', reverse: '通过条约约束维鲁萨国王' },
      summaries: { canonical: '穆瓦塔利二世与阿拉克桑杜的条约把维鲁萨纳入赫梯大王与地方统治者的外交网络。' },
      qualifiers: ['维鲁萨与特洛伊的对应属于学术识别'], sourceIds: ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa']
    },
    {
      id: 'edge-troy-iliad-memory', family: 'historicalNetwork', type: 'reworked_in_epic_tradition',
      source: { kind: 'entity', id: 'iliad-text' }, target: { kind: 'entity', id: 'troy-archaeological-site' },
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      label: { forward: '把废墟与战争记忆重组为英雄故事', reverse: '在长期歌唱中获得英雄姓名' },
      summaries: { canonical: '《伊利亚特》的口头传统把特洛伊城、跨海战争与英雄人物组织为诗歌，但遗址不能证明诗中人物的历史身份。' },
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-iliad-history-fiction', 'source-british-museum-lost-troy']
    },
    {
      id: 'edge-iliad-heroic-tradition', family: 'historicalNetwork', type: 'part_of_heroic_song_tradition',
      source: { kind: 'entity', id: 'iliad-text' }, target: { kind: 'entity', id: 'greek-heroic-tradition' },
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      label: { forward: '聚焦英雄时代的一次愤怒', reverse: '在阿喀琉斯与赫克托耳的故事中汇聚' },
      summaries: { canonical: '《伊利亚特》从更广阔的英雄传统中截取阿喀琉斯愤怒所造成的一连串后果。' },
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad']
    },
    {
      id: 'edge-odyssey-heroic-tradition', family: 'historicalNetwork', type: 'part_of_heroic_return_tradition',
      source: { kind: 'entity', id: 'odyssey-text' }, target: { kind: 'entity', id: 'greek-heroic-tradition' },
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      label: { forward: '把英雄时代延伸到漫长归乡', reverse: '在奥德修斯的归乡歌中继续' },
      summaries: { canonical: '《奥德赛》把特洛伊战争后的归乡传统组织为身份、待客、家庭与暴力秩序的故事。' },
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey']
    },
    {
      id: 'edge-dark-age-odyssey-song', family: 'historicalNetwork', type: 'performed_in_oral_tradition',
      source: { kind: 'entity', id: 'odyssey-text' }, target: { kind: 'entity', id: 'greek-dark-age-communities' },
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      label: { forward: '在后宫殿社会的歌唱中重组归乡', reverse: '以宴会、航海和家庭经验承载归乡歌' },
      summaries: { canonical: '宫殿文字消失后的歌者把漂泊、待客和归家反复重讲，逐渐形成《奥德赛》的海上世界。' },
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-cambridge-greek-iron-age-pottery']
    }
  ];

  const cards = [
    {
      id: 'crete-through-palatial-age', kind: 'overview', primaryEntityId: 'minoan-palatial-civilization', relatedEntityIds: ['mycenaean-civilization'],
      title: '克里特岛走过宫殿时代',
      editorialPurpose: '从成熟宫殿文明开始，说明克里特多个中心如何借庭院、仓储、作坊、书写与海上联系共同运转，又怎样被新的迈锡尼行政体系改变。',
      introduction: '一座岛上出现了不止一座宫殿。庭院、仓库、作坊和书写把许多人聚到一起，又在几百年后逐渐失去原来的位置。',
      thesis: { text: '克里特成熟文明由多个宫殿中心共同构成；宫殿在重建、书写和交换中发展，公元前1450年后又被新的迈锡尼行政体系改变，最终让位于不同的地方社区。', sourceIds: ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete', 'source-salgarella-writing-bronze-age-crete'] },
      timeSpan: timeSpan(-2000, -1100, '约公元前2000—前1100年', true),
      sceneIds: ['crete-court-palace-daily-life', 'crete-linear-a-at-work', 'crete-palaces-rebuild-seaward', 'crete-tablets-change-language', 'crete-palaces-end-island-continues'],
      sourceIds: ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete', 'source-salgarella-writing-bronze-age-crete', 'source-hooker-linear-a', 'source-poursat-minoan-artworks'],
      editorialReview: review(
        [limitation('crete-review-palace-records', '宫殿建筑和行政材料使中心机构更容易被看见，岛上不受宫殿直接控制的生活较难复原。', ['source-met-minoan-crete', 'source-salgarella-writing-bronze-age-crete'])],
        [],
        [interpretation('crete-review-linear-a', '线形文字A尚未被可靠读懂，具体语言、记录内容和制度术语不能从符号外形直接推定。', ['source-hooker-linear-a', 'source-salgarella-writing-bronze-age-crete'])],
        [interpretation('crete-review-transition', '公元前1450年前后的变化可能包含破坏、权力重组与大陆人群进入，不能用一场统一征服解释所有中心。', ['source-met-minoan-crete', 'source-salgarella-writing-bronze-age-crete'])],
        ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete', 'source-salgarella-writing-bronze-age-crete', 'source-hooker-linear-a']
      )
    },
    {
      id: 'mycenae-graves-palaces-tablets', kind: 'overview', primaryEntityId: 'mycenaean-civilization', relatedEntityIds: ['minoan-palatial-civilization', 'greek-dark-age-communities', 'greek-divine-tradition', 'greek-heroic-tradition'],
      title: '墓穴、宫殿与泥板',
      editorialPurpose: '从墓葬精英、克里特书写传统、宫殿账目和宫殿终结理解迈锡尼世界，并预留由泥版神名进入希腊诸神、由英雄歌唱进入《伊利亚特》的后续入口。',
      introduction: '宫殿出现以前，黄金、武器和远方器物先被送进墓穴。几百年后，书吏在坚固宫城中登记羊群、工匠和青铜。',
      thesis: { text: '迈锡尼文明从大陆精英与爱琴海交流中形成，发展出多个宫殿政权和记录希腊语的行政书写；宫殿终结后，其社区与物质传统仍延续了一段时间。', sourceIds: ['source-met-mycenaean-civilization', 'source-killen-mycenaean-society', 'source-deger-jalkotzy-aftermath'] },
      timeSpan: timeSpan(-1700, -1050, '约公元前1700—前1050年', true),
      sceneIds: ['mycenae-gold-enters-graves', 'mycenae-linear-b-writes-greek', 'mycenae-palaces-write-needs', 'mycenae-palaces-stop-commanding', 'mycenae-hero-stories-travel'],
      sourceIds: ['source-met-mycenaean-civilization', 'source-killen-mycenaean-society', 'source-bsa-linear-b', 'source-cambridge-mycenaean-religion', 'source-deger-jalkotzy-aftermath', 'source-cambridge-guide-homer'],
      editorialReview: review(
        [limitation('mycenae-review-palace-view', '墓葬与宫殿档案偏向精英和行政活动，普通家庭与宫殿之外的交换更难被看见。', ['source-met-mycenaean-civilization', 'source-killen-mycenaean-society'])],
        [],
        [interpretation('mycenae-review-collapse', '不同宫殿的毁坏、废弃与社会收缩次序不一，原因不能归结为单一入侵。', ['source-deger-jalkotzy-aftermath', 'source-knapp-manning-crisis'])],
        [interpretation('mycenae-review-homer', '荷马史诗形成于长期口头创作，不能把其中人物和战争当作宫殿时代的逐字历史记录。', ['source-cambridge-guide-homer'])],
        ['source-met-mycenaean-civilization', 'source-killen-mycenaean-society', 'source-deger-jalkotzy-aftermath', 'source-cambridge-guide-homer']
      )
    },
    {
      id: 'greece-reconnects-after-palaces', kind: 'overview', primaryEntityId: 'greek-dark-age-communities', relatedEntityIds: ['mycenaean-civilization', 'greek-heroic-tradition', 'odyssey-text'],
      title: '宫殿之后，希腊重新连接',
      editorialPurpose: '把所谓黑暗时代写成从宫殿收缩、技术延续到区域联系增密的历史过程，并预留沿海路与口头传统进入《奥德赛》的后续入口。',
      introduction: '王宫不再发出命令，书吏也停止写字。此后的四百年并非一片空白，人们正在较小的社区里重新安排生产、身份和远方联系。',
      thesis: { text: '宫殿体系的消失带来显著收缩和地方化，但生产、技术和航海并未中断；铁器、陶器和新的区域联系显示出另一种社会组织，至公元前800年爱琴海重新形成密集联系。', sourceIds: ['source-cambridge-mycenaean-transformation', 'source-bsa-aegean-iron-technologies', 'source-cambridge-greek-iron-age-pottery'] },
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      sceneIds: ['dark-age-orders-stop-tablets', 'dark-age-iron-enters-bronze-world', 'dark-age-sea-routes-return'],
      sourceIds: ['source-deger-jalkotzy-aftermath', 'source-cambridge-mycenaean-transformation', 'source-bsa-aegean-iron-technologies', 'source-cambridge-greek-iron-age-pottery', 'source-cambridge-guide-homer'],
      editorialReview: review(
        [limitation('dark-age-review-name', '“黑暗时代”主要指书写材料稀少和后世认识受限，不表示这一时期没有社会变化、技术或远距离联系。', ['source-cambridge-mycenaean-transformation'])],
        [],
        [],
        [interpretation('dark-age-review-regions', '爱琴海各地人口、聚落与联系的变化幅度不同，不能用单一的持续衰退曲线概括。', ['source-cambridge-mycenaean-transformation', 'source-cambridge-greek-iron-age-pottery']), interpretation('dark-age-review-iron', '铁器增加与青铜供应、工艺学习和社会需求共同相关，不应被写成一种金属自动造成社会进步。', ['source-bsa-aegean-iron-technologies'])],
        ['source-deger-jalkotzy-aftermath', 'source-cambridge-mycenaean-transformation', 'source-bsa-aegean-iron-technologies', 'source-cambridge-greek-iron-age-pottery']
      )
    },
    {
      id: 'greek-gods-leave-palaces', kind: 'thematic', primaryEntityId: 'greek-divine-tradition', relatedEntityIds: ['mycenaean-civilization', 'greek-heroic-tradition', 'iliad-text'],
      title: '众神走出宫殿',
      editorialPurpose: '用两幕历史说明神名与祭祀如何跨过宫殿终结，再以神话叙事概览代际夺权、神界分工、祭祀关系、季节循环及诸神对英雄的介入。',
      introduction: '宫殿书吏曾把油、谷物和牲畜分给神。书写停止以后，歌者却让这些神组成家庭、争夺权力，并把目光投向人间。',
      thesis: { text: '早期泥版保存了一些后来熟悉的神名，却没有保存完整神话；我们熟悉的神界，是地方祭祀与不断变化的故事传统共同形成的。', sourceIds: ['source-cambridge-mycenaean-religion', 'source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology'] },
      timeSpan: timeSpan(-1450, -800, '历史背景约公元前1450—前800年；神话叙事不标具体年代', true),
      sceneIds: ['gods-names-enter-tablets', 'gods-survive-palaces', 'gods-younger-overthrow-older', 'gods-three-brothers-divide-world', 'gods-olympus-quarrels', 'gods-gifts-and-requests', 'gods-demeter-persephone-return', 'gods-turn-to-heroes'],
      sourceIds: ['source-cambridge-mycenaean-religion', 'source-lupack-local-horizon', 'source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology', 'source-perseus-hesiod-theogony', 'source-perseus-homeric-hymn-demeter', 'source-met-greek-gods-practices', 'source-perseus-iliad'],
      editorialReview: review(
        [limitation('gods-review-tablet-bias', '线形文字B泥版服务于宫殿行政，容易让可登记的供物与神名压过未被记录的地方仪式和口头叙事。', ['source-cambridge-mycenaean-religion'])],
        [historicalCase('gods-review-name-continuity', '神名延续不等于神格不变', '同一神名跨越时期出现，并不证明其职能、亲属关系和祭祀方式始终不变。', ['event-mycenaean-palace-administration', 'event-mycenaean-palaces-end'], ['source-lupack-local-horizon', 'source-rutherford-greek-religion-lba-eia'])],
        [interpretation('gods-review-transmission', '公元前1200—前800年各地如何保存并重组具体神话，无法从现存材料完整复原。', ['source-rutherford-greek-religion-lba-eia'])],
        [interpretation('gods-review-influences', '希腊神话传统还可能吸收米诺斯、近东、地方祭祀和跨海交流中的多重影响。', ['source-cambridge-companion-greek-mythology'])],
        ['source-cambridge-mycenaean-religion', 'source-rutherford-greek-religion-lba-eia', 'source-cambridge-companion-greek-mythology']
      )
    },
    {
      id: 'greek-heroes-live-in-song', kind: 'thematic', primaryEntityId: 'greek-heroic-tradition', relatedEntityIds: ['mycenaean-civilization', 'greek-dark-age-communities', 'greek-divine-tradition', 'iliad-text', 'odyssey-text'],
      title: '英雄活在歌声里',
      editorialPurpose: '用遗迹与口头表演交代英雄时代的历史层，再概览神裔英雄、怪物、远航、家族诅咒、特洛伊战争与漫长归乡。',
      introduction: '宫殿倒下以后，废墟仍比普通房屋高大，墓穴里的黄金仍在发光。歌者把这些陌生遗迹交给英雄，让他们远征、犯罪、受苦并寻找归途。',
      thesis: { text: '英雄时代不是一段可以精确复原的历史；长期口头传统把青铜时代遗存、战士理想和神话家族组织成了共享的过去。', sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-guide-mycenae', 'source-rhodes-homeric-state'] },
      timeSpan: timeSpan(-1600, -800, '历史背景约公元前1600—前800年；神话叙事不标具体年代', true),
      sceneIds: ['heroes-ruins-hold-stronger-past', 'heroes-singers-remake-lost-age', 'heroes-between-gods-and-mortals', 'heroes-monsters-wait', 'heroes-board-argo', 'heroes-curses-cross-generations', 'heroes-gather-at-troy', 'heroes-homecomings-continue'],
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-guide-mycenae', 'source-rhodes-homeric-state', 'source-stafford-herakles', 'source-perseus-apollodorus-library', 'source-perseus-iliad', 'source-perseus-odyssey-eight'],
      editorialReview: review(
        [limitation('heroes-review-elite-material', '考古遗迹与随葬品主要呈现青铜时代精英和宫殿世界，不能代表所有人的生活。', ['source-cambridge-guide-mycenae'])],
        [historicalCase('heroes-review-women', '女性也推动英雄叙事', '英雄传统并非只有男性战士；阿塔兰忒、美狄亚和海伦等女性也会推动远航、战争与家族冲突。', ['event-mycenaean-palaces-end', 'event-aegean-localizes-after-palaces'], ['source-cambridge-companion-greek-mythology', 'source-perseus-apollodorus-library'])],
        [interpretation('heroes-review-historicity', '个别英雄或战争是否含有可辨认的历史核心，现有材料不能逐一证实。', ['source-cambridge-guide-homer'])],
        [interpretation('heroes-review-social-memory', '英雄世界也可理解为后宫殿时期对首领竞争、宴会、海上网络和后来价值的重新投射。', ['source-rhodes-homeric-state', 'source-cambridge-guide-homer'])],
        ['source-cambridge-guide-homer', 'source-cambridge-guide-mycenae', 'source-rhodes-homeric-state', 'source-cambridge-companion-greek-mythology']
      )
    },
    {
      id: 'troy-layered-city', kind: 'thematic', primaryEntityId: 'troy-archaeological-site', relatedEntityIds: ['hittite-empire', 'iliad-text'],
      title: '高墙下的层层城市',
      editorialPurpose: '先用土层、城墙和赫梯条约呈现晚青铜时代城市，再在最后一幕说明废墟如何进入长期英雄歌唱。',
      introduction: '海峡旁的土丘不只埋着一座城市。城墙倒下后，居民在旧址重建；新的房屋又被火焚毁，生活却仍没有完全离开这里。',
      thesis: { text: '特洛伊是一组反复建造、毁坏和继续居住的聚落。赫梯条约使它进入晚青铜时代的政治世界；几百年口头传讲之后，这片废墟才得到英雄的姓名。', sourceIds: ['source-unesco-troy', 'source-cambridge-hittite-troy', 'source-cambridge-guide-homer'] },
      timeSpan: timeSpan(-1700, -800, '约公元前1700—前800年', true),
      sceneIds: ['troy-walls-fall-city-rebuilds', 'troy-wilusa-enters-treaty', 'troy-ruins-gain-heroic-names'],
      sourceIds: ['source-unesco-troy', 'source-british-museum-lost-troy', 'source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa', 'source-cambridge-guide-homer', 'source-cambridge-iliad-history-fiction'],
      editorialReview: review(
        [limitation('troy-review-names', '考古土层能够显示毁坏、重建和生活延续，却不能提供攻城者或居民的个人姓名。', ['source-unesco-troy', 'source-british-museum-lost-troy'])],
        [historicalCase('troy-review-continuity', '毁坏没有终止全部生活', '特洛伊VIIa毁坏后，土丘仍有居民活动，因此遗址不是一次战争后永久空置的城市。', ['event-troy-vi-viia-destruction'], ['source-unesco-troy'])],
        [interpretation('troy-review-destructions', '特洛伊VI与VIIa毁坏的年代和原因仍有讨论，不能把任何一层自动等同于诗中的战争。', ['source-british-museum-lost-troy', 'source-cambridge-iliad-history-fiction'])],
        [interpretation('troy-review-memory', '英雄传统可能综合了安纳托利亚西部多次冲突、地方记忆与后世社会经验，而不是保存一场战争的连续报道。', ['source-cambridge-guide-homer', 'source-cambridge-iliad-history-fiction'])],
        ['source-unesco-troy', 'source-british-museum-lost-troy', 'source-cambridge-hittite-troy', 'source-cambridge-guide-homer', 'source-cambridge-iliad-history-fiction']
      )
    },
    {
      id: 'iliad-achilles-anger', kind: 'thematic', primaryEntityId: 'iliad-text', relatedEntityIds: ['troy-archaeological-site', 'greek-heroic-tradition', 'greek-divine-tradition'],
      title: '阿喀琉斯的愤怒',
      editorialPurpose: '让未读过原作的读者顺着争吵、退出、失败、帕特罗克洛斯之死、复仇与归还尸体，完整理解史诗的主要情节。',
      introduction: '希腊军队已经围攻特洛伊多年，最危险的裂缝却出现在自己人之间。最强的战士阿喀琉斯受到统帅羞辱，从战场退出；他的愤怒随后夺走朋友、敌人和许多普通战士的生命。',
      thesis: { text: '阿喀琉斯先想让同伴为自己的受辱付出代价，后来又把失去朋友的悲痛变成复仇。史诗最后没有写城市陷落，而是让他面对一位同样失去亲人的父亲。', sourceIds: ['source-cambridge-iliad-overview', 'source-perseus-iliad'] },
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      sceneIds: ['iliad-singer-starts-near-war-end', 'iliad-two-captives-start-quarrel', 'iliad-achilles-lets-greeks-fail', 'iliad-hector-reaches-ships', 'iliad-patroclus-wears-armor', 'iliad-new-shield-returns-hero', 'iliad-hector-dies-outside-walls', 'iliad-priam-enters-enemy-camp'],
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad', 'source-cambridge-iliad-history-fiction'],
      editorialReview: review(
        [limitation('iliad-review-transmission', '现存《伊利亚特》经过长期口头传讲和文本传承，不能把每一处细节直接放回单一青铜时代。', ['source-cambridge-guide-homer']), limitation('iliad-review-scope', '木马、特洛伊陷落和阿喀琉斯死亡不在《伊利亚特》的主要情节内。', ['source-cambridge-iliad-overview', 'source-perseus-iliad'])],
        [],
        [interpretation('iliad-review-history', '诗歌与晚青铜时代冲突之间是否存在可辨认的一一对应，现有材料无法确定。', ['source-cambridge-iliad-history-fiction'])],
        [interpretation('iliad-review-layers', '诗中的武器、礼俗和社会关系可以来自不同传承阶段，不必属于同一个历史年代。', ['source-cambridge-guide-homer', 'source-cambridge-iliad-history-fiction'])],
        ['source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad', 'source-cambridge-iliad-history-fiction']
      )
    },
    {
      id: 'odyssey-name-and-home', kind: 'thematic', primaryEntityId: 'odyssey-text', relatedEntityIds: ['greek-heroic-tradition', 'greek-dark-age-communities'],
      title: '失去姓名，才能回家',
      editorialPurpose: '让未读过原作的读者同时跟随奥德修斯的海上回忆与伊塔卡家中的危机，理解归乡为何还需要隐藏身份、辨认忠诚和重建家庭。',
      introduction: '奥德修斯离开家乡已经二十年。他终于从特洛伊战争返回时，船只、同伴和公开身份都已失去；而在家中，妻子与儿子也快要守不住他留下的一切。',
      thesis: { text: '奥德修斯靠机智逃出危险，却也因骄傲和错误一次次远离家园。抵达伊塔卡以后，他仍必须隐藏姓名、辨认忠诚，并让妻子相信这个衰老的陌生人就是离家多年的丈夫。', sourceIds: ['source-cambridge-odyssey-overview', 'source-perseus-odyssey', 'source-beck-odyssey-home-family'] },
      timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      sceneIds: ['odyssey-return-songs-become-poem', 'odyssey-suitors-consume-house', 'odyssey-calypso-releases-hero', 'odyssey-princess-leads-stranger', 'odyssey-nobody-defeats-cyclops', 'odyssey-wind-bag-opens', 'odyssey-witch-and-dead-guide-home', 'odyssey-songs-monsters-taboo-kill-crew', 'odyssey-beggar-enters-own-hall', 'odyssey-bow-and-bed-restore-name'],
      sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey', 'source-beck-odyssey-home-family'],
      editorialReview: review(
        [limitation('odyssey-review-geography', '诗中的岛屿、怪物与航程属于神话地理，不能全部固定在一张精确的现代路线图上。', ['source-cambridge-odyssey-overview', 'source-perseus-odyssey']), limitation('odyssey-review-family-agency', '珀涅罗珀的拖延、忒勒马科斯的成长和家中仆人的选择共同维持并重建奥德修斯的家，家园并非只靠归来的英雄保存。', ['source-perseus-odyssey', 'source-beck-odyssey-home-family'])],
        [],
        [interpretation('odyssey-review-formation', '不同归乡歌、海上故事与伊塔卡情节如何汇成现存长诗，无法逐步复原。', ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview'])],
        [interpretation('odyssey-review-identity', '这部诗也可以从身份、待客、家庭秩序与战争创伤的角度阅读，而不只是冒险路线。', ['source-beck-odyssey-home-family'])],
        ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey', 'source-beck-odyssey-home-family']
      )
    }
  ];

  const scenes = [
    {
      id: 'crete-court-palace-daily-life', eventIds: ['event-crete-palaces-emerge-and-rebuild'], title: '庭院装下宫殿的日常', eyebrow: '成熟宫殿文明', timeSpan: timeSpan(-2000, -1700, '约公元前2000—前1700年', true),
      contentBlocks: [fact('crete-court-palace-daily-life-fact', '约公元前二千年，克里特几处旧聚落旁出现围绕中央庭院的大型建筑。仓库的大罐收进粮食、酒和油，作坊加工陶器、石料与金属，人群又在庭院聚会和举行仪式。克诺索斯与岛上其他中心分别组织周边区域的活动。', ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-knossos-central-court' }, sourceIds: ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete', 'source-wikimedia-knossos-central-court']
    },
    {
      id: 'crete-linear-a-at-work', eventIds: ['event-crete-palaces-emerge-and-rebuild'], title: '线形文字A开始工作', eyebrow: '宫殿书写', timeSpan: timeSpan(-1900, -1450, '约公元前1900—前1450年', true),
      contentBlocks: [fact('crete-linear-a-at-work-fact', '书写随宫殿管理一同增加。书吏使用克里特象形文字，也使用今天称为线形文字A的符号，在泥版、封泥、器皿和祭祀用品上留下记录。数字和版式显出清点工作的痕迹，但符号记录的语言至今仍未被读懂。', ['source-salgarella-writing-bronze-age-crete', 'source-hooker-linear-a'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-linear-a-tablets' }, sourceIds: ['source-salgarella-writing-bronze-age-crete', 'source-hooker-linear-a', 'source-wikimedia-linear-a-akrotiri']
    },
    {
      id: 'crete-palaces-rebuild-seaward', eventIds: ['event-crete-palaces-emerge-and-rebuild'], title: '重建的宫殿望向海上', eyebrow: '重建与交换', timeSpan: timeSpan(-1700, -1450, '约公元前1700—前1450年', true),
      contentBlocks: [fact('crete-palaces-rebuild-seaward-fact', '约公元前1700年前后，多座宫殿毁坏后在旧址重建，规模更大的房间、楼梯和壁画随之出现。船只又从塞浦路斯、埃及和西亚方向带回铜、锡、象牙与贵重石料。重新长起的宫殿依靠岛内劳作，也依靠海上的伙伴。', ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete', 'source-poursat-minoan-artworks'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-akrotiri-flotilla' }, sourceIds: ['source-unesco-minoan-palatial-centres', 'source-met-minoan-crete', 'source-poursat-minoan-artworks', 'source-wikimedia-akrotiri-flotilla']
    },
    {
      id: 'crete-tablets-change-language', eventIds: ['event-knossos-linear-b-administration'], title: '泥版换了一种语言', eyebrow: '迈锡尼行政进入克里特', timeSpan: timeSpan(-1450, -1375, '约公元前1450—前1375年', true),
      contentBlocks: [fact('crete-tablets-change-language-fact', '约公元前1450年前后，多处宫殿中心在毁坏后不再恢复原来的形态。克诺索斯继续运转，泥版上却出现了记录早期希腊语的线形文字B。来自大陆的迈锡尼统治者和书吏开始使用克里特留下的行政工具。', ['source-met-minoan-crete', 'source-salgarella-writing-bronze-age-crete', 'source-bsa-linear-b'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-knossos-linear-b' }, sourceIds: ['source-met-minoan-crete', 'source-salgarella-writing-bronze-age-crete', 'source-bsa-linear-b', 'source-wikimedia-knossos-linear-b']
    },
    {
      id: 'crete-palaces-end-island-continues', eventIds: ['event-mycenaean-palaces-end', 'event-aegean-localizes-after-palaces'], title: '宫殿结束，岛屿继续生活', eyebrow: '后宫殿时期', timeSpan: timeSpan(-1375, -1100, '约公元前1375—前1100年', true),
      contentBlocks: [synthesis('crete-palaces-end-island-continues-synthesis', '克诺索斯的宫殿行政后来也停止了，旧有中心不再集中全岛的仓储、书写和仪式。人们仍在克里特建造房屋、制作陶器、耕种并祭祀，也继续与岛外往来。到约公元前1100年，消失的是宫殿时代的组织方式，不是岛上的生活。', ['source-met-minoan-crete', 'source-poursat-minoan-artworks', 'source-deger-jalkotzy-aftermath'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-crete-postpalatial-krater' }, sourceIds: ['source-met-minoan-crete', 'source-poursat-minoan-artworks', 'source-deger-jalkotzy-aftermath', 'source-wikimedia-mouliana-krater']
    },

    {
      id: 'mycenae-gold-enters-graves', eventIds: ['event-mycenaean-shaft-grave-elites-emerge'], title: '黄金先进入墓穴', eyebrow: '宫殿以前', timeSpan: timeSpan(-1700, -1450, '约公元前1700—前1450年', true),
      contentBlocks: [fact('mycenae-gold-enters-graves-fact', '宫殿尚未出现时，迈锡尼的一些家族已把黄金、精制武器和远方器物送进深墓。他们又取得克里特制作的器皿，吸收壁画、印章和金属加工经验，用来表现战斗、狩猎与宴饮。新的权力世界先在墓穴旁显形。', ['source-met-mycenaean-civilization'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-mycenae-gold-mask' }, sourceIds: ['source-met-mycenaean-civilization', 'source-wikimedia-mycenae-gold-mask']
    },
    {
      id: 'mycenae-linear-b-writes-greek', eventIds: ['event-knossos-linear-b-administration', 'event-mycenaean-palace-administration'], title: '线形文字B写下希腊语', eyebrow: '克里特书写传统', timeSpan: timeSpan(-1450, -1400, '约公元前1450—前1400年', true),
      contentBlocks: [fact('mycenae-linear-b-writes-greek-fact', '迈锡尼书吏采用克里特已有的线形书写传统，调整符号和拼写方式，使它能够记录早期希腊语。今天称为线形文字B的系统保留了许多与线形文字A相似的字形，却服务于另一种语言。它先见于克里特，后来进入大陆宫殿。', ['source-salgarella-writing-bronze-age-crete', 'source-bsa-linear-b'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-knossos-linear-b' }, sourceIds: ['source-salgarella-writing-bronze-age-crete', 'source-bsa-linear-b', 'source-wikimedia-knossos-linear-b']
    },
    {
      id: 'mycenae-palaces-write-needs', eventIds: ['event-mycenaean-palace-administration'], title: '宫殿把需要的事情写进泥板', eyebrow: '宫殿世界', timeSpan: timeSpan(-1400, -1200, '约公元前1400—前1200年', true),
      contentBlocks: [fact('mycenae-palaces-write-needs-fact', '迈锡尼、皮洛斯等中心各自调动一片区域的资源。书吏清点羊群、羊毛、青铜、工匠和献祭物，名单中还出现了后世希腊人仍会祭祀的波塞冬等神名。村落家庭和商人仍在账目之外耕种、制作并交换许多物品。', ['source-killen-mycenaean-society', 'source-bsa-linear-b', 'source-cambridge-mycenaean-religion'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-mycenae-athena-tablet' }, sourceIds: ['source-killen-mycenaean-society', 'source-bsa-linear-b', 'source-cambridge-mycenaean-religion', 'source-wikimedia-mycenae-athena-tablet']
    },
    {
      id: 'mycenae-palaces-stop-commanding', eventIds: ['event-mycenaean-palaces-end'], title: '宫殿接连停止发令', eyebrow: '宫殿体系终结', timeSpan: timeSpan(-1250, -1180, '约公元前1250—前1180年', true),
      contentBlocks: [fact('mycenae-palaces-stop-commanding-fact', '公元前十三世纪后期，一些中心加固城墙、调整仓储，随后迈锡尼、皮洛斯、底比斯等宫殿相继毁坏或废弃。书吏不再增加档案，宫殿也没有恢复原来的征收和生产组织。各地转折并非发生在同一天，原因也可能彼此不同。', ['source-deger-jalkotzy-aftermath', 'source-knapp-manning-crisis'])],
      presentation: { kind: 'mapAndText', map: { mapStateId: 'map-lba-palace-centers', transition: 'cut', structureViewIds: [], layers: [{ kind: 'entity', entityId: 'late-bronze-palace-system', annotationId: 'annotation-lba-collapse-pylos', sourceIds: ['source-deger-jalkotzy-aftermath'] }], caption: '地图标出皮洛斯这一宫殿书写停止的实例；点位只表示相关地点，不把各地转折画成同时发生。' } },
      sourceIds: ['source-deger-jalkotzy-aftermath', 'source-knapp-manning-crisis']
    },
    {
      id: 'mycenae-hero-stories-travel', eventIds: ['event-aegean-localizes-after-palaces', 'event-greek-heroic-songs-form-and-circulate'], title: '宫殿消失，英雄故事开始远行', eyebrow: '后宫殿记忆', timeSpan: timeSpan(-1180, -1050, '约公元前1180—前1050年', true),
      contentBlocks: [interpretation('mycenae-hero-stories-travel-interpretation', '人们继续制作带有迈锡尼传统的陶器，也保留部分造船和金属加工技术。线形文字B没有回来，英雄、远征、失去同伴与家园的故事却能由歌者反复讲述。经过许多代人的重组，这些口头传统后来汇入《伊利亚特》等英雄诗歌。', ['source-deger-jalkotzy-aftermath', 'source-cambridge-guide-homer'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-mycenae-warrior-krater' }, sourceIds: ['source-deger-jalkotzy-aftermath', 'source-cambridge-guide-homer', 'source-wikimedia-mycenae-warrior-krater']
    },

    {
      id: 'dark-age-orders-stop-tablets', eventIds: ['event-mycenaean-palaces-end', 'event-aegean-localizes-after-palaces'], title: '命令停在烧硬的泥版上', eyebrow: '宫殿之后', timeSpan: timeSpan(-1200, -1050, '约公元前1200—前1050年', true),
      contentBlocks: [fact('dark-age-orders-stop-tablets-fact', '宫殿毁坏后，征收物资、调动工匠和保存档案的机构一同消失，线形文字B也停止使用。许多大型中心缩小或被放弃，人们转向村落、家庭和地方首领组织生产。陶器、房屋与墓葬成为认识这些社区的主要材料。', ['source-deger-jalkotzy-aftermath', 'source-cambridge-mycenaean-transformation'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-mycenae-warrior-krater' }, sourceIds: ['source-deger-jalkotzy-aftermath', 'source-cambridge-mycenaean-transformation', 'source-wikimedia-mycenae-warrior-krater']
    },
    {
      id: 'dark-age-iron-enters-bronze-world', eventIds: ['event-aegean-localizes-after-palaces', 'event-aegean-regional-links-renew'], title: '铁器进入仍有青铜的世界', eyebrow: '技术与陶器', timeSpan: timeSpan(-1050, -900, '约公元前1050—前900年', true),
      contentBlocks: [fact('dark-age-iron-enters-bronze-world-fact', '铁制刀剑、工具和饰物逐渐增多，工匠却没有立即放弃青铜。来自塞浦路斯和东地中海的经验经过克里特、优卑亚等地传播，又被不同社区重新掌握。陶工也用规整的同心圆装饰器皿，让新的地区联系变得可见。', ['source-bsa-aegean-iron-technologies', 'source-cambridge-greek-iron-age-pottery'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-protogeometric-amphora' }, sourceIds: ['source-bsa-aegean-iron-technologies', 'source-cambridge-greek-iron-age-pottery', 'source-wikimedia-protogeometric-amphora']
    },
    {
      id: 'dark-age-sea-routes-return', eventIds: ['event-aegean-regional-links-renew'], title: '海路带着货物和故事回来', eyebrow: '重新连接', timeSpan: timeSpan(-900, -800, '约公元前900—前800年', true),
      contentBlocks: [synthesis('dark-age-sea-routes-return-synthesis', '到公元前九世纪，带有不同地方风格的陶器沿爱琴海移动，工匠和船员也接触到更多远方材料。宫殿文字消失后的几百年里，歌者仍能在表演中重讲漂泊、待客和归家的故事。这些长期变化后来汇入《奥德赛》的海上世界。', ['source-cambridge-greek-iron-age-pottery', 'source-cambridge-guide-homer'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-naxos-geometric-pottery' }, sourceIds: ['source-cambridge-greek-iron-age-pottery', 'source-cambridge-guide-homer', 'source-wikimedia-naxos-geometric-pottery']
    },

    {
      id: 'gods-names-enter-tablets', eventIds: ['event-mycenaean-palace-administration'], title: '泥版已经写下神的名字', eyebrow: '宫殿里的献祭', timeSpan: timeSpan(-1450, -1200, '约公元前1450—前1200年', true),
      contentBlocks: [fact('gods-names-enter-tablets-fact', '皮洛斯、克诺索斯等宫殿的书吏，把油、谷物、牲畜和贵重物品登记在泥版上。收取它们的名字中已有宙斯、波塞冬、赫拉等神祇。书吏没有讲述他们怎样出生或争斗，只留下宫殿准备献出什么、由谁送往何处。', ['source-cambridge-mycenaean-religion', 'source-lupack-local-horizon'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-mycenae-athena-tablet' }, sourceIds: ['source-cambridge-mycenaean-religion', 'source-lupack-local-horizon', 'source-wikimedia-mycenae-athena-tablet']
    },
    {
      id: 'gods-survive-palaces', eventIds: ['event-mycenaean-palaces-end', 'event-greek-divine-narratives-form-in-song'], title: '宫殿消失，神没有离开', eyebrow: '口头传讲', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [interpretation('gods-survive-palaces-interpretation', '宫殿毁坏后，线形文字B不再记录献祭，祭祀却进入地方社群、露天圣地和共同宴饮。歌者也在一次次表演中重新组合古老名字与新故事。现存完整神话由更晚的文字保存，但它们背后经过了漫长的口头传讲。', ['source-rutherford-greek-religion-lba-eia', 'source-cambridge-guide-homer'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-naxos-geometric-pottery' }, sourceIds: ['source-rutherford-greek-religion-lba-eia', 'source-cambridge-guide-homer', 'source-wikimedia-naxos-geometric-pottery']
    },
    {
      id: 'gods-younger-overthrow-older', eventIds: ['event-greek-divine-narratives-form-in-song'], title: '新神推翻旧神', eyebrow: '神话叙事', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('gods-younger-overthrow-older-synthesis', '最初，大地盖亚与天空乌拉诺斯生下泰坦。泰坦中的克洛诺斯推翻父亲，却又害怕自己的孩子夺权，把他们逐一吞下。最小的宙斯被母亲藏起，长大后救出兄姐，联合他们击败泰坦，成为新一代神祇的领袖。', ['source-perseus-hesiod-theogony', 'source-cambridge-companion-greek-mythology'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-gods-rhea-cronus' }, sourceIds: ['source-perseus-hesiod-theogony', 'source-cambridge-companion-greek-mythology', 'source-wikimedia-rhea-cronus']
    },
    {
      id: 'gods-three-brothers-divide-world', eventIds: ['event-greek-divine-narratives-form-in-song'], title: '三兄弟分掌世界', eyebrow: '神话叙事', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('gods-three-brothers-divide-world-synthesis', '胜利以后，三兄弟分掌世界。宙斯取得天空，以雷霆维持众神秩序；波塞冬进入海洋，也能震动大地；哈得斯统治死者前往的地下世界。大地和奥林匹斯并未完全属于任何一位，众神仍会在那里相遇、合作和争执。', ['source-perseus-hesiod-theogony', 'source-cambridge-companion-greek-mythology'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-gods-three-realms' }, sourceIds: ['source-perseus-hesiod-theogony', 'source-cambridge-companion-greek-mythology', 'source-wikimedia-three-realms']
    },
    {
      id: 'gods-olympus-quarrels', eventIds: ['event-greek-divine-narratives-form-in-song'], title: '奥林匹斯是一个争吵的家庭', eyebrow: '神话叙事', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('gods-olympus-quarrels-synthesis', '宙斯居于王位，赫拉守护婚姻，也不断与丈夫冲突。雅典娜从父亲头中诞生，掌管谋略与技艺；阿波罗带来预言、音乐和瘟疫，阿耳忒弥斯穿行荒野；阿佛洛狄忒让神和人陷入欲望。亲缘没有带来和睦，反而把权力、嫉妒和偏爱带进同一个家庭。', ['source-perseus-hesiod-theogony', 'source-cambridge-companion-greek-mythology'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-gods-council-met' }, sourceIds: ['source-perseus-hesiod-theogony', 'source-cambridge-companion-greek-mythology', 'source-wikimedia-council-gods-met']
    },
    {
      id: 'gods-gifts-and-requests', eventIds: ['event-greek-divine-narratives-form-in-song'], title: '神要求祭品，也回应请求', eyebrow: '祭祀关系', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('gods-gifts-and-requests-synthesis', '凡人焚烧祭品、倾倒酒液、立下誓言，也在战争、航海、婚姻和收获前祈求帮助。神可能接受礼物、保护城市或赐下征兆，也可能因轻慢祭司、破坏誓言和过度自负而降下惩罚。人与神之间没有永久契约，只有需要不断维护的关系。', ['source-met-greek-gods-practices', 'source-perseus-iliad'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-gods-zeus-libation' }, sourceIds: ['source-met-greek-gods-practices', 'source-perseus-iliad', 'source-wikimedia-zeus-iris-libation']
    },
    {
      id: 'gods-demeter-persephone-return', eventIds: ['event-greek-divine-narratives-form-in-song'], title: '季节、死亡与重新归来', eyebrow: '神话叙事', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('gods-demeter-persephone-return-synthesis', '地下世界之主带走珀耳塞福涅后，她的母亲德墨忒尔放下了让谷物生长的力量。大地逐渐荒芜，众神终于同意让女儿归来；可她已经吃下地下世界的食物，每年仍须离开母亲一段时间。分离与重逢从此进入播种、枯萎和复苏的循环。', ['source-perseus-homeric-hymn-demeter', 'source-cambridge-companion-greek-mythology'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-gods-demeter-persephone' }, sourceIds: ['source-perseus-homeric-hymn-demeter', 'source-cambridge-companion-greek-mythology', 'source-wikimedia-demeter-persephone-batten']
    },
    {
      id: 'gods-turn-to-heroes', eventIds: ['event-greek-divine-narratives-form-in-song'], title: '众神把目光投向英雄', eyebrow: '进入英雄时代', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('gods-turn-to-heroes-synthesis', '英雄可能是神的子女、宠儿或仇敌。雅典娜按住阿喀琉斯拔剑的手，阿波罗用瘟疫惩罚军队，阿佛洛狄忒从战场救走自己偏爱的人。众神的争执因此在人间留下伤口；英雄获得超常帮助，也必须承担卷入神意的代价。', ['source-perseus-iliad', 'source-cambridge-companion-greek-mythology'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-gods-athena-achilles' }, sourceIds: ['source-perseus-iliad', 'source-cambridge-companion-greek-mythology', 'source-wikimedia-athena-achilles-illustration']
    },

    {
      id: 'heroes-ruins-hold-stronger-past', eventIds: ['event-mycenaean-shaft-grave-elites-emerge', 'event-mycenaean-palace-administration'], title: '废墟留下一个更强大的过去', eyebrow: '青铜时代遗迹', timeSpan: timeSpan(-1600, -1200, '约公元前1600—前1200年', true),
      contentBlocks: [fact('heroes-ruins-hold-stronger-past-fact', '迈锡尼的城墙、墓穴和战士器物属于青铜时代精英。宫殿消失后，这些巨大遗迹仍留在希腊人的生活空间中，像一个力量远胜当下的过去。歌者不必知道墓主姓名，也能让黄金、战车、远征和高墙进入英雄故事。', ['source-cambridge-guide-mycenae', 'source-met-mycenaean-civilization'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-mycenae-lion-gate-clear' }, sourceIds: ['source-cambridge-guide-mycenae', 'source-met-mycenaean-civilization', 'source-wikimedia-mycenae-lion-gate-clear']
    },
    {
      id: 'heroes-singers-remake-lost-age', eventIds: ['event-greek-heroic-songs-form-and-circulate'], title: '歌者重新组织失去的时代', eyebrow: '口头表演', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [interpretation('heroes-singers-remake-lost-age-interpretation', '宴会中的歌者可以应听众要求，选择一位英雄、一次争吵或一段归航，当场用熟悉的诗句重新组合。故事因此保存旧名字，也吸收后来几代人的武器、礼俗和忧虑。英雄时代不是消失的宫殿档案，而是一次次表演共同创造的过去。', ['source-cambridge-guide-homer', 'source-perseus-odyssey-eight'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-demodocus' }, sourceIds: ['source-cambridge-guide-homer', 'source-perseus-odyssey-eight', 'source-wikimedia-demodocus-flaxman']
    },
    {
      id: 'heroes-between-gods-and-mortals', eventIds: ['event-greek-heroic-songs-form-and-circulate'], title: '英雄站在神与凡人之间', eyebrow: '神话叙事', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('heroes-between-gods-and-mortals-synthesis', '英雄常有神圣父母、惊人力量或特殊武器，却不像神那样永生。阿喀琉斯能压倒战场上的敌人，仍逃不过预定的短命；珀耳修斯得到神的工具，也必须亲自接近怪物。英雄的伟大不在于不会失败，而在于他们的选择会被长久讲述。', ['source-perseus-iliad', 'source-perseus-apollodorus-library'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-achilles-thetis' }, sourceIds: ['source-perseus-iliad', 'source-perseus-apollodorus-library', 'source-wikimedia-achilles-thetis-preller']
    },
    {
      id: 'heroes-monsters-wait', eventIds: ['event-greek-heroic-songs-form-and-circulate'], title: '怪物守在道路尽头', eyebrow: '神话叙事', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('heroes-monsters-wait-synthesis', '赫拉克勒斯拥有宙斯之子的力量，却因疯狂伤害家人，只能服从国王，完成看似不可能的任务。他扼死狮子、斩杀不断再生的蛇怪、清理污秽，也走入地下世界牵出守门犬。力量替他打开道路，却不能抹去错误和劳苦。', ['source-stafford-herakles', 'source-perseus-apollodorus-library'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-heracles-lion' }, sourceIds: ['source-stafford-herakles', 'source-perseus-apollodorus-library', 'source-wikimedia-heracles-lion-bm']
    },
    {
      id: 'heroes-board-argo', eventIds: ['event-greek-heroic-songs-form-and-circulate'], title: '一群英雄登上同一条船', eyebrow: '神话叙事', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('heroes-board-argo-synthesis', '伊阿宋要从遥远东方取回金羊毛，造船者为他准备了阿尔戈号。赫拉克勒斯、双生兄弟、歌者俄耳甫斯等英雄先后登船，各自用力量、航海、拳斗和歌声突破危险。远航把彼此竞争的英雄变成伙伴，也让背叛和牺牲随船同行。', ['source-perseus-apollodorus-library', 'source-cambridge-companion-greek-mythology'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-argonauts-leaving-colchis' }, sourceIds: ['source-perseus-apollodorus-library', 'source-cambridge-companion-greek-mythology', 'source-wikimedia-argonauts-roberti']
    },
    {
      id: 'heroes-curses-cross-generations', eventIds: ['event-greek-heroic-songs-form-and-circulate'], title: '家族把诅咒传给下一代', eyebrow: '神话叙事', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('heroes-curses-cross-generations-synthesis', '俄狄浦斯战胜怪物、成为国王，却发现自己早已落入试图逃开的预言。他的儿子随后争夺底比斯，引来新的战争。另一个家族中，阿特柔斯兄弟用欺骗、谋杀和复仇争夺王位，罪行又落到子女身上。英雄能够攻破城市，却难以终止家中的暴力。', ['source-perseus-apollodorus-library', 'source-cambridge-companion-greek-mythology'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-oedipus-sphinx' }, sourceIds: ['source-perseus-apollodorus-library', 'source-cambridge-companion-greek-mythology', 'source-wikimedia-oedipus-sphinx-moreau']
    },
    {
      id: 'heroes-gather-at-troy', eventIds: ['event-greek-heroic-songs-form-and-circulate'], title: '英雄聚集在特洛伊城下', eyebrow: '通往《伊利亚特》', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('heroes-gather-at-troy-synthesis', '一场婚姻争端和旧日誓言召来许多希腊首领，他们乘船围住特洛伊。阿伽门农统率联军，阿喀琉斯追逐短暂而耀眼的荣誉，赫克托耳守护城中家人。《伊利亚特》只截取战争末期的一次愤怒，却让整个英雄世界在营地和城墙之间相撞。', ['source-perseus-iliad', 'source-cambridge-guide-homer'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-achilles-hector' }, sourceIds: ['source-perseus-iliad', 'source-cambridge-guide-homer', 'source-wikimedia-achilles-hector-groeninge']
    },
    {
      id: 'heroes-homecomings-continue', eventIds: ['event-greek-heroic-songs-form-and-circulate'], title: '战争结束，归乡仍未结束', eyebrow: '通往《奥德赛》', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('heroes-homecomings-continue-synthesis', '特洛伊陷落后，胜利者沿不同道路离开。有人死于风暴，有人回家后遭到谋杀，也有人被神怒和诱惑拖住多年。奥德修斯必须失去船只、同伴和姓名，才能重新成为家中的丈夫与父亲。英雄时代没有在胜利中结束，而是在漫长归途中逐渐散开。', ['source-perseus-odyssey-eight', 'source-cambridge-guide-homer'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-odysseus-return' }, sourceIds: ['source-perseus-odyssey-eight', 'source-cambridge-guide-homer', 'source-wikimedia-odysseus-return-pinturicchio']
    },

    {
      id: 'troy-walls-fall-city-rebuilds', eventIds: ['event-troy-vi-viia-destruction'], title: '高墙倒下，城市再次重建', eyebrow: '特洛伊VI与VIIa', timeSpan: timeSpan(-1700, -1180, '约公元前1700—前1180年', true),
      contentBlocks: [fact('troy-walls-fall-city-rebuilds-fact', '约公元前1700年以后，土丘上的城市修起向外倾斜的石墙、城门和塔楼。卫城下面还有更大的居住区，房屋和道路沿坡地展开。考古学家把这一阶段称为特洛伊VI；它是安纳托利亚西北部一座规模显著的设防城市。\n\n城墙后来严重受损，居民却没有离开。他们在旧防御体系内重新建房，屋舍更加密集，并把大型储藏罐埋入地面。这个被称为特洛伊VIIa的聚落又遭遇火灾和破坏。土层保存了城市怎样毁坏和重建，却没有留下攻城者的姓名。', ['source-unesco-troy', 'source-british-museum-lost-troy', 'source-cambridge-iliad-history-fiction'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-troy-vi-walls' }, sourceIds: ['source-unesco-troy', 'source-british-museum-lost-troy', 'source-cambridge-iliad-history-fiction', 'source-wikimedia-troy-vi-walls']
    },
    {
      id: 'troy-wilusa-enters-treaty', eventIds: ['event-hittite-wilusa-treaty'], title: '赫梯书吏把维鲁萨写进条约', eyebrow: '晚青铜时代外交', timeSpan: timeSpan(-1300, -1250, '约公元前1300—前1250年', true),
      contentBlocks: [fact('troy-wilusa-enters-treaty-fact', '赫梯帝国的中心位于安纳托利亚内陆，国王自称“大王”，通过条约约束远近不同的地方统治者。约公元前十三世纪，赫梯大王穆瓦塔利二世与一位名叫阿拉克桑杜的地方国王订立条约。阿拉克桑杜统治的地方叫作维鲁萨。\n\n许多研究者把维鲁萨识别为特洛伊。条约要求当地国王忠于赫梯大王，在发生战争时提供帮助；它说明这座西部城市处在赫梯外交网络中。条约没有记载城市后来怎样毁坏，也没有讲述一支希腊联军围城。', ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-troy-wilusa-treaty' }, sourceIds: ['source-cambridge-hittite-troy', 'source-british-museum-alaksandu-wilusa', 'source-wikimedia-troy-wilusa-treaty']
    },
    {
      id: 'troy-ruins-gain-heroic-names', eventIds: ['event-greek-heroic-songs-form-and-circulate'], title: '废墟后来得到英雄的姓名', eyebrow: '进入英雄歌唱', timeSpan: timeSpan(-1180, -800, '约公元前1180—前800年', true),
      contentBlocks: [interpretation('troy-ruins-gain-heroic-names-interpretation', '火灾以后，仍有人继续住在土丘上，只是聚落变得更小，建筑和器物也发生变化。晚青铜时代的宫殿和条约网络逐渐消失，高墙、海峡、火烧过的房屋以及跨海冲突的记忆却可以留在地方故事中。\n\n歌者经过许多代人的表演，把这些记忆组合成希腊首领远征特洛伊的战争。《伊利亚特》后来让阿喀琉斯、赫克托耳和普里阿摩斯在城墙内外行动。遗址为故事提供了一座城市，却不能证明诗中的人物曾经生活在这里。', ['source-british-museum-lost-troy', 'source-cambridge-guide-homer', 'source-cambridge-iliad-history-fiction'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-troy-hector-funeral' }, sourceIds: ['source-british-museum-lost-troy', 'source-cambridge-guide-homer', 'source-cambridge-iliad-history-fiction', 'source-wikimedia-flaxman-iliad-funeral']
    },

    {
      id: 'iliad-singer-starts-near-war-end', eventIds: ['event-iliad-oral-composition-and-transmission'], title: '歌者从战争末期开始', eyebrow: '长期口头传讲', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [
        fact('iliad-singer-starts-near-war-end-fact', '特洛伊战争故事在文字写定以前，已经由歌者表演了许多代。《伊利亚特》没有从战争起因开始，而是直接进入围城接近尾声的一段时间。木马、特洛伊陷落和阿喀琉斯死亡都不在这部史诗的主要情节中。', ['source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad']),
        interpretation('iliad-singer-starts-near-war-end-interpretation', '围城一方是从爱琴海各地乘船而来的希腊军队，诗中常称他们为阿开亚人。统率联军的是阿伽门农，他是迈锡尼的国王，也是诸位首领中地位最高的人。最强战士阿喀琉斯是凡人国王珀琉斯与海中女神忒提斯的儿子，率领自己的部众参战。守城一方由特洛伊王子赫克托耳领兵；他是老国王普里阿摩斯的长子，也是城中最可靠的战士。', ['source-perseus-iliad'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-iliad-flaxman-title' }, sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-iliad-overview', 'source-perseus-iliad', 'source-wikimedia-flaxman-iliad-title']
    },
    {
      id: 'iliad-two-captives-start-quarrel', eventIds: ['event-iliad-oral-composition-and-transmission'], title: '两个俘虏引爆统帅之间的争吵', eyebrow: '阿喀琉斯的愤怒', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('iliad-two-captives-start-quarrel-synthesis', '阿伽门农分得的女俘克律塞伊斯，是太阳神阿波罗祭司克律塞斯的女儿。父亲带着赎金来求女儿，阿伽门农却把他赶走。祭司向阿波罗祈求报复，神便把瘟疫降到希腊军营。阿伽门农只得归还克律塞伊斯，却要从另一位首领手中拿走补偿。\n\n他选中了布里塞伊斯——分给阿喀琉斯的女俘。对战士而言，战利品是众人看得见的荣誉；夺走她，就是公开宣告阿喀琉斯必须服从。阿喀琉斯愤怒得要拔剑，掌管智慧与战术的女神雅典娜从身后拉住他。他没有杀死统帅，而是拒绝再为希腊军队作战。', ['source-perseus-iliad'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-gods-athena-achilles' }, sourceIds: ['source-perseus-iliad', 'source-wikimedia-athena-achilles-illustration']
    },
    {
      id: 'iliad-achilles-lets-greeks-fail', eventIds: ['event-iliad-oral-composition-and-transmission'], title: '阿喀琉斯让自己人尝到失败', eyebrow: '荣誉变成伤亡', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('iliad-achilles-lets-greeks-fail-synthesis', '阿喀琉斯不只退出战场。他来到海边，向母亲忒提斯诉说自己受辱。忒提斯是海中女神，知道儿子若留在特洛伊便会短命，却仍替他登上奥林匹斯山，请众神之首宙斯暂时让特洛伊人占上风。\n\n阿喀琉斯希望阿伽门农在失败中明白谁才是军队不可缺少的人。宙斯答应了请求。于是一次个人荣誉之争开始决定整支军队的命运：阿喀琉斯留在船边，其他希腊战士却要用伤亡替他证明价值。', ['source-perseus-iliad'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-iliad-thetis-zeus' }, sourceIds: ['source-perseus-iliad', 'source-wikimedia-flaxman-iliad-thetis-zeus']
    },
    {
      id: 'iliad-hector-reaches-ships', eventIds: ['event-iliad-oral-composition-and-transmission'], title: '赫克托耳把敌人逼回船边', eyebrow: '希腊军队败退', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('iliad-hector-reaches-ships-synthesis', '宙斯的允诺让战局倒向特洛伊。赫克托耳率军冲过希腊人修起的防墙，把敌人一直逼到海边船只。那些船既是希腊人的营地，也是他们回家的唯一道路；一旦被烧，整支远征军就可能困死在岸边。\n\n阿伽门农终于派出阿喀琉斯熟悉的长者和伙伴求和，答应送出丰厚礼物并归还布里塞伊斯。阿喀琉斯仍然拒绝。他说母亲曾告诉自己两种命运：留在特洛伊会得到不朽声名，却很快死去；回家则失去战场荣耀，却能活得更久。', ['source-perseus-iliad'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-iliad-embassy-achilles' }, sourceIds: ['source-perseus-iliad', 'source-wikimedia-flaxman-iliad-embassy']
    },
    {
      id: 'iliad-patroclus-wears-armor', eventIds: ['event-iliad-oral-composition-and-transmission'], title: '帕特罗克洛斯穿上朋友的铠甲', eyebrow: '朋友代替英雄出战', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('iliad-patroclus-wears-armor-synthesis', '帕特罗克洛斯是阿喀琉斯最亲近的伙伴，也与他共同率领部众。看见希腊船只起火，他请求穿上阿喀琉斯的铠甲出战：特洛伊人若误以为最强战士归来，也许会停止追击。阿喀琉斯同意，却命令他救下船只后立刻回来。\n\n帕特罗克洛斯赶走了船边的敌人，却继续追击到特洛伊城下。阿波罗从背后打落他的武器，其他战士先使他受伤，赫克托耳最后将他杀死，并夺走阿喀琉斯的铠甲。阿喀琉斯想用别人的失败恢复荣誉，最终失去的却是最亲近的人。', ['source-perseus-iliad'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-iliad-patroclus-body' }, sourceIds: ['source-perseus-iliad', 'source-wikimedia-flaxman-iliad-patroclus']
    },
    {
      id: 'iliad-new-shield-returns-hero', eventIds: ['event-iliad-oral-composition-and-transmission'], title: '一面新盾把英雄送回战场', eyebrow: '悲痛转为复仇', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('iliad-new-shield-returns-hero-synthesis', '阿喀琉斯伏在帕特罗克洛斯的尸体旁痛哭。他知道自己一旦杀死赫克托耳，也会很快迎来死亡，却仍决定回到战场。旧铠甲已被夺走，忒提斯便去找众神的工匠赫淮斯托斯，请他为儿子打造新的武器。\n\n新盾上不只有战争：两座城市里有人结婚、诉讼和被围攻，田野中有人耕作、收割、放牧和跳舞。阿喀琉斯把整个凡人世界背在手臂上，却只看向复仇。他与阿伽门农结束争吵，披上新甲冲向赫克托耳。', ['source-perseus-iliad'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-iliad-new-armor' }, sourceIds: ['source-perseus-iliad', 'source-wikimedia-flaxman-iliad-armor']
    },
    {
      id: 'iliad-hector-dies-outside-walls', eventIds: ['event-iliad-oral-composition-and-transmission'], title: '赫克托耳死在自己的城墙之外', eyebrow: '复仇抵达城下', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('iliad-hector-dies-outside-walls-synthesis', '其他特洛伊战士退回城内，赫克托耳却留在城门外。他是王子、丈夫和父亲，也曾率军把敌人逼到船边；若现在逃回去，他必须面对自己没有及早撤军的责任。阿喀琉斯逼近时，他仍害怕得绕城奔逃，最后才停下转身决斗。\n\n阿喀琉斯杀死赫克托耳。赫克托耳临死前请求敌人把尸体交还父母，阿喀琉斯却拒绝，把尸体拴在战车后拖走。复仇完成了，帕特罗克洛斯却没有回来；愤怒只能继续伤害已经死去的人和仍在等待的人。', ['source-perseus-iliad'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-iliad-hector-body' }, sourceIds: ['source-perseus-iliad', 'source-wikimedia-flaxman-iliad-hector']
    },
    {
      id: 'iliad-priam-enters-enemy-camp', eventIds: ['event-iliad-oral-composition-and-transmission'], title: '失去儿子的父亲走进敌营', eyebrow: '《伊利亚特》的终点', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('iliad-priam-enters-enemy-camp-synthesis', '普里阿摩斯是特洛伊的老国王，也是赫克托耳的父亲。他带着赎金离开城门，由众神的信使赫尔墨斯护送，悄悄进入阿喀琉斯营帐。老人跪下亲吻杀死儿子的双手，请阿喀琉斯想起远方仍在等待他的父亲珀琉斯。\n\n两个敌人都为失去和即将失去的亲人哭泣。阿喀琉斯终于收住愤怒，把赫克托耳的尸体交还，并答应暂时停战，让特洛伊人举行葬礼。《伊利亚特》没有以城市陷落结束，而以赫克托耳被安葬结束。', ['source-cambridge-iliad-overview', 'source-perseus-iliad'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-iliad-priam-achilles' }, sourceIds: ['source-cambridge-iliad-overview', 'source-perseus-iliad', 'source-wikimedia-flaxman-iliad-priam']
    },

    {
      id: 'odyssey-return-songs-become-poem', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '许多归乡歌汇成一部长诗', eyebrow: '长期口头传讲', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [
        interpretation('odyssey-return-songs-become-poem-interpretation', '特洛伊战争以后，不同英雄怎样回家本来就是一组可以反复演唱的故事。《奥德赛》把海上怪物、神的阻拦、异乡人的待客和伊塔卡家中的危机组合在一起，让一次归乡同时发生在远海和家门内。', ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey']),
        interpretation('odyssey-return-songs-become-poem-characters', '主人公奥德修斯是伊塔卡岛的国王，也是希腊联军中以谋略闻名的首领。他离家参战十年，战争结束后又漂泊十年。长诗开始时，他仍被困在海上；妻子珀涅罗珀和儿子忒勒马科斯则在家中等待一个可能永远不会回来的人。', ['source-perseus-odyssey'])
      ],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-demodocus' }, sourceIds: ['source-cambridge-guide-homer', 'source-cambridge-odyssey-overview', 'source-perseus-odyssey', 'source-wikimedia-demodocus-flaxman']
    },
    {
      id: 'odyssey-suitors-consume-house', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '求婚者正在吃空奥德修斯的家', eyebrow: '伊塔卡的危机', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('odyssey-suitors-consume-house-synthesis', '珀涅罗珀是奥德修斯的妻子。丈夫离家时，儿子忒勒马科斯还是婴儿；如今儿子已经长大，岛上贵族子弟却天天聚在王宫，宰杀牛羊、喝光酒窖，逼她承认丈夫已死并从他们中再选一人。\n\n珀涅罗珀说要先织完公公的寿衣，白天织、夜里拆，以此拖延婚事。掌管智慧与谋略的女神雅典娜一直偏爱奥德修斯。她化装成访客来到伊塔卡，鼓励忒勒马科斯离家寻找父亲消息，也学会在求婚者面前开口维护自己的家。', ['source-perseus-odyssey', 'source-beck-odyssey-home-family'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-odyssey-suitors' }, sourceIds: ['source-perseus-odyssey', 'source-beck-odyssey-home-family', 'source-wikimedia-flaxman-odyssey-suitors']
    },
    {
      id: 'odyssey-calypso-releases-hero', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '海上女神终于放走奥德修斯', eyebrow: '最后一次漂流', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('odyssey-calypso-releases-hero-synthesis', '奥德修斯被困在遥远岛屿上，岛的主人卡吕普索是一位女神。她爱上这个凡人，把他留在身边多年，甚至答应赐他永生；奥德修斯却每天坐在海边哭泣，只想回到会衰老的妻子身旁。雅典娜为他向众神求情，宙斯命令卡吕普索放人。\n\n奥德修斯造木筏出海。海神波塞冬憎恨他，因为奥德修斯弄瞎了自己的儿子。海神掀起风暴打碎木筏，奥德修斯游到善于航海的费埃克斯人岛上。他终于接近回家的船，却必须先把自己是谁、为何受罚讲给陌生人听。', ['source-perseus-odyssey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-odyssey-calypso-release' }, sourceIds: ['source-perseus-odyssey', 'source-wikimedia-flaxman-odyssey-hermes']
    },
    {
      id: 'odyssey-princess-leads-stranger', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '一位公主把陌生人带进宫廷', eyebrow: '费埃克斯人的待客', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('odyssey-princess-leads-stranger-synthesis', '费埃克斯公主瑙西卡是国王阿尔喀诺俄斯的女儿。她与侍女在河边洗衣玩球时，发现赤身、满身盐垢的奥德修斯。其他人惊叫逃开，瑙西卡却给陌生人衣服和食物，并告诉他怎样进入父亲的宫廷求助。\n\n费埃克斯人以船只和待客闻名。宴会上，盲眼歌者德摩多科斯唱起特洛伊战争，奥德修斯听见自己的过去，掩面流泪。阿尔喀诺俄斯注意到他的悲伤，询问陌生人的姓名。直到这时，奥德修斯才公开身份，并开始讲述自己失去船队的经过。', ['source-perseus-odyssey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-odyssey-nausicaa' }, sourceIds: ['source-perseus-odyssey', 'source-wikimedia-flaxman-odyssey-nausicaa']
    },
    {
      id: 'odyssey-nobody-defeats-cyclops', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '他用“无人”战胜独眼巨人', eyebrow: '奥德修斯讲述漂泊', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('odyssey-nobody-defeats-cyclops-synthesis', '奥德修斯告诉费埃克斯人，他和同伴曾进入独眼巨人波吕斐摩斯的洞穴。波吕斐摩斯是波塞冬之子，不耕田、不守待客规则，还用巨石封住洞口，接连抓起希腊人吃掉。奥德修斯送上烈酒，并谎称自己的名字是“无人”。\n\n巨人醉倒后，他们用烧红的木桩刺瞎他的独眼。波吕斐摩斯呼救，只能说“无人正在伤害我”，邻近巨人便不来帮忙。众人藏在羊腹下逃出洞穴；可船驶离岸边时，奥德修斯因骄傲喊出真名。波吕斐摩斯于是请求父亲波塞冬阻止仇人回家。', ['source-perseus-odyssey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-odyssey-polyphemus' }, sourceIds: ['source-perseus-odyssey', 'source-wikimedia-flaxman-odyssey-polyphemus']
    },
    {
      id: 'odyssey-wind-bag-opens', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '风袋在家乡岸外被打开', eyebrow: '船队接连失去', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('odyssey-wind-bag-opens-synthesis', '掌管风的埃俄罗斯把所有逆风装进皮袋，只留下能把船送回伊塔卡的顺风。家乡海岸已经出现时，疲惫的奥德修斯睡着了；同伴以为袋中藏着首领独占的金银，便把它打开。狂风一齐逃出，把船队吹回远海。\n\n后来他们驶进食人巨人莱斯特律戈涅斯人的港湾。当地统治者安提法忒斯杀死来访者，巨人从高处投下巨石，用长矛捕捉船员。十二艘船中，只有奥德修斯停在港外的一艘逃走。误解、贪心和错误停泊让归乡者越来越少。', ['source-perseus-odyssey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-odyssey-laestrygonians' }, sourceIds: ['source-perseus-odyssey', 'source-wikimedia-flaxman-odyssey-antiphates']
    },
    {
      id: 'odyssey-witch-and-dead-guide-home', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '女巫与死者指出归途', eyebrow: '喀耳刻与冥界', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('odyssey-witch-and-dead-guide-home-synthesis', '喀耳刻是住在岛上的女神，精通药草和魔法。她把进入宫室的船员变成猪。众神的信使赫尔墨斯给奥德修斯一株抵御魔药的草；奥德修斯迫使喀耳刻恢复同伴原形，后来又在她的岛上停留一年。\n\n要找到回家道路，喀耳刻让他先去死者世界询问提瑞西阿斯。提瑞西阿斯生前是底比斯的预言者，死后仍保存判断力。他警告奥德修斯不要伤害太阳神的牛。奥德修斯也见到已经去世的母亲和特洛伊旧友，第一次知道漫长漂泊让家中人同样承受失去。', ['source-perseus-odyssey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-odyssey-circe' }, sourceIds: ['source-perseus-odyssey', 'source-wikimedia-flaxman-odyssey-circe']
    },
    {
      id: 'odyssey-songs-monsters-taboo-kill-crew', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '歌声、怪物和禁令夺走所有同伴', eyebrow: '最后一艘船毁灭', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('odyssey-songs-monsters-taboo-kill-crew-synthesis', '塞壬是用歌声引船员走向死亡的怪物。奥德修斯让同伴用蜡封耳，把自己绑在桅杆上，才听见歌声而没有转向。随后船只必须从两种危险之间通过：悬崖怪物斯库拉抓走六人，另一侧的卡律布狄斯则像巨大漩涡吞吐海水。\n\n最后一行人困在太阳神赫利俄斯的岛上。奥德修斯反复转告禁令，同伴仍在饥饿中宰杀神牛。宙斯用雷霆击碎船只，所有同伴死去，只有奥德修斯漂到卡吕普索岛。此后他不再是一支船队的首领，只剩一个无人能替他证实经历的幸存者。', ['source-perseus-odyssey'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-odyssey-sirens' }, sourceIds: ['source-perseus-odyssey', 'source-wikimedia-flaxman-odyssey-sirens']
    },
    {
      id: 'odyssey-beggar-enters-own-hall', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '乞丐走进自己的宫室', eyebrow: '身份仍需隐藏', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('odyssey-beggar-enters-own-hall-synthesis', '费埃克斯人终于把睡着的奥德修斯送到伊塔卡。雅典娜把他变成衰老乞丐，让求婚者认不出来。他先到忠诚的养猪人欧迈俄斯家中，随后与已经回岛的儿子忒勒马科斯相认，父子一起计划夺回宫室。\n\n奥德修斯以陌生人身份走进自己的大厅，观察哪些仆人忠诚，忍受求婚者的辱骂。老狗阿尔戈斯认出主人后死去，珀涅罗珀却只能把他当作知道丈夫消息的旅客。回到地理上的家还不够，他必须在暴露姓名以前弄清这个家还剩下谁。', ['source-perseus-odyssey', 'source-beck-odyssey-home-family'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-odyssey-argus' }, sourceIds: ['source-perseus-odyssey', 'source-beck-odyssey-home-family', 'source-wikimedia-flaxman-odyssey-argus']
    },
    {
      id: 'odyssey-bow-and-bed-restore-name', eventIds: ['event-odyssey-oral-composition-and-transmission'], title: '弓弦与床榻恢复他的姓名', eyebrow: '归乡完成', timeDisplay: 'undatedNarrative', timeSpan: timeSpan(-1200, -800, '约公元前1200—前800年', true),
      contentBlocks: [synthesis('odyssey-bow-and-bed-restore-name-synthesis', '珀涅罗珀拿出奥德修斯留下的弓，宣布谁能拉开弓弦并把箭射过十二把斧头，谁就能娶她。求婚者无人成功，化装成乞丐的奥德修斯却完成考验。他亮明身份，与忒勒马科斯和忠诚仆人一起杀死占据宫室的求婚者。\n\n珀涅罗珀仍不立刻相信。她故意命人搬动婚床；奥德修斯说那张床由仍扎根地下的橄榄树干制成，根本无法移动。这个只有夫妻知道的秘密终于让她认出丈夫。求婚者亲属随后准备复仇，雅典娜出面制止，归乡才从一次夺回血腥宫室变成重新建立秩序。', ['source-perseus-odyssey', 'source-beck-odyssey-home-family'])],
      presentation: { kind: 'imageAndText', assetId: 'asset-aegean-heroes-odysseus-return' }, sourceIds: ['source-perseus-odyssey', 'source-beck-odyssey-home-family', 'source-wikimedia-odysseus-return-pinturicchio']
    }
  ];

  const navigationOptions = [
    { id: 'nav-crete-mycenae', target: { cardId: 'mycenae-graves-palaces-tablets', sceneId: 'mycenae-gold-enters-graves' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-minoan-mycenaean-administration' }, label: '进入迈锡尼的宫殿世界', description: '从墓穴里的黄金开始，看线形文字B怎样进入大陆宫殿。' },
    { id: 'nav-mycenae-crete', target: { cardId: 'crete-through-palatial-age', sceneId: 'crete-court-palace-daily-life' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-minoan-mycenaean-administration' }, label: '进入克里特的宫殿时代', description: '从围绕庭院的宫殿开始，看岛屿书写与行政语言怎样变化。' },
    { id: 'nav-mycenae-dark-age', target: { cardId: 'greece-reconnects-after-palaces', sceneId: 'dark-age-orders-stop-tablets' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-mycenaean-dark-age-reorganization' }, label: '进入宫殿之后的希腊', description: '从停止发令的宫殿继续，看地方社区怎样重组生活。' },
    { id: 'nav-dark-age-mycenae', target: { cardId: 'mycenae-graves-palaces-tablets', sceneId: 'mycenae-gold-enters-graves' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-mycenaean-dark-age-reorganization' }, label: '进入迈锡尼宫殿的兴衰', description: '从黄金进入墓穴开始，看宫殿如何兴起又终结。' },
    { id: 'nav-mycenae-late-bronze-collapse', target: { cardId: 'late-bronze-palaces-go-dark', sceneId: 'palaces-connect-kingdoms' }, basis: { kind: 'event', eventId: 'event-mycenaean-palaces-end' }, label: '进入晚青铜时代的区域瓦解', description: '把迈锡尼宫殿的终结放回赫梯、乌加里特、埃及与爱琴海各自不同的转折中。' },
    { id: 'nav-dark-age-late-bronze-collapse', target: { cardId: 'late-bronze-palaces-go-dark', sceneId: 'palaces-connect-kingdoms' }, basis: { kind: 'event', eventId: 'event-mycenaean-palaces-end' }, label: '进入宫殿接连熄灭的时代', description: '从宫殿之后的地方社区，查看此前东地中海多个中心怎样失去原有功能。' },
    { id: 'nav-collapse-mycenae', target: { cardId: 'mycenae-graves-palaces-tablets', sceneId: 'mycenae-gold-enters-graves' }, basis: { kind: 'event', eventId: 'event-mycenaean-palaces-end' }, label: '进入迈锡尼宫殿的兴衰', description: '沿爱琴海书写停止的线索，查看墓葬精英、宫殿账目与宫殿终结。' },
    { id: 'nav-collapse-dark-age', target: { cardId: 'greece-reconnects-after-palaces', sceneId: 'dark-age-orders-stop-tablets' }, basis: { kind: 'event', eventId: 'event-mycenaean-palaces-end' }, label: '进入宫殿之后的希腊', description: '从宫殿体系瓦解继续，看地方社区、铁器和海路怎样重新组织生活。' },
    { id: 'nav-mycenae-gods', target: { cardId: 'greek-gods-leave-palaces', sceneId: 'gods-names-enter-tablets' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-mycenaean-divine-names' }, label: '跟随神名走出宫殿', description: '从泥版上的献祭名单继续，看熟悉的神名怎样进入后来不断重述的神界。' },
    { id: 'nav-gods-mycenae', target: { cardId: 'mycenae-graves-palaces-tablets', sceneId: 'mycenae-gold-enters-graves' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-mycenaean-divine-names' }, label: '进入记录神名的宫殿', description: '从墓穴与线形文字B开始，查看书吏为何把献给神的物品写进泥版。' },
    { id: 'nav-mycenae-heroes', target: { cardId: 'greek-heroes-live-in-song', sceneId: 'heroes-ruins-hold-stronger-past' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-mycenaean-heroic-memory' }, label: '进入废墟之后的英雄时代', description: '从高墙、墓穴与战士器物继续，看歌者怎样重组一个失去的强大过去。' },
    { id: 'nav-heroes-mycenae', target: { cardId: 'mycenae-graves-palaces-tablets', sceneId: 'mycenae-gold-enters-graves' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-mycenaean-heroic-memory' }, label: '查看英雄故事背后的遗迹', description: '进入青铜时代的墓穴、宫殿与泥版，区分考古证据和后来的英雄歌唱。' },
    { id: 'nav-dark-age-heroes', target: { cardId: 'greek-heroes-live-in-song', sceneId: 'heroes-ruins-hold-stronger-past' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-dark-age-heroic-song' }, label: '听歌者重组英雄时代', description: '沿重新连接的海路进入宴会与歌唱，看英雄过去怎样在表演中成形。' },
    { id: 'nav-heroes-dark-age', target: { cardId: 'greece-reconnects-after-palaces', sceneId: 'dark-age-orders-stop-tablets' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-dark-age-heroic-song' }, label: '进入歌者生活的后宫殿世界', description: '从停止书写的泥版继续，看地方社区、技术和海路如何承载口头传讲。' },
    { id: 'nav-gods-heroes', target: { cardId: 'greek-heroes-live-in-song', sceneId: 'heroes-ruins-hold-stronger-past' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-gods-shape-heroic-fates' }, label: '进入众神注视的英雄时代', description: '从神的帮助与惩罚继续，看凡人英雄如何在力量、错误和死亡之间行动。' },
    { id: 'nav-heroes-gods', target: { cardId: 'greek-gods-leave-palaces', sceneId: 'gods-names-enter-tablets' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-gods-shape-heroic-fates' }, label: '认识左右英雄命运的众神', description: '从宫殿泥版上的神名开始，进入争执不断、也频繁干预人间的神界。' },
    { id: 'nav-troy-hittite', target: { cardId: 'hittite-syria-treaties', sceneId: 'hittite-kings-treaty' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-hittite-wilusa-treaty' }, label: '查看赫梯大王怎样约束地方国王', description: '维鲁萨条约并非孤例；转向保存更完整的条约体系，看赫梯大王怎样规定地方王位、忠诚与出兵义务。' },
    { id: 'nav-hittite-troy', target: { cardId: 'troy-layered-city', sceneId: 'troy-wilusa-enters-treaty' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-hittite-wilusa-treaty' }, label: '沿条约网络前往西方的维鲁萨', description: '从叙利亚地方王国的条约转向帝国西缘，查看同一种“大王—地方国王”关系怎样把维鲁萨写进赫梯政治世界。' },
    { id: 'nav-troy-iliad', target: { cardId: 'iliad-achilles-anger', sceneId: 'iliad-singer-starts-near-war-end' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-troy-iliad-memory' }, label: '进入《伊利亚特》的战争末期', description: '从考古遗址与长期记忆，转向阿喀琉斯一次愤怒造成的完整故事。' },
    { id: 'nav-iliad-troy', target: { cardId: 'troy-layered-city', sceneId: 'troy-walls-fall-city-rebuilds' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-troy-iliad-memory' }, label: '查看英雄姓名背后的层层城市', description: '从诗中的城墙和人物，进入特洛伊遗址的重建、毁坏与赫梯条约证据。' },
    { id: 'nav-heroes-iliad', target: { cardId: 'iliad-achilles-anger', sceneId: 'iliad-singer-starts-near-war-end' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-iliad-heroic-tradition' }, label: '跟随阿喀琉斯的愤怒', description: '从英雄聚集的广阔传统，进入《伊利亚特》真正讲述的一小段战争。' },
    { id: 'nav-iliad-heroes', target: { cardId: 'greek-heroes-live-in-song', sceneId: 'heroes-ruins-hold-stronger-past' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-iliad-heroic-tradition' }, label: '进入更广阔的英雄时代', description: '从阿喀琉斯与赫克托耳，继续认识远航、怪物和受诅咒家族组成的英雄传统。' },
    { id: 'nav-heroes-odyssey', target: { cardId: 'odyssey-name-and-home', sceneId: 'odyssey-return-songs-become-poem' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-odyssey-heroic-tradition' }, label: '跟随奥德修斯踏上归途', description: '从战争后的众多归乡故事，进入一位英雄失去船队与姓名后怎样回家。' },
    { id: 'nav-odyssey-heroes', target: { cardId: 'greek-heroes-live-in-song', sceneId: 'heroes-ruins-hold-stronger-past' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-odyssey-heroic-tradition' }, label: '进入远征之前的英雄世界', description: '从奥德修斯的归乡，继续认识英雄传统中的神裔、怪物、远航和战争。' },
    { id: 'nav-dark-age-odyssey', target: { cardId: 'odyssey-name-and-home', sceneId: 'odyssey-return-songs-become-poem' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-dark-age-odyssey-song' }, label: '进入歌者重讲的海上归途', description: '沿重新连接的海路，进入漂泊、待客、家庭和归乡组成的《奥德赛》。' },
    { id: 'nav-odyssey-dark-age', target: { cardId: 'greece-reconnects-after-palaces', sceneId: 'dark-age-orders-stop-tablets' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-dark-age-odyssey-song' }, label: '进入归乡歌形成的后宫殿世界', description: '从神话海路转向公元前1200—前800年的地方社区、技术延续与区域联系。' },
    { id: 'nav-gods-iliad', target: { cardId: 'iliad-achilles-anger', sceneId: 'iliad-singer-starts-near-war-end' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-gods-shape-heroic-fates' }, label: '看神意怎样卷入阿喀琉斯的愤怒', description: '从雅典娜制止拔剑开始，看阿波罗、宙斯与忒提斯如何改变战局。' },
    { id: 'nav-iliad-gods', target: { cardId: 'greek-gods-leave-palaces', sceneId: 'gods-names-enter-tablets' }, basis: { kind: 'structuralEdge', structuralEdgeId: 'edge-gods-shape-heroic-fates' }, label: '认识介入战争的希腊诸神', description: '从史诗里的帮助与惩罚，进入神名、祭祀和神界家庭的更长传统。' }
  ];

  const navigationPlacements = [
    { id: 'placement-crete-mycenae-inline', navigationOptionId: 'nav-crete-mycenae', owner: { kind: 'scene', sceneId: 'crete-tablets-change-language' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mycenae-crete-inline', navigationOptionId: 'nav-mycenae-crete', owner: { kind: 'scene', sceneId: 'mycenae-linear-b-writes-greek' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mycenae-dark-age-inline', navigationOptionId: 'nav-mycenae-dark-age', owner: { kind: 'scene', sceneId: 'mycenae-palaces-stop-commanding' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mycenae-late-bronze-collapse-inline', navigationOptionId: 'nav-mycenae-late-bronze-collapse', owner: { kind: 'scene', sceneId: 'mycenae-palaces-stop-commanding' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-dark-age-mycenae-inline', navigationOptionId: 'nav-dark-age-mycenae', owner: { kind: 'scene', sceneId: 'dark-age-orders-stop-tablets' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-dark-age-late-bronze-collapse-inline', navigationOptionId: 'nav-dark-age-late-bronze-collapse', owner: { kind: 'scene', sceneId: 'dark-age-orders-stop-tablets' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-collapse-mycenae-inline', navigationOptionId: 'nav-collapse-mycenae', owner: { kind: 'scene', sceneId: 'palaces-aegean-writing-stops' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-collapse-dark-age-inline', navigationOptionId: 'nav-collapse-dark-age', owner: { kind: 'scene', sceneId: 'palaces-aegean-writing-stops' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-mycenae-gods-inline', navigationOptionId: 'nav-mycenae-gods', owner: { kind: 'scene', sceneId: 'mycenae-palaces-write-needs' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-gods-mycenae-inline', navigationOptionId: 'nav-gods-mycenae', owner: { kind: 'scene', sceneId: 'gods-names-enter-tablets' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-mycenae-heroes-inline', navigationOptionId: 'nav-mycenae-heroes', owner: { kind: 'scene', sceneId: 'mycenae-hero-stories-travel' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-heroes-mycenae-inline', navigationOptionId: 'nav-heroes-mycenae', owner: { kind: 'scene', sceneId: 'heroes-ruins-hold-stronger-past' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-dark-age-heroes-inline', navigationOptionId: 'nav-dark-age-heroes', owner: { kind: 'scene', sceneId: 'dark-age-sea-routes-return' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-heroes-dark-age-inline', navigationOptionId: 'nav-heroes-dark-age', owner: { kind: 'scene', sceneId: 'heroes-singers-remake-lost-age' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-gods-heroes-inline', navigationOptionId: 'nav-gods-heroes', owner: { kind: 'scene', sceneId: 'gods-turn-to-heroes' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-heroes-gods-inline', navigationOptionId: 'nav-heroes-gods', owner: { kind: 'scene', sceneId: 'heroes-between-gods-and-mortals' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-troy-hittite-inline', navigationOptionId: 'nav-troy-hittite', owner: { kind: 'scene', sceneId: 'troy-wilusa-enters-treaty' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-hittite-troy-inline', navigationOptionId: 'nav-hittite-troy', owner: { kind: 'scene', sceneId: 'hittite-kings-treaty' }, slot: 'inline', rank: 3, visible: true, interactive: true },
    { id: 'placement-troy-iliad-inline', navigationOptionId: 'nav-troy-iliad', owner: { kind: 'scene', sceneId: 'troy-ruins-gain-heroic-names' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-iliad-troy-inline', navigationOptionId: 'nav-iliad-troy', owner: { kind: 'scene', sceneId: 'iliad-singer-starts-near-war-end' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-heroes-iliad-inline', navigationOptionId: 'nav-heroes-iliad', owner: { kind: 'scene', sceneId: 'heroes-gather-at-troy' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-iliad-heroes-inline', navigationOptionId: 'nav-iliad-heroes', owner: { kind: 'scene', sceneId: 'iliad-singer-starts-near-war-end' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-heroes-odyssey-inline', navigationOptionId: 'nav-heroes-odyssey', owner: { kind: 'scene', sceneId: 'heroes-homecomings-continue' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-odyssey-heroes-inline', navigationOptionId: 'nav-odyssey-heroes', owner: { kind: 'scene', sceneId: 'odyssey-return-songs-become-poem' }, slot: 'inline', rank: 1, visible: true, interactive: true },
    { id: 'placement-dark-age-odyssey-inline', navigationOptionId: 'nav-dark-age-odyssey', owner: { kind: 'scene', sceneId: 'dark-age-sea-routes-return' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-odyssey-dark-age-inline', navigationOptionId: 'nav-odyssey-dark-age', owner: { kind: 'scene', sceneId: 'odyssey-return-songs-become-poem' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-gods-iliad-inline', navigationOptionId: 'nav-gods-iliad', owner: { kind: 'scene', sceneId: 'gods-turn-to-heroes' }, slot: 'inline', rank: 2, visible: true, interactive: true },
    { id: 'placement-iliad-gods-inline', navigationOptionId: 'nav-iliad-gods', owner: { kind: 'scene', sceneId: 'iliad-two-captives-start-quarrel' }, slot: 'inline', rank: 1, visible: true, interactive: true }
  ];

  const assets = [
    { id: 'asset-aegean-knossos-central-court', type: 'image', src: 'assets/images/aegean/crete-knossos-central-court.jpg', title: '克诺索斯中央庭院全景', alt: '横向全景完整展现克诺索斯中央庭院、四周石砌台阶、墙基和部分重建柱廊，显示宫殿空间围绕开阔庭院组织。', sourceIds: ['source-wikimedia-knossos-central-court'] },
    { id: 'asset-aegean-linear-a-tablets', type: 'image', src: 'assets/images/aegean/crete-linear-a-tablets.jpg', title: '阿克罗蒂里出土的线形文字A泥版', alt: '两块浅褐色青铜时代泥版并排陈列，表面可见线形文字A符号；它们出土于圣托里尼的阿克罗蒂里，并非克里特宫殿本身。', sourceIds: ['source-wikimedia-linear-a-akrotiri'] },
    { id: 'asset-aegean-akrotiri-flotilla', type: 'image', src: 'assets/images/aegean/crete-akrotiri-flotilla.jpg', title: '阿克罗蒂里船队壁画', alt: '青铜时代壁画中，多艘长船在岛屿聚落之间航行；作品来自圣托里尼的阿克罗蒂里，作为同一爱琴海交流世界的视觉参照。', sourceIds: ['source-wikimedia-akrotiri-flotilla'] },
    { id: 'asset-aegean-knossos-linear-b', type: 'image', src: 'assets/images/aegean/crete-knossos-linear-b.jpg', title: '克诺索斯线形文字B泥版KN Fp 13', alt: '一块横长的克诺索斯泥版写有密集的线形文字B，记录向若干神祇提供的油；照片完整保留泥版外形。', sourceIds: ['source-wikimedia-knossos-linear-b'] },
    { id: 'asset-aegean-crete-postpalatial-krater', type: 'image', src: 'assets/images/aegean/crete-postpalatial-krater.jpg', title: '克里特后宫殿时期陶制混酒器', alt: '一件公元前1200至前1100年的克里特陶器，浅色器身上绘有持矛人物、野山羊与骑手，显示宫殿结束后的制作与图像传统。', sourceIds: ['source-wikimedia-mouliana-krater'] },
    { id: 'asset-aegean-mycenae-gold-mask', type: 'image', src: 'assets/images/aegean/mycenae-grave-circle-mask.jpg', title: '迈锡尼墓圈A金面具；传统称“阿伽门农面具”', alt: '一张从迈锡尼墓圈A出土的金制葬仪面具正面照片；“阿伽门农面具”是后起传统名称，不是对墓主身份的确认。', sourceIds: ['source-wikimedia-mycenae-gold-mask'] },
    { id: 'asset-aegean-mycenae-athena-tablet', type: 'image', src: 'assets/images/aegean/mycenae-athena-linear-b.jpg', title: '迈锡尼线形文字B泥版中的雅典娜神名', alt: '迈锡尼出土的浅褐色线形文字B泥版横置在深色背景中，铭文包含“雅典娜领受”，为宫殿献祭名单中的神名实例。', sourceIds: ['source-wikimedia-mycenae-athena-tablet'] },
    { id: 'asset-aegean-mycenae-warrior-krater', type: 'image', src: 'assets/images/aegean/mycenae-warrior-krater.jpg', title: '约公元前1200年的迈锡尼战士陶瓶', alt: '迈锡尼卫城出土的陶制混酒器上画着列队出征的持盾战士；它是晚期迈锡尼物质图像，并非《伊利亚特》情节插图。', sourceIds: ['source-wikimedia-mycenae-warrior-krater'] },
    { id: 'asset-aegean-protogeometric-amphora', type: 'image', src: 'assets/images/aegean/dark-age-protogeometric-amphora.jpg', title: '原几何风格陶制双耳罐', alt: '一件深浅相间的原几何风格陶罐，器肩以规整的同心圆和带状纹饰装饰，体现宫殿之后的制陶技术与地区风格。', sourceIds: ['source-wikimedia-protogeometric-amphora'] },
    { id: 'asset-aegean-naxos-geometric-pottery', type: 'image', src: 'assets/images/aegean/dark-age-naxos-geometric-pottery.jpg', title: '约公元前830—前800年的纳克索斯几何陶器', alt: '纳克索斯出土的几何风格陶器完整陈列，器身分带绘有重复几何纹样，提供公元前九世纪末爱琴海地方风格的实例。', sourceIds: ['source-wikimedia-naxos-geometric-pottery'] },
    { id: 'asset-aegean-gods-rhea-cronus', type: 'image', src: 'assets/images/aegean/gods-rhea-cronus.jpg', title: '瑞亚以襁褓中的石头欺骗克洛诺斯', alt: '1878年公共领域插画：瑞亚把包裹成婴儿的石头递给坐在王座上的克洛诺斯；这是后世对神话的想象，并非青铜时代图像。', sourceIds: ['source-wikimedia-rhea-cronus'] },
    { id: 'asset-aegean-gods-three-realms', type: 'image', src: 'assets/images/aegean/gods-three-realms.jpg', title: '宙斯、波塞冬与哈得斯分掌世界', alt: '十六世纪公共领域版画：三位持权杖的神祇并列在天空、海洋与地下世界的象征之间；画面属于后世欧洲艺术传统。', sourceIds: ['source-wikimedia-three-realms'] },
    { id: 'asset-aegean-gods-council-met', type: 'image', src: 'assets/images/aegean/gods-council-met.jpg', title: '雅各波·佐博利《众神会议》', alt: '大都会艺术博物馆藏公共领域素描以清晰线条横向排列云端众神；中央神祇彼此示意，两侧人物携带武器、权杖与动物等属性，呈现共享空间却各有立场的神界群体。', sourceIds: ['source-wikimedia-council-gods-met'] },
    { id: 'asset-aegean-gods-zeus-libation', type: 'image', src: 'assets/images/aegean/gods-zeus-libation.jpg', title: '古希腊陶器上的宙斯与伊里斯献酒场景', alt: '约公元前五世纪陶器画中，宙斯端坐并持盛酒器，伊里斯在旁参与仪式；照片完整显示器物图像区域。', sourceIds: ['source-wikimedia-zeus-iris-libation'] },
    { id: 'asset-aegean-gods-demeter-persephone', type: 'image', src: 'assets/images/aegean/gods-demeter-persephone.jpg', title: '约翰·迪克森·巴顿笔下的德墨忒尔与珀耳塞福涅', alt: '公共领域插画描绘母女在植物环绕的地面重逢；这是后世对季节神话的视觉诠释。', sourceIds: ['source-wikimedia-demeter-persephone-batten'] },
    { id: 'asset-aegean-gods-athena-achilles', type: 'image', src: 'assets/images/aegean/gods-athena-achilles.jpg', title: '雅典娜按住愤怒的阿喀琉斯', alt: '公共领域书籍插画：全副武装的雅典娜从后方制止正要拔剑的阿喀琉斯，表现神直接介入英雄选择的时刻。', sourceIds: ['source-wikimedia-athena-achilles-illustration'] },
    { id: 'asset-aegean-heroes-mycenae-lion-gate-clear', type: 'image', src: 'assets/images/aegean/heroes-mycenae-lion-gate-clear.jpg', title: '迈锡尼狮子门与巨石城墙', alt: '高清照片从进城道路完整呈现迈锡尼狮子门、三角浮雕和向山坡延伸的巨石城墙；道路与门洞提供尺度参照，突出青铜时代遗迹远超普通房屋的体量。', sourceIds: ['source-wikimedia-mycenae-lion-gate-clear'] },
    { id: 'asset-aegean-heroes-demodocus', type: 'image', src: 'assets/images/aegean/heroes-demodocus.png', title: '歌者德摩多科斯在奥德修斯面前演唱', alt: '约翰·弗拉克斯曼1810年公共领域线描：歌者持琴坐在听众之间，奥德修斯掩面聆听关于特洛伊的歌。', sourceIds: ['source-wikimedia-demodocus-flaxman'] },
    { id: 'asset-aegean-heroes-achilles-thetis', type: 'image', src: 'assets/images/aegean/heroes-achilles-thetis.jpg', title: '阿喀琉斯与海中女神忒提斯', alt: '弗里德里希·普雷勒之子创作的公共领域绘画：凡人英雄阿喀琉斯在海边面对神圣母亲忒提斯，强调他的双重出身。', sourceIds: ['source-wikimedia-achilles-thetis-preller'] },
    { id: 'asset-aegean-heroes-heracles-lion', type: 'image', src: 'assets/images/aegean/heroes-heracles-lion.jpg', title: '古希腊陶器上的赫拉克勒斯与涅墨亚狮子', alt: '约公元前520—前500年的陶器画中，赫拉克勒斯徒手扼住狮子，旁人和武器围绕搏斗场面。', sourceIds: ['source-wikimedia-heracles-lion-bm'] },
    { id: 'asset-aegean-heroes-argonauts-leaving-colchis', type: 'image', src: 'assets/images/aegean/heroes-argonauts-leaving-colchis.jpg', title: '埃尔科莱·德·罗贝尔蒂《阿尔戈英雄离开科尔基斯》', alt: '约1480年的公共领域绘画清楚描绘一艘扬帆大船，十余名披甲或着长袍的人物共同站在甲板和船舷内；这是文艺复兴时期对阿尔戈英雄集体远航的想象。', sourceIds: ['source-wikimedia-argonauts-roberti'] },
    { id: 'asset-aegean-heroes-oedipus-sphinx', type: 'image', src: 'assets/images/aegean/heroes-oedipus-sphinx.jpg', title: '居斯塔夫·莫罗《俄狄浦斯与斯芬克斯》', alt: '1864年公共领域绘画：斯芬克斯攀附在直立的俄狄浦斯身上，两者近距离对视；这是后世对英雄、怪物与命运的诠释。', sourceIds: ['source-wikimedia-oedipus-sphinx-moreau'] },
    { id: 'asset-aegean-heroes-achilles-hector', type: 'image', src: 'assets/images/aegean/heroes-achilles-hector.jpg', title: '阿喀琉斯击杀赫克托耳', alt: '十九世纪公共领域或CC0绘画表现阿喀琉斯与赫克托耳在特洛伊城外决斗；它是后世艺术想象，不是战争的同时代记录。', sourceIds: ['source-wikimedia-achilles-hector-groeninge'] },
    { id: 'asset-aegean-heroes-odysseus-return', type: 'image', src: 'assets/images/aegean/heroes-odysseus-return.jpg', title: '平图里基奥《奥德修斯归来》', alt: '1509年公共领域绘画把奥德修斯回到家园后的识别与重逢安排在开阔室内外空间中，呈现归乡故事的后世视觉传统。', sourceIds: ['source-wikimedia-odysseus-return-pinturicchio'] },
    { id: 'asset-aegean-troy-vi-walls', type: 'image', src: 'assets/images/aegean/troy-vi-walls.jpg', title: '特洛伊VI城墙遗迹', alt: '现代照片完整展示特洛伊遗址向外倾斜的厚重石墙、转角与沿墙通道，帮助辨认晚青铜时代设防城市仍留在土丘上的建筑层。', sourceIds: ['source-wikimedia-troy-vi-walls'] },
    { id: 'asset-aegean-troy-wilusa-treaty', type: 'image', src: 'assets/images/aegean/troy-wilusa-treaty.jpg', title: '穆瓦塔利二世与阿拉克桑杜条约泥版', alt: '特洛伊博物馆陈列的竖长褐色泥版复制品完整入镜，表面密布楔形文字；条约把维鲁萨国王阿拉克桑杜写进赫梯外交网络。', sourceIds: ['source-wikimedia-troy-wilusa-treaty'] },
    { id: 'asset-aegean-iliad-flaxman-title', type: 'image', src: 'assets/images/aegean/iliad-flaxman-title.jpg', title: '弗拉克斯曼《伊利亚特》版画集扉页', alt: '1795年开放许可版画扉页以古典线描和题名引出《伊利亚特》；这是十八世纪对史诗的视觉整理，并非青铜时代图像。', sourceIds: ['source-wikimedia-flaxman-iliad-title'] },
    { id: 'asset-aegean-iliad-thetis-zeus', type: 'image', src: 'assets/images/aegean/iliad-thetis-zeus.jpg', title: '忒提斯向宙斯请求帮助', alt: '弗拉克斯曼设计、皮罗利1795年镌刻的公共领域线描中，忒提斯跪在宙斯座前替阿喀琉斯请求让希腊人暂时失败；这是后世史诗插画。', sourceIds: ['source-wikimedia-flaxman-iliad-thetis-zeus'] },
    { id: 'asset-aegean-iliad-embassy-achilles', type: 'image', src: 'assets/images/aegean/iliad-embassy-achilles.jpg', title: '希腊使者劝说阿喀琉斯复战', alt: '弗拉克斯曼设计的1795年公共领域线描表现使者来到阿喀琉斯住处劝和，人物围坐交谈；这是后世对史诗情节的清晰分场。', sourceIds: ['source-wikimedia-flaxman-iliad-embassy'] },
    { id: 'asset-aegean-iliad-patroclus-body', type: 'image', src: 'assets/images/aegean/iliad-patroclus-body.jpg', title: '双方争夺帕特罗克洛斯遗体', alt: '弗拉克斯曼设计的1795年公共领域线描以横向战斗队列表现希腊人与特洛伊人争夺帕特罗克洛斯遗体；它是后世史诗插画。', sourceIds: ['source-wikimedia-flaxman-iliad-patroclus'] },
    { id: 'asset-aegean-iliad-new-armor', type: 'image', src: 'assets/images/aegean/iliad-new-armor.jpg', title: '忒提斯把新铠甲带给阿喀琉斯', alt: '弗拉克斯曼设计的1795年公共领域线描表现忒提斯与海中女神带来新盾和铠甲，悲痛的阿喀琉斯准备重新出战；这是后世史诗插画。', sourceIds: ['source-wikimedia-flaxman-iliad-armor'] },
    { id: 'asset-aegean-iliad-hector-body', type: 'image', src: 'assets/images/aegean/iliad-hector-body.jpg', title: '阿喀琉斯拖走赫克托耳遗体', alt: '弗拉克斯曼设计的1795年公共领域线描中，阿喀琉斯的战车拖着赫克托耳遗体绕过特洛伊城下；这是后世对复仇情节的表现。', sourceIds: ['source-wikimedia-flaxman-iliad-hector'] },
    { id: 'asset-aegean-iliad-priam-achilles', type: 'image', src: 'assets/images/aegean/iliad-priam-achilles.jpg', title: '普里阿摩斯走进阿喀琉斯营帐', alt: '弗拉克斯曼设计的1795年公共领域线描表现老王普里阿摩斯跪在阿喀琉斯面前赎回儿子遗体，侍从与赎金位于两侧；这是后世史诗插画。', sourceIds: ['source-wikimedia-flaxman-iliad-priam'] },
    { id: 'asset-aegean-troy-hector-funeral', type: 'image', src: 'assets/images/aegean/troy-hector-funeral.jpg', title: '特洛伊人为赫克托耳举行葬礼', alt: '弗拉克斯曼设计的1795年公共领域线描表现赫克托耳葬礼的人群与遗体；它属于后世《伊利亚特》视觉传统，不是遗址人物的同时代记录。', sourceIds: ['source-wikimedia-flaxman-iliad-funeral'] },
    { id: 'asset-aegean-odyssey-suitors', type: 'image', src: 'assets/images/aegean/odyssey-suitors.png', title: '求婚者发现珀涅罗珀的织布计策', alt: '弗拉克斯曼1810年公共领域线描表现珀涅罗珀坐在织机前，求婚者围在身旁发现她白天织布、夜里拆线的拖延办法；这是后世史诗插画。', sourceIds: ['source-wikimedia-flaxman-odyssey-suitors'] },
    { id: 'asset-aegean-odyssey-calypso-release', type: 'image', src: 'assets/images/aegean/odyssey-calypso-release.png', title: '赫尔墨斯命令卡吕普索放人', alt: '弗拉克斯曼1810年公共领域线描表现神使赫尔墨斯向卡吕普索传达释放奥德修斯的命令；这是后世对海岛囚居情节的插画。', sourceIds: ['source-wikimedia-flaxman-odyssey-hermes'] },
    { id: 'asset-aegean-odyssey-nausicaa', type: 'image', src: 'assets/images/aegean/odyssey-nausicaa.png', title: '瑙西卡与侍女遇见海难者', alt: '弗拉克斯曼1810年公共领域线描表现费埃克斯公主瑙西卡和侍女在河边活动，准备帮助陌生的海难者；这是后世史诗插画。', sourceIds: ['source-wikimedia-flaxman-odyssey-nausicaa'] },
    { id: 'asset-aegean-odyssey-polyphemus', type: 'image', src: 'assets/images/aegean/odyssey-polyphemus.png', title: '奥德修斯让独眼巨人喝酒', alt: '弗拉克斯曼1810年公共领域线描表现奥德修斯把酒递给独眼巨人波吕斐摩斯，同伴在洞穴一侧准备逃生；这是后世史诗插画。', sourceIds: ['source-wikimedia-flaxman-odyssey-polyphemus'] },
    { id: 'asset-aegean-odyssey-laestrygonians', type: 'image', src: 'assets/images/aegean/odyssey-laestrygonians.png', title: '食人巨人袭击奥德修斯船队', alt: '弗拉克斯曼1810年公共领域线描表现莱斯特律戈涅斯统治者安提法忒斯与巨人袭击来访船员，帮助理解船队为何只剩一艘；这是后世插画。', sourceIds: ['source-wikimedia-flaxman-odyssey-antiphates'] },
    { id: 'asset-aegean-odyssey-circe', type: 'image', src: 'assets/images/aegean/odyssey-circe.png', title: '奥德修斯请求喀耳刻恢复同伴', alt: '弗拉克斯曼1810年公共领域线描表现奥德修斯持剑面对女神喀耳刻，请她让被魔法变形的同伴恢复人身；这是后世史诗插画。', sourceIds: ['source-wikimedia-flaxman-odyssey-circe'] },
    { id: 'asset-aegean-odyssey-sirens', type: 'image', src: 'assets/images/aegean/odyssey-sirens.png', title: '被绑在桅杆上的奥德修斯聆听塞壬', alt: '弗拉克斯曼1810年公共领域线描中，奥德修斯被绑在桅杆，封住耳朵的船员继续划船，塞壬从岸边歌唱；这是后世史诗插画。', sourceIds: ['source-wikimedia-flaxman-odyssey-sirens'] },
    { id: 'asset-aegean-odyssey-argus', type: 'image', src: 'assets/images/aegean/odyssey-argus.jpg', title: '化装归来的奥德修斯与老狗阿尔戈斯', alt: '弗拉克斯曼公共领域线描表现化装成乞丐的奥德修斯在宫门外遇到垂老的猎犬阿尔戈斯；狗认出主人，旁人却仍不知道他的身份。', sourceIds: ['source-wikimedia-flaxman-odyssey-argus'] }
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
    cameraPresets: [],
    mapStates: [],
    geometries: [],
    mapAnnotations: [],
    assets
  };
}));
