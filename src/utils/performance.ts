// Performance monitoring and optimization utilities for Core Web Vitals
import { initPerformanceMonitoring as initNewPerformanceMonitoring } from './performance-monitor';

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null
  };

  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initObservers();
    this.measureTTFB();
  }

  private initObservers() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window && 'LargestContentfulPaint' in window.PerformanceObserver.supportedEntryTypes) {
      const lcpObserver = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.reportMetric('LCP', this.metrics.lcp);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window && 'FirstInput' in window.PerformanceObserver.supportedEntryTypes) {
      const fidObserver = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstInput = entries[0];
        this.metrics.fid = firstInput.processingStart - firstInput.startTime;
        this.reportMetric('FID', this.metrics.fid);
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    }

    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window && 'LayoutShift' in window.PerformanceObserver.supportedEntryTypes) {
      let clsValue = 0;
      const clsObserver = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = clsValue;
        this.reportMetric('CLS', this.metrics.cls);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }

    // First Contentful Paint (FCP)
    if ('PerformanceObserver' in window && 'FirstContentfulPaint' in window.PerformanceObserver.supportedEntryTypes) {
      const fcpObserver = new window.PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        this.metrics.fcp = firstEntry.startTime;
        this.reportMetric('FCP', this.metrics.fcp);
      });
      fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
      this.observers.push(fcpObserver);
    }
  }

  private measureTTFB() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
        this.reportMetric('TTFB', this.metrics.ttfb);
      }
    }
  }

  private reportMetric(name: string, value: number | null) {
    if (value !== null) {
      // Send to analytics (Google Analytics, etc.)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: name,
          value: Math.round(name === 'CLS' ? value * 1000 : value),
          non_interaction: true,
        });
      }

      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 ${name}: ${value.toFixed(2)}ms`);
      }
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization utilities
export function optimizeImages() {
  // Add loading="lazy" to images below the fold
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img, index) => {
    if (index > 2) { // Skip first few images (above the fold)
      img.setAttribute('loading', 'lazy');
    }
  });
}

// Font optimization
export function optimizeFonts() {
  // Preload critical fonts
  const criticalFonts = [
    '/fonts/sigum/Sigum.woff2',
    '/fonts/aiworkshop/aiworkshop-font.woff2'
  ];

  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = font;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Resource hints for better performance
export function addResourceHints() {
  const hints = [
    { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    Object.entries(hint).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });
    document.head.appendChild(link);
  });
}

// Initialize performance monitoring
let performanceMonitor: PerformanceMonitor | null = null;

export function initPerformanceMonitoring() {
  if (typeof window !== 'undefined' && !performanceMonitor) {
    // Use the new optimized performance monitor
    initNewPerformanceMonitoring();
    
    // Keep legacy monitor for backward compatibility
    performanceMonitor = new PerformanceMonitor();
    
    // Optimize images and fonts
    optimizeImages();
    optimizeFonts();
    addResourceHints();
    
    // Additional performance optimizations
    preloadCriticalResources();
    optimizeScrollPerformance();
  }
}

// Preload critical resources for faster page loads
function preloadCriticalResources() {
  const criticalResources = [
    '/optimized/AI-Workshop-training-for-employees-switzerland-optimized.webp',
    '/hero-dots.png'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

// Optimize scroll performance with passive event listeners
function optimizeScrollPerformance() {
  let scrollTimeout: NodeJS.Timeout | null = null;
  
  const handleScroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      // Trigger any scroll-dependent optimizations here
      optimizeImages();
    }, 100);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

export function getPerformanceMetrics() {
  return performanceMonitor?.getMetrics() || null;
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceMonitor?.disconnect();
  });
}
