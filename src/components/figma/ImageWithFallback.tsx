import React, { useState, useRef, useEffect } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Optional src is re-declared to satisfy strict TS in some setups */
  src?: string;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Enable lazy loading (default: true for images below fold) */
  lazy?: boolean;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Responsive image sizes */
  sizes?: string;
  /** WebP support */
  webpSrc?: string;
  /** Placeholder for LCP optimization */
  placeholder?: string;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [triedFallback, setTriedFallback] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const { 
    fallbackSrc, 
    lazy = true, 
    priority = false, 
    sizes = "100vw",
    webpSrc,
    placeholder,
    ...imgProps 
  } = props

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before image comes into view
        threshold: 0.01
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, priority])

  const handleError = () => {
    if (!didError && fallbackSrc && !triedFallback) {
      setTriedFallback(true)
    } else {
      setDidError(true)
    }
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const currentSrc = triedFallback && fallbackSrc ? fallbackSrc : imgProps.src
  const shouldLoad = isInView || priority

  // Enhanced loading attributes for Core Web Vitals
  const loading = priority ? "eager" : lazy ? "lazy" : "eager"
  const fetchPriority = priority ? "high" : "auto"

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${imgProps.className ?? ''}`}
      style={imgProps.style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img 
          src={ERROR_IMG_SRC} 
          alt="Error loading image" 
          {...imgProps} 
          data-original-url={imgProps.src}
          loading="eager"
          fetchpriority="low"
        />
      </div>
    </div>
  ) : (
    <div className={`relative ${imgProps.className ?? ''}`} style={imgProps.style}>
      {/* Placeholder for LCP optimization */}
      {placeholder && !isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}
      
      {/* WebP source with fallback */}
      {webpSrc && shouldLoad && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      
      <img
        {...imgProps}
        ref={imgRef}
        src={shouldLoad ? currentSrc : placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMGYwZjAiLz48L3N2Zz4='}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
        fetchpriority={fetchPriority}
        sizes={sizes}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgProps.className ?? ''}`}
        style={{
          ...imgProps.style,
          width: '100%',
          height: 'auto'
        }}
      />
    </div>
  )
}
