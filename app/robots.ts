import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        userAgent: 'Googlebot-Mobile',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Slurp',
        allow: '/',
        crawlDelay: 1,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        crawlDelay: 1,
      },
      // Block AI training bots
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
      // Block aggressive bots
      {
        userAgent: ['MJ12bot', 'AhrefsBot', 'SemrushBot', 'DotBot', 'MojeekBot'],
        disallow: '/',
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap-products.xml`,
      `${SITE_URL}/sitemap-pages.xml`,
    ],
    host: SITE_URL,
  };
}
