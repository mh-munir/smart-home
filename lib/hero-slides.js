import { connectDB } from "@/lib/db";
import HeroSlide from "@/models/HeroSlide";

export async function getHeroSlides() {
  await connectDB();

  const slides = await HeroSlide.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  // Convert to plain serializable objects
  return slides.map(slide => ({
    _id: slide._id.toString(),
    title: slide.title,
    description: slide.description || null,
    image: slide.image || null,
    ctaText: slide.ctaText || 'Explore Products',
    ctaLink: slide.ctaLink || '/review',
    order: slide.order || 0,
    isActive: slide.isActive ?? true,
    createdAt: slide.createdAt?.toISOString() || null,
    updatedAt: slide.updatedAt?.toISOString() || null,
  }));
}
