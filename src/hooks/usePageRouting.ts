import { useState, useEffect } from "react";
import type { Page } from "../components/router/types";
import { getPageFromUrl } from "../utils/pageFromUrl";
import { trackEnhancedPageView, initializeGA, getPageTitle, trackNavigation } from "../utils/analytics";

export function usePageRouting(language: string, initialPage?: Page) {
  // Use the initial page if provided (from server context), otherwise detect from URL
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (initialPage) return initialPage;
    return getPageFromUrl();
  });

  // Initialize Google Analytics - deferred to avoid blocking LCP
  useEffect(() => {
    // Defer GA initialization to avoid blocking LCP
    setTimeout(() => {
      initializeGA();
    }, 2000);
  }, []);

  // Track page view whenever currentPage changes - deferred to avoid blocking LCP
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 usePageRouting - currentPage state changed to:', currentPage);
    }
    if (currentPage) {
      // Defer analytics tracking to avoid blocking LCP
      setTimeout(() => {
        const pageTitle = getPageTitle(currentPage, language);
        trackEnhancedPageView(currentPage, pageTitle, undefined, {
          language,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        });
      }, 1000);
    }
  }, [currentPage, language]);

  useEffect(() => {
    // Only set from URL if no initial page was provided (client-side navigation)
    if (!initialPage) {
      const newPage = getPageFromUrl();
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 usePageRouting - Initial page detection:', newPage);
      }
      setCurrentPage(newPage);
    }
    
    // Update page when URL changes (browser back/forward)
    const handlePopState = () => {
      const newPage = getPageFromUrl();
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 usePageRouting - PopState detected, new page:', newPage);
      }
      setCurrentPage(newPage);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialPage]);

  // Temporarily disable this effect to test if it's causing conflicts
  // useEffect(() => {
  //   const handleUrlChange = () => {
  //     const newPage = getPageFromUrl();
  //     console.log('🔧 usePageRouting - URL change detected, new page:', newPage);
  //     if (newPage !== currentPage) {
  //       console.log('🔧 usePageRouting - Page changed from', currentPage, 'to', newPage);
  //       setCurrentPage(newPage);
  //     }
  //   };

  //   // Listen for URL changes (this might be triggered by other navigation methods)
  //   window.addEventListener('popstate', handleUrlChange);
    
  //   return () => window.removeEventListener('popstate', handleUrlChange);
  // }, [currentPage]);

  const handlePageChange = (page: Page) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('handlePageChange called with:', page);
      console.log('Current page before change:', currentPage);
      console.log('Language:', language);
    }
    
    // Track navigation
    trackNavigation(currentPage, page, 'click');
    
    let path: string;
    
    // Special handling for discovery call page
    if (page === "discovery-call") {
      path = "/booking-calendar/discovery-call";
    } else {
      path = page === "home" ? "/" : `/${page}`;
    }
    
    const fullPath = `/${language}${path}`;
    if (process.env.NODE_ENV === 'development') {
      console.log('Setting URL to:', fullPath);
    }
    
    // Update the current page state FIRST
    if (process.env.NODE_ENV === 'development') {
      console.log('Setting current page to:', page);
    }
    setCurrentPage(page);
    
    // Then update URL without page reload using History API
    window.history.pushState({}, '', fullPath);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('handlePageChange completed');
    }
  };

  return {
    currentPage,
    handlePageChange
  };
}
