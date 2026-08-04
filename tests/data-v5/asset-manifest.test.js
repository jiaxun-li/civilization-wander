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

test('runtime image directories contain WebP files rather than duplicate JPEG or PNG copies', () => {
  for (const moduleName of modules) {
    const directory = path.resolve(root, `assets/images/${moduleName}`);
    const legacyFiles = fs.readdirSync(directory)
      .filter(filename => /\.(?:jpe?g|png)$/i.test(filename));
    assert.deepEqual(legacyFiles, [], moduleName);
  }
});

test('every active Asset has a non-runtime metadata record with a current digest', () => {
  for (const moduleName of modules) {
    const moduleData = require(path.resolve(root, `data/${moduleName}.js`));
    const manifest = JSON.parse(fs.readFileSync(path.resolve(root, `assets/images/${moduleName}/manifest.json`), 'utf8'));
    assert.equal(manifest.manifestVersion, 2, moduleName);
    const entryById = new Map(manifest.assets.map(entry => [entry.assetId, entry]));
    assert.equal(entryById.size, moduleData.assets.length, moduleName);
    for (const asset of moduleData.assets) {
      const entry = entryById.get(asset.id);
      assert.ok(entry, asset.id);
      assert.equal(entry.file, asset.src, asset.id);
      assert.deepEqual(entry.sourceIds, asset.sourceIds, asset.id);
      assert.ok(Number.isInteger(entry.originalWidth) && entry.originalWidth > 0, asset.id);
      assert.ok(Number.isInteger(entry.originalHeight) && entry.originalHeight > 0, asset.id);
      assert.ok(Number.isInteger(entry.encodedWidth) && entry.encodedWidth > 0, asset.id);
      assert.ok(Number.isInteger(entry.encodedHeight) && entry.encodedHeight > 0, asset.id);
      assert.ok(entry.encodedWidth <= 2560 && entry.encodedHeight <= 2560, asset.id);
      assert.equal(entry.format, 'webp', asset.id);
      assert.ok(asset.src.endsWith('.webp'), asset.id);
      assert.equal(entry.byteSize, fs.statSync(path.resolve(root, asset.src)).size, asset.id);
      assert.ok(entry.byteSize < 1_000_000, asset.id);
      const digest = crypto.createHash('sha256').update(fs.readFileSync(path.resolve(root, asset.src))).digest('hex');
      assert.equal(entry.sha256, digest, asset.id);
    }
  }
});

test('active AI-generated images remain explicitly identified after WebP conversion', () => {
  const aiEntries = modules.flatMap(moduleName => {
    const manifest = JSON.parse(fs.readFileSync(path.resolve(root, `assets/images/${moduleName}/manifest.json`), 'utf8'));
    return manifest.assets.filter(entry => entry.origin === 'aiGenerated');
  });
  assert.equal(aiEntries.length, 3);
  for (const entry of aiEntries) {
    assert.equal(entry.format, 'webp', entry.assetId);
  }
});
