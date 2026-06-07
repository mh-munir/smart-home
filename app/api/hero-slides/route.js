import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import { getHeroSlides } from "@/lib/hero-slides";
import HeroSlide from "@/models/HeroSlide";
import { revalidatePath } from "next/cache";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true";
    let slides;

    if (includeAll) {
      const unauthorized = await requireAdminSession();
      if (unauthorized) return unauthorized;

      await connectDB();
      const allSlides = await HeroSlide.find().sort({ order: 1, createdAt: -1 }).lean();
      slides = allSlides.map(slide => ({
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
    } else {
      slides = await getHeroSlides();
    }

    return Response.json(slides);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const data = await req.json();

    const slide = await HeroSlide.create({
      title: data.title,
      description: data.description,
      image: data.image,
      ctaText: data.ctaText || "Explore Products",
      ctaLink: data.ctaLink || "/review",
      order: Number(data.order || 0),
      isActive: data.isActive ?? true,
    });

    const serialized = {
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
    };

    revalidatePath("/");
    return Response.json(serialized);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
