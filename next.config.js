/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

// NOTE: Content-Security-Policy is NOT set here. It is handled per-request by
// the middleware (proxy.ts) which generates a unique nonce for each response and
// builds a nonce-enabled CSP.  The static header below only includes non-CSP
// security headers.  This avoids conflicts between a static CSP (no nonce) and
// the runtime nonce-based CSP from the middleware.

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
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // HSTS only in production (requires HTTPS)
  ...(isProd
    ? [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ]
    : []),
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
