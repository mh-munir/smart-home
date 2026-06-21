import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CSP_HEADER = 'Content-Security-Policy';
const NONCE_HEADER = 'x-nonce';

export function proxy(request: NextRequest) {
  try {
    const array = new Uint8Array(16);
    globalThis.crypto.getRandomValues(array);

    let binary = '';
    for (let i = 0; i < array.length; i++) binary += String.fromCharCode(array[i]);
    const nonce = globalThis.btoa(binary);

    const isDev = process.env.NODE_ENV !== 'production';

    // Production-grade CSP with a per-request nonce for inline scripts.
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://analytics.google.com`,
      // Do not add nonce for style-src: many client libs add inline styles
      // (style attributes) which are not covered by nonces; allow 'unsafe-inline'
      // for styles to avoid blocking runtime style mutations. Consider hardening
      // this later by removing inline styles and using hashed styles where possible.
      `style-src 'self' https://fonts.googleapis.com 'unsafe-inline'`,
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://analytics.google.com https://*.google-analytics.com https://*.googlesyndication.com",
      "frame-src https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      ...(isDev ? [] : ["upgrade-insecure-requests"]),
    ]
      .filter(Boolean)
      .join('; ');

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(NONCE_HEADER, nonce);
    requestHeaders.set(CSP_HEADER, csp);

    const res = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    res.headers.set(CSP_HEADER, csp);

    // Standard security headers
    res.headers.set('X-Frame-Options', 'SAMEORIGIN');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');
    res.headers.set('X-DNS-Prefetch-Control', 'on');
    res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

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
