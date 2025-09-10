// Accessibility and SEO enhancement utilities

export interface AccessibilityEnhancement {
  element: HTMLElement;
  enhancement: string;
  impact: 'high' | 'medium' | 'low';
}

// ARIA enhancements for better accessibility and SEO
export function enhanceARIAAttributes() {
  if (typeof document === 'undefined') return;

  // Add skip navigation link if not present
  if (!document.querySelector('[data-skip-link]')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded';
    skipLink.setAttribute('data-skip-link', 'true');
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Enhance form labels and descriptions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (label && !input.getAttribute('aria-labelledby')) {
          const labelId = label.id || `label-${input.id}`;
          label.id = labelId;
          input.setAttribute('aria-labelledby', labelId);
        }
      }

      // Add required indication
      if (input.hasAttribute('required') && !input.getAttribute('aria-required')) {
        input.setAttribute('aria-required', 'true');
      }
    });
  });

  // Enhance navigation landmarks
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });

  // Enhance headings hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    
    // Check for skipped heading levels, but be more lenient for certain contexts
    const isInCard = heading.closest('[data-slot="card"]');
    const isInTestimonial = heading.closest('.testimonial, [class*="testimonial"]');
    const isInContactInfo = heading.closest('.contact-info, [class*="contact"]');
    
    // Only warn about skipped levels if it's not in a card, testimonial, or contact info context
    if (currentLevel > lastLevel + 1 && lastLevel > 0 && !isInCard && !isInTestimonial && !isInContactInfo) {
      console.warn(`Heading hierarchy issue: skipped from h${lastLevel} to h${currentLevel}`, heading);
    }
    
    lastLevel = currentLevel;
  });
}

// Focus management for better keyboard navigation
export function enhanceFocusManagement() {
  if (typeof document === 'undefined') return;

  // Add focus indicators to interactive elements without them
  const interactiveElements = document.querySelectorAll(
    'button, [role="button"], a, input, textarea, select, [tabindex]'
  );

  interactiveElements.forEach(element => {
    if (!element.classList.contains('focus:outline-none') && 
        !(element as HTMLElement).style.outline && 
        !getComputedStyle(element).outline) {
      element.classList.add('focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2');
    }
  });

  // Manage focus trapping in modals
  const modals = document.querySelectorAll('[role="dialog"], .modal');
  modals.forEach(modal => {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      modal.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });
    }
  });
}

// Color contrast and readability enhancements
export function enhanceReadability() {
  if (typeof document === 'undefined') return;

  // Check for potential contrast issues
  const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
  
  textElements.forEach(element => {
    const styles = getComputedStyle(element);
    const fontSize = parseInt(styles.fontSize);
    
    // Skip accessibility warnings for badges, decorative elements, and social media links
    const isBadge = element.hasAttribute('data-slot') && element.getAttribute('data-slot') === 'badge';
    const isSocialLink = element.closest('a[aria-label*="LinkedIn"], a[aria-label*="Instagram"], a[aria-label*="YouTube"]');
    const isDecorative = element.classList.contains('sr-only') || 
                        element.getAttribute('aria-hidden') === 'true' ||
                        element.closest('[aria-hidden="true"]');
    
    // Skip warnings for specific UI elements that commonly use small text
    const isSmallTextElement = element.classList.contains('text-xs') || 
                              element.classList.contains('text-sm') ||
                              element.closest('.badge, .tag, .chip, .label, .meta, .timestamp, .caption') ||
                              element.closest('[data-slot="badge"]') ||
                              element.closest('[data-slot="tag"]') ||
                              element.closest('[data-slot="meta"]') ||
                              element.closest('button[class*="text-xs"]') ||
                              element.closest('span[class*="text-xs"]') ||
                              element.closest('p[class*="text-xs"]') ||
                              // Skip spans with relative positioning (often decorative)
                              (element.tagName === 'SPAN' && element.classList.contains('relative')) ||
                              // Skip spans inside buttons or interactive elements
                              element.closest('button, [role="button"], a, [data-slot="button"]') ||
                              // Skip spans with z-index (often overlay elements)
                              (element.tagName === 'SPAN' && element.classList.contains('z-10'));
    
    // Flag potentially too small text (but not for badges, decorative elements, or UI elements)
    if (fontSize < 14 && !isBadge && !isSocialLink && !isDecorative && !isSmallTextElement) {
      console.warn('Text may be too small for accessibility:', element, `${fontSize}px`);
    }
    
    // Add high contrast class for very light text
    if (styles.color === 'rgb(255, 255, 255)' || styles.opacity === '0.5') {
      element.classList.add('text-contrast-enhanced');
    }
  });
}

