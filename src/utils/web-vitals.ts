import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// Thresholds based on Google's Core Web Vitals recommendations
const VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = VITALS_THRESHOLDS[name as keyof typeof VITALS_THRESHOLDS];
  if (!thresholds) return 'good';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

function sendToAnalytics(metric: WebVitalsMetric) {
  // Send to Google Analytics 4 if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_rating: metric.rating,
      custom_parameter_1: metric.id,
      non_interaction: true
    });
  }

  // Send to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎯 Web Vitals - ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id
    });
  }

  // Store in localStorage for debugging
  try {
    const vitalsHistory = JSON.parse(localStorage.getItem('web-vitals-history') || '[]');
    vitalsHistory.push({
      ...metric,
      timestamp: Date.now(),
      url: window.location.pathname
    });
    
    // Keep only last 50 measurements
    if (vitalsHistory.length > 50) {
      vitalsHistory.splice(0, vitalsHistory.length - 50);
    }
    
    localStorage.setItem('web-vitals-history', JSON.stringify(vitalsHistory));
  } catch (error) {
    // Silently fail if localStorage is not available
  }
}

export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Collect and report Core Web Vitals
  onCLS((metric) => {
    const vitalsMetric: WebVitalsMetric = {
      name: 'CLS',
      value: metric.value,
      rating: getRating('CLS', metric.value),
      delta: metric.delta,
      id: metric.id,
      navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'navigate'
    };
    sendToAnalytics(vitalsMetric);
  });

  onFID((metric) => {
    const vitalsMetric: WebVitalsMetric = {
      name: 'FID',
      value: metric.value,
      rating: getRating('FID', metric.value),
      delta: metric.delta,
      id: metric.id,
      navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'navigate'
    };
    sendToAnalytics(vitalsMetric);
  });

  onFCP((metric) => {
    const vitalsMetric: WebVitalsMetric = {
      name: 'FCP',
      value: metric.value,
      rating: getRating('FCP', metric.value),
      delta: metric.delta,
      id: metric.id,
      navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'navigate'
    };
    sendToAnalytics(vitalsMetric);
  });

  onLCP((metric) => {
    const vitalsMetric: WebVitalsMetric = {
      name: 'LCP',
      value: metric.value,
      rating: getRating('LCP', metric.value),
      delta: metric.delta,
      id: metric.id,
      navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'navigate'
    };
    sendToAnalytics(vitalsMetric);
  });

  onTTFB((metric) => {
    const vitalsMetric: WebVitalsMetric = {
      name: 'TTFB',
      value: metric.value,
      rating: getRating('TTFB', metric.value),
      delta: metric.delta,
      id: metric.id,
      navigationType: (performance.getEntriesByType('navigation')[0] as any)?.type || 'navigate'
    };
    sendToAnalytics(vitalsMetric);
  });
}

// Helper function to get current vitals summary
export function getVitalsSummary(): Record<string, any> | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const history = JSON.parse(localStorage.getItem('web-vitals-history') || '[]');
    if (history.length === 0) return null;

    // Get latest measurement for each metric
    const latest = history.reduce((acc: Record<string, any>, entry: any) => {
      if (!acc[entry.name] || entry.timestamp > acc[entry.name].timestamp) {
        acc[entry.name] = entry;
      }
      return acc;
    }, {});

    return latest;
  } catch (error) {
    return null;
  }
}

// Enhanced performance observer for additional metrics
export function initPerformanceObserver() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    // Observe long tasks (important for FID)
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          console.warn(`🐌 Long task detected: ${entry.duration}ms`, entry);
        }
      }
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Observe layout shifts
    const layoutShiftObserver = new PerformanceObserver((list) => {
      let cumulativeScore = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cumulativeScore += (entry as any).value;
        }
      }
      if (cumulativeScore > 0.1) {
        console.warn(`📐 Layout shift detected: ${cumulativeScore}`, list.getEntries());
      }
    });
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

  } catch (error) {
    console.warn('Performance Observer not supported or failed to initialize:', error);
  }
}

// Resource loading optimization hints
export function addResourceHints() {
  if (typeof document === 'undefined') return;

  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // DNS prefetch for potential future resources
  const dnsPrefetchDomains = [
    'https://cdnjs.cloudflare.com',
    'https://unpkg.com'
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
}
