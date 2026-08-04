#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const modules = [
  'mesopotamia', 'ancient-egypt', 'ancient-india', 'ancient-china',
  'late-bronze-age', 'aegean', 'iron-age-near-east'
];

const aiGeneratedIds = new Set([
  'asset-western-zhou-investiture-teaching',
  'asset-vedic-recitation-teaching',
  'asset-iane-iron-bloomery',
  'asset-gilgamesh-uruk-kingship',
  'asset-gilgamesh-rivals-become-friends',
  'asset-gilgamesh-cedar-forest',
  'asset-gilgamesh-worlds-end',
  'asset-gilgamesh-immortality-lost',
  'asset-gilgamesh-bull-of-heaven',
  'asset-gilgamesh-enkidu-dies',
  'asset-gilgamesh-flood-survivor'
]);

const metReviewedIds = new Set([
  'asset-egypt-old-mitry-statue',
  'asset-egypt-new-hatshepsut',
  'asset-egypt-new-amarna-letter',
  'asset-egypt-new-akhenaten',
  'asset-egypt-pyramid-offering-bearers',
  'asset-egypt-false-door-neferiu',
  'asset-egypt-afterlife-wah-statuette',
  'asset-egypt-afterlife-heart-scarab',
  'asset-egypt-afterlife-ukhhotep-coffin',
  'asset-egypt-afterlife-nesiamun-book-dead',
  'asset-egypt-afterlife-hatnefer-osiris',
  'asset-egypt-afterlife-anubis-weighing-heart',
  'asset-egypt-afterlife-seti-shabti',
  'asset-egypt-art-anubis-facsimile',
  'asset-egypt-art-sahure',
  'asset-egypt-hieroglyph-coptic',
  'asset-indus-unicorn-seal',
  'asset-indus-carnelian-bead',
  'asset-iane-esarhaddon-prism',
  'asset-iane-babylon-lion',
  'asset-iane-nebuchadnezzar-cylinder',
  'asset-iane-croesus-gold-stater',
  'asset-sumer-uruk-proto-cuneiform-tablet',
  'asset-sumer-ushumgal-stele',
  'asset-sumer-balanced-account-dugga',
  'asset-cuneiform-stylus',
  'asset-cuneiform-sound',
  'asset-cuneiform-many-languages',
  'asset-akkadian-fragmentation'
]);

const exactReviews = new Map(Object.entries({
  'asset-egypt-new-strike-papyrus': {
    origin: 'historical',
    creator: 'Museo Egizio',
    license: 'CC0'
  },
  'asset-guoji-zibai-pan': {
    origin: 'historical',
    creator: 'Gary Todd',
    license: 'CC0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Western_Zhou_Bronze_Pan_(9830469116).jpg',
    originalWidth: 5184,
    originalHeight: 3456
  },
  'asset-yinxu-royal-tombs': {
    origin: 'historical',
    creator: 'xiquinhosilva',
    license: 'CC BY 2.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Yinxu_Royal_Tombs_(53565371094).jpg',
    originalWidth: 1024,
    originalHeight: 721
  },
  'asset-sxd-bronze-tree': {
    origin: 'historical',
    creator: 'Siyuwj',
    license: 'CC BY-SA 4.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:三星堆出土青铜神树,_2017-09-17.jpg',
    originalWidth: 4016,
    originalHeight: 6016
  },
  'asset-iane-kbo-1-14': {
    origin: 'historical',
    creator: 'H. H. Figulla and E. F. Weidner',
    license: 'Public domain'
  },
  'asset-iane-assyrian-trade-tablet': {
    origin: 'historical',
    creator: 'Los Angeles County Museum of Art',
    license: 'Public domain'
  },
  'asset-iane-phoenician-tribute-gate': {
    origin: 'historical',
    creator: 'Anonymous; Walters Art Museum',
    license: 'Public domain'
  },
  'asset-iane-assyrian-scribes': {
    origin: 'historical',
    creator: 'Unknown author',
    license: 'Public domain'
  },
  'asset-lba-hittite-hattusa-ruins': {
    origin: 'historical',
    creator: 'Rita1234',
    license: 'CC BY-SA 3.0'
  },
  'asset-lba-ugarit-administrative-tablet': {
    origin: 'historical',
    creator: 'Zunkir',
    license: 'CC BY-SA 4.0'
  },
  'asset-lba-kadesh-treaty-tablet': {
    origin: 'historical',
    creator: 'Giovanni Dall’Orto',
    license: 'Copyrighted free use with attribution'
  },
  'asset-lba-medinet-habu-temple': {
    origin: 'historical',
    creator: 'Walaa',
    license: 'Public domain'
  },
  'asset-akkadian-sargon-memory': {
    origin: 'historical',
    creator: 'Unknown author',
    license: 'Public domain'
  },
  'asset-hammurabi-code-stele': {
    origin: 'historical',
    creator: 'Rlunaro',
    license: 'Public domain'
  },
  'asset-hammurabi-code-equal-retaliation': {
    origin: 'historical',
    creator: 'Anonymous',
    license: 'Public domain'
  },
  'asset-hammurabi-code-status-penalties': {
    origin: 'historical',
    creator: 'Anonymous',
    license: 'Public domain'
  },
  'asset-hammurabi-code-property-welfare': {
    origin: 'historical',
    creator: 'Unknown author',
    license: 'No known restrictions on publication'
  },
  'asset-hammurabi-code-discovery': {
    origin: 'historical',
    creator: 'Unknown photographer; Musée du Louvre',
    license: 'Public domain'
  }
}));

const expectedPending = new Set();

let updated = 0;
for (const moduleName of modules) {
  const manifestFile = path.resolve(projectRoot, `assets/images/${moduleName}/manifest.json`);
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  for (const asset of manifest.assets) {
    let review;
    if (aiGeneratedIds.has(asset.assetId)) {
      review = {
        origin: 'aiGenerated',
        creator: 'OpenAI image generation, directed and reviewed for Civilization Wander',
        license: 'Project-generated AI output; no third-party image license'
      };
    } else if (metReviewedIds.has(asset.assetId)) {
      review = {
        origin: 'historical',
        creator: 'The Metropolitan Museum of Art',
        license: 'CC0'
      };
    } else {
      review = exactReviews.get(asset.assetId);
    }
    if (!review) continue;
    Object.assign(asset, review, { reviewStatus: 'approved' });
    updated += 1;
  }
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
}

const unresolved = [];
for (const moduleName of modules) {
  const manifestFile = path.resolve(projectRoot, `assets/images/${moduleName}/manifest.json`);
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  for (const asset of manifest.assets) {
    if (asset.license === 'needs review') unresolved.push(asset.assetId);
  }
}

if (updated !== 58) {
  throw new Error(`Expected to update 58 reviewed Asset records, updated ${updated}`);
}
if (unresolved.length !== expectedPending.size || unresolved.some(id => !expectedPending.has(id))) {
  throw new Error(`Unexpected unresolved Asset license set: ${unresolved.join(', ')}`);
}

console.log(`Updated ${updated} reviewed Asset records; ${unresolved.length} replacements remain pending approval.`);
