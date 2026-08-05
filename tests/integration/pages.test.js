const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('index.html');
const entry = read('src/main.ts');
const viteConfig = read('vite.config.mts');
const entryImports = [...entry.matchAll(/import\s+['"]([^'"]+)['"]/g)]
  .map(match => path.posix.normalize(path.posix.join('src', match[1])));

test('index.html has one Vite module entrypoint', () => {
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g)]
    .map(match => match[1]);
  assert.deepEqual(scripts, ['/src/main.ts']);
  assert.match(html, /<script type="module" src="\/src\/main\.ts"><\/script>/);
  assert.equal(fs.existsSync(path.join(root, 'src/main.ts')), true);
});

test('all Vite entrypoint imports are local build inputs', () => {
  assert.ok(entryImports.length >= 10);
  for (const relative of entryImports) {
    assert.doesNotMatch(relative, /^(?:\/|[a-z]+:)/i);
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  }
});

test('remaining legacy runtime stays local while Vite owns all module loading', () => {
  const runtimeFiles = entryImports.filter(relative => relative.endsWith('.js'));
  const runtime = runtimeFiles.map(read).join('\n');
  const executableRuntimeFiles = entryImports
    .filter(relative => !relative.startsWith('data/'));
  const executableRuntime = executableRuntimeFiles.map(read).join('\n');
  assert.doesNotMatch(runtime, /\bimport\s+|\bexport\s+|\brequire\(['"][^.]|fetch\(|XMLHttpRequest/);
  assert.doesNotMatch(
    executableRuntime,
    /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\s*\(|\bEventSource\s*\(|navigator\.sendBeacon\s*\(/
  );
});

test('Vite build targets the GitHub Pages project path and preserves runtime assets', () => {
  assert.match(viteConfig, /base:\s*['"]\/civilization-wander\/['"]/);
  assert.match(viteConfig, /cp\(resolve\(projectRoot, 'assets'\)/);
  assert.match(viteConfig, /copyFile\(resolve\(projectRoot, '\.nojekyll'\)/);
  assert.equal(fs.existsSync(path.join(root, '.nojekyll')), true);
});

test('package scripts cover development, build, preview, and verification', () => {
  const packageJson = JSON.parse(read('package.json'));
  for (const name of [
    'dev',
    'build',
    'preview',
    'typecheck',
    'test',
    'test:data',
    'test:ui',
    'test:map',
    'test:integration',
    'test:e2e',
    'check:syntax',
    'check:pages',
    'report:counts'
  ]) {
    assert.equal(typeof packageJson.scripts[name], 'string', name);
  }
  assert.equal(packageJson.dependencies, undefined);
  assert.equal(typeof packageJson.devDependencies.vite, 'string');
  assert.equal(typeof packageJson.devDependencies.typescript, 'string');
  assert.equal(typeof packageJson.devDependencies['@types/node'], 'string');
  assert.equal(packageJson.engines.node, '>=22.18');
});
