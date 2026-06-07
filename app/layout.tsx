import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  viewport: "width=device-width, initial-scale=1.0",
  charset: "utf-8",
  alternates: {
    canonical: "https://smart-home.vercel.app",
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
