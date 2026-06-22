import { connectDB } from "@/lib/db";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";
import HeroSlide from "@/models/HeroSlide";

// In-memory cache for hero slides (avoids repeated DB hits per request)
let cachedSlides = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 1 minute cache

export async function getHeroSlides({ fallbackOnError = true } = {}) {
  // Return cached data if still fresh
  if (cachedSlides && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedSlides;
  }

  try {
    await connectDB();

    const slides = await HeroSlide.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .maxTimeMS(5000); // Fail fast instead of buffering for 10s

    // Helper to validate image URLs (basic check)
    const looksLikeImage = (url) => {
      if (!url || typeof url !== 'string') return false;
      // Common image extensions
      const imgExt = /\.(jpe?g|png|gif|webp|avif|svg)(\?.*)?$/i;
      if (imgExt.test(url)) return true;
      // Allow local uploads path or CDN-like paths
      if (url.includes('/uploads/') || url.includes('/images/') || url.includes('cdn')) return true;
      // Allow absolute http(s) URLs that include an extension
      return false;
    };

    // Convert to plain serializable objects and sanitize image URLs
    const LOCAL_FALLBACK = "/logo.png";
    const siteHostname = (() => {
      try {
        return new URL(SITE_URL).hostname;
      } catch {
        return null;
      }
    })();

    const result = slides.map((slide) => {
      let image = slide.image || null;

      if (!looksLikeImage(image)) {
        image = DEFAULT_OG_IMAGE;
      }

      // Only replace absolute URLs that point to the site's own hostname
      // in development, since Next.js image optimizer may not be able to
      // proxy them. Relative URLs (e.g. /uploads/...) are served from
      // the same origin and should work fine.
      try {
        if (image && siteHostname && /^https?:\/\//i.test(image)) {
          const parsed = new URL(image);
          if (parsed.hostname === siteHostname && process.env.NODE_ENV !== "production") {
            image = LOCAL_FALLBACK;
          }
        }
      } catch {
        // ignore URL parsing issues
      }

      return {
        _id: slide._id.toString(),
        title: slide.title,
        description: slide.description || null,
        image,
        ctaText: slide.ctaText || 'Explore Products',
        ctaLink: slide.ctaLink || '/blog',
        order: slide.order || 0,
        isActive: slide.isActive ?? true,
        createdAt: slide.createdAt?.toISOString() || null,
        updatedAt: slide.updatedAt?.toISOString() || null,
      };
    });

    // Update cache
    cachedSlides = result;
    cacheTimestamp = Date.now();

    return result;
  } catch (error) {
    if (!fallbackOnError) throw error;

    // Return stale cache if available, otherwise empty array
    return cachedSlides || [];
  }
}

// Allow cache invalidation from admin operations
export function invalidateHeroSlidesCache() {
  cachedSlides = null;
  cacheTimestamp = 0;
}
