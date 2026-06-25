import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import Product from "@/models/Product";
import { uploadToCloudinary } from "@/lib/cloudinary";

import { generateSlug } from "@/utils/generateSlug";

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
    affiliateLinks,
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

export async function POST(req) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await connectDB();
    const data = await req.json();

    // slug — use client-provided slug if available, otherwise auto-generate
    const baseSlug = data.slug ? generateSlug(data.slug) : generateSlug(data.title || "product");
    let slug = baseSlug || `${Date.now()}`;

    // ensure unique slug
    let exists = await Product.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    // handle base64 images — upload directly to Cloudinary
    const images = Array.isArray(data.images) ? data.images : [];
    const savedImageUrls = [];

    for (const [index, base64Image] of images.entries()) {
      if (typeof base64Image !== "string") continue;
      const matches = base64Image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
      if (!matches || matches.length !== 3) continue;

      const mime = matches[1];
      const base64Data = matches[2];
      const ext = mime.split("/")[1].split("+")[0] || "jpg";
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `${baseSlug}-${Date.now()}-${index}`;

      try {
        const result = await uploadToCloudinary(
          buffer,
          "smart-home/products",
          filename,
          mime
        );
        savedImageUrls.push(result.url);
      } catch (uploadErr) {
        console.error("Cloudinary upload failed for image:", uploadErr.message);
        // Skip this image if upload fails — do not write to local filesystem
      }
    }

    const product = await Product.create({
      title: data.title,
      slug,
      image: savedImageUrls[0] || data.image || null,
      images: savedImageUrls,
      price: data.price || null,
      rating: parseFloat(data.rating) || 4.5,
      affiliateLink: data.affiliateLink || null,
      category: data.category || null,
      description: data.description || null,
      bestDeal: !!data.bestDeal,
      dealType: data.dealType || null,
      offer: data.offer || null,
      clicks: 0,
      conversions: 0,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      canonicalUrl: data.canonicalUrl || null,
    });

    revalidatePath("/");
    revalidatePath("/blog");

    return Response.json(serializeProduct(product));
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}