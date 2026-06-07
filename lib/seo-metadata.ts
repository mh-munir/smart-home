/**
 * SEO Metadata Generator for Smart Home Affiliate
 * Generates optimized metadata for all pages
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  authors?: string[];
  robots?: string;
  twitterCard?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

// Product categories with SEO keywords
export const productCategories = {
  'smart-locks': {
    name: 'Smart Locks',
    keywords: ['smart locks', 'smart door locks', 'keyless entry', 'smart home security'],
    description: 'Best smart locks for home security and convenience',
  },
  'smart-cameras': {
    name: 'Smart Cameras',
    keywords: ['smart cameras', 'security cameras', 'home security cameras', 'video doorbells'],
    description: 'Home security cameras and video doorbells for smart homes',
  },
  'smart-lighting': {
    name: 'Smart Lighting',
    keywords: ['smart lights', 'smart bulbs', 'smart lighting systems', 'automated lighting'],
    description: 'Smart lighting solutions for energy-efficient homes',
  },
  'smart-speakers': {
    name: 'Smart Speakers',
    keywords: ['smart speakers', 'voice assistants', 'smart home hubs', 'WiFi speakers'],
    description: 'Best smart speakers and voice assistants for home automation',
  },
  'smart-thermostats': {
    name: 'Smart Thermostats',
    keywords: ['smart thermostats', 'smart temperature control', 'WiFi thermostats', 'home heating'],
    description: 'Smart thermostats for temperature control and energy savings',
  },
  'smart-plugs': {
    name: 'Smart Plugs',
    keywords: ['smart plugs', 'smart outlets', 'WiFi plugs', 'power control'],
    description: 'Smart power outlets and plugs for convenient home automation',
  },
};

// Generate SEO metadata for homepage
export function generateHomeSEO(): SEOMetadata {
  return {
    title: 'Home Smart Products - Best Smart Home Devices & Reviews 2026 | SmartHome Affiliate',
    description:
      'Discover the best home smart products and devices with expert reviews, comprehensive buying guides, and trusted affiliate recommendations. Smart locks, cameras, lighting, thermostats & more.',
    keywords: [
      'home smart products',
      'smart home devices',
      'best smart home products',
      'smart home reviews',
      'smart home buying guide',
      'home automation',
      'smart home gadgets',
      'smart home technology',
      'IoT devices home',
      'connected home devices',
    ],
    ogImage: 'https://smart-home.vercel.app/og-image.jpg',
    canonical: 'https://smart-home.vercel.app',
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    twitterCard: 'summary_large_image',
  };
}

// Generate SEO metadata for product pages
export function generateProductSEO(
  productName: string,
  productDescription: string,
  productImage: string,
  productSlug: string,
  productCategory?: string
): SEOMetadata {
  const baseUrl = 'https://smart-home.vercel.app';
  const productUrl = `${baseUrl}/products/${productSlug}`;

  return {
    title: `${productName} - Best Review & Buying Guide 2026 | SmartHome Affiliate`,
    description: `${productDescription.substring(0, 150)}... Get expert reviews, specifications, pricing, and buying recommendations for ${productName}.`,
    keywords: [
      productName.toLowerCase(),
      `${productName} review`,
      `best ${productName}`,
      `${productName} price`,
      `${productName} features`,
      `buy ${productName}`,
      productCategory ? `${productCategory} reviews` : 'smart home reviews',
      'smart home products',
      'home automation',
    ],
    ogImage: productImage || 'https://smart-home.vercel.app/og-image.jpg',
    canonical: productUrl,
    robots: 'index, follow',
    twitterCard: 'summary_large_image',
  };
}

// Generate Product Schema for Google Rich Results
export function generateProductSchema(
  name: string,
  description: string,
  image: string,
  price: number,
  rating: number,
  reviewCount: number,
  url: string,
  availability: string = 'InStock',
  brand: string = 'SmartHome Affiliate'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: [image],
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'USD',
      price: price.toString(),
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: 'SmartHome Affiliate',
      },
    },
    ...(rating > 0 && reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toString(),
        reviewCount: reviewCount.toString(),
        ratingCount: reviewCount.toString(),
      },
    }),
  };
}

// Generate BreadcrumbList Schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate Article Schema for blog posts
export function generateArticleSchema(
  title: string,
  description: string,
  image: string,
  datePublished: string,
  dateModified: string,
  author: string = 'SmartHome Affiliate',
  url: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: [image],
    datePublished,
    dateModified,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SmartHome Affiliate',
      logo: {
        '@type': 'ImageObject',
        url: 'https://smart-home.vercel.app/logo.png',
      },
    },
    url,
  };
}

// Generate FAQ Schema
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
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

// Generate Organization Schema
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SmartHome Affiliate',
    url: 'https://smart-home.vercel.app',
    logo: 'https://smart-home.vercel.app/logo.png',
    description: 'Expert reviews and buying guides for home smart products and devices',
    sameAs: [
      'https://www.facebook.com/smarthomeaffiliate',
      'https://twitter.com/smarthomeaffiliate',
      'https://www.instagram.com/smarthomeaffiliate',
    ],
    contact: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@smart-home.vercel.app',
    },
  };
}

// Generate high-quality SEO title
export function generateSEOTitle(mainKeyword: string, brand: string = 'SmartHome Affiliate'): string {
  return `${mainKeyword} - Best Reviews & Buying Guide 2026 | ${brand}`;
}

// Generate high-quality SEO description
export function generateSEODescription(
  mainContent: string,
  keyWord: string,
  callToAction: string = 'Learn more today!'
): string {
  return `${mainContent.substring(0, 150)}... Find expert reviews and buying guides for ${keyWord}. ${callToAction}`.substring(0, 160);
}
