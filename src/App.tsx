import React, { Suspense, lazy, useMemo } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider, useLanguage } from "./components/LanguageProvider";
import { FirebaseAuthProvider } from "./components/FirebaseAuthProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { usePageRouting } from "./hooks/usePageRouting";
import { SEOHead } from "./components/SEOHead";
import type { Page } from "./components/router/types";
import { initializeGA } from "./utils/analytics";

// Lazy load all heavy components to reduce initial bundle size
const Header = lazy(() => import("./components/Header").then(module => ({ default: module.Header })));
const Footer = lazy(() => import("./components/Footer").then(module => ({ default: module.Footer })));
const PageRouter = lazy(() => import("./components/router/PageRouter").then(module => ({ default: module.PageRouter })));
const Toaster = lazy(() => import("./components/ui/sonner").then(module => ({ default: module.Toaster })));

// Ultra-lazy load non-critical components
const AnalyticsDashboard = lazy(() => import("./components/AnalyticsDashboard").then(module => ({ default: module.AnalyticsDashboard })));

// Lazy load performance utilities to avoid blocking initial render
// Defer performance monitoring initialization

function AppContent() {
  const { language } = useLanguage();
  const { currentPage, handlePageChange } = usePageRouting(language);
  
  // Memoize expensive computations
  const isAdminPage = useMemo(() => currentPage === "admin", [currentPage]);
  
  // Defer non-critical initialization to avoid blocking initial render
  React.useEffect(() => {
    // Use requestIdleCallback to defer non-critical initialization
    const initNonCritical = async () => {
      try {
        // Initialize Google Analytics (already deferred in HTML)
        // initializeGA();
        
        // Initialize performance monitoring with additional delay (after LCP)
        setTimeout(async () => {
          const performanceModule = await import("./utils/performance");
          performanceModule.initPerformanceMonitoring();
        }, 3000);
        
        // Initialize Web Vitals tracking with additional delay (after LCP)
        setTimeout(async () => {
          const webVitalsModule = await import("./utils/web-vitals");
          webVitalsModule.initWebVitals();
        }, 4000);
        
        // Initialize comprehensive SEO optimizer with additional delay (after LCP)
        setTimeout(async () => {
          const seoModule = await import("./utils/seo-optimizer");
          const seoOptimizer = seoModule.initSEOOptimizer({
            enableWebVitals: false, // Disable to reduce initial load
            enableAccessibility: true,
            enableImageOptimization: false, // Disable to reduce initial load
            enablePerformanceMonitoring: false // Disable to reduce initial load
          });
        }, 5000);
      } catch (error) {
        console.warn('Failed to initialize non-critical features:', error);
      }
    };
    
    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(initNonCritical, { timeout: 5000 });
    } else {
      setTimeout(initNonCritical, 500);
    }
    
    // Mark when app is ready for LCP measurement
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark('app-content-rendered');
    }
  }, []);

  // Update SEO when page or language changes (debounced)
  React.useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        const seoModule = await import("./utils/seo-optimizer");
        const seoOptimizer = seoModule.initSEOOptimizer();
        seoOptimizer.updatePage(currentPage, language);
      } catch (error) {
        console.warn('Failed to load SEO optimizer:', error);
      }
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [currentPage, language]);

  return (
    <div className={`min-h-screen antialiased ${isAdminPage ? '' : 'bg-[url(\'/body-noise-effect.svg\')] bg-center bg-repeat bg-fixed'}`}>
      {/* Apply SEO tags for current page & language */}
      <SEOHead page={currentPage} language={language} />
      
      {/* Only show header and footer for non-admin pages */}
      {!isAdminPage && (
        <>
          <Suspense fallback={
            <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </header>
          }>
            <Header currentPage={currentPage} onPageChange={(page: string) => handlePageChange(page as Page)} />
          </Suspense>
          <div className="transition-all duration-300 ease-in-out">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="loading-spinner"></div>
              </div>
            }>
              <PageRouter currentPage={currentPage} setCurrentPage={(page: string) => handlePageChange(page as Page)} />
            </Suspense>
          </div>
          <Suspense fallback={
            <footer className="h-32 bg-gray-50 border-t border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </footer>
          }>
            <Footer onPageChange={(page: string) => handlePageChange(page as Page)} />
          </Suspense>
        </>
      )}
      
      {/* Admin page renders without header/footer */}
      {isAdminPage && (
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="loading-spinner"></div>
          </div>
        }>
          <PageRouter currentPage={currentPage} setCurrentPage={(page: string) => handlePageChange(page as Page)} />
        </Suspense>
      )}
      
      <Suspense fallback={<div />}>
        <Toaster />
      </Suspense>
      
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="ai-workshop-theme">
        <LanguageProvider>
          <FirebaseAuthProvider>
            <AppContent />
          </FirebaseAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
