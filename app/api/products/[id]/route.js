import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import Product from "@/models/Product";
import fs from "fs/promises";
import path from "path";
import { saveBufferToStorage } from "@/lib/storage";

function serializeProduct(product) {
  let affiliateLinks = {};
  if (product.affiliateLinks) {
    if (product.affiliateLinks instanceof Map) affiliateLinks = Object.fromEntries(product.affiliateLinks);
    else affiliateLinks = product.affiliateLinks;
  }

  return {
    _id: product._id.toString(),
    title: product.title,
    slug: product.slug,
    image: product.image || null,
    images: product.images || [],
    price: product.price || null,
    rating: product.rating || 4.5,
    affiliateLink: product.affiliateLink || null,
    affiliateLinks: affiliateLinks,
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

    // Process images if provided (support data URLs and existing URLs)
    const processedImages = [];
    if (Array.isArray(data.images)) {
      for (let i = 0; i < data.images.length && processedImages.length < 10; i++) {
        const img = data.images[i];
        if (typeof img === "string" && img.startsWith("data:")) {
          const match = img.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
          if (match) {
            const mime = match[1];
            const base64Data = match[2];
            const ext = mime.split("/")[1].split("+")[0] || "jpg";
            const filename = `product-${id}-${Date.now()}-${i}.${ext}`;
            const key = `uploads/products/${filename}`;
            const buffer = Buffer.from(base64Data, "base64");
            try {
              const res = await saveBufferToStorage(buffer, key, mime);
              processedImages.push(res.url);
            } catch {
              const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
              await fs.mkdir(uploadsDir, { recursive: true });
              const filePath = path.join(uploadsDir, filename);
              await fs.writeFile(filePath, buffer);
              processedImages.push(`/uploads/products/${filename}`);
            }
          }
        } else if (typeof img === "string" && img.trim()) {
          processedImages.push(img);
        }
      }
    }

    if (processedImages.length > 0) {
      data.images = processedImages;
      // set main image to first image if provided
      data.image = processedImages[0];
    }

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
