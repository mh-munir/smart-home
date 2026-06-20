import { connectDB } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import Guide from "@/models/Guide";
import fs from "fs/promises";
import path from "path";
import { saveBufferToStorage } from "@/lib/storage";

function serializeGuide(guide) {
  return {
    _id: guide._id.toString(),
    title: guide.title,
    slug: guide.slug,
    content: guide.content || null,
    image: guide.image || null,
    images: guide.images || [],
    createdAt: guide.createdAt?.toISOString() || null,
    updatedAt: guide.updatedAt?.toISOString() || null,
  };
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const guide = await Guide.findById(id);
    if (!guide) return Response.json({ error: 'Guide not found' }, { status: 404 });
    return Response.json(serializeGuide(guide.toObject()));
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
            const filename = `guide-${id}-${Date.now()}-${i}.${ext}`;
            const key = `uploads/guides/${filename}`;
            const buffer = Buffer.from(base64Data, "base64");
            try {
              const res = await saveBufferToStorage(buffer, key, mime);
              processedImages.push(res.url);
            } catch {
              const uploadsDir = path.join(process.cwd(), "public", "uploads", "guides");
              await fs.mkdir(uploadsDir, { recursive: true });
              const filePath = path.join(uploadsDir, filename);
              await fs.writeFile(filePath, buffer);
              processedImages.push(`/uploads/guides/${filename}`);
            }
          }
        } else if (typeof img === "string" && img.trim()) {
          processedImages.push(img);
        }
      }
    }

    if (processedImages.length > 0) data.images = processedImages;

    const guide = await Guide.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    return Response.json(serializeGuide(guide.toObject()));
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
    await Guide.findByIdAndDelete(id);
    return Response.json({ message: 'Guide deleted' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
