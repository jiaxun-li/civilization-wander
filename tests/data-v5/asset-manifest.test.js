const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const modules = [
  'mesopotamia', 'ancient-egypt', 'ancient-india', 'ancient-china',
  'late-bronze-age', 'aegean', 'iron-age-near-east'
];

test('every active Asset has a non-runtime metadata record with a current digest', () => {
  for (const moduleName of modules) {
    const moduleData = require(path.resolve(root, `data/${moduleName}.js`));
    const manifest = JSON.parse(fs.readFileSync(path.resolve(root, `assets/images/${moduleName}/manifest.json`), 'utf8'));
    const entryById = new Map(manifest.assets.map(entry => [entry.assetId, entry]));
    assert.equal(entryById.size, moduleData.assets.length, moduleName);
    for (const asset of moduleData.assets) {
      const entry = entryById.get(asset.id);
      assert.ok(entry, asset.id);
      assert.equal(entry.file, asset.src, asset.id);
      assert.deepEqual(entry.sourceIds, asset.sourceIds, asset.id);
      assert.ok(Number.isInteger(entry.originalWidth) && entry.originalWidth > 0, asset.id);
      assert.ok(Number.isInteger(entry.originalHeight) && entry.originalHeight > 0, asset.id);
      const digest = crypto.createHash('sha256').update(fs.readFileSync(path.resolve(root, asset.src))).digest('hex');
      assert.equal(entry.sha256, digest, asset.id);
    }
  }
});

test('active AI-generated images are explicitly identified and remain below one megabyte', () => {
  const aiEntries = modules.flatMap(moduleName => {
    const manifest = JSON.parse(fs.readFileSync(path.resolve(root, `assets/images/${moduleName}/manifest.json`), 'utf8'));
    return manifest.assets.filter(entry => entry.origin === 'aiGenerated');
  });
  assert.equal(aiEntries.length, 3);
  for (const entry of aiEntries) {
    assert.ok(fs.statSync(path.resolve(root, entry.file)).size < 1_000_000, entry.assetId);
  }
});
