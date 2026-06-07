import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://smart-home.vercel.app';

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
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-products.xml`,
      `${baseUrl}/sitemap-pages.xml`,
    ],
    host: baseUrl,
  };
}
