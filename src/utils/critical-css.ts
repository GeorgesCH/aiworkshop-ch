// Critical CSS extraction and optimization utilities

export const criticalCSS = `
/* Critical above-the-fold styles */
* {
  box-sizing: border-box;
}

html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  background: white;
  color: #1d1d1f;
  overflow-x: hidden;
}

.min-h-screen {
  min-height: 100vh;
}

.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}



/* Critical hero section styles */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* Critical typography */
.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
  margin-bottom: 1rem;
  color: #1d1d1f;
}

/* Critical button styles */
.btn-primary {
  background-color: #dc143c;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  background-color: #b81234;
  transform: translateY(-1px);
}

/* Loading spinner */
.loading-spinner {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid rgba(220, 20, 60, 0.3);
  border-radius: 50%;
  border-top-color: #dc143c;
  animation: spin 1s ease-in-out infinite;
}

/* Prevent layout shift for images */
img {
  max-width: 100%;
  height: auto;
}

/* Critical accessibility styles */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

*:focus-visible {
  outline: 2px solid #dc143c;
  outline-offset: 2px;
}

/* High contrast text for accessibility */
.text-high-contrast {
  color: #000000;
}

.bg-high-contrast {
  background-color: #ffffff;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Critical responsive utilities */
@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
    padding: 20px;
  }
  
  .btn-primary {
    padding: 10px 20px;
    font-size: 14px;
  }
}
`;

export const loadNonCriticalCSS = () => {
  // Load non-critical CSS after page load
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/css/index-CxuIHlqM.css';
  link.media = 'print';
  link.onload = () => {
    link.media = 'all';
  };
  document.head.appendChild(link);
};

export const preloadCriticalResources = () => {
  // Preload critical resources
  const resources = [
    { href: '/fonts/sigum/Sigum.woff2', as: 'font', type: 'font/woff2' },
    { href: '/hero-dots.png', as: 'image' },
    { href: '/body-noise-effect.svg', as: 'image' },
    { href: '/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.webp', as: 'image' }
  ];

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) {
      link.type = resource.type;
    }
    if (resource.as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};
