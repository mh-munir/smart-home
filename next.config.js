/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

// Static baseline CSP for fallback. The proxy injects a per-request nonce
// for inline scripts/styles — proxy's CSP will override this header at runtime.
const baseCsp = [
  "default-src 'self'",
  // Rely on per-request nonces + strict-dynamic in browsers that support it.
  "script-src 'self' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://analytics.google.com https://cdn.logrocket.io https://cdn.logrocket.com",
  // Some libraries and Next internals inject inline styles (style attributes or
  // inline <style> tags). To avoid blocking layout at runtime we allow
  // 'unsafe-inline' for styles. This is a pragmatic trade-off; consider
  // removing inline styles in the future to tighten CSP.
  "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "media-src 'self' https:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://analytics.google.com https://api.logrocket.com https://r.logrocket.io https://e.logrocket.com https://cdn.logrocket.io",
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

const nextConfig = {
  // High-traffic performance optimization
  compress: true,
  generateEtags: true,
  poweredByHeader: false,

  // Optimize server-side packages — don't bundle mongoose into edge/runtime
  serverExternalPackages: ["mongoose", "bcryptjs", "sanitize-html"],

  // Experimental performance optimizations
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      "next/image",
      "next/link",
      "next/font/google",
      "next/navigation",
      "react",
      "react-dom",
    ],
    // Enable partial prerendering for faster initial loads
    ppr: false,
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production for smaller bundles
    removeConsole: isProd ? { exclude: ["error", "warn"] } : false,
  },

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
    deviceSizes: [640, 768, 1024, 1280],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
    unoptimized: false,
    // Allow inline images for faster LCP rendering
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Security & performance headers
  async headers() {
    const headersList = [
      {
        // Apply security headers to every route
        source: "/:path*",
        headers: [...securityHeaders],
      },
      // NOTE: Do NOT add custom Cache-Control for /_next/static/:path*.
      // Next.js and Vercel automatically apply immutable caching for hashed
      // static assets under _next/static. Adding custom Cache-Control triggers
      // the build warning:
      //   "Custom Cache-Control headers detected for /_next/static/:path*"
      // and can interfere with the CDN's built-in caching strategy.

      // Cache for public static files (images, fonts) outside _next/static
      ...(isProd
        ? [
            {
              source: "/:path*.(png|jpg|jpeg|gif|webp|avif|ico|svg|woff2|woff|ttf)",
              headers: [
                { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
              ],
            },
          ]
        : []),
    ];

    return headersList;
  },
};

export default nextConfig;
