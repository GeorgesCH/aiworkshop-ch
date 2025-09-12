/**
 * Font Loading Utility
 * Optimizes font loading performance and provides fallback handling
 */

export interface FontLoadOptions {
  timeout?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Load custom fonts with performance optimization
 */
export function loadCustomFonts(options: FontLoadOptions = {}): Promise<void> {
  const { timeout = 3000, onLoad, onError } = options;

  return new Promise((resolve, reject) => {
    // Check if FontFace API is supported
    if (!('fonts' in document)) {
      console.warn('FontFace API not supported, using fallback');
      onLoad?.();
      resolve();
      return;
    }

    // Set up timeout
    const timeoutId = setTimeout(() => {
      console.warn('Font loading timeout, using fallback fonts');
      onLoad?.();
      resolve();
    }, timeout);

    // Load fonts
    const loadFonts = async () => {
      try {
        // Load Sigum font weights
        const fontWeights = [
          { weight: '400', style: 'normal' },
          { weight: '600', style: 'normal' },
          { weight: '700', style: 'normal' }
        ];

        const fontPromises = fontWeights.map(async ({ weight, style }) => {
          const font = new FontFace(
            'Sigum',
            `url('/fonts/sigum/Sigum.woff2') format('woff2'), url('/fonts/sigum/Sigum.woff') format('woff'), url('/fonts/sigum/Sigum.ttf') format('truetype')`,
            { weight, style, display: 'swap' }
          );

          await font.load();
          document.fonts.add(font);
          return font;
        });

        await Promise.all(fontPromises);
        
        clearTimeout(timeoutId);
        onLoad?.();
        resolve();
      } catch (error) {
        clearTimeout(timeoutId);
        const fontError = error instanceof Error ? error : new Error('Font loading failed');
        console.error('Font loading error:', fontError);
        onError?.(fontError);
        resolve(); // Still resolve to not break the app
      }
    };

    loadFonts();
  });
}

/**
 * Add font loading classes to document
 */
export function addFontLoadingClasses(): void {
  document.documentElement.classList.add('fonts-loading');
  
  loadCustomFonts({
    onLoad: () => {
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-loaded');
    },
    onError: () => {
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-fallback');
    }
  });
}

/**
 * Preload critical fonts for better performance
 */
export function preloadCriticalFonts(): void {
  // Preload the most critical font weight (600 for semibold)
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = '/fonts/sigum/Sigum.woff2';
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  
  document.head.appendChild(link);
}

/**
 * Initialize font loading system
 */
export function initializeFontLoading(): void {
  // Preload critical fonts
  preloadCriticalFonts();
  
  // Add loading classes and load fonts
  addFontLoadingClasses();
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFontLoading);
  } else {
    initializeFontLoading();
  }
}
