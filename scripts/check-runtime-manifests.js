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
const atlasSource = read('src/data/atlas-data.ts');
const atlasModules = [...atlasSource.matchAll(/import\s+['"]\.\.\/\.\.\/(data\/[^'"]+\.js)['"]/g)]
  .map(match => match[1]);
const packageJson = JSON.parse(read('package.json'));
const syntaxFiles = [...packageJson.scripts['check:syntax'].matchAll(/node --check ([^ &]+)/g)]
  .map(match => match[1]);

const worldIndex = entryImports.indexOf('src/data/world-physical.ts');
const atlasIndex = entryImports.indexOf('src/data/atlas-data.ts');
const entryModules = entryImports.slice(worldIndex + 1, atlasIndex);
const errors = [];

if (!/<script\s+type="module"\s+src="\/src\/main\.ts"><\/script>/.test(html)) {
  errors.push('index.html does not load /src/main.ts as its module entrypoint');
}
if (worldIndex < 0) errors.push('src/main.ts does not import src/data/world-physical.ts');
if (atlasIndex < 0) errors.push('src/main.ts does not import src/data/atlas-data.ts');
if (JSON.stringify(entryModules) !== JSON.stringify(atlasModules)) {
  errors.push(`content module order differs:\nentrypoint=${entryModules.join(', ')}\naggregator=${atlasModules.join(', ')}`);
}
const syntaxModuleOrder = syntaxFiles.filter(file => atlasModules.includes(file));
if (JSON.stringify(syntaxModuleOrder) !== JSON.stringify(atlasModules)) {
  errors.push(`check:syntax module order differs:\nsyntax=${syntaxModuleOrder.join(', ')}\naggregator=${atlasModules.join(', ')}`);
}

if (errors.length) {
  errors.forEach(error => console.error(error));
  process.exitCode = 1;
} else {
  console.log(`Runtime manifests agree on ${atlasModules.length} content modules.`);
}
