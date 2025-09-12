#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const BASE_URL = process.env.SITE_URL || 'https://aiworkshop.ch';
const languages = ['en', 'fr', 'de', 'it'];

// Routes to prerender (must match app routes)
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

// Minimal meta map (English authoritative; other langs fall back if missing)
const meta = {
  en: {
    '/': {
      title: 'AI Workshop Switzerland - Expert Corporate AI Training & Workshops',
      description: 'Professional AI training and workshops across Switzerland. Master Generative AI, Agentic AI, and AI for Business Intelligence. Zurich, Geneva, Basel, Lausanne.'
    },
    '/about': {
      title: 'About Us — AI Workshop Switzerland',
      description: 'Learn about our expert AI facilitators and our mission to empower Swiss businesses with cutting-edge AI skills and practical training programs.'
    },
    '/contact': {
      title: 'Contact Us — AI Workshop Switzerland',
      description: 'Get in touch for corporate AI training inquiries. Book workshops and training sessions for your team in Zurich, Geneva, Basel, and Lausanne.'
    },
    '/coaching': {
      title: 'AI Coaching & Consulting - Personalized AI Strategy & Implementation Support',
      description: 'Expert AI coaching services for businesses. Get personalized guidance on AI strategy, tool selection, and implementation roadmaps tailored to your organization.'
    },
    '/develop': {
      title: 'Develop — AI Tools, Platforms & Apps',
      description: 'Design and build AI-driven web apps, admin dashboards, and mobile apps with Swiss-quality delivery. Get an instant estimate and 4-month milestone plan.'
    },
    '/learn': {
      title: 'Learn AI — Comprehensive AI Education Platform',
      description: 'Interactive AI learning platform covering fundamentals, machine learning, deep learning, generative AI, and business intelligence applications.'
    },
    '/learn-ai-overview': {
      title: 'AI Overview — Understanding Artificial Intelligence',
      description: 'Comprehensive overview of artificial intelligence concepts, applications, and future trends. Perfect starting point for your AI journey.'
    },
    '/learn-intelligence': {
      title: 'AI & Intelligence — Exploring Machine Intelligence',
      description: 'Deep dive into artificial intelligence and machine intelligence concepts, from basic principles to advanced applications.'
    },
    '/learn-machine-learning': {
      title: 'Machine Learning — Algorithms & Applications',
      description: 'Learn machine learning algorithms, supervised and unsupervised learning, model training, and real-world applications.'
    },
    '/learn-deep-learning': {
      title: 'Deep Learning — Neural Networks & AI',
      description: 'Master deep learning concepts including neural networks, convolutional networks, and advanced AI architectures.'
    },
    '/learn-neural-networks': {
      title: 'Neural Networks — Building AI Systems',
      description: 'Comprehensive guide to neural networks, from basic perceptrons to complex multi-layer architectures and their applications.'
    },
    '/learn-foundation-models': {
      title: 'Foundation Models — Large Language Models & AI',
      description: "Explore foundation models, large language models (LLMs), and how they're revolutionizing AI applications across industries."
    },
    '/learn-generative-ai': {
      title: 'Generative AI — Creating with Artificial Intelligence',
      description: 'Learn about generative AI technologies including ChatGPT, DALL-E, and other AI-powered content creation tools.'
    },
    '/learn-llm-players': {
      title: 'LLM Players — Major AI Companies & Models',
      description: 'Overview of major players in the large language model space, including OpenAI, Google, Anthropic, and emerging competitors.'
    },
    '/learn-ai-tools': {
      title: 'AI Tools — Essential Software for AI Work',
      description: 'Discover essential AI tools and software for development, deployment, and integration of artificial intelligence solutions.'
    },
    '/learn-ai-tools-directory': {
      title: 'AI Tools Directory — Comprehensive AI Software Guide',
      description: 'Complete directory of AI tools, platforms, and software solutions for businesses and developers across all industries.'
    },
    '/learn-interactive-exercises': {
      title: 'Interactive AI Exercises — Hands-on AI Learning',
      description: 'Practice AI concepts with interactive exercises and practical examples. Build real AI applications and test your knowledge.'
    },
    '/assessment': {
      title: 'AI Skills Assessment — Evaluate Your AI Knowledge',
      description: 'Comprehensive AI skills assessment to evaluate your current knowledge and identify areas for improvement in artificial intelligence.'
    },
    '/workshop-booking': {
      title: 'Book AI Workshop — Corporate AI Training & Workshops',
      description: 'Book your corporate AI training workshop. Choose from AI Fundamentals, Business Intelligence, Generative AI, and Agentic AI courses in Switzerland.'
    },
    '/discovery-call': {
      title: 'Book Discovery Call — Free AI Consultation',
      description: 'Schedule a free discovery call with our AI experts. Get personalized advice on AI strategy, implementation, and training for your business in Switzerland.'
    },
    '/booking-calendar/discovery-call': {
      title: 'Book Discovery Call — Free AI Consultation',
      description: 'Schedule a free discovery call with our AI experts. Get personalized advice on AI strategy, implementation, and training for your business in Switzerland.'
    },
    '/ai-fundamentals': {
      title: 'AI Fundamentals Course — Master AI Basics',
      description: 'Comprehensive AI fundamentals training covering core concepts, algorithms, and practical applications for beginners and professionals.'
    },
    '/ai-business-intelligence': {
      title: 'AI for Business Intelligence — Transform Your Data',
      description: 'Learn how to leverage AI for business intelligence, data analysis, predictive modeling, and strategic decision-making.'
    },
    '/generative-ai': {
      title: 'Generative AI Course — Create with AI',
      description: 'Master generative AI technologies including text generation, image creation, and content production with cutting-edge AI tools.'
    },
    '/agentic-ai': {
      title: 'Agentic AI — Autonomous AI Systems',
      description: 'Explore agentic AI systems, autonomous agents, and how they are transforming automation and decision-making processes.'
    },
    '/seo-landing': {
      title: 'AI Training in Zurich — Professional AI Workshops',
      description: 'Professional AI training and workshops in Zurich. Master Generative AI, Machine Learning, and Business Intelligence with expert facilitators.'
    }
  }
};

