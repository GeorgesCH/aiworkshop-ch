import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { readFile } from 'fs/promises';
import { extname } from 'path';
import { fileURLToPath } from 'url';

// Ensure __dirname is available in ESM context
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@optimized': path.resolve(__dirname, './src/assets/optimized'),
      // Radix UI aliases
      '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
      '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
      '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
      '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
      '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
      '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
      '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
      '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
      '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
      '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
      '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
      '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
      '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
      '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
      '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
      '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
      '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
      '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
      '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
      '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
      '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
      '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
      '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
      '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
      // Other versioned imports
      'lucide-react@0.487.0': 'lucide-react',
      'class-variance-authority@0.7.1': 'class-variance-authority',
      'embla-carousel-react@8.6.0': 'embla-carousel-react',
      'react-hook-form@7.55.0': 'react-hook-form',
      'recharts@2.15.2': 'recharts',
      'cmdk@1.1.1': 'cmdk',
      'react-day-picker@8.10.1': 'react-day-picker',
      'vaul@1.1.2': 'vaul',
      'react-resizable-panels@2.1.7': 'react-resizable-panels',
      'input-otp@1.4.2': 'input-otp',
      // Figma asset aliases
      'figma:asset/ba5af1c8c808cdc8975a80d645c78562f58c8983.png': path.resolve(__dirname, './src/assets/ba5af1c8c808cdc8975a80d645c78562f58c8983.png'),
      'figma:asset/7cac56392bea021c8a910f4bd070b505a79bf287.png': path.resolve(__dirname, './src/assets/7cac56392bea021c8a910f4bd070b505a79bf287.png'),
      'figma:asset/48dec070b8118ab1abfec06ede3bc9d0f96e8592.png': path.resolve(__dirname, './src/assets/48dec070b8118ab1abfec06ede3bc9d0f96e8592.png'),
      'figma:asset/2b31eff5bc767a2151576710d6a4f75fb7d1885f.png': path.resolve(__dirname, './src/assets/2b31eff5bc767a2151576710d6a4f75fb7d1885f.png'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', 'lucide-react'],
        },
      },
    },
    // Use Vite defaults for module preload (better performance)
  },
  publicDir: 'public',
  server: {
    port: 5174,
    host: 'localhost',
    hmr: {
      port: 5174,
      host: 'localhost',
      clientPort: 5174,
    },
    strictPort: true,
  },
});
