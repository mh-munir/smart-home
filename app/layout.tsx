import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { headers } from "next/headers";
import { generateHrefLangLinks } from "@/lib/multi-country-seo";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import fs from "fs";
import path from "path";
import PublicLayoutShell from "@/components/PublicLayoutShell";
import DeferredProviders from "@/components/DeferredProviders";
import DeferredScripts from "@/components/DeferredScripts";
import WebVitals from "@/components/WebVitals";

// Read site settings once at module level for server-side rendering
let navSettings = { subtitle: "Make your home smarter", logo: "/logo.png" };
try {
  const settingsPath = path.join(process.cwd(), "data", "site-settings.json");
  if (fs.existsSync(settingsPath)) {
    const raw = fs.readFileSync(settingsPath, "utf8");
    const settings = JSON.parse(raw || "{}");
    if (settings?.logo || settings?.subtitle) {
      navSettings = { subtitle: settings.subtitle || "Make your home smarter", logo: settings.logo || "/logo.png" };
    }
  }
} catch {
  // ignore
}

type ExtraMetaTag = { name?: string; content?: string; property?: string; httpEquiv?: string };

interface SEOStructuredData {
  organizationName?: string;
  organizationUrl?: string;
  organizationLogo?: string;
  sameAs?: string[];
}

interface SeoData {
  canonicalUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string | string[];
  author?: string;
  robots?: string;
  ogType?: string;
  ogUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  googleSiteVerification?: string | number | (string | number)[];
  yandexVerification?: string | number | (string | number)[];
  bingVerification?: string | number | (string | number)[];
  applicationName?: string;
  msTileColor?: string;
  appleMobileWebAppCapable?: string;
  appleMobileWebAppStatusBarStyle?: string;
  appleMobileWebAppTitle?: string;
  mobileWebAppCapable?: string;
  geoRegion?: string;
  geoPlacename?: string;
  geoPosition?: string;
  icbm?: string;
  articleAuthor?: string;
  articlePublisher?: string;
  structuredData?: SEOStructuredData;
  extraMetaTags?: ExtraMetaTag[];
}

let faviconPath = "/favicon.ico";
let siteTitle = "";
let seoData: SeoData = {};
try {
  const settingsPath = path.join(process.cwd(), "data", "site-settings.json");
  if (fs.existsSync(settingsPath)) {
    const raw = fs.readFileSync(settingsPath, "utf8");
    const settings = JSON.parse(raw || "{}");
    if (settings?.favicon) faviconPath = settings.favicon;
    if (settings?.title) siteTitle = settings.title;
    if (settings?.seo) seoData = settings.seo;
  }
} catch {
  // ignore
}

const alternateLanguages = Object.fromEntries(
  generateHrefLangLinks().map((link) => [link.hrefLang, link.href])
);

const geistSans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  display: 'swap',
  preload: false,
});

const geistMono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  display: 'swap',
  preload: false,
});

// Client-only widgets are imported directly; they are client components.

// Derive safe, correctly-typed metadata values from `seoData`
const _baseUrl = typeof seoData.canonicalUrl === "string" && seoData.canonicalUrl.trim() ? seoData.canonicalUrl : SITE_URL;
const _metaTitle = typeof seoData.metaTitle === "string" && seoData.metaTitle.trim() ? seoData.metaTitle : siteTitle || "Home Smart Products - Best Smart Home Devices & Reviews 2026 | SmartHome Affiliate";
const _metaDescription = typeof seoData.metaDescription === "string" && seoData.metaDescription.trim()
  ? seoData.metaDescription
  : "Discover the best home smart products and devices. Expert reviews, buying guides, and affiliate recommendations for smart locks, cameras, lighting, thermostats, and more. Find your perfect home automation solution today.";
const _keywords = typeof seoData.keywords === "string" ? seoData.keywords : Array.isArray(seoData.keywords) ? seoData.keywords.join(", ") : "home smart products, smart home devices, smart lock, smart camera, smart lighting, smart thermostat, smart speakers, home automation, best smart home products, affiliate review";
const _authors = typeof seoData.author === "string" ? [{ name: seoData.author }] : undefined;

const _ogAllowed = new Set([
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
]);
type OGType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";
const _ogType: OGType = typeof seoData.ogType === "string" && _ogAllowed.has(seoData.ogType) ? (seoData.ogType as OGType) : "website";
const _ogUrl = typeof seoData.ogUrl === "string" && seoData.ogUrl.trim() ? seoData.ogUrl : SITE_URL;
const _ogTitle = typeof seoData.ogTitle === "string" && seoData.ogTitle.trim() ? seoData.ogTitle : _metaTitle;
const _ogDescription = typeof seoData.ogDescription === "string" && seoData.ogDescription.trim() ? seoData.ogDescription : _metaDescription;
const _ogImage = typeof seoData.ogImage === "string" && seoData.ogImage.trim() ? seoData.ogImage : DEFAULT_OG_IMAGE;

const _twitterAllowed = new Set(["summary_large_image", "summary", "player", "app"]);
type TwitterCard = "summary_large_image" | "summary" | "player" | "app";
const _twitterCard: TwitterCard = typeof seoData.twitterCard === "string" && _twitterAllowed.has(seoData.twitterCard) ? (seoData.twitterCard as TwitterCard) : "summary_large_image";
const _twitterImages = [(typeof seoData.twitterImage === "string" && seoData.twitterImage.trim() ? seoData.twitterImage : _ogImage)];
const _twitterTitle = typeof seoData.twitterTitle === "string" && seoData.twitterTitle.trim() ? seoData.twitterTitle : _ogTitle;
const _twitterSite = typeof seoData.twitterSite === "string" ? seoData.twitterSite : undefined;
const _twitterCreator = typeof seoData.twitterCreator === "string" ? seoData.twitterCreator : undefined;

