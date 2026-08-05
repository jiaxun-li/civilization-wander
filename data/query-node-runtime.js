'use strict';

const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  fs,
  path,
  projectRoot: path.resolve(__dirname, '..')
};
