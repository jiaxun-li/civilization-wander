const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const collections = [
  'sources', 'entities', 'events', 'structuralEdges', 'cards', 'scenes',
  'structureViews', 'navigationOptions', 'navigationPlacements',
  'cameraPresets', 'mapStates', 'geometries', 'mapAnnotations', 'assets'
];

test('isolated module gate rejects IDs that already belong to the active atlas', () => {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'civilization-wander-module-gate-'));
  const handoffFile = path.join(tempDirectory, 'handoff.json');
  fs.writeFileSync(handoffFile, JSON.stringify({
    assetDirectory: 'assets/images/mesopotamia',
    pendingExternalRefs: Object.fromEntries(collections.map(collection => [collection, []])),
    mediaDecisions: []
  }));
  const result = spawnSync(process.execPath, [
    'scripts/validate-content-module.js',
    'data/mesopotamia.js',
    handoffFile
  ], { cwd: root, encoding: 'utf8' });
  fs.rmSync(tempDirectory, { recursive: true, force: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /collides with active atlas/);
});
