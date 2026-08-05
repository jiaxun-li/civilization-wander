'use strict';

const { atlasData: atlas } = require('../src/data/atlas-data.ts');

const counts = Object.fromEntries(
  Object.entries(atlas)
    .filter(([, value]) => Array.isArray(value))
    .map(([name, value]) => [name, value.length])
);

const report = {
  schemaVersion: atlas.schemaVersion,
  counts
};

if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(`schemaVersion: ${report.schemaVersion}\n`);
  for (const [name, count] of Object.entries(counts)) {
    process.stdout.write(`${name}: ${count}\n`);
  }
}
