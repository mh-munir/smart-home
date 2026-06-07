/**
 * Product Page Metadata Generator
 * Generates dynamic metadata based on product data
 */

import type { Metadata } from 'next';
import { generateProductSEO, generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo-metadata';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  updatedAt?: string;
  createdAt?: string;
}

/**
 * Generate metadata for product page
 */
export function generateProductMetadata(product: Product, baseUrl: string = 'https://smart-home.vercel.app'): Metadata {
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const seoData = generateProductSEO(
    product.name,
    product.description,
    product.image,
    product.slug,
    product.category
  );

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      type: 'website',
      title: `${product.name} - Best Review & Buying Guide`,
      description: product.description.substring(0, 160),
      url: productUrl,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      siteName: 'SmartHome Affiliate',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} Review | SmartHome Affiliate`,
      description: product.description.substring(0, 160),
      images: [product.image],
    },
  };
}

/**
 * Generate JSON-LD schema for product
 */
export function generateProductJsonLd(
  product: Product,
  baseUrl: string = 'https://smart-home.vercel.app'
): object {
  const productUrl = `${baseUrl}/products/${product.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: product.name,
    description: product.description,
    image: product.image,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: 'SmartHome Affiliate',
    },
    offers: {
      '@type': 'Offer',
      price: product.price?.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'SmartHome Affiliate',
        url: baseUrl,
      },
    },
    ...(product.rating && product.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toString(),
        reviewCount: product.reviewCount?.toString(),
        ratingCount: product.reviewCount?.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    }),
    datePublished: product.createdAt || new Date().toISOString(),
    dateModified: product.updatedAt || new Date().toISOString(),
  };
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateProductBreadcrumbJsonLd(
  product: Product,
  baseUrl: string = 'https://smart-home.vercel.app'
): object {
  const items = [
    { name: 'Home', url: baseUrl },
    { name: 'Products', url: `${baseUrl}/products` },
    { name: product.category || 'Category', url: `${baseUrl}/products?category=${product.category}` },
    { name: product.name, url: `${baseUrl}/products/${product.slug}` },
  ];

  return generateBreadcrumbSchema(items);
}
