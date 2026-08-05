#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.resolve(root, relative), 'utf8');
const html = read('index.html');
const entrySource = read('src/main.ts');
const entryImports = [...entrySource.matchAll(/import\s+['"]([^'"]+)['"]/g)]
  .map(match => path.posix.normalize(path.posix.join('src', match[1])));
const appSource = read('src/app.ts');
const atlasSource = read('src/data/atlas-data.ts');
const runtimeSources = [
  'src/app.ts',
  'src/home/home-view.ts',
  'src/shell/site-header.ts',
  'src/shell/story-navigation.ts',
  'src/data/atlas-data.ts',
  'src/data/queries.ts',
  'src/data/query-browser-runtime.ts',
  'src/data/world-physical.ts',
  'src/reader/card-components.ts',
  'src/reader/card-reader.ts',
  'src/map/natural-earth-base.ts',
  'src/map/map-renderer.ts',
  'data/query-node-runtime.js'
].map(relative => [relative, read(relative)]);
const atlasModules = [...atlasSource.matchAll(/from\s+['"]\.\.\/\.\.\/(data\/[^'"]+\.ts)['"]/g)]
  .map(match => match[1]);

const expectedEntryImports = [
  'styles.css',
  'styles/v4/cards.css',
  'styles/v4/map.css',
  'src/app.ts'
];
const requiredAppImports = [
  './data/atlas-data.ts',
  './data/queries.ts',
  './reader/card-components.ts',
  './reader/card-reader.ts',
  './map/natural-earth-base.ts',
  './map/map-renderer.ts'
];
const errors = [];

if (!/<script\s+type="module"\s+src="\/src\/main\.ts"><\/script>/.test(html)) {
  errors.push('index.html does not load /src/main.ts as its module entrypoint');
}
if (JSON.stringify(entryImports) !== JSON.stringify(expectedEntryImports)) {
  errors.push(`src/main.ts imports must be: ${expectedEntryImports.join(', ')}`);
}
for (const runtimeImport of requiredAppImports) {
  if (!appSource.includes(`from '${runtimeImport}'`)) errors.push(`src/app.ts does not import ${runtimeImport}`);
}
for (const [relative, source] of runtimeSources) {
  if (/ATLAS_(?:V5|WORLD|NATURAL|BRAND)/.test(source)) {
    errors.push(`${relative} still depends on a legacy runtime global`);
  }
}
if (atlasModules.length === 0) errors.push('src/data/atlas-data.ts does not directly import any TypeScript content modules');

if (errors.length) {
  errors.forEach(error => console.error(error));
  process.exitCode = 1;
} else {
  console.log(`The app owns the typed runtime graph; the aggregator directly imports ${atlasModules.length} content modules.`);
}
