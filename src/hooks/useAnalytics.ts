import { useEffect, useRef, useCallback } from 'react';
import { 
  trackButtonClick, 
  trackNavigation, 
  trackVideoInteraction, 
  trackFormInteraction,
  trackScrollDepth,
  trackTimeOnPage,
  trackExternalLink,
  trackDownload,
  trackEngagement,
  trackConversion,
  trackError
} from '../utils/analytics';

interface UseAnalyticsOptions {
  page: string;
  trackScroll?: boolean;
  trackTime?: boolean;
  trackEngagementMetrics?: boolean;
}

/**
 * Comprehensive analytics hook for tracking user interactions
 */
export function useAnalytics(options: UseAnalyticsOptions) {
  const { page, trackScroll = true, trackTime = true, trackEngagementMetrics = true } = options;
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);

  // Track session start
  useEffect(() => {
    if (trackEngagementMetrics) {
      trackEngagement('session_start');
    }
    return () => {
      if (trackEngagementMetrics) {
        trackEngagement('session_end');
      }
    };
  }, [trackEngagementMetrics]);

  // Track time on page
  useEffect(() => {
    if (!trackTime) return;

    const startTime = Date.now();
    startTimeRef.current = startTime;

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 0) {
        trackTimeOnPage(timeSpent, page);
      }
    };
  }, [page, trackTime]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScroll) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      // Track milestone scroll depths (25%, 50%, 75%, 100%)
      if (scrollPercent >= 25 && maxScrollDepthRef.current < 25) {
        trackScrollDepth(25, page);
        maxScrollDepthRef.current = 25;
      } else if (scrollPercent >= 50 && maxScrollDepthRef.current < 50) {
        trackScrollDepth(50, page);
        maxScrollDepthRef.current = 50;
      } else if (scrollPercent >= 75 && maxScrollDepthRef.current < 75) {
        trackScrollDepth(75, page);
        maxScrollDepthRef.current = 75;
      } else if (scrollPercent >= 100 && maxScrollDepthRef.current < 100) {
        trackScrollDepth(100, page);
        maxScrollDepthRef.current = 100;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, trackScroll]);

  // Analytics helper functions
  const trackClick = useCallback((buttonName: string, location: string) => {
    trackButtonClick(buttonName, location, page);
  }, [page]);

  const trackNav = useCallback((to: string, method: 'click' | 'back' | 'forward' = 'click') => {
    trackNavigation(page, to, method);
  }, [page]);

  const trackVideo = useCallback((action: 'play' | 'pause' | 'complete', videoTitle: string, duration?: number) => {
    trackVideoInteraction(action, videoTitle, duration);
  }, []);

  const trackForm = useCallback((formName: string, action: 'started' | 'field_focus' | 'field_blur' | 'completed' | 'abandoned', fieldName?: string) => {
    trackFormInteraction(formName, action, fieldName);
  }, []);

  const trackLink = useCallback((url: string, linkText: string) => {
    trackExternalLink(url, linkText, page);
  }, [page]);

  const trackFileDownload = useCallback((fileName: string, fileType: string) => {
    trackDownload(fileName, fileType, page);
  }, [page]);

  const trackConv = useCallback((conversionType: 'workshop_booking' | 'discovery_call' | 'newsletter_signup' | 'contact_form', value?: number, currency?: string) => {
    trackConversion(conversionType, value, currency);
  }, []);

  const trackErr = useCallback((errorType: string, errorMessage: string) => {
    trackError(errorType, errorMessage, page);
  }, [page]);

  return {
    trackClick,
    trackNav,
    trackVideo,
    trackForm,
    trackLink,
    trackFileDownload,
    trackConversion: trackConv,
    trackError: trackErr,
  };
}

/**
 * Hook for tracking form interactions
 */
export function useFormAnalytics(formName: string, page: string) {
  const trackForm = useCallback((action: 'started' | 'field_focus' | 'field_blur' | 'completed' | 'abandoned', fieldName?: string) => {
    trackFormInteraction(formName, action, fieldName);
  }, [formName]);

  const trackFieldFocus = useCallback((fieldName: string) => {
    trackForm('field_focus', fieldName);
  }, [trackForm]);

  const trackFieldBlur = useCallback((fieldName: string) => {
    trackForm('field_blur', fieldName);
  }, [trackForm]);

  const trackFormStart = useCallback(() => {
    trackForm('started');
  }, [trackForm]);

  const trackFormComplete = useCallback(() => {
    trackForm('completed');
  }, [trackForm]);

  const trackFormAbandon = useCallback(() => {
    trackForm('abandoned');
  }, [trackForm]);

  return {
    trackFieldFocus,
    trackFieldBlur,
    trackFormStart,
    trackFormComplete,
    trackFormAbandon,
  };
}

/**
 * Hook for tracking video interactions
 */
export function useVideoAnalytics(videoTitle: string) {
  const trackPlay = useCallback(() => {
    trackVideoInteraction('play', videoTitle);
  }, [videoTitle]);

  const trackPause = useCallback(() => {
    trackVideoInteraction('pause', videoTitle);
  }, [videoTitle]);

  const trackComplete = useCallback((duration?: number) => {
    trackVideoInteraction('complete', videoTitle, duration);
  }, [videoTitle]);

  return {
    trackPlay,
    trackPause,
    trackComplete,
  };
}
