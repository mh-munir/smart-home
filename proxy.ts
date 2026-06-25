import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CSP_HEADER = 'Content-Security-Policy';
const NONCE_HEADER = 'x-nonce';

// Paths that don't require authentication
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin');
}

function isPublicAdminPath(pathname: string): boolean {
  return PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));
}

function hasAdminSession(request: NextRequest): boolean {
  const session = request.cookies.get('smart_home_admin_session');
  return !!(session && session.value);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin auth check — redirect unauthenticated users to login
  if (isAdminRoute(pathname) && !isPublicAdminPath(pathname) && !hasAdminSession(request)) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const array = new Uint8Array(16);
    globalThis.crypto.getRandomValues(array);

    let binary = '';
    for (let i = 0; i < array.length; i++) binary += String.fromCharCode(array[i]);
    const nonce = globalThis.btoa(binary);

    const isDev = process.env.NODE_ENV !== 'production';

    const csp = [
      "default-src 'self'",

      [
        "script-src 'self'",
        `'nonce-${nonce}'`,
        "'unsafe-inline'",
        isDev ? "'unsafe-eval'" : "",
        // Google Tag Manager & Analytics
        "https://*.google.com",
        "https://www.google.com.bd",
        "https://*.google.com.bd",
        "https://*.doubleclick.net",
        // Google AdSense & Ads
        "https://pagead2.googlesyndication.com",
        "https://googleads.g.doubleclick.net",
        "https://www.googleadservices.com",
        "https://adservice.google.com",
        "https://adservice.google.co.uk",
        "https://www.google.com",
        // Vercel (SSO, preview toolbar, live)
        "https://vercel.com",
        "https://vercel.live",
      ].filter(Boolean).join(" "),

      // style-src: 'unsafe-inline' is required because many client libs
      // (Tailwind, styled-components, etc.) inject inline style attributes
      // at runtime which are not covered by nonces.
      `style-src 'self' https://fonts.googleapis.com 'unsafe-inline'`,

      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",

      // connect-src: Google Analytics, GTM, AdSense, Ad Traffic Quality,
      // Google Ads conversion tracking, Vercel analytics/preview/SSO, and
      // all origins that fetch() or XHR may reach at runtime.
      [
        "connect-src 'self'",
        "https://pagead2.googlesyndication.com",
          "https://googleads.g.doubleclick.net",
          "https://*.doubleclick.net",
          "https://*.googlesyndication.com",

          "https://www.googleadservices.com",
          "https://adservice.google.com",
          "https://adservice.google.co.uk",

          // Google regional domains
          "https://www.google.com",
          "https://*.google.com",
          "https://www.google.com.bd",
          "https://*.google.com.bd",

          // Google Ad Traffic Quality
          "https://ep1.adtrafficquality.google",
          "https://ep2.adtrafficquality.google",
          "https://adtrafficquality.google",
      ].join(" "),

      // frame-src: Google ads iframes, GTM noscript, Vercel SSO/preview.
      [
        "frame-src",
          "https://*.google.com",
          "https://*.google.com.bd",
          "https://*.googlesyndication.com",
          "https://*.doubleclick.net",
          "https://googleads.g.doubleclick.net",
          "https://tpc.googlesyndication.com",
          "https://www.googletagmanager.com",
          "https://vercel.com",
          "https://*.vercel.app",
          "https://vercel.live",
      ].join(" "),

      // worker-src: service worker + blob workers
      "worker-src 'self' blob:",

      // manifest-src: PWA web app manifest
      "manifest-src 'self' https://*.vercel.app https://vercel.com",

      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // frame-ancestors: allow embedding from same origin and Vercel previews
      [
        "frame-ancestors 'self'",
        "https://*.vercel.app",
        "https://vercel.com",
      ].join(" "),
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ]
      .filter(Boolean)
      .join('; ');

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(NONCE_HEADER, nonce);

    const res = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    res.headers.set(CSP_HEADER, csp);

    // Standard security headers (also set in next.config.js as a baseline;
    // proxy values take precedence for routes matching this matcher).
    res.headers.set('X-Frame-Options', 'SAMEORIGIN');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
    res.headers.set('X-DNS-Prefetch-Control', 'on');
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    // Cross-Origin-Opener-Policy for security (improves Best Practices score)
    res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

    // Signal admin routes to the server layout so PublicLayoutShell can avoid "use client"
    if (isAdminRoute(pathname)) {
      res.headers.set('x-is-admin', '1');
    }

    return res;
  } catch (err) {
    console.error('Proxy error setting CSP nonce:', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ads.txt|uploads).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};