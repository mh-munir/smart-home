import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalyticsComponent } from "@/components/GoogleAnalyticsComponent";
import GoogleTagManager from "@/components/GoogleTagManager";
import GoogleAdSenseScript from "@/components/GoogleAdSenseScript";
import { generateHrefLangLinks } from "@/lib/multi-country-seo";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: "Home Smart Products - Best Smart Home Devices & Reviews 2026 | SmartHome Affiliate",
  description:
    "Discover the best home smart products and devices. Expert reviews, buying guides, and affiliate recommendations for smart locks, cameras, lighting, thermostats, and more. Find your perfect home automation solution today.",
  keywords:
    "home smart products, smart home devices, smart lock, smart camera, smart lighting, smart thermostat, smart speakers, home automation, best smart home products, affiliate review",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  alternates: {
    canonical: SITE_URL,
    languages: alternateLanguages,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Home Smart Products - Best Smart Home Devices & Reviews 2026",
    description:
      "Expert reviews and buying guides for home smart products. Find the best smart home devices for your needs.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
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
    images: [DEFAULT_OG_IMAGE],
  },
  other: {
    "google-adsense-account": "ca-pub-8998788891126313",
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
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleTagManager />
        <GoogleAnalyticsComponent
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
          ga4Id={process.env.NEXT_PUBLIC_GA4_ID}
        />
        <GoogleAdSenseScript />
        {children}
      </body>
    </html>
  );
}
