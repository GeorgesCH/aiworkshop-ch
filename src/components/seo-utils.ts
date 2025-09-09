// SEO Landing Page Utilities for Programmatic SEO

export interface SEOPageParams {
  city: string;
  service: string;
  industry: string;
}

export interface SEOPageData {
  title: string;
  description: string;
  keywords: string;
  h1: string;
  breadcrumbs: string[];
  canonicalUrl?: string;
}

// Swiss Cities for SEO Pages
export const swissCities = [
  'Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 
  'Lucerne', 'St. Gallen', 'Lugano', 'Biel/Bienne', 'Thun', 
  'Köniz', 'La Chaux-de-Fonds', 'Schaffhausen', 'Fribourg',
  'Chur', 'Neuchâtel', 'Uster', 'Sion', 'Emmen'
];

// AI Services for SEO Pages
export const aiServices = [
  'AI Training',
  'AI Fundamentals Training', 
  'ChatGPT Training',
  'Generative AI Training',
  'Machine Learning Training',
  'AI Business Intelligence Training',
  'AI Strategy Consulting',
  'Prompt Engineering Training',
  'AI Workshop',
  'Corporate AI Training'
];

// Industries for SEO Pages
export const industries = [
  'Business',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Technology',
  'Consulting',
  'Retail',
  'Insurance',
  'Government',
  'Education',
  'Real Estate',
  'Legal Services'
];

// Generate SEO-optimized content
export function generateSEOPageData(params: SEOPageParams): SEOPageData {
  const { city, service, industry } = params;
  
  return {
    title: `${service} in ${city} | Professional AI Workshop Switzerland`,
    description: `Expert ${service.toLowerCase()} for ${industry.toLowerCase()} teams in ${city}. Swiss-quality AI education with hands-on workshops and certification. Book your consultation today.`,
    keywords: `${service.toLowerCase()}, ${city.toLowerCase()}, switzerland, artificial intelligence, ${industry.toLowerCase()}, corporate training, professional development`,
    h1: `Professional ${service} in ${city}`,
    breadcrumbs: ['AI Workshop Switzerland', city, service],
    canonicalUrl: `https://aiworkshop.ch/${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${service.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
  };
}

// Generate FAQ content based on location and service
export function generateLocalizedFAQs(city: string, service: string) {
  return [
    {
      question: `What makes ${service} in ${city} different from online courses?`,
      answer: `Our ${city}-based ${service} offers hands-on, interactive workshops specifically designed for Swiss business culture and regulations. You'll work with real local case studies and network with other ${city} professionals, ensuring practical application in your local market context.`
    },
    {
      question: `How long does the ${service} program in ${city} take?`,
      answer: `Our ${service} programs in ${city} range from 4-hour intensive workshops to multi-day comprehensive training series. We offer flexible scheduling to accommodate ${city} business hours and can customize duration based on your team's specific needs and availability.`
    },
    {
      question: `Do you provide on-site ${service} training in ${city}?`,
      answer: `Yes, we offer on-site ${service} training at your ${city} location. We bring all necessary equipment and materials, and can adapt our training setup to your office space. This is particularly popular with larger teams in the ${city} area.`
    },
    {
      question: `What certification do participants receive after ${service} training?`,
      answer: `All participants receive official completion certificates for our ${service} programs. These certificates are recognized by Swiss business associations and can be used for professional development records, HR documentation, and career advancement in the ${city} market.`
    },
    {
      question: `What is the cost of ${service} training in ${city}?`,
      answer: `Our ${service} training costs vary depending on the program complexity and group size. We offer competitive rates for ${city} businesses, with discounts available for larger teams. Contact us for a customized quote based on your specific requirements.`
    }
  ];
}

// Generate localized benefits based on city and service
export function generateLocalizedBenefits(city: string, service: string, industry: string) {
  return [
    {
      title: `Tailored for ${city} ${industry} Professionals`,
      description: `Our ${service.toLowerCase()} programs are specifically designed for ${city}-based ${industry.toLowerCase()} companies, incorporating local market insights and regulatory considerations.`
    },
    {
      title: `Expert-Led Training by Swiss Certified Instructors`,
      description: `Learn from certified AI specialists with proven experience in ${industry.toLowerCase()} applications and deep understanding of the ${city} business landscape.`
    },
    {
      title: `Measurable ROI for ${city} Businesses`,
      description: `Track your team's progress with concrete skills assessment and ROI measurement tools specifically designed for ${city} market conditions and business practices.`
    },
    {
      title: `Swiss Quality Standards & Local Support`,
      description: `Premium training quality that meets the high standards expected by ${city} professionals, with ongoing local support and follow-up sessions available.`
    }
  ];
}

// Generate schema.org JSON-LD for local business SEO
export function generateLocalBusinessSchema(city: string, service: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://aiworkshop.ch/${city.toLowerCase()}`,
    "name": `AI Workshop Switzerland - ${city}`,
    "description": `Professional ${service} and AI education for businesses in ${city}, Switzerland`,
    "url": `https://aiworkshop.ch/${city.toLowerCase()}`,
    "telephone": "+41768184677",
    "email": "hello@aiworkshop.ch",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": "CH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      // Note: In a real implementation, you'd have actual coordinates for each city
      "latitude": "47.3769", // Example coordinates (Zurich)
      "longitude": "8.5417"
    },
    "sameAs": [
      "https://www.linkedin.com/company/ai-workshop-switzerland"
    ],
    "serviceArea": {
      "@type": "State",
      "name": "Switzerland"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${service} Programs`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Fundamentals Training",
            "description": "4-hour intensive AI fundamentals workshop"
          },
          "price": "350",
          "priceCurrency": "CHF"
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "AI Business Intelligence Training",
            "description": "4-hour specialized BI and AI integration workshop"
          },
          "price": "470",
          "priceCurrency": "CHF"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Generative AI Training",
            "description": "4-hour comprehensive generative AI workshop"
          },
          "price": "850", 
          "priceCurrency": "CHF"
        }
      ]
    }
  };
}

// Generate all possible SEO page combinations (for programmatic SEO)
export function generateAllSEOPageCombinations(): SEOPageParams[] {
  const combinations: SEOPageParams[] = [];
  
  // Generate combinations for major cities with primary services
  const majorCities = ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne'];
  const primaryServices = ['AI Training', 'ChatGPT Training', 'AI Fundamentals Training'];
  const primaryIndustries = ['Business', 'Healthcare', 'Finance', 'Technology'];
  
  majorCities.forEach(city => {
    primaryServices.forEach(service => {
      primaryIndustries.forEach(industry => {
        combinations.push({ city, service, industry });
      });
    });
  });
  
  return combinations;
}

// Utility to generate URL slug from page parameters
export function generatePageSlug(params: SEOPageParams): string {
  const { city, service, industry } = params;
  const citySlug = city.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const serviceSlug = service.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const industrySlug = industry.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  return `${citySlug}/${serviceSlug}/${industrySlug}`;
}