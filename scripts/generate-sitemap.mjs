#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const languages = ['en', 'fr', 'de', 'it'];
const BASE_URL = process.env.SITE_URL || 'https://aiworkshop.ch';

// SPA routes - these match the Page type in src/components/router/types.ts
const routes = [
  '/',
  '/about',
  '/contact', 
  '/coaching',
  '/learn',
  '/learn-ai-overview',
  '/learn-intelligence',
  '/learn-machine-learning',
  '/learn-deep-learning',
  '/learn-neural-networks',
  '/learn-foundation-models',
  '/learn-generative-ai',
  '/learn-llm-players',
  '/learn-ai-tools',
  '/learn-ai-tools-directory',
  '/learn-interactive-exercises',
  '/assessment',
  '/workshop-booking',
  '/discovery-call',
  '/booking-calendar/discovery-call',
  '/ai-fundamentals',
  '/ai-business-intelligence',
  '/generative-ai',
  '/agentic-ai',
  '/seo-landing'
];

// Enhanced route metadata for better SEO
const routeMetadata = {
  '/': { priority: '1.0', changefreq: 'daily', images: ['/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.webp'] },
  '/about': { priority: '0.8', changefreq: 'weekly', images: ['/@optimized/aiworkshop-facilitator-expert-optimized.webp'] },
  '/contact': { priority: '0.8', changefreq: 'weekly', images: [] },
  '/coaching': { priority: '0.9', changefreq: 'weekly', images: ['/@optimized/aiworkshop-design-thinking-lausanne-optimized.webp'] },
  '/learn': { priority: '0.9', changefreq: 'weekly', images: ['/@optimized/aiworkshop-participants-learning-optimized.webp'] },
  '/workshop-booking': { priority: '0.9', changefreq: 'weekly', images: ['/@optimized/aiworkshop-team-collaboration-optimized.webp'] },
  '/discovery-call': { priority: '0.9', changefreq: 'weekly', images: ['/@optimized/aiworkshop-facilitator-expert-optimized.webp'] },
  '/ai-fundamentals': { priority: '0.9', changefreq: 'weekly', images: ['/@optimized/aiworkshop-fundamentals-course-optimized.webp'] },
  '/ai-business-intelligence': { priority: '0.9', changefreq: 'weekly', images: ['/@optimized/aiworkshop-business-intelligence-training-optimized.webp'] },
  '/generative-ai': { priority: '0.9', changefreq: 'weekly', images: ['/@optimized/aiworkshop-generative-ai-training-optimized.webp'] },
  '/agentic-ai': { priority: '0.9', changefreq: 'weekly', images: ['/@optimized/aiworkshop-team-collaboration-optimized.webp'] },
  '/seo-landing': { priority: '0.8', changefreq: 'weekly', images: ['/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.webp'] }
};

function ensureTrailingSlash(u) {
  return u.endsWith('/') ? u : u + '/';
}

async function main() {
  const projectRoot = process.cwd();
  const publicDir = path.join(projectRoot, 'public');
  const lastmod = new Date().toISOString();

  // Build XML
  const urls = [];
  const baseNoSlash = BASE_URL.replace(/\/+$/, '');

  for (const route of routes) {
    const normalizedRoute = route === '/' ? '/' : route;
    const metadata = routeMetadata[normalizedRoute] || { priority: '0.7', changefreq: 'monthly', images: [] };
    
    // Create entries for each language
    for (const lang of languages) {
      const locPath = ensureTrailingSlash(`/${lang}${normalizedRoute}`.replace(/\/{2,}/g, '/'));
      const loc = `${baseNoSlash}${locPath}`;

      const altLinks = languages
        .map((l) => {
          const p = ensureTrailingSlash(`/${l}${normalizedRoute}`.replace(/\/{2,}/g, '/'));
          return `      <xhtml:link rel="alternate" hreflang="${l}" href="${baseNoSlash}${p}" />`;
        })
        .join('\n');
      
      const xDefaultPath = ensureTrailingSlash(`/en${normalizedRoute}`.replace(/\/{2,}/g, '/'));
      const xDefault = `      <xhtml:link rel="alternate" hreflang="x-default" href="${baseNoSlash}${xDefaultPath}" />`;

      // Add image sitemap entries
      const imageEntries = metadata.images.map(img => 
        `      <image:image>
        <image:loc>${baseNoSlash}${img}</image:loc>
        <image:title>AI Workshop Switzerland - Professional AI Training</image:title>
        <image:caption>Professional AI training and workshops in Switzerland</image:caption>
      </image:image>`
      ).join('\n');

      const imageNamespace = metadata.images.length > 0 ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : '';

      urls.push(
`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${metadata.changefreq}</changefreq>
    <priority>${metadata.priority}</priority>
${altLinks}
${xDefault}${imageEntries ? '\n' + imageEntries : ''}
  </url>`
      );
    }
  }

  const imageNamespace = ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"${imageNamespace}>
${urls.join('\n')}
</urlset>\n`;

  await fs.mkdir(publicDir, { recursive: true });
  const outPath = path.join(publicDir, 'sitemap.xml');
  await fs.writeFile(outPath, xml, 'utf8');
  console.log(`Generated enhanced sitemap with ${urls.length} URLs -> ${path.relative(projectRoot, outPath)}`);
  
  // Generate robots.txt with enhanced directives
  const robotsTxt = `# robots.txt for aiworkshop.ch
User-agent: *
Allow: /

# Explicit allow for major AI/LLM crawlers
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: CCBot
Allow: /

# Disallow build artifacts and non-public paths (safety, though not served)
Disallow: /dist/
Disallow: /node_modules/
Disallow: /src/

# Allow important directories
Allow: /@optimized/
Allow: /fonts/
Allow: /assets/

# Crawl delay for respectful crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Host directive
Host: ${BASE_URL}
`;

  const robotsPath = path.join(publicDir, 'robots.txt');
  await fs.writeFile(robotsPath, robotsTxt, 'utf8');
  console.log(`Generated enhanced robots.txt -> ${path.relative(projectRoot, robotsPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
