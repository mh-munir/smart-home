import path from "path";

function sanitizeKey(k) {
  let out = String(k || "");
  // Normalize windows backslashes to forward slashes
  out = out.replace(/\\/g, "/");
  // Trim leading slash
  if (out.startsWith("/")) out = out.slice(1);
  // Remove any parent directory references to avoid traversal
  out = out
    .split("/")
    .filter((seg) => seg !== ".." && seg !== "")
    .join("/");
  // Keep URL-safe encoding
  return encodeURI(out);
}

async function tryCloudinaryUpload(buffer, key, contentType) {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return null;
  }

  try {
    const { uploadToCloudinary } = await import("./cloudinary.js");

    // Derive folder and filename from key
    const parts = key.split("/");
    const filename = parts.pop().replace(/\.[^.]+$/, "") || `upload-${Date.now()}`;
    const folder = parts.join("/") || "smart-home/misc";

    const result = await uploadToCloudinary(buffer, folder, filename, contentType);
    return { url: result.url, key: result.publicId };
  } catch (err) {
    return null;
  }
}

async function tryS3Upload(buffer, key, contentType) {
  if (!process.env.S3_BUCKET || !process.env.S3_REGION) return null;

  try {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    const s3Config = {
      region: process.env.S3_REGION,
    };

    if (process.env.S3_ENDPOINT) {
      s3Config.endpoint = process.env.S3_ENDPOINT;
      s3Config.forcePathStyle = true;
    }

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      s3Config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      };
    }

    const client = new S3Client(s3Config);

    const cleanKey = sanitizeKey(key);

    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType || "application/octet-stream",
      ACL: "public-read",
    });

    await client.send(cmd);

    // Construct public S3 URL. Support custom endpoint and regional host.
    let url;
    if (process.env.S3_ENDPOINT) {
      // Custom endpoint provided (e.g., DigitalOcean, MinIO)
      url = `${process.env.S3_ENDPOINT.replace(/\/$/, "")}/${cleanKey}`;
    } else {
      const bucket = process.env.S3_BUCKET;
      const region = process.env.S3_REGION;
      if (region === "us-east-1") {
        url = `https://${bucket}.s3.amazonaws.com/${cleanKey}`;
      } else {
        url = `https://${bucket}.s3.${region}.amazonaws.com/${cleanKey}`;
      }
    }

    return { url, key: cleanKey };
  } catch (err) {
    return null;
  }
}

export async function saveBufferToStorage(buffer, key, contentType) {
  // Ensure buffer is a Buffer or Uint8Array
  if (!buffer) throw new Error("No buffer provided to saveBufferToStorage");
  if (typeof buffer === "string") buffer = Buffer.from(buffer, "utf8");
  if (!Buffer.isBuffer(buffer) && !(buffer instanceof Uint8Array)) {
    throw new Error("saveBufferToStorage: buffer must be a Buffer or Uint8Array");
  }

  // Attempt server-side image optimization for uploaded images (when `sharp` is available)
  try {
    if (contentType && contentType.startsWith("image/") && !contentType.includes("gif")) {
      let sharpModule = null;
      try {
        // Use a dynamic require wrapped in eval to avoid bundlers statically
        // resolving the optional native dependency during client-side builds.
        if (typeof window === "undefined") {
          try {
            sharpModule = eval("require")("sharp");
          } catch {
            sharpModule = null;
          }
        } else {
          sharpModule = null;
        }
      } catch {
        sharpModule = null;
      }

      if (sharpModule) {
        try {
          const sharp = sharpModule.default || sharpModule;
          let img = sharp(buffer);
          const meta = await img.metadata();

          // Resize large images to max width for better LCP performance
          if (meta.width && meta.width > 1600) {
            img = img.resize({ width: 1600 });
          }

          // Compress according to original format
          const fmt = (meta.format || "").toLowerCase();
          if (fmt === "jpeg" || fmt === "jpg") {
            buffer = await img.jpeg({ quality: 82 }).toBuffer();
            contentType = "image/jpeg";
          } else if (fmt === "png") {
            buffer = await img.png({ compressionLevel: 8 }).toBuffer();
            contentType = "image/png";
          } else if (fmt === "webp") {
            buffer = await img.webp({ quality: 80 }).toBuffer();
            contentType = "image/webp";
          } else if (fmt === "avif") {
            buffer = await img.avif({ quality: 60 }).toBuffer();
            contentType = "image/avif";
          } else {
            // fallback: re-encode as-is
            buffer = await img.toBuffer();
          }
        } catch {
          // Image optimization not available — use original buffer
        }
      }
    }
  } catch {
    // Image processing skipped — continue with original buffer
  }

  // Try Cloudinary first (if configured)
  const cloudinaryResult = await tryCloudinaryUpload(buffer, key, contentType);
  if (cloudinaryResult) return cloudinaryResult;

  // Try S3 second (if configured)
  const s3Result = await tryS3Upload(buffer, key, contentType);
  if (s3Result) return s3Result;

  // If S3 or Cloudinary is explicitly forced, fail fast
  if (process.env.S3_FORCE_UPLOAD === "true") {
    throw new Error(
      "Cloudinary/S3 upload failed or not configured but S3_FORCE_UPLOAD=true"
    );
  }

  // In production, require Cloudinary or S3 to be configured — do not write to local `public`
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "No remote storage configured: uploads are disabled in production. Set CLOUDINARY_CLOUD_NAME or S3_BUCKET & S3_REGION."
    );
  }

  // Fallback (development/local): write to local public directory
  const fs = await import("fs/promises");
  const publicPath = path.join(process.cwd(), "public");
  const cleanKey = sanitizeKey(key);
  const fullPath = path.join(publicPath, cleanKey);
  const dir = path.dirname(fullPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(fullPath, buffer);

  return { url: `/${cleanKey}`, key: cleanKey };
}

const storage = { saveBufferToStorage };

export default storage;