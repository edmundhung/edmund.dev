import { fileURLToPath } from 'node:url';

import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: fileURLToPath(new URL('./client.ts', import.meta.url)),
          output: {
            assetFileNames: 'assets/[name][extname]',
            entryFileNames: 'assets/client.js',
            chunkFileNames: 'assets/[name]-[hash].js',
          },
        },
      },
    },
  },
  plugins: [tailwindcss(), cloudflare()],
});
