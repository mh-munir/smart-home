import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import Blog from "@/models/Blog";
import fs from "fs/promises";
import path from "path";

function serializeBlog(blog) {
  return {
    _id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    content: blog.content || null,
    image: blog.image || null,
    images: blog.images || [],
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

    // If images are included as data URLs, save them to public/uploads/blogs
    const processedImages = [];
    if (Array.isArray(data.images)) {
      for (let i = 0; i < data.images.length && processedImages.length < 5; i++) {
        const img = data.images[i];
        if (typeof img === "string" && img.startsWith("data:")) {
          const match = img.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/);
          if (match) {
            const mime = match[1];
            const base64Data = match[2];
            const ext = mime.split("/")[1].split("+")[0] || "jpg";
            const uploadsDir = path.join(process.cwd(), "public", "uploads", "blogs");
            await fs.mkdir(uploadsDir, { recursive: true });
            const filename = `blog-${id}-${Date.now()}-${i}.${ext}`;
            const filePath = path.join(uploadsDir, filename);
            await fs.writeFile(filePath, Buffer.from(base64Data, "base64"));
            processedImages.push(`/uploads/blogs/${filename}`);
          }
        } else if (typeof img === "string" && img.trim()) {
          processedImages.push(img);
        }
      }
    }

    if (processedImages.length > 0) {
      data.images = processedImages;
    }

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
