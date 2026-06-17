import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
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
      {
        protocol: "https",
        hostname: "smart-home-products.vercel.app",
      },
      // Local development hosts (allow images served from the local Next server)
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
      // Match localhost/127.0.0.1 on any port (useful when dev server switches ports)
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
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
            value:
              "default-src 'self' https: data:; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://www.googleadservices.com https://pagead2.googlesyndication.com https://*.adtrafficquality.google; " +
              "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://www.googleadservices.com https://pagead2.googlesyndication.com https://*.adtrafficquality.google; " +
              "img-src 'self' https: data: https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com; " +
              "connect-src 'self' https: https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://*.adtrafficquality.google; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com;",
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
};

export default nextConfig;
