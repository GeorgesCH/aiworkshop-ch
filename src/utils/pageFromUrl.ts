import type { Page } from "../components/router/types";

export function getPageFromUrl(pathname?: string): Page {
  let path: string;
  
  if (pathname) {
    path = pathname;
  } else if (typeof window !== 'undefined') {
    path = window.location.pathname;
  } else {
    return "home"; // Server-side default
  }
  
  // Debug logging for the original path (development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 getPageFromUrl - Original path:', path);
  }
  
  // Check for discovery call URLs FIRST - before any other processing
  if (path.includes('/booking-calendar/discovery-call')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ DIRECT MATCH: /booking-calendar/discovery-call found in path -> returning discovery-call');
    }
    return "discovery-call";
  }
  
  // Also check for discovery call with language prefix
  if (path.includes('/en/booking-calendar/discovery-call') || 
      path.includes('/fr/booking-calendar/discovery-call') || 
      path.includes('/de/booking-calendar/discovery-call') || 
      path.includes('/it/booking-calendar/discovery-call')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ LANGUAGE PREFIX MATCH: /{lang}/booking-calendar/discovery-call found in path -> returning discovery-call');
    }
    return "discovery-call";
  }
  
  // Remove language prefix (e.g., /en, /fr, /de, /it)
  const pathWithoutLang = path.replace(/^\/[a-z]{2}/, '') || '/';
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 getPageFromUrl - Path without language:', pathWithoutLang);
  }

  // Remove courses prefix (e.g., /courses/)
  const pathWithoutCourses = pathWithoutLang.replace(/^\/courses/, '') || '/';
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 getPageFromUrl - Path without courses prefix:', pathWithoutCourses);
  }
  
  // Remove trailing slash and normalize
  const normalizedPath = pathWithoutCourses.replace(/\/$/, '') || '/';
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 getPageFromUrl - Normalized path:', normalizedPath);
  }
  
  // Check normalized path for discovery call
  if (normalizedPath === '/booking-calendar/discovery-call') {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ NORMALIZED MATCH: /booking-calendar/discovery-call -> returning discovery-call');
    }
    return "discovery-call";
  }
  
  // Check if the path contains the discovery call pattern anywhere
  if (normalizedPath.includes('booking-calendar') && normalizedPath.includes('discovery-call')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ PATTERN MATCH: booking-calendar + discovery-call found -> returning discovery-call');
    }
    return "discovery-call";
  }
  
  // Map URL paths to page types
  if (normalizedPath === '/' || normalizedPath === '') return "home";
  if (normalizedPath === '/about') return "about";
  if (normalizedPath === '/contact') return "contact";
  if (normalizedPath === '/coaching') return "coaching";
  if (normalizedPath === '/learn') return "learn";
  if (normalizedPath === '/learn-ai-overview') return "learn-ai-overview";
  if (normalizedPath === '/learn-intelligence') return "learn-intelligence";
  if (normalizedPath === '/learn-machine-learning') return "learn-machine-learning";
  if (normalizedPath === '/learn-deep-learning') return "learn-deep-learning";
  if (normalizedPath === '/learn-neural-networks') return "learn-neural-networks";
  if (normalizedPath === '/learn-foundation-models') return "learn-foundation-models";
  if (normalizedPath === '/learn-generative-ai') return "learn-generative-ai";
  if (normalizedPath === '/learn-llm-players') return "learn-llm-players";
  if (normalizedPath === '/learn-ai-tools') return "learn-ai-tools";
  if (normalizedPath === '/learn-ai-tools-directory') return "learn-ai-tools-directory";
  if (normalizedPath === '/learn-interactive-exercises') return "learn-interactive-exercises";
  if (normalizedPath === '/assessment') return "assessment";
  if (normalizedPath === '/workshop-booking') return "workshop-booking";
  if (normalizedPath === '/discovery-call') return "discovery-call";
  if (normalizedPath === '/ai-fundamentals') return "ai-fundamentals";
  if (normalizedPath === '/ai-business-intelligence') return "ai-business-intelligence";
  if (normalizedPath === '/generative-ai') return "generative-ai";
  if (normalizedPath === '/agentic-ai') return "agentic-ai";
  if (normalizedPath === '/seo-landing') return "seo-landing";
  if (normalizedPath === '/admin') return "admin";
  
  // Handle dynamic URLs that should redirect to appropriate pages
  // City-specific URLs should redirect to seo-landing or home
  if (normalizedPath.match(/^\/(geneva|zurich|basel|bern|lausanne)\/?$/)) {
    return "seo-landing";
  }
  
  // Course-specific URLs with cities should redirect to the course page
  if (normalizedPath.match(/^\/(geneva|zurich|basel|bern|lausanne)\/(ai-fundamentals|ai-business-intelligence|generative-ai|agentic-ai)\/?$/)) {
    const courseMatch = normalizedPath.match(/\/(ai-fundamentals|ai-business-intelligence|generative-ai|agentic-ai)/);
    if (courseMatch) {
      return courseMatch[1] as Page;
    }
  }
  
  // Team enablement and corporate strategy should redirect to coaching
  if (normalizedPath.match(/^\/(geneva|zurich|basel|bern|lausanne)\/(team-enablement|corporate-ai-strategy|ai-training)\/?$/)) {
    return "coaching";
  }
  
  // Final check - if we still haven't found a match, log it and return not-found
  if (process.env.NODE_ENV === 'development') {
    console.log('❌ NO MATCH FOUND for path:', path, '-> returning not-found');
  }
  return "not-found";
}
