'use strict';

const fs = require('node:fs');
const path = require('node:path');

const CONTENT_MODULE_COLLECTIONS = Object.freeze([
  'sources', 'entities', 'events', 'structuralEdges', 'cards', 'scenes',
  'structureViews', 'navigationOptions', 'navigationPlacements',
  'cameraPresets', 'mapStates', 'geometries', 'mapAnnotations', 'assets'
]);

function hasExactModuleCollections(value) {
  return value && typeof value === 'object' && !Array.isArray(value) &&
    Object.keys(value).length === CONTENT_MODULE_COLLECTIONS.length &&
    CONTENT_MODULE_COLLECTIONS.every(collection => Array.isArray(value[collection]));
}

function loadContentModule(filename) {
  const loaded = require(filename);
  if (hasExactModuleCollections(loaded)) return loaded;
  const candidates = Object.values(loaded || {}).filter(hasExactModuleCollections);
  if (candidates.length === 1) return candidates[0];
  return loaded;
}

function listActiveContentModules(projectRoot) {
  const aggregatorSource = fs.readFileSync(path.resolve(projectRoot, 'src/data/atlas-data.ts'), 'utf8');
  return [...aggregatorSource.matchAll(/from\s+['"]\.\.\/\.\.\/(data\/[^'"]+\.ts)['"]/g)]
    .map(match => match[1])
    .map(filename => ({
      name: path.posix.basename(filename, path.posix.extname(filename)),
      filename
    }));
}

module.exports = {
  CONTENT_MODULE_COLLECTIONS,
  hasExactModuleCollections,
  loadContentModule,
  listActiveContentModules
};
