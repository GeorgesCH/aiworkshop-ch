/**
 * Google Analytics utilities for tracking page views and events
 */

import type { Page } from "../components/router/types";

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Get a human-readable page title for a given page and language
 */
export const getPageTitle = (page: Page, language: string = 'en'): string => {
  const titles: Record<Page, Record<string, string>> = {
    home: {
      en: 'AI Workshop Switzerland - Expert Corporate AI Training & Workshops',
      fr: 'AI Workshop Suisse - Formation IA d\'entreprise et ateliers experts',
      de: 'AI Workshop Schweiz - Experten-KI-Schulungen und Workshops für Unternehmen',
      it: 'AI Workshop Svizzera - Formazione aziendale IA e workshop esperti'
    },
    about: {
      en: 'About Us - AI Workshop Switzerland',
      fr: 'À propos - AI Workshop Suisse',
      de: 'Über uns - AI Workshop Schweiz',
      it: 'Chi siamo - AI Workshop Svizzera'
    },
    contact: {
      en: 'Contact - AI Workshop Switzerland',
      fr: 'Contact - AI Workshop Suisse',
      de: 'Kontakt - AI Workshop Schweiz',
      it: 'Contatto - AI Workshop Svizzera'
    },
    learn: {
      en: 'Learn AI - AI Workshop Switzerland',
      fr: 'Apprendre l\'IA - AI Workshop Suisse',
      de: 'KI lernen - AI Workshop Schweiz',
      it: 'Impara l\'IA - AI Workshop Svizzera'
    },
    coaching: {
      en: 'AI Coaching - AI Workshop Switzerland',
      fr: 'Coaching IA - AI Workshop Suisse',
      de: 'KI-Coaching - AI Workshop Schweiz',
      it: 'Coaching IA - AI Workshop Svizzera'
    },
    assessment: {
      en: 'AI Assessment - AI Workshop Switzerland',
      fr: 'Évaluation IA - AI Workshop Suisse',
      de: 'KI-Bewertung - AI Workshop Schweiz',
      it: 'Valutazione IA - AI Workshop Svizzera'
    },
    'workshop-booking': {
      en: 'Book Workshop - AI Workshop Switzerland',
      fr: 'Réserver un atelier - AI Workshop Suisse',
      de: 'Workshop buchen - AI Workshop Schweiz',
      it: 'Prenota workshop - AI Workshop Svizzera'
    },
    'discovery-call': {
      en: 'Book Discovery Call - AI Workshop Switzerland',
      fr: 'Réserver un appel de découverte - AI Workshop Suisse',
      de: 'Entdeckungsgespräch buchen - AI Workshop Schweiz',
      it: 'Prenota chiamata di scoperta - AI Workshop Svizzera'
    }
  };

  // Default title for unknown pages
  const defaultTitle = `${page} - AI Workshop Switzerland`;
  
  return titles[page as keyof typeof titles]?.[language] || 
         titles[page as keyof typeof titles]?.['en'] || 
         defaultTitle;
};

/**
 * Initialize Google Analytics (already loaded via script tag in HTML)
 */
export const initializeGA = () => {
  // GA is already initialized via the script tag in HTML
  // This function can be used for any additional setup if needed
  if (typeof window !== 'undefined' && window.gtag) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Google Analytics initialized');
    }
  }
};

/**
 * Track a page view
 * @param page - The page identifier (e.g., 'home', 'about', 'learn')
 * @param title - Optional page title
 * @param url - Optional page URL (defaults to current location)
 */
export const trackPageView = (page: string, title?: string, url?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const pageTitle = title || `AI Workshop - ${page}`;
    const pageUrl = url || window.location.href;
    
    window.gtag('config', 'G-NDY4DP6BME', {
      page_title: pageTitle,
      page_location: pageUrl,
    });

    // Also track as a custom event for better analytics
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: pageUrl,
      page_path: `/${page}`,
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`GA: Page view tracked for ${page}`, { title: pageTitle, url: pageUrl });
    }
  }
};

/**
 * Track a custom event
 * @param eventName - The name of the event
 * @param parameters - Additional event parameters
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    if (process.env.NODE_ENV === 'development') {
      console.log(`GA: Event tracked: ${eventName}`, parameters);
    }
  }
};

/**
 * Track workshop booking interactions
 */
