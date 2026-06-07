import React from 'react';

interface SchemaMarkupProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  type?: 'Organization' | 'WebSite' | 'NewsArticle' | 'Product';
}

export default function SchemaMarkup({
  title = 'SmartHome Affiliate - Home Smart Products & Reviews',
  description = 'Expert reviews of home smart products and devices. Find the best smart home solutions.',
  image = 'https://smart-home.vercel.app/og-image.jpg',
  url = 'https://smart-home.vercel.app',
  author = 'SmartHome Affiliate',
  datePublished = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  type = 'WebSite',
}: SchemaMarkupProps) {
  const schemas = [
    // Organization Schema
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SmartHome Affiliate',
      url: 'https://smart-home.vercel.app',
      logo: 'https://smart-home.vercel.app/logo.png',
      description: 'Expert reviews and buying guides for home smart products',
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
      name: 'SmartHome Affiliate',
      url: 'https://smart-home.vercel.app',
      description: 'Home Smart Products Reviews & Buying Guides',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${url}/search?q={search_term_string}`,
        },
        query_input: 'required name=search_term_string',
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
          item: 'https://smart-home.vercel.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: 'https://smart-home.vercel.app/products',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Guides',
          item: 'https://smart-home.vercel.app/guides',
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

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}
