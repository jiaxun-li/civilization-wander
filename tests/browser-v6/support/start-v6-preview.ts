import { resolve } from 'node:path';
import type { PreviewServer } from 'vite';
import { preview } from 'vite';

const port = 4174;

export default async function startV6Preview(): Promise<() => Promise<void>> {
  const server = await preview({
    configFile: resolve(process.cwd(), 'vite.v6-preview.config.mts'),
    preview: {
      host: '127.0.0.1',
      port,
      strictPort: true
    }
  }) as PreviewServer;

  return async () => {
    await new Promise<void>((resolveClose, reject) => {
      server.httpServer.close(error => {
        if (error) reject(error);
        else resolveClose();
      });
    });
  };
}
