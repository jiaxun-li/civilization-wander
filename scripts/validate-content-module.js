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
const moduleObjectRules = {
  sources: {
    allowed: ['id', 'title', 'author', 'year', 'publisher', 'url'],
    required: ['id', 'title']
  },
  entities: {
    allowed: ['id', 'type', 'level', 'name', 'alternativeNames', 'canonicalSummary', 'timeSpan', 'tags', 'sourceIds'],
    required: ['id', 'type', 'name', 'canonicalSummary', 'sourceIds']
  },
  events: {
    allowed: ['id', 'kind', 'title', 'timeSpan', 'participantEntityIds', 'evidenceBlocks', 'sourceIds', 'editorialReview'],
    required: ['id', 'kind', 'title', 'timeSpan', 'participantEntityIds', 'evidenceBlocks', 'sourceIds', 'editorialReview']
  },
  structuralEdges: {
    allowed: ['id', 'family', 'type', 'source', 'target', 'timeSpan', 'label', 'summaries', 'qualifiers', 'sourceIds'],
    required: ['id', 'family', 'type', 'source', 'target', 'label', 'summaries', 'sourceIds']
  },
  cards: {
    allowed: ['id', 'kind', 'primaryEntityId', 'relatedEntityIds', 'title', 'editorialPurpose', 'introduction', 'thesis', 'timeSpan', 'sceneIds', 'sourceIds', 'editorialReview'],
    required: ['id', 'kind', 'primaryEntityId', 'relatedEntityIds', 'title', 'editorialPurpose', 'introduction', 'thesis', 'timeSpan', 'sceneIds', 'sourceIds', 'editorialReview']
  },
  scenes: {
    allowed: ['id', 'title', 'eyebrow', 'timeDisplay', 'timeSpan', 'eventIds', 'contentBlocks', 'presentation', 'sourceIds'],
    required: ['id', 'title', 'timeSpan', 'eventIds', 'contentBlocks', 'presentation', 'sourceIds']
  },
  structureViews: {
    allowed: ['id', 'family', 'title', 'query', 'maxVisible', 'includeEntityIds', 'display', 'depth'],
    required: ['id', 'family', 'title', 'query', 'maxVisible', 'display']
  },
  navigationOptions: {
    allowed: ['id', 'target', 'entry', 'basis', 'label', 'description'],
    required: ['id', 'target', 'basis', 'label', 'description']
  },
  navigationPlacements: {
    allowed: ['id', 'navigationOptionId', 'owner', 'slot', 'rank', 'visible', 'interactive'],
    required: ['id', 'navigationOptionId', 'owner', 'slot', 'rank', 'visible', 'interactive']
  },
  cameraPresets: {
    allowed: ['id', 'center', 'scale'],
    required: ['id', 'center', 'scale']
  },
  mapStates: {
    allowed: ['id', 'cameraPresetId', 'layers'],
    required: ['id', 'cameraPresetId', 'layers']
  },
  geometries: {
    allowed: ['id', 'geometry', 'timeSpan', 'approximate', 'label', 'sourceIds'],
    required: ['id', 'geometry', 'timeSpan', 'approximate', 'label', 'sourceIds']
  },
  mapAnnotations: {
    allowed: ['id', 'subject', 'anchor', 'anchorMeaning', 'approximate', 'sourceIds', 'placement', 'label'],
    required: ['id', 'subject', 'anchor', 'anchorMeaning', 'approximate', 'sourceIds', 'placement']
  },
  assets: {
    allowed: ['id', 'type', 'src', 'title', 'alt', 'sourceIds'],
    required: ['id', 'type', 'src', 'title', 'alt', 'sourceIds']
  }
};
const handoffCheckNames = [
  'syntax', 'moduleExport', 'duplicateIds', 'provenance',
  'internalReferences', 'negativeTests'
];

function readJson(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}

function sha256(filename) {
  return crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
}

