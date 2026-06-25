import Image from "next/image";
import Link from "next/link";

interface HeroSlide {
  _id: string;
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Server-rendered hero shell — outputs the first slide image + text
 * directly in the initial HTML so it paints immediately (LCP element).
 * The client HeroSliderInteractive component hydrates on top to add
 * carousel behaviour.
 */
export default function HeroSliderServer({ slides }: { slides: HeroSlide[] }) {
  if (!slides?.length) {
    return (
      <section className="relative overflow-hidden bg-linear-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Smart Home Gadgets Guide
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-orange-50">
            Find the best smart home products with expert reviews and buying
            guides.
          </p>
        </div>
      </section>
    );
  }

  const slide = slides[0];

  return (
    <section
      className="relative overflow-hidden bg-gray-950 text-white h-full min-h-105 md:min-h-130"
    >
      {/* Server-rendered background image — LCP element */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/45 z-10" />
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
          fetchPriority="high"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIHZpZXdCb3g9JzAgMCAxMCAxMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIGZpbGw9JyMxZjI5MzcnLz48L3N2Zz4="
        />
      </div>

      {/* Server-rendered text content — paints with the image */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 py-20 md:py-28 min-h-105 md:min-h-130 flex items-center">
        <div className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm uppercase tracking-[0.24em] text-orange-100">
            Featured Smart Home Picks
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-100 md:text-xl">
            {slide.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={slide.ctaLink || "/blog"}
              className="inline-flex items-center rounded-full bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600"
            >
              {slide.ctaText || "Explore Products"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}