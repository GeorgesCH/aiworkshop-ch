#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting build with static assets...\n');

// Step 1: Clean dist directory
console.log('📁 Cleaning dist directory...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// Step 2: Run the normal build
console.log('🔨 Running Vite build...');
execSync('npx vite build', { stdio: 'inherit' });

// Step 3: Copy static assets from public to dist
console.log('📋 Copying static assets...');
const publicDir = 'public';
const distDir = 'dist';

if (fs.existsSync(publicDir)) {
  const copyRecursive = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.statSync(srcPath).isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  
  copyRecursive(publicDir, distDir);
  console.log('✅ Static assets copied successfully');
} else {
  console.log('⚠️  Public directory not found, skipping asset copy');
}

// Step 3.5: Copy fonts from src/assets to dist
console.log('📋 Copying fonts...');
const srcFontsDir = 'src/assets/fonts';
const distFontsDir = 'dist/fonts';

if (fs.existsSync(srcFontsDir)) {
  const copyRecursive = (src, dest) => {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.statSync(srcPath).isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  
  copyRecursive(srcFontsDir, distFontsDir);
  console.log('✅ Fonts copied successfully');
} else {
  console.log('⚠️  Fonts directory not found, skipping font copy');
}

// Step 4: Verify the build
console.log('\n📊 Build verification:');
const distFiles = fs.readdirSync(distDir);
console.log(`- Total files in dist: ${distFiles.length}`);
console.log(`- Has index.html: ${distFiles.includes('index.html')}`);
console.log(`- Has assets directory: ${distFiles.includes('assets')}`);
console.log(`- Has @optimized directory: ${distFiles.includes('@optimized')}`);
console.log(`- Has fonts directory: ${distFiles.includes('fonts')}`);
console.log(`- Has robots.txt: ${distFiles.includes('robots.txt')}`);
console.log(`- Has sitemap.xml: ${distFiles.includes('sitemap.xml')}`);

// Check subdirectories
if (distFiles.includes('@optimized')) {
  const optimizedFiles = fs.readdirSync(path.join(distDir, '@optimized'));
  console.log(`- @optimized directory contains ${optimizedFiles.length} files`);
}

if (distFiles.includes('fonts')) {
  const fontFiles = fs.readdirSync(path.join(distDir, 'fonts'));
  console.log(`- fonts directory contains ${fontFiles.length} files`);
}

console.log('\n🎉 Build completed successfully!');
console.log('📁 All files are now in the dist directory');
