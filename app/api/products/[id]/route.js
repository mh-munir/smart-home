import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import Product from "@/models/Product";

function serializeProduct(product) {
  return {
    _id: product._id.toString(),
    title: product.title,
    slug: product.slug,
    image: product.image || null,
    price: product.price || null,
    rating: product.rating || 4.5,
    affiliateLink: product.affiliateLink || null,
    category: product.category || null,
    description: product.description || null,
    clicks: product.clicks || 0,
    conversions: product.conversions || 0,
    createdAt: product.createdAt?.toISOString() || null,
    updatedAt: product.updatedAt?.toISOString() || null,
  };
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(serializeProduct(product));
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const { id } = await params;
    const data = await req.json();

    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/");
    revalidatePath("/blog");
    return Response.json(serializeProduct(product));
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

    await Product.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/blog");
    return Response.json({ message: "Product deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
