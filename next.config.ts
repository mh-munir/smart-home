import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,
  
  // High-traffic performance optimization
  compress: true,
  generateEtags: true,
  poweredByHeader: false, // Remove X-Powered-By header
  
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
    ],
    // Modern image formats for better Core Web Vitals
    formats: ["image/avif", "image/webp"],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for responsive behavior
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Aggressive caching for images
    minimumCacheTTL: 31536000, // 1 year for versioned images
    unoptimized: false,
    // Dangerously allow SVG
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // SEO and Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Security headers
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-UA-Compatible",
            value: "IE=edge",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Performance headers
          {
            key: "Content-Security-Policy",
            value: "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://www.googleadservices.com; img-src 'self' https: data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https: https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
          },
          // Aggressive cache for high traffic scenarios
          {
            key: "Cache-Control",
            value: "public, max-age=7200, s-maxage=86400, stale-while-revalidate=604800",
          },
          // Additional performance headers
          {
            key: "Accept-Encoding",
            value: "gzip, deflate, br",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      // Special handling for static assets
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
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
          {
            key: "Content-Type",
            value: "text/plain",
          },
        ],
      },
    ];
  },

  // Redirects for SEO (keep old URLs working)
  async redirects() {
    return [
      // Add any necessary redirects here
      // Example: old URLs to new URLs (301 redirects)
    ];
  },

  // Rewrites for clean URLs
  async rewrites() {
    return {
      beforeFiles: [],
    };
  },

  // Compression for faster delivery
  compress: true,

  // Optimize CSS and JavaScript (swcMinify removed in Next.js 16+)

  // Experimental features (most are now automatic in Next.js 16+)
  experimental: {
    // next/font optimization is automatic
  },

  // Turbopack configuration (for next dev and build)
  turbopack: {},
};

export default nextConfig;
