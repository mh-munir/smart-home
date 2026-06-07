import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import HeroSlide from "@/models/HeroSlide";
import { revalidatePath } from "next/cache";

function serializeSlide(slide) {
  return {
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
}

export async function PUT(req, { params }) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();

    const slide = await HeroSlide.findByIdAndUpdate(
      id,
      {
        title: data.title,
        description: data.description,
        image: data.image,
        ctaText: data.ctaText || "Explore Products",
        ctaLink: data.ctaLink || "/review",
        order: Number(data.order || 0),
        isActive: data.isActive ?? true,
      },
      { new: true }
    );

    revalidatePath("/");
    return Response.json(serializeSlide(slide));
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { id } = await params;

    await HeroSlide.findByIdAndDelete(id);
    revalidatePath("/");
    return Response.json({ message: "Slide deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
