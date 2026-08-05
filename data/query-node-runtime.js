(function exposeQueryNodeRuntime(root) {
  'use strict';

  const runtime = typeof module === 'object' && module.exports
    ? {
        fs: module['require']('node:fs'),
        path: module['require']('node:path'),
        projectRoot: module['require']('node:path').resolve(__dirname, '..')
      }
    : null;

  if (root) root.ATLAS_V5_QUERY_NODE_RUNTIME = runtime;
  if (typeof module === 'object' && module.exports) module.exports = runtime;
}(typeof window !== 'undefined' ? window : globalThis));
