(function exposeQueryNodeRuntime(root) {
  'use strict';

  const hasNodeModuleRuntime = typeof process === 'object'
    && process !== null
    && typeof process.versions === 'object'
    && Boolean(process.versions.node)
    && typeof module === 'object'
    && module !== null
    && typeof module.require === 'function';

  const runtime = hasNodeModuleRuntime
    ? {
        fs: module.require('node:fs'),
        path: module.require('node:path'),
        projectRoot: module.require('node:path').resolve(__dirname, '..')
      }
    : null;

  if (root) root.ATLAS_V5_QUERY_NODE_RUNTIME = runtime;
  if (hasNodeModuleRuntime && module.exports) module.exports = runtime;
}(typeof window !== 'undefined' ? window : globalThis));
