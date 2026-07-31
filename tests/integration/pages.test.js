const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('all entrypoint resources are relative and exist for GitHub Pages/file://', () => {
  const resources = [
    ...html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g)
  ].map(match => match[1]).filter(value => !value.startsWith('#'));
  assert.ok(resources.length >= 10);
  for (const resource of resources) {
    assert.doesNotMatch(resource, /^(?:\/|[a-z]+:)/i);
    assert.equal(fs.existsSync(path.join(root, resource)), true, resource);
  }
  assert.equal(fs.existsSync(path.join(root, '.nojekyll')), true);
});

test('runtime modules require no bundler or network fetch', () => {
  const runtimeFiles = [
    'data/v3/atlas-data.js',
    'data/v3/queries.js',
    'ui/v3/cards.js',
    'ui/v3/card-reader.js',
    'assets/natural-earth/base.js',
    'map/v3/map-renderer.js',
    'app.js'
  ];
  const runtime = runtimeFiles.map(relative => fs.readFileSync(path.join(root, relative), 'utf8')).join('\n');
  const executableRuntime = runtimeFiles
    .filter(relative => relative !== 'data/v3/atlas-data.js')
    .map(relative => fs.readFileSync(path.join(root, relative), 'utf8'))
    .join('\n');
  assert.doesNotMatch(runtime, /\bimport\s+|\bexport\s+|\brequire\(['"][^.]|fetch\(|XMLHttpRequest/);
  assert.doesNotMatch(executableRuntime, /https?:\/\//);
});

test('first-load resource size is recorded and remains static-site appropriate', () => {
  const firstLoad = [
    'index.html',
    'styles.css',
    'styles/v3/cards.css',
    'styles/v3/map.css',
    'data/world-physical.js',
    'data/v3/atlas-data.js',
    'data/v3/queries.js',
    'ui/v3/cards.js',
    'ui/v3/card-reader.js',
    'assets/natural-earth/base.js',
    'map/v3/map-renderer.js',
    'app.js'
  ];
  const bytes = firstLoad.reduce((sum, relative) => sum + fs.statSync(path.join(root, relative)).size, 0);
  assert.ok(bytes < 2_000_000, `first-load static resources are ${bytes} bytes`);
});

test('package scripts cover all required verification layers without dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  for (const name of ['test', 'test:data', 'test:ui', 'test:map', 'test:integration', 'test:e2e', 'check:syntax', 'check:pages']) {
    assert.equal(typeof packageJson.scripts[name], 'string', name);
  }
  assert.equal(packageJson.dependencies, undefined);
  assert.equal(packageJson.devDependencies, undefined);
});
