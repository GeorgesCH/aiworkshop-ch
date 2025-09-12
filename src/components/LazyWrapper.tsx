import React, { useEffect, useRef, useState, Suspense } from 'react';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export function LazyWrapper({
  children,
  fallback = <div className="animate-pulse bg-gray-200 rounded h-32"></div>,
  rootMargin = '50px',
  threshold = 0.1,
  className = '',
}: LazyWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use requestIdleCallback to defer intersection observer creation
    const createObserver = () => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            observer.disconnect();
          }
        },
        {
          rootMargin,
          threshold,
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return observer;
    };

    let observer: IntersectionObserver;
    
    if ('requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        observer = createObserver();
      }, { timeout: 100 });
      
      return () => {
        window.cancelIdleCallback(idleCallback);
        observer?.disconnect();
      };
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => {
        observer = createObserver();
      }, 0);
      
      return () => {
        clearTimeout(timer);
        observer?.disconnect();
      };
    }
  }, [hasLoaded, rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

// Hook for lazy loading
export function useLazyLoad(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasLoaded, options]);

  return { ref, isVisible, hasLoaded };
}
