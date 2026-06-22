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

      // If the image is hosted on the configured SITE_URL (common when
      // the DB stores absolute URLs pointing to production) and the
      // current environment can't reliably proxy that host, use a local
      // fallback so Next's image optimizer doesn't attempt an upstream
      // fetch that may return 404 in dev.
      try {
        if (image && siteHostname) {
          const parsed = new URL(image, SITE_URL);
          if (parsed.hostname === siteHostname) {
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
