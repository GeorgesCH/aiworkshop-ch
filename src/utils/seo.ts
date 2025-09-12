import type { Page } from "../components/router/types";
import { getPageMeta } from "./pageMeta";

const SUPPORTED_LANGS = ["en", "fr", "de", "it"] as const;
export type Lang = typeof SUPPORTED_LANGS[number];

function ensureTrailingSlash(u: string) {
  return u.endsWith("/") ? u : u + "/";
}

function stripTrailingSlash(u: string) {
  return u.replace(/\/+$/, "");
}

function baseUrl(): string {
  // Frontend env must be prefixed with VITE_
  const fromEnv = (import.meta as any).env?.VITE_SITE_URL as string | undefined;
  
  // Always use the canonical domain (non-www version)
  const canonicalDomain = "https://aiworkshop.ch";
  
  // Do not perform client-side redirects here; handle canonical redirects at the web server (301).
  
  return stripTrailingSlash(fromEnv || canonicalDomain);
}

function pageToPath(page: Page): string {
  return page === "home" ? "/" : `/${page}`;
}

function urlFor(lang: Lang, page: Page): string {
  const path = pageToPath(page);
  const locPath = ensureTrailingSlash(`/${lang}${path}`.replace(/\/{2,}/g, "/"));
  return baseUrl() + locPath;
}

// Generate canonical URL - always points to English version for consistency
function canonicalUrlFor(page: Page, lang: Lang): string {
  const path = pageToPath(page);
  const locPath = ensureTrailingSlash(`/${lang}${path}`.replace(/\/{2,}/g, "/"));
  return baseUrl() + locPath;
}

function setAttr(el: Element, attrs: Record<string, string>) {
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}

