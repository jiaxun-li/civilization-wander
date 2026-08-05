import { cp, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDirectory = resolve(projectRoot, 'dist');

export default defineConfig({
  base: '/civilization-wander/',
  publicDir: false,
  plugins: [
    {
      name: 'copy-runtime-assets',
      apply: 'build',
      async closeBundle() {
        await cp(resolve(projectRoot, 'assets'), resolve(outputDirectory, 'assets'), {
          recursive: true
        });
        await copyFile(resolve(projectRoot, '.nojekyll'), resolve(outputDirectory, '.nojekyll'));
      }
    }
  ]
});
