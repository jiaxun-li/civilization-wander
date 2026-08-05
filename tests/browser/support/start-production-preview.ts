import type { PreviewServer } from 'vite';
import { preview } from 'vite';

const port = 4173;

export default async function startProductionPreview(): Promise<() => Promise<void>> {
  const server = await preview({
    preview: {
      host: '127.0.0.1',
      port,
      strictPort: true
    }
  }) as PreviewServer;

  return async () => {
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => {
        if (error) reject(error);
        else resolve();
      });
    });
  };
}
