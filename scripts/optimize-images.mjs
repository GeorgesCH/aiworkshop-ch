#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

const assetsDir = path.join(process.cwd(), 'src', 'assets');
const publicDir = path.join(process.cwd(), 'public');

// Image optimization settings based on PageSpeed recommendations
const IMAGE_SIZES = {
  hero: { width: 1200, height: 800 }, // For hero images
  section: { width: 800, height: 600 }, // For section images
  thumbnail: { width: 400, height: 300 }, // For small images
  icon: { width: 64, height: 64 } // For icons
};

// Images that need optimization based on PageSpeed report
const IMAGES_TO_OPTIMIZE = [
  {
    name: 'AI-Workshop-training-for-employees-switzerland.jpg',
    type: 'hero',
    originalSize: '533.8 KiB',
    displaySize: '380x507'
  },
  {
    name: 'aiworkshop-business-intelligence-training.jpg',
    type: 'section',
    originalSize: '160.5 KiB',
    displaySize: '600x400'
  },
  {
    name: 'aiworkshop-team-collaboration.jpg',
    type: 'section',
    originalSize: 'Unknown',
    displaySize: '400x300'
  },
  {
    name: '2b31eff5bc767a2151576710d6a4f75fb7d1885f.png',
    type: 'icon',
    originalSize: '18.5 KiB',
    displaySize: '29x28'
  },
  {
    name: 'aiworkshop-generative-ai-training.jpg',
    type: 'section',
    originalSize: 'Unknown',
    displaySize: '600x800'
  }
];

async function optimizeImage(inputPath, outputPath, options) {
  const { width, height, format } = options;

  try {
    let pipeline = sharp(inputPath);

    // Resize if dimensions are provided
    if (width && height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'cover',
        position: 'center',
        withoutEnlargement: true
      });
    }

    // Convert to WebP for better compression
    if (format === 'webp') {
      pipeline = pipeline.webp({
        quality: 85,
        effort: 6
      });
      await pipeline.toFile(outputPath.replace(/\.(jpg|jpeg|png)$/, '.webp'));
    } else {
      // Keep original format but optimize
      await pipeline.toFile(outputPath);
    }

    console.log(`✅ Optimized: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function optimizeWithImagemin(inputPath, outputPath) {
  try {
    const result = await imagemin([inputPath], {
      destination: path.dirname(outputPath),
      plugins: [
        imageminWebp({
          quality: 85,
          method: 6
        }),
        imageminMozjpeg({
          quality: 85,
          progressive: true
        }),
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });

    if (result.length > 0) {
      console.log(`✅ Imagemin optimized: ${path.basename(inputPath)}`);
    }
  } catch (error) {
    console.error(`❌ Error with imagemin on ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  for (const image of IMAGES_TO_OPTIMIZE) {
    const inputPath = path.join(assetsDir, image.name);
    const outputDir = path.join(publicDir, 'optimized');

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const baseName = path.basename(image.name, path.extname(image.name));
    const outputPath = path.join(outputDir, `${baseName}-optimized.webp`);

    if (fs.existsSync(inputPath)) {
      console.log(`📸 Processing: ${image.name} (${image.originalSize})`);
      console.log(`   Target size: ${image.displaySize} (${image.type})`);

      // Get target dimensions
      const targetSize = IMAGE_SIZES[image.type];

      // Optimize with Sharp (resize and convert to WebP)
      await optimizeImage(inputPath, outputPath, {
        ...targetSize,
        format: 'webp'
      });

      // Also create a fallback JPEG version
      const jpegOutputPath = path.join(outputDir, `${baseName}-optimized.jpg`);
      await optimizeImage(inputPath, jpegOutputPath, {
        ...targetSize,
        format: 'jpeg'
      });

    } else {
      console.log(`⚠️  File not found: ${image.name}`);
    }

    console.log(''); // Empty line for readability
  }

  console.log('🎉 Image optimization completed!');
  console.log('\n📋 Summary of optimizations:');
  console.log('- Converted images to WebP format (better compression)');
  console.log('- Resized images to match display dimensions');
  console.log('- Applied quality optimization (85% quality)');
  console.log('- Created fallback JPEG versions for compatibility');
  console.log('\n💡 Next steps:');
  console.log('1. Update image imports in components to use optimized versions');
  console.log('2. Implement responsive images with srcset');
  console.log('3. Add lazy loading for images below the fold');
}

main().catch(console.error);
