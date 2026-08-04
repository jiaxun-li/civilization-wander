#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const collections = [
  'sources', 'entities', 'events', 'structuralEdges', 'cards', 'scenes',
  'structureViews', 'navigationOptions', 'navigationPlacements',
  'cameraPresets', 'mapStates', 'geometries', 'mapAnnotations', 'assets'
];
const referenceFields = new Map([
  ['sourceIds', 'sources'],
  ['participantEntityIds', 'entities'],
  ['primaryEntityId', 'entities'],
  ['relatedEntityIds', 'entities'],
  ['includeEntityIds', 'entities'],
  ['entityId', 'entities'],
  ['eventIds', 'events'],
  ['eventId', 'events'],
  ['structuralEdgeId', 'structuralEdges'],
  ['cardId', 'cards'],
  ['sceneIds', 'scenes'],
  ['sceneId', 'scenes'],
  ['structureViewIds', 'structureViews'],
  ['structureViewId', 'structureViews'],
  ['navigationOptionId', 'navigationOptions'],
  ['cameraPresetId', 'cameraPresets'],
  ['mapStateId', 'mapStates'],
  ['geometryId', 'geometries'],
  ['annotationId', 'mapAnnotations'],
  ['assetId', 'assets']
]);
const mediaDecisionKinds = new Set([
  'newHistoricalAsset', 'approvedReuse', 'map', 'aiGenerated', 'textOnly'
]);

function readJson(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}

function sha256(filename) {
  return crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
}

function addReference(refs, collection, id, location) {
  if (typeof id === 'string' && id) refs.push({ collection, id, location });
}

function collectReferences(value, refs, location = 'module', parentKey = '') {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectReferences(item, refs, `${location}[${index}]`, parentKey));
    return;
  }
  if (!value || typeof value !== 'object') return;

  if (['source', 'target', 'subject'].includes(parentKey) && typeof value.kind === 'string') {
    if (value.kind === 'entity') addReference(refs, 'entities', value.id, `${location}.id`);
    if (value.kind === 'event') addReference(refs, 'events', value.id, `${location}.id`);
  }

  for (const [key, nested] of Object.entries(value)) {
    const collection = referenceFields.get(key);
    if (collection) {
      const ids = Array.isArray(nested) ? nested : [nested];
      ids.forEach((id, index) => addReference(
        refs,
        collection,
        id,
        Array.isArray(nested) ? `${location}.${key}[${index}]` : `${location}.${key}`
      ));
    }
    collectReferences(nested, refs, `${location}.${key}`, key);
  }
}