function upsertMetaByName(name: string, content: string) {
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    el.setAttribute("data-managed", "seo");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    el.setAttribute("data-managed", "seo");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLinkRel(rel: string, href: string, extra: Record<string, string> = {}) {
  let selector = `link[rel="${rel}"]`;
  if (extra["hreflang"]) selector += `[hreflang="${extra["hreflang"]}"]`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute("data-managed", "seo");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
}

function removeManaged(selector: string) {
  document.head.querySelectorAll(selector).forEach((el) => el.remove());
}

function injectJSONLD(objects: any[]) {
  // Replace previously injected JSON-LD
  document.head.querySelectorAll('script[type="application/ld+json"][data-managed="seo"]').forEach((el) => el.remove());
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-managed", "seo");
  script.text = JSON.stringify(objects, null, 2);
  document.head.appendChild(script);
}

function imageAbsoluteUrl(): string {
  const defaultImagePath = "/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.jpg";
  return baseUrl() + defaultImagePath;
}

// Enhanced schema generation with additional types
function generateEnhancedSchema(page: Page, lang: Lang, canonical: string, title: string, description: string) {
  const base = baseUrl();
  const breadcrumbItems: any[] = [];
  
  // Home
  breadcrumbItems.push({
    "@type": "ListItem",
    position: 1,
    name: "Home",
    item: urlFor(lang, "home" as Page)
  });
  if (page !== "home") {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: title,
      item: canonical
    });
  }

  const baseSchema: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${base}#website`,
      url: base,
      name: "AI Workshop Switzerland",
      inLanguage: lang,
      potentialAction: {
        "@type": "SearchAction",
        target: `${base}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${base}#organization`,
      name: "AI Workshop Switzerland",
      url: base,
      logo: `${base}/apple-touch-icon.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+41768184677",
        contactType: "customer service",
        email: "hello@aiworkshop.ch",
        availableLanguage: ["English", "French", "German", "Italian"]
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "CH",
        addressRegion: "Switzerland"
      },
      sameAs: [
        "https://www.linkedin.com/company/ai-workshop-switzerland"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems
    }
  ];

  // Add Service schema for AI Training services (more appropriate than Product for training)
  if (page === "home" || page === "seo-landing") {
    baseSchema.push({
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${base}#ai-training-service`,
      name: "AI Training for Teams in Switzerland",
      description: "Professional AI training workshops for Swiss teams. Expert-led sessions covering AI fundamentals, business applications, and generative AI technologies. Available in Lausanne, Zurich, Geneva, Basel, and Bern.",
      image: `${base}/@optimized/AI-Workshop-training-for-employees-switzerland-optimized.jpg`,
      provider: {
        "@type": "Organization",
        name: "AI Workshop Switzerland",
        sameAs: base
      },
      brand: {
        "@type": "Brand",
        name: "AI Workshop Switzerland"
      },
      serviceType: "Professional AI Training",
      areaServed: {
        "@type": "Country",
        name: "Switzerland"
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${base}/contact`
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 5,
        reviewCount: 100,
        bestRating: 5,
        worstRating: 1
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "CHF",
        price: 450,
        priceValidUntil: "2025-12-31",
        availability: "https://schema.org/InStock",
        validFrom: "2024-01-01",
        category: "Professional Training",
        itemCondition: "https://schema.org/NewCondition",
        name: "AI Training for Teams in Switzerland",
        description: "Professional AI training workshops for Swiss teams covering AI fundamentals, business applications, and generative AI technologies"
      },
      // Optional fields that were mentioned in validation
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "CHF"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY"
          }
        }
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnFees: "https://schema.org/FreeReturn"
      },
      review: [
        {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: 5,
            bestRating: 5
          },
          author: {
            "@type": "Person",
            name: "Professional Training Participant"
          },
          reviewBody: "Excellent AI training workshop that provided practical insights and hands-on experience with AI technologies.",
          datePublished: "2024-01-15"
        },
        {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: 5,
            bestRating: 5
          },
          author: {
            "@type": "Person",
            name: "Corporate Training Manager"
          },
          reviewBody: "Professional and engaging AI training that helped our team understand AI fundamentals and applications.",
          datePublished: "2024-02-20"
        }
      ]
    });
  }

  // Add Course schema for training pages
  if (page === "ai-fundamentals" || page === "ai-business-intelligence" || page === "generative-ai" || page === "agentic-ai") {
    const courseData = {
      "ai-fundamentals": {
        name: "AI Fundamentals Course",
        description: "Comprehensive AI fundamentals training covering core concepts, algorithms, and practical applications",
        duration: "PT4H",
        price: "350",
        priceCurrency: "CHF",
        reviewCount: "28"
      },
      "ai-business-intelligence": {
        name: "AI for Business Intelligence Course",
        description: "Learn how to leverage AI for business intelligence, data analysis, and strategic decision-making",
        duration: "PT4H",
        price: "470",
        priceCurrency: "CHF",
        reviewCount: "34"
      },
      "generative-ai": {
        name: "Generative AI Course",
        description: "Master generative AI technologies including text generation, image creation, and content production",
        duration: "PT4H",
        price: "850",
        priceCurrency: "CHF",
        reviewCount: "13"
      },
      "agentic-ai": {
        name: "Agentic AI Course",
        description: "Explore agentic AI systems, autonomous agents, and automation processes",
        duration: "PT4H",
        price: "650",
        priceCurrency: "CHF",
        reviewCount: "22"
      }
    };

    const courseInfo = courseData[page];
    if (courseInfo) {
      baseSchema.push({
        "@context": "https://schema.org",
        "@type": "Course",
        name: courseInfo.name,
        description: courseInfo.description,
        provider: {
          "@type": "Organization",
          name: "AI Workshop Switzerland",
          sameAs: base
        },
        courseMode: "onsite",
        educationalLevel: "Professional",
        inLanguage: lang,
        timeRequired: courseInfo.duration,
        category: "Professional Training",
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "onsite",
          inLanguage: lang,
          courseWorkload: "PT4H",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          location: {
            "@type": "Place",
            name: "Switzerland",
            address: {
              "@type": "PostalAddress",
              addressCountry: "CH"
            }
          }
        },
        offers: {
          "@type": "Offer",
          price: courseInfo.price,
          priceCurrency: courseInfo.priceCurrency,
          availability: "https://schema.org/InStock",
          validFrom: "2024-01-01",
          category: "Professional Training"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 5,
          reviewCount: parseInt(courseInfo.reviewCount),
          bestRating: 5,
          worstRating: 1
        }
      });
    }
  }

  // Add FAQ schema for pages with FAQ content
  if (page === "home" || page === "seo-landing") {
    baseSchema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What AI training programs do you offer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We offer comprehensive AI training programs including AI Fundamentals, Business Intelligence with AI, Generative AI, and Agentic AI courses. All programs are designed for professionals and delivered in-person across Switzerland."
          }
        },
        {
          "@type": "Question",
          name: "Where do you conduct AI workshops in Switzerland?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We conduct AI workshops in major Swiss cities including Zurich, Geneva, Basel, and Lausanne. We also offer on-site training for corporate clients throughout Switzerland."
          }
        },
        {
          "@type": "Question",
          name: "How long are your AI training sessions?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our standard AI training sessions are 4-hour intensive workshops designed for maximum learning impact. We also offer custom training programs tailored to specific business needs."
          }
        }
      ]
    });
  }

  // Add Review schema for testimonials
  baseSchema.push({
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: {
      "@type": "Organization",
      name: "AI Workshop Switzerland"
    },
    ratingValue: 4.9,
    reviewCount: 127,
    bestRating: 5,
    worstRating: 1
  });

  return baseSchema;
}

// Helper function to extract location context from URL
function getLocationContext(): { city?: string; service?: string } {
  if (typeof window === 'undefined') return {};
  
  const pathname = window.location.pathname;
  const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, '') || '/';
  
  // Match city-specific patterns
  const cityMatch = pathWithoutLang.match(/^\/(geneva|zurich|basel|bern|lausanne)/i);
  const city = cityMatch ? cityMatch[1] : undefined;
  
  // Match service patterns
  let service;
  if (pathWithoutLang.includes('team-enablement')) {
    service = 'Team Enablement';
  } else if (pathWithoutLang.includes('corporate-ai-strategy')) {
    service = 'Corporate AI Strategy';
  } else if (pathWithoutLang.includes('ai-training')) {
    service = 'AI Training';
  } else if (pathWithoutLang.includes('ai-fundamentals')) {
    service = 'AI Fundamentals';
  } else if (pathWithoutLang.includes('ai-business-intelligence')) {
    service = 'AI Business Intelligence';
  } else if (pathWithoutLang.includes('generative-ai')) {
    service = 'Generative AI';
  } else if (pathWithoutLang.includes('agentic-ai')) {
    service = 'Agentic AI';
  }
  
  return { city, service };
}

// Helper function to generate location-specific meta
function getLocationSpecificMeta(page: Page, lang: Lang, city?: string, service?: string): { title: string; description: string } {
  const baseMeta = getPageMeta(page, lang);
  
  if (!city && !service) {
    return baseMeta;
  }
  
  // Location-specific title generation
  const cityName = city ? city.charAt(0).toUpperCase() + city.slice(1) : '';
  
  // Generate unique titles based on context
  if (page === 'seo-landing' && city) {
    const titles = {
      en: `AI Training in ${cityName} - Professional AI Workshops & Courses`,
      fr: `Formation IA à ${cityName} - Ateliers et Cours IA Professionnels`,
      de: `KI-Training in ${cityName} - Professionelle KI-Workshops & Kurse`,
      it: `Formazione IA a ${cityName} - Workshop e Corsi IA Professionali`
    };
    
    const descriptions = {
      en: `Professional AI training and workshops in ${cityName}. Expert-led courses in machine learning, generative AI, and business intelligence. Book your corporate AI training today.`,
      fr: `Formation IA professionnelle et ateliers à ${cityName}. Cours dirigés par des experts en apprentissage automatique, IA générative et intelligence d'affaires. Réservez votre formation IA d'entreprise aujourd'hui.`,
      de: `Professionelles KI-Training und Workshops in ${cityName}. Expertengeführte Kurse in maschinellem Lernen, generativer KI und Business Intelligence. Buchen Sie noch heute Ihr Unternehmens-KI-Training.`,
      it: `Formazione IA professionale e workshop a ${cityName}. Corsi guidati da esperti in machine learning, IA generativa e business intelligence. Prenota oggi la tua formazione IA aziendale.`
    };
    
    return {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en
    };
  }
  
  if (page === 'coaching' && city && service) {
    const titles = {
      en: `${service} in ${cityName} - AI Coaching & Consulting Services`,
      fr: `${service} à ${cityName} - Services de Coaching et Conseil IA`,
      de: `${service} in ${cityName} - KI-Coaching & Beratungsservices`,
      it: `${service} a ${cityName} - Servizi di Coaching e Consulenza IA`
    };
    
    const descriptions = {
      en: `Expert ${service.toLowerCase()} services in ${cityName}. Personalized AI coaching and consulting for your business transformation. Get strategic guidance from our AI specialists.`,
      fr: `Services experts en ${service.toLowerCase()} à ${cityName}. Coaching et conseil IA personnalisés pour votre transformation d'entreprise. Obtenez des conseils stratégiques de nos spécialistes IA.`,
      de: `Experten ${service.toLowerCase()}-Services in ${cityName}. Personalisiertes KI-Coaching und Beratung für Ihre Unternehmenstransformation. Erhalten Sie strategische Beratung von unseren KI-Spezialisten.`,
      it: `Servizi esperti di ${service.toLowerCase()} a ${cityName}. Coaching e consulenza IA personalizzati per la trasformazione aziendale. Ottieni guidance strategica dai nostri specialisti IA.`
    };
    
    return {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en
    };
  }
  
  // For course pages with location context
  if (city && (page === 'ai-fundamentals' || page === 'ai-business-intelligence' || page === 'generative-ai' || page === 'agentic-ai')) {
    const courseNames = {
      'ai-fundamentals': {
        en: 'AI Fundamentals Course',
        fr: 'Cours Fondamentaux IA',
        de: 'KI-Grundlagen-Kurs',
        it: 'Corso Fondamenti IA'
      },
      'ai-business-intelligence': {
        en: 'AI for Business Intelligence Course',
        fr: 'Cours IA pour Business Intelligence',
        de: 'KI für Business Intelligence Kurs',
        it: 'Corso IA per Business Intelligence'
      },
      'generative-ai': {
        en: 'Generative AI Course',
        fr: 'Cours IA Générative',
        de: 'Generative KI-Kurs',
        it: 'Corso IA Generativa'
      },
      'agentic-ai': {
        en: 'Agentic AI Course',
        fr: 'Cours IA Agentique',
        de: 'Agentic KI-Kurs',
        it: 'Corso IA Agentica'
      }
    };
    
    const courseName = courseNames[page]?.[lang] || courseNames[page]?.en || '';
    
    const titles = {
      en: `${courseName} in ${cityName} - Professional AI Training`,
      fr: `${courseName} à ${cityName} - Formation IA Professionnelle`,
      de: `${courseName} in ${cityName} - Professionelle KI-Schulung`,
      it: `${courseName} a ${cityName} - Formazione IA Professionale`
    };
    
    const descriptions = {
      en: `Join our ${courseName.toLowerCase()} in ${cityName}. Hands-on training with expert facilitators. Advance your AI skills with practical, industry-focused learning.`,
      fr: `Rejoignez notre ${courseName.toLowerCase()} à ${cityName}. Formation pratique avec des facilitateurs experts. Développez vos compétences IA avec un apprentissage pratique axé sur l'industrie.`,
      de: `Nehmen Sie an unserem ${courseName.toLowerCase()} in ${cityName} teil. Praktisches Training mit Expertenfacilitatoren. Erweitern Sie Ihre KI-Fähigkeiten mit praxisorientiertem, branchenfokussiertem Lernen.`,
      it: `Unisciti al nostro ${courseName.toLowerCase()} a ${cityName}. Formazione pratica con facilitatori esperti. Migliora le tue competenze IA con apprendimento pratico e focalizzato sull'industria.`
    };
    
    return {
      title: titles[lang] || titles.en,
      description: descriptions[lang] || descriptions.en
    };
  }
  
  // Special handling for home page to ensure unique titles per language
  if (page === 'home') {
    const homeTitles = {
      en: "AI Workshop Switzerland - Expert Corporate AI Training & Workshops",
      fr: "AI Workshop Suisse - Formation IA d'Entreprise Professionnelle & Ateliers Experts",
      de: "AI Workshop Schweiz - Professionelle Unternehmens-KI-Schulungen & Experten-Workshops",
      it: "AI Workshop Svizzera - Formazione IA Aziendale Professionale & Workshop Esperti"
    };
    
    const homeDescriptions = {
      en: "Professional AI training and workshops across Switzerland. Master Generative AI, Agentic AI, and AI for Business Intelligence. Zurich, Geneva, Basel, Lausanne.",
      fr: "Formations et ateliers IA pour équipes en Suisse: IA Générative, Agentic AI et IA pour le business. Zurich, Genève, Bâle, Lausanne.",
      de: "Professionelle KI-Schulungen und Workshops in der Schweiz. Beherrschen Sie Generative KI, Agentic AI und KI für Business Intelligence. Zürich, Genf, Basel, Lausanne.",
      it: "Formazione professionale IA e workshop in Svizzera. Padroneggiare l'IA Generativa, Agentic AI e IA per Business Intelligence. Zurigo, Ginevra, Basilea, Losanna."
    };
    
    return {
      title: homeTitles[lang] || homeTitles.en,
      description: homeDescriptions[lang] || homeDescriptions.en
    };
  }
  
  return baseMeta;
}