function projectPath(filename) {
  return path.relative(projectRoot, filename).replaceAll('\\', '/');
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function sameSortedStrings(left, right) {
  return JSON.stringify([...(left || [])].sort()) === JSON.stringify([...(right || [])].sort());
}

function checkStringArrayMap(value, field, errors) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`${field} must be an object containing all fourteen collections`);
    return Object.fromEntries(collections.map(collection => [collection, []]));
  }
  const result = {};
  for (const collection of collections) {
    const ids = value[collection];
    if (!Array.isArray(ids) || ids.some(id => !isNonEmptyString(id))) {
      errors.push(`${field}.${collection} must be an array of non-empty IDs`);
      result[collection] = [];
    } else {
      result[collection] = ids;
      if (new Set(ids).size !== ids.length) errors.push(`${field}.${collection} contains duplicates`);
    }
  }
  for (const key of Object.keys(value)) {
    if (!collections.includes(key)) errors.push(`${field}.${key} is not a referenceable collection`);
  }
  return result;
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
  const normalizedModuleArg = projectPath(moduleFile);
  const expectedModuleName = path.basename(moduleFile, '.js');
  const moduleSource = fs.readFileSync(moduleFile, 'utf8');

  if (handoff.handoffVersion !== 2) errors.push('handoff.handoffVersion must be 2');
  if (handoff.module !== expectedModuleName) errors.push(`handoff.module must be ${expectedModuleName}`);
  if (!isNonEmptyString(handoff.moduleFile) || handoff.moduleFile.replaceAll('\\', '/') !== normalizedModuleArg) {
    errors.push(`handoff.moduleFile must be ${normalizedModuleArg}`);
  }
  if (!isNonEmptyString(handoff.exportedGlobal)) {
    errors.push('handoff.exportedGlobal must be a non-empty string');
  } else if (!moduleSource.includes(`root.${handoff.exportedGlobal} = data`)) {
    errors.push(`module does not initialize browser global ${handoff.exportedGlobal}`);
  }
  if (!isNonEmptyString(handoff.expectedLoadingPosition)) {
    errors.push('handoff.expectedLoadingPosition must be a non-empty string');
  }
  if (!Array.isArray(handoff.proposedOutboundNavigation)) {
    errors.push('handoff.proposedOutboundNavigation must be an array');
  }
  if (!Array.isArray(handoff.requiredReciprocalNavigation)) {
    errors.push('handoff.requiredReciprocalNavigation must be an array');
  }
  if (!Array.isArray(handoff.unresolvedIntegrationQuestions)) {
    errors.push('handoff.unresolvedIntegrationQuestions must be an array');
  }
  if (handoff.contentAgentFrozen !== true) {
    errors.push('handoff.contentAgentFrozen must be true before integration handoff');
  }
  if (!handoff.moduleChecks || typeof handoff.moduleChecks !== 'object' || Array.isArray(handoff.moduleChecks)) {
    errors.push('handoff.moduleChecks must record the isolated check results');
  } else {
    for (const checkName of handoffCheckNames) {
      if (handoff.moduleChecks[checkName] !== 'passed') {
        errors.push(`handoff.moduleChecks.${checkName} must be passed`);
      }
    }
    for (const key of Object.keys(handoff.moduleChecks)) {
      if (!handoffCheckNames.includes(key)) errors.push(`handoff.moduleChecks.${key} is unknown`);
    }
  }

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
      const rule = moduleObjectRules[collection];
      for (const key of Object.keys(item)) {
        if (!rule.allowed.includes(key)) errors.push(`${collection}[${index}].${key} is an unknown V5 field`);
      }
      for (const key of rule.required) {
        if (!Object.prototype.hasOwnProperty.call(item, key)) errors.push(`${collection}[${index}].${key} is required by V5`);
      }
    }
  }

  if ((moduleData.cards || []).length === 0 || (moduleData.scenes || []).length === 0) {
    errors.push('a staged content module must contain at least one Card and one Scene');
  }

  const declaredNewIds = checkStringArrayMap(handoff.newTopLevelIds, 'handoff.newTopLevelIds', errors);
  for (const collection of collections) {
    if (!sameSortedStrings(declaredNewIds[collection], [...localIds[collection]])) {
      errors.push(`handoff.newTopLevelIds.${collection} does not match module exports`);
    }
  }

  const pendingValues = checkStringArrayMap(handoff.pendingExternalRefs, 'handoff.pendingExternalRefs', errors);
  const declaredReused = checkStringArrayMap(handoff.reusedExternalIds, 'handoff.reusedExternalIds', errors);
  const pending = {};
  for (const collection of collections) {
    pending[collection] = new Set(pendingValues[collection]);
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
    if (!sameSortedStrings(declaredReused[collection], [...activeExternalRefs[collection]])) {
      errors.push(`handoff.reusedExternalIds.${collection} does not match active-atlas references`);
    }
  }

  const assetDirectory = handoff.assetDirectory;
  if (typeof assetDirectory !== 'string' || !assetDirectory) {
    errors.push('handoff.assetDirectory must be a non-empty project-relative path');
  } else if (path.isAbsolute(assetDirectory) || assetDirectory.split(/[\\/]/).includes('..')) {
    errors.push('handoff.assetDirectory must stay inside the project');
  } else if (normalizedModuleArg.startsWith('data/') && assetDirectory !== `assets/images/${expectedModuleName}`) {
    errors.push(`handoff.assetDirectory must be assets/images/${expectedModuleName}`);
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
    if (fs.statSync(assetFile).size >= 500_000) {
      errors.push(`Asset ${asset.id} must be smaller than 500,000 bytes`);
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
    module: normalizedModuleArg,
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
