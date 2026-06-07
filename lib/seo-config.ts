/**
 * SEO Performance Configuration
 * Optimizes Core Web Vitals and Search Engine Rankings
 */

import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site';

export const SEO_CONFIG = {
  // Domain and site URL
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION: 'Expert reviews and buying guides for home smart products and devices',
  SITE_AUTHOR: 'SmartHome Affiliate',
  
  // Primary keyword target
  PRIMARY_KEYWORD: 'home smart products',
  
  // Image optimization settings
  IMAGE_CONFIG: {
    // Supported formats for next/image
    formats: ['image/avif', 'image/webp'],
    // Maximum image dimensions for optimization
    sizes: {
      thumbnail: 200,
      small: 400,
      medium: 800,
      large: 1200,
      hero: 1920,
    },
    // Quality settings
    quality: {
      default: 75,
      hero: 85,
      thumbnail: 60,
    },
    // Lazy loading configuration
    loading: 'lazy',
    placeholder: 'blur',
  },

  // Performance budget for Core Web Vitals
  PERFORMANCE_BUDGET: {
    // Largest Contentful Paint (LCP) - Target < 2.5s
    lcp: 2500,
    // First Input Delay (FID) / Interaction to Next Paint (INP) - Target < 100ms
    inp: 100,
    // Cumulative Layout Shift (CLS) - Target < 0.1
    cls: 0.1,
    // First Contentful Paint (FCP) - Target < 1.8s
    fcp: 1800,
  },

  // Cache configuration for SEO
  CACHE_CONFIG: {
    // Static assets cache duration (in seconds)
    staticAssets: 31536000, // 1 year
    // HTML pages cache duration
    html: 3600, // 1 hour
    // API responses cache duration
    api: 1800, // 30 minutes
    // Images cache duration
    images: 86400, // 1 day
    // Sitemaps and robots.txt cache
    seo: 86400, // 1 day
  },

  // Meta tags
  META_TAGS: {
    // Default viewport
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
    // Character encoding
    charset: 'utf-8',
    // Language
    language: 'en',
    // Theme color
    themeColor: '#4F46E5',
  },

  // Social media profiles for schema markup
  SOCIAL_PROFILES: [
    'https://www.facebook.com/smarthomeaffiliate',
    'https://twitter.com/smarthomeaffiliate',
    'https://www.instagram.com/smarthomeaffiliate',
    'https://www.youtube.com/smarthomeaffiliate',
  ],

  // Search engine verification codes
  VERIFICATION: {
    // Add your Google Search Console verification ID
    googleSearchConsole: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // Add your Bing Webmaster Tools verification ID
    bingWebmasterTools: 'YOUR_BING_VERIFICATION_CODE',
  },

  // Canonical domain
  CANONICAL_DOMAIN: SITE_URL,

  // Open Graph default image
  OG_IMAGE: DEFAULT_OG_IMAGE,
  OG_IMAGE_WIDTH: 1200,
  OG_IMAGE_HEIGHT: 630,

  // Twitter Card settings
  TWITTER_HANDLE: '@smarthomeaffiliate',
  TWITTER_CARD_TYPE: 'summary_large_image',

  // Analytics configuration
  ANALYTICS: {
    // Google Analytics 4 ID
    googleAnalyticsId: 'G-XXXXXXXXXX',
    // Enable enhanced ecommerce tracking
    enableEcommerce: true,
  },

  // Security headers for SEO
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },

  // Sitemap configuration
  SITEMAP: {
    // Maximum URLs per sitemap
    maxUrls: 50000,
    // Sitemap index URL
    sitemapIndex: `${SITE_URL}/sitemap.xml`,
  },

  // Robots.txt configuration
  ROBOTS: {
    // Disallow for specific user agents
    disallowPaths: ['/admin', '/api/auth', '/.next', '/_next', '/*.json'],
    // Allow crawl delay (in seconds)
    crawlDelay: 0,
  },
};

/**
 * Get optimized image URL with SEO-friendly configuration
 */
export function getOptimizedImageUrl(
  url: string,
  width: number = 800,
  quality: number = 75
): string {
  // This should be used with next/image component
  // Format: /_next/image?url=...&w=...&q=...
  return url;
}

/**
 * Generate meta tags for content
 */
export function generateMetaTags(config: Record<string, any>) {
  return {
    'og:type': config.type || 'website',
    'og:title': config.title,
    'og:description': config.description,
    'og:image': config.image || SEO_CONFIG.OG_IMAGE,
    'og:url': config.url,
    'og:site_name': SEO_CONFIG.SITE_NAME,
    'twitter:card': SEO_CONFIG.TWITTER_CARD_TYPE,
    'twitter:title': config.title,
    'twitter:description': config.description,
    'twitter:image': config.image || SEO_CONFIG.OG_IMAGE,
    'twitter:creator': SEO_CONFIG.TWITTER_HANDLE,
  };
}
