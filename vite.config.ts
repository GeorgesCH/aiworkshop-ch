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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          // Core React libraries - keep small for LCP
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // UI libraries - defer loading
          if (id.includes('lucide-react') || id.includes('sonner') || id.includes('vaul')) {
            return 'ui-vendor';
          }
          // Form libraries - defer loading
          if (id.includes('react-hook-form') || id.includes('react-day-picker')) {
            return 'form-vendor';
          }
          // Chart libraries - defer loading
          if (id.includes('recharts')) {
            return 'chart-vendor';
          }
          // Utility libraries - defer loading
          if (id.includes('tailwind-merge') || id.includes('clsx')) {
            return 'utils-vendor';
          }
          // Analytics and performance - defer loading
          if (id.includes('analytics') || id.includes('performance') || id.includes('web-vitals')) {
            return 'analytics-vendor';
          }
          // SEO and optimization - defer loading
          if (id.includes('seo') || id.includes('optimizer')) {
            return 'seo-vendor';
          }
          // Large components - defer loading
          if (id.includes('admin') || id.includes('CoursePage') || id.includes('SEOLandingPage')) {
            return 'large-components';
          }
          // Language provider - separate chunk
          if (id.includes('LanguageProvider')) {
            return 'language-vendor';
          }
          // Theme provider - separate chunk
          if (id.includes('ThemeProvider')) {
            return 'theme-vendor';
          }
          // Firebase auth - separate chunk
          if (id.includes('FirebaseAuthProvider') || id.includes('firebase')) {
            return 'auth-vendor';
          }
          // Router components - separate chunk
          if (id.includes('router') || id.includes('PageRouter')) {
            return 'router-vendor';
          }
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
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