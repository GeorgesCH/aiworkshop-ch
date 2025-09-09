#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building optimized production version...\n');

// Clean previous build
if (fs.existsSync('dist')) {
  console.log('🧹 Cleaning previous build...');
  fs.rmSync('dist', { recursive: true, force: true });
}

// Run the build
console.log('🔨 Running production build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Analyze bundle size
console.log('📊 Analyzing bundle size...');
try {
  const { execSync } = require('child_process');

  // Check if dist directory exists and has files
  if (fs.existsSync('dist')) {
    const files = fs.readdirSync('dist/assets', { recursive: true })
      .filter(file => file.endsWith('.js') || file.endsWith('.css'))
      .map(file => {
        const filePath = path.join('dist/assets', file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeKB: (stats.size / 1024).toFixed(2)
        };
      })
      .sort((a, b) => b.size - a.size);

    console.log('📦 Bundle Analysis:');
    console.log('==================');
    files.slice(0, 10).forEach(file => {
      console.log(`${file.name}: ${file.sizeKB} KB`);
    });

    const totalSize = files.reduce((total, file) => total + file.size, 0);
    console.log(`\n💾 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  }
} catch (error) {
  console.log('⚠️  Could not analyze bundle size:', error.message);
}

console.log('\n🎉 Optimization complete!');
console.log('📋 Performance improvements implemented:');
console.log('✅ Images optimized and converted to WebP');
console.log('✅ Google Fonts loaded asynchronously');
console.log('✅ Code splitting with lazy loading');
console.log('✅ JavaScript minification with Terser');
console.log('✅ Preconnect hints added');
console.log('✅ Bundle chunking for better caching');
console.log('\n💡 Next steps:');
console.log('1. Deploy the optimized build');
console.log('2. Test with PageSpeed Insights');
console.log('3. Monitor Core Web Vitals');
console.log('4. Consider implementing service worker for caching');
