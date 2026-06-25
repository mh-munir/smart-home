import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import Product from "@/models/Product";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  isCloudinaryUrl,
} from "@/lib/cloudinary";

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
    bestDeal: product.bestDeal || false,
    dealType: product.dealType || null,
    offer: product.offer || null,
    clicks: product.clicks || 0,
    conversions: product.conversions || 0,
    metaTitle: product.metaTitle || null,
    metaDescription: product.metaDescription || null,
    canonicalUrl: product.canonicalUrl || null,
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
            const buffer = Buffer.from(base64Data, "base64");
            const filename = `product-${id}-${Date.now()}-${i}`;

            try {
              const result = await uploadToCloudinary(
                buffer,
                "smart-home/products",
                filename,
                mime
              );
              processedImages.push(result.url);
            } catch (uploadErr) {
              console.error("Cloudinary upload failed for image:", uploadErr.message);
              // Skip this image if upload fails — do not write to local filesystem
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

    const product = await Product.findByIdAndUpdate(id, data, { returnDocument: 'after' });
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

    // Fetch the product first to get image URLs for Cloudinary deletion
    const product = await Product.findById(id);

    if (product) {
      // Delete all Cloudinary images associated with this product
      const imagesToDelete = [];

      if (product.image && isCloudinaryUrl(product.image)) {
        imagesToDelete.push(product.image);
      }

      if (Array.isArray(product.images)) {
        for (const imgUrl of product.images) {
          if (isCloudinaryUrl(imgUrl) && !imagesToDelete.includes(imgUrl)) {
            imagesToDelete.push(imgUrl);
          }
        }
      }

      // Delete images from Cloudinary (don't block on errors)
      for (const imgUrl of imagesToDelete) {
        try {
          await deleteFromCloudinary(imgUrl);
        } catch (delErr) {
          console.error("Failed to delete Cloudinary image:", delErr.message);
        }
      }
    }

    await Product.findByIdAndDelete(id);
    revalidatePath("/");
    revalidatePath("/blog");
    return Response.json({ message: "Product deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}