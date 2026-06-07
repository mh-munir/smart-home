import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalyticsComponent } from "@/components/GoogleAnalyticsComponent";
import { generateHrefLangLinks } from "@/lib/multi-country-seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home Smart Products - Best Smart Home Devices & Reviews 2026 | SmartHome Affiliate",
  description:
    "Discover the best home smart products and devices. Expert reviews, buying guides, and affiliate recommendations for smart locks, cameras, lighting, thermostats, and more. Find your perfect home automation solution today.",
  keywords:
    "home smart products, smart home devices, smart lock, smart camera, smart lighting, smart thermostat, smart speakers, home automation, best smart home products, affiliate review",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  charset: "utf-8",
  alternates: {
    canonical: "https://smart-home.vercel.app",
    languages: {
      'en-US': 'https://smart-home.vercel.app',
      'en-GB': 'https://smart-home.vercel.app/en-gb',
      'de': 'https://smart-home.vercel.app/de',
      'fr': 'https://smart-home.vercel.app/fr',
      'it': 'https://smart-home.vercel.app/it',
      'es': 'https://smart-home.vercel.app/es',
      'pt-BR': 'https://smart-home.vercel.app/pt-br',
      'ja': 'https://smart-home.vercel.app/ja',
      'en-IN': 'https://smart-home.vercel.app/en-in',
      'ar-EG': 'https://smart-home.vercel.app/ar-eg',
      'x-default': 'https://smart-home.vercel.app',
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smart-home.vercel.app",
    siteName: "SmartHome Affiliate",
    title: "Home Smart Products - Best Smart Home Devices & Reviews 2026",
    description:
      "Expert reviews and buying guides for home smart products. Find the best smart home devices for your needs.",
    images: [
      {
        url: "https://smart-home.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Home Smart Products - Best Smart Home Devices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Smart Products - Best Smart Home Devices & Reviews",
    description:
      "Discover the best home smart products with expert reviews and recommendations.",
    images: ["https://smart-home.vercel.app/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initihead>
        {/* Hreflang tags for multi-country SEO */}
        {generateHrefLangLinks().map((link) => (
          <link
            key={`${link.hrefLang}-${link.href}`}
            rel={link.rel}
            hrefLang={link.hrefLang}
            href={link.href}
          />
        ))}
        
        {/* Preconnect to Google Analytics */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Google Analytics & Ads Tracking */}
        <GoogleAnalyticsComponent
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
          ga4Id={process.env.NEXT_PUBLIC_GA4_ID}
          conversionId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}
        />
        {children}
      
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
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
