const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);

for (const relativePath of ['data/content.js', 'data/knowledge.js']) {
  vm.runInContext(
    fs.readFileSync(path.join(root, relativePath), 'utf8'),
    sandbox,
    { filename: relativePath }
  );
}

assert.deepEqual(
  Array.from(sandbox.window.ATLAS_STORIES, story => story.id).sort(),
  ['guanzhong', 'hexi', 'sichuan'],
  'All legacy region records must remain available'
);
assert.ok(
  sandbox.window.ATLAS_KNOWLEDGE.stories.some(story => story.id === 'buddhism-eastward'),
  'The legacy Buddhism Story and its chapters must remain available'
);

const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
const expectedTail = [
  'data/knowledge.js',
  'data/curation.js',
  'data/entity-network.js',
  'data/entity-queries.js',
  'app.js'
];
assert.deepEqual(scripts.slice(-expectedTail.length), expectedTail);
assert.equal(
  (html.match(/id="entity-timeline"/g) || []).length,
  1,
  'The document must contain exactly one entity timeline'
);
assert.match(html, /data-route-link="explorations">探索<\/a>/);
assert.doesNotMatch(html, /data-route-link="topics"/);

assert.match(
  appSource,
  /renderEntityMap\(coreEntityId,\s*\{\s*fallbackView:\s*chapter\.view,\s*legacyMode:\s*true\s*\}\)/,
  'Legacy Story maps must explicitly use the compatibility path'
);
assert.match(appSource, /route\.startsWith\('entity-'\)/);
assert.match(appSource, /stories\.some\(story => story\.id === route\)/);
assert.match(appSource, /data-exploration-open/);
assert.match(appSource, /if \(getExploration\(storyId\)\)/);
assert.doesNotMatch(
  appSource,
  /\b(explorationCopy|explorationQuestions|relationPriority|storyChapterEntityIds)\b/,
  'Legacy curation names must not leak into the generic application renderer'
);
assert.doesNotMatch(
  appSource,
  /\b(buddhism|ashoka|maurya)\b|佛教|阿育王|孔雀帝国/,
  'The generic application renderer must not branch on migrated entity identities'
);

console.log('legacy compatibility tests passed');
