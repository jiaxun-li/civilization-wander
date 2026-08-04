#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const modules = [
  'mesopotamia', 'ancient-egypt', 'ancient-india', 'ancient-china',
  'late-bronze-age', 'aegean', 'iron-age-near-east'
];

function dimensions(filename) {
  const buffer = fs.readFileSync(filename);
  if (buffer.subarray(1, 4).toString('ascii') === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
      const length = buffer.readUInt16BE(offset + 2);
      if (length < 2) break;
      offset += 2 + length;
    }
  }
  throw new Error(`Unsupported or malformed image: ${filename}`);
}

function inferLicense(sources) {
  const text = sources.map(source => source.title || '').join(' ');
  const match = text.match(/\b(CC0|CC BY(?:-SA|-NC|-ND)?(?: \d\.\d)?|Public Domain)\b/i);
  return match ? match[1] : 'needs review';
}

for (const moduleName of modules) {
  const moduleData = require(path.resolve(projectRoot, `data/${moduleName}.js`));
  const sourceById = new Map(moduleData.sources.map(source => [source.id, source]));
  const entries = moduleData.assets.map(asset => {
    const filename = path.resolve(projectRoot, asset.src);
    const sources = asset.sourceIds.map(id => sourceById.get(id)).filter(Boolean);
    const sourceText = sources.map(source => [source.title, source.author, source.publisher].join(' ')).join(' ');
    const imageSize = dimensions(filename);
    return {
      assetId: asset.id,
      file: asset.src,
      origin: /OpenAI image generation/i.test(sourceText) ? 'aiGenerated' : 'unclassified',
      creator: sources.find(source => source.author)?.author || sources.find(source => source.publisher)?.publisher || 'needs review',
      license: inferLicense(sources),
      sourceUrl: sources.find(source => source.url)?.url || 'needs review',
      sourceIds: asset.sourceIds,
      originalWidth: imageSize.width,
      originalHeight: imageSize.height,
      sha256: crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex'),
      reviewStatus: 'needsMetadataAudit'
    };
  });
  const manifestFile = path.resolve(projectRoot, `assets/images/${moduleName}/manifest.json`);
  fs.writeFileSync(manifestFile, `${JSON.stringify({ manifestVersion: 1, module: moduleName, assets: entries }, null, 2)}\n`);
  console.log(`${moduleName}: ${entries.length} Asset records`);
}