function main() {
  const moduleArg = process.argv[2];
  const handoffArg = process.argv[3];
  if (!moduleArg || !handoffArg) {
    throw new Error('Usage: node scripts/validate-content-module.js data/<module>.js docs/content-packs/<module>.handoff.json');
  }

  const moduleFile = path.resolve(projectRoot, moduleArg);
  const handoffFile = path.resolve(projectRoot, handoffArg);
  const moduleData = require(moduleFile);
  const activeAtlas = require(path.resolve(projectRoot, 'data/atlas-data.js'));
  const handoff = readJson(handoffFile);
  const errors = [];

  const moduleKeys = Object.keys(moduleData).sort();
  const expectedKeys = [...collections].sort();
  if (JSON.stringify(moduleKeys) !== JSON.stringify(expectedKeys)) {
    errors.push(`module export must contain exactly: ${collections.join(', ')}`);
  }
  for (const collection of collections) {
    if (!Array.isArray(moduleData[collection])) errors.push(`${collection} must be an array`);
  }

  const localIds = Object.fromEntries(collections.map(collection => [collection, new Set()]));
  const allLocalIds = new Map();
  for (const collection of collections) {
    for (const [index, item] of (moduleData[collection] || []).entries()) {
      if (!item || typeof item.id !== 'string' || !item.id) {
        errors.push(`${collection}[${index}].id must be a non-empty string`);
        continue;
      }
      if (allLocalIds.has(item.id)) {
        errors.push(`${collection}[${index}].id duplicates ${allLocalIds.get(item.id)}: ${item.id}`);
      } else {
        allLocalIds.set(item.id, `${collection}[${index}]`);
      }
      localIds[collection].add(item.id);
    }
  }

  if (!handoff.pendingExternalRefs || typeof handoff.pendingExternalRefs !== 'object') {
    errors.push('handoff.pendingExternalRefs is required');
  }
  const pending = {};
  for (const collection of collections) {
    const values = handoff.pendingExternalRefs?.[collection];
    if (!Array.isArray(values)) {
      errors.push(`handoff.pendingExternalRefs.${collection} must be an array`);
      pending[collection] = new Set();
    } else {
      pending[collection] = new Set(values);
      if (pending[collection].size !== values.length) {
        errors.push(`handoff.pendingExternalRefs.${collection} contains duplicates`);
      }
    }
  }
  for (const key of Object.keys(handoff.pendingExternalRefs || {})) {
    if (!collections.includes(key)) errors.push(`handoff.pendingExternalRefs.${key} is not a referenceable collection`);
  }

  const activeIds = Object.fromEntries(collections.map(collection => [
    collection,
    new Set((activeAtlas[collection] || []).map(item => item.id))
  ]));
  const activeAllIds = new Map();
  for (const collection of collections) {
    for (const id of activeIds[collection]) activeAllIds.set(id, collection);
  }
  for (const [id, location] of allLocalIds) {
    if (activeAllIds.has(id)) {
      errors.push(`${location}.id collides with active atlas ${activeAllIds.get(id)} ID ${id}`);
    }
  }
  const refs = [];
  collectReferences(moduleData, refs);
  const usedPending = Object.fromEntries(collections.map(collection => [collection, new Set()]));
  const activeExternalRefs = Object.fromEntries(collections.map(collection => [collection, new Set()]));
  for (const ref of refs) {
    if (localIds[ref.collection].has(ref.id)) continue;
    if (activeIds[ref.collection].has(ref.id)) {
      activeExternalRefs[ref.collection].add(ref.id);
      continue;
    }
    if (pending[ref.collection].has(ref.id)) {
      usedPending[ref.collection].add(ref.id);
      continue;
    }
    errors.push(`${ref.location} references missing ${ref.collection} ID ${ref.id}`);
  }
  for (const collection of collections) {
    for (const id of pending[collection]) {
      if (!usedPending[collection].has(id)) {
        errors.push(`handoff.pendingExternalRefs.${collection} declares unused ID ${id}`);
      }
    }
  }

  const assetDirectory = handoff.assetDirectory;
  if (typeof assetDirectory !== 'string' || !assetDirectory) {
    errors.push('handoff.assetDirectory must be a non-empty project-relative path');
  }
  const assetManifestFile = assetDirectory
    ? path.resolve(projectRoot, assetDirectory, 'manifest.json')
    : null;
  let assetManifest = { assets: [] };
  if (!assetManifestFile || !fs.existsSync(assetManifestFile)) {
    errors.push('asset manifest is missing from <assetDirectory>/manifest.json');
  } else {
    assetManifest = readJson(assetManifestFile);
    if (assetManifest.manifestVersion !== 2) {
      errors.push('asset manifest must use manifestVersion 2');
    }
  }
  const metadataById = new Map((assetManifest.assets || []).map(entry => [entry.assetId, entry]));
  for (const asset of moduleData.assets || []) {
    if (!asset.src.startsWith(`${assetDirectory}/`)) {
      errors.push(`Asset ${asset.id} must stay inside ${assetDirectory}/`);
      continue;
    }
    const assetFile = path.resolve(projectRoot, asset.src);
    if (!fs.existsSync(assetFile)) {
      errors.push(`Asset ${asset.id} references missing file ${asset.src}`);
      continue;
    }
    if (!asset.src.toLowerCase().endsWith('.webp')) {
      errors.push(`Asset ${asset.id} must use a local WebP file`);
    }
    if (fs.statSync(assetFile).size >= 1_000_000) {
      errors.push(`Asset ${asset.id} must be smaller than 1,000,000 bytes`);
    }
    const metadata = metadataById.get(asset.id);
    if (!metadata) {
      errors.push(`Asset ${asset.id} is missing from ${assetDirectory}/manifest.json`);
      continue;
    }
    if (metadata.file !== asset.src) errors.push(`Asset ${asset.id} manifest file does not match src`);
    if (JSON.stringify(metadata.sourceIds) !== JSON.stringify(asset.sourceIds)) {
      errors.push(`Asset ${asset.id} manifest sourceIds do not match runtime data`);
    }
    if (!['historical', 'modernIllustration', 'aiGenerated'].includes(metadata.origin)) {
      errors.push(`Asset ${asset.id} manifest origin is not reviewed`);
    }
    for (const field of ['creator', 'license', 'sourceUrl']) {
      if (typeof metadata[field] !== 'string' || !metadata[field]) {
        errors.push(`Asset ${asset.id} manifest ${field} is required`);
      }
    }
    if (!Number.isInteger(metadata.originalWidth) || metadata.originalWidth <= 0 ||
        !Number.isInteger(metadata.originalHeight) || metadata.originalHeight <= 0) {
      errors.push(`Asset ${asset.id} manifest original dimensions are required`);
    }
    if (!Number.isInteger(metadata.encodedWidth) || metadata.encodedWidth <= 0 ||
        !Number.isInteger(metadata.encodedHeight) || metadata.encodedHeight <= 0) {
      errors.push(`Asset ${asset.id} manifest encoded dimensions are required`);
    }
    if (metadata.encodedWidth > 2560 || metadata.encodedHeight > 2560) {
      errors.push(`Asset ${asset.id} encoded dimensions must not exceed 2560 pixels`);
    }
    if (metadata.byteSize !== fs.statSync(assetFile).size) {
      errors.push(`Asset ${asset.id} manifest byteSize is stale`);
    }
    if (metadata.format !== 'webp') errors.push(`Asset ${asset.id} manifest format must be webp`);
    if (metadata.sha256 !== sha256(assetFile)) errors.push(`Asset ${asset.id} manifest sha256 is stale`);
    if (metadata.reviewStatus !== 'approved') errors.push(`Asset ${asset.id} manifest reviewStatus must be approved`);
  }
  for (const entry of assetManifest.assets || []) {
    if (!localIds.assets.has(entry.assetId)) errors.push(`asset manifest declares unused Asset ${entry.assetId}`);
  }

  const decisions = Array.isArray(handoff.mediaDecisions) ? handoff.mediaDecisions : [];
  const decisionByScene = new Map(decisions.map(decision => [decision.sceneId, decision]));
  if (decisionByScene.size !== decisions.length) errors.push('handoff.mediaDecisions contains duplicate sceneId values');
  for (const scene of moduleData.scenes || []) {
    const decision = decisionByScene.get(scene.id);
    if (!decision) {
      errors.push(`Scene ${scene.id} has no media decision record`);
      continue;
    }
    if (!mediaDecisionKinds.has(decision.decision)) {
      errors.push(`Scene ${scene.id} has unknown media decision ${decision.decision}`);
      continue;
    }
    if (typeof decision.rationale !== 'string' || !decision.rationale) {
      errors.push(`Scene ${scene.id} media decision requires a rationale`);
    }
    if (['newHistoricalAsset', 'approvedReuse'].includes(decision.decision)) {
      if (!Array.isArray(decision.candidatesReviewed) || decision.candidatesReviewed.length < 2) {
        errors.push(`Scene ${scene.id} must record at least two reviewed media candidates`);
      }
    }
    if (['aiGenerated', 'textOnly'].includes(decision.decision) && decision.userApproval !== 'approved') {
      errors.push(`Scene ${scene.id} ${decision.decision} decision requires explicit user approval`);
    }
  }
  for (const decision of decisions) {
    if (!localIds.scenes.has(decision.sceneId)) errors.push(`media decision references missing Scene ${decision.sceneId}`);
  }

  if (errors.length) {
    console.error(`Module gate failed with ${errors.length} error(s):`);
    errors.forEach(error => console.error(`- ${error}`));
    process.exitCode = 1;
    return;
  }

  const activeSummary = Object.fromEntries(collections
    .map(collection => [collection, [...activeExternalRefs[collection]].sort()])
    .filter(([, ids]) => ids.length));
  const pendingSummary = Object.fromEntries(collections
    .map(collection => [collection, [...usedPending[collection]].sort()])
    .filter(([, ids]) => ids.length));
  console.log(JSON.stringify({
    valid: true,
    module: path.relative(projectRoot, moduleFile).replaceAll('\\', '/'),
    activeExternalRefs: activeSummary,
    pendingExternalRefs: pendingSummary
  }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message || String(error));
  process.exitCode = 1;
}
