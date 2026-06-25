import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
  const unauthorized = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, AVIF" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Upload directly to Cloudinary
    const result = await uploadToCloudinary(
      buffer,
      "smart-home/products",
      filename,
      file.type
    );

    return NextResponse.json({ url: result.url, publicId: result.publicId });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}