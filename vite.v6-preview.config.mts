import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: './',
  publicDir: false,
  build: {
    outDir: resolve(projectRoot, 'dist-v6-preview'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: resolve(projectRoot, 'knowledge-space-preview.html')
    }
  }
});
