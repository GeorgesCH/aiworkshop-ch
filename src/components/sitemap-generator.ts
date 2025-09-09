// Sitemap Generator for SEO Landing Pages

import { generateAllSEOPageCombinations, generatePageSlug, type SEOPageParams } from './seo-utils';

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// Generate sitemap entries for all SEO landing pages
export function generateSEOSitemap(baseUrl: string = 'https://aiworkshop.ch'): SitemapEntry[] {
  const combinations = generateAllSEOPageCombinations();
  const currentDate = new Date().toISOString().split('T')[0];
  const languages = ['en', 'fr', 'de', 'it'];

  const sitemapEntries: SitemapEntry[] = [];

  // Generate entries for each language
  languages.forEach(lang => {
    const langPrefix = lang === 'en' ? '' : `/${lang}`;

    // Main pages for each language
    sitemapEntries.push(
      {
        url: `${baseUrl}${langPrefix}/`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 1.0
      },
      {
        url: `${baseUrl}${langPrefix}/ai-fundamentals`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.9
      },
      {
        url: `${baseUrl}${langPrefix}/ai-business-intelligence`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.9
      },
      {
        url: `${baseUrl}${langPrefix}/generative-ai`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.9
      },
      {
        url: `${baseUrl}${langPrefix}/coaching`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        url: `${baseUrl}${langPrefix}/about`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        url: `${baseUrl}${langPrefix}/contact`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        url: `${baseUrl}${langPrefix}/learn`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.8
      }
    );

    // Add SEO landing page entries for each language
    combinations.forEach(combo => {
      const slug = generatePageSlug(combo);
      sitemapEntries.push({
        url: `${baseUrl}${langPrefix}/${slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      });
    });
  });

  return sitemapEntries;
}

// Generate XML sitemap
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urls = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

  return `${xmlHeader}\n${urlsetOpen}${urls}\n${urlsetClose}`;
}

// Generate robots.txt content
export function generateRobotsTxt(baseUrl: string = 'https://aiworkshop.ch'): string {
  return `User-agent: *
Allow: /

# Multilingual Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-seo.xml

# Language-specific sitemaps
Sitemap: ${baseUrl}/en/sitemap.xml
Sitemap: ${baseUrl}/fr/sitemap.xml
Sitemap: ${baseUrl}/de/sitemap.xml
Sitemap: ${baseUrl}/it/sitemap.xml

# Block admin/development pages
Disallow: /admin
Disallow: /dev
Disallow: /_next
Disallow: /api

# Allow all AI training related pages
Allow: /ai-*
Allow: /zurich/*
Allow: /geneva/*
Allow: /basel/*
Allow: /bern/*
Allow: /lausanne/*`;
}

// Generate meta tags for programmatic SEO with language support
export function generateMetaTags(params: SEOPageParams, lang: string = 'en'): Record<string, string> {
  const { city, service, industry } = params;

  const localeMap = {
    en: 'en_CH',
    fr: 'fr_CH',
    de: 'de_CH',
    it: 'it_CH'
  };

  const currentLocale = localeMap[lang as keyof typeof localeMap] || 'en_CH';

  return {
    'title': `${service} in ${city} | AI Workshop Switzerland`,
    'description': `Expert ${service.toLowerCase()} for ${industry.toLowerCase()} teams in ${city}. Swiss-quality AI education with hands-on workshops and certification. Book consultation today.`,
    'keywords': `${service.toLowerCase()}, ${city.toLowerCase()}, switzerland, artificial intelligence, ${industry.toLowerCase()}, corporate training, professional development, AI workshop`,
    'og:title': `Professional ${service} Training in ${city}`,
    'og:description': `Transform your ${industry.toLowerCase()} team with expert ${service.toLowerCase()} in ${city}. Swiss-designed AI workshops for professionals.`,
    'og:type': 'website',
    'og:locale': currentLocale,
    'og:locale:alternate': 'en_CH,fr_CH,de_CH,it_CH',
    'twitter:card': 'summary_large_image',
    'twitter:title': `${service} in ${city} | AI Workshop Switzerland`,
    'twitter:description': `Expert ${service.toLowerCase()} for ${industry.toLowerCase()} teams in ${city}. Book your consultation today.`,
    'geo.region': 'CH',
    'geo.placename': city,
    'geo.position': getCoordinatesForCity(city),
    'ICBM': getCoordinatesForCity(city)
  };
}

// Helper function to get coordinates for Swiss cities (simplified)
function getCoordinatesForCity(city: string): string {
  const coordinates: Record<string, string> = {
    'Zurich': '47.3769;8.5417',
    'Geneva': '46.2044;6.1432',
    'Basel': '47.5596;7.5886',
    'Bern': '46.9481;7.4474',
    'Lausanne': '46.5197;6.6323',
    'Winterthur': '47.5034;8.7240',
    'Lucerne': '47.0502;8.3093',
    'St. Gallen': '47.4245;9.3767',
    'Lugano': '46.0037;8.9511',
    'Biel/Bienne': '47.1368;7.2476'
  };
  
  return coordinates[city] || '46.8182;8.2275'; // Default to center of Switzerland
}

// Generate canonical URL with language support
export function generateCanonicalUrl(params: SEOPageParams, baseUrl: string = 'https://aiworkshop.ch', lang: string = 'en'): string {
  const slug = generatePageSlug(params);
  const langPrefix = lang === 'en' ? '' : `/${lang}`;
  return `${baseUrl}${langPrefix}/${slug}`;
}

// Priority calculator for different page types
export function calculateSEOPriority(params: SEOPageParams): number {
  const { city, service, industry } = params;
  
  let priority = 0.5; // Base priority
  
  // Major cities get higher priority
  const majorCities = ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'];
  if (majorCities.includes(city)) {
    priority += 0.2;
  }
  
  // Primary services get higher priority
  const primaryServices = ['AI Training', 'ChatGPT Training', 'AI Fundamentals Training'];
  if (primaryServices.includes(service)) {
    priority += 0.15;
  }
  
  // Business and Technology industries get higher priority
  if (['Business', 'Technology', 'Finance'].includes(industry)) {
    priority += 0.1;
  }
  
  return Math.min(priority, 0.9); // Cap at 0.9 (reserve 1.0 for homepage)
}

// Generate hreflang tags for multilingual SEO
export function generateHreflangTags(params: SEOPageParams, baseUrl: string = 'https://aiworkshop.ch'): Record<string, string> {
  const slug = generatePageSlug(params);

  return {
    'x-default': `${baseUrl}/en/${slug}`,
    'en': `${baseUrl}/en/${slug}`,
    'fr': `${baseUrl}/fr/${slug}`,
    'de': `${baseUrl}/de/${slug}`,
    'it': `${baseUrl}/it/${slug}`
  };
}