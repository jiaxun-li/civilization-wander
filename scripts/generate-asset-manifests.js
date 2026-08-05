#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { listActiveContentModules, loadContentModule } = require('./content-module-runtime.js');

const projectRoot = path.resolve(__dirname, '..');
const modules = listActiveContentModules(projectRoot);

function dimensions(filename) {
  const buffer = fs.readFileSync(filename);
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    let offset = 12;
    while (offset + 8 <= buffer.length) {
      const chunkType = buffer.subarray(offset, offset + 4).toString('ascii');
      const chunkSize = buffer.readUInt32LE(offset + 4);
      const dataOffset = offset + 8;
      if (dataOffset + chunkSize > buffer.length) break;
      if (chunkType === 'VP8X' && chunkSize >= 10) {
        return {
          width: 1 + buffer.readUIntLE(dataOffset + 4, 3),
          height: 1 + buffer.readUIntLE(dataOffset + 7, 3)
        };
      }
      if (chunkType === 'VP8L' && chunkSize >= 5 && buffer[dataOffset] === 0x2f) {
        const bits = buffer.readUInt32LE(dataOffset + 1);
        return {
          width: 1 + (bits & 0x3fff),
          height: 1 + ((bits >>> 14) & 0x3fff)
        };
      }
      if (chunkType === 'VP8 ' && chunkSize >= 10 &&
          buffer[dataOffset + 3] === 0x9d && buffer[dataOffset + 4] === 0x01 &&
          buffer[dataOffset + 5] === 0x2a) {
        return {
          width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff,
          height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff
        };
      }
      offset = dataOffset + chunkSize + (chunkSize % 2);
    }
  }
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

for (const { name: moduleName, filename } of modules) {
  const moduleData = loadContentModule(path.resolve(projectRoot, filename));
  const sourceById = new Map(moduleData.sources.map(source => [source.id, source]));
  const manifestFile = path.resolve(projectRoot, `assets/images/${moduleName}/manifest.json`);
  const previousManifest = fs.existsSync(manifestFile)
    ? JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
    : { assets: [] };
  const previousById = new Map(previousManifest.assets.map(entry => [entry.assetId, entry]));
  const entries = moduleData.assets.map(asset => {
    const filename = path.resolve(projectRoot, asset.src);
    const sources = asset.sourceIds.map(id => sourceById.get(id)).filter(Boolean);
    const sourceText = sources.map(source => [source.title, source.author, source.publisher].join(' ')).join(' ');
    const imageSize = dimensions(filename);
    const previous = previousById.get(asset.id) || {};
    return {
      assetId: asset.id,
      file: asset.src,
      origin: previous.origin || (/OpenAI image generation/i.test(sourceText) ? 'aiGenerated' : 'unclassified'),
      creator: previous.creator || sources.find(source => source.author)?.author || sources.find(source => source.publisher)?.publisher || 'needs review',
      license: previous.license || inferLicense(sources),
      sourceUrl: previous.sourceUrl || sources.find(source => source.url)?.url || 'needs review',
      sourceIds: asset.sourceIds,
      originalWidth: previous.originalWidth || imageSize.width,
      originalHeight: previous.originalHeight || imageSize.height,
      encodedWidth: imageSize.width,
      encodedHeight: imageSize.height,
      byteSize: fs.statSync(filename).size,
      format: path.extname(asset.src).slice(1).toLowerCase(),
      sha256: crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex'),
      reviewStatus: previous.reviewStatus || 'needsMetadataAudit'
    };
  });
  fs.writeFileSync(manifestFile, `${JSON.stringify({ manifestVersion: 2, module: moduleName, assets: entries }, null, 2)}\n`);
  console.log(`${moduleName}: ${entries.length} Asset records`);
}
