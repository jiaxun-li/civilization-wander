const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const adapterPath = path.join(root, 'data/query-node-runtime.js');
const adapterSource = fs.readFileSync(adapterPath, 'utf8');

test('browser bundle shims cannot activate the Node filesystem adapter', () => {
  const browserGlobal = {};
  const bundlerModuleShim = {};

  assert.doesNotThrow(() => vm.runInNewContext(adapterSource, {
    globalThis: browserGlobal,
    module: bundlerModuleShim
  }));
  assert.equal(browserGlobal.ATLAS_V5_QUERY_NODE_RUNTIME, null);
  assert.deepEqual(bundlerModuleShim, {});
});

test('Node keeps filesystem-backed Asset validation enabled', () => {
  delete require.cache[require.resolve(adapterPath)];
  const runtime = require(adapterPath);

  assert.equal(typeof runtime.fs.existsSync, 'function');
  assert.equal(typeof runtime.path.resolve, 'function');
  assert.equal(runtime.projectRoot, root);
});
