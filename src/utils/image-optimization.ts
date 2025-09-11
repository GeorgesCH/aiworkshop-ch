// Advanced image optimization utilities for better SEO and Core Web Vitals
import React from 'react';

export interface ImageOptimizationOptions {
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
}

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: Record<string, any>;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Generate srcset for responsive images
export function generateSrcSet(basePath: string, widths: number[] = [320, 640, 960, 1280, 1920]): string {
  return widths
    .map(width => {
      const optimizedPath = basePath.replace(/\.(jpg|jpeg|png)$/i, `-w${width}.webp`);
      return `${optimizedPath} ${width}w`;
    })
    .join(', ');
}

// Generate sizes attribute based on viewport breakpoints
export function generateSizes(breakpoints: Array<{ condition: string; size: string }>): string {
  return breakpoints
    .map(bp => `${bp.condition} ${bp.size}`)
    .join(', ');
}

// Check if WebP is supported
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const webp = new Image();
    webp.onload = webp.onerror = () => {
      resolve(webp.height === 2);
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

// Check if AVIF is supported
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

// Get optimal image format based on browser support
export async function getOptimalFormat(): Promise<'avif' | 'webp' | 'original'> {
  try {
    if (await supportsAVIF()) return 'avif';
    if (await supportsWebP()) return 'webp';
    return 'original';
  } catch {
    return 'original';
  }
}

// Generate optimized image path
export function getOptimizedImagePath(originalPath: string, options: ImageOptimizationOptions = {}): string {
  const { format = 'auto', quality = 80 } = options;
  
  if (format === 'auto') {
    // Return original path for now, format detection happens at runtime
    return originalPath;
  }

  // Convert to optimized format
  const pathWithoutExt = originalPath.replace(/\.[^/.]+$/, '');
  return `${pathWithoutExt}-optimized.${format}`;
}

// Preload critical images
export function preloadCriticalImages(imagePaths: string[]) {
  if (typeof document === 'undefined') return;

  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    
    // Add fetch priority for above-the-fold images
    if ('fetchPriority' in link) {
      (link as any).fetchPriority = 'high';
    }
    
    document.head.appendChild(link);
  });
}

// Lazy loading intersection observer
let imageObserver: IntersectionObserver | null = null;

export function initLazyImageObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;

  if (imageObserver) return imageObserver;

  imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const dataSrc = img.dataset.src;
          const dataSrcSet = img.dataset.srcset;

          if (dataSrc) {
            img.src = dataSrc;
            img.removeAttribute('data-src');
          }

          if (dataSrcSet) {
            img.srcset = dataSrcSet;
            img.removeAttribute('data-srcset');
          }

          img.classList.remove('lazy');
          img.classList.add('lazy-loaded');
          imageObserver?.unobserve(img);
        }
      });
    },
    {
      // Load images when they're 100px away from viewport
      rootMargin: '100px 0px',
      threshold: 0.01
    }
  );

  return imageObserver;
}

// Image loading performance metrics
export function trackImagePerformance(imagePath: string, startTime: number) {
  const loadTime = performance.now() - startTime;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`📸 Image loaded: ${imagePath} in ${loadTime.toFixed(2)}ms`);
  }

  // Track in performance timeline
  try {
    performance.mark(`image-load-end-${imagePath}`);
    performance.measure(
      `image-load-${imagePath}`,
      { start: startTime },
      `image-load-end-${imagePath}`
    );
  } catch (error) {
    // Silently fail if performance API is not available
  }
}

// Critical image paths that should be preloaded
export const CRITICAL_IMAGES = [
  '/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.webp',
  '/apple-touch-icon.png'
];

// Responsive image breakpoints for different screen sizes
export const RESPONSIVE_BREAKPOINTS = [
  { condition: '(max-width: 640px)', size: '100vw' },
  { condition: '(max-width: 768px)', size: '90vw' },
  { condition: '(max-width: 1024px)', size: '80vw' },
  { condition: '(max-width: 1280px)', size: '70vw' },
  { condition: '', size: '60vw' }
];

// Common image sizes for srcset generation
export const COMMON_WIDTHS = [320, 480, 640, 768, 1024, 1280, 1536, 1920];
