const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const adapterPath = path.join(root, 'data/query-node-runtime.js');
const browserAdapterPath = path.join(root, 'src/data/query-browser-runtime.ts');
const viteConfig = fs.readFileSync(path.join(root, 'vite.config.mts'), 'utf8');

test('Vite replaces the Node filesystem adapter with an empty browser module', () => {
  assert.match(viteConfig, /find: '\.\.\/\.\.\/data\/query-node-runtime\.js'/);
  assert.match(viteConfig, /replacement: resolve\(projectRoot, 'src\/data\/query-browser-runtime\.ts'\)/);
  assert.match(fs.readFileSync(browserAdapterPath, 'utf8'), /const queryBrowserRuntime = null;/);
});

test('Node keeps filesystem-backed Asset validation enabled', () => {
  delete require.cache[require.resolve(adapterPath)];
  const runtime = require(adapterPath);

  assert.equal(typeof runtime.fs.existsSync, 'function');
  assert.equal(typeof runtime.path.resolve, 'function');
  assert.equal(runtime.projectRoot, root);
});
