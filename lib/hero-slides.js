import { connectDB } from "@/lib/db";
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

    // Convert to plain serializable objects
    const result = slides.map(slide => ({
      _id: slide._id.toString(),
      title: slide.title,
      description: slide.description || null,
      image: slide.image || null,
      ctaText: slide.ctaText || 'Explore Products',
      ctaLink: slide.ctaLink || '/blog',
      order: slide.order || 0,
      isActive: slide.isActive ?? true,
      createdAt: slide.createdAt?.toISOString() || null,
      updatedAt: slide.updatedAt?.toISOString() || null,
    }));

    // Update cache
    cachedSlides = result;
    cacheTimestamp = Date.now();

    return result;
  } catch (error) {
    if (!fallbackOnError) throw error;

    console.warn("Hero slides unavailable:", error.message);
    // Return stale cache if available, otherwise empty array
    return cachedSlides || [];
  }
}

// Allow cache invalidation from admin operations
export function invalidateHeroSlidesCache() {
  cachedSlides = null;
  cacheTimestamp = 0;
}
