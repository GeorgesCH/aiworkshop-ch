// Main SEO optimization initialization and management
import { applySEO } from './seo';
import { initWebVitals, initPerformanceObserver, addResourceHints } from './web-vitals';
import { initAccessibilityEnhancements } from './accessibility-seo';
import { preloadCriticalImages, initLazyImageObserver, CRITICAL_IMAGES } from './image-optimization';
import type { Page } from '../components/router/types';

export interface SEOConfig {
  enableWebVitals: boolean;
  enableAccessibility: boolean;
  enableImageOptimization: boolean;
  enablePerformanceMonitoring: boolean;
  criticalImagePaths?: string[];
}

const DEFAULT_CONFIG: SEOConfig = {
  enableWebVitals: true,
  enableAccessibility: true,
  enableImageOptimization: true,
  enablePerformanceMonitoring: true,
  criticalImagePaths: CRITICAL_IMAGES
};

class SEOOptimizer {
  private config: SEOConfig;
  private initialized = false;
  private currentPage: Page | null = null;

  constructor(config: Partial<SEOConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Initialize all SEO optimizations
  async initialize(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') return;

    try {
      // Initialize Web Vitals monitoring
      if (this.config.enableWebVitals) {
        initWebVitals();
      }

      // Initialize performance monitoring
      if (this.config.enablePerformanceMonitoring) {
        initPerformanceObserver();
        addResourceHints();
      }

      // Initialize accessibility enhancements
      if (this.config.enableAccessibility) {
        initAccessibilityEnhancements();
      }

      // Initialize image optimization
      if (this.config.enableImageOptimization) {
        initLazyImageObserver();
        
        // Preload critical images
        if (this.config.criticalImagePaths?.length) {
          preloadCriticalImages(this.config.criticalImagePaths);
        }
      }

      // Add advanced meta tags for better SEO
      this.addAdvancedMetaTags();

      // Initialize performance observer for Core Web Vitals
      this.initCoreWebVitalsTracking();

      this.initialized = true;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 SEO Optimizer initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize SEO Optimizer:', error);
    }
  }

  // Update SEO for current page
  updatePage(page: Page, language: string = 'en'): void {
    if (!this.initialized) {
      this.initialize();
    }

    this.currentPage = page;
    
    // Apply core SEO updates
    applySEO(page, language);

    // Add page-specific optimizations
    this.addPageSpecificOptimizations(page);

    // Track page view for analytics
    this.trackPageView(page, language);
  }

  // Add advanced meta tags for better SEO
  private addAdvancedMetaTags(): void {
    if (typeof document === 'undefined') return;

    // Add DNS prefetch for better performance
    const dnsPrefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      if (!document.head.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

    // Add security-related meta tags
    const securityMetas = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' }
    ];

    securityMetas.forEach(meta => {
      if (!document.head.querySelector(`meta[name="${meta.name}"]`)) {
        const metaElement = document.createElement('meta');
        metaElement.name = meta.name;
        metaElement.content = meta.content;
        document.head.appendChild(metaElement);
      }
    });
  }

  // Initialize Core Web Vitals tracking with detailed metrics
  private initCoreWebVitalsTracking(): void {
    if (typeof window === 'undefined') return;

    // Track resource loading times
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          firstByte: perfData.responseStart - perfData.requestStart,
          domInteractive: perfData.domInteractive - perfData.navigationStart,
          resourceCount: performance.getEntriesByType('resource').length
        };

        if (process.env.NODE_ENV === 'development') {
          console.log('📊 Page Performance Metrics:', metrics);
        }

        // Send to analytics if available
        if ((window as any).gtag) {
          (window as any).gtag('event', 'page_performance', {
            event_category: 'Performance',
            dom_content_loaded: metrics.domContentLoaded,
            load_complete: metrics.loadComplete,
            first_byte: metrics.firstByte,
            dom_interactive: metrics.domInteractive,
            resource_count: metrics.resourceCount
          });
        }
      }, 100);
    });
  }

  // Add page-specific SEO optimizations
  private addPageSpecificOptimizations(page: Page): void {
    if (typeof document === 'undefined') return;

    // Add structured data for specific page types
    switch (page) {
      case 'home':
        this.addHomepageStructuredData();
        break;
      case 'contact':
        this.addContactPageStructuredData();
        break;
      case 'about':
        this.addAboutPageStructuredData();
        break;
    }

    // Add page-specific preload hints
    this.addPageSpecificPreloads(page);
  }

  // Add homepage-specific structured data
  private addHomepageStructuredData(): void {
    const existingScript = document.head.querySelector('script[type="application/ld+json"][data-page="home"]');
    if (existingScript) return;

    const homepageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://aiworkshop.ch/#webpage",
      "url": "https://aiworkshop.ch/",
      "name": "AI Workshop Switzerland - Professional AI Training",
      "description": "Professional AI training and workshops across Switzerland. Master Generative AI, Agentic AI, and AI for Business Intelligence.",
      "isPartOf": {
        "@id": "https://aiworkshop.ch/#website"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://aiworkshop.ch/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.jpg"
      },
      "datePublished": "2024-01-01T00:00:00+00:00",
      "dateModified": new Date().toISOString()
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-page', 'home');
    script.setAttribute('data-managed', 'seo');
    script.text = JSON.stringify(homepageSchema, null, 2);
    document.head.appendChild(script);
  }

  // Add contact page structured data
  private addContactPageStructuredData(): void {
    const existingScript = document.head.querySelector('script[type="application/ld+json"][data-page="contact"]');
    if (existingScript) return;

    const contactSchema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "url": "https://aiworkshop.ch/contact/",
      "name": "Contact AI Workshop Switzerland",
      "description": "Get in touch with AI Workshop Switzerland for professional AI training and workshops."
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-page', 'contact');
    script.setAttribute('data-managed', 'seo');
    script.text = JSON.stringify(contactSchema, null, 2);
    document.head.appendChild(script);
  }

  // Add about page structured data
  private addAboutPageStructuredData(): void {
    const existingScript = document.head.querySelector('script[type="application/ld+json"][data-page="about"]');
    if (existingScript) return;

    const aboutSchema = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "url": "https://aiworkshop.ch/about/",
      "name": "About AI Workshop Switzerland",
      "description": "Learn about AI Workshop Switzerland's mission to provide professional AI training across Switzerland."
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-page', 'about');
    script.setAttribute('data-managed', 'seo');
    script.text = JSON.stringify(aboutSchema, null, 2);
    document.head.appendChild(script);
  }

  // Add page-specific resource preloads
  private addPageSpecificPreloads(page: Page): void {
    const preloadMap: Record<string, string[]> = {
      'home': [
        '/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.webp'
      ],
      'about': [
        '/@optimized/48dec070b8118ab1abfec06ede3bc9d0f96e8592-optimized.jpg'
      ],
      'contact': [
        '/@optimized/2b31eff5bc767a2151576710d6a4f75fb7d1885f-optimized.jpg'
      ]
    };

    const imagesToPreload = preloadMap[page];
    if (imagesToPreload) {
      preloadCriticalImages(imagesToPreload);
    }
  }

  // Track page views for analytics
  private trackPageView(page: Page, language: string): void {
    if (typeof window === 'undefined') return;

    // Send to Google Analytics if available
    if ((window as any).gtag) {
      (window as any).gtag('config', 'GA_TRACKING_ID', {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: page,
          custom_parameter_2: language
        }
      });
    }

    // Track in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📈 Page view tracked: ${page} (${language})`);
    }
  }

}

// Global SEO optimizer instance
let seoOptimizer: SEOOptimizer | null = null;

export function initSEOOptimizer(config?: Partial<SEOConfig>): SEOOptimizer {
  if (!seoOptimizer) {
    seoOptimizer = new SEOOptimizer(config);
  }
  return seoOptimizer;
}

