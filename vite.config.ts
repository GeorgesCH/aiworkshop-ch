import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@optimized': path.resolve(__dirname, './src/assets/optimized'),
      'figma:asset/ba5af1c8c808cdc8975a80d645c78562f58c8983.png':
        path.resolve(__dirname, './src/assets/ba5af1c8c808cdc8975a80d645c78562f58c8983.png'),
      'figma:asset/7cac56392bea021c8a910f4bd070b505a79bf287.png':
        path.resolve(__dirname, './src/assets/7cac56392bea021c8a910f4bd070b505a79bf287.png'),
      'figma:asset/48dec070b8118ab1abfec06ede3bc9d0f96e8592.png':
        path.resolve(__dirname, './src/assets/48dec070b8118ab1abfec06ede3bc9d0f96e8592.png'),
      'figma:asset/2b31eff5bc767a2151576710d6a4f75fb7d1885f.png':
        path.resolve(__dirname, './src/assets/2b31eff5bc767a2151576710d6a4f75fb7d1885f.png'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime'
    ],
    exclude: ['@vite/client', '@vite/env'],
    force: true
  },
  css: { devSourcemap: true },
  build: {
    target: 'es2022',
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      external: [],
      output: {
        // Disable manual chunking temporarily to fix React loading issues
        // manualChunks: undefined,
      },
    },
  },
  publicDir: 'public',
  server: {
    port: 5174,
    host: true,
    strictPort: true,
  },
});