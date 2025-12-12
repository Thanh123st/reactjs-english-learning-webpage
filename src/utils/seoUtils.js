import { SEO_CONSTANTS } from './seoConstants';

// Generate structured data for EducationalOrganization
export const generateEducationalOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": SEO_CONSTANTS.ORGANIZATION.name,
    "url": SEO_CONSTANTS.ORGANIZATION.url,
    "logo": SEO_CONSTANTS.ORGANIZATION.logo,
    "description": SEO_CONSTANTS.ORGANIZATION.description,
    "address": {
      "@type": "PostalAddress",
      ...SEO_CONSTANTS.ORGANIZATION.address
    },
    "contactPoint": {
      "@type": "ContactPoint",
      ...SEO_CONSTANTS.ORGANIZATION.contactPoint
    },
    "sameAs": [
      SEO_CONSTANTS.FACEBOOK_PAGE,
      `https://twitter.com/${SEO_CONSTANTS.TWITTER_HANDLE.replace('@', '')}`
    ],
    "educationalCredentialAwarded": [
      "TOEIC Certificate",
      "IELTS Certificate",
      "ESP Certificate",
      "EFL Certificate"
    ],
  };
};

// Generate structured data for Website
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SEO_CONSTANTS.SITE_NAME,
    "url": SEO_CONSTANTS.SITE_URL,
    "description": SEO_CONSTANTS.ORGANIZATION.description,
    "inLanguage": ["vi", "en"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SEO_CONSTANTS.SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};

// Generate breadcrumb structured data
export const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

// Generate FAQ structured data
export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
// Helper function to combine multiple schemas
export const combineSchemas = (...schemas) => {
  return schemas.filter(Boolean);
};

// Generate canonical URL
export const generateCanonicalUrl = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONSTANTS.SITE_URL}${cleanPath}`;
};

// Generate meta keywords string
export const generateKeywords = (additionalKeywords = []) => {
  const allKeywords = [...SEO_CONSTANTS.KEYWORDS, ...additionalKeywords];
  return [...new Set(allKeywords)].join(', ');
};
