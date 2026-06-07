export async function GET() {
  const baseUrl = 'https://smart-home.vercel.app';

  const robots = `User-agent: *
Allow: /
Allow: /api/
Disallow: /admin
Disallow: /.next
Disallow: /api/auth
Disallow: /api/
Disallow: /_next/

# Google
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block bad bots
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