export const trackWorkshopBooking = (action: 'started' | 'completed' | 'abandoned', workshopType?: string) => {
  trackEvent('workshop_booking', {
    action,
    workshop_type: workshopType,
  });
};

/**
 * Track learning interactions
 */
export const trackLearningActivity = (activity: string, topic?: string) => {
  trackEvent('learning_activity', {
    activity,
    topic,
  });
};

/**
 * Track assessment interactions
 */
export const trackAssessment = (action: 'started' | 'completed' | 'question_answered', questionNumber?: number) => {
  trackEvent('assessment', {
    action,
    question_number: questionNumber,
  });
};

/**
 * Track contact form interactions
 */
export const trackContactForm = (action: 'started' | 'completed' | 'abandoned') => {
  trackEvent('contact_form', {
    action,
  });
};

/**
 * Track button clicks and CTA interactions
 */
export const trackButtonClick = (buttonName: string, location: string, page?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    location,
    page: page || window.location.pathname,
  });
};

/**
 * Track navigation interactions
 */
export const trackNavigation = (from: string, to: string, method: 'click' | 'back' | 'forward') => {
  trackEvent('navigation', {
    from_page: from,
    to_page: to,
    navigation_method: method,
  });
};

/**
 * Track video interactions
 */
export const trackVideoInteraction = (action: 'play' | 'pause' | 'complete', videoTitle: string, duration?: number) => {
  trackEvent('video_interaction', {
    action,
    video_title: videoTitle,
    duration,
  });
};

/**
 * Track form interactions
 */
export const trackFormInteraction = (formName: string, action: 'started' | 'field_focus' | 'field_blur' | 'completed' | 'abandoned', fieldName?: string) => {
  trackEvent('form_interaction', {
    form_name: formName,
    action,
    field_name: fieldName,
  });
};

/**
 * Track search interactions
 */
export const trackSearch = (searchTerm: string, resultsCount?: number, category?: string) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
    category,
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (depth: number, page: string) => {
  trackEvent('scroll_depth', {
    depth_percentage: depth,
    page,
  });
};

/**
 * Track time on page
 */
export const trackTimeOnPage = (timeInSeconds: number, page: string) => {
  trackEvent('time_on_page', {
    time_seconds: timeInSeconds,
    page,
  });
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (url: string, linkText: string, page: string) => {
  trackEvent('external_link_click', {
    destination_url: url,
    link_text: linkText,
    source_page: page,
  });
};

/**
 * Track file downloads
 */
export const trackDownload = (fileName: string, fileType: string, page: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    file_type: fileType,
    source_page: page,
  });
};

/**
 * Track user engagement metrics
 */
export const trackEngagement = (metric: 'session_start' | 'session_end' | 'bounce' | 'return_visitor', value?: number) => {
  trackEvent('engagement', {
    metric,
    value,
  });
};

/**
 * Track conversion events
 */
export const trackConversion = (conversionType: 'workshop_booking' | 'discovery_call' | 'newsletter_signup' | 'contact_form', value?: number, currency?: string) => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value,
    currency: currency || 'CHF',
  });
};

/**
 * Track error events
 */
export const trackError = (errorType: string, errorMessage: string, page: string) => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    page,
  });
};

/**
 * Enhanced page view tracking with additional context
 */
export const trackEnhancedPageView = (page: string, title?: string, url?: string, additionalData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const pageTitle = title || `AI Workshop - ${page}`;
    const pageUrl = url || window.location.href;
    
    // Standard page view
    window.gtag('config', 'G-NDY4DP6BME', {
      page_title: pageTitle,
      page_location: pageUrl,
    });

    // Enhanced page view event with additional context
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: pageUrl,
      page_path: `/${page}`,
      ...additionalData,
    });

    // Track page load time
    if (typeof performance !== 'undefined' && performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      window.gtag('event', 'page_load_time', {
        page,
        load_time_ms: loadTime,
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`GA: Enhanced page view tracked for ${page}`, { title: pageTitle, url: pageUrl, additionalData });
    }
  }
};