function getMeta(lang, route) {
  const m = meta[lang]?.[route] || meta.en[route] || meta.en['/'];
  return m;
}

function ensureTrailingSlash(u) {
  return u.endsWith('/') ? u : u + '/';
}

function buildHreflangCluster(route) {
  const baseNoSlash = BASE_URL.replace(/\/+$/, '');
  const lines = languages.map((l) => {
    const p = ensureTrailingSlash(`/${l}${route}`.replace(/\/{2,}/g, '/'));
    return `<link rel="alternate" hreflang="${l}" href="${baseNoSlash}${p}" />`;
  });
  const xDefault = ensureTrailingSlash(`/en${route}`.replace(/\/{2,}/g, '/'));
  lines.push(`<link rel="alternate" hreflang="x-default" href="${baseNoSlash}${xDefault}" />`);
  return lines.join('\n      ');
}


async function prerender() {
  const projectRoot = process.cwd();
  // Prefer built template if available
  const builtTplPath = path.join(projectRoot, 'deploy', 'index.html');
  const devTplPath = path.join(projectRoot, 'index.html');
  const templatePath = await fs
    .access(builtTplPath).then(() => builtTplPath)
    .catch(() => devTplPath);
  const tpl = await fs.readFile(templatePath, 'utf8');

  for (const lang of languages) {
    for (const route of routes) {
      const outDir = path.join(projectRoot, 'public', lang, route === '/' ? '' : route).replace(/\/$/, '');
      const outPath = path.join(outDir, 'index.html');

      const { title, description } = getMeta(lang, route);
      const canonical = BASE_URL.replace(/\/+$/, '') + ensureTrailingSlash(`/${lang}${route}`.replace(/\/{2,}/g, '/'));
      const hreflangs = buildHreflangCluster(route);

      let html = tpl;
      html = html.replace(/<html lang=\"[a-zA-Z-]+\">/, `<html lang="${lang}">`);
      html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
      html = html.replace(/<meta name=\"description\" content=\"[\s\S]*?\" \/>/, `<meta name="description" content="${description}" />`);

      // Canonical
      html = html.replace(/<link rel=\"canonical\" href=\"[\s\S]*?\" \/>/, `<link rel="canonical" href="${canonical}" />`);

      // Hreflang cluster
      html = html.replace(/<link rel=\"alternate\" hreflang=\"en\"[\s\S]*?<link rel=\"alternate\" hreflang=\"x-default\"[\s\S]*?\/>/, `${hreflangs}`);

      // Open Graph
      html = html.replace(/<meta property=\"og:title\" content=\"[\s\S]*?\" \/>/, `<meta property="og:title" content="${title}" />`);
      html = html.replace(/<meta property=\"og:description\" content=\"[\s\S]*?\" \/>/, `<meta property="og:description" content="${description}" />`);
      html = html.replace(/<meta property=\"og:url\" content=\"[\s\S]*?\" \/>/, `<meta property="og:url" content="${canonical}" />`);

      // Twitter
      html = html.replace(/<meta name=\"twitter:title\" content=\"[\s\S]*?\" \/>/, `<meta name="twitter:title" content="${title}" />`);
      html = html.replace(/<meta name=\"twitter:description\" content=\"[\s\S]*?\" \/>/, `<meta name="twitter:description" content="${description}" />`);

      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(outPath, html, 'utf8');
      console.log(`Prerendered: ${path.relative(projectRoot, outPath)}`);
    }
  }
}

prerender().catch((e) => {
  console.error('Prerender failed:', e);
  process.exit(1);
});
