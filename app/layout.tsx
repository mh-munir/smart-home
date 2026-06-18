import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalyticsComponent } from "@/components/GoogleAnalyticsComponent";
import GoogleTagManager from "@/components/GoogleTagManager";
import GoogleAdSenseScript from "@/components/GoogleAdSenseScript";
import { generateHrefLangLinks } from "@/lib/multi-country-seo";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import fs from "fs";
import path from "path";
import { ConditionalNavbar, ConditionalFooter } from "@/components/ConditionalNavFooter";

let faviconPath = "/favicon.ico";
let siteTitle = "";
let seoData: Record<string, any> = {};
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seoData.canonicalUrl || SITE_URL),
  title: seoData.metaTitle || siteTitle || "Home Smart Products - Best Smart Home Devices & Reviews 2026 | SmartHome Affiliate",
  description:
    seoData.metaDescription || "Discover the best home smart products and devices. Expert reviews, buying guides, and affiliate recommendations for smart locks, cameras, lighting, thermostats, and more. Find your perfect home automation solution today.",
  keywords:
    seoData.keywords || "home smart products, smart home devices, smart lock, smart camera, smart lighting, smart thermostat, smart speakers, home automation, best smart home products, affiliate review",
  authors: seoData.author ? [{ name: seoData.author }] : undefined,
  robots: seoData.robots || "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  alternates: {
    canonical: seoData.canonicalUrl || SITE_URL,
    languages: alternateLanguages,
  },
  openGraph: {
    type: (seoData.ogType as any) || "website",
    locale: "en_US",
    url: seoData.ogUrl || SITE_URL,
    siteName: SITE_NAME,
    title: seoData.ogTitle || seoData.metaTitle || "Home Smart Products - Best Smart Home Devices & Reviews 2026",
    description:
      seoData.ogDescription || seoData.metaDescription || "Expert reviews and buying guides for home smart products. Find the best smart home devices for your needs.",
    images: [
      {
        url: seoData.ogImage || DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: seoData.ogTitle || "Home Smart Products - Best Smart Home Devices",
      },
    ],
  },
  twitter: {
    card: (seoData.twitterCard as any) || "summary_large_image",
    title: seoData.twitterTitle || seoData.ogTitle || "Home Smart Products - Best Smart Home Devices & Reviews",
    description:
      seoData.twitterDescription || seoData.ogDescription || "Discover the best home smart products with expert reviews and recommendations.",
    images: [seoData.twitterImage || seoData.ogImage || DEFAULT_OG_IMAGE],
    site: seoData.twitterSite || undefined,
    creator: seoData.twitterCreator || undefined,
  },
  verification: {
    google: seoData.googleSiteVerification || undefined,
    yandex: seoData.yandexVerification || undefined,
    other: seoData.bingVerification ? { "msvalidate.01": seoData.bingVerification } : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="icon" href={faviconPath} />
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
        {seoData.structuredData?.organizationName && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: seoData.structuredData.organizationName,
                url: seoData.structuredData.organizationUrl || SITE_URL,
                logo: seoData.structuredData.organizationLogo || undefined,
                sameAs: seoData.structuredData.sameAs || [],
              }),
            }}
          />
        )}
        {seoData.extraMetaTags?.map((tag: any, i: number) => {
          if (tag.name && tag.content) return <meta key={`extra-${i}`} name={tag.name} content={tag.content} />;
          if (tag.property && tag.content) return <meta key={`extra-${i}`} property={tag.property} content={tag.content} />;
          if (tag.httpEquiv && tag.content) return <meta key={`extra-${i}`} httpEquiv={tag.httpEquiv} content={tag.content} />;
          return null;
        })}
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleTagManager />
        <GoogleAnalyticsComponent
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
          ga4Id={process.env.NEXT_PUBLIC_GA4_ID}
        />
        <GoogleAdSenseScript />
        <a href="#main-content" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <ConditionalNavbar/>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <ConditionalFooter/>
      </body>
    </html>
  );
}
