"use client";

import dynamic from "next/dynamic";

// Client-side interactive hero — only hydrates on the client
const HeroSlider = dynamic(() => import("@/components/HeroSlider"), {
  ssr: false,
  loading: () => null,
});

interface HeroSlide {
  _id: string;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function HeroSliderWrapper({ slides }: { slides: HeroSlide[] }) {
  return <HeroSlider slides={slides} />;
}