// Semantic HTML structure validation
export function validateSemanticStructure(): AccessibilityEnhancement[] {
  if (typeof document === 'undefined') return [];

  const issues: AccessibilityEnhancement[] = [];

  // Check for main landmark
  if (!document.querySelector('main, [role="main"]')) {
    const mainContent = document.querySelector('.main-content, #main-content, #content');
    if (mainContent) {
      issues.push({
        element: mainContent as HTMLElement,
        enhancement: 'Add main landmark role or use <main> element',
        impact: 'high'
      });
    }
  }

  // Check for page structure
  const h1Elements = document.querySelectorAll('h1');
  if (h1Elements.length === 0) {
    // Only warn if there's no H1 in the main content area
    const mainContent = document.querySelector('main, [role="main"], .main-content, #main-content');
    if (!mainContent || !mainContent.querySelector('h1')) {
      issues.push({
        element: document.body,
        enhancement: 'Add H1 heading for main page title',
        impact: 'high'
      });
    }
  } else if (h1Elements.length > 1) {
    h1Elements.forEach((h1, index) => {
      if (index > 0) {
        issues.push({
          element: h1 as HTMLElement,
          enhancement: 'Multiple H1 elements found - consider using H2-H6',
          impact: 'medium'
        });
      }
    });
  }

  // Check for image alt text
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      issues.push({
        element: img,
        enhancement: 'Add descriptive alt text or aria-hidden if decorative',
        impact: 'high'
      });
    }
  });

  // Check for form labels
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea');
  inputs.forEach(input => {
    const hasLabel = document.querySelector(`label[for="${input.id}"]`) ||
                    input.getAttribute('aria-label') ||
                    input.getAttribute('aria-labelledby');
    
    if (!hasLabel) {
      issues.push({
        element: input as HTMLElement,
        enhancement: 'Add label or aria-label for form input',
        impact: 'high'
      });
    }
  });

  return issues;
}

// Language and internationalization enhancements
export function enhanceInternationalization() {
  if (typeof document === 'undefined') return;

  // Ensure lang attribute is set
  if (!document.documentElement.lang) {
    document.documentElement.lang = 'en';
  }

  // Add lang attributes to content in different languages
  const elements = document.querySelectorAll('[data-lang]');
  elements.forEach(element => {
    const lang = element.getAttribute('data-lang');
    if (lang && !element.getAttribute('lang')) {
      element.setAttribute('lang', lang);
    }
  });

  // Enhance direction for RTL languages
  const rtlElements = document.querySelectorAll('[data-rtl]');
  rtlElements.forEach(element => {
    element.setAttribute('dir', 'rtl');
  });
}

// Performance-related accessibility enhancements
export function enhancePerformanceAccessibility() {
  if (typeof document === 'undefined') return;

  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion');
    
    // Disable CSS animations
    const style = document.createElement('style');
    style.textContent = `
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Add loading indicators for async content
  const asyncContainers = document.querySelectorAll('[data-async-loading]');
  asyncContainers.forEach(container => {
    if (!container.querySelector('[role="status"]')) {
      const loadingIndicator = document.createElement('div');
      loadingIndicator.setAttribute('role', 'status');
      loadingIndicator.setAttribute('aria-live', 'polite');
      loadingIndicator.className = 'sr-only';
      loadingIndicator.textContent = 'Loading content...';
      container.appendChild(loadingIndicator);
    }
  });
}

// Initialize all accessibility enhancements
export function initAccessibilityEnhancements() {
  if (typeof document === 'undefined') return;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Add a small delay to ensure all components are rendered
      setTimeout(runEnhancements, 100);
    });
  } else {
    // Add a small delay to ensure all components are rendered
    setTimeout(runEnhancements, 100);
  }
}

// Debounce function to prevent multiple rapid checks
let enhancementTimeout: NodeJS.Timeout | null = null;

function runEnhancements() {
  // Clear any existing timeout
  if (enhancementTimeout) {
    clearTimeout(enhancementTimeout);
  }
  
  // Debounce the enhancement checks
  enhancementTimeout = setTimeout(() => {
    // Use requestIdleCallback for better performance if available
    const runEnhancements = () => {
      enhanceARIAAttributes();
      enhanceFocusManagement();
      enhanceReadability();
      enhanceInternationalization();
      enhancePerformanceAccessibility();

      // Log validation results in development
      if (process.env.NODE_ENV === 'development') {
        const issues = validateSemanticStructure();
        if (issues.length > 0) {
          console.group('🔍 Accessibility & SEO Issues Found:');
          issues.forEach(issue => {
            console.warn(`${issue.impact.toUpperCase()}: ${issue.enhancement}`, issue.element);
          });
          console.groupEnd();
        } else {
          console.log('✅ No major accessibility issues detected');
        }
      }
    };

    // Use requestIdleCallback if available, otherwise use setTimeout
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(runEnhancements, { timeout: 100 });
    } else {
      runEnhancements();
    }
  }, 50);
}
