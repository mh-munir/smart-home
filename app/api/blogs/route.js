import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import Blog from "@/models/Blog";

function serializeBlog(blog) {
  return {
    _id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    content: blog.content || null,
    image: blog.image || null,
    affiliateProducts: blog.affiliateProducts?.map(product => 
      typeof product === 'object' && product._id 
        ? {
            _id: product._id.toString(),
            title: product.title,
            slug: product.slug,
            price: product.price || null,
            image: product.image || null,
            affiliateLink: product.affiliateLink || null,
          }
        : product
    ) || [],
    createdAt: blog.createdAt?.toISOString() || null,
    updatedAt: blog.updatedAt?.toISOString() || null,
  };
}

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().populate("affiliateProducts").lean();
    return Response.json(blogs.map(serializeBlog));
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

    const blog = await Blog.create({
      ...data,
      slug: slug,
    });

    // Populate to get full product details
    await blog.populate("affiliateProducts");
    
    return Response.json(serializeBlog(blog.toObject()));
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
