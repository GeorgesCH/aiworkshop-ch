
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite';
  import path from 'path';

  export default defineConfig({
    plugins: [react(), tailwindcss()],
        define: {
          // Fix for framer-motion + React 18 compatibility
          global: 'globalThis',
          // Polyfill scheduler for build time
          'scheduler.unstable_now': 'performance.now',
          // Ensure process.env.NODE_ENV is defined
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
        },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'figma:asset/ba5af1c8c808cdc8975a80d645c78562f58c8983.png': path.resolve(__dirname, './src/assets/ba5af1c8c808cdc8975a80d645c78562f58c8983.png'),
        'figma:asset/7cac56392bea021c8a910f4bd070b505a79bf287.png': path.resolve(__dirname, './src/assets/7cac56392bea021c8a910f4bd070b505a79bf287.png'),
        'figma:asset/48dec070b8118ab1abfec06ede3bc9d0f96e8592.png': path.resolve(__dirname, './src/assets/48dec070b8118ab1abfec06ede3bc9d0f96e8592.png'),
        'figma:asset/2b31eff5bc767a2151576710d6a4f75fb7d1885f.png': path.resolve(__dirname, './src/assets/2b31eff5bc767a2151576710d6a4f75fb7d1885f.png'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        // Scheduler polyfill for framer-motion compatibility
        'scheduler': path.resolve(__dirname, './src/utils/scheduler-polyfill.js'),
        '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@vite/client', '@vite/env'],
    include: [
      'react', 
      'react-dom', 
      'react/jsx-runtime',
      'framer-motion',
      'lucide-react',
      'react-hook-form',
      'recharts',
      'use-callback-ref',
      '@radix-ui/react-use-callback-ref'
    ],
    esbuildOptions: {
      target: 'esnext'
    },
    force: true
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: { 
        drop_console: true, 
        drop_debugger: true,
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    sourcemap: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Simplified chunking strategy
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'js/[name]-[hash:8].js',
        entryFileNames: 'js/[name]-[hash:8].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || ['asset'];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `images/[name]-[hash:8].[ext]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash:8].[ext]`;
          }
          if (/woff2?|ttf|eot/i.test(ext)) {
            return `fonts/[name]-[hash:8].[ext]`;
          }
          return `assets/[name]-[hash:8].[ext]`;
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      port: 5173,
      host: 'localhost'
    },
    fs: {
      strict: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
});
