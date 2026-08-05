const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const { queriesModule: queries } = require('../../src/data/queries.ts');
const validFixtureFile = path.resolve(root, 'tests/fixtures/module-gate-valid.js');
const validFixture = require(validFixtureFile);
const collections = [
  'sources', 'entities', 'events', 'structuralEdges', 'cards', 'scenes',
  'structureViews', 'navigationOptions', 'navigationPlacements',
  'cameraPresets', 'mapStates', 'geometries', 'mapAnnotations', 'assets'
];

function inventory(moduleData) {
  return Object.fromEntries(collections.map(collection => [
    collection,
    moduleData[collection].map(item => item.id)
  ]));
}

function emptyInventory() {
  return Object.fromEntries(collections.map(collection => [collection, []]));
}

function mediaDecisions(moduleData) {
  return moduleData.scenes.map(scene => ({
    sceneId: scene.id,
    decision: 'textOnly',
    rationale: 'The fixture explicitly approves text-only presentation for gate testing.',
    userApproval: 'approved'
  }));
}

function handoffFor(moduleFile, moduleData, overrides = {}) {
  const relativeModuleFile = path.relative(root, moduleFile).replaceAll('\\', '/');
  return {
    handoffVersion: 2,
    module: path.basename(moduleFile, path.extname(moduleFile)),
    moduleFile: relativeModuleFile,
    exportedGlobal: 'ATLAS_V5_MODULE_GATE_FIXTURE',
    expectedLoadingPosition: 'after data/ancient-egypt.js',
    assetDirectory: 'tests/fixtures/module-gate-assets',
    newTopLevelIds: inventory(moduleData),
    reusedExternalIds: emptyInventory(),
    pendingExternalRefs: emptyInventory(),
    proposedOutboundNavigation: [],
    requiredReciprocalNavigation: [],
    mediaDecisions: mediaDecisions(moduleData),
    moduleChecks: {
      syntax: 'passed',
      moduleExport: 'passed',
      duplicateIds: 'passed',
      provenance: 'passed',
      internalReferences: 'passed',
      negativeTests: 'passed'
    },
    unresolvedIntegrationQuestions: [],
    contentAgentFrozen: true,
    ...overrides
  };
}

function runGate(moduleFile, handoff) {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'civilization-wander-module-gate-'));
  const handoffFile = path.join(tempDirectory, 'handoff.json');
  fs.writeFileSync(handoffFile, JSON.stringify(handoff));
  const result = spawnSync(process.execPath, [
    'scripts/validate-content-module.js',
    moduleFile,
    handoffFile
  ], { cwd: root, encoding: 'utf8' });
  fs.rmSync(tempDirectory, { recursive: true, force: true });
  return result;
}

function withTemporaryModule(transform, callback) {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'civilization-wander-module-fixture-'));
  const moduleFile = path.join(tempDirectory, 'staging-fixture.js');
  const source = fs.readFileSync(validFixtureFile, 'utf8');
  fs.writeFileSync(moduleFile, transform(source));
  delete require.cache[moduleFile];
  const moduleData = require(moduleFile);
  try {
    callback(moduleFile, moduleData);
  } finally {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
}

test('the documented staging fixture is a complete valid V5 atlas', () => {
  const result = queries.validateAtlasData({ schemaVersion: 5, ...validFixture });
  assert.equal(result.valid, true, result.errors.join('\n'));
});

test('isolated module gate accepts a complete frozen staging module and handoff', () => {
  const result = runGate(validFixtureFile, handoffFor(validFixtureFile, validFixture));
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.valid, true);
  assert.deepEqual(report.activeExternalRefs, {});
  assert.deepEqual(report.pendingExternalRefs, {});
});

test('isolated module gate accepts a TypeScript module namespace export', () => {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'civilization-wander-module-ts-'));
  const moduleFile = path.join(tempDirectory, 'staging-fixture.ts');
  const fixtureUrl = JSON.stringify(pathToFileURL(validFixtureFile).href);
  fs.writeFileSync(moduleFile, `
import fixture from ${fixtureUrl};
export const fixtureData = fixture;
const root = globalThis as typeof globalThis & {
  ATLAS_V5_MODULE_GATE_FIXTURE?: typeof fixture;
};
root.ATLAS_V5_MODULE_GATE_FIXTURE = fixtureData;
`);
  try {
    const result = runGate(moduleFile, handoffFor(moduleFile, validFixture));
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).valid, true);
  } finally {
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  }
});

test('isolated module gate rejects IDs that already belong to the active atlas', () => {
  const moduleFile = path.resolve(root, 'data/mesopotamia.js');
  const moduleData = require(moduleFile);
  const handoff = handoffFor(moduleFile, moduleData, {
    module: 'mesopotamia',
    moduleFile: 'data/mesopotamia.js',
    exportedGlobal: 'ATLAS_V5_MESOPOTAMIA',
    assetDirectory: 'assets/images/mesopotamia'
  });
  const result = runGate(moduleFile, handoff);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collides with active atlas/);
});

test('isolated module gate rejects a handoff whose declared IDs drift from the module', () => {
  const newTopLevelIds = inventory(validFixture);
  newTopLevelIds.cards = newTopLevelIds.cards.slice(1);
  const result = runGate(validFixtureFile, handoffFor(validFixtureFile, validFixture, {
    newTopLevelIds
  }));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /newTopLevelIds\.cards does not match module exports/);
});

test('isolated module gate rejects unknown V5 fields before integration', () => {
  withTemporaryModule(
    source => source.replace("kind: 'historicalStory',", "kind: 'historicalStory', legacyEventIds: [],"),
    (moduleFile, moduleData) => {
      const result = runGate(moduleFile, handoffFor(moduleFile, moduleData));
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /legacyEventIds is an unknown V5 field/);
    }
  );
});

test('isolated module gate rejects undeclared sibling references', () => {
  withTemporaryModule(
    source => source.replace(
      "eventIds: [`fixture-event-${letter}`],",
      "eventIds: ['fixture-missing-event'],"
    ),
    (moduleFile, moduleData) => {
      const result = runGate(moduleFile, handoffFor(moduleFile, moduleData));
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /references missing events ID fixture-missing-event/);
    }
  );
});

test('isolated module gate rejects unused pending declarations', () => {
  const pendingExternalRefs = emptyInventory();
  pendingExternalRefs.events = ['fixture-future-event'];
  const result = runGate(validFixtureFile, handoffFor(validFixtureFile, validFixture, {
    pendingExternalRefs
  }));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /declares unused ID fixture-future-event/);
});

test('isolated module gate requires explicit approval for every text-only Scene', () => {
  const decisions = mediaDecisions(validFixture);
  delete decisions[0].userApproval;
  const result = runGate(validFixtureFile, handoffFor(validFixtureFile, validFixture, {
    mediaDecisions: decisions
  }));
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /textOnly decision requires explicit user approval/);
});