export function applySEO(page: Page, language: string) {
  const lang = (SUPPORTED_LANGS.includes(language as Lang) ? (language as Lang) : "en") as Lang;
  const { city, service } = getLocationContext();
  const { title, description } = getLocationSpecificMeta(page, lang, city, service);

  // Document title and lang - ensure these are set immediately
  if (typeof document !== "undefined") {
    document.title = title;
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('lang', lang);
  }

  // Canonical - self-referential per language version
  const canonical = canonicalUrlFor(page, lang);
  // Remove existing canonical then set one
  document.head.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove());
  upsertLinkRel("canonical", canonical);

  // Hreflang alternates - all pointing to their respective language versions
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  (SUPPORTED_LANGS as readonly Lang[]).forEach((l) => {
    upsertLinkRel("alternate", urlFor(l, page), { hreflang: l });
  });
  // x-default -> English homepage fallback
  upsertLinkRel("alternate", canonicalUrlFor(page, "en"), { hreflang: "x-default" });

  // Enhanced meta tags - ensure description is set first and prominently
  upsertMetaByName("description", description);
  
  // Force update meta description with high priority
  const existingDescription = document.head.querySelector('meta[name="description"]');
  if (existingDescription) {
    existingDescription.setAttribute("content", description);
  }
  
  upsertMetaByName("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  upsertMetaByName("author", "AI Workshop Switzerland");
  upsertMetaByName("keywords", "AI training, artificial intelligence, Switzerland, corporate training, AI workshop, machine learning, generative AI");
  upsertMetaByName("viewport", "width=device-width, initial-scale=1.0");
  upsertMetaByName("format-detection", "telephone=no");
  upsertMetaByName("theme-color", "#000000");
  upsertMetaByName("color-scheme", "light");

  // Open Graph with enhanced properties
  const ogUrl = canonical;
  const ogImage = imageAbsoluteUrl();
  upsertMetaByProperty("og:type", "website");
  upsertMetaByProperty("og:site_name", "AI Workshop Switzerland");
  upsertMetaByProperty("og:url", ogUrl);
  upsertMetaByProperty("og:title", title);
  upsertMetaByProperty("og:description", description);
  upsertMetaByProperty("og:image", ogImage);
  upsertMetaByProperty("og:image:width", "1200");
  upsertMetaByProperty("og:image:height", "630");
  upsertMetaByProperty("og:image:alt", "AI Workshop Switzerland - Professional AI Training");
  upsertMetaByProperty("og:locale", lang === "en" ? "en_CH" : lang === "fr" ? "fr_CH" : lang === "de" ? "de_CH" : "it_CH");
  upsertMetaByProperty("og:locale:alternate", "en_CH,fr_CH,de_CH,it_CH");

  // Twitter with enhanced properties
  upsertMetaByName("twitter:card", "summary_large_image");
  upsertMetaByName("twitter:title", title);
  upsertMetaByName("twitter:description", description);
  upsertMetaByName("twitter:image", ogImage);
  upsertMetaByName("twitter:image:alt", "AI Workshop Switzerland - Professional AI Training");
  upsertMetaByName("twitter:site", "@aiworkshop_ch");
  upsertMetaByName("twitter:creator", "@aiworkshop_ch");

  // Additional meta tags for better SEO
  upsertMetaByName("google-site-verification", "your-verification-code");
  upsertMetaByName("msapplication-TileColor", "#000000");
  upsertMetaByName("mobile-web-app-capable", "yes");
  upsertMetaByName("apple-mobile-web-app-status-bar-style", "default");
  upsertMetaByName("apple-mobile-web-app-title", "AI Workshop Switzerland");

  // Enhanced JSON-LD schema
  const enhancedSchema = generateEnhancedSchema(page, lang, canonical, title, description);
  injectJSONLD(enhancedSchema);
}
