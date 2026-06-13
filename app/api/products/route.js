import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";
import Product from "@/models/Product";
import { getProducts } from "@/lib/products";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Fetch single product by slug
      await connectDB();
      const product = await Product.findOne({ slug }).lean();
      
      if (!product) {
        return Response.json({ error: 'Product not found' }, { status: 404 });
      }
      
      // Convert to plain serializable object
      let affiliateLinks = {};
      if (product.affiliateLinks) {
        if (product.affiliateLinks instanceof Map) {
          affiliateLinks = Object.fromEntries(product.affiliateLinks);
        } else {
          affiliateLinks = product.affiliateLinks;
        }
      }

      const serializedProduct = {
        _id: product._id.toString(),
        title: product.title,
        slug: product.slug,
        image: product.image || null,
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
      
      return Response.json(serializedProduct);
    }

    // Fetch all products
    const products = await getProducts({ fallbackOnError: false });
    return Response.json(products);
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

    // Create slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    const product = await Product.create({
      ...data,
      slug: slug,
    });

    // Convert to plain serializable object
    let createdAffiliateLinks = {};
    if (product.affiliateLinks) {
      if (product.affiliateLinks instanceof Map) createdAffiliateLinks = Object.fromEntries(product.affiliateLinks);
      else createdAffiliateLinks = product.affiliateLinks;
    }

    const serializedProduct = {
      _id: product._id.toString(),
      title: product.title,
      slug: product.slug,
      image: product.image || null,
      price: product.price || null,
      rating: product.rating || 4.5,
      affiliateLink: product.affiliateLink || null,
      affiliateLinks: createdAffiliateLinks,
      category: product.category || null,
      description: product.description || null,
      clicks: product.clicks || 0,
      conversions: product.conversions || 0,
      createdAt: product.createdAt?.toISOString() || null,
      updatedAt: product.updatedAt?.toISOString() || null,
    };

    revalidatePath("/");
    revalidatePath("/blog");
    return Response.json(serializedProduct);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
