#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.resolve(root, relative), 'utf8');
const htmlScripts = [...read('index.html').matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
const atlasSource = read('data/atlas-data.js');
const atlasModules = [...atlasSource.matchAll(/require\('\.\/([^']+\.js)'\)/g)]
  .map(match => `data/${match[1]}`);
const packageJson = JSON.parse(read('package.json'));
const syntaxFiles = [...packageJson.scripts['check:syntax'].matchAll(/node --check ([^ &]+)/g)]
  .map(match => match[1]);

const atlasIndex = htmlScripts.indexOf('data/atlas-data.js');
const entryModules = htmlScripts.slice(1, atlasIndex);
const errors = [];

if (atlasIndex < 0) errors.push('index.html does not load data/atlas-data.js');
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
