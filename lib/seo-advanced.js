/**
 * Advanced SEO Utilities for Home Smart Products
 * Optimized for Google ranking for "Home Smart Products" keywords
 */

import { SITE_URL } from '@/lib/site';

export const SEO_CONFIG = {
  siteTitle: 'SmartHome Affiliate',
  siteDescription:
    'Expert reviews of home smart products and devices. Find the best smart home solutions with buying guides and affiliate recommendations.',
  siteUrl: SITE_URL,
  primaryKeyword: 'home smart products',
  secondaryKeywords: [
    'smart home devices',
    'smart home products',
    'best smart home gadgets',
    'home automation',
    'smart locks',
    'smart cameras',
    'smart lighting',
    'smart thermostats',
  ],
  author: 'SmartHome Affiliate Team',
  twitterHandle: '@smarthomeaffiliate',
  socialMediaLinks: {
    facebook: 'https://facebook.com/smarthomeaffiliate',
    twitter: 'https://twitter.com/smarthomeaffiliate',
    instagram: 'https://instagram.com/smarthomeaffiliate',
    youtube: 'https://youtube.com/smarthomeaffiliate',
  },
};

/**
 * Generate optimized title for SEO
 */
export function generateSEOTitle(
  pageName: string,
  keyword: string = 'home smart products'
): string {
  const templates: Record<string, string> = {
    home: `Home Smart Products - Best Smart Home Devices Reviews & Buying Guide 2026`,
    product: `${pageName} - Best ${keyword} | SmartHome Affiliate Reviews`,
    guide: `${pageName} - Complete Guide to ${keyword} 2026`,
    category: `${pageName} | Best ${keyword} | SmartHome Affiliate`,
    review: `${pageName} Review - ${keyword} | Expert Analysis`,
  };

  return templates[pageName] || templates['product'];
}

/**
 * Generate optimized meta description
 */
export function generateSEODescription(
  pageName: string,
  keyword: string = 'home smart products'
): string {
  const descriptions: Record<string, string> = {
    home: 'Find the best home smart products with expert reviews and comprehensive buying guides. Smart locks, cameras, lighting, thermostats & more. Trusted affiliate recommendations.',
    product: `Detailed review of ${pageName}. Compare features, price, and ratings. Get exclusive affiliate deals on ${keyword}.`,
    guide: `Complete buying guide for ${keyword}. Learn how to choose the best smart home solution for your needs.`,
    category: `Browse the best ${keyword}. Expert reviews, ratings, and buying guides for ${pageName}.`,
    review: `In-depth review: ${pageName}. Expert analysis of features, pros, cons, and pricing for ${keyword}.`,
  };

  return descriptions[pageName] || descriptions['product'];
}

/**
 * Generate structured data for Product
 */
export function generateProductSchema(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Premium Smart Home Brand',
    },
    offers: {
      '@type': 'Offer',
      url: product.affiliateUrl || `${SEO_CONFIG.siteUrl}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 100,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  };
}

/**
 * Generate structured data for Article/Guide
 */
export function generateArticleSchema(article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    image: article.image || `${SEO_CONFIG.siteUrl}/og-image.jpg`,
    datePublished: article.publishedDate || new Date().toISOString(),
    dateModified: article.modifiedDate || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteTitle,
      url: SEO_CONFIG.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONFIG.siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: `${SEO_CONFIG.siteUrl}/logo.png`,
      },
    },
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Breadcrumb schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Generate LocalBusiness schema for affiliate site
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.siteTitle,
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/logo.png`,
    description: SEO_CONFIG.siteDescription,
    sameAs: Object.values(SEO_CONFIG.socialMediaLinks),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@smarthomeaffiliate.com',
    },
  };
}

/**
 * Generate meta tags object
 */
export function generateMetaTags(
  title: string,
  description: string,
  keyword: string = SEO_CONFIG.primaryKeyword,
  canonicalUrl?: string
) {
  return {
    title,
    description,
    keywords: `${keyword}, ${SEO_CONFIG.secondaryKeywords.join(', ')}`,
    canonical: canonicalUrl || SEO_CONFIG.siteUrl,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    openGraph: {
      type: 'website',
      url: canonicalUrl || SEO_CONFIG.siteUrl,
      title,
      description,
      siteName: SEO_CONFIG.siteTitle,
      images: [
        {
          url: `${SEO_CONFIG.siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      handle: SEO_CONFIG.twitterHandle,
      title,
      description,
      image: `${SEO_CONFIG.siteUrl}/og-image.jpg`,
    },
  };
}

/**
 * Generate internal linking suggestions
 */
export function generateInternalLinks(currentPage: string) {
  const links: Record<string, Array<{ url: string; text: string; keyword: string }>> = {
    home: [
      { url: '/best-deals', text: 'Best Deals on Smart Devices', keyword: 'smart home deals' },
      { url: '/guides', text: 'Smart Home Buying Guides', keyword: 'smart home guide' },
      { url: '/review', text: 'Latest Product Reviews', keyword: 'smart home review' },
    ],
    product: [
      { url: '/', text: 'Back to Home', keyword: 'home smart products' },
      { url: '/best-deals', text: 'View All Deals', keyword: 'smart home deals' },
    ],
    guides: [
      { url: '/', text: 'Home', keyword: 'home smart products' },
      { url: '/best-deals', text: 'Best Deals', keyword: 'smart home deals' },
    ],
  };

  return links[currentPage] || links['home'];
}

/**
 * SEO recommendations for content
 */
export const SEO_BEST_PRACTICES = {
  titleLength: { min: 50, max: 60 },
  descriptionLength: { min: 120, max: 160 },
  headingOrder: 'Use H1 for main title, H2 for sections, H3 for subsections',
  imageAlt: 'Always include descriptive alt text for images',
  internalLinks: 'Link to 2-5 related pages per article',
  keyword: 'Include "home smart products" in title, first 100 words, and headers',
  contentLength: '1000+ words for best ranking potential',
  schema: 'Always include relevant structured data markup',
  mobile: 'Ensure mobile-first responsive design',
  coreWeb: 'Optimize LCP, FID, and CLS metrics',
};

export default {
  SEO_CONFIG,
  generateSEOTitle,
  generateSEODescription,
  generateProductSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateMetaTags,
  generateInternalLinks,
};
