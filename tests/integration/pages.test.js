const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('index.html');
const entry = read('src/main.ts');
const app = read('src/app.ts');
const homeView = read('src/home/home-view.ts');
const siteHeader = read('src/shell/site-header.ts');
const storyNavigation = read('src/shell/story-navigation.ts');
const navigationPreview = read('src/reader/navigation-preview.ts');
const mediaCaption = read('src/media/media-caption.ts');
const cardHeader = read('src/reader/card-header.ts');
const cardView = read('src/reader/card-view.ts');
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
  assert.match(app, /import \{ atlasData \} from '\.\/data\/atlas-data\.ts'/);
  assert.match(app, /import \{ queriesModule \} from '\.\/data\/queries\.ts'/);
  assert.doesNotMatch(
    app,
    /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\s*\(|\bEventSource\s*\(|navigator\.sendBeacon\s*\(/
  );
});

test('React owns the home view while App retains navigation orchestration', () => {
  assert.match(app, /mountHomeView\(homeView,/);
  assert.match(homeView, /createRoot\(container\)/);
  assert.match(homeView, /function HomeView\(/);
  assert.match(homeView, /data-start-card/);
  assert.match(homeView, /onOpenCard\(action\.cardId, primary\)/);
  assert.doesNotMatch(homeView, /history\.|localStorage|createCardReader|renderMapState/);
  assert.doesNotMatch(app, /bindStartCards|bindHomeLinks/);
});

test('React renders the site header without owning home navigation', () => {
  assert.match(app, /mountSiteHeader\(/);
  assert.match(siteHeader, /createRoot\(container\)/);
  assert.match(siteHeader, /function SiteHeader\(/);
  assert.match(siteHeader, /data-home-link/);
  assert.match(siteHeader, /onGoHome\(\)/);
  assert.doesNotMatch(siteHeader, /history\.|showHome|createCardReader/);
});

test('React renders story navigation while App retains history behavior', () => {
  assert.match(app, /mountStoryNavigation\(/);
  assert.match(app, /storyNavigationController\.update\(/);
  assert.match(storyNavigation, /function StoryNavigation\(/);
  assert.match(storyNavigation, /data-story-back/);
  assert.match(storyNavigation, /trailNames\.join\(' → '\)/);
  assert.match(storyNavigation, /onClick: onBack/);
  assert.doesNotMatch(storyNavigation, /history\.|history\.back|showHome|createCardReader/);
});

test('React renders navigation previews while Reader retains preview timing', () => {
  const reader = read('src/reader/card-reader.ts');
  assert.match(app, /createCardViewController\(/);
  assert.match(navigationPreview, /function NavigationPreview\(/);
  assert.match(cardView, /createElement\(NavigationPreview, preview\)/);
  assert.match(reader, /view\.openPreview\(navigationId\)/);
  assert.match(reader, /previewTimer = windowRef\.setTimeout/);
  assert.doesNotMatch(navigationPreview, /setTimeout|mouseenter|mouseleave|followNavigation/);
});

test('React renders media captions while App retains presentation decisions', () => {
  const reader = read('src/reader/card-reader.ts');
  assert.match(app, /cardViewController\.setMediaCaption\(asset\.title\)/);
  assert.match(mediaCaption, /function MediaCaption\(/);
  assert.match(cardView, /createElement\(MediaCaption, \{ text: mediaCaption \}\)/);
  assert.doesNotMatch(mediaCaption, /createRoot\(/);
  assert.match(reader, /onBeforeCardChange\(card\)/);
  assert.doesNotMatch(mediaCaption, /getAsset|renderMapState|presentation\.kind/);
});

test('the React Card tree renders Card headers from typed view models', () => {
  const reader = read('src/reader/card-reader.ts');
  assert.match(cardHeader, /function CardHeader\(/);
  assert.match(cardHeader, /v4-main-card__introduction/);
  assert.match(cardView, /function createCardViewModel\(/);
  assert.match(cardView, /createElement\(CardHeader, model\.header\)/);
  assert.match(reader, /onBeforeCardChange\(card\)/);
  assert.doesNotMatch(cardHeader, /getCard|getEntity|history\.|renderCard/);
});

test('one React Card root owns Card and Scene DOM while Reader owns state and history', () => {
  const reader = read('src/reader/card-reader.ts');
  assert.match(cardView, /const reactRoot: Root = createRoot\(root\)/);
  assert.match(reader, /view\.renderCard\(card\.id, resolvedScene\.id, cardViewActions\)/);
  assert.match(reader, /view\.setActiveScene\(scene\.id\)/);
  assert.doesNotMatch(reader, /innerHTML|querySelectorAll<HTMLElement>|addEventListener\('click'/);
  assert.doesNotMatch(cardHeader + mediaCaption + navigationPreview, /createRoot\(/);
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
  assert.deepEqual(Object.keys(packageJson.dependencies).sort(), ['react', 'react-dom']);
  assert.equal(typeof packageJson.dependencies.react, 'string');
  assert.equal(typeof packageJson.dependencies['react-dom'], 'string');
  assert.equal(typeof packageJson.devDependencies.vite, 'string');
  assert.equal(typeof packageJson.devDependencies.typescript, 'string');
  assert.equal(typeof packageJson.devDependencies['@types/node'], 'string');
  assert.equal(typeof packageJson.devDependencies['@types/react'], 'string');
  assert.equal(typeof packageJson.devDependencies['@types/react-dom'], 'string');
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