const _verificationGoogle = (typeof seoData.googleSiteVerification === "string" || typeof seoData.googleSiteVerification === "number" || Array.isArray(seoData.googleSiteVerification)) ? seoData.googleSiteVerification : undefined;
const _verificationYandex = (typeof seoData.yandexVerification === "string" || typeof seoData.yandexVerification === "number" || Array.isArray(seoData.yandexVerification)) ? seoData.yandexVerification : undefined;
const _verificationBing = (typeof seoData.bingVerification === "string" || typeof seoData.bingVerification === "number" || Array.isArray(seoData.bingVerification)) ? seoData.bingVerification : undefined;

const _structured = seoData.structuredData && typeof seoData.structuredData === "object" ? (seoData.structuredData as SEOStructuredData) : undefined;
const _extraMeta = Array.isArray(seoData.extraMetaTags) ? seoData.extraMetaTags.filter(Boolean) as ExtraMetaTag[] : undefined;

export const metadata: Metadata = {
  metadataBase: (() => {
    try {
      return new URL(String(_baseUrl));
    } catch {
      return new URL('https://smart-home-products.vercel.app');
    }
  })(),
  title: _metaTitle,
  description: _metaDescription,
  keywords: _keywords,
  authors: _authors,
  robots: seoData.robots || "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  alternates: {
    canonical: _ogUrl,
    languages: alternateLanguages,
  },
  openGraph: {
    type: _ogType,
    locale: "en_US",
    url: _ogUrl,
    siteName: SITE_NAME,
    title: _ogTitle,
    description: _ogDescription,
    images: [
      {
        url: _ogImage,
        width: 1200,
        height: 630,
        alt: _ogTitle || "Home Smart Products - Best Smart Home Devices",
      },
    ],
  },
  twitter: {
    card: _twitterCard,
    title: _twitterTitle,
    description: seoData.twitterDescription || _ogDescription,
    images: _twitterImages,
    site: _twitterSite || undefined,
    creator: _twitterCreator || undefined,
  },
  verification: {
    google: _verificationGoogle,
    yandex: _verificationYandex,
    other: _verificationBing ? { "msvalidate.01": _verificationBing } : undefined,
  },
  icons: {
    icon: faviconPath,
  },
  // include extraMetaTags for head mapping
  // (we still map them into <head/> below)
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawNonce = (await headers()).get("x-nonce");
  const nonce = rawNonce && rawNonce.length > 0 ? rawNonce : undefined;
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* DNS prefetch for third-party origins — loaded only in production */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NV3QJRL8');`,
                  }}
        />
        {/* End Google Tag Manager */}
        {/* Google Analytics (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TYYPR8FBTX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TYYPR8FBTX');
            `,
          }}
        />
        {/* End Google Analytics */}
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8998788891126313"
          crossOrigin="anonymous"
        />
        {/* End Google AdSense */}
        <link rel="icon" href={faviconPath} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d9488" />
        {seoData.applicationName && <meta name="application-name" content={seoData.applicationName} />}
        {seoData.msTileColor && <meta name="msapplication-TileColor" content={seoData.msTileColor} />}
        {seoData.appleMobileWebAppCapable && <meta name="apple-mobile-web-app-capable" content={seoData.appleMobileWebAppCapable} />}
        {seoData.appleMobileWebAppStatusBarStyle && <meta name="apple-mobile-web-app-status-bar-style" content={seoData.appleMobileWebAppStatusBarStyle} />}
        {seoData.appleMobileWebAppTitle && <meta name="apple-mobile-web-app-title" content={seoData.appleMobileWebAppTitle} />}
        {(seoData.mobileWebAppCapable || seoData.appleMobileWebAppCapable) && (
          <meta name="mobile-web-app-capable" content={seoData.mobileWebAppCapable || seoData.appleMobileWebAppCapable} />
        )}
        {seoData.geoRegion && <meta name="geo.region" content={seoData.geoRegion} />}
        {seoData.geoPlacename && <meta name="geo.placename" content={seoData.geoPlacename} />}
        {seoData.geoPosition && <meta name="geo.position" content={seoData.geoPosition} />}
        {seoData.icbm && <meta name="ICBM" content={seoData.icbm} />}
        {seoData.articleAuthor && <meta property="article:author" content={seoData.articleAuthor} />}
        {seoData.articlePublisher && <meta property="article:publisher" content={seoData.articlePublisher} />}
        {_structured?.organizationName && (
          <script
            suppressHydrationWarning
            {...(nonce ? { nonce } : {})}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: _structured.organizationName,
                url: _structured.organizationUrl || SITE_URL,
                logo: _structured.organizationLogo || undefined,
                sameAs: _structured.sameAs || [],
              }),
            }}
          />
        )}
        {_extraMeta?.map((tag: ExtraMetaTag, i: number) => {
          if (tag.name && tag.content) return <meta key={`extra-${i}`} name={tag.name} content={tag.content} />;
          if (tag.property && tag.content) return <meta key={`extra-${i}`} property={tag.property} content={tag.content} />;
          if (tag.httpEquiv && tag.content) return <meta key={`extra-${i}`} httpEquiv={tag.httpEquiv} content={tag.content} />;
          return null;
        })}
      </head>
      <body className="min-h-full flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NV3QJRL8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Deferred providers — avoids blocking hydration for theme/compare */}
        <DeferredProviders>
            <a href="#main-content" className="sr-only focus:not-sr-only">
              Skip to content
            </a>
            <PublicLayoutShell navSettings={navSettings}>{children}</PublicLayoutShell>
            <DeferredScripts />
            <WebVitals />
        </DeferredProviders>
      </body>
    </html>
  );
}
