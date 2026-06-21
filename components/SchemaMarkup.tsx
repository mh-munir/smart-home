import React from 'react';
import { DEFAULT_LOGO, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site';
import { headers } from 'next/headers';

interface SchemaMarkupProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  type?: 'Organization' | 'WebSite' | 'NewsArticle' | 'Product';
  // Optional product-specific fields
  price?: string | number;
  priceCurrency?: string;
  sku?: string;
  availability?: string;
  brand?: string;
}

export default async function SchemaMarkup({
  title = 'SmartHome Affiliate - Home Smart Products & Reviews',
  description = 'Expert reviews of home smart products and devices. Find the best smart home solutions.',
  image = DEFAULT_OG_IMAGE,
  url = SITE_URL,
  author = SITE_NAME,
  datePublished = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  type = 'WebSite',
  price,
  priceCurrency,
  sku,
  availability,
  brand,
}: SchemaMarkupProps) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  const schemas: Array<Record<string, unknown>> = [
    // Organization Schema
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: author || SITE_NAME,
      url: url || SITE_URL,
      logo: image || DEFAULT_LOGO,
      description: description || 'Expert reviews and buying guides for home smart products',
      sameAs: [
        'https://www.facebook.com/smarthomeaffiliate',
        'https://twitter.com/smarthomeaffiliate',
        'https://www.instagram.com/smarthomeaffiliate',
        'https://www.youtube.com/smarthomeaffiliate',
      ],
    },
    // WebSite Schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: title || SITE_NAME,
      url: url || SITE_URL,
      description: description || 'Home Smart Products Reviews & Buying Guides',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${(url || SITE_URL)}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    // BreadcrumbList Schema
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: `${SITE_URL}/products`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Guides',
          item: `${SITE_URL}/guides`,
        },
      ],
    },
    // FAQ Schema for Home Smart Products
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are the best home smart products for beginners?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The best home smart products for beginners include smart speakers, smart plugs, and smart bulbs. These are affordable and easy to set up.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much do home smart products cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Home smart products range from $20 to $500+ depending on the type and features. Most popular options are between $50-$150.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are smart home devices compatible with each other?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Many smart home devices work together through common platforms like Google Home, Alexa, and Apple HomeKit.',
          },
        },
      ],
    },
  ];

  // If an article type is requested, add a NewsArticle schema using provided dates
  if (type === 'NewsArticle') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title,
      description: description,
      image: image ? [image] : undefined,
      datePublished: datePublished,
      dateModified: dateModified,
      author: { '@type': 'Person', name: author },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    });
  }

  // Product schema (when requested)
  if (type === 'Product') {
    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      url,
      availability: availability || 'https://schema.org/InStock',
    };

    if (price !== undefined && price !== null) {
      // Attempt to normalize price to a number if possible
      const numeric = typeof price === 'number' ? price : Number(String(price).replace(/[^0-9\.]/g, ''));
      if (!Number.isNaN(numeric)) offer.price = numeric;
    }

    if (priceCurrency) offer.priceCurrency = priceCurrency;

    const productSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      description: description,
      image: image ? [image] : undefined,
      sku: sku || undefined,
      brand: brand ? { '@type': 'Brand', name: brand } : { '@type': 'Brand', name: author || SITE_NAME },
      offers: offer,
    };

    schemas.push(productSchema);
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
