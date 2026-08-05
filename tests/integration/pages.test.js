const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('index.html');
const entry = read('src/main.ts');
const viteConfig = read('vite.config.mts');
const playwrightConfig = read('playwright.config.ts');
const deployWorkflow = read('.github/workflows/deploy-pages.yml');
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
  assert.deepEqual(entryImports, [
    'styles.css',
    'styles/v4/cards.css',
    'styles/v4/map.css',
    'src/app.ts'
  ]);
  for (const relative of entryImports) {
    assert.doesNotMatch(relative, /^(?:\/|[a-z]+:)/i);
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  }
});

test('the app owns a local typed module graph without remote runtime loading', () => {
  const executableRuntime = read('src/app.ts');
  assert.match(executableRuntime, /import \{ atlasData \} from '\.\/data\/atlas-data\.ts'/);
  assert.match(executableRuntime, /import \{ queriesModule \} from '\.\/data\/queries\.ts'/);
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
    'test:browser',
    'test:browser:install',
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
  assert.equal(typeof packageJson.devDependencies['@playwright/test'], 'string');
  assert.equal(packageJson.engines.node, '>=22.18');
});

test('Pages deployment runs production browser acceptance before publishing', () => {
  assert.match(playwrightConfig, /start-production-preview\.ts/);
  assert.match(playwrightConfig, /\/civilization-wander\//);
  const buildIndex = deployWorkflow.indexOf('- name: Build');
  const browserIndex = deployWorkflow.indexOf('- name: Run production browser acceptance');
  const publishIndex = deployWorkflow.indexOf('- name: Configure Pages');
  assert.ok(buildIndex >= 0 && buildIndex < browserIndex);
  assert.ok(browserIndex < publishIndex);
  assert.match(deployWorkflow, /playwright install --with-deps chromium/);
  assert.match(deployWorkflow, /playwright-report/);
});
