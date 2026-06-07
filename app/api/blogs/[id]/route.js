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

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const blog = await Blog.findById(id).populate("affiliateProducts");
    if (!blog) {
      return Response.json({ error: "Blog not found" }, { status: 404 });
    }

    return Response.json(serializeBlog(blog.toObject()));
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

    const blog = await Blog.findByIdAndUpdate(id, data, { new: true }).populate("affiliateProducts");
    return Response.json(serializeBlog(blog.toObject()));
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

    await Blog.findByIdAndDelete(id);
    return Response.json({ message: "Blog deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
