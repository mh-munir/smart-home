import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Static baseline CSP for fallback. The proxy injects a per-request nonce
// for inline scripts/styles — proxy's CSP will override this header at runtime.
  const baseCsp = [
  "default-src 'self'",
  // Rely on per-request nonces + strict-dynamic in browsers that support it.
  "script-src 'self' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://analytics.google.com",
  // Some libraries and Next internals inject inline styles (style attributes or
  // inline <style> tags). To avoid blocking layout at runtime we allow
  // 'unsafe-inline' for styles. This is a pragmatic trade-off; consider
  // removing inline styles in the future to tighten CSP.
  "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "media-src 'self' https:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://analytics.google.com",
  "frame-src https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // deprecated but harmless fallback for older browsers
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Opt-out of privacy-invasive / unwanted features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  // HSTS only in production (requires HTTPS)
  ...(isProd
    ? [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ]
    : []),
  // Fallback static CSP; proxy will emit the runtime nonce-enabled CSP.
  { key: "Content-Security-Policy", value: baseCsp },
];

const nextConfig: NextConfig = {
  // High-traffic performance optimization
  compress: true,
  generateEtags: true,
  poweredByHeader: false,

  // Image optimization for SEO and Core Web Vitals
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "**.amazon.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.imgix.net",
      },
      {
        protocol: "https",
        hostname: "**.aliexpress.com",
      },
      {
        protocol: "https",
        hostname: "smart-home-products.vercel.app",
      },
      // Local development hosts
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    unoptimized: false,
  },

  // Security & performance headers
  async headers() {
    const headersList = [
      {
        // Apply security headers to every route
        source: "/:path*",
        headers: [...securityHeaders],
      },
    ];

    // Only set long-lived immutable Cache-Control headers in production.
    // Setting these in development can interfere with Next.js dev behavior.
    if (isProd) {
      headersList.push(
        {
          // Immutable caching for Next.js hashed static assets
          source: "/_next/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/(favicon|favicon.ico|robots.txt|sitemap.xml)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=86400, s-maxage=86400",
            },
          ],
        },
        {
          // Long cache for public images
          source: "/uploads/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        }
      );
    }

    return headersList;
  },
};

export default nextConfig;
