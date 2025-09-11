#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting build with static assets...\n');

// Step 1: Clean build directory
console.log('📁 Cleaning build directory...');
if (fs.existsSync('build')) {
  fs.rmSync('build', { recursive: true, force: true });
}

// Step 2: Run the normal build
console.log('🔨 Running Vite build...');
execSync('npx vite build', { stdio: 'inherit' });

// Step 3: Copy static assets from public to build
console.log('📋 Copying static assets...');
const publicDir = 'public';
const buildDir = 'build';

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
  
  copyRecursive(publicDir, buildDir);
  console.log('✅ Static assets copied successfully');
} else {
  console.log('⚠️  Public directory not found, skipping asset copy');
}

// Step 3.5: Copy fonts from src/assets to build
console.log('📋 Copying fonts...');
const srcFontsDir = 'src/assets/fonts';
const buildFontsDir = 'build/fonts';

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
  
  copyRecursive(srcFontsDir, buildFontsDir);
  console.log('✅ Fonts copied successfully');
} else {
  console.log('⚠️  Fonts directory not found, skipping font copy');
}

// Step 4: Verify the build
console.log('\n📊 Build verification:');
const buildFiles = fs.readdirSync(buildDir);
console.log(`- Total files in build: ${buildFiles.length}`);
console.log(`- Has index.html: ${buildFiles.includes('index.html')}`);
console.log(`- Has assets directory: ${buildFiles.includes('assets')}`);
console.log(`- Has @optimized directory: ${buildFiles.includes('@optimized')}`);
console.log(`- Has fonts directory: ${buildFiles.includes('fonts')}`);
console.log(`- Has robots.txt: ${buildFiles.includes('robots.txt')}`);
console.log(`- Has sitemap.xml: ${buildFiles.includes('sitemap.xml')}`);

// Check subdirectories
if (buildFiles.includes('@optimized')) {
  const optimizedFiles = fs.readdirSync(path.join(buildDir, '@optimized'));
  console.log(`- @optimized directory contains ${optimizedFiles.length} files`);
}

if (buildFiles.includes('fonts')) {
  const fontFiles = fs.readdirSync(path.join(buildDir, 'fonts'));
  console.log(`- fonts directory contains ${fontFiles.length} files`);
}

console.log('\n🎉 Build completed successfully!');
console.log('📁 All files are now in the build directory');
